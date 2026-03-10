---
title: "How to Solve Longest Mountain in Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Mountain in Array. Medium difficulty, 41.9% acceptance rate. Topics: Array, Two Pointers, Dynamic Programming, Enumeration."
date: "2026-02-13"
category: "dsa-patterns"
tags: ["longest-mountain-in-array", "array", "two-pointers", "dynamic-programming", "medium"]
---

# How to Solve Longest Mountain in Array

This problem asks us to find the length of the longest _mountain_ subarray in a given array. A mountain is defined as a sequence that strictly increases to a peak, then strictly decreases. The tricky part is that mountains can start and end anywhere, and we need to efficiently scan through the array to identify all possible mountain formations without missing any.

## Visual Walkthrough

Let's trace through an example: `arr = [2,1,4,7,3,2,5]`

We need to find the longest contiguous subarray that forms a mountain. Let's walk through step-by-step:

1. **Index 0-1**: `[2,1]` - Decreasing immediately, not a mountain (needs increase first)
2. **Index 1-4**: `[1,4,7,3]` - Increases to 7, then decreases to 3. This is a mountain of length 4.
3. **Index 2-5**: `[4,7,3,2]` - Increases to 7, then decreases. Length 4.
4. **Index 3-6**: `[7,3,2,5]` - Starts decreasing, then increases at the end. Not a valid mountain.
5. **Index 4-6**: `[3,2,5]` - Decreasing then increasing. Not a valid mountain.

The longest mountain we found is length 4. But wait, let's check if we missed any:

- What about `[1,4,7,3,2]`? That's actually length 5! Let's examine indices 1-5: `[1,4,7,3,2]` - Increases to 7, then decreases to 2. Yes, this is a mountain of length 5.

So the correct answer is 5. This shows why we need a systematic approach - it's easy to miss mountains when scanning visually.

## Brute Force Approach

A naive approach would be to check every possible subarray to see if it forms a mountain:

1. For every starting index `i` from 0 to n-3 (need at least 3 elements for a mountain)
2. For every ending index `j` from i+2 to n-1
3. Check if the subarray `arr[i..j]` forms a mountain by:
   - Finding the peak (maximum element)
   - Verifying all elements before the peak are strictly increasing
   - Verifying all elements after the peak are strictly decreasing

This approach has O(n³) time complexity (O(n²) subarrays × O(n) to check each one), which is far too slow for typical constraints (n up to 10⁴).

Even an optimized brute force that tries to extend mountains from each possible peak would be O(n²) in worst case, which might still be too slow.

## Optimized Approach

The key insight is that we don't need to check every possible subarray. Instead, we can use a **two-pointer** approach that scans through the array once, identifying potential mountains as we go.

Here's the step-by-step reasoning:

1. **Mountain structure**: Every mountain has three parts:
   - An **upslope** (strictly increasing sequence)
   - A **peak** (the highest point)
   - A **downslope** (strictly decreasing sequence)

2. **Finding mountains efficiently**: Instead of checking all subarrays, we can:
   - Start at index 1 (since we need at least one element before for the upslope)
   - Look for peaks: an element is a peak if `arr[i-1] < arr[i] > arr[i+1]`
   - From each peak, expand left to find the start of the upslope
   - From each peak, expand right to find the end of the downslope
   - Calculate the mountain length: `(peak - start) + (end - peak) + 1`

3. **Optimization**: We can do this in a single pass by keeping track of the current state:
   - Are we in an upslope?
   - Have we found a peak?
   - Are we in a downslope?

4. **Alternative approach**: Use two passes to precompute:
   - `up[i]`: length of increasing sequence ending at i
   - `down[i]`: length of decreasing sequence starting at i
   - Then for each index where both `up[i] > 1` and `down[i] > 1`, we have a mountain of length `up[i] + down[i] - 1`

The two-pass approach is cleaner and easier to implement correctly, so we'll use that for our solution.

## Optimal Solution

We'll implement the two-pass approach with dynamic programming:

1. First pass (left to right): Calculate `up[i]` = how many consecutive increasing elements end at i
2. Second pass (right to left): Calculate `down[i]` = how many consecutive decreasing elements start at i
3. For each index i, if both `up[i] > 1` and `down[i] > 1`, then i is a peak of a mountain with length `up[i] + down[i] - 1`
4. Track the maximum such length

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestMountain(arr):
    """
    Find the length of the longest mountain subarray.

    Approach: Use two passes to compute increasing sequences ending at each index
    and decreasing sequences starting at each index. A mountain exists at index i
    if there's an increasing sequence before i and decreasing sequence after i.
    """
    n = len(arr)
    if n < 3:
        return 0  # Need at least 3 elements for a mountain

    # Step 1: Compute increasing sequences ending at each index
    up = [0] * n
    for i in range(1, n):
        if arr[i] > arr[i - 1]:
            up[i] = up[i - 1] + 1
        else:
            up[i] = 0

    # Step 2: Compute decreasing sequences starting at each index
    down = [0] * n
    for i in range(n - 2, -1, -1):
        if arr[i] > arr[i + 1]:
            down[i] = down[i + 1] + 1
        else:
            down[i] = 0

    # Step 3: Find the longest mountain
    max_length = 0
    for i in range(n):
        # A mountain requires both upslope and downslope
        if up[i] > 0 and down[i] > 0:
            # Mountain length = upslope + downslope + peak
            length = up[i] + down[i] + 1
            max_length = max(max_length, length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function longestMountain(arr) {
  /**
   * Find the length of the longest mountain subarray.
   *
   * Approach: Use two passes to compute increasing sequences ending at each index
   * and decreasing sequences starting at each index. A mountain exists at index i
   * if there's an increasing sequence before i and decreasing sequence after i.
   */
  const n = arr.length;
  if (n < 3) {
    return 0; // Need at least 3 elements for a mountain
  }

  // Step 1: Compute increasing sequences ending at each index
  const up = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    if (arr[i] > arr[i - 1]) {
      up[i] = up[i - 1] + 1;
    } else {
      up[i] = 0;
    }
  }

  // Step 2: Compute decreasing sequences starting at each index
  const down = new Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    if (arr[i] > arr[i + 1]) {
      down[i] = down[i + 1] + 1;
    } else {
      down[i] = 0;
    }
  }

  // Step 3: Find the longest mountain
  let maxLength = 0;
  for (let i = 0; i < n; i++) {
    // A mountain requires both upslope and downslope
    if (up[i] > 0 && down[i] > 0) {
      // Mountain length = upslope + downslope + peak
      const length = up[i] + down[i] + 1;
      maxLength = Math.max(maxLength, length);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int longestMountain(int[] arr) {
        /**
         * Find the length of the longest mountain subarray.
         *
         * Approach: Use two passes to compute increasing sequences ending at each index
         * and decreasing sequences starting at each index. A mountain exists at index i
         * if there's an increasing sequence before i and decreasing sequence after i.
         */
        int n = arr.length;
        if (n < 3) {
            return 0;  // Need at least 3 elements for a mountain
        }

        // Step 1: Compute increasing sequences ending at each index
        int[] up = new int[n];
        for (int i = 1; i < n; i++) {
            if (arr[i] > arr[i - 1]) {
                up[i] = up[i - 1] + 1;
            } else {
                up[i] = 0;
            }
        }

        // Step 2: Compute decreasing sequences starting at each index
        int[] down = new int[n];
        for (int i = n - 2; i >= 0; i--) {
            if (arr[i] > arr[i + 1]) {
                down[i] = down[i + 1] + 1;
            } else {
                down[i] = 0;
            }
        }

        // Step 3: Find the longest mountain
        int maxLength = 0;
        for (int i = 0; i < n; i++) {
            // A mountain requires both upslope and downslope
            if (up[i] > 0 && down[i] > 0) {
                // Mountain length = upslope + downslope + peak
                int length = up[i] + down[i] + 1;
                maxLength = Math.max(maxLength, length);
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make three passes through the array:
  1. First pass to compute `up` array: O(n)
  2. Second pass to compute `down` array: O(n)
  3. Third pass to find maximum mountain length: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store two additional arrays `up` and `down`, each of size n
- Total: O(2n) = O(n)
- Note: We could optimize to O(1) space by using a single-pass state machine approach, but the O(n) solution is clearer and easier to implement correctly in an interview.

## Common Mistakes

1. **Forgetting to check both sides of the peak**: A mountain requires BOTH an increasing sequence before the peak AND a decreasing sequence after the peak. Candidates often check only one side or count flat sequences (where arr[i] == arr[i+1]) as part of the mountain.

2. **Off-by-one errors in array bounds**: When checking `arr[i-1] < arr[i] > arr[i+1]`, you must ensure `i` is between 1 and n-2. Accessing `arr[-1]` or `arr[n]` will cause index errors.

3. **Counting plateaus as mountains**: The problem specifies _strictly_ increasing and decreasing sequences. If `arr[i] == arr[i+1]`, the sequence breaks. Many candidates miss the "strictly" requirement.

4. **Not handling edge cases**:
   - Arrays with fewer than 3 elements (should return 0)
   - Arrays with no mountains (should return 0)
   - Arrays that are entirely increasing or decreasing (no peaks, should return 0)

## When You'll See This Pattern

This problem uses a pattern of **precomputing prefix/suffix information** to solve problems efficiently. You'll see similar patterns in:

1. **Trapping Rain Water (Hard)**: Precompute leftMax and rightMax arrays to determine how much water can be trapped at each position.

2. **Product of Array Except Self (Medium)**: Precompute prefix and suffix products to calculate the product of all elements except the current one.

3. **Maximum Subarray (Easy)**: While not exactly the same, it uses a similar idea of tracking running information (Kadane's algorithm).

The core idea is: when you need information about both what comes before and after each element, consider computing it in separate passes rather than trying to do everything in one complex pass.

## Key Takeaways

1. **Break complex patterns into simpler components**: Instead of trying to identify mountains in one pass, break them into increasing and decreasing sequences that can be computed separately.

2. **Precomputation is powerful**: When you need information about both sides of each element, consider computing left-to-right and right-to-left passes to gather that information.

3. **Strict monotonicity matters**: Pay close attention to whether sequences need to be strictly increasing/decreasing or if equality is allowed. This often determines whether you use `>` or `>=` in comparisons.

Related problems: [Minimum Number of Removals to Make Mountain Array](/problem/minimum-number-of-removals-to-make-mountain-array), [Find Good Days to Rob the Bank](/problem/find-good-days-to-rob-the-bank)
