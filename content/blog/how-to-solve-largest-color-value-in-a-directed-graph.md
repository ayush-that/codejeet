---
title: "How to Solve Largest Color Value in a Directed Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Largest Color Value in a Directed Graph. Hard difficulty, 57.3% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Graph Theory, Topological Sort."
date: "2026-09-19"
category: "dsa-patterns"
tags:
  ["largest-color-value-in-a-directed-graph", "hash-table", "string", "dynamic-programming", "hard"]
---

# How to Solve Largest Color Value in a Directed Graph

This problem asks us to find the maximum frequency of any single color along any valid path in a directed graph, where each node has a color. The challenge is that we need to track color counts through all possible paths while detecting cycles (which would make the answer infinite). This combines graph traversal, cycle detection, and dynamic programming in one problem.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `n = 4`, `colors = "abac"`
- `edges = [[0,1],[1,2],[2,3],[0,3]]`

**Graph structure:**

- Node 0 (color 'a') → Node 1 (color 'b')
- Node 1 (color 'b') → Node 2 (color 'a')
- Node 2 (color 'a') → Node 3 (color 'c')
- Node 0 (color 'a') → Node 3 (color 'c')

**Step-by-step reasoning:**

1. Starting at node 0 (color 'a'), we have count: a=1, b=0, c=0
2. Path 0→1: node 1 is 'b', so path 0→1 has a=1, b=1, c=0 (max=1)
3. Path 0→1→2: node 2 is 'a', so a=2, b=1, c=0 (max=2)
4. Path 0→1→2→3: node 3 is 'c', so a=2, b=1, c=1 (max=2)
5. Path 0→3: node 3 is 'c', so a=1, b=0, c=1 (max=1)

But wait! We also need to consider:

- Path 1→2→3: starting at node 1, we get a=1, b=1, c=1 (max=1)
- Path 2→3: a=1, b=0, c=1 (max=1)

The maximum color frequency we see is 2 (color 'a' appears twice on path 0→1→2).

Now consider a cycle: if we had edge 2→0 creating a cycle 0→1→2→0, we could traverse it infinitely many times, making the answer -1.

## Brute Force Approach

A naive approach would be to explore all possible paths from every node:

1. For each starting node, perform DFS to explore all paths
2. Track color counts along each path
3. Update the maximum color frequency seen
4. Detect cycles by checking if we revisit a node

**Why this fails:**

- The number of paths can be exponential in a DAG (directed acyclic graph)
- In a graph with cycles, we'd get infinite recursion
- Even with cycle detection, we'd still explore redundant paths
- Time complexity would be O(n! \* 26) in worst case

The brute force is clearly infeasible for n up to 10⁵.

## Optimized Approach

The key insight is that we need to combine:

1. **Topological sorting** to process nodes in dependency order
2. **Dynamic programming** to track maximum color counts

**Step-by-step reasoning:**

1. **Cycle detection first**: If there's a cycle, we can traverse it infinitely to increase color counts, so answer is -1.

2. **DP state definition**: Let `dp[node][color]` = maximum count of `color` in any path ending at `node`.

3. **Transition**: For each edge `u → v`:
   - For each color `c`: `dp[v][c] = max(dp[v][c], dp[u][c])`
   - Then add the current node's color: `dp[v][colors[v]] += 1`

4. **Processing order**: We need to process nodes in topological order so when we process a node, all its incoming paths have been considered.

5. **Answer**: The maximum value in the entire DP table.

**Why topological sort works:**

- In topological order, when we process node `v`, all nodes that can reach `v` have already been processed
- This ensures `dp[v]` contains the maximum color counts from all paths ending at `v`

## Optimal Solution

Here's the complete solution using Kahn's algorithm for topological sort with cycle detection:

<div class="code-group">

```python
# Time: O((n + m) * 26) = O(n + m) since 26 is constant
# Space: O(n * 26) = O(n) for the DP table
class Solution:
    def largestPathValue(self, colors: str, edges: List[List[int]]) -> int:
        n = len(colors)

        # Build adjacency list and indegree array
        adj = [[] for _ in range(n)]
        indegree = [0] * n

        for u, v in edges:
            adj[u].append(v)
            indegree[v] += 1

        # DP table: dp[node][color] = max count of color in paths ending at node
        # We use 26 for lowercase English letters
        dp = [[0] * 26 for _ in range(n)]

        # Initialize DP with each node's own color
        for i in range(n):
            color_idx = ord(colors[i]) - ord('a')
            dp[i][color_idx] = 1

        # Kahn's algorithm for topological sort
        queue = deque()

        # Start with nodes having no incoming edges
        for i in range(n):
            if indegree[i] == 0:
                queue.append(i)

        nodes_processed = 0
        answer = 0

        while queue:
            u = queue.popleft()
            nodes_processed += 1

            # Update answer with maximum color count for current node
            answer = max(answer, max(dp[u]))

            # Process all neighbors
            for v in adj[u]:
                # Update DP for neighbor v based on paths through u
                for color in range(26):
                    dp[v][color] = max(dp[v][color], dp[u][color])

                # Add v's own color
                v_color = ord(colors[v]) - ord('a')
                dp[v][v_color] = max(dp[v][v_color], dp[u][v_color] + 1)

                # Decrease indegree and add to queue if it becomes 0
                indegree[v] -= 1
                if indegree[v] == 0:
                    queue.append(v)

        # If we didn't process all nodes, there's a cycle
        if nodes_processed != n:
            return -1

        return answer
```

```javascript
// Time: O((n + m) * 26) = O(n + m) since 26 is constant
// Space: O(n * 26) = O(n) for the DP table
function largestPathValue(colors, edges) {
  const n = colors.length;

  // Build adjacency list and indegree array
  const adj = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    indegree[v]++;
  }

  // DP table: dp[node][color] = max count of color in paths ending at node
  const dp = Array.from({ length: n }, () => new Array(26).fill(0));

  // Initialize DP with each node's own color
  for (let i = 0; i < n; i++) {
    const colorIdx = colors.charCodeAt(i) - 97; // 'a' = 97
    dp[i][colorIdx] = 1;
  }

  // Kahn's algorithm for topological sort
  const queue = [];

  // Start with nodes having no incoming edges
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) {
      queue.push(i);
    }
  }

  let nodesProcessed = 0;
  let answer = 0;

  while (queue.length > 0) {
    const u = queue.shift();
    nodesProcessed++;

    // Update answer with maximum color count for current node
    answer = Math.max(answer, Math.max(...dp[u]));

    // Process all neighbors
    for (const v of adj[u]) {
      // Update DP for neighbor v based on paths through u
      for (let color = 0; color < 26; color++) {
        dp[v][color] = Math.max(dp[v][color], dp[u][color]);
      }

      // Add v's own color
      const vColor = colors.charCodeAt(v) - 97;
      dp[v][vColor] = Math.max(dp[v][vColor], dp[u][vColor] + 1);

      // Decrease indegree and add to queue if it becomes 0
      indegree[v]--;
      if (indegree[v] === 0) {
        queue.push(v);
      }
    }
  }

  // If we didn't process all nodes, there's a cycle
  if (nodesProcessed !== n) {
    return -1;
  }

  return answer;
}
```

```java
// Time: O((n + m) * 26) = O(n + m) since 26 is constant
// Space: O(n * 26) = O(n) for the DP table
class Solution {
    public int largestPathValue(String colors, int[][] edges) {
        int n = colors.length();

        // Build adjacency list and indegree array
        List<Integer>[] adj = new ArrayList[n];
        int[] indegree = new int[n];

        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            indegree[v]++;
        }

        // DP table: dp[node][color] = max count of color in paths ending at node
        int[][] dp = new int[n][26];

        // Initialize DP with each node's own color
        for (int i = 0; i < n; i++) {
            int colorIdx = colors.charAt(i) - 'a';
            dp[i][colorIdx] = 1;
        }

        // Kahn's algorithm for topological sort
        Queue<Integer> queue = new LinkedList<>();

        // Start with nodes having no incoming edges
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        int nodesProcessed = 0;
        int answer = 0;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            nodesProcessed++;

            // Update answer with maximum color count for current node
            for (int color = 0; color < 26; color++) {
                answer = Math.max(answer, dp[u][color]);
            }

            // Process all neighbors
            for (int v : adj[u]) {
                // Update DP for neighbor v based on paths through u
                for (int color = 0; color < 26; color++) {
                    dp[v][color] = Math.max(dp[v][color], dp[u][color]);
                }

                // Add v's own color
                int vColor = colors.charAt(v) - 'a';
                dp[v][vColor] = Math.max(dp[v][vColor], dp[u][vColor] + 1);

                // Decrease indegree and add to queue if it becomes 0
                indegree[v]--;
                if (indegree[v] == 0) {
                    queue.offer(v);
                }
            }
        }

        // If we didn't process all nodes, there's a cycle
        if (nodesProcessed != n) {
            return -1;
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building adjacency list: O(m)
- Initializing DP table: O(n × 26) = O(n) since 26 is constant
- Topological sort with BFS: O(n + m)
- For each edge processed, we update 26 colors: O(m × 26) = O(m)
- Total: O(n + m + n + m) = O(n + m)

**Space Complexity: O(n)**

- Adjacency list: O(n + m)
- Indegree array: O(n)
- DP table: O(n × 26) = O(n)
- Queue: O(n)
- Total: O(n + m) but since m ≤ 10⁵, it's effectively O(n)

## Common Mistakes

1. **Forgetting cycle detection**: The most common mistake is not checking for cycles. If there's any cycle in the graph, we can traverse it infinitely to increase color counts, so the answer should be -1.

2. **Incorrect DP transition order**: Processing nodes in random order won't work. We must use topological sort to ensure when we process a node, all possible paths to it have been considered.

3. **Not initializing DP correctly**: Each node should start with count 1 for its own color, not 0. The path consisting of just the node itself has frequency 1 for its color.

4. **Using DFS instead of BFS for topological sort**: While DFS with coloring (white/gray/black) can detect cycles, BFS (Kahn's algorithm) is cleaner here because it naturally gives us the processing order we need for DP updates.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Topological Sort with DP**: Similar to "Course Schedule" (LeetCode 207) but with additional state tracking. Other problems using this pattern:
   - "Course Schedule II" (LeetCode 210) - topological sort with ordering
   - "Parallel Courses" (LeetCode 1136) - longest path in DAG

2. **DP on DAGs**: The concept of processing nodes in topological order for DP appears in:
   - "Longest Increasing Path in a Matrix" (LeetCode 329) - DP with memoization on implicit DAG
   - "Cheapest Flights Within K Stops" (LeetCode 787) - DP with Bellman-Ford on graph

3. **State-augmented graph traversal**: Problems where you need to track additional state while traversing:
   - "Shortest Path Visiting All Nodes" (LeetCode 847) - BFS with bitmask state
   - "Minimum Cost to Reach Destination in Time" (LeetCode 1928) - DP with time dimension

## Key Takeaways

1. **Topological sort + DP is powerful for DAG problems**: When you need to compute something along all paths in a DAG, process nodes in topological order and use DP to accumulate results.

2. **Cycle detection is crucial in directed graph problems**: Always check if the problem allows cycles and handle them appropriately. Kahn's algorithm naturally detects cycles by tracking processed nodes.

3. **Think about what needs to be tracked**: In this problem, we needed to track 26 color counts per node. In other problems, it might be distance, visited nodes (bitmask), or other constraints.

4. **Constant factors matter**: Even though we have O(n × 26) operations, 26 is constant so it's still O(n). Don't be afraid to use multidimensional arrays when dimensions are small constants.

[Practice this problem on CodeJeet](/problem/largest-color-value-in-a-directed-graph)
