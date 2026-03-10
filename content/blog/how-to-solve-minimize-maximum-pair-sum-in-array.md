---
title: "How to Solve Minimize Maximum Pair Sum in Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize Maximum Pair Sum in Array. Medium difficulty, 83.3% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2027-11-11"
category: "dsa-patterns"
tags: ["minimize-maximum-pair-sum-in-array", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Minimize Maximum Pair Sum in Array

You're given an array `nums` of even length `n`. You need to pair up all elements into `n/2` pairs, then minimize the **maximum pair sum** among all pairs. The challenge is that you can't just pair any elements arbitrarily—you must use each element exactly once. This problem is interesting because it combines sorting with a clever pairing strategy to balance the loads, similar to how you'd pair people for a two-person task where you want to minimize the worst-case workload.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 5, 2, 3]`

**Step 1: Sort the array**  
Sorted: `[2, 3, 3, 5]`

**Step 2: Pair smallest with largest**

- Pair 1: `2` (smallest) + `5` (largest) = `7`
- Pair 2: `3` (next smallest) + `3` (next largest) = `6`

**Step 3: Find maximum pair sum**  
Maximum of `(7, 6)` = `7`

Why does this work? By pairing the smallest with the largest, we prevent large numbers from being paired together (which would create huge sums) while also preventing small numbers from being wasted together (which doesn't help reduce the maximum). Let's see what happens with a bad pairing:

If we paired sequentially: `(2,3)=5` and `(3,5)=8` → maximum = `8` (worse than `7`)  
If we paired large with large: `(5,3)=8` and `(3,2)=5` → maximum = `8` (also worse)

The optimal strategy emerges: after sorting, pair `nums[i]` with `nums[n-1-i]` for all `i` from `0` to `n/2-1`.

## Brute Force Approach

A naive approach would try all possible pairings. For an array of length `n`, we could:

1. Generate all permutations of the array
2. Group each permutation into consecutive pairs
3. Calculate the maximum pair sum for each grouping
4. Track the minimum of these maximums

However, this is extremely inefficient. The number of permutations is `n!`, and even with optimizations, the complexity is factorial. For `n=10`, that's 3.6 million possibilities; for `n=20`, it's 2.4×10¹⁸—completely infeasible.

What makes the brute force insufficient is that it doesn't leverage the mathematical insight about optimal pairing. It treats the problem as a combinatorial search when it's actually a greedy optimization problem.

## Optimized Approach

The key insight is that to minimize the maximum pair sum, we should **balance each pair** as much as possible. If we pair two large numbers together, their sum will be huge. If we pair two small numbers together, we waste the opportunity to "cancel out" a large number with a small one.

**Step-by-step reasoning:**

1. **Sort the array** in ascending order
2. **Pair the smallest with the largest**: After sorting, `nums[0]` is smallest, `nums[n-1]` is largest
3. **Move inward**: Pair `nums[1]` with `nums[n-2]`, then `nums[2]` with `nums[n-3]`, and so on
4. **Track the maximum** of these pair sums

**Why this greedy approach works:**

- After sorting, any element at position `i` is ≤ any element at position `j` where `i < j`
- If we didn't pair the largest element with the smallest, it would have to pair with something larger or equal, creating a larger sum
- This is provably optimal: for any other pairing, we can find at least one pair with sum ≥ our maximum

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def minPairSum(nums):
    """
    Minimizes the maximum pair sum by pairing smallest with largest.

    Args:
        nums: List[int] - array of even length

    Returns:
        int - minimized maximum pair sum
    """
    # Step 1: Sort the array in ascending order
    # This allows us to easily pair smallest with largest
    nums.sort()

    n = len(nums)
    max_pair_sum = 0

    # Step 2: Pair the i-th smallest with i-th largest
    # We only need to iterate through first half since we're pairing
    for i in range(n // 2):
        # Pair current smallest (nums[i]) with current largest (nums[n-1-i])
        current_pair_sum = nums[i] + nums[n - 1 - i]

        # Step 3: Track the maximum of all pair sums
        # This is what we're trying to minimize
        max_pair_sum = max(max_pair_sum, current_pair_sum)

    return max_pair_sum
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function minPairSum(nums) {
  /**
   * Minimizes the maximum pair sum by pairing smallest with largest.
   *
   * @param {number[]} nums - array of even length
   * @return {number} - minimized maximum pair sum
   */
  // Step 1: Sort the array in ascending order
  // JavaScript's sort() sorts lexicographically by default, so we need compare function
  nums.sort((a, b) => a - b);

  const n = nums.length;
  let maxPairSum = 0;

  // Step 2: Pair the i-th smallest with i-th largest
  // We only need to iterate through first half since we're pairing
  for (let i = 0; i < n / 2; i++) {
    // Pair current smallest (nums[i]) with current largest (nums[n-1-i])
    const currentPairSum = nums[i] + nums[n - 1 - i];

    // Step 3: Track the maximum of all pair sums
    // This is what we're trying to minimize
    maxPairSum = Math.max(maxPairSum, currentPairSum);
  }

  return maxPairSum;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    public int minPairSum(int[] nums) {
        /**
         * Minimizes the maximum pair sum by pairing smallest with largest.
         *
         * @param nums - array of even length
         * @return minimized maximum pair sum
         */
        // Step 1: Sort the array in ascending order
        // Arrays.sort() uses Dual-Pivot Quicksort for primitives
        Arrays.sort(nums);

        int n = nums.length;
        int maxPairSum = 0;

        // Step 2: Pair the i-th smallest with i-th largest
        // We only need to iterate through first half since we're pairing
        for (int i = 0; i < n / 2; i++) {
            // Pair current smallest (nums[i]) with current largest (nums[n-1-i])
            int currentPairSum = nums[i] + nums[n - 1 - i];

            // Step 3: Track the maximum of all pair sums
            // This is what we're trying to minimize
            maxPairSum = Math.max(maxPairSum, currentPairSum);
        }

        return maxPairSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting dominates: O(n log n) for comparison-based sorts
- The pairing loop is O(n/2) = O(n)
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity: O(1) or O(n)**

- If sort is in-place (like Python's Timsort, Java's Arrays.sort for primitives): O(1) or O(log n) for recursion stack
- If sort requires extra space (like merge sort): O(n)
- Our algorithm uses only O(1) extra space beyond sorting

## Common Mistakes

1. **Forgetting to sort**: Some candidates try to pair elements without sorting first, which doesn't guarantee optimal pairing. The sorting step is crucial for the greedy strategy to work.

2. **Incorrect pairing after sorting**: Pairing adjacent elements after sorting (nums[0] with nums[1], nums[2] with nums[3], etc.) gives suboptimal results. You must pair from both ends inward.

3. **Off-by-one errors in the loop**: Using `i < n` instead of `i < n // 2` will cause index out of bounds or incorrect pairing. Remember you're creating n/2 pairs, not n pairs.

4. **Not handling large numbers correctly**: The maximum pair sum can be up to 2×10⁵ (if nums[i] ≤ 10⁵), so use appropriate data types (int is fine in all languages for this range).

## When You'll See This Pattern

This "pair from ends" pattern appears in several optimization problems:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Similar two-pointer approach from both ends to find a target sum.

2. **Boats to Save People (LeetCode 881)**: Minimize number of boats by pairing heaviest with lightest when possible—exact same greedy pairing strategy.

3. **Assign Cookies (LeetCode 455)**: Greedy matching of smallest cookies to smallest greed factors.

4. **Array Partition I (LeetCode 561)**: Maximize sum of min(a,b) pairs by sorting and pairing adjacent elements (different pairing strategy but same sorting insight).

The core pattern is: **When you need to optimize pairings and the operation is symmetric (a+b), sorting often reveals the optimal structure.**

## Key Takeaways

1. **Sorting transforms pairing problems**: Many array pairing problems become tractable after sorting, as it reveals structural relationships between elements.

2. **Greedy pairing from ends**: When minimizing maximum pair sum, pairing smallest with largest is optimal. This balances each pair and prevents large+large combinations.

3. **Prove greedy correctness**: For interview discussions, be prepared to explain why this pairing is optimal—either through contradiction ("if we didn't pair this way, we'd get a worse result") or by showing it's the only way to avoid large sums.

[Practice this problem on CodeJeet](/problem/minimize-maximum-pair-sum-in-array)
