---
title: "How to Solve Count Good Triplets in an Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Good Triplets in an Array. Hard difficulty, 65.8% acceptance rate. Topics: Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree."
date: "2027-12-06"
category: "dsa-patterns"
tags: ["count-good-triplets-in-an-array", "array", "binary-search", "divide-and-conquer", "hard"]
---

# How to Solve Count Good Triplets in an Array

This problem asks us to count triplets `(x, y, z)` where all three values appear in increasing order in both given arrays. Both arrays are permutations of `[0, 1, ..., n-1]`, which means every number from 0 to n-1 appears exactly once in each array. The challenge is that we need to find triplets that are increasing in both arrays simultaneously, not just in one.

What makes this problem interesting is that we can't simply check all possible triplets (O(n³) is too slow for n up to 10⁵). We need a clever way to count these triplets efficiently by leveraging the permutation property and using data structures that can help us track "middle" elements efficiently.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
nums1 = [2, 0, 1, 3]
nums2 = [0, 1, 2, 3]
```

We need to find triplets `(x, y, z)` where in both arrays, `x` comes before `y`, and `y` comes before `z`.

**Step 1: Understand the permutation property**
Since both arrays are permutations of `[0, 1, 2, 3]`, we can think about positions. Let's create a mapping from value to position in each array:

For nums1:

- Value 0 → position 1
- Value 1 → position 2
- Value 2 → position 0
- Value 3 → position 3

For nums2:

- Value 0 → position 0
- Value 1 → position 1
- Value 2 → position 2
- Value 3 → position 3

**Step 2: Think about the middle element**
For a triplet `(x, y, z)` to be good, `y` must be between `x` and `z` in both arrays. This means:

- In nums1: pos₁(x) < pos₁(y) < pos₁(z)
- In nums2: pos₂(x) < pos₂(y) < pos₂(z)

**Step 3: Try counting for a specific middle**
Let's count triplets where `y = 1`:

- In nums1: position 2
- In nums2: position 1

For `x`: must come before `y` in both arrays

- In nums1: pos < 2 → values at positions 0,1: {2, 0}
- In nums2: pos < 1 → values at position 0: {0}
- Intersection: {0} → 1 candidate for x

For `z`: must come after `y` in both arrays

- In nums1: pos > 2 → value at position 3: {3}
- In nums2: pos > 1 → values at positions 2,3: {2, 3}
- Intersection: {3} → 1 candidate for z

So for `y = 1`, we have 1 × 1 = 1 good triplet: (0, 1, 3)

**Step 4: The key insight**
If we fix `y`, we need to count:

- How many values come before `y` in BOTH arrays
- How many values come after `y` in BOTH arrays

The product gives us the number of triplets with `y` as the middle element.

## Brute Force Approach

The most straightforward approach is to check all possible triplets:

1. Generate all combinations of 3 distinct indices `(i, j, k)` where `i < j < k`
2. For each combination, check if the values at these positions form an increasing sequence in both arrays
3. Count how many pass this check

This approach has O(n³) time complexity, which is far too slow for n up to 10⁵. Even for n = 1000, this would be 1 billion operations.

A slightly better brute force would be O(n²): for each middle element `j`, count how many elements come before it in both arrays and how many come after it in both arrays. But this is still O(n²), which is too slow for n = 10⁵ (10¹⁰ operations).

## Optimized Approach

The key insight is that we need to efficiently count, for each element `y`:

- `left_count`: number of elements that come before `y` in both arrays
- `right_count`: number of elements that come after `y` in both arrays

Then the number of good triplets with `y` as middle = `left_count × right_count`

**How to compute these counts efficiently?**

We can transform the problem using the permutation property. Let's create an array `pos` where `pos[i]` = position of value `i` in nums2.

Now, when we iterate through nums1 from left to right, we're processing elements in increasing order of their position in nums1. For the current element `y`:

- All elements we've seen so far come before `y` in nums1
- Among these, we need to count how many also come before `y` in nums2

This becomes: count how many previously seen elements have `pos[element] < pos[y]`

Similarly, for elements coming after `y`:

- All elements we haven't seen yet come after `y` in nums1
- Among these, we need to count how many also come after `y` in nums2

This becomes: count how many future elements have `pos[element] > pos[y]`

**Data structure choice:**
We need a data structure that supports:

1. Add an element (mark it as seen)
2. Query how many elements have value less than a given threshold

A Binary Indexed Tree (Fenwick Tree) or Segment Tree is perfect for this. Both support these operations in O(log n) time.

## Optimal Solution

The algorithm:

1. Create `pos` array mapping each value to its position in nums2
2. Initialize a BIT/Segment Tree of size n
3. Iterate through nums1 from left to right:
   - For current element `y`, get its position in nums2: `p = pos[y]`
   - Query BIT for count of elements with position < p → `left_count`
   - Elements seen so far = current index `i`
   - Elements with position > p in future = `(n - 1 - p) - (i - left_count)`
   - Add `left_count × right_count` to total
   - Update BIT at position p (mark y as seen)

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
class BIT:
    """Binary Indexed Tree (Fenwick Tree) implementation"""
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def update(self, idx, delta):
        """Add delta to element at idx (1-based index)"""
        # Move forward through the tree
        while idx <= self.n:
            self.tree[idx] += delta
            idx += idx & -idx  # Move to next responsible index

    def query(self, idx):
        """Get prefix sum up to idx (1-based index)"""
        res = 0
        # Move backward through the tree
        while idx > 0:
            res += self.tree[idx]
            idx -= idx & -idx  # Move to parent
        return res

def goodTriplets(nums1, nums2):
    n = len(nums1)

    # Step 1: Create position mapping for nums2
    # pos[value] = position of that value in nums2
    pos = [0] * n
    for i, num in enumerate(nums2):
        pos[num] = i

    # Step 2: Initialize Binary Indexed Tree
    bit = BIT(n)

    total = 0

    # Step 3: Process nums1 from left to right
    for i, num in enumerate(nums1):
        # Get position of current number in nums2
        p = pos[num] + 1  # Convert to 1-based for BIT

        # Count how many elements before current in both arrays
        # These are elements we've seen in nums1 (i elements total)
        # that also have position < p in nums2
        left_count = bit.query(p - 1)  # Elements with pos < p

        # Count how many elements after current in both arrays
        # Total elements with position > p in nums2: (n - p)
        # But some of these we've already seen in nums1
        # Elements we've seen with position > p: i - left_count
        # So elements we haven't seen with position > p: (n - p) - (i - left_count)
        right_count = (n - p) - (i - left_count)

        # Add triplets with current element as middle
        total += left_count * right_count

        # Mark current element as seen in BIT
        bit.update(p, 1)

    return total
```

```javascript
// Time: O(n log n) | Space: O(n)
class BIT {
  constructor(n) {
    this.n = n;
    this.tree = new Array(n + 1).fill(0);
  }

  // Add delta to element at idx (1-based index)
  update(idx, delta) {
    while (idx <= this.n) {
      this.tree[idx] += delta;
      idx += idx & -idx; // Move to next responsible index
    }
  }

  // Get prefix sum up to idx (1-based index)
  query(idx) {
    let res = 0;
    while (idx > 0) {
      res += this.tree[idx];
      idx -= idx & -idx; // Move to parent
    }
    return res;
  }
}

function goodTriplets(nums1, nums2) {
  const n = nums1.length;

  // Step 1: Create position mapping for nums2
  // pos[value] = position of that value in nums2
  const pos = new Array(n);
  for (let i = 0; i < n; i++) {
    pos[nums2[i]] = i;
  }

  // Step 2: Initialize Binary Indexed Tree
  const bit = new BIT(n);

  let total = 0;

  // Step 3: Process nums1 from left to right
  for (let i = 0; i < n; i++) {
    const num = nums1[i];
    // Get position of current number in nums2 (1-based)
    const p = pos[num] + 1;

    // Count elements before current in both arrays
    // Elements we've seen in nums1 that have position < p in nums2
    const leftCount = bit.query(p - 1);

    // Count elements after current in both arrays
    // Total elements with position > p in nums2: (n - p)
    // Minus elements we've already seen with position > p: (i - leftCount)
    const rightCount = n - p - (i - leftCount);

    // Add triplets with current element as middle
    total += leftCount * rightCount;

    // Mark current element as seen
    bit.update(p, 1);
  }

  return total;
}
```

```java
// Time: O(n log n) | Space: O(n)
class BIT {
    private int n;
    private int[] tree;

    public BIT(int n) {
        this.n = n;
        this.tree = new int[n + 1];
    }

    // Add delta to element at idx (1-based index)
    public void update(int idx, int delta) {
        while (idx <= n) {
            tree[idx] += delta;
            idx += idx & -idx;  // Move to next responsible index
        }
    }

    // Get prefix sum up to idx (1-based index)
    public int query(int idx) {
        int res = 0;
        while (idx > 0) {
            res += tree[idx];
            idx -= idx & -idx;  // Move to parent
        }
        return res;
    }
}

class Solution {
    public long goodTriplets(int[] nums1, int[] nums2) {
        int n = nums1.length;

        // Step 1: Create position mapping for nums2
        // pos[value] = position of that value in nums2
        int[] pos = new int[n];
        for (int i = 0; i < n; i++) {
            pos[nums2[i]] = i;
        }

        // Step 2: Initialize Binary Indexed Tree
        BIT bit = new BIT(n);

        long total = 0;

        // Step 3: Process nums1 from left to right
        for (int i = 0; i < n; i++) {
            int num = nums1[i];
            // Get position of current number in nums2 (1-based)
            int p = pos[num] + 1;

            // Count elements before current in both arrays
            // Elements we've seen in nums1 that have position < p in nums2
            long leftCount = bit.query(p - 1);

            // Count elements after current in both arrays
            // Total elements with position > p in nums2: (n - p)
            // Minus elements we've already seen with position > p: (i - leftCount)
            long rightCount = (n - p) - (i - leftCount);

            // Add triplets with current element as middle
            total += leftCount * rightCount;

            // Mark current element as seen
            bit.update(p, 1);
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating the position array: O(n)
- Processing each element in nums1: O(n)
  - BIT query: O(log n)
  - BIT update: O(log n)
- Total: O(n log n)

**Space Complexity: O(n)**

- Position array: O(n)
- Binary Indexed Tree: O(n)
- Other variables: O(1)

## Common Mistakes

1. **Using 0-based indexing with BIT**: Binary Indexed Trees typically use 1-based indexing. Forgetting to convert from 0-based to 1-based (or vice versa) leads to off-by-one errors. Always remember: `p = pos[num] + 1` for BIT operations.

2. **Incorrect right_count calculation**: The formula `right_count = (n - p) - (i - left_count)` is subtle. Some candidates try `(n - i - 1) - (something)` which doesn't account for positions in nums2 correctly. Remember: `(n - p)` counts elements with position > p in nums2, and `(i - left_count)` counts how many of those we've already seen.

3. **Integer overflow**: The result can be large (up to C(n,3) ≈ n³/6). For n = 10⁵, this exceeds 2³¹. Use `long` in Java or ensure 64-bit integers in other languages.

4. **Confusing positions and values**: Remember we're dealing with permutations, so values are also indices. The `pos` array maps values to positions, not positions to values. Double-check: `pos[value] = position_in_nums2`.

## When You'll See This Pattern

This problem uses the "count elements with property X before/after current element" pattern combined with efficient range queries. You'll see similar patterns in:

1. **Count of Smaller Numbers After Self (Hard)**: Count how many elements to the right are smaller than each element. Uses BIT/Segment Tree for efficient counting.

2. **Create Sorted Array through Instructions (Hard)**: Similar counting problem where you need to track how many elements are less than/greater than current value as you insert them.

3. **Reverse Pairs (Hard)**: Count pairs where nums[i] > 2\*nums[j] and i < j. Uses modified BIT or merge sort approach.

The core technique is using a data structure (BIT/Segment Tree) to maintain a frequency array that supports:

- Point updates (add 1 at position)
- Range queries (sum from 1 to k)

## Key Takeaways

1. **Fix the middle element**: When counting ordered triplets, fixing the middle element often simplifies the problem to counting pairs (before and after).

2. **BIT/Segment Tree for dynamic counting**: When you need to maintain a running count of elements with certain properties (like "position less than p"), Binary Indexed Trees and Segment Trees provide O(log n) updates and queries.

3. **Transform permutations to positions**: When dealing with permutations, creating a position mapping (value → index) often reveals useful structure. In this case, it let us convert "comes before in both arrays" to a simple inequality on positions.

Related problems: [Count of Smaller Numbers After Self](/problem/count-of-smaller-numbers-after-self), [Increasing Triplet Subsequence](/problem/increasing-triplet-subsequence), [Create Sorted Array through Instructions](/problem/create-sorted-array-through-instructions)
