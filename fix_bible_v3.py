#!/usr/bin/env python3
"""
Korrigiert alle Bible TypeScript-Dateien - Version 3
Behandelt komplexere Fälle mit verschachtelten Quotes.
"""

import os
import re
import sys


def process_file(filepath: str) -> bool:
    """Verarbeitet eine einzelne Datei. Gibt True zurück wenn geändert."""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    filename = os.path.basename(filepath)
    base_name = os.path.splitext(filename)[0]

    # 1. Alle Guillemets zu normalen Quotes zurücksetzen
    content = content.replace('«', '"').replace('»', '"')

    # 2. Export-Namen korrigieren (1chronicles -> _1chronicles)
    if base_name[0].isdigit():
        content = re.sub(
            rf'\bexport\s+const\s+{re.escape(base_name)}\b',
            f'export const _{base_name}',
            content
        )

    # 3. Zeilen einzeln verarbeiten
    lines = content.split('\n')
    fixed_lines = []

    for line in lines:
        fixed_line = fix_line(line)
        fixed_lines.append(fixed_line)

    content = '\n'.join(fixed_lines)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False


def fix_line(line: str) -> str:
    """
    Korrigiert eine Zeile.
    Ersetzt innere Quotes in text: und footnotes: Feldern.
    """
    # Kein text: oder footnotes: in der Zeile? Nichts zu tun.
    if 'text:' not in line and 'footnotes:' not in line:
        return line

    result = []
    i = 0

    while i < len(line):
        # Suche nach text: " oder footnotes: ["
        text_match = line[i:i+6] == 'text: '
        footnotes_match = line[i:i+12] == 'footnotes: ['

        if text_match:
            result.append('text: ')
            i += 6

            # Überspringe Whitespace
            while i < len(line) and line[i] in ' \t':
                result.append(line[i])
                i += 1

            if i < len(line) and line[i] == '"':
                # Verarbeite den text-String
                processed, new_i = process_text_string(line, i)
                result.append(processed)
                i = new_i
            continue

        if footnotes_match:
            result.append('footnotes: [')
            i += 12

            # Verarbeite das footnotes-Array
            processed, new_i = process_footnotes_array(line, i)
            result.append(processed)
            i = new_i
            continue

        result.append(line[i])
        i += 1

    return ''.join(result)


def process_text_string(line: str, start: int) -> tuple:
    """
    Verarbeitet einen text: "..." String.
    Gibt (verarbeiteter_string, neue_position) zurück.
    """
    if start >= len(line) or line[start] != '"':
        return ('', start)

    i = start + 1
    chars = ['"']

    while i < len(line):
        char = line[i]

        # Escaped character
        if char == '\\' and i + 1 < len(line):
            chars.append(line[i:i+2])
            i += 2
            continue

        # Quote gefunden
        if char == '"':
            # Prüfe was danach kommt
            after = line[i+1:i+20].lstrip()

            # String-Ende Indikatoren
            if (after.startswith(',') or
                after.startswith('}') or
                after.startswith(']') or
                after == '' or
                after.startswith('footnotes:')):
                # Das ist das Ende des Strings
                chars.append('"')
                return (''.join(chars), i + 1)
            else:
                # Inneres Quote - finde das Ende
                j = i + 1
                inner_chars = []

                while j < len(line):
                    if line[j] == '\\' and j + 1 < len(line):
                        inner_chars.append(line[j:j+2])
                        j += 2
                        continue

                    if line[j] == '"':
                        # Prüfe ob das das innere oder äußere Ende ist
                        after_inner = line[j+1:j+20].lstrip()

                        if (after_inner.startswith(',') or
                            after_inner.startswith('}') or
                            after_inner.startswith(']') or
                            after_inner == '' or
                            after_inner.startswith('footnotes:')):
                            # Das war das äußere Ende, inneres Quote war standalone
                            if inner_chars:
                                chars.append('«')
                                chars.extend(inner_chars)
                                chars.append('»')
                                i = j
                            break
                        else:
                            # Das ist das Ende des inneren Quotes
                            chars.append('«')
                            chars.extend(inner_chars)
                            chars.append('»')
                            i = j + 1
                            break

                    inner_chars.append(line[j])
                    j += 1
                else:
                    # Kein schließendes Quote gefunden
                    chars.append(char)
                    i += 1
                continue

        chars.append(char)
        i += 1

    return (''.join(chars), i)


def process_footnotes_array(line: str, start: int) -> tuple:
    """
    Verarbeitet ein footnotes: [...] Array.
    Gibt (verarbeitetes_array, neue_position) zurück.
    """
    i = start
    chars = []

    while i < len(line):
        char = line[i]

        if char == ']':
            chars.append(']')
            return (''.join(chars), i + 1)

        if char == '"':
            # Verarbeite String im Array
            processed, new_i = process_footnote_string(line, i)
            chars.append(processed)
            i = new_i
            continue

        chars.append(char)
        i += 1

    return (''.join(chars), i)


def process_footnote_string(line: str, start: int) -> tuple:
    """
    Verarbeitet einen einzelnen String im footnotes-Array.
    """
    if start >= len(line) or line[start] != '"':
        return ('', start)

    i = start + 1
    chars = ['"']

    while i < len(line):
        char = line[i]

        if char == '\\' and i + 1 < len(line):
            chars.append(line[i:i+2])
            i += 2
            continue

        if char == '"':
            after = line[i+1:i+10].lstrip()

            if (after.startswith(',') or
                after.startswith(']') or
                after == ''):
                chars.append('"')
                return (''.join(chars), i + 1)
            else:
                # Inneres Quote
                j = i + 1
                inner_chars = []

                while j < len(line):
                    if line[j] == '\\' and j + 1 < len(line):
                        inner_chars.append(line[j:j+2])
                        j += 2
                        continue

                    if line[j] == '"':
                        after_inner = line[j+1:j+10].lstrip()
                        if (after_inner.startswith(',') or
                            after_inner.startswith(']') or
                            after_inner == ''):
                            if inner_chars:
                                chars.append('«')
                                chars.extend(inner_chars)
                                chars.append('»')
                                i = j
                            break
                        else:
                            chars.append('«')
                            chars.extend(inner_chars)
                            chars.append('»')
                            i = j + 1
                            break

                    inner_chars.append(line[j])
                    j += 1
                continue

        chars.append(char)
        i += 1

    return (''.join(chars), i)


def main():
    base_dir = "/Users/felixschachtschneider/Documents/bibel-app/data/bibel"

    if len(sys.argv) > 1:
        base_dir = sys.argv[1]

    if not os.path.isdir(base_dir):
        print(f"Verzeichnis nicht gefunden: {base_dir}")
        sys.exit(1)

    print(f"Verarbeite Bibel-Dateien in: {base_dir}")
    print("=" * 60)

    processed = 0
    modified = 0

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next']]

        for filename in files:
            if not filename.endswith('.ts'):
                continue
            if filename.endswith('.d.ts'):
                continue

            filepath = os.path.join(root, filename)

            # Nur AT/ und NT/ Ordner
            if '/AT/' not in filepath and '/NT/' not in filepath:
                continue

            processed += 1

            try:
                if process_file(filepath):
                    modified += 1
                    print(f"Geändert: {filepath}")
            except Exception as e:
                print(f"FEHLER bei {filepath}: {e}")

    print("=" * 60)
    print(f"Fertig! {processed} Dateien verarbeitet, {modified} geändert.")


if __name__ == "__main__":
    main()
