---
title: "How to Solve Minimum Equal Sum of Two Arrays After Replacing Zeros — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Equal Sum of Two Arrays After Replacing Zeros. Medium difficulty, 50.2% acceptance rate. Topics: Array, Greedy."
date: "2026-10-13"
category: "dsa-patterns"
tags: ["minimum-equal-sum-of-two-arrays-after-replacing-zeros", "array", "greedy", "medium"]
---

# How to Solve Minimum Equal Sum of Two Arrays After Replacing Zeros

You're given two arrays of positive integers where zeros represent placeholders that must be replaced with positive integers. Your task is to replace all zeros in both arrays with positive integers so that the total sums of both arrays become equal, and you need to find the **minimum** possible equal sum. If it's impossible, return -1.

What makes this problem interesting is that zeros can be replaced with **any** positive integer (1, 2, 3, etc.), giving us flexibility to adjust sums, but we must find the minimum possible equal sum. The challenge lies in determining when replacement is possible and calculating that minimum value efficiently.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Example:** `nums1 = [3, 2, 0, 1, 0]`, `nums2 = [6, 5, 0, 0, 0, 4]`

**Step 1: Calculate current sums and count zeros**

- `nums1`: Sum = 3 + 2 + 0 + 1 + 0 = 6, Zeros = 2
- `nums2`: Sum = 6 + 5 + 0 + 0 + 0 + 4 = 15, Zeros = 3

**Step 2: Understand the replacement rules**
Each zero must be replaced with at least 1. So:

- Minimum possible sum for `nums1` = current sum (6) + zeros (2) = 8
- Minimum possible sum for `nums2` = current sum (15) + zeros (3) = 18

**Step 3: Check if equal sum is possible**
If we want both arrays to have sum S, then:

- `nums1` needs S - 6 additional points spread across 2 zeros
- `nums2` needs S - 15 additional points spread across 3 zeros

Since each zero can take any positive integer value, we just need S to be at least the minimum possible sum for each array. So S must be ≥ max(8, 18) = 18.

**Step 4: Find the minimum equal sum**
We need the smallest S ≥ 18 that works for both arrays. Let's check:

- For `nums1`: S = 18 means we need 12 additional points (18 - 6) for 2 zeros. Can we distribute 12 across 2 positive integers? Yes! (e.g., 6 and 6)
- For `nums2`: S = 18 means we need 3 additional points (18 - 15) for 3 zeros. Can we distribute 3 across 3 positive integers? Yes! (1, 1, 1)

So minimum equal sum = 18.

**Key insight:** The minimum equal sum is simply the maximum of the two minimum possible sums, provided that when one array has no zeros, we can only match its exact sum if the other array can reach it.

## Brute Force Approach

A naive approach would try all possible replacements for zeros, but that's infeasible. Even if we realize we just need to find some sum S, trying all possible S values would be inefficient.

What a candidate might initially try:

1. Calculate minimum possible sums for both arrays (sum + zero count)
2. Start from the maximum of these two values
3. Check if both arrays can reach that sum
4. Increment until we find a working sum

While this logic is correct, implementing the check "can this array reach sum S?" requires careful thought. The brute force version would unnecessarily try many S values when we can compute the answer directly.

## Optimized Approach

The key insight is that we can compute the answer directly without searching:

Let:

- `sum1` = sum of `nums1`, `zero1` = count of zeros in `nums1`
- `sum2` = sum of `nums2`, `zero2` = count of zeros in `nums2`

**Minimum possible sum for each array:**

- `min1 = sum1 + zero1` (replace each zero with 1)
- `min2 = sum2 + zero2`

**Case Analysis:**

1. **If both arrays have zeros:** The minimum equal sum is `max(min1, min2)`. Why? Because we can always add more to the zeros in the array with smaller minimum sum to match the larger one.

2. **If one array has no zeros:**
   - Suppose `zero1 = 0` but `zero2 > 0`. Then `nums1` has fixed sum `sum1`.
   - For equality, we need `sum1 ≥ min2` (so `nums2` can reach `sum1` by putting 1s in its zeros)
   - If `sum1 ≥ min2`, answer is `sum1` (can't make `nums1` smaller since it has no zeros)
   - If `sum1 < min2`, impossible (can't make `nums2` smaller than its minimum)

3. **If both arrays have no zeros:** They must already have equal sums, otherwise impossible.

This gives us an O(n) solution with simple calculations.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums1), m = len(nums2)
# Space: O(1) - only using a few variables
def minSum(nums1, nums2):
    # Step 1: Calculate sums and zero counts for both arrays
    sum1, zero1 = 0, 0
    for num in nums1:
        sum1 += num
        if num == 0:
            zero1 += 1

    sum2, zero2 = 0, 0
    for num in nums2:
        sum2 += num
        if num == 0:
            zero2 += 1

    # Step 2: Calculate minimum possible sum for each array
    # Minimum sum occurs when all zeros are replaced with 1
    min1 = sum1 + zero1
    min2 = sum2 + zero2

    # Step 3: Handle cases based on zero counts
    if zero1 == 0 and zero2 == 0:
        # Both arrays have no zeros - sums must already be equal
        return sum1 if sum1 == sum2 else -1
    elif zero1 == 0:
        # Only nums1 has no zeros - nums2 must be able to reach sum1
        return sum1 if sum1 >= min2 else -1
    elif zero2 == 0:
        # Only nums2 has no zeros - nums1 must be able to reach sum2
        return sum2 if sum2 >= min1 else -1
    else:
        # Both arrays have zeros - answer is max of minimum possible sums
        return max(min1, min2)
```

```javascript
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(1) - only using a few variables
function minSum(nums1, nums2) {
  // Step 1: Calculate sums and zero counts for both arrays
  let sum1 = 0,
    zero1 = 0;
  for (let num of nums1) {
    sum1 += num;
    if (num === 0) zero1++;
  }

  let sum2 = 0,
    zero2 = 0;
  for (let num of nums2) {
    sum2 += num;
    if (num === 0) zero2++;
  }

  // Step 2: Calculate minimum possible sum for each array
  // Minimum sum occurs when all zeros are replaced with 1
  const min1 = sum1 + zero1;
  const min2 = sum2 + zero2;

  // Step 3: Handle cases based on zero counts
  if (zero1 === 0 && zero2 === 0) {
    // Both arrays have no zeros - sums must already be equal
    return sum1 === sum2 ? sum1 : -1;
  } else if (zero1 === 0) {
    // Only nums1 has no zeros - nums2 must be able to reach sum1
    return sum1 >= min2 ? sum1 : -1;
  } else if (zero2 === 0) {
    // Only nums2 has no zeros - nums1 must be able to reach sum2
    return sum2 >= min1 ? sum2 : -1;
  } else {
    // Both arrays have zeros - answer is max of minimum possible sums
    return Math.max(min1, min2);
  }
}
```

```java
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(1) - only using a few variables
class Solution {
    public long minSum(int[] nums1, int[] nums2) {
        // Step 1: Calculate sums and zero counts for both arrays
        long sum1 = 0;
        int zero1 = 0;
        for (int num : nums1) {
            sum1 += num;
            if (num == 0) zero1++;
        }

        long sum2 = 0;
        int zero2 = 0;
        for (int num : nums2) {
            sum2 += num;
            if (num == 0) zero2++;
        }

        // Step 2: Calculate minimum possible sum for each array
        // Minimum sum occurs when all zeros are replaced with 1
        long min1 = sum1 + zero1;
        long min2 = sum2 + zero2;

        // Step 3: Handle cases based on zero counts
        if (zero1 == 0 && zero2 == 0) {
            // Both arrays have no zeros - sums must already be equal
            return sum1 == sum2 ? sum1 : -1;
        } else if (zero1 == 0) {
            // Only nums1 has no zeros - nums2 must be able to reach sum1
            return sum1 >= min2 ? sum1 : -1;
        } else if (zero2 == 0) {
            // Only nums2 has no zeros - nums1 must be able to reach sum2
            return sum2 >= min1 ? sum2 : -1;
        } else {
            // Both arrays have zeros - answer is max of minimum possible sums
            return Math.max(min1, min2);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m) where n is the length of `nums1` and m is the length of `nums2`. We make two passes: one through each array to calculate the sum and count zeros.

**Space Complexity:** O(1). We only use a constant amount of extra space for variables storing sums, zero counts, and minimum sums.

The efficiency comes from realizing we don't need to actually try different replacements or search for the optimal sum - we can compute it directly through case analysis.

## Common Mistakes

1. **Forgetting that zeros must be replaced with positive integers:** Some candidates mistakenly think zeros can be replaced with 0 or think they can leave zeros as is. Remember: "strictly positive integers" means ≥ 1.

2. **Incorrect handling of the no-zeros case:** When an array has no zeros, its sum is fixed. The common mistake is trying to adjust it or returning the maximum of minimum sums without checking if the other array can reach that fixed sum.

3. **Integer overflow:** With large arrays, sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, normal ints are fine in Python).

4. **Overcomplicating with binary search:** Some candidates try binary search for the optimal sum, which is unnecessary. The direct calculation approach is simpler and more efficient.

## When You'll See This Pattern

This problem combines **greedy reasoning** with **case analysis** - patterns common in many coding problems:

1. **Minimum Moves to Equal Array Elements (LeetCode 453):** Similar greedy approach to find minimum operations to make arrays equal.

2. **Minimum Operations to Make Array Equal (LeetCode 1551):** Another problem where you calculate the minimum operations needed based on the array's current state.

3. **Watering Plants (LeetCode 2079):** While different in domain, it uses similar case-based reasoning about resource constraints.

The core pattern is: when you need to make two things equal with constraints on adjustments, calculate the minimum possible state for each, then find the meeting point.

## Key Takeaways

1. **Break problems into cases:** This problem has three clear cases (both have zeros, one has zeros, neither has zeros). Identifying and handling each separately simplifies the logic.

2. **Look for direct computation over search:** Many problems appear to require searching, but with careful analysis, you can often derive a formula. Always ask: "Can I calculate this directly?"

3. **Pay attention to constraints wording:** "Strictly positive" vs "non-negative" makes a big difference. Always read constraints carefully before designing your solution.

[Practice this problem on CodeJeet](/problem/minimum-equal-sum-of-two-arrays-after-replacing-zeros)
