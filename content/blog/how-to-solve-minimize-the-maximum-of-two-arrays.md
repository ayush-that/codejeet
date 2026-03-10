---
title: "How to Solve Minimize the Maximum of Two Arrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize the Maximum of Two Arrays. Medium difficulty, 32.2% acceptance rate. Topics: Math, Binary Search, Number Theory."
date: "2030-01-26"
category: "dsa-patterns"
tags: ["minimize-the-maximum-of-two-arrays", "math", "binary-search", "number-theory", "medium"]
---

# How to Solve Minimize the Maximum of Two Arrays

This problem asks us to find the smallest possible maximum integer we can use when building two arrays with specific divisibility constraints. We need to add positive integers to two initially empty arrays such that:

- `arr1` contains exactly `uniqueCnt1` distinct positive integers, none divisible by `divisor1`
- `arr2` contains exactly `uniqueCnt2` distinct positive integers, none divisible by `divisor2`
- All integers across both arrays must be distinct

The challenge is finding the minimum possible maximum value among all numbers used while satisfying all constraints. What makes this tricky is that numbers divisible by both `divisor1` and `divisor2` (their LCM) cannot be used in either array, creating a complex exclusion pattern.

## Visual Walkthrough

Let's trace through an example: `uniqueCnt1 = 2, uniqueCnt1 = 7, divisor1 = 2, divisor2 = 4`

We need to find the smallest `maxValue` such that we can pick enough numbers satisfying:

- For arr1: 2 numbers not divisible by 2
- For arr2: 7 numbers not divisible by 4
- All numbers distinct

Let's test `maxValue = 10`:

- Numbers not divisible by 2: {1, 3, 5, 7, 9} → 5 numbers available
- Numbers not divisible by 4: {1, 2, 3, 5, 6, 7, 9, 10} → 8 numbers available
- But we need to account for overlap! Numbers divisible by LCM(2,4)=4 can't go to either array: {4, 8}
- Also, numbers must be distinct across arrays

The key insight: We can calculate available numbers for each array, then subtract the overlap that can't be shared. Let's try a systematic approach:

For arr1 (needs 2 numbers not divisible by 2):

- Total numbers ≤ 10: 10
- Divisible by 2: floor(10/2) = 5
- Not divisible by 2: 10 - 5 = 5 ≥ 2 ✓

For arr2 (needs 7 numbers not divisible by 4):

- Total numbers ≤ 10: 10
- Divisible by 4: floor(10/4) = 2
- Not divisible by 4: 10 - 2 = 8 ≥ 7 ✓

But can we find 2+7=9 distinct numbers with these constraints?

- Numbers divisible by LCM(2,4)=4: floor(10/4)=2 numbers {4,8} → can't use in either array
- So from the 10 total numbers, we lose these 2 completely
- We have 8 usable numbers total
- We need 9 numbers → impossible at maxValue=10

We need to find the smallest maxValue where this works. This suggests a binary search approach!

## Brute Force Approach

A naive approach would be to start from 1 and incrementally check each possible maximum value until we find one that works:

1. Start with `maxValue = 1`
2. Check if we can select enough numbers satisfying all constraints
3. If yes, return `maxValue`
4. Otherwise, increment `maxValue` and repeat

The checking function would need to:

- Count numbers ≤ maxValue not divisible by divisor1
- Count numbers ≤ maxValue not divisible by divisor2
- Count numbers ≤ maxValue not divisible by LCM(divisor1, divisor2)
- Verify we have enough distinct numbers overall

This brute force approach is too slow because:

- We might need to check up to very large values (up to 10^9 in worst case)
- Each check involves multiple division operations
- The time complexity would be O(n) where n could be up to 10^9, which is infeasible

## Optimized Approach

The key insight is that we can use **binary search** on the answer space. Since we're looking for the minimum maximum value, and if a value `x` works, then all values ≥ `x` will also work (we can always use the same numbers), the function is monotonic.

We need a way to check if a candidate `maxValue` works:

1. Calculate total numbers available: `maxValue`
2. Calculate numbers divisible by divisor1: `floor(maxValue / divisor1)`
3. Calculate numbers divisible by divisor2: `floor(maxValue / divisor2)`
4. Calculate numbers divisible by LCM(divisor1, divisor2): `floor(maxValue / lcm)`
5. Using inclusion-exclusion principle:
   - Numbers available for arr1: `maxValue - floor(maxValue / divisor1)`
   - Numbers available for arr2: `maxValue - floor(maxValue / divisor2)`
   - Numbers available for both (not divisible by either): `maxValue - floor(maxValue / divisor1) - floor(maxValue / divisor2) + floor(maxValue / lcm)`
6. Check if:
   - Enough numbers for arr1: `available1 ≥ uniqueCnt1`
   - Enough numbers for arr2: `available2 ≥ uniqueCnt2`
   - Enough total distinct numbers: `availableBoth ≥ uniqueCnt1 + uniqueCnt2`

The binary search range is from 1 to a sufficiently large upper bound. A safe upper bound is `(uniqueCnt1 + uniqueCnt2) * max(divisor1, divisor2)` since in worst case, every k-th number is unusable.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(maxVal) * 1) | Space: O(1)
def minimizeSet(divisor1: int, divisor2: int, uniqueCnt1: int, uniqueCnt2: int) -> int:
    """
    Find the minimum maximum value needed to create two arrays with given constraints.

    Args:
        divisor1: Numbers divisible by this cannot go to arr1
        divisor2: Numbers divisible by this cannot go to arr2
        uniqueCnt1: Number of distinct elements needed in arr1
        uniqueCnt2: Number of distinct elements needed in arr2

    Returns:
        Minimum possible maximum value among all numbers used
    """

    # Helper function to calculate LCM using the formula: lcm(a,b) = a*b / gcd(a,b)
    def lcm(a: int, b: int) -> int:
        from math import gcd
        return a * b // gcd(a, b)

    # Calculate LCM of divisors once
    lcm_val = lcm(divisor1, divisor2)

    # Helper function to check if a candidate maxValue works
    def can_use(max_val: int) -> bool:
        """
        Check if we can satisfy all constraints with maximum value <= max_val.

        Using inclusion-exclusion principle:
        - Numbers not divisible by divisor1: max_val - max_val // divisor1
        - Numbers not divisible by divisor2: max_val - max_val // divisor2
        - Numbers not divisible by either: max_val - max_val//divisor1 - max_val//divisor2 + max_val//lcm_val
        """

        # Count numbers available for each array
        cnt1 = max_val - max_val // divisor1  # Numbers not divisible by divisor1
        cnt2 = max_val - max_val // divisor2  # Numbers not divisible by divisor2

        # Count numbers not divisible by either (available for both arrays)
        cnt_both = max_val - max_val // divisor1 - max_val // divisor2 + max_val // lcm_val

        # Check if we have enough numbers for each array individually
        # AND enough total distinct numbers (since all numbers must be distinct)
        return cnt1 >= uniqueCnt1 and cnt2 >= uniqueCnt2 and cnt_both >= uniqueCnt1 + uniqueCnt2

    # Binary search for the minimum maxValue that works
    # Lower bound: at least need uniqueCnt1 + uniqueCnt2 numbers
    left = 1
    # Upper bound: safe maximum, each array might need to skip many numbers
    # Multiply by max divisor to ensure we have enough numbers even with worst-case divisibility
    right = (uniqueCnt1 + uniqueCnt2) * max(divisor1, divisor2) * 2

    while left < right:
        mid = left + (right - left) // 2  # Avoid overflow

        if can_use(mid):
            # If mid works, try smaller values
            right = mid
        else:
            # If mid doesn't work, need larger values
            left = mid + 1

    return left
```

```javascript
// Time: O(log(maxVal) * 1) | Space: O(1)
/**
 * Find the minimum maximum value needed to create two arrays with given constraints.
 * @param {number} divisor1 - Numbers divisible by this cannot go to arr1
 * @param {number} divisor2 - Numbers divisible by this cannot go to arr2
 * @param {number} uniqueCnt1 - Number of distinct elements needed in arr1
 * @param {number} uniqueCnt2 - Number of distinct elements needed in arr2
 * @return {number} Minimum possible maximum value among all numbers used
 */
function minimizeSet(divisor1, divisor2, uniqueCnt1, uniqueCnt2) {
  // Helper function to calculate GCD using Euclidean algorithm
  function gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Calculate LCM using the formula: lcm(a,b) = a*b / gcd(a,b)
  const lcmVal = (divisor1 * divisor2) / gcd(divisor1, divisor2);

  /**
   * Check if we can satisfy all constraints with maximum value <= maxVal.
   * Using inclusion-exclusion principle.
   */
  function canUse(maxVal) {
    // Numbers not divisible by divisor1
    const cnt1 = maxVal - Math.floor(maxVal / divisor1);
    // Numbers not divisible by divisor2
    const cnt2 = maxVal - Math.floor(maxVal / divisor2);
    // Numbers not divisible by either (available for both arrays)
    const cntBoth =
      maxVal -
      Math.floor(maxVal / divisor1) -
      Math.floor(maxVal / divisor2) +
      Math.floor(maxVal / lcmVal);

    // Check if we have enough numbers for each array individually
    // AND enough total distinct numbers
    return cnt1 >= uniqueCnt1 && cnt2 >= uniqueCnt2 && cntBoth >= uniqueCnt1 + uniqueCnt2;
  }

  // Binary search for the minimum maxValue that works
  let left = 1;
  // Upper bound: safe maximum to handle worst-case divisibility
  let right = (uniqueCnt1 + uniqueCnt2) * Math.max(divisor1, divisor2) * 2;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (canUse(mid)) {
      // If mid works, try smaller values
      right = mid;
    } else {
      // If mid doesn't work, need larger values
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(log(maxVal) * 1) | Space: O(1)
class Solution {
    /**
     * Find the minimum maximum value needed to create two arrays with given constraints.
     * @param divisor1 Numbers divisible by this cannot go to arr1
     * @param divisor2 Numbers divisible by this cannot go to arr2
     * @param uniqueCnt1 Number of distinct elements needed in arr1
     * @param uniqueCnt2 Number of distinct elements needed in arr2
     * @return Minimum possible maximum value among all numbers used
     */
    public int minimizeSet(int divisor1, int divisor2, int uniqueCnt1, int uniqueCnt2) {
        // Calculate LCM of divisors
        long lcmVal = lcm(divisor1, divisor2);

        // Binary search for the minimum maxValue that works
        long left = 1;
        // Upper bound: safe maximum to handle worst-case divisibility
        long right = (long)(uniqueCnt1 + uniqueCnt2) * Math.max(divisor1, divisor2) * 2;

        while (left < right) {
            long mid = left + (right - left) / 2;

            if (canUse(mid, divisor1, divisor2, lcmVal, uniqueCnt1, uniqueCnt2)) {
                // If mid works, try smaller values
                right = mid;
            } else {
                // If mid doesn't work, need larger values
                left = mid + 1;
            }
        }

        return (int)left;
    }

    /**
     * Check if we can satisfy all constraints with maximum value <= maxVal.
     * Using inclusion-exclusion principle.
     */
    private boolean canUse(long maxVal, int divisor1, int divisor2, long lcmVal,
                          int uniqueCnt1, int uniqueCnt2) {
        // Numbers not divisible by divisor1
        long cnt1 = maxVal - maxVal / divisor1;
        // Numbers not divisible by divisor2
        long cnt2 = maxVal - maxVal / divisor2;
        // Numbers not divisible by either (available for both arrays)
        long cntBoth = maxVal - maxVal / divisor1 - maxVal / divisor2 + maxVal / lcmVal;

        // Check if we have enough numbers for each array individually
        // AND enough total distinct numbers
        return cnt1 >= uniqueCnt1 && cnt2 >= uniqueCnt2 && cntBoth >= uniqueCnt1 + uniqueCnt2;
    }

    /**
     * Calculate GCD using Euclidean algorithm.
     */
    private long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Calculate LCM using the formula: lcm(a,b) = a*b / gcd(a,b).
     */
    private long lcm(long a, long b) {
        return a / gcd(a, b) * b;  // Divide first to avoid overflow
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(maxVal))

- We perform binary search over a range up to approximately `(uniqueCnt1 + uniqueCnt2) * max(divisor1, divisor2)`
- Each check operation takes O(1) time (just a few arithmetic operations)
- The logarithmic factor comes from the binary search

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No additional data structures are needed

The key to the efficiency is the binary search reducing the search space exponentially, combined with the O(1) check function using mathematical formulas rather than iterating through numbers.

## Common Mistakes

1. **Forgetting about the LCM overlap**: The most common mistake is not accounting for numbers divisible by both divisors. These numbers cannot go to either array, reducing the total available numbers. Always use inclusion-exclusion: `total - div1 - div2 + lcm`.

2. **Incorrect binary search bounds**: Setting the upper bound too low can cause infinite loops or incorrect results. A safe upper bound is `(uniqueCnt1 + uniqueCnt2) * max(divisor1, divisor2) * 2`. Some candidates use `10^9` as a fixed upper bound, which works but is less efficient.

3. **Integer overflow in LCM calculation**: When calculating `a * b / gcd(a, b)`, the intermediate product `a * b` can overflow for large values. The Java solution shows the correct approach: calculate `a / gcd(a, b) * b` to avoid overflow.

4. **Off-by-one errors in binary search**: The classic binary search pitfalls: using `≤` instead of `<`, updating `left = mid` instead of `left = mid + 1`, etc. The pattern `while left < right` with `right = mid` and `left = mid + 1` is safe and avoids infinite loops.

## When You'll See This Pattern

This problem combines **binary search on answer** with **mathematical counting using inclusion-exclusion**. You'll see similar patterns in:

1. **Kth Missing Positive Number (LeetCode 1539)**: Binary search to find the kth missing number in a sorted array, using mathematical counting of missing numbers up to a certain point.

2. **Find the Smallest Divisor Given a Threshold (LeetCode 1283)**: Binary search on the divisor value, with a check function that calculates sum of ceilings.

3. **Capacity To Ship Packages Within D Days (LeetCode 1011)**: Binary search on shipping capacity, with a check function that simulates loading packages.

The common theme is: when you need to find the minimum/maximum value satisfying some condition, and the condition check is monotonic (if x works, then all values ≥ x also work), binary search on the answer space is often the solution.

## Key Takeaways

1. **Binary search isn't just for arrays**: When you're searching for a numerical answer (not an index) and the validity function is monotonic, consider binary search on the answer space.

2. **Inclusion-exclusion for counting problems**: When counting elements satisfying multiple conditions, use the principle: `|A ∪ B| = |A| + |B| - |A ∩ B|`. For divisibility problems, the intersection is numbers divisible by the LCM.

3. **Mathematical formulas beat iteration**: Instead of iterating through numbers to count them, use mathematical formulas like `floor(n/d)` to count multiples. This transforms O(n) operations into O(1).

[Practice this problem on CodeJeet](/problem/minimize-the-maximum-of-two-arrays)
