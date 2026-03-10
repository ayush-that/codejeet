---
title: "How to Solve Maximum Average Pass Ratio — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Average Pass Ratio. Medium difficulty, 74.1% acceptance rate. Topics: Array, Greedy, Heap (Priority Queue)."
date: "2028-09-05"
category: "dsa-patterns"
tags: ["maximum-average-pass-ratio", "array", "greedy", "heap-(priority-queue)", "medium"]
---

# How to Solve Maximum Average Pass Ratio

You're given a list of classes where each class has a certain number of students who will pass and a total number of students. You can add exactly `extraStudents` new students to any classes, and each new student added to a class will pass. Your goal is to maximize the overall average pass ratio across all classes. The tricky part is that adding a student to different classes yields different marginal benefits, and you need to strategically allocate limited resources for maximum impact.

## Visual Walkthrough

Let's trace through a concrete example: `classes = [[1,2],[3,5]]` with `extraStudents = 2`.

**Initial state:**

- Class 0: 1/2 = 0.5 pass ratio
- Class 1: 3/5 = 0.6 pass ratio
- Current average: (0.5 + 0.6) / 2 = 0.55

**Key insight:** Adding a student to a class increases both pass count and total count by 1. The marginal benefit of adding a student to class i is:
`(pass_i + 1)/(total_i + 1) - (pass_i)/(total_i)`

**First extra student:**

- Class 0 benefit: (2/3) - (1/2) = 0.6667 - 0.5 = 0.1667
- Class 1 benefit: (4/6) - (3/5) = 0.6667 - 0.6 = 0.0667
- Class 0 has higher marginal benefit, so add student there
- Class 0 becomes: 2/3 ≈ 0.6667
- Class 1 remains: 3/5 = 0.6
- Average: (0.6667 + 0.6) / 2 = 0.63335

**Second extra student:**

- Class 0 (now 2/3): (3/4) - (2/3) = 0.75 - 0.6667 = 0.0833
- Class 1 (still 3/5): (4/6) - (3/5) = 0.6667 - 0.6 = 0.0667
- Class 0 still has higher benefit, so add second student there
- Class 0 becomes: 3/4 = 0.75
- Class 1 remains: 3/5 = 0.6
- Final average: (0.75 + 0.6) / 2 = 0.675

This greedy approach of always adding to the class with highest marginal benefit yields the optimal solution.

## Brute Force Approach

A naive approach would be to try all possible allocations of `extraStudents` across `n` classes. For each class, we could add between 0 and `extraStudents` students, with the constraint that the total adds up to `extraStudents`. This is essentially a combinatorial problem.

The number of ways to distribute `extraStudents` identical items into `n` distinct boxes is given by stars and bars: `C(extraStudents + n - 1, n - 1)`. For each distribution, we'd calculate the average pass ratio. Even with modest inputs like `extraStudents = 50` and `n = 10`, this becomes `C(59, 9) ≈ 1.3 × 10^9` possibilities — completely infeasible.

What makes brute force impossible is that we can't explore exponential possibilities. We need a smarter way to allocate students without checking every combination.

## Optimized Approach

The key insight is that this is a **greedy optimization problem** where we want to maximize the sum of pass ratios. Each time we add a student to a class, we get a certain "gain" in that class's pass ratio. We should always add the next student to the class where we get the **largest marginal gain**.

**Why greedy works:**

1. The objective function (sum of pass ratios) is concave with respect to adding students to any single class
2. The marginal gain from adding a student to a class decreases as we add more students to that class
3. This structure ensures that always picking the maximum marginal gain yields the global optimum

**Data structure choice:** We need a max-heap (priority queue) to efficiently find the class with the largest marginal gain at each step. After adding a student to a class, we recalculate its new marginal gain and push it back into the heap.

**Algorithm steps:**

1. Calculate initial marginal gain for each class: `(pass+1)/(total+1) - pass/total`
2. Push all classes into a max-heap keyed by marginal gain
3. For each of the `extraStudents`:
   - Pop the class with maximum marginal gain
   - Add a student to it (increment both pass and total by 1)
   - Recalculate its new marginal gain
   - Push it back into the heap
4. Calculate final average pass ratio using updated class statistics

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + k) log n) where n = number of classes, k = extraStudents
# Space: O(n) for the heap
import heapq

def maxAverageRatio(classes, extraStudents):
    """
    Maximizes the average pass ratio by optimally allocating extra students.

    Args:
        classes: List[List[int]] - each inner list [pass_i, total_i]
        extraStudents: int - number of additional students to allocate

    Returns:
        float - maximum possible average pass ratio
    """
    # Max-heap in Python is simulated using min-heap with negative values
    # We store (-marginal_gain, pass_count, total_count) to get max gain first
    heap = []

    # Step 1: Calculate initial marginal gains and build the heap
    for passes, total in classes:
        # Current pass ratio
        current_ratio = passes / total
        # Pass ratio after adding one student
        new_ratio = (passes + 1) / (total + 1)
        # Marginal gain from adding one student to this class
        gain = new_ratio - current_ratio
        # Push negative gain for max-heap behavior
        heapq.heappush(heap, (-gain, passes, total))

    # Step 2: Allocate extra students greedily
    for _ in range(extraStudents):
        # Pop class with maximum marginal gain
        neg_gain, passes, total = heapq.heappop(heap)

        # Add one student to this class
        passes += 1
        total += 1

        # Recalculate marginal gain for next potential addition
        current_ratio = passes / total
        new_ratio = (passes + 1) / (total + 1)
        new_gain = new_ratio - current_ratio

        # Push updated class back into heap
        heapq.heappush(heap, (-new_gain, passes, total))

    # Step 3: Calculate final average pass ratio
    total_ratio = 0
    # Extract final pass ratios from heap
    for _, passes, total in heap:
        total_ratio += passes / total

    # Return average across all classes
    return total_ratio / len(classes)
```

```javascript
// Time: O((n + k) log n) where n = number of classes, k = extraStudents
// Space: O(n) for the heap
/**
 * Maximizes the average pass ratio by optimally allocating extra students.
 * @param {number[][]} classes - each inner array [pass_i, total_i]
 * @param {number} extraStudents - number of additional students to allocate
 * @return {number} - maximum possible average pass ratio
 */
function maxAverageRatio(classes, extraStudents) {
  // Max-heap implementation using array and comparator
  class MaxHeap {
    constructor() {
      this.heap = [];
    }

    // Compare based on marginal gain (largest first)
    compare(a, b) {
      return b.gain - a.gain;
    }

    push(item) {
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      if (this.heap.length === 0) return null;
      const top = this.heap[0];
      const bottom = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = bottom;
        this.sinkDown(0);
      }
      return top;
    }

    bubbleUp(index) {
      const item = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        if (this.compare(item, parent) >= 0) break;
        this.heap[index] = parent;
        index = parentIndex;
      }
      this.heap[index] = item;
    }

    sinkDown(index) {
      const length = this.heap.length;
      const item = this.heap[index];

      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let swapIndex = null;
        let leftChild, rightChild;

        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (this.compare(leftChild, item) < 0) {
            swapIndex = leftChildIndex;
          }
        }

        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swapIndex === null && this.compare(rightChild, item) < 0) ||
            (swapIndex !== null && this.compare(rightChild, leftChild) < 0)
          ) {
            swapIndex = rightChildIndex;
          }
        }

        if (swapIndex === null) break;

        this.heap[index] = this.heap[swapIndex];
        index = swapIndex;
      }
      this.heap[index] = item;
    }

    size() {
      return this.heap.length;
    }
  }

  // Step 1: Build max-heap with initial marginal gains
  const heap = new MaxHeap();

  for (const [passes, total] of classes) {
    // Current pass ratio
    const currentRatio = passes / total;
    // Pass ratio after adding one student
    const newRatio = (passes + 1) / (total + 1);
    // Marginal gain from adding one student
    const gain = newRatio - currentRatio;

    heap.push({ gain, passes, total });
  }

  // Step 2: Allocate extra students greedily
  for (let i = 0; i < extraStudents; i++) {
    const { passes, total } = heap.pop();

    // Add one student to this class
    const newPasses = passes + 1;
    const newTotal = total + 1;

    // Recalculate marginal gain for next potential addition
    const currentRatio = newPasses / newTotal;
    const nextRatio = (newPasses + 1) / (newTotal + 1);
    const newGain = nextRatio - currentRatio;

    heap.push({ gain: newGain, passes: newPasses, total: newTotal });
  }

  // Step 3: Calculate final average pass ratio
  let totalRatio = 0;
  const heapSize = heap.size();

  // Extract all items from heap to calculate final ratios
  // In practice, we'd iterate through heap.heap directly
  for (const item of heap.heap) {
    totalRatio += item.passes / item.total;
  }

  // Return average across all classes
  return totalRatio / classes.length;
}
```

```java
// Time: O((n + k) log n) where n = number of classes, k = extraStudents
// Space: O(n) for the priority queue
import java.util.PriorityQueue;

class Solution {
    /**
     * Maximizes the average pass ratio by optimally allocating extra students.
     * @param classes - 2D array where classes[i] = [pass_i, total_i]
     * @param extraStudents - number of additional students to allocate
     * @return maximum possible average pass ratio
     */
    public double maxAverageRatio(int[][] classes, int extraStudents) {
        // Max-heap using PriorityQueue with custom comparator
        // We compare based on marginal gain (larger gain first)
        PriorityQueue<double[]> heap = new PriorityQueue<>(
            (a, b) -> Double.compare(b[0], a[0])  // Compare gains in descending order
        );

        // Step 1: Calculate initial marginal gains and build the heap
        for (int[] cls : classes) {
            int passes = cls[0];
            int total = cls[1];

            // Current pass ratio
            double currentRatio = (double) passes / total;
            // Pass ratio after adding one student
            double newRatio = (double) (passes + 1) / (total + 1);
            // Marginal gain from adding one student
            double gain = newRatio - currentRatio;

            // Store [gain, passes, total] in heap
            heap.offer(new double[]{gain, passes, total});
        }

        // Step 2: Allocate extra students greedily
        for (int i = 0; i < extraStudents; i++) {
            // Poll class with maximum marginal gain
            double[] top = heap.poll();
            double gain = top[0];
            int passes = (int) top[1];
            int total = (int) top[2];

            // Add one student to this class
            passes++;
            total++;

            // Recalculate marginal gain for next potential addition
            double currentRatio = (double) passes / total;
            double newRatio = (double) (passes + 1) / (total + 1);
            double newGain = newRatio - currentRatio;

            // Push updated class back into heap
            heap.offer(new double[]{newGain, passes, total});
        }

        // Step 3: Calculate final average pass ratio
        double totalRatio = 0.0;
        int n = classes.length;

        // Extract final pass ratios from heap
        while (!heap.isEmpty()) {
            double[] cls = heap.poll();
            int passes = (int) cls[1];
            int total = (int) cls[2];
            totalRatio += (double) passes / total;
        }

        // Return average across all classes
        return totalRatio / n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O((n + k) log n)` where `n` is the number of classes and `k` is `extraStudents`

- Building the initial heap: `O(n log n)` for inserting `n` elements
- For each of `k` extra students: `O(log n)` to pop and `O(log n)` to push = `O(2k log n)`
- Total: `O((n + 2k) log n)` = `O((n + k) log n)`

**Space Complexity:** `O(n)` for storing the heap with `n` elements

The logarithmic factor comes from heap operations, which is efficient compared to the exponential brute force approach.

## Common Mistakes

1. **Using a min-heap instead of max-heap:** Candidates sometimes forget that Python's `heapq` is a min-heap by default. You need to push negative gains to simulate a max-heap. In Java, you need a custom comparator that sorts in descending order.

2. **Integer division errors:** When calculating ratios in languages like Java or C++, using integer division (`passes/total`) instead of floating-point division (`(double)passes/total`) will give incorrect results (often 0 or 1). Always cast to float/double before division.

3. **Not updating marginal gains correctly:** After adding a student to a class, you must recalculate the marginal gain for the _next_ potential addition, not the gain you just realized. The new gain should be based on `(passes+1)/(total+1) - passes/total` where passes and total are the updated values.

4. **Forgetting to handle edge cases:** What if `extraStudents = 0`? What if a class already has 100% pass ratio? The algorithm still works correctly because adding a student to a perfect class yields zero marginal gain, so it won't be selected.

## When You'll See This Pattern

This greedy-with-heap pattern appears in optimization problems where you need to allocate limited resources to maximize a sum of concave functions. Each allocation gives diminishing returns, so you always pick the option with highest current marginal benefit.

**Related LeetCode problems:**

1. **Maximum Performance of a Team (LeetCode 1383)** - Similar greedy approach where you pick engineers with highest speed, maintaining a min-heap of efficiencies.
2. **IPO (LeetCode 502)** - Use max-heap to pick most profitable projects within capital constraints, similar to picking classes with highest marginal gain.
3. **Reorganize String (LeetCode 767)** - Greedily pick the most frequent character, using a max-heap to track frequencies.

The common thread is using a priority queue to always select the "best" option according to some metric, updating the metric after each selection.

## Key Takeaways

1. **Greedy with heap works for concave optimization:** When adding resources yields diminishing returns (concave functions), always picking the option with highest marginal gain yields the global optimum. A max-heap lets you do this efficiently.

2. **Marginal analysis is key:** Instead of thinking about final states, think about incremental improvements. Calculate how much each possible action improves your objective, then repeatedly take the best action.

3. **Practice heap operations:** Know how to implement max-heaps in languages where only min-heaps are available (Python's `heapq`, Java's `PriorityQueue` with custom comparator).

[Practice this problem on CodeJeet](/problem/maximum-average-pass-ratio)
