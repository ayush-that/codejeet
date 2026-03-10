---
title: "How to Solve Valid Phone Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Phone Numbers. Easy difficulty, 29.0% acceptance rate. Topics: Shell."
date: "2027-01-19"
category: "dsa-patterns"
tags: ["valid-phone-numbers", "shell", "easy"]
---

# How to Solve Valid Phone Numbers

This problem asks you to filter valid phone numbers from a text file using a one-liner bash script. The challenge is that it's a shell scripting problem, which many developers rarely practice, and requires precise regex pattern matching. What makes it interesting is learning how to use `grep` with extended regular expressions to match multiple patterns simultaneously.

## Visual Walkthrough

Let's trace through a small example file:

```
987-123-4567
123 456 7890
(123) 456-7890
(123)456-7890
(123) 456-78901
```

We need to identify which lines match exactly one of these two patterns:

1. `(xxx) xxx-xxxx` where `x` is any digit
2. `xxx-xxx-xxxx` where `x` is any digit

Step-by-step:

1. **Line 1**: `987-123-4567` → Matches pattern 2 exactly. ✓ Valid
2. **Line 2**: `123 456 7890` → Has spaces instead of hyphens. ✗ Invalid
3. **Line 3**: `(123) 456-7890` → Matches pattern 1 exactly. ✓ Valid
4. **Line 4**: `(123)456-7890` → Missing space after closing parenthesis. ✗ Invalid
5. **Line 5**: `(123) 456-78901` → Has 5 digits at the end instead of 4. ✗ Invalid

The key insight is that we need to match the **entire line** against one of these exact patterns, not just find the pattern somewhere in the line.

## Brute Force Approach

For a shell scripting problem like this, there isn't really a "brute force" algorithm in the traditional sense. However, a naive approach might involve:

1. Reading the file line by line
2. Checking if the line length is correct (14 characters for pattern 1, 12 for pattern 2)
3. Checking character-by-character if each position matches the expected format

This would be extremely verbose in bash and error-prone. A better "naive" approach might be to use two separate `grep` commands:

```bash
grep '^[0-9]\{3\}-[0-9]\{3\}-[0-9]\{4\}$' file.txt
grep '^([0-9]\{3\}) [0-9]\{3\}-[0-9]\{4\}$' file.txt
```

But this requires running `grep` twice and doesn't output the results together as required. The real challenge is combining these patterns into a single command.

## Optimal Solution

The optimal solution uses `grep` with the `-E` flag (extended regular expressions) to match either pattern. The `^` and `$` anchors are crucial to ensure we match the entire line, not just a substring.

<div class="code-group">

```bash
#!/bin/bash
# Time: O(n) where n is number of lines | Space: O(1)
# Using grep with extended regex to match either pattern
grep -E '^(\([0-9]{3}\) [0-9]{3}-[0-9]{4}|[0-9]{3}-[0-9]{3}-[0-9]{4})$' file.txt
```

```bash
#!/bin/bash
# Alternative using egrep (same as grep -E)
# Time: O(n) where n is number of lines | Space: O(1)
egrep '^(\([0-9]{3}\) [0--9]{3}-[0-9]{4}|[0-9]{3}-[0-9]{3}-[0-9]{4})$' file.txt
```

```bash
#!/bin/bash
# Another alternative using awk for clarity
# Time: O(n) where n is number of lines | Space: O(1)
awk '/^([0-9]{3}-|\([0-9]{3}\) )[0-9]{3}-[0-9]{4}$/' file.txt
```

</div>

**Line-by-line explanation:**

1. **`grep -E`**: The `-E` flag enables extended regular expressions, allowing us to use the `|` (OR) operator and `{n}` repetition syntax without backslashes.
2. **`^`**: Anchor that matches the beginning of the line. Ensures the pattern starts at the very first character.
3. **`\([0-9]{3}\) [0-9]{3}-[0-9]{4}`**: First pattern - matches `(xxx) xxx-xxxx`
   - `\(` and `\)`: Escaped parentheses to match literal `(` and `)` characters
   - `[0-9]{3}`: Exactly three digits (0-9)
   - ` `: A literal space (important!)
   - `[0-9]{3}-`: Three digits followed by a hyphen
   - `[0-9]{4}`: Exactly four digits
4. **`|`**: OR operator - matches either the pattern before or after it
5. **`[0-9]{3}-[0-9]{3}-[0-9]{4}`**: Second pattern - matches `xxx-xxx-xxxx`
   - Three groups of digits separated by hyphens
6. **`$`**: Anchor that matches the end of the line. Ensures the pattern continues to the very end of the line.
7. **`file.txt`**: The input file to process

**Why this works:** The regex matches entire lines that conform exactly to one of the two specified formats. The `^` and `$` anchors prevent partial matches, and the grouping with `|` allows either pattern to match.

## Complexity Analysis

**Time Complexity:** O(n × m) where n is the number of lines and m is the average line length. In practice, since phone numbers have fixed maximum length (14-15 characters), this simplifies to O(n).

**Space Complexity:** O(1) for `grep` itself (excluding the input file storage). `grep` processes the file line by line without storing all lines in memory.

The complexity comes from:

- Reading each line from the file: O(n) operations
- Applying the regex pattern to each line: O(m) operations per line where m is line length
- Since m is bounded (phone numbers have max length), overall time is O(n)

## Common Mistakes

1. **Forgetting the `^` and `$` anchors**: Without these, the regex would match phone numbers that appear as substrings of longer text. For example, `123-456-78901` would incorrectly match because it contains `123-456-7890` as a substring.

2. **Not escaping parentheses**: Writing `([0-9]{3})` instead of `\([0-9]{3}\)` would create a capturing group rather than matching literal parentheses. The parentheses would not appear in the matched text.

3. **Missing the space in the first pattern**: The pattern `(xxx) xxx-xxxx` requires a space after the closing parenthesis. Writing `\([0-9]{3}\)[0-9]{3}-[0-9]{4}` would miss valid numbers.

4. **Using basic regex instead of extended regex**: Without `-E` or `egrep`, you'd need to write `\|` instead of `|` and `\{3\}` instead of `{3}`, making the pattern much harder to read.

5. **Overcomplicating with character-by-character checks**: Some candidates try to write complex shell scripts with loops and conditionals when a simple `grep` one-liner suffices.

## When You'll See This Pattern

This problem teaches **pattern matching with regular expressions**, a fundamental skill for text processing. You'll see similar patterns in:

1. **Valid Palindrome (LeetCode 125)**: While not using regex directly, it involves validating string patterns character by character.
2. **Valid Parentheses (LeetCode 20)**: Teaches pattern validation, though for balanced parentheses rather than phone numbers.
3. **Regex Matching (LeetCode 10)**: Directly tests understanding of regular expression implementation.
4. **Text processing in shell scripts**: Many interview problems involve parsing log files, filtering data, or transforming text using tools like `grep`, `sed`, and `awk`.

The core technique of **validating strings against specific patterns** appears in many problems where you need to check if input conforms to a required format (email addresses, IP addresses, credit card numbers, etc.).

## Key Takeaways

1. **Anchor your patterns**: Use `^` and `$` to match entire strings, not substrings, when you need exact format matching.
2. **Know your regex flavors**: Understand when to use basic vs. extended regular expressions. The `-E` flag in `grep` enables cleaner syntax with `|` and `{n}`.
3. **Escape special characters**: In regex, parentheses `()` have special meaning (grouping). To match literal parentheses, escape them as `\(` and `\)`.
4. **Shell tools are powerful**: For text processing tasks, built-in Unix tools like `grep`, `sed`, and `awk` can often solve problems with one-liners that would take many lines in other languages.

[Practice this problem on CodeJeet](/problem/valid-phone-numbers)
