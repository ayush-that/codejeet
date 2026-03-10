---
title: "How to Solve Maximum Number of Points From Grid Queries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Points From Grid Queries. Hard difficulty, 59.3% acceptance rate. Topics: Array, Two Pointers, Breadth-First Search, Union-Find, Sorting."
date: "2027-07-10"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-points-from-grid-queries",
    "array",
    "two-pointers",
    "breadth-first-search",
    "hard",
  ]
---

# How to Solve Maximum Number of Points From Grid Queries

This problem asks us to process multiple queries on a grid, where each query value determines which cells we can visit starting from the top-left corner. For each query, we can only move to adjacent cells (up, down, left, right) if the query value is strictly greater than the cell's value. The challenge is that we need to answer **k** queries efficiently, where k can be up to 10⁵, and the grid can be 1000×1000 cells. The brute force approach of running BFS/DFS for each query would be far too slow, requiring us to find a smarter way to process all queries together.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Grid:**

```
[1, 2, 3]
[4, 5, 6]
[7, 8, 9]
```

**Queries:** `[3, 5, 8]`

For query = 3:

- Start at (0,0) with value 1. Since 3 > 1, we can visit this cell.
- From (0,0), we check neighbors: (0,1) has value 2 (3 > 2, can visit), (1,0) has value 4 (3 < 4, cannot visit).
- From (0,1), check neighbor (0,2) with value 3 (3 = 3, not strictly greater, cannot visit).
- Total reachable cells: (0,0) and (0,1) → **2 points**.

For query = 5:

- Can visit cells with values < 5: (0,0), (0,1), (0,2), (1,0), (1,1)
- Total: **5 points**.

For query = 8:

- Can visit all cells except (2,2) with value 9
- Total: **8 points**.

The key insight: as query values increase, we can visit more cells. Instead of processing each query independently, we can sort the queries and process cells in increasing order of their values.

## Brute Force Approach

The most straightforward approach is to run BFS/DFS for each query:

1. For each query value `q` in `queries`:
2. Perform BFS starting from (0,0)
3. Only traverse to neighboring cells if `q > grid[row][col]`
4. Count how many cells were visited

**Why this fails:**

- Time complexity: O(k × m × n) where k = number of queries
- With k up to 10⁵ and grid up to 1000×1000, this could be O(10¹¹) operations
- Even with optimizations like memoization, we'd still need to process each query separately

The brute force code would look like this:

<div class="code-group">

```python
# Time: O(k * m * n) | Space: O(m * n)
def maxPointsBruteForce(grid, queries):
    m, n = len(grid), len(grid[0])
    answer = []

    for q in queries:
        visited = [[False] * n for _ in range(m)]
        queue = deque()

        # Start from top-left if query > grid[0][0]
        if q > grid[0][0]:
            queue.append((0, 0))
            visited[0][0] = True

        count = 0
        while queue:
            r, c = queue.popleft()
            count += 1

            # Check all 4 directions
            for dr, dc in [(0,1), (1,0), (0,-1), (-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc]:
                    if q > grid[nr][nc]:
                        visited[nr][nc] = True
                        queue.append((nr, nc))

        answer.append(count)

    return answer
```

```javascript
// Time: O(k * m * n) | Space: O(m * n)
function maxPointsBruteForce(grid, queries) {
  const m = grid.length,
    n = grid[0].length;
  const answer = [];

  for (const q of queries) {
    const visited = Array(m)
      .fill()
      .map(() => Array(n).fill(false));
    const queue = [];

    if (q > grid[0][0]) {
      queue.push([0, 0]);
      visited[0][0] = true;
    }

    let count = 0;
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      count++;

      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
          if (q > grid[nr][nc]) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
    }

    answer.push(count);
  }

  return answer;
}
```

```java
// Time: O(k * m * n) | Space: O(m * n)
public int[] maxPointsBruteForce(int[][] grid, int[] queries) {
    int m = grid.length, n = grid[0].length;
    int[] answer = new int[queries.length];

    for (int i = 0; i < queries.length; i++) {
        int q = queries[i];
        boolean[][] visited = new boolean[m][n];
        Queue<int[]> queue = new LinkedList<>();

        if (q > grid[0][0]) {
            queue.offer(new int[]{0, 0});
            visited[0][0] = true;
        }

        int count = 0;
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1];
            count++;

            int[][] directions = {{0,1}, {1,0}, {0,-1}, {-1,0}};
            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
                    if (q > grid[nr][nc]) {
                        visited[nr][nc] = true;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
        }

        answer[i] = count;
    }

    return answer;
}
```

</div>

## Optimized Approach

The key insight is that we can process all queries together by:

1. **Sorting the queries** while keeping track of their original indices
2. **Processing cells in increasing order** of their values using a min-heap
3. Using **Union-Find (Disjoint Set Union)** or **BFS with a heap** to gradually expand the reachable area as we process queries with increasing values

**Step-by-step reasoning:**

1. Sort queries with their original indices so we can reconstruct the answer in the correct order
2. Sort all cells by their values
3. Use a min-heap to perform a "multi-source BFS" starting from (0,0)
4. For each query in sorted order:
   - Add all cells with values less than the query to the reachable area
   - Use BFS/DFS to explore from newly added cells
   - Count how many cells are reachable
5. Store the count for each query in its original position

**Why this works:**

- We process cells in order of increasing value, so we only add each cell once
- For query `q`, all cells with value < `q` that are connected to (0,0) are reachable
- By processing queries in sorted order, we can incrementally build the reachable area

## Optimal Solution

Here's the complete solution using a min-heap approach:

<div class="code-group">

```python
# Time: O(m*n*log(m*n) + k*log(k)) | Space: O(m*n + k)
def maxPoints(grid, queries):
    m, n = len(grid), len(grid[0])
    k = len(queries)

    # Step 1: Sort queries with their original indices
    sorted_queries = sorted([(val, idx) for idx, val in enumerate(queries)])

    # Step 2: Min-heap for BFS, starting from top-left
    import heapq
    heap = [(grid[0][0], 0, 0)]  # (value, row, col)
    visited = [[False] * n for _ in range(m)]
    visited[0][0] = True

    # Step 3: Directions for 4-way movement
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    # Step 4: Process queries in sorted order
    answer = [0] * k
    count = 0  # Number of reachable cells so far

    for query_val, query_idx in sorted_queries:
        # Expand reachable area by processing cells with value < query_val
        while heap and heap[0][0] < query_val:
            val, r, c = heapq.heappop(heap)
            count += 1

            # Explore neighbors
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc]:
                    visited[nr][nc] = True
                    heapq.heappush(heap, (grid[nr][nc], nr, nc))

        # Store result for this query
        answer[query_idx] = count

    return answer
```

```javascript
// Time: O(m*n*log(m*n) + k*log(k)) | Space: O(m*n + k)
function maxPoints(grid, queries) {
  const m = grid.length,
    n = grid[0].length;
  const k = queries.length;

  // Step 1: Sort queries with their original indices
  const sortedQueries = queries.map((val, idx) => [val, idx]);
  sortedQueries.sort((a, b) => a[0] - b[0]);

  // Step 2: Min-heap for BFS, starting from top-left
  const heap = new MinHeap();
  heap.push([grid[0][0], 0, 0]);
  const visited = Array(m)
    .fill()
    .map(() => Array(n).fill(false));
  visited[0][0] = true;

  // Step 3: Directions for 4-way movement
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // Step 4: Process queries in sorted order
  const answer = new Array(k).fill(0);
  let count = 0; // Number of reachable cells so far

  for (const [queryVal, queryIdx] of sortedQueries) {
    // Expand reachable area by processing cells with value < queryVal
    while (heap.size() > 0 && heap.peek()[0] < queryVal) {
      const [val, r, c] = heap.pop();
      count++;

      // Explore neighbors
      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
          visited[nr][nc] = true;
          heap.push([grid[nr][nc], nr, nc]);
        }
      }
    }

    // Store result for this query
    answer[queryIdx] = count;
  }

  return answer;
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

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(idx) {
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (element[0] >= parent[0]) break;
      this.heap[idx] = parent;
      this.heap[parentIdx] = element;
      idx = parentIdx;
    }
  }

  sinkDown(idx) {
    const length = this.heap.length;
    const element = this.heap[idx];

    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild[0] < element[0]) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && rightChild[0] < leftChild[0])
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }
}
```

```java
// Time: O(m*n*log(m*n) + k*log(k)) | Space: O(m*n + k)
public int[] maxPoints(int[][] grid, int[] queries) {
    int m = grid.length, n = grid[0].length;
    int k = queries.length;

    // Step 1: Sort queries with their original indices
    int[][] sortedQueries = new int[k][2];
    for (int i = 0; i < k; i++) {
        sortedQueries[i][0] = queries[i];
        sortedQueries[i][1] = i;
    }
    Arrays.sort(sortedQueries, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 2: Min-heap for BFS, starting from top-left
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
    heap.offer(new int[]{grid[0][0], 0, 0});
    boolean[][] visited = new boolean[m][n];
    visited[0][0] = true;

    // Step 3: Directions for 4-way movement
    int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    // Step 4: Process queries in sorted order
    int[] answer = new int[k];
    int count = 0;  // Number of reachable cells so far

    for (int[] query : sortedQueries) {
        int queryVal = query[0];
        int queryIdx = query[1];

        // Expand reachable area by processing cells with value < queryVal
        while (!heap.isEmpty() && heap.peek()[0] < queryVal) {
            int[] cell = heap.poll();
            int r = cell[1], c = cell[2];
            count++;

            // Explore neighbors
            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    heap.offer(new int[]{grid[nr][nc], nr, nc});
                }
            }
        }

        // Store result for this query
        answer[queryIdx] = count;
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting queries: O(k log k) where k is the number of queries
- Processing cells with min-heap: Each cell is pushed and popped once from the heap → O(m × n × log(m × n))
- Total: O(m × n × log(m × n) + k log k)

**Space Complexity:**

- Visited matrix: O(m × n)
- Min-heap: O(m × n) in worst case
- Sorted queries: O(k)
- Total: O(m × n + k)

## Common Mistakes

1. **Forgetting to track original query indices**: If you sort queries without keeping track of original positions, you won't be able to return answers in the correct order. Always store `(value, original_index)` pairs.

2. **Using strict inequality incorrectly**: The problem says "strictly greater than", so the condition is `query > grid[row][col]`, not `query >= grid[row][col]`. This is easy to miss.

3. **Not handling the starting cell properly**: The top-left cell (0,0) must be checked against the query value. If `query <= grid[0][0]`, the answer should be 0, not 1.

4. **Inefficient neighbor checking**: When exploring neighbors, remember to check bounds (0 ≤ row < m, 0 ≤ col < n) and visited status before adding to the heap.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Offline query processing**: When you have multiple queries, sometimes it's more efficient to sort them and process in a specific order rather than answering each independently. Similar to range sum queries where you sort queries by endpoint.

2. **Multi-source BFS with priority queue**: Using a min-heap to explore cells in increasing order of some property (like value). This appears in:
   - **Trapping Rain Water II (Hard)**: Process cells from boundaries inward using a min-heap
   - **Path With Minimum Effort (Medium)**: Find path with minimum maximum difference using Dijkstra's with min-heap
   - **Swim in Rising Water (Hard)**: Similar concept of reaching destination as water level rises

3. **Incremental connectivity**: As we process queries with increasing values, we're essentially building connectivity incrementally. Union-Find could also solve this, though the heap approach is more straightforward here.

## Key Takeaways

1. **Think about processing order**: When faced with multiple queries, consider whether sorting them (offline processing) could lead to a more efficient solution than handling each independently.

2. **Use the right data structure for incremental exploration**: A min-heap (priority queue) is perfect when you need to process elements in increasing order while dynamically adding new elements.

3. **Look for monotonic relationships**: In this problem, as query values increase, the reachable area monotonically increases. This monotonicity is what enables the efficient incremental approach.

Related problems: [Trapping Rain Water II](/problem/trapping-rain-water-ii), [Escape the Spreading Fire](/problem/escape-the-spreading-fire)
