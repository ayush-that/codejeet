---
title: "How to Solve Count Prefixes of a Given String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Prefixes of a Given String. Easy difficulty, 74.2% acceptance rate. Topics: Array, String."
date: "2027-09-08"
category: "dsa-patterns"
tags: ["count-prefixes-of-a-given-string", "array", "string", "easy"]
---

# How to Solve Count Prefixes of a Given String

This problem asks us to count how many strings in a given array are prefixes of a target string. While conceptually straightforward, it tests your understanding of string operations and careful handling of edge cases. The challenge lies in implementing an efficient check without unnecessary overhead, and avoiding subtle bugs when comparing strings of different lengths.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `words = ["a", "b", "c", "ab", "abc", "bc"]`
- `s = "abc"`

We need to check each word to see if it's a prefix of "abc":

1. **"a"** vs "abc": Compare first character → "a" matches "a". "a" length is 1, which is ≤ "abc" length (3). All characters match → **YES**
2. **"b"** vs "abc": Compare first character → "b" vs "a" → mismatch → **NO**
3. **"c"** vs "abc": Compare first character → "c" vs "a" → mismatch → **NO**
4. **"ab"** vs "abc": Compare first 2 characters → "a" matches "a", "b" matches "b". "ab" length (2) ≤ "abc" length (3). All characters match → **YES**
5. **"abc"** vs "abc": Compare all 3 characters → all match. Lengths equal → **YES**
6. **"bc"** vs "abc": Compare first character → "b" vs "a" → mismatch → **NO**

Result: 3 strings are prefixes ("a", "ab", "abc").

Notice two important checks:

1. The candidate word must not be longer than `s` (can't be a prefix if it's longer)
2. We only need to compare characters up to the length of the candidate word

## Brute Force Approach

The most straightforward approach is to iterate through each word in the array and check if it's a prefix of `s`. For each word:

1. Check if the word's length is greater than `s`'s length → if yes, it can't be a prefix
2. Compare each character of the word with the corresponding character in `s`
3. If all characters match, increment our count

While this approach is correct, it's worth considering what a truly "brute force" solution might look like. Some candidates might try to generate all prefixes of `s` first, then check each word against this list. This would be less efficient since generating all prefixes takes O(n²) time where n is the length of `s`, while our simple character-by-character comparison is O(L) per word where L is the word's length.

The simple iteration approach is actually optimal for this problem, so we'll focus on implementing it correctly with proper edge case handling.

## Optimal Solution

The optimal solution directly implements the intuitive approach: for each word in the array, check if it's a prefix of `s` by comparing characters. We need to be careful about:

- Words longer than `s` (immediately not a prefix)
- Empty strings (an empty string is technically a prefix of any string)
- Early termination when a mismatch is found

Here's the complete implementation:

<div class="code-group">

```python
# Time: O(n * m) where n = len(words), m = avg word length
# Space: O(1) - we only use a counter variable
def countPrefixes(words, s):
    """
    Count how many strings in words are prefixes of s.

    Args:
        words: List of strings to check
        s: The target string

    Returns:
        Integer count of prefix matches
    """
    count = 0  # Initialize counter for valid prefixes

    # Iterate through each word in the array
    for word in words:
        # A word can only be a prefix if it's not longer than s
        if len(word) > len(s):
            continue  # Skip to next word

        # Assume it's a prefix until proven otherwise
        is_prefix = True

        # Compare each character of word with corresponding character in s
        for i in range(len(word)):
            if word[i] != s[i]:  # Mismatch found
                is_prefix = False
                break  # No need to check further

        # If all characters matched, increment count
        if is_prefix:
            count += 1

    return count
```

```javascript
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(1) - only using a counter variable
function countPrefixes(words, s) {
  /**
   * Count how many strings in words are prefixes of s.
   *
   * @param {string[]} words - Array of strings to check
   * @param {string} s - The target string
   * @return {number} Count of prefix matches
   */
  let count = 0; // Initialize counter for valid prefixes

  // Iterate through each word in the array
  for (const word of words) {
    // A word can only be a prefix if it's not longer than s
    if (word.length > s.length) {
      continue; // Skip to next word
    }

    // Assume it's a prefix until proven otherwise
    let isPrefix = true;

    // Compare each character of word with corresponding character in s
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== s[i]) {
        // Mismatch found
        isPrefix = false;
        break; // No need to check further
      }
    }

    // If all characters matched, increment count
    if (isPrefix) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(1) - only using a counter variable
class Solution {
    public int countPrefixes(String[] words, String s) {
        /**
         * Count how many strings in words are prefixes of s.
         *
         * @param words Array of strings to check
         * @param s The target string
         * @return Count of prefix matches
         */
        int count = 0;  // Initialize counter for valid prefixes

        // Iterate through each word in the array
        for (String word : words) {
            // A word can only be a prefix if it's not longer than s
            if (word.length() > s.length()) {
                continue;  // Skip to next word
            }

            // Assume it's a prefix until proven otherwise
            boolean isPrefix = true;

            // Compare each character of word with corresponding character in s
            for (int i = 0; i < word.length(); i++) {
                if (word.charAt(i) != s.charAt(i)) {  // Mismatch found
                    isPrefix = false;
                    break;  // No need to check further
                }
            }

            // If all characters matched, increment count
            if (isPrefix) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m), where n is the number of words in the array and m is the average length of the words. In the worst case, we might compare every character of every word against `s`. However, we optimize by:

- Skipping words longer than `s` immediately
- Breaking early when a mismatch is found

**Space Complexity:** O(1), as we only use a constant amount of extra space (the counter variable and loop indices). We don't create any additional data structures proportional to the input size.

## Common Mistakes

1. **Forgetting the length check**: The most common error is not checking if `word.length() > s.length()` first. If you try to access `s[i]` where `i >= s.length()`, you'll get an index out of bounds error (or undefined behavior in some languages).

2. **Using substring comparison incorrectly**: Some candidates try to use `s.startswith(word)` or similar built-in functions without understanding their behavior with longer words. While Python's `startswith` handles this gracefully, in other languages or when implementing manually, this is a key check.

3. **Not breaking early on mismatch**: Continuing to compare characters after finding a mismatch wastes time. Always use `break` when you find the first non-matching character.

4. **Handling empty strings incorrectly**: An empty string is a prefix of any string. Our solution handles this correctly because the inner loop won't execute (word length is 0), and `is_prefix` remains true.

## When You'll See This Pattern

This problem uses a fundamental pattern: **iterative character-by-character comparison with early termination**. You'll see variations of this pattern in:

1. **Check If a Word Occurs As a Prefix of Any Word in a Sentence (LeetCode 1455)**: Similar logic but reversed - checking if a search word is a prefix of any word in a sentence.

2. **Check If String Is a Prefix of Array (LeetCode 1961)**: Here you're building a string from array elements and checking if it matches a prefix of the target.

3. **Longest Common Prefix (LeetCode 14)**: Uses similar character-by-character comparison across multiple strings to find the longest shared prefix.

4. **Implement strStr() (LeetCode 28)**: While more complex (full substring search), it builds on similar character comparison logic.

The core technique of comparing strings from the beginning, character by character, with length checks and early termination, is fundamental to many string manipulation problems.

## Key Takeaways

1. **Always check lengths first**: Before comparing strings character by character, verify that the candidate prefix isn't longer than the target string. This prevents index errors and is logically necessary.

2. **Early termination is crucial for efficiency**: Once you find a mismatch, stop comparing. This optimization is simple but important for performance, especially with long strings.

3. **Empty string edge case matters**: Remember that an empty string is a valid prefix of any string. Your solution should handle this correctly (our solution does because the comparison loop doesn't execute for empty strings).

4. **This pattern extends to many string problems**: The technique of comparing strings from the start with careful bounds checking appears in prefix, suffix, and substring problems across many difficulty levels.

Related problems: [Check If a Word Occurs As a Prefix of Any Word in a Sentence](/problem/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence), [Check If String Is a Prefix of Array](/problem/check-if-string-is-a-prefix-of-array), [Counting Words With a Given Prefix](/problem/counting-words-with-a-given-prefix)
