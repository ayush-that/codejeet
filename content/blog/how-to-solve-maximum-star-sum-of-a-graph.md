---
title: "How to Solve Maximum Star Sum of a Graph — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Star Sum of a Graph. Medium difficulty, 42.0% acceptance rate. Topics: Array, Greedy, Graph Theory, Sorting, Heap (Priority Queue)."
date: "2029-04-24"
category: "dsa-patterns"
tags: ["maximum-star-sum-of-a-graph", "array", "greedy", "graph-theory", "medium"]
---

# How to Solve Maximum Star Sum of a Graph

You're given an undirected graph where each node has a value, and you need to find the maximum "star sum" possible. A star is a node plus up to `k` of its neighbors, and you can choose which neighbors to include. The challenge is that you can't just take all neighbors—you need to pick only the ones that increase the total sum, and you're limited to `k` neighbors. This makes the problem interesting because it combines graph traversal with a greedy selection strategy.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

- `vals = [1, 2, 3, 4, 10, -10, -20]`
- `edges = [[0,1], [1,2], [1,3], [1,4], [2,5], [2,6]]`
- `k = 2`

**Graph structure:**

- Node 0: value 1, connected to node 1
- Node 1: value 2, connected to nodes 0, 2, 3, 4
- Node 2: value 3, connected to nodes 1, 5, 6
- Node 3: value 4, connected to node 1
- Node 4: value 10, connected to node 1
- Node 5: value -10, connected to node 2
- Node 6: value -20, connected to node 2

**Step-by-step calculation:**

For node 0 (value = 1):

- Neighbors: [1] with value 2
- Only 1 neighbor, so we can take all (up to k=2)
- Star sum = 1 + 2 = 3

For node 1 (value = 2):

- Neighbors: [0, 2, 3, 4] with values [1, 3, 4, 10]
- Sort descending: [10, 4, 3, 1]
- Take top k=2: [10, 4]
- Star sum = 2 + 10 + 4 = 16

For node 2 (value = 3):

- Neighbors: [1, 5, 6] with values [2, -10, -20]
- Sort descending: [2, -10, -20]
- Take top k=2: [2] (we only take positive values that increase sum)
- Star sum = 3 + 2 = 5

For node 3 (value = 4):

- Neighbors: [1] with value 2
- Star sum = 4 + 2 = 6

For node 4 (value = 10):

- Neighbors: [1] with value 2
- Star sum = 10 + 2 = 12

For node 5 (value = -10):

- Neighbors: [2] with value 3
- Star sum = -10 + 3 = -7

For node 6 (value = -20):

- Neighbors: [2] with value 3
- Star sum = -20 + 3 = -17

**Maximum star sum = 16** (from node 1)

The key insight: For each node, we only want to include neighbors with positive values, and we want the largest ones first.

## Brute Force Approach

A naive approach would be:

1. For each node, collect all its neighbors' values
2. Generate all combinations of up to `k` neighbors
3. Calculate the sum for each combination
4. Track the maximum sum found

This approach has several problems:

- Generating all combinations of neighbors is exponential: O(C(m, k)) where m is the number of neighbors
- For a node with many neighbors, this becomes computationally infeasible
- Even for moderate k (like k=10), the number of combinations explodes

The brute force fails because it doesn't recognize that we only need to consider positive neighbor values, and we want the largest ones. We don't need to check all combinations—we just need to sort and take the top k positive values.

## Optimized Approach

The key insight is that for each node:

1. We start with the node's own value as the base sum
2. We only want to add neighbor values that are **positive** (since negative values would decrease our sum)
3. Among positive neighbor values, we want the **largest** ones first
4. We can only add up to `k` neighbors

This leads to a greedy strategy:

- For each node, collect all neighbor values
- Filter to keep only positive values
- Sort in descending order
- Take the first min(k, number_of_positive_neighbors) values
- Sum them with the node's value

We need to build an adjacency list first to efficiently find all neighbors for each node. Since the graph is undirected, each edge connects two nodes both ways.

## Optimal Solution

Here's the step-by-step algorithm:

1. Build an adjacency list where each node maps to a list of its neighbors' values
2. For each node:
   - Start with the node's own value
   - Get all neighbor values, filter for positive ones
   - Sort in descending order
   - Add the top k values to the sum
3. Track the maximum sum across all nodes

<div class="code-group">

```python
# Time: O(n + m + n * d log d) where n = nodes, m = edges, d = average degree
# Space: O(n + m) for adjacency list
def maxStarSum(self, vals, edges, k):
    n = len(vals)

    # Step 1: Build adjacency list
    # Each node will store values of its neighbors
    adj = [[] for _ in range(n)]

    # For each edge, add neighbor values to both nodes
    for a, b in edges:
        # Add b's value to a's neighbor list
        adj[a].append(vals[b])
        # Add a's value to b's neighbor list
        adj[b].append(vals[a])

    max_sum = float('-inf')

    # Step 2: Calculate star sum for each node
    for i in range(n):
        # Start with the node's own value
        current_sum = vals[i]

        # Get all positive neighbor values
        positive_neighbors = [val for val in adj[i] if val > 0]

        # Sort in descending order to get largest values first
        positive_neighbors.sort(reverse=True)

        # Add top k positive neighbor values
        # We take min(k, len(...)) to avoid index error
        top_k = min(k, len(positive_neighbors))
        for j in range(top_k):
            current_sum += positive_neighbors[j]

        # Update maximum star sum
        max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n + m + n * d log d) where n = nodes, m = edges, d = average degree
// Space: O(n + m) for adjacency list
function maxStarSum(vals, edges, k) {
  const n = vals.length;

  // Step 1: Build adjacency list
  // Each node will store values of its neighbors
  const adj = Array.from({ length: n }, () => []);

  // For each edge, add neighbor values to both nodes
  for (const [a, b] of edges) {
    // Add b's value to a's neighbor list
    adj[a].push(vals[b]);
    // Add a's value to b's neighbor list
    adj[b].push(vals[a]);
  }

  let maxSum = -Infinity;

  // Step 2: Calculate star sum for each node
  for (let i = 0; i < n; i++) {
    // Start with the node's own value
    let currentSum = vals[i];

    // Get all positive neighbor values
    const positiveNeighbors = adj[i].filter((val) => val > 0);

    // Sort in descending order to get largest values first
    positiveNeighbors.sort((a, b) => b - a);

    // Add top k positive neighbor values
    // We take min(k, length) to avoid index error
    const topK = Math.min(k, positiveNeighbors.length);
    for (let j = 0; j < topK; j++) {
      currentSum += positiveNeighbors[j];
    }

    // Update maximum star sum
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

```java
// Time: O(n + m + n * d log d) where n = nodes, m = edges, d = average degree
// Space: O(n + m) for adjacency list
public int maxStarSum(int[] vals, int[][] edges, int k) {
    int n = vals.length;

    // Step 1: Build adjacency list
    // Each node will store values of its neighbors
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        adj.add(new ArrayList<>());
    }

    // For each edge, add neighbor values to both nodes
    for (int[] edge : edges) {
        int a = edge[0];
        int b = edge[1];
        // Add b's value to a's neighbor list
        adj.get(a).add(vals[b]);
        // Add a's value to b's neighbor list
        adj.get(b).add(vals[a]);
    }

    int maxSum = Integer.MIN_VALUE;

    // Step 2: Calculate star sum for each node
    for (int i = 0; i < n; i++) {
        // Start with the node's own value
        int currentSum = vals[i];

        // Get all positive neighbor values
        List<Integer> positiveNeighbors = new ArrayList<>();
        for (int val : adj.get(i)) {
            if (val > 0) {
                positiveNeighbors.add(val);
            }
        }

        // Sort in descending order to get largest values first
        positiveNeighbors.sort((a, b) -> b - a);

        // Add top k positive neighbor values
        // We take min(k, size) to avoid index error
        int topK = Math.min(k, positiveNeighbors.size());
        for (int j = 0; j < topK; j++) {
            currentSum += positiveNeighbors.get(j);
        }

        // Update maximum star sum
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Building adjacency list: O(m) where m is the number of edges
- For each node: O(d log d) where d is the degree (number of neighbors)
- Total: O(n + m + Σ(d_i log d_i)) where d_i is degree of node i
- In worst case (dense graph), this becomes O(n² log n)
- In practice with constraints, it's efficient enough

**Space Complexity:**

- Adjacency list: O(n + m) to store all edges
- Sorting space: O(d) for each node (but we process one at a time)
- Total: O(n + m)

## Common Mistakes

1. **Forgetting that k can be 0**: When k=0, we should only consider the node's own value. Some implementations might try to access the first k elements of an empty list.

2. **Including negative neighbor values**: The problem asks for maximum sum, so adding negative values only decreases the sum. Always filter for positive values only.

3. **Not handling isolated nodes**: Nodes with no edges should still be considered—their star sum is just their own value.

4. **Building adjacency list incorrectly for undirected graph**: Remember to add edges in both directions since the graph is undirected.

5. **Initializing max_sum incorrectly**: Don't initialize to 0 since values can be negative. Use negative infinity or the first node's value.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph traversal with greedy selection**: Similar to "Course Schedule III" (LeetCode 630) where you need to select courses based on certain criteria.

2. **Top-k selection from neighbors**: Similar to "Network Delay Time" (LeetCode 743) where you need to consider paths through neighbors, though that uses Dijkstra's algorithm.

3. **Local optimization for global maximum**: The greedy approach of taking the largest positive values first is similar to "Maximum Subarray" (LeetCode 53) where you extend the subarray only when it increases the sum.

The core pattern is: when you need to select a subset with constraints (like "up to k items") to maximize a sum, and items have different values, sort and take the best ones greedily.

## Key Takeaways

1. **Greedy sorting works for top-k selection problems**: When you need to pick the "best" k items from a collection to maximize a sum, sorting and taking the top k is often optimal.

2. **Graph problems often need adjacency lists**: For efficient neighbor lookup, adjacency lists are usually better than adjacency matrices, especially for sparse graphs.

3. **Filter before sorting**: If you only need positive values, filter them out first. This reduces the sorting workload and simplifies the logic.

4. **Consider the base case**: Always start with the node's own value as the base sum, then add neighbors on top of that.

Related problems: [Number Of Ways To Reconstruct A Tree](/problem/number-of-ways-to-reconstruct-a-tree), [Find Center of Star Graph](/problem/find-center-of-star-graph)
