---
title: "How to Solve Merge k Sorted Lists — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Merge k Sorted Lists. Hard difficulty, 58.9% acceptance rate. Topics: Linked List, Divide and Conquer, Heap (Priority Queue), Merge Sort."
date: "2026-04-07"
category: "dsa-patterns"
tags: ["merge-k-sorted-lists", "linked-list", "divide-and-conquer", "heap-(priority-queue)", "hard"]
---

# How to Solve Merge k Sorted Lists

You're given `k` sorted linked lists and need to merge them into a single sorted linked list. The challenge is doing this efficiently—merging two lists is straightforward, but with `k` lists, a naive approach becomes prohibitively slow. This problem tests your understanding of priority queues, divide-and-conquer, and how to efficiently manage multiple pointers.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have three sorted lists:

```
List 1: 1 → 4 → 5
List 2: 1 → 3 → 4
List 3: 2 → 6
```

We need to merge these into one sorted list. The key insight: at any moment, the smallest remaining element must be at the head of one of the `k` lists. So we need a way to efficiently find which list currently has the smallest head element.

Imagine we could look at all current head nodes (1, 1, 2) and pick the smallest (either 1). After taking that 1, we advance that list's pointer, and now we compare the new heads (4, 1, 2). The smallest is 1 again, so we take it. This process continues until all lists are exhausted.

The challenge is doing this comparison efficiently. Checking all `k` heads each time would be O(k) per element, leading to O(nk) total time where `n` is the total number of nodes. We need a data structure that lets us quickly get the minimum element and add new elements as we advance through lists.

## Brute Force Approach

The most straightforward approach is to collect all values from all lists into an array, sort the array, and then build a new linked list from the sorted values.

**Steps:**

1. Traverse all `k` lists and collect all node values into an array
2. Sort the array using your language's built-in sort (typically O(n log n))
3. Create a new linked list from the sorted array

**Why it's insufficient:**

- Sorting is O(n log n) where n is the total number of nodes
- This doesn't leverage the fact that the individual lists are already sorted
- For large inputs, the log n factor makes this slower than optimal solutions
- It requires O(n) extra space for the array

While this approach would work and pass some test cases, it's not optimal and doesn't demonstrate the algorithmic thinking interviewers look for.

## Optimized Approach

The key insight is that we need to repeatedly find the smallest current node among the `k` list heads. A **min-heap (priority queue)** is perfect for this:

1. **Initialize**: Add the first node from each list to a min-heap (if the list is not empty)
2. **Extract minimum**: Remove the smallest node from the heap
3. **Add to result**: Append this node to our merged list
4. **Add next candidate**: If the extracted node has a next node, add that next node to the heap
5. **Repeat**: Continue until the heap is empty

**Why a heap works:**

- Insertion and extraction from a min-heap are O(log k) operations
- We perform at most n insertions and n extractions (where n is total nodes)
- This gives us O(n log k) time complexity, which is much better than O(nk) or O(n log n)
- The heap only needs to store at most k nodes at any time, so space is O(k)

**Alternative approach: Divide and Conquer**
Another optimal approach uses merge sort principles:

1. Pair up the lists and merge them two at a time
2. Repeat until only one list remains
3. This also achieves O(n log k) time but uses O(1) extra space (not counting recursion stack)

The heap approach is generally more intuitive and is what we'll implement in our solution.

## Optimal Solution

Here's the complete solution using a min-heap/priority queue:

<div class="code-group">

```python
# Time: O(n log k) where n is total nodes, k is number of lists
# Space: O(k) for the heap
import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists):
        """
        Merge k sorted linked lists into one sorted linked list.

        Args:
            lists: List of ListNode objects, each head of a sorted linked list

        Returns:
            ListNode: Head of merged sorted linked list
        """
        # Create a dummy node to simplify edge cases (empty lists, etc.)
        dummy = ListNode(0)
        current = dummy

        # Initialize min-heap with the first node from each non-empty list
        # We store (value, index, node) tuples so heapq can compare them
        heap = []
        for i, node in enumerate(lists):
            if node:  # Only add non-empty lists to the heap
                heapq.heappush(heap, (node.val, i, node))

        # Process nodes until heap is empty
        while heap:
            # Get the smallest node from the heap
            val, idx, node = heapq.heappop(heap)

            # Add this node to our result list
            current.next = node
            current = current.next

            # If the extracted node has a next node, add it to the heap
            if node.next:
                heapq.heappush(heap, (node.next.val, idx, node.next))

        return dummy.next
```

```javascript
// Time: O(n log k) where n is total nodes, k is number of lists
// Space: O(k) for the priority queue
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

class Solution {
  mergeKLists(lists) {
    /**
     * Merge k sorted linked lists into one sorted linked list.
     *
     * @param {ListNode[]} lists - Array of ListNode objects
     * @return {ListNode} - Head of merged sorted linked list
     */

    // Create a dummy node to simplify edge cases
    const dummy = new ListNode(0);
    let current = dummy;

    // Initialize min-heap (priority queue) with first nodes
    // JavaScript doesn't have a built-in heap, so we'll use an array and sort
    // For interviews, you can mention you'd use a proper heap library
    const heap = [];

    // Add first node from each non-empty list to the heap
    for (let i = 0; i < lists.length; i++) {
      const node = lists[i];
      if (node !== null) {
        heap.push({ val: node.val, idx: i, node: node });
      }
    }

    // Convert array to min-heap (smallest value first)
    heap.sort((a, b) => a.val - b.val);

    // Process nodes until heap is empty
    while (heap.length > 0) {
      // Get the smallest node from the heap
      const { val, idx, node } = heap.shift();

      // Add this node to our result list
      current.next = node;
      current = current.next;

      // If the extracted node has a next node, add it to the heap
      if (node.next !== null) {
        heap.push({ val: node.next.val, idx: idx, node: node.next });
        // Re-sort to maintain heap property
        heap.sort((a, b) => a.val - b.val);
      }
    }

    return dummy.next;
  }
}
```

```java
// Time: O(n log k) where n is total nodes, k is number of lists
// Space: O(k) for the priority queue
import java.util.PriorityQueue;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        /**
         * Merge k sorted linked lists into one sorted linked list.
         *
         * @param lists Array of ListNode objects, each head of a sorted linked list
         * @return Head of merged sorted linked list
         */

        // Create a dummy node to simplify edge cases
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        // Initialize min-heap (priority queue)
        // We use a custom comparator to compare ListNode values
        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);

        // Add first node from each non-empty list to the heap
        for (ListNode node : lists) {
            if (node != null) {
                heap.offer(node);
            }
        }

        // Process nodes until heap is empty
        while (!heap.isEmpty()) {
            // Get the smallest node from the heap
            ListNode node = heap.poll();

            // Add this node to our result list
            current.next = node;
            current = current.next;

            // If the extracted node has a next node, add it to the heap
            if (node.next != null) {
                heap.offer(node.next);
            }
        }

        return dummy.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log k)**

- `n` is the total number of nodes across all lists
- `k` is the number of linked lists
- We perform at most `n` insertions and `n` removals from the heap
- Each heap operation (insert/remove) takes O(log k) time
- Therefore total time is O(n log k)

**Space Complexity: O(k)**

- The heap stores at most `k` nodes at any time (one from each list)
- The output list uses O(n) space but this is usually not counted as extra space
- If we count the output, total space would be O(n + k) ≈ O(n)

**Comparison with other approaches:**

- Brute force (collect all, sort): O(n log n) time, O(n) space
- Sequential merge (merge lists one by one): O(nk) time, O(1) space
- Divide and conquer merge: O(n log k) time, O(log k) recursion stack space
- Heap approach: O(n log k) time, O(k) space

The heap approach provides the best balance of time efficiency and code simplicity.

## Common Mistakes

1. **Forgetting to handle empty lists**: When initializing the heap, you must check if each list is not empty/non-null before adding its head. Otherwise, you'll get null pointer errors.

2. **Not using a dummy node**: Without a dummy node, you need special handling for the first node added to the result. The dummy node pattern simplifies the code significantly.

3. **Incorrect heap comparator in Java**: When using a priority queue in Java, you must provide a custom comparator for ListNode objects since they don't implement Comparable. Forgetting this leads to compilation errors.

4. **Not advancing the correct list**: After extracting a node from the heap, you must add that node's `next` to the heap (if it exists). A common mistake is trying to track which list the node came from incorrectly.

5. **Infinite loop with circular references**: If the input lists have cycles (though they shouldn't in this problem), the algorithm would run forever. Always validate assumptions about input structure.

## When You'll See This Pattern

The "merge k sorted things" pattern appears in various forms:

1. **Merge k Sorted Arrays**: Same concept but with arrays instead of linked lists. The heap approach works identically.

2. **Ugly Number II (LeetCode 264)**: Uses a min-heap to generate numbers with prime factors 2, 3, and 5. Similar pattern of extracting minimum and adding new candidates.

3. **Find K Pairs with Smallest Sums (LeetCode 373)**: Maintain a heap of pairs from two sorted arrays, always extracting the smallest sum and adding new candidates.

4. **Smallest Range Covering Elements from K Lists (LeetCode 632)**: Uses a similar heap approach to track current elements from multiple sorted lists.

The core pattern is: when you need to repeatedly find the minimum/maximum among multiple sorted sequences and advance through them, a heap/priority queue is usually the right tool.

## Key Takeaways

1. **Heap/priority queue is the go-to for merging multiple sorted sequences**: When you need to merge k sorted lists/arrays, think heap first. It efficiently manages the "which list has the current smallest element?" problem.

2. **Dummy node simplifies linked list manipulation**: Always use a dummy node when building a new linked list. It eliminates special cases for the first node.

3. **Understand the trade-offs**: The heap approach uses O(k) extra space but is simple to implement. The divide-and-conquer approach uses less space but is more complex. Know both for interviews.

4. **The idx in Python's heap prevents comparison errors**: When two nodes have the same value, Python's heap needs a tie-breaker. Using an index ensures nodes are comparable even with equal values.

Remember: This problem combines linked list manipulation with heap data structure knowledge—two favorite interview topics. Mastering this solution prepares you for a wide range of similar problems.

Related problems: [Merge Two Sorted Lists](/problem/merge-two-sorted-lists), [Ugly Number II](/problem/ugly-number-ii), [Smallest Subarrays With Maximum Bitwise OR](/problem/smallest-subarrays-with-maximum-bitwise-or)
