---
title: "How to Solve Power of Three — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Power of Three. Easy difficulty, 50.7% acceptance rate. Topics: Math, Recursion."
date: "2026-08-05"
category: "dsa-patterns"
tags: ["power-of-three", "math", "recursion", "easy"]
---

# How to Solve Power of Three

The problem asks us to determine if a given integer `n` is a power of three — meaning there exists some integer `x` such that `n == 3^x`. While this seems straightforward, the challenge lies in doing this efficiently without using loops or recursion when possible, and handling edge cases like negative numbers and zero correctly. What makes this problem interesting is that it has multiple valid approaches, each with different trade-offs in terms of performance and readability.

## Visual Walkthrough

Let's trace through a few examples to build intuition:

**Example 1: n = 27**

- 27 ÷ 3 = 9 (remainder 0)
- 9 ÷ 3 = 3 (remainder 0)
- 3 ÷ 3 = 1 (remainder 0)
- Since we reached 1, 27 is a power of three (3³ = 27)

**Example 2: n = 45**

- 45 ÷ 3 = 15 (remainder 0)
- 15 ÷ 3 = 5 (remainder 0)
- 5 ÷ 3 = 1 (remainder 2) ← Non-zero remainder!
- Since we got a non-zero remainder before reaching 1, 45 is NOT a power of three

**Example 3: n = 1**

- 1 is 3⁰, so it IS a power of three

**Example 4: n = 0 or n = -27**

- 0 cannot be written as 3^x for any integer x
- Negative numbers cannot be powers of three since 3^x is always positive

The pattern is clear: keep dividing by 3 while the remainder is 0, and check if you eventually reach 1.

## Brute Force Approach

The most straightforward approach is to use a loop to repeatedly divide `n` by 3 until we either:

1. Reach 1 (success — it's a power of three)
2. Get a non-zero remainder (failure — not a power of three)
3. Go below 1 (failure — not a power of three)

This approach works, but it's worth noting that for very large numbers that aren't powers of three, we might do many divisions. However, since we're dividing by 3 each time, the number of operations is logarithmic in `n`, making this approach actually quite efficient with O(log₃n) time complexity.

The real "brute force" would be to try all possible exponents from 0 up until 3^x exceeds `n`, but that's less efficient than the division approach. The division method is simple and works well, but there's an even more clever mathematical approach we can use.

## Optimal Solution

The most elegant solution uses a mathematical property: In the constraints of this problem (32-bit integers), the largest power of three that fits in a 32-bit signed integer is 3¹⁹ = 1162261467. If `n` is a power of three, it must divide this maximum power of three without remainder.

Why does this work? All powers of three share the same prime factors (just 3). If `n` is a power of three, then it's of the form 3^k. The maximum power of three in 32-bit range is 3¹⁹. Since 3¹⁹ ÷ 3^k = 3^(19-k), which is an integer, the division will have no remainder. If `n` is not a power of three, it will have other prime factors, so it won't divide 3¹⁹ evenly.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isPowerOfThree(n: int) -> bool:
    # Edge case: n must be positive since 3^x is always positive
    if n <= 0:
        return False

    # The largest power of 3 that fits in 32-bit signed integer is 3^19
    # If n is a power of 3, it must divide 3^19 without remainder
    MAX_POWER_OF_THREE = 1162261467  # 3^19

    # Check if n divides the maximum power of three
    return MAX_POWER_OF_THREE % n == 0
```

```javascript
// Time: O(1) | Space: O(1)
function isPowerOfThree(n) {
  // Edge case: n must be positive since 3^x is always positive
  if (n <= 0) {
    return false;
  }

  // The largest power of 3 that fits in 32-bit signed integer is 3^19
  // If n is a power of 3, it must divide 3^19 without remainder
  const MAX_POWER_OF_THREE = 1162261467; // 3^19

  // Check if n divides the maximum power of three
  return MAX_POWER_OF_THREE % n === 0;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public boolean isPowerOfThree(int n) {
        // Edge case: n must be positive since 3^x is always positive
        if (n <= 0) {
            return false;
        }

        // The largest power of 3 that fits in 32-bit signed integer is 3^19
        // If n is a power of 3, it must divide 3^19 without remainder
        final int MAX_POWER_OF_THREE = 1162261467;  // 3^19

        // Check if n divides the maximum power of three
        return MAX_POWER_OF_THREE % n == 0;
    }
}
```

</div>

**Alternative Approach: Logarithm Method**
Another clever approach uses logarithms: if n = 3^x, then x = log₃(n) = log(n)/log(3). We can check if this result is an integer. However, we need to handle floating-point precision issues carefully.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isPowerOfThreeLog(n: int) -> bool:
    if n <= 0:
        return False

    # Calculate log3(n) = log(n)/log(3)
    # Add epsilon to handle floating-point precision issues
    import math
    log_result = math.log(n) / math.log(3)

    # Check if the result is close to an integer
    # The epsilon needs to be larger due to floating-point errors
    return abs(log_result - round(log_result)) < 1e-10
```

```javascript
// Time: O(1) | Space: O(1)
function isPowerOfThreeLog(n) {
  if (n <= 0) {
    return false;
  }

  // Calculate log3(n) = Math.log(n)/Math.log(3)
  const logResult = Math.log(n) / Math.log(3);

  // Check if the result is close to an integer
  // The epsilon needs to be larger due to floating-point errors
  return Math.abs(logResult - Math.round(logResult)) < 1e-10;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public boolean isPowerOfThreeLog(int n) {
        if (n <= 0) {
            return false;
        }

        // Calculate log3(n) = Math.log(n)/Math.log(3)
        double logResult = Math.log(n) / Math.log(3);

        // Check if the result is close to an integer
        // The epsilon needs to be larger due to floating-point errors
        return Math.abs(logResult - Math.round(logResult)) < 1e-10;
    }
}
```

</div>

## Complexity Analysis

**Division Approach (Loop):**

- **Time Complexity:** O(log₃n) — In the worst case, we keep dividing by 3 until we reach 1 or get a non-zero remainder
- **Space Complexity:** O(1) — We only use a few variables

**Mathematical Approach (Optimal):**

- **Time Complexity:** O(1) — Just one modulo operation
- **Space Complexity:** O(1) — Constant space for the constant and a few variables

**Logarithm Approach:**

- **Time Complexity:** O(1) — Logarithm calculations are constant time
- **Space Complexity:** O(1) — Constant space

The mathematical approach using the maximum power of three is optimal because it runs in constant time and is easy to understand. The division approach is also acceptable in interviews and may be preferred for its clarity.

## Common Mistakes

1. **Not handling negative numbers and zero:** The most common mistake is returning `true` for n=1 but `false` for n=0, but forgetting that negative numbers can't be powers of three. Always check `if (n <= 0) return false` first.

2. **Infinite loops with the division approach:** When using a loop, candidates sometimes forget to update `n` inside the loop or create conditions that never terminate. Always ensure your loop has a clear exit condition.

3. **Floating-point precision errors with the logarithm approach:** When checking if `log₃(n)` is an integer, floating-point arithmetic can cause issues. For example, `log₃(243)` might give `4.999999999` instead of `5`. Always use an epsilon comparison rather than exact equality.

4. **Assuming all approaches work for all integer ranges:** The mathematical approach using `1162261467 % n == 0` only works for 32-bit integers. For arbitrary precision integers or larger ranges, you'd need to use the division approach or adjust the constant.

## When You'll See This Pattern

This problem teaches the pattern of **mathematical optimization through number theory properties**. Similar patterns appear in:

1. **Power of Two (LeetCode 231)** — Uses the property that powers of two have exactly one bit set: `n > 0 and (n & (n-1)) == 0`
2. **Power of Four (LeetCode 342)** — Similar to power of two but with additional check for the 1-bit being in the right position
3. **Ugly Number (LeetCode 263)** — Checks if a number's prime factors are limited to 2, 3, and 5 using repeated division
4. **Check if Number is a Sum of Powers of Three (LeetCode 1780)** — Extends the concept to sums of distinct powers of three

The key insight is recognizing when you can replace iterative checks with mathematical properties or bit manipulation for constant-time solutions.

## Key Takeaways

1. **Mathematical properties can optimize algorithmic problems:** Instead of using loops, we leveraged the fact that in a bounded integer system, all powers of three must divide the maximum power of three. This transformed an O(log n) solution into O(1).

2. **Handle edge cases first:** Always check for zero and negative inputs early. These are common "gotchas" in interview problems that test attention to detail.

3. **Multiple valid approaches exist:** The division approach is more intuitive and works for arbitrary integers, while the mathematical approach is more elegant for fixed-width integers. Knowing both shows depth of understanding.

4. **Floating-point comparisons require care:** When using logarithms or other floating-point operations, always use epsilon comparisons rather than exact equality to handle precision errors.

**Related problems:** [Power of Two](/problem/power-of-two), [Power of Four](/problem/power-of-four), [Check if Number is a Sum of Powers of Three](/problem/check-if-number-is-a-sum-of-powers-of-three)
