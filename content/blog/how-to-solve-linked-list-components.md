---
title: "How to Solve Linked List Components — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Linked List Components. Medium difficulty, 57.8% acceptance rate. Topics: Array, Hash Table, Linked List."
date: "2027-01-30"
category: "dsa-patterns"
tags: ["linked-list-components", "array", "hash-table", "linked-list", "medium"]
---

## How to Solve Linked List Components

This problem asks us to count how many "connected components" exist in a linked list when we only consider nodes whose values appear in a given array. Two values are connected if they appear consecutively in the linked list. The tricky part is that the array values are unique and can appear in any order, but the connection depends entirely on their original positions in the linked list.

**Why this is interesting:** It combines linked list traversal with set lookups, requiring careful thinking about how to detect component boundaries. The challenge isn't about modifying the list structure, but about recognizing patterns in the sequence.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- Linked list: 0 → 1 → 2 → 3 → 4
- nums = [0, 3, 1, 4]

**Step-by-step reasoning:**

1. First, we need to know which values matter. Create a set from nums: {0, 1, 3, 4}
2. Traverse the linked list:
   - Node 0: Value 0 is in the set. This starts a new component. Count = 1
   - Node 1: Value 1 is in the set AND the previous node (0) was also in the set. This continues the same component. Count stays at 1
   - Node 2: Value 2 is NOT in the set. This breaks any ongoing component.
   - Node 3: Value 3 is in the set, but the previous node (2) was NOT in the set. This starts a new component. Count = 2
   - Node 4: Value 4 is in the set AND the previous node (3) was in the set. This continues the same component. Count stays at 2
3. Final answer: 2 components (0→1 and 3→4)

The key insight: A new component starts when we encounter a node whose value is in nums, AND either:

- It's the first node we see that's in nums, OR
- The previous node's value was NOT in nums

## Brute Force Approach

A naive approach might try to find all components by repeatedly scanning the list:

1. For each value in nums, find its position in the linked list
2. Sort these positions
3. Count how many groups of consecutive positions exist

However, this has several problems:

- Finding each value's position requires O(n) time per value, giving O(n × m) time
- We need to handle duplicates and ordering carefully
- The positions might not be consecutive even when values appear consecutively in the list

Here's what the brute force might look like:

```python
def numComponents(head, nums):
    # Store all positions of values in nums
    positions = []
    current = head
    pos = 0

    # First pass: find positions of all nums values
    while current:
        if current.val in nums:
            positions.append(pos)
        current = current.next
        pos += 1

    # Sort positions
    positions.sort()

    # Count components (groups of consecutive positions)
    count = 0
    i = 0
    while i < len(positions):
        count += 1
        # Skip all consecutive positions
        while i + 1 < len(positions) and positions[i+1] == positions[i] + 1:
            i += 1
        i += 1

    return count
```

**Why this is inefficient:**

- The `current.val in nums` check is O(m) for each node, giving O(n × m) time
- We need extra O(m) space for positions
- The approach is more complex than necessary

## Optimized Approach

The key insight is that we don't need to track positions explicitly. We can traverse the linked list once and use a simple state machine:

1. Convert nums to a set for O(1) lookups
2. Traverse the linked list node by node
3. Track whether we're currently "inside" a component
4. When we encounter a node whose value is in the set:
   - If we're NOT currently inside a component, this starts a new component (increment count)
   - Mark that we're now inside a component
5. When we encounter a node whose value is NOT in the set:
   - Mark that we're NOT inside a component (end any ongoing component)

This works because components in the linked list correspond to maximal consecutive sequences of nodes whose values are in nums. We detect the start of each such sequence.

**Why this is optimal:**

- Single pass through the linked list: O(n)
- Set lookup is O(1)
- No extra passes or complex data structures needed

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = nodes in list, m = values in nums
# Space: O(m) for the set
class Solution:
    def numComponents(self, head: Optional[ListNode], nums: List[int]) -> int:
        # Convert nums to a set for O(1) lookups
        # This is crucial for efficiency
        num_set = set(nums)

        current = head
        count = 0
        in_component = False  # Tracks if we're currently inside a component

        # Traverse the entire linked list
        while current:
            # Check if current node's value is in our set of interest
            if current.val in num_set:
                # If we're NOT already in a component, this starts a new one
                if not in_component:
                    count += 1
                    in_component = True  # Mark that we're now inside a component
                # If we're already in a component, continue it (do nothing special)
            else:
                # Current value not in set, so we're not in a component
                in_component = False

            # Move to next node
            current = current.next

        return count
```

```javascript
// Time: O(n + m) where n = nodes in list, m = values in nums
// Space: O(m) for the set
function numComponents(head, nums) {
  // Convert nums array to a Set for O(1) lookups
  const numSet = new Set(nums);

  let current = head;
  let count = 0;
  let inComponent = false; // Tracks if we're currently inside a component

  // Traverse the entire linked list
  while (current !== null) {
    // Check if current node's value is in our set of interest
    if (numSet.has(current.val)) {
      // If we're NOT already in a component, this starts a new one
      if (!inComponent) {
        count++;
        inComponent = true; // Mark that we're now inside a component
      }
      // If we're already in a component, continue it (do nothing special)
    } else {
      // Current value not in set, so we're not in a component
      inComponent = false;
    }

    // Move to next node
    current = current.next;
  }

  return count;
}
```

```java
// Time: O(n + m) where n = nodes in list, m = values in nums
// Space: O(m) for the set
class Solution {
    public int numComponents(ListNode head, int[] nums) {
        // Convert nums array to a HashSet for O(1) lookups
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }

        ListNode current = head;
        int count = 0;
        boolean inComponent = false;  // Tracks if we're currently inside a component

        // Traverse the entire linked list
        while (current != null) {
            // Check if current node's value is in our set of interest
            if (numSet.contains(current.val)) {
                // If we're NOT already in a component, this starts a new one
                if (!inComponent) {
                    count++;
                    inComponent = true;  // Mark that we're now inside a component
                }
                // If we're already in a component, continue it (do nothing special)
            } else {
                // Current value not in set, so we're not in a component
                inComponent = false;
            }

            // Move to next node
            current = current.next;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- O(m) to convert nums to a set (where m = length of nums array)
- O(n) to traverse the linked list once (where n = number of nodes)
- Each set lookup during traversal is O(1) on average

**Space Complexity: O(m)**

- We need O(m) space to store the set of nums values
- We use only O(1) additional space for pointers and counters

## Common Mistakes

1. **Not using a set for O(1) lookups:** Some candidates check `if val in nums` directly, which is O(m) per node, leading to O(n × m) time. Always convert to a set when you need frequent membership tests.

2. **Off-by-one errors with component counting:** The most common logic error is incrementing the count at the wrong time. Remember: increment only when you ENTER a component (current value in set AND previous value not in set), not when you're inside it.

3. **Forgetting that nums values are unique:** The problem states nums contains unique values, so we don't need to handle duplicates. If you try to handle duplicates unnecessarily, you might overcomplicate the solution.

4. **Not handling empty lists or empty nums:** While the constraints guarantee non-empty inputs, it's good practice to mention edge cases. An empty nums array should return 0 components, and an empty list with non-empty nums should also return 0.

## When You'll See This Pattern

This "consecutive grouping" pattern appears in various problems where you need to count or process maximal consecutive sequences:

1. **Longest Consecutive Sequence (LeetCode 128):** Find the longest consecutive elements sequence in an unsorted array. Similar state tracking but with different grouping criteria.

2. **Max Consecutive Ones (LeetCode 485):** Find the maximum number of consecutive 1s in a binary array. Same pattern of tracking "in sequence" state.

3. **Partition Labels (LeetCode 763):** Partition a string into as many parts as possible so each letter appears in at most one part. Uses similar boundary detection logic.

The core technique is: **traverse once while tracking whether you're "inside" a group, and update counts when groups start or end.**

## Key Takeaways

1. **Convert arrays to sets for frequent membership tests:** When you need to check "is this value in a given list?" many times, a set gives O(1) lookups vs O(n) for arrays/lists.

2. **Use a state variable for sequence detection:** When counting maximal consecutive sequences, a simple boolean flag tracking "am I currently in a sequence?" is often sufficient and cleaner than complex position tracking.

3. **Linked list problems often combine with other data structures:** Don't limit yourself to pointer manipulation. It's common and acceptable to use additional data structures (like sets) to solve linked list problems efficiently.

Related problems: [Merge Nodes in Between Zeros](/problem/merge-nodes-in-between-zeros)
