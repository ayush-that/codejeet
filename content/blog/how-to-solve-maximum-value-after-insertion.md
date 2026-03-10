---
title: "How to Solve Maximum Value after Insertion — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Value after Insertion. Medium difficulty, 39.2% acceptance rate. Topics: String, Greedy."
date: "2029-03-02"
category: "dsa-patterns"
tags: ["maximum-value-after-insertion", "string", "greedy", "medium"]
---

# How to Solve Maximum Value after Insertion

You're given a large integer as a string (which can be positive or negative) and a digit `x` to insert somewhere in the number. Your goal is to maximize the resulting numerical value by choosing the optimal insertion position. The tricky part is that the rules for maximizing differ depending on whether the number is positive or negative.

## Visual Walkthrough

Let's trace through two examples to build intuition:

**Example 1: Positive number**  
`n = "2683"`, `x = 5`

We want to maximize the value. For positive numbers, we want to place `x` as far left as possible, but only if it makes the number larger. Let's check positions:

1. Insert at beginning: `"52683"` (5 > 2, so this increases the number)
2. Insert after first digit: `"25683"` (5 > 6? No, 5 < 6, so this would be smaller)
3. Insert after second digit: `"26583"` (5 > 8? No)
4. Insert after third digit: `"26853"` (5 > 3? Yes, but we found a better position earlier)

The optimal position is the first place where `x` is greater than the current digit. Here, `5 > 2`, so we insert at the beginning.

**Example 2: Negative number**  
`n = "-2683"`, `x = 5`

For negative numbers, we want to make the number _less negative_ (which means larger numerically). This is the opposite logic:

1. Insert after '-': `"-52683"` (5 > 2? Yes, but for negatives, we want smaller digits)
2. Insert after first digit: `"-25683"` (5 > 6? No, 5 < 6, so this is better for negatives)
3. Insert after second digit: `"-26583"` (5 > 8? No)
4. Insert after third digit: `"-26853"` (5 > 3? Yes, but we already found a better position)

For negatives, we insert at the first position where `x` is _less than_ the current digit. Here, `5 < 6`, so we insert after the first digit.

## Brute Force Approach

A naive approach would be to try inserting `x` at every possible position and compare the resulting numbers:

1. Convert `n` to a list of characters
2. For each position from 0 to `len(n)`:
   - Create a new string with `x` inserted at that position
   - Convert to integer (or compare as strings for same length)
   - Track the maximum value
3. Return the maximum string

This approach has two major problems:

1. For very large numbers (up to 10^5 digits), converting to integer would cause overflow
2. The time complexity is O(n²) because creating a new string at each position takes O(n) time

Even if we compare strings without converting to integers, we still have O(n²) time complexity, which is too slow for the constraints.

## Optimized Approach

The key insight is that we don't need to actually create all possible strings. We can determine the optimal insertion position by analyzing the digits:

**For positive numbers:**

- We want to insert `x` as early as possible to maximize the number
- But we should only insert before a digit that's _smaller_ than `x`
- If all digits are greater than or equal to `x`, we append at the end

**For negative numbers:**

- We want to make the number less negative (larger)
- This means we want to insert before a digit that's _larger_ than `x`
- If all digits are less than or equal to `x`, we append at the end

This gives us a greedy O(n) solution: scan through the digits once, find the first position that satisfies the condition, and insert there.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(n) for the result string
def maxValue(n: str, x: int) -> str:
    # Convert x to a character for string insertion
    x_char = str(x)

    # Check if the number is negative
    is_negative = n[0] == '-'

    if is_negative:
        # For negative numbers, we want to insert x before the first digit
        # that is GREATER than x (to make the number less negative)
        for i in range(1, len(n)):
            # Compare current digit with x
            if int(n[i]) > x:
                # Found the first digit greater than x
                # Insert x before this position
                return n[:i] + x_char + n[i:]
        # If no digit is greater than x, append at the end
        return n + x_char
    else:
        # For positive numbers, we want to insert x before the first digit
        # that is LESS than x (to maximize the number)
        for i in range(len(n)):
            if int(n[i]) < x:
                # Found the first digit less than x
                # Insert x before this position
                return n[:i] + x_char + n[i:]
        # If no digit is less than x, append at the end
        return n + x_char
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(n) for the result string
function maxValue(n, x) {
  // Convert x to a string for concatenation
  const xChar = x.toString();

  // Check if the number is negative
  const isNegative = n[0] === "-";

  if (isNegative) {
    // For negative numbers: insert before first digit greater than x
    for (let i = 1; i < n.length; i++) {
      // Compare current digit with x
      if (parseInt(n[i]) > x) {
        // Found position to insert
        return n.slice(0, i) + xChar + n.slice(i);
      }
    }
    // If no suitable position found, append at the end
    return n + xChar;
  } else {
    // For positive numbers: insert before first digit less than x
    for (let i = 0; i < n.length; i++) {
      if (parseInt(n[i]) < x) {
        // Found position to insert
        return n.slice(0, i) + xChar + n.slice(i);
      }
    }
    // If no suitable position found, append at the end
    return n + xChar;
  }
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(n) for the result string
class Solution {
    public String maxValue(String n, int x) {
        // Convert x to character for insertion
        char xChar = (char)(x + '0');

        // Check if number is negative
        boolean isNegative = n.charAt(0) == '-';

        if (isNegative) {
            // For negative numbers: find first digit greater than x
            for (int i = 1; i < n.length(); i++) {
                char currentChar = n.charAt(i);
                int currentDigit = currentChar - '0';

                if (currentDigit > x) {
                    // Insert x before this position
                    return n.substring(0, i) + xChar + n.substring(i);
                }
            }
            // Append at the end if no suitable position found
            return n + xChar;
        } else {
            // For positive numbers: find first digit less than x
            for (int i = 0; i < n.length(); i++) {
                char currentChar = n.charAt(i);
                int currentDigit = currentChar - '0';

                if (currentDigit < x) {
                    // Insert x before this position
                    return n.substring(0, i) + xChar + n.substring(i);
                }
            }
            // Append at the end if no suitable position found
            return n + xChar;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We scan through the string once to find the insertion position
- Each character comparison takes O(1) time
- String concatenation/insertion takes O(n) time, but this only happens once

**Space Complexity: O(n)**

- We create a new string of length n+1 for the result
- No additional data structures are used beyond the input and output

## Common Mistakes

1. **Forgetting to handle negative numbers differently**: This is the most common mistake. Candidates often apply the positive number logic to negatives, which minimizes instead of maximizes the value. Always check the sign first!

2. **Off-by-one errors with negative indices**: When processing negative numbers, remember to start from index 1 (after the '-') not index 0. Starting at index 0 would compare '-' with x, which doesn't make sense.

3. **Converting the entire string to integer**: For very large numbers (up to 10^5 digits), converting to integer will cause overflow in most languages. Always work with strings or character arrays.

4. **Not handling the "append at end" case**: If no suitable insertion position is found (e.g., all digits are ≥ x for positives), we need to append x at the end. Forgetting this edge case will produce incorrect results for inputs like `n="999", x=9`.

## When You'll See This Pattern

This problem uses a **greedy scanning** pattern with **conditional logic based on sign**. You'll see similar patterns in:

1. **Monotonic Stack Problems** (like [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)): Both involve scanning and making decisions based on comparisons between elements.

2. **String Manipulation with Conditions** (like [1328. Break a Palindrome](https://leetcode.com/problems/break-a-palindrome/)): Both require modifying a string based on specific rules to achieve an optimal result.

3. **Greedy Insertion Problems** (like [402. Remove K Digits](https://leetcode.com/problems/remove-k-digits/)): The opposite operation but similar greedy thinking about digit placement.

## Key Takeaways

1. **Sign matters in optimization problems**: When dealing with numbers, always check if they're positive or negative first. The optimization criteria often flip based on the sign.

2. **Greedy scanning is efficient for insertion problems**: Instead of trying all positions, scan once and insert at the first position that satisfies your condition. This turns O(n²) into O(n).

3. **Work with strings for large numbers**: When numbers can be extremely large (beyond integer limits), keep them as strings and compare digit by digit.

[Practice this problem on CodeJeet](/problem/maximum-value-after-insertion)
