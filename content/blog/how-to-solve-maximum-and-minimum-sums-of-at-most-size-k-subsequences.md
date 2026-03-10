---
title: "How to Solve Maximum and Minimum Sums of at Most Size K Subsequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum and Minimum Sums of at Most Size K Subsequences. Medium difficulty, 21.6% acceptance rate. Topics: Array, Math, Dynamic Programming, Sorting, Combinatorics."
date: "2026-03-29"
category: "dsa-patterns"
tags:
  [
    "maximum-and-minimum-sums-of-at-most-size-k-subsequences",
    "array",
    "math",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Maximum and Minimum Sums of at Most Size K Subsequences

This problem asks us to find the sum of maximum elements plus the sum of minimum elements across all subsequences of size at most `k`. What makes this tricky is that we can't brute force all subsequences (there are 2^n possibilities), and we need to think combinatorically about how each element contributes to the final sum.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 1, 2]` with `k = 2`.

First, let's list all subsequences with at most 2 elements:

- Size 0: `[]` (no max/min, contributes 0)
- Size 1: `[3]`, `[1]`, `[2]`
  - Max elements: 3 + 1 + 2 = 6
  - Min elements: 3 + 1 + 2 = 6
- Size 2: `[3,1]`, `[3,2]`, `[1,2]`
  - Max elements: 3 + 3 + 2 = 8
  - Min elements: 1 + 2 + 1 = 4

Total max sum = 6 + 8 = 14  
Total min sum = 6 + 4 = 10  
Answer = 14 + 10 = 24

Now let's think smarter: For element `3`, when is it the maximum? When we pick it plus any subset of smaller elements (1, 2) of size at most k-1. Similarly, when is it the minimum? When we pick it plus any subset of larger elements of size at most k-1.

This leads to our key insight: **Sort the array first**. Then for each element at index `i`, it will be the maximum in subsequences where we choose it plus any subset of elements to its left (smaller elements). The number of such subsets is the number of ways to choose 0 to k-1 elements from the `i` elements to the left.

## Brute Force Approach

The brute force would generate all 2^n subsequences, filter those with size ≤ k, and sum their max and min elements. This is clearly O(2^n \* n) time, which fails for n > 20.

Even a slightly smarter brute force that tries all combinations of sizes 1 through k using combinations would be O(n^k), which is still exponential for k up to n.

The problem constraints (n up to 10^5) tell us we need an O(n log n) or O(n) solution.

## Optimized Approach

The key insight comes from two observations:

1. **Sorting doesn't change subsequence properties**: The max/min of a subsequence depends only on which elements are chosen, not their original order. Sorting helps us reason about "elements to the left are smaller."

2. **Combinatorial contribution**: After sorting, for element `nums[i]`:
   - It contributes `nums[i]` to the max-sum for every subsequence where it's the maximum
   - It contributes `nums[i]` to the min-sum for every subsequence where it's the minimum

For max-sum: Element `nums[i]` is the maximum if we include it and choose 0 to `min(k-1, i)` elements from the `i` elements before it (all smaller since sorted). Number of ways = sum of C(i, j) for j = 0 to min(k-1, i).

For min-sum: Similarly, `nums[i]` is the minimum if we include it and choose 0 to `min(k-1, n-i-1)` elements from the `n-i-1` elements after it (all larger since sorted).

We need to compute these combinatorial sums efficiently. The trick is to use **precomputed factorials and modular inverses** to compute combinations in O(1) time, and maintain a running sum of combinations.

## Optimal Solution

The algorithm:

1. Sort the array
2. Precompute factorials and inverse factorials modulo MOD
3. For each element `nums[i]`:
   - Compute how many subsequences where it's the maximum: sum of C(i, 0..min(k-1, i))
   - Compute how many subsequences where it's the minimum: sum of C(n-i-1, 0..min(k-1, n-i-1))
   - Add `nums[i] * (max_count + min_count)` to answer
4. Return answer modulo MOD

We compute the combinatorial sums efficiently using the property: C(n, r) = C(n, r-1) \* (n-r+1) / r

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for computation = O(n log n)
# Space: O(n) for factorial arrays
MOD = 10**9 + 7

def sumOfMaxAndMin(nums, k):
    n = len(nums)
    nums.sort()  # Sort to make combinatorial reasoning possible

    # Precompute factorials and inverse factorials modulo MOD
    fact = [1] * (n + 1)
    inv_fact = [1] * (n + 1)

    for i in range(1, n + 1):
        fact[i] = fact[i-1] * i % MOD

    # Fermat's little theorem for modular inverse: a^(MOD-2) ≡ a^(-1) mod MOD
    inv_fact[n] = pow(fact[n], MOD-2, MOD)
    for i in range(n-1, -1, -1):
        inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

    def nCr(n, r):
        """Compute combination C(n, r) modulo MOD in O(1)"""
        if r < 0 or r > n:
            return 0
        return fact[n] * inv_fact[r] % MOD * inv_fact[n-r] % MOD

    total = 0

    for i in range(n):
        # For max-sum: nums[i] is max when we choose it and 0..min(k-1, i) elements from left
        max_count = 0
        left_elements = i
        max_choices = min(k-1, left_elements)

        # Sum of C(left_elements, 0..max_choices)
        # We could compute this in O(max_choices) but we can do better
        # Actually, we need to compute this efficiently
        for j in range(max_choices + 1):
            max_count = (max_count + nCr(left_elements, j)) % MOD

        # For min-sum: nums[i] is min when we choose it and 0..min(k-1, n-i-1) elements from right
        min_count = 0
        right_elements = n - i - 1
        min_choices = min(k-1, right_elements)

        for j in range(min_choices + 1):
            min_count = (min_count + nCr(right_elements, j)) % MOD

        # Contribution of nums[i] = nums[i] * (number of subsequences where it's max + where it's min)
        contribution = nums[i] * (max_count + min_count) % MOD
        total = (total + contribution) % MOD

    return total
```

```javascript
// Time: O(n log n) for sorting + O(n) for computation = O(n log n)
// Space: O(n) for factorial arrays
const MOD = 10 ** 9 + 7;

function sumOfMaxAndMin(nums, k) {
  const n = nums.length;
  nums.sort((a, b) => a - b); // Sort ascending

  // Precompute factorials and inverse factorials
  const fact = new Array(n + 1).fill(1);
  const invFact = new Array(n + 1).fill(1);

  for (let i = 1; i <= n; i++) {
    fact[i] = (fact[i - 1] * i) % MOD;
  }

  // Modular inverse using Fermat's little theorem
  invFact[n] = modPow(fact[n], MOD - 2);
  for (let i = n - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;
  }

  function nCr(n, r) {
    if (r < 0 || r > n) return 0;
    return (((fact[n] * invFact[r]) % MOD) * invFact[n - r]) % MOD;
  }

  function modPow(a, b) {
    let result = 1;
    a %= MOD;
    while (b > 0) {
      if (b & 1) result = (result * a) % MOD;
      a = (a * a) % MOD;
      b >>= 1;
    }
    return result;
  }

  let total = 0;

  for (let i = 0; i < n; i++) {
    // Count subsequences where nums[i] is maximum
    let maxCount = 0;
    const leftElements = i;
    const maxChoices = Math.min(k - 1, leftElements);

    for (let j = 0; j <= maxChoices; j++) {
      maxCount = (maxCount + nCr(leftElements, j)) % MOD;
    }

    // Count subsequences where nums[i] is minimum
    let minCount = 0;
    const rightElements = n - i - 1;
    const minChoices = Math.min(k - 1, rightElements);

    for (let j = 0; j <= minChoices; j++) {
      minCount = (minCount + nCr(rightElements, j)) % MOD;
    }

    // Add contribution of nums[i]
    const contribution = (nums[i] * (maxCount + minCount)) % MOD;
    total = (total + contribution) % MOD;
  }

  return total;
}
```

```java
// Time: O(n log n) for sorting + O(n) for computation = O(n log n)
// Space: O(n) for factorial arrays
import java.util.Arrays;

class Solution {
    private static final int MOD = 1_000_000_007;

    public int sumOfMaxAndMin(int[] nums, int k) {
        int n = nums.length;
        Arrays.sort(nums);  // Sort ascending

        // Precompute factorials and inverse factorials
        long[] fact = new long[n + 1];
        long[] invFact = new long[n + 1];
        fact[0] = 1;

        for (int i = 1; i <= n; i++) {
            fact[i] = fact[i-1] * i % MOD;
        }

        // Modular inverse using Fermat's little theorem
        invFact[n] = modPow(fact[n], MOD - 2);
        for (int i = n - 1; i >= 0; i--) {
            invFact[i] = invFact[i+1] * (i+1) % MOD;
        }

        long total = 0;

        for (int i = 0; i < n; i++) {
            // Count subsequences where nums[i] is maximum
            long maxCount = 0;
            int leftElements = i;
            int maxChoices = Math.min(k - 1, leftElements);

            for (int j = 0; j <= maxChoices; j++) {
                maxCount = (maxCount + nCr(leftElements, j, fact, invFact)) % MOD;
            }

            // Count subsequences where nums[i] is minimum
            long minCount = 0;
            int rightElements = n - i - 1;
            int minChoices = Math.min(k - 1, rightElements);

            for (int j = 0; j <= minChoices; j++) {
                minCount = (minCount + nCr(rightElements, j, fact, invFact)) % MOD;
            }

            // Add contribution of nums[i]
            long contribution = (nums[i] * (maxCount + minCount)) % MOD;
            total = (total + contribution) % MOD;
        }

        return (int) total;
    }

    private long nCr(int n, int r, long[] fact, long[] invFact) {
        if (r < 0 || r > n) return 0;
        return fact[n] * invFact[r] % MOD * invFact[n-r] % MOD;
    }

    private long modPow(long a, long b) {
        long result = 1;
        a %= MOD;
        while (b > 0) {
            if ((b & 1) == 1) result = result * a % MOD;
            a = a * a % MOD;
            b >>= 1;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n + nk) in the implementation above, but can be optimized to O(n log n) with better combinatorial sum computation. The n log n comes from sorting. The nk comes from the inner loops summing combinations. For k up to n, this could be O(n²) worst case. We can optimize further using the recurrence C(n, r) = C(n, r-1) \* (n-r+1) / r to compute all needed combinations in O(n) total.

**Space Complexity:** O(n) for storing the factorial arrays. The sorting is typically O(log n) space for the algorithm's stack in most languages.

## Common Mistakes

1. **Forgetting to sort**: The combinatorial reasoning depends on knowing which elements are smaller/larger than the current element. Without sorting, you can't use the "choose from left/right" logic.

2. **Modulo arithmetic errors**: Forgetting to apply modulo after each multiplication or addition can cause overflow. In Python, integers don't overflow, but in Java/JavaScript, they do.

3. **Off-by-one in combination limits**: Using `k` instead of `k-1` when counting additional elements to choose. If we include the current element, we can only choose up to `k-1` more elements.

4. **Not handling empty subsequences**: The problem says "at most k elements," which includes empty subsequences. However, empty subsequences don't contribute to max/min sums since they have no elements.

## When You'll See This Pattern

This combinatorial contribution pattern appears in several problems:

1. **Sum of Subsequence Widths (LeetCode 891)**: Similar idea of sorting and computing each element's contribution based on its position as min/max in subsequences.

2. **Count of Smaller Numbers After Self (LeetCode 315)**: While different in implementation, it shares the theme of processing sorted elements and using combinatorial/data structure insights.

3. **Maximum Product of Subsequence Size K (variations)**: Problems asking for sum/products of subsequence extremes often use this sorted + combinatorial approach.

## Key Takeaways

1. **When dealing with subsequence extremes (min/max), sorting is your friend**: It transforms the problem from "which elements" to "how many elements before/after."

2. **Think in terms of contribution**: Instead of enumerating all subsequences, ask "how many subsequences is this element the max/min of?" This changes exponential problems to polynomial ones.

3. **Combinatorial sums can often be optimized**: While we used O(k) computation per element here, many problems allow O(1) computation using prefix sums or mathematical identities.

[Practice this problem on CodeJeet](/problem/maximum-and-minimum-sums-of-at-most-size-k-subsequences)
