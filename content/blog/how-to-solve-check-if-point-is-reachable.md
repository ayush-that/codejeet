---
title: "How to Solve Check if Point Is Reachable — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Check if Point Is Reachable. Hard difficulty, 44.8% acceptance rate. Topics: Math, Number Theory."
date: "2026-05-14"
category: "dsa-patterns"
tags: ["check-if-point-is-reachable", "math", "number-theory", "hard"]
---

# How to Solve Check if Point Is Reachable

You're given a starting point (1, 1) and need to determine if you can reach a target point (targetX, targetY) using three specific movement operations. The challenge is that the grid is infinite, and brute force exploration would be impossible. The key insight is recognizing that this is essentially a number theory problem where we need to work backwards from the target to the starting point.

## Visual Walkthrough

Let's trace through a concrete example: target = (4, 7)

**Forward thinking (why it's hard):**
From (1, 1), we could try all possible moves:

- (1, 1) → (1, 0) or (0, 1) or (2, 1)
- (2, 1) → (2, -1) or (1, 1) or (4, 1)
- ... This quickly explodes with infinite possibilities!

**Backward thinking (the key insight):**
Instead, let's work backwards from (4, 7) to (1, 1). The reverse operations would be:

1. If we came from (x, y-x): (4, 7) could have come from (4, 11) [since 7 + 4 = 11]
2. If we came from (x-y, y): (4, 7) could have come from (-3, 7) [since 4 - 7 = -3]
3. If we came from (2x, y): (4, 7) could have come from (2, 7) [since 4/2 = 2]

Notice something important: working backwards, we can only divide by 2 when the coordinate is even. Also, negative coordinates aren't helpful since we started at (1, 1).

Let's trace backwards intelligently:

- Start: (4, 7)
- 7 is odd, 4 is even → we could have come from (2, 7) [dividing 4 by 2]
- Now: (2, 7)
- 7 is odd, 2 is even → we could have come from (1, 7) [dividing 2 by 2]
- Now: (1, 7)
- 7 > 1, so we can subtract: (1, 7) could have come from (1, 6) [since 7 - 1 = 6]
- Continue: (1, 6) → (1, 5) → (1, 4) → (1, 3) → (1, 2) → (1, 1) ✓

We reached (1, 1)! This suggests (4, 7) is reachable.

## Brute Force Approach

A naive approach would be to use BFS or DFS starting from (1, 1) and exploring all possible moves. The problem is that coordinates can grow exponentially (due to the 2x operation), and we have no upper bound. Even with pruning (ignoring negative coordinates or coordinates that are too large), the search space is effectively infinite.

Here's what the brute force BFS would look like (and why it fails):

<div class="code-group">

```python
# This brute force approach will NOT work for most cases
# It's shown here to illustrate why we need a better approach
from collections import deque

def isReachableBruteForce(targetX, targetY, max_steps=1000):
    queue = deque([(1, 1)])
    visited = set([(1, 1)])
    steps = 0

    while queue and steps < max_steps:
        for _ in range(len(queue)):
            x, y = queue.popleft()

            if x == targetX and y == targetY:
                return True

            # Generate next moves
            moves = [
                (x, y - x),      # Move type 1
                (x - y, y),      # Move type 2
                (2 * x, y),      # Move type 3
            ]

            for nx, ny in moves:
                # Only consider positive coordinates
                if nx > 0 and ny > 0 and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

        steps += 1

    return False
```

```javascript
// This brute force approach will NOT work for most cases
function isReachableBruteForce(targetX, targetY, maxSteps = 1000) {
  const queue = [[1, 1]];
  const visited = new Set(["1,1"]);
  let steps = 0;

  while (queue.length > 0 && steps < maxSteps) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [x, y] = queue.shift();

      if (x === targetX && y === targetY) {
        return true;
      }

      // Generate next moves
      const moves = [
        [x, y - x], // Move type 1
        [x - y, y], // Move type 2
        [2 * x, y], // Move type 3
      ];

      for (const [nx, ny] of moves) {
        const key = `${nx},${ny}`;
        if (nx > 0 && ny > 0 && !visited.has(key)) {
          visited.add(key);
          queue.push([nx, ny]);
        }
      }
    }

    steps++;
  }

  return false;
}
```

```java
// This brute force approach will NOT work for most cases
import java.util.*;

public class Solution {
    public boolean isReachableBruteForce(int targetX, int targetY, int maxSteps) {
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{1, 1});
        Set<String> visited = new HashSet<>();
        visited.add("1,1");
        int steps = 0;

        while (!queue.isEmpty() && steps < maxSteps) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int x = current[0];
                int y = current[1];

                if (x == targetX && y == targetY) {
                    return true;
                }

                // Generate next moves
                int[][] moves = {
                    {x, y - x},      // Move type 1
                    {x - y, y},      // Move type 2
                    {2 * x, y}       // Move type 3
                };

                for (int[] move : moves) {
                    int nx = move[0];
                    int ny = move[1];
                    String key = nx + "," + ny;

                    if (nx > 0 && ny > 0 && !visited.contains(key)) {
                        visited.add(key);
                        queue.offer(new int[]{nx, ny});
                    }
                }
            }

            steps++;
        }

        return false;
    }
}
```

</div>

**Why brute force fails:**

1. The 2x operation causes exponential growth, making the search space enormous
2. There's no natural upper bound on coordinates
3. Even with pruning, the branching factor is too high for most inputs
4. Time complexity is effectively infinite in worst case

## Optimized Approach

The key insight is to work **backwards** from the target to the starting point (1, 1). This is similar to the "Reaching Points" problem, but with an additional twist: the multiplication by 2 operation.

**Reverse operations:**

1. If we're at (x, y) and came from (x, y+x) [reverse of (x, y-x)]
2. If we're at (x, y) and came from (x+y, y) [reverse of (x-y, y)]
3. If we're at (x, y) and x is even, could have come from (x/2, y) [reverse of (2x, y)]

**Observation:** The multiplication by 2 is only reversible when the coordinate is even. This gives us a strategy: repeatedly reduce the larger coordinate by subtracting the smaller one, and divide by 2 whenever possible.

**Mathematical insight:** The reachable points are exactly those where the greatest common divisor (GCD) of targetX and targetY is a power of 2. Why? Because:

- Starting from (1, 1), all reachable points must have coordinates that share all their prime factors (since operations preserve common factors)
- The operations can only introduce factors of 2 (through multiplication)
- Therefore, the GCD must be of the form 2^k

## Optimal Solution

We can solve this by repeatedly:

1. Dividing both coordinates by 2 while they're both even (removing common factors of 2)
2. Reducing the larger coordinate by the smaller one (using modulo operation for efficiency)
3. Checking if we eventually reach (1, 1)

<div class="code-group">

```python
# Time: O(log(max(targetX, targetY))) | Space: O(1)
def isReachable(targetX: int, targetY: int) -> bool:
    """
    Determines if (targetX, targetY) is reachable from (1, 1).

    The key insight is that reachable points must have a GCD that's a power of 2.
    We work backwards from the target to (1, 1) by repeatedly:
    1. Removing common factors of 2
    2. Reducing the larger coordinate by the smaller one

    Args:
        targetX: The x-coordinate of the target point
        targetY: The y-coordinate of the target point

    Returns:
        True if the point is reachable, False otherwise
    """

    # Remove all common factors of 2 from both numbers
    # This doesn't affect reachability but simplifies the problem
    while targetX % 2 == 0 and targetY % 2 == 0:
        targetX //= 2
        targetY //= 2

    # Now we repeatedly reduce the larger number by the smaller one
    # This is the Euclidean algorithm for finding GCD
    while targetX > 0 and targetY > 0:
        # If either coordinate becomes 1, we can reach (1, 1)
        if targetX == 1 or targetY == 1:
            return True

        # If both coordinates are odd and not equal to 1,
        # they must have a common odd factor, making them unreachable
        if targetX % 2 == 1 and targetY % 2 == 1:
            return False

        # Reduce the larger coordinate by the smaller one
        # Using modulo is more efficient than repeated subtraction
        if targetX > targetY:
            targetX %= targetY
            # If modulo gives 0, set to the other value to continue
            if targetX == 0:
                targetX = targetY
        else:
            targetY %= targetX
            if targetY == 0:
                targetY = targetX

    # We should never reach here if inputs are positive
    return False


# Alternative implementation using GCD check
def isReachableGCD(targetX: int, targetY: int) -> bool:
    """
    Alternative solution using GCD check.
    A point is reachable iff gcd(targetX, targetY) is a power of 2.
    """
    import math

    # Calculate GCD
    g = math.gcd(targetX, targetY)

    # Check if GCD is a power of 2
    # A number is a power of 2 if (n & (n-1)) == 0
    return g > 0 and (g & (g - 1)) == 0
```

```javascript
// Time: O(log(max(targetX, targetY))) | Space: O(1)
/**
 * Determines if (targetX, targetY) is reachable from (1, 1).
 *
 * The key insight is that reachable points must have a GCD that's a power of 2.
 * We work backwards from the target to (1, 1) by repeatedly:
 * 1. Removing common factors of 2
 * 2. Reducing the larger coordinate by the smaller one
 *
 * @param {number} targetX - The x-coordinate of the target point
 * @param {number} targetY - The y-coordinate of the target point
 * @return {boolean} True if the point is reachable, False otherwise
 */
function isReachable(targetX, targetY) {
  // Remove all common factors of 2 from both numbers
  // This doesn't affect reachability but simplifies the problem
  while (targetX % 2 === 0 && targetY % 2 === 0) {
    targetX = Math.floor(targetX / 2);
    targetY = Math.floor(targetY / 2);
  }

  // Now we repeatedly reduce the larger number by the smaller one
  // This is essentially the Euclidean algorithm for finding GCD
  while (targetX > 0 && targetY > 0) {
    // If either coordinate becomes 1, we can reach (1, 1)
    if (targetX === 1 || targetY === 1) {
      return true;
    }

    // If both coordinates are odd and not equal to 1,
    // they must have a common odd factor, making them unreachable
    if (targetX % 2 === 1 && targetY % 2 === 1) {
      return false;
    }

    // Reduce the larger coordinate by the smaller one
    // Using modulo is more efficient than repeated subtraction
    if (targetX > targetY) {
      targetX %= targetY;
      // If modulo gives 0, set to the other value to continue
      if (targetX === 0) {
        targetX = targetY;
      }
    } else {
      targetY %= targetX;
      if (targetY === 0) {
        targetY = targetX;
      }
    }
  }

  // We should never reach here if inputs are positive
  return false;
}

// Alternative implementation using GCD check
function isReachableGCD(targetX, targetY) {
  /**
   * Alternative solution using GCD check.
   * A point is reachable iff gcd(targetX, targetY) is a power of 2.
   */

  // Helper function to calculate GCD
  function gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Calculate GCD
  const g = gcd(targetX, targetY);

  // Check if GCD is a power of 2
  // A number is a power of 2 if (n & (n-1)) == 0 and n > 0
  return g > 0 && (g & (g - 1)) === 0;
}
```

```java
// Time: O(log(max(targetX, targetY))) | Space: O(1)
class Solution {
    /**
     * Determines if (targetX, targetY) is reachable from (1, 1).
     *
     * The key insight is that reachable points must have a GCD that's a power of 2.
     * We work backwards from the target to (1, 1) by repeatedly:
     * 1. Removing common factors of 2
     * 2. Reducing the larger coordinate by the smaller one
     *
     * @param targetX The x-coordinate of the target point
     * @param targetY The y-coordinate of the target point
     * @return True if the point is reachable, False otherwise
     */
    public boolean isReachable(int targetX, int targetY) {
        // Remove all common factors of 2 from both numbers
        // This doesn't affect reachability but simplifies the problem
        while (targetX % 2 == 0 && targetY % 2 == 0) {
            targetX /= 2;
            targetY /= 2;
        }

        // Now we repeatedly reduce the larger number by the smaller one
        // This is essentially the Euclidean algorithm for finding GCD
        while (targetX > 0 && targetY > 0) {
            // If either coordinate becomes 1, we can reach (1, 1)
            if (targetX == 1 || targetY == 1) {
                return true;
            }

            // If both coordinates are odd and not equal to 1,
            // they must have a common odd factor, making them unreachable
            if (targetX % 2 == 1 && targetY % 2 == 1) {
                return false;
            }

            // Reduce the larger coordinate by the smaller one
            // Using modulo is more efficient than repeated subtraction
            if (targetX > targetY) {
                targetX %= targetY;
                // If modulo gives 0, set to the other value to continue
                if (targetX == 0) {
                    targetX = targetY;
                }
            } else {
                targetY %= targetX;
                if (targetY == 0) {
                    targetY = targetX;
                }
            }
        }

        // We should never reach here if inputs are positive
        return false;
    }

    // Alternative implementation using GCD check
    public boolean isReachableGCD(int targetX, int targetY) {
        /**
         * Alternative solution using GCD check.
         * A point is reachable iff gcd(targetX, targetY) is a power of 2.
         */

        // Calculate GCD using Euclidean algorithm
        int a = targetX, b = targetY;
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        int g = a;

        // Check if GCD is a power of 2
        // A number is a power of 2 if (n & (n-1)) == 0 and n > 0
        return g > 0 && (g & (g - 1)) == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(max(targetX, targetY)))

- Each iteration reduces at least one coordinate significantly
- When we use modulo operation (targetX %= targetY), we reduce the larger coordinate by at least half
- This gives us logarithmic time complexity similar to the Euclidean algorithm

**Space Complexity:** O(1)

- We only use a constant amount of extra space
- All operations are done in-place on the input parameters

## Common Mistakes

1. **Trying forward BFS/DFS:** This is the most common mistake. Candidates try to explore from (1, 1) forward, not realizing the search space explodes exponentially due to the 2x operation.

2. **Not recognizing the GCD pattern:** Many candidates miss the key insight that reachable points must have a GCD that's a power of 2. They get stuck trying to find patterns in the operations without seeing the number theory connection.

3. **Incorrect handling of the modulo operation:** When reducing coordinates, some candidates use subtraction instead of modulo, which works but is less efficient. Others forget to handle the case when modulo gives 0.

4. **Forgetting to remove common factors of 2 first:** This step is crucial because it simplifies the problem. Without it, you might incorrectly conclude that points like (2, 4) are unreachable when they actually are reachable.

## When You'll See This Pattern

This problem uses **backward reasoning** combined with **number theory** (specifically GCD and divisibility properties). You'll see similar patterns in:

1. **Reaching Points (Hard)** - Almost identical problem but with different operations. The solution also involves working backwards and using GCD.

2. **Water and Jug Problem (Medium)** - Determines if you can measure exactly z liters using jugs of capacity x and y. Uses GCD to determine if z is a multiple of gcd(x, y).

3. **Check if the Rectangle Corner Is Reachable (Hard)** - Another grid reachability problem that likely uses similar backward reasoning techniques.

4. **Fraction to Recurring Decimal (Medium)** - While not about reachability, it uses similar modulo arithmetic and cycle detection techniques.

## Key Takeaways

1. **When forward search explodes, try working backwards.** Many grid/movement problems become tractable when you reverse the operations.

2. **Look for number theory patterns** when operations involve addition, subtraction, and multiplication. GCD often plays a key role in determining reachability or feasibility.

3. **The "power of 2" check** (n & (n-1) == 0) is a useful bit manipulation trick to know for problems involving divisibility by powers of 2.

Related problems: [Reaching Points](/problem/reaching-points), [Check if the Rectangle Corner Is Reachable](/problem/check-if-the-rectangle-corner-is-reachable)
