---
title: "How to Solve Distant Barcodes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Distant Barcodes. Medium difficulty, 48.6% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue)."
date: "2028-05-23"
category: "dsa-patterns"
tags: ["distant-barcodes", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Distant Barcodes

You're given an array of barcodes where you need to rearrange them so no two identical barcodes are adjacent. The challenge is that you must find a valid arrangement even when some barcodes appear frequently. This problem is interesting because it requires careful placement of frequent elements while guaranteeing a solution exists.

## Visual Walkthrough

Let's trace through example `[1,1,1,2,2,3]` step by step:

1. **Count frequencies**: `{1:3, 2:2, 3:1}`
2. **Sort by frequency**: Most frequent is `1` (3 times), then `2` (2 times), then `3` (1 time)
3. **Fill even positions first**: Place the most frequent barcode in all even indices
   - Index 0: `1`
   - Index 2: `1`
   - Index 4: `1`
4. **Fill odd positions with remaining**: Place remaining barcodes in odd indices
   - Index 1: `2`
   - Index 3: `2`
   - Index 5: `3`

Result: `[1,2,1,2,1,3]` — no adjacent duplicates!

Why does this work? By placing the most frequent element in every other position first, we ensure it gets maximum spacing. Then we fill the gaps with remaining elements. This greedy approach guarantees no conflicts.

## Brute Force Approach

A naive approach would generate all permutations of the barcodes and check each one for adjacent duplicates. For each permutation, we'd scan through it to verify no two consecutive elements are equal.

```python
from itertools import permutations

def rearrangeBarcodes(barcodes):
    for perm in permutations(barcodes):
        valid = True
        for i in range(1, len(perm)):
            if perm[i] == perm[i-1]:
                valid = False
                break
        if valid:
            return list(perm)
```

**Why this fails**: With n barcodes, there are n! permutations. For n=10, that's 3.6 million permutations to check. For n=20, it's 2.4×10¹⁸ permutations — completely infeasible. Even with pruning, this approach is exponential and times out for typical constraints.

## Optimized Approach

The key insight is that this is essentially a **rearrangement problem with spacing constraints**. Think of it like scheduling tasks with cooldown periods, but here the cooldown is just 1 position.

**Core strategy**:

1. Count frequencies of each barcode
2. Always place the most frequent remaining barcode that isn't the same as the previous one placed
3. Use a max-heap (priority queue) to efficiently get the most frequent barcode at each step

**Why a heap works**: After placing a barcode, we need to update its count and potentially re-prioritize. A max-heap lets us:

- Always access the most frequent barcode in O(log n) time
- Decrement its count and push it back if it still has occurrences
- Handle the case where multiple barcodes have the same frequency

**Alternative approach**: Sort by frequency and fill even then odd indices. This works because:

- The most frequent element can appear at most ceil(n/2) times
- By placing it in every other position, we guarantee spacing
- Remaining elements fill the gaps without conflict

## Optimal Solution

Here's the heap-based solution that works for any valid input:

<div class="code-group">

```python
# Time: O(n log k) where k is number of unique barcodes | Space: O(k)
def rearrangeBarcodes(barcodes):
    from collections import Counter
    import heapq

    # Step 1: Count frequency of each barcode
    count = Counter(barcodes)

    # Step 2: Create max-heap (Python has min-heap, so use negative counts)
    # Store as (-frequency, barcode) so most frequent is at top
    max_heap = []
    for barcode, freq in count.items():
        heapq.heappush(max_heap, (-freq, barcode))

    # Step 3: Build result array
    result = [0] * len(barcodes)
    index = 0

    while max_heap:
        # Get most frequent barcode (excluding previous one if needed)
        freq1, barcode1 = heapq.heappop(max_heap)

        # If this barcode is same as previous, get the next most frequent
        if result[index-1] == barcode1 and max_heap:
            freq2, barcode2 = heapq.heappop(max_heap)
            result[index] = barcode2
            index += 1

            # Push back second barcode if it still has occurrences
            if freq2 + 1 < 0:  # freq2 is negative, so +1 means decrement
                heapq.heappush(max_heap, (freq2 + 1, barcode2))

            # Push back first barcode (unchanged since we didn't use it)
            heapq.heappush(max_heap, (freq1, barcode1))
        else:
            # Use the most frequent barcode
            result[index] = barcode1
            index += 1

            # Push back if it still has occurrences
            if freq1 + 1 < 0:  # freq1 is negative, so +1 means decrement
                heapq.heappush(max_heap, (freq1 + 1, barcode1))

    return result
```

```javascript
// Time: O(n log k) where k is number of unique barcodes | Space: O(k)
function rearrangeBarcodes(barcodes) {
  // Step 1: Count frequency of each barcode
  const count = new Map();
  for (const barcode of barcodes) {
    count.set(barcode, (count.get(barcode) || 0) + 1);
  }

  // Step 2: Create max-heap using array and custom comparator
  // Store as [frequency, barcode] pairs
  const maxHeap = new MaxHeap();
  for (const [barcode, freq] of count.entries()) {
    maxHeap.push([freq, barcode]);
  }

  // Step 3: Build result array
  const result = new Array(barcodes.length);
  let index = 0;

  while (!maxHeap.isEmpty()) {
    // Get most frequent barcode
    let [freq1, barcode1] = maxHeap.pop();

    // If this barcode is same as previous, get the next most frequent
    if (index > 0 && result[index - 1] === barcode1 && !maxHeap.isEmpty()) {
      const [freq2, barcode2] = maxHeap.pop();
      result[index] = barcode2;
      index++;

      // Push back second barcode if it still has occurrences
      if (freq2 > 1) {
        maxHeap.push([freq2 - 1, barcode2]);
      }

      // Push back first barcode (unchanged since we didn't use it)
      maxHeap.push([freq1, barcode1]);
    } else {
      // Use the most frequent barcode
      result[index] = barcode1;
      index++;

      // Push back if it still has occurrences
      if (freq1 > 1) {
        maxHeap.push([freq1 - 1, barcode1]);
      }
    }
  }

  return result;
}

// MaxHeap implementation for JavaScript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const max = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return max;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element[0] <= parent[0]) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
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
        if (leftChild[0] > element[0]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild[0] > element[0]) ||
          (swap !== null && rightChild[0] > leftChild[0])
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = element;
  }
}
```

```java
// Time: O(n log k) where k is number of unique barcodes | Space: O(k)
import java.util.*;

class Solution {
    public int[] rearrangeBarcodes(int[] barcodes) {
        // Step 1: Count frequency of each barcode
        Map<Integer, Integer> count = new HashMap<>();
        for (int barcode : barcodes) {
            count.put(barcode, count.getOrDefault(barcode, 0) + 1);
        }

        // Step 2: Create max-heap using priority queue with custom comparator
        // Store as [frequency, barcode] pairs, sorted by frequency descending
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            (a, b) -> b[0] - a[0]  // Compare by frequency (first element)
        );

        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            maxHeap.offer(new int[]{entry.getValue(), entry.getKey()});
        }

        // Step 3: Build result array
        int[] result = new int[barcodes.length];
        int index = 0;

        while (!maxHeap.isEmpty()) {
            // Get most frequent barcode
            int[] first = maxHeap.poll();
            int freq1 = first[0];
            int barcode1 = first[1];

            // If this barcode is same as previous, get the next most frequent
            if (index > 0 && result[index - 1] == barcode1 && !maxHeap.isEmpty()) {
                int[] second = maxHeap.poll();
                int freq2 = second[0];
                int barcode2 = second[1];

                result[index] = barcode2;
                index++;

                // Push back second barcode if it still has occurrences
                if (freq2 > 1) {
                    maxHeap.offer(new int[]{freq2 - 1, barcode2});
                }

                // Push back first barcode (unchanged since we didn't use it)
                maxHeap.offer(new int[]{freq1, barcode1});
            } else {
                // Use the most frequent barcode
                result[index] = barcode1;
                index++;

                // Push back if it still has occurrences
                if (freq1 > 1) {
                    maxHeap.offer(new int[]{freq1 - 1, barcode1});
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log k) where n is the number of barcodes and k is the number of unique barcodes.

- Counting frequencies takes O(n)
- Building the heap takes O(k log k)
- Each of the n placements requires heap operations (pop/push) taking O(log k)
- Total: O(n + k log k + n log k) = O(n log k) since n ≥ k

**Space Complexity**: O(k) for the frequency map and heap, plus O(n) for the result array.

- Frequency map: O(k)
- Max-heap: O(k)
- Result array: O(n)
- Total: O(n + k) = O(n) since n ≥ k

## Common Mistakes

1. **Not handling the "previous barcode" check correctly**: When the most frequent barcode is the same as the previous one placed, you must take the second most frequent instead. Forgetting this check leads to adjacent duplicates.

2. **Using a stack instead of a heap**: Some candidates try to use a stack, but you need to always access the most frequent element, not the most recent. A max-heap (priority queue) is essential.

3. **Incorrect frequency updates**: When you place a barcode, you must decrement its count and push it back to the heap if count > 0. Forgetting to push it back means losing track of remaining occurrences.

4. **Assuming input is always valid**: The problem guarantees a solution exists, but your algorithm should still handle edge cases like single-element arrays or arrays where one element appears more than ceil(n/2) times (which would be impossible).

## When You'll See This Pattern

This "greedy with heap" pattern appears in several scheduling and rearrangement problems:

1. **Task Scheduler (LeetCode 621)**: Schedule tasks with cooldown periods. Very similar to this problem but with variable cooldown k instead of just 1.

2. **Rearrange String k Distance Apart (LeetCode 358)**: Rearrange string so same characters are at least k apart. This is a generalization of our problem.

3. **Reorganize String (LeetCode 767)**: Exact same problem but with characters instead of barcodes.

The core pattern: When you need to arrange items with spacing constraints, count frequencies, use a heap to always pick the most frequent valid item, and update counts as you go.

## Key Takeaways

1. **Greedy with heap is powerful for rearrangement problems**: When you need to maximize spacing between identical items, always placing the most frequent valid item works.

2. **Frequency counting is the first step**: Most arrangement problems start with understanding the distribution of elements.

3. **The heap maintains priority dynamically**: As counts change, the heap automatically reorders elements so you always have access to the most frequent one.

[Practice this problem on CodeJeet](/problem/distant-barcodes)
