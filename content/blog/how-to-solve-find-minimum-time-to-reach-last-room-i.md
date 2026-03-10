---
title: "How to Solve Find Minimum Time to Reach Last Room I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Minimum Time to Reach Last Room I. Medium difficulty, 55.5% acceptance rate. Topics: Array, Graph Theory, Heap (Priority Queue), Matrix, Shortest Path."
date: "2027-03-13"
category: "dsa-patterns"
tags:
  [
    "find-minimum-time-to-reach-last-room-i",
    "array",
    "graph-theory",
    "heap-(priority-queue)",
    "medium",
  ]
---

# How to Solve Find Minimum Time to Reach Last Room I

You're given a grid of rooms where each room has an opening time, and you need to find the minimum time to reach the bottom-right corner starting from the top-left. The twist is that you can only enter a room after its opening time has passed, which means you might need to wait before moving into certain rooms. This problem is essentially a shortest path problem with time constraints, making it more interesting than a standard grid traversal.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
moveTime = [
    [0, 5, 3],
    [2, 4, 6],
    [1, 7, 0]
]
```

We start at (0,0) at time t=0. The room opens at time 0, so we can enter immediately.

**Step 1:** From (0,0) at time 0, we can move to (0,1) or (1,0):

- (0,1) opens at time 5, so we'd arrive at max(0+1, 5) = 5
- (1,0) opens at time 2, so we'd arrive at max(0+1, 2) = 2

We take the faster path to (1,0) at time 2.

**Step 2:** From (1,0) at time 2, we can move to (0,0), (1,1), or (2,0):

- (0,0) opens at time 0, arrive at max(2+1, 0) = 3 (but we've been there)
- (1,1) opens at time 4, arrive at max(2+1, 4) = 4
- (2,0) opens at time 1, arrive at max(2+1, 1) = 3

We take (2,0) at time 3.

**Step 3:** From (2,0) at time 3, we can move to (1,0), (2,1):

- (1,0) opens at time 2, arrive at max(3+1, 2) = 4 (visited)
- (2,1) opens at time 7, arrive at max(3+1, 7) = 7

We take (2,1) at time 7.

**Step 4:** From (2,1) at time 7, we can move to (1,1), (2,0), or (2,2):

- (1,1) opens at time 4, arrive at max(7+1, 4) = 8
- (2,0) opens at time 1, arrive at max(7+1, 1) = 8 (visited)
- (2,2) opens at time 0, arrive at max(7+1, 0) = 8

We reach the destination (2,2) at time 8.

The key insight is that we always need to take `max(current_time + 1, moveTime[next_room])` because:

1. It takes 1 second to move to an adjacent room
2. We can only enter if the room has opened

## Brute Force Approach

A naive approach would be to explore all possible paths from (0,0) to (n-1,m-1) and track the minimum time. We could use DFS or BFS to explore the grid, but we'd need to handle cycles and track the best time to reach each cell.

The brute force BFS/DFS would be exponential in time complexity because:

- At each cell, we have up to 4 choices (up, down, left, right)
- We might revisit cells multiple times with different arrival times
- We'd need to explore all paths to find the minimum

Even with memoization, a simple DFS would still be inefficient because we can't just store a single "visited" time - we might find a better path to a cell later that allows us to reach the destination faster.

Here's what a naive DFS might look like (without proper optimization):

```python
def min_time_brute_force(moveTime):
    n, m = len(moveTime), len(moveTime[0])
    min_time = float('inf')

    def dfs(i, j, current_time):
        nonlocal min_time

        if i == n-1 and j == m-1:
            min_time = min(min_time, current_time)
            return

        # Try all 4 directions
        for di, dj in [(1,0), (-1,0), (0,1), (0,-1)]:
            ni, nj = i + di, j + dj
            if 0 <= ni < n and 0 <= nj < m:
                next_time = max(current_time + 1, moveTime[ni][nj])
                dfs(ni, nj, next_time)

    dfs(0, 0, max(0, moveTime[0][0]))
    return min_time
```

This approach fails because:

1. It explores all possible paths (exponential time)
2. It doesn't handle cycles properly (infinite recursion risk)
3. It doesn't use the fact that we should always take the fastest path to each cell

## Optimized Approach

The key insight is that this is essentially a **shortest path problem** with edge weights of 1 (moving between adjacent rooms) and node constraints (minimum entry times). We can use **Dijkstra's algorithm** with a priority queue (min-heap) to always expand the node with the smallest current time.

Why Dijkstra works here:

1. The "cost" to move between rooms is always 1 (time to move)
2. The actual arrival time at a room is `max(current_time + 1, moveTime[room])`
3. Dijkstra guarantees that when we first pop a node from the heap, we've found the minimum time to reach it (assuming non-negative weights)

The algorithm works as follows:

1. Start with a min-heap containing (start_time, 0, 0) where start_time = max(0, moveTime[0][0])
2. Maintain a `dist` matrix tracking the minimum time to reach each cell
3. While heap is not empty:
   - Pop the node with smallest time
   - If it's the destination, return the time
   - For each neighbor:
     - Calculate arrival time = max(current_time + 1, moveTime[neighbor])
     - If this is better than known distance, update and push to heap

## Optimal Solution

Here's the complete solution using Dijkstra's algorithm with a min-heap:

<div class="code-group">

```python
# Time: O(n*m*log(n*m)) - Each cell processed once, heap operations are log(n*m)
# Space: O(n*m) - For dist matrix and heap
import heapq

def minTime(moveTime):
    n, m = len(moveTime), len(moveTime[0])

    # dist[i][j] stores minimum time to reach cell (i,j)
    dist = [[float('inf')] * m for _ in range(n)]

    # Start at (0,0) - we can only enter after moveTime[0][0]
    start_time = max(0, moveTime[0][0])
    dist[0][0] = start_time

    # Min-heap stores (time, row, col)
    heap = [(start_time, 0, 0)]

    # Directions: down, up, right, left
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while heap:
        time, i, j = heapq.heappop(heap)

        # If we reached destination, return the time
        if i == n - 1 and j == m - 1:
            return time

        # If this is not the best known time for this cell, skip it
        if time > dist[i][j]:
            continue

        # Explore all 4 neighbors
        for di, dj in directions:
            ni, nj = i + di, j + dj

            # Check if neighbor is within bounds
            if 0 <= ni < n and 0 <= nj < m:
                # Calculate arrival time at neighbor
                # We need max of (current_time + 1) and the room's opening time
                arrival_time = max(time + 1, moveTime[ni][nj])

                # If we found a better path to neighbor
                if arrival_time < dist[ni][nj]:
                    dist[ni][nj] = arrival_time
                    heapq.heappush(heap, (arrival_time, ni, nj))

    return dist[n-1][m-1]
```

```javascript
// Time: O(n*m*log(n*m)) - Each cell processed once, heap operations are log(n*m)
// Space: O(n*m) - For dist matrix and heap
function minTime(moveTime) {
  const n = moveTime.length;
  const m = moveTime[0].length;

  // dist[i][j] stores minimum time to reach cell (i,j)
  const dist = Array(n)
    .fill()
    .map(() => Array(m).fill(Infinity));

  // Min-heap implementation using array
  const heap = new MinHeap();

  // Start at (0,0) - we can only enter after moveTime[0][0]
  const startTime = Math.max(0, moveTime[0][0]);
  dist[0][0] = startTime;
  heap.push([startTime, 0, 0]);

  // Directions: down, up, right, left
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (!heap.isEmpty()) {
    const [time, i, j] = heap.pop();

    // If we reached destination, return the time
    if (i === n - 1 && j === m - 1) {
      return time;
    }

    // If this is not the best known time for this cell, skip it
    if (time > dist[i][j]) {
      continue;
    }

    // Explore all 4 neighbors
    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;

      // Check if neighbor is within bounds
      if (ni >= 0 && ni < n && nj >= 0 && nj < m) {
        // Calculate arrival time at neighbor
        // We need max of (current_time + 1) and the room's opening time
        const arrivalTime = Math.max(time + 1, moveTime[ni][nj]);

        // If we found a better path to neighbor
        if (arrivalTime < dist[ni][nj]) {
          dist[ni][nj] = arrivalTime;
          heap.push([arrivalTime, ni, nj]);
        }
      }
    }
  }

  return dist[n - 1][m - 1];
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent][0] <= this.heap[index][0]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let swap = null;

      if (left < length && this.heap[left][0] < this.heap[index][0]) {
        swap = left;
      }

      if (right < length) {
        if (
          (swap === null && this.heap[right][0] < this.heap[index][0]) ||
          (swap !== null && this.heap[right][0] < this.heap[left][0])
        ) {
          swap = right;
        }
      }

      if (swap === null) break;
      [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
      index = swap;
    }
  }
}
```

```java
// Time: O(n*m*log(n*m)) - Each cell processed once, heap operations are log(n*m)
// Space: O(n*m) - For dist matrix and heap
import java.util.*;

class Solution {
    public int minTime(int[][] moveTime) {
        int n = moveTime.length;
        int m = moveTime[0].length;

        // dist[i][j] stores minimum time to reach cell (i,j)
        int[][] dist = new int[n][m];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], Integer.MAX_VALUE);
        }

        // Min-heap stores [time, row, col]
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        // Start at (0,0) - we can only enter after moveTime[0][0]
        int startTime = Math.max(0, moveTime[0][0]);
        dist[0][0] = startTime;
        heap.offer(new int[]{startTime, 0, 0});

        // Directions: down, up, right, left
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int time = current[0];
            int i = current[1];
            int j = current[2];

            // If we reached destination, return the time
            if (i == n - 1 && j == m - 1) {
                return time;
            }

            // If this is not the best known time for this cell, skip it
            if (time > dist[i][j]) {
                continue;
            }

            // Explore all 4 neighbors
            for (int[] dir : directions) {
                int ni = i + dir[0];
                int nj = j + dir[1];

                // Check if neighbor is within bounds
                if (ni >= 0 && ni < n && nj >= 0 && nj < m) {
                    // Calculate arrival time at neighbor
                    // We need max of (current_time + 1) and the room's opening time
                    int arrivalTime = Math.max(time + 1, moveTime[ni][nj]);

                    // If we found a better path to neighbor
                    if (arrivalTime < dist[ni][nj]) {
                        dist[ni][nj] = arrivalTime;
                        heap.offer(new int[]{arrivalTime, ni, nj});
                    }
                }
            }
        }

        return dist[n-1][m-1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n*m*log(n\*m))

- We process each cell at most once when we find a better path to it
- Each heap operation (push/pop) takes O(log(n\*m)) time
- In the worst case, we might push each cell into the heap multiple times, but each cell will only be processed once when popped with its minimum time
- With n rows and m columns, we have n*m cells, hence O(n*m*log(n*m))

**Space Complexity:** O(n\*m)

- We store a `dist` matrix of size n\*m to track minimum times
- The heap can contain up to O(n\*m) elements in the worst case
- Additional O(1) space for variables and directions array

## Common Mistakes

1. **Forgetting to handle the starting room's opening time:** Some candidates assume they can always start at time 0, but the starting room might have `moveTime[0][0] > 0`, requiring them to wait before starting.

2. **Using BFS instead of Dijkstra:** BFS assumes all edges have equal weight, but here the effective "weight" changes based on when we arrive at a node due to the `max()` operation. BFS would give wrong results because it doesn't account for the fact that taking a longer path might actually result in arriving at a better time if it avoids waiting.

3. **Not skipping outdated heap entries:** When we find a better path to a cell, we push it to the heap. Older entries for that cell with higher times will still be in the heap. We must check `if (time > dist[i][j]) continue;` to skip processing outdated entries.

4. **Incorrect arrival time calculation:** The formula is `max(current_time + 1, moveTime[neighbor])`, not `current_time + 1 + moveTime[neighbor]`. We don't add the moveTime to our travel time - we compare it to determine if we need to wait.

## When You'll See This Pattern

This pattern of using Dijkstra's algorithm for grid problems with constraints appears in several LeetCode problems:

1. **Minimum Cost to Reach Destination in Time (LeetCode 1928):** Similar concept but with costs on edges and a time limit constraint. You need to find the minimum cost path that can be completed within a time limit.

2. **Minimum Time to Visit a Cell In a Grid (LeetCode 2577):** Another grid problem where you can only move to cells at certain times, requiring similar reasoning about when you can enter cells.

3. **Path With Minimum Effort (LeetCode 1631):** Find a path that minimizes the maximum absolute difference in heights between consecutive cells. Uses Dijkstra with the "cost" being the maximum difference along the path.

4. **Cheapest Flights Within K Stops (LeetCode 787):** Dijkstra with an additional constraint on the number of stops/edges you can take.

The common thread is using Dijkstra (or sometimes BFS with modifications) when you have:

- A grid or graph structure
- Some constraint that makes simple BFS insufficient
- A need to minimize some metric (time, cost, effort)

## Key Takeaways

1. **Recognize Dijkstra problems:** When you see a shortest path problem where edges have weights or nodes have constraints that affect path cost, think Dijkstra with a priority queue.

2. **Understand the arrival time formula:** For problems with opening times or constraints, the key is often `max(arrival_time, constraint_time)` rather than adding times together.

3. **Always handle the starting node properly:** Don't assume you start at time 0 or cost 0 - check if the starting position has any constraints.

4. **Use lazy deletion for heap entries:** When you update distances, push new entries to the heap and skip outdated ones when popping. This is cleaner than trying to update or remove entries from the heap.

Related problems: [Minimum Cost to Reach Destination in Time](/problem/minimum-cost-to-reach-destination-in-time), [Minimum Time to Visit a Cell In a Grid](/problem/minimum-time-to-visit-a-cell-in-a-grid)
