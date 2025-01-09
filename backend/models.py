from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "created_at": self.created_at
        }

class MenuItem:
    def __init__(self, name, price, category, image_url, description):
        self.name = name
        self.price = price
        self.category = category
        self.image_url = image_url
        self.description = description

    def to_dict(self):
        return {
            "name": self.name,
            "price": self.price,
            "category": self.category,
            "image_url": self.image_url,
            "description": self.description
        }

class Order:
    def __init__(self, user_id, items, total_amount, status="pending"):
        self.user_id = user_id
        self.items = items
        self.total_amount = total_amount
        self.status = status
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "items": self.items,
            "total_amount": self.total_amount,
            "status": self.status,
            "created_at": self.created_at
        }
