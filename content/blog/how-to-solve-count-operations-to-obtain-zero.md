---
title: "How to Solve Count Operations to Obtain Zero — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Operations to Obtain Zero. Easy difficulty, 79.8% acceptance rate. Topics: Math, Simulation."
date: "2028-07-17"
category: "dsa-patterns"
tags: ["count-operations-to-obtain-zero", "math", "simulation", "easy"]
---

# How to Solve Count Operations to Obtain Zero

You're given two non-negative integers and need to count how many operations it takes to make at least one of them zero. In each operation, you subtract the smaller number from the larger one (or subtract either from the other if they're equal). While this seems straightforward, the interesting part is recognizing that this is essentially the Euclidean algorithm for finding the greatest common divisor (GCD), but we're counting the steps instead of computing the result.

## Visual Walkthrough

Let's trace through an example with `num1 = 10` and `num2 = 4`:

**Step 1:** `10 >= 4` is true, so subtract `num2` from `num1`:  
`num1 = 10 - 4 = 6`, `num2 = 4` (operations = 1)

**Step 2:** `6 >= 4` is true, so subtract `num2` from `num1`:  
`num1 = 6 - 4 = 2`, `num2 = 4` (operations = 2)

**Step 3:** `2 >= 4` is false, so subtract `num1` from `num2`:  
`num1 = 2`, `num2 = 4 - 2 = 2` (operations = 3)

**Step 4:** `2 >= 2` is true, so subtract `num2` from `num1`:  
`num1 = 2 - 2 = 0`, `num2 = 2` (operations = 4)

We stop because `num1 = 0`. Total operations: **4**.

Notice the pattern: we're repeatedly subtracting the smaller number from the larger one until one becomes zero. This is exactly how the Euclidean algorithm works for finding GCD, but we're counting steps instead of finding the GCD itself.

## Brute Force Approach

The most straightforward approach is to simulate the process exactly as described in the problem statement. We'll use a while loop that continues until either number becomes zero, and in each iteration, we check which number is larger and perform the appropriate subtraction.

While this approach is correct, it can be inefficient when one number is much larger than the other. For example, with `num1 = 1000000` and `num2 = 1`, we'd need 1,000,000 iterations! This is why we need to think about optimization.

## Optimal Solution

The key insight is that when `num1` is much larger than `num2`, instead of subtracting `num2` from `num1` one by one, we can calculate how many times `num2` fits into `num1` and subtract that multiple all at once. This is essentially performing division instead of repeated subtraction.

However, there's an even cleaner approach: we can use the Euclidean algorithm logic directly. The number of operations equals the number of subtraction steps in the Euclidean algorithm, which can be computed by repeatedly performing division operations.

Here's the optimal solution that handles large differences efficiently:

<div class="code-group">

```python
# Time: O(log(min(num1, num2))) | Space: O(1)
def countOperations(num1: int, num2: int) -> int:
    """
    Counts the number of operations to make at least one number zero.
    Each operation subtracts the smaller number from the larger one.

    Args:
        num1: First non-negative integer
        num2: Second non-negative integer

    Returns:
        Number of operations required
    """
    operations = 0

    # Continue until at least one number becomes zero
    while num1 > 0 and num2 > 0:
        # If num1 is larger or equal, subtract num2 from num1
        if num1 >= num2:
            # Instead of subtracting one by one, calculate how many times
            # num2 fits into num1 and subtract that multiple
            operations += num1 // num2
            num1 %= num2  # Remainder after subtracting multiples of num2
        else:
            # num2 is larger, so subtract num1 from num2
            operations += num2 // num1
            num2 %= num1  # Remainder after subtracting multiples of num1

    return operations
```

```javascript
// Time: O(log(min(num1, num2))) | Space: O(1)
function countOperations(num1, num2) {
  /**
   * Counts the number of operations to make at least one number zero.
   * Each operation subtracts the smaller number from the larger one.
   *
   * @param {number} num1 - First non-negative integer
   * @param {number} num2 - Second non-negative integer
   * @return {number} Number of operations required
   */
  let operations = 0;

  // Continue until at least one number becomes zero
  while (num1 > 0 && num2 > 0) {
    // If num1 is larger or equal, subtract num2 from num1
    if (num1 >= num2) {
      // Instead of subtracting one by one, calculate how many times
      // num2 fits into num1 and subtract that multiple
      operations += Math.floor(num1 / num2);
      num1 %= num2; // Remainder after subtracting multiples of num2
    } else {
      // num2 is larger, so subtract num1 from num2
      operations += Math.floor(num2 / num1);
      num2 %= num1; // Remainder after subtracting multiples of num1
    }
  }

  return operations;
}
```

```java
// Time: O(log(min(num1, num2))) | Space: O(1)
class Solution {
    /**
     * Counts the number of operations to make at least one number zero.
     * Each operation subtracts the smaller number from the larger one.
     *
     * @param num1 First non-negative integer
     * @param num2 Second non-negative integer
     * @return Number of operations required
     */
    public int countOperations(int num1, int num2) {
        int operations = 0;

        // Continue until at least one number becomes zero
        while (num1 > 0 && num2 > 0) {
            // If num1 is larger or equal, subtract num2 from num1
            if (num1 >= num2) {
                // Instead of subtracting one by one, calculate how many times
                // num2 fits into num1 and subtract that multiple
                operations += num1 / num2;
                num1 %= num2;  // Remainder after subtracting multiples of num2
            } else {
                // num2 is larger, so subtract num1 from num2
                operations += num2 / num1;
                num2 %= num1;  // Remainder after subtracting multiples of num1
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(min(num1, num2)))  
This is because we're essentially performing the Euclidean algorithm, which has logarithmic time complexity. Each iteration reduces the larger number by at least half (when we use division instead of subtraction), so we need at most O(log(min(num1, num2))) iterations.

**Space Complexity:** O(1)  
We only use a constant amount of extra space for the operations counter and temporary variables.

## Common Mistakes

1. **Using naive subtraction for large numbers:** The most common mistake is implementing the literal simulation with single subtractions. This works for small inputs but times out for cases like `num1 = 1000000, num2 = 1`. Always check if division can optimize repeated operations.

2. **Forgetting to handle the case when both numbers are zero initially:** If both numbers start at zero, the answer should be 0 operations. Our solution handles this correctly because the while loop condition `num1 > 0 and num2 > 0` is false from the start.

3. **Incorrectly handling the equal case:** When `num1 == num2`, we need to subtract one from the other. Some implementations might get stuck in an infinite loop if they don't handle this properly. Our solution correctly adds `num1 // num2` (which equals 1) and sets `num1 %= num2` (which becomes 0).

4. **Using recursion without considering stack overflow:** While a recursive solution is elegant, for very large numbers with a GCD of 1 (like consecutive Fibonacci numbers), the recursion depth could be large enough to cause a stack overflow. The iterative approach is safer.

## When You'll See This Pattern

This problem uses the **Euclidean algorithm pattern**, which appears in various forms:

1. **Greatest Common Divisor (GCD) problems:** Any problem involving finding the GCD of two numbers uses this pattern. For example, LeetCode 1979 "Find Greatest Common Divisor of Array" requires finding GCD of multiple numbers.

2. **Modular arithmetic problems:** Problems involving cycles, rotations, or periodicity often use GCD to find the fundamental period. For instance, LeetCode 914 "X of a Kind in a Deck of Cards" uses GCD to determine if cards can be grouped.

3. **Optimization of repeated operations:** Whenever you see a problem involving repeated subtraction or addition, consider whether division or modulo operations can optimize it. This pattern appears in LeetCode 1680 "Concatenation of Consecutive Binary Numbers" where bit manipulation optimizes repeated operations.

## Key Takeaways

1. **Recognize Euclidean algorithm patterns:** When you see problems involving repeated subtraction between two numbers, especially with the goal of reaching zero, think about the Euclidean algorithm and whether you can use division to optimize.

2. **Optimize repeated operations with division:** If an algorithm involves repeatedly adding or subtracting the same value, consider whether you can use multiplication or division to perform multiple operations at once.

3. **Logarithmic optimization is often possible:** Many problems that seem like they require linear time can be optimized to logarithmic time by halving the problem size in each step, similar to binary search or the Euclidean algorithm.

Related problems: [Number of Steps to Reduce a Number to Zero](/problem/number-of-steps-to-reduce-a-number-to-zero)
