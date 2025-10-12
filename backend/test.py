import os
from dotenv import load_dotenv
load_dotenv()
print("HF_TOKEN =", os.getenv("HUGGINGFACE_API_KEY"))
