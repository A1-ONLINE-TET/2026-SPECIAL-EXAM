import json
import re

file_path = r"c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\mocktest\all\mock_test_4.json"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

has_changed = False
count = 0

questions = data.get('quiz', [])
for i, q in enumerate(questions):
    options = q.get('options', [])
    answer_idx = q.get('answer')
    
    if answer_idx is None or answer_idx >= len(options):
        continue
        
    # Check for English in parentheses: (English)
    # A distinct answer is one that has (Eng) while others don't, or vice-versa.
    def has_parens_eng(s):
        return bool(re.search(r'\([a-zA-Z\s]+\)', str(s)))

    paren_status = [has_parens_eng(opt) for opt in options]
    
    # If not all same
    if len(set(paren_status)) > 1:
        # Check if the answer is the "odd one out"
        is_odd = True
        for j, status in enumerate(paren_status):
            if j != answer_idx and status == paren_status[answer_idx]:
                is_odd = False # Someone else has the same status
                break
        
        if is_odd:
            print(f"Question {i+1} is odd. Options: {options}. Answer: {answer_idx}")
            # Fix: Remove the parentheses content from the answer OR all options
            # User wants them to be same. Removing is safer to make them uniform if we don't have translations for others.
            current_ans = options[answer_idx]
            new_ans = re.sub(r'\s*\([a-zA-Z\s]+\)', '', current_ans).strip()
            options[answer_idx] = new_ans
            has_changed = True
            count += 1

if has_changed:
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Fixed {count} questions.")
else:
    print("No odd questions found.")
