from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import re

app = Flask(__name__)
CORS(app)

# ---------------- PDF TEXT EXTRACT ----------------
def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + " "
    return text.lower()

# ---------------- EMAIL EXTRACT ----------------
def extract_email(text):
    match = re.search(r"[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+", text)
    return match.group() if match else "Not found"

# ---------------- NAME EXTRACT ----------------
def extract_name(text):
    lines = text.split("\n")
    for line in lines[:10]:
        line = line.strip()
        if len(line.split()) <= 4 and line.isalpha():
            return line.title()
    return "Candidate"

# ---------------- ATS SCORE ----------------
def calculate_score(resume_text, job_description):
    job_keywords = list(set(job_description.lower().split()))
    match_count = sum(1 for word in job_keywords if word in resume_text)

    if len(job_keywords) == 0:
        return 0

    return int((match_count / len(job_keywords)) * 100)

# ---------------- /analyze ----------------
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        file = request.files.get('resume')
        job_description = request.form.get('job_description')

        # ✅ USER DATA FROM FRONTEND
        name = request.form.get('userName', "Candidate")
        email = request.form.get('userEmail', "Not found")

        text = extract_text_from_pdf(file)

        score = calculate_score(text, job_description)

        return jsonify({
            "Name": name,
            "Email": email,
            "matching_percent": score
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- /evaluate ----------------
@app.route('/evaluate', methods=['POST'])
def evaluate_resume():
    try:
        file = request.files.get('resume')
        job_description = request.form.get('job_description')

        text = extract_text_from_pdf(file)

        score = calculate_score(text, job_description)

        ranking = "Good" if score > 70 else "Average" if score > 40 else "Poor"

        return jsonify({
            "result": {
                "match_percentage": score,
                "ranking": ranking,
                "keywords": [],
                "suggestions": ["Add more relevant keywords", "Improve formatting"]
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- RUN ----------------
if __name__ == '__main__':
    app.run(port=5001, debug=True)