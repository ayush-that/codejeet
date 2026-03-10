---
title: "How to Solve Sort List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort List. Medium difficulty, 63.9% acceptance rate. Topics: Linked List, Two Pointers, Divide and Conquer, Sorting, Merge Sort."
date: "2026-08-27"
category: "dsa-patterns"
tags: ["sort-list", "linked-list", "two-pointers", "divide-and-conquer", "medium"]
---

# How to Solve Sort List

You're given the head of a singly linked list, and you need to return the list sorted in ascending order. The challenge here is that you can't simply use standard sorting algorithms like you would with arrays — linked lists don't support random access, so algorithms like quicksort that rely on indexing won't work efficiently. This problem tests your understanding of both linked list manipulation and divide-and-conquer algorithms.

## Visual Walkthrough

Let's trace through sorting the list `4 → 2 → 1 → 3` using merge sort, which is the optimal approach:

**Step 1: Find the middle**
We need to split the list into two halves. Using the slow/fast pointer technique:

- Slow starts at 4, fast starts at 4
- Move slow by 1 (to 2), fast by 2 (to 1)
- Move slow by 1 (to 1), fast by 2 (to 3)
- Move slow by 1 (to 3), fast by 2 (past end)
  We stop when fast reaches the end. The middle is at node 1, so we split into:
  Left half: `4 → 2 → 1` (actually we'll cut after 1, so left is `4 → 2`)
  Right half: `3`

**Step 2: Recursively sort each half**
For the left half `4 → 2`:

- Find middle: slow at 4, fast at 4 → slow at 2, fast past end
- Split into `4` and `2`
- Merge `4` and `2`: Compare 4 and 2 → 2 is smaller → `2 → 4`

**Step 3: Merge sorted halves**
Now we have `2 → 4` and `3`:

- Compare 2 and 3 → 2 is smaller → add 2
- Compare 4 and 3 → 3 is smaller → add 3
- Add remaining 4
  Result: `1 → 2 → 3 → 4`

The key insight is that merge sort naturally works with linked lists because:

1. Finding the middle only requires linear traversal
2. Merging two sorted lists is straightforward with pointers
3. We don't need extra space for partitioning like in array-based sorts

## Brute Force Approach

A naive approach would be to convert the linked list to an array, sort the array, then rebuild the linked list:

1. Traverse the list and store all values in an array
2. Sort the array using built-in sort (O(n log n))
3. Create a new linked list from the sorted array

While this has O(n log n) time complexity, it uses O(n) extra space for the array. More importantly, interviewers typically expect an in-place solution that sorts the actual linked list nodes rather than creating new ones. This approach also misses the point of the problem — it's testing your ability to manipulate linked lists directly.

Another brute force would be insertion sort: repeatedly take nodes from the original list and insert them into a new sorted list. This would be O(n²) time, which is too slow for large lists.

## Optimized Approach

The optimal solution uses merge sort adapted for linked lists. Here's why merge sort works well:

1. **Divide**: We can split a linked list in half using the slow/fast pointer technique (also called tortoise and hare). The slow pointer moves one step at a time while the fast moves two steps. When fast reaches the end, slow is at the middle.

2. **Conquer**: Recursively sort each half. The base case is when the list has 0 or 1 node (already sorted).

3. **Combine**: Merge two sorted linked lists. This is similar to "Merge Two Sorted Lists" (LeetCode #21) — we compare nodes from each list and link them in order.

The beauty of this approach is that it's truly in-place — we're rearranging the existing nodes by updating their `next` pointers, not creating new nodes or copying values. The recursion uses O(log n) stack space, but we're not allocating O(n) additional memory.

## Optimal Solution

Here's the complete solution using merge sort for linked lists:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(log n) for recursion stack
class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Base case: empty list or single node
        if not head or not head.next:
            return head

        # Step 1: Split the list into two halves
        # Use slow/fast pointer technique to find middle
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next      # Move slow by 1
            fast = fast.next.next # Move fast by 2

        # 'mid' will be the start of second half
        mid = slow.next
        slow.next = None  # Cut the list into two halves

        # Step 2: Recursively sort each half
        left = self.sortList(head)
        right = self.sortList(mid)

        # Step 3: Merge the two sorted halves
        return self.merge(left, right)

    def merge(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Create a dummy node to simplify edge cases
        dummy = ListNode(0)
        curr = dummy

        # Merge while both lists have nodes
        while l1 and l2:
            if l1.val <= l2.val:
                curr.next = l1
                l1 = l1.next
            else:
                curr.next = l2
                l2 = l2.next
            curr = curr.next

        # Attach remaining nodes from either list
        curr.next = l1 if l1 else l2

        return dummy.next
```

```javascript
// Time: O(n log n) | Space: O(log n) for recursion stack
var sortList = function (head) {
  // Base case: empty list or single node
  if (!head || !head.next) {
    return head;
  }

  // Step 1: Split the list into two halves
  // Use slow/fast pointer technique to find middle
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next; // Move slow by 1
    fast = fast.next.next; // Move fast by 2
  }

  // 'mid' will be the start of second half
  let mid = slow.next;
  slow.next = null; // Cut the list into two halves

  // Step 2: Recursively sort each half
  let left = sortList(head);
  let right = sortList(mid);

  // Step 3: Merge the two sorted halves
  return merge(left, right);
};

function merge(l1, l2) {
  // Create a dummy node to simplify edge cases
  let dummy = new ListNode(0);
  let curr = dummy;

  // Merge while both lists have nodes
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }

  // Attach remaining nodes from either list
  curr.next = l1 || l2;

  return dummy.next;
}
```

```java
// Time: O(n log n) | Space: O(log n) for recursion stack
class Solution {
    public ListNode sortList(ListNode head) {
        // Base case: empty list or single node
        if (head == null || head.next == null) {
            return head;
        }

        // Step 1: Split the list into two halves
        // Use slow/fast pointer technique to find middle
        ListNode slow = head;
        ListNode fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;      // Move slow by 1
            fast = fast.next.next; // Move fast by 2
        }

        // 'mid' will be the start of second half
        ListNode mid = slow.next;
        slow.next = null;  // Cut the list into two halves

        // Step 2: Recursively sort each half
        ListNode left = sortList(head);
        ListNode right = sortList(mid);

        // Step 3: Merge the two sorted halves
        return merge(left, right);
    }

    private ListNode merge(ListNode l1, ListNode l2) {
        // Create a dummy node to simplify edge cases
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;

        // Merge while both lists have nodes
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                curr.next = l1;
                l1 = l1.next;
            } else {
                curr.next = l2;
                l2 = l2.next;
            }
            curr = curr.next;
        }

        // Attach remaining nodes from either list
        curr.next = (l1 != null) ? l1 : l2;

        return dummy.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Finding the middle takes O(n) time
- We split the list recursively, creating log n levels of recursion
- At each level, we merge all nodes (total O(n) work per level)
- Total: O(n) × O(log n) = O(n log n)

**Space Complexity: O(log n)**

- This is the recursion stack depth
- We're not allocating O(n) additional memory — just rearranging existing nodes
- The merge operation uses only a few pointers (O(1) extra space)

## Common Mistakes

1. **Not handling the base case correctly**: Forgetting to check for `head.next == null` in addition to `head == null` can lead to infinite recursion. The base case should be 0 or 1 node.

2. **Incorrect middle finding**: Starting both pointers at `head` instead of `head` and `head.next` can cause issues. With `slow = head, fast = head`, when the list has 2 nodes, slow stays at first node, and we can't properly split. The pattern `slow = head, fast = head.next` ensures we split before the middle.

3. **Forgetting to cut the list**: After finding the middle, you must set `slow.next = null` to actually split the list into two separate lists. Otherwise, both halves still reference each other.

4. **Not using a dummy node in merge**: Trying to merge without a dummy node leads to complex edge cases when deciding which list becomes the new head. The dummy node pattern simplifies this significantly.

## When You'll See This Pattern

This merge sort pattern for linked lists appears in several related problems:

1. **Merge Two Sorted Lists (LeetCode #21)**: The merge step in our solution is exactly this problem. Mastering this makes the sort list problem much easier.

2. **Merge k Sorted Lists (LeetCode #23)**: An extension where you merge multiple sorted lists, often using a priority queue or divide-and-conquer approach similar to merge sort.

3. **Reorder List (LeetCode #143)**: Also uses the slow/fast pointer to find the middle, then manipulates the two halves.

4. **Palindrome Linked List (LeetCode #234)**: Finds the middle, reverses the second half, then compares with the first half.

The slow/fast pointer technique for finding the middle of a linked list is a fundamental pattern that appears in many linked list problems.

## Key Takeaways

1. **Merge sort is ideal for linked lists** because it doesn't require random access — splitting requires linear traversal (slow/fast pointers) and merging works naturally with pointer manipulation.

2. **The slow/fast pointer technique** is crucial for finding the middle of a linked list in O(n) time. Remember: start with `slow = head, fast = head.next` and move slow by 1, fast by 2 until fast reaches the end.

3. **Divide-and-conquer on linked lists** follows the same pattern: find middle, recursively process halves, combine results. This pattern appears in sorting, reordering, and palindrome checking.

Remember: When a problem involves sorting a linked list, merge sort is almost always the right approach. Arrays have more options (quicksort, heapsort), but linked lists work best with merge sort due to their sequential access nature.

Related problems: [Merge Two Sorted Lists](/problem/merge-two-sorted-lists), [Sort Colors](/problem/sort-colors), [Insertion Sort List](/problem/insertion-sort-list)
