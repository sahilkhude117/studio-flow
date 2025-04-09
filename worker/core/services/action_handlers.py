

logger = logging.getLogger(__name__)

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
        return getattr(settings, 'OPENAI_API_KEY', 'your-api-key')
    

   
