---
title: "How to Solve Total Cost to Hire K Workers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Total Cost to Hire K Workers. Medium difficulty, 43.5% acceptance rate. Topics: Array, Two Pointers, Heap (Priority Queue), Simulation."
date: "2026-07-11"
category: "dsa-patterns"
tags: ["total-cost-to-hire-k-workers", "array", "two-pointers", "heap-(priority-queue)", "medium"]
---

# How to Solve Total Cost to Hire K Workers

This problem asks us to hire exactly `k` workers from an array of hiring costs, following a specific selection rule: in each hiring session, we choose the cheapest worker from either the first `candidates` workers or the last `candidates` workers. After hiring, we remove that worker and continue. The challenge lies in efficiently maintaining the minimum costs from two dynamic windows that shrink toward each other as workers are hired.

What makes this problem interesting is that it combines two fundamental concepts: maintaining minimum values from sliding windows (using heaps) and handling two pointers that converge. The naive approach of repeatedly scanning for minimums would be too slow, requiring a smarter data structure choice.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `costs = [17,12,10,2,7,2,11,20,8]`, `k = 3`, `candidates = 4`

We maintain two heaps (min-heaps) for the left and right candidate pools, and two pointers `left` and `right` to track the boundaries:

**Initial state:**

- Left heap: first 4 workers → `[17, 12, 10, 2]` (heapified: `[2, 12, 10, 17]`)
- Right heap: last 4 workers → `[2, 11, 20, 8]` (heapified: `[2, 11, 20, 8]`)
- Left pointer: index 4 (just after left window)
- Right pointer: index 4 (just before right window)
- Total cost: 0

**Session 1:**

- Compare heap tops: left=2, right=2 (tie)
- Choose left worker (cost 2) since it's from smaller index
- Remove from left heap, add next worker from left pointer (cost 7)
- Left heap: `[7, 12, 10, 17]` → heapified: `[7, 12, 10, 17]`
- Left pointer moves to 5
- Total cost: 2

**Session 2:**

- Compare: left=7, right=2
- Choose right worker (cost 2)
- Remove from right heap, add previous worker from right pointer (cost 11)
- Right heap: `[8, 11, 20, 11]` → heapified: `[8, 11, 20, 11]`
- Right pointer moves to 3
- Total cost: 4

**Session 3:**

- Compare: left=7, right=8
- Choose left worker (cost 7)
- Remove from left heap, add next worker (cost 2 at index 5)
- Left heap: `[2, 12, 10, 17]` → heapified: `[2, 12, 10, 17]`
- Left pointer moves to 6
- Total cost: 11

We've hired `k=3` workers with total cost 11.

## Brute Force Approach

A naive approach would be to simulate the process exactly as described: in each of `k` sessions, scan the first `candidates` elements and the last `candidates` elements to find the minimum, then remove that element from the array.

**Why this fails:**

- Removing from the middle of an array is O(n) in most languages
- Scanning candidates each time is O(candidates)
- Overall complexity: O(k × (candidates + n)) which could be O(k × n) in worst case
- With n up to 10^5 and k up to n, this becomes O(n²) operations

Even if we kept the array and marked positions as "hired", scanning through hired positions to find valid candidates would still be inefficient. We need a way to quickly access the minimum from two dynamic windows without scanning each time.

## Optimized Approach

The key insight is that we need **fast access to the minimum element** from two separate pools that change over time. This screams **priority queues (heaps)**.

**Step-by-step reasoning:**

1. We maintain two min-heaps: one for the left candidate pool and one for the right
2. Initially, we fill the left heap with the first `candidates` workers and the right heap with the last `candidates` workers
3. We use two pointers to track the next available workers not in either heap
4. In each hiring session:
   - Compare the top of both heaps (smallest cost from each pool)
   - If there's a tie, choose from the left heap (as per problem rules)
   - Add that cost to our total
   - Remove that worker from its heap
   - If there are still workers between our pointers, add the next available worker to the now-empty heap
5. Continue for `k` sessions

**Why heaps work perfectly:**

- Getting the minimum: O(1)
- Removing the minimum: O(log m) where m is heap size (≤ candidates)
- Adding new elements: O(log m)
- This gives us O(k log candidates) time complexity

**Edge cases to consider:**

- When the left and right windows overlap (2 × candidates ≥ n)
- When one heap becomes empty before we finish hiring k workers
- When both heaps are empty but we still need to hire more workers (shouldn't happen if k ≤ n)

## Optimal Solution

Here's the complete implementation using two heaps:

<div class="code-group">

```python
# Time: O(k log candidates) | Space: O(candidates)
def totalCost(costs, k, candidates):
    """
    Calculate total cost to hire k workers using two min-heaps.

    Args:
        costs: List of hiring costs for each worker
        k: Number of workers to hire
        candidates: Size of candidate pools from each end

    Returns:
        Total cost to hire k workers
    """
    import heapq

    n = len(costs)
    total_cost = 0

    # Two min-heaps for left and right candidate pools
    left_heap = []
    right_heap = []

    # Initialize pointers: left starts at 0, right starts at n-1
    left = 0
    right = n - 1

    # Fill initial candidate pools
    # Add first 'candidates' workers to left heap
    while left < candidates and left <= right:
        heapq.heappush(left_heap, costs[left])
        left += 1

    # Add last 'candidates' workers to right heap
    # Ensure we don't overlap with left pool
    while right >= n - candidates and right >= left:
        heapq.heappush(right_heap, costs[right])
        right -= 1

    # Hire k workers
    for _ in range(k):
        # Determine which heap to take from
        # If right heap is empty or left has smaller/equal cost
        if not right_heap or (left_heap and left_heap[0] <= right_heap[0]):
            # Take from left heap
            cost = heapq.heappop(left_heap)
            total_cost += cost

            # If there are still workers available, add to left heap
            if left <= right:
                heapq.heappush(left_heap, costs[left])
                left += 1
        else:
            # Take from right heap
            cost = heapq.heappop(right_heap)
            total_cost += cost

            # If there are still workers available, add to right heap
            if left <= right:
                heapq.heappush(right_heap, costs[right])
                right -= 1

    return total_cost
```

```javascript
// Time: O(k log candidates) | Space: O(candidates)
function totalCost(costs, k, candidates) {
  /**
   * Calculate total cost to hire k workers using two min-heaps.
   *
   * @param {number[]} costs - Hiring costs for each worker
   * @param {number} k - Number of workers to hire
   * @param {number} candidates - Size of candidate pools from each end
   * @return {number} Total cost to hire k workers
   */

  const n = costs.length;
  let totalCost = 0;

  // Two min-heaps for left and right candidate pools
  // JavaScript doesn't have built-in heap, so we'll use arrays and sort
  // For efficiency, we could implement a proper heap class
  const leftHeap = [];
  const rightHeap = [];

  // Initialize pointers
  let left = 0;
  let right = n - 1;

  // Helper function to maintain heap property
  const heapPush = (heap, value) => {
    heap.push(value);
    heap.sort((a, b) => a - b); // Min-heap ordering
  };

  const heapPop = (heap) => {
    return heap.shift(); // Remove and return smallest element
  };

  // Fill initial candidate pools
  while (left < candidates && left <= right) {
    heapPush(leftHeap, costs[left]);
    left++;
  }

  while (right >= n - candidates && right >= left) {
    heapPush(rightHeap, costs[right]);
    right--;
  }

  // Hire k workers
  for (let i = 0; i < k; i++) {
    // Determine which heap to take from
    const leftMin = leftHeap.length > 0 ? leftHeap[0] : Infinity;
    const rightMin = rightHeap.length > 0 ? rightHeap[0] : Infinity;

    if (rightHeap.length === 0 || (leftHeap.length > 0 && leftMin <= rightMin)) {
      // Take from left heap
      const cost = heapPop(leftHeap);
      totalCost += cost;

      // If there are still workers available, add to left heap
      if (left <= right) {
        heapPush(leftHeap, costs[left]);
        left++;
      }
    } else {
      // Take from right heap
      const cost = heapPop(rightHeap);
      totalCost += cost;

      // If there are still workers available, add to right heap
      if (left <= right) {
        heapPush(rightHeap, costs[right]);
        right--;
      }
    }
  }

  return totalCost;
}
```

```java
// Time: O(k log candidates) | Space: O(candidates)
import java.util.PriorityQueue;

class Solution {
    public long totalCost(int[] costs, int k, int candidates) {
        /**
         * Calculate total cost to hire k workers using two min-heaps.
         *
         * @param costs Hiring costs for each worker
         * @param k Number of workers to hire
         * @param candidates Size of candidate pools from each end
         * @return Total cost to hire k workers
         */

        int n = costs.length;
        long totalCost = 0;

        // Two min-heaps for left and right candidate pools
        PriorityQueue<Integer> leftHeap = new PriorityQueue<>();
        PriorityQueue<Integer> rightHeap = new PriorityQueue<>();

        // Initialize pointers
        int left = 0;
        int right = n - 1;

        // Fill initial candidate pools
        while (left < candidates && left <= right) {
            leftHeap.offer(costs[left]);
            left++;
        }

        while (right >= n - candidates && right >= left) {
            rightHeap.offer(costs[right]);
            right--;
        }

        // Hire k workers
        for (int i = 0; i < k; i++) {
            // Determine which heap to take from
            // If right heap is empty or left has smaller/equal cost
            if (rightHeap.isEmpty() ||
                (!leftHeap.isEmpty() && leftHeap.peek() <= rightHeap.peek())) {
                // Take from left heap
                int cost = leftHeap.poll();
                totalCost += cost;

                // If there are still workers available, add to left heap
                if (left <= right) {
                    leftHeap.offer(costs[left]);
                    left++;
                }
            } else {
                // Take from right heap
                int cost = rightHeap.poll();
                totalCost += cost;

                // If there are still workers available, add to right heap
                if (left <= right) {
                    rightHeap.offer(costs[right]);
                    right--;
                }
            }
        }

        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k log candidates)**

- We perform k hiring iterations
- Each iteration involves heap operations (pop and potentially push)
- Heap operations are O(log m) where m ≤ candidates
- Initial heap construction is O(candidates log candidates), which is dominated by O(k log candidates) when k is large

**Space Complexity: O(candidates)**

- We store at most 2 × candidates elements across both heaps
- In practice, each heap stores ≤ candidates elements
- Additional O(1) space for pointers and counters

**Why this is optimal:**

- We must examine at least k elements
- We need fast minimum operations from dynamic sets
- Heaps provide the optimal tradeoff for this access pattern
- Any solution would need Ω(k log candidates) operations in the worst case

## Common Mistakes

1. **Not handling overlapping windows correctly**: When 2 × candidates ≥ n, the left and right pools overlap. The solution must ensure workers aren't added to both heaps. Our pointer condition `left <= right` prevents this.

2. **Forgetting the tie-breaking rule**: When costs are equal, we must choose from the left pool. Candidates often miss this subtle requirement, leading to wrong answers on specific test cases.

3. **Using the wrong data structure**: Attempting to use sorted arrays or binary search trees instead of heaps. While these could work, heaps are more efficient for this pattern of repeated minimum extractions with insertions.

4. **Incorrect pointer management**: When a heap becomes empty, we should stop adding to it. The condition `if (left <= right)` ensures we only add workers that haven't been hired yet.

5. **Integer overflow**: With k up to 10^5 and costs up to 10^5, the total cost could exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C, normal int in Python).

## When You'll See This Pattern

This "two-heap converging pointers" pattern appears in problems where you need to efficiently track extremes from two ends of a dataset:

1. **Meeting Rooms II (LeetCode 253)**: While not identical, it uses heaps to track meeting end times as you process start times, maintaining the "active" meetings.

2. **Find Median from Data Stream (LeetCode 295)**: Uses two heaps to maintain the lower and upper halves of data for median calculation.

3. **Sliding Window Maximum (LeetCode 239)**: Uses a deque (monotonic queue) to track maximums in a sliding window, similar to how we track minimums in candidate pools.

4. **Time to Cross a Bridge (LeetCode 2532)**: A more complex variant with multiple heaps for workers waiting on each side of a bridge.

The core insight is recognizing when you need to repeatedly extract minimum/maximum values from dynamic sets while processing data sequentially from both ends.

## Key Takeaways

1. **Heaps are ideal for repeated minimum/maximum operations** on dynamic sets. When a problem involves "always pick the smallest/largest" from a changing collection, think priority queue.

2. **Two-pointer approach with heaps** works well when processing from both ends of an array. The pointers track the boundary between processed and unprocessed elements.

3. **Pay attention to tie-breaking rules** in simulation problems. These often determine which test cases you'll pass or fail.

4. **Simulation problems with rules** can often be optimized by identifying the core operation (here, finding minimum from two pools) and choosing the right data structure to make it efficient.

Remember: When you see "choose the minimum/maximum according to some rule" in a loop, consider if a heap can optimize the repeated minimum/maximum finding.

Related problems: [Meeting Rooms II](/problem/meeting-rooms-ii), [Time to Cross a Bridge](/problem/time-to-cross-a-bridge)
