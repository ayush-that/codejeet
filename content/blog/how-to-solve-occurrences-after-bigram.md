---
title: "How to Solve Occurrences After Bigram — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Occurrences After Bigram. Easy difficulty, 63.9% acceptance rate. Topics: String."
date: "2027-08-19"
category: "dsa-patterns"
tags: ["occurrences-after-bigram", "string", "easy"]
---

# How to Solve Occurrences After Bigram

This problem asks us to find all words that appear immediately after a specific bigram (two-word sequence) in a given text. While conceptually straightforward, it requires careful attention to string parsing and boundary conditions. The interesting part is how we efficiently process the text while correctly identifying word boundaries and handling edge cases.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
text = "alice is a good girl she is a good student"
first = "a"
second = "good"
```

**Step-by-step process:**

1. Split the text into words: `["alice", "is", "a", "good", "girl", "she", "is", "a", "good", "student"]`
2. We'll examine each position `i` from 0 to `n-3` (where `n` is the number of words)
3. Check if `words[i] == first` and `words[i+1] == second`
4. If true, add `words[i+2]` to our result

Let's trace through:

- Position 0: "alice" ≠ "a" → skip
- Position 1: "is" ≠ "a" → skip
- Position 2: "a" = "a" ✓ and "good" = "good" ✓ → add "girl" (position 4)
- Position 3: "good" ≠ "a" → skip
- Position 4: "girl" ≠ "a" → skip
- Position 5: "she" ≠ "a" → skip
- Position 6: "is" ≠ "a" → skip
- Position 7: "a" = "a" ✓ and "good" = "good" ✓ → add "student" (position 9)

**Result:** `["girl", "student"]`

## Brute Force Approach

The most straightforward approach is to:

1. Split the text into words
2. Iterate through all possible starting positions
3. Check if the current word matches `first` and the next word matches `second`
4. If yes, add the word two positions ahead to the result

While this approach is actually optimal for this problem (O(n) time), some candidates might try more complex approaches like:

- Using regular expressions (overkill and error-prone)
- Trying to process the text without splitting (harder to handle word boundaries)
- Using nested loops unnecessarily

The key insight is that we only need a single pass through the words, checking each possible starting position exactly once.

## Optimal Solution

The optimal solution involves a single linear scan through the words. We split the text into words, then iterate through indices 0 to `n-3`, checking if the current word matches `first` and the next word matches `second`. When we find a match, we add the word at position `i+2` to our result.

<div class="code-group">

```python
# Time: O(n) where n is the number of words in text
# Space: O(n) for storing the result and split words
def findOcurrences(text: str, first: str, second: str):
    """
    Find all words that appear immediately after the bigram (first, second).

    Args:
        text: The input text to search
        first: The first word of the bigram
        second: The second word of the bigram

    Returns:
        List of all words that follow occurrences of the bigram
    """
    # Step 1: Split the text into individual words
    # This handles word boundaries automatically
    words = text.split()

    # Step 2: Initialize result list
    result = []

    # Step 3: Iterate through words, stopping 2 positions before the end
    # We need to check words[i], words[i+1], and words[i+2]
    # So i can only go up to len(words) - 3
    for i in range(len(words) - 2):
        # Step 4: Check if current word matches 'first'
        # AND next word matches 'second'
        if words[i] == first and words[i+1] == second:
            # Step 5: If match found, add the word at i+2 to result
            result.append(words[i+2])

    # Step 6: Return the collected results
    return result
```

```javascript
// Time: O(n) where n is the number of words in text
// Space: O(n) for storing the result and split words
function findOcurrences(text, first, second) {
  /**
   * Find all words that appear immediately after the bigram (first, second).
   *
   * @param {string} text - The input text to search
   * @param {string} first - The first word of the bigram
   * @param {string} second - The second word of the bigram
   * @return {string[]} - Array of all words that follow occurrences of the bigram
   */

  // Step 1: Split the text into individual words
  // Using regex /\s+/ handles multiple spaces correctly
  const words = text.split(/\s+/);

  // Step 2: Initialize result array
  const result = [];

  // Step 3: Iterate through words, stopping 2 positions before the end
  // We need to check words[i], words[i+1], and words[i+2]
  // So i can only go up to words.length - 3
  for (let i = 0; i < words.length - 2; i++) {
    // Step 4: Check if current word matches 'first'
    // AND next word matches 'second'
    if (words[i] === first && words[i + 1] === second) {
      // Step 5: If match found, add the word at i+2 to result
      result.push(words[i + 2]);
    }
  }

  // Step 6: Return the collected results
  return result;
}
```

```java
// Time: O(n) where n is the number of words in text
// Space: O(n) for storing the result and split words
import java.util.ArrayList;
import java.util.List;

class Solution {
    public String[] findOcurrences(String text, String first, String second) {
        /**
         * Find all words that appear immediately after the bigram (first, second).
         *
         * @param text - The input text to search
         * @param first - The first word of the bigram
         * @param second - The second word of the bigram
         * @return Array of all words that follow occurrences of the bigram
         */

        // Step 1: Split the text into individual words
        // Using "\\s+" regex handles multiple spaces correctly
        String[] words = text.split("\\s+");

        // Step 2: Initialize result list (using ArrayList for dynamic sizing)
        List<String> resultList = new ArrayList<>();

        // Step 3: Iterate through words, stopping 2 positions before the end
        // We need to check words[i], words[i+1], and words[i+2]
        // So i can only go up to words.length - 3
        for (int i = 0; i < words.length - 2; i++) {
            // Step 4: Check if current word matches 'first'
            // AND next word matches 'second'
            if (words[i].equals(first) && words[i+1].equals(second)) {
                // Step 5: If match found, add the word at i+2 to result
                resultList.add(words[i+2]);
            }
        }

        // Step 6: Convert List to array and return
        // This matches the expected return type
        return resultList.toArray(new String[0]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Splitting the text into words takes O(n) where n is the length of the text
- The loop runs at most n-2 times (where n is the number of words), which is O(n)
- Each iteration performs constant-time operations (string comparisons)

**Space Complexity: O(n)**

- The `words` array stores all words from the text: O(n) space
- The result list in worst case could contain O(n) words (if every third word follows the bigram)
- Total space: O(n) for words + O(n) for result = O(n)

## Common Mistakes

1. **Off-by-one errors in loop bounds**: Forgetting that we need to check `words[i+2]`, so the loop should only go to `len(words)-3`. If you go to `len(words)-2`, you'll get an IndexError when trying to access `words[i+2]`.

2. **Incorrect string splitting**: Using simple `split(" ")` instead of `split("\\s+")` or `split(/\s+/)` can fail when there are multiple spaces between words. Always use regex to handle multiple whitespace characters.

3. **Not handling empty text or short text**: If the text has fewer than 3 words, we should return an empty array. The loop condition `i < words.length - 2` handles this automatically since if `words.length < 3`, the loop won't execute.

4. **String comparison issues in Java**: Using `==` instead of `.equals()` for string comparison in Java. Remember: `==` compares object references, while `.equals()` compares actual string content.

## When You'll See This Pattern

This problem uses a **sliding window of fixed size** pattern (window size = 3 words). You'll see similar patterns in:

1. **Find All Anagrams in a String (LeetCode 438)**: Uses a sliding window to find all occurrences of anagrams of a pattern in a string.

2. **Maximum Average Subarray I (LeetCode 643)**: Uses a fixed-size sliding window to find the maximum average of any contiguous subarray of length k.

3. **Minimum Size Subarray Sum (LeetCode 209)**: Uses a variable-size sliding window to find the minimal length of a contiguous subarray whose sum is at least target.

The key insight is recognizing when you need to examine contiguous sequences of elements, which often suggests a sliding window approach.

## Key Takeaways

1. **Fixed-size sliding windows** are perfect for problems where you need to examine contiguous sequences of a specific length. The window "slides" one position at a time, reusing computations when possible.

2. **Always handle edge cases explicitly**: Short inputs, empty inputs, and boundary conditions are common sources of errors. Test with minimal cases (0, 1, 2 words) to catch these.

3. **String splitting with regex** is more robust than simple space splitting. Use `split("\\s+")` in Java, `split(/\s+/)` in JavaScript, or `split()` in Python to handle multiple spaces correctly.

[Practice this problem on CodeJeet](/problem/occurrences-after-bigram)
