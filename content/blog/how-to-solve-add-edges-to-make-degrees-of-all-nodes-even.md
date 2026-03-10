---
title: "How to Solve Add Edges to Make Degrees of All Nodes Even — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Add Edges to Make Degrees of All Nodes Even. Hard difficulty, 35.2% acceptance rate. Topics: Hash Table, Graph Theory."
date: "2029-10-09"
category: "dsa-patterns"
tags: ["add-edges-to-make-degrees-of-all-nodes-even", "hash-table", "graph-theory", "hard"]
---

# How to Solve "Add Edges to Make Degrees of All Nodes Even"

This problem asks us to determine whether we can add at most two edges to an undirected graph (which may be disconnected) so that every node ends up with an even degree. The tricky part is that we can't just add edges arbitrarily—we need to consider the graph's structure and the parity (odd/even) of each node's current degree. The core challenge is recognizing that this is fundamentally a parity problem, not a connectivity one.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `n = 5` and `edges = [[1,2],[2,3],[3,4],[4,5]]`. This creates a path: 1-2-3-4-5.

First, let's calculate the degree of each node:

- Node 1: degree 1 (connected to 2) → **odd**
- Node 2: degree 2 (connected to 1 and 3) → **even**
- Node 3: degree 2 (connected to 2 and 4) → **even**
- Node 4: degree 2 (connected to 3 and 5) → **even**
- Node 5: degree 1 (connected to 4) → **odd**

We have 2 nodes with odd degree (nodes 1 and 5). In graph theory, we know that in any graph, the number of nodes with odd degree must be even. Here, we have 2 odd-degree nodes, which is already even, but we need ALL nodes to have even degree.

**Key insight**: Adding an edge between two nodes increases both their degrees by 1. This flips their parity (odd becomes even, even becomes odd). So if we add an edge between two odd-degree nodes, both become even—perfect! If we add an edge between two even-degree nodes, both become odd—not helpful. If we add between odd and even, the odd becomes even but the even becomes odd—we just move the oddness.

In our example, we have 2 odd nodes. We can add one edge between nodes 1 and 5:

- Node 1: degree increases from 1 to 2 → **even**
- Node 5: degree increases from 1 to 2 → **even**

Now all nodes have even degree! We used 1 edge, which is ≤ 2, so the answer is `true`.

What if we had 4 odd nodes? We could pair them up with 2 edges. What if we have 6 odd nodes? We'd need 3 edges, which exceeds our limit of 2. So the number of odd nodes must be 0, 2, or 4 for this to be possible with ≤ 2 edges.

But wait—there's another complication. We can't just add any edge between odd nodes. The edge must not already exist! In our example, edge (1,5) didn't exist, so it was valid. If it had existed, we couldn't add it again (no parallel edges in simple graphs).

Let's test a case where we need to be clever. Suppose `n = 4`, `edges = [[1,2],[2,3],[3,4],[4,1]]` (a cycle). All nodes have degree 2 (even). No edges needed! Number of odd nodes = 0 → answer is `true`.

Now a tricky case: `n = 4`, `edges = [[1,2],[2,3],[3,4]]` (a path). Odd nodes: 1 and 4 (2 nodes). Can we add edge (1,4)? Yes, it doesn't exist. So answer is `true`.

What if `n = 4`, `edges = [[1,2],[2,3],[3,4],[1,4]]`? This is a cycle plus the diagonal. All nodes have degree 3 (odd). Odd nodes: 1,2,3,4 (4 nodes). We need to pair them with 2 edges. Can we add (1,2)? No, it exists. (1,3)? Doesn't exist. (2,4)? Doesn't exist. So we could add (1,3) and (2,4). But wait—does adding (1,3) affect whether we can add (2,4)? No, edges are independent. So answer is `true`.

The hardest case is when we have 2 odd nodes but the edge between them already exists. Then we need to find an intermediate node to create a "path" of two new edges. For example, if odd nodes are 1 and 2, and edge (1,2) exists, we could add edges (1,x) and (x,2) for some node x. This increases degree of 1 and 2 by 1 (making them even) and increases degree of x by 2 (keeping its parity unchanged if it was even, or making it odd→odd if it was odd—wait, that's a problem!).

Actually, let's think carefully: If x was even, adding two edges to it increases degree by 2, so it stays even—good! If x was odd, adding two edges increases degree by 2, so it stays odd—bad, we'd create a new odd node. So x must have even degree initially.

Also, edges (1,x) and (x,2) must not already exist. And x must be different from 1 and 2, obviously.

## Brute Force Approach

A naive approach might try all possible edge additions:

1. Count odd-degree nodes
2. If count is 0: return true (no edges needed)
3. If count is 2: try adding edge between the two odd nodes if it doesn't exist
4. If count is 4: try all ways to pair the 4 odd nodes with 2 edges, checking if edges don't exist
5. If count is 6 or more: return false (need ≥3 edges)

But there's a subtlety: when count=2 and the direct edge exists, we need to check if there exists a node x with even degree such that edges (odd1,x) and (x,odd2) don't exist. A brute force would check all n nodes.

For count=4, we need to check if we can pair the 4 odd nodes into 2 pairs such that for each pair, either the direct edge doesn't exist, OR there exists a common even-degree node that can serve as intermediate.

The brute force becomes messy quickly. Checking all possible pairings for 4 nodes (3 pairings) and for each checking intermediate nodes would be O(n³) in worst case. We need a more systematic approach.

## Optimized Approach

The key insight is that this is a parity problem with constraints on edge existence. Let's break it down:

1. **Count odd-degree nodes**: Let `odd_count` be the number of nodes with odd degree.
   - If `odd_count > 4`: return false (need ≥3 edges)
   - If `odd_count = 0`: return true
   - If `odd_count = 2`: We have two odd nodes u and v
     - If edge (u,v) doesn't exist: return true (add this edge)
     - If edge (u,v) exists: We need to find a node x (≠ u,v) with even degree such that edges (u,x) and (x,v) don't exist. If such x exists: return true
   - If `odd_count = 4`: Let the odd nodes be a,b,c,d. We need to check if we can partition them into two pairs such that for each pair, we can add either a direct edge or a 2-edge path through an even node.

2. **Efficient existence checks**: We need O(1) checks for whether an edge exists. Store edges in a hash set.

3. **Finding intermediate node for 2 odd nodes**: When the direct edge between two odd nodes exists, we need to find an even-degree node x such that (u,x) and (x,v) don't exist. We can iterate through all even-degree nodes (at most n) and check.

4. **Handling 4 odd nodes**: There are only 3 ways to pair 4 nodes: (a,b)+(c,d), (a,c)+(b,d), (a,d)+(b,c). For each pairing, check if both pairs are "good":
   - A pair (u,v) is "good" if either:
     - Edge (u,v) doesn't exist, OR
     - There exists an even node x with (u,x) and (x,v) not existing

The optimization comes from:

- Early returns when `odd_count > 4`
- Using hash set for O(1) edge existence checks
- Only checking even-degree nodes as intermediates (odd nodes would remain odd after adding 2 edges to them)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n + m) where n = number of nodes, m = number of edges
def isPossible(n, edges):
    """
    Determine if we can add at most 2 edges to make all nodes have even degree.

    Args:
        n: number of nodes (1-indexed)
        edges: list of [u, v] pairs representing existing edges

    Returns:
        True if possible, False otherwise
    """
    from collections import defaultdict

    # Step 1: Build adjacency list and degree count
    degree = [0] * (n + 1)  # 1-indexed
    edge_set = set()  # For O(1) edge existence checks

    for u, v in edges:
        degree[u] += 1
        degree[v] += 1
        # Store edges in both directions for undirected graph
        edge_set.add((min(u, v), max(u, v)))

    # Step 2: Find all nodes with odd degree
    odd_nodes = []
    for i in range(1, n + 1):
        if degree[i] % 2 == 1:
            odd_nodes.append(i)

    odd_count = len(odd_nodes)

    # Step 3: Check impossible cases
    if odd_count > 4:
        return False
    if odd_count == 0:
        return True

    # Helper function to check if edge exists
    def edge_exists(u, v):
        return (min(u, v), max(u, v)) in edge_set

    # Helper function to check if we can connect two nodes
    def can_connect(u, v):
        # Case 1: Direct edge doesn't exist
        if not edge_exists(u, v):
            return True

        # Case 2: Find an intermediate even-degree node
        # We need x != u,v with even degree, and edges (u,x), (x,v) don't exist
        for x in range(1, n + 1):
            if x == u or x == v:
                continue
            if degree[x] % 2 == 0 and not edge_exists(u, x) and not edge_exists(x, v):
                return True

        return False

    # Step 4: Handle 2 odd nodes case
    if odd_count == 2:
        u, v = odd_nodes[0], odd_nodes[1]
        return can_connect(u, v)

    # Step 5: Handle 4 odd nodes case
    # There are 3 possible pairings of 4 nodes
    a, b, c, d = odd_nodes[0], odd_nodes[1], odd_nodes[2], odd_nodes[3]

    # Check all 3 pairings
    # Pairing 1: (a,b) and (c,d)
    if can_connect(a, b) and can_connect(c, d):
        return True

    # Pairing 2: (a,c) and (b,d)
    if can_connect(a, c) and can_connect(b, d):
        return True

    # Pairing 3: (a,d) and (b,c)
    if can_connect(a, d) and can_connect(b, c):
        return True

    return False
```

```javascript
// Time: O(n) | Space: O(n + m) where n = number of nodes, m = number of edges
function isPossible(n, edges) {
  // Step 1: Build degree array and edge set
  const degree = new Array(n + 1).fill(0); // 1-indexed
  const edgeSet = new Set(); // For O(1) edge existence checks

  for (const [u, v] of edges) {
    degree[u]++;
    degree[v]++;
    // Store edges in canonical form (smaller first) for undirected graph
    edgeSet.add(`${Math.min(u, v)},${Math.max(u, v)}`);
  }

  // Step 2: Find all nodes with odd degree
  const oddNodes = [];
  for (let i = 1; i <= n; i++) {
    if (degree[i] % 2 === 1) {
      oddNodes.push(i);
    }
  }

  const oddCount = oddNodes.length;

  // Step 3: Check impossible cases
  if (oddCount > 4) return false;
  if (oddCount === 0) return true;

  // Helper function to check if edge exists
  const edgeExists = (u, v) => {
    return edgeSet.has(`${Math.min(u, v)},${Math.max(u, v)}`);
  };

  // Helper function to check if we can connect two nodes
  const canConnect = (u, v) => {
    // Case 1: Direct edge doesn't exist
    if (!edgeExists(u, v)) {
      return true;
    }

    // Case 2: Find an intermediate even-degree node
    // We need x != u,v with even degree, and edges (u,x), (x,v) don't exist
    for (let x = 1; x <= n; x++) {
      if (x === u || x === v) continue;
      if (degree[x] % 2 === 0 && !edgeExists(u, x) && !edgeExists(x, v)) {
        return true;
      }
    }

    return false;
  };

  // Step 4: Handle 2 odd nodes case
  if (oddCount === 2) {
    const [u, v] = oddNodes;
    return canConnect(u, v);
  }

  // Step 5: Handle 4 odd nodes case
  // There are 3 possible pairings of 4 nodes
  const [a, b, c, d] = oddNodes;

  // Check all 3 pairings
  // Pairing 1: (a,b) and (c,d)
  if (canConnect(a, b) && canConnect(c, d)) {
    return true;
  }

  // Pairing 2: (a,c) and (b,d)
  if (canConnect(a, c) && canConnect(b, d)) {
    return true;
  }

  // Pairing 3: (a,d) and (b,c)
  if (canConnect(a, d) && canConnect(b, c)) {
    return true;
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(n + m) where n = number of nodes, m = number of edges
import java.util.*;

class Solution {
    public boolean isPossible(int n, List<List<Integer>> edges) {
        // Step 1: Build degree array and edge set
        int[] degree = new int[n + 1]; // 1-indexed
        Set<String> edgeSet = new HashSet<>(); // For O(1) edge existence checks

        for (List<Integer> edge : edges) {
            int u = edge.get(0);
            int v = edge.get(1);
            degree[u]++;
            degree[v]++;
            // Store edges in canonical form (smaller first) for undirected graph
            edgeSet.add(Math.min(u, v) + "," + Math.max(u, v));
        }

        // Step 2: Find all nodes with odd degree
        List<Integer> oddNodes = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (degree[i] % 2 == 1) {
                oddNodes.add(i);
            }
        }

        int oddCount = oddNodes.size();

        // Step 3: Check impossible cases
        if (oddCount > 4) return false;
        if (oddCount == 0) return true;

        // Helper function to check if edge exists
        java.util.function.BiFunction<Integer, Integer, Boolean> edgeExists = (u, v) -> {
            return edgeSet.contains(Math.min(u, v) + "," + Math.max(u, v));
        };

        // Helper function to check if we can connect two nodes
        java.util.function.BiFunction<Integer, Integer, Boolean> canConnect = (u, v) -> {
            // Case 1: Direct edge doesn't exist
            if (!edgeExists.apply(u, v)) {
                return true;
            }

            // Case 2: Find an intermediate even-degree node
            // We need x != u,v with even degree, and edges (u,x), (x,v) don't exist
            for (int x = 1; x <= n; x++) {
                if (x == u || x == v) continue;
                if (degree[x] % 2 == 0 && !edgeExists.apply(u, x) && !edgeExists.apply(x, v)) {
                    return true;
                }
            }

            return false;
        };

        // Step 4: Handle 2 odd nodes case
        if (oddCount == 2) {
            int u = oddNodes.get(0);
            int v = oddNodes.get(1);
            return canConnect.apply(u, v);
        }

        // Step 5: Handle 4 odd nodes case
        // There are 3 possible pairings of 4 nodes
        int a = oddNodes.get(0);
        int b = oddNodes.get(1);
        int c = oddNodes.get(2);
        int d = oddNodes.get(3);

        // Check all 3 pairings
        // Pairing 1: (a,b) and (c,d)
        if (canConnect.apply(a, b) && canConnect.apply(c, d)) {
            return true;
        }

        // Pairing 2: (a,c) and (b,d)
        if (canConnect.apply(a, c) && canConnect.apply(b, d)) {
            return true;
        }

        // Pairing 3: (a,d) and (b,c)
        if (canConnect.apply(a, d) && canConnect.apply(b, c)) {
            return true;
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n + m)

- Building degree array and edge set: O(m) where m is number of edges
- Finding odd nodes: O(n)
- For 2 odd nodes case: In worst case, we check all n nodes as potential intermediates → O(n)
- For 4 odd nodes case: We check 3 pairings, each calling `canConnect` twice. Each `canConnect` call is O(n) in worst case. So O(3 × 2 × n) = O(n)
- Overall: O(n + m + n) = O(n + m)

**Space Complexity**: O(n + m)

- Degree array: O(n)
- Edge set: O(m) to store all edges
- Odd nodes list: O(n) in worst case (but at most 4 in our algorithm after early check)
- Overall: O(n + m)

## Common Mistakes

1. **Forgetting to check if the direct edge already exists**: Candidates might think "if we have 2 odd nodes, just add an edge between them" without checking if that edge already exists. This would attempt to add a duplicate edge, which isn't allowed in simple graphs.

2. **Using the wrong intermediate node**: When the direct edge exists between two odd nodes, we need an intermediate node with **even** degree. Some candidates check all nodes, including odd-degree ones. Adding two edges to an odd node increases its degree by 2, so odd→odd (still odd!), creating a new problem.

3. **Not considering all pairings for 4 odd nodes**: With 4 odd nodes, there are 3 ways to pair them up. Candidates might only check one pairing and return false prematurely. We must check all 3: (1,2)+(3,4), (1,3)+(2,4), and (1,4)+(2,3).

4. **Off-by-one errors with 1-indexing**: The problem states nodes are numbered 1 to n, but arrays in most languages are 0-indexed. Forgetting to allocate size n+1 for degree arrays is a common mistake.

## When You'll See This Pattern

This problem combines **graph degree parity** with **constraint satisfaction**. Similar patterns appear in:

1. **Minimum Degree of a Connected Trio in a Graph (LeetCode 1761)**: Also involves analyzing degrees in graphs, though for trios rather than overall parity.

2. **Possible Bipartition (LeetCode 886)**: Another graph problem where constraints determine feasibility, though it uses graph coloring rather than degree parity.

3. **Course Schedule (LeetCode 207)**: While about directed graphs and cycles, it shares the pattern of determining feasibility given constraints on graph modifications.

The core technique of analyzing parity and using intermediate nodes to work around constraints appears in many graph theory problems, especially those about Eulerian paths (which require 0 or 2 odd-degree nodes).

## Key Takeaways

1. **Graph parity is powerful**: The number of odd-degree nodes in any graph is always even. This fundamental theorem simplifies many graph problems.

2. **Edge addition changes parity systematically**: Adding an edge flips the parity of both endpoints. This means adding edges between odd nodes fixes both, while adding between even nodes creates two new problems.

3. **When direct connection fails, look for intermediates**: If you can't directly connect two nodes, check if there's a third node that can serve as an intermediate. This "two-hop" thinking is useful in many graph problems.

4. **Constraint checking needs efficient data structures**: Using a hash set for O(1) edge existence checks is crucial for efficiency. Without it, we'd need O(m) checks per edge existence query.

Related problems: [Minimum Degree of a Connected Trio in a Graph](/problem/minimum-degree-of-a-connected-trio-in-a-graph)
