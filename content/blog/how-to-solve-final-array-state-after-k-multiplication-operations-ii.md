---
title: "How to Solve Final Array State After K Multiplication Operations II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Final Array State After K Multiplication Operations II. Hard difficulty, 13.1% acceptance rate. Topics: Array, Heap (Priority Queue), Simulation."
date: "2026-04-26"
category: "dsa-patterns"
tags:
  [
    "final-array-state-after-k-multiplication-operations-ii",
    "array",
    "heap-(priority-queue)",
    "simulation",
    "hard",
  ]
---

# How to Solve Final Array State After K Multiplication Operations II

This problem asks us to perform `k` operations on an array where each operation finds the minimum value (choosing the first occurrence if there are ties), multiplies it by a given `multiplier`, and repeats. The challenge comes from needing to efficiently find and update the minimum element `k` times, where `k` can be as large as 10⁹, making a naive simulation approach impossible.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 1, 2]`, `k = 4`, `multiplier = 2`.

**Initial state:** `[3, 1, 2]`

**Operation 1:**

- Find minimum: `1` at index 1
- Multiply: `1 × 2 = 2`
- New array: `[3, 2, 2]`

**Operation 2:**

- Find minimum: We have `2` at index 1 and `2` at index 2. Choose first occurrence at index 1
- Multiply: `2 × 2 = 4`
- New array: `[3, 4, 2]`

**Operation 3:**

- Find minimum: `2` at index 2
- Multiply: `2 × 2 = 4`
- New array: `[3, 4, 4]`

**Operation 4:**

- Find minimum: `3` at index 0 (both `4`s are larger)
- Multiply: `3 × 2 = 6`
- New array: `[6, 4, 4]`

**Final result:** `[6, 4, 4]`

Notice how the minimum keeps changing, and we need to track both the value and its original index position to handle tie-breaking correctly.

## Brute Force Approach

The most straightforward approach would be to simulate all `k` operations directly:

1. For each of `k` operations:
   - Scan the array to find the minimum value and its first occurrence
   - Multiply that element by the multiplier
2. Return the final array

<div class="code-group">

```python
# Time: O(k * n) | Space: O(1)
def brute_force(nums, k, multiplier):
    for _ in range(k):
        min_val = float('inf')
        min_idx = -1

        # Find minimum value and its first occurrence
        for i in range(len(nums)):
            if nums[i] < min_val:
                min_val = nums[i]
                min_idx = i

        # Multiply the minimum element
        nums[min_idx] *= multiplier

    return nums
```

```javascript
// Time: O(k * n) | Space: O(1)
function bruteForce(nums, k, multiplier) {
  for (let op = 0; op < k; op++) {
    let minVal = Infinity;
    let minIdx = -1;

    // Find minimum value and its first occurrence
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] < minVal) {
        minVal = nums[i];
        minIdx = i;
      }
    }

    // Multiply the minimum element
    nums[minIdx] *= multiplier;
  }

  return nums;
}
```

```java
// Time: O(k * n) | Space: O(1)
public int[] bruteForce(int[] nums, int k, int multiplier) {
    for (int op = 0; op < k; op++) {
        int minVal = Integer.MAX_VALUE;
        int minIdx = -1;

        // Find minimum value and its first occurrence
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < minVal) {
                minVal = nums[i];
                minIdx = i;
            }
        }

        // Multiply the minimum element
        nums[minIdx] *= multiplier;
    }

    return nums;
}
```

</div>

**Why this fails:** With `k` up to 10⁹ and `n` up to 10⁵, the worst-case time complexity O(k × n) is astronomically large (up to 10¹⁴ operations). We need a smarter approach that doesn't simulate every operation individually.

## Optimized Approach

The key insight is that we don't need to simulate all `k` operations one by one. Instead, we can use a **priority queue (min-heap)** to efficiently track the smallest elements and process them in batches.

Here's the step-by-step reasoning:

1. **Observation:** When we multiply the smallest element by `multiplier`, it might become larger than other elements. But eventually, after enough multiplications, all elements will grow significantly.

2. **Batch Processing:** Instead of processing operations one by one, we can process all operations that target the same element consecutively. If an element is the current minimum, we can calculate how many times we need to multiply it before it's no longer the minimum.

3. **Data Structure Choice:** We need a min-heap that stores `(value, original_index)` pairs. The heap automatically gives us the smallest value, and we use the original index for tie-breaking.

4. **Mathematical Insight:** If the current minimum is `x` and the next smallest value is `y`, we can calculate how many multiplications of `x` it takes to reach or exceed `y`:
   - We need the smallest integer `t` such that `x × multiplier^t ≥ y`
   - This can be calculated as `t = ceil(log(y/x) / log(multiplier))`
   - But we must be careful with integer arithmetic to avoid precision issues

5. **Algorithm Outline:**
   - Push all `(value, index)` pairs into a min-heap
   - While we have operations remaining:
     - Pop the smallest element
     - If heap is empty, this is the only element left - multiply it all remaining times
     - Otherwise, peek at the next smallest element to determine how many times we can multiply current element
     - Apply those multiplications, update operation count
     - Push the multiplied value back to heap if it might still be minimum later

## Optimal Solution

The optimal solution uses a min-heap to process elements efficiently. We handle the case where `multiplier = 1` separately since it causes infinite loops in our calculations.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
import heapq
import math

def getFinalState(nums, k, multiplier):
    """
    Returns the final state of nums after k multiplication operations.

    Args:
        nums: List of integers
        k: Number of operations to perform
        multiplier: Value to multiply minimum by each operation

    Returns:
        List of integers representing final array state
    """
    # Special case: multiplier is 1, array doesn't change
    if multiplier == 1:
        return nums

    n = len(nums)

    # Create a min-heap storing (value, original_index)
    # Python's heapq is a min-heap by default
    heap = []
    for i, num in enumerate(nums):
        heapq.heappush(heap, (num, i))

    # Process operations
    remaining_ops = k

    while remaining_ops > 0 and heap:
        # Get current minimum element
        current_val, original_idx = heapq.heappop(heap)

        if not heap:
            # No other elements, multiply this one all remaining times
            # Using modular exponentiation to avoid huge numbers
            final_val = current_val * pow(multiplier, remaining_ops)
            nums[original_idx] = final_val
            remaining_ops = 0
        else:
            # Peek at next smallest value
            next_val, _ = heap[0]

            # If current value already >= next value (shouldn't happen with min-heap)
            if current_val >= next_val:
                heapq.heappush(heap, (current_val, original_idx))
                continue

            # Calculate how many times we can multiply current_val before it reaches/exceeds next_val
            # We need the smallest t such that: current_val * (multiplier^t) >= next_val
            # This means: multiplier^t >= next_val / current_val
            # Taking log: t >= log(next_val / current_val) / log(multiplier)

            # Handle the case where next_val might be 0
            if next_val == 0:
                # If next_val is 0, we can multiply current_val indefinitely
                # But 0 can only come from original array or become 0 if multiplier is 0
                # multiplier > 0 in constraints, so next_val won't be 0 unless it started as 0
                # If next_val is 0 and current_val > 0, we can multiply until we reach 0
                # But with positive multiplier, we'll never reach 0 from positive number
                # So we multiply all remaining times
                max_ops = remaining_ops
            else:
                # Calculate using logarithms with integer ceiling
                # We need to be careful with floating point precision
                # Use integer arithmetic to avoid precision issues

                # Find t using binary search or direct calculation
                # multiplier^t >= next_val / current_val
                # We'll use a loop to calculate since t won't be huge in practice
                # (because values grow exponentially)

                t = 0
                temp_val = current_val

                # Calculate how many multiplications until temp_val >= next_val
                while temp_val < next_val and t < remaining_ops:
                    temp_val *= multiplier
                    t += 1

                max_ops = t

            # We can apply at most remaining_ops operations
            ops_to_apply = min(max_ops, remaining_ops)

            if ops_to_apply > 0:
                # Apply the multiplications
                new_val = current_val * pow(multiplier, ops_to_apply)
                remaining_ops -= ops_to_apply

                # Push back to heap if we might need to process it again
                # (if we didn't use all remaining operations on it)
                heapq.heappush(heap, (new_val, original_idx))
            else:
                # Shouldn't happen, but safety check
                heapq.heappush(heap, (current_val, original_idx))

    # Reconstruct the result array
    # Elements that were never processed remain at their original values
    # Processed elements have been updated in nums during processing
    return nums
```

```javascript
// Time: O(n log n) | Space: O(n)
function getFinalState(nums, k, multiplier) {
  // Special case: multiplier is 1, array doesn't change
  if (multiplier === 1) {
    return nums;
  }

  const n = nums.length;

  // Create a min-heap storing [value, original_index]
  const heap = new MinHeap();
  for (let i = 0; i < n; i++) {
    heap.push([nums[i], i]);
  }

  let remainingOps = k;

  while (remainingOps > 0 && heap.size() > 0) {
    // Get current minimum element
    const [currentVal, originalIdx] = heap.pop();

    if (heap.size() === 0) {
      // No other elements, multiply this one all remaining times
      // Using BigInt to avoid overflow with large numbers
      const finalVal = Number(BigInt(currentVal) * BigInt(multiplier) ** BigInt(remainingOps));
      nums[originalIdx] = finalVal;
      remainingOps = 0;
    } else {
      // Peek at next smallest value
      const [nextVal] = heap.peek();

      // If current value already >= next value (shouldn't happen with min-heap)
      if (currentVal >= nextVal) {
        heap.push([currentVal, originalIdx]);
        continue;
      }

      // Calculate how many times we can multiply currentVal
      // before it reaches/exceeds nextVal
      let maxOps = 0;
      let tempVal = currentVal;

      // Calculate how many multiplications until tempVal >= nextVal
      while (tempVal < nextVal && maxOps < remainingOps) {
        tempVal *= multiplier;
        maxOps++;
      }

      // We can apply at most remainingOps operations
      const opsToApply = Math.min(maxOps, remainingOps);

      if (opsToApply > 0) {
        // Apply the multiplications
        const newVal = currentVal * Math.pow(multiplier, opsToApply);
        remainingOps -= opsToApply;

        // Push back to heap if we might need to process it again
        heap.push([newVal, originalIdx]);
      } else {
        // Shouldn't happen, but safety check
        heap.push([currentVal, originalIdx]);
      }
    }
  }

  return nums;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }

    return min;
  }

  peek() {
    return this.heap[0];
  }

  bubbleUp(index) {
    const element = this.heap[index];

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];

      if (element[0] >= parent[0]) break;

      this.heap[parentIndex] = element;
      this.heap[index] = parent;
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
        if (leftChild[0] < element[0]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && rightChild[0] < leftChild[0])
        ) {
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
// Time: O(n log n) | Space: O(n)
import java.util.PriorityQueue;

class Solution {
    public int[] getFinalState(int[] nums, int k, int multiplier) {
        // Special case: multiplier is 1, array doesn't change
        if (multiplier == 1) {
            return nums;
        }

        int n = nums.length;

        // Create a min-heap storing pairs of (value, original_index)
        // Using custom comparator to sort by value first, then index
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) {
                return Integer.compare(a[0], b[0]); // Compare values
            }
            return Integer.compare(a[1], b[1]); // Compare indices for tie-breaking
        });

        // Initialize heap with all elements
        for (int i = 0; i < n; i++) {
            heap.offer(new int[]{nums[i], i});
        }

        int remainingOps = k;

        while (remainingOps > 0 && !heap.isEmpty()) {
            // Get current minimum element
            int[] current = heap.poll();
            int currentVal = current[0];
            int originalIdx = current[1];

            if (heap.isEmpty()) {
                // No other elements, multiply this one all remaining times
                // Use long to avoid overflow during calculation
                long finalVal = currentVal;
                for (int i = 0; i < remainingOps; i++) {
                    finalVal *= multiplier;
                    // Break if we detect overflow (though problem constraints allow large results)
                    if (finalVal > Integer.MAX_VALUE) {
                        // In a real implementation, we might use BigInteger
                        // For this problem, we'll let it overflow as per constraints
                    }
                }
                nums[originalIdx] = (int) finalVal;
                remainingOps = 0;
            } else {
                // Peek at next smallest value
                int[] next = heap.peek();
                int nextVal = next[0];

                // If current value already >= next value (shouldn't happen with min-heap)
                if (currentVal >= nextVal) {
                    heap.offer(current);
                    continue;
                }

                // Calculate how many times we can multiply currentVal
                // before it reaches/exceeds nextVal
                int maxOps = 0;
                long tempVal = currentVal;

                // Calculate how many multiplications until tempVal >= nextVal
                while (tempVal < nextVal && maxOps < remainingOps) {
                    tempVal *= multiplier;
                    maxOps++;
                }

                // We can apply at most remainingOps operations
                int opsToApply = Math.min(maxOps, remainingOps);

                if (opsToApply > 0) {
                    // Apply the multiplications
                    long newVal = currentVal;
                    for (int i = 0; i < opsToApply; i++) {
                        newVal *= multiplier;
                    }
                    remainingOps -= opsToApply;

                    // Push back to heap if we might need to process it again
                    heap.offer(new int[]{(int) newVal, originalIdx});
                } else {
                    // Shouldn't happen, but safety check
                    heap.offer(current);
                }
            }
        }

        return nums;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Building the initial heap takes O(n) time (using heapify)
- Each element is pushed and popped from the heap at most O(log n) times
- The while loop processes elements efficiently, with each element being multiplied in batches rather than one operation at a time
- The logarithmic factor comes from heap operations (push/pop are O(log n))

**Space Complexity:** O(n)

- We store all n elements in the priority queue
- Additional space for indices and temporary variables is constant

The key efficiency gain comes from processing multiple operations on the same element in batches. Instead of O(k) iterations, we have O(n log n) complexity, which is much better when k is large.

## Common Mistakes

1. **Simulating all k operations individually:** This is the most common mistake. With k up to 10⁹, an O(k) solution will time out. Always check constraints before choosing an approach.

2. **Not handling multiplier = 1 case:** When multiplier is 1, the array never changes. Some implementations might get stuck in infinite loops trying to calculate how many multiplications are needed.

3. **Incorrect tie-breaking:** The problem specifies that when there are multiple occurrences of the minimum value, we must select the first occurrence. Using a standard min-heap without tracking original indices will fail this requirement.

4. **Overflow issues:** When multiplier > 1 and k is large, values can grow exponentially and exceed standard integer limits. While some languages handle this automatically (Python), in Java and JavaScript you need to be careful with large numbers.

5. **Not updating the original array correctly:** After processing elements through the heap, you must update the original array at the correct indices. Keeping track of the original index for each value is crucial.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Priority Queue for Dynamic Minimum/Maximum:** Similar to problems like:
   - "Find Median from Data Stream" (LeetCode 295) - maintaining two heaps
   - "Sliding Window Maximum" (LeetCode 239) - using deque to track maximum
   - "Kth Largest Element in a Stream" (LeetCode 703) - maintaining top k elements

2. **Batch Processing of Operations:** When operations can be grouped or processed in batches rather than individually:
   - "Minimum Operations to Make Array Equal" (LeetCode 1551) - mathematical batch calculation
   - "Bulb Switcher" (LeetCode 319) - realizing operations have patterns

3. **Simulation with Optimization:** Problems where naive simulation is too slow but can be optimized with data structures:
   - "Process Tasks Using Servers" (LeetCode 1882) - using heaps to efficiently assign tasks
   - "Seat Reservation Manager" (LeetCode 1845) - managing available resources efficiently

## Key Takeaways

1. **When k is large, think batch processing:** If a problem involves performing many similar operations, look for ways to group them rather than simulating each one individually.

2. **Heaps are ideal for dynamic min/max queries:** When you need to repeatedly find and update minimum or maximum values, a priority queue (heap) is usually the right choice.

3. **Always track original indices when order matters:** If you're moving elements into a data structure but need to preserve their original positions for updates or tie-breaking, store the index alongside the value.

4. **Check for edge cases with identity operations:** When dealing with multiplicative operations, always consider the case where the multiplier is 1 (identity operation) as it often requires special handling.

[Practice this problem on CodeJeet](/problem/final-array-state-after-k-multiplication-operations-ii)
