---
title: "How to Solve Minimum Initial Energy to Finish Tasks — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Initial Energy to Finish Tasks. Hard difficulty, 60.7% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-09-19"
category: "dsa-patterns"
tags: ["minimum-initial-energy-to-finish-tasks", "array", "greedy", "sorting", "hard"]
---

# How to Solve Minimum Initial Energy to Finish Tasks

You're given tasks where each requires a minimum energy to start and consumes actual energy to complete. The challenge is finding the **minimum initial energy** needed to complete all tasks in any order. What makes this tricky is that the order matters—some tasks act as "energy buffers" (where minimum < actual) while others are "energy drains" (where minimum > actual). The optimal sequence maximizes your energy throughout the process.

## Visual Walkthrough

Let's trace through `tasks = [[1,2],[2,4],[4,5]]`:

- **Task 1**: Need ≥2 to start, spend 1 → net change: +1 energy (since you keep leftover)
- **Task 2**: Need ≥4 to start, spend 2 → net change: +2 energy
- **Task 3**: Need ≥5 to start, spend 4 → net change: +1 energy

If we process in given order starting with energy `E`:

1. Do task 1: Need `E ≥ 2`. After: energy = `E - 1 + 2?` Wait—careful!  
   Actually: You start with `E`, must have `E ≥ 2`. You spend 1, so remaining = `E - 1`.
2. Do task 2: Need current energy ≥4 → `E - 1 ≥ 4` → `E ≥ 5`. After: energy = `(E - 1) - 2 = E - 3`.
3. Do task 3: Need current energy ≥5 → `E - 3 ≥ 5` → `E ≥ 8`.  
   So initial `E = 8` works.

But is 8 minimal? Let's try reordering:  
Sort by `(minimum - actual)` difference:

- Task 2: 4-2 = +2 (buffer)
- Task 1: 2-1 = +1 (buffer)
- Task 3: 5-4 = +1 (buffer)

Actually all are buffers! Let's try a better example: `[[1,3],[2,4],[10,10]]`:

- Task 1: Need 3, spend 1 → net +2
- Task 2: Need 4, spend 2 → net +2
- Task 3: Need 10, spend 10 → net 0

If we do task 3 last:  
Start with `E`, do task 1: Need `E ≥ 3`, after: energy = `E - 1`  
Do task 2: Need `E - 1 ≥ 4` → `E ≥ 5`, after: energy = `E - 3`  
Do task 3: Need `E - 3 ≥ 10` → `E ≥ 13`.

If we do task 3 first:  
Start with `E ≥ 10`, after: energy = `E - 10`  
Do task 1: Need `E - 10 ≥ 3` → `E ≥ 13`  
Do task 2: Need `E - 11 ≥ 4` → `E ≥ 15` → worse!

The insight: **Do energy-draining tasks (minimum > actual) early when you have more energy, and do energy-gaining tasks (minimum < actual) later to build up reserves.**

## Brute Force Approach

The brute force tries all `n!` permutations of tasks, simulating energy changes:

1. For each permutation, start with some initial energy `E`
2. Check if at each step current energy ≥ task's minimum
3. Update energy: `energy -= actual`
4. Track the minimum `E` that works for any permutation

This is `O(n! × n)` — impossibly slow for `n > 10`. Even trying binary search on `E` with all permutations is `O(n! × n × log(maxEnergy))`.

What candidates might incorrectly try:

- Sorting by minimum ascending (fails on `[[10,10],[1,3],[2,4]]` → gives 13 instead of 12)
- Sorting by actual ascending (fails similarly)
- Greedily picking smallest minimum first doesn't account for energy accumulation

## Optimized Approach

The key insight comes from analyzing the **energy surplus/deficit** each task creates:

Let `diff = minimum - actual`:

- If `diff > 0`: Task is a **net drain** — you need more than you'll have left
- If `diff < 0`: Task is a **net gain** — you'll end with more energy than you started

**Optimal ordering**: Process net drains first (largest positive diff), then net gains (most negative diff). Why?

- Drains require high energy upfront — do them while you have maximum energy
- Gains increase your energy — do them later to build buffer for... actually wait, we do gains last because they're easier!

Actually, let's think mathematically:  
We need to find minimal `E` such that there exists an order where:

```
E ≥ min₁
E - act₁ ≥ min₂
E - act₁ - act₂ ≥ min₃
...
```

Rearrange: `E ≥ max(min₁, min₂ + act₁, min₃ + act₁ + act₂, ...)`

So `E` must be at least the maximum of all prefix sums of `actual` plus the next task's minimum.

The optimal order minimizes this maximum. Sort by `(minimum - actual)` **descending**:

- Tasks with larger `minimum - actual` (drains) come first
- Tasks with smaller or negative `minimum - actual` (gains) come last

Proof sketch: Swapping two adjacent tasks in optimal order shouldn't reduce requirements. The comparison function `(minA - actA) > (minB - actB)` ensures this.

## Optimal Solution

We sort by `(minimum - actual)` descending, then simulate to find the required initial energy.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def minimumEffort(tasks):
    """
    Calculate minimum initial energy to complete all tasks in optimal order.

    Strategy: Sort tasks by (minimum - actual) descending, then simulate.
    This ensures energy-draining tasks come first when we have most energy.
    """
    # Sort by net energy requirement difference (minimum - actual) descending
    # Larger positive difference = bigger drain, do first
    # Negative difference = net gain, do later
    tasks.sort(key=lambda x: x[1] - x[0], reverse=True)

    # Start with 0 initial energy, we'll calculate required as we go
    current_energy = 0
    required_energy = 0

    for actual, minimum in tasks:
        # If current energy is less than minimum needed for this task,
        # we need to increase our initial energy to cover the deficit
        if current_energy < minimum:
            # Add enough initial energy so current_energy reaches minimum
            deficit = minimum - current_energy
            required_energy += deficit
            current_energy += deficit

        # Now we have enough energy to start the task
        # Complete the task: spend actual energy
        current_energy -= actual

    return required_energy
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
/**
 * Calculate minimum initial energy to complete all tasks in optimal order.
 *
 * Strategy: Sort tasks by (minimum - actual) descending, then simulate.
 * This ensures energy-draining tasks come first when we have most energy.
 */
function minimumEffort(tasks) {
  // Sort by net energy requirement difference (minimum - actual) descending
  // Larger positive difference = bigger drain, do first
  // Negative difference = net gain, do later
  tasks.sort((a, b) => b[1] - b[0] - (a[1] - a[0]));

  // Start with 0 initial energy, we'll calculate required as we go
  let currentEnergy = 0;
  let requiredEnergy = 0;

  for (const [actual, minimum] of tasks) {
    // If current energy is less than minimum needed for this task,
    // we need to increase our initial energy to cover the deficit
    if (currentEnergy < minimum) {
      // Add enough initial energy so currentEnergy reaches minimum
      const deficit = minimum - currentEnergy;
      requiredEnergy += deficit;
      currentEnergy += deficit;
    }

    // Now we have enough energy to start the task
    // Complete the task: spend actual energy
    currentEnergy -= actual;
  }

  return requiredEnergy;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    /**
     * Calculate minimum initial energy to complete all tasks in optimal order.
     *
     * Strategy: Sort tasks by (minimum - actual) descending, then simulate.
     * This ensures energy-draining tasks come first when we have most energy.
     */
    public int minimumEffort(int[][] tasks) {
        // Sort by net energy requirement difference (minimum - actual) descending
        // Larger positive difference = bigger drain, do first
        // Negative difference = net gain, do later
        Arrays.sort(tasks, (a, b) -> {
            int diffA = a[1] - a[0];
            int diffB = b[1] - b[0];
            return diffB - diffA; // Descending order
        });

        // Start with 0 initial energy, we'll calculate required as we go
        int currentEnergy = 0;
        int requiredEnergy = 0;

        for (int[] task : tasks) {
            int actual = task[0];
            int minimum = task[1];

            // If current energy is less than minimum needed for this task,
            // we need to increase our initial energy to cover the deficit
            if (currentEnergy < minimum) {
                // Add enough initial energy so currentEnergy reaches minimum
                int deficit = minimum - currentEnergy;
                requiredEnergy += deficit;
                currentEnergy += deficit;
            }

            // Now we have enough energy to start the task
            // Complete the task: spend actual energy
            currentEnergy -= actual;
        }

        return requiredEnergy;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n log n)`

- Sorting `n` tasks takes `O(n log n)` time
- Single pass through tasks takes `O(n)` time
- Dominated by the sort operation

**Space Complexity:** `O(1)` or `O(n)`

- `O(1)` if sort is in-place (like Python's Timsort)
- `O(n)` if sort requires extra space (depends on language/library)
- Simulation uses only a few integer variables

## Common Mistakes

1. **Sorting by minimum or actual alone**:  
   Candidates try sorting by `minimum` ascending, thinking "do easiest tasks first." This fails for tasks like `[[10,10],[1,3]]` where you need 10 energy upfront regardless. Always consider the net effect `(minimum - actual)`.

2. **Forgetting to update current energy after adding deficit**:  
   In the simulation, when you add to `requiredEnergy`, you must also add to `currentEnergy`. Otherwise, you'll think you have less energy than you actually do for subsequent tasks.

3. **Incorrect comparison in sort**:  
   Mixing up ascending vs descending order. Remember: larger `(minimum - actual)` means bigger drain → do first. So sort **descending** by this difference.

4. **Integer overflow with large sums**:  
   With many tasks, `requiredEnergy` could exceed 32-bit int limit. Use 64-bit integers (long in Java/JavaScript, int in Python handles big integers automatically).

## When You'll See This Pattern

This "sort by difference/cost-benefit" pattern appears in scheduling problems where order affects feasibility:

1. **Maximum Performance of a Team (LeetCode 1383)** - Sort engineers by efficiency, use heap to track fastest
2. **Course Schedule III (LeetCode 630)** - Sort courses by deadline, use max-heap for durations
3. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)** - Sort by end coordinate, greedily shoot arrows

The common theme: You can't just consider one attribute (like minimum energy or deadline). You need to consider the **trade-off** between requirements and costs to find optimal ordering.

## Key Takeaways

1. **When order matters for feasibility, think about sorting by a derived metric** that captures the trade-off between requirements and costs. Here, `minimum - actual` tells us if a task is a net energy drain or gain.

2. **Simulate after sorting to verify correctness** — walk through small examples to ensure your sort order works. The mathematical proof helps, but concrete examples build intuition.

3. **Greedy scheduling often involves sorting plus simulation** — identify what makes a task "hard" (large minimum relative to actual) and do those first when resources are plentiful.

[Practice this problem on CodeJeet](/problem/minimum-initial-energy-to-finish-tasks)
