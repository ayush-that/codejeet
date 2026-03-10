---
title: "How to Solve Maximum Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Binary Tree. Medium difficulty, 86.3% acceptance rate. Topics: Array, Divide and Conquer, Stack, Tree, Monotonic Stack."
date: "2027-09-23"
category: "dsa-patterns"
tags: ["maximum-binary-tree", "array", "divide-and-conquer", "stack", "medium"]
---

# How to Solve Maximum Binary Tree

This problem asks us to construct a binary tree where each node is the maximum value in its current subarray, with left and right subtrees built recursively from the prefix before and suffix after that maximum. The challenge lies in doing this efficiently—while a recursive divide-and-conquer approach is straightforward, we can optimize it significantly using a monotonic stack to achieve linear time complexity.

## Visual Walkthrough

Let's trace through the example `nums = [3,2,1,6,0,5]`:

**Step 1:** Find the maximum value (6) at index 3. This becomes our root.

- Left subtree: Build from subarray `[3,2,1]` (prefix before index 3)
- Right subtree: Build from subarray `[0,5]` (suffix after index 3)

**Step 2:** Build left subtree from `[3,2,1]`:

- Maximum is 3 at index 0
- Left subtree: Empty (no elements before index 0)
- Right subtree: Build from `[2,1]`

**Step 3:** Build right subtree of node(3) from `[2,1]`:

- Maximum is 2 at index 0
- Left subtree: Empty
- Right subtree: Build from `[1]`

**Step 4:** Build right subtree of node(2) from `[1]`:

- Maximum is 1 at index 0
- Both subtrees empty

**Step 5:** Back to root's right subtree from `[0,5]`:

- Maximum is 5 at index 1
- Left subtree: Build from `[0]`
- Right subtree: Empty

**Step 6:** Build left subtree of node(5) from `[0]`:

- Maximum is 0 at index 0
- Both subtrees empty

The resulting tree structure:

```
       6
      / \
     3   5
      \  /
       2 0
        \
         1
```

## Brute Force Approach

The most intuitive solution follows the problem description exactly using recursion:

1. Find the maximum value and its index in the current subarray
2. Create a node with that maximum value
3. Recursively build left subtree from elements before the maximum
4. Recursively build right subtree from elements after the maximum

<div class="code-group">

```python
# Time: O(n²) worst case | Space: O(n) for recursion stack
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def constructMaximumBinaryTree(nums):
    # Base case: empty array
    if not nums:
        return None

    # Step 1: Find maximum value and its index
    max_val = max(nums)
    max_idx = nums.index(max_val)

    # Step 2: Create root node with maximum value
    root = TreeNode(max_val)

    # Step 3: Recursively build left subtree from prefix
    root.left = constructMaximumBinaryTree(nums[:max_idx])

    # Step 4: Recursively build right subtree from suffix
    root.right = constructMaximumBinaryTree(nums[max_idx + 1:])

    return root
```

```javascript
// Time: O(n²) worst case | Space: O(n) for recursion stack
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function constructMaximumBinaryTree(nums) {
  // Base case: empty array
  if (nums.length === 0) {
    return null;
  }

  // Step 1: Find maximum value and its index
  let maxVal = Math.max(...nums);
  let maxIdx = nums.indexOf(maxVal);

  // Step 2: Create root node with maximum value
  let root = new TreeNode(maxVal);

  // Step 3: Recursively build left subtree from prefix
  root.left = constructMaximumBinaryTree(nums.slice(0, maxIdx));

  // Step 4: Recursively build right subtree from suffix
  root.right = constructMaximumBinaryTree(nums.slice(maxIdx + 1));

  return root;
}
```

```java
// Time: O(n²) worst case | Space: O(n) for recursion stack
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

public TreeNode constructMaximumBinaryTree(int[] nums) {
    // Base case: empty array
    if (nums.length == 0) {
        return null;
    }

    // Step 1: Find maximum value and its index
    int maxIdx = 0;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[maxIdx]) {
            maxIdx = i;
        }
    }

    // Step 2: Create root node with maximum value
    TreeNode root = new TreeNode(nums[maxIdx]);

    // Step 3: Recursively build left subtree from prefix
    root.left = constructMaximumBinaryTree(Arrays.copyOfRange(nums, 0, maxIdx));

    // Step 4: Recursively build right subtree from suffix
    root.right = constructMaximumBinaryTree(Arrays.copyOfRange(nums, maxIdx + 1, nums.length));

    return root;
}
```

</div>

**Why this is inefficient:**

- Finding the maximum in each subarray takes O(n) time
- In the worst case (sorted array in descending order), we'll scan O(n) elements at each of n levels, giving O(n²) time complexity
- Creating new arrays for each recursive call uses O(n²) space in the worst case

## Optimized Approach

The key insight is that we can build the tree in a single pass using a **monotonic decreasing stack**. Here's the reasoning:

1. As we process elements left to right, each new element becomes a node
2. The stack maintains nodes in decreasing order (from bottom to top)
3. When we encounter a new element:
   - It becomes the right child of the last smaller element in the stack
   - All elements smaller than it in the stack become its left children
4. This works because in the original array, the maximum element "dominates" all elements to its left and right until a larger element is found

**Why a monotonic stack works:**

- The stack maintains a chain of decreasing values
- Each new element "claims" all smaller elements to its left as its left subtree
- The last smaller element becomes the parent of the new element
- This naturally builds the tree according to the maximum property

## Optimal Solution

Here's the O(n) solution using a monotonic stack:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the stack
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def constructMaximumBinaryTree(nums):
    # Stack to maintain nodes in decreasing order
    stack = []

    # Process each number in the array
    for num in nums:
        # Create a new node for the current number
        node = TreeNode(num)

        # While stack is not empty and current number > top of stack
        # Current number should be parent of all smaller numbers in stack
        while stack and stack[-1].val < num:
            # The last popped node becomes left child of current node
            # This is because in the original array, these smaller numbers
            # appear before the current maximum and belong to its left subtree
            node.left = stack.pop()

        # If stack still has elements, current node is right child of last element
        # This is because the last element in stack is larger than current node
        # and appears before it in the array
        if stack:
            stack[-1].right = node

        # Push current node to stack
        stack.append(node)

    # The first element in stack is the root (largest element in entire array)
    return stack[0] if stack else None
```

```javascript
// Time: O(n) | Space: O(n) for the stack
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function constructMaximumBinaryTree(nums) {
  // Stack to maintain nodes in decreasing order
  const stack = [];

  // Process each number in the array
  for (const num of nums) {
    // Create a new node for the current number
    const node = new TreeNode(num);

    // While stack is not empty and current number > top of stack
    // Current number should be parent of all smaller numbers in stack
    while (stack.length > 0 && stack[stack.length - 1].val < num) {
      // The last popped node becomes left child of current node
      // This is because in the original array, these smaller numbers
      // appear before the current maximum and belong to its left subtree
      node.left = stack.pop();
    }

    // If stack still has elements, current node is right child of last element
    // This is because the last element in stack is larger than current node
    // and appears before it in the array
    if (stack.length > 0) {
      stack[stack.length - 1].right = node;
    }

    // Push current node to stack
    stack.push(node);
  }

  // The first element in stack is the root (largest element in entire array)
  return stack.length > 0 ? stack[0] : null;
}
```

```java
// Time: O(n) | Space: O(n) for the stack
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

public TreeNode constructMaximumBinaryTree(int[] nums) {
    // Stack to maintain nodes in decreasing order
    Stack<TreeNode> stack = new Stack<>();

    // Process each number in the array
    for (int num : nums) {
        // Create a new node for the current number
        TreeNode node = new TreeNode(num);

        // While stack is not empty and current number > top of stack
        // Current number should be parent of all smaller numbers in stack
        while (!stack.isEmpty() && stack.peek().val < num) {
            // The last popped node becomes left child of current node
            // This is because in the original array, these smaller numbers
            // appear before the current maximum and belong to its left subtree
            node.left = stack.pop();
        }

        // If stack still has elements, current node is right child of last element
        // This is because the last element in stack is larger than current node
        // and appears before it in the array
        if (!stack.isEmpty()) {
            stack.peek().right = node;
        }

        // Push current node to stack
        stack.push(node);
    }

    // The first element in stack is the root (largest element in entire array)
    return stack.isEmpty() ? null : stack.get(0);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each element is pushed to the stack exactly once
- Each element is popped from the stack at most once
- Total operations: 2n pushes/pops = O(n)

**Space Complexity: O(n)**

- In the worst case (sorted ascending array), all elements remain in the stack
- The stack stores at most n nodes
- Additional space for the tree itself is O(n) but that's required for output

## Common Mistakes

1. **Forgetting to handle empty input:** Always check if `nums` is empty and return `None`/`null` immediately.

2. **Incorrect index calculations in recursive solution:** When using array slicing, ensure you're using `max_idx + 1` for the right subtree, not `max_idx`.

3. **Not understanding the monotonic stack logic:** The key insight is that when we pop from the stack, we're assigning left children. The popped nodes are smaller and appear before the current node in the array, so they belong to its left subtree.

4. **Assuming the last element in stack is the root:** After processing all elements, the stack contains nodes in decreasing order from bottom to top. The root is the **first** (bottom) element, not the last.

## When You'll See This Pattern

The monotonic stack pattern appears in problems where you need to find the next greater/smaller element or maintain a decreasing/increasing sequence:

1. **Next Greater Element** (LeetCode 496, 503): Finding the next greater element for each element in an array uses a similar monotonic decreasing stack.

2. **Largest Rectangle in Histogram** (LeetCode 84): Uses a monotonic increasing stack to find the nearest smaller element on both sides.

3. **Daily Temperatures** (LeetCode 739): Finding how many days until a warmer temperature uses a monotonic decreasing stack.

4. **Maximum Binary Tree II** (LeetCode 998): The follow-up problem where you insert a new value into an existing maximum binary tree.

## Key Takeaways

1. **Monotonic stacks are perfect for "next greater/smaller" problems:** When you need to process elements in order and maintain relationships with previous elements, consider a monotonic stack.

2. **Tree construction can often be optimized:** While recursive divide-and-conquer is intuitive, many tree construction problems have O(n) solutions using clever traversal or stack-based approaches.

3. **Visualize the relationship between array position and tree structure:** In this problem, elements to the left of a maximum become its left subtree, and elements to the right become its right subtree. This spatial relationship is key to the stack solution.

Related problems: [Maximum Binary Tree II](/problem/maximum-binary-tree-ii)
