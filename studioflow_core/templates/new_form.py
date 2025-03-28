import studioflow.forms as sf
from studioflow.tasks import send_task

# With StudioFlow Forms, it's easy to build user interfaces
name = sf.read("👋 Hello there! What is your name?")

# You can send tasks to the next stages of your workflow
send_task("greeting", {"name": name})

# Different kinds of input and output widgets are available
sf.display(f"🎉 Welcome, {name}!")

sf.display_markdown("Check out our [docs](https://abstra.io/docs/concepts/forms/) 📚")
