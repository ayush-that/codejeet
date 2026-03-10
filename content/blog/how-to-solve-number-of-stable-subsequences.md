---
title: "How to Solve Number of Stable Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Stable Subsequences. Hard difficulty, 60.1% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-08-25"
category: "dsa-patterns"
tags: ["number-of-stable-subsequences", "array", "dynamic-programming", "hard"]
---

# How to Solve Number of Stable Subsequences

This problem asks us to count all subsequences of an array where no three consecutive elements (in the subsequence) share the same parity (evenness or oddness). The challenge lies in efficiently counting exponentially many subsequences without actually generating them, and tracking the parity patterns of subsequences as we build them.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`

We need to count all stable subsequences. Let's list them systematically:

1. Empty subsequence `[]` - always stable (0 elements)
2. Single element subsequences: `[1]`, `[2]`, `[3]` - all stable (less than 3 elements)
3. Two-element subsequences:
   - `[1, 2]` (parities: odd, even) - stable
   - `[1, 3]` (parities: odd, odd) - stable (only 2 elements)
   - `[2, 3]` (parities: even, odd) - stable
4. Three-element subsequence:
   - `[1, 2, 3]` (parities: odd, even, odd) - stable

Total: 1 + 3 + 3 + 1 = 8 stable subsequences.

Now let's see a case with instability: `nums = [1, 3, 5]`

The subsequence `[1, 3, 5]` has parities (odd, odd, odd) - three consecutive odds, so it's NOT stable. All other subsequences are stable.

The key insight: when building subsequences, we only need to track the last two parities to know if adding a new element would create instability.

## Brute Force Approach

The most straightforward approach would be to generate all 2^n possible subsequences and check each one for stability:

1. Generate all subsets using bitmasking or recursion
2. For each subsequence, check if it contains three consecutive elements with the same parity
3. Count the valid ones

However, this approach has O(2^n × n) time complexity, which is far too slow for typical constraints (n up to 10^5). Even for n=20, we'd need to check over 1 million subsequences.

The brute force fails because it doesn't leverage the structure of the problem - we're counting subsequences, not checking each one individually. We need a way to count valid subsequences without enumerating them.

## Optimized Approach

The key insight is dynamic programming. For each position in the array, we want to know: how many stable subsequences end at this position with specific parity patterns?

Since we only care about avoiding three consecutive same-parity elements, we need to track:

- The parity of the last element (even or odd)
- The length of the current same-parity streak at the end (1 or 2)

This gives us 4 states:

1. End with even, streak length 1
2. End with even, streak length 2
3. End with odd, streak length 1
4. End with odd, streak length 2

We also need to track the empty subsequence separately.

Transition rules:

- We can always start a new subsequence with the current element (streak length 1)
- If current element has same parity as previous, we can extend from streak length 1 to streak length 2
- If current element has different parity, we can extend from any state to a new streak length 1

We also accumulate all valid subsequences as we go, not just those ending at the current position.

## Optimal Solution

We'll use dynamic programming with 5 states: dp[0] for empty subsequence, and dp[1-4] for the four parity-streak states described above.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def stableSubsequences(nums):
    """
    Counts all subsequences without three consecutive elements of same parity.

    Approach: Dynamic programming tracking parity patterns.
    We maintain counts for subsequences ending with specific parity patterns:
    - dp[0]: empty subsequence
    - dp[1]: ends with even, streak length 1
    - dp[2]: ends with even, streak length 2
    - dp[3]: ends with odd, streak length 1
    - dp[4]: ends with odd, streak length 2

    For each number, we update these counts based on its parity.
    """
    MOD = 10**9 + 7

    # Initialize DP array: only empty subsequence exists at start
    dp = [0] * 5
    dp[0] = 1  # empty subsequence

    for num in nums:
        # Create a copy of current state to update
        new_dp = dp[:]

        # Determine parity: 0 for even, 1 for odd
        parity = num & 1

        if parity == 0:  # Even number
            # Start new subsequence with this even number
            # Can start from empty subsequence or any subsequence
            new_dp[1] = (new_dp[1] + dp[0]) % MOD

            # Extend existing subsequences:
            # From even streak 1 to even streak 2
            new_dp[2] = (new_dp[2] + dp[1]) % MOD

            # From odd streaks to new even streak 1
            new_dp[1] = (new_dp[1] + dp[3]) % MOD  # from odd streak 1
            new_dp[1] = (new_dp[1] + dp[4]) % MOD  # from odd streak 2

        else:  # Odd number
            # Start new subsequence with this odd number
            new_dp[3] = (new_dp[3] + dp[0]) % MOD

            # Extend existing subsequences:
            # From odd streak 1 to odd streak 2
            new_dp[4] = (new_dp[4] + dp[3]) % MOD

            # From even streaks to new odd streak 1
            new_dp[3] = (new_dp[3] + dp[1]) % MOD  # from even streak 1
            new_dp[3] = (new_dp[3] + dp[2]) % MOD  # from even streak 2

        # Update dp for next iteration
        dp = new_dp

    # Sum all valid subsequences (excluding dp[0] which is empty)
    # We subtract 1 at the end to exclude the empty subsequence if needed
    # But the problem usually counts empty subsequence, so we include it
    total = sum(dp) % MOD
    return total
```

```javascript
// Time: O(n) | Space: O(1)
function stableSubsequences(nums) {
  /**
   * Counts all subsequences without three consecutive elements of same parity.
   *
   * DP states:
   * 0: empty subsequence
   * 1: ends with even, streak length 1
   * 2: ends with even, streak length 2
   * 3: ends with odd, streak length 1
   * 4: ends with odd, streak length 2
   */
  const MOD = 1_000_000_007;

  // Initialize DP array
  let dp = new Array(5).fill(0);
  dp[0] = 1; // empty subsequence

  for (const num of nums) {
    // Copy current state
    const newDp = [...dp];

    // Check parity using bitwise AND
    const parity = num & 1;

    if (parity === 0) {
      // Even number
      // Start new subsequence from empty
      newDp[1] = (newDp[1] + dp[0]) % MOD;

      // Extend even streak 1 to even streak 2
      newDp[2] = (newDp[2] + dp[1]) % MOD;

      // Transition from odd streaks to new even streak 1
      newDp[1] = (newDp[1] + dp[3]) % MOD; // from odd streak 1
      newDp[1] = (newDp[1] + dp[4]) % MOD; // from odd streak 2
    } else {
      // Odd number
      // Start new subsequence from empty
      newDp[3] = (newDp[3] + dp[0]) % MOD;

      // Extend odd streak 1 to odd streak 2
      newDp[4] = (newDp[4] + dp[3]) % MOD;

      // Transition from even streaks to new odd streak 1
      newDp[3] = (newDp[3] + dp[1]) % MOD; // from even streak 1
      newDp[3] = (newDp[3] + dp[2]) % MOD; // from even streak 2
    }

    // Update dp for next iteration
    dp = newDp;
  }

  // Sum all valid subsequences
  let total = 0;
  for (let i = 0; i < 5; i++) {
    total = (total + dp[i]) % MOD;
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int stableSubsequences(int[] nums) {
        /**
         * Counts all subsequences without three consecutive elements of same parity.
         *
         * DP states:
         * 0: empty subsequence
         * 1: ends with even, streak length 1
         * 2: ends with even, streak length 2
         * 3: ends with odd, streak length 1
         * 4: ends with odd, streak length 2
         */
        final int MOD = 1_000_000_007;

        // Initialize DP array
        long[] dp = new long[5];
        dp[0] = 1;  // empty subsequence

        for (int num : nums) {
            // Copy current state
            long[] newDp = dp.clone();

            // Check parity using bitwise AND
            int parity = num & 1;

            if (parity == 0) {  // Even number
                // Start new subsequence from empty
                newDp[1] = (newDp[1] + dp[0]) % MOD;

                // Extend even streak 1 to even streak 2
                newDp[2] = (newDp[2] + dp[1]) % MOD;

                // Transition from odd streaks to new even streak 1
                newDp[1] = (newDp[1] + dp[3]) % MOD;  // from odd streak 1
                newDp[1] = (newDp[1] + dp[4]) % MOD;  // from odd streak 2
            } else {  // Odd number
                // Start new subsequence from empty
                newDp[3] = (newDp[3] + dp[0]) % MOD;

                // Extend odd streak 1 to odd streak 2
                newDp[4] = (newDp[4] + dp[3]) % MOD;

                // Transition from even streaks to new odd streak 1
                newDp[3] = (newDp[3] + dp[1]) % MOD;  // from even streak 1
                newDp[3] = (newDp[3] + dp[2]) % MOD;  // from even streak 2
            }

            // Update dp for next iteration
            dp = newDp;
        }

        // Sum all valid subsequences
        long total = 0;
        for (int i = 0; i < 5; i++) {
            total = (total + dp[i]) % MOD;
        }

        return (int) total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each element exactly once
- For each element, we perform a constant number of operations (updating 5 DP states)
- This is optimal since we must examine each element at least once

**Space Complexity:** O(1)

- We only maintain a constant-size DP array of 5 elements
- The space doesn't grow with input size
- We use O(1) additional space beyond the input array

## Common Mistakes

1. **Forgetting about the empty subsequence**: Many candidates forget to include or properly handle the empty subsequence. It's always stable and should be counted unless the problem explicitly says otherwise.

2. **Incorrect state transitions**: The most common error is mishandling transitions between parity states. Remember:
   - You can always start a new subsequence from empty
   - You can extend same-parity streaks only from length 1 to length 2 (not from length 2)
   - When parity changes, you reset to streak length 1

3. **Modulo arithmetic errors**: Since the answer can be huge, we need modulo operations. Common mistakes:
   - Applying modulo only at the end (can cause overflow)
   - Using `% MOD` incorrectly with negative numbers
   - Forgetting that intermediate sums might exceed integer limits

4. **Confusing subsequences with subarrays**: Subsequences don't need to be contiguous in the original array, only consecutive within the subsequence. This affects how we build our DP - we can "skip" elements.

## When You'll See This Pattern

This type of "count valid subsequences with constraints" problem appears frequently in coding interviews. The pattern of using DP with state tracking for the last few elements is common:

1. **Count Number of Special Subsequences** (LeetCode 2486) - Count subsequences matching a pattern
2. **Arithmetic Slices II - Subsequence** (LeetCode 446) - Count arithmetic subsequences
3. **Distinct Subsequences II** (LeetCode 940) - Count distinct subsequences

The key insight across these problems is that when counting subsequences with constraints, you often only need to track a limited amount of information about the "tail" of the subsequence rather than the entire subsequence.

## Key Takeaways

1. **For subsequence counting problems, think DP**: When you need to count rather than enumerate, dynamic programming is often the right approach. The state usually represents properties of subsequences ending at the current position.

2. **Track only what's necessary**: You don't need to remember the entire subsequence. For parity constraints, tracking the last 1-2 elements' parities is sufficient. This reduces exponential complexity to linear.

3. **State design is crucial**: Carefully design your DP states to capture all relevant constraints. For this problem, we needed both parity AND streak length because the constraint involves three consecutive elements.

[Practice this problem on CodeJeet](/problem/number-of-stable-subsequences)
