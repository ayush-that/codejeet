---
title: "How to Solve Maximum Score of a Node Sequence — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Score of a Node Sequence. Hard difficulty, 39.8% acceptance rate. Topics: Array, Graph Theory, Sorting, Enumeration."
date: "2030-01-15"
category: "dsa-patterns"
tags: ["maximum-score-of-a-node-sequence", "array", "graph-theory", "sorting", "hard"]
---

# How to Solve Maximum Score of a Node Sequence

You're given an undirected graph where each node has a score, and you need to find the maximum sum of scores for a sequence of four distinct nodes `(a, b, c, d)` where edges exist between `(a,b)`, `(b,c)`, and `(c,d)`. The challenge is that the graph can be dense, making brute force checking all possible quadruples impossible. The key insight is that for each middle edge `(b,c)`, we only need the best possible `a` and `d` nodes connected to `b` and `c` respectively, which can be precomputed efficiently.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
scores = [5, 2, 9, 8, 3, 7]
edges = [[0,1], [1,2], [2,3], [0,2], [1,3], [2,4], [3,5]]
```

We're looking for a sequence `a-b-c-d` where edges exist between consecutive nodes. Let's examine one potential approach:

1. Consider edge `(1,2)` as our middle edge `(b,c)`:
   - Node 1 (score 2) has neighbors: [0(5), 2(9), 3(8)]
   - Node 2 (score 9) has neighbors: [1(2), 3(8), 4(3), 0(5)]
2. For node 1 (b), we want the best `a` that's not node 2 (c). The candidates are 0(5) and 3(8). Best is 3(8).

3. For node 2 (c), we want the best `d` that's not node 1 (b). The candidates are 3(8), 4(3), 0(5). Best is 3(8).

4. But wait! We can't use node 3 for both `a` and `d` since all nodes must be distinct. So we need the **top 3 neighbors** for each node to handle conflicts.

5. With top 3 neighbors precomputed:
   - Node 1's top neighbors: [3(8), 0(5), 2(9)] but 2 is c, so next is 0(5)
   - Node 2's top neighbors: [3(8), 0(5), 4(3)] but 3 is taken by a, so next is 0(5)
6. Sequence would be: a=3, b=1, c=2, d=0 with total score = 8 + 2 + 9 + 5 = 24

The optimal sequence actually uses edge `(2,3)` with a=0, b=2, c=3, d=5 giving 5 + 9 + 8 + 7 = 29.

## Brute Force Approach

A naive solution would try all possible quadruples `(a,b,c,d)` and check if edges `(a,b)`, `(b,c)`, and `(c,d)` exist:

1. Generate all combinations of 4 distinct nodes from n nodes: O(n⁴)
2. For each quadruple, check if all three required edges exist in the edge set
3. Calculate the score sum and track the maximum

This is clearly impossible for n up to 5×10⁴. Even checking all edges as potential middle edges `(b,c)` and then trying all neighbors for `a` and `d` would be O(m × deg(b) × deg(c)), which could be O(m × n²) in dense graphs.

What makes the brute force insufficient is that for each middle edge, we waste time checking many `a` and `d` combinations when we really only need the best few candidates.

## Optimized Approach

The key insight is that for a given middle edge `(b,c)`, we want:

- The best `a` connected to `b` (not equal to `c`)
- The best `d` connected to `c` (not equal to `b`)
- And `a`, `b`, `c`, `d` must all be distinct

This leads to our optimization strategy:

1. **Precompute top neighbors**: For each node, store its top 3 neighbors by score. Why 3? Because in the worst case, the best neighbor might conflict (equal to another node in our sequence), so we need backups.

2. **Iterate through middle edges**: For each edge `(u,v)` in the graph, consider it as potential `(b,c)`.

3. **Try candidate pairs**: For the current `(b,c)`, check all combinations of top neighbors from `b`'s list (as `a`) and `c`'s list (as `d`). We only need to check up to 3×3 = 9 combinations per edge since we stored only top 3 neighbors.

4. **Ensure distinctness**: Skip combinations where `a == c`, `a == d`, `b == d`, or any other equality that violates the distinct node requirement.

5. **Calculate maximum**: Track the maximum score sum found.

This reduces the complexity from potentially O(n⁴) to O(m × 9) = O(m), which is efficient even for large graphs.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = number of nodes, m = number of edges
# Space: O(n + m) for adjacency lists and top neighbor storage
def maximumScore(scores, edges):
    n = len(scores)

    # Step 1: Build adjacency list
    # Each node will store a list of its neighbors sorted by score
    adj = [[] for _ in range(n)]

    # Add edges to adjacency list (undirected graph)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    # Step 2: For each node, keep only top 3 neighbors by score
    # This is the key optimization - we only need the best candidates
    for i in range(n):
        # Sort neighbors by score in descending order
        adj[i].sort(key=lambda x: -scores[x])
        # Keep only top 3 (or fewer if node has fewer neighbors)
        adj[i] = adj[i][:3]

    # Step 3: Initialize answer to -1 (in case no valid sequence exists)
    ans = -1

    # Step 4: Try each edge as potential middle edge (b,c)
    for u, v in edges:
        # u and v are our b and c (order doesn't matter in undirected graph)
        b, c = u, v

        # Step 5: Try all combinations of top neighbors
        # Check up to 3 neighbors from b (as a candidates)
        # and up to 3 neighbors from c (as d candidates)
        for a in adj[b]:
            # Skip if a is the same as c (would make sequence invalid)
            if a == c:
                continue
            for d in adj[c]:
                # Skip if d is the same as b or a (would make sequence invalid)
                if d == b or d == a:
                    continue
                # Calculate score for this valid sequence
                current_score = scores[a] + scores[b] + scores[c] + scores[d]
                ans = max(ans, current_score)

    return ans
```

```javascript
// Time: O(n + m) where n = number of nodes, m = number of edges
// Space: O(n + m) for adjacency lists and top neighbor storage
function maximumScore(scores, edges) {
  const n = scores.length;

  // Step 1: Build adjacency list
  // Each node will store a list of its neighbors
  const adj = Array.from({ length: n }, () => []);

  // Add edges to adjacency list (undirected graph)
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Step 2: For each node, keep only top 3 neighbors by score
  // This is the key optimization - we only need the best candidates
  for (let i = 0; i < n; i++) {
    // Sort neighbors by score in descending order
    adj[i].sort((x, y) => scores[y] - scores[x]);
    // Keep only top 3 (or fewer if node has fewer neighbors)
    adj[i] = adj[i].slice(0, 3);
  }

  // Step 3: Initialize answer to -1 (in case no valid sequence exists)
  let ans = -1;

  // Step 4: Try each edge as potential middle edge (b,c)
  for (const [u, v] of edges) {
    // u and v are our b and c (order doesn't matter in undirected graph)
    const b = u,
      c = v;

    // Step 5: Try all combinations of top neighbors
    // Check up to 3 neighbors from b (as a candidates)
    // and up to 3 neighbors from c (as d candidates)
    for (const a of adj[b]) {
      // Skip if a is the same as c (would make sequence invalid)
      if (a === c) continue;

      for (const d of adj[c]) {
        // Skip if d is the same as b or a (would make sequence invalid)
        if (d === b || d === a) continue;

        // Calculate score for this valid sequence
        const currentScore = scores[a] + scores[b] + scores[c] + scores[d];
        ans = Math.max(ans, currentScore);
      }
    }
  }

  return ans;
}
```

```java
// Time: O(n + m) where n = number of nodes, m = number of edges
// Space: O(n + m) for adjacency lists and top neighbor storage
public int maximumScore(int[] scores, int[][] edges) {
    int n = scores.length;

    // Step 1: Build adjacency list
    // Each node will store a list of its neighbors
    List<Integer>[] adj = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        adj[i] = new ArrayList<>();
    }

    // Add edges to adjacency list (undirected graph)
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        adj[u].add(v);
        adj[v].add(u);
    }

    // Step 2: For each node, keep only top 3 neighbors by score
    // This is the key optimization - we only need the best candidates
    for (int i = 0; i < n; i++) {
        // Sort neighbors by score in descending order
        adj[i].sort((x, y) -> Integer.compare(scores[y], scores[x]));
        // Keep only top 3 (or fewer if node has fewer neighbors)
        if (adj[i].size() > 3) {
            adj[i] = new ArrayList<>(adj[i].subList(0, 3));
        }
    }

    // Step 3: Initialize answer to -1 (in case no valid sequence exists)
    int ans = -1;

    // Step 4: Try each edge as potential middle edge (b,c)
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        // u and v are our b and c (order doesn't matter in undirected graph)
        int b = u, c = v;

        // Step 5: Try all combinations of top neighbors
        // Check up to 3 neighbors from b (as a candidates)
        // and up to 3 neighbors from c (as d candidates)
        for (int a : adj[b]) {
            // Skip if a is the same as c (would make sequence invalid)
            if (a == c) continue;

            for (int d : adj[c]) {
                // Skip if d is the same as b or a (would make sequence invalid)
                if (d == b || d == a) continue;

                // Calculate score for this valid sequence
                int currentScore = scores[a] + scores[b] + scores[c] + scores[d];
                ans = Math.max(ans, currentScore);
            }
        }
    }

    return ans;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building adjacency list: O(n + m) where n is nodes, m is edges
- Sorting neighbors for each node: Each node's neighbors are sorted, but since we only keep top 3, the sorting is O(d log d) where d is degree. In total across all nodes, this is O(∑ d log d) ≤ O(m log n) in worst case, but typically much less since high-degree nodes are rare.
- Iterating through edges and checking up to 9 combinations per edge: O(m × 9) = O(m)

**Space Complexity: O(n + m)**

- Adjacency list stores all edges: O(m)
- Storing top 3 neighbors per node: O(3n) = O(n)
- Total: O(n + m)

The key to the efficiency is that we only check a constant number (9) of combinations per edge, rather than checking all possible neighbors.

## Common Mistakes

1. **Not storing enough top neighbors**: Storing only the top neighbor for each node fails when the best neighbor conflicts with another node in the sequence. You need at least top 3 because in worst case: best `a` equals `c`, second best `a` equals `d`, so you need third best.

2. **Forgetting to check all distinctness conditions**: It's easy to miss one of the equality checks. All four nodes must be distinct: `a ≠ b`, `a ≠ c`, `a ≠ d`, `b ≠ c`, `b ≠ d`, `c ≠ d`. Our code handles this by checking `a == c`, `d == b`, and `d == a`.

3. **Incorrectly handling the middle edge direction**: Since the graph is undirected, edge `(u,v)` can be treated as either `(b,c)` or `(c,b)`. Our approach handles this correctly by trying both `u` as `b` and `v` as `c` (though we only need one direction since we check all neighbor combinations).

4. **Not initializing answer to -1**: The problem states to return -1 if no valid sequence exists. Some candidates initialize to 0, which could be wrong if all scores are negative (though constraints say scores are positive, but it's still good practice).

## When You'll See This Pattern

This "top k neighbors" pattern appears in graph problems where you need to find optimal paths or sequences but checking all possibilities is too expensive:

1. **"Maximum Product of the Length of Two Palindromic Subsequences"** - Similar idea of maintaining top candidates to avoid checking all combinations.
2. **"Minimum Cost to Reach Destination in Time"** - Uses priority queues to track best paths (similar to tracking top neighbors).
3. **Graph problems with degree constraints** - When you need to find nodes with certain connection patterns, precomputing top neighbors by some metric is a common optimization.

The core technique is: when you need the "best" element according to some criteria but might need alternatives due to constraints, precompute and store the top k candidates.

## Key Takeaways

1. **Limit search space with heuristics**: When brute force checking all combinations is impossible, identify what candidates actually matter. For this problem, only the highest-scoring neighbors are relevant for `a` and `d`.

2. **Store top k candidates for conflict resolution**: When the best candidate might be invalid due to constraints, store the next best alternatives. The value of k depends on the problem constraints.

3. **Break problems into manageable parts**: Instead of looking for the entire 4-node sequence at once, fix the middle edge and solve the simpler subproblem of finding the best endpoints.

Related problems: [Get the Maximum Score](/problem/get-the-maximum-score)
