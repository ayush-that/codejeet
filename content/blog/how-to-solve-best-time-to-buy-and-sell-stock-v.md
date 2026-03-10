---
title: "How to Solve Best Time to Buy and Sell Stock V — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock V. Medium difficulty, 60.8% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-11-18"
category: "dsa-patterns"
tags: ["best-time-to-buy-and-sell-stock-v", "array", "dynamic-programming", "medium"]
---

# How to Solve Best Time to Buy and Sell Stock IV

This problem asks you to maximize profit from stock trading with at most `k` transactions, where each transaction consists of buying on one day and selling on a later day. What makes this problem tricky is that `k` can be large—up to 1000—which means we can't use a naive approach that tries all combinations of buy/sell pairs. The challenge lies in efficiently tracking multiple transactions while ensuring we don't exceed the transaction limit.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `prices = [3, 2, 6, 5, 0, 3]` with `k = 2`.

We want to make at most 2 transactions. Let's think about what happens day by day:

- **Day 0 (price 3)**: We can either buy or do nothing. If we buy, we're in a "holding" state for transaction 1.
- **Day 1 (price 2)**: Price drops to 2. Better to buy here instead of day 0 for a lower cost basis.
- **Day 2 (price 6)**: Price jumps to 6. If we bought at 2, we could sell for profit of 4. This would complete transaction 1.
- **Day 3 (price 5)**: Price drops to 5. We could buy again for a potential second transaction.
- **Day 4 (price 0)**: Price drops further to 0. Better to buy here instead of day 3.
- **Day 5 (price 3)**: Price rises to 3. If we bought at 0, we could sell for profit of 3, completing transaction 2.

The optimal sequence: Buy at day 1 (price 2), sell at day 2 (price 6) → profit 4. Then buy at day 4 (price 0), sell at day 5 (price 3) → profit 3. Total profit = 7.

The key insight is that on any given day, we can be in one of two states for each transaction number:

1. **Not holding any stock** (just completed a sell or haven't started)
2. **Holding stock** (bought but haven't sold yet)

We need to track both states for each possible transaction count.

## Brute Force Approach

A naive approach would try all possible combinations of buy/sell pairs. For `k` transactions, we'd need to choose `k` buy days and `k` sell days from `n` days, with each buy day coming before its corresponding sell day. The number of possibilities grows combinatorially—approximately O(n^(2k)). Even for moderate `n` and `k`, this becomes astronomically large.

Another brute force idea: try all possible sequences of actions (buy, sell, or hold) each day. With 3 choices per day over `n` days, that's O(3^n), which is even worse.

Both approaches are completely impractical for the constraints (n up to 1000, k up to 1000). We need a smarter way that avoids exponential explosion.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with two dimensions:

1. **Day** (from 0 to n-1)
2. **Transaction count** (from 0 to k)
3. **Holding state** (0 = not holding stock, 1 = holding stock)

We can define `dp[day][transactions][holding]` as the maximum profit achievable up to that day with that many transactions completed (or in progress) and holding state.

The recurrence relations:

- If we're **not holding stock** (`holding = 0`) on day `i`:
  - We could have been not holding yesterday and did nothing today: `dp[i-1][j][0]`
  - We could have been holding yesterday and sold today: `dp[i-1][j][1] + prices[i]` (selling completes a transaction)
  - Take the maximum: `dp[i][j][0] = max(dp[i-1][j][0], dp[i-1][j][1] + prices[i])`

- If we're **holding stock** (`holding = 1`) on day `i`:
  - We could have been holding yesterday and did nothing: `dp[i-1][j][1]`
  - We could have been not holding yesterday and bought today: `dp[i-1][j-1][0] - prices[i]` (buying starts a new transaction)
  - Take the maximum: `dp[i][j][1] = max(dp[i-1][j][1], dp[i-1][j-1][0] - prices[i])`

Base cases:

- Day 0, not holding: `dp[0][j][0] = 0` (no profit, no stock)
- Day 0, holding: `dp[0][j][1] = -prices[0]` (bought on day 0)
- For any day, 0 transactions, holding: `dp[i][0][1] = -infinity` (can't hold stock without starting a transaction)

We need to be careful about the `j-1` index when `j=0`. Also, note that `k` can be very large—if `k >= n/2`, we can make as many transactions as we want, which simplifies to the "unlimited transactions" problem.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * min(k, n//2)) | Space: O(min(k, n//2))
def maxProfit(k, prices):
    """
    Calculate maximum profit with at most k transactions.

    Args:
        k: Maximum number of transactions allowed
        prices: List of stock prices for each day

    Returns:
        Maximum achievable profit
    """
    n = len(prices)

    # If no prices or k is 0, profit is 0
    if n <= 1 or k == 0:
        return 0

    # If k is large enough, we can make unlimited transactions
    # Maximum possible transactions is n//2 (buy-sell pairs)
    if k >= n // 2:
        # Use greedy approach for unlimited transactions
        profit = 0
        for i in range(1, n):
            # Buy whenever price increases from previous day
            if prices[i] > prices[i-1]:
                profit += prices[i] - prices[i-1]
        return profit

    # DP arrays: we only need previous day's values, so we can optimize space
    # not_hold[j] = max profit with j transactions, not holding stock
    # hold[j] = max profit with j transactions, holding stock
    not_hold = [0] * (k + 1)
    hold = [-float('inf')] * (k + 1)

    for price in prices:
        # Process transactions in reverse to avoid using updated values
        # for the same day (which would allow multiple transactions in one day)
        for j in range(k, 0, -1):
            # Update not_hold state: either stay not holding or sell today
            not_hold[j] = max(not_hold[j], hold[j] + price)

            # Update hold state: either stay holding or buy today
            # Buying uses one transaction (j-1), so we check not_hold[j-1]
            hold[j] = max(hold[j], not_hold[j-1] - price)

    # Maximum profit is when we're not holding any stock
    return not_hold[k]
```

```javascript
// Time: O(n * min(k, n/2)) | Space: O(min(k, n/2))
function maxProfit(k, prices) {
  /**
   * Calculate maximum profit with at most k transactions.
   *
   * @param {number} k - Maximum number of transactions allowed
   * @param {number[]} prices - Array of stock prices for each day
   * @return {number} Maximum achievable profit
   */
  const n = prices.length;

  // If no prices or k is 0, profit is 0
  if (n <= 1 || k === 0) {
    return 0;
  }

  // If k is large enough, we can make unlimited transactions
  // Maximum possible transactions is Math.floor(n/2) (buy-sell pairs)
  if (k >= Math.floor(n / 2)) {
    // Use greedy approach for unlimited transactions
    let profit = 0;
    for (let i = 1; i < n; i++) {
      // Buy whenever price increases from previous day
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }
    return profit;
  }

  // DP arrays: we only need previous day's values, so we can optimize space
  // notHold[j] = max profit with j transactions, not holding stock
  // hold[j] = max profit with j transactions, holding stock
  const notHold = new Array(k + 1).fill(0);
  const hold = new Array(k + 1).fill(-Infinity);

  for (const price of prices) {
    // Process transactions in reverse to avoid using updated values
    // for the same day (which would allow multiple transactions in one day)
    for (let j = k; j > 0; j--) {
      // Update notHold state: either stay not holding or sell today
      notHold[j] = Math.max(notHold[j], hold[j] + price);

      // Update hold state: either stay holding or buy today
      // Buying uses one transaction (j-1), so we check notHold[j-1]
      hold[j] = Math.max(hold[j], notHold[j - 1] - price);
    }
  }

  // Maximum profit is when we're not holding any stock
  return notHold[k];
}
```

```java
// Time: O(n * min(k, n/2)) | Space: O(min(k, n/2))
class Solution {
    public int maxProfit(int k, int[] prices) {
        /**
         * Calculate maximum profit with at most k transactions.
         *
         * @param k Maximum number of transactions allowed
         * @param prices Array of stock prices for each day
         * @return Maximum achievable profit
         */
        int n = prices.length;

        // If no prices or k is 0, profit is 0
        if (n <= 1 || k == 0) {
            return 0;
        }

        // If k is large enough, we can make unlimited transactions
        // Maximum possible transactions is n/2 (buy-sell pairs)
        if (k >= n / 2) {
            // Use greedy approach for unlimited transactions
            int profit = 0;
            for (int i = 1; i < n; i++) {
                // Buy whenever price increases from previous day
                if (prices[i] > prices[i - 1]) {
                    profit += prices[i] - prices[i - 1];
                }
            }
            return profit;
        }

        // DP arrays: we only need previous day's values, so we can optimize space
        // notHold[j] = max profit with j transactions, not holding stock
        // hold[j] = max profit with j transactions, holding stock
        int[] notHold = new int[k + 1];
        int[] hold = new int[k + 1];

        // Initialize hold array to negative infinity (except hold[0])
        for (int j = 0; j <= k; j++) {
            hold[j] = Integer.MIN_VALUE;
        }

        for (int price : prices) {
            // Process transactions in reverse to avoid using updated values
            // for the same day (which would allow multiple transactions in one day)
            for (int j = k; j > 0; j--) {
                // Update notHold state: either stay not holding or sell today
                notHold[j] = Math.max(notHold[j], hold[j] + price);

                // Update hold state: either stay holding or buy today
                // Buying uses one transaction (j-1), so we check notHold[j-1]
                hold[j] = Math.max(hold[j], notHold[j - 1] - price);
            }
        }

        // Maximum profit is when we're not holding any stock
        return notHold[k];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × min(k, n/2))

- We iterate through all `n` days
- For each day, we iterate through up to `min(k, n/2)` transactions
- The `min(k, n/2)` comes from the optimization: if `k ≥ n/2`, we use the O(n) greedy approach
- In the worst case where `k` is moderate, complexity is O(nk)

**Space Complexity:** O(min(k, n/2))

- We maintain two arrays of size `k+1` for the DP states
- When `k ≥ n/2`, we use O(1) space for the greedy approach
- We could use O(nk) space with a 2D DP table, but the optimized version only needs O(k) space

## Common Mistakes

1. **Not handling large k efficiently**: When `k ≥ n/2`, the problem reduces to unlimited transactions. Without this optimization, the O(nk) solution becomes O(n²) which can be too slow for large n.

2. **Processing transactions in the wrong order**: When updating the DP arrays, we must process `j` from `k` down to 1. If we go from 1 to `k`, we might use the updated `notHold[j-1]` value (from the same day) to compute `hold[j]`, which would allow buying and selling on the same day—not allowed.

3. **Incorrect initialization of hold array**: The `hold` array should be initialized to negative infinity (or a very small number) because initially we can't be holding stock without having made any transactions. Using 0 would incorrectly allow "free" stock acquisition.

4. **Forgetting edge cases**: Empty price array, single price, or `k = 0` should return 0 profit. Always check these at the beginning.

## When You'll See This Pattern

This dynamic programming pattern with state machines appears in several stock trading problems:

1. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)**: Similar state machine but with an additional "cooldown" state after selling.

2. **Best Time to Buy and Sell Stock with Transaction Fee (LeetCode 714)**: Similar structure but subtracts a fee on each transaction.

3. **Best Time to Buy and Sell Stock III (LeetCode 123)**: This is a special case where `k = 2`. The same DP approach works but can be optimized further for this specific case.

The core pattern is: when you need to track sequences of events with constraints (like transaction limits), consider a DP approach where states represent different "modes" you can be in at each step.

## Key Takeaways

1. **State machine DP is powerful for sequence problems**: When you have a sequence of decisions with different "states" (like holding/not holding stock), DP with state transitions often provides an efficient solution.

2. **Optimize for edge cases**: Always check if the problem simplifies in certain parameter ranges (like large `k` here). These optimizations can dramatically improve performance.

3. **Space optimization is often possible**: Many DP problems that seem to need 2D or 3D tables can be optimized to use 1D or 2D arrays by noticing that we only need information from the previous step.

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock)
