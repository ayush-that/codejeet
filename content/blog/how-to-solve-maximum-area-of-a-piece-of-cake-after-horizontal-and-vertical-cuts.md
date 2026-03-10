---
title: "How to Solve Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts. Medium difficulty, 41.4% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2026-04-29"
category: "dsa-patterns"
tags:
  [
    "maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts",
    "array",
    "greedy",
    "sorting",
    "medium",
  ]
---

# How to Solve Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts

You're given a rectangular cake and lists of positions where horizontal and vertical cuts are made. Your task is to find the maximum area of any single piece after all cuts are made. The challenge lies in recognizing that the maximum area piece will come from the largest horizontal gap multiplied by the largest vertical gap—not from trying to compute every possible piece.

## Visual Walkthrough

Let's walk through an example: `h = 5`, `w = 4`, `horizontalCuts = [1,2,4]`, `verticalCuts = [1,3]`

**Step 1: Understanding the cake layout**

- The cake is 5 units tall (top to bottom) and 4 units wide (left to right)
- Horizontal cuts at distances 1, 2, and 4 from the top
- Vertical cuts at distances 1 and 3 from the left

**Step 2: Visualizing the cuts**

```
Top edge (0)
-----------
Cut at 1
-----------
Cut at 2
-----------
Cut at 4
-----------
Bottom edge (5)
```

Horizontally, we have segments: 0→1, 1→2, 2→4, 4→5

```
Left edge (0) | Cut at 1 | Cut at 3 | Right edge (4)
```

Vertically, we have segments: 0→1, 1→3, 3→4

**Step 3: Finding the largest gaps**

- Horizontal gaps: [1-0=1, 2-1=1, 4-2=2, 5-4=1] → largest = 2
- Vertical gaps: [1-0=1, 3-1=2, 4-3=1] → largest = 2

**Step 4: Calculating maximum area**

- Maximum area = largest horizontal gap × largest vertical gap = 2 × 2 = 4

The piece between horizontal cuts 2 and 4, and vertical cuts 1 and 3 has area 4, which is indeed the maximum.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible pieces by considering every pair of consecutive horizontal cuts and every pair of consecutive vertical cuts
2. Calculate the area for each piece
3. Track the maximum area found

However, this approach is unnecessary and inefficient because:

- We don't actually need to compute every piece's area
- The maximum area will always come from the largest horizontal segment multiplied by the largest vertical segment
- This brute force would be O(m×n) where m and n are the number of horizontal and vertical segments

Even if we implemented this, it would be inefficient compared to the optimal solution. The key insight is that we're looking for the maximum product of two independent dimensions.

## Optimized Approach

The optimal solution relies on these key insights:

1. **Independent dimensions**: The horizontal and vertical cuts are independent. The maximum area piece will use the tallest height available and the widest width available.

2. **Sorting is essential**: To find the largest gap between cuts, we need to sort the cut positions. The largest gap could be between:
   - The first cut and the edge (0)
   - Between two consecutive cuts
   - The last cut and the opposite edge (h or w)

3. **Edge inclusion**: Don't forget to include the edges (0 and h for horizontal, 0 and w for vertical) when calculating gaps. The largest gap might be from the last cut to the bottom edge or from the top edge to the first cut.

4. **Modulo operation**: Since the result can be very large, we need to return it modulo 10^9+7 as specified in the problem.

The algorithm:

1. Sort both horizontal and vertical cut arrays
2. Find the maximum gap between consecutive horizontal cuts (including edges)
3. Find the maximum gap between consecutive vertical cuts (including edges)
4. Multiply these two maximum gaps and return modulo 10^9+7

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + m log m) where n = len(horizontalCuts), m = len(verticalCuts)
# Space: O(1) excluding input arrays (or O(log n + log m) for sorting space)
def maxArea(self, h: int, w: int, horizontalCuts: List[int], verticalCuts: List[int]) -> int:
    MOD = 10**9 + 7

    # Step 1: Sort both cut arrays to find consecutive gaps
    horizontalCuts.sort()
    verticalCuts.sort()

    # Step 2: Find maximum horizontal gap
    # Start with gap from top edge (0) to first cut
    max_horizontal_gap = horizontalCuts[0]

    # Check gaps between consecutive cuts
    for i in range(1, len(horizontalCuts)):
        gap = horizontalCuts[i] - horizontalCuts[i-1]
        max_horizontal_gap = max(max_horizontal_gap, gap)

    # Check gap from last cut to bottom edge (h)
    max_horizontal_gap = max(max_horizontal_gap, h - horizontalCuts[-1])

    # Step 3: Find maximum vertical gap
    # Start with gap from left edge (0) to first cut
    max_vertical_gap = verticalCuts[0]

    # Check gaps between consecutive cuts
    for i in range(1, len(verticalCuts)):
        gap = verticalCuts[i] - verticalCuts[i-1]
        max_vertical_gap = max(max_vertical_gap, gap)

    # Check gap from last cut to right edge (w)
    max_vertical_gap = max(max_vertical_gap, w - verticalCuts[-1])

    # Step 4: Calculate maximum area modulo 10^9+7
    # Use modulo multiplication to prevent overflow
    return (max_horizontal_gap % MOD) * (max_vertical_gap % MOD) % MOD
```

```javascript
// Time: O(n log n + m log m) where n = horizontalCuts.length, m = verticalCuts.length
// Space: O(1) excluding input arrays (or O(log n + log m) for sorting space)
var maxArea = function (h, w, horizontalCuts, verticalCuts) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Sort both cut arrays to find consecutive gaps
  horizontalCuts.sort((a, b) => a - b);
  verticalCuts.sort((a, b) => a - b);

  // Step 2: Find maximum horizontal gap
  // Start with gap from top edge (0) to first cut
  let maxHorizontalGap = horizontalCuts[0];

  // Check gaps between consecutive cuts
  for (let i = 1; i < horizontalCuts.length; i++) {
    const gap = horizontalCuts[i] - horizontalCuts[i - 1];
    maxHorizontalGap = Math.max(maxHorizontalGap, gap);
  }

  // Check gap from last cut to bottom edge (h)
  maxHorizontalGap = Math.max(maxHorizontalGap, h - horizontalCuts[horizontalCuts.length - 1]);

  // Step 3: Find maximum vertical gap
  // Start with gap from left edge (0) to first cut
  let maxVerticalGap = verticalCuts[0];

  // Check gaps between consecutive cuts
  for (let i = 1; i < verticalCuts.length; i++) {
    const gap = verticalCuts[i] - verticalCuts[i - 1];
    maxVerticalGap = Math.max(maxVerticalGap, gap);
  }

  // Check gap from last cut to right edge (w)
  maxVerticalGap = Math.max(maxVerticalGap, w - verticalCuts[verticalCuts.length - 1]);

  // Step 4: Calculate maximum area modulo 10^9+7
  // Use BigInt to prevent overflow during multiplication
  return Number((BigInt(maxHorizontalGap % MOD) * BigInt(maxVerticalGap % MOD)) % BigInt(MOD));
};
```

```java
// Time: O(n log n + m log m) where n = horizontalCuts.length, m = verticalCuts.length
// Space: O(1) excluding input arrays (or O(log n + log m) for sorting space)
class Solution {
    public int maxArea(int h, int w, int[] horizontalCuts, int[] verticalCuts) {
        final int MOD = 1_000_000_007;

        // Step 1: Sort both cut arrays to find consecutive gaps
        Arrays.sort(horizontalCuts);
        Arrays.sort(verticalCuts);

        // Step 2: Find maximum horizontal gap
        // Start with gap from top edge (0) to first cut
        long maxHorizontalGap = horizontalCuts[0];

        // Check gaps between consecutive cuts
        for (int i = 1; i < horizontalCuts.length; i++) {
            long gap = horizontalCuts[i] - horizontalCuts[i - 1];
            maxHorizontalGap = Math.max(maxHorizontalGap, gap);
        }

        // Check gap from last cut to bottom edge (h)
        maxHorizontalGap = Math.max(maxHorizontalGap, h - horizontalCuts[horizontalCuts.length - 1]);

        // Step 3: Find maximum vertical gap
        // Start with gap from left edge (0) to first cut
        long maxVerticalGap = verticalCuts[0];

        // Check gaps between consecutive cuts
        for (int i = 1; i < verticalCuts.length; i++) {
            long gap = verticalCuts[i] - verticalCuts[i - 1];
            maxVerticalGap = Math.max(maxVerticalGap, gap);
        }

        // Check gap from last cut to right edge (w)
        maxVerticalGap = Math.max(maxVerticalGap, w - verticalCuts[verticalCuts.length - 1]);

        // Step 4: Calculate maximum area modulo 10^9+7
        // Use long for intermediate calculation to prevent overflow
        return (int)((maxHorizontalGap % MOD) * (maxVerticalGap % MOD) % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + m log m)**

- Sorting `horizontalCuts` takes O(n log n) where n = len(horizontalCuts)
- Sorting `verticalCuts` takes O(m log m) where m = len(verticalCuts)
- Finding maximum gaps takes O(n) + O(m) after sorting
- Dominated by the sorting operations

**Space Complexity: O(1) or O(log n + log m)**

- If we consider only auxiliary space (excluding input): O(1) for variables
- If considering sorting space: O(log n + log m) for the sorting algorithm's recursion stack (for Timsort in Python, Arrays.sort in Java)
- JavaScript's sort typically uses O(log n) space

## Common Mistakes

1. **Forgetting to sort the cuts**: This is the most common mistake. Without sorting, you can't find consecutive cuts to calculate gaps properly. Always sort first!

2. **Missing edge cases**: Forgetting to check gaps from edges (0 to first cut, and last cut to h/w). Remember that the largest gap could be at the edges.

3. **Integer overflow**: Not using modulo properly or not handling large multiplications. In Java, use `long` for intermediate calculations. In JavaScript, consider using `BigInt` for safety.

4. **Assuming cuts are sorted**: The problem doesn't state that cuts are given in sorted order. Always sort explicitly.

5. **Empty cut arrays**: If `horizontalCuts` or `verticalCuts` is empty, the maximum gap is simply `h` or `w`. The code above handles this since we start with the first element (if array is empty, we'd need to handle that edge case).

## When You'll See This Pattern

This problem teaches the **"maximum gap between sorted elements"** pattern, which appears in various forms:

1. **Container With Most Water (LeetCode 11)**: Similar concept of maximizing area between two dimensions, though with a two-pointer approach instead of sorting.

2. **Maximum Gap (LeetCode 164)**: Directly about finding maximum gap between sorted elements, often solved with bucket sort.

3. **Largest Rectangle in Histogram (LeetCode 84)**: While more complex, it involves finding maximum areas based on heights and widths.

4. **Meeting Rooms II (LeetCode 253)**: Uses sorting and tracking gaps/overlaps in time intervals.

The core pattern: When you need to find maximum distances, differences, or gaps between elements, sorting is usually the first step.

## Key Takeaways

1. **Sort to find gaps**: When you need to find maximum/minimum distances between points, sorting transforms an O(n²) pairwise comparison into O(n log n).

2. **Independent dimensions multiply**: For rectangle area problems where dimensions are independent, find the maximum in each dimension separately, then multiply.

3. **Don't forget the edges**: When dealing with ranges from 0 to N, always check the segments from 0 to first element and from last element to N.

4. **Watch for overflow**: When dealing with large numbers and multiplication, use appropriate data types (long, BigInt) and apply modulo operations correctly.

[Practice this problem on CodeJeet](/problem/maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts)
