from kafka import KafkaConsumer
import json
import logging
import time
from django.conf import settings

logger = logging.getLogger(__name__)

class KafkaConsumerService:
    def __init__(self):
        self.consumer = None
        self.topic_name = settings.KAFKA_CONSUMER_CONFIG['TOPIC_NAME']
        self.group_id = settings.KAFKA_CONSUMER_CONFIG['GROUP_ID']
        self.brokers = settings.KAFKA_CONSUMER_CONFIG['BROKERS']
        self.from_beginning = settings.KAFKA_CONSUMER_CONFIG['FROM_BEGINNING']
        self.process_delay_ms = settings.KAFKA_CONSUMER_CONFIG['PROCESS_DELAY_MS']