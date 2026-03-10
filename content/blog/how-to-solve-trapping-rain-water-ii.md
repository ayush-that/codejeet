---
title: "How to Solve Trapping Rain Water II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Trapping Rain Water II. Hard difficulty, 64.0% acceptance rate. Topics: Array, Breadth-First Search, Heap (Priority Queue), Matrix."
date: "2028-04-03"
category: "dsa-patterns"
tags: ["trapping-rain-water-ii", "array", "breadth-first-search", "heap-(priority-queue)", "hard"]
---

# How to Solve Trapping Rain Water II

Trapping Rain Water II is a challenging 2D extension of the classic Trapping Rain Water problem. Instead of a 1D elevation map, we now have an `m x n` matrix where each cell has a height. Water can be trapped in the interior cells, but only if there's a "container" formed by surrounding cells that are taller. The tricky part is that water can leak out through the lowest boundary cell, making this fundamentally different from the 1D version where we only needed to consider left and right boundaries.

## Visual Walkthrough

Let's trace through a small 3×3 example to build intuition:

```
Input: [[3,3,3],
        [3,1,3],
        [3,3,3]]
```

Think of this as a 3×3 swimming pool. All border cells have height 3, and the center cell has height 1. Water can be trapped in the center because it's surrounded by taller cells. How much water?

1. The center cell (height 1) is lower than its neighbors (all height 3)
2. Water will fill up to the height of the lowest boundary cell
3. All boundary cells are height 3, so water can rise to height 3
4. The center cell can hold (3 - 1) = 2 units of water

Now consider a more complex example:

```
Input: [[1,4,3,1,3,2],
        [3,2,1,3,2,4],
        [2,3,3,2,3,1]]
```

The key insight: water can only be trapped if there's a "container" with walls on all sides. But unlike a real container where the walls must be continuous, here water can leak through any cell on the boundary. This means we need to think about the lowest boundary cell that water could potentially escape through.

## Brute Force Approach

A naive approach might try to calculate for each cell how much water it can hold by finding the minimum of the maximum heights in all four directions (like the 1D solution). However, this doesn't work because:

1. In 2D, water can flow in multiple directions, not just left/right
2. The "container" shape is irregular - water might escape through a low point that's not in a straight line from the cell
3. The maximum water level for a cell is determined by the lowest point on the path to the boundary, not just the immediate neighbors

A brute force approach would need to, for each cell, find all paths to the boundary and determine the maximum water level along each path, then take the minimum of these maximums. This is computationally infeasible for any reasonable matrix size.

## Optimized Approach

The key insight comes from thinking about the problem from the outside in, rather than inside out. Instead of asking "how much water can each cell hold?", we ask "what's the maximum water level that can be maintained at each cell?"

Here's the step-by-step reasoning:

1. **Start from the boundaries**: Water can always escape through boundary cells, so their water level equals their height.
2. **Use a priority queue**: We process cells in order of increasing height because water will always try to escape through the lowest opening.
3. **Process inward from boundaries**: For each cell we process, we check its neighbors. If a neighbor is lower than the current cell's water level, it can trap water up to that level.
4. **Update water levels**: When we process a cell, we know the maximum water level that can be maintained at that position (it's the maximum of its own height and the minimum water level of its processed neighbors).

This approach is essentially a modified Dijkstra's algorithm where we're finding the "minimum maximum height" path to the boundary for each cell.

## Optimal Solution

The optimal solution uses a min-heap (priority queue) to always process the cell with the smallest height/water level first. This ensures that when we process a cell, we know the exact water level it can maintain.

<div class="code-group">

```python
# Time: O(m*n*log(m*n)) | Space: O(m*n)
def trapRainWater(heightMap):
    """
    Calculate the total volume of water that can be trapped in a 2D elevation map.

    Approach: Use a min-heap to process cells from the boundary inward.
    Always process the cell with the smallest height first to determine
    the maximum water level that can be maintained at each position.
    """
    if not heightMap or not heightMap[0]:
        return 0

    m, n = len(heightMap), len(heightMap[0])
    if m < 3 or n < 3:  # Need at least 3x3 to trap water in interior
        return 0

    # Min-heap to store (height, row, col)
    import heapq
    heap = []
    visited = [[False] * n for _ in range(m)]

    # Step 1: Add all boundary cells to the heap
    # Top and bottom rows
    for j in range(n):
        heapq.heappush(heap, (heightMap[0][j], 0, j))
        heapq.heappush(heap, (heightMap[m-1][j], m-1, j))
        visited[0][j] = True
        visited[m-1][j] = True

    # Left and right columns (skip corners already added)
    for i in range(1, m-1):
        heapq.heappush(heap, (heightMap[i][0], i, 0))
        heapq.heappush(heap, (heightMap[i][n-1], i, n-1))
        visited[i][0] = True
        visited[i][n-1] = True

    # Step 2: Process cells from the heap
    total_water = 0
    # Directions: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    # The heap always gives us the cell with the smallest current water level
    # This represents the "lowest wall" that water could potentially leak through
    while heap:
        current_height, i, j = heapq.heappop(heap)

        # Check all four neighbors
        for di, dj in directions:
            ni, nj = i + di, j + dj

            # Skip if out of bounds or already visited
            if ni < 0 or ni >= m or nj < 0 or nj >= n or visited[ni][nj]:
                continue

            # The neighbor's water level is at least current_height
            # (water can't be lower than the lowest boundary it's connected to)
            neighbor_height = heightMap[ni][nj]

            # If the neighbor is lower than current water level, it can trap water
            if neighbor_height < current_height:
                total_water += current_height - neighbor_height
                # The neighbor's effective height becomes current_height
                # (water fills it up to that level)
                heapq.heappush(heap, (current_height, ni, nj))
            else:
                # Neighbor is at or above current water level
                # No water trapped, but this becomes a new boundary
                heapq.heappush(heap, (neighbor_height, ni, nj))

            visited[ni][nj] = True

    return total_water
```

```javascript
// Time: O(m*n*log(m*n)) | Space: O(m*n)
function trapRainWater(heightMap) {
  /**
   * Calculate the total volume of water that can be trapped in a 2D elevation map.
   *
   * Approach: Use a min-heap to process cells from the boundary inward.
   * Always process the cell with the smallest height first to determine
   * the maximum water level that can be maintained at each position.
   */
  if (!heightMap || !heightMap.length || !heightMap[0].length) {
    return 0;
  }

  const m = heightMap.length;
  const n = heightMap[0].length;
  if (m < 3 || n < 3) {
    // Need at least 3x3 to trap water in interior
    return 0;
  }

  // Min-heap implementation for JavaScript
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    push(item) {
      this.heap.push(item);
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

    bubbleUp(index) {
      const item = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        if (item[0] >= parent[0]) break;
        this.heap[parentIndex] = item;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }

    sinkDown(index) {
      const length = this.heap.length;
      const item = this.heap[index];
      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let swapIndex = null;
        let leftChild, rightChild;

        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (leftChild[0] < item[0]) {
            swapIndex = leftChildIndex;
          }
        }

        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swapIndex === null && rightChild[0] < item[0]) ||
            (swapIndex !== null && rightChild[0] < leftChild[0])
          ) {
            swapIndex = rightChildIndex;
          }
        }

        if (swapIndex === null) break;
        this.heap[index] = this.heap[swapIndex];
        this.heap[swapIndex] = item;
        index = swapIndex;
      }
    }

    isEmpty() {
      return this.heap.length === 0;
    }
  }

  const heap = new MinHeap();
  const visited = Array(m)
    .fill()
    .map(() => Array(n).fill(false));

  // Step 1: Add all boundary cells to the heap
  // Top and bottom rows
  for (let j = 0; j < n; j++) {
    heap.push([heightMap[0][j], 0, j]);
    heap.push([heightMap[m - 1][j], m - 1, j]);
    visited[0][j] = true;
    visited[m - 1][j] = true;
  }

  // Left and right columns (skip corners already added)
  for (let i = 1; i < m - 1; i++) {
    heap.push([heightMap[i][0], i, 0]);
    heap.push([heightMap[i][n - 1], i, n - 1]);
    visited[i][0] = true;
    visited[i][n - 1] = true;
  }

  // Step 2: Process cells from the heap
  let totalWater = 0;
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (!heap.isEmpty()) {
    const [currentHeight, i, j] = heap.pop();

    // Check all four neighbors
    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;

      // Skip if out of bounds or already visited
      if (ni < 0 || ni >= m || nj < 0 || nj >= n || visited[ni][nj]) {
        continue;
      }

      const neighborHeight = heightMap[ni][nj];

      // If neighbor is lower than current water level, it can trap water
      if (neighborHeight < currentHeight) {
        totalWater += currentHeight - neighborHeight;
        // Neighbor's effective height becomes currentHeight
        heap.push([currentHeight, ni, nj]);
      } else {
        // Neighbor is at or above current water level
        heap.push([neighborHeight, ni, nj]);
      }

      visited[ni][nj] = true;
    }
  }

  return totalWater;
}
```

```java
// Time: O(m*n*log(m*n)) | Space: O(m*n)
class Solution {
    public int trapRainWater(int[][] heightMap) {
        /**
         * Calculate the total volume of water that can be trapped in a 2D elevation map.
         *
         * Approach: Use a min-heap to process cells from the boundary inward.
         * Always process the cell with the smallest height first to determine
         * the maximum water level that can be maintained at each position.
         */
        if (heightMap == null || heightMap.length == 0 || heightMap[0].length == 0) {
            return 0;
        }

        int m = heightMap.length;
        int n = heightMap[0].length;
        if (m < 3 || n < 3) {  // Need at least 3x3 to trap water in interior
            return 0;
        }

        // Min-heap to store cells as [height, row, col]
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        boolean[][] visited = new boolean[m][n];

        // Step 1: Add all boundary cells to the heap
        // Top and bottom rows
        for (int j = 0; j < n; j++) {
            heap.offer(new int[]{heightMap[0][j], 0, j});
            heap.offer(new int[]{heightMap[m-1][j], m-1, j});
            visited[0][j] = true;
            visited[m-1][j] = true;
        }

        // Left and right columns (skip corners already added)
        for (int i = 1; i < m-1; i++) {
            heap.offer(new int[]{heightMap[i][0], i, 0});
            heap.offer(new int[]{heightMap[i][n-1], i, n-1});
            visited[i][0] = true;
            visited[i][n-1] = true;
        }

        // Step 2: Process cells from the heap
        int totalWater = 0;
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!heap.isEmpty()) {
            int[] cell = heap.poll();
            int currentHeight = cell[0];
            int i = cell[1];
            int j = cell[2];

            // Check all four neighbors
            for (int[] dir : directions) {
                int ni = i + dir[0];
                int nj = j + dir[1];

                // Skip if out of bounds or already visited
                if (ni < 0 || ni >= m || nj < 0 || nj >= n || visited[ni][nj]) {
                    continue;
                }

                int neighborHeight = heightMap[ni][nj];

                // If neighbor is lower than current water level, it can trap water
                if (neighborHeight < currentHeight) {
                    totalWater += currentHeight - neighborHeight;
                    // Neighbor's effective height becomes currentHeight
                    heap.offer(new int[]{currentHeight, ni, nj});
                } else {
                    // Neighbor is at or above current water level
                    heap.offer(new int[]{neighborHeight, ni, nj});
                }

                visited[ni][nj] = true;
            }
        }

        return totalWater;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n × log(m × n))**

- We process each cell exactly once: O(m × n) cells
- Each heap operation (push/pop) takes O(log(size)) time
- In the worst case, the heap contains all cells, so each operation is O(log(m × n))
- Total: O(m × n × log(m × n))

**Space Complexity: O(m × n)**

- We maintain a visited matrix of size m × n
- The heap can contain up to O(m × n) cells in the worst case
- Total: O(m × n)

## Common Mistakes

1. **Forgetting to handle small matrices**: If m < 3 or n < 3, no water can be trapped in the interior. Always check for this edge case early.

2. **Incorrect heap ordering**: The heap must be a min-heap (smallest height first), not a max-heap. Processing the lowest cell first is crucial because it represents the potential leak point.

3. **Not marking cells as visited when adding to heap**: When we add a cell to the heap, we must immediately mark it as visited. Otherwise, we might process the same cell multiple times through different neighbors.

4. **Confusing cell height with water level**: When we push a neighbor into the heap, we push the maximum of its height and the current water level. This represents the effective height that water would rise to at that position.

## When You'll See This Pattern

This "boundary BFS with priority queue" pattern appears in several other problems:

1. **Trapping Rain Water (1D version)**: The 1D version uses two pointers instead of a heap, but the core idea of finding the minimum of maximum boundaries is similar.

2. **Swim in Rising Water (LeetCode 778)**: Also uses a min-heap to find the minimum time to reach the bottom-right corner as water rises.

3. **Path With Minimum Effort (LeetCode 1631)**: Uses Dijkstra's algorithm with a priority queue to find the path with minimum maximum height difference.

4. **Kth Smallest Element in a Sorted Matrix (LeetCode 378)**: Uses a min-heap to merge sorted rows/columns.

The pattern is: when you need to process elements in a specific order (usually smallest/largest first) and update neighbors based on the current element, a priority queue is often the right tool.

## Key Takeaways

1. **Think from boundaries inward**: For containment problems, it's often easier to start from what can't contain (boundaries) and work inward, rather than trying to calculate containment for each interior cell.

2. **Priority queues for ordered processing**: When you need to always process the "most constrained" or "limiting" element first, a min-heap or max-heap is usually the right data structure.

3. **Water finds its own level**: In these problems, water will always escape through the lowest available path. This is why we process cells in increasing height order - we're simulating how water would actually flow.

Related problems: [Trapping Rain Water](/problem/trapping-rain-water), [Maximum Number of Points From Grid Queries](/problem/maximum-number-of-points-from-grid-queries)
