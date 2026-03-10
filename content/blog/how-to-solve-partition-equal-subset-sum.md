---
title: "How to Solve Partition Equal Subset Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Equal Subset Sum. Medium difficulty, 49.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-07-21"
category: "dsa-patterns"
tags: ["partition-equal-subset-sum", "array", "dynamic-programming", "medium"]
---

# How to Solve Partition Equal Subset Sum

The Partition Equal Subset Sum problem asks whether we can split an array of integers into two subsets with equal sums. This is tricky because it's not about finding two contiguous subarrays—we can pick any elements from anywhere in the array to form each subset. At first glance, this might seem like a combinatorial problem where we need to check all possible subsets, which would be exponential. The key insight is recognizing this as a variation of the classic "subset sum" problem, where we're looking for a subset that sums to exactly half of the total sum.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 5, 11, 5]`.

**Step 1: Calculate total sum**  
Total sum = 1 + 5 + 11 + 5 = 22

**Step 2: Check if partition is possible**  
If we can partition into two equal subsets, each subset must sum to 22/2 = 11. So we need to find a subset that sums to 11.

**Step 3: Check subsets systematically**  
We can think of this as a decision process for each number: include it in our target subset or not.

Starting with target = 11:

- Consider `1`: Can we make 11 with remaining numbers?  
  If we include `1`, new target = 10, remaining numbers = [5, 11, 5]  
  If we exclude `1`, target = 11, remaining numbers = [5, 11, 5]

- Consider `5` after including `1` (target = 10):  
  If we include `5`, new target = 5, remaining numbers = [11, 5]  
  If we exclude `5`, target = 10, remaining numbers = [11, 5]

- Consider `11` after including `1` and `5` (target = 5):  
  If we include `11`, new target = -6 → impossible (negative)  
  If we exclude `11`, target = 5, remaining numbers = [5]

- Consider `5` after including `1`, `5`, and excluding `11` (target = 5):  
  If we include `5`, new target = 0 → success! We found subset [1, 5, 5] that sums to 11.

This decision tree approach shows the problem's recursive nature. However, exploring all paths would be O(2^n). The optimization comes from noticing we're solving the same subproblems repeatedly: "Can we make sum X using the first Y elements?"

## Brute Force Approach

The brute force solution uses recursion to explore all possible subsets. For each element, we have two choices: include it in the current subset or exclude it. We recursively check if we can reach the target sum with either choice.

The problem with this approach is exponential time complexity. For an array of n elements, there are 2^n possible subsets to check. Even for moderately sized arrays (n = 50), this becomes computationally infeasible.

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack
def canPartition(nums):
    total = sum(nums)

    # If total is odd, can't partition into equal integer sums
    if total % 2 != 0:
        return False

    target = total // 2

    def dfs(index, current_sum):
        # Base cases
        if current_sum == target:
            return True
        if current_sum > target or index >= len(nums):
            return False

        # Try including current element
        if dfs(index + 1, current_sum + nums[index]):
            return True

        # Try excluding current element
        return dfs(index + 1, current_sum)

    return dfs(0, 0)
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack
function canPartition(nums) {
  const total = nums.reduce((sum, num) => sum + num, 0);

  // If total is odd, can't partition into equal integer sums
  if (total % 2 !== 0) return false;

  const target = total / 2;

  function dfs(index, currentSum) {
    // Base cases
    if (currentSum === target) return true;
    if (currentSum > target || index >= nums.length) return false;

    // Try including current element
    if (dfs(index + 1, currentSum + nums[index])) return true;

    // Try excluding current element
    return dfs(index + 1, currentSum);
  }

  return dfs(0, 0);
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;

    // If total is odd, can't partition into equal integer sums
    if (total % 2 != 0) return false;

    int target = total / 2;
    return dfs(nums, 0, 0, target);
}

private boolean dfs(int[] nums, int index, int currentSum, int target) {
    // Base cases
    if (currentSum == target) return true;
    if (currentSum > target || index >= nums.length) return false;

    // Try including current element
    if (dfs(nums, index + 1, currentSum + nums[index], target)) return true;

    // Try excluding current element
    return dfs(nums, index + 1, currentSum, target);
}
```

</div>

## Optimized Approach

The key insight is that this is a **subset sum problem** with target = total/2. We can solve it using **dynamic programming** to avoid recomputing the same subproblems.

We create a DP table where `dp[i][j]` represents whether we can achieve sum `j` using the first `i` elements. The recurrence relation is:

- `dp[i][j] = dp[i-1][j]` (exclude current element) OR
- `dp[i][j] = dp[i-1][j - nums[i-1]]` (include current element, if `j >= nums[i-1]`)

We can optimize space by using a 1D array since we only need the previous row. The 1D DP array `dp[j]` represents whether we can achieve sum `j` with the elements processed so far. We iterate backwards through the DP array to avoid reusing the same element multiple times.

## Optimal Solution

Here's the space-optimized DP solution that runs in O(n × target) time and O(target) space:

<div class="code-group">

```python
# Time: O(n × target) | Space: O(target) where target = sum(nums)/2
def canPartition(nums):
    total = sum(nums)

    # If total sum is odd, equal partition is impossible
    if total % 2 != 0:
        return False

    target = total // 2

    # dp[j] will be True if we can achieve sum j with processed elements
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum 0 is always achievable (empty subset)

    # Process each number in the array
    for num in nums:
        # Iterate backwards to avoid reusing the same element multiple times
        # We start from target and go down to num
        for j in range(target, num - 1, -1):
            # dp[j] is True if either:
            # 1. We could already make sum j without current num (dp[j] was True)
            # 2. We can make sum j by including current num (dp[j - num] was True)
            dp[j] = dp[j] or dp[j - num]

    # Return whether we can achieve the target sum
    return dp[target]
```

```javascript
// Time: O(n × target) | Space: O(target) where target = sum(nums)/2
function canPartition(nums) {
  const total = nums.reduce((sum, num) => sum + num, 0);

  // If total sum is odd, equal partition is impossible
  if (total % 2 !== 0) return false;

  const target = total / 2;

  // dp[j] will be true if we can achieve sum j with processed elements
  const dp = new Array(target + 1).fill(false);
  dp[0] = true; // Base case: sum 0 is always achievable (empty subset)

  // Process each number in the array
  for (const num of nums) {
    // Iterate backwards to avoid reusing the same element multiple times
    // We start from target and go down to num
    for (let j = target; j >= num; j--) {
      // dp[j] is true if either:
      // 1. We could already make sum j without current num (dp[j] was true)
      // 2. We can make sum j by including current num (dp[j - num] was true)
      dp[j] = dp[j] || dp[j - num];
    }
  }

  // Return whether we can achieve the target sum
  return dp[target];
}
```

```java
// Time: O(n × target) | Space: O(target) where target = sum(nums)/2
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;

    // If total sum is odd, equal partition is impossible
    if (total % 2 != 0) return false;

    int target = total / 2;

    // dp[j] will be true if we can achieve sum j with processed elements
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;  // Base case: sum 0 is always achievable (empty subset)

    // Process each number in the array
    for (int num : nums) {
        // Iterate backwards to avoid reusing the same element multiple times
        // We start from target and go down to num
        for (int j = target; j >= num; j--) {
            // dp[j] is true if either:
            // 1. We could already make sum j without current num (dp[j] was true)
            // 2. We can make sum j by including current num (dp[j - num] was true)
            dp[j] = dp[j] || dp[j - num];
        }
    }

    // Return whether we can achieve the target sum
    return dp[target];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × target), where n is the number of elements and target = sum(nums)/2. We process each element once, and for each element, we potentially update all DP states from target down to the element's value.

**Space Complexity:** O(target), where target = sum(nums)/2. We only need a 1D boolean array of size target + 1 to store which sums are achievable.

This is a **pseudo-polynomial** algorithm because the runtime depends on the numeric value of the target, not just the number of elements. For very large target values (when sum is large), this could still be slow, but it's the best we can do for this NP-hard problem.

## Common Mistakes

1. **Not checking if total sum is odd first:** If the total sum is odd, it's impossible to partition into two equal integer subsets. Always check this early to save computation.

2. **Iterating forward instead of backward in the 1D DP array:** When using the space-optimized 1D DP approach, you must iterate backwards through the DP array. If you iterate forward, you might reuse the same element multiple times (treating it as unlimited supply), which is incorrect for this problem.

3. **Forgetting the base case dp[0] = True:** The sum 0 is always achievable by taking no elements. Without this base case, the DP won't work correctly.

4. **Using the wrong data structure:** Some candidates try to use a set to track achievable sums, which can work but is less efficient than the DP array approach. The DP array gives us O(1) lookup and update times for each sum.

## When You'll See This Pattern

The subset sum DP pattern appears in many problems where you need to check if a certain target can be achieved by selecting a subset of elements:

1. **Partition to K Equal Sum Subsets (LeetCode 698):** A generalization of this problem where you need to partition into k equal subsets instead of just 2.

2. **Target Sum (LeetCode 494):** Similar subset selection problem where you assign + or - to each number to reach a target sum.

3. **Coin Change (LeetCode 322):** While typically about minimum coins, the "coin change 2" variant (LeetCode 518) uses a similar DP approach to count ways to make change.

4. **Minimum Subset Sum Difference (GeeksforGeeks):** Finding the minimum difference between two subset sums, which uses a similar DP table to find achievable sums.

## Key Takeaways

1. **Recognize subset sum problems:** When you need to check if a target sum can be achieved by selecting a subset of elements (with each element used at most once), think of the subset sum DP pattern.

2. **Space optimization trick:** The 1D DP array with backward iteration is a common optimization for subset sum problems that reduces space from O(n × target) to O(target).

3. **Early pruning:** Always check for obvious impossibilities first (like odd total sum) to avoid unnecessary computation.

Related problems: [Partition to K Equal Sum Subsets](/problem/partition-to-k-equal-sum-subsets), [Minimize the Difference Between Target and Chosen Elements](/problem/minimize-the-difference-between-target-and-chosen-elements), [Maximum Number of Ways to Partition an Array](/problem/maximum-number-of-ways-to-partition-an-array)
