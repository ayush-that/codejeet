---
title: "How to Solve Sliding Window Maximum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sliding Window Maximum. Hard difficulty, 48.5% acceptance rate. Topics: Array, Queue, Sliding Window, Heap (Priority Queue), Monotonic Queue."
date: "2026-07-04"
category: "dsa-patterns"
tags: ["sliding-window-maximum", "array", "queue", "sliding-window", "hard"]
---

# How to Solve Sliding Window Maximum

This problem asks us to find the maximum value in every sliding window of size `k` as it moves from left to right across an array. What makes this problem tricky is that we need to efficiently track the maximum value in a constantly changing window — a naive approach would be too slow for large arrays, while maintaining a sorted structure like a heap introduces its own inefficiencies when elements leave the window.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, -1, -3, 5, 3, 6, 7]` with `k = 3`.

**Window 1: [1, 3, -1]**

- Maximum = 3
- Output so far: [3]

**Window 2: [3, -1, -3]**

- Maximum = 3
- Output: [3, 3]

**Window 3: [-1, -3, 5]**

- Maximum = 5
- Output: [3, 3, 5]

**Window 4: [-3, 5, 3]**

- Maximum = 5
- Output: [3, 3, 5, 5]

**Window 5: [5, 3, 6]**

- Maximum = 6
- Output: [3, 3, 5, 5, 6]

**Window 6: [3, 6, 7]**

- Maximum = 7
- Final output: [3, 3, 5, 5, 6, 7]

The challenge is doing this efficiently without re-scanning each window from scratch.

## Brute Force Approach

The most straightforward solution is to iterate through each possible window position and find the maximum within that window:

1. For each starting index `i` from 0 to `n-k`
2. Scan the next `k` elements to find the maximum
3. Add that maximum to the result list

This approach has O(n × k) time complexity because for each of the (n-k+1) windows, we examine k elements. For large arrays with large k values, this becomes prohibitively slow. For example, with n=100,000 and k=50,000, we'd perform about 2.5 billion operations.

<div class="code-group">

```python
# Time: O(n × k) | Space: O(1) excluding output
def maxSlidingWindowBruteForce(nums, k):
    if not nums:
        return []

    n = len(nums)
    result = []

    # For each possible starting position of the window
    for i in range(n - k + 1):
        # Find maximum in current window
        current_max = float('-inf')
        for j in range(i, i + k):
            current_max = max(current_max, nums[j])
        result.append(current_max)

    return result
```

```javascript
// Time: O(n × k) | Space: O(1) excluding output
function maxSlidingWindowBruteForce(nums, k) {
  if (!nums.length) return [];

  const n = nums.length;
  const result = [];

  // For each possible starting position of the window
  for (let i = 0; i <= n - k; i++) {
    // Find maximum in current window
    let currentMax = -Infinity;
    for (let j = i; j < i + k; j++) {
      currentMax = Math.max(currentMax, nums[j]);
    }
    result.push(currentMax);
  }

  return result;
}
```

```java
// Time: O(n × k) | Space: O(1) excluding output
public int[] maxSlidingWindowBruteForce(int[] nums, int k) {
    if (nums == null || nums.length == 0) {
        return new int[0];
    }

    int n = nums.length;
    int[] result = new int[n - k + 1];

    // For each possible starting position of the window
    for (int i = 0; i <= n - k; i++) {
        // Find maximum in current window
        int currentMax = Integer.MIN_VALUE;
        for (int j = i; j < i + k; j++) {
            currentMax = Math.max(currentMax, nums[j]);
        }
        result[i] = currentMax;
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we need a data structure that can:

1. Quickly give us the current maximum
2. Efficiently remove elements when they leave the window
3. Efficiently add new elements as they enter the window

A **monotonic decreasing deque** (double-ended queue) solves this perfectly. Here's how it works:

- We store **indices** (not values) in the deque
- The deque maintains elements in decreasing order of their values
- The front of the deque always contains the index of the maximum value in the current window
- Before adding a new element, we remove from the back any elements with smaller values (since they can never be the maximum once this new, larger element arrives)
- We remove from the front when that index is no longer in the current window

This approach gives us O(n) time complexity because each element is added and removed from the deque at most once.

## Optimal Solution

Here's the complete solution using a monotonic deque:

<div class="code-group">

```python
# Time: O(n) | Space: O(k)
def maxSlidingWindow(nums, k):
    """
    Returns the maximum value in each sliding window of size k.

    Args:
        nums: List of integers
        k: Size of the sliding window

    Returns:
        List of maximum values for each window position
    """
    from collections import deque

    # Handle edge cases
    if not nums:
        return []

    n = len(nums)
    if k == 1:
        return nums  # Each window contains exactly one element

    result = []
    dq = deque()  # Will store indices, not values

    for i in range(n):
        # Step 1: Remove indices that are out of the current window
        # The window is [i-k+1, i], so indices < i-k+1 are out of bounds
        if dq and dq[0] < i - k + 1:
            dq.popleft()  # Remove from front

        # Step 2: Maintain decreasing order in deque
        # Remove from back while current element is greater than last element in deque
        while dq and nums[i] > nums[dq[-1]]:
            dq.pop()  # Remove from back

        # Step 3: Add current index to deque
        dq.append(i)

        # Step 4: Add maximum to result once we've processed first k elements
        # We start adding to result when i >= k-1 (0-indexed)
        if i >= k - 1:
            result.append(nums[dq[0]])  # Front of deque has max index

    return result
```

```javascript
// Time: O(n) | Space: O(k)
function maxSlidingWindow(nums, k) {
  /**
   * Returns the maximum value in each sliding window of size k.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Size of the sliding window
   * @return {number[]} - Array of maximum values for each window position
   */

  // Handle edge cases
  if (!nums.length) return [];
  if (k === 1) return nums.slice(); // Each window contains exactly one element

  const n = nums.length;
  const result = [];
  const dq = []; // Will store indices, not values

  for (let i = 0; i < n; i++) {
    // Step 1: Remove indices that are out of the current window
    // The window is [i-k+1, i], so indices < i-k+1 are out of bounds
    if (dq.length > 0 && dq[0] < i - k + 1) {
      dq.shift(); // Remove from front
    }

    // Step 2: Maintain decreasing order in deque
    // Remove from back while current element is greater than last element in deque
    while (dq.length > 0 && nums[i] > nums[dq[dq.length - 1]]) {
      dq.pop(); // Remove from back
    }

    // Step 3: Add current index to deque
    dq.push(i);

    // Step 4: Add maximum to result once we've processed first k elements
    // We start adding to result when i >= k-1 (0-indexed)
    if (i >= k - 1) {
      result.push(nums[dq[0]]); // Front of deque has max index
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(k)
public int[] maxSlidingWindow(int[] nums, int k) {
    /**
     * Returns the maximum value in each sliding window of size k.
     *
     * @param nums - Array of integers
     * @param k - Size of the sliding window
     * @return - Array of maximum values for each window position
     */

    // Handle edge cases
    if (nums == null || nums.length == 0) {
        return new int[0];
    }
    if (k == 1) {
        return nums.clone();  // Each window contains exactly one element
    }

    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();  // Will store indices, not values

    for (int i = 0; i < n; i++) {
        // Step 1: Remove indices that are out of the current window
        // The window is [i-k+1, i], so indices < i-k+1 are out of bounds
        if (!dq.isEmpty() && dq.peekFirst() < i - k + 1) {
            dq.pollFirst();  // Remove from front
        }

        // Step 2: Maintain decreasing order in deque
        // Remove from back while current element is greater than last element in deque
        while (!dq.isEmpty() && nums[i] > nums[dq.peekLast()]) {
            dq.pollLast();  // Remove from back
        }

        // Step 3: Add current index to deque
        dq.offerLast(i);

        // Step 4: Add maximum to result once we've processed first k elements
        // We start adding to result when i >= k-1 (0-indexed)
        if (i >= k - 1) {
            result[i - k + 1] = nums[dq.peekFirst()];  // Front of deque has max index
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each element is added to the deque exactly once
- Each element is removed from the deque at most once
- The while loops for maintaining the deque order might look like they could be O(n²), but they're actually amortized O(1) per element because each element is processed at most twice (added once, removed once)

**Space Complexity: O(k)**

- The deque stores at most k indices at any time
- In the worst case (when the array is strictly decreasing), the deque will contain all k elements of the current window
- The output array uses O(n-k+1) space, but this is typically not counted in auxiliary space complexity

## Common Mistakes

1. **Storing values instead of indices in the deque**: If you store values, you can't tell when an element leaves the window. Always store indices so you can check if `dq[0] < i - k + 1`.

2. **Incorrect window boundary calculation**: The condition for when an index leaves the window is `index < i - k + 1`, not `index < i - k`. Remember that the window includes both endpoints.

3. **Forgetting to handle k=1 or empty array edge cases**: When k=1, each window contains exactly one element, so the result is just the input array. Always test these edge cases.

4. **Adding to result too early or too late**: You should start adding to the result when `i >= k - 1`, which is after you've processed the first complete window. If you add earlier, you'll have windows with fewer than k elements.

## When You'll See This Pattern

The monotonic deque pattern appears in several sliding window problems:

1. **Minimum Window Substring (Hard)**: While not using a deque directly, it uses a similar sliding window approach with character frequency tracking.

2. **Min Stack (Medium)**: The concept of maintaining a secondary structure to track extremum values (min/max) is similar to maintaining a monotonic deque.

3. **Longest Substring with At Most Two Distinct Characters (Medium)**: Uses a sliding window with character tracking, similar to maintaining window constraints.

4. **Shortest Subarray with Sum at Least K (Hard)**: Uses a monotonic deque to maintain prefix sums in increasing order, allowing O(n) solution.

## Key Takeaways

1. **Monotonic deques are perfect for sliding window maximum/minimum problems**: They let you maintain extremum values while efficiently adding new elements and removing old ones.

2. **Store indices, not values**: This allows you to track when elements leave the window. The values can always be retrieved from the original array using the indices.

3. **The pattern generalizes**: Any problem where you need to efficiently track the maximum/minimum in a sliding window can use this approach. The deque maintains elements in monotonic order (decreasing for max, increasing for min).

Related problems: [Minimum Window Substring](/problem/minimum-window-substring), [Min Stack](/problem/min-stack), [Longest Substring with At Most Two Distinct Characters](/problem/longest-substring-with-at-most-two-distinct-characters)
