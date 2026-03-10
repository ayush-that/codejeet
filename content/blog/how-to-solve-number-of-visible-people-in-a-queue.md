---
title: "How to Solve Number of Visible People in a Queue — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Visible People in a Queue. Hard difficulty, 72.4% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2027-03-09"
category: "dsa-patterns"
tags: ["number-of-visible-people-in-a-queue", "array", "stack", "monotonic-stack", "hard"]
---

# How to Solve Number of Visible People in a Queue

This problem asks us to determine, for each person in a queue, how many people to their right they can see. A person can see another person if everyone between them is shorter than both of them. The challenge comes from the fact that visibility isn't just about the next taller person—it's about counting all people who aren't blocked by someone equal or taller in between. This makes it more complex than simply finding the next greater element.

## Visual Walkthrough

Let's trace through a concrete example: `heights = [10, 6, 8, 5, 11, 9]`

For person at index 0 (height 10):

- Looks at index 1 (height 6): 10 > 6, so can see person 1
- Looks at index 2 (height 8): 10 > 8, but person 1 (height 6) is shorter than both, so can see person 2
- Looks at index 3 (height 5): 10 > 5, can see person 3
- Looks at index 4 (height 11): 11 > 10, so person 4 blocks further view
- Total visible: 4 people (indices 1, 2, 3, and 4)

For person at index 1 (height 6):

- Looks at index 2 (height 8): 8 > 6, so can see person 2, but person 2 blocks further view
- Total visible: 1 person (index 2)

For person at index 2 (height 8):

- Looks at index 3 (height 5): 8 > 5, can see person 3
- Looks at index 4 (height 11): 11 > 8, so can see person 4, but person 4 blocks further view
- Total visible: 2 people (indices 3 and 4)

For person at index 3 (height 5):

- Looks at index 4 (height 11): 11 > 5, can see person 4, but person 4 blocks further view
- Total visible: 1 person (index 4)

For person at index 4 (height 11):

- Looks at index 5 (height 9): 11 > 9, can see person 5
- Total visible: 1 person (index 5)

For person at index 5 (height 9):

- No one to the right
- Total visible: 0 people

Result: `[4, 1, 2, 1, 1, 0]`

The key insight: When person A looks right, they can see all people until someone taller than A appears. But we also need to count everyone in between, even if they're shorter than both.

## Brute Force Approach

The brute force solution is straightforward: for each person, look to their right and count how many people they can see, stopping when we encounter someone taller.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output
def canSeePersonsCount(heights):
    n = len(heights)
    result = [0] * n

    for i in range(n):
        max_height = 0
        count = 0
        # Check each person to the right
        for j in range(i + 1, n):
            # A person can be seen if they're taller than anyone between
            # Actually simpler: count if current person is taller than max so far
            if heights[j] > max_height:
                count += 1
                max_height = heights[j]
            # Stop if we find someone taller than current person
            if heights[j] > heights[i]:
                break
        result[i] = count

    return result
```

```javascript
// Time: O(n²) | Space: O(1) excluding output
function canSeePersonsCount(heights) {
  const n = heights.length;
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let maxHeight = 0;
    let count = 0;
    // Check each person to the right
    for (let j = i + 1; j < n; j++) {
      // Count if this person is taller than anyone seen so far
      if (heights[j] > maxHeight) {
        count++;
        maxHeight = heights[j];
      }
      // Stop if we find someone taller than current person
      if (heights[j] > heights[i]) {
        break;
      }
    }
    result[i] = count;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output
public int[] canSeePersonsCount(int[] heights) {
    int n = heights.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        int maxHeight = 0;
        int count = 0;
        // Check each person to the right
        for (int j = i + 1; j < n; j++) {
            // Count if this person is taller than anyone seen so far
            if (heights[j] > maxHeight) {
                count++;
                maxHeight = heights[j];
            }
            // Stop if we find someone taller than current person
            if (heights[j] > heights[i]) {
                break;
            }
        }
        result[i] = count;
    }

    return result;
}
```

</div>

**Why this is insufficient:** With O(n²) time complexity, this solution times out for large inputs (n up to 10⁵). We need to find a way to process each person's visibility in constant or logarithmic time.

## Optimized Approach

The key insight is to use a **monotonic decreasing stack**. We process people from right to left, maintaining a stack of people we've seen to the right. The stack will contain heights in decreasing order from bottom to top.

Here's the reasoning:

1. When we process a new person from the right, they can see:
   - The person immediately to their right (if any)
   - Any other people that person can see, as long as they're not blocked
2. If the new person is taller than the person to their right, they can "see over" them and potentially see more people
3. We can use a stack to keep track of people to the right in decreasing height order

Processing from right to left:

- For current person, look at people to the right (in the stack)
- Pop from stack while current person is taller than the top of stack
- Each pop represents a person the current person can see
- If stack is not empty after popping, current person can see one more person (the next taller person)
- Push current person onto stack

This works because:

- When we pop someone, current person can definitely see them (they're shorter and not blocked)
- The remaining person on top of stack (if any) is taller than current person, so blocks further view
- By maintaining decreasing order, we efficiently find who blocks the view

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def canSeePersonsCount(heights):
    n = len(heights)
    result = [0] * n
    stack = []  # Monotonic decreasing stack (stores indices)

    # Process from right to left
    for i in range(n - 1, -1, -1):
        visible_count = 0

        # While stack is not empty and current person is taller than
        # the person at the top of the stack
        while stack and heights[i] > heights[stack[-1]]:
            # Current person can see this person
            visible_count += 1
            # Remove this person from stack since current person blocks
            # them from being seen by people further left
            stack.pop()

        # If stack is not empty after popping all shorter people,
        # current person can see one more person (the next taller person)
        if stack:
            visible_count += 1

        # Store result for current person
        result[i] = visible_count

        # Add current person to stack
        stack.append(i)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function canSeePersonsCount(heights) {
  const n = heights.length;
  const result = new Array(n).fill(0);
  const stack = []; // Monotonic decreasing stack (stores indices)

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    let visibleCount = 0;

    // While stack is not empty and current person is taller than
    // the person at the top of the stack
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      // Current person can see this person
      visibleCount++;
      // Remove this person from stack since current person blocks
      // them from being seen by people further left
      stack.pop();
    }

    // If stack is not empty after popping all shorter people,
    // current person can see one more person (the next taller person)
    if (stack.length > 0) {
      visibleCount++;
    }

    // Store result for current person
    result[i] = visibleCount;

    // Add current person to stack
    stack.push(i);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] canSeePersonsCount(int[] heights) {
    int n = heights.length;
    int[] result = new int[n];
    Stack<Integer> stack = new Stack<>();  // Monotonic decreasing stack

    // Process from right to left
    for (int i = n - 1; i >= 0; i--) {
        int visibleCount = 0;

        // While stack is not empty and current person is taller than
        // the person at the top of the stack
        while (!stack.isEmpty() && heights[i] > heights[stack.peek()]) {
            // Current person can see this person
            visibleCount++;
            // Remove this person from stack since current person blocks
            // them from being seen by people further left
            stack.pop();
        }

        // If stack is not empty after popping all shorter people,
        // current person can see one more person (the next taller person)
        if (!stack.isEmpty()) {
            visibleCount++;
        }

        // Store result for current person
        result[i] = visibleCount;

        // Add current person to stack
        stack.push(i);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each person is pushed onto the stack exactly once
- Each person is popped from the stack at most once
- The while loop inside the for loop doesn't make it O(n²) because total operations across all iterations is O(n)

**Space Complexity: O(n)**

- The stack can hold up to n elements in the worst case (when heights are in strictly decreasing order)
- The result array requires O(n) space

## Common Mistakes

1. **Processing left to right instead of right to left**: When processing left to right, you don't know who will block your view from the right. Right-to-left processing lets us use a stack to track potential blockers.

2. **Forgetting to count the blocker**: After popping all shorter people, if there's still someone on the stack, that person is taller than current person and blocks further view, but current person CAN see them. Don't forget to add 1 for this person.

3. **Incorrect stack order**: The stack should maintain decreasing heights (from bottom to top). If you accidentally maintain increasing order, the logic breaks because you won't correctly identify who blocks the view.

4. **Not using indices in the stack**: While you could store heights directly, storing indices is better practice—it gives you access to both height and position if needed, and makes the code more readable.

## When You'll See This Pattern

The monotonic stack pattern appears in problems where you need to find the next greater/smaller element or count elements with certain visibility properties:

1. **Buildings With an Ocean View (Medium)**: Similar concept—find buildings that can see the ocean (no taller buildings to their right). This is actually simpler since you only need to know if ANY building blocks the view, not count all visible buildings.

2. **Daily Temperatures (Medium)**: Find how many days until a warmer temperature. Uses a monotonic decreasing stack to track temperatures.

3. **Largest Rectangle in Histogram (Hard)**: Uses monotonic stack to find the next smaller element on both sides to calculate rectangle widths.

4. **Sum of Subarray Minimums (Medium)**: Uses monotonic stack to find the range where each element is the minimum.

## Key Takeaways

1. **Monotonic stacks are perfect for "next greater/smaller element" problems**: When you need to find relationships between elements based on their relative values, a monotonic stack often provides an O(n) solution.

2. **Direction matters**: For visibility problems, processing from the direction of visibility (right-to-left for seeing right) simplifies the logic because you encounter potential blockers in the order they appear.

3. **Each pop represents a relationship**: In monotonic stack problems, when you pop an element, you're establishing a relationship between that element and the current element. Here, each pop means "current person can see this popped person."

Related problems: [Buildings With an Ocean View](/problem/buildings-with-an-ocean-view), [Sum of Subarray Ranges](/problem/sum-of-subarray-ranges), [Sum of Total Strength of Wizards](/problem/sum-of-total-strength-of-wizards)
