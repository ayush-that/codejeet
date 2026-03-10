---
title: "How to Solve Inverse Coin Change — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Inverse Coin Change. Medium difficulty, 51.5% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-10-19"
category: "dsa-patterns"
tags: ["inverse-coin-change", "array", "dynamic-programming", "medium"]
---

# How to Solve Inverse Coin Change

This problem presents an interesting twist on classic coin change problems. Instead of being given coin denominations and asked to find the number of ways to make amounts, you're given the number of ways to make each amount and must deduce what coin denominations could produce those counts. The challenge lies in working backwards from the effect (ways counts) to the cause (coin denominations).

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we're given `numWays = [1, 1, 2, 2, 3, 4]` (1-indexed, so `numWays[0]` is unused).

**Understanding the setup:**

- `numWays[1] = 1`: There's 1 way to make amount 1
- `numWays[2] = 2`: There are 2 ways to make amount 2
- `numWays[3] = 2`: 2 ways to make amount 3
- `numWays[4] = 3`: 3 ways to make amount 4
- `numWays[5] = 4`: 4 ways to make amount 5

**Key insight:** In standard coin change problems, we compute `ways[i]` using dynamic programming: `ways[i] = ways[i] + ways[i - coin]` for each coin. To reverse this, we need to find coins that could produce these counts.

**Step-by-step deduction:**

1. `numWays[1] = 1` tells us there must be a coin of value 1 (otherwise there would be 0 ways to make amount 1).
2. Now consider `numWays[2] = 2`. With coin 1, we can make amount 2 as (1+1). If we had coin 2, we could also make it as (2). So coin 2 must exist.
3. For `numWays[3] = 2`: With coins 1 and 2, we can make 3 as (1+1+1) or (1+2). That's 2 ways, which matches. No coin 3 needed.
4. For `numWays[4] = 3`: With coins 1 and 2, we can make 4 as (1+1+1+1), (1+1+2), or (2+2). That's 3 ways. No coin 4 needed.
5. For `numWays[5] = 4`: With coins 1 and 2, we can make 5 as (1+1+1+1+1), (1+1+1+2), (1+2+2), or (2+2+1, but that's same as 1+2+2). That's only 3 ways, but we need 4. So we must have coin 5.

The resulting coins would be {1, 2, 5}.

## Brute Force Approach

A naive approach would be to try all possible subsets of coin denominations (values from 1 to n) and check which ones produce the given `numWays` counts. For each candidate set of coins, we'd run the standard coin change DP algorithm to compute the ways for each amount and compare with the input.

**Why this fails:**

- There are 2^n possible subsets of coins (n = length of numWays)
- For each subset, we need O(n \* m) time where m is the number of coins in the subset
- This gives O(2^n \* n^2) time complexity, which is exponential and impractical for n up to 1000

Even with optimizations like pruning, the search space is too large. We need a more clever approach that directly deduces the coins from the pattern in `numWays`.

## Optimized Approach

The key insight comes from understanding how coin denominations affect the ways counts. In the standard coin change DP:

1. We initialize `ways[0] = 1` (1 way to make amount 0: use no coins)
2. For each coin `c`, we update: `ways[i] += ways[i - c]` for all `i ≥ c`

To reverse this process, we can think about it this way:

- Start with an empty set of coins
- For each amount `i` from 1 to n, check if `numWays[i]` matches what we'd expect from the coins we've identified so far
- If it doesn't match, then `i` must be a coin denomination

**Why this works:**
When we process amounts in increasing order, if `i` is a coin, it introduces new ways to make amounts `≥ i`. Specifically, for a coin `c`, it adds `ways[i - c]` to `ways[i]` for all `i ≥ c`. So if we've correctly computed ways using coins smaller than `i`, and `numWays[i]` is larger than our computed value, then `i` must be a coin.

**Algorithm outline:**

1. Initialize `ways` array with `ways[0] = 1`, others 0
2. Initialize empty list `coins` to store found denominations
3. For `i` from 1 to n:
   - If `numWays[i] > ways[i]`, then `i` is a coin
   - Add `i` to `coins`
   - For `j` from `i` to n: `ways[j] += ways[j - i]`
4. Verify that final `ways` matches `numWays`

This runs in O(n²) time and O(n) space, which is efficient for n up to 1000.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def inverseCoinChange(numWays):
    """
    Given numWays[i] = number of ways to make amount i,
    returns the list of coin denominations that could produce these counts.

    Args:
        numWays: 1-indexed list where numWays[0] is unused

    Returns:
        List of coin denominations in increasing order
    """
    n = len(numWays) - 1  # Amounts go from 1 to n
    ways = [0] * (n + 1)  # 0-indexed DP array
    ways[0] = 1  # Base case: 1 way to make amount 0

    coins = []  # Store found coin denominations

    # Process amounts from 1 to n
    for i in range(1, n + 1):
        # If actual ways[i] > computed ways[i], i must be a coin
        if numWays[i] > ways[i]:
            coins.append(i)  # Add i to coin denominations

            # Update DP array: for all amounts j >= i,
            # add ways[j - i] to ways[j] (using coin i)
            for j in range(i, n + 1):
                ways[j] += ways[j - i]

    # Verify the computed ways match the input
    # This check ensures the solution is valid
    for i in range(1, n + 1):
        if ways[i] != numWays[i]:
            return []  # Invalid input or no solution

    return coins
```

```javascript
// Time: O(n^2) | Space: O(n)
function inverseCoinChange(numWays) {
  /**
   * Given numWays[i] = number of ways to make amount i,
   * returns the array of coin denominations that could produce these counts.
   *
   * @param {number[]} numWays - 1-indexed array where numWays[0] is unused
   * @return {number[]} Array of coin denominations in increasing order
   */
  const n = numWays.length - 1; // Amounts go from 1 to n
  const ways = new Array(n + 1).fill(0); // 0-indexed DP array
  ways[0] = 1; // Base case: 1 way to make amount 0

  const coins = []; // Store found coin denominations

  // Process amounts from 1 to n
  for (let i = 1; i <= n; i++) {
    // If actual ways[i] > computed ways[i], i must be a coin
    if (numWays[i] > ways[i]) {
      coins.push(i); // Add i to coin denominations

      // Update DP array: for all amounts j >= i,
      // add ways[j - i] to ways[j] (using coin i)
      for (let j = i; j <= n; j++) {
        ways[j] += ways[j - i];
      }
    }
  }

  // Verify the computed ways match the input
  // This check ensures the solution is valid
  for (let i = 1; i <= n; i++) {
    if (ways[i] !== numWays[i]) {
      return []; // Invalid input or no solution
    }
  }

  return coins;
}
```

```java
// Time: O(n^2) | Space: O(n)
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<Integer> inverseCoinChange(int[] numWays) {
        /**
         * Given numWays[i] = number of ways to make amount i,
         * returns the list of coin denominations that could produce these counts.
         *
         * @param numWays 1-indexed array where numWays[0] is unused
         * @return List of coin denominations in increasing order
         */
        int n = numWays.length - 1;  // Amounts go from 1 to n
        int[] ways = new int[n + 1];  // 0-indexed DP array
        ways[0] = 1;  // Base case: 1 way to make amount 0

        List<Integer> coins = new ArrayList<>();  // Store found coin denominations

        // Process amounts from 1 to n
        for (int i = 1; i <= n; i++) {
            // If actual ways[i] > computed ways[i], i must be a coin
            if (numWays[i] > ways[i]) {
                coins.add(i);  // Add i to coin denominations

                // Update DP array: for all amounts j >= i,
                // add ways[j - i] to ways[j] (using coin i)
                for (int j = i; j <= n; j++) {
                    ways[j] += ways[j - i];
                }
            }
        }

        // Verify the computed ways match the input
        // This check ensures the solution is valid
        for (int i = 1; i <= n; i++) {
            if (ways[i] != numWays[i]) {
                return new ArrayList<>();  // Invalid input or no solution
            }
        }

        return coins;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through amounts 1 to n: O(n)
- For each potential coin, we update the DP array from i to n: O(n) in worst case
- This gives O(n²) total time
- The verification step adds another O(n), which doesn't change the overall complexity

**Space Complexity: O(n)**

- We maintain a `ways` array of size n+1: O(n)
- The `coins` list can contain at most n elements: O(n)
- Total space: O(n)

This is efficient for the typical constraints where n ≤ 1000.

## Common Mistakes

1. **Forgetting the 1-indexing:** The problem states `numWays` is 1-indexed, so `numWays[0]` is unused. Many candidates waste time trying to interpret `numWays[0]` or create off-by-one errors in their loops.

2. **Not verifying the solution:** Some candidates return the coins without checking if they actually produce the given `numWays`. The verification step is crucial because the algorithm assumes a solution exists. Without verification, you might return coins for an invalid input.

3. **Incorrect update order in DP:** When updating the `ways` array after finding a new coin, you must iterate forward (from i to n), not backward. This is because we're doing an unbounded knapsack style update (coins can be used infinitely). Backward iteration would give the 0/1 knapsack result (each coin used at most once).

4. **Missing the base case:** Forgetting to set `ways[0] = 1` is a common error. This represents the 1 way to make amount 0 (using no coins), which is essential for the DP recurrence to work correctly.

## When You'll See This Pattern

This "reverse DP" or "working backwards from effect to cause" pattern appears in several problems:

1. **Coin Change (LeetCode 322):** The forward version of this problem - given coins and amount, find minimum coins needed. Understanding the forward DP is essential for solving the inverse version.

2. **Coin Change II (LeetCode 518):** Given coins and amount, find number of combinations. This is exactly the forward computation we're reversing in the inverse coin change problem.

3. **Perfect Squares (LeetCode 279):** Given n, find minimum number of perfect square numbers that sum to n. This uses similar DP thinking but with perfect squares as the "coins".

4. **Combination Sum IV (LeetCode 377):** Given an array of distinct integers and a target, find the number of possible combinations that add up to target. This is essentially the unbounded knapsack counting problem.

## Key Takeaways

1. **DP can often be reversed:** If you understand how a DP algorithm computes results from inputs, you can sometimes work backwards from outputs to inputs. This is particularly useful when the forward computation is injective (one-to-one) over the space of possible inputs.

2. **Process in increasing order:** When dealing with coin denominations, processing amounts in increasing order ensures you've considered all smaller coins before deciding if the current amount is itself a coin. This greedy-like approach works because larger coins don't affect counts for smaller amounts.

3. **Verification is crucial for inverse problems:** When reconstructing inputs from outputs, always verify that your reconstructed inputs actually produce the given outputs. This catches edge cases and invalid inputs.

Related problems: [Coin Change](/problem/coin-change), [Coin Change II](/problem/coin-change-ii)
