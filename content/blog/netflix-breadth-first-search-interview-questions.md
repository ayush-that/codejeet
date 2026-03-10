---
title: "Breadth-First Search Questions at Netflix: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Netflix — patterns, difficulty breakdown, and study tips."
date: "2030-09-25"
category: "dsa-patterns"
tags: ["netflix", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Netflix: What to Expect

Netflix's coding interviews include approximately 4 Breadth-First Search (BFS) questions out of their 30 total coding problems in their question bank. That's about 13% of their technical questions, making BFS a significant but not dominant topic. In real interviews, you're likely to encounter at least one BFS problem if you're interviewing for a backend, infrastructure, or full-stack role, particularly for positions dealing with distributed systems, content delivery networks, or recommendation algorithms.

Why does BFS matter at Netflix specifically? The company's core business involves navigating complex relationships: user-to-content connections in recommendations, server-to-server hops in their CDN, and dependency graphs in their microservices architecture. BFS excels at finding shortest paths and exploring relationships layer by layer—exactly what you need when determining optimal content delivery routes or exploring social connections between viewers. While not as frequent as dynamic programming or system design questions at Netflix, BFS problems serve as excellent filters for candidates who can think about graphs, distances, and layered exploration.

## Specific Patterns Netflix Favors

Netflix's BFS questions tend to cluster around three specific patterns:

1. **Shortest Path in Unweighted Graphs** - This is their most common BFS pattern. Unlike companies that focus on weighted graphs (requiring Dijkstra's), Netflix prefers unweighted scenarios where each "hop" has equal cost. Think: minimum steps to reach a target, degrees of separation between users, or shortest path in a grid. LeetCode #127 (Word Ladder) is a classic example they've adapted.

2. **Level-Order Traversal with State Tracking** - Netflix often adds a twist: you need to track not just node visitation, but additional state. This might be carrying a remaining "budget" (like in LeetCode #1293 - Shortest Path in a Grid with Obstacles Elimination), tracking multiple simultaneous seekers, or managing visited states across different permission levels.

3. **Multi-Source BFS** - Instead of starting from a single point, you begin BFS from multiple starting points simultaneously. This pattern appears in problems about spreading influence, network broadcast times, or nearest distance to any of multiple targets. LeetCode #542 (01 Matrix) demonstrates this perfectly.

What's notably absent? Pure binary tree level-order traversal (LeetCode #102) rarely appears—Netflix assumes you know that. They jump straight to the applied graph versions.

<div class="code-group">

```python
# Multi-Source BFS Pattern - LeetCode #542 (01 Matrix)
# Time: O(m*n) | Space: O(m*n)
def updateMatrix(mat):
    """
    Returns distance of each cell to nearest 0.
    Multi-source BFS: start from all zeros simultaneously.
    """
    if not mat:
        return mat

    rows, cols = len(mat), len(mat[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque()
    visited = [[False] * cols for _ in range(rows)]

    # Initialize queue with all zeros (multi-source)
    for r in range(rows):
        for c in range(cols):
            if mat[r][c] == 0:
                queue.append((r, c, 0))  # (row, col, distance)
                visited[r][c] = True

    result = [[0] * cols for _ in range(rows)]

    while queue:
        r, c, dist = queue.popleft()
        result[r][c] = dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                visited[nr][nc] = True
                queue.append((nr, nc, dist + 1))

    return result
```

```javascript
// Multi-Source BFS Pattern - LeetCode #542 (01 Matrix)
// Time: O(m*n) | Space: O(m*n)
function updateMatrix(mat) {
  if (!mat.length || !mat[0].length) return mat;

  const rows = mat.length,
    cols = mat[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const result = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Initialize queue with all zeros
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        queue.push([r, c, 0]);
        visited[r][c] = true;
      }
    }
  }

  while (queue.length) {
    const [r, c, dist] = queue.shift();
    result[r][c] = dist;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return result;
}
```

```java
// Multi-Source BFS Pattern - LeetCode #542 (01 Matrix)
// Time: O(m*n) | Space: O(m*n)
public int[][] updateMatrix(int[][] mat) {
    if (mat == null || mat.length == 0) return mat;

    int rows = mat.length, cols = mat[0].length;
    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    Queue<int[]> queue = new LinkedList<>();
    boolean[][] visited = new boolean[rows][cols];
    int[][] result = new int[rows][cols];

    // Initialize queue with all zeros
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (mat[r][c] == 0) {
                queue.offer(new int[]{r, c, 0});
                visited[r][c] = true;
            }
        }
    }

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int r = current[0], c = current[1], dist = current[2];
        result[r][c] = dist;

        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                visited[nr][nc] = true;
                queue.offer(new int[]{nr, nc, dist + 1});
            }
        }
    }

    return result;
}
```

</div>

## How to Prepare

Master these three preparation techniques for Netflix's BFS questions:

**1. The Queue + Visited + Distance Triad**
Every Netflix BFS problem requires these three components. Practice writing this template without thinking:

- Queue (deque in Python, Array in JavaScript, LinkedList in Java)
- Visited set/matrix (often needs to track additional state)
- Distance tracking (either in queue elements or separate matrix)

**2. State Encoding for Visited Tracking**
When you need to track more than just node visitation, encode the state into your visited structure. For example, in grid problems with obstacle elimination, your visited state might be `visited[row][col][k]` where k is remaining eliminations.

**3. Early Return Optimization**
Netflix interviewers expect you to optimize. In shortest path problems, return immediately when reaching the target—don't complete the full BFS.

<div class="code-group">

```python
# BFS with State Tracking - LeetCode #1293 (Shortest Path with Obstacle Elimination)
# Time: O(m*n*k) | Space: O(m*n*k)
def shortestPath(grid, k):
    """
    Returns shortest path from (0,0) to (m-1,n-1) eliminating at most k obstacles.
    State: (row, col, remaining_eliminations)
    """
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])
    # If we can eliminate enough obstacles to take a direct path
    if k >= rows + cols - 2:
        return rows + cols - 2

    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque([(0, 0, k, 0)])  # (r, c, remaining_k, steps)
    visited = [[[False] * (k + 1) for _ in range(cols)] for _ in range(rows)]
    visited[0][0][k] = True

    while queue:
        r, c, remaining, steps = queue.popleft()

        # Early return when reaching target
        if r == rows - 1 and c == cols - 1:
            return steps

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_remaining = remaining - grid[nr][nc]
                if new_remaining >= 0 and not visited[nr][nc][new_remaining]:
                    visited[nr][nc][new_remaining] = True
                    queue.append((nr, nc, new_remaining, steps + 1))

    return -1
```

```javascript
// BFS with State Tracking - LeetCode #1293
// Time: O(m*n*k) | Space: O(m*n*k)
function shortestPath(grid, k) {
  if (!grid.length || !grid[0].length) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  // Optimization: if we can eliminate enough for direct path
  if (k >= rows + cols - 2) return rows + cols - 2;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[0, 0, k, 0]]; // [r, c, remaining, steps]
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(k + 1).fill(false))
  );
  visited[0][0][k] = true;

  while (queue.length) {
    const [r, c, remaining, steps] = queue.shift();

    // Early return optimization
    if (r === rows - 1 && c === cols - 1) {
      return steps;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const newRemaining = remaining - grid[nr][nc];
        if (newRemaining >= 0 && !visited[nr][nc][newRemaining]) {
          visited[nr][nc][newRemaining] = true;
          queue.push([nr, nc, newRemaining, steps + 1]);
        }
      }
    }
  }

  return -1;
}
```

```java
// BFS with State Tracking - LeetCode #1293
// Time: O(m*n*k) | Space: O(m*n*k)
public int shortestPath(int[][] grid, int k) {
    if (grid == null || grid.length == 0) return -1;

    int rows = grid.length, cols = grid[0].length;
    // Direct path optimization
    if (k >= rows + cols - 2) return rows + cols - 2;

    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0, 0, k, 0});  // r, c, remaining, steps
    boolean[][][] visited = new boolean[rows][cols][k + 1];
    visited[0][0][k] = true;

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int r = current[0], c = current[1], remaining = current[2], steps = current[3];

        // Early return
        if (r == rows - 1 && c == cols - 1) {
            return steps;
        }

        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                int newRemaining = remaining - grid[nr][nc];
                if (newRemaining >= 0 && !visited[nr][nc][newRemaining]) {
                    visited[nr][nc][newRemaining] = true;
                    queue.offer(new int[]{nr, nc, newRemaining, steps + 1});
                }
            }
        }
    }

    return -1;
}
```

</div>

## How Netflix Tests Breadth-First Search vs Other Companies

Netflix's BFS questions differ from other tech companies in several key ways:

**vs. Google**: Google often tests BFS on explicit graphs (adjacency lists) with cleaner problem statements. Netflix prefers implicit graphs (grids, word ladders) that require you to discover the graph structure first.

**vs. Facebook/Meta**: Facebook emphasizes social network BFS (friends of friends, degrees of separation). Netflix focuses on infrastructure BFS (server hops, content delivery paths).

**vs. Amazon**: Amazon's BFS questions frequently involve parsing or transformation (like LeetCode #752 - Open the Lock). Netflix's are more mathematical and optimization-focused.

**The Netflix Twist**: They often combine BFS with a secondary constraint—a limited resource (obstacle eliminations), multiple agents, or time-dependent costs. This tests whether you understand that BFS finds shortest path _in terms of number of edges_, not necessarily in terms of your custom cost function.

## Study Order

Follow this progression to build BFS mastery for Netflix:

1. **Basic BFS on Explicit Graphs** - Start with LeetCode #133 (Clone Graph) to understand adjacency list BFS. This establishes the fundamental queue+visited pattern.

2. **Grid BFS** - Move to LeetCode #200 (Number of Islands) to learn BFS on implicit grid graphs. Master the 4-direction movement pattern.

3. **Shortest Path in Unweighted Graphs** - Practice LeetCode #127 (Word Ladder), which is essentially Netflix's favorite pattern: finding minimum transformations between states.

4. **Multi-Source BFS** - Learn LeetCode #542 (01 Matrix). This pattern appears frequently in Netflix's infrastructure problems.

5. **BFS with State Tracking** - Tackle LeetCode #1293 (Shortest Path with Obstacles Elimination). This is where Netflix separates competent from exceptional candidates.

6. **Bidirectional BFS** - Study LeetCode #752 (Open the Lock) with bidirectional optimization. While less common at Netflix, it shows deep understanding.

Why this order? Each step builds on the previous. Grid BFS requires understanding basic BFS but adds coordinate handling. Multi-source BFS requires comfort with grid BFS. State tracking requires mastery of all previous concepts. Skipping steps leads to gaps that Netflix interviewers will exploit.

## Recommended Practice Order

Solve these problems in sequence:

1. LeetCode #133 (Clone Graph) - Basic adjacency list BFS
2. LeetCode #200 (Number of Islands) - Grid BFS foundation
3. LeetCode #127 (Word Ladder) - Shortest transformations (classic Netflix)
4. LeetCode #542 (01 Matrix) - Multi-source BFS
5. LeetCode #1293 (Shortest Path with Obstacles Elimination) - State tracking BFS
6. LeetCode #286 (Walls and Gates) - Multi-source BFS variation
7. LeetCode #773 (Sliding Puzzle) - BFS on state space (advanced)
8. LeetCode #864 (Shortest Path to Get All Keys) - BFS with complex state (Netflix hard level)

After completing these eight problems, you'll have covered every BFS pattern Netflix uses. Time yourself: you should be able to code the first five problems in under 25 minutes each, including testing edge cases.

Remember: Netflix doesn't just want you to solve BFS problems—they want you to recognize when BFS is the right tool (shortest path in unweighted graph, layer-by-layer exploration) and implement it flawlessly under time pressure. The difference between passing and excelling is often optimization: early returns, state encoding efficiency, and clean code organization.

[Practice Breadth-First Search at Netflix](/company/netflix/breadth-first-search)
