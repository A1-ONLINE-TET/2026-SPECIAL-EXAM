#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix Quiz Keys - Automatic JSON Fixer
தானாக quiz keys-ஐ சரிசெய்யும் script

Usage:
    python fix_quiz_keys.py --lessons /path/to/lessons/folder
"""

import json
import os
import sys
import argparse
from pathlib import Path
from typing import Dict, Any


class QuizKeyFixer:
    """Fix missing quiz keys in lesson JSON files"""
    
    def __init__(self, lessons_dir: str):
        self.lessons_dir = Path(lessons_dir)
        self.fixed_count = 0
        self.error_count = 0
        self.processed_files = []
    
    def fix_json_file(self, json_path: Path) -> bool:
        """Fix a single JSON file"""
        try:
            # Read JSON
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            modified = False
            
            # Fix 1: பயிற்சிகள் → Add questions & தேர்வு_வினாக்கள்
            if "பயிற்சிகள்" in data and "questions" not in data:
                data["questions"] = data["பயிற்சிகள்"]
                modified = True
                print(f"  ✓ Added 'questions' key")
            
            if "பயிற்சிகள்" in data and "தேர்வு_வினாக்கள்" not in data:
                data["தேர்வு_வினாக்கள்"] = data["பயிற்சிகள்"]
                modified = True
                print(f"  ✓ Added 'தேர்வு_வினாக்கள்' key")
            
            # Fix 2: தேவளி → Add quiz key if needed
            if "தேவளி" in data:
                # தேவளி is test info, keep it
                pass
            
            # Fix 3: If has questions array but no quiz wrapper
            if "questions" in data and isinstance(data["questions"], list):
                if "quiz" not in data:
                    data["quiz"] = {"questions": data["questions"]}
                    modified = True
                    print(f"  ✓ Added 'quiz' wrapper")
            
            # Save if modified
            if modified:
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                print(f"✅ Fixed: {json_path.name}")
                self.fixed_count += 1
                self.processed_files.append(str(json_path))
                return True
            else:
                print(f"⏭️  Skipped: {json_path.name} (no changes needed)")
                return False
                
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in {json_path.name}: {e}")
            self.error_count += 1
            return False
        except Exception as e:
            print(f"❌ Error processing {json_path.name}: {e}")
            self.error_count += 1
            return False
    
    def process_directory(self, recursive: bool = True) -> None:
        """Process all JSON files in directory"""
        pattern = "**/*.json" if recursive else "*.json"
        json_files = list(self.lessons_dir.glob(pattern))
        
        if not json_files:
            print(f"⚠️  No JSON files found in {self.lessons_dir}")
            return
        
        print(f"\n📁 Found {len(json_files)} JSON file(s)")
        print(f"📂 Directory: {self.lessons_dir}\n")
        
        for idx, json_file in enumerate(json_files, 1):
            print(f"[{idx}/{len(json_files)}] {json_file.name}")
            self.fix_json_file(json_file)
            print()
    
    def print_summary(self):
        """Print summary"""
        print("\n" + "="*60)
        print("SUMMARY / சுருக்கம்")
        print("="*60 + "\n")
        
        print(f"✅ Fixed files: {self.fixed_count}")
        print(f"❌ Errors: {self.error_count}")
        
        if self.processed_files:
            print(f"\n📄 Modified files:")
            for f in self.processed_files:
                print(f"   • {f}")
        
        print("\n" + "="*60 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='Fix missing quiz keys in lesson JSON files',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        '--lessons', '-l',
        required=True,
        help='Path to lessons directory'
    )
    
    parser.add_argument(
        '--recursive', '-r',
        action='store_true',
        help='Process subdirectories recursively'
    )
    
    args = parser.parse_args()
    
    lessons_path = Path(args.lessons)
    if not lessons_path.exists():
        print(f"❌ Error: Directory not found: {args.lessons}")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("Quiz Keys Auto-Fixer")
    print("தானாக quiz keys சரிசெய்யும் கருவி")
    print("="*60)
    
    fixer = QuizKeyFixer(args.lessons)
    fixer.process_directory(args.recursive)
    fixer.print_summary()


if __name__ == '__main__':
    main()
