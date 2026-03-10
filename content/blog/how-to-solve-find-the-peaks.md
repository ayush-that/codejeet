---
title: "How to Solve Find the Peaks — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Peaks. Easy difficulty, 75.0% acceptance rate. Topics: Array, Enumeration."
date: "2027-11-23"
category: "dsa-patterns"
tags: ["find-the-peaks", "array", "enumeration", "easy"]
---

# How to Solve Find the Peaks

This problem asks us to identify all "peaks" in an array—indices where an element is strictly greater than both its immediate neighbors. While conceptually straightforward, it's a great exercise in careful array traversal and boundary handling. The challenge lies in implementing a clean solution that correctly handles edge cases while maintaining readability.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `mountain = [1, 3, 2, 5, 4, 1]`.

We need to check each interior element (not the first or last) to see if it's a peak:

- **Index 1 (value 3)**: Compare with neighbors at indices 0 and 2. 3 > 1 and 3 > 2 → **Peak found**
- **Index 2 (value 2)**: Compare with indices 1 and 3. 2 > 3? No → Not a peak
- **Index 3 (value 5)**: Compare with indices 2 and 4. 5 > 2 and 5 > 4 → **Peak found**
- **Index 4 (value 4)**: Compare with indices 3 and 5. 4 > 5? No → Not a peak

The first and last elements (indices 0 and 5) cannot be peaks because they only have one neighbor each. Our result would be `[1, 3]`.

Notice the pattern: we iterate from index 1 to `len(mountain)-2` (inclusive), checking if each element is greater than both its left and right neighbors.

## Brute Force Approach

The most straightforward approach is exactly what we visualized: iterate through all possible peak positions and check the condition. While this is actually the optimal approach for this problem (O(n) time), let's consider what a truly naive candidate might try:

A less experienced candidate might check every single index, including the boundaries, leading to index out-of-bounds errors when checking neighbors. Or they might create unnecessary copies of the array or use nested loops. The key insight is that we only need a single pass through the array, checking each interior element exactly once.

Since the problem constraints are lenient (array length up to 100), even a slightly suboptimal implementation would pass, but interviewers look for clean, efficient solutions.

## Optimal Solution

The optimal solution uses a single pass through the array from index 1 to n-2. For each position, we check if the current element is strictly greater than both neighbors. If so, we add the index to our result list.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output, O(k) including output where k = number of peaks
def findPeaks(mountain):
    """
    Find all peaks in the mountain array.
    A peak is an element strictly greater than both neighbors.

    Args:
        mountain: List[int] - The input array

    Returns:
        List[int] - Indices of all peaks in any order
    """
    peaks = []  # Step 1: Initialize result list

    # Step 2: Iterate through all possible peak positions
    # We start at index 1 and end at len(mountain)-2 because
    # first and last elements cannot be peaks (only one neighbor)
    for i in range(1, len(mountain) - 1):
        # Step 3: Check if current element is strictly greater than both neighbors
        if mountain[i] > mountain[i - 1] and mountain[i] > mountain[i + 1]:
            peaks.append(i)  # Step 4: Add peak index to result

    return peaks  # Step 5: Return all found peaks
```

```javascript
// Time: O(n) | Space: O(1) excluding output, O(k) including output where k = number of peaks
function findPeaks(mountain) {
  /**
   * Find all peaks in the mountain array.
   * A peak is an element strictly greater than both neighbors.
   *
   * @param {number[]} mountain - The input array
   * @return {number[]} - Indices of all peaks in any order
   */
  const peaks = []; // Step 1: Initialize result array

  // Step 2: Iterate through all possible peak positions
  // We start at index 1 and end at mountain.length-2 because
  // first and last elements cannot be peaks (only one neighbor)
  for (let i = 1; i < mountain.length - 1; i++) {
    // Step 3: Check if current element is strictly greater than both neighbors
    if (mountain[i] > mountain[i - 1] && mountain[i] > mountain[i + 1]) {
      peaks.push(i); // Step 4: Add peak index to result
    }
  }

  return peaks; // Step 5: Return all found peaks
}
```

```java
// Time: O(n) | Space: O(1) excluding output, O(k) including output where k = number of peaks
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findPeaks(int[] mountain) {
        /**
         * Find all peaks in the mountain array.
         * A peak is an element strictly greater than both neighbors.
         *
         * @param mountain - The input array
         * @return List<Integer> - Indices of all peaks in any order
         */
        List<Integer> peaks = new ArrayList<>();  // Step 1: Initialize result list

        // Step 2: Iterate through all possible peak positions
        // We start at index 1 and end at mountain.length-2 because
        // first and last elements cannot be peaks (only one neighbor)
        for (int i = 1; i < mountain.length - 1; i++) {
            // Step 3: Check if current element is strictly greater than both neighbors
            if (mountain[i] > mountain[i - 1] && mountain[i] > mountain[i + 1]) {
                peaks.add(i);  // Step 4: Add peak index to result
            }
        }

        return peaks;  // Step 5: Return all found peaks
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through n-2 elements in the array (from index 1 to n-2)
- Each iteration performs constant-time operations: two comparisons and potentially adding to the result list
- Even in the worst case where the array has no peaks, we still check every interior position

**Space Complexity: O(1) excluding output, O(k) including output**

- We only use a constant amount of extra space for the loop variable and comparisons
- The output list stores k indices, where k is the number of peaks found (0 ≤ k ≤ n-2)
- In the worst case (alternating peaks and valleys), k could be roughly n/2

## Common Mistakes

1. **Incorrect loop boundaries**: Starting at index 0 or ending at the last index causes index out-of-bounds errors when checking `mountain[i-1]` or `mountain[i+1]`. Always remember: peaks require two neighbors, so first and last elements can't be peaks.

2. **Using non-strict comparisons**: The problem specifies "strictly greater," so using `>=` instead of `>` would incorrectly identify plateaus as peaks. For `[1, 2, 2, 1]`, index 1 and 2 are equal, so neither is strictly greater than both neighbors.

3. **Forgetting to handle small arrays**: With arrays of length 0, 1, or 2, there are no possible peaks. Your loop should handle these cases gracefully—either by not entering the loop (when `len(mountain) < 3`) or by having proper boundary conditions.

4. **Unnecessary complexity**: Some candidates try to optimize prematurely with early exits or special cases, but these often introduce bugs without providing meaningful performance benefits. The simple linear scan is already optimal.

## When You'll See This Pattern

This "local comparison" pattern appears in many array processing problems:

1. **Find Peak Element (Medium)**: A more challenging version where you need to find any peak (not all peaks) in logarithmic time using binary search. The core comparison logic is similar.

2. **Trapping Rain Water (Hard)**: Requires finding local maxima (peaks) to determine where water can be trapped between them.

3. **Wiggle Sort (Medium)**: Involves comparing elements with their neighbors to create alternating peaks and valleys in the array.

The pattern teaches you to think locally—examining each element in relation to its immediate neighbors rather than the entire array. This is a fundamental technique for many array manipulation problems.

## Key Takeaways

1. **Boundary awareness is critical**: Always consider what happens at the edges of your data structures. For array traversal problems, explicitly think about the first and last elements.

2. **Simple solutions are often best**: When a problem asks for all elements satisfying a local condition, a linear scan with neighbor comparisons is usually optimal. Don't overcomplicate it.

3. **Read specifications carefully**: "Strictly greater" versus "greater than or equal" makes a real difference. Pay attention to these details in problem statements.

Related problems: [Find Peak Element](/problem/find-peak-element), [Find a Peak Element II](/problem/find-a-peak-element-ii)
