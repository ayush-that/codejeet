---
title: "How to Solve Fair Distribution of Cookies — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Fair Distribution of Cookies. Medium difficulty, 69.8% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask."
date: "2027-02-16"
category: "dsa-patterns"
tags: ["fair-distribution-of-cookies", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Fair Distribution of Cookies

You need to distribute all cookie bags among `k` children, where each bag must go entirely to one child. The goal is to minimize the **maximum** total cookies any single child receives. This is tricky because you must explore all possible distributions to find the one with the smallest possible maximum — essentially, you're trying to balance the load as evenly as possible, but not necessarily equally.

## Visual Walkthrough

Let's trace through a small example: `cookies = [8, 15, 10, 20, 8]` with `k = 2` children.

We need to assign each of the 5 bags to either child A or child B. The "unfairness" is the maximum total cookies between the two children.

One possible distribution:

- Child A: [8, 15, 10] = 33 cookies
- Child B: [20, 8] = 28 cookies  
  Unfairness = max(33, 28) = 33

A better distribution:

- Child A: [8, 20, 8] = 36 cookies
- Child B: [15, 10] = 25 cookies
  Unfairness = max(36, 25) = 36 (worse!)

The optimal distribution:

- Child A: [8, 15, 8] = 31 cookies
- Child B: [10, 20] = 30 cookies
  Unfairness = max(31, 30) = 31

We need to systematically check distributions to find this minimum maximum of 31. With 5 bags and 2 children, there are 2⁵ = 32 possible assignments to check. For larger inputs, brute force becomes impossible — we need a smarter approach.

## Brute Force Approach

The most straightforward solution is to generate all possible assignments of bags to children. For each of the `n` bags, we have `k` choices (which child gets it), giving us `kⁿ` possibilities. For each assignment, we calculate the total cookies per child, find the maximum, and track the minimum of these maximums.

This approach is correct but impossibly slow. With `n = 8` and `k = 8`, that's 8⁸ ≈ 16.7 million possibilities. The constraints (up to `n = 8`, `k = 8`) might seem small, but 8⁸ is still too large for typical time limits.

What makes this problem interesting is that while `n` is small (≤ 8), the brute force `kⁿ` approach is still too slow. We need a more efficient way to explore the search space.

## Optimized Approach

The key insight is that we don't need to consider all `kⁿ` assignments independently. Many assignments are equivalent in terms of the resulting distribution of totals. We can use **backtracking with pruning**:

1. **State Representation**: Track the current total cookies for each child.
2. **Backtracking**: Assign each bag to each possible child, update that child's total, and recurse to the next bag.
3. **Pruning**: If at any point a child's total already equals or exceeds our current best answer, we can stop exploring that path — it can't lead to a better solution.
4. **Additional Optimization**: Sort cookies in descending order and try larger bags first. This creates larger totals earlier, triggering pruning sooner.

Think of it like this: We're filling `k` buckets (children) with cookie bags. We want the fullest bucket to be as empty as possible. If we put a large bag in a bucket that's already nearly full, we immediately know this path won't beat our current best.

This is essentially a **minimum-maximum partitioning problem**, similar to "Split Array Largest Sum" but with the added complexity that we're partitioning items (bags) rather than splitting a sequence.

## Optimal Solution

We implement backtracking with the optimizations mentioned:

<div class="code-group">

```python
# Time: O(k^n) worst case, but heavily pruned in practice
# Space: O(k + n) for recursion depth and child totals
class Solution:
    def distributeCookies(self, cookies: List[int], k: int) -> int:
        # Sort in descending order to enable better pruning
        cookies.sort(reverse=True)

        # Array to track current total cookies for each child
        child_totals = [0] * k

        # Initialize answer with a large value (maximum possible unfairness)
        self.min_unfairness = float('inf')

        def backtrack(bag_index: int) -> None:
            """
            Backtrack to assign cookies starting from bag_index.
            """
            # If we've assigned all bags
            if bag_index == len(cookies):
                # Calculate unfairness (maximum total among children)
                current_unfairness = max(child_totals)
                # Update minimum unfairness found so far
                self.min_unfairness = min(self.min_unfairness, current_unfairness)
                return

            # Try giving the current bag to each child
            for child in range(k):
                # PRUNING: If adding this bag won't improve our best answer, skip
                if child_totals[child] + cookies[bag_index] >= self.min_unfairness:
                    continue

                # PRUNING: If this child has the same total as a previous child,
                # skip to avoid duplicate work (symmetry pruning)
                if child > 0 and child_totals[child] == child_totals[child - 1]:
                    continue

                # Assign current bag to this child
                child_totals[child] += cookies[bag_index]

                # Recurse to next bag
                backtrack(bag_index + 1)

                # Backtrack: remove bag from this child
                child_totals[child] -= cookies[bag_index]

            # Early return if we found a perfect distribution (0 is impossible with positive cookies)
            # This check helps prune further

        # Start backtracking from the first bag
        backtrack(0)

        return self.min_unfairness
```

```javascript
// Time: O(k^n) worst case, but heavily pruned in practice
// Space: O(k + n) for recursion depth and child totals
/**
 * @param {number[]} cookies
 * @param {number} k
 * @return {number}
 */
var distributeCookies = function (cookies, k) {
  // Sort in descending order to enable better pruning
  cookies.sort((a, b) => b - a);

  // Array to track current total cookies for each child
  const childTotals = new Array(k).fill(0);

  // Initialize answer with a large value
  let minUnfairness = Infinity;

  /**
   * Backtrack to assign cookies starting from bagIndex
   * @param {number} bagIndex - Current bag index to assign
   */
  function backtrack(bagIndex) {
    // If we've assigned all bags
    if (bagIndex === cookies.length) {
      // Calculate unfairness (maximum total among children)
      const currentUnfairness = Math.max(...childTotals);
      // Update minimum unfairness found so far
      minUnfairness = Math.min(minUnfairness, currentUnfairness);
      return;
    }

    // Try giving the current bag to each child
    for (let child = 0; child < k; child++) {
      // PRUNING: If adding this bag won't improve our best answer, skip
      if (childTotals[child] + cookies[bagIndex] >= minUnfairness) {
        continue;
      }

      // PRUNING: If this child has the same total as a previous child,
      // skip to avoid duplicate work (symmetry pruning)
      if (child > 0 && childTotals[child] === childTotals[child - 1]) {
        continue;
      }

      // Assign current bag to this child
      childTotals[child] += cookies[bagIndex];

      // Recurse to next bag
      backtrack(bagIndex + 1);

      // Backtrack: remove bag from this child
      childTotals[child] -= cookies[bagIndex];
    }
  }

  // Start backtracking from the first bag
  backtrack(0);

  return minUnfairness;
};
```

```java
// Time: O(k^n) worst case, but heavily pruned in practice
// Space: O(k + n) for recursion depth and child totals
class Solution {
    private int[] cookies;
    private int[] childTotals;
    private int minUnfairness;

    public int distributeCookies(int[] cookies, int k) {
        // Sort in descending order to enable better pruning
        this.cookies = cookies;
        Arrays.sort(this.cookies);
        // Reverse the sorted array (descending order)
        for (int i = 0; i < this.cookies.length / 2; i++) {
            int temp = this.cookies[i];
            this.cookies[i] = this.cookies[this.cookies.length - 1 - i];
            this.cookies[this.cookies.length - 1 - i] = temp;
        }

        // Array to track current total cookies for each child
        childTotals = new int[k];

        // Initialize answer with a large value
        minUnfairness = Integer.MAX_VALUE;

        // Start backtracking from the first bag
        backtrack(0);

        return minUnfairness;
    }

    /**
     * Backtrack to assign cookies starting from bagIndex
     * @param bagIndex Current bag index to assign
     */
    private void backtrack(int bagIndex) {
        // If we've assigned all bags
        if (bagIndex == cookies.length) {
            // Calculate unfairness (maximum total among children)
            int currentUnfairness = 0;
            for (int total : childTotals) {
                currentUnfairness = Math.max(currentUnfairness, total);
            }
            // Update minimum unfairness found so far
            minUnfairness = Math.min(minUnfairness, currentUnfairness);
            return;
        }

        // Try giving the current bag to each child
        for (int child = 0; child < childTotals.length; child++) {
            // PRUNING: If adding this bag won't improve our best answer, skip
            if (childTotals[child] + cookies[bagIndex] >= minUnfairness) {
                continue;
            }

            // PRUNING: If this child has the same total as a previous child,
            // skip to avoid duplicate work (symmetry pruning)
            if (child > 0 && childTotals[child] == childTotals[child - 1]) {
                continue;
            }

            // Assign current bag to this child
            childTotals[child] += cookies[bagIndex];

            // Recurse to next bag
            backtrack(bagIndex + 1);

            // Backtrack: remove bag from this child
            childTotals[child] -= cookies[bagIndex];
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: In the worst case, we explore all `k^n` assignments. However, with effective pruning:

- Sorting bags in descending order means we try large bags first, creating high totals early that trigger pruning
- The symmetry pruning avoids exploring identical distributions
- The bound pruning stops when a path can't beat the current best
  In practice, this runs efficiently for the constraints (`n ≤ 8`, `k ≤ 8`).

**Space Complexity**: `O(k + n)` where:

- `O(k)` for the `child_totals` array storing each child's current total
- `O(n)` for the recursion call stack (depth of `n`)

## Common Mistakes

1. **Not sorting in descending order**: Trying small bags first means pruning happens much later in the search. The order matters because large bags create constraints earlier.

2. **Missing symmetry pruning**: Without checking `child_totals[child] == child_totals[child - 1]`, you'll explore many identical distributions (e.g., giving bag 1 to child A and bag 2 to child B vs. bag 1 to B and bag 2 to A when both start at 0).

3. **Incorrect pruning condition**: Using `>` instead of `>=` in `child_totals[child] + cookies[bag_index] >= min_unfairness` would incorrectly skip paths that could equal the current best. We use `>=` because we want strictly better solutions.

4. **Forgetting to backtrack**: After the recursive call, you must subtract the cookies from `child_totals[child]`. This is a classic backtracking error that leads to incorrect state propagation.

## When You'll See This Pattern

This **backtracking with pruning** pattern appears in several partitioning problems:

1. **Partition to K Equal Sum Subsets (LeetCode 698)**: Similar structure but requires exact equal sums rather than minimizing the maximum. The backtracking approach is nearly identical.

2. **Split Array Largest Sum (LeetCode 410)**: Also minimizes the maximum sum of partitions, but partitions must be contiguous subarrays. This allows for binary search + greedy or DP solutions.

3. **Matchsticks to Square (LeetCode 473)**: A special case with k=4 where all partitions must have equal sums. Uses the same backtracking approach.

The pattern is: when you need to partition items into groups with some optimization objective (minimize maximum, achieve equal sums, etc.) and the search space is too large for brute force but small enough for pruning to work.

## Key Takeaways

1. **Backtracking with pruning** is powerful for combinatorial problems with small-to-medium input sizes. Always look for ways to prune: bound pruning (can this path beat current best?) and symmetry pruning (are these states equivalent?).

2. **Order matters** in backtracking. Sorting items by size (largest first) often leads to better pruning because constraints are revealed earlier.

3. **Partitioning problems** often have this structure. If you're asked to distribute items among groups with some min-max or equalization objective, consider backtracking with the state being the current totals for each group.

Related problems: [Split Array Largest Sum](/problem/split-array-largest-sum), [Split Array with Equal Sum](/problem/split-array-with-equal-sum), [Partition to K Equal Sum Subsets](/problem/partition-to-k-equal-sum-subsets)
