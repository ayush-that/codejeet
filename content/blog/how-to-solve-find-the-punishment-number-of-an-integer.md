---
title: "How to Solve Find the Punishment Number of an Integer — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Punishment Number of an Integer. Medium difficulty, 81.7% acceptance rate. Topics: Math, Backtracking."
date: "2026-09-08"
category: "dsa-patterns"
tags: ["find-the-punishment-number-of-an-integer", "math", "backtracking", "medium"]
---

# How to Solve Find the Punishment Number of an Integer

This problem asks us to compute the "punishment number" of a given integer `n`, which is the sum of squares of all numbers `i` from 1 to `n` where the decimal representation of `i²` can be partitioned into contiguous substrings that sum to exactly `i`. The challenge lies in efficiently checking whether such a partition exists for each number's square.

What makes this problem interesting is that it combines mathematical computation with backtracking/recursive partitioning. You need to check all possible ways to split a number's square string into contiguous parts and see if any combination sums to the original number. This is essentially a string partitioning problem disguised as a mathematical computation.

## Visual Walkthrough

Let's trace through an example with `n = 10`. We need to check numbers 1 through 10:

**i = 1**: `1² = 1`. The string "1" can only be partitioned as [1], and 1 = 1 ✓

**i = 9**: `9² = 81`. Possible partitions:

- "81" as whole: 81 ≠ 9
- "8" + "1": 8 + 1 = 9 ✓

**i = 10**: `10² = 100`. Possible partitions:

- "100": 100 ≠ 10
- "10" + "0": 10 + 0 = 10 ✓
- "1" + "00": 1 + 0 = 1 ≠ 10
- "1" + "0" + "0": 1 + 0 + 0 = 1 ≠ 10

So numbers 1, 9, and 10 satisfy the condition. Their squares are 1, 81, and 100. The punishment number is 1 + 81 + 100 = 182.

The key insight: For each number `i`, we need to check if we can split `i²` (as a string) into contiguous parts that sum to `i`. This is a classic partitioning problem that requires exploring all possible split points.

## Brute Force Approach

A naive approach would be:

1. For each `i` from 1 to `n`:
   - Compute `square = i * i`
   - Convert `square` to string
   - Generate ALL possible partitions of the string
   - Check if any partition sums to `i`

The challenge is generating all partitions. For a string of length `m`, there are `2^(m-1)` possible ways to partition it (each position between characters can either have a cut or not). For `i = 1000`, `i² = 1,000,000` which has 7 digits, giving 2⁶ = 64 partitions to check. For larger numbers, this grows exponentially.

However, since `n ≤ 1000`, the maximum square length is 7 digits (for 1000² = 1,000,000), and 2⁶ = 64 partitions per number is manageable. But we need to be careful: a truly brute force approach that generates all partitions explicitly could be inefficient.

Actually, the problem constraints make a backtracking approach feasible since we're dealing with relatively small strings. The "brute force" here would be to use recursion/backtracking to try all partitions, which is actually the optimal approach for this problem.

## Optimized Approach

The key insight is that we can use **backtracking** to explore all possible partitions without explicitly generating them all at once. We traverse the string representation of `i²` from left to right, and at each position, we decide whether to end the current partition or continue adding digits.

Here's the recursive thinking:

1. Start with the entire square string and the target sum `i`
2. At each step, we can take the first `k` digits as a number (where `k` ranges from 1 to remaining length)
3. Subtract this number from the target and recursively check if the remaining substring can be partitioned to sum to the new target
4. If we reach the end of the string with target = 0, we found a valid partition

This is essentially a depth-first search through the partition space, pruning branches where the current number exceeds the remaining target.

## Optimal Solution

We'll implement a helper function `canPartition` that checks if a string can be partitioned to sum to a target. Then for each `i` from 1 to `n`, we check if `str(i*i)` can be partitioned to sum to `i`. If yes, we add `i*i` to our result.

<div class="code-group">

```python
# Time: O(n * 2^m) where m is max digits in square (m ≤ 7 for n ≤ 1000)
# Space: O(m) for recursion depth
class Solution:
    def punishmentNumber(self, n: int) -> int:
        def canPartition(s: str, target: int, idx: int, current_sum: int) -> bool:
            """
            Check if string s starting from index idx can be partitioned
            to sum to target.

            Args:
                s: The string representation of i²
                target: The remaining sum we need to achieve
                idx: Current position in the string
                current_sum: Sum of the current partition being formed

            Returns:
                True if a valid partition exists, False otherwise
            """
            # Base case: reached end of string
            if idx == len(s):
                return current_sum == target

            # Try all possible partition points starting from idx
            for end in range(idx + 1, len(s) + 1):
                # Convert current substring to integer
                num = int(s[idx:end])

                # Recursively check if we can partition the rest
                if canPartition(s, target, end, current_sum + num):
                    return True

            return False

        total = 0
        # Check each number from 1 to n
        for i in range(1, n + 1):
            square_str = str(i * i)
            # Check if square can be partitioned to sum to i
            if canPartition(square_str, i, 0, 0):
                total += i * i

        return total
```

```javascript
// Time: O(n * 2^m) where m is max digits in square (m ≤ 7 for n ≤ 1000)
// Space: O(m) for recursion depth
/**
 * @param {number} n
 * @return {number}
 */
var punishmentNumber = function (n) {
  /**
   * Check if string s starting from index idx can be partitioned
   * to sum to target.
   *
   * @param {string} s - The string representation of i²
   * @param {number} target - The target sum we need to achieve
   * @param {number} idx - Current position in the string
   * @param {number} currentSum - Sum of the current partition being formed
   * @return {boolean} True if a valid partition exists, False otherwise
   */
  const canPartition = (s, target, idx, currentSum) => {
    // Base case: reached end of string
    if (idx === s.length) {
      return currentSum === target;
    }

    // Try all possible partition points starting from idx
    for (let end = idx + 1; end <= s.length; end++) {
      // Convert current substring to integer
      const num = parseInt(s.substring(idx, end), 10);

      // Recursively check if we can partition the rest
      if (canPartition(s, target, end, currentSum + num)) {
        return true;
      }
    }

    return false;
  };

  let total = 0;
  // Check each number from 1 to n
  for (let i = 1; i <= n; i++) {
    const squareStr = (i * i).toString();
    // Check if square can be partitioned to sum to i
    if (canPartition(squareStr, i, 0, 0)) {
      total += i * i;
    }
  }

  return total;
};
```

```java
// Time: O(n * 2^m) where m is max digits in square (m ≤ 7 for n ≤ 1000)
// Space: O(m) for recursion depth
class Solution {
    public int punishmentNumber(int n) {
        int total = 0;
        // Check each number from 1 to n
        for (int i = 1; i <= n; i++) {
            String squareStr = Integer.toString(i * i);
            // Check if square can be partitioned to sum to i
            if (canPartition(squareStr, i, 0, 0)) {
                total += i * i;
            }
        }
        return total;
    }

    /**
     * Check if string s starting from index idx can be partitioned
     * to sum to target.
     *
     * @param s The string representation of i²
     * @param target The target sum we need to achieve
     * @param idx Current position in the string
     * @param currentSum Sum of the current partition being formed
     * @return True if a valid partition exists, False otherwise
     */
    private boolean canPartition(String s, int target, int idx, int currentSum) {
        // Base case: reached end of string
        if (idx == s.length()) {
            return currentSum == target;
        }

        // Try all possible partition points starting from idx
        for (int end = idx + 1; end <= s.length(); end++) {
            // Convert current substring to integer
            int num = Integer.parseInt(s.substring(idx, end));

            // Recursively check if we can partition the rest
            if (canPartition(s, target, end, currentSum + num)) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * 2^m)` where `n` is the input number and `m` is the maximum number of digits in any square. Since `n ≤ 1000`, the maximum square is 1,000,000 which has 7 digits. So `2^(7-1) = 64` partitions to check per number. In practice, many branches are pruned early when the current sum exceeds the target. This gives us roughly `O(1000 * 64) = O(64,000)` operations, which is efficient.

**Space Complexity:** `O(m)` for the recursion call stack depth, where `m` is the length of the square string (max 7). The recursion depth equals the maximum number of partitions, which in worst case is `m`.

## Common Mistakes

1. **Not handling leading zeros correctly**: When partitioning "100", you might try "1" + "00" where "00" converts to 0. This is correct, but some implementations might incorrectly reject this. Make sure your string-to-integer conversion handles leading zeros properly.

2. **Forgetting the base case**: The recursion must stop when `idx == len(s)`. A common mistake is to check if `current_sum == target` without verifying we've used all characters. We need to ensure we've partitioned the ENTIRE string, not just part of it.

3. **Inefficient substring conversion**: Repeatedly converting substrings to integers in the recursion can be optimized by building the number incrementally, but for strings of max length 7, this is acceptable. However, in an interview, mentioning this optimization shows deeper understanding.

4. **Missing the optimization opportunity**: You could add an early exit condition: if `current_sum > target`, return `false` immediately since all numbers are positive. This prunes unnecessary branches.

## When You'll See This Pattern

This problem combines two important patterns:

1. **String Partitioning/Backtracking**: Similar to:
   - [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) - Partition string into palindromic substrings
   - [Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses/) - Partition string into valid IP address segments
   - [Additive Number](https://leetcode.com/problems/additive-number/) - Check if string can be partitioned into additive sequence

2. **Digit Manipulation with Constraints**: Problems where you need to check properties of numbers by examining their digit representations:
   - [Split Array into Fibonacci Sequence](https://leetcode.com/problems/split-array-into-fibonacci-sequence/) - Similar partitioning with Fibonacci constraint
   - [Number of Great Partitions](https://leetcode.com/problems/number-of-great-partitions/) - More complex partitioning with sum constraints

## Key Takeaways

1. **Backtracking is natural for partitioning problems**: When you need to explore all ways to split a sequence, recursion with backtracking is often the cleanest approach. Think about making a decision at each position (cut or not cut) and recursing on the remainder.

2. **Constraints guide implementation choices**: With `n ≤ 1000`, exponential solutions on string length are acceptable. Always check problem constraints before dismissing an approach as "too slow."

3. **Mathematical problems often hide algorithmic challenges**: This looks like a math problem but is really about string partitioning. Always read past the surface description to identify the core algorithmic challenge.

Related problems: [Number of Great Partitions](/problem/number-of-great-partitions)
