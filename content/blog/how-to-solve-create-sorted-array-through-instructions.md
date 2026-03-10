---
title: "How to Solve Create Sorted Array through Instructions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Create Sorted Array through Instructions. Hard difficulty, 41.4% acceptance rate. Topics: Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree."
date: "2029-04-03"
category: "dsa-patterns"
tags:
  [
    "create-sorted-array-through-instructions",
    "array",
    "binary-search",
    "divide-and-conquer",
    "hard",
  ]
---

# How to Solve "Create Sorted Array through Instructions"

You’re given an array `instructions` and must simulate building a sorted array by inserting each element in order. The cost of inserting an element is the minimum of:

1. The number of **strictly less** elements already in the array.
2. The number of **strictly greater** elements already in the array.

You return the total cost modulo \(10^9 + 7\).

What makes this problem tricky is that you need to efficiently query **how many elements are less than** and **how many are greater than** the current element **in the current sorted state** before each insertion. A brute-force insertion with linear searches would be \(O(n^2)\) and time out. The core challenge is maintaining a dynamic sorted collection with fast rank queries.

## Visual Walkthrough

Let’s trace through `instructions = [1, 5, 6, 2]`.

We start with an empty sorted array `nums = []`. Total cost = 0.

**Step 1:** Insert `1`

- `nums = []`
- Number of elements less than 1 = 0
- Number of elements greater than 1 = 0
- Cost = min(0, 0) = 0
- Insert 1 → `nums = [1]`

**Step 2:** Insert `5`

- `nums = [1]`
- Elements less than 5: `[1]` → count = 1
- Elements greater than 5: `[]` → count = 0
- Cost = min(1, 0) = 0
- Insert 5 → `nums = [1, 5]`

**Step 3:** Insert `6`

- `nums = [1, 5]`
- Less than 6: `[1, 5]` → count = 2
- Greater than 6: `[]` → count = 0
- Cost = min(2, 0) = 0
- Insert 6 → `nums = [1, 5, 6]`

**Step 4:** Insert `2`

- `nums = [1, 5, 6]`
- Less than 2: `[1]` → count = 1
- Greater than 2: `[5, 6]` → count = 2
- Cost = min(1, 2) = 1
- Insert 2 → `nums = [1, 2, 5, 6]`

Total cost = 0 + 0 + 0 + 1 = 1.

The naive way would scan the current sorted array each time to count less/greater elements. For large inputs (up to \(10^5\)), this \(O(n^2)\) approach is infeasible.

## Brute Force Approach

The straightforward method is to maintain an actual sorted list and use binary search to find the insertion position. Once we know the insertion index `i`, the number of elements less than the current value is `i`, and the number greater is `len(nums) - i`. The cost is `min(i, len(nums) - i)`.

However, inserting into a Python list or JavaScript array at an arbitrary position is \(O(n)\) due to shifting elements. This makes the overall complexity \(O(n^2)\).

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def createSortedArray(instructions):
    nums = []
    total_cost = 0
    MOD = 10**9 + 7

    for x in instructions:
        # Binary search to find insertion position
        left, right = 0, len(nums)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < x:
                left = mid + 1
            else:
                right = mid

        insert_pos = left
        less_count = insert_pos

        # Count elements strictly greater than x
        greater_count = 0
        for i in range(insert_pos, len(nums)):
            if nums[i] > x:
                greater_count = len(nums) - i
                break

        cost = min(less_count, greater_count)
        total_cost = (total_cost + cost) % MOD

        # Insert (this is O(n) due to shifting)
        nums.insert(insert_pos, x)

    return total_cost
```

```javascript
// Time: O(n^2) | Space: O(n)
function createSortedArray(instructions) {
  const nums = [];
  let totalCost = 0;
  const MOD = 1e9 + 7;

  for (const x of instructions) {
    // Binary search for insertion position
    let left = 0,
      right = nums.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] < x) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    const insertPos = left;
    const lessCount = insertPos;

    // Count elements strictly greater than x
    let greaterCount = 0;
    for (let i = insertPos; i < nums.length; i++) {
      if (nums[i] > x) {
        greaterCount = nums.length - i;
        break;
      }
    }

    const cost = Math.min(lessCount, greaterCount);
    totalCost = (totalCost + cost) % MOD;

    // Insert with splice (O(n) due to shifting)
    nums.splice(insertPos, 0, x);
  }

  return totalCost;
}
```

```java
// Time: O(n^2) | Space: O(n)
public int createSortedArray(int[] instructions) {
    List<Integer> nums = new ArrayList<>();
    int totalCost = 0;
    final int MOD = 1_000_000_007;

    for (int x : instructions) {
        // Binary search for insertion position
        int left = 0, right = nums.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums.get(mid) < x) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        int insertPos = left;
        int lessCount = insertPos;

        // Count elements strictly greater than x
        int greaterCount = 0;
        for (int i = insertPos; i < nums.size(); i++) {
            if (nums.get(i) > x) {
                greaterCount = nums.size() - i;
                break;
            }
        }

        int cost = Math.min(lessCount, greaterCount);
        totalCost = (totalCost + cost) % MOD;

        // Insert at position (O(n) due to shifting)
        nums.add(insertPos, x);
    }

    return totalCost;
}
```

</div>

This brute force is too slow because:

1. Each insertion into a list/array is \(O(n)\) due to element shifting.
2. Counting greater elements after the insertion point requires another linear scan in the worst case.
3. Overall \(O(n^2)\) time complexity fails for \(n = 10^5\).

## Optimized Approach

The key insight is that we don't need to maintain the actual sorted array. We only need to know, for each new element `x`:

- How many elements **already inserted** are **strictly less** than `x`
- How many elements **already inserted** are **strictly greater** than `x`

This is a **dynamic frequency counting** problem. We can use a **Fenwick Tree (Binary Indexed Tree)** or **Segment Tree** to maintain the frequency of values seen so far.

**Why these data structures work:**

- They allow \(O(\log M)\) updates (add 1 to frequency of value `x`)
- They allow \(O(\log M)\) prefix sum queries (sum of frequencies up to value `k`)
- `M` is the maximum value in `instructions` (or compressed coordinate range)

**Steps:**

1. **Coordinate compression**: Map values to indices 1..N to keep tree size manageable.
2. **Initialize BIT** of size N (compressed range).
3. For each `x`:
   - Query sum of frequencies for values **less than** `x` → `less = query(compressed_x - 1)`
   - Query sum of frequencies for values **greater than** `x` → `greater = total_inserted - query(compressed_x)`  
     (where `query(compressed_x)` gives count ≤ `x`, so subtract count ≤ `x` from total)
   - Cost = `min(less, greater)`
   - Update BIT at `compressed_x` by adding 1

**Why this is efficient:**

- Each operation is \(O(\log M)\)
- Total time: \(O(n \log M)\)
- Space: \(O(M)\) for BIT (or \(O(N)\) with compression)

## Optimal Solution

Here's the complete solution using Fenwick Tree with coordinate compression:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
class FenwickTree:
    def __init__(self, size):
        self.size = size
        self.tree = [0] * (size + 1)  # 1-indexed

    def update(self, index, delta):
        """Add delta to element at index (1-indexed)"""
        while index <= self.size:
            self.tree[index] += delta
            index += index & -index  # Move to next responsible index

    def query(self, index):
        """Get prefix sum from 1 to index (inclusive)"""
        res = 0
        while index > 0:
            res += self.tree[index]
            index -= index & -index  # Move to parent
        return res

def createSortedArray(instructions):
    MOD = 10**9 + 7

    # Step 1: Coordinate compression
    sorted_unique = sorted(set(instructions))
    value_to_index = {v: i+1 for i, v in enumerate(sorted_unique)}  # 1-indexed

    # Step 2: Initialize Fenwick Tree
    n = len(sorted_unique)
    bit = FenwickTree(n)

    total_cost = 0
    total_inserted = 0

    for x in instructions:
        idx = value_to_index[x]  # Compressed index (1-indexed)

        # Count elements strictly less than x
        less_count = bit.query(idx - 1)

        # Count elements strictly greater than x
        # query(idx) gives count of elements ≤ x
        count_leq_x = bit.query(idx)
        greater_count = total_inserted - count_leq_x

        # Cost is minimum of the two
        cost = min(less_count, greater_count)
        total_cost = (total_cost + cost) % MOD

        # Update BIT and total count
        bit.update(idx, 1)
        total_inserted += 1

    return total_cost
```

```javascript
// Time: O(n log n) | Space: O(n)
class FenwickTree {
  constructor(size) {
    this.size = size;
    this.tree = new Array(size + 1).fill(0); // 1-indexed
  }

  update(index, delta) {
    // Add delta to element at index (1-indexed)
    while (index <= this.size) {
      this.tree[index] += delta;
      index += index & -index; // Move to next responsible index
    }
  }

  query(index) {
    // Get prefix sum from 1 to index (inclusive)
    let res = 0;
    while (index > 0) {
      res += this.tree[index];
      index -= index & -index; // Move to parent
    }
    return res;
  }
}

function createSortedArray(instructions) {
  const MOD = 1e9 + 7;

  // Step 1: Coordinate compression
  const sortedUnique = [...new Set(instructions)].sort((a, b) => a - b);
  const valueToIndex = new Map();
  sortedUnique.forEach((v, i) => valueToIndex.set(v, i + 1)); // 1-indexed

  // Step 2: Initialize Fenwick Tree
  const n = sortedUnique.length;
  const bit = new FenwickTree(n);

  let totalCost = 0;
  let totalInserted = 0;

  for (const x of instructions) {
    const idx = valueToIndex.get(x); // Compressed index (1-indexed)

    // Count elements strictly less than x
    const lessCount = bit.query(idx - 1);

    // Count elements strictly greater than x
    // query(idx) gives count of elements ≤ x
    const countLeqX = bit.query(idx);
    const greaterCount = totalInserted - countLeqX;

    // Cost is minimum of the two
    const cost = Math.min(lessCount, greaterCount);
    totalCost = (totalCost + cost) % MOD;

    // Update BIT and total count
    bit.update(idx, 1);
    totalInserted++;
  }

  return totalCost;
}
```

```java
// Time: O(n log n) | Space: O(n)
class FenwickTree {
    private int[] tree;
    private int size;

    public FenwickTree(int size) {
        this.size = size;
        this.tree = new int[size + 1]; // 1-indexed
    }

    public void update(int index, int delta) {
        // Add delta to element at index (1-indexed)
        while (index <= size) {
            tree[index] += delta;
            index += index & -index; // Move to next responsible index
        }
    }

    public int query(int index) {
        // Get prefix sum from 1 to index (inclusive)
        int res = 0;
        while (index > 0) {
            res += tree[index];
            index -= index & -index; // Move to parent
        }
        return res;
    }
}

public int createSortedArray(int[] instructions) {
    final int MOD = 1_000_000_007;

    // Step 1: Coordinate compression
    int[] sorted = instructions.clone();
    Arrays.sort(sorted);

    // Create mapping from value to compressed index (1-indexed)
    Map<Integer, Integer> valueToIndex = new HashMap<>();
    int idx = 1;
    for (int i = 0; i < sorted.length; i++) {
        if (i == 0 || sorted[i] != sorted[i - 1]) {
            valueToIndex.put(sorted[i], idx++);
        }
    }

    // Step 2: Initialize Fenwick Tree
    int n = valueToIndex.size();
    FenwickTree bit = new FenwickTree(n);

    int totalCost = 0;
    int totalInserted = 0;

    for (int x : instructions) {
        int compressedIdx = valueToIndex.get(x); // 1-indexed

        // Count elements strictly less than x
        int lessCount = bit.query(compressedIdx - 1);

        // Count elements strictly greater than x
        // query(compressedIdx) gives count of elements ≤ x
        int countLeqX = bit.query(compressedIdx);
        int greaterCount = totalInserted - countLeqX;

        // Cost is minimum of the two
        int cost = Math.min(lessCount, greaterCount);
        totalCost = (totalCost + cost) % MOD;

        // Update BIT and total count
        bit.update(compressedIdx, 1);
        totalInserted++;
    }

    return totalCost;
}
```

</div>

## Complexity Analysis

**Time Complexity:** \(O(n \log n)\)

- Coordinate compression: \(O(n \log n)\) for sorting unique values
- For each of \(n\) instructions:
  - Two BIT queries: \(O(\log M)\) each
  - One BIT update: \(O(\log M)\)
  - Total: \(O(n \log M)\) where \(M\) is number of unique values
- Overall: \(O(n \log n)\) dominates

**Space Complexity:** \(O(n)\)

- Coordinate compression mapping: \(O(n)\)
- Fenwick Tree: \(O(M)\) where \(M\) is number of unique values ≤ \(n\)
- Total: \(O(n)\)

## Common Mistakes

1. **Forgetting coordinate compression**: If values range up to \(10^9\), a direct BIT of that size would use excessive memory. Always compress coordinates when values have large ranges.

2. **Off-by-one errors in BIT indices**: BITs are 1-indexed. When querying for "less than x", use `query(idx - 1)`, not `query(idx)`. Also ensure compressed indices start at 1.

3. **Incorrect greater count calculation**: The number of greater elements is `total_inserted - query(idx)` (not `total_inserted - query(idx - 1)`). `query(idx)` gives count ≤ x, so subtracting from total gives count > x.

4. **Modulo operation placement**: Apply modulo only to the total cost, not to intermediate BIT values. BIT stores actual counts for correct queries.

## When You'll See This Pattern

This problem combines **dynamic frequency counting** with **range queries**, a pattern common in problems where you need to track order statistics as elements are added/removed:

1. **Count Good Triplets in an Array (Hard)**: Similar dynamic counting with BIT/Segment Tree to track elements between indices.

2. **Longest Substring of One Repeating Character (Hard)**: Uses segment trees to maintain character frequencies and query ranges efficiently.

3. **Count of Smaller Numbers After Self (Medium)**: Classic BIT application to count how many elements to the right are smaller.

4. **Reverse Pairs (Hard)**: Count pairs where `nums[i] > 2*nums[j]` with `i < j`, solvable with BIT after coordinate compression.

## Key Takeaways

1. **When you need to maintain sorted order with dynamic insertions and rank queries**, consider Fenwick Tree or Segment Tree instead of actual sorted containers.

2. **Coordinate compression** is essential when value ranges are large but count of unique values is manageable. Map values to dense indices 1..N.

3. **For "count less than/greater than" queries**, remember:
   - `less = query(idx - 1)`
   - `greater = total - query(idx)` where `query(idx)` gives count ≤ current value

4. **Fenwick Tree operations**:
   - `update(i, delta)`: Add `delta` starting at index `i`
   - `query(i)`: Sum from 1 to `i`
   - Both run in \(O(\log n)\)

Related problems: [Count Good Triplets in an Array](/problem/count-good-triplets-in-an-array), [Longest Substring of One Repeating Character](/problem/longest-substring-of-one-repeating-character), [Sort Array by Moving Items to Empty Space](/problem/sort-array-by-moving-items-to-empty-space)
