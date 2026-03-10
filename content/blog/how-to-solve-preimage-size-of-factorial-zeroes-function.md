---
title: "How to Solve Preimage Size of Factorial Zeroes Function — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Preimage Size of Factorial Zeroes Function. Hard difficulty, 46.7% acceptance rate. Topics: Math, Binary Search."
date: "2029-08-28"
category: "dsa-patterns"
tags: ["preimage-size-of-factorial-zeroes-function", "math", "binary-search", "hard"]
---

# How to Solve Preimage Size of Factorial Zeroes Function

This problem asks: given a target number `k` of trailing zeros in a factorial, how many non-negative integers `x` exist such that `x!` has exactly `k` trailing zeros? The challenge is that we can't compute factorials directly (they grow astronomically fast), and we need to efficiently determine the range of `x` values that produce exactly `k` zeros.

What makes this problem interesting is that it builds on the classic "Factorial Trailing Zeroes" problem but adds a twist: instead of finding how many zeros a given factorial has, we need to find how many factorials have a given number of zeros. This requires understanding the mathematical properties of trailing zeros and using binary search creatively.

## Visual Walkthrough

Let's build intuition with an example. Recall that trailing zeros in `x!` come from factors of 10, which are made from pairs of 2 and 5. Since there are always more factors of 2 than 5, the number of trailing zeros equals the number of times 5 divides `x!`.

For `k = 2`, let's find which `x` values give exactly 2 trailing zeros:

- `f(5) = 1` (5! = 120 has 1 zero)
- `f(6) = 1` (6! = 720 has 1 zero)
- `f(7) = 1`, `f(8) = 1`, `f(9) = 1`
- `f(10) = 2` (10! = 3,628,800 has 2 zeros)
- `f(11) = 2`, `f(12) = 2`, `f(13) = 2`, `f(14) = 2`
- `f(15) = 3` (15! has 3 zeros)

So for `k = 2`, the `x` values that work are 10, 11, 12, 13, 14. That's 5 consecutive integers. Notice something important: the answer is either 0 or 5. Why 5? Because every 5 numbers, we get an additional factor of 5. The function `f(x)` (number of trailing zeros) is non-decreasing and jumps by 1 at multiples of 5, by 2 at multiples of 25, etc.

For `k = 5`, let's check:

- `f(24) = 4` (24! has 4 zeros)
- `f(25) = 6` (25 contributes two factors of 5, so we jump from 4 to 6)
- There's no `x` where `f(x) = 5`! So the answer is 0.

The pattern: `f(x)` increases in steps, and sometimes skips values. Our task is to find if `k` is in the range of `f(x)`, and if so, how many consecutive `x` values map to it.

## Brute Force Approach

A naive approach would be to iterate through `x` values, compute `f(x)` for each, and count how many give exactly `k` zeros. We can compute `f(x)` efficiently using the formula from the "Factorial Trailing Zeroes" problem: count how many multiples of 5, 25, 125, etc., are ≤ `x`.

However, we don't know when to stop searching. `f(x)` grows roughly as `x/4`, so for large `k`, we might need to check up to `x ≈ 5k`. For `k` up to 10⁹, this means checking billions of values, which is far too slow.

Even if we could bound the search, checking each `x` individually would still be O(n log n) time (log n for computing `f(x)`), which is impractical for large `k`.

## Optimized Approach

The key insight is that `f(x)` is monotonic (non-decreasing) because adding more factors to the factorial can only increase or maintain the number of trailing zeros. This allows us to use binary search!

We need to answer two questions:

1. What's the smallest `x` such that `f(x) ≥ k`? (lower bound)
2. What's the smallest `x` such that `f(x) ≥ k+1`? (next value)

If no `x` satisfies `f(x) = k`, then these two bounds will be the same. If some `x` satisfy `f(x) = k`, then all such `x` will be between these bounds.

The number of solutions is: `upper_bound - lower_bound`.

Why does this work? Because `f(x)` is a step function. Once it reaches `k`, it stays at `k` for a while before jumping to the next value. All `x` values in that plateau give exactly `k` zeros.

## Optimal Solution

We'll implement binary search to find the bounds. The helper function `trailingZeroes(x)` computes `f(x)` efficiently by counting factors of 5.

<div class="code-group">

```python
# Time: O(log²k) - binary search with O(logk) trailingZeroes computation
# Space: O(1)
class Solution:
    def preimageSizeFZF(self, k: int) -> int:
        # Helper: count trailing zeros in x!
        def trailingZeroes(x: int) -> int:
            count = 0
            divisor = 5
            while divisor <= x:
                count += x // divisor
                divisor *= 5
            return count

        # Find left bound: smallest x where f(x) >= k
        def find_left_bound(k: int) -> int:
            left, right = 0, 5 * (k + 1)  # Upper bound: f(5k) ≈ k
            while left < right:
                mid = left + (right - left) // 2
                if trailingZeroes(mid) >= k:
                    right = mid  # Search left half (including mid)
                else:
                    left = mid + 1  # Search right half
            return left

        # Find right bound: smallest x where f(x) >= k+1
        left_bound = find_left_bound(k)
        right_bound = find_left_bound(k + 1)

        # Number of x values with exactly k trailing zeros
        return right_bound - left_bound
```

```javascript
// Time: O(log²k) - binary search with O(logk) trailingZeroes computation
// Space: O(1)
var preimageSizeFZF = function (k) {
  // Helper: count trailing zeros in x!
  const trailingZeroes = (x) => {
    let count = 0;
    let divisor = 5;
    while (divisor <= x) {
      count += Math.floor(x / divisor);
      divisor *= 5;
    }
    return count;
  };

  // Find left bound: smallest x where f(x) >= target
  const findLeftBound = (target) => {
    let left = 0;
    let right = 5 * (target + 1); // Upper bound: f(5k) ≈ k
    while (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      if (trailingZeroes(mid) >= target) {
        right = mid; // Search left half (including mid)
      } else {
        left = mid + 1; // Search right half
      }
    }
    return left;
  };

  const leftBound = findLeftBound(k);
  const rightBound = findLeftBound(k + 1);

  // Number of x values with exactly k trailing zeros
  return rightBound - leftBound;
};
```

```java
// Time: O(log²k) - binary search with O(logk) trailingZeroes computation
// Space: O(1)
class Solution {
    public int preimageSizeFZF(int k) {
        // Helper: count trailing zeros in x!
        private long trailingZeroes(long x) {
            long count = 0;
            long divisor = 5;
            while (divisor <= x) {
                count += x / divisor;
                divisor *= 5;
            }
            return count;
        }

        // Find left bound: smallest x where f(x) >= target
        private long findLeftBound(int target) {
            long left = 0;
            long right = 5L * (target + 1);  // Upper bound: f(5k) ≈ k
            while (left < right) {
                long mid = left + (right - left) / 2;
                if (trailingZeroes(mid) >= target) {
                    right = mid;  // Search left half (including mid)
                } else {
                    left = mid + 1;  // Search right half
                }
            }
            return left;
        }

        long leftBound = findLeftBound(k);
        long rightBound = findLeftBound(k + 1);

        // Number of x values with exactly k trailing zeros
        return (int)(rightBound - leftBound);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log²k)

- The `trailingZeroes(x)` function runs in O(log x) time because we divide by increasing powers of 5 (5, 25, 125, ...) until we exceed `x`.
- We perform binary search twice, each taking O(log N) iterations where N is our search space (roughly 5k).
- Each iteration calls `trailingZeroes(mid)`, which takes O(log mid) ≈ O(log k).
- Total: O(log k × log k) = O(log²k).

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables.
- The recursion in binary search is iterative, not recursive, so no call stack overhead.

## Common Mistakes

1. **Incorrect upper bound for binary search**: Using `k` as the upper bound is wrong because `f(5k) ≈ k`, but due to contributions from higher powers of 5, it could be slightly more. A safe bound is `5 * (k + 1)` or even `5k + 5`.

2. **Off-by-one errors in binary search**: When searching for the left bound (first `x` where `f(x) ≥ k`), we need to use the standard lower-bound binary search pattern. A common mistake is returning `mid` without ensuring it's the smallest valid value.

3. **Integer overflow**: When computing `divisor *= 5` in `trailingZeroes`, or when setting `right = 5 * (k + 1)`, we might overflow 32-bit integers. For large `k` (up to 10⁹), we need 64-bit integers (long in Java, no issue in Python).

4. **Forgetting that answer is always 0 or 5**: Some candidates try to compute the exact count by iterating, not realizing the mathematical property that the function increases in jumps, and plateaus always have length 5 (except when skipping values).

## When You'll See This Pattern

This problem combines two important patterns:

1. **Binary search on answer**: When you need to find a value that satisfies a condition, and you have a way to test whether a candidate is too low or too high. Other problems:
   - "Sqrt(x)" (Easy): Find integer square root using binary search.
   - "Capacity To Ship Packages Within D Days" (Medium): Find minimum capacity using binary search.

2. **Mathematical counting problems**: Problems that require understanding mathematical properties rather than brute force. Other problems:
   - "Factorial Trailing Zeroes" (Medium): Direct application of the trailing zero formula.
   - "Ugly Number II" (Medium): Finding numbers with specific prime factors.

3. **Step function analysis**: Problems where the function increases in discrete jumps. This pattern appears in problems about digit sums, divisor counts, and other number-theoretic functions.

## Key Takeaways

1. **Monotonic functions enable binary search**: If you can determine whether `f(x) ≥ target` for any `x`, and `f(x)` is monotonic, you can use binary search to find boundaries efficiently.

2. **Understand the mathematical structure**: The fact that the answer is always 0 or 5 comes from the properties of how trailing zeros accumulate (jumping at multiples of 5). Recognizing such patterns can simplify implementation.

3. **Test with small cases**: When stuck, work through examples by hand (like we did with k=2 and k=5). This reveals patterns that guide the algorithm design.

Related problems: [Factorial Trailing Zeroes](/problem/factorial-trailing-zeroes)
