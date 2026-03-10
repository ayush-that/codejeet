---
title: "How to Solve Minimum Absolute Sum Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Absolute Sum Difference. Medium difficulty, 32.2% acceptance rate. Topics: Array, Binary Search, Sorting, Ordered Set."
date: "2029-03-27"
category: "dsa-patterns"
tags: ["minimum-absolute-sum-difference", "array", "binary-search", "sorting", "medium"]
---

# How to Solve Minimum Absolute Sum Difference

This problem asks us to minimize the sum of absolute differences between two arrays by replacing at most one element in the first array. The challenge lies in efficiently finding which replacement yields the maximum reduction in the total difference. While the concept is straightforward, the optimization requires careful use of binary search to avoid O(n²) complexity.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
nums1 = [1, 7, 5]
nums2 = [2, 3, 5]
```

**Step 1: Calculate initial absolute differences**

- |1-2| = 1
- |7-3| = 4
- |5-5| = 0
- **Total sum = 1 + 4 + 0 = 5**

**Step 2: Consider possible replacements**
We can replace any element in nums1 with any other value (including values already in nums1).

**For index 0 (current diff = 1):**

- Best replacement would be a number closest to nums2[0] = 2
- From nums1, the closest numbers to 2 are 1 and 5
- Replacing with 1 gives diff |1-2| = 1 (no change)
- Replacing with 5 gives diff |5-2| = 3 (worse)
- Replacing with 7 gives diff |7-2| = 5 (worse)
- **Best reduction = 0**

**For index 1 (current diff = 4):**

- Best replacement would be closest to nums2[1] = 3
- Closest numbers: 1 (diff |1-3| = 2), 5 (diff |5-3| = 2), 7 (diff |7-3| = 4)
- Current diff is 4, new diff would be 2
- **Reduction = 4 - 2 = 2**

**For index 2 (current diff = 0):**

- Best replacement would be closest to nums2[2] = 5
- Closest number is 5 itself (diff = 0)
- **Reduction = 0**

**Step 3: Apply best replacement**
Maximum reduction is 2 at index 1. New total = 5 - 2 = 3.

The key insight: For each position i, we want to find the number in nums1 that's closest to nums2[i] to minimize |new_value - nums2[i]|.

## Brute Force Approach

A naive solution would try every possible replacement:

1. Calculate the initial total sum of absolute differences
2. For each index i in nums1 (the position to replace)
3. For each possible replacement value (could be any number, but practically we'd try all values in nums1)
4. Calculate the new total and track the maximum reduction

This approach has O(n²) time complexity since for each of n positions, we try up to n replacement values. For n up to 10⁵ (as typical in LeetCode), this is far too slow (10¹⁰ operations).

The brute force also has a conceptual flaw: we can't just try values from nums1 - we need to find the value closest to nums2[i], which could be any number. However, since we're replacing with a value from nums1 (we can use any existing element), we only need to consider values already in nums1.

## Optimized Approach

The key insight is that we need to efficiently find, for each nums2[i], the closest value in nums1. This is a classic "closest element" problem that can be solved with binary search on a sorted array.

**Step-by-step reasoning:**

1. **Calculate initial sum**: First compute the total sum of |nums1[i] - nums2[i]| for all i.

2. **Prepare for binary search**: Create a sorted copy of nums1. We'll search in this sorted array to find the closest element to each nums2[i].

3. **Find maximum possible reduction**: For each index i:
   - Current difference = |nums1[i] - nums2[i]|
   - Use binary search to find the element in sorted nums1 closest to nums2[i]
   - New difference = |closest_value - nums2[i]|
   - Reduction = current_difference - new_difference
   - Track the maximum reduction across all indices

4. **Apply the best reduction**: Subtract the maximum reduction from the initial sum. If no replacement improves the sum (max_reduction ≤ 0), we don't replace anything.

5. **Handle modulo**: Return result modulo 10⁹ + 7 as specified.

**Why binary search works:**

- Sorting nums1 takes O(n log n)
- Each binary search takes O(log n)
- Total: O(n log n) + O(n log n) = O(n log n), which is efficient for n ≤ 10⁵

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minAbsoluteSumDiff(nums1, nums2):
    """
    Calculate minimum absolute sum difference after at most one replacement.

    Args:
        nums1: List of integers
        nums2: List of integers (same length as nums1)

    Returns:
        Minimum possible sum modulo 10^9 + 7
    """
    MOD = 10**9 + 7
    n = len(nums1)

    # Step 1: Calculate initial absolute sum
    total_sum = 0
    for i in range(n):
        total_sum += abs(nums1[i] - nums2[i])

    # Step 2: Create sorted copy of nums1 for binary search
    sorted_nums = sorted(nums1)

    # Step 3: Find maximum possible reduction
    max_reduction = 0

    for i in range(n):
        current_diff = abs(nums1[i] - nums2[i])

        # Skip if current difference is already 0 (no room for improvement)
        if current_diff == 0:
            continue

        # Binary search to find closest element to nums2[i] in sorted_nums
        target = nums2[i]
        left, right = 0, n - 1

        # Find position where target would be inserted
        while left <= right:
            mid = left + (right - left) // 2
            if sorted_nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        # left is the insertion point, check left and left-1 for closest
        # Check left if within bounds
        if left < n:
            new_diff = abs(sorted_nums[left] - target)
            reduction = current_diff - new_diff
            max_reduction = max(max_reduction, reduction)

        # Check left-1 if within bounds (could be closer)
        if left > 0:
            new_diff = abs(sorted_nums[left - 1] - target)
            reduction = current_diff - new_diff
            max_reduction = max(max_reduction, reduction)

    # Step 4: Apply best reduction and return modulo result
    result = (total_sum - max_reduction) % MOD
    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Calculate minimum absolute sum difference after at most one replacement.
 * @param {number[]} nums1 - First array
 * @param {number[]} nums2 - Second array (same length as nums1)
 * @return {number} Minimum possible sum modulo 10^9 + 7
 */
function minAbsoluteSumDiff(nums1, nums2) {
  const MOD = 10 ** 9 + 7;
  const n = nums1.length;

  // Step 1: Calculate initial absolute sum
  let totalSum = 0;
  for (let i = 0; i < n; i++) {
    totalSum += Math.abs(nums1[i] - nums2[i]);
  }

  // Step 2: Create sorted copy of nums1 for binary search
  const sortedNums = [...nums1].sort((a, b) => a - b);

  // Step 3: Find maximum possible reduction
  let maxReduction = 0;

  for (let i = 0; i < n; i++) {
    const currentDiff = Math.abs(nums1[i] - nums2[i]);

    // Skip if current difference is already 0
    if (currentDiff === 0) continue;

    const target = nums2[i];

    // Binary search to find closest element to target
    let left = 0,
      right = n - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedNums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // Check left boundary (if within bounds)
    if (left < n) {
      const newDiff = Math.abs(sortedNums[left] - target);
      const reduction = currentDiff - newDiff;
      maxReduction = Math.max(maxReduction, reduction);
    }

    // Check left-1 boundary (if within bounds)
    if (left > 0) {
      const newDiff = Math.abs(sortedNums[left - 1] - target);
      const reduction = currentDiff - newDiff;
      maxReduction = Math.max(maxReduction, reduction);
    }
  }

  // Step 4: Apply best reduction and return modulo result
  return (totalSum - maxReduction) % MOD;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int minAbsoluteSumDiff(int[] nums1, int[] nums2) {
        final int MOD = 1_000_000_007;
        int n = nums1.length;

        // Step 1: Calculate initial absolute sum
        long totalSum = 0; // Use long to avoid overflow
        for (int i = 0; i < n; i++) {
            totalSum += Math.abs(nums1[i] - nums2[i]);
        }

        // Step 2: Create sorted copy of nums1 for binary search
        int[] sortedNums = nums1.clone();
        Arrays.sort(sortedNums);

        // Step 3: Find maximum possible reduction
        long maxReduction = 0;

        for (int i = 0; i < n; i++) {
            int currentDiff = Math.abs(nums1[i] - nums2[i]);

            // Skip if current difference is already 0
            if (currentDiff == 0) continue;

            int target = nums2[i];

            // Binary search to find closest element to target
            int left = 0, right = n - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (sortedNums[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }

            // Check left boundary (if within bounds)
            if (left < n) {
                int newDiff = Math.abs(sortedNums[left] - target);
                long reduction = (long) currentDiff - newDiff;
                maxReduction = Math.max(maxReduction, reduction);
            }

            // Check left-1 boundary (if within bounds)
            if (left > 0) {
                int newDiff = Math.abs(sortedNums[left - 1] - target);
                long reduction = (long) currentDiff - newDiff;
                maxReduction = Math.max(maxReduction, reduction);
            }
        }

        // Step 4: Apply best reduction and return modulo result
        long result = (totalSum - maxReduction) % MOD;
        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting nums1: O(n log n)
- Calculating initial sum: O(n)
- For each of n elements: binary search O(log n) to find closest element
- Total: O(n log n) + O(n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- We create a sorted copy of nums1: O(n)
- Other variables use O(1) additional space
- Total: O(n) for the sorted array

## Common Mistakes

1. **Forgetting to handle the "no replacement" case**: If no replacement improves the sum (max_reduction ≤ 0), we should not make any replacement. The code handles this naturally since max_reduction starts at 0.

2. **Incorrect binary search boundaries**: When finding the closest element, we need to check both `sorted_nums[left]` and `sorted_nums[left-1]` (if they exist). Some candidates only check one, missing cases where the element just before the insertion point is closer.

3. **Integer overflow**: The sum can be large (up to n × max_value ≈ 10⁵ × 10⁵ = 10¹⁰). In Java, use `long` for intermediate sums. In Python, integers are arbitrary precision, but we still need modulo at the end.

4. **Modulo at wrong step**: Apply modulo only at the final result, not during intermediate calculations of max_reduction. We need the actual maximum reduction value to compute the final sum correctly.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search for closest element**: Problems where you need to find the element in a sorted array closest to a target value. Similar to:
   - "Find K Closest Elements" (LeetCode 658)
   - "Heaters" (LeetCode 475) - finding minimum radius to cover all houses

2. **Optimization by replacement**: Problems where you can make limited changes to optimize a metric:
   - "Minimum Sum of Squared Difference" (LeetCode 2333) - similar structure but with squared differences
   - "Minimize Maximum Pair Sum in Array" (LeetCode 1877) - pairing elements to minimize maximum sum

3. **Absolute difference minimization**: A common theme in array problems:
   - "Minimum Moves to Equal Array Elements II" (LeetCode 462) - find median to minimize moves
   - "Minimum Absolute Difference" (LeetCode 1200) - find pairs with minimum difference

## Key Takeaways

1. **When you need "closest element" queries multiple times**, sort the array once and use binary search for O(log n) queries instead of linear search.

2. **For "at most K replacements/operations" problems**, often the optimal strategy is to find where a single operation gives the maximum benefit, then apply it. This greedy approach works when operations don't interfere with each other.

3. **Binary search isn't just for exact matches** - it's also powerful for finding insertion points, closest values, and ranges. The `left` pointer after binary search gives you the insertion index, which is useful for proximity checks.

Related problems: [Minimum Sum of Squared Difference](/problem/minimum-sum-of-squared-difference), [Minimize the Maximum Adjacent Element Difference](/problem/minimize-the-maximum-adjacent-element-difference)
