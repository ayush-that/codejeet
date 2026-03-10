---
title: "How to Solve Minimized Maximum of Products Distributed to Any Store — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimized Maximum of Products Distributed to Any Store. Medium difficulty, 63.0% acceptance rate. Topics: Array, Binary Search, Greedy."
date: "2026-09-21"
category: "dsa-patterns"
tags:
  [
    "minimized-maximum-of-products-distributed-to-any-store",
    "array",
    "binary-search",
    "greedy",
    "medium",
  ]
---

# How to Solve Minimized Maximum of Products Distributed to Any Store

You need to distribute `m` product types with given quantities across `n` stores, where each store can only receive products of a single type. The goal is to minimize the maximum number of products any store receives. This is tricky because you must find the smallest possible maximum load while ensuring all products are distributed — a classic optimization problem that screams "binary search on the answer."

## Visual Walkthrough

Let's trace through a concrete example: `quantities = [11, 6]`, `n = 6` stores.

We need to split 11 units of product type A and 6 units of product type B across 6 stores, with each store getting only one type.

**Key insight:** If we set a maximum capacity `x` per store, we can check if it's feasible to distribute all products:

- For product A (11 units): With max `x` per store, we need `ceil(11/x)` stores
- For product B (6 units): We need `ceil(6/x)` stores
- Total stores needed = sum of ceilings

Let's test different `x` values:

**x = 3:**

- Product A: ceil(11/3) = ceil(3.67) = 4 stores
- Product B: ceil(6/3) = 2 stores
- Total: 6 stores ✅ Feasible!

**x = 2:**

- Product A: ceil(11/2) = ceil(5.5) = 6 stores
- Product B: ceil(6/2) = 3 stores
- Total: 9 stores ❌ Need 9 stores but only have 6

**x = 4:**

- Product A: ceil(11/4) = ceil(2.75) = 3 stores
- Product B: ceil(6/4) = ceil(1.5) = 2 stores
- Total: 5 stores ✅ Feasible!

We want the **minimum** feasible `x`. Between 2 (infeasible) and 3 (feasible), we need to find the boundary. This is perfect for binary search!

## Brute Force Approach

A naive approach would be to try every possible `x` from 1 up to `max(quantities)` (since no store needs more than the largest quantity). For each `x`, calculate the total stores needed and check if it's ≤ `n`.

**Why this fails:**

- Maximum quantity could be up to 10⁵
- We'd need to check up to 10⁵ values
- For each check, we iterate through `m` products (up to 10⁵)
- Total: O(m × max(quantities)) = up to 10¹⁰ operations → too slow!

The brute force helps us understand the problem structure but isn't efficient enough for the constraints.

## Optimized Approach

The key insight is **monotonicity**: If `x` works (feasible), then any larger `x` also works (easier to distribute). If `x` doesn't work, any smaller `x` also won't work.

This creates a perfect scenario for **binary search**:

- **Search space:** `left = 1`, `right = max(quantities)` (no store needs more than the max quantity)
- **Condition:** `canDistribute(x)` returns true if we can distribute with max `x` per store
- **Goal:** Find the smallest `x` where `canDistribute(x)` is true

**Why binary search works:**

1. If `x` is too small → need too many stores → infeasible
2. If `x` is large enough → need ≤ n stores → feasible
3. The feasibility function switches from false to true exactly once

**Feasibility check:** For each product quantity `q`, we need `ceil(q/x)` stores. Sum these across all products. If sum ≤ n, it's feasible.

## Optimal Solution

We implement binary search on the answer with a feasibility check. The search continues until we find the minimum feasible `x`.

<div class="code-group">

```python
# Time: O(m * log(max(quantities))) | Space: O(1)
def minimizedMaximum(self, n: int, quantities: List[int]) -> int:
    """
    Find the smallest maximum products per store that allows
    distributing all products to n stores.
    """

    def can_distribute(max_per_store: int) -> bool:
        """
        Check if we can distribute all products with at most
        'max_per_store' products in any store.
        Returns True if total stores needed <= n.
        """
        stores_needed = 0
        for q in quantities:
            # Ceiling division: (q + max_per_store - 1) // max_per_store
            stores_needed += (q + max_per_store - 1) // max_per_store
            # Early exit: if we already need more than n stores, stop
            if stores_needed > n:
                return False
        return stores_needed <= n

    # Binary search for the minimum feasible max_per_store
    left, right = 1, max(quantities)

    while left < right:
        mid = (left + right) // 2

        if can_distribute(mid):
            # mid is feasible, try smaller values
            right = mid
        else:
            # mid is not feasible, need larger values
            left = mid + 1

    # left == right, the minimum feasible value
    return left
```

```javascript
// Time: O(m * log(max(quantities))) | Space: O(1)
function minimizedMaximum(n, quantities) {
  /**
   * Find the smallest maximum products per store that allows
   * distributing all products to n stores.
   */

  const canDistribute = (maxPerStore) => {
    /**
     * Check if we can distribute all products with at most
     * 'maxPerStore' products in any store.
     * Returns true if total stores needed <= n.
     */
    let storesNeeded = 0;
    for (const q of quantities) {
      // Ceiling division: Math.ceil(q / maxPerStore)
      storesNeeded += Math.ceil(q / maxPerStore);
      // Early exit: if we already need more than n stores, stop
      if (storesNeeded > n) {
        return false;
      }
    }
    return storesNeeded <= n;
  };

  // Binary search for the minimum feasible maxPerStore
  let left = 1;
  let right = Math.max(...quantities);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canDistribute(mid)) {
      // mid is feasible, try smaller values
      right = mid;
    } else {
      // mid is not feasible, need larger values
      left = mid + 1;
    }
  }

  // left == right, the minimum feasible value
  return left;
}
```

```java
// Time: O(m * log(max(quantities))) | Space: O(1)
public int minimizedMaximum(int n, int[] quantities) {
    /**
     * Find the smallest maximum products per store that allows
     * distributing all products to n stores.
     */

    // Helper function to check feasibility
    private boolean canDistribute(int maxPerStore) {
        /**
         * Check if we can distribute all products with at most
         * 'maxPerStore' products in any store.
         * Returns true if total stores needed <= n.
         */
        int storesNeeded = 0;
        for (int q : quantities) {
            // Ceiling division: (q + maxPerStore - 1) / maxPerStore
            storesNeeded += (q + maxPerStore - 1) / maxPerStore;
            // Early exit: if we already need more than n stores, stop
            if (storesNeeded > n) {
                return false;
            }
        }
        return storesNeeded <= n;
    }

    // Binary search for the minimum feasible maxPerStore
    int left = 1;
    int right = 0;

    // Find maximum quantity for the search space
    for (int q : quantities) {
        right = Math.max(right, q);
    }

    while (left < right) {
        int mid = left + (right - left) / 2;  // Avoid overflow

        if (canDistribute(mid)) {
            // mid is feasible, try smaller values
            right = mid;
        } else {
            // mid is not feasible, need larger values
            left = mid + 1;
        }
    }

    // left == right, the minimum feasible value
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × log(max(quantities)))

- Binary search runs O(log(max(quantities))) iterations
- Each iteration checks all `m` products: O(m)
- Total: O(m × log(max(quantities)))

**Space Complexity:** O(1)

- We only use a few variables for counting and binary search
- No additional data structures needed

**Why this is efficient:**

- max(quantities) ≤ 10⁵, so log₂(10⁵) ≈ 17 iterations
- With m ≤ 10⁵, total operations ≈ 1.7 million → efficient!

## Common Mistakes

1. **Incorrect binary search bounds:** Starting with `left = 0` instead of `1`. If `left = 0`, you'll get division by zero in the feasibility check. Always start with `left = 1`.

2. **Wrong ceiling division implementation:** Using `q // x` (floor division) instead of `(q + x - 1) // x`. This underestimates stores needed. Remember: 11 products with max 3 per store needs 4 stores, not 3.

3. **Missing early exit in feasibility check:** Without early exit (`if stores_needed > n: return False`), you waste time counting all products when already infeasible. This optimization matters for large inputs.

4. **Infinite binary search loop:** Using `while left <= right` with `right = mid - 1` can skip the correct answer. The pattern `while left < right` with `right = mid` and `left = mid + 1` is safer for "minimum feasible" problems.

## When You'll See This Pattern

This "binary search on answer" pattern appears whenever:

1. You need to minimize a maximum (or maximize a minimum)
2. The feasibility check is monotonic
3. Direct computation is too expensive

**Related problems:**

- **Koko Eating Bananas:** Minimize eating speed to finish bananas in `h` hours
- **Capacity To Ship Packages Within D Days:** Minimize ship capacity to deliver in `days` days
- **Maximum Candies Allocated to K Children:** Maximize minimum candies per child
- **Split Array Largest Sum:** Minimize largest sum among subarrays

All these problems share the same structure: binary search on the answer with a greedy feasibility check.

## Key Takeaways

1. **Recognize "minimize maximum" problems:** When asked to minimize the worst case (maximum load, maximum time, etc.), think binary search on the answer.

2. **Check for monotonicity:** If larger values make the problem easier (or always feasible), and smaller values make it harder (or infeasible), binary search applies.

3. **Separate feasibility check from optimization:** First design a function `canDo(x)` that checks if `x` works. Then binary search for the smallest/largest `x` that satisfies it.

4. **Optimize the feasibility check:** Use early exits and efficient computations. The feasibility check runs many times, so make it fast.

Related problems: [Koko Eating Bananas](/problem/koko-eating-bananas), [Capacity To Ship Packages Within D Days](/problem/capacity-to-ship-packages-within-d-days), [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children)
