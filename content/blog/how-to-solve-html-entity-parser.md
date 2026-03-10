---
title: "How to Solve HTML Entity Parser — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode HTML Entity Parser. Medium difficulty, 50.3% acceptance rate. Topics: Hash Table, String."
date: "2029-04-11"
category: "dsa-patterns"
tags: ["html-entity-parser", "hash-table", "string", "medium"]
---

# How to Solve HTML Entity Parser

HTML entity parsing is a classic string manipulation problem that tests your ability to handle pattern matching and replacement efficiently. What makes this problem interesting is that you can't simply replace all occurrences at once—entities can contain parts of other entities (like `&apos;` containing `&apos;`), and you need to process the string in a single pass to avoid incorrect replacements.

## Visual Walkthrough

Let's trace through the example: `"&amp; is an HTML entity but &ambassador; is not."`

We need to replace `&amp;` with `&` while leaving `&ambassador;` unchanged (since it's not in our entity list).

**Step-by-step processing:**

1. Start reading characters: `"&"`
2. When we see `&`, we start checking if it begins a known entity
3. For `&amp;`: We find `&` → `a` → `m` → `p` → `;` → complete match! Replace with `&`
4. Continue: `" is an HTML entity but "`
5. See `&` again: check `&` → `a` → `m` → `b` → `a` → `s` → `s` → `a` → `d` → `o` → `r` → `;`
6. `&ambassador;` is not in our entity map, so we keep it as-is
7. Final result: `"& is an HTML entity but &ambassador; is not."`

The key insight: we need to check every `&` we encounter, but only replace it if we find a complete entity ending with `;` that exists in our mapping.

## Brute Force Approach

A naive approach would be to use string replacement for each entity:

1. For each entity in our mapping (e.g., `&quot;`, `&apos;`, etc.)
2. Use `input.replace(entity, character)` to replace all occurrences
3. Repeat for all entities

**Why this fails:**

- Order matters: If we replace `&` first (from `&amp;`), we might create new `&` characters that get incorrectly processed later
- Overlapping entities: Some entities contain others (e.g., `&apos;` contains `&apos;`)
- Multiple passes: This requires scanning the string multiple times (once per entity)
- Edge cases: What if the input contains something like `&amp;amp;`? Should become `&&` not `&amp;`

The brute force approach is both inefficient (O(n×m) where m is number of entities) and incorrect for many edge cases.

## Optimized Approach

The optimal solution uses a **single-pass scanning approach**:

1. **Scan character by character**: Build the result string incrementally
2. **When we see `&`**: Start collecting characters into a buffer until we either:
   - Find a `;` → check if buffer is a known entity
   - Find a character that can't be part of any entity → append buffer as-is
   - Reach the end of string → append buffer as-is
3. **Entity lookup**: Use a hash map/dictionary for O(1) entity-to-character lookup
4. **Replacement logic**: If buffer is a known entity, append its replacement character; otherwise, append the buffer as-is

**Key insight**: By processing left-to-right and only committing to replacement when we find a complete entity (`...;`), we avoid all the edge cases of the brute force approach. We never modify already-processed parts of the string, so we can't create new entities accidentally.

## Optimal Solution

Here's the complete implementation using a single-pass scanning approach:

<div class="code-group">

```python
# Time: O(n) where n is length of input string
# Space: O(n) for the output string
class Solution:
    def entityParser(self, text: str) -> str:
        # Map HTML entities to their corresponding characters
        entity_map = {
            "&quot;": '"',
            "&apos;": "'",
            "&amp;": "&",
            "&gt;": ">",
            "&lt;": "<",
            "&frasl;": "/"
        }

        result = []  # Use list for O(1) appends (more efficient than string concatenation)
        i = 0
        n = len(text)

        while i < n:
            # If current character is not '&', just add it to result
            if text[i] != '&':
                result.append(text[i])
                i += 1
                continue

            # We found '&' - start collecting potential entity
            j = i
            # Collect characters until we find ';' or reach end of string
            while j < n and text[j] != ';':
                j += 1

            # If we didn't find ';', this isn't a valid entity
            if j == n or text[j] != ';':
                result.append(text[i])
                i += 1
                continue

            # Extract the potential entity (including '&' and ';')
            potential_entity = text[i:j+1]

            # Check if it's a known entity
            if potential_entity in entity_map:
                # Replace with corresponding character
                result.append(entity_map[potential_entity])
                i = j + 1  # Skip past the entire entity
            else:
                # Not a known entity, just add the '&' and continue
                result.append(text[i])
                i += 1

        # Convert list to string
        return ''.join(result)
```

```javascript
// Time: O(n) where n is length of input string
// Space: O(n) for the output string
var entityParser = function (text) {
  // Map HTML entities to their corresponding characters
  const entityMap = {
    "&quot;": '"',
    "&apos;": "'",
    "&amp;": "&",
    "&gt;": ">",
    "&lt;": "<",
    "&frasl;": "/",
  };

  let result = "";
  let i = 0;
  const n = text.length;

  while (i < n) {
    // If current character is not '&', just add it to result
    if (text[i] !== "&") {
      result += text[i];
      i++;
      continue;
    }

    // We found '&' - start collecting potential entity
    let j = i;
    // Collect characters until we find ';' or reach end of string
    while (j < n && text[j] !== ";") {
      j++;
    }

    // If we didn't find ';', this isn't a valid entity
    if (j === n || text[j] !== ";") {
      result += text[i];
      i++;
      continue;
    }

    // Extract the potential entity (including '&' and ';')
    const potentialEntity = text.substring(i, j + 1);

    // Check if it's a known entity
    if (entityMap.hasOwnProperty(potentialEntity)) {
      // Replace with corresponding character
      result += entityMap[potentialEntity];
      i = j + 1; // Skip past the entire entity
    } else {
      // Not a known entity, just add the '&' and continue
      result += text[i];
      i++;
    }
  }

  return result;
};
```

```java
// Time: O(n) where n is length of input string
// Space: O(n) for the output string
class Solution {
    public String entityParser(String text) {
        // Map HTML entities to their corresponding characters
        Map<String, String> entityMap = new HashMap<>();
        entityMap.put("&quot;", "\"");
        entityMap.put("&apos;", "'");
        entityMap.put("&amp;", "&");
        entityMap.put("&gt;", ">");
        entityMap.put("&lt;", "<");
        entityMap.put("&frasl;", "/");

        StringBuilder result = new StringBuilder();
        int i = 0;
        int n = text.length();

        while (i < n) {
            // If current character is not '&', just add it to result
            if (text.charAt(i) != '&') {
                result.append(text.charAt(i));
                i++;
                continue;
            }

            // We found '&' - start collecting potential entity
            int j = i;
            // Collect characters until we find ';' or reach end of string
            while (j < n && text.charAt(j) != ';') {
                j++;
            }

            // If we didn't find ';', this isn't a valid entity
            if (j == n || text.charAt(j) != ';') {
                result.append(text.charAt(i));
                i++;
                continue;
            }

            // Extract the potential entity (including '&' and ';')
            String potentialEntity = text.substring(i, j + 1);

            // Check if it's a known entity
            if (entityMap.containsKey(potentialEntity)) {
                // Replace with corresponding character
                result.append(entityMap.get(potentialEntity));
                i = j + 1;  // Skip past the entire entity
            } else {
                // Not a known entity, just add the '&' and continue
                result.append(text.charAt(i));
                i++;
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the input string
- Each character is examined at most twice (once when we encounter it, once when we skip past it after entity replacement)
- Hash map lookups are O(1) for each potential entity

**Space Complexity: O(n)**

- We store the result string which could be as large as the input (in the worst case where no replacements occur)
- The entity map uses constant space (only 6 entries)
- Additional O(1) space for pointers and temporary variables

## Common Mistakes

1. **Using replace() in wrong order**: Candidates often try `text.replace("&amp;", "&").replace("&gt;", ">")` etc. This fails because after replacing `&amp;`, you create new `&` characters that might form new entities.

2. **Not handling partial entities**: For input like `"&amp"` (missing semicolon), you must not replace it. Always check for the complete entity ending with `;`.

3. **Forgetting to advance pointer correctly**: When you find and replace an entity, you must skip the entire entity length. A common bug is incrementing by 1 instead of `j+1`.

4. **Inefficient string concatenation**: In languages like Java and JavaScript, using `+=` on strings creates new objects each time. Better to use `StringBuilder` (Java) or array joining (JavaScript/Python).

## When You'll See This Pattern

This single-pass scanning with lookahead pattern appears in many string processing problems:

1. **Decode String (LeetCode 394)**: Similar scanning with brackets `[` and `]` instead of `&` and `;`
2. **Basic Calculator (LeetCode 224)**: Scanning arithmetic expressions with parentheses
3. **String Compression (LeetCode 443)**: Scanning and counting consecutive characters
4. **Find and Replace in String (LeetCode 833)**: Multiple replacements in a single pass

The core pattern is: "When you see a special marker, look ahead to gather context, then decide what to do."

## Key Takeaways

1. **Single-pass scanning beats multiple replacements**: When dealing with pattern replacement where patterns might overlap or interfere, process the string once from left to right.

2. **Use a state machine approach**: The algorithm naturally follows: "normal text" → "saw &" → "collecting entity" → "check and replace". This state-based thinking helps with many parsing problems.

3. **Hash maps are perfect for lookup tables**: When you have a fixed set of patterns to match, pre-store them in a hash map for O(1) lookups.

[Practice this problem on CodeJeet](/problem/html-entity-parser)
