from django.apps import AppConfig


class KafkaProcessorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'kafka_processor'
