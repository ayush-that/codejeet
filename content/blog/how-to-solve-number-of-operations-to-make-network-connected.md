---
title: "How to Solve Number of Operations to Make Network Connected — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Operations to Make Network Connected. Medium difficulty, 66.2% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-10-05"
category: "dsa-patterns"
tags:
  [
    "number-of-operations-to-make-network-connected",
    "depth-first-search",
    "breadth-first-search",
    "union-find",
    "medium",
  ]
---

# How to Solve Number of Operations to Make Network Connected

You have `n` computers and a list of cable connections between them. Your goal is to make the entire network connected (every computer can reach every other computer) by moving existing cables. The challenge is determining whether it's even possible, and if so, calculating the minimum number of cable moves required. This problem is interesting because it combines graph connectivity theory with practical resource constraints—you can't create new cables, only reposition existing ones.

## Visual Walkthrough

Let's walk through an example: `n = 6` computers with connections `[[0,1], [0,2], [0,3], [1,2], [1,3]]`

**Step 1: Visualize the current network**

- Computer 0 connects to 1, 2, and 3
- Computer 1 also connects to 2 and 3
- Computers 4 and 5 have no connections at all

We have one connected component containing computers {0, 1, 2, 3} and two isolated computers {4} and {5}.

**Step 2: Count available spare cables**
In any connected component with `k` computers, you need at least `k-1` cables to connect them. Our main component has 4 computers but 5 cables—that's 1 extra cable we can repurpose.

**Step 3: Count disconnected components**
We have 3 total components: {0,1,2,3}, {4}, and {5}. To connect `c` components, you need `c-1` cables.

**Step 4: Check feasibility and calculate moves**
We need `3-1 = 2` cables to connect all components. We have 1 spare cable available. Since 1 < 2, it's impossible to connect the network.

**Key insight:** The problem reduces to counting connected components and comparing available spare cables to the number needed.

## Brute Force Approach

A naive approach might try to simulate all possible cable moves. You could:

1. Generate all possible new connections from existing cables
2. Try every combination of moves
3. Check if the network becomes connected after each attempt

This would be computationally infeasible even for moderate `n`. For `n=100`, there are potentially thousands of cables and billions of possible move combinations. The brute force fails because it doesn't recognize the underlying graph theory principles.

## Optimized Approach

The optimal solution uses **Union-Find (Disjoint Set Union)** or **DFS/BFS** to solve this in linear time. Here's the step-by-step reasoning:

1. **Check the basic requirement**: You need at least `n-1` cables to connect `n` computers. If you have fewer than `n-1` connections, return `-1` immediately.

2. **Count connected components**: Use Union-Find to group computers into connected components. Each union operation merges two computers that are directly connected.

3. **Calculate spare cables**: In a component with `k` computers, if it has more than `k-1` cables, the extras are "spare." However, we can track this more efficiently: each connection that joins two already-connected computers is a spare cable.

4. **Calculate needed cables**: If you have `c` connected components, you need `c-1` cables to connect them all together.

5. **Compare and return**: If spare cables ≥ needed cables, return `c-1`. Otherwise, return `-1`.

The Union-Find approach is elegant because it simultaneously tracks components and detects spare cables: whenever we try to union two nodes that already have the same root, we've found a redundant connection.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + α(n)*m) where m = len(connections), α is inverse Ackermann (effectively constant)
# Space: O(n) for parent and rank arrays
class Solution:
    def makeConnected(self, n: int, connections: List[List[int]]) -> int:
        # Edge case: Not enough cables to connect all computers
        # To connect n computers, you need at least n-1 cables
        if len(connections) < n - 1:
            return -1

        # Initialize Union-Find data structure
        parent = list(range(n))  # Each computer is its own parent initially
        rank = [0] * n  # Used for union by rank optimization

        # Helper function to find root with path compression
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]

        # Helper function to union two sets
        def union(x, y):
            root_x = find(x)
            root_y = find(y)

            # If already connected, this is a redundant cable
            if root_x == root_y:
                return 1  # Return 1 to count as spare cable

            # Union by rank: attach smaller tree under larger tree
            if rank[root_x] < rank[root_y]:
                parent[root_x] = root_y
            elif rank[root_x] > rank[root_y]:
                parent[root_y] = root_x
            else:
                parent[root_y] = root_x
                rank[root_x] += 1

            return 0  # No spare cable used

        # Count redundant connections (spare cables)
        spare_cables = 0
        for a, b in connections:
            spare_cables += union(a, b)

        # Count number of connected components
        # Each computer with parent[i] == i is a root of a component
        components = sum(1 for i in range(n) if parent[i] == i)

        # Need (components - 1) cables to connect all components
        needed_cables = components - 1

        # Check if we have enough spare cables
        return needed_cables if spare_cables >= needed_cables else -1
```

```javascript
// Time: O(n + α(n)*m) where m = connections.length, α is inverse Ackermann
// Space: O(n) for parent and rank arrays
function makeConnected(n, connections) {
  // Edge case: Not enough cables to connect all computers
  if (connections.length < n - 1) {
    return -1;
  }

  // Initialize Union-Find data structure
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  // Find with path compression
  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  };

  // Union with rank optimization
  const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);

    // If already connected, this cable is redundant
    if (rootX === rootY) {
      return 1; // Count as spare cable
    }

    // Union by rank
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }

    return 0; // No spare cable
  };

  // Count spare cables
  let spareCables = 0;
  for (const [a, b] of connections) {
    spareCables += union(a, b);
  }

  // Count connected components
  let components = 0;
  for (let i = 0; i < n; i++) {
    if (parent[i] === i) {
      components++;
    }
  }

  // Calculate needed cables and check if possible
  const neededCables = components - 1;
  return spareCables >= neededCables ? neededCables : -1;
}
```

```java
// Time: O(n + α(n)*m) where m = connections.length, α is inverse Ackermann
// Space: O(n) for parent and rank arrays
class Solution {
    public int makeConnected(int n, int[][] connections) {
        // Edge case: Not enough cables to connect all computers
        if (connections.length < n - 1) {
            return -1;
        }

        // Initialize Union-Find
        int[] parent = new int[n];
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }

        // Find with path compression
        private int find(int x, int[] parent) {
            if (parent[x] != x) {
                parent[x] = find(parent[x], parent);
            }
            return parent[x];
        }

        // Union with rank optimization
        private int union(int x, int y, int[] parent, int[] rank) {
            int rootX = find(x, parent);
            int rootY = find(y, parent);

            // If already connected, cable is redundant
            if (rootX == rootY) {
                return 1; // Spare cable
            }

            // Union by rank
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }

            return 0; // No spare cable
        }

        // Count spare cables
        int spareCables = 0;
        for (int[] conn : connections) {
            spareCables += union(conn[0], conn[1], parent, rank);
        }

        // Count connected components
        int components = 0;
        for (int i = 0; i < n; i++) {
            if (parent[i] == i) {
                components++;
            }
        }

        // Check if we have enough spare cables
        int neededCables = components - 1;
        return spareCables >= neededCables ? neededCables : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m·α(n)) where n is number of computers, m is number of connections, and α is the inverse Ackermann function (effectively constant for all practical inputs). The Union-Find operations with path compression and union by rank are amortized O(α(n)), and we perform m union operations plus n find operations when counting components.

**Space Complexity:** O(n) for storing the parent and rank arrays in Union-Find. We don't use additional space proportional to m since we process connections one at a time.

## Common Mistakes

1. **Forgetting the initial cable count check**: Many candidates jump straight into counting components without checking if `len(connections) < n-1`. This is a necessary condition—you can't connect n computers with fewer than n-1 cables.

2. **Incorrect spare cable counting**: Some try to count spare cables by comparing total cables to `n-1`, but this doesn't account for cables within components. The correct approach is counting redundant connections during union operations.

3. **Off-by-one errors in component counting**: Remember: if you have c components, you need c-1 cables to connect them. Some candidates return c instead of c-1.

4. **Using DFS/BFS without tracking spare cables**: While DFS/BFS can count components, tracking spare cables requires additional logic. Union-Find naturally handles both in one pass.

## When You'll See This Pattern

This problem uses **Union-Find for connectivity and cycle detection**, a pattern that appears in many graph problems:

1. **Number of Provinces (LeetCode 547)**: Similar component counting without the cable constraint.
2. **Redundant Connection (LeetCode 684)**: Directly uses Union-Find to detect cycles in a graph.
3. **Accounts Merge (LeetCode 721)**: Uses Union-Find to merge accounts based on shared emails.
4. **Minimum Cost to Connect All Points (LeetCode 1584)**: Uses Union-Find in Kruskal's algorithm for Minimum Spanning Tree.

The key insight is that Union-Find excels at dynamically tracking connectivity and detecting when elements are already connected.

## Key Takeaways

1. **Minimum cables = n-1 rule**: For any connected graph with n nodes, you need at least n-1 edges. This provides an immediate impossibility check.

2. **Union-Find for dual tracking**: Union-Find can simultaneously count connected components and detect redundant edges (cycles) in a single pass through the edges.

3. **Component connection formula**: To connect c disconnected components, you need exactly c-1 edges. This applies to many connectivity problems beyond just computer networks.

[Practice this problem on CodeJeet](/problem/number-of-operations-to-make-network-connected)
