---
title: "How to Solve Furthest Building You Can Reach — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Furthest Building You Can Reach. Medium difficulty, 50.7% acceptance rate. Topics: Array, Greedy, Heap (Priority Queue)."
date: "2028-03-24"
category: "dsa-patterns"
tags: ["furthest-building-you-can-reach", "array", "greedy", "heap-(priority-queue)", "medium"]
---

# How to Solve Furthest Building You Can Reach

You need to travel across buildings with varying heights, using bricks to climb small height differences and ladders for large ones. The challenge is deciding when to use bricks versus ladders to maximize how far you can go. This is tricky because you must make decisions without knowing future height differences — a classic greedy problem with a priority queue twist.

## Visual Walkthrough

Let's trace through a concrete example:  
`heights = [4, 12, 2, 7, 3, 18, 20, 3, 19]`, `bricks = 10`, `ladders = 2`

We start at building 0 (height 4) and move right:

1. **Building 0 → 1**: Height difference = 12 - 4 = 8  
   We need to climb 8. We have 2 ladders and 10 bricks.  
   Strategy: Use bricks for small climbs, save ladders for large ones.  
   For now, use bricks: `bricks = 10 - 8 = 2`

2. **Building 1 → 2**: Height difference = 2 - 12 = -10 (downhill)  
   No resources needed. Continue.

3. **Building 2 → 3**: Height difference = 7 - 2 = 5  
   Need to climb 5. Bricks remaining: 2 (not enough).  
   We could use a ladder, but maybe we should reconsider earlier choices.  
   What if we had used a ladder for the earlier 8-height climb instead of bricks?  
   Then we'd have bricks: 10, ladders: 1. Now we could use bricks for this 5-height climb.  
   This shows we need to track climbs and possibly swap resources.

4. **Optimal thinking**:
   - Use bricks initially for all climbs
   - When bricks run out, use a ladder for the largest climb so far
   - This effectively "refunds" bricks from that largest climb
   - Continue this process

Let's apply this properly:

**Step-by-step with priority queue:**

- Building 0→1: Climb 8. Use bricks: bricks=2. Track climb in max-heap: [8]
- Building 2→3: Climb 5. Use bricks: bricks=-3 (insufficient!)  
  Replace largest brick climb (8) with ladder: bricks=2+8=10, ladders=1  
  Now use bricks for current 5: bricks=5. Heap now contains [5]
- Building 3→4: Climb 3-7=-4 (downhill)
- Building 4→5: Climb 18-3=15  
  Use bricks: bricks=5-15=-10 (insufficient)  
  Replace largest brick climb (5) with ladder: bricks=10+5=15, ladders=0  
  Use bricks for current 15: bricks=0. Heap now contains [15]
- Building 5→6: Climb 20-18=2  
  Use bricks: bricks=-2 (insufficient, no ladders left)  
  We're stuck! Can't reach building 6.

Furthest building reached: **5** (0-indexed), or 6 buildings total.

## Brute Force Approach

A naive approach would try all possible assignments of ladders to climbs. For each of the `n-1` climbs, you could either use bricks or a ladder. With `L` ladders, you'd need to consider all combinations of choosing `L` climbs out of `n-1` to use ladders on. This gives C(n-1, L) possibilities, which grows exponentially.

Even if you tried all permutations, you'd need to simulate each path until bricks run out. The brute force would look like:

<div class="code-group">

```python
# Brute force - exponentially slow
def furthestBuilding(heights, bricks, ladders):
    n = len(heights)

    def dfs(i, bricks_remaining, ladders_remaining):
        if i == n-1:
            return i

        diff = heights[i+1] - heights[i]
        if diff <= 0:
            return dfs(i+1, bricks_remaining, ladders_remaining)

        # Try using bricks if possible
        use_bricks = i
        if bricks_remaining >= diff:
            use_bricks = dfs(i+1, bricks_remaining - diff, ladders_remaining)

        # Try using ladder if available
        use_ladder = i
        if ladders_remaining > 0:
            use_ladder = dfs(i+1, bricks_remaining, ladders_remaining - 1)

        return max(use_bricks, use_ladder)

    return dfs(0, bricks, ladders)
```

```javascript
// Brute force - exponentially slow
function furthestBuilding(heights, bricks, ladders) {
  const n = heights.length;

  function dfs(i, bricksRemaining, laddersRemaining) {
    if (i === n - 1) return i;

    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) {
      return dfs(i + 1, bricksRemaining, laddersRemaining);
    }

    let useBricks = i;
    if (bricksRemaining >= diff) {
      useBricks = dfs(i + 1, bricksRemaining - diff, laddersRemaining);
    }

    let useLadder = i;
    if (laddersRemaining > 0) {
      useLadder = dfs(i + 1, bricksRemaining, laddersRemaining - 1);
    }

    return Math.max(useBricks, useLadder);
  }

  return dfs(0, bricks, ladders);
}
```

```java
// Brute force - exponentially slow
public int furthestBuilding(int[] heights, int bricks, int ladders) {
    return dfs(0, bricks, ladders, heights);
}

private int dfs(int i, int bricks, int ladders, int[] heights) {
    if (i == heights.length - 1) return i;

    int diff = heights[i + 1] - heights[i];
    if (diff <= 0) {
        return dfs(i + 1, bricks, ladders, heights);
    }

    int useBricks = i;
    if (bricks >= diff) {
        useBricks = dfs(i + 1, bricks - diff, ladders, heights);
    }

    int useLadder = i;
    if (ladders > 0) {
        useLadder = dfs(i + 1, bricks, ladders - 1, heights);
    }

    return Math.max(useBricks, useLadder);
}
```

</div>

**Why it's too slow:** For `n` buildings and `L` ladders, we're looking at roughly O(2^(n-1)) worst-case time complexity. Even for moderate `n=20`, that's over 1 million operations. The problem constraints (up to 10^5 buildings) make this completely infeasible.

## Optimized Approach

The key insight is that **ladders should be reserved for the largest climbs**. Think of it this way:

1. Initially, use bricks for every climb
2. When bricks run out, find the largest climb where you used bricks
3. Replace that brick usage with a ladder (refunding those bricks)
4. Use the refunded bricks for the current climb

This is optimal because:

- Ladders have "infinite" height capacity but limited quantity
- By always swapping out the largest brick climb for a ladder, you minimize brick usage
- A max-heap (priority queue) lets you efficiently track and retrieve the largest climbs

**Step-by-step reasoning:**

1. Iterate through buildings, calculating height differences
2. For downhill moves (diff ≤ 0), continue freely
3. For uphill moves:
   - First, always use bricks (push diff to max-heap, subtract from bricks)
   - If bricks go negative, we've overspent
   - Replace the largest previous brick climb with a ladder (pop from heap, add bricks back, use ladder)
   - If no ladders remain, we can't proceed further

This greedy approach works because at any point, if we need to use a ladder, it's always optimal to use it on the largest climb encountered so far.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log k) where k = min(n, ladders) | Space: O(k)
def furthestBuilding(heights, bricks, ladders):
    """
    Returns the furthest building index (0-indexed) that can be reached
    using given bricks and ladders.

    Strategy: Use bricks for all climbs initially. When bricks run out,
    replace the largest previous brick climb with a ladder (refunding bricks).
    This minimizes brick consumption.
    """
    import heapq  # Python's heapq is min-heap, so we store negative values

    n = len(heights)
    # Max-heap (simulated with negative values) to track climbs where we used bricks
    brick_climbs = []

    for i in range(n - 1):
        diff = heights[i + 1] - heights[i]

        # If downhill or flat, no resources needed
        if diff <= 0:
            continue

        # First, try using bricks for this climb
        heapq.heappush(brick_climbs, -diff)  # Store as negative for max-heap
        bricks -= diff

        # If bricks are negative, we overspent
        if bricks < 0:
            # No ladders left to fix overspending - can't go further
            if ladders == 0:
                return i

            # Replace the largest brick climb with a ladder
            # Largest climb is at the top of our max-heap
            largest_climb = -heapq.heappop(brick_climbs)
            bricks += largest_climb  # Refund bricks from that climb
            ladders -= 1             # Use a ladder instead

        # If bricks are still negative after ladder swap, we can't proceed
        # (This shouldn't happen with correct implementation)

    # If we complete the loop, we reached the last building
    return n - 1
```

```javascript
// Time: O(n log k) where k = min(n, ladders) | Space: O(k)
function furthestBuilding(heights, bricks, ladders) {
  /**
   * Returns the furthest building index (0-indexed) that can be reached
   * using given bricks and ladders.
   *
   * Strategy: Use bricks for all climbs initially. When bricks run out,
   * replace the largest previous brick climb with a ladder (refunding bricks).
   * This minimizes brick consumption.
   */
  const n = heights.length;
  // Max-heap to track climbs where we used bricks
  // JavaScript doesn't have built-in heap, so we'll use array and sort
  // For efficiency, we could implement a proper heap, but this shows the logic
  const brickClimbs = [];

  for (let i = 0; i < n - 1; i++) {
    const diff = heights[i + 1] - heights[i];

    // If downhill or flat, no resources needed
    if (diff <= 0) continue;

    // First, try using bricks for this climb
    brickClimbs.push(diff);
    brickClimbs.sort((a, b) => b - a); // Keep in descending order
    bricks -= diff;

    // If bricks are negative, we overspent
    if (bricks < 0) {
      // No ladders left to fix overspending - can't go further
      if (ladders === 0) return i;

      // Replace the largest brick climb with a ladder
      // Largest climb is first in our sorted array
      const largestClimb = brickClimbs.shift();
      bricks += largestClimb; // Refund bricks from that climb
      ladders--; // Use a ladder instead
    }
  }

  // If we complete the loop, we reached the last building
  return n - 1;
}

// More efficient version with proper max-heap implementation
function furthestBuildingOptimized(heights, bricks, ladders) {
  const n = heights.length;
  const maxHeap = new MaxHeap();

  for (let i = 0; i < n - 1; i++) {
    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) continue;

    maxHeap.push(diff);
    bricks -= diff;

    if (bricks < 0) {
      if (ladders === 0) return i;
      bricks += maxHeap.pop();
      ladders--;
    }
  }

  return n - 1;
}

// Simple MaxHeap implementation for completeness
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown(0);
    }
    return max;
  }

  _bubbleUp(idx) {
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (element <= parent) break;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
    this.heap[idx] = element;
  }

  _sinkDown(idx) {
    const length = this.heap.length;
    const element = this.heap[idx];

    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild > element) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if ((swap === null && rightChild > element) || (swap !== null && rightChild > leftChild)) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      idx = swap;
    }
    this.heap[idx] = element;
  }
}
```

```java
// Time: O(n log k) where k = min(n, ladders) | Space: O(k)
import java.util.PriorityQueue;
import java.util.Collections;

class Solution {
    /**
     * Returns the furthest building index (0-indexed) that can be reached
     * using given bricks and ladders.
     *
     * Strategy: Use bricks for all climbs initially. When bricks run out,
     * replace the largest previous brick climb with a ladder (refunding bricks).
     * This minimizes brick consumption.
     */
    public int furthestBuilding(int[] heights, int bricks, int ladders) {
        int n = heights.length;
        // Max-heap to track climbs where we used bricks
        // PriorityQueue in Java is min-heap by default, so we use Collections.reverseOrder()
        PriorityQueue<Integer> brickClimbs = new PriorityQueue<>(Collections.reverseOrder());

        for (int i = 0; i < n - 1; i++) {
            int diff = heights[i + 1] - heights[i];

            // If downhill or flat, no resources needed
            if (diff <= 0) {
                continue;
            }

            // First, try using bricks for this climb
            brickClimbs.offer(diff);
            bricks -= diff;

            // If bricks are negative, we overspent
            if (bricks < 0) {
                // No ladders left to fix overspending - can't go further
                if (ladders == 0) {
                    return i;
                }

                // Replace the largest brick climb with a ladder
                // Largest climb is at the top of our max-heap
                int largestClimb = brickClimbs.poll();
                bricks += largestClimb;  // Refund bricks from that climb
                ladders--;               // Use a ladder instead
            }
        }

        // If we complete the loop, we reached the last building
        return n - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log k) where:

- `n` is the number of buildings
- `k` is the number of climbs stored in the heap, which is at most `min(n, ladders)`
- We iterate through `n-1` climbs (O(n))
- For each climb, we perform heap operations (push/pop) which are O(log k)
- In worst case where ladders ≈ n, this becomes O(n log n)

**Space Complexity:** O(k) where `k = min(n, ladders)`

- The heap stores at most one entry per ladder (since we only keep climbs where we used bricks)
- In practice, we store climbs until we need to replace them with ladders

## Common Mistakes

1. **Not handling downhill moves:** Forgetting to skip negative or zero height differences. These require no resources, so they don't affect brick/ladder usage.

2. **Wrong heap type:** Using a min-heap instead of max-heap. You need to track the _largest_ climbs to replace with ladders. In Python, remember to negate values since `heapq` is min-heap.

3. **Early termination condition:** Returning `i` when bricks become negative _before_ trying to use a ladder. You should only return when bricks are negative AND no ladders remain.

4. **Forgetting to refund bricks properly:** When replacing a brick climb with a ladder, you must add back the full height difference, not just enough to make bricks non-negative.

5. **Index off-by-one errors:** The problem asks for furthest building index (0-indexed). Make sure you return `i` (current building) when stuck, not `i-1`.

## When You'll See This Pattern

This "use resource A first, then replace largest usages with resource B" pattern appears in several optimization problems:

1. **Make the Prefix Sum Non-negative (Medium):** Similar concept of replacing negative values to maintain a running sum.

2. **Minimum Cost to Hire K Workers (Hard):** Uses a max-heap to track the most expensive workers to replace.

3. **IPO (Hard):** Select projects with max profit while managing capital constraints using heaps.

4. **Course Schedule III (Hard):** Schedule courses by duration and deadline, replacing longest course when needed.

The core pattern is: **When you have two resources with different properties (one limited quantity, one limited "capacity"), use the capacity-limited resource first, then replace the most expensive usages with the quantity-limited resource.**

## Key Takeaways

1. **Greedy with priority queue:** When you need to optimize resource allocation where one resource is better for large tasks, use a heap to track tasks and swap the largest ones.

2. **Simulate then optimize:** Start by using the more "expendable" resource (bricks), then retroactively upgrade the most expensive uses to the better resource (ladders).

3. **Problem transformation:** This is essentially "minimize brick usage given limited ladders" or "maximize climbs given resources." Framing it as a minimization problem helps identify the greedy approach.

**Related problems:** [Make the Prefix Sum Non-negative](/problem/make-the-prefix-sum-non-negative), [Find Building Where Alice and Bob Can Meet](/problem/find-building-where-alice-and-bob-can-meet)
