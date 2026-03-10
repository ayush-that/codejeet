---
title: "How to Solve Maximum Sum of Almost Unique Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum of Almost Unique Subarray. Medium difficulty, 40.8% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2029-02-12"
category: "dsa-patterns"
tags: ["maximum-sum-of-almost-unique-subarray", "array", "hash-table", "sliding-window", "medium"]
---

# How to Solve Maximum Sum of Almost Unique Subarray

This problem asks us to find the maximum sum among all subarrays of length `k` that contain at least `m` distinct elements. What makes this interesting is the combination of two constraints: we need to track both the sum of a fixed-size window AND the count of distinct elements within that window. This is a classic sliding window problem with a twist—instead of just tracking the sum, we also need to maintain a frequency map to count distinct elements.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 2, 1, 3, 4]`, `m = 2`, `k = 3`

We'll use a sliding window of size 3 and track both the sum and distinct element count:

**Window 1: [1, 2, 1]**

- Sum = 1 + 2 + 1 = 4
- Distinct elements: {1, 2} → 2 distinct elements
- Since 2 ≥ m (2), this is valid
- Current max = 4

**Window 2: [2, 1, 3]**

- Sum = 2 + 1 + 3 = 6
- Distinct elements: {1, 2, 3} → 3 distinct elements
- Since 3 ≥ m (2), this is valid
- Current max = max(4, 6) = 6

**Window 3: [1, 3, 4]**

- Sum = 1 + 3 + 4 = 8
- Distinct elements: {1, 3, 4} → 3 distinct elements
- Since 3 ≥ m (2), this is valid
- Current max = max(6, 8) = 8

Final answer: 8

The key insight is that as we slide the window, we need to efficiently:

1. Update the sum (add new element, remove old element)
2. Update the distinct count (increment/decrement frequencies)

## Brute Force Approach

A naive solution would check every possible subarray of length `k`:

1. For each starting index `i` from 0 to `n-k`
2. Extract the subarray `nums[i:i+k]`
3. Calculate its sum
4. Count distinct elements (using a set)
5. If distinct count ≥ m, update max sum

This approach has O(n × k) time complexity because for each of the O(n) windows, we need O(k) time to calculate sum and O(k) time to count distinct elements. For large arrays with large k, this becomes too slow (O(n²) in worst case when k ≈ n).

Here's what the brute force might look like:

```python
def maxSumBruteForce(nums, m, k):
    n = len(nums)
    max_sum = 0

    for i in range(n - k + 1):
        window = nums[i:i+k]
        window_sum = sum(window)
        distinct_count = len(set(window))

        if distinct_count >= m:
            max_sum = max(max_sum, window_sum)

    return max_sum
```

The problem with this approach is the repeated work: we recalculate everything from scratch for each window, even though consecutive windows share k-1 elements.

## Optimized Approach

The optimal solution uses the **sliding window** technique with a **frequency map** (hash map/dictionary). Here's the step-by-step reasoning:

1. **Fixed-size window**: Since we need subarrays of exactly length `k`, we can use a fixed-size sliding window that moves one element at a time.

2. **Efficient sum updates**: Instead of recalculating the sum for each window, we maintain a running sum:
   - Add the new element entering the window
   - Subtract the element leaving the window

3. **Efficient distinct count tracking**: We maintain a frequency map (dictionary) of elements in the current window:
   - When adding a new element: increment its count; if count goes from 0 to 1, we gained a distinct element
   - When removing an old element: decrement its count; if count goes from 1 to 0, we lost a distinct element

4. **Window validation**: For each window position, check if distinct count ≥ m. If yes, update the maximum sum.

The sliding window approach reduces the time complexity from O(n × k) to O(n) because each element is processed at most twice (once when added, once when removed).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) - each element processed at most twice (added and removed once)
# Space: O(k) - frequency map stores at most k elements
def maxSum(nums, m, k):
    n = len(nums)

    # Edge case: if k > n, no valid subarray exists
    if k > n:
        return 0

    max_sum = 0
    current_sum = 0
    freq = {}  # Frequency map for elements in current window
    distinct_count = 0  # Count of distinct elements in current window

    # Initialize the first window
    for i in range(k):
        current_sum += nums[i]
        # Update frequency map and distinct count
        if nums[i] not in freq:
            freq[nums[i]] = 0
            distinct_count += 1
        freq[nums[i]] += 1

    # Check if first window is valid
    if distinct_count >= m:
        max_sum = current_sum

    # Slide the window across the array
    for i in range(k, n):
        # Element leaving the window: nums[i-k]
        left_element = nums[i - k]
        # Element entering the window: nums[i]
        right_element = nums[i]

        # Update sum: subtract leaving, add entering
        current_sum = current_sum - left_element + right_element

        # Update frequency for leaving element
        freq[left_element] -= 1
        if freq[left_element] == 0:
            distinct_count -= 1  # Lost a distinct element
            del freq[left_element]  # Clean up to save space

        # Update frequency for entering element
        if right_element not in freq:
            freq[right_element] = 0
            distinct_count += 1  # Gained a distinct element
        freq[right_element] += 1

        # Check if current window is valid
        if distinct_count >= m:
            max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n) - each element processed at most twice
// Space: O(k) - frequency map stores at most k elements
function maxSum(nums, m, k) {
  const n = nums.length;

  // Edge case: if k > n, no valid subarray exists
  if (k > n) {
    return 0;
  }

  let maxSum = 0;
  let currentSum = 0;
  const freq = new Map(); // Frequency map for elements in current window
  let distinctCount = 0; // Count of distinct elements in current window

  // Initialize the first window
  for (let i = 0; i < k; i++) {
    currentSum += nums[i];
    // Update frequency map and distinct count
    if (!freq.has(nums[i])) {
      freq.set(nums[i], 0);
      distinctCount++;
    }
    freq.set(nums[i], freq.get(nums[i]) + 1);
  }

  // Check if first window is valid
  if (distinctCount >= m) {
    maxSum = currentSum;
  }

  // Slide the window across the array
  for (let i = k; i < n; i++) {
    // Element leaving the window: nums[i-k]
    const leftElement = nums[i - k];
    // Element entering the window: nums[i]
    const rightElement = nums[i];

    // Update sum: subtract leaving, add entering
    currentSum = currentSum - leftElement + rightElement;

    // Update frequency for leaving element
    freq.set(leftElement, freq.get(leftElement) - 1);
    if (freq.get(leftElement) === 0) {
      distinctCount--; // Lost a distinct element
      freq.delete(leftElement); // Clean up to save space
    }

    // Update frequency for entering element
    if (!freq.has(rightElement)) {
      freq.set(rightElement, 0);
      distinctCount++; // Gained a distinct element
    }
    freq.set(rightElement, freq.get(rightElement) + 1);

    // Check if current window is valid
    if (distinctCount >= m) {
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(n) - each element processed at most twice
// Space: O(k) - frequency map stores at most k elements
import java.util.HashMap;
import java.util.Map;

public int maxSum(int[] nums, int m, int k) {
    int n = nums.length;

    // Edge case: if k > n, no valid subarray exists
    if (k > n) {
        return 0;
    }

    long maxSum = 0;  // Use long to avoid integer overflow
    long currentSum = 0;
    Map<Integer, Integer> freq = new HashMap<>();  // Frequency map
    int distinctCount = 0;  // Count of distinct elements

    // Initialize the first window
    for (int i = 0; i < k; i++) {
        currentSum += nums[i];
        // Update frequency map and distinct count
        freq.put(nums[i], freq.getOrDefault(nums[i], 0) + 1);
        if (freq.get(nums[i]) == 1) {
            distinctCount++;  // First occurrence in this window
        }
    }

    // Check if first window is valid
    if (distinctCount >= m) {
        maxSum = currentSum;
    }

    // Slide the window across the array
    for (int i = k; i < n; i++) {
        // Element leaving the window: nums[i-k]
        int leftElement = nums[i - k];
        // Element entering the window: nums[i]
        int rightElement = nums[i];

        // Update sum: subtract leaving, add entering
        currentSum = currentSum - leftElement + rightElement;

        // Update frequency for leaving element
        freq.put(leftElement, freq.get(leftElement) - 1);
        if (freq.get(leftElement) == 0) {
            distinctCount--;  // Lost a distinct element
            freq.remove(leftElement);  // Clean up to save space
        }

        // Update frequency for entering element
        freq.put(rightElement, freq.getOrDefault(rightElement, 0) + 1);
        if (freq.get(rightElement) == 1) {
            distinctCount++;  // Gained a distinct element
        }

        // Check if current window is valid
        if (distinctCount >= m) {
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return (int) maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element at most twice: once when it enters the window and once when it leaves
- The initialization takes O(k) time
- The sliding window loop runs (n-k) times, with O(1) operations per iteration
- Total: O(k + (n-k)) = O(n)

**Space Complexity: O(k)**

- The frequency map stores at most k key-value pairs (one for each element in the current window)
- We use a few additional variables (O(1) space)
- Total: O(k) space

## Common Mistakes

1. **Forgetting the k > n edge case**: If k is larger than the array length, there are no subarrays of length k. Always check this early and return 0.

2. **Incorrect distinct count updates**: The most subtle part is updating the distinct count correctly:
   - Only increment distinct count when frequency goes from 0 to 1 (new element)
   - Only decrement distinct count when frequency goes from 1 to 0 (element completely removed)
   - Don't forget to clean up entries with count 0 from the map to keep it accurate

3. **Using a set instead of frequency map**: A set only tells you which elements are present, not how many times. If you have duplicates, removing one occurrence from a set would incorrectly reduce distinct count even if other copies remain.

4. **Integer overflow with large sums**: When k and values are large, sums can exceed 32-bit integer limits. Use 64-bit integers (long in Java, no issue in Python/JavaScript which handle big integers).

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Fixed-size sliding window**: Used when you need to examine all contiguous subarrays of a fixed length.
   - Related problem: [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) - simpler version with just sum
   - Related problem: [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - uses frequency maps with sliding window

2. **Frequency map with sliding window**: Used when you need to track counts of elements in a moving window.
   - Related problem: [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) - variable window size with distinctness constraint
   - Related problem: [Permutation in String](https://leetcode.com/problems/permutation-in-string/) - checks if one string's permutation exists in another

The key insight is recognizing when a problem asks about "subarrays with property X" where X can be efficiently tracked as the window moves.

## Key Takeaways

1. **Sliding window + frequency map is powerful**: When you need to track both sum and element counts in a moving window, this combination gives you O(n) time complexity instead of O(n²).

2. **Distinct count tracking requires careful frequency management**: You can't just use a set—you need a frequency map to know when an element is completely gone from the window.

3. **Fixed vs variable window size**: This problem uses a fixed window (size k), which is simpler than variable-size windows. The sliding logic is cleaner: always add one element and remove one element.

[Practice this problem on CodeJeet](/problem/maximum-sum-of-almost-unique-subarray)
