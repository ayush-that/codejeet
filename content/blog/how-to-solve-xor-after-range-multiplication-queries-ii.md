---
title: "How to Solve XOR After Range Multiplication Queries II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode XOR After Range Multiplication Queries II. Hard difficulty, 37.2% acceptance rate. Topics: Array, Divide and Conquer."
date: "2026-02-02"
category: "dsa-patterns"
tags: ["xor-after-range-multiplication-queries-ii", "array", "divide-and-conquer", "hard"]
---

# How to Solve XOR After Range Multiplication Queries II

This problem challenges us to efficiently process range multiplication queries followed by XOR operations on an array. The tricky part is that each query multiplies a range of elements by a value, then asks for the XOR of elements in another range after all previous queries have been applied. A naive approach would be too slow, requiring us to find clever ways to track changes without explicitly updating the entire array for each query.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- `nums = [1, 2, 3, 4]`
- `queries = [[0, 1, 2, 1], [1, 2, 3, 2]]`

**Query 1:** `[0, 1, 2, 1]`

- Multiply indices 0-1 by 2: `nums` becomes `[2, 4, 3, 4]`
- XOR of indices 1-1: `4` → result = `[4]`

**Query 2:** `[1, 2, 3, 2]`

- Multiply indices 1-2 by 3: `nums` becomes `[2, 12, 9, 4]`
- XOR of indices 2-2: `9` → result = `[4, 9]`

The challenge is that with `n` up to 10^5 and `q` up to 10^5, we can't afford O(nq) time by actually performing all multiplications. We need a way to track cumulative multiplications efficiently.

## Brute Force Approach

The most straightforward approach would be to process each query exactly as described:

1. For each query `[l, r, k, v]`:
   - Loop through indices `l` to `r` and multiply each element by `k`
   - Compute XOR of elements from index `v` to the end of the array
   - Store the result

**Why this fails:**

- Each query takes O(n) time for the multiplication step
- With q queries, total time is O(nq), which is 10^10 operations for maximum constraints
- This is far too slow and will time out

Even if we optimize the XOR computation with prefix XORs, the multiplication step remains the bottleneck.

## Optimized Approach

The key insight is that we don't need to track the actual multiplied values, only their effect on XOR operations. XOR has several useful properties:

1. `a ⊕ b = b ⊕ a` (commutative)
2. `(a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)` (associative)
3. `a ⊕ a = 0`
4. `a ⊕ 0 = a`

More importantly for this problem: if we multiply a number by `k`, the XOR of the result depends on whether `k` is odd or even:

- If `k` is even: `(a × k) ⊕ (b × k) = 0` for any `a, b` (since even multiples have LSB 0)
- If `k` is odd: `(a × k) ⊕ (b × k) = k × (a ⊕ b)` (multiplication distributes over XOR for odd numbers)

This leads to our optimized strategy:

1. Track prefix XORs of the original array
2. For each query, determine if the multiplication factor `k` is even or odd
3. If `k` is even, the XOR of any range multiplied by `k` will be 0
4. If `k` is odd, we can compute the XOR of the original range and multiply by `k`
5. We need to track which indices have been multiplied by even numbers (making them 0 for XOR purposes)

The challenge is that multiple queries can overlap, and we need to know the cumulative effect. We solve this using a segment tree or Fenwick tree to track:

- Which indices have been multiplied by at least one even number (making them 0)
- The XOR of indices multiplied only by odd numbers

## Optimal Solution

We'll use a segment tree that stores:

1. `xor_val`: XOR of values in the segment (considering only odd multiplications)
2. `has_even`: Whether any element in the segment has been multiplied by an even number

For each query `[l, r, k, v]`:

1. Update the segment tree for range `[l, r]` with multiplication factor `k`
2. Query the segment tree for range `[v, n-1]` to get the XOR result

<div class="code-group">

```python
# Time: O((n + q) log n) | Space: O(n)
class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [{'xor': 0, 'has_even': False} for _ in range(4 * self.n)]
        self.build(nums, 0, 0, self.n - 1)

    def build(self, nums, node, left, right):
        """Build the segment tree from the original array"""
        if left == right:
            # Leaf node: store the value and no even multiplication yet
            self.tree[node] = {'xor': nums[left], 'has_even': False}
            return

        mid = (left + right) // 2
        self.build(nums, node * 2 + 1, left, mid)
        self.build(nums, node * 2 + 2, mid + 1, right)

        # Combine children: XOR their values
        self.tree[node]['xor'] = self.tree[node * 2 + 1]['xor'] ^ self.tree[node * 2 + 2]['xor']
        self.tree[node]['has_even'] = False

    def update(self, ql, qr, k, node, left, right):
        """Update range [ql, qr] with multiplication factor k"""
        if ql > right or qr < left:
            # No overlap
            return

        if left == right:
            # Leaf node: apply the multiplication
            if k % 2 == 0:
                # Even multiplication makes the value 0 for XOR purposes
                self.tree[node]['xor'] = 0
                self.tree[node]['has_even'] = True
            else:
                # Odd multiplication: value remains the same for XOR
                # (since odd * original_value has same XOR properties as original)
                # has_even remains False
                pass
            return

        if ql <= left and right <= qr:
            # Complete overlap
            if k % 2 == 0:
                # Even multiplication makes entire segment 0 for XOR
                self.tree[node]['xor'] = 0
                self.tree[node]['has_even'] = True
            # For odd multiplication, we don't need to change anything
            # because odd * value has same XOR as value
            return

        # Partial overlap: recurse to children
        mid = (left + right) // 2
        self.update(ql, qr, k, node * 2 + 1, left, mid)
        self.update(ql, qr, k, node * 2 + 2, mid + 1, right)

        # Update current node based on children
        if self.tree[node * 2 + 1]['has_even'] or self.tree[node * 2 + 2]['has_even']:
            # If any child has even multiplication, this node might be affected
            # Recompute XOR from children
            left_xor = 0 if self.tree[node * 2 + 1]['has_even'] else self.tree[node * 2 + 1]['xor']
            right_xor = 0 if self.tree[node * 2 + 2]['has_even'] else self.tree[node * 2 + 2]['xor']
            self.tree[node]['xor'] = left_xor ^ right_xor
            self.tree[node]['has_even'] = True
        else:
            # No even multiplication in children
            self.tree[node]['xor'] = self.tree[node * 2 + 1]['xor'] ^ self.tree[node * 2 + 2]['xor']
            self.tree[node]['has_even'] = False

    def query(self, ql, qr, node, left, right):
        """Query XOR for range [ql, qr]"""
        if ql > right or qr < left:
            # No overlap
            return 0

        if ql <= left and right <= qr:
            # Complete overlap
            return 0 if self.tree[node]['has_even'] else self.tree[node]['xor']

        # Partial overlap: query children
        mid = (left + right) // 2
        left_result = self.query(ql, qr, node * 2 + 1, left, mid)
        right_result = self.query(ql, qr, node * 2 + 2, mid + 1, right)

        return left_result ^ right_result

def xorAfterRangeMultiplicationQueries(nums, queries):
    """
    Main function to process queries and return XOR results
    """
    n = len(nums)
    seg_tree = SegmentTree(nums)
    results = []

    for l, r, k, v in queries:
        # Apply the range multiplication update
        seg_tree.update(l, r, k, 0, 0, n - 1)

        # Query XOR from index v to end of array
        xor_result = seg_tree.query(v, n - 1, 0, 0, n - 1)
        results.append(xor_result)

    return results
```

```javascript
// Time: O((n + q) log n) | Space: O(n)
class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(4 * this.n);
    this.build(nums, 0, 0, this.n - 1);
  }

  build(nums, node, left, right) {
    if (left === right) {
      this.tree[node] = {
        xor: nums[left],
        hasEven: false,
      };
      return;
    }

    const mid = Math.floor((left + right) / 2);
    this.build(nums, node * 2 + 1, left, mid);
    this.build(nums, node * 2 + 2, mid + 1, right);

    this.tree[node] = {
      xor: this.tree[node * 2 + 1].xor ^ this.tree[node * 2 + 2].xor,
      hasEven: false,
    };
  }

  update(ql, qr, k, node, left, right) {
    if (ql > right || qr < left) {
      return;
    }

    if (left === right) {
      if (k % 2 === 0) {
        this.tree[node].xor = 0;
        this.tree[node].hasEven = true;
      }
      return;
    }

    if (ql <= left && right <= qr) {
      if (k % 2 === 0) {
        this.tree[node].xor = 0;
        this.tree[node].hasEven = true;
      }
      return;
    }

    const mid = Math.floor((left + right) / 2);
    this.update(ql, qr, k, node * 2 + 1, left, mid);
    this.update(ql, qr, k, node * 2 + 2, mid + 1, right);

    if (this.tree[node * 2 + 1].hasEven || this.tree[node * 2 + 2].hasEven) {
      const leftXor = this.tree[node * 2 + 1].hasEven ? 0 : this.tree[node * 2 + 1].xor;
      const rightXor = this.tree[node * 2 + 2].hasEven ? 0 : this.tree[node * 2 + 2].xor;
      this.tree[node].xor = leftXor ^ rightXor;
      this.tree[node].hasEven = true;
    } else {
      this.tree[node].xor = this.tree[node * 2 + 1].xor ^ this.tree[node * 2 + 2].xor;
      this.tree[node].hasEven = false;
    }
  }

  query(ql, qr, node, left, right) {
    if (ql > right || qr < left) {
      return 0;
    }

    if (ql <= left && right <= qr) {
      return this.tree[node].hasEven ? 0 : this.tree[node].xor;
    }

    const mid = Math.floor((left + right) / 2);
    const leftResult = this.query(ql, qr, node * 2 + 1, left, mid);
    const rightResult = this.query(ql, qr, node * 2 + 2, mid + 1, right);

    return leftResult ^ rightResult;
  }
}

function xorAfterRangeMultiplicationQueries(nums, queries) {
  const n = nums.length;
  const segTree = new SegmentTree(nums);
  const results = [];

  for (const [l, r, k, v] of queries) {
    segTree.update(l, r, k, 0, 0, n - 1);
    const xorResult = segTree.query(v, n - 1, 0, 0, n - 1);
    results.push(xorResult);
  }

  return results;
}
```

```java
// Time: O((n + q) log n) | Space: O(n)
class SegmentTree {
    static class Node {
        int xor;
        boolean hasEven;

        Node(int xor, boolean hasEven) {
            this.xor = xor;
            this.hasEven = hasEven;
        }
    }

    private Node[] tree;
    private int n;

    public SegmentTree(int[] nums) {
        this.n = nums.length;
        this.tree = new Node[4 * n];
        build(nums, 0, 0, n - 1);
    }

    private void build(int[] nums, int node, int left, int right) {
        if (left == right) {
            tree[node] = new Node(nums[left], false);
            return;
        }

        int mid = left + (right - left) / 2;
        build(nums, node * 2 + 1, left, mid);
        build(nums, node * 2 + 2, mid + 1, right);

        int xorVal = tree[node * 2 + 1].xor ^ tree[node * 2 + 2].xor;
        tree[node] = new Node(xorVal, false);
    }

    public void update(int ql, int qr, int k, int node, int left, int right) {
        if (ql > right || qr < left) {
            return;
        }

        if (left == right) {
            if (k % 2 == 0) {
                tree[node].xor = 0;
                tree[node].hasEven = true;
            }
            return;
        }

        if (ql <= left && right <= qr) {
            if (k % 2 == 0) {
                tree[node].xor = 0;
                tree[node].hasEven = true;
            }
            return;
        }

        int mid = left + (right - left) / 2;
        update(ql, qr, k, node * 2 + 1, left, mid);
        update(ql, qr, k, node * 2 + 2, mid + 1, right);

        if (tree[node * 2 + 1].hasEven || tree[node * 2 + 2].hasEven) {
            int leftXor = tree[node * 2 + 1].hasEven ? 0 : tree[node * 2 + 1].xor;
            int rightXor = tree[node * 2 + 2].hasEven ? 0 : tree[node * 2 + 2].xor;
            tree[node].xor = leftXor ^ rightXor;
            tree[node].hasEven = true;
        } else {
            tree[node].xor = tree[node * 2 + 1].xor ^ tree[node * 2 + 2].xor;
            tree[node].hasEven = false;
        }
    }

    public int query(int ql, int qr, int node, int left, int right) {
        if (ql > right || qr < left) {
            return 0;
        }

        if (ql <= left && right <= qr) {
            return tree[node].hasEven ? 0 : tree[node].xor;
        }

        int mid = left + (right - left) / 2;
        int leftResult = query(ql, qr, node * 2 + 1, left, mid);
        int rightResult = query(ql, qr, node * 2 + 2, mid + 1, right);

        return leftResult ^ rightResult;
    }
}

class Solution {
    public int[] xorAfterRangeMultiplicationQueries(int[] nums, int[][] queries) {
        int n = nums.length;
        SegmentTree segTree = new SegmentTree(nums);
        int[] results = new int[queries.length];

        for (int i = 0; i < queries.length; i++) {
            int l = queries[i][0];
            int r = queries[i][1];
            int k = queries[i][2];
            int v = queries[i][3];

            segTree.update(l, r, k, 0, 0, n - 1);
            results[i] = segTree.query(v, n - 1, 0, 0, n - 1);
        }

        return results;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + q) log n)

- Building the segment tree: O(n log n)
- Each update operation: O(log n)
- Each query operation: O(log n)
- With q queries: O(q log n)
- Total: O((n + q) log n)

**Space Complexity:** O(n)

- Segment tree requires 4n nodes
- Each node stores two values (xor and has_even flag)
- Additional O(1) space for variables and O(q) for results

## Common Mistakes

1. **Forgetting that XOR of even multiples is always 0**: Candidates often try to track actual multiplied values, which requires handling large numbers and is inefficient. Remember: any number multiplied by an even integer has LSB 0, making its XOR contribution 0.

2. **Incorrectly handling overlapping even multiplications**: When a range has been multiplied by an even number, all elements in that range become 0 for XOR purposes. However, if only part of a segment has even multiplication, we need to carefully combine results from children.

3. **Off-by-one errors in range queries**: Segment tree implementations often have off-by-one errors in the base cases (`left == right`) or in the recursive calls. Always test with small cases.

4. **Not using lazy propagation when possible**: While our solution works without lazy propagation because even multiplications are idempotent (applying even multiplication twice is same as once), some candidates overcomplicate with lazy propagation that's not needed here.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Segment Trees for Range Queries**: Similar to Range Sum Query - Mutable (LeetCode 307) but with XOR instead of sum.

2. **XOR Properties in Range Operations**: Problems like XOR Queries of a Subarray (LeetCode 1310) teach how to use prefix XOR for range queries.

3. **Mathematical Properties in Optimization**: Problems like Product of Array Except Self (LeetCode 238) show how mathematical insights (like properties of multiplication) can lead to optimized solutions.

The core technique of using mathematical properties (even/odd multiplication effects on XOR) to simplify range updates is applicable to many problems where direct computation is too expensive.

## Key Takeaways

1. **XOR has special properties with multiplication**: Even multipliers nullify XOR results, while odd multipliers preserve XOR relationships. This insight dramatically simplifies the problem.

2. **Segment trees can track more than just sums**: They can track any associative operation (XOR in this case) along with additional state (has_even flag).

3. **When faced with complex range operations, look for mathematical simplifications**: Instead of simulating all operations, find properties that let you compute results without explicit computation.

[Practice this problem on CodeJeet](/problem/xor-after-range-multiplication-queries-ii)
