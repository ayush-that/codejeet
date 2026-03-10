---
title: "How to Solve Total Distance Traveled — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Total Distance Traveled. Easy difficulty, 41.2% acceptance rate. Topics: Math, Simulation."
date: "2028-04-08"
category: "dsa-patterns"
tags: ["total-distance-traveled", "math", "simulation", "easy"]
---

# How to Solve Total Distance Traveled

This problem involves calculating the total distance a truck can travel given two fuel tanks with special refueling rules. The tricky part is that every time 5 liters are consumed from the main tank, we can transfer 1 liter from the additional tank if available. This creates an interesting simulation problem where fuel consumption and refueling happen simultaneously.

## Visual Walkthrough

Let's trace through an example with `mainTank = 9` and `additionalTank = 2`:

**Step 1:** Start with mainTank = 9, additionalTank = 2, distance = 0

**Step 2:** Consume 1 liter from mainTank → mainTank = 8, distance = 10

- Check if we've consumed 5 liters total? No (only consumed 1 so far)

**Step 3:** Consume 1 liter from mainTank → mainTank = 7, distance = 20

- Total consumed = 2, not 5 yet

**Step 4:** Consume 1 liter from mainTank → mainTank = 6, distance = 30

- Total consumed = 3

**Step 5:** Consume 1 liter from mainTank → mainTank = 5, distance = 40

- Total consumed = 4

**Step 6:** Consume 1 liter from mainTank → mainTank = 4, distance = 50

- Total consumed = 5! Time to check additionalTank
- additionalTank > 0? Yes (2 > 0)
- Transfer 1 liter: mainTank = 5, additionalTank = 1
- Reset consumption counter

**Step 7:** Consume 1 liter from mainTank → mainTank = 4, distance = 60

- Total consumed = 1

**Step 8:** Continue until mainTank reaches 0...

The key insight: Every 5 liters consumed gives us a chance to refuel from the additional tank, which extends our total distance.

## Brute Force Approach

A naive approach would simulate every single liter of fuel consumption:

1. Initialize distance = 0 and a counter for liters consumed
2. While mainTank > 0:
   - Consume 1 liter from mainTank
   - Add 10 km to distance
   - Increment consumption counter
   - If counter reaches 5 and additionalTank > 0:
     - Transfer 1 liter from additionalTank to mainTank
     - Reset counter

This approach works but is inefficient for large inputs because we're processing fuel liter by liter. If mainTank is 10^9, we'd need 10^9 iterations!

## Optimal Solution

The optimal solution uses mathematical reasoning instead of literal simulation. We can calculate how many times we'll get to transfer fuel from the additional tank, which is limited by either:

1. How many groups of 5 liters we consume from mainTank
2. How much fuel is in the additional tank

The transfers happen every 5 liters, but we need to be careful: when we transfer fuel, it increases the main tank, which might allow for more transfers!

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def distanceTraveled(mainTank: int, additionalTank: int) -> int:
    """
    Calculate total distance traveled with refueling rules.

    The key insight: Every 5 liters consumed from main tank allows
    transferring 1 liter from additional tank if available.
    But transferred fuel also gets consumed and counts toward
    future transfers!
    """
    total_distance = 0

    # Calculate how many times we can transfer fuel
    # Each transfer happens after consuming 5 liters
    # But transfers add fuel that also gets consumed
    transfers = 0

    # While we have at least 5 liters in main tank AND
    # we still have fuel in additional tank
    while mainTank >= 5 and additionalTank > 0:
        # Consume 5 liters from main tank
        mainTank -= 5
        total_distance += 50  # 5 liters * 10 km/liter

        # Transfer 1 liter from additional to main
        additionalTank -= 1
        mainTank += 1
        transfers += 1

    # Add remaining fuel in main tank (including any transferred fuel)
    total_distance += mainTank * 10

    return total_distance
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate total distance traveled with refueling rules.
 *
 * The key insight: Every 5 liters consumed from main tank allows
 * transferring 1 liter from additional tank if available.
 * But transferred fuel also gets consumed and counts toward
 * future transfers!
 */
function distanceTraveled(mainTank, additionalTank) {
  let totalDistance = 0;

  // Calculate how many times we can transfer fuel
  // Each transfer happens after consuming 5 liters
  // But transfers add fuel that also gets consumed
  while (mainTank >= 5 && additionalTank > 0) {
    // Consume 5 liters from main tank
    mainTank -= 5;
    totalDistance += 50; // 5 liters * 10 km/liter

    // Transfer 1 liter from additional to main
    additionalTank -= 1;
    mainTank += 1;
  }

  // Add remaining fuel in main tank (including any transferred fuel)
  totalDistance += mainTank * 10;

  return totalDistance;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate total distance traveled with refueling rules.
     *
     * The key insight: Every 5 liters consumed from main tank allows
     * transferring 1 liter from additional tank if available.
     * But transferred fuel also gets consumed and counts toward
     * future transfers!
     */
    public int distanceTraveled(int mainTank, int additionalTank) {
        int totalDistance = 0;

        // Calculate how many times we can transfer fuel
        // Each transfer happens after consuming 5 liters
        // But transfers add fuel that also gets consumed
        while (mainTank >= 5 && additionalTank > 0) {
            // Consume 5 liters from main tank
            mainTank -= 5;
            totalDistance += 50;  // 5 liters * 10 km/liter

            // Transfer 1 liter from additional to main
            additionalTank -= 1;
            mainTank += 1;
        }

        // Add remaining fuel in main tank (including any transferred fuel)
        totalDistance += mainTank * 10;

        return totalDistance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(min(mainTank/5, additionalTank))

- In the worst case, we iterate once for each possible transfer
- Each transfer consumes 5 liters from main tank and adds 1 back
- The number of transfers is limited by either mainTank/5 or additionalTank
- Since mainTank and additionalTank are integers, this is effectively O(1) for practical purposes

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No additional data structures are needed

## Common Mistakes

1. **Forgetting that transferred fuel also counts toward consumption:** Some candidates think transfers only happen based on the initial fuel, but fuel transferred from the additional tank also gets consumed and can trigger more transfers.

2. **Infinite loop with incorrect termination condition:** Using `while (mainTank > 0)` without checking `additionalTank > 0` can cause issues when additionalTank is large but mainTank is small.

3. **Off-by-one errors with the 5-liter boundary:** The transfer happens AFTER consuming 5 liters, not when reaching 5 liters. Make sure to subtract 5 before checking for transfers.

4. **Not handling the remaining fuel after transfers:** After the loop ends, remember to add the distance for any remaining fuel in the main tank.

## When You'll See This Pattern

This problem uses **simulation with mathematical optimization** - a common pattern in problems involving resource consumption with special rules:

1. **Water Bottles (LeetCode 1518):** Similar concept - exchange empty bottles for new ones, which creates a chain reaction.

2. **Count Operations to Obtain Zero (LeetCode 2169):** Another simulation problem where operations affect both numbers.

3. **Maximum 69 Number (LeetCode 1323):** While different, it uses similar iterative modification thinking.

The core pattern: When a process has rules that create feedback loops (where the result of an operation affects future operations), you often need to simulate the process but can optimize with mathematical insights.

## Key Takeaways

1. **Look for mathematical shortcuts in simulation problems:** Instead of simulating every step, find patterns that let you calculate results directly or in fewer iterations.

2. **Pay attention to feedback loops:** When operations affect the conditions for future operations, you need to think carefully about termination conditions.

3. **Test edge cases systematically:** With problems involving boundaries (like "every 5 liters"), test cases just below, at, and above the boundary values.

[Practice this problem on CodeJeet](/problem/total-distance-traveled)
