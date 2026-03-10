---
title: "How to Solve Find K Pairs with Smallest Sums — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find K Pairs with Smallest Sums. Medium difficulty, 41.6% acceptance rate. Topics: Array, Heap (Priority Queue)."
date: "2027-06-14"
category: "dsa-patterns"
tags: ["find-k-pairs-with-smallest-sums", "array", "heap-(priority-queue)", "medium"]
---

# How to Solve Find K Pairs with Smallest Sums

You're given two sorted arrays and need to find the `k` smallest sum pairs, where each pair contains one element from each array. The challenge is that generating all possible pairs would be too slow — there could be up to 10^10 pairs for arrays of length 10^5 each. The key insight is that we only need the smallest `k` pairs, and we can find them efficiently using a priority queue to explore pairs in increasing sum order.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

- `nums1 = [1, 7, 11]`
- `nums2 = [2, 4, 6]`
- `k = 4`

The smallest possible sum is `1 + 2 = 3` (pair `(1, 2)`). After taking this pair, what are the next candidates? The next smallest sums could be:

- `1 + 4 = 5` (same `nums1[0]` with next `nums2` element)
- `7 + 2 = 9` (next `nums1` element with `nums2[0]`)

We can visualize this as a matrix where cell `(i, j)` contains `nums1[i] + nums2[j]`:

```
         nums2
         [2]  [4]  [6]
nums1 [1]  3    5    7
      [7]  9   11   13
      [11] 13  15   17
```

Since both arrays are sorted, each row and column is sorted. The smallest element is at `(0, 0)`. After taking it, the next smallest could be either `(0, 1)` or `(1, 0)`. This is similar to merging `m` sorted lists, where each list corresponds to a row: row `i` contains pairs `(nums1[i], nums2[j])` for all `j`, sorted by sum.

We'll use a min-heap to track the smallest available pair from each "list" (each `nums1` element paired with the smallest unused `nums2` element).

## Brute Force Approach

The brute force solution generates all possible pairs, sorts them by sum, and returns the first `k`:

<div class="code-group">

```python
# Time: O(m*n*log(m*n)) | Space: O(m*n)
def kSmallestPairs(nums1, nums2, k):
    # Generate all pairs
    pairs = []
    for i in range(len(nums1)):
        for j in range(len(nums2)):
            pairs.append((nums1[i] + nums2[j], nums1[i], nums2[j]))

    # Sort by sum
    pairs.sort(key=lambda x: x[0])

    # Return first k pairs (just the values, not the sum)
    return [[u, v] for _, u, v in pairs[:k]]
```

```javascript
// Time: O(m*n*log(m*n)) | Space: O(m*n)
function kSmallestPairs(nums1, nums2, k) {
  // Generate all pairs
  const pairs = [];
  for (let i = 0; i < nums1.length; i++) {
    for (let j = 0; j < nums2.length; j++) {
      pairs.push([nums1[i] + nums2[j], nums1[i], nums2[j]]);
    }
  }

  // Sort by sum
  pairs.sort((a, b) => a[0] - b[0]);

  // Return first k pairs (just the values, not the sum)
  return pairs.slice(0, k).map(([_, u, v]) => [u, v]);
}
```

```java
// Time: O(m*n*log(m*n)) | Space: O(m*n)
public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    // Generate all pairs
    List<int[]> pairs = new ArrayList<>();
    for (int i = 0; i < nums1.length; i++) {
        for (int j = 0; j < nums2.length; j++) {
            pairs.add(new int[]{nums1[i] + nums2[j], nums1[i], nums2[j]});
        }
    }

    // Sort by sum
    Collections.sort(pairs, (a, b) -> a[0] - b[0]);

    // Return first k pairs (just the values, not the sum)
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < Math.min(k, pairs.size()); i++) {
        int[] pair = pairs.get(i);
        result.add(Arrays.asList(pair[1], pair[2]));
    }
    return result;
}
```

</div>

**Why this fails:** With `m = n = 10^5`, we'd generate `10^10` pairs, requiring massive memory and time. Even for smaller inputs, this is inefficient when `k` is small compared to `m*n`.

## Optimized Approach

The key insight is that we only need the smallest `k` pairs, not all pairs. Since both arrays are sorted:

1. The smallest pair is always `(nums1[0], nums2[0])`
2. For any pair `(nums1[i], nums2[j])`, the next candidates are:
   - `(nums1[i], nums2[j+1])` - same `nums1` element with next `nums2` element
   - `(nums1[i+1], nums2[j])` - next `nums1` element with same `nums2` element

We can think of each `nums1[i]` as the start of a "list" of pairs with all `nums2` elements. These lists are sorted because `nums2` is sorted. Our problem becomes: find the `k` smallest elements across `m` sorted lists.

We use a min-heap (priority queue) where each entry contains:

- The sum `nums1[i] + nums2[j]`
- The index `i` in `nums1`
- The index `j` in `nums2`

Initially, we push the first element of each "list" (each `nums1[i]` paired with `nums2[0]`). Then we repeatedly:

1. Pop the smallest pair from the heap
2. Add it to our result
3. Push the next pair from the same list: `(nums1[i], nums2[j+1])`

However, there's a subtle optimization: we only need to push the next pair from the same `nums1` element when we pop a pair. This avoids duplicates and keeps the heap size manageable.

## Optimal Solution

Here's the efficient solution using a min-heap:

<div class="code-group">

```python
# Time: O(k*log(min(m, k))) | Space: O(min(m, k))
def kSmallestPairs(nums1, nums2, k):
    # Edge case: empty arrays
    if not nums1 or not nums2:
        return []

    # Use min-heap (priority queue)
    import heapq

    # Initialize heap with first element from each "list" (nums1[i] with nums2[0])
    # We only need min(m, k) since we won't need more than k elements
    heap = []
    for i in range(min(len(nums1), k)):
        # Push: (sum, nums1 index, nums2 index)
        heapq.heappush(heap, (nums1[i] + nums2[0], i, 0))

    result = []
    while heap and len(result) < k:
        # Pop the smallest pair from heap
        _, i, j = heapq.heappop(heap)
        result.append([nums1[i], nums2[j]])

        # If there's a next element in nums2 for this nums1[i]
        if j + 1 < len(nums2):
            # Push the next pair from the same list
            heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))

    return result
```

```javascript
// Time: O(k*log(min(m, k))) | Space: O(min(m, k))
function kSmallestPairs(nums1, nums2, k) {
  // Edge case: empty arrays
  if (!nums1.length || !nums2.length) return [];

  // Min-heap using array and comparator
  const heap = new MinHeap();

  // Initialize heap with first element from each "list"
  // We only need min(m, k) since we won't need more than k elements
  for (let i = 0; i < Math.min(nums1.length, k); i++) {
    // Push: [sum, nums1 index, nums2 index]
    heap.push([nums1[i] + nums2[0], i, 0]);
  }

  const result = [];
  while (!heap.isEmpty() && result.length < k) {
    // Pop the smallest pair from heap
    const [_, i, j] = heap.pop();
    result.push([nums1[i], nums2[j]]);

    // If there's a next element in nums2 for this nums1[i]
    if (j + 1 < nums2.length) {
      // Push the next pair from the same list
      heap.push([nums1[i] + nums2[j + 1], i, j + 1]);
    }
  }

  return result;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent][0] <= this.heap[index][0]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let swap = null;

      if (left < length && this.heap[left][0] < this.heap[index][0]) {
        swap = left;
      }

      if (right < length) {
        if (
          (swap === null && this.heap[right][0] < this.heap[index][0]) ||
          (swap !== null && this.heap[right][0] < this.heap[left][0])
        ) {
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
// Time: O(k*log(min(m, k))) | Space: O(min(m, k))
public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    List<List<Integer>> result = new ArrayList<>();

    // Edge case: empty arrays
    if (nums1.length == 0 || nums2.length == 0) {
        return result;
    }

    // Min-heap: stores [sum, i, j]
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);

    // Initialize heap with first element from each "list"
    // We only need min(m, k) since we won't need more than k elements
    for (int i = 0; i < Math.min(nums1.length, k); i++) {
        heap.offer(new int[]{nums1[i] + nums2[0], i, 0});
    }

    while (!heap.isEmpty() && result.size() < k) {
        // Pop the smallest pair from heap
        int[] current = heap.poll();
        int i = current[1];
        int j = current[2];

        // Add to result
        result.add(Arrays.asList(nums1[i], nums2[j]));

        // If there's a next element in nums2 for this nums1[i]
        if (j + 1 < nums2.length) {
            // Push the next pair from the same list
            heap.offer(new int[]{nums1[i] + nums2[j + 1], i, j + 1});
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(k * log(min(m, k)))`

- We perform at most `k` iterations (or until heap is empty)
- Each iteration involves one `pop()` and potentially one `push()` operation
- Heap operations are `O(log h)` where `h` is heap size
- Heap size is at most `min(m, k)` because we only push the first `min(m, k)` elements initially, and we only add one new element each time we pop
- Therefore: `O(k * log(min(m, k)))`

**Space Complexity:** `O(min(m, k))`

- The heap stores at most `min(m, k)` elements
- The result stores `k` pairs, but this is output space and usually not counted in space complexity analysis for interview problems

## Common Mistakes

1. **Generating all pairs first:** This is the most common mistake. Candidates often create all `m*n` pairs, sort them, and take the first `k`. This fails for large inputs. Remember: when `k` is small, we don't need to generate all possibilities.

2. **Forgetting to limit initial heap size:** If you push all `m` initial pairs when `m > k`, you waste time and memory. Only push `min(m, k)` since we won't need more than `k` elements total.

3. **Not handling empty arrays:** Always check if either input array is empty and return an empty list immediately.

4. **Pushing both `(i, j+1)` and `(i+1, j)` when popping:** This causes duplicates. The correct approach is to only push `(i, j+1)` when you pop `(i, j)`. The pairs `(i+1, j)` will be pushed when their turn comes (when `i+1` is first added to the heap with `j=0`).

5. **Incorrect heap comparator:** Make sure your heap compares by sum, not by individual array values or indices.

## When You'll See This Pattern

This "k smallest elements from multiple sorted lists" pattern appears in several problems:

1. **Kth Smallest Element in a Sorted Matrix (Medium):** Similar structure but with a 2D matrix. Each row is sorted, and you need the kth smallest element. The solution uses a min-heap to merge rows.

2. **Merge k Sorted Lists (Hard):** The classic problem that uses exactly this pattern. You have k sorted linked lists and need to merge them into one sorted list.

3. **Find K Pairs with Smallest Sums (this problem):** Each `nums1[i]` creates a "virtual list" of pairs with all `nums2[j]`, and these lists are sorted.

4. **Kth Smallest Product of Two Sorted Arrays (Hard):** A more complex variation where you need the kth smallest product instead of sum.

The core pattern is: when you need the smallest/largest k elements from multiple sorted sequences, use a min-heap/max-heap to efficiently traverse them in order.

## Key Takeaways

1. **Think in terms of merging sorted sequences:** When you see "k smallest" and sorted inputs, consider whether you can treat the problem as merging multiple sorted lists.

2. **Use heaps for incremental exploration:** A min-heap lets you explore elements in increasing order without generating all possibilities upfront. This is crucial when the total number of possibilities is huge but `k` is small.

3. **Limit your search space:** Only generate what you need. In this problem, we only push `min(m, k)` elements initially and only explore further as needed. This optimization is often the difference between an acceptable and unacceptable solution.

Related problems: [Kth Smallest Element in a Sorted Matrix](/problem/kth-smallest-element-in-a-sorted-matrix), [Find K-th Smallest Pair Distance](/problem/find-k-th-smallest-pair-distance), [Kth Smallest Product of Two Sorted Arrays](/problem/kth-smallest-product-of-two-sorted-arrays)
