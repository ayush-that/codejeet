---
title: "How to Solve Number of Nodes in the Sub-Tree With the Same Label — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Nodes in the Sub-Tree With the Same Label. Medium difficulty, 55.4% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Counting."
date: "2027-07-30"
category: "dsa-patterns"
tags:
  [
    "number-of-nodes-in-the-sub-tree-with-the-same-label",
    "hash-table",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve "Number of Nodes in the Sub-Tree With the Same Label"

This problem asks us to count, for each node in a tree, how many nodes in its subtree share the same label as that node. The tree has `n` nodes (0 to n-1) with node 0 as root, and each node has a lowercase character label. What makes this problem interesting is that we need to efficiently aggregate label counts from child subtrees to parent nodes — a classic tree counting problem that requires careful post-order traversal.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
n = 7
edges = [[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]]
labels = "abaedcd"
```

The tree structure:

- Node 0 (label 'a') has children 1 and 2
- Node 1 (label 'b') has children 4 and 5
- Node 2 (label 'a') has children 3 and 6
- Node 3 (label 'e'), 4 (label 'd'), 5 (label 'c'), 6 (label 'd')

Let's compute the answer step by step:

1. **Leaf nodes first**:
   - Node 3: Only itself → 1 'e'
   - Node 4: Only itself → 1 'd'
   - Node 5: Only itself → 1 'c'
   - Node 6: Only itself → 1 'd'

2. **Node 1**: Has children 4 and 5
   - Child 4: 1 'd'
   - Child 5: 1 'c'
   - Node 1's label is 'b'
   - Count 'b' in subtree: only node 1 itself → 1

3. **Node 2**: Has children 3 and 6
   - Child 3: 1 'e'
   - Child 6: 1 'd'
   - Node 2's label is 'a'
   - Count 'a' in subtree: only node 2 itself → 1

4. **Node 0**: Has children 1 and 2
   - Child 1: 1 'b', 1 'd', 1 'c'
   - Child 2: 1 'a', 1 'e', 1 'd'
   - Node 0's label is 'a'
   - Count 'a' in subtree: node 0 + node 2 = 2

The result: `[2,1,1,1,1,1,1]`

Notice the pattern: we need to process children first, then combine their label counts with the parent's label.

## Brute Force Approach

A naive approach would be: for each node, perform a DFS/BFS through its entire subtree, counting how many nodes have the same label as the current node.

**Why this fails:**

- For each of n nodes, we traverse its entire subtree
- In the worst case (a skewed tree), this becomes O(n²) time complexity
- With n up to 10⁵, O(n²) is far too slow (10¹⁰ operations)

Even with memoization, we'd still have issues because we're doing redundant work. The key insight is that we need to compute counts in a way that lets us reuse computations from child subtrees.

## Optimized Approach

The optimal solution uses **post-order DFS with count aggregation**:

1. **Build adjacency list**: Convert edges to an adjacency list representation of the tree.

2. **DFS with return value**: Perform DFS from the root. For each node:
   - Initialize a count array of size 26 (for 'a' to 'z')
   - Process all children (except parent to avoid cycles)
   - For each child, get its label count array
   - Add child's counts to current node's counts
   - After processing children, increment count for current node's label
   - Store the count for current node's label in result array
   - Return the count array to parent

3. **Why this works**:
   - Each node is visited exactly once
   - We aggregate counts from bottom up (post-order)
   - The count array returned to parent contains all label frequencies in that subtree
   - We get O(n) time complexity since each edge is traversed once

**Key insight**: Instead of counting "same label" for each node separately, we compute ALL label frequencies for each subtree, then extract just the count for that node's label.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - each node visited once, each edge traversed once
# Space: O(n) - for adjacency list, recursion stack, and count arrays
class Solution:
    def countSubTrees(self, n: int, edges: List[List[int]], labels: str) -> List[int]:
        # Step 1: Build adjacency list for the tree
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)  # Undirected edges

        # Result array to store counts for each node
        result = [0] * n

        # Step 2: DFS function that returns count array for subtree
        def dfs(node: int, parent: int) -> List[int]:
            # Initialize count array for 26 lowercase letters
            count = [0] * 26

            # Process all neighbors (children in tree traversal)
            for neighbor in graph[node]:
                if neighbor == parent:
                    continue  # Skip parent to avoid cycles

                # Get child's count array recursively
                child_count = dfs(neighbor, node)

                # Merge child's counts into current node's counts
                for i in range(26):
                    count[i] += child_count[i]

            # Add current node's label to count
            label_index = ord(labels[node]) - ord('a')
            count[label_index] += 1

            # Store result for current node
            result[node] = count[label_index]

            # Return count array to parent
            return count

        # Start DFS from root (node 0) with parent -1
        dfs(0, -1)

        return result
```

```javascript
// Time: O(n) - each node visited once, each edge traversed once
// Space: O(n) - for adjacency list, recursion stack, and count arrays
var countSubTrees = function (n, edges, labels) {
  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u); // Undirected edges
  }

  // Result array to store counts for each node
  const result = new Array(n).fill(0);

  // Step 2: DFS function that returns count array for subtree
  const dfs = (node, parent) => {
    // Initialize count array for 26 lowercase letters
    const count = new Array(26).fill(0);

    // Process all neighbors (children in tree traversal)
    for (const neighbor of graph[node]) {
      if (neighbor === parent) {
        continue; // Skip parent to avoid cycles
      }

      // Get child's count array recursively
      const childCount = dfs(neighbor, node);

      // Merge child's counts into current node's counts
      for (let i = 0; i < 26; i++) {
        count[i] += childCount[i];
      }
    }

    // Add current node's label to count
    const labelIndex = labels.charCodeAt(node) - 97; // 'a' = 97
    count[labelIndex]++;

    // Store result for current node
    result[node] = count[labelIndex];

    // Return count array to parent
    return count;
  };

  // Start DFS from root (node 0) with parent -1
  dfs(0, -1);

  return result;
};
```

```java
// Time: O(n) - each node visited once, each edge traversed once
// Space: O(n) - for adjacency list, recursion stack, and count arrays
class Solution {
    public int[] countSubTrees(int n, int[][] edges, String labels) {
        // Step 1: Build adjacency list for the tree
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);  // Undirected edges
        }

        // Result array to store counts for each node
        int[] result = new int[n];

        // Step 2: DFS function that returns count array for subtree
        dfs(0, -1, graph, labels, result);

        return result;
    }

    private int[] dfs(int node, int parent, List<Integer>[] graph,
                     String labels, int[] result) {
        // Initialize count array for 26 lowercase letters
        int[] count = new int[26];

        // Process all neighbors (children in tree traversal)
        for (int neighbor : graph[node]) {
            if (neighbor == parent) {
                continue;  // Skip parent to avoid cycles
            }

            // Get child's count array recursively
            int[] childCount = dfs(neighbor, node, graph, labels, result);

            // Merge child's counts into current node's counts
            for (int i = 0; i < 26; i++) {
                count[i] += childCount[i];
            }
        }

        // Add current node's label to count
        int labelIndex = labels.charAt(node) - 'a';
        count[labelIndex]++;

        // Store result for current node
        result[node] = count[labelIndex];

        // Return count array to parent
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building adjacency list: O(n) for n-1 edges
- DFS traversal: Each node visited once, each edge traversed once → O(n)
- For each node, we merge at most 26 counts from children → O(26n) = O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Adjacency list: O(n) for n nodes and n-1 edges
- Recursion stack: O(n) in worst case (skewed tree)
- Count arrays: Each recursive call has O(26) array, but these are not all stored simultaneously in memory due to recursion
- Result array: O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting the tree is undirected**: Candidates often build a directed graph from edges, but the tree is undirected. You must add both directions to the adjacency list and track parent to avoid cycles in DFS.

2. **Not using post-order traversal**: Trying to compute counts top-down won't work because a parent needs counts from its children first. The DFS must process children before the current node (post-order).

3. **Inefficient counting per node**: Some candidates try to count same-label nodes for each node separately with BFS/DFS from that node, resulting in O(n²) time. The key is to compute all label counts once per subtree.

4. **Array index errors**: When converting labels to indices (0-25), forgetting that 'a' has ASCII value 97, not 0. Use `ord(label) - ord('a')` or `charCodeAt() - 97`.

## When You'll See This Pattern

This "subtree aggregation" pattern appears in many tree problems:

1. **Sum of Distances in Tree (LeetCode 834)**: Similar bottom-up aggregation of distances from each node to all others.

2. **Binary Tree Maximum Path Sum (LeetCode 124)**: Post-order traversal where each node combines values from left and right subtrees.

3. **Diameter of Binary Tree (LeetCode 543)**: Each node computes height from children and updates diameter.

The common theme: **process children first, combine results, return aggregated information to parent**. This is classic post-order DFS on trees.

## Key Takeaways

1. **Tree counting problems often require post-order DFS**: When you need to aggregate information from child subtrees to compute something for a parent, think "process children first, then parent."

2. **Return aggregated data structures from DFS**: Instead of just returning a single value, consider returning arrays or maps that contain all the information a parent needs about that subtree.

3. **Undirected trees need parent tracking**: When doing DFS on undirected trees, always pass and check the parent parameter to avoid revisiting nodes and creating infinite recursion.

[Practice this problem on CodeJeet](/problem/number-of-nodes-in-the-sub-tree-with-the-same-label)
