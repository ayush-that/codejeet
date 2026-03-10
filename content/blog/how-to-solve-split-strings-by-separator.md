---
title: "How to Solve Split Strings by Separator — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Split Strings by Separator. Easy difficulty, 76.0% acceptance rate. Topics: Array, String."
date: "2027-11-26"
category: "dsa-patterns"
tags: ["split-strings-by-separator", "array", "string", "easy"]
---

# How to Solve Split Strings by Separator

This problem asks us to split each string in an array by a given separator character, then return all the resulting non-empty substrings in a single flattened array. While conceptually straightforward, it tests your ability to work with string splitting, array manipulation, and edge case handling. The key challenge is avoiding empty strings in the final result while efficiently processing each input string.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `words = ["one.two.three", "four.five..six"]`, `separator = '.'`

**Step 1:** Process first string `"one.two.three"`

- Split by `'.'` → `["one", "two", "three"]`
- All substrings are non-empty, so we keep all three

**Step 2:** Process second string `"four.five..six"`

- Split by `'.'` → `["four", "five", "", "six"]`
- Notice the empty string `""` from the consecutive dots
- We filter out empty strings, keeping only `["four", "five", "six"]`

**Step 3:** Combine results

- From first string: `["one", "two", "three"]`
- From second string: `["four", "five", "six"]`
- Final output: `["one", "two", "three", "four", "five", "six"]`

The key insight is that we need to handle:

1. Multiple consecutive separators (which create empty strings)
2. Separators at the start or end of strings
3. Strings with no separator at all

## Brute Force Approach

A naive approach might try to manually split each string by scanning character by character and building substrings. While this would work, it's more complex than necessary and error-prone. The brute force logic would look like:

1. Initialize an empty result array
2. For each string in `words`:
   - Initialize an empty current substring
   - For each character in the string:
     - If character equals separator:
       - If current substring is not empty, add it to result
       - Reset current substring to empty
     - Else:
       - Append character to current substring
   - After loop, if current substring is not empty, add it to result

This approach works but is verbose and requires careful handling of edge cases. More importantly, most programming languages provide built-in string splitting functions that are optimized and less error-prone. The "brute force" here isn't about time complexity (which is O(n) where n is total characters), but about reinventing the wheel instead of using language features effectively.

## Optimal Solution

The optimal approach uses each language's built-in string splitting functionality, which is designed exactly for this purpose. We iterate through each string, split it by the separator, filter out empty strings, and extend our result list with the valid substrings.

<div class="code-group">

```python
# Time: O(n * m) where n = number of words, m = average word length
# Space: O(n * m) for storing all substrings
def splitWordsBySeparator(words, separator):
    """
    Splits each string in words by separator and returns all non-empty substrings.

    Args:
        words: List of strings to split
        separator: Character to split by

    Returns:
        List of all non-empty substrings after splitting
    """
    result = []  # Store all valid substrings

    # Process each string in the input array
    for word in words:
        # Split the current word by the separator
        # This creates a list of substrings
        substrings = word.split(separator)

        # Filter out empty strings and add to result
        for substring in substrings:
            if substring:  # Check if substring is non-empty
                result.append(substring)

    return result
```

```javascript
// Time: O(n * m) where n = number of words, m = average word length
// Space: O(n * m) for storing all substrings
function splitWordsBySeparator(words, separator) {
  /**
   * Splits each string in words by separator and returns all non-empty substrings.
   *
   * @param {string[]} words - Array of strings to split
   * @param {string} separator - Character to split by
   * @return {string[]} Array of all non-empty substrings after splitting
   */
  const result = []; // Store all valid substrings

  // Process each string in the input array
  for (const word of words) {
    // Split the current word by the separator
    // The separator needs to be escaped if it's a special regex character
    const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const substrings = word.split(new RegExp(escapedSeparator));

    // Filter out empty strings and add to result
    for (const substring of substrings) {
      if (substring.length > 0) {
        // Check if substring is non-empty
        result.push(substring);
      }
    }
  }

  return result;
}
```

```java
// Time: O(n * m) where n = number of words, m = average word length
// Space: O(n * m) for storing all substrings
import java.util.*;

class Solution {
    public List<String> splitWordsBySeparator(List<String> words, char separator) {
        /**
         * Splits each string in words by separator and returns all non-empty substrings.
         *
         * @param words List of strings to split
         * @param separator Character to split by
         * @return List of all non-empty substrings after splitting
         */
        List<String> result = new ArrayList<>();  // Store all valid substrings

        // Process each string in the input array
        for (String word : words) {
            // Split the current word by the separator
            // We need to escape the separator since split() takes a regex
            String[] substrings = word.split("\\" + separator);

            // Filter out empty strings and add to result
            for (String substring : substrings) {
                if (!substring.isEmpty()) {  // Check if substring is non-empty
                    result.add(substring);
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N) where N is the total number of characters across all strings. We process each character exactly once when splitting each string. More precisely, if we have `n` words with average length `m`, the time complexity is O(n × m).

**Space Complexity:** O(N) in the worst case where no separators exist, so we store all original characters. In practice, we store all non-empty substrings, which could be up to all characters if there are no separators or empty strings.

The space breakdown:

- Python/JavaScript: O(N) for the result array containing all substrings
- Java: O(N) for the result List plus O(m) for temporary arrays during splitting

## Common Mistakes

1. **Forgetting to handle empty strings from consecutive separators**: This is the most common mistake. When you have `"a..b"` with separator `'.'`, the split creates `["a", "", "b"]`. Candidates often forget to filter out the empty middle string.

2. **Incorrect separator escaping in JavaScript/Java**: Both languages use regular expressions for `split()`. If the separator is a regex special character (like `.`, `|`, `*`, etc.), it needs to be escaped. For example, splitting by `'.'` requires `split("\\.")` in Java or using `RegExp` constructor in JavaScript.

3. **Not handling separator at start or end**: Strings like `".a.b."` split into `["", "a", "b", ""]`. Candidates might miss filtering the empty strings at the beginning and end.

4. **Using the wrong data structure for results**: Some candidates try to modify the input array in-place or use complex nested structures. A simple flat list/array is the correct choice.

## When You'll See This Pattern

This problem teaches fundamental string manipulation and parsing skills that appear in many coding problems:

1. **String parsing problems**: Any problem that requires breaking down strings into components uses similar logic. For example:
   - [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/) - Requires splitting by spaces and handling multiple spaces
   - [Number of Segments in a String](https://leetcode.com/problems/number-of-segments-in-a-string/) - Counts non-empty segments after splitting

2. **File path manipulation**: Problems like [Simplify Path](https://leetcode.com/problems/simplify-path/) require splitting by `/` and processing the components, similar to how we handle separators here.

3. **CSV/TSV parsing**: When processing comma-separated or tab-separated values, you use the same splitting logic with different separators.

## Key Takeaways

1. **Know your language's string utilities**: Most languages have optimized string splitting functions. Using them correctly (with proper escaping for regex characters) is more efficient and less error-prone than manual parsing.

2. **Always consider edge cases with separators**: Consecutive separators, separators at boundaries, and special regex characters are common pitfalls. Test with these cases during interviews.

3. **Flat data structures are often best**: When the problem asks for a "flattened" result (all substrings in one array), avoid complex nested structures. Build the result incrementally as you process each input.

This problem may seem simple, but it tests attention to detail with string manipulation—a fundamental skill for any software engineer working with text processing, file systems, or data parsing.

Related problems: [Split a String in Balanced Strings](/problem/split-a-string-in-balanced-strings)
