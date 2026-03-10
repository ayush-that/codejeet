---
title: "How to Solve Perfect Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Perfect Number. Easy difficulty, 48.0% acceptance rate. Topics: Math."
date: "2027-09-21"
category: "dsa-patterns"
tags: ["perfect-number", "math", "easy"]
---

# How to Solve Perfect Number

A perfect number is a positive integer that equals the sum of its proper positive divisors (excluding itself). While the concept is straightforward, the implementation requires careful handling of edge cases and optimization to avoid unnecessary computation. The challenge lies in efficiently finding all divisors without checking every number up to n.

## Visual Walkthrough

Let's trace through the example `n = 28` to understand what makes a number "perfect":

**Step 1:** Identify all positive divisors of 28 (excluding 28 itself):

- 1 (28 ÷ 1 = 28)
- 2 (28 ÷ 2 = 14)
- 4 (28 ÷ 4 = 7)
- 7 (28 ÷ 7 = 4)
- 14 (28 ÷ 14 = 2)

**Step 2:** Sum these divisors: 1 + 2 + 4 + 7 + 14 = 28

**Step 3:** Compare the sum to the original number: 28 = 28 ✓

Since the sum equals the original number, 28 is a perfect number.

Now let's try `n = 12`:

- Divisors: 1, 2, 3, 4, 6
- Sum: 1 + 2 + 3 + 4 + 6 = 16
- 16 ≠ 12, so 12 is not perfect

The key insight is that we only need to check numbers up to √n because divisors come in pairs. For 28:

- When we find divisor 2, we also get 14 (28 ÷ 2)
- When we find divisor 4, we also get 7 (28 ÷ 4)

## Brute Force Approach

The most straightforward approach is to iterate through all numbers from 1 to n-1, check if each is a divisor, and sum them:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkPerfectNumber_brute(n):
    # Edge case: 1 is not perfect (no proper divisors)
    if n <= 1:
        return False

    divisor_sum = 0
    # Check every number from 1 to n-1
    for i in range(1, n):
        if n % i == 0:  # i is a divisor
            divisor_sum += i

    return divisor_sum == n
```

```javascript
// Time: O(n) | Space: O(1)
function checkPerfectNumberBrute(n) {
  // Edge case: 1 is not perfect (no proper divisors)
  if (n <= 1) return false;

  let divisorSum = 0;
  // Check every number from 1 to n-1
  for (let i = 1; i < n; i++) {
    if (n % i === 0) {
      // i is a divisor
      divisorSum += i;
    }
  }

  return divisorSum === n;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean checkPerfectNumberBrute(int n) {
    // Edge case: 1 is not perfect (no proper divisors)
    if (n <= 1) return false;

    int divisorSum = 0;
    // Check every number from 1 to n-1
    for (int i = 1; i < n; i++) {
        if (n % i == 0) {  // i is a divisor
            divisorSum += i;
        }
    }

    return divisorSum == n;
}
```

</div>

**Why this is inefficient:** For large n (like 10^8), checking every number up to n is too slow. The time complexity is O(n), which becomes impractical as n grows. We need to optimize by recognizing that divisors come in pairs.

## Optimal Solution

The key optimization is to only iterate up to √n. For each divisor i we find, we also add its pair n/i (except when i equals n/i, to avoid double-counting perfect squares). We also need to handle the edge case where n ≤ 1.

<div class="code-group">

```python
# Time: O(√n) | Space: O(1)
def checkPerfectNumber(n):
    # Edge case: perfect numbers must be positive integers > 1
    if n <= 1:
        return False

    divisor_sum = 1  # Start with 1 since it's always a divisor (except for n=1)

    # Only check up to the square root of n
    # Using int(n**0.5) + 1 to ensure we check up to and including floor(sqrt(n))
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:  # i is a divisor
            divisor_sum += i  # Add the smaller divisor

            # Add the paired divisor (n/i)
            # But avoid adding i twice when i equals n/i (perfect square case)
            if i != n // i:
                divisor_sum += n // i

    # Check if sum of proper divisors equals n
    return divisor_sum == n
```

```javascript
// Time: O(√n) | Space: O(1)
function checkPerfectNumber(n) {
  // Edge case: perfect numbers must be positive integers > 1
  if (n <= 1) return false;

  let divisorSum = 1; // Start with 1 since it's always a divisor (except for n=1)

  // Only check up to the square root of n
  // Using Math.floor(Math.sqrt(n)) to ensure we check up to floor(sqrt(n))
  for (let i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
    if (n % i === 0) {
      // i is a divisor
      divisorSum += i; // Add the smaller divisor

      // Add the paired divisor (n/i)
      // But avoid adding i twice when i equals n/i (perfect square case)
      if (i !== n / i) {
        divisorSum += n / i;
      }
    }
  }

  // Check if sum of proper divisors equals n
  return divisorSum === n;
}
```

```java
// Time: O(√n) | Space: O(1)
public boolean checkPerfectNumber(int n) {
    // Edge case: perfect numbers must be positive integers > 1
    if (n <= 1) return false;

    int divisorSum = 1;  // Start with 1 since it's always a divisor (except for n=1)

    // Only check up to the square root of n
    // Using (int)Math.sqrt(n) to ensure we check up to floor(sqrt(n))
    for (int i = 2; i <= (int)Math.sqrt(n); i++) {
        if (n % i == 0) {  // i is a divisor
            divisorSum += i;  // Add the smaller divisor

            // Add the paired divisor (n/i)
            // But avoid adding i twice when i equals n/i (perfect square case)
            if (i != n / i) {
                divisorSum += n / i;
            }
        }
    }

    // Check if sum of proper divisors equals n
    return divisorSum == n;
}
```

</div>

**Step-by-step explanation:**

1. **Handle edge case:** Numbers ≤ 1 cannot be perfect (they have no proper positive divisors).
2. **Initialize sum:** Start with 1 since it's a divisor of every positive integer (except 1 itself, which we already excluded).
3. **Iterate up to √n:** For i from 2 to √n (inclusive), check if i divides n evenly.
4. **Add divisors in pairs:** When i divides n:
   - Add i to the sum
   - Add n/i to the sum (unless i = n/i, which happens with perfect squares)
5. **Compare:** Check if the sum equals the original number.

## Complexity Analysis

**Time Complexity:** O(√n)

- We iterate from 2 to √n, which gives us O(√n) iterations
- Each iteration performs constant-time operations (modulo, addition, comparison)

**Space Complexity:** O(1)

- We only use a constant amount of extra space (the `divisor_sum` variable and loop counter)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle n ≤ 1:** The smallest perfect number is 6, so any number ≤ 1 should return false immediately. Candidates often miss this edge case.

2. **Including n itself in the sum:** The problem specifies "excluding the number itself." Make sure your loop condition is `i < n` in the brute force or that you don't accidentally include n when adding divisor pairs.

3. **Double-counting perfect squares:** When n is a perfect square (like 16), √n is an integer divisor. If you add both i and n/i when i = √n, you'll add the same number twice. Always check `if i != n/i` before adding the pair.

4. **Starting the sum at 0 instead of 1:** Since we start our loop at 2 (to avoid checking 1 repeatedly), we need to initialize the sum to 1. Forgetting this means we're missing a divisor.

5. **Using floating-point math for the square root:** In languages like Java, using `Math.sqrt()` returns a double. When converting to int for the loop bound, ensure you handle the conversion correctly. Using `(int)Math.sqrt(n)` gives the floor, which is what we want.

## When You'll See This Pattern

The "iterate up to √n" pattern appears in many number theory and divisor-related problems:

1. **Count Primes (LeetCode 204):** To check if a number is prime, you only need to check divisors up to √n. The Sieve of Eratosthenes also uses similar optimization.

2. **Self Dividing Numbers (LeetCode 728):** While checking if a number is self-dividing, you need to examine each digit, but the divisor-checking logic is similar.

3. **Ugly Number (LeetCode 263):** Checking if a number's prime factors are limited to 2, 3, and 5 involves repeatedly dividing by these factors until you reach 1.

4. **Sum of Square Numbers (LeetCode 633):** Checking if a number can be expressed as a sum of two squares often involves iterating up to √n.

The core insight is that when looking for factors or divisors, they always come in pairs (a, b) where a × b = n, and one is ≤ √n while the other is ≥ √n.

## Key Takeaways

1. **Divisors come in pairs:** For any divisor i of n, there exists a paired divisor n/i. This allows us to check only up to √n instead of n, reducing time complexity from O(n) to O(√n).

2. **Watch for perfect squares:** When n is a perfect square, √n is a divisor that pairs with itself. You must handle this case to avoid double-counting.

3. **Initialize carefully with edge cases:** Always consider the smallest possible inputs (n ≤ 1) and initialize your sum correctly based on where you start your loop.

4. **Mathematical problems often have mathematical optimizations:** When a brute force solution seems too slow, look for mathematical properties (like divisor pairs) that can reduce the search space.

Related problems: [Self Dividing Numbers](/problem/self-dividing-numbers)
