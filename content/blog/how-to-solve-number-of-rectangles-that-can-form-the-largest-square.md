---
title: "How to Solve Number Of Rectangles That Can Form The Largest Square — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number Of Rectangles That Can Form The Largest Square. Easy difficulty, 79.4% acceptance rate. Topics: Array."
date: "2027-09-22"
category: "dsa-patterns"
tags: ["number-of-rectangles-that-can-form-the-largest-square", "array", "easy"]
---

# How to Solve Number Of Rectangles That Can Form The Largest Square

This problem asks us to find how many rectangles from a given list can form the largest possible square. Each rectangle can be cut down to a square whose side length is the minimum of its length and width. The challenge is to find the maximum square size possible from all rectangles, then count how many rectangles can achieve exactly that size. What makes this interesting is that we need to track both the maximum value and the count simultaneously in a single pass.

## Visual Walkthrough

Let's walk through an example: `rectangles = [[5,8], [3,9], [5,12], [16,5]]`

**Step 1:** Process rectangle `[5,8]`

- The square side length is `min(5, 8) = 5`
- This is our first rectangle, so maximum square size = 5, count = 1

**Step 2:** Process rectangle `[3,9]`

- Square side length = `min(3, 9) = 3`
- 3 < 5, so we don't update maximum or count
- Current: max = 5, count = 1

**Step 3:** Process rectangle `[5,12]`

- Square side length = `min(5, 12) = 5`
- 5 equals current maximum, so we increment count
- Current: max = 5, count = 2

**Step 4:** Process rectangle `[16,5]`

- Square side length = `min(16, 5) = 5`
- 5 equals current maximum, so we increment count again
- Final: max = 5, count = 3

So 3 rectangles can form the largest square of size 5.

## Brute Force Approach

A brute force approach would involve two passes:

1. First pass: Calculate all square sizes and find the maximum
2. Second pass: Count how many rectangles have that maximum square size

While this approach works and is O(n) time complexity, it's not truly "brute force" in the sense of being inefficient. However, a truly naive approach might involve sorting or unnecessary comparisons. The key insight is that we can do this in a single pass, which is more elegant and efficient in practice (though both are O(n)).

What some candidates might try incorrectly:

- Trying to track all possible square sizes instead of just the maximum
- Forgetting that the square size is the minimum of length and width
- Using complex data structures when simple variables suffice

## Optimal Solution

The optimal solution processes each rectangle once, tracking both the current maximum square size and how many rectangles can form that size. For each rectangle:

1. Calculate the square side length as `min(length, width)`
2. If this is larger than our current maximum, reset the count to 1 and update maximum
3. If this equals our current maximum, increment the count
4. If this is smaller, ignore it

This gives us O(n) time and O(1) space complexity.

<div class="code-group">

```python
# Time: O(n) where n is number of rectangles
# Space: O(1) - only using constant extra space
def countGoodRectangles(rectangles):
    """
    Counts how many rectangles can form the largest possible square.

    Args:
        rectangles: List of [length, width] pairs

    Returns:
        Count of rectangles that can form the largest square
    """
    max_square = 0  # Track the largest square size found so far
    count = 0       # Count of rectangles that can form this size

    for length, width in rectangles:
        # The square side length is limited by the smaller dimension
        square_side = min(length, width)

        if square_side > max_square:
            # Found a new maximum - reset count to 1
            max_square = square_side
            count = 1
        elif square_side == max_square:
            # Matches current maximum - increment count
            count += 1
        # If square_side < max_square, we ignore it

    return count
```

```javascript
// Time: O(n) where n is number of rectangles
// Space: O(1) - only using constant extra space
function countGoodRectangles(rectangles) {
  /**
   * Counts how many rectangles can form the largest possible square.
   *
   * @param {number[][]} rectangles - Array of [length, width] pairs
   * @return {number} Count of rectangles that can form the largest square
   */
  let maxSquare = 0; // Track the largest square size found so far
  let count = 0; // Count of rectangles that can form this size

  for (const [length, width] of rectangles) {
    // The square side length is limited by the smaller dimension
    const squareSide = Math.min(length, width);

    if (squareSide > maxSquare) {
      // Found a new maximum - reset count to 1
      maxSquare = squareSide;
      count = 1;
    } else if (squareSide === maxSquare) {
      // Matches current maximum - increment count
      count++;
    }
    // If squareSide < maxSquare, we ignore it
  }

  return count;
}
```

```java
// Time: O(n) where n is number of rectangles
// Space: O(1) - only using constant extra space
class Solution {
    public int countGoodRectangles(int[][] rectangles) {
        /**
         * Counts how many rectangles can form the largest possible square.
         *
         * @param rectangles - Array of [length, width] pairs
         * @return Count of rectangles that can form the largest square
         */
        int maxSquare = 0;  // Track the largest square size found so far
        int count = 0;      // Count of rectangles that can form this size

        for (int[] rectangle : rectangles) {
            int length = rectangle[0];
            int width = rectangle[1];

            // The square side length is limited by the smaller dimension
            int squareSide = Math.min(length, width);

            if (squareSide > maxSquare) {
                // Found a new maximum - reset count to 1
                maxSquare = squareSide;
                count = 1;
            } else if (squareSide == maxSquare) {
                // Matches current maximum - increment count
                count++;
            }
            // If squareSide < maxSquare, we ignore it
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the list of rectangles exactly once
- For each rectangle, we perform constant-time operations: calculating min(), and simple comparisons
- n represents the number of rectangles in the input array

**Space Complexity:** O(1)

- We only use a fixed number of variables (max_square and count)
- No additional data structures that grow with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Forgetting to use min()**: Some candidates try to use max(length, width) or average, misunderstanding that a square's side must fit within both dimensions. Always remember: square side = min(length, width).

2. **Two-pass when one-pass suffices**: While a two-pass solution (find max, then count) is still O(n), interviewers prefer the single-pass approach as it shows better algorithmic thinking and optimization skills.

3. **Incorrect comparison logic**: When finding a new maximum, you must reset the count to 1, not increment it. A common error is `count++` instead of `count = 1` when `square_side > max_square`.

4. **Edge case handling**: For empty input, the function should return 0. Our solution handles this correctly since the loop won't execute and we return the initialized count of 0.

## When You'll See This Pattern

This "track maximum and count in one pass" pattern appears in many problems:

1. **Find Maximum and Count Occurrences** (LeetCode 414, 628): Similar pattern of tracking both the maximum value and how many times it appears.

2. **Majority Element** (LeetCode 169): Uses a similar single-pass approach with a counter, though with different comparison logic (Boyer-Moore algorithm).

3. **Find the Duplicate Number** (LeetCode 287): While more complex, it shares the concept of tracking information in a single pass through data.

The core pattern is: when you need to find an extreme value (max/min) AND count how many elements have that value, you can often do it in one pass by maintaining both the extreme value and its count, updating both as you encounter each element.

## Key Takeaways

1. **Single-pass optimization**: When a problem requires finding both an extreme value and information about it (like count), consider if you can compute both in one pass rather than two.

2. **Understand the transformation**: This problem requires understanding that the square size from a rectangle is `min(length, width)`. Many array problems involve transforming elements before processing them.

3. **Initialize carefully**: For tracking problems, think about initial values. Here, starting with `max_square = 0` and `count = 0` correctly handles empty arrays and the first rectangle.

[Practice this problem on CodeJeet](/problem/number-of-rectangles-that-can-form-the-largest-square)
