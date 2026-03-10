---
title: "How to Solve Longest Increasing Subsequence II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Increasing Subsequence II. Hard difficulty, 26.0% acceptance rate. Topics: Array, Divide and Conquer, Dynamic Programming, Binary Indexed Tree, Segment Tree."
date: "2029-09-04"
category: "dsa-patterns"
tags:
  [
    "longest-increasing-subsequence-ii",
    "array",
    "divide-and-conquer",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Longest Increasing Subsequence II

This problem asks us to find the length of the longest strictly increasing subsequence where adjacent elements differ by at most `k`. While the classic Longest Increasing Subsequence (LIS) problem can be solved in O(n log n) with patience sorting, the additional constraint of maximum difference `k` makes this significantly more challenging. The key insight is that we need to efficiently query the maximum LIS length ending with values in a specific range for each new element we process.

## Visual Walkthrough

Let's trace through `nums = [4, 2, 1, 4, 3, 4, 5, 8, 15]` with `k = 3`:

We want to build subsequences where:

1. Elements are strictly increasing
2. Each new element is at most `k` greater than the previous

For each element, we need to find the best previous element that:

- Is less than the current element (for strict increase)
- Is at least `current - k` (to satisfy the difference constraint)

Let's process step by step:

- `4`: No previous elements, LIS length = 1
- `2`: Can't use 4 (2 < 4), LIS length = 1
- `1`: Can't use 2 or 4, LIS length = 1
- `4`: Can use 1, 2, or 4? Wait, must be strictly less than 4, so can use 1 or 2. Best is max(LIS ending with 1, LIS ending with 2) = 1, so LIS length = 2
- `3`: Can use values in range [0, 2] (3-3=0 to 3-1=2). Values available: 1, 2. Best LIS = 1, so length = 2
- `4`: Range [1, 3]. Values: 1, 2, 3. Best LIS = 2 (from 3), so length = 3
- `5`: Range [2, 4]. Values: 2, 3, 4. Best LIS = 3 (from 4), so length = 4
- `8`: Range [5, 7]. No values, so length = 1
- `15`: Range [12, 14]. No values, so length = 1

The answer is 4 (subsequence: 1, 3, 4, 5).

The challenge: For each element, we need to query the maximum LIS length for all values in range `[nums[i]-k, nums[i]-1]` efficiently.

## Brute Force Approach

A naive approach would be to try all possible subsequences using recursion or dynamic programming with O(n²) time complexity:

For each position `i`, we check all previous positions `j < i` where:

1. `nums[j] < nums[i]` (strictly increasing)
2. `nums[i] - nums[j] <= k` (difference constraint)

We maintain `dp[i]` = length of LIS ending at position `i`. Then:

```
dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i] and nums[i] - nums[j] <= k
```

The answer is `max(dp)`.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def lengthOfLIS_bruteforce(nums, k):
    n = len(nums)
    if n == 0:
        return 0

    dp = [1] * n  # dp[i] = length of LIS ending at i
    max_len = 1

    for i in range(n):
        # Check all previous elements
        for j in range(i):
            # Check both conditions
            if nums[j] < nums[i] and nums[i] - nums[j] <= k:
                dp[i] = max(dp[i], dp[j] + 1)
        max_len = max(max_len, dp[i])

    return max_len
```

```javascript
// Time: O(n²) | Space: O(n)
function lengthOfLISBruteforce(nums, k) {
  const n = nums.length;
  if (n === 0) return 0;

  const dp = new Array(n).fill(1); // dp[i] = length of LIS ending at i
  let maxLen = 1;

  for (let i = 0; i < n; i++) {
    // Check all previous elements
    for (let j = 0; j < i; j++) {
      // Check both conditions
      if (nums[j] < nums[i] && nums[i] - nums[j] <= k) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }

  return maxLen;
}
```

```java
// Time: O(n²) | Space: O(n)
public int lengthOfLISBruteforce(int[] nums, int k) {
    int n = nums.length;
    if (n == 0) return 0;

    int[] dp = new int[n];  // dp[i] = length of LIS ending at i
    Arrays.fill(dp, 1);
    int maxLen = 1;

    for (int i = 0; i < n; i++) {
        // Check all previous elements
        for (int j = 0; j < i; j++) {
            // Check both conditions
            if (nums[j] < nums[i] && nums[i] - nums[j] <= k) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }

    return maxLen;
}
```

</div>

**Why this is insufficient:** With n up to 10⁵ in the problem constraints, O(n²) is far too slow (10¹⁰ operations). We need O(n log n) or better.

## Optimized Approach

The key insight is that we need to efficiently query the **maximum dp value** for all numbers in the range `[nums[i]-k, nums[i]-1]` for each new element `nums[i]`. This is a **range maximum query** problem.

We can use a **Segment Tree** or **Binary Indexed Tree (Fenwick Tree)** to:

1. Map each possible value to an index in our data structure
2. Query the maximum LIS length for any range in O(log M) time, where M is the maximum value in nums
3. Update the value for `nums[i]` with the new LIS length ending with that value

**Why not the classic patience sorting approach?** The classic O(n log n) LIS solution doesn't work here because it doesn't account for the `k` constraint. We can't just maintain piles of cards; we need to know which specific values are valid predecessors.

**Step-by-step reasoning:**

1. For each number `x = nums[i]`, valid previous numbers are in range `[x-k, x-1]`
2. We need the maximum LIS length ending with ANY number in that range
3. We maintain a data structure that maps values → best LIS length ending with that value
4. For each `x`, query max in range `[x-k, x-1]`, then update position `x` with `max_found + 1`
5. Track the overall maximum throughout the process

## Optimal Solution

We'll use a Segment Tree because it naturally supports range maximum queries and point updates. The tree will cover the range of possible values in nums.

<div class="code-group">

```python
# Time: O(n log M) where M is max(nums) | Space: O(M)
class SegmentTree:
    def __init__(self, n):
        # Initialize segment tree for range [0, n-1]
        self.n = n
        self.tree = [0] * (4 * n)  # 4x size is safe for all cases

    def update(self, idx, val, node=1, left=0, right=None):
        # Point update: set tree[idx] = max(tree[idx], val)
        if right is None:
            right = self.n - 1

        # Base case: reached the leaf node
        if left == right:
            self.tree[node] = max(self.tree[node], val)
            return

        # Recursive update to left or right child
        mid = (left + right) // 2
        if idx <= mid:
            self.update(idx, val, node*2, left, mid)
        else:
            self.update(idx, val, node*2+1, mid+1, right)

        # Update parent with max of children
        self.tree[node] = max(self.tree[node*2], self.tree[node*2+1])

    def query(self, ql, qr, node=1, left=0, right=None):
        # Range query: max value in [ql, qr]
        if right is None:
            right = self.n - 1

        # No overlap
        if ql > right or qr < left:
            return 0

        # Complete overlap
        if ql <= left and right <= qr:
            return self.tree[node]

        # Partial overlap, query both children
        mid = (left + right) // 2
        left_max = self.query(ql, qr, node*2, left, mid)
        right_max = self.query(ql, qr, node*2+1, mid+1, right)
        return max(left_max, right_max)

def lengthOfLIS(nums, k):
    if not nums:
        return 0

    # Find maximum value to determine segment tree size
    max_val = max(nums)

    # Initialize segment tree (1-indexed values, so size = max_val + 1)
    seg_tree = SegmentTree(max_val + 1)
    result = 0

    for num in nums:
        # Query maximum LIS length for values in [num-k, num-1]
        # Clamp the range to valid bounds [0, max_val]
        left = max(0, num - k)
        right = num - 1

        if left <= right:
            # Get best previous LIS length
            best_prev = seg_tree.query(left, right)
            current = best_prev + 1
        else:
            # No valid previous values
            current = 1

        # Update segment tree with new LIS length ending at 'num'
        seg_tree.update(num, current)

        # Track overall maximum
        result = max(result, current)

    return result
```

```javascript
// Time: O(n log M) where M is max(nums) | Space: O(M)
class SegmentTree {
  constructor(n) {
    this.n = n;
    this.tree = new Array(4 * n).fill(0); // 4x size for segment tree
  }

  // Point update: set tree[idx] = max(tree[idx], val)
  update(idx, val, node = 1, left = 0, right = null) {
    if (right === null) right = this.n - 1;

    // Base case: leaf node
    if (left === right) {
      this.tree[node] = Math.max(this.tree[node], val);
      return;
    }

    // Recursive update
    const mid = Math.floor((left + right) / 2);
    if (idx <= mid) {
      this.update(idx, val, node * 2, left, mid);
    } else {
      this.update(idx, val, node * 2 + 1, mid + 1, right);
    }

    // Update parent with max of children
    this.tree[node] = Math.max(this.tree[node * 2], this.tree[node * 2 + 1]);
  }

  // Range query: max value in [ql, qr]
  query(ql, qr, node = 1, left = 0, right = null) {
    if (right === null) right = this.n - 1;

    // No overlap
    if (ql > right || qr < left) return 0;

    // Complete overlap
    if (ql <= left && right <= qr) return this.tree[node];

    // Partial overlap, query both children
    const mid = Math.floor((left + right) / 2);
    const leftMax = this.query(ql, qr, node * 2, left, mid);
    const rightMax = this.query(ql, qr, node * 2 + 1, mid + 1, right);
    return Math.max(leftMax, rightMax);
  }
}

function lengthOfLIS(nums, k) {
  if (!nums.length) return 0;

  // Find maximum value for segment tree size
  const maxVal = Math.max(...nums);

  // Initialize segment tree (1-indexed values)
  const segTree = new SegmentTree(maxVal + 1);
  let result = 0;

  for (const num of nums) {
    // Query range [num-k, num-1], clamped to valid bounds
    const left = Math.max(0, num - k);
    const right = num - 1;

    let current;
    if (left <= right) {
      // Get best previous LIS length
      const bestPrev = segTree.query(left, right);
      current = bestPrev + 1;
    } else {
      // No valid previous values
      current = 1;
    }

    // Update segment tree
    segTree.update(num, current);

    // Track overall maximum
    result = Math.max(result, current);
  }

  return result;
}
```

```java
// Time: O(n log M) where M is max(nums) | Space: O(M)
class SegmentTree {
    private int[] tree;
    private int n;

    public SegmentTree(int size) {
        this.n = size;
        this.tree = new int[4 * size];  // 4x size for segment tree
    }

    // Point update: set tree[idx] = max(tree[idx], val)
    public void update(int idx, int val) {
        update(1, 0, n - 1, idx, val);
    }

    private void update(int node, int left, int right, int idx, int val) {
        // Base case: leaf node
        if (left == right) {
            tree[node] = Math.max(tree[node], val);
            return;
        }

        // Recursive update
        int mid = left + (right - left) / 2;
        if (idx <= mid) {
            update(node * 2, left, mid, idx, val);
        } else {
            update(node * 2 + 1, mid + 1, right, idx, val);
        }

        // Update parent with max of children
        tree[node] = Math.max(tree[node * 2], tree[node * 2 + 1]);
    }

    // Range query: max value in [ql, qr]
    public int query(int ql, int qr) {
        return query(1, 0, n - 1, ql, qr);
    }

    private int query(int node, int left, int right, int ql, int qr) {
        // No overlap
        if (ql > right || qr < left) return 0;

        // Complete overlap
        if (ql <= left && right <= qr) return tree[node];

        // Partial overlap, query both children
        int mid = left + (right - left) / 2;
        int leftMax = query(node * 2, left, mid, ql, qr);
        int rightMax = query(node * 2 + 1, mid + 1, right, ql, qr);
        return Math.max(leftMax, rightMax);
    }
}

class Solution {
    public int lengthOfLIS(int[] nums, int k) {
        if (nums.length == 0) return 0;

        // Find maximum value for segment tree size
        int maxVal = 0;
        for (int num : nums) {
            maxVal = Math.max(maxVal, num);
        }

        // Initialize segment tree (1-indexed values)
        SegmentTree segTree = new SegmentTree(maxVal + 1);
        int result = 0;

        for (int num : nums) {
            // Query range [num-k, num-1], clamped to valid bounds
            int left = Math.max(0, num - k);
            int right = num - 1;

            int current;
            if (left <= right) {
                // Get best previous LIS length
                int bestPrev = segTree.query(left, right);
                current = bestPrev + 1;
            } else {
                // No valid previous values
                current = 1;
            }

            // Update segment tree
            segTree.update(num, current);

            // Track overall maximum
            result = Math.max(result, current);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log M)

- `n` is the length of nums array
- `M` is the maximum value in nums (up to 200,000 per constraints)
- For each of the `n` elements, we perform:
  - One range query: O(log M)
  - One point update: O(log M)
- Total: O(2n log M) = O(n log M)

**Space Complexity:** O(M)

- The segment tree requires O(4M) ≈ O(M) space
- This is acceptable since M ≤ 200,000 (about 800,000 integers)

**Why this is optimal:** We must examine each element at least once (O(n)), and the range query/update operations can't be done faster than O(log M) with comparison-based data structures. Binary Indexed Tree could also achieve O(n log M) with slightly better constant factors.

## Common Mistakes

1. **Using classic patience sorting O(n log n) approach:** Candidates often try to adapt the standard LIS solution, but it fails because it doesn't account for the `k` constraint on adjacent elements. The piles don't track which specific values are available as predecessors.

2. **Forgetting to clamp the query range:** When `num - k < 0`, we must clamp the left bound to 0. Similarly, when `num - 1 < 0`, the range is invalid. Always check `if left <= right` before querying.

3. **Using array instead of segment tree for large M:** With M up to 200,000, an array of size M would work for updates (O(1)) but queries would be O(k) or O(M), making it O(nk) or O(nM) which is too slow. We need logarithmic queries.

4. **Not handling the strict increase condition correctly:** The range should be `[num-k, num-1]`, not `[num-k, num]`. Using `num` would allow equal elements, violating strict increase.

## When You'll See This Pattern

This **range query with updates** pattern appears in problems where you need to maintain information about values and efficiently query ranges:

1. **Longest Increasing Subsequence (standard):** While the standard LIS uses patience sorting, variations with constraints often need segment trees.
2. **Number of Longest Increasing Subsequence:** Similar structure but tracking counts instead of just lengths.
3. **Range Maximum Query problems:** Any problem requiring frequent max/min/sum queries over ranges with updates.
4. **"Skyline" or interval problems:** Where you need to track the maximum height over a range of x-coordinates.

The key signal is when you need to answer "what's the best value in this range?" many times as you process elements in sequence.

## Key Takeaways

1. **When constraints limit which previous elements can be used**, think in terms of **value ranges** rather than position ranges. Map the problem to querying a data structure by value.

2. **Segment Trees and Fenwick Trees** are essential tools for **range queries with updates**. Know when to use which:
   - Segment trees: More flexible, handle any associative operation
   - Fenwick trees: Simpler, faster, but only for invertible operations (sum, not max without modification)

3. **The "ending with value X" DP state** is powerful when the sequence property depends on actual values, not just positions. This transforms position-based DP into value-based range queries.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Number of Longest Increasing Subsequence](/problem/number-of-longest-increasing-subsequence), [Longest Continuous Increasing Subsequence](/problem/longest-continuous-increasing-subsequence)
