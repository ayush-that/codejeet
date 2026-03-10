---
title: "How to Solve Patching Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Patching Array. Hard difficulty, 54.1% acceptance rate. Topics: Array, Greedy."
date: "2026-04-04"
category: "dsa-patterns"
tags: ["patching-array", "array", "greedy", "hard"]
---

# How to Solve Patching Array

You're given a sorted array `nums` and a target `n`. You can add any numbers you want to the array (called "patching"), and your goal is to ensure that every integer from 1 to `n` can be formed as a sum of some subset of the array's elements. Return the minimum number of patches needed.

What makes this problem tricky is that it's not about finding specific sums—it's about systematically building coverage of all numbers from 1 to `n`. The optimal solution requires a greedy approach that might not be immediately obvious.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `nums = [1, 3]` and `n = 6`.

We want to cover all numbers 1 through 6 using sums of array elements. Initially, with just `[1, 3]`, what can we form?

- 1 = 1
- 2 = 1+1 (can't use same element twice, so actually can't form 2)
- 3 = 3
- 4 = 1+3
- 5 = ? (can't form)
- 6 = ? (can't form)

We're missing 2, 5, and 6. But here's the key insight: instead of checking each number individually, think about the _range_ of numbers we can currently form.

Let's walk through the greedy approach step by step:

**Step 1:** Start with `miss = 1` (the smallest number we need to cover). We can currently form all numbers in `[0, 0]` (just 0, which is the empty sum).

**Step 2:** Check the first element `nums[0] = 1`. Since `1 <= miss (1)`, we can extend our range. If we can form all numbers up to `miss-1`, adding `1` lets us form all numbers up to `miss + 1 - 1 = 1`. Actually, let's be more precise: if we can form all numbers in `[1, miss-1]`, adding `nums[i]` lets us form all numbers in `[1, miss-1 + nums[i]]`. So `miss` becomes `miss + nums[i] = 1 + 1 = 2`.

**Step 3:** Now `miss = 2`. Check next element `nums[1] = 3`. Since `3 > miss (2)`, we can't use it yet—we have a gap at 2. So we patch by adding `miss` itself (2) to the array. Now `miss` becomes `miss + miss = 2 + 2 = 4`. We've used 1 patch.

**Step 4:** Now `miss = 4`. We still have `nums[1] = 3` to process. Since `3 <= miss (4)`, we can use it. Adding 3 extends our range to `miss + 3 = 4 + 3 = 7`.

**Step 5:** Now `miss = 7`, which is greater than `n = 6`. We're done! We used 1 patch (the number 2).

Let's verify: With array `[1, 2, 3]`, we can form:

- 1 = 1
- 2 = 2
- 3 = 3
- 4 = 1+3
- 5 = 2+3
- 6 = 1+2+3

Perfect! All numbers 1-6 are covered.

## Brute Force Approach

A naive approach might try to simulate all possible patches. For each missing number, try adding it and see if coverage improves. But how do you check if all numbers 1 to n are covered? You'd need to check all subsets, which is exponential time.

Another brute force idea: generate all possible patch combinations of size k, check if they work, and find the smallest k. This is even worse—we'd need to consider all numbers from 1 to n as potential patches, leading to combinatorial explosion.

The fundamental issue with brute force is that checking whether a set of numbers can form all sums from 1 to n is itself a hard problem (related to the subset sum problem). We need a smarter way to track what's formable without explicitly checking every number.

## Optimized Approach

The key insight is this: **If you can form all numbers from 1 to `miss-1`, then adding a number `x <= miss` allows you to form all numbers up to `miss-1 + x`.**

Why? Because:

- You can already form 1 through `miss-1`
- By adding `x` to any of those sums, you can form `x+1` through `x+miss-1`
- Since `x <= miss`, these ranges connect seamlessly: `miss-1` connects to `x+1`

This leads to a greedy algorithm:

1. Initialize `miss = 1` (the first number we need to cover) and `patches = 0`
2. Iterate through `nums` while `miss <= n`:
   - If the current number `<= miss`, use it to extend our range: `miss += nums[i]`
   - Otherwise, we need to patch: add `miss` itself to the array (conceptually), increment `patches`, and set `miss += miss`
3. If we exhaust the array but still haven't reached `n`, keep patching until `miss > n`

This works because when we encounter a gap (a number we can't form), the most efficient patch is to add the smallest missing number itself. Adding a smaller number wouldn't help as much; adding a larger number would leave the gap unfilled.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m + log n) where m = len(nums) | Space: O(1)
def minPatches(nums, n):
    """
    Returns the minimum number of patches needed to ensure every number
    in [1, n] can be formed as a sum of some elements in nums.
    """
    patches = 0  # Count of patches added
    miss = 1     # Smallest number we currently CANNOT form
    i = 0        # Pointer to current element in nums

    # Continue until we can form all numbers up to n
    while miss <= n:
        # If current array element can help cover 'miss', use it
        if i < len(nums) and nums[i] <= miss:
            # By adding nums[i], we can now form all numbers up to miss + nums[i] - 1
            # Actually, we can form up to miss + nums[i] - 1, so next miss is miss + nums[i]
            miss += nums[i]
            i += 1
        else:
            # We have a gap at 'miss'. Patch by adding 'miss' itself
            # This is optimal because adding a smaller number wouldn't cover the gap,
            # and adding a larger number would be wasteful
            miss += miss
            patches += 1

    return patches
```

```javascript
// Time: O(m + log n) where m = nums.length | Space: O(1)
function minPatches(nums, n) {
  let patches = 0; // Count of patches added
  let miss = 1; // Smallest number we currently CANNOT form
  let i = 0; // Pointer to current element in nums

  // Continue until we can form all numbers up to n
  while (miss <= n) {
    // If current array element can help cover 'miss', use it
    if (i < nums.length && nums[i] <= miss) {
      // Extend the range of numbers we can form
      miss += nums[i];
      i++;
    } else {
      // We have a gap at 'miss'. Patch by adding 'miss' itself
      miss += miss;
      patches++;
    }
  }

  return patches;
}
```

```java
// Time: O(m + log n) where m = nums.length | Space: O(1)
class Solution {
    public int minPatches(int[] nums, int n) {
        int patches = 0;       // Count of patches added
        long miss = 1;         // Smallest number we currently CANNOT form
        int i = 0;             // Pointer to current element in nums

        // Continue until we can form all numbers up to n
        while (miss <= n) {
            // If current array element can help cover 'miss', use it
            if (i < nums.length && nums[i] <= miss) {
                // Extend the range of numbers we can form
                miss += nums[i];
                i++;
            } else {
                // We have a gap at 'miss'. Patch by adding 'miss' itself
                miss += miss;
                patches++;
            }
        }

        return patches;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + log n), where m is the length of `nums`. We iterate through the array once (O(m)), and each patch at least doubles `miss`, so we need at most O(log n) patches.

**Space Complexity:** O(1). We only use a few variables regardless of input size.

The logarithmic factor comes from the fact that when we patch, we add `miss` itself, which doubles `miss`. Doubling repeatedly is exponential growth, so we reach `n` in O(log n) steps after exhausting the array.

## Common Mistakes

1. **Using int instead of long for `miss` in Java/C++**: When `n` is large (up to 2³¹ - 1), `miss` can exceed 2³¹ - 1 during computation even though the result fits in an int. Always use 64-bit integers for `miss`.

2. **Not handling empty array correctly**: The algorithm handles this naturally—if `nums` is empty, we just keep patching with 1, 2, 4, 8,... until we reach `n`.

3. **Incorrect condition for using array elements**: The condition is `nums[i] <= miss`, not `<`. If `nums[i] == miss`, we can use it to exactly cover the gap and extend our range.

4. **Continuing past `n`**: The loop should stop when `miss > n`, not when `miss == n`. When `miss == n`, we still need to ensure we can form `n` itself.

## When You'll See This Pattern

This "range coverage" greedy pattern appears in problems where you need to build up coverage of a continuous range:

1. **Maximum Number of Consecutive Values You Can Make (LeetCode 1798)**: Almost identical problem—given coins, determine how many consecutive values starting from 1 you can make. The solution uses the same `miss` tracking approach.

2. **Minimum Number of Taps to Open to Water a Garden (LeetCode 1326)**: While not identical, it uses a similar "coverage" greedy approach where you track how far you can reach.

3. **Video Stitching (LeetCode 1024)**: Another coverage problem where you need to cover a time interval with video clips.

The core pattern: when you can cover [1, x], adding a new element y ≤ x+1 lets you cover [1, x+y]. The greedy choice is always to add the smallest missing number when you encounter a gap.

## Key Takeaways

1. **Think in terms of ranges, not individual numbers**: Instead of checking each number 1 through n, track the continuous range you can cover. This reduces exponential checking to linear tracking.

2. **When patching gaps, add the gap itself**: This is optimal because it fills the exact hole while maximizing extended coverage.

3. **Sorted input often enables greedy solutions**: The fact that `nums` is sorted lets us process elements in increasing order, ensuring we always use the smallest available number that can help.

Related problems: [Maximum Number of Consecutive Values You Can Make](/problem/maximum-number-of-consecutive-values-you-can-make)
