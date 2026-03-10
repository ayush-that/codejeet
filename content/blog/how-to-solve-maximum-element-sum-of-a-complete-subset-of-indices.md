---
title: "How to Solve Maximum Element-Sum of a Complete Subset of Indices — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Element-Sum of a Complete Subset of Indices. Hard difficulty, 42.7% acceptance rate. Topics: Array, Math, Number Theory."
date: "2026-06-09"
category: "dsa-patterns"
tags:
  ["maximum-element-sum-of-a-complete-subset-of-indices", "array", "math", "number-theory", "hard"]
---

# How to Solve Maximum Element-Sum of a Complete Subset of Indices

This problem asks us to find the maximum sum we can obtain by selecting indices from a 1-indexed array, with the constraint that for any two selected indices `i` and `j`, their product `i * j` must be a perfect square. The challenge lies in identifying which indices can be grouped together based on this mathematical property, rather than simply checking all combinations.

## Visual Walkthrough

Let's trace through a small example: `nums = [10, 15, 20, 25, 30]` (indices 1 through 5).

We need to understand which indices can be selected together. The rule says: for any two selected indices `i` and `j`, `i * j` must be a perfect square.

Let's check some pairs:

- Indices 1 and 4: `1 * 4 = 4` (perfect square ✓)
- Indices 2 and 8: `2 * 8 = 16` (perfect square ✓)
- Indices 2 and 3: `2 * 3 = 6` (not a perfect square ✗)

The key insight is that we can factor each index into its prime factorization and look at the parity (odd/even) of exponents. For `i * j` to be a perfect square, every prime factor must have an even total exponent in the product.

Let's factor our indices:

- Index 1: 1 (no prime factors)
- Index 2: 2¹
- Index 3: 3¹
- Index 4: 2²
- Index 5: 5¹

Now, for two indices to multiply to a perfect square, their "odd exponent parts" must cancel. We can represent each index by its "square-free part" - the product of primes with odd exponents.

Let's calculate:

- Index 1: square-free part = 1
- Index 2: square-free part = 2 (exponent 1 is odd)
- Index 3: square-free part = 3
- Index 4: square-free part = 1 (exponent 2 is even, so no odd part)
- Index 5: square-free part = 5

Now the rule becomes clear: two indices can be in the same subset if and only if they have the same square-free part! Because if `i = a² * x` and `j = b² * x` (where x is square-free), then `i * j = (a*b)² * x²` which is a perfect square.

So our groups are:

- Group 1 (square-free part = 1): indices 1, 4
- Group 2 (square-free part = 2): index 2
- Group 3 (square-free part = 3): index 3
- Group 4 (square-free part = 5): index 5

We can take all indices from any group. The sums would be:

- Group 1: nums[0] + nums[3] = 10 + 25 = 35
- Group 2: nums[1] = 15
- Group 3: nums[2] = 20
- Group 4: nums[4] = 30

The maximum is 35 from group 1.

## Brute Force Approach

A naive approach would be to try all possible subsets of indices (2ⁿ possibilities) and check if each subset satisfies the condition. For each subset, we'd need to check all pairs of indices (O(k²) for subset size k) to ensure `i * j` is always a perfect square.

The checking can be done by computing `sqrt(i * j)` and verifying it's an integer, or by checking if `i * j == (int(sqrt(i * j)))²`.

This approach has exponential time complexity O(2ⁿ \* n²), which is completely impractical for n up to 10⁴ (as typical in LeetCode constraints). Even for n=20, we'd have over a million subsets to check.

## Optimized Approach

The key mathematical insight is that `i * j` is a perfect square if and only if `i` and `j` have the same square-free part.

**What is a square-free part?**
Every positive integer can be uniquely expressed as `a² * x`, where `x` is square-free (no prime factor appears more than once). The square-free part `x` is obtained by:

1. Prime factorizing the number
2. Taking each prime factor with its exponent modulo 2 (odd exponents become 1, even become 0)
3. Multiplying these reduced prime factors together

For example:

- 12 = 2² _ 3¹ → square-free part = 2⁰ _ 3¹ = 3
- 18 = 2¹ _ 3² → square-free part = 2¹ _ 3⁰ = 2
- 36 = 2² _ 3² → square-free part = 2⁰ _ 3⁰ = 1

**Why does this work?**
If `i = a² * x` and `j = b² * x` (same square-free part x), then:
`i * j = (a² * x) * (b² * x) = (a * b)² * x² = (a * b * x)²` which is a perfect square.

Conversely, if `i` and `j` have different square-free parts, their product will have some prime with an odd exponent, so it won't be a perfect square.

**Algorithm:**

1. For each index i (1-indexed), compute its square-free part
2. Group indices by their square-free part
3. For each group, sum the corresponding nums values
4. Return the maximum sum

**Efficient computation of square-free part:**
We can compute the square-free part by dividing out all perfect square factors. For each index i, we iterate through perfect squares that divide i.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n√n) | Space: O(n)
def maximumSum(nums):
    """
    Find the maximum sum of a complete subset of indices.
    A complete subset requires that for any two indices i, j in the subset,
    i * j is a perfect square.
    """
    n = len(nums)
    max_sum = 0

    # We'll process each index from 1 to n (1-indexed)
    for i in range(1, n + 1):
        # Calculate the square-free part of i
        # Start with i, then divide out all perfect square factors
        current = i
        divisor = 2

        # Remove all square factors
        while divisor * divisor <= current:
            # While divisor² divides current, divide it out
            while current % (divisor * divisor) == 0:
                current //= (divisor * divisor)
            divisor += 1

        # Now current is the square-free part of i
        square_free = current

        # Sum all elements whose indices have this same square-free part
        current_sum = 0
        # Check all multiples of square_free that are ≤ n
        # Because if j = k² * square_free, then j has the same square-free part
        k = 1
        while square_free * k * k <= n:
            idx = square_free * k * k
            # Add the value at this index (convert to 0-indexed)
            current_sum += nums[idx - 1]
            k += 1

        # Update maximum sum
        max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n√n) | Space: O(n)
function maximumSum(nums) {
  /**
   * Find the maximum sum of a complete subset of indices.
   * A complete subset requires that for any two indices i, j in the subset,
   * i * j is a perfect square.
   */
  const n = nums.length;
  let maxSum = 0;

  // Process each index from 1 to n (1-indexed)
  for (let i = 1; i <= n; i++) {
    // Calculate the square-free part of i
    // Start with i, then divide out all perfect square factors
    let current = i;
    let divisor = 2;

    // Remove all square factors
    while (divisor * divisor <= current) {
      // While divisor² divides current, divide it out
      while (current % (divisor * divisor) === 0) {
        current = Math.floor(current / (divisor * divisor));
      }
      divisor++;
    }

    // Now current is the square-free part of i
    const squareFree = current;

    // Sum all elements whose indices have this same square-free part
    let currentSum = 0;
    // Check all multiples of squareFree that are ≤ n
    // Because if j = k² * squareFree, then j has the same square-free part
    let k = 1;
    while (squareFree * k * k <= n) {
      const idx = squareFree * k * k;
      // Add the value at this index (convert to 0-indexed)
      currentSum += nums[idx - 1];
      k++;
    }

    // Update maximum sum
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

```java
// Time: O(n√n) | Space: O(n)
class Solution {
    public long maximumSum(List<Integer> nums) {
        /**
         * Find the maximum sum of a complete subset of indices.
         * A complete subset requires that for any two indices i, j in the subset,
         * i * j is a perfect square.
         */
        int n = nums.size();
        long maxSum = 0;

        // Process each index from 1 to n (1-indexed)
        for (int i = 1; i <= n; i++) {
            // Calculate the square-free part of i
            // Start with i, then divide out all perfect square factors
            int current = i;
            int divisor = 2;

            // Remove all square factors
            while (divisor * divisor <= current) {
                // While divisor² divides current, divide it out
                while (current % (divisor * divisor) == 0) {
                    current /= (divisor * divisor);
                }
                divisor++;
            }

            // Now current is the square-free part of i
            int squareFree = current;

            // Sum all elements whose indices have this same square-free part
            long currentSum = 0;
            // Check all multiples of squareFree that are ≤ n
            // Because if j = k² * squareFree, then j has the same square-free part
            int k = 1;
            while (squareFree * k * k <= n) {
                int idx = squareFree * k * k;
                // Add the value at this index (convert to 0-indexed)
                currentSum += nums.get(idx - 1);
                k++;
            }

            // Update maximum sum
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n√n)**

- Outer loop runs n times (for each index i from 1 to n)
- For each i, we compute its square-free part in O(√i) time by checking divisors up to √i
- Then we sum all indices with the same square-free part. In the worst case, when square-free part = 1, we sum about √n elements (since we go through k where k² ≤ n)
- Total: O(n \* √n) = O(n√n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- The input array is not counted toward space complexity

## Common Mistakes

1. **Forgetting 1-indexing**: The problem states indices are 1-indexed, but arrays in most languages are 0-indexed. Forgetting to convert between these will lead to accessing wrong elements or index out of bounds errors.

2. **Inefficient square-free computation**: Some candidates try to compute square-free part by fully prime factorizing each number, which is O(n log n) with sieve preprocessing. While this works, the divisor method shown is simpler and sufficient for constraints.

3. **Not understanding the grouping condition**: The most common conceptual mistake is thinking you need to check all pairs in a potential subset. The square-free part insight is crucial - without it, the problem seems intractable.

4. **Integer overflow**: When n is large (up to 10⁴), sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C) for accumulation.

## When You'll See This Pattern

This problem combines number theory with grouping/aggregation patterns. You'll see similar approaches in:

1. **Count Primes (LeetCode 204)**: Also uses divisor iteration up to √n for primality testing.
2. **Ugly Number II (LeetCode 264)**: Involves number properties and factorization.
3. **Perfect Squares (LeetCode 279)**: Deals with square numbers and their properties.
4. **Group Anagrams (LeetCode 49)**: Uses a similar grouping strategy but with string character counts as the key instead of square-free parts.

The core pattern is: when a constraint involves a mathematical property of pairs (like i\*j being a perfect square), look for an invariant that allows grouping elements. Compute this invariant for each element, then group by it.

## Key Takeaways

1. **Mathematical constraints often simplify to grouping problems**: When you see "for all pairs in a subset must satisfy X", look for an equivalence relation that lets you group elements. The square-free part creates such equivalence classes.

2. **Square-free parts are useful for perfect square problems**: The concept of removing all square factors from a number appears in many number theory problems. Remember: i\*j is a perfect square iff i and j have the same square-free part.

3. **1-indexing requires careful conversion**: Always double-check whether indices in the problem statement are 0-based or 1-based, and convert appropriately when accessing array elements.

Related problems: [Constrained Subsequence Sum](/problem/constrained-subsequence-sum), [Maximum Alternating Subsequence Sum](/problem/maximum-alternating-subsequence-sum)
