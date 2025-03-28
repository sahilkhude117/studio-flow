import studioflow.hooks as sh
from studioflow.tasks import send_task

# Use studioflow Hooks to create Python endpoints
body, query, headers = sh.get_request()

print("⚙️ Hook is running... received body:", body)

# Also send tasks to the next stages of your workflow
send_task("received-request", {"body": body})

# You can send a response back to the client after doing some processing
sh.send_json({"message": "A message from the hook!"})
