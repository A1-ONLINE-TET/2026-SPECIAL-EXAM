import json
import os

# Base directory
base_dir = r"c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\english\4"

def update_titles():
    files = [f for f in os.listdir(base_dir) if f.startswith("eng_4") and f.endswith(".json")]
    
    for filename in files:
        filepath = os.path.join(base_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                continue
        
        if "lesson_meta" in data and "title" in data["lesson_meta"]:
            old_title = data["lesson_meta"]["title"]
            
            # Extract English part if bilingual
            if "||" in old_title:
                new_title = old_title.split("||")[0].strip()
            else:
                new_title = old_title.strip()
            
            # Convert to Uppercase
            new_title = new_title.upper()
            
            data["lesson_meta"]["title"] = new_title
            print(f"Updated {filename} to uppercase title.")
            
            # Save updated JSON
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    update_titles()
