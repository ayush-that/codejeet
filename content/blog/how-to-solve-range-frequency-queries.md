---
title: "How to Solve Range Frequency Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Range Frequency Queries. Medium difficulty, 42.2% acceptance rate. Topics: Array, Hash Table, Binary Search, Design, Segment Tree."
date: "2029-03-14"
category: "dsa-patterns"
tags: ["range-frequency-queries", "array", "hash-table", "binary-search", "medium"]
---

## How to Solve Range Frequency Queries

This problem asks us to design a data structure that can efficiently answer queries about how many times a specific value appears within any subarray of a given array. The challenge is that we need to handle multiple queries quickly — a brute force check for each query would be too slow for large arrays and many queries. The key insight is that we need to preprocess the data in a way that lets us answer queries in better than O(n) time.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have the array: `[12, 33, 4, 56, 22, 2, 34, 33, 22, 12, 34, 56]`

We want to answer queries like: "How many times does 33 appear between indices 2 and 7?"

**Brute force approach:** Check each element from index 2 to 7:

- Index 2: 4 (not 33)
- Index 3: 56 (not 33)
- Index 4: 22 (not 33)
- Index 5: 2 (not 33)
- Index 6: 34 (not 33)
- Index 7: 33 (found one!)

This takes O(k) time where k is the length of the query range. For many queries, this becomes O(q \* n) which is too slow.

**Better approach:** What if we had a list of all positions where each value appears? For value 33, its positions are: `[1, 7]` (0-indexed). For value 22: `[4, 8]`. For value 12: `[0, 9]`.

Now, to find how many times 33 appears between indices 2 and 7, we can:

1. Look up the positions list for value 33: `[1, 7]`
2. Find how many positions fall between 2 and 7 inclusive
3. This becomes: count positions ≥ 2 and ≤ 7

We can use binary search to find:

- The first position ≥ 2 (left bound)
- The first position > 7 (right bound)
- The count = right_index - left_index

For `[1, 7]`:

- First position ≥ 2 is at index 1 (value 7)
- First position > 7 is at index 2 (end of list)
- Count = 2 - 1 = 1 ✓

This approach gives us O(log n) per query instead of O(n)!

## Brute Force Approach

The most straightforward solution is to store the array and for each query, iterate through the specified range counting occurrences of the target value:

<div class="code-group">

```python
class RangeFreqQuery:
    def __init__(self, arr):
        self.arr = arr

    def query(self, left, right, value):
        count = 0
        for i in range(left, right + 1):
            if self.arr[i] == value:
                count += 1
        return count
```

```javascript
class RangeFreqQuery {
  constructor(arr) {
    this.arr = arr;
  }

  query(left, right, value) {
    let count = 0;
    for (let i = left; i <= right; i++) {
      if (this.arr[i] === value) {
        count++;
      }
    }
    return count;
  }
}
```

```java
class RangeFreqQuery {
    private int[] arr;

    public RangeFreqQuery(int[] arr) {
        this.arr = arr;
    }

    public int query(int left, int right, int value) {
        int count = 0;
        for (int i = left; i <= right; i++) {
            if (arr[i] == value) {
                count++;
            }
        }
        return count;
    }
}
```

</div>

**Why this fails:** Each query takes O(k) time where k = right - left + 1. In the worst case, k = n (the entire array), so each query is O(n). With q queries, this becomes O(q \* n), which is too slow for the constraints (n up to 10^5, q up to 10^5 would be 10^10 operations).

## Optimized Approach

The key insight is that we need to answer "how many occurrences between left and right" quickly. If we have a sorted list of positions for each value, we can use binary search to find:

1. **First index ≥ left** (lower bound) - the first occurrence at or after the left boundary
2. **First index > right** (upper bound) - the first occurrence after the right boundary

The count is simply: `upper_bound_index - lower_bound_index`

**Why binary search works:** The positions for each value are naturally sorted as we encounter them while building the index. Binary search on a sorted list takes O(log m) time where m is the number of occurrences of that value.

**Data structure choice:** We need a map from value → list of positions. A hash table (dictionary in Python, Map in JavaScript/Java) is perfect for O(1) lookups.

**Building the index:** As we process the array from left to right, we append each index to the list for that value. This ensures the position lists are sorted.

## Optimal Solution

Here's the complete implementation using hash maps and binary search:

<div class="code-group">

```python
# Time: O(n) for construction, O(log k) per query where k is frequency of value
# Space: O(n) for storing position indices
class RangeFreqQuery:
    def __init__(self, arr):
        """
        Initialize the data structure by building an index of positions for each value.
        We store a dictionary where key = value, value = sorted list of indices where it appears.
        """
        self.index_map = {}

        # Build the index: for each value, record all positions where it appears
        for i, num in enumerate(arr):
            if num not in self.index_map:
                self.index_map[num] = []
            self.index_map[num].append(i)

    def query(self, left, right, value):
        """
        Query the frequency of 'value' in the subarray arr[left..right] inclusive.
        Returns the count of occurrences.
        """
        # If value doesn't exist in array at all, return 0 immediately
        if value not in self.index_map:
            return 0

        # Get the sorted list of positions for this value
        positions = self.index_map[value]

        # Find the first position >= left using binary search (bisect_left)
        # bisect_left returns the insertion point to maintain sorted order
        left_idx = self._bisect_left(positions, left)

        # Find the first position > right using binary search (bisect_right)
        # We want positions > right, not >= right
        right_idx = self._bisect_right(positions, right)

        # The count is the difference between these indices
        return right_idx - left_idx

    def _bisect_left(self, arr, target):
        """Custom implementation of bisect_left for binary search."""
        lo, hi = 0, len(arr)
        while lo < hi:
            mid = (lo + hi) // 2
            if arr[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo

    def _bisect_right(self, arr, target):
        """Custom implementation of bisect_right for binary search."""
        lo, hi = 0, len(arr)
        while lo < hi:
            mid = (lo + hi) // 2
            if arr[mid] <= target:
                lo = mid + 1
            else:
                hi = mid
        return lo
```

```javascript
// Time: O(n) for construction, O(log k) per query where k is frequency of value
// Space: O(n) for storing position indices
class RangeFreqQuery {
  constructor(arr) {
    /**
     * Initialize the data structure by building an index of positions for each value.
     * We use a Map where key = value, value = sorted array of indices where it appears.
     */
    this.indexMap = new Map();

    // Build the index: for each value, record all positions where it appears
    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      if (!this.indexMap.has(num)) {
        this.indexMap.set(num, []);
      }
      this.indexMap.get(num).push(i);
    }
  }

  query(left, right, value) {
    /**
     * Query the frequency of 'value' in the subarray arr[left..right] inclusive.
     * Returns the count of occurrences.
     */
    // If value doesn't exist in array at all, return 0 immediately
    if (!this.indexMap.has(value)) {
      return 0;
    }

    // Get the sorted array of positions for this value
    const positions = this.indexMap.get(value);

    // Find the first position >= left using binary search
    const leftIdx = this._lowerBound(positions, left);

    // Find the first position > right using binary search
    const rightIdx = this._upperBound(positions, right);

    // The count is the difference between these indices
    return rightIdx - leftIdx;
  }

  _lowerBound(arr, target) {
    /** Binary search to find first index where arr[index] >= target */
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < target) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  _upperBound(arr, target) {
    /** Binary search to find first index where arr[index] > target */
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] <= target) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }
}
```

```java
// Time: O(n) for construction, O(log k) per query where k is frequency of value
// Space: O(n) for storing position indices
import java.util.*;

class RangeFreqQuery {
    private Map<Integer, List<Integer>> indexMap;

    public RangeFreqQuery(int[] arr) {
        /**
         * Initialize the data structure by building an index of positions for each value.
         * We use a HashMap where key = value, value = sorted list of indices where it appears.
         */
        this.indexMap = new HashMap<>();

        // Build the index: for each value, record all positions where it appears
        for (int i = 0; i < arr.length; i++) {
            int num = arr[i];
            indexMap.putIfAbsent(num, new ArrayList<>());
            indexMap.get(num).add(i);
        }
    }

    public int query(int left, int right, int value) {
        /**
         * Query the frequency of 'value' in the subarray arr[left..right] inclusive.
         * Returns the count of occurrences.
         */
        // If value doesn't exist in array at all, return 0 immediately
        if (!indexMap.containsKey(value)) {
            return 0;
        }

        // Get the sorted list of positions for this value
        List<Integer> positions = indexMap.get(value);

        // Find the first position >= left using binary search
        int leftIdx = lowerBound(positions, left);

        // Find the first position > right using binary search
        int rightIdx = upperBound(positions, right);

        // The count is the difference between these indices
        return rightIdx - leftIdx;
    }

    private int lowerBound(List<Integer> arr, int target) {
        /** Binary search to find first index where arr.get(index) >= target */
        int lo = 0, hi = arr.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr.get(mid) < target) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    private int upperBound(List<Integer> arr, int target) {
        /** Binary search to find first index where arr.get(index) > target */
        int lo = 0, hi = arr.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr.get(mid) <= target) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
}
```

</div>

## Complexity Analysis

**Construction Time:** O(n) - We iterate through the array once to build the index map. Each append operation to the list is O(1).

**Query Time:** O(log k) where k is the number of occurrences of the queried value. We perform two binary searches on the position list. In the worst case, if a value appears many times (like all elements are the same), k = n, so query time is O(log n).

**Space Complexity:** O(n) - We store all array indices in the position lists. Each index appears exactly once across all lists, so total storage is proportional to n.

**Why this is optimal:** For the given constraints (n up to 10^5, q up to 10^5), O(q log n) is acceptable (~10^6 operations), while O(q \* n) is not (~10^10 operations).

## Common Mistakes

1. **Using linear search instead of binary search:** Some candidates correctly build the position index but then iterate through the entire position list to count occurrences. This degenerates to O(k) per query where k could be O(n) in the worst case.

2. **Incorrect binary search bounds:** The most common error is using the wrong comparison operators. Remember:
   - For left bound: find first position ≥ left (not > left)
   - For right bound: find first position > right (not ≥ right)
   - The count is right_bound_index - left_bound_index

3. **Forgetting to handle missing values:** If a value doesn't exist in the array at all, we should return 0 immediately. Without this check, we might try to access a non-existent key in the map.

4. **Confusing inclusive vs exclusive ranges:** The problem specifies inclusive ranges [left, right]. Make sure your binary search accounts for this:
   - Include positions equal to left (≥ left)
   - Exclude positions equal to right when finding the upper bound (we want > right, then subtract)

## When You'll See This Pattern

This "position index + binary search" pattern appears in several range query problems:

1. **Leftmost Column with at Least a One** (LeetCode 1428) - Finding the first column with a 1 in each row uses similar binary search on positions.

2. **Time Based Key-Value Store** (LeetCode 981) - Stores timestamps for each key and uses binary search to find the closest timestamp ≤ given time.

3. **Online Election** (LeetCode 911) - Tracks votes over time and uses binary search to find the leader at any given time.

The core pattern is: when you need to answer "how many X between L and R" queries efficiently, preprocess by grouping items by value and storing sorted positions, then use binary search to count within ranges.

## Key Takeaways

1. **Preprocessing is key for multiple queries:** When you need to answer many queries on the same data, invest in building an efficient index during initialization. The O(n) preprocessing cost is amortized over many queries.

2. **Binary search on sorted positions:** For range frequency queries, storing sorted positions for each value and using binary search gives O(log n) query time. This is much better than O(n) linear scanning.

3. **Map + Lists is a powerful combination:** Using a hash map to group items by value, with lists of positions, is a versatile pattern for many problems involving frequency or range queries.

[Practice this problem on CodeJeet](/problem/range-frequency-queries)
