---
title: "Medium Infosys Interview Questions: Strategy Guide"
description: "How to tackle 82 medium difficulty questions from Infosys — patterns, time targets, and practice tips."
date: "2032-03-12"
category: "tips"
tags: ["infosys", "medium", "interview prep"]
---

Infosys’s Medium-level interview questions represent a critical filter in their technical screening. While Easy problems typically test basic syntax, single-concept algorithms, or straightforward data structure usage, Medium problems at Infosys are designed to assess your ability to synthesize multiple concepts, handle moderate complexity, and write robust, production-like code. The 82 Medium questions in their catalog often involve combining a core data structure (like a hash map or queue) with a logical algorithm, requiring you to manage state, track multiple variables, and navigate edge cases that aren't immediately obvious. Success here signals you can move beyond textbook examples and tackle the kind of multi-step logic common in real development tasks.

## Common Patterns and Templates

Infosys Medium problems frequently revolve around **array/string manipulation with auxiliary data structures** and **graph traversal for matrix problems**. A very common template is the "modified BFS/DFS for grids," where you must traverse a 2D matrix, but the movement rules or state tracking go beyond a simple "find the path." Another prevalent pattern is **sliding window with condition tracking**, often used in string problems requiring substring analysis.

Here’s a template for the **modified BFS for a matrix with obstacles or state**, a pattern seen in problems like "Shortest Path in Binary Matrix" or "Rotting Oranges" analogs:

<div class="code-group">

```python
from collections import deque

def bfs_matrix_shortest_path(grid):
    """
    Template for BFS finding shortest path in a 2D grid.
    Grid values: 0 = traversable, 1 = obstacle.
    """
    if not grid or grid[0][0] == 1:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)] # 8-directional

    # Queue holds (row, col, distance)
    queue = deque([(0, 0, 1)])  # Start cell included in path length
    grid[0][0] = 1  # Mark as visited by setting to obstacle value

    while queue:
        r, c, dist = queue.popleft()

        # Check if we reached the bottom-right corner
        if r == rows - 1 and c == cols - 1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            # Check bounds, traversability, and unvisited status
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                queue.append((nr, nc, dist + 1))
                grid[nr][nc] = 1  # Mark visited

    return -1  # No path found

# Time: O(R * C) | Space: O(min(R, C)) in worst-case for queue, but O(R*C) if marking input.
```

```javascript
function bfsMatrixShortestPath(grid) {
  if (!grid || grid[0][0] === 1) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  // 8 directions: down, up, right, left, and 4 diagonals
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  // Queue stores [row, col, distance]
  const queue = [[0, 0, 1]];
  grid[0][0] = 1; // Mark visited

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift(); // For efficiency, use index pointer in real interview

    if (r === rows - 1 && c === cols - 1) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        queue.push([nr, nc, dist + 1]);
        grid[nr][nc] = 1; // Mark visited
      }
    }
  }
  return -1;
}
// Time: O(R * C) | Space: O(min(R, C)) for queue, but O(1) extra if modifying input.
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MatrixBFS {
    public int bfsMatrixShortestPath(int[][] grid) {
        if (grid == null || grid[0][0] == 1) return -1;

        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1}); // {row, col, distance}
        grid[0][0] = 1;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2];

            if (r == rows - 1 && c == cols - 1) {
                return dist;
            }

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
                    queue.offer(new int[]{nr, nc, dist + 1});
                    grid[nr][nc] = 1;
                }
            }
        }
        return -1;
    }
}
// Time: O(R * C) | Space: O(min(R, C)) for queue.
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Infosys, you should aim to reach a working, brute-force-optimized solution within **20-25 minutes**, leaving 5-10 minutes for discussion, edge cases, and potential optimization. The interviewer is evaluating several signals beyond correctness:

1.  **Systematic Problem Breakdown:** They want to see you analyze the problem, ask clarifying questions, and verbally outline your approach before coding. A silent coder is a red flag.
2.  **Code Quality and Readability:** Use meaningful variable names, consistent spacing, and helper functions if logic becomes nested. This demonstrates you write maintainable code.
3.  **Edge Case Proactivity:** Don't wait for the interviewer to ask. Explicitly state edge cases as you code: empty input, single element, large values, and invalid states. Handling them shows foresight.
4.  **Trade-off Justification:** Be prepared to explain _why_ you chose a certain data structure. "I used a HashMap for O(1) lookups, trading space for time" is a good insight.

## Key Differences from Easy Problems

The jump from Easy to Medium at Infosys isn't about learning entirely new algorithms; it's about **orchestration and condition management**. Easy problems are often "one-step": apply a sort, do a single pass, or use one data structure in a straightforward way.

Medium problems introduce:

- **Multiple Moving Parts:** You might need to maintain a hash map _and_ a running sum _and_ a pointer, all updated in a single pass.
- **State Tracking:** Problems require you to remember not just data, but a state (e.g., "have we seen a character before?", "is the stock bought or sold?"). This often leads to using tuples in a queue or a 2D DP array.
- **Non-Obvious Invariants:** The core logic might depend on an insight you must discover, like realizing a sliding window is valid if the count of the most frequent character plus `k` is >= window size.
- **Graphs as Implicit Matrices:** You must recognize that a 2D grid _is_ a graph, and apply BFS/DFS with modifications for the problem's rules.

The mindset shift is from "What tool solves this?" to "How do I combine tools and logic to model this problem?"

## Specific Patterns for Medium

1.  **Sliding Window with Frequency Map:** Common in string problems where you need the longest substring with at most K distinct characters or with all characters repeating at least N times. The trick is to shrink the window from the left when the condition is violated, updating the frequency map accordingly.

2.  **Topological Sort for Task Scheduling:** Infosys has several problems modeling task dependencies (course schedules, build order). The pattern involves building an adjacency list and in-degree array, then processing nodes with zero in-degree using a queue.

    ```python
    # Python snippet for Kahn's Algorithm
    from collections import deque, defaultdict
    def canFinish(numTasks, prerequisites):
        adj = defaultdict(list)
        indegree = [0] * numTasks
        for course, pre in prerequisites:
            adj[pre].append(course)
            indegree[course] += 1

        queue = deque([i for i in range(numTasks) if indegree[i] == 0])
        count = 0
        while queue:
            node = queue.popleft()
            count += 1
            for neighbor in adj[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        return count == numTasks
    # Time: O(V + E) | Space: O(V + E)
    ```

3.  **Modified Binary Search on Answer:** Instead of searching for a target in a sorted array, you use binary search to find a _minimum_ or _maximum_ valid answer (e.g., "Koko Eating Bananas", "Capacity To Ship Packages"). You write a helper function `isValid(mid)` and adjust `left`/`right` pointers based on its return.

## Practice Strategy

Don't just solve randomly. Target your practice:

1.  **Pattern-First Approach:** Group problems by the patterns above. Solve 3-5 Sliding Window problems in a row to internalize the template.
2.  **Daily Target:** Aim for 2-3 Medium problems per day with strict timing. Spend 25 minutes attempting a solution, then study the optimal approach if stuck.
3.  **Recommended Order:** Start with array/string manipulation and sliding window, then move to matrix BFS/DFS, followed by graph/topological sort, and finally binary search on answer. This order builds from familiar to more abstract.
4.  **Post-Solution Analysis:** After solving, write down the core insight in one sentence. This forces you to distill the pattern, making it easier to recognize later.

The goal is to build a mental library of templates you can adapt, not to memorize problems. Infosys Medium questions test your adaptability, not your memory.

[Practice Medium Infosys questions](/company/infosys/medium)
