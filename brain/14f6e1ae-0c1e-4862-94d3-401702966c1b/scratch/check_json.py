import json
import sys

file_path = r"c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\mocktest\all\mock_test_4.json"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("JSON is valid.")
except json.JSONDecodeError as e:
    print(f"JSON is invalid: {e}")
    print(f"Error at line {e.lineno}, column {e.colno}")
    # Read the file and show the line
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        if 0 < e.lineno <= len(lines):
            print(f"Line {e.lineno}: {lines[e.lineno-1].strip()}")
except Exception as e:
    print(f"An error occurred: {e}")
