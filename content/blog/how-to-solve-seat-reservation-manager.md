---
title: "How to Solve Seat Reservation Manager — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Seat Reservation Manager. Medium difficulty, 67.1% acceptance rate. Topics: Design, Heap (Priority Queue)."
date: "2026-09-26"
category: "dsa-patterns"
tags: ["seat-reservation-manager", "design", "heap-(priority-queue)", "medium"]
---

# How to Solve Seat Reservation Manager

This problem asks us to design a system that manages seat reservations where seats are numbered from 1 to n. The tricky part is that we need to efficiently handle two operations: reserve the smallest-numbered available seat, and unreserve (return) a seat to the available pool. The challenge lies in maintaining the available seats in sorted order while minimizing time complexity for both operations.

## Visual Walkthrough

Let's trace through a small example with n = 5 seats:

**Initialization**: SeatManager(5) creates seats [1, 2, 3, 4, 5] all available.

**Operation 1**: reserve() → returns 1 (smallest available)

- Available seats: [2, 3, 4, 5]

**Operation 2**: reserve() → returns 2 (smallest available)

- Available seats: [3, 4, 5]

**Operation 3**: unreserve(2) → seat 2 becomes available again

- Available seats: [2, 3, 4, 5] (but 2 should be at the front since it's smallest)

**Operation 4**: reserve() → returns 2 (not 3, because 2 is now smallest)

- Available seats: [3, 4, 5]

The key insight: we always need to track the smallest available seat number, and when a seat is unreserved, we need to insert it back into the available pool while maintaining the order.

## Brute Force Approach

A naive approach would be to maintain a boolean array or set to track seat availability:

1. **Initialize**: Create a boolean array `available` of size n+1, all set to true
2. **reserve()**: Scan from 1 to n, find the first `available[i]` that's true, mark it false, return i
3. **unreserve(seatNumber)**: Simply set `available[seatNumber]` = true

**Why this fails**:

- `reserve()` takes O(n) time in worst case (scanning all seats)
- With many reserve/unreserve operations, this becomes prohibitively slow
- The problem constraints (up to 10^5 operations) make O(n) per operation unacceptable

<div class="code-group">

```python
# Time: O(n) per reserve, O(1) per unreserve | Space: O(n)
class SeatManager:
    def __init__(self, n: int):
        # Track seat availability
        self.available = [True] * (n + 1)  # Index 0 unused
        self.n = n

    def reserve(self) -> int:
        # Scan for first available seat - O(n) operation
        for seat in range(1, self.n + 1):
            if self.available[seat]:
                self.available[seat] = False
                return seat
        return -1  # Should never happen if called correctly

    def unreserve(self, seatNumber: int) -> None:
        # Simply mark seat as available
        self.available[seatNumber] = True
```

```javascript
// Time: O(n) per reserve, O(1) per unreserve | Space: O(n)
class SeatManager {
  constructor(n) {
    // Track seat availability
    this.available = new Array(n + 1).fill(true); // Index 0 unused
    this.n = n;
  }

  reserve() {
    // Scan for first available seat - O(n) operation
    for (let seat = 1; seat <= this.n; seat++) {
      if (this.available[seat]) {
        this.available[seat] = false;
        return seat;
      }
    }
    return -1; // Should never happen if called correctly
  }

  unreserve(seatNumber) {
    // Simply mark seat as available
    this.available[seatNumber] = true;
  }
}
```

```java
// Time: O(n) per reserve, O(1) per unreserve | Space: O(n)
class SeatManager {
    private boolean[] available;
    private int n;

    public SeatManager(int n) {
        // Track seat availability
        this.available = new boolean[n + 1]; // Index 0 unused
        this.n = n;
        // Java arrays default to false, so we need to initialize to true
        for (int i = 1; i <= n; i++) {
            available[i] = true;
        }
    }

    public int reserve() {
        // Scan for first available seat - O(n) operation
        for (int seat = 1; seat <= n; seat++) {
            if (available[seat]) {
                available[seat] = false;
                return seat;
            }
        }
        return -1; // Should never happen if called correctly
    }

    public void unreserve(int seatNumber) {
        // Simply mark seat as available
        available[seatNumber] = true;
    }
}
```

</div>

## Optimized Approach

The key insight is that we need a data structure that:

1. Efficiently gives us the smallest available seat (for `reserve()`)
2. Efficiently inserts a seat back into the available pool (for `unreserve()`)
3. Maintains seats in sorted order

A **min-heap (priority queue)** is perfect for this:

- **reserve()**: Extract the minimum element from the heap (O(log n))
- **unreserve()**: Push the seat number back into the heap (O(log n))
- **Initialization**: Push all seat numbers 1 through n into the heap (O(n))

**Why a heap works**:

- A min-heap always keeps the smallest element at the root
- Both insertion and extraction are O(log n) operations
- We don't need to maintain a fully sorted array, just need quick access to the minimum

**Step-by-step reasoning**:

1. **Initialize**: Add all seats (1 to n) to a min-heap
2. **reserve()**: Pop from heap (gives smallest available seat)
3. **unreserve(seatNumber)**: Push seatNumber back to heap

**Important optimization**: Instead of initially adding all n seats to the heap, we can use a counter. Since seats are numbered sequentially starting from 1, we can:

- Keep track of the next available seat number
- Only add seats to the heap when they're unreserved
- This reduces initialization time from O(n) to O(1)

## Optimal Solution

Here's the complete solution using a min-heap with the counter optimization:

<div class="code-group">

```python
# Time: O(log n) per operation | Space: O(n) for the heap
import heapq

class SeatManager:
    def __init__(self, n: int):
        """
        Initialize the seat manager with n seats.
        We use a min-heap to track available seats and a counter
        for the next new seat that hasn't been reserved yet.
        """
        # Min-heap to store available seats
        self.available_seats = []
        # Counter for the next seat number to assign
        self.next_seat = 1

    def reserve(self) -> int:
        """
        Reserve and return the smallest-numbered available seat.
        If heap has seats, pop from heap (unreserved seats).
        Otherwise, use next_seat counter (new seat).
        """
        if self.available_seats:
            # Get smallest available seat from heap
            return heapq.heappop(self.available_seats)
        else:
            # No unreserved seats, use next new seat
            seat = self.next_seat
            self.next_seat += 1
            return seat

    def unreserve(self, seatNumber: int) -> None:
        """
        Unreserve a seat, making it available for future reservations.
        Add it back to the min-heap so it can be reserved again.
        """
        heapq.heappush(self.available_seats, seatNumber)
```

```javascript
// Time: O(log n) per operation | Space: O(n) for the heap
class SeatManager {
  constructor(n) {
    /**
     * Initialize the seat manager with n seats.
     * We use a min-heap to track available seats and a counter
     * for the next new seat that hasn't been reserved yet.
     */
    // Min-heap to store available seats
    this.availableSeats = new MinHeap();
    // Counter for the next seat number to assign
    this.nextSeat = 1;
  }

  reserve() {
    /**
     * Reserve and return the smallest-numbered available seat.
     * If heap has seats, pop from heap (unreserved seats).
     * Otherwise, use nextSeat counter (new seat).
     */
    if (this.availableSeats.size() > 0) {
      // Get smallest available seat from heap
      return this.availableSeats.pop();
    } else {
      // No unreserved seats, use next new seat
      const seat = this.nextSeat;
      this.nextSeat++;
      return seat;
    }
  }

  unreserve(seatNumber) {
    /**
     * Unreserve a seat, making it available for future reservations.
     * Add it back to the min-heap so it can be reserved again.
     */
    this.availableSeats.push(seatNumber);
  }
}

// Min-heap implementation for JavaScript
class MinHeap {
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
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < length && this.heap[right] < this.heap[smallest]) {
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
// Time: O(log n) per operation | Space: O(n) for the heap
import java.util.PriorityQueue;

class SeatManager {
    private PriorityQueue<Integer> availableSeats;
    private int nextSeat;

    public SeatManager(int n) {
        /**
         * Initialize the seat manager with n seats.
         * We use a min-heap to track available seats and a counter
         * for the next new seat that hasn't been reserved yet.
         */
        // Min-heap to store available seats
        this.availableSeats = new PriorityQueue<>();
        // Counter for the next seat number to assign
        this.nextSeat = 1;
    }

    public int reserve() {
        /**
         * Reserve and return the smallest-numbered available seat.
         * If heap has seats, poll from heap (unreserved seats).
         * Otherwise, use nextSeat counter (new seat).
         */
        if (!availableSeats.isEmpty()) {
            // Get smallest available seat from heap
            return availableSeats.poll();
        } else {
            // No unreserved seats, use next new seat
            int seat = nextSeat;
            nextSeat++;
            return seat;
        }
    }

    public void unreserve(int seatNumber) {
        /**
         * Unreserve a seat, making it available for future reservations.
         * Add it back to the min-heap so it can be reserved again.
         */
        availableSeats.offer(seatNumber);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- `__init__` / `constructor`: O(1) with counter optimization (O(n) if we initially add all seats to heap)
- `reserve()`: O(log n) for heap pop operation
- `unreserve()`: O(log n) for heap push operation

**Space Complexity**: O(n) in the worst case where all seats are unreserved and stored in the heap.

**Why these complexities**:

- Heap operations (push/pop) are O(log n) where n is the number of elements in the heap
- In worst case, all n seats could be in the heap (if all are unreserved)
- The counter optimization avoids O(n) initialization time

## Common Mistakes

1. **Using array/linear scan for reserve()**: This is the most common mistake. Candidates try to maintain a sorted list or scan an array, resulting in O(n) time per reserve operation. Always ask yourself: "Do I need quick access to the minimum element?" If yes, think heap.

2. **Forgetting to handle the initial seat assignment**: Some candidates only use a heap and forget that initially all seats 1..n are available. They might initialize an empty heap and get stuck. The counter optimization elegantly solves this.

3. **Using max-heap instead of min-heap**: The problem asks for the _smallest_-numbered available seat. A max-heap would give you the largest. Remember: min-heap for smallest, max-heap for largest.

4. **Not considering seat numbers start at 1**: Some candidates might start seat numbering at 0. Always read the problem statement carefully: "seats that are numbered from `1` to `n`".

## When You'll See This Pattern

The min-heap pattern for managing "smallest available resource" appears in several problems:

1. **Design Phone Directory (LeetCode 379)**: Similar concept but with additional constraints like checking if a number is available. Uses similar heap-based approach.

2. **Design a Number Container System (LeetCode 2349)**: More complex version where you need to track multiple indices for each number, but uses similar priority queue concepts.

3. **Meeting Rooms II (LeetCode 253)**: Uses min-heap to track the earliest ending meeting time when scheduling rooms.

4. **Kth Largest Element in a Stream (LeetCode 703)**: Uses heap to maintain top k elements efficiently.

The pattern to recognize: **When you need to repeatedly get the smallest (or largest) element from a dynamic collection, think heap**.

## Key Takeaways

1. **Min-heap for minimum element access**: When a problem requires repeatedly accessing the smallest element from a changing collection, a min-heap provides O(log n) operations for both insertion and extraction.

2. **Counter optimization for sequential resources**: When dealing with sequentially numbered resources (1, 2, 3, ...), you can use a counter for new resources and a heap for returned resources, avoiding O(n) initialization.

3. **Recognize the "smallest available" pattern**: This is a classic design pattern for resource management systems. The next time you see "reserve the smallest available X" or "assign the smallest free ID", immediately think of a min-heap solution.

Related problems: [Design Phone Directory](/problem/design-phone-directory), [Design a Number Container System](/problem/design-a-number-container-system)
