---
title: "How to Solve Count Integers in Intervals — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Integers in Intervals. Hard difficulty, 35.7% acceptance rate. Topics: Design, Segment Tree, Ordered Set."
date: "2029-05-30"
category: "dsa-patterns"
tags: ["count-integers-in-intervals", "design", "segment-tree", "ordered-set", "hard"]
---

# How to Solve Count Integers in Intervals

You need to design a data structure that maintains a set of intervals and can efficiently add new intervals while keeping track of how many unique integers are covered by at least one interval. The challenge is that intervals can overlap, merge, and be added in any order, so you need a way to maintain disjoint intervals while supporting fast insertion and counting operations. This problem is tricky because naive approaches become too slow when handling many operations, requiring clever data structure choices.

## Visual Walkthrough

Let's trace through an example to build intuition. We'll start with an empty `CountIntervals` and perform these operations:

1. `add(2, 5)` - Add interval [2, 5]
2. `count()` - Should return 4 (integers 2, 3, 4, 5)
3. `add(7, 10)` - Add interval [7, 10]
4. `count()` - Should return 8 (4 from first interval + 4 from second)
5. `add(3, 8)` - This overlaps with both existing intervals
6. `count()` - Should return 9 (integers 2 through 10)

Here's what happens step by step:

**Step 1:** `add(2, 5)` adds the interval [2, 5]. Our disjoint intervals become: [[2, 5]]
**Step 2:** `count()` counts 4 integers (5 - 2 + 1 = 4)

**Step 3:** `add(7, 10)` adds [7, 10], which doesn't overlap with [2, 5]. Our intervals: [[2, 5], [7, 10]]
**Step 4:** `count()` counts 4 + 4 = 8 integers

**Step 5:** `add(3, 8)` is the interesting case. This interval:

- Overlaps with [2, 5] (from 3 to 5)
- Overlaps with [7, 10] (from 7 to 8)

We need to merge all overlapping intervals into one: [2, 10]
**Step 6:** `count()` now counts 9 integers (10 - 2 + 1 = 9)

The key insight is that we need to efficiently find overlapping intervals and merge them when adding new intervals.

## Brute Force Approach

A naive approach would store all intervals in a list. When adding a new interval:

1. Add it to the list
2. Sort the list by start time
3. Merge overlapping intervals (like in Merge Intervals problem)
4. Recalculate the total count by summing lengths of all intervals

The `count()` operation would be O(1) if we maintain a running total, but `add()` would be O(n log n) due to sorting each time.

Here's what the brute force might look like:

```python
class CountIntervals:
    def __init__(self):
        self.intervals = []
        self.total = 0

    def add(self, left, right):
        # Add the new interval
        self.intervals.append([left, right])

        # Sort by start time
        self.intervals.sort()

        # Merge intervals
        merged = []
        for interval in self.intervals:
            if not merged or merged[-1][1] < interval[0]:
                merged.append(interval)
            else:
                merged[-1][1] = max(merged[-1][1], interval[1])

        self.intervals = merged

        # Recalculate total
        self.total = 0
        for l, r in self.intervals:
            self.total += r - l + 1

    def count(self):
        return self.total
```

**Why this is inefficient:** Each `add()` operation takes O(n log n) time where n is the number of intervals. In the worst case with many `add()` calls, this becomes O(k² log k) for k operations, which is too slow for large inputs.

## Optimized Approach

The key insight is that we need to efficiently:

1. Find intervals that overlap with a new interval
2. Merge overlapping intervals
3. Update the total count without recalculating from scratch

We can use a **sorted data structure** (like TreeMap in Java, SortedDict in Python, or custom implementation) to store intervals sorted by their start values. When adding a new interval [left, right]:

1. Find the first interval that ends at or after `left` (could overlap)
2. Iterate forward while intervals overlap with [left, right]
3. For each overlapping interval:
   - Remove it from our structure
   - Subtract its length from our total count
   - Expand [left, right] to cover the union
4. Add the merged interval back
5. Add its length to our total count

This approach ensures each interval is processed at most once (when added and when merged into another), giving us O(log n) for finding intervals and O(k) for merging, where k is the number of intervals removed.

## Optimal Solution

We'll use a balanced tree structure (like `SortedDict` from `sortedcontainers` in Python, or `TreeMap` in Java) to maintain intervals sorted by start value. The algorithm carefully handles finding and merging overlapping intervals.

<div class="code-group">

```python
from sortedcontainers import SortedDict

class CountIntervals:
    # Time: O(log n) for add, O(1) for count
    # Space: O(n) where n is number of intervals
    def __init__(self):
        # Sorted dictionary mapping start -> end of intervals
        self.intervals = SortedDict()
        # Total count of covered integers
        self.total = 0

    def add(self, left: int, right: int) -> None:
        # Find the first interval that could overlap with [left, right]
        # We look for the interval with start <= right (could overlap)
        idx = self.intervals.bisect_right(right)

        # Move back one if we went past a potential overlapping interval
        if idx > 0:
            idx -= 1

        # Merge all overlapping intervals
        while idx < len(self.intervals):
            start, end = self.intervals.peekitem(idx)

            # If this interval doesn't overlap with [left, right], we're done
            if end < left or start > right:
                # Check if we need to move forward or break
                if end < left:
                    idx += 1
                    continue
                break

            # This interval overlaps, remove it
            del self.intervals[start]
            # Subtract its length from total
            self.total -= (end - start + 1)

            # Expand [left, right] to cover the union
            left = min(left, start)
            right = max(right, end)

        # Add the merged interval
        self.intervals[left] = right
        # Add its length to total
        self.total += (right - left + 1)

    def count(self) -> int:
        return self.total
```

```javascript
// Time: O(log n) for add, O(1) for count
// Space: O(n) where n is number of intervals
class CountIntervals {
  constructor() {
    // Use a Map to store intervals, we'll maintain sorted order manually
    // In a real interview, you might need to implement a balanced BST
    // For simplicity, we'll use an array and binary search
    this.intervals = [];
    this.total = 0;
  }

  // Helper function to find insertion position using binary search
  _findIndex(start) {
    let left = 0,
      right = this.intervals.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.intervals[mid][0] < start) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }

  add(left, right) {
    // Find intervals that overlap with [left, right]
    const toRemove = [];
    let newLeft = left,
      newRight = right;

    // Binary search to find first potential overlapping interval
    let idx = this._findIndex(left);

    // Check interval before idx (might overlap)
    if (idx > 0 && this.intervals[idx - 1][1] >= left) {
      idx--;
    }

    // Merge overlapping intervals
    while (idx < this.intervals.length) {
      const [start, end] = this.intervals[idx];

      // No overlap, we're done
      if (start > newRight) break;

      // Check if intervals overlap
      if (end >= newLeft || start <= newRight) {
        // They overlap, remove this interval
        toRemove.push(idx);
        // Update total
        this.total -= end - start + 1;
        // Expand the new interval
        newLeft = Math.min(newLeft, start);
        newRight = Math.max(newRight, end);
      }
      idx++;
    }

    // Remove overlapping intervals (from end to start to preserve indices)
    for (let i = toRemove.length - 1; i >= 0; i--) {
      this.intervals.splice(toRemove[i], 1);
    }

    // Add the merged interval
    const insertIdx = this._findIndex(newLeft);
    this.intervals.splice(insertIdx, 0, [newLeft, newRight]);
    this.total += newRight - newLeft + 1;
  }

  count() {
    return this.total;
  }
}
```

```java
// Time: O(log n) for add, O(1) for count
// Space: O(n) where n is number of intervals
import java.util.TreeMap;

class CountIntervals {
    // TreeMap to store intervals sorted by start value
    private TreeMap<Integer, Integer> intervals;
    private int total;

    public CountIntervals() {
        intervals = new TreeMap<>();
        total = 0;
    }

    public void add(int left, int right) {
        // Find the first interval that might overlap
        // We look for intervals with start <= right
        var entry = intervals.floorEntry(right);

        // Merge all overlapping intervals
        while (entry != null && entry.getValue() >= left) {
            // This interval overlaps, remove it
            int l = entry.getKey();
            int r = entry.getValue();
            intervals.remove(l);
            total -= (r - l + 1);

            // Expand [left, right] to cover the union
            left = Math.min(left, l);
            right = Math.max(right, r);

            // Get next potential overlapping interval
            entry = intervals.floorEntry(right);
        }

        // Add the merged interval
        intervals.put(left, right);
        total += (right - left + 1);
    }

    public int count() {
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `add(left, right)`: O(k + log n) where n is the number of intervals and k is the number of intervals removed during merging. Each interval is added once and removed at most once, so amortized O(log n) per operation.
- `count()`: O(1) since we maintain a running total.

**Space Complexity:** O(n) where n is the number of disjoint intervals after all operations. In the worst case, if no intervals overlap, we store each interval separately.

The amortized analysis is key: although merging might take O(k) time to remove k intervals, each interval is removed at most once, so over m operations, the total time is O(m log n).

## Common Mistakes

1. **Not maintaining a running total:** Recalculating the total from scratch on each `count()` call makes it O(n) instead of O(1). Always update the total when adding/removing intervals.

2. **Incorrect overlap detection:** The condition for overlap is `max(start1, start2) <= min(end1, end2)`. A common mistake is checking `start2 <= end1` without considering `start1 <= end2`.

3. **Forgetting to merge multiple intervals:** When a new interval overlaps with several existing intervals, you need to merge all of them, not just the first one found. This requires a loop that continues while there's overlap.

4. **Off-by-one errors with interval boundaries:** Remember that interval [left, right] includes both endpoints, so its length is `right - left + 1`, not `right - left`.

## When You'll See This Pattern

This pattern of maintaining disjoint intervals with efficient merging appears in several problems:

1. **Merge Intervals (LeetCode 56)** - The classic problem that introduces interval merging, though without the counting requirement.

2. **Insert Interval (LeetCode 57)** - Similar to merging but with a single interval insertion into a sorted list of non-overlapping intervals.

3. **Data Stream as Disjoint Intervals (LeetCode 352)** - Almost identical to this problem but returns the actual intervals instead of just the count.

4. **Range Module (LeetCode 715)** - A more complex version that supports adding, removing, and querying ranges.

The core technique is using a sorted data structure (balanced BST, TreeMap, SortedDict) to maintain intervals in order, allowing efficient search for overlapping intervals.

## Key Takeaways

1. **Use the right data structure for interval problems:** When you need to maintain sorted intervals with efficient insertion and overlap detection, a balanced binary search tree (or equivalent like TreeMap/SortedDict) is often the right choice.

2. **Maintain auxiliary information:** Keeping a running total (or other aggregated data) avoids recalculating from scratch on each query, turning O(n) queries into O(1).

3. **Think about amortized complexity:** Even though a single `add()` operation might take O(k) time to merge k intervals, each interval is processed at most once when added and once when merged away, giving good amortized performance.

Related problems: [Merge Intervals](/problem/merge-intervals), [Insert Interval](/problem/insert-interval), [Data Stream as Disjoint Intervals](/problem/data-stream-as-disjoint-intervals)
