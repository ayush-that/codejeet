---
title: "How to Solve Find X-Sum of All K-Long Subarrays I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find X-Sum of All K-Long Subarrays I. Easy difficulty, 76.1% acceptance rate. Topics: Array, Hash Table, Sliding Window, Heap (Priority Queue)."
date: "2026-10-28"
category: "dsa-patterns"
tags: ["find-x-sum-of-all-k-long-subarrays-i", "array", "hash-table", "sliding-window", "easy"]
---

# How to Solve Find X-Sum of All K-Long Subarrays I

This problem asks us to calculate a special "x-sum" for every contiguous subarray of length `k` in an array. The x-sum is found by counting element frequencies, keeping only the top `x` most frequent elements, and summing their values multiplied by their frequencies. What makes this problem interesting is that it combines sliding window technique with frequency tracking and partial sorting - you need to efficiently maintain and query the top `x` frequencies as the window slides.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 2, 3, 3]`, `k = 3`, `x = 2`.

**Window 1: [1, 2, 2]**

- Frequencies: {1:1, 2:2}
- Top 2 elements by frequency: 2 (freq 2), 1 (freq 1)
- x-sum = (2 × 2) + (1 × 1) = 4 + 1 = 5

**Slide window to [2, 2, 3]**

- Remove leftmost element 1: frequencies become {2:2}
- Add new element 3: frequencies become {2:2, 3:1}
- Top 2 elements: 2 (freq 2), 3 (freq 1)
- x-sum = (2 × 2) + (3 × 1) = 4 + 3 = 7

**Slide window to [2, 3, 3]**

- Remove element 2: frequencies become {2:1, 3:1}
- Add new element 3: frequencies become {2:1, 3:2}
- Top 2 elements: 3 (freq 2), 2 (freq 1)
- x-sum = (3 × 2) + (2 × 1) = 6 + 2 = 8

The key insight is that we need to maintain frequencies as the window slides and quickly identify the top `x` elements by frequency.

## Brute Force Approach

A naive approach would process each k-length subarray independently:

1. For each starting index `i` from 0 to `n-k`
2. Extract the subarray `nums[i:i+k]`
3. Count frequencies of all elements in the subarray
4. Sort elements by frequency (and value for tie-breaking)
5. Take top `x` elements, sum `value × frequency`
6. Store result

This approach has O((n-k+1) × (k log k)) time complexity because for each of the (n-k+1) windows, we sort k elements. For n=10^5 and k=10^4, this becomes 90,000 × (10,000 log 10,000) operations - far too slow.

The inefficiency comes from recomputing frequencies from scratch for each window and sorting all elements each time. We need to maintain frequencies incrementally as the window slides.

## Optimal Solution

We can solve this efficiently using a sliding window with frequency tracking. The key optimization is that we don't need to fully sort frequencies each time - we just need to identify the top `x` frequencies. We can maintain frequencies in a hash map and use a list of (frequency, value) pairs that we sort only when needed.

Here's the step-by-step approach:

1. Initialize a frequency dictionary to count elements in the current window
2. For the first window (indices 0 to k-1), count all elements
3. Convert frequencies to a list of (frequency, value) pairs and sort descending
4. Calculate x-sum for first window by taking top x pairs
5. Slide window: decrement frequency of outgoing element, increment frequency of incoming element
6. After each slide, re-sort the frequency list and recalculate x-sum
7. Continue until all windows processed

<div class="code-group">

```python
# Time: O(n * k log k) in worst case, but O(n * min(k, unique_count)) typically
# Space: O(k) for frequency tracking
def getXSum(nums, k, x):
    n = len(nums)
    if n < k:
        return []

    result = []
    freq = {}

    # Initialize first window
    for i in range(k):
        freq[nums[i]] = freq.get(nums[i], 0) + 1

    # Process each window
    for i in range(n - k + 1):
        # Convert frequencies to list of (frequency, value) pairs
        items = list(freq.items())

        # Sort by frequency descending, then by value descending for tie-breaking
        # We sort by negative frequency and negative value to get descending order
        items.sort(key=lambda item: (-item[1], -item[0]))

        # Calculate x-sum for current window
        x_sum = 0
        # Take min(x, len(items)) to handle case when window has fewer than x unique elements
        for j in range(min(x, len(items))):
            value, count = items[j]
            x_sum += value * count

        result.append(x_sum)

        # Slide window if not at the last position
        if i < n - k:
            # Remove leftmost element
            left_val = nums[i]
            freq[left_val] -= 1
            if freq[left_val] == 0:
                del freq[left_val]

            # Add new element
            right_val = nums[i + k]
            freq[right_val] = freq.get(right_val, 0) + 1

    return result
```

```javascript
// Time: O(n * k log k) in worst case, but O(n * min(k, unique_count)) typically
// Space: O(k) for frequency tracking
function getXSum(nums, k, x) {
  const n = nums.length;
  if (n < k) return [];

  const result = [];
  const freq = new Map();

  // Initialize first window
  for (let i = 0; i < k; i++) {
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
  }

  // Process each window
  for (let i = 0; i <= n - k; i++) {
    // Convert frequencies to array of [value, frequency] pairs
    const items = Array.from(freq.entries());

    // Sort by frequency descending, then by value descending for tie-breaking
    items.sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1]; // Higher frequency first
      }
      return b[0] - a[0]; // Higher value first for ties
    });

    // Calculate x-sum for current window
    let xSum = 0;
    // Take min(x, items.length) to handle case when window has fewer than x unique elements
    const limit = Math.min(x, items.length);
    for (let j = 0; j < limit; j++) {
      const [value, count] = items[j];
      xSum += value * count;
    }

    result.push(xSum);

    // Slide window if not at the last position
    if (i < n - k) {
      // Remove leftmost element
      const leftVal = nums[i];
      freq.set(leftVal, freq.get(leftVal) - 1);
      if (freq.get(leftVal) === 0) {
        freq.delete(leftVal);
      }

      // Add new element
      const rightVal = nums[i + k];
      freq.set(rightVal, (freq.get(rightVal) || 0) + 1);
    }
  }

  return result;
}
```

```java
// Time: O(n * k log k) in worst case, but O(n * min(k, unique_count)) typically
// Space: O(k) for frequency tracking
import java.util.*;

public class Solution {
    public int[] getXSum(int[] nums, int k, int x) {
        int n = nums.length;
        if (n < k) return new int[0];

        int[] result = new int[n - k + 1];
        Map<Integer, Integer> freq = new HashMap<>();

        // Initialize first window
        for (int i = 0; i < k; i++) {
            freq.put(nums[i], freq.getOrDefault(nums[i], 0) + 1);
        }

        // Process each window
        for (int i = 0; i <= n - k; i++) {
            // Convert frequencies to list of entries
            List<Map.Entry<Integer, Integer>> items = new ArrayList<>(freq.entrySet());

            // Sort by frequency descending, then by value descending for tie-breaking
            items.sort((a, b) -> {
                if (!b.getValue().equals(a.getValue())) {
                    return b.getValue() - a.getValue(); // Higher frequency first
                }
                return b.getKey() - a.getKey(); // Higher value first for ties
            });

            // Calculate x-sum for current window
            int xSum = 0;
            // Take min(x, items.size()) to handle case when window has fewer than x unique elements
            int limit = Math.min(x, items.size());
            for (int j = 0; j < limit; j++) {
                Map.Entry<Integer, Integer> entry = items.get(j);
                xSum += entry.getKey() * entry.getValue();
            }

            result[i] = xSum;

            // Slide window if not at the last position
            if (i < n - k) {
                // Remove leftmost element
                int leftVal = nums[i];
                freq.put(leftVal, freq.get(leftVal) - 1);
                if (freq.get(leftVal) == 0) {
                    freq.remove(leftVal);
                }

                // Add new element
                int rightVal = nums[i + k];
                freq.put(rightVal, freq.getOrDefault(rightVal, 0) + 1);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m log m) where m is the number of unique elements in each window (m ≤ min(k, unique_count)). In the worst case where all elements are unique, m = k, giving O(n × k log k). However, in practice m is often much smaller than k, especially when elements repeat. We process n-k+1 windows, and for each window we sort m items.

**Space Complexity:** O(k) for storing the frequency map. In the worst case when all elements in the window are unique, we store k entries. The result array uses O(n-k+1) space, but this is output space that doesn't count toward auxiliary space complexity.

## Common Mistakes

1. **Forgetting to handle the case when window has fewer than x unique elements**: Always use `min(x, number_of_unique_elements)` when taking top x. Without this, you'll get index out of bounds errors.

2. **Incorrect tie-breaking when frequencies are equal**: The problem states that when frequencies are equal, we should prefer elements with larger values. Many candidates sort only by frequency and miss this requirement.

3. **Not properly cleaning up zero-frequency entries**: When decrementing frequency of the outgoing element, if it reaches zero, you must remove it from the frequency map. Otherwise, it will still appear in your sorted list with frequency 0.

4. **Off-by-one errors in window sliding**: The last window starts at index `n-k`, so we need `n-k+1` total windows. A common mistake is using `n-k` as the loop bound, missing the last window.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Sliding Window**: Problems like "Sliding Window Maximum" (LeetCode 239) and "Maximum Average Subarray I" (LeetCode 643) use similar window-sliding techniques.

2. **Frequency Tracking with Partial Sorting**: "Top K Frequent Elements" (LeetCode 347) requires finding top k frequent elements, similar to our need for top x frequencies.

3. **Maintaining Order Statistics in a Window**: "Find Median from Data Stream" (LeetCode 295) maintains order statistics as data arrives, though it uses heaps instead of sorting.

The core pattern is maintaining statistics (frequencies, counts, sums) as a window slides through an array, which appears in many substring and subarray problems.

## Key Takeaways

1. **Sliding window with incremental updates** is powerful for problems involving contiguous subarrays of fixed length. Instead of recomputing from scratch, update counts as elements enter and leave the window.

2. **When you need "top x" of something changing dynamically**, consider whether you can afford to sort each time. For small x or small number of unique items, sorting is acceptable. For larger scales, heaps or balanced trees would be needed.

3. **Always check edge cases**: Empty arrays, windows larger than array, fewer unique elements than x, and tie-breaking rules are common pitfalls that interviewers test.

[Practice this problem on CodeJeet](/problem/find-x-sum-of-all-k-long-subarrays-i)
