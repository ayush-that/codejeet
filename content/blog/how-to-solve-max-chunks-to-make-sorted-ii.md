---
title: "How to Solve Max Chunks To Make Sorted II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Max Chunks To Make Sorted II. Hard difficulty, 54.7% acceptance rate. Topics: Array, Stack, Greedy, Sorting, Monotonic Stack."
date: "2027-09-23"
category: "dsa-patterns"
tags: ["max-chunks-to-make-sorted-ii", "array", "stack", "greedy", "hard"]
---

# How to Solve Max Chunks To Make Sorted II

This problem asks us to split an array into the maximum number of chunks where, after sorting each chunk individually and concatenating them, we get the fully sorted array. What makes this tricky is that unlike the easier version where values are a permutation of [0, n-1], here we can have duplicate values and arbitrary integers, which breaks the simple "value equals index" logic. The challenge is determining where to place partition boundaries while ensuring the global sorted order is preserved.

## Visual Walkthrough

Let's trace through `arr = [2, 1, 3, 4, 4]` step by step:

**Step 1:** We need to find positions where everything to the left is ≤ everything to the right when sorted. One way to think about this: if we know the maximum value seen so far from the left, and the minimum value remaining to the right, we can place a chunk boundary when `max_left ≤ min_right`.

**Step 2:** Precompute minimums from the right:

- Start from right: `min_right[4] = 4` (last element)
- `min_right[3] = min(4, 4) = 4`
- `min_right[2] = min(3, 4) = 3`
- `min_right[1] = min(1, 3) = 1`
- `min_right[0] = min(2, 1) = 1`

So `min_right = [1, 1, 3, 4, 4]`

**Step 3:** Scan from left, tracking maximum:

- i=0: `max_left = 2`, compare with `min_right[1] = 1`. Since 2 > 1, no chunk here.
- i=1: `max_left = max(2, 1) = 2`, compare with `min_right[2] = 3`. Now 2 ≤ 3, so we can place a chunk boundary after index 1. First chunk: [2, 1]
- i=2: `max_left = max(2, 3) = 3`, compare with `min_right[3] = 4`. 3 ≤ 4, boundary after index 2. Second chunk: [3]
- i=3: `max_left = max(3, 4) = 4`, compare with `min_right[4] = 4`. 4 ≤ 4, boundary after index 3. Third chunk: [4]
- i=4: At the end, we always have a boundary. Fourth chunk: [4]

Total chunks: 4. Each chunk when sorted and concatenated gives [1, 2, 3, 4, 4].

## Brute Force Approach

A naive approach would be to try all possible partition points. For each possible split position, we could:

1. Sort the left part
2. Sort the right part
3. Check if concatenating them gives the sorted array
4. Count the maximum number of valid splits

This requires checking 2^(n-1) possible split combinations in the worst case, which is exponential time. Even if we try each position individually, we'd need to sort both sides repeatedly, giving O(n² log n) time. This is clearly infeasible for larger arrays.

What makes the brute force fail is the repeated sorting and comparisons. We need a way to determine chunk boundaries without actually sorting.

## Optimized Approach

The key insight is that for a valid chunk boundary at index `i`, **the maximum value in arr[0..i] must be ≤ the minimum value in arr[i+1..n-1]**. This ensures that when we sort each chunk independently, all elements in the left chunk will be ≤ all elements in the right chunk in the final sorted array.

We can implement this with two passes:

1. **Right-to-left pass:** Compute `min_right[i]` = minimum value from `i` to the end
2. **Left-to-right pass:** Track `max_left`, and whenever `max_left ≤ min_right[i+1]`, we can place a chunk boundary

This gives us O(n) time with O(n) space. We can optimize further to O(1) space by tracking the maximum and using a stack, but the two-pass approach is more intuitive for interviews.

## Optimal Solution

Here's the two-pass solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxChunksToSorted(arr):
    n = len(arr)

    # Step 1: Precompute min_right array
    # min_right[i] = minimum value from i to the end
    min_right = [0] * n
    min_right[-1] = arr[-1]  # Last element's min is itself

    # Fill from right to left
    for i in range(n - 2, -1, -1):
        min_right[i] = min(arr[i], min_right[i + 1])

    # Step 2: Scan from left to right, tracking max_left
    max_left = arr[0]
    chunks = 0

    # We can place a chunk boundary after index i if:
    # max(arr[0..i]) <= min(arr[i+1..n-1])
    for i in range(n - 1):
        max_left = max(max_left, arr[i])

        # Check if we can split after index i
        if max_left <= min_right[i + 1]:
            chunks += 1

    # Always count the last chunk
    return chunks + 1
```

```javascript
// Time: O(n) | Space: O(n)
function maxChunksToSorted(arr) {
  const n = arr.length;

  // Step 1: Precompute minRight array
  // minRight[i] = minimum value from i to the end
  const minRight = new Array(n);
  minRight[n - 1] = arr[n - 1]; // Last element's min is itself

  // Fill from right to left
  for (let i = n - 2; i >= 0; i--) {
    minRight[i] = Math.min(arr[i], minRight[i + 1]);
  }

  // Step 2: Scan from left to right, tracking maxLeft
  let maxLeft = arr[0];
  let chunks = 0;

  // We can place a chunk boundary after index i if:
  // max(arr[0..i]) <= min(arr[i+1..n-1])
  for (let i = 0; i < n - 1; i++) {
    maxLeft = Math.max(maxLeft, arr[i]);

    // Check if we can split after index i
    if (maxLeft <= minRight[i + 1]) {
      chunks++;
    }
  }

  // Always count the last chunk
  return chunks + 1;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maxChunksToSorted(int[] arr) {
        int n = arr.length;

        // Step 1: Precompute minRight array
        // minRight[i] = minimum value from i to the end
        int[] minRight = new int[n];
        minRight[n - 1] = arr[n - 1];  // Last element's min is itself

        // Fill from right to left
        for (int i = n - 2; i >= 0; i--) {
            minRight[i] = Math.min(arr[i], minRight[i + 1]);
        }

        // Step 2: Scan from left to right, tracking maxLeft
        int maxLeft = arr[0];
        int chunks = 0;

        // We can place a chunk boundary after index i if:
        // max(arr[0..i]) <= min(arr[i+1..n-1])
        for (int i = 0; i < n - 1; i++) {
            maxLeft = Math.max(maxLeft, arr[i]);

            // Check if we can split after index i
            if (maxLeft <= minRight[i + 1]) {
                chunks++;
            }
        }

        // Always count the last chunk
        return chunks + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the array: one right-to-left to compute minimums, and one left-to-right to find chunk boundaries.
- Each pass does O(1) work per element, so total O(2n) = O(n).

**Space Complexity:** O(n)

- We store the `min_right` array of size n.
- We could optimize to O(1) space by using a stack-based approach, but the array approach is clearer and acceptable for interviews.

## Common Mistakes

1. **Forgetting the last chunk:** Many candidates forget to add `+1` at the end. Remember that we're counting boundaries between elements, but we need to count the chunks themselves. If we find `k` boundaries, we have `k+1` chunks.

2. **Off-by-one with indices:** When comparing `max_left` with `min_right[i+1]`, it's easy to compare with `min_right[i]` instead. The condition checks elements to the right of the potential boundary, so we need the minimum starting from `i+1`.

3. **Not handling duplicates correctly:** With duplicates, the condition uses `≤` not `<`. If `max_left == min_right[i+1]`, we can still place a boundary because equal values can go in either chunk.

4. **Confusing with the easier version:** In "Max Chunks To Make Sorted" (the medium version), values are a permutation of [0, n-1], allowing a simpler solution. Don't try to apply that logic here where values can be arbitrary and have duplicates.

## When You'll See This Pattern

This "prefix max vs suffix min" pattern appears in problems where we need to find partition points based on local vs global constraints:

1. **Partition Labels (LeetCode 763):** Similar idea of finding partitions where all characters in a chunk don't appear outside it. Instead of max/min, we track last occurrence indices.

2. **Product of Array Except Self (LeetCode 238):** Uses prefix and suffix products, similar to our prefix max and suffix min.

3. **Trapping Rain Water (LeetCode 42):** Uses left max and right min (in the form of left max and right max heights) to determine water capacity at each position.

The core pattern is: when you need to make decisions based on what's to the left vs what's to the right, precomputing suffix information often helps.

## Key Takeaways

1. **The chunk boundary condition:** A valid chunk boundary exists where `max(prefix) ≤ min(suffix)`. This ensures all elements in the left chunk are ≤ all elements in the right chunk when sorted.

2. **Two-pass technique:** When you need information from both sides of an element, consider making one pass from the right to compute suffix information, then a pass from the left to make decisions.

3. **Think in terms of invariants:** Instead of trying to sort or simulate, identify the mathematical condition that must hold true at partition points. This often leads to more efficient solutions than brute force simulation.

Related problems: [Max Chunks To Make Sorted](/problem/max-chunks-to-make-sorted)
