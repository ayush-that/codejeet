---
title: "Heap (Priority Queue) Questions at Salesforce: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Salesforce — patterns, difficulty breakdown, and study tips."
date: "2027-09-29"
category: "dsa-patterns"
tags: ["salesforce", "heap-priority-queue", "interview prep"]
---

If you're preparing for a Salesforce interview, you'll likely face at least one question involving a Heap (Priority Queue). With 21 out of their 189 tagged problems on LeetCode, this data structure represents over 11% of their technical question bank. That's not a random distribution—it's a signal. Salesforce, with its massive focus on data processing, scheduling, and real-time analytics (think: processing streams of leads, cases, or events), frequently encounters problems in its engineering work that are elegantly solved with heaps. In an interview, they're not just testing if you know the API; they're testing if you can recognize the _pattern_ of needing to constantly access or remove the "most extreme" element (largest, smallest, highest priority) from a dynamic dataset. Expect at least one mid-to-hard round to feature a heap-based solution.

## Specific Patterns Salesforce Favors

Salesforce's heap problems cluster around a few practical, business-relevant themes. You won't find many abstract, purely algorithmic heap puzzles here. Instead, they favor patterns that mirror backend system design.

1.  **Top K / K-th Element Problems:** This is their absolute sweet spot. Think "find the top K most frequent leads," "identify the K most recent high-priority cases," or "the K closest servers." The heap provides an O(n log K) solution that is far more efficient than sorting (O(n log n)) for large `n` and small `K`.
    - **LeetCode Examples:** Top K Frequent Elements (#347), Kth Largest Element in an Array (#215), Find K Closest Elements (#658).

2.  **Merge K Sorted Things:** This pattern directly models merging data from multiple sources—a daily task when aggregating reports, logs, or event streams from different services or partitions. The classic solution uses a min-heap to always pull the next smallest element from any of the `K` lists.
    - **LeetCode Examples:** Merge k Sorted Lists (#23), Kth Smallest Element in a Sorted Matrix (#378).

3.  **Two-Heap Pattern for Running Medians:** Maintaining a running median is a classic data stream problem. Salesforce might frame it as "continuously calculate the median SLA (Service Level Agreement) time for cases as they arrive." The two-heap (min-heap for the larger half, max-heap for the smaller half) pattern is the gold-standard, efficient answer.
    - **LeetCode Example:** Find Median from Data Stream (#295).

4.  **Heap + Greedy Scheduling:** Problems that involve scheduling tasks, meetings (like "Calendar" features), or jobs based on start/end times or deadlines often use a heap to greedily select the next best option. A common trick is to sort one dimension (like start time) and use a min-heap on another (like end time) to track overlaps or resource usage.
    - **LeetCode Examples:** Meeting Rooms II (#253), Course Schedule III (#630).

## How to Prepare

The key is to internalize the mental trigger: **"Do I need repeated access to the current minimum or maximum element from a collection that's being updated?"** If the answer is yes, a heap is likely involved.

Let's look at the most fundamental pattern: **Top K Frequent Elements (#347)**. The brute-force approach sorts a frequency map, taking O(n log n). The heap approach is more efficient.

<div class="code-group">

```python
import heapq
from collections import Counter

def topKFrequent(nums, k):
    """
    Time: O(n log k). We build a frequency map (O(n)) and then maintain a
    min-heap of size at most k (n pushes/pops, each O(log k)).
    Space: O(n) for the frequency map + O(k) for the heap = O(n).
    """
    # 1. Build frequency map: O(n) time, O(n) space
    freq = Counter(nums)

    # 2. Use a min-heap of size k. We store (frequency, element).
    # The heap will keep the *least* frequent of the top candidates at the root.
    heap = []
    for num, count in freq.items():
        heapq.heappush(heap, (count, num))
        # If heap exceeds size k, pop the smallest frequency (root)
        if len(heap) > k:
            heapq.heappop(heap)

    # 3. Extract elements from the heap. They can be in any order.
    return [num for _, num in heap]

# Example: nums = [1,1,1,2,2,3], k = 2 -> Output: [1,2]
```

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  // Time: O(n log k) | Space: O(n)
  const freqMap = new Map();
  // Build frequency map
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Min-heap in JS: Use an array and sort comparator, but simulate heap ops.
  // For interview clarity, we can use sorting on a limited array.
  const minHeap = [];
  for (const [num, count] of freqMap) {
    minHeap.push([count, num]);
    minHeap.sort((a, b) => a[0] - b[0]); // Sort ascending for min-heap behavior
    if (minHeap.length > k) {
      minHeap.shift(); // Remove the smallest frequency element
    }
  }

  return minHeap.map((item) => item[1]);
};
```

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Time: O(n log k) | Space: O(n)
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Min-heap: priority queue storing [frequency, element]
        // Comparator sorts by frequency ascending.
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            minHeap.offer(new int[]{entry.getValue(), entry.getKey()});
            if (minHeap.size() > k) {
                minHeap.poll(); // Remove the element with smallest frequency
            }
        }

        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = minHeap.poll()[1];
        }
        return result;
    }
}
```

</div>

The next critical pattern is **Merging K Sorted Lists**. Here, the heap is used as a "next-item" selector.

<div class="code-group">

```python
import heapq

def mergeKLists(lists):
    """
    Time: O(N log k), where N is total nodes, k is number of lists.
    Each push/pop is O(log k). We do this for all N nodes.
    Space: O(k) for the heap.
    """
    # Min-heap storing (node.val, index, node)
    # The index is a tie-breaker to avoid comparing ListNode objects directly.
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))

    dummy = ListNode(0)
    curr = dummy

    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next
```

```javascript
function mergeKLists(lists) {
  // Time: O(N log k) | Space: O(k)
  const minHeap = new MinPriorityQueue({ priority: (node) => node.val });

  // Add head of each list to the heap
  for (const list of lists) {
    if (list) {
      minHeap.enqueue(list);
    }
  }

  const dummy = new ListNode(0);
  let curr = dummy;

  while (!minHeap.isEmpty()) {
    const node = minHeap.dequeue().element;
    curr.next = node;
    curr = curr.next;
    if (node.next) {
      minHeap.enqueue(node.next);
    }
  }
  return dummy.next;
}
```

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Time: O(N log k) | Space: O(k)
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>((a, b) -> a.val - b.val);

        for (ListNode list : lists) {
            if (list != null) {
                minHeap.offer(list);
            }
        }

        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;

        while (!minHeap.isEmpty()) {
            ListNode node = minHeap.poll();
            curr.next = node;
            curr = curr.next;
            if (node.next != null) {
                minHeap.offer(node.next);
            }
        }
        return dummy.next;
    }
}
```

</div>

## How Salesforce Tests Heap vs Other Companies

Compared to companies like Google or Meta, which might embed heaps in complex graph algorithms (Dijkstra's) or system design simulations, Salesforce's questions are more **applied and data-centric**. The difficulty often lies in recognizing the heap pattern within a wordy, business-scenario problem description, not in implementing the heap itself. They test for clean, efficient code that handles edge cases (empty inputs, K larger than N). The expectation is that you can translate a real-world data processing requirement into the correct abstract pattern.

## Study Order

1.  **Heap Fundamentals:** Understand how a min-heap and max-heap work (complete binary tree, heapify operations). You don't need to implement from scratch, but know the O(log n) insert/extract-min.
2.  **Basic Top K:** Start with "Kth Largest Element" (#215). This is the purest form of the pattern.
3.  **Top K with Frequency:** Move to "Top K Frequent Elements" (#347). This adds the step of building a frequency map first.
4.  **Merge K Sorted Lists:** Tackle #23. This teaches you to use a heap as a selector across multiple sequences.
5.  **Two-Heaps for Median:** Master #295. This pattern is unique and highly testable.
6.  **Heap in Scheduling/Greedy Algorithms:** Solve "Meeting Rooms II" (#253). This combines sorting with a heap to track resources.

## Recommended Practice Order

Solve these Salesforce-tagged problems in this sequence to build complexity gradually:

1.  **Kth Largest Element in an Array (#215)** - The foundational "selection" problem.
2.  **Top K Frequent Elements (#347)** - Adds the frequency map layer.
3.  **Find K Closest Elements (#658)** - A variation that uses absolute difference.
4.  **Merge k Sorted Lists (#23)** - Classic multi-source merge.
5.  **Kth Smallest Element in a Sorted Matrix (#378)** - A 2D variation of merging K sorted sequences.
6.  **Find Median from Data Stream (#295)** - Master the two-heap technique.
7.  **Meeting Rooms II (#253)** - Apply heaps to a scheduling problem.
8.  **Course Schedule III (#630)** - A harder greedy/heap scheduling problem (if you have time).

The goal is to reach a point where, upon reading a problem about "most frequent," "closest," "merging multiple sources," or "continuous median," your mind immediately visualizes the heap data structure. At Salesforce, that recognition is half the battle.

[Practice Heap (Priority Queue) at Salesforce](/company/salesforce/heap-priority-queue)
