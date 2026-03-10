---
title: "How to Solve Additive Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Additive Number. Medium difficulty, 33.5% acceptance rate. Topics: String, Backtracking."
date: "2027-03-01"
category: "dsa-patterns"
tags: ["additive-number", "string", "backtracking", "medium"]
---

## How to Solve Additive Number

An **additive number** is a string where you can split it into a sequence of numbers where each number (after the first two) equals the sum of the two preceding numbers. The challenge is that we don't know where to split the string—we need to try different partition points while respecting that numbers can't have leading zeros (unless they're exactly "0") and the sequence must have at least three numbers.

What makes this problem interesting is that it combines **backtracking** with careful **string/number handling**. You need to explore different ways to choose the first two numbers, then verify if the rest of the string follows the additive property. It's essentially a **search problem** disguised as a string validation task.

## Visual Walkthrough

Let's trace through the example `"112358"`:

1. **Try first number length = 1**: `num1 = "1"`
   - Try second number length = 1: `num2 = "1"`
     - Sum = `1 + 1 = 2`
     - Check if next part starts with "2": Yes, `"2"`
     - Now we have sequence: `1, 1, 2`
     - Next sum should be `1 + 2 = 3`: Check if next part starts with "3": Yes, `"3"`
     - Sequence: `1, 1, 2, 3`
     - Next sum should be `2 + 3 = 5`: Check if next part starts with "5": Yes, `"5"`
     - Sequence: `1, 1, 2, 3, 5`
     - Next sum should be `3 + 5 = 8`: Check if next part starts with "8": Yes, `"8"`
     - We've consumed the entire string! This is a valid additive sequence.

But what if our initial split was wrong? We need to try other possibilities. For example, with `"199100199"`:

1. **Try first number length = 1**: `num1 = "1"`
   - Try second number length = 1: `num2 = "9"`
     - Sum = `1 + 9 = 10`
     - Check if next part starts with "10": No, it starts with "9" → backtrack
   - Try second number length = 2: `num2 = "99"`
     - Sum = `1 + 99 = 100`
     - Check if next part starts with "100": Yes!
     - Continue checking: `9 + 100 = 109` doesn't match next part "199" → backtrack
2. **Try first number length = 2**: `num1 = "19"`
   - Try second number length = 1: `num2 = "9"`
     - Sum = `19 + 9 = 28` doesn't match next part "1" → backtrack
   - Try second number length = 2: `num2 = "91"`
     - Invalid! "91" doesn't start the remaining substring "9100199"
3. **Try first number length = 3**: `num1 = "199"`
   - Try second number length = 1: `num2 = "1"`
     - Sum = `199 + 1 = 200` doesn't match next part "0" → backtrack
   - Try second number length = 2: `num2 = "10"`
     - Sum = `199 + 10 = 209` doesn't match → backtrack
   - Try second number length = 3: `num2 = "100"`
     - Sum = `199 + 100 = 299` doesn't match → backtrack

We need to be smarter. The key insight: once we choose the first two numbers, the entire sequence is **determined**. We just need to verify if the rest of the string matches this predetermined sequence.

## Brute Force Approach

A truly naive approach would try all possible splits for all numbers in the sequence, but that's exponential and impractical. A more reasonable but still inefficient approach would be:

1. Try all possible lengths for the first number (1 to n/2, since we need at least 3 numbers)
2. For each, try all possible lengths for the second number (1 to remaining length/2)
3. For each pair, manually check if the rest of the string follows the additive rule

The problem with this approach is we might do redundant work. If we choose `num1 = "123"` and `num2 = "456"`, we calculate `sum = 579` and check if the next 3 characters are "579". If not, we backtrack. But we're still doing this check for many invalid starting pairs.

The brute force would have complexity roughly O(n³) because we have O(n²) pairs of starting numbers, and for each we might check O(n) of the remaining string. For n=35 (the problem constraint), that's about 35³ = 42,875 operations, which might seem okay but we can do better with pruning.

## Optimized Approach

The key optimization is **early pruning**:

1. **Leading zeros**: If a number has more than 1 digit and starts with '0', it's invalid. Skip it immediately.
2. **Length limits**: The first number can't be longer than n/2 because we need at least 3 numbers total.
3. **Sum length**: The sum of two numbers has a maximum length equal to the longer number plus 1. We can use this to bound our search.
4. **Once first two are chosen, sequence is fixed**: Instead of exploring all possible splits for subsequent numbers, we calculate what the next number _must_ be and check if it matches the string.

The algorithm:

1. Choose all valid pairs for the first two numbers
2. For each pair, simulate the additive sequence:
   - Calculate the expected sum
   - Check if the next part of the string matches this sum
   - If yes, advance pointers and continue with new pair (previous second number becomes first, sum becomes second)
   - If we reach the end of string with at least 3 numbers, return true
3. If no pair leads to a valid sequence, return false

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) - We try O(n^2) starting pairs, each check is O(n)
# Space: O(n) - For storing substrings and recursion stack
class Solution:
    def isAdditiveNumber(self, num: str) -> bool:
        n = len(num)

        # Try all possible splits for first two numbers
        # First number can't be more than n//2 digits (need at least 3 numbers)
        for i in range(1, n // 2 + 1):
            # Skip numbers with leading zero unless it's exactly "0"
            if num[0] == '0' and i > 1:
                continue

            for j in range(1, n):
                # Ensure we have room for at least one more number
                if max(i, j) > n - i - j:
                    break

                # Skip second number with leading zero unless it's exactly "0"
                if num[i] == '0' and j > 1:
                    continue

                # Extract first two numbers
                num1 = int(num[:i])
                num2 = int(num[i:i+j])

                # Check if remaining string follows additive sequence
                if self._is_valid(num1, num2, num[i+j:], 2):
                    return True

        return False

    def _is_valid(self, num1: int, num2: int, remaining: str, count: int) -> bool:
        """
        Check if remaining string continues the additive sequence.
        num1, num2: Last two numbers in the sequence
        remaining: The part of string left to check
        count: How many numbers we've found so far
        """
        # If no string left, check if we have at least 3 numbers
        if not remaining:
            return count >= 3

        # Calculate expected next number
        total = num1 + num2
        total_str = str(total)

        # Check if remaining string starts with our expected sum
        if not remaining.startswith(total_str):
            return False

        # Recursively check the rest of the sequence
        # New pair: (num2, total), remove the matched part from remaining
        return self._is_valid(num2, total, remaining[len(total_str):], count + 1)
```

```javascript
// Time: O(n^2) - We try O(n^2) starting pairs, each check is O(n)
// Space: O(n) - For recursion stack and string operations
/**
 * @param {string} num
 * @return {boolean}
 */
var isAdditiveNumber = function (num) {
  const n = num.length;

  // Try all possible splits for first two numbers
  // First number can't be more than n/2 digits (need at least 3 numbers)
  for (let i = 1; i <= Math.floor(n / 2); i++) {
    // Skip numbers with leading zero unless it's exactly "0"
    if (num[0] === "0" && i > 1) {
      continue;
    }

    for (let j = 1; j < n; j++) {
      // Ensure we have room for at least one more number
      if (Math.max(i, j) > n - i - j) {
        break;
      }

      // Skip second number with leading zero unless it's exactly "0"
      if (num[i] === "0" && j > 1) {
        continue;
      }

      // Extract first two numbers
      const num1 = BigInt(num.substring(0, i));
      const num2 = BigInt(num.substring(i, i + j));

      // Check if remaining string follows additive sequence
      if (isValid(num1, num2, num.substring(i + j), 2)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Check if remaining string continues the additive sequence
 * @param {bigint} num1 - First of the last two numbers
 * @param {bigint} num2 - Second of the last two numbers
 * @param {string} remaining - The part of string left to check
 * @param {number} count - How many numbers we've found so far
 * @return {boolean}
 */
function isValid(num1, num2, remaining, count) {
  // If no string left, check if we have at least 3 numbers
  if (remaining.length === 0) {
    return count >= 3;
  }

  // Calculate expected next number
  const total = num1 + num2;
  const totalStr = total.toString();

  // Check if remaining string starts with our expected sum
  if (!remaining.startsWith(totalStr)) {
    return false;
  }

  // Recursively check the rest of the sequence
  // New pair: (num2, total), remove the matched part from remaining
  return isValid(num2, total, remaining.substring(totalStr.length), count + 1);
}
```

```java
// Time: O(n^2) - We try O(n^2) starting pairs, each check is O(n)
// Space: O(n) - For recursion stack
class Solution {
    public boolean isAdditiveNumber(String num) {
        int n = num.length();

        // Try all possible splits for first two numbers
        // First number can't be more than n/2 digits (need at least 3 numbers)
        for (int i = 1; i <= n / 2; i++) {
            // Skip numbers with leading zero unless it's exactly "0"
            if (num.charAt(0) == '0' && i > 1) {
                continue;
            }

            for (int j = 1; j < n; j++) {
                // Ensure we have room for at least one more number
                if (Math.max(i, j) > n - i - j) {
                    break;
                }

                // Skip second number with leading zero unless it's exactly "0"
                if (num.charAt(i) == '0' && j > 1) {
                    continue;
                }

                // Extract first two numbers
                long num1 = Long.parseLong(num.substring(0, i));
                long num2 = Long.parseLong(num.substring(i, i + j));

                // Check if remaining string follows additive sequence
                if (isValid(num1, num2, num.substring(i + j), 2)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean isValid(long num1, long num2, String remaining, int count) {
        // If no string left, check if we have at least 3 numbers
        if (remaining.isEmpty()) {
            return count >= 3;
        }

        // Calculate expected next number
        long total = num1 + num2;
        String totalStr = String.valueOf(total);

        // Check if remaining string starts with our expected sum
        if (!remaining.startsWith(totalStr)) {
            return false;
        }

        // Recursively check the rest of the sequence
        // New pair: (num2, total), remove the matched part from remaining
        return isValid(num2, total, remaining.substring(totalStr.length()), count + 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Outer loops try all possible first number lengths (up to n/2) and second number lengths (up to n), giving O(n²) starting pairs
- For each pair, we check the remaining string which takes O(n) in the worst case
- Total: O(n³) in worst case, but with pruning (breaking when numbers get too long), it's effectively O(n²)

**Space Complexity: O(n)**

- Recursion depth can be O(n) in worst case (each number is 1 digit)
- We create substrings of total length O(n)
- Integer conversions use O(1) space for the numbers themselves

## Common Mistakes

1. **Not handling integer overflow**: For long strings, numbers can exceed 32-bit or even 64-bit integer limits. In Python, integers are arbitrary precision, but in Java/JavaScript, you need to use `long` or `BigInt`.
   - **Fix**: Use `BigInteger` in Java or `BigInt` in JavaScript for the general case.

2. **Incorrect handling of leading zeros**: Allowing numbers like "01", "001" which are invalid unless the number is exactly "0".
   - **Fix**: Check if first digit is '0' and length > 1, then skip that candidate.

3. **Forgetting to check minimum sequence length**: The problem requires at least 3 numbers in the sequence.
   - **Fix**: Track count of numbers found and only return true if count ≥ 3 when we reach string end.

4. **Not pruning search space**: Trying all possible splits without considering that numbers can't be longer than remaining string.
   - **Fix**: Add bounds checking: `if (max(i, j) > n - i - j) break;`

## When You'll See This Pattern

This **backtracking with validation** pattern appears in problems where you need to partition a sequence according to some rules:

1. **Split Array into Fibonacci Sequence** (LeetCode 842) - Almost identical problem! Instead of checking if the entire string is additive, you return the Fibonacci sequence if possible.

2. **Restore IP Addresses** (LeetCode 93) - Similar backtracking to split string into 4 valid IP address segments.

3. **Palindrome Partitioning** (LeetCode 131) - Backtrack to split string into all palindromic substrings.

The common theme: explore different ways to split a sequence, validate each segment according to constraints, and backtrack when constraints are violated.

## Key Takeaways

1. **Backtracking is natural for partition problems**: When you need to split a sequence in unknown places, backtracking lets you try different splits and validate constraints incrementally.

2. **Prune early, prune often**: Check constraints as soon as possible (leading zeros, length limits) to avoid exploring dead ends.

3. **Sometimes the search space is smaller than it seems**: Here, once we choose the first two numbers, the rest of the sequence is determined—we just verify it matches the string.

Related problems: [Split Array into Fibonacci Sequence](/problem/split-array-into-fibonacci-sequence)
