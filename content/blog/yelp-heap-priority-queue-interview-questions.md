---
title: "Heap (Priority Queue) Questions at Yelp: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-11"
category: "dsa-patterns"
tags: ["yelp", "heap-priority-queue", "interview prep"]
---

# Heap (Priority Queue) Questions at Yelp: What to Expect

If you're preparing for a Yelp interview, you've probably noticed that Heap (Priority Queue) questions make up a small but significant slice of their problem set—3 out of 27 tagged problems. This isn't a massive focus area like Two Pointers or Arrays, but it's a critical one. In my experience, and from talking with engineers who've interviewed there, a Heap question is a strong possibility in the technical round, especially for problems involving ranking, scheduling, or processing streams of data—all core to Yelp's business of sorting and recommending businesses.

The reason Heaps matter at Yelp isn't because they're obsessed with the data structure itself, but because it's the optimal tool for a specific class of real-world problems they solve daily. Think about it: displaying the "top 10" restaurants near a user, merging multiple feeds of reviews or events, or efficiently handling batches of requests. A Heap (typically a min-heap or max-heap) is the engine for "keep the best K elements" or "always process the next smallest/largest item." Missing this pattern can turn an O(n log k) solution into an O(n log n) one, which might be the difference between a pass and a fail. While not every interview will feature one, being unprepared for it is a risk you shouldn't take.

## Specific Patterns Yelp Favors

Yelp's Heap problems tend to cluster around a few practical, non-esoteric patterns. You won't often see them combined with advanced graph theory here. Instead, focus on these two high-probability categories:

1.  **Top K / K-th Element Problems:** This is the most common pattern. Given a large dataset (like business listings or reviews), find the top K items by some metric (rating, proximity, frequency). The classic approach is to use a Min-Heap of size K to efficiently track the top candidates. A classic example is **LeetCode 347: Top K Frequent Elements**. Yelp has a direct analogue in their problem set focusing on top businesses.
2.  **Merge K Sorted Lists/Arrays:** This pattern is about efficiency in consolidation. Imagine merging results from multiple search databases or sorted lists of events. The optimal solution uses a Min-Heap to always pick the next smallest element from among the heads of all lists. **LeetCode 23: Merge k Sorted Lists** is the blueprint.

Here’s the essential code pattern for the **Top K Frequent Elements** problem, which is your most important template:

<div class="code-group">

```python
import heapq
from collections import Counter

def topKFrequent(nums, k):
    """
    Finds the k most frequent elements.
    Strategy: Use a min-heap of size k to store (frequency, element).
    The root is the smallest frequency in the heap, which we pop if we find a larger one.
    """
    # 1. Count frequencies: O(n) time, O(n) space
    freq_map = Counter(nums)

    # 2. Initialize min-heap
    min_heap = []

    # 3. Iterate through frequency map
    for num, freq in freq_map.items():
        # Push as (frequency, element) so heap orders by frequency
        heapq.heappush(min_heap, (freq, num))
        # If heap exceeds size k, pop the element with the smallest frequency
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    # 4. Extract elements from the heap
    # The heap contains the k elements with the *highest* frequencies
    return [num for freq, num in min_heap]

# Time Complexity: O(n log k). We perform n pushes/pops on a heap of size k.
# Space Complexity: O(n) for the frequency map + O(k) for the heap = O(n).
```

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  // 1. Count frequencies
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // 2. Initialize min-heap (using array and comparator)
  const minHeap = new MinPriorityQueue({ priority: (x) => x.freq });

  // 3. Iterate through frequency map
  for (const [num, freq] of freqMap) {
    minHeap.enqueue({ num, freq });
    // Maintain heap size of k
    if (minHeap.size() > k) {
      minHeap.dequeue();
    }
  }

  // 4. Extract results
  const result = [];
  while (!minHeap.isEmpty()) {
    result.push(minHeap.dequeue().element.num);
  }
  return result;
};

// Note: Uses 'datastructures-js/priority-queue' library syntax common in interviews.
// Time Complexity: O(n log k)
// Space Complexity: O(n)
```

```java
import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 1. Count frequencies
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        // 2. Initialize min-heap (ordered by frequency)
        // PriorityQueue in Java is a min-heap by default.
        // We store Map.Entry objects and compare by value (frequency).
        PriorityQueue<Map.Entry<Integer, Integer>> minHeap =
            new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

        // 3. Iterate through frequency map
        for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
            minHeap.offer(entry);
            if (minHeap.size() > k) {
                minHeap.poll(); // Remove the element with smallest frequency
            }
        }

        // 4. Extract results
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = minHeap.poll().getKey();
        }
        return result;
    }
}

// Time Complexity: O(n log k)
// Space Complexity: O(n)
```

</div>

## How to Prepare

Your preparation should be pattern-driven, not problem-driven. Master the two patterns above until you can implement them from memory. Then, practice variations. For example, what if you need the _least_ frequent elements? You'd use a max-heap or invert the comparator. What if the input is a stream? You'd maintain the heap dynamically.

Always articulate the _why_ of using a heap. In an interview, say: "A brute force sort would be O(n log n). By using a min-heap of size K, we can reduce the sort cost to O(n log k), which is much more efficient when K is small compared to n." This shows you understand trade-offs.

Here is the core pattern for **Merging K Sorted Lists**, another essential:

<div class="code-group">

```python
import heapq

def mergeKLists(lists):
    """
    Merges k sorted linked lists into one sorted list.
    Strategy: Use a min-heap to store the smallest node from each list.
    """
    # Min-heap will store (node.val, index, node)
    # The index is a tie-breaker to avoid comparing ListNode objects directly
    min_heap = []

    # 1. Push the head of each non-empty list into the heap
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(min_heap, (lst.val, i, lst))

    # Dummy node to build the result list
    dummy = ListNode(0)
    current = dummy

    # 2. While heap has elements
    while min_heap:
        val, i, node = heapq.heappop(min_heap)
        current.next = node
        current = current.next

        # If the popped node has a next, push that into the heap
        if node.next:
            heapq.heappush(min_heap, (node.next.val, i, node.next))

    return dummy.next

# Time Complexity: O(N log k), where N is total nodes, k is number of lists.
# Space Complexity: O(k) for the heap.
```

```javascript
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
  // Min-Heap (Priority Queue) initialization
  const minHeap = new MinPriorityQueue({ priority: (x) => x.val });

  // 1. Push heads into heap
  for (let i = 0; i < lists.length; i++) {
    if (lists[i]) {
      minHeap.enqueue({ val: lists[i].val, node: lists[i] });
    }
  }

  // Dummy head for result
  const dummy = new ListNode(0);
  let current = dummy;

  // 2. Process heap
  while (!minHeap.isEmpty()) {
    const { node } = minHeap.dequeue().element;
    current.next = node;
    current = current.next;

    if (node.next) {
      minHeap.enqueue({ val: node.next.val, node: node.next });
    }
  }

  return dummy.next;
};

// Time Complexity: O(N log k)
// Space Complexity: O(k)
```

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Min-heap comparator comparing node values
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>((a, b) -> a.val - b.val);

        // 1. Add heads to heap
        for (ListNode list : lists) {
            if (list != null) {
                minHeap.offer(list);
            }
        }

        // Dummy head for result
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        // 2. Process heap
        while (!minHeap.isEmpty()) {
            ListNode node = minHeap.poll();
            current.next = node;
            current = current.next;

            if (node.next != null) {
                minHeap.offer(node.next);
            }
        }

        return dummy.next;
    }
}

// Time Complexity: O(N log k)
// Space Complexity: O(k)
```

</div>

## How Yelp Tests Heap (Priority Queue) vs Other Companies

Yelp's Heap questions are typically "applied" rather than "theoretical." At companies like Google or Facebook, you might see a Heap disguised in a complex graph problem (e.g., Dijkstra's algorithm) or a system design question about a priority task queue. At Yelp, the connection to their domain is more direct: you're often explicitly asked to rank, sort, or merge business-related data.

The difficulty is usually in the **medium** range. They want to see if you can identify the pattern and implement it cleanly under time pressure. The unique aspect is the focus on clarity and correctness over cleverness. A bug-free, well-explained solution using a Heap is better than a highly optimized but cryptic one. They also care about edge cases: What if K is larger than the number of unique elements? What if one of the lists is empty?

## Study Order

Don't jump straight into Yelp's tagged problems. Build your foundation systematically:

1.  **Understand the Heap Data Structure:** Know how a min-heap and max-heap work, and the time complexity of insert (`O(log n)`) and extract-min (`O(log n)`). Understand that in most interview languages, you'll use a library `PriorityQueue`.
2.  **Learn the "Top K" Pattern:** This is your bread and butter. Practice until you can write the code without hesitation.
3.  **Learn the "Merge K Sorted" Pattern:** This is the second most common pattern. Understand why a heap is better than repeatedly merging two lists.
4.  **Practice Simple Variations:** Try problems where you need the Kth largest element in a stream (LeetCode 703) or the median from a data stream (LeetCode 295) — the latter uses two heaps.
5.  **Recognize Advanced Combinations:** Only after mastering the above, look at problems where a Heap is one component, like in some BFS/Dijkstra problems. For Yelp, this is lower priority.

## Recommended Practice Order

Solve these problems in sequence to build competence:

1.  **LeetCode 703: Kth Largest Element in a Stream** - The simplest "maintain a heap" problem. Perfect for understanding dynamic data.
2.  **LeetCode 347: Top K Frequent Elements** - The canonical Top K problem. Master this.
3.  **LeetCode 215: Kth Largest Element in an Array** - Another Top K variant, can be solved with a heap (or QuickSelect).
4.  **LeetCode 23: Merge k Sorted Lists** - The canonical merge problem. Essential.
5.  **LeetCode 253: Meeting Rooms II** - A fantastic applied problem that uses a min-heap to track meeting end times. Highly relevant to scheduling logic.
6.  **Finally, tackle Yelp's Tagged Problems:** Search for Yelp's company tag on LeetCode and filter by "Heap (Priority Queue)." Solve these last, as they will test your ability to apply the patterns in a slightly novel context.

By following this order, you move from isolated concept to applied pattern to company-specific application, which is how knowledge solidifies.

[Practice Heap (Priority Queue) at Yelp](/company/yelp/heap-priority-queue)
