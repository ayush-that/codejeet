---
title: "How to Solve Partition to K Equal Sum Subsets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition to K Equal Sum Subsets. Medium difficulty, 38.4% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Memoization."
date: "2027-10-28"
category: "dsa-patterns"
tags: ["partition-to-k-equal-sum-subsets", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Partition to K Equal Sum Subsets

This problem asks whether we can divide an array of integers into `k` non-empty subsets where each subset has exactly the same sum. What makes this problem tricky is that we're not just partitioning into two equal halves (which could use dynamic programming), but into `k` equal parts, which requires tracking multiple subsets simultaneously. The exponential search space makes brute force approaches infeasible for even moderately sized arrays.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [4, 3, 2, 3, 5, 2, 1]`, `k = 4`.

First, we calculate the total sum: 4+3+2+3+5+2+1 = 20. Since we need 4 equal subsets, each subset must sum to 20/4 = 5. If the total sum weren't divisible by `k`, we could immediately return `false`.

Now we need to assign each number to one of 4 subsets, all reaching sum 5. Let's try a systematic approach:

1. Start with empty subsets: [], [], [], []
2. Take the largest number first (5): [5], [], [], [] (first subset complete)
3. Next largest is 4: [5], [4], [], [] (second subset needs 1)
4. Next is 3: [5], [4], [3], [] (third subset needs 2)
5. Next is 3: [5], [4], [3], [3] (fourth subset needs 2)
6. Next is 2: [5], [4], [3], [3,2] (fourth subset complete)
7. Next is 2: [5], [4], [3,2], [3,2] (third subset complete)
8. Last is 1: [5], [4,1], [3,2], [3,2] (all subsets sum to 5)

This works! Notice we sorted in descending order and always tried to fill subsets that were closest to completion first. This ordering helps prune the search space by placing large numbers early when there are more empty subsets available.

## Brute Force Approach

The most straightforward approach is to generate all possible assignments of each number to one of `k` subsets, then check if all subsets sum to the target. For each of `n` numbers, we have `k` choices, giving us `k^n` possibilities. Even for small inputs like `n=10, k=3`, that's 59,049 possibilities; for `n=20`, it's over 3.4 billion.

A naive implementation might look like this:

```python
def canPartitionKSubsets(nums, k):
    total = sum(nums)
    if total % k != 0:
        return False
    target = total // k

    subsets = [0] * k

    def backtrack(i):
        if i == len(nums):
            return all(s == target for s in subsets)

        for j in range(k):
            if subsets[j] + nums[i] <= target:
                subsets[j] += nums[i]
                if backtrack(i + 1):
                    return True
                subsets[j] -= nums[i]

        return False

    return backtrack(0)
```

This tries placing each number in every possible subset that doesn't exceed the target. The problem? It explores many equivalent permutations. For example, if we have two empty subsets, placing a number in subset 1 vs subset 2 leads to identical states (just with subset labels swapped). We waste time exploring these symmetrical branches.

## Optimized Approach

The key insight is that we don't care which subset gets which numbers—we only care whether we can fill all subsets to the target. This leads to two important optimizations:

1. **Sort in descending order**: Place larger numbers first. If a large number can't fit anywhere, we fail early rather than after exploring many placements of smaller numbers.

2. **Skip duplicate subsets**: If we try placing a number in an empty subset and it fails, we shouldn't try placing it in another empty subset—the result will be the same due to symmetry.

3. **Memoization with bitmask**: We can represent which numbers have been used as a bitmask (integer where bit i = 1 if nums[i] is used). This lets us cache results for states we've already computed.

The most efficient approach uses backtracking with these optimizations. We track:

- `used`: bitmask of used numbers
- `current_sum`: sum of the current subset being built
- `subsets_completed`: how many full subsets we've built so far

We build one subset at a time. When we complete a subset (reach target sum), we start a new one from the beginning of the array (skipping used numbers).

## Optimal Solution

<div class="code-group">

```python
# Time: O(k * 2^n) - In worst case, we explore all subsets combinations
# Space: O(2^n) - For memoization cache
def canPartitionKSubsets(nums, k):
    total = sum(nums)

    # If total sum isn't divisible by k, impossible
    if total % k != 0:
        return False

    target = total // k
    n = len(nums)

    # Sort in descending order - larger numbers first for early pruning
    nums.sort(reverse=True)

    # Memoization dictionary: (used_mask, subsets_completed) -> can_partition
    memo = {}

    def backtrack(used_mask, subsets_completed, current_sum, start_index):
        # If we've completed k-1 subsets, the last one must work
        if subsets_completed == k - 1:
            return True

        # If current sum exceeds target, invalid path
        if current_sum > target:
            return False

        # If we reach target, start a new subset
        if current_sum == target:
            # Start new subset from beginning (but skip used numbers)
            result = backtrack(used_mask, subsets_completed + 1, 0, 0)
            memo[(used_mask, subsets_completed)] = result
            return result

        # Check memoization
        if (used_mask, subsets_completed) in memo:
            return memo[(used_mask, subsets_completed)]

        # Try adding unused numbers to current subset
        for i in range(start_index, n):
            # Skip if number already used
            if used_mask & (1 << i):
                continue

            # Mark number as used
            new_mask = used_mask | (1 << i)

            # Try adding this number to current subset
            if backtrack(new_mask, subsets_completed, current_sum + nums[i], i + 1):
                memo[(used_mask, subsets_completed)] = True
                return True

        # No valid partition found from this state
        memo[(used_mask, subsets_completed)] = False
        return False

    # Start with no numbers used, 0 subsets completed, sum 0, from index 0
    return backtrack(0, 0, 0, 0)
```

```javascript
// Time: O(k * 2^n) - In worst case, we explore all subsets combinations
// Space: O(2^n) - For memoization cache
function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((sum, num) => sum + num, 0);

  // If total sum isn't divisible by k, impossible
  if (total % k !== 0) return false;

  const target = total / k;
  const n = nums.length;

  // Sort in descending order - larger numbers first for early pruning
  nums.sort((a, b) => b - a);

  // Memoization map: key -> can_partition
  const memo = new Map();

  function backtrack(usedMask, subsetsCompleted, currentSum, startIndex) {
    // If we've completed k-1 subsets, the last one must work
    if (subsetsCompleted === k - 1) return true;

    // If current sum exceeds target, invalid path
    if (currentSum > target) return false;

    // If we reach target, start a new subset
    if (currentSum === target) {
      // Start new subset from beginning (but skip used numbers)
      const result = backtrack(usedMask, subsetsCompleted + 1, 0, 0);
      memo.set(`${usedMask},${subsetsCompleted}`, result);
      return result;
    }

    // Check memoization
    const memoKey = `${usedMask},${subsetsCompleted}`;
    if (memo.has(memoKey)) return memo.get(memoKey);

    // Try adding unused numbers to current subset
    for (let i = startIndex; i < n; i++) {
      // Skip if number already used
      if (usedMask & (1 << i)) continue;

      // Mark number as used
      const newMask = usedMask | (1 << i);

      // Try adding this number to current subset
      if (backtrack(newMask, subsetsCompleted, currentSum + nums[i], i + 1)) {
        memo.set(memoKey, true);
        return true;
      }
    }

    // No valid partition found from this state
    memo.set(memoKey, false);
    return false;
  }

  // Start with no numbers used, 0 subsets completed, sum 0, from index 0
  return backtrack(0, 0, 0, 0);
}
```

```java
// Time: O(k * 2^n) - In worst case, we explore all subsets combinations
// Space: O(2^n) - For memoization cache
class Solution {
    public boolean canPartitionKSubsets(int[] nums, int k) {
        int total = 0;
        for (int num : nums) total += num;

        // If total sum isn't divisible by k, impossible
        if (total % k != 0) return false;

        int target = total / k;
        int n = nums.length;

        // Sort in descending order - larger numbers first for early pruning
        Arrays.sort(nums);
        // Reverse array for descending order
        for (int i = 0; i < n / 2; i++) {
            int temp = nums[i];
            nums[i] = nums[n - 1 - i];
            nums[n - 1 - i] = temp;
        }

        // Memoization map: key -> can_partition
        Map<String, Boolean> memo = new HashMap<>();

        return backtrack(nums, target, k, 0, 0, 0, 0, memo);
    }

    private boolean backtrack(int[] nums, int target, int k,
                              int usedMask, int subsetsCompleted,
                              int currentSum, int startIndex,
                              Map<String, Boolean> memo) {
        // If we've completed k-1 subsets, the last one must work
        if (subsetsCompleted == k - 1) return true;

        // If current sum exceeds target, invalid path
        if (currentSum > target) return false;

        // If we reach target, start a new subset
        if (currentSum == target) {
            // Start new subset from beginning (but skip used numbers)
            boolean result = backtrack(nums, target, k, usedMask,
                                      subsetsCompleted + 1, 0, 0, memo);
            memo.put(usedMask + "," + subsetsCompleted, result);
            return result;
        }

        // Check memoization
        String memoKey = usedMask + "," + subsetsCompleted;
        if (memo.containsKey(memoKey)) return memo.get(memoKey);

        // Try adding unused numbers to current subset
        for (int i = startIndex; i < nums.length; i++) {
            // Skip if number already used
            if ((usedMask & (1 << i)) != 0) continue;

            // Mark number as used
            int newMask = usedMask | (1 << i);

            // Try adding this number to current subset
            if (backtrack(nums, target, k, newMask, subsetsCompleted,
                         currentSum + nums[i], i + 1, memo)) {
                memo.put(memoKey, true);
                return true;
            }
        }

        // No valid partition found from this state
        memo.put(memoKey, false);
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k \* 2^n) in the worst case. Here's why:

- We use a bitmask to represent which numbers are used (2^n possible states)
- For each state, we might try building up to k subsets
- The sorting takes O(n log n), which is dominated by the exponential term
- In practice, pruning (sorting descending, skipping duplicates) makes it much faster than worst case

**Space Complexity:** O(2^n) for the memoization cache. Each unique state (used_mask, subsets_completed) gets stored. The recursion depth is O(n) for the call stack.

## Common Mistakes

1. **Not checking divisibility first**: Forgetting to check if total sum is divisible by k leads to wasted computation or incorrect results. Always return false immediately if total % k != 0.

2. **Forgetting to sort in descending order**: Placing smaller numbers first creates a much larger search space. Large numbers are harder to place, so we want to know early if they can't fit.

3. **Not skipping duplicate empty subsets**: If you have multiple empty subsets with the same sum, trying a number in one empty subset and then another is redundant. Once you try placing a number in an empty subset and it fails, skip other empty subsets.

4. **Incorrect memoization key**: Memoizing only on `used_mask` isn't enough because the same set of used numbers could be split into different numbers of completed subsets. You need `(used_mask, subsets_completed)` as the key.

## When You'll See This Pattern

This backtracking-with-pruning pattern appears in many subset partitioning problems:

1. **Partition Equal Subset Sum (LeetCode 416)**: The k=2 version of this problem. Can be solved with DP instead of backtracking since there are only 2 subsets.

2. **Fair Distribution of Cookies (LeetCode 2305)**: Similar backtracking to distribute cookies among k children, minimizing unfairness instead of requiring exact equality.

3. **Matchsticks to Square (LeetCode 473)**: The k=4 version with the additional constraint that subsets must form a square's sides.

The core pattern is: when you need to partition elements into groups with constraints, backtracking with smart pruning (sorting, skipping symmetries, memoization) is often the way to go.

## Key Takeaways

1. **Backtracking with pruning is powerful for partition problems**: When you need to divide elements into groups with constraints, backtracking lets you explore the search space while pruning invalid paths early.

2. **Sorting descending is a crucial optimization**: Placing larger elements first helps identify dead ends quickly, dramatically reducing the search space.

3. **Memoization on state representation is key**: Using bitmasks to represent used elements and caching results for (used_mask, progress) pairs avoids recomputing the same subproblems.

Related problems: [Partition Equal Subset Sum](/problem/partition-equal-subset-sum), [Fair Distribution of Cookies](/problem/fair-distribution-of-cookies), [Maximum Number of Ways to Partition an Array](/problem/maximum-number-of-ways-to-partition-an-array)
