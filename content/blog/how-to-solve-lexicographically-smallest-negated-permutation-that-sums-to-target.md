---
title: "How to Solve Lexicographically Smallest Negated Permutation that Sums to Target — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest Negated Permutation that Sums to Target. Medium difficulty, 30.8% acceptance rate. Topics: Array, Math, Two Pointers, Greedy, Sorting."
date: "2026-03-26"
category: "dsa-patterns"
tags:
  [
    "lexicographically-smallest-negated-permutation-that-sums-to-target",
    "array",
    "math",
    "two-pointers",
    "medium",
  ]
---

# How to Solve Lexicographically Smallest Negated Permutation that Sums to Target

You need to create an array of length `n` where the absolute values are exactly 1 through `n` (a permutation), but each number can be positive or negative, and the sum must equal `target`. The tricky part is finding the lexicographically smallest arrangement—meaning the earliest possible negative numbers at the smallest indices—while still hitting the exact target sum.

## Visual Walkthrough

Let's trace through `n = 3, target = 0`:

We have numbers 1, 2, 3 to assign signs to. The maximum sum if all are positive is 1+2+3 = 6. The minimum sum if all are negative is -6. Our target 0 is in between.

**Step 1:** Start with all positive: [1, 2, 3] = sum 6. We need to reduce by 6 to reach 0.

**Step 2:** To reduce the sum, we flip numbers from positive to negative. Flipping `k` reduces sum by `2k` (since we go from +k to -k, a change of -2k).

**Step 3:** We need total reduction = 6. So we need numbers whose doubled values sum to 6: 2+4 = 6 works (flip 1 and 2: -2 + -4 = -6 reduction).

**Step 4:** Result: [-1, -2, 3] = sum 0. But is this lexicographically smallest? Lex order compares arrays element by element: [-1, -2, 3] vs [-1, 2, -3]. At index 0: both -1. Index 1: -2 < 2, so [-1, -2, 3] is smaller.

**Step 5:** The key insight: To be lex smallest, we want negatives as early as possible. So flip the largest numbers possible starting from the end, because flipping a larger number creates more negative value at a later index, keeping earlier indices as positive or less negative.

For `n = 4, target = 4`:
Max sum = 1+2+3+4 = 10. Need sum 4, so need reduction of 6.
Flip from largest: flip 4? 2×4=8 reduction → too much (would give sum 2).
Flip 3? 2×3=6 reduction → perfect! Result: [1, 2, -3, 4] = 1+2-3+4=4.

## Brute Force Approach

A naive approach would try all 2ⁿ sign assignments (each of n numbers can be + or -), check if sum equals target, and track the lexicographically smallest valid array. This is O(2ⁿ·n) time—impossible for n up to 1000.

Even generating all permutations of signs is too slow. A slightly better brute force might try to greedily assign signs but could miss the lex smallest ordering. For example, always flipping the largest number to negative if needed might not give the earliest possible negatives.

The brute force fails because:

1. Exponential time complexity
2. Doesn't directly address lexicographic ordering
3. Hard to guarantee finding the smallest arrangement

## Optimized Approach

The key insight has two parts:

1. **Sum feasibility**: The target must be between -S and +S where S = n(n+1)/2, and (S - target) must be even (since each flip changes sum by an even amount).

2. **Lexicographic ordering**: To minimize lex order, keep early numbers as positive as possible. Flip numbers starting from the largest end, because flipping a large number to negative affects a later index, keeping earlier indices non-negative.

**Step-by-step reasoning:**

- Calculate total sum S = 1+2+...+n
- Compute needed reduction: diff = S - target (must be non-negative even)
- Initialize result array with all positive numbers [1, 2, ..., n]
- Starting from the largest number (n) down to 1:
  - If diff ≥ 2×current_number, flip this number (make it negative) and subtract 2×current_number from diff
  - This greedily uses largest numbers first to minimize impact on early indices
- If diff becomes 0, we've found our solution

Why this gives lex smallest: When comparing two arrays, the first differing position decides. By flipping larger numbers later, we keep earlier positions as large as possible (or least negative). A negative number at position i makes the array lex smaller than a positive number at i, but we want the smallest lex array, so we want negatives as early as possible—but only if needed to reach target. Our algorithm achieves this balance.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def getSmallestPermutation(n: int, target: int):
    # Calculate total sum of 1 through n
    total = n * (n + 1) // 2

    # Check if target is achievable
    # Target must be between -total and total, and (total - target) must be even
    if abs(target) > total or (total - target) % 2 != 0:
        return []  # No valid permutation exists

    # Initialize result with all positive numbers
    result = [i for i in range(1, n + 1)]

    # Calculate how much we need to reduce from total to reach target
    # Each flip (positive to negative) reduces sum by 2*value
    diff = total - target

    # Start from the largest number and work backwards
    # This ensures lexicographically smallest result because
    # flipping larger numbers affects later indices, keeping earlier ones positive
    for i in range(n - 1, -1, -1):
        value = result[i]
        # Check if flipping this number would help reduce diff
        # We can only flip if diff >= 2*value (need to reduce by at least this much)
        if diff >= 2 * value:
            result[i] = -value  # Flip to negative
            diff -= 2 * value   # Account for the reduction

        # Early exit if we've reached target
        if diff == 0:
            break

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function getSmallestPermutation(n, target) {
  // Calculate total sum of 1 through n
  const total = (n * (n + 1)) / 2;

  // Check if target is achievable
  // Target must be between -total and total, and (total - target) must be even
  if (Math.abs(target) > total || (total - target) % 2 !== 0) {
    return []; // No valid permutation exists
  }

  // Initialize result with all positive numbers
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push(i);
  }

  // Calculate how much we need to reduce from total to reach target
  // Each flip (positive to negative) reduces sum by 2*value
  let diff = total - target;

  // Start from the largest number and work backwards
  // This ensures lexicographically smallest result because
  // flipping larger numbers affects later indices, keeping earlier ones positive
  for (let i = n - 1; i >= 0; i--) {
    const value = result[i];
    // Check if flipping this number would help reduce diff
    // We can only flip if diff >= 2*value (need to reduce by at least this much)
    if (diff >= 2 * value) {
      result[i] = -value; // Flip to negative
      diff -= 2 * value; // Account for the reduction
    }

    // Early exit if we've reached target
    if (diff === 0) {
      break;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
import java.util.Arrays;

public class Solution {
    public int[] getSmallestPermutation(int n, int target) {
        // Calculate total sum of 1 through n
        int total = n * (n + 1) / 2;

        // Check if target is achievable
        // Target must be between -total and total, and (total - target) must be even
        if (Math.abs(target) > total || (total - target) % 2 != 0) {
            return new int[0];  // No valid permutation exists
        }

        // Initialize result with all positive numbers
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            result[i] = i + 1;
        }

        // Calculate how much we need to reduce from total to reach target
        // Each flip (positive to negative) reduces sum by 2*value
        int diff = total - target;

        // Start from the largest number and work backwards
        // This ensures lexicographically smallest result because
        // flipping larger numbers affects later indices, keeping earlier ones positive
        for (int i = n - 1; i >= 0; i--) {
            int value = result[i];
            // Check if flipping this number would help reduce diff
            // We can only flip if diff >= 2*value (need to reduce by at least this much)
            if (diff >= 2 * value) {
                result[i] = -value;  // Flip to negative
                diff -= 2 * value;   // Account for the reduction
            }

            // Early exit if we've reached target
            if (diff == 0) {
                break;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once to initialize it: O(n)
- We iterate through the array once more (backwards) to flip numbers: O(n)
- Total: O(n) linear time

**Space Complexity:** O(n)

- We need to store the result array of size n
- We use only a few extra variables (total, diff, i, value)
- Total: O(n) for the output, O(1) auxiliary space

The algorithm is optimal because we must at least construct the output array of size n, requiring Ω(n) time and space.

## Common Mistakes

1. **Not checking feasibility first**: Forgetting to verify that (total - target) is even and target is within bounds. This leads to infinite loops or incorrect results when no solution exists.

2. **Flipping from the beginning instead of the end**: Starting with the smallest numbers creates a less optimal lex order. For example, with n=3, target=0: flipping 1 and 2 gives [-1, -2, 3] (lex smaller) vs flipping 1 and 3 gives [-1, 2, -3] (lex larger at index 1: -2 < 2).

3. **Incorrect diff calculation**: Using `target - total` instead of `total - target` or forgetting the factor of 2 when subtracting. Each flip changes the sum by 2×value, not just value.

4. **Overlooking early exit**: Continuing to check numbers after diff reaches 0 is inefficient (though still O(n)). The early break when diff==0 is a small optimization that shows good coding practice.

## When You'll See This Pattern

This problem combines **greedy selection** with **parity checking** and **lexicographic ordering**—patterns that appear in many optimization problems:

1. **Two Sum variations** (LeetCode 1, 167): Like finding pairs that sum to a target, but here we're assigning signs to hit an exact sum.

2. **Partition problems** (LeetCode 416, 698): Splitting numbers into groups with specific sums shares the parity and feasibility checking logic.

3. **Constructive array problems** (LeetCode 667, 942): Building arrays with specific properties often uses similar greedy backward construction for lexicographic optimization.

The core technique of "work backwards from largest to smallest for lexicographic ordering" appears in problems where you need the smallest arrangement satisfying constraints.

## Key Takeaways

1. **Greedy backward construction minimizes lex order**: When you need the lexicographically smallest array and have flexibility in later positions, process from the end to keep early elements as favorable as possible.

2. **Parity matters in sum problems**: When each operation changes the sum by an even amount (like flipping signs of integers), the difference between current and target must be even for a solution to exist.

3. **Always check feasibility first**: Before attempting to construct a solution, verify mathematical constraints (bounds, parity, divisibility) to avoid wasted computation and handle edge cases properly.

[Practice this problem on CodeJeet](/problem/lexicographically-smallest-negated-permutation-that-sums-to-target)
