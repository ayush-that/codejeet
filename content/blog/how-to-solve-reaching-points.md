---
title: "How to Solve Reaching Points — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Reaching Points. Hard difficulty, 34.2% acceptance rate. Topics: Math."
date: "2027-11-09"
category: "dsa-patterns"
tags: ["reaching-points", "math", "hard"]
---

# How to Solve Reaching Points

This problem asks whether we can transform a starting point `(sx, sy)` into a target point `(tx, ty)` using only two operations: `(x, y) → (x, x+y)` or `(x, y) → (x+y, y)`. What makes this problem tricky is that a naive forward search from `(sx, sy)` toward `(tx, ty)` explodes exponentially, while working backward from `(tx, ty)` toward `(sx, sy)` reveals a mathematical pattern that leads to an efficient solution.

## Visual Walkthrough

Let's trace through an example: `sx = 2, sy = 3, tx = 19, ty = 7`.

**Forward thinking (why it's problematic):**
From (2,3) we could go to (2,5) or (5,3). From (2,5) we could go to (2,7) or (7,5), and so on. The branching factor is 2 at each step, creating an exponential search space. For large targets, this quickly becomes impossible.

**Backward thinking (the key insight):**
Instead, let's work backward from (19,7). At each step, we can determine which coordinate was modified last:

- If `tx > ty`, then the last operation must have been `(tx-ty, ty) → (tx, ty)` because adding `ty` to the x-coordinate is the only way x could be larger than y.
- If `ty > tx`, then the last operation must have been `(tx, ty-tx) → (tx, ty)`.

Let's trace backward from (19,7):

1. `tx=19, ty=7`. Since 19 > 7, previous point was `(19-7, 7) = (12,7)`
2. `tx=12, ty=7`. Since 12 > 7, previous point was `(12-7, 7) = (5,7)`
3. `tx=5, ty=7`. Since 7 > 5, previous point was `(5, 7-5) = (5,2)`
4. `tx=5, ty=2`. Since 5 > 2, previous point was `(5-2, 2) = (3,2)`
5. `tx=3, ty=2`. Since 3 > 2, previous point was `(3-2, 2) = (1,2)`

We've reached (1,2), but our starting point is (2,3). This suggests we can't reach (19,7) from (2,3). Let's verify with code later.

## Brute Force Approach

The most straightforward approach is to use BFS or DFS starting from `(sx, sy)`, exploring both possible moves at each step until we either reach `(tx, ty)` or exceed it in both coordinates.

**Why this fails:**
The search space grows exponentially (2 branches at each step). For large target values like `tx=10^9`, we'd need to explore an astronomical number of paths. Even with pruning (stopping when `x > tx` or `y > ty`), the worst-case complexity is still exponential.

Here's what the brute force BFS would look like:

<div class="code-group">

```python
# Time: O(2^(tx+ty)) | Space: O(2^(tx+ty)) - Exponential, impractical
def reachingPoints_brute(sx, sy, tx, ty):
    from collections import deque

    queue = deque([(sx, sy)])

    while queue:
        x, y = queue.popleft()

        # If we found the target
        if x == tx and y == ty:
            return True

        # If we've exceeded target in both coordinates, skip
        if x > tx or y > ty:
            continue

        # Explore both possible moves
        queue.append((x + y, y))  # Operation 1
        queue.append((x, x + y))  # Operation 2

    return False
```

```javascript
// Time: O(2^(tx+ty)) | Space: O(2^(tx+ty)) - Exponential, impractical
function reachingPointsBrute(sx, sy, tx, ty) {
  const queue = [[sx, sy]];

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    // If we found the target
    if (x === tx && y === ty) {
      return true;
    }

    // If we've exceeded target in both coordinates, skip
    if (x > tx || y > ty) {
      continue;
    }

    // Explore both possible moves
    queue.push([x + y, y]); // Operation 1
    queue.push([x, x + y]); // Operation 2
  }

  return false;
}
```

```java
// Time: O(2^(tx+ty)) | Space: O(2^(tx+ty)) - Exponential, impractical
import java.util.LinkedList;
import java.util.Queue;

public boolean reachingPointsBrute(int sx, int sy, int tx, int ty) {
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{sx, sy});

    while (!queue.isEmpty()) {
        int[] point = queue.poll();
        int x = point[0];
        int y = point[1];

        // If we found the target
        if (x == tx && y == ty) {
            return true;
        }

        // If we've exceeded target in both coordinates, skip
        if (x > tx || y > ty) {
            continue;
        }

        // Explore both possible moves
        queue.offer(new int[]{x + y, y});  // Operation 1
        queue.offer(new int[]{x, x + y});  // Operation 2
    }

    return false;
}
```

</div>

This brute force approach will time out for even moderately large inputs because it explores too many unnecessary paths.

## Optimized Approach

The key insight is to work **backward** from `(tx, ty)` to `(sx, sy)` instead of forward. When we look at the operations in reverse:

1. If `tx > ty`, the last operation must have been `(tx-ty, ty) → (tx, ty)`
2. If `ty > tx`, the last operation must have been `(tx, ty-tx) → (tx, ty)`

This gives us a deterministic way to trace backward! However, simply subtracting the smaller from the larger repeatedly is still too slow when one coordinate is much larger than the other (e.g., `(1, 1) → (10^9, 1)` would require 10^9 steps).

**Optimization with modulo:**
Instead of subtracting repeatedly, we can use modulo arithmetic. If `tx > ty`, we know we subtracted `ty` from `tx` multiple times. We can jump directly to `tx % ty` (but be careful when `ty` divides `tx` completely).

**Special case handling:**
When we get close to the starting point, we need to check if we can reach it exactly. For example, if `tx > ty` and `ty == sy`, then we need to check if `(tx - sx) % sy == 0` to ensure we can reach `sx` by repeatedly subtracting `sy`.

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
# Time: O(log(max(tx, ty))) | Space: O(1)
def reachingPoints(sx, sy, tx, ty):
    """
    Work backward from (tx, ty) to (sx, sy) using modulo operations.
    The key insight: if tx > ty, the last operation must have added ty to x.
    If ty > tx, the last operation must have added tx to y.
    """

    # Start from target and work backward
    while tx >= sx and ty >= sy:
        # If we've reached the starting point
        if tx == sx and ty == sy:
            return True

        # If tx > ty, we must have come from (tx-ty, ty)
        # But instead of subtracting one by one, use modulo
        if tx > ty:
            # Special case: if ty == sy, we can only subtract sy
            # Check if we can reach sx by repeatedly subtracting sy
            if ty == sy:
                # We need (tx - sx) to be divisible by sy
                return (tx - sx) % sy == 0
            # Otherwise, reduce tx by the maximum multiple of ty
            tx %= ty
        else:
            # ty >= tx case
            # Special case: if tx == sx, we can only subtract sx
            # Check if we can reach sy by repeatedly subtracting sx
            if tx == sx:
                # We need (ty - sy) to be divisible by sx
                return (ty - sy) % sx == 0
            # Otherwise, reduce ty by the maximum multiple of tx
            ty %= tx

    # If we've reduced below the starting point, it's impossible
    return False
```

```javascript
// Time: O(log(max(tx, ty))) | Space: O(1)
function reachingPoints(sx, sy, tx, ty) {
  /**
   * Work backward from (tx, ty) to (sx, sy) using modulo operations.
   * The key insight: if tx > ty, the last operation must have added ty to x.
   * If ty > tx, the last operation must have added tx to y.
   */

  // Start from target and work backward
  while (tx >= sx && ty >= sy) {
    // If we've reached the starting point
    if (tx === sx && ty === sy) {
      return true;
    }

    // If tx > ty, we must have come from (tx-ty, ty)
    // But instead of subtracting one by one, use modulo
    if (tx > ty) {
      // Special case: if ty === sy, we can only subtract sy
      // Check if we can reach sx by repeatedly subtracting sy
      if (ty === sy) {
        // We need (tx - sx) to be divisible by sy
        return (tx - sx) % sy === 0;
      }
      // Otherwise, reduce tx by the maximum multiple of ty
      tx %= ty;
    } else {
      // ty >= tx case
      // Special case: if tx === sx, we can only subtract sx
      // Check if we can reach sy by repeatedly subtracting sx
      if (tx === sx) {
        // We need (ty - sy) to be divisible by sx
        return (ty - sy) % sx === 0;
      }
      // Otherwise, reduce ty by the maximum multiple of tx
      ty %= tx;
    }
  }

  // If we've reduced below the starting point, it's impossible
  return false;
}
```

```java
// Time: O(log(max(tx, ty))) | Space: O(1)
public boolean reachingPoints(int sx, int sy, int tx, int ty) {
    /**
     * Work backward from (tx, ty) to (sx, sy) using modulo operations.
     * The key insight: if tx > ty, the last operation must have added ty to x.
     * If ty > tx, the last operation must have added tx to y.
     */

    // Start from target and work backward
    while (tx >= sx && ty >= sy) {
        // If we've reached the starting point
        if (tx == sx && ty == sy) {
            return true;
        }

        // If tx > ty, we must have come from (tx-ty, ty)
        // But instead of subtracting one by one, use modulo
        if (tx > ty) {
            // Special case: if ty == sy, we can only subtract sy
            // Check if we can reach sx by repeatedly subtracting sy
            if (ty == sy) {
                // We need (tx - sx) to be divisible by sy
                return (tx - sx) % sy == 0;
            }
            // Otherwise, reduce tx by the maximum multiple of ty
            tx %= ty;
        } else {
            // ty >= tx case
            // Special case: if tx == sx, we can only subtract sx
            // Check if we can reach sy by repeatedly subtracting sx
            if (tx == sx) {
                // We need (ty - sy) to be divisible by sx
                return (ty - sy) % sx == 0;
            }
            // Otherwise, reduce ty by the maximum multiple of tx
            ty %= tx;
        }
    }

    // If we've reduced below the starting point, it's impossible
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(max(tx, ty)))

- Each iteration reduces the larger coordinate by at least half (using modulo operation)
- This is similar to the Euclidean algorithm for GCD, which has logarithmic complexity
- Worst case occurs when tx and ty are Fibonacci numbers (e.g., (1, 1) → (F*n, F*{n+1}))

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No recursion stack or data structures needed

## Common Mistakes

1. **Trying to solve forward with BFS/DFS:** This leads to exponential time complexity. Candidates often don't recognize that working backward is the key.

2. **Not handling the modulo optimization correctly:** Simply doing `while (tx > sx && ty > sy)` and subtracting the smaller from the larger works for small inputs but times out for large ones. You need the modulo optimization.

3. **Missing the special termination conditions:** When `tx == sx` or `ty == sy`, you can't use modulo anymore. You need to check if the difference is divisible by the other coordinate.

4. **Infinite loop with equal coordinates:** If `tx == ty` and neither equals the corresponding starting coordinate, you need to handle this case. In our solution, when `tx == ty`, we'll enter the `else` branch and do `ty %= tx`, which sets `ty = 0`, breaking the loop correctly.

## When You'll See This Pattern

This "work backward" pattern with modulo optimization appears in problems where:

1. Operations are reversible
2. Forward search has exponential complexity
3. There's a mathematical structure that allows large jumps

**Related LeetCode problems:**

1. **Number of Ways to Reach a Position After Exactly k Steps** - Also involves reachability but with different constraints
2. **Check if Point Is Reachable** - A more complex version with different operations (multiplying by 2)
3. **Water and Jug Problem** - Similar mathematical reasoning with GCD
4. **Euclidean algorithm problems** - Any problem that reduces to finding GCD or using modulo arithmetic

## Key Takeaways

1. **When forward search explodes, try working backward.** Many problems become simpler when you reverse the operations.

2. **Look for mathematical patterns in seemingly combinatorial problems.** The modulo optimization here is similar to the Euclidean algorithm for GCD.

3. **Special cases matter.** The termination conditions when `tx == sx` or `ty == sy` are crucial for correctness. Always test edge cases.

**Related problems:** [Number of Ways to Reach a Position After Exactly k Steps](/problem/number-of-ways-to-reach-a-position-after-exactly-k-steps), [Check if Point Is Reachable](/problem/check-if-point-is-reachable), [Determine if a Cell Is Reachable at a Given Time](/problem/determine-if-a-cell-is-reachable-at-a-given-time)
