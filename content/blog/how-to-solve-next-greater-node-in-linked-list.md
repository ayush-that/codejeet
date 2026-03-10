---
title: "How to Solve Next Greater Node In Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Next Greater Node In Linked List. Medium difficulty, 63.9% acceptance rate. Topics: Array, Linked List, Stack, Monotonic Stack."
date: "2028-08-01"
category: "dsa-patterns"
tags: ["next-greater-node-in-linked-list", "array", "linked-list", "stack", "medium"]
---

# How to Solve Next Greater Node In Linked List

You're given a singly linked list, and for each node you need to find the next node in the list that has a strictly larger value. If no such node exists, you should store 0 for that position. The challenge here is that linked lists don't support random access, so you can't easily look ahead to find the next greater element without scanning forward repeatedly.

What makes this problem interesting is that it's essentially the "Next Greater Element" problem (LeetCode #496 and #503), but applied to a linked list instead of an array. This adds a layer of complexity since you need to handle the linear traversal of a linked list while maintaining a stack to track elements.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the linked list: `2 → 7 → 4 → 3 → 5`

We need to find for each node, the next node with a strictly larger value:

- Node 2: Next greater is 7 (immediately next)
- Node 7: No next greater (4, 3, 5 are all smaller) → 0
- Node 4: Next greater is 5 (skip over 3)
- Node 3: Next greater is 5 (immediately next)
- Node 5: No next greater (last node) → 0

So the answer should be: `[7, 0, 5, 5, 0]`

The key insight is that we need to process nodes in a way that allows us to "look into the future" without repeatedly scanning. If we process from left to right, we don't know what comes next. But if we could process from right to left, we'd always know what's ahead. However, with a singly linked list, we can't traverse backward.

This is where the monotonic stack technique comes in. We'll process nodes from left to right but use a stack to remember nodes whose next greater element we haven't found yet.

## Brute Force Approach

The most straightforward approach is to use nested loops:

1. For each node in the linked list
2. Starting from that node, traverse forward until you find a node with a larger value
3. If found, record that value; otherwise record 0

This approach is simple to understand but inefficient. For a linked list of length `n`, in the worst case (when the list is in descending order), for the first node we check `n-1` nodes, for the second we check `n-2` nodes, and so on. This gives us O(n²) time complexity.

Here's what the brute force code would look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output
def nextLargerNodes_brute(head):
    result = []
    current = head

    while current:
        # Start looking for next greater from the next node
        runner = current.next
        next_greater = 0

        while runner:
            if runner.val > current.val:
                next_greater = runner.val
                break
            runner = runner.next

        result.append(next_greater)
        current = current.next

    return result
```

```javascript
// Time: O(n²) | Space: O(1) excluding output
function nextLargerNodesBrute(head) {
  const result = [];
  let current = head;

  while (current) {
    // Start looking for next greater from the next node
    let runner = current.next;
    let nextGreater = 0;

    while (runner) {
      if (runner.val > current.val) {
        nextGreater = runner.val;
        break;
      }
      runner = runner.next;
    }

    result.push(nextGreater);
    current = current.next;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output
public int[] nextLargerNodesBrute(ListNode head) {
    List<Integer> result = new ArrayList<>();
    ListNode current = head;

    while (current != null) {
        // Start looking for next greater from the next node
        ListNode runner = current.next;
        int nextGreater = 0;

        while (runner != null) {
            if (runner.val > current.val) {
                nextGreater = runner.val;
                break;
            }
            runner = runner.next;
        }

        result.add(nextGreater);
        current = current.next;
    }

    // Convert List to array
    int[] answer = new int[result.size()];
    for (int i = 0; i < result.size(); i++) {
        answer[i] = result.get(i);
    }
    return answer;
}
```

</div>

The brute force approach is too slow for large inputs (n up to 10,000 in typical test cases). We need a more efficient solution.

## Optimized Approach

The key insight is to use a **monotonic decreasing stack**. Here's the step-by-step reasoning:

1. **Convert the linked list to an array**: Since we need random access to update values when we find next greater elements, it's easier to work with an array. We'll store node values in an array as we traverse the list.

2. **Use a stack to track indices**: We'll maintain a stack that stores indices of elements for which we haven't found the next greater element yet. The stack will be monotonic decreasing - meaning the values at these indices decrease from bottom to top.

3. **Process elements from left to right**: For each new element:
   - While the stack is not empty AND the current element is greater than the element at the index on top of the stack:
     - We've found the next greater element for the element at that index!
     - Update the result for that index to be the current element's value
     - Pop from the stack
   - Push the current index onto the stack (we'll look for its next greater later)

4. **Initialize result array with zeros**: This handles the case where no next greater element exists.

Why does this work? The stack maintains a decreasing sequence of values. When we encounter a value that's larger than the top of the stack, it becomes the "next greater element" for all values in the stack that are smaller than it. We process them in reverse order of when we saw them (LIFO), which is exactly what we need.

## Optimal Solution

Here's the complete implementation using the monotonic stack approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def nextLargerNodes(head):
    """
    Find the next greater node for each node in the linked list.

    Args:
        head: Head node of the singly linked list

    Returns:
        List of integers where each element is the next greater
        node value or 0 if none exists
    """
    # Step 1: Convert linked list to array for easier indexing
    values = []
    current = head
    while current:
        values.append(current.val)
        current = current.next

    # Step 2: Initialize result array with zeros (default when no greater element)
    result = [0] * len(values)

    # Step 3: Use a stack to store indices of elements waiting for their next greater
    stack = []  # Will store indices, not values

    # Step 4: Process each element
    for i, value in enumerate(values):
        # While stack has elements and current value > value at top of stack
        while stack and values[stack[-1]] < value:
            # Current value is the next greater for the element at stack top
            prev_index = stack.pop()
            result[prev_index] = value

        # Push current index to stack - we'll look for its next greater later
        stack.append(i)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function nextLargerNodes(head) {
  /**
   * Find the next greater node for each node in the linked list.
   *
   * @param {ListNode} head - Head node of the singly linked list
   * @return {number[]} Array where each element is the next greater
   *                    node value or 0 if none exists
   */
  // Step 1: Convert linked list to array for easier indexing
  const values = [];
  let current = head;
  while (current) {
    values.push(current.val);
    current = current.next;
  }

  // Step 2: Initialize result array with zeros (default when no greater element)
  const result = new Array(values.length).fill(0);

  // Step 3: Use a stack to store indices of elements waiting for their next greater
  const stack = []; // Will store indices, not values

  // Step 4: Process each element
  for (let i = 0; i < values.length; i++) {
    const currentValue = values[i];

    // While stack has elements and current value > value at top of stack
    while (stack.length > 0 && values[stack[stack.length - 1]] < currentValue) {
      // Current value is the next greater for the element at stack top
      const prevIndex = stack.pop();
      result[prevIndex] = currentValue;
    }

    // Push current index to stack - we'll look for its next greater later
    stack.push(i);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] nextLargerNodes(ListNode head) {
    /**
     * Find the next greater node for each node in the linked list.
     *
     * @param head Head node of the singly linked list
     * @return Array where each element is the next greater
     *         node value or 0 if none exists
     */
    // Step 1: Convert linked list to array list for easier indexing
    List<Integer> values = new ArrayList<>();
    ListNode current = head;
    while (current != null) {
        values.add(current.val);
        current = current.next;
    }

    // Step 2: Initialize result array with zeros (default when no greater element)
    int[] result = new int[values.size()];

    // Step 3: Use a stack to store indices of elements waiting for their next greater
    Stack<Integer> stack = new Stack<>();  // Will store indices, not values

    // Step 4: Process each element
    for (int i = 0; i < values.size(); i++) {
        int currentValue = values.get(i);

        // While stack has elements and current value > value at top of stack
        while (!stack.isEmpty() && values.get(stack.peek()) < currentValue) {
            // Current value is the next greater for the element at stack top
            int prevIndex = stack.pop();
            result[prevIndex] = currentValue;
        }

        // Push current index to stack - we'll look for its next greater later
        stack.push(i);
    }

    // Note: Remaining indices in stack already have 0 in result array
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Converting the linked list to an array takes O(n) time
- Each element is pushed onto the stack exactly once
- Each element is popped from the stack at most once
- Therefore, the total operations are linear in n

**Space Complexity: O(n)**

- We store the values array of size n
- We store the result array of size n
- The stack can grow up to size n in the worst case (when the list is in strictly decreasing order)
- Total space: O(3n) = O(n)

## Common Mistakes

1. **Not converting the linked list to an array first**: Some candidates try to work directly with the linked list and a stack of nodes. This gets messy because you need to track both the node and its position. Converting to an array first simplifies the indexing.

2. **Forgetting to initialize the result array with zeros**: If you don't initialize with zeros, you might miss updating positions for elements that have no next greater element. The stack approach naturally leaves these positions untouched, so they need to start as 0.

3. **Storing values instead of indices in the stack**: If you store values, you lose track of which position in the result array to update when you find a next greater element. Always store indices.

4. **Using the wrong comparison in the while loop**: The condition should be `values[stack[-1]] < currentValue` (strictly less than), not `<=`. The problem asks for "strictly larger" values. Using `<=` would be incorrect for equal values.

## When You'll See This Pattern

The monotonic stack pattern appears in several "next greater element" problems:

1. **Next Greater Element I (LeetCode 496)**: Find next greater element for each element in a subset. Uses the same monotonic stack approach.

2. **Next Greater Element II (LeetCode 503)**: Circular array version. You simulate the circular nature by traversing the array twice.

3. **Daily Temperatures (LeetCode 739)**: Essentially the same problem but asking for the distance to the next warmer day instead of the value itself.

4. **Largest Rectangle in Histogram (LeetCode 84)**: A more advanced application where you need to find the next smaller element on both sides.

The key signature is when you need to find the "next" element that satisfies some condition (greater, smaller, etc.) for each element in a sequence. When you see this pattern, think "monotonic stack."

## Key Takeaways

1. **Monotonic stacks are perfect for "next greater/smaller" problems**: They allow you to process elements in order while efficiently finding relationships between elements.

2. **Convert linked lists to arrays when you need random access**: Even though the input is a linked list, converting to an array first often simplifies the algorithm when you need to update values at specific indices.

3. **Store indices, not values, in the stack**: This gives you the position information needed to update the correct slot in your result array when you find the next greater element.

Remember: The stack maintains elements in decreasing order of their values. When you encounter a larger value, it becomes the "next greater" for all smaller values in the stack.

[Practice this problem on CodeJeet](/problem/next-greater-node-in-linked-list)
