---
title: "How to Solve Sum of Perfect Square Ancestors — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Perfect Square Ancestors. Hard difficulty, 42.5% acceptance rate. Topics: Array, Hash Table, Math, Tree, Depth-First Search."
date: "2026-07-23"
category: "dsa-patterns"
tags: ["sum-of-perfect-square-ancestors", "array", "hash-table", "math", "hard"]
---

# How to Solve Sum of Perfect Square Ancestors

This problem asks us to traverse a tree and, for each node, sum the values of all its ancestors whose values are perfect squares. The challenge comes from efficiently tracking ancestors while performing DFS traversal, and quickly determining perfect squares without expensive calculations at each step. What makes this interesting is that we need to maintain ancestor information in a way that allows O(1) perfect square checking while avoiding O(n²) ancestor traversal.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 5
- edges = [[0,1],[0,2],[1,3],[1,4]]
- nums = [4, 9, 2, 16, 25]

**Tree structure:**

```
        0 (4)
       / \
     1(9) 2(2)
    / \
  3(16) 4(25)
```

**Process:**

1. **Node 0 (value 4):** No ancestors, so sum = 0. 4 is a perfect square (2²), so we track it for descendants.

2. **Node 1 (value 9):** Ancestors: [0(4)]. Check ancestor 0: 4 is a perfect square, so add 4 to sum = 4. 9 is a perfect square (3²), so track it.

3. **Node 3 (value 16):** Ancestors: [0(4), 1(9)]. Check ancestor 0: 4 is perfect square → add 4. Check ancestor 1: 9 is perfect square → add 9. Total sum = 13. 16 is perfect square (4²), track it.

4. **Node 4 (value 25):** Ancestors: [0(4), 1(9)]. Add 4 + 9 = 13. 25 is perfect square (5²), track it.

5. **Node 2 (value 2):** Ancestors: [0(4)]. Add 4. 2 is NOT a perfect square.

**Result:** [0, 4, 13, 13, 4]

The key insight: we need to track perfect square ancestors as we traverse, not recompute them from scratch for each node.

## Brute Force Approach

A naive approach would be to first build the tree structure, then for each node:

1. Find all its ancestors by traversing up to the root
2. For each ancestor, check if its value is a perfect square
3. Sum all perfect square ancestor values

**Why this is inefficient:**

- Finding ancestors for each node requires O(h) time where h is the height
- In the worst case (a linked list tree), h = n, so this becomes O(n²)
- Perfect square checking for each ancestor adds additional computation
- Total time: O(n² \* √M) where M is the maximum number value

**What a naive candidate might try:**

- Building parent pointers and traversing up for each node
- Using BFS/DFS without tracking ancestor information
- Checking perfect squares with `sqrt()` and comparing with integer cast

The brute force fails because it doesn't leverage the tree traversal order to efficiently accumulate ancestor information.

## Optimized Approach

The key insight is to use **DFS with path tracking**. As we traverse the tree:

1. **Track perfect square ancestors during traversal:** Instead of finding ancestors for each node separately, maintain a running list (or sum) of perfect square ancestors as we go deeper.

2. **Efficient perfect square checking:** We can check if a number is a perfect square by comparing `int(sqrt(num))² == num`, but we need to do this efficiently. Better: precompute perfect squares up to max(nums) or use integer math.

3. **DFS traversal order:** Since we're traversing from root to leaves, we naturally encounter ancestors before descendants. We can:
   - When entering a node, check if its value is a perfect square
   - If yes, add it to the current sum of perfect square ancestors
   - Pass this updated sum to children
   - When backtracking, remove the node's contribution if it was a perfect square

4. **Alternative: Track sum instead of list:** We don't need the actual ancestor values, just their sum. So we can maintain a running sum of perfect square ancestors.

**Why this works:**

- Each node is visited exactly once: O(n)
- Perfect square check is O(1) with proper implementation
- We avoid redundant ancestor traversal by carrying the sum forward
- Space is O(n) for the adjacency list and O(h) for recursion stack

## Optimal Solution

The optimal solution uses DFS with a running sum of perfect square ancestors. We build an adjacency list from edges, then perform DFS starting from node 0. At each node, we check if its value is a perfect square, update the running sum, assign the result for the current node, then recurse to children, and finally backtrack by removing the node's contribution if it was a perfect square.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(n) for adjacency list and recursion stack
class Solution:
    def sumOfPerfectSquares(self, n: int, edges: List[List[int]], nums: List[int]) -> List[int]:
        # Step 1: Build adjacency list for the tree
        # Since edges are undirected, we add both directions
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Initialize result array and visited set
        result = [0] * n
        visited = [False] * n

        # Step 3: Helper function to check if a number is perfect square
        # Using integer math to avoid floating point errors
        def is_perfect_square(x: int) -> bool:
            if x < 0:
                return False
            root = int(x ** 0.5)
            return root * root == x

        # Step 4: DFS traversal with running sum of perfect square ancestors
        def dfs(node: int, parent: int, current_sum: int):
            # Mark current node as visited
            visited[node] = True

            # Check if current node's value is a perfect square
            # If yes, add it to the running sum for its descendants
            if is_perfect_square(nums[node]):
                current_sum += nums[node]

            # Store the sum of perfect square ancestors for current node
            # Note: we don't include current node's own value if it's a perfect square
            # because ancestors don't include the node itself
            result[node] = current_sum - (nums[node] if is_perfect_square(nums[node]) else 0)

            # Recurse to all neighbors except parent (to avoid going back up)
            for neighbor in graph[node]:
                if not visited[neighbor]:
                    dfs(neighbor, node, current_sum)

            # Backtracking: if current node was perfect square, its contribution
            # is automatically removed when recursion returns (since current_sum
            # is passed by value, not reference)

        # Step 5: Start DFS from root (node 0) with no parent and initial sum 0
        dfs(0, -1, 0)

        return result
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(n) for adjacency list and recursion stack
function sumOfPerfectSquares(n, edges, nums) {
  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Initialize result array and visited array
  const result = new Array(n).fill(0);
  const visited = new Array(n).fill(false);

  // Step 3: Helper function to check if a number is perfect square
  // Using integer math to avoid floating point errors
  function isPerfectSquare(x) {
    if (x < 0) return false;
    const root = Math.floor(Math.sqrt(x));
    return root * root === x;
  }

  // Step 4: DFS traversal with running sum of perfect square ancestors
  function dfs(node, parent, currentSum) {
    // Mark current node as visited
    visited[node] = true;

    // Check if current node's value is a perfect square
    // If yes, add it to the running sum for its descendants
    let newSum = currentSum;
    if (isPerfectSquare(nums[node])) {
      newSum += nums[node];
    }

    // Store the sum of perfect square ancestors for current node
    // Note: we don't include current node's own value if it's a perfect square
    // because ancestors don't include the node itself
    result[node] = currentSum;

    // Recurse to all neighbors except parent (to avoid going back up)
    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor, node, newSum);
      }
    }

    // Backtracking happens automatically since newSum is passed by value
  }

  // Step 5: Start DFS from root (node 0) with no parent and initial sum 0
  dfs(0, -1, 0);

  return result;
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(n) for adjacency list and recursion stack
class Solution {
    public int[] sumOfPerfectSquares(int n, int[][] edges, int[] nums) {
        // Step 1: Build adjacency list for the tree
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Initialize result array and visited array
        int[] result = new int[n];
        boolean[] visited = new boolean[n];

        // Step 3: DFS traversal with running sum of perfect square ancestors
        dfs(0, -1, 0, graph, nums, result, visited);

        return result;
    }

    private void dfs(int node, int parent, int currentSum,
                    List<Integer>[] graph, int[] nums,
                    int[] result, boolean[] visited) {
        // Mark current node as visited
        visited[node] = true;

        // Check if current node's value is a perfect square
        // If yes, add it to the running sum for its descendants
        int newSum = currentSum;
        if (isPerfectSquare(nums[node])) {
            newSum += nums[node];
        }

        // Store the sum of perfect square ancestors for current node
        // Note: we don't include current node's own value if it's a perfect square
        // because ancestors don't include the node itself
        result[node] = currentSum;

        // Recurse to all neighbors except parent (to avoid going back up)
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor, node, newSum, graph, nums, result, visited);
            }
        }

        // Backtracking happens automatically since newSum is passed by value
    }

    // Helper function to check if a number is perfect square
    // Using integer math to avoid floating point errors
    private boolean isPerfectSquare(int x) {
        if (x < 0) return false;
        int root = (int) Math.sqrt(x);
        return root * root == x;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building adjacency list: O(n) since there are n-1 edges
- DFS traversal: O(n) as each node is visited exactly once
- Perfect square check per node: O(1) with integer math
- Total: O(n) linear time

**Space Complexity: O(n)**

- Adjacency list: O(n) to store n nodes and n-1 edges
- Result array: O(n)
- Visited array: O(n)
- Recursion stack: O(h) where h is tree height, worst case O(n) for skewed tree
- Total: O(n) linear space

The key to achieving linear time is avoiding redundant work by tracking the running sum during DFS rather than recomputing ancestors for each node.

## Common Mistakes

1. **Forgetting the tree is undirected:** Candidates might build a directed graph from edges, but since edges are undirected, we need to add both directions to the adjacency list and use a visited/parent check to avoid cycles.

2. **Including current node in its own ancestor sum:** The problem asks for ancestors only, not including the node itself. A common mistake is to include the current node's value if it's a perfect square. The solution: store `currentSum` (not `newSum`) in `result[node]`.

3. **Inefficient perfect square checking:** Using floating point sqrt and comparison can have precision issues with large numbers. Better to use integer math: `int(sqrt(x)) * int(sqrt(x)) == x`.

4. **Not handling large recursion depth:** For a skewed tree with n=10⁵ nodes, recursion depth could cause stack overflow. While the problem constraints might allow recursion, it's good to mention iterative DFS as an alternative for production code.

5. **Assuming edges are in parent-child order:** The edges array doesn't guarantee any order, so we must treat the tree as undirected and use visited/parent tracking during traversal.

## When You'll See This Pattern

This "DFS with path tracking" pattern appears in many tree problems:

1. **Path Sum problems (LeetCode 112, 113, 437):** Similar pattern of tracking running sum during DFS traversal and checking conditions at each node.

2. **Tree traversal with state (LeetCode 1448):** Count Good Nodes in Binary Tree - tracks the maximum value along the path from root to current node.

3. **Ancestor-related queries (LeetCode 236, 1644):** Lowest Common Ancestor problems often use similar DFS approaches to track paths or ancestor information.

4. **Subtree sum problems (LeetCode 508):** Most Frequent Subtree Sum uses post-order traversal to compute subtree sums, similar to how we compute ancestor sums here.

The core idea is to pass information downward during DFS (from root to leaves) to avoid recomputing it for each node separately.

## Key Takeaways

1. **DFS with state passing:** When you need information about the path from root to current node, pass it as a parameter during DFS rather than recomputing it for each node.

2. **Tree as undirected graph:** Even when a tree has a root, edges are typically given as undirected pairs. Always build an adjacency list with both directions and use visited/parent tracking.

3. **Perfect square optimization:** Use integer math (`root * root == num`) instead of floating point comparisons to avoid precision issues and improve performance.

4. **Ancestor vs. self distinction:** When computing ancestor properties, be careful not to include the current node's own value unless explicitly required.

[Practice this problem on CodeJeet](/problem/sum-of-perfect-square-ancestors)
