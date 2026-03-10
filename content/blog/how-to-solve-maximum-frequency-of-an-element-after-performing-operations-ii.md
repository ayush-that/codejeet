---
title: "How to Solve Maximum Frequency of an Element After Performing Operations II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Frequency of an Element After Performing Operations II. Hard difficulty, 53.9% acceptance rate. Topics: Array, Binary Search, Sliding Window, Sorting, Prefix Sum."
date: "2028-02-22"
category: "dsa-patterns"
tags:
  [
    "maximum-frequency-of-an-element-after-performing-operations-ii",
    "array",
    "binary-search",
    "sliding-window",
    "hard",
  ]
---

# How to Solve Maximum Frequency of an Element After Performing Operations II

You're given an array `nums`, an integer `k`, and `numOperations`. You must perform exactly `numOperations` operations, each time selecting a **different** index and adding any integer in `[-k, k]` to that element. Your goal is to maximize the frequency of the most frequent element after all operations. The challenge is that you can't modify the same index twice, and you must use all operations.

What makes this problem tricky is the constraint that each index can only be selected once. This means you can't repeatedly boost the same element to match a target value—you need to strategically choose which elements to modify and by how much to create the largest possible cluster of equal values.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 4, 5, 7]`, `k = 2`, `numOperations = 2`.

We want to maximize the frequency of some target value after operations. Consider trying to make as many elements as possible equal to 5:

1. Element at index 0 (value 1): Needs +4 to reach 5, but `k=2`, so maximum adjustment is +2. Can't reach 5.
2. Element at index 1 (value 4): Needs +1 to reach 5. This is within `[-2, 2]`, so we can modify it.
3. Element at index 2 (value 5): Already 5, no operation needed.
4. Element at index 3 (value 7): Needs -2 to reach 5. This is within `[-2, 2]`, so we can modify it.

We have 2 elements that can be made equal to 5 (indices 1 and 3), plus the original element at index 2. That's 3 total elements equal to 5, using 2 operations.

But wait—we must use all `numOperations=2` operations, and we can't modify the same index twice. So we need exactly 2 modifications. We could:

- Modify index 1 (+1) and index 3 (-2) → 3 elements equal to 5 ✓
- Or modify other combinations, but this gives us frequency 3.

The key insight: For any candidate target value, we need to find the maximum number of elements that can be made equal to it using at most `numOperations` modifications, with each element requiring at most `k` adjustment.

## Brute Force Approach

A naive approach would be:

1. Consider every possible target value (from min(nums)-k to max(nums)+k)
2. For each target, try all combinations of `numOperations` indices to modify
3. Check if those modifications can make the selected elements equal to the target
4. Track the maximum frequency achieved

This is exponential time: O((max-min+2k) × C(n, numOperations)), which is completely infeasible for n up to 10^5.

Even a slightly better brute force would be: For each element as a potential "anchor" (a value we try to match), sort the array and use a sliding window to find how many consecutive elements can be made equal to the anchor with limited operations. But we must account for the constraint that we can only modify `numOperations` elements total, not unlimited operations.

## Optimized Approach

The key insight is that we can use **binary search** on the answer (the maximum frequency) combined with a **sliding window check**.

Here's the reasoning:

1. **Sort the array**: This allows us to consider contiguous segments where elements are close in value.
2. **Binary search on frequency**: We want to find the maximum frequency `f` such that there exists some window of size `f` where we can make all elements equal using at most `numOperations` operations.
3. **Sliding window validation**: For a given window size `f`, we check if any contiguous window of length `f` can be made equal with ≤ `numOperations` operations.
4. **Operations calculation**: To make all elements in a window equal to some value, the optimal target is the median (or any value between the middle elements for even windows). The operations needed = sum of differences from this target, but each difference must be ≤ `k`.

Wait—there's a critical constraint: We can only modify `numOperations` elements total, not unlimited operations. But in our window of size `f`, we're trying to make all `f` elements equal. If we need more than `numOperations` operations to do this, this window size isn't feasible.

Actually, let's think differently: We want to maximize frequency. If we have a window of size `f`, we need to make all `f` elements equal to some value. The minimum operations needed is when we choose the target as the median (for odd f) or any value between the two middle elements (for even f). This minimizes the sum of absolute differences.

But here's the real insight: We don't need to make ALL elements in the window equal—we just need at least `f` elements total to be equal after operations. Some elements in the window might already be equal to our target without modification!

Let's reframe: We're looking for a window where we can achieve frequency `f`. In the best case, some elements in the window are already at our target value (requiring 0 operations). Others need modification. The total modifications needed must be ≤ `numOperations`, AND each individual modification must be ≤ `k` in absolute value.

So the algorithm becomes:

1. Sort `nums`
2. Binary search for maximum frequency `f` (from 1 to n)
3. For each candidate `f`, use sliding window to check if any window of size `f` is "feasible"
4. A window is feasible if there exists a target value such that:
   - For each element in the window, `|target - nums[i]| ≤ k`
   - The sum of `|target - nums[i]|` over modified elements ≤ `numOperations`
   - But we can choose which elements to modify! Elements already equal to target need 0 operations.

Actually, the optimal target for a window is to choose a value that minimizes the number of operations needed. This is typically the median of the window, but constrained by the `k` limit on individual adjustments.

Here's the efficient check: For a window `nums[left:right]` (right exclusive), we want to know the minimum operations to make at least some elements equal. But we need exactly `f` equal elements...

Wait, I realize the issue: We need to be careful. We're not trying to make ALL elements in the window equal—we're looking for ANY `f` elements in the entire array that can be made equal. But with the sliding window approach on sorted array, if we can make a contiguous block of `f` elements equal, that's a valid solution. And if we can make a non-contiguous block equal, we could rearrange them to be contiguous in the sorted order (by choosing a target value they can all reach).

So the sliding window on sorted array works! For a window of size `f`, we check if we can make all `f` elements equal to some value `target`. The constraints:

1. `target` must be within `[nums[i] - k, nums[i] + k]` for all i in the window (intersection of all intervals)
2. The total operations = sum of `|target - nums[i]|` must be ≤ `numOperations`

The optimal `target` is one that minimizes the sum of absolute differences, which is the median. But we also have the `k` constraint, so `target` must be in the intersection of `[nums[i] - k, nums[i] + k]` for all i.

Thus, for a window to be feasible:

1. The intersection of all `[nums[i] - k, nums[i] + k]` must be non-empty
2. Choosing `target` as the value in this intersection closest to the median, the total operations ≤ `numOperations`

## Optimal Solution

The efficient solution uses binary search on the answer with a sliding window feasibility check:

1. Sort the array
2. Binary search for maximum frequency `f` from 1 to n
3. For each `f`, check if any window of size `f` is feasible using sliding window
4. For a window, we need:
   - `max(nums[i] - k) ≤ min(nums[i] + k)` for all i in window (intersection non-empty)
   - Find optimal target in this intersection that minimizes operations
   - Check if total operations ≤ `numOperations`

But there's a simplification: The optimal target is the one that minimizes the sum of absolute differences, which is the median. So we can:

- For window `nums[l:r]` of size `f`, let `mid = l + (f-1)//2` (the median index)
- The optimal target is `nums[mid]` (clamped to be within all `[nums[i]-k, nums[i]+k]` ranges)
- Operations = sum of `|target - nums[i]|` for i in window

We can compute operations efficiently using prefix sums.

<div class="code-group">

```python
# Time: O(n log n + n log n) = O(n log n) | Space: O(n)
def maxFrequency(nums, k, numOperations):
    """
    Returns the maximum frequency achievable after performing exactly numOperations operations.
    Each operation: select a unique index i, add x where x in [-k, k] to nums[i].
    """
    n = len(nums)
    nums.sort()  # Sort to enable sliding window on contiguous elements

    # Prefix sums for efficient range sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Helper function to check if frequency f is achievable
    def can_achieve_frequency(f):
        """Check if we can make f elements equal with ≤ numOperations operations."""
        # Try every window of size f
        for left in range(n - f + 1):
            right = left + f - 1

            # Median index (optimal target value is nums[mid] or close to it)
            mid = left + (f - 1) // 2
            target = nums[mid]

            # Constraint: target must be within [nums[i]-k, nums[i]+k] for all i in window
            # Since array is sorted, we only need to check extremes:
            # target must be ≥ nums[left] - k and ≤ nums[right] + k
            # But actually, we need: for all i, nums[i] - k ≤ target ≤ nums[i] + k
            # Since nums is sorted, this simplifies to:
            # nums[right] - k ≤ target ≤ nums[left] + k
            if target < nums[right] - k:
                target = nums[right] - k
            elif target > nums[left] + k:
                target = nums[left] + k

            # If even after clamping, target doesn't satisfy all constraints, skip
            if target < nums[right] - k or target > nums[left] + k:
                continue

            # Calculate total operations needed
            # Sum of absolute differences from target
            # We can compute efficiently using prefix sums:
            # For elements ≤ target: target * count - sum
            # For elements > target: sum - target * count

            # Find split index (first element > target)
            # Since window is sorted, we can binary search or use the fact that
            # mid is close to where target is
            # Actually, let's compute directly:

            # Left part (elements ≤ target)
            # We need to find the last index ≤ target in the window
            # Since nums[mid] = target (or close), we can search around mid
            split = mid
            while split <= right and nums[split] <= target:
                split += 1
            # Now: nums[left..split-1] ≤ target, nums[split..right] > target

            left_count = split - left
            right_count = right - split + 1

            left_sum = prefix[split] - prefix[left]
            right_sum = prefix[right + 1] - prefix[split]

            operations = (target * left_count - left_sum) + (right_sum - target * right_count)

            if operations <= numOperations:
                return True
        return False

    # Binary search for maximum achievable frequency
    low, high = 1, n
    while low <= high:
        mid = (low + high) // 2
        if can_achieve_frequency(mid):
            low = mid + 1  # Try for higher frequency
        else:
            high = mid - 1

    return high  # high is the maximum achievable frequency
```

```javascript
// Time: O(n log n + n log n) = O(n log n) | Space: O(n)
function maxFrequency(nums, k, numOperations) {
  const n = nums.length;
  nums.sort((a, b) => a - b); // Sort ascending

  // Prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Check if frequency f is achievable
  const canAchieveFrequency = (f) => {
    for (let left = 0; left <= n - f; left++) {
      const right = left + f - 1;
      const mid = left + Math.floor((f - 1) / 2);
      let target = nums[mid];

      // Clamp target to satisfy k constraints
      if (target < nums[right] - k) {
        target = nums[right] - k;
      } else if (target > nums[left] + k) {
        target = nums[left] + k;
      }

      // Check if clamped target satisfies all constraints
      if (target < nums[right] - k || target > nums[left] + k) {
        continue;
      }

      // Find split point (last index where nums[i] ≤ target)
      let split = mid;
      while (split <= right && nums[split] <= target) {
        split++;
      }

      const leftCount = split - left;
      const rightCount = right - split + 1;
      const leftSum = prefix[split] - prefix[left];
      const rightSum = prefix[right + 1] - prefix[split];

      const operations = target * leftCount - leftSum + (rightSum - target * rightCount);

      if (operations <= numOperations) {
        return true;
      }
    }
    return false;
  };

  // Binary search for maximum frequency
  let low = 1,
    high = n;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (canAchieveFrequency(mid)) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return high;
}
```

```java
// Time: O(n log n + n log n) = O(n log n) | Space: O(n)
class Solution {
    public int maxFrequency(int[] nums, int k, int numOperations) {
        int n = nums.length;
        Arrays.sort(nums);  // Sort the array

        // Prefix sums
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }

        // Binary search for maximum frequency
        int left = 1, right = n;
        int answer = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (canAchieve(nums, k, numOperations, mid, prefix)) {
                answer = mid;  // Update answer
                left = mid + 1;  // Try for higher frequency
            } else {
                right = mid - 1;  // Try lower frequency
            }
        }

        return answer;
    }

    private boolean canAchieve(int[] nums, int k, int numOperations, int freq, long[] prefix) {
        int n = nums.length;

        for (int l = 0; l <= n - freq; l++) {
            int r = l + freq - 1;
            int mid = l + (freq - 1) / 2;
            int target = nums[mid];

            // Adjust target to satisfy k constraints
            if (target < nums[r] - k) {
                target = nums[r] - k;
            } else if (target > nums[l] + k) {
                target = nums[l] + k;
            }

            // Check if target satisfies all constraints
            if (target < nums[r] - k || target > nums[l] + k) {
                continue;
            }

            // Find split index (first index > target)
            int split = mid;
            while (split <= r && nums[split] <= target) {
                split++;
            }

            int leftCount = split - l;
            int rightCount = r - split + 1;
            long leftSum = prefix[split] - prefix[l];
            long rightSum = prefix[r + 1] - prefix[split];

            long operations = (target * leftCount - leftSum) + (rightSum - target * rightCount);

            if (operations <= numOperations) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n + n log n) = O(n log n)

- Sorting: O(n log n)
- Binary search on frequency: O(log n)
- For each binary search step, sliding window check: O(n)
- Total: O(n log n) for sorting + O(n log n) for binary search with sliding window = O(n log n)

**Space Complexity:** O(n)

- We need O(n) for the prefix sum array
- Sorting typically uses O(log n) to O(n) space depending on implementation, but we count O(n) for the prefix array

## Common Mistakes

1. **Forgetting the k constraint on individual adjustments**: Candidates often only check the total operations ≤ numOperations, but each individual adjustment must be within [-k, k]. This means the target value must be within [nums[i]-k, nums[i]+k] for all elements in the window.

2. **Incorrect target selection**: Choosing the mean instead of the median minimizes squared error, but we need to minimize absolute differences. The median is optimal for L1 distance (sum of absolute differences).

3. **Not handling the "exactly numOperations" requirement correctly**: The problem says we must perform exactly numOperations operations, but we're checking ≤ numOperations. This is actually correct because we can always add 0 to some element (if k ≥ 0), so we can use up remaining operations with zero-effect adjustments.

4. **Off-by-one errors in sliding window indices**: When computing prefix sums, remember prefix[i] represents sum of first i elements (0-indexed). The window nums[l..r] has sum = prefix[r+1] - prefix[l].

## When You'll See This Pattern

This "binary search on answer + sliding window feasibility check" pattern appears in several optimization problems:

1. **Frequency of the Most Frequent Element (LeetCode 1838)**: Very similar but without the constraint of unique index selection per operation. Uses the same sliding window approach.

2. **Maximum Number of Robots Within Budget (LeetCode 2398)**: Binary search on answer with sliding window to check feasibility under cost constraints.

3. **K Radius Subarray Averages (LeetCode 2090)**: Uses sliding window with prefix sums to compute averages efficiently.

The pattern is: When asked to maximize/minimize some value subject to constraints, and you can check feasibility for a given candidate value efficiently, binary search on the answer is often optimal.

## Key Takeaways

1. **Sorting enables contiguous analysis**: When you can rearrange elements (by choosing which to make equal), sorting lets you consider contiguous windows, which is much easier to reason about.

2. **Binary search on the answer**: When the problem asks "what is the maximum X such that condition Y holds", and you can check condition Y for a given X in better than O(n) time, consider binary searching X.

3. **Sliding window with prefix sums**: For checking feasibility on contiguous windows, sliding window with prefix sums gives O(n) time instead of O(n²) for naive window checking.

Related problems: [Frequency of the Most Frequent Element](/problem/frequency-of-the-most-frequent-element), [Count Elements With Maximum Frequency](/problem/count-elements-with-maximum-frequency)
