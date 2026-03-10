---
title: "How to Solve Count Partitions with Even Sum Difference — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Partitions with Even Sum Difference. Easy difficulty, 85.2% acceptance rate. Topics: Array, Math, Prefix Sum."
date: "2026-05-30"
category: "dsa-patterns"
tags: ["count-partitions-with-even-sum-difference", "array", "math", "prefix-sum", "easy"]
---

# How to Solve Count Partitions with Even Sum Difference

This problem asks us to count how many ways we can split an array into two non-empty parts where the difference between the sums of the left and right parts is even. While the problem seems straightforward, the key insight is recognizing that we don't actually need to calculate both sums at every split point. The "even difference" condition has a mathematical property that lets us optimize significantly.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 2, 3, 4, 5]`

We need to check each possible split point `i` from 0 to 3 (since both parts must be non-empty):

**Total sum of entire array = 15**

**Split at i = 0:**

- Left sum = 1, Right sum = 2+3+4+5 = 14
- Difference = |1 - 14| = 13 (odd) ❌

**Split at i = 1:**

- Left sum = 1+2 = 3, Right sum = 3+4+5 = 12
- Difference = |3 - 12| = 9 (odd) ❌

**Split at i = 2:**

- Left sum = 1+2+3 = 6, Right sum = 4+5 = 9
- Difference = |6 - 9| = 3 (odd) ❌

**Split at i = 3:**

- Left sum = 1+2+3+4 = 10, Right sum = 5
- Difference = |10 - 5| = 5 (odd) ❌

Result: 0 partitions with even sum difference.

Now let's try `nums = [2, 4, 6, 8]`:

**Total sum = 20**

**Split at i = 0:**

- Left sum = 2, Right sum = 4+6+8 = 18
- Difference = |2 - 18| = 16 (even) ✅

**Split at i = 1:**

- Left sum = 2+4 = 6, Right sum = 6+8 = 14
- Difference = |6 - 14| = 8 (even) ✅

**Split at i = 2:**

- Left sum = 2+4+6 = 12, Right sum = 8
- Difference = |12 - 8| = 4 (even) ✅

Result: 3 partitions with even sum difference.

Notice a pattern? The difference is even when both sums have the same parity (both even or both odd). This leads to our key insight: `(left_sum - right_sum) % 2 == 0` if and only if `left_sum % 2 == right_sum % 2`.

## Brute Force Approach

The most straightforward approach is to check every possible split point, calculate both sums, and check if their difference is even:

1. For each index `i` from 0 to n-2:
   - Calculate left sum = sum of elements from index 0 to i
   - Calculate right sum = sum of elements from index i+1 to n-1
   - Check if `|left_sum - right_sum| % 2 == 0`

This approach has O(n²) time complexity because for each of O(n) split points, we calculate two sums that each take O(n) time in the worst case. With n up to 100,000 (typical LeetCode constraints), this would be far too slow.

## Optimal Solution

The key optimization comes from two observations:

1. We don't need to calculate both sums from scratch each time
2. The parity (even/odd) of the difference depends only on the parity of the sums

Let `total_sum` be the sum of all elements. For a split at index `i`:

- `left_sum` = sum of first i+1 elements
- `right_sum` = `total_sum - left_sum`
- Difference parity = `(left_sum - right_sum) % 2` = `(2*left_sum - total_sum) % 2`

Since `2*left_sum` is always even, the parity of the difference depends only on the parity of `total_sum`! Wait, that can't be right... Let's check the math more carefully:

```
difference = left_sum - right_sum
           = left_sum - (total_sum - left_sum)
           = 2*left_sum - total_sum
```

Now, `(2*left_sum - total_sum) % 2` = `(-total_sum) % 2` because `2*left_sum % 2 = 0`.

So the difference is even if and only if `total_sum % 2 == 0`! This means either ALL splits have even difference or NONE do, depending only on whether the total sum is even.

Actually, let's test this with our examples:

- `[1,2,3,4,5]`: total_sum = 15 (odd) → 0 even differences ✓
- `[2,4,6,8]`: total_sum = 20 (even) → all 3 splits have even differences ✓

But wait, we need to be careful. The problem asks for the **number** of partitions with even sum difference. If total_sum is even, ALL n-1 possible splits qualify. If total_sum is odd, NONE qualify.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countPartitions(nums):
    """
    Count partitions where difference between left and right sums is even.

    Key insight: For a split at index i:
    difference = left_sum - right_sum
               = left_sum - (total_sum - left_sum)
               = 2*left_sum - total_sum

    difference % 2 = (2*left_sum - total_sum) % 2
                   = (-total_sum) % 2  (since 2*left_sum % 2 = 0)

    So difference is even if and only if total_sum is even!
    This means ALL valid splits have even difference when total_sum is even,
    and NONE have even difference when total_sum is odd.
    """
    n = len(nums)

    # Calculate total sum
    total_sum = 0
    for num in nums:
        total_sum += num

    # If total sum is odd, no partitions have even difference
    if total_sum % 2 == 1:
        return 0

    # If total sum is even, all n-1 possible partitions work
    # (n-1 because we need both parts non-empty)
    return n - 1
```

```javascript
// Time: O(n) | Space: O(1)
function countPartitions(nums) {
  /**
   * Count partitions where difference between left and right sums is even.
   *
   * Mathematical insight:
   * difference = left_sum - right_sum
   *            = left_sum - (total_sum - left_sum)
   *            = 2*left_sum - total_sum
   *
   * difference % 2 = (2*left_sum - total_sum) % 2
   *                = (-total_sum) % 2
   *
   * So the parity of the difference depends ONLY on total_sum!
   */

  const n = nums.length;

  // Calculate total sum
  let totalSum = 0;
  for (let i = 0; i < n; i++) {
    totalSum += nums[i];
  }

  // If total sum is odd, no valid partitions
  if (totalSum % 2 === 1) {
    return 0;
  }

  // If total sum is even, all n-1 partitions are valid
  return n - 1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countPartitions(int[] nums) {
        /**
         * Count partitions with even sum difference.
         *
         * Mathematical derivation:
         * Let total = sum of all elements
         * For split at index i:
         * left = sum(nums[0..i])
         * right = total - left
         * diff = left - right = 2*left - total
         *
         * diff % 2 = (2*left - total) % 2
         *          = (-total) % 2  (since 2*left is always even)
         *
         * Therefore, diff is even iff total is even.
         */

        int n = nums.length;

        // Calculate total sum
        int total = 0;
        for (int num : nums) {
            total += num;
        }

        // Check parity of total sum
        if (total % 2 == 1) {
            return 0;  // Odd total means no even differences
        }

        // Even total means all n-1 partitions work
        return n - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We need to calculate the total sum of all elements, which requires a single pass through the array
- The parity check and return statement are O(1) operations
- No nested loops or expensive operations

**Space Complexity: O(1)**

- We only use a few integer variables (total_sum, n, loop counter)
- No additional data structures that grow with input size
- The input array is given and doesn't count toward our space usage

## Common Mistakes

1. **Overcomplicating with prefix sums**: Some candidates might create a prefix sum array to efficiently calculate left sums, but this is unnecessary. The mathematical insight shows we only need the total sum's parity.

2. **Off-by-one errors in counting partitions**: Remember there are `n-1` possible splits, not `n`. A split at index `i` means left part is `[0..i]` and right part is `[i+1..n-1]`. The last valid `i` is `n-2`.

3. **Forgetting the non-empty constraint**: The problem states both parts must be non-empty, which is why we have `n-1` partitions, not `n+1` (which would include empty left or right parts).

4. **Incorrect parity logic**: Some might try to check if `(left_sum % 2) == (right_sum % 2)` without realizing this simplifies to checking `total_sum % 2 == 0`. While functionally equivalent, the direct total sum check is simpler.

## When You'll See This Pattern

This problem teaches the important skill of looking for mathematical simplifications before jumping to implementation. Similar patterns appear in:

1. **Partition Array Into Three Parts With Equal Sum (LeetCode 1013)**: Also uses prefix sums and looks for specific sum relationships, though it's more complex.

2. **Find Pivot Index (LeetCode 724)**: Finding an index where left sum equals right sum uses similar prefix sum thinking.

3. **Subarray Sum Equals K (LeetCode 560)**: While more complex, it also involves reasoning about sums and differences in clever ways.

The core pattern is recognizing when a problem that seems to require checking many possibilities can be simplified through mathematical reasoning about the constraints.

## Key Takeaways

1. **Always look for mathematical simplifications**: Before implementing, ask if there's a property or formula that reduces the problem. Here, the parity relationship turned an O(n²) problem into O(n).

2. **Parity (even/odd) reasoning is powerful**: Many array problems become simpler when you consider only whether numbers are even or odd, not their exact values.

3. **Test your derivation with examples**: Our mathematical conclusion seemed surprising (all or nothing), but testing with examples confirmed it was correct.

[Practice this problem on CodeJeet](/problem/count-partitions-with-even-sum-difference)
