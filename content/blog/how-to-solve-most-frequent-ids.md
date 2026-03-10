---
title: "How to Solve Most Frequent IDs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Frequent IDs. Medium difficulty, 42.5% acceptance rate. Topics: Array, Hash Table, Heap (Priority Queue), Ordered Set."
date: "2029-08-16"
category: "dsa-patterns"
tags: ["most-frequent-ids", "array", "hash-table", "heap-(priority-queue)", "medium"]
---

# How to Solve Most Frequent IDs

This problem involves tracking the frequency of IDs in a dynamic collection that changes over time. You're given two arrays `nums` (IDs) and `freq` (frequency changes) of equal length `n`. For each index `i`, you need to add `freq[i]` occurrences of `nums[i]` to the collection (negative `freq[i]` means removal), then record the maximum frequency among all IDs after each operation. What makes this problem tricky is that you need to efficiently track frequencies that are constantly changing—both increasing and decreasing—while always being able to quickly retrieve the current maximum frequency.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums = [2, 5, 3, 2]
freq = [1, 1, -1, 1]
```

**Step-by-step:**

1. **Operation 0:** Add 1 occurrence of ID 2
   - Collection: {2: 1}
   - Max frequency = 1
   - Output: [1]

2. **Operation 1:** Add 1 occurrence of ID 5
   - Collection: {2: 1, 5: 1}
   - Max frequency = 1 (tie between 2 and 5)
   - Output: [1, 1]

3. **Operation 2:** Remove 1 occurrence of ID 3
   - Since ID 3 doesn't exist, we ignore this removal (problem states we can't have negative counts)
   - Collection: {2: 1, 5: 1}
   - Max frequency = 1
   - Output: [1, 1, 1]

4. **Operation 3:** Add 1 occurrence of ID 2
   - Collection: {2: 2, 5: 1}
   - Max frequency = 2 (ID 2 now has frequency 2)
   - Output: [1, 1, 1, 2]

**Final output:** [1, 1, 1, 2]

The challenge is that after each operation, we need to know the current maximum frequency. A naive approach would scan all frequencies each time, but that's too slow for large inputs.

## Brute Force Approach

The most straightforward solution would be:

1. Maintain a frequency map (dictionary) tracking each ID's count
2. For each operation `i`:
   - Update the count for `nums[i]` by adding `freq[i]` (ensuring it doesn't go below 0)
   - Scan through all frequency values to find the maximum
   - Add that maximum to the result

**Why this fails:** The brute force approach has O(n²) time complexity in the worst case. For each of n operations, we might need to scan up to n unique IDs to find the maximum. With n up to 10⁵, this would be far too slow (10¹⁰ operations).

Even if we try to maintain the maximum by simply tracking the largest value seen so far, we run into problems when that maximum decreases (due to removals) and we need to find the new maximum among all remaining frequencies.

## Optimized Approach

The key insight is that we need a data structure that can:

1. Quickly update frequencies (add or remove)
2. Quickly retrieve the current maximum frequency
3. Handle the fact that frequencies can go up and down

This is a perfect use case for a **max-heap (priority queue)** combined with a **hash map**:

- **Hash map**: Tracks current frequency of each ID for O(1) updates
- **Max-heap**: Stores (frequency, ID) pairs to quickly get the maximum frequency

However, there's a complication: when we update a frequency, the old (frequency, ID) pair might still be in the heap. We can't efficiently update it directly in most heap implementations. The solution is **lazy deletion**:

1. When we need the maximum, we peek at the top of the heap
2. If the frequency at the top doesn't match the current frequency in our hash map, it means this entry is stale (outdated)
3. We pop it and discard it, continuing until we find a valid top element

This approach gives us O(log n) for updates and O(1) amortized for getting the maximum (though we might need to clean up stale entries).

## Optimal Solution

Here's the complete solution using a max-heap with lazy deletion:

<div class="code-group">

```python
# Time: O(n log n) - each operation is O(log n) in the worst case
# Space: O(n) - storing up to n elements in heap and frequency map
from heapq import heappush, heappop
from collections import defaultdict

def mostFrequentIDs(nums, freq):
    n = len(nums)
    result = []
    frequency = defaultdict(int)  # Maps ID -> current frequency
    max_heap = []  # Max-heap (using negative values since Python has min-heap)

    for i in range(n):
        id_val = nums[i]
        change = freq[i]

        # Update the frequency for this ID
        frequency[id_val] += change

        # Ensure frequency doesn't go below 0
        if frequency[id_val] < 0:
            frequency[id_val] = 0

        # Push the updated (frequency, ID) pair to the heap
        # Use negative frequency for max-heap behavior
        heappush(max_heap, (-frequency[id_val], id_val))

        # Clean up stale entries from the top of the heap
        # A stale entry has frequency that doesn't match current frequency map
        while max_heap:
            top_freq, top_id = max_heap[0]
            # Compare absolute values since we store negative in heap
            if -top_freq != frequency[top_id]:
                heappop(max_heap)  # Remove stale entry
            else:
                break

        # After cleaning, the top of heap has current maximum frequency
        current_max = -max_heap[0][0] if max_heap else 0
        result.append(current_max)

    return result
```

```javascript
// Time: O(n log n) - each operation is O(log n) in the worst case
// Space: O(n) - storing up to n elements in heap and frequency map
function mostFrequentIDs(nums, freq) {
  const n = nums.length;
  const result = [];
  const frequency = new Map(); // Maps ID -> current frequency
  const maxHeap = new MaxHeap(); // Custom max-heap implementation

  for (let i = 0; i < n; i++) {
    const idVal = nums[i];
    const change = freq[i];

    // Update the frequency for this ID
    const currentFreq = frequency.get(idVal) || 0;
    const newFreq = Math.max(0, currentFreq + change); // Ensure non-negative
    frequency.set(idVal, newFreq);

    // Push the updated (frequency, ID) pair to the heap
    maxHeap.push(newFreq, idVal);

    // Clean up stale entries from the top of the heap
    // A stale entry has frequency that doesn't match current frequency map
    while (!maxHeap.isEmpty()) {
      const [topFreq, topId] = maxHeap.peek();
      if (topFreq !== frequency.get(topId)) {
        maxHeap.pop(); // Remove stale entry
      } else {
        break;
      }
    }

    // After cleaning, the top of heap has current maximum frequency
    const currentMax = maxHeap.isEmpty() ? 0 : maxHeap.peek()[0];
    result.push(currentMax);
  }

  return result;
}

// MaxHeap implementation for JavaScript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(freq, id) {
    this.heap.push([freq, id]);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return top;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent][0] >= this.heap[index][0]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let largest = index;

      if (left < length && this.heap[left][0] > this.heap[largest][0]) {
        largest = left;
      }
      if (right < length && this.heap[right][0] > this.heap[largest][0]) {
        largest = right;
      }

      if (largest === index) break;
      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}
```

```java
// Time: O(n log n) - each operation is O(log n) in the worst case
// Space: O(n) - storing up to n elements in heap and frequency map
import java.util.*;

public class Solution {
    public long[] mostFrequentIDs(int[] nums, int[] freq) {
        int n = nums.length;
        long[] result = new long[n];
        Map<Integer, Long> frequency = new HashMap<>();  // Maps ID -> current frequency
        PriorityQueue<long[]> maxHeap = new PriorityQueue<>(
            (a, b) -> Long.compare(b[0], a[0])  // Max-heap: compare b to a
        );

        for (int i = 0; i < n; i++) {
            int idVal = nums[i];
            int change = freq[i];

            // Update the frequency for this ID
            long currentFreq = frequency.getOrDefault(idVal, 0L);
            long newFreq = currentFreq + change;
            if (newFreq < 0) newFreq = 0;  // Ensure non-negative
            frequency.put(idVal, newFreq);

            // Push the updated (frequency, ID) pair to the heap
            maxHeap.offer(new long[]{newFreq, idVal});

            // Clean up stale entries from the top of the heap
            // A stale entry has frequency that doesn't match current frequency map
            while (!maxHeap.isEmpty()) {
                long[] top = maxHeap.peek();
                long topFreq = top[0];
                int topId = (int) top[1];
                if (topFreq != frequency.getOrDefault(topId, 0L)) {
                    maxHeap.poll();  // Remove stale entry
                } else {
                    break;
                }
            }

            // After cleaning, the top of heap has current maximum frequency
            long currentMax = maxHeap.isEmpty() ? 0 : maxHeap.peek()[0];
            result[i] = currentMax;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- We process n operations
- Each heap operation (push/pop) is O(log n)
- In the worst case, we might need to clean up multiple stale entries, but each entry is pushed and popped at most once, so amortized O(log n) per operation

**Space Complexity:** O(n)

- The frequency map stores at most n unique IDs
- The heap stores at most n entries (though with lazy deletion, it may temporarily hold stale entries)

The key to the efficiency is that even though we push duplicate entries to the heap, each ID's entry is pushed at most once per operation, and stale entries are cleaned up lazily when we access the top of the heap.

## Common Mistakes

1. **Forgetting to handle negative frequencies:** When removing more occurrences than exist, the frequency should go to 0, not negative. Always check `if newFreq < 0: newFreq = 0`.

2. **Not implementing lazy deletion properly:** Some candidates try to update heap entries directly, which isn't efficient in standard heap implementations. The lazy deletion pattern (push new entries, ignore stale ones when peeking) is crucial.

3. **Using a heap without tracking current frequencies:** If you only use a heap and no hash map, you won't know which entries are stale. You need both data structures working together.

4. **Assuming the heap top is always valid:** Always check if the heap top matches the current frequency in your map before using it. Stale entries accumulate over time.

## When You'll See This Pattern

This "heap with lazy deletion" pattern appears in several other LeetCode problems:

1. **Top K Frequent Elements (LeetCode 347):** While simpler (no removals), it uses a similar combination of hash map and heap to track frequencies.

2. **Sliding Window Maximum (LeetCode 239):** Uses a similar concept with a deque to efficiently track the maximum in a sliding window as elements enter and exit.

3. **Design Twitter (LeetCode 355):** Uses heaps to merge multiple sorted feeds, with similar lazy evaluation concepts.

4. **Stock Price Fluctuation (LeetCode 2034):** Requires tracking both maximum and minimum prices that can be updated and retrieved efficiently.

The core pattern is: when you need to maintain a running maximum/minimum with frequent updates and deletions, consider a heap with lazy deletion or a balanced binary search tree.

## Key Takeaways

1. **Heap + Hash Map is powerful for frequency tracking:** When you need to track frequencies and quickly get the maximum/minimum, this combination is often optimal. The hash map gives O(1) updates, while the heap gives O(log n) access to extremes.

2. **Lazy deletion solves the "update" problem in heaps:** Since most heap implementations don't support efficient updates, push new entries and mark old ones as stale. Clean them up when you access the top.

3. **Always consider both increasing and decreasing operations:** Many problems only require adding elements, but removals complicate things. Think about what happens when your current maximum gets removed or reduced.

[Practice this problem on CodeJeet](/problem/most-frequent-ids)
