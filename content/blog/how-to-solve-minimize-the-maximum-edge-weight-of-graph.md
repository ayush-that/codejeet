---
title: "How to Solve Minimize the Maximum Edge Weight of Graph — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize the Maximum Edge Weight of Graph. Medium difficulty, 44.0% acceptance rate. Topics: Binary Search, Depth-First Search, Breadth-First Search, Graph Theory, Shortest Path."
date: "2026-02-01"
category: "dsa-patterns"
tags:
  [
    "minimize-the-maximum-edge-weight-of-graph",
    "binary-search",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Minimize the Maximum Edge Weight of Graph

You're given a directed weighted graph with `n` nodes and need to find the smallest possible maximum edge weight after removing some edges, while ensuring every node can still reach node 0 through a path where all edge weights are ≤ `threshold`. The challenge lies in balancing two constraints: we want to minimize the maximum weight in our solution graph, but we must maintain connectivity to node 0 within the threshold limit.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
n = 4, threshold = 2
edges = [
    [0,1,3],
    [1,2,1],
    [2,3,4],
    [0,3,2],
    [1,3,5]
]
```

We need every node (1, 2, 3) to reach node 0 via a path where ALL edges have weight ≤ threshold (2). But we can also remove edges to lower our maximum edge weight.

**Step 1:** Check if solution exists with max weight = 1

- Keep only edges with weight ≤ 1: [1,2,1]
- Can nodes 1,2,3 reach 0? No - node 1 can't reach 0, node 3 can't reach 0, node 2 can only reach 1
- ❌ Not valid

**Step 2:** Check max weight = 2

- Keep edges with weight ≤ 2: [1,2,1], [0,3,2]
- Check connectivity:
  - Node 1 → 0? No path exists
  - Node 2 → 0? No (can only reach 1)
  - Node 3 → 0? Yes via edge 0-3
- ❌ Not valid (nodes 1 and 2 can't reach 0)

**Step 3:** Check max weight = 3

- Keep edges with weight ≤ 3: [0,1,3], [1,2,1], [0,3,2]
- Check connectivity:
  - Node 1 → 0? Yes via edge 0-1
  - Node 2 → 0? Yes: 2→1→0
  - Node 3 → 0? Yes via edge 0-3
- ✅ Valid! All nodes can reach 0

The answer is 3 - the smallest maximum edge weight that allows all nodes to reach node 0 with paths where every edge ≤ threshold.

## Brute Force Approach

A brute force approach would try every possible maximum weight value from 1 up to the maximum edge weight in the graph:

1. Sort all unique edge weights
2. For each candidate weight `w` in ascending order:
   - Create a filtered graph with only edges where weight ≤ `threshold` AND weight ≤ `w`
   - Check if all nodes can reach node 0 in this filtered graph
   - If yes, return `w` as the answer

The checking step requires running DFS/BFS from each node to see if it can reach node 0, or running a reverse BFS from node 0 to see which nodes are reachable. Either way, this is O(n × (n + E)) per candidate, and with up to O(E) candidates, this becomes O(E × n × (n + E)) - far too slow for typical constraints.

**Why this fails:** For n up to 10^4 and E up to 10^5, O(E × n²) operations would be around 10^13 - completely infeasible. We need a more efficient way to search for the optimal maximum weight.

## Optimized Approach

The key insight is that we can use **binary search** on the answer space combined with **BFS/DFS** for verification:

1. **Binary Search on the Answer:** The answer (minimum possible maximum edge weight) must be between 1 and the maximum edge weight in the original graph. More importantly, if a weight `w` works (all nodes can reach 0 with edges ≤ min(w, threshold)), then any larger weight will also work. This monotonic property enables binary search.

2. **Verification with BFS:** For a candidate weight `w`, we:
   - Build a graph with only edges where weight ≤ min(w, threshold)
   - Since we need to check if all nodes can reach node 0, it's more efficient to check if node 0 can reach all nodes in the **reversed graph** (or run BFS from node 0 on reversed edges)
   - If node 0 can reach all nodes in the reversed filtered graph, then all nodes can reach node 0 in the original filtered graph

3. **Why this works:** The threshold constraint means we can't use edges > threshold regardless of our target maximum weight. So effectively, for candidate `w`, we use edges with weight ≤ min(w, threshold). We're looking for the smallest `w` where this filtered graph allows all nodes to reach 0.

**Step-by-step reasoning:**

1. Collect all unique edge weights for binary search range
2. For each candidate `mid` in binary search:
   - Filter edges: keep if weight ≤ min(mid, threshold)
   - Build adjacency list for reversed graph (we want to check reachability FROM node 0)
   - Run BFS/DFS from node 0 in reversed graph
   - Check if all nodes are visited
3. Adjust binary search bounds based on result
4. Return the smallest working weight

## Optimal Solution

Here's the complete solution using binary search + BFS:

<div class="code-group">

```python
# Time: O((n + E) * log M) where M is max edge weight
# Space: O(n + E) for adjacency list and BFS queue
from collections import deque, defaultdict

def minimizeMaxWeight(n, threshold, edges):
    # Edge case: if n == 1, no edges needed, answer is 0
    if n == 1:
        return 0

    # Step 1: Collect all unique edge weights for binary search range
    weights = set()
    max_weight = 0
    for _, _, w in edges:
        weights.add(w)
        max_weight = max(max_weight, w)

    # Convert to sorted list for binary search
    sorted_weights = sorted(weights)

    # Helper function to check if a candidate max weight works
    def can_achieve(max_w):
        # Build reversed graph with edges where weight <= min(max_w, threshold)
        # We use reversed graph to check reachability FROM node 0
        adj = defaultdict(list)
        limit = min(max_w, threshold)

        for u, v, w in edges:
            if w <= limit:
                # Add reversed edge: from v to u
                adj[v].append(u)

        # BFS from node 0 in reversed graph
        visited = [False] * n
        queue = deque([0])
        visited[0] = True
        count_visited = 1

        while queue:
            node = queue.popleft()
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    count_visited += 1
                    queue.append(neighbor)

        # All nodes must be reachable from node 0 in reversed graph
        return count_visited == n

    # Step 2: Binary search on the answer
    left, right = 0, len(sorted_weights) - 1
    answer = -1

    while left <= right:
        mid = (left + right) // 2
        if can_achieve(sorted_weights[mid]):
            # This weight works, try smaller weights
            answer = sorted_weights[mid]
            right = mid - 1
        else:
            # This weight doesn't work, try larger weights
            left = mid + 1

    # If binary search didn't find answer, check if we need to handle case
    # where answer might be between existing weights
    if answer == -1:
        # Try the maximum weight in the graph
        if can_achieve(max_weight):
            return max_weight
        return -1  # No solution exists

    return answer
```

```javascript
// Time: O((n + E) * log M) where M is max edge weight
// Space: O(n + E) for adjacency list and BFS queue
function minimizeMaxWeight(n, threshold, edges) {
  // Edge case: if n == 1, no edges needed, answer is 0
  if (n === 1) return 0;

  // Step 1: Collect all unique edge weights for binary search range
  const weightsSet = new Set();
  let maxWeight = 0;

  for (const [u, v, w] of edges) {
    weightsSet.add(w);
    maxWeight = Math.max(maxWeight, w);
  }

  const sortedWeights = Array.from(weightsSet).sort((a, b) => a - b);

  // Helper function to check if a candidate max weight works
  const canAchieve = (maxW) => {
    // Build reversed graph with edges where weight <= min(maxW, threshold)
    const adj = new Array(n).fill().map(() => []);
    const limit = Math.min(maxW, threshold);

    for (const [u, v, w] of edges) {
      if (w <= limit) {
        // Add reversed edge: from v to u
        adj[v].push(u);
      }
    }

    // BFS from node 0 in reversed graph
    const visited = new Array(n).fill(false);
    const queue = [0];
    visited[0] = true;
    let countVisited = 1;

    while (queue.length > 0) {
      const node = queue.shift();
      for (const neighbor of adj[node]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          countVisited++;
          queue.push(neighbor);
        }
      }
    }

    // All nodes must be reachable from node 0 in reversed graph
    return countVisited === n;
  };

  // Step 2: Binary search on the answer
  let left = 0,
    right = sortedWeights.length - 1;
  let answer = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canAchieve(sortedWeights[mid])) {
      // This weight works, try smaller weights
      answer = sortedWeights[mid];
      right = mid - 1;
    } else {
      // This weight doesn't work, try larger weights
      left = mid + 1;
    }
  }

  // If binary search didn't find answer
  if (answer === -1) {
    // Try the maximum weight in the graph
    if (canAchieve(maxWeight)) {
      return maxWeight;
    }
    return -1; // No solution exists
  }

  return answer;
}
```

```java
// Time: O((n + E) * log M) where M is max edge weight
// Space: O(n + E) for adjacency list and BFS queue
import java.util.*;

public class Solution {
    public int minimizeMaxWeight(int n, int threshold, int[][] edges) {
        // Edge case: if n == 1, no edges needed, answer is 0
        if (n == 1) return 0;

        // Step 1: Collect all unique edge weights for binary search range
        Set<Integer> weightsSet = new HashSet<>();
        int maxWeight = 0;

        for (int[] edge : edges) {
            int w = edge[2];
            weightsSet.add(w);
            maxWeight = Math.max(maxWeight, w);
        }

        List<Integer> sortedWeights = new ArrayList<>(weightsSet);
        Collections.sort(sortedWeights);

        // Step 2: Binary search on the answer
        int left = 0, right = sortedWeights.size() - 1;
        int answer = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (canAchieve(sortedWeights.get(mid), n, threshold, edges)) {
                // This weight works, try smaller weights
                answer = sortedWeights.get(mid);
                right = mid - 1;
            } else {
                // This weight doesn't work, try larger weights
                left = mid + 1;
            }
        }

        // If binary search didn't find answer
        if (answer == -1) {
            // Try the maximum weight in the graph
            if (canAchieve(maxWeight, n, threshold, edges)) {
                return maxWeight;
            }
            return -1; // No solution exists
        }

        return answer;
    }

    private boolean canAchieve(int maxW, int n, int threshold, int[][] edges) {
        // Build reversed graph with edges where weight <= min(maxW, threshold)
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }

        int limit = Math.min(maxW, threshold);

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (w <= limit) {
                // Add reversed edge: from v to u
                adj[v].add(u);
            }
        }

        // BFS from node 0 in reversed graph
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);
        visited[0] = true;
        int countVisited = 1;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int neighbor : adj[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    countVisited++;
                    queue.offer(neighbor);
                }
            }
        }

        // All nodes must be reachable from node 0 in reversed graph
        return countVisited == n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + E) × log M)

- `M` is the number of unique edge weights (≤ E)
- Binary search runs O(log M) times
- Each verification runs BFS: O(n + E) to build adjacency list and traverse graph
- Total: O((n + E) × log M)

**Space Complexity:** O(n + E)

- Storing the reversed adjacency list: O(E) in worst case
- BFS queue and visited array: O(n)
- Storing unique weights: O(M) ≤ O(E)

For typical constraints (n ≤ 10^4, E ≤ 10^5), this is efficient: ~(10^5 × log(10^5)) ≈ 1.7 million operations.

## Common Mistakes

1. **Forgetting to handle the threshold constraint correctly:** Some candidates only filter by the candidate weight `w` and forget that edges with weight > threshold cannot be used regardless of `w`. Remember: we can only use edges with weight ≤ min(w, threshold).

2. **Checking connectivity in the wrong direction:** Checking if each node can reach node 0 by running BFS from each node is O(n × (n + E)). Instead, reverse the graph and check if node 0 can reach all nodes - this is O(n + E).

3. **Binary search off-by-one errors:** When the answer might be 0 (n = 1 case) or when no solution exists, ensure proper handling. Always test edge cases: n = 1, threshold = 0, disconnected graphs.

4. **Not considering all unique weights:** Some implementations try binary search on range [1, maxWeight] and check every integer, which is inefficient when weights are large. Collecting unique weights first is more efficient.

## When You'll See This Pattern

This "binary search on answer + graph verification" pattern appears in optimization problems where:

1. You need to minimize/maximize some parameter
2. Verification of a candidate value is easier than finding the optimal value directly
3. The verification function is monotonic (if x works, then x+1 also works, or vice versa)

**Related LeetCode problems:**

1. **"Minimum Speed to Arrive on Time" (1870)** - Binary search on train speed, verify if you can arrive on time
2. **"Capacity To Ship Packages Within D Days" (1011)** - Binary search on ship capacity, verify if packages can be shipped in D days
3. **"Split Array Largest Sum" (410)** - Binary search on maximum subarray sum, verify if array can be split into k parts

## Key Takeaways

1. **When you need to find the minimum/maximum value satisfying a condition**, consider binary search on the answer space if verification is easier than direct computation.

2. **For reachability problems in directed graphs**, reversing the graph often simplifies checking if all nodes can reach a particular node (check if that node can reach all in reversed graph).

3. **Always check monotonicity** - if candidate `x` works, do all values ≥ `x` also work? If yes, binary search applies.

[Practice this problem on CodeJeet](/problem/minimize-the-maximum-edge-weight-of-graph)
