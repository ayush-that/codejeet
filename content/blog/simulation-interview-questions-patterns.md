---
title: "Simulation Interview Questions: Patterns and Strategies"
description: "Master Simulation problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-01-09"
category: "dsa-patterns"
tags: ["simulation", "dsa", "interview prep"]
---

Simulation questions test your ability to translate a real-world process or set of rules directly into code. They don't rely on advanced data structures or clever algorithms; instead, they assess your fundamental coding skill, attention to detail, and capacity to handle complex, step-by-step logic under constraints. In interviews, they are a direct measure of how well you can execute.

## Common Patterns

While each simulation problem is unique, most follow a few core patterns for managing state and process flow.

### 1. Grid/Board Traversal with Rules

This pattern involves moving an agent (like a robot or game piece) across a 2D grid according to specific rules, often tracking visited states or counting steps.

<div class="code-group">

```python
def robot_sim(instructions, obstacles):
    # Directions: N, E, S, W
    dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    x = y = di = 0
    obstacles_set = set(map(tuple, obstacles))

    for i in instructions:
        if i == 'R':
            di = (di + 1) % 4
        elif i == 'L':
            di = (di - 1) % 4
        else:  # Move forward
            for _ in range(i):
                nx, ny = x + dirs[di][0], y + dirs[di][1]
                if (nx, ny) in obstacles_set:
                    break
                x, y = nx, ny
    return x*x + y*y
```

```javascript
function robotSim(instructions, obstacles) {
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let x = 0,
    y = 0,
    di = 0;
  const obstacleSet = new Set(obstacles.map((o) => `${o[0]},${o[1]}`));

  for (let cmd of instructions) {
    if (cmd === "R") di = (di + 1) % 4;
    else if (cmd === "L") di = (di + 3) % 4;
    else {
      for (let step = 0; step < cmd; step++) {
        let nx = x + dirs[di][0];
        let ny = y + dirs[di][1];
        if (obstacleSet.has(`${nx},${ny}`)) break;
        x = nx;
        y = ny;
      }
    }
  }
  return x * x + y * y;
}
```

```java
public int robotSim(int[] instructions, int[][] obstacles) {
    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    int x = 0, y = 0, di = 0;
    Set<String> obstacleSet = new HashSet<>();
    for (int[] o : obstacles) obstacleSet.add(o[0] + "," + o[1]);

    for (int cmd : instructions) {
        if (cmd == -2) di = (di + 3) % 4; // Left
        else if (cmd == -1) di = (di + 1) % 4; // Right
        else {
            for (int step = 0; step < cmd; step++) {
                int nx = x + dirs[di][0];
                int ny = y + dirs[di][1];
                if (obstacleSet.contains(nx + "," + ny)) break;
                x = nx;
                y = ny;
            }
        }
    }
    return x*x + y*y;
}
```

</div>

### 2. State Machine Simulation

Here, you model a system with a finite number of states (like a game board, traffic light, or parser). The core is a loop that updates all entities based on the current state and a set of transition rules.

### 3. Queue-Based Step Processing

Many simulations, especially those involving time or rounds, use a queue to process events in order. This is common in problems like task scheduling or spreading processes.

<div class="code-group">

```python
def time_to_infect(grid):
    rows, cols = len(grid), len(grid[0])
    from collections import deque
    q = deque()
    time = 0
    healthy = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                q.append((r, c, 0))
            elif grid[r][c] == 0:
                healthy += 1
    if healthy == 0:
        return 0

    dirs = [(1,0),(-1,0),(0,1),(0,-1)]
    while q:
        r, c, t = q.popleft()
        time = t
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                grid[nr][nc] = 1
                healthy -= 1
                q.append((nr, nc, t + 1))

    return time if healthy == 0 else -1
```

```javascript
function timeToInfect(grid) {
  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  let time = 0,
    healthy = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) queue.push([r, c, 0]);
      else if (grid[r][c] === 0) healthy++;
    }
  }
  if (healthy === 0) return 0;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length) {
    const [r, c, t] = queue.shift();
    time = t;
    for (let [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        grid[nr][nc] = 1;
        healthy--;
        queue.push([nr, nc, t + 1]);
      }
    }
  }
  return healthy === 0 ? time : -1;
}
```

```java
public int timeToInfect(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int time = 0, healthy = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) queue.offer(new int[]{r, c, 0});
            else if (grid[r][c] == 0) healthy++;
        }
    }
    if (healthy == 0) return 0;

    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        int r = curr[0], c = curr[1], t = curr[2];
        time = t;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
                grid[nr][nc] = 1;
                healthy--;
                queue.offer(new int[]{nr, nc, t + 1});
            }
        }
    }
    return healthy == 0 ? time : -1;
}
```

</div>

## Difficulty Breakdown

Our dataset of 166 questions breaks down as: **Easy: 70 (42%)**, **Medium: 83 (50%)**, and **Hard: 13 (8%)**. This split is telling.

The high percentage of Easy and Medium problems indicates that simulation is primarily a test of **implementation competence**, not algorithmic genius. Easy questions often involve straightforward translation of rules into a single loop or pass. Medium questions introduce complexity: multiple interacting agents, more state to track, or requiring a BFS/queue for stepwise processing. The small number of Hard problems usually combine simulation with another core concept, like efficient state hashing for game boards or optimizing the simulation loop itself.

## Which Companies Ask Simulation

Simulation questions are a staple at major tech companies because they mirror the task of translating product specifications into working code. Top askers include:

- [Google](/company/google) - Frequently uses grid and state machine simulations.
- [Amazon](/company/amazon) - Often asks queue-based process simulations related to system design.
- [Meta](/company/meta) - Common in interviews for roles dealing with game logic or UI state flows.
- [Microsoft](/company/microsoft) - Favors problems involving board games or parser simulations.
- [Bloomberg](/company/bloomberg) - Asks simulation questions related to financial data feeds or market event processing.

## Study Tips

1.  **Read the Problem Twice, Then Once More.** The entire challenge is in the details. Miss one edge case in the rules (e.g., "stop moving if blocked," "wrap around the grid") and your solution fails. Annotate the rules as you read.
2.  **Walk Through Examples Manually.** Before writing code, execute the provided examples step-by-step with pen and paper. This builds your mental model of the state transitions and often reveals the core data structures you'll need.
3.  **Start with a Naive Implementation.** Don't try to be clever upfront. First, write the clearest, most direct translation of the rules. Get it working. _Then_ optimize if needed (e.g., adding a `Set` for O(1) lookups instead of repeated array scans).
4.  **Test with Your Own Edge Cases.** After passing the given examples, test with minimal inputs (empty grid, single instruction), maximum inputs, and cases that stress the rules (e.g., all obstacles, circular paths).

Mastering simulation is about disciplined execution. The patterns are simple, but the precision required is high.

[Practice all Simulation questions on CodeJeet](/topic/simulation)
