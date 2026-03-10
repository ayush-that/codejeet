---
title: "How to Solve Complete Binary Tree Inserter — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Complete Binary Tree Inserter. Medium difficulty, 65.0% acceptance rate. Topics: Tree, Breadth-First Search, Design, Binary Tree."
date: "2028-02-29"
category: "dsa-patterns"
tags: ["complete-binary-tree-inserter", "tree", "breadth-first-search", "design", "medium"]
---

# How to Solve Complete Binary Tree Inserter

Designing a data structure to maintain a complete binary tree while supporting efficient insertions is a classic design problem that tests your understanding of tree properties and clever data structure usage. The challenge is that a naive insertion would require O(n) time to find the insertion point each time, but we can achieve O(1) insertions by leveraging the complete binary tree's structure and using a queue to track candidate parent nodes.

## Visual Walkthrough

Let's trace through building a complete binary tree step by step. We'll start with a root node containing value 1:

```
Initial tree: [1]
```

After inserting value 2, we need to maintain completeness. The first available position is as the left child of node 1:

```
Tree after inserting 2:
    1
   /
  2
```

Now we insert value 3. The tree must remain complete, so 3 becomes the right child of node 1:

```
Tree after inserting 3:
    1
   / \
  2   3
```

Next, we insert value 4. The tree is currently complete at level 1 (root level). We need to add to level 2, and we must fill from left to right. The first available parent is node 2, so 4 becomes its left child:

```
Tree after inserting 4:
       1
      / \
     2   3
    /
   4
```

Inserting value 5: The next available position is as the right child of node 2:

```
Tree after inserting 5:
       1
      / \
     2   3
    / \
   4   5
```

The pattern emerges: we always insert at the first node that doesn't have both children, and we fill children from left to right. This ensures the tree remains complete.

## Brute Force Approach

A naive approach would be to perform a level-order traversal (BFS) each time we need to insert a node. We'd start from the root and traverse the entire tree to find the first node that either:

1. Has no left child (insert there)
2. Has a left child but no right child (insert there)

This approach works but is inefficient. For each insertion, we traverse the entire tree to find the insertion point, resulting in O(n) time per insertion where n is the number of nodes. After k insertions starting from a single node, we'd perform O(k²) total operations.

Here's what the brute force insertion might look like:

```python
def insert_brute_force(root, val):
    if not root:
        return TreeNode(val)

    queue = [root]
    while queue:
        node = queue.pop(0)

        if not node.left:
            node.left = TreeNode(val)
            return root
        elif not node.right:
            node.right = TreeNode(val)
            return root

        queue.append(node.left)
        queue.append(node.right)
```

The problem with this approach is clear: we're re-traversing the same nodes repeatedly. After 100 insertions, the 100th insertion would traverse through 99 nodes just to find where to insert.

## Optimized Approach

The key insight is that we don't need to traverse the entire tree for each insertion. Once we find a suitable parent node for insertion, we can keep track of candidate parent nodes for future insertions. We can maintain a queue of nodes that don't have both children yet.

Here's the step-by-step reasoning:

1. **Initialization**: When we construct the CBTInserter, we perform one full BFS traversal to build a queue of candidate parent nodes (nodes that don't have both children).

2. **Insert Operation**:
   - The front of the queue is always the next parent that needs a child
   - Create a new node with the given value
   - If the parent has no left child, attach the new node as left child
   - If the parent has a left child but no right child, attach as right child
   - After attaching a right child, the parent now has both children, so we remove it from the queue
   - The newly inserted node becomes a candidate parent (it has no children yet), so we add it to the queue

3. **Get Root**: Simply return the stored root reference.

This approach gives us O(1) time for insertions after the O(n) initialization, where n is the number of nodes in the initial tree.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) for init, O(1) for insert and get_root
# Space: O(n) for storing the candidate queue
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class CBTInserter:
    def __init__(self, root: TreeNode):
        """
        Initialize the data structure with the root of the complete binary tree.
        We perform a BFS to find all nodes that don't have both children.
        These nodes are potential parents for future insertions.
        """
        self.root = root  # Store the root for get_root() method
        self.candidate_queue = []  # Queue of nodes missing children

        # Perform BFS to initialize the candidate queue
        queue = [root]
        while queue:
            node = queue.pop(0)

            # If node doesn't have both children, it's a candidate parent
            if not node.left or not node.right:
                self.candidate_queue.append(node)

            # Continue BFS to explore all nodes
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    def insert(self, val: int) -> int:
        """
        Insert a new node with value val into the tree.
        Returns the value of the parent node where the new node was inserted.
        """
        # Create the new node to insert
        new_node = TreeNode(val)

        # The front of candidate queue is always the next parent
        parent = self.candidate_queue[0]

        # Attach new node to the first available child position
        if not parent.left:
            parent.left = new_node
        else:
            # If we're here, parent has left child but no right child
            parent.right = new_node
            # Now parent has both children, remove it from candidates
            self.candidate_queue.pop(0)

        # New node is now a candidate parent (it has no children yet)
        self.candidate_queue.append(new_node)

        return parent.val

    def get_root(self) -> TreeNode:
        """
        Return the root node of the tree.
        """
        return self.root
```

```javascript
// Time: O(n) for init, O(1) for insert and get_root
// Space: O(n) for storing the candidate queue
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class CBTInserter {
  /**
   * Initialize the data structure with the root of the complete binary tree.
   * We perform a BFS to find all nodes that don't have both children.
   * These nodes are potential parents for future insertions.
   */
  constructor(root) {
    this.root = root; // Store the root for get_root() method
    this.candidateQueue = []; // Queue of nodes missing children

    // Perform BFS to initialize the candidate queue
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();

      // If node doesn't have both children, it's a candidate parent
      if (!node.left || !node.right) {
        this.candidateQueue.push(node);
      }

      // Continue BFS to explore all nodes
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }

  /**
   * Insert a new node with value val into the tree.
   * Returns the value of the parent node where the new node was inserted.
   */
  insert(val) {
    // Create the new node to insert
    const newNode = new TreeNode(val);

    // The front of candidate queue is always the next parent
    const parent = this.candidateQueue[0];

    // Attach new node to the first available child position
    if (!parent.left) {
      parent.left = newNode;
    } else {
      // If we're here, parent has left child but no right child
      parent.right = newNode;
      // Now parent has both children, remove it from candidates
      this.candidateQueue.shift();
    }

    // New node is now a candidate parent (it has no children yet)
    this.candidateQueue.push(newNode);

    return parent.val;
  }

  /**
   * Return the root node of the tree.
   */
  get_root() {
    return this.root;
  }
}
```

```java
// Time: O(n) for init, O(1) for insert and get_root
// Space: O(n) for storing the candidate queue
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

class CBTInserter {
    private TreeNode root;
    private Queue<TreeNode> candidateQueue;

    /**
     * Initialize the data structure with the root of the complete binary tree.
     * We perform a BFS to find all nodes that don't have both children.
     * These nodes are potential parents for future insertions.
     */
    public CBTInserter(TreeNode root) {
        this.root = root;  // Store the root for get_root() method
        this.candidateQueue = new LinkedList<>();

        // Perform BFS to initialize the candidate queue
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();

            // If node doesn't have both children, it's a candidate parent
            if (node.left == null || node.right == null) {
                candidateQueue.offer(node);
            }

            // Continue BFS to explore all nodes
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
    }

    /**
     * Insert a new node with value val into the tree.
     * Returns the value of the parent node where the new node was inserted.
     */
    public int insert(int val) {
        // Create the new node to insert
        TreeNode newNode = new TreeNode(val);

        // The front of candidate queue is always the next parent
        TreeNode parent = candidateQueue.peek();

        // Attach new node to the first available child position
        if (parent.left == null) {
            parent.left = newNode;
        } else {
            // If we're here, parent has left child but no right child
            parent.right = newNode;
            // Now parent has both children, remove it from candidates
            candidateQueue.poll();
        }

        // New node is now a candidate parent (it has no children yet)
        candidateQueue.offer(newNode);

        return parent.val;
    }

    /**
     * Return the root node of the tree.
     */
    public TreeNode get_root() {
        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor (**init**)**: O(n), where n is the number of nodes in the initial tree. We perform one complete BFS traversal.
- **insert()**: O(1) amortized. We simply check the front of the queue, attach a child, and update the queue.
- **get_root()**: O(1), we just return the stored reference.

**Space Complexity:** O(n) for storing the candidate queue. In the worst case, when the tree is perfectly balanced except for the last level, about half the nodes will be in the candidate queue.

## Common Mistakes

1. **Not handling the initial tree correctly**: Some candidates assume the tree starts empty, but the problem provides an initial complete binary tree. You must handle this in initialization by finding all candidate parents in the existing tree.

2. **Forgetting to add the new node to the candidate queue**: After inserting a new node, it becomes a candidate parent (since it has no children initially). Forgetting this means you'll run out of candidate parents after a while.

3. **Using a stack instead of a queue**: The order matters! We need FIFO (First-In-First-Out) behavior to maintain the left-to-right insertion order. Using a stack (LIFO) would break the completeness property.

4. **Not removing parents with both children from the queue**: Once a parent gets both children, it should be removed from the candidate queue. Otherwise, you'll try to add a third child to it, which isn't allowed in a binary tree.

## When You'll See This Pattern

This pattern of maintaining a queue of "available" or "incomplete" nodes appears in several tree construction and traversal problems:

1. **Binary Tree Level Order Traversal (LeetCode 102)**: Similar BFS with queue approach, but here we're modifying the queue based on node completeness.

2. **Serialize and Deserialize Binary Tree (LeetCode 297)**: When deserializing, you often use a queue to track parent nodes that need children attached.

3. **Populating Next Right Pointers in Each Node (LeetCode 116)**: Uses BFS with queue to connect nodes at the same level, similar to how we track nodes needing children.

The core technique is using a queue to process nodes in the order they would be encountered in a level-order traversal, which naturally matches the left-to-right, top-to-bottom order needed for maintaining completeness.

## Key Takeaways

1. **Complete binary trees have predictable insertion points**: The next insertion always goes to the first node (in level order) that doesn't have both children. This allows O(1) insertions with proper bookkeeping.

2. **Queues naturally model level-order processing**: When you need to process nodes in the order they appear level by level (left to right), a queue is the ideal data structure.

3. **Amortize initialization cost**: The O(n) initialization cost is acceptable because it enables O(1) operations thereafter. In interview settings, explain this tradeoff clearly.

[Practice this problem on CodeJeet](/problem/complete-binary-tree-inserter)
