---
title: "How to Solve Snapshot Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Snapshot Array. Medium difficulty, 36.7% acceptance rate. Topics: Array, Hash Table, Binary Search, Design."
date: "2028-03-06"
category: "dsa-patterns"
tags: ["snapshot-array", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Snapshot Array

The Snapshot Array problem asks you to design a data structure that supports taking "snapshots" of an array at different points in time, allowing you to efficiently set values and retrieve historical values. What makes this problem interesting is that a naive approach of copying the entire array for each snapshot would be far too memory-intensive, requiring us to find a clever way to store only what changes between snapshots.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we create a `SnapshotArray` of length 3:

1. Initial state: `[0, 0, 0]`
2. Call `set(0, 5)` → Array becomes `[5, 0, 0]`
3. Call `snap()` → Take snapshot #0, returns 0
4. Call `set(1, 10)` → Array becomes `[5, 10, 0]`
5. Call `snap()` → Take snapshot #1, returns 1
6. Call `get(0, 0)` → Should return value at index 0 in snapshot #0, which is 5
7. Call `get(1, 1)` → Should return value at index 1 in snapshot #1, which is 10

The key insight is that most array elements don't change between snapshots. If we have 1000 elements and only change 3 of them between snapshots, storing the entire array again would waste memory. Instead, we should store only the changes (deltas) for each snapshot.

## Brute Force Approach

A naive approach would be to literally copy the entire array every time we take a snapshot:

- Store an array of arrays: `snapshots[snap_id][index] = value`
- Each `snap()` creates a deep copy of the current array
- `get(snap_id, index)` simply returns `snapshots[snap_id][index]`

**Why this fails:**

- **Space complexity:** O(n × s) where n is length and s is number of snapshots
- With n = 50,000 and s = 50,000 (as in constraints), this would require storing 2.5 billion integers
- **Time complexity:** Each `snap()` takes O(n) time to copy the array
- This approach quickly becomes infeasible for the problem constraints

## Optimized Approach

The optimal solution uses a combination of arrays and binary search. Here's the key insight:

1. **Store changes efficiently:** Instead of copying the entire array for each snapshot, store only the values that actually change. For each index, we maintain a list of `(snap_id, value)` pairs representing when that index was modified.

2. **Binary search for retrieval:** When we need to get a value at a specific snapshot, we binary search through the history of changes for that index to find the most recent change that occurred at or before the requested snapshot ID.

3. **Data structure choice:**
   - Use an array of lists: `history[index] = list of (snap_id, value) pairs`
   - Each `set(index, val)` adds a new entry to `history[index]` with the current snap_id
   - Each `snap()` increments the snap_id counter

4. **Initialization trick:** Initialize each index's history with `(0, 0)` to represent the initial state before any snapshots.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
class SnapshotArray:
    """
    Time Complexity:
        - __init__: O(n) where n is length
        - set: O(1) amortized
        - snap: O(1)
        - get: O(log k) where k is number of changes at that index

    Space Complexity: O(n + m) where n is length and m is total modifications
    """

    def __init__(self, length: int):
        # For each index, store a list of (snap_id, value) pairs
        # Initialize with (0, 0) representing the initial state
        self.history = [[(0, 0)] for _ in range(length)]
        self.snap_id = 0  # Current snapshot ID

    def set(self, index: int, val: int) -> None:
        # Get the history for this index
        history_list = self.history[index]

        # Check if we already have an entry for the current snap_id
        # If so, update it; otherwise, add a new entry
        if history_list[-1][0] == self.snap_id:
            # Update the existing entry for current snap_id
            history_list[-1] = (self.snap_id, val)
        else:
            # Add new entry for current snap_id
            history_list.append((self.snap_id, val))

    def snap(self) -> int:
        # Return current snap_id, then increment it
        current_id = self.snap_id
        self.snap_id += 1
        return current_id

    def get(self, index: int, snap_id: int) -> int:
        # Binary search to find the most recent change <= snap_id
        history_list = self.history[index]

        left, right = 0, len(history_list) - 1
        result = 0  # Default value if nothing found (shouldn't happen due to initialization)

        while left <= right:
            mid = (left + right) // 2
            current_snap_id, value = history_list[mid]

            if current_snap_id <= snap_id:
                # This is a candidate - store it and search right for potentially better (later) candidate
                result = value
                left = mid + 1
            else:
                # This snapshot is too recent, search left
                right = mid - 1

        return result
```

```javascript
class SnapshotArray {
  /**
   * Time Complexity:
   *   - constructor: O(n) where n is length
   *   - set: O(1) amortized
   *   - snap: O(1)
   *   - get: O(log k) where k is number of changes at that index
   *
   * Space Complexity: O(n + m) where n is length and m is total modifications
   */

  constructor(length) {
    // For each index, store an array of [snap_id, value] pairs
    // Initialize with [0, 0] representing the initial state
    this.history = Array.from({ length }, () => [[0, 0]]);
    this.snapId = 0; // Current snapshot ID
  }

  set(index, val) {
    const historyList = this.history[index];
    const lastEntry = historyList[historyList.length - 1];

    // Check if we already have an entry for the current snapId
    if (lastEntry[0] === this.snapId) {
      // Update the existing entry
      lastEntry[1] = val;
    } else {
      // Add new entry for current snapId
      historyList.push([this.snapId, val]);
    }
  }

  snap() {
    // Return current snapId, then increment it
    return this.snapId++;
  }

  get(index, snapId) {
    const historyList = this.history[index];

    // Binary search to find the most recent change <= snapId
    let left = 0;
    let right = historyList.length - 1;
    let result = 0; // Default value

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const [currentSnapId, value] = historyList[mid];

      if (currentSnapId <= snapId) {
        // This is a candidate - store it and search right for potentially better candidate
        result = value;
        left = mid + 1;
      } else {
        // This snapshot is too recent, search left
        right = mid - 1;
      }
    }

    return result;
  }
}
```

```java
class SnapshotArray {
    // For each index, store a list of int[] where int[0] = snap_id, int[1] = value
    private List<List<int[]>> history;
    private int snapId;

    /**
     * Time Complexity:
     *   - SnapshotArray: O(n) where n is length
     *   - set: O(1) amortized
     *   - snap: O(1)
     *   - get: O(log k) where k is number of changes at that index
     *
     * Space Complexity: O(n + m) where n is length and m is total modifications
     */

    public SnapshotArray(int length) {
        history = new ArrayList<>();
        snapId = 0;

        // Initialize each index with (0, 0) representing initial state
        for (int i = 0; i < length; i++) {
            List<int[]> list = new ArrayList<>();
            list.add(new int[]{0, 0});  // [snap_id, value]
            history.add(list);
        }
    }

    public void set(int index, int val) {
        List<int[]> historyList = history.get(index);
        int[] lastEntry = historyList.get(historyList.size() - 1);

        // Check if we already have an entry for the current snapId
        if (lastEntry[0] == snapId) {
            // Update the existing entry
            lastEntry[1] = val;
        } else {
            // Add new entry for current snapId
            historyList.add(new int[]{snapId, val});
        }
    }

    public int snap() {
        // Return current snapId, then increment it
        return snapId++;
    }

    public int get(int index, int snap_id) {
        List<int[]> historyList = history.get(index);

        // Binary search to find the most recent change <= snap_id
        int left = 0;
        int right = historyList.size() - 1;
        int result = 0;  // Default value

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int[] entry = historyList.get(mid);
            int currentSnapId = entry[0];
            int value = entry[1];

            if (currentSnapId <= snap_id) {
                // This is a candidate - store it and search right for potentially better candidate
                result = value;
                left = mid + 1;
            } else {
                // This snapshot is too recent, search left
                right = mid - 1;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `__init__` / constructor: O(n) - Initialize history for each index
- `set`: O(1) amortized - Append to list or update last element
- `snap`: O(1) - Just increment counter
- `get`: O(log k) - Binary search through history of changes for that index, where k is number of modifications at that index

**Space Complexity:** O(n + m)

- n: Length of array (for the outer structure)
- m: Total number of `set` operations (each creates an entry in some index's history)
- This is much better than O(n × s) of the brute force approach

## Common Mistakes

1. **Forgetting to initialize with (0, 0):** Without initializing each index's history with `(0, 0)`, `get` operations for early snapshots might fail when binary searching an empty list.

2. **Not handling multiple sets in same snapshot:** If you call `set(index, val)` multiple times before taking a snapshot, you should update the existing entry rather than creating multiple entries with the same snap_id. Our solution handles this by checking if the last entry has the current snap_id.

3. **Using linear search in `get`:** Some candidates implement `get` by iterating through all changes until finding the right one, which gives O(k) time instead of O(log k). With many modifications, this can be too slow.

4. **Off-by-one errors in binary search:** The binary search needs to find the _last_ entry with snap_id ≤ target, not just any entry. Our implementation handles this by continuing to search right even after finding a valid candidate.

## When You'll See This Pattern

This "store deltas + binary search" pattern appears in several time-series or versioned data problems:

1. **Time Based Key-Value Store (LeetCode 981):** Similar concept of storing timestamped values and retrieving the most recent one before a given timestamp.

2. **Range Module (LeetCode 715):** While more complex, it also involves tracking intervals over time and querying historical states.

3. **Design Log Storage System (LeetCode 635):** Another problem where you need to retrieve data based on timestamps, though with different query patterns.

The core pattern is: when you need to track changes over time and query historical states, store only what changes (deltas) and use binary search for efficient retrieval.

## Key Takeaways

1. **Don't store redundant data:** When dealing with versioned data, avoid copying entire states. Instead, store only the changes between versions.

2. **Binary search is your friend for temporal queries:** When you need to find "the most recent value before time T," binary search on sorted timestamps is usually the optimal approach.

3. **Consider the access patterns:** In this problem, `set` and `snap` are frequent operations that need to be fast, while `get` can afford logarithmic time. Design your data structure accordingly.

[Practice this problem on CodeJeet](/problem/snapshot-array)
