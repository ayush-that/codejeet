---
title: "How to Solve Sliding Subarray Beauty — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sliding Subarray Beauty. Medium difficulty, 36.4% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2029-03-08"
category: "dsa-patterns"
tags: ["sliding-subarray-beauty", "array", "hash-table", "sliding-window", "medium"]
---

## How to Solve Sliding Subarray Beauty

This problem asks us to find the "beauty" of every contiguous subarray of size `k` in an array `nums`. The beauty is defined as the `x`-th smallest negative integer in the subarray, or `0` if there are fewer than `x` negative numbers. What makes this tricky is that we need to efficiently track order statistics (specifically the `x`-th smallest negative) as the window slides across the array. A brute force approach would be too slow for large inputs, so we need a smarter way to maintain window contents and quickly answer queries about negative number ordering.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `nums = [-3, 2, 3, -1, -2]`, `k = 3`, `x = 2`

We need to find the beauty of each length-3 subarray:

1. **Window 1:** `[-3, 2, 3]`
   - Negative numbers: `[-3]`
   - Count of negatives = 1 (which is < x=2)
   - Beauty = 0 (not enough negatives)

2. **Window 2:** `[2, 3, -1]`
   - Negative numbers: `[-1]`
   - Count of negatives = 1 (< 2)
   - Beauty = 0

3. **Window 3:** `[3, -1, -2]`
   - Negative numbers: `[-1, -2]`
   - Sorted negatives: `[-2, -1]`
   - x=2 → 2nd smallest = `-1`
   - Beauty = `-1`

The challenge is doing this efficiently as we slide the window. We can't re-sort negatives for each window (that would be O(k log k) per window, or O(nk log k) total). We need a way to maintain the sorted order of negatives as elements enter and leave the window.

## Brute Force Approach

The most straightforward approach is to examine each subarray independently:

1. For each starting index `i` from 0 to `n-k`:
2. Extract the subarray `nums[i:i+k]`
3. Filter to get only negative numbers
4. Sort the negatives
5. If the sorted negatives has at least `x` elements, take the `x-1`-th element (0-indexed)
6. Otherwise, use 0

**Why this fails:** Sorting for each window takes O(k log k) time. With `n-k+1` windows, this becomes O((n-k+1) \* k log k) ≈ O(nk log k). For large `n` and `k` (up to 10^5), this is far too slow. We need to avoid re-sorting from scratch for each window.

## Optimized Approach

The key insight is that we need to maintain the sorted order of negatives **as the window slides**, not recompute it from scratch. This is a classic use case for:

1. **Sliding Window Technique:** Process elements as they enter and leave the window
2. **Counting Sort / Bucket Approach:** Since the problem constraints limit values to `[-50, 50]`, we can use a frequency array of size 101 (to handle -50 to 50 inclusive)

**Why counting sort works here:**

- The value range is small (101 possible values)
- We can maintain a frequency array `count` where `count[val+50]` tracks how many times `val` appears in the current window
- To find the `x`-th smallest negative, we iterate through negative values in order (from -50 to -1) and count until we reach the `x`-th negative

**Step-by-step reasoning:**

1. Initialize a frequency array of size 101 (index 0 represents -50, index 100 represents 50)
2. For the first window, count frequencies of all elements
3. To find beauty: iterate from -50 to -1, accumulating counts until we reach `x` negatives
4. Slide the window: decrement count of outgoing element, increment count of incoming element
5. Repeat for all windows

This approach gives us O(1) updates when sliding the window and O(50) = O(1) time to find the x-th smallest negative (since we only check at most 50 negative values).

## Optimal Solution

Here's the complete implementation using the counting sort approach:

<div class="code-group">

```python
# Time: O(n * 50) = O(n) since 50 is constant
# Space: O(101) = O(1) for the frequency array
def getSubarrayBeauty(nums, k, x):
    n = len(nums)
    # Frequency array: index 0 corresponds to value -50, index 100 to value 50
    # We add 50 to shift negative indices to positive
    freq = [0] * 101
    result = []

    # Initialize first window
    for i in range(k):
        val = nums[i]
        freq[val + 50] += 1

    # Process first window
    result.append(find_xth_negative(freq, x))

    # Slide window across the array
    for i in range(k, n):
        # Remove element leaving the window
        left_val = nums[i - k]
        freq[left_val + 50] -= 1

        # Add new element entering the window
        right_val = nums[i]
        freq[right_val + 50] += 1

        # Find beauty for current window
        result.append(find_xth_negative(freq, x))

    return result

def find_xth_negative(freq, x):
    """
    Find the x-th smallest negative number in the current window.
    Returns 0 if there are fewer than x negative numbers.
    """
    count = 0  # Count of negative numbers seen so far

    # Iterate through possible negative values (-50 to -1)
    # Note: value = index - 50
    for idx in range(0, 50):  # idx 0..49 correspond to values -50..-1
        count += freq[idx]

        # If we've seen at least x negatives, return the current value
        if count >= x:
            return idx - 50  # Convert back to original value

    # Not enough negatives
    return 0
```

```javascript
// Time: O(n * 50) = O(n) since 50 is constant
// Space: O(101) = O(1) for the frequency array
function getSubarrayBeauty(nums, k, x) {
  const n = nums.length;
  // Frequency array: index 0 = value -50, index 100 = value 50
  const freq = new Array(101).fill(0);
  const result = [];

  // Initialize first window
  for (let i = 0; i < k; i++) {
    const val = nums[i];
    freq[val + 50]++;
  }

  // Process first window
  result.push(findXthNegative(freq, x));

  // Slide window across the array
  for (let i = k; i < n; i++) {
    // Remove element leaving the window
    const leftVal = nums[i - k];
    freq[leftVal + 50]--;

    // Add new element entering the window
    const rightVal = nums[i];
    freq[rightVal + 50]++;

    // Find beauty for current window
    result.push(findXthNegative(freq, x));
  }

  return result;
}

function findXthNegative(freq, x) {
  /**
   * Find the x-th smallest negative number in the current window.
   * Returns 0 if there are fewer than x negative numbers.
   */
  let count = 0; // Count of negative numbers seen so far

  // Iterate through possible negative values (-50 to -1)
  // Note: value = index - 50
  for (let idx = 0; idx < 50; idx++) {
    // idx 0..49 correspond to values -50..-1
    count += freq[idx];

    // If we've seen at least x negatives, return the current value
    if (count >= x) {
      return idx - 50; // Convert back to original value
    }
  }

  // Not enough negatives
  return 0;
}
```

```java
// Time: O(n * 50) = O(n) since 50 is constant
// Space: O(101) = O(1) for the frequency array
class Solution {
    public int[] getSubarrayBeauty(int[] nums, int k, int x) {
        int n = nums.length;
        // Frequency array: index 0 = value -50, index 100 = value 50
        int[] freq = new int[101];
        int[] result = new int[n - k + 1];

        // Initialize first window
        for (int i = 0; i < k; i++) {
            int val = nums[i];
            freq[val + 50]++;
        }

        // Process first window
        result[0] = findXthNegative(freq, x);

        // Slide window across the array
        for (int i = k; i < n; i++) {
            // Remove element leaving the window
            int leftVal = nums[i - k];
            freq[leftVal + 50]--;

            // Add new element entering the window
            int rightVal = nums[i];
            freq[rightVal + 50]++;

            // Find beauty for current window
            result[i - k + 1] = findXthNegative(freq, x);
        }

        return result;
    }

    private int findXthNegative(int[] freq, int x) {
        /**
         * Find the x-th smallest negative number in the current window.
         * Returns 0 if there are fewer than x negative numbers.
         */
        int count = 0;  // Count of negative numbers seen so far

        // Iterate through possible negative values (-50 to -1)
        // Note: value = index - 50
        for (int idx = 0; idx < 50; idx++) {  // idx 0..49 correspond to values -50..-1
            count += freq[idx];

            // If we've seen at least x negatives, return the current value
            if (count >= x) {
                return idx - 50;  // Convert back to original value
            }
        }

        // Not enough negatives
        return 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 50) = O(n)

- We process each of the n-k+1 ≈ n windows
- For each window, we update the frequency array (O(1) for add/remove)
- To find the x-th negative, we iterate through at most 50 possible negative values
- Since 50 is constant, overall time is O(n)

**Space Complexity:** O(101) = O(1)

- We use a fixed-size frequency array of 101 elements regardless of input size
- The result array is required output, so it's not counted in auxiliary space

## Common Mistakes

1. **Forgetting the value range constraint:** Some candidates try to use a heap or balanced BST, which would work for arbitrary values but is overkill here. The counting sort approach only works because we know values are in [-50, 50].

2. **Off-by-one errors with indices:**
   - When converting between value and frequency index: remember `index = value + 50`
   - When sliding the window: the element leaving is at `i-k`, not `i-k+1`
   - In the result array: window starting at index `i` corresponds to result index `i-k+1` for i ≥ k

3. **Incorrect handling of the x-th smallest:**
   - The problem asks for the x-th smallest (1-indexed), not x-th largest
   - We must count negatives in sorted order from smallest (-50) upward
   - Stop when cumulative count ≥ x, not when count == x (there could be duplicates)

4. **Not checking for enough negatives:** Always verify that we have at least x negatives before returning a value. If we exit the loop without finding x negatives, we must return 0.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Sliding Window with Frequency Counting:** Used when you need to maintain statistics about a moving window.
   - Related problem: [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) - uses a deque to track max
   - Related problem: [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - uses frequency counting for character matching

2. **Counting Sort for Small Value Ranges:** When values are limited to a small range, counting sort provides O(1) updates and queries.
   - Related problem: [Sort Colors](https://leetcode.com/problems/sort-colrays/) - classic counting sort problem
   - Related problem: [Maximum Number of Occurrences of a Substring](https://leetcode.com/problems/maximum-number-of-occurrences-of-a-substring/) - uses frequency counting for substring analysis

## Key Takeaways

1. **When values are bounded, consider counting sort:** If input values have a limited range (like [-50, 50]), a frequency array is often more efficient than heaps or balanced trees.

2. **Sliding window problems often need O(1) updates:** As the window moves, you should be able to update your data structure in constant time. The frequency array achieves this with simple increment/decrement operations.

3. **Read constraints carefully:** The -50 to 50 range is crucial for this solution. In an interview, always check constraints before deciding on an approach.

[Practice this problem on CodeJeet](/problem/sliding-subarray-beauty)
