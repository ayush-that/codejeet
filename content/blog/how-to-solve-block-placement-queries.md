---
title: "How to Solve Block Placement Queries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Block Placement Queries. Hard difficulty, 18.4% acceptance rate. Topics: Array, Binary Search, Binary Indexed Tree, Segment Tree."
date: "2026-04-02"
category: "dsa-patterns"
tags: ["block-placement-queries", "array", "binary-search", "binary-indexed-tree", "hard"]
---

# How to Solve Block Placement Queries

This problem presents a challenging scenario where we need to efficiently manage obstacle placements on an infinite number line and answer queries about the nearest available position to place a block. The tricky part is that we need to handle two types of operations: placing obstacles and answering queries about block placement, all while maintaining efficiency as the number of queries grows large.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have these queries:

```
queries = [[1, 3], [2, 2, 5], [1, 7], [2, 1, 9], [2, 4, 6]]
```

We'll process them step by step:

1. **Query 1:** `[1, 3]` - Place an obstacle at position 3
   - Obstacles: {3}
2. **Query 2:** `[2, 2, 5]` - Find the nearest position to place a block of size 2 starting at or after position 5
   - We need to check if positions 5-6 are available (block of size 2 starting at 5)
   - Position 5 is available (no obstacle at 5)
   - Position 6 is available (no obstacle at 6)
   - Since both positions are free, we can place the block starting at 5
   - **Answer:** 5
3. **Query 3:** `[1, 7]` - Place an obstacle at position 7
   - Obstacles: {3, 7}
4. **Query 4:** `[2, 1, 9]` - Find the nearest position to place a block of size 1 starting at or after position 9
   - Check position 9: available (no obstacle at 9)
   - **Answer:** 9
5. **Query 5:** `[2, 4, 6]` - Find the nearest position to place a block of size 4 starting at or after position 6
   - We need 4 consecutive free positions starting at or after 6
   - Check starting at 6: positions 6, 7, 8, 9
     - Position 7 has an obstacle! So we can't start at 6
   - Check starting at 8: positions 8, 9, 10, 11
     - All positions are free (no obstacles)
   - **Answer:** 8

The key insight is that we need to efficiently check for consecutive free positions and quickly find the next available starting point when we encounter obstacles.

## Brute Force Approach

A naive approach would be to maintain a list or set of obstacle positions. For each type 2 query, we would:

1. Start checking from the given `start` position
2. For each candidate starting position, check if all positions from `start` to `start + size - 1` are free
3. If we find an obstacle, move to the next position and repeat

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(q * m * n) where q = number of queries,
#       m = average gap between obstacles, n = block size
# Space: O(k) where k = number of obstacles
def brute_force(queries):
    obstacles = set()
    results = []

    for query in queries:
        if query[0] == 1:
            # Type 1: Add obstacle
            obstacles.add(query[1])
        else:
            # Type 2: Find block placement
            _, size, start = query
            current_pos = start

            while True:
                # Check if we can place block starting at current_pos
                can_place = True
                for i in range(size):
                    if (current_pos + i) in obstacles:
                        can_place = False
                        # Skip to after the obstacle
                        current_pos = current_pos + i + 1
                        break

                if can_place:
                    results.append(current_pos)
                    break

    return results
```

```javascript
// Time: O(q * m * n) where q = number of queries,
//       m = average gap between obstacles, n = block size
// Space: O(k) where k = number of obstacles
function bruteForce(queries) {
  const obstacles = new Set();
  const results = [];

  for (const query of queries) {
    if (query[0] === 1) {
      // Type 1: Add obstacle
      obstacles.add(query[1]);
    } else {
      // Type 2: Find block placement
      const [_, size, start] = query;
      let currentPos = start;

      while (true) {
        // Check if we can place block starting at currentPos
        let canPlace = true;
        for (let i = 0; i < size; i++) {
          if (obstacles.has(currentPos + i)) {
            canPlace = false;
            // Skip to after the obstacle
            currentPos = currentPos + i + 1;
            break;
          }
        }

        if (canPlace) {
          results.push(currentPos);
          break;
        }
      }
    }
  }

  return results;
}
```

```java
// Time: O(q * m * n) where q = number of queries,
//       m = average gap between obstacles, n = block size
// Space: O(k) where k = number of obstacles
public List<Integer> bruteForce(int[][] queries) {
    Set<Integer> obstacles = new HashSet<>();
    List<Integer> results = new ArrayList<>();

    for (int[] query : queries) {
        if (query[0] == 1) {
            // Type 1: Add obstacle
            obstacles.add(query[1]);
        } else {
            // Type 2: Find block placement
            int size = query[1];
            int start = query[2];
            int currentPos = start;

            while (true) {
                // Check if we can place block starting at currentPos
                boolean canPlace = true;
                for (int i = 0; i < size; i++) {
                    if (obstacles.contains(currentPos + i)) {
                        canPlace = false;
                        // Skip to after the obstacle
                        currentPos = currentPos + i + 1;
                        break;
                    }
                }

                if (canPlace) {
                    results.add(currentPos);
                    break;
                }
            }
        }
    }

    return results;
}
```

</div>

**Why this fails:** The brute force approach is too slow because in the worst case, we might need to check many positions (potentially up to 10^9) for each query. With up to 10^5 queries, this becomes O(10^14) operations, which is completely infeasible.

## Optimized Approach

The key insight is that we need to efficiently:

1. Find the next obstacle after a given position
2. Check if we have enough consecutive free positions

We can use a **TreeSet** (in Java) or **sorted list with bisect** (in Python) to store obstacles in sorted order. This allows us to:

- Quickly find the next obstacle after any position using binary search
- Skip over large gaps efficiently

For a type 2 query `[2, size, start]`:

1. Begin at `current = start`
2. Use binary search to find the next obstacle at or after `current`
3. If no obstacle is found within `size` positions from `current`, we can place the block
4. If an obstacle is found within the range, we need to restart our search from just after that obstacle

The optimization comes from being able to jump over obstacles in O(log n) time rather than checking each position one by one.

## Optimal Solution

Here's the complete solution using sorted data structures with binary search:

<div class="code-group">

```python
# Time: O(q log k) where q = number of queries, k = number of obstacles
# Space: O(k) for storing obstacles
from bisect import bisect_left

def processQueries(queries):
    # Store obstacles in sorted order for efficient binary search
    obstacles = []
    results = []

    for query in queries:
        if query[0] == 1:
            # Type 1: Add obstacle at position x
            x = query[1]
            # Insert while maintaining sorted order
            idx = bisect_left(obstacles, x)
            # Only add if not already present (guaranteed by problem but good practice)
            if idx == len(obstacles) or obstacles[idx] != x:
                obstacles.insert(idx, x)
        else:
            # Type 2: Find position for block of given size
            _, size, start = query
            current = start

            while True:
                # Find the first obstacle at or after current position
                idx = bisect_left(obstacles, current)

                if idx == len(obstacles):
                    # No more obstacles after current position
                    # We can place the block starting at current
                    results.append(current)
                    break

                obstacle_pos = obstacles[idx]

                # Check if obstacle is within the block range
                if obstacle_pos < current + size:
                    # Obstacle interferes with our block
                    # We need to start after this obstacle
                    current = obstacle_pos + 1
                else:
                    # No obstacle in the range [current, current + size - 1]
                    # We can place the block here
                    results.append(current)
                    break

    return results
```

```javascript
// Time: O(q log k) where q = number of queries, k = number of obstacles
// Space: O(k) for storing obstacles
function processQueries(queries) {
  // Store obstacles in sorted order
  const obstacles = [];
  const results = [];

  // Helper function to find insertion index using binary search
  function bisectLeft(arr, x) {
    let left = 0;
    let right = arr.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] < x) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }

  for (const query of queries) {
    if (query[0] === 1) {
      // Type 1: Add obstacle at position x
      const x = query[1];
      const idx = bisectLeft(obstacles, x);

      // Insert while maintaining sorted order (avoid duplicates)
      if (idx === obstacles.length || obstacles[idx] !== x) {
        obstacles.splice(idx, 0, x);
      }
    } else {
      // Type 2: Find position for block of given size
      const size = query[1];
      const start = query[2];
      let current = start;

      while (true) {
        // Find the first obstacle at or after current position
        const idx = bisectLeft(obstacles, current);

        if (idx === obstacles.length) {
          // No more obstacles after current position
          results.push(current);
          break;
        }

        const obstaclePos = obstacles[idx];

        // Check if obstacle is within the block range
        if (obstaclePos < current + size) {
          // Obstacle interferes - restart search after obstacle
          current = obstaclePos + 1;
        } else {
          // Safe to place block here
          results.push(current);
          break;
        }
      }
    }
  }

  return results;
}
```

```java
// Time: O(q log k) where q = number of queries, k = number of obstacles
// Space: O(k) for storing obstacles
import java.util.*;

public List<Integer> processQueries(int[][] queries) {
    // Use TreeSet for automatic sorting and efficient ceiling operations
    TreeSet<Integer> obstacles = new TreeSet<>();
    List<Integer> results = new ArrayList<>();

    for (int[] query : queries) {
        if (query[0] == 1) {
            // Type 1: Add obstacle at position x
            int x = query[1];
            obstacles.add(x);
        } else {
            // Type 2: Find position for block of given size
            int size = query[1];
            int start = query[2];
            long current = start; // Use long to avoid overflow

            while (true) {
                // Find the smallest obstacle >= current
                Integer nextObstacle = obstacles.ceiling((int) current);

                if (nextObstacle == null) {
                    // No obstacles after current position
                    results.add((int) current);
                    break;
                }

                // Check if obstacle is within the block's range
                if (nextObstacle < current + size) {
                    // Obstacle interferes - move start position after obstacle
                    current = nextObstacle + 1L;
                } else {
                    // Safe to place block at current position
                    results.add((int) current);
                    break;
                }
            }
        }
    }

    return results;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(q log k) where:

- `q` is the number of queries (up to 10^5)
- `k` is the number of type 1 queries (obstacle placements, up to 10^5)

For each type 2 query, we perform binary search operations (O(log k)) and might need to skip multiple obstacles. In the worst case, we might skip all obstacles, but each obstacle is processed at most once across all queries, giving us amortized O(q log k) complexity.

**Space Complexity:** O(k) where `k` is the number of obstacles stored. We need to maintain the sorted collection of obstacle positions.

## Common Mistakes

1. **Not handling large numbers correctly:** The positions can be up to 10^9, and when adding block size, we might exceed 32-bit integer limits. Always use 64-bit integers (long in Java, no issue in Python) for intermediate calculations.

2. **Forgetting that obstacles are unique:** The problem guarantees obstacles are placed at distinct positions, but some candidates still implement duplicate checking. While not wrong, it's unnecessary and adds complexity.

3. **Infinite loop in type 2 queries:** When an obstacle is found within the block range, you must move the start position to `obstacle_pos + 1`, not just `current + 1`. Otherwise, you might get stuck checking the same position repeatedly.

4. **Inefficient obstacle lookup:** Using linear search (checking each obstacle) instead of binary search makes the solution O(qk) which is too slow for the constraints. Always leverage the sorted nature of obstacles.

## When You'll See This Pattern

This pattern of maintaining a sorted collection and using binary search to answer range queries appears in several problems:

1. **My Calendar I (LeetCode 729):** Similar concept of checking for overlaps in booked time slots using binary search on sorted intervals.

2. **Data Stream as Disjoint Intervals (LeetCode 352):** Maintaining and merging intervals using sorted data structures and binary search.

3. **Range Module (LeetCode 715):** Tracking ranges and answering queries about coverage, using TreeMap or similar structures.

The core technique is using binary search on a sorted collection to efficiently answer queries about availability, overlaps, or nearest elements.

## Key Takeaways

1. **Sorted collections + binary search** is a powerful pattern for problems involving range queries and nearest element searches. When you need to frequently find "the first element greater than or equal to X," think of this approach.

2. **Skip, don't scan:** When searching for available space, use obstacles to jump ahead efficiently rather than checking every position. This transforms O(n) scans into O(log n) skips.

3. **Mind the bounds:** With large numbers (up to 10^9) and potential additions, always consider integer overflow and use appropriate data types (long instead of int for intermediate calculations).

Related problems: [Building Boxes](/problem/building-boxes), [Fruits Into Baskets III](/problem/fruits-into-baskets-iii)
