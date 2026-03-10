---
title: "Heap (Priority Queue) Questions at Twitter: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Twitter — patterns, difficulty breakdown, and study tips."
date: "2029-07-28"
category: "dsa-patterns"
tags: ["twitter", "heap-priority-queue", "interview prep"]
---

# Heap (Priority Queue) Questions at Twitter: What to Expect

Twitter has 6 Heap (Priority Queue) questions out of 53 total in their LeetCode tagged problems. That's about 11% of their problem set, which is significant but not overwhelming. In real interviews, you're more likely to encounter heap problems in the second or third round, often as part of system design discussions (like designing a trending topics system) or in coding questions that involve real-time data processing. The key insight: Twitter doesn't just test heaps in isolation—they test them in contexts that matter for their business: real-time feeds, top-K elements from streaming data, and scheduling problems.

## Specific Patterns Twitter Favors

Twitter's heap problems tend to cluster around three specific patterns:

1. **Top-K Frequent Elements in Streaming Data**: This is their bread and butter. Think about Twitter's core features—trending topics, most engaged tweets, top influencers in a topic. All of these require efficiently tracking the most frequent or highest-scoring items from massive data streams. LeetCode #347 (Top K Frequent Elements) is the classic, but Twitter variations often involve streaming input.

2. **Merge K Sorted Lists/Arrays**: This pattern appears in feed aggregation scenarios. If you have multiple timelines or data sources producing sorted content, merging them efficiently is crucial. LeetCode #23 (Merge k Sorted Lists) is the standard, but watch for variations with different data structures.

3. **Interval Scheduling with Priority**: Twitter needs to schedule tweets, ads, and other time-bound operations. Problems like meeting rooms (LeetCode #253) but with Twitter-specific twists—like prioritizing certain content types or users.

Here's the pattern for Top-K from a data stream, which appears in multiple Twitter questions:

<div class="code-group">

```python
# Time: O(n log k) for n add operations | Space: O(k + n)
import heapq
from collections import Counter

class TopKFrequent:
    def __init__(self, k: int):
        self.k = k
        self.counts = Counter()
        self.heap = []  # min-heap of (count, element)

    def add(self, element: int) -> None:
        # Update frequency
        self.counts[element] += 1
        count = self.counts[element]

        # If element already in heap, we need to rebuild (simplified approach)
        # In interviews, you might discuss using a hashmap to track heap positions
        # For simplicity here, we'll just push and clean later
        heapq.heappush(self.heap, (count, element))

        # Keep heap size manageable - remove duplicates when getting top k
        # This is O(k log k) which is fine when k << n

    def get_top_k(self) -> list[int]:
        # Get unique elements with their current counts
        unique_items = {}
        while self.heap:
            count, element = heapq.heappop(self.heap)
            if self.counts[element] == count:  # Ensure count is current
                unique_items[element] = count

        # Rebuild heap with current unique items
        self.heap = []
        for element, count in unique_items.items():
            heapq.heappush(self.heap, (count, element))
            if len(self.heap) > self.k:
                heapq.heappop(self.heap)

        # Return elements in any order (or sorted by frequency if required)
        return [element for count, element in self.heap]
```

```javascript
// Time: O(n log k) for n add operations | Space: O(k + n)
class TopKFrequent {
  constructor(k) {
    this.k = k;
    this.counts = new Map();
    this.heap = []; // min-heap of [count, element]
  }

  add(element) {
    // Update frequency
    const newCount = (this.counts.get(element) || 0) + 1;
    this.counts.set(element, newCount);

    // Push to heap
    this.heap.push([newCount, element]);
    this._heapifyUp(this.heap.length - 1);
  }

  getTopK() {
    // Clean heap of outdated entries
    const validHeap = [];
    for (const [count, element] of this.heap) {
      if (this.counts.get(element) === count) {
        validHeap.push([count, element]);
      }
    }

    // Build min-heap of size k
    this.heap = [];
    for (const item of validHeap) {
      this._pushToKHeap(item);
    }

    return this.heap.map((item) => item[1]);
  }

  _heapifyUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent][0] <= this.heap[index][0]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _pushToKHeap(item) {
    if (this.heap.length < this.k) {
      this.heap.push(item);
      this._heapifyUp(this.heap.length - 1);
    } else if (item[0] > this.heap[0][0]) {
      this.heap[0] = item;
      this._heapifyDown(0);
    }
  }

  _heapifyDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left][0] < this.heap[smallest][0]) {
        smallest = left;
      }
      if (right < length && this.heap[right][0] < this.heap[smallest][0]) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(n log k) for n add operations | Space: O(k + n)
import java.util.*;

class TopKFrequent {
    private int k;
    private Map<Integer, Integer> counts;
    private PriorityQueue<Map.Entry<Integer, Integer>> heap;

    public TopKFrequent(int k) {
        this.k = k;
        this.counts = new HashMap<>();
        this.heap = new PriorityQueue<>(Comparator.comparingInt(Map.Entry::getValue));
    }

    public void add(int element) {
        counts.put(element, counts.getOrDefault(element, 0) + 1);

        // For simplicity, we'll push and clean later
        // In a real implementation, you'd track heap positions
        heap.offer(new AbstractMap.SimpleEntry<>(element, counts.get(element)));
    }

    public List<Integer> getTopK() {
        // Remove outdated entries
        Set<Map.Entry<Integer, Integer>> validEntries = new HashSet<>();
        while (!heap.isEmpty()) {
            Map.Entry<Integer, Integer> entry = heap.poll();
            if (counts.get(entry.getKey()).equals(entry.getValue())) {
                validEntries.add(entry);
            }
        }

        // Rebuild heap with only k entries
        heap.clear();
        for (Map.Entry<Integer, Integer> entry : validEntries) {
            heap.offer(entry);
            if (heap.size() > k) {
                heap.poll();
            }
        }

        // Extract results
        List<Integer> result = new ArrayList<>();
        while (!heap.isEmpty()) {
            result.add(heap.poll().getKey());
        }
        return result;
    }
}
```

</div>

## How to Prepare

Master the heap patterns, but more importantly, understand when to use them. Twitter interviewers often present problems that _could_ be solved with sorting (O(n log n)), but they want the heap solution (O(n log k)) because k is typically much smaller than n in their use cases.

Practice implementing your own heap methods. While you can use language-provided priority queues in interviews, knowing how to implement heapify operations demonstrates deeper understanding. Focus on:

- When to use min-heap vs max-heap (min-heap for keeping largest elements, max-heap for smallest)
- How to handle updates to elements already in the heap
- The trade-offs between heap and other data structures

Here's the merge K sorted pattern that appears frequently:

<div class="code-group">

```python
# Time: O(N log k) where N is total elements | Space: O(k)
import heapq

def merge_k_sorted_lists(lists):
    if not lists:
        return []

    # Min-heap storing (value, list_index, element_index)
    heap = []

    # Push first element of each list
    for i, lst in enumerate(lists):
        if lst:  # Handle empty lists
            heapq.heappush(heap, (lst[0], i, 0))

    result = []
    while heap:
        val, list_idx, element_idx = heapq.heappop(heap)
        result.append(val)

        # Push next element from the same list
        if element_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][element_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, element_idx + 1))

    return result
```

```javascript
// Time: O(N log k) where N is total elements | Space: O(k)
function mergeKSortedLists(lists) {
  if (!lists.length) return [];

  // Min-heap using array and manual heapify
  const heap = [];

  // Push first element of each list
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].length > 0) {
      heap.push({ val: lists[i][0], listIdx: i, elementIdx: 0 });
      heapifyUp(heap, heap.length - 1);
    }
  }

  const result = [];
  while (heap.length > 0) {
    const { val, listIdx, elementIdx } = heap[0];
    result.push(val);

    // Remove min and heapify down
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      heapifyDown(heap, 0);
    }

    // Push next element from same list if exists
    if (elementIdx + 1 < lists[listIdx].length) {
      const nextVal = lists[listIdx][elementIdx + 1];
      heap.push({ val: nextVal, listIdx, elementIdx: elementIdx + 1 });
      heapifyUp(heap, heap.length - 1);
    }
  }

  return result;

  function heapifyUp(heap, index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heap[parent].val <= heap[index].val) break;
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  }

  function heapifyDown(heap, index) {
    const length = heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && heap[left].val < heap[smallest].val) {
        smallest = left;
      }
      if (right < length && heap[right].val < heap[smallest].val) {
        smallest = right;
      }
      if (smallest === index) break;

      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(N log k) where N is total elements | Space: O(k)
import java.util.*;

public List<Integer> mergeKSortedLists(List<List<Integer>> lists) {
    List<Integer> result = new ArrayList<>();
    if (lists == null || lists.isEmpty()) return result;

    // Min-heap of (value, listIndex, elementIndex)
    PriorityQueue<int[]> heap = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0])
    );

    // Add first element of each list
    for (int i = 0; i < lists.size(); i++) {
        if (lists.get(i) != null && !lists.get(i).isEmpty()) {
            heap.offer(new int[]{lists.get(i).get(0), i, 0});
        }
    }

    while (!heap.isEmpty()) {
        int[] current = heap.poll();
        int val = current[0];
        int listIdx = current[1];
        int elementIdx = current[2];

        result.add(val);

        // Add next element from the same list
        if (elementIdx + 1 < lists.get(listIdx).size()) {
            heap.offer(new int[]{
                lists.get(listIdx).get(elementIdx + 1),
                listIdx,
                elementIdx + 1
            });
        }
    }

    return result;
}
```

</div>

## How Twitter Tests Heap vs Other Companies

Twitter's heap questions differ from other companies in three key ways:

1. **Streaming Focus**: While Google might ask heap questions in isolation, Twitter almost always frames them in streaming contexts. You're not just finding top K elements—you're finding them from a never-ending data stream.

2. **Practical Applications**: Facebook might ask heap questions as pure algorithms, but Twitter ties them directly to product features. Be prepared to discuss how you'd scale the solution, handle failures, or modify it for specific use cases.

3. **Moderate Difficulty**: Twitter's heap problems tend to be medium difficulty—hard enough to separate candidates, but not so hard that they become impractical for a 45-minute interview. You won't see the absolute hardest heap problems here.

## Study Order

1. **Basic Heap Operations**: Understand insert, extract-min/max, and heapify. Implement a heap from scratch in your preferred language.
2. **Single Pattern Problems**: Solve straightforward heap problems like Kth Largest Element (#215) before tackling more complex ones.

3. **Top-K Patterns**: Master finding top K frequent elements (#347) and top K from streams. This is Twitter's most common pattern.

4. **Merge K Sorted**: Practice merging K sorted lists/arrays (#23) and variations.

5. **Interval Problems**: Learn to use heaps for scheduling problems like Meeting Rooms II (#253).

6. **Advanced Patterns**: Finally, tackle problems that combine heaps with other data structures, like finding median from data stream (#295).

This order works because it builds from fundamentals to Twitter-specific patterns, ensuring you have the basics down before tackling their favorite question types.

## Recommended Practice Order

1. **Kth Largest Element in an Array** (LeetCode #215) - Basic heap usage
2. **Top K Frequent Elements** (LeetCode #347) - Core Twitter pattern
3. **Merge k Sorted Lists** (LeetCode #23) - Feed aggregation pattern
4. **Find Median from Data Stream** (LeetCode #295) - Streaming data with two heaps
5. **Meeting Rooms II** (LeetCode #253) - Scheduling applications
6. **Twitter's own tagged problems** - Search for "Twitter" + "Heap" on LeetCode

After these six, you'll have covered 90% of heap patterns Twitter uses. The key is to understand not just how to solve them, but why heaps are the right choice for Twitter's use cases.

[Practice Heap (Priority Queue) at Twitter](/company/twitter/heap-priority-queue)
