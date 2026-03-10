---
title: "How to Solve Maximum Number of Operations With the Same Score II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Operations With the Same Score II. Medium difficulty, 34.1% acceptance rate. Topics: Array, Dynamic Programming, Memoization."
date: "2029-08-09"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-operations-with-the-same-score-ii",
    "array",
    "dynamic-programming",
    "memoization",
    "medium",
  ]
---

# How to Solve Maximum Number of Operations With the Same Score II

This problem asks us to find the maximum number of operations we can perform on an array where each operation must have the same "score" (sum of the two chosen elements), and we can only remove pairs from the start, end, or one from each end. The challenge lies in the branching possibilities—at each step we have up to three choices, and the score must remain consistent across all operations. This creates a complex decision tree that requires careful optimization.

## Visual Walkthrough

Let's trace through `nums = [3,2,1,2,3,4]` to build intuition. We need to try different possible first operations since the score must be consistent:

**Option 1: First operation = first two elements (3+2=5)**

- Remove [3,2], remaining: [1,2,3,4]
- Next operation must also sum to 5
- Can't remove first two (1+2=3 ≠ 5)
- Can't remove last two (3+4=7 ≠ 5)
- Can remove first and last (1+4=5 ✓)
- Remove [1,4], remaining: [2,3]
- Next operation: 2+3=5 ✓
- Total operations: 3

**Option 2: First operation = last two elements (3+4=7)**

- Remove [3,4], remaining: [3,2,1,2]
- Next must sum to 7
- First two: 3+2=5 ≠ 7
- Last two: 1+2=3 ≠ 7
- First and last: 3+2=5 ≠ 7
- Total operations: 1

**Option 3: First operation = first and last (3+4=7)**

- Remove [3,4], remaining: [2,1,2,3]
- Next must sum to 7
- First two: 2+1=3 ≠ 7
- Last two: 2+3=5 ≠ 7
- First and last: 2+3=5 ≠ 7
- Total operations: 1

The maximum is 3 operations with score 5. Notice we had to explore multiple paths—this suggests we need recursion with memoization.

## Brute Force Approach

A naive solution would explore all possible sequences of operations recursively. At each step with at least 2 elements, we have three choices:

1. Remove first two elements if they match the target score
2. Remove last two elements if they match the target score
3. Remove first and last elements if they match the target score

We'd need to try all three possible initial scores (from the three possible first operations) and recursively explore each path. The recursion tree would have branching factor up to 3 and depth up to n/2, giving O(3^(n/2)) time complexity—far too slow for n up to 2000.

The key insight we need: many subproblems repeat. If we remove different pairs but end up with the same subarray, we're solving the same problem multiple times.

## Optimized Approach

This is a classic dynamic programming/memoization problem. We can define a recursive function `dfs(left, right, target)` that returns the maximum operations we can perform on `nums[left:right+1]` with the given target score.

**Key observations:**

1. The target score is fixed for all operations in a sequence (determined by the first operation)
2. We only have three possible first operations, so we only need to try three target scores
3. The state is defined by `(left, right)` since target is constant for each exploration
4. We can memoize results for `(left, right)` pairs to avoid redundant computation

**State transitions:**

- If `nums[left] + nums[left+1] == target`: we can do 1 + `dfs(left+2, right, target)`
- If `nums[right] + nums[right-1] == target`: we can do 1 + `dfs(left, right-2, target)`
- If `nums[left] + nums[right] == target`: we can do 1 + `dfs(left+1, right-1, target)`

We take the maximum of these valid options. The base case is when `left >= right` (less than 2 elements).

## Optimal Solution

We use memoization (top-down DP) with three separate explorations for each possible initial score. The `@lru_cache` decorator in Python or a memo dictionary makes implementation clean.

<div class="code-group">

```python
# Time: O(n²) - n² states, each computed in O(1)
# Space: O(n²) for memoization cache
from functools import lru_cache

class Solution:
    def maxOperations(self, nums: List[int]) -> int:
        n = len(nums)

        # Helper function with memoization
        @lru_cache(None)
        def dfs(left, right, target):
            # Base case: not enough elements for an operation
            if left >= right:
                return 0

            max_ops = 0

            # Option 1: Remove first two elements
            if left + 1 <= right and nums[left] + nums[left + 1] == target:
                max_ops = max(max_ops, 1 + dfs(left + 2, right, target))

            # Option 2: Remove last two elements
            if right - 1 >= left and nums[right] + nums[right - 1] == target:
                max_ops = max(max_ops, 1 + dfs(left, right - 2, target))

            # Option 3: Remove first and last elements
            if nums[left] + nums[right] == target:
                max_ops = max(max_ops, 1 + dfs(left + 1, right - 1, target))

            return max_ops

        # Try all three possible initial operations
        # Each determines the target score for that exploration
        res = 0

        # Initial operation: first two elements
        if n >= 2:
            target1 = nums[0] + nums[1]
            res = max(res, 1 + dfs(2, n - 1, target1))

        # Initial operation: last two elements
        if n >= 2:
            target2 = nums[-1] + nums[-2]
            res = max(res, 1 + dfs(0, n - 3, target2))

        # Initial operation: first and last elements
        if n >= 2:
            target3 = nums[0] + nums[-1]
            res = max(res, 1 + dfs(1, n - 2, target3))

        return res
```

```javascript
// Time: O(n²) - n² states, each computed in O(1)
// Space: O(n²) for memoization cache
var maxOperations = function (nums) {
  const n = nums.length;

  // Memoization cache: key = `${left},${right},${target}`
  const memo = new Map();

  // Recursive DFS function
  function dfs(left, right, target) {
    // Base case: not enough elements
    if (left >= right) {
      return 0;
    }

    // Check memo cache
    const key = `${left},${right},${target}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    let maxOps = 0;

    // Option 1: Remove first two elements
    if (left + 1 <= right && nums[left] + nums[left + 1] === target) {
      maxOps = Math.max(maxOps, 1 + dfs(left + 2, right, target));
    }

    // Option 2: Remove last two elements
    if (right - 1 >= left && nums[right] + nums[right - 1] === target) {
      maxOps = Math.max(maxOps, 1 + dfs(left, right - 2, target));
    }

    // Option 3: Remove first and last elements
    if (nums[left] + nums[right] === target) {
      maxOps = Math.max(maxOps, 1 + dfs(left + 1, right - 1, target));
    }

    // Store result in memo cache
    memo.set(key, maxOps);
    return maxOps;
  }

  let result = 0;

  // Try all three possible initial operations
  // Initial: first two elements
  if (n >= 2) {
    const target1 = nums[0] + nums[1];
    result = Math.max(result, 1 + dfs(2, n - 1, target1));
  }

  // Initial: last two elements
  if (n >= 2) {
    const target2 = nums[n - 1] + nums[n - 2];
    result = Math.max(result, 1 + dfs(0, n - 3, target2));
  }

  // Initial: first and last elements
  if (n >= 2) {
    const target3 = nums[0] + nums[n - 1];
    result = Math.max(result, 1 + dfs(1, n - 2, target3));
  }

  return result;
};
```

```java
// Time: O(n²) - n² states, each computed in O(1)
// Space: O(n²) for memoization cache
class Solution {
    private int[] nums;
    private Map<String, Integer> memo;

    public int maxOperations(int[] nums) {
        this.nums = nums;
        int n = nums.length;
        int result = 0;

        // Try all three possible initial operations
        // Initial: first two elements
        if (n >= 2) {
            int target1 = nums[0] + nums[1];
            memo = new HashMap<>();
            result = Math.max(result, 1 + dfs(2, n - 1, target1));
        }

        // Initial: last two elements
        if (n >= 2) {
            int target2 = nums[n - 1] + nums[n - 2];
            memo = new HashMap<>();
            result = Math.max(result, 1 + dfs(0, n - 3, target2));
        }

        // Initial: first and last elements
        if (n >= 2) {
            int target3 = nums[0] + nums[n - 1];
            memo = new HashMap<>();
            result = Math.max(result, 1 + dfs(1, n - 2, target3));
        }

        return result;
    }

    private int dfs(int left, int right, int target) {
        // Base case: not enough elements
        if (left >= right) {
            return 0;
        }

        // Check memo cache
        String key = left + "," + right + "," + target;
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        int maxOps = 0;

        // Option 1: Remove first two elements
        if (left + 1 <= right && nums[left] + nums[left + 1] == target) {
            maxOps = Math.max(maxOps, 1 + dfs(left + 2, right, target));
        }

        // Option 2: Remove last two elements
        if (right - 1 >= left && nums[right] + nums[right - 1] == target) {
            maxOps = Math.max(maxOps, 1 + dfs(left, right - 2, target));
        }

        // Option 3: Remove first and last elements
        if (nums[left] + nums[right] == target) {
            maxOps = Math.max(maxOps, 1 + dfs(left + 1, right - 1, target));
        }

        // Store result in memo cache
        memo.put(key, maxOps);
        return maxOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have O(n²) possible `(left, right)` states (left from 0 to n-1, right from left to n-1)
- Each state is computed once in O(1) time (just checking three conditions)
- We run the DP three times (for each possible initial score), but that's still O(n²)

**Space Complexity:** O(n²)

- The memoization cache stores results for all O(n²) states
- The recursion depth is O(n) in worst case, but the cache dominates

## Common Mistakes

1. **Forgetting to reset memoization for different target scores**: The DP state depends on both `(left, right)` AND the target score. If you reuse the same memo cache across different targets, you'll get wrong results. Each target requires a fresh memoization.

2. **Incorrect base case handling**: The base case should be `left >= right` (not enough elements for any operation), not `left > right`. When `left == right`, there's only 1 element left, which can't form a pair.

3. **Not checking array bounds in conditionals**: Before accessing `nums[left+1]` or `nums[right-1]`, you must verify `left+1 <= right` and `right-1 >= left`. Otherwise, you'll get index out of bounds errors.

4. **Assuming only one initial operation needs to be tried**: Some candidates only try the first two elements as the initial operation, but the optimal sequence might start with a different operation. You must try all three possibilities.

## When You'll See This Pattern

This "interval DP" pattern appears in problems where you make decisions at the boundaries of a shrinking array/string:

1. **Predict the Winner (LeetCode 486)** - Similar interval DP where players pick from ends
2. **Stone Game (LeetCode 877)** - Another two-player game with picks from ends
3. **Burst Balloons (LeetCode 312)** - More complex interval DP where choices affect neighbors
4. **Palindrome Partitioning II (LeetCode 132)** - Interval DP for palindrome checking

The pattern is: define state as `(left, right)` interval, consider decisions at boundaries, use memoization to avoid recomputation.

## Key Takeaways

1. **Interval DP is the right approach for "shrinking array" problems** where you make decisions at the boundaries. The state is typically `(left, right)` indices.

2. **When multiple initial choices exist, try them all separately**. Don't assume the first obvious choice is optimal.

3. **Memoization key must include all parameters that affect the result**. Here, both the interval AND the target score are part of the state.

4. **Always validate array bounds before accessing elements** when indices are computed dynamically (like `left+1` or `right-1`).

[Practice this problem on CodeJeet](/problem/maximum-number-of-operations-with-the-same-score-ii)
