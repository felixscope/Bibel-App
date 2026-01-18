#!/usr/bin/env python3
"""
Direct parser for Numbers .iwa files.
Attempts to extract table data from the binary format.
"""

import zipfile
import re
import os
from pathlib import Path
from typing import List, Dict, Optional

# Book name mapping
BOOK_MAPPING = {
    "Matthäus": "matthew", "Markus": "mark", "Lukas": "luke", "Johannes": "john",
    "Apostelgeschichte": "acts", "Römer": "romans", "1. Korinther": "1corinthians",
    "2. Korinther": "2corinthians", "Galater": "galatians", "Epheser": "ephesians",
    "Philipper": "philippians", "Kolosser": "colossians", "1. Thessalonicher": "1thessalonians",
    "2. Thessalonicher": "2thessalonians", "1. Timotheus": "1timothy", "2. Timotheus": "2timothy",
    "Titus": "titus", "Philemon": "philemon", "Hebräer": "hebrews", "Jakobus": "james",
    "1. Petrus": "1peter", "2. Petrus": "2peter", "1. Johannes": "1john", "2. Johannes": "2john",
    "3. Johannes": "3john", "Judas": "jude", "Offenbarung": "revelation",
}

ABBREV_MAPPING = {
    "matthew": "Mt", "mark": "Mk", "luke": "Lk", "john": "Joh", "acts": "Apg",
    "romans": "Röm", "1corinthians": "1. Kor", "2corinthians": "2. Kor",
    "galatians": "Gal", "ephesians": "Eph", "philippians": "Phil", "colossians": "Kol",
    "1thessalonians": "1. Thess", "2thessalonians": "2. Thess", "1timothy": "1. Tim",
    "2timothy": "2. Tim", "titus": "Tit", "philemon": "Phlm", "hebrews": "Hebr",
    "james": "Jak", "1peter": "1. Petr", "2peter": "2. Petr", "1john": "1. Joh",
    "2john": "2. Joh", "3john": "3. Joh", "jude": "Jud", "revelation": "Offb",
}


def extract_strings_from_binary(content: bytes, min_length: int = 3) -> List[tuple]:
    """
    Extract readable strings from binary content.
    Returns list of (string, position) tuples.
    """
    strings = []
    text = content.decode('utf-8', errors='ignore')
    
    # Find all sequences of readable characters
    # Look for patterns that might be table data
    pattern = re.compile(r'[a-zA-ZäöüÄÖÜß0-9\s\.,;:!?\-\(\)\[\]"/\*]{' + str(min_length) + ',}')
    
    for match in pattern.finditer(text):
        strings.append((match.group(), match.start()))
    
    return strings


def find_table_structure(content: bytes) -> List[Dict]:
    """
    Attempt to find and parse table structure from binary content.
    This is heuristic and may not work perfectly for all Numbers files.
    """
    rows = []
    text = content.decode('utf-8', errors='ignore')
    
    # Strategy: Find book names and try to reconstruct rows around them
    # Look for patterns that indicate table rows
    
    # Find all book name positions
    book_positions = {}
    for book_name in BOOK_MAPPING.keys():
        positions = [m.start() for m in re.finditer(re.escape(book_name), text)]
        if positions:
            book_positions[book_name] = positions
    
    # Try to extract structured data around book positions
    # This is a simplified approach - in reality, Numbers files have complex structure
    
    # For now, return empty - we'll need a different approach
    # The best solution is to export as CSV or use numbers-parser library
    
    return rows


if __name__ == "__main__":
    # Test extraction
    extract_dir = "temp_numbers_extract"
    main_file = "temp_numbers_extract/Index/Tables/DataList-905026.iwa"
    
    if os.path.exists(main_file):
        with open(main_file, 'rb') as f:
            content = f.read()
        
        print(f"File size: {len(content)} bytes")
        strings = extract_strings_from_binary(content, min_length=10)
        print(f"Found {len(strings)} readable strings")
        
        # Look for book names
        text = content.decode('utf-8', errors='ignore')
        for book in ['Matthäus', 'Stammbaum']:
            if book in text:
                pos = text.find(book)
                print(f"\nFound '{book}' at position {pos}")
                # Show context
                start = max(0, pos - 200)
                end = min(len(text), pos + 500)
                print(f"Context: ...{text[start:end]}...")
