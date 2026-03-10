---
title: "How to Solve Moving Stones Until Consecutive — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Moving Stones Until Consecutive. Medium difficulty, 52.1% acceptance rate. Topics: Math, Brainteaser."
date: "2029-02-26"
category: "dsa-patterns"
tags: ["moving-stones-until-consecutive", "math", "brainteaser", "medium"]
---

# How to Solve Moving Stones Until Consecutive

This problem asks us to find the minimum and maximum number of moves required to arrange three stones into consecutive positions on the X-axis. The tricky part is that moves are constrained: you can only move an endpoint stone (the smallest or largest position) to any unoccupied position between the current endpoints. This constraint makes the problem more interesting than simply calculating distances, as we need to consider the available empty slots between stones.

## Visual Walkthrough

Let's trace through an example with stones at positions `a=1`, `b=2`, `c=5`:

**Initial state:** Stones at positions 1, 2, and 5

- Endpoints: 1 (minimum) and 5 (maximum)
- Between endpoints: positions 2 (occupied), 3 (empty), 4 (empty)

**Minimum moves calculation:**

1. Check if stones are already consecutive: positions 1, 2, 3 would be consecutive, but we have 1, 2, 5 → not consecutive
2. Check if there's exactly one empty slot between two stones: positions 1 and 2 have no gap, positions 2 and 5 have gap of 2 (positions 3 and 4)
3. Since we have a gap of 2, we can fill it in 1 move by moving stone 5 to position 3 or 4
4. Minimum moves = 1

**Maximum moves calculation:**

1. Count total empty positions between endpoints: positions 3 and 4 are empty → 2 empty slots
2. Each move fills exactly one empty slot
3. Maximum moves = 2

So for input `[1,2,5]`, the answer is `[1,2]`.

Let's try another example: `a=4`, `b=3`, `c=2` (unsorted):

1. First sort: `[2,3,4]`
2. Stones are already consecutive (2,3,4)
3. Minimum moves = 0, maximum moves = 0

## Brute Force Approach

A naive approach might try to simulate all possible move sequences. For each move, we would:

1. Identify current endpoints (min and max positions)
2. Try moving the left endpoint to every empty position between current endpoints
3. Try moving the right endpoint to every empty position between current endpoints
4. Recursively explore all possibilities until stones are consecutive
5. Track minimum and maximum moves across all paths

This brute force approach has several problems:

- The number of possible moves grows exponentially
- There are infinite possible positions between endpoints (though practically limited by integer positions)
- We'd need to track visited states to avoid cycles
- The state space becomes unmanageable quickly

Even with pruning, this approach would be too slow and complex for what's essentially a mathematical problem.

## Optimized Approach

The key insight is that we don't need to simulate moves at all. We can calculate both answers directly using the sorted positions of the stones.

Let `x, y, z` be the sorted positions where `x ≤ y ≤ z`.

**For minimum moves:**

1. If stones are already consecutive (`z - x == 2`), we need 0 moves
2. If there's a gap of exactly 1 between any two stones (`y - x == 1` or `z - y == 1`), we can fill the other gap in 1 move
3. If there's a gap of exactly 1 between any two stones AND the third stone is adjacent to an endpoint, we might need 1 move
4. Otherwise, we need at most 2 moves (we can always make them consecutive in 2 moves by moving both endpoints)

Actually, we can simplify: The minimum moves is:

- 0 if already consecutive
- 1 if the gap between any two stones is ≤ 2 (we can place the third stone in the middle)
- 2 otherwise

**For maximum moves:**
Each move fills exactly one empty position between the endpoints. The maximum moves is simply the total number of empty positions between the sorted stones:

- Empty positions between x and y: `(y - x - 1)`
- Empty positions between y and z: `(z - y - 1)`
- Total maximum moves: `(y - x - 1) + (z - y - 1) = z - x - 2`

This works because we can always move stones one position at a time, filling empty slots from the outside in.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def numMovesStones(a, b, c):
    """
    Calculate minimum and maximum moves to make three stones consecutive.

    Args:
        a, b, c: Integer positions of the three stones

    Returns:
        List of two integers [min_moves, max_moves]
    """
    # Step 1: Sort the stone positions to easily identify endpoints
    stones = sorted([a, b, c])
    x, y, z = stones[0], stones[1], stones[2]

    # Step 2: Calculate maximum moves
    # Maximum moves = total empty positions between endpoints
    # Each move fills exactly one empty position
    max_moves = (z - x - 2)  # Equivalent to (y-x-1) + (z-y-1)

    # Step 3: Calculate minimum moves
    # Case 1: Stones are already consecutive
    if z - x == 2:
        min_moves = 0
    # Case 2: There's a gap of 1 or less between any two stones
    # We can place the third stone in between in one move
    elif y - x <= 2 or z - y <= 2:
        min_moves = 1
    # Case 3: All gaps are 2 or more
    # Need 2 moves (move both endpoints)
    else:
        min_moves = 2

    return [min_moves, max_moves]
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate minimum and maximum moves to make three stones consecutive.
 *
 * @param {number} a - Position of first stone
 * @param {number} b - Position of second stone
 * @param {number} c - Position of third stone
 * @return {number[]} Array of two integers [min_moves, max_moves]
 */
function numMovesStones(a, b, c) {
  // Step 1: Sort the stone positions to easily identify endpoints
  const stones = [a, b, c].sort((x, y) => x - y);
  const [x, y, z] = stones;

  // Step 2: Calculate maximum moves
  // Maximum moves = total empty positions between endpoints
  // Each move fills exactly one empty position
  const maxMoves = z - x - 2; // Equivalent to (y-x-1) + (z-y-1)

  // Step 3: Calculate minimum moves
  let minMoves;
  // Case 1: Stones are already consecutive
  if (z - x === 2) {
    minMoves = 0;
  }
  // Case 2: There's a gap of 1 or less between any two stones
  // We can place the third stone in between in one move
  else if (y - x <= 2 || z - y <= 2) {
    minMoves = 1;
  }
  // Case 3: All gaps are 2 or more
  // Need 2 moves (move both endpoints)
  else {
    minMoves = 2;
  }

  return [minMoves, maxMoves];
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate minimum and maximum moves to make three stones consecutive.
     *
     * @param a Position of first stone
     * @param b Position of second stone
     * @param c Position of third stone
     * @return Array of two integers {min_moves, max_moves}
     */
    public int[] numMovesStones(int a, int b, int c) {
        // Step 1: Sort the stone positions to easily identify endpoints
        int[] stones = {a, b, c};
        Arrays.sort(stones);
        int x = stones[0], y = stones[1], z = stones[2];

        // Step 2: Calculate maximum moves
        // Maximum moves = total empty positions between endpoints
        // Each move fills exactly one empty position
        int maxMoves = z - x - 2;  // Equivalent to (y-x-1) + (z-y-1)

        // Step 3: Calculate minimum moves
        int minMoves;
        // Case 1: Stones are already consecutive
        if (z - x == 2) {
            minMoves = 0;
        }
        // Case 2: There's a gap of 1 or less between any two stones
        // We can place the third stone in between in one move
        else if (y - x <= 2 || z - y <= 2) {
            minMoves = 1;
        }
        // Case 3: All gaps are 2 or more
        // Need 2 moves (move both endpoints)
        else {
            minMoves = 2;
        }

        return new int[]{minMoves, maxMoves};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- Sorting three elements takes constant time
- All calculations are simple arithmetic operations
- No loops or recursion that depend on input size

**Space Complexity:** O(1)

- We only store the three sorted positions and the result
- No additional data structures that grow with input
- Even the sorting can be done in-place with a few comparisons

The constant time and space complexity makes this solution extremely efficient regardless of input values.

## Common Mistakes

1. **Not sorting the positions first:** Many candidates try to work with `a, b, c` directly without sorting. This leads to complex conditional logic and often incorrect results. Always sort first to identify the minimum (x), middle (y), and maximum (z) positions.

2. **Incorrect minimum moves logic:** The most common error is oversimplifying the minimum moves calculation. Candidates often think:
   - "If gaps are both 1, then 0 moves" (correct)
   - "If any gap is 1, then 1 move" (incorrect - need to check if the other gap is ≤ 2)
   - "Otherwise 2 moves" (correct)

   The correct logic is: 0 if consecutive, 1 if any gap ≤ 2, otherwise 2.

3. **Off-by-one errors in maximum moves:** Some candidates calculate `(z - x - 1)` instead of `(z - x - 2)`. Remember: if stones are at positions 1 and 3, there's 1 empty position (2), not 2. The formula `z - x - 1` gives empty positions between TWO stones. For THREE stones, we subtract 2.

4. **Forgetting edge cases:**
   - All stones at the same position (impossible per problem constraints, but good to consider)
   - Stones already consecutive (should return [0, 0])
   - Stones with large gaps (algorithm should still work)

## When You'll See This Pattern

This problem teaches pattern recognition for **constrained movement problems** and **mathematical optimization**:

1. **Constrained Movement Problems:** Similar to problems where movement is restricted to certain directions or positions. Examples:
   - LeetCode 1041: "Robot Bounded In Circle" - robot movement with turning constraints
   - LeetCode 874: "Walking Robot Simulation" - robot with obstacle constraints

2. **Mathematical Optimization without Simulation:** Problems where the answer can be derived mathematically rather than through simulation. Examples:
   - LeetCode 292: "Nim Game" - winning strategy derived mathematically
   - LeetCode 319: "Bulb Switcher" - result derived from mathematical properties

3. **Endpoint Manipulation Problems:** Problems focusing on manipulating the minimum or maximum elements. Examples:
   - LeetCode 1046: "Last Stone Weight" - always manipulating the heaviest stones
   - LeetCode 1679: "Max Number of K-Sum Pairs" - often solved by sorting and using two pointers at ends

## Key Takeaways

1. **Sorting simplifies endpoint problems:** When a problem involves minimum/maximum elements or endpoints, sorting first often reveals the structure and simplifies the logic dramatically.

2. **Look for mathematical patterns before simulating:** Many "move" or "game" problems have mathematical solutions that are more efficient than simulation. Ask: "Can I derive a formula instead of simulating steps?"

3. **Break down into cases for minimum/maximum:** When asked for both minimum and maximum, they often require different reasoning strategies. Minimum moves usually involve clever placement, while maximum moves often involve slow, methodical filling of gaps.

[Practice this problem on CodeJeet](/problem/moving-stones-until-consecutive)
