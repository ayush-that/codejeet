---
title: "How to Solve Tag Validator — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Tag Validator. Hard difficulty, 40.3% acceptance rate. Topics: String, Stack."
date: "2029-11-06"
category: "dsa-patterns"
tags: ["tag-validator", "string", "stack", "hard"]
---

# How to Solve Tag Validator

This problem asks us to validate whether a given string represents a valid HTML/XML-like code snippet according to specific rules. What makes this problem tricky is that it combines multiple validation requirements: proper tag nesting, correct CDATA handling, and content validation—all while dealing with string parsing that has multiple edge cases. It's essentially a mini-parser problem that tests your ability to handle stateful string processing.

## Visual Walkthrough

Let's trace through a simple example: `<DIV>This is the first line <![CDATA[<div>]]></DIV>`

1. **Check if wrapped in valid closed tag**: The entire string starts with `<DIV>` and ends with `</DIV>`, so this passes the first check.

2. **Parse the opening tag**: We extract `DIV` from `<DIV>`, validate it's uppercase and 1-9 characters long.

3. **Process content between tags**: We encounter `This is the first line ` which is valid text content.

4. **Handle CDATA**: We see `<![CDATA[`, so we look for the closing `]]>`. Inside we find `<div>` which would normally be invalid, but CDATA sections allow any characters.

5. **Close the tag**: We find `</DIV>` which matches our opening `DIV` tag, so the stack becomes empty.

6. **Final check**: No unclosed tags remain, so the string is valid.

The key insight is that we need to track opening tags in a stack to ensure proper nesting, while also handling special CDATA sections that bypass normal parsing rules.

## Brute Force Approach

A naive approach might try to use regular expressions or simple string scanning without proper state management. For example:

1. Check if the string starts with `<` and ends with `>`
2. Try to find matching opening/closing tags
3. Validate content between tags

However, this approach fails because:

- It doesn't properly handle nested tags (needs a stack)
- It can't distinguish between tag content and CDATA sections
- It might incorrectly parse malformed strings like `<<A></A>>`
- It doesn't validate tag names properly (uppercase, length 1-9)

The brute force would involve complex string manipulations with many edge cases, making it error-prone and difficult to implement correctly.

## Optimized Approach

The optimal solution uses a **stack** to track opening tags and **stateful parsing** to handle different parts of the string. Here's the step-by-step reasoning:

1. **Stack for tag nesting**: We need to ensure tags are properly nested (last opened, first closed). A stack perfectly models this.

2. **Three parsing states**: We're either:
   - Looking for a tag (starting with `<`)
   - Inside a CDATA section (after `<![CDATA[`)
   - Processing regular text content

3. **Tag validation rules**:
   - Tag names must be uppercase A-Z
   - Tag names must be 1-9 characters
   - Closing tags must match the most recent opening tag

4. **CDATA handling**: Once we enter a CDATA section (`<![CDATA[`), we ignore all parsing rules until we find the closing `]]>`

5. **Content validation**: Text outside tags and CDATA must only contain valid characters (not `<` unless starting a tag or CDATA)

The algorithm proceeds character by character, maintaining state about what we're currently parsing and using a stack to track open tags.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of code | Space: O(n) for the stack
class Solution:
    def isValid(self, code: str) -> bool:
        stack = []
        i = 0
        n = len(code)

        while i < n:
            # Case 1: We're at the start of a tag
            if i == 0 and code[i] != '<':
                return False  # Must start with a tag

            # Case 2: Regular text content (not inside tag)
            if code[i] != '<':
                # If we're not inside any tag, this is invalid
                if not stack:
                    return False
                i += 1
                continue

            # Case 3: Closing tag
            if i + 1 < n and code[i+1] == '/':
                # Find the end of the closing tag
                j = code.find('>', i)
                if j == -1:
                    return False  # No closing bracket

                # Extract tag name (skip the '</' part)
                tag_name = code[i+2:j]

                # Validate closing tag matches last opening tag
                if not stack or stack[-1] != tag_name:
                    return False

                stack.pop()
                i = j + 1  # Move past the closing tag

                # If stack is empty but we're not at the end, invalid
                if not stack and i < n:
                    return False

            # Case 4: CDATA section
            elif i + 9 < n and code[i:i+9] == '<![CDATA[':
                if not stack:
                    return False  # CDATA must be inside a tag

                # Find the end of CDATA section
                j = code.find(']]>', i)
                if j == -1:
                    return False  # No CDATA closing

                i = j + 3  # Move past ']]>'

            # Case 5: Opening tag
            else:
                # Find the end of the opening tag
                j = code.find('>', i)
                if j == -1:
                    return False  # No closing bracket

                # Extract tag name (skip the '<' part)
                tag_name = code[i+1:j]

                # Validate tag name: uppercase, length 1-9
                if not (1 <= len(tag_name) <= 9 and all('A' <= c <= 'Z' for c in tag_name)):
                    return False

                # Push valid tag onto stack
                stack.append(tag_name)
                i = j + 1  # Move past the opening tag

        # Valid if all tags are properly closed
        return len(stack) == 0
```

```javascript
// Time: O(n) where n is length of code | Space: O(n) for the stack
var isValid = function (code) {
  const stack = [];
  let i = 0;
  const n = code.length;

  while (i < n) {
    // Case 1: Must start with a tag
    if (i === 0 && code[i] !== "<") {
      return false;
    }

    // Case 2: Regular text content
    if (code[i] !== "<") {
      // Text must be inside a tag
      if (stack.length === 0) return false;
      i++;
      continue;
    }

    // Case 3: Closing tag
    if (i + 1 < n && code[i + 1] === "/") {
      // Find the closing bracket
      const j = code.indexOf(">", i);
      if (j === -1) return false;

      // Extract tag name (skip '</')
      const tagName = code.substring(i + 2, j);

      // Check if it matches the last opened tag
      if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
        return false;
      }

      stack.pop();
      i = j + 1;

      // If no tags left but more content exists, invalid
      if (stack.length === 0 && i < n) return false;
    }
    // Case 4: CDATA section
    else if (i + 9 < n && code.substring(i, i + 9) === "<![CDATA[") {
      // CDATA must be inside a tag
      if (stack.length === 0) return false;

      // Find CDATA closing
      const j = code.indexOf("]]>", i);
      if (j === -1) return false;

      i = j + 3; // Skip ']]>'
    }
    // Case 5: Opening tag
    else {
      // Find the closing bracket
      const j = code.indexOf(">", i);
      if (j === -1) return false;

      // Extract tag name (skip '<')
      const tagName = code.substring(i + 1, j);

      // Validate tag name: uppercase, length 1-9
      if (!(tagName.length >= 1 && tagName.length <= 9 && /^[A-Z]+$/.test(tagName))) {
        return false;
      }

      stack.push(tagName);
      i = j + 1;
    }
  }

  // All tags must be properly closed
  return stack.length === 0;
};
```

```java
// Time: O(n) where n is length of code | Space: O(n) for the stack
class Solution {
    public boolean isValid(String code) {
        Stack<String> stack = new Stack<>();
        int i = 0;
        int n = code.length();

        while (i < n) {
            // Case 1: Must start with a tag
            if (i == 0 && code.charAt(i) != '<') {
                return false;
            }

            // Case 2: Regular text content
            if (code.charAt(i) != '<') {
                // Text must be inside a tag
                if (stack.isEmpty()) return false;
                i++;
                continue;
            }

            // Case 3: Closing tag
            if (i + 1 < n && code.charAt(i + 1) == '/') {
                // Find the closing bracket
                int j = code.indexOf('>', i);
                if (j == -1) return false;

                // Extract tag name (skip "</")
                String tagName = code.substring(i + 2, j);

                // Check if it matches the last opened tag
                if (stack.isEmpty() || !stack.peek().equals(tagName)) {
                    return false;
                }

                stack.pop();
                i = j + 1;

                // If no tags left but more content exists, invalid
                if (stack.isEmpty() && i < n) return false;
            }
            // Case 4: CDATA section
            else if (i + 9 < n && code.startsWith("<![CDATA[", i)) {
                // CDATA must be inside a tag
                if (stack.isEmpty()) return false;

                // Find CDATA closing
                int j = code.indexOf("]]>", i);
                if (j == -1) return false;

                i = j + 3; // Skip "]]>"
            }
            // Case 5: Opening tag
            else {
                // Find the closing bracket
                int j = code.indexOf('>', i);
                if (j == -1) return false;

                // Extract tag name (skip '<')
                String tagName = code.substring(i + 1, j);

                // Validate tag name: uppercase, length 1-9
                if (tagName.length() < 1 || tagName.length() > 9) {
                    return false;
                }
                for (char c : tagName.toCharArray()) {
                    if (c < 'A' || c > 'Z') return false;
                }

                stack.push(tagName);
                i = j + 1;
            }
        }

        // All tags must be properly closed
        return stack.isEmpty();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input string. We process each character at most once. The `indexOf` operations might seem like O(n) each, but since we always start searching from the current position and move forward, each character is examined at most once across all operations.

**Space Complexity: O(n)** in the worst case. The stack could contain all tags if they're deeply nested (e.g., `<A><B><C><D>...</D></C></B></A>`). In practice, the stack size is limited by the maximum nesting depth, which is bounded by n/3 (minimum tag length is 3 characters including brackets).

## Common Mistakes

1. **Forgetting to check if text content is inside tags**: Text like `"hello"` without surrounding tags should return false, but candidates often miss this check when processing regular text characters.

2. **Incorrect CDATA handling**: Not verifying that CDATA sections are inside valid tags, or not properly skipping the entire CDATA content when found.

3. **Tag name validation errors**: Missing the uppercase requirement or the 1-9 character length constraint. Some candidates also forget that tag names cannot contain spaces or special characters.

4. **Stack management issues**: Not checking if the stack is empty when encountering a closing tag, or not verifying that all tags are properly closed at the end. Also, forgetting to check that if the stack becomes empty before reaching the end of string, the code is invalid.

## When You'll See This Pattern

This type of stateful parsing with stack validation appears in several related problems:

1. **Valid Parentheses (Easy)**: Simpler version with just bracket matching, no tag names or CDATA.
2. **Decode String (Medium)**: Uses stack to handle nested repetitions and requires parsing different states (numbers, brackets, letters).
3. **Mini Parser (Medium)**: Parsing nested structures from string representation, similar state management needed.
4. **Add Bold Tag in String (Medium)**: Mentioned as similar problem—involves inserting tags into text while maintaining validity.

The core pattern is: when you need to parse nested structures with different rules for different contexts, use a stack to track context and maintain state about what you're currently parsing.

## Key Takeaways

1. **Stack for nested validation**: Whenever you see problems involving nested structures (HTML/XML tags, parentheses, brackets), a stack is usually the right tool to ensure proper opening/closing order.

2. **Stateful parsing approach**: Break the parsing into distinct states (in tag, in CDATA, in text) and handle transitions between them cleanly. This makes complex parsing rules manageable.

3. **Edge case discipline**: String parsing problems are full of edge cases. Methodically check: empty input, malformed tags, unmatched brackets, content outside tags, and premature termination.

Related problems: [Add Bold Tag in String](/problem/add-bold-tag-in-string)
