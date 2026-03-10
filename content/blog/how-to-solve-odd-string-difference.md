---
title: "How to Solve Odd String Difference — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Odd String Difference. Easy difficulty, 61.8% acceptance rate. Topics: Array, Hash Table, String."
date: "2028-10-07"
category: "dsa-patterns"
tags: ["odd-string-difference", "array", "hash-table", "string", "easy"]
---

# How to Solve Odd String Difference

This problem asks us to find the single string in an array that has a different "difference pattern" than all others. Each string is converted to an array of integer differences between consecutive characters. All strings except one will share the same difference pattern, and we need to identify the odd one out.

What makes this problem interesting is that while it's conceptually straightforward, it requires careful handling of the difference calculation and pattern comparison. The challenge lies in efficiently identifying the outlier without comparing every string to every other string.

## Visual Walkthrough

Let's walk through an example: `words = ["abc", "bcd", "ace"]`

**Step 1: Calculate differences for each string**

For "abc":

- difference[0] = 'b' - 'a' = 1
- difference[1] = 'c' - 'b' = 1
- Pattern: [1, 1]

For "bcd":

- difference[0] = 'c' - 'b' = 1
- difference[1] = 'd' - 'c' = 1
- Pattern: [1, 1]

For "ace":

- difference[0] = 'c' - 'a' = 2
- difference[1] = 'e' - 'c' = 2
- Pattern: [2, 2]

**Step 2: Compare patterns**
We can see that "abc" and "bcd" share the pattern [1, 1], while "ace" has pattern [2, 2]. Since there are more strings with pattern [1, 1], "ace" is the odd string.

**Step 3: Return the result**
The function should return "ace".

## Brute Force Approach

A naive approach would be to:

1. Calculate the difference pattern for each string
2. Compare each pattern against all others to find which one is different
3. Return the corresponding string

This approach has O(m²) time complexity where m is the number of strings, since we're comparing each pattern against all others. While this would technically work for small inputs, it's inefficient and not what interviewers expect.

The brute force fails because it doesn't leverage the fact that we're looking for an outlier among mostly identical patterns. We can do better by tracking patterns as we encounter them.

## Optimal Solution

The optimal solution uses a hash map to track patterns and their frequencies. Here's the approach:

1. Calculate the difference pattern for each string
2. Store patterns in a hash map with their frequency count
3. Also store which string corresponds to each pattern
4. Find the pattern with frequency 1 and return its corresponding string

The key insight is that we only need to track two patterns at most: the majority pattern and the outlier pattern. Since all strings except one share the same pattern, we can identify the outlier by finding the pattern that appears only once.

<div class="code-group">

```python
# Time: O(m * n) where m = number of strings, n = length of each string
# Space: O(m * n) for storing patterns
def oddString(words):
    """
    Find the string with a different difference pattern than others.

    Args:
        words: List of strings of equal length

    Returns:
        The string with the unique difference pattern
    """
    # Dictionary to store patterns and their frequencies
    pattern_count = {}
    # Dictionary to map patterns back to their original string
    pattern_to_word = {}

    for word in words:
        # Calculate difference pattern for current word
        pattern = []
        for i in range(1, len(word)):
            # Calculate difference between consecutive characters
            diff = ord(word[i]) - ord(word[i-1])
            pattern.append(diff)

        # Convert pattern to tuple so it can be used as dictionary key
        pattern_tuple = tuple(pattern)

        # Update pattern frequency
        pattern_count[pattern_tuple] = pattern_count.get(pattern_tuple, 0) + 1

        # Store mapping from pattern to word (only need to store once per pattern)
        if pattern_tuple not in pattern_to_word:
            pattern_to_word[pattern_tuple] = word

    # Find the pattern with frequency 1 (the odd one out)
    for pattern, count in pattern_count.items():
        if count == 1:
            return pattern_to_word[pattern]

    # This line should never be reached given problem constraints
    return ""
```

```javascript
// Time: O(m * n) where m = number of strings, n = length of each string
// Space: O(m * n) for storing patterns
function oddString(words) {
  /**
   * Find the string with a different difference pattern than others.
   *
   * @param {string[]} words - Array of strings of equal length
   * @return {string} The string with the unique difference pattern
   */
  // Map to store patterns and their frequencies
  const patternCount = new Map();
  // Map to store patterns and their corresponding words
  const patternToWord = new Map();

  for (const word of words) {
    // Calculate difference pattern for current word
    const pattern = [];
    for (let i = 1; i < word.length; i++) {
      // Calculate difference between consecutive characters
      const diff = word.charCodeAt(i) - word.charCodeAt(i - 1);
      pattern.push(diff);
    }

    // Convert pattern to string to use as Map key
    const patternKey = pattern.join(",");

    // Update pattern frequency
    patternCount.set(patternKey, (patternCount.get(patternKey) || 0) + 1);

    // Store mapping from pattern to word (only need to store once per pattern)
    if (!patternToWord.has(patternKey)) {
      patternToWord.set(patternKey, word);
    }
  }

  // Find the pattern with frequency 1 (the odd one out)
  for (const [pattern, count] of patternCount) {
    if (count === 1) {
      return patternToWord.get(pattern);
    }
  }

  // This line should never be reached given problem constraints
  return "";
}
```

```java
// Time: O(m * n) where m = number of strings, n = length of each string
// Space: O(m * n) for storing patterns
import java.util.*;

class Solution {
    public String oddString(String[] words) {
        /**
         * Find the string with a different difference pattern than others.
         *
         * @param words Array of strings of equal length
         * @return The string with the unique difference pattern
         */
        // Map to store patterns and their frequencies
        Map<String, Integer> patternCount = new HashMap<>();
        // Map to store patterns and their corresponding words
        Map<String, String> patternToWord = new HashMap<>();

        for (String word : words) {
            // Calculate difference pattern for current word
            StringBuilder patternBuilder = new StringBuilder();
            for (int i = 1; i < word.length(); i++) {
                // Calculate difference between consecutive characters
                int diff = word.charAt(i) - word.charAt(i - 1);
                // Append diff with separator to handle multi-digit differences
                patternBuilder.append(diff).append(",");
            }
            String pattern = patternBuilder.toString();

            // Update pattern frequency
            patternCount.put(pattern, patternCount.getOrDefault(pattern, 0) + 1);

            // Store mapping from pattern to word (only need to store once per pattern)
            if (!patternToWord.containsKey(pattern)) {
                patternToWord.put(pattern, word);
            }
        }

        // Find the pattern with frequency 1 (the odd one out)
        for (Map.Entry<String, Integer> entry : patternCount.entrySet()) {
            if (entry.getValue() == 1) {
                return patternToWord.get(entry.getKey());
            }
        }

        // This line should never be reached given problem constraints
        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each of the `m` strings once
- For each string of length `n`, we calculate `n-1` differences
- The pattern comparison using hash maps is O(1) per operation
- Total: O(m × n)

**Space Complexity: O(m × n)**

- We store patterns for each string, each pattern has length `n-1`
- In the worst case, all patterns are different (though problem guarantees only one is different)
- We also store the mapping from patterns to words
- Total: O(m × n)

## Common Mistakes

1. **Forgetting that strings can have negative differences**: When calculating `words[i][j+1] - words[i][j]`, if the later character has a smaller ASCII value, the difference will be negative. This is perfectly valid and must be preserved in the pattern.

2. **Using arrays as dictionary keys without proper conversion**: In Python, lists cannot be used as dictionary keys because they're mutable. You must convert to tuple first. In JavaScript, arrays convert to strings when used as object keys, but the conversion might not be what you expect (e.g., `[1, -1]` becomes `"1,-1"` which is fine). In Java, you need to convert to a proper key type like String.

3. **Assuming the first pattern is the majority pattern**: Some candidates try to compare each pattern to the first one, assuming the first pattern represents the majority. This fails when the odd string happens to be first in the array. Always track frequencies properly.

4. **Not handling single-character strings**: While the problem states `n >= 2`, it's good practice to consider edge cases. For a string of length 2, the difference array has length 1. For length 1, it would be empty, but that's not in the constraints.

## When You'll See This Pattern

This problem uses the **pattern frequency counting** technique, which appears in many "find the odd one out" or "find the unique element" problems:

1. **Single Number (LeetCode 136)**: Find the element that appears exactly once while all others appear twice. Uses XOR instead of hash maps for constant space.

2. **Find the Difference (LeetCode 389)**: Find the extra character added to a string. Can be solved with frequency counting or XOR.

3. **Minimum Rounds to Complete All Tasks (LeetCode 2244)**: While not exactly the same, it also involves counting frequencies of elements to determine minimum groupings.

The core pattern is: when you need to find an element that doesn't follow the majority pattern, use frequency counting to efficiently identify outliers.

## Key Takeaways

1. **Hash maps are excellent for frequency counting**: When you need to track how many times something appears, a hash map (dictionary, object, or Map) is usually the right tool.

2. **Convert complex patterns to hashable types**: When using patterns as keys, ensure they're in a format that can be properly hashed and compared (tuples in Python, strings in JavaScript/Java).

3. **The "odd one out" pattern often means frequency = 1**: In problems where all elements except one share a property, look for the element with frequency 1 when counting occurrences of that property.

Related problems: [Minimum Rounds to Complete All Tasks](/problem/minimum-rounds-to-complete-all-tasks)
