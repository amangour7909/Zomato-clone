from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from database import db
from models import User, MenuItem, Order
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
            data = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.users.find_one({'_id': data['user_id']})
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
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

        # Generate token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
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
        
        if not data or 'items' not in data or 'total_amount' not in data:
            return jsonify({'message': 'Invalid order data'}), 400

        order = Order(
            user_id=str(current_user['_id']),
            items=data['items'],
            total_amount=data['total_amount'],
            delivery_fee=data.get('delivery_fee', 0),
            payment_details=data.get('payment_details', {}),
            status="confirmed" if data.get('payment_details', {}).get('payment_status') == 'completed' else "pending"
        )
        
        result = db.orders.insert_one(order.to_dict())
        
        if result.inserted_id:
            return jsonify({
                'message': 'Order created successfully',
                'order_id': str(result.inserted_id)
            }), 201
        else:
            return jsonify({'message': 'Failed to create order'}), 500
            
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        return jsonify({'message': 'An error occurred while creating the order'}), 500

@app.route('/api/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    orders = list(db.orders.find({'user_id': str(current_user['_id'])}, {'_id': 0}))
    return jsonify(orders)

if __name__ == '__main__':
    app.run(debug=True)
