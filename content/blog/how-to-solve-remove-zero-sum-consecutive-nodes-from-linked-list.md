---
title: "How to Solve Remove Zero Sum Consecutive Nodes from Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Zero Sum Consecutive Nodes from Linked List. Medium difficulty, 53.1% acceptance rate. Topics: Hash Table, Linked List."
date: "2026-03-06"
category: "dsa-patterns"
tags: ["remove-zero-sum-consecutive-nodes-from-linked-list", "hash-table", "linked-list", "medium"]
---

# How to Solve Remove Zero Sum Consecutive Nodes from Linked List

This problem asks us to remove all consecutive sequences from a linked list that sum to zero, repeating until no such sequences remain. What makes this tricky is that removals can create new consecutive sequences that sum to zero, so we can't just find and remove them once—we need an approach that handles this cascading effect efficiently.

## Visual Walkthrough

Let's trace through an example: `[1, 2, -3, 3, 1]`

**Step 1:** We start with the linked list: 1 → 2 → -3 → 3 → 1

**Step 2:** Notice that 2 + (-3) = -1, not zero. But 1 + 2 + (-3) = 0! So nodes 1, 2, -3 sum to zero and should be removed.

**Step 3:** After removing those three nodes, we're left with: 3 → 1

**Step 4:** Check if 3 + 1 = 4 (not zero), so we're done.

But wait—what if we had `[1, 2, -3, 3, -1]` instead?

**Step 1:** 1 → 2 → -3 → 3 → -1

**Step 2:** 1 + 2 + (-3) = 0, remove those three nodes

**Step 3:** Now we have: 3 → -1

**Step 4:** 3 + (-1) = 2 (not zero), so we're done.

Actually, let's check one more: `[1, 2, -3, 3, -3, 1]`

**Step 1:** 1 → 2 → -3 → 3 → -3 → 1

**Step 2:** 1 + 2 + (-3) = 0, remove those

**Step 3:** Now: 3 → -3 → 1

**Step 4:** 3 + (-3) = 0, remove those two

**Step 5:** Now: 1, done.

The key insight: when we remove a zero-sum sequence, nodes that weren't adjacent before might become adjacent and create new zero-sum sequences. This suggests we need an approach that can handle this efficiently without repeatedly scanning the list.

## Brute Force Approach

A naive approach would be to repeatedly scan the list, looking for zero-sum sequences:

1. Start from the beginning of the list
2. For each starting position, calculate running sums
3. If any running sum equals zero, remove that sequence
4. Repeat until no zero-sum sequences are found

This approach has several problems:

- After removing a sequence, we need to restart from the beginning
- In the worst case (like alternating 1, -1, 1, -1...), we might need O(n²) scans
- The code becomes complex with many edge cases

The time complexity would be O(n³) in the worst case: O(n²) for checking all subarrays × O(n) for recalculating after each removal. This is clearly too slow for larger lists.

## Optimized Approach

The key insight comes from recognizing that if the sum from node i to node j is zero, then the prefix sum at node i-1 equals the prefix sum at node j.

**Prefix sum concept:** If we calculate running sums as we traverse the list:

- Sum up to position i: S_i
- Sum up to position j: S_j
- If S_i = S_j, then the sum from i+1 to j must be zero!

**Example:** `[1, 2, -3, 3, 1]`

- Position 0 (before first node): sum = 0
- After node 1: sum = 1
- After node 2: sum = 3
- After node -3: sum = 0 (matches our starting 0!)
- This tells us nodes 1, 2, -3 sum to zero

**Algorithm:**

1. Add a dummy node at the beginning to handle cases where we remove from the start
2. Traverse the list, calculating prefix sums
3. Use a hash map to store the last node where we saw each prefix sum
4. If we see a prefix sum we've seen before, all nodes between the previous occurrence and current node sum to zero
5. Remove that entire sequence
6. Continue until the end

This approach handles the cascading effect automatically because when we remove nodes, we're effectively recalculating prefix sums from that point forward.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# We traverse the list once, and use a hash map that can store up to n prefix sums
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def removeZeroSumSublists(head):
    """
    Remove all consecutive sequences that sum to zero from a linked list.

    The key insight: if the prefix sum at node A equals the prefix sum at node B,
    then all nodes between A and B (exclusive) sum to zero.
    """
    # Step 1: Create a dummy node to handle cases where we remove from the beginning
    dummy = ListNode(0)
    dummy.next = head

    # Step 2: Initialize prefix sum and hash map
    # The hash map stores the last node where we saw each prefix sum
    prefix_sum = 0
    prefix_map = {0: dummy}  # Initialize with prefix sum 0 at dummy node

    # Step 3: First pass - build the prefix sum map
    current = head
    while current:
        prefix_sum += current.val

        # If we've seen this prefix sum before, we need to remove nodes
        if prefix_sum in prefix_map:
            # Step 4: Remove nodes between previous occurrence and current
            # Start from the node after the previous occurrence
            to_remove = prefix_map[prefix_sum].next
            temp_sum = prefix_sum

            # Remove all nodes in the zero-sum sequence from the hash map
            while to_remove != current:
                temp_sum += to_remove.val
                del prefix_map[temp_sum]  # Remove these intermediate prefix sums
                to_remove = to_remove.next

            # Step 5: Update the next pointer to skip the zero-sum sequence
            prefix_map[prefix_sum].next = current.next
        else:
            # If this is a new prefix sum, store the current node
            prefix_map[prefix_sum] = current

        # Move to next node
        current = current.next

    # Step 6: Return the modified list (skip the dummy node)
    return dummy.next
```

```javascript
// Time: O(n) | Space: O(n)
// We traverse the list once, and use a Map that can store up to n prefix sums
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function removeZeroSumSublists(head) {
  /**
   * Remove all consecutive sequences that sum to zero from a linked list.
   *
   * The key insight: if the prefix sum at node A equals the prefix sum at node B,
   * then all nodes between A and B (exclusive) sum to zero.
   */

  // Step 1: Create a dummy node to handle cases where we remove from the beginning
  const dummy = new ListNode(0);
  dummy.next = head;

  // Step 2: Initialize prefix sum and hash map
  // The map stores the last node where we saw each prefix sum
  let prefixSum = 0;
  const prefixMap = new Map();
  prefixMap.set(0, dummy); // Initialize with prefix sum 0 at dummy node

  // Step 3: First pass - build the prefix sum map
  let current = head;
  while (current !== null) {
    prefixSum += current.val;

    // If we've seen this prefix sum before, we need to remove nodes
    if (prefixMap.has(prefixSum)) {
      // Step 4: Remove nodes between previous occurrence and current
      // Start from the node after the previous occurrence
      let toRemove = prefixMap.get(prefixSum).next;
      let tempSum = prefixSum;

      // Remove all nodes in the zero-sum sequence from the map
      while (toRemove !== current) {
        tempSum += toRemove.val;
        prefixMap.delete(tempSum); // Remove these intermediate prefix sums
        toRemove = toRemove.next;
      }

      // Step 5: Update the next pointer to skip the zero-sum sequence
      prefixMap.get(prefixSum).next = current.next;
    } else {
      // If this is a new prefix sum, store the current node
      prefixMap.set(prefixSum, current);
    }

    // Move to next node
    current = current.next;
  }

  // Step 6: Return the modified list (skip the dummy node)
  return dummy.next;
}
```

```java
// Time: O(n) | Space: O(n)
// We traverse the list once, and use a HashMap that can store up to n prefix sums
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode removeZeroSumSublists(ListNode head) {
        /**
         * Remove all consecutive sequences that sum to zero from a linked list.
         *
         * The key insight: if the prefix sum at node A equals the prefix sum at node B,
         * then all nodes between A and B (exclusive) sum to zero.
         */

        // Step 1: Create a dummy node to handle cases where we remove from the beginning
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // Step 2: Initialize prefix sum and hash map
        // The map stores the last node where we saw each prefix sum
        int prefixSum = 0;
        Map<Integer, ListNode> prefixMap = new HashMap<>();
        prefixMap.put(0, dummy);  // Initialize with prefix sum 0 at dummy node

        // Step 3: First pass - build the prefix sum map
        ListNode current = head;
        while (current != null) {
            prefixSum += current.val;

            // If we've seen this prefix sum before, we need to remove nodes
            if (prefixMap.containsKey(prefixSum)) {
                // Step 4: Remove nodes between previous occurrence and current
                // Start from the node after the previous occurrence
                ListNode toRemove = prefixMap.get(prefixSum).next;
                int tempSum = prefixSum;

                // Remove all nodes in the zero-sum sequence from the map
                while (toRemove != current) {
                    tempSum += toRemove.val;
                    prefixMap.remove(tempSum);  // Remove these intermediate prefix sums
                    toRemove = toRemove.next;
                }

                // Step 5: Update the next pointer to skip the zero-sum sequence
                prefixMap.get(prefixSum).next = current.next;
            } else {
                // If this is a new prefix sum, store the current node
                prefixMap.put(prefixSum, current);
            }

            // Move to next node
            current = current.next;
        }

        // Step 6: Return the modified list (skip the dummy node)
        return dummy.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the list once to build the prefix sum map: O(n)
- When we find a zero-sum sequence, we traverse it to clean up the map: O(k) for a sequence of length k
- Each node is processed at most twice (once when added to map, once when removed): O(2n) = O(n)

**Space Complexity: O(n)**

- We store a hash map with at most n entries (one for each unique prefix sum)
- In the worst case (no zero sums), we store all n prefix sums
- The dummy node uses O(1) extra space

## Common Mistakes

1. **Forgetting the dummy node**: Without a dummy node, if the first few nodes sum to zero, you'd need special handling to update the head pointer. The dummy node simplifies this by giving us a consistent starting point.

2. **Not cleaning up the hash map**: When you remove a zero-sum sequence, you must also remove all prefix sums from nodes within that sequence. If you don't, those stale entries could cause incorrect matches later.

3. **Incorrect sequence removal**: When you find that prefix_sum[i] = prefix_sum[j], the zero-sum sequence is from i+1 to j (inclusive). A common mistake is removing from i to j or i+1 to j-1.

4. **Handling overlapping sequences**: Some implementations fail when zero-sum sequences overlap or are nested. The hash map approach correctly handles this because it always keeps the last occurrence of each prefix sum.

## When You'll See This Pattern

The prefix sum + hash map pattern appears in several problems:

1. **Subarray Sum Equals K (LeetCode 560)**: Find the total number of continuous subarrays whose sum equals k. Uses the same prefix sum + hash map technique.

2. **Contiguous Array (LeetCode 525)**: Find the maximum length of a contiguous subarray with equal number of 0s and 1s. Treat 0 as -1 and look for prefix sum of 0.

3. **Find Two Non-overlapping Sub-arrays Each With Target Sum (LeetCode 1477)**: Uses prefix sums to find subarrays with specific sums.

The pattern is: when you need to find subarrays (or subsequences in a linked list) with a certain sum property, prefix sums with a hash map often provide an O(n) solution.

## Key Takeaways

1. **Prefix sums transform range queries into point queries**: Instead of checking all subarrays O(n²), we can check if we've seen (current_prefix_sum - target) before in O(1) time.

2. **Hash maps remember where we've been**: By storing the last occurrence of each prefix sum, we can instantly find if a zero-sum sequence exists ending at the current position.

3. **Dummy nodes simplify linked list manipulation**: When you might need to remove the head of a linked list, a dummy node ensures you always have a consistent reference point.

Related problems: [Delete N Nodes After M Nodes of a Linked List](/problem/delete-n-nodes-after-m-nodes-of-a-linked-list)
