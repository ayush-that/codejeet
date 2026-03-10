---
title: "How to Solve Add Two Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Add Two Numbers. Medium difficulty, 48.0% acceptance rate. Topics: Linked List, Math, Recursion."
date: "2026-02-07"
category: "dsa-patterns"
tags: ["add-two-numbers", "linked-list", "math", "recursion", "medium"]
---

# How to Solve Add Two Numbers

You're given two linked lists where each node contains a single digit of a number, but the digits are stored in reverse order. Your task is to add these two numbers together and return the result as a linked list, also in reverse order. What makes this problem interesting is that it combines linked list traversal with arithmetic operations while handling carries between digits—a perfect test of your ability to work with multiple concepts simultaneously.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**  
List 1: 2 → 4 → 3 (represents the number 342)  
List 2: 5 → 6 → 4 (represents the number 465)

**Expected Output:** 7 → 0 → 8 (represents 342 + 465 = 807)

**Step-by-step addition:**

1. **First digit (ones place):** 2 + 5 = 7, no carry → output: 7
2. **Second digit (tens place):** 4 + 6 = 10 → output digit: 0, carry: 1
3. **Third digit (hundreds place):** 3 + 4 + carry(1) = 8 → output: 8
4. **Check for leftover carry:** None

The tricky part is that we need to handle:

- Different length lists (e.g., 999 + 1 = 1000 requires creating a new node)
- Carries that propagate through multiple digits
- The fact that we're working with linked lists, not arrays

## Brute Force Approach

A naive approach might try to:

1. Convert each linked list to its actual integer value
2. Add the two integers
3. Convert the sum back to a reversed linked list

While this seems straightforward, it has serious limitations:

- Large numbers can exceed integer limits (Python handles big integers, but Java/JavaScript don't)
- It requires multiple passes through the lists
- The conversion steps add unnecessary complexity

More importantly, this approach misses the point of the problem—it's designed to test your ability to work directly with the linked list structure while performing digit-by-digit arithmetic.

## Optimized Approach

The key insight is that we can perform the addition **digit by digit** while traversing both lists simultaneously, just like how you'd add numbers on paper from right to left. Since the digits are already in reverse order (least significant digit first), we can traverse from head to tail and add corresponding digits.

**Step-by-step reasoning:**

1. Initialize a dummy head node to simplify edge cases when building the result list
2. Use a pointer to track the current position in the result list
3. Initialize a carry variable to 0
4. While either list has nodes OR there's a carry:
   - Get the current digit from list1 (0 if list1 is exhausted)
   - Get the current digit from list2 (0 if list2 is exhausted)
   - Calculate sum = digit1 + digit2 + carry
   - Determine new digit = sum % 10
   - Update carry = sum // 10
   - Create a new node with the new digit
   - Advance all pointers
5. Return the list starting from dummy.next

This approach handles:

- Lists of different lengths
- Final carry that creates an extra digit
- All edge cases in a clean, single-pass solution

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(max(m, n)) where m and n are lengths of the lists
# Space: O(max(m, n)) for the result list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        # Create a dummy head to simplify list construction
        # This avoids special cases for the first node
        dummy_head = ListNode(0)
        current = dummy_head
        carry = 0

        # Continue while there are nodes in either list OR we have a carry
        while l1 is not None or l2 is not None or carry != 0:
            # Get the current digit from each list (0 if list is exhausted)
            digit1 = l1.val if l1 is not None else 0
            digit2 = l2.val if l2 is not None else 0

            # Calculate sum of digits plus any carry from previous position
            total = digit1 + digit2 + carry

            # The digit for this position is the remainder when divided by 10
            digit = total % 10

            # Update carry for the next position (integer division by 10)
            carry = total // 10

            # Create a new node with the calculated digit
            new_node = ListNode(digit)

            # Link the new node to the result list
            current.next = new_node
            current = current.next  # Move to the new node

            # Advance list pointers if they're not exhausted
            if l1 is not None:
                l1 = l1.next
            if l2 is not None:
                l2 = l2.next

        # Return the list starting from the node after dummy head
        return dummy_head.next
```

```javascript
// Time: O(max(m, n)) where m and n are lengths of the lists
// Space: O(max(m, n)) for the result list
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

var addTwoNumbers = function (l1, l2) {
  // Create a dummy head to simplify list construction
  // This avoids special cases for the first node
  let dummyHead = new ListNode(0);
  let current = dummyHead;
  let carry = 0;

  // Continue while there are nodes in either list OR we have a carry
  while (l1 !== null || l2 !== null || carry !== 0) {
    // Get the current digit from each list (0 if list is exhausted)
    let digit1 = l1 !== null ? l1.val : 0;
    let digit2 = l2 !== null ? l2.val : 0;

    // Calculate sum of digits plus any carry from previous position
    let total = digit1 + digit2 + carry;

    // The digit for this position is the remainder when divided by 10
    let digit = total % 10;

    // Update carry for the next position (integer division by 10)
    carry = Math.floor(total / 10);

    // Create a new node with the calculated digit
    let newNode = new ListNode(digit);

    // Link the new node to the result list
    current.next = newNode;
    current = current.next; // Move to the new node

    // Advance list pointers if they're not exhausted
    if (l1 !== null) {
      l1 = l1.next;
    }
    if (l2 !== null) {
      l2 = l2.next;
    }
  }

  // Return the list starting from the node after dummy head
  return dummyHead.next;
};
```

```java
// Time: O(max(m, n)) where m and n are lengths of the lists
// Space: O(max(m, n)) for the result list
public class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Create a dummy head to simplify list construction
        // This avoids special cases for the first node
        ListNode dummyHead = new ListNode(0);
        ListNode current = dummyHead;
        int carry = 0;

        // Continue while there are nodes in either list OR we have a carry
        while (l1 != null || l2 != null || carry != 0) {
            // Get the current digit from each list (0 if list is exhausted)
            int digit1 = (l1 != null) ? l1.val : 0;
            int digit2 = (l2 != null) ? l2.val : 0;

            // Calculate sum of digits plus any carry from previous position
            int total = digit1 + digit2 + carry;

            // The digit for this position is the remainder when divided by 10
            int digit = total % 10;

            // Update carry for the next position (integer division by 10)
            carry = total / 10;

            // Create a new node with the calculated digit
            ListNode newNode = new ListNode(digit);

            // Link the new node to the result list
            current.next = newNode;
            current = current.next;  // Move to the new node

            // Advance list pointers if they're not exhausted
            if (l1 != null) {
                l1 = l1.next;
            }
            if (l2 != null) {
                l2 = l2.next;
            }
        }

        // Return the list starting from the node after dummy head
        return dummyHead.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(max(m, n))  
We traverse both lists simultaneously, and the loop continues until we've processed all nodes in the longer list plus possibly one extra iteration for a final carry. Each iteration does constant work.

**Space Complexity:** O(max(m, n))  
We create a new linked list to store the result. In the worst case (e.g., 999 + 1 = 1000), we need one extra node, so the length is max(m, n) + 1, which is O(max(m, n)).

## Common Mistakes

1. **Forgetting the final carry:** When adding numbers like 999 and 1, you get 1000 which requires creating an extra node. The loop condition must include `carry != 0` to handle this case.

2. **Not handling different length lists properly:** When one list is shorter, you need to continue processing the longer list. Always check if a list pointer is null before accessing its value.

3. **Incorrect carry calculation:** Remember that carry is `sum // 10` (integer division), not `sum / 10`. In Java/JavaScript, you need to use integer division explicitly.

4. **Building the result list incorrectly:** Without a dummy head, you need special logic to handle the first node. The dummy head pattern simplifies this significantly.

## When You'll See This Pattern

This "digit-by-digit addition with carry" pattern appears in several related problems:

1. **Add Binary (LeetCode 67):** Same concept but with binary digits (base 2 instead of base 10). Instead of `% 10` and `// 10`, you use `% 2` and `// 2`.

2. **Multiply Strings (LeetCode 43):** A more complex version where you multiply digit by digit, managing carries at each step. The core idea of processing digits from least to most significant remains.

3. **Plus One (LeetCode 66):** A simpler version where you add 1 to a number represented as an array, handling carries from right to left.

These problems all involve processing sequences of digits while managing carries between positions—a fundamental skill for working with numerical representations.

## Key Takeaways

1. **Dummy head pattern:** When building linked lists, a dummy head node eliminates edge cases for the first node, making your code cleaner and less error-prone.

2. **Process sequences in tandem:** When working with two sequences of potentially different lengths, the pattern `while (p1 != null || p2 != null)` with null checks inside the loop handles all cases elegantly.

3. **Carry propagation:** In digit-based arithmetic problems, always consider whether a carry might create an extra digit at the end. Include the carry in your loop condition to handle this.

**Related problems:** [Multiply Strings](/problem/multiply-strings), [Add Binary](/problem/add-binary), [Sum of Two Integers](/problem/sum-of-two-integers)
