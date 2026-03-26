from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from config.db import users_collection
from bson.objectid import ObjectId

def admin_required(fn):
    """
    Custom decorator to check if the logged-in user has the 'admin' role.
    This must be used AFTER @jwt_required().
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # get_jwt_identity() gives us the user ID stored inside the token
        current_user_id = get_jwt_identity()
        
        # Query MongoDB for this user
        user = users_collection.find_one({"_id": ObjectId(current_user_id)})
        
        # Check if they exist and are an admin
        if not user or user.get("role") != "admin":
            return jsonify({"message": "Access Denied: Admins only!"}), 403
            
        return fn(*args, **kwargs)
    return wrapper
