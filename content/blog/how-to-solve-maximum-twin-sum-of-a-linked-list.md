---
title: "How to Solve Maximum Twin Sum of a Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Twin Sum of a Linked List. Medium difficulty, 81.6% acceptance rate. Topics: Linked List, Two Pointers, Stack."
date: "2027-05-18"
category: "dsa-patterns"
tags: ["maximum-twin-sum-of-a-linked-list", "linked-list", "two-pointers", "stack", "medium"]
---

# How to Solve Maximum Twin Sum of a Linked List

This problem asks us to find the maximum sum between "twin" nodes in a linked list. Given a linked list with an even number of nodes `n`, the twin of node `i` (0-indexed) is node `n-1-i`, for all `i` from `0` to `n/2 - 1`. We need to calculate the sum of each twin pair and return the maximum value.

What makes this problem interesting is that we need to pair nodes from opposite ends of the list without random access. Since linked lists only allow sequential access from the head, we need clever techniques to access both ends efficiently. This problem combines several fundamental linked list patterns you'll see in interviews.

## Visual Walkthrough

Let's trace through an example: `[5, 4, 2, 1]`

**Step 1: Identify the twins**

- List has 4 nodes (n = 4, even)
- Twin pairs: node 0 ↔ node 3, node 1 ↔ node 2
- Values: 5 ↔ 1, 4 ↔ 2

**Step 2: Calculate twin sums**

- Pair 1: 5 + 1 = 6
- Pair 2: 4 + 2 = 6

**Step 3: Find maximum**

- Max(6, 6) = 6

But here's the challenge: in a linked list, we can't directly access node 3 without traversing from the beginning. A naive approach would repeatedly traverse the list, but that's inefficient. The optimal solution involves finding the middle, reversing the second half, and then pairing nodes from both halves.

## Brute Force Approach

The most straightforward approach would be:

1. Traverse the list to get all values into an array
2. For each `i` from `0` to `n/2 - 1`, calculate `values[i] + values[n-1-i]`
3. Track the maximum sum

**Why this isn't optimal:**

- Time: O(n) to collect values + O(n/2) to calculate sums = O(n)
- Space: O(n) for the array

While this has O(n) time complexity, it uses O(n) extra space. Interviewers often expect an O(1) space solution for linked list problems when possible. More importantly, this approach doesn't demonstrate mastery of linked list manipulation techniques that interviewers want to see.

## Optimized Approach

The key insight is that we need to pair the first half of the list with the reversed second half. Here's the step-by-step reasoning:

1. **Find the middle** - Use the fast/slow pointer technique to find the middle of the list
2. **Reverse the second half** - Reverse the linked list starting from the middle node
3. **Pair and calculate** - With the first half and reversed second half, we can now pair corresponding nodes
4. **Find maximum** - Track the maximum sum as we iterate through the pairs

**Why this works:**

- After reversing the second half, the first node of the reversed second half corresponds to the last node of the original list
- The second node of the reversed second half corresponds to the second-to-last node, and so on
- This allows us to pair nodes by simply iterating through both halves simultaneously

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def pairSum(head):
    """
    Find the maximum twin sum in a linked list.

    Approach:
    1. Find the middle using fast/slow pointers
    2. Reverse the second half
    3. Pair nodes from first half and reversed second half
    4. Track maximum sum
    """
    # Step 1: Find the middle of the linked list
    # Slow moves 1 step, fast moves 2 steps
    # When fast reaches end, slow is at middle
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Reverse the second half starting from slow
    # We'll reverse the list from slow to end
    prev = None
    current = slow
    while current:
        # Store next node before breaking link
        next_node = current.next
        # Reverse the link
        current.next = prev
        # Move pointers forward
        prev = current
        current = next_node

    # Now 'prev' is the head of the reversed second half

    # Step 3: Calculate maximum twin sum
    # 'head' points to first half, 'prev' points to reversed second half
    first = head
    second = prev  # Head of reversed second half
    max_sum = 0

    while second:
        # Calculate sum of current twin pair
        current_sum = first.val + second.val
        # Update maximum if needed
        max_sum = max(max_sum, current_sum)

        # Move to next nodes in both halves
        first = first.next
        second = second.next

    return max_sum
```

```javascript
// Time: O(n) | Space: O(1)
function pairSum(head) {
  /**
   * Find the maximum twin sum in a linked list.
   *
   * Approach:
   * 1. Find the middle using fast/slow pointers
   * 2. Reverse the second half
   * 3. Pair nodes from first half and reversed second half
   * 4. Track maximum sum
   */

  // Step 1: Find the middle using fast/slow pointers
  let slow = head;
  let fast = head;

  // Fast moves twice as fast as slow
  // When fast reaches end, slow is at middle
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 2: Reverse the second half starting from slow
  let prev = null;
  let current = slow;

  while (current) {
    // Store next node before breaking link
    const nextNode = current.next;
    // Reverse the link
    current.next = prev;
    // Move pointers forward
    prev = current;
    current = nextNode;
  }

  // Now 'prev' is the head of the reversed second half

  // Step 3: Calculate maximum twin sum
  let first = head;
  let second = prev; // Head of reversed second half
  let maxSum = 0;

  while (second) {
    // Calculate sum of current twin pair
    const currentSum = first.val + second.val;
    // Update maximum if needed
    maxSum = Math.max(maxSum, currentSum);

    // Move to next nodes in both halves
    first = first.next;
    second = second.next;
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(1)
public int pairSum(ListNode head) {
    /**
     * Find the maximum twin sum in a linked list.
     *
     * Approach:
     * 1. Find the middle using fast/slow pointers
     * 2. Reverse the second half
     * 3. Pair nodes from first half and reversed second half
     * 4. Track maximum sum
     */

    // Step 1: Find the middle using fast/slow pointers
    ListNode slow = head;
    ListNode fast = head;

    // Fast moves twice as fast as slow
    // When fast reaches end, slow is at middle
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse the second half starting from slow
    ListNode prev = null;
    ListNode current = slow;

    while (current != null) {
        // Store next node before breaking link
        ListNode nextNode = current.next;
        // Reverse the link
        current.next = prev;
        // Move pointers forward
        prev = current;
        current = nextNode;
    }

    // Now 'prev' is the head of the reversed second half

    // Step 3: Calculate maximum twin sum
    ListNode first = head;
    ListNode second = prev;  // Head of reversed second half
    int maxSum = 0;

    while (second != null) {
        // Calculate sum of current twin pair
        int currentSum = first.val + second.val;
        // Update maximum if needed
        maxSum = Math.max(maxSum, currentSum);

        // Move to next nodes in both halves
        first = first.next;
        second = second.next;
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the middle: O(n/2) ≈ O(n)
- Reversing the second half: O(n/2) ≈ O(n)
- Calculating twin sums: O(n/2) ≈ O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant number of pointers (slow, fast, prev, current, etc.)
- No additional data structures that grow with input size
- The reversal is done in-place by modifying the existing links

## Common Mistakes

1. **Not handling the middle correctly with fast/slow pointers**
   - Mistake: Using `while (fast.next && fast.next.next)` which fails for lists with 2 nodes
   - Solution: Use `while (fast && fast.next)` to handle all cases properly

2. **Forgetting that n is always even**
   - Mistake: Adding special handling for odd-length lists
   - Solution: The problem guarantees n is even, so no need for odd-length checks

3. **Modifying the original list without permission**
   - Mistake: Not restoring the list after reversal (if required)
   - Solution: Check if the problem allows modifying the input. If not, use the array approach or reverse back after calculation

4. **Off-by-one errors when pairing nodes**
   - Mistake: Pairing wrong nodes after reversal
   - Solution: Remember that after reversal, the first node of the second half pairs with the last node of the first half

## When You'll See This Pattern

This problem combines three fundamental linked list patterns:

1. **Fast/Slow Pointers** - Used to find the middle of a linked list
   - Related: [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)
   - Why: Both use the same technique to find the middle efficiently

2. **Linked List Reversal** - Reversing part or all of a linked list
   - Related: [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
   - Why: The reversal technique is identical, just applied to half the list

3. **Two-Pointer Comparison** - Comparing nodes from different parts of a list
   - Related: [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)
   - Why: Both reverse the second half and compare with the first half

## Key Takeaways

1. **Fast/Slow Pointers + Reversal is a powerful combo** for problems involving symmetric operations on linked lists. When you need to compare or pair nodes from opposite ends, consider finding the middle and reversing one half.

2. **Linked list problems often have O(1) space solutions** by clever pointer manipulation. Always ask: "Can I solve this by rearranging links instead of using extra space?"

3. **Break complex operations into smaller, familiar patterns**. This problem seems tricky but becomes manageable when decomposed into: find middle → reverse half → pair nodes.

Related problems: [Reverse Linked List](/problem/reverse-linked-list), [Palindrome Linked List](/problem/palindrome-linked-list), [Middle of the Linked List](/problem/middle-of-the-linked-list)
