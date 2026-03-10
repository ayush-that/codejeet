---
title: "How to Solve Maximum Number That Sum of the Prices Is Less Than or Equal to K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number That Sum of the Prices Is Less Than or Equal to K. Medium difficulty, 38.5% acceptance rate. Topics: Math, Binary Search, Dynamic Programming, Bit Manipulation."
date: "2026-03-27"
category: "dsa-patterns"
tags:
  [
    "maximum-number-that-sum-of-the-prices-is-less-than-or-equal-to-k",
    "math",
    "binary-search",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Maximum Number That Sum of the Prices Is Less Than or Equal to K

This problem asks us to find the largest integer `num` such that the sum of "prices" from 1 to `num` is less than or equal to `k`. The price of a number is calculated by counting how many set bits (1s) it has at positions that are multiples of `x` in its binary representation, starting from the least significant bit (position 1). What makes this problem tricky is that we need to efficiently compute the total price sum for a range of numbers without iterating through each one individually, which would be far too slow for the constraints.

## Visual Walkthrough

Let's walk through an example with `x = 2` and `k = 9`. We want to find the largest `num` where the sum of prices from 1 to `num` ≤ 9.

First, let's calculate prices for the first few numbers:

**Number 1 (binary: 1)**

- Positions: 1, 2, 3, 4, ...
- Check positions that are multiples of 2: position 2, 4, 6, ...
- At position 2: bit is 0 (binary 01)
- Price = 0

**Number 2 (binary: 10)**

- Position 2: bit is 1
- Price = 1

**Number 3 (binary: 11)**

- Position 2: bit is 1
- Price = 1

**Number 4 (binary: 100)**

- Position 2: bit is 0 (binary 100)
- Position 4: bit is 1
- Price = 1

**Number 5 (binary: 101)**

- Position 2: bit is 0
- Position 4: bit is 1
- Price = 1

**Number 6 (binary: 110)**

- Position 2: bit is 1
- Position 4: bit is 1
- Price = 2

Now let's calculate cumulative sums:

- Sum up to 1: 0
- Sum up to 2: 0 + 1 = 1
- Sum up to 3: 1 + 1 = 2
- Sum up to 4: 2 + 1 = 3
- Sum up to 5: 3 + 1 = 4
- Sum up to 6: 4 + 2 = 6
- Sum up to 7: 6 + 2 = 8 (7 has bits at positions 1, 2, 3 → position 2 is set)
- Sum up to 8: 8 + 1 = 9 (8 is binary 1000, only position 4 is set)

The largest number with sum ≤ 9 is 8. This shows we need an efficient way to compute these cumulative sums without calculating each number individually.

## Brute Force Approach

The most straightforward approach would be to iterate through numbers from 1 upwards, calculate each number's price by examining its binary representation at positions that are multiples of `x`, maintain a running total, and stop when the total exceeds `k`. Return the last number where the total was still ≤ `k`.

The problem with this approach is efficiency. Since `k` can be up to 10¹⁵, we might need to check up to 10¹⁵ numbers, and for each number, we need to examine up to log₂(num) bits. This is clearly infeasible.

Even if we try to be clever and use binary search (which we should), we still need an efficient way to compute the total price sum from 1 to any given `num` without iterating through all numbers up to `num`.

## Optimized Approach

The key insight is that we can compute the total price sum from 1 to `num` using a mathematical formula rather than iteration. Here's the step-by-step reasoning:

1. **Binary Search Framework**: Since we're looking for the largest `num` where `sum(1..num) ≤ k`, and this sum increases monotonically with `num`, we can use binary search. This reduces the problem to: given a candidate `num`, can we efficiently compute `total_price(num)`?

2. **Counting Set Bits at Specific Positions**: For a given position `p` (where `p` is a multiple of `x`), we want to count how many numbers from 1 to `num` have the bit at position `p` set to 1.

3. **Pattern in Binary Representation**: Bits at position `p` follow a regular pattern: they're 0 for 2ᵖ⁻¹ numbers, then 1 for 2ᵖ⁻¹ numbers, repeating every 2ᵖ numbers. This is because the binary representation cycles with period 2ᵖ at position `p`.

4. **Formula for Counting**: For position `p`, the count of numbers ≤ `num` with bit `p` set is:
   - Full cycles: `(num // (1 << p)) * (1 << (p-1))`
   - Partial cycle: `max(0, (num % (1 << p)) - (1 << (p-1)) + 1)`

   Where `1 << p` means 2ᵖ, and `1 << (p-1)` means 2ᵖ⁻¹.

5. **Sum Over All Relevant Positions**: We sum this count for all positions `p` that are multiples of `x`, up to the highest bit position needed (which is at most 60 since `k ≤ 10¹⁵`).

This gives us an O(log(num) \* log(num)/x) way to compute `total_price(num)`, which when combined with binary search over the range [0, 2·k] (a safe upper bound), gives us an efficient solution.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(k) * log(k)/x) - Binary search with bit counting
# Space: O(1) - Only using constant extra space
def findMaximumNumber(k: int, x: int) -> int:
    """
    Finds the largest number such that the sum of prices from 1 to num ≤ k.
    Price of a number = count of set bits at positions that are multiples of x.
    """

    def total_price_up_to(num: int) -> int:
        """
        Computes the total price sum for all numbers from 1 to num.
        This is the key function that makes the solution efficient.
        """
        total = 0
        # We only need to check bit positions that are multiples of x
        # The highest position we need to check is 60 since k ≤ 10^15 < 2^60
        for p in range(x, 61, x):
            # Cycle length for position p is 2^p
            cycle_length = 1 << p  # 2^p
            # In each full cycle, the bit at position p is set for half the cycle
            ones_per_full_cycle = 1 << (p - 1)  # 2^(p-1)

            # Count full cycles
            full_cycles = num // cycle_length
            total += full_cycles * ones_per_full_cycle

            # Handle the partial cycle
            remainder = num % cycle_length
            # In the partial cycle, the bit is set starting from 2^(p-1)
            # +1 because we're counting from 0
            partial_ones = max(0, remainder - (ones_per_full_cycle - 1))
            total += partial_ones

            # Early exit: if cycle_length exceeds num, further positions won't contribute
            if cycle_length > num:
                break

        return total

    # Binary search for the maximum num
    left, right = 0, 2 * k  # Upper bound: 2*k is sufficient since price grows slower than num

    while left <= right:
        mid = left + (right - left) // 2
        price_sum = total_price_up_to(mid)

        if price_sum <= k:
            left = mid + 1  # Try for a larger number
        else:
            right = mid - 1  # Too large, try smaller

    # right is the largest num where total_price_up_to(num) ≤ k
    return right
```

```javascript
// Time: O(log(k) * log(k)/x) - Binary search with bit counting
// Space: O(1) - Only using constant extra space
function findMaximumNumber(k, x) {
  /**
   * Computes the total price sum for all numbers from 1 to num.
   * Price = count of set bits at positions that are multiples of x.
   */
  const totalPriceUpTo = (num) => {
    let total = 0;

    // Check bit positions that are multiples of x
    // Highest position needed is 60 since k ≤ 10^15 < 2^60
    for (let p = x; p <= 60; p += x) {
      // Cycle length for position p is 2^p
      const cycleLength = 1 << p; // 2^p
      // In each full cycle, bit p is set for half the cycle
      const onesPerFullCycle = 1 << (p - 1); // 2^(p-1)

      // Count full cycles
      const fullCycles = Math.floor(num / cycleLength);
      total += fullCycles * onesPerFullCycle;

      // Handle the partial cycle
      const remainder = num % cycleLength;
      // Bit is set starting from 2^(p-1) in the cycle
      // +1 because we count from 0
      const partialOnes = Math.max(0, remainder - (onesPerFullCycle - 1));
      total += partialOnes;

      // Early exit: if cycle length exceeds num, further positions won't contribute
      if (cycleLength > num) {
        break;
      }
    }

    return total;
  };

  // Binary search for the maximum num
  let left = 0;
  let right = 2 * k; // Upper bound: 2*k is sufficient

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const priceSum = totalPriceUpTo(mid);

    if (priceSum <= k) {
      left = mid + 1; // Try for a larger number
    } else {
      right = mid - 1; // Too large, try smaller
    }
  }

  // right is the largest num where totalPriceUpTo(num) ≤ k
  return right;
}
```

```java
// Time: O(log(k) * log(k)/x) - Binary search with bit counting
// Space: O(1) - Only using constant extra space
class Solution {
    public long findMaximumNumber(long k, int x) {
        /**
         * Computes the total price sum for all numbers from 1 to num.
         * Price = count of set bits at positions that are multiples of x.
         */

        // Helper function to compute total price up to a given number
        // Using a separate private method for clarity
        return binarySearch(k, x);
    }

    private long binarySearch(long k, int x) {
        long left = 0;
        long right = 2 * k;  // Upper bound: 2*k is sufficient

        while (left <= right) {
            long mid = left + (right - left) / 2;
            long priceSum = totalPriceUpTo(mid, x);

            if (priceSum <= k) {
                left = mid + 1;  // Try for a larger number
            } else {
                right = mid - 1;  // Too large, try smaller
            }
        }

        // right is the largest num where totalPriceUpTo(num) ≤ k
        return right;
    }

    private long totalPriceUpTo(long num, int x) {
        long total = 0;

        // Check bit positions that are multiples of x
        // Highest position needed is 60 since k ≤ 10^15 < 2^60
        for (int p = x; p <= 60; p += x) {
            // Cycle length for position p is 2^p
            long cycleLength = 1L << p;  // 2^p
            // In each full cycle, bit p is set for half the cycle
            long onesPerFullCycle = 1L << (p - 1);  // 2^(p-1)

            // Count full cycles
            long fullCycles = num / cycleLength;
            total += fullCycles * onesPerFullCycle;

            // Handle the partial cycle
            long remainder = num % cycleLength;
            // Bit is set starting from 2^(p-1) in the cycle
            // +1 because we count from 0
            long partialOnes = Math.max(0, remainder - (onesPerFullCycle - 1));
            total += partialOnes;

            // Early exit: if cycle length exceeds num, further positions won't contribute
            if (cycleLength > num) {
                break;
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(k) \* log(k)/x)

- Binary search runs O(log(k)) iterations (searching in range [0, 2k])
- For each candidate `num`, `total_price_up_to(num)` examines O(log(k)/x) bit positions (positions that are multiples of `x` up to log₂(k))
- Each position calculation takes O(1) time
- Overall: O(log(k) \* log(k)/x)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No data structures that grow with input size

## Common Mistakes

1. **Not using binary search**: Some candidates try to iterate linearly from 1 upwards, which is far too slow for k up to 10¹⁵. Always recognize when a function is monotonic (increasing total price with increasing num) and use binary search.

2. **Incorrect bit counting formula**: The most complex part is correctly counting how many numbers ≤ num have a particular bit set. Common errors include:
   - Forgetting the `+1` in the partial cycle calculation
   - Using wrong exponents (2ᵖ vs 2ᵖ⁻¹)
   - Not handling the case where remainder < 2ᵖ⁻¹ (need max(0, ...))

3. **Insufficient upper bound for binary search**: Using k as the upper bound might not be enough since price grows slower than the number itself. A safe bound is 2k or even 2·k·x, but 2k works well in practice.

4. **Integer overflow**: When computing `1 << p` for p up to 60, use 64-bit integers (long in Java, regular integers are fine in Python, BigInt-like in JavaScript). In Java, remember to use `1L << p` instead of `1 << p`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary Search on Answer**: When you need to find the maximum/minimum value satisfying a condition, and you can test whether a candidate works efficiently. Similar problems:
   - LeetCode 875: Koko Eating Bananas (binary search for minimum eating speed)
   - LeetCode 1011: Capacity To Ship Packages Within D Days (binary search for minimum capacity)

2. **Bit Manipulation with Mathematical Counting**: When you need to count bits or other properties in a range without iterating. Similar problems:
   - LeetCode 338: Counting Bits (counting set bits for all numbers up to n)
   - LeetCode 233: Number of Digit One (counting digit '1' in all numbers up to n)

3. **Position-Based Cycle Analysis**: Recognizing that binary representations have regular patterns that repeat. This is a more advanced version of problems that ask about bit patterns or digit occurrences.

## Key Takeaways

1. **Binary search isn't just for arrays**: When you have a monotonic function f(num) and need to find the largest num where f(num) ≤ target, binary search on the number line is often the right approach.

2. **Count mathematically, not iteratively**: When asked to count something in a range [1, n], look for mathematical patterns or formulas rather than iterating through all numbers. Bit positions, digits, and other properties often follow predictable cycles.

3. **Break complex problems into helper functions**: The key to solving this problem cleanly is separating the binary search logic from the price calculation logic. This makes the code more readable and easier to debug.

[Practice this problem on CodeJeet](/problem/maximum-number-that-sum-of-the-prices-is-less-than-or-equal-to-k)
