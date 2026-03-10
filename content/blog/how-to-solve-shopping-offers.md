---
title: "How to Solve Shopping Offers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shopping Offers. Medium difficulty, 52.3% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Memoization."
date: "2027-11-13"
category: "dsa-patterns"
tags: ["shopping-offers", "array", "dynamic-programming", "backtracking", "medium"]
---

## How to Solve Shopping Offers

You're given a shopping cart with `n` items, each with a regular price, and some special offers that bundle multiple items at a discount. Your task is to find the minimum cost to purchase exactly the items in your shopping list. The challenge lies in figuring out which combination of offers and regular prices gives you the best deal, especially when offers can be used multiple times and items can be purchased individually.

**What makes this tricky:** You need to consider all possible combinations of offers and individual purchases. Offers can be applied multiple times, and you must buy exactly the required quantities—no more, no less. This creates a combinatorial search space that requires careful exploration.

---

## Visual Walkthrough

Let's walk through a concrete example:

**Input:**

- `price = [2, 5]` (item 0 costs $2, item 1 costs $5)
- `special = [[3, 0, 5], [1, 2, 10]]`
  - Offer 1: 3 of item 0 + 0 of item 1 for $5
  - Offer 2: 1 of item 0 + 2 of item 1 for $10
- `needs = [3, 2]` (we need 3 of item 0 and 2 of item 1)

**Step-by-step reasoning:**

1. **Initial state:** We need [3, 2]. What are our options?
   - Buy everything at regular price: (3 × $2) + (2 × $5) = $6 + $10 = $16
   - Use Offer 1 once: After using [3, 0] for $5, we still need [0, 2]. Then buy 2 of item 1 at regular price: $5 + (2 × $5) = $15
   - Use Offer 2 once: After using [1, 2] for $10, we still need [2, 0]. Then buy 2 of item 0 at regular price: $10 + (2 × $2) = $14
   - Use Offer 1 once AND Offer 2 once: [3, 0] + [1, 2] = [4, 2] → exceeds our needs for item 0 (we only need 3)
   - Use Offer 2 twice: [1, 2] × 2 = [2, 4] → exceeds our needs for item 1 (we only need 2)

2. **Key insight:** We need to try all valid combinations:
   - Try each offer if it doesn't exceed our needs
   - Subtract the offer's items from our needs
   - Recursively find the minimum cost for the reduced needs
   - Compare with buying everything at regular price

3. **Optimal path:**
   - Start with needs [3, 2]
   - Try Offer 2: cost = $10 + minCost([2, 0])
     - For [2, 0]: Try Offer 1? [3, 0] exceeds item 0 need
     - Regular price: (2 × $2) + (0 × $5) = $4
     - So minCost([2, 0]) = $4
     - Total = $10 + $4 = $14
   - This is better than $16 (regular price) and $15 (Offer 1 only)

The minimum cost is $14.

---

## Brute Force Approach

The brute force approach would try every possible combination of offers:

1. For each offer, decide how many times to use it (0, 1, 2, ... until it exceeds needs)
2. For each combination, calculate the total cost
3. Take the minimum

**Why this is too slow:** If we have `m` offers and maximum quantity `q` for any item, we could try up to `q` times for each offer. That's `O(q^m)` combinations—exponential time. For example, with 10 offers and quantities up to 10, that's 10¹⁰ = 10 billion combinations!

---

## Optimized Approach

The key insight is that this is a **state search problem** where:

- The "state" is our current needs array
- We can transition by applying an offer (if valid) or buying remaining items at regular price
- We want the minimum cost from the initial state to the zero state

This is perfect for **memoized recursion (top-down DP)**:

1. Use DFS to explore all valid offer applications
2. At each state (needs array), calculate:
   - Cost of buying all remaining items at regular price (base case)
   - For each valid offer: cost = offerPrice + minCost(newNeeds)
   - Take the minimum of all options
3. Memoize results to avoid recomputing the same needs state

**Why memoization works:** Different sequences of offers can lead to the same remaining needs. For example, applying Offer A then Offer B might leave the same needs as applying Offer B then Offer A. Memoization saves us from recomputing.

---

## Optimal Solution

We'll use DFS with memoization. The state is represented as a tuple of needs (for hashing in memo dictionary).

<div class="code-group">

```python
# Time: O(n * m * k^n) where n=#items, m=#offers, k=max quantity
# Space: O(k^n) for memoization
class Solution:
    def shoppingOffers(self, price, special, needs):
        # Memoization dictionary: (needs_tuple) -> min_cost
        memo = {}

        def dfs(curr_needs):
            # Convert to tuple for hashing
            state = tuple(curr_needs)

            # Check if we've computed this state before
            if state in memo:
                return memo[state]

            # Option 1: Buy all remaining items at regular price
            regular_cost = 0
            for i in range(len(curr_needs)):
                regular_cost += curr_needs[i] * price[i]
            min_cost = regular_cost

            # Option 2: Try each special offer
            for offer in special:
                # Check if we can use this offer
                valid = True
                new_needs = curr_needs[:]  # Make a copy

                for i in range(len(curr_needs)):
                    # Offer provides more items than we need?
                    if offer[i] > curr_needs[i]:
                        valid = False
                        break
                    # Subtract offer items from needs
                    new_needs[i] = curr_needs[i] - offer[i]

                if valid:
                    # Recursively find min cost for reduced needs
                    # offer[-1] is the offer price
                    cost_with_offer = offer[-1] + dfs(new_needs)
                    min_cost = min(min_cost, cost_with_offer)

            # Memoize and return result
            memo[state] = min_cost
            return min_cost

        # Start DFS from initial needs
        return dfs(needs)
```

```javascript
// Time: O(n * m * k^n) where n=#items, m=#offers, k=max quantity
// Space: O(k^n) for memoization
var shoppingOffers = function (price, special, needs) {
  // Memoization map: needs_string -> min_cost
  const memo = new Map();

  const dfs = (currNeeds) => {
    // Convert needs array to string for use as map key
    const stateKey = currNeeds.join(",");

    // Check memoization
    if (memo.has(stateKey)) {
      return memo.get(stateKey);
    }

    // Option 1: Buy all at regular price
    let regularCost = 0;
    for (let i = 0; i < currNeeds.length; i++) {
      regularCost += currNeeds[i] * price[i];
    }
    let minCost = regularCost;

    // Option 2: Try each special offer
    for (const offer of special) {
      // Check if offer is valid (doesn't exceed needs)
      let valid = true;
      const newNeeds = [...currNeeds]; // Copy array

      for (let i = 0; i < currNeeds.length; i++) {
        if (offer[i] > currNeeds[i]) {
          valid = false;
          break;
        }
        newNeeds[i] = currNeeds[i] - offer[i];
      }

      if (valid) {
        // offer[offer.length-1] is the offer price
        const costWithOffer = offer[offer.length - 1] + dfs(newNeeds);
        minCost = Math.min(minCost, costWithOffer);
      }
    }

    // Memoize and return
    memo.set(stateKey, minCost);
    return minCost;
  };

  return dfs(needs);
};
```

```java
// Time: O(n * m * k^n) where n=#items, m=#offers, k=max quantity
// Space: O(k^n) for memoization
import java.util.*;

class Solution {
    public int shoppingOffers(List<Integer> price, List<List<Integer>> special, List<Integer> needs) {
        // Memoization map: needs_string -> min_cost
        Map<String, Integer> memo = new HashMap<>();
        return dfs(price, special, needs, memo);
    }

    private int dfs(List<Integer> price, List<List<Integer>> special,
                    List<Integer> needs, Map<String, Integer> memo) {
        // Convert needs to string for memoization key
        String key = needs.toString();
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        // Option 1: Buy all at regular price
        int regularCost = 0;
        for (int i = 0; i < needs.size(); i++) {
            regularCost += needs.get(i) * price.get(i);
        }
        int minCost = regularCost;

        // Option 2: Try each special offer
        for (List<Integer> offer : special) {
            // Check if offer is valid
            boolean valid = true;
            List<Integer> newNeeds = new ArrayList<>(needs);

            for (int i = 0; i < needs.size(); i++) {
                if (offer.get(i) > needs.get(i)) {
                    valid = false;
                    break;
                }
                newNeeds.set(i, needs.get(i) - offer.get(i));
            }

            if (valid) {
                // Last element of offer is the price
                int costWithOffer = offer.get(offer.size() - 1) +
                                    dfs(price, special, newNeeds, memo);
                minCost = Math.min(minCost, costWithOffer);
            }
        }

        // Memoize and return
        memo.put(key, minCost);
        return minCost;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** `O(n * m * k^n)` where:

- `n` = number of items
- `m` = number of special offers
- `k` = maximum quantity needed for any item

**Why:** In the worst case, we explore all possible needs states. Each item can have 0 to `k` quantities, so there are `(k+1)^n ≈ k^n` possible states. For each state, we try all `m` offers, and checking each offer takes `O(n)` time.

**Space Complexity:** `O(k^n)` for the memoization dictionary storing all possible states.

**Note:** In practice, this is much faster than brute force because:

1. We prune invalid offers (those exceeding needs)
2. Memoization avoids recomputation
3. Real-world `k` values are small (typically ≤ 10)

---

## Common Mistakes

1. **Forgetting to consider buying items individually:** Some candidates only try special offers and forget that buying at regular price is always an option. Always include the "buy all at regular price" base case.

2. **Allowing negative needs:** When subtracting offer items, ensure you don't go below zero. The check `if offer[i] > curr_needs[i]` prevents this.

3. **Not memoizing properly:** Using the needs array directly as a dictionary key won't work in Python (lists aren't hashable). Convert to tuple first. In Java, use `needs.toString()` or a custom key.

4. **Modifying the original needs array:** Always create a copy before subtracting offer items. Modifying in-place affects subsequent iterations and recursive calls.

---

## When You'll See This Pattern

This **state-space search with memoization** pattern appears in problems where:

- You have a state that changes with decisions
- Multiple decision sequences can lead to the same state
- You need to find the minimum/maximum cost/value

**Related LeetCode problems:**

1. **Coin Change (LC 322):** Similar state (remaining amount), transitions (using coins), goal (minimum coins). Both use DP on the "remaining" value.

2. **Target Sum (LC 494):** State is current sum, transitions are +/- numbers. Memoization avoids recomputing the same sum.

3. **Partition Equal Subset Sum (LC 416):** State is current subset sum, explore include/exclude decisions for each number.

The core technique is representing the problem state compactly and using memoization to avoid exponential blowup.

---

## Key Takeaways

1. **State representation matters:** In this problem, the needs array perfectly captures the state. Look for compact representations in other problems too.

2. **Memoization turns exponential into manageable:** When multiple paths lead to the same state, memoization saves enormous computation. Always ask: "Can different decision sequences lead to the same situation?"

3. **DFS + memoization = top-down DP:** This approach is often more intuitive than bottom-up DP. Start with the full problem, break it down recursively, and let memoization handle overlapping subproblems.

[Practice this problem on CodeJeet](/problem/shopping-offers)
