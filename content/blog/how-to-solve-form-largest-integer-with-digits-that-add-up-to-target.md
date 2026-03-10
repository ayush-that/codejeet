---
title: "How to Solve Form Largest Integer With Digits That Add up to Target — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Form Largest Integer With Digits That Add up to Target. Hard difficulty, 49.5% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-09-23"
category: "dsa-patterns"
tags:
  ["form-largest-integer-with-digits-that-add-up-to-target", "array", "dynamic-programming", "hard"]
---

# How to Solve "Form Largest Integer With Digits That Add up to Target"

This problem asks us to build the largest possible integer (as a string) where each digit `(i+1)` costs `cost[i]` to "paint," and the total cost must exactly equal `target`. The tricky part is that we need to maximize the integer value, not just find any valid combination. This means we must consider both the length of the number (more digits = larger number) and the digit values themselves (higher digits in more significant positions = larger number). It's essentially a knapsack problem where we're optimizing for lexicographically largest string composition.

## Visual Walkthrough

Let's walk through an example: `cost = [4,3,2,5,6,7,2,5,5]`, `target = 9`.

**Step 1: Understanding digit costs**

- Digit 1 costs 4
- Digit 2 costs 3
- Digit 3 costs 2
- Digit 4 costs 5
- Digit 5 costs 6
- Digit 6 costs 7
- Digit 7 costs 2
- Digit 8 costs 5
- Digit 9 costs 5

**Step 2: Thinking about maximizing the number**
We want the largest possible number, which means:

1. First, maximize the length (more digits = larger number)
2. Then, use the largest possible digits in the most significant positions

**Step 3: Finding valid combinations**
Let's try to build from most significant to least significant:

- If we start with digit 9 (cost 5), remaining target = 4
  - We could add digit 1 (cost 4) → "91"
  - Or digit 3 (cost 2) + digit 3 (cost 2) → "933"
  - "933" is longer than "91", so better

- If we start with digit 8 (cost 5), remaining target = 4
  - Similar options → "833" (same length as "933" but smaller first digit)

- If we start with digit 7 (cost 2), remaining target = 7
  - Could add digit 9 (cost 5) + digit 3 (cost 2) → "793"
  - Or digit 7 (cost 2) + digit 7 (cost 2) + digit 7 (cost 2) + digit 3 (cost 2) → "7773" (4 digits!)

**Step 4: The optimal approach**
We need to systematically check all possibilities. The best solution for this example is "7772" (digits 7,7,7,2 with costs 2+2+2+3=9), giving us 4 digits starting with the largest possible digit sequence.

## Brute Force Approach

A naive approach would be to try all combinations of digits:

1. For each digit 1-9, try including it if we have enough remaining target
2. Recursively explore all paths
3. Keep track of the best (longest, then lexicographically largest) result

The problem with brute force is the exponential time complexity. With 9 possible digits and target up to 5000, the number of combinations is astronomical. Even with memoization, we'd need to store results for each remaining target, but comparing string results would be inefficient.

What a candidate might try (and why it fails):

- Greedily picking the largest affordable digit at each step doesn't always work. For example, with `cost = [6,10,15,40,40,40,40,40,40]` and `target = 47`, greedy picks 9→7→? but optimal is 77777 (five 7's).
- Trying all permutations is even worse - factorial complexity.

## Optimized Approach

The key insight is to separate the problem into two phases using dynamic programming:

**Phase 1: Find maximum length**
We use DP to find the maximum number of digits we can use. This is a classic knapsack problem:

- `dp[t]` = maximum digits we can get with exactly cost `t`
- Transition: `dp[t] = max(dp[t], 1 + dp[t - cost[d]])` for each digit `d`

**Phase 2: Construct the largest number**
Once we know the maximum length, we build the number digit by digit from most significant to least:

- At each position, try digits 9 down to 1
- For each digit, check if using it allows us to complete a valid sequence of the maximum length
- Specifically: if `dp[target - cost[digit]] == dp[target] - 1`, then this digit is valid

**Why this works:**

1. First, we find the theoretical maximum length without worrying about digit values
2. Then, we greedily pick the largest valid digit at each step, knowing we can still achieve the maximum length
3. The DP table tells us whether a choice maintains the possibility of reaching maximum length

## Optimal Solution

<div class="code-group">

```python
# Time: O(9 * target) for DP + O(9 * max_length) for construction = O(target)
# Space: O(target) for DP array
def largestNumber(cost, target):
    """
    Builds the largest possible integer where digit (i+1) costs cost[i]
    and total cost equals target exactly.
    """
    # DP array: dp[t] = maximum digits achievable with exactly cost t
    # Initialize with -inf (or a very small number) to represent impossible states
    dp = [float('-inf')] * (target + 1)
    dp[0] = 0  # Base case: 0 cost gives 0 digits

    # Phase 1: Find maximum number of digits using knapsack DP
    for t in range(1, target + 1):
        for d in range(9):  # Digits 1-9 (0-indexed)
            digit_cost = cost[d]
            if t >= digit_cost:
                # Try using this digit if we can afford it
                dp[t] = max(dp[t], 1 + dp[t - digit_cost])

    # If we can't reach the target exactly, return "0"
    if dp[target] < 0:
        return "0"

    # Phase 2: Build the largest number from most to least significant digit
    result = []
    remaining_target = target

    # We need exactly dp[target] digits
    for _ in range(dp[target]):
        # Try digits from 9 down to 1 (largest first)
        for d in range(8, -1, -1):  # d from 8 to 0 (digits 9 to 1)
            digit_cost = cost[d]
            # Check if we can use this digit and still complete to max length
            if (remaining_target >= digit_cost and
                dp[remaining_target - digit_cost] == dp[remaining_target] - 1):
                result.append(str(d + 1))  # Convert to actual digit
                remaining_target -= digit_cost
                break  # Move to next digit position

    return ''.join(result)
```

```javascript
// Time: O(9 * target) for DP + O(9 * max_length) for construction = O(target)
// Space: O(target) for DP array
function largestNumber(cost, target) {
  // DP array: dp[t] = maximum digits achievable with exactly cost t
  // Initialize with -Infinity to represent impossible states
  const dp = new Array(target + 1).fill(-Infinity);
  dp[0] = 0; // Base case: 0 cost gives 0 digits

  // Phase 1: Find maximum number of digits using knapsack DP
  for (let t = 1; t <= target; t++) {
    for (let d = 0; d < 9; d++) {
      // Digits 1-9 (0-indexed)
      const digitCost = cost[d];
      if (t >= digitCost) {
        // Try using this digit if we can afford it
        dp[t] = Math.max(dp[t], 1 + dp[t - digitCost]);
      }
    }
  }

  // If we can't reach the target exactly, return "0"
  if (dp[target] < 0) {
    return "0";
  }

  // Phase 2: Build the largest number from most to least significant digit
  const result = [];
  let remainingTarget = target;

  // We need exactly dp[target] digits
  for (let i = 0; i < dp[target]; i++) {
    // Try digits from 9 down to 1 (largest first)
    for (let d = 8; d >= 0; d--) {
      // d from 8 to 0 (digits 9 to 1)
      const digitCost = cost[d];
      // Check if we can use this digit and still complete to max length
      if (
        remainingTarget >= digitCost &&
        dp[remainingTarget - digitCost] === dp[remainingTarget] - 1
      ) {
        result.push(String(d + 1)); // Convert to actual digit
        remainingTarget -= digitCost;
        break; // Move to next digit position
      }
    }
  }

  return result.join("");
}
```

```java
// Time: O(9 * target) for DP + O(9 * max_length) for construction = O(target)
// Space: O(target) for DP array
class Solution {
    public String largestNumber(int[] cost, int target) {
        // DP array: dp[t] = maximum digits achievable with exactly cost t
        // Initialize with a very small number to represent impossible states
        int[] dp = new int[target + 1];
        Arrays.fill(dp, Integer.MIN_VALUE);
        dp[0] = 0;  // Base case: 0 cost gives 0 digits

        // Phase 1: Find maximum number of digits using knapsack DP
        for (int t = 1; t <= target; t++) {
            for (int d = 0; d < 9; d++) {  // Digits 1-9 (0-indexed)
                int digitCost = cost[d];
                if (t >= digitCost) {
                    // Try using this digit if we can afford it
                    dp[t] = Math.max(dp[t], 1 + dp[t - digitCost]);
                }
            }
        }

        // If we can't reach the target exactly, return "0"
        if (dp[target] < 0) {
            return "0";
        }

        // Phase 2: Build the largest number from most to least significant digit
        StringBuilder result = new StringBuilder();
        int remainingTarget = target;

        // We need exactly dp[target] digits
        for (int i = 0; i < dp[target]; i++) {
            // Try digits from 9 down to 1 (largest first)
            for (int d = 8; d >= 0; d--) {  // d from 8 to 0 (digits 9 to 1)
                int digitCost = cost[d];
                // Check if we can use this digit and still complete to max length
                if (remainingTarget >= digitCost &&
                    dp[remainingTarget - digitCost] == dp[remainingTarget] - 1) {
                    result.append(d + 1);  // Convert to actual digit
                    remainingTarget -= digitCost;
                    break;  // Move to next digit position
                }
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(target)**

- Phase 1 (DP): We iterate through all targets from 1 to `target`, and for each, check all 9 digits. This gives O(9 × target) = O(target).
- Phase 2 (Construction): We build at most `dp[target]` digits (≤ target), and for each position, we check at most 9 digits. This gives O(9 × max_length) = O(target).
- Total: O(target) since target dominates.

**Space Complexity: O(target)**

- We store a DP array of size `target + 1`.
- The result string can be at most `target` characters long (if all digits cost 1), but this is output space, not auxiliary space.

## Common Mistakes

1. **Forgetting to handle the "impossible" case**: If no combination sums exactly to target, we must return "0". Candidates often return an empty string or don't check this.

2. **Using greedy without DP verification**: Picking the largest affordable digit at each step seems intuitive but fails for cases where a cheaper digit allows more total digits. Always verify with the DP table.

3. **Incorrect DP initialization**: Using 0 instead of -∞ for impossible states can cause issues. If `dp[t] = 0` for impossible `t`, then `1 + dp[t - cost]` could be 1, making it seem like we can achieve length 1 when we actually can't.

4. **Building from least to most significant**: When constructing the number, we must start from the most significant digit (leftmost) and use the largest valid digit. Building backwards or from right to left gives the wrong result.

## When You'll See This Pattern

This "DP + greedy construction" pattern appears in optimization problems where you need to:

1. First find the optimal "score" (like maximum length)
2. Then reconstruct the solution that achieves that score

Related LeetCode problems:

1. **Coin Change (LC 322)**: Similar knapsack DP to find minimum coins, but here we maximize digits then lexicographically maximize the string.
2. **Target Sum (LC 494)**: Another DP problem where you count ways to reach a target, though the reconstruction aspect is different.
3. **Integer Break (LC 343)**: Maximizing product rather than sum, but similar optimization thinking.

## Key Takeaways

1. **Separate optimization from construction**: When you need to maximize something then build the actual solution, use DP to find the optimal metric first, then greedily construct the solution using the DP table as a guide.

2. **Lexicographic order matters for numbers**: For numbers as strings, longer is always better first, then larger digits in more significant positions. This two-phase approach naturally handles both criteria.

3. **Knapsack DP is versatile**: The basic "dp[t] = best value with exact cost t" pattern appears in many problems. Remember to initialize impossible states properly (with -∞ for maximization).

[Practice this problem on CodeJeet](/problem/form-largest-integer-with-digits-that-add-up-to-target)
