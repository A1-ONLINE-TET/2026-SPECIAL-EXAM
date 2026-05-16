import json
import os

def normalize_mock(input_file, output_code, output_title):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    new_questions = []
    
    # Map for answer conversion
    ans_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
    
    for section in data.get('sections', []):
        subject = section.get('subject', '')
        for q in section.get('questions', []):
            options_dict = q.get('options', {})
            options_list = [
                options_dict.get('A', ''),
                options_dict.get('B', ''),
                options_dict.get('C', ''),
                options_dict.get('D', '')
            ]
            
            # Clean options list if any are missing
            options_list = [o for o in options_list if o]
            
            ans_val = q.get('answer', '')
            if isinstance(ans_val, str):
                ans_idx = ans_map.get(ans_val.upper(), 0)
            else:
                # Handle cases where answer might already be an index or something else
                ans_idx = ans_val
            
            new_q = {
                "question": f"[{subject}] {q.get('question', '')}",
                "options": options_list,
                "answer": ans_idx,
                "explanation": q.get('explanation', '')
            }
            new_questions.append(new_q)
    
    output_data = {
        "lesson_meta": {
            "title": output_title,
            "unit": "All",
            "grade": "TET Paper 1",
            "term": "Model",
            "subject": "General",
            "code": output_code
        },
        "quiz": {
            "questions": new_questions
        }
    }
    
    output_path = os.path.join(os.path.dirname(input_file), f"{output_code}.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    # Use ascii representation for print to avoid Windows terminal encoding issues
    print(f"Normalized file saved to: {output_code}.json")

if __name__ == "__main__":
    base_dir = r"c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\mocktest\all"
    
    # Normalize model test 3
    normalize_mock(
        os.path.join(base_dir, "மாதிரி_வினாத்தாள்_3.json"),
        "tntet_paper1_model_6",
        "TNTET தாள் 1 - மாதிரி வினாத்தாள் 3"
    )
    
    # Normalize model test 4
    normalize_mock(
        os.path.join(base_dir, "மாதிரி_வினாத்தாள்_4.json"),
        "tntet_paper1_model_7",
        "TNTET தாள் 1 - மாதிரி வினாத்தாள் 4"
    )
