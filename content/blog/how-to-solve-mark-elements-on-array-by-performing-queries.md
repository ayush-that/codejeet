---
title: "How to Solve Mark Elements on Array by Performing Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Mark Elements on Array by Performing Queries. Medium difficulty, 49.1% acceptance rate. Topics: Array, Hash Table, Sorting, Heap (Priority Queue), Simulation."
date: "2029-10-02"
category: "dsa-patterns"
tags: ["mark-elements-on-array-by-performing-queries", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Mark Elements on Array by Performing Queries

This problem asks us to process queries that mark elements in an array based on their values, while tracking the sum of unmarked elements after each query. The challenge comes from needing to efficiently find the smallest unmarked elements to mark, which changes dynamically as queries are processed. The key insight is recognizing this as a "k smallest elements" problem that evolves over time.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums = [1, 2, 2, 3, 4]
queries = [[0, 2], [1, 1], [2, 1]]
```

**Step 1:** All elements are initially unmarked. Unmarked sum = 1 + 2 + 2 + 3 + 4 = 12

**Query 1:** `[0, 2]` - Mark the 2 smallest unmarked elements starting from index 0

- At index 0: value 1 (smallest unmarked)
- At index 1: value 2 (next smallest)
- Mark elements at indices 0 and 1
- Unmarked elements now: [2, 3, 4] → sum = 9
- Output: 9

**Query 2:** `[1, 1]` - Mark the 1 smallest unmarked element starting from index 1

- Unmarked elements starting from index 1: [2, 3, 4]
- Smallest is 2 at index 2
- Mark element at index 2
- Unmarked elements now: [3, 4] → sum = 7
- Output: 7

**Query 3:** `[2, 1]` - Mark the 1 smallest unmarked element starting from index 2

- Unmarked elements starting from index 2: [3, 4]
- Smallest is 3 at index 3
- Mark element at index 3
- Unmarked elements now: [4] → sum = 4
- Output: 4

**Final answer:** `[9, 7, 4]`

The tricky part is efficiently finding the k smallest unmarked elements in the subarray starting from a given index.

## Brute Force Approach

A naive solution would be to simulate the process exactly as described:

1. Maintain a boolean array to track marked elements
2. For each query:
   - Find all unmarked elements from the starting index onward
   - Sort them by value (and index for ties)
   - Mark the first k elements
   - Calculate the sum of remaining unmarked elements

<div class="code-group">

```python
# Time: O(m * n log n) | Space: O(n)
def bruteForce(nums, queries):
    n = len(nums)
    marked = [False] * n
    answer = []

    for start_idx, k in queries:
        # Collect unmarked elements from start_idx onward
        candidates = []
        for i in range(start_idx, n):
            if not marked[i]:
                candidates.append((nums[i], i))  # (value, index)

        # Sort by value, then by index for ties
        candidates.sort()

        # Mark the k smallest elements
        for j in range(min(k, len(candidates))):
            _, idx = candidates[j]
            marked[idx] = True

        # Calculate sum of unmarked elements
        total = 0
        for i in range(n):
            if not marked[i]:
                total += nums[i]

        answer.append(total)

    return answer
```

```javascript
// Time: O(m * n log n) | Space: O(n)
function bruteForce(nums, queries) {
  const n = nums.length;
  const marked = new Array(n).fill(false);
  const answer = [];

  for (const [startIdx, k] of queries) {
    // Collect unmarked elements from startIdx onward
    const candidates = [];
    for (let i = startIdx; i < n; i++) {
      if (!marked[i]) {
        candidates.push([nums[i], i]); // [value, index]
      }
    }

    // Sort by value, then by index for ties
    candidates.sort((a, b) => {
      if (a[0] !== b[0]) return a[0] - b[0];
      return a[1] - b[1];
    });

    // Mark the k smallest elements
    const markCount = Math.min(k, candidates.length);
    for (let j = 0; j < markCount; j++) {
      const idx = candidates[j][1];
      marked[idx] = true;
    }

    // Calculate sum of unmarked elements
    let total = 0;
    for (let i = 0; i < n; i++) {
      if (!marked[i]) {
        total += nums[i];
      }
    }

    answer.push(total);
  }

  return answer;
}
```

```java
// Time: O(m * n log n) | Space: O(n)
public List<Long> bruteForce(int[] nums, int[][] queries) {
    int n = nums.length;
    boolean[] marked = new boolean[n];
    List<Long> answer = new ArrayList<>();

    for (int[] query : queries) {
        int startIdx = query[0];
        int k = query[1];

        // Collect unmarked elements from startIdx onward
        List<int[]> candidates = new ArrayList<>();
        for (int i = startIdx; i < n; i++) {
            if (!marked[i]) {
                candidates.add(new int[]{nums[i], i});
            }
        }

        // Sort by value, then by index for ties
        candidates.sort((a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
            return Integer.compare(a[1], b[1]);
        });

        // Mark the k smallest elements
        int markCount = Math.min(k, candidates.size());
        for (int j = 0; j < markCount; j++) {
            int idx = candidates.get(j)[1];
            marked[idx] = true;
        }

        // Calculate sum of unmarked elements
        long total = 0;
        for (int i = 0; i < n; i++) {
            if (!marked[i]) {
                total += nums[i];
            }
        }

        answer.add(total);
    }

    return answer;
}
```

</div>

**Why this is inefficient:**

- Sorting candidates for each query takes O(n log n) time
- Recalculating the total sum from scratch each time takes O(n) time
- With m queries, this becomes O(m × n log n), which is too slow for the constraints (n, m up to 10^5)

## Optimized Approach

The key insight is that we need to efficiently:

1. Find the k smallest unmarked elements in a range
2. Update which elements are marked
3. Maintain the running sum of unmarked elements

**Core observations:**

1. We can pre-sort all elements by (value, index) once at the beginning
2. We need a way to skip already marked elements when processing queries
3. We can maintain a running total and subtract values as elements get marked

**Optimal strategy:**

1. **Preprocessing:** Create an array of (value, index) pairs sorted by value (then index for ties)
2. **Pointer tracking:** Use a pointer to walk through the sorted array, skipping marked elements
3. **Range checking:** For each query, we need elements starting from a specific index, so we need to check both value ordering AND index constraint
4. **Efficient marking:** Use a set or boolean array to track marked elements
5. **Running sum:** Start with total sum of all elements, subtract values as they get marked

The challenge is efficiently finding elements that satisfy both conditions: being among the k smallest unmarked values AND having index ≥ start_idx.

## Optimal Solution

We use a min-heap (priority queue) to efficiently find the smallest unmarked elements that satisfy the index constraint. The heap stores (value, index) pairs, and we add elements to it as we encounter valid starting positions.

<div class="code-group">

```python
# Time: O((n + m) log n) | Space: O(n)
def unmarkedSumArray(nums, queries):
    n = len(nums)
    total_sum = sum(nums)  # Track sum of all unmarked elements
    marked = [False] * n   # Track which indices are marked

    # Create list of (value, index) pairs and sort by value, then index
    # This gives us the global order of smallest elements
    sorted_pairs = sorted([(nums[i], i) for i in range(n)])

    # Pointer to track our position in sorted_pairs
    ptr = 0

    # Min-heap for elements that are valid for current query
    # (elements with index >= current start_idx)
    import heapq
    heap = []

    answer = []

    for start_idx, k in queries:
        # Add all new elements that become valid (index >= start_idx)
        # and are not yet marked, to the heap
        while ptr < n and sorted_pairs[ptr][1] < start_idx:
            ptr += 1

        # Push valid unmarked elements onto heap
        while ptr < n and len(heap) < k and not marked[sorted_pairs[ptr][1]]:
            value, idx = sorted_pairs[ptr]
            heapq.heappush(heap, (value, idx))
            ptr += 1

        # Mark k smallest elements from heap
        marked_count = 0
        while marked_count < k and heap:
            value, idx = heapq.heappop(heap)

            # Skip if already marked (can happen if element was added earlier)
            if marked[idx]:
                continue

            # Mark this element
            marked[idx] = True
            total_sum -= value
            marked_count += 1

        # Continue adding more elements to heap if we need more
        while ptr < n and marked_count < k:
            value, idx = sorted_pairs[ptr]
            ptr += 1

            # Skip if already marked or index < start_idx
            if marked[idx] or idx < start_idx:
                continue

            # Mark this element
            marked[idx] = True
            total_sum -= value
            marked_count += 1

        answer.append(total_sum)

    return answer
```

```javascript
// Time: O((n + m) log n) | Space: O(n)
function unmarkedSumArray(nums, queries) {
  const n = nums.length;
  let totalSum = nums.reduce((a, b) => a + b, 0); // Sum of all unmarked elements
  const marked = new Array(n).fill(false); // Track marked indices

  // Create array of [value, index] pairs and sort by value, then index
  const sortedPairs = nums.map((value, index) => [value, index]);
  sortedPairs.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  // Pointer to track position in sortedPairs
  let ptr = 0;

  // Min-heap for valid elements (index >= current start_idx)
  const heap = new MinHeap();

  const answer = [];

  for (const [startIdx, k] of queries) {
    // Skip pairs with index < start_idx
    while (ptr < n && sortedPairs[ptr][1] < startIdx) {
      ptr++;
    }

    // Add valid unmarked elements to heap
    while (ptr < n && heap.size() < k && !marked[sortedPairs[ptr][1]]) {
      const [value, idx] = sortedPairs[ptr];
      heap.push([value, idx]);
      ptr++;
    }

    // Mark k smallest elements from heap
    let markedCount = 0;
    while (markedCount < k && heap.size() > 0) {
      const [value, idx] = heap.pop();

      // Skip if already marked
      if (marked[idx]) continue;

      // Mark this element
      marked[idx] = true;
      totalSum -= value;
      markedCount++;
    }

    // Continue adding more elements if needed
    while (ptr < n && markedCount < k) {
      const [value, idx] = sortedPairs[ptr];
      ptr++;

      // Skip if already marked or index < startIdx
      if (marked[idx] || idx < startIdx) continue;

      // Mark this element
      marked[idx] = true;
      totalSum -= value;
      markedCount++;
    }

    answer.push(totalSum);
  }

  return answer;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }

  bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (
        this.heap[parent][0] > this.heap[idx][0] ||
        (this.heap[parent][0] === this.heap[idx][0] && this.heap[parent][1] > this.heap[idx][1])
      ) {
        [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
        idx = parent;
      } else {
        break;
      }
    }
  }

  bubbleDown(idx) {
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (
        left < this.heap.length &&
        (this.heap[left][0] < this.heap[smallest][0] ||
          (this.heap[left][0] === this.heap[smallest][0] &&
            this.heap[left][1] < this.heap[smallest][1]))
      ) {
        smallest = left;
      }

      if (
        right < this.heap.length &&
        (this.heap[right][0] < this.heap[smallest][0] ||
          (this.heap[right][0] === this.heap[smallest][0] &&
            this.heap[right][1] < this.heap[smallest][1]))
      ) {
        smallest = right;
      }

      if (smallest !== idx) {
        [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
        idx = smallest;
      } else {
        break;
      }
    }
  }
}
```

```java
// Time: O((n + m) log n) | Space: O(n)
public List<Long> unmarkedSumArray(int[] nums, int[][] queries) {
    int n = nums.length;
    long totalSum = 0;
    for (int num : nums) totalSum += num;  // Sum of all unmarked elements

    boolean[] marked = new boolean[n];     // Track marked indices

    // Create array of pairs and sort by value, then index
    int[][] sortedPairs = new int[n][2];
    for (int i = 0; i < n; i++) {
        sortedPairs[i][0] = nums[i];  // value
        sortedPairs[i][1] = i;        // index
    }

    Arrays.sort(sortedPairs, (a, b) -> {
        if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
        return Integer.compare(a[1], b[1]);
    });

    // Pointer to track position in sortedPairs
    int ptr = 0;

    // Min-heap for valid elements (index >= current startIdx)
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
        if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
        return Integer.compare(a[1], b[1]);
    });

    List<Long> answer = new ArrayList<>();

    for (int[] query : queries) {
        int startIdx = query[0];
        int k = query[1];

        // Skip pairs with index < startIdx
        while (ptr < n && sortedPairs[ptr][1] < startIdx) {
            ptr++;
        }

        // Add valid unmarked elements to heap
        while (ptr < n && heap.size() < k && !marked[sortedPairs[ptr][1]]) {
            heap.offer(sortedPairs[ptr]);
            ptr++;
        }

        // Mark k smallest elements from heap
        int markedCount = 0;
        while (markedCount < k && !heap.isEmpty()) {
            int[] pair = heap.poll();
            int value = pair[0];
            int idx = pair[1];

            // Skip if already marked
            if (marked[idx]) continue;

            // Mark this element
            marked[idx] = true;
            totalSum -= value;
            markedCount++;
        }

        // Continue adding more elements if needed
        while (ptr < n && markedCount < k) {
            int value = sortedPairs[ptr][0];
            int idx = sortedPairs[ptr][1];
            ptr++;

            // Skip if already marked or index < startIdx
            if (marked[idx] || idx < startIdx) continue;

            // Mark this element
            marked[idx] = true;
            totalSum -= value;
            markedCount++;
        }

        answer.add(totalSum);
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + m) log n)

- Sorting the pairs: O(n log n)
- Each element is pushed to and popped from the heap at most once: O(n log n)
- Processing m queries with heap operations: O(m log n)
- Total: O((n + m) log n)

**Space Complexity:** O(n)

- Storing sorted pairs: O(n)
- Heap: O(n) in worst case
- Marked array: O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle index constraints:** The query specifies "starting from index i", so we can't just take the globally smallest unmarked elements. We must ensure the element's index ≥ start_idx.

2. **Not updating the running sum efficiently:** Recalculating the sum from scratch for each query gives O(m × n) time. Instead, maintain a running total and subtract values as elements get marked.

3. **Incorrect tie-breaking:** When values are equal, we need to mark the element with the smaller index first. This requires careful comparison in sorting and heap operations.

4. **Heap containing already-marked elements:** When we pop from the heap, we must check if the element is still unmarked, as it might have been marked by a previous query.

5. **Off-by-one with pointer advancement:** The pointer `ptr` should only advance when we've processed an element (either added to heap or marked). Skipping elements incorrectly can cause us to miss valid candidates.

## When You'll See This Pattern

This problem combines several important patterns:

1. **K Smallest Elements with Constraints:** Similar to "Find K Pairs with Smallest Sums" (LeetCode 373) where you need the k smallest combinations subject to constraints.

2. **Dynamic Selection with Priority Queue:** Like "Process Tasks Using Servers" (LeetCode 1882) where you need to select available resources based on multiple criteria.

3. **Range Queries with Updates:** Related to "Range Sum Query - Mutable" (LeetCode 307) but with the twist of marking elements instead of updating values.

The core technique of using a heap to dynamically select elements while maintaining constraints appears in scheduling problems, resource allocation, and any scenario where you need to repeatedly find "best" elements according to changing criteria.

## Key Takeaways

1. **Heaps are ideal for dynamic k-smallest problems:** When you need to repeatedly find the smallest elements from a changing set, a min-heap provides efficient O(log n) insertions and removals.

2. **Pre-sort when you can:** If the order doesn't change (like element values here), sort once upfront and use pointers to traverse efficiently.

3. **Maintain running aggregates:** Instead of recalculating sums or counts, update them incrementally as the state changes. This often turns O(n) operations into O(1).

4. **Watch for stale data in heaps:** When using heaps for dynamic selection, elements in the heap may become invalid (like already-marked elements). Always check validity when popping.

[Practice this problem on CodeJeet](/problem/mark-elements-on-array-by-performing-queries)
