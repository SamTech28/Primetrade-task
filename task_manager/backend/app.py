from flask import Flask, jsonify
from routes.auth_routes import auth_bp
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure JWT Secret Key
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/v1/user')

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "API is running!"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
