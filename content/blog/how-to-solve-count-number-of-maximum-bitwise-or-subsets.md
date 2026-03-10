---
title: "How to Solve Count Number of Maximum Bitwise-OR Subsets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Maximum Bitwise-OR Subsets. Medium difficulty, 89.6% acceptance rate. Topics: Array, Backtracking, Bit Manipulation, Enumeration."
date: "2028-05-16"
category: "dsa-patterns"
tags:
  [
    "count-number-of-maximum-bitwise-or-subsets",
    "array",
    "backtracking",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Count Number of Maximum Bitwise-OR Subsets

This problem asks: given an integer array `nums`, find the maximum possible bitwise OR of any subset, then count how many different non-empty subsets achieve that maximum value. What makes this interesting is that we need to combine two tasks: finding a maximum value across all subsets, and counting subsets that reach it. A naive approach would generate all subsets (2^n possibilities), which becomes impossible for larger arrays. The key insight is that we don't actually need to examine every subset—we can compute the maximum OR efficiently and then count subsets using bitwise properties.

## Visual Walkthrough

Let's trace through `nums = [2, 7, 11, 15]` step by step:

**Step 1: Find maximum possible OR**

- Start with OR = 0
- 2 (binary 0010) → OR = 0010 = 2
- 7 (binary 0111) → OR = 0111 = 7
- 11 (binary 1011) → OR = 1111 = 15
- 15 (binary 1111) → OR = 1111 = 15

Maximum OR = 15 (binary 1111). This is the OR of all numbers: 2|7|11|15 = 15.

**Step 2: Identify which numbers contribute to maximum OR**

- Any number that has at least one bit set that's in the maximum OR could potentially help reach it
- But more importantly: we need to count subsets whose OR equals exactly 15

**Step 3: Count subsets with OR = 15**
Let's list some subsets and their ORs:

- [15] → OR = 15 ✓
- [11, 15] → 1011 | 1111 = 1111 = 15 ✓
- [7, 15] → 0111 | 1111 = 1111 = 15 ✓
- [2, 15] → 0010 | 1111 = 1111 = 15 ✓
- [7, 11] → 0111 | 1011 = 1111 = 15 ✓
- [2, 7, 11] → 0010 | 0111 | 1011 = 1111 = 15 ✓
- [2, 7, 15] → 0010 | 0111 | 1111 = 1111 = 15 ✓

Notice: **Every subset that contains 15 will have OR = 15** because 15 has all bits set (1111). Also, some subsets without 15 can still reach 15 if they collectively cover all bits.

The efficient approach: First compute max OR, then count how many subsets OR to exactly that value.

## Brute Force Approach

The most straightforward solution generates all 2^n subsets, computes each subset's OR, tracks the maximum, and counts how many subsets achieve it.

<div class="code-group">

```python
# Brute force: Time O(2^n * n) | Space O(1)
def countMaxOrSubsets_brute(nums):
    n = len(nums)
    max_or = 0
    count = 0

    # Generate all subsets using bitmask
    for mask in range(1, 1 << n):  # Start from 1 to exclude empty subset
        current_or = 0

        # Compute OR for this subset
        for i in range(n):
            if mask & (1 << i):  # If i-th element is in subset
                current_or |= nums[i]

        # Update max and count
        if current_or > max_or:
            max_or = current_or
            count = 1  # New maximum found
        elif current_or == max_or:
            count += 1  # Another subset with same maximum

    return count
```

```javascript
// Brute force: Time O(2^n * n) | Space O(1)
function countMaxOrSubsetsBrute(nums) {
  const n = nums.length;
  let maxOr = 0;
  let count = 0;

  // Generate all subsets using bitmask
  for (let mask = 1; mask < 1 << n; mask++) {
    // Start from 1 to exclude empty
    let currentOr = 0;

    // Compute OR for this subset
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // If i-th element is in subset
        currentOr |= nums[i];
      }
    }

    // Update max and count
    if (currentOr > maxOr) {
      maxOr = currentOr;
      count = 1; // New maximum found
    } else if (currentOr === maxOr) {
      count++; // Another subset with same maximum
    }
  }

  return count;
}
```

```java
// Brute force: Time O(2^n * n) | Space O(1)
public int countMaxOrSubsetsBrute(int[] nums) {
    int n = nums.length;
    int maxOr = 0;
    int count = 0;

    // Generate all subsets using bitmask
    for (int mask = 1; mask < (1 << n); mask++) {  // Start from 1 to exclude empty
        int currentOr = 0;

        // Compute OR for this subset
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {  // If i-th element is in subset
                currentOr |= nums[i];
            }
        }

        // Update max and count
        if (currentOr > maxOr) {
            maxOr = currentOr;
            count = 1;  // New maximum found
        } else if (currentOr == maxOr) {
            count++;    // Another subset with same maximum
        }
    }

    return count;
}
```

</div>

**Why this is too slow:** For n = 20, we have 1,048,576 subsets, and for each we iterate through up to 20 elements. That's ~20 million operations, which might pass but is inefficient. For n = 30, we have over 1 billion subsets—completely infeasible.

## Optimized Approach

The key insight: **We don't need to check every subset against every other subset.** We can:

1. **Compute maximum OR in O(n):** The maximum OR is simply the OR of ALL elements. Why? Because OR is monotonic—adding more elements can only set more bits, never unset them. So the OR of the entire array is the maximum possible.

2. **Count subsets efficiently:** Once we know the target OR value, we need to count subsets whose OR equals exactly that value. We can use:
   - **Backtracking/DFS:** Try including/excluding each element, pruning when we know we can't reach the target
   - **Dynamic programming:** Track reachable OR values and counts
   - **Bitmask enumeration with pruning:** Similar to brute force but skip masks that can't reach target

The most intuitive approach is backtracking with pruning:

- At each step, decide whether to include the current number
- Keep track of current OR value
- If including a number doesn't change the OR (it contributes no new bits), we still need to count it because different subsets with same OR still count separately
- We prune when we know we can't reach the maximum even with all remaining numbers

## Optimal Solution

We'll use backtracking with these optimizations:

1. Precompute maximum OR
2. During backtracking, if current OR == max OR, we can count all remaining subsets (2^remaining) because adding any elements won't change OR (it's already maximum)
3. If even after OR-ing all remaining numbers we can't reach max OR, prune that branch

<div class="code-group">

```python
# Optimal: Time O(2^n) worst case but heavily pruned | Space O(n) for recursion
def countMaxOrSubsets(nums):
    n = len(nums)
    # Step 1: Compute maximum possible OR (OR of all elements)
    max_or = 0
    for num in nums:
        max_or |= num

    # Step 2: Backtrack to count subsets
    def backtrack(idx, current_or):
        # If we've processed all elements
        if idx == n:
            return 1 if current_or == max_or else 0

        # Optimization: If current OR already equals max OR,
        # any subset of remaining elements will keep it at max OR
        # So we can add 2^(remaining) to count
        if current_or == max_or:
            # Number of subsets of remaining elements = 2^(n - idx)
            return 1 << (n - idx)

        # Optimization: Even if we OR all remaining numbers,
        # can we reach max OR?
        or_with_all_remaining = current_or
        for i in range(idx, n):
            or_with_all_remaining |= nums[i]

        # If even with all remaining we can't reach max, prune
        if or_with_all_remaining != max_or:
            return 0

        # Two choices: include current element or skip it
        # Include current element
        include_count = backtrack(idx + 1, current_or | nums[idx])

        # Skip current element
        skip_count = backtrack(idx + 1, current_or)

        return include_count + skip_count

    # Start backtracking from index 0 with initial OR = 0
    return backtrack(0, 0)
```

```javascript
// Optimal: Time O(2^n) worst case but heavily pruned | Space O(n) for recursion
function countMaxOrSubsets(nums) {
  const n = nums.length;
  // Step 1: Compute maximum possible OR (OR of all elements)
  let maxOr = 0;
  for (const num of nums) {
    maxOr |= num;
  }

  // Step 2: Backtrack to count subsets
  function backtrack(idx, currentOr) {
    // If we've processed all elements
    if (idx === n) {
      return currentOr === maxOr ? 1 : 0;
    }

    // Optimization: If current OR already equals max OR,
    // any subset of remaining elements will keep it at max OR
    if (currentOr === maxOr) {
      // Number of subsets of remaining elements = 2^(n - idx)
      return 1 << (n - idx);
    }

    // Optimization: Even if we OR all remaining numbers,
    // can we reach max OR?
    let orWithAllRemaining = currentOr;
    for (let i = idx; i < n; i++) {
      orWithAllRemaining |= nums[i];
    }

    // If even with all remaining we can't reach max, prune
    if (orWithAllRemaining !== maxOr) {
      return 0;
    }

    // Two choices: include current element or skip it
    // Include current element
    const includeCount = backtrack(idx + 1, currentOr | nums[idx]);

    // Skip current element
    const skipCount = backtrack(idx + 1, currentOr);

    return includeCount + skipCount;
  }

  // Start backtracking from index 0 with initial OR = 0
  return backtrack(0, 0);
}
```

```java
// Optimal: Time O(2^n) worst case but heavily pruned | Space O(n) for recursion
public int countMaxOrSubsets(int[] nums) {
    int n = nums.length;
    // Step 1: Compute maximum possible OR (OR of all elements)
    int maxOr = 0;
    for (int num : nums) {
        maxOr |= num;
    }

    // Step 2: Backtrack to count subsets
    return backtrack(nums, 0, 0, maxOr);
}

private int backtrack(int[] nums, int idx, int currentOr, int maxOr) {
    int n = nums.length;

    // If we've processed all elements
    if (idx == n) {
        return currentOr == maxOr ? 1 : 0;
    }

    // Optimization: If current OR already equals max OR,
    // any subset of remaining elements will keep it at max OR
    if (currentOr == maxOr) {
        // Number of subsets of remaining elements = 2^(n - idx)
        return 1 << (n - idx);
    }

    // Optimization: Even if we OR all remaining numbers,
    // can we reach max OR?
    int orWithAllRemaining = currentOr;
    for (int i = idx; i < n; i++) {
        orWithAllRemaining |= nums[i];
    }

    // If even with all remaining we can't reach max, prune
    if (orWithAllRemaining != maxOr) {
        return 0;
    }

    // Two choices: include current element or skip it
    // Include current element
    int includeCount = backtrack(nums, idx + 1, currentOr | nums[idx], maxOr);

    // Skip current element
    int skipCount = backtrack(nums, idx + 1, currentOr, maxOr);

    return includeCount + skipCount;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Worst case: O(2^n) when pruning doesn't help much (e.g., all numbers are 0)
- Average case: Much better due to pruning. The two key optimizations:
  1. When current OR reaches max, we immediately return 2^(remaining) subsets
  2. When even with all remaining numbers we can't reach max, we prune entire branch
- In practice, this runs efficiently for n ≤ 20

**Space Complexity:**

- O(n) for the recursion stack depth
- No additional data structures needed

## Common Mistakes

1. **Counting empty subset:** The problem asks for non-empty subsets. Starting bitmask from 0 instead of 1, or not handling the base case correctly in recursion, can include the empty subset.

2. **Not computing max OR correctly:** Some candidates try to find max OR by checking each subset's OR. Remember: max OR = OR of ALL elements because OR is monotonic (a|b ≥ a and a|b ≥ b).

3. **Double-counting subsets:** When using dynamic programming or memoization, ensure you're counting distinct subsets, not just distinct OR values. Different subsets can have the same OR.

4. **Missing the pruning optimization:** Without the "if current OR == max OR" optimization, the solution still works but is slower. This optimization cuts runtime significantly when many subsets reach max OR early.

## When You'll See This Pattern

This problem combines **subset enumeration** with **bitwise operations** and **pruning optimization**. You'll see similar patterns in:

1. **Subsets (LeetCode 78):** The classic subset generation problem. This problem extends it by adding a condition on the subset's OR value.

2. **Largest Combination With Bitwise AND Greater Than Zero (LeetCode 2275):** Also uses bitwise properties to optimize subset/counting problems. Instead of OR, it uses AND, but the bitwise analysis is similar.

3. **Partition to K Equal Sum Subsets (LeetCode 698):** Uses backtracking with pruning to count/determine subset partitions. The pruning strategies (checking if goal is reachable) are similar.

4. **Target Sum (LeetCode 494):** Another counting problem where you track a value (sum) and count subsets that reach a target.

## Key Takeaways

1. **Bitwise OR is monotonic:** The maximum OR is always the OR of all elements. This lets you compute the target value in O(n) instead of checking all subsets.

2. **Prune aggressively in backtracking:** When your current state already meets the target, you can often compute the remainder without further recursion (like 2^remaining subsets). When you can prove a branch can't succeed, prune it early.

3. **Combine enumeration with value tracking:** Many counting problems require tracking a value (sum, OR, AND, XOR) while enumerating subsets. The pattern is: compute target first, then count subsets reaching it with pruning.

Related problems: [Subsets](/problem/subsets), [Largest Combination With Bitwise AND Greater Than Zero](/problem/largest-combination-with-bitwise-and-greater-than-zero), [Longest Subarray With Maximum Bitwise AND](/problem/longest-subarray-with-maximum-bitwise-and)
