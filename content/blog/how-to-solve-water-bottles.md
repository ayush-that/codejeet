---
title: "How to Solve Water Bottles — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Water Bottles. Easy difficulty, 72.6% acceptance rate. Topics: Math, Simulation."
date: "2027-06-27"
category: "dsa-patterns"
tags: ["water-bottles", "math", "simulation", "easy"]
---

# How to Solve Water Bottles

You start with `numBottles` full water bottles. Every time you drink a bottle, it becomes empty. You can exchange `numExchange` empty bottles for one new full bottle. The goal is to find the maximum number of bottles you can drink. The tricky part is that you need to keep track of both full and empty bottles, and the exchange process creates a chain reaction where each exchange gives you more bottles to drink, which then become more empties for further exchanges.

## Visual Walkthrough

Let's trace through an example with `numBottles = 9` and `numExchange = 3`:

**Step 1:** Start with 9 full bottles. Drink all 9 → now have 9 empty bottles.
Total drunk so far: 9

**Step 2:** Exchange 9 empty bottles. Since `numExchange = 3`, we can exchange 9 ÷ 3 = 3 times → get 3 new full bottles. We have 9 - (3 × 3) = 0 empty bottles left.
Drink the 3 new full bottles → now have 3 empty bottles.
Total drunk: 9 + 3 = 12

**Step 3:** Exchange 3 empty bottles. 3 ÷ 3 = 1 exchange → get 1 new full bottle. We have 3 - (1 × 3) = 0 empty bottles left.
Drink the 1 new full bottle → now have 1 empty bottle.
Total drunk: 12 + 1 = 13

**Step 4:** We have 1 empty bottle, but need 3 to exchange. Process stops.
Final answer: 13 bottles drunk.

The pattern: we keep drinking all full bottles, exchanging empties for new full ones, and repeating until we can't exchange anymore.

## Brute Force Approach

The most straightforward approach is to simulate the entire process step-by-step:

1. Start with `full = numBottles` and `empty = 0`
2. While we have at least `numExchange` empty bottles:
   - Drink all full bottles (add to total, convert to empty)
   - Exchange as many empty bottles as possible for new full bottles
   - Update counts

While this simulation works and is easy to understand, it's not the most efficient approach. For very large inputs (like `numBottles = 10^9`), the simulation could take many iterations. However, since this is an Easy problem and the constraints are reasonable, simulation is actually acceptable. Still, let's look at a more mathematical approach that's even more efficient.

## Optimal Solution

We can solve this with a simple mathematical formula. The key insight: every time you exchange `numExchange` empty bottles for 1 full bottle, you're effectively "spending" `numExchange - 1` bottles (since you get 1 bottle back that becomes empty again). The initial `numBottles` gives you that many drinks for free. After that, each additional drink "costs" `numExchange - 1` empty bottles.

However, there's a cleaner simulation approach that's intuitive and efficient. We'll track total drinks and empty bottles, continuously exchanging until we can't:

<div class="code-group">

```python
# Time: O(log(numBottles) base numExchange) | Space: O(1)
def numWaterBottles(numBottles: int, numExchange: int) -> int:
    total_drunk = 0  # Total bottles drunk so far
    empty = 0  # Current empty bottles

    # While we have any full bottles left to drink
    while numBottles > 0:
        # Step 1: Drink all current full bottles
        total_drunk += numBottles

        # Step 2: These become empty bottles
        empty += numBottles

        # Step 3: Exchange empty bottles for new full bottles
        # Integer division gives how many exchanges we can make
        numBottles = empty // numExchange

        # Step 4: Update empty bottles after exchange
        # Only the remainder empty bottles remain (those not exchanged)
        empty = empty % numExchange

    return total_drunk
```

```javascript
// Time: O(log(numBottles) base numExchange) | Space: O(1)
function numWaterBottles(numBottles, numExchange) {
  let totalDrunk = 0; // Total bottles drunk so far
  let empty = 0; // Current empty bottles

  // While we have any full bottles left to drink
  while (numBottles > 0) {
    // Step 1: Drink all current full bottles
    totalDrunk += numBottles;

    // Step 2: These become empty bottles
    empty += numBottles;

    // Step 3: Exchange empty bottles for new full bottles
    // Math.floor gives how many exchanges we can make
    numBottles = Math.floor(empty / numExchange);

    // Step 4: Update empty bottles after exchange
    // Only the remainder empty bottles remain (those not exchanged)
    empty = empty % numExchange;
  }

  return totalDrunk;
}
```

```java
// Time: O(log(numBottles) base numExchange) | Space: O(1)
class Solution {
    public int numWaterBottles(int numBottles, int numExchange) {
        int totalDrunk = 0;  // Total bottles drunk so far
        int empty = 0;       // Current empty bottles

        // While we have any full bottles left to drink
        while (numBottles > 0) {
            // Step 1: Drink all current full bottles
            totalDrunk += numBottles;

            // Step 2: These become empty bottles
            empty += numBottles;

            // Step 3: Exchange empty bottles for new full bottles
            // Integer division gives how many exchanges we can make
            numBottles = empty / numExchange;

            // Step 4: Update empty bottles after exchange
            // Only the remainder empty bottles remain (those not exchanged)
            empty = empty % numExchange;
        }

        return totalDrunk;
    }
}
```

</div>

**Alternative Mathematical One-Liner Solution:**
There's also a direct formula: `numBottles + (numBottles - 1) // (numExchange - 1)`, but this has an edge case when `numExchange = 1` (division by zero). The simulation approach above handles all cases cleanly.

## Complexity Analysis

**Time Complexity:** O(log(numBottles) base numExchange)

- Each iteration reduces the number of bottles by a factor of roughly `numExchange`
- In the worst case when `numExchange = 2`, we get O(log₂(numBottles)) iterations
- For larger `numExchange`, even fewer iterations

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables (`total_drunk`, `empty`)

## Common Mistakes

1. **Forgetting to carry over leftover empty bottles:** After exchanging, some candidates reset `empty = 0` instead of `empty = empty % numExchange`. This fails for cases like `numBottles = 15, numExchange = 4` where you'd have leftovers.

2. **Infinite loop with `numExchange = 1`:** If `numExchange = 1`, you can exchange 1 empty for 1 full indefinitely. The correct answer should be infinite, but since we're dealing with integers, you'd drink all bottles and keep exchanging. Our code handles this correctly because when `numExchange = 1`, `empty // 1 = empty`, so you keep getting the same number of bottles back.

3. **Wrong loop condition:** Using `while (empty >= numExchange)` instead of `while (numBottles > 0)` can miss the initial drinking phase or cause issues when you have bottles but can't exchange yet.

4. **Not drinking all bottles at once:** Some candidates try to drink one bottle at a time and exchange immediately when possible. This works but is less efficient and more error-prone.

## When You'll See This Pattern

This "exchange" or "recycling" pattern appears in several problems:

1. **Water Bottles II (LeetCode 1556)** - A harder version where exchange rate changes over time
2. **Broken Calculator (LeetCode 991)** - Similar backward thinking about operations
3. **Coin Change (LeetCode 322)** - Different but related "exchange" concept
4. **Lemonade Change (LeetCode 860)** - Managing exchanges with different denominations

The core pattern is about managing resources that transform (full → empty) and can be exchanged under certain rules. Recognizing this as a state machine with two variables (full, empty) is key.

## Key Takeaways

1. **Simulation beats complex math for clarity:** Even when a mathematical formula exists, a clear simulation is often better in interviews because it's easier to explain and debug.

2. **Track all relevant states:** Here we needed to track both full bottles and empty bottles. Many problems require tracking multiple related quantities.

3. **Integer division and modulus are your friends:** The `//` and `%` operations naturally handle the "exchange as many as possible" logic cleanly.

4. **Test edge cases:** Always test `numExchange = 1`, `numExchange > numBottles`, and small values to catch off-by-one errors.

Related problems: [Water Bottles II](/problem/water-bottles-ii)
