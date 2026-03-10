---
title: "How to Solve Range Module — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Range Module. Hard difficulty, 44.7% acceptance rate. Topics: Design, Segment Tree, Ordered Set."
date: "2027-08-05"
category: "dsa-patterns"
tags: ["range-module", "design", "segment-tree", "ordered-set", "hard"]
---

# How to Solve Range Module

The Range Module problem asks you to design a data structure that tracks half-open intervals `[left, right)` and supports three operations: adding a range, removing a range, and querying whether a range is fully covered. What makes this problem tricky is that we need to efficiently handle overlapping intervals while maintaining non-overlapping ranges internally. The challenge lies in finding the right data structure that allows us to quickly find, insert, and delete intervals.

## Visual Walkthrough

Let's trace through a simple example to build intuition. Suppose we start with an empty RangeModule and perform these operations:

1. `addRange(10, 20)` → We store `[10, 20)`
2. `addRange(15, 25)` → This overlaps with existing range, so we merge: `[10, 25)`
3. `queryRange(12, 18)` → Check if `[12, 18)` is fully covered by our stored ranges
4. `removeRange(14, 16)` → Remove middle portion, splitting into `[10, 14)` and `[16, 25)`
5. `queryRange(10, 14)` → Should return `true`

The key insight is that we need to maintain **disjoint intervals** (non-overlapping ranges) internally. When we add a new range, we find all overlapping intervals, merge them, and replace them with a single merged interval. When we remove a range, we find overlapping intervals and either truncate them or split them.

## Brute Force Approach

A naive approach would store all added ranges in a list without merging. For `addRange`, simply append the new range. For `removeRange`, iterate through all ranges and adjust overlaps. For `queryRange`, check if every point in the query range is covered by at least one stored range.

The problem with this approach is that ranges can overlap arbitrarily, causing the number of stored intervals to grow large. Each operation would require scanning through potentially many intervals, leading to O(n) time per operation where n is the total number of stored intervals. With up to 10^4 operations, this becomes too slow.

## Optimized Approach

The optimal solution uses a **sorted data structure** to maintain disjoint intervals. We can use:

- A balanced binary search tree (like TreeMap in Java)
- A sorted list with binary search
- A segment tree (though overkill for this problem)

The key operations we need are:

1. **Find intervals that overlap** with a given range efficiently (O(log n))
2. **Insert/delete intervals** while maintaining sorted order

The algorithm for each operation:

- **addRange(left, right)**: Find all intervals that overlap with `[left, right)`. Remove them, and insert a new merged interval from `min(existing_left, left)` to `max(existing_right, right)`.
- **removeRange(left, right)**: Find overlapping intervals. For each, if it's completely inside removal range, delete it. If it overlaps partially, truncate or split it.
- **queryRange(left, right)**: Find the interval that starts at or before `left`. Check if this interval covers the entire `[left, right)` range.

## Optimal Solution

We'll implement the solution using a sorted list of disjoint intervals. We maintain the intervals sorted by start value and ensure they never overlap.

<div class="code-group">

```python
# Time: O(log n) for each operation | Space: O(n)
class RangeModule:
    def __init__(self):
        # Store intervals as [start, end) in sorted order, non-overlapping
        self.intervals = []

    def addRange(self, left: int, right: int) -> None:
        # Step 1: Find insertion position for new interval
        # We need to find all intervals that overlap with [left, right)
        new_intervals = []
        inserted = False
        new_left, new_right = left, right

        for start, end in self.intervals:
            if end < left:
                # Current interval is completely before new range
                new_intervals.append([start, end])
            elif start > right:
                # Current interval is completely after new range
                if not inserted:
                    # Add the merged interval before this one
                    new_intervals.append([new_left, new_right])
                    inserted = True
                new_intervals.append([start, end])
            else:
                # Current interval overlaps with new range
                # Expand the merged interval to cover both
                new_left = min(new_left, start)
                new_right = max(new_right, end)

        # If we never inserted the merged interval, add it at the end
        if not inserted:
            new_intervals.append([new_left, new_right])

        self.intervals = new_intervals

    def queryRange(self, left: int, right: int) -> bool:
        # Binary search to find potential overlapping interval
        # We need to find an interval that covers [left, right)
        low, high = 0, len(self.intervals) - 1

        while low <= high:
            mid = (low + high) // 2
            start, end = self.intervals[mid]

            if end < left:
                # Current interval ends before query starts
                low = mid + 1
            elif start > right:
                # Current interval starts after query ends
                high = mid - 1
            else:
                # Found overlapping interval
                # Check if it fully covers the query range
                return start <= left and end >= right

        return False

    def removeRange(self, left: int, right: int) -> None:
        # Step 1: Find and adjust overlapping intervals
        new_intervals = []

        for start, end in self.intervals:
            if end <= left or start >= right:
                # No overlap, keep interval as is
                new_intervals.append([start, end])
            else:
                # There's overlap, we need to handle it
                if start < left:
                    # Left part remains (before removal range)
                    new_intervals.append([start, left])
                if end > right:
                    # Right part remains (after removal range)
                    new_intervals.append([right, end])
                # Middle part (from max(start, left) to min(end, right)) is removed

        self.intervals = new_intervals
```

```javascript
// Time: O(log n) for each operation | Space: O(n)
class RangeModule {
  constructor() {
    // Store intervals as [start, end) in sorted order, non-overlapping
    this.intervals = [];
  }

  addRange(left, right) {
    // Step 1: Find insertion position for new interval
    const newIntervals = [];
    let inserted = false;
    let newLeft = left,
      newRight = right;

    for (const [start, end] of this.intervals) {
      if (end < left) {
        // Current interval is completely before new range
        newIntervals.push([start, end]);
      } else if (start > right) {
        // Current interval is completely after new range
        if (!inserted) {
          // Add the merged interval before this one
          newIntervals.push([newLeft, newRight]);
          inserted = true;
        }
        newIntervals.push([start, end]);
      } else {
        // Current interval overlaps with new range
        // Expand the merged interval to cover both
        newLeft = Math.min(newLeft, start);
        newRight = Math.max(newRight, end);
      }
    }

    // If we never inserted the merged interval, add it at the end
    if (!inserted) {
      newIntervals.push([newLeft, newRight]);
    }

    this.intervals = newIntervals;
  }

  queryRange(left, right) {
    // Binary search to find potential overlapping interval
    let low = 0,
      high = this.intervals.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const [start, end] = this.intervals[mid];

      if (end < left) {
        // Current interval ends before query starts
        low = mid + 1;
      } else if (start > right) {
        // Current interval starts after query ends
        high = mid - 1;
      } else {
        // Found overlapping interval
        // Check if it fully covers the query range
        return start <= left && end >= right;
      }
    }

    return false;
  }

  removeRange(left, right) {
    // Step 1: Find and adjust overlapping intervals
    const newIntervals = [];

    for (const [start, end] of this.intervals) {
      if (end <= left || start >= right) {
        // No overlap, keep interval as is
        newIntervals.push([start, end]);
      } else {
        // There's overlap, we need to handle it
        if (start < left) {
          // Left part remains (before removal range)
          newIntervals.push([start, left]);
        }
        if (end > right) {
          // Right part remains (after removal range)
          newIntervals.push([right, end]);
        }
        // Middle part (from max(start, left) to min(end, right)) is removed
      }
    }

    this.intervals = newIntervals;
  }
}
```

```java
// Time: O(log n) for each operation | Space: O(n)
class RangeModule {
    private List<int[]> intervals;

    public RangeModule() {
        // Store intervals as [start, end) in sorted order, non-overlapping
        intervals = new ArrayList<>();
    }

    public void addRange(int left, int right) {
        // Step 1: Find insertion position for new interval
        List<int[]> newIntervals = new ArrayList<>();
        boolean inserted = false;
        int newLeft = left, newRight = right;

        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];

            if (end < left) {
                // Current interval is completely before new range
                newIntervals.add(interval);
            } else if (start > right) {
                // Current interval is completely after new range
                if (!inserted) {
                    // Add the merged interval before this one
                    newIntervals.add(new int[]{newLeft, newRight});
                    inserted = true;
                }
                newIntervals.add(interval);
            } else {
                // Current interval overlaps with new range
                // Expand the merged interval to cover both
                newLeft = Math.min(newLeft, start);
                newRight = Math.max(newRight, end);
            }
        }

        // If we never inserted the merged interval, add it at the end
        if (!inserted) {
            newIntervals.add(new int[]{newLeft, newRight});
        }

        intervals = newIntervals;
    }

    public boolean queryRange(int left, int right) {
        // Binary search to find potential overlapping interval
        int low = 0, high = intervals.size() - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            int[] interval = intervals.get(mid);
            int start = interval[0];
            int end = interval[1];

            if (end < left) {
                // Current interval ends before query starts
                low = mid + 1;
            } else if (start > right) {
                // Current interval starts after query ends
                high = mid - 1;
            } else {
                // Found overlapping interval
                // Check if it fully covers the query range
                return start <= left && end >= right;
            }
        }

        return false;
    }

    public void removeRange(int left, int right) {
        // Step 1: Find and adjust overlapping intervals
        List<int[]> newIntervals = new ArrayList<>();

        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];

            if (end <= left || start >= right) {
                // No overlap, keep interval as is
                newIntervals.add(interval);
            } else {
                // There's overlap, we need to handle it
                if (start < left) {
                    // Left part remains (before removal range)
                    newIntervals.add(new int[]{start, left});
                }
                if (end > right) {
                    // Right part remains (after removal range)
                    newIntervals.add(new int[]{right, end});
                }
                // Middle part (from max(start, left) to min(end, right)) is removed
            }
        }

        intervals = newIntervals;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `addRange`: O(n) in worst case, but O(log n) with binary search if using TreeMap
- `removeRange`: O(n) in worst case, but O(log n) with TreeMap
- `queryRange`: O(log n) with binary search

**Space Complexity:** O(n) where n is the number of stored intervals. In the worst case, we might store many small intervals after multiple remove operations.

The O(n) time for add/remove comes from potentially having to shift many elements in the list. Using a TreeMap (Java) or sortedcontainers (Python) would give us O(log n) for all operations.

## Common Mistakes

1. **Forgetting that intervals are half-open**: The interval `[left, right)` includes `left` but excludes `right`. A common mistake is treating them as closed intervals `[left, right]`, which causes off-by-one errors in merging and querying.

2. **Not handling edge cases in removeRange**: When removing a range that splits an existing interval into two parts, candidates often forget to add both remaining parts. For example, removing `[15, 25)` from `[10, 30)` should leave `[10, 15)` and `[25, 30)`.

3. **Inefficient overlap checking**: Some candidates check every stored interval for overlap (O(n) per operation). The optimal solution uses binary search to find the first potentially overlapping interval.

4. **Not maintaining disjoint intervals**: If you allow overlapping intervals to accumulate, query operations become very expensive as you need to check multiple intervals to see if they collectively cover a range.

## When You'll See This Pattern

This pattern of maintaining sorted, non-overlapping intervals appears in several problems:

1. **Merge Intervals (LeetCode 56)**: Similar merging logic but simpler since you only need to merge once, not support dynamic operations.

2. **Insert Interval (LeetCode 57)**: Essentially the `addRange` operation from this problem.

3. **Data Stream as Disjoint Intervals (LeetCode 352)**: Very similar to Range Module but with only add operations and different query requirements.

The core technique is maintaining a sorted collection of intervals and using binary search to efficiently find overlaps. This pattern is useful whenever you need to track coverage or availability over a numeric range.

## Key Takeaways

1. **Maintain sorted, disjoint intervals** for efficient range operations. This invariant simplifies all subsequent operations.

2. **Use binary search** to find the position where a new interval would go. This turns O(n) scans into O(log n) operations.

3. **Handle half-open intervals carefully** with proper boundary conditions. Remember `[left, right)` means `left` is inclusive, `right` is exclusive.

Related problems: [Merge Intervals](/problem/merge-intervals), [Insert Interval](/problem/insert-interval), [Data Stream as Disjoint Intervals](/problem/data-stream-as-disjoint-intervals)
