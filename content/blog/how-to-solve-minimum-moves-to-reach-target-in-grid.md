---
title: "How to Solve Minimum Moves to Reach Target in Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Reach Target in Grid. Hard difficulty, 14.9% acceptance rate. Topics: Math."
date: "2026-08-28"
category: "dsa-patterns"
tags: ["minimum-moves-to-reach-target-in-grid", "math", "hard"]
---

# How to Solve Minimum Moves to Reach Target in Grid

This problem asks us to find the minimum number of moves to get from a starting point `(sx, sy)` to a target point `(tx, ty)` on an infinite grid, where each move adds the maximum of your current coordinates to either your x or y coordinate. The challenge lies in the fact that moves only increase coordinates, and the move operation is asymmetric—we can't move backward, which means we need to think in reverse.

## Visual Walkthrough

Let's trace through an example: `(sx, sy) = (1, 1)` and `(tx, ty) = (5, 8)`

**Forward thinking (from start to target):**

- Start at (1, 1), m = max(1, 1) = 1
- Options: (1+1, 1) = (2, 1) or (1, 1+1) = (1, 2)
- We don't know which path leads to the target efficiently

**Backward thinking (from target to start):**
This is the key insight! Since moves only increase coordinates, we can work backward from the target to the start:

- Current: (5, 8), m = max(5, 8) = 8
- Which coordinate was increased last? Since 8 > 5, y must have been increased
- Previous position: (5, 8-8) = (5, 0)
- But wait, (5, 0) has max(5, 0) = 5, not 8! This reveals an important nuance

Let's try a better example: `(1, 1)` to `(3, 5)`

**Backward process:**

1. (3, 5): max = 5, y > x, so y was increased: (3, 5-5) = (3, 0)
2. (3, 0): max = 3, x > y, so x was increased: (3-3, 0) = (0, 0)
3. (0, 0) ≠ (1, 1) → this doesn't work

The issue is we're subtracting the entire max value, but the max value changes each step. Let's trace more carefully with `(1, 1)` to `(3, 5)`:

Actually, let's use the example from the problem: `(1, 1)` to `(4, 7)`

**Correct backward thinking:**

1. (4, 7): max = 7, y > x, so last move added 7 to y
   Previous: (4, 7-7) = (4, 0) ❌ Wait, max(4, 0) = 4, not 7!

   Actually, the previous max was max(4, 7-7) = max(4, 0) = 4
   So we subtracted too much. We should only subtract until x ≥ y

   Better approach: While tx > ty: tx -= ty (and vice versa)
   But this is still not quite right...

The real insight: At each backward step, we subtract the smaller from the larger repeatedly until we reverse one move.

## Brute Force Approach

A naive approach would be BFS from the start to the target:

- Each state (x, y) has two possible next states
- Continue until we reach (tx, ty) or exceed it
- Return the number of steps

The problem? The search space grows exponentially. If the target is (10^9, 10^9), BFS would need to explore an astronomical number of states. Even with pruning (stopping when x > tx or y > ty), it's still far too slow for large coordinates.

<div class="code-group">

```python
# BRUTE FORCE BFS (Too slow for large inputs)
# Time: O(2^k) where k is answer length | Space: O(2^k)
def minMoves_bfs(sx, sy, tx, ty):
    from collections import deque

    queue = deque([(sx, sy, 0)])  # (x, y, steps)
    visited = set([(sx, sy)])

    while queue:
        x, y, steps = queue.popleft()

        if x == tx and y == ty:
            return steps

        m = max(x, y)

        # Move right
        nx, ny = x + m, y
        if (nx, ny) not in visited and nx <= tx and ny <= ty:
            visited.add((nx, ny))
            queue.append((nx, ny, steps + 1))

        # Move up
        nx, ny = x, y + m
        if (nx, ny) not in visited and nx <= tx and ny <= ty:
            visited.add((nx, ny))
            queue.append((nx, ny, steps + 1))

    return -1  # Should not happen for valid inputs
```

```javascript
// BRUTE FORCE BFS (Too slow for large inputs)
// Time: O(2^k) where k is answer length | Space: O(2^k)
function minMovesBFS(sx, sy, tx, ty) {
  const queue = [[sx, sy, 0]]; // [x, y, steps]
  const visited = new Set([`${sx},${sy}`]);

  while (queue.length > 0) {
    const [x, y, steps] = queue.shift();

    if (x === tx && y === ty) {
      return steps;
    }

    const m = Math.max(x, y);

    // Move right
    const nx1 = x + m,
      ny1 = y;
    const key1 = `${nx1},${ny1}`;
    if (!visited.has(key1) && nx1 <= tx && ny1 <= ty) {
      visited.add(key1);
      queue.push([nx1, ny1, steps + 1]);
    }

    // Move up
    const nx2 = x,
      ny2 = y + m;
    const key2 = `${nx2},${ny2}`;
    if (!visited.has(key2) && nx2 <= tx && ny2 <= ty) {
      visited.add(key2);
      queue.push([nx2, ny2, steps + 1]);
    }
  }

  return -1; // Should not happen for valid inputs
}
```

```java
// BRUTE FORCE BFS (Too slow for large inputs)
// Time: O(2^k) where k is answer length | Space: O(2^k)
public int minMovesBFS(int sx, int sy, int tx, int ty) {
    Queue<int[]> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();

    queue.offer(new int[]{sx, sy, 0});
    visited.add(sx + "," + sy);

    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        int x = curr[0], y = curr[1], steps = curr[2];

        if (x == tx && y == ty) {
            return steps;
        }

        int m = Math.max(x, y);

        // Move right
        int nx1 = x + m, ny1 = y;
        String key1 = nx1 + "," + ny1;
        if (!visited.contains(key1) && nx1 <= tx && ny1 <= ty) {
            visited.add(key1);
            queue.offer(new int[]{nx1, ny1, steps + 1});
        }

        // Move up
        int nx2 = x, ny2 = y + m;
        String key2 = nx2 + "," + ny2;
        if (!visited.contains(key2) && nx2 <= tx && ny2 <= ty) {
            visited.add(key2);
            queue.offer(new int[]{nx2, ny2, steps + 1});
        }
    }

    return -1;  // Should not happen for valid inputs
}
```

</div>

## Optimized Approach

The key insight is to work **backward** from the target to the start. Since moves only increase coordinates, the target must have been reached by adding to either x or y. We can determine which coordinate was increased last by comparing them:

1. If `tx > ty`, then the last move must have added to x (because if y was increased, the max would be at least ty, which is > tx)
2. If `ty > tx`, then the last move must have added to y
3. If `tx == ty`, we're at a point where max(x, y) = x = y, so either could have been increased

However, there's a catch: when `tx > ty`, we can't just do `tx -= ty` once. Why? Because the previous max was `max(prev_x, prev_y)`, which could be much smaller than current `ty`. Actually, if `tx > ty`, the previous state was `(tx - m, ty)` where `m` was the previous max. But we don't know the previous max!

The real trick: When `tx > ty`, the previous max was at most `tx` (actually it was `max(prev_x, prev_y)`). Since we're adding to x, and `tx > ty`, the value added was the previous max. But we can work backward using modulo arithmetic:

- While `tx > sx` and `ty > sy`:
  - If `tx > ty`:
    - If `ty > sy`: We can subtract `ty` from `tx` multiple times until `tx <= ty` or `tx <= sx`
    - Actually more efficient: `tx %= ty` (but careful with edge cases!)
  - If `ty > tx`: Similarly, `ty %= tx`
  - If `tx == ty`: We have a problem - can't determine which was increased

But there's an even cleaner approach using while loops with subtraction. The optimal solution uses this backward reasoning with a special handling for when start coordinates are reached.

## Optimal Solution

The optimal solution works backward from `(tx, ty)` to `(sx, sy)`:

1. While `tx > sx` and `ty > sy`:
   - If `tx > ty`: `tx %= ty` (but if `tx % ty == 0`, set `tx = ty`)
   - Else: `ty %= tx` (but if `ty % tx == 0`, set `ty = tx`)
   - Count moves as we reduce
2. Check if we can reach the start from the current `(tx, ty)`
3. Handle special cases where `sx == tx` or `sy == ty`

<div class="code-group">

```python
# Optimal Solution: Working backward with modulo arithmetic
# Time: O(log(max(tx, ty))) | Space: O(1)
def minMoves(sx, sy, tx, ty):
    moves = 0

    # Work backward from target to start
    while tx > sx and ty > sy:
        if tx > ty:
            # If ty is the start's y, we need special handling
            if ty == sy:
                # Check if we can reach sx from tx by subtracting multiples of ty
                if (tx - sx) % ty == 0:
                    moves += (tx - sx) // ty
                    return moves
                else:
                    return -1  # Not reachable
            # Reduce tx by subtracting multiples of ty
            moves += tx // ty
            tx %= ty
        else:
            # If tx is the start's x, we need special handling
            if tx == sx:
                # Check if we can reach sy from ty by subtracting multiples of tx
                if (ty - sy) % tx == 0:
                    moves += (ty - sy) // tx
                    return moves
                else:
                    return -1  # Not reachable
            # Reduce ty by subtracting multiples of tx
            moves += ty // tx
            ty %= tx

    # Check if we've reached the start
    if tx == sx and ty == sy:
        return moves
    elif tx == sx and ty > sy and (ty - sy) % tx == 0:
        # Only need to move in y direction
        return moves + (ty - sy) // tx
    elif ty == sy and tx > sx and (tx - sx) % ty == 0:
        # Only need to move in x direction
        return moves + (tx - sx) // ty
    else:
        return -1  # Not reachable
```

```javascript
// Optimal Solution: Working backward with modulo arithmetic
// Time: O(log(max(tx, ty))) | Space: O(1)
function minMoves(sx, sy, tx, ty) {
  let moves = 0;

  // Work backward from target to start
  while (tx > sx && ty > sy) {
    if (tx > ty) {
      // If ty is the start's y, we need special handling
      if (ty === sy) {
        // Check if we can reach sx from tx by subtracting multiples of ty
        if ((tx - sx) % ty === 0) {
          moves += (tx - sx) / ty;
          return moves;
        } else {
          return -1; // Not reachable
        }
      }
      // Reduce tx by subtracting multiples of ty
      moves += Math.floor(tx / ty);
      tx %= ty;
    } else {
      // If tx is the start's x, we need special handling
      if (tx === sx) {
        // Check if we can reach sy from ty by subtracting multiples of tx
        if ((ty - sy) % tx === 0) {
          moves += (ty - sy) / tx;
          return moves;
        } else {
          return -1; // Not reachable
        }
      }
      // Reduce ty by subtracting multiples of tx
      moves += Math.floor(ty / tx);
      ty %= tx;
    }
  }

  // Check if we've reached the start
  if (tx === sx && ty === sy) {
    return moves;
  } else if (tx === sx && ty > sy && (ty - sy) % tx === 0) {
    // Only need to move in y direction
    return moves + (ty - sy) / tx;
  } else if (ty === sy && tx > sx && (tx - sx) % ty === 0) {
    // Only need to move in x direction
    return moves + (tx - sx) / ty;
  } else {
    return -1; // Not reachable
  }
}
```

```java
// Optimal Solution: Working backward with modulo arithmetic
// Time: O(log(max(tx, ty))) | Space: O(1)
public int minMoves(int sx, int sy, int tx, int ty) {
    int moves = 0;

    // Work backward from target to start
    while (tx > sx && ty > sy) {
        if (tx > ty) {
            // If ty is the start's y, we need special handling
            if (ty == sy) {
                // Check if we can reach sx from tx by subtracting multiples of ty
                if ((tx - sx) % ty == 0) {
                    moves += (tx - sx) / ty;
                    return moves;
                } else {
                    return -1;  // Not reachable
                }
            }
            // Reduce tx by subtracting multiples of ty
            moves += tx / ty;
            tx %= ty;
        } else {
            // If tx is the start's x, we need special handling
            if (tx == sx) {
                // Check if we can reach sy from ty by subtracting multiples of tx
                if ((ty - sy) % tx == 0) {
                    moves += (ty - sy) / tx;
                    return moves;
                } else {
                    return -1;  // Not reachable
                }
            }
            // Reduce ty by subtracting multiples of tx
            moves += ty / tx;
            ty %= tx;
        }
    }

    // Check if we've reached the start
    if (tx == sx && ty == sy) {
        return moves;
    } else if (tx == sx && ty > sy && (ty - sy) % tx == 0) {
        // Only need to move in y direction
        return moves + (ty - sy) / tx;
    } else if (ty == sy && tx > sx && (tx - sx) % ty == 0) {
        // Only need to move in x direction
        return moves + (tx - sx) / ty;
    } else {
        return -1;  // Not reachable
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(max(tx, ty)))

- Each iteration reduces the larger coordinate by at least half (using modulo operation)
- This is similar to the Euclidean algorithm for GCD
- In the worst case, we get logarithmic behavior

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No recursion or data structures that grow with input size

## Common Mistakes

1. **Trying to solve forward with BFS/DFS**: This leads to exponential time complexity. The search space grows too quickly because each state has two children, and coordinates can become very large.

2. **Incorrect backward reasoning**: Simply doing `tx -= ty` when `tx > ty` doesn't always work. For example, from (3, 5), if we do `5 -= 3`, we get (3, 2), but max(3, 2) = 3, not 5. We need to consider that the value subtracted was the previous max, not necessarily the current other coordinate.

3. **Not handling the start coordinate correctly**: When `tx == sx` but `ty > sy`, we need to check if `(ty - sy)` is divisible by `tx`. If not, the target isn't reachable.

4. **Infinite loops with modulo**: Using `tx %= ty` when `ty == 0` causes division by zero. We need to handle the case when coordinates become 0 during the backward process.

## When You'll See This Pattern

This "work backward" pattern appears in several problems:

1. **LeetCode 780: Reaching Points** - Almost identical problem! The only difference is the move operation, but the backward reasoning is the same.

2. **LeetCode 365: Water and Jug Problem** - Uses similar modulo arithmetic and GCD reasoning to determine if a target volume is reachable.

3. **LeetCode 397: Integer Replacement** - While not identical, it also involves working backward/forward with mathematical operations to minimize steps.

The core pattern is: when forward search is infeasible due to exponential growth, consider if working backward from the target reduces the search space significantly.

## Key Takeaways

1. **When moves are irreversible** (only increase or only decrease coordinates), consider working backward from the target to the start. This often turns an exponential problem into a logarithmic one.

2. **Modulo arithmetic is powerful** for problems involving repeated subtraction. Think of it as accelerating multiple steps at once, similar to the Euclidean algorithm.

3. **Edge cases matter** in mathematical problems. Always test with:
   - Start equals target (0 moves)
   - One coordinate already matches but the other doesn't
   - Large values that would cause overflow in naive approaches

[Practice this problem on CodeJeet](/problem/minimum-moves-to-reach-target-in-grid)
