---
title: "Heap (Priority Queue) Interview Questions: Patterns and Strategies"
description: "Master Heap (Priority Queue) problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-29"
category: "dsa-patterns"
tags: ["heap-priority-queue", "dsa", "interview prep"]
---

# Heap (Priority Queue) Interview Questions: Patterns and Strategies

I remember watching a candidate freeze up during an interview for a senior backend role. They were asked to design a real-time ad bidding system that needed to serve the highest-paying ad from millions of active bids. They started talking about sorting arrays and database queries. The interviewer nudged them: "What if you had to process 10,000 bids per second?" That's when they realized they needed a heap—specifically, a max-heap to always have instant access to the highest bidder. This pattern, "Top K Elements," is one of several heap patterns that appear constantly in interviews but often catch candidates off guard because they're thinking about the problem domain rather than the optimal data structure.

Heap questions make up 167 problems on LeetCode, with a telling distribution: only 9% are easy, while 56% are medium and 35% are hard. This tells you something important—interviewers use heaps to separate candidates who understand efficient data structure selection from those who don't. When you see a problem involving "Kth smallest/largest," "merging sorted lists," or "scheduling with constraints," you should immediately think: "Could a heap help here?"

## Common Patterns

### Pattern 1: Top K Elements

This is the most frequent heap pattern. When you need the K largest or smallest elements from a collection, sorting the entire array takes O(n log n). A heap gives you O(n log k), which is dramatically better when k is much smaller than n.

The intuition: Use a min-heap for "K largest" and a max-heap for "K smallest." Why? For K largest elements, maintain a min-heap of size K. When you encounter a value larger than the smallest element in your heap (the root), replace it. By the end, your heap contains the K largest elements.

<div class="code-group">

```python
def find_k_largest(nums, k):
    """
    Find the k largest elements in an array.
    Time: O(n log k) - process n elements, heap operations are log k
    Space: O(k) - we only store k elements in the heap
    """
    import heapq

    # Min-heap for k largest elements
    # Python's heapq is a min-heap by default
    min_heap = []

    for num in nums:
        # Push current number to heap
        heapq.heappush(min_heap, num)

        # If heap exceeds size k, remove smallest element
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    # Heap now contains k largest elements
    return min_heap

# Example: nums = [3, 2, 1, 5, 6, 4], k = 2
# Result: [5, 6] (the 2 largest elements)
```

```javascript
function findKLargest(nums, k) {
  /**
   * Find the k largest elements in an array.
   * Time: O(n log k) - process n elements, heap operations are log k
   * Space: O(k) - we only store k elements in the heap
   */

  // Min-heap for k largest elements
  const minHeap = new MinPriorityQueue();

  for (const num of nums) {
    minHeap.enqueue(num);

    // If heap exceeds size k, remove smallest element
    if (minHeap.size() > k) {
      minHeap.dequeue();
    }
  }

  // Extract elements from heap
  const result = [];
  while (!minHeap.isEmpty()) {
    result.push(minHeap.dequeue().element);
  }

  return result;
}

// JavaScript doesn't have built-in heap, but many interview environments
// provide priority queue implementations or expect you to implement one
```

```java
public List<Integer> findKLargest(int[] nums, int k) {
    /**
     * Find the k largest elements in an array.
     * Time: O(n log k) - process n elements, heap operations are log k
     * Space: O(k) - we only store k elements in the heap
     */

    // Min-heap for k largest elements
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int num : nums) {
        minHeap.offer(num);

        // If heap exceeds size k, remove smallest element
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }

    // Convert heap to list
    List<Integer> result = new ArrayList<>(minHeap);
    return result;
}
```

</div>

Related problems: Kth Largest Element in an Array (#215), Top K Frequent Elements (#347), Find K Pairs with Smallest Sums (#373).

### Pattern 2: Merge K Sorted Lists

When you need to merge multiple sorted sequences, the naive approach of repeatedly finding the minimum among all lists is O(nk). With a heap, you can do it in O(n log k).

The intuition: Put the first element of each list into a min-heap. Repeatedly take the smallest element from the heap, add it to your result, and push the next element from that element's source list.

<div class="code-group">

```python
def merge_k_sorted(lists):
    """
    Merge k sorted linked lists.
    Time: O(n log k) where n is total elements, k is number of lists
    Space: O(k) for the heap
    """
    import heapq

    # Min-heap stores (value, list_index, node_index)
    min_heap = []

    # Push first element from each list
    for i, lst in enumerate(lists):
        if lst:  # Check if list is not empty
            heapq.heappush(min_heap, (lst.val, i, lst))

    result = []
    while min_heap:
        val, list_idx, node = heapq.heappop(min_heap)
        result.append(val)

        # Move to next node in this list
        if node.next:
            heapq.heappush(min_heap, (node.next.val, list_idx, node.next))

    return result
```

```javascript
function mergeKLists(lists) {
  /**
   * Merge k sorted linked lists.
   * Time: O(n log k) where n is total elements, k is number of lists
   * Space: O(k) for the heap
   */

  const minHeap = new MinPriorityQueue({
    priority: (node) => node.val,
  });

  // Push first element from each list
  for (const list of lists) {
    if (list) {
      minHeap.enqueue(list);
    }
  }

  const dummy = new ListNode(0);
  let current = dummy;

  while (!minHeap.isEmpty()) {
    const node = minHeap.dequeue().element;
    current.next = node;
    current = current.next;

    if (node.next) {
      minHeap.enqueue(node.next);
    }
  }

  return dummy.next;
}
```

```java
public ListNode mergeKLists(ListNode[] lists) {
    /**
     * Merge k sorted linked lists.
     * Time: O(n log k) where n is total elements, k is number of lists
     * Space: O(k) for the heap
     */

    PriorityQueue<ListNode> minHeap = new PriorityQueue<>(
        (a, b) -> a.val - b.val
    );

    // Push first element from each list
    for (ListNode list : lists) {
        if (list != null) {
            minHeap.offer(list);
        }
    }

    ListNode dummy = new ListNode(0);
    ListNode current = dummy;

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
```

</div>

Related problems: Merge k Sorted Lists (#23), Smallest Range Covering Elements from K Lists (#632), Find Median from Data Stream (#295).

### Pattern 3: Two Heaps for Median Finding

Maintaining a running median requires balancing two heaps—a max-heap for the lower half and a min-heap for the upper half. The median is either the root of the larger heap or the average of both roots.

The intuition: Keep the heaps balanced so that their sizes differ by at most 1. The max-heap stores the smaller half of numbers, the min-heap stores the larger half. When adding a new number, decide which heap it belongs to based on comparison with the heap roots.

<div class="code-group">

```python
class MedianFinder:
    """
    Find median from data stream using two heaps.
    Time: O(log n) for addNum, O(1) for findMedian
    Space: O(n) to store all numbers
    """
    def __init__(self):
        # Max-heap for lower half (implemented as negative values in min-heap)
        self.lower = []  # max-heap (store negatives)
        # Min-heap for upper half
        self.upper = []  # min-heap

    def addNum(self, num: int) -> None:
        # Always add to lower heap first
        heapq.heappush(self.lower, -num)

        # Balance: move largest from lower to upper
        heapq.heappush(self.upper, -heapq.heappop(self.lower))

        # If upper has more elements, move smallest back to lower
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self) -> float:
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2
```

```javascript
class MedianFinder {
  constructor() {
    // Max-heap for lower half
    this.lower = new MaxPriorityQueue();
    // Min-heap for upper half
    this.upper = new MinPriorityQueue();
  }

  addNum(num) {
    // Always add to lower heap first
    this.lower.enqueue(num);

    // Balance: move largest from lower to upper
    this.upper.enqueue(this.lower.dequeue().element);

    // If upper has more elements, move smallest back to lower
    if (this.upper.size() > this.lower.size()) {
      this.lower.enqueue(this.upper.dequeue().element);
    }
  }

  findMedian() {
    if (this.lower.size() > this.upper.size()) {
      return this.lower.front().element;
    }
    return (this.lower.front().element + this.upper.front().element) / 2;
  }
}
```

```java
class MedianFinder {
    /**
     * Find median from data stream using two heaps.
     * Time: O(log n) for addNum, O(1) for findMedian
     * Space: O(n) to store all numbers
     */

    // Max-heap for lower half
    private PriorityQueue<Integer> lower;
    // Min-heap for upper half
    private PriorityQueue<Integer> upper;

    public MedianFinder() {
        lower = new PriorityQueue<>((a, b) -> b - a);  // max-heap
        upper = new PriorityQueue<>();  // min-heap
    }

    public void addNum(int num) {
        // Always add to lower heap first
        lower.offer(num);

        // Balance: move largest from lower to upper
        upper.offer(lower.poll());

        // If upper has more elements, move smallest back to lower
        if (upper.size() > lower.size()) {
            lower.offer(upper.poll());
        }
    }

    public double findMedian() {
        if (lower.size() > upper.size()) {
            return lower.peek();
        }
        return (lower.peek() + upper.peek()) / 2.0;
    }
}
```

</div>

Related problems: Find Median from Data Stream (#295), Sliding Window Median (#480), Continuous Median (not on LeetCode but common in interviews).

## When to Use Heap (Priority Queue) vs Alternatives

Recognizing when to use a heap is crucial. Here's my decision framework:

1. **Heap vs Sorting**: Use a heap when you only need partial sorting (like top K elements) and k is much smaller than n. Sorting the entire array is O(n log n), while heap gives you O(n log k). If k ≈ n, just sort.

2. **Heap vs Balanced BST**: Both support O(log n) insert/delete and O(1) min/max access. Use a heap when you only need access to the minimum or maximum (not both). Use a balanced BST (like TreeMap in Java) when you need both min and max, or need to search for arbitrary elements.

3. **Heap vs QuickSelect**: For finding the Kth element, QuickSelect gives O(n) average time but O(n²) worst case. Heap gives guaranteed O(n log k). In interviews, I usually recommend heap—it's simpler to implement correctly under pressure.

4. **Heap vs BFS/DFS**: When doing graph traversal with weighted edges (like Dijkstra's algorithm), you need a heap to always expand the node with the smallest distance. Regular BFS uses a queue (FIFO), which doesn't consider weights.

Key question to ask: "Do I need repeated access to the smallest/largest element while adding/removing elements?" If yes, heap is likely your answer.

## Edge Cases and Gotchas

1. **Empty or Null Inputs**: Always check if the input array is empty or null. For Kth element problems, what if k > array length? Return an error or specific value based on problem requirements.

2. **Heap Size Management**: When using the "Top K" pattern, maintain exactly K elements in the heap. A common mistake is letting the heap grow to size n, which defeats the purpose.

3. **Custom Comparators**: Many heap problems require custom ordering. In Java, remember that `PriorityQueue` is a min-heap by default. For max-heap, use `(a, b) -> b - a`. In Python, store negatives in a min-heap to simulate a max-heap.

4. **Integer Overflow**: When calculating sums or differences for heap keys (like in "K Pairs with Smallest Sums"), use long integers to avoid overflow.

5. **Duplicate Elements**: When finding unique top K elements, you might need to deduplicate first or adjust your heap logic to handle duplicates correctly.

## Difficulty Breakdown

The distribution—15 easy (9%), 94 medium (56%), 58 hard (35%)—tells a clear story: heaps are an intermediate-to-advanced topic. Don't waste time on all 167 problems. Here's how to prioritize:

1. **Start with the 15 easy problems** to understand basic heap operations. These are usually straightforward applications of `heapq` or `PriorityQueue`.

2. **Focus on the 30 most frequent medium problems**—these cover 80% of interview questions. Patterns like Top K Elements and Merge K Sorted appear repeatedly.

3. **Tackle hard problems only after mastering mediums**. The hard problems often combine heaps with other concepts like dynamic programming or advanced graph algorithms.

## Which Companies Ask Heap (Priority Queue)

[Google](/company/google) loves heap problems, especially ones involving streaming data or distributed systems. They often ask variations of "Find Median from Data Stream" to test system design thinking.

[Amazon](/company/amazon) frequently asks heap questions in their SDE interviews, particularly problems related to scheduling and resource allocation (like "Meeting Rooms II" #253).

[Meta](/company/meta) (Facebook) tends to ask heap problems that involve social network data, like finding top K frequent elements or merging feeds from multiple sources.

[Microsoft](/company/microsoft) often includes heap problems in their coding interviews, especially ones related to file merging or process scheduling.

[Bloomberg](/company/bloomberg) uses heap questions extensively for their financial software roles, particularly problems involving real-time data processing and top K elements from streaming financial data.

## Study Tips

1. **Implement a heap from scratch once**, then use built-in libraries forever. Understanding how heapify, bubble-up, and bubble-down work will help you debug edge cases.

2. **Practice the patterns, not just problems**. When you solve a heap problem, categorize it: "This is Top K Elements with a frequency map." This pattern recognition is what separates senior engineers from juniors.

3. **Start with these 5 problems in order**:
   - Kth Largest Element in an Array (#215) - Basic heap usage
   - Top K Frequent Elements (#347) - Heap + hash map
   - Merge k Sorted Lists (#23) - Classic heap application
   - Find Median from Data Stream (#295) - Two heaps pattern
   - Task Scheduler (#621) - Advanced heap usage

4. **Time yourself on medium problems**. Aim for 15-20 minutes including explanation. In real interviews, you need to code, test, and explain within 30-45 minutes.

Remember: The goal isn't to memorize 167 solutions. It's to recognize when a heap is the right tool and apply the appropriate pattern. When you see "Kth," "streaming," "merge multiple," or "always need min/max," think heap.

[Practice all Heap (Priority Queue) questions on CodeJeet](/topic/heap-priority-queue)
