import json
import re

input_file = "raw_model_test_2.txt"
output_file = "json-db/lessons/revision/all/model_test_2.json"

with open(input_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

sections = []
current_section = None
quiz = []

# Regex patterns
section_pattern = re.compile(r"பகுதி ([IV]+): (.+)")
question_start_pattern = re.compile(r"வினா (\d+):")

i = 0
while i < len(lines):
    line = lines[i].strip()
    
    if line.startswith("பகுதி"):
        match = section_pattern.search(line)
        if match:
            part_num = match.group(1)
            title_bn = match.group(2).strip()
            # The next line might be the English title, skip it
            if i + 1 < len(lines) and (lines[i+1].strip().isalpha() or "&" in lines[i+1]):
                i += 1
            
            current_section = {
                "title": f"பகுதி {part_num}: {title_bn}",
                "type": "evaluation",
                "evaluationData": {
                    "mcqs": []
                }
            }
            sections.append(current_section)
    
    elif question_start_pattern.match(line):
        q_num = question_start_pattern.match(line).group(1)
        i += 1
        q_text = lines[i].strip()
        
        # Next lines should be options
        options = []
        ans_idx = -1
        
        while i + 1 < len(lines) and (lines[i+1].strip().startswith("அ)") or lines[i+1].strip().startswith("ஆ)") or lines[i+1].strip().startswith("இ)") or lines[i+1].strip().startswith("ஈ)")):
            i += 1
            opt_line = lines[i].strip()
            
            opt_text = opt_line[3:].strip() # remove 'அ) ', 'ஆ) ' etc
            if "✓" in opt_text:
                ans_idx = len(options)
                opt_text = opt_text.replace("✓ (சரியான விடை)", "").strip()
                opt_text = opt_text.replace("✓", "").strip()
            
            options.append(opt_text)
            
        # Parse explanation
        ex_text = ""
        while i + 1 < len(lines) and (lines[i+1].strip().startswith("விளக்கம்:") or (not lines[i+1].strip().startswith("---") and not lines[i+1].strip().startswith("வினா") and not lines[i+1].strip().startswith("====="))) and len(lines[i+1].strip()) > 0:
            i += 1
            ex_line = lines[i].strip()
            if ex_line.startswith("விளக்கம்:"):
                ex_text += ex_line[len("விளக்கம்:"):].strip()
            else:
                ex_text += " " + ex_line
                
        ex_text = ex_text.strip()
        
        # Determine the alphabet mapping based on answer index
        alphabets = ["A", "B", "C", "D"]
        correct_alphabet = alphabets[ans_idx] if ans_idx != -1 else "A"
        
        # Build the mcq entry for section
        mcq = {
            "question": f"{q_num}. {q_text}",
            "answer": f"{correct_alphabet}) {options[ans_idx]} (விளக்கம்: {ex_text})"
        }
        
        if current_section:
            current_section["evaluationData"]["mcqs"].append(mcq)
            
        # Build quiz entry
        quiz_entry = {
            "q": f"{q_num}. {q_text}",
            "options": options,
            "a": ans_idx,
            "ex": ex_text
        }
        quiz.append(quiz_entry)
        
    i += 1

output_data = {
    "meta": {
        "title": "மாதிரித் தேர்வு 2 (150 வினாக்கள்)"
    },
    "unit": "Model Test",
    "subject": "Revision",
    "class": "all",
    "title": "TET மாதிரித் தேர்வு - 2",
    "summary": "TET தேர்வு - தாள் 1 மாதிரித்தேர்வு 2 (150 வினாக்கள் தொகுப்பு)",
    "totalQuestions": len(quiz),
    "sections": sections,
    "quiz": quiz
}

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"Successfully processed {len(quiz)} questions. Output saved to {output_file}")
