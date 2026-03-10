---
title: "How to Solve Find Minimum Time to Reach Last Room II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Minimum Time to Reach Last Room II. Medium difficulty, 67.9% acceptance rate. Topics: Array, Graph Theory, Heap (Priority Queue), Matrix, Shortest Path."
date: "2027-07-19"
category: "dsa-patterns"
tags:
  [
    "find-minimum-time-to-reach-last-room-ii",
    "array",
    "graph-theory",
    "heap-(priority-queue)",
    "medium",
  ]
---

# How to Solve Find Minimum Time to Reach Last Room II

You're given a grid of rooms where each room has a minimum entry time, and you need to find the earliest time you can reach the bottom-right corner starting from the top-left at time 0. The twist: you can only move to adjacent rooms (up, down, left, right), but you must wait until at least the room's minimum entry time before you can even start moving into it. This problem is interesting because it combines grid traversal with time-based constraints, requiring careful consideration of when you can actually enter each cell.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
moveTime = [
    [0, 5],
    [3, 1]
]
```

We start at (0,0) at time t=0. The room (0,0) has moveTime[0][0]=0, so we can enter immediately.

**Step 1:** From (0,0) at t=0, we can move to adjacent rooms:

- (1,0): moveTime[1][0]=3, so we can enter at max(0+1, 3) = 3
- (0,1): moveTime[0][1]=5, so we can enter at max(0+1, 5) = 5

**Step 2:** From (1,0) at t=3, we can move to:

- (1,1): moveTime[1][1]=1, so we can enter at max(3+1, 1) = 4
- Back to (0,0): but we've already been there

**Step 3:** From (0,1) at t=5, we can move to:

- (1,1): moveTime[1][1]=1, so we can enter at max(5+1, 1) = 6

**Step 4:** Compare paths to (1,1):

- Path 1: (0,0)→(1,0)→(1,1) arrives at t=4
- Path 2: (0,0)→(0,1)→(1,1) arrives at t=6

The earliest we can reach (1,1) is t=4. Notice that even though (1,1) has moveTime=1, we can't reach it at time 1 because we need time to travel there.

## Brute Force Approach

A naive approach would be to explore all possible paths from (0,0) to (n-1,m-1) using DFS or BFS, keeping track of the arrival time at each cell. For each path, we'd calculate the arrival time at the destination and take the minimum.

The problem with this approach is exponential complexity. In an n×m grid, there are many possible paths (especially for larger grids), and we'd be exploring redundant paths. Even with BFS, we might revisit cells multiple times with different arrival times, and we'd need to track all of them.

A slightly better but still inefficient approach would be to use Dijkstra's algorithm without a priority queue - essentially BFS that always explores the cell with the smallest current time. However, without a priority queue, we'd need to scan all unvisited cells each time to find the minimum, resulting in O((n×m)²) time complexity.

## Optimized Approach

The key insight is that this is essentially a shortest path problem in a weighted graph, where the "weight" is the time it takes to move from one cell to another, but with the additional constraint that we must wait until the moveTime to enter a cell.

We can model this using Dijkstra's algorithm with a priority queue (min-heap). Each cell has:

1. A minimum entry time (moveTime[i][j])
2. A travel time from neighboring cells (1 second per move)

When considering moving from cell A to cell B:

- If we reach cell B at time `t`, but `t < moveTime[B]`, we must wait until `moveTime[B]`
- So the actual arrival time at B is `max(t, moveTime[B])`

Dijkstra's algorithm works perfectly here because:

1. It always processes the cell with the smallest known arrival time first
2. Once we process a cell, we've found the shortest time to reach it
3. The time to move between adjacent cells is constant (1 second)

The algorithm:

1. Start with (0,0) at time `max(0, moveTime[0][0])`
2. Use a min-heap to always process the cell with the smallest arrival time
3. For each neighbor, calculate the potential arrival time: `max(current_time + 1, moveTime[neighbor])`
4. If this time is better than the previously known time for that neighbor, update it and push to the heap
5. Continue until we process the destination cell (n-1, m-1)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n*m*log(n*m)) - Each cell processed once, heap operations are log(n*m)
# Space: O(n*m) - For distance array and heap
import heapq

def minTimeToReach(moveTime):
    n = len(moveTime)
    m = len(moveTime[0])

    # Initialize distance array with infinity for all cells
    dist = [[float('inf')] * m for _ in range(n)]

    # Min-heap: (arrival_time, row, col)
    heap = []

    # Start from (0,0) - we can enter at max(0, moveTime[0][0])
    start_time = max(0, moveTime[0][0])
    dist[0][0] = start_time
    heapq.heappush(heap, (start_time, 0, 0))

    # Directions: down, up, right, left
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while heap:
        current_time, row, col = heapq.heappop(heap)

        # If we've already found a better path to this cell, skip
        if current_time > dist[row][col]:
            continue

        # If we reached the destination, return the time
        if row == n - 1 and col == m - 1:
            return current_time

        # Explore all four neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check if neighbor is within bounds
            if 0 <= new_row < n and 0 <= new_col < m:
                # Calculate arrival time at neighbor
                # We need 1 second to move, and must wait until moveTime[new_row][new_col]
                arrival_time = max(current_time + 1, moveTime[new_row][new_col])

                # If we found a better path to the neighbor
                if arrival_time < dist[new_row][new_col]:
                    dist[new_row][new_col] = arrival_time
                    heapq.heappush(heap, (arrival_time, new_row, new_col))

    # If we exhaust all possibilities without reaching destination
    return dist[n-1][m-1]
```

```javascript
// Time: O(n*m*log(n*m)) - Each cell processed once, heap operations are log(n*m)
// Space: O(n*m) - For distance array and heap
function minTimeToReach(moveTime) {
  const n = moveTime.length;
  const m = moveTime[0].length;

  // Initialize distance array with Infinity for all cells
  const dist = Array(n)
    .fill()
    .map(() => Array(m).fill(Infinity));

  // Min-heap: each element is [arrival_time, row, col]
  const heap = new MinHeap();

  // Start from (0,0) - we can enter at max(0, moveTime[0][0])
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
    const [currentTime, row, col] = heap.pop();

    // If we've already found a better path to this cell, skip
    if (currentTime > dist[row][col]) {
      continue;
    }

    // If we reached the destination, return the time
    if (row === n - 1 && col === m - 1) {
      return currentTime;
    }

    // Explore all four neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if neighbor is within bounds
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < m) {
        // Calculate arrival time at neighbor
        // We need 1 second to move, and must wait until moveTime[newRow][newCol]
        const arrivalTime = Math.max(currentTime + 1, moveTime[newRow][newCol]);

        // If we found a better path to the neighbor
        if (arrivalTime < dist[newRow][newCol]) {
          dist[newRow][newCol] = arrivalTime;
          heap.push([arrivalTime, newRow, newCol]);
        }
      }
    }
  }

  // If we exhaust all possibilities without reaching destination
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
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element[0] >= parent[0]) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild[0] < element[0]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && rightChild[0] < leftChild[0])
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = element;
  }
}
```

```java
// Time: O(n*m*log(n*m)) - Each cell processed once, heap operations are log(n*m)
// Space: O(n*m) - For distance array and heap
import java.util.*;

class Solution {
    public int minTimeToReach(int[][] moveTime) {
        int n = moveTime.length;
        int m = moveTime[0].length;

        // Initialize distance array with infinity for all cells
        int[][] dist = new int[n][m];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], Integer.MAX_VALUE);
        }

        // Min-heap: each element is [arrival_time, row, col]
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        // Start from (0,0) - we can enter at max(0, moveTime[0][0])
        int startTime = Math.max(0, moveTime[0][0]);
        dist[0][0] = startTime;
        heap.offer(new int[]{startTime, 0, 0});

        // Directions: down, up, right, left
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int currentTime = current[0];
            int row = current[1];
            int col = current[2];

            // If we've already found a better path to this cell, skip
            if (currentTime > dist[row][col]) {
                continue;
            }

            // If we reached the destination, return the time
            if (row == n - 1 && col == m - 1) {
                return currentTime;
            }

            // Explore all four neighbors
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check if neighbor is within bounds
                if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < m) {
                    // Calculate arrival time at neighbor
                    // We need 1 second to move, and must wait until moveTime[newRow][newCol]
                    int arrivalTime = Math.max(currentTime + 1, moveTime[newRow][newCol]);

                    // If we found a better path to the neighbor
                    if (arrivalTime < dist[newRow][newCol]) {
                        dist[newRow][newCol] = arrivalTime;
                        heap.offer(new int[]{arrivalTime, newRow, newCol});
                    }
                }
            }
        }

        // If we exhaust all possibilities without reaching destination
        return dist[n-1][m-1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n×m×log(n×m))

- We process each cell at most once: O(n×m) cells
- For each cell, we perform heap operations (push/pop): O(log(n×m)) each
- Each cell has up to 4 neighbors, but constant factors are dropped in Big O
- Total: O(n×m × log(n×m))

**Space Complexity:** O(n×m)

- Distance array: O(n×m) to store shortest times to each cell
- Heap: In worst case, could contain all cells: O(n×m)
- Total: O(n×m)

## Common Mistakes

1. **Forgetting to handle the starting cell's moveTime**: The starting cell (0,0) also has a moveTime constraint. You can't start moving from it until `max(0, moveTime[0][0])`. Many candidates assume they can always start at time 0.

2. **Using BFS instead of Dijkstra**: BFS assumes all edges have equal weight, but here the "effective weight" depends on both the move time (1 second) and the moveTime constraint. BFS would give wrong results when moveTime values create different effective costs.

3. **Not checking for better paths when revisiting cells**: A cell might be reached via multiple paths with different arrival times. You must always check if a new path is better than the previously known best path to that cell.

4. **Incorrect arrival time calculation**: The formula `max(current_time + 1, moveTime[neighbor])` is crucial. Some candidates use `current_time + 1 + moveTime[neighbor]` or other incorrect combinations.

## When You'll See This Pattern

This pattern of Dijkstra's algorithm on a grid with modified edge weights appears in several LeetCode problems:

1. **Minimum Time to Visit a Cell In a Grid (Hard)**: Similar concept where you can only move to a cell if the current time meets certain conditions. The main difference is the movement constraints are based on parity of the time.

2. **Minimum Cost to Reach Destination in Time (Hard)**: Combines Dijkstra with a time budget constraint, requiring you to find the cheapest path within a given time limit.

3. **Path With Minimum Effort (Medium)**: Uses Dijkstra to find the path where the maximum absolute difference between consecutive cells is minimized.

The common thread is using Dijkstra's algorithm when you have a grid/graph where the "cost" to move between nodes isn't simply the edge weight, but depends on additional constraints or requires transformation.

## Key Takeaways

1. **Dijkstra's algorithm is your go-to for shortest path problems with non-negative weights**, even when those weights are dynamic or depend on arrival time. The key insight is that once a node is processed with Dijkstra, you've found the shortest path to it.

2. **When movement costs depend on arrival time**, calculate the effective cost as you explore each edge. In this case: `max(current_time + movement_cost, destination_constraint)`.

3. **Grid problems often benefit from Dijkstra** when simple BFS/DFS won't work due to varying "costs" between cells. Look for keywords like "minimum time," "earliest arrival," or "shortest path with constraints."

Related problems: [Minimum Cost to Reach Destination in Time](/problem/minimum-cost-to-reach-destination-in-time), [Minimum Time to Visit a Cell In a Grid](/problem/minimum-time-to-visit-a-cell-in-a-grid)
