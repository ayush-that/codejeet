---
title: "How to Solve Maximum Number of Eaten Apples — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Eaten Apples. Medium difficulty, 42.8% acceptance rate. Topics: Array, Greedy, Heap (Priority Queue)."
date: "2029-03-31"
category: "dsa-patterns"
tags: ["maximum-number-of-eaten-apples", "array", "greedy", "heap-(priority-queue)", "medium"]
---

# How to Solve Maximum Number of Eaten Apples

This problem asks us to maximize the number of apples we can eat from a tree that produces apples over `n` days, where apples grown on day `i` rot after `days[i]` days. The tricky part is that we can only eat one apple per day, and we need to strategically choose which apples to eat each day to minimize waste from rotting.

## Visual Walkthrough

Let's trace through a small example:  
`apples = [1, 2, 3, 5, 2]` and `days = [3, 2, 1, 4, 2]`

**Day 0:** Tree grows 1 apple that rots on day 3 (0 + 3). We eat 1 apple. Remaining: 0 apples.
**Day 1:** Tree grows 2 apples that rot on day 3 (1 + 2). We eat 1 apple. Remaining: 1 apple (rot day 3).
**Day 2:** Tree grows 3 apples that rot on day 3 (2 + 1). We have: 1 apple (rot day 3) + 3 apples (rot day 3). We eat 1 apple. Remaining: 3 apples (all rot day 3).
**Day 3:** Tree grows 5 apples that rot on day 7 (3 + 4). We have: 3 apples (rot today!) + 5 apples (rot day 7). We eat 1 apple from the rotting batch. Remaining: 2 apples (rot today) + 5 apples (rot day 7).
**Day 4:** Tree grows 2 apples that rot on day 6 (4 + 2). We have: 2 apples (rot yesterday - discard) + 5 apples (rot day 7) + 2 apples (rot day 6). We eat 1 apple from batch rotting day 6 (earliest rot date). Remaining: 5 apples (rot day 7) + 1 apple (rot day 6).

The key insight: **Always eat the apple that will rot first** to minimize waste. This is a classic "greedy" strategy that requires us to track multiple batches of apples with different rot dates.

## Brute Force Approach

A naive approach would be to simulate each day and check all available apple batches to find the one rotting soonest:

1. For each day from 0 to n-1 (and beyond while we still have apples):
   - Add new apples from the current day to our collection
   - Remove any rotten apples (rot date ≤ current day)
   - Find the batch with the earliest rot date
   - Eat one apple from that batch
   - Increment count

The problem is finding the earliest rot date efficiently. If we store batches in an unsorted list, finding the minimum rot date takes O(k) time where k is the number of batches. Since k can be up to n (and we process potentially up to 2n days), this gives O(n²) time complexity, which is too slow for n up to 2×10⁴.

## Optimized Approach

The key insight is that we need a data structure that can:

1. Quickly add new apple batches (with their rot dates)
2. Quickly find the batch with the earliest rot date
3. Efficiently remove batches when they're empty or rotten

A **min-heap (priority queue)** is perfect for this. We store `(rot_day, count)` pairs, where `rot_day` is when the apples rot, and `count` is how many apples remain in that batch. The heap automatically keeps the earliest rot date at the top.

**Algorithm steps:**

1. Initialize a min-heap and `eaten = 0`
2. For each day `i` from 0 to n-1 (and continue while heap not empty):
   - If `i < n` and `apples[i] > 0`, add `(i + days[i], apples[i])` to heap
   - Remove any rotten batches from heap top (rot_day ≤ i)
   - If heap not empty, eat one apple from top batch
     - Decrement count in top batch
     - If count becomes 0, remove from heap
   - Increment `eaten`
3. Return `eaten`

**Why this works:** By always eating from the batch with the earliest rot date, we minimize waste. The heap ensures we can find this batch in O(log n) time instead of O(n).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) where n is the length of apples/days
# Space: O(n) for the heap
import heapq

def eatenApples(apples, days):
    """
    Calculate maximum number of apples that can be eaten.

    Args:
        apples: List[int] - apples grown each day
        days: List[int] - days until apples rot

    Returns:
        int: Maximum apples eaten
    """
    n = len(apples)
    heap = []  # Min-heap storing (rot_day, count)
    eaten = 0
    day = 0

    # Continue while we have apples to process or apples in heap
    while day < n or heap:
        # Add new apples if we're within the n-day growing period
        if day < n and apples[day] > 0:
            rot_day = day + days[day]
            heapq.heappush(heap, (rot_day, apples[day]))

        # Remove rotten apples from top of heap
        while heap and heap[0][0] <= day:
            heapq.heappop(heap)

        # Eat one apple if available
        if heap:
            rot_day, count = heap[0]
            # Eat one apple from this batch
            eaten += 1

            # Update heap: decrease count or remove if empty
            if count == 1:
                heapq.heappop(heap)  # Batch is now empty
            else:
                # Decrease count by 1
                heapq.heapreplace(heap, (rot_day, count - 1))

        day += 1

    return eaten
```

```javascript
// Time: O(n log n) where n is the length of apples/days
// Space: O(n) for the heap
function eatenApples(apples, days) {
  const n = apples.length;
  const heap = new MinHeap(); // Stores [rotDay, count]
  let eaten = 0;
  let day = 0;

  // Custom MinHeap implementation for JavaScript
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    push(val) {
      this.heap.push(val);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      if (this.heap.length === 1) return this.heap.pop();
      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.sinkDown(0);
      return min;
    }

    peek() {
      return this.heap[0];
    }

    size() {
      return this.heap.length;
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
        let element = this.heap[index];

        if (left < length && this.heap[left][0] < element[0]) {
          swap = left;
        }

        if (right < length) {
          if (
            (swap === null && this.heap[right][0] < element[0]) ||
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

  while (day < n || heap.size() > 0) {
    // Add new apples if we're within the n-day growing period
    if (day < n && apples[day] > 0) {
      const rotDay = day + days[day];
      heap.push([rotDay, apples[day]]);
    }

    // Remove rotten apples from top of heap
    while (heap.size() > 0 && heap.peek()[0] <= day) {
      heap.pop();
    }

    // Eat one apple if available
    if (heap.size() > 0) {
      const [rotDay, count] = heap.peek();
      eaten++;

      // Update heap: decrease count or remove if empty
      if (count === 1) {
        heap.pop(); // Batch is now empty
      } else {
        // Decrease count by 1 using pop and push
        heap.pop();
        heap.push([rotDay, count - 1]);
      }
    }

    day++;
  }

  return eaten;
}
```

```java
// Time: O(n log n) where n is the length of apples/days
// Space: O(n) for the heap
import java.util.PriorityQueue;

class Solution {
    public int eatenApples(int[] apples, int[] days) {
        int n = apples.length;
        // Min-heap storing pairs [rotDay, count], sorted by rotDay
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        int eaten = 0;
        int day = 0;

        while (day < n || !heap.isEmpty()) {
            // Add new apples if we're within the n-day growing period
            if (day < n && apples[day] > 0) {
                int rotDay = day + days[day];
                heap.offer(new int[]{rotDay, apples[day]});
            }

            // Remove rotten apples from top of heap
            while (!heap.isEmpty() && heap.peek()[0] <= day) {
                heap.poll();
            }

            // Eat one apple if available
            if (!heap.isEmpty()) {
                int[] batch = heap.peek();
                eaten++;

                // Update heap: decrease count or remove if empty
                if (batch[1] == 1) {
                    heap.poll();  // Batch is now empty
                } else {
                    batch[1]--;  // Decrease count by 1
                }
            }

            day++;
        }

        return eaten;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- We process at most 2n days (n days of growth + up to n days of eating remaining apples)
- Each day we perform heap operations: push (O(log n)), pop (O(log n)), and peek (O(1))
- In worst case, we have O(n) heap operations, each O(log n), giving O(n log n)

**Space Complexity:** O(n)

- The heap stores at most n batches (one for each day apples are grown)
- Each batch is a tuple of (rot_day, count), constant space per batch

## Common Mistakes

1. **Forgetting to continue eating after day n:** The tree stops growing apples after n days, but we can still eat apples that haven't rotted. The loop should continue while `day < n OR heap is not empty`.

2. **Not removing rotten apples before eating:** Always check and remove rotten batches (rot_day ≤ current day) BEFORE attempting to eat an apple. Otherwise, you might try to eat a rotten apple.

3. **Incorrect heap update when eating:** When eating one apple from a batch, you need to either:
   - Decrement the count if > 1 apple remains
   - Remove the batch if it was the last apple
     Many candidates forget to properly update the heap after eating.

4. **Off-by-one errors with rot day calculation:** Remember `rot_day = i + days[i]` means apples rot ON day `i + days[i]`, so they're edible up to day `i + days[i] - 1`.

## When You'll See This Pattern

This "greedy with priority queue" pattern appears in scheduling problems where you need to process items in order of some priority (usually deadline or expiration):

1. **Meeting Rooms II (LeetCode 253)** - Similar "earliest end time" greedy strategy using heap to track ongoing meetings.
2. **Task Scheduler (LeetCode 621)** - Uses priority queue to schedule tasks with cooldown periods.
3. **IPO (LeetCode 502)** - Uses heap to select most profitable projects within capital constraints.
4. **Maximum Performance of a Team (LeetCode 1383)** - Combines sorting and heap to optimize team selection.

The pattern: When you need to repeatedly select the "best" item according to some criteria (earliest deadline, highest profit, etc.) from a dynamically changing set, a heap is often the right tool.

## Key Takeaways

1. **"Earliest deadline first" is often optimal** for scheduling problems with expiration constraints. This greedy approach minimizes waste.

2. **Heaps excel at maintaining dynamic minimum/maximum** when you need to frequently add/remove items and always access the extreme value.

3. **Simulation problems** often require careful day-by-day processing with cleanup steps (removing expired items) before taking actions.

[Practice this problem on CodeJeet](/problem/maximum-number-of-eaten-apples)
