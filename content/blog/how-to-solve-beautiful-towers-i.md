---
title: "How to Solve Beautiful Towers I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Beautiful Towers I. Medium difficulty, 44.3% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2029-03-03"
category: "dsa-patterns"
tags: ["beautiful-towers-i", "array", "stack", "monotonic-stack", "medium"]
---

# How to Solve Beautiful Towers I

You're given an array of tower heights where you can only remove bricks (decrease heights) to create a mountain-shaped arrangement: heights must be non-decreasing up to a peak, then non-increasing after it. The goal is to maximize the total height sum after removal. What makes this tricky is that the peak can be anywhere, and you need to efficiently compute the maximum possible sum for each possible peak position.

## Visual Walkthrough

Let's trace through `heights = [1, 2, 3, 4, 5]`:

- If we choose index 0 as peak: heights must be non-increasing to the right → [1, 1, 1, 1, 1] = sum 5
- Index 1 as peak: [1, 2, 2, 2, 2] = sum 9
- Index 2 as peak: [1, 2, 3, 3, 3] = sum 12
- Index 3 as peak: [1, 2, 3, 4, 4] = sum 14
- Index 4 as peak: [1, 2, 3, 4, 5] = sum 15 (already a mountain)

Now consider `heights = [5, 4, 3, 2, 1]`:

- Any peak requires non-decreasing left side, which means we must increase heights (not allowed) → we can only decrease
- Best is index 0 as peak: [5, 4, 3, 2, 1] = sum 15

The challenge: for each index `i` as peak, we need:

1. Left side: non-decreasing ending at `heights[i]`
2. Right side: non-increasing starting from `heights[i]`
3. We can only decrease heights, not increase them

For `heights = [1, 2, 3, 2, 1]` with peak at index 2:

- Left: [1, 2, 3] (already non-decreasing)
- Right: [3, 2, 1] (already non-increasing)
- Sum = 1 + 2 + 3 + 2 + 1 = 9

## Brute Force Approach

A naive approach would be: for each index `i` as potential peak, try all possible height adjustments:

1. For left side (0 to i): each height ≤ previous and ≤ heights[i]
2. For right side (i to n-1): each height ≤ previous and ≤ heights[i]
3. Calculate sum for this configuration
4. Track maximum sum across all peaks

This requires exploring all possible height combinations at each position - exponential time O(2^n). Even a slightly better brute force that just sets each height to min(previous, original_height) would be O(n²) since we'd recompute for each peak.

The problem: we're doing redundant work. When computing left chains for different peaks, we're recalculating the same constraints repeatedly.

## Optimized Approach

The key insight: we can precompute for each position:

1. `left[i]`: maximum possible sum ending at `i` with non-decreasing sequence from left
2. `right[i]`: maximum possible sum starting at `i` with non-increasing sequence to right

For `left[i]`: we need the best sequence where each height ≤ the next, and we can only decrease heights. This is like: for each `i`, find the nearest `j < i` where `heights[j] ≤ heights[i]`, and all between must be ≤ heights[i]. But we want the sum, so we need to propagate constraints.

Better approach using monotonic stack:

- Process left to right: maintain stack of indices with increasing heights
- When we see a taller tower, it limits previous towers to be ≤ current height
- Pop from stack while current height < stack top's height, adjusting sums
- This gives us `left[i]` = best sum ending at i with non-decreasing constraint

Similarly for right side processing right to left.

Why monotonic stack works: it efficiently finds the "limiting" height for each segment, allowing O(n) computation instead of O(n²).

## Optimal Solution

We compute two arrays:

- `left[i]`: max sum of non-decreasing sequence ending at i
- `right[i]`: max sum of non-increasing sequence starting at i
  Then answer = max(left[i] + right[i] - heights[i]) for all i

The subtraction avoids double-counting the peak height.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSumOfHeights(heights):
    n = len(heights)

    # left[i] = max sum of non-decreasing sequence ending at i
    left = [0] * n
    stack = []  # monotonic increasing stack of indices

    for i in range(n):
        # While current height is less than stack top, we need to adjust
        while stack and heights[stack[-1]] > heights[i]:
            stack.pop()

        if not stack:
            # No smaller element to the left, all previous must be <= heights[i]
            # Sum = heights[i] * (i + 1) since we can set all to heights[i]
            left[i] = heights[i] * (i + 1)
        else:
            # Found a smaller element at index j
            j = stack[-1]
            # From j+1 to i, heights must be <= heights[i]
            left[i] = left[j] + heights[i] * (i - j)

        stack.append(i)

    # right[i] = max sum of non-increasing sequence starting at i
    right = [0] * n
    stack = []  # monotonic increasing stack when processing right to left

    for i in range(n - 1, -1, -1):
        # While current height is less than stack top
        while stack and heights[stack[-1]] > heights[i]:
            stack.pop()

        if not stack:
            # No smaller element to the right
            right[i] = heights[i] * (n - i)
        else:
            j = stack[-1]
            right[i] = right[j] + heights[i] * (j - i)

        stack.append(i)

    # Find maximum sum where i is the peak
    max_sum = 0
    for i in range(n):
        # left[i] + right[i] - heights[i] avoids double-counting peak
        max_sum = max(max_sum, left[i] + right[i] - heights[i])

    return max_sum
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSumOfHeights(heights) {
  const n = heights.length;

  // left[i] = max sum of non-decreasing sequence ending at i
  const left = new Array(n).fill(0);
  const stack = []; // monotonic increasing stack of indices

  for (let i = 0; i < n; i++) {
    // While current height is less than stack top, pop
    while (stack.length > 0 && heights[stack[stack.length - 1]] > heights[i]) {
      stack.pop();
    }

    if (stack.length === 0) {
      // No smaller element to the left
      left[i] = heights[i] * (i + 1);
    } else {
      // Found smaller element at index j
      const j = stack[stack.length - 1];
      left[i] = left[j] + heights[i] * (i - j);
    }

    stack.push(i);
  }

  // right[i] = max sum of non-increasing sequence starting at i
  const right = new Array(n).fill(0);
  stack.length = 0; // Clear stack for right pass

  for (let i = n - 1; i >= 0; i--) {
    // While current height is less than stack top
    while (stack.length > 0 && heights[stack[stack.length - 1]] > heights[i]) {
      stack.pop();
    }

    if (stack.length === 0) {
      // No smaller element to the right
      right[i] = heights[i] * (n - i);
    } else {
      const j = stack[stack.length - 1];
      right[i] = right[j] + heights[i] * (j - i);
    }

    stack.push(i);
  }

  // Find maximum sum where i is the peak
  let maxSum = 0;
  for (let i = 0; i < n; i++) {
    // Subtract heights[i] to avoid double-counting peak
    maxSum = Math.max(maxSum, left[i] + right[i] - heights[i]);
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long maximumSumOfHeights(List<Integer> heights) {
        int n = heights.size();

        // left[i] = max sum of non-decreasing sequence ending at i
        long[] left = new long[n];
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            int currentHeight = heights.get(i);

            // While current height is less than stack top, pop
            while (!stack.isEmpty() && heights.get(stack.peek()) > currentHeight) {
                stack.pop();
            }

            if (stack.isEmpty()) {
                // No smaller element to the left
                left[i] = (long) currentHeight * (i + 1);
            } else {
                // Found smaller element at index j
                int j = stack.peek();
                left[i] = left[j] + (long) currentHeight * (i - j);
            }

            stack.push(i);
        }

        // right[i] = max sum of non-increasing sequence starting at i
        long[] right = new long[n];
        stack.clear();

        for (int i = n - 1; i >= 0; i--) {
            int currentHeight = heights.get(i);

            // While current height is less than stack top
            while (!stack.isEmpty() && heights.get(stack.peek()) > currentHeight) {
                stack.pop();
            }

            if (stack.isEmpty()) {
                // No smaller element to the right
                right[i] = (long) currentHeight * (n - i);
            } else {
                int j = stack.peek();
                right[i] = right[j] + (long) currentHeight * (j - i);
            }

            stack.push(i);
        }

        // Find maximum sum where i is the peak
        long maxSum = 0;
        for (int i = 0; i < n; i++) {
            // Subtract heights[i] to avoid double-counting peak
            maxSum = Math.max(maxSum, left[i] + right[i] - heights.get(i));
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array (left to right and right to left)
- Each element is pushed and popped from the stack at most once
- The while loops inside the for loops might look like O(n²), but amortized analysis shows each element is processed at most twice (once pushed, once popped)

**Space Complexity: O(n)**

- We store `left` and `right` arrays of size n
- The stack can grow up to size n in worst case (strictly increasing heights)
- Total: O(3n) = O(n)

## Common Mistakes

1. **Forgetting we can only decrease heights**: Some candidates try to create the mountain by increasing heights, which isn't allowed. Always remember: `new_height ≤ original_height`.

2. **Not handling the peak correctly**: When computing `left[i] + right[i]`, the peak at `i` is counted twice. You must subtract `heights[i]` once.

3. **Using the wrong stack order**: For the left pass, we need increasing stack (popping when current < top). For the right pass processing backwards, the logic is similar but direction reversed. Mixing these up gives wrong results.

4. **Integer overflow with large sums**: The sum can be up to `n * max_height = 10^5 * 10^9 = 10^14`, which fits in 64-bit integer but not 32-bit. Use `long` in Java, `int` is insufficient.

## When You'll See This Pattern

This monotonic stack pattern appears in problems where you need to find the nearest smaller/larger element or compute constrained sums:

1. **Largest Rectangle in Histogram (Hard)**: Similar stack mechanism to find width of rectangles
2. **Trapping Rain Water (Hard)**: Finding boundaries for water trapping
3. **Sum of Subarray Minimums (Medium)**: Computing sums based on element being minimum in subarrays
4. **Maximum Number of Books You Can Take (Hard)**: Directly related - it's the "Beautiful Towers II" version

The pattern: when you need to propagate constraints (like "cannot exceed this height") efficiently, monotonic stack helps avoid O(n²) pairwise comparisons.

## Key Takeaways

1. **Monotonic stacks excel at "nearest smaller/greater" problems**: When you need to find boundaries where a constraint changes, stacks provide O(n) solutions.

2. **Break symmetric problems into two passes**: Mountain arrays have left and right constraints. Compute each side separately, then combine.

3. **Amortized analysis matters**: While loops inside for loops don't always mean O(n²). When each element is processed a constant number of times overall, it's still O(n).

Related problems: [Valid Mountain Array](/problem/valid-mountain-array), [Minimum Number of Removals to Make Mountain Array](/problem/minimum-number-of-removals-to-make-mountain-array), [Maximum Number of Books You Can Take](/problem/maximum-number-of-books-you-can-take)
