---
title: "How to Solve Build a Matrix With Conditions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Build a Matrix With Conditions. Hard difficulty, 79.3% acceptance rate. Topics: Array, Graph Theory, Topological Sort, Matrix."
date: "2027-05-14"
category: "dsa-patterns"
tags: ["build-a-matrix-with-conditions", "array", "graph-theory", "topological-sort", "hard"]
---

# How to Solve "Build a Matrix With Conditions"

This problem asks you to construct a `k x k` matrix where each number from 1 to k appears exactly once in each row and column, while satisfying two sets of ordering constraints: `rowConditions` specifies which numbers must appear above others in the same column, and `colConditions` specifies which numbers must appear to the left of others in the same row. The challenge is that you need to satisfy both sets of constraints simultaneously, which requires careful ordering of numbers in both dimensions.

What makes this problem interesting is that it combines **two independent topological ordering problems** (one for rows, one for columns) with matrix construction. If either set of constraints has a cycle, the matrix cannot be built. This is essentially "Course Schedule II" applied twice, then combined.

## Visual Walkthrough

Let's walk through a concrete example:

- `k = 3`
- `rowConditions = [[1,2],[3,2]]` (1 must be above 2, 3 must be above 2)
- `colConditions = [[2,1]]` (2 must be left of 1)

**Step 1: Process row conditions**
We need to order numbers 1-3 so that in every column:

- 1 appears above 2
- 3 appears above 2

This gives us a partial order. One valid topological order is `[1, 3, 2]` (or `[3, 1, 2]`). Let's choose `[1, 3, 2]`.

**Step 2: Process column conditions**
We need to order numbers 1-3 so that in every row:

- 2 appears left of 1

One valid topological order is `[2, 3, 1]` (or `[3, 2, 1]`). Let's choose `[2, 3, 1]`.

**Step 3: Build the matrix**
We now have:

- Row order: `[1, 3, 2]` means row 0 contains 1, row 1 contains 3, row 2 contains 2
- Column order: `[2, 3, 1]` means column 0 contains 2, column 1 contains 3, column 2 contains 1

We need to place each number at the intersection of its row position and column position:

- Number 1: row position 0, column position 2 → `matrix[0][2] = 1`
- Number 2: row position 2, column position 0 → `matrix[2][0] = 2`
- Number 3: row position 1, column position 1 → `matrix[1][1] = 3`

Fill remaining cells with 0:

```
[0, 0, 1]
[0, 3, 0]
[2, 0, 0]
```

This satisfies all conditions:

- Column check: 1 is above 2, 3 is above 2 ✓
- Row check: 2 is left of 1 ✓

## Brute Force Approach

A naive approach would try all permutations of numbers 1-k for both rows and columns, then check if they satisfy all conditions. For each permutation pair, we'd need to:

1. Build the matrix
2. Verify all row conditions (check positions in each column)
3. Verify all column conditions (check positions in each row)

This would take O((k!)^2 \* (n + m)) time - completely infeasible even for k=10. The factorial growth makes this approach impossible.

Even a slightly better brute force might try to satisfy conditions incrementally, but without topological sorting, we'd get stuck in cycles or miss valid orderings.

## Optimized Approach

The key insight is that **row conditions only affect vertical placement** (which row each number goes in), and **column conditions only affect horizontal placement** (which column each number goes in). These are independent problems!

**Step-by-step reasoning:**

1. **Model as graph problems**: Each set of conditions defines a directed graph where nodes are numbers 1-k and edges represent "must be above/left of" relationships.
2. **Detect cycles**: If either graph has a cycle, we cannot satisfy the conditions (impossible ordering).
3. **Topological sort**: Find a valid ordering for rows and columns separately using Kahn's algorithm or DFS.
4. **Map positions**: Convert topological orders to position maps (number → row index, number → column index).
5. **Build matrix**: For each number, place it at `matrix[rowPos[number]][colPos[number]]`.

**Why topological sort works**: The conditions create partial orders. Topological sort finds a linear extension that respects all precedence constraints, exactly what we need for row/column ordering.

## Optimal Solution

We'll use Kahn's algorithm for topological sorting because it naturally detects cycles and gives us a clear order.

<div class="code-group">

```python
# Time: O(k + n + m) where n = len(rowConditions), m = len(colConditions)
# Space: O(k + n + m) for adjacency lists, indegree arrays, and result structures
class Solution:
    def buildMatrix(self, k: int, rowConditions: List[List[int]], colConditions: List[List[int]]) -> List[List[int]]:
        # Helper function to perform topological sort on given conditions
        def topological_sort(conditions):
            # Build adjacency list and indegree array
            adj = [[] for _ in range(k + 1)]  # 1-indexed for numbers 1..k
            indegree = [0] * (k + 1)

            # Process each condition [u, v] meaning u must come before v
            for u, v in conditions:
                adj[u].append(v)
                indegree[v] += 1

            # Kahn's algorithm: start with nodes having indegree 0
            queue = []
            for i in range(1, k + 1):
                if indegree[i] == 0:
                    queue.append(i)

            result = []
            while queue:
                node = queue.pop(0)
                result.append(node)

                # Reduce indegree of neighbors
                for neighbor in adj[node]:
                    indegree[neighbor] -= 1
                    if indegree[neighbor] == 0:
                        queue.append(neighbor)

            # If we didn't include all k nodes, there's a cycle
            return result if len(result) == k else []

        # Step 1: Get topological order for rows
        row_order = topological_sort(rowConditions)
        if not row_order:  # Cycle detected
            return []

        # Step 2: Get topological order for columns
        col_order = topological_sort(colConditions)
        if not col_order:  # Cycle detected
            return []

        # Step 3: Create position mappings for quick lookup
        row_pos = [0] * (k + 1)  # row_pos[num] = row index for num
        col_pos = [0] * (k + 1)  # col_pos[num] = col index for num

        for i, num in enumerate(row_order):
            row_pos[num] = i
        for i, num in enumerate(col_order):
            col_pos[num] = i

        # Step 4: Build the k x k matrix
        matrix = [[0] * k for _ in range(k)]
        for num in range(1, k + 1):
            matrix[row_pos[num]][col_pos[num]] = num

        return matrix
```

```javascript
// Time: O(k + n + m) where n = rowConditions.length, m = colConditions.length
// Space: O(k + n + m) for adjacency lists, indegree arrays, and result structures
/**
 * @param {number} k
 * @param {number[][]} rowConditions
 * @param {number[][]} colConditions
 * @return {number[][]}
 */
var buildMatrix = function (k, rowConditions, colConditions) {
  // Helper function to perform topological sort on given conditions
  const topologicalSort = (conditions) => {
    // Build adjacency list and indegree array
    const adj = Array.from({ length: k + 1 }, () => []); // 1-indexed
    const indegree = new Array(k + 1).fill(0);

    // Process each condition [u, v] meaning u must come before v
    for (const [u, v] of conditions) {
      adj[u].push(v);
      indegree[v]++;
    }

    // Kahn's algorithm: start with nodes having indegree 0
    const queue = [];
    for (let i = 1; i <= k; i++) {
      if (indegree[i] === 0) {
        queue.push(i);
      }
    }

    const result = [];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);

      // Reduce indegree of neighbors
      for (const neighbor of adj[node]) {
        indegree[neighbor]--;
        if (indegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    // If we didn't include all k nodes, there's a cycle
    return result.length === k ? result : [];
  };

  // Step 1: Get topological order for rows
  const rowOrder = topologicalSort(rowConditions);
  if (rowOrder.length === 0) {
    // Cycle detected
    return [];
  }

  // Step 2: Get topological order for columns
  const colOrder = topologicalSort(colConditions);
  if (colOrder.length === 0) {
    // Cycle detected
    return [];
  }

  // Step 3: Create position mappings for quick lookup
  const rowPos = new Array(k + 1).fill(0); // rowPos[num] = row index for num
  const colPos = new Array(k + 1).fill(0); // colPos[num] = col index for num

  rowOrder.forEach((num, i) => {
    rowPos[num] = i;
  });
  colOrder.forEach((num, i) => {
    colPos[num] = i;
  });

  // Step 4: Build the k x k matrix
  const matrix = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let num = 1; num <= k; num++) {
    matrix[rowPos[num]][colPos[num]] = num;
  }

  return matrix;
};
```

```java
// Time: O(k + n + m) where n = rowConditions.length, m = colConditions.length
// Space: O(k + n + m) for adjacency lists, indegree arrays, and result structures
class Solution {
    public int[][] buildMatrix(int k, int[][] rowConditions, int[][] colConditions) {
        // Step 1: Get topological order for rows
        List<Integer> rowOrder = topologicalSort(k, rowConditions);
        if (rowOrder.size() != k) { // Cycle detected
            return new int[0][0];
        }

        // Step 2: Get topological order for columns
        List<Integer> colOrder = topologicalSort(k, colConditions);
        if (colOrder.size() != k) { // Cycle detected
            return new int[0][0];
        }

        // Step 3: Create position mappings for quick lookup
        int[] rowPos = new int[k + 1]; // rowPos[num] = row index for num
        int[] colPos = new int[k + 1]; // colPos[num] = col index for num

        for (int i = 0; i < k; i++) {
            rowPos[rowOrder.get(i)] = i;
            colPos[colOrder.get(i)] = i;
        }

        // Step 4: Build the k x k matrix
        int[][] matrix = new int[k][k];
        for (int num = 1; num <= k; num++) {
            matrix[rowPos[num]][colPos[num]] = num;
        }

        return matrix;
    }

    private List<Integer> topologicalSort(int k, int[][] conditions) {
        // Build adjacency list
        List<Integer>[] adj = new ArrayList[k + 1];
        for (int i = 1; i <= k; i++) {
            adj[i] = new ArrayList<>();
        }

        int[] indegree = new int[k + 1];

        // Process each condition [u, v] meaning u must come before v
        for (int[] cond : conditions) {
            int u = cond[0], v = cond[1];
            adj[u].add(v);
            indegree[v]++;
        }

        // Kahn's algorithm: start with nodes having indegree 0
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 1; i <= k; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        List<Integer> result = new ArrayList<>();
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);

            // Reduce indegree of neighbors
            for (int neighbor : adj[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k + n + m)**

- Building adjacency lists: O(n + m) for processing all conditions
- Topological sort (Kahn's algorithm): O(k + n) for rows, O(k + m) for columns
- Building position maps: O(k)
- Constructing matrix: O(k)
- Total: O(k + n + m)

**Space Complexity: O(k + n + m)**

- Adjacency lists: O(k + n) for rows, O(k + m) for columns
- Indegree arrays: O(k) each
- Position maps: O(k)
- Result matrix: O(k²) for output (not counted in auxiliary space)
- Queue: O(k)

## Common Mistakes

1. **Not checking for cycles in both graphs**: Some candidates only check one set of conditions. If either has a cycle, the matrix is impossible to build. Always validate both topological sorts.

2. **Confusing row vs column positions**: Remember that row conditions determine which _row_ a number goes in (vertical position), while column conditions determine which _column_ it goes in (horizontal position). Mixing these up leads to incorrect placements.

3. **Forgetting 1-indexing**: Numbers range from 1 to k, but arrays are 0-indexed. Be careful when creating adjacency lists and position maps to allocate size k+1 and ignore index 0.

4. **Inefficient cycle detection**: Using DFS without proper cycle detection states can miss cycles or be inefficient. Kahn's algorithm naturally detects cycles when the result contains fewer than k elements.

## When You'll See This Pattern

This pattern of **topological sorting for constraint satisfaction** appears in many scheduling and ordering problems:

1. **Course Schedule / Course Schedule II**: Direct application of topological sort to find valid course orderings given prerequisites.

2. **Alien Dictionary**: Determine character order from word comparisons, which creates a directed graph of "comes before" relationships.

3. **Sequence Reconstruction**: Check if a sequence is the unique topological order of a graph.

4. **Parallel Courses**: Find minimum semesters to complete all courses given prerequisites.

The key signal is when you see **"must come before" constraints** or **partial ordering requirements**. If the problem mentions dependencies, prerequisites, or ordering constraints between items, think about modeling as a directed graph and using topological sort.

## Key Takeaways

1. **Separate independent constraints**: When constraints affect different dimensions independently, solve them separately and combine results. Here, row and column constraints don't interact until the final matrix construction.

2. **Topological sort for partial orders**: Any problem with "A must come before B" constraints is likely a topological sorting problem. Kahn's algorithm is often the cleanest implementation.

3. **Cycle detection is crucial**: Always check if a valid topological order exists (no cycles). In constraint satisfaction problems, cycles mean no solution exists.

Related problems: [Course Schedule](/problem/course-schedule), [Course Schedule II](/problem/course-schedule-ii), [Find Eventual Safe States](/problem/find-eventual-safe-states)
