from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes to allow Next.js frontend to call the API
CORS(app)

# Check for required API keys
required_keys = ['OPENAI_API_KEY']
missing_keys = [key for key in required_keys if not os.getenv(key)]
if missing_keys:
    logger.error(f"Missing required API keys: {', '.join(missing_keys)}")
    logger.error("Please add them to your .env file")
    sys.exit(1)

# Import crew only after environment check to avoid early errors
try:
    from crew import legal_assistant_crew
    logger.info("Successfully imported CrewAI components")
except ImportError as e:
    logger.error(f"Failed to import CrewAI: {str(e)}")
    logger.error("Please ensure all dependencies are installed with: pip install -r requirements.txt")
    sys.exit(1)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to verify API is running"""
    return jsonify({"status": "ok", "message": "API is operational"})

@app.route('/analyze', methods=['POST'])
def analyze():
    """Main endpoint to analyze legal issues"""
    data = request.get_json()
    user_input = data.get('user_input', '')
    
    if not user_input.strip():
        return jsonify({'error': 'No input provided.'}), 400
    
    try:
        logger.info(f"Processing request: {user_input[:50]}...")
        result = legal_assistant_crew.kickoff(inputs={"user_input": user_input})
        return jsonify({'result': result if isinstance(result, str) else str(result)})
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': f"Error processing your request: {str(e)}"}), 500

@app.route('/ipc-sections', methods=['GET'])
def get_ipc_sections():
    """Endpoint to retrieve available IPC sections"""
    try:
        # Read sections from ipc.json
        ipc_json_path = Path(__file__).parent / 'ipc.json'
        if not ipc_json_path.exists():
            return jsonify({'error': 'IPC data not found'}), 404
            
        import json
        with open(ipc_json_path, 'r') as f:
            ipc_data = json.load(f)
            
        # Return summary of sections
        sections = []
        for section in ipc_data:
            sections.append({
                'section': section.get('section', ''),
                'title': section.get('title', '')
            })
            
        return jsonify({'sections': sections})
    except Exception as e:
        logger.error(f"Error retrieving IPC sections: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
