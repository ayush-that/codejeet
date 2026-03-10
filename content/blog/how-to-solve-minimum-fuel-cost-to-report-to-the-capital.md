---
title: "How to Solve Minimum Fuel Cost to Report to the Capital — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Fuel Cost to Report to the Capital. Medium difficulty, 64.9% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-09-14"
category: "dsa-patterns"
tags:
  [
    "minimum-fuel-cost-to-report-to-the-capital",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Minimum Fuel Cost to Report to the Capital

You're given a tree-structured country network where each city needs to send representatives to the capital (city 0). Each car can carry up to `seats` people, and you need to calculate the minimum total fuel cost for all representatives to reach the capital. The tricky part is that representatives can carpool—they can meet at intermediate cities and share rides—which dramatically affects how you calculate the total fuel consumption.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

- n = 4 cities (0, 1, 2, 3)
- roads = [[0,1], [1,2], [1,3]] (forming a tree with 0 as root)
- seats = 2
- Each city has 1 representative (default)

The tree looks like this:

```
    0
    |
    1
   / \
  2   3
```

**Step 1: Representatives from leaves travel to parent**

- City 2 has 1 rep → needs 1 car to travel to city 1 (cost: 1 fuel)
- City 3 has 1 rep → needs 1 car to travel to city 1 (cost: 1 fuel)

**Step 2: Representatives at city 1**

- City 1 has its own 1 rep + 1 from city 2 + 1 from city 3 = 3 reps
- With seats = 2, they need ceil(3/2) = 2 cars to travel to city 0
- Distance from city 1 to 0 is 1 road → cost: 2 × 1 = 2 fuel

**Total fuel**: 1 + 1 + 2 = 4

The key insight: We need to process the tree from leaves upward (post-order traversal), accumulating representatives at each node and calculating how many cars are needed for the journey to the parent.

## Brute Force Approach

A naive approach might try to simulate all possible carpooling arrangements or use BFS/DFS without proper accumulation. For example:

1. For each city (except 0), find the path to the capital
2. For each representative, travel along their path independently
3. Try to merge cars when paths overlap

This becomes exponentially complex because:

- You'd need to track which representatives are at which cities at each step
- The number of possible carpooling combinations grows factorially
- You'd essentially be solving a complex scheduling problem

Even a simpler brute force that doesn't consider carpooling would give wrong answers. If we just calculated the shortest path for each representative independently:

- City 2 → 0: distance 2, cost 2
- City 3 → 0: distance 2, cost 2
- City 1 → 0: distance 1, cost 1
- Total = 5 (but optimal with carpooling is 4)

So we can't treat representatives independently—we must consider how they can share rides along common paths.

## Optimized Approach

The optimal solution uses **post-order DFS traversal** with careful accumulation:

**Key Insight 1**: Fuel cost is calculated per edge, not per city

- When `x` representatives cross a road, they need ceil(x/seats) cars
- Each car consumes 1 fuel per road crossed
- So fuel for that road = ceil(x/seats)

**Key Insight 2**: Representatives accumulate as they move toward the capital

- At each node, we sum all representatives from its subtree
- Add 1 for the representative from the node itself
- This total represents how many people need to travel from this node to its parent

**Key Insight 3**: Process from leaves to root (post-order)

- We need child counts before we can compute parent needs
- This is naturally achieved with DFS that processes children first

**Algorithm Steps**:

1. Build adjacency list from the roads (undirected graph)
2. Perform DFS from node 0, treating it as the root
3. For each node:
   - Initialize total representatives at this node as 1 (its own rep)
   - For each child (neighbor except parent):
     - Recursively get representatives from child's subtree
     - Add to this node's total
     - Calculate cars needed = ceil(child_reps / seats)
     - Add to total fuel: cars × 1 (since distance to parent is 1)
4. Return total fuel

**Why this works**: By processing bottom-up, we ensure that when we calculate fuel for an edge, we know exactly how many representatives will cross it. The ceil(child_reps/seats) calculation optimally packs representatives into cars.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of cities
# Space: O(n) for adjacency list and recursion stack
class Solution:
    def minimumFuelCost(self, roads: List[List[int]], seats: int) -> int:
        # Step 1: Build adjacency list for the tree
        # Since it's a tree with n nodes and n-1 edges, we use list of lists
        n = len(roads) + 1
        adj = [[] for _ in range(n)]

        for a, b in roads:
            adj[a].append(b)
            adj[b].append(a)

        # Total fuel cost that we'll accumulate
        total_fuel = 0

        # Step 2: DFS function that returns number of representatives
        # in the subtree rooted at 'node'
        def dfs(node: int, parent: int) -> int:
            nonlocal total_fuel

            # Start with 1 representative from this city itself
            reps_in_subtree = 1

            # Step 3: Process all neighbors except parent
            for neighbor in adj[node]:
                if neighbor == parent:
                    continue  # Skip the edge back to parent

                # Recursively get representatives from child's subtree
                child_reps = dfs(neighbor, node)

                # Add child's representatives to this node's total
                reps_in_subtree += child_reps

                # Step 4: Calculate fuel needed for these representatives
                # to travel from child to current node
                # ceil(child_reps / seats) = (child_reps + seats - 1) // seats
                cars_needed = (child_reps + seats - 1) // seats

                # Each car consumes 1 fuel to cross this edge
                total_fuel += cars_needed

            # Return total representatives in this subtree
            return reps_in_subtree

        # Step 5: Start DFS from capital (node 0) with no parent
        dfs(0, -1)

        # Note: We don't count fuel for representatives already at capital (node 0)
        # because they don't need to travel anywhere
        return total_fuel
```

```javascript
// Time: O(n) where n is number of cities
// Space: O(n) for adjacency list and recursion stack
/**
 * @param {number[][]} roads
 * @param {number} seats
 * @return {number}
 */
var minimumFuelCost = function (roads, seats) {
  // Step 1: Build adjacency list
  const n = roads.length + 1;
  const adj = Array.from({ length: n }, () => []);

  for (const [a, b] of roads) {
    adj[a].push(b);
    adj[b].push(a);
  }

  let totalFuel = 0;

  // Step 2: DFS function
  const dfs = (node, parent) => {
    // Start with 1 representative from this city
    let repsInSubtree = 1;

    // Step 3: Process all neighbors except parent
    for (const neighbor of adj[node]) {
      if (neighbor === parent) continue;

      // Get representatives from child's subtree
      const childReps = dfs(neighbor, node);

      // Add child's representatives to total
      repsInSubtree += childReps;

      // Step 4: Calculate fuel for this edge
      // Math.ceil(childReps / seats) = Math.floor((childReps + seats - 1) / seats)
      const carsNeeded = Math.floor((childReps + seats - 1) / seats);

      // Each car consumes 1 fuel
      totalFuel += carsNeeded;
    }

    return repsInSubtree;
  };

  // Step 5: Start DFS from capital
  dfs(0, -1);

  return totalFuel;
};
```

```java
// Time: O(n) where n is number of cities
// Space: O(n) for adjacency list and recursion stack
class Solution {
    private long totalFuel = 0;
    private List<Integer>[] adj;
    private int seats;

    public long minimumFuelCost(int[][] roads, int seats) {
        // Step 1: Build adjacency list
        int n = roads.length + 1;
        this.seats = seats;
        adj = new List[n];

        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }

        for (int[] road : roads) {
            int a = road[0];
            int b = road[1];
            adj[a].add(b);
            adj[b].add(a);
        }

        // Step 2: Start DFS from capital (node 0)
        dfs(0, -1);

        return totalFuel;
    }

    private int dfs(int node, int parent) {
        // Start with 1 representative from this city
        int repsInSubtree = 1;

        // Step 3: Process all neighbors except parent
        for (int neighbor : adj[node]) {
            if (neighbor == parent) continue;

            // Get representatives from child's subtree
            int childReps = dfs(neighbor, node);

            // Add child's representatives to total
            repsInSubtree += childReps;

            // Step 4: Calculate fuel for this edge
            // ceil(childReps / seats) = (childReps + seats - 1) / seats
            long carsNeeded = (childReps + seats - 1) / seats;

            // Each car consumes 1 fuel
            totalFuel += carsNeeded;
        }

        return repsInSubtree;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We build the adjacency list in O(n) time (n-1 edges)
- We perform a single DFS traversal visiting each node exactly once: O(n)
- At each node, we process all its edges, but each edge is processed exactly twice total (once from each endpoint), so total edge processing is O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity**: O(n)

- Adjacency list stores 2×(n-1) edges = O(n)
- Recursion stack depth in worst case (linear tree) is O(n)
- A few integer variables per recursive call = O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle the undirected nature of the tree**: When building the adjacency list, you must add edges in both directions. When doing DFS, you must pass and check the parent to avoid infinite recursion.

2. **Calculating fuel at the wrong place**: Some candidates try to calculate fuel when entering a node instead of when returning from a child. Fuel should be calculated for the edge between child and parent, which happens when we know how many representatives are in the child's subtree.

3. **Integer overflow with large n**: With n up to 10^5 and seats=1, total fuel can be up to ~n²/2 which exceeds 32-bit integer range. Always use 64-bit integers (long in Java, no issue in Python).

4. **Wrong ceil division**: Using `child_reps / seats` directly gives floating point or integer division. The correct formula is `(child_reps + seats - 1) // seats` for integer arithmetic.

## When You'll See This Pattern

This problem uses **post-order tree traversal with accumulation**, which appears in many tree problems:

1. **Binary Tree Postorder Traversal (Easy)** - The simplest form of processing children before parent. This problem extends that pattern with mathematical accumulation.

2. **Sum of Distances in Tree (Hard)** - Also uses tree DP with careful accumulation and propagation of counts. Both problems require thinking about contributions across edges.

3. **Count Nodes With the Highest Score (Medium)** - Requires calculating subtree sizes to compute scores, similar to how we calculate representatives in subtrees here.

The pattern is: when you need to compute something that depends on subtree information, use post-order DFS to process children first, accumulate results, then compute the parent's value.

## Key Takeaways

1. **Tree problems often require bottom-up processing**: When the answer depends on information from descendants, use post-order traversal (DFS processing children before parent).

2. **Count contributions per edge, not per node**: Many tree problems become simpler when you think about what happens across each edge rather than at each node. Here, fuel is consumed when crossing edges.

3. **Carpooling = ceil division**: The optimal packing of people into cars is simply the ceiling of (people / capacity). This applies to any partitioning problem with fixed-size containers.

Related problems: [Binary Tree Postorder Traversal](/problem/binary-tree-postorder-traversal)
