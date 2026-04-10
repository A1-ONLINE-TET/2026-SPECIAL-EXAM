
import json
import re

def parse_questions(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by double asterisk pattern for questions: **1. ...**
    # or just look for lines starting with **Number.
    questions_raw = re.split(r'\n\s*\*\*\s*(\d+)\.', content)
    
    parsed = []
    # The first element is usually a header, then pairs of (number, content)
    for i in range(1, len(questions_raw), 2):
        q_num = questions_raw[i]
        q_body = questions_raw[i+1]
        
        # Extract question text (until options)
        q_text_match = re.search(r'^(.*?)\s*\*\*', q_body, re.DOTALL)
        if not q_text_match:
            # Maybe options follow directly
            q_text_match = re.search(r'^(.*?)\s*[a-d]\)', q_body, re.DOTALL)
            
        q_text = f"{q_num}. {q_text_match.group(1).strip()}" if q_text_match else f"{q_num}. Unknown"
        
        # Extract options
        a = re.search(r'a\)\s*(.*?)\s*[b-d]\)', q_body)
        b = re.search(r'b\)\s*(.*?)\s*[c-d]\)', q_body)
        c = re.search(r'c\)\s*(.*?)\s*(d\)|$)', q_body)
        d = re.search(r'd\)\s*(.*?)\s*(\*\*|$)', q_body)
        
        options = [
            a.group(1).strip() if a else "",
            b.group(1).strip() if b else "",
            c.group(1).strip() if c else "",
            d.group(1).strip() if d else ""
        ]
        
        # Extract correct answer index and explanation
        ans_match = re.search(r'\*\*விடை:\*\*\s*([a-d])\)\s*(.*?)\s*\*\*விளக்கம்:\*\*\s*(.*?)(?=\n|$)', q_body)
        # For English parts
        if not ans_match:
            ans_match = re.search(r'\*\*Answer:\*\*\s*([a-d])\)\s*(.*?)\s*\*\*Explanation:\*\*\s*(.*?)(?=\n|$)', q_body)
            
        if ans_match:
            ans_letter = ans_match.group(1)
            ans_text = ans_match.group(2).strip()
            explanation = ans_match.group(3).strip()
            ans_idx = ord(ans_letter) - ord('a')
            
            # Full answer string for evaluation section
            full_answer = f"{ans_letter}) {ans_text} (விளக்கம்: {explanation})"
        else:
            # Fallback for simpler format
            ans_idx = 0
            full_answer = "Unknown"
            explanation = ""

        parsed.append({
            "question": q_text,
            "options": options,
            "answer_idx": ans_idx,
            "answer_full": full_answer,
            "explanation": explanation
        })
    
    return parsed

data1 = parse_questions(r'C:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\raw_questions_1.txt')
data2 = parse_questions(r'C:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\raw_questions_2.txt')
all_data = data1 + data2

# Now build the JSON structure
sections = []
subject_names = [
    "பகுதி 1: தமிழ் (1 - 30 வினாக்கள்)",
    "பகுதி 2: ஆங்கிலம் (31 - 60 வினாக்கள்)",
    "பகுதி 3: கணிதம் (61 - 90 வினாக்கள்)",
    "பகுதி 4: அறிவியல் (91 - 120 வினாக்கள்)",
    "பகுதி 5: சமூக அறிவியல் (121 - 150 வினாக்கள்)",
    "பகுதி 6: உளவியல் (151 - 180 வினாக்கள்)"
]

for i in range(6):
    start = i * 30
    end = (i + 1) * 30
    section_data = all_data[start:end]
    
    sections.append({
        "title": subject_names[i],
        "type": "evaluation",
        "evaluationData": {
            "mcqs": [
                {"question": q["question"], "answer": q["answer_full"]} for q in section_data
            ]
        }
    })

quiz = []
for q in all_data:
    quiz.append({
        "q": q["question"],
        "options": q["options"],
        "a": q["answer_idx"],
        "ex": q["explanation"]
    })

final_json = {
    "unit": "Special",
    "subject": "Revision",
    "class": "all",
    "title": "பாடக்குறிப்புகள் (180 வினாக்கள் தொகுப்பு)",
    "summary": "TET தேர்வுக்குத் தேவையான தமிழ், ஆங்கிலம், கணிதம், அறிவியல், சமூக அறிவியல் மற்றும் உளவியல் ஆகிய பகுதிகளில் இருந்து மிக முக்கியமான 180 வினாக்கள் மற்றும் விளக்கங்கள்.",
    "sections": sections,
    "quiz": quiz
}

with open(r'C:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\revision\all\rev_special_180.json', 'w', encoding='utf-8') as f:
    json.dump(final_json, f, ensure_ascii=False, indent=2)

print("Successfully updated rev_special_180.json")
