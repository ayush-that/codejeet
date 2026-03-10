---
title: "How to Solve Find Kth Largest XOR Coordinate Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Kth Largest XOR Coordinate Value. Medium difficulty, 64.2% acceptance rate. Topics: Array, Divide and Conquer, Bit Manipulation, Sorting, Heap (Priority Queue)."
date: "2029-04-29"
category: "dsa-patterns"
tags:
  [
    "find-kth-largest-xor-coordinate-value",
    "array",
    "divide-and-conquer",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Find Kth Largest XOR Coordinate Value

This problem asks us to compute XOR values for all coordinates in a 2D matrix, where each coordinate's value is the XOR of all elements in the submatrix from (0,0) to that coordinate, then find the k-th largest among these values. What makes this interesting is the combination of 2D prefix sums (but with XOR instead of addition) with selection algorithms to find the k-th largest element efficiently.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Matrix:**

```
[5, 2]
[1, 6]
```

**k = 1** (we want the largest value)

**Step 1: Understanding coordinate values**

- Coordinate (0,0): Only includes matrix[0][0] = 5 → XOR = 5
- Coordinate (0,1): Includes matrix[0][0] and matrix[0][1] → 5 XOR 2 = 7
- Coordinate (1,0): Includes matrix[0][0] and matrix[1][0] → 5 XOR 1 = 4
- Coordinate (1,1): Includes all four elements → 5 XOR 2 XOR 1 XOR 6 = 0

**Step 2: The XOR prefix pattern**
Notice we can compute these more efficiently:

- (0,0): 5
- (0,1): (0,0) XOR matrix[0][1] = 5 XOR 2 = 7
- (1,0): (0,0) XOR matrix[1][0] = 5 XOR 1 = 4
- (1,1): (0,1) XOR (1,0) XOR (0,0) XOR matrix[1][1] = 7 XOR 4 XOR 5 XOR 6 = 0

Wait, that's messy. There's actually a cleaner recurrence relation...

**Step 3: The correct recurrence**
For any coordinate (i,j):

```
prefix[i][j] = matrix[i][j] XOR prefix[i-1][j] XOR prefix[i][j-1] XOR prefix[i-1][j-1]
```

Where prefix[i][j] = 0 if i < 0 or j < 0

Let's verify:

- prefix[0][0] = 5 XOR 0 XOR 0 XOR 0 = 5 ✓
- prefix[0][1] = 2 XOR 0 XOR 5 XOR 0 = 7 ✓
- prefix[1][0] = 1 XOR 5 XOR 0 XOR 0 = 4 ✓
- prefix[1][1] = 6 XOR 4 XOR 7 XOR 5 = 0 ✓

**Step 4: Finding k-th largest**
Our prefix values: [5, 7, 4, 0]
Sorted descending: [7, 5, 4, 0]
k=1 → 7 is the answer

## Brute Force Approach

A naive approach would be to compute each coordinate's value by literally XOR-ing all elements in its submatrix:

1. For each coordinate (i,j):
   - Initialize XOR = 0
   - For each row from 0 to i:
     - For each column from 0 to j:
       - XOR with matrix[row][col]
   - Store the result

2. Collect all results, sort them in descending order
3. Return the k-th largest (at index k-1)

**Why this is too slow:**

- Time complexity: O(m²n²) - For an m×n matrix, we have m×n coordinates, and each coordinate's computation takes O(i×j) operations
- For a 200×200 matrix, that's 40,000 coordinates × up to 40,000 operations each = 1.6 billion operations!

**The key insight:** We're recomputing the same XOR operations repeatedly. The submatrix for (i,j) overlaps significantly with the submatrices for (i-1,j) and (i,j-1).

## Optimized Approach

The optimization comes from recognizing that XOR, like addition, has a prefix property. We can use dynamic programming to build a 2D prefix XOR array:

**Key Insight 1: 2D Prefix XOR**
Just like 2D prefix sums, we can compute:

```
prefix[i][j] = XOR of all elements in rectangle (0,0) to (i,j)
```

With the recurrence:

```
prefix[i][j] = matrix[i][j] XOR prefix[i-1][j] XOR prefix[i][j-1] XOR prefix[i-1][j-1]
```

Why XOR prefix[i-1][j-1] twice? Because when we XOR prefix[i-1][j] and prefix[i][j-1], the region (0,0) to (i-1,j-1) gets included twice. In XOR, XOR-ing something twice cancels it out (a XOR a = 0), so we need to XOR it once more to include it properly.

**Key Insight 2: Finding k-th largest efficiently**
Once we have all prefix values (m×n of them), we need the k-th largest. We could:

1. Sort all values: O(mn log(mn)) time, O(mn) space
2. Use a min-heap of size k: O(mn log k) time, O(k) space
3. Use quickselect: O(mn) average time, O(mn) space

For this problem, the heap approach is clean and efficient enough given the constraints.

## Optimal Solution

We'll implement the solution using:

1. 2D prefix XOR computation
2. Min-heap to track the k largest values

<div class="code-group">

```python
# Time: O(m*n*log k) | Space: O(m*n) for prefix array, O(k) for heap
def kthLargestValue(matrix, k):
    """
    Find the k-th largest XOR coordinate value in a 2D matrix.

    Args:
        matrix: 2D list of integers
        k: integer, 1-indexed position of largest value to find

    Returns:
        The k-th largest XOR coordinate value
    """
    m, n = len(matrix), len(matrix[0])

    # Step 1: Create prefix XOR array with extra row and column of zeros
    # This avoids boundary checks in the recurrence formula
    prefix = [[0] * (n + 1) for _ in range(m + 1)]

    # Step 2: Collect all XOR values in a list
    xor_values = []

    # Compute prefix XOR for each cell using the recurrence relation
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Recurrence: current = matrix value XOR top XOR left XOR top-left
            # The extra row/column means prefix[i][j] corresponds to matrix[i-1][j-1]
            prefix[i][j] = (
                matrix[i-1][j-1] ^
                prefix[i-1][j] ^
                prefix[i][j-1] ^
                prefix[i-1][j-1]
            )
            xor_values.append(prefix[i][j])

    # Step 3: Find k-th largest using min-heap
    # We maintain a min-heap of size k containing the k largest values seen so far
    import heapq

    # Initialize heap with first k values (or all if fewer than k)
    min_heap = []
    for value in xor_values:
        # Push current value to heap
        heapq.heappush(min_heap, value)

        # If heap exceeds size k, remove the smallest (root of min-heap)
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    # The root of the min-heap is the k-th largest element
    return min_heap[0]
```

```javascript
// Time: O(m*n*log k) | Space: O(m*n) for prefix array, O(k) for heap
/**
 * Find the k-th largest XOR coordinate value in a 2D matrix.
 * @param {number[][]} matrix - 2D array of integers
 * @param {number} k - 1-indexed position of largest value to find
 * @return {number} The k-th largest XOR coordinate value
 */
function kthLargestValue(matrix, k) {
  const m = matrix.length;
  const n = matrix[0].length;

  // Step 1: Create prefix XOR array with extra row and column of zeros
  // This avoids boundary checks in the recurrence formula
  const prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Step 2: Collect all XOR values
  const xorValues = [];

  // Compute prefix XOR for each cell using the recurrence relation
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Recurrence: current = matrix value XOR top XOR left XOR top-left
      // The extra row/column means prefix[i][j] corresponds to matrix[i-1][j-1]
      prefix[i][j] =
        matrix[i - 1][j - 1] ^ prefix[i - 1][j] ^ prefix[i][j - 1] ^ prefix[i - 1][j - 1];
      xorValues.push(prefix[i][j]);
    }
  }

  // Step 3: Find k-th largest using min-heap
  // We maintain a min-heap of size k containing the k largest values seen so far
  const minHeap = new MinHeap();

  for (const value of xorValues) {
    minHeap.push(value);

    // If heap exceeds size k, remove the smallest (root of min-heap)
    if (minHeap.size() > k) {
      minHeap.pop(); // Removes the smallest element
    }
  }

  // The root of the min-heap is the k-th largest element
  return minHeap.peek();
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  _bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element >= parent) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild < element) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if ((swap === null && rightChild < element) || (swap !== null && rightChild < leftChild)) {
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
// Time: O(m*n*log k) | Space: O(m*n) for prefix array, O(k) for heap
import java.util.PriorityQueue;

class Solution {
    /**
     * Find the k-th largest XOR coordinate value in a 2D matrix.
     * @param matrix 2D array of integers
     * @param k 1-indexed position of largest value to find
     * @return The k-th largest XOR coordinate value
     */
    public int kthLargestValue(int[][] matrix, int k) {
        int m = matrix.length;
        int n = matrix[0].length;

        // Step 1: Create prefix XOR array with extra row and column of zeros
        // This avoids boundary checks in the recurrence formula
        int[][] prefix = new int[m + 1][n + 1];

        // Step 2: Use min-heap to track k largest values
        // Min-heap will keep smallest of top-k at root
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        // Step 3: Compute prefix XOR and maintain heap
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // Recurrence: current = matrix value XOR top XOR left XOR top-left
                // The extra row/column means prefix[i][j] corresponds to matrix[i-1][j-1]
                prefix[i][j] = matrix[i-1][j-1] ^
                               prefix[i-1][j] ^
                               prefix[i][j-1] ^
                               prefix[i-1][j-1];

                // Add current XOR value to heap
                minHeap.offer(prefix[i][j]);

                // If heap exceeds size k, remove the smallest element
                if (minHeap.size() > k) {
                    minHeap.poll(); // Removes the smallest (root of min-heap)
                }
            }
        }

        // The root of the min-heap is the k-th largest element
        return minHeap.peek();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n × log k)**

- We iterate through all m × n cells once: O(m × n)
- For each cell, we perform heap operations (push/pop): O(log k)
- Total: O(m × n × log k)

**Space Complexity: O(m × n + k)**

- Prefix array: O((m+1) × (n+1)) ≈ O(m × n)
- Heap: O(k) to store k largest elements
- Total: O(m × n + k)

**Alternative approach with sorting:**
If we collected all values and sorted them, time would be O(m × n × log(m × n)), which is worse when k is small compared to m×n.

## Common Mistakes

1. **Incorrect XOR recurrence formula**: The most common error is getting the recurrence wrong. Remember it's:

   ```
   prefix[i][j] = matrix[i][j] XOR prefix[i-1][j] XOR prefix[i][j-1] XOR prefix[i-1][j-1]
   ```

   Not: `prefix[i][j] = matrix[i][j] XOR prefix[i-1][j] XOR prefix[i][j-1]` (missing the correction term)

2. **Off-by-one errors with boundaries**: When creating the prefix array with extra row/column, remember:
   - `prefix[i][j]` corresponds to `matrix[i-1][j-1]`
   - Loop from 1 to m (inclusive) and 1 to n (inclusive)

3. **Using max-heap instead of min-heap for k-th largest**: For k-th largest, we want a min-heap that keeps the k largest elements, where the smallest of those k is at the root. A max-heap would require keeping all elements.

4. **Not handling k > m×n**: While the problem guarantees 1 ≤ k ≤ m × n, in interviews you might be asked about edge cases. Always check if k is valid given the number of elements.

## When You'll See This Pattern

This problem combines two important patterns:

1. **2D Prefix Sum/XOR**: Similar to:
   - [304. Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/) - 2D prefix sums
   - [1314. Matrix Block Sum](https://leetcode.com/problems/matrix-block-sum/) - Applying prefix sums to compute block sums

2. **K-th Largest Element Selection**: Similar to:
   - [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) - The classic k-th largest problem
   - [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) - Using heaps for top-k problems

The combination appears in problems where you need to compute many values then find extremes among them, like:

- Finding maximum/minimum submatrix sums
- Statistical computations on transformed matrices

## Key Takeaways

1. **2D prefix computations work with XOR too**: Any associative operation (addition, multiplication, XOR) can use prefix techniques. The recurrence needs adjustment based on the operation's properties (XOR needs the correction term since a XOR a = 0).

2. **Min-heap for k-th largest, Max-heap for k-th smallest**: Remember this mnemonic. For k-th largest, maintain a min-heap of size k; the root is your answer.

3. **Consider time-space tradeoffs**: We used O(m×n) space for the prefix array. If space is constrained, we could compute values row by row and add directly to the heap, but we'd need to recompute or store previous row's values.

[Practice this problem on CodeJeet](/problem/find-kth-largest-xor-coordinate-value)
