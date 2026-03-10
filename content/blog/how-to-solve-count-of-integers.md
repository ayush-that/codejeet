---
title: "How to Solve Count of Integers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count of Integers. Hard difficulty, 38.2% acceptance rate. Topics: Math, String, Dynamic Programming."
date: "2029-11-25"
category: "dsa-patterns"
tags: ["count-of-integers", "math", "string", "dynamic-programming", "hard"]
---

# How to Solve Count of Integers

This problem asks us to count integers between two numeric strings `num1` and `num2` (inclusive) whose digit sum falls within a given range `[min_sum, max_sum]`. The challenge comes from the constraints: `num1` and `num2` can be up to 22 digits long, making brute force iteration impossible. We need a clever way to count numbers with digit sum constraints without actually generating all numbers.

## Visual Walkthrough

Let's trace through a small example: `num1 = "1"`, `num2 = "12"`, `min_sum = 3`, `max_sum = 8`.

We need to count numbers from 1 to 12 where digit sum is between 3 and 8:

- 1: digit sum = 1 ❌
- 2: digit sum = 2 ❌
- 3: digit sum = 3 ✅
- 4: digit sum = 4 ✅
- 5: digit sum = 5 ✅
- 6: digit sum = 6 ✅
- 7: digit sum = 7 ✅
- 8: digit sum = 8 ✅
- 9: digit sum = 9 ❌
- 10: digit sum = 1 ❌
- 11: digit sum = 2 ❌
- 12: digit sum = 3 ✅

That's 7 good integers: 3, 4, 5, 6, 7, 8, 12.

Now imagine if `num2` were "1000000000000000000000" (22 digits). We can't iterate through all numbers. The key insight: we can count numbers with digit sum ≤ S using digit dynamic programming, then use inclusion-exclusion to get the count for a range.

## Brute Force Approach

A naive solution would convert `num1` and `num2` to integers, iterate through all numbers in the range, compute each number's digit sum, and check if it's within bounds.

**Why this fails:**

- `num1` and `num2` can be up to 22 digits long, which means numbers up to 10²²
- That's 10,000,000,000,000,000,000,000 numbers to check
- Even at 1 million checks per second, this would take over 300,000 years
- We need a solution that scales with the number of digits, not the magnitude of the numbers

## Optimized Approach

The core technique is **digit dynamic programming** (digit DP). We break the problem into two parts:

1. **Count numbers ≤ N with digit sum ≤ S**
   - We use DP with states: `(position, sum, tight)`
   - `position`: which digit we're processing (0 to len(N))
   - `sum`: current digit sum so far
   - `tight`: whether we're bound by the prefix of N (if true, we can only use digits ≤ N's digit at this position)

2. **Apply inclusion-exclusion**
   - Count good numbers ≤ num2: `count(num2, max_sum) - count(num2, min_sum-1)`
   - Subtract numbers < num1: `count(num1-1, max_sum) - count(num1-1, min_sum-1)`
   - Final answer = `count(num2) - count(num1-1)`

The digit DP works by recursively trying all possible digits at each position while tracking constraints. Memoization avoids recomputing the same states.

## Optimal Solution

<div class="code-group">

```python
# Time: O(len(num) * max_sum * 2) where len(num) ≤ 22, max_sum ≤ 400
# Space: O(len(num) * max_sum * 2) for memoization
class Solution:
    MOD = 10**9 + 7

    def count(self, num: str, max_sum: int) -> int:
        """
        Count numbers ≤ num with digit sum ≤ max_sum
        """
        n = len(num)
        # memo[pos][sum][tight] = count of valid numbers
        # pos: current digit position (0 to n)
        # sum: current digit sum
        # tight: 1 if we're bound by num's prefix, 0 otherwise
        memo = [[[-1] * 2 for _ in range(max_sum + 1)] for _ in range(n)]

        def dfs(pos, sum_so_far, tight):
            """
            pos: current position in num (0-indexed)
            sum_so_far: sum of digits chosen so far
            tight: whether current prefix equals num's prefix
            """
            # Base case: processed all digits
            if pos == n:
                return 1 if sum_so_far <= max_sum else 0

            # Check memo
            if memo[pos][sum_so_far][tight] != -1:
                return memo[pos][sum_so_far][tight]

            # Determine the maximum digit we can choose at this position
            limit = int(num[pos]) if tight else 9

            total = 0
            # Try all possible digits at this position
            for digit in range(limit + 1):
                new_sum = sum_so_far + digit
                if new_sum > max_sum:
                    continue  # Prune: sum already exceeds max_sum

                # If tight is 1 and we choose digit == limit, remain tight
                # Otherwise, tight becomes 0 (we've chosen a smaller digit)
                new_tight = 1 if (tight and digit == limit) else 0
                total = (total + dfs(pos + 1, new_sum, new_tight)) % self.MOD

            memo[pos][sum_so_far][tight] = total
            return total

        # Start from position 0, sum 0, tight = 1 (bound by num)
        return dfs(0, 0, 1)

    def countGoodIntegers(self, num1: str, num2: str, min_sum: int, max_sum: int) -> int:
        # Helper to subtract 1 from a numeric string
        def decrement(num_str):
            num_list = list(num_str)
            i = len(num_list) - 1
            # Borrow from previous digits if needed
            while i >= 0 and num_list[i] == '0':
                num_list[i] = '9'
                i -= 1
            if i >= 0:
                num_list[i] = str(int(num_list[i]) - 1)
            # Remove leading zeros
            result = ''.join(num_list).lstrip('0')
            return result if result else '0'

        # Count numbers ≤ num2 with sum in [min_sum, max_sum]
        count_up_to_num2 = (self.count(num2, max_sum) - self.count(num2, min_sum - 1)) % self.MOD

        # Count numbers < num1 with sum in [min_sum, max_sum]
        num1_minus_1 = decrement(num1)
        count_up_to_num1_minus_1 = (self.count(num1_minus_1, max_sum) - self.count(num1_minus_1, min_sum - 1)) % self.MOD

        # Final answer: numbers in [num1, num2]
        return (count_up_to_num2 - count_up_to_num1_minus_1) % self.MOD
```

```javascript
// Time: O(len(num) * max_sum * 2) where len(num) ≤ 22, max_sum ≤ 400
// Space: O(len(num) * max_sum * 2) for memoization
class Solution {
  MOD = 1000000007;

  /**
   * Count numbers ≤ num with digit sum ≤ max_sum
   */
  count(num, max_sum) {
    const n = num.length;
    // memo[pos][sum][tight] = count of valid numbers
    const memo = Array(n)
      .fill()
      .map(() =>
        Array(max_sum + 1)
          .fill()
          .map(() => Array(2).fill(-1))
      );

    const dfs = (pos, sumSoFar, tight) => {
      // Base case: processed all digits
      if (pos === n) {
        return sumSoFar <= max_sum ? 1 : 0;
      }

      // Check memo
      if (memo[pos][sumSoFar][tight] !== -1) {
        return memo[pos][sumSoFar][tight];
      }

      // Determine the maximum digit we can choose
      const limit = tight ? parseInt(num[pos]) : 9;

      let total = 0;
      // Try all possible digits at this position
      for (let digit = 0; digit <= limit; digit++) {
        const newSum = sumSoFar + digit;
        if (newSum > max_sum) {
          continue; // Prune: sum already exceeds max_sum
        }

        // Update tight flag
        const newTight = tight && digit === limit ? 1 : 0;
        total = (total + dfs(pos + 1, newSum, newTight)) % this.MOD;
      }

      memo[pos][sumSoFar][tight] = total;
      return total;
    };

    // Start from position 0, sum 0, tight = 1 (bound by num)
    return dfs(0, 0, 1);
  }

  /**
   * Subtract 1 from a numeric string
   */
  decrement(numStr) {
    const numArr = numStr.split("");
    let i = numArr.length - 1;

    // Borrow from previous digits if needed
    while (i >= 0 && numArr[i] === "0") {
      numArr[i] = "9";
      i--;
    }

    if (i >= 0) {
      numArr[i] = (parseInt(numArr[i]) - 1).toString();
    }

    // Remove leading zeros
    const result = numArr.join("").replace(/^0+/, "");
    return result || "0";
  }

  countGoodIntegers(num1, num2, min_sum, max_sum) {
    // Count numbers ≤ num2 with sum in [min_sum, max_sum]
    const countUpToNum2 =
      (this.count(num2, max_sum) - this.count(num2, min_sum - 1) + this.MOD) % this.MOD;

    // Count numbers < num1 with sum in [min_sum, max_sum]
    const num1Minus1 = this.decrement(num1);
    const countUpToNum1Minus1 =
      (this.count(num1Minus1, max_sum) - this.count(num1Minus1, min_sum - 1) + this.MOD) % this.MOD;

    // Final answer: numbers in [num1, num2]
    return (countUpToNum2 - countUpToNum1Minus1 + this.MOD) % this.MOD;
  }
}
```

```java
// Time: O(len(num) * max_sum * 2) where len(num) ≤ 22, max_sum ≤ 400
// Space: O(len(num) * max_sum * 2) for memoization
class Solution {
    private static final int MOD = 1000000007;

    /**
     * Count numbers ≤ num with digit sum ≤ max_sum
     */
    private int count(String num, int maxSum) {
        int n = num.length();
        // memo[pos][sum][tight] = count of valid numbers
        int[][][] memo = new int[n][maxSum + 1][2];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j <= maxSum; j++) {
                Arrays.fill(memo[i][j], -1);
            }
        }

        return dfs(0, 0, 1, num, maxSum, memo);
    }

    private int dfs(int pos, int sumSoFar, int tight, String num, int maxSum, int[][][] memo) {
        int n = num.length();
        // Base case: processed all digits
        if (pos == n) {
            return sumSoFar <= maxSum ? 1 : 0;
        }

        // Check memo
        if (memo[pos][sumSoFar][tight] != -1) {
            return memo[pos][sumSoFar][tight];
        }

        // Determine the maximum digit we can choose
        int limit = (tight == 1) ? (num.charAt(pos) - '0') : 9;

        long total = 0;
        // Try all possible digits at this position
        for (int digit = 0; digit <= limit; digit++) {
            int newSum = sumSoFar + digit;
            if (newSum > maxSum) {
                continue;  // Prune: sum already exceeds max_sum
            }

            // Update tight flag
            int newTight = (tight == 1 && digit == limit) ? 1 : 0;
            total = (total + dfs(pos + 1, newSum, newTight, num, maxSum, memo)) % MOD;
        }

        memo[pos][sumSoFar][tight] = (int) total;
        return (int) total;
    }

    /**
     * Subtract 1 from a numeric string
     */
    private String decrement(String numStr) {
        char[] numArr = numStr.toCharArray();
        int i = numArr.length - 1;

        // Borrow from previous digits if needed
        while (i >= 0 && numArr[i] == '0') {
            numArr[i] = '9';
            i--;
        }

        if (i >= 0) {
            numArr[i] = (char) (numArr[i] - 1);
        }

        // Remove leading zeros
        String result = new String(numArr).replaceFirst("^0+", "");
        return result.isEmpty() ? "0" : result;
    }

    public int countGoodIntegers(String num1, String num2, int min_sum, int max_sum) {
        // Count numbers ≤ num2 with sum in [min_sum, max_sum]
        long countUpToNum2 = (count(num2, max_sum) - count(num2, min_sum - 1)) % MOD;
        countUpToNum2 = (countUpToNum2 + MOD) % MOD;  // Handle negative

        // Count numbers < num1 with sum in [min_sum, max_sum]
        String num1Minus1 = decrement(num1);
        long countUpToNum1Minus1 = (count(num1Minus1, max_sum) - count(num1Minus1, min_sum - 1)) % MOD;
        countUpToNum1Minus1 = (countUpToNum1Minus1 + MOD) % MOD;  // Handle negative

        // Final answer: numbers in [num1, num2]
        long result = (countUpToNum2 - countUpToNum1Minus1) % MOD;
        return (int) ((result + MOD) % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(L × M × 2) where L is the length of the number (≤ 22) and M is max_sum (≤ 400)

- We have L positions, each with M possible sums and 2 tight states
- At each state, we try up to 10 digits, but this is constant
- Total states: L × M × 2 = 22 × 400 × 2 = 17,600 states
- Each state processes up to 10 digits, so ~176,000 operations

**Space Complexity:** O(L × M × 2) for the memoization table

- Same as time complexity for storing all DP states
- Plus recursion depth O(L) for the call stack

## Common Mistakes

1. **Forgetting to handle negative modulo results**: When subtracting counts, we might get negative numbers. Always add MOD before taking modulo: `(a - b + MOD) % MOD`.

2. **Incorrect tight flag logic**: The tight flag should only remain 1 if we've chosen exactly the same digits as the prefix of the bounding number. A common error is to set `new_tight = tight && (digit == limit)` without considering that once we choose a smaller digit, we're no longer tight.

3. **Not pruning when sum exceeds max_sum**: If the current sum already exceeds max_sum, we should stop exploring that path immediately. This optimization is crucial for performance.

4. **Incorrect base case handling**: The base case should return 1 (valid number) when we've processed all digits AND the sum is within bounds. Some implementations return 1 unconditionally, which counts invalid numbers.

## When You'll See This Pattern

Digit DP appears in problems where we need to count numbers in a range satisfying some digit-based property:

1. **Count Numbers with Non-Decreasing Digits (Hard)**: Count numbers where each digit is ≥ previous digit. Uses similar DP with state tracking the last digit.

2. **Numbers At Most N Given Digit Set (Hard)**: Count numbers ≤ N that can be formed using only specific digits. The tight flag logic is identical.

3. **Digit Count in Range (Hard)**: Count how many times a digit d appears in all numbers in a range. Requires tracking the count of digit d so far.

The pattern is: when you need to count numbers in a range with digit constraints, think digit DP with states for position, some constraint tracking (sum, last digit, count of something), and the tight flag.

## Key Takeaways

1. **Digit DP is the go-to technique for counting numbers with digit constraints**: When numbers are too large to iterate, break the problem digit by digit with DP states.

2. **The tight flag is crucial for handling upper bounds**: It tracks whether we're still bound by the prefix of the limiting number, controlling which digits we can choose.

3. **Inclusion-exclusion simplifies range queries**: To count numbers in [A, B], count numbers ≤ B and subtract numbers < A. This avoids having to handle both bounds simultaneously in the DP.

Related problems: [Count Numbers with Non-Decreasing Digits](/problem/count-numbers-with-non-decreasing-digits)
