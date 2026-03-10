---
title: "How to Solve K Radius Subarray Averages — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K Radius Subarray Averages. Medium difficulty, 46.1% acceptance rate. Topics: Array, Sliding Window."
date: "2026-02-10"
category: "dsa-patterns"
tags: ["k-radius-subarray-averages", "array", "sliding-window", "medium"]
---

# How to Solve K Radius Subarray Averages

This problem asks us to compute the average of elements within a sliding window of radius `k` around each index. The challenge is that we need to efficiently compute these averages for all valid indices while handling edge cases where the window doesn't have enough elements. What makes this interesting is that it looks like a simple sliding window problem, but requires careful handling of boundaries and the special `-1` values for invalid windows.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [7,4,3,9,1,8,5,2,6]` with `k = 3`.

For index `i = 0`:

- We need elements from `i - k = -3` to `i + k = 3`
- Since `-3` is out of bounds, this window is invalid → result[0] = -1

For index `i = 1`:

- Window from `-2` to `4` → still invalid → result[1] = -1

For index `i = 2`:

- Window from `-1` to `5` → still invalid → result[2] = -1

For index `i = 3`:

- Window from `0` to `6` → valid! Elements: `[7,4,3,9,1,8,5]`
- Sum = 7 + 4 + 3 + 9 + 1 + 8 + 5 = 37
- Average = 37 / 7 = 5 (integer division truncates toward zero)

For index `i = 4`:

- Window from `1` to `7` → valid! Elements: `[4,3,9,1,8,5,2]`
- Sum = 4 + 3 + 9 + 1 + 8 + 5 + 2 = 32
- Average = 32 / 7 = 4

We can see a pattern: once we're past the first `k` indices and before the last `k` indices, we have valid windows. The key insight is that when moving from one valid window to the next, we're just removing the leftmost element and adding the new rightmost element. This suggests a sliding window approach!

## Brute Force Approach

The most straightforward solution is to compute each average independently:

1. For each index `i` from 0 to n-1:
2. Check if `i - k < 0` or `i + k >= n` → if yes, set result[i] = -1
3. Otherwise, sum elements from `i - k` to `i + k` and divide by `(2k + 1)`

This approach has a major problem: it recomputes overlapping sums repeatedly. For each window of size `(2k + 1)`, we sum all elements, leading to O(k) work per index. With n indices, this becomes O(n × k) time complexity, which is too slow for large inputs (n up to 10⁵).

<div class="code-group">

```python
# Time: O(n × k) | Space: O(1) excluding output
def getAverages(nums, k):
    n = len(nums)
    result = [0] * n
    window_size = 2 * k + 1

    for i in range(n):
        # Check if window is valid
        if i - k < 0 or i + k >= n:
            result[i] = -1
        else:
            # Sum all elements in the window
            total = 0
            for j in range(i - k, i + k + 1):
                total += nums[j]
            result[i] = total // window_size

    return result
```

```javascript
// Time: O(n × k) | Space: O(1) excluding output
function getAverages(nums, k) {
  const n = nums.length;
  const result = new Array(n);
  const windowSize = 2 * k + 1;

  for (let i = 0; i < n; i++) {
    // Check if window is valid
    if (i - k < 0 || i + k >= n) {
      result[i] = -1;
    } else {
      // Sum all elements in the window
      let total = 0;
      for (let j = i - k; j <= i + k; j++) {
        total += nums[j];
      }
      result[i] = Math.floor(total / windowSize);
    }
  }

  return result;
}
```

```java
// Time: O(n × k) | Space: O(1) excluding output
public int[] getAverages(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n];
    int windowSize = 2 * k + 1;

    for (int i = 0; i < n; i++) {
        // Check if window is valid
        if (i - k < 0 || i + k >= n) {
            result[i] = -1;
        } else {
            // Sum all elements in the window
            int total = 0;
            for (int j = i - k; j <= i + k; j++) {
                total += nums[j];
            }
            result[i] = total / windowSize;
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that consecutive windows overlap significantly. When we move from index `i` to `i+1`, the new window is just the old window with the leftmost element removed and a new rightmost element added. We can maintain a running sum:

1. Initialize a sum for the first valid window (centered at index `k`)
2. For each subsequent valid index, update the sum by:
   - Subtracting the element that just left the window (`nums[i - k - 1]`)
   - Adding the new element that entered (`nums[i + k]`)
3. Compute the average as `sum // (2k + 1)`

This sliding window technique reduces the time complexity from O(n × k) to O(n) because we only do constant work per index.

We need to handle the edge cases carefully:

- First `k` indices and last `k` indices get `-1`
- We only start computing averages from index `k` onward
- We stop computing averages at index `n - k - 1`

## Optimal Solution

Here's the efficient sliding window implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output
def getAverages(nums, k):
    n = len(nums)
    result = [-1] * n  # Initialize all to -1, we'll update valid ones

    # If window size is larger than array, no valid windows exist
    if 2 * k + 1 > n:
        return result

    window_size = 2 * k + 1
    window_sum = 0

    # Calculate initial sum for the first valid window (centered at index k)
    for i in range(window_size):
        window_sum += nums[i]

    # The first valid average is at index k
    result[k] = window_sum // window_size

    # Slide the window across the array
    for i in range(k + 1, n - k):
        # Remove element that left the window (i - k - 1)
        # Add element that entered the window (i + k)
        window_sum = window_sum - nums[i - k - 1] + nums[i + k]
        result[i] = window_sum // window_size

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output
function getAverages(nums, k) {
  const n = nums.length;
  const result = new Array(n).fill(-1); // Initialize all to -1

  // If window size is larger than array, no valid windows exist
  if (2 * k + 1 > n) {
    return result;
  }

  const windowSize = 2 * k + 1;
  let windowSum = 0;

  // Calculate initial sum for the first valid window (centered at index k)
  for (let i = 0; i < windowSize; i++) {
    windowSum += nums[i];
  }

  // The first valid average is at index k
  result[k] = Math.floor(windowSum / windowSize);

  // Slide the window across the array
  for (let i = k + 1; i < n - k; i++) {
    // Remove element that left the window (i - k - 1)
    // Add element that entered the window (i + k)
    windowSum = windowSum - nums[i - k - 1] + nums[i + k];
    result[i] = Math.floor(windowSum / windowSize);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output
public int[] getAverages(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n];

    // Initialize all to -1
    for (int i = 0; i < n; i++) {
        result[i] = -1;
    }

    // If window size is larger than array, no valid windows exist
    if (2 * k + 1 > n) {
        return result;
    }

    int windowSize = 2 * k + 1;
    long windowSum = 0;  // Use long to prevent integer overflow

    // Calculate initial sum for the first valid window (centered at index k)
    for (int i = 0; i < windowSize; i++) {
        windowSum += nums[i];
    }

    // The first valid average is at index k
    result[k] = (int)(windowSum / windowSize);

    // Slide the window across the array
    for (int i = k + 1; i < n - k; i++) {
        // Remove element that left the window (i - k - 1)
        // Add element that entered the window (i + k)
        windowSum = windowSum - nums[i - k - 1] + nums[i + k];
        result[i] = (int)(windowSum / windowSize);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once to initialize the result array: O(n)
- We compute the initial window sum: O(2k + 1) = O(k)
- We slide the window across n - 2k indices: O(n - 2k) = O(n)
- Total: O(n + k) = O(n) since k ≤ n

**Space Complexity: O(1) excluding output**

- We use only a few variables: window_sum, window_size, loop counters
- The result array is required by the problem, so we don't count it toward space complexity
- If we count the output, it's O(n) for the result array

## Common Mistakes

1. **Off-by-one errors in window boundaries**: The window includes both `i - k` and `i + k`, so the size is `2k + 1`, not `2k`. Candidates often use `2k` and get wrong averages.

2. **Integer division vs. float division**: The problem expects integer division (truncating toward zero). Using float division and then converting to int gives different results for negative numbers. In Python, `//` handles this correctly, but in other languages you need to be careful.

3. **Forgetting to handle the case where k is large**: When `2k + 1 > n`, no valid windows exist. The entire result array should be `-1`. Some implementations might try to access out-of-bounds indices in this case.

4. **Not using long for sum in Java**: The sum can exceed 32-bit integer limits (nums[i] ≤ 10⁵, window size up to n ≤ 10⁵, so sum ≤ 10¹⁰). Using `int` for the sum in Java causes overflow.

## When You'll See This Pattern

The sliding window pattern is fundamental for problems involving contiguous subarrays or substrings:

1. **Minimum Size Subarray Sum (Medium)**: Find the minimal length of a contiguous subarray whose sum ≥ target. Similar sliding window approach but with variable window size.

2. **Moving Average from Data Stream (Easy)**: Calculate the moving average of a stream of numbers with a fixed window size. Almost identical to this problem but with a stream instead of an array.

3. **Maximum Average Subarray I (Easy)**: Find the contiguous subarray of given length with the maximum average. This is essentially the same problem but finding the maximum instead of computing all averages.

4. **Fruit Into Baskets (Medium)**: While not exactly the same, it uses a similar sliding window technique with hash maps to track counts.

## Key Takeaways

1. **Sliding window optimization**: When you need to compute something for all contiguous subarrays of fixed size, use a sliding window to avoid recomputing overlapping portions. The key formula is: `new_sum = old_sum - outgoing_element + incoming_element`.

2. **Boundary handling is critical**: Always check if your window fits within array bounds before computing. Initialize results with default values (like `-1`) and only update valid indices.

3. **Watch for integer overflow**: When summing many numbers, the total can exceed 32-bit integer limits. Use 64-bit integers (long in Java, no issue in Python) for the running sum.

Related problems: [Minimum Size Subarray Sum](/problem/minimum-size-subarray-sum), [Moving Average from Data Stream](/problem/moving-average-from-data-stream), [Subarray Sum Equals K](/problem/subarray-sum-equals-k)
