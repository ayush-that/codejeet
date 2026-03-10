---
title: "Medium Snapchat Interview Questions: Strategy Guide"
description: "How to tackle 62 medium difficulty questions from Snapchat — patterns, time targets, and practice tips."
date: "2032-05-17"
category: "tips"
tags: ["snapchat", "medium", "interview prep"]
---

## Medium Snapchat Interview Questions: Strategy Guide

Snapchat’s interview coding questions are known for being practical and product‑adjacent. Of their 99 total problems, 62 are tagged Medium—that’s nearly two‑thirds. This tells you something important: Snapchat uses Medium problems as the primary filter for assessing engineering candidates. While Easy questions check basic syntax and problem‑solving, and Hard questions might be reserved for specialized roles, Medium is where they evaluate whether you can design clean, efficient solutions to realistic problems.

What separates a Snapchat Medium problem from a generic LeetCode Medium? Snapchat’s Mediums often involve:

- **Data transformation** that mirrors real‑world data‑pipeline tasks (e.g., parsing logs, aggregating metrics).
- **Simulation** of user‑facing features (e.g., story expiration, friend suggestion logic).
- **Graph and tree problems** that are just one conceptual step above the basics—think BFS/DFS with a twist, not advanced dynamic programming.

In short, they test whether you can take a known algorithm and adapt it to a slightly novel, product‑inspired scenario.

## Common Patterns and Templates

Snapchat’s Medium problems heavily favor **breadth‑first search (BFS) on implicit graphs**, **hash map aggregation**, and **array/two‑pointer manipulation**. The single most common pattern I’ve seen—and one you should have ready to go—is **BFS for shortest‑path or level‑order processing in a grid or implicit state space**. This appears in problems like “Shortest Path in Binary Matrix” (LeetCode #1091) and “Snakes and Ladders” (LeetCode #909). Below is a reusable BFS template that works for grid‑based shortest‑path problems. Notice how it cleanly separates neighbor generation, visitation checking, and early termination.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid):
    """
    Template for BFS shortest path in a grid.
    Assumes grid is a 2D list, 0 = passable, 1 = blocked.
    Returns shortest path length from (0,0) to (n-1, m-1) or -1.
    """
    if not grid or grid[0][0] == 1:
        return -1

    n, m = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1),
                  (1,1), (1,-1), (-1,1), (-1,-1)]  # 8‑dir for some problems

    queue = deque([(0, 0, 1)])  # (row, col, distance)
    visited = [[False] * m for _ in range(n)]
    visited[0][0] = True

    while queue:
        r, c, dist = queue.popleft()

        # Early exit if we reach the target
        if r == n - 1 and c == m - 1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and not visited[nr][nc] and grid[nr][nc] == 0:
                visited[nr][nc] = True
                queue.append((nr, nc, dist + 1))

    return -1

# Time: O(N * M) | Space: O(N * M) for visited matrix
```

```javascript
function bfsShortestPath(grid) {
  if (!grid || grid[0][0] === 1) return -1;

  const n = grid.length,
    m = grid[0].length;
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

  const queue = [[0, 0, 1]]; // [row, col, distance]
  const visited = Array.from({ length: n }, () => Array(m).fill(false));
  visited[0][0] = true;

  while (queue.length) {
    const [r, c, dist] = queue.shift();

    if (r === n - 1 && c === m - 1) return dist;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < m && !visited[nr][nc] && grid[nr][nc] === 0) {
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return -1;
}

// Time: O(N * M) | Space: O(N * M)
```

```java
import java.util.*;

public class BFSShortestPath {
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid[0][0] == 1) return -1;

        int n = grid.length, m = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1},
                              {1,1}, {1,-1}, {-1,1}, {-1,-1}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1}); // row, col, distance
        boolean[][] visited = new boolean[n][m];
        visited[0][0] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2];

            if (r == n - 1 && c == m - 1) return dist;

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < m &&
                    !visited[nr][nc] && grid[nr][nc] == 0) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }

        return -1;
    }
}

// Time: O(N * M) | Space: O(N * M)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Snapchat Medium problem, you’re expected to:

- **Understand the problem** within 2–3 minutes.
- **Design an approach** and communicate it within 5–7 minutes.
- **Write clean, compilable code** in 10–12 minutes.
- **Test with edge cases** and discuss optimizations in the remaining time.

That’s roughly 25 minutes total per problem. But beyond speed, interviewers watch for:

- **Code quality:** Variable names that reveal intent, helper functions for repeated logic, consistent formatting.
- **Edge‑case handling:** Empty inputs, single‑element arrays, negative values, integer overflow (rare in Python/JS, but mention it in Java).
- **Communication:** Explain your thought process before coding. If you hit a snag, talk through alternatives rather than staying silent.

The strongest signal you can send is **adapting a known pattern to the problem’s unique constraints**. For example, if the problem involves a grid with obstacles, mention how BFS guarantees the shortest path because all edges have equal weight.

## Key Differences from Easy Problems

Easy problems at Snapchat often test a single concept: a linear scan, a basic hash map, or a straightforward recursion. Medium problems require you to **combine concepts** and **manage more state**. For instance:

- **Easy:** “Find if a number exists in an array” (hash set).
- **Medium:** “Find all pairs of users who have mutual friends within two degrees” (BFS on an adjacency list, plus counting).

The mindset shift is from “What’s the obvious operation?” to “What’s the minimal data structure that supports all required operations efficiently?” You’ll need to consider trade‑offs between time and space, and often implement a solution that runs in O(n log n) or O(n) time with O(n) extra space.

## Specific Patterns for Medium

1. **Hash Map with Prefix Sum** – Used in problems like “Subarray Sum Equals K” (LeetCode #560). The trick is to store cumulative sums and check for `current_sum - target` in the map.

2. **Modified BFS/DFS for State Search** – As shown in the template above, but often the “state” is more than just coordinates. For example, in “Open the Lock” (LeetCode #752), each state is a 4‑digit string, and neighbors are generated by rotating each wheel.

3. **Monotonic Stack for Next Greater Element** – Snapchat has problems involving finding the next larger element in a sequence (e.g., “Daily Temperatures”, LeetCode #739). The stack maintains indices of elements for which we haven’t found a larger element yet.

Here’s a quick example of the monotonic stack pattern:

```python
def dailyTemperatures(temperatures):
    n = len(temperatures)
    answer = [0] * n
    stack = []  # stores indices

    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            answer[prev_idx] = i - prev_idx
        stack.append(i)

    return answer
# Time: O(n) | Space: O(n)
```

## Practice Strategy

Don’t just solve all 62 Medium problems in order. Instead:

1. **Start with the patterns above.** Do 2–3 problems for each pattern (BFS, hash map + prefix sum, monotonic stack) from Snapchat’s tagged list.
2. **Mix in graph and tree problems.** Aim for 1–2 per day, focusing on adjacency‑list representations and recursive DFS.
3. **Time yourself.** Use a 25‑minute timer per problem. If you can’t finish, analyze where you got stuck—was it the algorithm design, the implementation details, or edge cases?
4. **Review and refactor.** After solving, look at the top voted solutions. Did they use a more elegant data structure? Could you simplify your code?

A good daily target is **2 Medium problems with in‑depth review**. Quality over quantity. Over three weeks, you’ll cover the majority of Snapchat’s Medium portfolio and build the muscle memory to adapt patterns quickly.

[Practice Medium Snapchat questions](/company/snapchat/medium)
