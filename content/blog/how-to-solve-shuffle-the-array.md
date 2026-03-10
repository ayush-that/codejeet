---
title: "How to Solve Shuffle the Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Shuffle the Array. Easy difficulty, 89.0% acceptance rate. Topics: Array."
date: "2026-10-14"
category: "dsa-patterns"
tags: ["shuffle-the-array", "array", "easy"]
---

# How to Solve Shuffle the Array

This problem asks us to rearrange an array of `2n` elements from the format `[x1,x2,...,xn,y1,y2,...,yn]` to `[x1,y1,x2,y2,...,xn,yn]`. While conceptually simple, this problem is interesting because it tests your ability to work with array indices systematically and handle interleaving patterns efficiently. The main challenge is avoiding off-by-one errors while maintaining clean, readable code.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have `nums = [2,5,1,3,4,7]` and `n = 3`. This means:

- First half (x values): `[2,5,1]` → `x1=2, x2=5, x3=1`
- Second half (y values): `[3,4,7]` → `y1=3, y2=4, y3=7`

We need to produce: `[x1,y1,x2,y2,x3,y3] = [2,3,5,4,1,7]`

Here's how we can think about the transformation:

**Step 1:** The result array will have the same length as the input (6 elements).

**Step 2:** For each position `i` from 0 to `n-1` (where `n=3`):

- `x_i` is at index `i` in the original array
- `y_i` is at index `i + n` in the original array

**Step 3:** In the result array:

- Element at even index `2*i` gets `x_i` (from index `i`)
- Element at odd index `2*i + 1` gets `y_i` (from index `i + n`)

Let's verify:

- When `i=0`: result[0] = nums[0] = 2, result[1] = nums[0+3] = nums[3] = 3
- When `i=1`: result[2] = nums[1] = 5, result[3] = nums[1+3] = nums[4] = 4
- When `i=2`: result[4] = nums[2] = 1, result[5] = nums[2+3] = nums[5] = 7

This gives us `[2,3,5,4,1,7]` as expected.

## Brute Force Approach

A naive approach might try to create two separate arrays for the x and y values, then merge them:

1. Create `x_array = nums[0:n]` (first n elements)
2. Create `y_array = nums[n:2n]` (last n elements)
3. Create an empty result array
4. For i from 0 to n-1:
   - Append `x_array[i]` to result
   - Append `y_array[i]` to result

While this approach works and is easy to understand, it uses O(n) extra space for the two temporary arrays. The problem can be solved with O(1) extra space (or O(n) for the result array, which we can't avoid since we need to return it). The brute force approach is acceptable for an interview but shows you're not thinking about space optimization.

## Optimal Solution

The optimal solution follows directly from our visual walkthrough. We create a result array and fill it by iterating through the first half of the input array, placing each x value at even indices and the corresponding y value at odd indices.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def shuffle(nums, n):
    """
    Rearranges the array from [x1,x2,...,xn,y1,y2,...,yn] to [x1,y1,x2,y2,...,xn,yn]

    Args:
        nums: List of integers with length 2n
        n: Integer representing half the length of nums

    Returns:
        List of integers in shuffled order
    """
    # Initialize result array with the same length as input
    result = [0] * (2 * n)

    # Iterate through the first half of the array (x values)
    for i in range(n):
        # Place x_i at even index (2*i) in result
        result[2 * i] = nums[i]

        # Place y_i at odd index (2*i + 1) in result
        # y_i is located at index i + n in the original array
        result[2 * i + 1] = nums[i + n]

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function shuffle(nums, n) {
  /**
   * Rearranges the array from [x1,x2,...,xn,y1,y2,...,yn] to [x1,y1,x2,y2,...,xn,yn]
   *
   * @param {number[]} nums - Array of integers with length 2n
   * @param {number} n - Integer representing half the length of nums
   * @return {number[]} Array in shuffled order
   */
  // Initialize result array with the same length as input
  const result = new Array(2 * n);

  // Iterate through the first half of the array (x values)
  for (let i = 0; i < n; i++) {
    // Place x_i at even index (2*i) in result
    result[2 * i] = nums[i];

    // Place y_i at odd index (2*i + 1) in result
    // y_i is located at index i + n in the original array
    result[2 * i + 1] = nums[i + n];
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
class Solution {
    public int[] shuffle(int[] nums, int n) {
        /**
         * Rearranges the array from [x1,x2,...,xn,y1,y2,...,yn] to [x1,y1,x2,y2,...,xn,yn]
         *
         * @param nums Array of integers with length 2n
         * @param n Integer representing half the length of nums
         * @return Array in shuffled order
         */
        // Initialize result array with the same length as input
        int[] result = new int[2 * n];

        // Iterate through the first half of the array (x values)
        for (int i = 0; i < n; i++) {
            // Place x_i at even index (2*i) in result
            result[2 * i] = nums[i];

            // Place y_i at odd index (2*i + 1) in result
            // y_i is located at index i + n in the original array
            result[2 * i + 1] = nums[i + n];
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the first half of the array exactly once (n iterations)
- Each iteration does constant work: two array accesses and two assignments
- Total operations: 4n, which simplifies to O(n)

**Space Complexity:** O(n)

- We create a new result array of size 2n
- The input array is not modified
- No other significant data structures are used
- Note: Some might argue this is O(1) extra space if we don't count the output array, but technically we need to allocate space for the result

## Common Mistakes

1. **Off-by-one errors in index calculations**: The most common mistake is getting the indices wrong when accessing elements. Remember:
   - `x_i` is at index `i` (0-based indexing)
   - `y_i` is at index `i + n` (not `i + n - 1`)
   - In the result, `x_i` goes to index `2*i` and `y_i` to `2*i + 1`

2. **Modifying the input array in-place**: While an in-place solution exists (using bit manipulation to store two numbers in one position), it's more complex and error-prone. For interviews, stick with the clear O(n) space solution unless specifically asked for in-place.

3. **Incorrect loop bounds**: Iterating through the entire array (`2*n` times) instead of just the first half (`n` times) will cause index out of bounds errors when trying to access `nums[i + n]` for `i >= n`.

4. **Forgetting to initialize the result array**: In languages like Java and JavaScript, you need to explicitly create the result array with the correct size before assigning values to specific indices.

## When You'll See This Pattern

This interleaving pattern appears in several other array manipulation problems:

1. **Merge Sorted Array (LeetCode 88)**: While merging two sorted arrays, you're essentially interleaving elements based on comparison rather than fixed positions.

2. **Rotate Array (LeetCode 189)**: Rotating an array involves repositioning elements based on their indices, similar to how we reposition elements here.

3. **Rearrange Array Elements by Sign (LeetCode 2149)**: This problem asks you to rearrange an array so that positive and negative numbers alternate, which is another form of interleaving based on element properties rather than fixed positions.

The core technique of calculating new positions based on mathematical formulas (like `2*i` and `2*i + 1`) is useful whenever you need to rearrange elements according to a predictable pattern.

## Key Takeaways

1. **Pattern recognition**: When you see a problem involving rearranging elements according to a formulaic pattern, write out the index mappings explicitly. For this problem: `result[2*i] = nums[i]` and `result[2*i+1] = nums[i+n]`.

2. **Systematic approach**: Always test your index calculations with small examples before coding. The visual walkthrough we did with `[2,5,1,3,4,7]` is exactly what you should do on paper during an interview.

3. **Space-time tradeoff clarity**: While an O(1) extra space in-place solution exists (using bit manipulation), the O(n) space solution is perfectly acceptable for most interviews due to its clarity and simplicity. Always prioritize readable, correct code over premature optimization.

[Practice this problem on CodeJeet](/problem/shuffle-the-array)
