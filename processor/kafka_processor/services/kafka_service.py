from kafka import KafkaProducer
import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class KafkaService:
    def __init__(self):
        self.producer = None
        self.topic_name = 'flow-events'

    def connect(self):
        """Connect tp Kafka"""

        try: 
            self.producer = KafkaProducer(
                bootstrap_servers='localhost:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            logger.info("Successfully connected to Kafka")
            return True
        except Exception as e:
            logger.error(f'Failed to connect to Kafka: {str(e)}')
            return False
        
    def send_messages(self, messages):
        """Send batch of messages to Kafka topic"""

        if not self.producer:
            if not self.connect():
                return False
            
        try:
            futures = []
            for message in messages:
                value = {
                    'flowRunId': str(message.flowRunId.id),
                    'stage': 0
                }
                future = self.producer.send(self.topic_name, value)
                futures.append(future)

            for future in futures:
                future.get(timeout=10)

            logger.info(f'Successfully sent {len(messages)} messages to kafka')
            return True
        
        except Exception as e:
            logger.error(f'Failed to send messages to Kafka: {str(e)}')
            return False
        
    def close(self):
        """Close the kafka producer connection"""
        if self.producer:
            self.producer.close()
            logger.info("Kafka producer connection closed")