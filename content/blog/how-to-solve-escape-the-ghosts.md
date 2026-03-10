---
title: "How to Solve Escape The Ghosts — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Escape The Ghosts. Medium difficulty, 63.5% acceptance rate. Topics: Array, Math."
date: "2028-12-20"
category: "dsa-patterns"
tags: ["escape-the-ghosts", "array", "math", "medium"]
---

# How to Solve Escape The Ghosts

You're playing a simplified PAC-MAN game where you start at `[0, 0]` and need to reach a target point while avoiding ghosts. The ghosts can move at the same speed as you, and you need to determine if you can reach the target before any ghost can intercept you. What makes this problem interesting is that it looks like a pathfinding problem, but the optimal solution is surprisingly simple and relies on Manhattan distance calculations rather than BFS or simulation.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- Target: `[3, 0]` (3 units right from start)
- Ghosts: `[[1, 0], [2, 0]]` (two ghosts directly on the path)

**Step 1: Calculate your distance to target**
You're at `[0, 0]`, target is at `[3, 0]`. Manhattan distance = |3-0| + |0-0| = 3.

**Step 2: Calculate each ghost's distance to target**

- Ghost 1 at `[1, 0]`: |3-1| + |0-0| = 2
- Ghost 2 at `[2, 0]`: |3-2| + |0-0| = 1

**Step 3: Compare distances**
Since both ghosts are closer to the target than you are (2 < 3 and 1 < 3), they can reach the target before you. Even if you try to take a different path, the ghosts can simply wait at the target to catch you. You cannot escape.

**Key insight**: If any ghost can reach the target before or at the same time as you, you cannot win. This is because:

1. You must eventually reach the target to "escape"
2. Ghosts can move to intercept you at the target
3. If a ghost reaches the target first, it can wait there
4. If you both arrive simultaneously, you're caught

## Brute Force Approach

A naive approach might try to simulate the game using BFS. You could:

1. Model the grid as a graph where each point has 4 neighbors
2. Run BFS from your starting position to find the shortest path to target
3. Simultaneously run BFS from each ghost to see if they can intercept you

However, this approach has several problems:

1. The grid is infinite, so we can't bound our search space
2. Even with bounds, BFS would be O((n+m) \* area) where n is number of ghosts and m is your path length
3. Determining "interception" is complex - ghosts don't need to catch you on your path, they just need to reach the target before you

Here's what the brute force simulation might look like (and why it's impractical):

<div class="code-group">

```python
# This is NOT the optimal solution - just showing why brute force doesn't work
def escapeGhosts_bruteforce(ghosts, target):
    # We'd need to bound the search space somehow
    # But even with bounds, this is inefficient
    from collections import deque

    # Your starting position
    start = (0, 0)

    # BFS to find your shortest distance to target
    # This alone is problematic on an infinite grid
    # ... implementation would be complex and inefficient

    return False  # Not practical to implement fully
```

```javascript
// This is NOT the optimal solution
function escapeGhostsBruteforce(ghosts, target) {
  // BFS simulation would be complex and inefficient
  // Need to handle infinite grid and multiple agents
  return false;
}
```

```java
// This is NOT the optimal solution
public boolean escapeGhostsBruteforce(int[][] ghosts, int[] target) {
    // Simulating the game with BFS is impractical
    return false;
}
```

</div>

The brute force approach fails because it doesn't leverage the key mathematical insight about Manhattan distances.

## Optimized Approach

The optimal solution comes from realizing that **the shortest path for both you and the ghosts is the Manhattan distance**. Since everyone moves at the same speed (one unit per move in any of the 4 cardinal directions), the race to the target is determined solely by who has the smaller Manhattan distance.

**Why Manhattan distance works:**

1. In a grid where you can only move up, down, left, or right, the shortest path between two points is the Manhattan distance
2. Both you and ghosts move at the same speed (1 unit per move)
3. If a ghost can reach the target before or at the same time as you, it can intercept you there
4. You don't need to worry about ghosts intercepting you en route - if a ghost is closer to the target, it can always get there first and wait

**Step-by-step reasoning:**

1. Calculate your distance to target: `abs(target[0]) + abs(target[1])` (since you start at [0,0])
2. For each ghost, calculate its distance to target: `abs(target[0] - ghost[0]) + abs(target[1] - ghost[1])`
3. If ANY ghost's distance ≤ your distance, return false (you cannot escape)
4. If ALL ghosts' distances > your distance, return true (you can reach the target first)

**Why can't ghosts intercept you before the target?**
If a ghost is farther from the target than you are, even if it takes a path that intersects yours, you can always reach the target first because:

- You're taking the shortest path to the target
- The ghost would need to deviate from its shortest path to intercept you
- This would make its path longer than yours to the target
- Therefore, you'd reach the target first

## Optimal Solution

Here's the complete implementation using the Manhattan distance approach:

<div class="code-group">

```python
# Time: O(n) where n is number of ghosts | Space: O(1)
def escapeGhosts(ghosts, target):
    """
    Determine if you can reach the target before any ghost.

    Args:
        ghosts: List of [x, y] coordinates for each ghost
        target: [x, y] coordinate of the target

    Returns:
        True if you can escape, False otherwise
    """
    # Step 1: Calculate your distance to the target
    # Since you start at [0, 0], your distance is simply
    # the sum of absolute values of target coordinates
    your_distance = abs(target[0]) + abs(target[1])

    # Step 2: Check each ghost's distance to the target
    for ghost in ghosts:
        # Calculate Manhattan distance from ghost to target
        ghost_distance = abs(target[0] - ghost[0]) + abs(target[1] - ghost[1])

        # Step 3: If any ghost can reach the target before or at the same time as you,
        # you cannot escape. The ghost can wait at the target to catch you.
        if ghost_distance <= your_distance:
            return False

    # Step 4: If all ghosts are farther from the target than you are,
    # you can reach it first and escape
    return True
```

```javascript
// Time: O(n) where n is number of ghosts | Space: O(1)
/**
 * Determine if you can reach the target before any ghost.
 * @param {number[][]} ghosts - Array of [x, y] coordinates for each ghost
 * @param {number[]} target - [x, y] coordinate of the target
 * @return {boolean} - True if you can escape, False otherwise
 */
function escapeGhosts(ghosts, target) {
  // Step 1: Calculate your distance to the target
  // You start at [0, 0], so distance is sum of absolute target coordinates
  const yourDistance = Math.abs(target[0]) + Math.abs(target[1]);

  // Step 2: Check each ghost's distance to the target
  for (const ghost of ghosts) {
    // Calculate Manhattan distance from ghost to target
    const ghostDistance = Math.abs(target[0] - ghost[0]) + Math.abs(target[1] - ghost[1]);

    // Step 3: If any ghost can reach target before or same time as you,
    // you cannot escape (ghost can wait at target)
    if (ghostDistance <= yourDistance) {
      return false;
    }
  }

  // Step 4: All ghosts are farther from target than you
  return true;
}
```

```java
// Time: O(n) where n is number of ghosts | Space: O(1)
class Solution {
    /**
     * Determine if you can reach the target before any ghost.
     * @param ghosts Array of [x, y] coordinates for each ghost
     * @param target [x, y] coordinate of the target
     * @return True if you can escape, False otherwise
     */
    public boolean escapeGhosts(int[][] ghosts, int[] target) {
        // Step 1: Calculate your distance to the target
        // You start at [0, 0], so distance is sum of absolute target coordinates
        int yourDistance = Math.abs(target[0]) + Math.abs(target[1]);

        // Step 2: Check each ghost's distance to the target
        for (int[] ghost : ghosts) {
            // Calculate Manhattan distance from ghost to target
            int ghostDistance = Math.abs(target[0] - ghost[0]) +
                               Math.abs(target[1] - ghost[1]);

            // Step 3: If any ghost can reach target before or same time as you,
            // you cannot escape (ghost can wait at target)
            if (ghostDistance <= yourDistance) {
                return false;
            }
        }

        // Step 4: All ghosts are farther from target than you
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We calculate your distance to target: O(1)
- We iterate through all n ghosts, calculating each one's distance to target: O(n)
- Each distance calculation involves constant time operations (absolute values and addition)
- Total: O(1) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables to store distances
- No additional data structures that grow with input size
- The input arrays are not counted toward space complexity (they're given)

## Common Mistakes

1. **Overcomplicating with BFS/DFS**: Many candidates try to simulate the game using graph traversal algorithms. This fails because the grid is infinite and the solution is much simpler. Always look for mathematical insights before implementing complex algorithms.

2. **Using Euclidean distance instead of Manhattan distance**: Remember you can only move in 4 directions (up, down, left, right), not diagonally. The straight-line Euclidean distance doesn't reflect actual movement constraints.

3. **Forgetting the equal case (≤ instead of <)**: If a ghost reaches the target at the same time as you, you're caught! The condition should be `ghost_distance <= your_distance`, not just `<`.

4. **Not considering that ghosts can wait at the target**: Some candidates think ghosts need to intercept you along your path. But if a ghost reaches the target first, it can simply wait there for you to arrive.

## When You'll See This Pattern

This problem teaches the **Manhattan distance race** pattern, which appears in several grid-based problems:

1. **Cat and Mouse II (LeetCode 1728)**: A more complex version where both agents have different movement constraints, but the core idea of comparing distances to critical points remains.

2. **Minimum Time Visiting All Points (LeetCode 1266)**: Uses Manhattan distance to calculate minimum time to visit multiple points in sequence.

3. **Robot Return to Origin (LeetCode 657)**: While simpler, it uses similar Manhattan distance reasoning - if net movement is zero, you return to origin.

The key insight is recognizing when movement is constrained to grid directions and all agents move at equal speeds, making distance comparisons sufficient.

## Key Takeaways

1. **Manhattan distance is key for grid movement**: When movement is restricted to cardinal directions (no diagonals), Manhattan distance gives the shortest path length.

2. **Equal speed simplifies to distance comparison**: When all agents move at the same speed, who reaches a point first depends solely on who has the shorter distance to it.

3. **Think about endpoint interception**: In chase problems, consider whether interception can happen at the destination rather than along the path. This often simplifies the problem significantly.

Related problems: [Cat and Mouse II](/problem/cat-and-mouse-ii)
