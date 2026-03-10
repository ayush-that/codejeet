---
title: "How to Solve Squares of a Sorted Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Squares of a Sorted Array. Easy difficulty, 73.6% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2026-04-19"
category: "dsa-patterns"
tags: ["squares-of-a-sorted-array", "array", "two-pointers", "sorting", "easy"]
---

# How to Solve Squares of a Sorted Array

You're given a sorted array of integers (which can include negative numbers), and you need to return a new array containing the squares of all numbers, also sorted in non-decreasing order. The tricky part is that negative numbers, when squared, can become larger than squares of positive numbers, so simply squaring and sorting isn't immediately obvious as the optimal approach.

## Visual Walkthrough

Let's trace through an example: `nums = [-4, -2, 0, 3, 5]`

1. **The challenge**: After squaring, we get `[16, 4, 0, 9, 25]`, which isn't sorted. The largest squares come from the extremes: `-4² = 16` and `5² = 25` are the two largest values.

2. **Two-pointer intuition**: Since the input is sorted, we know:
   - The smallest square could come from the middle (near zero)
   - The largest square will come from either end (most negative or most positive)
3. **Step-by-step process**:
   - Initialize `left = 0` (pointing to -4) and `right = 4` (pointing to 5)
   - Compare squares: `(-4)² = 16` vs `5² = 25`
   - `25` is larger, so place it at the **end** of our result array: `result = [_, _, _, _, 25]`
   - Move `right` left: `right = 3` (now pointing to 3)
   - Compare: `(-4)² = 16` vs `3² = 9`
   - `16` is larger, so place it next: `result = [_, _, _, 16, 25]`
   - Move `left` right: `left = 1` (now pointing to -2)
   - Compare: `(-2)² = 4` vs `3² = 9`
   - `9` is larger: `result = [_, _, 9, 16, 25]`
   - Move `right` left: `right = 2` (now pointing to 0)
   - Compare: `(-2)² = 4` vs `0² = 0`
   - `4` is larger: `result = [_, 4, 9, 16, 25]`
   - Move `left` right: `left = 2` (now pointing to 0)
   - Compare: `0² = 0` vs `0² = 0`
   - Place `0`: `result = [0, 4, 9, 16, 25]`
   - Done!

This approach builds the result from largest to smallest, filling from the end backward.

## Brute Force Approach

The most straightforward solution is to square each element and then sort the result:

1. Create a new array of the same length
2. Square each element and store it in the new array
3. Sort the new array

**Why this isn't optimal**: The input is already sorted, but we're ignoring this valuable information. Sorting takes O(n log n) time, but we can do better by leveraging the sorted property. The brute force works but misses an opportunity for optimization that interviewers expect.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) or O(log n) depending on sorting implementation
def sortedSquares(nums):
    # Step 1: Square each element
    squared = [num * num for num in nums]

    # Step 2: Sort the squared values
    squared.sort()

    return squared
```

```javascript
// Time: O(n log n) | Space: O(n) or O(log n) depending on sorting implementation
function sortedSquares(nums) {
  // Step 1: Square each element
  const squared = nums.map((num) => num * num);

  // Step 2: Sort the squared values
  squared.sort((a, b) => a - b);

  return squared;
}
```

```java
// Time: O(n log n) | Space: O(n) or O(log n) depending on sorting implementation
public int[] sortedSquares(int[] nums) {
    // Step 1: Create result array
    int[] result = new int[nums.length];

    // Step 2: Square each element
    for (int i = 0; i < nums.length; i++) {
        result[i] = nums[i] * nums[i];
    }

    // Step 3: Sort the squared values
    Arrays.sort(result);

    return result;
}
```

</div>

## Optimal Solution

The optimal approach uses two pointers starting at both ends of the array. Since the array is sorted, the largest square must come from one of the ends (most negative or most positive). We compare the squares at both ends, take the larger one, and place it at the end of our result array, working backward.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def sortedSquares(nums):
    n = len(nums)
    result = [0] * n  # Pre-allocate array for result
    left, right = 0, n - 1  # Two pointers starting at ends
    position = n - 1  # Start filling from the end of result

    # Process from both ends towards the middle
    while left <= right:
        left_square = nums[left] * nums[left]
        right_square = nums[right] * nums[right]

        # Compare squares at both ends
        if left_square > right_square:
            # Left square is larger, place it at current position
            result[position] = left_square
            left += 1  # Move left pointer inward
        else:
            # Right square is larger or equal, place it
            result[position] = right_square
            right -= 1  # Move right pointer inward

        position -= 1  # Move to next position in result

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function sortedSquares(nums) {
  const n = nums.length;
  const result = new Array(n); // Pre-allocate array for result
  let left = 0,
    right = n - 1; // Two pointers starting at ends
  let position = n - 1; // Start filling from the end of result

  // Process from both ends towards the middle
  while (left <= right) {
    const leftSquare = nums[left] * nums[left];
    const rightSquare = nums[right] * nums[right];

    // Compare squares at both ends
    if (leftSquare > rightSquare) {
      // Left square is larger, place it at current position
      result[position] = leftSquare;
      left++; // Move left pointer inward
    } else {
      // Right square is larger or equal, place it
      result[position] = rightSquare;
      right--; // Move right pointer inward
    }

    position--; // Move to next position in result
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
public int[] sortedSquares(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];  // Pre-allocate array for result
    int left = 0, right = n - 1;  // Two pointers starting at ends
    int position = n - 1;  // Start filling from the end of result

    // Process from both ends towards the middle
    while (left <= right) {
        int leftSquare = nums[left] * nums[left];
        int rightSquare = nums[right] * nums[right];

        // Compare squares at both ends
        if (leftSquare > rightSquare) {
            // Left square is larger, place it at current position
            result[position] = leftSquare;
            left++;  // Move left pointer inward
        } else {
            // Right square is larger or equal, place it
            result[position] = rightSquare;
            right--;  // Move right pointer inward
        }

        position--;  // Move to next position in result
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element exactly once as we move the pointers from both ends toward the center
- Each iteration does constant work: two multiplications, one comparison, and two assignments

**Space Complexity: O(n)**

- We need to store the result array, which has the same length as the input
- The algorithm uses only a few extra variables (`left`, `right`, `position`), so auxiliary space is O(1)
- If we don't count the output array (as is common in interview analysis), the space complexity would be O(1)

## Common Mistakes

1. **Forgetting that squares can overflow**: When dealing with large integers (especially in languages like Java), squaring can cause integer overflow. While not an issue in Python (which has arbitrary precision integers) or JavaScript (which uses floating point), in Java you might need to use `long` for intermediate calculations if the problem constraints allow very large numbers.

2. **Incorrect pointer movement**: Some candidates move the wrong pointer after comparing squares. Remember: whichever square you use (left or right), you move THAT pointer inward. If you take the left square, move left++; if you take the right square, move right--.

3. **Off-by-one errors in the loop condition**: The loop should continue while `left <= right`, not `left < right`. When `left == right`, there's still one element to process. Using `left < right` would miss the middle element.

4. **Starting to fill from the beginning instead of the end**: Since we're finding the largest squares first, we need to fill the result array from the end backward. Starting from the beginning would require finding the smallest squares first, which is harder because the smallest square could come from anywhere (not necessarily from the ends).

## When You'll See This Pattern

The two-pointer technique from both ends is useful whenever you have sorted data and need to find pairs, merge sorted sequences, or process elements in order based on some transformation. This pattern appears in:

1. **Merge Sorted Array (Easy)**: Merging two sorted arrays by comparing elements from the end and placing the larger one at the end of the result array.

2. **Two Sum II - Input Array Is Sorted (Medium)**: Finding two numbers that sum to a target by starting pointers at both ends and moving them inward based on the current sum.

3. **Sort Transformed Array (Medium)**: A more complex version where you apply a quadratic transformation to a sorted array and need to sort the result.

4. **Container With Most Water (Medium)**: Uses two pointers to find the maximum area, moving the pointer pointing to the shorter line inward.

## Key Takeaways

1. **Leverage sorted order**: When input is sorted, always ask: "What does this tell me about where the largest/smallest elements are?" In this case, the largest squares come from the ends.

2. **Two-pointer from ends**: When processing sorted data where extreme values matter most, consider starting pointers at both ends and working toward the middle. This often yields O(n) solutions instead of O(n log n).

3. **Fill backward for descending order**: When you need ascending order but can most easily find elements in descending order, fill your result array from the end backward. This avoids the need to reverse the array later.

Related problems: [Merge Sorted Array](/problem/merge-sorted-array), [Sort Transformed Array](/problem/sort-transformed-array)
