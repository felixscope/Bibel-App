#!/usr/bin/env python3
"""
Einfaches Skript zum Korrigieren der Bible-Dateien.
Nutzt reguläre Ausdrücke anstatt Zeichenweise Verarbeitung.
"""

import os
import re
import sys


def fix_file(filepath: str) -> bool:
    """Korrigiert eine Datei. Gibt True zurück wenn geändert."""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    filename = os.path.basename(filepath)
    base_name = os.path.splitext(filename)[0]

    # 1. Alle Guillemets zurück zu normalen Quotes
    content = content.replace('«', '"').replace('»', '"')

    # 2. Export-Namen mit Zahlen korrigieren
    if base_name[0].isdigit():
        content = re.sub(
            rf'\bexport\s+const\s+{re.escape(base_name)}\b',
            f'export const _{base_name}',
            content
        )

    # 3. Innere Quotes in text: Strings ersetzen
    # Pattern: text: "...(quote)...(quote)..."
    # Wir suchen nach Mustern wie: "text "inner" text"
    # und ersetzen das mittlere "inner" durch «inner»

    def fix_inner_quotes_in_string(match):
        """Ersetzt innere Quotes in einem gematchten String."""
        full = match.group(0)
        prefix = match.group(1)  # text: oder ähnlich
        string_content = match.group(2)  # Inhalt ohne äußere Quotes

        # Finde Paare von inneren Quotes und ersetze sie
        # Pattern: "(text)" wobei text keine Zeilenumbrüche enthält
        def replace_inner(m):
            inner = m.group(1)
            # Nur ersetzen wenn es nicht am Ende ist (vor Komma oder Klammer)
            return f'«{inner}»'

        # Suche nach "..." Mustern im String-Inhalt
        # Aber nicht das letzte Quote, das den String beendet
        fixed_content = re.sub(r'"([^"]{1,200})"(?=[^,\]\}])', replace_inner, string_content)

        return f'{prefix}"{fixed_content}"'

    # Wende das Fixing auf text: Felder an
    # Dieses Pattern matcht: text: "..." (mit möglichem Inhalt der innere Quotes hat)
    content = re.sub(
        r'(text:\s*)"([^"]*(?:"[^"]*"[^"]*)*)"',
        fix_inner_quotes_in_string,
        content
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False


def main():
    base_dir = "/Users/felixschachtschneider/Documents/bibel-app/data/bibel"

    if len(sys.argv) > 1:
        base_dir = sys.argv[1]

    print(f"Verarbeite: {base_dir}")
    print("=" * 50)

    count = 0
    modified = 0

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next']]

        for filename in files:
            if not filename.endswith('.ts') or filename.endswith('.d.ts'):
                continue

            filepath = os.path.join(root, filename)

            if '/AT/' not in filepath and '/NT/' not in filepath:
                continue

            count += 1

            try:
                if fix_file(filepath):
                    modified += 1
                    print(f"OK: {filename}")
            except Exception as e:
                print(f"FEHLER: {filename} - {e}")

    print("=" * 50)
    print(f"Fertig: {count} Dateien, {modified} geändert")


if __name__ == "__main__":
    main()
