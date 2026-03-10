---
title: "Hard Snapchat Interview Questions: Strategy Guide"
description: "How to tackle 31 hard difficulty questions from Snapchat — patterns, time targets, and practice tips."
date: "2032-05-19"
category: "tips"
tags: ["snapchat", "hard", "interview prep"]
---

Snapchat’s interview process is known for its emphasis on practical, scalable problem-solving, and their Hard questions reflect this. Out of 99 total problems, 31 are tagged as Hard—a higher proportion than many other companies. What separates a Snapchat Hard from a Medium? It’s rarely about obscure algorithms. Instead, these problems typically involve a **layered combination of fundamental patterns**, often wrapped in a real-world scenario like optimizing a messaging queue, designing a geo-fencing feature, or handling concurrent user states. The difficulty spike comes from the need to manage multiple constraints simultaneously: time, space, thread-safety, or complex state transitions. You’re not just implementing an algorithm; you’re architecting a solution that balances correctness with efficiency under non-trivial conditions.

## Common Patterns and Templates

Snapchat’s Hard problems frequently test **graph algorithms, dynamic programming with twists, and interval-based logic**. However, the most distinctive pattern is **BFS/DFS on implicit graphs or state spaces**, especially for problems involving shortest paths in a grid with obstacles or minimum steps to reach a target under specific rules. Another common theme is **monotonic stack or queue** optimizations for problems requiring next-greater-element or sliding window maximums with a twist.

Here’s a template for the **BFS on a state space** pattern, which appears in problems like “Sliding Puzzle” (LeetCode #773) or “Shortest Path in a Grid with Obstacles Elimination” (LeetCode #1293). The key is to treat each unique state (position + additional constraints like remaining moves) as a node in a graph.

<div class="code-group">

```python
from collections import deque
from typing import List, Tuple

def bfs_state_space_template(start_state, target_state, get_neighbors_func):
    """
    Generic BFS for state-space search.
    start_state: hashable representation of initial state
    target_state: hashable target state or a predicate function
    get_neighbors_func: function(state) -> list of (next_state, cost)
    Returns: minimum cost to reach target, or -1 if impossible.
    """
    queue = deque([(start_state, 0)])  # (state, cost)
    visited = {start_state}

    while queue:
        current_state, cost = queue.popleft()

        if current_state == target_state:  # or target_state(current_state)
            return cost

        for next_state, step_cost in get_neighbors_func(current_state):
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, cost + step_cost))

    return -1

# Example usage for a grid problem:
def shortest_path_grid(grid: List[List[int]], k: int) -> int:
    rows, cols = len(grid), len(grid[0])
    start = (0, 0, k)  # (row, col, remaining_eliminations)
    target = (rows-1, cols-1)

    def get_neighbors(state):
        r, c, elim = state
        neighbors = []
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_elim = elim - grid[nr][nc]  # grid[nr][nc] is 1 if obstacle
                if new_elim >= 0:
                    neighbors.append(((nr, nc, new_elim), 1))
        return neighbors

    # We need to adjust target check since state includes 'elim'
    def is_target(state):
        r, c, _ = state
        return (r, c) == target

    result = bfs_state_space_template(start, is_target, get_neighbors)
    return result

# Time: O(rows * cols * k) in worst case | Space: O(rows * cols * k)
```

```javascript
function bfsStateSpaceTemplate(startState, targetState, getNeighborsFunc) {
  // startState: hashable (stringified if needed)
  // targetState: either a value or a predicate function
  // getNeighborsFunc: state -> [[nextState, cost], ...]
  const queue = [[startState, 0]];
  const visited = new Set();
  visited.add(JSON.stringify(startState));

  while (queue.length) {
    const [currentState, cost] = queue.shift();

    if (
      typeof targetState === "function"
        ? targetState(currentState)
        : JSON.stringify(currentState) === JSON.stringify(targetState)
    ) {
      return cost;
    }

    for (const [nextState, stepCost] of getNeighborsFunc(currentState)) {
      const key = JSON.stringify(nextState);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([nextState, cost + stepCost]);
      }
    }
  }
  return -1;
}

// Example usage for a grid problem:
function shortestPathGrid(grid, k) {
  const rows = grid.length,
    cols = grid[0].length;
  const start = [0, 0, k];
  const target = [rows - 1, cols - 1];

  function getNeighbors(state) {
    const [r, c, elim] = state;
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const neighbors = [];
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const newElim = elim - grid[nr][nc];
        if (newElim >= 0) {
          neighbors.push([[nr, nc, newElim], 1]);
        }
      }
    }
    return neighbors;
  }

  function isTarget(state) {
    const [r, c] = state;
    return r === target[0] && c === target[1];
  }

  return bfsStateSpaceTemplate(start, isTarget, getNeighbors);
}

// Time: O(rows * cols * k) | Space: O(rows * cols * k)
```

```java
import java.util.*;

public class BFSStateSpace {
    public int bfsStateSpaceTemplate(Object startState, Object targetState,
                                     Function<Object, List<Object[]>> getNeighborsFunc) {
        // Using Object for genericity; in practice, use specific state classes.
        Queue<Object[]> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        queue.offer(new Object[]{startState, 0});
        visited.add(startState.toString());

        while (!queue.isEmpty()) {
            Object[] current = queue.poll();
            Object state = current[0];
            int cost = (int) current[1];

            if (state.equals(targetState)) {
                return cost;
            }

            for (Object[] neighbor : getNeighborsFunc.apply(state)) {
                Object nextState = neighbor[0];
                int stepCost = (int) neighbor[1];
                String key = nextState.toString();
                if (!visited.contains(key)) {
                    visited.add(key);
                    queue.offer(new Object[]{nextState, cost + stepCost});
                }
            }
        }
        return -1;
    }

    // Example for grid problem (simplified):
    public int shortestPathGrid(int[][] grid, int k) {
        int rows = grid.length, cols = grid[0].length;
        State start = new State(0, 0, k);
        State target = new State(rows-1, cols-1, 0); // elim ignored for target

        // Implement getNeighborsFunc for State objects...
        // Time: O(rows * cols * k) | Space: O(rows * cols * k)
        return 0; // placeholder
    }

    class State {
        int r, c, elim;
        State(int r, int c, int elim) { this.r = r; this.c = c; this.elim = elim; }
        public String toString() { return r + "," + c + "," + elim; }
        public boolean equals(Object o) {
            State s = (State) o;
            return r == s.r && c == s.c; // for target comparison
        }
    }
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Snapchat Hard problem, you have 30-35 minutes in a typical 45-minute interview slot. This means you need to **identify the pattern within 5 minutes, explain your approach within 10, and have working code within 25**. The interviewer isn’t just watching for a correct solution; they’re evaluating **system design thinking**. They want to see if you consider:

- **Edge cases**: What if the input is empty? What about memory limits for large states?
- **Scalability**: Can your solution handle millions of users or messages? Mention time/space trade-offs.
- **Code clarity**: Use meaningful variable names, helper functions, and comments for complex logic.
- **Communication**: Narrate your thought process, especially when you hit a roadblock. Saying “I’m considering a BFS because we need the shortest path, but the obstacle elimination adds a state dimension” shows structured thinking.

## Upgrading from Medium to Hard

The jump from Medium to Hard at Snapchat involves two key shifts:

1. **Managing multiple dimensions of state**: In Medium problems, you might track visited cells in a grid. In Hard problems, you track visited cells _plus_ remaining resource (like k eliminations), which expands your state space exponentially. You need to design a visited set that accounts for all relevant dimensions.
2. **Combining patterns**: A Hard problem might require DP on a tree _plus_ memoization, or a monotonic stack _plus_ binary search. The skill is recognizing which patterns to layer and in what order.

New techniques required:

- **Bitmasking for state compression** (e.g., representing visited nodes or selected elements in a compact integer).
- **Meet-in-the-middle** for problems where brute force is too slow but the search space is manageable when split.
- **Advanced graph algorithms** like Dijkstra on a modified graph or finding Eulerian paths.

Mindset shift: Move from “What algorithm solves this?” to “What are the constraints, and how can I model them as a graph/DP state?”

## Specific Patterns for Hard

1. **Dynamic Programming on Intervals with Caching**: Problems like “Strange Printer” (LeetCode #664) require DP on substrings with a twist—the printer can print a sequence of the same character in one operation. The recurrence involves splitting the string and caching results for subproblems.

2. **Monotonic Stack for Next Greater Element with Constraints**: In “Daily Temperatures” (LeetCode #739), a monotonic stack gives O(n) time. Snapchat Hard versions add constraints like “within k steps” or “with a capacity limit,” requiring you to maintain additional data in the stack.

3. **Union-Find with Dynamic Connections**: For problems involving connecting components with time-based or conditional links (e.g., “Accounts Merge” LeetCode #721), Union-Find is essential. The Hard twist often involves undoing connections or handling concurrent operations.

## Practice Strategy

Don’t just solve all 31 Hard questions linearly. Group them by pattern:

- Week 1: Graph-based state BFS (5 problems)
- Week 2: DP with complex state (5 problems)
- Week 3: Interval and stack problems (5 problems)
- Week 4: Mixed review, focusing on weaknesses

Daily target: 2 Hard problems maximum. Spend 45 minutes on each, simulating interview conditions. After solving, write a brief post-mortem: what pattern did you use, what edge cases did you miss, how could you optimize further? Use the Snapchat tag on LeetCode to filter problems, but also practice similar problems from other companies to reinforce patterns.

Remember, Snapchat values engineers who can build robust features quickly. Your solution should be correct, efficient, and readable—just like production code.

[Practice Hard Snapchat questions](/company/snapchat/hard)
