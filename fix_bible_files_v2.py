#!/usr/bin/env python3
"""
Fixes Bible TypeScript files - Version 2
1. Replaces all guillemet delimiters (« ») with normal quotes
2. Adds underscore prefix to exports starting with numbers
3. Only replaces inner quotes within footnotes arrays with guillemets
"""

import os
import re
import sys

def fix_export_names(content: str, filename: str) -> str:
    """Add underscore prefix to exports starting with numbers."""
    base_name = os.path.splitext(filename)[0]

    if not base_name[0].isdigit():
        return content

    pattern = rf'\bexport\s+const\s+({re.escape(base_name)})\s*='
    replacement = f'export const _{base_name} ='

    return re.sub(pattern, replacement, content)


def fix_guillemet_to_quotes(content: str) -> str:
    """
    Replace ALL guillemet delimiters with normal quotes.
    «text» -> "text"
    »text« -> "text"
    """
    # First pass: Replace «...» patterns
    content = re.sub(r'«([^«»]*)»', r'"\1"', content)

    # Second pass: Replace »...« patterns (inverted guillemets)
    content = re.sub(r'»([^«»]*)«', r'"\1"', content)

    # Fix any remaining stray guillemets
    content = content.replace('«', '"').replace('»', '"')

    return content


def fix_inner_quotes_in_footnotes(content: str) -> str:
    """
    Replace inner quotes within footnote strings with guillemets.
    footnotes: ["text "inner" text"] -> footnotes: ["text «inner» text"]

    This is more conservative - only handles the footnotes array.
    """
    result = []
    i = 0

    while i < len(content):
        # Look for footnotes: [ pattern
        if content[i:i+11] == 'footnotes: ':
            # Found footnotes, now process the array
            result.append(content[i:i+11])
            i += 11

            # Skip whitespace
            while i < len(content) and content[i] in ' \t\n':
                result.append(content[i])
                i += 1

            if i < len(content) and content[i] == '[':
                result.append('[')
                i += 1

                # Process strings within the array until we hit ]
                bracket_depth = 1
                while i < len(content) and bracket_depth > 0:
                    if content[i] == '[':
                        bracket_depth += 1
                        result.append(content[i])
                        i += 1
                    elif content[i] == ']':
                        bracket_depth -= 1
                        result.append(content[i])
                        i += 1
                    elif content[i] == '"':
                        # Start of a string inside footnotes array
                        result.append('"')
                        i += 1

                        # Process string content, replacing inner quotes
                        while i < len(content):
                            if content[i] == '\\' and i + 1 < len(content):
                                # Escaped char
                                result.append(content[i:i+2])
                                i += 2
                            elif content[i] == '"':
                                # Check if this is the end of the string
                                # Look ahead for patterns indicating end
                                after = content[i+1:i+20] if i+1 < len(content) else ""

                                # End-of-string patterns
                                is_end = (
                                    after.startswith(',') or
                                    after.startswith(']') or
                                    after.lstrip().startswith(',') or
                                    after.lstrip().startswith(']') or
                                    after.strip() == '' or
                                    after.lstrip().startswith('}')
                                )

                                if is_end:
                                    # End of string
                                    result.append('"')
                                    i += 1
                                    break
                                else:
                                    # Inner quote - find its matching close
                                    # Look for the closing inner quote
                                    j = i + 1
                                    inner_text = []
                                    found_close = False

                                    while j < len(content):
                                        if content[j] == '\\' and j + 1 < len(content):
                                            inner_text.append(content[j:j+2])
                                            j += 2
                                        elif content[j] == '"':
                                            # Check if this closes the inner or outer
                                            after_inner = content[j+1:j+20] if j+1 < len(content) else ""
                                            is_outer_end = (
                                                after_inner.startswith(',') or
                                                after_inner.startswith(']') or
                                                after_inner.lstrip().startswith(',') or
                                                after_inner.lstrip().startswith(']') or
                                                after_inner.strip() == '' or
                                                after_inner.lstrip().startswith('}')
                                            )

                                            if is_outer_end and not inner_text:
                                                # This is actually the outer end, previous " was just standalone
                                                break
                                            else:
                                                # This closes the inner quote
                                                found_close = True
                                                break
                                        elif content[j] in '\n\r':
                                            # Newline - something wrong, bail
                                            break
                                        else:
                                            inner_text.append(content[j])
                                            j += 1

                                    if found_close and inner_text:
                                        # Replace inner quotes with guillemets
                                        result.append('«')
                                        result.extend(inner_text)
                                        result.append('»')
                                        i = j + 1
                                    else:
                                        # Couldn't find proper pair, just output as-is
                                        result.append(content[i])
                                        i += 1
                            else:
                                result.append(content[i])
                                i += 1
                    else:
                        result.append(content[i])
                        i += 1
            continue

        # Regular character
        result.append(content[i])
        i += 1

    return ''.join(result)


def process_file(filepath: str) -> bool:
    """Process a single TypeScript file. Returns True if modified."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
    except Exception as e:
        print(f"  Error reading {filepath}: {e}")
        return False

    content = original_content
    filename = os.path.basename(filepath)

    # Step 1: Replace ALL guillemets with normal quotes first
    content = fix_guillemet_to_quotes(content)

    # Step 2: Fix export names starting with numbers
    content = fix_export_names(content, filename)

    # Step 3: Fix inner quotes in footnotes only
    content = fix_inner_quotes_in_footnotes(content)

    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"  Error writing {filepath}: {e}")
            return False

    return False


def process_directory(directory: str) -> tuple[int, int]:
    """Process all .ts files in directory recursively."""
    processed = 0
    modified = 0

    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist']]

        for filename in files:
            if filename.endswith('.ts') and not filename.endswith('.d.ts'):
                filepath = os.path.join(root, filename)

                if '/AT/' in filepath or '/NT/' in filepath or '\\AT\\' in filepath or '\\NT\\' in filepath:
                    processed += 1
                    print(f"Processing: {filepath}")

                    if process_file(filepath):
                        modified += 1
                        print(f"  -> Modified")

    return processed, modified


def main():
    default_dir = "/Users/felixschachtschneider/Documents/bibel-app/data/bibel"

    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = default_dir

    if not os.path.isdir(directory):
        print(f"Error: Directory not found: {directory}")
        sys.exit(1)

    print(f"Processing Bible files in: {directory}")
    print("=" * 60)

    processed, modified = process_directory(directory)

    print("=" * 60)
    print(f"Done! Processed {processed} files, modified {modified} files.")


if __name__ == "__main__":
    main()
