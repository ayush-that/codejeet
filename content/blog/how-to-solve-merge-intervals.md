---
title: "How to Solve Merge Intervals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Merge Intervals. Medium difficulty, 51.2% acceptance rate. Topics: Array, Sorting."
date: "2026-03-08"
category: "dsa-patterns"
tags: ["merge-intervals", "array", "sorting", "medium"]
---

# How to Solve Merge Intervals

The Merge Intervals problem asks us to combine overlapping intervals into single, non-overlapping intervals. Given a list of intervals where each interval is represented as [start, end], we need to return a new list where any intervals that overlap are merged together. What makes this problem interesting is that the intervals can appear in any order, and the key insight involves sorting them first to make the merging process straightforward.

## Visual Walkthrough

Let's walk through an example step by step to build intuition. Consider the input intervals: `[[1,3], [2,6], [8,10], [15,18]]`

**Step 1: Sort the intervals by start time**
After sorting, we get: `[[1,3], [2,6], [8,10], [15,18]]` (they're already sorted in this case)

**Step 2: Initialize with the first interval**
We start with `result = [[1,3]]` and consider this our "current" interval

**Step 3: Compare second interval [2,6] with current [1,3]**

- Does [2,6] overlap with [1,3]? Yes, because 2 ≤ 3 (the start of the second interval is less than or equal to the end of the current interval)
- Since they overlap, we merge them by taking the minimum start (1) and maximum end (6)
- Update current interval in result to [1,6]
- Result becomes: `[[1,6]]`

**Step 4: Compare third interval [8,10] with current [1,6]**

- Does [8,10] overlap with [1,6]? No, because 8 > 6
- Since they don't overlap, we add [8,10] as a new interval
- Result becomes: `[[1,6], [8,10]]`
- Current interval is now [8,10]

**Step 5: Compare fourth interval [15,18] with current [8,10]**

- Does [15,18] overlap with [8,10]? No, because 15 > 10
- Add [15,18] as a new interval
- Final result: `[[1,6], [8,10], [15,18]]`

The key insight here is that after sorting by start time, we only need to compare each interval with the most recently added interval in our result, since all previous intervals are guaranteed not to overlap with the current one.

## Brute Force Approach

A naive approach would be to compare every interval with every other interval to check for overlaps. For each interval i, we would:

1. Check if it overlaps with any interval j (where j ≠ i)
2. If an overlap is found, merge intervals i and j
3. Remove the original intervals and add the merged one
4. Repeat until no more merges are possible

The problem with this approach is its time complexity: O(n³) in the worst case. Why? Because:

- We have O(n²) pairs to compare
- Each merge operation might require shifting elements in the array (O(n))
- We might need multiple passes through the data

Additionally, this approach is complex to implement correctly because after merging two intervals, we need to check if the new merged interval overlaps with other intervals we've already checked.

Here's what the brute force might look like conceptually (though we won't implement it fully since it's inefficient):

```python
def merge_intervals_brute(intervals):
    # This would involve nested loops checking all pairs
    # and repeatedly scanning the array until no merges occur
    # Complexity: O(n³) time, O(n) space
    pass
```

The brute force approach quickly becomes impractical for larger inputs (n > 100), which is why we need a more efficient solution.

## Optimized Approach

The key insight that leads to an optimal solution is: **If we sort intervals by their start time, then overlapping intervals will be adjacent in the sorted list.**

Once sorted, we can process intervals in a single pass:

1. Start with the first interval as our "current" interval
2. For each subsequent interval:
   - If it overlaps with the current interval (its start ≤ current end), merge them by updating the current end to be the maximum of both ends
   - If it doesn't overlap, add the current interval to the result and start a new current interval

This works because after sorting:

- All intervals that could potentially overlap with a given interval will appear after it (or be merged into it)
- We never need to look back at previous intervals once we've passed them

The sorting step is O(n log n), and the single pass is O(n), giving us an overall O(n log n) solution.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) - sorting dominates, then linear pass
# Space: O(n) - for storing the result (or O(log n) for sorting space in Python)
def merge(intervals):
    # Edge case: if there are 0 or 1 intervals, nothing to merge
    if len(intervals) <= 1:
        return intervals

    # Step 1: Sort intervals by their start time
    # This ensures overlapping intervals will be adjacent
    intervals.sort(key=lambda x: x[0])

    # Step 2: Initialize result with the first interval
    result = []
    current_interval = intervals[0]

    # Step 3: Iterate through remaining intervals
    for i in range(1, len(intervals)):
        next_interval = intervals[i]

        # Check if current interval overlaps with next interval
        # Overlap occurs when next interval starts before or at current interval ends
        if next_interval[0] <= current_interval[1]:
            # Merge intervals by taking the maximum end time
            # We don't need to update start because we sorted by start,
            # so current_interval[0] is already the smallest
            current_interval[1] = max(current_interval[1], next_interval[1])
        else:
            # No overlap, add current interval to result
            result.append(current_interval)
            # Start a new current interval
            current_interval = next_interval

    # Step 4: Don't forget to add the last interval
    result.append(current_interval)

    return result
```

```javascript
// Time: O(n log n) - sorting dominates, then linear pass
// Space: O(n) - for storing the result (or O(log n) for sorting space)
function merge(intervals) {
  // Edge case: if there are 0 or 1 intervals, nothing to merge
  if (intervals.length <= 1) {
    return intervals;
  }

  // Step 1: Sort intervals by their start time
  // This ensures overlapping intervals will be adjacent
  intervals.sort((a, b) => a[0] - b[0]);

  // Step 2: Initialize result with the first interval
  const result = [];
  let currentInterval = intervals[0];

  // Step 3: Iterate through remaining intervals
  for (let i = 1; i < intervals.length; i++) {
    const nextInterval = intervals[i];

    // Check if current interval overlaps with next interval
    // Overlap occurs when next interval starts before or at current interval ends
    if (nextInterval[0] <= currentInterval[1]) {
      // Merge intervals by taking the maximum end time
      // We don't need to update start because we sorted by start,
      // so currentInterval[0] is already the smallest
      currentInterval[1] = Math.max(currentInterval[1], nextInterval[1]);
    } else {
      // No overlap, add current interval to result
      result.push(currentInterval);
      // Start a new current interval
      currentInterval = nextInterval;
    }
  }

  // Step 4: Don't forget to add the last interval
  result.push(currentInterval);

  return result;
}
```

```java
// Time: O(n log n) - sorting dominates, then linear pass
// Space: O(n) - for storing the result (or O(log n) for sorting space)
public int[][] merge(int[][] intervals) {
    // Edge case: if there are 0 or 1 intervals, nothing to merge
    if (intervals.length <= 1) {
        return intervals;
    }

    // Step 1: Sort intervals by their start time
    // This ensures overlapping intervals will be adjacent
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 2: Use a list to store results dynamically
    List<int[]> result = new ArrayList<>();
    int[] currentInterval = intervals[0];

    // Step 3: Iterate through remaining intervals
    for (int i = 1; i < intervals.length; i++) {
        int[] nextInterval = intervals[i];

        // Check if current interval overlaps with next interval
        // Overlap occurs when next interval starts before or at current interval ends
        if (nextInterval[0] <= currentInterval[1]) {
            // Merge intervals by taking the maximum end time
            // We don't need to update start because we sorted by start,
            // so currentInterval[0] is already the smallest
            currentInterval[1] = Math.max(currentInterval[1], nextInterval[1]);
        } else {
            // No overlap, add current interval to result
            result.add(currentInterval);
            // Start a new current interval
            currentInterval = nextInterval;
        }
    }

    // Step 4: Don't forget to add the last interval
    result.add(currentInterval);

    // Convert List to array for return
    return result.toArray(new int[result.size()][]);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the intervals takes O(n log n) time, where n is the number of intervals
- The single pass through the sorted intervals takes O(n) time
- The dominant term is O(n log n), so that's our overall time complexity

**Space Complexity: O(n) or O(log n)**

- We need O(n) space to store the result (in the worst case, when no intervals overlap)
- The sorting algorithm may use additional space:
  - Python's Timsort uses O(n) space in worst case, but O(log n) on average
  - JavaScript's sort implementation varies by browser but typically uses O(log n) space
  - Java's Arrays.sort() uses O(log n) space for the sorting algorithm
- If we consider only auxiliary space (not including output), it's O(log n) for the sorting algorithm

## Common Mistakes

1. **Forgetting to sort the intervals first**: This is the most common mistake. Without sorting, you'll miss overlaps where intervals aren't adjacent in the original order. For example, `[[1,4], [0,4]]` would fail to merge if not sorted first.

2. **Incorrect overlap condition**: Some candidates check `next_start < current_end` instead of `next_start ≤ current_end`. Remember that `[1,2]` and `[2,3]` DO overlap because they touch at point 2. The problem states "overlapping" which typically includes intervals that just touch.

3. **Not updating the end correctly when merging**: When merging `[1,5]` and `[2,10]`, the end should be `max(5,10) = 10`, not just the end of the second interval. Some candidates mistakenly take the second interval's end without comparing.

4. **Forgetting to add the last interval**: After the loop ends, the last current interval hasn't been added to the result. This leads to missing the final interval in the output.

5. **Modifying the input array directly**: While not technically wrong, it's better practice to create a new result array rather than modifying the input, unless the problem specifically allows it.

## When You'll See This Pattern

The "merge intervals" pattern appears in many scheduling and range-related problems:

1. **Insert Interval (LeetCode 57)**: Given a set of non-overlapping intervals and a new interval, insert it while maintaining the non-overlapping property. This uses the same sorted intervals approach but with special handling for insertion.

2. **Meeting Rooms (LeetCode 252)**: Determine if a person could attend all meetings (no overlaps). This is essentially checking if intervals can be merged into a single set without overlaps.

3. **Meeting Rooms II (LeetCode 253)**: Find the minimum number of conference rooms required given meeting intervals. This uses a different approach (min-heap) but builds on understanding interval overlaps.

4. **Non-overlapping Intervals (LeetCode 435)**: Find the minimum number of intervals to remove to make the rest non-overlapping. This uses similar sorting and comparison logic.

5. **Employee Free Time (LeetCode 759)**: Find common free time between employees' busy intervals. This requires merging intervals first, then finding gaps between them.

## Key Takeaways

1. **Sorting is key**: When dealing with intervals, sorting by start time (or sometimes end time) transforms the problem into a tractable linear scan. This pattern appears in many interval problems.

2. **Overlap condition**: Two intervals [a,b] and [c,d] overlap if `c ≤ b` (when sorted by start time). The merging creates a new interval `[a, max(b,d)]`.

3. **Single pass after sorting**: Once sorted, you only need to compare each interval with the previous one (or the last one in the result), not with all other intervals. This reduces complexity from O(n²) to O(n log n).

4. **Edge cases matter**: Always test with empty input, single interval, completely non-overlapping intervals, and intervals that just touch (e.g., `[1,2]` and `[2,3]`).

Related problems: [Insert Interval](/problem/insert-interval), [Meeting Rooms](/problem/meeting-rooms), [Meeting Rooms II](/problem/meeting-rooms-ii)
