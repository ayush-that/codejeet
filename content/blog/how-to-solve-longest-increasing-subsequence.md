---
title: "How to Solve Longest Increasing Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Increasing Subsequence. Medium difficulty, 59.1% acceptance rate. Topics: Array, Binary Search, Dynamic Programming."
date: "2026-04-20"
category: "dsa-patterns"
tags: ["longest-increasing-subsequence", "array", "binary-search", "dynamic-programming", "medium"]
---

# How to Solve Longest Increasing Subsequence

Given an array of integers, find the length of the longest subsequence where elements are in strictly increasing order. A subsequence means you can delete elements from the original array without changing the order of the remaining elements. This problem is tricky because you can't just look at consecutive elements—you need to consider non-adjacent elements that maintain an increasing order, which creates many possible combinations to evaluate.

## Visual Walkthrough

Let's trace through `nums = [10, 9, 2, 5, 3, 7, 101, 18]` step by step.

A subsequence is different from a subarray—it doesn't need to be contiguous. For example:

- `[2, 5, 7, 101]` is a valid increasing subsequence (length 4)
- `[2, 3, 7, 18]` is also valid (length 4)
- `[2, 5, 7, 18]` is valid (length 4)

The longest increasing subsequence here has length 4. But how do we find this systematically?

If we think about building subsequences:

- Starting at index 0 (10): We can only take larger numbers after it
- Starting at index 2 (2): We have more options—5, 3, 7, 101, 18 are all > 2

The key insight is that at each position, the longest increasing subsequence ending at that position depends on all previous positions with smaller values.

## Brute Force Approach

The most straightforward approach is to generate all possible subsequences and check which ones are increasing. For each element, we have two choices: include it or exclude it. This gives us 2^n possible subsequences to check.

**Why this fails:**

- For an array of length n, there are 2^n possible subsequences
- Checking each one takes O(n) time
- Total time complexity: O(n × 2^n), which is impossibly slow for n > 20
- Even for n = 30, that's over 1 billion operations

We need a smarter approach that avoids exponential explosion.

## Optimized Approach

The optimal solution uses **dynamic programming** with a clever insight: instead of tracking all possible subsequences, we track the smallest possible tail value for all increasing subsequences of a given length.

**Key Insight:** For each length L (from 1 to the answer), maintain the smallest possible last value of any increasing subsequence of length L. Why? Because if we have two subsequences of length L, we only care about the one with the smaller last value—it gives us more opportunities to extend it with future numbers.

**Step-by-step reasoning:**

1. Initialize an empty array `tails` where `tails[i]` will store the smallest possible tail value for all increasing subsequences of length `i+1`
2. For each number in `nums`:
   - If the number is larger than all tails, append it (we found a longer subsequence)
   - Otherwise, find the first tail that's ≥ current number and replace it (we found a better, smaller tail for some existing length)
3. The length of `tails` at the end is our answer

**Why binary search helps:**
The `tails` array is always sorted in increasing order (by construction), so we can use binary search to find where to insert/replace values in O(log n) time instead of O(n).

## Optimal Solution

Here's the implementation using dynamic programming with binary search:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def lengthOfLIS(nums):
    """
    Find the length of the longest strictly increasing subsequence.

    Approach: Patience sorting / binary search on tails array
    tails[i] = smallest possible tail value for all increasing
               subsequences of length i+1
    """
    if not nums:
        return 0

    tails = []

    for num in nums:
        # Binary search to find the position where num should go
        left, right = 0, len(tails)

        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1  # num is larger, search right half
            else:
                right = mid     # num is smaller or equal, search left half

        # If left is at the end, num extends the longest subsequence
        if left == len(tails):
            tails.append(num)
        else:
            # Replace the first element >= num with num
            # This maintains the "smallest tail" property
            tails[left] = num

    # The length of tails is the length of LIS
    return len(tails)
```

```javascript
// Time: O(n log n) | Space: O(n)
function lengthOfLIS(nums) {
  /**
   * Find the length of the longest strictly increasing subsequence.
   *
   * Approach: Patience sorting / binary search on tails array
   * tails[i] = smallest possible tail value for all increasing
   *            subsequences of length i+1
   */
  if (nums.length === 0) return 0;

  const tails = [];

  for (const num of nums) {
    // Binary search to find the position where num should go
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1; // num is larger, search right half
      } else {
        right = mid; // num is smaller or equal, search left half
      }
    }

    // If left is at the end, num extends the longest subsequence
    if (left === tails.length) {
      tails.push(num);
    } else {
      // Replace the first element >= num with num
      // This maintains the "smallest tail" property
      tails[left] = num;
    }
  }

  // The length of tails is the length of LIS
  return tails.length;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int lengthOfLIS(int[] nums) {
        /**
         * Find the length of the longest strictly increasing subsequence.
         *
         * Approach: Patience sorting / binary search on tails array
         * tails[i] = smallest possible tail value for all increasing
         *            subsequences of length i+1
         */
        if (nums.length == 0) return 0;

        List<Integer> tails = new ArrayList<>();

        for (int num : nums) {
            // Binary search to find the position where num should go
            int left = 0;
            int right = tails.size();

            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails.get(mid) < num) {
                    left = mid + 1;  // num is larger, search right half
                } else {
                    right = mid;     // num is smaller or equal, search left half
                }
            }

            // If left is at the end, num extends the longest subsequence
            if (left == tails.size()) {
                tails.add(num);
            } else {
                // Replace the first element >= num with num
                // This maintains the "smallest tail" property
                tails.set(left, num);
            }
        }

        // The length of tails is the length of LIS
        return tails.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- We iterate through all n elements in the array
- For each element, we perform binary search on the `tails` array, which takes O(log k) where k ≤ n
- Total: O(n log n)

**Space Complexity: O(n)**

- In the worst case, the `tails` array could store all n elements (if the array is strictly increasing)
- Even with the binary search optimization, we still need to store potential tail values

## Common Mistakes

1. **Confusing subsequence with subarray**: A subsequence doesn't need to be contiguous, but many candidates mistakenly look for consecutive increasing elements. Remember you can skip elements.

2. **Forgetting the "strictly" increasing requirement**: The problem says "strictly increasing," so equal values don't count. If you see `[2, 2, 2]`, the LIS length is 1, not 3.

3. **Using the wrong binary search condition**: When searching in the `tails` array, we look for the first element ≥ current number (not >). If we find an equal value, we should replace it to maintain the smallest tail property.

4. **Not handling empty input**: Always check if `nums` is empty and return 0 immediately. The loop won't handle this case gracefully.

5. **Trying to reconstruct the actual subsequence**: The problem only asks for the length, not the subsequence itself. Trying to track the actual elements adds unnecessary complexity.

## When You'll See This Pattern

This "patience sorting" or "binary search on tails" pattern appears in several related problems:

1. **Increasing Triplet Subsequence (LeetCode 334)**: A special case where you only need to check if there's a subsequence of length 3. You can use a simplified version of the same idea with just two variables.

2. **Russian Doll Envelopes (LeetCode 354)**: After sorting envelopes by width (and height in descending order when widths are equal), the problem reduces to finding LIS on heights.

3. **Maximum Length of Pair Chain (LeetCode 646)**: Sort pairs by their first element, then find the longest chain where `pairs[i][1] < pairs[j][0]`. This is essentially LIS with a different comparison condition.

4. **Longest Increasing Subsequence in 2D (variations)**: Problems where you need to find increasing sequences in matrix paths or other structures often use similar DP approaches.

## Key Takeaways

1. **The "tails array" technique** is powerful for LIS problems: Instead of tracking all possible subsequences, track the smallest possible ending value for each possible length.

2. **Binary search optimization** works when the data structure remains sorted: The `tails` array is always increasing, so we can use binary search to find insertion points efficiently.

3. **Recognize when a problem reduces to LIS**: Many problems that involve finding the longest sequence satisfying some ordering constraint can be transformed into an LIS problem with appropriate preprocessing (like sorting).

4. **Dynamic programming thinking**: Even with the binary search optimization, this is fundamentally a DP approach—we build up solutions to subproblems (longest subsequence ending at each position).

This pattern of maintaining a sorted structure and using binary search for efficient updates appears in many optimization problems, making it a valuable technique to master for coding interviews.

**Related problems:** [Increasing Triplet Subsequence](/problem/increasing-triplet-subsequence), [Russian Doll Envelopes](/problem/russian-doll-envelopes), [Maximum Length of Pair Chain](/problem/maximum-length-of-pair-chain)
