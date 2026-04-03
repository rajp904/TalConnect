from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import re
import requests
from io import BytesIO

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

# ---------------- IMPORTANT KEYWORDS ONLY ----------------
TECH_KEYWORDS = [
    "python","java","c++","javascript","react","node","express",
    "mongodb","sql","mysql","html","css","flask","django",
    "api","backend","frontend","git","github","docker",
    "aws","machine","learning","data","pandas","numpy"
]

# ---------------- SCORE ----------------
def calculate_score(resume_text, job_description):

    resume_text = resume_text.lower()
    job_description = job_description.lower()

    # only take relevant keywords from JD
    jd_keywords = [word for word in TECH_KEYWORDS if word in job_description]

    if len(jd_keywords) == 0:
        jd_keywords = TECH_KEYWORDS[:10]  # fallback

    keywords_data = []
    matched = 0

    for word in jd_keywords:
        if word in resume_text:
            present = True
            matched += 1
            percentage = 100
        else:
            present = False
            percentage = 0

        keywords_data.append({
            "keyword": word,
            "present": present,
            "percentage": percentage
        })

    score = int((matched / len(jd_keywords)) * 100) if jd_keywords else 0

    missing = [k["keyword"] for k in keywords_data if not k["present"]]

    return score, keywords_data, missing

# ---------------- /analyze ----------------
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        file = request.files.get('resume')
        job_description = request.form.get('job_description')

        name = request.form.get('userName', "Candidate")
        email = request.form.get('userEmail', "Not found")

        # ✅ CASE 1: file upload
        if file:
            text = extract_text_from_pdf(file)

        # ✅ CASE 2: URL (Cloudinary)
        else:
            import requests
            from io import BytesIO

            resume_url = request.form.get("resume")
            response = requests.get(resume_url)
            file_stream = BytesIO(response.content)

            text = extract_text_from_pdf(file_stream)

        score, _, _ = calculate_score(text, job_description)

        return jsonify({
            "Name": name,
            "Email": email,
            "matching_percent": score
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/evaluate', methods=['POST'])
def evaluate_resume():
    try:
        file = request.files.get('resume')
        job_description = request.form.get('job_description')

        # ✅ CASE 1: file upload
        if file:
            text = extract_text_from_pdf(file)

        # ✅ CASE 2: URL (Cloudinary)
        else:
            import requests
            from io import BytesIO

            resume_url = request.form.get("resume")
            response = requests.get(resume_url)
            file_stream = BytesIO(response.content)

            text = extract_text_from_pdf(file_stream)

        score, keywords_data, missing = calculate_score(text, job_description)

        ranking = "Good" if score > 70 else "Average" if score > 40 else "Poor"

        suggestions = []

        if len(missing) > 0:
            suggestions.append("Add these skills: " + ", ".join(missing[:5]))

        if score < 50:
            suggestions.append("Improve technical skills section")

        if not suggestions:
            suggestions.append("Resume looks good")

        return jsonify({
            "result": {
                "match_percentage": score,
                "ranking": ranking,
                "keywords": keywords_data,
                "suggestions": suggestions
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)