---
title: "How to Solve Maximum Sum of Subsequence With Non-adjacent Elements — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Sum of Subsequence With Non-adjacent Elements. Hard difficulty, 15.4% acceptance rate. Topics: Array, Divide and Conquer, Dynamic Programming, Segment Tree."
date: "2026-07-02"
category: "dsa-patterns"
tags:
  [
    "maximum-sum-of-subsequence-with-non-adjacent-elements",
    "array",
    "divide-and-conquer",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Maximum Sum of Subsequence With Non-adjacent Elements

This problem asks us to repeatedly update elements in an array and, after each update, compute the maximum sum of a subsequence where no two elements are adjacent. The challenge lies in performing these updates and queries efficiently—recomputing from scratch after each update would be far too slow. This is a classic example of a dynamic problem that requires a data structure to handle point updates and range queries efficiently.

## Visual Walkthrough

Let's build intuition with a small example. Suppose we start with `nums = [3, 2, 5, 8]` and have one query: `[[1, 4]]` (set position 1 to 4).

**Initial state:** `nums = [3, 2, 5, 8]`

For the maximum sum of non-adjacent elements, we can think of this as the "House Robber" problem. Let's compute it manually:

- If we take element 0 (3), we can't take element 1, but can take element 2 or 3
- If we skip element 0, we can take element 1, then skip element 2, take element 3

Let's compute systematically:

- For first element: max sum ending at index 0 is `3`
- For second element: max is `max(3, 2) = 3` (either take first or second)
- For third element: max is `max(5 + 3, 3) = 8` (take third plus best ending two before, or best ending one before)
- For fourth element: max is `max(8 + 3, 8) = 11` (take fourth plus best ending two before, or best ending one before)

So initial answer is `11` (taking elements at positions 0 and 3: 3 + 8 = 11).

**After query:** `nums = [3, 4, 5, 8]`

Now recompute:

- Index 0: `3`
- Index 1: `max(3, 4) = 4`
- Index 2: `max(5 + 3, 4) = 8`
- Index 3: `max(8 + 4, 8) = 12`

New answer is `12` (taking elements at positions 1 and 3: 4 + 8 = 12).

The key insight: when we update one element, we need to efficiently recompute the maximum sum without processing the entire array again. This is where a segment tree with special state comes in.

## Brute Force Approach

A naive approach would be to process each query independently: for each query, update the array at the given position, then run the standard House Robber dynamic programming algorithm to compute the maximum sum of non-adjacent elements.

The House Robber DP algorithm works like this:

- `dp[i]` = maximum sum we can get considering elements up to index i
- `dp[i] = max(dp[i-1], nums[i] + dp[i-2])` (either skip current element, or take it plus best from two positions back)
- Base cases: `dp[0] = nums[0]`, `dp[1] = max(nums[0], nums[1])`

For each of `q` queries, we'd update the array (O(1)) then run DP over `n` elements (O(n)), giving O(q·n) time complexity. With constraints where `n` and `q` can be up to 10^5, this O(10^10) operations is far too slow.

<div class="code-group">

```python
# Brute force solution - TOO SLOW for large inputs
# Time: O(q * n) where q = len(queries), n = len(nums)
# Space: O(n) for the DP array

def maximumSumSubsequence(nums, queries):
    MOD = 10**9 + 7
    result = 0

    for pos, val in queries:
        # Update the array
        nums[pos] = val

        # Recompute maximum sum of non-adjacent elements using DP
        n = len(nums)
        if n == 0:
            continue
        elif n == 1:
            result = (result + max(0, nums[0])) % MOD
            continue

        # Standard House Robber DP
        dp = [0] * n
        dp[0] = max(0, nums[0])
        dp[1] = max(dp[0], max(0, nums[1]))

        for i in range(2, n):
            dp[i] = max(dp[i-1], max(0, nums[i]) + dp[i-2])

        result = (result + dp[n-1]) % MOD

    return result
```

```javascript
// Brute force solution - TOO SLOW for large inputs
// Time: O(q * n) where q = queries.length, n = nums.length
// Space: O(n) for the DP array

function maximumSumSubsequence(nums, queries) {
  const MOD = 10 ** 9 + 7;
  let result = 0;

  for (const [pos, val] of queries) {
    // Update the array
    nums[pos] = val;

    // Recompute maximum sum of non-adjacent elements using DP
    const n = nums.length;
    if (n === 0) continue;
    if (n === 1) {
      result = (result + Math.max(0, nums[0])) % MOD;
      continue;
    }

    // Standard House Robber DP
    const dp = new Array(n).fill(0);
    dp[0] = Math.max(0, nums[0]);
    dp[1] = Math.max(dp[0], Math.max(0, nums[1]));

    for (let i = 2; i < n; i++) {
      dp[i] = Math.max(dp[i - 1], Math.max(0, nums[i]) + dp[i - 2]);
    }

    result = (result + dp[n - 1]) % MOD;
  }

  return result;
}
```

```java
// Brute force solution - TOO SLOW for large inputs
// Time: O(q * n) where q = queries.length, n = nums.length
// Space: O(n) for the DP array

public int maximumSumSubsequence(int[] nums, int[][] queries) {
    final int MOD = 1_000_000_007;
    int result = 0;
    int n = nums.length;

    for (int[] query : queries) {
        int pos = query[0];
        int val = query[1];

        // Update the array
        nums[pos] = val;

        // Recompute maximum sum of non-adjacent elements using DP
        if (n == 0) continue;
        if (n == 1) {
            result = (result + Math.max(0, nums[0])) % MOD;
            continue;
        }

        // Standard House Robber DP
        int[] dp = new int[n];
        dp[0] = Math.max(0, nums[0]);
        dp[1] = Math.max(dp[0], Math.max(0, nums[1]));

        for (int i = 2; i < n; i++) {
            dp[i] = Math.max(dp[i-1], Math.max(0, nums[i]) + dp[i-2]);
        }

        result = (result + dp[n-1]) % MOD;
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we need a data structure that can handle point updates and give us the overall answer quickly. A segment tree is perfect for this, but we need to design what each node stores.

For the House Robber problem on a segment `[l, r]`, we need to know four values for each segment:

1. `dp00`: Maximum sum if we DON'T take the first element and DON'T take the last element
2. `dp01`: Maximum sum if we DON'T take the first element but DO take the last element
3. `dp10`: Maximum sum if we DO take the first element but DON'T take the last element
4. `dp11`: Maximum sum if we DO take the first element and DO take the last element

Why these four states? Because when we combine two adjacent segments, the connection point matters—whether we took the last element of the left segment affects whether we can take the first element of the right segment.

For a single element segment `[i, i]` with value `v`:

- `dp00 = 0` (take neither)
- `dp01 = 0` (can't take last without taking first in single element)
- `dp10 = max(0, v)` (take first, which is also last)
- `dp11 = max(0, v)` (take both, which is the same element)

When merging two segments `left` and `right`:

- To compute new `dp00`: We can either take `left.dp00` and `right.dp00` (neither end), or `left.dp01` and `right.dp10` (but this would have adjacent elements), so actually only `left.dp00 + right.dp00` works
- Actually, we need to consider all valid combinations where the connection doesn't violate adjacency:
  - `new_dp00 = max(left.dp00 + right.dp00, left.dp01 + right.dp00)` (right can't start with taken if left ends with taken)
  - `new_dp01 = max(left.dp00 + right.dp01, left.dp01 + right.dp01)`
  - `new_dp10 = max(left.dp10 + right.dp00, left.dp11 + right.dp00)`
  - `new_dp11 = max(left.dp10 + right.dp01, left.dp11 + right.dp01)`

Wait, let's think more carefully. The correct merging formula is:
For two segments A and B, where A is on the left and B is on the right:

- `dp00` (not take A's first, not take B's last): `max(A.dp00 + B.dp00, A.dp01 + B.dp10)` but actually B.dp10 means take B's first, so that's adjacent to A's last if A.dp01. So correct is: `max(A.dp00 + B.dp00, A.dp01 + B.dp00)`
- Actually, the standard correct merging is:
  - `new_dp00 = max(A.dp00 + B.dp00, A.dp01 + B.dp00)`
  - `new_dp01 = max(A.dp00 + B.dp01, A.dp01 + B.dp01)`
  - `new_dp10 = max(A.dp10 + B.dp00, A.dp11 + B.dp00)`
  - `new_dp11 = max(A.dp10 + B.dp01, A.dp11 + B.dp01)`

But this is getting complex. Let me give you the actual correct insight: For a segment `[l, r]`, we need to store:

- `takeFirst_takeLast`: max sum if we take first and last
- `takeFirst_skipLast`: max sum if we take first but skip last
- `skipFirst_takeLast`: max sum if we skip first but take last
- `skipFirst_skipLast`: max sum if we skip both first and last

Actually, the cleanest formulation that works is what we'll implement: each node stores a 2x2 matrix `dp` where `dp[a][b]` represents the maximum sum for the segment where `a` indicates whether we take the first element (0=no, 1=yes) and `b` indicates whether we take the last element.

## Optimal Solution

We implement a segment tree where each node stores a 2x2 matrix. The root node's answer will be the maximum of all four states (since we can choose whether to take the first or last of the entire array).

<div class="code-group">

```python
# Optimal solution using Segment Tree with 2x2 DP states
# Time: O((n + q) * log n) for building and queries
# Space: O(n) for the segment tree

class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [None] * (4 * self.n)  # Each node stores a 2x2 matrix
        self.build(0, 0, self.n - 1, nums)

    def build(self, node, l, r, nums):
        """Build segment tree recursively"""
        if l == r:
            # Base case: single element
            val = max(0, nums[l])  # We can choose to take or not take
            # dp[a][b] where a=1 if take first, b=1 if take last
            # For single element, first = last
            self.tree[node] = [
                [0, 0],      # dp[0][*]: don't take first
                [0, val]     # dp[1][*]: take first (which is also last)
            ]
            return

        mid = (l + r) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        # Build children
        self.build(left_child, l, mid, nums)
        self.build(right_child, mid + 1, r, nums)

        # Merge children
        self.tree[node] = self.merge(self.tree[left_child], self.tree[right_child])

    def merge(self, left, right):
        """Merge two 2x2 DP matrices from left and right segments"""
        # result[a][b]: a=1 if take first of combined, b=1 if take last of combined
        result = [[0, 0], [0, 0]]

        # Try all 2x2x2 = 8 possibilities for connection
        # Connection is valid if not both taking left's last and right's first
        for a in range(2):      # Take first of left segment?
            for b in range(2):  # Take last of left segment?
                for c in range(2):  # Take first of right segment?
                    for d in range(2):  # Take last of right segment?
                        # Check adjacency constraint: can't have both b and c
                        if b == 1 and c == 1:
                            continue

                        # Total sum for this configuration
                        total = left[a][b] + right[c][d]

                        # Update appropriate result state
                        # First of combined = first of left if we take it (a=1)
                        # Last of combined = last of right if we take it (d=1)
                        result[a][d] = max(result[a][d], total)

        return result

    def update(self, idx, val):
        """Update value at index idx to val"""
        self._update(0, 0, self.n - 1, idx, val)

    def _update(self, node, l, r, idx, val):
        """Recursive update helper"""
        if l == r:
            # Update single element
            val = max(0, val)  # We can choose not to take negative values
            self.tree[node] = [
                [0, 0],
                [0, val]
            ]
            return

        mid = (l + r) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        if idx <= mid:
            self._update(left_child, l, mid, idx, val)
        else:
            self._update(right_child, mid + 1, r, idx, val)

        # Merge children after update
        self.tree[node] = self.merge(self.tree[left_child], self.tree[right_child])

    def query(self):
        """Get the maximum sum for the entire array"""
        if not self.tree:
            return 0

        root = self.tree[0]
        # Answer is max of all states in root
        return max(root[0][0], root[0][1], root[1][0], root[1][1])

def maximumSumSubsequence(nums, queries):
    MOD = 10**9 + 7
    seg_tree = SegmentTree(nums)
    result = 0

    for pos, val in queries:
        seg_tree.update(pos, val)
        result = (result + seg_tree.query()) % MOD

    return result
```

```javascript
// Optimal solution using Segment Tree with 2x2 DP states
// Time: O((n + q) * log n) for building and queries
// Space: O(n) for the segment tree

class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(4 * this.n); // Each node stores a 2x2 matrix
    this.build(0, 0, this.n - 1, nums);
  }

  build(node, l, r, nums) {
    // Base case: single element
    if (l === r) {
      const val = Math.max(0, nums[l]);
      // dp[a][b] where a=1 if take first, b=1 if take last
      this.tree[node] = [
        [0, 0], // dp[0][*]: don't take first
        [0, val], // dp[1][*]: take first (which is also last)
      ];
      return;
    }

    const mid = Math.floor((l + r) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    // Build children
    this.build(leftChild, l, mid, nums);
    this.build(rightChild, mid + 1, r, nums);

    // Merge children
    this.tree[node] = this.merge(this.tree[leftChild], this.tree[rightChild]);
  }

  merge(left, right) {
    // result[a][b]: a=1 if take first of combined, b=1 if take last of combined
    const result = [
      [0, 0],
      [0, 0],
    ];

    // Try all 2x2x2 = 8 possibilities for connection
    for (let a = 0; a < 2; a++) {
      // Take first of left segment?
      for (let b = 0; b < 2; b++) {
        // Take last of left segment?
        for (let c = 0; c < 2; c++) {
          // Take first of right segment?
          for (let d = 0; d < 2; d++) {
            // Take last of right segment?
            // Check adjacency constraint: can't have both b and c
            if (b === 1 && c === 1) continue;

            // Total sum for this configuration
            const total = left[a][b] + right[c][d];

            // Update appropriate result state
            result[a][d] = Math.max(result[a][d], total);
          }
        }
      }
    }

    return result;
  }

  update(idx, val) {
    this._update(0, 0, this.n - 1, idx, val);
  }

  _update(node, l, r, idx, val) {
    if (l === r) {
      val = Math.max(0, val);
      this.tree[node] = [
        [0, 0],
        [0, val],
      ];
      return;
    }

    const mid = Math.floor((l + r) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    if (idx <= mid) {
      this._update(leftChild, l, mid, idx, val);
    } else {
      this._update(rightChild, mid + 1, r, idx, val);
    }

    // Merge children after update
    this.tree[node] = this.merge(this.tree[leftChild], this.tree[rightChild]);
  }

  query() {
    if (!this.tree[0]) return 0;

    const root = this.tree[0];
    // Answer is max of all states in root
    return Math.max(root[0][0], root[0][1], root[1][0], root[1][1]);
  }
}

function maximumSumSubsequence(nums, queries) {
  const MOD = 10 ** 9 + 7;
  const segTree = new SegmentTree(nums);
  let result = 0;

  for (const [pos, val] of queries) {
    segTree.update(pos, val);
    result = (result + segTree.query()) % MOD;
  }

  return result;
}
```

```java
// Optimal solution using Segment Tree with 2x2 DP states
// Time: O((n + q) * log n) for building and queries
// Space: O(n) for the segment tree

class SegmentTree {
    static class Node {
        long[][] dp;  // dp[a][b] where a,b in {0,1}

        Node() {
            dp = new long[2][2];
        }
    }

    private Node[] tree;
    private int n;

    public SegmentTree(int[] nums) {
        n = nums.length;
        tree = new Node[4 * n];
        build(0, 0, n - 1, nums);
    }

    private void build(int node, int l, int r, int[] nums) {
        tree[node] = new Node();

        if (l == r) {
            long val = Math.max(0, nums[l]);
            // dp[0][0] = 0, dp[0][1] = 0 (can't take last without first)
            // dp[1][0] = 0, dp[1][1] = val (take the element)
            tree[node].dp[1][1] = val;
            return;
        }

        int mid = (l + r) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        build(leftChild, l, mid, nums);
        build(rightChild, mid + 1, r, nums);

        merge(node, leftChild, rightChild);
    }

    private void merge(int node, int left, int right) {
        // Initialize all to -infinity
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                tree[node].dp[i][j] = Long.MIN_VALUE;
            }
        }

        // Try all combinations
        for (int a = 0; a < 2; a++) {
            for (int b = 0; b < 2; b++) {
                for (int c = 0; c < 2; c++) {
                    for (int d = 0; d < 2; d++) {
                        // Adjacency constraint
                        if (b == 1 && c == 1) continue;

                        long sum = tree[left].dp[a][b] + tree[right].dp[c][d];
                        tree[node].dp[a][d] = Math.max(tree[node].dp[a][d], sum);
                    }
                }
            }
        }
    }

    public void update(int idx, int val) {
        update(0, 0, n - 1, idx, val);
    }

    private void update(int node, int l, int r, int idx, int val) {
        if (l == r) {
            val = Math.max(0, val);
            // Reset node
            tree[node].dp[0][0] = 0;
            tree[node].dp[0][1] = 0;
            tree[node].dp[1][0] = 0;
            tree[node].dp[1][1] = val;
            return;
        }

        int mid = (l + r) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        if (idx <= mid) {
            update(leftChild, l, mid, idx, val);
        } else {
            update(rightChild, mid + 1, r, idx, val);
        }

        merge(node, leftChild, rightChild);
    }

    public long query() {
        if (tree[0] == null) return 0;

        long[][] root = tree[0].dp;
        return Math.max(Math.max(root[0][0], root[0][1]),
                       Math.max(root[1][0], root[1][1]));
    }
}

class Solution {
    public int maximumSumSubsequence(int[] nums, int[][] queries) {
        final int MOD = 1_000_000_007;
        SegmentTree segTree = new SegmentTree(nums);
        long result = 0;

        for (int[] query : queries) {
            int pos = query[0];
            int val = query[1];

            segTree.update(pos, val);
            result = (result + segTree.query()) % MOD;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + q) log n)

- Building the segment tree takes O(n log n) time (each of n elements is inserted at log n levels)
- Each update query takes O(log n) time (traverse from root to leaf, then merge back up)
- We perform q updates, so total is O((n + q) log n)

**Space Complexity:** O(n)

- The segment tree requires O(4n) nodes, each storing a constant-size 2x2 matrix
- This simplifies to O(n) space

## Common Mistakes

1. **Forgetting to handle negative values:** The problem doesn't explicitly say all numbers are positive. We should use `max(0, val)` when creating leaf nodes since we can always choose not to take a negative element.

2. **Incorrect merging logic:** The adjacency constraint (can't take both the last of left segment and first of right segment) is easy to miss. Always validate your merging logic with small test cases.

3. **Using int when long is needed:** The sums can be large, especially with many queries. Use 64-bit integers (long in Java/JavaScript, normal Python integers handle this) to avoid overflow before applying the modulo.

4. **Not applying modulo correctly:** Apply modulo only to the final result accumulation, not to intermediate DP values in the segment tree, as we need exact values for comparisons during merging.

## When You'll See This Pattern

This "segment tree with custom merge function" pattern appears in problems where you need to answer range queries that depend on the structure of the range, not just simple aggregates like sum or max.

Related LeetCode problems:

1. **House Robber III (LeetCode 337)**: While not using segment trees, it uses similar DP states (take/don't take current node) on a tree structure.
2. **Range Sum Query - Mutable (LeetCode 307)**: Uses segment trees for point updates and range sum queries—a simpler version of this pattern.
3. **Longest Increasing Subsequence after operations**: Problems where you need to maintain LIS through updates often use segment trees with custom states.

## Key Takeaways

1. **Segment trees can store complex state**: Not just sums or maximums, but structured information (like 2x2 matrices) that can be merged according to problem-specific rules.

2. **Break down the problem**: For non-adjacent subsequence problems, the key states are whether we take the first and last elements of a segment. This information is sufficient to merge segments correctly.

3. **Test merging logic thoroughly**: Always test your merge function on small cases. Draw diagrams showing left and right segments with their states to verify adjacency constraints are handled correctly.

[Practice this problem on CodeJeet](/problem/maximum-sum-of-subsequence-with-non-adjacent-elements)
