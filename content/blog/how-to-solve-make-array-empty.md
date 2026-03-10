---
title: "How to Solve Make Array Empty — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Make Array Empty. Hard difficulty, 26.7% acceptance rate. Topics: Array, Binary Search, Greedy, Binary Indexed Tree, Segment Tree."
date: "2026-02-09"
category: "dsa-patterns"
tags: ["make-array-empty", "array", "binary-search", "greedy", "hard"]
---

# How to Solve "Make Array Empty"

This problem asks us to simulate a specific process on an array of distinct integers: repeatedly check if the first element is the smallest remaining element. If it is, remove it; otherwise, move it to the end. We need to count how many operations it takes to empty the array. What makes this tricky is that a direct simulation would be too slow for large arrays (up to 10⁵ elements), forcing us to find a smarter way to calculate the total operations without actually performing them all.

## Visual Walkthrough

Let's trace through `nums = [3, 1, 4, 2]`:

**Step 1:** First element is 3. Smallest remaining is 1. 3 ≠ 1, so move 3 to end → `[1, 4, 2, 3]` (1 operation)

**Step 2:** First element is 1. Smallest remaining is 1. They match, so remove 1 → `[4, 2, 3]` (2 operations total)

**Step 3:** First element is 4. Smallest remaining is 2. 4 ≠ 2, so move 4 to end → `[2, 3, 4]` (3 operations)

**Step 4:** First element is 2. Smallest remaining is 2. They match, remove 2 → `[3, 4]` (4 operations)

**Step 5:** First element is 3. Smallest remaining is 3. They match, remove 3 → `[4]` (5 operations)

**Step 6:** First element is 4. Smallest remaining is 4. They match, remove 4 → `[]` (6 operations)

Total operations: 6.

Notice the pattern: we process elements in sorted order (1, 2, 3, 4). For each element, we need to know how many "move to end" operations occur before we can remove it. The key insight is that we can track the original positions of sorted elements to calculate this efficiently.

## Brute Force Approach

The most straightforward approach is to simulate the exact process described:

1. Initialize a counter for operations
2. While the array isn't empty:
   - Find the minimum element in the current array
   - If the first element equals the minimum, remove it (1 operation)
   - Otherwise, move the first element to the end (1 operation)

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def countOperationsToEmptyArray(nums):
    operations = 0
    arr = nums[:]  # Work on a copy

    while arr:
        # Find current minimum
        min_val = min(arr)

        if arr[0] == min_val:
            # Remove first element
            arr.pop(0)
            operations += 1
        else:
            # Move first element to end
            arr.append(arr.pop(0))
            operations += 1

    return operations
```

```javascript
// Time: O(n²) | Space: O(n)
function countOperationsToEmptyArray(nums) {
  let operations = 0;
  let arr = [...nums]; // Work on a copy

  while (arr.length > 0) {
    // Find current minimum
    let minVal = Math.min(...arr);

    if (arr[0] === minVal) {
      // Remove first element
      arr.shift();
      operations++;
    } else {
      // Move first element to end
      arr.push(arr.shift());
      operations++;
    }
  }

  return operations;
}
```

```java
// Time: O(n²) | Space: O(n)
public long countOperationsToEmptyArray(int[] nums) {
    long operations = 0;
    List<Integer> list = new ArrayList<>();
    for (int num : nums) list.add(num);

    while (!list.isEmpty()) {
        // Find current minimum
        int minVal = Collections.min(list);

        if (list.get(0) == minVal) {
            // Remove first element
            list.remove(0);
            operations++;
        } else {
            // Move first element to end
            list.add(list.remove(0));
            operations++;
        }
    }

    return operations;
}
```

</div>

**Why this fails:** Each iteration requires finding the minimum (O(n)) and potentially removing from the front (O(n) for arrays/lists). With n up to 10⁵, O(n²) is far too slow (potentially 10¹⁰ operations). We need an O(n log n) or better solution.

## Optimized Approach

The key insight is that we process elements in sorted order. Once we remove the smallest element, the next smallest becomes our target, and so on. We need to efficiently track how many elements we "skip over" between consecutive removals.

**Step-by-step reasoning:**

1. **Sort with original indices:** Create an array of `(value, original_index)` pairs and sort by value. This tells us the order in which elements will be removed.

2. **Track current position:** As we simulate mentally, we maintain a "current position" in the original array. Initially, we're at index 0.

3. **Calculate moves between removals:** When moving from removing element i to element i+1 (in sorted order), we need to know how many elements we pass over. This equals the number of elements between the original positions of these two elements in the current circular traversal.

4. **Handle wrap-around:** Since we're moving elements to the end (circular behavior), if the next element's original position comes before our current position in the circular order, we've wrapped around the array.

5. **Efficient calculation:** We can use a Fenwick Tree (Binary Indexed Tree) or similar structure to track which elements are still present, allowing us to count remaining elements between positions in O(log n) time.

**Alternative simpler approach:** Since all elements are distinct, we can think in terms of the original array order. When we remove an element, all elements before it in the original array that haven't been removed yet will be moved to the end. The number of operations between removals equals the number of still-present elements between the current position and the next element's original position in the circular order.

## Optimal Solution

Here's the optimal O(n log n) solution using sorting and a Fenwick Tree to efficiently count remaining elements:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def countOperationsToEmptyArray(nums):
    n = len(nums)

    # Step 1: Create list of (value, original_index) and sort by value
    # This gives us the order in which elements will be removed
    sorted_elements = sorted([(num, i) for i, num in enumerate(nums)])

    # Step 2: Initialize Fenwick Tree (Binary Indexed Tree) to track remaining elements
    # BIT supports point updates and prefix sum queries in O(log n)
    bit = [0] * (n + 1)  # 1-indexed for BIT

    def update(idx, delta):
        """Add delta to element at idx (1-indexed)"""
        while idx <= n:
            bit[idx] += delta
            idx += idx & -idx

    def query(idx):
        """Get prefix sum up to idx (1-indexed)"""
        res = 0
        while idx > 0:
            res += bit[idx]
            idx -= idx & -idx
        return res

    def range_sum(l, r):
        """Get sum from l to r (both 1-indexed, inclusive)"""
        if l > r:
            return 0
        return query(r) - query(l - 1)

    # Step 3: Initially mark all elements as present (value = 1)
    for i in range(1, n + 1):
        update(i, 1)

    # Step 4: Process elements in sorted order
    operations = 0
    curr_pos = 1  # Current position in 1-indexed terms

    for i in range(n):
        # Get the original position (1-indexed) of the next element to remove
        next_pos = sorted_elements[i][1] + 1

        if next_pos >= curr_pos:
            # No wrap-around: count elements between curr_pos and next_pos
            # (excluding next_pos itself since we're about to remove it)
            moves = range_sum(curr_pos, next_pos - 1)
        else:
            # Wrap-around: count from curr_pos to end, then from start to next_pos
            moves = range_sum(curr_pos, n) + range_sum(1, next_pos - 1)

        # Each move operation moves an element to the end
        # Plus 1 for the actual removal operation
        operations += moves + 1

        # Remove the element from BIT
        update(next_pos, -1)

        # Update current position
        # After removal, we're at the position after the removed element
        # If that was the last element, we're back at position 1
        curr_pos = next_pos + 1 if next_pos < n else 1

    return operations
```

```javascript
// Time: O(n log n) | Space: O(n)
function countOperationsToEmptyArray(nums) {
  const n = nums.length;

  // Step 1: Create array of [value, original_index] and sort by value
  const sortedElements = nums.map((num, idx) => [num, idx]).sort((a, b) => a[0] - b[0]);

  // Step 2: Fenwick Tree implementation
  const bit = new Array(n + 1).fill(0); // 1-indexed

  function update(idx, delta) {
    while (idx <= n) {
      bit[idx] += delta;
      idx += idx & -idx;
    }
  }

  function query(idx) {
    let res = 0;
    while (idx > 0) {
      res += bit[idx];
      idx -= idx & -idx;
    }
    return res;
  }

  function rangeSum(l, r) {
    if (l > r) return 0;
    return query(r) - query(l - 1);
  }

  // Step 3: Mark all elements as present initially
  for (let i = 1; i <= n; i++) {
    update(i, 1);
  }

  // Step 4: Process in sorted order
  let operations = 0;
  let currPos = 1; // 1-indexed

  for (let i = 0; i < n; i++) {
    const nextPos = sortedElements[i][1] + 1; // Convert to 1-indexed

    let moves;
    if (nextPos >= currPos) {
      // No wrap-around
      moves = rangeSum(currPos, nextPos - 1);
    } else {
      // Wrap-around: from currPos to end, then from start to nextPos
      moves = rangeSum(currPos, n) + rangeSum(1, nextPos - 1);
    }

    // Add moves for shifting elements + 1 for removal
    operations += moves + 1;

    // Remove the element
    update(nextPos, -1);

    // Update current position
    currPos = nextPos < n ? nextPos + 1 : 1;
  }

  return operations;
}
```

```java
// Time: O(n log n) | Space: O(n)
public long countOperationsToEmptyArray(int[] nums) {
    int n = nums.length;

    // Step 1: Create array of pairs (value, original_index) and sort by value
    int[][] sortedElements = new int[n][2];
    for (int i = 0; i < n; i++) {
        sortedElements[i][0] = nums[i];
        sortedElements[i][1] = i;
    }
    Arrays.sort(sortedElements, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 2: Fenwick Tree implementation
    class FenwickTree {
        int[] bit;
        int n;

        FenwickTree(int size) {
            n = size;
            bit = new int[n + 1];
        }

        void update(int idx, int delta) {
            while (idx <= n) {
                bit[idx] += delta;
                idx += idx & -idx;
            }
        }

        int query(int idx) {
            int res = 0;
            while (idx > 0) {
                res += bit[idx];
                idx -= idx & -idx;
            }
            return res;
        }

        int rangeSum(int l, int r) {
            if (l > r) return 0;
            return query(r) - query(l - 1);
        }
    }

    FenwickTree bit = new FenwickTree(n);

    // Step 3: Mark all elements as present initially
    for (int i = 1; i <= n; i++) {
        bit.update(i, 1);
    }

    // Step 4: Process elements in sorted order
    long operations = 0;
    int currPos = 1;  // 1-indexed

    for (int i = 0; i < n; i++) {
        int nextPos = sortedElements[i][1] + 1;  // Convert to 1-indexed

        long moves;
        if (nextPos >= currPos) {
            // No wrap-around
            moves = bit.rangeSum(currPos, nextPos - 1);
        } else {
            // Wrap-around
            moves = bit.rangeSum(currPos, n) + bit.rangeSum(1, nextPos - 1);
        }

        // Add moves for shifting + 1 for removal
        operations += moves + 1;

        // Remove the element
        bit.update(nextPos, -1);

        // Update current position
        currPos = nextPos < n ? nextPos + 1 : 1;
    }

    return operations;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the elements takes O(n log n)
- Each Fenwick Tree operation (update or query) takes O(log n)
- We perform O(n) such operations (2 per element: one update and one query)
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity:** O(n)

- We store the sorted array of size n
- The Fenwick Tree uses O(n) space
- Other variables use O(1) additional space

## Common Mistakes

1. **Forgetting about wrap-around:** When the next element to remove appears before the current position in the circular array, you must count elements from the current position to the end PLUS from the beginning to the next position. Missing this gives wrong counts.

2. **Off-by-one errors with indices:** The Fenwick Tree is 1-indexed while array indices are 0-indexed. Carefully convert between them. Also, when counting elements between positions, remember not to include the element we're about to remove.

3. **Using inefficient data structures:** Attempting to use an array or list to track remaining elements leads to O(n) operations for each query, resulting in O(n²) total time. The Fenwick Tree is essential for O(log n) queries.

4. **Not considering large operation counts:** The number of operations can exceed 32-bit integer range (up to ~10¹⁰ for n=10⁵). Always use 64-bit integers (long in Java/JavaScript, int in Python handles big integers automatically).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Processing in sorted order while tracking original positions:** Similar to problems where you need to process elements in a specific order but operations depend on original arrangement.
   - Related: "Minimum Number of Operations to Make Array Continuous" (LeetCode 2009)
   - Related: "Count of Smaller Numbers After Self" (LeetCode 315)

2. **Fenwick Tree for dynamic range queries:** When you need to frequently query and update prefix sums on a changing array.
   - Related: "Range Sum Query - Mutable" (LeetCode 307)
   - Related: "Count of Range Sum" (LeetCode 327)

3. **Circular array simulations:** Problems where operations involve moving elements in a circular manner.
   - Related: "Rotate Array" (LeetCode 189) though simpler
   - Related: "Find the Winner of the Circular Game" (LeetCode 1823)

## Key Takeaways

1. **When simulation is too slow, look for mathematical patterns:** Instead of simulating each operation, analyze how the total count can be computed from the sequence of events.

2. **Sorting with original indices is powerful:** When you need to process elements in a specific order but operations depend on their original positions, create (value, index) pairs and sort by value.

3. **Fenwick Trees excel at dynamic frequency counting:** When you need to maintain a count of "active" elements and query how many are in a range with frequent updates, a Fenwick Tree provides O(log n) operations.

[Practice this problem on CodeJeet](/problem/make-array-empty)
