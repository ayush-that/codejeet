---
title: "How to Solve Greatest Sum Divisible by Three — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Greatest Sum Divisible by Three. Medium difficulty, 57.1% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Sorting."
date: "2026-07-12"
category: "dsa-patterns"
tags: ["greatest-sum-divisible-by-three", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Greatest Sum Divisible by Three

You're given an array of integers and need to find the maximum possible sum of elements where that sum is divisible by three. The challenge is that you can't just take all elements - you need to strategically exclude some elements to make the sum divisible by three while losing as little total value as possible. This problem is interesting because it looks like a subset sum problem but has a clever mathematical optimization.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 6, 5, 1, 8]`

**Step 1:** Calculate total sum = 3 + 6 + 5 + 1 + 8 = 23  
**Step 2:** 23 % 3 = 2 (remainder is 2, not divisible by 3)  
**Step 3:** To make the sum divisible by 3, we need to remove some elements whose total value has remainder 2 when divided by 3.  
**Step 4:** Elements with remainder 1 when divided by 3: [1]  
Elements with remainder 2 when divided by 3: [5, 8]  
**Step 5:** Options to fix remainder 2:

- Remove one element with remainder 2: smallest is 5 → sum = 23 - 5 = 18 ✓
- Remove two elements with remainder 1: smallest two would be [1] but we only have one → not possible
  **Step 6:** Check if we can do better: What if we remove elements totaling remainder 2 in a different way?  
  Actually, 23 - 8 = 15 (also divisible by 3) but 15 < 18, so 18 is better.

But wait! Let's think more carefully. What if we take [3, 6, 1, 8]? Sum = 18 ✓  
What about [3, 6, 5, 1]? Sum = 15 ✓  
What about [6, 5, 1, 8]? Sum = 20 (20 % 3 = 2) ✗

The maximum is indeed 18. The key insight: when the total sum has remainder `r`, we need to remove the smallest combination of elements whose sum of remainders equals `r` modulo 3.

## Brute Force Approach

The brute force approach would try all possible subsets of the array, calculate each subset's sum, check if it's divisible by 3, and track the maximum. For an array of size `n`, there are `2^n` possible subsets, making this approach exponential time.

```python
# Brute force - too slow for large inputs
def maxSumDivThree(nums):
    max_sum = 0
    n = len(nums)

    # Try all subsets using bitmask
    for mask in range(1 << n):
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]

        if current_sum % 3 == 0:
            max_sum = max(max_sum, current_sum)

    return max_sum
```

This approach is O(2^n \* n) time complexity, which is completely impractical for arrays with more than about 20 elements. We need a smarter approach.

## Optimized Approach

The key mathematical insight: The remainder when dividing a sum by 3 is equal to the sum of the remainders of individual elements modulo 3. So we can categorize numbers by their remainder when divided by 3:

- Remainder 0: These are already divisible by 3, so we always want to include them
- Remainder 1: These contribute 1 to the total remainder
- Remainder 2: These contribute 2 to the total remainder

**Step-by-step reasoning:**

1. Calculate total sum of all elements
2. If total sum % 3 == 0, we're done - return total sum
3. If total sum % 3 == 1, we need to remove elements whose remainders sum to 1 modulo 3:
   - Option A: Remove the smallest element with remainder 1
   - Option B: Remove the two smallest elements with remainder 2
   - Choose the option that removes the least total value
4. If total sum % 3 == 2, we need to remove elements whose remainders sum to 2 modulo 3:
   - Option A: Remove the smallest element with remainder 2
   - Option B: Remove the two smallest elements with remainder 1
   - Choose the option that removes the least total value

**Why this works:** By keeping track of the smallest elements in each remainder category, we can efficiently find the minimum value to remove to make the sum divisible by 3. This is essentially a greedy approach that works because we're always removing the smallest possible values.

## Optimal Solution

The optimal solution uses dynamic programming to track the maximum sum achievable for each possible remainder (0, 1, 2). For each number, we update what sums we can achieve by either including or excluding that number.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxSumDivThree(nums):
    # dp[r] stores the maximum sum with remainder r when divided by 3
    # Initialize with 0 for remainder 0, and -inf for others
    dp = [0, float('-inf'), float('-inf')]

    for num in nums:
        # Create a copy of dp to avoid using updated values in the same iteration
        new_dp = dp[:]

        for remainder in range(3):
            # Try adding current number to each existing sum
            new_remainder = (remainder + num) % 3
            # We can either keep the current value for new_remainder,
            # or update it with dp[remainder] + num if that's larger
            # But only if dp[remainder] is valid (not -inf)
            if dp[remainder] != float('-inf'):
                new_dp[new_remainder] = max(new_dp[new_remainder], dp[remainder] + num)

        dp = new_dp

    # Return maximum sum with remainder 0
    return dp[0]
```

```javascript
// Time: O(n) | Space: O(1)
function maxSumDivThree(nums) {
  // dp[r] stores the maximum sum with remainder r when divided by 3
  // Initialize: remainder 0 can be 0, others start at -Infinity
  let dp = [0, -Infinity, -Infinity];

  for (let num of nums) {
    // Create a copy to avoid using updated values in same iteration
    let newDp = [...dp];

    for (let remainder = 0; remainder < 3; remainder++) {
      // Only proceed if we have a valid sum for this remainder
      if (dp[remainder] !== -Infinity) {
        const newRemainder = (remainder + num) % 3;
        // Update the maximum sum for the new remainder
        newDp[newRemainder] = Math.max(newDp[newRemainder], dp[remainder] + num);
      }
    }

    dp = newDp;
  }

  // Return the maximum sum with remainder 0
  return dp[0];
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxSumDivThree(int[] nums) {
        // dp[r] stores maximum sum with remainder r (0, 1, or 2)
        // Initialize dp[0] = 0, others to a very small number
        int[] dp = new int[3];
        dp[1] = dp[2] = Integer.MIN_VALUE;

        for (int num : nums) {
            // Store current dp values to avoid using updated ones
            int[] newDp = dp.clone();

            for (int remainder = 0; remainder < 3; remainder++) {
                // Only update if current remainder state is reachable
                if (dp[remainder] != Integer.MIN_VALUE) {
                    int newRemainder = (remainder + num) % 3;
                    // Update maximum sum for the new remainder
                    newDp[newRemainder] = Math.max(newDp[newRemainder], dp[remainder] + num);
                }
            }

            dp = newDp;
        }

        // Return maximum sum with remainder 0
        return dp[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We iterate through the array once (`n` elements), and for each element, we iterate through 3 possible remainders. So total operations = n × 3 = O(n).

**Space Complexity:** O(1)  
We only store 3 values in the dp array regardless of input size. The space used is constant.

## Common Mistakes

1. **Forgetting to handle negative infinity initialization:** If you initialize dp[1] and dp[2] to 0 instead of negative infinity, you might incorrectly consider unreachable states as valid. For example, if no combination gives remainder 1, it should stay as negative infinity, not 0.

2. **Updating dp in-place without copying:** If you update the dp array while iterating through remainders, you might use a newly updated value to calculate another remainder in the same iteration. Always create a copy of dp at the start of each number iteration.

3. **Not considering both removal options:** When using the mathematical approach (not the DP approach), candidates sometimes only consider removing one element instead of checking both options (remove one element of remainder r OR two elements of complementary remainder).

4. **Incorrect remainder calculation:** Remember that `(remainder + num) % 3` correctly computes the new remainder, but some candidates mistakenly use `(remainder + (num % 3)) % 3`. While mathematically equivalent, the first is simpler and less error-prone.

## When You'll See This Pattern

This problem uses **dynamic programming with state compression** and **modular arithmetic constraints**. You'll see similar patterns in:

1. **Partition Equal Subset Sum (LeetCode 416)** - Also uses DP to track achievable sums, though with different constraints.
2. **Target Sum (LeetCode 494)** - Uses DP to count ways to achieve target sums.
3. **Coin Change (LeetCode 322)** - DP to find minimum coins for a target amount.
4. **Divisor Game (LeetCode 1025)** - Uses mathematical reasoning about divisibility.

The core pattern: When you need to find a subset that satisfies a modular constraint, consider using DP where the state tracks what's achievable modulo some number.

## Key Takeaways

1. **Modular arithmetic simplifies constraints:** When dealing with divisibility problems, categorize elements by their remainders. This reduces the problem space significantly.

2. **DP with small state space:** Even when the input is large, if the constraint involves a small modulus (like 3), you can use DP with constant space by tracking only the possible remainders.

3. **Think about what to remove, not just what to include:** Sometimes it's easier to start with everything and remove the minimum needed to satisfy constraints, rather than building up from nothing.

[Practice this problem on CodeJeet](/problem/greatest-sum-divisible-by-three)
