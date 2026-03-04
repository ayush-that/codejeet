---
title: "Heap (Priority Queue) Questions at Yelp: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-19"
category: "dsa-patterns"
tags: ["yelp", "heap-priority-queue", "interview prep"]
---

Heap (Priority Queue) questions appear in about 11% of Yelp’s technical interview problems. This frequency reflects their practical use in real-world systems for managing streaming data, scheduling tasks, and finding top-ranked items—core concerns for a platform that processes millions of reviews and business listings. Mastering heaps demonstrates you can efficiently handle scenarios like “find the top K nearest restaurants” or “merge multiple sorted feeds,” which are directly applicable to Yelp’s services.

## What to Expect — types of problems

Yelp’s heap questions typically fall into two categories. First, **Top K Element** problems, where you must efficiently retrieve the K largest, smallest, most frequent, or closest items from a dataset. This pattern is central to features like displaying top-rated businesses or popular search terms. Second, **Streaming/Continuous Data** problems, where data arrives incrementally (like new reviews or location pings), and you must maintain a running result, such as a median or a set of top candidates. You’ll often combine a heap with other data structures, like a hash map for frequency tracking, to solve these. Expect problems to be framed around Yelp’s domain: think business rankings, geographic proximity, or merging recommendation lists.

## How to Prepare — study tips with one code example

Focus on recognizing when to use a min-heap versus a max-heap. A common strategy is to maintain a heap of size K to limit space complexity. For “Top K Largest,” you’d use a min-heap to easily evict the smallest of the current top candidates. Practice the pattern of iterating through elements, pushing them onto the heap, and popping when the heap exceeds size K. Here is a concrete example for finding the K most frequent words:

<div class="code-group">

```python
import collections, heapq

def top_k_frequent(words, k):
    count = collections.Counter(words)
    # Use min-heap: store (-freq, word) to simulate max-heap behavior
    heap = []
    for word, freq in count.items():
        heapq.heappush(heap, (-freq, word))
    result = []
    for _ in range(k):
        result.append(heapq.heappop(heap)[1])
    return result
```

```javascript
function topKFrequent(words, k) {
  const count = new Map();
  for (const word of words) {
    count.set(word, (count.get(word) || 0) + 1);
  }
  // Min-heap with custom comparator for (-freq, word)
  const heap = new MinPriorityQueue({
    priority: ([negFreq, word]) => negFreq,
  });
  for (const [word, freq] of count) {
    heap.enqueue([-freq, word]);
  }
  const result = [];
  for (let i = 0; i < k; i++) {
    result.push(heap.dequeue().element[1]);
  }
  return result;
}
```

```java
public List<String> topKFrequent(String[] words, int k) {
    Map<String, Integer> count = new HashMap<>();
    for (String word : words) {
        count.put(word, count.getOrDefault(word, 0) + 1);
    }
    // Min-heap: comparator orders by frequency descending, then word ascending
    PriorityQueue<String> heap = new PriorityQueue<>(
        (w1, w2) -> count.get(w1).equals(count.get(w2)) ?
            w1.compareTo(w2) : count.get(w2) - count.get(w1)
    );
    for (String word : count.keySet()) {
        heap.offer(word);
    }
    List<String> result = new ArrayList<>();
    for (int i = 0; i < k; i++) {
        result.add(heap.poll());
    }
    return result;
}
```

</div>

## Recommended Practice Order

Start with fundamental heap operations and classic problems: implement a heap from scratch, then solve “Kth Largest Element in a Stream” and “Merge K Sorted Lists.” Next, tackle frequency-based problems like “Top K Frequent Elements” and “Sort Characters by Frequency.” Finally, simulate interview conditions with Yelp-specific practice problems, focusing on combining heaps with hash maps or sorting. Always articulate your trade-off reasoning between heap and sorting approaches.

[Practice Heap (Priority Queue) at Yelp](/company/yelp/heap-priority-queue)
