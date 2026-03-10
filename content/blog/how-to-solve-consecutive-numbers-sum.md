---
title: "How to Solve Consecutive Numbers Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Consecutive Numbers Sum. Hard difficulty, 42.6% acceptance rate. Topics: Math, Enumeration."
date: "2027-06-16"
category: "dsa-patterns"
tags: ["consecutive-numbers-sum", "math", "enumeration", "hard"]
---

# How to Solve Consecutive Numbers Sum

This problem asks: given a positive integer `n`, how many ways can we express it as a sum of consecutive positive integers? For example, `15 = 7+8 = 4+5+6 = 1+2+3+4+5` has three ways. What makes this problem tricky is that a brute force approach is too slow for large `n`, requiring a mathematical insight to solve efficiently.

## Visual Walkthrough

Let's trace through `n = 15` to build intuition. We want to find all sequences of consecutive positive integers that sum to 15:

1. **Length 1 sequence**: Just `15` itself (15)
2. **Length 2 sequence**: Two consecutive numbers: `x + (x+1) = 15` → `2x + 1 = 15` → `x = 7` → `7+8 = 15`
3. **Length 3 sequence**: Three consecutive numbers: `x + (x+1) + (x+2) = 15` → `3x + 3 = 15` → `x = 4` → `4+5+6 = 15`
4. **Length 4 sequence**: `4x + 6 = 15` → `4x = 9` → `x = 2.25` (not integer, invalid)
5. **Length 5 sequence**: `5x + 10 = 15` → `5x = 5` → `x = 1` → `1+2+3+4+5 = 15`
6. **Length 6 sequence**: `6x + 15 = 15` → `6x = 0` → `x = 0` (not positive, invalid)

So we found 3 valid sequences. Notice the pattern: for a sequence of length `k` starting at `x`, the sum is:

```
k*x + (0+1+2+...+(k-1)) = k*x + k*(k-1)/2 = n
```

Rearranging: `k*x = n - k*(k-1)/2`

For a valid solution, we need:

1. `n - k*(k-1)/2 > 0` (otherwise x would be ≤ 0)
2. `(n - k*(k-1)/2) % k == 0` (x must be integer)

## Brute Force Approach

A naive approach would try all possible starting points and lengths:

```python
def consecutiveNumbersSum(n):
    count = 0
    for start in range(1, n+1):
        current_sum = 0
        for num in range(start, n+1):
            current_sum += num
            if current_sum == n:
                count += 1
                break
            if current_sum > n:
                break
    return count
```

This runs in O(n²) time, which is far too slow for `n` up to 10⁹ (as in LeetCode constraints). We need a more mathematical approach.

## Optimized Approach

The key insight comes from our formula: `n = k*x + k*(k-1)/2`, where `k` is the sequence length and `x` is the starting number.

Rearranging: `n - k*(k-1)/2 = k*x`

For a valid sequence:

1. `n - k*(k-1)/2 > 0` (positive starting number)
2. `(n - k*(k-1)/2) % k == 0` (integer starting number)

We can iterate over possible `k` values. How many `k` should we check? Since the smallest starting number is 1, the maximum `k` satisfies:

```
k*(k-1)/2 < n  (from condition 1 above)
```

For large `n`, `k` is approximately √(2n). So we only need O(√n) iterations!

The algorithm:

1. Initialize `count = 0`
2. For `k = 1` while `k*(k-1)/2 < n`:
   - Check if `(n - k*(k-1)/2) % k == 0`
   - If yes, increment count
3. Return count

## Optimal Solution

<div class="code-group">

```python
# Time: O(√n) | Space: O(1)
def consecutiveNumbersSum(n):
    """
    Counts how many ways n can be expressed as a sum of
    consecutive positive integers.

    The key formula: n = k*x + k*(k-1)/2
    where k = length of sequence, x = starting number

    Rearranged: n - k*(k-1)/2 = k*x

    For valid sequence:
    1. n - k*(k-1)/2 > 0 (positive starting number)
    2. (n - k*(k-1)/2) % k == 0 (integer starting number)
    """
    count = 0

    # k represents the length of the consecutive sequence
    k = 1

    # Continue while k*(k-1)/2 < n
    # This ensures the starting number would be positive
    while k * (k - 1) // 2 < n:
        # Check if (n - sum of first k-1 numbers) is divisible by k
        if (n - k * (k - 1) // 2) % k == 0:
            count += 1
        k += 1

    return count
```

```javascript
// Time: O(√n) | Space: O(1)
function consecutiveNumbersSum(n) {
  /**
   * Counts how many ways n can be expressed as a sum of
   * consecutive positive integers.
   *
   * The key formula: n = k*x + k*(k-1)/2
   * where k = length of sequence, x = starting number
   *
   * Rearranged: n - k*(k-1)/2 = k*x
   *
   * For valid sequence:
   * 1. n - k*(k-1)/2 > 0 (positive starting number)
   * 2. (n - k*(k-1)/2) % k == 0 (integer starting number)
   */
  let count = 0;

  // k represents the length of the consecutive sequence
  let k = 1;

  // Continue while k*(k-1)/2 < n
  // This ensures the starting number would be positive
  while ((k * (k - 1)) / 2 < n) {
    // Check if (n - sum of first k-1 numbers) is divisible by k
    if ((n - (k * (k - 1)) / 2) % k === 0) {
      count++;
    }
    k++;
  }

  return count;
}
```

```java
// Time: O(√n) | Space: O(1)
class Solution {
    public int consecutiveNumbersSum(int n) {
        /**
         * Counts how many ways n can be expressed as a sum of
         * consecutive positive integers.
         *
         * The key formula: n = k*x + k*(k-1)/2
         * where k = length of sequence, x = starting number
         *
         * Rearranged: n - k*(k-1)/2 = k*x
         *
         * For valid sequence:
         * 1. n - k*(k-1)/2 > 0 (positive starting number)
         * 2. (n - k*(k-1)/2) % k == 0 (integer starting number)
         */
        int count = 0;

        // k represents the length of the consecutive sequence
        int k = 1;

        // Continue while k*(k-1)/2 < n
        // This ensures the starting number would be positive
        // Using long to avoid integer overflow for large k
        while ((long)k * (k - 1) / 2 < n) {
            // Check if (n - sum of first k-1 numbers) is divisible by k
            if ((n - k * (k - 1) / 2) % k == 0) {
                count++;
            }
            k++;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√n)**

- We iterate `k` from 1 up to approximately √(2n)
- The while loop condition `k*(k-1)/2 < n` means `k²/2 < n` (approximately), so `k < √(2n)`
- Each iteration does O(1) work (arithmetic operations)

**Space Complexity: O(1)**

- We only use a few integer variables (`count`, `k`)
- No additional data structures needed

## Common Mistakes

1. **Integer overflow in the loop condition**: When `n` is large (up to 10⁹), `k*(k-1)/2` can overflow 32-bit integers. Always use 64-bit integers (long in Java) for intermediate calculations.

2. **Including sequences starting from 0 or negative numbers**: The problem specifies "positive integers", so sequences must start from ≥1. Our condition `k*(k-1)/2 < n` ensures this.

3. **Checking too many `k` values**: Some candidates check `k` up to `n`, giving O(n) time instead of O(√n). Remember the mathematical bound.

4. **Forgetting the length-1 sequence**: The sequence `[n]` itself counts! Our formula handles this when `k=1`: `(n - 0) % 1 == 0` always true.

## When You'll See This Pattern

This mathematical decomposition pattern appears in problems where you need to count configurations satisfying a formula:

1. **Count Primes (LeetCode 204)**: Uses mathematical properties to efficiently count primes up to n.
2. **Perfect Squares (LeetCode 279)**: Decomposes numbers into sums of perfect squares using mathematical properties.
3. **Ugly Number II (LeetCode 264)**: Uses mathematical generation of numbers with specific prime factors.

The common thread: instead of brute force enumeration, find a mathematical relationship that lets you check far fewer possibilities.

## Key Takeaways

1. **Mathematical reformulation is key**: When a problem involves sums or sequences, try to express it as an equation. This often reveals constraints that reduce the search space dramatically.

2. **Look for divisor patterns**: Many number theory problems boil down to checking divisibility conditions. The condition `(n - k*(k-1)/2) % k == 0` is the core of this solution.

3. **Bound your search space**: Always analyze the maximum possible values your loop variables can take. Here, realizing that `k` is bounded by √(2n) transformed an O(n) solution into O(√n).

[Practice this problem on CodeJeet](/problem/consecutive-numbers-sum)
