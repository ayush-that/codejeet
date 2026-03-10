---
title: "How to Solve Reorder List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reorder List. Medium difficulty, 64.6% acceptance rate. Topics: Linked List, Two Pointers, Stack, Recursion."
date: "2026-07-20"
category: "dsa-patterns"
tags: ["reorder-list", "linked-list", "two-pointers", "stack", "medium"]
---

# How to Solve Reorder List

You're given the head of a singly linked list and need to reorder it so that nodes alternate between the beginning and end: first node, last node, second node, second-to-last node, and so on. The challenge is that you can't use extra space for a copy of the list, and you need to manipulate pointers efficiently in a single pass.

## Visual Walkthrough

Let's trace through an example: `1 → 2 → 3 → 4 → 5`

**Step 1: Find the middle**

- We need to split the list into two halves: `1 → 2 → 3` and `4 → 5`
- The middle is found using slow/fast pointers

**Step 2: Reverse the second half**

- Reverse `4 → 5` to get `5 → 4`

**Step 3: Merge the two halves**

- Take first node from first half: `1`
- Take first node from reversed second half: `5`
- Connect: `1 → 5`
- Move to next in first half: `2`
- Take next from reversed second half: `4`
- Connect: `5 → 2` and `2 → 4`
- Continue until all nodes are connected

Final result: `1 → 5 → 2 → 4 → 3`

## Brute Force Approach

A naive approach would be to store all nodes in an array, then rebuild the list by alternating between the start and end of the array:

1. Traverse the list and store all nodes in an array
2. Use two pointers: `i` starting at 0, `j` starting at the end
3. While `i < j`, connect `array[i]` to `array[j]`, then increment `i`
4. If `i < j`, connect `array[j]` to `array[i]`, then decrement `j`

While this works, it requires O(n) extra space for the array. The problem can be solved with O(1) extra space, so this isn't optimal. Additionally, the array approach doesn't demonstrate mastery of linked list manipulation techniques.

## Optimized Approach

The key insight is that we can solve this in O(1) space by:

1. **Finding the middle** of the list using slow/fast pointers
2. **Reversing the second half** of the list in place
3. **Merging the two halves** by alternating nodes

**Why this works:**

- After finding the middle, we have two separate lists
- Reversing the second half puts the last node first, second-to-last node second, etc.
- Merging alternates between the first half (in original order) and reversed second half (in reverse order), which gives us exactly the pattern we need: L0, Ln, L1, Ln-1, ...

**Step-by-step reasoning:**

1. **Find middle**: Use slow (moves 1 step) and fast (moves 2 steps) pointers. When fast reaches the end, slow is at the middle.
2. **Split and reverse**: Separate the list at the middle, then reverse the second half.
3. **Merge**: Alternate between taking a node from the first half and a node from the reversed second half.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def reorderList(head):
    """
    Reorders a linked list in the pattern: L0 → Ln → L1 → Ln-1 → ...

    Steps:
    1. Find the middle of the list using slow/fast pointers
    2. Reverse the second half of the list
    3. Merge the two halves by alternating nodes
    """
    if not head or not head.next:
        return head

    # Step 1: Find the middle using slow/fast pointers
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Reverse the second half
    # 'slow' is now at the middle (or beginning of second half for even length)
    prev, curr = None, slow
    while curr:
        next_temp = curr.next  # Store next node
        curr.next = prev       # Reverse the link
        prev = curr           # Move prev forward
        curr = next_temp      # Move curr forward

    # 'prev' now points to the head of the reversed second half

    # Step 3: Merge the two halves
    first, second = head, prev
    while second.next:  # We stop when second half is exhausted
        # Store next pointers before we overwrite them
        temp1 = first.next
        temp2 = second.next

        # Reconnect nodes: first → second → first.next
        first.next = second
        second.next = temp1

        # Move pointers forward
        first = temp1
        second = temp2

    return head
```

```javascript
// Time: O(n) | Space: O(1)
function reorderList(head) {
  /**
   * Reorders a linked list in the pattern: L0 → Ln → L1 → Ln-1 → ...
   *
   * Steps:
   * 1. Find the middle of the list using slow/fast pointers
   * 2. Reverse the second half of the list
   * 3. Merge the two halves by alternating nodes
   */
  if (!head || !head.next) return head;

  // Step 1: Find the middle using slow/fast pointers
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 2: Reverse the second half
  // 'slow' is now at the middle (or beginning of second half for even length)
  let prev = null;
  let curr = slow;
  while (curr) {
    const nextTemp = curr.next; // Store next node
    curr.next = prev; // Reverse the link
    prev = curr; // Move prev forward
    curr = nextTemp; // Move curr forward
  }

  // 'prev' now points to the head of the reversed second half

  // Step 3: Merge the two halves
  let first = head;
  let second = prev;
  while (second.next) {
    // We stop when second half is exhausted
    // Store next pointers before we overwrite them
    const temp1 = first.next;
    const temp2 = second.next;

    // Reconnect nodes: first → second → first.next
    first.next = second;
    second.next = temp1;

    // Move pointers forward
    first = temp1;
    second = temp2;
  }

  return head;
}
```

```java
// Time: O(n) | Space: O(1)
public void reorderList(ListNode head) {
    /**
     * Reorders a linked list in the pattern: L0 → Ln → L1 → Ln-1 → ...
     *
     * Steps:
     * 1. Find the middle of the list using slow/fast pointers
     * 2. Reverse the second half of the list
     * 3. Merge the two halves by alternating nodes
     */
    if (head == null || head.next == null) return;

    // Step 1: Find the middle using slow/fast pointers
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse the second half
    // 'slow' is now at the middle (or beginning of second half for even length)
    ListNode prev = null;
    ListNode curr = slow;
    while (curr != null) {
        ListNode nextTemp = curr.next;  // Store next node
        curr.next = prev;               // Reverse the link
        prev = curr;                    // Move prev forward
        curr = nextTemp;                // Move curr forward
    }

    // 'prev' now points to the head of the reversed second half

    // Step 3: Merge the two halves
    ListNode first = head;
    ListNode second = prev;
    while (second.next != null) {  // We stop when second half is exhausted
        // Store next pointers before we overwrite them
        ListNode temp1 = first.next;
        ListNode temp2 = second.next;

        // Reconnect nodes: first → second → first.next
        first.next = second;
        second.next = temp1;

        // Move pointers forward
        first = temp1;
        second = temp2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the middle: O(n/2) ≈ O(n)
- Reversing the second half: O(n/2) ≈ O(n)
- Merging the two halves: O(n/2) ≈ O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant number of pointers (slow, fast, prev, curr, first, second, temp variables)
- No additional data structures that grow with input size
- All operations are done in place by manipulating pointers

## Common Mistakes

1. **Not handling edge cases**: Forgetting to check for empty list (`head is None/null`) or single node list (`head.next is None/null`). These should return immediately.

2. **Incorrect middle finding**: When the list has even length, the slow pointer should end at the first node of the second half. For list `1→2→3→4`, slow should be at `3`, not `2`. This ensures proper splitting.

3. **Forgetting to store next pointers before overwriting**: When merging, you must store `first.next` and `second.next` in temporary variables before reassigning pointers, or you'll lose access to the rest of the list.

4. **Infinite loop in merging**: The merge loop condition should be `while second.next` (not `while second`) because when we have an odd number of nodes, the last node from the first half doesn't need to be connected to anything. If we use `while second`, we might try to connect to a null node.

## When You'll See This Pattern

This problem combines three fundamental linked list techniques that appear frequently:

1. **Slow/Fast Pointers (Tortoise and Hare)**: Used to find the middle of a linked list. Also appears in:
   - **Linked List Cycle** (detect cycles in a linked list)
   - **Middle of the Linked List** (find the middle node)
   - **Palindrome Linked List** (check if a linked list is a palindrome)

2. **Reversing a Linked List**: A core technique for many linked list problems:
   - **Reverse Linked List** (basic reversal)
   - **Reverse Nodes in k-Group** (reverse in groups)
   - **Palindrome Linked List** (reverse half to compare)

3. **Merging Two Lists**: Alternating or interleaving nodes:
   - **Merge Two Sorted Lists** (merge sorted lists)
   - **Interleaving String** (similar pattern with strings)

The combination of these three techniques makes this an excellent problem for testing comprehensive linked list understanding.

## Key Takeaways

1. **The three-step pattern is powerful**: Find middle → Reverse second half → Merge. This pattern solves not just reorder list, but also palindrome checking and other rearrangement problems.

2. **Slow/fast pointers are the optimal way to find the middle** of a linked list when you can't calculate length in advance or want to avoid extra passes.

3. **Always store next pointers before overwriting** when manipulating linked lists. This prevents losing access to parts of the list and is a common source of bugs.

4. **Practice pointer manipulation** until it becomes intuitive. Linked list problems test your ability to visualize and manipulate references, which is fundamental to systems programming and memory management.

Related problems: [Delete the Middle Node of a Linked List](/problem/delete-the-middle-node-of-a-linked-list), [Take K of Each Character From Left and Right](/problem/take-k-of-each-character-from-left-and-right)
