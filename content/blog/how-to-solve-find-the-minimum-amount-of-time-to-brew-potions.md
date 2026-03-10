---
title: "How to Solve Find the Minimum Amount of Time to Brew Potions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Minimum Amount of Time to Brew Potions. Medium difficulty, 62.7% acceptance rate. Topics: Array, Simulation, Prefix Sum."
date: "2027-09-16"
category: "dsa-patterns"
tags:
  ["find-the-minimum-amount-of-time-to-brew-potions", "array", "simulation", "prefix-sum", "medium"]
---

# How to Solve "Find the Minimum Amount of Time to Brew Potions"

This problem presents a scheduling challenge where multiple wizards must sequentially process multiple potions. The tricky part is that each potion must pass through all wizards in order, but wizards can work on different potions simultaneously—like an assembly line. The goal is to find the minimum total time to complete all potions given each wizard's skill level and each potion's mana requirement.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
skill = [3, 1, 4]  (3 wizards)
mana = [2, 5, 3]   (3 potions)
```

**Step-by-step simulation:**

We'll track when each wizard starts and finishes each potion:

1. **Potion 0 (mana=2):**
   - Wizard 0: Time = mana[0]/skill[0] = 2/3 = 0.67
   - Wizard 1: Can start only after Wizard 0 finishes potion 0 at time 0.67
     Time = 0.67 + 2/1 = 0.67 + 2 = 2.67
   - Wizard 2: Can start only after Wizard 1 finishes potion 0 at time 2.67
     Time = 2.67 + 2/4 = 2.67 + 0.5 = 3.17
   - Potion 0 completes at time 3.17

2. **Potion 1 (mana=5):**
   - Wizard 0: Can start only after finishing potion 0 (time 0.67)
     Time = 0.67 + 5/3 = 0.67 + 1.67 = 2.34
   - Wizard 1: Can start only when:
     1. Wizard 1 finishes potion 0 (time 2.67) AND
     2. Wizard 0 finishes potion 1 (time 2.34)
        The later time is 2.67
        Time = 2.67 + 5/1 = 2.67 + 5 = 7.67
   - Wizard 2: Can start only when:
     1. Wizard 2 finishes potion 0 (time 3.17) AND
     2. Wizard 1 finishes potion 1 (time 7.67)
        The later time is 7.67
        Time = 7.67 + 5/4 = 7.67 + 1.25 = 8.92

3. **Potion 2 (mana=3):**
   - Wizard 0: Can start after finishing potion 1 (time 2.34)
     Time = 2.34 + 3/3 = 2.34 + 1 = 3.34
   - Wizard 1: Can start when:
     1. Wizard 1 finishes potion 1 (time 7.67) AND
     2. Wizard 0 finishes potion 2 (time 3.34)
        The later time is 7.67
        Time = 7.67 + 3/1 = 7.67 + 3 = 10.67
   - Wizard 2: Can start when:
     1. Wizard 2 finishes potion 1 (time 8.92) AND
     2. Wizard 1 finishes potion 2 (time 10.67)
        The later time is 10.67
        Time = 10.67 + 3/4 = 10.67 + 0.75 = 11.42

**Final answer:** 11.42 (the time when the last wizard finishes the last potion)

The key insight: Each wizard can only start a potion when both (1) they finish the previous potion, and (2) the previous wizard finishes the current potion.

## Brute Force Approach

A naive approach would simulate the entire process step-by-step, tracking when each wizard starts and finishes each potion. We could use a 2D array `time[i][j]` to store when wizard `i` finishes potion `j`.

**Why this is inefficient:**

- We need to compute times for all `n × m` wizard-potion pairs
- Each computation depends on two previous values
- The time complexity would be O(n × m), which is acceptable for small inputs but becomes problematic when n and m are large (up to 10^5 each in some test cases)
- The real issue is that we're computing more than we need—we only care about the final completion time

**What candidates might try:**
Some might try to process potions one at a time, waiting for all wizards to finish before starting the next potion. This would be even slower (O(n × m²)) and doesn't account for the assembly-line parallelism.

## Optimized Approach

The key insight is that we don't need to track every wizard-potion pair. We only need to know when each wizard becomes available and when each potion reaches each wizard.

Think of it as a flow through a pipeline:

1. Each potion must pass through all wizards in order
2. A wizard can only work on one potion at a time
3. A potion can only be at one wizard at a time

**Step-by-step reasoning:**

1. For the first wizard (wizard 0), they can start each potion as soon as they finish the previous potion
2. For subsequent wizards, they can start a potion only when:
   - They finish the previous potion (their own availability)
   - The previous wizard finishes the current potion (the potion's arrival time)
3. We can track two arrays:
   - `wizard_time`: when each wizard will be available next
   - `potion_time`: when each potion will reach the next wizard

**The optimization:**
Instead of a 2D array, we only need 1D arrays because we process potions sequentially. For each potion, we update the times as it flows through the wizards. This reduces space from O(n × m) to O(n).

## Optimal Solution

The solution processes potions one by one, tracking when each wizard becomes available. For each potion, we calculate its completion time through the pipeline, updating wizard availability as we go.

<div class="code-group">

```python
# Time: O(n * m) | Space: O(n)
def min_time_to_brew(skill, mana):
    """
    Calculate minimum time to brew all potions.

    Args:
        skill: List of wizard skill levels (length n)
        mana: List of potion mana requirements (length m)

    Returns:
        Minimum time to brew all potions
    """
    n = len(skill)
    m = len(mana)

    # Track when each wizard will be available next
    # Initially, all wizards are available at time 0
    wizard_available = [0.0] * n

    # Process each potion in order
    for j in range(m):
        # Current potion starts at wizard 0
        current_time = wizard_available[0]

        # Pass the potion through all wizards
        for i in range(n):
            # Wizard i can start this potion at the later of:
            # 1. When they become available (finish previous work)
            # 2. When the potion arrives from previous wizard
            start_time = max(current_time, wizard_available[i])

            # Calculate processing time for this wizard
            process_time = mana[j] / skill[i]

            # Update when this wizard will finish this potion
            finish_time = start_time + process_time

            # The potion moves to next wizard at this finish time
            current_time = finish_time

            # This wizard will be available after finishing this potion
            wizard_available[i] = finish_time

    # The last wizard's availability after last potion is the total time
    return wizard_available[-1]
```

```javascript
// Time: O(n * m) | Space: O(n)
function minTimeToBrew(skill, mana) {
  /**
   * Calculate minimum time to brew all potions.
   *
   * @param {number[]} skill - Wizard skill levels (length n)
   * @param {number[]} mana - Potion mana requirements (length m)
   * @return {number} Minimum time to brew all potions
   */
  const n = skill.length;
  const m = mana.length;

  // Track when each wizard will be available next
  // Initially, all wizards are available at time 0
  const wizardAvailable = new Array(n).fill(0);

  // Process each potion in order
  for (let j = 0; j < m; j++) {
    // Current potion starts at wizard 0
    let currentTime = wizardAvailable[0];

    // Pass the potion through all wizards
    for (let i = 0; i < n; i++) {
      // Wizard i can start this potion at the later of:
      // 1. When they become available (finish previous work)
      // 2. When the potion arrives from previous wizard
      const startTime = Math.max(currentTime, wizardAvailable[i]);

      // Calculate processing time for this wizard
      const processTime = mana[j] / skill[i];

      // Update when this wizard will finish this potion
      const finishTime = startTime + processTime;

      // The potion moves to next wizard at this finish time
      currentTime = finishTime;

      // This wizard will be available after finishing this potion
      wizardAvailable[i] = finishTime;
    }
  }

  // The last wizard's availability after last potion is the total time
  return wizardAvailable[n - 1];
}
```

```java
// Time: O(n * m) | Space: O(n)
public double minTimeToBrew(int[] skill, int[] mana) {
    /**
     * Calculate minimum time to brew all potions.
     *
     * @param skill Wizard skill levels (length n)
     * @param mana Potion mana requirements (length m)
     * @return Minimum time to brew all potions
     */
    int n = skill.length;
    int m = mana.length;

    // Track when each wizard will be available next
    // Initially, all wizards are available at time 0
    double[] wizardAvailable = new double[n];

    // Process each potion in order
    for (int j = 0; j < m; j++) {
        // Current potion starts at wizard 0
        double currentTime = wizardAvailable[0];

        // Pass the potion through all wizards
        for (int i = 0; i < n; i++) {
            // Wizard i can start this potion at the later of:
            // 1. When they become available (finish previous work)
            // 2. When the potion arrives from previous wizard
            double startTime = Math.max(currentTime, wizardAvailable[i]);

            // Calculate processing time for this wizard
            double processTime = (double) mana[j] / skill[i];

            // Update when this wizard will finish this potion
            double finishTime = startTime + processTime;

            // The potion moves to next wizard at this finish time
            currentTime = finishTime;

            // This wizard will be available after finishing this potion
            wizardAvailable[i] = finishTime;
        }
    }

    // The last wizard's availability after last potion is the total time
    return wizardAvailable[n - 1];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m)

- We have an outer loop iterating through all `m` potions
- For each potion, we have an inner loop iterating through all `n` wizards
- Each iteration performs constant-time operations (comparisons, arithmetic)
- This is optimal because we must process each wizard-potion interaction at least once

**Space Complexity:** O(n)

- We maintain an array `wizard_available` of size `n` to track when each wizard becomes free
- We don't need to store times for all potions simultaneously
- The space for input arrays is not counted toward auxiliary space complexity

## Common Mistakes

1. **Integer division:** Forgetting to use floating-point division when calculating `mana[j] / skill[i]`. In languages like Java and Python 2, integer division truncates. Always cast to float/double first.

2. **Wrong initialization:** Starting `current_time` at 0 for each potion instead of `wizard_available[0]`. The first wizard might not be immediately available if they just finished a previous potion.

3. **Updating availability incorrectly:** Setting `wizard_available[i] = start_time + process_time` instead of `finish_time`. The wizard becomes available when they finish, not when they start.

4. **Returning wrong value:** Returning the last value of `current_time` instead of `wizard_available[-1]`. After processing the last potion, `current_time` tracks when it finished at the current wizard, but we need when it finishes at the last wizard.

## When You'll See This Pattern

This assembly-line scheduling pattern appears in several contexts:

1. **Pipeline processing:** Similar to CPU instruction pipelines or manufacturing assembly lines where items must pass through multiple stations.

2. **Task scheduling with dependencies:** When tasks have precedence constraints (task B can't start until task A finishes).

3. **Related LeetCode problems:**
   - **#1463** "Cherry Pickup II": Similar concept of two paths moving through a grid with dependency constraints.
   - **#410** "Split Array Largest Sum": Different problem but uses similar prefix-sum and binary search techniques for optimization.
   - **#1235** "Maximum Profit in Job Scheduling": Scheduling with time constraints and optimization.

## Key Takeaways

1. **Assembly-line thinking:** When items must pass through multiple stages in order, and stages can work on different items simultaneously, think in terms of tracking when each stage becomes available.

2. **Space-time tradeoff:** We optimized from O(n × m) space to O(n) by realizing we only need current availability, not historical data for all items.

3. **Dependency resolution:** The core logic `max(current_time, wizard_available[i])` captures that a stage can only start when both the item arrives AND the stage is free.

[Practice this problem on CodeJeet](/problem/find-the-minimum-amount-of-time-to-brew-potions)
