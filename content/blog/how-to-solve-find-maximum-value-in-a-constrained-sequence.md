---
title: "How to Solve Find Maximum Value in a Constrained Sequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Maximum Value in a Constrained Sequence. Medium difficulty, 62.2% acceptance rate. Topics: Array, Greedy."
date: "2026-03-25"
category: "dsa-patterns"
tags: ["find-maximum-value-in-a-constrained-sequence", "array", "greedy", "medium"]
---

# How to Solve Find Maximum Value in a Constrained Sequence

You need to construct a sequence of length `n` starting with `a[0] = 0`, where adjacent elements differ by at most `diff[i]`, while also satisfying position-value restrictions. The goal is to maximize the final element `a[n-1]`. What makes this tricky is balancing two competing constraints: the incremental differences between consecutive elements and absolute restrictions at specific positions.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
n = 5
restrictions = [[2, 3], [4, 1]]
diff = [2, 1, 3, 2]
```

We need to build sequence `a[0..4]` where:

- `a[0] = 0` (given)
- `|a[i+1] - a[i]| ≤ diff[i]` for i = 0..3
- `a[2] ≤ 3` and `a[4] ≤ 1` (from restrictions)

**Step 1: Forward pass (left to right)**
We compute the maximum possible value at each position if we only consider constraints from the left:

- `a[0] = 0` (base case)
- `a[1] ≤ a[0] + diff[0] = 0 + 2 = 2`
- `a[2] ≤ min(a[1] + diff[1], restriction[2]=3) = min(2+1, 3) = 3`
- `a[3] ≤ a[2] + diff[2] = 3 + 3 = 6`
- `a[4] ≤ min(a[3] + diff[3], restriction[4]=1) = min(6+2, 1) = 1`

So forward maximums: `[0, 2, 3, 6, 1]`

**Step 2: Backward pass (right to left)**
Now we propagate constraints from the right to ensure we can actually reach each value:

- `a[4] = 1` (from forward pass)
- `a[3] ≤ min(a[4] + diff[3], forward[3]=6) = min(1+2, 6) = 3`
- `a[2] ≤ min(a[3] + diff[2], forward[2]=3) = min(3+3, 3) = 3`
- `a[1] ≤ min(a[2] + diff[1], forward[1]=2) = min(3+1, 2) = 2`
- `a[0] = 0` (unchanged)

Final sequence: `[0, 2, 3, 3, 1]`

The maximum `a[4]` we can achieve is 1. Notice how the restriction at position 4 forced us to lower earlier values in the backward pass.

## Brute Force Approach

A naive approach would try to explore all possible sequences. Since each position's value depends on the previous position and the `diff` constraint, we could use recursion or backtracking:

1. Start with `a[0] = 0`
2. For each position `i` from 1 to n-1:
   - Try all values from `a[i-1] - diff[i-1]` to `a[i-1] + diff[i-1]`
   - Check if the value satisfies any restriction at position `i`
3. Track the maximum `a[n-1]` across all valid sequences

The problem is the branching factor: at each step we have up to `2*diff[i] + 1` possibilities. In the worst case where `diff[i]` is large, this becomes exponential time O(k^n) where k depends on diff values. Even for moderate n=1000, this is completely infeasible.

## Optimized Approach

The key insight is that constraints propagate in both directions:

1. **Left-to-right**: Each position's maximum is limited by what came before it plus the diff constraint
2. **Right-to-left**: Each position's maximum is limited by what comes after it plus the diff constraint

We need to satisfy both directions simultaneously. The optimal approach:

1. Initialize an array `maxVals` where `maxVals[i]` is the maximum possible value at position i
2. **First pass (left to right)**:
   - Start with `maxVals[0] = 0`
   - For i from 1 to n-1: `maxVals[i] = maxVals[i-1] + diff[i-1]`
   - Apply restrictions: if position i has a restriction r, set `maxVals[i] = min(maxVals[i], r)`
3. **Second pass (right to left)**:
   - For i from n-2 down to 0: `maxVals[i] = min(maxVals[i], maxVals[i+1] + diff[i])`
   - This ensures we can reach the next position's value
4. The answer is `maxVals[n-1]`

Why does this work? After the first pass, we have the maximum each position could be if we only considered constraints from the left. But some of these values might be too high to allow reaching restricted positions later. The backward pass corrects this by propagating constraints backward.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def find_maximum_value(n, restrictions, diff):
    """
    Find the maximum possible value at the last position of a constrained sequence.

    Args:
        n: Length of the sequence
        restrictions: List of [position, max_value] pairs
        diff: List of length n-1, maximum difference between consecutive elements

    Returns:
        Maximum possible value at position n-1
    """
    # Step 1: Initialize maxVals array with infinity (unconstrained values)
    maxVals = [float('inf')] * n
    maxVals[0] = 0  # Base condition: first element must be 0

    # Step 2: Apply restrictions to create initial bounds
    for pos, limit in restrictions:
        maxVals[pos] = min(maxVals[pos], limit)

    # Step 3: Forward pass (left to right)
    # Propagate constraints from left to right using diff limits
    for i in range(1, n):
        # Current position is limited by previous position plus diff
        maxVals[i] = min(maxVals[i], maxVals[i-1] + diff[i-1])

    # Step 4: Backward pass (right to left)
    # Propagate constraints from right to left to ensure reachability
    for i in range(n-2, -1, -1):
        # Current position is limited by next position plus diff
        maxVals[i] = min(maxVals[i], maxVals[i+1] + diff[i])

    # Step 5: Return the maximum value at the last position
    return maxVals[n-1]
```

```javascript
// Time: O(n) | Space: O(n)
function findMaximumValue(n, restrictions, diff) {
  /**
   * Find the maximum possible value at the last position of a constrained sequence.
   *
   * @param {number} n - Length of the sequence
   * @param {number[][]} restrictions - Array of [position, max_value] pairs
   * @param {number[]} diff - Array of length n-1, maximum difference between consecutive elements
   * @return {number} Maximum possible value at position n-1
   */

  // Step 1: Initialize maxVals array with Infinity (unconstrained values)
  const maxVals = new Array(n).fill(Infinity);
  maxVals[0] = 0; // Base condition: first element must be 0

  // Step 2: Apply restrictions to create initial bounds
  for (const [pos, limit] of restrictions) {
    maxVals[pos] = Math.min(maxVals[pos], limit);
  }

  // Step 3: Forward pass (left to right)
  // Propagate constraints from left to right using diff limits
  for (let i = 1; i < n; i++) {
    // Current position is limited by previous position plus diff
    maxVals[i] = Math.min(maxVals[i], maxVals[i - 1] + diff[i - 1]);
  }

  // Step 4: Backward pass (right to left)
  // Propagate constraints from right to left to ensure reachability
  for (let i = n - 2; i >= 0; i--) {
    // Current position is limited by next position plus diff
    maxVals[i] = Math.min(maxVals[i], maxVals[i + 1] + diff[i]);
  }

  // Step 5: Return the maximum value at the last position
  return maxVals[n - 1];
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.Arrays;

public class Solution {
    public int findMaximumValue(int n, int[][] restrictions, int[] diff) {
        /**
         * Find the maximum possible value at the last position of a constrained sequence.
         *
         * @param n Length of the sequence
         * @param restrictions Array of [position, max_value] pairs
         * @param diff Array of length n-1, maximum difference between consecutive elements
         * @return Maximum possible value at position n-1
         */

        // Step 1: Initialize maxVals array with large value (unconstrained values)
        int[] maxVals = new int[n];
        Arrays.fill(maxVals, Integer.MAX_VALUE);
        maxVals[0] = 0;  // Base condition: first element must be 0

        // Step 2: Apply restrictions to create initial bounds
        for (int[] restriction : restrictions) {
            int pos = restriction[0];
            int limit = restriction[1];
            maxVals[pos] = Math.min(maxVals[pos], limit);
        }

        // Step 3: Forward pass (left to right)
        // Propagate constraints from left to right using diff limits
        for (int i = 1; i < n; i++) {
            // Current position is limited by previous position plus diff
            // Use long to prevent integer overflow during addition
            long candidate = (long) maxVals[i-1] + diff[i-1];
            maxVals[i] = (int) Math.min(maxVals[i], candidate);
        }

        // Step 4: Backward pass (right to left)
        // Propagate constraints from right to left to ensure reachability
        for (int i = n - 2; i >= 0; i--) {
            // Current position is limited by next position plus diff
            // Use long to prevent integer overflow during addition
            long candidate = (long) maxVals[i+1] + diff[i];
            maxVals[i] = (int) Math.min(maxVals[i], candidate);
        }

        // Step 5: Return the maximum value at the last position
        return maxVals[n-1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array of size n: one forward and one backward
- Applying restrictions takes O(m) where m is the number of restrictions, but m ≤ n
- Overall linear time O(n)

**Space Complexity: O(n)**

- We store the `maxVals` array of size n
- No other significant data structures are used
- Could be optimized to O(1) if we only needed the final value, but we need all values during the backward pass

## Common Mistakes

1. **Only doing one pass**: Candidates often forget the backward pass. They compute forward maximums but don't realize that a high early value might make it impossible to satisfy a strict restriction later. Always check if constraints propagate in both directions.

2. **Incorrect initialization**: Forgetting to initialize `maxVals[0] = 0` or using 0 instead of infinity for other positions. Unconstrained positions should start with the maximum possible value (infinity or a large number).

3. **Integer overflow**: When adding `diff[i]` to current values, especially in Java, the sum might exceed `Integer.MAX_VALUE`. Use `long` for intermediate calculations or check bounds carefully.

4. **Misunderstanding restrictions**: Restrictions give maximum values (`a[i] ≤ limit`), not exact values. Some candidates treat them as equality constraints. Read the problem statement carefully: "satisfies the restrictions" means the value at that position must be ≤ the given limit.

## When You'll See This Pattern

This "constraint propagation in both directions" pattern appears in problems where you have:

1. Incremental constraints between adjacent elements
2. Absolute constraints at specific positions
3. Need to find maximum/minimum feasible values

**Related problems:**

1. **Maximum Building Height (LeetCode 1840)**: Almost identical pattern - buildings have height restrictions and adjacent height differences are limited. The solution uses the same two-pass constraint propagation.

2. **Candy (LeetCode 135)**: While not identical, it uses similar two-pass logic to satisfy "higher rating gets more candy" constraints in both directions.

3. **Trapping Rain Water (LeetCode 42)**: Uses left and right passes to compute maximum heights, though for a different purpose (water trapping rather than constraint satisfaction).

## Key Takeaways

1. **When constraints flow both ways, make two passes**: If a problem has constraints that depend on both previous and next elements, consider solving it with a left-to-right pass followed by a right-to-left pass (or vice versa).

2. **Initialize with extreme values**: When computing maximums, initialize with infinity (or a very large number). When computing minimums, initialize with negative infinity (or a very small number). This ensures constraints properly tighten the bounds.

3. **Visualize constraint propagation**: Draw the sequence and trace how restrictions at one position affect neighboring positions. This helps recognize when bidirectional propagation is needed.

Related problems: [Maximum Building Height](/problem/maximum-building-height)
