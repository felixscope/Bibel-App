#!/usr/bin/env python3
"""
Korrigiert alle Bible TypeScript-Dateien:
1. Variablennamen die mit Zahlen beginnen -> Unterstrich davor
2. Innere Anführungszeichen in Strings -> Guillemets (« »)
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

    # 1. Erst alle Guillemets zurück zu normalen Quotes (falls vom vorherigen Skript)
    content = content.replace('«', '"').replace('»', '"')

    # 2. Export-Namen korrigieren (1chronicles -> _1chronicles)
    if base_name[0].isdigit():
        content = re.sub(
            rf'\bexport\s+const\s+{re.escape(base_name)}\b',
            f'export const _{base_name}',
            content
        )

    # 3. Innere Quotes in Strings durch Guillemets ersetzen
    content = fix_inner_quotes(content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False


def fix_inner_quotes(content: str) -> str:
    """
    Ersetzt innere Anführungszeichen in Strings durch Guillemets.

    Beispiel:
    "Er sagte: "Komm her" zu mir" -> "Er sagte: «Komm her» zu mir"
    """
    result = []
    i = 0

    while i < len(content):
        # Kommentare überspringen
        if content[i:i+2] == '//':
            end = content.find('\n', i)
            if end == -1:
                end = len(content)
            result.append(content[i:end])
            i = end
            continue

        if content[i:i+2] == '/*':
            end = content.find('*/', i)
            if end == -1:
                end = len(content)
            else:
                end += 2
            result.append(content[i:end])
            i = end
            continue

        # Template literals überspringen
        if content[i] == '`':
            result.append('`')
            i += 1
            while i < len(content):
                if content[i] == '\\' and i + 1 < len(content):
                    result.append(content[i:i+2])
                    i += 2
                elif content[i] == '`':
                    result.append('`')
                    i += 1
                    break
                else:
                    result.append(content[i])
                    i += 1
            continue

        # Single quotes überspringen
        if content[i] == "'":
            result.append("'")
            i += 1
            while i < len(content):
                if content[i] == '\\' and i + 1 < len(content):
                    result.append(content[i:i+2])
                    i += 2
                elif content[i] == "'":
                    result.append("'")
                    i += 1
                    break
                else:
                    result.append(content[i])
                    i += 1
            continue

        # Double-quoted string verarbeiten
        if content[i] == '"':
            processed_string = process_string(content, i)
            result.append(processed_string['text'])
            i = processed_string['end']
            continue

        # Normales Zeichen
        result.append(content[i])
        i += 1

    return ''.join(result)


def process_string(content: str, start: int) -> dict:
    """
    Verarbeitet einen String ab Position start.
    Gibt {'text': verarbeiteter_string, 'end': ende_position} zurück.
    """
    i = start + 1  # Nach dem öffnenden "
    chars = ['"']  # Beginne mit öffnendem Quote

    while i < len(content):
        char = content[i]

        # Escaped character
        if char == '\\' and i + 1 < len(content):
            chars.append(content[i:i+2])
            i += 2
            continue

        # Mögliches Quote
        if char == '"':
            # Prüfe ob das der String-Ende ist
            if is_string_end(content, i):
                chars.append('"')
                i += 1
                break
            else:
                # Inneres Quote - finde das schließende innere Quote
                inner_result = extract_inner_quote(content, i)
                if inner_result:
                    chars.append('«')
                    chars.append(inner_result['text'])
                    chars.append('»')
                    i = inner_result['end']
                else:
                    # Kein passendes schließendes Quote gefunden
                    # Behandle als String-Ende
                    chars.append('"')
                    i += 1
                    break
            continue

        # Normales Zeichen
        chars.append(char)
        i += 1

    return {'text': ''.join(chars), 'end': i}


def is_string_end(content: str, pos: int) -> bool:
    """
    Prüft ob das Quote an Position pos das Ende eines Strings ist.
    """
    after = content[pos+1:pos+30]

    # Whitespace am Anfang ignorieren
    after_stripped = after.lstrip()

    # Patterns die auf String-Ende hindeuten
    end_indicators = [',', ']', '}', ')', ';', '\n', '']

    if not after_stripped:
        return True

    return after_stripped[0] in end_indicators


def extract_inner_quote(content: str, start: int) -> dict | None:
    """
    Extrahiert den Inhalt eines inneren Quotes.
    start zeigt auf das öffnende innere "
    Gibt {'text': inhalt, 'end': position_nach_schließendem_quote} oder None zurück.
    """
    i = start + 1  # Nach dem öffnenden inneren "
    chars = []

    while i < len(content):
        char = content[i]

        # Escaped character
        if char == '\\' and i + 1 < len(content):
            chars.append(content[i:i+2])
            i += 2
            continue

        # Quote gefunden
        if char == '"':
            # Prüfe ob das Zeichen danach auf ein String-Ende hindeutet
            # Wenn ja, dann war das vorherige Quote das innere schließende
            if chars:  # Nur wenn wir schon Inhalt haben
                return {'text': ''.join(chars), 'end': i + 1}
            else:
                # Leeres inneres Quote - unwahrscheinlich, aber behandeln
                return None

        # Newline bedeutet: kein gültiges inneres Quote
        if char == '\n':
            return None

        chars.append(char)
        i += 1

    return None


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
        # Ignoriere bestimmte Verzeichnisse
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next']]

        for filename in files:
            if not filename.endswith('.ts'):
                continue
            if filename.endswith('.d.ts'):
                continue

            filepath = os.path.join(root, filename)

            # Nur AT/ und NT/ Ordner verarbeiten
            if '/AT/' not in filepath and '/NT/' not in filepath:
                continue

            processed += 1
            print(f"Verarbeite: {filepath}")

            try:
                if process_file(filepath):
                    modified += 1
                    print("  -> Geändert")
            except Exception as e:
                print(f"  -> FEHLER: {e}")

    print("=" * 60)
    print(f"Fertig! {processed} Dateien verarbeitet, {modified} geändert.")


if __name__ == "__main__":
    main()
