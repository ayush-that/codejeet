---
title: "How to Solve Maximum Segment Sum After Removals — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Segment Sum After Removals. Hard difficulty, 49.3% acceptance rate. Topics: Array, Union-Find, Prefix Sum, Ordered Set."
date: "2026-04-06"
category: "dsa-patterns"
tags: ["maximum-segment-sum-after-removals", "array", "union-find", "prefix-sum", "hard"]
---

# How to Solve Maximum Segment Sum After Removals

This problem asks us to track the maximum segment sum in an array as elements are removed one by one. What makes it tricky is that removals happen in reverse chronological order from our perspective—we need to process queries backwards, adding elements instead of removing them, to efficiently maintain segment information. The challenge lies in efficiently merging adjacent segments and tracking the maximum sum as the array reconstructs.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums = [1, 2, 5, 6, 1]
removeQueries = [0, 3, 2, 4, 1]
```

Initially, all elements are removed. We'll process queries in **reverse order**, adding elements back:

**Step 1 (Processing query 4 → index 1):**

- Add nums[1] = 2 at index 1
- Segments: [2] (sum = 2)
- Maximum segment sum = 2

**Step 2 (Processing query 3 → index 4):**

- Add nums[4] = 1 at index 4
- Segments: [2] at index 1, [1] at index 4 (no merging)
- Maximum segment sum = max(2, 1) = 2

**Step 3 (Processing query 2 → index 2):**

- Add nums[2] = 5 at index 2
- This connects segments [2] and [1] through index 2
- New segment: [2, 5, 1] (sum = 8)
- Maximum segment sum = 8

**Step 4 (Processing query 1 → index 3):**

- Add nums[3] = 6 at index 3
- This connects to the segment [2, 5, 1] at index 2
- New segment: [2, 5, 6, 1] (sum = 14)
- Maximum segment sum = 14

**Step 5 (Processing query 0 → index 0):**

- Add nums[0] = 1 at index 0
- This connects to the segment [2, 5, 6, 1] at index 1
- New segment: [1, 2, 5, 6, 1] (sum = 15)
- Maximum segment sum = 15

Our answer (in reverse order of processing): [15, 14, 8, 2, 2]
But we need to reverse this to match the original query order: [2, 2, 8, 14, 15]

## Brute Force Approach

A naive approach would process queries in the given order:

1. For each query, remove the element at the specified index
2. Scan the array to find all segments (contiguous positive integers)
3. Calculate the sum of each segment
4. Track the maximum sum

This requires O(n) time per query to scan the array, leading to O(n²) total time complexity. For n up to 10⁵, this is far too slow (10¹⁰ operations).

The key insight is that **removing elements breaks segments apart**, which is hard to track efficiently. However, if we reverse the process and **add elements back**, we can merge adjacent segments using Union-Find (Disjoint Set Union), which gives us near-constant time operations.

## Optimized Approach

The optimal solution uses a **reverse processing** approach with **Union-Find**:

**Key Insight:** Process queries backwards, treating each step as adding an element back to the array. When we add an element, it might:

1. Create a new single-element segment
2. Merge with the segment to its left (if that element has been added)
3. Merge with the segment to its right (if that element has been added)
4. Connect left and right segments into one larger segment

**Data Structures:**

- **Union-Find:** To efficiently merge segments and track their sums
- **Parent array:** To track which segment each index belongs to
- **Segment sum array:** To store the sum of each segment's root
- **Visited array:** To track which indices have been added back
- **Max-heap or tracking variable:** To maintain the current maximum segment sum

**Algorithm Steps:**

1. Initialize all elements as removed (not visited)
2. Process queries in reverse order
3. For each query index:
   - Mark the index as visited
   - Create a new segment with sum = nums[index]
   - Check left neighbor: if visited, merge segments
   - Check right neighbor: if visited, merge segments
   - Update the maximum segment sum
4. Reverse the results to match original query order

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * α(n)) ≈ O(n) where α is the inverse Ackermann function
# Space: O(n) for parent, sum, and visited arrays
class DSU:
    def __init__(self, n, nums):
        self.parent = list(range(n))  # Each element starts as its own parent
        self.sum = nums[:]  # Segment sum for each root
        self.rank = [0] * n  # For union by rank optimization

    def find(self, x):
        # Path compression: flatten the tree
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank: attach smaller tree to larger tree
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return

        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x

        self.parent[root_y] = root_x
        self.sum[root_x] += self.sum[root_y]

        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1

class Solution:
    def maximumSegmentSum(self, nums, removeQueries):
        n = len(nums)
        dsu = DSU(n, nums)
        visited = [False] * n  # Track which indices have been added back
        result = [0] * n
        current_max = 0

        # Process queries in reverse order
        for i in range(n - 1, -1, -1):
            idx = removeQueries[i]
            visited[idx] = True

            # Check left neighbor
            if idx > 0 and visited[idx - 1]:
                dsu.union(idx, idx - 1)

            # Check right neighbor
            if idx < n - 1 and visited[idx + 1]:
                dsu.union(idx, idx + 1)

            # Get the sum of the current segment
            root = dsu.find(idx)
            current_max = max(current_max, dsu.sum[root])

            # Store result for this step (will be reversed later)
            result[i] = current_max

        return result
```

```javascript
// Time: O(n * α(n)) ≈ O(n) where α is the inverse Ackermann function
// Space: O(n) for parent, sum, and visited arrays
class DSU {
  constructor(n, nums) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.sum = [...nums]; // Segment sum for each root
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      [rootX, rootY] = [rootY, rootX];
    }

    this.parent[rootY] = rootX;
    this.sum[rootX] += this.sum[rootY];

    if (this.rank[rootX] === this.rank[rootY]) {
      this.rank[rootX]++;
    }
  }
}

/**
 * @param {number[]} nums
 * @param {number[]} removeQueries
 * @return {number[]}
 */
var maximumSegmentSum = function (nums, removeQueries) {
  const n = nums.length;
  const dsu = new DSU(n, nums);
  const visited = new Array(n).fill(false);
  const result = new Array(n);
  let currentMax = 0;

  // Process queries in reverse order
  for (let i = n - 1; i >= 0; i--) {
    const idx = removeQueries[i];
    visited[idx] = true;

    // Check left neighbor
    if (idx > 0 && visited[idx - 1]) {
      dsu.union(idx, idx - 1);
    }

    // Check right neighbor
    if (idx < n - 1 && visited[idx + 1]) {
      dsu.union(idx, idx + 1);
    }

    // Get the sum of the current segment
    const root = dsu.find(idx);
    currentMax = Math.max(currentMax, dsu.sum[root]);

    // Store result for this step
    result[i] = currentMax;
  }

  return result;
};
```

```java
// Time: O(n * α(n)) ≈ O(n) where α is the inverse Ackermann function
// Space: O(n) for parent, sum, and visited arrays
class DSU {
    int[] parent;
    long[] sum;  // Use long to prevent overflow with large sums
    int[] rank;

    public DSU(int n, int[] nums) {
        parent = new int[n];
        sum = new long[n];
        rank = new int[n];

        for (int i = 0; i < n; i++) {
            parent[i] = i;
            sum[i] = nums[i];
            rank[i] = 0;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by rank
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        if (rank[rootX] < rank[rootY]) {
            int temp = rootX;
            rootX = rootY;
            rootY = temp;
        }

        parent[rootY] = rootX;
        sum[rootX] += sum[rootY];

        if (rank[rootX] == rank[rootY]) {
            rank[rootX]++;
        }
    }
}

class Solution {
    public long[] maximumSegmentSum(int[] nums, int[] removeQueries) {
        int n = nums.length;
        DSU dsu = new DSU(n, nums);
        boolean[] visited = new boolean[n];
        long[] result = new long[n];
        long currentMax = 0;

        // Process queries in reverse order
        for (int i = n - 1; i >= 0; i--) {
            int idx = removeQueries[i];
            visited[idx] = true;

            // Check left neighbor
            if (idx > 0 && visited[idx - 1]) {
                dsu.union(idx, idx - 1);
            }

            // Check right neighbor
            if (idx < n - 1 && visited[idx + 1]) {
                dsu.union(idx, idx + 1);
            }

            // Get the sum of the current segment
            int root = dsu.find(idx);
            currentMax = Math.max(currentMax, dsu.sum[root]);

            // Store result for this step
            result[i] = currentMax;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × α(n)) ≈ O(n)

- We process n queries
- Each Union-Find operation (find and union) takes amortized O(α(n)) time, where α is the inverse Ackermann function (effectively constant for practical n)
- Total: O(n × α(n)) ≈ O(n)

**Space Complexity:** O(n)

- Parent array: O(n)
- Segment sum array: O(n)
- Visited array: O(n)
- Result array: O(n)
- Total: O(n)

## Common Mistakes

1. **Processing queries in forward order:** This leads to O(n²) time complexity. Always consider if reversing the process (adding instead of removing) simplifies the problem.

2. **Forgetting to check both neighbors:** When adding an element at index i, you must check both i-1 and i+1. Missing either can leave segments unmerged.

3. **Not using path compression or union by rank:** Without these optimizations, Union-Find operations degrade to O(n) worst-case, making the solution O(n²).

4. **Incorrectly tracking maximum sum:** Some candidates try to maintain a max-heap of segment sums, but this requires removing old sums when segments merge. It's simpler to just track the current maximum after each merge.

## When You'll See This Pattern

This "reverse processing with Union-Find" pattern appears in problems where elements are removed/destroyed over time, and you need to track connectivity or aggregates:

1. **Number of Islands II (LeetCode 305):** Similar reverse thinking—adding land instead of removing it to track island counts.

2. **Longest Consecutive Sequence (LeetCode 128):** Union-Find can connect consecutive numbers, though the problem has simpler solutions.

3. **Removing Stones to Minimize Total (LeetCode 1962):** Different approach but similar theme of processing removals efficiently.

The key insight is recognizing that **destruction is hard to track, but construction is easy with Union-Find**.

## Key Takeaways

1. **Think in reverse:** When dealing with sequential removals, consider processing backwards as additions. This often transforms a hard problem into an easier one.

2. **Union-Find for dynamic connectivity:** Use DSU when you need to merge sets and track their properties (size, sum, etc.) efficiently over time.

3. **Segment = connected component:** In array problems, a contiguous segment of elements sharing a property can be treated as nodes in a graph, where adjacency means index difference of 1.

[Practice this problem on CodeJeet](/problem/maximum-segment-sum-after-removals)
