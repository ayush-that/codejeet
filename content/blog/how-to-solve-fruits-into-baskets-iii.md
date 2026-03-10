---
title: "How to Solve Fruits Into Baskets III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Fruits Into Baskets III. Medium difficulty, 38.9% acceptance rate. Topics: Array, Binary Search, Segment Tree, Ordered Set."
date: "2027-09-25"
category: "dsa-patterns"
tags: ["fruits-into-baskets-iii", "array", "binary-search", "segment-tree", "medium"]
---

# How to Solve Fruits Into Baskets III

This problem asks us to place fruits into baskets following specific rules: we process fruits from left to right, each fruit type has a quantity, and each basket has a capacity. The tricky part is that we need to find the _earliest_ basket that can accommodate each fruit, which requires efficiently searching through available baskets as we process the fruits sequentially.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
fruits = [3, 2, 4]
baskets = [2, 5, 3]
```

**Step-by-step process:**

1. **First fruit (quantity 3):**
   - Check baskets from left to right
   - Basket 0: capacity 2 → too small (3 > 2)
   - Basket 1: capacity 5 → fits! (3 ≤ 5)
   - Update basket 1: 5 - 3 = 2 remaining capacity
   - Result: fruit 0 → basket 1

2. **Second fruit (quantity 2):**
   - Check baskets from left to right
   - Basket 0: capacity 2 → fits! (2 ≤ 2)
   - Update basket 0: 2 - 2 = 0 remaining capacity
   - Result: fruit 1 → basket 0

3. **Third fruit (quantity 4):**
   - Check baskets from left to right
   - Basket 0: capacity 0 → too small (4 > 0)
   - Basket 1: capacity 2 → too small (4 > 2)
   - Basket 2: capacity 3 → too small (4 > 3)
   - No basket can fit this fruit
   - Result: fruit 2 → -1

**Final output:** `[1, 0, -1]`

The challenge is that a naive approach checking all baskets for each fruit would be O(n²), which is too slow for large inputs. We need a way to quickly find the earliest basket with sufficient capacity.

## Brute Force Approach

The most straightforward solution is to simulate the process exactly as described: for each fruit, iterate through all baskets from left to right until we find one with enough capacity.

**Why this is insufficient:**

- For each of n fruits, we might check up to n baskets
- This gives us O(n²) time complexity
- With n up to 10⁵, n² operations (10¹⁰) is far too slow
- The problem constraints require a more efficient solution

**What a naive candidate might try:**

- Simply implement the described process with nested loops
- This would work for small inputs but timeout on larger test cases
- The key insight needed is that we're repeatedly searching for the _first_ basket with enough capacity

## Optimized Approach

The key insight is that we need to efficiently find the _earliest_ basket with capacity ≥ fruit quantity. This is essentially a "range minimum query" problem where we want to find the first index where the value meets a threshold.

**Step-by-step reasoning:**

1. **Observation:** We're always searching from the beginning of the baskets array
2. **Problem:** After using a basket, its capacity decreases, which affects future searches
3. **Insight:** We need a data structure that can:
   - Quickly find the first index where capacity ≥ fruit quantity
   - Efficiently update capacities when we place fruits
   - Support range queries for minimum/maximum values

4. **Candidate data structures:**
   - **Segment Tree:** Can answer range minimum queries in O(log n) and update values in O(log n)
   - **Binary Indexed Tree (Fenwick Tree):** Good for prefix sums but not ideal for range minimum
   - **Ordered Set (TreeSet):** Can maintain baskets sorted by capacity, but we need to preserve order

5. **Why Segment Tree works best:**
   - We build a segment tree where each node stores the _maximum capacity_ in its range
   - To find the earliest basket with enough capacity:
     - Start from the root
     - Check left child first (to maintain "earliest" property)
     - If left child's max capacity ≥ fruit quantity, search left
     - Otherwise, search right
   - This gives us O(log n) search time
   - After placing fruit, update the basket's capacity in O(log n)

6. **Algorithm outline:**
   - Build segment tree from baskets array
   - For each fruit:
     - Query segment tree to find first basket with capacity ≥ fruit quantity
     - If found: update basket capacity, record basket index
     - If not found: record -1
   - Return results array

## Optimal Solution

Here's the complete solution using a segment tree to achieve O(n log n) time complexity:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def fruitsIntoBaskets(fruits, baskets):
    n = len(fruits)
    result = [-1] * n

    # Build segment tree where each node stores max capacity in its range
    # We need 4*n space for the segment tree array
    seg_tree = [0] * (4 * len(baskets))

    def build(node, left, right):
        """Build segment tree recursively"""
        if left == right:
            # Leaf node: store basket capacity
            seg_tree[node] = baskets[left]
        else:
            mid = (left + right) // 2
            # Build left and right children
            build(node * 2, left, mid)
            build(node * 2 + 1, mid + 1, right)
            # Parent stores max of children
            seg_tree[node] = max(seg_tree[node * 2], seg_tree[node * 2 + 1])

    def query(node, left, right, fruit_qty):
        """Find first index in [left, right] with capacity >= fruit_qty"""
        if left == right:
            # Found a leaf node - check if it has enough capacity
            return left if seg_tree[node] >= fruit_qty else -1

        mid = (left + right) // 2

        # Always check left child first to maintain "earliest" property
        if seg_tree[node * 2] >= fruit_qty:
            # Left child has a basket with enough capacity
            return query(node * 2, left, mid, fruit_qty)
        else:
            # Try right child
            return query(node * 2 + 1, mid + 1, right, fruit_qty)

    def update(node, left, right, idx, new_capacity):
        """Update basket capacity at index idx"""
        if left == right:
            # Found the leaf node to update
            seg_tree[node] = new_capacity
        else:
            mid = (left + right) // 2
            if idx <= mid:
                # Index is in left child
                update(node * 2, left, mid, idx, new_capacity)
            else:
                # Index is in right child
                update(node * 2 + 1, mid + 1, right, idx, new_capacity)
            # Update parent with new max
            seg_tree[node] = max(seg_tree[node * 2], seg_tree[node * 2 + 1])

    # Build the segment tree
    if baskets:  # Handle empty baskets case
        build(1, 0, len(baskets) - 1)

    # Process each fruit
    for i in range(n):
        fruit_qty = fruits[i]

        # Find earliest basket with enough capacity
        if baskets:  # Only query if we have baskets
            basket_idx = query(1, 0, len(baskets) - 1, fruit_qty)
        else:
            basket_idx = -1

        if basket_idx != -1:
            # Place fruit in this basket
            result[i] = basket_idx

            # Update basket capacity
            new_capacity = baskets[basket_idx] - fruit_qty
            baskets[basket_idx] = new_capacity
            update(1, 0, len(baskets) - 1, basket_idx, new_capacity)
        else:
            # No basket can fit this fruit
            result[i] = -1

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function fruitsIntoBaskets(fruits, baskets) {
  const n = fruits.length;
  const result = new Array(n).fill(-1);

  // Build segment tree array (4*n space)
  const segTree = new Array(4 * baskets.length).fill(0);

  /**
   * Build segment tree recursively
   * @param {number} node - Current node index in segment tree
   * @param {number} left - Left boundary in baskets array
   * @param {number} right - Right boundary in baskets array
   */
  function build(node, left, right) {
    if (left === right) {
      // Leaf node: store basket capacity
      segTree[node] = baskets[left];
    } else {
      const mid = Math.floor((left + right) / 2);
      // Build left and right children
      build(node * 2, left, mid);
      build(node * 2 + 1, mid + 1, right);
      // Parent stores max of children
      segTree[node] = Math.max(segTree[node * 2], segTree[node * 2 + 1]);
    }
  }

  /**
   * Find first index with capacity >= fruitQty
   * @param {number} node - Current node index
   * @param {number} left - Left boundary
   * @param {number} right - Right boundary
   * @param {number} fruitQty - Fruit quantity to fit
   * @returns {number} Index of basket or -1 if not found
   */
  function query(node, left, right, fruitQty) {
    if (left === right) {
      // Found leaf node - check capacity
      return segTree[node] >= fruitQty ? left : -1;
    }

    const mid = Math.floor((left + right) / 2);

    // Always check left child first for "earliest" basket
    if (segTree[node * 2] >= fruitQty) {
      return query(node * 2, left, mid, fruitQty);
    } else {
      return query(node * 2 + 1, mid + 1, right, fruitQty);
    }
  }

  /**
   * Update basket capacity at index idx
   * @param {number} node - Current node index
   * @param {number} left - Left boundary
   * @param {number} right - Right boundary
   * @param {number} idx - Index in baskets array to update
   * @param {number} newCapacity - New capacity value
   */
  function update(node, left, right, idx, newCapacity) {
    if (left === right) {
      // Found the leaf node to update
      segTree[node] = newCapacity;
    } else {
      const mid = Math.floor((left + right) / 2);
      if (idx <= mid) {
        update(node * 2, left, mid, idx, newCapacity);
      } else {
        update(node * 2 + 1, mid + 1, right, idx, newCapacity);
      }
      // Update parent with new max
      segTree[node] = Math.max(segTree[node * 2], segTree[node * 2 + 1]);
    }
  }

  // Build segment tree if we have baskets
  if (baskets.length > 0) {
    build(1, 0, baskets.length - 1);
  }

  // Process each fruit
  for (let i = 0; i < n; i++) {
    const fruitQty = fruits[i];
    let basketIdx = -1;

    // Find earliest basket with enough capacity
    if (baskets.length > 0) {
      basketIdx = query(1, 0, baskets.length - 1, fruitQty);
    }

    if (basketIdx !== -1) {
      // Place fruit in this basket
      result[i] = basketIdx;

      // Update basket capacity
      const newCapacity = baskets[basketIdx] - fruitQty;
      baskets[basketIdx] = newCapacity;
      update(1, 0, baskets.length - 1, basketIdx, newCapacity);
    } else {
      result[i] = -1;
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int[] fruitsIntoBaskets(int[] fruits, int[] baskets) {
        int n = fruits.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);

        // Build segment tree if we have baskets
        if (baskets.length > 0) {
            // Segment tree array (4*n space)
            int[] segTree = new int[4 * baskets.length];

            // Build the segment tree
            build(segTree, baskets, 1, 0, baskets.length - 1);

            // Process each fruit
            for (int i = 0; i < n; i++) {
                int fruitQty = fruits[i];

                // Find earliest basket with enough capacity
                int basketIdx = query(segTree, 1, 0, baskets.length - 1, fruitQty);

                if (basketIdx != -1) {
                    // Place fruit in this basket
                    result[i] = basketIdx;

                    // Update basket capacity
                    int newCapacity = baskets[basketIdx] - fruitQty;
                    baskets[basketIdx] = newCapacity;
                    update(segTree, 1, 0, baskets.length - 1, basketIdx, newCapacity);
                }
            }
        }

        return result;
    }

    private void build(int[] segTree, int[] baskets, int node, int left, int right) {
        if (left == right) {
            // Leaf node: store basket capacity
            segTree[node] = baskets[left];
        } else {
            int mid = (left + right) / 2;
            // Build left and right children
            build(segTree, baskets, node * 2, left, mid);
            build(segTree, baskets, node * 2 + 1, mid + 1, right);
            // Parent stores max of children
            segTree[node] = Math.max(segTree[node * 2], segTree[node * 2 + 1]);
        }
    }

    private int query(int[] segTree, int node, int left, int right, int fruitQty) {
        if (left == right) {
            // Found leaf node - check capacity
            return segTree[node] >= fruitQty ? left : -1;
        }

        int mid = (left + right) / 2;

        // Always check left child first for "earliest" basket
        if (segTree[node * 2] >= fruitQty) {
            return query(segTree, node * 2, left, mid, fruitQty);
        } else {
            return query(segTree, node * 2 + 1, mid + 1, right, fruitQty);
        }
    }

    private void update(int[] segTree, int node, int left, int right, int idx, int newCapacity) {
        if (left == right) {
            // Found the leaf node to update
            segTree[node] = newCapacity;
        } else {
            int mid = (left + right) / 2;
            if (idx <= mid) {
                update(segTree, node * 2, left, mid, idx, newCapacity);
            } else {
                update(segTree, node * 2 + 1, mid + 1, right, idx, newCapacity);
            }
            // Update parent with new max
            segTree[node] = Math.max(segTree[node * 2], segTree[node * 2 + 1]);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Building the segment tree: O(m) where m = number of baskets
- For each of n fruits:
  - Query operation: O(log m) to find earliest basket
  - Update operation: O(log m) to update basket capacity
- Total: O(m + n log m) = O(n log n) since m ≤ n

**Space Complexity:** O(n)

- Segment tree array: O(4m) = O(m) = O(n)
- Result array: O(n)
- Total: O(n)

The logarithmic operations come from the segment tree height, which is log₂(m) for m baskets.

## Common Mistakes

1. **Using linear search for each fruit:** This results in O(n²) time complexity which times out for large inputs. Always consider the constraints (n up to 10⁵) which require O(n log n) or better.

2. **Forgetting to update both arrays:** Candidates sometimes update only the segment tree or only the baskets array, but not both. Remember that after placing a fruit, you must:
   - Update the basket's capacity in the original array
   - Update the segment tree to reflect the change

3. **Incorrect segment tree query logic:** The query must check left child first to maintain the "earliest basket" requirement. Checking right first or using a different order will give wrong results.

4. **Not handling empty baskets:** If the baskets array is empty, all fruits should return -1. Always check for edge cases before building data structures.

5. **Off-by-one errors in segment tree indices:** Segment trees typically use 1-based indexing for nodes (node 1 is root). Mixing 0-based and 1-based indexing is a common source of bugs.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Range Maximum Query with Updates:** Similar to problems where you need to repeatedly find the first element meeting a condition in a range that gets updated.
   - _Related:_ "My Calendar I" (LeetCode 729) - finding first available time slot
   - _Related:_ "Range Sum Query - Mutable" (LeetCode 307) - similar update/query pattern

2. **Greedy Assignment with Constraints:** Assigning items to containers with capacity constraints, always choosing the earliest available.
   - _Related:_ "Assign Cookies" (LeetCode 455) - simpler greedy assignment
   - _Related:_ "Car Fleet" (LeetCode 853) - processing items in order with constraints

3. **Segment Tree Applications:** Any problem requiring efficient range queries and updates.
   - _Related:_ "Count of Smaller Numbers After Self" (LeetCode 315) - using segment trees for counting
   - _Related:_ "Reverse Pairs" (LeetCode 493) - similar pattern with updates and queries

## Key Takeaways

1. **When you need "first element satisfying condition" with updates, think segment tree:** The segment tree's ability to answer range queries in O(log n) while supporting updates makes it ideal for these problems.

2. **Always check left child first for "earliest" requirement:** In segment tree queries where order matters, the traversal order determines which index you find first.

3. **Consider time complexity early:** With n up to 10⁵, O(n²) solutions will timeout. Look for O(n log n) solutions using efficient data structures like segment trees, binary indexed trees, or balanced trees.

4. **Segment trees need 4n space:** Remember this rule of thumb when implementing segment trees for range maximum/minimum queries.

Related problems: [Block Placement Queries](/problem/block-placement-queries)
