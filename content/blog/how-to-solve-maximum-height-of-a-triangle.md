---
title: "How to Solve Maximum Height of a Triangle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Height of a Triangle. Easy difficulty, 44.2% acceptance rate. Topics: Array, Enumeration."
date: "2028-10-04"
category: "dsa-patterns"
tags: ["maximum-height-of-a-triangle", "array", "enumeration", "easy"]
---

# How to Solve Maximum Height of a Triangle

You're given counts of red and blue balls, and you need to arrange them into a triangular pyramid where each row has one more ball than the previous, starting with 1 ball in the first row. The catch: all balls in a row must be the same color, and consecutive rows must alternate colors. This problem is interesting because it combines mathematical reasoning with careful enumeration—you need to find the maximum height possible given two constraints (total balls and alternating colors).

## Visual Walkthrough

Let's walk through an example with `red = 5, blue = 10`. We want to build the tallest possible triangle with alternating colors.

**Option 1: Start with red**

- Row 1 (red): 1 ball → red left = 4, blue = 10
- Row 2 (blue): 2 balls → red = 4, blue left = 8
- Row 3 (red): 3 balls → red left = 1, blue = 8
- Row 4 (blue): 4 balls → red = 1, blue left = 4
- Row 5 (red): 5 balls → need 5 red, but only 1 left → STOP

Height = 4 rows

**Option 2: Start with blue**

- Row 1 (blue): 1 ball → red = 5, blue left = 9
- Row 2 (red): 2 balls → red left = 3, blue = 9
- Row 3 (blue): 3 balls → red = 3, blue left = 6
- Row 4 (red): 4 balls → need 4 red, but only 3 left → STOP

Height = 3 rows

Maximum height = max(4, 3) = 4 rows

The key insight: we need to try both starting colors because the counts are different, and one might yield a taller triangle.

## Brute Force Approach

A naive approach would be to simulate building the triangle row by row for both starting colors. For each starting color, we would:

1. Initialize current counts of red and blue
2. For each row number i (starting from 1):
   - Check if we have enough balls of the current color (i balls)
   - If yes, subtract i balls from that color, switch colors, and continue
   - If no, return the height reached so far

This approach is actually optimal for this problem because we need to check each row sequentially until we run out of balls. The "brute force" here isn't inefficient—it's the natural solution. However, a truly naive candidate might try to use mathematical formulas without considering the alternating constraint, or might forget to try both starting colors.

## Optimal Solution

The optimal solution directly implements the simulation described above. We try both possible starting colors and return the maximum height achieved.

<div class="code-group">

```python
# Time: O(√n) where n = red + blue | Space: O(1)
def maxHeightOfTriangle(red, blue):
    """
    Calculate maximum triangle height with alternating row colors.

    Args:
        red (int): Number of red balls
        blue (int): Number of blue balls

    Returns:
        int: Maximum height (number of rows) achievable
    """

    def try_starting_with(start_color):
        """
        Helper function to simulate building triangle starting with given color.

        Args:
            start_color (str): 'red' or 'blue' to indicate starting color

        Returns:
            int: Height achieved with this starting color
        """
        # Initialize counts
        red_left = red
        blue_left = blue
        current_color = start_color
        height = 0
        row_size = 1  # Row 1 needs 1 ball, row 2 needs 2, etc.

        while True:
            # Check if we have enough balls for current row
            if current_color == 'red':
                if red_left >= row_size:
                    red_left -= row_size  # Use balls for this row
                else:
                    break  # Not enough balls, stop building
            else:  # current_color == 'blue'
                if blue_left >= row_size:
                    blue_left -= row_size  # Use balls for this row
                else:
                    break  # Not enough balls, stop building

            height += 1  # Successfully built this row
            row_size += 1  # Next row needs one more ball
            # Switch colors for next row
            current_color = 'blue' if current_color == 'red' else 'red'

        return height

    # Try both possibilities and return the maximum
    height_start_red = try_starting_with('red')
    height_start_blue = try_starting_with('blue')

    return max(height_start_red, height_start_blue)
```

```javascript
// Time: O(√n) where n = red + blue | Space: O(1)
/**
 * Calculate maximum triangle height with alternating row colors.
 *
 * @param {number} red - Number of red balls
 * @param {number} blue - Number of blue balls
 * @return {number} Maximum height (number of rows) achievable
 */
function maxHeightOfTriangle(red, blue) {
  /**
   * Helper function to simulate building triangle starting with given color.
   *
   * @param {string} startColor - 'red' or 'blue' to indicate starting color
   * @return {number} Height achieved with this starting color
   */
  function tryStartingWith(startColor) {
    // Initialize counts
    let redLeft = red;
    let blueLeft = blue;
    let currentColor = startColor;
    let height = 0;
    let rowSize = 1; // Row 1 needs 1 ball, row 2 needs 2, etc.

    while (true) {
      // Check if we have enough balls for current row
      if (currentColor === "red") {
        if (redLeft >= rowSize) {
          redLeft -= rowSize; // Use balls for this row
        } else {
          break; // Not enough balls, stop building
        }
      } else {
        // currentColor === 'blue'
        if (blueLeft >= rowSize) {
          blueLeft -= rowSize; // Use balls for this row
        } else {
          break; // Not enough balls, stop building
        }
      }

      height++; // Successfully built this row
      rowSize++; // Next row needs one more ball
      // Switch colors for next row
      currentColor = currentColor === "red" ? "blue" : "red";
    }

    return height;
  }

  // Try both possibilities and return the maximum
  const heightStartRed = tryStartingWith("red");
  const heightStartBlue = tryStartingWith("blue");

  return Math.max(heightStartRed, heightStartBlue);
}
```

```java
// Time: O(√n) where n = red + blue | Space: O(1)
class Solution {
    /**
     * Calculate maximum triangle height with alternating row colors.
     *
     * @param red Number of red balls
     * @param blue Number of blue balls
     * @return Maximum height (number of rows) achievable
     */
    public int maxHeightOfTriangle(int red, int blue) {
        // Try both possibilities and return the maximum
        int heightStartRed = tryStartingWith(red, blue, true);
        int heightStartBlue = tryStartingWith(red, blue, false);

        return Math.max(heightStartRed, heightStartBlue);
    }

    /**
     * Helper function to simulate building triangle starting with given color.
     *
     * @param red Total red balls available
     * @param blue Total blue balls available
     * @param startWithRed true to start with red, false to start with blue
     * @return Height achieved with this starting color
     */
    private int tryStartingWith(int red, int blue, boolean startWithRed) {
        // Initialize counts
        int redLeft = red;
        int blueLeft = blue;
        boolean currentColorIsRed = startWithRed;
        int height = 0;
        int rowSize = 1;  // Row 1 needs 1 ball, row 2 needs 2, etc.

        while (true) {
            // Check if we have enough balls for current row
            if (currentColorIsRed) {
                if (redLeft >= rowSize) {
                    redLeft -= rowSize;  // Use balls for this row
                } else {
                    break;  // Not enough balls, stop building
                }
            } else {  // current color is blue
                if (blueLeft >= rowSize) {
                    blueLeft -= rowSize;  // Use balls for this row
                } else {
                    break;  // Not enough balls, stop building
                }
            }

            height++;  // Successfully built this row
            rowSize++;  // Next row needs one more ball
            // Switch colors for next row
            currentColorIsRed = !currentColorIsRed;
        }

        return height;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√n)** where n = red + blue (total balls)

- We build rows until we run out of balls
- Row i requires i balls, so after k rows we've used 1 + 2 + ... + k = k(k+1)/2 balls
- Solving k(k+1)/2 ≤ n gives us k ≈ √(2n) = O(√n)
- We do this twice (for both starting colors), but O(2√n) = O(√n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables tracking counts, height, and row size
- No additional data structures are needed

## Common Mistakes

1. **Forgetting to try both starting colors**: This is the most common mistake. With different counts of red and blue balls, starting with one color might yield a taller triangle than starting with the other. Always check both possibilities.

2. **Incorrect row size increment**: Some candidates forget to increment the row size after each successful row, or increment it at the wrong time (before checking if they can build the current row). Remember: row i needs i balls, so after building row i, the next row needs i+1 balls.

3. **Not handling the color switch correctly**: The problem states consecutive rows must have different colors. After building a row with color C, the next row must use the other color. A common error is to check the wrong color for the current row.

4. **Using mathematical formulas instead of simulation**: While there are mathematical approaches, they're error-prone for this problem due to the alternating constraint. The simulation approach is straightforward and less likely to contain off-by-one errors.

## When You'll See This Pattern

This problem uses **sequential simulation with constraints**, a pattern common in problems where you need to build a structure according to specific rules until resources run out.

Related problems:

1. **Maximum Number of Vowels in a Substring of Given Length (LeetCode 1456)**: Both problems involve sliding through a sequence while tracking constraints, though the constraints differ.
2. **Container With Most Water (LeetCode 11)**: While different in specifics, both require trying different starting points (or configurations) to find an optimal solution.
3. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Like trying both starting colors, this problem often requires considering different starting points from both ends of the array.

The core technique of "try all reasonable starting configurations and simulate forward" appears in many optimization problems where greedy simulation from each starting point is efficient.

## Key Takeaways

1. **When dealing with alternating patterns, always check both possible starting points**. Different starting points can lead to different results when resources are asymmetric.

2. **Simulation is often cleaner than complex mathematical formulas** for constrained building problems. The simulation approach here is O(√n), which is efficient enough for practical constraints.

3. **Pay attention to when you update state variables**. In this problem, incrementing the row size after successfully building a row (not before) is crucial for correctness.

[Practice this problem on CodeJeet](/problem/maximum-height-of-a-triangle)
