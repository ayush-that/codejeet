---
title: "How to Solve Find Number of Coins to Place in Tree Nodes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Number of Coins to Place in Tree Nodes. Hard difficulty, 37.3% acceptance rate. Topics: Dynamic Programming, Tree, Depth-First Search, Sorting, Heap (Priority Queue)."
date: "2026-04-29"
category: "dsa-patterns"
tags:
  [
    "find-number-of-coins-to-place-in-tree-nodes",
    "dynamic-programming",
    "tree",
    "depth-first-search",
    "hard",
  ]
---

# How to Solve Find Number of Coins to Place in Tree Nodes

You're given a tree where each node has a "cost" value, and you need to place coins on nodes so that each node ends up with exactly 1 coin. You can move coins between adjacent nodes, and the goal is to minimize the total number of moves (where moving one coin across one edge counts as one move). The challenge is that you need to handle the tree structure efficiently—a greedy local approach won't work because moving coins affects the entire subtree.

## Visual Walkthrough

Let's trace through a simple example to build intuition. Consider this tree:

- Nodes: 0 (root), 1, 2
- Edges: [[0,1], [0,2]]
- Cost: [0, 3, 0] (node 0 has 0 coins, node 1 has 3, node 2 has 0)

We need each node to end with exactly 1 coin. Let's think through what happens:

**Step 1: Look at leaf nodes first**

- Node 1 (leaf): Has 3 coins, needs 1. Excess = 3 - 1 = 2 coins to send up to parent (node 0)
- Node 2 (leaf): Has 0 coins, needs 1. Deficit = 1 - 0 = 1 coin needed from parent (node 0)

**Step 2: Process the root**

- Node 0: Starts with 0 coins, needs 1
- Receives 2 coins from node 1
- Sends 1 coin to node 2
- After transfers: Node 0 has 0 + 2 - 1 = 1 coin (perfect!)

**Step 3: Count moves**

- Moving 2 coins from node 1 to node 0: 2 moves
- Moving 1 coin from node 0 to node 2: 1 move
- Total: 3 moves

The key insight: We process from leaves upward (post-order traversal). For each node, we calculate its net coin balance after satisfying its children's needs. Any excess or deficit gets passed to the parent.

## Brute Force Approach

A naive approach might try to simulate all possible coin distributions, but that's exponential. Another brute force might try to process nodes in random order, adjusting locally:

1. Start with initial coin distribution
2. Repeatedly find nodes with excess coins and move them to neighboring nodes with deficits
3. Continue until all nodes have exactly 1 coin

This approach fails because:

- It doesn't guarantee minimal moves (local adjustments might create unnecessary back-and-forth)
- Could be O(n²) or worse in the worst case
- Doesn't leverage the tree structure efficiently

The tree structure is crucial: in a tree, there's exactly one path between any two nodes. This means we should process bottom-up, letting each subtree handle its internal coin balance before interacting with the rest of the tree.

## Optimized Approach

The optimal solution uses **post-order DFS with dynamic programming on trees**:

**Key Insight**: For each node, we only care about the net coin balance of its entire subtree. If a subtree has:

- More coins than nodes: It needs to send excess coins to the parent
- Fewer coins than nodes: It needs to receive coins from the parent
- Exactly as many coins as nodes: It's balanced internally

**Step-by-step reasoning**:

1. Perform DFS from the root (post-order traversal)
2. For each node:
   - Start with its initial coins
   - Process all children first (post-order ensures children are done)
   - For each child, add/subtract the child's net balance
   - The absolute value of a child's net balance represents moves needed between that child and current node
3. After processing children, the current node's net balance = (coins in subtree) - (nodes in subtree)
4. Pass this net balance up to the parent
5. The root's net balance should be 0 (total coins = total nodes)

**Why this works mathematically**:

- Each edge between parent and child will have |net_balance| coins moving across it
- These moves are unavoidable because the subtree must balance internally before interacting with the rest of the tree
- By processing bottom-up, we ensure each move is counted exactly once

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(n) for recursion stack and adjacency list
class Solution:
    def placeCoins(self, cost, edges):
        """
        Calculate minimum moves to make every node have exactly 1 coin.

        Args:
            cost: List[int] - initial coins on each node
            edges: List[List[int]] - tree edges

        Returns:
            int - minimum number of moves
        """
        n = len(cost)

        # Step 1: Build adjacency list for the tree
        # We need to represent the tree structure to traverse it
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Global variable to accumulate total moves
        # Using a list to allow modification in nested function
        total_moves = [0]

        # Step 3: DFS function with parent parameter to avoid cycles
        # Returns the net coin balance of the subtree rooted at 'node'
        def dfs(node, parent):
            # Start with this node's initial coins
            # net_balance = coins_in_subtree - nodes_in_subtree
            # Initially: this node contributes (cost[node] - 1)
            net_balance = cost[node] - 1

            # Process all neighbors (children in DFS tree)
            for neighbor in graph[node]:
                # Skip the parent to avoid going back up
                if neighbor == parent:
                    continue

                # Recursively process child subtree
                child_balance = dfs(neighbor, node)

                # Add child's balance to current node's balance
                net_balance += child_balance

                # The absolute value of child_balance represents
                # coins that must move between child and current node
                # Each coin moving across this edge counts as one move
                total_moves[0] += abs(child_balance)

            # Return the net balance for this subtree
            # Positive: subtree has excess coins to send up
            # Negative: subtree needs coins from parent
            # Zero: subtree is perfectly balanced
            return net_balance

        # Step 4: Start DFS from root (node 0) with no parent (-1)
        # The root should have net balance 0 (total coins = total nodes)
        dfs(0, -1)

        # Step 5: Return total moves accumulated during DFS
        return total_moves[0]
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(n) for recursion stack and adjacency list
/**
 * Calculate minimum moves to make every node have exactly 1 coin.
 * @param {number[]} cost - initial coins on each node
 * @param {number[][]} edges - tree edges
 * @return {number} - minimum number of moves
 */
function placeCoins(cost, edges) {
  const n = cost.length;

  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Variable to accumulate total moves
  let totalMoves = 0;

  // Step 3: DFS function with parent parameter to avoid cycles
  // Returns the net coin balance of the subtree rooted at 'node'
  const dfs = (node, parent) => {
    // Start with this node's initial coins
    // netBalance = coins_in_subtree - nodes_in_subtree
    // Initially: this node contributes (cost[node] - 1)
    let netBalance = cost[node] - 1;

    // Process all neighbors (children in DFS tree)
    for (const neighbor of graph[node]) {
      // Skip the parent to avoid going back up
      if (neighbor === parent) {
        continue;
      }

      // Recursively process child subtree
      const childBalance = dfs(neighbor, node);

      // Add child's balance to current node's balance
      netBalance += childBalance;

      // The absolute value of childBalance represents
      // coins that must move between child and current node
      // Each coin moving across this edge counts as one move
      totalMoves += Math.abs(childBalance);
    }

    // Return the net balance for this subtree
    // Positive: subtree has excess coins to send up
    // Negative: subtree needs coins from parent
    // Zero: subtree is perfectly balanced
    return netBalance;
  };

  // Step 4: Start DFS from root (node 0) with no parent (-1)
  // The root should have net balance 0 (total coins = total nodes)
  dfs(0, -1);

  // Step 5: Return total moves accumulated during DFS
  return totalMoves;
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(n) for recursion stack and adjacency list
class Solution {
    // Global variable to accumulate total moves
    private long totalMoves;

    public long placeCoins(int[] cost, int[][] edges) {
        int n = cost.length;

        // Step 1: Build adjacency list for the tree
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Initialize total moves
        totalMoves = 0;

        // Step 3: Start DFS from root (node 0) with no parent (-1)
        dfs(0, -1, cost, graph);

        // Step 4: Return total moves accumulated during DFS
        return totalMoves;
    }

    // DFS function returns the net coin balance of the subtree rooted at 'node'
    private long dfs(int node, int parent, int[] cost, List<Integer>[] graph) {
        // Start with this node's initial coins
        // netBalance = coins_in_subtree - nodes_in_subtree
        // Initially: this node contributes (cost[node] - 1)
        long netBalance = cost[node] - 1;

        // Process all neighbors (children in DFS tree)
        for (int neighbor : graph[node]) {
            // Skip the parent to avoid going back up
            if (neighbor == parent) {
                continue;
            }

            // Recursively process child subtree
            long childBalance = dfs(neighbor, node, cost, graph);

            // Add child's balance to current node's balance
            netBalance += childBalance;

            // The absolute value of childBalance represents
            // coins that must move between child and current node
            // Each coin moving across this edge counts as one move
            totalMoves += Math.abs(childBalance);
        }

        // Return the net balance for this subtree
        // Positive: subtree has excess coins to send up
        // Negative: subtree needs coins from parent
        // Zero: subtree is perfectly balanced
        return netBalance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We build the adjacency list: O(n) operations (n-1 edges)
- We perform a single DFS traversal visiting each node exactly once: O(n)
- At each node, we process all its edges, but each edge is processed exactly twice (once from each endpoint), so total edge processing is O(n)
- Overall: O(n) where n is the number of nodes

**Space Complexity: O(n)**

- Adjacency list stores 2\*(n-1) edges: O(n)
- Recursion stack depth in worst case (unbalanced tree) could be O(n)
- A few variables per recursive call: O(1) each, but O(n) total for the stack
- Overall: O(n)

## Common Mistakes

1. **Forgetting to handle the parent parameter in DFS**: Without tracking the parent, you'll get infinite recursion as the DFS goes back and forth between parent and child. Always include a `parent` parameter in tree DFS.

2. **Incorrect balance calculation**: The balance should be `coins - nodes`, not just coins. Each node needs exactly 1 coin, so we subtract 1 from each node's initial coins to get its contribution to the net balance.

3. **Using integer overflow**: The total moves can be large (up to n \* max_coins). Use `long` in Java/C++ to avoid overflow. Python handles big integers natively, but JavaScript needs `BigInt` for very large values (though LeetCode's constraints usually fit in 64-bit).

4. **Trying to optimize locally**: Some candidates try to match excess and deficit nodes greedily, but this doesn't work in a tree. The bottom-up approach is necessary because coins might need to travel through multiple nodes to reach their destination.

## When You'll See This Pattern

This pattern of **post-order DFS with subtree aggregation** appears in many tree DP problems:

1. **Distribute Coins in Binary Tree (LeetCode 979)** - Almost identical problem but for binary trees. The solution approach is exactly the same.

2. **Binary Tree Maximum Path Sum (LeetCode 124)** - Uses post-order traversal to compute subtree results and combine them.

3. **House Robber III (LeetCode 337)** - Tree DP where each node returns two values (with/without robbing) and parent combines children's results.

4. **Sum of Distances in Tree (LeetCode 834)** - Uses two DFS passes: one to compute subtree sizes, another to compute distances.

The core idea is always the same: process children first, compute some aggregate value for the subtree, then combine with parent. This "divide and conquer" on trees is extremely powerful.

## Key Takeaways

1. **Tree problems often require bottom-up processing**: When a problem involves aggregating information from leaves to root, post-order DFS is usually the right approach. Each subtree should solve its local problem before interacting with the rest of the tree.

2. **The absolute value trick for counting moves**: When you need to count transfers across edges in a tree, the sum of absolute values of subtree imbalances gives you the exact number of moves needed. This works because each coin must cross each edge on its path from source to destination.

3. **Tree DP state design**: For each node, think about what information its parent needs from it. Here, it's just the net coin balance. In other problems, it might be multiple values (like max path sum going up, max path sum within subtree, etc.).

Remember: In tree problems, the recursive structure is your friend. Let the recursion handle the complexity, and focus on defining what each recursive call should return.

Related problems: [Collect Coins in a Tree](/problem/collect-coins-in-a-tree), [Find the Maximum Sum of Node Values](/problem/find-the-maximum-sum-of-node-values)
