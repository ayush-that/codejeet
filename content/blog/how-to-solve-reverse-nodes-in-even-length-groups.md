---
title: "How to Solve Reverse Nodes in Even Length Groups — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reverse Nodes in Even Length Groups. Medium difficulty, 63.7% acceptance rate. Topics: Linked List."
date: "2028-09-22"
category: "dsa-patterns"
tags: ["reverse-nodes-in-even-length-groups", "linked-list", "medium"]
---

# How to Solve Reverse Nodes in Even Length Groups

This problem asks us to reverse nodes in groups of specific lengths: first group has 1 node, second has 2, third has 3, and so on. However, we only reverse groups that have an even number of nodes. The tricky part is that we need to traverse the list while keeping track of group boundaries, and we must handle the final group correctly when it might be shorter than expected.

## Visual Walkthrough

Let's trace through an example: `[5,2,6,3,9,1,7,3,8,4]`

**Step 1: First group (length 1, odd - no reversal)**

- Group length: 1 (odd)
- Nodes: [5]
- Result so far: [5]

**Step 2: Second group (length 2, even - reverse)**

- Group length: 2 (even)
- Nodes: [2,6]
- After reversal: [6,2]
- Result so far: [5,6,2]

**Step 3: Third group (length 3, odd - no reversal)**

- Group length: 3 (odd)
- Nodes: [3,9,1]
- Result so far: [5,6,2,3,9,1]

**Step 4: Fourth group (length 4, even - reverse)**

- Group length: 4 (even)
- Nodes: [7,3,8,4]
- After reversal: [4,8,3,7]
- Final result: [5,6,2,3,9,1,4,8,3,7]

The key insight is that we need to:

1. Track the current group number (starting at 1)
2. Determine the expected group size (group number)
3. Count how many nodes are actually available
4. Reverse only if the actual count is even
5. Connect the reversed/non-reversed segment back to the main list

## Brute Force Approach

A naive approach would be to:

1. Traverse the entire list to get its length
2. Create an array to store all node values
3. Process groups in the array, reversing even-length ones
4. Rebuild the linked list from the array

This approach has several issues:

- It uses O(n) extra space for the array
- It requires two full passes through the list
- It doesn't handle the linked list structure efficiently
- The problem expects an in-place solution

While this would technically work, it's inefficient and doesn't demonstrate good linked list manipulation skills that interviewers look for.

## Optimized Approach

The optimal approach processes the list in a single pass with O(1) extra space:

1. **Group tracking**: We maintain a `groupNum` counter starting at 1, representing the expected size of the current group.

2. **Node counting**: For each group, we traverse forward to count how many nodes are actually available. This is important because the final group might be shorter than expected.

3. **Reversal decision**: If the actual count is even, we reverse that segment. Otherwise, we leave it as-is.

4. **Pointer management**: We need to carefully manage pointers to:
   - The node before the current group (`prev`)
   - The first node of the current group (`groupStart`)
   - The node after the current group (`nextGroupStart`)

5. **Edge case handling**: The final group might be shorter than expected, and we need to stop processing when we reach the end of the list.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# We traverse each node once, and use constant extra space for pointers
class Solution:
    def reverseEvenLengthGroups(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Create a dummy node to simplify edge cases (like reversing from head)
        dummy = ListNode(0, head)
        prev = dummy  # Node before the current group
        group_num = 1  # Expected size of current group (1, 2, 3, ...)

        while prev.next:
            # Step 1: Count how many nodes are actually in this group
            count = 0
            curr = prev.next
            # Traverse forward to count nodes in current group
            # Stop when we reach group_num nodes OR end of list
            while curr and count < group_num:
                curr = curr.next
                count += 1

            # Step 2: Reverse if count is even
            if count % 2 == 0:
                # Reverse the current group of 'count' nodes
                prev = self.reverse_group(prev, count)
            else:
                # Skip over the current group without reversing
                for _ in range(count):
                    prev = prev.next

            # Step 3: Move to next group with increased size
            group_num += 1

        return dummy.next

    def reverse_group(self, prev: ListNode, count: int) -> ListNode:
        """
        Reverse a group of 'count' nodes starting after 'prev'.
        Returns the new 'prev' (last node of reversed group).
        """
        # prev -> [a -> b -> c -> ...] -> next_group
        # After reversal: prev -> [c -> b -> a] -> next_group

        # Get the first node of the group to reverse
        curr = prev.next

        # Reverse 'count' nodes in place
        # We'll use the standard 3-pointer reversal technique
        reverse_prev = None
        first_node = curr  # Save the first node (will become last after reversal)

        for _ in range(count):
            # Save next node before breaking link
            next_node = curr.next
            # Reverse the link
            curr.next = reverse_prev
            # Move pointers forward
            reverse_prev = curr
            curr = next_node

        # Connect the reversed group back to the list
        # prev should now point to the new head of reversed group
        prev.next = reverse_prev
        # The old first node should point to the next group
        first_node.next = curr

        # Return the last node of reversed group as new 'prev'
        return first_node
```

```javascript
// Time: O(n) | Space: O(1)
// We traverse each node once, and use constant extra space for pointers
var reverseEvenLengthGroups = function (head) {
  // Create a dummy node to simplify edge cases
  const dummy = new ListNode(0, head);
  let prev = dummy; // Node before the current group
  let groupNum = 1; // Expected size of current group (1, 2, 3, ...)

  while (prev.next) {
    // Step 1: Count how many nodes are actually in this group
    let count = 0;
    let curr = prev.next;
    // Traverse forward to count nodes in current group
    while (curr && count < groupNum) {
      curr = curr.next;
      count++;
    }

    // Step 2: Reverse if count is even
    if (count % 2 === 0) {
      // Reverse the current group of 'count' nodes
      prev = reverseGroup(prev, count);
    } else {
      // Skip over the current group without reversing
      for (let i = 0; i < count; i++) {
        prev = prev.next;
      }
    }

    // Step 3: Move to next group with increased size
    groupNum++;
  }

  return dummy.next;
};

function reverseGroup(prev, count) {
  /**
   * Reverse a group of 'count' nodes starting after 'prev'.
   * Returns the new 'prev' (last node of reversed group).
   */
  // prev -> [a -> b -> c -> ...] -> next_group
  // After reversal: prev -> [c -> b -> a] -> next_group

  // Get the first node of the group to reverse
  let curr = prev.next;

  // Reverse 'count' nodes in place using 3-pointer technique
  let reversePrev = null;
  const firstNode = curr; // Save the first node (will become last after reversal)

  for (let i = 0; i < count; i++) {
    // Save next node before breaking link
    const nextNode = curr.next;
    // Reverse the link
    curr.next = reversePrev;
    // Move pointers forward
    reversePrev = curr;
    curr = nextNode;
  }

  // Connect the reversed group back to the list
  // prev should now point to the new head of reversed group
  prev.next = reversePrev;
  // The old first node should point to the next group
  firstNode.next = curr;

  // Return the last node of reversed group as new 'prev'
  return firstNode;
}
```

```java
// Time: O(n) | Space: O(1)
// We traverse each node once, and use constant extra space for pointers
class Solution {
    public ListNode reverseEvenLengthGroups(ListNode head) {
        // Create a dummy node to simplify edge cases
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;  // Node before the current group
        int groupNum = 1;  // Expected size of current group (1, 2, 3, ...)

        while (prev.next != null) {
            // Step 1: Count how many nodes are actually in this group
            int count = 0;
            ListNode curr = prev.next;
            // Traverse forward to count nodes in current group
            while (curr != null && count < groupNum) {
                curr = curr.next;
                count++;
            }

            // Step 2: Reverse if count is even
            if (count % 2 == 0) {
                // Reverse the current group of 'count' nodes
                prev = reverseGroup(prev, count);
            } else {
                // Skip over the current group without reversing
                for (int i = 0; i < count; i++) {
                    prev = prev.next;
                }
            }

            // Step 3: Move to next group with increased size
            groupNum++;
        }

        return dummy.next;
    }

    private ListNode reverseGroup(ListNode prev, int count) {
        /**
         * Reverse a group of 'count' nodes starting after 'prev'.
         * Returns the new 'prev' (last node of reversed group).
         */
        // prev -> [a -> b -> c -> ...] -> next_group
        // After reversal: prev -> [c -> b -> a] -> next_group

        // Get the first node of the group to reverse
        ListNode curr = prev.next;

        // Reverse 'count' nodes in place using 3-pointer technique
        ListNode reversePrev = null;
        ListNode firstNode = curr;  // Save the first node (will become last after reversal)

        for (int i = 0; i < count; i++) {
            // Save next node before breaking link
            ListNode nextNode = curr.next;
            // Reverse the link
            curr.next = reversePrev;
            // Move pointers forward
            reversePrev = curr;
            curr = nextNode;
        }

        // Connect the reversed group back to the list
        // prev should now point to the new head of reversed group
        prev.next = reversePrev;
        // The old first node should point to the next group
        firstNode.next = curr;

        // Return the last node of reversed group as new 'prev'
        return firstNode;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse each node exactly once when counting nodes in groups
- Each node is processed again during reversal (if its group is even-length)
- In total, each node is visited a constant number of times, resulting in O(n) time

**Space Complexity: O(1)**

- We use only a constant amount of extra space for pointers (`prev`, `curr`, `reversePrev`, etc.)
- No recursion or additional data structures are used
- The reversal is done in-place

## Common Mistakes

1. **Forgetting to count actual nodes in the final group**: Many candidates assume every group has exactly `groupNum` nodes, but the final group might be shorter. Always count the actual nodes available.

2. **Incorrect pointer management during reversal**: When reversing a group, it's easy to lose track of:
   - The node before the group (`prev`)
   - The first node of the group (becomes last after reversal)
   - The node after the group (`nextGroupStart`)

3. **Not using a dummy node**: Without a dummy node, reversing the first group (if it's even-length) becomes complicated because you need to update the head pointer separately.

4. **Off-by-one errors in group counting**: Remember that `groupNum` starts at 1, not 0, and increments after processing each group.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Group processing in linked lists**: Similar to "Reverse Nodes in k-Group" (LeetCode 25), but with variable group sizes. This pattern appears whenever you need to process linked list nodes in batches.

2. **In-place linked list reversal**: The core reversal technique is identical to "Reverse Linked List" (LeetCode 206) and appears in many linked list problems.

3. **Two-pointer traversal with counting**: The pattern of using one pointer to count and another to process appears in problems like "Remove Nth Node From End of List" (LeetCode 19).

## Key Takeaways

1. **Dummy nodes simplify edge cases**: When dealing with linked list modifications that might affect the head, a dummy node can make your code cleaner and less error-prone.

2. **Separate reversal logic into helper functions**: This makes the main logic clearer and helps avoid pointer management errors.

3. **Always verify group size before processing**: Don't assume you have the expected number of nodes—count them first, especially for the final group.

Related problems: [Reverse Nodes in k-Group](/problem/reverse-nodes-in-k-group), [Reverse Linked List](/problem/reverse-linked-list)
