---
title: "How to Solve Stock Price Fluctuation  — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Stock Price Fluctuation . Medium difficulty, 48.9% acceptance rate. Topics: Hash Table, Design, Heap (Priority Queue), Data Stream, Ordered Set."
date: "2027-07-13"
category: "dsa-patterns"
tags: ["stock-price-fluctuation", "hash-table", "design", "heap-(priority-queue)", "medium"]
---

# How to Solve Stock Price Fluctuation

This problem asks you to design a system that processes a stream of stock price records with timestamps, where records arrive out of order and some may be incorrect (later corrected). You need to support four operations: updating prices, retrieving current price, finding maximum price, and finding minimum price. The challenge is that prices can be corrected later, making simple tracking insufficient—you need to handle price invalidations efficiently.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Operations:**

1. `update(1, 10)` - Timestamp 1, price $10
2. `update(2, 5)` - Timestamp 2, price $5
3. `current()` - Should return 5 (latest timestamp is 2)
4. `maximum()` - Should return 10 (max of 10 and 5)
5. `update(1, 3)` - Correct timestamp 1 to price $3
6. `maximum()` - Should return 5 (max of 3 and 5)
7. `minimum()` - Should return 3 (min of 3 and 5)
8. `update(4, 2)` - Timestamp 4, price $2
9. `maximum()` - Should return 5 (max of 3, 5, 2)
10. `minimum()` - Should return 2 (min of 3, 5, 2)

The key insight: when we correct a price (like changing timestamp 1 from $10 to $3), we need to:

1. Update the current price if timestamp 1 was the latest
2. Update max/min if the old price ($10) was the current max or min

This becomes tricky because multiple timestamps can have the same price, and we need to know when a price is no longer valid for max/min calculations.

## Brute Force Approach

A naive approach would store all records in a list or dictionary and scan through all valid records for each query:

- **Update**: Simply add/update the price in a dictionary `prices[timestamp] = price`
- **Current**: Find the maximum timestamp in the dictionary keys
- **Maximum/Minimum**: Scan through all dictionary entries to find max/min price

**Why this fails:**

- `current()` requires O(n) time to find the max timestamp each time
- `maximum()` and `minimum()` require O(n) time to scan all records each time
- With many operations, this becomes O(n²) overall
- Doesn't efficiently handle price corrections for max/min

The brute force doesn't scale because we're doing linear scans for operations that should be constant or logarithmic time.

## Optimized Approach

The key insight is that we need **three data structures working together**:

1. **Dictionary/HashMap** (`timestamp -> price`): For O(1) lookups and updates
2. **Max-heap and Min-heap**: For O(log n) max/min queries
3. **Variable tracking latest timestamp**: For O(1) current price

**The tricky part:** When we update a price, the old price might still be in our heaps. We can't efficiently remove arbitrary elements from heaps. Solution: Use **lazy deletion**.

**Lazy deletion approach:**

- When we update a price, we don't remove the old price from heaps immediately
- Instead, we keep a counter of how many times each price appears in valid records
- When querying max/min, we pop from the heap until we find a price that matches our counter

**Step-by-step reasoning:**

1. **Update operation**:
   - Store the new price in the dictionary
   - If this timestamp is the latest, update the `latest_timestamp` variable
   - Increment counter for the new price (for max/min tracking)
   - If updating an existing timestamp, decrement counter for the old price
2. **Current operation**:
   - Simply return the price at `latest_timestamp` from dictionary
3. **Maximum operation**:
   - Peek at the max-heap
   - While the price at top doesn't match our counter (meaning it's stale), pop it
   - Return the valid top price
4. **Minimum operation**:
   - Same as maximum but using min-heap

This gives us O(log n) for updates and O(log n) amortized for max/min queries.

## Optimal Solution

<div class="code-group">

```python
from heapq import heappush, heappop
from collections import defaultdict

class StockPrice:
    # Time: O(log n) for update, O(log n) amortized for max/min, O(1) for current
    # Space: O(n) where n is number of unique timestamps

    def __init__(self):
        # Dictionary to store timestamp -> price
        self.timestamp_to_price = {}

        # Max heap for maximum price (store negative prices for max-heap behavior)
        self.max_heap = []

        # Min heap for minimum price
        self.min_heap = []

        # Counter for price frequencies (for lazy deletion)
        self.price_count = defaultdict(int)

        # Track the latest timestamp
        self.latest_ts = 0

    def update(self, timestamp: int, price: int) -> None:
        # Step 1: Check if this timestamp already exists
        if timestamp in self.timestamp_to_price:
            old_price = self.timestamp_to_price[timestamp]
            # Decrement counter for old price (lazy deletion marker)
            self.price_count[old_price] -= 1
            # If counter reaches 0, we can remove it from dictionary to save space
            if self.price_count[old_price] == 0:
                del self.price_count[old_price]

        # Step 2: Update the price for this timestamp
        self.timestamp_to_price[timestamp] = price

        # Step 3: Increment counter for new price
        self.price_count[price] += 1

        # Step 4: Push new price to both heaps
        heappush(self.max_heap, -price)  # Negative for max-heap
        heappush(self.min_heap, price)

        # Step 5: Update latest timestamp if needed
        if timestamp > self.latest_ts:
            self.latest_ts = timestamp

    def current(self) -> int:
        # Simply return price at latest timestamp
        return self.timestamp_to_price[self.latest_ts]

    def maximum(self) -> int:
        # Keep popping from max heap until we find a valid price
        while True:
            # Get the maximum price (stored as negative in heap)
            max_price = -self.max_heap[0]

            # Check if this price is still valid (exists in our counter)
            if max_price in self.price_count and self.price_count[max_price] > 0:
                return max_price

            # Price is stale, remove it from heap
            heappop(self.max_heap)

    def minimum(self) -> int:
        # Keep popping from min heap until we find a valid price
        while True:
            min_price = self.min_heap[0]

            # Check if this price is still valid
            if min_price in self.price_count and self.price_count[min_price] > 0:
                return min_price

            # Price is stale, remove it from heap
            heappop(self.min_heap)
```

```javascript
// Time: O(log n) for update, O(log n) amortized for max/min, O(1) for current
// Space: O(n) where n is number of unique timestamps

class StockPrice {
  constructor() {
    // Map to store timestamp -> price
    this.timestampToPrice = new Map();

    // Max heap (implemented with min heap storing negatives)
    this.maxHeap = new MinHeap((a, b) => a - b);

    // Min heap
    this.minHeap = new MinHeap((a, b) => a - b);

    // Map for price frequencies (lazy deletion)
    this.priceCount = new Map();

    // Latest timestamp
    this.latestTs = 0;
  }

  update(timestamp, price) {
    // Step 1: Handle old price if timestamp exists
    if (this.timestampToPrice.has(timestamp)) {
      const oldPrice = this.timestampToPrice.get(timestamp);
      // Decrement counter for old price
      this.priceCount.set(oldPrice, (this.priceCount.get(oldPrice) || 0) - 1);

      // Remove from map if count reaches 0
      if (this.priceCount.get(oldPrice) === 0) {
        this.priceCount.delete(oldPrice);
      }
    }

    // Step 2: Update price for this timestamp
    this.timestampToPrice.set(timestamp, price);

    // Step 3: Increment counter for new price
    this.priceCount.set(price, (this.priceCount.get(price) || 0) + 1);

    // Step 4: Add to both heaps
    this.maxHeap.push(-price); // Negative for max-heap behavior
    this.minHeap.push(price);

    // Step 5: Update latest timestamp
    if (timestamp > this.latestTs) {
      this.latestTs = timestamp;
    }
  }

  current() {
    return this.timestampToPrice.get(this.latestTs);
  }

  maximum() {
    // Keep checking until we find a valid price
    while (true) {
      const maxPrice = -this.maxHeap.peek(); // Convert back from negative
      const count = this.priceCount.get(maxPrice) || 0;

      if (count > 0) {
        return maxPrice;
      }

      // Remove stale price
      this.maxHeap.pop();
    }
  }

  minimum() {
    // Keep checking until we find a valid price
    while (true) {
      const minPrice = this.minHeap.peek();
      const count = this.priceCount.get(minPrice) || 0;

      if (count > 0) {
        return minPrice;
      }

      // Remove stale price
      this.minHeap.pop();
    }
  }
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown(0);
    return root;
  }

  peek() {
    return this.heap[0];
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let swap = null;
      let element = this.heap[index];

      if (left < length && this.comparator(this.heap[left], element) < 0) {
        swap = left;
      }

      if (right < length) {
        const comparison =
          swap === null
            ? this.comparator(this.heap[right], element)
            : this.comparator(this.heap[right], this.heap[left]);

        if (comparison < 0) {
          swap = right;
        }
      }

      if (swap === null) break;
      [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
      index = swap;
    }
  }
}
```

```java
// Time: O(log n) for update, O(log n) amortized for max/min, O(1) for current
// Space: O(n) where n is number of unique timestamps

import java.util.*;

class StockPrice {
    // Map for timestamp -> price
    private Map<Integer, Integer> timestampToPrice;

    // Max heap (using min heap with negative values)
    private PriorityQueue<Integer> maxHeap;

    // Min heap
    private PriorityQueue<Integer> minHeap;

    // Map for price frequencies (lazy deletion)
    private Map<Integer, Integer> priceCount;

    // Latest timestamp
    private int latestTs;

    public StockPrice() {
        timestampToPrice = new HashMap<>();
        maxHeap = new PriorityQueue<>((a, b) -> b - a); // Actually max heap
        minHeap = new PriorityQueue<>();
        priceCount = new HashMap<>();
        latestTs = 0;
    }

    public void update(int timestamp, int price) {
        // Step 1: Handle old price if timestamp exists
        if (timestampToPrice.containsKey(timestamp)) {
            int oldPrice = timestampToPrice.get(timestamp);
            // Decrement counter for old price
            priceCount.put(oldPrice, priceCount.get(oldPrice) - 1);

            // Remove from map if count reaches 0
            if (priceCount.get(oldPrice) == 0) {
                priceCount.remove(oldPrice);
            }
        }

        // Step 2: Update price for this timestamp
        timestampToPrice.put(timestamp, price);

        // Step 3: Increment counter for new price
        priceCount.put(price, priceCount.getOrDefault(price, 0) + 1);

        // Step 4: Add to both heaps
        maxHeap.offer(price);
        minHeap.offer(price);

        // Step 5: Update latest timestamp
        if (timestamp > latestTs) {
            latestTs = timestamp;
        }
    }

    public int current() {
        return timestampToPrice.get(latestTs);
    }

    public int maximum() {
        // Keep checking until we find a valid price
        while (true) {
            int maxPrice = maxHeap.peek();
            int count = priceCount.getOrDefault(maxPrice, 0);

            if (count > 0) {
                return maxPrice;
            }

            // Remove stale price
            maxHeap.poll();
        }
    }

    public int minimum() {
        // Keep checking until we find a valid price
        while (true) {
            int minPrice = minHeap.peek();
            int count = priceCount.getOrDefault(minPrice, 0);

            if (count > 0) {
                return minPrice;
            }

            // Remove stale price
            minHeap.poll();
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `update()`: O(log n) for heap operations (push to two heaps)
- `current()`: O(1) dictionary lookup
- `maximum()`/`minimum()`: O(log n) amortized. In worst case we might pop multiple stale prices, but each price is pushed once and popped once, so amortized O(log n) per operation.

**Space Complexity:** O(n) where n is the number of unique timestamps. We store:

- n entries in `timestamp_to_price`
- Up to 2n entries across both heaps (each price appears in both heaps)
- Up to n entries in `price_count` (unique prices)

## Common Mistakes

1. **Forgetting to handle price corrections in heaps**: The most common mistake is updating the dictionary but not updating heaps, or trying to remove specific elements from heaps (which is O(n)). Lazy deletion is the key.

2. **Not tracking latest timestamp efficiently**: Some candidates try to find max timestamp by scanning all keys O(n) for each `current()` call. We need to maintain it as a variable.

3. **Race conditions with same price multiple times**: If two timestamps have the same price, and one gets corrected, we can't remove that price from heaps entirely. The counter approach handles this correctly.

4. **Infinite loops in max/min methods**: Forgetting to pop stale prices from heaps can cause infinite loops. Always include the pop operation when you find a stale price.

## When You'll See This Pattern

This **heap with lazy deletion** pattern appears whenever you need to maintain running max/min with updates and deletions:

1. **Sliding Window Maximum** (Hard): Maintain max in a sliding window using deque (similar to heap with immediate deletion)
2. **Find Median from Data Stream** (Hard): Use two heaps to maintain median with add operations
3. **Top K Frequent Elements** (Medium): Use heap to track top K frequencies
4. **Time Based Key-Value Store** (Medium): Similar timestamp-based retrieval but with binary search instead of heaps

The pattern is: when you need efficient max/min with dynamic updates, think "heap with lazy deletion" if you can't efficiently remove arbitrary elements.

## Key Takeaways

1. **Lazy deletion is powerful**: When you can't efficiently remove elements from a heap, mark them as invalid and clean them up when they surface at the top. This gives amortized O(log n) operations.

2. **Combine multiple data structures**: Complex problems often require combining hash maps (for O(1) lookups) with heaps (for O(log n) max/min) and variables (for O(1) current state).

3. **Count frequencies for duplicate handling**: When the same value can appear multiple times and you need to know when all instances are gone, use a counter map rather than trying to track individual instances.

Related problems: [Time Based Key-Value Store](/problem/time-based-key-value-store)
