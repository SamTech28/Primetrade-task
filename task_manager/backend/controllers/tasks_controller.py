from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from config.db import tasks_collection
from bson.objectid import ObjectId
import datetime

def create_task():
    """Create a new task linked to the logged-in user"""
    # Because this route will be protected by JWT, we can automatically extract the user ID
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("title"):
        return jsonify({"message": "Task title is required"}), 400
        
    new_task = {
        "title": data.get("title"),
        "description": data.get("description", ""),
        "createdBy": current_user_id, # Link the task to the user who created it
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    
    result = tasks_collection.insert_one(new_task)
    
    return jsonify({"message": "Task created successfully!", "task_id": str(result.inserted_id)}), 201


def get_my_tasks():
    """Fetch all tasks that belong exclusively to the logged-in user"""
    current_user_id = get_jwt_identity()
    
    # Query the database for tasks where createdBy matches the current user
    tasks_cursor = tasks_collection.find({"createdBy": current_user_id})
    tasks_list = []
    
    for task in tasks_cursor:
        task["_id"] = str(task["_id"]) # Convert MongoDB ObjectId to string for JSON parsing
        tasks_list.append(task)
        
    return jsonify({"tasks": tasks_list}), 200


def delete_task(task_id):
    """Delete a specific task (only if you own it)"""
    current_user_id = get_jwt_identity()
    
    # We must check TWO things: The task ID matches, AND the creator matches!
    # If a user tries to delete someone else's task, this will fail safely.
    try:
        result = tasks_collection.delete_one({
            "_id": ObjectId(task_id),
            "createdBy": current_user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({"message": "Task not found, or you are not authorized to delete it!"}), 404
            
        return jsonify({"message": "Task deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"message": "Invalid Task ID formatting"}), 400
