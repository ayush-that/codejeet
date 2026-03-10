---
title: "How to Solve Maximum Building Height — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Building Height. Hard difficulty, 38.3% acceptance rate. Topics: Array, Math, Sorting."
date: "2026-06-06"
category: "dsa-patterns"
tags: ["maximum-building-height", "array", "math", "sorting", "hard"]
---

# How to Solve Maximum Building Height

This problem asks us to determine the maximum possible height for buildings arranged in a line, given constraints that limit the height differences between adjacent buildings. The tricky part is that we have two types of constraints: absolute height limits at specific buildings, and relative height differences between adjacent buildings (they can differ by at most 1). The challenge is satisfying all constraints simultaneously while maximizing heights.

## Visual Walkthrough

Let's trace through a small example: `n = 5`, `restrictions = [[2,1],[4,3]]`

We have 5 buildings (labeled 1 to 5) with these constraints:

- Building 2 has maximum height 1
- Building 4 has maximum height 3
- Adjacent buildings can differ by at most 1 in height

Let's think through this step by step:

1. **Initialize heights**: Start with no restrictions, we could make all buildings as tall as possible. But we have specific limits.

2. **Left-to-right pass**: Process buildings from left to right (1 to 5), respecting both the height limit at each building AND the constraint that height can't increase by more than 1 from the previous building.
   - Building 1: No restriction, so let's start with height 0 (minimum possible)
   - Building 2: Has restriction height ≤ 1. Also can't be more than height(1) + 1 = 0 + 1 = 1. So height = 1.
   - Building 3: No restriction. Can't be more than height(2) + 1 = 1 + 1 = 2. So height = 2.
   - Building 4: Has restriction height ≤ 3. Also can't be more than height(3) + 1 = 2 + 1 = 3. So height = 3.
   - Building 5: No restriction. Can't be more than height(4) + 1 = 3 + 1 = 4. So height = 4.

   This gives us heights: [0, 1, 2, 3, 4]

3. **Right-to-left pass**: Now process from right to left (5 to 1), respecting that height can't increase by more than 1 when going right to left (which is the same as saying it can't decrease by more than 1 when going left to right).
   - Building 5: Height is 4 from previous pass
   - Building 4: Has restriction height ≤ 3. Also can't be more than height(5) + 1 = 4 + 1 = 5. Minimum of 3 and current height 3 = 3.
   - Building 3: Can't be more than height(4) + 1 = 3 + 1 = 4. Current height is 2, so update to min(2, 4) = 2.
   - Building 2: Has restriction height ≤ 1. Also can't be more than height(3) + 1 = 2 + 1 = 3. Current height is 1, so stays 1.
   - Building 1: Can't be more than height(2) + 1 = 1 + 1 = 2. Current height is 0, so stays 0.

   Heights remain: [0, 1, 2, 3, 4]

4. **Find maximum**: The maximum height is 4 at building 5.

The key insight is that we need both passes because constraints propagate in both directions. A restriction at building i affects buildings to its left (they can't be too much taller than i) AND buildings to its right (they can't be too much taller than i).

## Brute Force Approach

A naive approach might try to test all possible height combinations, but with n up to 10^9, that's impossible. Another brute force would be to start with maximum possible heights and iteratively reduce heights that violate constraints until all constraints are satisfied.

Here's what that might look like:

1. Initialize all buildings to infinity (or a very large number)
2. Apply direct restrictions from the input
3. Repeatedly scan the buildings, reducing heights that violate the "adjacent difference ≤ 1" constraint
4. Continue until no more changes are needed

This approach has several problems:

- With n up to 10^9, we can't even store all heights in memory
- The iterative process could take O(n²) time in worst case
- It's not clear when to stop (could oscillate between values)

The brute force fails because it doesn't leverage the mathematical structure of the problem. We need a more efficient approach that handles the constraints in a single pass from each direction.

## Optimized Approach

The optimal solution uses a two-pass greedy approach:

**Key Insight**: The height constraints form a system of inequalities:

1. `height[i] ≤ restriction[i]` for restricted buildings
2. `|height[i] - height[i-1]| ≤ 1` for all adjacent buildings

These can be rewritten as:

- `height[i] ≤ height[i-1] + 1` (when moving left to right)
- `height[i-1] ≤ height[i] + 1` (which is equivalent to `height[i] ≥ height[i-1] - 1`)

But more usefully, when we process from right to left:

- `height[i] ≤ height[i+1] + 1`

**Two-Pass Strategy**:

1. **Left-to-right pass**: Process buildings in increasing order. For each building, its height is the minimum of:
   - Its restriction (if any)
   - The previous building's height + 1

   This ensures that when moving left to right, heights don't increase too quickly.

2. **Right-to-left pass**: Process buildings in decreasing order. For each building, update its height to the minimum of:
   - Its current height (from first pass)
   - The next building's height + 1

   This ensures that when moving right to left, heights don't increase too quickly (which is equivalent to ensuring they don't decrease too quickly when moving left to right).

3. **Why both passes are needed**: Consider a restriction at the far right that's very low. The left-to-right pass won't know about it. The right-to-left pass propagates that constraint leftward. Similarly, a restriction on the left affects buildings to its right, which is handled in the first pass.

**Optimization**: Since n can be up to 10^9, we can't process every building individually. However, restrictions are limited (at most 10^5). We only need to process at restriction points and the endpoints. Between restrictions, heights follow a simple pattern: they increase or decrease by at most 1 per step.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m log m) where m = len(restrictions) | Space: O(m)
def maxBuilding(self, n: int, restrictions: List[List[int]]) -> int:
    # Add restrictions for the first building (height must be 0)
    restrictions.append([1, 0])

    # Sort restrictions by building index
    restrictions.sort()

    # If the last building doesn't have a restriction, add a virtual one
    # with very large height limit (since no explicit restriction)
    if restrictions[-1][0] != n:
        restrictions.append([n, n - 1])  # n-1 is the maximum possible without restrictions

    # First pass: left to right
    m = len(restrictions)
    for i in range(1, m):
        # Current restriction index and height limit
        idx_curr, limit_curr = restrictions[i]
        # Previous restriction index and height limit
        idx_prev, limit_prev = restrictions[i - 1]

        # The height at current building can't exceed:
        # 1. Its own height limit
        # 2. Previous building's height + distance between them
        # (since height can increase by at most 1 per step)
        restrictions[i][1] = min(limit_curr,
                                 limit_prev + (idx_curr - idx_prev))

    # Second pass: right to left
    for i in range(m - 2, -1, -1):
        idx_curr, limit_curr = restrictions[i]
        idx_next, limit_next = restrictions[i + 1]

        # The height at current building can't exceed:
        # 1. Its current height (from first pass)
        # 2. Next building's height + distance between them
        restrictions[i][1] = min(limit_curr,
                                 limit_next + (idx_next - idx_curr))

    # Find maximum height between each pair of restrictions
    max_height = 0
    for i in range(1, m):
        idx_curr, limit_curr = restrictions[i]
        idx_prev, limit_prev = restrictions[i - 1]

        # Distance between these restriction points
        distance = idx_curr - idx_prev

        # The maximum height between two points occurs at the midpoint
        # where both sides can "grow" toward each other
        # Formula: max_height = min(h1, h2) + (distance + |h1 - h2|) // 2
        height_diff = abs(limit_curr - limit_prev)

        # If one side is much higher, the peak is limited by the lower side
        # plus the distance needed to reach it
        if height_diff > distance:
            # One side dominates, maximum is min(h1, h2) + distance
            max_between = min(limit_curr, limit_prev) + distance
        else:
            # Both sides contribute to a peak in the middle
            # The extra distance after equalizing heights is split between both sides
            max_between = (limit_curr + limit_prev + distance) // 2

        max_height = max(max_height, max_between)

    return max_height
```

```javascript
// Time: O(m log m) where m = restrictions.length | Space: O(m)
function maxBuilding(n, restrictions) {
  // Add restriction for first building (height must be 0)
  restrictions.push([1, 0]);

  // Sort restrictions by building index
  restrictions.sort((a, b) => a[0] - b[0]);

  // If last building doesn't have restriction, add a virtual one
  if (restrictions[restrictions.length - 1][0] !== n) {
    restrictions.push([n, n - 1]); // n-1 is maximum possible
  }

  // First pass: left to right
  for (let i = 1; i < restrictions.length; i++) {
    const [idxCurr, limitCurr] = restrictions[i];
    const [idxPrev, limitPrev] = restrictions[i - 1];

    // Height can't exceed previous height + distance between buildings
    restrictions[i][1] = Math.min(limitCurr, limitPrev + (idxCurr - idxPrev));
  }

  // Second pass: right to left
  for (let i = restrictions.length - 2; i >= 0; i--) {
    const [idxCurr, limitCurr] = restrictions[i];
    const [idxNext, limitNext] = restrictions[i + 1];

    // Height can't exceed next height + distance between buildings
    restrictions[i][1] = Math.min(limitCurr, limitNext + (idxNext - idxCurr));
  }

  // Find maximum height between restriction points
  let maxHeight = 0;
  for (let i = 1; i < restrictions.length; i++) {
    const [idxCurr, limitCurr] = restrictions[i];
    const [idxPrev, limitPrev] = restrictions[i - 1];

    const distance = idxCurr - idxPrev;
    const heightDiff = Math.abs(limitCurr - limitPrev);

    let maxBetween;
    if (heightDiff > distance) {
      // One side is much higher, limited by lower side + distance
      maxBetween = Math.min(limitCurr, limitPrev) + distance;
    } else {
      // Peak occurs in the middle where both sides meet
      // Formula: (h1 + h2 + distance) / 2
      maxBetween = Math.floor((limitCurr + limitPrev + distance) / 2);
    }

    maxHeight = Math.max(maxHeight, maxBetween);
  }

  return maxHeight;
}
```

```java
// Time: O(m log m) where m = restrictions.length | Space: O(m)
public int maxBuilding(int n, int[][] restrictions) {
    // Add restriction for first building (height must be 0)
    List<int[]> restrictionList = new ArrayList<>();
    for (int[] restriction : restrictions) {
        restrictionList.add(restriction);
    }
    restrictionList.add(new int[]{1, 0});

    // Sort restrictions by building index
    restrictionList.sort((a, b) -> Integer.compare(a[0], b[0]));

    // If last building doesn't have restriction, add a virtual one
    if (restrictionList.get(restrictionList.size() - 1)[0] != n) {
        restrictionList.add(new int[]{n, n - 1}); // n-1 is maximum possible
    }

    // Convert back to array for easier indexing
    int[][] restArray = restrictionList.toArray(new int[0][0]);
    int m = restArray.length;

    // First pass: left to right
    for (int i = 1; i < m; i++) {
        int idxCurr = restArray[i][0];
        int limitCurr = restArray[i][1];
        int idxPrev = restArray[i - 1][0];
        int limitPrev = restArray[i - 1][1];

        // Height can't exceed previous height + distance between buildings
        restArray[i][1] = Math.min(limitCurr, limitPrev + (idxCurr - idxPrev));
    }

    // Second pass: right to left
    for (int i = m - 2; i >= 0; i--) {
        int idxCurr = restArray[i][0];
        int limitCurr = restArray[i][1];
        int idxNext = restArray[i + 1][0];
        int limitNext = restArray[i + 1][1];

        // Height can't exceed next height + distance between buildings
        restArray[i][1] = Math.min(limitCurr, limitNext + (idxNext - idxCurr));
    }

    // Find maximum height between restriction points
    int maxHeight = 0;
    for (int i = 1; i < m; i++) {
        int idxCurr = restArray[i][0];
        int limitCurr = restArray[i][1];
        int idxPrev = restArray[i - 1][0];
        int limitPrev = restArray[i - 1][1];

        int distance = idxCurr - idxPrev;
        int heightDiff = Math.abs(limitCurr - limitPrev);

        int maxBetween;
        if (heightDiff > distance) {
            // One side is much higher, limited by lower side + distance
            maxBetween = Math.min(limitCurr, limitPrev) + distance;
        } else {
            // Peak occurs in the middle where both sides meet
            // Formula: (h1 + h2 + distance) / 2
            maxBetween = (limitCurr + limitPrev + distance) / 2;
        }

        maxHeight = Math.max(maxHeight, maxBetween);
    }

    return maxHeight;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m log m) where m is the number of restrictions. The dominant operation is sorting the restrictions. The two passes through the restrictions and the final maximum calculation are both O(m).

**Space Complexity**: O(m) for storing the restrictions. We modify the restrictions array in place, so no additional space is needed beyond the input storage.

Why not O(n)? Because n can be up to 10^9, but we only have at most 10^5 restrictions. By only processing at restriction points and endpoints, we avoid iterating through all n buildings.

## Common Mistakes

1. **Not handling the first building's height constraint**: The problem states the first building must have height 0, but this isn't always included in the restrictions array. Forgetting to add this constraint will lead to incorrect results.

2. **Only doing one pass**: Some candidates try to solve with only a left-to-right or only a right-to-left pass. This misses constraints that propagate from the opposite direction. Always remember that height limits affect buildings on both sides.

3. **Incorrect maximum calculation between restrictions**: After the two passes, we know heights at restriction points, but need to find the maximum height that could occur between them. The formula `(h1 + h2 + distance) / 2` only works when `|h1 - h2| ≤ distance`. When one side is much higher, the maximum is simply `min(h1, h2) + distance`.

4. **Not sorting restrictions**: The restrictions can come in any order. Failing to sort them by building index will break the two-pass algorithm, which relies on processing buildings in order.

## When You'll See This Pattern

This two-pass greedy approach with constraint propagation appears in several constraint satisfaction problems:

1. **Candy (LeetCode 135)**: Similar two-pass approach where you give more candy to children with higher ratings than their neighbors.

2. **Trapping Rain Water (LeetCode 42)**: Uses two passes to find the maximum height to the left and right of each position, though for a different purpose.

3. **Product of Array Except Self (LeetCode 238)**: Uses left-to-right and right-to-left passes to compute products without division.

The common pattern is when you have local constraints that affect both directions, and you need to satisfy all constraints simultaneously. The two-pass approach lets you handle constraints from each direction separately.

## Key Takeaways

1. **When you have constraints propagating in both directions, consider a two-pass approach**: Process left-to-right to handle constraints from the left, then right-to-left to handle constraints from the right.

2. **For problems with sparse constraints, only process at constraint points**: When n is large but constraints are few, design your algorithm to work only at the points where something changes, not at every position.

3. **The maximum between two constrained points often occurs at the midpoint**: When both sides can "grow" toward each other at rate 1, the peak occurs where they meet, which is at the average of their heights plus half the distance.

Related problems: [Find Maximum Value in a Constrained Sequence](/problem/find-maximum-value-in-a-constrained-sequence)
