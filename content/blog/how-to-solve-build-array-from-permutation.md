---
title: "How to Solve Build Array from Permutation — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Build Array from Permutation. Easy difficulty, 91.1% acceptance rate. Topics: Array, Simulation."
date: "2026-11-23"
category: "dsa-patterns"
tags: ["build-array-from-permutation", "array", "simulation", "easy"]
---

# How to Solve Build Array from Permutation

This problem asks us to transform an array by applying a specific mapping: for each index `i`, the output value should be `nums[nums[i]]`. While the problem is straightforward, it's an excellent exercise in understanding array indexing and in-place transformations. The key insight is recognizing that we need to access elements based on values stored at other indices, which requires careful handling to avoid overwriting values we still need.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the input array `nums = [0, 2, 1, 5, 3, 4]`.

We need to create an output array `ans` where `ans[i] = nums[nums[i]]` for each index `i`:

- **i = 0**: `nums[0] = 0`, so `ans[0] = nums[0] = 0`
- **i = 1**: `nums[1] = 2`, so `ans[1] = nums[2] = 1`
- **i = 2**: `nums[2] = 1`, so `ans[2] = nums[1] = 2`
- **i = 3**: `nums[3] = 5`, so `ans[3] = nums[5] = 4`
- **i = 4**: `nums[4] = 3`, so `ans[4] = nums[3] = 5`
- **i = 5**: `nums[5] = 4`, so `ans[5] = nums[4] = 3`

Thus, our output array is `[0, 1, 2, 4, 5, 3]`.

Notice that we're essentially performing a double lookup: first we get the value at `nums[i]`, then we use that value as an index to get the final value. This is why the problem specifies that `nums` is a permutation of `0..n-1` — every value in `nums` is a valid index within the array bounds.

## Brute Force Approach

The most intuitive approach is to create a new array of the same length, then iterate through each index `i`, compute `nums[nums[i]]`, and store it in the new array at position `i`. This approach is actually optimal for this problem in terms of time complexity, but let's examine why:

1. Create an empty result array of the same length as `nums`
2. For each index `i` from `0` to `n-1`:
   - Compute `nums[nums[i]]`
   - Store this value at position `i` in the result array
3. Return the result array

This approach works perfectly and has O(n) time complexity and O(n) space complexity. In fact, this is the optimal solution for most scenarios since we need to return a new array. The only potential optimization would be an in-place solution that modifies the original array, but that's usually not required unless specifically asked.

## Optimal Solution

The straightforward solution is already optimal. We'll implement it with clear comments explaining each step.

<div class="code-group">

```python
# Time: O(n) - We iterate through the array once
# Space: O(n) - We create a new array of the same size
def buildArray(nums):
    """
    Builds an array where ans[i] = nums[nums[i]] for all i.

    Args:
        nums: List[int] - A zero-based permutation array

    Returns:
        List[int] - The transformed array
    """
    n = len(nums)  # Get the length of the input array
    ans = [0] * n  # Initialize result array with zeros

    # Iterate through each index in the array
    for i in range(n):
        # Apply the transformation: ans[i] = nums[nums[i]]
        # First, nums[i] gives us an index, then we get the value at that index
        ans[i] = nums[nums[i]]

    return ans  # Return the transformed array
```

```javascript
// Time: O(n) - We iterate through the array once
// Space: O(n) - We create a new array of the same size
function buildArray(nums) {
  /**
   * Builds an array where ans[i] = nums[nums[i]] for all i.
   *
   * @param {number[]} nums - A zero-based permutation array
   * @return {number[]} - The transformed array
   */
  const n = nums.length; // Get the length of the input array
  const ans = new Array(n); // Initialize result array

  // Iterate through each index in the array
  for (let i = 0; i < n; i++) {
    // Apply the transformation: ans[i] = nums[nums[i]]
    // First, nums[i] gives us an index, then we get the value at that index
    ans[i] = nums[nums[i]];
  }

  return ans; // Return the transformed array
}
```

```java
// Time: O(n) - We iterate through the array once
// Space: O(n) - We create a new array of the same size
class Solution {
    public int[] buildArray(int[] nums) {
        /**
         * Builds an array where ans[i] = nums[nums[i]] for all i.
         *
         * @param nums - A zero-based permutation array
         * @return - The transformed array
         */
        int n = nums.length;  // Get the length of the input array
        int[] ans = new int[n];  // Initialize result array

        // Iterate through each index in the array
        for (int i = 0; i < n; i++) {
            // Apply the transformation: ans[i] = nums[nums[i]]
            // First, nums[i] gives us an index, then we get the value at that index
            ans[i] = nums[nums[i]];
        }

        return ans;  // Return the transformed array
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once, performing constant-time operations (array lookups and assignments) for each of the `n` elements.

**Space Complexity: O(n)**

- We create a new array `ans` of the same size as the input array `nums`, which requires O(n) additional space.
- The space used by the input array itself doesn't count toward our space complexity analysis since it's given as input.

## Common Mistakes

1. **Modifying the input array while reading from it**: Some candidates try to perform the transformation in-place without using a separate array. This can lead to incorrect results because when you modify `nums[i]`, subsequent calculations that depend on the original value of `nums[i]` will be wrong. Always use a separate result array unless specifically asked to modify in-place.

2. **Incorrect array bounds**: While the problem guarantees that `nums` contains values from `0` to `n-1`, candidates sometimes forget that `nums[nums[i]]` involves two array accesses. They might accidentally use an out-of-bounds index if they misinterpret the problem statement. Always verify that `nums[i]` is within bounds before using it as an index.

3. **Confusing 0-based and 1-based indexing**: The problem explicitly states "zero-based permutation," but some candidates accidentally use 1-based indexing in their calculations. Remember that array indices in most programming languages start at 0, and the values in `nums` are also 0-based indices.

4. **Overcomplicating the solution**: This is a straightforward array transformation problem. Some candidates try to use advanced data structures or algorithms when a simple loop is sufficient. Recognize when a problem has a simple linear solution and implement it cleanly.

## When You'll See This Pattern

This problem demonstrates a fundamental pattern of **array transformation based on index mapping**. You'll encounter similar patterns in these problems:

1. **Shuffle the Array (LeetCode 1470)**: Similar transformation where you need to interleave elements from two halves of an array based on a specific pattern.

2. **Concatenation of Array (LeetCode 1929)**: While simpler, it involves creating a new array based on the original array's values.

3. **Rotate Array (LeetCode 189)**: Involves repositioning elements based on index calculations, though it's more complex due to the rotation aspect.

4. **Product of Array Except Self (LeetCode 238)**: While more complex, it involves creating a new array where each element depends on other elements in the original array.

The core pattern to recognize is when you need to create a new array where each element's value depends on one or more values from the original array, often through some form of index calculation or mapping.

## Key Takeaways

1. **Understand the transformation clearly**: Before writing code, work through a small example manually to ensure you understand exactly what `ans[i] = nums[nums[i]]` means. This helps avoid off-by-one errors and indexing mistakes.

2. **When in doubt, use extra space**: For array transformation problems, it's often safest to create a new array rather than modifying the input in-place. This prevents overwriting values you still need for subsequent calculations.

3. **Recognize simple linear solutions**: Not every array problem requires complex algorithms. Many interview problems test your ability to implement clean, efficient O(n) solutions with clear logic and proper edge case handling.

[Practice this problem on CodeJeet](/problem/build-array-from-permutation)
