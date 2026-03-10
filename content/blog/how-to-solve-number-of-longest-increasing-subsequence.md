---
title: "How to Solve Number of Longest Increasing Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Longest Increasing Subsequence. Medium difficulty, 51.4% acceptance rate. Topics: Array, Dynamic Programming, Binary Indexed Tree, Segment Tree."
date: "2027-11-12"
category: "dsa-patterns"
tags:
  [
    "number-of-longest-increasing-subsequence",
    "array",
    "dynamic-programming",
    "binary-indexed-tree",
    "medium",
  ]
---

# How to Solve Number of Longest Increasing Subsequence

This problem asks us to count how many longest increasing subsequences exist in an array, where "increasing" means strictly increasing. What makes this tricky is that we need to track both the _length_ of the longest increasing subsequence (LIS) ending at each position AND the _count_ of subsequences achieving that length. This is a natural extension of the classic LIS problem, but requires careful state management.

## Visual Walkthrough

Let's trace through `nums = [1, 3, 5, 4, 7]` step by step:

**Step 1: Initialize tracking arrays**
We'll maintain two arrays:

- `length[i]`: Length of LIS ending at index `i`
- `count[i]`: Number of LIS ending at index `i`

Initially: `length = [1, 1, 1, 1, 1]`, `count = [1, 1, 1, 1, 1]`
(Each element alone forms a subsequence of length 1, and there's exactly 1 way to do that)

**Step 2: Process index 0 (value = 1)**
No elements before it, so `length[0] = 1`, `count[0] = 1` stays the same.

**Step 3: Process index 1 (value = 3)**
Compare with previous elements:

- Compare with index 0 (value = 1): 3 > 1, so we can extend
- Current `length[1] = 1`, but `length[0] + 1 = 2` is better
- Update `length[1] = 2`, `count[1] = count[0] = 1`

**Step 4: Process index 2 (value = 5)**
Compare with previous:

- Index 0 (1): 5 > 1, `length[0] + 1 = 2`
- Index 1 (3): 5 > 3, `length[1] + 1 = 3` (better!)
- Update `length[2] = 3`, `count[2] = count[1] = 1`

**Step 5: Process index 3 (value = 4)**
Compare with previous:

- Index 0 (1): 4 > 1, `length[0] + 1 = 2`
- Index 1 (3): 4 > 3, `length[1] + 1 = 3` (best so far)
- Index 2 (5): 4 > 5? No, skip
- Update `length[3] = 3`, `count[3] = count[1] = 1`

**Step 6: Process index 4 (value = 7)**
Compare with previous:

- Index 0 (1): 7 > 1, `length[0] + 1 = 2`
- Index 1 (3): 7 > 3, `length[1] + 1 = 3`
- Index 2 (5): 7 > 5, `length[2] + 1 = 4` (best so far)
- Index 3 (4): 7 > 4, `length[3] + 1 = 4` (ties with previous best)

Here's the key insight: When we find multiple previous elements that give us the same maximum length, we need to sum their counts!

So for index 4:

- From index 2: length 4, count 1
- From index 3: length 4, count 1
- Update `length[4] = 4`, `count[4] = count[2] + count[3] = 2`

**Final state:**
`length = [1, 2, 3, 3, 4]`
`count = [1, 1, 1, 1, 2]`

Maximum LIS length is 4, and we sum all `count[i]` where `length[i] = 4`: only index 4 with count 2.

**Answer: 2**

## Brute Force Approach

A brute force approach would generate all possible subsequences (2^n possibilities), check if each is strictly increasing, track the maximum length found, and count how many subsequences achieve that length. This is clearly exponential time O(2^n) and completely impractical for arrays of any reasonable size.

Even a more reasonable brute force would try to build LIS from each starting position using backtracking, but without memoization it would still be exponential. The key issue is that we're counting _distinct_ subsequences, not just finding one longest sequence.

## Optimized Approach

The optimal solution uses dynamic programming with two arrays:

1. `length[i]`: Length of LIS ending at `nums[i]`
2. `count[i]`: Number of LIS ending at `nums[i]`

**Key Insight:** For each position `i`, we look at all previous positions `j < i`:

- If `nums[i] > nums[j]`, we can extend subsequences ending at `j`
- If `length[j] + 1 > length[i]`, we found a longer subsequence ending at `i`
  - Update `length[i] = length[j] + 1`
  - Reset `count[i] = count[j]` (new best length, start fresh)
- If `length[j] + 1 == length[i]`, we found another way to achieve the same best length
  - Add `count[j]` to `count[i]`

After processing all elements, we find the maximum length in `length` array, then sum all `count[i]` where `length[i] == maxLength`.

This approach is O(n²) time and O(n) space, which works for n ≤ 2000.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def findNumberOfLIS(nums):
    """
    Count the number of longest increasing subsequences.

    Args:
        nums: List of integers

    Returns:
        Integer count of longest increasing subsequences
    """
    n = len(nums)
    if n == 0:
        return 0

    # length[i] = length of LIS ending at nums[i]
    length = [1] * n
    # count[i] = number of LIS ending at nums[i]
    count = [1] * n

    # Track overall maximum LIS length
    max_len = 1

    # Process each element
    for i in range(n):
        # Compare with all previous elements
        for j in range(i):
            # We can extend subsequences ending at j if nums[i] > nums[j]
            if nums[i] > nums[j]:
                # Case 1: Found a longer subsequence ending at i
                if length[j] + 1 > length[i]:
                    length[i] = length[j] + 1
                    count[i] = count[j]  # Reset count for new best length
                # Case 2: Found another way to achieve same best length
                elif length[j] + 1 == length[i]:
                    count[i] += count[j]  # Add to existing count

        # Update overall maximum length
        max_len = max(max_len, length[i])

    # Sum counts for all subsequences with maximum length
    result = 0
    for i in range(n):
        if length[i] == max_len:
            result += count[i]

    return result
```

```javascript
// Time: O(n^2) | Space: O(n)
function findNumberOfLIS(nums) {
  /**
   * Count the number of longest increasing subsequences.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Count of longest increasing subsequences
   */
  const n = nums.length;
  if (n === 0) return 0;

  // length[i] = length of LIS ending at nums[i]
  const length = new Array(n).fill(1);
  // count[i] = number of LIS ending at nums[i]
  const count = new Array(n).fill(1);

  // Track overall maximum LIS length
  let maxLen = 1;

  // Process each element
  for (let i = 0; i < n; i++) {
    // Compare with all previous elements
    for (let j = 0; j < i; j++) {
      // We can extend subsequences ending at j if nums[i] > nums[j]
      if (nums[i] > nums[j]) {
        // Case 1: Found a longer subsequence ending at i
        if (length[j] + 1 > length[i]) {
          length[i] = length[j] + 1;
          count[i] = count[j]; // Reset count for new best length
        }
        // Case 2: Found another way to achieve same best length
        else if (length[j] + 1 === length[i]) {
          count[i] += count[j]; // Add to existing count
        }
      }
    }

    // Update overall maximum length
    maxLen = Math.max(maxLen, length[i]);
  }

  // Sum counts for all subsequences with maximum length
  let result = 0;
  for (let i = 0; i < n; i++) {
    if (length[i] === maxLen) {
      result += count[i];
    }
  }

  return result;
}
```

```java
// Time: O(n^2) | Space: O(n)
class Solution {
    public int findNumberOfLIS(int[] nums) {
        /**
         * Count the number of longest increasing subsequences.
         *
         * @param nums Array of integers
         * @return Count of longest increasing subsequences
         */
        int n = nums.length;
        if (n == 0) return 0;

        // length[i] = length of LIS ending at nums[i]
        int[] length = new int[n];
        // count[i] = number of LIS ending at nums[i]
        int[] count = new int[n];

        // Initialize arrays
        for (int i = 0; i < n; i++) {
            length[i] = 1;
            count[i] = 1;
        }

        // Track overall maximum LIS length
        int maxLen = 1;

        // Process each element
        for (int i = 0; i < n; i++) {
            // Compare with all previous elements
            for (int j = 0; j < i; j++) {
                // We can extend subsequences ending at j if nums[i] > nums[j]
                if (nums[i] > nums[j]) {
                    // Case 1: Found a longer subsequence ending at i
                    if (length[j] + 1 > length[i]) {
                        length[i] = length[j] + 1;
                        count[i] = count[j];  // Reset count for new best length
                    }
                    // Case 2: Found another way to achieve same best length
                    else if (length[j] + 1 == length[i]) {
                        count[i] += count[j];  // Add to existing count
                    }
                }
            }

            // Update overall maximum length
            maxLen = Math.max(maxLen, length[i]);
        }

        // Sum counts for all subsequences with maximum length
        int result = 0;
        for (int i = 0; i < n; i++) {
            if (length[i] == maxLen) {
                result += count[i];
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We have an outer loop iterating through all `n` elements
- For each element `i`, we have an inner loop checking all previous `i` elements
- This gives us Σ(i=0 to n-1) i = n(n-1)/2 = O(n²) operations

**Space Complexity: O(n)**

- We use two arrays of size `n`: `length` and `count`
- No other data structures scale with input size
- Total space: 2n = O(n)

## Common Mistakes

1. **Forgetting to reset count when finding a longer subsequence**: When `length[j] + 1 > length[i]`, we must set `count[i] = count[j]`, not add to it. This is because we found a new _best_ length, so previous ways to achieve shorter lengths don't count.

2. **Not handling empty array**: Always check if `nums` is empty and return 0 immediately. An empty array has 0 longest increasing subsequences.

3. **Confusing subsequence with subarray**: Remember subsequences don't need to be contiguous! You can skip elements. This is why we compare `nums[i]` with _all_ previous `nums[j]`, not just `nums[i-1]`.

4. **Missing the final summation**: After computing `length` and `count`, you need to find the maximum length first, then sum all `count[i]` where `length[i] == maxLen`. Don't just return `count[n-1]` or assume the last element is part of the LIS.

## When You'll See This Pattern

This problem combines two classic DP patterns:

1. **Longest Increasing Subsequence (LIS) pattern**: Problems where you need to find the longest sequence satisfying some ordering constraint. Variations include:
   - [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) - The base problem this builds upon
   - [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/) - 2D version of LIS
   - [Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/) - Interval version of LIS

2. **Counting DP pattern**: Problems where you need to count the number of optimal solutions, not just find one:
   - [Unique Paths](https://leetcode.com/problems/unique-paths/) - Count paths in grid
   - [Decode Ways](https://leetcode.com/problems/decode-ways/) - Count valid decodings
   - [Coin Change II](https://leetcode.com/problems/coin-change-ii/) - Count ways to make change

## Key Takeaways

1. **When counting optimal solutions in DP, maintain separate arrays for "best value" and "count of ways to achieve it"**. This separation of concerns makes the logic cleaner.

2. **The LIS DP template (O(n²)) is worth memorizing**: For each `i`, check all `j < i`, update if `nums[i] > nums[j]`. Many problems are variations of this pattern.

3. **Pay attention to reset vs accumulate logic**: When you find a strictly better solution, reset the count. When you find an equally good solution, add to the count. This pattern appears in many counting DP problems.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Longest Continuous Increasing Subsequence](/problem/longest-continuous-increasing-subsequence), [Longest Increasing Subsequence II](/problem/longest-increasing-subsequence-ii)
