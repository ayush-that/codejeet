---
title: "How to Solve Remove Nodes From Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Nodes From Linked List. Medium difficulty, 74.8% acceptance rate. Topics: Linked List, Stack, Recursion, Monotonic Stack."
date: "2028-04-05"
category: "dsa-patterns"
tags: ["remove-nodes-from-linked-list", "linked-list", "stack", "recursion", "medium"]
---

# How to Solve Remove Nodes From Linked List

You're given a linked list where you need to remove any node that has a node with greater value anywhere to its right. The challenge is that you can't just compare adjacent nodes—you need to know if there's _any_ greater value to the right, which requires looking ahead in the list.

What makes this problem interesting is that it combines linked list manipulation with the concept of finding "next greater elements," which is typically solved with stacks for arrays. Adapting this pattern to linked lists requires careful pointer management.

## Visual Walkthrough

Let's trace through an example: `[5, 2, 13, 3, 8]`

**Step-by-step reasoning:**

1. Start with node 5. Look to its right: we see 13, which is greater than 5. So node 5 should be removed.
2. Move to node 2. Look to its right: we see 13, which is greater than 2. So node 2 should be removed.
3. Move to node 13. Look to its right: we see 3 and 8, both smaller than 13. So node 13 stays.
4. Move to node 3. Look to its right: we see 8, which is greater than 3. So node 3 should be removed.
5. Move to node 8. There's nothing to the right, so node 8 stays.

Final result: `[13, 8]`

Notice the pattern: we're essentially keeping nodes that form a non-increasing sequence from right to left. The last node always stays, then we work backward, keeping nodes that are greater than or equal to all nodes we've kept so far.

## Brute Force Approach

The most straightforward approach is to check each node against all nodes to its right:

1. For each node in the list
2. Traverse all nodes to its right
3. If any right node has greater value, mark current node for removal
4. After identifying all nodes to remove, rebuild the list

**Why this fails:**

- Time complexity: O(n²) where n is the list length
- For each of n nodes, we traverse up to n nodes to the right
- With n up to 10⁵ (typical LeetCode constraints), this is far too slow

Even though we won't implement this, it's important to recognize why we need a better approach: checking every pair is wasteful when we can use information about maximum values to the right.

## Optimized Approach

The key insight is that we need to process nodes from right to left, but we only have forward pointers in a singly linked list. We have two good options:

**Option 1: Reverse, Process, Reverse Back**

1. Reverse the entire linked list
2. Process from left to right (which was originally right to left), keeping nodes that are greater than or equal to the current maximum
3. Reverse the result back

**Option 2: Use a Stack (Monotonic Decreasing Stack)**

1. Traverse the list, pushing nodes onto a stack
2. When we encounter a node with value greater than the top of stack, pop from stack until stack is empty or top has greater value
3. This maintains nodes in decreasing order from bottom to top of stack
4. Reconstruct the list from the stack

**Option 3: Recursion**

1. Use recursion to reach the end of the list first
2. As we unwind the recursion, we pass back the maximum value seen so far
3. At each step, compare current node with the maximum from its right
4. If current node is smaller, skip it; otherwise, keep it

The recursion approach is elegant and has O(n) time with O(n) space for the call stack. The stack approach also uses O(n) space but might be more intuitive for some. We'll implement the recursion approach as it's clean and demonstrates an important pattern.

## Optimal Solution

The recursive solution processes nodes from right to left by reaching the end first, then making decisions as we return. Each node compares itself with the maximum value from its right side.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for recursion stack
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNodes(self, head: ListNode) -> ListNode:
        # Base case: empty list or last node
        if not head or not head.next:
            return head

        # Recursively process the rest of the list
        # This reaches the end first, then processes nodes on the way back
        next_node = self.removeNodes(head.next)

        # Compare current node with the next node (which represents the
        # maximum of all nodes to the right after processing)
        if head.val < next_node.val:
            # Current node should be removed because there's a greater
            # value to its right. Return next_node instead.
            return next_node
        else:
            # Current node is greater than or equal to all nodes to its right.
            # Keep it and connect it to the processed right portion.
            head.next = next_node
            return head
```

```javascript
// Time: O(n) | Space: O(n) for recursion stack
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

var removeNodes = function (head) {
  // Base case: empty list or last node
  if (!head || !head.next) {
    return head;
  }

  // Recursively process the rest of the list
  // This reaches the end first, then processes nodes on the way back
  const nextNode = removeNodes(head.next);

  // Compare current node with the next node (which represents the
  // maximum of all nodes to the right after processing)
  if (head.val < nextNode.val) {
    // Current node should be removed because there's a greater
    // value to its right. Return nextNode instead.
    return nextNode;
  } else {
    // Current node is greater than or equal to all nodes to its right.
    // Keep it and connect it to the processed right portion.
    head.next = nextNode;
    return head;
  }
};
```

```java
// Time: O(n) | Space: O(n) for recursion stack
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode removeNodes(ListNode head) {
        // Base case: empty list or last node
        if (head == null || head.next == null) {
            return head;
        }

        // Recursively process the rest of the list
        // This reaches the end first, then processes nodes on the way back
        ListNode nextNode = removeNodes(head.next);

        // Compare current node with the next node (which represents the
        // maximum of all nodes to the right after processing)
        if (head.val < nextNode.val) {
            // Current node should be removed because there's a greater
            // value to its right. Return nextNode instead.
            return nextNode;
        } else {
            // Current node is greater than or equal to all nodes to its right.
            // Keep it and connect it to the processed right portion.
            head.next = nextNode;
            return head;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the recursive traversal
- The comparison and pointer updates at each node are O(1) operations
- Total: n nodes × O(1) work per node = O(n)

**Space Complexity: O(n)**

- The recursion stack can go n levels deep in the worst case (completely decreasing list)
- Each recursive call uses constant space for local variables
- Total: O(n) for the call stack
- Note: If we used an iterative approach with an explicit stack, we'd also use O(n) space

## Common Mistakes

1. **Comparing only with immediate neighbor**: The most common mistake is checking only `head.val < head.next.val` instead of checking if there's _any_ greater value to the right. Remember, the problem says "anywhere to the right side," not just immediately to the right.

2. **Forgetting the last node always stays**: The last node in the list has no nodes to its right, so it should never be removed. In our recursive approach, this is handled by the base case that returns the last node unchanged.

3. **Incorrect pointer management when removing nodes**: When you remove a node in a linked list, you need to properly update the `next` pointer of the previous node. In the recursive solution, this happens naturally because we return either the current node or the next node.

4. **Not handling empty or single-node lists**: Always check for edge cases. An empty list (head is None/null) or a single-node list should return itself unchanged.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Monotonic Stack/Decreasing Sequence**: The "next greater element" pattern appears in problems like:
   - **Next Greater Element I** (Easy): Finding the next greater element for each element in an array
   - **Daily Temperatures** (Medium): Finding how many days until a warmer temperature
   - **Largest Rectangle in Histogram** (Hard): Maintaining increasing bars in a histogram

2. **Right-to-Left Processing with Recursion**: When you need information from the right side to make decisions about the current element, recursion that processes from the end backward is often cleaner than trying to look ahead:
   - **Reverse Linked List** (Easy): Can be done recursively by reaching the end first
   - **Palindrome Linked List** (Easy): Often uses recursion or slow/fast pointers to compare first and second halves

## Key Takeaways

1. **When you need to compare each element with future elements, consider processing from right to left**. This lets you carry forward information (like the maximum seen so far) as you go.

2. **Recursion is a natural fit for linked list problems that require backward processing**. Since singly linked lists only have forward pointers, recursion's call stack gives you implicit backward traversal.

3. **The "keep maximum from right" pattern appears in many problems**. Recognizing that you only need to track the maximum value (not all values) to the right is the key optimization over brute force.

Related problems: [Reverse Linked List](/problem/reverse-linked-list), [Delete Node in a Linked List](/problem/delete-node-in-a-linked-list), [Next Greater Element I](/problem/next-greater-element-i)
