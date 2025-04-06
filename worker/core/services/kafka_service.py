from kafka import KafkaConsumer, TopicPartition
from kafka.structs import OffsetAndMetadata, TopicPartition
import logging

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

                # Simulate processing delay
                import time
                time.sleep(0.5)
                print("processing done")

                self.consumer.commit({
                    TopicPartition(self.topic_name, message.partition): OffsetAndMetadata(message.offset + 1, None, -1)
                })
        except Exception as e:
            logger.error(f"Failed to start the worker {str(e)}")

    def close(self):
        """Close the kafka consumer connection"""
        if self.consumer:
            self.consumer.close()
            logger.info("Kafka consumer connection closed")
