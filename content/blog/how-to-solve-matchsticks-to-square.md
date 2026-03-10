---
title: "How to Solve Matchsticks to Square — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Matchsticks to Square. Medium difficulty, 41.6% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask."
date: "2028-08-30"
category: "dsa-patterns"
tags: ["matchsticks-to-square", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Matchsticks to Square

You're given an array of matchstick lengths and need to determine if you can arrange them to form a perfect square without breaking any sticks. The challenge is that you must use every matchstick exactly once, and all four sides of the square must be equal in length. This problem is tricky because it's essentially a 4-partition problem—you need to divide the sticks into four groups with equal sums—which is NP-hard in general.

## Visual Walkthrough

Let's trace through a concrete example: `matchsticks = [1, 1, 2, 2, 2]`

**Step 1: Calculate the total length**
Total = 1 + 1 + 2 + 2 + 2 = 8

**Step 2: Check if a square is possible**
For a square, the total must be divisible by 4: 8 ÷ 4 = 2
So each side must be exactly length 2.

**Step 3: Try to form four sides of length 2**
We need to partition the sticks into four groups, each summing to 2:

- Side 1: Use the stick of length 2
- Side 2: Use the other stick of length 2
- Side 3: Use the third stick of length 2
- Side 4: Use the two sticks of length 1 (1 + 1 = 2)

This works! We've used all sticks exactly once, and all four sides equal 2.

Now consider a failing example: `matchsticks = [3, 3, 3, 3, 4]`
Total = 16, so each side needs to be 4. But we have four sticks of length 3 and one of length 4. No matter how we arrange them, we can't make four sides of length 4. The longest stick (4) already equals a side, but the remaining sticks (3, 3, 3, 3) can't be arranged into three sides of 4.

## Brute Force Approach

The most straightforward approach is to try every possible assignment of each matchstick to one of the four sides. With n matchsticks, each stick has 4 choices (which side it belongs to), giving us 4ⁿ possibilities. For each assignment, we check if all four sides sum to the target length.

Why this fails: Even for modest n (like 15 matchsticks), 4¹⁵ = ~1 billion possibilities, which is far too slow. We need to prune the search space aggressively.

## Optimized Approach

The key insight is that this is a **backtracking with pruning** problem. We can think of it as building four "buckets" (the sides of the square) and placing each matchstick into one bucket. The optimization comes from several pruning techniques:

1. **Early termination**: If any side exceeds the target length, backtrack immediately.
2. **Sorting in descending order**: Try longer sticks first—they have fewer placement options, so we fail faster if a solution is impossible.
3. **Skip duplicates**: If a stick length doesn't fit in the current side and we've already tried placing a stick of the same length in this position, skip it.
4. **Side completion check**: Once we fill three sides to the target, the fourth must automatically work if we've used all sticks correctly.

The backtracking proceeds stick by stick: for each stick, try placing it in each side that has remaining capacity. If we place all sticks successfully, we've found a solution.

## Optimal Solution

<div class="code-group">

```python
# Time: O(4^n) worst case, but heavily pruned in practice
# Space: O(n) for recursion stack and side sums
def makesquare(matchsticks):
    # Step 1: Calculate total length and check basic conditions
    total = sum(matchsticks)

    # If total isn't divisible by 4, square is impossible
    if total % 4 != 0:
        return False

    # Target length for each side of the square
    target = total // 4

    # Step 2: Sort in descending order
    # Longer sticks have fewer placement options, so we fail faster
    matchsticks.sort(reverse=True)

    # Step 3: Initialize side sums (four sides of the square)
    sides = [0, 0, 0, 0]

    # Step 4: Backtracking function
    def backtrack(index):
        # Base case: all matchsticks placed
        if index == len(matchsticks):
            # Check if all sides equal target
            return all(side == target for side in sides)

        # Get current matchstick length
        stick = matchsticks[index]

        # Try placing current stick in each side
        for i in range(4):
            # Pruning: if adding this stick would exceed target, skip
            if sides[i] + stick > target:
                continue

            # Pruning: skip duplicate placements
            # If this side has the same length as a previous side we tried,
            # we'll get the same result, so skip
            j = i - 1
            while j >= 0 and sides[j] != sides[i]:
                j -= 1
            if j >= 0:
                continue

            # Place the stick in side i
            sides[i] += stick

            # Recurse to place next stick
            if backtrack(index + 1):
                return True

            # Backtrack: remove stick from side i
            sides[i] -= stick

        # No placement worked for this stick
        return False

    # Start backtracking from first stick
    return backtrack(0)
```

```javascript
// Time: O(4^n) worst case, but heavily pruned in practice
// Space: O(n) for recursion stack and side sums
function makesquare(matchsticks) {
  // Step 1: Calculate total length and check basic conditions
  const total = matchsticks.reduce((sum, val) => sum + val, 0);

  // If total isn't divisible by 4, square is impossible
  if (total % 4 !== 0) {
    return false;
  }

  // Target length for each side of the square
  const target = total / 4;

  // Step 2: Sort in descending order
  // Longer sticks have fewer placement options, so we fail faster
  matchsticks.sort((a, b) => b - a);

  // Step 3: Initialize side sums (four sides of the square)
  const sides = [0, 0, 0, 0];

  // Step 4: Backtracking function
  function backtrack(index) {
    // Base case: all matchsticks placed
    if (index === matchsticks.length) {
      // Check if all sides equal target
      return sides.every((side) => side === target);
    }

    // Get current matchstick length
    const stick = matchsticks[index];

    // Try placing current stick in each side
    for (let i = 0; i < 4; i++) {
      // Pruning: if adding this stick would exceed target, skip
      if (sides[i] + stick > target) {
        continue;
      }

      // Pruning: skip duplicate placements
      // If this side has the same length as a previous side we tried,
      // we'll get the same result, so skip
      let j = i - 1;
      while (j >= 0 && sides[j] !== sides[i]) {
        j--;
      }
      if (j >= 0) {
        continue;
      }

      // Place the stick in side i
      sides[i] += stick;

      // Recurse to place next stick
      if (backtrack(index + 1)) {
        return true;
      }

      // Backtrack: remove stick from side i
      sides[i] -= stick;
    }

    // No placement worked for this stick
    return false;
  }

  // Start backtracking from first stick
  return backtrack(0);
}
```

```java
// Time: O(4^n) worst case, but heavily pruned in practice
// Space: O(n) for recursion stack and side sums
class Solution {
    public boolean makesquare(int[] matchsticks) {
        // Step 1: Calculate total length and check basic conditions
        int total = 0;
        for (int stick : matchsticks) {
            total += stick;
        }

        // If total isn't divisible by 4, square is impossible
        if (total % 4 != 0) {
            return false;
        }

        // Target length for each side of the square
        int target = total / 4;

        // Step 2: Sort in descending order
        // Longer sticks have fewer placement options, so we fail faster
        // Convert to Integer array to sort in reverse order
        Integer[] sticks = new Integer[matchsticks.length];
        for (int i = 0; i < matchsticks.length; i++) {
            sticks[i] = matchsticks[i];
        }
        Arrays.sort(sticks, Collections.reverseOrder());

        // Step 3: Initialize side sums (four sides of the square)
        int[] sides = new int[4];

        // Step 4: Backtracking function
        return backtrack(0, sticks, sides, target);
    }

    private boolean backtrack(int index, Integer[] sticks, int[] sides, int target) {
        // Base case: all matchsticks placed
        if (index == sticks.length) {
            // Check if all sides equal target
            return sides[0] == target && sides[1] == target &&
                   sides[2] == target && sides[3] == target;
        }

        // Get current matchstick length
        int stick = sticks[index];

        // Try placing current stick in each side
        for (int i = 0; i < 4; i++) {
            // Pruning: if adding this stick would exceed target, skip
            if (sides[i] + stick > target) {
                continue;
            }

            // Pruning: skip duplicate placements
            // If this side has the same length as a previous side we tried,
            // we'll get the same result, so skip
            int j = i - 1;
            while (j >= 0 && sides[j] != sides[i]) {
                j--;
            }
            if (j >= 0) {
                continue;
            }

            // Place the stick in side i
            sides[i] += stick;

            // Recurse to place next stick
            if (backtrack(index + 1, sticks, sides, target)) {
                return true;
            }

            // Backtrack: remove stick from side i
            sides[i] -= stick;
        }

        // No placement worked for this stick
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(4ⁿ) in the worst case, where n is the number of matchsticks. However, with aggressive pruning (sorting in descending order, skipping duplicates, early termination), the actual runtime is much better in practice. The worst case occurs when all sticks are the same length and the target is large enough to accommodate many combinations.

**Space Complexity**: O(n) for the recursion stack depth (we recurse n levels deep) plus O(1) for the side sums array. The sorting operation typically uses O(log n) space for the sort algorithm's stack, but this is implementation-dependent.

## Common Mistakes

1. **Not checking divisibility by 4 first**: If the total sum isn't divisible by 4, return false immediately. This simple check can save a lot of computation.

2. **Forgetting to sort in descending order**: Trying shorter sticks first leads to exploring many dead ends. Longer sticks have fewer placement options, so placing them first prunes the search space dramatically.

3. **Missing the duplicate pruning**: When sides[i] equals sides[j] for j < i, placing a stick in side i will give the same result as placing it in side j, which we've already tried. Skipping these duplicates avoids redundant computation.

4. **Not handling the case where a stick is longer than the target**: If any individual stick is longer than the target side length, return false immediately—you can't break sticks to make them shorter.

## When You'll See This Pattern

This backtracking-with-pruning pattern appears in several partition and subset problems:

1. **Partition to K Equal Sum Subsets (LeetCode 698)**: Almost identical to this problem but generalized to K subsets instead of 4. The solution approach is exactly the same.

2. **Word Search (LeetCode 79)**: Uses backtracking to explore possible paths in a grid, with pruning when the current path doesn't match the target word.

3. **N-Queens (LeetCode 51)**: Places queens on a chessboard using backtracking, with pruning when a queen placement conflicts with previously placed queens.

The common thread is exploring a combinatorial space where brute force is too slow, but intelligent pruning makes the search feasible.

## Key Takeaways

1. **Backtracking with pruning** is essential for partition problems: When you need to divide elements into groups with constraints, backtrack while placing each element, and prune aggressively when constraints are violated.

2. **Order matters in backtracking**: Sorting elements (usually descending) and placing more constrained elements first dramatically reduces the search space.

3. **Look for symmetry reduction**: When groups are indistinguishable (like the four sides of a square), avoid exploring symmetric permutations by skipping duplicate placements.

Related problems: [Maximum Rows Covered by Columns](/problem/maximum-rows-covered-by-columns)
