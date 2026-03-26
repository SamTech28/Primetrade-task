import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the MongoDB URI from the .env file
MONGO_URI = os.getenv("MONGO_URI")

# Establish the connection to MongoDB
client = MongoClient(MONGO_URI)

# Select the database (it creates it automatically if it doesn't exist)
db = client["task_manager_db"]

# Define our collections (like tables in SQL)
users_collection = db["users"]
tasks_collection = db["tasks"]

print("✅ MongoDB Configuration Loaded!")
