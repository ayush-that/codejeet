---
title: "How to Solve Merge Nodes in Between Zeros — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Merge Nodes in Between Zeros. Medium difficulty, 89.7% acceptance rate. Topics: Linked List, Simulation."
date: "2027-10-24"
category: "dsa-patterns"
tags: ["merge-nodes-in-between-zeros", "linked-list", "simulation", "medium"]
---

## Brief Problem Restatement

We're given a linked list where nodes with value 0 act as separators between groups of non-zero nodes. The list always starts and ends with a 0. We need to merge each group of non-zero nodes between consecutive zeros into a single node whose value is the sum of that group, then connect these merged nodes in order. This problem is interesting because it requires careful pointer manipulation while traversing a linked list, and the "merge" operation must preserve the relative order of groups.

## Visual Walkthrough

Let's trace through an example: `0 → 3 → 1 → 0 → 4 → 5 → 2 → 0`

**Step 1:** Start at the first 0 (head). Initialize sum = 0.

- Move to next node (3): sum = 3
- Move to next node (1): sum = 4
- Next node is 0 → time to create merged node with value 4

**Step 2:** Create new node with value 4. This becomes the head of our result list.

**Step 3:** Continue from the 0 we just reached (which was the separator).

- Move past it to node 4: sum = 4
- Move to node 5: sum = 9
- Move to node 2: sum = 11
- Next node is 0 → create merged node with value 11

**Step 4:** Connect the node(4) to node(11).

**Step 5:** We've reached the final 0, so we're done.

**Result:** `4 → 11`

The key insight is that zeros act as boundaries: when we see a zero, it means either:

1. We're starting a new group (if we just created a merged node)
2. We're ending the current group (if we've been accumulating a sum)

## Brute Force Approach

A naive approach might involve:

1. Traversing the list to collect all values into an array
2. Processing the array to find sums between zeros
3. Creating a new linked list from those sums

While this works, it uses O(n) extra space unnecessarily. More importantly, it doesn't demonstrate the linked list manipulation skills interviewers want to see. The brute force also fails to handle the "in-place" aspect efficiently - we could modify nodes in place but would need to carefully manage pointers.

The real issue with a naive approach is pointer management: candidates might try to modify the original list in place without properly handling the case where multiple nodes need to be collapsed into one. This often leads to lost references or infinite loops.

## Optimized Approach

The optimal approach uses a single pass with careful pointer manipulation:

**Key Insight:** We can solve this in one traversal by maintaining:

1. A `current` pointer to traverse the original list
2. A `dummy` node to help build the result list
3. A `tail` pointer to track where to attach new merged nodes
4. A running `sum` that accumulates values between zeros

**Step-by-step reasoning:**

1. Start with a dummy node (simplifies edge cases)
2. Initialize `tail = dummy` and `current = head.next` (skip the first 0)
3. Initialize `sum = 0`
4. While `current` is not null:
   - If `current.val` is 0 and `sum > 0`:
     - Create a new node with value `sum`
     - Attach it to `tail.next`
     - Move `tail` to the new node
     - Reset `sum = 0`
   - Else if `current.val` is not 0:
     - Add `current.val` to `sum`
   - Move `current` to `current.next`
5. Return `dummy.next` as the new head

The trickiest part is understanding when to create a merged node: only when we encounter a zero AND we have a non-zero sum accumulated. This handles consecutive zeros correctly.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - single pass through the list
# Space: O(1) - only using a few pointers, creating new nodes for result
class Solution:
    def mergeNodes(self, head):
        # Dummy node simplifies edge cases when building result list
        dummy = ListNode(0)
        # Tail pointer tracks where to attach next merged node
        tail = dummy
        # Start from first non-zero node after initial 0
        current = head.next
        sum_between_zeros = 0

        while current:
            if current.val == 0:
                # Found a zero - time to create merged node if we have accumulated sum
                if sum_between_zeros > 0:
                    # Create new node with sum of current group
                    new_node = ListNode(sum_between_zeros)
                    # Attach to result list
                    tail.next = new_node
                    # Move tail pointer forward
                    tail = tail.next
                    # Reset sum for next group
                    sum_between_zeros = 0
            else:
                # Add non-zero value to running sum
                sum_between_zeros += current.val

            # Move to next node in original list
            current = current.next

        # Return head of new list (skip dummy node)
        return dummy.next
```

```javascript
// Time: O(n) - single pass through the list
// Space: O(1) - only using a few pointers, creating new nodes for result
var mergeNodes = function (head) {
  // Dummy node simplifies edge cases when building result list
  const dummy = new ListNode(0);
  // Tail pointer tracks where to attach next merged node
  let tail = dummy;
  // Start from first non-zero node after initial 0
  let current = head.next;
  let sumBetweenZeros = 0;

  while (current) {
    if (current.val === 0) {
      // Found a zero - time to create merged node if we have accumulated sum
      if (sumBetweenZeros > 0) {
        // Create new node with sum of current group
        const newNode = new ListNode(sumBetweenZeros);
        // Attach to result list
        tail.next = newNode;
        // Move tail pointer forward
        tail = tail.next;
        // Reset sum for next group
        sumBetweenZeros = 0;
      }
    } else {
      // Add non-zero value to running sum
      sumBetweenZeros += current.val;
    }

    // Move to next node in original list
    current = current.next;
  }

  // Return head of new list (skip dummy node)
  return dummy.next;
};
```

```java
// Time: O(n) - single pass through the list
// Space: O(1) - only using a few pointers, creating new nodes for result
class Solution {
    public ListNode mergeNodes(ListNode head) {
        // Dummy node simplifies edge cases when building result list
        ListNode dummy = new ListNode(0);
        // Tail pointer tracks where to attach next merged node
        ListNode tail = dummy;
        // Start from first non-zero node after initial 0
        ListNode current = head.next;
        int sumBetweenZeros = 0;

        while (current != null) {
            if (current.val == 0) {
                // Found a zero - time to create merged node if we have accumulated sum
                if (sumBetweenZeros > 0) {
                    // Create new node with sum of current group
                    ListNode newNode = new ListNode(sumBetweenZeros);
                    // Attach to result list
                    tail.next = newNode;
                    // Move tail pointer forward
                    tail = tail.next;
                    // Reset sum for next group
                    sumBetweenZeros = 0;
                }
            } else {
                // Add non-zero value to running sum
                sumBetweenZeros += current.val;
            }

            // Move to next node in original list
            current = current.next;
        }

        // Return head of new list (skip dummy node)
        return dummy.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the original list. We make a single pass through the list, processing each node exactly once.

**Space Complexity:** O(1) auxiliary space (not counting the space needed for the output list). We only use a constant number of pointers (dummy, tail, current) and variables (sum). The output list contains new nodes, but this is required by the problem and doesn't count toward auxiliary space complexity in interview contexts.

## Common Mistakes

1. **Forgetting to reset the sum after creating a merged node:** This causes all subsequent merged nodes to include values from previous groups. Always reset `sum = 0` after attaching a new merged node.

2. **Not handling consecutive zeros correctly:** If there are two zeros in a row (which shouldn't happen per problem constraints but good to consider), we should NOT create a merged node with sum 0. That's why we check `if sum_between_zeros > 0` before creating a new node.

3. **Incorrect starting point:** Starting traversal from `head` instead of `head.next` means we'll try to process the first 0 as part of a group. Remember: the first 0 is just a starting marker, and we begin accumulating from the node after it.

4. **Losing reference to the result list head:** Without a dummy node, you need special handling for the first merged node. The dummy node pattern simplifies this by providing a consistent attachment point.

## When You'll See This Pattern

This "accumulate between markers" pattern appears in various linked list and array problems:

1. **Linked List Components (Medium):** Similar concept of grouping nodes based on certain values, though with a different grouping mechanism.

2. **Partition List (Medium):** Requires rearranging nodes based on a pivot value, involving careful pointer manipulation similar to our merging process.

3. **Add Two Numbers (Medium):** While adding numbers digit by digit, you maintain a carry (similar to our running sum) that gets reset/used at each step.

The core pattern is: traverse a sequence, accumulate values until a condition is met, then process the accumulated result and reset. This appears in string processing (accumulate characters until delimiter), array processing (sum between markers), and many other domains.

## Key Takeaways

1. **Dummy nodes simplify linked list manipulation:** They eliminate edge cases when building a new list, especially for the first node.

2. **"Accumulate and reset" is a common pattern:** When you need to process groups between markers, maintain a running accumulator and process/reset it when you hit a boundary condition.

3. **Pointer management is critical:** In linked list problems, always think about what each pointer represents (current position, tail of result list, etc.) and update them carefully to avoid lost references.

Related problems: [Linked List Components](/problem/linked-list-components)
