---
title: "How to Solve Find the K-Sum of an Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the K-Sum of an Array. Hard difficulty, 41.1% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue)."
date: "2026-03-11"
category: "dsa-patterns"
tags: ["find-the-k-sum-of-an-array", "array", "sorting", "heap-(priority-queue)", "hard"]
---

## How to Solve Find the K-Sum of an Array

This problem asks us to find the k-th largest subsequence sum from an integer array. What makes it challenging is that subsequences are not contiguous (unlike subarrays), and there are 2^n possible subsequences for an array of length n. The brute force approach of generating all sums is impossible for large n. The key insight is transforming the problem into finding the k-th smallest sum in a sorted list of non-negative numbers, then using a priority queue to explore sums efficiently.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 4, -2]`, `k = 5`.

**Step 1: Understanding the problem space**
All possible subsequence sums (including empty subsequence with sum 0):

- []: 0
- [2]: 2
- [4]: 4
- [-2]: -2
- [2, 4]: 6
- [2, -2]: 0
- [4, -2]: 2
- [2, 4, -2]: 4

Sorted unique sums: [-2, 0, 2, 4, 6]
The 5th largest sum would be -2 (1st largest: 6, 2nd: 4, 3rd: 2, 4th: 0, 5th: -2).

**Step 2: The transformation trick**
Instead of working with the original numbers directly, we can:

1. Convert all numbers to non-negative by taking absolute values
2. Sort these absolute values
3. Find the k-th smallest sum in this transformed space
4. Convert back to the original sum space

For our example:

- Absolute values: [2, 2, 4] (sorted)
- The largest subsequence sum in original array = sum of all positive numbers
- Other sums can be obtained by subtracting some absolute values from this max sum

**Step 3: Finding k-th smallest subtraction**
Max sum = 2 + 4 = 6 (sum of positives)
Now we need the 5th largest original sum, which means we need the 5th smallest subtraction from 6.

Possible subtractions (using absolute values [2, 2, 4]):

- Subtract 0: 6
- Subtract 2: 4
- Subtract 2: 4 (duplicate from the other 2)
- Subtract 4: 2
- Subtract 2+2=4: 2
- Subtract 2+4=6: 0
- Subtract 2+4=6: 0 (using the other 2)
- Subtract 2+2+4=8: -2

Sorted unique results: [-2, 0, 2, 4, 6] which matches our original list!

## Brute Force Approach

The brute force solution would generate all 2^n subsequences, calculate their sums, sort them, and return the k-th largest. For n = 20, this is already over 1 million operations. For n = 1000 (typical constraint), it's completely impossible (2^1000 is astronomically large).

```python
# Brute force - DO NOT USE for large n
def kSumBrute(nums, k):
    n = len(nums)
    sums = []

    # Generate all 2^n subsequences using bitmask
    for mask in range(1 << n):
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]
        sums.append(current_sum)

    # Sort and return k-th largest
    sums.sort(reverse=True)
    return sums[k-1]
```

**Why it fails:**

- Time complexity: O(2^n × n) for generation + O(2^n log 2^n) for sorting
- Space complexity: O(2^n) to store all sums
- Completely impractical for n > 20

## Optimized Approach

The key insight comes from these observations:

1. The largest subsequence sum is the sum of all positive numbers
2. Every other subsequence sum can be obtained by subtracting some absolute values from this maximum
3. If we sort absolute values, we can systematically explore sums using a min-heap

**Step-by-step reasoning:**

1. Calculate `maxSum` = sum of all positive numbers
2. Convert all numbers to absolute values and sort them
3. Now we have a list of non-negative numbers: `absSorted`
4. The problem becomes: find the k-th smallest sum we can get by subtracting elements from `absSorted` from `maxSum`
5. Equivalently: find the k-th smallest sum of subsets of `absSorted`
6. Use a min-heap to explore sums in increasing order:
   - Start with sum 0 (subtract nothing)
   - For each current smallest sum, generate new sums by adding the next absolute value
   - Keep track of the index to avoid duplicates

## Optimal Solution

The solution uses a priority queue (min-heap) to efficiently find the k-th smallest sum in the transformed space. We explore sums in increasing order, stopping when we reach the k-th one.

<div class="code-group">

```python
# Time: O(n log n + k log k) | Space: O(k)
def kSum(nums, k):
    """
    Find the k-th largest subsequence sum.

    Approach:
    1. Calculate maxSum = sum of all positive numbers
    2. Convert to absolute values and sort
    3. Find k-th smallest sum in absolute value space
    4. Return maxSum - kthSmallestSum
    """
    # Step 1: Calculate the maximum possible sum (sum of all positives)
    max_sum = 0
    for num in nums:
        if num > 0:
            max_sum += num

    # Step 2: Convert to absolute values and sort
    # This transforms negative numbers into positive values we can subtract
    abs_nums = [abs(num) for num in nums]
    abs_nums.sort()

    # Step 3: Use min-heap to find k-th smallest sum of absolute values
    # We start with 0 (subtracting nothing from max_sum)
    min_heap = [(0, 0)]  # (current_sum, next_index)

    # We need the (k-1)-th smallest because:
    # - 1st smallest is 0 (subtract nothing)
    # - k-th largest in original = max_sum - (k-1)-th smallest in absolute space
    kth_smallest = 0

    for _ in range(k):
        # Get the current smallest sum from heap
        current_sum, idx = heapq.heappop(min_heap)
        kth_smallest = current_sum

        # If we haven't processed all numbers, generate new sums
        if idx < len(abs_nums):
            # Option 1: Add the current absolute value to create new sum
            heapq.heappush(min_heap, (current_sum + abs_nums[idx], idx + 1))

            # Option 2: Replace the last added value with current one
            # This ensures we explore all combinations without duplicates
            if idx > 0:
                heapq.heappush(min_heap, (current_sum - abs_nums[idx-1] + abs_nums[idx], idx + 1))

    # Step 4: Convert back to original sum space
    return max_sum - kth_smallest
```

```javascript
// Time: O(n log n + k log k) | Space: O(k)
function kSum(nums, k) {
  // Step 1: Calculate maximum sum (sum of positives)
  let maxSum = 0;
  for (const num of nums) {
    if (num > 0) {
      maxSum += num;
    }
  }

  // Step 2: Convert to absolute values and sort
  const absNums = nums.map((num) => Math.abs(num));
  absNums.sort((a, b) => a - b);

  // Step 3: Min-heap to find k-th smallest sum
  // Using array as min-heap: [sum, index]
  const minHeap = new MinHeap((a, b) => a[0] - b[0]);
  minHeap.push([0, 0]); // Start with sum 0 at index 0

  let kthSmallest = 0;

  for (let i = 0; i < k; i++) {
    const [currentSum, idx] = minHeap.pop();
    kthSmallest = currentSum;

    if (idx < absNums.length) {
      // Add current absolute value
      minHeap.push([currentSum + absNums[idx], idx + 1]);

      // Replace last added value with current one
      if (idx > 0) {
        minHeap.push([currentSum - absNums[idx - 1] + absNums[idx], idx + 1]);
      }
    }
  }

  // Step 4: Convert back
  return maxSum - kthSmallest;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return root;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      let smallest = index;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
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
// Time: O(n log n + k log k) | Space: O(k)
import java.util.*;

class Solution {
    public long kSum(int[] nums, int k) {
        // Step 1: Calculate maximum sum (sum of positives)
        long maxSum = 0;
        for (int num : nums) {
            if (num > 0) {
                maxSum += num;
            }
        }

        // Step 2: Convert to absolute values and sort
        int[] absNums = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            absNums[i] = Math.abs(nums[i]);
        }
        Arrays.sort(absNums);

        // Step 3: Min-heap to find k-th smallest sum
        // PriorityQueue stores long[] arrays: [sum, index]
        PriorityQueue<long[]> minHeap = new PriorityQueue<>(
            (a, b) -> Long.compare(a[0], b[0])
        );
        minHeap.offer(new long[]{0, 0});  // Start with sum 0 at index 0

        long kthSmallest = 0;

        for (int i = 0; i < k; i++) {
            long[] current = minHeap.poll();
            kthSmallest = current[0];
            int idx = (int) current[1];

            if (idx < absNums.length) {
                // Add current absolute value
                minHeap.offer(new long[]{
                    kthSmallest + absNums[idx],
                    idx + 1
                });

                // Replace last added value with current one
                if (idx > 0) {
                    minHeap.offer(new long[]{
                        kthSmallest - absNums[idx - 1] + absNums[idx],
                        idx + 1
                    });
                }
            }
        }

        // Step 4: Convert back to original sum space
        return maxSum - kthSmallest;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + k log k)**

- `O(n)` to calculate `maxSum` and create absolute values array
- `O(n log n)` to sort the absolute values
- `O(k log k)` for heap operations: we perform k iterations, each with up to 2 heap pushes/pops (log k each)

**Space Complexity: O(k)**

- `O(n)` for the absolute values array (could be done in-place with modification)
- `O(k)` for the min-heap which stores at most O(k) elements

## Common Mistakes

1. **Not handling large sums correctly**: The sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C, BigInt in JavaScript for very large numbers).

2. **Forgetting to sort absolute values**: The algorithm relies on sorted absolute values to avoid duplicate exploration. Without sorting, you'd need to track visited states, increasing complexity.

3. **Incorrect k-th element calculation**: Remember that we need the (k-1)-th smallest sum in absolute space, not the k-th smallest, because the largest original sum corresponds to subtracting 0 (the 1st smallest).

4. **Heap explosion**: Pushing all possible sums at once would blow up memory. The key is to generate sums lazily as we pop from the heap.

## When You'll See This Pattern

This "k-th smallest/largest sum" pattern appears in several problems:

1. **Find K Pairs with Smallest Sums (LeetCode 373)**: Similar heap-based approach to explore sums in sorted order.

2. **Kth Smallest Sum in a Sorted Matrix (LeetCode 1439)**: Uses min-heap to find k-th smallest sum of elements from each row.

3. **Kth Smallest Element in a Sorted Matrix (LeetCode 378)**: While not about sums, it uses similar priority queue techniques for ordered exploration.

The core pattern: when you need the k-th element in a sorted sequence that's too large to generate fully, use a heap to explore elements in order.

## Key Takeaways

1. **Transformation is powerful**: Converting negative numbers to absolute values and working in "subtraction space" simplifies the problem significantly.

2. **Heap for ordered exploration**: When you need the k-th smallest/largest element from a combinatorial space, a min/max-heap lets you explore elements in order without generating everything.

3. **Lazy generation beats precomputation**: Instead of generating all possibilities upfront, generate new candidates only when needed (as you pop from the heap).

[Practice this problem on CodeJeet](/problem/find-the-k-sum-of-an-array)
