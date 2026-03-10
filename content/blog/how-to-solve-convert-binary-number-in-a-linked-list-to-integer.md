---
title: "How to Solve Convert Binary Number in a Linked List to Integer — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Convert Binary Number in a Linked List to Integer. Easy difficulty, 82.3% acceptance rate. Topics: Linked List, Math."
date: "2027-01-12"
category: "dsa-patterns"
tags: ["convert-binary-number-in-a-linked-list-to-integer", "linked-list", "math", "easy"]
---

# How to Solve Convert Binary Number in a Linked List to Integer

This problem asks us to convert a binary number represented as a singly-linked list (where each node contains a single bit, 0 or 1) into its decimal integer value. The head of the list represents the most significant bit. While this is labeled as "Easy," it's interesting because it combines linked list traversal with binary-to-decimal conversion, testing your understanding of both data structures and number systems.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose our linked list is: `1 → 0 → 1 → 1`

**Step 1:** Start with `result = 0`

- The first node contains `1` (most significant bit)
- `result = (0 << 1) + 1 = 1`  
  (Shift left by 1 means multiply by 2, then add the current bit)

**Step 2:** Move to the second node containing `0`

- `result = (1 << 1) + 0 = 2 + 0 = 2`

**Step 3:** Move to the third node containing `1`

- `result = (2 << 1) + 1 = 4 + 1 = 5`

**Step 4:** Move to the fourth node containing `1`

- `result = (5 << 1) + 1 = 10 + 1 = 11`

The binary number `1011₂` equals `11₁₀`, which matches our calculation. Notice the pattern: for each bit we encounter, we multiply the current result by 2 (equivalent to shifting bits left by 1) and add the new bit value.

## Brute Force Approach

A naive approach might be:

1. Traverse the linked list to collect all bits into an array or string
2. Convert that binary string to decimal using built-in functions or manual calculation

While this works, it requires O(n) extra space to store the bits, and using built-in conversion functions might not demonstrate your understanding of the underlying algorithm. More importantly, the problem is designed to be solved in a single pass with O(1) extra space.

Here's what the brute force might look like:

```python
def getDecimalValue(head):
    bits = []
    current = head
    while current:
        bits.append(str(current.val))
        current = current.next

    binary_str = ''.join(bits)
    return int(binary_str, 2)  # Built-in conversion
```

This approach is inefficient in terms of space (O(n)) and doesn't demonstrate the optimal bit manipulation technique that interviewers want to see.

## Optimal Solution

The optimal solution uses a single pass through the linked list while applying the "left shift and add" method. For each node, we take the current decimal value, multiply it by 2 (which shifts all bits left by 1 position), and add the current bit value.

Mathematically: `decimal = decimal × 2 + bit`

This works because in binary, shifting left by 1 is equivalent to multiplying by 2, just like in decimal, shifting left by 1 is equivalent to multiplying by 10.

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the linked list
# Space: O(1) as we only use a constant amount of extra space
def getDecimalValue(head):
    # Initialize result to 0
    result = 0

    # Traverse through the linked list
    current = head
    while current:
        # Left shift result by 1 (multiply by 2) and add current bit
        # This builds the binary number from most significant to least significant bit
        result = (result << 1) | current.val

        # Alternative: result = result * 2 + current.val
        # Both work, but bit shifting is more explicit about the binary nature

        # Move to the next node
        current = current.next

    return result
```

```javascript
// Time: O(n) where n is the number of nodes in the linked list
// Space: O(1) as we only use a constant amount of extra space
function getDecimalValue(head) {
  // Initialize result to 0
  let result = 0;

  // Traverse through the linked list
  let current = head;
  while (current !== null) {
    // Left shift result by 1 (multiply by 2) and add current bit
    // Using bitwise OR to add the bit is cleaner than addition here
    result = (result << 1) | current.val;

    // Alternative: result = result * 2 + current.val
    // Both work, but bit shifting is more explicit about the binary nature

    // Move to the next node
    current = current.next;
  }

  return result;
}
```

```java
// Time: O(n) where n is the number of nodes in the linked list
// Space: O(1) as we only use a constant amount of extra space
public int getDecimalValue(ListNode head) {
    // Initialize result to 0
    int result = 0;

    // Traverse through the linked list
    ListNode current = head;
    while (current != null) {
        // Left shift result by 1 (multiply by 2) and add current bit
        // Using bitwise OR to add the bit is cleaner than addition here
        result = (result << 1) | current.val;

        // Alternative: result = result * 2 + current.val
        // Both work, but bit shifting is more explicit about the binary nature

        // Move to the next node
        current = current.next;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We traverse the linked list exactly once, visiting each node once
- At each node, we perform constant-time operations (bit shifting and addition)
- Therefore, total time is proportional to the number of nodes, O(n)

**Space Complexity:** O(1)

- We only use a fixed number of variables (`result`, `current`)
- No additional data structures that grow with input size
- The space used is constant regardless of the linked list length

## Common Mistakes

1. **Forgetting to handle empty list:** While the problem constraints say the list has at least one node, in interviews you should always check for edge cases. A robust solution would handle `if not head: return 0`.

2. **Using string conversion instead of bit manipulation:** Some candidates convert the bits to a string and then use `int(binary_str, 2)`. This works but uses O(n) extra space and doesn't demonstrate understanding of binary arithmetic.

3. **Wrong bit order:** Remember the head is the most significant bit. If you mistakenly treat it as the least significant bit, you'll get the wrong answer. For example, `1 → 0 → 1` should be 5 (binary 101), not 6 (binary 110 if reversed).

4. **Integer overflow in languages with fixed-width integers:** In Java, if the linked list has more than 31 bits (since we use signed integers), the result could overflow. However, the problem constraints keep the list length manageable. For extremely long lists, you'd need to use `long` or `BigInteger`.

## When You'll See This Pattern

This "accumulate with shifting" pattern appears in several problems:

1. **Reverse Linked List (LeetCode 206):** While not exactly the same, both involve traversing a linked list and building a result through iterative updates.

2. **Add Two Numbers (LeetCode 2):** You traverse two linked lists representing numbers (in reverse order) and build the sum digit by digit, similar to how we build the binary number bit by bit.

3. **Sum of Two Integers (LeetCode 371):** This problem uses bit manipulation techniques similar to what we use here (shifting and bitwise operations) to add numbers without arithmetic operators.

4. **Binary to Decimal conversion problems:** Any problem involving conversion between number bases often uses this "multiply by base and add digit" approach.

## Key Takeaways

1. **Binary to decimal conversion can be done in a single pass:** You don't need to store all bits first. The formula `decimal = decimal × 2 + current_bit` builds the number from most significant to least significant bit.

2. **Bit shifting is multiplication/division by powers of 2:** `x << 1` is equivalent to `x × 2`, and `x >> 1` is equivalent to `x ÷ 2` (integer division). This is more efficient and clearer for binary operations.

3. **Linked list traversal patterns:** This problem reinforces the standard linked list traversal pattern: initialize a pointer to head, use a while loop until null, process current node, move to next node.

[Practice this problem on CodeJeet](/problem/convert-binary-number-in-a-linked-list-to-integer)
