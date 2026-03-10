---
title: "How to Solve Longest Non-Decreasing Subarray After Replacing at Most One Element — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Non-Decreasing Subarray After Replacing at Most One Element. Medium difficulty, 21.5% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-02-22"
category: "dsa-patterns"
tags:
  [
    "longest-non-decreasing-subarray-after-replacing-at-most-one-element",
    "array",
    "dynamic-programming",
    "medium",
  ]
---

## How to Solve Longest Non-Decreasing Subarray After Replacing at Most One Element

This problem asks us to find the longest subarray that is non-decreasing (each element ≤ the next) after we're allowed to change at most one element to any value. What makes this tricky is that the replacement can be anywhere in the subarray, and we need to consider how a single "break" in the non-decreasing sequence can be fixed by either modifying the current element, the previous one, or potentially "bridging" across multiple elements.

## Visual Walkthrough

Let's trace through `nums = [4, 2, 3, 3, 2, 5]` step by step:

We'll maintain two key pieces of information as we scan left to right:

1. `left[i]`: Length of non-decreasing subarray ending at index `i`
2. `right[i]`: Length of non-decreasing subarray starting at index `i`

**Step 1: Build left array**

- `i=0`: `left[0] = 1` (single element)
- `i=1`: `2 < 4` → break → `left[1] = 1`
- `i=2`: `3 ≥ 2` → `left[2] = left[1] + 1 = 2`
- `i=3`: `3 ≥ 3` → `left[3] = left[2] + 1 = 3`
- `i=4`: `2 < 3` → break → `left[4] = 1`
- `i=5`: `5 ≥ 2` → `left[5] = left[4] + 1 = 2`

**Step 2: Build right array** (scan right to left)

- `i=5`: `right[5] = 1`
- `i=4`: `2 < 5` → `right[4] = 1`
- `i=3`: `3 > 2` → break → `right[3] = 1`
- `i=2`: `3 ≥ 3` → `right[2] = right[3] + 1 = 2`
- `i=1`: `2 < 3` → break → `right[1] = 1`
- `i=0`: `4 > 2` → break → `right[0] = 1`

**Step 3: Consider replacements**
For each position `i`, we check if we can connect `left[i-1]` and `right[i+1]` by replacing `nums[i]`:

- `i=1`: Replace `nums[1]=2` with value between `nums[0]=4` and `nums[2]=3`? Impossible since `4 > 3`
- `i=2`: Replace `nums[2]=3` between `nums[1]=2` and `nums[3]=3` → `left[1] + 1 + right[3] = 1 + 1 + 1 = 3`
- `i=3`: Replace `nums[3]=3` between `nums[2]=3` and `nums[4]=2`? Impossible since `3 > 2`
- `i=4`: Replace `nums[4]=2` between `nums[3]=3` and `nums[5]=5` → `left[3] + 1 + right[5] = 3 + 1 + 1 = 5`

The maximum is 5, which we get by replacing the 2 at index 4 with a value between 3 and 5 (like 4), giving us `[2, 3, 3, 4, 5]`.

## Brute Force Approach

A naive approach would be to try replacing every element with every possible value and checking the resulting longest non-decreasing subarray. For each of n positions, we could try replacing with n different values, and for each replacement, scan the array in O(n) time to find the longest non-decreasing subarray. This gives O(n³) time complexity, which is far too slow for typical constraints (n up to 10⁵).

Even a slightly better brute force would be O(n²): for each possible subarray, check if it can be made non-decreasing with at most one replacement. We'd need to check O(n²) subarrays, and checking each one takes O(n) time.

## Optimized Approach

The key insight is that we can precompute for each position:

1. How long a non-decreasing sequence ends at that position
2. How long a non-decreasing sequence starts at that position

With these precomputations, we can evaluate in O(1) time whether replacing an element at position `i` can connect the sequence ending at `i-1` with the sequence starting at `i+1`.

The condition for connecting is: `nums[i-1] ≤ nums[i+1]`. If this holds, we can replace `nums[i]` with a value between `nums[i-1]` and `nums[i+1]` to bridge the two sequences.

We also need to consider cases where we don't use the replacement at all (just take the longest existing non-decreasing subarray) and cases where we use the replacement at the beginning or end of the array.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestNonDecreasingSubarray(nums):
    """
    Returns the length of the longest non-decreasing subarray
    after at most one element replacement.
    """
    n = len(nums)
    if n <= 1:
        return n

    # left[i] = length of non-decreasing subarray ending at i
    left = [1] * n
    for i in range(1, n):
        if nums[i] >= nums[i - 1]:
            left[i] = left[i - 1] + 1

    # right[i] = length of non-decreasing subarray starting at i
    right = [1] * n
    for i in range(n - 2, -1, -1):
        if nums[i] <= nums[i + 1]:
            right[i] = right[i + 1] + 1

    # Initialize answer with the longest existing non-decreasing subarray
    # (case: we don't use the replacement)
    ans = max(left)

    # Try using the replacement at each position
    for i in range(n):
        # Case 1: Replace element at position i to connect left[i-1] and right[i+1]
        if i > 0 and i < n - 1 and nums[i - 1] <= nums[i + 1]:
            # We can bridge the gap by replacing nums[i]
            ans = max(ans, left[i - 1] + 1 + right[i + 1])

        # Case 2: Replace the first element (i=0)
        if i == 0 and n > 1:
            # We can extend the sequence starting at index 1
            ans = max(ans, 1 + right[1])

        # Case 3: Replace the last element (i=n-1)
        if i == n - 1 and n > 1:
            # We can extend the sequence ending at index n-2
            ans = max(ans, left[n - 2] + 1)

    return ans
```

```javascript
// Time: O(n) | Space: O(n)
function longestNonDecreasingSubarray(nums) {
  const n = nums.length;
  if (n <= 1) return n;

  // left[i] = length of non-decreasing subarray ending at i
  const left = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    if (nums[i] >= nums[i - 1]) {
      left[i] = left[i - 1] + 1;
    }
  }

  // right[i] = length of non-decreasing subarray starting at i
  const right = new Array(n).fill(1);
  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] <= nums[i + 1]) {
      right[i] = right[i + 1] + 1;
    }
  }

  // Case: longest existing subarray without replacement
  let ans = Math.max(...left);

  // Try using replacement at each position
  for (let i = 0; i < n; i++) {
    // Case 1: Replace middle element to bridge two sequences
    if (i > 0 && i < n - 1 && nums[i - 1] <= nums[i + 1]) {
      ans = Math.max(ans, left[i - 1] + 1 + right[i + 1]);
    }

    // Case 2: Replace first element
    if (i === 0 && n > 1) {
      ans = Math.max(ans, 1 + right[1]);
    }

    // Case 3: Replace last element
    if (i === n - 1 && n > 1) {
      ans = Math.max(ans, left[n - 2] + 1);
    }
  }

  return ans;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int longestNonDecreasingSubarray(int[] nums) {
        int n = nums.length;
        if (n <= 1) return n;

        // left[i] = length of non-decreasing subarray ending at i
        int[] left = new int[n];
        left[0] = 1;
        for (int i = 1; i < n; i++) {
            if (nums[i] >= nums[i - 1]) {
                left[i] = left[i - 1] + 1;
            } else {
                left[i] = 1;
            }
        }

        // right[i] = length of non-decreasing subarray starting at i
        int[] right = new int[n];
        right[n - 1] = 1;
        for (int i = n - 2; i >= 0; i--) {
            if (nums[i] <= nums[i + 1]) {
                right[i] = right[i + 1] + 1;
            } else {
                right[i] = 1;
            }
        }

        // Case: longest existing subarray without replacement
        int ans = 0;
        for (int val : left) {
            ans = Math.max(ans, val);
        }

        // Try using replacement at each position
        for (int i = 0; i < n; i++) {
            // Case 1: Replace middle element to bridge two sequences
            if (i > 0 && i < n - 1 && nums[i - 1] <= nums[i + 1]) {
                ans = Math.max(ans, left[i - 1] + 1 + right[i + 1]);
            }

            // Case 2: Replace first element
            if (i == 0 && n > 1) {
                ans = Math.max(ans, 1 + right[1]);
            }

            // Case 3: Replace last element
            if (i == n - 1 && n > 1) {
                ans = Math.max(ans, left[n - 2] + 1);
            }
        }

        return ans;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make three passes through the array: one to build `left`, one to build `right`, and one to try replacements at each position.
- Each pass does O(1) work per element, giving O(3n) = O(n).

**Space Complexity:** O(n)

- We store two auxiliary arrays `left` and `right`, each of size n.
- This is necessary for the O(1) bridge checking. We could optimize to O(1) space by computing on the fly, but it would complicate the code significantly.

## Common Mistakes

1. **Forgetting edge cases with first/last elements:** Candidates often only check the bridging case (`i > 0 && i < n-1`) but forget that we can also replace the first or last element. These need separate handling.

2. **Incorrect bridging condition:** The condition to bridge is `nums[i-1] ≤ nums[i+1]`, not `nums[i-1] < nums[i+1]`. If they're equal, we can replace `nums[i]` with that same value.

3. **Not considering the "no replacement" case:** The longest subarray might already be non-decreasing without any replacements. Always initialize `ans` with `max(left)`.

4. **Off-by-one errors in array indices:** When accessing `left[i-1]` and `right[i+1]`, ensure `i-1 ≥ 0` and `i+1 < n`. This is why we have separate cases for first and last elements.

## When You'll See This Pattern

This "precompute left/right arrays then try bridging" pattern appears in several array manipulation problems:

1. **Longest Mountain in Array (LeetCode 845)** - Uses similar left/right arrays to find peaks where sequences increase then decrease.

2. **Maximum Product Subarray (LeetCode 152)** - Maintains both max and min products ending at each position to handle negative numbers.

3. **Trapping Rain Water (LeetCode 42)** - Precomputes leftMax and rightMax arrays to determine water height at each position.

The core idea is to break a complex condition into simpler one-directional computations that can be combined later.

## Key Takeaways

1. **Break bidirectional problems into unidirectional computations:** When you need to consider both sides of an element, precompute "ending at" and "starting from" arrays.

2. **Replacement problems often involve "bridging":** When allowed to change one element, look for places where changing that element can connect two valid segments.

3. **Always handle edge cases explicitly:** First/last elements, empty/single-element arrays, and equal values often need special attention in array problems.

[Practice this problem on CodeJeet](/problem/longest-non-decreasing-subarray-after-replacing-at-most-one-element)
