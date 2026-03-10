---
title: "How to Solve The K Weakest Rows in a Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode The K Weakest Rows in a Matrix. Easy difficulty, 74.3% acceptance rate. Topics: Array, Binary Search, Sorting, Heap (Priority Queue), Matrix."
date: "2027-07-16"
category: "dsa-patterns"
tags: ["the-k-weakest-rows-in-a-matrix", "array", "binary-search", "sorting", "easy"]
---

# How to Solve The K Weakest Rows in a Matrix

This problem asks us to find the k weakest rows in a binary matrix where each row has all soldiers (1's) on the left and civilians (0's) on the right. The "weakness" of a row is determined by the number of soldiers it contains, with ties broken by row index. What makes this problem interesting is that the sorted nature of each row allows for optimization beyond simply counting soldiers, and we need to efficiently compare and rank rows based on multiple criteria.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
mat = [
    [1,1,0,0,0],  # Row 0: 2 soldiers
    [1,1,1,0,0],  # Row 1: 3 soldiers
    [1,0,0,0,0],  # Row 2: 1 soldier
    [1,1,0,0,0],  # Row 3: 2 soldiers
    [1,1,1,1,0]   # Row 4: 4 soldiers
]
k = 3
```

We need to find the 3 weakest rows. Let's think step by step:

1. **Count soldiers in each row**: Since all 1's are on the left, we can find the first 0 in each row
   - Row 0: First 0 at index 2 → 2 soldiers
   - Row 1: First 0 at index 3 → 3 soldiers
   - Row 2: First 0 at index 1 → 1 soldier
   - Row 3: First 0 at index 2 → 2 soldiers
   - Row 4: First 0 at index 4 → 4 soldiers

2. **Rank rows by weakness**: Fewer soldiers = weaker. If soldiers are equal, lower index = weaker
   - Row 2: 1 soldier (weakest)
   - Row 0: 2 soldiers (tie with row 3, but index 0 < 3)
   - Row 3: 2 soldiers
   - Row 1: 3 soldiers
   - Row 4: 4 soldiers

3. **Return first k rows**: The 3 weakest are rows [2, 0, 3]

The key insight is that we need to efficiently count soldiers (find first 0) and then sort rows by (soldier_count, row_index).

## Brute Force Approach

A naive approach would be to:

1. For each row, count soldiers by scanning left to right until we find a 0
2. Store (soldier_count, row_index) pairs for all rows
3. Sort all pairs by soldier_count then row_index
4. Return the first k row indices

This brute force works but is inefficient for counting soldiers. Since each row has length n, scanning each row takes O(n) time. With m rows, that's O(m × n) just for counting. The sorting takes O(m log m). While this might be acceptable for small matrices, we can do better by leveraging the fact that each row is sorted.

What makes the brute force suboptimal is that it doesn't use the sorted nature of each row. When we see "all 1's on the left, all 0's on the right," we should immediately think: **binary search** to find the first 0.

## Optimal Solution

The optimal approach uses binary search to efficiently count soldiers in each row, then uses a min-heap (priority queue) to find the k weakest rows without fully sorting all rows. Here's the step-by-step reasoning:

1. **Efficient soldier counting**: Since each row is sorted (all 1's then all 0's), we can use binary search to find the first 0 in O(log n) time instead of O(n).

2. **Finding k weakest rows**: We need the k smallest (soldier_count, row_index) pairs. A min-heap is perfect for this - we can:
   - Push all (soldier_count, row_index) pairs into a min-heap
   - Pop k times to get the k weakest rows
   - This takes O(m log m) to build the heap and O(k log m) to extract

3. **Even better approach**: We can use a max-heap of size k to track the k weakest rows seen so far. When the heap size exceeds k, we remove the "strongest" row (largest soldier_count, or if equal, larger row_index). This gives us O(m log k) time instead of O(m log m).

Let's implement the solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * log n + m * log k) - binary search for each row + heap operations
# Space: O(k) - for the heap storing k elements
def kWeakestRows(mat, k):
    """
    Find the k weakest rows in a binary matrix.

    Args:
        mat: List[List[int]] - binary matrix with 1's (soldiers) on left, 0's on right
        k: int - number of weakest rows to return

    Returns:
        List[int] - indices of the k weakest rows in ascending order of weakness
    """
    m, n = len(mat), len(mat[0])

    # We'll use a max-heap to track the k weakest rows
    # Python's heapq is min-heap by default, so we store negative values for max-heap behavior
    # Each element in heap is (-soldier_count, -row_index)
    # We negate both values because:
    # 1. We want max-heap behavior (remove strongest when heap exceeds size k)
    # 2. When soldier_count is equal, we want to remove the row with larger index
    heap = []

    for i in range(m):
        # Count soldiers in row i using binary search
        # Since row is sorted [1,1,...,1,0,0,...,0], find first 0
        left, right = 0, n

        while left < right:
            mid = (left + right) // 2
            if mat[i][mid] == 1:
                # Soldier found, search right half for first 0
                left = mid + 1
            else:
                # Civilian found, search left half for first 0
                right = mid

        # After binary search, 'left' points to the first 0 (or n if all are soldiers)
        soldier_count = left

        # Add to heap: store as (-soldier_count, -i) for max-heap behavior
        heapq.heappush(heap, (-soldier_count, -i))

        # If heap exceeds size k, remove the strongest row (which is at root in max-heap)
        if len(heap) > k:
            heapq.heappop(heap)

    # Extract results from heap
    # The heap contains the k weakest rows, but in max-heap order (strongest at root)
    # We need to extract and reverse to get weakest first
    result = []
    while heap:
        # Pop from heap and extract row index (negated, so we negate again)
        soldier_count, row_idx = heapq.heappop(heap)
        result.append(-row_idx)

    # Reverse because we popped from max-heap (strongest first)
    # We want weakest rows in ascending order
    return result[::-1]
```

```javascript
// Time: O(m * log n + m * log k) - binary search for each row + heap operations
// Space: O(k) - for the heap storing k elements
function kWeakestRows(mat, k) {
  /**
   * Find the k weakest rows in a binary matrix.
   *
   * @param {number[][]} mat - binary matrix with 1's (soldiers) on left, 0's on right
   * @param {number} k - number of weakest rows to return
   * @return {number[]} - indices of the k weakest rows in ascending order of weakness
   */
  const m = mat.length;
  const n = mat[0].length;

  // Create a max-heap using a custom comparator
  // We'll store [soldierCount, rowIndex] but sort by soldierCount DESC, then rowIndex DESC
  // This way, the "strongest" row is at the end and easy to remove
  const heap = [];

  // Helper function to add to heap and maintain max-heap property
  const pushToHeap = (soldierCount, rowIndex) => {
    heap.push([soldierCount, rowIndex]);
    // Bubble up to maintain heap property
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      // Compare: soldierCount DESC, then rowIndex DESC
      if (
        heap[parent][0] < heap[i][0] ||
        (heap[parent][0] === heap[i][0] && heap[parent][1] < heap[i][1])
      ) {
        // Swap if parent is weaker (has fewer soldiers or same soldiers but smaller index)
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
      } else {
        break;
      }
    }
  };

  // Helper function to remove max element (strongest row)
  const popFromHeap = () => {
    if (heap.length === 0) return null;

    const max = heap[0];
    const last = heap.pop();

    if (heap.length > 0) {
      heap[0] = last;
      // Heapify down
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let largest = i;

        // Find largest among i, left, and right
        if (
          left < heap.length &&
          (heap[left][0] > heap[largest][0] ||
            (heap[left][0] === heap[largest][0] && heap[left][1] > heap[largest][1]))
        ) {
          largest = left;
        }

        if (
          right < heap.length &&
          (heap[right][0] > heap[largest][0] ||
            (heap[right][0] === heap[largest][0] && heap[right][1] > heap[largest][1]))
        ) {
          largest = right;
        }

        if (largest !== i) {
          [heap[i], heap[largest]] = [heap[largest], heap[i]];
          i = largest;
        } else {
          break;
        }
      }
    }

    return max;
  };

  // Process each row
  for (let i = 0; i < m; i++) {
    // Count soldiers using binary search
    let left = 0,
      right = n;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (mat[i][mid] === 1) {
        // Soldier found, search right for first 0
        left = mid + 1;
      } else {
        // Civilian found, search left for first 0
        right = mid;
      }
    }

    // 'left' is the number of soldiers (index of first 0)
    const soldierCount = left;

    // Add to heap
    pushToHeap(soldierCount, i);

    // If heap exceeds size k, remove the strongest row
    if (heap.length > k) {
      popFromHeap();
    }
  }

  // Extract results - heap has strongest first, we need weakest first
  const result = [];
  while (heap.length > 0) {
    const [soldierCount, rowIndex] = popFromHeap();
    result.push(rowIndex);
  }

  // Reverse to get weakest rows first
  return result.reverse();
}
```

```java
// Time: O(m * log n + m * log k) - binary search for each row + heap operations
// Space: O(k) - for the heap storing k elements
class Solution {
    public int[] kWeakestRows(int[][] mat, int k) {
        int m = mat.length;
        int n = mat[0].length;

        // Create a max-heap using a custom comparator
        // We want to keep the k weakest rows, so we use max-heap to easily remove strongest
        // Comparator: compare by soldier count DESC, then row index DESC
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            (a, b) -> {
                if (a[0] != b[0]) {
                    return b[0] - a[0]; // Soldier count DESC
                } else {
                    return b[1] - a[1]; // Row index DESC if soldier count equal
                }
            }
        );

        for (int i = 0; i < m; i++) {
            // Count soldiers using binary search
            int left = 0, right = n;

            while (left < right) {
                int mid = left + (right - left) / 2;
                if (mat[i][mid] == 1) {
                    // Soldier found, search right for first 0
                    left = mid + 1;
                } else {
                    // Civilian found, search left for first 0
                    right = mid;
                }
            }

            // 'left' is the number of soldiers (index of first 0)
            int soldierCount = left;

            // Add to heap: [soldierCount, rowIndex]
            maxHeap.offer(new int[]{soldierCount, i});

            // If heap exceeds size k, remove the strongest row
            if (maxHeap.size() > k) {
                maxHeap.poll();
            }
        }

        // Extract results from heap
        // Heap has strongest first (max-heap), we need weakest first
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = maxHeap.poll()[1];
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × log n + m × log k)**

- **Binary search for each row**: We perform binary search on each of the m rows to count soldiers. Each binary search takes O(log n) time, so total O(m × log n).
- **Heap operations**: For each row, we perform heap push (O(log k)) and potentially heap pop (O(log k)). With m rows, this is O(m × log k).

**Space Complexity: O(k)**

- We maintain a heap of at most k elements to track the k weakest rows.
- The result array uses O(k) space.
- Note: We don't count the input matrix in space complexity as it's given.

Why is this optimal? The binary search leverages the sorted nature of each row, and the heap allows us to find the k weakest without fully sorting all m rows. If k is much smaller than m (which is typical), O(m log k) is much better than O(m log m).

## Common Mistakes

1. **Not using binary search for soldier counting**: Many candidates scan each row linearly to count soldiers, resulting in O(m × n) time instead of O(m × log n). Always look for sorted data - it screams "binary search opportunity!"

2. **Incorrect binary search implementation**: The tricky part is finding the first 0. Common errors include:
   - Using `while (left <= right)` instead of `while (left < right)`
   - Not handling the case where all elements are 1's (should return n)
   - Off-by-one errors in the mid calculation or boundary updates

3. **Wrong heap ordering for tie-breaking**: When soldier counts are equal, we need to break ties by row index. Candidates often forget this or implement it incorrectly in the comparator.

4. **Returning strongest instead of weakest**: When using a max-heap to track k weakest, the heap stores strongest at the root. Forgetting to reverse the result leads to returning the k strongest rows instead of weakest.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Binary search on sorted arrays**: Whenever you see "sorted" or "monotonic" data, think binary search. Related problems:
   - **First Bad Version**: Find the first bad version in a sorted sequence
   - **Search Insert Position**: Find where to insert a target in a sorted array
   - **Find First and Last Position of Element in Sorted Array**: Extend binary search to find boundaries

2. **Top K elements with heap**: When you need the K smallest/largest elements from a collection, a heap is often the right tool. Related problems:
   - **Kth Largest Element in an Array**: Find the kth largest element
   - **Top K Frequent Elements**: Find elements with highest frequency
   - **Merge K Sorted Lists**: Use heap to merge multiple sorted lists efficiently

## Key Takeaways

1. **Look for sorted data patterns**: The phrase "all 1's appear to the left of all 0's" is a strong hint for binary search. Always ask: "Is the data sorted or partially ordered?"

2. **Use the right data structure for top K problems**: When asked for "k weakest/smallest/largest," consider:
   - Min-heap for k largest (keep popping smallest)
   - Max-heap for k smallest (keep popping largest)
   - Quickselect for kth element without sorting all

3. **Pay attention to tie-breaking rules**: Interview problems often have secondary sorting criteria. Always read the problem statement carefully and implement comparators correctly.

[Practice this problem on CodeJeet](/problem/the-k-weakest-rows-in-a-matrix)
