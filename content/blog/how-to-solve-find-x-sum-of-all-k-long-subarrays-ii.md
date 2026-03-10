---
title: "How to Solve Find X-Sum of All K-Long Subarrays II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find X-Sum of All K-Long Subarrays II. Hard difficulty, 41.1% acceptance rate. Topics: Array, Hash Table, Sliding Window, Heap (Priority Queue)."
date: "2028-03-13"
category: "dsa-patterns"
tags: ["find-x-sum-of-all-k-long-subarrays-ii", "array", "hash-table", "sliding-window", "hard"]
---

# How to Solve Find X-Sum of All K-Long Subarrays II

This problem asks us to process all subarrays of length `k` in an array, but with a twist: for each subarray, we need to sum only the "top x most frequent elements" within that window. What makes this challenging is that we need to track frequencies dynamically as we slide the window, and we need to efficiently identify which elements are in the top x by frequency at any given moment. The combination of sliding window with frequency tracking and priority queue operations creates an interesting optimization challenge.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider `nums = [1, 1, 2, 2, 3]`, `k = 3`, `x = 2`.

**Window 1 (indices 0-2):** `[1, 1, 2]`

- Frequencies: `{1: 2, 2: 1}`
- Top 2 most frequent elements: `1` (freq 2) and `2` (freq 1)
- Sum = 1 + 1 + 2 = 4

**Window 2 (indices 1-3):** `[1, 2, 2]`

- Frequencies: `{1: 1, 2: 2}`
- Top 2 most frequent elements: `2` (freq 2) and `1` (freq 1)
- Sum = 1 + 2 + 2 = 5

**Window 3 (indices 2-4):** `[2, 2, 3]`

- Frequencies: `{2: 2, 3: 1}`
- Top 2 most frequent elements: `2` (freq 2) and `3` (freq 1)
- Sum = 2 + 2 + 3 = 7

The key insight: as we slide the window, we need to efficiently update frequencies and identify which elements are in the top x. A naive approach would recalculate everything for each window, but we can do better by maintaining data structures that let us update incrementally.

## Brute Force Approach

The most straightforward approach would be:

1. For each starting index `i` from `0` to `n-k`
2. Extract the subarray `nums[i:i+k]`
3. Count frequencies of all elements in the subarray
4. Sort elements by frequency (and value for tie-breaking)
5. Take the top `x` elements and sum all their occurrences
6. Add this sum to the result array

This approach has O((n-k+1) × (k log k)) time complexity because for each of the (n-k+1) windows, we sort k elements. For n up to 10^5 and k potentially large, this is far too slow (could be O(n² log n) in worst case).

The brute force fails because it doesn't reuse computation between overlapping windows. When we slide the window by one position, only two elements change: we lose the leftmost element and gain a new rightmost element. An optimal solution should leverage this overlap.

## Optimized Approach

The key insight is to use a **sliding window** with **frequency tracking** and a **priority queue** (or similar structure) to efficiently maintain the top x most frequent elements.

Here's the step-by-step reasoning:

1. **Frequency Tracking**: We maintain a hash map `freq` that tracks how many times each element appears in the current window.

2. **Top x Maintenance**: We need a data structure that lets us quickly identify which elements are in the top x by frequency. A max-heap (priority queue) ordered by frequency then value seems promising, but we face a challenge: when frequencies change, we can't efficiently update elements already in the heap.

3. **Lazy Deletion Strategy**: Instead of trying to update elements in the heap, we use a "lazy deletion" approach:
   - We maintain two heaps: one for elements to consider (max-heap by frequency) and a set of "valid" frequencies
   - When we need to get the top x elements, we pop from the heap until we find elements whose current frequency in our `freq` map matches what's stored in the heap
   - This avoids the need to update or remove elements from the heap directly

4. **Alternative: Bucket Approach**: Since frequencies are bounded by k (window size), we can use an array of lists where index `i` contains all elements with frequency `i`. This gives us O(1) access to elements by frequency.

5. **Efficient Top x Selection**: With the bucket approach:
   - We iterate from highest frequency down to lowest
   - For each frequency bucket, we take elements until we've collected x elements total
   - We sum these elements, multiplying each by its frequency

6. **Window Updates**: When sliding the window:
   - Decrement frequency of the element leaving the window
   - Move it to the appropriate frequency bucket
   - Increment frequency of the new element entering the window
   - Move it to the appropriate frequency bucket

The bucket approach is more efficient than heap-based approaches because all operations are O(1) per element update.

## Optimal Solution

Here's the complete solution using the bucket approach:

<div class="code-group">

```python
# Time: O(n * min(k, x)) | Space: O(n + k)
def getXSum(nums, k, x):
    """
    Calculate x-sum for all k-length subarrays.

    Args:
        nums: List of integers
        k: Length of subarray
        x: Number of top frequent elements to consider

    Returns:
        List of x-sums for each k-length subarray
    """
    n = len(nums)
    if n < k:
        return []

    # Result array to store x-sums for each window
    result = []

    # Frequency map: element -> frequency in current window
    freq = {}

    # Buckets: index i stores set of elements with frequency i
    # We need up to k buckets (max frequency is k)
    buckets = [set() for _ in range(k + 1)]

    # Initialize first window
    for i in range(k):
        num = nums[i]
        old_freq = freq.get(num, 0)
        freq[num] = old_freq + 1

        # Remove from old bucket if it existed
        if old_freq > 0:
            buckets[old_freq].remove(num)

        # Add to new bucket
        buckets[old_freq + 1].add(num)

    # Process each window
    for i in range(n - k + 1):
        # Calculate x-sum for current window
        total = 0
        count = 0  # Number of distinct elements collected so far

        # Iterate from highest frequency down to lowest
        for freq_val in range(k, 0, -1):
            if count >= x:
                break

            # Get elements with this frequency
            elements = buckets[freq_val]

            # Sort elements to break ties by value (smallest first)
            sorted_elements = sorted(elements)

            # Take elements until we have x total or run out
            for elem in sorted_elements:
                if count >= x:
                    break

                # Add this element's total contribution
                # (frequency * element value)
                total += freq_val * elem
                count += 1

        result.append(total)

        # Slide window if not at the end
        if i < n - k:
            # Remove leftmost element
            left_num = nums[i]
            old_freq = freq[left_num]

            # Update frequency
            if old_freq == 1:
                del freq[left_num]
            else:
                freq[left_num] = old_freq - 1

            # Update buckets for left element
            buckets[old_freq].remove(left_num)
            if old_freq > 1:
                buckets[old_freq - 1].add(left_num)

            # Add rightmost element
            right_num = nums[i + k]
            old_freq = freq.get(right_num, 0)
            new_freq = old_freq + 1

            # Update frequency
            freq[right_num] = new_freq

            # Update buckets for right element
            if old_freq > 0:
                buckets[old_freq].remove(right_num)
            buckets[new_freq].add(right_num)

    return result
```

```javascript
// Time: O(n * min(k, x)) | Space: O(n + k)
function getXSum(nums, k, x) {
  /**
   * Calculate x-sum for all k-length subarrays.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Length of subarray
   * @param {number} x - Number of top frequent elements to consider
   * @return {number[]} - Array of x-sums for each k-length subarray
   */
  const n = nums.length;
  if (n < k) {
    return [];
  }

  // Result array to store x-sums for each window
  const result = [];

  // Frequency map: element -> frequency in current window
  const freq = new Map();

  // Buckets: index i stores set of elements with frequency i
  // We need up to k buckets (max frequency is k)
  const buckets = Array.from({ length: k + 1 }, () => new Set());

  // Initialize first window
  for (let i = 0; i < k; i++) {
    const num = nums[i];
    const oldFreq = freq.get(num) || 0;
    freq.set(num, oldFreq + 1);

    // Remove from old bucket if it existed
    if (oldFreq > 0) {
      buckets[oldFreq].delete(num);
    }

    // Add to new bucket
    buckets[oldFreq + 1].add(num);
  }

  // Process each window
  for (let i = 0; i < n - k + 1; i++) {
    // Calculate x-sum for current window
    let total = 0;
    let count = 0; // Number of distinct elements collected so far

    // Iterate from highest frequency down to lowest
    for (let freqVal = k; freqVal > 0; freqVal--) {
      if (count >= x) {
        break;
      }

      // Get elements with this frequency
      const elements = Array.from(buckets[freqVal]);

      // Sort elements to break ties by value (smallest first)
      elements.sort((a, b) => a - b);

      // Take elements until we have x total or run out
      for (const elem of elements) {
        if (count >= x) {
          break;
        }

        // Add this element's total contribution
        // (frequency * element value)
        total += freqVal * elem;
        count++;
      }
    }

    result.push(total);

    // Slide window if not at the end
    if (i < n - k) {
      // Remove leftmost element
      const leftNum = nums[i];
      const oldFreq = freq.get(leftNum);

      // Update frequency
      if (oldFreq === 1) {
        freq.delete(leftNum);
      } else {
        freq.set(leftNum, oldFreq - 1);
      }

      // Update buckets for left element
      buckets[oldFreq].delete(leftNum);
      if (oldFreq > 1) {
        buckets[oldFreq - 1].add(leftNum);
      }

      // Add rightmost element
      const rightNum = nums[i + k];
      const oldFreqRight = freq.get(rightNum) || 0;
      const newFreq = oldFreqRight + 1;

      // Update frequency
      freq.set(rightNum, newFreq);

      // Update buckets for right element
      if (oldFreqRight > 0) {
        buckets[oldFreqRight].delete(rightNum);
      }
      buckets[newFreq].add(rightNum);
    }
  }

  return result;
}
```

```java
// Time: O(n * min(k, x)) | Space: O(n + k)
import java.util.*;

public class Solution {
    public int[] getXSum(int[] nums, int k, int x) {
        /**
         * Calculate x-sum for all k-length subarrays.
         *
         * @param nums - Array of integers
         * @param k - Length of subarray
         * @param x - Number of top frequent elements to consider
         * @return - Array of x-sums for each k-length subarray
         */
        int n = nums.length;
        if (n < k) {
            return new int[0];
        }

        // Result array to store x-sums for each window
        int[] result = new int[n - k + 1];

        // Frequency map: element -> frequency in current window
        Map<Integer, Integer> freq = new HashMap<>();

        // Buckets: index i stores set of elements with frequency i
        // We need up to k buckets (max frequency is k)
        List<Set<Integer>> buckets = new ArrayList<>(k + 1);
        for (int i = 0; i <= k; i++) {
            buckets.add(new HashSet<>());
        }

        // Initialize first window
        for (int i = 0; i < k; i++) {
            int num = nums[i];
            int oldFreq = freq.getOrDefault(num, 0);
            freq.put(num, oldFreq + 1);

            // Remove from old bucket if it existed
            if (oldFreq > 0) {
                buckets.get(oldFreq).remove(num);
            }

            // Add to new bucket
            buckets.get(oldFreq + 1).add(num);
        }

        // Process each window
        for (int i = 0; i < n - k + 1; i++) {
            // Calculate x-sum for current window
            int total = 0;
            int count = 0;  // Number of distinct elements collected so far

            // Iterate from highest frequency down to lowest
            for (int freqVal = k; freqVal > 0; freqVal--) {
                if (count >= x) {
                    break;
                }

                // Get elements with this frequency
                Set<Integer> elementsSet = buckets.get(freqVal);
                List<Integer> elements = new ArrayList<>(elementsSet);

                // Sort elements to break ties by value (smallest first)
                Collections.sort(elements);

                // Take elements until we have x total or run out
                for (int elem : elements) {
                    if (count >= x) {
                        break;
                    }

                    // Add this element's total contribution
                    // (frequency * element value)
                    total += freqVal * elem;
                    count++;
                }
            }

            result[i] = total;

            // Slide window if not at the end
            if (i < n - k) {
                // Remove leftmost element
                int leftNum = nums[i];
                int oldFreq = freq.get(leftNum);

                // Update frequency
                if (oldFreq == 1) {
                    freq.remove(leftNum);
                } else {
                    freq.put(leftNum, oldFreq - 1);
                }

                // Update buckets for left element
                buckets.get(oldFreq).remove(leftNum);
                if (oldFreq > 1) {
                    buckets.get(oldFreq - 1).add(leftNum);
                }

                // Add rightmost element
                int rightNum = nums[i + k];
                int oldFreqRight = freq.getOrDefault(rightNum, 0);
                int newFreq = oldFreqRight + 1;

                // Update frequency
                freq.put(rightNum, newFreq);

                // Update buckets for right element
                if (oldFreqRight > 0) {
                    buckets.get(oldFreqRight).remove(rightNum);
                }
                buckets.get(newFreq).add(rightNum);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × min(k, x))

- We process n-k+1 windows (O(n) windows)
- For each window, we iterate through frequency buckets from highest to lowest
- In the worst case, we might need to look at all k frequency buckets, but we stop when we've collected x elements
- Within each bucket, we sort elements (O(m log m) where m is bucket size), but since we're only sorting within buckets and the total elements across all buckets is at most k, this doesn't dominate
- The key insight: we only need to process enough buckets to collect x elements, so it's O(min(k, x)) per window

**Space Complexity:** O(n + k)

- We store the result array of size O(n)
- Frequency map can contain up to O(k) elements (window size)
- Buckets array has size k+1, each containing sets of elements
- In total, we use O(n) for the result and O(k) for the sliding window data structures

## Common Mistakes

1. **Forgetting to handle tie-breaking correctly**: The problem requires that when elements have the same frequency, we consider the smaller element first. Many candidates forget to sort elements within frequency buckets.

2. **Off-by-one errors in window sliding**: When updating frequencies, it's easy to:
   - Forget to remove an element when its frequency drops to 0
   - Incorrectly calculate the new window boundaries
   - Fail to handle the last window correctly

3. **Inefficient top-x selection**: Some candidates try to sort all elements by frequency for each window (O(k log k) per window), which is too slow for large k. The bucket approach is more efficient.

4. **Not handling the case when x > number of distinct elements**: If x is larger than the number of distinct elements in the window, we should sum all elements. Our solution handles this naturally because we stop when we've processed all buckets.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window with Frequency Tracking**: Similar to problems like:
   - **LeetCode 438 - Find All Anagrams in a String**: Track character frequencies in sliding window
   - **LeetCode 567 - Permutation in String**: Check if one string contains a permutation of another

2. **Top K Elements by Frequency**: Related to:
   - **LeetCode 347 - Top K Frequent Elements**: Find k most frequent elements
   - **LeetCode 692 - Top K Frequent Words**: Similar but with string elements and different tie-breaking

3. **Bucket Sort by Frequency**: The bucket approach is similar to:
   - **LeetCode 451 - Sort Characters By Frequency**: Use frequency buckets to sort characters

The unique aspect here is combining sliding window with maintaining top x elements by frequency, which requires efficient updates as the window moves.

## Key Takeaways

1. **Sliding window problems often benefit from incremental updates**: When consecutive windows overlap significantly, avoid recomputing everything from scratch. Update only what changes.

2. **Bucket sorting by frequency is efficient when frequencies are bounded**: If the maximum frequency is limited (like by window size k), using an array of buckets gives O(1) updates and access.

3. **For "top K" problems within a sliding window, consider lazy updates or bucket approaches**: Directly maintaining a heap requires updates that are O(log n), but bucket approaches can be O(1) when frequencies are bounded.

[Practice this problem on CodeJeet](/problem/find-x-sum-of-all-k-long-subarrays-ii)
