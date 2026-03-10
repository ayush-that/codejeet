---
title: "How to Solve Score of a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Score of a String. Easy difficulty, 91.4% acceptance rate. Topics: String."
date: "2027-06-26"
category: "dsa-patterns"
tags: ["score-of-a-string", "string", "easy"]
---

# How to Solve Score of a String

This problem asks us to calculate the sum of absolute differences between ASCII values of adjacent characters in a string. While conceptually straightforward, it's an excellent exercise in careful iteration and handling edge cases. The challenge lies not in algorithmic complexity but in implementing a clean, efficient solution that handles all possible inputs correctly.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Consider the string `"abc"`:

**Step 1: Understand ASCII values**

- `'a'` has ASCII value 97
- `'b'` has ASCII value 98
- `'c'` has ASCII value 99

**Step 2: Calculate adjacent differences**

- Between `'a'` and `'b'`: |97 - 98| = 1
- Between `'b'` and `'c'`: |98 - 99| = 1

**Step 3: Sum the differences**

- Total score = 1 + 1 = 2

Let's try another example: `"zab"`

**Step 1: ASCII values**

- `'z'` = 122
- `'a'` = 97
- `'b'` = 98

**Step 2: Calculate differences**

- Between `'z'` and `'a'`: |122 - 97| = 25
- Between `'a'` and `'b'`: |97 - 98| = 1

**Step 3: Sum the differences**

- Total score = 25 + 1 = 26

Notice we only need to consider adjacent pairs, so for a string of length `n`, we'll have `n-1` comparisons to make.

## Brute Force Approach

For this problem, the brute force approach is actually quite reasonable and efficient. However, let's consider what a truly naive approach might look like and why we can do better.

A naive candidate might:

1. Convert each character to its ASCII value and store in an array
2. Create all possible pairs (not just adjacent ones)
3. Calculate absolute differences for all pairs
4. Sum them up

This would be O(n²) time complexity and unnecessary. The problem specifically asks for **adjacent** characters, so we only need to consider consecutive pairs.

The straightforward approach is already optimal: iterate through the string once, comparing each character with its next neighbor. This gives us O(n) time complexity, which is the best we can do since we need to examine each character at least once.

## Optimal Solution

The optimal solution is simple and elegant: iterate through the string from index 0 to `len(s)-2`, comparing each character with the next one, accumulating the absolute differences.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) - we only use a few variables
def scoreOfString(s: str) -> int:
    """
    Calculate the score of a string by summing absolute differences
    between ASCII values of adjacent characters.

    Args:
        s: Input string

    Returns:
        Integer score
    """
    score = 0  # Initialize score accumulator

    # Iterate through the string, stopping at the second-to-last character
    # This ensures we always have a valid next character to compare with
    for i in range(len(s) - 1):
        # Get ASCII values of current and next characters
        current_char_val = ord(s[i])
        next_char_val = ord(s[i + 1])

        # Calculate absolute difference and add to running total
        score += abs(current_char_val - next_char_val)

    return score
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
function scoreOfString(s) {
  /**
   * Calculate the score of a string by summing absolute differences
   * between ASCII values of adjacent characters.
   *
   * @param {string} s - Input string
   * @return {number} Integer score
   */
  let score = 0; // Initialize score accumulator

  // Iterate through the string, stopping at the second-to-last character
  // This ensures we always have a valid next character to compare with
  for (let i = 0; i < s.length - 1; i++) {
    // Get ASCII values of current and next characters
    const currentCharVal = s.charCodeAt(i);
    const nextCharVal = s.charCodeAt(i + 1);

    // Calculate absolute difference and add to running total
    score += Math.abs(currentCharVal - nextCharVal);
  }

  return score;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
class Solution {
    /**
     * Calculate the score of a string by summing absolute differences
     * between ASCII values of adjacent characters.
     *
     * @param s Input string
     * @return Integer score
     */
    public int scoreOfString(String s) {
        int score = 0;  // Initialize score accumulator

        // Iterate through the string, stopping at the second-to-last character
        // This ensures we always have a valid next character to compare with
        for (int i = 0; i < s.length() - 1; i++) {
            // Get ASCII values of current and next characters
            int currentCharVal = s.charAt(i);
            int nextCharVal = s.charAt(i + 1);

            // Calculate absolute difference and add to running total
            score += Math.abs(currentCharVal - nextCharVal);
        }

        return score;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing constant-time operations for each character
- The loop runs `n-1` times where `n` is the length of the string
- Each iteration involves: accessing two characters, converting to ASCII values (O(1)), calculating absolute difference (O(1)), and adding to accumulator (O(1))

**Space Complexity: O(1)**

- We only use a fixed amount of extra space regardless of input size
- Variables: `score` (integer), loop counter `i`, and temporary variables for ASCII values
- No additional data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in loop bounds**: The most common mistake is iterating to `len(s)` instead of `len(s)-1`, which causes an `IndexOutOfBounds` exception when trying to access `s[i+1]` on the last iteration. Always remember: for adjacent comparisons, you need to stop one element early.

2. **Forgetting to handle edge cases**: While the problem doesn't specify, what happens with empty strings or single-character strings? For an empty string or a string with one character, there are no adjacent pairs, so the score should be 0. Our solution handles this correctly because when `len(s) < 2`, the loop doesn't execute at all, and we return the initialized score of 0.

3. **Using wrong ASCII conversion methods**: Different languages have different methods:
   - Python: `ord(char)` converts character to ASCII
   - JavaScript: `charCodeAt(index)` returns ASCII value at position
   - Java: `char` can be directly cast to `int` or used in arithmetic
     Mixing these up or using string comparison instead of ASCII value comparison is a common pitfall.

4. **Not using absolute value**: The problem specifies "absolute difference," so `|a - b|` not `a - b`. Forgetting the absolute value will give incorrect results when the first character has a lower ASCII value than the second.

## When You'll See This Pattern

This problem uses a simple linear scan with adjacent element comparison, a pattern that appears in many coding problems:

1. **Maximum Subarray (LeetCode 53)**: Similar scanning approach where you maintain a running sum and compare with current element to decide whether to start a new subarray or extend the current one.

2. **Best Time to Buy and Sell Stock (LeetCode 121)**: You scan through prices, keeping track of the minimum price seen so far and calculating potential profit with the current price.

3. **Running Sum of 1D Array (LeetCode 1480)**: Another linear scan problem where each element's value depends on the previous element.

The core pattern is: **iterate through a sequence, performing some operation between each element and its neighbor or some maintained state**. Recognizing this pattern helps you quickly identify O(n) solutions for problems that might initially seem more complex.

## Key Takeaways

1. **Adjacent comparisons require careful loop bounds**: When comparing element `i` with element `i+1`, your loop should run from `0` to `n-2` (inclusive), not `0` to `n-1`. This is a fundamental pattern that appears in many array/string problems.

2. **ASCII character arithmetic is language-specific**: Each programming language has its own way of converting characters to their numeric codes. Knowing these differences is crucial for string manipulation problems.

3. **Simple problems test attention to detail**: Even "easy" problems like this one test your ability to handle edge cases, write clean code, and avoid off-by-one errors. These fundamentals are often more important than knowing complex algorithms.

[Practice this problem on CodeJeet](/problem/score-of-a-string)
