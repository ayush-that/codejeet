---
title: "How to Solve Apply Operations to Make All Array Elements Equal to Zero — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Apply Operations to Make All Array Elements Equal to Zero. Medium difficulty, 33.3% acceptance rate. Topics: Array, Prefix Sum."
date: "2029-12-30"
category: "dsa-patterns"
tags: ["apply-operations-to-make-all-array-elements-equal-to-zero", "array", "prefix-sum", "medium"]
---

# How to Solve "Apply Operations to Make All Array Elements Equal to Zero"

This problem asks whether we can make all elements in an array equal to zero by repeatedly decreasing any subarray of size `k` by 1. What makes this problem interesting is that it looks like a sliding window problem at first glance, but the optimal solution requires a clever prefix sum/difference array approach. The key insight is recognizing that operations on overlapping subarrays create dependencies that need to be tracked efficiently.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 2, 3, 1, 1, 0]` with `k = 3`.

**Step 1: Understanding the operation**
We can choose any subarray of size 3 and decrease all its elements by 1. For example, if we choose indices [0, 1, 2], we get: [1, 1, 2, 1, 1, 0].

**Step 2: Thinking about constraints**
Notice that to make the first element (2) zero, we need to apply 2 operations that include index 0. Since operations must be on subarrays of size exactly `k`, the only way to include index 0 is to operate on subarrays starting at index 0 (covering indices 0-2).

**Step 3: Process from left to right**

1. Element at index 0 is 2 → we need 2 operations starting at index 0
   After applying 2 operations starting at index 0: [0, 0, 1, 1, 1, 0]
2. Element at index 1 should now be 0 (and it is)
3. Element at index 2 is 1 → we need 1 operation starting at index 2
   After applying 1 operation starting at index 2: [0, 0, 0, 0, 1, 0]
4. Element at index 3 is 0 (good)
5. Element at index 4 is 1 → we need 1 operation starting at index 4
   But index 4 is too close to the end! A subarray starting at index 4 would need indices 4, 5, 6, but index 6 doesn't exist.

We can't make the array all zeros because we can't apply an operation that includes index 4 without going out of bounds. The answer should be `false`.

This walkthrough reveals the pattern: we must process from left to right, applying operations as needed at each position, and we fail if we need an operation too close to the end where a full subarray of size `k` wouldn't fit.

## Brute Force Approach

A naive approach would try to simulate all possible sequences of operations. At each step, we could:

1. Find the first non-zero element
2. Apply an operation to the subarray starting at that position (if it fits within bounds)
3. Repeat until all elements are zero or we can't make progress

The problem with this approach is the exponential number of possible operation sequences. Even if we're smart about always operating on the first non-zero element, we might need to apply up to `max(nums)` operations at each position, leading to O(n × max(nums)) time complexity, which is too slow for large arrays or large values.

Here's what the brute force simulation might look like:

<div class="code-group">

```python
# Time: O(n * max(nums)) | Space: O(1)
def checkArray(nums, k):
    n = len(nums)

    # Try to make all elements zero
    for i in range(n - k + 1):
        # While the current element is positive, apply operations
        while nums[i] > 0:
            # Decrease the next k elements by 1
            for j in range(i, i + k):
                nums[j] -= 1
                if nums[j] < 0:
                    return False

    # Check if all elements are zero
    return all(x == 0 for x in nums)
```

```javascript
// Time: O(n * max(nums)) | Space: O(1)
function checkArray(nums, k) {
  const n = nums.length;

  // Try to make all elements zero
  for (let i = 0; i <= n - k; i++) {
    // While the current element is positive, apply operations
    while (nums[i] > 0) {
      // Decrease the next k elements by 1
      for (let j = i; j < i + k; j++) {
        nums[j]--;
        if (nums[j] < 0) {
          return false;
        }
      }
    }
  }

  // Check if all elements are zero
  return nums.every((x) => x === 0);
}
```

```java
// Time: O(n * max(nums)) | Space: O(1)
public boolean checkArray(int[] nums, int k) {
    int n = nums.length;

    // Try to make all elements zero
    for (int i = 0; i <= n - k; i++) {
        // While the current element is positive, apply operations
        while (nums[i] > 0) {
            // Decrease the next k elements by 1
            for (int j = i; j < i + k; j++) {
                nums[j]--;
                if (nums[j] < 0) {
                    return false;
                }
            }
        }
    }

    // Check if all elements are zero
    for (int num : nums) {
        if (num != 0) {
            return false;
        }
    }
    return true;
}
```

</div>

This brute force is too slow because in the worst case (like `nums = [1000000, 0, 0, ...]` and `k = 1`), we'd need to loop 1,000,000 times at the first position.

## Optimized Approach

The key insight is that we need to track how many operations are "active" at each position. When we apply an operation starting at index `i`, it affects not just `nums[i]`, but also the next `k-1` elements. We need to know, for each position, how many operations that started earlier are still affecting it.

This is a classic difference array/prefix sum problem:

1. Process the array from left to right
2. Maintain a running total of currently active operations
3. At each position `i`, the value we need to achieve is `nums[i] - current_operations`
4. If this value is negative, we've applied too many operations → return `false`
5. If this value is positive, we need to start new operations here
6. Track when operations "expire" (after `k` steps) so we can subtract them from `current_operations`

We use a difference array to efficiently track when operations expire without having to update all affected elements.

## Optimal Solution

Here's the optimal solution using a difference array to track active operations:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def checkArray(nums, k):
    n = len(nums)
    diff = [0] * (n + 1)  # Difference array with extra space for boundary
    current_ops = 0  # Number of operations currently active at position i

    for i in range(n):
        # Add the difference at position i to current_ops
        current_ops += diff[i]

        # Calculate what the current element would be after applying all active operations
        current_val = nums[i] - current_ops

        # If current_val is negative, we've applied too many operations
        if current_val < 0:
            return False

        # If current_val is positive, we need to start new operations here
        if current_val > 0:
            # Check if we can start an operation (enough room for k elements)
            if i + k > n:
                return False

            # Start current_val new operations at position i
            current_ops += current_val

            # Mark that these operations will expire after k steps
            if i + k < n:
                diff[i + k] -= current_val

    # All elements processed successfully
    return True
```

```javascript
// Time: O(n) | Space: O(n)
function checkArray(nums, k) {
  const n = nums.length;
  const diff = new Array(n + 1).fill(0); // Difference array with extra space for boundary
  let currentOps = 0; // Number of operations currently active at position i

  for (let i = 0; i < n; i++) {
    // Add the difference at position i to currentOps
    currentOps += diff[i];

    // Calculate what the current element would be after applying all active operations
    const currentVal = nums[i] - currentOps;

    // If currentVal is negative, we've applied too many operations
    if (currentVal < 0) {
      return false;
    }

    // If currentVal is positive, we need to start new operations here
    if (currentVal > 0) {
      // Check if we can start an operation (enough room for k elements)
      if (i + k > n) {
        return false;
      }

      // Start currentVal new operations at position i
      currentOps += currentVal;

      // Mark that these operations will expire after k steps
      if (i + k < n) {
        diff[i + k] -= currentVal;
      }
    }
  }

  // All elements processed successfully
  return true;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean checkArray(int[] nums, int k) {
    int n = nums.length;
    int[] diff = new int[n + 1];  // Difference array with extra space for boundary
    int currentOps = 0;  // Number of operations currently active at position i

    for (int i = 0; i < n; i++) {
        // Add the difference at position i to currentOps
        currentOps += diff[i];

        // Calculate what the current element would be after applying all active operations
        int currentVal = nums[i] - currentOps;

        // If currentVal is negative, we've applied too many operations
        if (currentVal < 0) {
            return false;
        }

        // If currentVal is positive, we need to start new operations here
        if (currentVal > 0) {
            // Check if we can start an operation (enough room for k elements)
            if (i + k > n) {
                return false;
            }

            // Start currentVal new operations at position i
            currentOps += currentVal;

            // Mark that these operations will expire after k steps
            if (i + k < n) {
                diff[i + k] -= currentVal;
            }
        }
    }

    // All elements processed successfully
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of length `n`
- Each iteration does constant-time operations (addition, subtraction, comparisons)
- The difference array updates are also O(1) per operation

**Space Complexity: O(n)**

- We use a difference array of size `n+1` to track when operations expire
- This is necessary because in the worst case, we might need to track operations starting at every position
- We could optimize to O(k) space by using a queue/deque to track active operations, but O(n) is simpler and acceptable for most cases

## Common Mistakes

1. **Forgetting to check bounds when starting new operations**: When `currentVal > 0` at position `i`, we must check if `i + k <= n`. If there's not enough room for a full subarray of size `k`, we can't apply the needed operations.

2. **Not tracking operation expiration correctly**: The trickiest part is remembering to subtract operations after they've affected `k` elements. Using `diff[i + k] -= currentVal` ensures we stop counting these operations at the right position.

3. **Confusing when to return false**: There are two failure conditions: (1) `currentVal < 0` means we've over-applied operations, and (2) `currentVal > 0` but `i + k > n` means we can't apply needed operations. Candidates often miss one of these.

4. **Using the wrong data structure for tracking operations**: Some candidates try to use a sliding window sum without the difference array, which requires updating up to `k` elements for each operation. The difference array is key to O(1) updates.

## When You'll See This Pattern

This difference array/prefix sum technique appears in several types of problems:

1. **Range update problems**: When you need to apply the same operation to a range of elements multiple times, like "Range Addition" (LeetCode 370) or "Corporate Flight Bookings" (LeetCode 1109).

2. **Sliding window with cumulative operations**: Problems where operations have lingering effects, like "Minimum Number of K Consecutive Bit Flips" (LeetCode 995) which uses almost identical logic.

3. **Interval scheduling with resource allocation**: When operations affect multiple consecutive time slots, similar to "Car Pooling" (LeetCode 1094).

The core pattern is: when an operation starting at position `i` affects positions `i` through `i+k-1`, use a difference array to track the start and end of these effects for O(1) updates.

## Key Takeaways

1. **Difference arrays excel at range updates**: When you need to apply the same operation to a contiguous subarray multiple times, a difference array lets you track these operations in O(1) time per update.

2. **Process from left to right with cumulative tracking**: Many array transformation problems become simpler when processed sequentially while maintaining running totals of active operations.

3. **Watch for boundary conditions**: Operations that can't fit within array bounds are a common failure case. Always check if there's enough room for the required operation before attempting it.

Related problems: [Continuous Subarray Sum](/problem/continuous-subarray-sum), [Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold](/problem/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold)
