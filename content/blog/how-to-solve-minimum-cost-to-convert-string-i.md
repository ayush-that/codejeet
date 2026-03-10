---
title: "How to Solve Minimum Cost to Convert String I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Convert String I. Medium difficulty, 63.2% acceptance rate. Topics: Array, String, Graph Theory, Shortest Path."
date: "2026-02-19"
category: "dsa-patterns"
tags: ["minimum-cost-to-convert-string-i", "array", "string", "graph-theory", "medium"]
---

# How to Solve Minimum Cost to Convert String I

You're given two strings `source` and `target` of equal length, along with conversion rules that allow changing certain characters to others at specified costs. The goal is to find the minimum total cost to transform `source` into `target` using these conversions, or return -1 if it's impossible. What makes this problem interesting is that it's essentially a shortest path problem in disguise—each character conversion represents an edge in a graph, and we need to find the cheapest way to transform each character position.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
source = "abcd"
target = "acbe"
original = ['a','b','c','c','e','d']
changed = ['b','c','b','e','f','e']
cost = [1,1,1,1,1,1]
```

We need to convert `source = "abcd"` to `target = "acbe"`:

1. Position 0: `'a'` → `'a'` (same character, cost 0)
2. Position 1: `'b'` → `'c'` (need conversion rule)
3. Position 2: `'c'` → `'b'` (need conversion rule)
4. Position 3: `'d'` → `'e'` (need conversion rule)

The conversion rules form a graph where nodes are letters and edges have costs:

- `'a'` → `'b'` (cost 1)
- `'b'` → `'c'` (cost 1)
- `'c'` → `'b'` (cost 1)
- `'c'` → `'e'` (cost 1)
- `'e'` → `'f'` (cost 1)
- `'d'` → `'e'` (cost 1)

For position 1 (`'b'` → `'c'`): Direct edge exists, cost = 1
For position 2 (`'c'` → `'b'`): Direct edge exists, cost = 1
For position 3 (`'d'` → `'e'`): Direct edge exists, cost = 1

Total cost = 0 + 1 + 1 + 1 = 3

But wait—what if indirect paths are cheaper? What if we could go `'d'` → `'e'` → `'f'`? That would cost more (2), not less. However, consider if we had a cheaper indirect path. This shows why we need to compute shortest paths between ALL pairs of letters, not just use direct conversions.

## Brute Force Approach

A naive approach would be to try all possible sequences of conversions for each position. For each character in `source`, if it doesn't match the corresponding character in `target`, we could:

1. Look for direct conversion rules
2. Try all possible intermediate conversions recursively
3. Track the minimum cost path

The brute force code would involve recursive exploration of all conversion chains. However, this is extremely inefficient because:

- There are 26 possible letters
- Conversion chains could be arbitrarily long (up to 25 intermediate steps)
- For each of the `n` positions, we'd explore an exponential number of paths
- Time complexity would be roughly O(26^n) in worst case

Even with memoization, the naive approach would still be O(26^3 × n) which is too slow for constraints where `n` can be up to 10^5.

## Optimized Approach

The key insight is that this is a **shortest path problem in a graph**:

- Nodes: The 26 lowercase letters (a-z)
- Directed edges: Conversion rules from `original[i]` to `changed[i]` with weight `cost[i]`
- Multiple edges between same nodes: Keep only the minimum cost
- Goal: For each position, find the minimum cost to convert `source[i]` to `target[i]`

We need to compute the shortest path between ALL pairs of letters. This is the **all-pairs shortest path** problem, which we can solve with Floyd-Warshall algorithm since we only have 26 nodes.

**Step-by-step reasoning:**

1. **Graph Construction**: Create a 26×26 adjacency matrix where `dist[a][b]` = minimum cost to convert letter `a` to letter `b`
2. **Initialize**: Set diagonal to 0 (same letter costs 0), all other pairs to infinity
3. **Add direct edges**: For each conversion rule, update `dist[original[i]][changed[i]]` to minimum cost
4. **Floyd-Warshall**: Compute shortest paths between all pairs using intermediate nodes
5. **Calculate total cost**: For each position `i`, if `source[i] == target[i]`, cost = 0; otherwise, use `dist[source[i]][target[i]]`. If any required conversion is infinity, return -1.

Why Floyd-Warshall works well here:

- Only 26 nodes, so O(26^3) = O(17,576) operations is trivial
- Handles indirect paths automatically (e.g., a→b→c might be cheaper than a→c)
- Detects if conversion is impossible (infinite cost)

## Optimal Solution

<div class="code-group">

```python
# Time: O(26^3 + n) = O(n) since 26^3 is constant
# Space: O(26^2) = O(1) for the distance matrix
def minimumCost(source, target, original, changed, cost):
    # Step 1: Initialize distance matrix for all 26 letters
    # dist[a][b] = min cost to convert letter a to letter b
    INF = float('inf')
    dist = [[INF] * 26 for _ in range(26)]

    # Step 2: Set distance from a letter to itself as 0
    for i in range(26):
        dist[i][i] = 0

    # Step 3: Add direct conversion edges
    # Keep only the minimum cost if multiple conversions exist
    for o, c, co in zip(original, changed, cost):
        u = ord(o) - ord('a')
        v = ord(c) - ord('a')
        # Store minimum cost if multiple edges between same nodes
        dist[u][v] = min(dist[u][v], co)

    # Step 4: Floyd-Warshall algorithm to find shortest paths
    # between all pairs of letters using all possible intermediates
    for k in range(26):          # intermediate node
        for i in range(26):      # source node
            if dist[i][k] == INF:
                continue         # skip if no path to intermediate
            for j in range(26):  # target node
                if dist[k][j] == INF:
                    continue     # skip if no path from intermediate
                # Update if path through k is cheaper
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

    # Step 5: Calculate total minimum cost
    total_cost = 0
    for s_char, t_char in zip(source, target):
        if s_char == t_char:
            continue  # same character, no cost

        u = ord(s_char) - ord('a')
        v = ord(t_char) - ord('a')

        # If no conversion path exists, return -1
        if dist[u][v] == INF:
            return -1

        total_cost += dist[u][v]

    return total_cost
```

```javascript
// Time: O(26^3 + n) = O(n) since 26^3 is constant
// Space: O(26^2) = O(1) for the distance matrix
function minimumCost(source, target, original, changed, cost) {
  // Step 1: Initialize distance matrix for all 26 letters
  // dist[a][b] = min cost to convert letter a to letter b
  const INF = Number.MAX_SAFE_INTEGER;
  const dist = Array.from({ length: 26 }, () => Array(26).fill(INF));

  // Step 2: Set distance from a letter to itself as 0
  for (let i = 0; i < 26; i++) {
    dist[i][i] = 0;
  }

  // Step 3: Add direct conversion edges
  // Keep only the minimum cost if multiple conversions exist
  for (let i = 0; i < original.length; i++) {
    const u = original[i].charCodeAt(0) - "a".charCodeAt(0);
    const v = changed[i].charCodeAt(0) - "a".charCodeAt(0);
    // Store minimum cost if multiple edges between same nodes
    dist[u][v] = Math.min(dist[u][v], cost[i]);
  }

  // Step 4: Floyd-Warshall algorithm to find shortest paths
  // between all pairs of letters using all possible intermediates
  for (let k = 0; k < 26; k++) {
    // intermediate node
    for (let i = 0; i < 26; i++) {
      // source node
      if (dist[i][k] === INF) continue; // skip if no path to intermediate
      for (let j = 0; j < 26; j++) {
        // target node
        if (dist[k][j] === INF) continue; // skip if no path from intermediate
        // Update if path through k is cheaper
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
      }
    }
  }

  // Step 5: Calculate total minimum cost
  let totalCost = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === target[i]) continue; // same character, no cost

    const u = source[i].charCodeAt(0) - "a".charCodeAt(0);
    const v = target[i].charCodeAt(0) - "a".charCodeAt(0);

    // If no conversion path exists, return -1
    if (dist[u][v] === INF) return -1;

    totalCost += dist[u][v];
  }

  return totalCost;
}
```

```java
// Time: O(26^3 + n) = O(n) since 26^3 is constant
// Space: O(26^2) = O(1) for the distance matrix
public long minimumCost(String source, String target, char[] original, char[] changed, int[] cost) {
    // Step 1: Initialize distance matrix for all 26 letters
    // dist[a][b] = min cost to convert letter a to letter b
    final long INF = Long.MAX_VALUE / 2; // Avoid overflow in addition
    long[][] dist = new long[26][26];

    // Step 2: Initialize all distances to INF and diagonal to 0
    for (int i = 0; i < 26; i++) {
        Arrays.fill(dist[i], INF);
        dist[i][i] = 0;
    }

    // Step 3: Add direct conversion edges
    // Keep only the minimum cost if multiple conversions exist
    for (int i = 0; i < original.length; i++) {
        int u = original[i] - 'a';
        int v = changed[i] - 'a';
        // Store minimum cost if multiple edges between same nodes
        dist[u][v] = Math.min(dist[u][v], cost[i]);
    }

    // Step 4: Floyd-Warshall algorithm to find shortest paths
    // between all pairs of letters using all possible intermediates
    for (int k = 0; k < 26; k++) {          // intermediate node
        for (int i = 0; i < 26; i++) {      // source node
            if (dist[i][k] == INF) continue; // skip if no path to intermediate
            for (int j = 0; j < 26; j++) {  // target node
                if (dist[k][j] == INF) continue; // skip if no path from intermediate
                // Update if path through k is cheaper
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }

    // Step 5: Calculate total minimum cost
    long totalCost = 0;
    for (int i = 0; i < source.length(); i++) {
        if (source.charAt(i) == target.charAt(i)) continue; // same character, no cost

        int u = source.charAt(i) - 'a';
        int v = target.charAt(i) - 'a';

        // If no conversion path exists, return -1
        if (dist[u][v] == INF) return -1;

        totalCost += dist[u][v];
    }

    return totalCost;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(26^3 + n) = O(n)**

- Floyd-Warshall on 26 nodes: O(26^3) = O(17,576) constant time
- Processing `n` character positions: O(n)
- Total: O(26^3 + n) which simplifies to O(n) since 26^3 is constant

**Space Complexity: O(26^2) = O(1)**

- Distance matrix: 26 × 26 = 676 entries, constant space
- No additional data structures scale with input size

The constant factors are small enough that this easily handles the maximum constraints (n ≤ 10^5).

## Common Mistakes

1. **Not handling multiple edges between same nodes**: If the input contains multiple conversion rules from `'a'`→`'b'` with different costs, you must keep only the minimum. Forgetting this leads to incorrect higher costs.

2. **Integer overflow in Floyd-Warshall**: When adding costs, they can sum up to large values. Use `long` in Java or ensure your INF is large enough that `INF + cost < INF` doesn't overflow.

3. **Forgetting to check for impossible conversions**: If `dist[u][v]` remains INF after Floyd-Warshall, there's no conversion path. Returning the INF value instead of -1 is wrong.

4. **Incorrect initialization of distance matrix**: Diagonal should be 0 (same letter conversion costs 0), not INF. This mistake makes every same-character position incur cost.

5. **Using Dijkstra for each pair instead of Floyd-Warshall**: While Dijkstra from each of 26 nodes would also work (O(26 × E log V)), Floyd-Warshall is simpler for dense graphs with only 26 nodes.

## When You'll See This Pattern

This "graph transformation" pattern appears when you need to find minimum cost transformations between states, especially when:

- States are limited and discrete (like 26 letters)
- Transformation rules are given as edges with weights
- You need shortest paths between all pairs

**Related LeetCode problems:**

1. **Network Delay Time (Medium)**: Single-source shortest path in weighted graph
2. **Cheapest Flights Within K Stops (Medium)**: Shortest path with constraint on number of edges
3. **Find the City With Smallest Number of Neighbors at Threshold Distance (Medium)**: All-pairs shortest path application

The core technique—Floyd-Warshall for all-pairs shortest path—is useful whenever you have a small set of nodes (typically ≤ 100) and need distances between all pairs.

## Key Takeaways

1. **Recognize graph problems in disguise**: When you see "transform A to B with given conversions at certain costs," think of letters/nodes and conversions/edges in a graph.

2. **Choose the right shortest path algorithm**:
   - Dijkstra/Bellman-Ford for single-source
   - Floyd-Warshall for all-pairs with small number of nodes (≤ 100)
   - BFS for unweighted graphs

3. **Small node count enables brute-force on graph**: With only 26 letters, O(26^3) Floyd-Warshall is fine. This is a common pattern—constraints often hint at the solution approach.

4. **Always handle multiple edges and self-loops**: Real-world graph problems often have multiple edges between same nodes—keep only the minimum cost edge.

Related problems: [Can Convert String in K Moves](/problem/can-convert-string-in-k-moves), [Minimum Moves to Convert String](/problem/minimum-moves-to-convert-string)
