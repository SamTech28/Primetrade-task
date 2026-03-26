from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """Basic health check endpoint to verify our API is running"""
    return jsonify({
        "status": "success",
        "message": "Welcome to the Task Manager API!"
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
