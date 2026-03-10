---
title: "How to Solve Minimize the Maximum Difference of Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize the Maximum Difference of Pairs. Medium difficulty, 50.9% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Greedy, Sorting."
date: "2026-05-29"
category: "dsa-patterns"
tags:
  [
    "minimize-the-maximum-difference-of-pairs",
    "array",
    "binary-search",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Minimize the Maximum Difference of Pairs

You need to select `p` disjoint pairs from an array `nums` to minimize the maximum absolute difference within any pair. The challenge is balancing two constraints: we must pick exactly `p` pairs (no index reuse), and we want the worst pair to be as "good" as possible. This is interesting because it combines greedy pairing with binary search optimization—a pattern common in "minimize maximum" problems.

## Visual Walkthrough

Let's trace through `nums = [10, 1, 2, 7, 1, 3]` with `p = 2`. First, we sort the array: `[1, 1, 2, 3, 7, 10]`.

If we try to pair with a maximum allowed difference of 1:

- Start at index 0: pair (1,1) at indices 0-1 works (difference 0 ≤ 1)
- Move to index 2: pair (2,3) at indices 2-3 works (difference 1 ≤ 1)
  We found 2 pairs! So maybe we can do even better with a smaller maximum difference.

Try maximum difference 0:

- Pair (1,1) at indices 0-1 works (difference 0)
- Move to index 2: (2,3) difference is 1 > 0, skip index 2
- Try index 3: (3,7) difference is 4 > 0, skip
- Try index 4: (7,10) difference is 3 > 0, skip
  We only found 1 pair, not enough for p=2. So the answer must be at least 1.

This shows our approach: we'll binary search for the smallest maximum difference where we can still form at least `p` disjoint pairs.

## Brute Force Approach

A naive approach would try all possible ways to pick `p` pairs from `n` indices. For each selection, compute the maximum difference, then take the minimum across all selections. The number of ways to choose `p` disjoint pairs from `n` elements is:

- Choose 2p indices: C(n, 2p)
- Pair them up: (2p)! / (2^p \* p!)
  This grows factorially with `n` and `p`, making it impractical even for moderate inputs (n=20, p=5 gives millions of combinations).

Even if we sort first and only consider adjacent pairs, we'd still need to check all combinations of `p` adjacent pairs from n-1 possibilities—C(n-1, p) combinations. For n=1000, p=500, this is astronomically large.

## Optimized Approach

The key insight is that **if we can form at least p pairs with maximum difference X, we can also do it with any larger maximum difference**. This monotonic property enables binary search.

**Step-by-step reasoning:**

1. **Sort the array** - The optimal pairing for minimizing differences will always pair adjacent elements after sorting (proven by exchange argument: swapping non-adjacent pairs never improves the maximum difference).
2. **Binary search on the answer** - The minimum possible maximum difference is 0, the maximum is `max(nums) - min(nums)`.
3. **Greedy validation** - For a candidate difference `mid`, can we form at least `p` disjoint pairs where each pair's difference ≤ `mid`? We greedily pair adjacent elements from left to right:
   - If `nums[i+1] - nums[i] ≤ mid`, take this pair and skip to `i+2`
   - Otherwise, skip `i` and try from `i+1`
     This greedy works because taking a valid pair when available never hurts future options.
4. **Binary search termination** - Find the smallest `mid` where validation succeeds.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + n log M) where M = max(nums)-min(nums)
# Space: O(1) for in-place sort, O(n) for timsort
def minimizeMax(nums, p):
    """
    Returns the minimized maximum difference among p disjoint pairs.

    Approach: Binary search on the answer with greedy validation.
    """
    if p == 0:
        return 0

    # Step 1: Sort the array - optimal pairing is between adjacent elements
    nums.sort()
    n = len(nums)

    # Step 2: Binary search for the minimum possible maximum difference
    left, right = 0, nums[-1] - nums[0]

    while left < right:
        mid = (left + right) // 2

        # Step 3: Greedy validation - can we form at least p pairs with max diff ≤ mid?
        count = 0
        i = 0
        while i < n - 1:
            # If this adjacent pair works, take it and skip ahead
            if nums[i + 1] - nums[i] <= mid:
                count += 1
                i += 2  # Skip both elements in the pair
            else:
                i += 1  # Skip only the current element

        # Step 4: Adjust search range based on validation result
        if count >= p:
            right = mid  # Try for smaller maximum difference
        else:
            left = mid + 1  # Need larger maximum difference

    return left
```

```javascript
// Time: O(n log n + n log M) where M = max(nums)-min(nums)
// Space: O(1) for in-place sort, O(log n) for quicksort recursion
function minimizeMax(nums, p) {
  if (p === 0) return 0;

  // Step 1: Sort the array
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // Step 2: Binary search for the answer
  let left = 0;
  let right = nums[n - 1] - nums[0];

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Step 3: Greedy validation
    let count = 0;
    for (let i = 0; i < n - 1; ) {
      if (nums[i + 1] - nums[i] <= mid) {
        count++;
        i += 2; // Take this pair, skip both elements
      } else {
        i++; // Skip current element only
      }
    }

    // Step 4: Adjust search range
    if (count >= p) {
      right = mid; // Can do with mid, try smaller
    } else {
      left = mid + 1; // Need larger difference
    }
  }

  return left;
}
```

```java
// Time: O(n log n + n log M) where M = max(nums)-min(nums)
// Space: O(1) for in-place sort, O(log n) for quicksort recursion
class Solution {
    public int minimizeMax(int[] nums, int p) {
        if (p == 0) return 0;

        // Step 1: Sort the array
        Arrays.sort(nums);
        int n = nums.length;

        // Step 2: Binary search for the minimum maximum difference
        int left = 0;
        int right = nums[n - 1] - nums[0];

        while (left < right) {
            int mid = left + (right - left) / 2;

            // Step 3: Greedy validation
            int count = 0;
            for (int i = 0; i < n - 1; ) {
                // Check if this adjacent pair can be taken
                if (nums[i + 1] - nums[i] <= mid) {
                    count++;
                    i += 2;  // Pair taken, skip both indices
                } else {
                    i++;     // Skip only current index
                }
            }

            // Step 4: Adjust search boundaries
            if (count >= p) {
                right = mid;  // Try for smaller maximum difference
            } else {
                left = mid + 1;  // Need larger maximum difference
            }
        }

        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting: O(n log n)
- Binary search: O(log M) where M = max(nums) - min(nums)
- Each validation: O(n)
- Total: O(n log n + n log M)

In practice, log M ≤ 32 for 32-bit integers, so it's effectively O(n log n).

**Space Complexity:**

- Sorting: O(log n) for recursion stack (quicksort) or O(1) for heapsort
- Rest of algorithm: O(1)
- Total: O(log n) for recursive sort, O(1) for iterative sort

## Common Mistakes

1. **Not sorting first** - Some candidates try to pair without sorting, missing the key insight that optimal pairing requires adjacency in sorted order. Always sort when minimizing differences between pairs.

2. **Wrong greedy validation** - Trying to pair non-adjacent elements or using DP for validation (O(n²) instead of O(n)). The greedy "take if possible, skip if not" works because we're counting pairs, not maximizing sum.

3. **Binary search off-by-one errors** - Using `while (left ≤ right)` instead of `while (left < right)` can cause infinite loops. The shown pattern (`left < right`, `right = mid`, `left = mid + 1`) is standard for "minimum valid value" searches.

4. **Forgetting p=0 edge case** - When p=0, we don't need any pairs, so the maximum difference is 0. Handle this early to avoid unnecessary computation.

## When You'll See This Pattern

This "binary search on answer with greedy validation" pattern appears in many "minimize maximum" or "maximize minimum" problems:

1. **Split Array Largest Sum (LeetCode 410)** - Minimize the largest sum among m subarrays. Binary search on the maximum sum, validate by greedy splitting.

2. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Minimize ship capacity to deliver all packages in D days. Binary search on capacity, validate by greedy loading.

3. **Koko Eating Bananas (LeetCode 875)** - Minimize eating speed to finish bananas in h hours. Binary search on speed, validate by calculating hours needed.

The pattern: when you need to find the minimum X such that some constraint is satisfied, and validation of X is easier than finding X directly, binary search on X is often the solution.

## Key Takeaways

1. **"Minimize maximum" often means binary search** - When you need to minimize the worst case in a partitioning/pairing problem, consider binary searching the answer and validating with a greedy approach.

2. **Sorting enables greedy pairing** - For difference minimization between pairs, sorting transforms the problem into picking adjacent elements, which is much simpler than arbitrary pairing.

3. **Greedy validation is often sufficient** - When counting how many "groups" you can form under a constraint, taking valid groups as early as possible usually works. Prove it by exchange argument: skipping a valid pair never helps.

Related problems: [Minimum Absolute Difference](/problem/minimum-absolute-difference), [Minimum Difference Between Largest and Smallest Value in Three Moves](/problem/minimum-difference-between-largest-and-smallest-value-in-three-moves)
