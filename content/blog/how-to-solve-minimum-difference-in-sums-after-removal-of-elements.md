---
title: "How to Solve Minimum Difference in Sums After Removal of Elements — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Difference in Sums After Removal of Elements. Hard difficulty, 69.8% acceptance rate. Topics: Array, Dynamic Programming, Heap (Priority Queue)."
date: "2027-10-24"
category: "dsa-patterns"
tags:
  [
    "minimum-difference-in-sums-after-removal-of-elements",
    "array",
    "dynamic-programming",
    "heap-(priority-queue)",
    "hard",
  ]
---

# How to Solve Minimum Difference in Sums After Removal of Elements

You're given an array of `3n` elements and need to remove exactly `n` elements, then split the remaining `2n` elements into two equal halves. Your goal is to minimize the absolute difference between the sum of the first half and the sum of the second half. What makes this problem tricky is that you're not just partitioning the array — you first remove elements, then split what's left. The optimal removal strategy isn't obvious, and brute force checking all possibilities is impossible for large `n`.

## Visual Walkthrough

Let's walk through a small example: `nums = [7, 9, 5, 8, 1, 3]` where `n = 2` (since `3n = 6`).

We need to remove exactly `n = 2` elements, leaving `4` elements to split into two groups of `2` each.

**Step 1: Understanding the structure**
After removing 2 elements, we'll have 4 elements left. The first 2 will go to the "left" group, the last 2 to the "right" group. So we're essentially looking for a way to remove elements such that:

- The first `n` remaining elements have a sum as close as possible to
- The last `n` remaining elements

**Step 2: Thinking about positions**
Consider the final arrangement after removal. The first `n` elements in the final array come from somewhere in the first part of the original array, and the last `n` elements come from somewhere in the last part. The removed elements can be anywhere.

**Step 3: Key insight**
Instead of thinking about which elements to remove, think about which elements to keep for each half. For the left sum (first `n` elements), we want relatively large numbers from the first part of the array. For the right sum (last `n` elements), we want relatively small numbers from the last part of the array.

Let's test one possible solution:

- Remove `7` and `1`
- Remaining: `[9, 5, 8, 3]`
- Left half: `[9, 5]` sum = 14
- Right half: `[8, 3]` sum = 11
- Difference = |14 - 11| = 3

But can we do better? Let's try:

- Remove `9` and `8`
- Remaining: `[7, 5, 1, 3]`
- Left: `[7, 5]` sum = 12
- Right: `[1, 3]` sum = 4
- Difference = 8 (worse)

**Step 4: The systematic approach**
The optimal solution requires us to consider all possible split points. For each possible split, we need to know:

- The smallest possible sum of `n` elements we can get from the left side (for the left group)
- The largest possible sum of `n` elements we can get from the right side (for the right group)

Wait — that's backwards! Actually, we want the left sum to be as small as possible and the right sum to be as large as possible to minimize the difference? Let me reconsider...

Actually, we want the two sums to be as close as possible. So we need to consider both possibilities: making left sum large/right sum small OR left sum small/right sum large. The optimal approach is to precompute for each possible split point:

- The minimum possible sum of `n` elements in the prefix (for when we want left sum small)
- The maximum possible sum of `n` elements in the prefix (for when we want left sum large)
- The minimum possible sum of `n` elements in the suffix (for when we want right sum small)
- The maximum possible sum of `n` elements in the suffix (for when we want right sum large)

## Brute Force Approach

The brute force approach would try all possible ways to remove `n` elements from `3n` elements, which is C(3n, n) combinations. For each removal, we'd split the remaining elements and calculate the difference.

For `n = 10` (array size 30), C(30, 10) ≈ 30 million combinations. For `n = 100` (array size 300), C(300, 100) is astronomically large — completely infeasible.

Even if we tried to be smarter by considering which elements go to which half, we'd still have exponential complexity. We need a polynomial-time solution.

## Optimized Approach

The key insight is that we can think about this as finding a split point `i` where:

- We take `n` elements from `nums[0..i]` for the left group
- We take `n` elements from `nums[i+1..3n-1]` for the right group
- The removed elements are everything else

But wait, that's not quite right either because `i` could be anywhere, and we need exactly `n` elements in each group.

Actually, here's the correct insight: After we decide which `n` elements go to the left group and which `n` go to the right group, there will be some boundary between them. All left group elements come before this boundary in the original array, and all right group elements come after it.

So we can iterate through all possible boundaries `k` from `n` to `2n` (inclusive), where:

- The left group consists of `n` elements from `nums[0..k-1]`
- The right group consists of `n` elements from `nums[k..3n-1]`
- The removed elements are the remaining elements

For each boundary `k`, we need:

1. The minimum possible sum of `n` elements from `nums[0..k-1]` (if we want to minimize left sum)
2. The maximum possible sum of `n` elements from `nums[0..k-1]` (if we want to maximize left sum)
3. The minimum possible sum of `n` elements from `nums[k..3n-1]` (if we want to minimize right sum)
4. The maximum possible sum of `n` elements from `nums[k..3n-1]` (if we want to maximize right sum)

Then for each `k`, the minimum difference would be:

- Either `|min_left_sum - max_right_sum|` (if left is small, right is large)
- Or `|max_left_sum - min_right_sum|` (if left is large, right is small)

We take the minimum over all `k`.

**How to compute these sums efficiently?**
We can use two heaps (priority queues):

- For the prefix: maintain a max-heap of size `n` to get the smallest `n` elements (by keeping the largest elements and popping when size > n)
- For the suffix: maintain a min-heap of size `n` to get the largest `n` elements (by keeping the smallest elements and popping when size > n)

We precompute arrays:

- `minLeft[i]` = minimum sum of `n` elements in `nums[0..i]`
- `maxLeft[i]` = maximum sum of `n` elements in `nums[0..i]`
- `minRight[i]` = minimum sum of `n` elements in `nums[i..3n-1]`
- `maxRight[i]` = maximum sum of `n` elements in `nums[i..3n-1]`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minimumDifference(nums):
    """
    Find minimum difference between sums of two groups after removing n elements.

    Approach:
    1. Precompute for each position:
       - minLeft[i]: minimum sum of n elements in nums[0..i]
       - maxLeft[i]: maximum sum of n elements in nums[0..i]
       - minRight[i]: minimum sum of n elements in nums[i..end]
       - maxRight[i]: maximum sum of n elements in nums[i..end]
    2. For each possible split point k from n to 2n:
       - Calculate possible differences using precomputed values
       - Track minimum difference
    """
    n = len(nums) // 3
    total_len = 3 * n

    # Arrays to store precomputed values
    minLeft = [0] * total_len
    maxLeft = [0] * total_len
    minRight = [0] * total_len
    maxRight = [0] * total_len

    # Compute minLeft and maxLeft using a max-heap and min-heap respectively
    import heapq

    # For minLeft: we want the smallest n elements in the prefix
    # Use a max-heap to keep track of the largest elements
    max_heap = []
    left_sum = 0

    for i in range(total_len):
        # Add current element to heap and sum
        heapq.heappush(max_heap, -nums[i])
        left_sum += nums[i]

        # If we have more than n elements, remove the largest one
        if len(max_heap) > n:
            largest = -heapq.heappop(max_heap)
            left_sum -= largest

        # Store the minimum sum of n elements up to index i
        if i >= n - 1:
            minLeft[i] = left_sum
        else:
            minLeft[i] = float('inf')

    # For maxLeft: we want the largest n elements in the prefix
    # Use a min-heap to keep track of the smallest elements
    min_heap = []
    left_sum = 0

    for i in range(total_len):
        # Add current element to heap and sum
        heapq.heappush(min_heap, nums[i])
        left_sum += nums[i]

        # If we have more than n elements, remove the smallest one
        if len(min_heap) > n:
            smallest = heapq.heappop(min_heap)
            left_sum -= smallest

        # Store the maximum sum of n elements up to index i
        if i >= n - 1:
            maxLeft[i] = left_sum
        else:
            maxLeft[i] = float('-inf')

    # Compute minRight and maxRight (traverse from right to left)
    # For minRight: we want the smallest n elements in the suffix
    # Use a max-heap (but we're traversing right to left)
    max_heap = []
    right_sum = 0

    for i in range(total_len - 1, -1, -1):
        # Add current element to heap and sum
        heapq.heappush(max_heap, -nums[i])
        right_sum += nums[i]

        # If we have more than n elements, remove the largest one
        if len(max_heap) > n:
            largest = -heapq.heappop(max_heap)
            right_sum -= largest

        # Store the minimum sum of n elements from index i to end
        if i <= total_len - n:
            minRight[i] = right_sum
        else:
            minRight[i] = float('inf')

    # For maxRight: we want the largest n elements in the suffix
    # Use a min-heap (traversing right to left)
    min_heap = []
    right_sum = 0

    for i in range(total_len - 1, -1, -1):
        # Add current element to heap and sum
        heapq.heappush(min_heap, nums[i])
        right_sum += nums[i]

        # If we have more than n elements, remove the smallest one
        if len(min_heap) > n:
            smallest = heapq.heappop(min_heap)
            right_sum -= smallest

        # Store the maximum sum of n elements from index i to end
        if i <= total_len - n:
            maxRight[i] = right_sum
        else:
            maxRight[i] = float('-inf')

    # Now find the minimum difference
    # Split point k ranges from n to 2n (inclusive)
    # At split point k: left part is [0..k-1], right part is [k..end]
    min_diff = float('inf')

    for k in range(n, 2 * n + 1):
        # k-1 is the last index of left part
        # k is the first index of right part

        # Case 1: Minimize left sum, maximize right sum
        diff1 = abs(minLeft[k-1] - maxRight[k])
        # Case 2: Maximize left sum, minimize right sum
        diff2 = abs(maxLeft[k-1] - minRight[k])

        min_diff = min(min_diff, diff1, diff2)

    return min_diff
```

```javascript
// Time: O(n log n) | Space: O(n)
function minimumDifference(nums) {
  /**
   * Find minimum difference between sums of two groups after removing n elements.
   *
   * Approach:
   * 1. Precompute for each position:
   *    - minLeft[i]: minimum sum of n elements in nums[0..i]
   *    - maxLeft[i]: maximum sum of n elements in nums[0..i]
   *    - minRight[i]: minimum sum of n elements in nums[i..end]
   *    - maxRight[i]: maximum sum of n elements in nums[i..end]
   * 2. For each possible split point k from n to 2n:
   *    - Calculate possible differences using precomputed values
   *    - Track minimum difference
   */
  const n = nums.length / 3;
  const totalLen = 3 * n;

  // Arrays to store precomputed values
  const minLeft = new Array(totalLen).fill(0);
  const maxLeft = new Array(totalLen).fill(0);
  const minRight = new Array(totalLen).fill(0);
  const maxRight = new Array(totalLen).fill(0);

  // Helper class for max-heap (using min-heap with negative values)
  class MaxHeap {
    constructor() {
      this.heap = [];
    }

    push(val) {
      this.heap.push(-val);
      this.heap.sort((a, b) => a - b); // Simple sort for clarity
    }

    pop() {
      return -this.heap.shift();
    }

    size() {
      return this.heap.length;
    }
  }

  // For minLeft: we want the smallest n elements in the prefix
  // Use a max-heap to keep track of the largest elements
  let maxHeap = new MaxHeap();
  let leftSum = 0;

  for (let i = 0; i < totalLen; i++) {
    // Add current element to heap and sum
    maxHeap.push(nums[i]);
    leftSum += nums[i];

    // If we have more than n elements, remove the largest one
    if (maxHeap.size() > n) {
      const largest = maxHeap.pop();
      leftSum -= largest;
    }

    // Store the minimum sum of n elements up to index i
    if (i >= n - 1) {
      minLeft[i] = leftSum;
    } else {
      minLeft[i] = Infinity;
    }
  }

  // For maxLeft: we want the largest n elements in the prefix
  // Use a min-heap to keep track of the smallest elements
  let minHeap = [];
  leftSum = 0;

  for (let i = 0; i < totalLen; i++) {
    // Add current element to heap and sum
    minHeap.push(nums[i]);
    minHeap.sort((a, b) => a - b); // Keep sorted ascending
    leftSum += nums[i];

    // If we have more than n elements, remove the smallest one
    if (minHeap.length > n) {
      const smallest = minHeap.shift();
      leftSum -= smallest;
    }

    // Store the maximum sum of n elements up to index i
    if (i >= n - 1) {
      maxLeft[i] = leftSum;
    } else {
      maxLeft[i] = -Infinity;
    }
  }

  // Compute minRight and maxRight (traverse from right to left)
  // For minRight: we want the smallest n elements in the suffix
  maxHeap = new MaxHeap();
  let rightSum = 0;

  for (let i = totalLen - 1; i >= 0; i--) {
    // Add current element to heap and sum
    maxHeap.push(nums[i]);
    rightSum += nums[i];

    // If we have more than n elements, remove the largest one
    if (maxHeap.size() > n) {
      const largest = maxHeap.pop();
      rightSum -= largest;
    }

    // Store the minimum sum of n elements from index i to end
    if (i <= totalLen - n) {
      minRight[i] = rightSum;
    } else {
      minRight[i] = Infinity;
    }
  }

  // For maxRight: we want the largest n elements in the suffix
  minHeap = [];
  rightSum = 0;

  for (let i = totalLen - 1; i >= 0; i--) {
    // Add current element to heap and sum
    minHeap.push(nums[i]);
    minHeap.sort((a, b) => a - b); // Keep sorted ascending
    rightSum += nums[i];

    // If we have more than n elements, remove the smallest one
    if (minHeap.length > n) {
      const smallest = minHeap.shift();
      rightSum -= smallest;
    }

    // Store the maximum sum of n elements from index i to end
    if (i <= totalLen - n) {
      maxRight[i] = rightSum;
    } else {
      maxRight[i] = -Infinity;
    }
  }

  // Now find the minimum difference
  // Split point k ranges from n to 2n (inclusive)
  // At split point k: left part is [0..k-1], right part is [k..end]
  let minDiff = Infinity;

  for (let k = n; k <= 2 * n; k++) {
    // k-1 is the last index of left part
    // k is the first index of right part

    // Case 1: Minimize left sum, maximize right sum
    const diff1 = Math.abs(minLeft[k - 1] - maxRight[k]);
    // Case 2: Maximize left sum, minimize right sum
    const diff2 = Math.abs(maxLeft[k - 1] - minRight[k]);

    minDiff = Math.min(minDiff, diff1, diff2);
  }

  return minDiff;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public long minimumDifference(int[] nums) {
        /**
         * Find minimum difference between sums of two groups after removing n elements.
         *
         * Approach:
         * 1. Precompute for each position:
         *    - minLeft[i]: minimum sum of n elements in nums[0..i]
         *    - maxLeft[i]: maximum sum of n elements in nums[0..i]
         *    - minRight[i]: minimum sum of n elements in nums[i..end]
         *    - maxRight[i]: maximum sum of n elements in nums[i..end]
         * 2. For each possible split point k from n to 2n:
         *    - Calculate possible differences using precomputed values
         *    - Track minimum difference
         */
        int n = nums.length / 3;
        int totalLen = 3 * n;

        // Arrays to store precomputed values
        long[] minLeft = new long[totalLen];
        long[] maxLeft = new long[totalLen];
        long[] minRight = new long[totalLen];
        long[] maxRight = new long[totalLen];

        // For minLeft: we want the smallest n elements in the prefix
        // Use a max-heap to keep track of the largest elements
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        long leftSum = 0;

        for (int i = 0; i < totalLen; i++) {
            // Add current element to heap and sum
            maxHeap.offer(nums[i]);
            leftSum += nums[i];

            // If we have more than n elements, remove the largest one
            if (maxHeap.size() > n) {
                int largest = maxHeap.poll();
                leftSum -= largest;
            }

            // Store the minimum sum of n elements up to index i
            if (i >= n - 1) {
                minLeft[i] = leftSum;
            } else {
                minLeft[i] = Long.MAX_VALUE;
            }
        }

        // For maxLeft: we want the largest n elements in the prefix
        // Use a min-heap to keep track of the smallest elements
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        leftSum = 0;

        for (int i = 0; i < totalLen; i++) {
            // Add current element to heap and sum
            minHeap.offer(nums[i]);
            leftSum += nums[i];

            // If we have more than n elements, remove the smallest one
            if (minHeap.size() > n) {
                int smallest = minHeap.poll();
                leftSum -= smallest;
            }

            // Store the maximum sum of n elements up to index i
            if (i >= n - 1) {
                maxLeft[i] = leftSum;
            } else {
                maxLeft[i] = Long.MIN_VALUE;
            }
        }

        // Compute minRight and maxRight (traverse from right to left)
        // For minRight: we want the smallest n elements in the suffix
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        long rightSum = 0;

        for (int i = totalLen - 1; i >= 0; i--) {
            // Add current element to heap and sum
            maxHeap.offer(nums[i]);
            rightSum += nums[i];

            // If we have more than n elements, remove the largest one
            if (maxHeap.size() > n) {
                int largest = maxHeap.poll();
                rightSum -= largest;
            }

            // Store the minimum sum of n elements from index i to end
            if (i <= totalLen - n) {
                minRight[i] = rightSum;
            } else {
                minRight[i] = Long.MAX_VALUE;
            }
        }

        // For maxRight: we want the largest n elements in the suffix
        minHeap = new PriorityQueue<>();
        rightSum = 0;

        for (int i = totalLen - 1; i >= 0; i--) {
            // Add current element to heap and sum
            minHeap.offer(nums[i]);
            rightSum += nums[i];

            // If we have more than n elements, remove the smallest one
            if (minHeap.size() > n) {
                int smallest = minHeap.poll();
                rightSum -= smallest;
            }

            // Store the maximum sum of n elements from index i to end
            if (i <= totalLen - n) {
                maxRight[i] = rightSum;
            } else {
                maxRight[i] = Long.MIN_VALUE;
            }
        }

        // Now find the minimum difference
        // Split point k ranges from n to 2n (inclusive)
        // At split point k: left part is [0..k-1], right part is [k..end]
        long minDiff = Long.MAX_VALUE;

        for (int k = n; k <= 2 * n; k++) {
            // k-1 is the last index of left part
            // k is the first index of right part

            // Case 1: Minimize left sum, maximize right sum
            long diff1 = Math.abs(minLeft[k-1] - maxRight[k]);
            // Case 2: Maximize left sum, minimize right sum
            long diff2 = Math.abs(maxLeft[k-1] - minRight[k]);

            minDiff = Math.min(minDiff, Math.min(diff1, diff2));
        }

        return minDiff;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- We make 4 passes through the array (each of length 3n)
- In each pass, we perform heap operations (push/pop) which take O(log n) time
- Total: O(4 × 3n × log n) = O(n log n)

**Space Complexity:** O(n)

- We store 4 arrays of size 3n: O(12n) = O(n)
- Each heap stores at most n+1 elements: O(n)
- Total: O(n)

## Common Mistakes

1. **Wrong heap type for computing min/max sums:** When computing the minimum sum of n elements, you need a max-heap (to remove large elements), not a min-heap. Candidates often get this backwards because "minimum sum" intuitively suggests a min-heap, but you actually want to keep the smallest elements by removing the largest ones.

2. **Incorrect boundary conditions for split points:** The split point k should range from n to 2n inclusive. If you use n-1 to 2n or n to 2n-1, you'll miss valid configurations. Remember: left part needs at least n elements, right part needs at least n elements.

3. **Forgetting to handle indices where computation isn't possible:** For indices i < n-1, you can't have n elements in the prefix yet, so minLeft[i] and maxLeft[i] should be set to extreme values. Similarly for the suffix.

4. **Integer overflow with large sums:** The sums can be large (up to n × max(nums[i])). Use 64-bit integers (long in Java/JavaScript, Python handles big integers automatically).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix/Suffix Precomputation:** Like in "Product of Array Except Self" (Medium), where you compute prefix and suffix products to avoid division. Here we compute prefix/suffix min/max sums.

2. **Heap for Maintaining Top/Bottom K Elements:** Similar to "Find Subsequence of Length K With the Largest Sum" (Easy), where you use a min-heap to keep track of the largest K elements. Here we use heaps to maintain both smallest and largest K elements.

3. **Split Point Enumeration:** Like in "Find Minimum Cost to Remove Array Elements" (Medium), where you try all possible split points and use precomputed values to evaluate each one efficiently.

## Key Takeaways

1. **When faced with "choose K elements from a sequence" problems, consider using heaps** to efficiently maintain the best K elements as you traverse. A max-heap helps keep the smallest elements (by removing larges), while a min-heap helps keep the largest elements (by removing smalls).

2. **Prefix/suffix precomputation is powerful** when you need to answer queries about different split points. By computing values for all positions upfront, you can evaluate each split point in O(1) time instead of recalculating.

3. **For optimization problems with a natural "split" structure**, enumerate all possible split points and use precomputed values to evaluate each one. This often turns an exponential problem into a polynomial one.

Related problems: [Product of Array Except Self](/problem/product-of-array-except-self), [Find Subsequence of Length K With the Largest Sum](/problem/find-subsequence-of-length-k-with-the-largest-sum), [Find Minimum Cost to Remove Array Elements](/problem/find-minimum-cost-to-remove-array-elements)
