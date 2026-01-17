#!/usr/bin/env python3
"""
Finales Korrektur-Skript für Bible-Dateien.
Konvertiert alle Guillemets zu Quotes und escaped dann innere Quotes.
"""

import os
import re
import sys


def fix_file(filepath: str) -> bool:
    """Korrigiert eine Datei."""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    filename = os.path.basename(filepath)
    base_name = os.path.splitext(filename)[0]

    # 1. ALLE Guillemets zu normalen Quotes
    content = content.replace('«', '"').replace('»', '"')

    # 2. Export-Namen mit Zahlen korrigieren
    if base_name[0].isdigit():
        content = re.sub(
            rf'\bexport\s+const\s+{re.escape(base_name)}\b',
            f'export const _{base_name}',
            content
        )

    # 3. Escape innere Quotes mit Backslash
    # In TypeScript/JavaScript kann man " innerhalb von "..." mit \" escapen

    # Finde alle String-Werte und escape innere Quotes
    def escape_inner_quotes(match):
        """Escaped innere Quotes in einem String."""
        prefix = match.group(1)  # z.B. "text: " oder "introduction: "
        content = match.group(2)  # String-Inhalt ohne äußere Quotes

        # Suche nach Mustern: "...(quote)...(quote)..."
        # Ersetze innere " durch \"
        # Aber: Nicht ersetzen wenn es das letzte Quote ist

        # Zähle Quotes
        quotes = content.count('"')

        if quotes == 0:
            return f'{prefix}"{content}"'

        # Wenn ungerade Anzahl an Quotes, ist etwas falsch
        # Wir versuchen trotzdem zu fixen

        # Ersetze alle " durch \"
        escaped = content.replace('"', '\\"')

        return f'{prefix}"{escaped}"'

    # Anwenden auf introduction: Felder (lange Strings)
    content = re.sub(
        r'(introduction:\s*)"([^"]*(?:"[^"]*)*)"(?=,?\s*(?:chapters:|$|\n))',
        escape_inner_quotes,
        content,
        flags=re.MULTILINE
    )

    # Anwenden auf text: Felder
    content = re.sub(
        r'(text:\s*)"([^"]*(?:"[^"]*)*)"(?=,?\s*(?:footnotes:|heading:|\}|$))',
        escape_inner_quotes,
        content
    )

    # Anwenden auf heading: Felder
    content = re.sub(
        r'(heading:\s*)"([^"]*(?:"[^"]*)*)"(?=,?\s*(?:footnotes:|\}|$))',
        escape_inner_quotes,
        content
    )

    # Anwenden auf footnotes Array-Elemente
    def fix_footnotes_array(match):
        array_content = match.group(1)
        # Finde alle Strings im Array und escape ihre inneren Quotes
        def fix_string(m):
            s = m.group(1)
            # Bereits escaped? Nicht nochmal escapen
            if '\\"' in s:
                return f'"{s}"'
            return f'"{s.replace(chr(34), chr(92)+chr(34))}"'

        fixed = re.sub(r'"([^"]*)"', fix_string, array_content)
        return f'footnotes: [{fixed}]'

    content = re.sub(
        r'footnotes:\s*\[([^\]]*)\]',
        fix_footnotes_array,
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
            except Exception as e:
                print(f"FEHLER: {filename} - {e}")

    print(f"Fertig: {count} Dateien, {modified} geändert")


if __name__ == "__main__":
    main()
