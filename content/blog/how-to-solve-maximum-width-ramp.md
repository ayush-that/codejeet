---
title: "How to Solve Maximum Width Ramp — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Width Ramp. Medium difficulty, 55.8% acceptance rate. Topics: Array, Two Pointers, Stack, Monotonic Stack."
date: "2028-09-18"
category: "dsa-patterns"
tags: ["maximum-width-ramp", "array", "two-pointers", "stack", "medium"]
---

# How to Solve Maximum Width Ramp

Finding the maximum width ramp is a classic medium-difficulty problem that tests your ability to transform a seemingly simple problem into an efficient solution. The challenge lies in the fact that a brute force approach would check all O(n²) pairs, which is unacceptable for large arrays. The interesting twist is that we need to find the _maximum_ width, not just any valid ramp, which allows us to use clever preprocessing to achieve O(n) time.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [6, 0, 8, 2, 1, 5]`.

We're looking for pairs `(i, j)` where `i < j` and `nums[i] <= nums[j]`, and we want to maximize `j - i`.

Let's think about potential candidates:

- If we start from the left, `nums[0] = 6`. Where's the farthest right element that's ≥ 6? The answer is `nums[2] = 8` at index 2, giving width 2.
- What about `nums[1] = 0`? The farthest right element ≥ 0 is `nums[5] = 5` at index 5, giving width 4.
- For `nums[2] = 8`, the farthest right ≥ 8 is itself at index 2 (width 0).
- For `nums[3] = 2`, the farthest right ≥ 2 is `nums[5] = 5` at index 5 (width 2).
- For `nums[4] = 1`, the farthest right ≥ 1 is `nums[5] = 5` at index 5 (width 1).

The maximum width is 4 from pair `(1, 5)` where `0 <= 5`.

The key insight: For each potential starting index `i`, we want to find the _farthest_ `j` to the right where `nums[j] >= nums[i]`. But checking every `i` against every `j` is O(n²). We need a smarter approach.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxWidthRamp(nums):
    max_width = 0
    n = len(nums)

    # Check every possible pair (i, j)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] <= nums[j]:
                max_width = max(max_width, j - i)

    return max_width
```

```javascript
// Time: O(n²) | Space: O(1)
function maxWidthRamp(nums) {
  let maxWidth = 0;
  const n = nums.length;

  // Check every possible pair (i, j)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] <= nums[j]) {
        maxWidth = Math.max(maxWidth, j - i);
      }
    }
  }

  return maxWidth;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxWidthRamp(int[] nums) {
    int maxWidth = 0;
    int n = nums.length;

    // Check every possible pair (i, j)
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] <= nums[j]) {
                maxWidth = Math.max(maxWidth, j - i);
            }
        }
    }

    return maxWidth;
}
```

</div>

This brute force approach is correct but too slow for large inputs (up to 50,000 elements). With O(n²) time complexity, it would take ~2.5 billion operations for the maximum input size, which is completely impractical.

## Optimized Approach

The key insight is that we can preprocess the array to find candidate starting points efficiently. Here's the step-by-step reasoning:

1. **Observation**: For a given ending position `j`, we want the _smallest_ `i` such that `nums[i] <= nums[j]`. This is because smaller `i` gives larger width `j - i`.

2. **Monotonic Stack Approach**: We can build a decreasing stack of indices from left to right. Why decreasing? Because if `nums[i] > nums[j]` for `i < j`, then `i` can't be a better starting point than `j` for any future element (since `j` is both larger index and smaller value).

3. **Two-Pass Algorithm**:
   - First pass: Build a stack of candidate starting indices in decreasing order of their values.
   - Second pass: Traverse from right to left, and for each `j`, pop from the stack while the top of stack satisfies `nums[stack[-1]] <= nums[j]`. The last popped index gives the maximum width for that `j`.

4. **Why this works**: The stack maintains potential starting points. When we encounter a value from the right, any starting point with a value ≤ current value could form a valid ramp. By popping from the stack while the condition holds, we find the leftmost (smallest index) valid starting point for each ending point.

## Optimal Solution

Here's the complete implementation using a monotonic stack:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxWidthRamp(nums):
    n = len(nums)
    stack = []

    # Step 1: Build decreasing stack of indices
    # We only keep indices where nums[i] is decreasing
    for i in range(n):
        # If stack is empty or current value is smaller than stack top's value
        if not stack or nums[i] < nums[stack[-1]]:
            stack.append(i)

    max_width = 0

    # Step 2: Traverse from right to left
    for j in range(n - 1, -1, -1):
        # While stack is not empty and current value >= stack top's value
        while stack and nums[j] >= nums[stack[-1]]:
            # Pop the top and calculate width
            i = stack.pop()
            max_width = max(max_width, j - i)

    return max_width
```

```javascript
// Time: O(n) | Space: O(n)
function maxWidthRamp(nums) {
  const n = nums.length;
  const stack = [];

  // Step 1: Build decreasing stack of indices
  // We only keep indices where nums[i] is decreasing
  for (let i = 0; i < n; i++) {
    // If stack is empty or current value is smaller than stack top's value
    if (stack.length === 0 || nums[i] < nums[stack[stack.length - 1]]) {
      stack.push(i);
    }
  }

  let maxWidth = 0;

  // Step 2: Traverse from right to left
  for (let j = n - 1; j >= 0; j--) {
    // While stack is not empty and current value >= stack top's value
    while (stack.length > 0 && nums[j] >= nums[stack[stack.length - 1]]) {
      // Pop the top and calculate width
      const i = stack.pop();
      maxWidth = Math.max(maxWidth, j - i);
    }
  }

  return maxWidth;
}
```

```java
// Time: O(n) | Space: O(n)
public int maxWidthRamp(int[] nums) {
    int n = nums.length;
    Stack<Integer> stack = new Stack<>();

    // Step 1: Build decreasing stack of indices
    // We only keep indices where nums[i] is decreasing
    for (int i = 0; i < n; i++) {
        // If stack is empty or current value is smaller than stack top's value
        if (stack.isEmpty() || nums[i] < nums[stack.peek()]) {
            stack.push(i);
        }
    }

    int maxWidth = 0;

    // Step 2: Traverse from right to left
    for (int j = n - 1; j >= 0; j--) {
        // While stack is not empty and current value >= stack top's value
        while (!stack.isEmpty() && nums[j] >= nums[stack.peek()]) {
            // Pop the top and calculate width
            int i = stack.pop();
            maxWidth = Math.max(maxWidth, j - i);
        }
    }

    return maxWidth;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - We make two passes through the array:

- First pass: O(n) to build the monotonic stack
- Second pass: O(n) overall because each index is pushed and popped from the stack at most once

**Space Complexity: O(n)** - In the worst case, we might store all indices in the stack (when the array is strictly decreasing). However, in practice, the stack size is usually much smaller than n.

## Common Mistakes

1. **Forgetting to handle empty or single-element arrays**: Always check edge cases. For `nums = []` or `nums = [1]`, the answer should be 0 since no valid ramp exists.

2. **Incorrect stack building logic**: Some candidates build an increasing stack instead of decreasing. Remember: we want to keep indices with _smaller_ values as we move right, because larger values can't be optimal starting points.

3. **Not popping from the stack correctly in the second pass**: The while loop should continue as long as `nums[j] >= nums[stack[-1]]`, not just `>`. The equality case is important!

4. **Trying to use two pointers directly**: This isn't a typical two-pointer problem where both pointers move in one direction. The monotonic stack approach is specifically designed for finding the maximum width.

## When You'll See This Pattern

The monotonic stack pattern appears in several problems where you need to find the nearest larger/smaller element or compute maximum areas/distances:

1. **Daily Temperatures (LeetCode 739)** - Find how many days until a warmer temperature. Uses a decreasing stack to track temperatures.

2. **Largest Rectangle in Histogram (LeetCode 84)** - Find the largest rectangular area. Uses increasing stack to track bar heights.

3. **Next Greater Element I/II (LeetCode 496/503)** - Find the next greater element in an array. Classic monotonic stack application.

4. **Trapping Rain Water (LeetCode 42)** - Can be solved using monotonic stack to track decreasing heights.

The common theme: when you need to compare each element with previous/next elements in a way that allows you to discard non-optimal candidates early, consider a monotonic stack.

## Key Takeaways

1. **Monotonic stacks excel at "nearest greater/lesser" problems**: When you need to find relationships between elements and their neighbors while maintaining some ordering property, a monotonic stack is often the right tool.

2. **Think in terms of what makes a candidate optimal**: For maximum width ramp, we realized that for a given ending point, we want the smallest index with value ≤ current value. This insight led to the decreasing stack.

3. **Two-pass algorithms can reduce O(n²) to O(n)**: By preprocessing the array in one direction and then processing in the other, we can often achieve linear time for problems that seem quadratic at first glance.

[Practice this problem on CodeJeet](/problem/maximum-width-ramp)
