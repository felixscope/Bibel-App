#!/usr/bin/env python3
"""
Scrape the NeÜ (neue Evangelistische Übersetzung) from neue.derbibelvertrauen.de
and create TypeScript files in the same structure as Einheitsübersetzung.

Usage:
    python3 scrape_neue.py [book_id]  # Scrape specific book
    python3 scrape_neue.py --all-nt   # Scrape all New Testament books
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import sys
import re
from typing import List, Dict, Optional

# New Testament books mapping: book_id -> (url_suffix, german_name, short_name)
NT_BOOKS = {
    "matthew": ("mt.html", "Matthäus", "Mt"),
    "mark": ("mk.html", "Markus", "Mk"),
    "luke": ("lk.html", "Lukas", "Lk"),
    "john": ("jo.html", "Johannes", "Joh"),
    "acts": ("apg.html", "Apostelgeschichte", "Apg"),
    "romans": ("roe.html", "Römer", "Röm"),
    "1corinthians": ("1kor.html", "1. Korinther", "1Kor"),
    "2corinthians": ("2kor.html", "2. Korinther", "2Kor"),
    "galatians": ("gal.html", "Galater", "Gal"),
    "ephesians": ("eph.html", "Epheser", "Eph"),
    "philippians": ("phil.html", "Philipper", "Phil"),
    "colossians": ("kol.html", "Kolosser", "Kol"),
    "1thessalonians": ("1thes.html", "1. Thessalonicher", "1Thess"),
    "2thessalonians": ("2thes.html", "2. Thessalonicher", "2Thess"),
    "1timothy": ("1tim.html", "1. Timotheus", "1Tim"),
    "2timothy": ("2tim.html", "2. Timotheus", "2Tim"),
    "titus": ("tit.html", "Titus", "Tit"),
    "philemon": ("phm.html", "Philemon", "Phlm"),
    "hebrews": ("hebr.html", "Hebräer", "Hebr"),
    "james": ("jak.html", "Jakobus", "Jak"),
    "1peter": ("1pt.html", "1. Petrus", "1Petr"),
    "2peter": ("2pt.html", "2. Petrus", "2Petr"),
    "1john": ("1jo.html", "1. Johannes", "1Joh"),
    "2john": ("2jo.html", "2. Johannes", "2Joh"),
    "3john": ("3jo.html", "3. Johannes", "3Joh"),
    "jude": ("jud.html", "Judas", "Jud"),
    "revelation": ("off.html", "Offenbarung", "Offb"),
}

BASE_URL = "https://neue.derbibelvertrauen.de/"
OUTPUT_DIR = "data/bibel/Neue_Evangelistische_Uebersetzung/NT"

def fetch_html(url: str) -> BeautifulSoup:
    """Fetch and parse HTML from URL."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        response.encoding = 'utf-8'
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        sys.exit(1)

def clean_text(text: str) -> str:
    """Clean text by removing extra whitespace and normalizing."""
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', text)
    # Replace special quote characters with regular quotes
    text = text.replace('"', '"').replace('"', '"')
    text = text.replace(''', "'").replace(''', "'")
    # Strip leading/trailing whitespace
    return text.strip()

def extract_introduction(soup: BeautifulSoup) -> str:
    """Extract the introduction text from the book."""
    intro_parts = []

    # Check for special paragraphs before first chapter
    u0_texts = []
    for p in soup.find_all('p', class_='u0'):
        text = clean_text(p.get_text())
        if text and text not in u0_texts:  # Avoid duplicates
            u0_texts.append(text)
            intro_parts.append(text)

    # Find all <div class="e"> elements (introduction paragraphs)
    intro_divs = soup.find_all('div', class_='e')
    for div in intro_divs:
        text = clean_text(div.get_text())
        if text:
            intro_parts.append(text)

    for p in soup.find_all('p', class_='u1'):
        text = clean_text(p.get_text())
        if text:
            intro_parts.append(f"**{text}**")

    return "\n\n".join(intro_parts) if intro_parts else ""

def parse_footnote_ref(fn_text: str) -> Optional[tuple]:
    """Parse footnote reference like '1,17:' to extract chapter and verse."""
    match = re.match(r'^(\d+),(\d+):\s*(.+)$', fn_text, re.DOTALL)
    if match:
        chapter = int(match.group(1))
        verse = int(match.group(2))
        text = match.group(3)
        return (chapter, verse, text)
    return None

def scrape_book(book_id: str, url_suffix: str, german_name: str, short_name: str) -> Dict:
    """Scrape a single book from the NeÜ website."""
    url = BASE_URL + url_suffix
    print(f"\nScraping {german_name} ({book_id})...")
    print(f"URL: {url}")

    soup = fetch_html(url)

    # Extract introduction
    introduction = extract_introduction(soup)

    # Parse chapters and verses
    chapters = []
    current_chapter = None
    current_heading = ""
    verse_to_heading = {}  # Map (chapter, verse) -> heading

    # First pass: collect all footnotes
    footnotes_map = {}  # Map (chapter, verse) -> [footnote1, footnote2, ...]
    for fn_div in soup.find_all('div', class_='fn'):
        fn_text = clean_text(fn_div.get_text())
        parsed = parse_footnote_ref(fn_text)
        if parsed:
            chapter, verse, text = parsed
            key = (chapter, verse)
            if key not in footnotes_map:
                footnotes_map[key] = []
            footnotes_map[key].append(text)

    # Second pass: collect headings and associate with verses
    all_h4 = soup.find_all('h4')
    for h4 in all_h4:
        heading_text = clean_text(h4.get_text())
        if not heading_text:
            continue

        # Find the next verse span after this heading
        next_span = h4.find_next('span', class_='vers')
        if next_span and next_span.get('id'):
            verse_id = next_span.get('id')
            match = re.match(r'^(\d+)_(\d+)$', verse_id)
            if match:
                chapter_num = int(match.group(1))
                verse_num = int(match.group(2))
                verse_to_heading[(chapter_num, verse_num)] = heading_text

    # Also collect h2 and h3 headings for context
    h2_h3_headings = []
    for h2 in soup.find_all(['h2', 'h3']):
        text = clean_text(h2.get_text())
        if text and text not in ['', ' ']:
            h2_h3_headings.append(text)

    # Third pass: parse verses
    for span in soup.find_all('span', class_='vers'):
        verse_id = span.get('id')
        if not verse_id:
            continue

        # Parse verse ID (format: "1_1" for chapter 1, verse 1)
        match = re.match(r'^(\d+)_(\d+)$', verse_id)
        if not match:
            continue

        chapter_num = int(match.group(1))
        verse_num = int(match.group(2))

        # Create new chapter if needed
        if current_chapter is None or current_chapter['number'] != chapter_num:
            if current_chapter:
                chapters.append(current_chapter)
            current_chapter = {
                'number': chapter_num,
                'verses': []
            }

        # Get verse text (everything after the verse number span until next verse or end of paragraph)
        verse_text = ""
        next_node = span.next_sibling
        while next_node:
            if isinstance(next_node, str):
                verse_text += next_node
            elif next_node.name == 'span' and 'vers' in next_node.get('class', []):
                # Next verse found, stop
                break
            elif next_node.name == 'em':
                # Italic text in verse
                verse_text += next_node.get_text()
            elif next_node.name in ['a', 'b', 'i']:
                # Links and formatting in verse
                verse_text += next_node.get_text()
            elif next_node.name in ['p', 'div']:
                # New block, stop
                break
            else:
                text = next_node.get_text() if hasattr(next_node, 'get_text') else str(next_node)
                verse_text += text

            next_node = next_node.next_sibling

        verse_text = clean_text(verse_text)

        # Remove trailing asterisks (footnote markers)
        verse_text = re.sub(r'\*+$', '', verse_text).strip()

        # Get heading for this verse
        heading = verse_to_heading.get((chapter_num, verse_num), "")

        # Get footnotes for this verse
        footnotes = footnotes_map.get((chapter_num, verse_num), [])

        # Create verse object
        verse_obj = {
            'number': verse_num,
            'text': verse_text
        }

        # Add heading if present
        if heading:
            verse_obj['heading'] = heading

        # Add footnotes if present
        if footnotes:
            verse_obj['footnotes'] = footnotes

        current_chapter['verses'].append(verse_obj)

    # Add last chapter
    if current_chapter:
        chapters.append(current_chapter)

    # Build book object
    book = {
        'id': book_id,
        'name': german_name,
        'shortName': short_name,
        'testament': 'new',
        'introduction': introduction,
        'chapters': chapters
    }

    print(f"✓ Extracted {len(chapters)} chapters")
    return book

def escape_string(s: str) -> str:
    """Escape a string for TypeScript."""
    # Escape backslashes first
    s = s.replace('\\', '\\\\')
    # Escape double quotes
    s = s.replace('"', '\\"')
    # Escape backticks
    s = s.replace('`', '\\`')
    # Escape ${
    s = s.replace('${', '\\${')
    return s

def generate_typescript(book: Dict, output_path: str) -> None:
    """Generate TypeScript file from book data."""

    # Start building the TypeScript content
    # Add underscore prefix if book ID starts with a digit (for valid TypeScript identifiers)
    export_name = book["id"]
    if export_name[0].isdigit():
        export_name = '_' + export_name

    lines = [
        'import { Book } from "@/lib/types";',
        '',
        f'export const {export_name}: Book = {{',
        f'  id: "{book["id"]}", name: "{book["name"]}", shortName: "{book["shortName"]}", testament: "{book["testament"]}",',
    ]

    # Add introduction
    intro = escape_string(book['introduction'])
    lines.append(f'  introduction: `{intro}`,')

    # Add chapters
    lines.append('  chapters: [')

    for chapter in book['chapters']:
        lines.append(f'    {{ number: {chapter["number"]}, verses: [')

        for verse in chapter['verses']:
            verse_text = escape_string(verse['text'])

            # Build verse object
            verse_line = f'      {{ number: {verse["number"]}, text: "{verse_text}"'

            # Add heading if present
            if 'heading' in verse:
                heading = escape_string(verse['heading'])
                verse_line += f', heading: "{heading}"'

            # Add footnotes if present
            if 'footnotes' in verse:
                verse_line += ', footnotes: ['
                for i, footnote in enumerate(verse['footnotes']):
                    footnote = escape_string(footnote)
                    verse_line += f'"{footnote}"'
                    if i < len(verse['footnotes']) - 1:
                        verse_line += ', '
                verse_line += ']'

            verse_line += ' },'
            lines.append(verse_line)

        lines.append('    ] },')

    lines.append('  ]')
    lines.append('};')

    # Write to file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f"✓ Written to {output_path}")

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 scrape_neue.py [book_id]   # Scrape specific book")
        print("  python3 scrape_neue.py --all-nt    # Scrape all NT books")
        print("\nAvailable book IDs:")
        for book_id in NT_BOOKS.keys():
            print(f"  - {book_id}")
        sys.exit(1)

    if sys.argv[1] == '--all-nt':
        print("Scraping all New Testament books...")
        for book_id, (url_suffix, german_name, short_name) in NT_BOOKS.items():
            try:
                book_data = scrape_book(book_id, url_suffix, german_name, short_name)
                output_path = os.path.join(OUTPUT_DIR, f"{book_id}.ts")
                generate_typescript(book_data, output_path)
            except Exception as e:
                print(f"✗ Error scraping {book_id}: {e}")
                import traceback
                traceback.print_exc()
    else:
        book_id = sys.argv[1]
        if book_id not in NT_BOOKS:
            print(f"Error: Unknown book ID '{book_id}'")
            print("Available book IDs:")
            for bid in NT_BOOKS.keys():
                print(f"  - {bid}")
            sys.exit(1)

        url_suffix, german_name, short_name = NT_BOOKS[book_id]
        book_data = scrape_book(book_id, url_suffix, german_name, short_name)
        output_path = os.path.join(OUTPUT_DIR, f"{book_id}.ts")
        generate_typescript(book_data, output_path)

    print("\n✓ Done!")

if __name__ == "__main__":
    main()
