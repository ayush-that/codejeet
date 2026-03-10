---
title: "How to Solve Truncate Sentence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Truncate Sentence. Easy difficulty, 86.7% acceptance rate. Topics: Array, String."
date: "2028-07-02"
category: "dsa-patterns"
tags: ["truncate-sentence", "array", "string", "easy"]
---

# How to Solve "Truncate Sentence"

The problem asks us to truncate a sentence after the first `k` words. While this seems straightforward, the challenge lies in handling the string manipulation correctly without using built-in split functions (though they're allowed) and understanding the exact output format requirements. What makes this interesting is that it's a simple problem that tests your attention to detail with string indexing and edge cases.

## Visual Walkthrough

Let's trace through an example step by step to build intuition.

**Example:**  
Sentence: `"Hello how are you Contestant"`  
k: `4`

We need to return the first 4 words of this sentence.

**Step-by-step reasoning:**

1. The sentence has words separated by single spaces: `"Hello"`, `"how"`, `"are"`, `"you"`, `"Contestant"`
2. We want the first 4 words: `"Hello how are you"`
3. We need to reconstruct this as a string with spaces between words
4. The key insight: We need to find where the 4th word ends and stop there

**Finding the cutoff point:**

- Count spaces as we traverse the string
- Each space indicates a transition from one word to the next
- After we've seen `k-1` spaces, we're still within the kth word
- When we see the kth space, that's where we should stop (right before that space)

In our example:

- Position 0-4: `"Hello"` (ends with space at index 5)
- Position 6-8: `"how"` (ends with space at index 9)
- Position 10-12: `"are"` (ends with space at index 13)
- Position 14-16: `"you"` (ends with space at index 17)
- Position 18-27: `"Contestant"`

We want to stop after `"you"`, which is at index 16. The space after `"you"` is at index 17, which is the 4th space (k=4). So we need to take the substring from index 0 to index 16.

## Brute Force Approach

The most straightforward approach is to split the sentence into words, take the first k words, and join them back together. While this is actually optimal for this problem (O(n) time and space), let's consider what a truly naive approach might look like if we were avoiding built-in split functions:

A naive approach might involve:

1. Creating an empty list for words
2. Iterating through the string character by character
3. Building each word until we hit a space
4. Adding each word to the list
5. Taking the first k words from the list
6. Joining them with spaces

This approach works but is more verbose than necessary. The actual "brute force" using split is already optimal, so the main consideration here is whether to use built-in functions or implement the logic manually.

## Optimal Solution

The optimal solution has two variants:

1. **Using split and join** (simplest and most readable)
2. **Manual traversal** (more efficient in terms of space if we only track the end index)

Both approaches have O(n) time complexity, but the manual approach can have O(1) extra space if we don't create intermediate arrays.

Here are both implementations:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the words array
def truncateSentence_split(s: str, k: int) -> str:
    """
    Split the sentence into words, take first k, join back.

    Steps:
    1. Split the sentence by spaces to get individual words
    2. Slice the list to get first k words
    3. Join them back with spaces

    Example: "Hello how are you", k=3 -> ["Hello", "how", "are"] -> "Hello how are"
    """
    # Split the sentence into words
    words = s.split(' ')

    # Take only the first k words
    first_k_words = words[:k]

    # Join them back with spaces
    return ' '.join(first_k_words)


# Time: O(n) | Space: O(1) extra space (excluding output)
def truncateSentence_manual(s: str, k: int) -> str:
    """
    Manually find where to truncate by counting spaces.

    Steps:
    1. Initialize space_count to track how many spaces we've seen
    2. Iterate through the string
    3. When we see a space, increment space_count
    4. When space_count == k, we've found the end point
    5. Return substring from start to current position

    Example: "Hello how are you", k=3
    - At index 5 (space after Hello): space_count=1
    - At index 9 (space after how): space_count=2
    - At index 13 (space after are): space_count=3 -> stop, return s[0:13]
    """
    space_count = 0

    # Iterate through each character in the string
    for i in range(len(s)):
        # If we encounter a space, increment our counter
        if s[i] == ' ':
            space_count += 1

            # If we've seen k spaces, we've passed k words
            # The current position i is a space after the kth word
            # So we return everything up to but not including this space
            if space_count == k:
                return s[:i]

    # If we never hit k spaces, it means k >= number of words
    # In this case, return the entire string
    return s
```

```javascript
// Time: O(n) | Space: O(n) for the words array
function truncateSentenceSplit(s, k) {
  /**
   * Split the sentence into words, take first k, join back.
   *
   * Steps:
   * 1. Split the sentence by spaces to get individual words
   * 2. Slice the array to get first k words
   * 3. Join them back with spaces
   *
   * Example: "Hello how are you", k=3 -> ["Hello", "how", "are"] -> "Hello how are"
   */

  // Split the sentence into words
  const words = s.split(" ");

  // Take only the first k words
  const firstKWords = words.slice(0, k);

  // Join them back with spaces
  return firstKWords.join(" ");
}

// Time: O(n) | Space: O(1) extra space (excluding output)
function truncateSentenceManual(s, k) {
  /**
   * Manually find where to truncate by counting spaces.
   *
   * Steps:
   * 1. Initialize spaceCount to track how many spaces we've seen
   * 2. Iterate through the string
   * 3. When we see a space, increment spaceCount
   * 4. When spaceCount == k, we've found the end point
   * 5. Return substring from start to current position
   *
   * Example: "Hello how are you", k=3
   * - At index 5 (space after Hello): spaceCount=1
   * - At index 9 (space after how): spaceCount=2
   * - At index 13 (space after are): spaceCount=3 -> stop, return s.substring(0, 13)
   */

  let spaceCount = 0;

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    // If we encounter a space, increment our counter
    if (s[i] === " ") {
      spaceCount++;

      // If we've seen k spaces, we've passed k words
      // The current position i is a space after the kth word
      // So we return everything up to but not including this space
      if (spaceCount === k) {
        return s.substring(0, i);
      }
    }
  }

  // If we never hit k spaces, it means k >= number of words
  // In this case, return the entire string
  return s;
}
```

```java
// Time: O(n) | Space: O(n) for the words array
class Solution {
    public String truncateSentenceSplit(String s, int k) {
        /**
         * Split the sentence into words, take first k, join back.
         *
         * Steps:
         * 1. Split the sentence by spaces to get individual words
         * 2. Take first k words
         * 3. Join them back with spaces
         *
         * Example: "Hello how are you", k=3 -> ["Hello", "how", "are"] -> "Hello how are"
         */

        // Split the sentence into words
        String[] words = s.split(" ");

        // Build the result with first k words
        StringBuilder result = new StringBuilder();

        // Add first k words with spaces between them
        for (int i = 0; i < k; i++) {
            result.append(words[i]);
            if (i < k - 1) {
                result.append(" ");  // Add space between words, but not after last word
            }
        }

        return result.toString();
    }

    // Time: O(n) | Space: O(1) extra space (excluding output)
    public String truncateSentenceManual(String s, int k) {
        /**
         * Manually find where to truncate by counting spaces.
         *
         * Steps:
         * 1. Initialize spaceCount to track how many spaces we've seen
         * 2. Iterate through the string
         * 3. When we see a space, increment spaceCount
         * 4. When spaceCount == k, we've found the end point
         * 5. Return substring from start to current position
         *
         * Example: "Hello how are you", k=3
         * - At index 5 (space after Hello): spaceCount=1
         * - At index 9 (space after how): spaceCount=2
         * - At index 13 (space after are): spaceCount=3 -> stop, return s.substring(0, 13)
         */

        int spaceCount = 0;

        // Iterate through each character in the string
        for (int i = 0; i < s.length(); i++) {
            // If we encounter a space, increment our counter
            if (s.charAt(i) == ' ') {
                spaceCount++;

                // If we've seen k spaces, we've passed k words
                // The current position i is a space after the kth word
                // So we return everything up to but not including this space
                if (spaceCount == k) {
                    return s.substring(0, i);
                }
            }
        }

        // If we never hit k spaces, it means k >= number of words
        // In this case, return the entire string
        return s;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Both approaches require iterating through the entire string once
- The split approach has additional overhead for creating the array, but it's still O(n)
- The manual approach stops early when it finds the kth space, but worst-case (when k ≥ number of words) it still processes the entire string

**Space Complexity:**

- **Split approach: O(n)** - We create an array of words, which in the worst case could be n/2 words (if every word is a single character)
- **Manual approach: O(1)** extra space (excluding the output string) - We only use a few integer variables

The output string itself requires O(n) space in both cases, but this is typically not counted in space complexity analysis since it's the required output.

## Common Mistakes

1. **Off-by-one errors with space counting**: The most common mistake is returning `s[:i+1]` instead of `s[:i]` when you find the kth space. Remember: when you encounter the kth space, you're at the space _after_ the kth word, so you want to exclude that space.

2. **Not handling k ≥ number of words**: If k is greater than or equal to the number of words in the sentence, you should return the entire sentence. Many candidates forget this edge case and get index out of bounds errors when trying to access words[k-1].

3. **Using the wrong string methods**: In Java, using `substring(beginIndex, endIndex)` where `endIndex` is exclusive vs. Python's slicing `s[start:end]` where `end` is exclusive but JavaScript's `substring(start, end)` where `end` is also exclusive. Know your language's string APIs.

4. **Adding extra space at the end**: When building the result manually (especially in the split approach), candidates sometimes add an extra space at the end. Always check if you're adding a space after the last word.

## When You'll See This Pattern

This problem teaches fundamental string traversal and counting patterns that appear in many other problems:

1. **Word Count Problems**: Problems like [Number of Segments in a String](https://leetcode.com/problems/number-of-segments-in-a-string/) use the same space-counting technique to identify word boundaries.

2. **String Truncation/Substring Problems**: Problems like [Maximum Number of Words Found in Sentences](https://leetcode.com/problems/maximum-number-of-words-found-in-sentences/) require similar word boundary detection.

3. **Parsing Problems**: Any problem that requires parsing space-separated values (like [Goat Latin](https://leetcode.com/problems/goat-latin/) or [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/)) uses similar techniques for identifying word boundaries.

The core pattern is: **Use delimiter counting (usually spaces) to identify logical segments in a string.**

## Key Takeaways

1. **Space as delimiter**: In many string problems, spaces act as natural delimiters between words. Counting spaces is often equivalent to counting words (with the caveat that n words have n-1 spaces between them).

2. **Early termination optimization**: When looking for the first k of something, you can often stop early once you've found what you need, rather than processing the entire input.

3. **Boundary awareness**: Always consider edge cases like empty strings, k=0, k ≥ number of words, and single-word sentences. These are often the test cases that catch incorrect solutions.

[Practice this problem on CodeJeet](/problem/truncate-sentence)
