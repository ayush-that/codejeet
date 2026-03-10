---
title: "How to Solve Apply Operations to Make Sum of Array Greater Than or Equal to k — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Apply Operations to Make Sum of Array Greater Than or Equal to k. Medium difficulty, 44.2% acceptance rate. Topics: Math, Greedy, Enumeration."
date: "2029-03-23"
category: "dsa-patterns"
tags:
  [
    "apply-operations-to-make-sum-of-array-greater-than-or-equal-to-k",
    "math",
    "greedy",
    "enumeration",
    "medium",
  ]
---

# How to Solve "Apply Operations to Make Sum of Array Greater Than or Equal to k"

This problem presents an interesting optimization challenge: starting with a single-element array `[1]`, we need to determine the **minimum number of operations** to make the array sum at least `k`. We can either increment any element by 1 or duplicate any element (which adds a copy of that element to the array). The tricky part is that these operations interact in non-obvious ways—duplicating a larger number gives more "bang for your buck" in terms of sum increase, but building up to that larger number requires increment operations first.

## Visual Walkthrough

Let's trace through `k = 10` to build intuition:

**Initial state:** `nums = [1]`, sum = 1, operations = 0

We need to reach sum ≥ 10. What's the fastest way?

**Option 1: Just increment**

- Increment 1 to 10: 9 operations
- Result: `[10]`, sum = 10, operations = 9

**Option 2: Duplicate strategically**

- Step 1: Increment 1 to 3 (2 operations): `[3]`, sum = 3
- Step 2: Duplicate 3 (1 operation): `[3, 3]`, sum = 6
- Step 3: Increment both 3s to 4 (2 operations): `[4, 4]`, sum = 8
- Step 4: Increment one 4 to 5 (1 operation): `[4, 5]`, sum = 9
- Step 5: Increment 4 to 5 (1 operation): `[5, 5]`, sum = 10
- Total operations: 2 + 1 + 2 + 1 + 1 = 7

**Option 3: Better duplication**

- Step 1: Increment 1 to 4 (3 operations): `[4]`, sum = 4
- Step 2: Duplicate 4 (1 operation): `[4, 4]`, sum = 8
- Step 3: Increment one 4 to 5 (1 operation): `[4, 5]`, sum = 9
- Step 4: Increment 4 to 5 (1 operation): `[5, 5]`, sum = 10
- Total operations: 3 + 1 + 1 + 1 = 6

**Option 4: Even better**

- Step 1: Increment 1 to 5 (4 operations): `[5]`, sum = 5
- Step 2: Duplicate 5 (1 operation): `[5, 5]`, sum = 10
- Total operations: 4 + 1 = 5

This shows the pattern: we want to find some value `x` where we:

1. Increment from 1 to `x` (cost: `x - 1` operations)
2. Duplicate until we have enough copies (cost: `duplicates` operations)
3. Possibly do some final increments (cost: `final_increments` operations)

The key insight: **For a given maximum value `x`, the optimal strategy is to have all elements be either `x` or `x-1`**.

## Brute Force Approach

A naive approach would be to simulate all possible sequences of operations using BFS/DFS. Each state would be the current array, and we'd try both operations from each element. However, this explodes combinatorially—the state space is enormous even for moderate `k`.

Another brute force idea: try all possible `x` values from 1 to `k`. For each `x`, calculate the minimum operations needed if `x` is our target maximum value. We'd need to determine:

- How many copies of `x` we need
- How many copies of `x-1` we might need
- The operation count for each

While this is better than simulation, a naive implementation might still be inefficient if not done carefully. The real challenge is finding the right formula to compute operations for a given `x` in O(1) time.

## Optimized Approach

The optimal solution uses mathematical reasoning:

1. **Observation 1**: It never makes sense to have an element less than `x-1` when we have elements equal to `x`. We should always increment smaller elements first.

2. **Observation 2**: If our maximum value is `x`, the most efficient configuration is to have `m` copies of `x` and possibly some copies of `x-1` if needed.

3. **Key Formula**: For a given `x`, we need enough elements so that `m * x + r * (x-1) ≥ k`, where `m` is the number of `x` values, `r` is the number of `x-1` values, and `m + r` is the total number of elements.

4. **Operation Calculation**:
   - To get from `[1]` to having our first `x`: `x - 1` increment operations
   - To create `m` total elements: `m - 1` duplicate operations (starting from 1 element)
   - If we need `r` elements at `x-1`: additional `r` decrement operations (but wait—we can't decrement! Actually, we build them as `x-1` directly)

5. **Better Approach**: Think in terms of total elements `n`. If we want `n` elements with maximum value `x`, the maximum sum we can get is `n * x`. But we might not need all elements at `x`—some can be `x-1`.

6. **Optimal Insight**: For a fixed `x`, the minimum operations is `(x - 1) + (n - 1)`, where `n` is the smallest integer such that we can achieve sum ≥ `k` with `n` elements having values at most `x`.

7. **Final Algorithm**: For each possible `x` from 1 to `k`, find the minimum `n` such that we can reach sum ≥ `k`, then calculate operations = `(x - 1) + (n - 1)`. Take the minimum over all `x`.

8. **Optimization**: We can find `n` directly using ceiling division: `n = ceil(k / x)`. But since elements can be `x-1`, we might need fewer elements. Actually, with `n` elements where the largest is `x`, the maximum sum is `n * x`, and the minimum sum (with careful construction) is `(n-1) * x + 1`. We need to find the smallest `n` where it's possible to reach `k`.

The cleanest approach: For each `x`, the minimum `n` is `ceil(k / x)`. But we need to check if with `n-1` elements of value `x` and the last element starting from 1, we can reach the target. Actually, let's derive the correct formula...

After working through examples, the correct reasoning is:

- Start with `[1]`
- Increment to `x`: `x-1` operations
- We now have 1 element at value `x`
- Each duplication adds another element at value `x`
- After `d` duplications, we have `d+1` elements, all at value `x`
- Total sum = `(d+1) * x`
- We need `(d+1) * x ≥ k`, so `d ≥ ceil(k/x) - 1`
- Total operations = `(x-1) + d`, where `d = ceil(k/x) - 1`
- So operations = `x - 2 + ceil(k/x)`

But wait, this assumes all elements end at exactly `x`. What if we can have some at `x-1`? Let's test with `k=10`, `x=4`:

- Formula gives: `4 - 2 + ceil(10/4) = 2 + 3 = 5`
- But we found a solution with 6 operations earlier for `x=4`

Actually, the issue is that when we duplicate, we get another copy at the current value. If we want some elements at `x-1`, we need to stop incrementing them earlier. This suggests we should think differently...

**The correct optimal approach**: We can think in terms of the final array having `a` copies of value `x` and `b` copies of value `x-1`. The operations are:

1. Increment from 1 to `x`: `x-1` operations
2. Duplicate to get `a+b` total elements: `a+b-1` operations
3. Decrement `b` elements from `x` to `x-1`: `b` operations (but we can't decrement!)

This reveals the flaw: we can't decrement. So we must build the `x-1` elements directly. This means we should increment to `x-1` first, duplicate, then increment some to `x`.

After careful analysis and testing against examples, the optimal formula that works is:

- For each `x` from 1 to `k`:
  - Let `m = ceil(k / x)` (minimum number of elements if all are `x`)
  - But if `m * (x-1) ≥ k`, we can use `x-1` as our target instead
  - Actually, the clean solution is to try both `x` and `x-1` as candidate maximums

However, there's an even cleaner insight from the community solutions: **The optimal strategy is to find `x` and `n` such that `(n-1)*(x-1) + x ≥ k`**, which means with `n` elements, we can have one at `x` and the rest at `x-1`. The operations are `(x-1) + (n-1)`.

Let's implement this and test against our examples.

## Optimal Solution

After working through the mathematical derivation, here's the optimal solution: We iterate through possible numbers of elements `n` from 1 to `k`. For each `n`, we find the minimum `x` such that we can achieve sum ≥ `k`. The sum with `n` elements is maximized when we have one element at `x` and `n-1` elements at `x-1`, giving sum = `x + (n-1)*(x-1) = n*x - (n-1)`. We need this ≥ `k`, so `x ≥ ceil((k + n - 1) / n)`. Operations = `(x-1) + (n-1) = x + n - 2`.

We minimize over all `n`.

<div class="code-group">

```python
# Time: O(k) | Space: O(1)
def minOperations(k):
    """
    Calculate minimum operations to make array sum >= k.

    Strategy: For each possible number of elements n (1 to k),
    find the minimum x needed, then calculate operations = x + n - 2.
    Take the minimum over all n.

    Args:
        k: Target sum (positive integer)

    Returns:
        Minimum number of operations
    """
    # Initialize with worst case: just increment 1 to k
    min_ops = k - 1  # This is the "all increments" approach

    # Try all possible numbers of elements in the final array
    for n in range(1, k + 1):
        # We need sum >= k with n elements
        # Best configuration: one element at x, rest at x-1
        # Sum = x + (n-1)*(x-1) = n*x - (n-1)
        # We need n*x - (n-1) >= k
        # So x >= ceil((k + n - 1) / n)

        # Calculate minimum x needed for this n
        x = (k + n - 1) // n  # Ceiling division

        # Operations = increment to x (x-1 ops) + duplicate to n elements (n-1 ops)
        ops = (x - 1) + (n - 1)

        # Update minimum
        if ops < min_ops:
            min_ops = ops

    return min_ops
```

```javascript
// Time: O(k) | Space: O(1)
function minOperations(k) {
  /**
   * Calculate minimum operations to make array sum >= k.
   *
   * Strategy: For each possible number of elements n (1 to k),
   * find the minimum x needed, then calculate operations = x + n - 2.
   * Take the minimum over all n.
   *
   * @param {number} k - Target sum (positive integer)
   * @return {number} Minimum number of operations
   */
  // Initialize with worst case: just increment 1 to k
  let minOps = k - 1;

  // Try all possible numbers of elements in the final array
  for (let n = 1; n <= k; n++) {
    // Calculate minimum x needed for n elements
    // Using ceiling division: ceil((k + n - 1) / n)
    const x = Math.floor((k + n - 1) / n);

    // Operations = increment to x (x-1 ops) + duplicate to n elements (n-1 ops)
    const ops = x - 1 + (n - 1);

    // Update minimum
    if (ops < minOps) {
      minOps = ops;
    }
  }

  return minOps;
}
```

```java
// Time: O(k) | Space: O(1)
class Solution {
    public int minOperations(int k) {
        /**
         * Calculate minimum operations to make array sum >= k.
         *
         * Strategy: For each possible number of elements n (1 to k),
         * find the minimum x needed, then calculate operations = x + n - 2.
         * Take the minimum over all n.
         *
         * @param k Target sum (positive integer)
         * @return Minimum number of operations
         */
        // Initialize with worst case: just increment 1 to k
        int minOps = k - 1;

        // Try all possible numbers of elements in the final array
        for (int n = 1; n <= k; n++) {
            // Calculate minimum x needed for n elements
            // Using ceiling division: ceil((k + n - 1) / n)
            int x = (k + n - 1) / n;

            // Operations = increment to x (x-1 ops) + duplicate to n elements (n-1 ops)
            int ops = (x - 1) + (n - 1);

            // Update minimum
            if (ops < minOps) {
                minOps = ops;
            }
        }

        return minOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(k)

- We iterate `n` from 1 to `k`, performing constant-time operations in each iteration
- This gives us O(k) time complexity

**Space Complexity**: O(1)

- We only use a few integer variables regardless of input size
- No additional data structures are needed

**Why this is optimal**: For this problem, we need to check all reasonable possibilities. Since `k` can be up to 10^5 in typical constraints, O(k) is acceptable. There might be a mathematical optimization to O(√k) by noticing that the function is convex, but the O(k) solution is sufficient for interview settings and most constraints.

## Common Mistakes

1. **Forgetting the starting point**: Some candidates start thinking about incrementing from 0 instead of from 1. Remember we begin with `[1]`, not `[0]`.

2. **Trying to decrement elements**: The problem only allows increment and duplicate operations. You cannot decrease an element's value. Any strategy that requires "decrementing" from `x` to `x-1` is invalid.

3. **Overlooking the duplicate cost**: When calculating operations, it's easy to forget that duplicating an element counts as one operation. The formula must account for both increment operations (`x-1` to reach value `x`) and duplicate operations (`n-1` to reach `n` elements).

4. **Incorrect ceiling division**: When computing `x = ceil((k + n - 1) / n)`, using integer division incorrectly can give floor instead of ceiling. The correct formula is `(k + n - 1) // n` in Python, or `Math.floor((k + n - 1) / n)` in JavaScript.

5. **Not considering all configurations**: The optimal configuration isn't necessarily all elements at the same value. The best approach often has one element at `x` and the rest at `x-1`, which our formula captures correctly.

## When You'll See This Pattern

This problem combines **mathematical optimization** with **greedy enumeration**:

1. **Minimum Operations Problems**: Similar to problems where you need to find minimum steps to reach a target using specific operations (like "Minimum Operations to Reduce X to Zero" - LeetCode 1658, or "2 Keys Keyboard" - LeetCode 650).

2. **Greedy with Mathematical Bounds**: Problems where you need to find optimal parameters by trying all reasonable values and using formulas to calculate costs (like "Maximum Performance of a Team" - LeetCode 1383, where you try different minimum efficiencies).

3. **Optimization by Iterating Over One Parameter**: When a problem has two interdependent variables (like `x` and `n` here), sometimes the optimal approach is to iterate over one and calculate the optimal value of the other using a formula.

## Key Takeaways

1. **Break complex operations into mathematical models**: When faced with operations that can be applied in any order, look for the end state configuration that minimizes operations, then work backward to find how to get there.

2. **Look for the "bottleneck" insight**: Here, the key was realizing that the optimal final array has at most two distinct values (`x` and `x-1`), which simplified the search space dramatically.

3. **When in doubt, iterate and calculate**: If the mathematical derivation is complex, sometimes the simplest solution is to iterate over one reasonable parameter range (1 to `k`) and use formulas to calculate the optimal value for other parameters.

4. **Test with small examples**: This problem heavily rewards working through concrete examples (like `k=10`) to discover patterns and verify formulas.

[Practice this problem on CodeJeet](/problem/apply-operations-to-make-sum-of-array-greater-than-or-equal-to-k)
