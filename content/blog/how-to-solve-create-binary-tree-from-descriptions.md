---
title: "How to Solve Create Binary Tree From Descriptions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Create Binary Tree From Descriptions. Medium difficulty, 81.7% acceptance rate. Topics: Array, Hash Table, Tree, Binary Tree."
date: "2026-05-23"
category: "dsa-patterns"
tags: ["create-binary-tree-from-descriptions", "array", "hash-table", "tree", "medium"]
---

# How to Solve "Create Binary Tree From Descriptions"

You're given an array of parent-child relationships with left/right indicators and need to reconstruct the binary tree. The tricky part is that the descriptions aren't in any particular order, and you need to identify the root node while building all connections correctly.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `descriptions = [[20,15,1],[20,7,0],[50,20,1],[50,12,0]]`

**Step-by-step reconstruction:**

1. **First description [20,15,1]**: Create nodes 20 and 15. Since isLeft=1, make 15 the left child of 20.
   ```
   20
   /
   15
   ```

```

2. **Second description [20,7,0]**: Node 20 already exists. Create node 7. Since isLeft=0, make 7 the right child of 20.
```

     20
    /  \

15 7

```

3. **Third description [50,20,1]**: Create node 50. Node 20 already exists. Since isLeft=1, make 20 the left child of 50.
```

     50
    /

20
/ \
 15 7

```

4. **Fourth description [50,12,0]**: Node 50 already exists. Create node 12. Since isLeft=0, make 12 the right child of 50.
```

       50
      /  \
     20   12
    /  \

15 7

````

**Key observations:**
- We need to track which nodes we've created to avoid duplicates
- We need to identify the root (node 50 in this case) - it's the node that never appears as a child
- We need to handle left/right child assignments correctly

## Brute Force Approach

A naive approach might try to:
1. Create nodes as we encounter them
2. For each description, search through all existing nodes to find the parent
3. Keep trying different nodes as potential roots until we find one that fits all descriptions

The brute force would involve:
- Creating a list of all nodes
- For each description, linearly searching for the parent node
- Trying every node as root and validating the tree

**Why this fails:**
- Linear searches make it O(n²) time complexity
- Validation would require traversing the tree for each candidate root
- No systematic way to identify the root
- Doesn't handle the case where we encounter a child before its parent

The brute force approach is inefficient and doesn't handle the unordered nature of the descriptions well.

## Optimized Approach

The key insight is that we need **two data structures**:
1. **A hash map to store created nodes** - This lets us retrieve nodes in O(1) time instead of searching
2. **A set to track children** - This helps us identify the root node

**Step-by-step reasoning:**

1. **Initialize data structures:**
  - `nodes = {}` - maps node values to TreeNode objects
  - `children = set()` - tracks all child node values

2. **Process each description:**
  - If parent doesn't exist in `nodes`, create it
  - If child doesn't exist in `nodes`, create it
  - Add child to parent's left or right based on `isLeft`
  - Add child value to `children` set

3. **Find the root:**
  - The root is the node that exists in `nodes` but NOT in `children`
  - This works because every node except the root appears as a child somewhere

4. **Return the root node**

**Why this works:**
- Hash map gives O(1) access to nodes
- Set gives O(1) child existence checks
- We process descriptions in any order
- We can identify the root efficiently

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the number of descriptions
# Space: O(n) for storing nodes and children set
class TreeNode:
   def __init__(self, val=0, left=None, right=None):
       self.val = val
       self.left = left
       self.right = right

def createBinaryTree(descriptions):
   """
   Reconstructs a binary tree from parent-child relationship descriptions.

   Args:
       descriptions: List of [parent, child, isLeft] where isLeft=1 means left child

   Returns:
       Root node of the reconstructed binary tree
   """
   # Dictionary to store created nodes: value -> TreeNode
   nodes = {}
   # Set to track all child values (helps identify root)
   children = set()

   # Process each description
   for parent_val, child_val, is_left in descriptions:
       # Create parent node if it doesn't exist
       if parent_val not in nodes:
           nodes[parent_val] = TreeNode(parent_val)

       # Create child node if it doesn't exist
       if child_val not in nodes:
           nodes[child_val] = TreeNode(child_val)

       # Link child to parent based on is_left flag
       if is_left == 1:
           nodes[parent_val].left = nodes[child_val]
       else:
           nodes[parent_val].right = nodes[child_val]

       # Track that this value appears as a child
       children.add(child_val)

   # Find the root: it's the node that exists but never appears as a child
   for val, node in nodes.items():
       if val not in children:
           return node

   # This line should never be reached with valid input
   return None
````

```javascript
// Time: O(n) where n is the number of descriptions
// Space: O(n) for storing nodes and children set
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function createBinaryTree(descriptions) {
  /**
   * Reconstructs a binary tree from parent-child relationship descriptions.
   *
   * @param {number[][]} descriptions - Array of [parent, child, isLeft] where isLeft=1 means left child
   * @return {TreeNode} Root node of the reconstructed binary tree
   */
  // Map to store created nodes: value -> TreeNode
  const nodes = new Map();
  // Set to track all child values (helps identify root)
  const children = new Set();

  // Process each description
  for (const [parentVal, childVal, isLeft] of descriptions) {
    // Create parent node if it doesn't exist
    if (!nodes.has(parentVal)) {
      nodes.set(parentVal, new TreeNode(parentVal));
    }

    // Create child node if it doesn't exist
    if (!nodes.has(childVal)) {
      nodes.set(childVal, new TreeNode(childVal));
    }

    // Link child to parent based on isLeft flag
    if (isLeft === 1) {
      nodes.get(parentVal).left = nodes.get(childVal);
    } else {
      nodes.get(parentVal).right = nodes.get(childVal);
    }

    // Track that this value appears as a child
    children.add(childVal);
  }

  // Find the root: it's the node that exists but never appears as a child
  for (const [val, node] of nodes) {
    if (!children.has(val)) {
      return node;
    }
  }

  // This line should never be reached with valid input
  return null;
}
```

```java
// Time: O(n) where n is the number of descriptions
// Space: O(n) for storing nodes and children set
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public TreeNode createBinaryTree(int[][] descriptions) {
        /**
         * Reconstructs a binary tree from parent-child relationship descriptions.
         *
         * @param descriptions Array of [parent, child, isLeft] where isLeft=1 means left child
         * @return Root node of the reconstructed binary tree
         */
        // HashMap to store created nodes: value -> TreeNode
        Map<Integer, TreeNode> nodes = new HashMap<>();
        // Set to track all child values (helps identify root)
        Set<Integer> children = new HashSet<>();

        // Process each description
        for (int[] desc : descriptions) {
            int parentVal = desc[0];
            int childVal = desc[1];
            int isLeft = desc[2];

            // Create parent node if it doesn't exist
            if (!nodes.containsKey(parentVal)) {
                nodes.put(parentVal, new TreeNode(parentVal));
            }

            // Create child node if it doesn't exist
            if (!nodes.containsKey(childVal)) {
                nodes.put(childVal, new TreeNode(childVal));
            }

            // Link child to parent based on isLeft flag
            if (isLeft == 1) {
                nodes.get(parentVal).left = nodes.get(childVal);
            } else {
                nodes.get(parentVal).right = nodes.get(childVal);
            }

            // Track that this value appears as a child
            children.add(childVal);
        }

        // Find the root: it's the node that exists but never appears as a child
        for (Map.Entry<Integer, TreeNode> entry : nodes.entrySet()) {
            if (!children.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // This line should never be reached with valid input
        return null;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each description exactly once: O(n)
- Each operation (map/set lookup, insertion) is O(1) on average
- Finding the root requires iterating through all nodes: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store all n nodes in the hash map: O(n)
- We store all child values in a set: O(n)
- Total: O(n) + O(n) = O(n)

## Common Mistakes

1. **Not tracking children to find the root**: Some candidates try to guess the root or assume it's the first parent they encounter. The correct approach is to track all children and find the node that's not a child.

2. **Creating duplicate nodes**: If you create a new TreeNode for the same value multiple times, you'll end up with different objects that should be the same node. Always check if a node already exists before creating it.

3. **Misinterpreting the isLeft flag**: The problem states isLeft=1 means left child, isLeft=0 means right child. Some candidates reverse this or treat it as a boolean without proper conversion.

4. **Forgetting that nodes can be encountered in any order**: The descriptions array isn't sorted. A child might appear before its parent in the array, so you need to handle both cases.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph/Tree reconstruction from edges**: Similar to building any graph from edge lists, but with the twist of binary tree structure.
   - Related: [Number Of Ways To Reconstruct A Tree](/problem/number-of-ways-to-reconstruct-a-tree) - More complex version with validation

2. **Using hash maps for O(1) lookups**: Whenever you need to quickly find nodes/objects by a key.
   - Related: [Clone Graph](/problem/clone-graph) - Uses similar node mapping technique

3. **Identifying root/source in a directed structure**: Finding the node with no incoming edges.
   - Related: [Find the Town Judge](/problem/find-the-town-judge) - Finds node with specific in/out degree pattern

## Key Takeaways

1. **Use hash maps for node reconstruction problems**: When building any graph/tree from relationships, a hash map from identifier to node object is almost always the right approach.

2. **Track both creation and relationships separately**: Keep one data structure for created nodes and another for tracking relationships (like parent-child connections) to solve the problem efficiently.

3. **Root identification trick**: In tree reconstruction, the root is often the only node that doesn't appear as a child. This pattern appears in many tree problems.

Related problems: [Convert Sorted List to Binary Search Tree](/problem/convert-sorted-list-to-binary-search-tree), [Number Of Ways To Reconstruct A Tree](/problem/number-of-ways-to-reconstruct-a-tree)
