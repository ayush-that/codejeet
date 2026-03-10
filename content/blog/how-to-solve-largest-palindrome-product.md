---
title: "How to Solve Largest Palindrome Product — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Largest Palindrome Product. Hard difficulty, 38.1% acceptance rate. Topics: Math, Enumeration."
date: "2029-03-09"
category: "dsa-patterns"
tags: ["largest-palindrome-product", "math", "enumeration", "hard"]
---

# How to Solve Largest Palindrome Product

Given an integer `n`, we need to find the largest palindrome number that can be formed as the product of two `n`-digit numbers, then return it modulo 1337. This problem is tricky because:

1. The numbers can be enormous (for n=8, we're dealing with 100 million possibilities)
2. We need to efficiently search through a massive search space
3. The palindrome check and product validation must be optimized

## Visual Walkthrough

Let's trace through `n=2` to build intuition. We're looking for the largest palindrome that's a product of two 2-digit numbers (10-99).

**Step 1: Determine the search range**

- Largest possible product: 99 × 99 = 9801
- Smallest possible product: 10 × 10 = 100

**Step 2: Generate palindromes in descending order**
We'll start from the largest possible palindrome ≤ 9801 and work downwards:

- 9779 (not a product of two 2-digit numbers)
- 9669 (not a product)
- 9559 (not a product)
- 9009 = 91 × 99 ✓

**Step 3: Verify the product**
We found 9009 = 91 × 99. Both are 2-digit numbers, so this is valid.

**Step 4: Return result modulo 1337**
9009 % 1337 = 9009 - (1337 × 6) = 9009 - 8022 = 987

The key insight: Instead of checking all possible products (which would be 90 × 90 = 8100 checks for n=2), we can generate palindromes in descending order and check if they can be factored into two n-digit numbers.

## Brute Force Approach

The most straightforward approach would be to:

1. Generate all products of two n-digit numbers
2. Check if each product is a palindrome
3. Track the maximum palindrome found

<div class="code-group">

```python
# Time: O(10^(2n) * n) | Space: O(1)
def largestPalindromeBrute(n):
    if n == 1:
        return 9

    upper = 10**n - 1  # e.g., 99 for n=2
    lower = 10**(n-1)  # e.g., 10 for n=2
    max_palindrome = 0

    # Try all possible pairs
    for i in range(upper, lower - 1, -1):
        for j in range(i, lower - 1, -1):  # j <= i to avoid duplicates
            product = i * j
            if product <= max_palindrome:
                break  # No need to check smaller j values

            # Check if product is palindrome
            s = str(product)
            if s == s[::-1]:
                max_palindrome = product

    return max_palindrome % 1337
```

```javascript
// Time: O(10^(2n) * n) | Space: O(1)
function largestPalindromeBrute(n) {
  if (n === 1) return 9;

  const upper = Math.pow(10, n) - 1; // e.g., 99 for n=2
  const lower = Math.pow(10, n - 1); // e.g., 10 for n=2
  let maxPalindrome = 0;

  // Try all possible pairs
  for (let i = upper; i >= lower; i--) {
    for (let j = i; j >= lower; j--) {
      // j <= i to avoid duplicates
      const product = i * j;
      if (product <= maxPalindrome) {
        break; // No need to check smaller j values
      }

      // Check if product is palindrome
      const s = product.toString();
      if (s === s.split("").reverse().join("")) {
        maxPalindrome = product;
      }
    }
  }

  return maxPalindrome % 1337;
}
```

```java
// Time: O(10^(2n) * n) | Space: O(1)
public int largestPalindromeBrute(int n) {
    if (n == 1) return 9;

    long upper = (long)Math.pow(10, n) - 1;  // e.g., 99 for n=2
    long lower = (long)Math.pow(10, n - 1);  // e.g., 10 for n=2
    long maxPalindrome = 0;

    // Try all possible pairs
    for (long i = upper; i >= lower; i--) {
        for (long j = i; j >= lower; j--) {  // j <= i to avoid duplicates
            long product = i * j;
            if (product <= maxPalindrome) {
                break;  // No need to check smaller j values
            }

            // Check if product is palindrome
            String s = Long.toString(product);
            if (s.equals(new StringBuilder(s).reverse().toString())) {
                maxPalindrome = product;
            }
        }
    }

    return (int)(maxPalindrome % 1337);
}
```

</div>

**Why this is too slow:**

- For n=3, we have 900 × 900 ≈ 810,000 products to check
- For n=4, we have 9,000 × 9,000 ≈ 81 million products
- For n=8, we have 90 million × 90 million ≈ 8.1 × 10¹⁵ products (impossible!)
- Each palindrome check takes O(n) time to reverse the string

## Optimized Approach

The key insight is to **reverse the search direction**. Instead of:

> Check all products → See if they're palindromes

We should:

> Generate palindromes in descending order → Check if they can be factored

**Why this works:**

1. There are far fewer palindromes than products
2. We can generate palindromes efficiently by taking the first half and mirroring it
3. We can stop as soon as we find a valid factorization

**Step-by-step reasoning:**

1. **Determine bounds**: The largest product is `(10^n - 1)²`
2. **Generate palindromes**: Start from the largest possible palindrome and work down
3. **Factor check**: For each palindrome `p`, check if there exists an n-digit number `x` such that:
   - `x` divides `p`
   - `p / x` is also an n-digit number
   - We only need to check `x` from `ceil(sqrt(p))` to `upper_bound`

**Mathematical optimization**:

- If a palindrome `p` has `2n` digits, we can construct it from its first half
- For example, for n=2, the largest palindrome is 99 × 99 = 9801 (4 digits)
- We generate 4-digit palindromes by taking numbers from 99 down to 10, mirroring them

## Optimal Solution

<div class="code-group">

```python
# Time: O(10^n) | Space: O(1)
def largestPalindrome(n):
    """
    Find the largest palindrome product of two n-digit numbers.

    Approach:
    1. Handle n=1 as a special case (largest palindrome is 9 = 3×3)
    2. For n>1, generate palindromes in descending order
    3. For each palindrome, check if it can be factored into two n-digit numbers
    4. Return the largest valid palindrome modulo 1337
    """
    # Special case: n=1
    if n == 1:
        return 9

    # Upper bound: largest n-digit number (e.g., 99 for n=2)
    upper = 10**n - 1
    # Lower bound: smallest n-digit number (e.g., 10 for n=2)
    lower = 10**(n - 1)

    # Generate palindromes in descending order
    # Start from the largest possible first half
    for first_half in range(upper, lower - 1, -1):
        # Build palindrome by mirroring the first half
        # Convert to string, reverse, and concatenate
        palindrome_str = str(first_half) + str(first_half)[::-1]
        palindrome = int(palindrome_str)

        # Check if this palindrome can be factored into two n-digit numbers
        # We only need to check divisors from sqrt(palindrome) to upper bound
        # because if a divisor exists, its pair will be ≤ sqrt(palindrome)
        for divisor in range(upper, int(palindrome**0.5) - 1, -1):
            # Check if divisor evenly divides the palindrome
            if palindrome % divisor == 0:
                # Check if the quotient is also an n-digit number
                quotient = palindrome // divisor
                if lower <= quotient <= upper:
                    # Found valid factorization
                    return palindrome % 1337

    # Fallback (should never reach here for valid n)
    return 0
```

```javascript
// Time: O(10^n) | Space: O(1)
function largestPalindrome(n) {
  /**
   * Find the largest palindrome product of two n-digit numbers.
   *
   * Approach:
   * 1. Handle n=1 as a special case (largest palindrome is 9 = 3×3)
   * 2. For n>1, generate palindromes in descending order
   * 3. For each palindrome, check if it can be factored into two n-digit numbers
   * 4. Return the largest valid palindrome modulo 1337
   */

  // Special case: n=1
  if (n === 1) {
    return 9;
  }

  // Upper bound: largest n-digit number (e.g., 99 for n=2)
  const upper = Math.pow(10, n) - 1;
  // Lower bound: smallest n-digit number (e.g., 10 for n=2)
  const lower = Math.pow(10, n - 1);

  // Generate palindromes in descending order
  // Start from the largest possible first half
  for (let firstHalf = upper; firstHalf >= lower; firstHalf--) {
    // Build palindrome by mirroring the first half
    const firstHalfStr = firstHalf.toString();
    const palindromeStr = firstHalfStr + firstHalfStr.split("").reverse().join("");
    const palindrome = BigInt(palindromeStr);

    // Check if this palindrome can be factored into two n-digit numbers
    // We only need to check divisors from sqrt(palindrome) to upper bound
    const sqrtPal = Math.floor(Math.sqrt(Number(palindrome)));
    const startDivisor = Math.min(upper, sqrtPal);

    for (let divisor = upper; divisor >= startDivisor; divisor--) {
      // Check if divisor evenly divides the palindrome
      if (palindrome % BigInt(divisor) === 0n) {
        // Check if the quotient is also an n-digit number
        const quotient = palindrome / BigInt(divisor);
        if (quotient >= BigInt(lower) && quotient <= BigInt(upper)) {
          // Found valid factorization
          return Number(palindrome % 1337n);
        }
      }
    }
  }

  // Fallback (should never reach here for valid n)
  return 0;
}
```

```java
// Time: O(10^n) | Space: O(1)
public int largestPalindrome(int n) {
    /**
     * Find the largest palindrome product of two n-digit numbers.
     *
     * Approach:
     * 1. Handle n=1 as a special case (largest palindrome is 9 = 3×3)
     * 2. For n>1, generate palindromes in descending order
     * 3. For each palindrome, check if it can be factored into two n-digit numbers
     * 4. Return the largest valid palindrome modulo 1337
     */

    // Special case: n=1
    if (n == 1) {
        return 9;
    }

    // Upper bound: largest n-digit number (e.g., 99 for n=2)
    long upper = (long)Math.pow(10, n) - 1;
    // Lower bound: smallest n-digit number (e.g., 10 for n=2)
    long lower = (long)Math.pow(10, n - 1);

    // Generate palindromes in descending order
    // Start from the largest possible first half
    for (long firstHalf = upper; firstHalf >= lower; firstHalf--) {
        // Build palindrome by mirroring the first half
        String firstHalfStr = Long.toString(firstHalf);
        String palindromeStr = firstHalfStr +
                              new StringBuilder(firstHalfStr).reverse().toString();
        long palindrome = Long.parseLong(palindromeStr);

        // Check if this palindrome can be factored into two n-digit numbers
        // We only need to check divisors from sqrt(palindrome) to upper bound
        long sqrtPal = (long)Math.sqrt(palindrome);
        long startDivisor = Math.min(upper, sqrtPal);

        for (long divisor = upper; divisor >= startDivisor; divisor--) {
            // Check if divisor evenly divides the palindrome
            if (palindrome % divisor == 0) {
                // Check if the quotient is also an n-digit number
                long quotient = palindrome / divisor;
                if (quotient >= lower && quotient <= upper) {
                    // Found valid factorization
                    return (int)(palindrome % 1337);
                }
            }
        }
    }

    // Fallback (should never reach here for valid n)
    return 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(10^n)**

- We iterate through possible first halves: `10^n - 10^(n-1)` ≈ `9 × 10^(n-1)` iterations
- For each palindrome, we check divisors from `upper` down to `sqrt(palindrome)`
- In the worst case, this is still O(10^n), but with a much smaller constant than brute force
- For n=8, this is ~90 million iterations instead of ~8 quintillion

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures are needed

**Why this is optimal:**

- We must at least generate and check palindromes, which requires O(10^n) time
- Any solution must examine potential palindromes, so this is asymptotically optimal
- The divisor check is optimized by starting from `sqrt(palindrome)` and going upwards

## Common Mistakes

1. **Not handling n=1 as a special case**: For n=1, the largest palindrome product is 9 (3×3), but our palindrome generation logic would produce 9×9=81, which is not a palindrome. Always check edge cases!

2. **Integer overflow**: For n=8, products can exceed 2³¹ - 1. In Java, use `long`; in Python, integers are arbitrary precision; in JavaScript, use `BigInt`.

3. **Inefficient palindrome generation**: Some candidates generate all numbers and check if they're palindromes using string reversal. This is O(10^(2n)) instead of O(10^n).

4. **Inefficient factorization check**: Checking all possible divisors from `lower` to `upper` is O(10^n) per palindrome. Starting from `sqrt(palindrome)` reduces this significantly.

5. **Forgetting the modulo operation**: The problem asks for the result modulo 1337. Apply the modulo at the end, not during intermediate calculations.

## When You'll See This Pattern

This "generate and validate" pattern appears in many optimization problems:

1. **Palindrome Number (LeetCode 9)**: Check if a number is a palindrome by reversing half of it.
2. **Next Palindrome Using Same Digits (LeetCode 564)**: Find the smallest palindrome larger than a given number.
3. **Prime Palindrome (LeetCode 866)**: Find the smallest prime palindrome greater than or equal to N.

The core technique is to **work backwards from the desired property** (in this case, being a palindrome) rather than checking all candidates for that property.

## Key Takeaways

1. **Reverse the search direction**: When looking for an object with specific properties, consider generating candidates that already have some properties and checking for the others.

2. **Exploit mathematical structure**: Palindromes have symmetry that allows efficient generation by mirroring halves.

3. **Optimize validation**: Once you have a candidate, use mathematical insights (like checking divisors from √n upwards) to validate it efficiently.

4. **Handle edge cases early**: Special cases like n=1 often break the general algorithm and should be handled separately.

[Practice this problem on CodeJeet](/problem/largest-palindrome-product)
