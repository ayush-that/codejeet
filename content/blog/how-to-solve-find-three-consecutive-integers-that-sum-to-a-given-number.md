---
title: "How to Solve Find Three Consecutive Integers That Sum to a Given Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Three Consecutive Integers That Sum to a Given Number. Medium difficulty, 65.3% acceptance rate. Topics: Math, Simulation."
date: "2028-03-14"
category: "dsa-patterns"
tags: ["find-three-consecutive-integers-that-sum-to-a-given-number", "math", "simulation", "medium"]
---

# How to Solve "Find Three Consecutive Integers That Sum to a Given Number"

You're given an integer `num` and need to find three consecutive integers that sum to it. If no such triple exists, return an empty array. This problem is interesting because it looks like it requires searching, but a simple mathematical insight turns it into a constant-time solution. The challenge is recognizing that pattern and handling edge cases properly.

## Visual Walkthrough

Let's build intuition with an example. Suppose `num = 33`. We want three consecutive integers `(x, x+1, x+2)` that sum to 33.

The sum would be:

```
x + (x+1) + (x+2) = 3x + 3 = 33
```

We can solve for x:

```
3x + 3 = 33
3x = 30
x = 10
```

So the three consecutive integers are `[10, 11, 12]`. Let's verify: `10 + 11 + 12 = 33`.

Now try `num = 4`:

```
3x + 3 = 4
3x = 1
x = 1/3
```

Since x must be an integer, there's no solution. We'd return an empty array.

The key insight: **Three consecutive integers always sum to a multiple of 3**. Why? Because `3x + 3 = 3(x+1)`, which is clearly divisible by 3. So if `num` isn't divisible by 3, we can immediately return an empty array.

## Brute Force Approach

A naive approach would be to try all possible starting integers. Since we need three consecutive integers, we could check every possible `x` from some minimum to some maximum:

1. Start with `x = -num` (a conservative lower bound)
2. For each `x`, check if `x + (x+1) + (x+2) == num`
3. If yes, return `[x, x+1, x+2]`
4. If we reach `x = num` without finding a solution, return empty array

This brute force approach has several problems:

- It's inefficient: O(n) time where n could be large
- We don't know the proper bounds to search
- It doesn't leverage the mathematical structure of the problem

While this would technically work, it's unnecessarily slow and complex. In an interview, you'd want to recognize the mathematical pattern instead.

## Optimized Approach

The optimal solution comes from algebra. Let the three consecutive integers be `x`, `x+1`, and `x+2`. Their sum is:

```
x + (x+1) + (x+2) = 3x + 3
```

We want this to equal `num`:

```
3x + 3 = num
```

Solving for x:

```
3x = num - 3
x = (num - 3) / 3
```

For x to be an integer:

1. `(num - 3)` must be divisible by 3
2. Equivalently, `num` must be divisible by 3 (since if `num-3` is divisible by 3, then `num` is also divisible by 3)

So the algorithm becomes:

1. Check if `num` is divisible by 3
2. If not, return empty array
3. If yes, compute `x = (num - 3) / 3`
4. Return `[x, x+1, x+2]`

This gives us an O(1) time and O(1) space solution!

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def sumOfThree(num):
    """
    Find three consecutive integers that sum to num.

    Approach:
    1. Three consecutive integers can be represented as x, x+1, x+2
    2. Their sum is 3x + 3
    3. We solve 3x + 3 = num => x = (num - 3) / 3
    4. For x to be integer, (num - 3) must be divisible by 3
       This is equivalent to num being divisible by 3

    Args:
        num: The target sum

    Returns:
        List of three consecutive integers that sum to num,
        or empty list if no such integers exist
    """

    # If num is not divisible by 3, no solution exists
    # because sum of three consecutive integers is always divisible by 3
    if num % 3 != 0:
        return []

    # Calculate the starting integer x
    # Using integer division since we already checked divisibility
    x = (num - 3) // 3

    # Return the three consecutive integers
    return [x, x + 1, x + 2]
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Find three consecutive integers that sum to num.
 *
 * Approach:
 * 1. Three consecutive integers can be represented as x, x+1, x+2
 * 2. Their sum is 3x + 3
 * 3. We solve 3x + 3 = num => x = (num - 3) / 3
 * 4. For x to be integer, (num - 3) must be divisible by 3
 *    This is equivalent to num being divisible by 3
 *
 * @param {number} num - The target sum
 * @return {number[]} - Three consecutive integers that sum to num,
 *                      or empty array if no such integers exist
 */
function sumOfThree(num) {
  // If num is not divisible by 3, no solution exists
  // because sum of three consecutive integers is always divisible by 3
  if (num % 3 !== 0) {
    return [];
  }

  // Calculate the starting integer x
  // Using Math.floor for integer division since we already checked divisibility
  const x = (num - 3) / 3;

  // Return the three consecutive integers
  return [x, x + 1, x + 2];
}
```

```java
// Time: O(1) | Space: O(1)
import java.util.*;

class Solution {
    /**
     * Find three consecutive integers that sum to num.
     *
     * Approach:
     * 1. Three consecutive integers can be represented as x, x+1, x+2
     * 2. Their sum is 3x + 3
     * 3. We solve 3x + 3 = num => x = (num - 3) / 3
     * 4. For x to be integer, (num - 3) must be divisible by 3
     *    This is equivalent to num being divisible by 3
     *
     * @param num The target sum
     * @return List of three consecutive integers that sum to num,
     *         or empty list if no such integers exist
     */
    public long[] sumOfThree(long num) {
        // If num is not divisible by 3, no solution exists
        // because sum of three consecutive integers is always divisible by 3
        if (num % 3 != 0) {
            return new long[0];
        }

        // Calculate the starting integer x
        // Using long since num can be large
        long x = (num - 3) / 3;

        // Return the three consecutive integers
        return new long[]{x, x + 1, x + 2};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of operations: one modulo check, one subtraction, one division, and constructing the result array.
- The runtime doesn't depend on the size of `num`.

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the variables `x` and the return array.
- The output array is not counted in space complexity analysis for most interview contexts, but even if it were, it's constant size (3 elements).

## Common Mistakes

1. **Not checking divisibility first**: Some candidates jump straight to calculating `(num - 3) / 3` without checking if `num % 3 == 0`. This can lead to floating-point results or incorrect integer division when `num` isn't divisible by 3.

2. **Off-by-one errors in the formula**: The sum of `x, x+1, x+2` is `3x + 3`, not `3x`. Some candidates mistakenly use `3x = num` or `3x + 2 = num`.

3. **Integer overflow with large numbers**: In languages like Java, if `num` is very large (close to `Long.MAX_VALUE`), then `num - 3` could overflow. However, since the problem constraints typically keep `num` within safe bounds, this is less common. Still, it's good practice to use appropriate data types.

4. **Returning wrong type for empty result**: Some candidates return `null` instead of an empty array. Always check the problem statement - it specifies "return an empty array."

## When You'll See This Pattern

This problem teaches the pattern of **mathematical simplification** for sequence problems. Instead of simulating or searching, we use algebra to derive a direct formula.

Related problems that use similar patterns:

1. **Consecutive Numbers Sum (Hard)**: Instead of exactly 3 consecutive numbers, find all ways to represent a number as sum of consecutive positive integers. The mathematical insight involves representing the sum as `k * (first + last) / 2` and solving constraints.

2. **Number of Ways to Buy Pens and Pencils (Medium)**: While not about consecutive numbers, it similarly benefits from mathematical reasoning. Given a total amount, you find how many ways to spend it on pens and pencils by solving a linear equation.

3. **Missing Number (Easy)**: Uses the formula for sum of first n natural numbers `n*(n+1)/2` to find the missing number in O(1) time instead of O(n) search time.

## Key Takeaways

1. **Always look for mathematical patterns in sequence problems**: Before writing any code, ask: "Can I express this with an equation?" Many problems involving sums of sequences have algebraic solutions.

2. **Divisibility is a powerful filter**: The observation that "sum of three consecutive integers is always divisible by 3" immediately eliminates many cases. Look for similar divisibility rules in other problems.

3. **Test your formula with small examples**: Before coding, verify your mathematical reasoning with concrete examples like we did with `num = 33` and `num = 4`. This catches formula errors early.

Remember: In coding interviews, the simplest solution is often the best. When you see a problem about consecutive integers, think about representing them algebraically first.

Related problems: [Longest Consecutive Sequence](/problem/longest-consecutive-sequence), [Number of Ways to Buy Pens and Pencils](/problem/number-of-ways-to-buy-pens-and-pencils)
