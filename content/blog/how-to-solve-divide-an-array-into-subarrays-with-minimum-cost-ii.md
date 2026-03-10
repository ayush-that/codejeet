---
title: "How to Solve Divide an Array Into Subarrays With Minimum Cost II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Divide an Array Into Subarrays With Minimum Cost II. Hard difficulty, 54.7% acceptance rate. Topics: Array, Hash Table, Sliding Window, Heap (Priority Queue)."
date: "2028-01-08"
category: "dsa-patterns"
tags:
  [
    "divide-an-array-into-subarrays-with-minimum-cost-ii",
    "array",
    "hash-table",
    "sliding-window",
    "hard",
  ]
---

# How to Solve Divide an Array Into Subarrays With Minimum Cost II

This problem asks us to split an array into `k` subarrays where the first subarray starts at index 0, and each subsequent subarray starts within `dist` positions of the previous one. The total cost is the sum of the first elements of all subarrays, and we need to minimize this cost. What makes this tricky is that we need to choose `k-1` split points (after the first subarray) while maintaining the distance constraint and minimizing the sum of starting elements.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 3, 2, 6, 4, 5]`, `k = 3`, `dist = 2`

We must choose `k-1 = 2` split points after index 0. The first subarray always starts at index 0 (cost = 1). Each next subarray must start within `dist = 2` positions of the previous subarray's start.

**Step 1:** First subarray starts at index 0 (cost = 1)

- Next subarray can start at indices 1, 2, or 3 (within 2 positions from index 0)

**Step 2:** If we choose index 1 as our first split point:

- Second subarray starts at index 1 (cost = 3)
- Third subarray must start within 2 positions from index 1, so indices 2, 3, or 4
- We need to choose the smallest starting value among these options

**Step 3:** Evaluate possibilities:

1. Split at 1 then 2: total cost = 1 + 3 + 2 = 6
2. Split at 1 then 3: total cost = 1 + 3 + 6 = 10
3. Split at 1 then 4: total cost = 1 + 3 + 4 = 8

**Step 4:** Try other first split points:

- First split at 2 (cost = 2), then choose from indices 3, 4 (within 2 from 2)
  - Split at 2 then 3: cost = 1 + 2 + 6 = 9
  - Split at 2 then 4: cost = 1 + 2 + 4 = 7
- First split at 3 (cost = 6), then choose from indices 4, 5 (within 2 from 3)
  - Split at 3 then 4: cost = 1 + 6 + 4 = 11
  - Split at 3 then 5: cost = 1 + 6 + 5 = 12

**Minimum cost is 6** (split at indices 1 and 2).

The key insight: at each step, we need to choose the smallest value within a sliding window of possible next starting positions.

## Brute Force Approach

A naive solution would try all possible combinations of `k-1` split points. For each possible first split point (positions 1 through `dist+1`), we'd recursively try all valid next split points, and so on.

```python
def brute_force(nums, k, dist):
    n = len(nums)

    def dfs(pos, remaining):
        if remaining == 0:
            return 0

        min_cost = float('inf')
        # Next split can be at most dist+1 away
        for next_pos in range(pos + 1, min(n, pos + dist + 2)):
            cost = nums[next_pos] + dfs(next_pos, remaining - 1)
            min_cost = min(min_cost, cost)

        return min_cost

    # First subarray always starts at index 0
    return nums[0] + dfs(0, k - 1)
```

**Why this fails:** The time complexity is exponential. For each position, we explore up to `dist+1` possibilities, and we do this `k-1` times. In the worst case, this is O((dist+1)^(k-1)), which is far too slow for constraints where `n` can be up to 10^5.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with a **sliding window minimum** optimization.

**DP State:** `dp[i][j]` = minimum cost to create `j` subarrays ending with the `j`-th subarray starting at index `i`

**DP Transition:** `dp[i][j] = nums[i] + min(dp[p][j-1])` where `p` is in range `[i-dist-1, i-1]`

**Optimization:** We need to efficiently find the minimum `dp[p][j-1]` in a sliding window of size `dist+1`. This is where a **min-heap** or **balanced BST** comes in.

**Why a heap works:** At each step, we maintain a min-heap of `dp` values for the previous `dist+1` positions. As we move forward, we add new values and remove old ones that fall outside the window.

**The twist:** We can't efficiently remove arbitrary elements from a heap. Solution: Use a **lazy deletion** approach with two heaps (like in problems requiring sliding window median) or use a **TreeMap** (in Java) or **SortedList** (in Python with `bisect`).

**Final approach:**

1. `dp[i]` stores minimum cost to end at position `i` for current number of subarrays
2. For each additional subarray, compute new `dp` using sliding window minimum
3. Use a min-heap with lazy deletion to track minimum in current window
4. Answer is minimum of `dp[i]` for positions that can be starting points for the last subarray

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k * log(dist)) | Space: O(n)
def minimumCost(nums, k, dist):
    n = len(nums)

    # dp_prev[i] = min cost to end at position i with current number of subarrays
    dp_prev = [float('inf')] * n
    dp_prev[0] = nums[0]  # First subarray always starts at index 0

    # We need to create k subarrays total
    for subarray_count in range(2, k + 1):
        dp_curr = [float('inf')] * n

        # Min-heap to track minimum dp_prev values in sliding window
        # Each element is (value, index)
        import heapq
        heap = []

        # Dictionary to track elements marked for lazy deletion
        to_remove = {}

        # Initialize heap with first valid positions
        # For the j-th subarray, it can start from position j-1
        # (since we need j-1 previous subarrays)
        start_window = subarray_count - 2
        for i in range(start_window, min(start_window + dist + 1, n)):
            if dp_prev[i] < float('inf'):
                heapq.heappush(heap, (dp_prev[i], i))

        # Slide the window
        for i in range(subarray_count - 1, n):
            # Get current minimum from heap (with lazy deletion)
            while heap and heap[0][1] < i - dist - 1:
                # This element is outside our window, remove it
                _, idx = heapq.heappop(heap)

            while heap and heap[0][1] in to_remove:
                # Lazily delete elements marked for removal
                val, idx = heapq.heappop(heap)
                to_remove[idx] -= 1
                if to_remove[idx] == 0:
                    del to_remove[idx]

            if heap:
                # Minimum cost to end at position i
                dp_curr[i] = nums[i] + heap[0][0]

            # Add next element to heap for future windows
            if i + 1 < n and dp_prev[i + 1] < float('inf'):
                heapq.heappush(heap, (dp_prev[i + 1], i + 1))

            # Mark element leaving the window for removal
            if i - dist >= 0 and dp_prev[i - dist] < float('inf'):
                to_remove[i - dist] = to_remove.get(i - dist, 0) + 1

        dp_prev = dp_curr

    # Find minimum cost for valid ending positions
    # Last subarray must start early enough to allow k total subarrays
    min_cost = float('inf')
    for i in range(k - 1, n):
        min_cost = min(min_cost, dp_prev[i])

    return min_cost
```

```javascript
// Time: O(n * k * log(dist)) | Space: O(n)
function minimumCost(nums, k, dist) {
  const n = nums.length;

  // dpPrev[i] = min cost to end at position i with current number of subarrays
  let dpPrev = new Array(n).fill(Infinity);
  dpPrev[0] = nums[0]; // First subarray always starts at index 0

  // We need to create k subarrays total
  for (let subarrayCount = 2; subarrayCount <= k; subarrayCount++) {
    const dpCurr = new Array(n).fill(Infinity);

    // Min-heap to track minimum dpPrev values in sliding window
    // Each element is [value, index]
    const heap = new MinHeap();

    // Map to track elements marked for lazy deletion
    const toRemove = new Map();

    // Initialize heap with first valid positions
    // For the j-th subarray, it can start from position j-1
    const startWindow = subarrayCount - 2;
    const endInit = Math.min(startWindow + dist + 1, n);

    for (let i = startWindow; i < endInit; i++) {
      if (dpPrev[i] < Infinity) {
        heap.push([dpPrev[i], i]);
      }
    }

    // Slide the window
    for (let i = subarrayCount - 1; i < n; i++) {
      // Get current minimum from heap (with lazy deletion)
      while (!heap.isEmpty() && heap.peek()[1] < i - dist - 1) {
        // This element is outside our window, remove it
        heap.pop();
      }

      while (!heap.isEmpty() && toRemove.has(heap.peek()[1])) {
        // Lazily delete elements marked for removal
        const [val, idx] = heap.pop();
        const count = toRemove.get(idx) - 1;
        if (count === 0) {
          toRemove.delete(idx);
        } else {
          toRemove.set(idx, count);
        }
      }

      if (!heap.isEmpty()) {
        // Minimum cost to end at position i
        dpCurr[i] = nums[i] + heap.peek()[0];
      }

      // Add next element to heap for future windows
      if (i + 1 < n && dpPrev[i + 1] < Infinity) {
        heap.push([dpPrev[i + 1], i + 1]);
      }

      // Mark element leaving the window for removal
      const removeIdx = i - dist;
      if (removeIdx >= 0 && dpPrev[removeIdx] < Infinity) {
        toRemove.set(removeIdx, (toRemove.get(removeIdx) || 0) + 1);
      }
    }

    dpPrev = dpCurr;
  }

  // Find minimum cost for valid ending positions
  let minCost = Infinity;
  for (let i = k - 1; i < n; i++) {
    minCost = Math.min(minCost, dpPrev[i]);
  }

  return minCost;
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

  peek() {
    return this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element[0] >= parent[0]) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild[0] < element[0]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && rightChild[0] < leftChild[0])
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}
```

```java
// Time: O(n * k * log(dist)) | Space: O(n)
import java.util.*;

class Solution {
    public long minimumCost(int[] nums, int k, int dist) {
        int n = nums.length;

        // dpPrev[i] = min cost to end at position i with current number of subarrays
        long[] dpPrev = new long[n];
        Arrays.fill(dpPrev, Long.MAX_VALUE);
        dpPrev[0] = nums[0];  // First subarray always starts at index 0

        // We need to create k subarrays total
        for (int subarrayCount = 2; subarrayCount <= k; subarrayCount++) {
            long[] dpCurr = new long[n];
            Arrays.fill(dpCurr, Long.MAX_VALUE);

            // Min-heap to track minimum dpPrev values in sliding window
            // Each element is [value, index]
            PriorityQueue<long[]> heap = new PriorityQueue<>(
                (a, b) -> Long.compare(a[0], b[0])
            );

            // Map to track elements marked for lazy deletion
            Map<Integer, Integer> toRemove = new HashMap<>();

            // Initialize heap with first valid positions
            // For the j-th subarray, it can start from position j-1
            int startWindow = subarrayCount - 2;
            int endInit = Math.min(startWindow + dist + 1, n);

            for (int i = startWindow; i < endInit; i++) {
                if (dpPrev[i] < Long.MAX_VALUE) {
                    heap.offer(new long[]{dpPrev[i], i});
                }
            }

            // Slide the window
            for (int i = subarrayCount - 1; i < n; i++) {
                // Get current minimum from heap (with lazy deletion)
                while (!heap.isEmpty() && heap.peek()[1] < i - dist - 1) {
                    // This element is outside our window, remove it
                    heap.poll();
                }

                while (!heap.isEmpty() && toRemove.containsKey((int)heap.peek()[1])) {
                    // Lazily delete elements marked for removal
                    long[] removed = heap.poll();
                    int idx = (int)removed[1];
                    int count = toRemove.get(idx) - 1;
                    if (count == 0) {
                        toRemove.remove(idx);
                    } else {
                        toRemove.put(idx, count);
                    }
                }

                if (!heap.isEmpty()) {
                    // Minimum cost to end at position i
                    dpCurr[i] = nums[i] + heap.peek()[0];
                }

                // Add next element to heap for future windows
                if (i + 1 < n && dpPrev[i + 1] < Long.MAX_VALUE) {
                    heap.offer(new long[]{dpPrev[i + 1], i + 1});
                }

                // Mark element leaving the window for removal
                int removeIdx = i - dist;
                if (removeIdx >= 0 && dpPrev[removeIdx] < Long.MAX_VALUE) {
                    toRemove.put(removeIdx, toRemove.getOrDefault(removeIdx, 0) + 1);
                }
            }

            dpPrev = dpCurr;
        }

        // Find minimum cost for valid ending positions
        long minCost = Long.MAX_VALUE;
        for (int i = k - 1; i < n; i++) {
            minCost = Math.min(minCost, dpPrev[i]);
        }

        return minCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k × log(dist))

- We have `k-1` iterations (for creating `k` subarrays)
- In each iteration, we process `n` positions
- For each position, heap operations (push/pop) take O(log(dist)) time since the heap contains at most `dist+1` elements
- Total: O((k-1) × n × log(dist)) = O(n × k × log(dist))

**Space Complexity:** O(n)

- We maintain two DP arrays of size `n` (can be optimized to O(dist) by reusing arrays)
- The heap stores at most `dist+1` elements
- The `toRemove` map stores at most `dist+1` entries
- Total: O(n) for DP arrays + O(dist) for heap and map = O(n)

## Common Mistakes

1. **Forgetting the first subarray always starts at index 0:** Some candidates try to minimize the first element too, but the problem states the first subarray starts at index 0. The cost always includes `nums[0]`.

2. **Incorrect window boundaries:** The window for possible previous split points is `[i-dist-1, i-1]`, not `[i-dist, i]`. A subarray starting at `i` means the previous subarray ended at `i-1`, so the previous start must be at least `i-dist-1` positions before.

3. **Not handling large values correctly:** Using `Integer.MAX_VALUE` for initialization can cause overflow when adding `nums[i]`. Use `Long.MAX_VALUE` or a sufficiently large value.

4. **Inefficient heap cleanup:** Trying to remove elements directly from the heap takes O(n) time. The lazy deletion pattern (marking elements for removal and cleaning them up when they reach the top) is crucial for O(log n) operations.

## When You'll See This Pattern

This problem combines **dynamic programming** with **sliding window minimum optimization**, a pattern seen in several other LeetCode problems:

1. **Sliding Window Maximum (239):** Uses a similar deque approach to track max/min in a sliding window, though here we need the minimum for DP transitions.

2. **Jump Game VI (1696):** Also uses DP with sliding window maximum/minimum optimization, where you can jump up to `k` steps and want to maximize score.

3. **Minimum Cost to Reach Destination in Time (1928):** Combines DP with time constraints and requires optimizing over possible previous states within a window.

The core pattern: when you have a DP transition that depends on the minimum/maximum of previous DP states within a fixed window, use a heap or deque to maintain that extremum efficiently.

## Key Takeaways

1. **DP + sliding window optimization:** When DP transitions require min/max of previous states in a sliding window, use a heap with lazy deletion or a deque to achieve O(log n) or O(1) transitions instead of O(n).

2. **Lazy deletion in heaps:** You can't efficiently remove arbitrary elements from a heap, but you can mark them as "to be removed" and clean them up when they reach the top of the heap.

3. **Window boundary carefulness:** Pay close attention to whether window boundaries are inclusive or exclusive, and whether indices are 0-based or 1-based. Off-by-one errors are common in sliding window problems.

Related problems: [Minimum Cost to Cut a Stick](/problem/minimum-cost-to-cut-a-stick), [Minimum Cost to Split an Array](/problem/minimum-cost-to-split-an-array)
