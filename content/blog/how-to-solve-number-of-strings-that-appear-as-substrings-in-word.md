---
title: "How to Solve Number of Strings That Appear as Substrings in Word — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Strings That Appear as Substrings in Word. Easy difficulty, 82.4% acceptance rate. Topics: Array, String."
date: "2027-05-25"
category: "dsa-patterns"
tags: ["number-of-strings-that-appear-as-substrings-in-word", "array", "string", "easy"]
---

# How to Solve "Number of Strings That Appear as Substrings in Word"

This problem asks us to count how many strings from an array `patterns` appear as substrings within a given string `word`. While conceptually straightforward, it's an excellent exercise in understanding substring operations and avoiding common pitfalls with string boundaries. The challenge lies in implementing a clean, efficient solution that handles edge cases correctly.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `patterns = ["a", "abc", "bc", "d"]`, `word = "abc"`

We need to check each pattern to see if it exists as a contiguous sequence within `word`:

1. **Pattern "a"**: Check if "a" appears in "abc"
   - Starting at index 0: "a" matches "a" ✓
   - Found! Count = 1

2. **Pattern "abc"**: Check if "abc" appears in "abc"
   - Starting at index 0: "abc" matches "abc" ✓
   - Found! Count = 2

3. **Pattern "bc"**: Check if "bc" appears in "abc"
   - Starting at index 0: "b" matches "a" ✗
   - Starting at index 1: "bc" matches "bc" ✓
   - Found! Count = 3

4. **Pattern "d"**: Check if "d" appears in "abc"
   - Starting at index 0: "d" matches "a" ✗
   - Starting at index 1: "d" matches "b" ✗
   - Starting at index 2: "d" matches "c" ✗
   - Not found! Count remains 3

**Output:** 3

The key insight is that for each pattern, we need to check if it exists anywhere within `word`, not just at the beginning or end.

## Brute Force Approach

The most straightforward approach is to iterate through each pattern in the array and check if it exists as a substring in `word`. For each pattern, we could:

1. Check every possible starting position in `word`
2. Compare the pattern against the substring starting at that position
3. If any position matches, count the pattern and move to the next one

While this approach would work, it's inefficient because we're manually implementing substring matching. Most programming languages provide built-in substring checking functions (like `in` in Python, `includes()` in JavaScript, or `contains()` in Java) that are optimized and handle the details for us.

Actually, for this problem, using built-in functions **is** the optimal approach since the problem constraints are reasonable and we're not asked to implement our own substring search algorithm. The "brute force" thinking here would be to overcomplicate the solution by implementing manual substring matching instead of using language features designed for this exact purpose.

## Optimal Solution

The optimal solution leverages each language's built-in substring checking functionality. We simply iterate through each pattern and check if it exists in `word`, incrementing a counter whenever we find a match.

<div class="code-group">

```python
# Time: O(n * m) where n = len(patterns), m = avg pattern length
# Space: O(1) - we only use a counter variable
def numOfStrings(patterns, word):
    """
    Count how many strings in patterns appear as substrings in word.

    Args:
        patterns: List of strings to check
        word: The string to search within

    Returns:
        Integer count of patterns found as substrings
    """
    count = 0  # Initialize counter for matches

    # Iterate through each pattern in the list
    for pattern in patterns:
        # Check if current pattern exists as a substring in word
        # The 'in' operator in Python handles substring checking efficiently
        if pattern in word:
            count += 1  # Increment counter when pattern is found

    return count  # Return total count of matching patterns
```

```javascript
// Time: O(n * m) where n = patterns.length, m = avg pattern length
// Space: O(1) - we only use a counter variable
function numOfStrings(patterns, word) {
  /**
   * Count how many strings in patterns appear as substrings in word.
   *
   * @param {string[]} patterns - Array of strings to check
   * @param {string} word - The string to search within
   * @return {number} Integer count of patterns found as substrings
   */
  let count = 0; // Initialize counter for matches

  // Iterate through each pattern in the array
  for (let pattern of patterns) {
    // Check if current pattern exists as a substring in word
    // includes() method returns true if pattern is found anywhere in word
    if (word.includes(pattern)) {
      count++; // Increment counter when pattern is found
    }
  }

  return count; // Return total count of matching patterns
}
```

```java
// Time: O(n * m) where n = patterns.length, m = avg pattern length
// Space: O(1) - we only use a counter variable
class Solution {
    /**
     * Count how many strings in patterns appear as substrings in word.
     *
     * @param patterns Array of strings to check
     * @param word The string to search within
     * @return Integer count of patterns found as substrings
     */
    public int numOfStrings(String[] patterns, String word) {
        int count = 0;  // Initialize counter for matches

        // Iterate through each pattern in the array
        for (String pattern : patterns) {
            // Check if current pattern exists as a substring in word
            // contains() method returns true if pattern is found anywhere in word
            if (word.contains(pattern)) {
                count++;  // Increment counter when pattern is found
            }
        }

        return count;  // Return total count of matching patterns
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m), where:

- `n` is the number of patterns in the array
- `m` is the average length of the patterns

The `contains()`/`includes()`/`in` operation typically uses an efficient algorithm (like the Two-Way algorithm or similar) that runs in O(k + l) time in the worst case, where k is the length of the pattern and l is the length of the word. Since we perform this check for each of n patterns, the total time is O(n × m).

**Space Complexity:** O(1) for all implementations. We only use a single integer counter variable regardless of input size. The built-in substring search algorithms may use some additional space internally, but this is not counted in our space complexity analysis as it's part of the language implementation.

## Common Mistakes

1. **Checking for exact equality instead of substring**: Some candidates mistakenly use `==` or `.equals()` instead of substring checking methods. Remember: "abc" is a substring of "xabcy" even though they're not equal.

2. **Overcomplicating with manual substring search**: Implementing your own nested loop to check each position in `word` against each pattern is unnecessary and error-prone. Interviewers expect you to know and use standard library functions.

3. **Forgetting that patterns can be longer than the word**: If a pattern is longer than `word`, it cannot be a substring. While the built-in methods handle this correctly, manual implementations might try to access indices beyond `word`'s bounds.

4. **Counting duplicates incorrectly**: If the same pattern appears multiple times in `patterns`, each occurrence should be counted separately. The problem asks for "number of strings in patterns" not "number of unique strings."

## When You'll See This Pattern

This problem teaches fundamental string manipulation skills that appear in many coding problems:

1. **String Matching Problems**: Problems like [Implement strStr()](https://leetcode.com/problems/implement-strstr/) (LeetCode 28) require you to find the first occurrence of a substring, which is a more specific version of this problem.

2. **Pattern Searching**: Problems involving searching for multiple patterns in text, like [Repeated String Match](https://leetcode.com/problems/repeated-string-match/) (LeetCode 686), build on these substring checking skills.

3. **String Validation**: Many problems require checking if certain patterns exist within strings, such as [Check If a Word Occurs As a Prefix of Any Word in a Sentence](https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence/) (LeetCode 1455), which is similar but checks for prefixes rather than any substring.

## Key Takeaways

1. **Know your language's string utilities**: Being familiar with built-in string methods like `contains()`, `includes()`, or the `in` operator is essential for writing clean, efficient string manipulation code.

2. **Understand substring vs. subsequence vs. prefix/suffix**: A substring must be contiguous, unlike a subsequence. This problem specifically tests your understanding of what constitutes a substring.

3. **Simple problems often have simple solutions**: Don't overcomplicate easy problems. If the constraints are reasonable (like in this problem), the straightforward solution is usually the right one.

[Practice this problem on CodeJeet](/problem/number-of-strings-that-appear-as-substrings-in-word)
