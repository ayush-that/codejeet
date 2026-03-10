---
title: "How to Solve Split Array Largest Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Split Array Largest Sum. Hard difficulty, 59.9% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Greedy, Prefix Sum."
date: "2027-03-06"
category: "dsa-patterns"
tags: ["split-array-largest-sum", "array", "binary-search", "dynamic-programming", "hard"]
---

# How to Solve Split Array Largest Sum

You're given an array of integers and need to split it into `k` non-empty contiguous subarrays. Your goal is to minimize the largest sum among all these subarrays. This problem is tricky because it seems like a dynamic programming problem at first glance, but the optimal solution uses a clever binary search approach that's not immediately obvious.

## Visual Walkthrough

Let's walk through an example: `nums = [7,2,5,10,8]`, `k = 2`

We need to split this array into 2 contiguous subarrays. Let's consider all possible splits:

1. Split after index 0: `[7]` and `[2,5,10,8]` → sums: 7 and 25 → largest sum = 25
2. Split after index 1: `[7,2]` and `[5,10,8]` → sums: 9 and 23 → largest sum = 23
3. Split after index 2: `[7,2,5]` and `[10,8]` → sums: 14 and 18 → largest sum = 18
4. Split after index 3: `[7,2,5,10]` and `[8]` → sums: 24 and 8 → largest sum = 24

The minimum largest sum is 18. But what if `k = 3`?

We need to find the split that minimizes the maximum subarray sum. The key insight is that we can think about this problem differently: Given a maximum allowed sum per subarray, can we split the array into `k` or fewer subarrays?

For example, if we set a maximum sum limit of 15:

- Start with 7 → okay (7 ≤ 15)
- Add 2 → 9 ≤ 15
- Add 5 → 14 ≤ 15
- Add 10 → 24 > 15, so we need a new subarray
- Start new subarray with 10 → 10 ≤ 15
- Add 8 → 18 > 15, so we need another subarray
- Start new subarray with 8 → 8 ≤ 15

We used 3 subarrays. Since we need exactly `k = 3` subarrays, and we used exactly 3 with limit 15, 15 is a valid candidate. But can we do better?

## Brute Force Approach

The brute force approach would try all possible ways to place `k-1` split points in an array of length `n`. The number of ways is `C(n-1, k-1)` (choose `k-1` split points from `n-1` possible positions between elements). For each split configuration, we'd calculate the maximum subarray sum and track the minimum.

This approach has exponential time complexity `O(n^k)` in the worst case, which is completely impractical for reasonable `n` values. Even with memoization, a dynamic programming solution would be `O(n²k)`, which is still too slow for large inputs.

## Optimized Approach

The key insight is that we can use **binary search** on the answer space. Think about it:

1. What's the smallest possible answer? It must be at least the largest single element in the array, because every subarray must contain at least one element.
2. What's the largest possible answer? It's the sum of the entire array, which happens when `k = 1`.

So our answer lies between `max(nums)` and `sum(nums)`. For any candidate value `mid` in this range, we can check: "Can we split the array into `k` or fewer subarrays where no subarray sum exceeds `mid`?"

We can check this with a greedy algorithm:

- Start accumulating elements into the current subarray
- When adding the next element would exceed `mid`, start a new subarray
- Count how many subarrays we need

If we need more than `k` subarrays, then `mid` is too small (our limit is too strict). If we need `k` or fewer subarrays, then `mid` might be valid (or we might be able to do even better with a smaller `mid`).

This gives us a binary search framework:

- If `canSplit(mid)` returns true (we can split with ≤ k subarrays), search lower (try smaller `mid`)
- If `canSplit(mid)` returns false, search higher (try larger `mid`)

## Optimal Solution

Here's the complete solution using binary search with a greedy validation function:

<div class="code-group">

```python
# Time: O(n * log(S)) where n = len(nums), S = sum(nums) - max(nums)
# Space: O(1)
def splitArray(nums, k):
    """
    Split nums into k non-empty subarrays to minimize the largest sum.

    Args:
        nums: List of integers to split
        k: Number of subarrays to create

    Returns:
        Minimum possible largest sum among all subarrays
    """

    # Helper function to check if we can split nums into <= k subarrays
    # where each subarray sum <= max_sum
    def can_split(max_sum):
        """
        Check if we can split nums with max_sum limit.

        Args:
            max_sum: Maximum allowed sum for any subarray

        Returns:
            True if we can split into <= k subarrays, False otherwise
        """
        current_sum = 0  # Sum of current subarray
        subarrays_needed = 1  # We need at least 1 subarray

        for num in nums:
            # If adding this number would exceed max_sum,
            # we need to start a new subarray
            if current_sum + num > max_sum:
                subarrays_needed += 1
                current_sum = num

                # If we already need more than k subarrays, we can stop early
                if subarrays_needed > k:
                    return False
            else:
                # Add to current subarray
                current_sum += num

        return True

    # Binary search boundaries:
    # - Minimum possible answer: largest single element
    #   (each subarray must contain at least one element)
    # - Maximum possible answer: sum of all elements
    #   (when k = 1, we have just one subarray)
    left = max(nums)
    right = sum(nums)

    # Binary search for the minimum valid max_sum
    while left < right:
        mid = left + (right - left) // 2  # Avoid overflow

        if can_split(mid):
            # mid is valid (or could be too large), try smaller values
            right = mid
        else:
            # mid is too small, need larger max_sum
            left = mid + 1

    # When left == right, we've found the minimum valid max_sum
    return left
```

```javascript
// Time: O(n * log(S)) where n = nums.length, S = sum(nums) - max(nums)
// Space: O(1)
function splitArray(nums, k) {
  /**
   * Check if we can split nums into <= k subarrays
   * where each subarray sum <= maxSum
   */
  function canSplit(maxSum) {
    let currentSum = 0; // Sum of current subarray
    let subarraysNeeded = 1; // We need at least 1 subarray

    for (let num of nums) {
      // If adding this number would exceed maxSum,
      // we need to start a new subarray
      if (currentSum + num > maxSum) {
        subarraysNeeded++;
        currentSum = num;

        // If we already need more than k subarrays, we can stop early
        if (subarraysNeeded > k) {
          return false;
        }
      } else {
        // Add to current subarray
        currentSum += num;
      }
    }

    return true;
  }

  // Binary search boundaries:
  // - Minimum possible answer: largest single element
  // - Maximum possible answer: sum of all elements
  let left = Math.max(...nums);
  let right = nums.reduce((sum, num) => sum + num, 0);

  // Binary search for the minimum valid maxSum
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (canSplit(mid)) {
      // mid is valid (or could be too large), try smaller values
      right = mid;
    } else {
      // mid is too small, need larger maxSum
      left = mid + 1;
    }
  }

  // When left === right, we've found the minimum valid maxSum
  return left;
}
```

```java
// Time: O(n * log(S)) where n = nums.length, S = sum(nums) - max(nums)
// Space: O(1)
public int splitArray(int[] nums, int k) {
    /**
     * Check if we can split nums into <= k subarrays
     * where each subarray sum <= maxSum
     */
    private boolean canSplit(int[] nums, int k, int maxSum) {
        int currentSum = 0;  // Sum of current subarray
        int subarraysNeeded = 1;  // We need at least 1 subarray

        for (int num : nums) {
            // If adding this number would exceed maxSum,
            // we need to start a new subarray
            if (currentSum + num > maxSum) {
                subarraysNeeded++;
                currentSum = num;

                // If we already need more than k subarrays, we can stop early
                if (subarraysNeeded > k) {
                    return false;
                }
            } else {
                // Add to current subarray
                currentSum += num;
            }
        }

        return true;
    }

    // Binary search boundaries:
    // - Minimum possible answer: largest single element
    // - Maximum possible answer: sum of all elements
    int left = 0;
    int right = 0;

    for (int num : nums) {
        left = Math.max(left, num);  // Find maximum element
        right += num;  // Calculate total sum
    }

    // Binary search for the minimum valid maxSum
    while (left < right) {
        int mid = left + (right - left) / 2;  // Avoid overflow

        if (canSplit(nums, k, mid)) {
            // mid is valid (or could be too large), try smaller values
            right = mid;
        } else {
            // mid is too small, need larger maxSum
            left = mid + 1;
        }
    }

    // When left == right, we've found the minimum valid maxSum
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * log(S))` where:

- `n` is the length of the input array
- `S` is `sum(nums) - max(nums)`, the range of our binary search

We perform binary search over a range of size `S`, and for each candidate value, we run the `can_split` function which takes `O(n)` time. The binary search performs `O(log S)` iterations.

**Space Complexity:** `O(1)` for all implementations. We only use a few variables for tracking sums and counts, regardless of input size.

## Common Mistakes

1. **Using dynamic programming without optimization:** A naive DP solution would be `O(n²k)`, which times out for large inputs. Candidates often jump to DP because the problem involves partitioning, but they fail to recognize the binary search pattern.

2. **Incorrect binary search boundaries:** Setting `left = 0` instead of `max(nums)` is wrong because the answer must be at least as large as the biggest element. Similarly, setting `right = Integer.MAX_VALUE` instead of `sum(nums)` makes the search space unnecessarily large.

3. **Off-by-one errors in binary search:** Using `while (left <= right)` instead of `while (left < right)` can cause infinite loops. Remember that we're searching for the minimum valid value, so we use `right = mid` when valid and `left = mid + 1` when invalid.

4. **Forgetting to handle the case when k > n:** The problem guarantees `1 <= k <= n`, but in interviews, it's good to mention this assumption. If `k > n`, we couldn't create `k` non-empty subarrays from `n` elements.

## When You'll See This Pattern

This "binary search on answer" pattern appears in problems where:

1. You're asked to minimize a maximum value (or maximize a minimum value)
2. The answer lies within a known range
3. You can efficiently check whether a candidate answer is valid

Related problems:

- **Capacity To Ship Packages Within D Days (Medium):** Almost identical! Instead of splitting an array into subarrays, you're splitting packages into days with a weight capacity limit.
- **Divide Chocolate (Hard):** Maximize the minimum sum of pieces when cutting a chocolate bar into k+1 pieces.
- **Fair Distribution of Cookies (Medium):** Distribute cookies to children to minimize the maximum cookies any child gets (though this uses backtracking/DP instead of binary search).

## Key Takeaways

1. **When you need to minimize a maximum (or maximize a minimum), consider binary search on the answer space.** If you can efficiently verify whether a candidate value works, binary search can often turn an exponential or polynomial problem into a logarithmic one.

2. **The validation function is usually greedy.** For these types of problems, once you fix the maximum allowed value, you can often use a greedy approach to check feasibility: process elements in order, grouping as many as possible before exceeding the limit.

3. **Know your search boundaries.** The minimum possible answer is often the largest single element (or similar constraint), while the maximum is often the sum of all elements (or total available resource).

Related problems: [Capacity To Ship Packages Within D Days](/problem/capacity-to-ship-packages-within-d-days), [Divide Chocolate](/problem/divide-chocolate), [Fair Distribution of Cookies](/problem/fair-distribution-of-cookies)
