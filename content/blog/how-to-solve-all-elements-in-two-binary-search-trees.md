---
title: "How to Solve All Elements in Two Binary Search Trees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode All Elements in Two Binary Search Trees. Medium difficulty, 80.2% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Sorting, Binary Tree."
date: "2028-04-15"
category: "dsa-patterns"
tags:
  [
    "all-elements-in-two-binary-search-trees",
    "tree",
    "depth-first-search",
    "binary-search-tree",
    "medium",
  ]
---

# How to Solve All Elements in Two Binary Search Trees

You're given two binary search trees (BSTs) and need to return all their elements sorted in ascending order. What makes this problem interesting is that while you could simply collect all elements and sort them, the BST property gives us a more efficient approach. The challenge is leveraging the sorted nature of each BST to merge them efficiently without fully sorting everything from scratch.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
Tree 1:        Tree 2:
    2             1
   / \           / \
  1   4         0   3
```

**Step-by-step process:**

1. First, we need to traverse both trees to collect their elements. Since they're BSTs, an in-order traversal gives us sorted lists:
   - Tree 1 in-order: [1, 2, 4]
   - Tree 2 in-order: [0, 1, 3]

2. Now we have two sorted lists: [1, 2, 4] and [0, 1, 3]

3. We can merge these sorted lists efficiently using the merge step from merge sort:
   - Compare first elements: 1 vs 0 → 0 is smaller, add 0 to result
   - Compare 1 vs 1 → both equal, add 1 from first list, then 1 from second
   - Compare 2 vs 3 → 2 is smaller, add 2
   - Compare 4 vs 3 → 3 is smaller, add 3
   - Add remaining 4

4. Final result: [0, 1, 1, 2, 3, 4]

The key insight is that BSTs give us sorted data through in-order traversal, and merging two sorted lists is more efficient than sorting everything from scratch.

## Brute Force Approach

The most straightforward approach is:

1. Traverse both trees (using any traversal method)
2. Collect all elements into a single list
3. Sort the combined list

While this works, it's not optimal. The time complexity would be O((m+n)log(m+n)) where m and n are the number of nodes in each tree. This doesn't leverage the BST property at all - we're treating the trees as regular binary trees.

**Why this isn't optimal:**

- We're ignoring the fact that each BST already contains sorted data
- Sorting from scratch is O(N log N) when we could potentially do better
- This approach would work on any two binary trees, not taking advantage of the BST structure

## Optimized Approach

The optimal solution leverages two key properties:

1. **BST Property**: An in-order traversal of a BST yields elements in sorted order
2. **Merge Algorithm**: Two sorted lists can be merged in linear time

Here's the step-by-step reasoning:

1. **In-order traversal**: Perform in-order traversal on both trees separately. This gives us two sorted lists in O(m+n) time.

2. **Merge two sorted lists**: Use the merge algorithm from merge sort to combine these lists:
   - Initialize two pointers at the start of each list
   - Compare elements at both pointers
   - Add the smaller element to the result and move that pointer forward
   - Continue until all elements are processed

3. **Why this is optimal**:
   - In-order traversal of a BST takes O(n) time and O(h) space (for recursion stack)
   - Merging two sorted lists takes O(m+n) time and O(1) additional space (excluding result storage)
   - Overall: O(m+n) time complexity, which is better than O((m+n)log(m+n)) from the brute force approach

The space complexity is O(m+n) for storing the result, plus O(h1+h2) for the recursion stacks, where h1 and h2 are the heights of the trees.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m+n) where m and n are number of nodes in each tree
# Space: O(m+n) for the result list, plus O(h1+h2) for recursion stacks
class Solution:
    def getAllElements(self, root1: TreeNode, root2: TreeNode) -> List[int]:
        # Helper function for in-order traversal
        def inorder(node, result):
            if not node:
                return
            # In-order: left → root → right
            inorder(node.left, result)
            result.append(node.val)
            inorder(node.right, result)

        # Step 1: Get sorted lists from both trees
        list1, list2 = [], []
        inorder(root1, list1)
        inorder(root2, list2)

        # Step 2: Merge two sorted lists
        merged = []
        i, j = 0, 0

        # Compare elements from both lists and add the smaller one
        while i < len(list1) and j < len(list2):
            if list1[i] <= list2[j]:
                merged.append(list1[i])
                i += 1
            else:
                merged.append(list2[j])
                j += 1

        # Add any remaining elements from list1
        while i < len(list1):
            merged.append(list1[i])
            i += 1

        # Add any remaining elements from list2
        while j < len(list2):
            merged.append(list2[j])
            j += 1

        return merged
```

```javascript
// Time: O(m+n) where m and n are number of nodes in each tree
// Space: O(m+n) for the result array, plus O(h1+h2) for recursion stacks
function getAllElements(root1, root2) {
  // Helper function for in-order traversal
  function inorder(node, result) {
    if (!node) return;
    // In-order: left → root → right
    inorder(node.left, result);
    result.push(node.val);
    inorder(node.right, result);
  }

  // Step 1: Get sorted arrays from both trees
  const list1 = [],
    list2 = [];
  inorder(root1, list1);
  inorder(root2, list2);

  // Step 2: Merge two sorted arrays
  const merged = [];
  let i = 0,
    j = 0;

  // Compare elements from both arrays and add the smaller one
  while (i < list1.length && j < list2.length) {
    if (list1[i] <= list2[j]) {
      merged.push(list1[i]);
      i++;
    } else {
      merged.push(list2[j]);
      j++;
    }
  }

  // Add any remaining elements from list1
  while (i < list1.length) {
    merged.push(list1[i]);
    i++;
  }

  // Add any remaining elements from list2
  while (j < list2.length) {
    merged.push(list2[j]);
    j++;
  }

  return merged;
}
```

```java
// Time: O(m+n) where m and n are number of nodes in each tree
// Space: O(m+n) for the result list, plus O(h1+h2) for recursion stacks
class Solution {
    public List<Integer> getAllElements(TreeNode root1, TreeNode root2) {
        // Step 1: Get sorted lists from both trees
        List<Integer> list1 = new ArrayList<>();
        List<Integer> list2 = new ArrayList<>();
        inorder(root1, list1);
        inorder(root2, list2);

        // Step 2: Merge two sorted lists
        List<Integer> merged = new ArrayList<>();
        int i = 0, j = 0;

        // Compare elements from both lists and add the smaller one
        while (i < list1.size() && j < list2.size()) {
            if (list1.get(i) <= list2.get(j)) {
                merged.add(list1.get(i));
                i++;
            } else {
                merged.add(list2.get(j));
                j++;
            }
        }

        // Add any remaining elements from list1
        while (i < list1.size()) {
            merged.add(list1.get(i));
            i++;
        }

        // Add any remaining elements from list2
        while (j < list2.size()) {
            merged.add(list2.get(j));
            j++;
        }

        return merged;
    }

    // Helper method for in-order traversal
    private void inorder(TreeNode node, List<Integer> result) {
        if (node == null) return;
        // In-order: left → root → right
        inorder(node.left, result);
        result.add(node.val);
        inorder(node.right, result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m+n)**

- In-order traversal of both trees: O(m) + O(n) = O(m+n)
- Merging two sorted lists: O(m+n)
- Total: O(m+n) + O(m+n) = O(m+n)

**Space Complexity: O(m+n)**

- Storing the sorted lists: O(m) + O(n) = O(m+n)
- Storing the merged result: O(m+n)
- Recursion stack for traversal: O(h1+h2) where h1, h2 are tree heights
- In worst case (skewed trees): O(m+n) for recursion stack
- Total: O(m+n) for all lists + O(h1+h2) for recursion

## Common Mistakes

1. **Forgetting that BSTs give sorted output with in-order traversal**: Some candidates use pre-order or post-order traversal, which doesn't give sorted lists. Always remember: in-order traversal of a BST = sorted order.

2. **Not handling duplicates correctly in the merge step**: When list1[i] == list2[j], you can add either one first. The solution above adds from list1 first when values are equal, which maintains stability but either order is acceptable.

3. **Missing edge cases**:
   - One or both trees are empty
   - All elements in one tree are smaller than all elements in the other
   - Trees with only one node
   - Skewed trees (which affect recursion depth)

4. **Inefficient merging**: Some candidates append both lists and sort, which is O((m+n)log(m+n)) instead of O(m+n). Always merge sorted lists linearly when possible.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **BST in-order traversal**: Used whenever you need sorted data from a BST
   - Related problems:
     - [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) - Find the kth smallest element
     - [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) - Check if a tree is a valid BST

2. **Merging sorted lists/arrays**: A core pattern in many algorithms
   - Related problems:
     - [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) - Merge two sorted linked lists
     - [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) - Extension to k lists
     - [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) - More complex merging scenario

## Key Takeaways

1. **Leverage data structure properties**: BSTs give you sorted data through in-order traversal. Always ask: "What special properties does this data structure have that I can use?"

2. **Combine known algorithms**: This problem isn't about inventing new algorithms but combining known ones (in-order traversal + merge algorithm) in the right way.

3. **Think about intermediate data structures**: Sometimes the optimal solution involves creating intermediate sorted data (like lists from BSTs) before performing the final operation.

[Practice this problem on CodeJeet](/problem/all-elements-in-two-binary-search-trees)
