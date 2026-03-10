---
title: "How to Solve Simplified Fractions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Simplified Fractions. Medium difficulty, 69.6% acceptance rate. Topics: Math, String, Number Theory."
date: "2028-09-25"
category: "dsa-patterns"
tags: ["simplified-fractions", "math", "string", "number-theory", "medium"]
---

# How to Solve Simplified Fractions

Given an integer `n`, we need to find all fractions between 0 and 1 (exclusive) where:

1. The denominator is ≤ n
2. The numerator is less than the denominator
3. The fraction is in its simplest form (numerator and denominator are coprime)

What makes this problem interesting is that it combines mathematical reasoning with algorithmic thinking. We can't just generate all possible fractions and simplify them—that would be too slow. Instead, we need to leverage number theory to efficiently generate only the simplified fractions.

## Visual Walkthrough

Let's trace through `n = 4` step by step:

**Step 1: Generate all possible denominators**
We consider denominators from 2 to 4 (denominator 1 would give us fractions 0/1 and 1/1, which are excluded since we need fractions between 0 and 1 exclusive).

**Step 2: For each denominator, find valid numerators**
For denominator = 2:

- Possible numerators: 1 (since 0 < numerator < denominator)
- Check if 1 and 2 are coprime: gcd(1, 2) = 1 ✓
- Add "1/2" to results

For denominator = 3:

- Possible numerators: 1, 2
- Check gcd(1, 3) = 1 ✓ → Add "1/3"
- Check gcd(2, 3) = 1 ✓ → Add "2/3"

For denominator = 4:

- Possible numerators: 1, 2, 3
- Check gcd(1, 4) = 1 ✓ → Add "1/4"
- Check gcd(2, 4) = 2 ✗ → Skip (not simplified)
- Check gcd(3, 4) = 1 ✓ → Add "3/4"

**Final result:** ["1/2", "1/3", "2/3", "1/4", "3/4"]

Notice that we skip fractions like 2/4 because they simplify to 1/2, which we've already included. This is why checking the greatest common divisor (GCD) is crucial.

## Brute Force Approach

A naive approach would be:

1. Generate all possible fractions with denominator ≤ n and numerator < denominator
2. For each fraction, check if it's simplified by verifying gcd(numerator, denominator) = 1
3. Add to results if simplified

While this approach is conceptually simple, it's actually optimal for this problem! The brute force approach here is O(n² log n) time complexity, which is acceptable for n ≤ 100 (the problem constraints). However, many candidates might try to optimize prematurely or make the solution more complex than necessary.

The key insight is that we need to check every possible (numerator, denominator) pair anyway, and checking GCD for each pair is efficient enough given the constraints.

## Optimized Approach

The optimal approach follows directly from our brute force reasoning:

1. **Iterate through all possible denominators** from 2 to n (inclusive)
2. **For each denominator, iterate through all possible numerators** from 1 to denominator-1
3. **Check if the fraction is simplified** by computing gcd(numerator, denominator)
4. **If gcd = 1**, format the fraction as "numerator/denominator" and add to results

The mathematical foundation here is that a fraction a/b is in simplest form if and only if gcd(a, b) = 1. This is a fundamental property of fractions that allows us to efficiently check simplification without actually performing division or creating floating-point numbers.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n² log n) - For n denominators, we check O(n) numerators each,
#                    and gcd computation takes O(log min(a,b)) time
# Space: O(n²) - In worst case, we store all simplified fractions
def simplifiedFractions(n):
    """
    Returns all simplified fractions between 0 and 1 (exclusive)
    with denominator ≤ n.
    """
    from math import gcd

    result = []

    # Iterate through all possible denominators from 2 to n
    # Denominator starts at 2 because denominator 1 would give
    # fractions 0/1 or 1/1, which are not between 0 and 1 exclusive
    for denominator in range(2, n + 1):
        # For each denominator, check all possible numerators
        # Numerator must be less than denominator for fraction < 1
        # Numerator must be > 0 for fraction > 0
        for numerator in range(1, denominator):
            # Check if fraction is in simplest form
            # A fraction is simplified if numerator and denominator
            # are coprime (gcd = 1)
            if gcd(numerator, denominator) == 1:
                # Format as string and add to results
                fraction = f"{numerator}/{denominator}"
                result.append(fraction)

    return result
```

```javascript
// Time: O(n² log n) - For n denominators, we check O(n) numerators each,
//                    and gcd computation takes O(log min(a,b)) time
// Space: O(n²) - In worst case, we store all simplified fractions
function simplifiedFractions(n) {
  /**
   * Returns all simplified fractions between 0 and 1 (exclusive)
   * with denominator ≤ n.
   */

  // Helper function to compute greatest common divisor
  // using Euclidean algorithm
  function gcd(a, b) {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  const result = [];

  // Iterate through all possible denominators from 2 to n
  // Denominator starts at 2 because denominator 1 would give
  // fractions 0/1 or 1/1, which are not between 0 and 1 exclusive
  for (let denominator = 2; denominator <= n; denominator++) {
    // For each denominator, check all possible numerators
    // Numerator must be less than denominator for fraction < 1
    // Numerator must be > 0 for fraction > 0
    for (let numerator = 1; numerator < denominator; numerator++) {
      // Check if fraction is in simplest form
      // A fraction is simplified if numerator and denominator
      // are coprime (gcd = 1)
      if (gcd(numerator, denominator) === 1) {
        // Format as string and add to results
        result.push(`${numerator}/${denominator}`);
      }
    }
  }

  return result;
}
```

```java
// Time: O(n² log n) - For n denominators, we check O(n) numerators each,
//                    and gcd computation takes O(log min(a,b)) time
// Space: O(n²) - In worst case, we store all simplified fractions
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> simplifiedFractions(int n) {
        /**
         * Returns all simplified fractions between 0 and 1 (exclusive)
         * with denominator ≤ n.
         */
        List<String> result = new ArrayList<>();

        // Iterate through all possible denominators from 2 to n
        // Denominator starts at 2 because denominator 1 would give
        // fractions 0/1 or 1/1, which are not between 0 and 1 exclusive
        for (int denominator = 2; denominator <= n; denominator++) {
            // For each denominator, check all possible numerators
            // Numerator must be less than denominator for fraction < 1
            // Numerator must be > 0 for fraction > 0
            for (int numerator = 1; numerator < denominator; numerator++) {
                // Check if fraction is in simplest form
                // A fraction is simplified if numerator and denominator
                // are coprime (gcd = 1)
                if (gcd(numerator, denominator) == 1) {
                    // Format as string and add to results
                    result.add(numerator + "/" + denominator);
                }
            }
        }

        return result;
    }

    // Helper method to compute greatest common divisor
    // using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² log n)**

- Outer loop runs O(n) times (denominators from 2 to n)
- Inner loop runs O(n) times in worst case (when denominator = n)
- For each pair, we compute gcd which takes O(log min(a,b)) time using Euclidean algorithm
- Total: O(n × n × log n) = O(n² log n)

**Space Complexity: O(n²)**

- We need to store all simplified fractions
- In worst case (when n is prime), we have approximately n(n-1)/2 fractions
- This simplifies to O(n²) space

## Common Mistakes

1. **Including fractions equal to 0 or 1**: The problem specifies fractions between 0 and 1 exclusive. Candidates might include 0/1 or 1/1 by starting the denominator loop at 1 instead of 2.

2. **Forgetting to check for simplification**: Some candidates generate all fractions without checking gcd, resulting in duplicates like 1/2 and 2/4 in the output.

3. **Inefficient gcd implementation**: While the Euclidean algorithm is optimal, some candidates might implement a slower gcd method or try to simplify fractions by checking divisibility by all numbers up to min(numerator, denominator).

4. **Incorrect loop boundaries**: The numerator should be strictly less than the denominator (numerator < denominator) to ensure fractions are less than 1. Using ≤ would include fractions equal to 1.

## When You'll See This Pattern

This problem combines mathematical reasoning with nested iteration—a pattern that appears in many number theory and combinatorial problems:

1. **Count Primes (LeetCode 204)**: Similar nested structure where you check each number up to n, though with a different mathematical property (primality instead of coprimality).

2. **Ugly Number II (LeetCode 264)**: Involves generating numbers with specific prime factors, requiring careful iteration and mathematical properties.

3. **Fraction to Recurring Decimal (LeetCode 166)**: Another fraction-related problem that requires understanding of mathematical properties of fractions and remainders.

The core pattern is: when dealing with mathematical properties of numbers (especially divisibility), consider using gcd computations and be mindful of the mathematical constraints.

## Key Takeaways

1. **Mathematical properties simplify algorithms**: Knowing that a fraction is simplified iff gcd(numerator, denominator) = 1 allows for an efficient O(log n) check instead of trying to actually simplify the fraction.

2. **Sometimes brute force is optimal**: For constrained problems (n ≤ 100 here), the straightforward O(n² log n) approach is acceptable. Don't overcomplicate solutions when constraints allow simpler approaches.

3. **Pay attention to boundary conditions**: The "between 0 and 1 exclusive" requirement affects both the starting denominator (must be ≥ 2) and the numerator range (1 to denominator-1).

[Practice this problem on CodeJeet](/problem/simplified-fractions)
