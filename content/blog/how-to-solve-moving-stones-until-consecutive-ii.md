---
title: "How to Solve Moving Stones Until Consecutive II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Moving Stones Until Consecutive II. Medium difficulty, 58.7% acceptance rate. Topics: Array, Math, Sliding Window, Sorting."
date: "2026-02-04"
category: "dsa-patterns"
tags: ["moving-stones-until-consecutive-ii", "array", "math", "sliding-window", "medium"]
---

# How to Solve Moving Stones Until Consecutive II

You're given an array of stone positions on a number line. In each move, you can pick up either the smallest or largest stone (an "endpoint stone") and move it to any unoccupied integer position. The goal is to find both the **minimum** and **maximum** number of moves required to arrange all stones into consecutive positions (like [x, x+1, x+2, ...]).

What makes this problem tricky is that it's not about simulating moves—that would be too slow. Instead, it's about finding clever mathematical bounds. The minimum moves calculation involves a sliding window approach, while the maximum moves calculation uses a clever observation about endpoint gaps.

## Visual Walkthrough

Let's trace through an example: `stones = [7, 4, 9, 1]`

**Step 1: Sort the stones**
Sorted: `[1, 4, 7, 9]`

**Step 2: Understanding the moves**
We can only move endpoint stones (1 or 9 initially), and we can place them anywhere that's unoccupied.

**Step 3: Maximum moves intuition**
For maximum moves, we want to make as many moves as possible. The key insight: each move can only reduce the gap between endpoints by 1. The initial gap between endpoints is `9 - 1 = 8`. We have 4 stones that need to occupy 4 consecutive positions, so the final gap will be `3` (since positions [x, x+1, x+2, x+3] have gap 3).

Maximum moves = initial gap - final gap = `8 - 3 = 5`

But wait—there's a catch! If we have consecutive stones at the beginning or end, we might not be able to use all those moves. Let's calculate properly:

Left gap = `4 - 1 = 3` (gap between first two stones)
Right gap = `9 - 7 = 2` (gap between last two stones)

We can choose to minimize the smaller gap: `min(3, 2) = 2`
Maximum moves = `(9 - 1) - (4 - 1) + 1 - min(3, 2)` = `8 - 3 + 1 - 2 = 4`

**Step 4: Minimum moves intuition**
For minimum moves, we need to find the smallest window of consecutive positions that contains as many stones as possible. We use a sliding window:

- Window [1, 4, 7] has size 3, needs 1 empty spot filled
- Window [4, 7, 9] has size 3, needs 1 empty spot filled
- Window [1, 4, 7, 9] has size 4, needs 3 empty spots filled

The best window has 3 stones with 1 empty spot. But there's a special case: if we have n-1 consecutive stones with one outlier, we might need 2 moves instead of 1.

## Brute Force Approach

A naive approach would try to simulate all possible move sequences, but this is impossible because:

1. The number of possible moves at each step grows combinatorially
2. Stones can be placed at any unoccupied integer position
3. We need to find both minimum AND maximum moves

Even if we tried to brute force just the minimum moves by checking all possible final consecutive positions, we'd have O(range × n) operations where range could be up to 10^9. This is clearly infeasible.

The brute force teaches us that we need mathematical reasoning, not simulation.

## Optimized Approach

The key insights:

**For maximum moves:**

1. Sort the stones first
2. The total number of empty spots between endpoints is `stones[n-1] - stones[0] + 1 - n`
3. We can fill these empty spots one by one, but we might be limited by consecutive stones at the ends
4. We calculate gaps at both ends and subtract the smaller gap (minus 1) from our total available moves

**For minimum moves:**

1. Use a sliding window to find the largest number of stones that can fit in some window of size n
2. A window of size n that contains k stones needs `n - k` moves to fill it
3. Special case: if we have n-1 consecutive stones and one outlier at the end, we might need 2 moves instead of 1

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def numMovesStonesII(stones):
    """
    Calculate minimum and maximum moves to arrange stones consecutively.

    Args:
        stones: List[int] - positions of stones on the number line

    Returns:
        List[int] - [minimum_moves, maximum_moves]
    """
    # Step 1: Sort the stones to work with ordered positions
    stones.sort()
    n = len(stones)

    # Step 2: Calculate maximum moves
    # Total empty spots between first and last stone
    total_empty = stones[-1] - stones[0] + 1 - n

    # Left gap: space between first two stones (minus 1 for the gap size)
    left_gap = stones[1] - stones[0] - 1
    # Right gap: space between last two stones (minus 1 for the gap size)
    right_gap = stones[-1] - stones[-2] - 1

    # Maximum moves: we can fill all empty spots except we might be limited
    # by consecutive stones at one end. We choose the smaller gap to minimize limitation.
    max_moves = total_empty - min(left_gap, right_gap)

    # Step 3: Calculate minimum moves using sliding window
    min_moves = float('inf')

    # Use two pointers for sliding window
    j = 0
    for i in range(n):
        # Expand window until it's too large (size > n)
        while j < n and stones[j] - stones[i] + 1 <= n:
            j += 1

        # Number of stones in current window [i, j-1]
        stones_in_window = j - i

        # Case 1: We have n-1 stones in a window of size n
        if stones_in_window == n - 1 and stones[j-1] - stones[i] + 1 == n - 1:
            # Special case: need 2 moves if window has n-1 consecutive stones
            min_moves = min(min_moves, 2)
        else:
            # General case: need to fill empty spots in window
            min_moves = min(min_moves, n - stones_in_window)

    return [min_moves, max_moves]
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
/**
 * Calculate minimum and maximum moves to arrange stones consecutively.
 *
 * @param {number[]} stones - positions of stones on the number line
 * @return {number[]} - [minimum_moves, maximum_moves]
 */
function numMovesStonesII(stones) {
  // Step 1: Sort the stones to work with ordered positions
  stones.sort((a, b) => a - b);
  const n = stones.length;

  // Step 2: Calculate maximum moves
  // Total empty spots between first and last stone
  const totalEmpty = stones[n - 1] - stones[0] + 1 - n;

  // Left gap: space between first two stones (minus 1 for the gap size)
  const leftGap = stones[1] - stones[0] - 1;
  // Right gap: space between last two stones (minus 1 for the gap size)
  const rightGap = stones[n - 1] - stones[n - 2] - 1;

  // Maximum moves: we can fill all empty spots except we might be limited
  // by consecutive stones at one end. We choose the smaller gap to minimize limitation.
  const maxMoves = totalEmpty - Math.min(leftGap, rightGap);

  // Step 3: Calculate minimum moves using sliding window
  let minMoves = Infinity;

  // Use two pointers for sliding window
  let j = 0;
  for (let i = 0; i < n; i++) {
    // Expand window until it's too large (size > n)
    while (j < n && stones[j] - stones[i] + 1 <= n) {
      j++;
    }

    // Number of stones in current window [i, j-1]
    const stonesInWindow = j - i;

    // Case 1: We have n-1 stones in a window of size n
    if (stonesInWindow === n - 1 && stones[j - 1] - stones[i] + 1 === n - 1) {
      // Special case: need 2 moves if window has n-1 consecutive stones
      minMoves = Math.min(minMoves, 2);
    } else {
      // General case: need to fill empty spots in window
      minMoves = Math.min(minMoves, n - stonesInWindow);
    }
  }

  return [minMoves, maxMoves];
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    /**
     * Calculate minimum and maximum moves to arrange stones consecutively.
     *
     * @param stones - positions of stones on the number line
     * @return int[] - [minimum_moves, maximum_moves]
     */
    public int[] numMovesStonesII(int[] stones) {
        // Step 1: Sort the stones to work with ordered positions
        Arrays.sort(stones);
        int n = stones.length;

        // Step 2: Calculate maximum moves
        // Total empty spots between first and last stone
        int totalEmpty = stones[n - 1] - stones[0] + 1 - n;

        // Left gap: space between first two stones (minus 1 for the gap size)
        int leftGap = stones[1] - stones[0] - 1;
        // Right gap: space between last two stones (minus 1 for the gap size)
        int rightGap = stones[n - 1] - stones[n - 2] - 1;

        // Maximum moves: we can fill all empty spots except we might be limited
        // by consecutive stones at one end. We choose the smaller gap to minimize limitation.
        int maxMoves = totalEmpty - Math.min(leftGap, rightGap);

        // Step 3: Calculate minimum moves using sliding window
        int minMoves = Integer.MAX_VALUE;

        // Use two pointers for sliding window
        int j = 0;
        for (int i = 0; i < n; i++) {
            // Expand window until it's too large (size > n)
            while (j < n && stones[j] - stones[i] + 1 <= n) {
                j++;
            }

            // Number of stones in current window [i, j-1]
            int stonesInWindow = j - i;

            // Case 1: We have n-1 stones in a window of size n
            if (stonesInWindow == n - 1 && stones[j - 1] - stones[i] + 1 == n - 1) {
                // Special case: need 2 moves if window has n-1 consecutive stones
                minMoves = Math.min(minMoves, 2);
            } else {
                // General case: need to fill empty spots in window
                minMoves = Math.min(minMoves, n - stonesInWindow);
            }
        }

        return new int[]{minMoves, maxMoves};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the stones takes O(n log n) time
- The sliding window for minimum moves takes O(n) time (each stone is visited at most twice)
- Maximum moves calculation takes O(1) time after sorting

**Space Complexity:** O(1) or O(n) depending on sorting implementation

- In-place sorting (like quicksort) uses O(1) extra space
- Stable sorting (like mergesort) uses O(n) extra space
- Our algorithm uses only a few extra variables beyond the sorted array

## Common Mistakes

1. **Forgetting to sort:** The problem doesn't guarantee sorted input, but all our calculations depend on stones being in order. Always sort first.

2. **Missing the special case in minimum moves:** When you have n-1 stones that are already consecutive, you might think you only need 1 move. But if the outlier stone is at the very end, you actually need 2 moves. Example: [1, 2, 3, 10] needs 2 moves, not 1.

3. **Incorrect maximum moves formula:** A common mistake is using `(stones[-1] - stones[0] + 1 - n)` directly as the answer. This doesn't account for the limitation when there are consecutive stones at the ends. You must subtract `min(left_gap, right_gap)`.

4. **Off-by-one errors in gap calculations:** Remember that the gap between positions x and y is `y - x - 1`, not `y - x`. For example, positions 1 and 4 have a gap of 2 empty spots (positions 2 and 3).

## When You'll See This Pattern

This problem combines **sliding window** with **mathematical reasoning about bounds**. You'll see similar patterns in:

1. **Minimum Number of Operations to Make Array Continuous (Hard)** - Almost identical! You're given an array and need to make it consecutive by changing elements. Uses the same sliding window approach to find the largest subset that can fit in a window.

2. **Longest Repeating Character Replacement (Medium)** - Uses sliding window to find the longest substring with at most k replacements. The window expansion/contraction logic is similar.

3. **Fruit Into Baskets (Medium)** - Another sliding window problem where you maintain a window with at most 2 types of fruits.

The key pattern: when you need to find a "window" containing the "best" subset according to some constraint, sliding window is often the solution.

## Key Takeaways

1. **Sorting transforms spatial problems into sequence problems:** When dealing with positions on a line, sorting is almost always the first step. It lets you reason about neighbors and gaps.

2. **Sliding window finds optimal contiguous subsets:** When you need to find a subset that fits within a certain range, sliding window with two pointers gives you O(n) solution after sorting.

3. **Maximum vs minimum often need different approaches:** Don't assume the same strategy works for both. Here, maximum uses gap analysis while minimum uses sliding window.

Related problems: [Minimum Number of Operations to Make Array Continuous](/problem/minimum-number-of-operations-to-make-array-continuous)
