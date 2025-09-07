from flask import Flask, jsonify
from flask_cors import CORS
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to verify API is running"""
    return jsonify({"status": "ok", "message": "API is operational"})

@app.route('/analyze', methods=['POST'])
def analyze():
    """Main endpoint to analyze legal issues - currently returns mock data"""
    return jsonify({
        'result': """# Legal Analysis

## Case Summary
Your issue involves a potential criminal offense related to theft or fraud.

## Relevant IPC Sections
- **Section 378:** Theft - Whoever intends to take dishonestly any movable property out of the possession of any person without that person's consent commits theft.
- **Section 415:** Cheating - Whoever by deceiving any person fraudulently or dishonestly induces the person so deceived to deliver any property commits cheating.

## Legal Precedents
1. **State vs. Ramesh Kumar (2018)** - Supreme Court held that intent to permanently deprive is essential in theft cases.
2. **Amarnath vs. State of Maharashtra (2019)** - Establishing clear evidence of deception is crucial for cheating charges.

## Recommended Legal Document
**First Information Report (FIR)**

This is a sample FIR draft that could be filed at your local police station:

TO,
The Station House Officer,
[Local] Police Station

Subject: Complaint regarding theft/fraud

I, [Your Name], resident of [Your Address], wish to report the following incident:

[Detailed description of the incident with dates, times, and persons involved]

The above acts constitute offenses under Section 378 and 415 of the Indian Penal Code.

I request you to register an FIR and take appropriate action.

Date: [Current Date]
Place: [Current Place]
Signature: [Your Signature]

## Next Steps
1. File the FIR at your nearest police station
2. Gather all supporting evidence including communications, receipts, and witness statements
3. Consider consulting a criminal lawyer specializing in property crimes
"""
    })

@app.route('/ipc-sections', methods=['GET'])
def get_ipc_sections():
    """Endpoint to retrieve available IPC sections - returns mock data"""
    sections = [
        {"section": "Section 120A", "title": "Definition of criminal conspiracy"},
        {"section": "Section 299", "title": "Culpable homicide"},
        {"section": "Section 300", "title": "Murder"},
        {"section": "Section 319", "title": "Hurt"},
        {"section": "Section 320", "title": "Grievous hurt"},
        {"section": "Section 351", "title": "Assault"},
        {"section": "Section 378", "title": "Theft"},
        {"section": "Section 383", "title": "Extortion"},
        {"section": "Section 391", "title": "Dacoity"},
        {"section": "Section 405", "title": "Criminal breach of trust"},
        {"section": "Section 415", "title": "Cheating"},
        {"section": "Section 441", "title": "Criminal trespass"},
        {"section": "Section 499", "title": "Defamation"}
    ]
    return jsonify({'sections': sections})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting simplified Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)

