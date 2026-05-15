import re
import os

file_path = r'c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\tamil\3\7.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def fix_line(line):
    # Match pattern: "key": "text"
    match = re.search(r'^(\s*".*?":\s*)(.*)(,?)$', line)
    if match:
        prefix = match.group(1) # e.g. '  "question": '
        middle = match.group(2) # the value part
        suffix = match.group(3) # e.g. ','
        
        # If middle starts and ends with quotes, it might have internal ones.
        if middle.startswith('"') and middle.endswith('"'):
            inner = middle[1:-1]
            # Unescape everything first
            inner = inner.replace('\\"', '"')
            # Escape all internal quotes
            inner = inner.replace('"', '\\"')
            return prefix + '"' + inner + '"' + suffix
    return line

lines = content.split('\n')
new_lines = [fix_line(l) for l in lines]
content = '\n'.join(new_lines)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
