---
title: "How to Solve Shortest Path with Alternating Colors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Path with Alternating Colors. Medium difficulty, 47.7% acceptance rate. Topics: Breadth-First Search, Graph Theory."
date: "2026-09-10"
category: "dsa-patterns"
tags: ["shortest-path-with-alternating-colors", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Shortest Path with Alternating Colors

This problem asks us to find the shortest path from node 0 to all other nodes in a directed graph where edges have colors (red or blue), and we must alternate colors at each step. The twist is that we can't take two edges of the same color consecutively. This makes it different from standard BFS because we need to track not just which nodes we've visited, but also what color edge we used to get there.

**What makes this tricky:** In standard BFS for shortest paths, we track visited nodes to avoid cycles. Here, we could revisit the same node if we arrive via a different color edge, since that opens up different outgoing edges. For example, arriving at node 2 via a red edge might let us take blue edges out, while arriving via blue might let us take red edges out. We need to track (node, color) pairs as visited states.

## Visual Walkthrough

Let's trace through a small example:

```
n = 3
redEdges = [[0,1],[1,2]]
blueEdges = [[0,1]]
```

We want shortest paths from node 0 to all nodes, alternating colors.

**Step 1:** Start at node 0. We can take either red or blue edges first (no previous color constraint initially).

**Step 2:** From node 0:

- Take red edge to node 1 (distance 1, last color = red)
- Take blue edge to node 1 (distance 1, last color = blue)

**Step 3:** Process node 1 reached via red edge:

- Last color was red, so must take blue edge next
- Blue edges from node 1: none
- No new nodes reachable

**Step 4:** Process node 1 reached via blue edge:

- Last color was blue, so must take red edge next
- Red edges from node 1: [1,2]
- Reach node 2 via red edge (distance 2, last color = red)

**Step 5:** Process node 2 reached via red edge:

- Last color was red, so must take blue edge next
- Blue edges from node 2: none
- No new nodes reachable

**Result:**

- Node 0: distance 0
- Node 1: distance 1 (via either red or blue)
- Node 2: distance 2 (0→1 blue, 1→2 red)

Notice we visited node 1 twice: once via red and once via blue. This is necessary because arriving with different colors gives access to different outgoing edges.

## Brute Force Approach

A naive approach might try all possible paths, but that would be exponential. Another naive approach might use standard BFS without tracking colors, but that would fail because:

1. We might incorrectly mark nodes as visited when we could reach them via a different color with a shorter path later
2. We might get stuck in cycles if we don't track colors properly
3. We might miss valid paths that require revisiting nodes with different colors

The brute force would essentially be DFS exploring all possible alternating paths, which is O(2^n) in the worst case. We need something smarter.

## Optimized Approach

The key insight is that this is still a shortest path problem, but our state space has expanded. Instead of just tracking which nodes we've visited, we need to track (node, last_color_used) pairs.

**Why this works:** Each (node, color) pair represents a unique state in our search. If we arrive at a node with a certain last color, all future paths from that state will be the same regardless of how we got there. This allows us to use BFS, which naturally finds shortest paths in unweighted graphs.

**Step-by-step reasoning:**

1. Build adjacency lists for red and blue edges separately
2. Use BFS with queue storing (node, last_color, distance)
3. Track visited states as (node, color) where color is 0 for red, 1 for blue
4. Start BFS from (0, 0, 0) and (0, 1, 0) since we can start with either color
5. At each step, if last color was red, only take blue edges; if blue, only take red edges
6. Update answer when we first reach each node (BFS guarantees shortest distance)
7. Initialize all distances to -1 (unreachable)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + r + b) where n = nodes, r = red edges, b = blue edges
# Space: O(n + r + b) for adjacency lists and visited tracking
from collections import deque, defaultdict

def shortestAlternatingPaths(n, redEdges, blueEdges):
    """
    Find shortest alternating color paths from node 0 to all nodes.

    Args:
        n: number of nodes (0 to n-1)
        redEdges: list of [u, v] for red directed edges
        blueEdges: list of [u, v] for blue directed edges

    Returns:
        List of shortest distances, -1 if unreachable
    """
    # Build adjacency lists for each color
    # red_adj[u] = list of nodes reachable from u via red edge
    # blue_adj[u] = list of nodes reachable from u via blue edge
    red_adj = defaultdict(list)
    blue_adj = defaultdict(list)

    for u, v in redEdges:
        red_adj[u].append(v)
    for u, v in blueEdges:
        blue_adj[u].append(v)

    # Initialize answer array with -1 (unreachable)
    answer = [-1] * n
    answer[0] = 0  # Distance to node 0 is 0

    # visited[node][color] tracks if we've visited node with last color
    # color: 0 = red, 1 = blue
    visited = [[False, False] for _ in range(n)]

    # BFS queue: (node, last_color, distance)
    # We start from node 0 with both possible last colors
    queue = deque()
    queue.append((0, 0, 0))  # node 0, last color red, distance 0
    queue.append((0, 1, 0))  # node 0, last color blue, distance 0
    visited[0][0] = True
    visited[0][1] = True

    while queue:
        node, last_color, dist = queue.popleft()

        # If this is first time reaching node, update answer
        # BFS guarantees first time is shortest
        if answer[node] == -1:
            answer[node] = dist

        # Determine which edges we can take based on last color
        # If last color was red (0), we must take blue edges (1) next
        # If last color was blue (1), we must take red edges (0) next
        next_color = 1 - last_color

        # Choose appropriate adjacency list based on next color
        adj_list = blue_adj if next_color == 1 else red_adj

        # Explore all neighbors with the alternating color
        for neighbor in adj_list[node]:
            # Check if we've visited this (node, color) state before
            if not visited[neighbor][next_color]:
                visited[neighbor][next_color] = True
                queue.append((neighbor, next_color, dist + 1))

    return answer
```

```javascript
// Time: O(n + r + b) where n = nodes, r = red edges, b = blue edges
// Space: O(n + r + b) for adjacency lists and visited tracking

/**
 * Find shortest alternating color paths from node 0 to all nodes.
 * @param {number} n - number of nodes (0 to n-1)
 * @param {number[][]} redEdges - array of [u, v] for red directed edges
 * @param {number[][]} blueEdges - array of [u, v] for blue directed edges
 * @return {number[]} - shortest distances, -1 if unreachable
 */
function shortestAlternatingPaths(n, redEdges, blueEdges) {
  // Build adjacency lists for each color
  const redAdj = Array.from({ length: n }, () => []);
  const blueAdj = Array.from({ length: n }, () => []);

  // Populate red adjacency list
  for (const [u, v] of redEdges) {
    redAdj[u].push(v);
  }

  // Populate blue adjacency list
  for (const [u, v] of blueEdges) {
    blueAdj[u].push(v);
  }

  // Initialize answer array with -1 (unreachable)
  const answer = new Array(n).fill(-1);
  answer[0] = 0; // Distance to node 0 is 0

  // visited[node][color] tracks if we've visited node with last color
  // color: 0 = red, 1 = blue
  const visited = Array.from({ length: n }, () => [false, false]);

  // BFS queue: [node, last_color, distance]
  // We use array instead of tuple for simplicity
  const queue = [];

  // Start from node 0 with both possible last colors
  queue.push([0, 0, 0]); // node 0, last color red, distance 0
  queue.push([0, 1, 0]); // node 0, last color blue, distance 0
  visited[0][0] = true;
  visited[0][1] = true;

  while (queue.length > 0) {
    const [node, lastColor, dist] = queue.shift();

    // If this is first time reaching node, update answer
    // BFS guarantees first time is shortest
    if (answer[node] === -1) {
      answer[node] = dist;
    }

    // Determine which edges we can take based on last color
    // If last color was red (0), we must take blue edges (1) next
    // If last color was blue (1), we must take red edges (0) next
    const nextColor = 1 - lastColor;

    // Choose appropriate adjacency list based on next color
    const adjList = nextColor === 1 ? blueAdj : redAdj;

    // Explore all neighbors with the alternating color
    for (const neighbor of adjList[node]) {
      // Check if we've visited this (node, color) state before
      if (!visited[neighbor][nextColor]) {
        visited[neighbor][nextColor] = true;
        queue.push([neighbor, nextColor, dist + 1]);
      }
    }
  }

  return answer;
}
```

```java
// Time: O(n + r + b) where n = nodes, r = red edges, b = blue edges
// Space: O(n + r + b) for adjacency lists and visited tracking

import java.util.*;

class Solution {
    /**
     * Find shortest alternating color paths from node 0 to all nodes.
     * @param n number of nodes (0 to n-1)
     * @param redEdges array of [u, v] for red directed edges
     * @param blueEdges array of [u, v] for blue directed edges
     * @return shortest distances, -1 if unreachable
     */
    public int[] shortestAlternatingPaths(int n, int[][] redEdges, int[][] blueEdges) {
        // Build adjacency lists for each color
        List<Integer>[] redAdj = new ArrayList[n];
        List<Integer>[] blueAdj = new ArrayList[n];

        // Initialize adjacency lists
        for (int i = 0; i < n; i++) {
            redAdj[i] = new ArrayList<>();
            blueAdj[i] = new ArrayList<>();
        }

        // Populate red adjacency list
        for (int[] edge : redEdges) {
            int u = edge[0], v = edge[1];
            redAdj[u].add(v);
        }

        // Populate blue adjacency list
        for (int[] edge : blueEdges) {
            int u = edge[0], v = edge[1];
            blueAdj[u].add(v);
        }

        // Initialize answer array with -1 (unreachable)
        int[] answer = new int[n];
        Arrays.fill(answer, -1);
        answer[0] = 0;  // Distance to node 0 is 0

        // visited[node][color] tracks if we've visited node with last color
        // color: 0 = red, 1 = blue
        boolean[][] visited = new boolean[n][2];

        // BFS queue: each element is [node, last_color, distance]
        Queue<int[]> queue = new LinkedList<>();

        // Start from node 0 with both possible last colors
        queue.offer(new int[]{0, 0, 0});  // node 0, last color red, distance 0
        queue.offer(new int[]{0, 1, 0});  // node 0, last color blue, distance 0
        visited[0][0] = true;
        visited[0][1] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int node = current[0];
            int lastColor = current[1];
            int dist = current[2];

            // If this is first time reaching node, update answer
            // BFS guarantees first time is shortest
            if (answer[node] == -1) {
                answer[node] = dist;
            }

            // Determine which edges we can take based on last color
            // If last color was red (0), we must take blue edges (1) next
            // If last color was blue (1), we must take red edges (0) next
            int nextColor = 1 - lastColor;

            // Choose appropriate adjacency list based on next color
            List<Integer> adjList = (nextColor == 1) ? blueAdj[node] : redAdj[node];

            // Explore all neighbors with the alternating color
            for (int neighbor : adjList) {
                // Check if we've visited this (node, color) state before
                if (!visited[neighbor][nextColor]) {
                    visited[neighbor][nextColor] = true;
                    queue.offer(new int[]{neighbor, nextColor, dist + 1});
                }
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + r + b) where:

- n = number of nodes
- r = number of red edges
- b = number of blue edges

We process each node at most twice (once for each color state), and for each state we examine all outgoing edges of the appropriate color. Building adjacency lists takes O(r + b) time.

**Space Complexity:** O(n + r + b) where:

- O(n) for the answer array and visited array
- O(r + b) for storing adjacency lists
- O(n) for BFS queue in worst case

## Common Mistakes

1. **Not tracking color in visited states:** The most common mistake is using visited[node] instead of visited[node][color]. This causes the algorithm to miss valid paths that require revisiting nodes with different colors.

2. **Forgetting to start with both colors:** Since there's no initial color constraint, we need to start BFS from both (0, red) and (0, blue) states. Missing one could make some nodes unreachable.

3. **Incorrect color alternation logic:** Mixing up when to use red vs blue edges. Remember: if last edge was red, next must be blue, and vice versa. The `next_color = 1 - last_color` trick is clean and avoids bugs.

4. **Not handling nodes with no outgoing edges:** The adjacency lists might be empty for some nodes. Make sure to handle this gracefully when iterating through neighbors.

## When You'll See This Pattern

This problem combines BFS with state expansion, a pattern that appears in many graph problems:

1. **Word Ladder (LeetCode 127):** Similar BFS with state tracking, but states are words rather than (node, color) pairs.

2. **Minimum Knight Moves (LeetCode 1197):** BFS on a chessboard where the state includes position and sometimes additional constraints.

3. **Sliding Puzzle (LeetCode 773):** BFS where state is the board configuration rather than just position.

4. **Bus Routes (LeetCode 815):** BFS where state includes both bus stop and bus route (similar to tracking node and color).

The key pattern is: when standard BFS with node-only states doesn't work because you need to track additional information to avoid cycles or enable certain moves, expand your state space to include that information.

## Key Takeaways

1. **Expand state space when needed:** When you can revisit nodes under different conditions, track those conditions as part of your state. Here, (node, last_color) is the key insight.

2. **BFS finds shortest paths in unweighted graphs:** Even with expanded states, BFS still guarantees shortest paths because it explores all states level by level.

3. **Initialize with all valid starting states:** When there are multiple valid starting conditions (like starting with either color), make sure to include all of them in your initial queue.

[Practice this problem on CodeJeet](/problem/shortest-path-with-alternating-colors)
