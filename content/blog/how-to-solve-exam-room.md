---
title: "How to Solve Exam Room — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Exam Room. Medium difficulty, 43.2% acceptance rate. Topics: Design, Heap (Priority Queue), Ordered Set."
date: "2027-12-31"
category: "dsa-patterns"
tags: ["exam-room", "design", "heap-(priority-queue)", "ordered-set", "medium"]
---

# How to Solve Exam Room

This problem asks you to design an exam room where students always sit in the seat that maximizes their distance to the nearest occupied seat, breaking ties by choosing the lowest-numbered seat. What makes this problem interesting is that it's a **dynamic interval management** problem — seats get occupied over time, and we need to efficiently find the "best" gap between occupied seats at each step.

## Visual Walkthrough

Let's trace through a small example with `n = 10` seats:

**Initial state:** All seats empty

- First student enters: Room is empty, so they sit in seat 0 (lowest numbered)
- Occupied: `[0]`

**Second student enters:**

- Consider gaps: From start to seat 0 (distance 0), from seat 0 to end (distance 9)
- Best gap is from seat 0 to end: distance 9
- They sit at seat 9 (maximizes distance to seat 0)
- Occupied: `[0, 9]`

**Third student enters:**

- Gaps: Start to 0 (distance 0), 0 to 9 (distance 8), 9 to end (distance 0)
- Best gap is 0 to 9: distance 8
- They sit in the middle: seat 4 (floor((0+9)/2) = 4)
- Occupied: `[0, 4, 9]`

**Fourth student enters:**

- Gaps: Start to 0 (distance 0), 0 to 4 (distance 3), 4 to 9 (distance 4), 9 to end (distance 0)
- Best gap is 4 to 9: distance 4
- They sit in the middle: seat 6 (floor((4+9)/2) = 6)
- Occupied: `[0, 4, 6, 9]`

This shows the pattern: we need to track gaps between occupied seats and always pick the largest gap.

## Brute Force Approach

A naive approach would be to simulate the process directly:

- Store occupied seats in a sorted list
- For each `seat()` call:
  1. Handle empty room case (sit at seat 0)
  2. Check distance from seat 0 to first occupied seat
  3. Check all gaps between consecutive occupied seats
  4. Check distance from last occupied seat to seat n-1
  5. Pick the seat that maximizes distance

**Why this fails:** Each `seat()` operation would be O(k) where k is the number of occupied seats. With up to 10^4 operations, this could be O(n²) in worst case — far too slow.

## Optimized Approach

The key insight is that we need to **efficiently track and update gaps** between occupied seats. When a student sits:

1. They split an existing gap into two smaller gaps
2. We need to remove the old gap and add two new ones
3. We always want the largest gap (with tie-breaking rules)

This is perfect for a **max-heap (priority queue)**. However, we need to handle:

- **Max-heap ordering**: We want the largest gap first
- **Tie-breaking**: When gaps are equal, choose the one with smallest start seat
- **Lazy deletion**: When a gap gets split, we mark the old one as invalid

We'll store gaps as `(-distance, start, end)` in a heap, where:

- `distance` is negative because Python/Java heaps are min-heaps by default
- For a gap from `start` to `end`, the best seat is `(start + end) // 2`
- Distance calculation differs for edge gaps (start to first seat, last seat to end)

## Optimal Solution

We use a max-heap to store gaps, with custom comparison that prioritizes:

1. Largest distance
2. Smallest start seat (for tie-breaking)

When a student sits, we:

1. Pop the best gap from heap (skipping invalid ones)
2. Calculate the seat position
3. Split the gap into two new gaps
4. Add both new gaps to heap
5. Mark the seat as occupied

When a student leaves, we:

1. Find adjacent occupied seats
2. Merge the gaps around the vacated seat
3. Remove old invalid gaps
4. Add the new merged gap

<div class="code-group">

```python
import heapq
from sortedcontainers import SortedList

class ExamRoom:
    # Time: O(log n) for seat(), O(log n) for leave()
    # Space: O(n) for storing gaps and occupied seats

    def __init__(self, n: int):
        self.n = n
        # Store occupied seats in sorted order for quick neighbor lookup
        self.occupied = SortedList()
        # Max-heap: store (-distance, start, end) for gaps between occupied seats
        # We use negative distance because heapq is min-heap by default
        self.heap = []

    def _add_gap(self, start: int, end: int) -> None:
        """Add a gap from start to end to the heap."""
        if start < 0 or end > self.n:
            return

        if start == -1:  # Gap from start of room to first occupied seat
            distance = end
            seat_pos = 0
        elif end == self.n:  # Gap from last occupied seat to end of room
            distance = self.n - 1 - start
            seat_pos = self.n - 1
        else:  # Gap between two occupied seats
            distance = (end - start) // 2
            seat_pos = start + distance

        # Store with negative distance for max-heap behavior
        heapq.heappush(self.heap, (-distance, start, end, seat_pos))

    def seat(self) -> int:
        """Return the seat for the next student."""
        if not self.occupied:
            # Room is empty, sit at seat 0
            self.occupied.add(0)
            return 0

        # Pop the best gap, skipping invalid ones
        while self.heap:
            neg_dist, start, end, seat_pos = heapq.heappop(self.heap)
            # Check if this gap is still valid (both ends still occupied or at boundaries)
            start_valid = (start == -1) or (start in self.occupied)
            end_valid = (end == self.n) or (end in self.occupied)
            if start_valid and end_valid:
                # Found valid gap, place student in the middle
                self.occupied.add(seat_pos)

                # Split the gap into two new gaps
                self._add_gap(start, seat_pos)
                self._add_gap(seat_pos, end)
                return seat_pos

        # If we get here, something went wrong (shouldn't happen with correct implementation)
        return -1

    def leave(self, p: int) -> None:
        """Remove student from seat p."""
        self.occupied.remove(p)

        # Find neighbors of the vacated seat
        idx = self.occupied.bisect_left(p)
        left = self.occupied[idx - 1] if idx > 0 else -1
        right = self.occupied[idx] if idx < len(self.occupied) else self.n

        # Add the new merged gap
        self._add_gap(left, right)
```

```javascript
// Time: O(log n) for seat(), O(log n) for leave()
// Space: O(n) for storing gaps and occupied seats

class ExamRoom {
  constructor(n) {
    this.n = n;
    // Store occupied seats in sorted array
    this.occupied = [];
    // Max-heap: store gaps as {dist: -distance, start, end, seat}
    this.heap = new MinHeap((a, b) => {
      // Compare by distance (largest first due to negative), then by start seat
      if (a.dist !== b.dist) return a.dist - b.dist;
      return b.start - a.start;
    });
  }

  _addGap(start, end) {
    // Add a gap from start to end to the heap
    if (start < 0 || end > this.n) return;

    let distance, seat;
    if (start === -1) {
      // Gap from start of room to first occupied seat
      distance = end;
      seat = 0;
    } else if (end === this.n) {
      // Gap from last occupied seat to end of room
      distance = this.n - 1 - start;
      seat = this.n - 1;
    } else {
      // Gap between two occupied seats
      distance = Math.floor((end - start) / 2);
      seat = start + distance;
    }

    // Store with negative distance for max-heap behavior
    this.heap.push({ dist: -distance, start, end, seat });
  }

  seat() {
    if (this.occupied.length === 0) {
      // Room is empty, sit at seat 0
      this.occupied.push(0);
      this.occupied.sort((a, b) => a - b);
      return 0;
    }

    // Pop the best gap, skipping invalid ones
    while (!this.heap.isEmpty()) {
      const { dist, start, end, seat } = this.heap.pop();

      // Check if this gap is still valid
      const startValid = start === -1 || this.occupied.includes(start);
      const endValid = end === this.n || this.occupied.includes(end);

      if (startValid && endValid) {
        // Found valid gap, place student
        this.occupied.push(seat);
        this.occupied.sort((a, b) => a - b);

        // Split the gap
        this._addGap(start, seat);
        this._addGap(seat, end);
        return seat;
      }
    }

    // Handle edge case (shouldn't happen)
    return -1;
  }

  leave(p) {
    // Remove student from seat p
    const index = this.occupied.indexOf(p);
    if (index > -1) {
      this.occupied.splice(index, 1);
    }

    // Find neighbors
    let left = -1,
      right = this.n;
    for (const seat of this.occupied) {
      if (seat < p) left = seat;
      if (seat > p && right === this.n) {
        right = seat;
        break;
      }
    }

    // Add the new merged gap
    this._addGap(left, right);
  }
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return root;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(log n) for seat(), O(log n) for leave()
// Space: O(n) for storing gaps and occupied seats

import java.util.*;

class ExamRoom {
    private int n;
    private TreeSet<Integer> occupied;
    private PriorityQueue<Gap> heap;

    class Gap {
        int start;
        int end;
        int distance;
        int seat;

        Gap(int start, int end, int n) {
            this.start = start;
            this.end = end;

            if (start == -1) {
                // Gap from start of room to first occupied seat
                this.distance = end;
                this.seat = 0;
            } else if (end == n) {
                // Gap from last occupied seat to end of room
                this.distance = n - 1 - start;
                this.seat = n - 1;
            } else {
                // Gap between two occupied seats
                this.distance = (end - start) / 2;
                this.seat = start + this.distance;
            }
        }
    }

    public ExamRoom(int n) {
        this.n = n;
        this.occupied = new TreeSet<>();
        // Max-heap: larger distance first, then smaller start seat
        this.heap = new PriorityQueue<>((a, b) -> {
            if (a.distance != b.distance) {
                return b.distance - a.distance; // Larger distance first
            }
            return a.start - b.start; // Smaller start first
        });
    }

    private void addGap(int start, int end) {
        // Add a gap from start to end to the heap
        if (start < 0 || end > n) return;
        heap.offer(new Gap(start, end, n));
    }

    public int seat() {
        if (occupied.isEmpty()) {
            // Room is empty, sit at seat 0
            occupied.add(0);
            return 0;
        }

        // Pop the best gap, skipping invalid ones
        while (!heap.isEmpty()) {
            Gap gap = heap.poll();

            // Check if this gap is still valid
            boolean startValid = (gap.start == -1) || occupied.contains(gap.start);
            boolean endValid = (gap.end == n) || occupied.contains(gap.end);

            if (startValid && endValid) {
                // Found valid gap, place student
                occupied.add(gap.seat);

                // Split the gap into two new gaps
                addGap(gap.start, gap.seat);
                addGap(gap.seat, gap.end);
                return gap.seat;
            }
        }

        // Handle the case when heap is empty (first student or after leaves)
        // Check distances from start and end
        int first = occupied.first();
        int last = occupied.last();

        // Distance from start to first occupied seat
        int distToStart = first;
        // Distance from last occupied seat to end
        int distToEnd = n - 1 - last;

        if (distToStart >= distToEnd) {
            // Sit at seat 0
            occupied.add(0);
            addGap(0, first);
            return 0;
        } else {
            // Sit at seat n-1
            occupied.add(n - 1);
            addGap(last, n - 1);
            return n - 1;
        }
    }

    public void leave(int p) {
        occupied.remove(p);

        // Find neighbors of the vacated seat
        Integer left = occupied.lower(p);
        Integer right = occupied.higher(p);

        // Add the new merged gap
        addGap(left == null ? -1 : left, right == null ? n : right);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `seat()`: O(log n) for heap operations and O(log n) for maintaining sorted occupied seats
- `leave()`: O(log n) for heap operations and O(log n) for removing from sorted set
- Overall: O(log n) per operation

**Space Complexity:** O(n) for storing gaps in the heap and occupied seats in the sorted set.

The heap stores at most O(n) gaps (each seat addition creates at most 2 new gaps), and the sorted set stores all occupied seats.

## Common Mistakes

1. **Forgetting edge cases**: Not handling the gaps at the start (seat 0) and end (seat n-1) specially. These gaps have different distance calculations because students can sit right at the boundary.

2. **Incorrect tie-breaking**: When two gaps have the same distance, you must choose the one with the smallest start seat. Many candidates implement the heap comparator incorrectly.

3. **Not handling lazy deletion**: When a gap gets split, the old gap becomes invalid but remains in the heap. You must check validity when popping from the heap, not delete it immediately (which would be O(n)).

4. **Wrong seat calculation for middle gaps**: For a gap between seats `a` and `b`, the optimal seat is `(a + b) // 2`, not `(a + b) / 2` (which could give a float) or `a + (b - a) / 2`.

## When You'll See This Pattern

This **interval splitting with priority queue** pattern appears in problems where you need to dynamically maintain and query the "best" interval according to some metric:

1. **Maximize Distance to Closest Person** (LeetCode 849): Similar logic but static version — find the maximum distance to closest person in a fixed arrangement.

2. **The Skyline Problem** (LeetCode 218): Uses priority queues to track active building heights as you sweep through positions.

3. **Meeting Rooms II** (LeetCode 253): Uses heap to track ongoing meetings and allocate rooms efficiently.

The core idea is using a heap to always have quick access to the "best" element according to custom ordering, while supporting dynamic updates.

## Key Takeaways

1. **Heaps are ideal for "always get the best" scenarios**: When you need to repeatedly get the maximum/minimum element while adding/removing others, a heap provides O(log n) operations.

2. **Lazy deletion is a useful technique**: Instead of removing elements from a heap (which is O(n)), mark them as invalid and skip them when popping. This keeps operations O(log n).

3. **Edge cases matter in interval problems**: Always check boundaries (start and end) separately from middle intervals, as they often have different rules.

Related problems: [Maximize Distance to Closest Person](/problem/maximize-distance-to-closest-person)
