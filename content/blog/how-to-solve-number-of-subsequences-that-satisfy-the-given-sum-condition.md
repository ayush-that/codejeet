---
title: "How to Solve Number of Subsequences That Satisfy the Given Sum Condition — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Subsequences That Satisfy the Given Sum Condition. Medium difficulty, 49.3% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2028-05-15"
category: "dsa-patterns"
tags:
  [
    "number-of-subsequences-that-satisfy-the-given-sum-condition",
    "array",
    "two-pointers",
    "binary-search",
    "medium",
  ]
---

# How to Solve Number of Subsequences That Satisfy the Given Sum Condition

This problem asks us to count all non-empty subsequences of an array where the sum of the minimum and maximum elements in the subsequence is ≤ target. The challenge is that subsequences grow exponentially (2^n possibilities), so we need a smarter approach than brute force enumeration.

What makes this problem interesting is the clever insight that sorting transforms a complex combinatorial problem into a manageable two-pointer problem. Once sorted, we can fix boundaries and count valid subsequences efficiently using mathematical properties of subsequence selection.

## Visual Walkthrough

Let's walk through an example: `nums = [3, 5, 6, 7]` with `target = 9`.

**Step 1: Sort the array**
Sorted: `[3, 5, 6, 7]`

**Step 2: Use two pointers**
We'll use a left pointer at the smallest element and a right pointer at the largest element.

**Step 3: Check each left position**

- **Left = 0 (value = 3)**: Move right pointer leftward until `nums[left] + nums[right] ≤ target`
  - `3 + 7 = 10 > 9` → move right to index 2
  - `3 + 6 = 9 ≤ 9` → valid! Right stops at index 2

  For left=0 and right=2, all subsequences where 3 is the minimum and any elements between indices 0 and 2 (inclusive) can be the maximum:
  - Valid subsequences must include nums[0]=3 (the minimum)
  - Can include any subset of elements from indices 1 to 2 ([5, 6])
  - That's 2^(2-0) = 2^2 = 4 subsequences: `[3]`, `[3,5]`, `[3,6]`, `[3,5,6]`

  Wait, but `[3]` has min=3 and max=3, sum=6 ≤ 9, so it's valid too!

**Step 4: The key formula**
Actually, for fixed left and right where `nums[left] + nums[right] ≤ target`:

- We must include `nums[left]` (the minimum)
- We can choose any subset of elements between left+1 and right (inclusive)
- That gives us 2^(right-left) subsequences

For left=0, right=2: 2^(2-0) = 2^2 = 4 subsequences as calculated above.

**Step 5: Continue with next left**

- **Left = 1 (value = 5)**: Move right pointer (starting from previous position)
  - `5 + 6 = 11 > 9` → move right to index 1
  - `5 + 5 = 10 > 9` → no valid right position, break
- **Left = 2 (value = 6)**: `6 + 6 = 12 > 9` → no valid right

Total valid subsequences = 4.

## Brute Force Approach

The brute force solution would generate all 2^n - 1 non-empty subsequences (excluding the empty one), check the min+max for each, and count those satisfying the condition.

```python
def brute_force(nums, target):
    n = len(nums)
    count = 0

    # Generate all subsequences using bitmasks
    for mask in range(1, 1 << n):  # Skip 0 (empty subsequence)
        min_val = float('inf')
        max_val = float('-inf')

        # Extract elements from this subsequence
        for i in range(n):
            if mask & (1 << i):
                min_val = min(min_val, nums[i])
                max_val = max(max_val, nums[i])

        if min_val + max_val <= target:
            count += 1

    return count % (10**9 + 7)
```

**Why this fails:**

- Time complexity: O(2^n × n) - exponential time
- For n=1000, we'd need to check ~1.07e301 subsequences - impossibly large
- Even with optimizations, we can't handle the constraints (n up to 10^5)

The brute force approach teaches us that we need to avoid explicitly generating subsequences. We need to count them mathematically.

## Optimized Approach

The key insight comes from these observations:

1. **Sorting doesn't change the answer**: The condition depends only on min and max values, not on element positions. Sorting helps us reason about which elements can appear together.

2. **After sorting, for a fixed minimum element at index `left`**, we need to find the largest index `right` such that `nums[left] + nums[right] ≤ target`.

3. **For this pair (left, right)**, any subsequence that:
   - Includes `nums[left]` (to fix it as the minimum)
   - Includes any subset of elements between `left+1` and `right`

   Will have minimum = `nums[left]` and maximum ≤ `nums[right]`, so `min+max ≤ nums[left] + nums[right] ≤ target`.

4. **The count of such subsequences** is 2^(right-left), because:
   - We must include `nums[left]` (1 way)
   - For each of the (right-left) elements from `left+1` to `right`, we can either include it or not (2 choices each)
   - Total: 1 × 2^(right-left) = 2^(right-left)

5. **We need to compute 2^k efficiently** for large k, so we precompute powers of 2 modulo MOD.

The algorithm:

1. Sort the array
2. Precompute powers of 2 modulo MOD
3. Use two pointers: left from 0 to n-1, right starting at n-1 and moving leftward
4. For each left, find the rightmost element where sum ≤ target
5. Add 2^(right-left) to answer if right ≥ left
6. Return answer modulo MOD

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for precomputed powers, O(1) with optimization
def numSubseq(nums, target):
    MOD = 10**9 + 7
    n = len(nums)

    # Step 1: Sort the array
    nums.sort()

    # Step 2: Precompute powers of 2 modulo MOD
    # We need up to 2^(n-1), so compute all powers from 0 to n-1
    pow2 = [1] * n
    for i in range(1, n):
        pow2[i] = (pow2[i-1] * 2) % MOD

    # Step 3: Two pointers approach
    left, right = 0, n - 1
    count = 0

    while left <= right:
        # If sum of min (nums[left]) and max (nums[right]) is too large,
        # we need to decrease the maximum by moving right pointer left
        if nums[left] + nums[right] > target:
            right -= 1
        else:
            # For current left, all subsequences with nums[left] as minimum
            # and any elements up to nums[right] are valid
            # Number of such subsequences = 2^(right-left)
            count = (count + pow2[right - left]) % MOD

            # Move to next minimum element
            left += 1

    return count
```

```javascript
// Time: O(n log n) | Space: O(n) for precomputed powers
function numSubseq(nums, target) {
  const MOD = 10 ** 9 + 7;
  const n = nums.length;

  // Step 1: Sort the array
  nums.sort((a, b) => a - b);

  // Step 2: Precompute powers of 2 modulo MOD
  const pow2 = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % MOD;
  }

  // Step 3: Two pointers approach
  let left = 0,
    right = n - 1;
  let count = 0;

  while (left <= right) {
    // If sum is too large, decrease maximum by moving right pointer
    if (nums[left] + nums[right] > target) {
      right--;
    } else {
      // Valid pair found: add 2^(right-left) subsequences
      count = (count + pow2[right - left]) % MOD;

      // Try next minimum element
      left++;
    }
  }

  return count;
}
```

```java
// Time: O(n log n) | Space: O(n) for precomputed powers
class Solution {
    public int numSubseq(int[] nums, int target) {
        final int MOD = 1000000007;
        int n = nums.length;

        // Step 1: Sort the array
        Arrays.sort(nums);

        // Step 2: Precompute powers of 2 modulo MOD
        int[] pow2 = new int[n];
        pow2[0] = 1;
        for (int i = 1; i < n; i++) {
            pow2[i] = (pow2[i-1] * 2) % MOD;
        }

        // Step 3: Two pointers approach
        int left = 0, right = n - 1;
        int count = 0;

        while (left <= right) {
            // If sum is too large, decrease maximum
            if (nums[left] + nums[right] > target) {
                right--;
            } else {
                // Valid range found: add 2^(right-left) subsequences
                count = (count + pow2[right - left]) % MOD;

                // Move to next minimum
                left++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting: O(n log n) - dominates the time complexity
- Two-pointer traversal: O(n) - each pointer moves at most n times
- Power precomputation: O(n) - simple linear pass

**Space Complexity: O(n) or O(1)**

- O(n) for storing precomputed powers of 2 (as shown in the code)
- Can be optimized to O(1) by computing powers on the fly using binary exponentiation, though this adds O(log n) factor per computation
- Sorting typically uses O(log n) to O(n) space depending on implementation

The O(n log n) time is efficient for n up to 10^5, handling the worst-case constraints comfortably.

## Common Mistakes

1. **Forgetting to sort the array**: This is the crucial first step. Without sorting, the two-pointer approach doesn't work because we can't guarantee that moving the right pointer leftward decreases the maximum value.

2. **Off-by-one errors in the exponent calculation**: When left and right point to the same element, right-left = 0, and 2^0 = 1, which correctly counts the single-element subsequence `[nums[left]]`. Candidates sometimes mistakenly use `right-left+1` or other variations.

3. **Not handling the modulo operation correctly**:
   - Forgetting to apply modulo after each addition
   - Not using modulo when computing powers of 2
   - Integer overflow in languages like Java/C++ when computing 2^(n-1) for large n

4. **Incorrectly moving pointers**: Some candidates try to reset the right pointer to n-1 for each left position, which makes the algorithm O(n²) instead of O(n). The optimized version keeps moving right leftward since as left increases, the valid right can only decrease or stay the same.

5. **Missing the empty subsequence case**: The problem asks for non-empty subsequences, but our formula 2^(right-left) already excludes the empty case because we always include nums[left].

## When You'll See This Pattern

This "sort + two pointers + combinatorics" pattern appears in several LeetCode problems:

1. **Two Sum II - Input Array Is Sorted (Easy)**: Similar two-pointer approach after sorting, though simpler since we're looking for exact pairs rather than counting subsequences.

2. **3Sum (Medium)**: Extends the two-pointer technique to find triplets summing to zero after sorting.

3. **Number of Subarrays with Bounded Maximum (Medium)**: Uses similar combinatorial counting for valid subarrays based on maximum values.

4. **Count Number of Nice Subarrays (Medium)**: Uses sliding window with counting of subarrays satisfying a condition.

The core pattern is: when a problem involves pairs or groups of elements satisfying some condition based on their values (especially min/max/sum), sorting often helps, and two pointers can efficiently find valid combinations.

## Key Takeaways

1. **Sorting transforms combinatorial problems**: When a problem depends on element values rather than positions, sorting can reveal structure that makes counting tractable.

2. **Two pointers for efficient range finding**: After sorting, if you need to find pairs/groups where some function of endpoints satisfies a condition, two pointers moving inward is often O(n) instead of O(n²).

3. **Count combinatorially, don't enumerate**: When asked to count subsets/subsequences satisfying a condition, look for ways to compute the count mathematically (using powers of 2 for subsequences, simple multiplication for combinations) rather than generating them.

4. **Precompute for efficiency**: When you need many values of 2^k modulo M, precomputing them in O(n) time is better than computing each with binary exponentiation in O(log k) time.

Related problems: [Minimum Operations to Form Subsequence With Target Sum](/problem/minimum-operations-to-form-subsequence-with-target-sum), [Find the Sum of Subsequence Powers](/problem/find-the-sum-of-subsequence-powers), [Find the Sum of the Power of All Subsequences](/problem/find-the-sum-of-the-power-of-all-subsequences)
