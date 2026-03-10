---
title: "Medium Yandex Interview Questions: Strategy Guide"
description: "How to tackle 72 medium difficulty questions from Yandex — patterns, time targets, and practice tips."
date: "2032-04-05"
category: "tips"
tags: ["yandex", "medium", "interview prep"]
---

Medium questions at Yandex are where the real interview begins. While Easy problems often test basic syntax and simple logic, Medium problems are designed to assess your problem-solving process, your ability to translate a real-world description into an efficient algorithm, and your coding fluency under pressure. Yandex's Medium tier (72 out of 134 total questions) is its core assessment layer. These problems typically involve a single, well-defined algorithmic concept—like binary search, DFS/BFS on a graph, or dynamic programming—but wrapped in a scenario that requires careful problem decomposition. The jump from Easy isn't just about bigger inputs; it's about managing state, recognizing non-obvious optimal substructure, and handling multiple moving parts without losing clarity.

## Common Patterns and Templates

Yandex's Medium problems heavily favor graph traversal (both DFS and BFS), binary search on answer, and array/string manipulation requiring two pointers or sliding windows. A particularly common pattern is **"Modified BFS for Shortest Path in an Unweighted Grid."** This appears in problems about moving through a maze, spreading something (like rot or information), or finding the minimum steps to a target with obstacles. The template below is a workhorse.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid, start, target_value):
    """
    Finds shortest path/turns in a 2D grid.
    grid: List[List[int]], 0 = blocked, 1 = open (or other encoding).
    start: (row, col) tuple.
    target_value: the value we are searching for.
    Returns: minimum steps or -1 if not found.
    """
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])
    # Directions: up, down, left, right
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    queue = deque()
    # Store (row, col, distance)
    queue.append((start[0], start[1], 0))
    visited = set()
    visited.add((start[0], start[1]))

    while queue:
        row, col, dist = queue.popleft()

        # Check if we found the target
        if grid[row][col] == target_value:
            return dist

        for dr, dc in directions:
            new_r, new_c = row + dr, col + dc
            # Check bounds, accessibility, and visited status
            if (0 <= new_r < rows and 0 <= new_c < cols and
                grid[new_r][new_c] != 0 and # or other blocking condition
                (new_r, new_c) not in visited):
                visited.add((new_r, new_c))
                queue.append((new_r, new_c, dist + 1))

    return -1  # Target not reachable

# Time: O(R * C) | Space: O(R * C) in worst-case for visited/queue.
```

```javascript
function bfsShortestPath(grid, start, targetValue) {
  if (!grid || grid.length === 0) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const queue = [];
  queue.push([start[0], start[1], 0]); // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    if (grid[row][col] === targetValue) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const newR = row + dr,
        newC = col + dc;
      const key = `${newR},${newC}`;
      if (
        newR >= 0 &&
        newR < rows &&
        newC >= 0 &&
        newC < cols &&
        grid[newR][newC] !== 0 && // blocking condition
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([newR, newC, dist + 1]);
      }
    }
  }
  return -1;
}
// Time: O(R * C) | Space: O(R * C)
```

```java
import java.util.*;

public class GridBFS {
    public int bfsShortestPath(int[][] grid, int[] start, int targetValue) {
        if (grid == null || grid.length == 0) return -1;

        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0}); // row, col, distance
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0], col = current[1], dist = current[2];

            if (grid[row][col] == targetValue) {
                return dist;
            }

            for (int[] dir : directions) {
                int newR = row + dir[0], newC = col + dir[1];
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols &&
                    grid[newR][newC] != 0 && !visited[newR][newC]) {
                    visited[newR][newC] = true;
                    queue.offer(new int[]{newR, newC, dist + 1});
                }
            }
        }
        return -1;
    }
}
// Time: O(R * C) | Space: O(R * C)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Yandex Medium problem, you should aim to have a working, optimal solution coded and tested within 25-30 minutes. This includes 5-10 minutes for clarifying questions and verbalizing your approach, 15 minutes for coding, and 5 minutes for dry-run testing and discussing edge cases.

Beyond correctness, interviewers are evaluating:

1.  **Problem Decomposition:** Can you break the problem into smaller, manageable parts? Do you identify the core algorithmic challenge (e.g., "this is essentially finding connected components") before jumping to code?
2.  **Code Quality Under Pressure:** Variable names should be meaningful (`queue` not `q`, `visited` not `v`). Your functions should be concise and do one thing. Avoid deep nesting.
3.  **Proactive Edge Case Handling:** Mention and handle cases like empty input, single element, large values, and cycles (in graphs) _before_ the interviewer asks. This shows production-level thinking.
4.  **Communication of Trade-offs:** Be prepared to explain _why_ you chose BFS over DFS (shortest path guarantee), or why your solution is O(n log n) and if an O(n) might exist.

## Key Differences from Easy Problems

The leap from Easy to Medium at Yandex is defined by three specific skill upgrades:

1.  **State Management:** Easy problems often have a single loop or a simple condition. Medium problems require you to track multiple pieces of state simultaneously. For example, in a sliding window problem, you're not just moving two pointers; you're also maintaining a hash map of character counts and a counter of unique characters that meet a condition.
2.  **Recognizing Hidden Structures:** An Easy problem might ask you to reverse a linked list. A Medium problem might present a scenario about organizing tasks, which you must first recognize as a topological sort on a directed graph.
3.  **Optimization Mindset:** Easy solutions are often brute force. Medium requires you to ask, "Is there a pattern or data structure that lets me avoid re-computation?" This is the gateway to techniques like memoization, using a heap for the k-th smallest/largest, or binary search to turn an O(n²) check into O(n log n).

## Specific Patterns for Medium

**1. Binary Search on Answer (a.k.a. "Binary Search for the Result")**
This is for problems where you're asked to find a _minimum_ or _maximum_ of something (like capacity, time, or length) that satisfies a condition. The key insight is that if a value `X` works, then any value greater than `X` might also work (for minimization problems). You binary search over the range of possible answers, using a helper function to check feasibility.

_Example Problem:_ "Find the minimum capacity of a ship to transport all packages within D days" (LeetCode #1011). You binary search between `max(weights)` and `sum(weights)`. The helper function simulates loading the ship day-by-day.

**2. DFS with Backtracking and Pruning**
Used for generation problems (permutations, subsets) or exploration with constraints (like placing queens). The template involves a recursive function that builds a candidate solution, checks constraints, and backtracks.

```python
def backtrack(path, choices):
    if is_solution(path):
        output.append(path[:]) # take a copy
        return
    for choice in choices:
        if is_valid(choice, path):
            path.append(choice)
            backtrack(path, new_choices) # new_choices often excludes 'choice'
            path.pop() # backtrack
```

_Example:_ "Generate all valid combinations of n parentheses" (LeetCode #22). Choices are '(' or ')', validity is based on counts.

## Practice Strategy

Don't just solve randomly. Systematize your practice:

1.  **Pattern-First Approach:** Spend your first week focusing on one pattern per day (e.g., Monday: BFS/Graph, Tuesday: Binary Search, Wednesday: DFS/Backtracking). Solve 3-4 Yandex Medium problems for that pattern.
2.  **Timed Sessions:** Always use a 30-minute timer. Spend the first 5 minutes _only_ on understanding and planning. If you're stuck at 20 minutes with no code, look at the solution, understand it, then close it and re-implement.
3.  **Recommended Order:** Start with high-frequency patterns. Practice in this sequence:
    - Graph Traversal (BFS/DFS)
    - Binary Search (both standard and on answer)
    - Two Pointers / Sliding Window
    - Dynamic Programming (1D and 2D)
    - Trees and Recursion
4.  **Daily Target:** 2-3 _new_ Medium problems with full analysis, plus 1-2 _revisions_ of problems you solved 2-3 days prior. Spaced repetition is crucial for moving patterns from short-term to long-term memory.

The goal is to reach a point where reading a problem description triggers a pattern match, letting you focus your mental energy on the unique twist Yandex has added, rather than starting from scratch.

[Practice Medium Yandex questions](/company/yandex/medium)
