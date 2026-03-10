---
title: "How to Solve Flipping an Image — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Flipping an Image. Easy difficulty, 83.6% acceptance rate. Topics: Array, Two Pointers, Bit Manipulation, Matrix, Simulation."
date: "2027-04-09"
category: "dsa-patterns"
tags: ["flipping-an-image", "array", "two-pointers", "bit-manipulation", "easy"]
---

# How to Solve Flipping an Image

This problem asks us to transform a binary matrix (containing only 0s and 1s) by first reversing each row horizontally, then inverting all the values (changing 0s to 1s and 1s to 0s). While the operations are straightforward individually, the challenge lies in performing them efficiently and correctly handling the transformation in a single pass. What makes this problem interesting is that we can optimize the two operations together rather than treating them as separate steps.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this 3×3 binary matrix:

```
Input: [[1,1,0],
        [1,0,1],
        [0,0,0]]
```

**Step 1: Flip each row horizontally (reverse them)**

- Row 1: `[1,1,0]` → `[0,1,1]`
- Row 2: `[1,0,1]` → `[1,0,1]` (already symmetric)
- Row 3: `[0,0,0]` → `[0,0,0]` (unchanged)

After flipping: `[[0,1,1], [1,0,1], [0,0,0]]`

**Step 2: Invert each value (0→1, 1→0)**

- Row 1: `[0,1,1]` → `[1,0,0]`
- Row 2: `[1,0,1]` → `[0,1,0]`
- Row 3: `[0,0,0]` → `[1,1,1]`

Final result: `[[1,0,0], [0,1,0], [1,1,1]]`

Notice something interesting: when we flip and then invert, the value at position `i` in the original row becomes the inverted value at position `n-1-i` in the result. This observation allows us to perform both operations in a single pass using two pointers.

## Brute Force Approach

The most straightforward approach is to perform the two operations separately:

1. Create a new result matrix
2. For each row, create a reversed copy
3. For each element in the reversed row, invert the value (0→1, 1→0)

While this approach works and is easy to understand, it's not optimal in terms of space usage because we create intermediate reversed rows before inverting them. However, since the problem is easy and the constraints are typically small, even this approach would be acceptable. The real issue with a naive implementation would be doing unnecessary work - we can combine the flipping and inverting into a single operation.

## Optimal Solution

We can solve this problem in a single pass through the matrix using two pointers for each row. The key insight is that when we flip and invert, the value at position `left` in the original row becomes `1 - image[row][left]` at position `right` in the result, and vice versa. We process each row independently:

1. For each row in the matrix:
   - Initialize `left = 0` and `right = n-1`
   - While `left <= right`:
     - If `left == right` (middle element in odd-length row), just invert it
     - Otherwise, swap the inverted values of `image[row][left]` and `image[row][right]`
     - Move pointers inward: `left++`, `right--`

This approach modifies the matrix in-place with O(1) extra space.

<div class="code-group">

```python
# Time: O(n²) where n is the matrix dimension | Space: O(1) - in-place modification
def flipAndInvertImage(image):
    """
    Flip the image horizontally, then invert it.

    Args:
        image: List[List[int]] - binary matrix of 0s and 1s

    Returns:
        List[List[int]] - transformed matrix
    """
    n = len(image)

    # Process each row independently
    for row in range(n):
        left, right = 0, n - 1

        # Use two pointers to traverse from both ends towards the center
        while left <= right:
            # When left and right meet at the center (odd-length rows)
            if left == right:
                # Just invert the middle element: 0 -> 1, 1 -> 0
                image[row][left] = 1 - image[row][left]
            else:
                # Swap the inverted values
                # Store inverted left value temporarily
                temp = 1 - image[row][left]
                # Put inverted right value at left position
                image[row][left] = 1 - image[row][right]
                # Put original inverted left value at right position
                image[row][right] = temp

            # Move pointers towards the center
            left += 1
            right -= 1

    return image
```

```javascript
// Time: O(n²) where n is the matrix dimension | Space: O(1) - in-place modification
function flipAndInvertImage(image) {
  /**
   * Flip the image horizontally, then invert it.
   *
   * @param {number[][]} image - binary matrix of 0s and 1s
   * @return {number[][]} - transformed matrix
   */
  const n = image.length;

  // Process each row independently
  for (let row = 0; row < n; row++) {
    let left = 0,
      right = n - 1;

    // Use two pointers to traverse from both ends towards the center
    while (left <= right) {
      // When left and right meet at the center (odd-length rows)
      if (left === right) {
        // Just invert the middle element: 0 -> 1, 1 -> 0
        image[row][left] = 1 - image[row][left];
      } else {
        // Swap the inverted values
        // Store inverted left value temporarily
        const temp = 1 - image[row][left];
        // Put inverted right value at left position
        image[row][left] = 1 - image[row][right];
        // Put original inverted left value at right position
        image[row][right] = temp;
      }

      // Move pointers towards the center
      left++;
      right--;
    }
  }

  return image;
}
```

```java
// Time: O(n²) where n is the matrix dimension | Space: O(1) - in-place modification
public int[][] flipAndInvertImage(int[][] image) {
    /**
     * Flip the image horizontally, then invert it.
     *
     * @param image - binary matrix of 0s and 1s
     * @return transformed matrix
     */
    int n = image.length;

    // Process each row independently
    for (int row = 0; row < n; row++) {
        int left = 0, right = n - 1;

        // Use two pointers to traverse from both ends towards the center
        while (left <= right) {
            // When left and right meet at the center (odd-length rows)
            if (left == right) {
                // Just invert the middle element: 0 -> 1, 1 -> 0
                image[row][left] = 1 - image[row][left];
            } else {
                // Swap the inverted values
                // Store inverted left value temporarily
                int temp = 1 - image[row][left];
                // Put inverted right value at left position
                image[row][left] = 1 - image[row][right];
                // Put original inverted left value at right position
                image[row][right] = temp;
            }

            // Move pointers towards the center
            left++;
            right--;
        }
    }

    return image;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the dimension of the matrix. We need to process each of the n² elements exactly once. For each row of length n, we perform n/2 operations (since we process two elements at a time), and we have n rows, giving us n × (n/2) = O(n²) operations.

**Space Complexity:** O(1) for the two-pointer in-place approach. We only use a constant amount of extra space for the pointers and temporary variables. If we had created a new matrix instead of modifying in-place, the space complexity would be O(n²).

## Common Mistakes

1. **Forgetting to handle the middle element in odd-length rows:** When `left == right`, we're at the center element of an odd-length row. Some candidates continue swapping, which would either cause an error or double-invert the value. Always check for this case and simply invert the value without swapping.

2. **Incorrect inversion logic:** Using `!value` or `~value` instead of `1 - value`. In Python/JavaScript/Java, `!` and `~` are logical/bitwise NOT operators that don't give the correct result for this problem. We need `1 - value` to convert 0→1 and 1→0.

3. **Processing columns instead of rows:** The problem asks to flip horizontally (reverse each row), not vertically. Some candidates mistakenly reverse columns instead. Always read carefully: "flip horizontally" means reverse each row.

4. **Creating unnecessary copies:** While creating a new result matrix is acceptable, it uses O(n²) extra space. The optimal solution modifies the matrix in-place using two pointers, which is more space-efficient.

## When You'll See This Pattern

The two-pointer technique used here appears in many array and string manipulation problems:

1. **Reverse String (LeetCode 344)** - Uses the same two-pointer swap technique to reverse a string or array in-place.
2. **Valid Palindrome (LeetCode 125)** - Uses two pointers moving inward from both ends to check if a string is a palindrome.
3. **Move Zeroes (LeetCode 283)** - While not exactly the same, it uses two pointers to rearrange elements in-place.
4. **Sort Colors (LeetCode 75)** - Uses a three-pointer approach (Dutch National Flag problem) to sort in a single pass.

The pattern of processing symmetric positions from both ends toward the center is useful whenever you need to reverse, check symmetry, or perform complementary operations on paired elements.

## Key Takeaways

1. **Two-pointer technique is powerful for symmetric operations:** When you need to process elements from both ends of an array/row, consider using `left` and `right` pointers that move toward each other.

2. **Combine operations when possible:** Instead of performing flip-then-invert as two separate passes, we combined them into a single operation. This optimization often comes from recognizing mathematical relationships between operations.

3. **Handle edge cases carefully:** The middle element in odd-length sequences requires special handling. Always test with both even and odd dimensions to ensure your solution works correctly.

[Practice this problem on CodeJeet](/problem/flipping-an-image)
