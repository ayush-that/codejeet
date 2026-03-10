---
title: "How to Solve Double a Number Represented as a Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Double a Number Represented as a Linked List. Medium difficulty, 61.3% acceptance rate. Topics: Linked List, Math, Stack."
date: "2028-10-10"
category: "dsa-patterns"
tags: ["double-a-number-represented-as-a-linked-list", "linked-list", "math", "stack", "medium"]
---

# How to Solve Double a Number Represented as a Linked List

You're given a linked list where each node contains a single digit, and the entire list represents a non-negative integer without leading zeros. Your task is to return the head of a new linked list representing twice the original number. The challenge is that you need to handle carries that can propagate backward through the list, but you can only traverse forward in a singly linked list.

## Visual Walkthrough

Let's trace through an example: `1 → 8 → 9` (which represents 189).

**Step 1:** We need to double each digit from right to left, but we can only traverse left to right. Doubling 189 gives 378, but let's see how carries work:

- Double 9 = 18 → write 8, carry 1
- Double 8 = 16, plus carry 1 = 17 → write 7, carry 1
- Double 1 = 2, plus carry 1 = 3 → write 3

The result should be `3 → 7 → 8` (378).

The problem is clear when we work right-to-left, but we need a way to process digits in reverse order while only having forward links. This is what makes the problem interesting—we need to reverse our access pattern somehow.

## Brute Force Approach

A naive approach would be to:

1. Convert the linked list to an integer
2. Double the integer
3. Convert back to a linked list

<div class="code-group">

```python
# Time: O(n) | Space: O(1) but risks integer overflow
def doubleIt_brute(head):
    # Step 1: Convert linked list to integer
    num = 0
    current = head
    while current:
        num = num * 10 + current.val
        current = current.next

    # Step 2: Double the number
    num *= 2

    # Step 3: Convert back to linked list
    # Handle case where result is 0
    if num == 0:
        return ListNode(0)

    # Build digits in reverse order
    dummy = ListNode(0)
    while num > 0:
        digit = num % 10
        new_node = ListNode(digit)
        new_node.next = dummy.next
        dummy.next = new_node
        num //= 10

    return dummy.next
```

```javascript
// Time: O(n) | Space: O(1) but risks integer overflow
function doubleItBrute(head) {
  // Step 1: Convert linked list to integer
  let num = 0;
  let current = head;
  while (current) {
    num = num * 10 + current.val;
    current = current.next;
  }

  // Step 2: Double the number
  num *= 2;

  // Step 3: Convert back to linked list
  // Handle case where result is 0
  if (num === 0) return new ListNode(0);

  // Build digits in reverse order
  const dummy = new ListNode(0);
  while (num > 0) {
    const digit = num % 10;
    const newNode = new ListNode(digit);
    newNode.next = dummy.next;
    dummy.next = newNode;
    num = Math.floor(num / 10);
  }

  return dummy.next;
}
```

```java
// Time: O(n) | Space: O(1) but risks integer overflow
public ListNode doubleItBrute(ListNode head) {
    // Step 1: Convert linked list to integer
    long num = 0; // Use long to handle larger numbers
    ListNode current = head;
    while (current != null) {
        num = num * 10 + current.val;
        current = current.next;
    }

    // Step 2: Double the number
    num *= 2;

    // Step 3: Convert back to linked list
    // Handle case where result is 0
    if (num == 0) return new ListNode(0);

    // Build digits in reverse order
    ListNode dummy = new ListNode(0);
    while (num > 0) {
        int digit = (int)(num % 10);
        ListNode newNode = new ListNode(digit);
        newNode.next = dummy.next;
        dummy.next = newNode;
        num /= 10;
    }

    return dummy.next;
}
```

</div>

**Why this fails:** This approach has two critical issues:

1. **Integer overflow:** The linked list can have up to 10⁵ digits, which is far beyond what any integer type can hold
2. **Violates problem constraints:** Even with big integers, the problem is designed to test linked list manipulation skills, not type conversion

## Optimized Approach

The key insight is that we need to process digits from least significant (rightmost) to most significant (leftmost) to handle carries properly. Since we have a singly linked list, we have three main options:

1. **Reverse the list:** Process from right to left, then reverse back
2. **Use recursion:** Let the call stack handle the reverse traversal
3. **Use a stack:** Push all nodes onto a stack for reverse processing

The recursion approach is elegant but risks stack overflow for very long lists. The stack approach is more explicit and handles all cases safely. Here's the optimal strategy:

**Stack-based approach:**

1. Push all nodes onto a stack (giving us LIFO access - last in, first out)
2. Process nodes from stack (rightmost to leftmost)
3. For each digit: double it, add any carry from previous digit, store units digit, calculate new carry
4. If there's a final carry, create a new most significant digit
5. Build the result list in reverse (since we're processing from least to most significant)

**Why this works:** The stack gives us O(1) access to the reverse order without modifying the original list structure. We process exactly like manual multiplication from right to left.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the stack
def doubleIt(head):
    """
    Double the number represented by a linked list.
    Uses a stack to process digits from least to most significant.
    """
    stack = []
    current = head

    # Step 1: Push all nodes onto stack
    # This allows us to process from rightmost to leftmost digit
    while current:
        stack.append(current)
        current = current.next

    carry = 0
    # Step 2: Process digits from least to most significant (right to left)
    while stack:
        node = stack.pop()  # Get next digit from right side
        doubled = node.val * 2 + carry  # Double current digit plus any carry
        node.val = doubled % 10  # Store units digit
        carry = doubled // 10  # Calculate carry for next digit

    # Step 3: Handle final carry if it exists
    # If carry > 0, we need a new most significant digit
    if carry > 0:
        new_head = ListNode(carry)
        new_head.next = head
        return new_head

    return head
```

```javascript
// Time: O(n) | Space: O(n) for the stack
function doubleIt(head) {
  /**
   * Double the number represented by a linked list.
   * Uses a stack to process digits from least to most significant.
   */
  const stack = [];
  let current = head;

  // Step 1: Push all nodes onto stack
  // This allows us to process from rightmost to leftmost digit
  while (current) {
    stack.push(current);
    current = current.next;
  }

  let carry = 0;
  // Step 2: Process digits from least to most significant (right to left)
  while (stack.length > 0) {
    const node = stack.pop(); // Get next digit from right side
    const doubled = node.val * 2 + carry; // Double current digit plus any carry
    node.val = doubled % 10; // Store units digit
    carry = Math.floor(doubled / 10); // Calculate carry for next digit
  }

  // Step 3: Handle final carry if it exists
  // If carry > 0, we need a new most significant digit
  if (carry > 0) {
    const newHead = new ListNode(carry);
    newHead.next = head;
    return newHead;
  }

  return head;
}
```

```java
// Time: O(n) | Space: O(n) for the stack
public ListNode doubleIt(ListNode head) {
    /**
     * Double the number represented by a linked list.
     * Uses a stack to process digits from least to most significant.
     */
    Stack<ListNode> stack = new Stack<>();
    ListNode current = head;

    // Step 1: Push all nodes onto stack
    // This allows us to process from rightmost to leftmost digit
    while (current != null) {
        stack.push(current);
        current = current.next;
    }

    int carry = 0;
    // Step 2: Process digits from least to most significant (right to left)
    while (!stack.isEmpty()) {
        ListNode node = stack.pop();  // Get next digit from right side
        int doubled = node.val * 2 + carry;  // Double current digit plus any carry
        node.val = doubled % 10;  // Store units digit
        carry = doubled / 10;  // Calculate carry for next digit
    }

    // Step 3: Handle final carry if it exists
    // If carry > 0, we need a new most significant digit
    if (carry > 0) {
        ListNode newHead = new ListNode(carry);
        newHead.next = head;
        return newHead;
    }

    return head;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We traverse the list once to build the stack: O(n)
- We process each node once from the stack: O(n)
- Total: O(2n) = O(n)

**Space Complexity:** O(n)

- The stack stores all n nodes: O(n)
- We modify the list in place, so no additional space for the result
- The recursion call stack would also be O(n), but our explicit stack approach is more controlled

## Common Mistakes

1. **Forgetting the final carry:** When the most significant digit produces a carry (e.g., 5 → 10), you need to create a new head node. Test with 5, 50, 99, 999.

2. **Modifying digits before processing carries:** If you process left-to-right, you might update a digit before considering if it will receive a carry from the right. Always process right-to-left for arithmetic operations.

3. **Not handling the zero case properly:** If the result is 0 (input was 0), you should return a single node with value 0. Our solution handles this since doubling 0 gives 0 with no carry.

4. **Using integer conversion:** As explained, this fails for large numbers and misses the point of the problem. Interviewers want to see linked list manipulation skills.

## When You'll See This Pattern

This "reverse processing with stack" pattern appears whenever you need to process a singly linked list from end to beginning:

1. **Add Two Numbers II** (LeetCode 445): Add two numbers where digits are stored in normal order (most significant first). You need stacks to align digits properly.

2. **Plus One Linked List** (LeetCode 369): Add one to a number represented as a linked list. Similar carry propagation from right to left.

3. **Palindrome Linked List** (LeetCode 234): While not exactly the same, it often uses a stack or reverse technique to compare first and second halves.

The core idea is: when you need backward traversal of a forward-only data structure, use a stack (explicit or call stack) to reverse the access order.

## Key Takeaways

1. **Stacks reverse access order:** When you need to process linked list nodes from tail to head, a stack gives you LIFO access perfect for this pattern.

2. **Arithmetic goes right-to-left:** For addition, multiplication, and other place-value operations, always process from least significant digit to most significant to handle carries correctly.

3. **In-place modification is possible:** You can modify node values directly if the problem allows it, saving space compared to creating a completely new list.

Related problems: [Add Two Numbers](/problem/add-two-numbers), [Plus One Linked List](/problem/plus-one-linked-list)
