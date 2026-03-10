---
title: "How to Solve Furthest Point From Origin — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Furthest Point From Origin. Easy difficulty, 65.3% acceptance rate. Topics: String, Counting."
date: "2028-04-18"
category: "dsa-patterns"
tags: ["furthest-point-from-origin", "string", "counting", "easy"]
---

# How to Solve Furthest Point From Origin

This problem asks you to find the maximum possible distance from the origin after processing a string of moves where some moves are fixed (`'L'` or `'R'`) and others are wildcards (`'_'`) that you can choose to be either left or right. The interesting twist is that you can strategically choose the wildcard directions to maximize your final distance from the starting point.

## Visual Walkthrough

Let's trace through an example: `moves = "L_RL_"`

Starting at position 0:

- Move 1: `'L'` → must move left to position -1
- Move 2: `'_'` → we can choose! To maximize distance from origin, we should move away from 0. Since we're at -1, moving left (to -2) takes us further from 0 than moving right (back to 0).
- Move 3: `'R'` → must move right to position -1
- Move 4: `'L'` → must move left to position -2
- Move 5: `'_'` → we're at -2, so moving left (to -3) maximizes distance

Final position: -3, distance from origin: 3

But wait — could we have made different choices? Let's think strategically:

1. Count fixed moves: `'L'` appears twice, `'R'` appears once. Net fixed movement: 2 left - 1 right = 1 left overall
2. Count wildcards: 2 underscores
3. We can use all wildcards to move away from 0: since our net fixed movement is left (negative), we should use all wildcards to move left
4. Total distance = |fixed_left - fixed_right| + wildcards = |2 - 1| + 2 = 1 + 2 = 3

This matches our step-by-step calculation! The key insight is that we don't need to simulate every possible wildcard choice — we just need to count the fixed moves and use all wildcards to move in the direction that takes us further from the origin.

## Brute Force Approach

A naive approach would be to try all possible combinations of wildcard directions. For each `'_'`, we have 2 choices (L or R). With `k` underscores, there are 2^k possible combinations. We could simulate each combination:

1. Generate all 2^k binary strings representing L/R choices for underscores
2. For each combination, simulate the moves and track the final position
3. Calculate the absolute distance from origin
4. Return the maximum distance found

This approach has exponential time complexity O(2^k \* n), which is far too slow for strings with many underscores. Even for just 30 underscores, we'd have over 1 billion combinations to check!

The brute force fails because it doesn't recognize the simple mathematical relationship: we should always use wildcards to move away from the origin, never toward it.

## Optimal Solution

The optimal solution uses counting and simple arithmetic:

1. Count how many fixed left (`'L'`) and right (`'R'`) moves we have
2. Count how many wildcards (`'_'`) we have
3. Calculate the net fixed movement: `left_count - right_count`
4. All wildcards should be used to move in the direction that takes us further from the origin:
   - If net fixed movement is positive (right overall), add all wildcards as right moves
   - If net fixed movement is negative (left overall), add all wildcards as left moves
   - If net fixed movement is zero, wildcards can go either way, but they all must go the same direction to maximize distance
5. The maximum distance is the absolute value of net fixed movement plus the number of wildcards

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def furthestDistanceFromOrigin(moves: str) -> int:
    """
    Calculate the maximum possible distance from origin after processing moves.

    Strategy:
    1. Count fixed left/right moves to determine our "baseline" direction
    2. Use all wildcards to move away from origin in that same direction
    3. Total distance = |left_count - right_count| + wildcard_count
    """
    left_count = 0
    right_count = 0
    wildcard_count = 0

    # Step 1: Count each type of move
    for move in moves:
        if move == 'L':
            left_count += 1
        elif move == 'R':
            right_count += 1
        else:  # move == '_'
            wildcard_count += 1

    # Step 2: Calculate net fixed movement (without wildcards)
    # Positive means net right, negative means net left
    net_fixed_movement = left_count - right_count

    # Step 3: Use all wildcards to move away from origin
    # If we're already to the right of origin, move more right
    # If we're already to the left of origin, move more left
    # If we're at origin, choose any direction (all wildcards same direction)
    # The absolute distance is |net_fixed_movement| + wildcard_count
    return abs(net_fixed_movement) + wildcard_count
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate the maximum possible distance from origin after processing moves.
 *
 * Strategy:
 * 1. Count fixed left/right moves to determine our "baseline" direction
 * 2. Use all wildcards to move away from origin in that same direction
 * 3. Total distance = |left_count - right_count| + wildcard_count
 */
function furthestDistanceFromOrigin(moves) {
  let leftCount = 0;
  let rightCount = 0;
  let wildcardCount = 0;

  // Step 1: Count each type of move
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move === "L") {
      leftCount++;
    } else if (move === "R") {
      rightCount++;
    } else {
      // move === '_'
      wildcardCount++;
    }
  }

  // Step 2: Calculate net fixed movement (without wildcards)
  // Positive means net left, negative means net right
  // Note: left moves decrease position, right moves increase position
  const netFixedMovement = leftCount - rightCount;

  // Step 3: Use all wildcards to move away from origin
  // The absolute distance is |net_fixed_movement| + wildcard_count
  return Math.abs(netFixedMovement) + wildcardCount;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate the maximum possible distance from origin after processing moves.
     *
     * Strategy:
     * 1. Count fixed left/right moves to determine our "baseline" direction
     * 2. Use all wildcards to move away from origin in that same direction
     * 3. Total distance = |left_count - right_count| + wildcard_count
     */
    public int furthestDistanceFromOrigin(String moves) {
        int leftCount = 0;
        int rightCount = 0;
        int wildcardCount = 0;

        // Step 1: Count each type of move
        for (int i = 0; i < moves.length(); i++) {
            char move = moves.charAt(i);
            if (move == 'L') {
                leftCount++;
            } else if (move == 'R') {
                rightCount++;
            } else { // move == '_'
                wildcardCount++;
            }
        }

        // Step 2: Calculate net fixed movement (without wildcards)
        // Positive means net left, negative means net right
        int netFixedMovement = leftCount - rightCount;

        // Step 3: Use all wildcards to move away from origin
        // The absolute distance is |net_fixed_movement| + wildcard_count
        return Math.abs(netFixedMovement) + wildcardCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length `n` to count the moves
- Each character is examined exactly once
- The arithmetic operations after counting are O(1)

**Space Complexity: O(1)**

- We only use a constant amount of extra space (three integer counters)
- No additional data structures that grow with input size
- The input string is not modified

## Common Mistakes

1. **Simulating positions instead of counting**: Some candidates try to maintain a current position variable and update it for each move, then try to figure out how to use wildcards. This gets messy because you need to decide for each wildcard whether to go left or right based on current position. The counting approach is much cleaner.

2. **Wrong sign in net movement calculation**: Remember that `'L'` moves decrease position (negative direction) and `'R'` moves increase position (positive direction). If you calculate `right_count - left_count` instead of `left_count - right_count`, you'll get the correct magnitude but might misinterpret the direction for wildcard usage (though the absolute value makes the final answer correct either way).

3. **Not using all wildcards in the same direction**: The maximum distance occurs when ALL wildcards push you further from the origin. Some candidates think they should alternate directions or make other patterns. The proof is simple: if you're at position `p`, moving away gives distance `|p|+1`, moving toward gives `|p|-1` (or `1` if `p=0`). Always choose away.

4. **Overcomplicating the zero net movement case**: When `left_count == right_count`, the net fixed movement is 0. Some candidates get confused about which direction to choose for wildcards. It doesn't matter! If you choose all left: distance = `wildcard_count`. All right: same distance. Mixing directions reduces distance.

## When You'll See This Pattern

This problem uses **counting and greedy optimization**, a pattern that appears in many string and array problems:

1. **Robot Return to Origin (LeetCode 657)**: Similar move counting but checks if you return to origin instead of maximizing distance. You count net horizontal and vertical movements.

2. **Maximum 69 Number (LeetCode 1323)**: Change at most one digit to maximize the number. Greedily change the first '6' to '9' from left to right.

3. **Maximum Product of Three Numbers (LeetCode 628)**: Find the maximum product of three numbers in an array. The greedy approach considers the two smallest (most negative) numbers and the three largest numbers.

The core pattern is: when you have choices that affect an outcome, sometimes you can determine the optimal strategy through simple counting or greedy rules rather than exhaustive search.

## Key Takeaways

1. **Look for counting patterns**: When dealing with directional moves or binary choices, counting often reveals simple mathematical relationships that avoid complex simulation.

2. **Greedy can be optimal**: For maximization problems with independent choices, a greedy approach (always choose the option that gives immediate maximum benefit) is often optimal. Here, always moving away from origin with wildcards is greedy and optimal.

3. **Absolute value simplifies direction**: When you only care about distance (not position), absolute value lets you ignore direction details. The formula `|net_fixed| + wildcards` works regardless of which direction you choose for wildcards when net fixed is zero.

Related problems: [Robot Return to Origin](/problem/robot-return-to-origin)
