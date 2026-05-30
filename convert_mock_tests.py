import json
import os

files_to_convert = [
    "PAPER 1/json-db/lessons/mocktest/all/tntet_paper1_model_8.json",
    "PAPER 1/json-db/lessons/mocktest/all/tntet_paper1_model_9.json"
]

def char_to_index(char):
    if char == 'A': return 0
    if char == 'B': return 1
    if char == 'C': return 2
    if char == 'D': return 3
    try:
        return int(char)
    except:
        return 0

for filepath in files_to_convert:
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Check if already converted
    if "lesson_meta" in data:
        print(f"Already converted: {filepath}")
        continue
        
    new_data = {
        "lesson_meta": {
            "title": "TNTET தாள் 1 - புதிய மாதிரி வினாத்தாள் " + ("5" if "8.json" in filepath else "6"),
            "unit": "All",
            "grade": "TET Paper 1",
            "term": "Model",
            "subject": "General",
            "code": "tntet_paper1_model_" + ("8" if "8.json" in filepath else "9")
        },
        "quiz": {
            "questions": []
        }
    }
    
    for section in data.get("sections", []):
        subject = section.get("subject", "")
        for q in section.get("questions", []):
            question_text = q.get("question", "")
            if subject and not question_text.startswith(f"[{subject}]"):
                question_text = f"[{subject}] {question_text}"
                
            options_dict = q.get("options", {})
            if isinstance(options_dict, dict):
                options_list = [
                    options_dict.get("A", ""),
                    options_dict.get("B", ""),
                    options_dict.get("C", ""),
                    options_dict.get("D", "")
                ]
            else:
                options_list = options_dict # Assuming it's already a list
                
            ans = q.get("answer", "")
            if isinstance(ans, str):
                ans_idx = char_to_index(ans.strip())
            else:
                ans_idx = ans
                
            new_q = {
                "question": question_text,
                "options": options_list,
                "answer": ans_idx,
                "explanation": q.get("explanation", "")
            }
            new_data["quiz"]["questions"].append(new_q)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully converted {filepath}")
