---
title: "How to Solve Swapping Nodes in a Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Swapping Nodes in a Linked List. Medium difficulty, 69.2% acceptance rate. Topics: Linked List, Two Pointers."
date: "2027-06-10"
category: "dsa-patterns"
tags: ["swapping-nodes-in-a-linked-list", "linked-list", "two-pointers", "medium"]
---

# How to Solve Swapping Nodes in a Linked List

You're given the head of a singly linked list and an integer `k`. Your task is to swap the **values** (not the nodes themselves) of the k-th node from the beginning and the k-th node from the end, then return the modified list. The list is 1-indexed, meaning the first node is position 1. What makes this problem interesting is that it combines two classic linked list techniques: finding the k-th node from the beginning (easy) and finding the k-th node from the end (which requires careful pointer manipulation).

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the linked list: `1 → 2 → 3 → 4 → 5` with `k = 2`.

**Step 1: Find the k-th node from the beginning**

- Start at head (position 1): value = 1
- Move to next node (position 2): value = 2 ✓
- This is our first target node

**Step 2: Find the k-th node from the end**

- The list has 5 nodes
- k-th from end = (n - k + 1)-th from beginning
- 5 - 2 + 1 = position 4
- Traverse from head: position 1 (1), position 2 (2), position 3 (3), position 4 (4) ✓
- This is our second target node

**Step 3: Swap the values**

- First node value: 2
- Second node value: 4
- After swap: first node = 4, second node = 2
- Result: `1 → 4 → 3 → 2 → 5`

The key insight is that we need to locate both nodes efficiently without traversing the list multiple times unnecessarily.

## Brute Force Approach

A naive approach would be:

1. Traverse the entire list to count the number of nodes (n)
2. Traverse again to find the k-th node from beginning
3. Traverse again to find the (n-k+1)-th node from beginning (k-th from end)
4. Swap their values

This requires **three passes** through the list. While this technically works with O(n) time complexity, it's inefficient because we're making multiple traversals when we could do it in one. In an interview, you'd be expected to optimize this to a single pass.

Here's what the brute force code might look like:

```python
def swapNodesBruteForce(head, k):
    # First pass: count nodes
    n = 0
    current = head
    while current:
        n += 1
        current = current.next

    # Second pass: find k-th from beginning
    first = head
    for _ in range(k-1):
        first = first.next

    # Third pass: find k-th from end
    second = head
    for _ in range(n-k):
        second = second.next

    # Swap values
    first.val, second.val = second.val, first.val

    return head
```

The problem with this approach isn't time complexity (it's still O(n)), but the multiple passes are unnecessary and show poor optimization skills. Interviewers expect you to recognize that both nodes can be found in a single traversal.

## Optimized Approach

The optimal solution uses the **two-pointer technique** to find both nodes in one pass. Here's the key insight:

1. Start with two pointers: `first` and `second`, both initially at head
2. Move `first` pointer k-1 steps forward to reach the k-th node from beginning
3. Now introduce a third pointer `end_checker` starting at `first`
4. Move both `second` and `end_checker` forward until `end_checker` reaches the end
5. When `end_checker` is at the last node, `second` will be at the k-th node from end!

Why does this work? When `first` reaches the k-th node, there are (n-k) nodes remaining after it. If we start `second` at head and move it forward each time we move `end_checker`, by the time `end_checker` has moved through all (n-k) remaining nodes plus the k-th node itself, `second` will have moved (n-k) steps from head, which puts it at position (n-k+1) from beginning - exactly the k-th node from end!

This is essentially the same technique used in "Remove Nth Node From End of List" but adapted for finding (not removing) nodes.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) - single pass through the list
# Space: O(1) - only using constant extra space
def swapNodes(head, k):
    """
    Swaps the values of the k-th node from beginning
    and k-th node from end in a singly linked list.

    Args:
        head: Head node of the linked list
        k: 1-indexed position from beginning/end to swap

    Returns:
        Head of the modified linked list
    """
    # Edge case: empty list or single node
    if not head or not head.next:
        return head

    # Step 1: Initialize pointers
    first = head      # Will point to k-th node from beginning
    second = head     # Will point to k-th node from end
    end_checker = head  # Helper pointer to find the end

    # Step 2: Move first pointer to k-th node from beginning
    # We need to move k-1 steps to reach the k-th node (1-indexed)
    for _ in range(k - 1):
        # If k is larger than list length, first becomes None
        # This shouldn't happen per problem constraints, but good to check
        if not first:
            return head
        first = first.next

    # Step 3: Position end_checker at first node
    # Now end_checker is k nodes from the beginning
    end_checker = first

    # Step 4: Move second and end_checker together
    # When end_checker reaches the end, second will be at k-th from end
    while end_checker.next:
        second = second.next
        end_checker = end_checker.next

    # Step 5: Swap the values of first and second nodes
    # Note: We're swapping values, not nodes, so no pointer manipulation needed
    first.val, second.val = second.val, first.val

    return head
```

```javascript
// Time: O(n) - single pass through the list
// Space: O(1) - only using constant extra space
function swapNodes(head, k) {
  /**
   * Swaps the values of the k-th node from beginning
   * and k-th node from end in a singly linked list.
   *
   * @param {ListNode} head - Head node of the linked list
   * @param {number} k - 1-indexed position from beginning/end to swap
   * @return {ListNode} Head of the modified linked list
   */

  // Edge case: empty list or single node
  if (!head || !head.next) {
    return head;
  }

  // Step 1: Initialize pointers
  let first = head; // Will point to k-th node from beginning
  let second = head; // Will point to k-th node from end
  let endChecker = head; // Helper pointer to find the end

  // Step 2: Move first pointer to k-th node from beginning
  // We need to move k-1 steps to reach the k-th node (1-indexed)
  for (let i = 0; i < k - 1; i++) {
    // If k is larger than list length, first becomes null
    // This shouldn't happen per problem constraints, but good to check
    if (!first) {
      return head;
    }
    first = first.next;
  }

  // Step 3: Position endChecker at first node
  // Now endChecker is k nodes from the beginning
  endChecker = first;

  // Step 4: Move second and endChecker together
  // When endChecker reaches the end, second will be at k-th from end
  while (endChecker.next) {
    second = second.next;
    endChecker = endChecker.next;
  }

  // Step 5: Swap the values of first and second nodes
  // Note: We're swapping values, not nodes, so no pointer manipulation needed
  [first.val, second.val] = [second.val, first.val];

  return head;
}
```

```java
// Time: O(n) - single pass through the list
// Space: O(1) - only using constant extra space
public ListNode swapNodes(ListNode head, int k) {
    /**
     * Swaps the values of the k-th node from beginning
     * and k-th node from end in a singly linked list.
     *
     * @param head Head node of the linked list
     * @param k 1-indexed position from beginning/end to swap
     * @return Head of the modified linked list
     */

    // Edge case: empty list or single node
    if (head == null || head.next == null) {
        return head;
    }

    // Step 1: Initialize pointers
    ListNode first = head;      // Will point to k-th node from beginning
    ListNode second = head;     // Will point to k-th node from end
    ListNode endChecker = head; // Helper pointer to find the end

    // Step 2: Move first pointer to k-th node from beginning
    // We need to move k-1 steps to reach the k-th node (1-indexed)
    for (int i = 0; i < k - 1; i++) {
        // If k is larger than list length, first becomes null
        // This shouldn't happen per problem constraints, but good to check
        if (first == null) {
            return head;
        }
        first = first.next;
    }

    // Step 3: Position endChecker at first node
    // Now endChecker is k nodes from the beginning
    endChecker = first;

    // Step 4: Move second and endChecker together
    // When endChecker reaches the end, second will be at k-th from end
    while (endChecker.next != null) {
        second = second.next;
        endChecker = endChecker.next;
    }

    // Step 5: Swap the values of first and second nodes
    // Note: We're swapping values, not nodes, so no pointer manipulation needed
    int temp = first.val;
    first.val = second.val;
    second.val = temp;

    return head;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the list exactly once from beginning to end
- The `first` pointer moves k-1 steps, then `end_checker` moves from position k to the end (n-k steps)
- Total operations: (k-1) + (n-k) = n-1 ≈ O(n)

**Space Complexity: O(1)**

- We only use three pointer variables (`first`, `second`, `end_checker`)
- No additional data structures are created
- The swap is done in-place by exchanging values

## Common Mistakes

1. **Swapping nodes instead of values**: The problem specifically asks to swap values, not nodes. Swapping nodes would require careful pointer manipulation of previous nodes, which is more complex and error-prone. Always read the problem statement carefully.

2. **Off-by-one errors with 1-indexing**: Remember the list is 1-indexed, so the k-th node requires moving k-1 steps from head. A common mistake is moving k steps instead of k-1.

3. **Not handling the case where k-th from beginning equals k-th from end**: When the list has an odd length and k is the middle position, both pointers point to the same node. Swapping a node with itself is fine, but some candidates add unnecessary checks that complicate the code.

4. **Forgetting to move `end_checker` to `first` before starting the second phase**: If you continue moving from head instead of from the `first` node, the distance calculation will be wrong. The `end_checker` needs to start at the k-th node so that when it reaches the end, `second` has moved exactly (n-k) steps from head.

## When You'll See This Pattern

The two-pointer technique used here appears in many linked list problems:

1. **Remove Nth Node From End of List (LeetCode #19)**: Almost identical pointer movement pattern - use a fast pointer to create a gap of n nodes from a slow pointer, then move both until fast reaches the end.

2. **Middle of the Linked List (LeetCode #876)**: Use slow and fast pointers where fast moves twice as fast. When fast reaches the end, slow is at the middle.

3. **Linked List Cycle II (LeetCode #142)**: Uses Floyd's cycle detection algorithm with slow and fast pointers to detect and find the start of a cycle.

The core pattern is: **Use two pointers moving at different speeds or starting at different positions to measure distances or find positions relative to the end without knowing the total length.**

## Key Takeaways

1. **The two-pointer technique is powerful for finding positions from the end** without knowing the list length. By creating a fixed gap between pointers and walking them together, you can find the n-th node from the end in one pass.

2. **Read carefully whether to swap values or nodes**. Many linked list problems ask for node manipulation, but this one specifically asks for value swapping, which is simpler. Don't overcomplicate the solution.

3. **Visualize pointer movements with concrete examples**. Drawing the list and tracing pointer movements step-by-step helps avoid off-by-one errors and builds intuition for the distance relationships.

Related problems: [Remove Nth Node From End of List](/problem/remove-nth-node-from-end-of-list), [Swap Nodes in Pairs](/problem/swap-nodes-in-pairs), [Reverse Nodes in k-Group](/problem/reverse-nodes-in-k-group)
