---
title: "How to Solve Distribute Candies Among Children II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Distribute Candies Among Children II. Medium difficulty, 55.7% acceptance rate. Topics: Math, Combinatorics, Enumeration."
date: "2027-05-16"
category: "dsa-patterns"
tags: ["distribute-candies-among-children-ii", "math", "combinatorics", "enumeration", "medium"]
---

## How to Solve Distribute Candies Among Children II

You need to distribute `n` candies among 3 children with a maximum of `limit` candies per child. The challenge is counting all valid distributions efficiently when `n` and `limit` can be up to 10⁶. The interesting twist is that while the problem seems like simple enumeration, brute force fails at large inputs, requiring combinatorial reasoning with inclusion-exclusion.

## Visual Walkthrough

Let's trace through `n = 5, limit = 3` manually. We need to count integer solutions to:

```
x₁ + x₂ + x₃ = 5
0 ≤ xᵢ ≤ 3 for i = 1,2,3
```

We can enumerate systematically:

- Child 1 gets 0: Then x₂ + x₃ = 5. But max per child is 3, so impossible (max sum would be 3+3=6, but 5>6? Wait, 5≤6, so possible combinations: (2,3), (3,2) → 2 ways)
- Child 1 gets 1: Then x₂ + x₃ = 4. Valid pairs where each ≤3: (1,3), (2,2), (3,1) → 3 ways
- Child 1 gets 2: Then x₂ + x₃ = 3. Valid pairs: (0,3), (1,2), (2,1), (3,0) → 4 ways
- Child 1 gets 3: Then x₂ + x₃ = 2. Valid pairs: (0,2), (1,1), (2,0) → 3 ways

Total: 2 + 3 + 4 + 3 = 12 valid distributions.

This enumeration approach works for small values but becomes O(n²) if we check all possibilities for two children. For `n` up to 10⁶, we need a mathematical approach.

## Brute Force Approach

The naive solution would try all possible candies for each child:

```python
def brute_force(n, limit):
    count = 0
    for a in range(min(n, limit) + 1):
        for b in range(min(n - a, limit) + 1):
            c = n - a - b
            if 0 <= c <= limit:
                count += 1
    return count
```

This runs in O(n²) time since for each `a`, we iterate through possible `b` values. With `n` up to 10⁶, this would take ~10¹² operations — far too slow. Even optimizing the inner loop with min/max bounds still leaves O(n²) worst case.

## Optimized Approach

The key insight is to use combinatorial formulas with inclusion-exclusion. The total number of non-negative integer solutions to `x₁ + x₂ + x₃ = n` without the limit constraint is given by the stars-and-bars formula: `C(n + 2, 2)`.

Now we subtract cases where at least one child exceeds `limit`. Let `Aᵢ` be the set of distributions where child `i` gets more than `limit` candies. By inclusion-exclusion:

Total valid ways = Total ways - |A₁ ∪ A₂ ∪ A₃|
= C(n+2, 2) - (|A₁| + |A₂| + |A₃|) + (|A₁∩A₂| + |A₁∩A₃| + |A₂∩A₃|) - |A₁∩A₂∩A₃|

By symmetry, all single-child violations are equal, all two-child violations are equal, etc.

To count |A₁| (child 1 gets > limit): Let y₁ = x₁ - (limit+1) ≥ 0. Then:
y₁ + x₂ + x₃ = n - (limit+1)
Number of solutions: C(n - (limit+1) + 2, 2) if n ≥ limit+1, else 0.

Similarly, for |A₁∩A₂| (both child 1 and 2 exceed limit):
Let y₁ = x₁ - (limit+1) ≥ 0, y₂ = x₂ - (limit+1) ≥ 0
Then: y₁ + y₂ + x₃ = n - 2(limit+1)
Solutions: C(n - 2(limit+1) + 2, 2) if n ≥ 2(limit+1), else 0.

For |A₁∩A₂∩A₃|: All three exceed limit:
y₁ + y₂ + y₃ = n - 3(limit+1)
Solutions: C(n - 3(limit+1) + 2, 2) if n ≥ 3(limit+1), else 0.

The formula becomes:

```
ways = C(n+2,2) - 3*C(n-limit-1+2,2) + 3*C(n-2*limit-2+2,2) - C(n-3*limit-3+2,2)
```

Where C(x,2) = 0 if x < 2.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def distributeCandies(n: int, limit: int) -> int:
    # Helper function to compute combinations C(k, 2) safely
    def comb2(k: int) -> int:
        # C(k, 2) = k*(k-1)//2, but return 0 if k < 2
        return max(0, k * (k - 1) // 2)

    # Total ways without limits: C(n+2, 2)
    total = comb2(n + 2)

    # Subtract cases where at least one child exceeds limit
    # Single child violations (3 symmetric cases)
    if n >= limit + 1:
        total -= 3 * comb2(n - limit - 1 + 2)

    # Add back cases where at least two children exceed limit
    # (inclusion-exclusion correction)
    if n >= 2 * (limit + 1):
        total += 3 * comb2(n - 2 * limit - 2 + 2)

    # Subtract cases where all three exceed limit
    if n >= 3 * (limit + 1):
        total -= comb2(n - 3 * limit - 3 + 2)

    return total
```

```javascript
// Time: O(1) | Space: O(1)
function distributeCandies(n, limit) {
  // Helper to compute combinations C(k, 2) safely
  const comb2 = (k) => {
    // C(k, 2) = k*(k-1)/2, but return 0 if k < 2
    return Math.max(0, (k * (k - 1)) / 2);
  };

  // Total ways without limits: C(n+2, 2)
  let total = comb2(n + 2);

  // Subtract cases where at least one child exceeds limit
  // Single child violations (3 symmetric cases)
  if (n >= limit + 1) {
    total -= 3 * comb2(n - limit - 1 + 2);
  }

  // Add back cases where at least two children exceed limit
  // (inclusion-exclusion correction)
  if (n >= 2 * (limit + 1)) {
    total += 3 * comb2(n - 2 * limit - 2 + 2);
  }

  // Subtract cases where all three exceed limit
  if (n >= 3 * (limit + 1)) {
    total -= comb2(n - 3 * limit - 3 + 2);
  }

  return total;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public long distributeCandies(int n, int limit) {
        // Helper to compute combinations C(k, 2) safely
        long comb2(long k) {
            // C(k, 2) = k*(k-1)/2, but return 0 if k < 2
            return k < 2 ? 0 : k * (k - 1) / 2;
        }

        // Total ways without limits: C(n+2, 2)
        long total = comb2(n + 2);

        // Subtract cases where at least one child exceeds limit
        // Single child violations (3 symmetric cases)
        if (n >= limit + 1) {
            total -= 3 * comb2(n - limit - 1 + 2);
        }

        // Add back cases where at least two children exceed limit
        // (inclusion-exclusion correction)
        if (n >= 2L * (limit + 1)) {
            total += 3 * comb2(n - 2L * limit - 2 + 2);
        }

        // Subtract cases where all three exceed limit
        if (n >= 3L * (limit + 1)) {
            total -= comb2(n - 3L * limit - 3 + 2);
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) — We perform a constant number of arithmetic operations regardless of input size.

**Space Complexity:** O(1) — We use only a few variables to store intermediate results.

The complexity comes from using combinatorial formulas instead of enumeration. Each `comb2` calculation is O(1), and we call it at most 4 times.

## Common Mistakes

1. **Forgetting the base case in combination formula:** `C(k,2)` is only defined for `k ≥ 2`. Many candidates forget to handle `k < 2` cases, leading to negative values or incorrect results when `n` is small relative to `limit`.

2. **Integer overflow:** With `n` up to 10⁶, intermediate values like `n+2` can reach ~10⁶, and `k*(k-1)` can reach ~10¹², which fits in 32-bit signed integer (max ~2×10⁹) but may overflow in some languages. Use 64-bit integers (long in Java/JavaScript, Python handles big integers automatically).

3. **Off-by-one in limit condition:** The violation occurs when a child gets **more than** `limit` candies, which means `≥ limit+1`. Some candidates mistakenly use `n ≥ limit` instead of `n ≥ limit+1`.

4. **Missing symmetry factors:** Forgetting to multiply by 3 for the single and double violation cases. There are 3 children, so violations involving 1 child occur in 3 symmetric ways, and violations involving 2 children also occur in 3 ways.

## When You'll See This Pattern

This inclusion-exclusion pattern with stars-and-bars appears in many combinatorial counting problems with constraints:

1. **Count the Number of Ways to Place Houses (LeetCode 2320)** — Similar constraint counting with inclusion-exclusion.
2. **Number of Ways to Divide a Long Corridor (LeetCode 2147)** — Counting valid partitions with constraints.
3. **Count Ways to Distribute Candies (LeetCode 2929 — the Hard version)** — This is literally the harder version of the same problem with more children.

The core pattern: When you need to count integer solutions to `x₁ + ... + xₖ = n` with `0 ≤ xᵢ ≤ limit`, use stars-and-bars for the total count, then inclusion-exclusion to handle the upper bound constraints.

## Key Takeaways

1. **Stars-and-bars + inclusion-exclusion** is the standard approach for counting integer solutions with upper bounds. Remember: total solutions = C(n+k-1, k-1), then subtract violations.

2. **Look for symmetry** to reduce calculations. When constraints are identical for all variables, you only need to compute one case and multiply by the appropriate combinatorial factor.

3. **Always check boundary conditions** in combinatorial formulas. The combination function C(n,k) is only defined for n ≥ k ≥ 0, and special handling is needed for invalid inputs.

Related problems: [Count Ways to Distribute Candies](/problem/count-ways-to-distribute-candies)
