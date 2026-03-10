---
title: "How to Solve Find Target Indices After Sorting Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Target Indices After Sorting Array. Easy difficulty, 77.8% acceptance rate. Topics: Array, Binary Search, Sorting."
date: "2028-03-19"
category: "dsa-patterns"
tags: ["find-target-indices-after-sorting-array", "array", "binary-search", "sorting", "easy"]
---

# How to Solve Find Target Indices After Sorting Array

This problem asks us to find all indices where a target value appears in an array _after_ sorting it. While it seems straightforward—just sort and iterate—it introduces a key interview concept: **thinking about the relationship between sorted order and index positions**. The interesting part is realizing that once sorted, all target values will be contiguous, and we can find their indices efficiently without even fully sorting the array in some approaches.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

```
nums = [1, 2, 5, 2, 3]
target = 2
```

**Step 1: Sort the array**
After sorting in non-decreasing order:

```
[1, 2, 2, 3, 5]
```

**Step 2: Find target indices**
Now we scan through the sorted array:

- Index 0: value 1 (not target)
- Index 1: value 2 (target found! Add index 1 to result)
- Index 2: value 2 (target found! Add index 2 to result)
- Index 3: value 3 (not target)
- Index 4: value 5 (not target)

**Result:** `[1, 2]`

Notice something important: all target values are grouped together in the sorted array. This means once we find the first occurrence, we know all subsequent targets will be at consecutive indices until we encounter a different value.

## Brute Force Approach

The most straightforward approach is exactly what we did in the visual walkthrough:

1. Sort the entire array
2. Iterate through the sorted array
3. Collect indices where `nums[i] == target`

While this works, it's not the most efficient approach for this specific problem. The brute force has `O(n log n)` time complexity due to sorting, which is acceptable for this problem (and is actually one of the intended solutions), but we can do better by recognizing we don't need the full sorted order—we just need to know where the target values would land.

What some candidates might try (and fail with):

- Trying to find indices in the original array and then sort those indices (this doesn't work because sorting changes the positions)
- Using a hash map to track original indices (these become invalid after sorting)

## Optimal Solution

We have two optimal approaches, both `O(n)` time complexity:

### Approach 1: Counting Method (Most Efficient)

We can count how many numbers are less than the target and how many are equal to the target. In a sorted array, all numbers less than target come first, then all targets, then numbers greater than target.

If we have:

- `less_count`: numbers strictly less than target
- `equal_count`: numbers equal to target

Then the target indices in the sorted array will be: `[less_count, less_count + 1, ..., less_count + equal_count - 1]`

### Approach 2: Two-Pass Linear Scan

1. First pass: count occurrences of target
2. Second pass: count numbers less than target
3. Generate the range of indices

Here's the implementation of the counting method:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output
def targetIndices(nums, target):
    """
    Find indices where target appears after sorting nums.

    Approach: Count numbers less than target and equal to target.
    In sorted order, all numbers < target come first, then all targets,
    then numbers > target.

    Args:
        nums: List of integers
        target: Integer to find indices for

    Returns:
        List of indices where target appears in sorted array
    """
    less_count = 0
    equal_count = 0

    # First pass: count numbers less than and equal to target
    for num in nums:
        if num < target:
            less_count += 1
        elif num == target:
            equal_count += 1

    # Generate the indices where target appears in sorted array
    # If equal_count is 0, range(less_count, less_count) is empty
    result = list(range(less_count, less_count + equal_count))

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output
function targetIndices(nums, target) {
  /**
   * Find indices where target appears after sorting nums.
   *
   * Approach: Count numbers less than target and equal to target.
   * In sorted order, all numbers < target come first, then all targets,
   * then numbers > target.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} target - Integer to find indices for
   * @return {number[]} - Indices where target appears in sorted array
   */
  let lessCount = 0;
  let equalCount = 0;

  // First pass: count numbers less than and equal to target
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < target) {
      lessCount++;
    } else if (nums[i] === target) {
      equalCount++;
    }
  }

  // Generate the indices where target appears in sorted array
  const result = [];
  for (let i = 0; i < equalCount; i++) {
    result.push(lessCount + i);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> targetIndices(int[] nums, int target) {
        /**
         * Find indices where target appears after sorting nums.
         *
         * Approach: Count numbers less than target and equal to target.
         * In sorted order, all numbers < target come first, then all targets,
         * then numbers > target.
         *
         * @param nums - Array of integers
         * @param target - Integer to find indices for
         * @return List of indices where target appears in sorted array
         */
        int lessCount = 0;
        int equalCount = 0;

        // First pass: count numbers less than and equal to target
        for (int num : nums) {
            if (num < target) {
                lessCount++;
            } else if (num == target) {
                equalCount++;
            }
        }

        // Generate the indices where target appears in sorted array
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < equalCount; i++) {
            result.add(lessCount + i);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n)`

- We make a single pass through the array to count numbers less than and equal to target
- The result generation takes `O(k)` where `k` is the number of target occurrences, but `k ≤ n`
- Overall linear time complexity

**Space Complexity:** `O(1)` excluding the output array

- We only use a constant amount of extra space for counters
- The output array takes `O(k)` space where `k` is the number of target occurrences

Compare this to the sorting approach which would be `O(n log n)` time and `O(n)` or `O(log n)` space depending on the sorting algorithm.

## Common Mistakes

1. **Forgetting the array is 0-indexed**: Some candidates might generate indices starting from 1 instead of 0. Remember that after sorting, the first element is at index 0.

2. **Incorrect range generation**: When using the counting method, a common error is:

   ```python
   # WRONG: This misses the first index if equal_count > 0
   result = list(range(less_count + 1, less_count + equal_count))

   # CORRECT: Start at less_count, go up to less_count + equal_count - 1
   result = list(range(less_count, less_count + equal_count))
   ```

3. **Not handling empty result case**: When `equal_count` is 0, we should return an empty list. The range generation handles this automatically since `range(x, x)` is empty.

4. **Confusing sorted indices with original indices**: A tempting but wrong approach is to find indices in the original array first. Remember that sorting changes positions, so original indices become meaningless.

## When You'll See This Pattern

This problem teaches the **counting and positioning** pattern, which appears in many array problems:

1. **Find First and Last Position of Element in Sorted Array (Medium)** - This is essentially the same problem but requires finding just the first and last index instead of all indices. The counting approach here is similar to the binary search approach in that problem.

2. **Rank Transform of an Array (Easy)** - Requires understanding how elements would be positioned after sorting, similar to how we determine where targets would land in sorted order.

3. **How Many Numbers Are Smaller Than the Current Number (Easy)** - Directly uses the "count numbers less than" concept we used here.

The core insight is that in sorted order, elements have predictable positions based on their relationships to other elements (less than, equal to, greater than).

## Key Takeaways

1. **Think about sorted properties**: When a problem mentions sorting, consider what properties sorted arrays have (contiguous equal elements, predictable ordering) and whether you need the actual sorted array or just information about it.

2. **Counting can replace sorting**: For problems where you only need positional information (like "where would this element be after sorting?"), counting elements with certain properties is often more efficient than actually sorting.

3. **Range generation from counts**: When you know how many elements come before your target and how many targets there are, you can generate the index range directly without iterating through the array again.

This problem might seem simple, but it tests your ability to see beyond the obvious solution (sort and search) to a more efficient approach that leverages mathematical reasoning about sorted order.

---

**Related problems:** [Find First and Last Position of Element in Sorted Array](/problem/find-first-and-last-position-of-element-in-sorted-array), [Rank Transform of an Array](/problem/rank-transform-of-an-array), [Find Words Containing Character](/problem/find-words-containing-character)
