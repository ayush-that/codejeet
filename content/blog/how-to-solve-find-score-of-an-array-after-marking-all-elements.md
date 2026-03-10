---
title: "How to Solve Find Score of an Array After Marking All Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Score of an Array After Marking All Elements. Medium difficulty, 64.5% acceptance rate. Topics: Array, Hash Table, Sorting, Heap (Priority Queue), Simulation."
date: "2026-11-22"
category: "dsa-patterns"
tags:
  ["find-score-of-an-array-after-marking-all-elements", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Find Score of an Array After Marking All Elements

You’re given an array of positive integers and need to simulate a marking process: repeatedly pick the smallest unmarked number (with smallest index on ties), add it to a running score, and mark it along with its immediate neighbors. The challenge is to efficiently track which elements are still available while respecting the marking rules. What makes this interesting is that marking neighbors changes which elements remain eligible, so a simple sort isn’t enough—you need to simulate the process while efficiently skipping already-marked elements.

## Visual Walkthrough

Let’s trace through `nums = [2,1,3,4,5,2]` step by step.

**Initial state:** All elements unmarked. Score = 0.

**Step 1:** Find smallest unmarked element. The smallest value is `1` at index 1. Add `1` to score → score = 1. Mark index 1 and its neighbors (indices 0 and 2). Marked indices: {0, 1, 2}.

**Step 2:** Remaining unmarked indices: {3, 4, 5}. Smallest value is `2` at index 5 (value 2 at index 5 vs 4 at index 3, 5 at index 4). Add `2` to score → score = 3. Mark index 5 and neighbor index 4. Marked indices: {0, 1, 2, 4, 5}.

**Step 3:** Remaining unmarked index: {3}. Smallest (and only) value is `4` at index 3. Add `4` to score → score = 7. Mark index 3 and neighbor index 2 (already marked). Marked indices: {0, 1, 2, 3, 4, 5}.

All indices are now marked. Final score = 7.

The key observation: after marking an element and its neighbors, we need to quickly find the next smallest unmarked element. A brute force scan each time would be too slow for large arrays.

## Brute Force Approach

A naive solution would simulate the process exactly as described:

1. Keep a boolean array `marked` of size `n`.
2. Repeat until all elements are marked:
   - Scan through the array to find the smallest unmarked value (with smallest index on ties).
   - Add that value to score.
   - Mark that index and its left/right neighbors (if they exist).
3. Return the score.

This approach is straightforward but inefficient. In the worst case (e.g., all elements distinct), each iteration scans O(n) elements to find the smallest unmarked one, and we have O(n) iterations (marking ~3 elements per iteration). That’s O(n²) time complexity, which is too slow for n up to 10⁵.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def findScoreBruteForce(nums):
    n = len(nums)
    marked = [False] * n
    score = 0

    while True:
        # Find smallest unmarked element
        min_val = float('inf')
        min_idx = -1
        for i in range(n):
            if not marked[i] and nums[i] < min_val:
                min_val = nums[i]
                min_idx = i

        # If no unmarked elements, we're done
        if min_idx == -1:
            break

        # Add to score and mark
        score += min_val
        marked[min_idx] = True
        if min_idx > 0:
            marked[min_idx - 1] = True
        if min_idx < n - 1:
            marked[min_idx + 1] = True

    return score
```

```javascript
// Time: O(n²) | Space: O(n)
function findScoreBruteForce(nums) {
  const n = nums.length;
  const marked = new Array(n).fill(false);
  let score = 0;

  while (true) {
    // Find smallest unmarked element
    let minVal = Infinity;
    let minIdx = -1;
    for (let i = 0; i < n; i++) {
      if (!marked[i] && nums[i] < minVal) {
        minVal = nums[i];
        minIdx = i;
      }
    }

    // If no unmarked elements, we're done
    if (minIdx === -1) break;

    // Add to score and mark
    score += minVal;
    marked[minIdx] = true;
    if (minIdx > 0) marked[minIdx - 1] = true;
    if (minIdx < n - 1) marked[minIdx + 1] = true;
  }

  return score;
}
```

```java
// Time: O(n²) | Space: O(n)
public long findScoreBruteForce(int[] nums) {
    int n = nums.length;
    boolean[] marked = new boolean[n];
    long score = 0;

    while (true) {
        // Find smallest unmarked element
        int minVal = Integer.MAX_VALUE;
        int minIdx = -1;
        for (int i = 0; i < n; i++) {
            if (!marked[i] && nums[i] < minVal) {
                minVal = nums[i];
                minIdx = i;
            }
        }

        // If no unmarked elements, we're done
        if (minIdx == -1) break;

        // Add to score and mark
        score += minVal;
        marked[minIdx] = true;
        if (minIdx > 0) marked[minIdx - 1] = true;
        if (minIdx < n - 1) marked[minIdx + 1] = true;
    }

    return score;
}
```

</div>

## Optimized Approach

The bottleneck is repeatedly finding the smallest unmarked element. We need a data structure that:

1. Lets us quickly get the smallest element.
2. Allows us to skip elements that have been marked.

A **min-heap (priority queue)** is perfect for this. We store pairs `(value, index)` in the heap, sorted by value then index. However, when we mark neighbors, we don't remove their entries from the heap—we just ignore them when they pop out if they're already marked.

**Key insight:** We can use a `marked` array to track which indices are already processed. When we pop from the heap, if the index is already marked, we skip it. This is efficient because each element enters the heap once and gets popped at most once.

**Algorithm:**

1. Create a min-heap and push all `(nums[i], i)` pairs.
2. Initialize `marked` array and `score = 0`.
3. While heap is not empty:
   - Pop the smallest `(value, index)`.
   - If `index` is already marked, skip (continue).
   - Otherwise, add `value` to score, mark this index and its neighbors.
4. Return score.

**Why this works:** The heap always gives us the smallest available element. By skipping already-marked elements when they pop, we ensure we only process each element once. Marking neighbors when we process an element prevents them from being chosen later.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def findScore(nums):
    n = len(nums)
    import heapq

    # Create a min-heap of (value, index) pairs
    # Python's heapq sorts by first element (value), then second (index)
    heap = [(nums[i], i) for i in range(n)]
    heapq.heapify(heap)  # O(n) heapify

    marked = [False] * n  # Track marked indices
    score = 0

    while heap:
        val, idx = heapq.heappop(heap)  # Get smallest unprocessed element

        # Skip if this index is already marked (from neighbor marking)
        if marked[idx]:
            continue

        # Add value to score and mark current index
        score += val
        marked[idx] = True

        # Mark left neighbor if exists
        if idx > 0:
            marked[idx - 1] = True

        # Mark right neighbor if exists
        if idx < n - 1:
            marked[idx + 1] = True

    return score
```

```javascript
// Time: O(n log n) | Space: O(n)
function findScore(nums) {
  const n = nums.length;
  // Create a min-heap using array and custom comparator
  const heap = [];
  for (let i = 0; i < n; i++) {
    heap.push([nums[i], i]);
  }
  // Sort by value then index (min-heap simulation)
  heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const marked = new Array(n).fill(false);
  let score = 0;

  while (heap.length > 0) {
    // Get smallest element (from front since we maintain sorted order)
    const [val, idx] = heap.shift();

    // Skip if already marked
    if (marked[idx]) continue;

    // Add to score and mark current index
    score += val;
    marked[idx] = true;

    // Mark neighbors
    if (idx > 0) marked[idx - 1] = true;
    if (idx < n - 1) marked[idx + 1] = true;
  }

  return score;
}

// More efficient with actual priority queue (using library or custom implementation)
// Here's a version using a proper min-heap implementation:
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val, idx) {
    this.heap.push([val, idx]);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIdx];
      if (element[0] > parent[0] || (element[0] === parent[0] && element[1] > parent[1])) break;
      this.heap[index] = parent;
      index = parentIdx;
    }
    this.heap[index] = element;
  }

  _sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];
    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (
          leftChild[0] < element[0] ||
          (leftChild[0] === element[0] && leftChild[1] < element[1])
        ) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if (
          (swap === null &&
            (rightChild[0] < element[0] ||
              (rightChild[0] === element[0] && rightChild[1] < element[1]))) ||
          (swap !== null &&
            (rightChild[0] < leftChild[0] ||
              (rightChild[0] === leftChild[0] && rightChild[1] < leftChild[1])))
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = element;
  }
}

function findScoreOptimized(nums) {
  const n = nums.length;
  const heap = new MinHeap();
  for (let i = 0; i < n; i++) {
    heap.push(nums[i], i);
  }

  const marked = new Array(n).fill(false);
  let score = 0;

  while (!heap.isEmpty()) {
    const [val, idx] = heap.pop();
    if (marked[idx]) continue;

    score += val;
    marked[idx] = true;
    if (idx > 0) marked[idx - 1] = true;
    if (idx < n - 1) marked[idx + 1] = true;
  }

  return score;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.PriorityQueue;

class Solution {
    public long findScore(int[] nums) {
        int n = nums.length;
        // Min-heap that compares by value, then by index
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) return a[0] - b[0];  // Compare values
            return a[1] - b[1];                    // Compare indices on tie
        });

        // Add all elements to heap
        for (int i = 0; i < n; i++) {
            heap.offer(new int[]{nums[i], i});
        }

        boolean[] marked = new boolean[n];
        long score = 0;

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int val = current[0];
            int idx = current[1];

            // Skip if already marked
            if (marked[idx]) continue;

            // Add to score and mark current index
            score += val;
            marked[idx] = true;

            // Mark neighbors
            if (idx > 0) marked[idx - 1] = true;
            if (idx < n - 1) marked[idx + 1] = true;
        }

        return score;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Building the heap with n elements takes O(n) time (heapify operation).
- Each of the n elements is popped from the heap once, which takes O(log n) per pop.
- In total: O(n + n log n) = O(n log n).

**Space Complexity:** O(n)

- The heap stores n elements: O(n).
- The `marked` array uses O(n) space.
- Total: O(n).

## Common Mistakes

1. **Not handling ties correctly:** The problem specifies "if there is a tie, choose the one with the smallest index." If you only sort by value, you might pick a larger index first. Always include index as secondary sort key.

2. **Trying to remove neighbors from heap:** When marking neighbors, don't attempt to remove them from the heap—this would be O(n) per removal. Instead, let them remain in the heap and skip them when they pop if already marked.

3. **Forgetting to mark current element:** Some candidates mark neighbors but forget to mark the current element itself. Remember: "mark the chosen element" is explicitly stated.

4. **Using integer overflow for score:** The score can exceed 32-bit integer limits (n up to 10⁵, values up to 10⁶ → max score ~10¹¹). Use 64-bit integers (long in Java/JavaScript, Python int handles arbitrarily large).

## When You'll See This Pattern

This "heap with skip-when-processed" pattern appears in problems where you need to repeatedly select minimum/maximum elements while dynamically updating eligibility.

**Related problems:**

1. **Sort Integers by The Power Value (Medium)** - Similar heap usage to track computed values while processing.
2. **Maximum Performance of a Team (Hard)** - Uses heap to maintain top k elements while iterating.
3. **Reorganize String (Medium)** - Uses heap to select most frequent character while ensuring no adjacent repeats.

The core idea: when you need to repeatedly pick extremal elements from a changing set, a heap with lazy deletion (skip already-processed) is often the right approach.

## Key Takeaways

1. **Heap + lazy deletion** is powerful for problems requiring repeated min/max selection from a dynamically changing set. Instead of expensive removals, mark elements as invalid and skip them when they surface.
2. **Always consider tie-breakers** in sorting/heap comparators. When problem specifies secondary criteria (like smallest index), incorporate it into your data structure's ordering.
3. **Simulation problems** often benefit from using the right data structure to optimize the bottleneck operation—here, finding smallest unmarked element.

Related problems: [Sort Integers by The Power Value](/problem/sort-integers-by-the-power-value)
