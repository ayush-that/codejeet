---
title: "How to Solve Insert Interval — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Insert Interval. Medium difficulty, 44.8% acceptance rate. Topics: Array."
date: "2026-06-19"
category: "dsa-patterns"
tags: ["insert-interval", "array", "medium"]
---

# How to Solve Insert Interval

You're given a sorted list of non-overlapping intervals and a new interval to insert. The challenge is to insert the new interval while maintaining the sorted order and merging any overlapping intervals. What makes this problem interesting is that you need to handle three distinct phases: intervals that come before the new interval (no overlap), intervals that overlap with the new interval (need merging), and intervals that come after (no overlap). The key is efficiently identifying which intervals overlap and merging them correctly.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
intervals = [[1,3], [6,9]]
newInterval = [2,5]
```

**Step-by-step process:**

1. **Before overlap phase:** Start at interval [1,3]. Since 3 ≥ 2 (newInterval's start), we have potential overlap. But actually, we need to check if the current interval ends before the new interval starts. Here, 3 ≥ 2, so there's overlap. We'll handle this in the next phase.

2. **Overlap phase:** We encounter [1,3] which overlaps because 3 ≥ 2. We merge by taking `min(1,2) = 1` for the start and `max(3,5) = 5` for the end. Our merged interval becomes [1,5].

3. **Continue checking for more overlaps:** Next interval is [6,9]. Since 6 > 5 (our current merged end), there's no overlap. We've finished merging.

4. **After overlap phase:** Add [6,9] as-is since it comes after.

**Result:** `[[1,5], [6,9]]`

Another example with multiple overlaps:

```
intervals = [[1,2], [3,5], [6,7], [8,10], [12,16]]
newInterval = [4,8]
```

1. **Before:** [1,2] ends at 2, which is < 4 (new start), so no overlap. Add [1,2] directly.
2. **Overlap begins:** [3,5] overlaps (5 ≥ 4). Start merging: min(3,4)=3, max(5,8)=8 → [3,8]
3. **Continue merging:** [6,7] overlaps (6 ≤ 8). Update end: max(7,8)=8 → still [3,8]
4. **Continue merging:** [8,10] overlaps (8 ≤ 8). Update end: max(10,8)=10 → [3,10]
5. **Overlap ends:** [12,16] starts at 12 > 10, no overlap.
6. **After:** Add [12,16]

**Result:** `[[1,2], [3,10], [12,16]]`

## Brute Force Approach

A naive approach would be to simply append the new interval to the list, then run the standard merge intervals algorithm (sort and merge). While this works, it's inefficient because:

1. We're ignoring the fact that the input is already sorted
2. We're doing unnecessary sorting (O(n log n)) when we could process in O(n)
3. We're creating extra data structures when we could build the result directly

Here's what the brute force would look like:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def insert_brute_force(intervals, newInterval):
    # Step 1: Add new interval to the list
    intervals.append(newInterval)

    # Step 2: Sort by start time (O(n log n))
    intervals.sort(key=lambda x: x[0])

    # Step 3: Merge intervals (standard algorithm)
    result = []
    for interval in intervals:
        # If result is empty or no overlap
        if not result or result[-1][1] < interval[0]:
            result.append(interval)
        else:
            # Merge with last interval in result
            result[-1][1] = max(result[-1][1], interval[1])

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function insertBruteForce(intervals, newInterval) {
  // Step 1: Add new interval to the array
  intervals.push(newInterval);

  // Step 2: Sort by start time (O(n log n))
  intervals.sort((a, b) => a[0] - b[0]);

  // Step 3: Merge intervals (standard algorithm)
  const result = [];
  for (const interval of intervals) {
    // If result is empty or no overlap
    if (result.length === 0 || result[result.length - 1][1] < interval[0]) {
      result.push(interval);
    } else {
      // Merge with last interval in result
      result[result.length - 1][1] = Math.max(result[result.length - 1][1], interval[1]);
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int[][] insertBruteForce(int[][] intervals, int[] newInterval) {
    // Step 1: Add new interval to the list
    List<int[]> intervalList = new ArrayList<>(Arrays.asList(intervals));
    intervalList.add(newInterval);

    // Step 2: Sort by start time (O(n log n))
    intervalList.sort((a, b) -> Integer.compare(a[0], b[0]));

    // Step 3: Merge intervals (standard algorithm)
    List<int[]> result = new ArrayList<>();
    for (int[] interval : intervalList) {
        // If result is empty or no overlap
        if (result.isEmpty() || result.get(result.size() - 1)[1] < interval[0]) {
            result.add(interval);
        } else {
            // Merge with last interval in result
            int[] last = result.get(result.size() - 1);
            last[1] = Math.max(last[1], interval[1]);
        }
    }

    return result.toArray(new int[result.size()][]);
}
```

</div>

This solution is suboptimal because we're sorting an already-sorted list (except for one new element). We can do better by leveraging the existing sorted order.

## Optimized Approach

The key insight is that we can process the intervals in **three distinct phases**:

1. **Add all intervals that end before the new interval starts** (no overlap, come before)
2. **Merge all intervals that overlap with the new interval**
3. **Add all intervals that start after the merged interval ends** (no overlap, come after)

The critical observation is that two intervals `[a,b]` and `[c,d]` overlap if and only if `a ≤ d` and `c ≤ b`. But since our intervals are sorted by start time, we can simplify:

- An interval ends before the new one starts if `interval[1] < newInterval[0]`
- An interval starts after the merged one ends if `interval[0] > mergedEnd`

For the merging phase, we continuously update the start (minimum) and end (maximum) until we find an interval that starts after the current merged end.

## Optimal Solution

Here's the optimal O(n) solution that processes intervals in a single pass:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the output
def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)

    # Phase 1: Add all intervals that end before newInterval starts
    # These intervals come completely before newInterval, no overlap
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1

    # Phase 2: Merge all overlapping intervals
    # Initialize merged interval with newInterval
    merged_start, merged_end = newInterval
    # While current interval overlaps with merged interval
    # Overlap condition: interval starts before or at merged_end
    while i < n and intervals[i][0] <= merged_end:
        # Update merged interval boundaries
        merged_start = min(merged_start, intervals[i][0])
        merged_end = max(merged_end, intervals[i][1])
        i += 1
    # Add the merged interval to result
    result.append([merged_start, merged_end])

    # Phase 3: Add all remaining intervals (come after merged interval)
    while i < n:
        result.append(intervals[i])
        i += 1

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the output
function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  const n = intervals.length;

  // Phase 1: Add all intervals that end before newInterval starts
  // These intervals come completely before newInterval, no overlap
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }

  // Phase 2: Merge all overlapping intervals
  // Initialize merged interval with newInterval
  let [mergedStart, mergedEnd] = newInterval;
  // While current interval overlaps with merged interval
  // Overlap condition: interval starts before or at mergedEnd
  while (i < n && intervals[i][0] <= mergedEnd) {
    // Update merged interval boundaries
    mergedStart = Math.min(mergedStart, intervals[i][0]);
    mergedEnd = Math.max(mergedEnd, intervals[i][1]);
    i++;
  }
  // Add the merged interval to result
  result.push([mergedStart, mergedEnd]);

  // Phase 3: Add all remaining intervals (come after merged interval)
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the output
public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0;
    int n = intervals.length;

    // Phase 1: Add all intervals that end before newInterval starts
    // These intervals come completely before newInterval, no overlap
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.add(intervals[i]);
        i++;
    }

    // Phase 2: Merge all overlapping intervals
    // Initialize merged interval with newInterval
    int mergedStart = newInterval[0];
    int mergedEnd = newInterval[1];
    // While current interval overlaps with merged interval
    // Overlap condition: interval starts before or at mergedEnd
    while (i < n && intervals[i][0] <= mergedEnd) {
        // Update merged interval boundaries
        mergedStart = Math.min(mergedStart, intervals[i][0]);
        mergedEnd = Math.max(mergedEnd, intervals[i][1]);
        i++;
    }
    // Add the merged interval to result
    result.add(new int[]{mergedStart, mergedEnd});

    // Phase 3: Add all remaining intervals (come after merged interval)
    while (i < n) {
        result.add(intervals[i]);
        i++;
    }

    return result.toArray(new int[result.size()][]);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the intervals array
- Each interval is processed exactly once (added directly, merged, or skipped)
- The three while loops together process all n intervals

**Space Complexity:** O(n) for the output

- In the worst case, we create a new list containing all intervals (when newInterval doesn't overlap with anything)
- We don't use any additional data structures beyond the result
- If we could modify the input array in-place, we could achieve O(1) extra space, but typically we return a new array

## Common Mistakes

1. **Incorrect overlap condition:** Using `intervals[i][1] >= newInterval[0]` instead of `intervals[i][0] <= mergedEnd` during the merge phase. The latter correctly handles cases where the new interval is completely inside an existing interval.

2. **Forgetting to update merged_end during merging:** When merging multiple intervals, you need to continuously update the end boundary with `max(merged_end, interval[1])`. Otherwise, you might miss extending the merged interval far enough.

3. **Off-by-one with overlap checking:** The condition for overlap is `interval[0] <= mergedEnd`, not `interval[0] < mergedEnd`. If an interval starts exactly at the merged end, they should be merged (e.g., [1,2] and [2,3] become [1,3]).

4. **Not handling empty intervals array:** The solution should work when `intervals` is empty. Our solution handles this correctly because the first while loop will immediately exit, and we'll add the newInterval as the only interval.

5. **Modifying the input array:** Some candidates try to modify the input array in-place, which can cause issues if the input shouldn't be modified. Always clarify with the interviewer whether you can modify the input.

## When You'll See This Pattern

This "three-phase processing" pattern appears in many interval problems:

1. **Merge Intervals (LeetCode 56)** - Similar merging logic but without the three-phase structure since all intervals need checking
2. **Meeting Rooms II (LeetCode 253)** - Uses a similar approach of processing interval boundaries in sorted order
3. **Non-overlapping Intervals (LeetCode 435)** - Requires identifying and removing overlapping intervals
4. **Range Module (LeetCode 715)** - A more complex version with add/remove/query operations on intervals

The core pattern is: when dealing with sorted intervals, you can often process them in phases based on their relationship to a target (before/overlapping/after).

## Key Takeaways

1. **Leverage sorted order:** When intervals are sorted by start time, you can process them linearly without backtracking. This is the key to achieving O(n) time.

2. **Three-phase processing:** For insertion problems, think in terms of: 1) intervals before (no overlap), 2) intervals that overlap (need merging), 3) intervals after (no overlap). This mental model simplifies the logic.

3. **Careful with boundary conditions:** Interval overlap checking has subtle edge cases (touching intervals, complete containment). Always test with: intervals that touch at endpoints, new interval completely inside an existing one, and new interval that spans multiple existing intervals.

4. **Update both start and end during merge:** When merging, remember to update both the minimum start and maximum end. It's easy to forget that earlier intervals might have a smaller start than your newInterval.

Related problems: [Merge Intervals](/problem/merge-intervals), [Range Module](/problem/range-module), [Count Integers in Intervals](/problem/count-integers-in-intervals)
