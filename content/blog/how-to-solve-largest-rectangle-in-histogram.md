---
title: "How to Solve Largest Rectangle in Histogram — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Largest Rectangle in Histogram. Hard difficulty, 49.4% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2026-07-14"
category: "dsa-patterns"
tags: ["largest-rectangle-in-histogram", "array", "stack", "monotonic-stack", "hard"]
---

# How to Solve Largest Rectangle in Histogram

This problem asks us to find the largest rectangular area that can be formed within a histogram, where each bar has a given height and width of 1. The challenge comes from the fact that the rectangle's height is limited by the shortest bar within its span, and we need to efficiently determine for each bar how far it can extend to the left and right while maintaining at least its height.

## Visual Walkthrough

Let's trace through the example `heights = [2,1,5,6,2,3]` step by step to build intuition:

1. **Bar at index 0 (height 2)**: It can extend from index 0 to index 0 only, because the bar at index 1 is shorter (height 1). Area = 2 × 1 = 2.

2. **Bar at index 1 (height 1)**: This is the shortest bar, so it can extend across the entire histogram from index 0 to index 5. Area = 1 × 6 = 6.

3. **Bar at index 2 (height 5)**: It can extend from index 2 to index 3 only, because index 1 is shorter and index 4 is shorter. Area = 5 × 2 = 10.

4. **Bar at index 3 (height 6)**: It can extend from index 3 to index 3 only, because index 4 is shorter. Area = 6 × 1 = 6.

5. **Bar at index 4 (height 2)**: It can extend from index 2 to index 5, because index 1 is shorter and we reach the end. Area = 2 × 4 = 8.

6. **Bar at index 5 (height 3)**: It can extend from index 5 to index 5 only. Area = 3 × 1 = 3.

The maximum area is 10. The key insight is that for each bar, we need to find the **first smaller bar to its left** and **first smaller bar to its right** to determine its maximum width.

## Brute Force Approach

A naive approach would be to consider every possible rectangle by checking all pairs of indices `(i, j)` where `i ≤ j`. For each pair, we would find the minimum height between `i` and `j`, then calculate area = minHeight × width. This gives us O(n³) time complexity if we recompute the minimum for each pair, or O(n²) if we track the minimum as we expand.

Even the O(n²) approach is too slow for typical constraints (n up to 10⁵). Here's what it looks like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def largestRectangleArea_brute(heights):
    max_area = 0
    n = len(heights)

    for i in range(n):
        min_height = float('inf')
        for j in range(i, n):
            # Track the minimum height in the current window
            min_height = min(min_height, heights[j])
            width = j - i + 1
            max_area = max(max_area, min_height * width)

    return max_area
```

```javascript
// Time: O(n²) | Space: O(1)
function largestRectangleAreaBrute(heights) {
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i < n; i++) {
    let minHeight = Infinity;
    for (let j = i; j < n; j++) {
      // Track the minimum height in the current window
      minHeight = Math.min(minHeight, heights[j]);
      const width = j - i + 1;
      maxArea = Math.max(maxArea, minHeight * width);
    }
  }

  return maxArea;
}
```

```java
// Time: O(n²) | Space: O(1)
public int largestRectangleAreaBrute(int[] heights) {
    int maxArea = 0;
    int n = heights.length;

    for (int i = 0; i < n; i++) {
        int minHeight = Integer.MAX_VALUE;
        for (int j = i; j < n; j++) {
            // Track the minimum height in the current window
            minHeight = Math.min(minHeight, heights[j]);
            int width = j - i + 1;
            maxArea = Math.max(maxArea, minHeight * width);
        }
    }

    return maxArea;
}
```

</div>

The brute force approach is inefficient because it redundantly processes the same bars multiple times. We need a way to determine each bar's maximum width in O(1) time after some preprocessing.

## Optimized Approach

The key insight is that for each bar, the rectangle of maximum area using that bar as the shortest bar (the limiting height) extends until it hits a bar shorter than itself on either side. If we can find for each bar:

- The index of the **first smaller bar to the left** (or -1 if none exists)
- The index of the **first smaller bar to the right** (or n if none exists)

Then the width for that bar's maximum rectangle is `right[i] - left[i] - 1`.

We can compute these boundaries efficiently using a **monotonic increasing stack**. A monotonic stack maintains elements in increasing order (from bottom to top). When we process a new bar:

- If it's taller than the stack top, push it (maintaining increasing order)
- If it's shorter, we pop bars from the stack until we can push the current bar

The magic happens when we pop: the bar being popped has found its right boundary (the current index, which has a smaller height), and its left boundary is the next bar in the stack (or -1 if stack is empty).

## Optimal Solution

Here's the complete solution using monotonic stack:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def largestRectangleArea(heights):
    max_area = 0
    stack = []  # Stores indices of bars in increasing height order

    # We'll process all bars, including a dummy bar of height 0 at the end
    # to ensure all bars get popped from the stack
    for i, h in enumerate(heights + [0]):
        # While current bar is shorter than the bar at stack top
        while stack and heights[stack[-1]] > h:
            # Pop the bar at the top of stack
            height = heights[stack.pop()]
            # The bar just popped is bounded by:
            # - Current index i (right boundary, exclusive)
            # - New stack top (left boundary, exclusive) or -1 if stack empty
            left = stack[-1] if stack else -1
            width = i - left - 1
            max_area = max(max_area, height * width)

        # Push current index onto stack
        stack.append(i)

    return max_area
```

```javascript
// Time: O(n) | Space: O(n)
function largestRectangleArea(heights) {
  let maxArea = 0;
  const stack = []; // Stores indices of bars in increasing height order

  // Process all bars, including a dummy bar of height 0 at the end
  // to ensure all bars get popped from the stack
  for (let i = 0; i <= heights.length; i++) {
    // Current height is 0 for the dummy bar at the end
    const h = i === heights.length ? 0 : heights[i];

    // While current bar is shorter than the bar at stack top
    while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
      // Pop the bar at the top of stack
      const height = heights[stack.pop()];
      // The bar just popped is bounded by:
      // - Current index i (right boundary, exclusive)
      // - New stack top (left boundary, exclusive) or -1 if stack empty
      const left = stack.length > 0 ? stack[stack.length - 1] : -1;
      const width = i - left - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    // Push current index onto stack
    stack.push(i);
  }

  return maxArea;
}
```

```java
// Time: O(n) | Space: O(n)
public int largestRectangleArea(int[] heights) {
    int maxArea = 0;
    Deque<Integer> stack = new ArrayDeque<>();  // Stores indices of bars

    // Process all bars, including a dummy bar of height 0 at the end
    for (int i = 0; i <= heights.length; i++) {
        // Current height is 0 for the dummy bar at the end
        int h = (i == heights.length) ? 0 : heights[i];

        // While current bar is shorter than the bar at stack top
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            // Pop the bar at the top of stack
            int height = heights[stack.pop()];
            // The bar just popped is bounded by:
            // - Current index i (right boundary, exclusive)
            // - New stack top (left boundary, exclusive) or -1 if stack empty
            int left = stack.isEmpty() ? -1 : stack.peek();
            int width = i - left - 1;
            maxArea = Math.max(maxArea, height * width);
        }

        // Push current index onto stack
        stack.push(i);
    }

    return maxArea;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
Each bar is pushed onto the stack exactly once and popped at most once. Even though we have a while loop inside the for loop, the total number of operations is proportional to 2n (n pushes and at most n pops), giving us O(n) time.

**Space Complexity: O(n)**  
In the worst case, we might push all bars onto the stack if they're in strictly increasing order (e.g., [1,2,3,4,5]). This requires O(n) space for the stack.

## Common Mistakes

1. **Forgetting the dummy bar at the end**: Without processing a bar of height 0 at the end, bars that are never popped from the stack won't have their areas calculated. The dummy bar ensures all bars get processed.

2. **Incorrect width calculation**: The width should be `right - left - 1`, not `right - left`. The boundaries are exclusive, so we subtract 1. For example, if left boundary is at index 1 and right boundary at index 4, the width is 2 (indices 2 and 3).

3. **Using the wrong comparison in the while loop**: The condition should be `heights[stack[-1]] > h` (strictly greater), not `>=`. Using `>=` would give incorrect results when consecutive bars have equal heights, as it would incorrectly limit the rectangle width.

4. **Not handling empty stack correctly**: When the stack becomes empty after popping, the left boundary should be -1, not 0. This represents that the rectangle extends all the way to the beginning of the histogram.

## When You'll See This Pattern

The monotonic stack pattern appears in problems where you need to find the "nearest smaller/greater element" for each element in an array. This technique transforms an O(n²) search into O(n).

Related problems that use similar techniques:

1. **Maximal Rectangle (Hard)**: This problem extends the histogram concept to 2D. You can reduce it to multiple instances of "Largest Rectangle in Histogram" by treating each row as the base of a histogram.

2. **Maximum Score of a Good Subarray (Hard)**: This problem also involves finding boundaries where elements are at least a certain value, similar to finding the maximum rectangle containing a specific bar.

3. **Trapping Rain Water (Hard)**: While not identical, it also uses the concept of boundaries and can be solved with monotonic stacks or two-pointer approaches.

## Key Takeaways

1. **Monotonic stacks excel at finding nearest smaller/greater elements**: When you need to find boundaries based on relative values (taller/shorter, larger/smaller), consider using a monotonic stack to achieve O(n) time.

2. **The dummy element trick is powerful**: Adding a sentinel value (like height 0 at the end) can simplify boundary condition handling and ensure all elements get processed.

3. **Visualize the problem geometrically**: Drawing the histogram and tracing through examples helps understand why we need both left and right boundaries for each bar.

Related problems: [Maximal Rectangle](/problem/maximal-rectangle), [Maximum Score of a Good Subarray](/problem/maximum-score-of-a-good-subarray)
