import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import engine  # Import your model processing module

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static/uploads/')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # Max upload size: 10 MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/assessment', methods=['POST'])
def assessment():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            # Assuming `engine.engine()` returns JSON-compatible data with assessment and location details
            result = engine.engine(filepath)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file format"}), 400

@app.route('/uploads/<filename>')
def send_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(port=3001)  # Flask server runs on port 3001
