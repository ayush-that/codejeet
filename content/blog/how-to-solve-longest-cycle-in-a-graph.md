---
title: "How to Solve Longest Cycle in a Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Cycle in a Graph. Hard difficulty, 50.5% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2027-05-24"
category: "dsa-patterns"
tags:
  ["longest-cycle-in-a-graph", "depth-first-search", "breadth-first-search", "graph-theory", "hard"]
---

# How to Solve Longest Cycle in a Graph

This problem asks us to find the longest cycle in a directed graph where each node has at most one outgoing edge. The graph is represented by an array where `edges[i]` points to the destination node from node `i`, or `-1` if there's no outgoing edge. What makes this problem interesting is that the graph isn't necessarily connected, and cycles can be nested or overlapping. The key challenge is efficiently detecting cycles and measuring their lengths without revisiting nodes multiple times.

## Visual Walkthrough

Let's trace through an example: `edges = [3,3,4,5,2,3,-1]`

We have 7 nodes (0-6). The edges are:

- 0 → 3
- 1 → 3
- 2 → 4
- 3 → 5
- 4 → 2
- 5 → 3
- 6 → -1 (no outgoing edge)

Let's manually explore:

- Starting at node 0: 0 → 3 → 5 → 3 (cycle detected: 3→5→3, length 2)
- Starting at node 1: 1 → 3 → 5 → 3 (same cycle as above)
- Starting at node 2: 2 → 4 → 2 (cycle detected: 2→4→2, length 2)
- Starting at node 6: No outgoing edge, so no cycle

We find two cycles: 3→5→3 (length 2) and 2→4→2 (length 2). The longest cycle length is 2.

But wait — what about starting at node 3 directly? 3 → 5 → 3 gives us the same cycle. The key insight is that once we've visited nodes in a cycle, we shouldn't revisit them when starting from other nodes that lead into that cycle.

## Brute Force Approach

A naive approach would be to start from every node and follow the edges until we either:

1. Hit a node with no outgoing edge (-1)
2. Detect a cycle by revisiting a node
3. Exceed n steps (which guarantees a cycle since there are only n nodes)

For each starting node, we'd track visited nodes and their positions to calculate cycle length when we revisit a node.

**Why this fails:**

- Time complexity: O(n²) in worst case (imagine a long chain where we start from each node)
- We'd repeatedly traverse the same paths
- We need to avoid counting the same cycle multiple times from different starting points

The brute force approach is inefficient because it doesn't reuse information about already-explored nodes.

## Optimized Approach

The key insight is that each node has at most one outgoing edge, which creates a special graph structure:

- Each connected component is either a linked list ending in a cycle, or just a linked list ending at -1
- Multiple chains can converge into the same cycle

We can use a **DFS with timestamp tracking** approach:

1. Assign each node a "discovery time" when we first visit it
2. When we encounter a node we've seen before during the same DFS traversal, we've found a cycle
3. The cycle length = current_time - discovery_time_of_revisited_node
4. Once we finish exploring a node (and all nodes reachable from it), we mark it as fully processed so we don't revisit

This is essentially finding strongly connected components in a special type of graph where each SCC with more than one node is a cycle.

## Optimal Solution

We'll use DFS with timestamps. Each node gets a discovery time when first visited. If we encounter a node that's currently in the same DFS traversal (not just visited before, but visited in the current traversal), we've found a cycle.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestCycle(edges):
    n = len(edges)
    # visited array tracks discovery time of each node
    # -1 means not visited yet
    visited = [-1] * n
    max_cycle = -1  # Default answer if no cycle found
    time = 0  # Global timestamp

    def dfs(node):
        nonlocal time, max_cycle
        # If node has no outgoing edge, no cycle from here
        if node == -1:
            return

        # If we've already processed this node in a previous DFS,
        # we don't need to explore it again
        if visited[node] != -1:
            return

        # Start DFS from this node
        current = node
        start_time = time

        while current != -1:
            # If we encounter a node that's already been visited
            if visited[current] != -1:
                # Check if this node was visited in the current DFS traversal
                # (not in a previous one)
                if visited[current] >= start_time:
                    # Cycle found! Calculate its length
                    cycle_length = time - visited[current]
                    max_cycle = max(max_cycle, cycle_length)
                return

            # Mark node with current discovery time
            visited[current] = time
            time += 1
            # Move to next node
            current = edges[current]

    # Try DFS from every node
    for i in range(n):
        if visited[i] == -1:  # Not visited yet
            dfs(i)

    return max_cycle
```

```javascript
// Time: O(n) | Space: O(n)
function longestCycle(edges) {
  const n = edges.length;
  // visited array stores discovery time for each node
  // -1 means not visited yet
  const visited = new Array(n).fill(-1);
  let maxCycle = -1; // Default answer if no cycle found
  let time = 0; // Global timestamp

  function dfs(node) {
    // If node has no outgoing edge, no cycle from here
    if (node === -1) return;

    // If we've already processed this node in a previous DFS,
    // we don't need to explore it again
    if (visited[node] !== -1) return;

    // Start DFS from this node
    let current = node;
    const startTime = time;

    while (current !== -1) {
      // If we encounter a node that's already been visited
      if (visited[current] !== -1) {
        // Check if this node was visited in the current DFS traversal
        // (not in a previous one)
        if (visited[current] >= startTime) {
          // Cycle found! Calculate its length
          const cycleLength = time - visited[current];
          maxCycle = Math.max(maxCycle, cycleLength);
        }
        return;
      }

      // Mark node with current discovery time
      visited[current] = time;
      time++;
      // Move to next node
      current = edges[current];
    }
  }

  // Try DFS from every node
  for (let i = 0; i < n; i++) {
    if (visited[i] === -1) {
      // Not visited yet
      dfs(i);
    }
  }

  return maxCycle;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int longestCycle(int[] edges) {
        int n = edges.length;
        // visited array stores discovery time for each node
        // -1 means not visited yet
        int[] visited = new int[n];
        Arrays.fill(visited, -1);
        int maxCycle = -1;  // Default answer if no cycle found
        int time = 0;  // Global timestamp

        for (int i = 0; i < n; i++) {
            if (visited[i] == -1) {  // Not visited yet
                int startTime = time;
                int current = i;

                while (current != -1) {
                    // If we encounter a node that's already been visited
                    if (visited[current] != -1) {
                        // Check if this node was visited in the current DFS traversal
                        // (not in a previous one)
                        if (visited[current] >= startTime) {
                            // Cycle found! Calculate its length
                            int cycleLength = time - visited[current];
                            maxCycle = Math.max(maxCycle, cycleLength);
                        }
                        break;
                    }

                    // Mark node with current discovery time
                    visited[current] = time;
                    time++;
                    // Move to next node
                    current = edges[current];
                }
            }
        }

        return maxCycle;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each node is visited exactly once
- When we traverse from a node, we mark all nodes in that path as visited
- Even though we have nested loops (outer loop over nodes, inner while loop), the inner loop only processes unvisited nodes

**Space Complexity: O(n)**

- We store a visited array of size n to track discovery times
- The recursion stack (in Python/JS recursive version) could be O(n) in worst case, but we use iterative approach in Java to avoid deep recursion
- Additional variables use O(1) space

## Common Mistakes

1. **Not tracking discovery times properly**: Simply marking nodes as visited/not visited isn't enough. We need to know when each node was discovered to calculate cycle lengths. Without timestamps, we can't distinguish between nodes visited in the current traversal vs. previous ones.

2. **Infinite loops in chains without cycles**: If you don't handle the `-1` case (no outgoing edge), you might get stuck trying to follow edges from a terminal node. Always check if `edges[current] == -1` before continuing.

3. **Counting the same cycle multiple times**: Starting DFS from every node without proper visited tracking will cause you to rediscover the same cycle from different entry points. Our timestamp approach ensures each cycle is counted exactly once.

4. **Off-by-one errors in cycle length calculation**: When you revisit a node, the cycle length is `current_time - discovery_time[revisited_node]`, not `current_time - discovery_time[revisited_node] + 1`. Think about it: if node A was discovered at time 2 and we revisit it at time 5, we've visited 5-2 = 3 new nodes (including the revisit), which is the cycle length.

## When You'll See This Pattern

This timestamp-based DFS approach appears in several graph problems:

1. **Detect Cycle in Directed Graph**: Similar timestamp technique to distinguish back edges (cycle) from cross edges.

2. **Find All Groups of Farmland**: While not exactly the same, it uses similar visited tracking to avoid recounting.

3. **Course Schedule II**: Uses DFS with timestamps to detect cycles and generate topological order.

4. **Strongly Connected Components**: Kosaraju's and Tarjan's algorithms use similar discovery time concepts.

The core pattern is: when you need to detect cycles and measure properties about them (length, nodes involved), consider using discovery timestamps to track when nodes were first visited.

## Key Takeaways

1. **Each node with at most one outgoing edge creates a pseudo-linked-list structure** where components are either chains ending in cycles or chains ending at -1. This simplifies cycle detection compared to general graphs.

2. **Discovery timestamps are powerful for cycle detection** because they let you distinguish between nodes visited in the current traversal (cycle) vs. previously visited nodes (already explored component).

3. **Once a node is fully processed, don't revisit it** — this is key to achieving O(n) time complexity. The visited array serves dual purpose: it tracks discovery times and prevents redundant work.

Remember: when you see "at most one outgoing edge" in a graph problem, think linked lists and simple cycle detection rather than general graph algorithms.

Related problems: [Strange Printer II](/problem/strange-printer-ii), [Minimum Number of Operations to Sort a Binary Tree by Level](/problem/minimum-number-of-operations-to-sort-a-binary-tree-by-level), [Shortest Cycle in a Graph](/problem/shortest-cycle-in-a-graph)
