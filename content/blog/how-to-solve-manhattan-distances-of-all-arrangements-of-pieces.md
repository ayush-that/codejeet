---
title: "How to Solve Manhattan Distances of All Arrangements of Pieces — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Manhattan Distances of All Arrangements of Pieces. Hard difficulty, 35.1% acceptance rate. Topics: Math, Combinatorics."
date: "2026-09-19"
category: "dsa-patterns"
tags: ["manhattan-distances-of-all-arrangements-of-pieces", "math", "combinatorics", "hard"]
---

# How to Solve Manhattan Distances of All Arrangements of Pieces

This problem asks us to compute the sum of Manhattan distances between every pair of pieces across all possible arrangements of `k` identical pieces on an `m × n` grid. What makes this problem tricky is that we can't brute force through all arrangements (there are C(m×n, k) combinations, which grows exponentially), and we need to find a clever combinatorial way to compute the total distance without enumerating arrangements.

## Visual Walkthrough

Let's walk through a small example with `m=2`, `n=2`, `k=2` (a 2×2 grid with 2 pieces).

First, let's list all valid arrangements. There are C(4, 2) = 6 arrangements:

1. Pieces at (0,0) and (0,1): Manhattan distance = |0-0| + |0-1| = 1
2. Pieces at (0,0) and (1,0): distance = |0-1| + |0-0| = 1
3. Pieces at (0,0) and (1,1): distance = |0-1| + |0-1| = 2
4. Pieces at (0,1) and (1,0): distance = |0-1| + |1-0| = 2
5. Pieces at (0,1) and (1,1): distance = |0-1| + |1-1| = 1
6. Pieces at (1,0) and (1,1): distance = |1-1| + |0-1| = 1

Sum of distances = 1+1+2+2+1+1 = 8

Now, here's the key insight: Instead of thinking about arrangements, think about pairs of cells. For any two distinct cells (x₁,y₁) and (x₂,y₂), how many arrangements contain both these cells? If we fix these two cells as having pieces, we need to place the remaining k-2 pieces in the remaining m×n-2 cells. So there are C(m×n-2, k-2) arrangements containing this specific pair.

The Manhattan distance between these cells is |x₁-x₂| + |y₁-y₂|. So the contribution of this pair to the total sum is: distance × C(m×n-2, k-2).

Therefore, the total sum = C(m×n-2, k-2) × Σ[all pairs of distinct cells] (|x₁-x₂| + |y₁-y₂|)

We can separate the x and y components: total = C(m×n-2, k-2) × [Σ(all pairs) |x₁-x₂| + Σ(all pairs) |y₁-y₂|]

Now we just need to compute Σ(all pairs) |x₁-x₂| for x-coordinates and similarly for y-coordinates.

## Brute Force Approach

The most naive approach would be to:

1. Generate all combinations of k cells from m×n cells
2. For each arrangement, compute sum of Manhattan distances between all pairs
3. Sum all these values

However, this is completely infeasible. The number of arrangements is C(m×n, k), which for m=n=50 and k=25 is astronomically large (~10^29). Even for small grids, this approach fails quickly.

A slightly better but still insufficient approach would be to iterate through all pairs of cells and count their contribution, as described in the visual walkthrough. But computing Σ(all pairs) |x₁-x₂| by iterating through all O((m×n)²) pairs is still too slow when m and n can be up to 10^5.

## Optimized Approach

The key optimization is computing Σ(all pairs) |x₁-x₂| efficiently. For x-coordinates, we have m possible values (0 to m-1). Let's sort the x-coordinates we're considering. Actually, we don't need to sort - we can use the fact that for coordinate x, the sum of distances to all coordinates less than x is: count_less × x - sum_less, where count_less is how many coordinates are less than x, and sum_less is the sum of those coordinates.

But wait - we're not dealing with actual pieces placed, we're dealing with all possible cells. For x-coordinates, each x appears n times (once for each y from 0 to n-1). So for coordinate value x, there are n cells with that x-coordinate.

So we can compute:
Σ(all pairs) |x₁-x₂| = Σ*{i=0}^{m-1} Σ*{j=0}^{m-1} n² × |i-j| for i≠j, but actually we need to be careful because for each pair of x-values (i,j), there are n choices for y₁ and n choices for y₂, so n² pairs of cells with those x-values.

Actually simpler: Let's think about all ordered pairs of cells (cell1, cell2) with cell1 ≠ cell2. There are m×n × (m×n-1) such ordered pairs. For each such pair, we add |x₁-x₂| to the sum.

We can compute this as: For each possible x₁, for each possible x₂ ≠ x₁, there are n choices for y₁ and n choices for y₂, so n² contributions of |x₁-x₂|.

So: Σ(all ordered pairs) |x₁-x₂| = n² × Σ*{i=0}^{m-1} Σ*{j=0}^{m-1, j≠i} |i-j|

We can simplify further: Σ*{i=0}^{m-1} Σ*{j=0}^{m-1, j≠i} |i-j| = 2 × Σ*{i=0}^{m-1} Σ*{j=i+1}^{m-1} (j-i) because |i-j| = |j-i| and we can just consider i<j.

And Σ*{j=i+1}^{m-1} (j-i) = Σ*{d=1}^{m-1-i} d = (m-1-i)(m-i)/2

So Σ*{i=0}^{m-1} Σ*{j=i+1}^{m-1} (j-i) = Σ\_{i=0}^{m-1} (m-1-i)(m-i)/2

This can be computed in O(m) time. Similarly for y-coordinates.

## Optimal Solution

The complete solution:

1. Compute combinations C(a,b) modulo MOD = 10^9+7 using precomputed factorials
2. Compute total*x = n² × Σ*{i=0}^{m-1} Σ\_{j=i+1}^{m-1} (j-i)
3. Compute total*y = m² × Σ*{i=0}^{n-1} Σ\_{j=i+1}^{n-1} (j-i)
4. Total sum = C(m×n-2, k-2) × (total_x + total_y) mod MOD
5. Handle edge cases: if k < 2, return 0 (no pairs)

<div class="code-group">

```python
MOD = 10**9 + 7

class Solution:
    def sumDistance(self, m: int, n: int, k: int) -> int:
        # Time: O(m + n) for computing sums, O(m*n) for precomputing factorials
        # Space: O(m*n) for storing factorials and inverse factorials

        # Edge case: if k < 2, there are no pairs of pieces
        if k < 2:
            return 0

        # Precompute factorials and inverse factorials up to m*n
        max_val = m * n
        fact = [1] * (max_val + 1)
        inv_fact = [1] * (max_val + 1)

        # Compute factorials modulo MOD
        for i in range(2, max_val + 1):
            fact[i] = fact[i-1] * i % MOD

        # Compute inverse factorials using Fermat's Little Theorem
        # inv_fact[max_val] = fact[max_val]^(MOD-2) mod MOD
        inv_fact[max_val] = pow(fact[max_val], MOD-2, MOD)
        for i in range(max_val-1, -1, -1):
            inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

        def comb(a, b):
            """Compute C(a,b) modulo MOD using precomputed factorials"""
            if b < 0 or b > a:
                return 0
            return fact[a] * inv_fact[b] % MOD * inv_fact[a-b] % MOD

        # Compute sum of x-coordinate differences
        # For each pair of distinct x-values (i,j), there are n choices for y1 and n choices for y2
        # So total_x = n^2 * sum_{i=0}^{m-1} sum_{j=i+1}^{m-1} (j-i)
        total_x = 0
        for i in range(m):
            # For fixed i, sum_{j=i+1}^{m-1} (j-i) = sum_{d=1}^{m-1-i} d = (m-1-i)*(m-i)//2
            total_x += (m - 1 - i) * (m - i) // 2
        total_x = total_x * (n * n) % MOD

        # Compute sum of y-coordinate differences similarly
        total_y = 0
        for i in range(n):
            total_y += (n - 1 - i) * (n - i) // 2
        total_y = total_y * (m * m) % MOD

        # Total sum of distances for all ordered pairs of distinct cells
        total_pairs_distance = (total_x + total_y) % MOD

        # Each unordered pair of cells appears in C(m*n-2, k-2) arrangements
        arrangements_with_pair = comb(m * n - 2, k - 2)

        # Final result: sum over all arrangements
        result = total_pairs_distance * arrangements_with_pair % MOD

        return result
```

```javascript
const MOD = 1000000007n;

/**
 * @param {number} m
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var sumDistance = function (m, n, k) {
  // Time: O(m + n) for computing sums, O(m*n) for precomputing factorials
  // Space: O(m*n) for storing factorials and inverse factorials

  // Edge case: if k < 2, there are no pairs of pieces
  if (k < 2) {
    return 0;
  }

  // Precompute factorials and inverse factorials up to m*n
  const maxVal = m * n;
  const fact = new Array(maxVal + 1).fill(1n);
  const invFact = new Array(maxVal + 1).fill(1n);

  // Compute factorials modulo MOD
  for (let i = 2; i <= maxVal; i++) {
    fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
  }

  // Compute inverse factorials using Fermat's Little Theorem
  // invFact[maxVal] = fact[maxVal]^(MOD-2) mod MOD
  invFact[maxVal] = modPow(fact[maxVal], MOD - 2n);
  for (let i = maxVal - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;
  }

  // Helper function for modular exponentiation
  function modPow(base, exp) {
    let result = 1n;
    base = base % MOD;
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % MOD;
      }
      base = (base * base) % MOD;
      exp = exp >> 1n;
    }
    return result;
  }

  // Helper function for combinations C(a,b)
  function comb(a, b) {
    if (b < 0 || b > a) {
      return 0n;
    }
    return (((fact[a] * invFact[b]) % MOD) * invFact[a - b]) % MOD;
  }

  // Compute sum of x-coordinate differences
  // total_x = n^2 * sum_{i=0}^{m-1} sum_{j=i+1}^{m-1} (j-i)
  let totalX = 0n;
  for (let i = 0; i < m; i++) {
    // For fixed i, sum_{j=i+1}^{m-1} (j-i) = (m-1-i)*(m-i)//2
    totalX += BigInt(((m - 1 - i) * (m - i)) / 2);
  }
  totalX = (totalX * BigInt(n * n)) % MOD;

  // Compute sum of y-coordinate differences similarly
  let totalY = 0n;
  for (let i = 0; i < n; i++) {
    totalY += BigInt(((n - 1 - i) * (n - i)) / 2);
  }
  totalY = (totalY * BigInt(m * m)) % MOD;

  // Total sum of distances for all ordered pairs of distinct cells
  const totalPairsDistance = (totalX + totalY) % MOD;

  // Each unordered pair of cells appears in C(m*n-2, k-2) arrangements
  const arrangementsWithPair = comb(m * n - 2, k - 2);

  // Final result: sum over all arrangements
  const result = (totalPairsDistance * arrangementsWithPair) % MOD;

  return Number(result);
};
```

```java
class Solution {
    private static final int MOD = 1000000007;

    public int sumDistance(int m, int n, int k) {
        // Time: O(m + n) for computing sums, O(m*n) for precomputing factorials
        // Space: O(m*n) for storing factorials and inverse factorials

        // Edge case: if k < 2, there are no pairs of pieces
        if (k < 2) {
            return 0;
        }

        // Precompute factorials and inverse factorials up to m*n
        int maxVal = m * n;
        long[] fact = new long[maxVal + 1];
        long[] invFact = new long[maxVal + 1];
        fact[0] = 1;
        fact[1] = 1;

        // Compute factorials modulo MOD
        for (int i = 2; i <= maxVal; i++) {
            fact[i] = fact[i-1] * i % MOD;
        }

        // Compute inverse factorials using Fermat's Little Theorem
        // invFact[maxVal] = fact[maxVal]^(MOD-2) mod MOD
        invFact[maxVal] = modPow(fact[maxVal], MOD - 2);
        for (int i = maxVal - 1; i >= 0; i--) {
            invFact[i] = invFact[i+1] * (i+1) % MOD;
        }

        // Helper function for combinations C(a,b)
        long arrangementsWithPair = comb(maxVal - 2, k - 2, fact, invFact);

        // Compute sum of x-coordinate differences
        // total_x = n^2 * sum_{i=0}^{m-1} sum_{j=i+1}^{m-1} (j-i)
        long totalX = 0;
        for (int i = 0; i < m; i++) {
            // For fixed i, sum_{j=i+1}^{m-1} (j-i) = (m-1-i)*(m-i)//2
            totalX += (long)(m - 1 - i) * (m - i) / 2;
        }
        totalX = totalX % MOD * ((long)n * n % MOD) % MOD;

        // Compute sum of y-coordinate differences similarly
        long totalY = 0;
        for (int i = 0; i < n; i++) {
            totalY += (long)(n - 1 - i) * (n - i) / 2;
        }
        totalY = totalY % MOD * ((long)m * m % MOD) % MOD;

        // Total sum of distances for all ordered pairs of distinct cells
        long totalPairsDistance = (totalX + totalY) % MOD;

        // Final result: sum over all arrangements
        long result = totalPairsDistance * arrangementsWithPair % MOD;

        return (int)result;
    }

    private long modPow(long base, int exp) {
        long result = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) {
                result = result * base % MOD;
            }
            base = base * base % MOD;
            exp >>= 1;
        }
        return result;
    }

    private long comb(int a, int b, long[] fact, long[] invFact) {
        if (b < 0 || b > a) {
            return 0;
        }
        return fact[a] * invFact[b] % MOD * invFact[a-b] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + n + m×n)

- O(m×n) for precomputing factorials and inverse factorials up to m×n
- O(m) for computing the sum of x-coordinate differences
- O(n) for computing the sum of y-coordinate differences
- Total: O(m×n) dominates, but note that m×n can be up to 10^5×10^5 = 10^10 in theory, which is too large. In practice, constraints would likely limit m×n to ~10^5.

**Space Complexity:** O(m×n) for storing the factorial and inverse factorial arrays.

## Common Mistakes

1. **Not handling k < 2 case**: When k is 0 or 1, there are no pairs of pieces, so the answer should be 0. Forgetting this leads to incorrect combinatorial calculations.

2. **Integer overflow in intermediate calculations**: When m and n are large (up to 10^5), terms like (m-1-i)\*(m-i) can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, BigInt in JavaScript) for intermediate calculations.

3. **Incorrect combinatorial factor**: The number of arrangements containing a specific pair of cells is C(m×n-2, k-2), not C(m×n, k). This is a subtle but critical distinction - we're fixing 2 cells to have pieces and choosing the remaining k-2 from the remaining m×n-2 cells.

4. **Modulo arithmetic errors**: When working with modulo 10^9+7, ensure all multiplications are done modulo MOD to prevent overflow. Also, division requires computing modular inverses using Fermat's Little Theorem (pow(x, MOD-2, MOD)).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Combinatorial counting with symmetry**: Similar to problems where you count pairs or arrangements without enumerating them, like:
   - "Count Ways to Build Rooms in an Ant Colony" (LeetCode 1916) - uses combinatorial counting
   - "Number of Ways to Rearrange Sticks With K Sticks Visible" (LeetCode 1866) - combinatorial DP

2. **Sum of absolute differences**: The technique for computing Σ|a_i - a_j| efficiently appears in:
   - "Minimum Absolute Difference Queries" (LeetCode 1906) - though simpler
   - "Sum of Absolute Differences in a Sorted Array" (LeetCode 1685) - directly uses the prefix sum technique

3. **Modular combinatorics**: Problems requiring C(n,k) modulo prime appear frequently:
   - "Number of Ways to Divide a Long Corridor" (LeetCode 2147)
   - "Count Anagrams" (LeetCode 2514)

## Key Takeaways

1. **Think about contributions, not enumerations**: When asked to sum over all arrangements/combinations, often each element/pair contributes independently. Count how many arrangements include each element/pair, then sum their contributions.

2. **Separate independent dimensions**: Manhattan distance |x₁-x₂| + |y₁-y₂| lets us compute x and y contributions separately, simplifying the problem.

3. **Optimize sum of absolute differences**: For sorted values a₁ ≤ a₂ ≤ ... ≤ aₙ, Σ\_{i<j} |a_i - a_j| can be computed in O(n) using prefix sums: for each a_i, contribution = i×a_i - prefix_sum[i].

[Practice this problem on CodeJeet](/problem/manhattan-distances-of-all-arrangements-of-pieces)
