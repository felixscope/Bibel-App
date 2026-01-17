#!/usr/bin/env python3
"""
Fixes Bible TypeScript files:
1. Adds underscore prefix to exports starting with numbers (e.g., 1chronicles -> _1chronicles)
2. Replaces inner quotes within strings with guillemets (« »)
3. Preserves string delimiters and import statements
"""

import os
import re
import sys

def fix_export_names(content: str, filename: str) -> str:
    """Add underscore prefix to exports starting with numbers."""
    # Get the base name without extension (e.g., "1chronicles" from "1chronicles.ts")
    base_name = os.path.splitext(filename)[0]

    # Only fix if filename starts with a digit
    if not base_name[0].isdigit():
        return content

    # Pattern: export const 1chronicles = { -> export const _1chronicles = {
    pattern = rf'\bexport\s+const\s+({re.escape(base_name)})\s*='
    replacement = f'export const _{base_name} ='

    return re.sub(pattern, replacement, content)


def fix_inner_quotes(content: str) -> str:
    """
    Replace inner double quotes within strings with guillemets.
    This handles cases like: "He said: "hello" to me" -> "He said: «hello» to me"
    """
    result = []
    i = 0

    while i < len(content):
        # Skip single-line comments
        if content[i:i+2] == '//':
            end = content.find('\n', i)
            if end == -1:
                end = len(content)
            result.append(content[i:end])
            i = end
            continue

        # Skip multi-line comments
        if content[i:i+2] == '/*':
            end = content.find('*/', i)
            if end == -1:
                end = len(content)
            else:
                end += 2
            result.append(content[i:end])
            i = end
            continue

        # Handle template literals (backticks)
        if content[i] == '`':
            result.append(content[i])
            i += 1
            # Find matching backtick, handling escapes
            while i < len(content):
                if content[i] == '\\' and i + 1 < len(content):
                    result.append(content[i:i+2])
                    i += 2
                elif content[i] == '`':
                    result.append(content[i])
                    i += 1
                    break
                else:
                    result.append(content[i])
                    i += 1
            continue

        # Handle double-quoted strings
        if content[i] == '"':
            # Check if this is a guillemet that was incorrectly placed
            if i > 0 and content[i-1:i+1] == '»"':
                # This might be from a previous bad fix, skip
                result.append(content[i])
                i += 1
                continue

            string_start = i
            result.append('"')  # Opening quote
            i += 1

            # Collect the string content
            string_content = []
            while i < len(content):
                if content[i] == '\\' and i + 1 < len(content):
                    # Escaped character - keep as is
                    string_content.append(content[i:i+2])
                    i += 2
                elif content[i] == '"':
                    # Check if this is the end of string or an inner quote
                    # Look ahead to see if this looks like end of string
                    after = content[i+1:i+10] if i+1 < len(content) else ""

                    # Patterns that indicate end of string
                    end_patterns = [
                        r'^[,\s]*$',           # comma or whitespace only till end
                        r'^,',                  # followed by comma
                        r'^\s*,',              # whitespace then comma
                        r'^\s*\]',             # closing bracket
                        r'^\s*\}',             # closing brace
                        r'^\s*;',              # semicolon
                        r'^\s*\)',             # closing paren
                        r'^\s*$',              # end of content
                    ]

                    is_end = any(re.match(p, after) for p in end_patterns)

                    if is_end:
                        # This is the closing quote
                        break
                    else:
                        # This is an inner quote - check if it starts a quoted phrase
                        # Look for the closing inner quote
                        j = i + 1
                        inner_content = []
                        found_closing = False

                        while j < len(content):
                            if content[j] == '\\' and j + 1 < len(content):
                                inner_content.append(content[j:j+2])
                                j += 2
                            elif content[j] == '"':
                                # Check if THIS is the end of the outer string
                                after_inner = content[j+1:j+10] if j+1 < len(content) else ""
                                is_outer_end = any(re.match(p, after_inner) for p in end_patterns)

                                if is_outer_end:
                                    # The outer string ends here, previous quote was inner
                                    found_closing = True
                                    break
                                else:
                                    # This closes the inner quote
                                    found_closing = True
                                    break
                            elif content[j] == '\n':
                                # Newline in string - probably malformed, stop
                                break
                            else:
                                inner_content.append(content[j])
                                j += 1

                        if found_closing and inner_content:
                            # Replace inner quotes with guillemets
                            string_content.append('«')
                            string_content.extend(inner_content)
                            string_content.append('»')
                            i = j + 1
                        else:
                            # Couldn't find proper closing, treat as end of string
                            break
                elif content[i] == '\n':
                    # Newline shouldn't be in a double-quoted string
                    # This might indicate a problem, but let's keep going
                    string_content.append(content[i])
                    i += 1
                else:
                    string_content.append(content[i])
                    i += 1

            result.append(''.join(string_content))
            if i < len(content) and content[i] == '"':
                result.append('"')  # Closing quote
                i += 1
            continue

        # Handle single-quoted strings (just pass through)
        if content[i] == "'":
            result.append(content[i])
            i += 1
            while i < len(content):
                if content[i] == '\\' and i + 1 < len(content):
                    result.append(content[i:i+2])
                    i += 2
                elif content[i] == "'":
                    result.append(content[i])
                    i += 1
                    break
                else:
                    result.append(content[i])
                    i += 1
            continue

        # Regular character
        result.append(content[i])
        i += 1

    return ''.join(result)


def fix_guillemet_delimiters(content: str) -> str:
    """
    Fix cases where guillemets were incorrectly used as string delimiters.
    e.g., import { Book } from »../types»; -> import { Book } from "../types";
    """
    # Fix import statements with guillemets
    content = re.sub(r'from\s+»([^»]+)»', r'from "\1"', content)
    content = re.sub(r'from\s+«([^«»]+)»', r'from "\1"', content)

    # Fix object property values that start with guillemet instead of quote
    # e.g., id: »genesis», -> id: "genesis",
    content = re.sub(r':\s*»([^»]+)»\s*,', r': "\1",', content)
    content = re.sub(r':\s*«([^«»]+)»\s*,', r': "\1",', content)

    # Fix mismatched quotes like "text» or «text"
    # Pattern: opening quote followed by text and closing guillemet
    content = re.sub(r'"([^"«»]*?)»', r'"\1"', content)
    content = re.sub(r'«([^"«»]*?)"', r'"\1"', content)

    return content


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

    # Step 1: Fix any existing guillemet delimiters from previous bad fixes
    content = fix_guillemet_delimiters(content)

    # Step 2: Fix export names starting with numbers
    content = fix_export_names(content, filename)

    # Step 3: Fix inner quotes in strings
    content = fix_inner_quotes(content)

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
    """Process all .ts files in directory recursively. Returns (processed, modified) counts."""
    processed = 0
    modified = 0

    for root, dirs, files in os.walk(directory):
        # Skip node_modules and other common directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist']]

        for filename in files:
            if filename.endswith('.ts') and not filename.endswith('.d.ts'):
                filepath = os.path.join(root, filename)

                # Only process files in AT or NT folders (Bible data)
                if '/AT/' in filepath or '/NT/' in filepath or '\\AT\\' in filepath or '\\NT\\' in filepath:
                    processed += 1
                    print(f"Processing: {filepath}")

                    if process_file(filepath):
                        modified += 1
                        print(f"  -> Modified")

    return processed, modified


def main():
    # Default to the bibel data directory
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
