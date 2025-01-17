from pymongo import MongoClient
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("python-dotenv not installed. Using default configuration.")

import os

class Database:
    def __init__(self):
        # Default to localhost if MONGODB_URI is not set
        # mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        # try:
        #     self.client = MongoClient(mongodb_uri)
        #     self.db = self.client['zomato_clone']
        #     self.users = self.db['users']
        #     self.menu_items = self.db['menu_items']
        #     self.orders = self.db['orders']
        # except Exception as e:
        #     print(f"Failed to connect to MongoDB: {e}")
        #     raise

        self.client = MongoClient("mongodb://localhost:27017")
        self.db = self.client.zomato_clone
        self.users = self.db['users']
        self.menu_items = self.db['menu_items']
        self.orders = self.db['orders']

    def init_db(self):
        # Create indexes
        self.users.create_index('email', unique=True)
        self.menu_items.create_index('name', unique=True)
        print("databse created")

db = Database()