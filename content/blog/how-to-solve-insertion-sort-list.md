---
title: "How to Solve Insertion Sort List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Insertion Sort List. Medium difficulty, 58.5% acceptance rate. Topics: Linked List, Sorting."
date: "2027-05-22"
category: "dsa-patterns"
tags: ["insertion-sort-list", "linked-list", "sorting", "medium"]
---

# How to Solve Insertion Sort List

This problem asks us to sort a singly linked list using the insertion sort algorithm. While insertion sort is straightforward on arrays, implementing it on a linked list presents unique challenges because we can't easily traverse backward or access elements by index. The key difficulty lies in efficiently finding the correct insertion position for each node while maintaining proper pointer connections.

## Visual Walkthrough

Let's trace through sorting the list `4 → 2 → 1 → 3` using insertion sort:

**Initial state:**  
Sorted portion: empty  
Unsorted portion: `4 → 2 → 1 → 3`

**Step 1:** Take first node `4` from unsorted portion  
Sorted portion: `4`  
Unsorted portion: `2 → 1 → 3`

**Step 2:** Take node `2` from unsorted portion  
Find where `2` belongs in sorted portion `4`:

- Compare `2` with `4`: `2 < 4`, so insert before `4`  
  Sorted portion: `2 → 4`  
  Unsorted portion: `1 → 3`

**Step 3:** Take node `1` from unsorted portion  
Find where `1` belongs in sorted portion `2 → 4`:

- Compare `1` with `2`: `1 < 2`, so insert before `2`  
  Sorted portion: `1 → 2 → 4`  
  Unsorted portion: `3`

**Step 4:** Take node `3` from unsorted portion  
Find where `3` belongs in sorted portion `1 → 2 → 4`:

- Compare `3` with `1`: `3 > 1`, move forward
- Compare `3` with `2`: `3 > 2`, move forward
- Compare `3` with `4`: `3 < 4`, insert before `4`  
  Sorted portion: `1 → 2 → 3 → 4`  
  Unsorted portion: empty

The sorted list is `1 → 2 → 3 → 4`.

## Brute Force Approach

A naive approach might try to convert the linked list to an array, sort the array, then rebuild the linked list. While this would work, it violates the problem's intent to implement insertion sort specifically on the linked list structure. More importantly, it uses O(n) extra space for the array, which isn't necessary.

Another brute force approach would be to repeatedly scan the entire sorted portion for each new node, which is essentially what insertion sort does. However, an unoptimized implementation might use extra pointers incorrectly or fail to handle edge cases properly.

## Optimized Approach

The key insight is that we need to maintain two separate portions of the list: a sorted portion that grows as we process nodes, and an unsorted portion that shrinks. For each node from the unsorted portion, we traverse the sorted portion to find its correct position and insert it there.

The tricky part is managing pointers correctly:

1. We need a dummy head node to handle insertions at the beginning of the sorted list
2. We must carefully disconnect nodes from the unsorted portion before inserting them
3. We need to track the previous node in the sorted portion to perform insertions

The algorithm works as follows:

1. Create a dummy node that points to the sorted portion (initially empty)
2. Iterate through each node in the original list
3. For each node, traverse the sorted portion starting from the dummy node
4. Find the first node in sorted portion whose value is greater than current node
5. Insert current node between the previous node and the found node
6. Continue until all nodes are processed

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def insertionSortList(head):
    """
    Sort a linked list using insertion sort algorithm.

    Args:
        head: Head node of the unsorted linked list

    Returns:
        Head node of the sorted linked list
    """
    # Edge case: empty list or single node
    if not head or not head.next:
        return head

    # Create a dummy node that will serve as the starting point
    # of our sorted list. This helps handle insertions at the beginning.
    dummy = ListNode(0)
    # 'current' will traverse the original unsorted list
    current = head

    # Process each node in the original list
    while current:
        # Store the next node to process before we disconnect current
        next_node = current.next

        # 'prev' will help us find the insertion point in the sorted portion
        # We always start from the dummy node
        prev = dummy

        # Find the correct position to insert current node in sorted portion
        # We look for the first node in sorted portion with value > current.val
        while prev.next and prev.next.val < current.val:
            prev = prev.next

        # Insert current node between prev and prev.next
        # Step 1: Connect current node to what comes after prev
        current.next = prev.next
        # Step 2: Connect prev to current node
        prev.next = current

        # Move to the next node in the original list
        current = next_node

    # Return the sorted list (dummy.next points to the actual head)
    return dummy.next
```

```javascript
// Time: O(n²) | Space: O(1)
function insertionSortList(head) {
  /**
   * Sort a linked list using insertion sort algorithm.
   *
   * @param {ListNode} head - Head node of the unsorted linked list
   * @return {ListNode} Head node of the sorted linked list
   */
  // Edge case: empty list or single node
  if (!head || !head.next) {
    return head;
  }

  // Create a dummy node that will serve as the starting point
  // of our sorted list. This helps handle insertions at the beginning.
  const dummy = new ListNode(0);
  // 'current' will traverse the original unsorted list
  let current = head;

  // Process each node in the original list
  while (current) {
    // Store the next node to process before we disconnect current
    const nextNode = current.next;

    // 'prev' will help us find the insertion point in the sorted portion
    // We always start from the dummy node
    let prev = dummy;

    // Find the correct position to insert current node in sorted portion
    // We look for the first node in sorted portion with value > current.val
    while (prev.next && prev.next.val < current.val) {
      prev = prev.next;
    }

    // Insert current node between prev and prev.next
    // Step 1: Connect current node to what comes after prev
    current.next = prev.next;
    // Step 2: Connect prev to current node
    prev.next = current;

    // Move to the next node in the original list
    current = nextNode;
  }

  // Return the sorted list (dummy.next points to the actual head)
  return dummy.next;
}
```

```java
// Time: O(n²) | Space: O(1)
public ListNode insertionSortList(ListNode head) {
    /**
     * Sort a linked list using insertion sort algorithm.
     *
     * @param head Head node of the unsorted linked list
     * @return Head node of the sorted linked list
     */
    // Edge case: empty list or single node
    if (head == null || head.next == null) {
        return head;
    }

    // Create a dummy node that will serve as the starting point
    // of our sorted list. This helps handle insertions at the beginning.
    ListNode dummy = new ListNode(0);
    // 'current' will traverse the original unsorted list
    ListNode current = head;

    // Process each node in the original list
    while (current != null) {
        // Store the next node to process before we disconnect current
        ListNode nextNode = current.next;

        // 'prev' will help us find the insertion point in the sorted portion
        // We always start from the dummy node
        ListNode prev = dummy;

        // Find the correct position to insert current node in sorted portion
        // We look for the first node in sorted portion with value > current.val
        while (prev.next != null && prev.next.val < current.val) {
            prev = prev.next;
        }

        // Insert current node between prev and prev.next
        // Step 1: Connect current node to what comes after prev
        current.next = prev.next;
        // Step 2: Connect prev to current node
        prev.next = current;

        // Move to the next node in the original list
        current = nextNode;
    }

    // Return the sorted list (dummy.next points to the actual head)
    return dummy.next;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case, where n is the number of nodes in the list.

- For each of the n nodes, we may need to traverse the entire sorted portion to find the insertion point.
- In the worst case (reverse sorted list), the first node stays in place, the second node compares with 1 node, the third with 2 nodes, and so on: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2 comparisons → O(n²).
- In the best case (already sorted list), each node is inserted at the end with O(1) comparisons → O(n).

**Space Complexity:** O(1) auxiliary space.

- We only use a constant number of pointers (dummy, current, prev, next_node).
- We're rearranging the existing nodes, not creating new ones.

## Common Mistakes

1. **Forgetting to store the next node before disconnecting:** When we remove a node from the unsorted portion, we lose access to the rest of the list if we don't store `current.next` before modifying `current.next`.

2. **Incorrect insertion logic:** The order of pointer assignments matters. We must do `current.next = prev.next` before `prev.next = current`. Doing it in reverse would create a cycle.

3. **Not using a dummy node:** Without a dummy node, inserting at the beginning of the sorted list requires special case handling. The dummy node simplifies the code significantly.

4. **Infinite loops from pointer mishandling:** If you accidentally create a cycle (e.g., by pointing a node to itself or creating a circular reference), you'll get an infinite loop. Always trace through a small example to verify pointer assignments.

## When You'll See This Pattern

The insertion sort pattern on linked lists appears in problems where you need to maintain sorted order while processing elements one by one:

1. **Sort List (LeetCode 148):** While this problem can be solved more efficiently with merge sort (O(n log n)), understanding insertion sort helps contrast different sorting algorithms on linked lists.

2. **Insert into a Sorted Circular Linked List (LeetCode 708):** This problem requires finding the correct insertion point in a sorted circular list, which uses similar traversal logic.

3. **Merge Two Sorted Lists (LeetCode 21):** While merging uses a different approach, both problems involve traversing sorted portions and making pointer adjustments.

The pattern of maintaining a sorted portion and inserting new elements in the correct position is fundamental to many algorithms beyond just insertion sort.

## Key Takeaways

1. **Dummy nodes simplify edge cases:** When working with linked list modifications, a dummy head node can eliminate special handling for insertions at the beginning.

2. **Pointer manipulation order matters:** When rearranging linked list nodes, the sequence of `next` pointer assignments is critical to avoid losing nodes or creating cycles.

3. **Insertion sort is naturally suited for linked lists:** Unlike array insertion sort that requires shifting elements, linked list insertion only requires changing a few pointers, making it more space-efficient despite the same time complexity.

Related problems: [Sort List](/problem/sort-list), [Insert into a Sorted Circular Linked List](/problem/insert-into-a-sorted-circular-linked-list)
