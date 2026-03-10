---
title: "How to Solve Range Sum Query - Mutable — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Range Sum Query - Mutable. Medium difficulty, 42.6% acceptance rate. Topics: Array, Divide and Conquer, Design, Binary Indexed Tree, Segment Tree."
date: "2027-10-27"
category: "dsa-patterns"
tags: ["range-sum-query-mutable", "array", "divide-and-conquer", "design", "medium"]
---

# How to Solve Range Sum Query - Mutable

This problem asks us to design a data structure that efficiently handles two operations on an array: updating individual elements and calculating range sums. What makes this problem interesting is that we need both operations to be efficient—naive approaches either make updates fast but queries slow, or queries fast but updates slow. The challenge is finding a data structure that balances both operations, which is why this is a classic segment tree/BIT problem.

## Visual Walkthrough

Let's walk through an example with `nums = [1, 3, 5, 7, 9, 11]`:

**Initialization:** We need to build a data structure that lets us quickly answer queries like "sum from index 2 to 5" (indices 0-based).

**Query Example:** `sumRange(2, 5)` should return `5 + 7 + 9 + 11 = 32`.

**Update Example:** `update(3, 10)` changes the array to `[1, 3, 5, 10, 9, 11]`. Now `sumRange(2, 5)` should return `5 + 10 + 9 + 11 = 35`.

The naive approach would be to store the array and:

- For updates: directly modify the array (O(1))
- For queries: iterate through the range and sum (O(n))

But if we have many queries, this becomes O(k\*n) which is too slow. We need a smarter structure.

## Brute Force Approach

The most straightforward solution is to store the array as-is and implement the operations directly:

- **Update(index, val):** Simply set `nums[index] = val` (O(1) time)
- **SumRange(left, right):** Iterate from `left` to `right` and sum all elements (O(n) time)

While updates are fast, queries are slow, especially if we have many queries. If we have `q` queries, the total time becomes O(q\*n), which is unacceptable for large `n` and `q`.

<div class="code-group">

```python
class NumArray:
    def __init__(self, nums: List[int]):
        # Store the original array
        self.nums = nums.copy()

    def update(self, index: int, val: int) -> None:
        # Direct update - O(1)
        self.nums[index] = val

    def sumRange(self, left: int, right: int) -> int:
        # Iterate through range - O(n)
        total = 0
        for i in range(left, right + 1):
            total += self.nums[i]
        return total
```

```javascript
class NumArray {
  constructor(nums) {
    // Store the original array
    this.nums = [...nums];
  }

  update(index, val) {
    // Direct update - O(1)
    this.nums[index] = val;
  }

  sumRange(left, right) {
    // Iterate through range - O(n)
    let total = 0;
    for (let i = left; i <= right; i++) {
      total += this.nums[i];
    }
    return total;
  }
}
```

```java
class NumArray {
    private int[] nums;

    public NumArray(int[] nums) {
        // Store the original array
        this.nums = nums.clone();
    }

    public void update(int index, int val) {
        // Direct update - O(1)
        nums[index] = val;
    }

    public int sumRange(int left, int right) {
        // Iterate through range - O(n)
        int total = 0;
        for (int i = left; i <= right; i++) {
            total += nums[i];
        }
        return total;
    }
}
```

</div>

## Optimized Approach

We need both operations to be efficient. The key insight is that we can precompute some information about the array that makes queries faster, but we need to update this information efficiently when values change.

Two common data structures solve this:

1. **Segment Tree:** A binary tree where each node stores information about a segment of the array (here, the sum). Both updates and queries take O(log n).
2. **Binary Indexed Tree (Fenwick Tree):** A more space-efficient structure that also supports both operations in O(log n).

The segment tree is more intuitive for beginners, while BIT is more concise. I'll explain the segment tree approach since it's more generalizable to other range operations (min, max, etc.).

**Segment Tree Concept:**

- We build a binary tree where leaves represent individual array elements
- Each internal node represents the sum of its children's segments
- To query a range, we combine results from O(log n) nodes
- To update a value, we update the leaf and propagate changes up to the root (O(log n) nodes)

**Building the Tree:**

- For an array of size `n`, we need about `4*n` space (worst case)
- We build recursively: each node stores the sum of its segment

**Query Operation:**

- We check if the query range completely covers a node's segment → return its value
- If no overlap → return 0
- If partial overlap → query both children and sum results

**Update Operation:**

- Find the leaf node, update it
- Propagate the change up to the root by updating parent nodes

## Optimal Solution

Here's the segment tree implementation with detailed comments:

<div class="code-group">

```python
class NumArray:
    # Time: O(n) for build, O(log n) for update/query
    # Space: O(4*n) ≈ O(n) for segment tree

    def __init__(self, nums: List[int]):
        self.n = len(nums)
        if self.n == 0:
            return

        # Segment tree needs about 4*n space in worst case
        self.tree = [0] * (4 * self.n)
        self.nums = nums

        # Build the segment tree
        self._build(0, 0, self.n - 1)

    def _build(self, node: int, start: int, end: int) -> None:
        # Build tree recursively
        # node: current node index in tree array
        # start, end: segment range in original array

        if start == end:
            # Leaf node - store the array value
            self.tree[node] = self.nums[start]
            return

        # Split segment into two halves
        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        # Build left and right subtrees
        self._build(left_child, start, mid)
        self._build(right_child, mid + 1, end)

        # Internal node stores sum of its children
        self.tree[node] = self.tree[left_child] + self.tree[right_child]

    def update(self, index: int, val: int) -> None:
        if self.n == 0:
            return

        # Update value in original array
        self.nums[index] = val

        # Update segment tree
        self._update(0, 0, self.n - 1, index, val)

    def _update(self, node: int, start: int, end: int, idx: int, val: int) -> None:
        # Update tree recursively
        # idx: index in original array to update

        if start == end:
            # Found the leaf node to update
            self.tree[node] = val
            return

        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        if idx <= mid:
            # Index is in left subtree
            self._update(left_child, start, mid, idx, val)
        else:
            # Index is in right subtree
            self._update(right_child, mid + 1, end, idx, val)

        # Update current node with sum of children
        self.tree[node] = self.tree[left_child] + self.tree[right_child]

    def sumRange(self, left: int, right: int) -> int:
        if self.n == 0:
            return 0

        # Query the segment tree
        return self._query(0, 0, self.n - 1, left, right)

    def _query(self, node: int, start: int, end: int, l: int, r: int) -> int:
        # Query sum in range [l, r]

        if r < start or l > end:
            # No overlap with current segment
            return 0

        if l <= start and end <= r:
            # Current segment completely inside query range
            return self.tree[node]

        # Partial overlap - query both children
        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        left_sum = self._query(left_child, start, mid, l, r)
        right_sum = self._query(right_child, mid + 1, end, l, r)

        return left_sum + right_sum
```

```javascript
class NumArray {
  // Time: O(n) for build, O(log n) for update/query
  // Space: O(4*n) ≈ O(n) for segment tree

  constructor(nums) {
    this.n = nums.length;
    if (this.n === 0) return;

    this.nums = [...nums];
    // Segment tree array (4*n is safe upper bound)
    this.tree = new Array(4 * this.n).fill(0);

    // Build the segment tree
    this._build(0, 0, this.n - 1);
  }

  _build(node, start, end) {
    // Build tree recursively
    if (start === end) {
      // Leaf node
      this.tree[node] = this.nums[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    // Build left and right subtrees
    this._build(leftChild, start, mid);
    this._build(rightChild, mid + 1, end);

    // Internal node stores sum of children
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  update(index, val) {
    if (this.n === 0) return;

    // Update original array
    this.nums[index] = val;

    // Update segment tree
    this._update(0, 0, this.n - 1, index, val);
  }

  _update(node, start, end, idx, val) {
    // Update tree recursively
    if (start === end) {
      // Found the leaf node
      this.tree[node] = val;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    if (idx <= mid) {
      // Index in left subtree
      this._update(leftChild, start, mid, idx, val);
    } else {
      // Index in right subtree
      this._update(rightChild, mid + 1, end, idx, val);
    }

    // Update current node
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  sumRange(left, right) {
    if (this.n === 0) return 0;

    return this._query(0, 0, this.n - 1, left, right);
  }

  _query(node, start, end, l, r) {
    // Query sum in range [l, r]
    if (r < start || l > end) {
      // No overlap
      return 0;
    }

    if (l <= start && end <= r) {
      // Complete overlap
      return this.tree[node];
    }

    // Partial overlap
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    const leftSum = this._query(leftChild, start, mid, l, r);
    const rightSum = this._query(rightChild, mid + 1, end, l, r);

    return leftSum + rightSum;
  }
}
```

```java
class NumArray {
    // Time: O(n) for build, O(log n) for update/query
    // Space: O(4*n) ≈ O(n) for segment tree

    private int[] tree;
    private int[] nums;
    private int n;

    public NumArray(int[] nums) {
        this.n = nums.length;
        if (n == 0) return;

        this.nums = nums.clone();
        // Segment tree needs 4*n space in worst case
        this.tree = new int[4 * n];

        // Build the segment tree
        build(0, 0, n - 1);
    }

    private void build(int node, int start, int end) {
        // Build tree recursively
        if (start == end) {
            // Leaf node
            tree[node] = nums[start];
            return;
        }

        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        // Build left and right subtrees
        build(leftChild, start, mid);
        build(rightChild, mid + 1, end);

        // Internal node stores sum of children
        tree[node] = tree[leftChild] + tree[rightChild];
    }

    public void update(int index, int val) {
        if (n == 0) return;

        // Update original array
        nums[index] = val;

        // Update segment tree
        updateTree(0, 0, n - 1, index, val);
    }

    private void updateTree(int node, int start, int end, int idx, int val) {
        // Update tree recursively
        if (start == end) {
            // Found the leaf node
            tree[node] = val;
            return;
        }

        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        if (idx <= mid) {
            // Index in left subtree
            updateTree(leftChild, start, mid, idx, val);
        } else {
            // Index in right subtree
            updateTree(rightChild, mid + 1, end, idx, val);
        }

        // Update current node
        tree[node] = tree[leftChild] + tree[rightChild];
    }

    public int sumRange(int left, int right) {
        if (n == 0) return 0;

        return query(0, 0, n - 1, left, right);
    }

    private int query(int node, int start, int end, int l, int r) {
        // Query sum in range [l, r]
        if (r < start || l > end) {
            // No overlap
            return 0;
        }

        if (l <= start && end <= r) {
            // Complete overlap
            return tree[node];
        }

        // Partial overlap
        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        int leftSum = query(leftChild, start, mid, l, r);
        int rightSum = query(rightChild, mid + 1, end, l, r);

        return leftSum + rightSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Construction:** O(n) - we visit each array element once to build the tree
- **Update:** O(log n) - we traverse from leaf to root, updating O(log n) nodes
- **Query:** O(log n) - we combine results from O(log n) nodes in the tree

**Space Complexity:** O(4*n) ≈ O(n) for the segment tree array. The 4*n bound is a safe upper bound for a binary tree stored in an array.

## Common Mistakes

1. **Using prefix sums without handling updates:** Some candidates try to use prefix sums (like in Range Sum Query - Immutable), forgetting that updates would require O(n) time to rebuild the prefix array. This makes updates too slow.

2. **Incorrect tree size allocation:** The segment tree needs about 4*n space. Using exactly 2*n or n will cause index out of bounds errors for certain tree shapes.

3. **Off-by-one errors in range queries:** Forgetting the `+1` when iterating from `left` to `right` (should be `i <= right`, not `i < right`). In the segment tree, confusing when to use `mid` vs `mid+1` when splitting segments.

4. **Not handling empty array:** Forgetting to check if `nums` is empty in constructor and operations can lead to null pointer/index errors.

5. **Mixing 0-based and 1-based indexing:** Segment trees can be implemented with either, but mixing approaches leads to incorrect parent-child calculations.

## When You'll See This Pattern

The segment tree/BIT pattern appears whenever you need to efficiently perform **range queries** with **point updates**. Common variations include:

1. **Range Minimum/Maximum Query:** Instead of sum, find min/max in a range (LeetCode 239, 1546)
2. **Range with other operations:** Count of specific values, GCD, etc.
3. **2D versions:** Range queries on matrices (LeetCode 308 - Range Sum Query 2D - Mutable)
4. **Lazy propagation:** When you need range updates (update all values in a range)

Specific related problems:

- **Range Sum Query - Immutable (303):** Simpler version with only queries (use prefix sums)
- **Range Sum Query 2D - Mutable (308):** 2D version of this problem
- **Count of Range Sum (327):** More advanced problem using segment trees/BIT
- **Shifting Letters II (2381):** Can be solved with difference array or segment tree

## Key Takeaways

1. **When you need both range queries and updates efficiently**, think segment tree or BIT. Prefix sums are great for queries only, direct array access is great for updates only, but segment tree/BIT gives you O(log n) for both.

2. **Segment tree is a general pattern** that can be adapted for various operations (sum, min, max, count, etc.) by changing what each node stores and how nodes are combined.

3. **The 4\*n space allocation** is important to remember - a binary tree stored in an array needs extra space for internal nodes that may not be filled in a complete binary tree.

4. **Practice both segment tree and BIT** - BIT is more concise for sums but segment tree is more intuitive and generalizable to other operations.

Related problems: [Range Sum Query - Immutable](/problem/range-sum-query-immutable), [Range Sum Query 2D - Mutable](/problem/range-sum-query-2d-mutable), [Shifting Letters II](/problem/shifting-letters-ii)
