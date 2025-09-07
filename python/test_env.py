# test_env.py
import os
from dotenv import load_dotenv

print("Starting environment test...")
load_dotenv()
print("Environment loaded")

env_vars = [
    "GROQ_API_KEY", 
    "OPENAI_API_KEY", 
    "TAVILY_API_KEY", 
    "IPC_JSON_PATH", 
    "PERSIST_DIRECTORY_PATH", 
    "IPC_COLLECTION_NAME"
]

for var in env_vars:
    value = os.getenv(var)
    print(f"{var}: {value}")

print("Test complete")