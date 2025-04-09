from kafka import KafkaConsumer
from kafka.structs import OffsetAndMetadata, TopicPartition
import logging
import json
from django.db import transaction
from database.models import FlowRun, Action, Flow
import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

logger = logging.getLogger(__name__)

class KafkaService:
    def __init__(self, topic_name="flow-events", group_id="main-worker", bootstrap_servers=["localhost:9092"]):
        self.topic_name = topic_name
        self.group_id = group_id
        self.bootstrap_servers = bootstrap_servers
        self.consumer = None


    def connect(self):
        """Connect tp Kafka"""

        try: 
            self.consumer = KafkaConsumer(
                bootstrap_servers=self.bootstrap_servers,
                group_id=self.group_id,
                auto_offset_reset='earliest',
                enable_auto_commit=False,
                value_deserializer=lambda m: m.decode('utf-8')
            )
            self.consumer.subscribe([self.topic_name])
            logger.info("Successfully connected to Kafka")
            return True
        except Exception as e:
            logger.error(f'Failed to connect to Kafka: {str(e)}')
            return False

    def start(self):
        print(f"Listening to topic: {self.topic_name}")

        if not self.consumer:
            self.connect()

        try:
            for message in self.consumer:
                print({
                    "partition": message.partition,
                    "offset": message.offset,
                    "value": message.value
                })


                message_data = json.loads(message.value)
                    # Access the 'flowRunId' from the parsed dictionary
                flow_run_id = message_data.get('flowRunId', None)   

                if flow_run_id:
                    logger.info(f"Processing flow run: {flow_run_id}")
                    success = self.process_flow_run(flow_run_id)
                    if success:
                        print(f"Successfully processed flow run: {flow_run_id}")
                    else:
                        logger.error(f"Failed to process flow run: {flow_run_id}")
                else:
                    logger.warning("Received message without flowRunId")

                # Have to do processing

                self.consumer.commit({
                    TopicPartition(self.topic_name, message.partition): OffsetAndMetadata(message.offset + 1, None, -1)
                })
        except Exception as e:
            logger.error(f"Failed to start the worker {str(e)}")


    def process_flow_run(self, flow_run_id):
        """Process a flow run by executing all associated actions in order"""
        try:
            # First verify the ID format
            try:
                # If flow_run_id is a string, convert it to UUID
                if isinstance(flow_run_id, str):
                    import uuid
                    flow_run_id = uuid.UUID(flow_run_id)
                logger.info(f"Processing flow run with ID: {flow_run_id}")
            except ValueError:
                logger.error(f"Invalid UUID format for flow_run_id: {flow_run_id}")
                return False

            # Try to get the flow run without transaction first for debugging
            try:
                flow_run = FlowRun.objects.get(id=flow_run_id)
                logger.info(f"Found FlowRun: {flow_run}")
            except FlowRun.DoesNotExist:
                logger.error(f"FlowRun with ID {flow_run_id} does not exist")
                return False
            except Exception as e:
                logger.error(f"Error retrieving FlowRun: {str(e)}")
                return False

            # Now proceed with the transaction
            with transaction.atomic():
                # Get the flow run with related objects
                flow_run = FlowRun.objects.select_related('flowId').get(id=flow_run_id)
                logger.info(f"Retrieved FlowRun with related Flow")
                
                # Get the flow
                flow = flow_run.flowId
                logger.info(f"Using Flow with ID: {flow.id}")
                
                # Get all actions, logging the count
                actions = Action.objects.filter(flowId=flow).order_by('sortingOrder')
                logger.info(f"Found {actions.count()} actions to process")
                
                # Initialize flow execution results
                execution_results = {}
                
                # Process each action in order
                for i, action in enumerate(actions):
                    logger.info(f"Processing action {i+1}/{actions.count()}: {action.id}")
                    result = self.execute_action(action, flow_run, execution_results)
                    execution_results[f"action_{action.id}"] = result
                    logger.info(f"Action {action.id} completed with status: {result.get('status', 'unknown')}")
                
                # Update flow run with results
                logger.info("Updating flow run with execution results")
                flow_run.metadata['execution_results'] = execution_results
                flow_run.metadata['status'] = 'completed'
                flow_run.save()
                logger.info(f"Flow run {flow_run_id} successfully processed")
                
                # Try to remove from outbox if it exists
                try:
                    outbox = getattr(flow_run, 'flowRunOutbox', None)
                    if outbox:
                        outbox.delete()
                        logger.info(f"Removed flow run {flow_run_id} from outbox")
                except Exception as e:
                    logger.warning(f"Could not remove from outbox: {str(e)}")
                
                return True
        except Exception as e:
            logger.error(f"Error processing flow run {flow_run_id}: {str(e)}", exc_info=True)
            return False
    
    def execute_action(self, action: Action, flow_run: FlowRun, previous_results):
        """Execute a specific action with the given metadata"""
        action_type = action.actionId.name
        metadata = action.metadata

        logger.info(f"Executing action: {action_type} with ID {action.id}")
        

        if action_type == 'chatgpt':
            handler = ChatGPTHandler()
            result = handler.execute(metadata, flow_run.metadata, previous_results)
            return result
        elif action_type == 'sendgrid':
            handler = SendGridHandler()
            result = handler.execute(metadata, flow_run.metadata, previous_results)
            return result
        else:
            logger.warning(f"Unsupported action type: {action_type}")
            result = {
                'status': 'error',
                'message': f'Unsupported action type: {action_type}'
            }

    def close(self):
        """Close the kafka consumer connection"""
        if self.consumer:
            self.consumer.close()
            logger.info("Kafka consumer connection closed")


class ChatGPTHandler:
    def execute(self, action_metadata, flow_metadata, previous_results):
        """Execute chatgpt action"""
        try:
            prompt = action_metadata.get('prompt','')
            model = action_metadata.get('model', 'gpt-3.5-turbo')
            temperature = float(action_metadata.get('temperature', 0.7))
            output_variable = action_metadata.get('outputVariable', 'processed_content')
       

            processed_prompt = self._process_template(prompt, previous_results)

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self._get_openai_api_key()}"
            }

            payload = {
                "model": model,
                "messages": [{"role": "user", "content": processed_prompt}],
                "temperature": temperature
            }

            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                data=json.dumps(payload)
            )

            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']

                return {
                    'status': 'success',
                    'output': content,
                    'output_variable': output_variable
                }
            else:
                logger.error(f"ChatGPT API error: {response.text}")
                return {
                    'status': 'error',
                    'message': f"API error: {response.status_code}"
                }
        except Exception as e:
            logger.error(f"Error in ChatGPT action: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def _process_template(self, template, variables):
        """Replace variables in the template with their values"""
        result = template

        for key, value in variables.items():
            if isinstance(value, dict) and 'output' in value:
                result = result.replace(f"{{{{{key}}}}}", value['output'])
            elif isinstance(value, str):
                result = result.replace(f"{{{{{key}}}}}", value)

        return result
    
    def _get_openai_api_key(self):
        """Get openai api"""
        from django.conf import settings
        return getattr(settings, 'OPENAI_API_KEY',)
    

class SendGridHandler:
    def execute(self, action_metadata, flow_metadata, previous_results):
        """Execute Sendgrid email action"""

        try:
            api_key = action_metadata.get('apiKey', '')
            from_email = action_metadata.get('fromEmail', '')
            to_email = action_metadata.get('toEmail', '')
            subject = action_metadata.get('subject', '')
            template_id = action_metadata.get('templateId', '')
            
            subject = self._process_template(subject, previous_results)
            
            # Prepare dynamic template data based on previous action results
            template_data = {}
            for key, value in previous_results.items():
                if isinstance(value, dict) and 'output' in value and value.get('output_variable'):
                    template_data[value.get('output_variable')] = value['output']

            message = Mail(
                from_email=Email(from_email),
                to_emails=To(to_email),
                subject=subject
            )

            if template_id and template_id != '':
                message.template_id = template_id
                message.dynamic_template_data = template_data
            else:
                # Create plain text content if no template
                content_text = "This is an automated email from your workflow automation app."
                message.content = Content("text/plain", content_text)


            sg = SendGridAPIClient(api_key)
            response = sg.send(message)

            if response.status_code in [200, 201, 202]:
                return {
                    'status': 'success',
                    'message': f"Email sent successfully to {to_email}"
                }
            else:
                logger.error(f"Sendgrid API error: {response.status_code}")
                return {
                    'status': 'error',
                    'message': f"API error: {response.status_code}"
                }
            
        except Exception as e:
            logger.error(f"Error in Sendgrid action: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def _process_template(self, template, variables):
        """Replace variables in the template with their values"""
        result = template
        
        for key, value in variables.items():
            if isinstance(value, dict) and 'output' in value:
                result = result.replace(f"{{{{{key}}}}}", value['output'])
            elif isinstance(value, str):
                result = result.replace(f"{{{{{key}}}}}", value)
                
        return result
 