---
title: "How to Solve Find the Power of K-Size Subarrays I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Power of K-Size Subarrays I. Medium difficulty, 62.1% acceptance rate. Topics: Array, Sliding Window."
date: "2026-08-30"
category: "dsa-patterns"
tags: ["find-the-power-of-k-size-subarrays-i", "array", "sliding-window", "medium"]
---

# How to Solve Find the Power of K-Size Subarrays I

This problem asks us to evaluate every contiguous subarray of length `k` in an array `nums` and determine its "power": the maximum element if all elements are consecutive and sorted in ascending order, otherwise -1. What makes this problem interesting is that we need to check two conditions simultaneously: whether the subarray is strictly increasing by exactly 1 each step, and then find its maximum. The challenge is doing this efficiently for all overlapping subarrays.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 3, 5, 3]` with `k = 3`.

We need to examine all length-3 subarrays:

1. **Subarray [1, 2, 3]**: Elements are 1, 2, 3 → consecutive and sorted? Yes (2 = 1+1, 3 = 2+1). Power = maximum = 3.
2. **Subarray [2, 3, 5]**: Elements are 2, 3, 5 → 3 = 2+1 ✓, but 5 ≠ 3+1 ✗. Not consecutive. Power = -1.
3. **Subarray [3, 5, 3]**: Elements are 3, 5, 3 → 5 ≠ 3+1 ✗, plus it's not even sorted. Power = -1.

So the output would be `[3, -1, -1]`.

Notice that when we slide from the first to the second subarray, we remove `1` and add `5`. The "consecutive" property broke because the new element `5` isn't exactly one more than the previous last element `3`. This suggests we need to track whether each adjacent pair in the current window satisfies `nums[i] = nums[i-1] + 1`.

## Brute Force Approach

A naive solution would check each subarray independently:

For each starting index `i` from 0 to `n-k`:

1. Extract the subarray `nums[i:i+k]`
2. Check if it's sorted and consecutive by verifying `nums[i+j] = nums[i+j-1] + 1` for all `j` from 1 to `k-1`
3. If true, compute `max(nums[i:i+k])`; otherwise, output -1

The time complexity is O(n × k) because for each of the (n-k+1) subarrays, we do O(k) work checking the consecutive property and finding the maximum. For large `n` and `k`, this becomes inefficient.

What's particularly wasteful is that adjacent subarrays overlap by `k-1` elements. When we slide the window by one position, we're re-checking many of the same comparisons. The key insight is that we can maintain information about the current window as we slide.

## Optimized Approach

We can solve this efficiently using a **sliding window** approach with careful tracking:

**Key Insight**: For a window to be consecutive and sorted:

1. All adjacent pairs must satisfy `nums[i] = nums[i-1] + 1`
2. This automatically ensures the array is sorted in ascending order
3. The maximum element in a consecutive sorted window is simply the last element (or equivalently, the first element + k - 1)

**Optimization Strategy**:

- Instead of checking all `k-1` pairs for each window from scratch, maintain a count of how many consecutive pairs in the current window satisfy the condition.
- When we slide the window right by one:
  - Remove the leftmost pair (if it was consecutive, decrement our count)
  - Add the new rightmost pair (if it's consecutive, increment our count)
- If our count equals `k-1`, then ALL pairs in the window are consecutive.
- The maximum is simply `nums[right]` (the last element of the window) when the window is valid.

This reduces the work to O(1) per window transition after initial setup, giving us O(n) total time.

## Optimal Solution

Here's the complete implementation using the sliding window approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def resultsArray(nums, k):
    n = len(nums)
    # Not enough elements for any k-length subarray
    if k > n:
        return []

    result = []
    consecutive_count = 0

    # Initialize: check first k-1 pairs
    for i in range(1, k):
        if nums[i] == nums[i-1] + 1:
            consecutive_count += 1

    # First window result
    if consecutive_count == k - 1:
        result.append(nums[k-1])  # Last element is max in consecutive sorted window
    else:
        result.append(-1)

    # Slide window from index 1 to n-k
    for i in range(1, n - k + 1):
        # Remove leftmost pair (i-1, i) from previous window
        if nums[i] == nums[i-1] + 1:
            consecutive_count -= 1

        # Add new rightmost pair (i+k-2, i+k-1) to current window
        if nums[i+k-1] == nums[i+k-2] + 1:
            consecutive_count += 1

        # Check if current window has all consecutive pairs
        if consecutive_count == k - 1:
            result.append(nums[i+k-1])  # Last element is max
        else:
            result.append(-1)

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function resultsArray(nums, k) {
  const n = nums.length;
  // Not enough elements for any k-length subarray
  if (k > n) {
    return [];
  }

  const result = [];
  let consecutiveCount = 0;

  // Initialize: check first k-1 pairs
  for (let i = 1; i < k; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      consecutiveCount++;
    }
  }

  // First window result
  if (consecutiveCount === k - 1) {
    result.push(nums[k - 1]); // Last element is max in consecutive sorted window
  } else {
    result.push(-1);
  }

  // Slide window from index 1 to n-k
  for (let i = 1; i <= n - k; i++) {
    // Remove leftmost pair (i-1, i) from previous window
    if (nums[i] === nums[i - 1] + 1) {
      consecutiveCount--;
    }

    // Add new rightmost pair (i+k-2, i+k-1) to current window
    if (nums[i + k - 1] === nums[i + k - 2] + 1) {
      consecutiveCount++;
    }

    // Check if current window has all consecutive pairs
    if (consecutiveCount === k - 1) {
      result.push(nums[i + k - 1]); // Last element is max
    } else {
      result.push(-1);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
public int[] resultsArray(int[] nums, int k) {
    int n = nums.length;
    // Not enough elements for any k-length subarray
    if (k > n) {
        return new int[0];
    }

    int[] result = new int[n - k + 1];
    int consecutiveCount = 0;

    // Initialize: check first k-1 pairs
    for (int i = 1; i < k; i++) {
        if (nums[i] == nums[i-1] + 1) {
            consecutiveCount++;
        }
    }

    // First window result
    if (consecutiveCount == k - 1) {
        result[0] = nums[k-1];  // Last element is max in consecutive sorted window
    } else {
        result[0] = -1;
    }

    // Slide window from index 1 to n-k
    for (int i = 1; i <= n - k; i++) {
        // Remove leftmost pair (i-1, i) from previous window
        if (nums[i] == nums[i-1] + 1) {
            consecutiveCount--;
        }

        // Add new rightmost pair (i+k-2, i+k-1) to current window
        if (nums[i+k-1] == nums[i+k-2] + 1) {
            consecutiveCount++;
        }

        // Check if current window has all consecutive pairs
        if (consecutiveCount == k - 1) {
            result[i] = nums[i+k-1];  // Last element is max
        } else {
            result[i] = -1;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We initialize by checking the first `k-1` pairs: O(k)
- Then we slide the window `n-k` times, doing O(1) work per slide
- Total: O(k + (n-k)) = O(n)

**Space Complexity**: O(1) excluding the output array

- We only use a few integer variables (`consecutive_count`, loop indices)
- The output array itself is O(n-k+1) but is required by the problem

## Common Mistakes

1. **Off-by-one errors in window boundaries**: When sliding the window, it's easy to mis-index when removing the left pair or adding the right pair. Remember: when window starts at index `i`, it ends at `i+k-1`. The left pair to remove is `(i-1, i)` and the new right pair is `(i+k-2, i+k-1)`.

2. **Forgetting to handle k > n**: If `k` is larger than the array length, there are no valid subarrays. The problem states `k` is positive but doesn't guarantee `k ≤ n`. Always check this edge case.

3. **Incorrect consecutive check**: The problem requires elements to be **consecutive integers** (each exactly 1 more than the previous), not just sorted. `[1, 3, 4]` is sorted but not consecutive. `[3, 2, 1]` is consecutive but descending, which also fails.

4. **Unnecessary maximum computation**: When the window is consecutive and sorted, the maximum is simply the last element (or first + k - 1). Some candidates waste time calling `max()` on the window, which is O(k) instead of O(1).

## When You'll See This Pattern

The sliding window pattern with incremental updates appears in many array problems:

1. **Maximum Sum of Distinct Subarrays With Length K** (LeetCode 2461): Similar structure but instead of tracking consecutive pairs, you track unique elements using a hash map and maintain a running sum.

2. **Sliding Window Maximum** (LeetCode 239): Here you maintain the maximum in a sliding window using a deque, updating it as the window slides.

3. **Contains Duplicate II** (LeetCode 219): Check if there are duplicate elements within distance k using a sliding window with a hash set.

The common theme is maintaining some property of a window (sum, maximum, element counts, consecutive pairs) and updating it efficiently as the window slides by removing the left element and adding the right element.

## Key Takeaways

1. **Sliding window optimization**: When processing all contiguous subarrays of fixed length, avoid recomputing everything from scratch. Instead, maintain the window state and update it incrementally as you slide.

2. **Track counts, not entire windows**: For properties that can be expressed as counts (like how many pairs are consecutive), track just the count rather than the full window content. This reduces space usage and makes updates O(1).

3. **Look for mathematical simplifications**: In a consecutive sorted window, the maximum is simply the last element. Recognizing such properties eliminates unnecessary computations.

Related problems: [Maximum Sum of Distinct Subarrays With Length K](/problem/maximum-sum-of-distinct-subarrays-with-length-k)
