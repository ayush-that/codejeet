---
title: "How to Solve Smallest Range Covering Elements from K Lists — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Smallest Range Covering Elements from K Lists. Hard difficulty, 70.1% acceptance rate. Topics: Array, Hash Table, Greedy, Sliding Window, Sorting."
date: "2028-06-02"
category: "dsa-patterns"
tags: ["smallest-range-covering-elements-from-k-lists", "array", "hash-table", "greedy", "hard"]
---

# How to Solve Smallest Range Covering Elements from K Lists

You're given `k` sorted lists of integers and need to find the smallest range that contains at least one number from each list. What makes this problem tricky is that you need to consider elements from multiple sorted sequences simultaneously while tracking the minimum possible range. It's essentially a multi-pointer problem where you need to intelligently advance pointers to shrink the range while maintaining coverage of all lists.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider these three sorted lists:

- List 1: [4, 10, 15, 24, 26]
- List 2: [0, 9, 12, 20]
- List 3: [5, 18, 22, 30]

We need to find the smallest range [a, b] where a ≤ b, and there exists at least one element from each list within [a, b].

**Step 1:** Start by taking the first element from each list: 4, 0, 5

- Current range: [min=0, max=5] → range size = 5
- We have one element from each list, so this is a valid range

**Step 2:** To potentially shrink the range, we should move the pointer pointing to the smallest element (0 from list 2)

- Advance list 2's pointer to the next element: 9
- New elements: 4, 9, 5
- New range: [min=4, max=9] → range size = 5 (same size, but min is larger)

**Step 3:** Now the smallest element is 4 (from list 1)

- Advance list 1's pointer: 10
- New elements: 10, 9, 5
- New range: [min=5, max=10] → range size = 5

**Step 4:** Smallest is 5 (from list 3)

- Advance list 3's pointer: 18
- New elements: 10, 9, 18
- New range: [min=9, max=18] → range size = 9 (worse!)

**Step 5:** Smallest is 9 (from list 2)

- Advance list 2's pointer: 12
- New elements: 10, 12, 18
- New range: [min=10, max=18] → range size = 8

**Step 6:** Smallest is 10 (from list 1)

- Advance list 1's pointer: 15
- New elements: 15, 12, 18
- New range: [min=12, max=18] → range size = 6

**Step 7:** Smallest is 12 (from list 2)

- Advance list 2's pointer: 20
- New elements: 15, 20, 18
- New range: [min=15, max=20] → range size = 5

**Step 8:** Smallest is 15 (from list 1)

- Advance list 1's pointer: 24
- New elements: 24, 20, 18
- New range: [min=18, max=24] → range size = 6 (worse)

**Step 9:** Smallest is 18 (from list 3)

- Advance list 3's pointer: 22
- New elements: 24, 20, 22
- New range: [min=20, max=24] → range size = 4 (best so far!)

**Step 10:** Smallest is 20 (from list 2)

- Advance list 2's pointer: list 2 is exhausted, so we stop

The smallest range we found was [20, 24] with size 4. This is indeed the optimal answer.

The key insight: we always advance the pointer to the smallest element because that gives us the best chance to shrink the range while maintaining coverage of all lists.

## Brute Force Approach

A naive approach would be to consider all possible combinations of elements from the k lists. For each combination (taking one element from each list), we could calculate the range [min, max] and track the smallest valid range.

The brute force algorithm would:

1. Generate all possible combinations of indices (i₁, i₂, ..., iₖ) where iⱼ is an index into list j
2. For each combination, find the minimum and maximum values
3. Track the smallest range according to the problem's definition

However, this approach is extremely inefficient. If each list has n elements, there are nᵏ possible combinations. For k=3 and n=100, that's 1,000,000 combinations. For k=10 and n=100, that's 10²⁰ combinations - completely infeasible.

Even if we try to optimize by noticing the lists are sorted, a naive approach would still be O(nᵏ) time complexity, which is unacceptable for the constraints typically given (k up to 3500, each list up to 50 elements).

## Optimized Approach

The optimal solution uses a **min-heap** and a **sliding window** approach across the k lists. Here's the step-by-step reasoning:

1. **Initialization**: Start by taking the first element from each list. This gives us our initial "window" covering all lists.
2. **Tracking**: We need to track both the current maximum value (easy to track as we add new elements) and the current minimum value (which we can get efficiently from a min-heap).
3. **Heap Structure**: We maintain a min-heap containing tuples of (value, list_index, element_index). The heap always gives us the smallest element in our current window.
4. **Sliding Window Logic**: At each step:
   - Get the smallest element from the heap (this is our current window's left boundary)
   - Calculate the current range [smallest, current_max]
   - If this range is smaller than our best range so far, update our answer
   - Advance the pointer in the list that contained the smallest element
   - If that list is exhausted, we can stop (since we need at least one element from each list)
   - Add the new element to the heap and update current_max if needed
5. **Why This Works**: By always removing the smallest element and adding the next element from the same list, we're effectively sliding our window to the right. This ensures we explore all possible ranges efficiently in O(nk log k) time.

The key insight is that we don't need to consider all combinations - we only need to consider ranges where the left boundary is the minimum element across all current pointers, and we systematically advance the smallest element to try to shrink the range.

## Optimal Solution

<div class="code-group">

```python
# Time: O(nk log k) where n is average list length, k is number of lists
# Space: O(k) for the heap and pointers
import heapq

def smallestRange(nums):
    """
    Find the smallest range covering at least one element from each list.

    Args:
        nums: List of k sorted lists of integers

    Returns:
        List of two integers [start, end] representing the smallest range
    """
    # Initialize min-heap with first element from each list
    # Each heap element is (value, list_index, element_index)
    heap = []
    current_max = float('-inf')

    # Add first element from each list to heap and track maximum
    for i in range(len(nums)):
        if nums[i]:  # Handle empty lists
            heapq.heappush(heap, (nums[i][0], i, 0))
            current_max = max(current_max, nums[i][0])

    # Initialize answer with first range
    # Using large range initially that will be replaced
    range_start, range_end = -10**5, 10**5

    # Process until one list is exhausted
    while heap:
        # Get smallest element from heap
        current_min, list_idx, elem_idx = heapq.heappop(heap)

        # Check if current range [current_min, current_max] is better
        if current_max - current_min < range_end - range_start:
            range_start, range_end = current_min, current_max
        elif current_max - current_min == range_end - range_start and current_min < range_start:
            # Tie-breaker: smaller start wins
            range_start, range_end = current_min, current_max

        # Move to next element in the list that had the smallest element
        next_elem_idx = elem_idx + 1

        # If we haven't exhausted this list
        if next_elem_idx < len(nums[list_idx]):
            next_val = nums[list_idx][next_elem_idx]
            # Add next element to heap
            heapq.heappush(heap, (next_val, list_idx, next_elem_idx))
            # Update current_max if needed
            current_max = max(current_max, next_val)
        else:
            # One list exhausted, we can't cover all lists anymore
            break

    return [range_start, range_end]
```

```javascript
// Time: O(nk log k) where n is average list length, k is number of lists
// Space: O(k) for the heap and pointers

/**
 * Find the smallest range covering at least one element from each list.
 * @param {number[][]} nums - Array of k sorted arrays of integers
 * @return {number[]} - Array of two numbers [start, end] representing the smallest range
 */
function smallestRange(nums) {
  // Min-heap implementation for JavaScript
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    push(val) {
      this.heap.push(val);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      const min = this.heap[0];
      const last = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.sinkDown(0);
      }
      return min;
    }

    peek() {
      return this.heap[0];
    }

    size() {
      return this.heap.length;
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

  // Initialize min-heap with first element from each list
  // Each heap element is [value, listIndex, elementIndex]
  const heap = new MinHeap();
  let currentMax = -Infinity;

  // Add first element from each list to heap and track maximum
  for (let i = 0; i < nums.length; i++) {
    if (nums[i].length > 0) {
      // Handle empty lists
      heap.push([nums[i][0], i, 0]);
      currentMax = Math.max(currentMax, nums[i][0]);
    }
  }

  // Initialize answer with large range that will be replaced
  let rangeStart = -100000,
    rangeEnd = 100000;

  // Process until one list is exhausted
  while (heap.size() > 0) {
    // Get smallest element from heap
    const [currentMin, listIdx, elemIdx] = heap.pop();

    // Check if current range [currentMin, currentMax] is better
    if (currentMax - currentMin < rangeEnd - rangeStart) {
      rangeStart = currentMin;
      rangeEnd = currentMax;
    } else if (currentMax - currentMin === rangeEnd - rangeStart && currentMin < rangeStart) {
      // Tie-breaker: smaller start wins
      rangeStart = currentMin;
      rangeEnd = currentMax;
    }

    // Move to next element in the list that had the smallest element
    const nextElemIdx = elemIdx + 1;

    // If we haven't exhausted this list
    if (nextElemIdx < nums[listIdx].length) {
      const nextVal = nums[listIdx][nextElemIdx];
      // Add next element to heap
      heap.push([nextVal, listIdx, nextElemIdx]);
      // Update currentMax if needed
      currentMax = Math.max(currentMax, nextVal);
    } else {
      // One list exhausted, we can't cover all lists anymore
      break;
    }
  }

  return [rangeStart, rangeEnd];
}
```

```java
// Time: O(nk log k) where n is average list length, k is number of lists
// Space: O(k) for the heap and pointers
import java.util.*;

class Solution {
    /**
     * Find the smallest range covering at least one element from each list.
     * @param nums List of k sorted lists of integers
     * @return Array of two integers [start, end] representing the smallest range
     */
    public int[] smallestRange(List<List<Integer>> nums) {
        // Min-heap to store (value, list_index, element_index)
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(
            (a, b) -> a[0] - b[0]  // Compare by value
        );

        int currentMax = Integer.MIN_VALUE;

        // Add first element from each list to heap and track maximum
        for (int i = 0; i < nums.size(); i++) {
            if (!nums.get(i).isEmpty()) {  // Handle empty lists
                int firstVal = nums.get(i).get(0);
                minHeap.offer(new int[]{firstVal, i, 0});
                currentMax = Math.max(currentMax, firstVal);
            }
        }

        // Initialize answer with large range that will be replaced
        int rangeStart = -100000, rangeEnd = 100000;

        // Process until one list is exhausted
        while (minHeap.size() == nums.size()) {  // Need element from each list
            // Get smallest element from heap
            int[] current = minHeap.poll();
            int currentMin = current[0];
            int listIdx = current[1];
            int elemIdx = current[2];

            // Check if current range [currentMin, currentMax] is better
            if (currentMax - currentMin < rangeEnd - rangeStart) {
                rangeStart = currentMin;
                rangeEnd = currentMax;
            } else if (currentMax - currentMin == rangeEnd - rangeStart && currentMin < rangeStart) {
                // Tie-breaker: smaller start wins
                rangeStart = currentMin;
                rangeEnd = currentMax;
            }

            // Move to next element in the list that had the smallest element
            int nextElemIdx = elemIdx + 1;

            // If we haven't exhausted this list
            if (nextElemIdx < nums.get(listIdx).size()) {
                int nextVal = nums.get(listIdx).get(nextElemIdx);
                // Add next element to heap
                minHeap.offer(new int[]{nextVal, listIdx, nextElemIdx});
                // Update currentMax if needed
                currentMax = Math.max(currentMax, nextVal);
            } else {
                // One list exhausted, we can't cover all lists anymore
                break;
            }
        }

        return new int[]{rangeStart, rangeEnd};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(nk log k)**

- We process at most nk elements total (where n is average list length, k is number of lists)
- Each element is pushed and popped from the heap once: O(log k) per operation
- Total: O(nk log k)

**Space Complexity: O(k)**

- The heap stores at most k elements (one from each list)
- We also store pointers and the current range, but these use constant extra space

The factor of log k comes from heap operations. The nk factor comes from the fact that in the worst case, we might process every element from every list before finding the optimal range or exhausting a list.

## Common Mistakes

1. **Forgetting to handle empty lists**: If a list is empty, there's no valid range since we need at least one element from each list. Always check for empty lists before adding elements to the heap.

2. **Not tracking list indices properly**: When you pop from the heap, you need to know which list the element came from so you can advance the correct pointer. Storing (value, list_index, element_index) in the heap is crucial.

3. **Incorrect tie-breaking**: The problem states that if two ranges have the same size, the one with the smaller start value wins. Candidates often forget this tie-breaking condition.

4. **Stopping condition errors**: Some candidates stop when the heap is empty, but we should stop when ANY list is exhausted (since we need at least one element from each list). In the Java solution, we check `while (minHeap.size() == nums.size())` to ensure we always have coverage of all lists.

5. **Not updating current_max correctly**: When we add a new element to the heap, we must check if it's larger than the current maximum and update if needed. The current maximum can only increase or stay the same, never decrease.

## When You'll See This Pattern

This "k-way merge with heap" pattern appears in several problems where you need to process multiple sorted sequences simultaneously:

1. **Merge K Sorted Lists (LeetCode 23)**: Similar heap-based approach to merge k sorted lists into one sorted list.

2. **Find K Pairs with Smallest Sums (LeetCode 373)**: Uses a min-heap to track the smallest sums from pairs of elements from two arrays.

3. **Kth Smallest Element in a Sorted Matrix (LeetCode 378)**: The matrix rows are sorted, so you can use a similar approach with a heap to find the kth smallest element.

The core pattern is: when you have multiple sorted sequences and need to find something that involves the "current smallest" or "current largest" across all sequences, a min-heap or max-heap is often the right tool.

## Key Takeaways

1. **Heap + sliding window for multiple sequences**: When dealing with k sorted lists and need to find ranges or merge them, consider using a heap to track the current smallest element across all lists.

2. **Always advance the smallest element**: To explore the solution space efficiently, always remove the smallest element and add the next element from the same list. This systematically explores all possible ranges.

3. **Track both min and max**: In range problems, you need to track both boundaries. The heap gives you the min efficiently, and you can track the max separately as you add new elements.

Remember: the heap doesn't store all elements at once - it only stores the "current" element from each list, making it memory efficient.

Related problems: [Minimum Window Substring](/problem/minimum-window-substring)
