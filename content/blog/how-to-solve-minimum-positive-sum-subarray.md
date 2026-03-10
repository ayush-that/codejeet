---
title: "How to Solve Minimum Positive Sum Subarray  — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Positive Sum Subarray . Easy difficulty, 44.9% acceptance rate. Topics: Array, Sliding Window, Prefix Sum."
date: "2028-09-24"
category: "dsa-patterns"
tags: ["minimum-positive-sum-subarray", "array", "sliding-window", "prefix-sum", "easy"]
---

# How to Solve Minimum Positive Sum Subarray

This problem asks us to find the smallest positive sum among all subarrays whose length falls within a given range `[l, r]`. While it might initially seem like a standard sliding window problem, the twist is that we're looking for the **minimum positive sum** rather than a sum meeting a specific target. This means we need to consider all possible subarray lengths within the range and efficiently find the smallest sum that's still greater than zero.

What makes this problem interesting is that we can't use a simple sliding window approach directly because:

1. We're looking for minimum positive sum, not maximum or minimum absolute sum
2. The window size is variable within a range
3. We need to efficiently compare sums across different window sizes

## Visual Walkthrough

Let's trace through an example: `nums = [3, -2, 5, -1]`, `l = 2`, `r = 3`

We need to find subarrays of length 2 or 3 with the smallest positive sum.

**Step 1: Calculate prefix sums**

- Prefix sums help us quickly compute subarray sums: `sum(i, j) = prefix[j] - prefix[i-1]`
- For our array: `prefix = [0, 3, 1, 6, 5]` (we start with 0 for easier calculation)

**Step 2: Check length 2 subarrays**

- `nums[0:1]` = [3, -2] → sum = 1 (prefix[2] - prefix[0] = 1 - 0 = 1)
- `nums[1:2]` = [-2, 5] → sum = 3 (prefix[3] - prefix[1] = 6 - 3 = 3)
- `nums[2:3]` = [5, -1] → sum = 4 (prefix[4] - prefix[2] = 5 - 1 = 4)
- Minimum positive sum so far: 1

**Step 3: Check length 3 subarrays**

- `nums[0:2]` = [3, -2, 5] → sum = 6 (prefix[3] - prefix[0] = 6 - 0 = 6)
- `nums[1:3]` = [-2, 5, -1] → sum = 2 (prefix[4] - prefix[1] = 5 - 3 = 2)
- Minimum positive sum overall: min(1, 2) = 1

**Key insight**: For each ending position `j`, we want to find the starting position `i` such that:

1. The subarray length is between `l` and `r`: `l ≤ j-i+1 ≤ r`
2. The sum is positive: `prefix[j] - prefix[i] > 0`
3. The sum is minimized: we want the smallest `prefix[j] - prefix[i]` that's still positive

This means for each `j`, we need to find the maximum `prefix[i]` where `i` satisfies the length constraints, because `prefix[j] - prefix[i]` will be smallest when `prefix[i]` is largest (but still less than `prefix[j]` to keep the sum positive).

## Brute Force Approach

The brute force solution would check every possible subarray within the length constraints:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i+l-1 to min(i+r-1, n-1)
3. Calculate the sum of nums[i:j+1]
4. Track the minimum positive sum

This approach has O(n²) time complexity in the worst case, which is too slow for larger arrays (n up to 10⁵ in typical LeetCode constraints).

The brute force fails because it redundantly calculates the same sums multiple times and doesn't leverage the structure of the problem to find the optimal solution efficiently.

## Optimal Solution

We can solve this efficiently using prefix sums and a monotonic deque (double-ended queue) to track candidate starting positions. The key insight is that for each ending position `j`, we want to find the starting position `i` in the valid range that gives us the largest `prefix[i]` (to minimize `prefix[j] - prefix[i]` while keeping it positive).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minPositiveSum(nums, l, r):
    """
    Find the minimum positive sum of a subarray with length between l and r.

    Args:
        nums: List of integers
        l: Minimum subarray length
        r: Maximum subarray length

    Returns:
        Minimum positive sum, or -1 if no such subarray exists
    """
    n = len(nums)

    # Step 1: Calculate prefix sums with an extra 0 at the beginning
    # prefix[i] = sum of nums[0:i-1], so prefix[0] = 0
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Step 2: Initialize deque to store candidate starting indices
    # We'll maintain indices in increasing order of their prefix values
    from collections import deque
    dq = deque()

    # Step 3: Initialize answer to a large value
    min_positive_sum = float('inf')

    # Step 4: Iterate through possible ending positions
    # We start from l because the smallest subarray must have at least l elements
    for j in range(l, n + 1):
        # Step 4a: Add new candidate starting index to deque
        # The starting index for subarrays ending at j must be at most j-l
        start_candidate = j - l

        # Maintain deque in decreasing order of prefix values
        # Remove indices with prefix values >= prefix[start_candidate]
        # because we want the largest prefix value, so smaller values are useless
        while dq and prefix[dq[-1]] >= prefix[start_candidate]:
            dq.pop()
        dq.append(start_candidate)

        # Step 4b: Remove indices that are too far from current j
        # Starting index must be at least j-r for valid subarray length
        min_start = j - r
        while dq and dq[0] < min_start:
            dq.popleft()

        # Step 4c: If we have a valid starting index, check if it gives positive sum
        if dq:
            current_sum = prefix[j] - prefix[dq[0]]
            # We only care about positive sums
            if current_sum > 0:
                min_positive_sum = min(min_positive_sum, current_sum)

    # Step 5: Return result or -1 if no positive sum found
    return min_positive_sum if min_positive_sum != float('inf') else -1
```

```javascript
// Time: O(n) | Space: O(n)
function minPositiveSum(nums, l, r) {
  /**
   * Find the minimum positive sum of a subarray with length between l and r.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} l - Minimum subarray length
   * @param {number} r - Maximum subarray length
   * @return {number} Minimum positive sum, or -1 if no such subarray exists
   */
  const n = nums.length;

  // Step 1: Calculate prefix sums with an extra 0 at the beginning
  // prefix[i] = sum of nums[0:i-1], so prefix[0] = 0
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Step 2: Initialize deque to store candidate starting indices
  // We'll maintain indices in increasing order of their prefix values
  const dq = [];

  // Step 3: Initialize answer to a large value
  let minPositiveSum = Infinity;

  // Step 4: Iterate through possible ending positions
  // We start from l because the smallest subarray must have at least l elements
  for (let j = l; j <= n; j++) {
    // Step 4a: Add new candidate starting index to deque
    // The starting index for subarrays ending at j must be at most j-l
    const startCandidate = j - l;

    // Maintain deque in decreasing order of prefix values
    // Remove indices with prefix values >= prefix[startCandidate]
    // because we want the largest prefix value, so smaller values are useless
    while (dq.length > 0 && prefix[dq[dq.length - 1]] >= prefix[startCandidate]) {
      dq.pop();
    }
    dq.push(startCandidate);

    // Step 4b: Remove indices that are too far from current j
    // Starting index must be at least j-r for valid subarray length
    const minStart = j - r;
    while (dq.length > 0 && dq[0] < minStart) {
      dq.shift();
    }

    // Step 4c: If we have a valid starting index, check if it gives positive sum
    if (dq.length > 0) {
      const currentSum = prefix[j] - prefix[dq[0]];
      // We only care about positive sums
      if (currentSum > 0) {
        minPositiveSum = Math.min(minPositiveSum, currentSum);
      }
    }
  }

  // Step 5: Return result or -1 if no positive sum found
  return minPositiveSum !== Infinity ? minPositiveSum : -1;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int minPositiveSum(int[] nums, int l, int r) {
        /**
         * Find the minimum positive sum of a subarray with length between l and r.
         *
         * @param nums Array of integers
         * @param l Minimum subarray length
         * @param r Maximum subarray length
         * @return Minimum positive sum, or -1 if no such subarray exists
         */
        int n = nums.length;

        // Step 1: Calculate prefix sums with an extra 0 at the beginning
        // prefix[i] = sum of nums[0:i-1], so prefix[0] = 0
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }

        // Step 2: Initialize deque to store candidate starting indices
        // We'll maintain indices in increasing order of their prefix values
        Deque<Integer> dq = new ArrayDeque<>();

        // Step 3: Initialize answer to a large value
        long minPositiveSum = Long.MAX_VALUE;

        // Step 4: Iterate through possible ending positions
        // We start from l because the smallest subarray must have at least l elements
        for (int j = l; j <= n; j++) {
            // Step 4a: Add new candidate starting index to deque
            // The starting index for subarrays ending at j must be at most j-l
            int startCandidate = j - l;

            // Maintain deque in decreasing order of prefix values
            // Remove indices with prefix values >= prefix[startCandidate]
            // because we want the largest prefix value, so smaller values are useless
            while (!dq.isEmpty() && prefix[dq.peekLast()] >= prefix[startCandidate]) {
                dq.pollLast();
            }
            dq.offerLast(startCandidate);

            // Step 4b: Remove indices that are too far from current j
            // Starting index must be at least j-r for valid subarray length
            int minStart = j - r;
            while (!dq.isEmpty() && dq.peekFirst() < minStart) {
                dq.pollFirst();
            }

            // Step 4c: If we have a valid starting index, check if it gives positive sum
            if (!dq.isEmpty()) {
                long currentSum = prefix[j] - prefix[dq.peekFirst()];
                // We only care about positive sums
                if (currentSum > 0) {
                    minPositiveSum = Math.min(minPositiveSum, currentSum);
                }
            }
        }

        // Step 5: Return result or -1 if no positive sum found
        return minPositiveSum != Long.MAX_VALUE ? (int) minPositiveSum : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Calculating prefix sums takes O(n)
- Each index is added to the deque exactly once and removed at most once
- The inner while loops run amortized O(1) time per iteration
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store prefix sums array of size n+1: O(n)
- The deque can hold up to O(n) indices in the worst case
- Total: O(n)

The linear time complexity is optimal because we need to examine each element at least once to find the minimum positive sum.

## Common Mistakes

1. **Forgetting to handle the "positive" requirement**: Candidates often find the minimum sum but forget to check if it's positive. Always verify `current_sum > 0` before updating the answer.

2. **Off-by-one errors with indices**: The relationship between subarray length and indices is tricky. Remember:
   - For subarray from index i to j (inclusive), length = j - i + 1
   - In prefix sums, sum(i, j) = prefix[j+1] - prefix[i]
   - Pay close attention to whether you're using 0-based or 1-based indexing

3. **Not handling the case when no positive sum exists**: Always initialize your answer to a sentinel value (like infinity) and return -1 if it hasn't been updated.

4. **Using the wrong data structure for the deque**: Some candidates try to use a simple list/array instead of a proper deque, which leads to O(n) operations for removing from the front. Always use a data structure that supports O(1) operations at both ends.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Prefix Sums with Range Queries**: Whenever you need to efficiently calculate sums of subarrays, prefix sums are your go-to tool. Similar problems:
   - [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) - Uses prefix sums to find maximum sum
   - [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) - Uses prefix sums with hash maps

2. **Sliding Window with Monotonic Deque**: When you need to maintain minimum/maximum values over a sliding window, a monotonic deque is often the optimal solution. Similar problems:
   - [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) - Classic monotonic deque problem
   - [Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) - Very similar structure with prefix sums and deque

## Key Takeaways

1. **Prefix sums transform subarray sum problems into difference problems**: Instead of calculating sums repeatedly, compute `prefix[j] - prefix[i]` for O(1) subarray sum queries.

2. **Monotonic deques efficiently maintain extremal values over sliding windows**: When you need the maximum/minimum value in a moving window, a deque that maintains elements in sorted order gives you O(1) access to the optimal value.

3. **For "minimum positive" problems, think in terms of maximizing the subtracted value**: To minimize `prefix[j] - prefix[i]` while keeping it positive, we want to maximize `prefix[i]` (subject to `prefix[i] < prefix[j]`).

Related problems: [Minimum Size Subarray Sum](/problem/minimum-size-subarray-sum)
