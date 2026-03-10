---
title: "How to Solve Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold. Medium difficulty, 72.3% acceptance rate. Topics: Array, Sliding Window."
date: "2026-03-13"
category: "dsa-patterns"
tags:
  [
    "number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold",
    "array",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold

You're given an array of integers `arr` and two integers `k` and `threshold`. Your task is to count how many contiguous subarrays of exactly size `k` have an average value greater than or equal to `threshold`. This problem is interesting because it looks like it requires calculating averages for many overlapping windows, but there's a clever optimization that makes it efficient. The key insight is that you don't actually need to calculate the average for each window—you can work with sums instead.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `arr = [2, 1, 3, 4, 1]`
- `k = 3`
- `threshold = 2`

We need to find all subarrays of size 3 where the average ≥ 2. Since average = sum/k, this is equivalent to finding subarrays where sum ≥ threshold × k = 2 × 3 = 6.

**Step 1: First window (indices 0-2)**
Elements: [2, 1, 3], sum = 2 + 1 + 3 = 6
Is sum ≥ 6? Yes (6 ≥ 6), so count = 1

**Step 2: Slide window right (indices 1-3)**
Remove left element (2), add right element (4)
New sum = 6 - 2 + 4 = 8
Is sum ≥ 6? Yes (8 ≥ 6), so count = 2

**Step 3: Slide window right (indices 2-4)**
Remove left element (1), add right element (1)
New sum = 8 - 1 + 1 = 8
Is sum ≥ 6? Yes (8 ≥ 6), so count = 3

We've examined all possible windows of size 3, so the answer is 3.

Notice the pattern: instead of recalculating each window's sum from scratch (which would be O(k) per window), we maintain a running sum and update it by subtracting the element leaving the window and adding the element entering it. This is the sliding window technique.

## Brute Force Approach

The most straightforward approach is to check every possible subarray of size `k`:

1. For each starting index `i` from 0 to `n-k` (where `n` is the array length)
2. Calculate the sum of elements from index `i` to `i+k-1`
3. Check if the average (sum/k) ≥ threshold
4. Count how many windows satisfy this condition

The problem with this approach is efficiency. For each of the `n-k+1` windows, we need to sum `k` elements, giving us O(k × (n-k+1)) time complexity, which simplifies to O(n×k). For large arrays with large `k`, this becomes too slow.

<div class="code-group">

```python
# Time: O(n*k) | Space: O(1)
def numOfSubarrays_brute(arr, k, threshold):
    n = len(arr)
    count = 0
    target_sum = k * threshold  # We can compare sum directly instead of average

    # Check each possible starting position
    for i in range(n - k + 1):
        # Calculate sum of current window
        window_sum = 0
        for j in range(i, i + k):
            window_sum += arr[j]

        # Check if sum meets threshold
        if window_sum >= target_sum:
            count += 1

    return count
```

```javascript
// Time: O(n*k) | Space: O(1)
function numOfSubarraysBrute(arr, k, threshold) {
  const n = arr.length;
  let count = 0;
  const targetSum = k * threshold; // Compare sum instead of average

  // Check each possible starting position
  for (let i = 0; i <= n - k; i++) {
    // Calculate sum of current window
    let windowSum = 0;
    for (let j = i; j < i + k; j++) {
      windowSum += arr[j];
    }

    // Check if sum meets threshold
    if (windowSum >= targetSum) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n*k) | Space: O(1)
public int numOfSubarraysBrute(int[] arr, int k, int threshold) {
    int n = arr.length;
    int count = 0;
    int targetSum = k * threshold;  // Compare sum instead of average

    // Check each possible starting position
    for (int i = 0; i <= n - k; i++) {
        // Calculate sum of current window
        int windowSum = 0;
        for (int j = i; j < i + k; j++) {
            windowSum += arr[j];
        }

        // Check if sum meets threshold
        if (windowSum >= targetSum) {
            count++;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that consecutive windows of size `k` overlap significantly. When we slide the window one position to the right, `k-1` elements stay the same, and only 2 elements change: we lose the leftmost element and gain a new rightmost element.

This observation leads to the sliding window technique:

1. Calculate the sum of the first `k` elements
2. Check if this sum meets the threshold requirement
3. Slide the window right by one position:
   - Subtract the element that's leaving the window (at position `i`)
   - Add the element that's entering the window (at position `i+k`)
4. Repeat until we've examined all windows

This approach reduces the time complexity from O(n×k) to O(n) because we process each element at most twice (once when added, once when removed).

## Optimal Solution

Here's the efficient sliding window implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numOfSubarrays(arr, k, threshold):
    """
    Count subarrays of size k with average >= threshold.

    Args:
        arr: List of integers
        k: Size of subarray
        threshold: Minimum average value

    Returns:
        Number of qualifying subarrays
    """
    n = len(arr)
    count = 0

    # Precompute target sum to avoid division and floating-point operations
    target_sum = k * threshold

    # Calculate sum of first window
    window_sum = sum(arr[:k])

    # Check first window
    if window_sum >= target_sum:
        count += 1

    # Slide window across the array
    for i in range(k, n):
        # Update window sum: remove leftmost element, add new rightmost element
        window_sum = window_sum - arr[i - k] + arr[i]

        # Check if current window meets threshold
        if window_sum >= target_sum:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function numOfSubarrays(arr, k, threshold) {
  /**
   * Count subarrays of size k with average >= threshold.
   *
   * @param {number[]} arr - Array of integers
   * @param {number} k - Size of subarray
   * @param {number} threshold - Minimum average value
   * @return {number} Number of qualifying subarrays
   */
  const n = arr.length;
  let count = 0;

  // Precompute target sum to avoid division and floating-point operations
  const targetSum = k * threshold;

  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  // Check first window
  if (windowSum >= targetSum) {
    count++;
  }

  // Slide window across the array
  for (let i = k; i < n; i++) {
    // Update window sum: remove leftmost element, add new rightmost element
    windowSum = windowSum - arr[i - k] + arr[i];

    // Check if current window meets threshold
    if (windowSum >= targetSum) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int numOfSubarrays(int[] arr, int k, int threshold) {
    /**
     * Count subarrays of size k with average >= threshold.
     *
     * @param arr Array of integers
     * @param k Size of subarray
     * @param threshold Minimum average value
     * @return Number of qualifying subarrays
     */
    int n = arr.length;
    int count = 0;

    // Precompute target sum to avoid division and floating-point operations
    int targetSum = k * threshold;

    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }

    // Check first window
    if (windowSum >= targetSum) {
        count++;
    }

    // Slide window across the array
    for (int i = k; i < n; i++) {
        // Update window sum: remove leftmost element, add new rightmost element
        windowSum = windowSum - arr[i - k] + arr[i];

        // Check if current window meets threshold
        if (windowSum >= targetSum) {
            count++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We calculate the initial window sum in O(k) time
- We then perform n-k iterations, each taking O(1) time to update the window sum
- Total time = O(k) + O(n-k) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (count, window_sum, target_sum)
- No additional data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in window boundaries**: When sliding the window, the index calculation `arr[i - k]` for the element leaving the window is tricky. Remember that when `i` represents the new right boundary, `i-k` is the element that's leaving. Test with small examples to verify.

2. **Using floating-point division for comparison**: Instead of calculating `sum/k >= threshold`, multiply both sides by `k` to get `sum >= k * threshold`. This avoids floating-point precision issues and is more efficient.

3. **Not handling the first window separately**: Some implementations try to use a single loop that starts from index 0, but this makes the window update logic more complex. It's cleaner to initialize with the first window, then slide.

4. **Forgetting to check when k > n**: If `k` is greater than the array length, there are no subarrays of size `k`. While the loop conditions in our solution handle this correctly (the loop won't execute), it's worth mentioning this edge case during interviews.

## When You'll See This Pattern

The sliding window technique appears in many array problems where you need to examine contiguous subarrays of a fixed size or where the window size changes based on certain conditions. Here are some related problems:

1. **K Radius Subarray Averages (LeetCode 2090)**: Very similar pattern—you need to compute averages for sliding windows, but here you return an array of averages instead of counting them.

2. **Maximum Average Subarray I (LeetCode 643)**: Almost identical to this problem, but you find the maximum average instead of counting averages above a threshold.

3. **Minimum Size Subarray Sum (LeetCode 209)**: Uses a variable-size sliding window to find the smallest subarray with sum ≥ target.

4. **Fruit Into Baskets (LeetCode 904)**: Uses sliding window with a hash map to track counts of different types.

The pattern to recognize: when a problem asks about "contiguous subarrays" or "consecutive elements" and involves sums, averages, or counts, sliding window should be your first consideration.

## Key Takeaways

1. **Convert average comparisons to sum comparisons**: Multiply the threshold by `k` to work with integer sums instead of floating-point averages. This is both more efficient and avoids precision issues.

2. **Sliding window optimizes overlapping computations**: When consecutive windows share most of their elements, maintain a running sum and update it incrementally rather than recalculating from scratch.

3. **The sliding window template**: Initialize with the first window, check it, then slide while updating the window state. This pattern works for many fixed-size window problems.

Remember: sliding window is your go-to technique for problems involving contiguous subarrays, especially when the window size is fixed or when you can determine when to expand/contract the window based on the problem constraints.

Related problems: [K Radius Subarray Averages](/problem/k-radius-subarray-averages), [Count Subarrays With Median K](/problem/count-subarrays-with-median-k), [Apply Operations to Make All Array Elements Equal to Zero](/problem/apply-operations-to-make-all-array-elements-equal-to-zero)
