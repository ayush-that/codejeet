---
title: "How to Solve Evaluate the Bracket Pairs of a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Evaluate the Bracket Pairs of a String. Medium difficulty, 69.3% acceptance rate. Topics: Array, Hash Table, String."
date: "2028-11-07"
category: "dsa-patterns"
tags: ["evaluate-the-bracket-pairs-of-a-string", "array", "hash-table", "string", "medium"]
---

# How to Solve Evaluate the Bracket Pairs of a String

This problem asks us to replace bracketed keys in a string with their corresponding values from a dictionary. The tricky part is efficiently scanning the string, identifying bracket pairs, and performing substitutions while maintaining the rest of the string intact. What makes this interesting is that it's essentially a string parsing problem where we need to handle state transitions between "normal text" and "key extraction" modes.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
s = "(name)is(age)yearsold"
knowledge = [["name","bob"],["age","two"]]
```

**Step-by-step processing:**

1. Start with an empty result string: `""`
2. Read `(` → enter "key extraction" mode, start building current key: `""`
3. Read `n` → key becomes `"n"`
4. Read `a` → key becomes `"na"`
5. Read `m` → key becomes `"nam"`
6. Read `e` → key becomes `"name"`
7. Read `)` → exit "key extraction" mode
   - Look up `"name"` in knowledge → found `"bob"`
   - Append `"bob"` to result: `"bob"`
8. Read `i` → normal mode, append to result: `"bobi"`
9. Read `s` → normal mode, append: `"bobis"`
10. Read `(` → enter key extraction mode, reset key: `""`
11. Read `a` → key: `"a"`
12. Read `g` → key: `"ag"`
13. Read `e` → key: `"age"`
14. Read `)` → exit key extraction mode
    - Look up `"age"` in knowledge → found `"two"`
    - Append `"two"` to result: `"bobistwo"`
15. Read `y` → normal mode, append: `"bobistwoy"`
16. Read `e` → normal mode, append: `"bobistwoye"`
17. Read `a` → normal mode, append: `"bobistwoyea"`
18. Read `r` → normal mode, append: `"bobistwoyear"`
19. Read `s` → normal mode, append: `"bobistwoyears"`
20. Read `o` → normal mode, append: `"bobistwoyearso"`
21. Read `l` → normal mode, append: `"bobistwoyearsol"`
22. Read `d` → normal mode, append: `"bobistwoyearsold"`

**Output:** `"bobistwoyearsold"`

The key insight is that we need to track whether we're inside brackets or not, and efficiently look up keys when we encounter closing brackets.

## Brute Force Approach

A naive approach might involve:

1. Finding all bracket pairs using string searching
2. For each pair found, extract the key
3. Look up the key in knowledge
4. Replace the bracketed expression with the value

However, this becomes messy because:

- Finding all bracket pairs requires multiple passes through the string
- Replacing substrings creates new strings each time (inefficient in most languages)
- Handling nested brackets (though not present in this problem) would complicate the logic
- The order of replacements matters if brackets overlap

While we could implement this with repeated `find()` and `replace()` operations, it would be O(n²) in the worst case because each replacement creates a new string. For interview purposes, we should aim for a single-pass solution.

## Optimized Approach

The optimal solution uses a **single-pass parsing with state tracking**:

**Key Insight:** We can process the string character by character, maintaining:

1. A flag indicating whether we're currently inside brackets
2. A buffer to accumulate characters of the current key when inside brackets
3. A hash map/dictionary for O(1) key lookups

**Step-by-step reasoning:**

1. **Convert knowledge to a hash map** for O(1) lookups. This is crucial for efficiency.
2. **Initialize** an empty result string and a flag `in_bracket = False`.
3. **Iterate through each character** in the input string:
   - If we encounter `(`:
     - Set `in_bracket = True`
     - Start a new empty string for the key
   - If we encounter `)`:
     - Look up the accumulated key in the hash map
     - Append the value (or `"?"` if not found) to the result
     - Set `in_bracket = False`
   - For any other character:
     - If `in_bracket` is True: add character to current key
     - If `in_bracket` is False: add character directly to result
4. **Return** the final result string.

This approach is O(n) time and O(n) space for the result, plus O(k) space for the knowledge hash map.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n + k) where n = len(s), k = number of knowledge entries
# Space: O(n + k) for result string and knowledge dictionary
def evaluate(s: str, knowledge: List[List[str]]) -> str:
    # Step 1: Convert knowledge list to dictionary for O(1) lookups
    # This is crucial for efficiency - list lookups would be O(k) each time
    knowledge_dict = {}
    for key, value in knowledge:
        knowledge_dict[key] = value

    result = []  # Using list for efficient appending (O(1) amortized)
    current_key = []  # Buffer for building current key when inside brackets
    in_bracket = False  # Flag to track if we're inside parentheses

    # Step 2: Process each character in the string
    for char in s:
        if char == '(':
            # Entering a bracket - start accumulating key characters
            in_bracket = True
            current_key = []  # Reset key buffer
        elif char == ')':
            # Exiting a bracket - process the accumulated key
            key = ''.join(current_key)  # Convert list of chars to string

            # Look up key in dictionary, use '?' if not found
            value = knowledge_dict.get(key, '?')
            result.append(value)

            in_bracket = False  # No longer inside brackets
        else:
            # Regular character
            if in_bracket:
                # Inside brackets: add to current key buffer
                current_key.append(char)
            else:
                # Outside brackets: add directly to result
                result.append(char)

    # Step 3: Convert list to string and return
    return ''.join(result)
```

```javascript
// Time: O(n + k) where n = s.length, k = knowledge.length
// Space: O(n + k) for result string and knowledge map
function evaluate(s, knowledge) {
  // Step 1: Convert knowledge array to Map for O(1) lookups
  const knowledgeMap = new Map();
  for (const [key, value] of knowledge) {
    knowledgeMap.set(key, value);
  }

  let result = ""; // Result string
  let currentKey = ""; // Buffer for building current key
  let inBracket = false; // Flag to track bracket state

  // Step 2: Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "(") {
      // Entering a bracket - reset key buffer
      inBracket = true;
      currentKey = "";
    } else if (char === ")") {
      // Exiting a bracket - process the accumulated key
      const value = knowledgeMap.get(currentKey) || "?";
      result += value;
      inBracket = false;
    } else {
      // Regular character
      if (inBracket) {
        // Inside brackets: add to current key
        currentKey += char;
      } else {
        // Outside brackets: add directly to result
        result += char;
      }
    }
  }

  // Step 3: Return the final result
  return result;
}
```

```java
// Time: O(n + k) where n = s.length(), k = knowledge.size()
// Space: O(n + k) for result string and knowledge map
public String evaluate(String s, List<List<String>> knowledge) {
    // Step 1: Convert knowledge list to HashMap for O(1) lookups
    Map<String, String> knowledgeMap = new HashMap<>();
    for (List<String> pair : knowledge) {
        knowledgeMap.put(pair.get(0), pair.get(1));
    }

    StringBuilder result = new StringBuilder();  // Efficient string building
    StringBuilder currentKey = new StringBuilder();  // Buffer for current key
    boolean inBracket = false;  // Flag to track bracket state

    // Step 2: Process each character in the string
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        if (c == '(') {
            // Entering a bracket - reset key buffer
            inBracket = true;
            currentKey.setLength(0);  // Clear the StringBuilder
        } else if (c == ')') {
            // Exiting a bracket - process the accumulated key
            String key = currentKey.toString();
            String value = knowledgeMap.getOrDefault(key, "?");
            result.append(value);
            inBracket = false;
        } else {
            // Regular character
            if (inBracket) {
                // Inside brackets: add to current key
                currentKey.append(c);
            } else {
                // Outside brackets: add directly to result
                result.append(c);
            }
        }
    }

    // Step 3: Return the final result
    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k)**

- `O(k)` to build the hash map/dictionary from the knowledge list
- `O(n)` to iterate through the string once, where n is the length of s
- Each character is processed exactly once, and dictionary lookups are O(1) on average

**Space Complexity: O(n + k)**

- `O(k)` to store the knowledge in a hash map
- `O(n)` for the result string (in the worst case, if there are no substitutions)
- Additional `O(m)` for the current key buffer, where m is the maximum key length, but this is negligible compared to n

## Common Mistakes

1. **Using list lookup instead of hash map**: Some candidates try to search through the knowledge list for each key, resulting in O(nk) time instead of O(n). Always convert to a hash map/dictionary for O(1) lookups.

2. **Forgetting to reset the key buffer**: When encountering `(`, you must reset/clear the current key buffer. Otherwise, keys from previous brackets will accumulate.

3. **Not handling missing keys correctly**: The problem specifies to use `"?"` when a key is not found. Some candidates return empty string or throw an error instead.

4. **Inefficient string concatenation**: In languages like Java and Python, using `+=` in a loop creates new strings each time (O(n²)). Use `StringBuilder` (Java), list joining (Python), or similar efficient methods.

5. **Misunderstanding bracket nesting**: While this problem doesn't have nested brackets, some candidates overcomplicate the solution by trying to handle them. Read the problem statement carefully - it says "bracket pairs" not "nested brackets".

## When You'll See This Pattern

This pattern of **single-pass parsing with state tracking** appears in many string processing problems:

1. **Basic Calculator (LeetCode 224)** - Similar state tracking for parentheses, but with more complex operators and precedence.
2. **Decode String (LeetCode 394)** - Uses similar bracket tracking but with numeric multipliers and recursion/stack.
3. **Tag Validator (LeetCode 591)** - More complex version with nested tags and CDATA sections.
4. **Apply Substitutions (LeetCode 3035)** - Almost identical pattern of finding and replacing patterns in a string.

The core technique is maintaining a state machine while iterating through the string, with different behaviors based on the current state and the character being processed.

## Key Takeaways

1. **Convert lookups to hash maps**: Whenever you need to repeatedly search for values, convert your data to a hash map/dictionary first for O(1) lookups.

2. **Use state flags for parsing**: When processing structured text with different "modes" (like inside/outside brackets), use boolean flags or state variables to track your current mode.

3. **Build strings efficiently**: In most languages, avoid repeated string concatenation in loops. Use language-specific efficient builders (`StringBuilder` in Java, list joining in Python).

4. **Process character by character**: For parsing problems, a single left-to-right pass is often sufficient and optimal. Don't overcomplicate with multiple passes or regex unless necessary.

Related problems: [Apply Substitutions](/problem/apply-substitutions)
