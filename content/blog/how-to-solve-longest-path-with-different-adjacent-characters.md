---
title: "How to Solve Longest Path With Different Adjacent Characters — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Path With Different Adjacent Characters. Hard difficulty, 54.0% acceptance rate. Topics: Array, String, Tree, Depth-First Search, Graph Theory."
date: "2027-08-10"
category: "dsa-patterns"
tags: ["longest-path-with-different-adjacent-characters", "array", "string", "tree", "hard"]
---

# How to Solve Longest Path With Different Adjacent Characters

This problem asks us to find the longest path in a tree where consecutive nodes along the path have different characters. The tree is given as a parent array, and each node has an associated character. What makes this problem tricky is that the path doesn't have to go through the root, and we need to consider paths that might go up through a parent and then down through different children. This is essentially finding the diameter of a tree with an additional constraint about adjacent characters being different.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

- `parent = [-1,0,0,1,1,2]` (6 nodes, root at 0)
- `s = "abacbe"` (characters for nodes 0-5)

**Tree structure:**

- Node 0 (a) has children: 1(b), 2(a)
- Node 1 (b) has children: 3(a), 4(c)
- Node 2 (a) has child: 5(b)

Let's find the longest valid path step by step:

1. **Start at leaf nodes:**
   - Node 3 (a): No children → longest path starting here = 1
   - Node 4 (c): No children → longest path starting here = 1
   - Node 5 (b): No children → longest path starting here = 1

2. **Process node 1 (b):**
   - Children: 3(a), 4(c)
   - Both children have different characters than 'b'
   - Longest paths from children: both length 1
   - Best two paths: 1 + 1 = 2 (through both children)
   - Record: longest path through node 1 = 2
   - Longest single path from node 1 = max(1, 1) + 1 = 2

3. **Process node 2 (a):**
   - Child: 5(b) - different character ✓
   - Longest path from child: 1
   - Longest path through node 2 = 1 (only one child)
   - Longest single path from node 2 = 1 + 1 = 2

4. **Process root node 0 (a):**
   - Children: 1(b), 2(a)
   - Only child 1 has different character (b ≠ a)
   - Child 2 has same character (a = a) → cannot extend path
   - Longest path through node 0 = 1 (only one valid child)
   - Longest single path from node 0 = 1 + 1 = 2

5. **Global maximum:**
   - Check all nodes: Node 1 gives path length 2
   - Final answer: 2

The key insight: At each node, we need to track the longest valid path that goes through that node, which could be formed by combining the two longest paths from its children (if they have different characters than the current node).

## Brute Force Approach

A naive approach would be to try all possible pairs of nodes and check if the path between them has all different adjacent characters. For each pair (u, v):

1. Find the path from u to v (unique in a tree)
2. Check if all consecutive nodes have different characters
3. Track the maximum length found

This approach has several problems:

- Finding all pairs is O(n²)
- For each pair, finding the path could take O(n)
- Total complexity: O(n³) - far too slow for n up to 10⁵

Even a slightly better brute force would be to perform DFS from each node, exploring all paths while checking the character condition. This would still be O(n²) in the worst case (star-shaped tree).

The fundamental issue with brute force is that it doesn't reuse computation. When we explore from different starting nodes, we're checking the same paths multiple times.

## Optimized Approach

The key insight is that this problem is similar to finding the **diameter of a tree**, but with an additional constraint about adjacent characters being different. We can solve it with a single DFS traversal.

**Core idea:** For each node, compute the longest valid path that starts at that node and goes downward through its children. When processing a node:

1. Look at all children that have different characters than the current node
2. Track the two longest paths from those children
3. The longest path through this node = sum of the two longest valid child paths + 1
4. Update global maximum with this value
5. Return the longest single path from this node (for parent to use)

**Why this works:**

- The longest path in the entire tree must pass through some node as its "highest" point
- At that highest point, the path consists of the two longest valid paths from that node to leaves in different subtrees
- By computing this for every node, we'll find the global maximum

**Algorithm steps:**

1. Build adjacency list from parent array
2. Perform DFS from root (node 0)
3. For each node:
   - Initialize two longest paths as 0
   - For each child with different character:
     - Get child's longest path + 1
     - Update the two longest paths
   - Update global maximum with (first longest + second longest)
   - Return first longest path to parent

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def longestPath(self, parent: List[int], s: str) -> int:
        n = len(parent)

        # Step 1: Build adjacency list for the tree
        # We need to know children of each node for DFS traversal
        children = [[] for _ in range(n)]
        for i in range(1, n):  # Skip root (parent[0] = -1)
            children[parent[i]].append(i)

        # Global variable to track the maximum path length found
        self.max_length = 1  # Minimum path is a single node

        # Step 2: Perform DFS from root
        def dfs(node):
            # Track the two longest valid paths from this node's children
            longest1 = 0  # First longest
            longest2 = 0  # Second longest

            # Explore all children
            for child in children[node]:
                # Get the longest valid path starting from child
                child_path = dfs(child)

                # Only consider this child if characters are different
                if s[child] != s[node]:
                    # Update the two longest paths
                    if child_path > longest1:
                        longest2 = longest1
                        longest1 = child_path
                    elif child_path > longest2:
                        longest2 = child_path

            # The longest path through this node as the highest point
            # is the sum of the two longest valid child paths + 1 (for this node)
            path_through_node = longest1 + longest2 + 1
            self.max_length = max(self.max_length, path_through_node)

            # Return the longest single path starting from this node
            # (for parent to potentially use)
            return longest1 + 1

        # Start DFS from root (node 0)
        dfs(0)

        return self.max_length
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * @param {number[]} parent
 * @param {string} s
 * @return {number}
 */
var longestPath = function (parent, s) {
  const n = parent.length;

  // Step 1: Build adjacency list for the tree
  const children = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    // Skip root (parent[0] = -1)
    children[parent[i]].push(i);
  }

  // Global variable to track maximum path length
  let maxLength = 1; // Minimum path is a single node

  // Step 2: Perform DFS from root
  const dfs = (node) => {
    // Track the two longest valid paths from this node's children
    let longest1 = 0; // First longest
    let longest2 = 0; // Second longest

    // Explore all children
    for (const child of children[node]) {
      // Get the longest valid path starting from child
      const childPath = dfs(child);

      // Only consider this child if characters are different
      if (s[child] !== s[node]) {
        // Update the two longest paths
        if (childPath > longest1) {
          longest2 = longest1;
          longest1 = childPath;
        } else if (childPath > longest2) {
          longest2 = childPath;
        }
      }
    }

    // The longest path through this node as the highest point
    // is the sum of the two longest valid child paths + 1 (for this node)
    const pathThroughNode = longest1 + longest2 + 1;
    maxLength = Math.max(maxLength, pathThroughNode);

    // Return the longest single path starting from this node
    // (for parent to potentially use)
    return longest1 + 1;
  };

  // Start DFS from root (node 0)
  dfs(0);

  return maxLength;
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    private int maxLength;
    private List<Integer>[] children;
    private String s;

    public int longestPath(int[] parent, String s) {
        int n = parent.length;
        this.s = s;
        this.maxLength = 1;  // Minimum path is a single node

        // Step 1: Build adjacency list for the tree
        children = new List[n];
        for (int i = 0; i < n; i++) {
            children[i] = new ArrayList<>();
        }
        for (int i = 1; i < n; i++) {  // Skip root (parent[0] = -1)
            children[parent[i]].add(i);
        }

        // Step 2: Perform DFS from root
        dfs(0);

        return maxLength;
    }

    private int dfs(int node) {
        // Track the two longest valid paths from this node's children
        int longest1 = 0;  // First longest
        int longest2 = 0;  // Second longest

        // Explore all children
        for (int child : children[node]) {
            // Get the longest valid path starting from child
            int childPath = dfs(child);

            // Only consider this child if characters are different
            if (s.charAt(child) != s.charAt(node)) {
                // Update the two longest paths
                if (childPath > longest1) {
                    longest2 = longest1;
                    longest1 = childPath;
                } else if (childPath > longest2) {
                    longest2 = childPath;
                }
            }
        }

        // The longest path through this node as the highest point
        // is the sum of the two longest valid child paths + 1 (for this node)
        int pathThroughNode = longest1 + longest2 + 1;
        maxLength = Math.max(maxLength, pathThroughNode);

        // Return the longest single path starting from this node
        // (for parent to potentially use)
        return longest1 + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list takes O(n) time (one pass through parent array)
- DFS visits each node exactly once: O(n)
- For each node, we process all its children, but each edge is visited exactly once
- Total operations: O(n) for building graph + O(n) for DFS = O(n)

**Space Complexity: O(n)**

- Adjacency list stores all edges: O(n) space
- Recursion stack in worst case (skewed tree) could be O(n)
- Additional variables per node: O(1)
- Total: O(n) for graph + O(n) for recursion = O(n)

## Common Mistakes

1. **Forgetting to check character equality:** The most common error is treating this as a standard tree diameter problem and ignoring the character constraint. Always check `s[child] != s[node]` before considering a child's path.

2. **Incorrectly updating the two longest paths:** When you find a new longest path, you need to update both `longest1` and `longest2`. The pattern is:
   - If new path > longest1: set longest2 = longest1, then longest1 = new path
   - Else if new path > longest2: set longest2 = new path

3. **Returning the wrong value from DFS:** The DFS should return the longest single path starting from the current node (longest1 + 1), not the longest path through the node. The path through the node is used to update the global maximum but isn't what the parent needs.

4. **Not handling the case with no valid children:** When a node has no children with different characters, both longest1 and longest2 remain 0. The path through the node is 1 (just the node itself), which is correct.

## When You'll See This Pattern

This problem uses the **"tree diameter with constraints"** pattern, which appears in several tree problems:

1. **Diameter of Binary Tree (Easy):** The classic version without character constraints. You track the two longest paths from each node and update a global maximum.

2. **Longest Univalue Path (Medium):** Similar to this problem but with the opposite constraint - you want consecutive nodes with the _same_ value. The solution structure is nearly identical.

3. **Binary Tree Maximum Path Sum (Hard):** Instead of counting nodes, you're summing values. The pattern of tracking two best child results and updating a global maximum is the same.

The core pattern is: **Post-order DFS where each node computes some value based on its children, tracks the best two results, and updates a global answer.**

## Key Takeaways

1. **Tree diameter problems often use post-order DFS:** Process children first, then combine results at the current node. This allows each node to be the "highest point" of some path.

2. **Track two best values when looking for combinations:** When you need to combine the best results from different subtrees (like the two longest paths), maintain the top two values as you process children.

3. **Separate "path through node" from "path from node":** The value you return to parent (longest path starting here) is different from what you use to update the global maximum (longest path through this node as highest point).

**Related problems:** [Diameter of Binary Tree](/problem/diameter-of-binary-tree), [Longest Univalue Path](/problem/longest-univalue-path), [Choose Edges to Maximize Score in a Tree](/problem/choose-edges-to-maximize-score-in-a-tree)
