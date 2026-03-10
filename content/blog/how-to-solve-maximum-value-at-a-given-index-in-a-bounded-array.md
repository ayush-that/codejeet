---
title: "How to Solve Maximum Value at a Given Index in a Bounded Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Value at a Given Index in a Bounded Array. Medium difficulty, 38.9% acceptance rate. Topics: Math, Binary Search, Greedy."
date: "2027-09-07"
category: "dsa-patterns"
tags:
  ["maximum-value-at-a-given-index-in-a-bounded-array", "math", "binary-search", "greedy", "medium"]
---

# How to Solve Maximum Value at a Given Index in a Bounded Array

This problem asks us to find the maximum possible value at a given index in an array of length `n`, where the array must satisfy two constraints: all elements are positive integers, adjacent elements differ by at most 1, and the sum of all elements cannot exceed `maxSum`. The challenge lies in balancing the desire to maximize a specific element while respecting both the smoothness constraint and the total sum limit.

What makes this problem interesting is that it combines mathematical reasoning with algorithmic optimization. The smoothness constraint forces the array to form a "mountain" shape around the target index, and we need to find the tallest possible peak that fits within the sum budget.

## Visual Walkthrough

Let's trace through an example: `n = 4`, `index = 2`, `maxSum = 6`.

We want to maximize `nums[2]` while respecting all constraints. Let's try different values:

- If `nums[2] = 3`, the array would need to look like: `[2, 3, 3, 2]` (since adjacent elements can differ by at most 1). Sum = 2 + 3 + 3 + 2 = 10, which exceeds `maxSum = 6`.

- If `nums[2] = 2`, the array could be: `[1, 2, 2, 1]`. Sum = 1 + 2 + 2 + 1 = 6, which exactly equals `maxSum`. This works!

- If `nums[2] = 1`, the array would be: `[1, 1, 1, 1]`. Sum = 4, which is within `maxSum`, but we can do better.

So the answer is 2. Notice how the array forms a pyramid shape around index 2, decreasing by 1 on each side until it reaches 1 (the minimum positive integer).

## Brute Force Approach

A naive approach would be to try every possible value for `nums[index]` from 1 up to `maxSum`, check if we can build a valid array with that peak value, and return the maximum valid value.

For each candidate value `x`, we'd need to construct the minimum possible sum array with `nums[index] = x`. Due to the `abs(nums[i] - nums[i+1]) <= 1` constraint, the optimal shape is a pyramid: values decrease by 1 as we move away from the peak until they reach 1, then stay at 1.

The brute force would calculate this sum for each `x` and check if it's ≤ `maxSum`. Since `x` can be as large as `maxSum` (which can be up to 10⁹), this approach is far too slow — O(maxSum) time complexity, which is impractical.

## Optimized Approach

The key insight is that we can use **binary search** to find the maximum valid `x`. Why binary search works:

1. **Monotonic property**: If `x` works (we can build an array with sum ≤ maxSum), then all values less than `x` also work. If `x` doesn't work, then all values greater than `x` also won't work.

2. **Efficient sum calculation**: We can compute the minimum sum for a given peak value `x` in O(1) time using arithmetic series formulas, rather than constructing the entire array.

The sum calculation has three parts:

- The peak itself: `x`
- Left side: A decreasing sequence from `x-1` down to 1 (or until we run out of indices)
- Right side: Similarly decreasing sequence

For each side, if we have enough indices, we get a full arithmetic sequence. If not, we have some 1's at the ends.

## Optimal Solution

We binary search between 1 and `maxSum` to find the maximum `x` where the minimum possible sum with peak `x` is ≤ `maxSum`.

<div class="code-group">

```python
# Time: O(log(maxSum)) | Space: O(1)
def maxValue(n: int, index: int, maxSum: int) -> int:
    # Binary search for the maximum value at nums[index]
    left, right = 1, maxSum

    while left <= right:
        mid = left + (right - left) // 2

        # Calculate minimum sum with nums[index] = mid
        total = mid  # Start with the peak value

        # Calculate sum on left side (indices 0 to index-1)
        # Left side length = index
        if index > 0:
            # If mid is large enough to form a decreasing sequence
            if mid > index:
                # Full arithmetic sequence: (mid-1) + (mid-2) + ... + (mid-index)
                # Sum = number_of_terms * (first + last) / 2
                left_terms = index
                first = mid - 1
                last = mid - index
                total += left_terms * (first + last) // 2
            else:
                # Sequence goes: (mid-1) + (mid-2) + ... + 1 + (1's for remaining indices)
                # For the decreasing part: 1 + 2 + ... + (mid-1)
                decreasing_terms = mid - 1
                total += decreasing_terms * (1 + decreasing_terms) // 2
                # Remaining indices are all 1's
                total += index - (mid - 1)

        # Calculate sum on right side (indices index+1 to n-1)
        # Right side length = n - index - 1
        right_length = n - index - 1
        if right_length > 0:
            if mid > right_length:
                # Full arithmetic sequence: (mid-1) + (mid-2) + ... + (mid-right_length)
                right_terms = right_length
                first = mid - 1
                last = mid - right_length
                total += right_terms * (first + last) // 2
            else:
                # Sequence goes: (mid-1) + (mid-2) + ... + 1 + (1's for remaining indices)
                decreasing_terms = mid - 1
                total += decreasing_terms * (1 + decreasing_terms) // 2
                # Remaining indices are all 1's
                total += right_length - (mid - 1)

        # Check if this sum fits within maxSum
        if total <= maxSum:
            left = mid + 1  # Try a larger value
        else:
            right = mid - 1  # Try a smaller value

    return right  # right is the largest valid value
```

```javascript
// Time: O(log(maxSum)) | Space: O(1)
function maxValue(n, index, maxSum) {
  // Binary search for the maximum value at nums[index]
  let left = 1,
    right = maxSum;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    // Calculate minimum sum with nums[index] = mid
    let total = mid; // Start with the peak value

    // Calculate sum on left side (indices 0 to index-1)
    // Left side length = index
    if (index > 0) {
      // If mid is large enough to form a decreasing sequence
      if (mid > index) {
        // Full arithmetic sequence: (mid-1) + (mid-2) + ... + (mid-index)
        // Sum = number_of_terms * (first + last) / 2
        const leftTerms = index;
        const first = mid - 1;
        const last = mid - index;
        total += (leftTerms * (first + last)) / 2;
      } else {
        // Sequence goes: (mid-1) + (mid-2) + ... + 1 + (1's for remaining indices)
        // For the decreasing part: 1 + 2 + ... + (mid-1)
        const decreasingTerms = mid - 1;
        total += (decreasingTerms * (1 + decreasingTerms)) / 2;
        // Remaining indices are all 1's
        total += index - (mid - 1);
      }
    }

    // Calculate sum on right side (indices index+1 to n-1)
    // Right side length = n - index - 1
    const rightLength = n - index - 1;
    if (rightLength > 0) {
      if (mid > rightLength) {
        // Full arithmetic sequence: (mid-1) + (mid-2) + ... + (mid-rightLength)
        const rightTerms = rightLength;
        const first = mid - 1;
        const last = mid - rightLength;
        total += (rightTerms * (first + last)) / 2;
      } else {
        // Sequence goes: (mid-1) + (mid-2) + ... + 1 + (1's for remaining indices)
        const decreasingTerms = mid - 1;
        total += (decreasingTerms * (1 + decreasingTerms)) / 2;
        // Remaining indices are all 1's
        total += rightLength - (mid - 1);
      }
    }

    // Check if this sum fits within maxSum
    if (total <= maxSum) {
      left = mid + 1; // Try a larger value
    } else {
      right = mid - 1; // Try a smaller value
    }
  }

  return right; // right is the largest valid value
}
```

```java
// Time: O(log(maxSum)) | Space: O(1)
class Solution {
    public int maxValue(int n, int index, int maxSum) {
        // Binary search for the maximum value at nums[index]
        int left = 1, right = maxSum;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Calculate minimum sum with nums[index] = mid
            long total = mid;  // Use long to prevent overflow

            // Calculate sum on left side (indices 0 to index-1)
            // Left side length = index
            if (index > 0) {
                // If mid is large enough to form a decreasing sequence
                if (mid > index) {
                    // Full arithmetic sequence: (mid-1) + (mid-2) + ... + (mid-index)
                    // Sum = number_of_terms * (first + last) / 2
                    int leftTerms = index;
                    long first = mid - 1L;
                    long last = mid - index;
                    total += leftTerms * (first + last) / 2;
                } else {
                    // Sequence goes: (mid-1) + (mid-2) + ... + 1 + (1's for remaining indices)
                    // For the decreasing part: 1 + 2 + ... + (mid-1)
                    int decreasingTerms = mid - 1;
                    total += decreasingTerms * (1L + decreasingTerms) / 2;
                    // Remaining indices are all 1's
                    total += index - (mid - 1);
                }
            }

            // Calculate sum on right side (indices index+1 to n-1)
            // Right side length = n - index - 1
            int rightLength = n - index - 1;
            if (rightLength > 0) {
                if (mid > rightLength) {
                    // Full arithmetic sequence: (mid-1) + (mid-2) + ... + (mid-rightLength)
                    int rightTerms = rightLength;
                    long first = mid - 1L;
                    long last = mid - rightLength;
                    total += rightTerms * (first + last) / 2;
                } else {
                    // Sequence goes: (mid-1) + (mid-2) + ... + 1 + (1's for remaining indices)
                    int decreasingTerms = mid - 1;
                    total += decreasingTerms * (1L + decreasingTerms) / 2;
                    // Remaining indices are all 1's
                    total += rightLength - (mid - 1);
                }
            }

            // Check if this sum fits within maxSum
            if (total <= maxSum) {
                left = mid + 1;  // Try a larger value
            } else {
                right = mid - 1;  // Try a smaller value
            }
        }

        return right;  // right is the largest valid value
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(maxSum))

- We perform binary search over the range [1, maxSum], which takes O(log(maxSum)) iterations.
- Each iteration calculates the sum in O(1) time using arithmetic series formulas.

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables, regardless of input size.

## Common Mistakes

1. **Integer overflow**: When calculating sums for large values, intermediate calculations can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C) for sum calculations.

2. **Off-by-one errors in sequence length**: The left side has `index` elements (indices 0 to index-1), and the right side has `n - index - 1` elements (indices index+1 to n-1). Confusing these leads to incorrect sums.

3. **Forgetting the base case of 1**: When the peak value isn't large enough to cover all indices on a side, the remaining indices must be filled with 1's (the minimum positive integer). Missing this case underestimates the sum.

4. **Incorrect binary search boundaries**: Starting the search from 0 instead of 1 (values must be positive), or using the wrong comparison in the binary search condition.

## When You'll See This Pattern

This "binary search on answer" pattern appears when:

1. You need to find the maximum/minimum value satisfying some constraint
2. There's a monotonic relationship: if x works, then all values less/greater than x also work
3. Checking whether a candidate value works is easier than finding the optimal value directly

Related LeetCode problems:

- **875. Koko Eating Bananas**: Binary search for the minimum eating speed
- **1011. Capacity To Ship Packages Within D Days**: Binary search for the minimum ship capacity
- **410. Split Array Largest Sum**: Binary search for the minimum largest sum

## Key Takeaways

1. **When you need to maximize/minimize a value under constraints, consider binary search on the answer space** if checking feasibility is easier than finding the optimal directly.

2. **Mathematical formulas can replace iterative calculations** for sequences. Arithmetic series sum = n × (first + last) / 2 can optimize O(n) operations to O(1).

3. **Always consider edge cases in binary search**: proper initialization of bounds, termination condition, and what to return (usually `left` or `right` depending on the search direction).

[Practice this problem on CodeJeet](/problem/maximum-value-at-a-given-index-in-a-bounded-array)
