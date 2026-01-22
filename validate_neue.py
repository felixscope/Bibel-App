#!/usr/bin/env python3
"""
Validate the scraped NeÜ TypeScript files.
"""

import os
import re
import sys

OUTPUT_DIR = "data/bibel/Neue_Evangelistische_Uebersetzung/NT"

# Expected books
EXPECTED_BOOKS = [
    "matthew", "mark", "luke", "john", "acts",
    "romans", "1corinthians", "2corinthians", "galatians", "ephesians",
    "philippians", "colossians", "1thessalonians", "2thessalonians",
    "1timothy", "2timothy", "titus", "philemon",
    "hebrews", "james", "1peter", "2peter",
    "1john", "2john", "3john", "jude", "revelation"
]

def validate_file(filepath: str) -> tuple[bool, list]:
    """Validate a single TypeScript file."""
    errors = []

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False, [f"Could not read file: {e}"]

    # Check for import statement
    if 'import { Book } from "@/lib/types";' not in content:
        errors.append("Missing import statement")

    # Check for export statement
    book_name = os.path.splitext(os.path.basename(filepath))[0]
    export_pattern = f'export const {book_name}: Book = {{'
    if export_pattern not in content:
        errors.append(f"Missing or incorrect export statement (expected: {export_pattern})")

    # Check for required fields
    required_fields = ['id:', 'name:', 'shortName:', 'testament:', 'introduction:', 'chapters:']
    for field in required_fields:
        if field not in content:
            errors.append(f"Missing required field: {field}")

    # Check that testament is "new"
    if 'testament: "new"' not in content:
        errors.append('Testament should be "new"')

    # Check for proper structure
    if 'chapters: [' not in content:
        errors.append("Missing chapters array")

    # Count chapters
    chapter_matches = re.findall(r'{ number: (\d+), verses:', content)
    if not chapter_matches:
        errors.append("No chapters found")
    else:
        num_chapters = len(chapter_matches)
        print(f"    Chapters: {num_chapters}")

    # Count verses
    verse_matches = re.findall(r'{ number: \d+, text:', content)
    num_verses = len(verse_matches)
    print(f"    Verses: {num_verses}")

    # Check for headings
    heading_matches = re.findall(r'heading:', content)
    if heading_matches:
        print(f"    Headings: {len(heading_matches)}")

    # Check for footnotes
    footnote_matches = re.findall(r'footnotes:', content)
    if footnote_matches:
        print(f"    Footnotes: {len(footnote_matches)}")

    return len(errors) == 0, errors

def main():
    print("Validating NeÜ TypeScript files...")
    print("=" * 80)

    all_valid = True
    missing_books = []

    for book in EXPECTED_BOOKS:
        filepath = os.path.join(OUTPUT_DIR, f"{book}.ts")

        if not os.path.exists(filepath):
            missing_books.append(book)
            print(f"✗ {book}: FILE MISSING")
            all_valid = False
            continue

        print(f"\n{book}:")
        valid, errors = validate_file(filepath)

        if valid:
            print(f"  ✓ Valid")
        else:
            print(f"  ✗ Errors found:")
            for error in errors:
                print(f"    - {error}")
            all_valid = False

    print("\n" + "=" * 80)
    if all_valid:
        print("✓ All files are valid!")
    else:
        print("✗ Some files have errors")
        if missing_books:
            print(f"Missing books: {', '.join(missing_books)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
