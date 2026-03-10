---
title: "How to Solve Earliest Second to Mark Indices II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Earliest Second to Mark Indices II. Hard difficulty, 22.0% acceptance rate. Topics: Array, Binary Search, Greedy, Heap (Priority Queue)."
date: "2026-09-20"
category: "dsa-patterns"
tags: ["earliest-second-to-mark-indices-ii", "array", "binary-search", "greedy", "hard"]
---

# How to Solve Earliest Second to Mark Indices II

You need to mark all indices of an array `nums` using operations from a sequence `changeIndices`. Each second you can either reduce a specific number or mark an index, but marking requires the number at that index to be zero. The challenge is finding the earliest second when all indices can be marked, which requires careful scheduling of reduction and marking operations.

What makes this problem tricky is the interplay between two constraints: 1) You can only reduce the value at index `i` when `changeIndices[s] == i`, and 2) You need to schedule reductions early enough so values reach zero by the time you mark them. The optimal solution requires looking ahead in time to reserve enough reduction operations.

## Visual Walkthrough

Let's trace through a small example:

- `nums = [2, 1, 0]` (n=3)
- `changeIndices = [2, 2, 3, 2, 1]` (m=5)

We need to mark all 3 indices. Let's see if we can do it by second 4:

**Second 1**: `changeIndices[0] = 2` (index 2)

- Index 2 has value 0 already, so we could mark it immediately
- But we might want to reduce index 2's value (it's already 0)
- Let's mark it: Marked indices = {2}

**Second 2**: `changeIndices[1] = 2` (index 2)

- Index 2 is already marked, so we can't mark it again
- We could reduce index 2's value, but it's already 0
- This second is wasted

**Second 3**: `changeIndices[2] = 3` (index 3)

- Index 3 doesn't exist (1-indexed, max is 3, so index 3 means the third element)
- Wait, careful: The problem is 1-indexed. `nums` indices are 1..n
- `nums[1] = 2`, `nums[2] = 1`, `nums[3] = 0`
- So `changeIndices[2] = 3` means index 3 (third element, value 0)
- We could mark index 3 since its value is 0
- Marked indices = {2, 3}

**Second 4**: `changeIndices[3] = 2` (index 2)

- Index 2 is already marked
- We could reduce index 2, but it's already 0
- We need to mark index 1, but its value is 2 and we're at index 2

We failed to mark index 1 by second 4. Let's try a different strategy:

**Second 1**: `changeIndices[0] = 2` (index 2)

- Reduce index 2 from 1 to 0 (needs 1 reduction)

**Second 2**: `changeIndices[1] = 2` (index 2)

- Mark index 2 (value is now 0): Marked = {2}

**Second 3**: `changeIndices[2] = 3` (index 3)

- Mark index 3 (value is 0): Marked = {2, 3}

**Second 4**: `changeIndices[3] = 2` (index 2)

- Index 2 already marked, wasted

**Second 5**: `changeIndices[4] = 1` (index 1)

- Need to mark index 1, but value is still 2
- We can only reduce it now, not mark it
- Failed again

The issue is we never reduced index 1. We need to plan reductions in advance. Let's see if we can succeed by second 5 with better planning:

**Second 1**: `changeIndices[0] = 2` (index 2)

- Reduce index 2 from 1 to 0

**Second 2**: `changeIndices[1] = 2` (index 2)

- Mark index 2: Marked = {2}

**Second 3**: `changeIndices[2] = 3` (index 3)

- Mark index 3: Marked = {2, 3}

**Second 4**: `changeIndices[3] = 2` (index 2)

- Wasted (index 2 already marked)

**Second 5**: `changeIndices[4] = 1` (index 1)

- Can't mark (value is 2), can only reduce to 1

Still fails. The earliest we could mark index 1 is if we had more opportunities to reduce it. Since `changeIndices` only has index 1 at second 5, we can only reduce it once there, so it needs 2 seconds but only has 1. Therefore, with this `changeIndices`, it's impossible to mark all indices.

This shows why we need to check feasibility for a given time limit: we must ensure each index gets enough reduction operations before its marking deadline.

## Brute Force Approach

A brute force approach would try every second from 1 to m as a candidate for the earliest time to mark all indices. For each candidate time `t`, we would simulate the process:

1. Keep track of remaining reductions needed for each index
2. Process seconds 1 through t
3. At each second, if we encounter an index that needs reduction, we can reduce it
4. If an index reaches 0 and we encounter it again, we can mark it
5. Check if all indices are marked by second t

The simulation would need to decide at each second whether to reduce or mark when we have the choice. A greedy approach that always marks when possible might not be optimal because marking early might waste reduction opportunities.

The brute force has complexity O(m × n × m) in the worst case (trying m times, simulating up to m seconds, with n indices to track). For m up to 5×10⁵ and n up to 5000, this is far too slow (≈ 10¹⁴ operations).

## Optimized Approach

The key insight is that we can use **binary search** on the answer (the earliest second) combined with a **greedy feasibility check**.

**Binary Search**: Since we're looking for the earliest second where marking all indices is possible, and if it's possible at time t, it's also possible at any time > t (we can just ignore extra seconds). This monotonic property makes binary search applicable.

**Feasibility Check**: For a candidate time `t`, we need to check if we can mark all indices within the first t seconds. The efficient approach:

1. For each index i, find the last occurrence of i in `changeIndices[0..t-1]` (1-indexed adjustment needed). This last occurrence is the deadline to mark index i.

2. Work backwards from the end of our window (second t) to the beginning:
   - Keep a min-heap (priority queue) of indices that need to be marked, prioritized by their deadlines
   - When we reach a second that corresponds to an index's last occurrence, we add that index to the heap
   - At each second, if we have indices in the heap, we mark the one with the earliest deadline
   - Otherwise, we use the second for reduction operations

3. Track the total reduction operations needed and available:
   - Each index i needs `nums[i]` reductions
   - We accumulate "free" reduction slots when we don't need to mark
   - We need enough free slots to cover all reductions before their deadlines

The greedy strategy of marking indices with the earliest deadlines first is optimal because it gives us more flexibility with the remaining time for reductions.

## Optimal Solution

<div class="code-group">

```python
# Time: O((m + n) * log m * log n) | Space: O(n)
def earliestSecondToMarkIndices(self, nums, changeIndices):
    n, m = len(nums), len(changeIndices)

    # Helper function to check if we can mark all indices by time 'limit'
    def can_mark_by(limit):
        # last_seen[i] = last second (1-indexed) where index i appears in changeIndices[0..limit-1]
        last_seen = [-1] * n
        for s in range(limit):
            idx = changeIndices[s] - 1  # Convert to 0-indexed
            last_seen[idx] = s + 1  # Store as 1-indexed second

        # If any index doesn't appear in the first 'limit' seconds, we can't mark it
        if any(last_seen[i] == -1 for i in range(n)):
            return False

        # Min-heap for indices that need marking, prioritized by their deadline
        import heapq
        heap = []

        # Track how many reduction operations we have available
        reductions_available = 0

        # Process seconds from limit down to 1
        for s in range(limit, 0, -1):
            idx = changeIndices[s-1] - 1  # Current index at second s (1-indexed to 0-indexed)

            # If this is the last occurrence of this index
            if last_seen[idx] == s:
                # We need to mark this index by second s
                # Push it to heap with negative priority for min-heap (we want earliest deadline first)
                heapq.heappush(heap, -nums[idx])

                # If we have reductions available, use them for the index with smallest requirement
                if reductions_available > 0 and heap:
                    # The index with smallest nums[i] is at the top (negative max-heap trick)
                    reductions_available -= 1
                    heapq.heappop(heap)
            else:
                # This second can be used for reduction
                reductions_available += 1

        # After processing all seconds, check if we marked all indices
        # Heap should be empty (all indices marked) and we need enough reductions
        return len(heap) == 0 and reductions_available >= 0

    # Binary search for the earliest second
    left, right = 1, m
    answer = -1

    while left <= right:
        mid = left + (right - left) // 2
        if can_mark_by(mid):
            answer = mid
            right = mid - 1  # Try to find earlier solution
        else:
            left = mid + 1

    return answer
```

```javascript
// Time: O((m + n) * log m * log n) | Space: O(n)
var earliestSecondToMarkIndices = function (nums, changeIndices) {
  const n = nums.length;
  const m = changeIndices.length;

  // Helper function to check feasibility by time 'limit'
  const canMarkBy = (limit) => {
    // lastSeen[i] = last second (1-indexed) where index i appears
    const lastSeen = new Array(n).fill(-1);
    for (let s = 0; s < limit; s++) {
      const idx = changeIndices[s] - 1; // Convert to 0-indexed
      lastSeen[idx] = s + 1; // Store as 1-indexed second
    }

    // If any index doesn't appear, we can't mark it
    for (let i = 0; i < n; i++) {
      if (lastSeen[i] === -1) return false;
    }

    // Max-heap (using negative values for min-heap behavior)
    const heap = new MaxPriorityQueue({ priority: (x) => x });
    let reductionsAvailable = 0;

    // Process from limit down to 1
    for (let s = limit; s >= 1; s--) {
      const idx = changeIndices[s - 1] - 1; // Convert to 0-indexed

      // If this is the last occurrence of this index
      if (lastSeen[idx] === s) {
        // We need to mark this index
        heap.enqueue(nums[idx]);

        // If we have reductions available, use them for smallest requirement
        if (reductionsAvailable > 0 && heap.size() > 0) {
          reductionsAvailable--;
          heap.dequeue();
        }
      } else {
        // This second can be used for reduction
        reductionsAvailable++;
      }
    }

    // Check if all indices are marked
    return heap.size() === 0 && reductionsAvailable >= 0;
  };

  // Binary search for earliest second
  let left = 1,
    right = m;
  let answer = -1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (canMarkBy(mid)) {
      answer = mid;
      right = mid - 1; // Try to find earlier solution
    } else {
      left = mid + 1;
    }
  }

  return answer;
};

// MaxPriorityQueue implementation for JavaScript (simplified)
class MaxPriorityQueue {
  constructor({ priority }) {
    this.heap = [];
    this.priority = priority || ((x) => x);
  }

  enqueue(value) {
    this.heap.push(value);
    this.heap.sort((a, b) => this.priority(b) - this.priority(a));
  }

  dequeue() {
    return this.heap.shift();
  }

  size() {
    return this.heap.length;
  }
}
```

```java
// Time: O((m + n) * log m * log n) | Space: O(n)
class Solution {
    public int earliestSecondToMarkIndices(int[] nums, int[] changeIndices) {
        int n = nums.length;
        int m = changeIndices.length;

        // Binary search for the earliest second
        int left = 1, right = m;
        int answer = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (canMarkBy(mid, nums, changeIndices)) {
                answer = mid;
                right = mid - 1; // Try to find earlier solution
            } else {
                left = mid + 1;
            }
        }

        return answer;
    }

    private boolean canMarkBy(int limit, int[] nums, int[] changeIndices) {
        int n = nums.length;

        // lastSeen[i] = last second (1-indexed) where index i appears
        int[] lastSeen = new int[n];
        Arrays.fill(lastSeen, -1);

        for (int s = 0; s < limit; s++) {
            int idx = changeIndices[s] - 1; // Convert to 0-indexed
            lastSeen[idx] = s + 1; // Store as 1-indexed second
        }

        // If any index doesn't appear, we can't mark it
        for (int i = 0; i < n; i++) {
            if (lastSeen[i] == -1) return false;
        }

        // Max-heap (PriorityQueue in Java is min-heap by default, use negative for max)
        PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> b - a);
        int reductionsAvailable = 0;

        // Process from limit down to 1
        for (int s = limit; s >= 1; s--) {
            int idx = changeIndices[s - 1] - 1; // Convert to 0-indexed

            // If this is the last occurrence of this index
            if (lastSeen[idx] == s) {
                // We need to mark this index
                heap.offer(nums[idx]);

                // If we have reductions available, use them for smallest requirement
                if (reductionsAvailable > 0 && !heap.isEmpty()) {
                    reductionsAvailable--;
                    heap.poll();
                }
            } else {
                // This second can be used for reduction
                reductionsAvailable++;
            }
        }

        // Check if all indices are marked
        return heap.isEmpty() && reductionsAvailable >= 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O((m + n) × log m × log n)

- Binary search runs O(log m) times
- Each feasibility check:
  - O(m) to build `last_seen` array
  - O(m × log n) to process seconds with heap operations
  - O(n) to check if all indices appear
- Total: O((m + n) × log n × log m)

**Space Complexity**: O(n)

- `last_seen` array of size n
- Heap can contain up to n elements
- Other variables use constant space

## Common Mistakes

1. **Not handling 1-indexing correctly**: The problem states both `nums` and `changeIndices` are 1-indexed. Forgetting to subtract 1 when accessing arrays leads to index out of bounds or incorrect logic.

2. **Greedy marking without planning reductions**: Trying to mark indices as soon as their value reaches 0, without reserving enough reduction operations in advance. This fails because you might mark an index early and then lack reduction opportunities for other indices.

3. **Incorrect feasibility check order**: Processing seconds from beginning to end instead of end to beginning. Working backwards is crucial because it lets us know which indices must be marked by certain deadlines.

4. **Missing the binary search optimization**: Trying to simulate for each second from 1 to m linearly (O(m²) time). The problem constraints require the binary search approach.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search on answer**: Used when looking for minimum/maximum value satisfying a condition and the condition is monotonic.
   - Related: [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/), [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)

2. **Greedy scheduling with deadlines**: Scheduling tasks to meet deadlines, often processed in reverse chronological order.
   - Related: [Course Schedule III](https://leetcode.com/problems/course-schedule-iii/), [Maximum Number of Events That Can Be Attended](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/)

3. **Resource allocation with constraints**: Allocating limited operations (reductions) to meet requirements (marking indices).
   - Related: [Minimum Number of Days to Eat N Oranges](https://leetcode.com/problems/minimum-number-of-days-to-eat-n-oranges/), [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/)

## Key Takeaways

1. **When you need to find the "earliest" or "minimum" time and have a way to check feasibility, binary search on the answer is often the right approach.**

2. **For scheduling problems with deadlines, working backwards from the deadline is a powerful technique** that reveals which tasks must be done by when.

3. **The combination of heap + greedy is effective for prioritizing tasks** when you need to choose which task to do first among many options.

[Practice this problem on CodeJeet](/problem/earliest-second-to-mark-indices-ii)
