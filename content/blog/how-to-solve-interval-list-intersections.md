---
title: "How to Solve Interval List Intersections — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Interval List Intersections. Medium difficulty, 72.9% acceptance rate. Topics: Array, Two Pointers, Sweep Line."
date: "2027-03-30"
category: "dsa-patterns"
tags: ["interval-list-intersections", "array", "two-pointers", "sweep-line", "medium"]
---

# How to Solve Interval List Intersections

This problem asks us to find all overlapping intervals between two sorted, disjoint interval lists. What makes it interesting is that we need to efficiently compute intersections without comparing every possible pair—a classic two-pointer merging pattern that appears in many interval and array problems.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
firstList = [[0,2],[5,10],[13,23],[24,25]]
secondList = [[1,5],[8,12],[15,24],[25,26]]
```

We'll visualize the intervals on a number line:

```
firstList:    [0---2]     [5-----10]       [13----23]  [24-25]
secondList:      [1---5]       [8----12]       [15----24]  [25-26]
```

Now let's find intersections step by step:

1. **Compare [0,2] and [1,5]:**
   - Do they overlap? Yes, because 2 ≥ 1 and 0 ≤ 5
   - Intersection = [max(0,1), min(2,5)] = [1,2]
   - Which interval ends first? [0,2] ends at 2, [1,5] ends at 5
   - Move the pointer for the earlier-ending interval (firstList)

2. **Compare [5,10] and [1,5]:**
   - Overlap? Yes, 10 ≥ 1 and 5 ≤ 5
   - Intersection = [max(5,1), min(10,5)] = [5,5]
   - [1,5] ends at 5, [5,10] ends at 10
   - Move secondList pointer

3. **Compare [5,10] and [8,12]:**
   - Overlap? Yes, 10 ≥ 8 and 5 ≤ 12
   - Intersection = [max(5,8), min(10,12)] = [8,10]
   - [5,10] ends at 10, [8,12] ends at 12
   - Move firstList pointer

4. **Compare [13,23] and [8,12]:**
   - Overlap? No, 13 > 12
   - [8,12] ends earlier, move secondList pointer

5. **Compare [13,23] and [15,24]:**
   - Overlap? Yes, 23 ≥ 15 and 13 ≤ 24
   - Intersection = [max(13,15), min(23,24)] = [15,23]
   - [13,23] ends at 23, [15,24] ends at 24
   - Move firstList pointer

6. **Compare [24,25] and [15,24]:**
   - Overlap? Yes, 25 ≥ 15 and 24 ≤ 24
   - Intersection = [max(24,15), min(25,24)] = [24,24]
   - [15,24] ends at 24, [24,25] ends at 25
   - Move secondList pointer

7. **Compare [24,25] and [25,26]:**
   - Overlap? Yes, 25 ≥ 25 and 24 ≤ 26
   - Intersection = [max(24,25), min(25,26)] = [25,25]
   - Both end at similar times, we can move either pointer

**Output:** [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]

## Brute Force Approach

The brute force solution would compare every interval in `firstList` with every interval in `secondList`:

1. Initialize an empty result list
2. For each interval `a` in `firstList`:
   - For each interval `b` in `secondList`:
     - If `a` and `b` overlap (max start ≤ min end):
       - Add intersection [max(start_a, start_b), min(end_a, end_b)] to result

**Why this is inefficient:**

- Time complexity: O(m × n) where m and n are the lengths of the two lists
- We're doing unnecessary work because both lists are sorted
- If intervals don't overlap and one ends before the other starts, we can skip many comparisons

The brute force fails to leverage the sorted property of the input lists, which is the key to optimization.

## Optimized Approach

The key insight is that **both lists are sorted**, so we can use a two-pointer technique similar to merging two sorted arrays:

1. Use two pointers: `i` for `firstList`, `j` for `secondList`
2. At each step, compare intervals `firstList[i]` and `secondList[j]`
3. Check if they intersect: `max(start1, start2) ≤ min(end1, end2)`
4. If they intersect, add the intersection to results
5. Move the pointer for the interval that ends earlier (because the later-ending interval might still intersect with the next interval in the other list)

**Why this works:**

- Since lists are sorted, if interval A ends before interval B starts, then A also ends before ALL intervals after B (because they start even later)
- By always advancing the pointer for the earlier-ending interval, we never miss any potential intersections
- This is essentially a "sweep line" approach where we process intervals in order of their start times

## Optimal Solution

<div class="code-group">

```python
# Time: O(m + n) where m = len(firstList), n = len(secondList)
# Space: O(1) extra space (excluding output)
def intervalIntersection(firstList, secondList):
    """
    Find intersections between two sorted, disjoint interval lists.

    Args:
        firstList: List of [start, end] intervals, sorted and disjoint
        secondList: List of [start, end] intervals, sorted and disjoint

    Returns:
        List of intersecting intervals
    """
    result = []
    i, j = 0, 0  # Two pointers for firstList and secondList

    # Process intervals while both pointers are within bounds
    while i < len(firstList) and j < len(secondList):
        # Get current intervals from both lists
        a_start, a_end = firstList[i]
        b_start, b_end = secondList[j]

        # Check if intervals overlap
        # Two intervals overlap if the maximum of their starts is <= minimum of their ends
        overlap_start = max(a_start, b_start)
        overlap_end = min(a_end, b_end)

        # If they overlap (start <= end), add intersection to result
        if overlap_start <= overlap_end:
            result.append([overlap_start, overlap_end])

        # Move pointer for the interval that ends earlier
        # The interval ending later might still intersect with next interval from other list
        if a_end < b_end:
            i += 1  # First interval ends earlier, move to next in firstList
        else:
            j += 1  # Second interval ends earlier (or equal), move to next in secondList

    return result
```

```javascript
// Time: O(m + n) where m = firstList.length, n = secondList.length
// Space: O(1) extra space (excluding output)
function intervalIntersection(firstList, secondList) {
  /**
   * Find intersections between two sorted, disjoint interval lists.
   *
   * @param {number[][]} firstList - Array of [start, end] intervals, sorted and disjoint
   * @param {number[][]} secondList - Array of [start, end] intervals, sorted and disjoint
   * @return {number[][]} Array of intersecting intervals
   */
  const result = [];
  let i = 0,
    j = 0; // Two pointers for firstList and secondList

  // Process intervals while both pointers are within bounds
  while (i < firstList.length && j < secondList.length) {
    // Get current intervals from both lists
    const [aStart, aEnd] = firstList[i];
    const [bStart, bEnd] = secondList[j];

    // Check if intervals overlap
    // Two intervals overlap if the maximum of their starts is <= minimum of their ends
    const overlapStart = Math.max(aStart, bStart);
    const overlapEnd = Math.min(aEnd, bEnd);

    // If they overlap (start <= end), add intersection to result
    if (overlapStart <= overlapEnd) {
      result.push([overlapStart, overlapEnd]);
    }

    // Move pointer for the interval that ends earlier
    // The interval ending later might still intersect with next interval from other list
    if (aEnd < bEnd) {
      i++; // First interval ends earlier, move to next in firstList
    } else {
      j++; // Second interval ends earlier (or equal), move to next in secondList
    }
  }

  return result;
}
```

```java
// Time: O(m + n) where m = firstList.length, n = secondList.length
// Space: O(1) extra space (excluding output)
class Solution {
    public int[][] intervalIntersection(int[][] firstList, int[][] secondList) {
        /**
         * Find intersections between two sorted, disjoint interval lists.
         *
         * @param firstList Array of [start, end] intervals, sorted and disjoint
         * @param secondList Array of [start, end] intervals, sorted and disjoint
         * @return Array of intersecting intervals
         */
        List<int[]> result = new ArrayList<>();
        int i = 0, j = 0;  // Two pointers for firstList and secondList

        // Process intervals while both pointers are within bounds
        while (i < firstList.length && j < secondList.length) {
            // Get current intervals from both lists
            int aStart = firstList[i][0];
            int aEnd = firstList[i][1];
            int bStart = secondList[j][0];
            int bEnd = secondList[j][1];

            // Check if intervals overlap
            // Two intervals overlap if the maximum of their starts is <= minimum of their ends
            int overlapStart = Math.max(aStart, bStart);
            int overlapEnd = Math.min(aEnd, bEnd);

            // If they overlap (start <= end), add intersection to result
            if (overlapStart <= overlapEnd) {
                result.add(new int[]{overlapStart, overlapEnd});
            }

            // Move pointer for the interval that ends earlier
            // The interval ending later might still intersect with next interval from other list
            if (aEnd < bEnd) {
                i++;  // First interval ends earlier, move to next in firstList
            } else {
                j++;  // Second interval ends earlier (or equal), move to next in secondList
            }
        }

        // Convert ArrayList to array for return
        return result.toArray(new int[result.size()][]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m + n)**

- We process each interval at most once
- Each iteration of the while loop advances either `i` or `j` by 1
- In the worst case, we make (m + n - 1) comparisons
- This is optimal because we need to at least look at every interval

**Space Complexity: O(1) extra space (excluding output)**

- We only use a few variables for pointers and temporary calculations
- The output space is O(k) where k is the number of intersections, but this is required for the answer
- Some languages (like Java) need O(k) space to convert ArrayList to array, but this is still output space

## Common Mistakes

1. **Incorrect overlap condition:** Using `a_start <= b_end && b_start <= a_end` is correct, but candidates sometimes forget the equals case for closed intervals. Remember: `[1,2]` and `[2,3]` intersect at `[2,2]` because they're closed intervals.

2. **Wrong pointer advancement logic:** Always advance the pointer for the interval that ends earlier. If you advance the wrong pointer, you might miss intersections. For example, if `[1,5]` and `[2,6]` intersect, and you advance the pointer for `[2,6]` instead of `[1,5]`, you'll miss that `[1,5]` might intersect with the next interval after `[2,6]`.

3. **Forgetting to handle empty lists:** Always check edge cases at the beginning. If either list is empty, there can be no intersections, so return an empty list immediately.

4. **Off-by-one in intersection calculation:** The intersection is `[max(start1, start2), min(end1, end2)]`, not `[min(start1, start2), max(end1, end2)]`. The latter would give you the union's bounding box, not the intersection.

## When You'll See This Pattern

This two-pointer merging pattern appears whenever you have two sorted sequences and need to find relationships between them:

1. **Merge Intervals (LeetCode 56):** Similar merging logic but with one list, requiring sorting first and then merging overlapping intervals.

2. **Merge Sorted Array (LeetCode 88):** The same two-pointer technique for merging two sorted arrays into one.

3. **Employee Free Time (LeetCode 759):** A more complex version where you merge multiple interval lists and find gaps between them.

4. **Intersection of Two Arrays (LeetCode 349):** Finding common elements in sorted arrays uses a similar two-pointer approach.

The pattern is: when inputs are sorted, think about whether you can use pointers to traverse them simultaneously, making decisions at each step about which pointer to advance.

## Key Takeaways

1. **Sorted inputs often enable two-pointer solutions:** When both lists are sorted, you can process them in linear time by advancing pointers based on comparisons between current elements.

2. **Interval intersection formula is fundamental:** `max(start1, start2) ≤ min(end1, end2)` is the key test for interval overlap. The intersection itself is `[max(start1, start2), min(end1, end2)]`.

3. **Advance the earlier-ending interval:** In interval merging problems, always advance the pointer for the interval that ends first, as the later-ending interval might still intersect with the next interval from the other list.

**Related problems:** [Merge Intervals](/problem/merge-intervals), [Merge Sorted Array](/problem/merge-sorted-array), [Employee Free Time](/problem/employee-free-time)
