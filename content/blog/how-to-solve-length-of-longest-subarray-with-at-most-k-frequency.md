---
title: "How to Solve Length of Longest Subarray With at Most K Frequency — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Length of Longest Subarray With at Most K Frequency. Medium difficulty, 56.4% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2026-02-25"
category: "dsa-patterns"
tags:
  [
    "length-of-longest-subarray-with-at-most-k-frequency",
    "array",
    "hash-table",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Length of Longest Subarray With at Most K Frequency

This problem asks us to find the longest contiguous subarray where no element appears more than `k` times. The challenge lies in efficiently tracking element frequencies while exploring different subarrays. What makes this interesting is that it's a classic sliding window problem with a frequency constraint—similar to finding the longest substring with at most K distinct characters, but with a frequency limit instead of a distinct count limit.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 1, 2, 3, 1, 2]` with `k = 2`.

We'll use a sliding window approach with two pointers `left` and `right`:

- Start with `left = 0`, `right = 0`, window = `[1]`, frequencies = `{1: 1}`
- Expand right: `right = 1`, window = `[1, 2]`, frequencies = `{1: 1, 2: 1}`
- Expand right: `right = 2`, window = `[1, 2, 3]`, frequencies = `{1: 1, 2: 1, 3: 1}`
- Expand right: `right = 3`, window = `[1, 2, 3, 1]`, frequencies = `{1: 2, 2: 1, 3: 1}` (still valid since 1 appears ≤ 2 times)
- Expand right: `right = 4`, window = `[1, 2, 3, 1, 2]`, frequencies = `{1: 2, 2: 2, 3: 1}` (still valid)
- Expand right: `right = 5`, window = `[1, 2, 3, 1, 2, 3]`, frequencies = `{1: 2, 2: 2, 3: 2}` (still valid)
- Expand right: `right = 6`, window = `[1, 2, 3, 1, 2, 3, 1]`, frequencies = `{1: 3, 2: 2, 3: 2}` (INVALID: 1 appears 3 times > k=2)

Now we need to shrink from the left until the window becomes valid again:

- Move `left` to 1: window = `[2, 3, 1, 2, 3, 1]`, frequencies = `{1: 2, 2: 2, 3: 2}` (valid again)
- Continue expanding right: `right = 7`, window = `[2, 3, 1, 2, 3, 1, 2]`, frequencies = `{1: 2, 2: 3, 3: 2}` (INVALID: 2 appears 3 times)
- Move `left` to 2: window = `[3, 1, 2, 3, 1, 2]`, frequencies = `{1: 2, 2: 2, 3: 2}` (valid)

The longest valid window we found has length 6.

## Brute Force Approach

A naive approach would check every possible subarray. For each starting index `i`, we would expand `j` from `i` to the end, tracking frequencies in a hash map. When any element's frequency exceeds `k`, we stop expanding that window and move to the next starting index.

The brute force code would look like this:

```python
def maxSubarrayLength(nums, k):
    n = len(nums)
    max_len = 0

    for i in range(n):
        freq = {}
        for j in range(i, n):
            freq[nums[j]] = freq.get(nums[j], 0) + 1
            if freq[nums[j]] > k:
                break
            max_len = max(max_len, j - i + 1)

    return max_len
```

**Why this is inefficient:** This approach has O(n²) time complexity in the worst case (when k is large enough that we check almost all subarrays). For an array of length 10⁵ (typical LeetCode constraint), this would be far too slow (10¹⁰ operations).

## Optimized Approach

The key insight is that we can use a **sliding window** with two pointers. As we expand the right pointer, we add elements to our frequency count. When any element's frequency exceeds `k`, we shrink the window from the left until all elements are within the frequency limit again.

This works because:

1. If a window becomes invalid by adding a new element, we need to remove elements from the left until it's valid again
2. We never need to go back and check previous starting points—the sliding window efficiently explores all valid subarrays
3. We maintain the maximum window size seen so far

The critical realization is that we only move the left pointer forward, never backward, which gives us O(n) time complexity.

## Optimal Solution

Here's the complete solution using a sliding window with frequency tracking:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxSubarrayLength(nums, k):
    """
    Find the longest subarray where no element appears more than k times.

    Args:
        nums: List of integers
        k: Maximum allowed frequency for any element

    Returns:
        Length of the longest valid subarray
    """
    # Dictionary to track frequency of each element in current window
    freq = {}

    # Left pointer of sliding window
    left = 0

    # Track maximum length found
    max_len = 0

    # Expand window with right pointer
    for right in range(len(nums)):
        # Add current element to frequency count
        freq[nums[right]] = freq.get(nums[right], 0) + 1

        # If current element exceeds k frequency, shrink window from left
        # We use a while loop because multiple elements might need removal
        while freq[nums[right]] > k:
            # Remove leftmost element from frequency count
            freq[nums[left]] -= 1
            # If frequency becomes 0, remove from dictionary to save space
            if freq[nums[left]] == 0:
                del freq[nums[left]]
            # Move left pointer to shrink window
            left += 1

        # Update maximum length if current window is larger
        # Window size = right - left + 1
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
function maxSubarrayLength(nums, k) {
  /**
   * Find the longest subarray where no element appears more than k times.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Maximum allowed frequency for any element
   * @return {number} Length of the longest valid subarray
   */
  // Map to track frequency of each element in current window
  const freq = new Map();

  // Left pointer of sliding window
  let left = 0;

  // Track maximum length found
  let maxLen = 0;

  // Expand window with right pointer
  for (let right = 0; right < nums.length; right++) {
    // Add current element to frequency count
    freq.set(nums[right], (freq.get(nums[right]) || 0) + 1);

    // If current element exceeds k frequency, shrink window from left
    // We use a while loop because multiple elements might need removal
    while (freq.get(nums[right]) > k) {
      // Remove leftmost element from frequency count
      freq.set(nums[left], freq.get(nums[left]) - 1);
      // If frequency becomes 0, remove from map to save space
      if (freq.get(nums[left]) === 0) {
        freq.delete(nums[left]);
      }
      // Move left pointer to shrink window
      left++;
    }

    // Update maximum length if current window is larger
    // Window size = right - left + 1
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maxSubarrayLength(int[] nums, int k) {
        /**
         * Find the longest subarray where no element appears more than k times.
         *
         * @param nums Array of integers
         * @param k Maximum allowed frequency for any element
         * @return Length of the longest valid subarray
         */
        // HashMap to track frequency of each element in current window
        Map<Integer, Integer> freq = new HashMap<>();

        // Left pointer of sliding window
        int left = 0;

        // Track maximum length found
        int maxLen = 0;

        // Expand window with right pointer
        for (int right = 0; right < nums.length; right++) {
            // Add current element to frequency count
            freq.put(nums[right], freq.getOrDefault(nums[right], 0) + 1);

            // If current element exceeds k frequency, shrink window from left
            // We use a while loop because multiple elements might need removal
            while (freq.get(nums[right]) > k) {
                // Remove leftmost element from frequency count
                freq.put(nums[left], freq.get(nums[left]) - 1);
                // If frequency becomes 0, remove from map to save space
                if (freq.get(nums[left]) == 0) {
                    freq.remove(nums[left]);
                }
                // Move left pointer to shrink window
                left++;
            }

            // Update maximum length if current window is larger
            // Window size = right - left + 1
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - Each element is added to the window exactly once (when `right` pointer passes it) and removed at most once (when `left` pointer passes it). The `while` loop doesn't make this O(n²) because `left` only moves forward and never revisits elements.

**Space Complexity: O(n)** - In the worst case, we might store all distinct elements in the hash map. If all elements are unique, we store n entries. Even with duplicates, we only store frequency counts for elements in the current window.

## Common Mistakes

1. **Using an array instead of hash map for frequency counting**: Some candidates try to use an array sized to the maximum element value, but the problem doesn't specify element bounds. Elements could be very large (up to 10⁹), making an array impractical. Always use a hash map for unbounded integer ranges.

2. **Forgetting to clean up zero-frequency entries**: While not strictly necessary for correctness, removing entries when frequency reaches 0 helps keep the hash map size bounded by the window size rather than total distinct elements in the array.

3. **Using `if` instead of `while` when shrinking the window**: When we encounter an element with frequency > k, we might need to remove multiple elements from the left before the window becomes valid again. Using `if` would only remove one element, potentially leaving the window still invalid.

4. **Incorrect window length calculation**: The formula is `right - left + 1`, not `right - left`. The `+1` accounts for the fact that both indices are inclusive in the window.

## When You'll See This Pattern

This sliding window with frequency constraint pattern appears in several LeetCode problems:

1. **Longest Substring Without Repeating Characters (Medium)** - Similar but with k=1 (no repeats allowed). The solution uses the same sliding window approach with character frequency tracking.

2. **Fruit Into Baskets (Medium)** - This is essentially "longest subarray with at most 2 distinct elements." The pattern is identical but with a constraint on distinct count rather than frequency.

3. **Longest Repeating Character Replacement (Medium)** - Another frequency-based sliding window where you can replace characters to create a uniform string. The window validity condition is based on the maximum frequency in the window.

4. **Subarrays with K Different Integers (Hard)** - A more complex variation that requires counting exact matches rather than "at most" constraints.

## Key Takeaways

1. **Sliding window with frequency map** is the go-to pattern for "longest subarray/substring with constraint on element frequencies." When you see "at most K" or "no more than K" constraints, think sliding window.

2. **The shrinking condition** is critical: shrink the window from the left whenever the constraint is violated, and continue shrinking until it's valid again.

3. **Two-pointer approach** with O(n) time is possible because both pointers only move forward. Each element is processed at most twice (added once when `right` passes it, removed once when `left` passes it).

Related problems: [Longest Substring with At Least K Repeating Characters](/problem/longest-substring-with-at-least-k-repeating-characters)
