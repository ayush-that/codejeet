---
title: "How to Solve Swap Nodes in Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Swap Nodes in Pairs. Medium difficulty, 69.0% acceptance rate. Topics: Linked List, Recursion."
date: "2026-06-06"
category: "dsa-patterns"
tags: ["swap-nodes-in-pairs", "linked-list", "recursion", "medium"]
---

# How to Solve Swap Nodes in Pairs

This problem asks us to swap every two adjacent nodes in a linked list and return the new head. The challenge is that we can't just swap values—we must physically rearrange the nodes by updating their `next` pointers. This makes it a classic linked list manipulation problem that tests your pointer-handling skills and understanding of recursion vs. iteration.

## Visual Walkthrough

Let's trace through the example `1 → 2 → 3 → 4 → 5`:

**Step 1:** We need to swap nodes 1 and 2. But if we just point 1 to 3 and 2 to 1, we'll lose the connection to the rest of the list. The key insight is we need a "dummy" node that points to the head, so we can easily update what comes before each pair.

**Step 2:** With a dummy node `D → 1 → 2 → 3 → 4 → 5`:

- Point node 2's next to node 1 (creating `2 → 1`)
- Point node 1's next to node 3 (connecting to rest of list)
- Point dummy's next to node 2 (updating the previous node's pointer)

**Step 3:** Now we have `D → 2 → 1 → 3 → 4 → 5`. Move our pointer to node 1 (the node before the next pair) and repeat:

- Point node 4's next to node 3
- Point node 3's next to node 5
- Point node 1's next to node 4

**Step 4:** Continue until we reach the end. The final list becomes `2 → 1 → 4 → 3 → 5`.

## Brute Force Approach

There isn't really a "brute force" solution here since we must swap nodes. However, a common naive approach that candidates sometimes try is:

1. Traverse the list and store all values in an array
2. Swap values in the array pairwise
3. Create a new linked list from the array

This violates the problem constraint "only nodes themselves may be changed" since we're creating a new list. Even if we allowed it, this approach uses O(n) extra space and doesn't teach us anything about pointer manipulation.

Another naive approach might try to swap nodes without using a dummy node, which leads to messy special cases for the head node and makes the code harder to reason about.

## Optimized Approach

The optimal solution uses either iteration or recursion with O(1) extra space. The key insight is that swapping two nodes requires updating three pointers:

1. The previous node's `next` pointer (to point to the new first node of the pair)
2. The second node's `next` pointer (to point to the first node)
3. The first node's `next` pointer (to point to what was after the second node)

**Iterative approach:**

- Create a dummy node that points to the head (simplifies edge cases)
- Use a `prev` pointer that starts at the dummy node
- While there are at least two nodes left to swap:
  - Identify `first` and `second` nodes
  - Update pointers to perform the swap
  - Move `prev` forward to prepare for next swap

**Recursive approach:**

- Base case: if head is null or head.next is null, return head
- Identify `first` and `second` nodes
- Recursively swap the rest of the list starting from `second.next`
- Update pointers to connect the swapped pair to the swapped remainder

Both approaches run in O(n) time and use O(1) extra space (ignoring recursion stack).

## Optimal Solution

Here are complete implementations in three languages:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(1) for iterative, O(n) for recursive (call stack)
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Iterative solution with dummy node
        # Create a dummy node that points to the head
        # This simplifies handling the head swap case
        dummy = ListNode(0)
        dummy.next = head

        # prev points to the node before the current pair
        prev = dummy

        # While there are at least two nodes to swap
        while head and head.next:
            # Nodes to be swapped
            first = head
            second = head.next

            # Swap the pair
            # 1. Point first node to what comes after second
            first.next = second.next
            # 2. Point second node to first (completing the swap)
            second.next = first
            # 3. Update previous node to point to the new first (second)
            prev.next = second

            # Move pointers forward for next iteration
            # prev becomes first (which is now the second node in the pair)
            prev = first
            # head becomes the node after the swapped pair
            head = first.next

        # Return the new head (dummy.next)
        return dummy.next

    # Alternative recursive solution
    def swapPairsRecursive(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Base case: empty list or single node
        if not head or not head.next:
            return head

        # Nodes to be swapped
        first = head
        second = head.next

        # Recursively swap the rest of the list
        # The recursion returns the head of the already-swapped remainder
        swapped_rest = self.swapPairsRecursive(second.next)

        # Perform the swap
        # Point second to first (swap)
        second.next = first
        # Point first to the swapped remainder
        first.next = swapped_rest

        # Second is now the new head of this segment
        return second
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(1) for iterative, O(n) for recursive (call stack)
var swapPairs = function (head) {
  // Iterative solution with dummy node
  // Create a dummy node that points to the head
  const dummy = new ListNode(0);
  dummy.next = head;

  // prev points to the node before the current pair
  let prev = dummy;

  // While there are at least two nodes to swap
  while (head && head.next) {
    // Nodes to be swapped
    const first = head;
    const second = head.next;

    // Swap the pair
    // 1. Point first node to what comes after second
    first.next = second.next;
    // 2. Point second node to first (completing the swap)
    second.next = first;
    // 3. Update previous node to point to the new first (second)
    prev.next = second;

    // Move pointers forward for next iteration
    // prev becomes first (which is now the second node in the pair)
    prev = first;
    // head becomes the node after the swapped pair
    head = first.next;
  }

  // Return the new head (dummy.next)
  return dummy.next;
};

// Alternative recursive solution
var swapPairsRecursive = function (head) {
  // Base case: empty list or single node
  if (!head || !head.next) {
    return head;
  }

  // Nodes to be swapped
  const first = head;
  const second = head.next;

  // Recursively swap the rest of the list
  // The recursion returns the head of the already-swapped remainder
  const swappedRest = swapPairsRecursive(second.next);

  // Perform the swap
  // Point second to first (swap)
  second.next = first;
  // Point first to the swapped remainder
  first.next = swappedRest;

  // Second is now the new head of this segment
  return second;
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(1) for iterative, O(n) for recursive (call stack)
class Solution {
    // Iterative solution
    public ListNode swapPairs(ListNode head) {
        // Create a dummy node that points to the head
        // This simplifies handling the head swap case
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // prev points to the node before the current pair
        ListNode prev = dummy;

        // While there are at least two nodes to swap
        while (head != null && head.next != null) {
            // Nodes to be swapped
            ListNode first = head;
            ListNode second = head.next;

            // Swap the pair
            // 1. Point first node to what comes after second
            first.next = second.next;
            // 2. Point second node to first (completing the swap)
            second.next = first;
            // 3. Update previous node to point to the new first (second)
            prev.next = second;

            // Move pointers forward for next iteration
            // prev becomes first (which is now the second node in the pair)
            prev = first;
            // head becomes the node after the swapped pair
            head = first.next;
        }

        // Return the new head (dummy.next)
        return dummy.next;
    }

    // Alternative recursive solution
    public ListNode swapPairsRecursive(ListNode head) {
        // Base case: empty list or single node
        if (head == null || head.next == null) {
            return head;
        }

        // Nodes to be swapped
        ListNode first = head;
        ListNode second = head.next;

        // Recursively swap the rest of the list
        // The recursion returns the head of the already-swapped remainder
        ListNode swappedRest = swapPairsRecursive(second.next);

        // Perform the swap
        // Point second to first (swap)
        second.next = first;
        // Point first to the swapped remainder
        first.next = swappedRest;

        // Second is now the new head of this segment
        return second;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the linked list. We visit each node exactly once in the iterative approach, and in the recursive approach we make n/2 recursive calls (one for each pair).

**Space Complexity:**

- Iterative: O(1) - we only use a constant amount of extra space for pointers
- Recursive: O(n) in the worst case due to the recursion call stack (n/2 recursive calls)

The iterative approach is generally preferred in interviews since it has better space complexity and demonstrates mastery of pointer manipulation.

## Common Mistakes

1. **Forgetting to update the previous node's pointer:** This is the most common mistake. When swapping nodes 1 and 2, if node 0 originally pointed to node 1, after the swap it must point to node 2. The dummy node pattern helps avoid this.

2. **Losing reference to nodes during swap:** If you reassign pointers in the wrong order, you can lose access to parts of the list. Always save references to nodes before reassigning their `next` pointers.

3. **Not handling odd-length lists correctly:** When there's an odd number of nodes, the last node should remain in place. Make sure your loop condition checks for `head && head.next` (or equivalent) to avoid null pointer errors.

4. **Using value swapping instead of pointer manipulation:** The problem explicitly states "only nodes themselves may be changed," so swapping values is not allowed. This tests your understanding of linked list manipulation.

## When You'll See This Pattern

This "pairwise swapping" pattern appears in several linked list problems:

1. **Reverse Nodes in k-Group (Hard):** This is a generalization where you reverse every k nodes instead of swapping pairs. The same dummy node and pointer manipulation techniques apply, but with more complex pointer updates.

2. **Swapping Nodes in a Linked List (Medium):** While not exactly the same (it swaps two specific nodes by value), it requires similar pointer manipulation skills and understanding of how to swap nodes without losing references.

3. **Reverse Linked List (Easy):** The basic pointer manipulation skills from reversing a linked list are foundational for this problem. Swapping pairs is like doing multiple mini-reversals.

The core technique of using a dummy node and carefully updating pointers in the correct order is essential for many linked list manipulation problems.

## Key Takeaways

1. **Use a dummy node** when you need to modify the head of a linked list. It eliminates special cases and makes pointer updates cleaner.

2. **Save references before reassigning pointers.** When swapping nodes, you typically need to save references to at least three nodes: the two being swapped and the node before them.

3. **The order of pointer updates matters.** Update pointers in an order that doesn't lose access to parts of the list. A common pattern is: update the inner pointers first, then the outer pointers.

Related problems: [Reverse Nodes in k-Group](/problem/reverse-nodes-in-k-group), [Swapping Nodes in a Linked List](/problem/swapping-nodes-in-a-linked-list)
