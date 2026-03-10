---
title: "How to Solve Falling Squares — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Falling Squares. Hard difficulty, 47.4% acceptance rate. Topics: Array, Segment Tree, Ordered Set."
date: "2029-01-31"
category: "dsa-patterns"
tags: ["falling-squares", "array", "segment-tree", "ordered-set", "hard"]
---

# How to Solve Falling Squares

Imagine dropping squares onto a number line, where each new square might land on top of previous ones, increasing the overall height. The challenge is to track the **maximum height** after each square is dropped. This problem is tricky because squares can partially overlap, and we need to efficiently query and update height information across intervals. It's essentially a **dynamic interval max query** problem, similar to building a skyline but with squares arriving in sequence.

## Visual Walkthrough

Let's trace through `positions = [[1, 2], [2, 3], [6, 1]]`:

1. **Square 1**: Left edge at x=1, side length 2 (covers x=1 to x=3). Height starts at 0, so new height = 2. Current max height = 2.
2. **Square 2**: Left edge at x=2, side length 3 (covers x=2 to x=5). It overlaps with square 1 from x=2 to x=3. The maximum height in this overlap region is 2, so square 2 sits on top, reaching height 2 + 3 = 5. Now max height = 5.
3. **Square 3**: Left edge at x=6, side length 1 (covers x=6 to x=7). No overlap, height = 1. Max height remains 5.

Output: `[2, 5, 5]`

The key challenge: for each new square, we need to find the **maximum height** in its interval `[left, left + sideLength)`, then update all points in that interval to the new height. Doing this naively is expensive.

## Brute Force Approach

A brute force solution simulates the process directly:

- Maintain an array `heights` where `heights[x]` stores the current height at coordinate x.
- For each square `[left, side]`:
  1. Find max height in `heights[left]` to `heights[left + side - 1]`
  2. New height = max height + side
  3. Update all positions in that range to new height
  4. Track overall max height

**Why it's insufficient**: Coordinates can be up to 10^8, so we can't store every x. Even with coordinate compression, updating ranges is O(range length) per square, leading to O(n \* W) time where W is the compressed coordinate range width. With n up to 1000, this can be O(n²) in worst case.

## Optimized Approach

The core insight: we need **efficient range max queries and range updates**. This is a classic use case for a **Segment Tree with Lazy Propagation**.

**Key steps:**

1. **Coordinate Compression**: Collect all unique x-coordinates where height changes could occur (left and right edges of all squares). This reduces the coordinate space from 10^8 to at most 2n points.
2. **Segment Tree**: Build a segment tree over compressed coordinates where each node stores:
   - `max_height`: maximum height in this interval
   - `lazy`: pending height updates to propagate to children
3. **Processing Squares**: For each square `[left, side]`:
   - Find compressed indices for `left` and `right = left + side`
   - Query max height in `[left, right)` range
   - New height = max height + side
   - Update `[left, right)` range to new height
   - Track overall max height

**Why this works**: Segment trees allow O(log n) range queries and updates after O(n log n) preprocessing. The lazy propagation ensures we don't explicitly update every leaf node.

## Optimal Solution

Here's the complete implementation using coordinate compression and segment tree with lazy propagation:

<div class="code-group">

```python
# Time: O(n log n) for building tree + O(n log n) for processing = O(n log n)
# Space: O(n) for compressed coordinates + O(n) for segment tree = O(n)
class SegmentTree:
    def __init__(self, n):
        self.n = n
        # 4*n is safe upper bound for segment tree size
        self.max_height = [0] * (4 * n)
        self.lazy = [0] * (4 * n)

    def _push_down(self, idx):
        """Propagate lazy updates to children"""
        if self.lazy[idx] != 0:
            # Update children's max heights
            self.max_height[idx * 2] = max(self.max_height[idx * 2], self.lazy[idx])
            self.max_height[idx * 2 + 1] = max(self.max_height[idx * 2 + 1], self.lazy[idx])
            # Propagate lazy values to children
            self.lazy[idx * 2] = max(self.lazy[idx * 2], self.lazy[idx])
            self.lazy[idx * 2 + 1] = max(self.lazy[idx * 2 + 1], self.lazy[idx])
            # Clear current node's lazy value
            self.lazy[idx] = 0

    def _update(self, idx, l, r, ql, qr, val):
        """Update range [ql, qr) to have at least height val"""
        if ql >= r or qr <= l:
            return  # No overlap
        if ql <= l and r <= qr:
            # Complete overlap: update this node
            self.max_height[idx] = max(self.max_height[idx], val)
            self.lazy[idx] = max(self.lazy[idx], val)
            return

        # Partial overlap: push down and recurse
        self._push_down(idx)
        mid = (l + r) // 2
        self._update(idx * 2, l, mid, ql, qr, val)
        self._update(idx * 2 + 1, mid, r, ql, qr, val)
        # Update parent from children
        self.max_height[idx] = max(self.max_height[idx * 2], self.max_height[idx * 2 + 1])

    def _query(self, idx, l, r, ql, qr):
        """Query max height in range [ql, qr)"""
        if ql >= r or qr <= l:
            return 0  # No overlap
        if ql <= l and r <= qr:
            return self.max_height[idx]  # Complete overlap

        # Partial overlap: push down and recurse
        self._push_down(idx)
        mid = (l + r) // 2
        left_max = self._query(idx * 2, l, mid, ql, qr)
        right_max = self._query(idx * 2 + 1, mid, r, ql, qr)
        return max(left_max, right_max)

    def update(self, ql, qr, val):
        """Public update method"""
        self._update(1, 0, self.n, ql, qr, val)

    def query(self, ql, qr):
        """Public query method"""
        return self._query(1, 0, self.n, ql, qr)

class Solution:
    def fallingSquares(self, positions):
        # Step 1: Coordinate compression
        points = set()
        for left, side in positions:
            right = left + side
            points.add(left)
            points.add(right)

        # Sort unique points
        sorted_points = sorted(points)
        # Map coordinate to index
        coord_to_idx = {coord: i for i, coord in enumerate(sorted_points)}

        # Step 2: Initialize segment tree
        n = len(sorted_points)
        seg_tree = SegmentTree(n)

        # Step 3: Process squares
        result = []
        current_max = 0

        for left, side in positions:
            right = left + side
            # Convert coordinates to compressed indices
            l_idx = coord_to_idx[left]
            r_idx = coord_to_idx[right]

            # Query max height in current square's range
            max_in_range = seg_tree.query(l_idx, r_idx)

            # New height for this square
            new_height = max_in_range + side

            # Update the range with new height
            seg_tree.update(l_idx, r_idx, new_height)

            # Update overall max height
            current_max = max(current_max, new_height)
            result.append(current_max)

        return result
```

```javascript
// Time: O(n log n) | Space: O(n)
class SegmentTree {
  constructor(n) {
    this.n = n;
    this.maxHeight = new Array(4 * n).fill(0);
    this.lazy = new Array(4 * n).fill(0);
  }

  _pushDown(idx) {
    // Propagate lazy updates to children
    if (this.lazy[idx] !== 0) {
      const lazyVal = this.lazy[idx];
      // Update children's max heights
      this.maxHeight[idx * 2] = Math.max(this.maxHeight[idx * 2], lazyVal);
      this.maxHeight[idx * 2 + 1] = Math.max(this.maxHeight[idx * 2 + 1], lazyVal);
      // Propagate lazy values to children
      this.lazy[idx * 2] = Math.max(this.lazy[idx * 2], lazyVal);
      this.lazy[idx * 2 + 1] = Math.max(this.lazy[idx * 2 + 1], lazyVal);
      // Clear current node's lazy value
      this.lazy[idx] = 0;
    }
  }

  _update(idx, l, r, ql, qr, val) {
    // Update range [ql, qr) to have at least height val
    if (ql >= r || qr <= l) return; // No overlap

    if (ql <= l && r <= qr) {
      // Complete overlap: update this node
      this.maxHeight[idx] = Math.max(this.maxHeight[idx], val);
      this.lazy[idx] = Math.max(this.lazy[idx], val);
      return;
    }

    // Partial overlap: push down and recurse
    this._pushDown(idx);
    const mid = Math.floor((l + r) / 2);
    this._update(idx * 2, l, mid, ql, qr, val);
    this._update(idx * 2 + 1, mid, r, ql, qr, val);
    // Update parent from children
    this.maxHeight[idx] = Math.max(this.maxHeight[idx * 2], this.maxHeight[idx * 2 + 1]);
  }

  _query(idx, l, r, ql, qr) {
    // Query max height in range [ql, qr)
    if (ql >= r || qr <= l) return 0; // No overlap

    if (ql <= l && r <= qr) {
      return this.maxHeight[idx]; // Complete overlap
    }

    // Partial overlap: push down and recurse
    this._pushDown(idx);
    const mid = Math.floor((l + r) / 2);
    const leftMax = this._query(idx * 2, l, mid, ql, qr);
    const rightMax = this._query(idx * 2 + 1, mid, r, ql, qr);
    return Math.max(leftMax, rightMax);
  }

  update(ql, qr, val) {
    // Public update method
    this._update(1, 0, this.n, ql, qr, val);
  }

  query(ql, qr) {
    // Public query method
    return this._query(1, 0, this.n, ql, qr);
  }
}

var fallingSquares = function (positions) {
  // Step 1: Coordinate compression
  const points = new Set();
  for (const [left, side] of positions) {
    const right = left + side;
    points.add(left);
    points.add(right);
  }

  // Sort unique points
  const sortedPoints = Array.from(points).sort((a, b) => a - b);
  // Map coordinate to index
  const coordToIdx = new Map();
  sortedPoints.forEach((coord, idx) => coordToIdx.set(coord, idx));

  // Step 2: Initialize segment tree
  const n = sortedPoints.length;
  const segTree = new SegmentTree(n);

  // Step 3: Process squares
  const result = [];
  let currentMax = 0;

  for (const [left, side] of positions) {
    const right = left + side;
    // Convert coordinates to compressed indices
    const lIdx = coordToIdx.get(left);
    const rIdx = coordToIdx.get(right);

    // Query max height in current square's range
    const maxInRange = segTree.query(lIdx, rIdx);

    // New height for this square
    const newHeight = maxInRange + side;

    // Update the range with new height
    segTree.update(lIdx, rIdx, newHeight);

    // Update overall max height
    currentMax = Math.max(currentMax, newHeight);
    result.push(currentMax);
  }

  return result;
};
```

```java
// Time: O(n log n) | Space: O(n)
class SegmentTree {
    private int n;
    private int[] maxHeight;
    private int[] lazy;

    public SegmentTree(int n) {
        this.n = n;
        // 4*n is safe upper bound for segment tree size
        this.maxHeight = new int[4 * n];
        this.lazy = new int[4 * n];
    }

    private void pushDown(int idx) {
        // Propagate lazy updates to children
        if (lazy[idx] != 0) {
            int lazyVal = lazy[idx];
            // Update children's max heights
            maxHeight[idx * 2] = Math.max(maxHeight[idx * 2], lazyVal);
            maxHeight[idx * 2 + 1] = Math.max(maxHeight[idx * 2 + 1], lazyVal);
            // Propagate lazy values to children
            lazy[idx * 2] = Math.max(lazy[idx * 2], lazyVal);
            lazy[idx * 2 + 1] = Math.max(lazy[idx * 2 + 1], lazyVal);
            // Clear current node's lazy value
            lazy[idx] = 0;
        }
    }

    private void update(int idx, int l, int r, int ql, int qr, int val) {
        // Update range [ql, qr) to have at least height val
        if (ql >= r || qr <= l) return; // No overlap

        if (ql <= l && r <= qr) {
            // Complete overlap: update this node
            maxHeight[idx] = Math.max(maxHeight[idx], val);
            lazy[idx] = Math.max(lazy[idx], val);
            return;
        }

        // Partial overlap: push down and recurse
        pushDown(idx);
        int mid = l + (r - l) / 2;
        update(idx * 2, l, mid, ql, qr, val);
        update(idx * 2 + 1, mid, r, ql, qr, val);
        // Update parent from children
        maxHeight[idx] = Math.max(maxHeight[idx * 2], maxHeight[idx * 2 + 1]);
    }

    private int query(int idx, int l, int r, int ql, int qr) {
        // Query max height in range [ql, qr)
        if (ql >= r || qr <= l) return 0; // No overlap

        if (ql <= l && r <= qr) {
            return maxHeight[idx]; // Complete overlap
        }

        // Partial overlap: push down and recurse
        pushDown(idx);
        int mid = l + (r - l) / 2;
        int leftMax = query(idx * 2, l, mid, ql, qr);
        int rightMax = query(idx * 2 + 1, mid, r, ql, qr);
        return Math.max(leftMax, rightMax);
    }

    public void update(int ql, int qr, int val) {
        // Public update method
        update(1, 0, n, ql, qr, val);
    }

    public int query(int ql, int qr) {
        // Public query method
        return query(1, 0, n, ql, qr);
    }
}

class Solution {
    public List<Integer> fallingSquares(int[][] positions) {
        // Step 1: Coordinate compression
        Set<Integer> points = new HashSet<>();
        for (int[] pos : positions) {
            int left = pos[0];
            int side = pos[1];
            int right = left + side;
            points.add(left);
            points.add(right);
        }

        // Sort unique points
        List<Integer> sortedPoints = new ArrayList<>(points);
        Collections.sort(sortedPoints);

        // Map coordinate to index
        Map<Integer, Integer> coordToIdx = new HashMap<>();
        for (int i = 0; i < sortedPoints.size(); i++) {
            coordToIdx.put(sortedPoints.get(i), i);
        }

        // Step 2: Initialize segment tree
        int n = sortedPoints.size();
        SegmentTree segTree = new SegmentTree(n);

        // Step 3: Process squares
        List<Integer> result = new ArrayList<>();
        int currentMax = 0;

        for (int[] pos : positions) {
            int left = pos[0];
            int side = pos[1];
            int right = left + side;

            // Convert coordinates to compressed indices
            int lIdx = coordToIdx.get(left);
            int rIdx = coordToIdx.get(right);

            // Query max height in current square's range
            int maxInRange = segTree.query(lIdx, rIdx);

            // New height for this square
            int newHeight = maxInRange + side;

            // Update the range with new height
            segTree.update(lIdx, rIdx, newHeight);

            // Update overall max height
            currentMax = Math.max(currentMax, newHeight);
            result.add(currentMax);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Coordinate compression: O(n log n) for sorting unique points
- Segment tree operations: Each square requires O(log n) query and O(log n) update
- Total: O(n log n) for n squares

**Space Complexity: O(n)**

- Coordinate compression: O(n) for storing unique points and mapping
- Segment tree: O(n) for tree arrays (4n is typical allocation)

## Common Mistakes

1. **Forgetting coordinate compression**: Attempting to create arrays sized for the full coordinate range (up to 10^8) will cause memory overflow. Always compress coordinates first.

2. **Incorrect interval handling**: Using `[left, left + sideLength]` instead of `[left, left + sideLength)` (right-exclusive). The square covers from left to just before right edge.

3. **Missing lazy propagation**: Without lazy propagation, segment tree updates become O(n) instead of O(log n), leading to O(n²) time. Remember that range updates need lazy propagation for efficiency.

4. **Not tracking overall maximum**: The problem asks for maximum height _after each square_, not just the height of the current square. You need to maintain a running maximum.

## When You'll See This Pattern

This problem combines **coordinate compression** with **segment tree with lazy propagation** for efficient range queries and updates. You'll see similar patterns in:

1. **The Skyline Problem (Hard)**: Also involves tracking heights across intervals and finding maximum heights. Uses sweep line algorithm but shares the interval max query concept.

2. **Range Sum Query - Mutable (Medium)**: Basic segment tree problem for range sum queries and point updates.

3. **Range Module (Hard)**: Tracks intervals and supports add/remove/query operations, similar to maintaining height intervals.

## Key Takeaways

1. **When you need efficient range queries/updates on large coordinate spaces**, think: coordinate compression + segment tree.

2. **Lazy propagation is essential** for O(log n) range updates. Without it, you're back to O(n) per update.

3. **Interval problems often involve exclusive right boundaries**. Pay attention to whether intervals are `[l, r]` or `[l, r)`.

Related problems: [The Skyline Problem](/problem/the-skyline-problem)
