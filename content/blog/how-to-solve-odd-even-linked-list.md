---
title: "How to Solve Odd Even Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Odd Even Linked List. Medium difficulty, 62.3% acceptance rate. Topics: Linked List."
date: "2026-07-22"
category: "dsa-patterns"
tags: ["odd-even-linked-list", "linked-list", "medium"]
---

# How to Solve Odd Even Linked List

This problem asks us to rearrange a singly linked list so that all nodes at odd positions (1st, 3rd, 5th, etc.) come first, followed by all nodes at even positions (2nd, 4th, 6th, etc.), while maintaining their relative order within each group. The challenge lies in rearranging the nodes in-place without creating a new list, which requires careful pointer manipulation to avoid losing nodes or creating cycles.

## Visual Walkthrough

Let's trace through the example `1 → 2 → 3 → 4 → 5`:

**Initial state:**

```
odd: 1 → 2 → 3 → 4 → 5
even: 2 → 3 → 4 → 5
evenHead: 2 → 3 → 4 → 5
```

**Step 1:** Connect odd to next odd (1 → 3)

```
odd: 1 → 3 → 4 → 5
even: 2 → 3 → 4 → 5
evenHead: 2 → 3 → 4 → 5
```

**Step 2:** Move odd pointer forward (now at 3)

```
odd: 3 → 4 → 5
even: 2 → 3 → 4 → 5
evenHead: 2 → 3 → 4 → 5
```

**Step 3:** Connect even to next even (2 → 4)

```
odd: 3 → 4 → 5
even: 2 → 4 → 5
evenHead: 2 → 4 → 5
```

**Step 4:** Move even pointer forward (now at 4)

```
odd: 3 → 4 → 5
even: 4 → 5
evenHead: 2 → 4 → 5
```

**Step 5:** Connect odd to next odd (3 → 5)

```
odd: 3 → 5
even: 4 → 5
evenHead: 2 → 4 → 5
```

**Step 6:** Move odd pointer forward (now at 5)

```
odd: 5
even: 4 → 5
evenHead: 2 → 4 → 5
```

**Step 7:** Connect even to next even (4 → null)

```
odd: 5
even: 4
evenHead: 2 → 4
```

**Step 8:** Connect odd list to even list (5 → 2)

```
Result: 1 → 3 → 5 → 2 → 4
```

## Brute Force Approach

A naive approach would be to:

1. Traverse the list once to collect all odd-position nodes
2. Traverse again to collect all even-position nodes
3. Create a new list by combining these collections

This approach requires O(n) extra space for storing the nodes and doesn't work in-place. While it would produce the correct order, it violates the spirit of linked list problems which typically expect in-place modifications. The interviewer would likely ask for an O(1) space solution.

## Optimized Approach

The key insight is that we can rearrange the list in-place by maintaining two separate chains: one for odd nodes and one for even nodes. We need four pointers:

1. `odd` - tracks the current odd node (starts at head)
2. `even` - tracks the current even node (starts at head.next)
3. `evenHead` - remembers the start of the even list (so we can attach it later)

The algorithm works by:

- Connecting each odd node to the next odd node (odd.next = odd.next.next)
- Connecting each even node to the next even node (even.next = even.next.next)
- Moving pointers forward along their respective chains
- Finally connecting the end of the odd list to the head of the even list

This approach works in O(1) space because we're just rearranging existing pointers, not creating new nodes.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# n = number of nodes in the linked list
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Edge case: empty list or single node
        if not head or not head.next:
            return head

        # Initialize pointers
        odd = head           # Start of odd list (first node is odd)
        even = head.next     # Start of even list (second node is even)
        even_head = even     # Remember start of even list to attach later

        # Traverse while both odd and even have next nodes
        # We check even and even.next because even is always one step ahead
        while even and even.next:
            # Connect current odd to next odd (skip over even)
            odd.next = odd.next.next
            # Move odd pointer forward to next odd node
            odd = odd.next

            # Connect current even to next even (skip over odd)
            even.next = even.next.next
            # Move even pointer forward to next even node
            even = even.next

        # Connect end of odd list to start of even list
        odd.next = even_head

        return head
```

```javascript
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list
var oddEvenList = function (head) {
  // Edge case: empty list or single node
  if (!head || !head.next) {
    return head;
  }

  // Initialize pointers
  let odd = head; // Start of odd list (first node is odd)
  let even = head.next; // Start of even list (second node is even)
  const evenHead = even; // Remember start of even list to attach later

  // Traverse while both odd and even have next nodes
  // We check even and even.next because even is always one step ahead
  while (even && even.next) {
    // Connect current odd to next odd (skip over even)
    odd.next = odd.next.next;
    // Move odd pointer forward to next odd node
    odd = odd.next;

    // Connect current even to next even (skip over odd)
    even.next = even.next.next;
    // Move even pointer forward to next even node
    even = even.next;
  }

  // Connect end of odd list to start of even list
  odd.next = evenHead;

  return head;
};
```

```java
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list
class Solution {
    public ListNode oddEvenList(ListNode head) {
        // Edge case: empty list or single node
        if (head == null || head.next == null) {
            return head;
        }

        // Initialize pointers
        ListNode odd = head;           // Start of odd list (first node is odd)
        ListNode even = head.next;     // Start of even list (second node is even)
        ListNode evenHead = even;      // Remember start of even list to attach later

        // Traverse while both odd and even have next nodes
        // We check even and even.next because even is always one step ahead
        while (even != null && even.next != null) {
            // Connect current odd to next odd (skip over even)
            odd.next = odd.next.next;
            // Move odd pointer forward to next odd node
            odd = odd.next;

            // Connect current even to next even (skip over odd)
            even.next = even.next.next;
            // Move even pointer forward to next even node
            even = even.next;
        }

        // Connect end of odd list to start of even list
        odd.next = evenHead;

        return head;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the linked list. We traverse each node exactly once. The while loop runs until we reach the end of the list, and in each iteration we process two nodes (one odd and one even).

**Space Complexity:** O(1). We only use a constant amount of extra space for the pointers (`odd`, `even`, `evenHead`). No additional data structures are created, and we modify the list in-place by rearranging existing pointers.

## Common Mistakes

1. **Forgetting to save `evenHead`**: Without saving the start of the even list, you won't be able to attach it to the end of the odd list. The even pointer moves through the list, so you need a separate reference to the beginning.

2. **Incorrect loop condition**: Using `while odd and odd.next` instead of `while even and even.next` can cause null pointer exceptions. Since `even` is always one node ahead of `odd`, checking `even` ensures we don't try to access `even.next` when `even` is null.

3. **Not handling edge cases**: Forgetting to check for empty list (`head == null`) or single node list (`head.next == null`) can lead to runtime errors. Always handle these cases at the beginning.

4. **Creating a cycle accidentally**: If you don't properly terminate the even list (by having the last even node point to null), you might create a cycle in the list. The algorithm naturally handles this because when we exit the loop, `even.next` is already null.

## When You'll See This Pattern

This "two-pointer separation" pattern appears in several linked list problems:

1. **Partition List (LeetCode 86)**: Similar concept of separating nodes based on a condition (less than vs greater than/equal to x), then recombining.

2. **Reorder List (LeetCode 143)**: Uses a related technique of splitting the list, reversing the second half, then interleaving.

3. **Palindrome Linked List (LeetCode 234)**: Often solved by finding the middle, reversing the second half, then comparing with the first half.

The core pattern involves maintaining multiple pointers to traverse and rearrange different parts of a linked list simultaneously, often to group nodes by some property.

## Key Takeaways

1. **In-place linked list rearrangement** often requires maintaining multiple pointers to track different parts of the list while modifying connections between nodes.

2. **The "two-pointer separation" technique** is useful when you need to group nodes by some property (odd/even, value comparison, etc.) and maintain relative order within groups.

3. **Always save reference pointers** before moving traversal pointers when you'll need to access the beginning of a sublist later in the algorithm.

Related problems: [Split Linked List in Parts](/problem/split-linked-list-in-parts), [Transform Array by Parity](/problem/transform-array-by-parity)
