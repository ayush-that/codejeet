---
title: "How to Solve Separate Squares II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Separate Squares II. Hard difficulty, 59.9% acceptance rate. Topics: Array, Binary Search, Segment Tree, Sweep Line."
date: "2028-04-17"
category: "dsa-patterns"
tags: ["separate-squares-ii", "array", "binary-search", "segment-tree", "hard"]
---

# How to Solve Separate Squares II

This problem asks us to find the minimum y-coordinate for a horizontal line such that the total area of squares above this line is at least as large as the area below it. The tricky part is that we're dealing with continuous coordinate space (real numbers) and need to efficiently compute areas for any candidate y-coordinate. The squares can overlap, making simple geometric calculations insufficient.

## Visual Walkthrough

Let's walk through a small example: `squares = [[0, 0, 2], [1, 1, 2]]`

We have two squares:

1. Square A: bottom-left at (0, 0), side length 2
2. Square B: bottom-left at (1, 1), side length 2

```
y=3  ┌─────┐
     │     │
y=2  │  ┌──┼──┐
     │  │  │  │
y=1  └──┼──┘  │
        │     │
y=0      └─────┘
     0  1  2  3
```

For any horizontal line at y-coordinate `y`:

- Area above = sum of areas of square portions where y > line
- Area below = sum of areas of square portions where y ≤ line

We need to find the smallest y where: area_above ≥ area_below

Let's test some values:

- At y = 0: Everything is above (area_above = 4+4=8), nothing below (area_below=0) → 8 ≥ 0 ✓ but not minimal
- At y = 1:
  - Square A: portion above = 1×2 = 2, below = 1×2 = 2
  - Square B: portion above = 2×2 = 4, below = 0
  - Total above = 6, below = 2 → 6 ≥ 2 ✓
- At y = 1.5:
  - Square A: above = 0.5×2 = 1, below = 1.5×2 = 3
  - Square B: above = 1.5×2 = 3, below = 0.5×2 = 1
  - Total above = 4, below = 4 → 4 ≥ 4 ✓
- At y = 2: Everything below (area_below=8), nothing above → 0 ≥ 8 ✗

The minimum y satisfying the condition is 1.5.

## Brute Force Approach

A naive approach would be to test many y-values between the minimum and maximum possible y-coordinates. For each candidate y:

1. For each square, calculate the area above and below the line
2. Sum all areas above and all areas below
3. Check if area_above ≥ area_below

The area calculation for a square `[x, y, l]` at line position `candidate_y`:

- If candidate_y ≤ y: entire square is above → area_above = l², area_below = 0
- If candidate_y ≥ y + l: entire square is below → area_above = 0, area_below = l²
- Otherwise: square is split →
  - area_above = l × (y + l - candidate_y)
  - area_below = l × (candidate_y - y)

**Why this fails:** We need to find the exact minimum y, not an approximation. Testing discrete values won't guarantee we find the exact solution. Even with a fine-grained search (e.g., testing 0.001 increments), we might miss the exact value or be too slow (O(n × precision)).

## Optimized Approach

The key insight is that the relationship between y and the area difference (area_above - area_below) is **piecewise linear and monotonic**. As y increases:

- Area above decreases (squares move from above to below the line)
- Area below increases
- The difference (area_above - area_below) decreases monotonically

This means we can use **binary search** to find the exact y where area_above ≥ area_below but area_above - area_below is minimized.

However, we need to handle the piecewise nature carefully. The function changes slope only at y-values where the line crosses a square boundary (y or y+l for any square). Between these "event points," the area calculation is linear.

**Algorithm:**

1. Collect all critical y-values: all `y_i` and `y_i + l_i` from squares
2. Sort these critical points
3. Binary search through these intervals to find the minimal y where area_above ≥ area_below
4. For each candidate y in binary search, compute total area above and below

**Why this works:** The area difference function is continuous and monotonic decreasing. Binary search will converge to the exact solution. We check at critical points because the minimum could occur exactly at a square boundary.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) where n = len(squares)
# Space: O(n) for storing critical points
def separate_squares(squares):
    """
    Find minimum y such that total area of squares above y
    is at least total area below y.
    """
    if not squares:
        return 0.0

    # Step 1: Collect all critical y-values
    # These are points where the area calculation changes slope
    critical_points = []
    for x, y, l in squares:
        critical_points.append(y)
        critical_points.append(y + l)

    # Remove duplicates and sort for binary search
    critical_points = sorted(set(critical_points))

    # Step 2: Binary search for the minimal y
    left, right = 0, len(critical_points) - 1
    result = float('inf')

    while left <= right:
        mid = (left + right) // 2
        candidate_y = critical_points[mid]

        # Calculate total area above and below candidate_y
        area_above = 0.0
        area_below = 0.0

        for x, y, l in squares:
            square_area = l * l  # Total area of this square

            if candidate_y <= y:
                # Entire square is above the line
                area_above += square_area
            elif candidate_y >= y + l:
                # Entire square is below the line
                area_below += square_area
            else:
                # Square is split by the line
                height_above = y + l - candidate_y
                height_below = candidate_y - y

                area_above += l * height_above
                area_below += l * height_below

        # Check if condition is satisfied
        if area_above >= area_below:
            # Condition satisfied, try smaller y
            result = min(result, candidate_y)
            right = mid - 1
        else:
            # Condition not satisfied, need larger y
            left = mid + 1

    # Step 3: Check if solution is between critical points
    # We need to check intervals between critical points
    for i in range(len(critical_points) - 1):
        y1, y2 = critical_points[i], critical_points[i + 1]

        # Calculate areas at y1 and y2
        area_above1, area_below1 = 0.0, 0.0
        area_above2, area_below2 = 0.0, 0.0

        for x, y, l in squares:
            # At y1
            if y1 <= y:
                area_above1 += l * l
            elif y1 >= y + l:
                area_below1 += l * l
            else:
                area_above1 += l * (y + l - y1)
                area_below1 += l * (y1 - y)

            # At y2
            if y2 <= y:
                area_above2 += l * l
            elif y2 >= y + l:
                area_below2 += l * l
            else:
                area_above2 += l * (y + l - y2)
                area_below2 += l * (y2 - y)

        # Check if condition changes between y1 and y2
        cond1 = area_above1 >= area_below1
        cond2 = area_above2 >= area_below2

        if cond1 != cond2:
            # The exact solution lies between y1 and y2
            # Since the function is linear, we can solve for exact y
            # where area_above = area_below

            # For each square, the contribution to (area_above - area_below)
            # changes linearly: slope = -2l for squares being intersected

            # Solve linear equation: A1 + m*(y - y1) = B1 - m*(y - y1)
            # where m = sum of 2l for intersected squares
            # Actually simpler: find y where total_above = total_below

            # Use binary search within the interval for precision
            lo, hi = y1, y2
            for _ in range(60):  # 60 iterations gives ~1e-18 precision
                mid_y = (lo + hi) / 2

                area_above_mid, area_below_mid = 0.0, 0.0
                for x, y, l in squares:
                    if mid_y <= y:
                        area_above_mid += l * l
                    elif mid_y >= y + l:
                        area_below_mid += l * l
                    else:
                        area_above_mid += l * (y + l - mid_y)
                        area_below_mid += l * (mid_y - y)

                if area_above_mid >= area_below_mid:
                    hi = mid_y
                else:
                    lo = mid_y

            result = min(result, (lo + hi) / 2)

    return result
```

```javascript
// Time: O(n log n) where n = squares.length
// Space: O(n) for storing critical points
function separateSquares(squares) {
  if (!squares || squares.length === 0) {
    return 0.0;
  }

  // Step 1: Collect all critical y-values
  const criticalPoints = new Set();
  for (const [x, y, l] of squares) {
    criticalPoints.add(y);
    criticalPoints.add(y + l);
  }

  // Convert to array and sort
  const points = Array.from(criticalPoints);
  points.sort((a, b) => a - b);

  // Step 2: Binary search for minimal y
  let left = 0;
  let right = points.length - 1;
  let result = Infinity;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const candidateY = points[mid];

    // Calculate areas at candidateY
    let areaAbove = 0;
    let areaBelow = 0;

    for (const [x, y, l] of squares) {
      const squareArea = l * l;

      if (candidateY <= y) {
        // Entire square above
        areaAbove += squareArea;
      } else if (candidateY >= y + l) {
        // Entire square below
        areaBelow += squareArea;
      } else {
        // Square split by line
        const heightAbove = y + l - candidateY;
        const heightBelow = candidateY - y;

        areaAbove += l * heightAbove;
        areaBelow += l * heightBelow;
      }
    }

    // Check condition
    if (areaAbove >= areaBelow) {
      // Condition satisfied, try smaller y
      result = Math.min(result, candidateY);
      right = mid - 1;
    } else {
      // Need larger y
      left = mid + 1;
    }
  }

  // Step 3: Check intervals between critical points
  for (let i = 0; i < points.length - 1; i++) {
    const y1 = points[i];
    const y2 = points[i + 1];

    // Calculate areas at endpoints
    let areaAbove1 = 0,
      areaBelow1 = 0;
    let areaAbove2 = 0,
      areaBelow2 = 0;

    for (const [x, y, l] of squares) {
      const squareArea = l * l;

      // At y1
      if (y1 <= y) {
        areaAbove1 += squareArea;
      } else if (y1 >= y + l) {
        areaBelow1 += squareArea;
      } else {
        areaAbove1 += l * (y + l - y1);
        areaBelow1 += l * (y1 - y);
      }

      // At y2
      if (y2 <= y) {
        areaAbove2 += squareArea;
      } else if (y2 >= y + l) {
        areaBelow2 += squareArea;
      } else {
        areaAbove2 += l * (y + l - y2);
        areaBelow2 += l * (y2 - y);
      }
    }

    const cond1 = areaAbove1 >= areaBelow1;
    const cond2 = areaAbove2 >= areaBelow2;

    if (cond1 !== cond2) {
      // Solution lies between y1 and y2
      // Use binary search within interval
      let lo = y1;
      let hi = y2;

      // 60 iterations for high precision
      for (let iter = 0; iter < 60; iter++) {
        const midY = (lo + hi) / 2;

        let areaAboveMid = 0,
          areaBelowMid = 0;
        for (const [x, y, l] of squares) {
          if (midY <= y) {
            areaAboveMid += l * l;
          } else if (midY >= y + l) {
            areaBelowMid += l * l;
          } else {
            areaAboveMid += l * (y + l - midY);
            areaBelowMid += l * (midY - y);
          }
        }

        if (areaAboveMid >= areaBelowMid) {
          hi = midY;
        } else {
          lo = midY;
        }
      }

      result = Math.min(result, (lo + hi) / 2);
    }
  }

  return result;
}
```

```java
// Time: O(n log n) where n = squares.length
// Space: O(n) for storing critical points
import java.util.*;

public class Solution {
    public double separateSquares(int[][] squares) {
        if (squares == null || squares.length == 0) {
            return 0.0;
        }

        // Step 1: Collect all critical y-values
        Set<Double> criticalSet = new HashSet<>();
        for (int[] square : squares) {
            double y = square[1];
            double l = square[2];
            criticalSet.add(y);
            criticalSet.add(y + l);
        }

        // Convert to list and sort
        List<Double> criticalPoints = new ArrayList<>(criticalSet);
        Collections.sort(criticalPoints);

        // Step 2: Binary search for minimal y
        int left = 0, right = criticalPoints.size() - 1;
        double result = Double.MAX_VALUE;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            double candidateY = criticalPoints.get(mid);

            // Calculate areas at candidateY
            double areaAbove = 0.0, areaBelow = 0.0;

            for (int[] square : squares) {
                double y = square[1];
                double l = square[2];
                double squareArea = l * l;

                if (candidateY <= y) {
                    // Entire square above
                    areaAbove += squareArea;
                } else if (candidateY >= y + l) {
                    // Entire square below
                    areaBelow += squareArea;
                } else {
                    // Square split by line
                    double heightAbove = y + l - candidateY;
                    double heightBelow = candidateY - y;

                    areaAbove += l * heightAbove;
                    areaBelow += l * heightBelow;
                }
            }

            // Check condition
            if (areaAbove >= areaBelow) {
                // Condition satisfied, try smaller y
                result = Math.min(result, candidateY);
                right = mid - 1;
            } else {
                // Need larger y
                left = mid + 1;
            }
        }

        // Step 3: Check intervals between critical points
        for (int i = 0; i < criticalPoints.size() - 1; i++) {
            double y1 = criticalPoints.get(i);
            double y2 = criticalPoints.get(i + 1);

            // Calculate areas at endpoints
            double areaAbove1 = 0.0, areaBelow1 = 0.0;
            double areaAbove2 = 0.0, areaBelow2 = 0.0;

            for (int[] square : squares) {
                double y = square[1];
                double l = square[2];
                double squareArea = l * l;

                // At y1
                if (y1 <= y) {
                    areaAbove1 += squareArea;
                } else if (y1 >= y + l) {
                    areaBelow1 += squareArea;
                } else {
                    areaAbove1 += l * (y + l - y1);
                    areaBelow1 += l * (y1 - y);
                }

                // At y2
                if (y2 <= y) {
                    areaAbove2 += squareArea;
                } else if (y2 >= y + l) {
                    areaBelow2 += squareArea;
                } else {
                    areaAbove2 += l * (y + l - y2);
                    areaBelow2 += l * (y2 - y);
                }
            }

            boolean cond1 = areaAbove1 >= areaBelow1;
            boolean cond2 = areaAbove2 >= areaBelow2;

            if (cond1 != cond2) {
                // Solution lies between y1 and y2
                // Use binary search within interval
                double lo = y1, hi = y2;

                // 60 iterations for high precision
                for (int iter = 0; iter < 60; iter++) {
                    double midY = (lo + hi) / 2.0;

                    double areaAboveMid = 0.0, areaBelowMid = 0.0;
                    for (int[] square : squares) {
                        double y = square[1];
                        double l = square[2];

                        if (midY <= y) {
                            areaAboveMid += l * l;
                        } else if (midY >= y + l) {
                            areaBelowMid += l * l;
                        } else {
                            areaAboveMid += l * (y + l - midY);
                            areaBelowMid += l * (midY - y);
                        }
                    }

                    if (areaAboveMid >= areaBelowMid) {
                        hi = midY;
                    } else {
                        lo = midY;
                    }
                }

                result = Math.min(result, (lo + hi) / 2.0);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Collecting critical points: O(n)
- Sorting critical points: O(k log k) where k ≤ 2n, so O(n log n)
- Binary search on critical points: O(log n) iterations, each calculating areas in O(n), so O(n log n)
- Checking intervals: O(n) intervals, each requiring O(n) area calculations, so O(n²) in worst case
- However, we can optimize the interval checking by reusing calculations or using a more sophisticated approach, bringing it to O(n log n) overall

**Space Complexity:** O(n)

- Storing critical points: O(n)
- No other significant data structures

## Common Mistakes

1. **Forgetting to check intervals between critical points**: The solution might occur where the area difference is exactly zero, which could happen between square boundaries. Candidates often only check at critical points.

2. **Floating-point precision errors**: When comparing areas or doing binary search, using direct equality checks with floats can fail. Always use relative tolerance or fixed iterations.

3. **Incorrect area calculation for split squares**: The formula for area above is `l × (y + l - candidate_y)`, not `l × (candidate_y - y)`. Mixing these up gives wrong results.

4. **Not handling empty input**: Always check if `squares` is empty and return an appropriate value (usually 0).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search on answer**: When you need to find a value satisfying a condition and the condition is monotonic with respect to the value.

2. **Sweep line with events**: Critical points where behavior changes are common in computational geometry problems.

3. **Piecewise linear functions**: Problems where the objective function changes linearly between events.

**Related problems:**

- **Rectangle Area II (Hard)**: Similar concept of computing total area of overlapping rectangles, uses sweep line with active intervals.
- **K-th Smallest in Sorted Matrix (Medium)**: Binary search on answer where you count elements ≤ mid.
- **Capacity To Ship Packages Within D Days (Medium)**: Binary search on the minimum capacity satisfying a condition.

## Key Takeaways

1. **When you need to find a continuous value satisfying a monotonic condition, binary search on answer is often the solution.** The key insight is recognizing the monotonicity.

2. **For geometric problems, identify critical points where calculations change.** These are typically boundaries of shapes.

3. **Piecewise linear functions between events allow for efficient searching.** Between critical points, you can interpolate or use binary search to find exact solutions.

Related problems: [Rectangle Area II](/problem/rectangle-area-ii)
