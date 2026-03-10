---
title: "How to Solve Maximize the Profit as the Salesman — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize the Profit as the Salesman. Medium difficulty, 38.0% acceptance rate. Topics: Array, Hash Table, Binary Search, Dynamic Programming, Sorting."
date: "2029-07-05"
category: "dsa-patterns"
tags: ["maximize-the-profit-as-the-salesman", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve "Maximize the Profit as the Salesman"

You're given `n` houses in a line and multiple purchase offers, each offering gold for a contiguous range of houses. Each house can be sold to at most one buyer. Your goal is to maximize your total gold by selecting non-overlapping offers. The challenge lies in efficiently navigating overlapping offers and making optimal choices—this is essentially a weighted interval scheduling problem with a twist.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

```
n = 5
offers = [[0,0,5], [0,2,10], [1,3,15], [2,4,20]]
```

We have 5 houses (0-4) and 4 offers. Let's visualize them:

```
Houses:   0   1   2   3   4
Offer 0:  [5]                → 5 gold for house 0 only
Offer 1:  [  10  ]           → 10 gold for houses 0-2
Offer 2:      [  15  ]       → 15 gold for houses 1-3
Offer 3:          [  20  ]   → 20 gold for houses 2-4
```

We need to select non-overlapping offers. Let's think through possibilities:

1. If we take Offer 3 (houses 2-4, 20 gold), we can't take Offers 0, 1, or 2 since they all overlap with houses 2-4.
2. If we take Offer 2 (houses 1-3, 15 gold), we could also take Offer 0 (house 0, 5 gold) for total 20 gold.
3. If we take Offer 1 (houses 0-2, 10 gold), we could take no other offers.
4. If we take Offer 0 (house 0, 5 gold), we could take Offer 3 (houses 2-4, 20 gold) for total 25 gold.

The optimal solution is Offer 0 + Offer 3 = 25 gold. Notice we need to consider not just individual offers but combinations where offers don't overlap.

## Brute Force Approach

A brute force approach would try all possible combinations of offers, checking if they're non-overlapping and tracking the maximum gold. For each offer, we either include it or exclude it, leading to 2^m possibilities (where m = number of offers). For each combination, we'd need to check all pairs for overlaps, making this O(m² × 2^m), which is completely impractical for m up to 10^5.

Even a smarter brute force that tries to build chains of non-overlapping offers would still be exponential. The fundamental issue is that we're repeatedly solving the same subproblems: "What's the maximum profit I can get starting from house i?"

## Optimized Approach

The key insight is that this is a **dynamic programming** problem similar to weighted interval scheduling. We can sort offers by their end point and use DP to make optimal decisions.

**Step-by-step reasoning:**

1. **Sorting:** First, sort all offers by their ending house. This allows us to process houses in order and easily find offers that end before a given house starts.

2. **DP definition:** Let `dp[i]` represent the maximum gold we can obtain considering houses up to index `i` (not necessarily using house `i`). We'll build this from `dp[0]` to `dp[n-1]`.

3. **Transition:** For each house `i`, we have two choices:
   - Don't sell house `i`: Then `dp[i] = dp[i-1]` (carry forward previous maximum)
   - Sell house `i` to some offer that ends at `i`: We need to find all offers ending at house `i`, and for each, take `offer_gold + dp[start-1]` (profit from offer plus maximum profit before the offer starts)

4. **Efficient lookup:** To quickly find all offers ending at a particular house, we can group offers by their end point using a hash map or array of lists.

5. **Binary search alternative:** Another approach is to sort offers by end point and use binary search to find the last non-overlapping offer for each offer. This gives us a different DP formulation where `dp[i]` represents maximum profit considering first `i` offers.

The approach we'll implement uses the house-based DP with offers grouped by end point, which is more intuitive for this problem structure.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = number of houses, m = number of offers
# Space: O(n + m) for dp array and offers grouped by end point
def maximizeTheProfit(n, offers):
    # Group offers by their ending house for quick lookup
    # end_to_offers[i] will store all offers that end at house i
    end_to_offers = [[] for _ in range(n)]

    # Populate the grouping: for each offer, add it to the list for its end house
    for start, end, gold in offers:
        end_to_offers[end].append((start, gold))

    # dp[i] = maximum profit we can get from houses 0 to i
    dp = [0] * n

    # Process each house in order
    for i in range(n):
        # Option 1: Don't use house i at all
        # Carry forward the best profit from previous houses
        # (Handle base case for i=0 where i-1 would be out of bounds)
        dp[i] = dp[i-1] if i > 0 else 0

        # Option 2: Use house i as the end of some offer(s)
        # Check all offers that end at house i
        for start, gold in end_to_offers[i]:
            # If the offer starts at house 0, there are no houses before it
            # Otherwise, add the best profit from houses before this offer
            profit_from_before = dp[start-1] if start > 0 else 0
            # Total profit if we take this offer = gold from offer + best profit before offer starts
            total_profit = profit_from_before + gold

            # Update dp[i] if this gives us better profit
            dp[i] = max(dp[i], total_profit)

    # The answer is the maximum profit considering all houses
    return dp[n-1]
```

```javascript
// Time: O(n + m) where n = number of houses, m = number of offers
// Space: O(n + m) for dp array and offers grouped by end point
function maximizeTheProfit(n, offers) {
  // Group offers by their ending house for quick lookup
  // endToOffers[i] will store all offers that end at house i
  const endToOffers = Array.from({ length: n }, () => []);

  // Populate the grouping: for each offer, add it to the list for its end house
  for (const [start, end, gold] of offers) {
    endToOffers[end].push([start, gold]);
  }

  // dp[i] = maximum profit we can get from houses 0 to i
  const dp = new Array(n).fill(0);

  // Process each house in order
  for (let i = 0; i < n; i++) {
    // Option 1: Don't use house i at all
    // Carry forward the best profit from previous houses
    // (Handle base case for i=0 where i-1 would be out of bounds)
    dp[i] = i > 0 ? dp[i - 1] : 0;

    // Option 2: Use house i as the end of some offer(s)
    // Check all offers that end at house i
    for (const [start, gold] of endToOffers[i]) {
      // If the offer starts at house 0, there are no houses before it
      // Otherwise, add the best profit from houses before this offer
      const profitFromBefore = start > 0 ? dp[start - 1] : 0;
      // Total profit if we take this offer = gold from offer + best profit before offer starts
      const totalProfit = profitFromBefore + gold;

      // Update dp[i] if this gives us better profit
      dp[i] = Math.max(dp[i], totalProfit);
    }
  }

  // The answer is the maximum profit considering all houses
  return dp[n - 1];
}
```

```java
// Time: O(n + m) where n = number of houses, m = number of offers
// Space: O(n + m) for dp array and offers grouped by end point
public int maximizeTheProfit(int n, List<List<Integer>> offers) {
    // Group offers by their ending house for quick lookup
    // endToOffers[i] will store all offers that end at house i
    List<List<int[]>> endToOffers = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        endToOffers.add(new ArrayList<>());
    }

    // Populate the grouping: for each offer, add it to the list for its end house
    for (List<Integer> offer : offers) {
        int start = offer.get(0);
        int end = offer.get(1);
        int gold = offer.get(2);
        endToOffers.get(end).add(new int[]{start, gold});
    }

    // dp[i] = maximum profit we can get from houses 0 to i
    int[] dp = new int[n];

    // Process each house in order
    for (int i = 0; i < n; i++) {
        // Option 1: Don't use house i at all
        // Carry forward the best profit from previous houses
        // (Handle base case for i=0 where i-1 would be out of bounds)
        dp[i] = i > 0 ? dp[i - 1] : 0;

        // Option 2: Use house i as the end of some offer(s)
        // Check all offers that end at house i
        for (int[] offer : endToOffers.get(i)) {
            int start = offer[0];
            int gold = offer[1];

            // If the offer starts at house 0, there are no houses before it
            // Otherwise, add the best profit from houses before this offer
            int profitFromBefore = start > 0 ? dp[start - 1] : 0;
            // Total profit if we take this offer = gold from offer + best profit before offer starts
            int totalProfit = profitFromBefore + gold;

            // Update dp[i] if this gives us better profit
            dp[i] = Math.max(dp[i], totalProfit);
        }
    }

    // The answer is the maximum profit considering all houses
    return dp[n - 1];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Grouping offers by end point: O(m) to iterate through all offers
- DP computation: O(n) to iterate through all houses, and for each house, we process all offers ending at that house. Since each offer is processed exactly once when we reach its end house, the total work for processing offers across all houses is O(m)
- Total: O(n + m)

**Space Complexity: O(n + m)**

- `end_to_offers` data structure: O(n + m) - O(n) for the outer structure and O(m) for storing all offers
- DP array: O(n)
- Total: O(n + m)

## Common Mistakes

1. **Not sorting or grouping offers properly:** Some candidates try to process offers in random order, which makes it impossible to build the DP solution correctly. Remember: we need to process houses (or offers) in increasing order of end points to ensure we've computed all necessary subproblems.

2. **Incorrect DP transition logic:** A common error is using `dp[start]` instead of `dp[start-1]` when calculating profit from before an offer. If an offer starts at house `start`, the maximum profit from houses before it is `dp[start-1]` (houses 0 to start-1). Using `dp[start]` would incorrectly include house `start` itself.

3. **Forgetting to consider the "skip this house" option:** The DP transition has two cases: using house i for an offer, OR skipping it. Forgetting the skip case (`dp[i] = dp[i-1]`) means you might miss better solutions that don't use every house.

4. **Off-by-one errors with house indices:** Houses are 0-indexed, so when `start = 0`, there are no houses before it. Always check this boundary condition to avoid index errors.

## When You'll See This Pattern

This weighted interval scheduling pattern appears in several LeetCode problems:

1. **Maximum Profit in Job Scheduling (LeetCode 1235)** - Almost identical structure: jobs with start time, end time, and profit. The solution uses sorting by end time and binary search to find compatible previous jobs.

2. **Non-overlapping Intervals (LeetCode 435)** - A simpler version where you count minimum removals rather than maximizing profit. The greedy approach works there, but the DP approach is similar.

3. **Maximum Number of Events That Can Be Attended II (LeetCode 1751)** - Another weighted interval problem where you can attend at most k events, requiring a 2D DP approach.

The core pattern is: when you have intervals with weights and need to select non-overlapping ones to maximize total weight, think DP with sorting by end time.

## Key Takeaways

1. **Weighted interval scheduling problems** often have DP solutions where you sort by end time and decide at each point whether to take an interval ending there or skip it.

2. **The DP state typically represents** "maximum profit up to this point" (either time index or house index), and transitions consider taking an interval ending at the current point or skipping it.

3. **Preprocessing is crucial** - grouping intervals by their end point (or sorting and using binary search) enables efficient DP transitions by quickly finding compatible previous intervals.

[Practice this problem on CodeJeet](/problem/maximize-the-profit-as-the-salesman)
