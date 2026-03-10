---
title: "How to Solve Minimum Cost to Hire K Workers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Hire K Workers. Hard difficulty, 63.6% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2026-08-02"
category: "dsa-patterns"
tags: ["minimum-cost-to-hire-k-workers", "array", "greedy", "sorting", "hard"]
---

# How to Solve Minimum Cost to Hire K Workers

You need to hire exactly `k` workers from `n` candidates, each with a quality and minimum wage requirement. The tricky part is that when you hire multiple workers, you must pay them proportionally to their quality while respecting each worker's minimum wage expectation. This creates an optimization problem where you need to balance wage-to-quality ratios against total quality costs.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- quality = [10, 20, 5]
- wage = [70, 50, 30]
- k = 2

**Step 1: Calculate wage-to-quality ratios**

- Worker 0: 70/10 = 7.0
- Worker 1: 50/20 = 2.5
- Worker 2: 30/5 = 6.0

**Step 2: Sort workers by ratio**

- Worker 1 (ratio 2.5)
- Worker 2 (ratio 6.0)
- Worker 0 (ratio 7.0)

**Step 3: Consider each worker as the "cap" ratio**
When we pick a worker as the "cap," we must pay all selected workers at that ratio (or higher). So if we cap at worker 1's ratio (2.5):

- We can pick any workers with ratio ≤ 2.5 (only worker 1)
- But we need k=2 workers, so we must include workers with higher ratios
- All workers get paid at ratio 2.5 × their quality
- Total cost = 2.5 × (sum of selected qualities)

**Step 4: Use a max-heap to track k-1 smallest qualities**
Let's walk through the algorithm:

1. Sort workers by ratio: [(2.5, 20), (6.0, 5), (7.0, 10)]
2. Initialize total_quality = 0, max_heap = []
3. For first k-1 workers (just worker 1):
   - Add quality 20 to total_quality
   - Push -20 to max_heap (Python heapq is min-heap, so we use negatives for max-heap)
4. For remaining workers (starting from index k-1 = 1):
   - Current worker: (6.0, 5)
   - total_quality = 20 + 5 = 25
   - Cost = 6.0 × 25 = 150
   - Update answer = min(answer, 150) = 150
   - Remove largest quality from heap: pop -20, add back -5
   - total_quality = 5 + 5 = 10
5. Next worker: (7.0, 10)
   - total_quality = 10 + 10 = 20
   - Cost = 7.0 × 20 = 140
   - Update answer = min(150, 140) = 140
   - Remove largest quality: pop -10, add back -10
   - total_quality = 10 + 10 = 20

**Final answer:** 140 (hire workers 0 and 2, paying 7.0 × 10 = 70 and 7.0 × 5 = 35)

## Brute Force Approach

A naive approach would try all combinations of k workers:

1. For each combination of k workers from n
2. Calculate the minimum ratio needed to satisfy all workers in the group
3. Compute total cost = max_ratio × sum of qualities
4. Track the minimum cost across all combinations

The problem is the combinatorial explosion: C(n, k) grows factorially. For n=100 and k=50, that's approximately 1e29 combinations - completely infeasible.

Even if we try to be clever by sorting workers, without the heap optimization we'd still need to check O(n²) possibilities by trying each worker as the ratio cap and checking all possible quality combinations.

## Optimized Approach

The key insight is that we can frame the problem as:

1. If we choose a particular worker's ratio as our pay rate (cap), we must pay ALL selected workers at least that ratio × their quality
2. To minimize cost for a given ratio cap, we want to select the k-1 workers with the smallest additional qualities (since we're forced to include the cap worker)
3. We can process workers in sorted order by ratio, maintaining a running sum of the k smallest qualities using a max-heap

**Why this works:**

- When we sort by ratio, any worker to the right has a higher ratio and thus a higher wage expectation
- If we use worker i's ratio as our cap, we can only include workers with ratio ≤ worker i's ratio
- Since we're processing in increasing ratio order, all previously seen workers are eligible
- We want the smallest total quality for k workers, so we maintain the k smallest qualities seen so far
- The max-heap lets us efficiently replace the largest quality when we find a smaller one

**Step-by-step reasoning:**

1. Calculate wage/quality ratio for each worker
2. Sort workers by ratio (ascending)
3. Use a max-heap to track the k-1 smallest qualities seen so far
4. Maintain running sum of qualities in the heap
5. For each worker from index k-1 onward:
   - Add current worker's quality to the sum
   - Calculate cost = current ratio × total quality
   - Update minimum cost
   - Remove the largest quality from heap (to maintain only k-1 smallest)
   - Subtract it from total quality

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def mincostToHireWorkers(quality, wage, k):
    """
    Calculate minimum cost to hire exactly k workers.

    Args:
        quality: List of worker qualities
        wage: List of minimum wage expectations
        k: Number of workers to hire

    Returns:
        Minimum total cost to hire k workers
    """
    n = len(quality)

    # Step 1: Create list of (ratio, quality) pairs for each worker
    # Ratio = wage / quality (minimum pay per unit quality)
    workers = [(wage[i] / quality[i], quality[i]) for i in range(n)]

    # Step 2: Sort workers by ratio in ascending order
    # This ensures when we use a worker's ratio as cap,
    # all previous workers have lower or equal ratios
    workers.sort(key=lambda x: x[0])

    # Step 3: Initialize variables
    import heapq

    max_heap = []  # Max-heap (using negatives since Python has min-heap)
    total_quality = 0  # Sum of qualities in the heap
    min_cost = float('inf')

    # Step 4: Process each worker
    for ratio, q in workers:
        # Add current worker's quality to total
        total_quality += q
        # Push negative quality to simulate max-heap
        heapq.heappush(max_heap, -q)

        # When we have more than k workers in consideration
        if len(max_heap) > k:
            # Remove the worker with largest quality (most expensive)
            # Since we use negatives, heappop gives most negative = largest quality
            largest_quality = -heapq.heappop(max_heap)
            total_quality -= largest_quality

        # When we have exactly k workers
        if len(max_heap) == k:
            # Calculate cost using current worker's ratio as cap
            # All k workers in heap have ratio <= current ratio
            cost = ratio * total_quality
            min_cost = min(min_cost, cost)

    return min_cost
```

```javascript
// Time: O(n log n) | Space: O(n)
function mincostToHireWorkers(quality, wage, k) {
  /**
   * Calculate minimum cost to hire exactly k workers.
   *
   * @param {number[]} quality - Array of worker qualities
   * @param {number[]} wage - Array of minimum wage expectations
   * @param {number} k - Number of workers to hire
   * @return {number} Minimum total cost to hire k workers
   */
  const n = quality.length;

  // Step 1: Create array of [ratio, quality] pairs for each worker
  // Ratio = wage / quality (minimum pay per unit quality)
  const workers = [];
  for (let i = 0; i < n; i++) {
    workers.push([wage[i] / quality[i], quality[i]]);
  }

  // Step 2: Sort workers by ratio in ascending order
  // This ensures when we use a worker's ratio as cap,
  // all previous workers have lower or equal ratios
  workers.sort((a, b) => a[0] - b[0]);

  // Step 3: Initialize variables
  const maxHeap = new MaxHeap(); // Max-heap to track largest qualities
  let totalQuality = 0; // Sum of qualities in the heap
  let minCost = Infinity;

  // Step 4: Process each worker
  for (const [ratio, q] of workers) {
    // Add current worker's quality to total
    totalQuality += q;
    maxHeap.push(q);

    // When we have more than k workers in consideration
    if (maxHeap.size() > k) {
      // Remove the worker with largest quality (most expensive)
      const largestQuality = maxHeap.pop();
      totalQuality -= largestQuality;
    }

    // When we have exactly k workers
    if (maxHeap.size() === k) {
      // Calculate cost using current worker's ratio as cap
      // All k workers in heap have ratio <= current ratio
      const cost = ratio * totalQuality;
      minCost = Math.min(minCost, cost);
    }
  }

  return minCost;
}

// MaxHeap implementation for JavaScript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown(0);
    return max;
  }

  _bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];

      if (element <= parent) break;

      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild > element) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if ((swap === null && rightChild > element) || (swap !== null && rightChild > leftChild)) {
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
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public double mincostToHireWorkers(int[] quality, int[] wage, int k) {
        /**
         * Calculate minimum cost to hire exactly k workers.
         *
         * @param quality Array of worker qualities
         * @param wage Array of minimum wage expectations
         * @param k Number of workers to hire
         * @return Minimum total cost to hire k workers
         */
        int n = quality.length;

        // Step 1: Create array of Worker objects with ratio and quality
        Worker[] workers = new Worker[n];
        for (int i = 0; i < n; i++) {
            double ratio = (double) wage[i] / quality[i];
            workers[i] = new Worker(ratio, quality[i]);
        }

        // Step 2: Sort workers by ratio in ascending order
        // This ensures when we use a worker's ratio as cap,
        // all previous workers have lower or equal ratios
        Arrays.sort(workers, (a, b) -> Double.compare(a.ratio, b.ratio));

        // Step 3: Initialize variables
        // Max-heap to track largest qualities (using negative for max-heap)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        int totalQuality = 0;  // Sum of qualities in the heap
        double minCost = Double.MAX_VALUE;

        // Step 4: Process each worker
        for (Worker worker : workers) {
            // Add current worker's quality to total
            totalQuality += worker.quality;
            maxHeap.offer(worker.quality);

            // When we have more than k workers in consideration
            if (maxHeap.size() > k) {
                // Remove the worker with largest quality (most expensive)
                int largestQuality = maxHeap.poll();
                totalQuality -= largestQuality;
            }

            // When we have exactly k workers
            if (maxHeap.size() == k) {
                // Calculate cost using current worker's ratio as cap
                // All k workers in heap have ratio <= current ratio
                double cost = worker.ratio * totalQuality;
                minCost = Math.min(minCost, cost);
            }
        }

        return minCost;
    }

    // Helper class to store worker data
    class Worker {
        double ratio;
        int quality;

        Worker(double ratio, int quality) {
            this.ratio = ratio;
            this.quality = quality;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating ratios: O(n)
- Sorting workers by ratio: O(n log n)
- Heap operations (push/pop) for each of n workers: O(n log k)
- Since k ≤ n, overall complexity is O(n log n)

**Space Complexity: O(n)**

- Storing workers array: O(n)
- Max-heap storing up to k elements: O(k) = O(n) in worst case
- Total: O(n)

The log k factor comes from heap operations, but since we only keep k elements in the heap, each operation is O(log k). In the worst case where k = n, this becomes O(log n).

## Common Mistakes

1. **Forgetting to handle the ratio constraint correctly**: When using a worker's ratio as the cap, you must ensure ALL selected workers have ratio ≤ cap ratio. Sorting by ratio solves this.

2. **Incorrect heap type**: Using a min-heap instead of max-heap. We need to remove the largest quality to minimize total quality, so we need a max-heap to efficiently find and remove the maximum.

3. **Off-by-one errors in heap size**: Starting to calculate costs only after we have exactly k workers in the heap. The code should check `if len(heap) == k` not `if len(heap) >= k`.

4. **Integer division errors**: In Java/C++, dividing integers gives integer results. Need to cast to double/float when calculating wage/quality ratios.

5. **Not considering all workers as potential ratio caps**: Some candidates only consider the first k workers after sorting, but the optimal ratio cap might come from a worker later in the sorted list.

## When You'll See This Pattern

This problem combines **sorting with heap optimization** - a common pattern for problems where you need to select k elements optimizing two criteria:

1. **Maximum Subsequence Score (Medium)** - Very similar structure: sort by one criterion, use heap to track k best values of another criterion.

2. **IPO (Hard)** - Sort projects by capital, use heap to track most profitable projects you can afford.

3. **Meeting Rooms II (Medium)** - Sort intervals by start time, use min-heap to track end times.

The pattern is: when you need to optimize based on two factors where one factor imposes an ordering constraint, sort by that factor and use a heap to optimize the other factor dynamically.

## Key Takeaways

1. **Sort + Heap is powerful for dual-optimization**: When you need to optimize based on two criteria where one provides a natural ordering, sort by that criterion and use a heap to maintain the best k elements according to the second criterion.

2. **Think about "cap" constraints**: Problems where you need to satisfy a minimum/maximum constraint for all selected elements often benefit from sorting and treating each element as a potential "cap."

3. **Max-heap for minimizing sum of largest elements**: When you want to minimize the sum of selected elements and need to remove the largest ones, a max-heap lets you efficiently track and remove maximum values.

Related problems: [Maximum Subsequence Score](/problem/maximum-subsequence-score)
