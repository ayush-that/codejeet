---
title: "How to Solve Construct Target Array With Multiple Sums — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Construct Target Array With Multiple Sums. Hard difficulty, 36.8% acceptance rate. Topics: Array, Heap (Priority Queue)."
date: "2027-11-06"
category: "dsa-patterns"
tags: ["construct-target-array-with-multiple-sums", "array", "heap-(priority-queue)", "hard"]
---

# How to Solve Construct Target Array With Multiple Sums

You're given a target array and need to determine if you can build it starting from an array of all 1's by repeatedly replacing any element with the sum of all current elements. The challenge is that working forward from [1,1,...,1] to the target is impossible—there are too many possibilities. The key insight is to work backwards from the target to [1,1,...,1], which reveals a greedy pattern.

What makes this problem tricky is recognizing that the largest element in the target must have been the most recently replaced element in the backward process, and we can reverse-engineer its previous value. This leads to an efficient solution using a max-heap.

## Visual Walkthrough

Let's trace through target = [9, 3, 5] step by step:

**Step 1:** Current array = [9, 3, 5]. Total sum = 17.
The largest element is 9. Its previous value = 9 - (17 - 9) = 9 - 8 = 1.
New array = [1, 3, 5].

**Step 2:** Current array = [1, 3, 5]. Total sum = 9.
Largest element is 5. Previous value = 5 - (9 - 5) = 5 - 4 = 1.
New array = [1, 3, 1].

**Step 3:** Current array = [1, 3, 1]. Total sum = 5.
Largest element is 3. Previous value = 3 - (5 - 3) = 3 - 2 = 1.
New array = [1, 1, 1].

We've reached all 1's! This means [9, 3, 5] is constructible.

Now let's try a counterexample: target = [1, 1, 1, 2].
**Step 1:** [1, 1, 1, 2], sum = 5, max = 2.
Previous value = 2 - (5 - 2) = 2 - 3 = -1 (invalid!).
Since we got a negative number, this target isn't constructible.

The pattern: always take the largest element, subtract the sum of the rest, and replace it with the result. If we get 1 or reach all 1's, we succeed. If we get ≤ 0, we fail.

## Brute Force Approach

A naive approach would try to simulate the forward process: start with [1,1,...,1] and at each step try replacing any element with the current sum. This is a combinatorial explosion—at each of potentially many steps, you have n choices. Even with memoization, the state space is enormous since arrays can have large values.

Another brute force would be the backward process without optimization: repeatedly scan for the maximum, compute its previous value, and update. For target = [1, 1000000000], this would take nearly a billion iterations since we'd subtract (1000000000 - 1) from 1000000000 repeatedly. Clearly too slow.

The problem with brute force is it doesn't leverage the mathematical insight that we can skip many iterations at once when the largest element is much bigger than the rest.

## Optimized Approach

The key insight is that when the largest element is significantly larger than the sum of all other elements, we're essentially subtracting that sum from the largest element repeatedly. Instead of doing this one subtraction at a time, we can use modulo arithmetic to skip ahead.

Consider target = [1, 1000000000]. The sum of others = 1. Instead of:
1000000000 → 999999999 → 999999998 → ... → 1 (1 billion steps)
We can do: 1000000000 % 1 = 0 (but wait, that gives 0, which is invalid).

Actually, we need to handle the case where the largest element is less than the sum of others differently. The correct formula is:

Let `max_val` be the largest element, `total_sum` be the sum of all elements, and `rest_sum = total_sum - max_val`.
If `max_val > rest_sum`, then the previous value = `max_val % rest_sum`.
But if the result is 0, we should use `rest_sum` instead (because elements must be positive).

Why? Because going backwards: `max_val = previous_val + rest_sum`. If `max_val > rest_sum`, then `previous_val = max_val - rest_sum`. But if we're skipping many steps where `max_val` was repeatedly the largest, we're effectively doing `previous_val = max_val - k * rest_sum` where k is the largest integer such that the result is positive. That's exactly `max_val % rest_sum`.

Special cases:

1. If `rest_sum == 1`: We can always reach [1,1,...,1] because any number mod 1 = 0, but we interpret 0 as 1.
2. If `rest_sum == 0`: Only possible if array has one element, which must be 1.
3. If `max_val <= rest_sum`: We can't use modulo, just do single subtraction.

We need a max-heap to efficiently get the largest element each time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n * log M) where M is max(target), Space: O(n)
def isPossible(target):
    """
    Determine if target array can be constructed starting from all 1's.

    Approach: Work backwards from target to all 1's using max-heap.
    At each step, replace largest element with its previous value.
    Use modulo to skip many iterations when largest >> sum of others.
    """
    # Edge case: single element array must be [1]
    if len(target) == 1:
        return target[0] == 1

    # Calculate total sum and initialize max-heap
    total_sum = sum(target)
    # Use negative values for max-heap simulation in Python
    max_heap = [-x for x in target]
    import heapq
    heapq.heapify(max_heap)

    while True:
        # Get current largest element
        largest = -heapq.heappop(max_heap)

        # If largest is 1, all elements must be 1 (since heap contains max)
        if largest == 1:
            return True

        # Calculate sum of all other elements
        rest_sum = total_sum - largest

        # If rest_sum is 0 or largest <= rest_sum (invalid state)
        if rest_sum == 0 or largest <= rest_sum:
            return False

        # Calculate previous value using modulo to skip iterations
        # previous = largest - rest_sum (single step)
        # But we can do: previous = largest % rest_sum
        # However, if result is 0, we need to use rest_sum instead
        previous = largest % rest_sum

        # Special case: if modulo gives 0, use rest_sum
        # This happens when largest is multiple of rest_sum
        if previous == 0:
            previous = rest_sum

        # Update total sum: subtract difference between largest and previous
        total_sum = total_sum - largest + previous

        # Push the previous value back to heap
        heapq.heappush(max_heap, -previous)

    # Should never reach here
    return False
```

```javascript
// Time: O(n log n * log M) where M is max(target), Space: O(n)
function isPossible(target) {
  /**
   * Determine if target array can be constructed starting from all 1's.
   *
   * Approach: Work backwards from target to all 1's using max-heap.
   * At each step, replace largest element with its previous value.
   * Use modulo to skip many iterations when largest >> sum of others.
   */

  // Edge case: single element array must be [1]
  if (target.length === 1) {
    return target[0] === 1;
  }

  // Calculate total sum and initialize max-heap
  let totalSum = target.reduce((a, b) => a + b, 0);

  // JavaScript doesn't have built-in max-heap, so we use min-heap with negatives
  const maxHeap = new MaxHeap();
  target.forEach((num) => maxHeap.push(num));

  while (true) {
    // Get current largest element
    const largest = maxHeap.pop();

    // If largest is 1, all elements must be 1 (since heap contains max)
    if (largest === 1) {
      return true;
    }

    // Calculate sum of all other elements
    const restSum = totalSum - largest;

    // If restSum is 0 or largest <= restSum (invalid state)
    if (restSum === 0 || largest <= restSum) {
      return false;
    }

    // Calculate previous value using modulo to skip iterations
    // previous = largest - restSum (single step)
    // But we can do: previous = largest % restSum
    // However, if result is 0, we need to use restSum instead
    let previous = largest % restSum;

    // Special case: if modulo gives 0, use restSum
    // This happens when largest is multiple of restSum
    if (previous === 0) {
      previous = restSum;
    }

    // Update total sum: subtract difference between largest and previous
    totalSum = totalSum - largest + previous;

    // Push the previous value back to heap
    maxHeap.push(previous);
  }

  // Should never reach here
  return false;
}

// MaxHeap implementation for JavaScript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return max;
  }

  bubbleUp(index) {
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

  sinkDown(index) {
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
// Time: O(n log n * log M) where M is max(target), Space: O(n)
import java.util.PriorityQueue;
import java.util.Collections;

class Solution {
    public boolean isPossible(int[] target) {
        /**
         * Determine if target array can be constructed starting from all 1's.
         *
         * Approach: Work backwards from target to all 1's using max-heap.
         * At each step, replace largest element with its previous value.
         * Use modulo to skip many iterations when largest >> sum of others.
         */

        // Edge case: single element array must be [1]
        if (target.length == 1) {
            return target[0] == 1;
        }

        // Calculate total sum and initialize max-heap
        long totalSum = 0; // Use long to avoid integer overflow
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        for (int num : target) {
            totalSum += num;
            maxHeap.offer(num);
        }

        while (true) {
            // Get current largest element
            int largest = maxHeap.poll();

            // If largest is 1, all elements must be 1 (since heap contains max)
            if (largest == 1) {
                return true;
            }

            // Calculate sum of all other elements
            long restSum = totalSum - largest;

            // If restSum is 0 or largest <= restSum (invalid state)
            if (restSum == 0 || largest <= restSum) {
                return false;
            }

            // Calculate previous value using modulo to skip iterations
            // previous = largest - restSum (single step)
            // But we can do: previous = largest % restSum
            // However, if result is 0, we need to use restSum instead
            int previous = (int)(largest % restSum);

            // Special case: if modulo gives 0, use restSum
            // This happens when largest is multiple of restSum
            if (previous == 0) {
                previous = (int)restSum;
            }

            // Update total sum: subtract difference between largest and previous
            totalSum = totalSum - largest + previous;

            // Push the previous value back to heap
            maxHeap.offer(previous);
        }

        // Should never reach here
        // return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n \* log M) where n is array length and M is the maximum value in target.

Why? We process elements in a max-heap (O(log n) per operation). The tricky part is the number of iterations. In the worst case (like [1, 1000000000]), we use modulo to reduce the largest element dramatically in one step. Each modulo operation reduces the largest element by at least half when it's much larger than rest_sum, giving us O(log M) iterations. Each iteration does heap operations (O(log n)), so total is O(n log n \* log M).

**Space Complexity:** O(n) for the heap storage.

The O(log M) factor comes from the number of times we need to process the largest element. Consider [1, M]: we go M → M%1 = 0 → replaced with 1. That's O(1) iterations, not O(log M). Actually, the worst case is when numbers are like Fibonacci sequence, where each reduction is modest. The precise bound is O(log(max(target)) \* n log n).

## Common Mistakes

1. **Not using modulo for large values**: Trying to subtract rest_sum repeatedly leads to TLE for cases like [1, 10^9]. Candidates must recognize that when largest > rest_sum, we can use modulo to skip ahead.

2. **Forgetting the special case when modulo gives 0**: When largest is a multiple of rest_sum, largest % rest_sum = 0, but we can't have 0 in our array. We need to use rest_sum instead. Example: [2, 2] → sum=4, largest=2, rest_sum=2, 2%2=0 → use 2, giving [2,2] again (infinite loop). Actually [2,2] should return false.

3. **Integer overflow**: Using int for sum can overflow with large values. Use long (Java/JavaScript) or Python's arbitrary precision integers.

4. **Incorrect termination condition**: When rest_sum = 0 (array has one element), we should check if that element is 1. Also, if largest <= rest_sum and not all 1's, return false.

5. **Not handling the single element case**: [2] should return false, [1] should return true.

## When You'll See This Pattern

This "work backwards with max-heap and modulo" pattern appears in problems where you need to reverse-engineer a process that always modifies the maximum element:

1. **Minimum Amount of Time to Fill Cups** (Easy): Similar greedy approach with max elements, though simpler.
2. **Maximum Score From Removing Stones** (Medium): Always remove from the two largest piles.
3. **Reduce Array Size to The Half** (Medium): Use max-heap (via frequency counting) to greedily remove most frequent elements.

The core pattern is: when a process always operates on the maximum element, consider reversing it and using a max-heap to efficiently find what to process next.

## Key Takeaways

1. **Reverse the process**: When forward simulation has too many possibilities, try working backwards from the target to the initial state.

2. **Max-heap for greedy on maximum**: If you always need the current maximum, a max-heap gives O(log n) access instead of O(n) scanning.

3. **Use modulo to skip iterations**: When values can be large and you're repeatedly subtracting the same amount, modulo arithmetic lets you jump directly to the final result.

4. **Watch for edge cases with modulo**: Remember that a % b = 0 means a is a multiple of b, which often needs special handling.

Related problems: [Minimum Amount of Time to Fill Cups](/problem/minimum-amount-of-time-to-fill-cups)
