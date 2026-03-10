---
title: "How to Solve Closest Divisors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Closest Divisors. Medium difficulty, 62.0% acceptance rate. Topics: Math."
date: "2029-06-02"
category: "dsa-patterns"
tags: ["closest-divisors", "math", "medium"]
---

# How to Solve Closest Divisors

You're given an integer `num` and need to find two integers whose product equals either `num + 1` or `num + 2`, with the smallest possible absolute difference between them. Return those two integers in any order. What makes this problem interesting is that it appears to require searching through factor pairs, but there's a mathematical insight that lets us solve it efficiently without checking every possibility.

## Visual Walkthrough

Let's trace through an example: `num = 8`.

We need to find factor pairs for:

- `num + 1 = 9`
- `num + 2 = 10`

For 9, the factor pairs are: (1, 9) with difference 8, and (3, 3) with difference 0.
For 10, the factor pairs are: (1, 10) with difference 9, (2, 5) with difference 3.

The pair with the smallest absolute difference is (3, 3) from 9, with difference 0.

Now let's try `num = 123`:

- `num + 1 = 124`
- `num + 2 = 125`

For 124, we could check factors starting from the square root: √124 ≈ 11.1
Working downward from 11: 124 ÷ 11 ≈ 11.27 (not integer), 124 ÷ 10 = 12.4 (not integer), 124 ÷ 9 ≈ 13.78 (not integer), 124 ÷ 8 = 15.5 (not integer), 124 ÷ 7 ≈ 17.71 (not integer), 124 ÷ 6 ≈ 20.67 (not integer), 124 ÷ 5 = 24.8 (not integer), 124 ÷ 4 = 31 (integer!).

So for 124, we have (4, 31) with difference 27.

For 125: √125 ≈ 11.18
Working downward: 125 ÷ 11 ≈ 11.36 (not integer), 125 ÷ 10 = 12.5 (not integer), 125 ÷ 9 ≈ 13.89 (not integer), 125 ÷ 8 = 15.625 (not integer), 125 ÷ 7 ≈ 17.86 (not integer), 125 ÷ 6 ≈ 20.83 (not integer), 125 ÷ 5 = 25 (integer!).

So for 125, we have (5, 25) with difference 20.

Between (4, 31) with difference 27 and (5, 25) with difference 20, the pair with smaller difference is (5, 25).

This shows us the pattern: to find the closest divisors, we should start searching from the square root and work downward, checking both `num + 1` and `num + 2`.

## Brute Force Approach

A naive approach would be to check all possible factor pairs for both `num + 1` and `num + 2`. For each number `n` (which could be `num + 1` or `num + 2`), we could iterate `i` from 1 to `n` and check if `n % i == 0`. For each valid factor, we'd calculate the difference between `i` and `n / i`, tracking the pair with the smallest difference.

The problem with this approach is efficiency. If `num` is large (up to 10^9), then `num + 2` could be up to 1,000,000,002. Checking all numbers from 1 to that value would take O(n) time, which is far too slow.

Even if we only check up to √n for each number, the brute force approach without optimization would still be inefficient if implemented poorly. The key insight is that we don't need to check every number - we can start from the square root and work downward, stopping at the first valid factor we find for each number.

## Optimized Approach

The mathematical insight that makes this problem efficient is that for any number `n`, the factor pair with the smallest difference will always be the one where the factors are as close to √n as possible. Think about it: if you have a number like 100, the factor pairs are (1,100), (2,50), (4,25), (5,20), (10,10). The pair (10,10) has the smallest difference (0) and is closest to √100 = 10.

Therefore, to find the closest divisors:

1. For both `num + 1` and `num + 2`, start from the integer square root and work downward
2. For each candidate divisor `i`, check if it divides the number evenly
3. The first valid divisor we find (working from √n downward) will give us the factor pair with the smallest difference for that number
4. Compare the best pairs from `num + 1` and `num + 2` and return the one with the smaller difference

Why does starting from √n work? Because for any factor `i` less than √n, the corresponding factor `n/i` will be greater than √n, giving us a larger difference. The closer both factors are to √n, the smaller their difference.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(√n) where n = max(num+1, num+2) | Space: O(1)
def closestDivisors(num):
    """
    Find the closest two integers whose product equals num+1 or num+2.

    The key insight: for any number n, the factor pair with the smallest
    difference will be the one closest to the square root of n.
    So we start searching from sqrt(n) downward for both num+1 and num+2.
    """

    def find_closest_divisors(n):
        """
        Helper function to find the closest divisor pair for a given number n.
        Returns the pair (a, b) where a * b = n and |a-b| is minimized.
        """
        # Start from the integer square root and work downward
        # The int() conversion effectively gives us floor(sqrt(n))
        start = int(n ** 0.5)

        # Iterate from sqrt(n) down to 1
        for i in range(start, 0, -1):
            if n % i == 0:
                # Found a divisor! Since we're starting from sqrt(n) and
                # moving downward, this is the pair with smallest difference
                return [i, n // i]

        # This line should never be reached since 1 always divides n
        return [1, n]

    # Find the closest divisor pairs for both num+1 and num+2
    divisors1 = find_closest_divisors(num + 1)
    divisors2 = find_closest_divisors(num + 2)

    # Compare the differences and return the pair with smaller difference
    # Calculate absolute difference for each pair
    diff1 = abs(divisors1[0] - divisors1[1])
    diff2 = abs(divisors2[0] - divisors2[1])

    # Return the pair with the smaller absolute difference
    return divisors1 if diff1 < diff2 else divisors2
```

```javascript
// Time: O(√n) where n = max(num+1, num+2) | Space: O(1)
function closestDivisors(num) {
  /**
   * Find the closest two integers whose product equals num+1 or num+2.
   *
   * The key insight: for any number n, the factor pair with the smallest
   * difference will be the one closest to the square root of n.
   * So we start searching from sqrt(n) downward for both num+1 and num+2.
   */

  /**
   * Helper function to find the closest divisor pair for a given number n.
   * Returns the pair [a, b] where a * b = n and |a-b| is minimized.
   */
  function findClosestDivisors(n) {
    // Start from the integer square root and work downward
    // Math.floor gives us the integer part of sqrt(n)
    let start = Math.floor(Math.sqrt(n));

    // Iterate from sqrt(n) down to 1
    for (let i = start; i >= 1; i--) {
      if (n % i === 0) {
        // Found a divisor! Since we're starting from sqrt(n) and
        // moving downward, this is the pair with smallest difference
        return [i, n / i];
      }
    }

    // This line should never be reached since 1 always divides n
    return [1, n];
  }

  // Find the closest divisor pairs for both num+1 and num+2
  const divisors1 = findClosestDivisors(num + 1);
  const divisors2 = findClosestDivisors(num + 2);

  // Compare the differences and return the pair with smaller difference
  // Calculate absolute difference for each pair
  const diff1 = Math.abs(divisors1[0] - divisors1[1]);
  const diff2 = Math.abs(divisors2[0] - divisors2[1]);

  // Return the pair with the smaller absolute difference
  return diff1 < diff2 ? divisors1 : divisors2;
}
```

```java
// Time: O(√n) where n = max(num+1, num+2) | Space: O(1)
class Solution {
    public int[] closestDivisors(int num) {
        /**
         * Find the closest two integers whose product equals num+1 or num+2.
         *
         * The key insight: for any number n, the factor pair with the smallest
         * difference will be the one closest to the square root of n.
         * So we start searching from sqrt(n) downward for both num+1 and num+2.
         */

        // Find the closest divisor pairs for both num+1 and num+2
        int[] divisors1 = findClosestDivisors(num + 1);
        int[] divisors2 = findClosestDivisors(num + 2);

        // Compare the differences and return the pair with smaller difference
        // Calculate absolute difference for each pair
        int diff1 = Math.abs(divisors1[0] - divisors1[1]);
        int diff2 = Math.abs(divisors2[0] - divisors2[1]);

        // Return the pair with the smaller absolute difference
        return diff1 < diff2 ? divisors1 : divisors2;
    }

    /**
     * Helper function to find the closest divisor pair for a given number n.
     * Returns the pair [a, b] where a * b = n and |a-b| is minimized.
     */
    private int[] findClosestDivisors(int n) {
        // Start from the integer square root and work downward
        // (int) cast effectively gives us floor(sqrt(n))
        int start = (int) Math.sqrt(n);

        // Iterate from sqrt(n) down to 1
        for (int i = start; i >= 1; i--) {
            if (n % i == 0) {
                // Found a divisor! Since we're starting from sqrt(n) and
                // moving downward, this is the pair with smallest difference
                return new int[]{i, n / i};
            }
        }

        // This line should never be reached since 1 always divides n
        return new int[]{1, n};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(√n) where n = max(num+1, num+2)

We check at most √(num+1) + √(num+2) numbers in the worst case. Since √(num+1) and √(num+2) are both O(√n), the overall time complexity is O(√n). In the worst case, we might need to check all numbers from √n down to 1 for both num+1 and num+2, but we stop as soon as we find a valid divisor for each.

**Space Complexity:** O(1)

We only use a constant amount of extra space to store the divisor pairs and differences. The helper function uses O(1) space regardless of input size.

## Common Mistakes

1. **Starting from 1 instead of √n:** Some candidates iterate from 1 upward, checking all possible divisors. This is O(n) time and will timeout for large inputs. Always remember that for finding factor pairs with minimal difference, starting from the square root is optimal.

2. **Forgetting to check both num+1 and num+2:** The problem asks for the closest divisors from EITHER num+1 OR num+2. Some candidates only check one of them. You must check both and compare the results.

3. **Incorrect integer square root calculation:** When calculating the starting point, make sure to use integer division or flooring. In Python, `int(n ** 0.5)` works. In JavaScript, `Math.floor(Math.sqrt(n))`. In Java, `(int) Math.sqrt(n)`. Using floating-point sqrt without proper conversion can lead to off-by-one errors.

4. **Not handling the edge case when num = 0 or num = 1:** For num = 0, we check divisors of 1 and 2. The closest divisors for 1 are [1, 1] and for 2 are [1, 2] or [2, 1]. [1, 1] has difference 0, which is smaller than 1, so we return [1, 1]. The algorithm handles this correctly since √1 = 1 and 1 divides 1.

## When You'll See This Pattern

This "start from the square root" pattern appears in several types of problems:

1. **Prime factorization problems:** When finding all prime factors of a number, you only need to check up to √n because any factor larger than √n would have a corresponding factor smaller than √n.

2. **Perfect square checking:** To check if a number is a perfect square, you can check if floor(√n)² = n.

3. **Problems involving divisor pairs:** Any problem that asks you to find factor pairs or work with divisors often benefits from the square root optimization.

Specific LeetCode problems that use similar patterns:

- **Count Primes (Problem 204):** Uses the sieve of Eratosthenes, which relies on the fact that any composite number has a prime factor ≤ √n.
- **Valid Perfect Square (Problem 367):** Checks if a number is a perfect square using binary search up to √n.
- **Bulb Switcher (Problem 319):** The solution involves understanding that only perfect squares have an odd number of divisors, which relates to the square root concept.

## Key Takeaways

1. **For divisor/factor problems, think about the square root:** When you need to find factor pairs or work with divisors of a number n, remember that you only need to check up to √n. Any factor larger than √n will have a corresponding factor smaller than √n.

2. **Closest factors are near the square root:** The factor pair with the smallest difference is always the one closest to √n. This is why starting our search from √n and moving downward is optimal.

3. **Break problems into helper functions:** Creating a helper function `findClosestDivisors` makes the code cleaner and easier to understand. It also allows you to reuse the same logic for both `num+1` and `num+2`.

Related problems: [Distinct Prime Factors of Product of Array](/problem/distinct-prime-factors-of-product-of-array)
