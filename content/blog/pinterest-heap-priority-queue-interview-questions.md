---
title: "Heap (Priority Queue) Questions at Pinterest: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Pinterest — patterns, difficulty breakdown, and study tips."
date: "2029-09-02"
category: "dsa-patterns"
tags: ["pinterest", "heap-priority-queue", "interview prep"]
---

# Heap (Priority Queue) Questions at Pinterest: What to Expect

If you're preparing for Pinterest interviews, you might have noticed they have 6 Heap (Priority Queue) questions out of their 48 total tagged problems. That's 12.5% — not a massive focus, but significant enough that you'll likely encounter at least one heap question in your interview loop. The real insight? Pinterest uses heaps not as abstract algorithm trivia, but as practical tools for the types of problems they actually solve: content ranking, recommendation systems, and handling streaming data with priority constraints.

Unlike companies that might ask heap questions purely to test algorithmic knowledge, Pinterest's heap problems tend to mirror real engineering challenges they face. When you're deciding which pins to show next in a user's feed, or processing millions of events to identify trending content, you're dealing with top-K elements, merging sorted streams, and scheduling tasks — all classic heap territory. So while you won't get a heap question in every interview, when you do get one, it's often a signal that the interviewer wants to see how you apply data structures to practical, scalable systems.

## Specific Patterns Pinterest Favors

Pinterest's heap questions cluster around three practical patterns:

1. **Top-K with frequency tracking** — Their most common pattern by far. Think "find the K most frequent pins" or "identify trending hashtags." These problems combine hash maps for counting with min-heaps for maintaining the top K elements efficiently. LeetCode #347 (Top K Frequent Elements) is the archetype here.

2. **Merging K sorted lists/streams** — Pinterest deals with multiple data sources (user feeds, search results, recommended content). Merging these efficiently is crucial. LeetCode #23 (Merge k Sorted Lists) appears in their list, and variations with streaming data are common.

3. **Interval scheduling with priority** — While less frequent, problems like meeting rooms (#253) or task scheduling appear because they model real resource allocation problems in distributed systems.

What's notably absent? Pure "find the median" problems or overly mathematical heap applications. Pinterest's questions are grounded in data processing scenarios.

## How to Prepare

The key insight for Pinterest heap questions: they're rarely just about the heap. They're about combining the heap with other structures. Let's look at the top-K pattern, which appears in 4 of their 6 heap questions.

<div class="code-group">

```python
def topKFrequent(nums, k):
    """
    Find the k most frequent elements.
    Time: O(n log k) - n elements, heap operations are log k
    Space: O(n) - for the frequency map and heap
    """
    from collections import Counter
    import heapq

    # Count frequencies - O(n)
    freq = Counter(nums)

    # Use min-heap to keep top k elements
    # Heap stores (frequency, element) pairs
    heap = []

    for num, count in freq.items():
        heapq.heappush(heap, (count, num))

        # If heap exceeds k, remove the least frequent
        if len(heap) > k:
            heapq.heappop(heap)

    # Extract elements from heap
    return [num for count, num in heap]

# Example: topKFrequent([1,1,1,2,2,3], 2) returns [1,2]
```

```javascript
function topKFrequent(nums, k) {
  /**
   * Find the k most frequent elements.
   * Time: O(n log k) - n elements, heap operations are log k
   * Space: O(n) - for the frequency map and heap
   */
  const freq = new Map();

  // Count frequencies - O(n)
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Min-heap implementation (using array and comparator)
  const heap = [];

  const pushHeap = (count, num) => {
    heap.push([count, num]);
    heap.sort((a, b) => a[0] - b[0]); // Min-heap by count
  };

  const popHeap = () => {
    heap.sort((a, b) => a[0] - b[0]);
    return heap.shift();
  };

  // Build heap with at most k elements
  for (const [num, count] of freq.entries()) {
    pushHeap(count, num);

    if (heap.length > k) {
      popHeap();
    }
  }

  return heap.map((item) => item[1]);
}
```

```java
public List<Integer> topKFrequent(int[] nums, int k) {
    /**
     * Find the k most frequent elements.
     * Time: O(n log k) - n elements, heap operations are log k
     * Space: O(n) - for the frequency map and heap
     */
    Map<Integer, Integer> freq = new HashMap<>();

    // Count frequencies - O(n)
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // Min-heap: store entries with smallest frequency at top
    PriorityQueue<Map.Entry<Integer, Integer>> heap =
        new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

    // Build heap with at most k elements
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
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
```

</div>

Notice the pattern: count first, then heap. The heap only needs to store K elements, giving us O(n log k) instead of O(n log n). This optimization matters at Pinterest scale.

For merging K sorted lists, the pattern is similar but with a different comparator:

<div class="code-group">

```python
def mergeKLists(lists):
    """
    Merge k sorted linked lists.
    Time: O(n log k) where n is total nodes
    Space: O(k) for the heap
    """
    import heapq

    # Min-heap stores (value, list_index, node)
    heap = []

    # Initialize heap with first node from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))

    dummy = ListNode(0)
    current = dummy

    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next

        # Add next node from the same list
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next
```

```javascript
function mergeKLists(lists) {
  /**
   * Merge k sorted linked lists.
   * Time: O(n log k) where n is total nodes
   * Space: O(k) for the heap
   */
  // Min-heap implementation
  const heap = [];

  const pushHeap = (node, listIndex) => {
    heap.push({ val: node.val, listIndex, node });
    heap.sort((a, b) => a.val - b.val);
  };

  const popHeap = () => {
    heap.sort((a, b) => a.val - b.val);
    return heap.shift();
  };

  // Initialize heap
  for (let i = 0; i < lists.length; i++) {
    if (lists[i]) {
      pushHeap(lists[i], i);
    }
  }

  const dummy = new ListNode(0);
  let current = dummy;

  while (heap.length > 0) {
    const { node, listIndex } = popHeap();
    current.next = node;
    current = current.next;

    if (node.next) {
      pushHeap(node.next, listIndex);
    }
  }

  return dummy.next;
}
```

```java
public ListNode mergeKLists(ListNode[] lists) {
    /**
     * Merge k sorted linked lists.
     * Time: O(n log k) where n is total nodes
     * Space: O(k) for the heap
     */
    PriorityQueue<ListNode> heap = new PriorityQueue<>(
        (a, b) -> a.val - b.val
    );

    // Initialize heap
    for (ListNode list : lists) {
        if (list != null) {
            heap.offer(list);
        }
    }

    ListNode dummy = new ListNode(0);
    ListNode current = dummy;

    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        current.next = node;
        current = current.next;

        if (node.next != null) {
            heap.offer(node.next);
        }
    }

    return dummy.next;
}
```

</div>

## How Pinterest Tests Heap (Priority Queue) vs Other Companies

Pinterest's heap questions differ from other companies in three key ways:

1. **Practical over theoretical**: Google might ask "implement a heap from scratch." Pinterest asks "use a heap to solve this real data processing problem." They care more about application than implementation details.

2. **Moderate difficulty**: Facebook's heap questions can get convoluted with multiple constraints. Pinterest's tend to be medium difficulty — the kind you can solve in 30 minutes with clean code. They're testing if you know the pattern, not if you're an algorithms PhD.

3. **Follow-up heavy**: The initial heap solution is often just the beginning. Expect follow-ups like "what if K is very large?" or "how would this work with streaming data?" They want to see you think about scale.

At companies like Amazon, heap questions often relate to system design (load balancing, task scheduling). At Pinterest, they relate to product features (ranking, recommendations).

## Study Order

1. **Basic heap operations** — Understand insert (O(log n)) and extract-min/max (O(log n)). Know when to use min-heap vs max-heap.

2. **Top-K pattern** — Start here because it's Pinterest's most frequent pattern. Master the hashmap + heap combination.

3. **K-way merge** — Learn to merge multiple sorted streams. This builds on basic heap operations.

4. **Interval problems** — These combine heaps with sorting and greedy algorithms.

5. **Custom comparators** — Practice implementing heaps with custom sorting logic (common in object-oriented problems).

This order works because each step builds on the previous. Top-K teaches you the core "maintain K elements in a heap" pattern. K-way merge applies this to multiple streams. Interval problems add time-based thinking. Custom comparators prepare you for real-world objects.

## Recommended Practice Order

Solve these in sequence:

1. **LeetCode #347 (Top K Frequent Elements)** — The fundamental pattern. Do this until you can code it in under 5 minutes.

2. **LeetCode #215 (Kth Largest Element in an Array)** — Simpler variant of top-K. Good for building confidence.

3. **LeetCode #23 (Merge k Sorted Lists)** — The classic K-way merge problem.

4. **LeetCode #253 (Meeting Rooms II)** — Interval scheduling with a heap. Tests if you can adapt the pattern.

5. **LeetCode #621 (Task Scheduler)** — More complex scheduling problem that uses similar patterns.

6. **LeetCode #767 (Reorganize String)** — Advanced pattern that combines frequency counting with greedy heap usage.

After these six, you'll have covered every heap pattern Pinterest uses. Time yourself: you should solve medium heap problems in 20-25 minutes to have time for follow-ups.

Remember: at Pinterest, the heap is a means to an end. They want to see that you can recognize when a heap is the right tool, implement it cleanly, and discuss its limitations at scale. Practice not just solving the problems, but explaining your tradeoffs aloud.

[Practice Heap (Priority Queue) at Pinterest](/company/pinterest/heap-priority-queue)
