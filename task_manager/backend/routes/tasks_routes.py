from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.tasks_controller import create_task, get_my_tasks, delete_task

tasks_bp = Blueprint('tasks', __name__)

# The `@jwt_required()` is our middleware! It protects these endpoints.
# If a user tries to access these without sending a valid Token in the headers,
# Flask will automatically stop them and return a 401 Unauthorized error!

tasks_bp.route('/', methods=['POST'])(jwt_required()(create_task))
tasks_bp.route('/', methods=['GET'])(jwt_required()(get_my_tasks))
tasks_bp.route('/<task_id>', methods=['DELETE'])(jwt_required()(delete_task))
