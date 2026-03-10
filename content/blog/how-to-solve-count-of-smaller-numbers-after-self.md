---
title: "How to Solve Count of Smaller Numbers After Self — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count of Smaller Numbers After Self. Hard difficulty, 43.3% acceptance rate. Topics: Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree."
date: "2027-08-21"
category: "dsa-patterns"
tags:
  ["count-of-smaller-numbers-after-self", "array", "binary-search", "divide-and-conquer", "hard"]
---

# How to Solve Count of Smaller Numbers After Self

You're given an array of integers, and for each element, you need to count how many elements to its right are smaller than it. This problem is tricky because a naive approach would be O(n²), which is too slow for typical constraints. The interesting challenge is finding a way to track elements as we process them from right to left while maintaining sorted order for efficient counting.

## Visual Walkthrough

Let's trace through the example `nums = [5, 2, 6, 1]`:

**Step 1:** Start from the rightmost element `1`

- There are no elements to the right of `1`, so `counts[3] = 0`
- We maintain a sorted list of elements we've seen: `[1]`

**Step 2:** Move to element `6` at index 2

- We need to find how many elements in our sorted list are smaller than `6`
- Our sorted list is `[1]`, and all elements are smaller than `6`
- `counts[2] = 1` (just the `1`)
- Insert `6` into sorted list: `[1, 6]`

**Step 3:** Move to element `2` at index 1

- Find position where `2` would be inserted in `[1, 6]`
- `2` would go between `1` and `6`, so there's 1 element smaller than `2`
- `counts[1] = 1`
- Insert `2` into sorted list: `[1, 2, 6]`

**Step 4:** Move to element `5` at index 0

- Find position where `5` would be inserted in `[1, 2, 6]`
- `5` would go between `2` and `6`, so there are 2 elements smaller than `5`
- `counts[0] = 2`
- Insert `5` into sorted list: `[1, 2, 5, 6]`

Final result: `[2, 1, 1, 0]`

The key insight: by processing from right to left and maintaining a sorted list of elements we've already seen, we can use binary search to find the insertion position, which tells us how many smaller elements exist to the right.

## Brute Force Approach

The most straightforward solution is to use nested loops: for each element, scan all elements to its right and count how many are smaller.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output
def countSmaller(nums):
    n = len(nums)
    counts = [0] * n

    for i in range(n):
        # For each element, check all elements to the right
        for j in range(i + 1, n):
            if nums[j] < nums[i]:
                counts[i] += 1

    return counts
```

```javascript
// Time: O(n²) | Space: O(1) excluding output
function countSmaller(nums) {
  const n = nums.length;
  const counts = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    // For each element, check all elements to the right
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[i]) {
        counts[i]++;
      }
    }
  }

  return counts;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output
public List<Integer> countSmaller(int[] nums) {
    int n = nums.length;
    List<Integer> counts = new ArrayList<>(n);

    for (int i = 0; i < n; i++) {
        int count = 0;
        // For each element, check all elements to the right
        for (int j = i + 1; j < n; j++) {
            if (nums[j] < nums[i]) {
                count++;
            }
        }
        counts.add(count);
    }

    return counts;
}
```

</div>

**Why this fails:** With O(n²) time complexity, this solution times out for arrays with 10⁵ elements (which is common in LeetCode test cases). We need something closer to O(n log n).

## Optimized Approach

The optimal solution uses a **Binary Indexed Tree (Fenwick Tree)** or **Merge Sort with counting**. Both approaches achieve O(n log n) time complexity. Let's focus on the Binary Indexed Tree approach since it's more generalizable:

**Key Insight:** We can compress the input values to a smaller range and use a Fenwick Tree to efficiently:

1. Query how many numbers smaller than current number we've seen
2. Update the count for the current number

**Step-by-step reasoning:**

1. **Coordinate Compression:** Since `nums[i]` can be large (up to 10⁴), we map each unique value to a smaller index. This allows our Fenwick Tree to have size equal to the number of unique values, not the maximum value.
2. **Process from right to left:** As we move from right to left, we query how many smaller values we've already seen (to the right of current position).
3. **Fenwick Tree operations:**
   - `query(x)`: Returns the sum of counts for indices ≤ x (how many numbers ≤ x we've seen)
   - `update(x)`: Increments the count at index x (we've seen this number)

**Why Fenwick Tree works:** It supports both query and update in O(log n) time, giving us O(n log n) overall. The tree stores cumulative counts, so querying for `index-1` gives us how many smaller numbers we've seen.

## Optimal Solution

Here's the complete solution using Binary Indexed Tree with coordinate compression:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def countSmaller(nums):
    # Step 1: Coordinate compression
    # We map each unique value to a 1-based index
    sorted_nums = sorted(set(nums))
    # Create a mapping from value to compressed index
    value_to_index = {value: i + 1 for i, value in enumerate(sorted_nums)}
    n_compressed = len(sorted_nums)

    # Step 2: Initialize Fenwick Tree (Binary Indexed Tree)
    # Fenwick tree uses 1-based indexing internally
    fenwick = [0] * (n_compressed + 2)  # +2 for 1-based indexing and safety

    def update(index, delta):
        """Add delta to element at index and propagate to parent nodes"""
        while index <= n_compressed + 1:
            fenwick[index] += delta
            index += index & -index  # Move to next node

    def query(index):
        """Get prefix sum from 1 to index"""
        total = 0
        while index > 0:
            total += fenwick[index]
            index -= index & -index  # Move to parent node
        return total

    # Step 3: Process from right to left
    result = []
    # Traverse from rightmost to leftmost element
    for i in range(len(nums) - 1, -1, -1):
        # Get compressed index for current value
        compressed_idx = value_to_index[nums[i]]

        # Query how many numbers smaller than current we've seen
        # query(compressed_idx - 1) gives count of numbers with index < compressed_idx
        count = query(compressed_idx - 1)
        result.append(count)

        # Update Fenwick tree: we've seen current number
        update(compressed_idx, 1)

    # Reverse result since we processed from right to left
    return result[::-1]
```

```javascript
// Time: O(n log n) | Space: O(n)
function countSmaller(nums) {
  // Step 1: Coordinate compression
  // We map each unique value to a 1-based index
  const sortedUnique = [...new Set(nums)].sort((a, b) => a - b);
  const valueToIndex = new Map();
  sortedUnique.forEach((value, i) => {
    valueToIndex.set(value, i + 1); // 1-based indexing
  });
  const nCompressed = sortedUnique.length;

  // Step 2: Initialize Fenwick Tree (Binary Indexed Tree)
  // Fenwick tree uses 1-based indexing internally
  const fenwick = new Array(nCompressed + 2).fill(0); // +2 for 1-based indexing and safety

  function update(index, delta) {
    // Add delta to element at index and propagate to parent nodes
    while (index <= nCompressed + 1) {
      fenwick[index] += delta;
      index += index & -index; // Move to next node
    }
  }

  function query(index) {
    // Get prefix sum from 1 to index
    let total = 0;
    while (index > 0) {
      total += fenwick[index];
      index -= index & -index; // Move to parent node
    }
    return total;
  }

  // Step 3: Process from right to left
  const result = [];
  // Traverse from rightmost to leftmost element
  for (let i = nums.length - 1; i >= 0; i--) {
    // Get compressed index for current value
    const compressedIdx = valueToIndex.get(nums[i]);

    // Query how many numbers smaller than current we've seen
    // query(compressedIdx - 1) gives count of numbers with index < compressedIdx
    const count = query(compressedIdx - 1);
    result.push(count);

    // Update Fenwick tree: we've seen current number
    update(compressedIdx, 1);
  }

  // Reverse result since we processed from right to left
  return result.reverse();
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

public List<Integer> countSmaller(int[] nums) {
    // Step 1: Coordinate compression
    // We map each unique value to a 1-based index
    Set<Integer> uniqueSet = new TreeSet<>();
    for (int num : nums) {
        uniqueSet.add(num);
    }

    List<Integer> sortedUnique = new ArrayList<>(uniqueSet);
    Map<Integer, Integer> valueToIndex = new HashMap<>();
    for (int i = 0; i < sortedUnique.size(); i++) {
        valueToIndex.put(sortedUnique.get(i), i + 1); // 1-based indexing
    }
    int nCompressed = sortedUnique.size();

    // Step 2: Initialize Fenwick Tree (Binary Indexed Tree)
    // Fenwick tree uses 1-based indexing internally
    int[] fenwick = new int[nCompressed + 2]; // +2 for 1-based indexing and safety

    // Helper function to update Fenwick Tree
    // Add delta to element at index and propagate to parent nodes
    for (int i = nums.length - 1; i >= 0; i--) {
        int compressedIdx = valueToIndex.get(nums[i]);

        // Query how many numbers smaller than current we've seen
        // query(compressedIdx - 1) gives count of numbers with index < compressedIdx
        int count = query(fenwick, compressedIdx - 1);
        result.add(count);

        // Update Fenwick tree: we've seen current number
        update(fenwick, compressedIdx, 1, nCompressed);
    }

    // Reverse result since we processed from right to left
    Collections.reverse(result);
    return result;
}

private void update(int[] fenwick, int index, int delta, int n) {
    // Add delta to element at index and propagate to parent nodes
    while (index <= n + 1) {
        fenwick[index] += delta;
        index += index & -index; // Move to next node
    }
}

private int query(int[] fenwick, int index) {
    // Get prefix sum from 1 to index
    int total = 0;
    while (index > 0) {
        total += fenwick[index];
        index -= index & -index; // Move to parent node
    }
    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Coordinate compression: O(n log n) for sorting unique values
- Fenwick Tree operations: Each `update` and `query` takes O(log n) time, and we perform n of each → O(n log n)
- Overall dominated by O(n log n)

**Space Complexity: O(n)**

- Fenwick Tree: O(n) where n is number of unique values
- Value-to-index mapping: O(n)
- Result array: O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting coordinate compression:** If you use the original values as indices in the Fenwick Tree, you'll create a huge array (size up to 2×10⁴+1) which wastes memory and can cause performance issues. Always compress first.

2. **Off-by-one errors with Fenwick Tree indices:** Fenwick Trees typically use 1-based indexing. A common mistake is using 0-based indexing or forgetting to handle the `index-1` when querying for smaller elements.

3. **Processing from left to right:** If you process from left to right, you're counting elements to the left, not to the right. Always process from right to left for "after self" problems.

4. **Not reversing the result:** Since we process from right to left and append results, we need to reverse the final array. Forgetting this gives results in reverse order.

## When You'll See This Pattern

This pattern of "count inversions" or "count smaller/larger elements" appears in several problems:

1. **Reverse Pairs (Hard):** Count pairs where `nums[i] > 2*nums[j]` and `i < j`. Uses similar Fenwick Tree or Merge Sort approach with modified comparison.

2. **Count of Range Sum (Hard):** Count range sums that lie in a given range. Uses prefix sums with Fenwick Tree or Merge Sort.

3. **Queue Reconstruction by Height (Medium):** While not exactly the same, it uses the idea of inserting elements at specific positions based on counts of taller people, similar to our insertion approach.

The core technique—using a data structure that supports efficient range queries and updates (Fenwick Tree, Segment Tree, or balanced BST)—is applicable whenever you need to track counts of elements you've processed so far.

## Key Takeaways

1. **"Count after self" problems are often solved by processing from right to left** while maintaining a data structure of seen elements in sorted order.

2. **Fenwick Trees are ideal for dynamic frequency counting** when you need to frequently query prefix sums and update counts. They're more space-efficient than Segment Trees for this use case.

3. **Coordinate compression is crucial when values have large ranges** but limited unique values. It reduces the Fenwick Tree size from `max_value` to `num_unique_values`.

Remember: When you see "count of smaller/larger elements after/before" in a problem statement, think Fenwick Tree or Merge Sort with counting.

Related problems: [Count of Range Sum](/problem/count-of-range-sum), [Queue Reconstruction by Height](/problem/queue-reconstruction-by-height), [Reverse Pairs](/problem/reverse-pairs)
