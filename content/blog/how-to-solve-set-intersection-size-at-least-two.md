---
title: "How to Solve Set Intersection Size At Least Two — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Set Intersection Size At Least Two. Hard difficulty, 57.9% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-07-17"
category: "dsa-patterns"
tags: ["set-intersection-size-at-least-two", "array", "greedy", "sorting", "hard"]
---

# How to Solve Set Intersection Size At Least Two

This problem asks us to find the smallest possible set of integers that contains at least two numbers from every given interval. What makes this tricky is that we need to satisfy multiple overlapping constraints simultaneously—each interval must have at least two of our chosen numbers, but we want to minimize the total count. The intervals can overlap in complex ways, so we need a systematic way to decide which numbers to pick.

## Visual Walkthrough

Let's trace through a concrete example: `intervals = [[1,3], [1,4], [2,5], [3,5]]`

We need to pick numbers so each interval contains at least two of them. Let's sort intervals by their end points (and if ties, by start points in descending order—we'll see why soon):

Sorted: `[[1,3], [1,4], [3,5], [2,5]]`  
(Actually, for our algorithm we'll sort by end ascending, then start descending: `[[1,3], [1,4], [3,5], [2,5]]`)

Now we process each interval, maintaining the two largest numbers we've picked so far (call them `last` and `second_last`):

1. **Interval [1,3]**: We haven't picked any numbers yet. To minimize future picks, we should pick the two largest numbers in this interval: 3 and 2.  
   Picked: {2, 3}  
   `last = 3`, `second_last = 2`

2. **Interval [1,4]**: Check how many of our picked numbers fall in [1,4]:
   - 3 ∈ [1,4] ✓
   - 2 ∈ [1,4] ✓  
     Already has 2 numbers covered! No new picks needed.

3. **Interval [3,5]**: Check picked numbers in [3,5]:
   - 3 ∈ [3,5] ✓
   - 2 ∉ [3,5] ✗  
     Only 1 number covered. We need to add at least 1 more number from this interval. To help future intervals, pick the largest possible: 5.  
     Picked: {2, 3, 5}  
     `last = 5`, `second_last = 3`

4. **Interval [2,5]**: Check picked numbers in [2,5]:
   - 5 ∈ [2,5] ✓
   - 3 ∈ [2,5] ✓  
     Already covered! Final answer: 3 numbers.

This greedy approach works because by always picking the largest available numbers when we need to add to an interval, we maximize the chance these numbers will also cover later intervals.

## Brute Force Approach

A brute force approach would try all possible subsets of numbers from the union of all intervals. The search space is enormous: if intervals span from min start to max end, there could be up to 10^4 numbers (constraints say start/end ≤ 10^4), giving 2^10000 subsets—completely infeasible.

Even a smarter brute force that only considers numbers appearing in intervals would still be exponential. The key insight is that we don't need to consider all subsets; we can make locally optimal choices that lead to a globally optimal solution.

## Optimized Approach

The optimal solution uses a **greedy algorithm with sorting**:

1. **Sort intervals** by end ascending, and if ends are equal, by start descending. Why?
   - Sorting by end ensures we process intervals in order of their right boundaries
   - When ends are equal, putting intervals with larger starts first ensures we handle the "tighter" intervals first

2. **Maintain two variables** tracking the last two numbers we've picked (`last` and `second_last`)

3. **Process each interval**:
   - If the interval already contains both `last` and `second_last`, we're done with it
   - If it contains only one of them, we need to add one number. Add the interval's end (largest possible) to maximize overlap with future intervals
   - If it contains neither, we need to add two numbers. Add `end` and `end-1` (two largest in the interval)

This works because:

- By always picking the largest numbers when we need to add to an interval, we maximize the chance these numbers will appear in later intervals
- The sorting ensures that when we process an interval, all intervals ending earlier have already been satisfied
- This is a classic "interval covering" greedy pattern where sorting by end point leads to optimal solutions

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for processing → O(n log n)
# Space: O(1) excluding input storage, O(log n) for sorting space
def intersectionSizeTwo(intervals):
    """
    Find the smallest set of integers where each interval contains at least two numbers from the set.

    Args:
        intervals: List of [start, end] intervals (inclusive)

    Returns:
        Minimum size of the containing set
    """
    # Step 1: Sort intervals by end ascending, then by start descending
    # This ensures we process intervals in order of their right boundaries,
    # and when ends are equal, we handle intervals with larger starts first
    intervals.sort(key=lambda x: (x[1], -x[0]))

    # Step 2: Initialize tracking variables
    # We'll track the last two numbers we've added to our set
    last = -1      # Largest number in our set
    second_last = -1  # Second largest number in our set
    result = 0     # Size of our set

    # Step 3: Process each interval
    for start, end in intervals:
        # Case 1: Interval already has at least two numbers from our set
        # Both last and second_last are within the interval
        if start <= second_last:
            # Already satisfied, no action needed
            continue

        # Case 2: Interval has exactly one number from our set
        # second_last is outside but last is inside
        elif start <= last:
            # We need to add one more number to this interval
            # To maximize overlap with future intervals, add the largest possible: end
            result += 1
            # Update tracking: new last is end, new second_last is old last
            second_last = last
            last = end

        # Case 3: Interval has no numbers from our set
        else:
            # We need to add two numbers to this interval
            # Add the two largest numbers: end and end-1
            result += 2
            # Update tracking
            second_last = end - 1
            last = end

    return result
```

```javascript
// Time: O(n log n) for sorting, O(n) for processing → O(n log n)
// Space: O(1) excluding input storage, O(log n) for sorting space
function intersectionSizeTwo(intervals) {
  /**
   * Find the smallest set of integers where each interval contains at least two numbers from the set.
   *
   * @param {number[][]} intervals - Array of [start, end] intervals (inclusive)
   * @return {number} Minimum size of the containing set
   */
  // Step 1: Sort intervals by end ascending, then by start descending
  intervals.sort((a, b) => {
    if (a[1] !== b[1]) {
      return a[1] - b[1]; // Sort by end ascending
    }
    return b[0] - a[0]; // If ends equal, sort by start descending
  });

  // Step 2: Initialize tracking variables
  let last = -1; // Largest number in our set
  let secondLast = -1; // Second largest number in our set
  let result = 0; // Size of our set

  // Step 3: Process each interval
  for (const [start, end] of intervals) {
    // Case 1: Interval already has at least two numbers from our set
    if (start <= secondLast) {
      // Already satisfied, continue to next interval
      continue;
    }

    // Case 2: Interval has exactly one number from our set
    if (start <= last) {
      // Need to add one more number
      // Add the largest possible (end) to maximize future overlap
      result += 1;
      // Update tracking variables
      secondLast = last;
      last = end;
    }

    // Case 3: Interval has no numbers from our set
    else {
      // Need to add two numbers
      // Add the two largest: end and end-1
      result += 2;
      // Update tracking variables
      secondLast = end - 1;
      last = end;
    }
  }

  return result;
}
```

```java
// Time: O(n log n) for sorting, O(n) for processing → O(n log n)
// Space: O(1) excluding input storage, O(log n) for sorting space
import java.util.Arrays;

class Solution {
    public int intersectionSizeTwo(int[][] intervals) {
        /**
         * Find the smallest set of integers where each interval contains at least two numbers from the set.
         *
         * @param intervals: Array of [start, end] intervals (inclusive)
         * @return Minimum size of the containing set
         */
        // Step 1: Sort intervals by end ascending, then by start descending
        Arrays.sort(intervals, (a, b) -> {
            if (a[1] != b[1]) {
                return a[1] - b[1];  // Sort by end ascending
            }
            return b[0] - a[0];      // If ends equal, sort by start descending
        });

        // Step 2: Initialize tracking variables
        int last = -1;        // Largest number in our set
        int secondLast = -1;  // Second largest number in our set
        int result = 0;       // Size of our set

        // Step 3: Process each interval
        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];

            // Case 1: Interval already has at least two numbers from our set
            if (start <= secondLast) {
                // Already satisfied, continue to next interval
                continue;
            }

            // Case 2: Interval has exactly one number from our set
            if (start <= last) {
                // Need to add one more number
                // Add the largest possible (end) to maximize future overlap
                result += 1;
                // Update tracking variables
                secondLast = last;
                last = end;
            }

            // Case 3: Interval has no numbers from our set
            else {
                // Need to add two numbers
                // Add the two largest: end and end-1
                result += 2;
                // Update tracking variables
                secondLast = end - 1;
                last = end;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the intervals takes O(n log n) time
- Processing each interval after sorting takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(log n)** (or O(1) excluding input and sorting overhead)

- The algorithm itself uses only O(1) extra space for tracking variables
- However, the sorting algorithm typically uses O(log n) space for the call stack (in languages like Python/Java)
- If we count the input as given, we don't need additional O(n) storage

## Common Mistakes

1. **Wrong sorting order**: Sorting by start instead of end, or not handling equal ends properly. This breaks the greedy logic because we might pick numbers that don't optimally cover later intervals. Always sort by end ascending, and for equal ends, by start descending.

2. **Incorrect boundary checks**: Using `<` instead of `<=` when checking if numbers fall within intervals. Remember intervals are inclusive: [start, end] includes both endpoints. The condition should be `start <= second_last` not `start < second_last`.

3. **Forgetting to update both tracking variables**: When adding one number, you must update both `last` and `second_last`. A common error is only updating `last` and leaving `second_last` unchanged, which causes incorrect checks for subsequent intervals.

4. **Adding wrong numbers when interval is empty**: When an interval has no numbers from our set, we should add `end` and `end-1` (the two largest), not `start` and `start+1`. Adding the largest numbers maximizes overlap with future intervals.

## When You'll See This Pattern

This "greedy interval covering" pattern appears in several LeetCode problems:

1. **Non-overlapping Intervals (LC 435)**: Similar sorting by end, then greedily removing overlapping intervals. Both problems use the insight that sorting by end point helps make optimal local decisions.

2. **Minimum Number of Arrows to Burst Balloons (LC 452)**: Almost identical pattern—sort by end, then track the last "arrow position" and count when a balloon starts after that position.

3. **Video Stitching (LC 1024)**: Another interval covering problem where you sort intervals and greedily extend coverage.

The core pattern: When you need to cover intervals with minimum points/arrows/numbers, sort by end point and use a greedy approach to extend coverage as far as possible with each addition.

## Key Takeaways

1. **Greedy + sorting by end point** is a powerful pattern for interval covering problems. The end point gives you information about how far an interval extends, allowing you to make choices that maximize future coverage.

2. **Track the last elements added** rather than maintaining the entire set. For this "at least two" variant, we only need to know the two largest numbers chosen so far, not the complete set.

3. **Handle equal ends carefully**. When intervals have the same end point, process those with larger starts first—they're "tighter" constraints that need more specific numbers.

[Practice this problem on CodeJeet](/problem/set-intersection-size-at-least-two)
