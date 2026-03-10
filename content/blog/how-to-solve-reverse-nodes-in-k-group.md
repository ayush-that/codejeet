---
title: "How to Solve Reverse Nodes in k-Group — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Reverse Nodes in k-Group. Hard difficulty, 65.4% acceptance rate. Topics: Linked List, Recursion."
date: "2026-07-15"
category: "dsa-patterns"
tags: ["reverse-nodes-in-k-group", "linked-list", "recursion", "hard"]
---

# How to Solve Reverse Nodes in k-Group

This problem asks us to reverse nodes in a linked list in groups of `k`, leaving any leftover nodes at the end unchanged. What makes this problem tricky is that we need to reverse sublists of exactly `k` nodes while maintaining proper connections between the reversed groups and handling the leftover nodes correctly. It's essentially a more general version of "Swap Nodes in Pairs" where `k=2`.

## Visual Walkthrough

Let's trace through an example with `head = [1,2,3,4,5]` and `k = 3`:

**Step 1:** Check if we have at least 3 nodes starting from node 1. We do: [1→2→3→4→5]

**Step 2:** Reverse the first 3 nodes:

- Initial: 1→2→3→4→5
- After reversing: 3→2→1→4→5
- We need to remember that node 1 (the old head) will connect to the next group

**Step 3:** Move to the next group starting at node 4. Check if we have 3 nodes: we only have 2 (4→5), so we stop.

**Step 4:** Connect the reversed group to the remaining nodes: 3→2→1→4→5

The key insight is that we need to:

1. Check if we have `k` nodes before reversing
2. Reverse exactly `k` nodes using standard linked list reversal
3. Connect the reversed group to the previous group and the next group
4. Repeat until we don't have `k` nodes left

## Brute Force Approach

A naive approach might be to:

1. Convert the linked list to an array
2. Reverse chunks of size `k` in the array
3. Rebuild the linked list from the array

While this would work, it requires O(n) extra space for the array, which isn't optimal. More importantly, interviewers expect an in-place solution that works directly with the linked list nodes.

Another brute force approach would be to repeatedly traverse the list to find group boundaries, but this would be O(n²) time complexity since we'd traverse the same nodes multiple times.

## Optimized Approach

The optimal approach uses an iterative method with careful pointer manipulation:

1. **Use a dummy node** to simplify edge cases when the head changes
2. **Track three key pointers**:
   - `prev_group_end`: The last node of the previous reversed group
   - `curr_group_start`: The first node of the current group to reverse
   - `curr_group_end`: The last node of the current group (found by moving `k-1` steps)
3. **Check if we have k nodes** before attempting reversal
4. **Reverse the current group** using standard linked list reversal
5. **Connect the reversed group** to the previous group and the next group
6. **Update pointers** for the next iteration

The key insight is that we need to reverse each group independently while maintaining the connections between groups. We use a dummy node to handle the case where the head changes after reversal.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) - We visit each node exactly once
# Space: O(1) - We only use a constant amount of extra space
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # Create a dummy node to simplify edge cases when head changes
        dummy = ListNode(0)
        dummy.next = head

        # prev_group_end tracks the last node of the previous reversed group
        prev_group_end = dummy

        while True:
            # Step 1: Check if we have at least k nodes left
            kth_node = self.getKthNode(prev_group_end, k)
            if not kth_node:
                # Not enough nodes for a complete group, we're done
                break

            # Step 2: Save the start of the next group
            next_group_start = kth_node.next

            # Step 3: Reverse the current group
            # We need to reverse from prev_group_end.next to kth_node
            prev = next_group_start  # This connects the reversed group to the next group
            curr = prev_group_end.next

            while curr != next_group_start:
                next_node = curr.next
                curr.next = prev
                prev = curr
                curr = next_node

            # Step 4: Connect the reversed group to the previous group
            # prev_group_end was pointing to the old start, now it should point to the new start
            new_group_start = prev  # After reversal, prev is the new start of the group
            old_group_start = prev_group_end.next  # The old start becomes the end after reversal

            prev_group_end.next = new_group_start

            # Step 5: Update prev_group_end for the next iteration
            # The old start is now the end of the reversed group
            prev_group_end = old_group_start

        return dummy.next

    def getKthNode(self, start: ListNode, k: int) -> Optional[ListNode]:
        # Move k steps from start node
        curr = start
        for _ in range(k):
            curr = curr.next
            if not curr:
                return None
        return curr
```

```javascript
// Time: O(n) - We visit each node exactly once
// Space: O(1) - We only use a constant amount of extra space
var reverseKGroup = function (head, k) {
  // Create a dummy node to simplify edge cases when head changes
  const dummy = new ListNode(0);
  dummy.next = head;

  // prevGroupEnd tracks the last node of the previous reversed group
  let prevGroupEnd = dummy;

  while (true) {
    // Step 1: Check if we have at least k nodes left
    const kthNode = getKthNode(prevGroupEnd, k);
    if (!kthNode) {
      // Not enough nodes for a complete group, we're done
      break;
    }

    // Step 2: Save the start of the next group
    const nextGroupStart = kthNode.next;

    // Step 3: Reverse the current group
    // We need to reverse from prevGroupEnd.next to kthNode
    let prev = nextGroupStart; // This connects the reversed group to the next group
    let curr = prevGroupEnd.next;

    while (curr !== nextGroupStart) {
      const nextNode = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nextNode;
    }

    // Step 4: Connect the reversed group to the previous group
    // prevGroupEnd was pointing to the old start, now it should point to the new start
    const newGroupStart = prev; // After reversal, prev is the new start of the group
    const oldGroupStart = prevGroupEnd.next; // The old start becomes the end after reversal

    prevGroupEnd.next = newGroupStart;

    // Step 5: Update prevGroupEnd for the next iteration
    // The old start is now the end of the reversed group
    prevGroupEnd = oldGroupStart;
  }

  return dummy.next;
};

// Helper function to get the kth node from start
function getKthNode(start, k) {
  let curr = start;
  for (let i = 0; i < k; i++) {
    curr = curr.next;
    if (!curr) {
      return null;
    }
  }
  return curr;
}
```

```java
// Time: O(n) - We visit each node exactly once
// Space: O(1) - We only use a constant amount of extra space
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        // Create a dummy node to simplify edge cases when head changes
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // prevGroupEnd tracks the last node of the previous reversed group
        ListNode prevGroupEnd = dummy;

        while (true) {
            // Step 1: Check if we have at least k nodes left
            ListNode kthNode = getKthNode(prevGroupEnd, k);
            if (kthNode == null) {
                // Not enough nodes for a complete group, we're done
                break;
            }

            // Step 2: Save the start of the next group
            ListNode nextGroupStart = kthNode.next;

            // Step 3: Reverse the current group
            // We need to reverse from prevGroupEnd.next to kthNode
            ListNode prev = nextGroupStart;  // This connects the reversed group to the next group
            ListNode curr = prevGroupEnd.next;

            while (curr != nextGroupStart) {
                ListNode nextNode = curr.next;
                curr.next = prev;
                prev = curr;
                curr = nextNode;
            }

            // Step 4: Connect the reversed group to the previous group
            // prevGroupEnd was pointing to the old start, now it should point to the new start
            ListNode newGroupStart = prev;  // After reversal, prev is the new start of the group
            ListNode oldGroupStart = prevGroupEnd.next;  // The old start becomes the end after reversal

            prevGroupEnd.next = newGroupStart;

            // Step 5: Update prevGroupEnd for the next iteration
            // The old start is now the end of the reversed group
            prevGroupEnd = oldGroupStart;
        }

        return dummy.next;
    }

    // Helper method to get the kth node from start
    private ListNode getKthNode(ListNode start, int k) {
        ListNode curr = start;
        for (int i = 0; i < k; i++) {
            curr = curr.next;
            if (curr == null) {
                return null;
            }
        }
        return curr;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the entire list once to check for group boundaries: O(n)
- We reverse each node exactly once during the reversal process: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for pointers (dummy node, prev, curr, next, etc.)
- No recursion stack or additional data structures are used

## Common Mistakes

1. **Forgetting to check if we have k nodes before reversing**: This leads to attempting to reverse a partial group or accessing null pointers. Always check with a helper function first.

2. **Incorrect pointer connections between groups**: After reversing a group, you need to connect it to both the previous group (via `prev_group_end`) and the next group (by setting the last node of the reversed group to point to `next_group_start`).

3. **Losing track of the new head**: When the first group is reversed, the head changes. Using a dummy node solves this elegantly by providing a stable reference point.

4. **Infinite loops from incorrect pointer updates**: Make sure to update `prev_group_end` to point to the last node of the current reversed group (which was the first node before reversal).

## When You'll See This Pattern

This pattern of reversing sublists appears in several linked list problems:

1. **Swap Nodes in Pairs (LeetCode 24)**: This is the special case where k=2. The same approach works but is simpler since you're only swapping pairs.

2. **Reverse Linked List II (LeetCode 92)**: Instead of reversing groups, you reverse a specific subrange. The reversal technique is identical, but the boundary checking is different.

3. **Rotate List (LeetCode 61)**: While not exactly the same, it involves breaking and reconnecting linked lists at specific points, requiring similar pointer manipulation skills.

The core technique of using multiple pointers to track different parts of a linked list during transformation is fundamental to many linked list problems.

## Key Takeaways

1. **Use a dummy node** when the head of a linked list might change during operations. This simplifies edge case handling.

2. **Break complex reversals into smaller operations**: Check boundaries → Save next group → Reverse current group → Connect groups → Update pointers.

3. **The reversal of a sublist follows a standard pattern**: Use three pointers (prev, curr, next) and iterate through the sublist, reversing links as you go.

Remember: Linked list problems are all about careful pointer manipulation. Draw diagrams, track your pointers, and always check for null values before dereferencing.

Related problems: [Swap Nodes in Pairs](/problem/swap-nodes-in-pairs), [Swapping Nodes in a Linked List](/problem/swapping-nodes-in-a-linked-list), [Reverse Nodes in Even Length Groups](/problem/reverse-nodes-in-even-length-groups)
