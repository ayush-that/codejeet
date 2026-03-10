---
title: "How to Solve Rotate Non Negative Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotate Non Negative Elements. Medium difficulty, 47.8% acceptance rate. Topics: Array, Simulation."
date: "2028-11-06"
category: "dsa-patterns"
tags: ["rotate-non-negative-elements", "array", "simulation", "medium"]
---

# Rotating Non-Negative Elements: A Step-by-Step Guide

This problem asks us to rotate only the non-negative elements of an array to the left by `k` positions while keeping all negative elements fixed in their original positions. What makes this tricky is that we can't simply apply a standard rotation algorithm—the negative elements act as obstacles that break the continuity of the rotation, forcing us to handle the non-negative elements in a segmented way.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, -2, 3, 4, -5, 6]` with `k = 2`.

**Step 1: Identify non-negative elements**
We first extract all non-negative elements while noting their original positions:

- Non-negative values: `[1, 3, 4, 6]`
- Their indices in original array: `[0, 2, 3, 5]`

**Step 2: Apply rotation to non-negative elements only**
Rotating `[1, 3, 4, 6]` left by 2 positions gives us:

- Original: `[1, 3, 4, 6]`
- After left rotation by 2: `[4, 6, 1, 3]`

**Step 3: Place rotated elements back at original non-negative positions**
We place the rotated elements back into the original array at the same indices where non-negative elements were found:

- Index 0 (originally had 1) gets 4
- Index 2 (originally had 3) gets 6
- Index 3 (originally had 4) gets 1
- Index 5 (originally had 6) gets 3

**Final result:** `[4, -2, 6, 1, -5, 3]`

Notice how the negative elements `-2` and `-5` remain exactly where they were, while the non-negative elements have been rotated among themselves.

## Brute Force Approach

A naive approach might try to simulate the rotation by repeatedly shifting elements, but this becomes complicated because negative elements block the rotation path. Another brute force approach would be:

1. Create a new array of the same size
2. Copy all negative elements to their original positions
3. For each non-negative element, calculate its new position by finding the next available non-negative position after rotating
4. Place it there

The challenge with this approach is calculating the "next available non-negative position" correctly. We'd need to:

- Skip over negative positions when counting rotation steps
- Handle wrap-around when we reach the end of the non-negative elements
- Track which positions we've already filled

This leads to complex index calculations and potential O(n²) time complexity in the worst case as we might need to scan for available positions repeatedly.

## Optimized Approach

The key insight is that we can separate the problem into two phases:

1. **Extract and rotate**: Collect all non-negative elements into a separate list, rotate that list, then place them back. This works because the rotation only affects non-negative elements relative to each other—their relative order after rotation doesn't depend on where the negative elements are positioned.

2. **Modulo arithmetic for rotation**: When we rotate the extracted non-negative elements left by `k` positions, we need to handle the case where `k` might be larger than the number of non-negative elements. Using modulo arithmetic (`k % len(non_negatives)`) ensures we only perform the minimal necessary rotation.

The critical realization is that the negative elements serve as fixed anchors—they don't participate in the rotation but they do affect where rotated elements get placed back. By extracting non-negative elements, rotating them independently, and then placing them back at the original non-negative positions, we bypass the complexity of working around the negative elements during the rotation itself.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def rotate_non_negative(nums, k):
    """
    Rotates only non-negative elements to the left by k positions.
    Negative elements remain in their original positions.

    Args:
        nums: List of integers
        k: Number of positions to rotate left

    Returns:
        List with rotated non-negative elements
    """
    # Step 1: Extract non-negative elements and their indices
    non_neg_values = []
    non_neg_indices = []

    for i, num in enumerate(nums):
        if num >= 0:
            non_neg_values.append(num)
            non_neg_indices.append(i)

    # If there are no non-negative elements or only one, nothing to rotate
    if len(non_neg_values) <= 1:
        return nums

    # Step 2: Calculate effective rotation amount using modulo
    # This handles cases where k > len(non_neg_values)
    effective_k = k % len(non_neg_values)

    # Step 3: Rotate the non-negative values list
    # Left rotation by k: elements from index k to end come first,
    # followed by elements from start to k-1
    rotated_values = (non_neg_values[effective_k:] +
                      non_neg_values[:effective_k])

    # Step 4: Place rotated values back at original non-negative indices
    # We create a copy to avoid modifying the input list directly
    result = nums.copy()

    for i, value in zip(non_neg_indices, rotated_values):
        result[i] = value

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function rotateNonNegative(nums, k) {
  /**
   * Rotates only non-negative elements to the left by k positions.
   * Negative elements remain in their original positions.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Number of positions to rotate left
   * @return {number[]} Array with rotated non-negative elements
   */

  // Step 1: Extract non-negative elements and their indices
  const nonNegValues = [];
  const nonNegIndices = [];

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= 0) {
      nonNegValues.push(nums[i]);
      nonNegIndices.push(i);
    }
  }

  // If there are no non-negative elements or only one, nothing to rotate
  if (nonNegValues.length <= 1) {
    return [...nums]; // Return a copy
  }

  // Step 2: Calculate effective rotation amount using modulo
  // This handles cases where k > nonNegValues.length
  const effectiveK = k % nonNegValues.length;

  // Step 3: Rotate the non-negative values array
  // Left rotation by k: elements from index k to end come first,
  // followed by elements from start to k-1
  const rotatedValues = [...nonNegValues.slice(effectiveK), ...nonNegValues.slice(0, effectiveK)];

  // Step 4: Place rotated values back at original non-negative indices
  // We create a copy to avoid modifying the input array directly
  const result = [...nums];

  for (let i = 0; i < nonNegIndices.length; i++) {
    const originalIndex = nonNegIndices[i];
    const rotatedValue = rotatedValues[i];
    result[originalIndex] = rotatedValue;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public int[] rotateNonNegative(int[] nums, int k) {
        /**
         * Rotates only non-negative elements to the left by k positions.
         * Negative elements remain in their original positions.
         *
         * @param nums Array of integers
         * @param k Number of positions to rotate left
         * @return Array with rotated non-negative elements
         */

        // Step 1: Extract non-negative elements and their indices
        List<Integer> nonNegValues = new ArrayList<>();
        List<Integer> nonNegIndices = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] >= 0) {
                nonNegValues.add(nums[i]);
                nonNegIndices.add(i);
            }
        }

        // If there are no non-negative elements or only one, nothing to rotate
        if (nonNegValues.size() <= 1) {
            return nums.clone(); // Return a copy
        }

        // Step 2: Calculate effective rotation amount using modulo
        // This handles cases where k > nonNegValues.size()
        int effectiveK = k % nonNegValues.size();

        // Step 3: Rotate the non-negative values list
        // Left rotation by k: elements from index k to end come first,
        // followed by elements from start to k-1
        List<Integer> rotatedValues = new ArrayList<>();

        // Add elements from effectiveK to end
        for (int i = effectiveK; i < nonNegValues.size(); i++) {
            rotatedValues.add(nonNegValues.get(i));
        }

        // Add elements from start to effectiveK-1
        for (int i = 0; i < effectiveK; i++) {
            rotatedValues.add(nonNegValues.get(i));
        }

        // Step 4: Place rotated values back at original non-negative indices
        // We create a copy to avoid modifying the input array directly
        int[] result = nums.clone();

        for (int i = 0; i < nonNegIndices.size(); i++) {
            int originalIndex = nonNegIndices.get(i);
            int rotatedValue = rotatedValues.get(i);
            result[originalIndex] = rotatedValue;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Extracting non-negative elements and their indices: O(n)
- Calculating effective rotation: O(1)
- Rotating the non-negative values: O(m) where m is the number of non-negative elements
- Placing rotated values back: O(m)
- Overall: O(n) since m ≤ n

**Space Complexity: O(n)**

- We store non-negative values: O(m)
- We store non-negative indices: O(m)
- We create a result array: O(n)
- Overall: O(n) auxiliary space

The space complexity could be optimized to O(1) by rotating in-place, but this would require complex index calculations to work around the negative elements, making the code harder to understand and maintain.

## Common Mistakes

1. **Forgetting to handle k > number of non-negative elements**: Without using modulo (`k % len(non_negatives)`), when k exceeds the number of non-negative elements, you'll get index errors or incorrect rotations. Always use modulo to normalize the rotation amount.

2. **Modifying the input array directly**: Interviewers often expect you not to modify the input unless specified. Always create a copy if you need to return a modified version. This also prevents bugs if the input array is used elsewhere.

3. **Incorrect left rotation logic**: A common error is using right rotation logic instead of left rotation. Remember: left rotation by k means elements from index k to end come first, then elements from start to k-1.

4. **Not handling edge cases**:
   - Empty array or array with no non-negative elements
   - Array with only one non-negative element (nothing to rotate)
   - k = 0 (should return original array)
   - All elements are non-negative (should behave like standard rotation)

## When You'll See This Pattern

This problem combines two common patterns:

1. **Segmented processing**: Similar to problems where you need to process only certain elements while preserving others, like:
   - **Move Zeroes (LeetCode 283)**: Move all zeros to the end while maintaining relative order of non-zero elements
   - **Sort Array By Parity (LeetCode 905)**: Sort array so all even elements come before odd elements

2. **Array rotation with constraints**: The rotation aspect appears in problems like:
   - **Rotate Array (LeetCode 189)**: Standard array rotation (but this rotates all elements)
   - **Rotate String (LeetCode 796)**: Check if one string is a rotation of another

The key difference here is that the rotation is applied to a subset of elements extracted from their original positions, then placed back. This "extract-transform-replace" pattern is useful when you need to apply an operation to filtered elements while preserving the positions of others.

## Key Takeaways

1. **When dealing with segmented operations**, consider extracting the target elements, processing them independently, then placing them back. This often simplifies complex in-place operations.

2. **Always normalize rotation amounts** using modulo arithmetic when k can be larger than the number of elements being rotated. This prevents index errors and unnecessary full cycles.

3. **Preserve original indices** when extracting elements for processing. You'll need these indices to correctly place the processed elements back into their proper positions in the original structure.

[Practice this problem on CodeJeet](/problem/rotate-non-negative-elements)
