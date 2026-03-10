---
title: "How to Solve Most Profitable Path in a Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Profitable Path in a Tree. Medium difficulty, 67.3% acceptance rate. Topics: Array, Tree, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-04-19"
category: "dsa-patterns"
tags: ["most-profitable-path-in-a-tree", "array", "tree", "depth-first-search", "medium"]
---

# How to Solve Most Profitable Path in a Tree

You're given a tree with nodes labeled 0 to n-1, rooted at node 0, where each node has a gate with a certain amount. Bob starts at node 0 and moves toward a leaf node, while Alice starts at a given `bob` node and moves toward node 0. When Alice reaches a node before Bob, she closes the gate (you get 0 from it). When Bob reaches a node first or at the same time as Alice, the gate remains open (you get the full amount). Your goal is to find the maximum net income you can get by choosing an optimal leaf node path from node 0.

What makes this problem tricky is that you need to track two simultaneous traversals (Alice and Bob) through the tree, compare their arrival times at each node, and calculate the optimal path sum from the root to a leaf while accounting for gate closures. This requires careful tree traversal and path tracking.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 5
- edges = [[0,1],[1,2],[1,3],[3,4]]
- amount = [-2,4,2,-4,6]
- bob = 3

**Tree structure:**

```
      0 (-2)
      |
      1 (4)
     / \
  2 (2) 3 (-4)
          \
          4 (6)
```

**Step 1: Find Bob's path to root**
Bob starts at node 3 and moves toward node 0:

- Node 3 → Node 1 → Node 0

**Step 2: Determine arrival times**
Bob's arrival times (distance from bob to each node):

- Node 3: time = 0 (Bob starts here)
- Node 1: time = 1
- Node 0: time = 2

**Step 3: Calculate net income for each path from root to leaf**
We need to check all paths from node 0 to leaves (nodes 2 and 4):

**Path to leaf 2 (0→1→2):**

- Node 0: Alice arrives at time 0, Bob arrives at time 2 → Alice first → gate closed → income = 0
- Node 1: Alice arrives at time 1, Bob arrives at time 1 → same time → gate open → income = 4
- Node 2: Alice arrives at time 2, Bob never arrives → Alice first → gate closed → income = 0
- Total: 0 + 4 + 0 = 4

**Path to leaf 4 (0→1→3→4):**

- Node 0: Alice arrives at time 0, Bob arrives at time 2 → Alice first → gate closed → income = 0
- Node 1: Alice arrives at time 1, Bob arrives at time 1 → same time → gate open → income = 4
- Node 3: Alice arrives at time 2, Bob arrives at time 0 → Bob first → gate open → income = -4
- Node 4: Alice arrives at time 3, Bob never arrives → Alice first → gate closed → income = 0
- Total: 0 + 4 + (-4) + 0 = 0

Maximum net income = max(4, 0) = 4

## Brute Force Approach

A naive approach would be:

1. Find all paths from root (node 0) to all leaf nodes
2. For each path, simulate both Alice's and Bob's movements
3. Calculate the net income for that path by checking at each node who arrives first
4. Track the maximum net income across all paths

The problem with this approach is efficiency. Finding all root-to-leaf paths requires exploring the entire tree, which is O(n) for DFS. However, for each path, we'd need to recalculate Bob's arrival times or check against Bob's path, leading to redundant calculations. In the worst case with a skewed tree, there could be O(n) leaf nodes, and each path could be O(n) long, giving us O(n²) time complexity.

More importantly, this approach doesn't efficiently handle the comparison of arrival times. We need to know Bob's arrival time at each node to compare with Alice's arrival time as she traverses different paths.

## Optimized Approach

The key insight is that we can solve this problem in two phases:

**Phase 1: Find Bob's path and arrival times**

- Since Bob moves from his starting node toward the root (node 0), we need to find the path from bob to root
- We can use DFS to build parent relationships for all nodes, then trace back from bob to root
- Store Bob's arrival time at each node along this path

**Phase 2: Find optimal path from root to leaf**

- Perform DFS from root (node 0) to find all leaf nodes
- As we traverse, track:
  - Current net income (sum of gate amounts based on who arrives first)
  - Current time (Alice's arrival time at current node)
- At each node:
  - If Bob never visits this node (not on his path), Alice arrives first → income = 0
  - If Bob visits this node:
    - If Alice arrives first (current time < bobTime[node]) → income = 0
    - If Bob arrives first (current time > bobTime[node]) → income = amount[node]
    - If they arrive at same time → income = amount[node] / 2 (integer division)
- When we reach a leaf node, update the maximum net income

**Why this works:**

- We only need to calculate Bob's arrival times once (O(n))
- We traverse the tree once to find optimal path (O(n))
- Total time complexity: O(n)
- We use the tree structure and DFS to efficiently explore all paths without redundancy

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def mostProfitablePath(self, edges, bob, amount):
        n = len(edges) + 1  # n nodes, n-1 edges

        # Step 1: Build adjacency list for the tree
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Find parent of each node using DFS from root (0)
        parent = [-1] * n
        def dfs_find_parent(node, par):
            parent[node] = par
            for neighbor in graph[node]:
                if neighbor != par:  # Avoid going back to parent
                    dfs_find_parent(neighbor, node)

        dfs_find_parent(0, -1)  # Root has no parent

        # Step 3: Find Bob's path from bob to root and his arrival times
        bob_path = []
        curr = bob
        while curr != -1:
            bob_path.append(curr)
            curr = parent[curr]

        # Bob's arrival time at each node (only nodes on his path matter)
        bob_time = [float('inf')] * n
        for time, node in enumerate(bob_path):
            bob_time[node] = time

        # Step 4: DFS from root to find maximum net income to any leaf
        max_income = float('-inf')

        def dfs_calculate_income(node, par, time, current_income):
            nonlocal max_income

            # Calculate income for current node based on arrival times
            if time < bob_time[node]:
                # Alice arrives before Bob - gate is closed
                node_income = 0
            elif time == bob_time[node]:
                # Alice and Bob arrive at same time - split the amount
                node_income = amount[node] // 2
            else:
                # Bob arrives before Alice or never arrives - gate is open
                node_income = amount[node]

            current_income += node_income

            # Check if this is a leaf node (excluding root as special case)
            is_leaf = True
            for neighbor in graph[node]:
                if neighbor != par:  # Not the parent we came from
                    is_leaf = False
                    dfs_calculate_income(neighbor, node, time + 1, current_income)

            # If it's a leaf, update max income
            if is_leaf:
                max_income = max(max_income, current_income)

        # Start DFS from root (node 0) with time 0 and initial income 0
        dfs_calculate_income(0, -1, 0, 0)

        return max_income
```

```javascript
// Time: O(n) | Space: O(n)
var mostProfitablePath = function (edges, bob, amount) {
  const n = edges.length + 1;

  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Find parent of each node using DFS from root (0)
  const parent = new Array(n).fill(-1);

  function dfsFindParent(node, par) {
    parent[node] = par;
    for (const neighbor of graph[node]) {
      if (neighbor !== par) {
        // Avoid going back to parent
        dfsFindParent(neighbor, node);
      }
    }
  }

  dfsFindParent(0, -1); // Root has no parent

  // Step 3: Find Bob's path from bob to root and his arrival times
  const bobPath = [];
  let curr = bob;
  while (curr !== -1) {
    bobPath.push(curr);
    curr = parent[curr];
  }

  // Bob's arrival time at each node (only nodes on his path matter)
  const bobTime = new Array(n).fill(Infinity);
  for (let time = 0; time < bobPath.length; time++) {
    bobTime[bobPath[time]] = time;
  }

  // Step 4: DFS from root to find maximum net income to any leaf
  let maxIncome = -Infinity;

  function dfsCalculateIncome(node, par, time, currentIncome) {
    // Calculate income for current node based on arrival times
    let nodeIncome;
    if (time < bobTime[node]) {
      // Alice arrives before Bob - gate is closed
      nodeIncome = 0;
    } else if (time === bobTime[node]) {
      // Alice and Bob arrive at same time - split the amount
      nodeIncome = Math.floor(amount[node] / 2);
    } else {
      // Bob arrives before Alice or never arrives - gate is open
      nodeIncome = amount[node];
    }

    currentIncome += nodeIncome;

    // Check if this is a leaf node
    let isLeaf = true;
    for (const neighbor of graph[node]) {
      if (neighbor !== par) {
        // Not the parent we came from
        isLeaf = false;
        dfsCalculateIncome(neighbor, node, time + 1, currentIncome);
      }
    }

    // If it's a leaf, update max income
    if (isLeaf) {
      maxIncome = Math.max(maxIncome, currentIncome);
    }
  }

  // Start DFS from root (node 0) with time 0 and initial income 0
  dfsCalculateIncome(0, -1, 0, 0);

  return maxIncome;
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    private List<Integer>[] graph;
    private int[] parent;
    private int[] bobTime;
    private int[] amount;
    private int maxIncome;

    public int mostProfitablePath(int[][] edges, int bob, int[] amount) {
        int n = edges.length + 1;

        // Step 1: Build adjacency list for the tree
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Find parent of each node using DFS from root (0)
        parent = new int[n];
        Arrays.fill(parent, -1);
        dfsFindParent(0, -1);

        // Step 3: Find Bob's path from bob to root and his arrival times
        List<Integer> bobPath = new ArrayList<>();
        int curr = bob;
        while (curr != -1) {
            bobPath.add(curr);
            curr = parent[curr];
        }

        // Bob's arrival time at each node (only nodes on his path matter)
        bobTime = new int[n];
        Arrays.fill(bobTime, Integer.MAX_VALUE);
        for (int time = 0; time < bobPath.size(); time++) {
            bobTime[bobPath.get(time)] = time;
        }

        // Step 4: DFS from root to find maximum net income to any leaf
        this.amount = amount;
        maxIncome = Integer.MIN_VALUE;
        dfsCalculateIncome(0, -1, 0, 0);

        return maxIncome;
    }

    private void dfsFindParent(int node, int par) {
        parent[node] = par;
        for (int neighbor : graph[node]) {
            if (neighbor != par) {  // Avoid going back to parent
                dfsFindParent(neighbor, node);
            }
        }
    }

    private void dfsCalculateIncome(int node, int par, int time, int currentIncome) {
        // Calculate income for current node based on arrival times
        int nodeIncome;
        if (time < bobTime[node]) {
            // Alice arrives before Bob - gate is closed
            nodeIncome = 0;
        } else if (time == bobTime[node]) {
            // Alice and Bob arrive at same time - split the amount
            nodeIncome = amount[node] / 2;
        } else {
            // Bob arrives before Alice or never arrives - gate is open
            nodeIncome = amount[node];
        }

        currentIncome += nodeIncome;

        // Check if this is a leaf node
        boolean isLeaf = true;
        for (int neighbor : graph[node]) {
            if (neighbor != par) {  // Not the parent we came from
                isLeaf = false;
                dfsCalculateIncome(neighbor, node, time + 1, currentIncome);
            }
        }

        // If it's a leaf, update max income
        if (isLeaf) {
            maxIncome = Math.max(maxIncome, currentIncome);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list: O(n) where n is number of nodes
- First DFS to find parent relationships: O(n) since we visit each node once
- Constructing Bob's path: O(h) where h is height of tree, worst case O(n)
- Second DFS to calculate maximum income: O(n) since we visit each node once
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Adjacency list: O(n) to store all edges
- Parent array: O(n)
- Bob's time array: O(n)
- Recursion stack: O(h) where h is height of tree, worst case O(n) for skewed tree
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle the case when Alice and Bob arrive at the same time**: The problem states that when they arrive at the same time, the gate remains open, which means you get the full amount. Some candidates mistakenly give 0 or half the amount in this case.

2. **Incorrectly identifying leaf nodes**: A leaf node is any node with only one connection (except the root which could also have one connection). The common mistake is treating the root as a leaf when it's not, or missing leaf nodes in the middle of traversal.

3. **Not tracking Bob's arrival times efficiently**: Some candidates try to recalculate Bob's path for each DFS traversal, leading to O(n²) time complexity. The optimal solution calculates Bob's times once and reuses them.

4. **Integer division for split amounts**: When Alice and Bob arrive at the same time, you get amount[node] // 2 (integer division). Using regular division without flooring can give wrong results for odd numbers.

## When You'll See This Pattern

This problem combines tree traversal with path comparison and conditional summation. You'll see similar patterns in:

1. **Snakes and Ladders (Medium)**: While not a tree problem, it involves finding optimal paths with conditional movements, similar to how we optimize the path based on gate states.

2. **Time Taken to Mark All Nodes (Hard)**: Involves tracking time-based events on a tree and calculating optimal traversal, similar to tracking Alice and Bob's arrival times.

3. **Binary Tree Maximum Path Sum (Hard)**: Involves finding optimal paths in trees with conditional value accumulation, though it's simpler since it doesn't involve two simultaneous traversals.

4. **Sum of Distances in Tree (Hard)**: Involves calculating distances between nodes in a tree, similar to how we track Bob's path to the root.

## Key Takeaways

1. **Two-phase tree problems**: When a problem involves multiple agents or conditions on a tree, consider solving in phases - first gather all necessary information (like Bob's path), then perform the main computation.

2. **Path tracking in trees**: To track paths between nodes in an undirected tree, you can use DFS to build parent relationships, then trace back from target to source.

3. **Conditional accumulation during traversal**: When you need to accumulate values with conditions based on external factors (like another agent's position), calculate those conditions first and store them for efficient lookup during traversal.

Related problems: [Snakes and Ladders](/problem/snakes-and-ladders), [Time Taken to Mark All Nodes](/problem/time-taken-to-mark-all-nodes)
