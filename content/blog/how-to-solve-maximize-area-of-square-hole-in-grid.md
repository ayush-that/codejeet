---
title: "How to Solve Maximize Area of Square Hole in Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Area of Square Hole in Grid. Medium difficulty, 61.9% acceptance rate. Topics: Array, Sorting."
date: "2027-07-03"
category: "dsa-patterns"
tags: ["maximize-area-of-square-hole-in-grid", "array", "sorting", "medium"]
---

# How to Solve "Maximize Area of Square Hole in Grid"

This problem asks us to find the largest possible square hole we can create by removing horizontal and vertical bars from a grid. Given `n` horizontal bars and `m` vertical bars (with fixed outer boundaries), plus removable bars in `hBars` and `vBars`, we need to determine the maximum area of a square hole we can form by removing some of these bars. The tricky part is that the square must be formed by consecutive removable bars in both directions — we're looking for the longest consecutive sequence in both horizontal and vertical directions, and the square's side length is limited by the smaller of these two sequences.

## Visual Walkthrough

Let's walk through an example:  
`n = 3, m = 2, hBars = [2, 3], vBars = [1, 2]`

We have a grid with 5 horizontal bars (n+2) and 4 vertical bars (m+2). The removable horizontal bars are at positions 2 and 3, and removable vertical bars are at positions 1 and 2.

**Step 1: Understanding the grid**

- Horizontal bars: positions 1 through 5 (bars 1 and 5 are fixed boundaries)
- Vertical bars: positions 1 through 4 (bars 1 and 4 are fixed boundaries)
- Removable horizontal bars: 2, 3
- Removable vertical bars: 1, 2

**Step 2: Finding consecutive removable bars**
For horizontal bars: We have bars at positions 2 and 3. These are consecutive (2, 3), so we can remove both to create a gap of 2 units (from bar 1 to bar 3, or bar 2 to bar 4).

For vertical bars: We have bars at positions 1 and 2. These are also consecutive (1, 2), so we can remove both to create a gap of 2 units.

**Step 3: Determining square size**
The maximum consecutive horizontal bars we can remove gives us a horizontal gap of (consecutive_count + 1). Similarly for vertical bars. The square's side length is limited by the smaller gap.

Horizontal consecutive count: 2 bars → gap = 2 + 1 = 3 units  
Vertical consecutive count: 2 bars → gap = 2 + 1 = 3 units

**Step 4: Calculating area**
Square side = min(3, 3) = 3  
Area = 3 × 3 = 9

The key insight: We need to find the longest consecutive sequence of removable bars in both directions, then calculate the corresponding gaps.

## Brute Force Approach

A naive approach would be to try all possible subsets of horizontal bars and all possible subsets of vertical bars, check which ones form consecutive sequences, calculate the resulting gaps, and find the maximum square area. However, this is exponential in time complexity: O(2^h × 2^v) where h and v are the number of removable bars.

Even for moderate inputs (say 100 removable bars in each direction), this becomes completely infeasible (2^100 operations).

What makes this problem solvable efficiently is that we don't need to consider all subsets — we only care about consecutive sequences. The longest consecutive sequence gives us the maximum gap we can achieve in each direction.

## Optimized Approach

The key insight is that this problem reduces to finding the longest consecutive sequence in two separate arrays. Here's the step-by-step reasoning:

1. **Sort both arrays**: Since we're looking for consecutive numbers, sorting helps us find sequences efficiently.
2. **Find longest consecutive sequence in hBars**: Iterate through the sorted array, tracking the current consecutive sequence length.
3. **Find longest consecutive sequence in vBars**: Do the same for vertical bars.
4. **Calculate gaps**: For a sequence of k consecutive bars, the gap created is (k + 1) because removing k consecutive bars creates a gap spanning from the bar before the sequence to the bar after the sequence.
5. **Determine square side**: The square's side length is limited by the smaller gap: min(horizontal_gap, vertical_gap).
6. **Calculate area**: Square the side length to get the area.

Why does this work? When we remove consecutive bars, we're effectively creating a larger opening. The more consecutive bars we remove, the larger the opening becomes. Since we want a square, we're constrained by the smaller dimension.

## Optimal Solution

<div class="code-group">

```python
# Time: O(h log h + v log v) where h = len(hBars), v = len(vBars)
# Space: O(1) if we ignore sorting space, O(log h + log v) for sorting
class Solution:
    def maximizeSquareHoleArea(self, n: int, m: int, hBars: List[int], vBars: List[int]) -> int:
        # Step 1: Sort both arrays to find consecutive sequences
        hBars.sort()
        vBars.sort()

        # Step 2: Find longest consecutive sequence in horizontal bars
        max_h_consecutive = 1  # Minimum is 1 (removing just one bar)
        current_h_consecutive = 1

        for i in range(1, len(hBars)):
            if hBars[i] == hBars[i-1] + 1:
                # Bars are consecutive, extend the sequence
                current_h_consecutive += 1
            else:
                # Sequence broken, reset counter
                current_h_consecutive = 1
            # Update maximum
            max_h_consecutive = max(max_h_consecutive, current_h_consecutive)

        # Step 3: Find longest consecutive sequence in vertical bars
        max_v_consecutive = 1  # Minimum is 1
        current_v_consecutive = 1

        for i in range(1, len(vBars)):
            if vBars[i] == vBars[i-1] + 1:
                # Bars are consecutive, extend the sequence
                current_v_consecutive += 1
            else:
                # Sequence broken, reset counter
                current_v_consecutive = 1
            # Update maximum
            max_v_consecutive = max(max_v_consecutive, current_v_consecutive)

        # Step 4: Calculate the gaps
        # If we have k consecutive bars, the gap is k + 1
        # Example: removing bars 2 and 3 (2 consecutive bars) creates gap of 3
        # from bar 1 to bar 4 (1-2-3-4, with 2 and 3 removed)
        horizontal_gap = max_h_consecutive + 1
        vertical_gap = max_v_consecutive + 1

        # Step 5: Square side is limited by smaller gap
        square_side = min(horizontal_gap, vertical_gap)

        # Step 6: Return area (square of side length)
        return square_side * square_side
```

```javascript
// Time: O(h log h + v log v) where h = hBars.length, v = vBars.length
// Space: O(1) if we ignore sorting space, O(log h + log v) for sorting
/**
 * @param {number} n
 * @param {number} m
 * @param {number[]} hBars
 * @param {number[]} vBars
 * @return {number}
 */
var maximizeSquareHoleArea = function (n, m, hBars, vBars) {
  // Step 1: Sort both arrays to find consecutive sequences
  hBars.sort((a, b) => a - b);
  vBars.sort((a, b) => a - b);

  // Step 2: Find longest consecutive sequence in horizontal bars
  let maxHConsecutive = 1; // Minimum is 1 (removing just one bar)
  let currentHConsecutive = 1;

  for (let i = 1; i < hBars.length; i++) {
    if (hBars[i] === hBars[i - 1] + 1) {
      // Bars are consecutive, extend the sequence
      currentHConsecutive++;
    } else {
      // Sequence broken, reset counter
      currentHConsecutive = 1;
    }
    // Update maximum
    maxHConsecutive = Math.max(maxHConsecutive, currentHConsecutive);
  }

  // Step 3: Find longest consecutive sequence in vertical bars
  let maxVConsecutive = 1; // Minimum is 1
  let currentVConsecutive = 1;

  for (let i = 1; i < vBars.length; i++) {
    if (vBars[i] === vBars[i - 1] + 1) {
      // Bars are consecutive, extend the sequence
      currentVConsecutive++;
    } else {
      // Sequence broken, reset counter
      currentVConsecutive = 1;
    }
    // Update maximum
    maxVConsecutive = Math.max(maxVConsecutive, currentVConsecutive);
  }

  // Step 4: Calculate the gaps
  // If we have k consecutive bars, the gap is k + 1
  const horizontalGap = maxHConsecutive + 1;
  const verticalGap = maxVConsecutive + 1;

  // Step 5: Square side is limited by smaller gap
  const squareSide = Math.min(horizontalGap, verticalGap);

  // Step 6: Return area (square of side length)
  return squareSide * squareSide;
};
```

```java
// Time: O(h log h + v log v) where h = hBars.length, v = vBars.length
// Space: O(1) if we ignore sorting space, O(log h + log v) for sorting
import java.util.Arrays;

class Solution {
    public int maximizeSquareHoleArea(int n, int m, int[] hBars, int[] vBars) {
        // Step 1: Sort both arrays to find consecutive sequences
        Arrays.sort(hBars);
        Arrays.sort(vBars);

        // Step 2: Find longest consecutive sequence in horizontal bars
        int maxHConsecutive = 1;  // Minimum is 1 (removing just one bar)
        int currentHConsecutive = 1;

        for (int i = 1; i < hBars.length; i++) {
            if (hBars[i] == hBars[i - 1] + 1) {
                // Bars are consecutive, extend the sequence
                currentHConsecutive++;
            } else {
                // Sequence broken, reset counter
                currentHConsecutive = 1;
            }
            // Update maximum
            maxHConsecutive = Math.max(maxHConsecutive, currentHConsecutive);
        }

        // Step 3: Find longest consecutive sequence in vertical bars
        int maxVConsecutive = 1;  // Minimum is 1
        int currentVConsecutive = 1;

        for (int i = 1; i < vBars.length; i++) {
            if (vBars[i] == vBars[i - 1] + 1) {
                // Bars are consecutive, extend the sequence
                currentVConsecutive++;
            } else {
                // Sequence broken, reset counter
                currentVConsecutive = 1;
            }
            // Update maximum
            maxVConsecutive = Math.max(maxVConsecutive, currentVConsecutive);
        }

        // Step 4: Calculate the gaps
        // If we have k consecutive bars, the gap is k + 1
        int horizontalGap = maxHConsecutive + 1;
        int verticalGap = maxVConsecutive + 1;

        // Step 5: Square side is limited by smaller gap
        int squareSide = Math.min(horizontalGap, verticalGap);

        // Step 6: Return area (square of side length)
        return squareSide * squareSide;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(h log h + v log v) where h = len(hBars) and v = len(vBars).

- Sorting hBars takes O(h log h)
- Sorting vBars takes O(v log v)
- Finding consecutive sequences takes O(h) + O(v)
- The dominant factor is the sorting, giving us O(h log h + v log v) overall.

**Space Complexity:** O(log h + log v) for the sorting algorithm's recursion stack (or O(1) for iterative sort implementations). The rest of the algorithm uses only constant extra space for counters and variables.

## Common Mistakes

1. **Forgetting to sort the arrays**: This is the most common mistake. Without sorting, you can't efficiently find consecutive sequences. Candidates might try to use a hash set to check for consecutive numbers, but they still need to iterate through ranges.

2. **Off-by-one error in gap calculation**: Remember that if you remove k consecutive bars, the gap is k + 1, not k. For example, removing bars 2 and 3 creates a gap from bar 1 to bar 4, which is 3 units, not 2.

3. **Not handling empty arrays**: If hBars or vBars is empty, the maximum consecutive count should be 0, not 1. Our code handles this correctly because we initialize to 1 but the loop won't run if the array has 0 or 1 element. For a single element, the gap would be 2 (1 + 1).

4. **Confusing n and m with array lengths**: n and m represent the number of REMOVABLE bars between fixed boundaries, not the total bars. The total horizontal bars are n+2, and total vertical bars are m+2. However, n and m aren't actually used in the solution since we only care about the removable bars.

## When You'll See This Pattern

This problem uses the "longest consecutive sequence" pattern, which appears in various forms:

1. **Longest Consecutive Sequence (LeetCode 128)**: The classic problem that asks for the longest consecutive elements sequence in an unsorted array. The solution involves sorting or using a hash set.

2. **Maximum Square Area by Removing Fences From a Field (LeetCode 2975)**: A very similar problem that also involves finding consecutive sequences to maximize area.

3. **Arithmetic Slices (LeetCode 413)**: While not exactly the same, it involves finding sequences with constant differences, which requires similar consecutive element analysis.

The pattern is: when you need to find sequences with a specific property (consecutive, arithmetic progression, etc.) in an array, sorting is often the first step, followed by a single pass to find the longest such sequence.

## Key Takeaways

1. **Reduce to known patterns**: This problem seems complex but reduces to finding the longest consecutive sequence in two arrays. Always look for ways to transform a problem into something you already know how to solve.

2. **Sorting enables consecutive checks**: When you need to find consecutive elements or sequences with constant differences, sorting the array is often the key first step.

3. **Mind the gap calculation**: In problems involving removing elements to create openings, carefully calculate how the removal affects the resulting space. Draw small examples to verify your formula.

Related problems: [Maximal Square](/problem/maximal-square), [Maximum Square Area by Removing Fences From a Field](/problem/maximum-square-area-by-removing-fences-from-a-field)
