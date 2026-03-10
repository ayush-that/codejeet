---
title: "Breadth-First Search Questions at Snapchat: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Snapchat — patterns, difficulty breakdown, and study tips."
date: "2028-07-13"
category: "dsa-patterns"
tags: ["snapchat", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Snapchat: What to Expect

If you're preparing for a Snapchat interview, you've probably noticed their LeetCode company tag shows 16 Breadth-First Search questions out of 99 total — that's over 16% of their problem set. But here's what the numbers don't tell you: BFS isn't just another algorithm in their toolkit; it's fundamental to how they think about problems. Snapchat's entire product revolves around networks — social networks, content distribution networks, and spatial networks in their AR features. When they ask BFS questions, they're testing whether you can think about systems that propagate through connections, whether those connections are friends, servers, or virtual objects.

I've spoken with engineers who've interviewed at Snapchat, and the consensus is clear: you will almost certainly encounter at least one BFS problem in your onsite interviews. It might be disguised as something else — a matrix problem, a tree problem, or even a design question — but the core traversal logic will be BFS. They use it because it's the most intuitive way to model real-world propagation: messages spreading through a network, effects cascading through a system, or content being discovered layer by layer.

## Specific Patterns Snapchat Favors

Snapchat's BFS problems tend to cluster around three specific patterns that mirror their engineering challenges:

1. **Multi-source BFS** — This is their absolute favorite. Think about how a Snapchat story propagates: it doesn't start from one point; it's available to all your friends simultaneously. Problems like "Rotting Oranges" (#994) and "Walls and Gates" (#286) are classic examples where multiple starting points simultaneously expand outward. They love this pattern because it models real distributed systems.

2. **BFS with state tracking** — Snapchat often asks problems where you need to track additional state during traversal. "Shortest Path in Binary Matrix" (#1091) is a perfect example where you're just doing BFS through a grid, but "Sliding Puzzle" (#773) takes it further by tracking board configurations as state. This tests whether you understand that BFS can traverse state spaces, not just physical spaces.

3. **BFS on implicit graphs** — Many of their problems don't look like graphs at first. "Word Ladder" (#127) transforms a word list into a graph where words are nodes and single-letter changes are edges. This pattern is crucial because real engineering problems rarely come with neat adjacency lists.

Here's the multi-source BFS pattern that appears constantly:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    """Example pattern for problems like Rotting Oranges (#994)"""
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # Initialize with all sources simultaneously
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source nodes
                queue.append((r, c))
            elif grid[r][c] == 1:  # Nodes to be processed
                fresh_count += 1

    if fresh_count == 0:
        return 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    minutes = 0

    # Process level by level
    while queue and fresh_count > 0:
        # Process all nodes at current distance level
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as visited/processed
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) | Space: O(rows * cols) for the queue in worst case
```

```javascript
function multiSourceBFS(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize with all sources
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let minutes = 0;

  while (queue.length > 0 && freshCount > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          queue.push([nr, nc]);
          freshCount--;
        }
      }
    }

    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

        // Initialize queue with all rotten oranges
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {
                    freshCount++;
                }
            }
        }

        if (freshCount == 0) return 0;

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int minutes = 0;

        while (!queue.isEmpty() && freshCount > 0) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0], c = current[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }

            minutes++;
        }

        return freshCount == 0 ? minutes : -1;
    }
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

## How to Prepare

The mistake most candidates make is practicing BFS in isolation. At Snapchat, BFS is almost always part of a larger solution. Here's how to prepare effectively:

**Master the level-by-level processing pattern.** Notice in the code above how we use `for _ in range(len(queue))` to process complete levels before incrementing the timer. This is crucial for problems that ask for "minimum steps" or "shortest distance." Without this pattern, you'll get the wrong answer.

**Practice transforming problems into graphs.** When you see a new problem, ask yourself: "What are the nodes? What are the edges?" For "Word Ladder" (#127), nodes are words, edges are single-letter changes. For "Sliding Puzzle" (#773), nodes are board states, edges are valid moves.

**Implement BFS with state tracking.** Here's a template for BFS that tracks visited states:

<div class="code-group">

```python
from collections import deque
from typing import Tuple

def bfs_with_state(start_state, target_state, get_neighbors):
    """
    Generic BFS with state tracking.
    get_neighbors(state) should return list of next states.
    """
    if start_state == target_state:
        return 0

    queue = deque([start_state])
    visited = {start_state}
    steps = 0

    while queue:
        level_size = len(queue)

        for _ in range(level_size):
            current_state = queue.popleft()

            if current_state == target_state:
                return steps

            for next_state in get_neighbors(current_state):
                if next_state not in visited:
                    visited.add(next_state)
                    queue.append(next_state)

        steps += 1

    return -1  # Not found

# Time: O(b^d) where b is branching factor, d is depth | Space: O(b^d)
```

```javascript
function bfsWithState(startState, targetState, getNeighbors) {
  if (JSON.stringify(startState) === JSON.stringify(targetState)) {
    return 0;
  }

  const queue = [startState];
  const visited = new Set([JSON.stringify(startState)]);
  let steps = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currentState = queue.shift();

      if (JSON.stringify(currentState) === JSON.stringify(targetState)) {
        return steps;
      }

      const neighbors = getNeighbors(currentState);
      for (const nextState of neighbors) {
        const key = JSON.stringify(nextState);
        if (!visited.has(key)) {
          visited.add(key);
          queue.push(nextState);
        }
      }
    }

    steps++;
  }

  return -1;
}

// Time: O(b^d) | Space: O(b^d)
```

```java
import java.util.*;

public class BFSWithState {
    public int bfs(Object startState, Object targetState, Function<Object, List<Object>> getNeighbors) {
        if (startState.equals(targetState)) return 0;

        Queue<Object> queue = new LinkedList<>();
        Set<Object> visited = new HashSet<>();

        queue.offer(startState);
        visited.add(startState);
        int steps = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                Object currentState = queue.poll();

                if (currentState.equals(targetState)) {
                    return steps;
                }

                List<Object> neighbors = getNeighbors.apply(currentState);
                for (Object nextState : neighbors) {
                    if (!visited.contains(nextState)) {
                        visited.add(nextState);
                        queue.offer(nextState);
                    }
                }
            }

            steps++;
        }

        return -1;
    }
}

// Time: O(b^d) | Space: O(b^d)
```

</div>

## How Snapchat Tests Breadth-First Search vs Other Companies

Snapchat's BFS questions have a distinct flavor compared to other companies:

**Google** tends to ask more theoretical graph problems with clever optimizations. Their BFS questions often involve preprocessing or combining BFS with other algorithms. **Meta** leans heavily on tree BFS for their hierarchical data structures. **Amazon** often wraps BFS in system design contexts (think warehouse robots or delivery routes).

Snapchat sits in the middle: their problems are practical but require clean implementation. They care less about clever one-liners and more about whether you can implement BFS correctly under pressure. I've heard from interviewers that they specifically look for:

- Correct handling of edge cases (empty graphs, single nodes)
- Proper level tracking for distance problems
- Efficient memory usage (not storing entire paths in the queue)
- Clean separation of BFS logic from problem-specific logic

What's unique is their focus on **propagation problems**. While other companies might ask "find the shortest path from A to B," Snapchat asks "how long until everything is infected/updated/processed?" This reflects their real-world systems where changes propagate through networks.

## Study Order

Don't jump straight to Snapchat's tagged problems. Build up systematically:

1. **Basic BFS on explicit graphs** — Start with simple adjacency list traversals. Understand queue operations, visited sets, and level tracking. Practice on binary tree level order traversal (#102) first.

2. **Grid BFS** — Move to matrix problems where neighbors are up/down/left/right. "Number of Islands" (#200) is perfect here. This teaches you to derive edges from position.

3. **Multi-source BFS** — This is where Snapchat's focus begins. Practice "Rotting Oranges" (#994) until you can implement it flawlessly. The key insight is initializing the queue with ALL sources.

4. **BFS with state** — Learn to track more than just position. "Sliding Puzzle" (#773) is excellent practice. You'll need to serialize board states as strings or tuples.

5. **Implicit graph construction** — Finally, tackle problems where you build the graph on the fly. "Word Ladder" (#127) is the classic. This combines everything: BFS, state tracking, and implicit edges.

This order works because each step builds on the previous one. If you try "Word Ladder" before understanding basic BFS, you'll struggle with both the graph construction AND the traversal.

## Recommended Practice Order

Solve these in sequence:

1. **Binary Tree Level Order Traversal** (#102) — Pure BFS fundamentals
2. **Number of Islands** (#200) — Grid BFS, visited tracking
3. **Rotting Oranges** (#994) — Multi-source BFS, level tracking for distance
4. **Walls and Gates** (#286) — Multi-source BFS with in-place updates
5. **Shortest Path in Binary Matrix** (#1091) — BFS with early termination
6. **Word Ladder** (#127) — Implicit graph, string state BFS
7. **Sliding Puzzle** (#773) — Complex state tracking, heuristic understanding

After these seven, you'll have covered every BFS pattern Snapchat uses. The remaining tagged problems are variations on these themes.

Remember: Snapchat interviews are practical. They want to see you reason about the problem, then implement clean, working code. They're less interested in mathematical optimizations and more interested in whether you can translate a real-world propagation problem into correct BFS. Practice explaining your thought process as you code — "I'm using a queue because...", "I'm tracking levels here because...", "This visited set prevents...".

[Practice Breadth-First Search at Snapchat](/company/snapchat/breadth-first-search)
