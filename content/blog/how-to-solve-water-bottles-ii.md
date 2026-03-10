---
title: "How to Solve Water Bottles II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Water Bottles II. Medium difficulty, 78.2% acceptance rate. Topics: Math, Simulation."
date: "2026-06-06"
category: "dsa-patterns"
tags: ["water-bottles-ii", "math", "simulation", "medium"]
---

# How to Solve Water Bottles II

Water Bottles II is a simulation problem where you start with `numBottles` full bottles and can either drink them (turning them into empty bottles) or exchange `numExchange` empty bottles for one new full bottle. The goal is to maximize the total number of bottles you can drink. What makes this problem interesting is that it's not just about repeatedly exchanging bottles until you can't anymore—you need to strategically decide when to drink bottles versus when to save them for exchanges to maximize your total consumption.

## Visual Walkthrough

Let's trace through an example with `numBottles = 9` and `numExchange = 3`:

**Step 1:** Start with 9 full bottles, 0 empty bottles.  
We could drink all 9 immediately, but that would give us only 9 total drinks. Instead, let's be strategic.

**Step 2:** Drink 8 bottles, leaving 1 full bottle.  
Now we have: 1 full bottle, 8 empty bottles.  
Total drinks so far: 8

**Step 3:** Exchange 6 empty bottles (3 × 2) for 2 new full bottles.  
Now we have: 1 + 2 = 3 full bottles, 8 - 6 = 2 empty bottles.  
Total drinks: still 8

**Step 4:** Drink 2 bottles, leaving 1 full bottle.  
Now we have: 1 full bottle, 2 + 2 = 4 empty bottles.  
Total drinks: 8 + 2 = 10

**Step 5:** Exchange 3 empty bottles for 1 new full bottle.  
Now we have: 1 + 1 = 2 full bottles, 4 - 3 = 1 empty bottle.  
Total drinks: still 10

**Step 6:** Drink 1 bottle, leaving 1 full bottle.  
Now we have: 1 full bottle, 1 + 1 = 2 empty bottles.  
Total drinks: 10 + 1 = 11

**Step 7:** Can't exchange (need 3 empty bottles, only have 2).  
Drink the last full bottle.  
Now we have: 0 full bottles, 2 + 1 = 3 empty bottles.  
Total drinks: 11 + 1 = 12

**Final result:** 12 total drinks.

The key insight is that we should always keep exactly 1 full bottle until the very end, because having a full bottle prevents us from accumulating enough empty bottles to exchange. By drinking all but one bottle each round, we maximize empty bottle accumulation while maintaining the ability to continue the process.

## Brute Force Approach

A naive approach might try to simulate every possible sequence of drinking and exchanging operations. However, this would be extremely inefficient because at each step we have multiple choices:

1. Drink any number of full bottles (from 0 to all of them)
2. Exchange if we have enough empty bottles

The branching factor makes this approach exponential in time complexity. Even with memoization, the state space would be large since we need to track both full and empty bottle counts.

Another brute force approach would be to try drinking different numbers of bottles at each step, but without the key insight about always keeping one full bottle, this would still be inefficient and difficult to implement correctly.

## Optimized Approach

The optimal solution comes from recognizing a greedy strategy: **always drink all but one full bottle, then exchange as many times as possible, repeat until you can't exchange anymore.**

Here's why this works:

1. If you drink a bottle, it becomes empty and contributes to your total drinks
2. If you exchange empty bottles, you get new full bottles that can be drunk later
3. Keeping exactly one full bottle ensures you always have the option to continue the process
4. Drinking all but one maximizes the number of empty bottles you accumulate each round, which maximizes future exchanges

The algorithm proceeds as:

1. Start with `full = numBottles`, `empty = 0`, `total = 0`
2. While we can continue (either have full bottles to drink or can exchange):
   - Drink all but one full bottle (add to total, convert to empty)
   - Exchange as many times as possible (convert empty to full)
3. At the very end, drink the last full bottle

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(numBottles) base numExchange) | Space: O(1)
def maxBottlesDrunk(numBottles: int, numExchange: int) -> int:
    """
    Maximize total bottles drunk by strategically drinking and exchanging.

    Strategy: Always keep exactly 1 full bottle until the very end.
    This maximizes empty bottle accumulation for exchanges.
    """
    full = numBottles  # Current full bottles
    empty = 0          # Current empty bottles
    total = 0          # Total bottles drunk

    # Continue while we can either drink or exchange
    while full > 0 or empty >= numExchange:
        # Drink all but one full bottle (if we have more than 1)
        if full > 1:
            # We drink (full - 1) bottles
            total += full - 1
            # Those become empty bottles
            empty += full - 1
            # We keep 1 full bottle
            full = 1

        # Exchange as many times as possible
        if empty >= numExchange:
            # Calculate how many exchanges we can do
            exchanges = empty // numExchange
            # Each exchange gives 1 full bottle
            full += exchanges
            # Remove exchanged empty bottles
            empty -= exchanges * numExchange

        # If we can't exchange anymore and have 1 full bottle left
        if full == 1 and empty < numExchange:
            # Drink the last full bottle
            total += 1
            empty += 1
            full = 0

    return total
```

```javascript
// Time: O(log(numBottles) base numExchange) | Space: O(1)
function maxBottlesDrunk(numBottles, numExchange) {
  /**
   * Maximize total bottles drunk by strategically drinking and exchanging.
   *
   * Strategy: Always keep exactly 1 full bottle until the very end.
   * This maximizes empty bottle accumulation for exchanges.
   */
  let full = numBottles; // Current full bottles
  let empty = 0; // Current empty bottles
  let total = 0; // Total bottles drunk

  // Continue while we can either drink or exchange
  while (full > 0 || empty >= numExchange) {
    // Drink all but one full bottle (if we have more than 1)
    if (full > 1) {
      // We drink (full - 1) bottles
      total += full - 1;
      // Those become empty bottles
      empty += full - 1;
      // We keep 1 full bottle
      full = 1;
    }

    // Exchange as many times as possible
    if (empty >= numExchange) {
      // Calculate how many exchanges we can do
      const exchanges = Math.floor(empty / numExchange);
      // Each exchange gives 1 full bottle
      full += exchanges;
      // Remove exchanged empty bottles
      empty -= exchanges * numExchange;
    }

    // If we can't exchange anymore and have 1 full bottle left
    if (full === 1 && empty < numExchange) {
      // Drink the last full bottle
      total += 1;
      empty += 1;
      full = 0;
    }
  }

  return total;
}
```

```java
// Time: O(log(numBottles) base numExchange) | Space: O(1)
class Solution {
    public int maxBottlesDrunk(int numBottles, int numExchange) {
        /**
         * Maximize total bottles drunk by strategically drinking and exchanging.
         *
         * Strategy: Always keep exactly 1 full bottle until the very end.
         * This maximizes empty bottle accumulation for exchanges.
         */
        int full = numBottles;  // Current full bottles
        int empty = 0;          // Current empty bottles
        int total = 0;          // Total bottles drunk

        // Continue while we can either drink or exchange
        while (full > 0 || empty >= numExchange) {
            // Drink all but one full bottle (if we have more than 1)
            if (full > 1) {
                // We drink (full - 1) bottles
                total += full - 1;
                // Those become empty bottles
                empty += full - 1;
                // We keep 1 full bottle
                full = 1;
            }

            // Exchange as many times as possible
            if (empty >= numExchange) {
                // Calculate how many exchanges we can do
                int exchanges = empty / numExchange;
                // Each exchange gives 1 full bottle
                full += exchanges;
                // Remove exchanged empty bottles
                empty -= exchanges * numExchange;
            }

            // If we can't exchange anymore and have 1 full bottle left
            if (full == 1 && empty < numExchange) {
                // Drink the last full bottle
                total += 1;
                empty += 1;
                full = 0;
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(numBottles) base numExchange)  
Each iteration of the loop either drinks bottles or performs exchanges. The number of full bottles grows geometrically with each exchange round (similar to compound interest). In the worst case, each exchange gives us only 1 new full bottle, so we need O(log(numBottles)) iterations. More precisely, if numExchange > 1, the number of iterations is logarithmic in the initial number of bottles.

**Space Complexity:** O(1)  
We only use a constant amount of extra space to store the counts of full bottles, empty bottles, and total drunk. No additional data structures are needed.

## Common Mistakes

1. **Drinking all bottles immediately:** The most common mistake is to drink everything first, then try to exchange. This fails because you lose the opportunity to use the "keep one full bottle" strategy that maximizes exchanges.

2. **Infinite loop with edge cases:** Forgetting to handle the case where `numExchange = 1` or `numExchange = 0` (though constraints typically prevent 0). When `numExchange = 1`, you can exchange 1 empty for 1 full indefinitely, so you need to recognize this leads to infinite drinks.

3. **Off-by-one errors in the drinking logic:** Accidentally drinking the last full bottle too early or keeping too many full bottles. The key is to always keep exactly 1 full bottle until no more exchanges are possible.

4. **Not using integer division correctly:** When calculating how many exchanges can be performed, using floating-point division instead of integer division can lead to incorrect results.

## When You'll See This Pattern

This problem uses a **greedy simulation with state tracking** pattern, which appears in several other LeetCode problems:

1. **Water Bottles (Easy)** - The simpler version where you must drink all bottles before exchanging. This is a good warm-up problem that helps understand the basic exchange mechanism.

2. **Broken Calculator (Medium)** - Similar state transformation problem where you work backwards from target to start value using greedy operations.

3. **Minimum Operations to Reduce X to Zero (Medium)** - While not identical, it involves making optimal choices at each step to achieve a goal, similar to deciding when to drink vs. exchange.

The core pattern involves maintaining a current state (full/empty bottles) and applying optimal operations greedily until reaching a terminal state.

## Key Takeaways

1. **Greedy strategies often work for optimization problems** where local optimal choices lead to global optimum. Always test if a greedy approach works before trying more complex algorithms.

2. **State tracking is crucial** for simulation problems. Clearly define what state variables you need (full count, empty count, total drunk) and how operations transform them.

3. **Look for invariant patterns** - in this case, "always keep one full bottle" is the key invariant that maximizes the process. Finding such invariants can simplify complex problems significantly.

Related problems: [Water Bottles](/problem/water-bottles)
