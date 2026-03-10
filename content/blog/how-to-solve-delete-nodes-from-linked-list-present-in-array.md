---
title: "How to Solve Delete Nodes From Linked List Present in Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete Nodes From Linked List Present in Array. Medium difficulty, 69.5% acceptance rate. Topics: Array, Hash Table, Linked List."
date: "2027-11-03"
category: "dsa-patterns"
tags:
  ["delete-nodes-from-linked-list-present-in-array", "array", "hash-table", "linked-list", "medium"]
---

# How to Solve Delete Nodes From Linked List Present in Array

You're given a linked list and an array of integers. Your task is to remove all nodes from the linked list whose values appear in the array. While this sounds straightforward, the challenge lies in efficiently checking membership (is a node's value in the array?) and handling the pointer manipulations required for deletion in a linked list. The tricky part is that we need to maintain the relative order of remaining nodes while efficiently checking if each node should be deleted.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- Linked list: 1 → 3 → 4 → 2 → 5
- Array: [3, 2]

**Step-by-step process:**

1. **Initialize:** We'll use a hash set to store array values for O(1) lookups: {3, 2}
2. **Check node 1 (value 1):** 1 is not in {3, 2}, so we keep it. Current result: 1
3. **Check node 3 (value 3):** 3 is in {3, 2}, so we skip it. We need to connect node 1 directly to whatever comes after node 3.
4. **Check node 4 (value 4):** 4 is not in {3, 2}, so we keep it. Current result: 1 → 4
5. **Check node 2 (value 2):** 2 is in {3, 2}, so we skip it. Connect node 4 to whatever comes after node 2.
6. **Check node 5 (value 5):** 5 is not in {3, 2}, so we keep it. Final result: 1 → 4 → 5

The key insight is that we need a dummy node at the beginning to handle cases where the head itself needs to be deleted. Without a dummy, we'd have special logic for the head deletion case.

## Brute Force Approach

A naive approach would be: for each node in the linked list, check if its value exists in the array by scanning the entire array.

**Algorithm:**

1. Start at the head of the linked list
2. For each node, iterate through the entire array to check if the node's value exists in the array
3. If it does, remove the node by adjusting pointers
4. Continue until all nodes are processed

**Why this is inefficient:**

- Time complexity: O(n × m) where n is the length of the linked list and m is the length of the array
- For each of n nodes, we scan through m array elements
- With n and m both potentially up to 10^5, this could be 10^10 operations, which is far too slow

**What candidates might try:**

- Some might try to sort the array and use binary search, which gives O(n log m) time
- Others might convert the array to a list and use `in` operator, which is still O(m) per check in Python
- The fundamental issue is that array lookups are O(m) unless we use a better data structure

## Optimized Approach

The key insight is that we need **fast membership testing**. Checking if a value exists in an array takes O(m) time, but checking if it exists in a hash set takes O(1) average time.

**Step-by-step reasoning:**

1. **Convert array to hash set:** This allows O(1) lookups to check if a node's value should be deleted
2. **Use a dummy node:** Create a dummy node that points to the head. This simplifies edge cases when the head needs to be deleted
3. **Traverse with two pointers:** Use `prev` pointer to track the previous valid node and `curr` pointer to examine the current node
4. **Delete nodes in-place:** When `curr` needs to be deleted, update `prev.next = curr.next` to skip over `curr`
5. **Move pointers appropriately:** Only move `prev` forward when we keep a node; always move `curr` forward

**Why this works:**

- Hash set gives us O(1) membership testing
- Dummy node handles the edge case where head is deleted
- Two-pointer approach allows in-place deletion without extra space for a new list
- We maintain the relative order of remaining nodes

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = length of linked list, m = length of array
# Space: O(m) for the hash set storing array values
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def deleteNodes(head, nums):
    # Step 1: Convert array to hash set for O(1) lookups
    # This is the key optimization - checking membership in a set is O(1)
    nums_set = set(nums)

    # Step 2: Create a dummy node that points to the head
    # This handles the edge case where the head itself needs to be deleted
    dummy = ListNode(0, head)

    # Step 3: Initialize two pointers
    # prev tracks the last node that we kept (starts at dummy)
    # curr examines the current node (starts at head)
    prev = dummy
    curr = head

    # Step 4: Traverse the entire linked list
    while curr:
        # Check if current node's value is in the deletion set
        if curr.val in nums_set:
            # Node needs to be deleted
            # Skip over curr by connecting prev directly to curr's next
            prev.next = curr.next

            # Important: we don't move prev forward because we just deleted curr
            # prev should still point to the last kept node
        else:
            # Node should be kept
            # Move prev forward to point to this kept node
            prev = curr

        # Always move curr forward to examine the next node
        curr = curr.next

    # Step 5: Return the new head (which is dummy.next)
    # dummy.next points to the first actual node after all deletions
    return dummy.next
```

```javascript
// Time: O(n + m) where n = length of linked list, m = length of array
// Space: O(m) for the Set storing array values
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function deleteNodes(head, nums) {
  // Step 1: Convert array to Set for O(1) lookups
  // Using a Set is crucial for efficient membership testing
  const numsSet = new Set(nums);

  // Step 2: Create a dummy node that points to the head
  // This simplifies handling deletions at the beginning of the list
  const dummy = new ListNode(0, head);

  // Step 3: Initialize two pointers
  // prev tracks the last node we kept (starts at dummy)
  // curr examines the current node (starts at head)
  let prev = dummy;
  let curr = head;

  // Step 4: Traverse the entire linked list
  while (curr !== null) {
    // Check if current node's value is in the deletion set
    if (numsSet.has(curr.val)) {
      // Node needs to be deleted
      // Skip over curr by connecting prev directly to curr's next
      prev.next = curr.next;

      // Important: we don't move prev forward because we deleted curr
      // prev remains pointing to the last kept node
    } else {
      // Node should be kept
      // Move prev forward to point to this kept node
      prev = curr;
    }

    // Always move curr forward to examine the next node
    curr = curr.next;
  }

  // Step 5: Return the new head (which is dummy.next)
  // dummy.next points to the first actual node after all deletions
  return dummy.next;
}
```

```java
// Time: O(n + m) where n = length of linked list, m = length of array
// Space: O(m) for the HashSet storing array values
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
    public ListNode deleteNodes(ListNode head, int[] nums) {
        // Step 1: Convert array to HashSet for O(1) lookups
        // HashSet provides constant-time contains() operation
        Set<Integer> numsSet = new HashSet<>();
        for (int num : nums) {
            numsSet.add(num);
        }

        // Step 2: Create a dummy node that points to the head
        // This handles cases where the head needs to be deleted
        ListNode dummy = new ListNode(0, head);

        // Step 3: Initialize two pointers
        // prev tracks the last node we kept (starts at dummy)
        // curr examines the current node (starts at head)
        ListNode prev = dummy;
        ListNode curr = head;

        // Step 4: Traverse the entire linked list
        while (curr != null) {
            // Check if current node's value is in the deletion set
            if (numsSet.contains(curr.val)) {
                // Node needs to be deleted
                // Skip over curr by connecting prev directly to curr's next
                prev.next = curr.next;

                // Important: we don't move prev forward because we deleted curr
                // prev remains pointing to the last kept node
            } else {
                // Node should be kept
                // Move prev forward to point to this kept node
                prev = curr;
            }

            // Always move curr forward to examine the next node
            curr = curr.next;
        }

        // Step 5: Return the new head (which is dummy.next)
        // dummy.next points to the first actual node after all deletions
        return dummy.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- **O(m):** Converting the array to a hash set. We iterate through all m elements of the array once.
- **O(n):** Traversing the linked list. We visit each of the n nodes exactly once.
- The total is O(n + m), which is linear in the combined input size.

**Space Complexity: O(m)**

- **O(m):** We store all m array values in a hash set for O(1) lookups.
- **O(1):** We use only a constant amount of extra space for pointers (dummy, prev, curr).
- The dominant factor is the hash set, giving us O(m) space complexity.

## Common Mistakes

1. **Forgetting the dummy node:** Without a dummy node, you need special handling when the head needs to be deleted. Many candidates write messy code with multiple condition checks for the head case. The dummy node pattern is cleaner and less error-prone.

2. **Incorrect pointer movement when deleting:** A frequent error is moving `prev` forward even when you delete a node. Remember: when you delete `curr`, you should NOT move `prev` forward because `prev` should still point to the last kept node. Only move `prev` forward when you keep a node.

3. **Using array for membership testing:** Some candidates check `if curr.val in nums:` (Python) or similar in other languages, which is O(m) per check. This leads to O(n × m) time complexity. Always convert to a hash set first for O(1) lookups.

4. **Not handling empty list or empty array:** While the problem constraints might guarantee non-empty inputs, it's good practice to check. An empty list should return `None`/`null`. An empty array means no deletions should occur.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Hash set for membership testing:** Whenever you need to check if elements exist in a collection, converting to a hash set gives O(1) lookups. This pattern appears in:
   - **Two Sum** (LeetCode #1): Use hash map to store complements for O(1) lookups
   - **Contains Duplicate** (LeetCode #217): Use hash set to detect duplicates in O(n) time
   - **Intersection of Two Arrays** (LeetCode #349): Use hash sets to find common elements efficiently

2. **Linked list deletion with dummy node:** When modifying linked lists (especially deleting nodes), the dummy node pattern simplifies edge cases. This appears in:
   - **Remove Linked List Elements** (LeetCode #203): Almost identical pattern - remove nodes with specific values
   - **Remove Duplicates from Sorted List** (LeetCode #83): Similar pointer manipulation for deletion
   - **Remove Nth Node From End of List** (LeetCode #19): Uses dummy node to handle head deletion case

## Key Takeaways

1. **Convert to hash set for O(1) membership testing:** When you need to check if values exist in a collection, the first optimization to consider is converting to a hash-based structure (set or map) for constant-time lookups.

2. **Use dummy nodes for linked list modifications:** A dummy node that points to the head simplifies edge cases when the head might be deleted or modified. This pattern makes your code cleaner and less prone to off-by-one errors.

3. **Two-pointer traversal for in-place deletion:** When deleting nodes from a linked list, maintain a `prev` pointer to the last kept node and a `curr` pointer to examine the current node. Only advance `prev` when you keep a node.

Related problems: [Remove Linked List Elements](/problem/remove-linked-list-elements), [Delete Node in a Linked List](/problem/delete-node-in-a-linked-list), [Remove Nodes From Linked List](/problem/remove-nodes-from-linked-list)
