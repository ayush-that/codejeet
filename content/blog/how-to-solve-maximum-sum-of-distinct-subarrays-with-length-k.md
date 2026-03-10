---
title: "How to Solve Maximum Sum of Distinct Subarrays With Length K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum of Distinct Subarrays With Length K. Medium difficulty, 42.8% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2028-04-22"
category: "dsa-patterns"
tags:
  [
    "maximum-sum-of-distinct-subarrays-with-length-k",
    "array",
    "hash-table",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Maximum Sum of Distinct Subarrays With Length K

This problem asks us to find the maximum sum among all length-k subarrays that contain only distinct elements. What makes this interesting is the combination of two constraints: we need a fixed window size (k) while also ensuring all elements within that window are unique. This requires tracking both the sum and element frequencies simultaneously.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 5, 4, 2, 9, 9, 9]`, `k = 3`

We need to find all length-3 subarrays with distinct elements and track their sums:

1. Window [1, 5, 4] → All distinct → Sum = 10
2. Slide right: [5, 4, 2] → All distinct → Sum = 11 (new max)
3. Slide right: [4, 2, 9] → All distinct → Sum = 15 (new max)
4. Slide right: [2, 9, 9] → Contains duplicate 9 → Invalid
5. Slide right: [9, 9, 9] → Contains duplicates → Invalid

The maximum valid sum is 15 from subarray [4, 2, 9].

The challenge is handling duplicates efficiently. When we encounter a duplicate, we can't just slide the window normally—we need to remove elements from the left until the duplicate is eliminated.

## Brute Force Approach

A naive approach would check every possible length-k subarray:

1. For each starting index `i` from 0 to `n-k`
2. Extract the subarray `nums[i:i+k]`
3. Check if all elements are distinct (using a set)
4. If valid, calculate the sum and track the maximum

This approach has O(k) time to check each subarray, and we have O(n-k+1) subarrays, giving us O(n×k) time complexity. For large arrays with large k, this becomes inefficient (up to O(n²) when k ≈ n/2).

The key insight is that consecutive subarrays overlap significantly. When we slide the window, only two elements change: we remove the leftmost element and add a new rightmost element. We should reuse computations rather than recalculating everything from scratch.

## Optimized Approach

We can solve this efficiently using a **sliding window** approach with a **hash map** to track element frequencies:

1. **Maintain a window** of exactly k elements (when possible)
2. **Track frequencies** of elements in the current window using a hash map
3. **Track the current sum** of the window
4. **Expand right** by adding a new element to the window
5. **Contract left** when:
   - The window size exceeds k (remove leftmost element)
   - The new element creates a duplicate (remove elements from left until duplicate is gone)
6. **Check for valid window**: When window size equals k and all elements are distinct (no duplicates in frequency map), update the maximum sum

The clever part is handling duplicates: when we add an element that already exists in the window, we must remove elements from the left until we've removed the previous occurrence of that element. This ensures our window always contains distinct elements.

## Optimal Solution

Here's the complete solution using sliding window with frequency tracking:

<div class="code-group">

```python
# Time: O(n) | Space: O(k)
def maximumSubarraySum(nums, k):
    """
    Find maximum sum of length-k subarrays with all distinct elements.

    Args:
        nums: List of integers
        k: Length of subarray

    Returns:
        Maximum sum of valid subarrays, or 0 if none exist
    """
    n = len(nums)
    if n < k:
        return 0

    freq = {}  # Track frequencies of elements in current window
    current_sum = 0
    max_sum = 0
    left = 0

    for right in range(n):
        # Add current element to window
        current_sum += nums[right]
        freq[nums[right]] = freq.get(nums[right], 0) + 1

        # If window size exceeds k, remove leftmost element
        if right - left + 1 > k:
            current_sum -= nums[left]
            freq[nums[left]] -= 1
            if freq[nums[left]] == 0:
                del freq[nums[left]]
            left += 1

        # If current element creates a duplicate, contract window from left
        # until duplicate is removed
        while freq[nums[right]] > 1:
            current_sum -= nums[left]
            freq[nums[left]] -= 1
            if freq[nums[left]] == 0:
                del freq[nums[left]]
            left += 1

        # Check if we have a valid window of size k with all distinct elements
        if right - left + 1 == k:
            # All elements are distinct (implied by while loop above)
            max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(k)
function maximumSubarraySum(nums, k) {
  /**
   * Find maximum sum of length-k subarrays with all distinct elements.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Length of subarray
   * @return {number} Maximum sum of valid subarrays, or 0 if none exist
   */
  const n = nums.length;
  if (n < k) return 0;

  const freq = new Map(); // Track frequencies of elements in current window
  let currentSum = 0;
  let maxSum = 0;
  let left = 0;

  for (let right = 0; right < n; right++) {
    // Add current element to window
    currentSum += nums[right];
    freq.set(nums[right], (freq.get(nums[right]) || 0) + 1);

    // If window size exceeds k, remove leftmost element
    if (right - left + 1 > k) {
      currentSum -= nums[left];
      freq.set(nums[left], freq.get(nums[left]) - 1);
      if (freq.get(nums[left]) === 0) {
        freq.delete(nums[left]);
      }
      left++;
    }

    // If current element creates a duplicate, contract window from left
    // until duplicate is removed
    while (freq.get(nums[right]) > 1) {
      currentSum -= nums[left];
      freq.set(nums[left], freq.get(nums[left]) - 1);
      if (freq.get(nums[left]) === 0) {
        freq.delete(nums[left]);
      }
      left++;
    }

    // Check if we have a valid window of size k with all distinct elements
    if (right - left + 1 === k) {
      // All elements are distinct (implied by while loop above)
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(k)
class Solution {
    public long maximumSubarraySum(int[] nums, int k) {
        /**
         * Find maximum sum of length-k subarrays with all distinct elements.
         *
         * @param nums Array of integers
         * @param k Length of subarray
         * @return Maximum sum of valid subarrays, or 0 if none exist
         */
        int n = nums.length;
        if (n < k) return 0;

        Map<Integer, Integer> freq = new HashMap<>();  // Track frequencies in current window
        long currentSum = 0;
        long maxSum = 0;
        int left = 0;

        for (int right = 0; right < n; right++) {
            // Add current element to window
            currentSum += nums[right];
            freq.put(nums[right], freq.getOrDefault(nums[right], 0) + 1);

            // If window size exceeds k, remove leftmost element
            if (right - left + 1 > k) {
                currentSum -= nums[left];
                freq.put(nums[left], freq.get(nums[left]) - 1);
                if (freq.get(nums[left]) == 0) {
                    freq.remove(nums[left]);
                }
                left++;
            }

            // If current element creates a duplicate, contract window from left
            // until duplicate is removed
            while (freq.get(nums[right]) > 1) {
                currentSum -= nums[left];
                freq.put(nums[left], freq.get(nums[left]) - 1);
                if (freq.get(nums[left]) == 0) {
                    freq.remove(nums[left]);
                }
                left++;
            }

            // Check if we have a valid window of size k with all distinct elements
            if (right - left + 1 == k) {
                // All elements are distinct (implied by while loop above)
                maxSum = Math.max(maxSum, currentSum);
            }
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - Each element is added to the window once and removed at most once. The `while` loop for handling duplicates doesn't increase the complexity because each element is processed at most twice (added once, removed once). This is amortized O(1) per element.

**Space Complexity: O(k)** - In the worst case, our frequency map stores up to k distinct elements when we have a valid window. Even when contracting due to duplicates, the map size never exceeds k.

## Common Mistakes

1. **Forgetting to handle the case when n < k**: Always check if the array is long enough to form a length-k subarray. Return 0 immediately if not.

2. **Not properly cleaning up the frequency map**: When an element's count drops to 0, remove it from the map. This ensures `freq.get()` returns `undefined`/`null`/throws exception instead of 0, which is important for checking duplicates.

3. **Using a set instead of a frequency map**: A set can tell you if an element exists, but not how many times. When you have duplicates, you need to know if removing one left element eliminates the duplicate or if there are multiple copies.

4. **Incorrect window contraction logic**: When you encounter a duplicate, you must remove elements from the left until ALL occurrences of the duplicate are gone, not just one. The while loop condition `freq[nums[right]] > 1` handles this correctly.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Fixed-size sliding window**: Used in problems like "Maximum Average Subarray I" where you need to process all contiguous subarrays of a fixed size.

2. **Sliding window with frequency tracking**: Used when the window has constraints on element uniqueness or frequency. Similar problems include:
   - **Longest Substring Without Repeating Characters**: Find the longest window with all distinct characters (variable window size)
   - **Fruit Into Baskets**: Find the longest window with at most 2 distinct elements
   - **Minimum Window Substring**: Find the smallest window containing all characters of a pattern

The key difference here is the **fixed window size** combined with the **distinctness requirement**, which makes the contraction logic more specific.

## Key Takeaways

1. **Sliding window + hash map is powerful**: When you need to track element frequencies in a contiguous subarray while maintaining window constraints, this combination is often the optimal approach.

2. **Handle duplicates by contracting from the left**: When a new element creates a duplicate, systematically remove elements from the left until the duplicate is eliminated. This ensures the window always maintains the required properties.

3. **Amortized analysis matters**: Even though we have nested loops (for + while), each element is processed at most twice, giving us O(n) time. Don't dismiss an approach just because it has nested loops—analyze the actual operations.

Related problems: [Max Consecutive Ones III](/problem/max-consecutive-ones-iii), [Longest Nice Subarray](/problem/longest-nice-subarray), [Optimal Partition of String](/problem/optimal-partition-of-string)
