---
title: "How to Solve Minimum Sum of Squared Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Sum of Squared Difference. Medium difficulty, 26.8% acceptance rate. Topics: Array, Binary Search, Greedy, Sorting, Heap (Priority Queue)."
date: "2029-12-11"
category: "dsa-patterns"
tags: ["minimum-sum-of-squared-difference", "array", "binary-search", "greedy", "medium"]
---

# How to Solve Minimum Sum of Squared Difference

You're given two arrays `nums1` and `nums2` of length `n`, and two integers `k1` and `k2`. You can decrement elements in `nums1` up to `k1` times and elements in `nums2` up to `k2` times, with each decrement reducing an element by 1. Your goal is to minimize the sum of squared differences between corresponding elements after using these operations. What makes this problem interesting is that you're not just minimizing absolute differences—you're minimizing squared differences, which heavily penalizes large differences, and you have two separate budgets to allocate across two arrays.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
nums1 = [2, 5, 8]
nums2 = [4, 4, 10]
k1 = 2, k2 = 3
```

**Step 1: Calculate initial differences**
We first compute the absolute differences between corresponding elements:

- |2-4| = 2
- |5-4| = 1
- |8-10| = 2

**Step 2: Understand the goal**
The sum of squared differences is: 2² + 1² + 2² = 4 + 1 + 4 = 9

We have 2 operations on nums1 and 3 operations on nums2. Each operation reduces an element by 1. To minimize squared differences, we want to reduce the largest differences first because squaring amplifies large values.

**Step 3: Think about operation allocation**
We can think of having `k = k1 + k2 = 5` total operations to allocate. Each operation can be applied to either array, but only to elements in their respective arrays. However, there's a key insight: if we want to reduce the difference at index `i`, we should decrement the larger of the two values at that index. This brings them closer together.

**Step 4: Apply operations optimally**
Let's sort the differences in descending order: [2, 2, 1]

For the first difference (2 at index 0): nums1[0]=2, nums2[0]=4. nums2 is larger, so we should decrement nums2[0]. We use 1 operation from k2: nums2[0] becomes 3, difference becomes 1.

For the second difference (2 at index 2): nums1[2]=8, nums2[2]=10. nums2 is larger, so we decrement nums2[2]. We use another operation from k2: nums2[2] becomes 9, difference becomes 1.

Now we have differences: [1, 1, 1] and remaining operations: k1=2, k2=1.

We can continue reducing the largest remaining differences. All differences are now 1. Reducing a difference of 1 to 0 saves us 1² - 0² = 1. We have 3 operations left total.

**Step 5: Final calculation**
After using all operations optimally, we might end with differences: [0, 0, 0] (using 3 more operations). Final sum = 0.

This example shows the core idea: we want to allocate operations to reduce the largest differences first, and we should always decrement the larger value in a pair.

## Brute Force Approach

A brute force approach would try all possible ways to distribute `k1` operations among `n` elements in nums1 and `k2` operations among `n` elements in nums2. For each distribution, we'd calculate the resulting sum of squared differences.

The number of ways to distribute `k1` identical operations among `n` elements is given by the stars and bars formula: C(k1 + n - 1, n - 1). For `k2`, it's C(k2 + n - 1, n - 1). The total combinations would be the product of these, which grows exponentially with `k1` and `k2`.

Even for moderate values like n=10, k1=10, k2=10, we'd have C(19,9) × C(19,9) ≈ 92,378 × 92,378 ≈ 8.5 billion combinations. This is clearly infeasible.

A slightly better but still inefficient approach would be to always apply operations to the current largest difference. However, without careful tracking and optimization, this could still be O((k1+k2) × n) if implemented naively, which is too slow when k values can be up to 10⁹.

## Optimized Approach

The key insight is that we don't need to simulate each operation individually. Instead, we can:

1. **Focus on differences**: Calculate the absolute differences `diff[i] = |nums1[i] - nums2[i]|`. Our goal is to reduce these differences.

2. **Combine operation budgets**: Since we can decrement either array (but only the larger value in a pair to reduce the difference), we effectively have `k = k1 + k2` total operations to reduce differences.

3. **Prioritize largest differences**: To minimize the sum of squares, we should always reduce the largest current difference because squaring amplifies large values. Reducing a difference from `d` to `d-1` reduces the squared sum by `d² - (d-1)² = 2d - 1`, which is larger when `d` is larger.

4. **Use a max-heap or sorting**: We need to repeatedly find and reduce the largest difference. A max-heap gives us O(log n) per operation, but with k up to 10⁹, we need something better.

5. **Binary search on the target difference**: Instead of simulating operations one by one, we can determine what the maximum difference will be after using all operations. We can binary search for a target value `t` such that we need ≤ k operations to reduce all differences to at most `t`.

6. **Handle leftover operations**: After reducing all differences to at most `t`, we might have some operations left. These can be used to further reduce some differences from `t` to `t-1`, but only if it's beneficial.

The optimal approach uses a priority queue (max-heap) for smaller k values, but for the general case where k can be huge, we need the binary search approach.

## Optimal Solution

The most efficient solution uses binary search to find the maximum difference after optimally using operations, then handles any remaining operations. Here's how it works:

1. Calculate absolute differences between corresponding elements.
2. Binary search for the smallest possible maximum difference `t` after using operations.
3. For a candidate `t`, calculate how many operations are needed to reduce all differences to ≤ t.
4. If needed operations ≤ k, `t` is feasible; try smaller `t`. Otherwise, try larger `t`.
5. After finding the minimal feasible `t`, use any remaining operations to further reduce some differences from `t` to `t-1`.

<div class="code-group">

```python
# Time: O(n log(maxDiff)) where maxDiff is the maximum initial difference
# Space: O(n) for storing differences
class Solution:
    def minSumSquareDiff(self, nums1: List[int], nums2: List[int], k1: int, k2: int) -> int:
        n = len(nums1)
        k = k1 + k2  # Total operations available

        # Step 1: Calculate absolute differences
        diff = [abs(nums1[i] - nums2[i]) for i in range(n)]

        # If we have enough operations to reduce all differences to 0
        if sum(diff) <= k:
            return 0

        # Step 2: Binary search for the minimum possible maximum difference
        # after using at most k operations
        left, right = 0, max(diff)

        while left < right:
            mid = (left + right) // 2
            # Calculate operations needed to reduce all differences to <= mid
            ops_needed = 0
            for d in diff:
                if d > mid:
                    ops_needed += d - mid

            if ops_needed <= k:
                right = mid  # mid is feasible, try smaller
            else:
                left = mid + 1  # mid is not feasible, try larger

        target = left  # Minimum possible maximum difference

        # Step 3: Use operations to reduce differences to target
        remaining_ops = k
        for i in range(n):
            if diff[i] > target:
                ops_used = diff[i] - target
                remaining_ops -= ops_used
                diff[i] = target

        # Step 4: Use any remaining operations to further reduce
        # some differences from target to target-1
        # We use a max-heap to always reduce the largest differences first
        import heapq
        # Create max-heap by negating values
        max_heap = [-d for d in diff]
        heapq.heapify(max_heap)

        while remaining_ops > 0 and max_heap:
            d = -heapq.heappop(max_heap)
            if d == 0:
                break  # Can't reduce further
            # Reduce this difference by 1
            d -= 1
            remaining_ops -= 1
            heapq.heappush(max_heap, -d)

        # Step 5: Calculate final sum of squares
        result = 0
        while max_heap:
            d = -heapq.heappop(max_heap)
            result += d * d

        return result
```

```javascript
// Time: O(n log(maxDiff)) where maxDiff is the maximum initial difference
// Space: O(n) for storing differences
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k1
 * @param {number} k2
 * @return {number}
 */
var minSumSquareDiff = function (nums1, nums2, k1, k2) {
  const n = nums1.length;
  let k = k1 + k2; // Total operations available

  // Step 1: Calculate absolute differences
  let diff = new Array(n);
  let maxDiff = 0;
  for (let i = 0; i < n; i++) {
    diff[i] = Math.abs(nums1[i] - nums2[i]);
    maxDiff = Math.max(maxDiff, diff[i]);
  }

  // If we have enough operations to reduce all differences to 0
  let totalDiff = diff.reduce((sum, val) => sum + val, 0);
  if (totalDiff <= k) {
    return 0;
  }

  // Step 2: Binary search for the minimum possible maximum difference
  let left = 0,
    right = maxDiff;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    // Calculate operations needed to reduce all differences to <= mid
    let opsNeeded = 0;
    for (let d of diff) {
      if (d > mid) {
        opsNeeded += d - mid;
      }
    }

    if (opsNeeded <= k) {
      right = mid; // mid is feasible, try smaller
    } else {
      left = mid + 1; // mid is not feasible, try larger
    }
  }

  let target = left; // Minimum possible maximum difference

  // Step 3: Use operations to reduce differences to target
  let remainingOps = k;
  for (let i = 0; i < n; i++) {
    if (diff[i] > target) {
      let opsUsed = diff[i] - target;
      remainingOps -= opsUsed;
      diff[i] = target;
    }
  }

  // Step 4: Use any remaining operations to further reduce differences
  // Create max-heap (using negative values for max-heap simulation)
  let maxHeap = new MaxHeap();
  for (let d of diff) {
    maxHeap.push(d);
  }

  while (remainingOps > 0 && maxHeap.size() > 0) {
    let d = maxHeap.pop();
    if (d === 0) break; // Can't reduce further

    // Reduce this difference by 1
    d -= 1;
    remainingOps -= 1;
    maxHeap.push(d);
  }

  // Step 5: Calculate final sum of squares
  let result = 0;
  while (maxHeap.size() > 0) {
    let d = maxHeap.pop();
    result += d * d;
  }

  return result;
};

// MaxHeap implementation for JavaScript
class MaxHeap {
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
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  _sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

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
      index = swap;
    }
    this.heap[index] = element;
  }
}
```

```java
// Time: O(n log(maxDiff)) where maxDiff is the maximum initial difference
// Space: O(n) for storing differences
import java.util.*;

class Solution {
    public long minSumSquareDiff(int[] nums1, int[] nums2, int k1, int k2) {
        int n = nums1.length;
        long k = (long)k1 + k2;  // Total operations available

        // Step 1: Calculate absolute differences
        int[] diff = new int[n];
        int maxDiff = 0;
        long totalDiff = 0;
        for (int i = 0; i < n; i++) {
            diff[i] = Math.abs(nums1[i] - nums2[i]);
            maxDiff = Math.max(maxDiff, diff[i]);
            totalDiff += diff[i];
        }

        // If we have enough operations to reduce all differences to 0
        if (totalDiff <= k) {
            return 0;
        }

        // Step 2: Binary search for the minimum possible maximum difference
        int left = 0, right = maxDiff;
        while (left < right) {
            int mid = left + (right - left) / 2;
            // Calculate operations needed to reduce all differences to <= mid
            long opsNeeded = 0;
            for (int d : diff) {
                if (d > mid) {
                    opsNeeded += d - mid;
                }
            }

            if (opsNeeded <= k) {
                right = mid;  // mid is feasible, try smaller
            } else {
                left = mid + 1;  // mid is not feasible, try larger
            }
        }

        int target = left;  // Minimum possible maximum difference

        // Step 3: Use operations to reduce differences to target
        long remainingOps = k;
        for (int i = 0; i < n; i++) {
            if (diff[i] > target) {
                int opsUsed = diff[i] - target;
                remainingOps -= opsUsed;
                diff[i] = target;
            }
        }

        // Step 4: Use any remaining operations to further reduce differences
        // Use a max-heap (PriorityQueue with reverse order)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int d : diff) {
            maxHeap.offer(d);
        }

        while (remainingOps > 0 && !maxHeap.isEmpty()) {
            int d = maxHeap.poll();
            if (d == 0) break;  // Can't reduce further

            // Reduce this difference by 1
            d -= 1;
            remainingOps -= 1;
            maxHeap.offer(d);
        }

        // Step 5: Calculate final sum of squares
        long result = 0;
        while (!maxHeap.isEmpty()) {
            long d = maxHeap.poll();
            result += d * d;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log M) where n is the array length and M is the maximum initial difference. The binary search runs O(log M) iterations, and each iteration requires O(n) time to calculate needed operations. The heap operations at the end take O(n log n) in worst case, but typically much less since we only process remaining operations.

**Space Complexity:** O(n) for storing the differences array and the priority queue.

The binary search is efficient because M ≤ 10⁵ (maximum element value in the input arrays), so log M ≤ 17. This makes the solution scalable even for large k values up to 10⁹.

## Common Mistakes

1. **Simulating operations one by one**: With k up to 10⁹, O(k) operations is impossible. Candidates might try to use a heap and simulate each operation, which times out for large k.

2. **Forgetting to combine k1 and k2**: Some candidates try to allocate k1 operations only to nums1 and k2 only to nums2. The optimal solution uses the combined budget k = k1 + k2 because you can always decrement the larger value in a pair, regardless of which array it's in.

3. **Incorrect binary search condition**: When calculating operations needed for a candidate target t, you must sum `d - t` for all differences `d > t`. A common mistake is to use `max(0, d - t)` without the condition, which is correct but less efficient, or to use absolute values incorrectly.

4. **Not handling remaining operations after binary search**: After reducing all differences to at most `t`, you might have operations left. These should be used to further reduce the largest remaining differences from `t` to `t-1`. Forgetting this step leads to suboptimal results.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search on answer**: When you need to find the minimum or maximum value that satisfies a condition, and checking feasibility is easier than finding the answer directly. Similar problems:
   - [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) - Binary search for minimum capacity
   - [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) - Binary search for minimum eating speed

2. **Greedy allocation with priority queues**: When you need to repeatedly apply operations to the largest/smallest element. Similar problems:
   - [Minimum Operations to Halve Array Sum](https://leetcode.com/problems/minimum-operations-to-halve-array-sum/) - Always halve the largest element
   - [Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team/) - Use min-heap to track smallest efficiency

3. **Minimizing sum of squares**: The mathematical insight that reducing larger differences first gives more benefit when minimizing squares. Similar to variance minimization in statistics.

## Key Takeaways

1. **When k is large, don't simulate operations**: Use binary search or mathematical formulas to determine the final state after all operations. This pattern appears whenever operations can be applied many times (k up to 10⁹).

2. **Combine related constraints**: When you have separate budgets that affect the same goal (reducing differences), they can often be combined into a single budget. Look for ways to unify constraints.

3. **Squared differences penalize large values heavily**: When minimizing sum of squares, always address the largest differences first. The benefit of reducing a difference from d to d-1 is 2d-1, which increases with d.

4. **Binary search on answer is powerful**: When direct computation is hard but checking feasibility is easy, binary search can often find the optimal value efficiently.

Related problems: [Minimum Absolute Sum Difference](/problem/minimum-absolute-sum-difference), [Partition Array Into Two Arrays to Minimize Sum Difference](/problem/partition-array-into-two-arrays-to-minimize-sum-difference)
