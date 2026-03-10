---
title: "How to Solve Handling Sum Queries After Update — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Handling Sum Queries After Update. Hard difficulty, 30.5% acceptance rate. Topics: Array, Segment Tree."
date: "2026-07-12"
category: "dsa-patterns"
tags: ["handling-sum-queries-after-update", "array", "segment-tree", "hard"]
---

# How to Solve Handling Sum Queries After Update

This problem presents a challenging scenario where we need to efficiently handle two types of operations on binary arrays: flipping ranges of bits and calculating sums of products. The core difficulty lies in the fact that we have up to 10⁵ queries, making a naive O(n) per query approach infeasible. What makes this problem particularly interesting is how it cleverly combines bit manipulation with range update techniques, requiring us to think beyond simple array operations.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Initial state:**

```
nums1 = [1, 0, 1, 1, 0]  (binary array)
nums2 = [2, 3, 4, 5, 6]  (integer array)
```

**Query 1:** `[1, 1, 3]` - Flip nums1 indices 1 through 3

```
Before: nums1 = [1, 0, 1, 1, 0]
Flip indices 1-3:
  index 1: 0 → 1
  index 2: 1 → 0
  index 3: 1 → 0
After: nums1 = [1, 1, 0, 0, 0]
```

**Query 2:** `[2, 0, 4]` - Calculate sum of nums1[i] \* nums2[i] for i=0 to 4

```
nums1 = [1, 1, 0, 0, 0]
nums2 = [2, 3, 4, 5, 6]
Sum = (1×2) + (1×3) + (0×4) + (0×5) + (0×6) = 2 + 3 = 5
```

**Query 3:** `[1, 0, 4]` - Flip entire array

```
Before: nums1 = [1, 1, 0, 0, 0]
Flip all: 1→0, 1→0, 0→1, 0→1, 0→1
After: nums1 = [0, 0, 1, 1, 1]
```

**Query 4:** `[2, 0, 4]` - Calculate sum again

```
nums1 = [0, 0, 1, 1, 1]
nums2 = [2, 3, 4, 5, 6]
Sum = (0×2) + (0×3) + (1×4) + (1×5) + (1×6) = 4 + 5 + 6 = 15
```

The challenge becomes apparent: with up to 10⁵ queries and array lengths up to 10⁵, flipping ranges naively would take O(n) per flip query, leading to O(n²) worst-case time.

## Brute Force Approach

The most straightforward approach would be to:

1. For type 1 queries (flip): iterate from `l` to `r` and flip each bit in nums1
2. For type 2 queries (sum): iterate from `l` to `r` and calculate sum of nums1[i] \* nums2[i]

Here's what that looks like:

<div class="code-group">

```python
# Time: O(q * n) | Space: O(1) - Too slow for constraints!
def handleQuery(nums1, nums2, queries):
    result = []

    for query in queries:
        if query[0] == 1:  # Type 1: flip range
            l, r = query[1], query[2]
            for i in range(l, r + 1):
                nums1[i] = 1 - nums1[i]  # Flip bit

        elif query[0] == 2:  # Type 2: update nums2
            p = query[1]
            for i in range(len(nums2)):
                nums2[i] += nums1[i] * p

        else:  # Type 3: sum query
            total = 0
            for i in range(len(nums1)):
                total += nums1[i] * nums2[i]
            result.append(total)

    return result
```

```javascript
// Time: O(q * n) | Space: O(1) - Too slow for constraints!
function handleQuery(nums1, nums2, queries) {
  const result = [];

  for (const query of queries) {
    if (query[0] === 1) {
      // Type 1: flip range
      const l = query[1],
        r = query[2];
      for (let i = l; i <= r; i++) {
        nums1[i] = 1 - nums1[i]; // Flip bit
      }
    } else if (query[0] === 2) {
      // Type 2: update nums2
      const p = query[1];
      for (let i = 0; i < nums2.length; i++) {
        nums2[i] += nums1[i] * p;
      }
    } else {
      // Type 3: sum query
      let total = 0;
      for (let i = 0; i < nums1.length; i++) {
        total += nums1[i] * nums2[i];
      }
      result.push(total);
    }
  }

  return result;
}
```

```java
// Time: O(q * n) | Space: O(1) - Too slow for constraints!
public long[] handleQuery(int[] nums1, int[] nums2, int[][] queries) {
    List<Long> resultList = new ArrayList<>();

    for (int[] query : queries) {
        if (query[0] == 1) {  // Type 1: flip range
            int l = query[1], r = query[2];
            for (int i = l; i <= r; i++) {
                nums1[i] = 1 - nums1[i];  // Flip bit
            }
        } else if (query[0] == 2) {  // Type 2: update nums2
            int p = query[1];
            for (int i = 0; i < nums2.length; i++) {
                nums2[i] += (long) nums1[i] * p;
            }
        } else {  // Type 3: sum query
            long total = 0;
            for (int i = 0; i < nums1.length; i++) {
                total += (long) nums1[i] * nums2[i];
            }
            resultList.add(total);
        }
    }

    long[] result = new long[resultList.size()];
    for (int i = 0; i < resultList.size(); i++) {
        result[i] = resultList.get(i);
    }
    return result;
}
```

</div>

**Why this fails:** With n, q ≤ 10⁵, the worst-case time complexity is O(q × n) = 10¹⁰ operations, which is far too slow. We need a way to handle range flips in better than O(n) time.

## Optimized Approach

The key insight is that we need to efficiently handle two operations:

1. **Range flip** (0→1, 1→0) on a binary array
2. **Sum calculation** of nums1[i] × nums2[i]

For the range flip operation, we can use a **Segment Tree with lazy propagation**. Here's why:

- Segment trees allow O(log n) range updates and queries
- Since we're flipping bits (0↔1), we can track the count of 1s in each segment
- Flipping a range means: new count of 1s = (segment length - current count of 1s)

For the sum calculation, we need another insight: when we flip bits in nums1, how does it affect the sum?

- Let `totalSum` = sum of all nums2[i]
- Let `sumOnes` = sum of nums2[i] where nums1[i] = 1
- When we flip a range, the new `sumOnes` = current `sumOnes` - sum of nums2[i] in flipped positions where nums1[i] = 1 + sum of nums2[i] in flipped positions where nums1[i] = 0

But there's an even better approach: notice that type 2 queries update nums2 based on nums1. This means we can track:

- `sumNums2`: total sum of nums2 array
- `countOnes`: number of 1s in nums1

When we have a type 2 query with value `p`:

- Each position where nums1[i] = 1 contributes `p` to nums2[i]
- So total increase in sumNums2 = `countOnes × p`

This gives us O(1) updates for type 2 queries!

## Optimal Solution

We'll use a segment tree to efficiently track and update the count of 1s in nums1, and maintain running sums for nums2.

<div class="code-group">

```python
# Time: O((n + q) log n) | Space: O(n)
class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)  # segment tree storing count of 1s
        self.lazy = [False] * (4 * self.n)  # lazy propagation for flips

        # Build the segment tree
        self._build(0, 0, self.n - 1, nums)

    def _build(self, node, start, end, nums):
        """Build segment tree from nums array"""
        if start == end:
            # Leaf node: store 1 if nums[start] is 1, else 0
            self.tree[node] = nums[start]
            return

        mid = (start + end) // 2
        self._build(2 * node + 1, start, mid, nums)
        self._build(2 * node + 2, mid + 1, end, nums)

        # Internal node: sum of children
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def _push(self, node, start, end):
        """Push lazy update to children"""
        if self.lazy[node]:
            # Flip operation: new count = total elements - current count
            self.tree[node] = (end - start + 1) - self.tree[node]

            # Mark children for lazy update if not leaf
            if start != end:
                self.lazy[2 * node + 1] = not self.lazy[2 * node + 1]
                self.lazy[2 * node + 2] = not self.lazy[2 * node + 2]

            # Reset current node's lazy flag
            self.lazy[node] = False

    def update(self, l, r):
        """Flip bits in range [l, r]"""
        self._update(0, 0, self.n - 1, l, r)

    def _update(self, node, start, end, l, r):
        """Internal update method with lazy propagation"""
        # Push any pending updates
        self._push(node, start, end)

        # No overlap
        if start > r or end < l:
            return

        # Complete overlap
        if l <= start and end <= r:
            # Flip the lazy flag
            self.lazy[node] = not self.lazy[node]
            # Push the update to current node
            self._push(node, start, end)
            return

        # Partial overlap
        mid = (start + end) // 2
        self._update(2 * node + 1, start, mid, l, r)
        self._update(2 * node + 2, mid + 1, end, l, r)

        # Update current node from children
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self):
        """Get total count of 1s in entire array"""
        return self.tree[0]

def handleQuery(nums1, nums2, queries):
    n = len(nums1)
    seg_tree = SegmentTree(nums1)

    # Calculate initial sum of nums2
    total_sum = sum(nums2)
    result = []

    for query in queries:
        if query[0] == 1:  # Type 1: flip range in nums1
            l, r = query[1], query[2]
            seg_tree.update(l, r)

        elif query[0] == 2:  # Type 2: update nums2 based on nums1
            p = query[1]
            # Each 1 in nums1 contributes p to total_sum
            count_ones = seg_tree.query()
            total_sum += count_ones * p

        else:  # Type 3: query total sum
            result.append(total_sum)

    return result
```

```javascript
// Time: O((n + q) log n) | Space: O(n)
class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(4 * this.n).fill(0); // count of 1s
    this.lazy = new Array(4 * this.n).fill(false); // lazy flip flags

    this._build(0, 0, this.n - 1, nums);
  }

  _build(node, start, end, nums) {
    if (start === end) {
      this.tree[node] = nums[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    this._build(2 * node + 1, start, mid, nums);
    this._build(2 * node + 2, mid + 1, end, nums);

    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  _push(node, start, end) {
    if (this.lazy[node]) {
      // Flip: new count = total elements - current count
      this.tree[node] = end - start + 1 - this.tree[node];

      if (start !== end) {
        this.lazy[2 * node + 1] = !this.lazy[2 * node + 1];
        this.lazy[2 * node + 2] = !this.lazy[2 * node + 2];
      }

      this.lazy[node] = false;
    }
  }

  update(l, r) {
    this._update(0, 0, this.n - 1, l, r);
  }

  _update(node, start, end, l, r) {
    this._push(node, start, end);

    if (start > r || end < l) return;

    if (l <= start && end <= r) {
      this.lazy[node] = !this.lazy[node];
      this._push(node, start, end);
      return;
    }

    const mid = Math.floor((start + end) / 2);
    this._update(2 * node + 1, start, mid, l, r);
    this._update(2 * node + 2, mid + 1, end, l, r);

    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  query() {
    return this.tree[0];
  }
}

function handleQuery(nums1, nums2, queries) {
  const n = nums1.length;
  const segTree = new SegmentTree(nums1);

  // Calculate initial sum of nums2
  let totalSum = nums2.reduce((sum, num) => sum + num, 0);
  const result = [];

  for (const query of queries) {
    if (query[0] === 1) {
      // Type 1: flip range
      const l = query[1],
        r = query[2];
      segTree.update(l, r);
    } else if (query[0] === 2) {
      // Type 2: update nums2
      const p = query[1];
      const countOnes = segTree.query();
      totalSum += countOnes * p;
    } else {
      // Type 3: query sum
      result.push(totalSum);
    }
  }

  return result;
}
```

```java
// Time: O((n + q) log n) | Space: O(n)
class SegmentTree {
    private int n;
    private int[] tree;
    private boolean[] lazy;

    public SegmentTree(int[] nums) {
        this.n = nums.length;
        this.tree = new int[4 * n];
        this.lazy = new boolean[4 * n];
        build(0, 0, n - 1, nums);
    }

    private void build(int node, int start, int end, int[] nums) {
        if (start == end) {
            tree[node] = nums[start];
            return;
        }

        int mid = start + (end - start) / 2;
        build(2 * node + 1, start, mid, nums);
        build(2 * node + 2, mid + 1, end, nums);

        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    private void push(int node, int start, int end) {
        if (lazy[node]) {
            // Flip operation
            tree[node] = (end - start + 1) - tree[node];

            if (start != end) {
                lazy[2 * node + 1] = !lazy[2 * node + 1];
                lazy[2 * node + 2] = !lazy[2 * node + 2];
            }

            lazy[node] = false;
        }
    }

    public void update(int l, int r) {
        update(0, 0, n - 1, l, r);
    }

    private void update(int node, int start, int end, int l, int r) {
        push(node, start, end);

        if (start > r || end < l) return;

        if (l <= start && end <= r) {
            lazy[node] = !lazy[node];
            push(node, start, end);
            return;
        }

        int mid = start + (end - start) / 2;
        update(2 * node + 1, start, mid, l, r);
        update(2 * node + 2, mid + 1, end, l, r);

        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    public int query() {
        return tree[0];
    }
}

class Solution {
    public long[] handleQuery(int[] nums1, int[] nums2, int[][] queries) {
        int n = nums1.length;
        SegmentTree segTree = new SegmentTree(nums1);

        // Calculate initial sum of nums2
        long totalSum = 0;
        for (int num : nums2) {
            totalSum += num;
        }

        List<Long> resultList = new ArrayList<>();

        for (int[] query : queries) {
            if (query[0] == 1) {  // Type 1: flip range
                int l = query[1], r = query[2];
                segTree.update(l, r);
            } else if (query[0] == 2) {  // Type 2: update nums2
                int p = query[1];
                int countOnes = segTree.query();
                totalSum += (long) countOnes * p;
            } else {  // Type 3: query sum
                resultList.add(totalSum);
            }
        }

        long[] result = new long[resultList.size()];
        for (int i = 0; i < resultList.size(); i++) {
            result[i] = resultList.get(i);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Building segment tree: O(n)
- Each type 1 query (range flip): O(log n) due to segment tree update
- Each type 2 query: O(1) since we just multiply count of ones by p
- Each type 3 query: O(1) since we just return the precomputed sum
- Total: O(n + q log n) where q is number of queries

**Space Complexity:**

- Segment tree storage: O(4n) ≈ O(n)
- Lazy propagation array: O(4n) ≈ O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle large numbers**: The sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/JavaScript, normal int in Python handles big numbers).

2. **Incorrect lazy propagation logic**: The flip operation is its own inverse (flipping twice returns to original). This means our lazy flag should be a boolean that toggles, not a value that accumulates.

3. **Off-by-one errors in range queries**: Remember that the problem uses inclusive ranges [l, r]. A common mistake is using exclusive ranges or incorrect midpoint calculations in segment tree recursion.

4. **Not optimizing type 2 queries**: Some candidates try to actually update nums2 array, which would be O(n) per query. The key insight is that we only need the total sum, not individual values.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Segment Tree with Lazy Propagation**: Used in problems requiring efficient range updates and queries.
   - Related: [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)
   - Related: [My Calendar III](https://leetcode.com/problems/my-calendar-iii/)

2. **Binary Array Manipulation**: Problems dealing with bit flips often have special properties that allow optimizations.
   - Related: [Minimum Operations to Make Binary Array Elements Equal to One I](https://leetcode.com/problems/minimum-operations-to-make-binary-array-elements-equal-to-one-i/)

3. **Maintaining Aggregates Instead of Full State**: When you only need summary statistics (like total sum), you don't need to maintain the full array state.
   - Related: [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) (maintain prefix and suffix products)

## Key Takeaways

1. **Segment trees are powerful for range operations**: When you need O(log n) range updates/queries on arrays up to 10⁵ elements, segment trees with lazy propagation are often the solution.

2. **Look for mathematical optimizations**: The type 2 query optimization shows that sometimes you don't need to update every element—maintaining aggregates can be sufficient.

3. **Binary operations have special properties**: Flipping bits (0↔1) is its own inverse, which simplifies lazy propagation logic compared to other operations like addition.

[Practice this problem on CodeJeet](/problem/handling-sum-queries-after-update)
