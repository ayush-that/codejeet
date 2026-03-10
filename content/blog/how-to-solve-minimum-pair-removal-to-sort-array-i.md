---
title: "How to Solve Minimum Pair Removal to Sort Array I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Pair Removal to Sort Array I. Easy difficulty, 65.3% acceptance rate. Topics: Array, Hash Table, Linked List, Heap (Priority Queue), Simulation."
date: "2026-10-10"
category: "dsa-patterns"
tags: ["minimum-pair-removal-to-sort-array-i", "array", "hash-table", "linked-list", "easy"]
---

# How to Solve Minimum Pair Removal to Sort Array I

This problem asks us to repeatedly find and merge the adjacent pair with the smallest sum in an array, returning the total number of operations performed. What makes this interesting is that each merge changes the array structure, affecting which pairs are available for future operations. The challenge lies in efficiently finding the minimum sum pair after each merge without repeatedly scanning the entire array.

## Visual Walkthrough

Let's trace through `nums = [3, 2, 1, 4]` step by step:

**Step 1:** Find the minimum sum adjacent pair.

- Pairs: (3,2)=5, (2,1)=3, (1,4)=5
- Minimum sum is 3 from pair (2,1) at index 1
- Merge them: Replace [2,1] with their sum 3
- New array: [3, 3, 4]
- Operations: 1

**Step 2:** Find the minimum sum adjacent pair.

- Pairs: (3,3)=6, (3,4)=7
- Minimum sum is 6 from pair (3,3) at index 0
- Merge them: Replace [3,3] with their sum 6
- New array: [6, 4]
- Operations: 2

**Step 3:** Find the minimum sum adjacent pair.

- Pairs: (6,4)=10
- Only one pair, so merge it
- New array: [10]
- Operations: 3

The array is now sorted in non-decreasing order: [10]. We needed **3 operations**.

## Brute Force Approach

A naive approach would be to simulate the process exactly as described:

1. Scan the entire array to find the minimum sum adjacent pair
2. Merge that pair by replacing the two elements with their sum
3. Repeat until the array is sorted

The problem with this approach is efficiency. Each scan takes O(n) time, and we perform up to n-1 operations (since each operation reduces array length by 1). This gives us O(n²) time complexity, which is too slow for larger arrays (n up to 10⁵ in typical constraints).

Even worse, checking if the array is sorted after each operation adds another O(n) scan. While we could optimize the sorted check by tracking it during merges, the main bottleneck remains finding the minimum sum pair efficiently.

## Optimal Solution

The key insight is that we need a data structure that allows us to:

1. Quickly find the minimum sum adjacent pair
2. Efficiently update the array after a merge
3. Handle the "leftmost tiebreaker" rule

A min-heap (priority queue) is perfect for this. We'll store each adjacent pair along with its index and sum, and after each merge, we'll update the affected pairs in the heap.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minimumOperations(nums):
    """
    Returns the minimum number of operations to sort the array
    by repeatedly merging the smallest sum adjacent pair.
    """
    n = len(nums)
    if n <= 1:
        return 0

    import heapq

    # Create a min-heap to store (sum, left_index, right_index)
    heap = []

    # Initialize the heap with all adjacent pairs
    for i in range(n - 1):
        pair_sum = nums[i] + nums[i + 1]
        heapq.heappush(heap, (pair_sum, i, i + 1))

    # Track which indices are still active (not merged)
    # We'll use a doubly linked list structure with next and prev pointers
    next_idx = list(range(1, n)) + [-1]  # next index for each position
    prev_idx = [-1] + list(range(n - 1))  # previous index for each position

    # Track values at each index
    values = nums[:]

    operations = 0

    # Continue until array is sorted
    while heap:
        # Get the pair with minimum sum (and leftmost if ties)
        current_sum, left, right = heapq.heappop(heap)

        # Skip if this pair is no longer valid (either index was merged)
        if (next_idx[left] != right or prev_idx[right] != left or
            values[left] + values[right] != current_sum):
            continue

        # Perform the merge operation
        operations += 1

        # The new value is the sum of the pair
        new_value = current_sum

        # Update the linked list structure
        # Remove right node from the list
        next_of_right = next_idx[right]
        if next_of_right != -1:
            prev_idx[next_of_right] = left

        # Update left node to point to right's next
        next_idx[left] = next_of_right

        # Update the value at left index
        values[left] = new_value

        # Remove right node (mark as merged)
        next_idx[right] = -1
        prev_idx[right] = -1

        # Check if array is sorted
        is_sorted = True
        current = 0
        while current != -1 and next_idx[current] != -1:
            if values[current] > values[next_idx[current]]:
                is_sorted = False
                break
            current = next_idx[current]

        if is_sorted:
            break

        # Add new pairs to heap involving the merged element
        # Pair with previous element (if exists)
        if prev_idx[left] != -1:
            prev = prev_idx[left]
            new_sum = values[prev] + values[left]
            heapq.heappush(heap, (new_sum, prev, left))

        # Pair with next element (if exists)
        if next_idx[left] != -1:
            nxt = next_idx[left]
            new_sum = values[left] + values[nxt]
            heapq.heappush(heap, (new_sum, left, nxt))

    return operations
```

```javascript
// Time: O(n log n) | Space: O(n)
function minimumOperations(nums) {
  const n = nums.length;
  if (n <= 1) return 0;

  // Min-heap implementation for JavaScript
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    push(item) {
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      if (this.heap.length === 0) return null;
      const min = this.heap[0];
      const last = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.bubbleDown(0);
      }
      return min;
    }

    bubbleUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.compare(this.heap[index], this.heap[parent]) < 0) {
          [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
          index = parent;
        } else {
          break;
        }
      }
    }

    bubbleDown(index) {
      const last = this.heap.length - 1;
      while (true) {
        let smallest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (left <= last && this.compare(this.heap[left], this.heap[smallest]) < 0) {
          smallest = left;
        }
        if (right <= last && this.compare(this.heap[right], this.heap[smallest]) < 0) {
          smallest = right;
        }

        if (smallest !== index) {
          [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
          index = smallest;
        } else {
          break;
        }
      }
    }

    compare(a, b) {
      // Compare by sum, then by left index for tie-breaking
      if (a[0] !== b[0]) return a[0] - b[0];
      return a[1] - b[1];
    }

    isEmpty() {
      return this.heap.length === 0;
    }
  }

  const heap = new MinHeap();

  // Initialize heap with all adjacent pairs
  for (let i = 0; i < n - 1; i++) {
    const pairSum = nums[i] + nums[i + 1];
    heap.push([pairSum, i, i + 1]);
  }

  // Linked list structure to track active elements
  const nextIdx = Array.from({ length: n }, (_, i) => i + 1);
  nextIdx[n - 1] = -1;

  const prevIdx = Array.from({ length: n }, (_, i) => i - 1);
  prevIdx[0] = -1;

  const values = [...nums];

  let operations = 0;

  while (!heap.isEmpty()) {
    const [currentSum, left, right] = heap.pop();

    // Skip if pair is no longer valid
    if (
      nextIdx[left] !== right ||
      prevIdx[right] !== left ||
      values[left] + values[right] !== currentSum
    ) {
      continue;
    }

    // Perform merge operation
    operations++;
    const newValue = currentSum;

    // Update linked list: remove right node
    const nextOfRight = nextIdx[right];
    if (nextOfRight !== -1) {
      prevIdx[nextOfRight] = left;
    }

    // Update left node to point to right's next
    nextIdx[left] = nextOfRight;

    // Update value at left index
    values[left] = newValue;

    // Mark right node as merged
    nextIdx[right] = -1;
    prevIdx[right] = -1;

    // Check if array is sorted
    let isSorted = true;
    let current = 0;
    while (current !== -1 && nextIdx[current] !== -1) {
      if (values[current] > values[nextIdx[current]]) {
        isSorted = false;
        break;
      }
      current = nextIdx[current];
    }

    if (isSorted) break;

    // Add new pairs involving the merged element
    // Pair with previous element
    if (prevIdx[left] !== -1) {
      const prev = prevIdx[left];
      const newSum = values[prev] + values[left];
      heap.push([newSum, prev, left]);
    }

    // Pair with next element
    if (nextIdx[left] !== -1) {
      const nxt = nextIdx[left];
      const newSum = values[left] + values[nxt];
      heap.push([newSum, left, nxt]);
    }
  }

  return operations;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.PriorityQueue;

class Solution {
    public int minimumOperations(int[] nums) {
        int n = nums.length;
        if (n <= 1) return 0;

        // Min-heap storing [sum, leftIndex, rightIndex]
        // Custom comparator to handle tie-breaking (leftmost first)
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
            return Integer.compare(a[1], b[1]);
        });

        // Initialize heap with all adjacent pairs
        for (int i = 0; i < n - 1; i++) {
            int pairSum = nums[i] + nums[i + 1];
            heap.offer(new int[]{pairSum, i, i + 1});
        }

        // Linked list structure to track active elements
        int[] nextIdx = new int[n];
        int[] prevIdx = new int[n];
        int[] values = new int[n];

        for (int i = 0; i < n; i++) {
            nextIdx[i] = (i == n - 1) ? -1 : i + 1;
            prevIdx[i] = (i == 0) ? -1 : i - 1;
            values[i] = nums[i];
        }

        int operations = 0;

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int currentSum = current[0];
            int left = current[1];
            int right = current[2];

            // Skip if pair is no longer valid
            if (nextIdx[left] != right || prevIdx[right] != left ||
                values[left] + values[right] != currentSum) {
                continue;
            }

            // Perform merge operation
            operations++;
            int newValue = currentSum;

            // Update linked list: remove right node
            int nextOfRight = nextIdx[right];
            if (nextOfRight != -1) {
                prevIdx[nextOfRight] = left;
            }

            // Update left node to point to right's next
            nextIdx[left] = nextOfRight;

            // Update value at left index
            values[left] = newValue;

            // Mark right node as merged
            nextIdx[right] = -1;
            prevIdx[right] = -1;

            // Check if array is sorted
            boolean isSorted = true;
            int currentIdx = 0;
            while (currentIdx != -1 && nextIdx[currentIdx] != -1) {
                if (values[currentIdx] > values[nextIdx[currentIdx]]) {
                    isSorted = false;
                    break;
                }
                currentIdx = nextIdx[currentIdx];
            }

            if (isSorted) break;

            // Add new pairs involving the merged element
            // Pair with previous element
            if (prevIdx[left] != -1) {
                int prev = prevIdx[left];
                int newSum = values[prev] + values[left];
                heap.offer(new int[]{newSum, prev, left});
            }

            // Pair with next element
            if (nextIdx[left] != -1) {
                int nxt = nextIdx[left];
                int newSum = values[left] + values[nxt];
                heap.offer(new int[]{newSum, left, nxt});
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Initial heap construction takes O(n) time (using heapify would be O(n), but pushing n-1 elements is O(n log n) - both are acceptable)
- Each merge operation involves:
  - Extracting minimum from heap: O(log n)
  - Adding up to 2 new pairs to heap: O(log n) each
- We perform at most n-1 merges, so total is O(n log n)

**Space Complexity: O(n)**

- Heap stores up to O(n) pairs
- We maintain arrays of size n for next/prev pointers and values
- Total auxiliary space is O(n)

## Common Mistakes

1. **Forgetting to check if a heap entry is still valid**: After multiple merges, a pair in the heap might reference indices that are no longer adjacent or have different values. Always verify `nextIdx[left] == right` and `values[left] + values[right] == storedSum` before processing.

2. **Not handling the leftmost tiebreaker correctly**: When multiple pairs have the same minimum sum, we must choose the leftmost. In the heap comparator, we need to compare by sum first, then by left index.

3. **Inefficient sorted check**: Checking if the entire array is sorted after each merge by scanning all elements would add O(n²) time. Instead, we can check incrementally or track the sorted property during merges.

4. **Using arrays instead of linked lists for updates**: If you use a simple array and shift elements after each merge, you'll get O(n²) time. The linked list approach with next/prev pointers allows O(1) updates.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Priority Queue with Lazy Deletion**: Similar to problems like [Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) where you need to repeatedly extract minimums from multiple sources, but entries become invalid over time.

2. **Simulation with Efficient Updates**: Problems like [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) where you repeatedly combine the smallest elements, requiring efficient minimum extraction and re-insertion.

3. **Linked List for Dynamic Sequences**: When you need to frequently insert/delete elements while maintaining order, linked lists are more efficient than arrays. This pattern appears in [LRU Cache](https://leetcode.com/problems/lru-cache/) design.

## Key Takeaways

1. **When you need repeated minimum/maximum operations with updates, think priority queue**: Heaps allow O(log n) insertions and extractions, making them ideal for problems where you need to repeatedly find and update extreme values.

2. **Lazy deletion is a useful technique for invalid heap entries**: Instead of removing invalid entries from the heap (which is expensive), mark them as invalid and skip them when they pop from the heap.

3. **Linked lists beat arrays for frequent insertions/deletions**: When elements need to be frequently inserted or removed while maintaining order, linked list operations are O(1) vs O(n) for array shifts.

[Practice this problem on CodeJeet](/problem/minimum-pair-removal-to-sort-array-i)
