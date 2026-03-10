---
title: "How to Solve Largest Odd Number in String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Odd Number in String. Easy difficulty, 67.0% acceptance rate. Topics: Math, String, Greedy."
date: "2027-04-10"
category: "dsa-patterns"
tags: ["largest-odd-number-in-string", "math", "string", "greedy", "easy"]
---

# How to Solve Largest Odd Number in String

You're given a string `num` representing a large integer. Your task is to find the largest odd number that appears as a contiguous substring within `num`, returning it as a string. If no odd number exists, return an empty string.

What makes this problem interesting is that it looks like it requires checking all possible substrings, but there's a clever observation that leads to an O(n) solution. The key insight is that a number is odd if and only if its last digit is odd (1, 3, 5, 7, or 9). This means we don't need to check every substring—we just need to find the rightmost odd digit.

## Visual Walkthrough

Let's trace through an example: `num = "35427"`

**Step 1:** Start from the rightmost digit and move left

- Position 4 (0-indexed): digit '7' → odd ✓
- Since '7' is odd, the largest odd substring ending at position 4 is the entire prefix from the start: `"35427"`

**Example 2:** `num = "4206"`

- Position 3: '6' → even ✗
- Position 2: '0' → even ✗
- Position 1: '2' → even ✗
- Position 0: '4' → even ✗
- No odd digits found → return `""`

**Example 3:** `num = "123456"`

- Position 5: '6' → even ✗
- Position 4: '5' → odd ✓
- Largest odd substring: `"12345"`

The pattern is clear: find the rightmost odd digit, then take the substring from the beginning up to and including that digit.

## Brute Force Approach

A naive approach would be to generate all possible substrings, check if each represents an odd number, and keep track of the largest one. Here's how that would work:

1. Generate all substrings (O(n²) substrings)
2. For each substring, check if it's odd by looking at the last digit
3. Compare substrings as numbers to find the largest

The problem with this approach is efficiency. For a string of length n, there are n(n+1)/2 possible substrings. Even with optimizations, this is O(n²) time complexity, which is too slow for large inputs (n up to 10⁵ in typical constraints).

## Optimal Solution

The optimal solution uses a greedy approach based on the mathematical property that a number is odd if and only if its last digit is odd. We simply scan from right to left, find the first (rightmost) odd digit, and return the substring from the beginning to that position.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def largestOddNumber(num: str) -> str:
    """
    Find the largest odd number substring in the given string.

    The key insight: a number is odd if and only if its last digit is odd.
    So we need to find the rightmost odd digit and take the prefix up to it.
    """
    # Start from the rightmost character and move left
    for i in range(len(num) - 1, -1, -1):
        # Check if the current digit is odd
        # ord() gives ASCII value, subtracting ord('0') gives integer value
        # Odd digits: 1, 3, 5, 7, 9
        if int(num[i]) % 2 == 1:
            # Found the rightmost odd digit
            # Return substring from start to this position (inclusive)
            return num[:i + 1]

    # If we exit the loop, no odd digit was found
    return ""

# Alternative implementation using direct character comparison
def largestOddNumberAlt(num: str) -> str:
    """
    Same logic but using character comparison instead of conversion to int.
    This avoids the overhead of int() conversion for each character.
    """
    # Odd digits in character form
    odd_digits = {'1', '3', '5', '7', '9'}

    # Traverse from right to left
    for i in range(len(num) - 1, -1, -1):
        if num[i] in odd_digits:
            return num[:i + 1]

    return ""
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Find the largest odd number substring in the given string.
 *
 * The key insight: a number is odd if and only if its last digit is odd.
 * So we need to find the rightmost odd digit and take the prefix up to it.
 */
function largestOddNumber(num) {
  // Start from the rightmost character and move left
  for (let i = num.length - 1; i >= 0; i--) {
    // Convert character to number and check if it's odd
    // Using bitwise AND with 1 is a fast way to check odd/even
    if (parseInt(num[i]) % 2 === 1) {
      // Found the rightmost odd digit
      // Return substring from start to this position (inclusive)
      return num.substring(0, i + 1);
    }
  }

  // If we exit the loop, no odd digit was found
  return "";
}

// Alternative implementation using character comparison
function largestOddNumberAlt(num) {
  // Set of odd digit characters for fast lookup
  const oddDigits = new Set(["1", "3", "5", "7", "9"]);

  // Traverse from right to left
  for (let i = num.length - 1; i >= 0; i--) {
    if (oddDigits.has(num[i])) {
      return num.substring(0, i + 1);
    }
  }

  return "";
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Find the largest odd number substring in the given string.
     *
     * The key insight: a number is odd if and only if its last digit is odd.
     * So we need to find the rightmost odd digit and take the prefix up to it.
     */
    public String largestOddNumber(String num) {
        // Start from the rightmost character and move left
        for (int i = num.length() - 1; i >= 0; i--) {
            // Get the character at current position
            char c = num.charAt(i);

            // Check if the digit is odd
            // Character.getNumericValue() converts char to int
            if (Character.getNumericValue(c) % 2 == 1) {
                // Found the rightmost odd digit
                // Return substring from start to this position (inclusive)
                return num.substring(0, i + 1);
            }
        }

        // If we exit the loop, no odd digit was found
        return "";
    }
}

// Alternative implementation using character comparison
class SolutionAlt {
    public String largestOddNumber(String num) {
        // Set of odd digit characters
        Set<Character> oddDigits = new HashSet<>();
        oddDigits.add('1');
        oddDigits.add('3');
        oddDigits.add('5');
        oddDigits.add('7');
        oddDigits.add('9');

        // Traverse from right to left
        for (int i = num.length() - 1; i >= 0; i--) {
            if (oddDigits.contains(num.charAt(i))) {
                return num.substring(0, i + 1);
            }
        }

        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We traverse the string once from right to left
- In the worst case, we check all n characters (when there are no odd digits)
- Each check is O(1) operation (digit conversion or set lookup)

**Space Complexity:** O(1)

- We only use a constant amount of extra space
- The set of odd digits (if used) has fixed size 5
- No additional data structures that scale with input size

## Common Mistakes

1. **Checking from left to right instead of right to left:** Some candidates start from the beginning and look for the last odd digit by storing positions. While this works, it's less intuitive and requires extra variables. The right-to-left approach is cleaner and more direct.

2. **Converting the entire substring to a number:** This is inefficient and can cause overflow for very long strings. Remember that we only need to check the last digit to determine if a number is odd.

3. **Forgetting to handle the empty string case:** If no odd digit is found, we must return an empty string. Some candidates return the original string or "0" instead.

4. **Incorrect substring indexing:** When using `num[:i+1]` (Python) or `substring(0, i+1)` (Java/JS), remember that the end index is exclusive in some languages. The `+1` is crucial to include the odd digit we found.

5. **Checking even digits instead of odd:** It sounds silly, but under pressure, some candidates check for even digits by mistake. Remember: odd digits are 1, 3, 5, 7, 9.

## When You'll See This Pattern

This problem teaches the **right-to-left scanning pattern** combined with **mathematical properties** to optimize substring problems. You'll see similar patterns in:

1. **Largest 3-Same-Digit Number in String (Easy)** - Similar scanning approach to find triplets of identical digits
2. **Largest Number After Digit Swaps by Parity (Easy)** - Uses digit properties to make decisions
3. **Check if Number is a Sum of Powers of Three (Medium)** - Uses mathematical properties to simplify the problem
4. **Maximum 69 Number (Easy)** - Scans from left to find the rightmost position to change

The core idea is recognizing that certain properties (like oddness) depend only on specific parts of the data (the last digit), allowing you to avoid checking everything.

## Key Takeaways

1. **Look for mathematical shortcuts:** Before implementing brute force, ask if there's a mathematical property that can simplify the problem. Here, the fact that "oddness depends only on the last digit" reduces an O(n²) problem to O(n).

2. **Right-to-left scanning is powerful:** When looking for the "last" occurrence of something with a specific property, scanning from the end is often the cleanest approach.

3. **Don't convert what you don't need:** For large numbers as strings, avoid converting to integers unless necessary. Work with string operations and character comparisons when possible.

4. **Test edge cases:** Always test with all-even digits, single-digit inputs, and inputs where the odd digit is at the very beginning or end.

Related problems: [Largest 3-Same-Digit Number in String](/problem/largest-3-same-digit-number-in-string)
