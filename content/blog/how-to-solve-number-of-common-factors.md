---
title: "How to Solve Number of Common Factors — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Common Factors. Easy difficulty, 79.9% acceptance rate. Topics: Math, Enumeration, Number Theory."
date: "2026-08-22"
category: "dsa-patterns"
tags: ["number-of-common-factors", "math", "enumeration", "number-theory", "easy"]
---

## How to Solve Number of Common Factors

This problem asks us to count how many integers divide both of two given positive integers `a` and `b`. While conceptually straightforward, it tests your understanding of factors, efficient enumeration, and number theory basics. The interesting part is recognizing that you don't need to check every number up to `max(a,b)`—only up to their greatest common divisor.

## Visual Walkthrough

Let's trace through an example: `a = 12`, `b = 18`.

First, list all factors of each number:

- Factors of 12: 1, 2, 3, 4, 6, 12
- Factors of 18: 1, 2, 3, 6, 9, 18

The common factors are those appearing in both lists: 1, 2, 3, 6. That's 4 common factors.

But checking every number up to 18 would be inefficient. Notice that any common factor must also divide the greatest common divisor (GCD) of 12 and 18. The GCD of 12 and 18 is 6. The factors of 6 are: 1, 2, 3, 6—exactly our common factors! This gives us a crucial optimization: instead of checking up to 18, we only need to check numbers up to the GCD.

## Brute Force Approach

The most straightforward solution is to check every integer from 1 to `min(a,b)` and count those that divide both numbers:

<div class="code-group">

```python
# Time: O(min(a,b)) | Space: O(1)
def commonFactors(a, b):
    count = 0
    # Check every number from 1 to the smaller of a and b
    for i in range(1, min(a, b) + 1):
        if a % i == 0 and b % i == 0:
            count += 1
    return count
```

```javascript
// Time: O(min(a,b)) | Space: O(1)
function commonFactors(a, b) {
  let count = 0;
  // Check every number from 1 to the smaller of a and b
  for (let i = 1; i <= Math.min(a, b); i++) {
    if (a % i === 0 && b % i === 0) {
      count++;
    }
  }
  return count;
}
```

```java
// Time: O(min(a,b)) | Space: O(1)
public int commonFactors(int a, int b) {
    int count = 0;
    // Check every number from 1 to the smaller of a and b
    for (int i = 1; i <= Math.min(a, b); i++) {
        if (a % i == 0 && b % i == 0) {
            count++;
        }
    }
    return count;
}
```

</div>

**Why this is inefficient:** If `a` and `b` are large (say, 10^9), we're doing up to a billion iterations. While acceptable for small inputs, this doesn't scale well. The key insight is that any common factor must divide the GCD, so we only need to check numbers up to `gcd(a,b)`, which is often much smaller than `min(a,b)`.

## Optimal Solution

We can optimize by first finding the GCD, then counting its factors. This reduces the upper bound of our loop from `min(a,b)` to `gcd(a,b)`. We find the GCD using Euclid's algorithm, which is efficient even for large numbers.

<div class="code-group">

```python
# Time: O(sqrt(gcd(a,b))) | Space: O(1)
def commonFactors(a, b):
    # Step 1: Find GCD using Euclid's algorithm
    def gcd(x, y):
        while y:
            x, y = y, x % y
        return x

    g = gcd(a, b)
    count = 0

    # Step 2: Count factors of the GCD
    # Only check up to sqrt(g) to avoid duplicate checks
    i = 1
    while i * i <= g:
        if g % i == 0:
            # i is a factor
            count += 1
            # Check if i and g/i are different
            if i != g // i:
                count += 1
        i += 1

    return count
```

```javascript
// Time: O(sqrt(gcd(a,b))) | Space: O(1)
function commonFactors(a, b) {
  // Step 1: Find GCD using Euclid's algorithm
  function gcd(x, y) {
    while (y !== 0) {
      [x, y] = [y, x % y];
    }
    return x;
  }

  const g = gcd(a, b);
  let count = 0;

  // Step 2: Count factors of the GCD
  // Only check up to sqrt(g) to avoid duplicate checks
  let i = 1;
  while (i * i <= g) {
    if (g % i === 0) {
      // i is a factor
      count++;
      // Check if i and g/i are different
      if (i !== g / i) {
        count++;
      }
    }
    i++;
  }

  return count;
}
```

```java
// Time: O(sqrt(gcd(a,b))) | Space: O(1)
public int commonFactors(int a, int b) {
    // Step 1: Find GCD using Euclid's algorithm
    int gcd(int x, int y) {
        while (y != 0) {
            int temp = y;
            y = x % y;
            x = temp;
        }
        return x;
    }

    int g = gcd(a, b);
    int count = 0;

    // Step 2: Count factors of the GCD
    // Only check up to sqrt(g) to avoid duplicate checks
    int i = 1;
    while (i * i <= g) {
        if (g % i == 0) {
            // i is a factor
            count++;
            // Check if i and g/i are different
            if (i != g / i) {
                count++;
            }
        }
        i++;
    }

    return count;
}
```

</div>

**Step-by-step explanation:**

1. **Find the GCD**: We use Euclid's algorithm, which repeatedly replaces the larger number with the remainder of dividing the larger by the smaller until we reach 0.
2. **Count factors efficiently**: Instead of checking every number up to `g`, we only check up to `√g`. If `i` divides `g`, then both `i` and `g/i` are factors (unless they're equal, in which case we count it once).

## Complexity Analysis

**Time Complexity:** `O(√gcd(a,b))`

- Finding the GCD using Euclid's algorithm takes `O(log(min(a,b)))` time
- Counting factors by checking up to `√g` takes `O(√g)` time where `g = gcd(a,b)`
- The dominant term is `O(√g)`, which is much better than `O(min(a,b))` for large numbers

**Space Complexity:** `O(1)`

- We only use a constant amount of extra space for variables

## Common Mistakes

1. **Checking up to `max(a,b)` instead of `min(a,b)` or `gcd(a,b)`**: A factor can't be larger than the number it divides, so checking beyond `min(a,b)` is wasted work. Even better is checking only up to `gcd(a,b)`.

2. **Forgetting to include 1 as a factor**: 1 always divides any integer, so it's always a common factor. Some candidates start checking from 2.

3. **Not handling the case where `i = g/i`**: When counting factors up to `√g`, if `g` is a perfect square, `i` and `g/i` are the same for `i = √g`. We should count this factor only once.

4. **Using integer division incorrectly**: When checking `if i != g // i`, use integer division in languages like Python and Java to avoid floating-point issues.

## When You'll See This Pattern

This problem combines two fundamental number theory concepts: GCD calculation and factor enumeration. You'll see these patterns in:

1. **Count Primes (LeetCode 204)**: Similar factor-checking logic, but optimized with the Sieve of Eratosthenes.
2. **Greatest Common Divisor of Strings (LeetCode 1071)**: Uses GCD to find the largest repeating substring pattern.
3. **Fraction Addition and Subtraction (LeetCode 592)**: Requires GCD for simplifying fractions.

The pattern of "find GCD first, then work with its properties" appears whenever you need to find common divisors or simplify ratios between numbers.

## Key Takeaways

1. **Any common divisor of two numbers also divides their GCD**: This is the key insight that allows optimization from `O(min(a,b))` to `O(√gcd(a,b))`.

2. **Count factors efficiently by checking only up to √n**: For any number `n`, if `i` divides `n`, then `n/i` also divides `n`. This halves the search space.

3. **Euclid's algorithm is the standard for GCD calculation**: Remember the iterative form: `while (b != 0) { temp = b; b = a % b; a = temp; } return a;`

Related problems: [Count Primes](/problem/count-primes)
