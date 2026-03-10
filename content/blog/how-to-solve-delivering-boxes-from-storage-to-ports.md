---
title: "How to Solve Delivering Boxes from Storage to Ports — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Delivering Boxes from Storage to Ports. Hard difficulty, 40.1% acceptance rate. Topics: Array, Dynamic Programming, Segment Tree, Queue, Heap (Priority Queue)."
date: "2026-06-17"
category: "dsa-patterns"
tags:
  ["delivering-boxes-from-storage-to-ports", "array", "dynamic-programming", "segment-tree", "hard"]
---

# How to Solve Delivering Boxes from Storage to Ports

You need to deliver boxes from storage to ports using a ship with both box count and weight limits. Each box has a destination port and weight. The challenge is that trips between storage and ports consume fuel: traveling between different ports costs 1 fuel, while staying at the same port costs 0. The goal is to minimize total trips (fuel consumption) while respecting both constraints. This problem is tricky because you must balance two constraints while optimizing a sequence-dependent cost structure.

## Visual Walkthrough

Let's trace through a small example:  
`boxes = [[1,2],[2,3],[1,1],[2,4],[1,2]]`, `portsCount = 2`, `maxBoxes = 3`, `maxWeight = 6`

We start at storage (port 0). The ship can carry at most 3 boxes and total weight 6.

**Trip 1:** Load boxes 0-2: `[[1,2],[2,3],[1,1]]`

- Ports: 1 → 2 → 1 (storage counts as port 0)
- Trips: 0→1 (1), 1→2 (1), 2→1 (1), 1→0 (1) = 4 trips
- Total weight: 2+3+1=6 (at limit)
- Box count: 3 (at limit)

**Trip 2:** Load boxes 3-4: `[[2,4],[1,2]]`

- Ports: 2 → 1
- Trips: 0→2 (1), 2→1 (1), 1→0 (1) = 3 trips
- Total weight: 4+2=6
- Box count: 2

**Total trips:** 4+3 = 7

But is this optimal? What if we split differently?  
**Alternative:** Trip 1: boxes 0-1 `[[1,2],[2,3]]` (weight 5, trips: 0→1→2→0 = 3)  
Trip 2: boxes 2-4 `[[1,1],[2,4],[1,2]]` (weight 7 exceeds maxWeight 6) → Not allowed

We need a systematic way to find the minimum trips. The key observation: each trip's cost depends on the number of _distinct consecutive port changes_ between boxes in that trip.

## Brute Force Approach

A naive approach would try all possible partitions of boxes into trips respecting constraints. For n boxes, there are 2^(n-1) possible partitions. For each partition, we'd check if each segment satisfies box/weight limits, then calculate trips by counting port changes.

Why this fails: With n up to 10^5, 2^(n-1) is astronomically large. Even with pruning, exponential time is impossible.

What candidates might try: Greedy loading until hitting a limit. But greedy can be suboptimal because:

- Early trips might take "expensive" boxes (causing many port changes)
- Better to group boxes with same port together when possible
- Example where greedy fails: `[[1,1],[2,1],[1,1]]`, maxBoxes=3, maxWeight=3  
  Greedy: all boxes in one trip: ports 1→2→1 = 4 trips  
  Optimal: Trip1: `[[1,1],[1,1]]` (2 trips), Trip2: `[[2,1]]` (2 trips) = 4 trips (same here, but other cases differ)

## Optimized Approach

The key insight: This is a **dynamic programming** problem where `dp[i]` = minimum trips for first i boxes (boxes 0 to i-1).

Transition: `dp[i] = min(dp[j] + cost(j, i))` for all j < i where boxes j to i-1 can be one trip.

Cost(j, i) = 1 + (number of times consecutive boxes in [j, i-1] have different ports) + 1  
The +1 at each end accounts for storage→first port and last port→storage.

We need to find the minimum j for each i such that boxes j to i-1 satisfy constraints. As i increases, the earliest valid j moves right (monotonic). This suggests a **sliding window** with **monotonic queue** optimization.

**Step-by-step reasoning:**

1. Preprocess prefix sums for weight to quickly check weight constraint
2. For each i (1 to n), find the earliest j where [j, i-1] is valid
3. The cost for segment [j, i-1] is:  
   `trips = 2 + (number of port changes in [j, i-2])`  
   Why i-2? We count changes between consecutive boxes in the trip
4. Number of port changes = `(count of distinct consecutive different ports in [j, i-2])`  
   We can precompute `change[i] = 1 if boxes[i][0] != boxes[i+1][0] else 0` and use prefix sums
5. Then `dp[i] = min(dp[j] + 2 + (changes[j] - changes[i-1]))` over valid j
6. Simplify: `dp[i] = 2 + changes[i-1] + min(dp[j] - changes[j])` for j in window
7. Use a monotonic queue to maintain min `(dp[j] - changes[j])` over sliding window

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def boxDelivering(boxes, portsCount, maxBoxes, maxWeight):
    """
    Calculate minimum trips to deliver all boxes.

    Args:
        boxes: List of [port, weight]
        portsCount: Number of ports (unused except for bounds)
        maxBoxes: Maximum boxes per trip
        maxWeight: Maximum weight per trip

    Returns:
        Minimum number of trips
    """
    n = len(boxes)

    # Prefix sums for weight to quickly check weight constraint
    prefix_weight = [0] * (n + 1)
    for i in range(n):
        prefix_weight[i + 1] = prefix_weight[i] + boxes[i][1]

    # prefix_changes[i] = number of port changes in boxes[0:i-1]
    # change between boxes[i] and boxes[i+1] counts at i
    prefix_changes = [0] * (n + 1)
    for i in range(1, n):
        # If current box has different port than previous, it's a change
        prefix_changes[i] = prefix_changes[i - 1] + (1 if boxes[i][0] != boxes[i - 1][0] else 0)

    # dp[i] = minimum trips for first i boxes (boxes[0..i-1])
    dp = [0] * (n + 1)

    # Monotonic queue storing indices j with increasing dp[j] - prefix_changes[j]
    from collections import deque
    dq = deque()
    dq.append(0)  # Start with j=0, dp[0]=0, prefix_changes[0]=0

    for i in range(1, n + 1):
        # Remove from front if segment [j, i-1] violates box count or weight
        while dq and (i - dq[0] > maxBoxes or
                     prefix_weight[i] - prefix_weight[dq[0]] > maxWeight):
            dq.popleft()

        # dp[i] = 2 (storage→first port + last port→storage)
        #         + prefix_changes[i-1] (port changes within trip)
        #         + min over j in window of (dp[j] - prefix_changes[j])
        if dq:
            j = dq[0]
            dp[i] = 2 + prefix_changes[i - 1] + (dp[j] - prefix_changes[j])

        # Maintain monotonic queue: remove from back if dp[i] - prefix_changes[i]
        # is smaller than or equal to last element's value
        while dq and dp[i] - prefix_changes[i] <= dp[dq[-1]] - prefix_changes[dq[-1]]:
            dq.pop()
        dq.append(i)

    return dp[n]
```

```javascript
// Time: O(n) | Space: O(n)
function boxDelivering(boxes, portsCount, maxBoxes, maxWeight) {
  const n = boxes.length;

  // Prefix sums for weight
  const prefixWeight = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixWeight[i + 1] = prefixWeight[i] + boxes[i][1];
  }

  // Prefix sums for port changes
  const prefixChanges = new Array(n + 1).fill(0);
  for (let i = 1; i < n; i++) {
    prefixChanges[i] = prefixChanges[i - 1] + (boxes[i][0] !== boxes[i - 1][0] ? 1 : 0);
  }

  // dp[i] = min trips for first i boxes
  const dp = new Array(n + 1).fill(0);

  // Monotonic deque storing indices
  const deque = [];
  deque.push(0); // Start with j=0

  for (let i = 1; i <= n; i++) {
    // Remove from front if constraints violated
    while (
      deque.length > 0 &&
      (i - deque[0] > maxBoxes || prefixWeight[i] - prefixWeight[deque[0]] > maxWeight)
    ) {
      deque.shift();
    }

    // Calculate dp[i] using minimum in window
    if (deque.length > 0) {
      const j = deque[0];
      dp[i] = 2 + prefixChanges[i - 1] + (dp[j] - prefixChanges[j]);
    }

    // Maintain monotonic property
    while (
      deque.length > 0 &&
      dp[i] - prefixChanges[i] <=
        dp[deque[deque.length - 1]] - prefixChanges[deque[deque.length - 1]]
    ) {
      deque.pop();
    }
    deque.push(i);
  }

  return dp[n];
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int boxDelivering(int[][] boxes, int portsCount, int maxBoxes, int maxWeight) {
        int n = boxes.length;

        // Prefix sums for weight
        long[] prefixWeight = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefixWeight[i + 1] = prefixWeight[i] + boxes[i][1];
        }

        // Prefix sums for port changes
        int[] prefixChanges = new int[n + 1];
        for (int i = 1; i < n; i++) {
            prefixChanges[i] = prefixChanges[i - 1] +
                (boxes[i][0] != boxes[i - 1][0] ? 1 : 0);
        }

        // dp[i] = minimum trips for first i boxes
        int[] dp = new int[n + 1];

        // Monotonic deque storing indices j
        Deque<Integer> deque = new ArrayDeque<>();
        deque.offerLast(0);  // Start with j=0

        for (int i = 1; i <= n; i++) {
            // Remove from front if segment violates constraints
            while (!deque.isEmpty() &&
                   (i - deque.peekFirst() > maxBoxes ||
                    prefixWeight[i] - prefixWeight[deque.peekFirst()] > maxWeight)) {
                deque.pollFirst();
            }

            // Calculate dp[i] using minimum value in window
            if (!deque.isEmpty()) {
                int j = deque.peekFirst();
                dp[i] = 2 + prefixChanges[i - 1] + (dp[j] - prefixChanges[j]);
            }

            // Maintain monotonic property: remove from back if current value is better
            while (!deque.isEmpty() &&
                   dp[i] - prefixChanges[i] <= dp[deque.peekLast()] - prefixChanges[deque.peekLast()]) {
                deque.pollLast();
            }
            deque.offerLast(i);
        }

        return dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each box once in the main loop
- Each index enters and leaves the deque at most once → amortized O(1) per operation
- Prefix sum calculations are O(n)
- Total: O(n)

**Space Complexity:** O(n)

- Prefix arrays: O(n) for weight and changes
- DP array: O(n)
- Deque: O(n) in worst case
- Total: O(n)

## Common Mistakes

1. **Forgetting the +2 trips for storage→first port and last port→storage**: Each trip always starts and ends at storage, so minimum 2 trips even if all boxes go to same port.

2. **Incorrect port change counting**: The change between boxes[i] and boxes[i+1] should be counted at index i, not i+1. If you count at i+1, you'll be off-by-one in the prefix sums.

3. **Not using long for weight prefix sums in Java**: Weight can be up to 10^5 per box with n up to 10^5, so total weight can exceed 2^31-1. Use `long[]` for prefix sums in Java to avoid overflow.

4. **Wrong deque maintenance condition**: When maintaining the monotonic queue, compare `dp[i] - prefixChanges[i]` not just `dp[i]`. The optimization relies on minimizing `dp[j] - prefixChanges[j]`.

## When You'll See This Pattern

This problem combines **sliding window minimum with monotonic queue** optimization for DP. Similar patterns appear in:

1. **Sliding Window Maximum/Minimum (LeetCode 239)**: Uses deque to maintain extremum over sliding window.
2. **Maximum Sum of 3 Non-Overlapping Subarrays (LeetCode 689)**: Uses prefix sums and careful window management.
3. **Jump Game VI (LeetCode 1696)**: DP with monotonic queue optimization over sliding window.
4. **Constrained Subsequence Sum (LeetCode 1425)**: Very similar structure - DP with sliding window min/max.

The core pattern: When DP transition has form `dp[i] = min/max(dp[j] + cost(j, i))` over a sliding window of j, and the cost can be separated into parts depending only on i and only on j, use monotonic queue.

## Key Takeaways

1. **DP with sliding window optimization**: When DP depends on a range of previous states that move monotonically, consider monotonic queue to achieve O(n) instead of O(n²).

2. **Separate dependent terms**: In `dp[i] = min(dp[j] + A[i] + B[j])`, we can rewrite as `dp[i] = A[i] + min(dp[j] + B[j])` and maintain min over sliding window.

3. **Prefix sums for constraints**: Use prefix sums to quickly check weight/box constraints in O(1) instead of O(k) for each segment.

[Practice this problem on CodeJeet](/problem/delivering-boxes-from-storage-to-ports)
