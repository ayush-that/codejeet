---
title: "How to Solve Add Two Numbers II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Add Two Numbers II. Medium difficulty, 62.4% acceptance rate. Topics: Linked List, Math, Stack."
date: "2027-03-25"
category: "dsa-patterns"
tags: ["add-two-numbers-ii", "linked-list", "math", "stack", "medium"]
---

# How to Solve Add Two Numbers II

This problem asks you to add two numbers represented as linked lists where the most significant digit comes first (unlike the classic "Add Two Numbers" problem where digits are reversed). The challenge is that we can't simply traverse both lists from the beginning while adding digits, because addition works from least significant digit to most significant digit. This reversal requirement is what makes this problem interesting and requires careful handling.

## Visual Walkthrough

Let's trace through an example: `l1 = [7,2,4,3]` (representing 7243) and `l2 = [5,6,4]` (representing 564).

**Step 1:** We need to add 7243 + 564 = 7807. But we can't just add digit by digit from left to right because carries propagate from right to left.

**Step 2:** The key insight is that we need to access digits from least significant to most significant. Since we can't traverse backward in a singly linked list, we can:

1. Reverse the lists (7243 → 3427, 564 → 465)
2. Add them like in the classic problem (3427 + 465 = 3892)
3. Reverse the result (3892 → 2983) ← Wait, that's wrong!

Actually, let me correct that: 7243 + 564 = 7807. If we reverse both: 3427 + 465 = 3892. Then reverse 3892 → 2983, which is incorrect. This shows why simply reversing both lists doesn't work directly.

**Step 3:** The correct approach is to use stacks. We'll push all digits from both lists onto stacks:

- Stack1: [7,2,4,3] → push → [3,4,2,7] (top is 3, least significant)
- Stack2: [5,6,4] → push → [4,6,5] (top is 4, least significant)

**Step 4:** Now we can pop from both stacks, add digits, and handle carries:

- Pop 3 and 4: sum = 7, carry = 0 → new digit = 7
- Pop 4 and 6: sum = 10, carry = 1 → new digit = 0
- Pop 2 and 5 (plus carry 1): sum = 8, carry = 0 → new digit = 8
- Pop 7 and nothing (plus carry 0): sum = 7, carry = 0 → new digit = 7

**Step 5:** We built the result from least to most significant: [7,0,8,7]. But we need to return it as a linked list with most significant digit first, so we need to reverse this: [7,8,0,7].

Wait, that's still not right! Let me recalculate: 7243 + 564 = 7807. Our digits [7,0,8,7] represent 7087, not 7807. The issue is the order we're building the result.

**Step 6:** Actually, when we pop from stacks, we get digits in reverse order (least significant first). We need to build the result linked list in reverse too. So:

- First pop gives 7 → node(7)
- Second gives 0 → node(0) → 7 (but 0 should be more significant than 7)
- We need to build the list backward: each new digit becomes the new head

**Step 7:** Correct building process:

- Pop 3 and 4: sum = 7 → new node(7), it's the tail (least significant)
- Pop 4 and 6: sum = 10, digit = 0, carry = 1 → new node(0), point it to current head (7)
- Pop 2 and 5 plus carry 1: sum = 8 → new node(8), point it to current head (0→7)
- Pop 7 and nothing: sum = 7 → new node(7), point it to current head (8→0→7)

Result: 7→8→0→7 which is 7807 ✓

## Brute Force Approach

A naive approach would be to:

1. Convert both linked lists to integers
2. Add the integers
3. Convert the sum back to a linked list

This works for small numbers but fails with very large numbers that exceed language integer limits (Python handles big integers, but Java/JavaScript don't). Even in Python, it's not the intended solution and shows poor problem-solving skills for a linked list problem.

The time complexity would be O(n+m) to convert lists to integers, and O(k) to convert the sum back to a list, where n, m are list lengths and k is digits in the sum. Space would be O(k) for the result.

The main issue is that this approach doesn't work within the constraints of the problem (handling arbitrarily large numbers without big integer support) and doesn't demonstrate proper linked list manipulation skills.

## Optimized Approach

The optimal approach uses stacks to reverse the digit access order without modifying the original lists. Here's the step-by-step reasoning:

1. **Why stacks?** Stacks give us LIFO (Last-In-First-Out) access, which effectively reverses the order of digits. We can push all digits onto stacks, then pop them to access digits from least to most significant.

2. **The addition process:**
   - While either stack has digits or there's a carry remaining
   - Pop digits from both stacks (use 0 if stack is empty)
   - Calculate sum = digit1 + digit2 + carry
   - New digit = sum % 10
   - New carry = sum // 10

3. **Building the result:**
   - We need to build the result linked list with most significant digit first
   - But we're generating digits from least to most significant
   - Solution: Each new digit becomes the new head of the result list
   - This automatically reverses the order for us

4. **Edge cases:**
   - One list is longer than the other
   - Final carry (e.g., 999 + 1 = 1000)
   - One or both lists are empty (problem says non-empty, but good to handle)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n, m are lengths of l1 and l2
# Space: O(n + m) for the stacks
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        # Step 1: Push all digits from both lists onto stacks
        # This allows us to access digits from least to most significant
        stack1, stack2 = [], []

        # Push all nodes from l1 to stack1
        while l1:
            stack1.append(l1.val)
            l1 = l1.next

        # Push all nodes from l2 to stack2
        while l2:
            stack2.append(l2.val)
            l2 = l2.next

        # Step 2: Initialize variables for addition
        carry = 0
        result_head = None  # Will point to the most significant digit of result

        # Step 3: Process digits while either stack has values or there's a carry
        while stack1 or stack2 or carry:
            # Get digits from stacks (0 if stack is empty)
            digit1 = stack1.pop() if stack1 else 0
            digit2 = stack2.pop() if stack2 else 0

            # Calculate sum and new carry
            total = digit1 + digit2 + carry
            digit = total % 10  # Current digit (0-9)
            carry = total // 10  # Carry for next iteration (0 or 1)

            # Step 4: Create new node with current digit
            # This digit is less significant than previous ones we've processed
            # So it needs to come AFTER previous nodes in the final list
            # But we're building backward, so it becomes the new head
            new_node = ListNode(digit)
            new_node.next = result_head  # Point to previous result
            result_head = new_node  # Update head to new node

        return result_head
```

```javascript
// Time: O(n + m) where n, m are lengths of l1 and l2
// Space: O(n + m) for the stacks
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

var addTwoNumbers = function (l1, l2) {
  // Step 1: Create stacks to reverse digit order
  const stack1 = [];
  const stack2 = [];

  // Push all nodes from l1 to stack1
  while (l1 !== null) {
    stack1.push(l1.val);
    l1 = l1.next;
  }

  // Push all nodes from l2 to stack2
  while (l2 !== null) {
    stack2.push(l2.val);
    l2 = l2.next;
  }

  // Step 2: Initialize variables
  let carry = 0;
  let resultHead = null; // Will point to most significant digit

  // Step 3: Process while stacks have digits or there's carry
  while (stack1.length > 0 || stack2.length > 0 || carry > 0) {
    // Get digits from stacks (0 if empty)
    const digit1 = stack1.length > 0 ? stack1.pop() : 0;
    const digit2 = stack2.length > 0 ? stack2.pop() : 0;

    // Calculate sum and new carry
    const total = digit1 + digit2 + carry;
    const digit = total % 10; // Current digit
    carry = Math.floor(total / 10); // Carry for next iteration

    // Step 4: Create new node and add to front of result
    // Since we're processing from least to most significant,
    // each new node becomes the new head
    const newNode = new ListNode(digit);
    newNode.next = resultHead; // Link to previous nodes
    resultHead = newNode; // Update head
  }

  return resultHead;
};
```

```java
// Time: O(n + m) where n, m are lengths of l1 and l2
// Space: O(n + m) for the stacks
public class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Step 1: Create stacks to reverse the digit order
        Stack<Integer> stack1 = new Stack<>();
        Stack<Integer> stack2 = new Stack<>();

        // Push all digits from l1 to stack1
        while (l1 != null) {
            stack1.push(l1.val);
            l1 = l1.next;
        }

        // Push all digits from l2 to stack2
        while (l2 != null) {
            stack2.push(l2.val);
            l2 = l2.next;
        }

        // Step 2: Initialize variables
        int carry = 0;
        ListNode resultHead = null;  // Will point to most significant digit

        // Step 3: Process digits while stacks have values or there's carry
        while (!stack1.isEmpty() || !stack2.isEmpty() || carry != 0) {
            // Get digits from stacks (0 if empty)
            int digit1 = stack1.isEmpty() ? 0 : stack1.pop();
            int digit2 = stack2.isEmpty() ? 0 : stack2.pop();

            // Calculate sum and new carry
            int total = digit1 + digit2 + carry;
            int digit = total % 10;  // Current digit (0-9)
            carry = total / 10;  // Carry for next iteration (0 or 1)

            // Step 4: Create new node and add to front of result
            // We're building the list backward since we process
            // from least to most significant digit
            ListNode newNode = new ListNode(digit);
            newNode.next = resultHead;  // Link to previous nodes
            resultHead = newNode;  // Update head to new node
        }

        return resultHead;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m) where n and m are the lengths of the two input lists. We traverse each list once to push values onto stacks (O(n + m)), then process each digit once during the addition (O(max(n, m))). The total is O(n + m).

**Space Complexity:** O(n + m) for the two stacks that store all digits from both lists. We also use O(max(n, m)) space for the result list, but this is output space that doesn't count toward auxiliary space complexity in most interview settings. The dominant space usage is the stacks.

## Common Mistakes

1. **Adding from most significant digit first:** The most common mistake is trying to add digits from left to right. Remember that addition propagates carries from right to left, so you must start with the least significant digits.

2. **Forgetting the final carry:** When adding numbers like 999 + 1, you get 1000. The final carry (1) creates an extra digit. Many candidates forget to check `carry > 0` after processing all digits.

3. **Incorrect result list construction:** When building the result, if you append new nodes to the end, you'll get the digits in reverse order (least significant first). You need to either build it backward (new node becomes new head) or reverse the result at the end.

4. **Not handling different list lengths:** When one list is longer than the other, you need to continue processing until both stacks are empty. Using `while stack1 or stack2 or carry` ensures we handle all cases.

## When You'll See This Pattern

The stack-based reversal pattern appears in several linked list problems:

1. **Palindrome Linked List (LeetCode 234):** Use a stack to compare the first half of the list with the second half in reverse order.

2. **Next Greater Node In Linked List (LeetCode 1019):** Use a stack to maintain decreasing sequence of values while traversing the list.

3. **Add Two Numbers (LeetCode 2):** The easier version where digits are already reversed, so no stack is needed. Understanding both versions helps reinforce the digit addition pattern.

The key insight is that stacks help when you need to process elements in reverse order but only have forward traversal available.

## Key Takeaways

1. **When dealing with digit addition, always start from the least significant digit** because carries propagate right to left. If digits are stored most-significant-first, you need to reverse them first (using stacks or actual list reversal).

2. **Stacks are perfect for reversing access order** when you can't modify the original data structure or want to avoid actual reversal. They give you LIFO access without changing the original lists.

3. **Building a linked list in reverse** is a useful technique: create new nodes and make them the new head. This is more efficient than building forward then reversing.

Related problems: [Add Two Numbers](/problem/add-two-numbers), [Add Two Polynomials Represented as Linked Lists](/problem/add-two-polynomials-represented-as-linked-lists)
