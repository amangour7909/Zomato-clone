from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from database import db
from models import User, MenuItem, Order
from bson.objectid import ObjectId  # Add this import
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = '4f1a7d886ad698f6487314fade583b563d21445f9cb31b5c480fd5b36896b852'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            # Check if token follows 'Bearer <token>' format
            if not token.startswith('Bearer '):
                return jsonify({'message': 'Invalid token format. Use Bearer <token>'}), 401
            
            token_value = token.split()[1]
            data = jwt.decode(token_value, app.config['SECRET_KEY'], algorithms=["HS256"])
            
            # Convert string ID to ObjectId for MongoDB query
            try:
                user_id = ObjectId(data['user_id'])
                current_user = db.users.find_one({'_id': user_id})
                if not current_user:
                    print(f"User not found for ID: {user_id}")  # Debug log
                    return jsonify({'message': 'User not found'}), 401
                    
                print(f"User authenticated: {current_user['email']}")  # Debug log
                
            except Exception as e:
                print(f"Error converting user_id: {str(e)}")  # Debug log
                return jsonify({'message': 'Invalid user ID format'}), 401
            
            return f(current_user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        except Exception as e:
            print(f"Token validation error: {str(e)}")  # Debug log
            return jsonify({'message': 'Token validation failed', 'error': str(e)}), 401
    return decorated

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'Email already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(data['username'], data['email'], hashed_password)
    db.users.insert_one(user.to_dict())
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    try:
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No request data provided'}), 400

        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400

        # Find user
        user = db.users.find_one({'email': data['email']})
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401

        # Verify password
        if not bcrypt.check_password_hash(user['password'], data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Generate token with str(ObjectId)
        token = jwt.encode({
            'user_id': str(user['_id']),  # Make sure this is a string
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        print(f"Generated token for user: {user['email']}")  # Debug log
        
        return jsonify({
            'token': token,
            'message': 'Login successful',
            'user': {
                'email': user['email'],
                'username': user['username']
            }
        }), 200

    except Exception as e:
        print(f"Signin error: {str(e)}")  # For debugging
        return jsonify({
            'message': 'An error occurred during signin',
            'error': str(e) if app.debug else None
        }), 500

@app.route('/api/menu', methods=['GET'])
def get_menu():
    category = request.args.get('category', 'All')
    if (category == 'All'):
        menu_items = list(db.menu_items.find({}, {'_id': 0}))
    else:
        menu_items = list(db.menu_items.find({'category': category}, {'_id': 0}))
    return jsonify(menu_items)

@app.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user):
    try:
        data = request.get_json()
        
        # Basic validation
        if not data or 'items' not in data or 'total_amount' not in data:
            return jsonify({'message': 'Missing required fields'}), 400
            
        # Create order
        try:
            order = Order(
                user_id=str(current_user['_id']),
                items=data['items'],
                total_amount=float(data['total_amount']),
                status=data.get('status', 'pending')
            )
            
            result = db.orders.insert_one(order.to_dict())
            
            if result.inserted_id:
                return jsonify({
                    'message': 'Order created successfully',
                    'order_id': str(result.inserted_id)
                }), 201
                
        except Exception as e:
            print(f"Error creating order: {str(e)}")
            return jsonify({'message': 'Invalid order data', 'error': str(e)}), 400
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    orders = list(db.orders.find({'user_id': str(current_user['_id'])}, {'_id': 0}))
    return jsonify(orders)

if __name__ == '__main__':
    app.run(debug=True)
