---
title: "How to Solve Minimum Adjacent Swaps for K Consecutive Ones — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Adjacent Swaps for K Consecutive Ones. Hard difficulty, 42.3% acceptance rate. Topics: Array, Greedy, Sliding Window, Prefix Sum."
date: "2026-02-19"
category: "dsa-patterns"
tags: ["minimum-adjacent-swaps-for-k-consecutive-ones", "array", "greedy", "sliding-window", "hard"]
---

# How to Solve Minimum Adjacent Swaps for K Consecutive Ones

This problem asks us to find the minimum number of adjacent swaps needed to group exactly `k` consecutive 1's together in a binary array. What makes this problem tricky is that we're not just grouping all 1's together (which would be simpler), but we need to find the optimal position to place exactly `k` consecutive 1's while minimizing adjacent swaps. The key insight is that this becomes a median optimization problem when we think about bringing 1's together.

## Visual Walkthrough

Let's trace through an example: `nums = [1,0,0,1,0,1,0,1]`, `k = 3`

First, we need to identify where the 1's are located:

- Index 0: 1
- Index 3: 1
- Index 5: 1
- Index 7: 1

We have 4 ones total, but we only need to group 3 of them together. We need to choose which 3 ones to group and where to place them.

**Option 1: Group indices [0, 3, 5]**
If we want these three 1's to be consecutive, where should they go? The optimal position is around the median index. The median of [0, 3, 5] is 3. So we'd want the group centered around index 3:

- Index 3 stays at position 3
- Index 0 needs to move to position 2 (1 swap)
- Index 5 needs to move to position 4 (1 swap)
  Total: 2 swaps

**Option 2: Group indices [3, 5, 7]**
Median is 5. Group centered around index 5:

- Index 5 stays at position 5
- Index 3 needs to move to position 4 (1 swap)
- Index 7 needs to move to position 6 (1 swap)
  Total: 2 swaps

**Option 3: Group indices [0, 3, 7]**
Median is 3. Group centered around index 3:

- Index 3 stays at position 3
- Index 0 needs to move to position 2 (1 swap)
- Index 7 needs to move to position 4 (3 swaps)
  Total: 4 swaps

**Option 4: Group indices [0, 5, 7]**
Median is 5. Group centered around index 5:

- Index 5 stays at position 5
- Index 0 needs to move to position 4 (4 swaps)
- Index 7 needs to move to position 6 (1 swap)
  Total: 5 swaps

The minimum is 2 swaps. This shows us the pattern: for any k consecutive 1's we choose, the optimal placement is centered around the median, and the cost can be calculated efficiently using prefix sums.

## Brute Force Approach

A naive approach would be to:

1. Find all positions of 1's in the array
2. Consider every possible subsequence of k consecutive 1's from these positions
3. For each subsequence, calculate the minimum swaps needed to bring them together
4. Return the minimum among all these

The calculation for step 3 would involve trying to place the group at every possible position in the array and calculating the swap cost, which is O(n) per position.

This brute force approach would be O(m × n × k) where m is the number of 1's in the array. Since m can be up to n, this becomes O(n³) in the worst case, which is far too slow for typical constraints (n up to 10⁵).

Even a slightly better brute force that recognizes the median property would still be O(m × k) = O(n²), which is still too slow.

## Optimized Approach

The key insight is that when we select k consecutive 1's from the list of 1 positions, the optimal placement is to center them around the median position. This is because the sum of distances to the median is minimized.

Let's say we have k 1's at positions `p[i], p[i+1], ..., p[i+k-1]`. If we want to place them consecutively starting at some position `x`, the total moves would be:

```
sum(|p[i+j] - (x + j)| for j in 0..k-1)
```

But if we center them around the median `m = p[i + k//2]`, we want them at positions `[m - k//2, m - k//2 + 1, ..., m + (k-1)//2]`.

The total cost becomes:

```
sum(|p[i+j] - (m - k//2 + j)| for j in 0..k-1)
```

We can simplify this using prefix sums. Notice that:

- For the left half (indices < median), each element needs to move to consecutive positions left of the median
- For the right half (indices > median), each element needs to move to consecutive positions right of the median

The formula simplifies to:

```
left_cost = (median_index * median_value) - sum_of_left_positions - (k//2 * (k//2 + 1))//2
right_cost = sum_of_right_positions - (median_index * median_value) - ((k-1)//2 * ((k-1)//2 + 1))//2
total_cost = left_cost + right_cost
```

Where `median_index = k//2` (the index within the window, not the position value).

We can compute sums efficiently using prefix sums, giving us an O(n) solution.

## Optimal Solution

The algorithm works as follows:

1. Collect all indices where `nums[i] == 1` into an array `pos`
2. Compute prefix sums of `pos` to quickly calculate sums of any contiguous subsequence
3. Slide a window of size `k` over the `pos` array
4. For each window, calculate the cost using the median formula with prefix sums
5. Track the minimum cost across all windows

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minMoves(nums, k):
    """
    Calculate minimum adjacent swaps to get k consecutive 1's.

    Args:
        nums: List[int] - Binary array containing 0's and 1's
        k: int - Number of consecutive 1's needed

    Returns:
        int - Minimum number of adjacent swaps required
    """
    # Step 1: Collect positions of all 1's
    pos = []
    for i, num in enumerate(nums):
        if num == 1:
            pos.append(i)

    n = len(pos)
    if n < k:
        return 0  # Not enough 1's to form k consecutive ones

    # Step 2: Compute prefix sums for efficient range sum queries
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + pos[i]

    # Step 3: Initialize answer with a large value
    result = float('inf')

    # Step 4: Slide window of size k over the positions array
    for i in range(n - k + 1):
        # i is the start index of the window in pos array
        # j is the end index of the window
        j = i + k - 1

        # Find median index within the window
        # For k elements, median is at index i + k//2
        median_idx = i + k // 2
        median_val = pos[median_idx]

        # Calculate left cost: elements to the left of median
        left_count = median_idx - i
        # Sum of positions from i to median_idx-1
        left_sum = prefix[median_idx] - prefix[i]
        # Expected sum if these elements were placed consecutively left of median
        # Formula: left_count * median_val - left_sum - (left_count * (left_count + 1)) // 2
        left_cost = median_val * left_count - left_sum - (left_count * (left_count + 1)) // 2

        # Calculate right cost: elements to the right of median
        right_count = j - median_idx
        # Sum of positions from median_idx+1 to j
        right_sum = prefix[j + 1] - prefix[median_idx + 1]
        # Expected sum if these elements were placed consecutively right of median
        # Formula: right_sum - right_count * median_val - (right_count * (right_count + 1)) // 2
        right_cost = right_sum - median_val * right_count - (right_count * (right_count + 1)) // 2

        # Total cost for this window
        total_cost = left_cost + right_cost
        result = min(result, total_cost)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Calculate minimum adjacent swaps to get k consecutive 1's.
 *
 * @param {number[]} nums - Binary array containing 0's and 1's
 * @param {number} k - Number of consecutive 1's needed
 * @return {number} - Minimum number of adjacent swaps required
 */
function minMoves(nums, k) {
  // Step 1: Collect positions of all 1's
  const pos = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      pos.push(i);
    }
  }

  const n = pos.length;
  if (n < k) {
    return 0; // Not enough 1's to form k consecutive ones
  }

  // Step 2: Compute prefix sums for efficient range sum queries
  // prefix[i] = sum of first i elements (prefix[0] = 0)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + pos[i];
  }

  // Step 3: Initialize answer with a large value
  let result = Infinity;

  // Step 4: Slide window of size k over the positions array
  for (let i = 0; i <= n - k; i++) {
    // i is the start index of the window in pos array
    // j is the end index of the window
    const j = i + k - 1;

    // Find median index within the window
    // For k elements, median is at index i + Math.floor(k / 2)
    const medianIdx = i + Math.floor(k / 2);
    const medianVal = pos[medianIdx];

    // Calculate left cost: elements to the left of median
    const leftCount = medianIdx - i;
    // Sum of positions from i to medianIdx-1
    const leftSum = prefix[medianIdx] - prefix[i];
    // Expected sum if these elements were placed consecutively left of median
    // Formula: leftCount * medianVal - leftSum - (leftCount * (leftCount + 1)) / 2
    const leftCost = medianVal * leftCount - leftSum - (leftCount * (leftCount + 1)) / 2;

    // Calculate right cost: elements to the right of median
    const rightCount = j - medianIdx;
    // Sum of positions from medianIdx+1 to j
    const rightSum = prefix[j + 1] - prefix[medianIdx + 1];
    // Expected sum if these elements were placed consecutively right of median
    // Formula: rightSum - rightCount * medianVal - (rightCount * (rightCount + 1)) / 2
    const rightCost = rightSum - medianVal * rightCount - (rightCount * (rightCount + 1)) / 2;

    // Total cost for this window
    const totalCost = leftCost + rightCost;
    result = Math.min(result, totalCost);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    /**
     * Calculate minimum adjacent swaps to get k consecutive 1's.
     *
     * @param nums Binary array containing 0's and 1's
     * @param k Number of consecutive 1's needed
     * @return Minimum number of adjacent swaps required
     */
    public int minMoves(int[] nums, int k) {
        // Step 1: Collect positions of all 1's
        List<Integer> pos = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 1) {
                pos.add(i);
            }
        }

        int n = pos.size();
        if (n < k) {
            return 0;  // Not enough 1's to form k consecutive ones
        }

        // Step 2: Compute prefix sums for efficient range sum queries
        // prefix[i] = sum of first i elements (prefix[0] = 0)
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + pos.get(i);
        }

        // Step 3: Initialize answer with a large value
        long result = Long.MAX_VALUE;

        // Step 4: Slide window of size k over the positions array
        for (int i = 0; i <= n - k; i++) {
            // i is the start index of the window in pos array
            // j is the end index of the window
            int j = i + k - 1;

            // Find median index within the window
            // For k elements, median is at index i + k / 2
            int medianIdx = i + k / 2;
            long medianVal = pos.get(medianIdx);

            // Calculate left cost: elements to the left of median
            int leftCount = medianIdx - i;
            // Sum of positions from i to medianIdx-1
            long leftSum = prefix[medianIdx] - prefix[i];
            // Expected sum if these elements were placed consecutively left of median
            // Formula: leftCount * medianVal - leftSum - (leftCount * (leftCount + 1)) / 2
            long leftCost = medianVal * leftCount - leftSum - (long) leftCount * (leftCount + 1) / 2;

            // Calculate right cost: elements to the right of median
            int rightCount = j - medianIdx;
            // Sum of positions from medianIdx+1 to j
            long rightSum = prefix[j + 1] - prefix[medianIdx + 1];
            // Expected sum if these elements were placed consecutively right of median
            // Formula: rightSum - rightCount * medianVal - (rightCount * (rightCount + 1)) / 2
            long rightCost = rightSum - medianVal * rightCount - (long) rightCount * (rightCount + 1) / 2;

            // Total cost for this window
            long totalCost = leftCost + rightCost;
            result = Math.min(result, totalCost);
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to collect positions of 1's: O(n)
- We compute prefix sums in O(m) where m is the number of 1's (m ≤ n)
- We slide a window over m positions, performing O(1) operations per window: O(m)
- Overall: O(n) since all operations are linear in the input size

**Space Complexity: O(n)**

- We store positions of all 1's: O(m) where m ≤ n
- We store prefix sums: O(m+1) where m ≤ n
- Overall: O(n) in the worst case when all elements are 1's

## Common Mistakes

1. **Forgetting that swaps are only adjacent**: Some candidates try to calculate direct distances between positions, forgetting that you can only swap adjacent elements. The formula `|pos[i] - target|` correctly accounts for this because each adjacent swap reduces distance by 1.

2. **Not handling the case when there are fewer than k 1's**: The problem doesn't explicitly state what to return in this case, but logically if there aren't enough 1's, you can't form k consecutive ones. Return 0 or handle it appropriately.

3. **Incorrect median calculation for even k**: When k is even, there are two middle elements. The optimal placement is centered around either of them, but our formula using `k//2` as the median index works correctly because it consistently picks one of the two middle elements.

4. **Integer overflow in prefix sums**: The positions can be up to 10⁵ and we're summing them, so use 64-bit integers (long in Java/C++, long long in C) to avoid overflow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Median optimization**: When you need to minimize the sum of distances to a point, the median is optimal. This appears in problems like "Minimum Moves to Equal Array Elements II" (LeetCode 462).

2. **Sliding window with prefix sums**: When you need to efficiently calculate sums of contiguous subsequences, prefix sums with sliding window is a common pattern. See "Subarray Sum Equals K" (LeetCode 560).

3. **Grouping elements with swaps**: Similar to "Minimum Swaps to Group All 1's Together" (LeetCode 1151), but here we only need to group k of them, not all.

## Key Takeaways

1. **When minimizing total distance, think median**: If you need to bring elements together and want to minimize total movement, placing the group around the median is usually optimal.

2. **Prefix sums enable O(1) range sum queries**: When you need to repeatedly calculate sums of contiguous subsequences, precompute prefix sums to answer each query in O(1) time.

3. **Convert swap problems to distance problems**: Adjacent swaps to move an element from position A to position B require exactly |A-B| swaps. This simplification is key to solving many swap-based problems efficiently.

Related problems: [Minimum Swaps to Group All 1's Together](/problem/minimum-swaps-to-group-all-1s-together), [Minimum Number of Operations to Make Array Continuous](/problem/minimum-number-of-operations-to-make-array-continuous), [Minimum Adjacent Swaps to Make a Valid Array](/problem/minimum-adjacent-swaps-to-make-a-valid-array)
