---
title: "How to Solve Maximum Sum With at Most K Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum With at Most K Elements. Medium difficulty, 60.6% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue), Matrix."
date: "2028-12-02"
category: "dsa-patterns"
tags: ["maximum-sum-with-at-most-k-elements", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Sum With at Most K Elements

This problem asks us to find the maximum sum of at most `k` elements from a matrix, with the constraint that we can't take more than `limits[i]` elements from row `i`. What makes this interesting is that we need to balance two constraints: the global limit `k` and per-row limits, while always picking the largest available values. It's essentially a constrained selection problem where greedy choices lead to the optimal solution.

## Visual Walkthrough

Let's walk through a concrete example:

```
grid = [[3, 5, 2],
        [7, 1, 4]]
limits = [2, 1]
k = 3
```

**Step 1: Understand the constraints**

- Row 0: We can take at most 2 elements (from `[3, 5, 2]`)
- Row 1: We can take at most 1 element (from `[7, 1, 4]`)
- Overall: We can take at most 3 elements total

**Step 2: Sort each row in descending order**

- Row 0: `[5, 3, 2]` (largest to smallest)
- Row 1: `[7, 4, 1]` (largest to smallest)

**Step 3: Consider the best candidates from each row**
From row 0, the best we can get are:

- Take 1 element: `5`
- Take 2 elements: `5 + 3 = 8`

From row 1, the best we can get are:

- Take 1 element: `7`
- Can't take more due to `limits[1] = 1`

**Step 4: Combine the best options**
We need at most 3 elements total. Possible combinations:

1. Take 2 from row 0 (8) + 1 from row 1 (7) = 15 (uses all 3 elements)
2. Take 2 from row 0 (8) only = 8 (uses 2 elements)
3. Take 1 from row 0 (5) + 1 from row 1 (7) = 12 (uses 2 elements)
4. Take 1 from row 1 (7) only = 7 (uses 1 element)

The maximum is 15, taking elements `[5, 3]` from row 0 and `[7]` from row 1.

The key insight: For each row, we should consider taking the largest elements first (since they give the biggest sum), and we need to compare the "next best" element from any row against what we've already taken.

## Brute Force Approach

A brute force approach would try all possible combinations:

1. For each row, try taking 0 to `min(limits[i], k)` elements
2. Combine selections across rows such that total elements ≤ k
3. Calculate the sum for each valid combination
4. Return the maximum sum

This is exponential in complexity. If we have `n` rows and each can contribute up to `m` elements, we'd have `O((m+1)^n)` combinations to check, which is completely infeasible for typical constraints.

Even a slightly better brute force that only considers sorted elements still faces combinatorial explosion when trying to decide how many elements to take from each row.

## Optimized Approach

The key insight is that we can treat this as a **k-way merge problem**:

1. **Sort each row in descending order** - This ensures we always consider the largest elements first
2. **Calculate prefix sums for each row** - This lets us quickly know the sum of taking `x` elements from a row
3. **Use a max-heap to always pick the best available element** - We maintain a heap of "next best" elements from each row
4. **Track how many elements we've taken from each row** - We can't exceed `limits[i]` for any row

**Step-by-step reasoning:**

- Start with the largest element from each row in a max-heap
- While we haven't taken `k` elements and the heap isn't empty:
  - Pop the largest element from the heap
  - Add it to our sum
  - If that row still has more elements we can take (haven't reached its limit), push the next element from that row into the heap
- This greedy approach works because at each step, we're always picking the globally largest available element

**Why greedy works:**
If we need to pick at most `k` elements for maximum sum, we should always pick the `k` largest available elements that respect the row limits. A max-heap gives us exactly this - the ability to always access the current largest element.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n*m log m + k log n) | Space: O(n*m)
# n = number of rows, m = number of columns, k = max elements to take
def maxSum(grid, limits, k):
    """
    Returns the maximum sum of at most k elements from grid,
    with at most limits[i] elements from row i.
    """
    n = len(grid)

    # Step 1: Sort each row in descending order
    # This ensures we always consider largest elements first
    for i in range(n):
        grid[i].sort(reverse=True)

    # Step 2: Create a max-heap (using negative values for min-heap as max-heap)
    # Each element in heap is (-value, row_index, col_index)
    # We track col_index to know which element to take next from that row
    import heapq
    heap = []

    # Initialize heap with the first (largest) element from each row
    # But only if limits[i] > 0 (we can take at least one from that row)
    for i in range(n):
        if limits[i] > 0 and len(grid[i]) > 0:
            heapq.heappush(heap, (-grid[i][0], i, 0))

    # Step 3: Greedily pick the k largest elements
    total_sum = 0
    elements_taken = 0

    while elements_taken < k and heap:
        # Get the current largest element
        neg_val, row_idx, col_idx = heapq.heappop(heap)
        value = -neg_val  # Convert back to positive

        # Add to our sum
        total_sum += value
        elements_taken += 1

        # Check if we can take more from this row
        # We've taken (col_idx + 1) elements from this row so far
        # (since col_idx is 0-based index of the element we just took)
        elements_from_this_row = col_idx + 1

        # If we haven't reached the limit for this row AND
        # there are more elements in this row
        if (elements_from_this_row < limits[row_idx] and
            elements_from_this_row < len(grid[row_idx])):
            # Push the next element from this row into the heap
            next_col_idx = elements_from_this_row
            next_value = grid[row_idx][next_col_idx]
            heapq.heappush(heap, (-next_value, row_idx, next_col_idx))

    return total_sum
```

```javascript
// Time: O(n*m log m + k log n) | Space: O(n*m)
// n = number of rows, m = number of columns, k = max elements to take
function maxSum(grid, limits, k) {
  /**
   * Returns the maximum sum of at most k elements from grid,
   * with at most limits[i] elements from row i.
   */
  const n = grid.length;

  // Step 1: Sort each row in descending order
  // This ensures we always consider largest elements first
  for (let i = 0; i < n; i++) {
    grid[i].sort((a, b) => b - a); // Descending order
  }

  // Step 2: Create a max-heap using a priority queue
  // Each element in heap is [value, rowIndex, colIndex]
  // We use negative value for max-heap simulation with min-heap
  const heap = new MinHeap();

  // Initialize heap with the first (largest) element from each row
  // But only if limits[i] > 0 (we can take at least one from that row)
  for (let i = 0; i < n; i++) {
    if (limits[i] > 0 && grid[i].length > 0) {
      heap.push([-grid[i][0], i, 0]);
    }
  }

  // Step 3: Greedily pick the k largest elements
  let totalSum = 0;
  let elementsTaken = 0;

  while (elementsTaken < k && heap.size() > 0) {
    // Get the current largest element
    const [negVal, rowIdx, colIdx] = heap.pop();
    const value = -negVal; // Convert back to positive

    // Add to our sum
    totalSum += value;
    elementsTaken++;

    // Check if we can take more from this row
    // We've taken (colIdx + 1) elements from this row so far
    const elementsFromThisRow = colIdx + 1;

    // If we haven't reached the limit for this row AND
    // there are more elements in this row
    if (elementsFromThisRow < limits[rowIdx] && elementsFromThisRow < grid[rowIdx].length) {
      // Push the next element from this row into the heap
      const nextColIdx = elementsFromThisRow;
      const nextValue = grid[rowIdx][nextColIdx];
      heap.push([-nextValue, rowIdx, nextColIdx]);
    }
  }

  return totalSum;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element[0] >= parent[0]) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild[0] < element[0]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && rightChild[0] < leftChild[0])
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}
```

```java
// Time: O(n*m log m + k log n) | Space: O(n*m)
// n = number of rows, m = number of columns, k = max elements to take
import java.util.*;

class Solution {
    public int maxSum(int[][] grid, int[] limits, int k) {
        /**
         * Returns the maximum sum of at most k elements from grid,
         * with at most limits[i] elements from row i.
         */
        int n = grid.length;

        // Step 1: Sort each row in descending order
        // This ensures we always consider largest elements first
        for (int i = 0; i < n; i++) {
            // Convert to Integer array for descending sort
            Integer[] row = new Integer[grid[i].length];
            for (int j = 0; j < grid[i].length; j++) {
                row[j] = grid[i][j];
            }
            Arrays.sort(row, Collections.reverseOrder());
            // Convert back to int array
            for (int j = 0; j < grid[i].length; j++) {
                grid[i][j] = row[j];
            }
        }

        // Step 2: Create a max-heap using a priority queue
        // Each element in heap is (value, rowIndex, colIndex)
        // We use negative value for max-heap with min-heap
        PriorityQueue<int[]> heap = new PriorityQueue<>(
            (a, b) -> Integer.compare(a[0], b[0]) // Min-heap by first element
        );

        // Initialize heap with the first (largest) element from each row
        // But only if limits[i] > 0 (we can take at least one from that row)
        for (int i = 0; i < n; i++) {
            if (limits[i] > 0 && grid[i].length > 0) {
                // Store negative value to simulate max-heap
                heap.offer(new int[]{-grid[i][0], i, 0});
            }
        }

        // Step 3: Greedily pick the k largest elements
        int totalSum = 0;
        int elementsTaken = 0;

        while (elementsTaken < k && !heap.isEmpty()) {
            // Get the current largest element
            int[] current = heap.poll();
            int value = -current[0]; // Convert back to positive
            int rowIdx = current[1];
            int colIdx = current[2];

            // Add to our sum
            totalSum += value;
            elementsTaken++;

            // Check if we can take more from this row
            // We've taken (colIdx + 1) elements from this row so far
            int elementsFromThisRow = colIdx + 1;

            // If we haven't reached the limit for this row AND
            // there are more elements in this row
            if (elementsFromThisRow < limits[rowIdx] &&
                elementsFromThisRow < grid[rowIdx].length) {
                // Push the next element from this row into the heap
                int nextColIdx = elementsFromThisRow;
                int nextValue = grid[rowIdx][nextColIdx];
                heap.offer(new int[]{-nextValue, rowIdx, nextColIdx});
            }
        }

        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

1. Sorting each row: `O(n * m log m)` where `n` is rows, `m` is columns
2. Heap operations: We perform at most `k` extractions and `k` insertions, each `O(log n)` for heap of size at most `n`
3. Total: `O(n * m log m + k log n)`

**Space Complexity:**

1. Sorting is done in-place (except Java which needs conversion)
2. Heap stores at most `n` elements (one from each row)
3. Total: `O(n * m)` for the grid itself, `O(n)` for the heap

In practice, `k` is often smaller than `n * m`, making the heap operations efficient.

## Common Mistakes

1. **Forgetting to sort rows in descending order** - This is crucial because we need to always consider the largest elements first. If you don't sort, you might pick a smaller element when a larger one was available in the same row.

2. **Not handling empty rows or zero limits correctly** - Always check `limits[i] > 0` and `grid[i].length > 0` before adding elements to the heap. Otherwise, you might try to access non-existent elements.

3. **Incorrect index tracking** - The column index in the heap represents which element we've taken from that row. A common mistake is to use it as "elements taken so far" rather than "index of last taken element." Remember: if `col_idx = 2`, we've taken 3 elements (indices 0, 1, 2).

4. **Using a min-heap instead of max-heap** - We need the largest elements, so we either use a max-heap or store negative values in a min-heap. Mixing this up gives the minimum sum instead of maximum.

## When You'll See This Pattern

This **k-way merge with constraints** pattern appears in several problems:

1. **Find K Pairs With Smallest Sums (LeetCode 373)** - Similar heap approach to merge sorted arrays/lists while tracking indices.

2. **Kth Smallest Element in a Sorted Matrix (LeetCode 378)** - Uses a min-heap to traverse a matrix in sorted order, similar to our approach of always picking the "next best" element.

3. **Maximum Subsequence Score (LeetCode 2542)** - Combines sorting with heap-based selection under constraints, though with a different scoring function.

The core pattern is: when you need to select elements from multiple sorted sources with constraints, a heap that always gives you the "best next option" is often the right approach.

## Key Takeaways

1. **Greedy with a heap works for constrained selection** - When you need to pick the top `k` elements from multiple sources with limits, maintaining a heap of "next best" options from each source is optimal.

2. **Pre-sorting enables efficient greedy choices** - Sorting each row first transforms the problem into a simpler "pick from sorted lists" problem.

3. **Track state carefully** - For heap-based solutions, you need to track not just the value but also which source it came from and your position in that source, so you can add the next element when needed.

[Practice this problem on CodeJeet](/problem/maximum-sum-with-at-most-k-elements)
