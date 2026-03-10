---
title: "How to Solve Three Divisors — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Three Divisors. Easy difficulty, 63.9% acceptance rate. Topics: Math, Enumeration, Number Theory."
date: "2026-12-18"
category: "dsa-patterns"
tags: ["three-divisors", "math", "enumeration", "number-theory", "easy"]
---

# How to Solve Three Divisors

This problem asks us to determine whether a given integer `n` has exactly three positive divisors. While it seems straightforward, the key insight lies in recognizing that numbers with exactly three divisors have a special mathematical property. The challenge is identifying this property efficiently rather than brute-forcing through all possible divisors.

## Visual Walkthrough

Let's trace through some examples to build intuition:

**Example 1: n = 4**

- Divisors of 4: 1, 2, 4 → That's exactly 3 divisors → Return `true`

**Example 2: n = 9**

- Divisors of 9: 1, 3, 9 → Exactly 3 divisors → Return `true`

**Example 3: n = 6**

- Divisors of 6: 1, 2, 3, 6 → That's 4 divisors → Return `false`

**Example 4: n = 25**

- Divisors of 25: 1, 5, 25 → Exactly 3 divisors → Return `true`

Notice a pattern? 4, 9, and 25 are all perfect squares of prime numbers:

- 4 = 2² (2 is prime)
- 9 = 3² (3 is prime)
- 25 = 5² (5 is prime)

Why does this work? A number with exactly three divisors must be a perfect square of a prime number. Here's why:

1. The divisors always come in pairs (d, n/d) except when d = n/d
2. For exactly three divisors, we need one "unpaired" divisor (the square root)
3. This happens only when n = p² where p is prime
4. The divisors are: 1, p, and p²

## Brute Force Approach

The most straightforward approach is to count all divisors of `n` by checking every integer from 1 to `n`:

1. Initialize a counter to 0
2. For each integer `i` from 1 to `n`:
   - If `n % i == 0`, increment the counter
3. Return `true` if counter equals 3, otherwise `false`

While this approach is correct, it has O(n) time complexity, which becomes inefficient for large values of `n`. For example, if `n = 10^9`, we'd need to perform a billion operations.

## Optimal Solution

The optimal solution leverages the mathematical insight: a number has exactly three divisors if and only if it's a perfect square of a prime number. Here's the step-by-step approach:

1. Check if `n` is a perfect square
2. If yes, check if its square root is prime
3. Return `true` only if both conditions are satisfied

<div class="code-group">

```python
# Time: O(√n) | Space: O(1)
def isThree(n: int) -> bool:
    # Step 1: Check if n is a perfect square
    # We find the integer square root and verify it squares back to n
    sqrt_n = int(n ** 0.5)

    # If n is not a perfect square, it can't have exactly 3 divisors
    if sqrt_n * sqrt_n != n:
        return False

    # Step 2: Check if the square root is prime
    # A prime number is greater than 1 and has no divisors other than 1 and itself
    if sqrt_n < 2:
        return False

    # Check divisibility from 2 to sqrt(sqrt_n)
    # We only need to check up to the square root of sqrt_n
    for i in range(2, int(sqrt_n ** 0.5) + 1):
        if sqrt_n % i == 0:
            return False

    # If we found no divisors, sqrt_n is prime
    return True
```

```javascript
// Time: O(√n) | Space: O(1)
function isThree(n) {
  // Step 1: Check if n is a perfect square
  // Use Math.floor to get integer square root
  const sqrtN = Math.floor(Math.sqrt(n));

  // If n is not a perfect square, it can't have exactly 3 divisors
  if (sqrtN * sqrtN !== n) {
    return false;
  }

  // Step 2: Check if the square root is prime
  // A prime number is greater than 1
  if (sqrtN < 2) {
    return false;
  }

  // Check divisibility from 2 to sqrt(sqrtN)
  // We only need to check up to the square root of sqrtN
  for (let i = 2; i <= Math.floor(Math.sqrt(sqrtN)); i++) {
    if (sqrtN % i === 0) {
      return false;
    }
  }

  // If we found no divisors, sqrtN is prime
  return true;
}
```

```java
// Time: O(√n) | Space: O(1)
class Solution {
    public boolean isThree(int n) {
        // Step 1: Check if n is a perfect square
        // Cast to int to get integer square root
        int sqrtN = (int) Math.sqrt(n);

        // If n is not a perfect square, it can't have exactly 3 divisors
        if (sqrtN * sqrtN != n) {
            return false;
        }

        // Step 2: Check if the square root is prime
        // A prime number is greater than 1
        if (sqrtN < 2) {
            return false;
        }

        // Check divisibility from 2 to sqrt(sqrtN)
        // We only need to check up to the square root of sqrtN
        for (int i = 2; i <= Math.sqrt(sqrtN); i++) {
            if (sqrtN % i == 0) {
                return false;
            }
        }

        // If we found no divisors, sqrtN is prime
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√n)**

- Finding the square root takes O(1) in practice
- Checking if the square root is prime takes O(√(√n)) = O(n^(1/4))
- However, the dominant operation is computing the square root, which is O(√n) in the worst case
- This is significantly faster than the brute force O(n) approach

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures are needed

## Common Mistakes

1. **Forgetting to check if n is a perfect square first**: Some candidates jump straight to checking if n is prime or counting divisors without realizing the perfect square requirement.

2. **Incorrect prime checking for the square root**: When checking if the square root is prime, candidates might:
   - Check up to `sqrt_n` instead of `√(sqrt_n)`, making it O(n) instead of O(√n)
   - Forget to handle the case where `sqrt_n < 2` (1 is not prime)

3. **Off-by-one errors in loops**: When iterating to check for divisors, remember:
   - Start from 2 (since 1 divides everything)
   - Include the upper bound: use `i <= int(sqrt_n ** 0.5)` not `i < int(sqrt_n ** 0.5)`

4. **Integer overflow with large n**: When computing `sqrt_n * sqrt_n`, ensure you're using a data type that can handle the result. In Python, this isn't an issue, but in Java/C++ with large n, you might need to use `long` types.

## When You'll See This Pattern

This problem combines two fundamental concepts: perfect squares and prime numbers. You'll see similar patterns in:

1. **Count Primes (LeetCode 204)**: Requires efficient prime checking, similar to our square root prime verification.

2. **Valid Perfect Square (LeetCode 367)**: Directly asks to check if a number is a perfect square, which is the first step in our solution.

3. **Ugly Number (LeetCode 263)**: Another number theory problem that requires analyzing a number's divisors based on its prime factors.

The core technique of reducing a problem to checking mathematical properties (rather than brute force enumeration) appears in many optimization problems.

## Key Takeaways

1. **Look for mathematical properties**: Many "counting" problems have mathematical shortcuts. When asked about divisors, consider prime factorization and properties of perfect squares.

2. **Optimize divisor checking**: You only need to check divisors up to √n because divisors come in pairs. This reduces O(n) to O(√n).

3. **Combine multiple checks efficiently**: This solution shows how to chain conditions (perfect square → prime square root) to avoid unnecessary computations.

Related problems: [Find Greatest Common Divisor of Array](/problem/find-greatest-common-divisor-of-array), [Smallest Even Multiple](/problem/smallest-even-multiple)
