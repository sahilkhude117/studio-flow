from django.core.management.base import BaseCommand
from database.models import FlowRunOutbox
from kafka_processor.services.kafka_service import KafkaService
from django.conf import settings
import time
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Process outbox records and send them to Kafka'

    def handle(self, *args, **options):
        """Main command handler that runs the outbox processor"""
        self.stdout.write(self.style.SUCCESS("Starting outbox processor..."))

        kafka_service = KafkaService()
        if not kafka_service.connect():
            self.stdout.write(self.style.ERROR('Failed to connect to Kafka. Exiting....'))
            return
        
        try:
            self._process_loop(kafka_service)
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('Received interrupt signal. Shutting down...'))
        finally:
            kafka_service.close()

    def _process_loop(self, kafka_service:KafkaService):
        """Main processing loop that runs continuously"""
        batch_size = 1
        poll_interval = 3

        while True:
            #Find pending outbox records
            pending_records = FlowRunOutbox.objects.all()[:batch_size]
            self.stdout.write(f'Found {pending_records} records to process')
            count = len(pending_records)

            if count > 0:
                self.stdout.write(f'Found {count} records to process')

                # send to kafka
                if kafka_service.send_messages(pending_records):
                    ids_to_delete = [record.id for record in pending_records]

                    deletion_count, _ = FlowRunOutbox.objects.filter(id__in=ids_to_delete).delete()
                    self.stdout.write(self.style.SUCCESS(f"Deleted {deletion_count} processed records"))
                else:
                    self.stdout.write(self.style.ERROR("Failed to send messages to Kafka. Will retry."))
            else:
                self.stdout.write("No pending records found")


            time.sleep(3)