---
title: "How to Solve Sequentially Ordinal Rank Tracker — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sequentially Ordinal Rank Tracker. Hard difficulty, 61.5% acceptance rate. Topics: Design, Heap (Priority Queue), Data Stream, Ordered Set."
date: "2029-11-10"
category: "dsa-patterns"
tags:
  ["sequentially-ordinal-rank-tracker", "design", "heap-(priority-queue)", "data-stream", "hard"]
---

# How to Solve Sequentially Ordinal Rank Tracker

This problem asks us to design a system that tracks scenic locations with unique names and attractiveness scores, supporting two operations: adding new locations and retrieving the "best" location in a specific sequential order. The twist is that "best" is defined by the highest score (with lexicographically smallest name breaking ties), but we need to retrieve them in increasing order of "bestness" - meaning the first call gets the absolute best, the second call gets the second best, and so on. This sequential retrieval pattern while still allowing new insertions is what makes this problem challenging and interesting.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Suppose we perform these operations:

1. `add("bradford", 2)`
2. `add("branford", 3)`
3. `get()` → should return "branford" (score 3 > score 2)
4. `add("alps", 2)`
5. `get()` → should return "alps" (score 2 ties with bradford, but "alps" < "bradford" lexicographically)
6. `add("orland", 2)`
7. `get()` → should return "bradford" (remaining score 2 location, "bradford" < "orland")
8. `get()` → should return "orland" (last remaining location)

The key insight: after each `get()` call, we need to know what the _next_ best location is, but we also need to handle new locations being added that might be better than some we haven't retrieved yet.

Think of it like maintaining two groups:

- **Already retrieved locations** (we don't care about these anymore)
- **Not yet retrieved locations** (we need quick access to the best one)
- **Potential future additions** (new locations that might be better than some not-yet-retrieved ones)

The challenge is that when we add a new location, it could be:

- Better than all not-yet-retrieved locations → becomes the new "next" to return
- Worse than some not-yet-retrieved locations → gets queued behind them
- Equal to some not-yet-retrieved locations → needs proper tie-breaking

## Brute Force Approach

A naive approach would be to store all locations in an array or list. For each `add()` operation, we simply append to the list (O(1)). For each `get()` operation, we:

1. Sort the list by score descending, then name ascending (O(n log n))
2. Return the first element
3. Remove it from the list (O(n) for shifting elements)

This gives us O(n log n) time per `get()` call, which is too slow when we have many operations. Even if we maintain a sorted list and use binary search for inserts (O(log n) to find position + O(n) to insert), the `get()` would still be O(n) for removal.

What about storing locations in a max-heap? A max-heap by score (with custom comparator for names) would give us O(log n) for `add()` and O(log n) for removing the max. But we can't efficiently get the "next" max after removing one without rebuilding the heap or maintaining a separate structure.

The fundamental issue: we need to support two different orderings simultaneously:

1. Insertion order for `get()` calls (sequential retrieval)
2. Score/name ordering for determining what's "next best"

## Optimized Approach

The key insight is to use **two heaps** (or priority queues) working together, similar to the "Find Median from Data Stream" problem, but with a different balancing strategy.

Here's the optimal approach:

1. **Maintain two priority queues:**
   - `minHeap`: A min-heap containing locations we _haven't_ retrieved yet, ordered by (score ascending, name descending)
   - `maxHeap`: A max-heap containing locations we _have_ retrieved or are "candidates" for next retrieval, ordered by (score descending, name ascending)

2. **Why this ordering works:**
   - `minHeap` stores the "worst" of the not-yet-retrieved locations at the top
   - `maxHeap` stores the "best" candidate for next retrieval at the top
   - The next location to return is always at the top of `maxHeap`

3. **The invariant:** After any operation, `maxHeap` should contain exactly one more element than the number of `get()` calls made so far. This ensures the top of `maxHeap` is always the correct next location to return.

4. **Operations:**
   - `add(name, score)`: Add to `maxHeap`. If `maxHeap` has too many elements (more than gets + 1), move the "worst" one from `maxHeap` to `minHeap`.
   - `get()`: The result is the top of `maxHeap`. After popping it, if `minHeap` has elements, move the "best" one from `minHeap` to `maxHeap` to maintain the invariant.

5. **Alternative approach:** We could also use a balanced binary search tree (like TreeSet in Java) to maintain all locations in sorted order, giving us O(log n) for both operations. However, the two-heap approach is more commonly taught and has the same time complexity.

## Optimal Solution

Here's the complete implementation using two heaps:

<div class="code-group">

```python
class Location:
    def __init__(self, name: str, score: int):
        self.name = name
        self.score = score

    # For maxHeap: higher score first, then lexicographically smaller name
    def __lt__(self, other):
        if self.score == other.score:
            return self.name < other.name
        return self.score > other.score

    # For minHeap: lower score first, then lexicographically larger name
    @staticmethod
    def min_heap_comparator(a, b):
        if a.score == b.score:
            return a.name > b.name  # Reverse name order for min-heap
        return a.score < b.score

class SORTracker:
    # Time: O(log n) per operation | Space: O(n)

    def __init__(self):
        # maxHeap stores candidates for next retrieval (best at top)
        self.maxHeap = []
        # minHeap stores locations not yet ready for retrieval (worst at top)
        self.minHeap = []
        self.getCount = 0  # Number of get() calls made so far

    def add(self, name: str, score: int) -> None:
        """Add a new location to the tracker."""
        location = Location(name, score)

        # First, add to maxHeap (candidate for next retrieval)
        heapq.heappush(self.maxHeap, location)

        # If maxHeap has more elements than it should (gets + 1),
        # move the worst from maxHeap to minHeap
        if len(self.maxHeap) > self.getCount + 1:
            # The "worst" in maxHeap is actually at the bottom of the heap,
            # so we need to pop and push to maintain heap property
            worst = heapq.heappop(self.maxHeap)
            heapq.heappush(self.minHeap, worst)

    def get(self) -> str:
        """Get the next best location in sequence."""
        # The next location is at the top of maxHeap
        result = self.maxHeap[0].name

        # Move this location out of maxHeap since it's now "retrieved"
        heapq.heappop(self.maxHeap)
        self.getCount += 1

        # If there are locations in minHeap, bring the best one to maxHeap
        if self.minHeap:
            best_from_min = heapq.heappop(self.minHeap)
            heapq.heappush(self.maxHeap, best_from_min)

        return result
```

```javascript
class Location {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}

class SORTracker {
  // Time: O(log n) per operation | Space: O(n)
  constructor() {
    // Max heap for candidates (best at top)
    // Comparator: higher score first, then lexicographically smaller name
    this.maxHeap = new MaxHeap((a, b) => {
      if (a.score === b.score) {
        return a.name < b.name ? 1 : -1;
      }
      return a.score - b.score;
    });

    // Min heap for not-yet-retrieved locations (worst at top)
    // Comparator: lower score first, then lexicographically larger name
    this.minHeap = new MinHeap((a, b) => {
      if (a.score === b.score) {
        return a.name > b.name ? 1 : -1;
      }
      return b.score - a.score;
    });

    this.getCount = 0; // Number of get() calls made
  }

  add(name, score) {
    const location = new Location(name, score);

    // Add to maxHeap first
    this.maxHeap.push(location);

    // If maxHeap has too many elements, move worst to minHeap
    if (this.maxHeap.size() > this.getCount + 1) {
      const worst = this.maxHeap.pop();
      this.minHeap.push(worst);
    }
  }

  get() {
    // Next location is at top of maxHeap
    const result = this.maxHeap.peek().name;

    // Remove it since it's now retrieved
    this.maxHeap.pop();
    this.getCount++;

    // Bring best from minHeap to maxHeap if available
    if (this.minHeap.size() > 0) {
      const bestFromMin = this.minHeap.pop();
      this.maxHeap.push(bestFromMin);
    }

    return result;
  }
}

// Helper classes for heaps in JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return root;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) < 0) {
        [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
        index = parent;
      } else {
        break;
      }
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let swap = null;
      let smallest = index;

      if (left < length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

class MaxHeap extends MinHeap {
  constructor(comparator) {
    super((a, b) => -comparator(a, b));
  }
}
```

```java
class Location {
    String name;
    int score;

    public Location(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

class SORTracker {
    // Time: O(log n) per operation | Space: O(n)

    // Max heap for candidates (best at top)
    // Comparator: higher score first, then lexicographically smaller name
    private PriorityQueue<Location> maxHeap;

    // Min heap for not-yet-retrieved locations (worst at top)
    // Comparator: lower score first, then lexicographically larger name
    private PriorityQueue<Location> minHeap;

    private int getCount; // Number of get() calls made

    public SORTracker() {
        maxHeap = new PriorityQueue<>((a, b) -> {
            if (a.score == b.score) {
                return a.name.compareTo(b.name);
            }
            return b.score - a.score; // Higher score first
        });

        minHeap = new PriorityQueue<>((a, b) -> {
            if (a.score == b.score) {
                return b.name.compareTo(a.name); // Reverse name order
            }
            return a.score - b.score; // Lower score first
        });

        getCount = 0;
    }

    public void add(String name, int score) {
        Location location = new Location(name, score);

        // Add to maxHeap first
        maxHeap.offer(location);

        // If maxHeap has too many elements, move worst to minHeap
        if (maxHeap.size() > getCount + 1) {
            Location worst = maxHeap.poll();
            minHeap.offer(worst);
        }
    }

    public String get() {
        // Next location is at top of maxHeap
        String result = maxHeap.peek().name;

        // Remove it since it's now retrieved
        maxHeap.poll();
        getCount++;

        // Bring best from minHeap to maxHeap if available
        if (!minHeap.isEmpty()) {
            Location bestFromMin = minHeap.poll();
            maxHeap.offer(bestFromMin);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `add(name, score)`: O(log n) - Each location is pushed to a heap at most twice (once to maxHeap, possibly once to minHeap), and heap operations are O(log n).
- `get()`: O(log n) - Involves popping from maxHeap and possibly pushing/popping from minHeap, all O(log n) operations.

**Space Complexity:** O(n) - We store each location in at least one of the heaps, and potentially in both temporarily during transfers. In the worst case, all locations are in either maxHeap or minHeap, giving us O(n) space.

The logarithmic time complexity comes from the heap operations. Each heap maintains the heap property through comparisons that take O(1) time, and the height of a binary heap with n elements is O(log n).

## Common Mistakes

1. **Wrong comparator logic:** The tie-breaking condition is subtle. When scores are equal, we need lexicographically smaller names to be considered "better." In a max-heap for best candidates, this means when scores are equal, `name1 < name2` should make `name1` come first. In a min-heap for worst candidates, it's the opposite.

2. **Forgetting to maintain the invariant:** The key to this solution is maintaining that `maxHeap.size() == getCount + 1` after each operation. If you don't check `if (maxHeap.size() > getCount + 1)` in the `add()` method, the algorithm breaks because `maxHeap` might contain locations that shouldn't be candidates yet.

3. **Not handling the transfer between heaps correctly:** After a `get()` call, you must check if `minHeap` has elements to transfer to `maxHeap`. If you skip this, `maxHeap` might become empty even though there are still locations to retrieve.

4. **Using a single heap incorrectly:** Some candidates try to use just one heap and maintain a pointer to the "current" best. This fails because when you add a new location that's better than some not-yet-retrieved ones, you need to adjust what "current" means.

## When You'll See This Pattern

The two-heap pattern is powerful for problems that require maintaining dynamic order statistics, especially when you need to efficiently access different percentiles of a changing dataset:

1. **Find Median from Data Stream (Hard)** - The classic two-heap problem where you maintain a max-heap for the lower half and a min-heap for the upper half of numbers, with the median always at the interface.

2. **Kth Largest Element in a Stream (Easy)** - While often solved with a single min-heap of size k, it's conceptually similar in that you're maintaining a boundary between "top k" and "the rest."

3. **Finding MK Average (Hard)** - Requires maintaining the smallest k, middle (m-2k), and largest k elements, which extends the two-heap idea to three segments.

The pattern is recognizable when you need to:

- Maintain a "boundary" in a sorted sequence
- Support both additions and queries about order statistics
- Handle data arriving in a stream where you can't afford to re-sort

## Key Takeaways

1. **Two heaps can maintain a dynamic partition** of data into "above" and "below" some boundary, which is perfect for order statistic problems with streaming data.

2. **The comparator is crucial** - Pay close attention to tie-breaking conditions and whether you need ascending or descending order for each part of your solution.

3. **Invariants make complex logic manageable** - By strictly maintaining `maxHeap.size() == getCount + 1`, we simplify the reasoning about which location should be returned next, even as new locations are added.

This problem teaches how to think about maintaining not just the current answer, but the structure needed to efficiently update that answer as new data arrives - a common requirement in system design and real-time data processing.

Related problems: [Find Median from Data Stream](/problem/find-median-from-data-stream), [Kth Largest Element in a Stream](/problem/kth-largest-element-in-a-stream), [Finding MK Average](/problem/finding-mk-average)
