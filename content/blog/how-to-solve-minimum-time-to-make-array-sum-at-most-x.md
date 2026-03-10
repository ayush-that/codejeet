---
title: "How to Solve Minimum Time to Make Array Sum At Most x — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Time to Make Array Sum At Most x. Hard difficulty, 27.1% acceptance rate. Topics: Array, Dynamic Programming, Sorting."
date: "2026-08-09"
category: "dsa-patterns"
tags:
  ["minimum-time-to-make-array-sum-at-most-x", "array", "dynamic-programming", "sorting", "hard"]
---

# How to Solve Minimum Time to Make Array Sum At Most x

This problem presents a unique optimization challenge: you have two arrays where one grows over time, and you can selectively reduce values. The tricky part is that the growth happens **before** you can act each second, meaning your reduction decisions must account for future growth. This creates a complex trade-off between reducing large values now versus letting them grow and reducing them later when they're even larger.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Example:**  
`nums1 = [1, 2, 3]`  
`nums2 = [1, 1, 1]`  
`x = 10`

**Initial state:**  
Total sum = 1 + 2 + 3 = 6 (already less than x=10, so answer could be 0)

But let's say x=5 instead, so we need to reduce the sum.

**Second 0 (before any operations):**  
Sum = 6 > 5, so we need to act.

**Option 1:** Reduce the largest nums1[i] (value 3 at index 2)  
After reduction: nums1 becomes [1, 2, 0], sum = 3 ≤ 5 ✓  
But wait — we haven't accounted for growth yet!

**Correct timeline each second:**

1. **Growth phase:** All nums1[i] increase by nums2[i]
2. **Reduction phase:** Choose one index to set to 0

Let's simulate properly:

**Second 1:**

- Growth: nums1 becomes [2, 3, 4] (each +1)
- Sum = 2 + 3 + 4 = 9
- Reduction: Choose index 2 (value 4) → set to 0
- nums1 becomes [2, 3, 0], sum = 5

We reached sum ≤ 5 in 1 second.

But what if we chose differently? If we reduced index 1 (value 3) instead:

- nums1 becomes [2, 0, 4], sum = 6 > 5 ❌

This shows the importance of choosing which index to reduce. The key insight: we should prioritize indices with **large nums2[i]** because they grow faster and will become expensive if left unreduced.

## Brute Force Approach

A naive approach would try all possible sequences of reductions. At each of t seconds, we have n choices (which index to reduce), leading to n^t possibilities. Even for moderate n and t, this explodes exponentially.

We could try a greedy approach: always reduce the largest current nums1[i]. But this fails because it ignores growth rates. Consider:

- nums1 = [5, 3], nums2 = [1, 100], x = 10
- Greedy reduces index 0 first (value 5)
- But index 1 grows so fast (by 100 each second) that we should reduce it immediately

The brute force search is O(n^t), which is infeasible for constraints where n can be up to 1000 and t up to 1000.

## Optimized Approach

The key insight comes from reframing the problem mathematically. Let's define:

- Let `t` be the total number of seconds we operate
- Let `S1` = sum(nums1), `S2` = sum(nums2)
- After t seconds of growth (with no reductions), total sum would be:  
  `S1 + t * S2`

But when we reduce an index i at time `t_i` (1 ≤ t_i ≤ t), we prevent its future growth from time t_i onward. The value we "save" by reducing index i at time t_i is:

- Its initial value: nums1[i]
- Its growth up to reduction time: nums2[i] \* t_i

So total reduction from all operations = Σ(nums1[i] + nums2[i] \* t_i) for reduced indices i.

Our goal: find minimum t such that:

```
S1 + t * S2 - Σ(nums1[i] + nums2[i] * t_i) ≤ x
```

for some set of indices reduced at times t_i.

Rearranging:

```
Σ(nums1[i] + nums2[i] * t_i) ≥ S1 + t * S2 - x
```

We want to maximize the left side (total reduction) with at most t reductions. This becomes:  
"Given t operations, what's the maximum reduction we can achieve?"

Now the optimization: We should reduce indices with **larger nums2[i] later** because their reduction value (nums2[i] \* t_i) increases with later t_i. So we sort by nums2[i] and use dynamic programming.

## Optimal Solution

We use DP where dp[j] = maximum reduction using j operations. We iterate through indices sorted by nums2[i], and for each index, we consider using it as one of our reductions.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def minimumTime(nums1, nums2, x):
    n = len(nums1)

    # Pair nums1[i] with nums2[i] and sort by nums2[i]
    pairs = list(zip(nums1, nums2))
    pairs.sort(key=lambda x: x[1])  # Sort by nums2[i]

    # dp[j] = maximum reduction value using j operations
    dp = [0] * (n + 1)

    # Iterate through each index
    for i in range(n):
        a, b = pairs[i]  # a = nums1[i], b = nums2[i]

        # Update dp backwards to avoid reusing the same index
        for j in range(i + 1, 0, -1):
            # Option 1: Use this index as the j-th operation
            # Reduction value = a + b * j (since we use it at time j)
            use_current = dp[j - 1] + a + b * j

            # Option 2: Don't use this index
            not_use_current = dp[j]

            # Take the maximum
            dp[j] = max(use_current, not_use_current)

    # Calculate total sums
    S1 = sum(nums1)
    S2 = sum(nums2)

    # Check for each t if we can achieve the required reduction
    for t in range(n + 1):
        # Maximum reduction with t operations is dp[t]
        # Check if condition is satisfied: S1 + t*S2 - dp[t] ≤ x
        if S1 + t * S2 - dp[t] <= x:
            return t

    return -1
```

```javascript
// Time: O(n^2) | Space: O(n)
function minimumTime(nums1, nums2, x) {
  const n = nums1.length;

  // Create pairs and sort by nums2[i]
  const pairs = [];
  for (let i = 0; i < n; i++) {
    pairs.push([nums1[i], nums2[i]]);
  }
  pairs.sort((a, b) => a[1] - b[1]);

  // dp[j] = maximum reduction using j operations
  const dp = new Array(n + 1).fill(0);

  // Process each index
  for (let i = 0; i < n; i++) {
    const [a, b] = pairs[i]; // a = nums1[i], b = nums2[i]

    // Update dp backwards to avoid reusing same index
    for (let j = i + 1; j > 0; j--) {
      // Option 1: Use this index at time j
      // Reduction = a + b * j
      const useCurrent = dp[j - 1] + a + b * j;

      // Option 2: Don't use this index
      const notUseCurrent = dp[j];

      // Take maximum
      dp[j] = Math.max(useCurrent, notUseCurrent);
    }
  }

  // Calculate total sums
  const S1 = nums1.reduce((sum, val) => sum + val, 0);
  const S2 = nums2.reduce((sum, val) => sum + val, 0);

  // Check each possible t
  for (let t = 0; t <= n; t++) {
    // Check if condition is satisfied
    if (S1 + t * S2 - dp[t] <= x) {
      return t;
    }
  }

  return -1;
}
```

```java
// Time: O(n^2) | Space: O(n)
class Solution {
    public int minimumTime(List<Integer> nums1, List<Integer> nums2, int x) {
        int n = nums1.size();

        // Create pairs and sort by nums2[i]
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) {
            pairs[i][0] = nums1.get(i);
            pairs[i][1] = nums2.get(i);
        }

        // Sort by nums2[i] (second element of pair)
        Arrays.sort(pairs, (a, b) -> Integer.compare(a[1], b[1]));

        // dp[j] = maximum reduction using j operations
        int[] dp = new int[n + 1];

        // Process each index
        for (int i = 0; i < n; i++) {
            int a = pairs[i][0];  // nums1[i]
            int b = pairs[i][1];  // nums2[i]

            // Update dp backwards to avoid reusing same index
            for (int j = i + 1; j > 0; j--) {
                // Option 1: Use this index at time j
                // Reduction = a + b * j
                int useCurrent = dp[j - 1] + a + b * j;

                // Option 2: Don't use this index
                int notUseCurrent = dp[j];

                // Take maximum
                dp[j] = Math.max(useCurrent, notUseCurrent);
            }
        }

        // Calculate total sums
        long S1 = 0, S2 = 0;
        for (int i = 0; i < n; i++) {
            S1 += nums1.get(i);
            S2 += nums2.get(i);
        }

        // Check each possible t
        for (int t = 0; t <= n; t++) {
            // Check if condition is satisfied
            if (S1 + t * S2 - dp[t] <= x) {
                return t;
            }
        }

        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- Sorting the pairs takes O(n log n)
- The DP nested loops: outer loop runs n times, inner loop runs up to n times → O(n²)
- Total: O(n²) dominates O(n log n)

**Space Complexity:** O(n)

- We store the pairs array: O(n)
- The DP array: O(n)
- Total: O(n)

## Common Mistakes

1. **Wrong sorting order:** Sorting by nums1[i] instead of nums2[i] fails because it doesn't account for growth rates. Always sort by the growth rate (nums2[i]) to reduce faster-growing elements later.

2. **Incorrect DP update direction:** Updating dp forwards instead of backwards would allow reusing the same index multiple times. We must update backwards (j from i+1 down to 1) to ensure each index is used at most once.

3. **Off-by-one in time calculation:** The reduction value is `a + b * j` where j is the operation number (1-based), not `a + b * (j-1)`. This is because if we use an index as the j-th operation, it happens at time j.

4. **Missing the -1 return case:** If even after n operations we can't reduce the sum to ≤ x, we must return -1. Some implementations forget this edge case.

## When You'll See This Pattern

This problem combines **sorting with knapsack-style DP**, a pattern that appears in optimization problems where order matters:

1. **Maximum Profit in Job Scheduling** (LeetCode 1235): Sort jobs by end time, then use DP to select non-overlapping jobs for maximum profit.

2. **Maximum Number of Events That Can Be Attended II** (LeetCode 1751): Sort events by end time, use DP to select events with maximum value.

3. **Reducing Dishes** (LeetCode 1402): Sort satisfaction levels, then choose which dishes to prepare and in what order to maximize total satisfaction.

The common thread: when order affects value (like later operations giving more credit to faster-growing elements), sort by the factor that determines optimal ordering, then use DP to select items.

## Key Takeaways

1. **Growth-aware prioritization:** When dealing with elements that grow over time, prioritize reducing faster-growing elements later to maximize the value of each reduction.

2. **Mathematical reformulation:** Complex operational problems can often be simplified by deriving a mathematical inequality and reframing it as an optimization problem.

3. **Sort + Knapsack DP pattern:** When order matters in a selection problem, sort by the criterion that determines optimal ordering, then use DP to make selections.

[Practice this problem on CodeJeet](/problem/minimum-time-to-make-array-sum-at-most-x)
