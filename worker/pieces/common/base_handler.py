from abc import ABC, abstractmethod
import logging

logger = logging.getLogger(__name__)

class BaseActionHandler(ABC):
    """ Base class for all action handlers """

    @abstractmethod
    def execute(self, action_metadata, flow_metadata, previous_results):
        """
        Execute the action with given metadata
        
        Args:
            action_metadata: Configuration specific to this action
            flow_metadata: Metadata from the flow run
            previous_results: Results from previously executed actions
            
        Returns:
            dict: Result of the action execution
        """
        pass

    def _process_template(self, template, variables):
        """Replace variables in the template with their values"""
        if not template:
            return ""
        
        result = template

        for key, value in variables.items():
            if isinstance(value, dict) and 'output' in value:
                placeholder = f"{{{{{key}}}}}"
                if placeholder in result:
                    result = result.replace(placeholder, str(value['output']))

                elif isinstance(value, str):
                    placeholder = f"{{{{{key}}}}}"
                if placeholder in result:
                    result = result.replace(placeholder, value)
          
        return result
