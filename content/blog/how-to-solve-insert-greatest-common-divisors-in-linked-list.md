---
title: "How to Solve Insert Greatest Common Divisors in Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Insert Greatest Common Divisors in Linked List. Medium difficulty, 91.4% acceptance rate. Topics: Linked List, Math, Number Theory."
date: "2028-01-30"
category: "dsa-patterns"
tags:
  [
    "insert-greatest-common-divisors-in-linked-list",
    "linked-list",
    "math",
    "number-theory",
    "medium",
  ]
---

# How to Solve Insert Greatest Common Divisors in Linked List

You're given the head of a singly linked list where each node contains an integer. Your task is to insert a new node between every pair of adjacent nodes, where the new node's value equals the greatest common divisor (GCD) of the two adjacent nodes' values. Return the modified linked list.

What makes this problem interesting is that it combines linked list manipulation with mathematical computation. While the GCD calculation is straightforward, the challenge lies in correctly traversing the linked list while simultaneously inserting new nodes without losing references to the rest of the list.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have the linked list: `18 → 6 → 10 → 3`

**Step 1:** Start at the first node (18) and look at its neighbor (6)

- Calculate GCD(18, 6) = 6
- Insert a new node with value 6 between 18 and 6
- List becomes: `18 → 6 → 6 → 10 → 3`

**Step 2:** Move to the next original node (now the second 6, which was originally the 6)

- Look at its neighbor (10)
- Calculate GCD(6, 10) = 2
- Insert a new node with value 2 between 6 and 10
- List becomes: `18 → 6 → 6 → 2 → 10 → 3`

**Step 3:** Move to the next original node (10)

- Look at its neighbor (3)
- Calculate GCD(10, 3) = 1
- Insert a new node with value 1 between 10 and 3
- List becomes: `18 → 6 → 6 → 2 → 10 → 1 → 3`

The key insight is that we need to process nodes in pairs while maintaining the ability to continue traversing the list after inserting new nodes.

## Brute Force Approach

For this problem, there's essentially only one reasonable approach since we must examine every adjacent pair in the linked list. However, let's consider what a naive implementation might look like and the pitfalls to avoid.

A brute force approach would involve:

1. Traversing the entire list to collect all values into an array
2. Calculating GCDs for each adjacent pair in the array
3. Creating a completely new linked list with the original values plus the GCD nodes

While this approach would work, it's inefficient in terms of space (O(n) extra space for the array) and doesn't demonstrate proper linked list manipulation skills. More importantly, it doesn't modify the original list in-place, which is typically expected in linked list problems.

The real challenge isn't algorithmic complexity but rather pointer manipulation. We need to insert nodes between existing nodes while ensuring we don't lose track of the rest of the list.

## Optimized Approach

The optimal approach uses a single pass through the linked list with careful pointer management. Here's the step-by-step reasoning:

1. **Traverse the list**: We need to examine each adjacent pair of nodes, so we'll use a `current` pointer starting at `head`.

2. **Process each pair**: For each `current` node, we look at `current.next` (if it exists) to get the adjacent node.

3. **Calculate GCD**: Compute the greatest common divisor of `current.val` and `current.next.val`.

4. **Insert new node**: Create a new node with the GCD value, then adjust pointers:
   - New node's `next` should point to `current.next`
   - `current.next` should point to the new node

5. **Advance pointer**: Move `current` two steps forward (past the newly inserted node) to reach the next original node.

The key insight is that after inserting a node between `current` and `current.next`, we need to skip over the newly inserted node to get to the next original node for processing.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

# Time: O(n * log(min(a,b))) where n is number of nodes, a and b are node values
# Space: O(1) - we only use constant extra space
class Solution:
    def insertGreatestCommonDivisors(self, head):
        # Edge case: if list is empty or has only one node, nothing to insert
        if not head or not head.next:
            return head

        # Start from the head of the list
        current = head

        # Traverse the list while there's at least one more node after current
        while current and current.next:
            # Get the values of the current node and its neighbor
            a = current.val
            b = current.next.val

            # Calculate GCD using Euclidean algorithm
            # This is more efficient than checking all divisors
            gcd_val = self.compute_gcd(a, b)

            # Create a new node with the GCD value
            new_node = ListNode(gcd_val)

            # Insert the new node between current and current.next
            # Step 1: New node points to current's original next
            new_node.next = current.next
            # Step 2: Current node now points to the new node
            current.next = new_node

            # Move current pointer two steps forward
            # We skip over the newly inserted node to get to the next original node
            current = new_node.next

        return head

    def compute_gcd(self, a, b):
        # Euclidean algorithm for GCD
        # Keep dividing until remainder is 0
        while b:
            a, b = b, a % b
        return a
```

```javascript
// Definition for singly-linked list.
// function ListNode(val, next) {
//     this.val = (val===undefined ? 0 : val)
//     this.next = (next===undefined ? null : next)
// }

// Time: O(n * log(min(a,b))) where n is number of nodes, a and b are node values
// Space: O(1) - we only use constant extra space
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var insertGreatestCommonDivisors = function (head) {
  // Edge case: if list is empty or has only one node, nothing to insert
  if (!head || !head.next) {
    return head;
  }

  // Start from the head of the list
  let current = head;

  // Traverse the list while there's at least one more node after current
  while (current && current.next) {
    // Get the values of the current node and its neighbor
    const a = current.val;
    const b = current.next.val;

    // Calculate GCD using Euclidean algorithm
    const gcdVal = computeGCD(a, b);

    // Create a new node with the GCD value
    const newNode = new ListNode(gcdVal);

    // Insert the new node between current and current.next
    // Step 1: New node points to current's original next
    newNode.next = current.next;
    // Step 2: Current node now points to the new node
    current.next = newNode;

    // Move current pointer two steps forward
    // We skip over the newly inserted node to get to the next original node
    current = newNode.next;
  }

  return head;
};

// Helper function to compute GCD using Euclidean algorithm
function computeGCD(a, b) {
  // Euclidean algorithm for GCD
  // Keep dividing until remainder is 0
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
```

```java
// Definition for singly-linked list.
// public class ListNode {
//     int val;
//     ListNode next;
//     ListNode() {}
//     ListNode(int val) { this.val = val; }
//     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
// }

// Time: O(n * log(min(a,b))) where n is number of nodes, a and b are node values
// Space: O(1) - we only use constant extra space
class Solution {
    public ListNode insertGreatestCommonDivisors(ListNode head) {
        // Edge case: if list is empty or has only one node, nothing to insert
        if (head == null || head.next == null) {
            return head;
        }

        // Start from the head of the list
        ListNode current = head;

        // Traverse the list while there's at least one more node after current
        while (current != null && current.next != null) {
            // Get the values of the current node and its neighbor
            int a = current.val;
            int b = current.next.val;

            // Calculate GCD using Euclidean algorithm
            int gcdVal = computeGCD(a, b);

            // Create a new node with the GCD value
            ListNode newNode = new ListNode(gcdVal);

            // Insert the new node between current and current.next
            // Step 1: New node points to current's original next
            newNode.next = current.next;
            // Step 2: Current node now points to the new node
            current.next = newNode;

            // Move current pointer two steps forward
            // We skip over the newly inserted node to get to the next original node
            current = newNode.next;
        }

        return head;
    }

    // Helper method to compute GCD using Euclidean algorithm
    private int computeGCD(int a, int b) {
        // Euclidean algorithm for GCD
        // Keep dividing until remainder is 0
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × log(min(a,b)))

- We traverse through the linked list once, which takes O(n) time where n is the number of nodes
- For each adjacent pair, we compute GCD using the Euclidean algorithm, which takes O(log(min(a,b))) time in the worst case
- Since we process approximately n-1 pairs, the total time is O(n × log(min(a,b)))

**Space Complexity:** O(1)

- We only use a constant amount of extra space for pointers and temporary variables
- The new nodes we create are part of the output, so they don't count toward auxiliary space complexity

## Common Mistakes

1. **Forgetting to handle edge cases**: Not checking for empty list or single-node list. Always ask: "What if head is null? What if head.next is null?"

2. **Incorrect pointer advancement after insertion**: After inserting a new node between current and current.next, some candidates incorrectly advance by only one node (to the newly inserted node), causing them to process the same pair repeatedly or skip nodes. Remember: you need to skip over the newly inserted node to get to the next original node.

3. **Using inefficient GCD calculation**: Some candidates might implement GCD by checking all numbers up to min(a,b), which is O(min(a,b)) time. The Euclidean algorithm (using modulo) is much more efficient at O(log(min(a,b))).

4. **Losing reference to the rest of the list**: When inserting a new node, it's crucial to save the reference to current.next BEFORE modifying current.next. The correct order is:
   - Create new node
   - Set new node's next to current.next
   - Then set current.next to new node

## When You'll See This Pattern

This problem combines two important patterns:

1. **Linked List In-Place Modification**: Similar to problems like "Reverse Linked List" or "Swap Nodes in Pairs", where you need to modify node connections while traversing. The key skill is managing pointers without losing track of the rest of the list.

2. **Mathematical Computation in Data Structures**: Problems that combine data structure manipulation with mathematical operations, like "Add Two Numbers" (linked list addition) or "Plus One Linked List".

Related problems:

- **Reverse Linked List (Easy)**: Similar pointer manipulation but with reversal logic
- **Swap Nodes in Pairs (Medium)**: Requires careful pointer adjustment between nodes
- **Add Two Numbers (Medium)**: Combines linked list traversal with arithmetic operations

## Key Takeaways

1. **When inserting nodes in a linked list, always save references before modifying pointers**. Think: "What will I lose access to if I change this pointer?"

2. **The Euclidean algorithm is the optimal way to compute GCD**. Remember: while(b) { a, b = b, a % b } returns a as the GCD.

3. **For in-place linked list modifications, use a current pointer and think about how many steps to advance after each operation**. Drawing a diagram with boxes (nodes) and arrows (pointers) can prevent off-by-one errors.

Related problems: [Reverse Linked List](/problem/reverse-linked-list)
