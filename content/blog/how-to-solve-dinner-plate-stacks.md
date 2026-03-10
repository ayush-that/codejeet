---
title: "How to Solve Dinner Plate Stacks — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Dinner Plate Stacks. Hard difficulty, 33.5% acceptance rate. Topics: Hash Table, Stack, Design, Heap (Priority Queue)."
date: "2029-09-14"
category: "dsa-patterns"
tags: ["dinner-plate-stacks", "hash-table", "stack", "design", "hard"]
---

# How to Solve Dinner Plate Stacks

This problem asks you to design a dinner plate system where you have multiple stacks with a fixed capacity. You need to support three operations: pushing a plate onto the leftmost non-full stack, popping a plate from the rightmost non-empty stack, and popping from a specific stack. The challenge is making all operations efficient—naive approaches would be too slow for the constraints.

What makes this problem interesting is that you need to track both the leftmost available stack for pushes and the rightmost non-empty stack for pops, while also handling random stack pops efficiently. This requires clever data structure choices beyond simple arrays.

## Visual Walkthrough

Let's trace through an example with capacity = 2:

1. Initialize: `DinnerPlates(2)` creates empty stacks
2. `push(1)`: Leftmost available stack is index 0. Push 1 to stack 0 → `[[1]]`
3. `push(2)`: Stack 0 has space. Push 2 to stack 0 → `[[1,2]]`
4. `push(3)`: Stack 0 is full. Need new stack at index 1. Push 3 → `[[1,2],[3]]`
5. `push(4)`: Stack 1 has space. Push 4 → `[[1,2],[3,4]]`
6. `pop()`: Rightmost non-empty stack is index 1. Pop from stack 1 → returns 4. `[[1,2],[3]]`
7. `popAtStack(0)`: Pop from stack 0 → returns 2. `[[1],[3]]`
8. `push(5)`: Leftmost available stack is now index 0 (has space). Push 5 → `[[1,5],[3]]`
9. `pop()`: Rightmost non-empty stack is index 1. Pop from stack 1 → returns 3. `[[1,5]]`

The tricky part: after `popAtStack`, we need to remember that stack 0 now has space for future pushes, but we also need to efficiently find the rightmost non-empty stack for `pop()`.

## Brute Force Approach

A naive approach would maintain an array of stacks. For each operation:

- `push(val)`: Iterate through stacks from left to right until finding one with space
- `pop()`: Iterate from right to left until finding a non-empty stack
- `popAtStack(index)`: Simply pop from that stack if it exists and isn't empty

The problem? In the worst case, each operation could be O(n) where n is the number of stacks. With up to 200,000 operations, this would be far too slow.

```python
# Brute force - too slow for constraints
class DinnerPlates:
    def __init__(self, capacity):
        self.capacity = capacity
        self.stacks = []

    def push(self, val):
        # O(n) scan for first non-full stack
        for stack in self.stacks:
            if len(stack) < self.capacity:
                stack.append(val)
                return
        # All stacks full, create new one
        self.stacks.append([val])

    def pop(self):
        # O(n) scan from right for first non-empty stack
        for i in range(len(self.stacks)-1, -1, -1):
            if self.stacks[i]:
                return self.stacks[i].pop()
        return -1

    def popAtStack(self, index):
        # O(1) but leaves "holes" that break future operations
        if index < len(self.stacks) and self.stacks[index]:
            return self.stacks[index].pop()
        return -1
```

The brute force fails because:

1. Linear scans for `push` and `pop` are too slow
2. After `popAtStack`, we don't track which stacks now have space
3. We might waste memory keeping empty stacks at the end

## Optimized Approach

The key insight is we need to efficiently track:

1. **Leftmost non-full stack** for `push()` operations
2. **Rightmost non-empty stack** for `pop()` operations
3. **Any stack with elements** for `popAtStack()`

We can solve this with:

- A **min-heap** to track indices of non-full stacks (for `push`)
- A **max-heap** to track indices of non-empty stacks (for `pop`)
- An **array of stacks** to store the actual data

However, there's a complication: when we pop from a middle stack via `popAtStack(index)`, that stack becomes non-full, so we should add it to the min-heap. But we also need to update the max-heap if that stack becomes empty.

Actually, we can simplify: use just **one min-heap** for available push positions, and maintain the rightmost non-empty stack separately. But we need to handle stale heap entries (indices that are no longer valid).

Better approach:

1. Maintain `stacks` array and `capacity`
2. Use a **min-heap** `available` to store indices of stacks with space
3. Track `rightmost` index that has elements
4. When pushing: get smallest index from heap, push there, update heap
5. When popping: pop from `rightmost` stack, update `rightmost` if needed
6. When `popAtStack`: pop from that stack, add its index to heap if now has space

But wait—what if we pop from a stack left of `rightmost`? The `rightmost` pointer might become stale. We need to decrement it when the current rightmost becomes empty.

## Optimal Solution

We need two heaps: one min-heap for available push positions, and one max-heap for non-empty stacks. But we must handle stale entries carefully. Here's the complete strategy:

1. **Data Structures**:
   - `stacks`: List of stacks (arrays)
   - `capacity`: Maximum stack size
   - `available`: Min-heap of stack indices that have space
   - `non_empty`: Max-heap of stack indices that have elements

2. **Operations**:
   - `push(val)`: Get smallest available index from heap, push value, update heaps
   - `pop()`: Get largest non-empty index from max-heap, pop value, update heaps
   - `popAtStack(index)`: Pop from that stack, update both heaps

3. **Key Detail**: We need to clean stale heap entries. An index in `available` might refer to a full stack (if we pushed there). An index in `non_empty` might refer to an empty stack (if we popped from it). We check this when popping from heaps.

<div class="code-group">

```python
# Time: O(log n) for all operations | Space: O(n)
import heapq

class DinnerPlates:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.stacks = []  # List of stacks
        # Min-heap of indices where we can push (stacks with space)
        self.available = []
        # Max-heap of indices of non-empty stacks
        self.non_empty = []

    def push(self, val: int) -> None:
        # Clean stale entries from available heap
        # (indices that are now full or out of bounds)
        while self.available and (
            self.available[0] >= len(self.stacks) or
            len(self.stacks[self.available[0]]) == self.capacity
        ):
            heapq.heappop(self.available)

        # If no available stack, create new one
        if not self.available:
            heapq.heappush(self.available, len(self.stacks))
            self.stacks.append([])

        # Get leftmost available index
        index = heapq.heappop(self.available)

        # Push value to that stack
        self.stacks[index].append(val)

        # Add to non_empty heap if this stack was empty before push
        if len(self.stacks[index]) == 1:  # Was empty, now has 1 element
            heapq.heappush(self.non_empty, -index)  # Max-heap using negative

        # If stack still has space, add back to available
        if len(self.stacks[index]) < self.capacity:
            heapq.heappush(self.available, index)

    def pop(self) -> int:
        # Clean stale entries from non_empty heap
        # (indices that are now empty or out of bounds)
        while self.non_empty and (
            -self.non_empty[0] >= len(self.stacks) or
            not self.stacks[-self.non_empty[0]]
        ):
            heapq.heappop(self.non_empty)

        # If no non-empty stacks, return -1
        if not self.non_empty:
            return -1

        # Get rightmost non-empty index
        index = -heapq.heappop(self.non_empty)

        # Pop value from that stack
        val = self.stacks[index].pop()

        # Add to available heap since stack now has space
        heapq.heappush(self.available, index)

        # If stack still has elements, add back to non_empty
        if self.stacks[index]:
            heapq.heappush(self.non_empty, -index)

        return val

    def popAtStack(self, index: int) -> int:
        # Check if index is valid and stack has elements
        if index >= len(self.stacks) or not self.stacks[index]:
            return -1

        # Pop value from specified stack
        val = self.stacks[index].pop()

        # Add to available heap since stack now has space
        heapq.heappush(self.available, index)

        # If stack still has elements, ensure it's in non_empty
        # (it might already be there, but duplicates are okay)
        if self.stacks[index]:
            heapq.heappush(self.non_empty, -index)

        return val
```

```javascript
// Time: O(log n) for all operations | Space: O(n)
class DinnerPlates {
  constructor(capacity) {
    this.capacity = capacity;
    this.stacks = []; // Array of stacks
    // Min-heap of indices where we can push (stacks with space)
    this.available = new MinHeap();
    // Max-heap of indices of non-empty stacks
    this.nonEmpty = new MaxHeap();
  }

  push(val) {
    // Clean stale entries from available heap
    while (
      this.available.size() > 0 &&
      (this.available.peek() >= this.stacks.length ||
        this.stacks[this.available.peek()].length === this.capacity)
    ) {
      this.available.poll();
    }

    // If no available stack, create new one
    if (this.available.size() === 0) {
      this.available.offer(this.stacks.length);
      this.stacks.push([]);
    }

    // Get leftmost available index
    const index = this.available.poll();

    // Push value to that stack
    this.stacks[index].push(val);

    // Add to nonEmpty heap if this stack was empty before push
    if (this.stacks[index].length === 1) {
      this.nonEmpty.offer(index);
    }

    // If stack still has space, add back to available
    if (this.stacks[index].length < this.capacity) {
      this.available.offer(index);
    }
  }

  pop() {
    // Clean stale entries from nonEmpty heap
    while (
      this.nonEmpty.size() > 0 &&
      (this.nonEmpty.peek() >= this.stacks.length || this.stacks[this.nonEmpty.peek()].length === 0)
    ) {
      this.nonEmpty.poll();
    }

    // If no non-empty stacks, return -1
    if (this.nonEmpty.size() === 0) {
      return -1;
    }

    // Get rightmost non-empty index
    const index = this.nonEmpty.poll();

    // Pop value from that stack
    const val = this.stacks[index].pop();

    // Add to available heap since stack now has space
    this.available.offer(index);

    // If stack still has elements, add back to nonEmpty
    if (this.stacks[index].length > 0) {
      this.nonEmpty.offer(index);
    }

    return val;
  }

  popAtStack(index) {
    // Check if index is valid and stack has elements
    if (index >= this.stacks.length || this.stacks[index].length === 0) {
      return -1;
    }

    // Pop value from specified stack
    const val = this.stacks[index].pop();

    // Add to available heap since stack now has space
    this.available.offer(index);

    // If stack still has elements, ensure it's in nonEmpty
    if (this.stacks[index].length > 0) {
      this.nonEmpty.offer(index);
    }

    return val;
  }
}

// Min Heap implementation
class MinHeap {
  constructor() {
    this.heap = [];
  }

  offer(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  poll() {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return root;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  sinkDown(index) {
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

// Max Heap implementation (using negative values for min heap)
class MaxHeap {
  constructor() {
    this.heap = new MinHeap();
  }

  offer(val) {
    this.heap.offer(-val);
  }

  poll() {
    const val = this.heap.poll();
    return val !== null ? -val : null;
  }

  peek() {
    const val = this.heap.peek();
    return val !== null ? -val : null;
  }

  size() {
    return this.heap.size();
  }
}
```

```java
// Time: O(log n) for all operations | Space: O(n)
import java.util.*;

class DinnerPlates {
    private int capacity;
    private List<Stack<Integer>> stacks;
    private PriorityQueue<Integer> available; // Min-heap for push positions
    private PriorityQueue<Integer> nonEmpty; // Max-heap for pop positions

    public DinnerPlates(int capacity) {
        this.capacity = capacity;
        this.stacks = new ArrayList<>();
        this.available = new PriorityQueue<>();
        this.nonEmpty = new PriorityQueue<>(Collections.reverseOrder());
    }

    public void push(int val) {
        // Clean stale entries from available heap
        while (!available.isEmpty() && (
            available.peek() >= stacks.size() ||
            stacks.get(available.peek()).size() == capacity
        )) {
            available.poll();
        }

        // If no available stack, create new one
        if (available.isEmpty()) {
            available.offer(stacks.size());
            stacks.add(new Stack<>());
        }

        // Get leftmost available index
        int index = available.poll();

        // Push value to that stack
        stacks.get(index).push(val);

        // Add to nonEmpty heap if this stack was empty before push
        if (stacks.get(index).size() == 1) {
            nonEmpty.offer(index);
        }

        // If stack still has space, add back to available
        if (stacks.get(index).size() < capacity) {
            available.offer(index);
        }
    }

    public int pop() {
        // Clean stale entries from nonEmpty heap
        while (!nonEmpty.isEmpty() && (
            nonEmpty.peek() >= stacks.size() ||
            stacks.get(nonEmpty.peek()).isEmpty()
        )) {
            nonEmpty.poll();
        }

        // If no non-empty stacks, return -1
        if (nonEmpty.isEmpty()) {
            return -1;
        }

        // Get rightmost non-empty index
        int index = nonEmpty.poll();

        // Pop value from that stack
        int val = stacks.get(index).pop();

        // Add to available heap since stack now has space
        available.offer(index);

        // If stack still has elements, add back to nonEmpty
        if (!stacks.get(index).isEmpty()) {
            nonEmpty.offer(index);
        }

        return val;
    }

    public int popAtStack(int index) {
        // Check if index is valid and stack has elements
        if (index >= stacks.size() || stacks.get(index).isEmpty()) {
            return -1;
        }

        // Pop value from specified stack
        int val = stacks.get(index).pop();

        // Add to available heap since stack now has space
        available.offer(index);

        // If stack still has elements, ensure it's in nonEmpty
        if (!stacks.get(index).isEmpty()) {
            nonEmpty.offer(index);
        }

        return val;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `push(val)`: O(log n) - heap operations dominate
- `pop()`: O(log n) - heap operations dominate
- `popAtStack(index)`: O(log n) - heap operations dominate

Where n is the number of stacks. The heap cleanup might seem like O(n), but each index is added and removed at most once from each heap, so amortized O(log n).

**Space Complexity:** O(n) where n is the total number of plates stored. We store each plate once in the stacks, plus O(n) heap entries in the worst case.

## Common Mistakes

1. **Not handling stale heap entries**: After multiple push/pop operations, heap entries can become invalid (referring to full or empty stacks). Always check validity before using heap top.

2. **Using only one heap**: Some candidates try using just a min-heap for available positions, but then `pop()` becomes O(n) as they search for the rightmost non-empty stack.

3. **Forgetting to update both heaps**: When you `popAtStack(index)`, you need to add that index to BOTH the available heap (since it now has space) AND ensure it's in the non-empty heap if it still has elements.

4. **Incorrect heap ordering for max-heap**: In languages without built-in max-heaps, remember to use negative values or custom comparators. JavaScript solution shows this clearly.

## When You'll See This Pattern

This "dual heap with lazy deletion" pattern appears in problems where you need to efficiently track both minimum and maximum available positions:

1. **Find Median from Data Stream (LeetCode 295)**: Uses two heaps to track smaller and larger halves of numbers.
2. **Sliding Window Maximum (LeetCode 239)**: Uses a deque to track maximum while efficiently removing stale elements.
3. **The Skyline Problem (LeetCode 218)**: Uses a heap to track building heights with removal of expired buildings.

The core idea is maintaining multiple views of the same data (min and max) while efficiently removing outdated entries.

## Key Takeaways

1. **Dual heaps for min/max tracking**: When you need to efficiently find both minimum and maximum elements with updates, consider using two heaps with lazy deletion.

2. **Lazy deletion pattern**: Instead of immediately removing stale entries from heaps, check validity at usage time. This keeps operations efficient.

3. **Design problems often need multiple DS**: Real-world system design (like this dinner plate system) usually requires combining several data structures to achieve all required operations efficiently.

[Practice this problem on CodeJeet](/problem/dinner-plate-stacks)
