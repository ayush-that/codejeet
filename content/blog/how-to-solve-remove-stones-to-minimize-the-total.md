---
title: "How to Solve Remove Stones to Minimize the Total — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Stones to Minimize the Total. Medium difficulty, 65.5% acceptance rate. Topics: Array, Greedy, Heap (Priority Queue)."
date: "2026-09-28"
category: "dsa-patterns"
tags: ["remove-stones-to-minimize-the-total", "array", "greedy", "heap-(priority-queue)", "medium"]
---

# How to Solve Remove Stones to Minimize the Total

You're given an array of stone piles and must perform exactly `k` operations, each time removing `floor(piles[i]/2)` stones from any pile. Your goal is to minimize the total stones remaining. The challenge is that each operation reduces a pile significantly, but choosing which pile to reduce each time matters—this isn't just about always picking the largest pile once, but repeatedly picking the pile that will give you the biggest reduction _at that moment_.

## Visual Walkthrough

Let's trace through a concrete example: `piles = [5, 4, 9]`, `k = 2`.

**Initial state:** Total stones = 5 + 4 + 9 = 18

**Operation 1:** Which pile should we pick?

- Pick pile with 5: remove floor(5/2) = 2 stones → pile becomes 3
- Pick pile with 4: remove floor(4/2) = 2 stones → pile becomes 2
- Pick pile with 9: remove floor(9/2) = 4 stones → pile becomes 5

The greedy choice is to pick the largest pile (9) because removing 4 stones gives us the biggest reduction. After operation 1: piles = [5, 4, 5], total = 14

**Operation 2:** Now what's the largest pile?

- Piles are [5, 4, 5] (two piles with 5, one with 4)
- Pick either 5: remove floor(5/2) = 2 stones → pile becomes 3

After operation 2: piles = [3, 4, 5] or [5, 4, 3], total = 12

**Final answer:** 12 stones remain.

Notice that after the first operation, the largest pile changed from 9 to 5. If we had picked the second-largest pile (5) in the first operation, we'd have: piles = [3, 4, 9] → total = 16 after first operation, then picking 9: piles = [3, 4, 5] → total = 12. Same result this time, but the order matters in general.

The key insight: **Always pick the current largest pile** because removing `floor(piles[i]/2)` stones gives you a bigger absolute reduction from larger piles.

## Brute Force Approach

A naive approach would be: for each of the `k` operations, scan the entire array to find the maximum pile, reduce it, and repeat. This is straightforward but inefficient.

<div class="code-group">

```python
# Time: O(k * n) | Space: O(1)
def minStoneSum_brute(piles, k):
    """
    Brute force: repeatedly scan for max and reduce it.
    Too slow for large inputs (k up to 10^5, n up to 10^5).
    """
    for _ in range(k):
        # Find index of maximum pile - O(n) scan
        max_idx = 0
        for i in range(1, len(piles)):
            if piles[i] > piles[max_idx]:
                max_idx = i

        # Remove floor(piles[max_idx] / 2) stones
        piles[max_idx] -= piles[max_idx] // 2

    # Return sum of remaining stones
    return sum(piles)
```

```javascript
// Time: O(k * n) | Space: O(1)
function minStoneSumBrute(piles, k) {
  // Brute force: repeatedly scan for max and reduce it
  // Too slow for large inputs
  for (let op = 0; op < k; op++) {
    // Find index of maximum pile - O(n) scan
    let maxIdx = 0;
    for (let i = 1; i < piles.length; i++) {
      if (piles[i] > piles[maxIdx]) {
        maxIdx = i;
      }
    }

    // Remove Math.floor(piles[maxIdx] / 2) stones
    piles[maxIdx] -= Math.floor(piles[maxIdx] / 2);
  }

  // Return sum of remaining stones
  return piles.reduce((sum, val) => sum + val, 0);
}
```

```java
// Time: O(k * n) | Space: O(1)
public int minStoneSumBrute(int[] piles, int k) {
    // Brute force: repeatedly scan for max and reduce it
    // Too slow for large inputs
    for (int op = 0; op < k; op++) {
        // Find index of maximum pile - O(n) scan
        int maxIdx = 0;
        for (int i = 1; i < piles.length; i++) {
            if (piles[i] > piles[maxIdx]) {
                maxIdx = i;
            }
        }

        // Remove piles[maxIdx] / 2 stones (integer division)
        piles[maxIdx] -= piles[maxIdx] / 2;
    }

    // Return sum of remaining stones
    int sum = 0;
    for (int pile : piles) {
        sum += pile;
    }
    return sum;
}
```

</div>

**Why this fails:** With `k` and `n` both up to 10^5, O(k × n) = 10^10 operations is far too slow. We need to find the maximum faster than O(n) each time.

## Optimized Approach

The core optimization is using a **max-heap** (priority queue) to always efficiently access the largest pile. After reducing a pile, we need to put it back into the heap so it can be considered again for future operations.

**Step-by-step reasoning:**

1. We need to perform `k` operations, each time picking the largest pile
2. Finding the maximum in O(1) time requires a max-heap
3. After reducing a pile, it might still be large enough to be chosen again
4. So we need to re-insert the reduced pile back into the heap
5. Each heap operation (insertion/removal) takes O(log n) time
6. Total complexity becomes O(k log n) which is efficient enough

**Why a max-heap and not sorting?**

- If we sorted once, after reducing the largest pile, the array would no longer be sorted
- Re-sorting after each operation would be O(k × n log n) - even worse than brute force
- A heap maintains order dynamically as we insert/remove elements

**The algorithm:**

1. Convert all piles into a max-heap (negate values for languages with min-heap only)
2. For `k` operations:
   - Pop the largest pile from heap
   - Reduce it by `floor(pile / 2)`
   - Push the reduced pile back into heap
3. Sum all values in the heap for the final answer

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + k log n) | Space: O(n)
def minStoneSum(piles, k):
    """
    Optimal solution using max-heap.
    Always pick the largest pile to maximize reduction each operation.
    """
    import heapq

    # Step 1: Convert to max-heap by negating values
    # Python's heapq is min-heap, so we store negatives for max-heap behavior
    max_heap = [-pile for pile in piles]
    heapq.heapify(max_heap)  # O(n) heap construction

    # Step 2: Perform k operations
    for _ in range(k):
        # Get largest pile (negated back to positive)
        largest = -heapq.heappop(max_heap)  # O(log n)

        # Remove floor(largest / 2) stones
        reduced = largest - (largest // 2)  # Equivalent to largest // 2 rounded up

        # Push reduced pile back to heap (store as negative)
        heapq.heappush(max_heap, -reduced)  # O(log n)

    # Step 3: Calculate sum of remaining stones
    # Negate values back to positive and sum
    total = sum(-pile for pile in max_heap)
    return total
```

```javascript
// Time: O(n + k log n) | Space: O(n)
function minStoneSum(piles, k) {
  /**
   * Optimal solution using max-heap.
   * Always pick the largest pile to maximize reduction each operation.
   */

  // Step 1: Create max-heap using a MaxPriorityQueue or simulate with min-heap
  // Since JavaScript doesn't have built-in max-heap, we'll use min-heap with negatives
  const maxHeap = new MaxHeap();

  // Add all piles to the heap
  for (const pile of piles) {
    maxHeap.push(pile);
  }

  // Step 2: Perform k operations
  for (let i = 0; i < k; i++) {
    // Get largest pile
    const largest = maxHeap.pop();

    // Remove Math.floor(largest / 2) stones
    const reduced = largest - Math.floor(largest / 2);

    // Push reduced pile back to heap
    maxHeap.push(reduced);
  }

  // Step 3: Calculate sum of remaining stones
  return maxHeap.getSum();
}

// MaxHeap implementation using array
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

      this.heap[parentIndex] = element;
      this.heap[index] = parent;
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

  getSum() {
    return this.heap.reduce((sum, val) => sum + val, 0);
  }
}
```

```java
// Time: O(n + k log n) | Space: O(n)
public int minStoneSum(int[] piles, int k) {
    /**
     * Optimal solution using max-heap.
     * Always pick the largest pile to maximize reduction each operation.
     */

    // Step 1: Create max-heap using PriorityQueue with reverse order
    // Java's PriorityQueue is min-heap by default, so use Collections.reverseOrder()
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

    // Add all piles to the heap
    for (int pile : piles) {
        maxHeap.offer(pile);
    }

    // Step 2: Perform k operations
    for (int i = 0; i < k; i++) {
        // Get largest pile
        int largest = maxHeap.poll();

        // Remove largest / 2 stones (integer division)
        int reduced = largest - (largest / 2);

        // Push reduced pile back to heap
        maxHeap.offer(reduced);
    }

    // Step 3: Calculate sum of remaining stones
    int total = 0;
    while (!maxHeap.isEmpty()) {
        total += maxHeap.poll();
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k log n)**

- Building the initial heap from `n` piles takes O(n) time
- Each of the `k` operations involves:
  - Popping the maximum: O(log n)
  - Pushing the reduced value back: O(log n)
- Total: O(n + 2k log n) = O(n + k log n)

**Space Complexity: O(n)**

- We store all `n` piles in the heap
- Additional space for variables is O(1)

For constraints where `k ≤ 10^5` and `n ≤ 10^5`, O(10^5 + 10^5 × log(10^5)) ≈ O(10^5 + 10^5 × 17) ≈ 1.7 million operations, which is efficient.

## Common Mistakes

1. **Using array sorting repeatedly:** Some candidates sort the array once and try to maintain order manually. After reducing the largest element, the array is no longer sorted. Re-sorting after each operation gives O(k × n log n) which is too slow.

2. **Forgetting to push reduced pile back:** After popping and reducing the largest pile, you must push it back into the heap. Otherwise, you're just removing piles entirely rather than reducing them.

3. **Integer division errors:** Remember that `floor(pile / 2)` for integers is simply `pile // 2` in Python, `Math.floor(pile / 2)` in JavaScript, and `pile / 2` (integer division) in Java. The reduced pile should be `pile - floor(pile / 2)`, not just `floor(pile / 2)`.

4. **Not using max-heap in languages with only min-heap:** In Python and Java, you need to invert values or use custom comparators. In Python: store negatives. In Java: use `Collections.reverseOrder()`.

## When You'll See This Pattern

This "always pick the maximum/minimum" pattern with dynamic updates appears in many problems:

1. **Minimum Operations to Halve Array Sum (LeetCode 2208):** Very similar - repeatedly halve the largest element to reduce total sum below a target. Same max-heap approach.

2. **Maximal Score After Applying K Operations (LeetCode 2530):** You pick an element, add its value to score, then replace it with `ceil(element / 3)`. Again, always pick the maximum.

3. **Take Gifts From the Richest Pile (LeetCode 2558):** Another variation where you take gifts from the largest pile, leaving the square root of what was there.

The pattern to recognize: **When you need to repeatedly apply an operation to the current maximum/minimum element, and the operation changes the element's value, use a heap.**

## Key Takeaways

1. **Greedy with heap:** When a problem requires repeatedly selecting the maximum or minimum element for an operation, and that operation changes the element's value, a heap (priority queue) is usually the right data structure.

2. **Dynamic maintenance:** Unlike sorting which gives a one-time ordering, heaps maintain order dynamically as elements are added and removed, making them perfect for problems with multiple operations.

3. **Complexity matters:** The brute force O(k × n) might seem okay for small inputs, but recognizing when to optimize to O(k log n) is crucial for interview success.

Related problems: [Minimum Operations to Halve Array Sum](/problem/minimum-operations-to-halve-array-sum), [Maximal Score After Applying K Operations](/problem/maximal-score-after-applying-k-operations), [Take Gifts From the Richest Pile](/problem/take-gifts-from-the-richest-pile)
