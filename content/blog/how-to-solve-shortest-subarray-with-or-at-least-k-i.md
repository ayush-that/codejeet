---
title: "How to Solve Shortest Subarray With OR at Least K I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Shortest Subarray With OR at Least K I. Easy difficulty, 44.2% acceptance rate. Topics: Array, Bit Manipulation, Sliding Window."
date: "2028-12-09"
category: "dsa-patterns"
tags:
  ["shortest-subarray-with-or-at-least-k-i", "array", "bit-manipulation", "sliding-window", "easy"]
---

# How to Solve Shortest Subarray With OR at Least K I

This problem asks us to find the shortest non-empty subarray where the bitwise OR of all its elements is at least `k`. While it might seem similar to classic sliding window problems like "Minimum Size Subarray Sum," the non-monotonic nature of bitwise OR makes it trickier. Unlike sums that only increase when we add elements, OR values can stay the same or even decrease when we remove elements, which breaks the standard sliding window approach.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 4]` and `k = 6`.

**Step 1:** We need to find subarrays where OR ≥ 6. Let's check all possible subarrays:

- `[1]`: OR = 1 (1 < 6)
- `[2]`: OR = 2 (2 < 6)
- `[4]`: OR = 4 (4 < 6)
- `[1, 2]`: OR = 1 | 2 = 3 (3 < 6)
- `[2, 4]`: OR = 2 | 4 = 6 (6 ≥ 6) ✓ Length = 2
- `[1, 2, 4]`: OR = 1 | 2 | 4 = 7 (7 ≥ 6) ✓ Length = 3

The shortest special subarray is `[2, 4]` with length 2.

**Key Insight:** The OR operation has an important property: `a | b ≥ max(a, b)`. This means OR values are non-decreasing as we extend a subarray to the right. However, when we shrink from the left, the OR can decrease unpredictably. This is why we need a different approach than standard sliding window.

## Brute Force Approach

The most straightforward solution is to check every possible subarray:

1. Generate all possible starting indices `i` from 0 to n-1
2. For each starting index, generate all ending indices `j` from i to n-1
3. Compute the OR of elements from i to j
4. If OR ≥ k, update the minimum length

**Why this fails:** For an array of length `n`, there are O(n²) subarrays. Computing OR for each subarray from scratch would be O(n³) if done naively, or O(n²) if we compute incrementally. Even with incremental computation, O(n²) is too slow for constraints where n can be up to 10⁵.

## Optimal Solution

The key observation is that for any starting index `i`, as we move `j` to the right, the OR value is non-decreasing. This means for each `i`, we can binary search for the smallest `j` where the subarray `[i, j]` has OR ≥ k.

However, we need an efficient way to compute OR for any range `[i, j]`. We can use prefix OR arrays with a trick: OR is not invertible like sum, so we can't simply do `prefix[j] - prefix[i-1]`. Instead, we need to precompute for each bit position.

**Approach:**

1. For each bit position (0 to 31 for 32-bit integers), compute prefix counts
2. For any range `[i, j]`, we can check if a bit is set by seeing if the count increased in that range
3. For each starting index `i`, binary search for the smallest `j` where OR ≥ k
4. Track the minimum length found

<div class="code-group">

```python
# Time: O(n log n * B) where B = 32 bits | Space: O(n * B)
def minimumSubarrayLength(nums, k):
    n = len(nums)
    if k == 0:
        return 1  # Any single element has OR >= 0

    # Precompute prefix bit counts
    # prefix[b][i] = count of numbers up to index i-1 that have bit b set
    prefix = [[0] * (n + 1) for _ in range(32)]

    for b in range(32):
        for i in range(n):
            # Check if bit b is set in nums[i]
            if nums[i] & (1 << b):
                prefix[b][i + 1] = prefix[b][i] + 1
            else:
                prefix[b][i + 1] = prefix[b][i]

    min_len = float('inf')

    # For each starting index
    for i in range(n):
        left, right = i, n - 1
        best_j = -1

        # Binary search for the smallest j where OR[i..j] >= k
        while left <= right:
            mid = (left + right) // 2

            # Compute OR of nums[i..mid]
            or_val = 0
            for b in range(32):
                # If count increased in range [i, mid], this bit is set
                if prefix[b][mid + 1] - prefix[b][i] > 0:
                    or_val |= (1 << b)

            if or_val >= k:
                best_j = mid
                right = mid - 1  # Try to find smaller j
            else:
                left = mid + 1  # Need to extend to the right

        # If we found a valid j, update min_len
        if best_j != -1:
            min_len = min(min_len, best_j - i + 1)

    return min_len if min_len != float('inf') else -1
```

```javascript
// Time: O(n log n * 32) | Space: O(n * 32)
function minimumSubarrayLength(nums, k) {
  const n = nums.length;
  if (k === 0) return 1; // Any single element has OR >= 0

  // Precompute prefix bit counts
  // prefix[b][i] = count of numbers up to index i-1 that have bit b set
  const prefix = Array.from({ length: 32 }, () => new Array(n + 1).fill(0));

  for (let b = 0; b < 32; b++) {
    for (let i = 0; i < n; i++) {
      // Check if bit b is set in nums[i]
      if (nums[i] & (1 << b)) {
        prefix[b][i + 1] = prefix[b][i] + 1;
      } else {
        prefix[b][i + 1] = prefix[b][i];
      }
    }
  }

  let minLen = Infinity;

  // For each starting index
  for (let i = 0; i < n; i++) {
    let left = i,
      right = n - 1;
    let bestJ = -1;

    // Binary search for the smallest j where OR[i..j] >= k
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      // Compute OR of nums[i..mid]
      let orVal = 0;
      for (let b = 0; b < 32; b++) {
        // If count increased in range [i, mid], this bit is set
        if (prefix[b][mid + 1] - prefix[b][i] > 0) {
          orVal |= 1 << b;
        }
      }

      if (orVal >= k) {
        bestJ = mid;
        right = mid - 1; // Try to find smaller j
      } else {
        left = mid + 1; // Need to extend to the right
      }
    }

    // If we found a valid j, update minLen
    if (bestJ !== -1) {
      minLen = Math.min(minLen, bestJ - i + 1);
    }
  }

  return minLen !== Infinity ? minLen : -1;
}
```

```java
// Time: O(n log n * 32) | Space: O(n * 32)
class Solution {
    public int minimumSubarrayLength(int[] nums, int k) {
        int n = nums.length;
        if (k == 0) return 1; // Any single element has OR >= 0

        // Precompute prefix bit counts
        // prefix[b][i] = count of numbers up to index i-1 that have bit b set
        int[][] prefix = new int[32][n + 1];

        for (int b = 0; b < 32; b++) {
            for (int i = 0; i < n; i++) {
                // Check if bit b is set in nums[i]
                if ((nums[i] & (1 << b)) != 0) {
                    prefix[b][i + 1] = prefix[b][i] + 1;
                } else {
                    prefix[b][i + 1] = prefix[b][i];
                }
            }
        }

        int minLen = Integer.MAX_VALUE;

        // For each starting index
        for (int i = 0; i < n; i++) {
            int left = i, right = n - 1;
            int bestJ = -1;

            // Binary search for the smallest j where OR[i..j] >= k
            while (left <= right) {
                int mid = left + (right - left) / 2;

                // Compute OR of nums[i..mid]
                int orVal = 0;
                for (int b = 0; b < 32; b++) {
                    // If count increased in range [i, mid], this bit is set
                    if (prefix[b][mid + 1] - prefix[b][i] > 0) {
                        orVal |= (1 << b);
                    }
                }

                if (orVal >= k) {
                    bestJ = mid;
                    right = mid - 1; // Try to find smaller j
                } else {
                    left = mid + 1; // Need to extend to the right
                }
            }

            // If we found a valid j, update minLen
            if (bestJ != -1) {
                minLen = Math.min(minLen, bestJ - i + 1);
            }
        }

        return minLen != Integer.MAX_VALUE ? minLen : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n \* B) where n is the length of `nums` and B = 32 (bits in an integer). We have:

- O(n \* B) to build the prefix arrays
- For each of n starting positions, we do O(log n) binary searches
- Each binary search evaluation takes O(B) to compute the OR value
- Total: O(n _ B + n _ log n _ B) = O(n log n _ B)

**Space Complexity:** O(n \* B) for storing the prefix bit counts. We need 32 arrays of length n+1.

## Common Mistakes

1. **Using standard sliding window:** The most common mistake is trying to apply the standard sliding window template. Unlike sums, OR is not monotonic when shrinking the window. Removing an element can cause the OR to decrease, making the window invalid again.

2. **Forgetting k = 0 edge case:** When k = 0, any non-empty subarray qualifies, so the answer should be 1 (shortest possible). Many candidates miss this optimization.

3. **Inefficient OR computation:** Recomputing OR from scratch for each subarray leads to O(n³) time. Even with incremental computation in brute force, it's still O(n²), which is too slow.

4. **Incorrect binary search boundaries:** When binary searching for the right endpoint j, ensure you're searching in the range [i, n-1], not [0, n-1]. Also, remember to handle the case where no valid j exists.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search on answer/endpoint:** When you need to find the minimum/maximum position satisfying a condition, and the condition is monotonic in one direction. Similar to:
   - "Minimum Size Subarray Sum" (but with sum instead of OR)
   - "Kth Smallest Element in a Sorted Matrix"

2. **Prefix arrays for range queries:** When you need to answer many range queries efficiently. Similar to:
   - "Range Sum Query - Immutable" (but with OR instead of sum)
   - "Counting Bits" patterns

3. **Bit manipulation with prefix counts:** When dealing with bitwise operations over ranges. Similar to:
   - "Bitwise ORs of Subarrays"
   - "Find the Subarray With Maximum XOR"

## Key Takeaways

1. **OR is monotonic only when extending right:** For a fixed left endpoint, OR values are non-decreasing as we extend to the right. This enables binary search but breaks standard sliding window.

2. **Prefix counts enable efficient range OR queries:** Since OR isn't invertible like sum, we need to track per-bit prefix counts to compute range OR in O(B) time.

3. **Binary search over endpoints is powerful:** When you can't use sliding window due to non-monotonic shrinkage, binary searching for each starting point often works if extension is monotonic.

Related problems: [Minimum Size Subarray Sum](/problem/minimum-size-subarray-sum), [Shortest Subarray with Sum at Least K](/problem/shortest-subarray-with-sum-at-least-k)
