import os

base_path = r"C:\Users\MATHAN\Desktop\A1_Tamil_Primary_Edition\json-db\lessons"
subjects_with_grades = ["english", "maths", "science", "social"]
subjects_flat = ["psychology", "mocktest", "revision", "notes_678"]

# Create subjects with grades and terms
for sub in subjects_with_grades:
    for grade in range(1, 6):
        for term in range(1, 4):
            path = os.path.join(base_path, sub, str(grade), f"Term {term}")
            os.makedirs(path, exist_ok=True)
            print(f"Created: {path}")

# Create flat subjects
for sub in subjects_flat:
    path = os.path.join(base_path, sub, "all")
    os.makedirs(path, exist_ok=True)
    print(f"Created: {path}")
