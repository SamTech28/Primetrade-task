from flask import request, jsonify
from config.db import users_collection
import bcrypt
from flask_jwt_extended import create_access_token
import datetime

def register_user():
    """Handle user registration: validate input, hash password, save to DB."""
    data = request.get_json()
    
    # 1. Basic Input Validation
    if not data or not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Please provide name, email, and password"}), 400
        
    # 2. Check if user already exists
    existing_user = users_collection.find_one({"email": data.get("email")})
    if existing_user:
        return jsonify({"message": "User with this email already exists!"}), 400
        
    # 3. Hash the password
    password_bytes = data.get("password").encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # 4. Create new user document
    new_user = {
        "name": data.get("name"),
        "email": data.get("email"),
        "password": hashed_password,
        "role": "user" # Default role
    }
    
    # 5. Save the user to the database
    users_collection.insert_one(new_user)
    
    return jsonify({"message": "User registered successfully!"}), 201


def login_user():
    """Handle user login: verify password, return JWT token."""
    data = request.get_json()
    
    # 1. Basic Input Validation
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Please provide email and password"}), 400
        
    # 2. Check if user exists in the database
    user = users_collection.find_one({"email": data.get("email")})
    if not user:
        return jsonify({"message": "Invalid email or password!"}), 401
        
    # 3. Check if password matches
    # We must convert the string password back to bytes to compare it
    entered_password_bytes = data.get("password").encode('utf-8')
    stored_hashed_password_bytes = user["password"].encode('utf-8')
    
    if not bcrypt.checkpw(entered_password_bytes, stored_hashed_password_bytes):
        return jsonify({"message": "Invalid email or password!"}), 401
        
    # 4. Generate a JWT Token (Digital ID Card)
    # We use their unique MongoDB _id as their Token Identity
    user_id_string = str(user["_id"])
    
    # Set the token to expire in 1 day
    expires = datetime.timedelta(days=1)
    access_token = create_access_token(identity=user_id_string, expires_delta=expires)
    
    # Return the token and user data (except the password!)
    return jsonify({
        "message": "Login successful!",
        "token": access_token,
        "user": {
            "id": user_id_string,
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200
