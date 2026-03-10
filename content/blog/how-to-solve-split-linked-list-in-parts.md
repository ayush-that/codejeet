---
title: "How to Solve Split Linked List in Parts — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Split Linked List in Parts. Medium difficulty, 70.5% acceptance rate. Topics: Linked List."
date: "2027-10-01"
category: "dsa-patterns"
tags: ["split-linked-list-in-parts", "linked-list", "medium"]
---

# How to Solve Split Linked List in Parts

You're given the head of a singly linked list and an integer `k`. Your task is to split the list into `k` consecutive parts where the lengths are as equal as possible: no two parts should differ in size by more than one. Some parts may be null if there aren't enough nodes.

What makes this problem interesting is that you need to handle both the division of nodes into groups AND the fact that groups can have different sizes (differing by at most 1). This requires careful calculation of how many nodes go in each part and precise pointer manipulation to avoid losing nodes or creating cycles.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have a linked list: `1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9` (9 nodes) and `k = 4`.

**Step 1: Calculate total length**
We traverse the list once and count: `n = 9` nodes.

**Step 2: Determine base size and remainder**

- Base size = `n // k` = `9 // 4` = `2` (each part gets at least 2 nodes)
- Remainder = `n % k` = `9 % 4` = `1` (the first 1 part gets an extra node)

**Step 3: Split the list**
We need 4 parts with sizes: 3, 2, 2, 2 (first part gets the extra node)

- Part 1: `1 → 2 → 3` (size 3)
- Part 2: `4 → 5` (size 2)
- Part 3: `6 → 7` (size 2)
- Part 4: `8 → 9` (size 2)

**Step 4: Handle pointer manipulation**
For each part:

1. Remember the current head as the start of this part
2. Move forward the appropriate number of nodes
3. Cut the connection to the next part by setting `current.next = null`
4. Move to the next node as the start of the next part

The tricky part is calculating exactly how many nodes each segment gets and ensuring we don't lose track of nodes when cutting connections.

## Brute Force Approach

A naive approach might try to repeatedly traverse the list to find split points, but that would be inefficient. Another brute force idea would be to convert the linked list to an array, split the array, then convert back to linked lists. While this works, it uses O(n) extra space unnecessarily.

Let's examine why the array approach, while correct, isn't optimal for space:

1. Traverse the list and store all nodes in an array: O(n) time, O(n) space
2. Calculate split sizes: O(1) time
3. Create k new linked lists by slicing the array: O(n) time
4. Return the array of heads

The problem with this approach is the O(n) space usage when we could solve it with O(1) extra space (excluding the output array). In interviews, you want to demonstrate you can work directly with the linked list structure.

## Optimized Approach

The key insight is that we can solve this in a single pass with O(1) extra space by:

1. First, traverse the list once to count total nodes (n)
2. Calculate: `base_size = n // k` and `remainder = n % k`
3. Traverse again, but this time we know exactly how many nodes each part should get:
   - First `remainder` parts get `base_size + 1` nodes
   - Remaining parts get `base_size` nodes
4. As we traverse, we cut connections at the right points

The clever part is handling the remainder distribution: we give the extra nodes to the first few parts, which ensures the size difference between any two parts is at most 1.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the list
# Space: O(1) extra space (excluding the output array)
class Solution:
    def splitListToParts(self, head: Optional[ListNode], k: int) -> List[Optional[ListNode]]:
        # Step 1: Calculate the total length of the linked list
        current = head
        length = 0
        while current:
            length += 1
            current = current.next

        # Step 2: Calculate base size and remainder
        # Each part gets at least base_size nodes
        # First remainder parts get one extra node
        base_size = length // k
        remainder = length % k

        # Step 3: Initialize result array and reset current pointer
        result = []
        current = head

        # Step 4: Split the list into k parts
        for i in range(k):
            # Start of current part
            part_head = current

            # Determine size of current part
            # First remainder parts get base_size + 1 nodes
            # Remaining parts get base_size nodes
            part_size = base_size + (1 if i < remainder else 0)

            # Move current pointer to the last node of this part
            # We need to move part_size - 1 steps to reach the last node
            for j in range(part_size - 1):
                if current:
                    current = current.next

            # Step 5: Cut the connection to next part if current exists
            if current:
                next_part = current.next  # Save the start of next part
                current.next = None       # Cut the connection
                current = next_part       # Move to start of next part

            # Add current part to result (could be None if part_size is 0)
            result.append(part_head)

        return result
```

```javascript
// Time: O(n) where n is the number of nodes in the list
// Space: O(1) extra space (excluding the output array)
var splitListToParts = function (head, k) {
  // Step 1: Calculate the total length of the linked list
  let current = head;
  let length = 0;
  while (current) {
    length++;
    current = current.next;
  }

  // Step 2: Calculate base size and remainder
  // Each part gets at least base_size nodes
  // First remainder parts get one extra node
  const baseSize = Math.floor(length / k);
  const remainder = length % k;

  // Step 3: Initialize result array and reset current pointer
  const result = new Array(k);
  current = head;

  // Step 4: Split the list into k parts
  for (let i = 0; i < k; i++) {
    // Start of current part
    const partHead = current;

    // Determine size of current part
    // First remainder parts get baseSize + 1 nodes
    // Remaining parts get baseSize nodes
    const partSize = baseSize + (i < remainder ? 1 : 0);

    // Move current pointer to the last node of this part
    // We need to move partSize - 1 steps to reach the last node
    for (let j = 0; j < partSize - 1; j++) {
      if (current) {
        current = current.next;
      }
    }

    // Step 5: Cut the connection to next part if current exists
    if (current) {
      const nextPart = current.next; // Save the start of next part
      current.next = null; // Cut the connection
      current = nextPart; // Move to start of next part
    }

    // Add current part to result (could be null if partSize is 0)
    result[i] = partHead;
  }

  return result;
};
```

```java
// Time: O(n) where n is the number of nodes in the list
// Space: O(1) extra space (excluding the output array)
class Solution {
    public ListNode[] splitListToParts(ListNode head, int k) {
        // Step 1: Calculate the total length of the linked list
        ListNode current = head;
        int length = 0;
        while (current != null) {
            length++;
            current = current.next;
        }

        // Step 2: Calculate base size and remainder
        // Each part gets at least baseSize nodes
        // First remainder parts get one extra node
        int baseSize = length / k;
        int remainder = length % k;

        // Step 3: Initialize result array and reset current pointer
        ListNode[] result = new ListNode[k];
        current = head;

        // Step 4: Split the list into k parts
        for (int i = 0; i < k; i++) {
            // Start of current part
            ListNode partHead = current;

            // Determine size of current part
            // First remainder parts get baseSize + 1 nodes
            // Remaining parts get baseSize nodes
            int partSize = baseSize + (i < remainder ? 1 : 0);

            // Move current pointer to the last node of this part
            // We need to move partSize - 1 steps to reach the last node
            for (int j = 0; j < partSize - 1; j++) {
                if (current != null) {
                    current = current.next;
                }
            }

            // Step 5: Cut the connection to next part if current exists
            if (current != null) {
                ListNode nextPart = current.next;  // Save the start of next part
                current.next = null;               // Cut the connection
                current = nextPart;                // Move to start of next part
            }

            // Add current part to result (could be null if partSize is 0)
            result[i] = partHead;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the list once to count nodes: O(n)
- We traverse again to split into parts: O(n)
- Total: O(n) where n is the number of nodes

**Space Complexity: O(1) extra space**

- We use only a constant amount of extra space for pointers and counters
- The output array of size k is required by the problem, so it doesn't count toward extra space
- If we consider the output, it's O(k) for the array of heads

## Common Mistakes

1. **Forgetting to cut connections between parts**: This is the most common mistake. After moving to the last node of a part, you MUST set `current.next = null` to separate it from the next part. Otherwise, you'll return linked lists that are still connected.

2. **Off-by-one errors in the inner loop**: When moving to the last node of a part, you need to move `part_size - 1` steps, not `part_size` steps. If part_size = 3, you move from node 1 to node 3, which requires 2 steps.

3. **Not handling empty/null parts correctly**: When `k > n`, some parts will be empty. The code should handle this by adding `null` to the result array for those parts. In our solution, when `part_size = 0`, `part_head` remains as `current` (which could be null), and we don't enter the inner loop.

4. **Incorrect remainder distribution**: The remainder should be distributed to the FIRST `remainder` parts, not the last ones. This ensures the size difference constraint is satisfied. Giving extra nodes to the last parts would violate the "no two parts differ by more than 1" rule.

## When You'll See This Pattern

This problem combines several important linked list techniques:

1. **Length calculation + modular arithmetic**: Similar to [Rotate List](/problem/rotate-list) where you need to calculate effective rotation amount using `k % n`.

2. **Pointer manipulation with size constraints**: Like in [Odd Even Linked List](/problem/odd-even-linked-list), you need to carefully move pointers while maintaining connections.

3. **Splitting/partitioning linked lists**: [Partition List](/problem/partition-list) requires splitting a list based on a value constraint, though the splitting logic is different.

4. **Circular list splitting**: [Split a Circular Linked List](/problem/split-a-circular-linked-list) uses similar pointer manipulation but with the added complexity of circular lists.

The core pattern is: "Calculate, then distribute, then cut." You first calculate how to distribute elements, then traverse while cutting at calculated boundaries.

## Key Takeaways

1. **Two-pass approach is often optimal for linked list problems**: First pass to gather information (like length), second pass to perform the operation. Don't be afraid of O(n) time if it gives you O(1) space.

2. **Modular arithmetic distributes remainders evenly**: When splitting n items into k groups, `n // k` gives the base size and `n % k` tells you how many groups get an extra item. Always distribute extras to the first groups to minimize size differences.

3. **Pointer safety is critical**: Always check if a pointer is null before dereferencing it. When cutting linked lists, save the next pointer before cutting the connection.

4. **Edge cases matter**: Empty lists, k > n, k = 1, and n % k = 0 are all important test cases. A good solution handles all of them gracefully.

Related problems: [Rotate List](/problem/rotate-list), [Odd Even Linked List](/problem/odd-even-linked-list), [Split a Circular Linked List](/problem/split-a-circular-linked-list)
