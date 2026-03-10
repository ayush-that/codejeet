---
title: "How to Solve Count Subarrays of Length Three With a Condition — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Subarrays of Length Three With a Condition. Easy difficulty, 61.5% acceptance rate. Topics: Array."
date: "2026-09-09"
category: "dsa-patterns"
tags: ["count-subarrays-of-length-three-with-a-condition", "array", "easy"]
---

# How to Solve Count Subarrays of Length Three With a Condition

This problem asks us to count how many contiguous subarrays of length 3 in an integer array satisfy a specific condition: the sum of the first and third elements must equal exactly half of the middle element. While the problem seems straightforward, it's interesting because it requires careful attention to integer division and boundary conditions when checking subarrays. The main challenge is ensuring we correctly handle the mathematical condition while efficiently iterating through all possible length-3 subarrays.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 4, 2, 6, 3, 8]`.

We need to check every contiguous subarray of length 3:

1. **Subarray [1, 4, 2]**: First = 1, Middle = 4, Third = 2
   - Condition: First + Third = Middle / 2
   - Check: 1 + 2 = 3, Middle / 2 = 4 / 2 = 2
   - 3 ≠ 2 → **Does NOT satisfy**

2. **Subarray [4, 2, 6]**: First = 4, Middle = 2, Third = 6
   - Check: 4 + 6 = 10, Middle / 2 = 2 / 2 = 1
   - 10 ≠ 1 → **Does NOT satisfy**

3. **Subarray [2, 6, 3]**: First = 2, Middle = 6, Third = 3
   - Check: 2 + 3 = 5, Middle / 2 = 6 / 2 = 3
   - 5 ≠ 3 → **Does NOT satisfy**

4. **Subarray [6, 3, 8]**: First = 6, Middle = 3, Third = 8
   - Check: 6 + 8 = 14, Middle / 2 = 3 / 2 = 1 (integer division!)
   - 14 ≠ 1 → **Does NOT satisfy**

Wait, let's try another example where we actually find matches: `nums = [2, 4, 2, 6, 3, 6]`

1. **[2, 4, 2]**: 2 + 2 = 4, 4 / 2 = 2 → 4 ≠ 2 ❌
2. **[4, 2, 6]**: 4 + 6 = 10, 2 / 2 = 1 → 10 ≠ 1 ❌
3. **[2, 6, 3]**: 2 + 3 = 5, 6 / 2 = 3 → 5 ≠ 3 ❌
4. **[6, 3, 6]**: 6 + 6 = 12, 3 / 2 = 1 → 12 ≠ 1 ❌

Hmm, let's create an example that actually works: `nums = [1, 4, 1, 2, 8, 2]`

1. **[1, 4, 1]**: 1 + 1 = 2, 4 / 2 = 2 → 2 = 2 ✅ **COUNT = 1**
2. **[4, 1, 2]**: 4 + 2 = 6, 1 / 2 = 0 → 6 ≠ 0 ❌
3. **[1, 2, 8]**: 1 + 8 = 9, 2 / 2 = 1 → 9 ≠ 1 ❌
4. **[2, 8, 2]**: 2 + 2 = 4, 8 / 2 = 4 → 4 = 4 ✅ **COUNT = 2**

The key insight is that we need to check every possible starting index `i` from 0 to `n-3`, where `n` is the length of the array. For each starting index, we examine the three elements at positions `i`, `i+1`, and `i+2`.

## Brute Force Approach

The most straightforward approach is to iterate through all possible starting positions for length-3 subarrays and check the condition for each one. This is essentially what we did in the visual walkthrough.

**Why this is sufficient:** Since we're only dealing with subarrays of fixed length 3, there are exactly `n-2` possible subarrays to check (where `n` is the array length). For each subarray, we perform a constant-time check of the mathematical condition.

**Why there's no need for optimization:** Unlike problems where we need to find subarrays of arbitrary length or optimize using sliding windows or prefix sums, this problem has a fixed subarray length. The brute force approach already runs in O(n) time with O(1) space, which is optimal.

However, let's consider what a naive candidate might get wrong:

1. They might try to use nested loops to generate all subarrays, not realizing that with fixed length 3, a single loop suffices.
2. They might forget about integer division when checking the condition.
3. They might have off-by-one errors in the loop bounds.

The brute force approach is actually the optimal solution here because we must examine every length-3 subarray, and there's no way to skip any of them while still guaranteeing correctness.

## Optimal Solution

Since the brute force approach is already optimal for this problem, here's the complete implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def count_subarrays(nums):
    """
    Counts the number of subarrays of length 3 where:
    first + third == middle / 2

    Args:
        nums: List of integers

    Returns:
        Integer count of valid subarrays
    """
    n = len(nums)
    count = 0

    # We need at least 3 elements to form a subarray of length 3
    if n < 3:
        return 0

    # Iterate through all possible starting positions for length-3 subarrays
    # The last starting position is n-3, since we need i, i+1, i+2 to be valid indices
    for i in range(n - 2):
        first = nums[i]
        middle = nums[i + 1]
        third = nums[i + 2]

        # Check the condition: first + third == middle / 2
        # Note: In Python, // performs integer division (floor division)
        # We need to check if middle is divisible by 2 first, or use multiplication
        # to avoid floating point operations: first + third == middle // 2
        # But careful: middle // 2 does integer division, which matches the problem's
        # requirement of "exactly half" (implying integer division when middle is odd)
        if first + third == middle // 2:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countSubarrays(nums) {
  /**
   * Counts the number of subarrays of length 3 where:
   * first + third == middle / 2
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Count of valid subarrays
   */
  const n = nums.length;
  let count = 0;

  // We need at least 3 elements to form a subarray of length 3
  if (n < 3) {
    return 0;
  }

  // Iterate through all possible starting positions for length-3 subarrays
  // The last starting position is n-3, since we need i, i+1, i+2 to be valid indices
  for (let i = 0; i <= n - 3; i++) {
    const first = nums[i];
    const middle = nums[i + 1];
    const third = nums[i + 2];

    // Check the condition: first + third == middle / 2
    // In JavaScript, we need to use Math.floor for integer division
    // or multiply both sides by 2 to avoid floating point issues
    if (first + third === Math.floor(middle / 2)) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countSubarrays(int[] nums) {
        /**
         * Counts the number of subarrays of length 3 where:
         * first + third == middle / 2
         *
         * @param nums Array of integers
         * @return Count of valid subarrays
         */
        int n = nums.length;
        int count = 0;

        // We need at least 3 elements to form a subarray of length 3
        if (n < 3) {
            return 0;
        }

        // Iterate through all possible starting positions for length-3 subarrays
        // The last starting position is n-3, since we need i, i+1, i+2 to be valid indices
        for (int i = 0; i <= n - 3; i++) {
            int first = nums[i];
            int middle = nums[i + 1];
            int third = nums[i + 2];

            // Check the condition: first + third == middle / 2
            // In Java, integer division automatically truncates toward zero
            // which matches the problem's requirement
            if (first + third == middle / 2) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, checking each possible starting position for a length-3 subarray.
- There are exactly `n-2` such positions (where `n` is the array length).
- For each position, we perform a constant-time check of the mathematical condition.
- Therefore, the time complexity is O(n).

**Space Complexity: O(1)**

- We only use a fixed amount of extra space: variables for counting, indices, and temporary values for the three elements.
- No additional data structures that grow with input size are used.
- Therefore, the space complexity is O(1).

## Common Mistakes

1. **Off-by-one errors in loop bounds**: The most common mistake is incorrectly setting the loop termination condition. If you use `i < n` instead of `i <= n-3` or `i < n-2`, you'll either miss the last subarray or go out of bounds when accessing `nums[i+2]`. Remember: the last valid starting index is `n-3` because you need indices `i`, `i+1`, and `i+2` to all be within bounds.

2. **Incorrect handling of integer division**: The problem says "exactly half of the second number." When the middle number is odd, `middle / 2` in many languages produces a floating-point number. However, since we're comparing with an integer sum (`first + third`), we need to use integer division. For example, if `middle = 3`, then `middle / 2 = 1` (not 1.5) in integer division. Candidates who use floating-point division might get incorrect results due to precision issues.

3. **Forgetting the edge case for small arrays**: When the array has fewer than 3 elements, there are no subarrays of length 3 to check. Always handle this case at the beginning of your function to avoid index errors or incorrect counts.

4. **Misunderstanding the condition**: Some candidates might misinterpret the condition as `(first + third) * 2 == middle` instead of `first + third == middle / 2`. While mathematically equivalent for even numbers, they differ for odd numbers due to integer division. The problem statement explicitly says "exactly half," which implies integer division when the middle number is odd.

## When You'll See This Pattern

This problem uses a **fixed-length sliding window** pattern, where we examine all contiguous subarrays of a specific length. While simple in this case (window size = 3), this pattern appears in many other problems:

1. **Maximum Average Subarray I (LeetCode 643)**: Find a contiguous subarray of length k with the maximum average value. The solution uses a sliding window of fixed size k.

2. **Find All K-Distant Indices in an Array (LeetCode 2200)**: Similar fixed-window scanning approach.

3. **Grumpy Bookstore Owner (LeetCode 1052)**: Uses a sliding window of fixed size to maximize customer satisfaction.

The key insight is that when dealing with fixed-length subarrays, you don't need nested loops. A single loop that slides the window one position at a time is sufficient and optimal.

## Key Takeaways

1. **Fixed-length subarray problems often have O(n) solutions**: When you need to examine all subarrays of a fixed length k, you can use a single loop that iterates through starting positions from 0 to n-k. This gives O(n) time complexity instead of the O(n²) you might get with nested loops for variable-length subarrays.

2. **Pay attention to integer vs. floating-point division**: In coding interviews and competitive programming, integer division (which truncates toward zero) is often implied when problems talk about "half" or other fractions in the context of integer arrays. Always clarify this with your interviewer if unsure.

3. **Boundary conditions matter**: The difference between `i < n-2` and `i <= n-3` might seem minor, but it's the difference between a correct solution and an out-of-bounds error. Always test your loop bounds with small examples (n=3, n=4) to verify they're correct.

[Practice this problem on CodeJeet](/problem/count-subarrays-of-length-three-with-a-condition)
