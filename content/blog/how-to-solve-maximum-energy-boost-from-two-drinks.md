---
title: "How to Solve Maximum Energy Boost From Two Drinks — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Energy Boost From Two Drinks. Medium difficulty, 50.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-02-03"
category: "dsa-patterns"
tags: ["maximum-energy-boost-from-two-drinks", "array", "dynamic-programming", "medium"]
---

# How to Solve Maximum Energy Boost From Two Drinks

You're given two arrays representing energy boosts from two different drinks over `n` hours, and you need to maximize your total energy while never drinking the same type for three consecutive hours. The twist is that you can switch between drinks, but you must avoid three-in-a-row of the same type, making this a dynamic programming problem with state tracking.

What makes this interesting is that it's not just about picking the maximum at each hour—your current choice affects future possibilities due to the consecutive drink constraint. You need to think several steps ahead, which is where dynamic programming shines.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
energyDrinkA = [1, 2, 3, 4]
energyDrinkB = [4, 3, 2, 1]
```

We have 4 hours. At each hour, we can choose drink A or B, but we can't choose the same drink three times in a row.

**Hour 0 (index 0):**

- If we choose A: energy = 1, consecutive A = 1, consecutive B = 0
- If we choose B: energy = 4, consecutive A = 0, consecutive B = 1

**Hour 1 (index 1):**
From state (chose A at hour 0):

- Choose A: energy = 1 + 2 = 3, consecutive A = 2, consecutive B = 0 ✓
- Choose B: energy = 1 + 3 = 4, consecutive A = 0, consecutive B = 1 ✓

From state (chose B at hour 0):

- Choose A: energy = 4 + 1 = 5, consecutive A = 1, consecutive B = 0 ✓
- Choose B: energy = 4 + 3 = 7, consecutive A = 0, consecutive B = 2 ✓

**Hour 2 (index 2):**
We need to track all valid states. The key insight: at hour 2, someone who has drunk A twice consecutively (consecutive A = 2) CANNOT choose A again. They must choose B.

Let's trace one path: Starting with B at hour 0 (energy 4, consecutive B = 1), then B at hour 1 (energy 7, consecutive B = 2):

- At hour 2, we CANNOT choose B (would be 3 consecutive)
- Must choose A: energy = 7 + 2 = 9, consecutive A = 1, consecutive B = 0

**Hour 3 (index 3):**
Continue this process, always checking the consecutive count constraint.

The optimal path for this example: B(4) → B(3) → A(2) → A(4) = 13 total energy.

## Brute Force Approach

A naive approach would try all possible sequences of choices (A or B) at each hour, checking the three-consecutive constraint. For each of the `n` hours, we have 2 choices (A or B), giving us `2^n` possible sequences.

We could implement this with recursion:

1. At each hour `i`, try choosing drink A if allowed (less than 2 consecutive A's so far)
2. Try choosing drink B if allowed (less than 2 consecutive B's so far)
3. Recurse to the next hour
4. Return the maximum energy from all paths

The problem? This is exponential time `O(2^n)`, which fails for even moderately sized inputs (n = 100 would mean `2^100` operations—impossible).

```python
# Brute force recursive solution (for illustration only)
def maxEnergyBoostBrute(energyDrinkA, energyDrinkB):
    n = len(energyDrinkA)

    def dfs(i, consecutiveA, consecutiveB):
        if i == n:
            return 0

        max_energy = 0

        # Try drink A if we haven't had 2 consecutive A's already
        if consecutiveA < 2:
            energy_from_A = energyDrinkA[i] + dfs(i + 1, consecutiveA + 1, 0)
            max_energy = max(max_energy, energy_from_A)

        # Try drink B if we haven't had 2 consecutive B's already
        if consecutiveB < 2:
            energy_from_B = energyDrinkB[i] + dfs(i + 1, 0, consecutiveB + 1)
            max_energy = max(max_energy, energy_from_B)

        return max_energy

    return dfs(0, 0, 0)
```

This brute force solution has overlapping subproblems—the same state `(i, consecutiveA, consecutiveB)` is computed multiple times. That's our clue to use dynamic programming.

## Optimized Approach

The key insight is that we can use **dynamic programming with state tracking**. At each hour `i`, our decision depends on:

1. Which drink we choose now
2. How many times we've consecutively chosen that drink recently

We need to track enough state to make optimal decisions. Since we can't have 3 consecutive of the same drink, we only need to track whether we've had 0, 1, or 2 consecutive drinks of each type.

However, we can simplify: at any point, we're either coming from drink A or drink B, and we know how many consecutive times we've had that drink. This gives us 4 states:

- `dp[i][0]`: max energy at hour i ending with drink A, having drunk A once consecutively
- `dp[i][1]`: max energy at hour i ending with drink A, having drunk A twice consecutively
- `dp[i][2]`: max energy at hour i ending with drink B, having drunk B once consecutively
- `dp[i][3]`: max energy at hour i ending with drink B, having drunk B twice consecutively

The transitions:

- To reach state 0 (A, 1 consecutive): must have come from B at previous hour
- To reach state 1 (A, 2 consecutive): must have come from state 0 (A, 1 consecutive)
- To reach state 2 (B, 1 consecutive): must have come from A at previous hour
- To reach state 3 (B, 2 consecutive): must have come from state 2 (B, 1 consecutive)

This gives us an `O(n)` time solution with `O(n)` space, which we can optimize to `O(1)` space since we only need the previous hour's states.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - optimized DP with constant space
def maxEnergyBoost(energyDrinkA, energyDrinkB):
    """
    Calculate maximum energy boost from two drinks with constraint:
    Cannot drink the same type more than 2 consecutive hours.

    Args:
        energyDrinkA: List[int] - energy values for drink A each hour
        energyDrinkB: List[int] - energy values for drink B each hour

    Returns:
        int - maximum total energy achievable
    """
    n = len(energyDrinkA)

    # We only need 4 states for the current hour:
    # state0: ending with A, having drunk A once consecutively
    # state1: ending with A, having drunk A twice consecutively
    # state2: ending with B, having drunk B once consecutively
    # state3: ending with B, having drunk B twice consecutively

    # Initialize for hour 0 (index 0)
    state0 = energyDrinkA[0]  # Start with A, 1 consecutive A
    state1 = float('-inf')    # Can't have 2 consecutive A at hour 0
    state2 = energyDrinkB[0]  # Start with B, 1 consecutive B
    state3 = float('-inf')    # Can't have 2 consecutive B at hour 0

    # Process each hour from 1 to n-1
    for i in range(1, n):
        # Store previous states before updating
        prev_state0, prev_state1, prev_state2, prev_state3 = state0, state1, state2, state3

        # Calculate new states for current hour i:

        # state0: End with A, 1 consecutive A (must come from B previously)
        # Can come from either state2 (B, 1 consecutive) or state3 (B, 2 consecutive)
        state0 = energyDrinkA[i] + max(prev_state2, prev_state3)

        # state1: End with A, 2 consecutive A (must come from A with 1 consecutive)
        # Can only come from state0 of previous hour
        state1 = energyDrinkA[i] + prev_state0

        # state2: End with B, 1 consecutive B (must come from A previously)
        # Can come from either state0 (A, 1 consecutive) or state1 (A, 2 consecutive)
        state2 = energyDrinkB[i] + max(prev_state0, prev_state1)

        # state3: End with B, 2 consecutive B (must come from B with 1 consecutive)
        # Can only come from state2 of previous hour
        state3 = energyDrinkB[i] + prev_state2

    # Maximum energy is the maximum of all 4 ending states
    return max(state0, state1, state2, state3)
```

```javascript
// Time: O(n) | Space: O(1) - optimized DP with constant space
function maxEnergyBoost(energyDrinkA, energyDrinkB) {
  /**
   * Calculate maximum energy boost from two drinks with constraint:
   * Cannot drink the same type more than 2 consecutive hours.
   *
   * @param {number[]} energyDrinkA - energy values for drink A each hour
   * @param {number[]} energyDrinkB - energy values for drink B each hour
   * @return {number} - maximum total energy achievable
   */
  const n = energyDrinkA.length;

  // Initialize DP states for hour 0
  // state0: ending with A, 1 consecutive A
  // state1: ending with A, 2 consecutive A (impossible at hour 0)
  // state2: ending with B, 1 consecutive B
  // state3: ending with B, 2 consecutive B (impossible at hour 0)
  let state0 = energyDrinkA[0];
  let state1 = -Infinity; // Can't have 2 consecutive at first hour
  let state2 = energyDrinkB[0];
  let state3 = -Infinity; // Can't have 2 consecutive at first hour

  // Process remaining hours
  for (let i = 1; i < n; i++) {
    // Save previous states before updating
    const prevState0 = state0;
    const prevState1 = state1;
    const prevState2 = state2;
    const prevState3 = state3;

    // Update current states based on transition rules:

    // To have 1 consecutive A now, must have come from B previously
    state0 = energyDrinkA[i] + Math.max(prevState2, prevState3);

    // To have 2 consecutive A now, must have come from 1 consecutive A
    state1 = energyDrinkA[i] + prevState0;

    // To have 1 consecutive B now, must have come from A previously
    state2 = energyDrinkB[i] + Math.max(prevState0, prevState1);

    // To have 2 consecutive B now, must have come from 1 consecutive B
    state3 = energyDrinkB[i] + prevState2;
  }

  // Return maximum of all possible ending states
  return Math.max(state0, state1, state2, state3);
}
```

```java
// Time: O(n) | Space: O(1) - optimized DP with constant space
class Solution {
    public int maxEnergyBoost(int[] energyDrinkA, int[] energyDrinkB) {
        /**
         * Calculate maximum energy boost from two drinks with constraint:
         * Cannot drink the same type more than 2 consecutive hours.
         *
         * @param energyDrinkA - energy values for drink A each hour
         * @param energyDrinkB - energy values for drink B each hour
         * @return maximum total energy achievable
         */
        int n = energyDrinkA.length;

        // DP states initialization for hour 0
        // state0: end with A, 1 consecutive A
        // state1: end with A, 2 consecutive A (impossible initially)
        // state2: end with B, 1 consecutive B
        // state3: end with B, 2 consecutive B (impossible initially)
        int state0 = energyDrinkA[0];
        int state1 = Integer.MIN_VALUE;  // Use MIN_VALUE for "negative infinity"
        int state2 = energyDrinkB[0];
        int state3 = Integer.MIN_VALUE;

        // Process each subsequent hour
        for (int i = 1; i < n; i++) {
            // Store previous states
            int prevState0 = state0;
            int prevState1 = state1;
            int prevState2 = state2;
            int prevState3 = state3;

            // Update states according to transition rules:

            // state0: 1 consecutive A - must come from B (state2 or state3)
            state0 = energyDrinkA[i] + Math.max(prevState2, prevState3);

            // state1: 2 consecutive A - must come from state0 (1 consecutive A)
            state1 = energyDrinkA[i] + prevState0;

            // state2: 1 consecutive B - must come from A (state0 or state1)
            state2 = energyDrinkB[i] + Math.max(prevState0, prevState1);

            // state3: 2 consecutive B - must come from state2 (1 consecutive B)
            state3 = energyDrinkB[i] + prevState2;
        }

        // Return maximum of all possible ending states
        return Math.max(Math.max(state0, state1), Math.max(state2, state3));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n)` where `n` is the number of hours (length of the input arrays). We process each hour exactly once, performing constant-time operations (4 max operations and 4 additions) per hour.

**Space Complexity:** `O(1)` for the optimized solution. We only store 4 integer variables for the current states and 4 for the previous states, regardless of input size. The unoptimized version would be `O(n)` if we stored all `n` hours × 4 states.

The space optimization works because to compute states for hour `i`, we only need states from hour `i-1`. This is a common DP optimization technique called "rolling array" or "state compression."

## Common Mistakes

1. **Forgetting to handle the initial state properly**: At hour 0, you can't have 2 consecutive drinks of any type. Using `-infinity` (or a very small number) for impossible states is crucial. Some candidates initialize all states to 0, which can lead to incorrect transitions.

2. **Incorrect transition logic**: The most common error is mixing up which states can transition to which. Remember:
   - To get 1 consecutive A, you must have come from B
   - To get 2 consecutive A, you must have come from 1 consecutive A
   - The reverse is true for B

3. **Not considering all possible previous states**: When transitioning to state0 (1 consecutive A), you can come from EITHER state2 OR state3 (both represent ending with B). Using only one is incorrect.

4. **Off-by-one errors in array indexing**: Since we initialize for hour 0 separately and loop from hour 1, it's easy to miscount. Always test with small examples (n=1, n=2) to catch these.

## When You'll See This Pattern

This problem uses **dynamic programming with state machines**, a pattern common in problems with constraints on consecutive choices:

1. **House Robber (LeetCode 198)**: Can't rob adjacent houses—similar state tracking but simpler (only 2 states: rob or don't rob current house).

2. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)**: Has states for holding stock, not holding with cooldown, and not holding without cooldown—similar state machine concept.

3. **Paint House (LeetCode 256)**: Choose paint colors for adjacent houses with no same-color adjacency—similar constraint structure.

4. **Maximum Sum of 3 Non-Overlapping Subarrays (LeetCode 689)**: Tracks how many subarrays taken so far—similar state counting.

The pattern to recognize: when your decision at step `i` depends not just on the immediate previous step, but on a limited history (like "have I done this 2 times in a row?"), DP with state tracking is likely the solution.

## Key Takeaways

1. **Constraints on consecutive choices often lead to DP state machines**: When you can't do something X times in a row, track how many times you've done it consecutively as part of your state.

2. **State compression is powerful**: Even if the problem seems to need tracking multiple variables, often you only need the immediately previous states, allowing O(1) space solutions.

3. **Initialize impossible states properly**: Use `-infinity` (or equivalent) for states that are impossible at the start. This prevents them from being chosen as valid paths.

4. **Draw state transitions**: For complex DP problems, drawing a diagram of state transitions (circles for states, arrows for transitions) helps visualize the logic and catch errors.

[Practice this problem on CodeJeet](/problem/maximum-energy-boost-from-two-drinks)
