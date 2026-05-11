import json
import os

# Base directory
base_dir = r"c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\english\4"

def normalize_lesson(file_num):
    input_path = os.path.join(base_dir, f"{file_num}.json")
    output_path = os.path.join(base_dir, f"eng_4_t2_l{file_num}.json")
    
    if not os.path.exists(input_path):
        print(f"File {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Extract Title
    title = data.get("பாட_தலைப்பு") or data.get("title") or f"Lesson {file_num}"
    
    # 2. Construct Lesson Meta
    # Note: User said Term 2, so we override Term 1 if present
    lesson_meta = {
        "title": title,
        "grade": "4",
        "term": "2",
        "unit": str(file_num),
        "type": "Lesson",
        "language": "English",
        "code": f"eng_4_t2_l{file_num}"
    }

    # 3. Construct Material (Sections)
    material_sections = []
    
    # Handle 'பாடக்குறிப்புகள்' (Grade 4 English style)
    raw_material = data.get("பாடக்குறிப்புகள்") or data.get("study_material", {}).get("sections")
    if raw_material:
        if isinstance(raw_material, list):
            for item in raw_material:
                material_sections.append({
                    "title": item.get("தலைப்பு") or item.get("heading") or "Section",
                    "content": item.get("விவரங்கள்") or item.get("details") or "",
                    "type": "content"
                })
        elif isinstance(raw_material, dict):
            # If it's a dict like 1.json (summary, glossary, etc.)
            for key, val in raw_material.items():
                material_sections.append({
                    "title": key.replace("_", " ").capitalize(),
                    "content": val,
                    "type": "content"
                })
    
    # Add summary if present (like in 3.json)
    summary = data.get("study_material", {}).get("summary")
    if summary:
        material_sections.insert(0, {
            "title": "Summary",
            "content": summary,
            "type": "content"
        })

    # Add 'புத்தகப்_பின்பக்க_மதிப்பீட்டு_வினாக்கள்' (Book back questions) as a section
    book_back = data.get("புத்தகப்_பின்பக்க_மதிப்பீட்டு_வினாக்கள்") or data.get("புத்தக_மதிப்பீட்டு_வினாக்கள்")
    if book_back:
        if isinstance(book_back, list):
            for item in book_back:
                material_sections.append({
                    "title": item.get("தலைப்பு") or "Book Back Exercise",
                    "content": item.get("விவரங்கள்") or "",
                    "type": "content"
                })
        else:
            material_sections.append({
                "title": "Book Back Exercises",
                "content": book_back,
                "type": "content"
            })

    # 4. Construct Quiz (Questions)
    quiz_questions = []
    raw_quiz = data.get("வினாடி_வினா") or data.get("quiz") or data.get("வினா_விடை_பகுதி")
    if raw_quiz and isinstance(raw_quiz, list):
        for q in raw_quiz:
            # Map keys from Tamil or variations
            question_text = q.get("கேள்வி") or q.get("question")
            options = q.get("ஆப்ஷன்கள்") or q.get("options") or q.get("விருப்பங்கள்")
            answer_val = q.get("விடை") or q.get("answer")
            explanation = q.get("விளக்கம்") or q.get("explanation")
            
            # Find answer index if answer_val is string
            answer_idx = -1
            if isinstance(answer_val, int):
                answer_idx = answer_val
            elif isinstance(answer_val, str) and options:
                # Try to find string in options
                for idx, opt in enumerate(options):
                    if opt.strip().lower() == answer_val.strip().lower():
                        answer_idx = idx
                        break
                # Fallback: check if it's "A", "B", etc.
                if answer_idx == -1:
                    if answer_val.startswith("A"): answer_idx = 0
                    elif answer_val.startswith("B"): answer_idx = 1
                    elif answer_val.startswith("C"): answer_idx = 2
                    elif answer_val.startswith("D"): answer_idx = 3

            quiz_questions.append({
                "question": question_text,
                "options": options,
                "answer": answer_idx,
                "explanation": explanation
            })

    # Final Normalized Object
    normalized_data = {
        "lesson_meta": lesson_meta,
        "material": {
            "sections": material_sections
        },
        "quiz": {
            "questions": quiz_questions
        }
    }

    # Write back
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(normalized_data, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully normalized {output_path}")

# Run for all 6 files
for i in range(1, 7):
    normalize_lesson(i)

# Cleanup original files
for i in range(1, 7):
    temp_file = os.path.join(base_dir, f"{i}.json")
    if os.path.exists(temp_file):
        os.remove(temp_file)
        print(f"Removed temporary file {temp_file}")
