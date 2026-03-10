---
title: "How to Solve Minimum Size Subarray Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Size Subarray Sum. Medium difficulty, 51.1% acceptance rate. Topics: Array, Binary Search, Sliding Window, Prefix Sum."
date: "2026-06-12"
category: "dsa-patterns"
tags: ["minimum-size-subarray-sum", "array", "binary-search", "sliding-window", "medium"]
---

# How to Solve Minimum Size Subarray Sum

This problem asks us to find the shortest contiguous subarray whose sum is at least a given target value. What makes it interesting is that it appears simple but requires careful optimization—a brute force solution is too slow, forcing us to use either a sliding window or binary search approach. The challenge lies in efficiently tracking subarray sums without recalculating everything from scratch.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [2, 3, 1, 2, 4, 3]` with `target = 7`.

**Step 1:** Start with left pointer at index 0, right pointer at index 0, current sum = 2

- Sum = 2 < 7 → expand window by moving right pointer

**Step 2:** left=0, right=1, sum = 2+3 = 5

- Sum = 5 < 7 → expand window

**Step 3:** left=0, right=2, sum = 5+1 = 6

- Sum = 6 < 7 → expand window

**Step 4:** left=0, right=3, sum = 6+2 = 8

- Sum = 8 ≥ 7 → Found valid subarray of length 4 (indices 0-3)
- Try to shrink window: move left pointer to index 1, subtract nums[0]=2 from sum
- New sum = 6, which is < 7 → stop shrinking

**Step 5:** left=1, right=4, sum = 6+4 = 10

- Sum = 10 ≥ 7 → Found valid subarray of length 4 (indices 1-4)
- Shrink window: move left to index 2, subtract nums[1]=3
- New sum = 7 ≥ 7 → Found shorter subarray of length 3 (indices 2-4)
- Shrink again: move left to index 3, subtract nums[2]=1
- New sum = 6 < 7 → stop shrinking

**Step 6:** left=3, right=5, sum = 6+3 = 9

- Sum = 9 ≥ 7 → Found valid subarray of length 3 (indices 3-5)
- Shrink window: move left to index 4, subtract nums[3]=2
- New sum = 7 ≥ 7 → Found shorter subarray of length 2 (indices 4-5)
- Shrink again: move left to index 5, subtract nums[4]=4
- New sum = 3 < 7 → stop shrinking

**Step 7:** right pointer reaches end of array, algorithm terminates

- Minimum length found = 2 (subarray [4, 3])

## Brute Force Approach

The most straightforward solution is to check every possible subarray. For each starting index `i`, we iterate through all ending indices `j ≥ i`, calculate the sum, and track the minimum length where sum ≥ target.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def minSubArrayLenBruteForce(target, nums):
    n = len(nums)
    min_length = float('inf')

    # Try every possible starting point
    for i in range(n):
        # Try every possible ending point
        for j in range(i, n):
            # Calculate sum from i to j
            current_sum = 0
            for k in range(i, j + 1):
                current_sum += nums[k]

            # Check if this subarray meets the target
            if current_sum >= target:
                min_length = min(min_length, j - i + 1)
                # We can break early since longer subarrays won't be shorter
                break

    return 0 if min_length == float('inf') else min_length
```

```javascript
// Time: O(n³) | Space: O(1)
function minSubArrayLenBruteForce(target, nums) {
  const n = nums.length;
  let minLength = Infinity;

  // Try every possible starting point
  for (let i = 0; i < n; i++) {
    // Try every possible ending point
    for (let j = i; j < n; j++) {
      // Calculate sum from i to j
      let currentSum = 0;
      for (let k = i; k <= j; k++) {
        currentSum += nums[k];
      }

      // Check if this subarray meets the target
      if (currentSum >= target) {
        minLength = Math.min(minLength, j - i + 1);
        // We can break early since longer subarrays won't be shorter
        break;
      }
    }
  }

  return minLength === Infinity ? 0 : minLength;
}
```

```java
// Time: O(n³) | Space: O(1)
public int minSubArrayLenBruteForce(int target, int[] nums) {
    int n = nums.length;
    int minLength = Integer.MAX_VALUE;

    // Try every possible starting point
    for (int i = 0; i < n; i++) {
        // Try every possible ending point
        for (int j = i; j < n; j++) {
            // Calculate sum from i to j
            int currentSum = 0;
            for (int k = i; k <= j; k++) {
                currentSum += nums[k];
            }

            // Check if this subarray meets the target
            if (currentSum >= target) {
                minLength = Math.min(minLength, j - i + 1);
                // We can break early since longer subarrays won't be shorter
                break;
            }
        }
    }

    return minLength == Integer.MAX_VALUE ? 0 : minLength;
}
```

</div>

**Why this is insufficient:** This approach takes O(n³) time because for each of the O(n²) subarrays, we calculate the sum in O(n) time. For an array of size 10,000, this would require about 1 trillion operations—far too slow.

We can optimize to O(n²) by using prefix sums or cumulative sums, but even O(n²) is too slow for large inputs (n up to 10⁵ would require 10¹⁰ operations).

## Optimized Approach

The key insight is that we can use a **sliding window** approach. Here's the reasoning:

1. **Expand the window** by moving the right pointer until the sum meets or exceeds the target
2. **Shrink the window** by moving the left pointer while the sum still meets the target, tracking the minimum length
3. **Repeat** until we've processed the entire array

Why does this work? Because all numbers are positive, when we shrink the window, the sum decreases. This monotonic property ensures that once we find a valid window, we can safely move the left pointer forward without missing any potentially shorter valid windows starting from the current left position.

Alternative approach: We could use **binary search** on the window size combined with prefix sums. For each possible window size k, we check if any subarray of length k has sum ≥ target. This takes O(n log n) time but is less intuitive than the sliding window approach.

## Optimal Solution

The sliding window solution runs in O(n) time with O(1) space and is the most elegant approach for this problem.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minSubArrayLen(target, nums):
    """
    Find the minimal length of a contiguous subarray whose sum is at least target.

    Args:
        target: The minimum sum required
        nums: List of positive integers

    Returns:
        Minimum subarray length, or 0 if no such subarray exists
    """
    n = len(nums)
    left = 0           # Left pointer of the sliding window
    current_sum = 0    # Sum of elements in the current window
    min_length = float('inf')  # Track the minimum valid length found

    # Expand the window by moving the right pointer
    for right in range(n):
        # Add the current element to the window sum
        current_sum += nums[right]

        # While the current window sum meets or exceeds the target
        while current_sum >= target:
            # Update the minimum length if current window is shorter
            min_length = min(min_length, right - left + 1)

            # Shrink the window from the left
            current_sum -= nums[left]
            left += 1

    # Return 0 if no valid subarray was found, otherwise return min_length
    return 0 if min_length == float('inf') else min_length
```

```javascript
// Time: O(n) | Space: O(1)
function minSubArrayLen(target, nums) {
  const n = nums.length;
  let left = 0; // Left pointer of the sliding window
  let currentSum = 0; // Sum of elements in the current window
  let minLength = Infinity; // Track the minimum valid length found

  // Expand the window by moving the right pointer
  for (let right = 0; right < n; right++) {
    // Add the current element to the window sum
    currentSum += nums[right];

    // While the current window sum meets or exceeds the target
    while (currentSum >= target) {
      // Update the minimum length if current window is shorter
      minLength = Math.min(minLength, right - left + 1);

      // Shrink the window from the left
      currentSum -= nums[left];
      left++;
    }
  }

  // Return 0 if no valid subarray was found, otherwise return minLength
  return minLength === Infinity ? 0 : minLength;
}
```

```java
// Time: O(n) | Space: O(1)
public int minSubArrayLen(int target, int[] nums) {
    int n = nums.length;
    int left = 0;           // Left pointer of the sliding window
    int currentSum = 0;     // Sum of elements in the current window
    int minLength = Integer.MAX_VALUE; // Track the minimum valid length found

    // Expand the window by moving the right pointer
    for (int right = 0; right < n; right++) {
        // Add the current element to the window sum
        currentSum += nums[right];

        // While the current window sum meets or exceeds the target
        while (currentSum >= target) {
            // Update the minimum length if current window is shorter
            minLength = Math.min(minLength, right - left + 1);

            // Shrink the window from the left
            currentSum -= nums[left];
            left++;
        }
    }

    // Return 0 if no valid subarray was found, otherwise return minLength
    return minLength == Integer.MAX_VALUE ? 0 : minLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each element is added to the window exactly once (when `right` pointer passes it)
- Each element is removed from the window at most once (when `left` pointer passes it)
- Even though we have a nested `while` loop, each element is processed at most twice (once by `right`, once by `left`), giving us O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for pointers and counters
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting that all numbers are positive**: This is crucial for the sliding window approach. If negative numbers were allowed, shrinking the window might not decrease the sum, and we'd need a different approach (like using a monotonic queue or prefix sums with a hash map).

2. **Not handling the "no valid subarray" case**: Candidates often forget to return 0 when no subarray meets the target. Always initialize `min_length` to infinity or a very large value and check if it was updated before returning.

3. **Off-by-one errors in window length calculation**: The formula `right - left + 1` is easy to get wrong. Remember that when `right` and `left` point to the same index, the window length is 1, not 0.

4. **Using `if` instead of `while` for shrinking**: Some candidates use `if (current_sum >= target)` instead of `while`. This only shrinks the window once even if it could be shrunk further to find a shorter valid subarray.

## When You'll See This Pattern

The sliding window pattern appears in problems where you need to find a contiguous subarray/substring that satisfies certain conditions:

1. **Minimum Window Substring (Hard)**: Find the minimum window in string S that contains all characters of string T. This is essentially the same pattern but with character counts instead of sums.

2. **Longest Substring Without Repeating Characters (Medium)**: Find the longest substring without repeating characters. Here you expand until you find a duplicate, then shrink until the duplicate is removed.

3. **Fruit Into Baskets (Medium)**: Find the longest contiguous subarray with at most 2 distinct values. The window expands until a third distinct value appears, then shrinks until only 2 distinct values remain.

4. **Maximum Size Subarray Sum Equals k (Medium)**: While this uses prefix sums and a hash map instead of sliding window, it's conceptually similar—finding subarrays with a specific sum property.

## Key Takeaways

1. **Sliding window is ideal for contiguous subarray problems with positive numbers**: When you need to find a subarray that meets a sum condition and all numbers are non-negative, sliding window gives you an O(n) solution.

2. **The expand-shrink pattern**: Expand the window until the condition is met, then shrink it while the condition still holds to find the minimal valid window.

3. **Recognize when sliding window applies**: Look for problems asking for "minimum/maximum length subarray" with sum/product conditions, especially when the array contains only positive numbers.

Related problems: [Minimum Window Substring](/problem/minimum-window-substring), [Maximum Size Subarray Sum Equals k](/problem/maximum-size-subarray-sum-equals-k), [Maximum Length of Repeated Subarray](/problem/maximum-length-of-repeated-subarray)
