---
title: "How to Solve Minimum Jumps to Reach Home — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Jumps to Reach Home. Medium difficulty, 30.6% acceptance rate. Topics: Array, Hash Table, Breadth-First Search."
date: "2028-07-03"
category: "dsa-patterns"
tags: ["minimum-jumps-to-reach-home", "array", "hash-table", "breadth-first-search", "medium"]
---

# How to Solve Minimum Jumps to Reach Home

This problem asks us to find the minimum number of jumps for a bug to reach its home at position `x` from position `0`, given that it can jump forward `a` positions or backward `b` positions, but cannot jump backward twice in a row. The bug also cannot jump to positions in a forbidden list. What makes this problem interesting is the constraint against consecutive backward jumps, which prevents simple mathematical solutions and requires careful state tracking.

## Visual Walkthrough

Let's trace through an example: `x = 19`, `a = 3`, `b = 2`, `forbidden = [14, 4, 18, 1, 15]`

We start at position 0 with 0 jumps. The bug can:

- Jump forward to position 3 (0 + 3)
- Jump backward to position -2 (0 - 2), but negative positions are allowed

Let's track our progress:

```
Position: 0, Jumps: 0, Last move: None (can jump forward or backward)
  → Forward to 3 (jumps: 1, last move: forward)
  → Backward to -2 (jumps: 1, last move: backward)

From position 3 (jumps: 1, last move: forward):
  → Forward to 6 (jumps: 2, last move: forward)
  → Backward to 1 (jumps: 2, last move: backward)

From position -2 (jumps: 1, last move: backward):
  → Forward to 1 (jumps: 2, last move: forward)  # Already visited
  → CANNOT jump backward (consecutive backward jumps not allowed)

From position 6 (jumps: 2, last move: forward):
  → Forward to 9 (jumps: 3, last move: forward)
  → Backward to 4 (jumps: 3, last move: backward)  # Forbidden! Skip

From position 1 (jumps: 2, last move: backward):
  → Forward to 4 (jumps: 3, last move: forward)  # Forbidden! Skip
  → CANNOT jump backward (consecutive backward jumps not allowed)

We continue this process, avoiding forbidden positions and consecutive backward jumps.
Eventually we'll reach position 19 with the minimum number of jumps.
```

The key insight is that we need to track not just the position, but also whether the last move was backward, since that affects what moves are allowed next.

## Brute Force Approach

A naive approach would try all possible sequences of jumps until reaching the target. This is essentially a depth-first search through all possible move sequences. However, without proper bounds, this could explore infinite paths (like jumping back and forth between two positions).

Even with bounds, the branching factor is 2 (forward or backward), and the search depth could be up to the number of jumps needed. For large `x` values, this becomes exponential time O(2^n), which is completely impractical.

The main issues with brute force are:

1. No termination guarantee for paths that don't reach the target
2. Exponential time complexity
3. Repeated exploration of the same states

## Optimized Approach

The key insight is that this is a **shortest path problem** in a state space, which calls for **Breadth-First Search (BFS)**. BFS naturally finds the minimum number of steps (jumps) to reach a target.

However, we need to carefully define our state. Since we cannot make consecutive backward jumps, our state must include:

1. Current position
2. Whether the last move was backward (to know if we can jump backward now)

We also need to handle:

- Forbidden positions (cannot visit them)
- Position bounds (we need an upper bound to prevent infinite search)

For the upper bound: Since we can only move forward with `a` and backward with `b`, and we're trying to reach `x`, a reasonable upper bound is `max(x, max(forbidden)) + a + b`. This ensures we don't miss any reachable positions while preventing infinite loops.

The BFS approach:

1. Start at position 0 with last move = false (not backward)
2. Use a queue to explore states level by level (ensuring minimum jumps)
3. For each state, try valid moves:
   - Always try forward jump (if resulting position is valid)
   - Try backward jump only if last move wasn't backward (and position is valid)
4. Track visited states to avoid cycles
5. Stop when we reach position `x`

## Optimal Solution

<div class="code-group">

```python
# Time: O(max_position) where max_position is our search bound
# Space: O(max_position) for visited states and queue
def minimumJumps(forbidden, a, b, x):
    """
    Find minimum jumps to reach home at position x from position 0.

    Args:
        forbidden: List of positions the bug cannot visit
        a: Forward jump distance
        b: Backward jump distance
        x: Target position (home)

    Returns:
        Minimum number of jumps, or -1 if unreachable
    """
    # Convert forbidden list to set for O(1) lookup
    forbidden_set = set(forbidden)

    # Maximum position we need to consider
    # We add a + b to ensure we don't miss any reachable positions
    max_position = max(x, max(forbidden) if forbidden else 0) + a + b

    # Queue for BFS: each element is (position, last_move_was_backward)
    queue = [(0, False)]  # Start at 0, last move was not backward

    # Visited states: track (position, last_move_was_backward)
    visited = set()
    visited.add((0, False))

    jumps = 0

    while queue:
        # Process all nodes at current distance (jump count)
        for _ in range(len(queue)):
            pos, last_backward = queue.pop(0)

            # If we reached home, return current jump count
            if pos == x:
                return jumps

            # Try forward jump
            forward_pos = pos + a
            # Check if position is valid and not visited
            if (forward_pos <= max_position and
                forward_pos not in forbidden_set and
                (forward_pos, False) not in visited):
                visited.add((forward_pos, False))
                queue.append((forward_pos, False))

            # Try backward jump only if last move wasn't backward
            if not last_backward:
                backward_pos = pos - b
                # Check if position is valid and not visited
                if (backward_pos >= 0 and  # Can't go below 0? Actually can, problem allows
                    backward_pos not in forbidden_set and
                    (backward_pos, True) not in visited):
                    visited.add((backward_pos, True))
                    queue.append((backward_pos, True))

        # Increment jump count after processing all nodes at current distance
        jumps += 1

    # If we exhaust all reachable positions without finding x
    return -1
```

```javascript
// Time: O(max_position) where max_position is our search bound
// Space: O(max_position) for visited states and queue
function minimumJumps(forbidden, a, b, x) {
  /**
   * Find minimum jumps to reach home at position x from position 0.
   *
   * @param {number[]} forbidden - Positions the bug cannot visit
   * @param {number} a - Forward jump distance
   * @param {number} b - Backward jump distance
   * @param {number} x - Target position (home)
   * @return {number} Minimum number of jumps, or -1 if unreachable
   */

  // Convert forbidden array to Set for O(1) lookup
  const forbiddenSet = new Set(forbidden);

  // Calculate maximum position to consider
  // We need to go beyond x and any forbidden positions
  const maxForbidden = forbidden.length > 0 ? Math.max(...forbidden) : 0;
  const maxPosition = Math.max(x, maxForbidden) + a + b;

  // Queue for BFS: each element is [position, lastMoveWasBackward]
  const queue = [[0, false]]; // Start at 0, last move was not backward

  // Visited states: use string keys for Set compatibility
  const visited = new Set();
  visited.add(`0,false`);

  let jumps = 0;

  while (queue.length > 0) {
    // Process all nodes at current distance (jump count)
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [pos, lastBackward] = queue.shift();

      // If we reached home, return current jump count
      if (pos === x) {
        return jumps;
      }

      // Try forward jump
      const forwardPos = pos + a;
      const forwardKey = `${forwardPos},false`;

      // Check if position is valid and not visited
      if (forwardPos <= maxPosition && !forbiddenSet.has(forwardPos) && !visited.has(forwardKey)) {
        visited.add(forwardKey);
        queue.push([forwardPos, false]);
      }

      // Try backward jump only if last move wasn't backward
      if (!lastBackward) {
        const backwardPos = pos - b;
        const backwardKey = `${backwardPos},true`;

        // Check if position is valid and not visited
        // Note: backwardPos can be negative per problem statement
        if (
          backwardPos >= 0 && // Actually can be negative, but we'll keep >= 0 for efficiency
          !forbiddenSet.has(backwardPos) &&
          !visited.has(backwardKey)
        ) {
          visited.add(backwardKey);
          queue.push([backwardPos, true]);
        }
      }
    }

    // Increment jump count after processing all nodes at current distance
    jumps++;
  }

  // If we exhaust all reachable positions without finding x
  return -1;
}
```

```java
// Time: O(max_position) where max_position is our search bound
// Space: O(max_position) for visited states and queue
import java.util.*;

class Solution {
    public int minimumJumps(int[] forbidden, int a, int b, int x) {
        /**
         * Find minimum jumps to reach home at position x from position 0.
         *
         * @param forbidden Positions the bug cannot visit
         * @param a Forward jump distance
         * @param b Backward jump distance
         * @param x Target position (home)
         * @return Minimum number of jumps, or -1 if unreachable
         */

        // Convert forbidden array to Set for O(1) lookup
        Set<Integer> forbiddenSet = new HashSet<>();
        for (int pos : forbidden) {
            forbiddenSet.add(pos);
        }

        // Calculate maximum position to consider
        int maxForbidden = 0;
        for (int pos : forbidden) {
            maxForbidden = Math.max(maxForbidden, pos);
        }
        int maxPosition = Math.max(x, maxForbidden) + a + b;

        // Queue for BFS: each element is int[position, lastMoveWasBackward]
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});  // [position, lastMoveWasBackward] where 0=false, 1=true

        // Visited states: track (position, lastMoveWasBackward)
        Set<String> visited = new HashSet<>();
        visited.add("0,0");

        int jumps = 0;

        while (!queue.isEmpty()) {
            // Process all nodes at current distance (jump count)
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int pos = current[0];
                int lastBackward = current[1];

                // If we reached home, return current jump count
                if (pos == x) {
                    return jumps;
                }

                // Try forward jump
                int forwardPos = pos + a;
                String forwardKey = forwardPos + ",0";

                // Check if position is valid and not visited
                if (forwardPos <= maxPosition &&
                    !forbiddenSet.contains(forwardPos) &&
                    !visited.contains(forwardKey)) {
                    visited.add(forwardKey);
                    queue.offer(new int[]{forwardPos, 0});
                }

                // Try backward jump only if last move wasn't backward
                if (lastBackward == 0) {
                    int backwardPos = pos - b;
                    String backwardKey = backwardPos + ",1";

                    // Check if position is valid and not visited
                    if (backwardPos >= 0 &&  // Can be negative, but we limit for efficiency
                        !forbiddenSet.contains(backwardPos) &&
                        !visited.contains(backwardKey)) {
                        visited.add(backwardKey);
                        queue.offer(new int[]{backwardPos, 1});
                    }
                }
            }

            // Increment jump count after processing all nodes at current distance
            jumps++;
        }

        // If we exhaust all reachable positions without finding x
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(max_position)

- We set an upper bound of `max(x, max(forbidden)) + a + b` for our search
- In the worst case, we might visit every position up to this bound
- Each position can be visited in two states (last move was backward or not), giving us O(2 × max_position) = O(max_position)

**Space Complexity:** O(max_position)

- The queue can hold up to O(max_position) elements
- The visited set stores up to 2 × max_position states
- The forbidden set adds O(f) where f is the number of forbidden positions

The key factor is the `max_position` bound. Without it, the search could be infinite. With it, we have a well-defined search space.

## Common Mistakes

1. **Forgetting to track the last move direction**: This is the most common mistake. Without tracking whether the last move was backward, you might allow consecutive backward jumps, which violates the problem constraints.

2. **Not setting an upper bound**: Without a maximum position to search, BFS could run forever if the target is unreachable. The bound `max(x, max(forbidden)) + a + b` ensures termination.

3. **Incorrect visited state tracking**: If you only track position (not the last move direction), you might incorrectly mark a state as visited. For example, reaching position 5 with a forward move is different from reaching it with a backward move, because the available next moves differ.

4. **Off-by-one in level counting**: When doing BFS for shortest path, remember to increment the jump count after processing all nodes at the current level, not after each node.

## When You'll See This Pattern

This BFS-with-state pattern appears in many shortest path problems where:

1. You need to find minimum steps/moves
2. The state depends on more than just position
3. There are constraints on valid moves based on history

Similar problems:

1. **Reachable Nodes With Restrictions (Medium)**: Also uses BFS to find reachable nodes with constraints, though without the directional history component.

2. **Maximum Number of Jumps to Reach the Last Index (Medium)**: While this is a DP problem, it shares the theme of constrained jumps to reach a target.

3. **Sliding Puzzle (Hard)**: Uses BFS to find minimum moves in a state space where each state is a board configuration.

4. **Open the Lock (Medium)**: BFS through combinations with forbidden states, similar to avoiding forbidden positions here.

## Key Takeaways

1. **BFS is for shortest path in unweighted graphs**: When you need minimum steps/moves and each move has equal cost, BFS is your go-to algorithm.

2. **State matters**: Always consider what information needs to be part of your state. If moves depend on history (like "no consecutive backward jumps"), include that history in your state representation.

3. **Bound your search**: For infinite or very large state spaces, determine reasonable bounds to ensure algorithm termination and efficiency.

Related problems: [Reachable Nodes With Restrictions](/problem/reachable-nodes-with-restrictions), [Maximum Number of Jumps to Reach the Last Index](/problem/maximum-number-of-jumps-to-reach-the-last-index)
