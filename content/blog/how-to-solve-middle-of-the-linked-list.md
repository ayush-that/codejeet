---
title: "How to Solve Middle of the Linked List — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Middle of the Linked List. Easy difficulty, 81.6% acceptance rate. Topics: Linked List, Two Pointers."
date: "2026-04-05"
category: "dsa-patterns"
tags: ["middle-of-the-linked-list", "linked-list", "two-pointers", "easy"]
---

# How to Solve Middle of the Linked List

Finding the middle node of a linked list is a classic interview problem that tests your understanding of two-pointer techniques and linked list traversal. While it seems straightforward, the "two middle nodes" requirement and the constraint of a singly linked list make it interesting. You can't directly access nodes by index, and you need to find the middle in a single pass without knowing the total length beforehand.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the linked list: `1 → 2 → 3 → 4 → 5`

**Step 1:** Initialize two pointers: `slow` and `fast`, both pointing to the head (node 1).

**Step 2:** Move `slow` one step (to node 2) and `fast` two steps (to node 3).

**Step 3:** Move `slow` one step (to node 3) and `fast` two steps (to node 5).

**Step 4:** `fast` is now at node 5, and `fast.next` is `null`. The loop stops.

**Step 5:** `slow` is at node 3, which is the middle node.

Now consider an even-length list: `1 → 2 → 3 → 4 → 5 → 6`

**Step 1:** Both pointers start at node 1.

**Step 2:** `slow` moves to node 2, `fast` moves to node 3.

**Step 3:** `slow` moves to node 3, `fast` moves to node 5.

**Step 4:** `slow` moves to node 4, `fast` moves to node 7 (which is `null` since node 6's `next` is `null`).

**Step 5:** The loop stops because `fast` is `null`. `slow` is at node 4, which is the second middle node as required.

The key insight: when `fast` reaches the end, `slow` will be exactly at the middle. For odd-length lists, `fast` ends at the last node. For even-length lists, `fast` ends at `null`, and `slow` ends at the second middle node.

## Brute Force Approach

A naive approach would be to traverse the list once to count the total number of nodes, then traverse again to stop at the middle node. Here's how that would work:

1. First pass: traverse from head to end, counting nodes (let's say we get `n` nodes)
2. Calculate middle index: `n // 2` (using integer division)
3. Second pass: traverse again, stopping at the `(n // 2)`-th node

While this approach works and is easy to understand, it requires two passes through the list. The time complexity is O(2n) = O(n), which isn't terrible, but we can do better with a single pass. More importantly, interviewers expect you to know the two-pointer "tortoise and hare" technique, which is the standard solution for this type of problem.

## Optimal Solution

The optimal solution uses the "tortoise and hare" or "slow and fast pointer" technique. We maintain two pointers: `slow` moves one step at a time, while `fast` moves two steps at a time. When `fast` reaches the end of the list, `slow` will be at the middle.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# We traverse the list once with two pointers, using constant extra space
def middleNode(head):
    """
    Find the middle node of a singly linked list.
    If there are two middle nodes, return the second one.

    Args:
        head: The head node of the linked list

    Returns:
        The middle node of the linked list
    """
    # Initialize both pointers to the head
    slow = head
    fast = head

    # Traverse until fast reaches the end
    # We need to check both fast and fast.next because:
    # - For odd-length lists: fast will end at last node (fast.next is None)
    # - For even-length lists: fast will end at None
    while fast and fast.next:
        # Move slow one step forward
        slow = slow.next

        # Move fast two steps forward
        fast = fast.next.next

    # When fast reaches the end, slow is at the middle
    return slow
```

```javascript
// Time: O(n) | Space: O(1)
// We traverse the list once with two pointers, using constant extra space
function middleNode(head) {
  /**
   * Find the middle node of a singly linked list.
   * If there are two middle nodes, return the second one.
   *
   * @param {ListNode} head - The head node of the linked list
   * @return {ListNode} The middle node of the linked list
   */

  // Initialize both pointers to the head
  let slow = head;
  let fast = head;

  // Traverse until fast reaches the end
  // We need to check both fast and fast.next because:
  // - For odd-length lists: fast will end at last node (fast.next is null)
  // - For even-length lists: fast will end at null
  while (fast !== null && fast.next !== null) {
    // Move slow one step forward
    slow = slow.next;

    // Move fast two steps forward
    fast = fast.next.next;
  }

  // When fast reaches the end, slow is at the middle
  return slow;
}
```

```java
// Time: O(n) | Space: O(1)
// We traverse the list once with two pointers, using constant extra space
public ListNode middleNode(ListNode head) {
    /**
     * Find the middle node of a singly linked list.
     * If there are two middle nodes, return the second one.
     *
     * @param head The head node of the linked list
     * @return The middle node of the linked list
     */

    // Initialize both pointers to the head
    ListNode slow = head;
    ListNode fast = head;

    // Traverse until fast reaches the end
    // We need to check both fast and fast.next because:
    // - For odd-length lists: fast will end at last node (fast.next is null)
    // - For even-length lists: fast will end at null
    while (fast != null && fast.next != null) {
        // Move slow one step forward
        slow = slow.next;

        // Move fast two steps forward
        fast = fast.next.next;
    }

    // When fast reaches the end, slow is at the middle
    return slow;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We traverse the list exactly once. The `fast` pointer moves twice as fast as the `slow` pointer, so when `fast` reaches the end after approximately n/2 steps, `slow` has moved n/2 steps and reached the middle. Even though we have two pointers, we're still making a single pass through the list.

**Space Complexity:** O(1)  
We only use two pointers (`slow` and `fast`) regardless of the input size. No additional data structures are created, and we don't use recursion that would add to the call stack.

## Common Mistakes

1. **Incorrect loop condition:** The most common mistake is using the wrong condition for the `while` loop. You must check both `fast` and `fast.next` before accessing `fast.next.next`. If you only check `fast.next`, you'll get a null pointer error when `fast` is null (even-length lists). If you only check `fast`, you'll get an error when trying to access `fast.next.next` when `fast.next` is null.

2. **Starting slow at head.next:** Some candidates mistakenly start `slow` at `head.next` and `fast` at `head.next.next`, thinking it will save a step. This breaks for small lists (like a single node) and creates off-by-one errors.

3. **Forgetting the "second middle" requirement:** For even-length lists like `[1,2,3,4]`, you need to return node 3 (the second middle), not node 2. The algorithm as written correctly handles this because when `fast` starts at head and moves two steps at a time, `slow` will land on the second middle node for even-length lists.

4. **Not handling edge cases:** Always test with:
   - Empty list (though constraints typically say at least one node)
   - Single node list (`[1]` should return node 1)
   - Two node list (`[1,2]` should return node 2)
   - Both odd and even length lists

## When You'll See This Pattern

The slow/fast pointer technique is fundamental for linked list problems. You'll see it in:

1. **Linked List Cycle Detection (LeetCode 141):** Use slow/fast pointers to detect if a linked list has a cycle. If there's a cycle, the fast pointer will eventually lap the slow pointer.

2. **Find the Duplicate Number (LeetCode 287):** This problem can be solved by treating the array as a linked list where each value points to the index at that value. The duplicate creates a cycle, which you can find using slow/fast pointers.

3. **Palindrome Linked List (LeetCode 234):** Use slow/fast pointers to find the middle, reverse the second half, then compare with the first half.

4. **Reorder List (LeetCode 143):** Find the middle with slow/fast pointers, reverse the second half, then merge the two halves.

The pattern is useful whenever you need to find a specific position (middle, k-th from end) or detect cycles in a linked list without using extra space.

## Key Takeaways

1. **The slow/fast pointer technique** is the standard way to find the middle of a linked list in one pass with O(1) space. Remember: slow moves one step, fast moves two steps.

2. **The loop condition `while fast and fast.next`** (or equivalent in your language) is crucial. It handles both odd and even length lists without errors.

3. **This pattern extends to many other problems** beyond finding the middle. Whenever you need to relate positions in a linked list or detect cycles, consider slow/fast pointers.

The beauty of this solution is its simplicity and efficiency. It demonstrates how a clever algorithmic insight can solve a problem optimally with minimal code.

Related problems: [Delete the Middle Node of a Linked List](/problem/delete-the-middle-node-of-a-linked-list), [Maximum Twin Sum of a Linked List](/problem/maximum-twin-sum-of-a-linked-list)
