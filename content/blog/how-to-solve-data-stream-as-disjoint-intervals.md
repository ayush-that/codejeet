---
title: "How to Solve Data Stream as Disjoint Intervals — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Data Stream as Disjoint Intervals. Hard difficulty, 60.0% acceptance rate. Topics: Hash Table, Binary Search, Union-Find, Design, Data Stream."
date: "2026-12-23"
category: "dsa-patterns"
tags: ["data-stream-as-disjoint-intervals", "hash-table", "binary-search", "union-find", "hard"]
---

# How to Solve Data Stream as Disjoint Intervals

You’re given a stream of non‑negative integers, and after each addition you must return a summary of all numbers seen so far as a list of disjoint intervals. The challenge is that the stream can arrive in any order, and you must efficiently merge overlapping or adjacent intervals after every insertion. This problem is tricky because a naive approach would re‑sort or re‑scan the entire list after each addition, which becomes far too slow for a high‑volume stream. The core difficulty is maintaining a dynamic, sorted collection of intervals that can be quickly updated.

## Visual Walkthrough

Let’s walk through a small example step by step.  
We’ll start with an empty `SummaryRanges` and add the numbers: `[1, 3, 7, 2, 6]`.

**Step 1:** `addNum(1)`  
Current intervals: `[]`  
We have no existing intervals, so we create a new interval `[1, 1]`.  
Intervals become: `[[1, 1]]`

**Step 2:** `addNum(3)`  
Current intervals: `[[1, 1]]`  
`3` is not adjacent to `1` (since `1+1 = 2`, not `3`), so we insert a new interval `[3, 3]`.  
Intervals become: `[[1, 1], [3, 3]]`

**Step 3:** `addNum(7)`  
Current intervals: `[[1, 1], [3, 3]]`  
`7` is far from `3`, so we add `[7, 7]`.  
Intervals: `[[1, 1], [3, 3], [7, 7]]`

**Step 4:** `addNum(2)`  
Now `2` fits between `1` and `3`.

- It is adjacent to `[1, 1]` because `1+1 = 2`.
- It is also adjacent to `[3, 3]` because `3-1 = 2`.  
  So we can merge `[1, 1]` and `[3, 3]` into `[1, 3]`.  
  Intervals become: `[[1, 3], [7, 7]]`

**Step 5:** `addNum(6)`  
`6` is not adjacent to `[1, 3]` (since `3+1 = 4`, not `6`), and it is adjacent to `[7, 7]` because `7-1 = 6`.  
We extend `[7, 7]` leftward to `[6, 7]`.  
Intervals: `[[1, 3], [6, 7]]`

The key observation is that each new number can:

1. Fall into an existing interval → do nothing.
2. Extend an existing interval left or right.
3. Merge two existing intervals (if it bridges the gap between them).
4. Create a brand new interval.

We need a data structure that lets us quickly find the intervals just before and after the new value.

## Brute Force Approach

A naive solution would store all added numbers in a set (to avoid duplicates) and, whenever `getIntervals()` is called, sort the set and then scan through it to build the intervals.  
`addNum(value)` would just insert into the set in O(1) time, but `getIntervals()` would take O(n log n) time for sorting and O(n) for scanning, where n is the number of unique values added so far.

This is acceptable if `getIntervals()` is called rarely, but the problem statement implies we may call it frequently (possibly after every addition). Moreover, the brute‑force approach doesn’t maintain the interval structure incrementally, so each call to `getIntervals()` repeats the same work.

Another brute‑force idea is to keep a list of intervals and, for each new value, scan the entire list to see where it fits.

- If it’s inside an existing interval, ignore it.
- If it extends an interval, update that interval.
- If it merges two intervals, delete one and extend the other.
- Otherwise, insert a new interval at the correct sorted position.

Scanning the list takes O(n) per addition, and inserting/deleting from a list also takes O(n) due to shifting elements. That’s O(n) per `addNum`, which becomes too slow for large streams.

## Optimized Approach

The optimal insight is to use a **sorted data structure** that supports efficient insertion, lookup, and deletion of intervals.  
We can store intervals in a **TreeMap** (Java), **SortedDict** (Python with `sortedcontainers` library, but in LeetCode we often simulate it with a regular dict plus sorting when needed), or a **binary search tree** approach.

However, the most elegant and efficient way is to maintain the intervals in a **balanced binary search tree keyed by the start of each interval**. Then for a new value `x`:

1. Find the interval with the largest start ≤ x (floor entry).
2. Find the interval with the smallest start > x (ceiling entry).
3. Check if `x` is already covered by the floor interval.
4. If not, check if `x` can extend the floor interval to the right (if x = floor.end + 1).
5. Check if `x` can extend the ceiling interval to the left (if x = ceiling.start - 1).
6. If both extensions are possible, merge the two intervals.
7. Otherwise, if only one extension is possible, update that interval.
8. If no extension is possible, insert a new interval `[x, x]`.

This gives O(log n) time per `addNum` and O(n) time for `getIntervals` (just iterate through the tree), where n is the number of intervals (at most number of unique values).

Since standard Python doesn’t have a built‑in TreeMap, we can simulate it using a plain dict and keep a sorted list of starts, but that would make insertion O(n). Instead, we can use **bisect** on a list of interval starts to find the floor and ceiling in O(log n) time, but updating the list still requires O(n) shifts. For true O(log n) we’d need a library like `sortedcontainers`, but in a coding interview we can describe the TreeMap approach and implement it in Java directly. For Python, we’ll show a solution that uses a dict and a sorted list of starts, acknowledging the trade‑off.

## Optimal Solution

We’ll implement the solution using a TreeMap (Java), a Map with keys stored in sorted order (JavaScript using a Map and sorting when needed), and for Python we’ll use a dict and maintain a sorted list of starts, but we’ll note that for true O(log n) inserts you’d need a balanced BST library.

<div class="code-group">

```python
# Time: addNum O(log n) with bisect, but O(n) due to list insertion; getIntervals O(n)
# Space: O(n) for storing intervals
class SummaryRanges:
    def __init__(self):
        # dict mapping start -> [start, end]
        self.intervals = {}
        # sorted list of starts
        self.starts = []

    def addNum(self, value: int) -> None:
        # If value is already covered, do nothing
        # Find the last interval with start <= value
        import bisect
        idx = bisect.bisect_right(self.starts, value) - 1

        # Check if value is inside an existing interval
        if idx >= 0:
            start = self.starts[idx]
            end = self.intervals[start][1]
            if value <= end:
                return  # already covered

        # Check if we can extend the left interval to the right
        extend_left = idx >= 0 and self.intervals[self.starts[idx]][1] + 1 == value

        # Check if we can extend the right interval to the left
        extend_right = False
        if idx + 1 < len(self.starts):
            next_start = self.starts[idx + 1]
            if value + 1 == next_start:
                extend_right = True

        if extend_left and extend_right:
            # Merge two intervals
            left_start = self.starts[idx]
            right_start = self.starts[idx + 1]
            right_end = self.intervals[right_start][1]
            # Update left interval to cover both
            self.intervals[left_start][1] = right_end
            # Remove right interval
            del self.intervals[right_start]
            self.starts.pop(idx + 1)
        elif extend_left:
            # Extend left interval
            left_start = self.starts[idx]
            self.intervals[left_start][1] = value
        elif extend_right:
            # Extend right interval leftward
            right_start = self.starts[idx + 1]
            # Update interval to [value, old_end]
            old_end = self.intervals[right_start][1]
            del self.intervals[right_start]
            self.intervals[value] = [value, old_end]
            self.starts[idx + 1] = value
        else:
            # Insert new interval
            self.intervals[value] = [value, value]
            bisect.insort(self.starts, value)

    def getIntervals(self) -> List[List[int]]:
        return [self.intervals[start] for start in self.starts]
```

```javascript
// Time: addNum O(log n) with binary search, but O(n) due to array insertion; getIntervals O(n)
// Space: O(n) for storing intervals
class SummaryRanges {
  constructor() {
    // Map from start -> [start, end]
    this.intervals = new Map();
    // Sorted array of starts
    this.starts = [];
  }

  addNum(value) {
    // Binary search to find position where starts[idx] <= value < starts[idx+1]
    let idx = this.binarySearch(value);

    // Check if value is inside an existing interval
    if (idx >= 0) {
      let start = this.starts[idx];
      let end = this.intervals.get(start)[1];
      if (value <= end) return; // already covered
    }

    // Check if we can extend left interval to the right
    let extendLeft = idx >= 0 && this.intervals.get(this.starts[idx])[1] + 1 === value;

    // Check if we can extend right interval to the left
    let extendRight = false;
    if (idx + 1 < this.starts.length) {
      let nextStart = this.starts[idx + 1];
      if (value + 1 === nextStart) extendRight = true;
    }

    if (extendLeft && extendRight) {
      // Merge two intervals
      let leftStart = this.starts[idx];
      let rightStart = this.starts[idx + 1];
      let rightEnd = this.intervals.get(rightStart)[1];
      // Extend left interval to cover right
      this.intervals.get(leftStart)[1] = rightEnd;
      // Remove right interval
      this.intervals.delete(rightStart);
      this.starts.splice(idx + 1, 1);
    } else if (extendLeft) {
      // Extend left interval rightward
      let leftStart = this.starts[idx];
      this.intervals.get(leftStart)[1] = value;
    } else if (extendRight) {
      // Extend right interval leftward
      let rightStart = this.starts[idx + 1];
      let oldEnd = this.intervals.get(rightStart)[1];
      this.intervals.delete(rightStart);
      this.intervals.set(value, [value, oldEnd]);
      this.starts[idx + 1] = value;
    } else {
      // Insert new interval
      this.intervals.set(value, [value, value]);
      // Insert into sorted array
      this.starts.splice(idx + 1, 0, value);
    }
  }

  getIntervals() {
    return this.starts.map((start) => this.intervals.get(start));
  }

  // Helper: binary search to find the last index where starts[idx] <= value
  binarySearch(value) {
    let lo = 0,
      hi = this.starts.length - 1;
    while (lo <= hi) {
      let mid = Math.floor((lo + hi) / 2);
      if (this.starts[mid] <= value) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return hi; // hi is the last index with start <= value
  }
}
```

```java
// Time: addNum O(log n), getIntervals O(n)
// Space: O(n) for storing intervals
class SummaryRanges {
    // TreeMap stores start -> [start, end]
    private TreeMap<Integer, int[]> map;

    public SummaryRanges() {
        map = new TreeMap<>();
    }

    public void addNum(int value) {
        // If value is already covered, do nothing
        // Find the greatest start <= value
        Integer floorKey = map.floorKey(value);
        if (floorKey != null) {
            int[] floorInterval = map.get(floorKey);
            if (value <= floorInterval[1]) {
                return; // already covered
            }
        }

        // Check if we can extend the floor interval to the right
        boolean extendLeft = floorKey != null && map.get(floorKey)[1] + 1 == value;

        // Check if we can extend the ceiling interval to the left
        Integer ceilingKey = map.ceilingKey(value);
        boolean extendRight = ceilingKey != null && value + 1 == ceilingKey;

        if (extendLeft && extendRight) {
            // Merge two intervals
            int[] floorInterval = map.get(floorKey);
            int[] ceilingInterval = map.get(ceilingKey);
            floorInterval[1] = ceilingInterval[1]; // extend floor to cover ceiling
            map.remove(ceilingKey); // remove ceiling interval
        } else if (extendLeft) {
            // Extend floor interval rightward
            map.get(floorKey)[1] = value;
        } else if (extendRight) {
            // Extend ceiling interval leftward
            int[] ceilingInterval = map.get(ceilingKey);
            // Remove old entry and insert with new start
            map.remove(ceilingKey);
            map.put(value, new int[]{value, ceilingInterval[1]});
        } else {
            // Insert new interval
            map.put(value, new int[]{value, value});
        }
    }

    public int[][] getIntervals() {
        int[][] result = new int[map.size()][2];
        int i = 0;
        for (int[] interval : map.values()) {
            result[i++] = interval;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Java (TreeMap):** `addNum` takes O(log n) where n is the number of intervals (since TreeMap operations are O(log n)). `getIntervals` is O(n) to collect all intervals.
- **Python/JavaScript (list + binary search):** Binary search is O(log n), but inserting into or deleting from the list of starts takes O(n) due to shifting. So `addNum` is O(n) in worst case, though average may be lower. `getIntervals` is O(n).

**Space Complexity:** O(n) for storing the intervals, where n is the number of intervals (at most the number of unique values added).

## Common Mistakes

1. **Not handling duplicates correctly** – If the same number is added twice, it should be ignored. Always check if the value is already inside an existing interval before doing any extension/merge logic.

2. **Off‑by‑one errors in adjacency checks** – Remember that intervals [1,3] and [4,5] are **not** adjacent because 3+1 = 4, so they can be merged into [1,5]. But [1,3] and [5,6] are not adjacent (gap of 1). The condition for merging is `left.end + 1 == right.start`.

3. **Forgetting to update the start when extending leftward** – If you extend an interval to the left, you must change the map key (the start) to the new smaller value. In the Java TreeMap solution, we remove the old entry and insert a new one with the updated start.

4. **Inefficient data structure choice** – Using a simple list and scanning linearly for each addition leads to O(n) per operation, which may time out for large streams. Always aim for O(log n) per addition with a balanced BST or TreeMap.

## When You’ll See This Pattern

This problem is a classic example of maintaining **dynamic sorted intervals** with efficient merge operations. You’ll see similar patterns in:

- **Range Module** (LeetCode 715) – Requires adding and removing ranges, then querying if a point is covered. Also uses a sorted structure to keep track of disjoint intervals.
- **Merge Intervals** (LeetCode 56) – The static version where you’re given all intervals upfront and need to merge overlapping ones. The streaming version here is the dynamic counterpart.
- **Insert Interval** (LeetCode 57) – Insert one interval into a list of non‑overlapping intervals, then merge if needed. This is essentially a single `addNum` operation but for a whole interval instead of a single value.

These problems all rely on keeping intervals sorted by start and efficiently finding neighbors to check for overlaps/adjacency.

## Key Takeaways

- **Use a sorted map keyed by interval start** to achieve O(log n) lookups and updates. In languages without TreeMap, you may need to simulate it with a list and binary search, accepting O(n) updates.
- **Break down the insertion logic into clear cases**: already covered, extend left, extend right, merge two, or create new. Handling each case separately prevents bugs.
- **Adjacency matters** – Two intervals [a,b] and [c,d] can be merged if b+1 >= c (overlapping or adjacent). In this problem, they must be exactly adjacent (b+1 == c) to merge.

Related problems: [Summary Ranges](/problem/summary-ranges), [Find Right Interval](/problem/find-right-interval), [Range Module](/problem/range-module)
