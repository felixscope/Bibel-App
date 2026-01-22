#!/usr/bin/env python3
"""
Analyze the HTML structure of neue.derbibelvertrauen.de to understand how to scrape it.
"""

import requests
from bs4 import BeautifulSoup
import sys

def analyze_html_structure(url):
    """Fetch and analyze the HTML structure of a Bible book page."""
    print(f"Fetching: {url}")
    print("=" * 80)

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        response.encoding = 'utf-8'
    except Exception as e:
        print(f"Error fetching URL: {e}")
        sys.exit(1)

    soup = BeautifulSoup(response.text, 'html.parser')

    # Save raw HTML for inspection
    with open('raw_html_sample.html', 'w', encoding='utf-8') as f:
        f.write(response.text[:10000])  # First 10k chars
    print("✓ Saved first 10k chars to raw_html_sample.html\n")

    # Analyze structure
    print("📋 OVERALL STRUCTURE")
    print("-" * 80)

    # Find main content area
    main_content = soup.find('body')
    if main_content:
        print(f"Body found: {len(str(main_content))} chars")

    # Look for different heading levels
    for level in ['h1', 'h2', 'h3', 'h4', 'h5']:
        headings = soup.find_all(level)
        if headings:
            print(f"\n{level.upper()} headings ({len(headings)} found):")
            for h in headings[:3]:  # Show first 3
                print(f"  - {h.get_text(strip=True)[:80]}")

    # Look for paragraphs
    print(f"\n\nPARAGRAPHS")
    print("-" * 80)
    paragraphs = soup.find_all('p')
    print(f"Found {len(paragraphs)} <p> tags")
    if paragraphs:
        print("First 3 paragraphs:")
        for p in paragraphs[:3]:
            text = p.get_text(strip=True)
            print(f"  - {text[:100]}")
            print(f"    Classes: {p.get('class', [])}")
            print(f"    ID: {p.get('id', 'none')}")

    # Look for divs with classes
    print(f"\n\nDIV ELEMENTS")
    print("-" * 80)
    divs = soup.find_all('div')
    print(f"Found {len(divs)} <div> tags")

    # Get unique classes
    classes = set()
    for div in divs:
        div_classes = div.get('class', [])
        classes.update(div_classes)

    print(f"Unique div classes: {sorted(classes)}")

    # Look for spans
    print(f"\n\nSPAN ELEMENTS")
    print("-" * 80)
    spans = soup.find_all('span')
    print(f"Found {len(spans)} <span> tags")

    span_classes = set()
    for span in spans:
        span_classes.update(span.get('class', []))

    print(f"Unique span classes: {sorted(span_classes)}")

    # Show some sample spans
    if spans:
        print("\nFirst 5 spans:")
        for span in spans[:5]:
            print(f"  - Text: {span.get_text(strip=True)[:60]}")
            print(f"    Class: {span.get('class', [])}")
            print(f"    ID: {span.get('id', 'none')}")

    # Look for links (footnotes might be links)
    print(f"\n\nLINKS")
    print("-" * 80)
    links = soup.find_all('a')
    print(f"Found {len(links)} <a> tags")
    if links:
        print("First 5 links:")
        for a in links[:5]:
            print(f"  - Text: {a.get_text(strip=True)[:60]}")
            print(f"    Href: {a.get('href', 'none')}")
            print(f"    Class: {a.get('class', [])}")

    # Look for any elements with "verse", "chapter", "footnote" in class/id
    print(f"\n\nELEMENTS WITH VERSE/CHAPTER/FOOTNOTE KEYWORDS")
    print("-" * 80)
    keywords = ['vers', 'chapter', 'kapitel', 'footnote', 'fussnote', 'note']
    for keyword in keywords:
        elements = soup.find_all(class_=lambda x: x and keyword in x.lower())
        if elements:
            print(f"\nElements with '{keyword}' in class ({len(elements)} found):")
            for elem in elements[:3]:
                print(f"  - Tag: {elem.name}, Class: {elem.get('class')}")
                print(f"    Text: {elem.get_text(strip=True)[:80]}")

    # Check for any custom data attributes
    print(f"\n\nCUSTOM DATA ATTRIBUTES")
    print("-" * 80)
    all_elements = soup.find_all(True)
    data_attrs = set()
    for elem in all_elements:
        for attr in elem.attrs:
            if attr.startswith('data-'):
                data_attrs.add(attr)

    if data_attrs:
        print(f"Found custom data attributes: {sorted(data_attrs)}")
    else:
        print("No custom data attributes found")

    print("\n" + "=" * 80)
    print("✓ Analysis complete!")

if __name__ == "__main__":
    # Start with Matthew (Matthäus)
    url = "https://neue.derbibelvertrauen.de/mt.html"
    analyze_html_structure(url)
