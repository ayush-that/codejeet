---
title: "How to Solve Decrypt String from Alphabet to Integer Mapping — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Decrypt String from Alphabet to Integer Mapping. Easy difficulty, 80.6% acceptance rate. Topics: String."
date: "2026-09-24"
category: "dsa-patterns"
tags: ["decrypt-string-from-alphabet-to-integer-mapping", "string", "easy"]
---

# How to Solve Decrypt String from Alphabet to Integer Mapping

This problem asks us to convert a string containing digits and `#` symbols into English lowercase letters based on a specific mapping. What makes this problem interesting is the dual representation system: single digits (1-9) map to 'a'-'i', while two-digit numbers followed by `#` (10-26) map to 'j'-'z'. The challenge lies in correctly identifying which pattern we're dealing with at each position in the string.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the input string `s = "10#11#12"`.

**Step 1:** Start at index 0. We see '1', but we need to check if this is part of a two-digit pattern. Look ahead to see if there's a `#` two positions ahead.

**Step 2:** At index 0, we see '1', then '0', then '#'. This matches the pattern `10#`, which maps to 'j'. Add 'j' to our result.

**Step 3:** Move past the three characters we just processed. We're now at index 3.

**Step 4:** At index 3, we see '1'. Check ahead: index 4 is '1', index 5 is '#'. This is `11#`, which maps to 'k'. Add 'k' to result.

**Step 5:** Move past three more characters. We're now at index 6.

**Step 6:** At index 6, we see '1'. Check ahead: index 7 is '2', but there's no index 8 (end of string), so this isn't a `#` pattern. Therefore, '1' maps to 'a', and '2' maps to 'b'.

**Step 7:** Final result: "jkab"

The key insight is that we need to process the string from left to right, but we must look ahead to determine if we're dealing with a single-digit or two-digit pattern.

## Brute Force Approach

A naive approach might try to process the string from left to right character by character, but this would fail because we need to look ahead to identify the `#` patterns. Another brute force approach could be:

1. Scan through the string looking for all `#` symbols
2. For each `#`, extract the two digits before it as one mapping
3. Remove those processed characters from consideration
4. Process any remaining single digits

However, this approach becomes messy because removing characters changes indices, and we'd need to handle overlapping patterns carefully. The code would be complex and error-prone with multiple passes through the string.

A better brute force would be to process from right to left, which simplifies the lookahead logic but still requires careful index management. Let's see why the right-to-left approach is actually optimal for this problem.

## Optimal Solution

The optimal solution processes the string from right to left. This is clever because when we encounter a `#`, we know exactly how many characters to process (the two digits before it). By working backwards, we avoid the need to look ahead into unprocessed portions of the string.

Here's the reasoning:

1. Start from the end of the string and move left
2. If we see a `#`, take the two digits before it, convert to a letter, and move left 3 positions
3. If we see a digit (not preceded by `#` in our backward traversal), convert it to a letter and move left 1 position
4. Build the result string in reverse, then reverse it at the end

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def freqAlphabets(s: str) -> str:
    """
    Convert string with digits and # to letters using mapping:
    - 1-9 -> a-i
    - 10#-26# -> j-z
    """
    result = []  # Will store characters in reverse order
    i = len(s) - 1  # Start from the end of the string

    while i >= 0:
        # Check if current character is '#'
        if s[i] == '#':
            # Take the two digits before '#' to form a two-digit number
            # s[i-2:i] gives us the two characters before #
            num = int(s[i-2:i])  # Convert to integer
            # Convert to letter: 'j' is 10, so subtract 9 from num
            # ord('j') - 1 gives us the ASCII value just before 'j'
            # Then add num - 9 to get the correct letter
            result.append(chr(ord('j') + num - 10))
            i -= 3  # Move past the three characters: two digits and #
        else:
            # Single digit mapping: '1' -> 'a', '2' -> 'b', etc.
            # Convert digit to integer, then to corresponding letter
            # ord('a') - 1 gives us ASCII value before 'a'
            # Add the digit value to get correct letter
            result.append(chr(ord('a') + int(s[i]) - 1))
            i -= 1  # Move past this single digit

    # Reverse the result since we built it backwards
    return ''.join(reversed(result))
```

```javascript
// Time: O(n) | Space: O(n)
function freqAlphabets(s) {
  /**
   * Convert string with digits and # to letters using mapping:
   * - 1-9 -> a-i
   * - 10#-26# -> j-z
   */
  const result = []; // Will store characters in reverse order
  let i = s.length - 1; // Start from the end of the string

  while (i >= 0) {
    // Check if current character is '#'
    if (s[i] === "#") {
      // Take the two digits before '#' to form a two-digit number
      // s.substring(i-2, i) gives us the two characters before #
      const num = parseInt(s.substring(i - 2, i), 10);
      // Convert to letter: 'j' is 10, so subtract 10 from num
      // 'j'.charCodeAt(0) gives ASCII of 'j'
      // Add (num - 10) to get correct letter
      result.push(String.fromCharCode("j".charCodeAt(0) + num - 10));
      i -= 3; // Move past the three characters: two digits and #
    } else {
      // Single digit mapping: '1' -> 'a', '2' -> 'b', etc.
      // Convert digit to integer, then to corresponding letter
      // 'a'.charCodeAt(0) gives ASCII of 'a'
      // Add (digit - 1) to get correct letter
      result.push(String.fromCharCode("a".charCodeAt(0) + parseInt(s[i]) - 1));
      i -= 1; // Move past this single digit
    }
  }

  // Reverse the result since we built it backwards
  return result.reverse().join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String freqAlphabets(String s) {
        /**
         * Convert string with digits and # to letters using mapping:
         * - 1-9 -> a-i
         * - 10#-26# -> j-z
         */
        StringBuilder result = new StringBuilder();
        int i = s.length() - 1;  // Start from the end of the string

        while (i >= 0) {
            // Check if current character is '#'
            if (s.charAt(i) == '#') {
                // Take the two digits before '#' to form a two-digit number
                // s.substring(i-2, i) gives us the two characters before #
                int num = Integer.parseInt(s.substring(i - 2, i));
                // Convert to letter: 'j' is 10, so subtract 10 from num
                // 'j' has ASCII value, add (num - 10) to get correct letter
                result.append((char) ('j' + num - 10));
                i -= 3;  // Move past the three characters: two digits and #
            } else {
                // Single digit mapping: '1' -> 'a', '2' -> 'b', etc.
                // Convert digit to integer, then to corresponding letter
                // 'a' has ASCII value, add (digit - 1) to get correct letter
                result.append((char) ('a' + (s.charAt(i) - '0') - 1));
                i -= 1;  // Move past this single digit
            }
        }

        // Reverse the result since we built it backwards
        return result.reverse().toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input string. We process each character exactly once in our single pass through the string. Even though we're moving backwards, we still visit each character only once.

**Space Complexity:** O(n) for the output string. In the worst case, if all characters are single digits, we'll have n/2 characters in the output (since each digit becomes one letter). The auxiliary space used by the result list/array is proportional to the output size.

## Common Mistakes

1. **Off-by-one errors in ASCII conversion:** The most common mistake is getting the mapping wrong. Remember:
   - '1' maps to 'a': `ord('a') + 1 - 1 = ord('a')`
   - '10#' maps to 'j': `ord('j') + 10 - 10 = ord('j')`
     Always test with boundary cases like '1' → 'a' and '9' → 'i', '10#' → 'j' and '26#' → 'z'.

2. **Incorrect index handling when encountering #:** When you see a `#`, you need to process the TWO digits before it. A common error is to only move back 2 positions instead of 3 (the two digits plus the `#` itself).

3. **Forgetting to reverse the result:** Since we build the string backwards, we must reverse it at the end. This is easy to forget during an interview.

4. **Not handling edge cases:** Test with:
   - Strings with only single digits: "123"
   - Strings with only `#` patterns: "10#11#12#"
   - Mixed strings: "123#456#"
   - Empty string (though constraints typically guarantee non-empty)

## When You'll See This Pattern

This problem teaches the **right-to-left processing** pattern, which is useful when later characters provide context for interpreting earlier ones. You'll see similar patterns in:

1. **Roman to Integer (LeetCode 13):** Process Roman numerals from right to left because smaller numerals to the left of larger ones indicate subtraction.

2. **Decode String (LeetCode 394):** While typically solved with stacks, right-to-left processing can help identify where repetition patterns end.

3. **Basic Calculator II (LeetCode 227):** Processing from right to left can simplify handling of operator precedence without using stacks.

The key insight is that when the meaning of a character depends on what comes after it, processing backwards often simplifies the logic.

## Key Takeaways

1. **When lookahead is needed, consider processing backwards:** If you find yourself needing to check characters ahead of your current position, try working from the end instead. This turns "lookahead" into simply examining characters you've already passed.

2. **ASCII arithmetic is cleaner than mapping dictionaries:** For sequential mappings like 1→a, 2→b, etc., using ASCII arithmetic (`chr(ord('a') + num - 1)`) is more elegant and efficient than maintaining a dictionary.

3. **Build results in reverse when processing backwards:** Remember that if you process input backwards, you'll need to reverse your output. Using a list/array and reversing at the end is more efficient than repeatedly inserting at the beginning of a string.

[Practice this problem on CodeJeet](/problem/decrypt-string-from-alphabet-to-integer-mapping)
