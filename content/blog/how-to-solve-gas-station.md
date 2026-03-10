---
title: "How to Solve Gas Station — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Gas Station. Medium difficulty, 47.5% acceptance rate. Topics: Array, Greedy."
date: "2026-08-17"
category: "dsa-patterns"
tags: ["gas-station", "array", "greedy", "medium"]
---

# How to Solve Gas Station

The Gas Station problem presents a circular route where you must determine if there's a starting station that allows you to complete a full circuit, given arrays of available gas and travel costs. What makes this problem interesting is that it appears to require checking all possible starting points, but there's a clever greedy approach that solves it in linear time.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
gas  = [1, 2, 3, 4, 5]
cost = [3, 4, 5, 1, 2]
```

**Step 1: Calculate net gain/loss at each station**
At station i, net = gas[i] - cost[i]

- Station 0: 1 - 3 = -2 (lose 2 units)
- Station 1: 2 - 4 = -2 (lose 2 units)
- Station 2: 3 - 5 = -2 (lose 2 units)
- Station 3: 4 - 1 = +3 (gain 3 units)
- Station 4: 5 - 2 = +3 (gain 3 units)

**Step 2: Try starting at station 0**

- Start at station 0 with tank = 0
- Add net: 0 + (-2) = -2 → immediately fails
- We can't even leave station 0

**Step 3: Try starting at station 1**

- Start at station 1 with tank = 0
- Add net: 0 + (-2) = -2 → fails immediately

**Step 4: Try starting at station 2**

- Start at station 2 with tank = 0
- Add net: 0 + (-2) = -2 → fails immediately

**Step 5: Try starting at station 3**

- Start at station 3 with tank = 0
- Add net: 0 + 3 = 3 (tank = 3)
- Move to station 4: 3 + 3 = 6 (tank = 6)
- Move to station 0: 6 + (-2) = 4 (tank = 4)
- Move to station 1: 4 + (-2) = 2 (tank = 2)
- Move to station 2: 2 + (-2) = 0 (tank = 0)
- Back to station 3: Success!

**Key observation:** If the total gas >= total cost, there must be a solution. The trick is finding where to start. Notice that whenever our tank goes negative, we can discard all previous stations as potential starting points and start fresh from the next station.

## Brute Force Approach

The brute force solution tries every possible starting station and simulates the complete circuit for each one:

1. For each station i from 0 to n-1:
   - Start with tank = 0
   - For j from 0 to n-1:
     - Calculate current station index = (i + j) % n
     - Add gas[current] - cost[current] to tank
     - If tank < 0, break (this starting point fails)
   - If we complete all n stations, return i
2. If no starting point works, return -1

This approach has O(n²) time complexity because for each of n starting points, we might check up to n stations. For large inputs (n up to 10⁵), this is far too slow.

## Optimized Approach

The key insight comes from two observations:

1. **Total gas must be ≥ total cost:** If total gas < total cost, it's impossible to complete the circuit regardless of where you start.

2. **Greedy starting point selection:** If you start at station A and can't reach station B, then any station between A and B (inclusive) cannot be a valid starting point. This is because if you start with 0 gas at A and fail to reach B, starting at any station between A and B would leave you with even less gas when you reach B.

This leads to a one-pass algorithm:

- Track total gas and total cost to check feasibility
- Track current tank as we iterate
- When tank goes negative, reset starting point to next station and tank to 0
- If total gas ≥ total cost, the last starting point we reset to is the answer

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canCompleteCircuit(gas, cost):
    """
    Determines if there's a starting gas station that allows completing the circuit.

    Args:
        gas: List of gas available at each station
        cost: List of gas cost to travel to next station

    Returns:
        Index of starting station if possible, else -1
    """
    total_gas = 0      # Track total gas available
    total_cost = 0     # Track total cost required
    current_tank = 0   # Track gas in tank from current starting point
    start_index = 0    # Track potential starting station

    for i in range(len(gas)):
        # Calculate net gain/loss at this station
        net = gas[i] - cost[i]

        # Update totals for feasibility check
        total_gas += gas[i]
        total_cost += cost[i]

        # Update tank from current starting point
        current_tank += net

        # If tank goes negative, we can't reach next station
        # from current starting point
        if current_tank < 0:
            # Reset starting point to next station
            start_index = i + 1
            # Reset tank since we're starting fresh
            current_tank = 0

    # If total gas < total cost, circuit is impossible
    if total_gas < total_cost:
        return -1

    # Otherwise, return the valid starting point
    return start_index
```

```javascript
// Time: O(n) | Space: O(1)
function canCompleteCircuit(gas, cost) {
  /**
   * Determines if there's a starting gas station that allows completing the circuit.
   *
   * @param {number[]} gas - Gas available at each station
   * @param {number[]} cost - Gas cost to travel to next station
   * @return {number} Index of starting station if possible, else -1
   */
  let totalGas = 0; // Track total gas available
  let totalCost = 0; // Track total cost required
  let currentTank = 0; // Track gas in tank from current starting point
  let startIndex = 0; // Track potential starting station

  for (let i = 0; i < gas.length; i++) {
    // Calculate net gain/loss at this station
    const net = gas[i] - cost[i];

    // Update totals for feasibility check
    totalGas += gas[i];
    totalCost += cost[i];

    // Update tank from current starting point
    currentTank += net;

    // If tank goes negative, we can't reach next station
    // from current starting point
    if (currentTank < 0) {
      // Reset starting point to next station
      startIndex = i + 1;
      // Reset tank since we're starting fresh
      currentTank = 0;
    }
  }

  // If total gas < total cost, circuit is impossible
  if (totalGas < totalCost) {
    return -1;
  }

  // Otherwise, return the valid starting point
  return startIndex;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        /**
         * Determines if there's a starting gas station that allows completing the circuit.
         *
         * @param gas Gas available at each station
         * @param cost Gas cost to travel to next station
         * @return Index of starting station if possible, else -1
         */
        int totalGas = 0;      // Track total gas available
        int totalCost = 0;     // Track total cost required
        int currentTank = 0;   // Track gas in tank from current starting point
        int startIndex = 0;    // Track potential starting station

        for (int i = 0; i < gas.length; i++) {
            // Calculate net gain/loss at this station
            int net = gas[i] - cost[i];

            // Update totals for feasibility check
            totalGas += gas[i];
            totalCost += cost[i];

            // Update tank from current starting point
            currentTank += net;

            // If tank goes negative, we can't reach next station
            // from current starting point
            if (currentTank < 0) {
                // Reset starting point to next station
                startIndex = i + 1;
                // Reset tank since we're starting fresh
                currentTank = 0;
            }
        }

        // If total gas < total cost, circuit is impossible
        if (totalGas < totalCost) {
            return -1;
        }

        // Otherwise, return the valid starting point
        return startIndex;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the arrays, performing constant-time operations at each station
- The loop runs exactly n times, where n is the number of gas stations

**Space Complexity: O(1)**

- We use only a constant amount of extra space (totalGas, totalCost, currentTank, startIndex)
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting the total gas ≥ total cost check:** Some candidates implement the greedy reset logic correctly but forget to check if a solution exists at all. Always verify total gas ≥ total cost before returning a starting point.

2. **Incorrect reset logic:** When resetting the starting point, you must set it to `i + 1`, not `i`. If you fail at station i, you need to try starting at the next station.

3. **Not resetting current tank to 0:** When you change the starting point, you must reset the tank to 0 because you're simulating starting fresh at the new station with an empty tank.

4. **Overcomplicating with circular array traversal:** The solution doesn't need to actually simulate circular traversal. The greedy approach works because if you can reach the end of the array from your starting point with non-negative tank, and total gas ≥ total cost, you'll complete the circuit.

## When You'll See This Pattern

This problem uses a **greedy algorithm with a reset condition**, which appears in several other problems:

1. **Maximum Subarray (Kadane's Algorithm):** Similar reset logic when current sum goes negative. Instead of tracking gas, you track sum and reset when it becomes negative.

2. **Best Time to Buy and Sell Stock:** The "maximum profit" calculation has similarities to tracking cumulative gains/losses.

3. **Jump Game:** Determining if you can reach the end by tracking maximum reachable index, with similar "can I continue or do I need to adjust" logic.

4. **Container With Most Water:** Uses two pointers and greedy movement based on height comparisons.

## Key Takeaways

1. **When you need to find a starting point in a circular array**, consider whether you can make a single pass with greedy resets rather than checking all possibilities.

2. **Look for problems where local failures eliminate multiple candidates** - this often indicates a greedy solution with O(n) time complexity is possible.

3. **Always check global feasibility conditions** (like total gas ≥ total cost) separately from finding the specific solution - this can simplify your logic and handle edge cases.

Related problems: [Maximize the Topmost Element After K Moves](/problem/maximize-the-topmost-element-after-k-moves)
