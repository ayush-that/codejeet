---
title: "How to Solve Minimum Money Required Before Transactions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Money Required Before Transactions. Hard difficulty, 42.0% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2026-03-14"
category: "dsa-patterns"
tags: ["minimum-money-required-before-transactions", "array", "greedy", "sorting", "hard"]
---

# How to Solve Minimum Money Required Before Transactions

This problem asks us to find the minimum starting money needed to complete all transactions in any order, where each transaction `[cost, cashback]` requires you to have at least `cost` money before the transaction, and after completing it, you get `cashback` added to your current money. The challenge is that the order matters significantly—some transactions might leave you with more money afterward (when cashback > cost), while others might leave you with less (when cost > cashback). The tricky part is figuring out the optimal sequence that minimizes the required starting capital.

## Visual Walkthrough

Let's walk through a concrete example: `transactions = [[2,1], [5,6], [4,3]]`

**Step 1: Understanding transaction types**

- Transaction 0: [2,1] → costs 2, gives back 1 → net loss of 1
- Transaction 1: [5,6] → costs 5, gives back 6 → net gain of 1
- Transaction 2: [4,3] → costs 4, gives back 3 → net loss of 1

**Step 2: Intuition about ordering**
Transactions that give net gain (cashback > cost) are beneficial—we want to do them when we have enough money, as they increase our balance. Transactions that cause net loss (cost > cashback) are harmful—we want to minimize their impact.

**Step 3: Trying different orders**
Let's try ordering all loss transactions first:

1. Do [2,1]: Need at least 2 money → after: money = money - 1
2. Do [4,3]: Need at least max(4, current money) → after: money = money - 1
3. Do [5,6]: Need at least max(5, current money) → after: money = money + 1

If we start with 4 money:

- After [2,1]: 4 - 1 = 3
- After [4,3]: Need 4, have 3 → FAIL! Need more starting money.

**Step 4: The key insight**
For loss transactions, we should sort them by **cashback descending** (not by cost!). Why? Because when we do a loss transaction, our money decreases by (cost - cashback). The cashback determines how much "cushion" we have left for subsequent transactions. Higher cashback means we keep more money after the transaction.

**Step 5: Optimal ordering**

1. Sort loss transactions by cashback descending: [4,3] then [2,1]
2. Do gain transactions in any order (they increase money)

Try starting with 5 money:

- Do [4,3]: Need 5 ≥ 4 → after: 5 - 1 = 4
- Do [2,1]: Need 4 ≥ 2 → after: 4 - 1 = 3
- Do [5,6]: Need max(5, 3) = 5 → after: 3 + 1 = 4 ✓

Minimum starting money is 5.

## Brute Force Approach

The brute force approach would try all permutations of transactions (n! possibilities) and compute the minimum starting money needed for each ordering. For each permutation, we would simulate the transactions, tracking the current money and checking if we have enough for each transaction's cost.

Why this fails:

- With n transactions, there are n! possible orderings
- For n = 10, that's 3.6 million orderings
- For n = 20, that's 2.4 × 10¹⁸ orderings—completely infeasible
- Time complexity: O(n! × n) which grows astronomically

Even for small n, this approach is impractical. We need a smarter strategy that doesn't require checking every permutation.

## Optimized Approach

The optimal solution uses a **greedy sorting strategy** with careful analysis:

**Key Insight 1: Separate transactions into two groups**

- **Gain transactions**: cashback ≥ cost (net gain or break-even)
- **Loss transactions**: cost > cashback (net loss)

**Key Insight 2: Process loss transactions first**
Since loss transactions decrease our money, we want to handle them while we have the maximum possible starting capital. Gain transactions increase our money, so we can do them afterward when we might need the extra boost.

**Key Insight 3: Sort loss transactions by cashback descending**
For loss transactions, we care about the cashback amount because:

- After a loss transaction, our money decreases by (cost - cashback)
- The cashback is what remains in our account after paying the cost
- Higher cashback means we keep more money for subsequent transactions
- This is counterintuitive—many candidates mistakenly sort by cost ascending

**Key Insight 4: Calculate required starting money**
We simulate the optimal order:

1. All loss transactions sorted by cashback descending
2. All gain transactions in any order

The minimum starting money is the maximum of:

- The peak money needed during the simulation
- The maximum cost among gain transactions (since we might do them last)

**Why this works:**
By doing loss transactions first with highest cashback, we minimize the "dip" in our money balance. Gain transactions at the end ensure we finish with maximum possible money, but we need to ensure we have enough for the largest gain transaction's cost.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1)
def minimumMoney(transactions):
    """
    Calculate minimum starting money to complete all transactions.

    Strategy:
    1. Separate transactions into gain (cashback >= cost) and loss (cost > cashback)
    2. Sort loss transactions by cashback in descending order
    3. Process all loss transactions first, then gain transactions
    4. Track the peak money needed during simulation

    Args:
        transactions: List[List[int]] where each inner list is [cost, cashback]

    Returns:
        int: Minimum starting money required
    """
    total_loss = 0
    max_gain_cost = 0
    max_loss_cashback = 0

    for cost, cashback in transactions:
        if cashback >= cost:
            # Gain transaction: cashback >= cost
            # We can do these last, just need to cover the maximum cost
            max_gain_cost = max(max_gain_cost, cost)
        else:
            # Loss transaction: cost > cashback
            # We lose (cost - cashback) money from these
            total_loss += cost - cashback
            # For loss transactions, track max cashback
            # This helps determine the worst-case starting requirement
            max_loss_cashback = max(max_loss_cashback, cashback)

    # The minimum starting money must cover:
    # 1. All the money we'll lose from loss transactions (total_loss)
    # 2. Plus enough to cover either:
    #    a) The maximum cashback from loss transactions (if we start with a loss)
    #    b) The maximum cost from gain transactions (if we start with a gain)
    # We take the maximum of these two scenarios
    return total_loss + max(max_gain_cost, max_loss_cashback)
```

```javascript
// Time: O(n log n) | Space: O(1)
/**
 * Calculate minimum starting money to complete all transactions.
 *
 * Strategy:
 * 1. Separate transactions into gain (cashback >= cost) and loss (cost > cashback)
 * 2. Sort loss transactions by cashback in descending order
 * 3. Process all loss transactions first, then gain transactions
 * 4. Track the peak money needed during simulation
 *
 * @param {number[][]} transactions - Array of [cost, cashback] pairs
 * @return {number} Minimum starting money required
 */
function minimumMoney(transactions) {
  let totalLoss = 0;
  let maxGainCost = 0;
  let maxLossCashback = 0;

  // Process each transaction to categorize and collect statistics
  for (const [cost, cashback] of transactions) {
    if (cashback >= cost) {
      // Gain transaction: cashback >= cost
      // Track the maximum cost among gain transactions
      maxGainCost = Math.max(maxGainCost, cost);
    } else {
      // Loss transaction: cost > cashback
      // Add to total money lost from all loss transactions
      totalLoss += cost - cashback;
      // Track maximum cashback among loss transactions
      maxLossCashback = Math.max(maxLossCashback, cashback);
    }
  }

  // Minimum starting money = total money lost + max of (max gain cost or max loss cashback)
  // This covers the worst-case scenario in the optimal ordering
  return totalLoss + Math.max(maxGainCost, maxLossCashback);
}
```

```java
// Time: O(n log n) | Space: O(1)
class Solution {
    /**
     * Calculate minimum starting money to complete all transactions.
     *
     * Strategy:
     * 1. Separate transactions into gain (cashback >= cost) and loss (cost > cashback)
     * 2. Sort loss transactions by cashback in descending order
     * 3. Process all loss transactions first, then gain transactions
     * 4. Track the peak money needed during simulation
     *
     * @param transactions 2D array where each inner array is [cost, cashback]
     * @return Minimum starting money required
     */
    public long minimumMoney(int[][] transactions) {
        long totalLoss = 0;
        int maxGainCost = 0;
        int maxLossCashback = 0;

        // Iterate through all transactions
        for (int[] transaction : transactions) {
            int cost = transaction[0];
            int cashback = transaction[1];

            if (cashback >= cost) {
                // Gain transaction: cashback >= cost
                // Update maximum cost among gain transactions
                maxGainCost = Math.max(maxGainCost, cost);
            } else {
                // Loss transaction: cost > cashback
                // Add to cumulative loss from all loss transactions
                totalLoss += cost - cashback;
                // Update maximum cashback among loss transactions
                maxLossCashback = Math.max(maxLossCashback, cashback);
            }
        }

        // The minimum starting money must cover:
        // 1. All losses from loss transactions
        // 2. Plus the maximum of (max gain cost, max loss cashback)
        // This represents the worst-case money needed at any point
        return totalLoss + Math.max(maxGainCost, maxLossCashback);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the transactions once: O(n)
- No sorting is actually needed in the implementation above since we only track maximum values
- Each transaction is processed in constant time
- Total: O(n)

**Space Complexity: O(1)**

- We use only a few variables to track:
  - `total_loss`: cumulative money lost from loss transactions
  - `max_gain_cost`: maximum cost among gain transactions
  - `max_loss_cashback`: maximum cashback among loss transactions
- No additional data structures proportional to n
- Total: O(1) extra space

**Why O(n) not O(n log n):**
The intuitive solution suggests sorting loss transactions by cashback, but we don't actually need to sort them. We only need:

1. The sum of (cost - cashback) for all loss transactions
2. The maximum cashback among loss transactions
3. The maximum cost among gain transactions

These can be collected in a single pass without sorting.

## Common Mistakes

1. **Sorting loss transactions by cost instead of cashback**: This is the most common error. Candidates intuitively think "do cheaper transactions first," but for loss transactions, higher cashback leaves more money for subsequent transactions. Example: [10,1] vs [5,4] — [5,4] should come first even though it costs less, because it leaves you with 4 instead of 1.

2. **Not separating gain and loss transactions**: Some candidates try to sort all transactions by a single metric like (cost - cashback) or cost/cashback ratio. This doesn't work because gain and loss transactions have fundamentally different behaviors.

3. **Forgetting to handle the case where all transactions are gains**: When there are no loss transactions, `max_loss_cashback` remains 0, and the answer should be `max_gain_cost`. Our formula handles this correctly: `total_loss = 0`, so result = `max(max_gain_cost, 0)` = `max_gain_cost`.

4. **Integer overflow with large sums**: The total loss can be large (up to n × 10⁹), so use 64-bit integers (long in Java/C++, long long in C). Python handles big integers natively.

## When You'll See This Pattern

This greedy sorting pattern appears in several scheduling and sequencing problems:

1. **Maximum Profit in Job Scheduling (LeetCode 1235)**: Similar concept of choosing optimal order to maximize profit given constraints.

2. **Video Stitching (LeetCode 1024)**: Requires sorting intervals and making greedy choices about coverage.

3. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)**: Another interval problem where sorting order matters for optimal solution.

4. **Task Scheduler (LeetCode 621)**: Requires arranging tasks to minimize idle time, using frequency-based greedy approach.

The core pattern is: when order matters and you need to minimize/maximize some value, often a greedy approach with careful sorting criteria works. Look for problems where items have "cost" and "benefit" components that interact based on sequence.

## Key Takeaways

1. **Separate and conquer**: When transactions have different behaviors (gain vs loss), handle them separately with different strategies.

2. **Greedy sorting by secondary metric**: For loss transactions, sorting by cashback (not cost) is counterintuitive but correct. Always question your first intuition about sorting criteria.

3. **Track only what's necessary**: You don't need to simulate the entire sequence or sort arrays if you can derive the answer from aggregated statistics (sum of losses, maximum values).

4. **Consider edge cases explicitly**: All gains, all losses, single transaction, large values—test these mentally before coding.

[Practice this problem on CodeJeet](/problem/minimum-money-required-before-transactions)
