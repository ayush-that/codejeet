---
title: "How to Solve Shortest Path to Get All Keys — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Path to Get All Keys. Hard difficulty, 54.3% acceptance rate. Topics: Array, Bit Manipulation, Breadth-First Search, Matrix."
date: "2027-07-31"
category: "dsa-patterns"
tags: ["shortest-path-to-get-all-keys", "array", "bit-manipulation", "breadth-first-search", "hard"]
---

# How to Solve Shortest Path to Get All Keys

This problem asks you to find the shortest path from a starting point to collect all keys in a grid, where walls block movement and locks require corresponding keys to pass through. What makes this problem tricky is that it's not just a simple BFS—your state depends on which keys you've collected so far, making it a state-space search problem where you need to track both position and key collection status.

## Visual Walkthrough

Let's trace through a simple example to build intuition:

```
Grid:
@ . a
. # b
. . A
```

We start at `@` and need to collect keys `a` and `b`. Lock `A` requires key `a`.

**Step 1:** Start at `@` with no keys. We can move right to `.` or down to `.`.

**Step 2:** If we go right first, we reach `a` and pick it up. Now we have key `a`.

**Step 3:** With key `a`, we can now pass through lock `A`. But we still need key `b`. We need to navigate around the wall `#` to reach `b`.

**Step 4:** The optimal path is: right to get `a`, down (through `A` now that we have `a`), right to get `b`. Total steps: 3.

The key insight is that visiting the same cell with different key collections is actually a different state. For example, visiting the cell with `A` without key `a` is a dead end, but visiting it with key `a` allows passage.

## Brute Force Approach

A naive approach might try to:

1. Find all keys and their positions
2. Try all permutations of key collection order
3. For each permutation, find the shortest path between consecutive keys
4. Sum the path lengths and take the minimum

This fails because:

- The number of key permutations grows factorially (k! for k keys)
- Paths between keys depend on which keys you've already collected (locks may become passable)
- You can't precompute distances between keys independently
- The state space is exponential in the number of keys

Even for just 6 keys, 6! = 720 permutations, and each requires BFS through an m×n grid. This quickly becomes infeasible.

## Optimized Approach

The key insight is that this is a **state-space search problem** where each state is defined by:

1. Current position (row, column)
2. Which keys have been collected (bitmask)

We can use **BFS with state tracking** because:

- BFS finds shortest paths in unweighted grids
- Tracking keys as a bitmask (up to 6 keys = 64 states) keeps the state space manageable
- We need to avoid revisiting the same (position, keys) state

**Step-by-step reasoning:**

1. First, scan the grid to count keys and find the starting position
2. Use BFS where each node is `(row, col, keys_mask)`
3. When we reach a key, update the mask: `new_mask = mask | (1 << (key - 'a'))`
4. When we reach a lock, check if we have the key: `(mask >> (lock - 'A')) & 1`
5. Stop when `keys_mask` has all bits set (all keys collected)
6. Use a 3D visited array: `visited[row][col][mask]`

This approach works because BFS explores states in increasing distance order, so the first time we reach the "all keys collected" state, we've found the shortest path.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n * 2^k) where k = number of keys (max 6)
# Space: O(m * n * 2^k) for visited array and BFS queue
from collections import deque
from typing import List

def shortestPathAllKeys(grid: List[str]) -> int:
    m, n = len(grid), len(grid[0])

    # Step 1: Find starting position and count keys
    start_r = start_c = -1
    key_count = 0

    for i in range(m):
        for j in range(n):
            if grid[i][j] == '@':
                start_r, start_c = i, j
            elif 'a' <= grid[i][j] <= 'f':
                key_count = max(key_count, ord(grid[i][j]) - ord('a') + 1)

    # Step 2: Initialize BFS with state (row, col, keys_mask)
    # keys_mask is a bitmask where bit i is 1 if we have key i
    target_mask = (1 << key_count) - 1  # All bits set for all keys
    queue = deque()
    queue.append((start_r, start_c, 0))  # Start with no keys
    visited = [[[False] * (1 << key_count) for _ in range(n)] for _ in range(m)]
    visited[start_r][start_c][0] = True

    # Step 3: BFS with 4-directional movement
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    steps = 0

    while queue:
        # Process all nodes at current distance level
        for _ in range(len(queue)):
            r, c, mask = queue.popleft()

            # Check if we've collected all keys
            if mask == target_mask:
                return steps

            # Try all 4 directions
            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds
                if nr < 0 or nr >= m or nc < 0 or nc >= n:
                    continue

                cell = grid[nr][nc]

                # Skip walls
                if cell == '#':
                    continue

                # Handle locks: need corresponding key
                if 'A' <= cell <= 'F':
                    key_needed = ord(cell) - ord('A')
                    if not (mask >> key_needed) & 1:
                        continue  # Don't have the key, can't pass

                new_mask = mask

                # Handle keys: update mask if we find one
                if 'a' <= cell <= 'f':
                    key_idx = ord(cell) - ord('a')
                    new_mask = mask | (1 << key_idx)

                # Check if this state has been visited
                if not visited[nr][nc][new_mask]:
                    visited[nr][nc][new_mask] = True
                    queue.append((nr, nc, new_mask))

        # Increment steps after processing current level
        steps += 1

    # If we exhaust BFS without finding all keys
    return -1
```

```javascript
// Time: O(m * n * 2^k) where k = number of keys (max 6)
// Space: O(m * n * 2^k) for visited array and BFS queue
function shortestPathAllKeys(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Step 1: Find starting position and count keys
  let startR = -1,
    startC = -1;
  let keyCount = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "@") {
        startR = i;
        startC = j;
      } else if (grid[i][j] >= "a" && grid[i][j] <= "f") {
        const keyIdx = grid[i].charCodeAt(j) - "a".charCodeAt(0);
        keyCount = Math.max(keyCount, keyIdx + 1);
      }
    }
  }

  // Step 2: Initialize BFS with state (row, col, keys_mask)
  const targetMask = (1 << keyCount) - 1; // All bits set for all keys
  const queue = [[startR, startC, 0]]; // Start with no keys
  const visited = Array(m)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => Array(1 << keyCount).fill(false))
    );
  visited[startR][startC][0] = true;

  // Step 3: BFS with 4-directional movement
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let steps = 0;

  while (queue.length > 0) {
    // Process all nodes at current distance level
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c, mask] = queue.shift();

      // Check if we've collected all keys
      if (mask === targetMask) {
        return steps;
      }

      // Try all 4 directions
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
          continue;
        }

        const cell = grid[nr][nc];

        // Skip walls
        if (cell === "#") {
          continue;
        }

        // Handle locks: need corresponding key
        if (cell >= "A" && cell <= "F") {
          const keyNeeded = cell.charCodeAt(0) - "A".charCodeAt(0);
          if (!((mask >> keyNeeded) & 1)) {
            continue; // Don't have the key, can't pass
          }
        }

        let newMask = mask;

        // Handle keys: update mask if we find one
        if (cell >= "a" && cell <= "f") {
          const keyIdx = cell.charCodeAt(0) - "a".charCodeAt(0);
          newMask = mask | (1 << keyIdx);
        }

        // Check if this state has been visited
        if (!visited[nr][nc][newMask]) {
          visited[nr][nc][newMask] = true;
          queue.push([nr, nc, newMask]);
        }
      }
    }

    // Increment steps after processing current level
    steps++;
  }

  // If we exhaust BFS without finding all keys
  return -1;
}
```

```java
// Time: O(m * n * 2^k) where k = number of keys (max 6)
// Space: O(m * n * 2^k) for visited array and BFS queue
import java.util.*;

class Solution {
    public int shortestPathAllKeys(String[] grid) {
        int m = grid.length;
        int n = grid[0].length();

        // Step 1: Find starting position and count keys
        int startR = -1, startC = -1;
        int keyCount = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                char cell = grid[i].charAt(j);
                if (cell == '@') {
                    startR = i;
                    startC = j;
                } else if (cell >= 'a' && cell <= 'f') {
                    keyCount = Math.max(keyCount, cell - 'a' + 1);
                }
            }
        }

        // Step 2: Initialize BFS with state (row, col, keys_mask)
        int targetMask = (1 << keyCount) - 1;  // All bits set for all keys
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{startR, startC, 0});  // Start with no keys
        boolean[][][] visited = new boolean[m][n][1 << keyCount];
        visited[startR][startC][0] = true;

        // Step 3: BFS with 4-directional movement
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int steps = 0;

        while (!queue.isEmpty()) {
            // Process all nodes at current distance level
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0], c = current[1], mask = current[2];

                // Check if we've collected all keys
                if (mask == targetMask) {
                    return steps;
                }

                // Try all 4 directions
                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    // Check bounds
                    if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
                        continue;
                    }

                    char cell = grid[nr].charAt(nc);

                    // Skip walls
                    if (cell == '#') {
                        continue;
                    }

                    // Handle locks: need corresponding key
                    if (cell >= 'A' && cell <= 'F') {
                        int keyNeeded = cell - 'A';
                        if (((mask >> keyNeeded) & 1) == 0) {
                            continue;  // Don't have the key, can't pass
                        }
                    }

                    int newMask = mask;

                    // Handle keys: update mask if we find one
                    if (cell >= 'a' && cell <= 'f') {
                        int keyIdx = cell - 'a';
                        newMask = mask | (1 << keyIdx);
                    }

                    // Check if this state has been visited
                    if (!visited[nr][nc][newMask]) {
                        visited[nr][nc][newMask] = true;
                        queue.offer(new int[]{nr, nc, newMask});
                    }
                }
            }

            // Increment steps after processing current level
            steps++;
        }

        // If we exhaust BFS without finding all keys
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × 2^k) where:

- m, n are grid dimensions
- k is the number of keys (≤ 6 as per problem constraints)
- We have m × n positions and 2^k possible key states
- Each state is processed once in BFS

**Space Complexity:** O(m × n × 2^k) for:

- The 3D visited array of size m × n × 2^k
- BFS queue which can hold up to O(m × n × 2^k) states in worst case

The 2^k factor is manageable because k ≤ 6, so 2^6 = 64 states per position.

## Common Mistakes

1. **Not tracking key state in visited array:** Revisiting the same cell with the same keys leads to infinite loops. You must use `visited[row][col][mask]`, not just `visited[row][col]`.

2. **Incorrect BFS level counting:** Forgetting to increment steps after processing a complete level, or incrementing inside the inner loop. BFS steps should increase only after processing all nodes at the current distance.

3. **Bitmask off-by-one errors:** When checking if we have a key for a lock, remember that key 'a' corresponds to lock 'A'. Use consistent indexing: `key_idx = char - 'a'` for keys and `lock_idx = char - 'A'` for locks.

4. **Missing the unreachable case:** Not all grids have a solution. Always handle the case where BFS completes without finding all keys by returning -1.

## When You'll See This Pattern

This **BFS with state tracking** pattern appears in problems where:

1. You need the shortest path in a grid/maze
2. The path depends on collected items or unlocked doors
3. The state space is reasonably small (typically tracked with bitmask)

Related LeetCode problems:

- **"Sliding Puzzle" (Hard)** - BFS with board state as node
- **"Minimum Moves to Reach Target with Rotations" (Hard)** - BFS tracking both position and orientation
- **"Bus Routes" (Hard)** - BFS with bus route states
- **"Open the Lock" (Medium)** - BFS through digit combinations

## Key Takeaways

1. **When shortest path depends on collected items, use BFS with state tracking.** The state includes both position and what you've collected (often as a bitmask).

2. **Bitmasks efficiently represent sets of small size.** For up to 32 items, integers can represent presence/absence with each bit. Operations: set bit `mask | (1 << i)`, check bit `(mask >> i) & 1`, all bits set `(1 << k) - 1`.

3. **The visited array must track all state dimensions.** If visiting (position, items) is different from visiting (position) alone, your visited data structure needs to reflect this.

[Practice this problem on CodeJeet](/problem/shortest-path-to-get-all-keys)
