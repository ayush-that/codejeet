---
title: "How to Solve Merge Two Sorted Lists — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Merge Two Sorted Lists. Easy difficulty, 68.0% acceptance rate. Topics: Linked List, Recursion."
date: "2026-02-10"
category: "dsa-patterns"
tags: ["merge-two-sorted-lists", "linked-list", "recursion", "easy"]
---

# How to Solve Merge Two Sorted Lists

You're given two sorted linked lists and need to merge them into a single sorted list by splicing their nodes together. While this is an "Easy" problem, it's a fundamental building block for more complex linked list and merge operations. The challenge lies in managing pointers correctly without losing track of nodes, especially when dealing with edge cases like empty lists or lists of different lengths.

## Visual Walkthrough

Let's trace through merging `list1 = [1, 3, 5]` and `list2 = [2, 4, 6]`:

**Step 1:** We create a dummy node to serve as the starting point. This avoids special cases for the first node.

- Dummy → None
- Current pointer points to dummy

**Step 2:** Compare heads: 1 vs 2. Since 1 < 2, we attach node 1 to our merged list.

- Dummy → 1
- Current moves to node 1
- list1 moves to node 3

**Step 3:** Compare heads: 3 vs 2. Since 2 < 3, we attach node 2.

- Dummy → 1 → 2
- Current moves to node 2
- list2 moves to node 4

**Step 4:** Compare heads: 3 vs 4. Since 3 < 4, we attach node 3.

- Dummy → 1 → 2 → 3
- Current moves to node 3
- list1 moves to node 5

**Step 5:** Compare heads: 5 vs 4. Since 4 < 5, we attach node 4.

- Dummy → 1 → 2 → 3 → 4
- Current moves to node 4
- list2 moves to node 6

**Step 6:** Compare heads: 5 vs 6. Since 5 < 6, we attach node 5.

- Dummy → 1 → 2 → 3 → 4 → 5
- Current moves to node 5
- list1 becomes None

**Step 7:** list1 is exhausted, so we attach the remaining nodes from list2 (just node 6).

- Dummy → 1 → 2 → 3 → 4 → 5 → 6

**Step 8:** Return dummy.next (which is node 1) as the head of the merged list.

## Brute Force Approach

A naive approach might be to collect all values into an array, sort the array, then build a new linked list. While this would produce the correct result, it's inefficient:

1. Traverse both lists to collect values: O(n + m) time
2. Sort the combined array: O((n+m)log(n+m)) time
3. Build a new linked list: O(n + m) time and space

The main issue is the unnecessary sorting step. Since both input lists are already sorted, we can merge them in linear time without any sorting. Additionally, this approach doesn't satisfy the problem requirement to "splice together the nodes" - it creates entirely new nodes instead of reusing the existing ones.

The brute force also uses extra space for the array and new nodes, while we could merge in-place with O(1) extra space (excluding the output).

## Optimal Solution

The optimal approach uses a two-pointer technique with a dummy node. We maintain pointers to the current positions in both lists and compare their values. The smaller node gets attached to our merged list, and we move that list's pointer forward. We continue until one list is exhausted, then attach the remainder of the other list.

The dummy node trick is crucial: it gives us a starting point without worrying about whether our merged list is empty, and we can simply return `dummy.next` as the final head.

<div class="code-group">

```python
# Time: O(n + m) where n and m are lengths of the two lists
# Space: O(1) - we only use a constant amount of extra space
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    # Create a dummy node to serve as the starting point of the merged list
    # This avoids special cases for the first node
    dummy = ListNode()

    # 'current' will always point to the last node in our merged list
    current = dummy

    # Traverse both lists while neither is exhausted
    while list1 and list2:
        # Compare values at current positions of both lists
        if list1.val <= list2.val:
            # list1's node is smaller or equal, so attach it to merged list
            current.next = list1
            # Move list1 pointer forward
            list1 = list1.next
        else:
            # list2's node is smaller, so attach it to merged list
            current.next = list2
            # Move list2 pointer forward
            list2 = list2.next

        # Move current pointer forward to the newly added node
        current = current.next

    # At this point, one list is exhausted
    # Attach the remaining nodes from the non-empty list (if any)
    # This works because the remaining list is already sorted
    current.next = list1 if list1 else list2

    # Return the head of the merged list (skip the dummy node)
    return dummy.next
```

```javascript
// Time: O(n + m) where n and m are lengths of the two lists
// Space: O(1) - we only use a constant amount of extra space
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeTwoLists(list1, list2) {
  // Create a dummy node to serve as the starting point
  // This eliminates edge cases for empty lists
  const dummy = new ListNode();

  // 'current' tracks the last node in our merged list
  let current = dummy;

  // Continue while both lists have nodes remaining
  while (list1 !== null && list2 !== null) {
    // Compare current nodes from both lists
    if (list1.val <= list2.val) {
      // list1's node is smaller or equal, attach it
      current.next = list1;
      // Advance list1 pointer
      list1 = list1.next;
    } else {
      // list2's node is smaller, attach it
      current.next = list2;
      // Advance list2 pointer
      list2 = list2.next;
    }

    // Move current pointer to the newly added node
    current = current.next;
  }

  // One list is now empty
  // Attach whatever remains of the other list (could be null)
  // No need for additional loops since the rest is already connected
  current.next = list1 !== null ? list1 : list2;

  // Return the actual head (skip the dummy node)
  return dummy.next;
}
```

```java
// Time: O(n + m) where n and m are lengths of the two lists
// Space: O(1) - we only use a constant amount of extra space
public class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Create a dummy node to simplify edge cases
        // This ensures we always have a node to attach to
        ListNode dummy = new ListNode();

        // 'current' points to the last node in our merged list
        ListNode current = dummy;

        // Process nodes while both lists have elements
        while (list1 != null && list2 != null) {
            // Compare values to determine which node comes next
            if (list1.val <= list2.val) {
                // list1's node is smaller or equal
                current.next = list1;
                // Move list1 pointer forward
                list1 = list1.next;
            } else {
                // list2's node is smaller
                current.next = list2;
                // Move list2 pointer forward
                list2 = list2.next;
            }

            // Advance current to the newly added node
            current = current.next;
        }

        // At least one list is now empty
        // Attach the remainder of the non-empty list
        // The ternary operator handles both cases elegantly
        current.next = (list1 != null) ? list1 : list2;

        // Return the head of the actual merged list
        return dummy.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m), where n is the length of list1 and m is the length of list2. We visit each node exactly once. The comparison and pointer updates are constant time operations, so the total time is linear in the combined length of both lists.

**Space Complexity:** O(1) auxiliary space. We only use a few pointers (dummy, current) regardless of input size. The output list reuses the input nodes, so no additional nodes are created. Some might argue it's O(n + m) for the output, but that's not considered extra space since it's the required output.

## Common Mistakes

1. **Forgetting the dummy node:** Many candidates try to handle the first node as a special case, which leads to messy code and edge case bugs. The dummy node pattern simplifies the logic significantly.

2. **Losing track of nodes when updating pointers:** A classic mistake is updating pointers in the wrong order. For example:

   ```python
   current.next = list1
   list1 = list1.next  # Wrong! list1.next is now current.next
   ```

   Always save what you need before overwriting pointers.

3. **Not handling empty lists:** Failing to check if `list1` or `list2` is `None`/`null` at the beginning. With the dummy node approach, this is handled automatically since the while loop won't execute if either list is empty, and the final `current.next` assignment will attach the non-empty list (or `None`/`null` if both are empty).

4. **Infinite loops from circular references:** If you accidentally create a cycle (like pointing a node's `next` back to itself or to an earlier node), you'll get an infinite loop. Always ensure you're moving pointers forward correctly.

## When You'll See This Pattern

The two-pointer merge pattern appears whenever you need to combine sorted sequences:

1. **Merge k Sorted Lists (Hard):** This is the direct extension where you merge multiple lists instead of just two. The optimal solution often uses a min-heap, but you could repeatedly apply the two-list merge (though less efficient).

2. **Merge Sorted Array (Easy):** Similar concept but with arrays instead of linked lists. You typically work backwards from the end to avoid overwriting elements.

3. **Sort List (Medium):** Uses merge sort on linked lists, where the merge step is exactly this problem. You split the list, recursively sort halves, then merge them back together.

4. **Intersection of Two Linked Lists:** While not exactly the same, it uses similar pointer manipulation techniques for traversing and comparing nodes.

## Key Takeaways

1. **The dummy node pattern** is essential for linked list problems where you're building a new list. It eliminates special cases for the first node and makes code cleaner and less error-prone.

2. **Two-pointer comparison** is the standard approach for merging sorted sequences. Compare, take the smaller element, move that pointer forward. When one sequence is exhausted, attach the remainder of the other.

3. **Linked list problems are about pointer management.** Focus on updating pointers in the correct order and ensuring you don't lose access to nodes you still need.

Related problems: [Merge k Sorted Lists](/problem/merge-k-sorted-lists), [Merge Sorted Array](/problem/merge-sorted-array), [Sort List](/problem/sort-list)
