---
title: "How to Solve Beautiful Towers II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Beautiful Towers II. Medium difficulty, 36.2% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2029-12-27"
category: "dsa-patterns"
tags: ["beautiful-towers-ii", "array", "stack", "monotonic-stack", "medium"]
---

# How to Solve Beautiful Towers II

This problem asks us to build towers at positions 0 through n-1 where each tower's height must be at most the given `maxHeights[i]`, and the heights must form a "mountain" shape: they must be non-decreasing from left to right up to some peak, then non-increasing from the peak to the right end. The goal is to maximize the sum of all tower heights while respecting both the mountain shape constraint and the maximum height limits.

What makes this problem interesting is that we need to find the optimal peak position and heights simultaneously. The maximum height constraints at each position make this more complex than a simple mountain array problem - we can't just set heights arbitrarily, but must work within the given limits.

## Visual Walkthrough

Let's trace through a concrete example: `maxHeights = [5, 3, 4, 1, 1]`

We need to find heights that form a mountain shape while staying under the blue limits:

```
maxHeights: [5, 3, 4, 1, 1]
Indices:     0  1  2  3  4
```

**Key Insight**: For any position `i` as the peak, the heights to the left must be non-decreasing toward `i`, and heights to the right must be non-increasing from `i`. The optimal heights at each position are determined by the "tightest" constraint along the path.

Let's consider position 2 (height 4) as a potential peak:

- Left of peak (indices 0-2): Heights must be ≤ maxHeights and non-decreasing toward index 2
  - At index 2: Can be at most 4
  - At index 1: Can be at most min(3, 4) = 3 (must be ≤ index 2's height)
  - At index 0: Can be at most min(5, 3) = 3 (must be ≤ index 1's height)
    Left heights: [3, 3, 4] with sum = 10

- Right of peak (indices 2-4): Heights must be ≤ maxHeights and non-increasing from index 2
  - At index 2: 4
  - At index 3: Can be at most min(1, 4) = 1
  - At index 4: Can be at most min(1, 1) = 1 (must be ≤ index 3's height)
    Right heights: [4, 1, 1] with sum = 6

Total sum for peak at index 2: 10 + 6 - 4 (don't double count peak) = 12

We need to check all possible peak positions to find the maximum total height. The challenge is doing this efficiently without O(n²) time.

## Brute Force Approach

A brute force solution would try every position `i` as the peak, then:

1. For left side (0 to i): Set each height to the minimum of its maxHeight and the previous height
2. For right side (i to n-1): Set each height to the minimum of its maxHeight and the previous height
3. Calculate the sum for this configuration
4. Track the maximum sum across all peaks

This approach has O(n²) time complexity because for each of n possible peaks, we traverse O(n) positions to compute heights. For n up to 10⁵, this is far too slow (10¹⁰ operations).

## Optimized Approach

The key insight is that we can precompute for each position:

1. `left[i]`: The maximum possible sum of heights from 0 to i when heights are non-decreasing
2. `right[i]`: The maximum possible sum of heights from i to n-1 when heights are non-increasing

We can compute these efficiently using a **monotonic stack**:

**For left[i]** (non-decreasing from left to right):

- Use a stack to maintain indices with increasing heights
- When we see a smaller maxHeight, it limits all previous taller towers
- The stack helps us efficiently find the last position that's not limited by current maxHeight

**For right[i]** (non-increasing from right to left):

- Similar logic but scanning from right to left
- When we see a smaller maxHeight, it limits all following towers

Once we have `left` and `right` arrays:

- For any position `i` as peak, the total height sum = `left[i] + right[i] - maxHeights[i]`
- We subtract `maxHeights[i]` because it's counted in both `left[i]` and `right[i]`
- The answer is the maximum of these sums across all `i`

## Optimal Solution

Here's the complete solution using monotonic stacks:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSumOfHeights(maxHeights):
    n = len(maxHeights)

    # left[i] = max sum of heights from 0 to i with non-decreasing heights
    left = [0] * n
    # stack stores indices with increasing maxHeights values
    stack = []

    # Calculate left array
    for i in range(n):
        # While current maxHeight is smaller than stack top's maxHeight,
        # we need to pop because current height limits previous towers
        while stack and maxHeights[i] < maxHeights[stack[-1]]:
            stack.pop()

        if not stack:
            # If stack is empty, all towers from 0 to i can be at most maxHeights[i]
            # Sum = (i + 1) * maxHeights[i]
            left[i] = (i + 1) * maxHeights[i]
        else:
            # Last index that's not limited by current maxHeight
            last_idx = stack[-1]
            # Towers from last_idx+1 to i are limited to maxHeights[i]
            # Add left[last_idx] for towers 0 to last_idx
            left[i] = left[last_idx] + (i - last_idx) * maxHeights[i]

        stack.append(i)

    # right[i] = max sum of heights from i to n-1 with non-increasing heights
    right = [0] * n
    stack.clear()

    # Calculate right array (scan from right to left)
    for i in range(n - 1, -1, -1):
        # Similar logic but for non-increasing heights
        while stack and maxHeights[i] < maxHeights[stack[-1]]:
            stack.pop()

        if not stack:
            # All towers from i to n-1 can be at most maxHeights[i]
            right[i] = (n - i) * maxHeights[i]
        else:
            last_idx = stack[-1]
            # Towers from i to last_idx-1 are limited to maxHeights[i]
            right[i] = right[last_idx] + (last_idx - i) * maxHeights[i]

        stack.append(i)

    # Find maximum total height sum
    max_sum = 0
    for i in range(n):
        # For peak at i: left[i] + right[i] - maxHeights[i]
        # Subtract maxHeights[i] because it's counted twice
        total = left[i] + right[i] - maxHeights[i]
        max_sum = max(max_sum, total)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSumOfHeights(maxHeights) {
  const n = maxHeights.length;

  // left[i] = max sum of heights from 0 to i with non-decreasing heights
  const left = new Array(n).fill(0);
  // stack stores indices with increasing maxHeights values
  const stack = [];

  // Calculate left array
  for (let i = 0; i < n; i++) {
    // While current maxHeight is smaller than stack top's maxHeight,
    // we need to pop because current height limits previous towers
    while (stack.length > 0 && maxHeights[i] < maxHeights[stack[stack.length - 1]]) {
      stack.pop();
    }

    if (stack.length === 0) {
      // If stack is empty, all towers from 0 to i can be at most maxHeights[i]
      left[i] = (i + 1) * maxHeights[i];
    } else {
      // Last index that's not limited by current maxHeight
      const lastIdx = stack[stack.length - 1];
      // Towers from lastIdx+1 to i are limited to maxHeights[i]
      left[i] = left[lastIdx] + (i - lastIdx) * maxHeights[i];
    }

    stack.push(i);
  }

  // right[i] = max sum of heights from i to n-1 with non-increasing heights
  const right = new Array(n).fill(0);
  stack.length = 0; // Clear stack

  // Calculate right array (scan from right to left)
  for (let i = n - 1; i >= 0; i--) {
    // Similar logic but for non-increasing heights
    while (stack.length > 0 && maxHeights[i] < maxHeights[stack[stack.length - 1]]) {
      stack.pop();
    }

    if (stack.length === 0) {
      // All towers from i to n-1 can be at most maxHeights[i]
      right[i] = (n - i) * maxHeights[i];
    } else {
      const lastIdx = stack[stack.length - 1];
      // Towers from i to lastIdx-1 are limited to maxHeights[i]
      right[i] = right[lastIdx] + (lastIdx - i) * maxHeights[i];
    }

    stack.push(i);
  }

  // Find maximum total height sum
  let maxSum = 0;
  for (let i = 0; i < n; i++) {
    // For peak at i: left[i] + right[i] - maxHeights[i]
    const total = left[i] + right[i] - maxHeights[i];
    maxSum = Math.max(maxSum, total);
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long maximumSumOfHeights(List<Integer> maxHeights) {
        int n = maxHeights.size();

        // left[i] = max sum of heights from 0 to i with non-decreasing heights
        long[] left = new long[n];
        // stack stores indices with increasing maxHeights values
        Deque<Integer> stack = new ArrayDeque<>();

        // Calculate left array
        for (int i = 0; i < n; i++) {
            int currentHeight = maxHeights.get(i);

            // While current maxHeight is smaller than stack top's maxHeight,
            // we need to pop because current height limits previous towers
            while (!stack.isEmpty() && currentHeight < maxHeights.get(stack.peek())) {
                stack.pop();
            }

            if (stack.isEmpty()) {
                // If stack is empty, all towers from 0 to i can be at most maxHeights[i]
                left[i] = (long)(i + 1) * currentHeight;
            } else {
                // Last index that's not limited by current maxHeight
                int lastIdx = stack.peek();
                // Towers from lastIdx+1 to i are limited to maxHeights[i]
                left[i] = left[lastIdx] + (long)(i - lastIdx) * currentHeight;
            }

            stack.push(i);
        }

        // right[i] = max sum of heights from i to n-1 with non-increasing heights
        long[] right = new long[n];
        stack.clear();

        // Calculate right array (scan from right to left)
        for (int i = n - 1; i >= 0; i--) {
            int currentHeight = maxHeights.get(i);

            // Similar logic but for non-increasing heights
            while (!stack.isEmpty() && currentHeight < maxHeights.get(stack.peek())) {
                stack.pop();
            }

            if (stack.isEmpty()) {
                // All towers from i to n-1 can be at most maxHeights[i]
                right[i] = (long)(n - i) * currentHeight;
            } else {
                int lastIdx = stack.peek();
                // Towers from i to lastIdx-1 are limited to maxHeights[i]
                right[i] = right[lastIdx] + (long)(lastIdx - i) * currentHeight;
            }

            stack.push(i);
        }

        // Find maximum total height sum
        long maxSum = 0;
        for (int i = 0; i < n; i++) {
            // For peak at i: left[i] + right[i] - maxHeights[i]
            long total = left[i] + right[i] - maxHeights.get(i);
            maxSum = Math.max(maxSum, total);
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one left-to-right and one right-to-left
- Each element is pushed and popped from the stack at most once, so total stack operations are O(n)
- The final pass to find maximum sum is O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store three arrays of size n: `left`, `right`, and `maxHeights`
- The stack can contain up to n elements in worst case
- Total: O(n) for arrays + O(n) for stack = O(n)

## Common Mistakes

1. **Forgetting to subtract the peak height**: When calculating `left[i] + right[i]`, the peak height at position `i` is included in both `left[i]` and `right[i]`. Failing to subtract it leads to double-counting.

2. **Incorrect stack logic for right array**: When computing the right array from right to left, it's easy to get the indices wrong. Remember that for non-increasing heights scanning right-to-left, the logic is symmetric but with adjusted index calculations.

3. **Using int instead of long for large sums**: The sum of heights can be up to n × maxHeight, which for n=10⁵ and maxHeight=10⁹ gives 10¹⁴, far beyond 32-bit integer range. Always use 64-bit integers (long in Java/C++, long long in C).

4. **Not handling empty stack case**: When the stack becomes empty, it means all previous towers are limited by the current maxHeight. The formula changes from referencing a previous `left[last_idx]` to simply using `(i + 1) * maxHeights[i]`.

## When You'll See This Pattern

This monotonic stack pattern appears in problems where you need to find the nearest smaller/larger element or compute constrained sums:

1. **Largest Rectangle in Histogram (Hard)**: Uses monotonic stack to find the maximum area rectangle under a histogram, similar to how we find constrained height sums here.

2. **Trapping Rain Water (Hard)**: Uses precomputed left and right maximums to determine how much water can be trapped at each position.

3. **Sum of Subarray Minimums (Medium)**: Uses monotonic stack to find the contribution of each element as the minimum in subarrays, similar to how we compute constrained sums here.

The common theme is using a stack to efficiently find boundaries where a constraint (minimum, maximum, or limit) applies.

## Key Takeaways

1. **Monotonic stacks excel at "next/previous smaller/larger" problems**: When you need to find boundaries where a constraint changes, a monotonic stack often provides an O(n) solution instead of O(n²).

2. **Precomputation enables O(n) solutions**: By computing `left` and `right` arrays separately, we can evaluate each potential peak in O(1) time instead of recalculating everything.

3. **Symmetry in mountain array problems**: For mountain-shaped constraints, the solution often involves computing left and right passes with symmetric logic, then combining results.

Related problems: [Minimum Number of Removals to Make Mountain Array](/problem/minimum-number-of-removals-to-make-mountain-array), [Maximum Number of Books You Can Take](/problem/maximum-number-of-books-you-can-take)
