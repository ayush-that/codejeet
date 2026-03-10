---
title: "How to Solve Watering Plants — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Watering Plants. Medium difficulty, 79.9% acceptance rate. Topics: Array, Simulation."
date: "2028-02-19"
category: "dsa-patterns"
tags: ["watering-plants", "array", "simulation", "medium"]
---

# How to Solve Watering Plants

You need to water plants arranged in a row, starting from a river at position -1. Each plant requires a specific amount of water, and your watering can has a capacity. You must walk to each plant, water it if you have enough water, or return to the river to refill if you don't. The challenge is calculating the total steps taken while efficiently managing your water supply. What makes this problem interesting is that it's a simulation problem where you must track both your position and remaining water, making careful step counting essential.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `plants = [2, 3, 5, 2]`
- `capacity = 6`
- Starting position: river at `x = -1`
- Initial can: full with 6 units

**Step 1:** Walk from river (-1) to plant 0 (position 0): 1 step  
Current steps = 1, water = 6  
Plant 0 needs 2 water → water it (water = 4)

**Step 2:** Walk to plant 1 (position 1): 1 step  
Current steps = 2, water = 4  
Plant 1 needs 3 water → water it (water = 1)

**Step 3:** Walk to plant 2 (position 2): 1 step  
Current steps = 3, water = 1  
Plant 2 needs 5 water → NOT ENOUGH!  
We must return to river: walk from plant 2 to river = 3 steps  
Refill at river (water = 6)  
Walk back to plant 2: 3 steps  
Water plant 2 (water = 1)  
Total steps added = 3 + 3 = 6  
Current steps = 9

**Step 4:** Walk to plant 3 (position 3): 1 step  
Current steps = 10, water = 1  
Plant 3 needs 2 water → NOT ENOUGH!  
Return to river: 4 steps  
Refill (water = 6)  
Return to plant 3: 4 steps  
Water plant 3 (water = 4)  
Total steps added = 4 + 4 = 8  
Current steps = 18

**Final answer:** 18 steps

The key insight: when you don't have enough water for the current plant, you must walk back to the river and return, which takes `2 * (i + 1)` steps (where `i` is the plant index, since position `i` is `i+1` steps from the river at -1).

## Brute Force Approach

A naive approach would be to simulate every single step explicitly:

1. Start at position -1 with full can
2. For each plant, check if you have enough water
3. If yes: walk forward 1 step, water the plant
4. If no: walk back to river, refill, walk back to current plant, water it
5. Repeat until all plants watered

While this would work, it's unnecessarily complex because we're simulating individual steps when we can calculate them directly. The brute force would involve nested loops and careful tracking of position, which is error-prone and doesn't provide any efficiency benefit over the optimal approach.

The real "brute force" mistake candidates make is trying to track position too granularly or using complex state machines when a simple simulation with step calculation suffices.

## Optimized Approach

The optimal approach is a straightforward simulation with direct step calculation:

**Key Insight:** When you reach a plant and don't have enough water, you must:

1. Walk back to the river: `current_position + 1` steps (since river is at -1)
2. Refill at the river
3. Walk back to the plant: `current_position + 1` steps
4. Water the plant

This round trip adds `2 * (i + 1)` steps to your total, where `i` is the plant index.

**Algorithm:**

1. Initialize `steps = 0`, `currentWater = capacity`
2. For each plant at index `i` with water requirement `need`:
   - If `currentWater < need`: You need to refill
     - Add `2 * (i + 1)` steps for the round trip to river
     - Reset `currentWater = capacity` (after refilling)
   - Walk forward 1 step to reach the plant (or stay if you just returned)
   - Water the plant: `currentWater -= need`
   - Add 1 step for this forward movement
3. Return total steps

**Why this works:** We're simulating the process but calculating steps in chunks rather than step-by-step. The forward step is always added when we reach a plant. The round trip steps are only added when we run out of water.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def wateringPlants(plants, capacity):
    """
    Simulates watering plants with limited water capacity.

    Args:
        plants: List of integers representing water needed for each plant
        capacity: Maximum water the watering can can hold

    Returns:
        Total steps taken to water all plants
    """
    steps = 0           # Total steps taken
    current_water = capacity  # Current water in can

    # Iterate through each plant with its index
    for i, need in enumerate(plants):
        # Check if we have enough water for this plant
        if current_water < need:
            # Not enough water - must return to river
            # Round trip to river and back: 2 * (i + 1) steps
            # i + 1 because plant at position i is i+1 steps from river at -1
            steps += 2 * (i + 1)

            # Refill at the river
            current_water = capacity

        # Walk to the current plant (or stay if we just returned from river)
        # This step happens whether we refilled or not
        steps += 1

        # Water the plant
        current_water -= need

    return steps
```

```javascript
// Time: O(n) | Space: O(1)
function wateringPlants(plants, capacity) {
  /**
   * Simulates watering plants with limited water capacity.
   *
   * @param {number[]} plants - Array of water needed for each plant
   * @param {number} capacity - Maximum water the watering can can hold
   * @return {number} Total steps taken to water all plants
   */
  let steps = 0; // Total steps taken
  let currentWater = capacity; // Current water in can

  // Iterate through each plant with its index
  for (let i = 0; i < plants.length; i++) {
    const need = plants[i];

    // Check if we have enough water for this plant
    if (currentWater < need) {
      // Not enough water - must return to river
      // Round trip to river and back: 2 * (i + 1) steps
      // i + 1 because plant at position i is i+1 steps from river at -1
      steps += 2 * (i + 1);

      // Refill at the river
      currentWater = capacity;
    }

    // Walk to the current plant (or stay if we just returned from river)
    // This step happens whether we refilled or not
    steps += 1;

    // Water the plant
    currentWater -= need;
  }

  return steps;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int wateringPlants(int[] plants, int capacity) {
        /**
         * Simulates watering plants with limited water capacity.
         *
         * @param plants Array of water needed for each plant
         * @param capacity Maximum water the watering can can hold
         * @return Total steps taken to water all plants
         */
        int steps = 0;               // Total steps taken
        int currentWater = capacity; // Current water in can

        // Iterate through each plant with its index
        for (int i = 0; i < plants.length; i++) {
            int need = plants[i];

            // Check if we have enough water for this plant
            if (currentWater < need) {
                // Not enough water - must return to river
                // Round trip to river and back: 2 * (i + 1) steps
                // i + 1 because plant at position i is i+1 steps from river at -1
                steps += 2 * (i + 1);

                // Refill at the river
                currentWater = capacity;
            }

            // Walk to the current plant (or stay if we just returned from river)
            // This step happens whether we refilled or not
            steps += 1;

            // Water the plant
            currentWater -= need;
        }

        return steps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We iterate through the plants array exactly once, performing constant-time operations for each plant. The number of operations is proportional to the number of plants.

**Space Complexity:** O(1)  
We only use a few variables (`steps`, `currentWater`, loop index) regardless of input size. No additional data structures that grow with input size are used.

## Common Mistakes

1. **Off-by-one errors in step calculation:** The most common mistake is miscalculating the distance to the river. Remember: plant at index `i` is at position `i`, and the river is at position `-1`. The distance is `i + 1`, not `i`. The round trip is `2 * (i + 1)`, not `2 * i`.

2. **Forgetting to add the forward step after refilling:** After returning from the river, you're already at the plant, so you only need to add the round trip steps. However, you still need to add 1 step for initially reaching each plant. Some candidates add an extra step after refilling, effectively counting the return to the plant twice.

3. **Incorrect water management after refilling:** When you refill, you should set `currentWater = capacity`, then subtract the plant's need. Some candidates incorrectly do `currentWater = capacity - need`, which works but is less clear. Others forget to subtract after refilling.

4. **Overcomplicating with position tracking:** Some candidates try to track current position (river, between plants, etc.) with complex state. This is unnecessary since we can calculate steps directly based on plant indices.

## When You'll See This Pattern

This simulation-with-step-calculation pattern appears in problems where you need to track resource consumption and movement:

1. **Gas Station (LeetCode 134):** Similar concept of tracking a resource (gas) as you travel, with the need to potentially "refill" (return to start). Both involve circular or linear traversal with resource constraints.

2. **Jump Game II (LeetCode 45):** While not identical, it involves calculating minimum steps to reach the end with constraints on movement, requiring careful step counting.

3. **Container With Most Water (LeetCode 11):** Involves moving pointers along an array while tracking a resource (water volume), though the calculation is different.

4. **Trapping Rain Water (LeetCode 42):** Involves tracking water levels as you traverse, though the simulation is more complex.

The core pattern is: traverse an array while maintaining some state (water, gas, position) and perform calculations based on that state at each step.

## Key Takeaways

1. **Simulation problems often have direct mathematical solutions:** Instead of simulating every tiny step, look for patterns that allow you to calculate results in chunks. Here, we calculate round trips as `2 * (i + 1)` instead of simulating each step individually.

2. **Carefully track indices vs positions:** Plant at index `i` is at position `i`, but distances are measured from specific reference points (river at -1). Always clarify whether you're working with indices or positions.

3. **State management is key:** The two critical pieces of state are `currentWater` and `steps`. Update them correctly at each plant, and handle the refill case separately with its own step calculation.

Related problems: [Watering Plants II](/problem/watering-plants-ii)
