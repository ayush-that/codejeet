---
title: "How to Solve Peaks in Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Peaks in Array. Hard difficulty, 27.2% acceptance rate. Topics: Array, Binary Indexed Tree, Segment Tree."
date: "2026-04-19"
category: "dsa-patterns"
tags: ["peaks-in-array", "array", "binary-indexed-tree", "segment-tree", "hard"]
---

# How to Solve Peaks in Array

This problem asks us to count peaks in subarrays of a given array, where a peak is an element greater than both its neighbors. We need to handle two types of queries efficiently: counting peaks in a range, and updating array elements. The challenge is that naive approaches would be too slow for large inputs, requiring us to find a way to answer range queries and perform updates quickly.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Initial array:** `nums = [3, 1, 4, 2, 5]`

First, let's identify all peaks in the entire array:

- Index 0 (3): No left neighbor → not a peak
- Index 1 (1): 1 < 3 and 1 < 4 → not a peak
- Index 2 (4): 4 > 1 and 4 > 2 → **PEAK** ✓
- Index 3 (2): 2 < 4 and 2 < 5 → not a peak
- Index 4 (5): No right neighbor → not a peak

So we have 1 peak at index 2.

Now consider query `[1, 0, 4]` (count peaks from index 0 to 4):

- We should return 1 (the peak at index 2)

What about query `[1, 1, 3]` (indices 1-3):

- Index 1 (1): 1 < 3 and 1 < 4 → not a peak
- Index 2 (4): 4 > 1 and 4 > 2 → **PEAK** ✓
- Index 3 (2): 2 < 4 and 2 < ? (no right neighbor in range) → not a peak
- Result: 1 peak

Now consider an update query `[2, 2, 6]` (set nums[2] = 6):

- New array: `[3, 1, 6, 2, 5]`
- Check affected peaks: index 2 and its neighbors (1 and 3)
- Index 1 (1): Still 1 < 3 and 1 < 6 → not a peak
- Index 2 (6): 6 > 1 and 6 > 2 → **PEAK** ✓ (still a peak)
- Index 3 (2): 2 < 6 and 2 < 5 → not a peak

The key insight: each update only affects at most 3 positions (the updated index and its two neighbors). We need a data structure that can:

1. Quickly tell us if a specific index is a peak
2. Efficiently count peaks in any range
3. Handle updates that change peak status of up to 3 indices

## Brute Force Approach

The brute force solution would process each query independently:

For count queries `[1, l, r]`:

- Iterate from `l+1` to `r-1` (since endpoints can't be peaks)
- For each index `i`, check if `nums[i] > nums[i-1]` and `nums[i] > nums[i+1]`
- Count all such indices

For update queries `[2, index, val]`:

- Simply set `nums[index] = val`

**Why this fails:**

- Each count query takes O(r-l) time, which could be O(n) for large ranges
- With q queries, worst-case time becomes O(q × n), which is too slow for constraints where n and q can be up to 10^5
- We need to answer count queries much faster than O(range size)

## Optimized Approach

The key insight is that we need to maintain information about which indices are peaks and support:

1. **Range sum queries**: Count how many peaks are in a given range
2. **Point updates**: When we update an element, we need to update the peak status of that index and its neighbors

This is a classic use case for a **Binary Indexed Tree (Fenwick Tree)** or **Segment Tree**:

- We maintain a binary array `isPeak` where `isPeak[i] = 1` if index i is a peak, else 0
- The BIT/Segment Tree stores prefix sums of `isPeak`, allowing us to get range sums in O(log n)
- When we update `nums[index]`, we check and update `isPeak` for indices `index-1`, `index`, and `index+1`
- Each update affects at most 3 positions, and updating each takes O(log n)

**Step-by-step reasoning:**

1. **Initialization**:
   - Create `isPeak` array by checking each interior element (indices 1 to n-2)
   - Build BIT/Segment Tree from `isPeak` array

2. **Count query `[1, l, r]`**:
   - If `r - l < 2`, return 0 (range too small to contain peaks)
   - Query BIT for sum from `l+1` to `r-1` (peaks can only exist in interior of range)

3. **Update query `[2, index, val]`**:
   - Update `nums[index] = val`
   - For each affected index `i` in `{index-1, index, index+1}`:
     - Check if `i` is a valid index and could be a peak (1 ≤ i ≤ n-2)
     - Determine new peak status: `nums[i] > nums[i-1] and nums[i] > nums[i+1]`
     - If `isPeak[i]` changed, update BIT with delta (+1 or -1)

## Optimal Solution

Here's the complete solution using Binary Indexed Tree (Fenwick Tree), which is simpler to implement than Segment Tree for this problem:

<div class="code-group">

```python
# Time: O((n + q) * log n) where n = len(nums), q = len(queries)
# Space: O(n) for BIT and isPeak array
class Solution:
    def countOfPeaks(self, nums, queries):
        n = len(nums)

        # Helper function to check if index i is a peak
        def is_peak_index(i):
            # Peak must have both neighbors and be greater than them
            return 0 < i < n - 1 and nums[i] > nums[i - 1] and nums[i] > nums[i + 1]

        # Binary Indexed Tree (Fenwick Tree) implementation
        class BIT:
            def __init__(self, n):
                self.n = n
                self.tree = [0] * (n + 1)  # 1-indexed

            def update(self, i, delta):
                # Add delta to position i (1-indexed)
                while i <= self.n:
                    self.tree[i] += delta
                    i += i & -i  # Move to next responsible index

            def query(self, i):
                # Prefix sum from 1 to i (1-indexed)
                res = 0
                while i > 0:
                    res += self.tree[i]
                    i -= i & -i  # Move to parent
                return res

            def range_sum(self, l, r):
                # Sum from l to r inclusive (1-indexed)
                if l > r:
                    return 0
                return self.query(r) - self.query(l - 1)

        # Initialize BIT and isPeak array
        bit = BIT(n)
        isPeak = [False] * n

        # Mark initial peaks and build BIT
        for i in range(1, n - 1):
            if is_peak_index(i):
                isPeak[i] = True
                bit.update(i + 1, 1)  # BIT is 1-indexed, so add 1 to index

        results = []

        # Process each query
        for query in queries:
            if query[0] == 1:
                # Count peaks in range [l, r]
                l, r = query[1], query[2]
                if r - l < 2:
                    # Range too small to contain peaks (need at least 3 elements)
                    results.append(0)
                else:
                    # Query peaks in interior indices (l+1 to r-1)
                    # Convert to 1-indexed for BIT: l+1 becomes l+2, r-1 becomes r
                    count = bit.range_sum(l + 2, r)
                    results.append(count)

            else:  # query[0] == 2
                # Update value at index
                idx, val = query[1], query[2]
                nums[idx] = val

                # Update peak status for affected indices: idx-1, idx, idx+1
                for i in range(idx - 1, idx + 2):
                    if 0 <= i < n:
                        new_peak_status = is_peak_index(i)
                        if new_peak_status != isPeak[i]:
                            # Status changed, update BIT
                            delta = 1 if new_peak_status else -1
                            bit.update(i + 1, delta)  # Convert to 1-indexed
                            isPeak[i] = new_peak_status

        return results
```

```javascript
// Time: O((n + q) * log n) where n = nums.length, q = queries.length
// Space: O(n) for BIT and isPeak array
var countOfPeaks = function (nums, queries) {
  const n = nums.length;

  // Helper function to check if index i is a peak
  const isPeakIndex = (i) => {
    // Peak must have both neighbors and be greater than them
    return i > 0 && i < n - 1 && nums[i] > nums[i - 1] && nums[i] > nums[i + 1];
  };

  // Binary Indexed Tree (Fenwick Tree) implementation
  class BIT {
    constructor(n) {
      this.n = n;
      this.tree = new Array(n + 1).fill(0); // 1-indexed
    }

    update(i, delta) {
      // Add delta to position i (1-indexed)
      while (i <= this.n) {
        this.tree[i] += delta;
        i += i & -i; // Move to next responsible index
      }
    }

    query(i) {
      // Prefix sum from 1 to i (1-indexed)
      let res = 0;
      while (i > 0) {
        res += this.tree[i];
        i -= i & -i; // Move to parent
      }
      return res;
    }

    rangeSum(l, r) {
      // Sum from l to r inclusive (1-indexed)
      if (l > r) return 0;
      return this.query(r) - this.query(l - 1);
    }
  }

  // Initialize BIT and isPeak array
  const bit = new BIT(n);
  const isPeak = new Array(n).fill(false);

  // Mark initial peaks and build BIT
  for (let i = 1; i < n - 1; i++) {
    if (isPeakIndex(i)) {
      isPeak[i] = true;
      bit.update(i + 1, 1); // BIT is 1-indexed, so add 1 to index
    }
  }

  const results = [];

  // Process each query
  for (const query of queries) {
    if (query[0] === 1) {
      // Count peaks in range [l, r]
      const l = query[1],
        r = query[2];
      if (r - l < 2) {
        // Range too small to contain peaks (need at least 3 elements)
        results.push(0);
      } else {
        // Query peaks in interior indices (l+1 to r-1)
        // Convert to 1-indexed for BIT: l+1 becomes l+2, r-1 becomes r
        const count = bit.rangeSum(l + 2, r);
        results.push(count);
      }
    } else {
      // query[0] === 2
      // Update value at index
      const idx = query[1],
        val = query[2];
      nums[idx] = val;

      // Update peak status for affected indices: idx-1, idx, idx+1
      for (let i = idx - 1; i <= idx + 1; i++) {
        if (i >= 0 && i < n) {
          const newPeakStatus = isPeakIndex(i);
          if (newPeakStatus !== isPeak[i]) {
            // Status changed, update BIT
            const delta = newPeakStatus ? 1 : -1;
            bit.update(i + 1, delta); // Convert to 1-indexed
            isPeak[i] = newPeakStatus;
          }
        }
      }
    }
  }

  return results;
};
```

```java
// Time: O((n + q) * log n) where n = nums.length, q = queries.length
// Space: O(n) for BIT and isPeak array
class Solution {
    public List<Integer> countOfPeaks(int[] nums, int[][] queries) {
        int n = nums.length;

        // Helper function to check if index i is a peak
        // Using instance method to access nums
        java.util.function.IntPredicate isPeakIndex = (i) ->
            i > 0 && i < n - 1 && nums[i] > nums[i - 1] && nums[i] > nums[i + 1];

        // Binary Indexed Tree (Fenwick Tree) implementation
        class BIT {
            int n;
            int[] tree;

            BIT(int size) {
                this.n = size;
                this.tree = new int[size + 1];  // 1-indexed
            }

            void update(int i, int delta) {
                // Add delta to position i (1-indexed)
                while (i <= n) {
                    tree[i] += delta;
                    i += i & -i;  // Move to next responsible index
                }
            }

            int query(int i) {
                // Prefix sum from 1 to i (1-indexed)
                int res = 0;
                while (i > 0) {
                    res += tree[i];
                    i -= i & -i;  // Move to parent
                }
                return res;
            }

            int rangeSum(int l, int r) {
                // Sum from l to r inclusive (1-indexed)
                if (l > r) return 0;
                return query(r) - query(l - 1);
            }
        }

        // Initialize BIT and isPeak array
        BIT bit = new BIT(n);
        boolean[] isPeak = new boolean[n];

        // Mark initial peaks and build BIT
        for (int i = 1; i < n - 1; i++) {
            if (isPeakIndex.test(i)) {
                isPeak[i] = true;
                bit.update(i + 1, 1);  // BIT is 1-indexed, so add 1 to index
            }
        }

        List<Integer> results = new ArrayList<>();

        // Process each query
        for (int[] query : queries) {
            if (query[0] == 1) {
                // Count peaks in range [l, r]
                int l = query[1], r = query[2];
                if (r - l < 2) {
                    // Range too small to contain peaks (need at least 3 elements)
                    results.add(0);
                } else {
                    // Query peaks in interior indices (l+1 to r-1)
                    // Convert to 1-indexed for BIT: l+1 becomes l+2, r-1 becomes r
                    int count = bit.rangeSum(l + 2, r);
                    results.add(count);
                }
            } else {  // query[0] == 2
                // Update value at index
                int idx = query[1], val = query[2];
                nums[idx] = val;

                // Update peak status for affected indices: idx-1, idx, idx+1
                for (int i = idx - 1; i <= idx + 1; i++) {
                    if (i >= 0 && i < n) {
                        boolean newPeakStatus = isPeakIndex.test(i);
                        if (newPeakStatus != isPeak[i]) {
                            // Status changed, update BIT
                            int delta = newPeakStatus ? 1 : -1;
                            bit.update(i + 1, delta);  // Convert to 1-indexed
                            isPeak[i] = newPeakStatus;
                        }
                    }
                }
            }
        }

        return results;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization**: O(n log n) to build the BIT from the initial peaks
- **Count queries**: O(log n) each, using BIT range sum query
- **Update queries**: O(log n) each, since we update at most 3 positions in BIT
- **Overall**: O((n + q) log n) where n is array length and q is number of queries

**Space Complexity:**

- O(n) for the Binary Indexed Tree
- O(n) for the `isPeak` array
- **Overall**: O(n) additional space

## Common Mistakes

1. **Forgetting that endpoints can't be peaks**: A peak requires both left and right neighbors. When counting in range [l, r], we should only check indices from l+1 to r-1. Candidates often include l and r in their checks.

2. **Not handling small ranges correctly**: When r-l < 2, there can't be any peaks (need at least 3 elements). Failing to check this leads to index out of bounds or incorrect counts.

3. **Incorrect BIT index conversion**: BIT is 1-indexed while our array is 0-indexed. Forgetting to add 1 when calling BIT methods is a common off-by-one error.

4. **Not updating all affected indices after a change**: When nums[i] changes, it affects the peak status of indices i-1, i, and i+1. Some candidates only update index i, leading to incorrect peak counts after updates.

## When You'll See This Pattern

This pattern of maintaining a binary array and supporting range sum queries with point updates appears in many problems:

1. **Range Sum Query - Mutable (LeetCode 307)**: Similar structure but simpler - just maintain the array itself in a BIT/Segment Tree.

2. **Count of Range Sum (LeetCode 327)**: Uses BIT to count prefix sums within a range, though with a different transformation.

3. **Number of Longest Increasing Subsequence (LeetCode 673)**: Can be solved with BIT by maintaining counts for each length.

The key recognition pattern: when you need to answer range queries (sum/count/min/max) on an array that gets updated, and naive approaches would be O(n) per query, think BIT/Segment Tree.

## Key Takeaways

1. **BIT/Segment Tree for dynamic range queries**: When you need to support both range queries and point updates efficiently, Binary Indexed Tree or Segment Tree are the go-to data structures.

2. **Local changes have limited impact**: In this problem, updating one element only affects peak status of 3 indices. Recognizing such locality can simplify update logic.

3. **Transform the problem**: Instead of working directly with the array values, we transformed to a binary "isPeak" array. This simplification made it easier to apply standard range query techniques.

[Practice this problem on CodeJeet](/problem/peaks-in-array)
