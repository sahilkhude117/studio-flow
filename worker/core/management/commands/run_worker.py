from django.core.management.base import BaseCommand
from core.services.kafka_service import KafkaService
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Run Kafka consumer worker'

    def handle(self, *args, **options):
        """Main command handler that runs the Kafka consumer"""
        self.stdout.write(self.style.SUCCESS('Starting Kafka consumer worker...'))
        
        service = KafkaService()
        if not service.connect():
            self.stdout.write(self.style.ERROR('Failed to connect to Kafka. Exiting....'))
            return
        
        try:
            service.start()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('Received interrupt signal. Shutting down...'))
        finally:
            service.close()