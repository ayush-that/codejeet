---
title: "How to Solve Ugly Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Ugly Number. Easy difficulty, 43.2% acceptance rate. Topics: Math."
date: "2027-01-01"
category: "dsa-patterns"
tags: ["ugly-number", "math", "easy"]
---

# How to Solve Ugly Number

An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, determine if it's ugly. While the problem seems straightforward, the tricky part lies in handling edge cases correctly and efficiently reducing the number through division. Many candidates stumble on non-positive numbers or get stuck in infinite loops with certain inputs.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Suppose we're checking if 30 is an ugly number:

1. **Start with n = 30** (positive, so we continue)
2. **Divide by 2**: 30 ÷ 2 = 15 (2 is an allowed prime factor)
3. **Divide by 2 again**: 15 ÷ 2 = 7.5 (not divisible, so move to next factor)
4. **Divide by 3**: 15 ÷ 3 = 5 (3 is an allowed prime factor)
5. **Divide by 3 again**: 5 ÷ 3 ≈ 1.67 (not divisible, move to next factor)
6. **Divide by 5**: 5 ÷ 5 = 1 (5 is an allowed prime factor)
7. **We reached 1** → This means all prime factors were 2, 3, or 5 → 30 is ugly

Now let's try a non-ugly number, like 14:

1. **Start with n = 14** (positive)
2. **Divide by 2**: 14 ÷ 2 = 7
3. **Divide by 2 again**: 7 ÷ 2 = 3.5 (not divisible)
4. **Divide by 3**: 7 ÷ 3 ≈ 2.33 (not divisible)
5. **Divide by 5**: 7 ÷ 5 = 1.4 (not divisible)
6. **We're left with 7** (not 1) → 7 has a prime factor other than 2, 3, or 5 → 14 is not ugly

The algorithm becomes clear: repeatedly divide by 2, 3, and 5 until we can't anymore, then check if what remains is 1.

## Brute Force Approach

A naive approach might try to find all prime factors of n and check if any are outside {2, 3, 5}. This involves:

1. Finding all prime factors (which requires checking divisibility up to √n)
2. Checking each prime factor against the allowed set

This approach is inefficient because:

- We don't need to find ALL prime factors, just determine if any disallowed ones exist
- The prime factorization process is more complex than needed
- We'd need to handle prime factorization carefully, which has its own edge cases

The brute force would have O(√n) time complexity in the worst case, which is acceptable for this problem but more complex to implement correctly. The optimal solution is actually simpler and more efficient.

## Optimal Solution

The optimal approach uses repeated division by the allowed prime factors (2, 3, 5). We keep dividing n by each factor as long as it's divisible, then check if the final result is 1. If it is, all prime factors were 2, 3, or 5. If not, there was some other prime factor.

Key insights:

1. If n has any prime factor other than 2, 3, or 5, after dividing by all 2s, 3s, and 5s, we'll be left with something greater than 1
2. The order of division doesn't matter (2, 3, 5 or 5, 3, 2 - same result)
3. We must handle n ≤ 0 as a special case (only positive numbers can be ugly)

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def isUgly(n: int) -> bool:
    # Edge case: ugly numbers must be positive
    if n <= 0:
        return False

    # List of allowed prime factors
    factors = [2, 3, 5]

    # Keep dividing n by each factor while it's divisible
    for factor in factors:
        # While n is divisible by the current factor, divide it
        # This removes all occurrences of this prime factor
        while n % factor == 0:
            n //= factor

    # After removing all 2s, 3s, and 5s, check if we're left with 1
    # If n == 1, all prime factors were 2, 3, or 5
    # If n > 1, there was some other prime factor
    return n == 1
```

```javascript
// Time: O(log n) | Space: O(1)
function isUgly(n) {
  // Edge case: ugly numbers must be positive
  if (n <= 0) {
    return false;
  }

  // Array of allowed prime factors
  const factors = [2, 3, 5];

  // Keep dividing n by each factor while it's divisible
  for (const factor of factors) {
    // While n is divisible by the current factor, divide it
    // This removes all occurrences of this prime factor
    while (n % factor === 0) {
      n = Math.floor(n / factor);
    }
  }

  // After removing all 2s, 3s, and 5s, check if we're left with 1
  // If n === 1, all prime factors were 2, 3, or 5
  // If n > 1, there was some other prime factor
  return n === 1;
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    public boolean isUgly(int n) {
        // Edge case: ugly numbers must be positive
        if (n <= 0) {
            return false;
        }

        // Array of allowed prime factors
        int[] factors = {2, 3, 5};

        // Keep dividing n by each factor while it's divisible
        for (int factor : factors) {
            // While n is divisible by the current factor, divide it
            // This removes all occurrences of this prime factor
            while (n % factor == 0) {
                n /= factor;
            }
        }

        // After removing all 2s, 3s, and 5s, check if we're left with 1
        // If n == 1, all prime factors were 2, 3, or 5
        // If n > 1, there was some other prime factor
        return n == 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- In the worst case, we might divide by 2 repeatedly (the most frequent operation)
- Each division reduces n by at least half when dividing by 2
- The number of divisions is proportional to the number of times we can halve n, which is O(log n)
- Even with three factors, the overall operations are still O(log n) since we're reducing n geometrically

**Space Complexity: O(1)**

- We only use a constant amount of extra space
- The factors array has fixed size (3 elements)
- No recursion or data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle non-positive numbers**: The problem states ugly numbers are _positive_ integers. Many candidates return True for n = 0 or negative n. Always check n ≤ 0 first.

2. **Infinite loop with n = 0**: If you forget the n ≤ 0 check and try to divide 0 by factors, you'll get stuck in an infinite loop since 0 % factor == 0 always.

3. **Checking factors in wrong order**: While mathematically the order doesn't matter, some implementations might have issues if they don't use while loops properly. The key is to completely exhaust each factor before moving to the next.

4. **Using floating point division**: Some candidates use regular division (/) instead of integer division (// or Math.floor). This can lead to precision issues with large numbers.

5. **Not understanding the definition**: Some think ugly numbers are only divisible by 2, 3, OR 5 (rather than having prime factors limited to these). For example, 14 is divisible by 2 but has prime factor 7, so it's not ugly.

## When You'll See This Pattern

This "repeated division by factors" pattern appears in several problems:

1. **Happy Number (Easy)**: Similar iterative process of reducing a number by a fixed rule until you reach a terminal state (1 or a cycle).

2. **Count Primes (Medium)**: Uses the Sieve of Eratosthenes, which involves marking multiples of primes - another number reduction technique.

3. **Ugly Number II (Medium)**: Builds on this concept to find the nth ugly number using dynamic programming with three pointers.

4. **Factorial Trailing Zeroes (Easy)**: Counts factors of 5 in factorial numbers using repeated division.

The core pattern is: when you need to examine or remove certain factors from numbers, repeated division is often the cleanest approach.

## Key Takeaways

1. **Repeated division is powerful for factor analysis**: When you need to check what prime factors a number has, repeatedly dividing by candidate factors until you can't is often simpler than full prime factorization.

2. **Handle edge cases first**: Always check for non-positive inputs early. This prevents infinite loops and incorrect results.

3. **The "terminal state" pattern**: Many number problems involve reducing a number until you reach a terminal state (1, 0, or a cycle). Recognizing this pattern helps you structure your solution.

4. **Mathematical properties simplify code**: Understanding that order of division doesn't matter for prime factors allows for simpler implementation than trying to factor in a specific order.

Related problems: [Happy Number](/problem/happy-number), [Count Primes](/problem/count-primes), [Ugly Number II](/problem/ugly-number-ii)
