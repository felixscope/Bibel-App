#!/usr/bin/env python3
"""
Convert Numbers document to TypeScript files for Bible app.
Extracts verses, footnotes, and chapters from the Numbers document.
"""

import zipfile
import re
import json
import os
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import re
from collections import defaultdict

# Book name mapping (German -> ID)
# Note: CSV uses "1 Korinther" not "1. Korinther"
BOOK_MAPPING = {
    "Matthäus": "matthew",
    "Markus": "mark",
    "Lukas": "luke",
    "Johannes": "john",
    "Apostelgeschichte": "acts",
    "Römer": "romans",
    "1 Korinther": "1corinthians",
    "2 Korinther": "2corinthians",
    "Galater": "galatians",
    "Epheser": "ephesians",
    "Philipper": "philippians",
    "Kolosser": "colossians",
    "1 Thessalonicher": "1thessalonians",
    "2 Thessalonicher": "2thessalonians",
    "1 Timotheus": "1timothy",
    "2 Timotheus": "2timothy",
    "Titus": "titus",
    "Philemon": "philemon",
    "Hebräer": "hebrews",
    "Jakobus": "james",
    "1 Petrus": "1peter",
    "2 Petrus": "2peter",
    "1 Johannes": "1john",
    "2 Johannes": "2john",
    "3 Johannes": "3john",
    "Judas": "jude",
    "Offenbarung": "revelation",
}

# Book abbreviation mapping
ABBREV_MAPPING = {
    "matthew": "Mt",
    "mark": "Mk",
    "luke": "Lk",
    "john": "Joh",
    "acts": "Apg",
    "romans": "Röm",
    "1corinthians": "1. Kor",
    "2corinthians": "2. Kor",
    "galatians": "Gal",
    "ephesians": "Eph",
    "philippians": "Phil",
    "colossians": "Kol",
    "1thessalonians": "1. Thess",
    "2thessalonians": "2. Thess",
    "1timothy": "1. Tim",
    "2timothy": "2. Tim",
    "titus": "Tit",
    "philemon": "Phlm",
    "hebrews": "Hebr",
    "james": "Jak",
    "1peter": "1. Petr",
    "2peter": "2. Petr",
    "1john": "1. Joh",
    "2john": "2. Joh",
    "3john": "3. Joh",
    "jude": "Jud",
    "revelation": "Offb",
}


def extract_text_from_iwa(file_path: str) -> bytes:
    """Extract text content from .iwa file."""
    with open(file_path, 'rb') as f:
        return f.read()


def find_largest_datalist(extract_dir: str) -> Optional[str]:
    """Find the largest DataList file which likely contains the main table data."""
    datalist_files = list(Path(extract_dir).glob("**/DataList-*.iwa"))
    if not datalist_files:
        return None
    
    # Sort by size and return the largest
    largest = max(datalist_files, key=lambda p: p.stat().st_size)
    return str(largest)


def parse_table_data(content: bytes) -> List[List[str]]:
    """
    Parse table data from binary content.
    The .iwa files contain protobuf-compressed data, but we can try to extract
    readable text strings that contain the table data.
    """
    rows = []
    
    # Try to find UTF-8 strings in the content
    # Look for patterns that might be verse numbers, chapter numbers, etc.
    text = content.decode('utf-8', errors='ignore')
    
    # Try to find structured data patterns
    # This is a heuristic approach - we'll look for sequences that match our expected format
    
    # Split by common delimiters and look for structured rows
    # Numbers files often have text separated by tabs or special characters
    
    # Alternative: Look for the actual table structure
    # The data might be in a specific format we can parse
    
    return rows


def extract_csv_like_data(content: bytes) -> List[List[str]]:
    """
    Extract CSV-like data from the binary content.
    Numbers files sometimes contain readable text data.
    """
    rows = []
    
    # Decode with error handling
    try:
        text = content.decode('utf-8', errors='ignore')
    except:
        text = content.decode('latin-1', errors='ignore')
    
    # Look for patterns that indicate table rows
    # Try to find sequences of text that match verse patterns
    
    # Split into lines and look for structured data
    lines = text.split('\n')
    
    # Look for lines that contain verse-like patterns
    for line in lines:
        # Skip very short lines or binary data
        if len(line) < 5:
            continue
        
        # Look for patterns like verse numbers, chapter numbers
        # This is heuristic - we'll refine based on actual data structure
        
        # Check if line contains readable text (not just binary)
        if re.search(r'[a-zA-ZäöüÄÖÜß]{3,}', line):
            # Might be a data row
            pass
    
    return rows


def extract_table_rows_from_iwa(content: bytes) -> List[Dict]:
    """
    Extract table rows from .iwa file content.
    The file contains protobuf-compressed data with readable text strings.
    We'll extract strings and try to reconstruct the table structure.
    """
    rows = []
    
    # Decode as UTF-8 with error handling
    text = content.decode('utf-8', errors='ignore')
    
    # The data is likely stored in a structured format
    # We need to find patterns that indicate rows and columns
    
    # Strategy: Look for sequences that match our expected data structure
    # Book names, chapter numbers, verse numbers, verse text
    
    # Split by null bytes or other delimiters to find structured data
    # Numbers files often store data in a specific binary format
    
    # Try to find all occurrences of book names
    book_patterns = list(BOOK_MAPPING.keys())
    
    # Look for structured data around book names
    # This is heuristic - we'll refine based on actual structure
    
    # Alternative approach: Look for the actual table data structure
    # Numbers files store tables in a specific format
    
    # For now, we'll need to manually parse or use a different approach
    # Let's try to find CSV-like patterns or structured sequences
    
    return rows


def parse_numbers_file(numbers_path: str) -> List[Dict]:
    """
    Parse the Numbers file and extract table data.
    Returns a list of row dictionaries with columns A-G.
    """
    rows = []
    
    # Extract the Numbers file
    extract_dir = "temp_numbers_extract"
    if os.path.exists(extract_dir):
        import shutil
        shutil.rmtree(extract_dir)
    
    os.makedirs(extract_dir, exist_ok=True)
    
    print("Extracting Numbers file...")
    with zipfile.ZipFile(numbers_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    
    # Find the main data file
    main_data_file = find_largest_datalist(extract_dir)
    
    if not main_data_file:
        print("Error: Could not find main data file")
        return rows
    
    print(f"Found main data file: {main_data_file} ({os.path.getsize(main_data_file)} bytes)")
    
    # Read and parse the file
    content = extract_text_from_iwa(main_data_file)
    
    # Try to extract table rows
    rows = extract_table_rows_from_iwa(content)
    
    if not rows:
        print("Warning: Could not extract rows using standard method.")
        print("Attempting alternative parsing...")
        
        # Alternative: Try to read as structured binary data
        # Or try to find CSV-like patterns
        
        # For now, return empty - user may need to export as CSV first
        print("\nNote: If automatic parsing fails, please export the Numbers file as CSV")
        print("and we can parse that instead.")
    
    return rows


def process_rows_to_books(rows: List[Dict]) -> Tuple[Dict[str, Dict], Dict[str, str]]:
    """
    Process raw rows into structured book data.
    Groups by book and chapter, extracts verses and footnotes.
    Returns (books_dict, introductions_dict)
    """
    books = defaultdict(lambda: defaultdict(list))
    introductions = {}  # Store introductions for each book
    current_book = None
    current_chapter = None
    
    i = 0
    while i < len(rows):
        row = rows[i]
        
        # Column A: Book name
        book_name = row.get('A', '').strip()
        if book_name and book_name in BOOK_MAPPING:
            current_book = BOOK_MAPPING[book_name]
            current_chapter = None
        
        if not current_book:
            i += 1
            continue
        
        # Column D: Chapter number
        chapter_str = str(row.get('D', '')).strip()
        
        # Handle introduction (chapter 0)
        if chapter_str == '0':
            verse_text = str(row.get('F', '')).strip()
            if verse_text and not verse_text.startswith('*'):
                # Accumulate introduction text
                if current_book not in introductions:
                    introductions[current_book] = []
                introductions[current_book].append(verse_text)
            i += 1
            continue
        
        if not chapter_str.isdigit():
            i += 1
            continue
        
        current_chapter = int(chapter_str)
        
        # Column E: Verse number
        verse_str = str(row.get('E', '')).strip()
        if not verse_str or not verse_str.isdigit():
            i += 1
            continue
        
        verse_num = int(verse_str)
        
        # Column F: Verse text (may contain * or ** for footnotes)
        verse_text = str(row.get('F', '')).strip()
        
        # Count footnote markers at the end of the text
        footnote_count = 0
        if verse_text.endswith('*'):
            # Count trailing asterisks
            footnote_count = len(verse_text) - len(verse_text.rstrip('*'))
            # Remove markers from text
            verse_text = verse_text.rstrip('*').strip()
        
        # Column G: Footnote content (in following rows)
        footnotes = []
        if footnote_count > 0:
            for j in range(footnote_count):
                if i + 1 + j < len(rows):
                    next_row = rows[i + 1 + j]
                    # Check if this is a footnote row
                    # Column F should be '*' and Column G has content
                    next_f = str(next_row.get('F', '')).strip()
                    next_g = str(next_row.get('G', '')).strip()
                    
                    if next_f == '*' and next_g:
                        # Clean up footnote text (remove special markers like ℘)
                        footnote_text = next_g.replace('℘', '').strip()
                        # Remove "⇨Esyn: Synopse Nr. X" patterns
                        footnote_text = re.sub(r'⇨Esyn: Synopse Nr\. \d+', '', footnote_text).strip()
                        if footnote_text:
                            footnotes.append(footnote_text)
            
            # Skip footnote rows
            i += footnote_count
        
        # Convert / to / for line breaks
        # Replace any / that is not already surrounded by spaces with space-slash-space
        # Simple approach: replace all / with / and then clean up double spaces
        verse_text = verse_text.replace('/', ' / ')
        # Clean up any double spaces that might have been created
        verse_text = re.sub(r'  +', ' ', verse_text).strip()
        
        # Add verse to structure
        verse_data = {
            'number': verse_num,
            'text': verse_text,
            'footnotes': footnotes if footnotes else None
        }
        
        books[current_book][current_chapter].append(verse_data)
        
        i += 1
    
    # Combine introduction parts
    for book_id, intro_parts in introductions.items():
        introductions[book_id] = ' '.join(intro_parts)
    
    return books, introductions


def generate_typescript_file(book_id: str, book_name: str, book_data: Dict[int, List[Dict]], introduction: str, output_dir: str):
    """Generate a TypeScript file for a book."""
    
    short_name = ABBREV_MAPPING.get(book_id, book_name)
    
    # Build chapters array
    chapters_code = []
    for chapter_num in sorted(book_data.keys()):
        verses = book_data[chapter_num]
        verses_code = []
        
        for verse in verses:
            verse_obj = f"      {{ number: {verse['number']}, text: {json.dumps(verse['text'], ensure_ascii=False)}"
            
            # Add heading placeholder for first verse of chapter
            if verse['number'] == 1:
                verse_obj += ', heading: "TODO: Add heading"'
            
            # Add footnotes if present
            if verse.get('footnotes'):
                footnotes_json = json.dumps(verse['footnotes'], ensure_ascii=False)
                verse_obj += f", footnotes: {footnotes_json}"
            
            verse_obj += " }"
            verses_code.append(verse_obj)
        
        chapter_code = f"    {{ number: {chapter_num}, verses: [\n" + ",\n".join(verses_code) + "\n    ] }}"
        chapters_code.append(chapter_code)
    
    # Escape introduction text for JSON
    intro_json = json.dumps(introduction, ensure_ascii=False) if introduction else '""'
    
    # Generate full file content
    file_content = f'''import {{ Book }} from "@/lib/types";

export const {book_id}: Book = {{
  id: "{book_id}", name: "{book_name}", shortName: "{short_name}", testament: "new",
  introduction: {intro_json},
  chapters: [
{",\n".join(chapters_code)}
  ]
}};
'''
    
    # Write file
    output_path = os.path.join(output_dir, f"{book_id}.ts")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(file_content)
    
    print(f"Generated: {output_path}")


def parse_csv_file(csv_path: str) -> List[Dict]:
    """Parse a CSV file exported from Numbers."""
    import csv
    rows = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        # Use semicolon as delimiter (Numbers exports use semicolon for German locale)
        reader = csv.reader(f, delimiter=';')
        
        for row in reader:
            if len(row) < 6:
                continue
            
            # Columns: Book, Abbrev, ID, Chapter, Verse, Text, Footnote (optional)
            book = row[0].strip() if len(row) > 0 else ''
            abbrev = row[1].strip() if len(row) > 1 else ''
            book_id = row[2].strip() if len(row) > 2 else ''
            chapter = row[3].strip() if len(row) > 3 else ''
            verse = row[4].strip() if len(row) > 4 else ''
            text = row[5].strip() if len(row) > 5 else ''
            footnote = row[6].strip() if len(row) > 6 else ''
            
            # Skip introduction rows (chapter 0)
            if chapter == '0' or not chapter.isdigit():
                continue
            
            # Skip rows without book name
            if not book or book not in BOOK_MAPPING:
                continue
            
            row_dict = {
                'A': book,
                'B': abbrev,
                'C': book_id,
                'D': chapter,
                'E': verse,
                'F': text,
                'G': footnote,
            }
            rows.append(row_dict)
    
    return rows


def main():
    """Main conversion function."""
    numbers_file = "bibel NT.numbers"
    csv_file = "bibel NT_neu mit csv/Blatt 1-bibel NT.csv"  # CSV export
    
    rows = []
    
    # Try CSV first (easier to parse)
    if os.path.exists(csv_file):
        print(f"Found CSV file: {csv_file}")
        print("Parsing CSV file...")
        rows = parse_csv_file(csv_file)
        print(f"Extracted {len(rows)} rows from CSV")
    elif os.path.exists(numbers_file):
        print("Extracting and parsing Numbers file...")
        rows = parse_numbers_file(numbers_file)
        
        if not rows:
            print("\n" + "="*60)
            print("WARNING: Could not extract data from Numbers file.")
            print("Please export the Numbers file as CSV:")
            print("  1. Open 'bibel NT.numbers' in Numbers")
            print("  2. File > Export To > CSV...")
            print("  3. Save as 'bibel NT.csv' in the same directory")
            print("  4. Run this script again")
            print("="*60)
            return
    else:
        print(f"Error: Neither {numbers_file} nor {csv_file} found")
        return
    
    if not rows:
        print("Error: No rows extracted")
        return
    
    print(f"Processing {len(rows)} rows...")
    
    # Process rows into book structure
    books, introductions = process_rows_to_books(rows)
    
    # Generate TypeScript files
    output_dir = "temp_ts_output"
    os.makedirs(output_dir, exist_ok=True)
    
    for book_id, book_data in books.items():
        book_name = next((k for k, v in BOOK_MAPPING.items() if v == book_id), book_id)
        introduction = introductions.get(book_id, "")
        generate_typescript_file(book_id, book_name, book_data, introduction, output_dir)
    
    # Create ZIP file
    import shutil
    zip_path = "bibel-nt-converted.zip"
    if os.path.exists(zip_path):
        os.remove(zip_path)
    
    shutil.make_archive("bibel-nt-converted", 'zip', output_dir)
    print(f"\nCreated ZIP file: {zip_path}")
    
    # Cleanup
    shutil.rmtree(output_dir, ignore_errors=True)
    shutil.rmtree("temp_numbers_extract", ignore_errors=True)


if __name__ == "__main__":
    main()
