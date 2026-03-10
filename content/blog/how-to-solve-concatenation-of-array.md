---
title: "How to Solve Concatenation of Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Concatenation of Array. Easy difficulty, 90.5% acceptance rate. Topics: Array, Simulation."
date: "2026-08-02"
category: "dsa-patterns"
tags: ["concatenation-of-array", "array", "simulation", "easy"]
---

# How to Solve Concatenation of Array

At first glance, this problem seems almost too simple—just copy an array twice. But it's actually a great warm-up problem that tests your understanding of array indexing and basic simulation. The tricky part isn't the algorithm itself, but getting the indexing exactly right without off-by-one errors, especially when working with multiple languages that have different array conventions.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 3]` step by step:

We need to create `ans` of length `2n = 6` where:

- `ans[0] = nums[0] = 1`
- `ans[1] = nums[1] = 2`
- `ans[2] = nums[2] = 3`
- `ans[3] = nums[0] = 1` (because `i + n = 0 + 3 = 3`)
- `ans[4] = nums[1] = 2` (because `i + n = 1 + 3 = 4`)
- `ans[5] = nums[2] = 3` (because `i + n = 2 + 3 = 5`)

So our final `ans = [1, 2, 3, 1, 2, 3]`.

The pattern is clear: we're placing each element of `nums` twice—once in the first half of `ans`, and once in the second half, exactly `n` positions apart.

## Brute Force Approach

For this particular problem, there's really only one reasonable approach, but let's think about what a less experienced candidate might try:

1. **Create an empty array and append elements twice**: This is actually a valid approach, but it's conceptually the same as the optimal solution.
2. **Use array concatenation directly**: Many languages have built-in concatenation (like `+` in Python or `concat()` in JavaScript), which internally does the same work.

The "brute force" thinking here would be to manually copy elements without recognizing the pattern that `ans[i] = nums[i]` and `ans[i + n] = nums[i]`. Someone might try to create two separate copies and then combine them, which uses extra space unnecessarily.

Actually, the most common "mistake" here isn't algorithmic inefficiency but implementation errors with indexing.

## Optimal Solution

The optimal solution directly implements the problem statement: create an array of length `2n`, then for each index `i` from `0` to `n-1`, copy `nums[i]` to both `ans[i]` and `ans[i + n]`.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def getConcatenation(nums):
    """
    Returns a new array that is the concatenation of nums with itself.

    Args:
    nums: List[int] - The input array

    Returns:
    List[int] - The concatenated array
    """
    n = len(nums)  # Get the length of the input array
    ans = [0] * (2 * n)  # Initialize result array with zeros, length 2n

    # Iterate through each index in the original array
    for i in range(n):
        # Copy nums[i] to the first half of ans (position i)
        ans[i] = nums[i]
        # Copy nums[i] to the second half of ans (position i + n)
        ans[i + n] = nums[i]

    return ans
```

```javascript
// Time: O(n) | Space: O(n)
function getConcatenation(nums) {
  /**
   * Returns a new array that is the concatenation of nums with itself.
   *
   * @param {number[]} nums - The input array
   * @return {number[]} - The concatenated array
   */
  const n = nums.length; // Get the length of the input array
  const ans = new Array(2 * n); // Initialize result array, length 2n

  // Iterate through each index in the original array
  for (let i = 0; i < n; i++) {
    // Copy nums[i] to the first half of ans (position i)
    ans[i] = nums[i];
    // Copy nums[i] to the second half of ans (position i + n)
    ans[i + n] = nums[i];
  }

  return ans;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] getConcatenation(int[] nums) {
        /**
         * Returns a new array that is the concatenation of nums with itself.
         *
         * @param nums - The input array
         * @return - The concatenated array
         */
        int n = nums.length;  // Get the length of the input array
        int[] ans = new int[2 * n];  // Initialize result array, length 2n

        // Iterate through each index in the original array
        for (int i = 0; i < n; i++) {
            // Copy nums[i] to the first half of ans (position i)
            ans[i] = nums[i];
            // Copy nums[i] to the second half of ans (position i + n)
            ans[i + n] = nums[i];
        }

        return ans;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations (array accesses and assignments) for each of the `n` elements.
- The loop runs `n` times, and each iteration does 2 assignments, so total operations = `2n`, which simplifies to O(n).

**Space Complexity: O(n)**

- We create a new array `ans` of size `2n` to store the result.
- The input array `nums` is not modified, so we don't count it toward auxiliary space.
- Therefore, we use O(n) additional space where n is the length of the input array.

## Common Mistakes

1. **Off-by-one errors in the loop condition**: Using `i <= n` instead of `i < n` will cause an index out of bounds error when accessing `nums[i]` on the last iteration. Remember: arrays are 0-indexed, so valid indices are `0` to `n-1`.

2. **Incorrect array initialization**: Forgetting to multiply by 2 when creating the result array (`ans = [0] * n` instead of `ans = [0] * (2 * n)`) will cause index errors when trying to access `ans[i + n]` for larger `i` values.

3. **Modifying the input array**: The problem asks to return a _new_ array. While not explicitly forbidden, modifying the input array is generally bad practice unless specified. Always create a new array for the result.

4. **Using the wrong index for the second copy**: Writing `ans[n + i]` instead of `ans[i + n]` is mathematically the same, but `ans[i + n]` more clearly shows the relationship described in the problem statement (`ans[i + n] == nums[i]`).

## When You'll See This Pattern

This problem teaches **array manipulation with offset indexing**, a pattern that appears in many other problems:

1. **Rotate Array (LeetCode 189)**: Similar to concatenation but with wrapping around. If you concatenate the array with itself, a rotation by k positions becomes a subarray starting at position k in the concatenated array.

2. **Shuffle the Array (LeetCode 1470)**: Requires placing elements from two halves of an array into alternating positions in the result, which involves similar index calculations.

3. **Build Array from Permutation (LeetCode 1920)**: Involves creating a new array where each element comes from another position in the input array, requiring careful index tracking.

The core pattern is: when you need to create a new array where elements come from specific positions in the original array, use a result array and fill it using calculated indices.

## Key Takeaways

- **Pattern recognition**: This problem demonstrates the basic pattern of creating a new array by mapping elements from an input array using calculated indices. Recognizing this pattern helps with more complex array transformation problems.

- **Index arithmetic mastery**: Getting comfortable with expressions like `ans[i + n]` is fundamental to array manipulation problems. Practice until you can visualize these relationships without confusion.

- **Space-time tradeoff clarity**: This solution uses O(n) extra space to achieve O(n) time. Sometimes interviewers will ask for an in-place solution, but here the problem explicitly asks for a new array.

[Practice this problem on CodeJeet](/problem/concatenation-of-array)
