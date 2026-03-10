---
title: "How to Solve Apply Operations to Maximize Frequency Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Apply Operations to Maximize Frequency Score. Hard difficulty, 38.6% acceptance rate. Topics: Array, Binary Search, Sliding Window, Sorting, Prefix Sum."
date: "2026-05-27"
category: "dsa-patterns"
tags:
  [
    "apply-operations-to-maximize-frequency-score",
    "array",
    "binary-search",
    "sliding-window",
    "hard",
  ]
---

# How to Solve "Apply Operations to Maximize Frequency Score"

This problem asks us to maximize the frequency of the most frequent element in an array after performing at most `k` operations, where each operation can increment or decrement any element by 1. The challenge lies in efficiently determining which target value to converge elements toward and how many elements we can make equal to that target within the operation budget.

What makes this problem interesting is that it's not about making all elements equal to the current most frequent element, but about finding the optimal target value that allows us to make the largest contiguous segment of the sorted array equal with minimal operations. This is essentially a **sliding window with prefix sums** problem in disguise.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 4, 5, 6]`, `k = 3`

**Step 1: Sort the array**
Sorted: `[1, 2, 4, 5, 6]`

**Step 2: Try making elements equal to different targets**
We want to find the largest window where we can make all elements equal to the rightmost element (or any element within the window) within `k` operations.

Let's try making a window equal to 6:

- Window `[4, 5, 6]`: To make 4→6 needs 2 ops, 5→6 needs 1 op, total = 3 ops
- We can make these 3 elements equal to 6 using exactly 3 operations
- Frequency score = 3

Let's try making a window equal to 5:

- Window `[2, 4, 5]`: 2→5 needs 3 ops, 4→5 needs 1 op, total = 4 ops (exceeds k=3)
- Window `[4, 5]`: 4→5 needs 1 op, total = 1 op
- Best with target 5 is window size 2

Let's try making a window equal to 4:

- Window `[1, 2, 4]`: 1→4 needs 3 ops, 2→4 needs 2 ops, total = 5 ops (exceeds k)
- Window `[2, 4]`: 2→4 needs 2 ops, total = 2 ops
- Best with target 4 is window size 2

The maximum frequency we found is 3 by making `[4, 5, 6]` all equal to 6.

**Key insight**: When we sort the array, the optimal solution will always make a contiguous segment equal to the rightmost element of that segment. This is because making elements equal to a value outside the segment would require more operations.

## Brute Force Approach

A naive approach would be to try every possible target value and every possible window, calculating the operations needed to make all elements in the window equal to the target:

1. For each element as potential target
2. For each window size
3. Calculate operations needed = Σ|nums[i] - target|
4. Keep track of maximum window size where operations ≤ k

This approach has O(n³) complexity (O(n²) windows × O(n) operations calculation) which is far too slow for n up to 10⁵.

Even with some optimization (like trying only existing array values as targets), we'd still have O(n³) complexity. The fundamental issue is recalculating operations for overlapping windows from scratch.

## Optimized Approach

The key insight is that when the array is sorted, we can use a **sliding window** approach with **prefix sums** to efficiently calculate the operations needed.

**Why sorting works**:

- In the optimal solution, the elements we make equal will always be contiguous in the sorted array
- The optimal target value will be the rightmost element of the window (minimizing operations)

**How sliding window with prefix sums works**:

1. Sort the array
2. Use two pointers `left` and `right` to define a window
3. Maintain a running total of operations needed to make all elements in `[left, right]` equal to `nums[right]`
4. The operations needed = `(nums[right] * window_size) - sum_of_window`
5. Use prefix sums to get `sum_of_window` in O(1) time
6. If operations exceed `k`, shrink the window from the left
7. Track the maximum window size

**Why this formula works**:
To make all elements in window `[l, r]` equal to `nums[r]`:

- Each element `nums[i]` needs `nums[r] - nums[i]` operations
- Total operations = `Σ(nums[r] - nums[i])` for i from l to r
- = `(r-l+1)*nums[r] - Σ(nums[i])`
- = `window_size * nums[right] - (prefix[r+1] - prefix[l])`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
# Space: O(n) for prefix sums array (can be O(1) with running sum)
def maxFrequencyScore(nums, k):
    n = len(nums)
    # Step 1: Sort the array - crucial for sliding window approach
    nums.sort()

    # Step 2: Create prefix sums array
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    max_freq = 0
    left = 0

    # Step 3: Sliding window with right pointer
    for right in range(n):
        # Current window is [left, right]
        window_size = right - left + 1

        # Calculate operations needed to make all elements in window
        # equal to nums[right] (the largest in current window)
        # Formula: window_size * target - sum_of_window
        sum_window = prefix[right + 1] - prefix[left]
        operations_needed = nums[right] * window_size - sum_window

        # Step 4: If operations exceed k, shrink window from left
        while operations_needed > k:
            left += 1
            # Recalculate for new window
            window_size = right - left + 1
            sum_window = prefix[right + 1] - prefix[left]
            operations_needed = nums[right] * window_size - sum_window

        # Step 5: Update maximum frequency
        max_freq = max(max_freq, window_size)

    return max_freq
```

```javascript
// Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
// Space: O(n) for prefix sums array
function maxFrequencyScore(nums, k) {
  const n = nums.length;
  // Step 1: Sort the array
  nums.sort((a, b) => a - b);

  // Step 2: Create prefix sums array
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  let maxFreq = 0;
  let left = 0;

  // Step 3: Sliding window with right pointer
  for (let right = 0; right < n; right++) {
    // Current window is [left, right]
    let windowSize = right - left + 1;

    // Calculate operations needed
    const sumWindow = prefix[right + 1] - prefix[left];
    let operationsNeeded = nums[right] * windowSize - sumWindow;

    // Step 4: Shrink window if operations exceed k
    while (operationsNeeded > k) {
      left++;
      // Recalculate for new window
      windowSize = right - left + 1;
      const newSumWindow = prefix[right + 1] - prefix[left];
      operationsNeeded = nums[right] * windowSize - newSumWindow;
    }

    // Step 5: Update maximum frequency
    maxFreq = Math.max(maxFreq, windowSize);
  }

  return maxFreq;
}
```

```java
// Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
// Space: O(n) for prefix sums array
public int maxFrequencyScore(int[] nums, int k) {
    int n = nums.length;
    // Step 1: Sort the array
    Arrays.sort(nums);

    // Step 2: Create prefix sums array
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    int maxFreq = 0;
    int left = 0;

    // Step 3: Sliding window with right pointer
    for (int right = 0; right < n; right++) {
        // Current window is [left, right]
        int windowSize = right - left + 1;

        // Calculate operations needed
        // Use long to prevent integer overflow
        long sumWindow = prefix[right + 1] - prefix[left];
        long operationsNeeded = (long) nums[right] * windowSize - sumWindow;

        // Step 4: Shrink window if operations exceed k
        while (operationsNeeded > k) {
            left++;
            // Recalculate for new window
            windowSize = right - left + 1;
            sumWindow = prefix[right + 1] - prefix[left];
            operationsNeeded = (long) nums[right] * windowSize - sumWindow;
        }

        // Step 5: Update maximum frequency
        maxFreq = Math.max(maxFreq, windowSize);
    }

    return maxFreq;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The sliding window processes each element at most twice (once as `right`, once as `left` when shrinking), giving O(n) time
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity: O(n)**

- We need O(n) space for the prefix sums array
- The sorting may use O(log n) to O(n) additional space depending on the algorithm
- Can be optimized to O(1) additional space by using a running sum instead of prefix array, but the sliding window logic becomes slightly more complex

## Common Mistakes

1. **Forgetting to sort the array**: This is the most critical step. Without sorting, the sliding window approach doesn't work because the optimal elements won't be contiguous. Always sort first!

2. **Integer overflow in operations calculation**: When n and values are large (up to 10⁵ and 10⁹ respectively), `nums[right] * windowSize` can exceed 32-bit integer limits. Use 64-bit integers (long in Java, default in Python).

3. **Incorrect operations formula**: A common error is using `Σ|nums[i] - target|` directly instead of the optimized `window_size * target - sum_of_window`. The absolute value disappears because in sorted array with target as rightmost element, all differences are non-negative.

4. **Shrinking window too much or too little**: When operations exceed k, you must shrink from the left, but be careful to recalculate operations for the new window. Don't assume a fixed shrink amount.

## When You'll See This Pattern

This sliding window with prefix sums pattern appears in problems where you need to:

1. Make elements equal or similar
2. Have a budget of operations
3. Want to maximize some metric (frequency, window size, etc.)

**Related problems:**

1. **Frequency of the Most Frequent Element (LeetCode 1838)**: Almost identical problem - maximize frequency by incrementing elements. Uses the exact same approach.
2. **Minimum Operations to Make Array Equal (LeetCode 1551)**: Making all elements equal with minimal operations.
3. **Minimum Operations to Reduce X to Zero (LeetCode 1658)**: Another sliding window problem with prefix sums, though with a different objective.

## Key Takeaways

1. **Sorting enables sliding window**: When you need to make elements equal or similar, sorting first often reveals that the optimal elements are contiguous in the sorted order.

2. **Prefix sums optimize repeated calculations**: When you need to frequently calculate sums of subarrays, prefix sums reduce O(n) calculations to O(1) lookups.

3. **The rightmost element is the optimal target**: In a sorted window, making all elements equal to the largest element minimizes the total operations needed (all differences are positive, no absolute values needed).

Related problems: [Frequency of the Most Frequent Element](/problem/frequency-of-the-most-frequent-element)
