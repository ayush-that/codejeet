---
title: "How to Solve Candy — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Candy. Hard difficulty, 48.0% acceptance rate. Topics: Array, Greedy."
date: "2026-10-17"
category: "dsa-patterns"
tags: ["candy", "array", "greedy", "hard"]
---

# How to Solve Candy

You need to distribute candies to children in a line, where each child must get at least one candy, and children with higher ratings than their neighbors must get more candies than those neighbors. The challenge is that each child's candy count depends on both left and right neighbors simultaneously, creating a bidirectional constraint that makes a single pass insufficient.

## Visual Walkthrough

Let's trace through ratings `[1, 3, 2, 2, 1]`:

**Step 1: Left-to-right pass (checking left neighbors)**

- Child 0 (rating 1): First child gets 1 candy → `[1, ?, ?, ?, ?]`
- Child 1 (rating 3): Higher than left neighbor (1), so gets left neighbor's candies + 1 = 2 → `[1, 2, ?, ?, ?]`
- Child 2 (rating 2): Not higher than left neighbor (3), so gets minimum 1 → `[1, 2, 1, ?, ?]`
- Child 3 (rating 2): Equal to left neighbor (2), so gets minimum 1 → `[1, 2, 1, 1, ?]`
- Child 4 (rating 1): Not higher than left neighbor (2), so gets minimum 1 → `[1, 2, 1, 1, 1]`

**Step 2: Right-to-left pass (checking right neighbors)**

- Child 4 (rating 1): Last child stays at 1 → `[1, 2, 1, 1, 1]`
- Child 3 (rating 2): Higher than right neighbor (1), so needs max(current 1, right neighbor's candies + 1) = max(1, 2) = 2 → `[1, 2, 1, 2, 1]`
- Child 2 (rating 2): Equal to right neighbor (2), so stays at 1 → `[1, 2, 1, 2, 1]`
- Child 1 (rating 3): Higher than right neighbor (2), so needs max(current 2, right neighbor's candies + 1) = max(2, 2) = 2 → `[1, 2, 1, 2, 1]`
- Child 0 (rating 1): Not higher than right neighbor (3), so stays at 1 → `[1, 2, 1, 2, 1]`

**Step 3: Sum candies**
Total = 1 + 2 + 1 + 2 + 1 = 7 candies

The key insight: we need two passes because a child's candy count depends on both sides. The left pass ensures left constraints are satisfied, the right pass ensures right constraints are satisfied, and taking the maximum at each position ensures both constraints are met.

## Brute Force Approach

A brute force approach would be to start with 1 candy for each child, then repeatedly scan the array, increasing candies for children who violate constraints with their neighbors, until no violations remain.

```python
def candy_brute_force(ratings):
    n = len(ratings)
    candies = [1] * n
    changed = True

    while changed:
        changed = False
        for i in range(n):
            # Check left neighbor
            if i > 0 and ratings[i] > ratings[i-1] and candies[i] <= candies[i-1]:
                candies[i] = candies[i-1] + 1
                changed = True
            # Check right neighbor
            if i < n-1 and ratings[i] > ratings[i+1] and candies[i] <= candies[i+1]:
                candies[i] = candies[i+1] + 1
                changed = True

    return sum(candies)
```

**Why it's too slow:** This runs in O(n²) worst-case time (consider ratings in strictly decreasing order). For n=10,000, this could take ~100 million operations, which is too slow for typical constraints.

## Optimized Approach

The optimal solution uses a **greedy two-pass approach**:

1. **Left-to-right pass**: Ensure each child has more candies than their left neighbor if they have a higher rating.
2. **Right-to-left pass**: Ensure each child has more candies than their right neighbor if they have a higher rating.
3. **Take maximum**: For each child, take the maximum value from the two passes to satisfy both constraints.

**Why this works:**

- The left pass guarantees that for any child i, if ratings[i] > ratings[i-1], then candies[i] > candies[i-1].
- The right pass guarantees that for any child i, if ratings[i] > ratings[i+1], then candies[i] > candies[i+1].
- Taking the maximum at each position ensures both conditions hold simultaneously.
- This is greedy because we make locally optimal choices (minimum candies needed to satisfy each constraint) that lead to a globally optimal solution.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def candy(ratings):
    """
    Distribute candies to children based on ratings.

    Args:
        ratings: List of integers representing children's ratings

    Returns:
        Minimum total candies needed to satisfy constraints
    """
    n = len(ratings)
    if n == 0:
        return 0

    # Step 1: Initialize candies array with 1 candy for each child
    candies = [1] * n

    # Step 2: Left-to-right pass
    # Ensure child with higher rating than left neighbor gets more candies
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            # Current child must have at least one more candy than left neighbor
            candies[i] = candies[i - 1] + 1
    # After this pass: left constraints are satisfied

    # Step 3: Right-to-left pass
    # Ensure child with higher rating than right neighbor gets more candies
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            # Current child must have at least one more candy than right neighbor
            # But we also need to preserve any higher value from left pass
            candies[i] = max(candies[i], candies[i + 1] + 1)
    # After this pass: both left and right constraints are satisfied

    # Step 4: Return total candies
    return sum(candies)
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Distribute candies to children based on ratings.
 *
 * @param {number[]} ratings - Array representing children's ratings
 * @return {number} Minimum total candies needed to satisfy constraints
 */
function candy(ratings) {
  const n = ratings.length;
  if (n === 0) return 0;

  // Step 1: Initialize candies array with 1 candy for each child
  const candies = new Array(n).fill(1);

  // Step 2: Left-to-right pass
  // Ensure child with higher rating than left neighbor gets more candies
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      // Current child must have at least one more candy than left neighbor
      candies[i] = candies[i - 1] + 1;
    }
  }
  // After this pass: left constraints are satisfied

  // Step 3: Right-to-left pass
  // Ensure child with higher rating than right neighbor gets more candies
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      // Current child must have at least one more candy than right neighbor
      // But we also need to preserve any higher value from left pass
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }
  // After this pass: both left and right constraints are satisfied

  // Step 4: Return total candies
  return candies.reduce((sum, val) => sum + val, 0);
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    /**
     * Distribute candies to children based on ratings.
     *
     * @param ratings Array representing children's ratings
     * @return Minimum total candies needed to satisfy constraints
     */
    public int candy(int[] ratings) {
        int n = ratings.length;
        if (n == 0) return 0;

        // Step 1: Initialize candies array with 1 candy for each child
        int[] candies = new int[n];
        for (int i = 0; i < n; i++) {
            candies[i] = 1;
        }

        // Step 2: Left-to-right pass
        // Ensure child with higher rating than left neighbor gets more candies
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                // Current child must have at least one more candy than left neighbor
                candies[i] = candies[i - 1] + 1;
            }
        }
        // After this pass: left constraints are satisfied

        // Step 3: Right-to-left pass
        // Ensure child with higher rating than right neighbor gets more candies
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                // Current child must have at least one more candy than right neighbor
                // But we also need to preserve any higher value from left pass
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
        }
        // After this pass: both left and right constraints are satisfied

        // Step 4: Return total candies
        int total = 0;
        for (int candy : candies) {
            total += candy;
        }
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: left-to-right and right-to-left.
- Each pass performs O(1) operations per element.
- Total operations: 2n → O(n).

**Space Complexity: O(n)**

- We store an array of n integers for the candy counts.
- This is necessary to remember intermediate results between passes.
- Could be optimized to O(1) with a more complex single-pass algorithm, but O(n) is typically acceptable.

## Common Mistakes

1. **Single pass only**: Attempting to handle both left and right constraints in one pass. This fails because when you encounter a child, you don't know what their right neighbor's final candy count will be. Always use two passes.

2. **Forgetting the max() in right pass**: In the right-to-left pass, you must use `max(current, right+1)` not just `right+1`. Otherwise, you might decrease a value that was correctly set higher by the left pass.

3. **Incorrect initialization**: Starting with 0 candies instead of 1. Every child must have at least one candy, regardless of ratings.

4. **Handling equal ratings incorrectly**: Children with equal ratings don't need to have the same number of candies. The requirement only applies to higher ratings. Many candidates mistakenly try to enforce equality.

5. **Off-by-one errors in loops**: In the right-to-left pass, starting at `n-1` instead of `n-2`, or using wrong comparison operators.

## When You'll See This Pattern

The **bidirectional constraint satisfaction with two passes** pattern appears in problems where each element's value depends on both left and right neighbors:

1. **Trapping Rain Water (Hard)**: Water trapped at each position depends on max height to left AND right. Solution uses left and right max arrays.

2. **Product of Array Except Self (Medium)**: Product at each position is product of all elements to left × product of all to right. Solution uses left and right product passes.

3. **Maximum Subarray Sum with One Deletion (Medium)**: Maximum sum ending at each position from left and right directions.

The pattern recognition: When a problem asks for values where each position depends on "both sides" of the array, consider whether left-to-right and right-to-left passes can compute partial results that you combine.

## Key Takeaways

1. **Bidirectional constraints often require two passes**: When each element depends on both neighbors, a single pass is insufficient because you lack information about one side.

2. **Greedy local optimization can lead to global optimum**: By satisfying left constraints optimally, then right constraints optimally, and taking the maximum, we achieve the minimum total candies.

3. **The max() operation is crucial**: In the second pass, you must preserve potentially higher values from the first pass to satisfy both constraints simultaneously.

4. **Start with minimum valid values**: Initialize with the minimum requirement (1 candy each), then increment only when constraints force you to.

Related problems: [Minimize Maximum Value in a Grid](/problem/minimize-maximum-value-in-a-grid), [Minimum Number of Operations to Satisfy Conditions](/problem/minimum-number-of-operations-to-satisfy-conditions), [Check if Grid Satisfies Conditions](/problem/check-if-grid-satisfies-conditions)
