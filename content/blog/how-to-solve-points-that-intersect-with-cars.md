---
title: "How to Solve Points That Intersect With Cars — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Points That Intersect With Cars. Easy difficulty, 73.4% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2027-12-24"
category: "dsa-patterns"
tags: ["points-that-intersect-with-cars", "array", "hash-table", "prefix-sum", "easy"]
---

# How to Solve Points That Intersect With Cars

You're given a list of intervals representing car positions on a number line, where each car occupies all integer points from its start to end inclusive. The task is to count how many unique integer points are covered by at least one car. This problem is interesting because it looks like a simple counting problem, but the intervals can overlap, and we need to avoid double-counting points that are covered by multiple cars.

## Visual Walkthrough

Let's trace through an example: `nums = [[3,6], [1,5], [4,8]]`

We need to find all integer points covered by these intervals:

- Car 1: [3,6] → points {3,4,5,6}
- Car 2: [1,5] → points {1,2,3,4,5}
- Car 3: [4,8] → points {4,5,6,7,8}

If we combine all points: {1,2,3,4,5,6,7,8}

That's 8 unique points. But how do we compute this efficiently without actually enumerating every point?

The key insight: When intervals overlap, they form continuous segments. We can:

1. Sort intervals by their start points
2. Merge overlapping intervals
3. Sum the lengths of the merged intervals

Let's walk through merging:

- Start with sorted intervals: [[1,5], [3,6], [4,8]]
- First interval [1,5]
- Next interval [3,6] overlaps with [1,5] (since 3 ≤ 5) → merge to [1,6]
- Next interval [4,8] overlaps with [1,6] (since 4 ≤ 6) → merge to [1,8]
- Total points = (8 - 1 + 1) = 8

## Brute Force Approach

A naive approach would be to:

1. Create a set to store all points
2. For each car, add every integer from start to end to the set
3. Return the size of the set

This works but is inefficient. If a car covers a large range (say [1, 100000]), we'd add 100,000 points to the set. With many cars covering large ranges, this becomes O(n × m) where n is number of cars and m is average interval length, which could be huge.

<div class="code-group">

```python
# Time: O(n * m) where m is average interval length | Space: O(n * m)
def numberOfPoints(nums):
    points = set()
    for start, end in nums:
        # Add every point from start to end inclusive
        for point in range(start, end + 1):
            points.add(point)
    return len(points)
```

```javascript
// Time: O(n * m) where m is average interval length | Space: O(n * m)
function numberOfPoints(nums) {
  const points = new Set();
  for (const [start, end] of nums) {
    // Add every point from start to end inclusive
    for (let point = start; point <= end; point++) {
      points.add(point);
    }
  }
  return points.size;
}
```

```java
// Time: O(n * m) where m is average interval length | Space: O(n * m)
public int numberOfPoints(List<List<Integer>> nums) {
    Set<Integer> points = new HashSet<>();
    for (List<Integer> car : nums) {
        int start = car.get(0);
        int end = car.get(1);
        // Add every point from start to end inclusive
        for (int point = start; point <= end; point++) {
            points.add(point);
        }
    }
    return points.size();
}
```

</div>

The brute force is too slow because interval lengths can be large (up to 1000 in constraints, but conceptually could be much larger). We need an approach that doesn't depend on interval length.

## Optimal Solution

The optimal solution uses interval merging:

1. Sort intervals by start point
2. Initialize with first interval
3. Iterate through remaining intervals:
   - If current interval overlaps with the last merged interval, merge them
   - Otherwise, add current interval as a new merged interval
4. Sum the lengths of all merged intervals

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for storing merged intervals
def numberOfPoints(nums):
    # Step 1: Sort intervals by their start point
    # If two intervals have same start, sort by end (not strictly needed but clean)
    nums.sort(key=lambda x: x[0])

    # Step 2: Initialize merged intervals list with first interval
    merged = [nums[0]]

    # Step 3: Iterate through remaining intervals
    for start, end in nums[1:]:
        # Get the last merged interval
        last_start, last_end = merged[-1]

        # Check if current interval overlaps with last merged interval
        # Overlap occurs if current start <= last end
        if start <= last_end:
            # Merge by updating the end of the last merged interval
            # Take the maximum end point to cover both intervals
            merged[-1] = [last_start, max(last_end, end)]
        else:
            # No overlap, add as a new merged interval
            merged.append([start, end])

    # Step 4: Calculate total points covered
    total_points = 0
    for start, end in merged:
        # Add 1 because both start and end are inclusive
        total_points += (end - start + 1)

    return total_points
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for storing merged intervals
function numberOfPoints(nums) {
  // Step 1: Sort intervals by their start point
  // If two intervals have same start, sort by end (not strictly needed but clean)
  nums.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  // Step 2: Initialize merged intervals array with first interval
  const merged = [nums[0]];

  // Step 3: Iterate through remaining intervals
  for (let i = 1; i < nums.length; i++) {
    const [start, end] = nums[i];
    // Get the last merged interval
    const lastMerged = merged[merged.length - 1];
    const lastEnd = lastMerged[1];

    // Check if current interval overlaps with last merged interval
    // Overlap occurs if current start <= last end
    if (start <= lastEnd) {
      // Merge by updating the end of the last merged interval
      // Take the maximum end point to cover both intervals
      lastMerged[1] = Math.max(lastEnd, end);
    } else {
      // No overlap, add as a new merged interval
      merged.push([start, end]);
    }
  }

  // Step 4: Calculate total points covered
  let totalPoints = 0;
  for (const [start, end] of merged) {
    // Add 1 because both start and end are inclusive
    totalPoints += end - start + 1;
  }

  return totalPoints;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for storing merged intervals
public int numberOfPoints(List<List<Integer>> nums) {
    // Step 1: Sort intervals by their start point
    // If two intervals have same start, sort by end (not strictly needed but clean)
    nums.sort((a, b) -> {
        int startCompare = a.get(0).compareTo(b.get(0));
        if (startCompare != 0) return startCompare;
        return a.get(1).compareTo(b.get(1));
    });

    // Step 2: Initialize merged intervals list with first interval
    List<List<Integer>> merged = new ArrayList<>();
    merged.add(new ArrayList<>(nums.get(0)));

    // Step 3: Iterate through remaining intervals
    for (int i = 1; i < nums.size(); i++) {
        int start = nums.get(i).get(0);
        int end = nums.get(i).get(1);

        // Get the last merged interval
        List<Integer> lastMerged = merged.get(merged.size() - 1);
        int lastEnd = lastMerged.get(1);

        // Check if current interval overlaps with last merged interval
        // Overlap occurs if current start <= last end
        if (start <= lastEnd) {
            // Merge by updating the end of the last merged interval
            // Take the maximum end point to cover both intervals
            lastMerged.set(1, Math.max(lastEnd, end));
        } else {
            // No overlap, add as a new merged interval
            List<Integer> newInterval = new ArrayList<>();
            newInterval.add(start);
            newInterval.add(end);
            merged.add(newInterval);
        }
    }

    // Step 4: Calculate total points covered
    int totalPoints = 0;
    for (List<Integer> interval : merged) {
        int start = interval.get(0);
        int end = interval.get(1);
        // Add 1 because both start and end are inclusive
        totalPoints += (end - start + 1);
    }

    return totalPoints;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the intervals takes O(n log n) time
- Merging intervals takes O(n) time (single pass through sorted intervals)
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity:** O(n)

- In the worst case when no intervals overlap, we store all n intervals in the merged list
- Sorting may use O(log n) space for the sort algorithm's stack space (in Python's Timsort, Java's Arrays.sort)
- Total: O(n) for storing merged intervals

## Common Mistakes

1. **Forgetting to sort intervals first**: Without sorting, you can't efficiently merge intervals. If you try to merge unsorted intervals, you might miss overlaps that occur out of order.

2. **Off-by-one errors in point counting**: Remember that both start and end points are inclusive. The formula for points covered is `(end - start + 1)`, not `(end - start)`.

3. **Incorrect overlap condition**: The correct condition is `current_start <= last_end` (not `<`). If a car starts exactly where another ends, they're touching but not overlapping in terms of points covered. However, since we're counting integer points and both ends are inclusive, `[1,3]` and `[3,5]` both include point 3, so they should merge to `[1,5]`.

4. **Not updating end point correctly when merging**: When merging `[1,5]` and `[3,8]`, the merged interval should be `[1,8]` (max of 5 and 8), not `[1,5]` or `[1,3]`.

## When You'll See This Pattern

This interval merging pattern appears in many problems:

1. **Merge Intervals (LeetCode 56)**: Almost identical pattern - merge overlapping intervals and return the merged list.

2. **Meeting Rooms (LeetCode 252)**: Check if a person can attend all meetings (no overlaps). Similar logic but just checking for any overlap rather than merging.

3. **Meeting Rooms II (LeetCode 253)**: Find minimum number of rooms needed for all meetings. Uses a different approach (sweep line) but deals with the same interval concepts.

4. **Non-overlapping Intervals (LeetCode 435)**: Find minimum intervals to remove to make all intervals non-overlapping. Uses similar sorting and comparison logic.

## Key Takeaways

1. **When you see intervals and need to handle overlaps, think sorting first**: Sorting by start time (or end time depending on the problem) is almost always the first step for interval problems.

2. **The merge condition is simple but precise**: Two intervals `[a,b]` and `[c,d]` overlap if `c <= b` (when sorted by start). The merged interval becomes `[a, max(b,d)]`.

3. **Interval problems often reduce to careful comparison logic**: Pay close attention to whether endpoints are inclusive or exclusive, and whether touching intervals should be merged.

Related problems: [Merge Intervals](/problem/merge-intervals), [Meeting Rooms](/problem/meeting-rooms), [Meeting Rooms II](/problem/meeting-rooms-ii)
