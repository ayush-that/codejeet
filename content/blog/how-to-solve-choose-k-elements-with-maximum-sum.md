---
title: "How to Solve Choose K Elements With Maximum Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Choose K Elements With Maximum Sum. Medium difficulty, 33.3% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue)."
date: "2029-11-18"
category: "dsa-patterns"
tags: ["choose-k-elements-with-maximum-sum", "array", "sorting", "heap-(priority-queue)", "medium"]
---

# How to Solve "Choose K Elements With Maximum Sum"

This problem asks us to process each index `i` in two arrays `nums1` and `nums2`, find all indices `j` where `nums1[j] < nums1[i]`, and then select at most `k` values from `nums2[j]` to maximize their sum. The tricky part is that we need to do this efficiently for every index `i` — a brute force approach would be far too slow for typical constraints.

What makes this interesting is the combination of sorting, conditional selection, and maintaining a running maximum sum of the top `k` elements. It's essentially a "prefix maximum sum of top k elements" problem with a dynamic sliding window based on sorted values.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums1 = [3, 1, 4, 2]
nums2 = [5, 2, 6, 3]
k = 2
n = 4
```

We need to process each index `i` from 0 to 3:

**Step 1: Pair and sort by nums1 values**
First, let's pair indices with their nums1 and nums2 values:

- Index 0: (3, 5)
- Index 1: (1, 2)
- Index 2: (4, 6)
- Index 3: (2, 3)

Sort these pairs by nums1 value (ascending):

- Index 1: (1, 2)
- Index 3: (2, 3)
- Index 0: (3, 5)
- Index 2: (4, 6)

**Step 2: Process each index in sorted order**
We'll maintain a min-heap (priority queue) that keeps track of the largest `k` nums2 values we've seen so far.

1. **For index 1 (nums1=1):** No indices with nums1[j] < 1, so sum = 0
   - Heap: [2] (add nums2[1]=2)
   - Running sum = 2

2. **For index 3 (nums1=2):** Indices with nums1[j] < 2: only index 1
   - We can choose at most k=2 values from {2}
   - Sum = 2 (just take 2)
   - Heap: [2, 3] (add nums2[3]=3)
   - Running sum = 2 + 3 = 5

3. **For index 0 (nums1=3):** Indices with nums1[j] < 3: indices 1 and 3
   - We have nums2 values {2, 3} in heap
   - Sum = 2 + 3 = 5
   - Heap: currently [2, 3], add nums2[0]=5
   - Since 5 > min(heap)=2, replace 2 with 5
   - Heap becomes [3, 5], running sum = 3 + 5 = 8

4. **For index 2 (nums1=4):** Indices with nums1[j] < 4: indices 1, 3, 0
   - We have nums2 values {3, 5} in heap
   - Sum = 3 + 5 = 8
   - Heap: currently [3, 5], add nums2[2]=6
   - Since 6 > min(heap)=3, replace 3 with 6
   - Heap becomes [5, 6], running sum = 5 + 6 = 11

**Step 3: Map results back to original indices**
We need to return results in original index order:

- Index 0: sum for nums1[0]=3 is 5
- Index 1: sum for nums1[1]=1 is 0
- Index 2: sum for nums1[2]=4 is 8
- Index 3: sum for nums1[3]=2 is 2

Final result: `[5, 0, 8, 2]`

## Brute Force Approach

The brute force solution would be straightforward but inefficient:

1. For each index `i` from 0 to n-1
2. Find all indices `j` where `nums1[j] < nums1[i]`
3. Collect all corresponding `nums2[j]` values
4. Sort them in descending order
5. Take the sum of the first `min(k, count)` values

**Why this is too slow:**

- Step 2 requires O(n) time for each i → O(n²) total
- Step 4 requires sorting up to O(n log n) for each i
- Overall time complexity: O(n² log n)
- For n up to 10⁵ (typical constraints), this would be far too slow (10¹⁰ operations)

Even with some optimizations, the O(n²) nature makes this approach infeasible for large inputs.

## Optimized Approach

The key insight is that we can process indices in **sorted order by nums1 values**. When we process indices in ascending order of nums1, all previously processed indices automatically satisfy `nums1[j] < nums1[i]` for the current index `i`.

**Step-by-step reasoning:**

1. **Pair and sort:** Create pairs of (nums1[i], nums2[i], index) and sort by nums1 value
2. **Process in sorted order:** As we iterate through sorted pairs, all previous indices have smaller nums1 values
3. **Maintain top k nums2 values:** Use a min-heap to keep track of the largest k nums2 values seen so far
4. **Efficient updates:** When adding a new nums2 value:
   - If heap has fewer than k elements, just add it
   - If heap has k elements and new value > smallest in heap, replace the smallest
   - Update running sum accordingly
5. **Store results:** Map the computed sum back to the original index
6. **Return in original order:** Reorder results to match input order

**Why a min-heap works:**

- We need quick access to the smallest element among our top k (to potentially replace it)
- Adding/removing from a min-heap is O(log k)
- We maintain the sum incrementally to avoid recalculating from scratch each time

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n log k) for heap operations = O(n log n)
# Space: O(n) for storing pairs and results, O(k) for heap = O(n)
def maxSum(nums1, nums2, k):
    n = len(nums1)

    # Step 1: Create pairs of (nums1[i], nums2[i], original_index)
    # We need original index to map results back later
    pairs = [(nums1[i], nums2[i], i) for i in range(n)]

    # Step 2: Sort pairs by nums1 value (ascending)
    # This ensures when we process index i, all previous indices have smaller nums1 values
    pairs.sort(key=lambda x: x[0])

    # Step 3: Initialize min-heap and running sum
    import heapq
    min_heap = []  # Will store at most k largest nums2 values seen so far
    current_sum = 0  # Sum of elements in min_heap
    result = [0] * n  # To store results for each index

    # Step 4: Process each pair in sorted order
    for num1_val, num2_val, original_idx in pairs:
        # At this point, all previously processed indices have nums1 < current num1_val
        # So the heap contains nums2 values from indices with smaller nums1

        # Store the result for current original index
        # This is the sum of at most k largest nums2 values from indices with smaller nums1
        result[original_idx] = current_sum

        # Step 5: Update heap with current num2_val
        if len(min_heap) < k:
            # Heap not full yet, just add the value
            heapq.heappush(min_heap, num2_val)
            current_sum += num2_val
        else:
            # Heap is full (has k elements)
            # Only add current value if it's larger than the smallest in heap
            if num2_val > min_heap[0]:
                # Remove smallest element from heap
                smallest = heapq.heappop(min_heap)
                current_sum -= smallest

                # Add current value to heap
                heapq.heappush(min_heap, num2_val)
                current_sum += num2_val
            # If current value <= smallest in heap, ignore it
            # (it wouldn't improve our top k sum)

    return result
```

```javascript
// Time: O(n log n) for sorting + O(n log k) for heap operations = O(n log n)
// Space: O(n) for storing pairs and results, O(k) for heap = O(n)
function maxSum(nums1, nums2, k) {
  const n = nums1.length;

  // Step 1: Create array of objects with original data and index
  const pairs = [];
  for (let i = 0; i < n; i++) {
    pairs.push({
      num1: nums1[i],
      num2: nums2[i],
      idx: i,
    });
  }

  // Step 2: Sort pairs by nums1 value (ascending)
  pairs.sort((a, b) => a.num1 - b.num1);

  // Step 3: Initialize min-heap and running sum
  // JavaScript doesn't have built-in heap, so we'll use array and maintain heap property
  const minHeap = [];
  let currentSum = 0;
  const result = new Array(n).fill(0);

  // Helper function to add to min-heap
  function heapPush(val) {
    minHeap.push(val);
    let i = minHeap.length - 1;

    // Bubble up
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (minHeap[parent] <= minHeap[i]) break;
      [minHeap[parent], minHeap[i]] = [minHeap[i], minHeap[parent]];
      i = parent;
    }
  }

  // Helper function to remove smallest from min-heap
  function heapPop() {
    if (minHeap.length === 0) return null;

    const smallest = minHeap[0];
    const last = minHeap.pop();

    if (minHeap.length > 0) {
      minHeap[0] = last;

      // Heapify down
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallestIdx = i;

        if (left < minHeap.length && minHeap[left] < minHeap[smallestIdx]) {
          smallestIdx = left;
        }
        if (right < minHeap.length && minHeap[right] < minHeap[smallestIdx]) {
          smallestIdx = right;
        }

        if (smallestIdx === i) break;

        [minHeap[i], minHeap[smallestIdx]] = [minHeap[smallestIdx], minHeap[i]];
        i = smallestIdx;
      }
    }

    return smallest;
  }

  // Step 4: Process each pair in sorted order
  for (const pair of pairs) {
    const { num1, num2, idx } = pair;

    // Store result for current original index
    result[idx] = currentSum;

    // Step 5: Update heap with current num2 value
    if (minHeap.length < k) {
      // Heap not full yet
      heapPush(num2);
      currentSum += num2;
    } else {
      // Heap is full (has k elements)
      if (minHeap.length > 0 && num2 > minHeap[0]) {
        // Remove smallest element from heap
        const smallest = heapPop();
        currentSum -= smallest;

        // Add current value to heap
        heapPush(num2);
        currentSum += num2;
      }
      // If current value <= smallest in heap, ignore it
    }
  }

  return result;
}
```

```java
// Time: O(n log n) for sorting + O(n log k) for heap operations = O(n log n)
// Space: O(n) for storing pairs and results, O(k) for heap = O(n)
import java.util.*;

class Solution {
    public long[] maxSum(int[] nums1, int[] nums2, int k) {
        int n = nums1.length;

        // Step 1: Create array of indices and sort by nums1 values
        Integer[] indices = new Integer[n];
        for (int i = 0; i < n; i++) {
            indices[i] = i;
        }

        // Sort indices based on corresponding nums1 values
        Arrays.sort(indices, (a, b) -> Integer.compare(nums1[a], nums1[b]));

        // Step 2: Initialize min-heap and running sum
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        long currentSum = 0;
        long[] result = new long[n];

        // Step 3: Process indices in sorted order
        for (int idx : indices) {
            // Store result for current original index
            result[idx] = currentSum;

            // Step 4: Update heap with current nums2 value
            if (minHeap.size() < k) {
                // Heap not full yet
                minHeap.offer(nums2[idx]);
                currentSum += nums2[idx];
            } else {
                // Heap is full (has k elements)
                if (!minHeap.isEmpty() && nums2[idx] > minHeap.peek()) {
                    // Remove smallest element from heap
                    int smallest = minHeap.poll();
                    currentSum -= smallest;

                    // Add current value to heap
                    minHeap.offer(nums2[idx]);
                    currentSum += nums2[idx];
                }
                // If current value <= smallest in heap, ignore it
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the pairs by nums1 values: O(n log n)
- Processing n elements with heap operations: O(n log k)
- Since k ≤ n, O(n log k) ≤ O(n log n)
- Dominant term is O(n log n)

**Space Complexity: O(n)**

- Storing pairs with original indices: O(n)
- Result array: O(n)
- Min-heap: O(k) where k ≤ n
- Total: O(n)

The sorting step is the bottleneck, but O(n log n) is efficient enough for typical constraints (n ≤ 10⁵).

## Common Mistakes

1. **Forgetting to store original indices:** If you sort without tracking original positions, you won't be able to map results back correctly. Always store the original index alongside the values when sorting.

2. **Using max-heap instead of min-heap:** A max-heap would give you quick access to the largest element, but we need quick access to the smallest element among our top k. The min-heap lets us efficiently replace the smallest element when we find a better one.

3. **Not handling k=0 or k > n edge cases:**
   - When k=0, the sum should always be 0
   - When k > n, we can take all available elements
   - Our solution handles these naturally: when k=0, the heap remains empty; when k > n, we just add all elements without replacement.

4. **Recalculating sum from heap each time:** This would be O(k) per iteration, making total time O(nk). Instead, maintain a running sum and update it incrementally when adding/removing from the heap.

## When You'll See This Pattern

This "sorted processing + top k elements in heap" pattern appears in several LeetCode problems:

1. **Maximum Subsequence Score (LeetCode 2542):** Very similar structure - pair two arrays, sort by one, maintain top k of the other with a heap.

2. **IPO (LeetCode 502):** Sort projects by capital, use heap to track most profitable projects you can afford.

3. **Meeting Rooms III (LeetCode 2402):** Sort meetings by start time, use heap to track when rooms become available.

The common theme is: when you need to process elements in some order and maintain the "best" k elements seen so far, consider sorting plus a heap.

## Key Takeaways

1. **Sort to transform conditional checks:** When you need to find elements satisfying `condition(i, j)`, sorting by one of the parameters can often make the condition trivial (like `nums1[j] < nums1[i]` becomes `j processed before i`).

2. **Min-heap for top k maintenance:** When you need to keep the largest k elements and efficiently update them, a min-heap gives O(log k) access to the smallest element, making replacements efficient.

3. **Incremental computation:** Maintain running sums or other aggregates instead of recalculating from scratch each time. This often turns O(k) operations into O(1).

[Practice this problem on CodeJeet](/problem/choose-k-elements-with-maximum-sum)
