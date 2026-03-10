---
title: "How to Solve Palindrome Linked List — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Palindrome Linked List. Easy difficulty, 57.5% acceptance rate. Topics: Linked List, Two Pointers, Stack, Recursion."
date: "2026-04-09"
category: "dsa-patterns"
tags: ["palindrome-linked-list", "linked-list", "two-pointers", "stack", "easy"]
---

# How to Solve Palindrome Linked List

A palindrome linked list reads the same forwards and backwards. The challenge is that we can only traverse the list forward, but checking a palindrome requires comparing the first element with the last, second with second-last, and so on. This problem tests your ability to manipulate linked lists efficiently while handling the forward-only traversal constraint.

## Visual Walkthrough

Let's trace through the list `1 → 2 → 3 → 2 → 1`:

**Step 1: Find the middle**

- Fast pointer moves 2 steps, slow pointer moves 1 step
- After first move: slow at 2, fast at 3
- After second move: slow at 3, fast at 1 (end)
- Middle is at node with value 3

**Step 2: Reverse the second half**

- Second half: `2 → 1`
- Reverse it to get: `1 → 2`

**Step 3: Compare both halves**

- First half: `1 → 2`
- Second half (reversed): `1 → 2`
- Compare 1 with 1 ✓
- Compare 2 with 2 ✓
- All match, so it's a palindrome

For an even-length list like `1 → 2 → 2 → 1`:

- Middle would be at the second 2
- Reverse second half `2 → 1` to `1 → 2`
- Compare `1 → 2` with `1 → 2` ✓

## Brute Force Approach

The most straightforward approach is to:

1. Traverse the list and copy all values into an array
2. Use two pointers to check if the array is a palindrome

```python
def isPalindromeBrute(head):
    values = []
    current = head
    while current:
        values.append(current.val)
        current = current.next

    left, right = 0, len(values) - 1
    while left < right:
        if values[left] != values[right]:
            return False
        left += 1
        right -= 1
    return True
```

**Why this isn't optimal:**

- Time: O(n) - we traverse the list once and the array once
- Space: O(n) - we store all values in an array
- While the time complexity is acceptable, the space complexity can be improved to O(1) by modifying the list in-place

The brute force approach works but uses extra space. In interviews, you'd be expected to optimize this to constant space.

## Optimal Solution

The optimal approach uses the fast and slow pointer technique to find the middle, reverses the second half in-place, then compares both halves. This gives us O(n) time and O(1) space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isPalindrome(head):
    # Step 1: Find the middle of the linked list
    # Fast pointer moves 2 steps, slow moves 1 step
    # When fast reaches the end, slow is at the middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Reverse the second half of the list
    # We'll reverse starting from the middle node
    prev = None
    current = slow  # Start reversing from the middle
    while current:
        next_node = current.next  # Store next node
        current.next = prev       # Reverse the link
        prev = current           # Move prev forward
        current = next_node      # Move current forward

    # Step 3: Compare the first half with the reversed second half
    # prev now points to the head of the reversed second half
    left, right = head, prev
    while right:  # Only need to check the second half
        if left.val != right.val:
            return False
        left = left.next
        right = right.next

    # Optional: Restore the original list (good practice)
    # current = prev
    # prev = None
    # while current:
    #     next_node = current.next
    #     current.next = prev
    #     prev = current
    #     current = next_node

    return True
```

```javascript
// Time: O(n) | Space: O(1)
function isPalindrome(head) {
  // Step 1: Find the middle using fast and slow pointers
  let slow = head;
  let fast = head;

  // Fast moves twice as fast as slow
  // When fast reaches end, slow is at middle
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 2: Reverse the second half
  let prev = null;
  let current = slow; // Start from middle
  while (current !== null) {
    const nextNode = current.next; // Save next node
    current.next = prev; // Reverse the link
    prev = current; // Move prev forward
    current = nextNode; // Move current forward
  }

  // Step 3: Compare both halves
  let left = head;
  let right = prev; // prev is head of reversed second half

  // Only need to check until right reaches null
  while (right !== null) {
    if (left.val !== right.val) {
      return false;
    }
    left = left.next;
    right = right.next;
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean isPalindrome(ListNode head) {
    // Step 1: Find the middle using fast and slow pointers
    ListNode slow = head;
    ListNode fast = head;

    // Move fast twice as fast as slow
    // When fast reaches end, slow is at middle
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse the second half
    ListNode prev = null;
    ListNode current = slow;  // Start reversing from middle
    while (current != null) {
        ListNode nextNode = current.next;  // Store next node
        current.next = prev;               // Reverse the link
        prev = current;                    // Move prev forward
        current = nextNode;                // Move current forward
    }

    // Step 3: Compare first half with reversed second half
    ListNode left = head;
    ListNode right = prev;  // prev is head of reversed second half

    // Only need to check until right reaches null
    while (right != null) {
        if (left.val != right.val) {
            return false;
        }
        left = left.next;
        right = right.next;
    }

    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the middle: O(n/2) ≈ O(n)
- Reversing the second half: O(n/2) ≈ O(n)
- Comparing both halves: O(n/2) ≈ O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant number of pointers (slow, fast, prev, current, next_node)
- No additional data structures that grow with input size
- The reversal is done in-place by modifying the existing links

## Common Mistakes

1. **Not handling odd/even length lists correctly**: When finding the middle with fast/slow pointers, for odd-length lists, the middle node doesn't need to be compared with anything. For even-length lists, the slow pointer ends at the first node of the second half. Our solution handles both cases correctly because we only compare until the reversed second half is exhausted.

2. **Forgetting to restore the list (if required)**: While not always required for the solution, in a real-world scenario or if the problem specifies not to modify the input, you should restore the list after checking. This involves reversing the second half back to its original order.

3. **Incorrect termination condition in comparison**: When comparing halves, you only need to check until the reversed second half reaches null. Don't check the entire list, as for odd-length lists, the middle node would be compared twice.

4. **Null pointer exceptions with empty or single-node lists**: Always handle edge cases:
   - Empty list (head = null): Should return true (empty sequence is palindrome)
   - Single node: Should return true
     Our solution handles these because the while loops won't execute for these cases.

## When You'll See This Pattern

The fast/slow pointer technique combined with in-place reversal is a powerful pattern for linked list problems:

1. **Linked List Cycle (LeetCode 141)**: Uses fast/slow pointers to detect cycles without extra space.
2. **Middle of the Linked List (LeetCode 876)**: Direct application of fast/slow pointers to find the middle.
3. **Reorder List (LeetCode 143)**: Similar pattern - find middle, reverse second half, then merge.
4. **Reverse Linked List (LeetCode 206)**: The reversal technique is fundamental to many linked list problems.

This pattern is especially useful when you need to:

- Find a midpoint without knowing the length
- Process a list in reverse without extra space
- Compare symmetric positions in a list

## Key Takeaways

1. **Fast/Slow pointers are your friend**: When you need to find the middle of a linked list without knowing its length, the fast/slow pointer technique is the most efficient approach (O(n) time, O(1) space).

2. **In-place reversal saves space**: Instead of using a stack or array to store values for comparison, reversing part of the list in-place gives you O(1) space complexity while maintaining O(n) time.

3. **Break complex operations into steps**: This problem combines three simpler operations: finding the middle, reversing a linked list, and comparing two lists. Recognizing and implementing these building blocks separately makes the problem more manageable.

Related problems: [Palindrome Number](/problem/palindrome-number), [Valid Palindrome](/problem/valid-palindrome), [Reverse Linked List](/problem/reverse-linked-list)
