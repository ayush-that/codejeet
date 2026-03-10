---
title: "How to Solve Maximum Subsequence Score — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Subsequence Score. Medium difficulty, 54.6% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2026-09-14"
category: "dsa-patterns"
tags: ["maximum-subsequence-score", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Subsequence Score

This problem asks us to choose exactly `k` indices from two equal-length arrays `nums1` and `nums2` to maximize the score, which is defined as the sum of selected `nums1` values multiplied by the minimum of selected `nums2` values. The challenge comes from the interaction between these two arrays: we need to balance selecting large `nums1` values while also ensuring our minimum `nums2` value isn't too small. This is a classic "greedy with heap" problem that tests your ability to combine sorting with priority queue techniques.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `nums1 = [1,3,3,2]`, `nums2 = [2,1,3,4]`, `k = 3`

We need to choose 3 indices. The score is `(sum of chosen nums1) × (min of chosen nums2)`.

**Step 1: Pair the values**
First, let's pair corresponding elements: `[(1,2), (3,1), (3,3), (2,4)]` where each pair is `(nums1[i], nums2[i])`.

**Step 2: Sort by nums2 in descending order**
If we sort by `nums2` descending, we get: `[(2,4), (3,3), (1,2), (3,1)]`

**Step 3: Process with a min-heap**
Now we process from largest `nums2` to smallest:

- Take first 3 elements: `(2,4), (3,3), (1,2)`
  - Sum of nums1 = 2 + 3 + 1 = 6
  - Min of nums2 = min(4,3,2) = 2
  - Score = 6 × 2 = 12
  - Store in heap: [1, 2, 3] (sorted as min-heap: [1, 2, 3])

- Move to next element `(3,1)`:
  - Current sum = 6, current min = 2
  - If we replace the smallest nums1 (1) with 3:
    - New sum = 6 - 1 + 3 = 8
    - New min = min(4,3,1) = 1 (from the new element's nums2)
    - New score = 8 × 1 = 8 (worse than 12)
  - So we keep our current selection

**Step 4: Try other combinations**
What if we started with different elements? The key insight is that by processing in descending `nums2` order, we guarantee that the current element's `nums2` is the minimum among our selection. This lets us focus on maximizing the sum of `nums1` values while knowing exactly what the multiplier will be.

The optimal solution is actually `(3,3), (3,1), (2,4)` with sum = 8, min = 3, score = 24. We'll see how our algorithm finds this.

## Brute Force Approach

The brute force solution would try all possible combinations of `k` indices from `n` total indices. For each combination:

1. Calculate the sum of selected `nums1` values
2. Find the minimum of selected `nums2` values
3. Compute the score and track the maximum

This requires checking `C(n, k)` combinations, which grows factorially. Even for moderate `n` and `k`, this becomes computationally impossible. For example, with `n=1000` and `k=500`, we'd have approximately `10^299` combinations to check.

<div class="code-group">

```python
# Brute Force - Too slow for large inputs
# Time: O(C(n,k) * k) | Space: O(k)
def maxScoreBruteForce(nums1, nums2, k):
    n = len(nums1)
    max_score = 0

    # Generate all combinations of k indices
    from itertools import combinations

    for indices in combinations(range(n), k):
        sum_nums1 = 0
        min_nums2 = float('inf')

        for i in indices:
            sum_nums1 += nums1[i]
            min_nums2 = min(min_nums2, nums2[i])

        score = sum_nums1 * min_nums2
        max_score = max(max_score, score)

    return max_score
```

```javascript
// Brute Force - Too slow for large inputs
// Time: O(C(n,k) * k) | Space: O(k)
function maxScoreBruteForce(nums1, nums2, k) {
  const n = nums1.length;
  let maxScore = 0;

  // Helper function to generate combinations
  function* combine(start, combo) {
    if (combo.length === k) {
      yield combo.slice();
      return;
    }

    for (let i = start; i < n; i++) {
      combo.push(i);
      yield* combine(i + 1, combo);
      combo.pop();
    }
  }

  for (const indices of combine(0, [])) {
    let sumNums1 = 0;
    let minNums2 = Infinity;

    for (const i of indices) {
      sumNums1 += nums1[i];
      minNums2 = Math.min(minNums2, nums2[i]);
    }

    const score = sumNums1 * minNums2;
    maxScore = Math.max(maxScore, score);
  }

  return maxScore;
}
```

```java
// Brute Force - Too slow for large inputs
// Time: O(C(n,k) * k) | Space: O(k)
public long maxScoreBruteForce(int[] nums1, int[] nums2, int k) {
    int n = nums1.length;
    long maxScore = 0;

    // Generate all combinations using bitmask (only works for n <= 20)
    // This shows why brute force is impractical
    for (int mask = 0; mask < (1 << n); mask++) {
        if (Integer.bitCount(mask) != k) continue;

        long sum = 0;
        int min = Integer.MAX_VALUE;

        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                sum += nums1[i];
                min = Math.min(min, nums2[i]);
            }
        }

        maxScore = Math.max(maxScore, sum * min);
    }

    return maxScore;
}
```

</div>

The brute force approach is clearly infeasible for the problem constraints (n up to 10^5). We need a smarter approach.

## Optimized Approach

The key insight is that we can fix the minimum `nums2` value and then maximize the sum of `nums1` values. Here's the step-by-step reasoning:

1. **Pair elements**: Combine corresponding elements from both arrays into pairs `(nums1[i], nums2[i])`.

2. **Sort by nums2 descending**: This allows us to process elements in order of decreasing `nums2` values. When we consider an element at position `i`, we know that `nums2[i]` is the smallest `nums2` value among all elements we've considered so far (because we're processing in descending order).

3. **Maintain a min-heap of size k**: As we process elements in sorted order:
   - Add the current `nums1` value to our sum and to the heap
   - If the heap size exceeds `k`, remove the smallest `nums1` value from the heap (and subtract it from the sum)
   - This ensures we always have the `k` largest `nums1` values among the elements we've processed so far

4. **Calculate candidate score**: When we have exactly `k` elements in our heap, the current element's `nums2` value is the minimum (because of our sorting), and we have the largest possible sum of `nums1` values from the elements processed so far. Calculate `sum × current_nums2` and track the maximum.

This greedy approach works because:

- By processing in descending `nums2` order, we guarantee the current element sets the minimum
- By keeping the largest `k` `nums1` values in a min-heap, we maximize the sum for that minimum
- We consider every possible element as the minimum, so we don't miss the optimal solution

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution using Sorting and Min-Heap
# Time: O(n log n) | Space: O(n)
def maxScore(nums1, nums2, k):
    """
    Calculate the maximum score by selecting k indices.

    Args:
        nums1: List of integers for the sum component
        nums2: List of integers for the min component
        k: Number of indices to select

    Returns:
        Maximum possible score
    """
    # Step 1: Pair elements from both arrays
    # Each pair is (nums1[i], nums2[i])
    pairs = [(a, b) for a, b in zip(nums1, nums2)]

    # Step 2: Sort pairs by nums2 in descending order
    # This ensures when we process an element, its nums2 value
    # is the smallest among elements considered so far
    pairs.sort(key=lambda x: x[1], reverse=True)

    # Step 3: Initialize min-heap and running sum
    import heapq
    min_heap = []  # Will store nums1 values of selected elements
    current_sum = 0  # Sum of nums1 values in the heap
    max_score = 0

    # Step 4: Process each element in sorted order
    for nums1_val, nums2_val in pairs:
        # Add current nums1 value to heap and sum
        heapq.heappush(min_heap, nums1_val)
        current_sum += nums1_val

        # If we have more than k elements, remove the smallest nums1
        # This ensures we always keep the k largest nums1 values
        if len(min_heap) > k:
            smallest = heapq.heappop(min_heap)
            current_sum -= smallest

        # When we have exactly k elements, calculate candidate score
        # Current nums2_val is the minimum because of our sorting order
        if len(min_heap) == k:
            candidate_score = current_sum * nums2_val
            max_score = max(max_score, candidate_score)

    return max_score
```

```javascript
// Optimal Solution using Sorting and Min-Heap
// Time: O(n log n) | Space: O(n)
function maxScore(nums1, nums2, k) {
  /**
   * Calculate the maximum score by selecting k indices.
   *
   * @param {number[]} nums1 - Array for the sum component
   * @param {number[]} nums2 - Array for the min component
   * @param {number} k - Number of indices to select
   * @return {number} Maximum possible score
   */

  // Step 1: Pair elements from both arrays
  const pairs = nums1.map((num, index) => [num, nums2[index]]);

  // Step 2: Sort pairs by nums2 in descending order
  // This ensures when we process an element, its nums2 value
  // is the smallest among elements considered so far
  pairs.sort((a, b) => b[1] - a[1]);

  // Step 3: Initialize min-heap and running sum
  const minHeap = new MinHeap();
  let currentSum = 0;
  let maxScore = 0;

  // Step 4: Process each element in sorted order
  for (const [nums1Val, nums2Val] of pairs) {
    // Add current nums1 value to heap and sum
    minHeap.push(nums1Val);
    currentSum += nums1Val;

    // If we have more than k elements, remove the smallest nums1
    // This ensures we always keep the k largest nums1 values
    if (minHeap.size() > k) {
      const smallest = minHeap.pop();
      currentSum -= smallest;
    }

    // When we have exactly k elements, calculate candidate score
    // Current nums2Val is the minimum because of our sorting order
    if (minHeap.size() === k) {
      const candidateScore = currentSum * nums2Val;
      maxScore = Math.max(maxScore, candidateScore);
    }
  }

  return maxScore;
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
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
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
// Optimal Solution using Sorting and Min-Heap
// Time: O(n log n) | Space: O(n)
class Solution {
    public long maxScore(int[] nums1, int[] nums2, int k) {
        /**
         * Calculate the maximum score by selecting k indices.
         *
         * @param nums1 Array for the sum component
         * @param nums2 Array for the min component
         * @param k Number of indices to select
         * @return Maximum possible score
         */

        int n = nums1.length;

        // Step 1: Create array of pairs
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) {
            pairs[i][0] = nums1[i];
            pairs[i][1] = nums2[i];
        }

        // Step 2: Sort pairs by nums2 in descending order
        // This ensures when we process an element, its nums2 value
        // is the smallest among elements considered so far
        Arrays.sort(pairs, (a, b) -> b[1] - a[1]);

        // Step 3: Initialize min-heap and running sum
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        long currentSum = 0;
        long maxScore = 0;

        // Step 4: Process each element in sorted order
        for (int i = 0; i < n; i++) {
            int nums1Val = pairs[i][0];
            int nums2Val = pairs[i][1];

            // Add current nums1 value to heap and sum
            minHeap.offer(nums1Val);
            currentSum += nums1Val;

            // If we have more than k elements, remove the smallest nums1
            // This ensures we always keep the k largest nums1 values
            if (minHeap.size() > k) {
                int smallest = minHeap.poll();
                currentSum -= smallest;
            }

            // When we have exactly k elements, calculate candidate score
            // Current nums2Val is the minimum because of our sorting order
            if (minHeap.size() == k) {
                long candidateScore = currentSum * nums2Val;
                maxScore = Math.max(maxScore, candidateScore);
            }
        }

        return maxScore;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the pairs takes O(n log n)
- Each heap operation (push/pop) takes O(log k) time, and we perform O(n) such operations
- Since k ≤ n, O(n log k) is dominated by O(n log n)

**Space Complexity: O(n)**

- We store all n pairs in an array: O(n)
- The heap stores at most k elements: O(k)
- Total: O(n + k) = O(n) since k ≤ n

The sorting step is the bottleneck, making this an O(n log n) solution overall.

## Common Mistakes

1. **Sorting by the wrong array**: Candidates often sort by `nums1` descending to maximize the sum, but this ignores the `nums2` minimum constraint. Always sort by `nums2` descending so the current element sets the minimum.

2. **Forgetting to remove smallest elements**: When the heap size exceeds k, you must remove the smallest `nums1` value. Failing to do this means you're not keeping the k largest values, which is essential for maximizing the sum.

3. **Using max-heap instead of min-heap**: We need a min-heap to efficiently remove the smallest element when we exceed k elements. A max-heap would require O(k) time to find and remove the smallest element.

4. **Integer overflow**: The product `sum × min_nums2` can be large (up to 10^5 × 10^5 × 10^5 = 10^15). Use 64-bit integers (long in Java/C++, long long in C, normal int in Python handles big integers automatically).

5. **Not handling k=1 or k=n cases**: These edge cases should work correctly. When k=1, we're just looking for the maximum `nums1[i] × nums2[i]`. When k=n, we must take all elements.

## When You'll See This Pattern

This "sort + heap" pattern appears in problems where you need to:

1. Select k elements based on multiple criteria
2. One criterion acts as a constraint (like a minimum)
3. You need to maximize or minimize another criterion under that constraint

**Related problems:**

1. **IPO (LeetCode 502)**: Similar pattern of sorting by capital and using a heap to maximize profit.
2. **Minimum Cost to Hire K Workers (LeetCode 857)**: Sort by wage/quality ratio, use heap to track k smallest quality values.
3. **Maximum Performance of a Team (LeetCode 1383)**: Almost identical structure - sort by efficiency, use heap to track largest speeds.

The pattern recognition is: when you see "choose k elements to maximize/minimize f(x) subject to g(x) constraint", think about sorting by the constraint variable and using a heap to optimize the objective.

## Key Takeaways

1. **Fix one variable, optimize the other**: When dealing with multi-criteria optimization, try fixing one criterion (like the minimum `nums2`) and then optimizing the other (maximizing sum of `nums1`).

2. **Sorting enables greedy choices**: Sorting by the constraint variable (descending for minimum constraints, ascending for maximum constraints) allows you to process elements in an order where the constraint is determined by the current element.

3. **Heap maintains top k elements**: A min-heap efficiently maintains the k largest elements (by removing the smallest when needed), while a max-heap maintains the k smallest elements.

4. **Consider every element as the constraint**: By processing all elements in sorted order, you consider each one as a potential "bottleneck" for the constraint, ensuring you don't miss the optimal solution.

Related problems: [IPO](/problem/ipo), [Minimum Cost to Hire K Workers](/problem/minimum-cost-to-hire-k-workers)
