---
title: "How to Solve Minimum Hours of Training to Win a Competition — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Hours of Training to Win a Competition. Easy difficulty, 42.4% acceptance rate. Topics: Array, Greedy."
date: "2028-11-27"
category: "dsa-patterns"
tags: ["minimum-hours-of-training-to-win-a-competition", "array", "greedy", "easy"]
---

# How to Solve Minimum Hours of Training to Win a Competition

You need to win a series of competitions where each opponent has specific energy and experience requirements. You start with initial stats, and if your current stat is less than or equal to an opponent's requirement, you must train to increase it. The twist is that after each battle, your energy decreases and experience increases based on the opponent's values. This creates a dynamic where you must plan training ahead of time, since your stats change after each fight. The problem is interesting because it requires careful simulation of the battle sequence while tracking the minimum additional training needed.

## Visual Walkthrough

Let's trace through a concrete example:

- `initialEnergy = 5`, `initialExperience = 3`
- `energy = [1, 4, 3, 2]`
- `experience = [2, 6, 3, 1]`

We'll simulate each battle, tracking current stats and training needed:

**Battle 1:**

- Energy check: current energy (5) > opponent energy (1)? Yes → no energy training needed.
- Experience check: current experience (3) > opponent experience (2)? Yes → no experience training needed.
- After battle: energy = 5 - 1 = 4, experience = 3 + 2 = 5

**Battle 2:**

- Energy check: 4 > 4? No (must be strictly greater) → need 1 more energy → train 1 hour
- After training: energy = 5, experience unchanged
- Experience check: 5 > 6? No → need 2 more experience → train 2 hours
- After training: experience = 7
- After battle: energy = 5 - 4 = 1, experience = 7 + 6 = 13

**Battle 3:**

- Energy check: 1 > 3? No → need 3 more energy → train 3 hours
- After training: energy = 4
- Experience check: 13 > 3? Yes → no training needed
- After battle: energy = 4 - 3 = 1, experience = 13 + 3 = 16

**Battle 4:**

- Energy check: 1 > 2? No → need 2 more energy → train 2 hours
- After training: energy = 3
- Experience check: 16 > 1? Yes → no training needed
- After battle: energy = 3 - 2 = 1, experience = 16 + 1 = 17

Total training hours = 1 + 2 + 3 + 2 = 8 hours.

Notice that training happens immediately before each battle when needed, and stats change after each battle. The key insight is that we must simulate sequentially because each battle affects future battles.

## Brute Force Approach

A naive approach might try to calculate all possible training distributions or use backtracking to find the minimum training. However, this would be exponential in complexity. Another incorrect brute force would be to calculate the total energy/experience deficit at the beginning without considering the dynamic changes.

The correct brute force is actually the optimal solution for this problem: simulate each battle in order, training exactly enough to win each one. Since training decisions don't affect future requirements beyond the immediate stat changes, greedy simulation works perfectly. There's no exponential search needed because the optimal strategy is to train exactly enough to overcome each deficit as it arises.

## Optimal Solution

The optimal solution simulates the battles sequentially. For each opponent:

1. If current energy ≤ opponent's energy, train enough to have exactly 1 more than required
2. If current experience ≤ opponent's experience, train enough to have exactly 1 more than required
3. Battle the opponent (energy decreases, experience increases)

We track total training hours and update stats after each battle. This greedy approach works because:

- Training is only beneficial for upcoming battles (no reason to train for past ones)
- There's no penalty for training more than needed, but we minimize by training exactly enough
- The order is fixed, so we must handle opponents in sequence

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minNumberOfHours(self, initialEnergy: int, initialExperience: int, energy: List[int], experience: List[int]) -> int:
    # Start with initial stats
    current_energy = initialEnergy
    current_experience = initialExperience
    total_training = 0

    # Process each opponent in order
    for i in range(len(energy)):
        # Check if we need energy training for this opponent
        if current_energy <= energy[i]:
            # Train exactly enough to have 1 more than required
            needed = energy[i] - current_energy + 1
            total_training += needed
            current_energy += needed  # Update after training

        # Check if we need experience training for this opponent
        if current_experience <= experience[i]:
            # Train exactly enough to have 1 more than required
            needed = experience[i] - current_experience + 1
            total_training += needed
            current_experience += needed  # Update after training

        # Battle the opponent (stats change after battle)
        current_energy -= energy[i]
        current_experience += experience[i]

    return total_training
```

```javascript
// Time: O(n) | Space: O(1)
var minNumberOfHours = function (initialEnergy, initialExperience, energy, experience) {
  // Start with initial stats
  let currentEnergy = initialEnergy;
  let currentExperience = initialExperience;
  let totalTraining = 0;

  // Process each opponent in order
  for (let i = 0; i < energy.length; i++) {
    // Check if we need energy training for this opponent
    if (currentEnergy <= energy[i]) {
      // Train exactly enough to have 1 more than required
      const needed = energy[i] - currentEnergy + 1;
      totalTraining += needed;
      currentEnergy += needed; // Update after training
    }

    // Check if we need experience training for this opponent
    if (currentExperience <= experience[i]) {
      // Train exactly enough to have 1 more than required
      const needed = experience[i] - currentExperience + 1;
      totalTraining += needed;
      currentExperience += needed; // Update after training
    }

    // Battle the opponent (stats change after battle)
    currentEnergy -= energy[i];
    currentExperience += experience[i];
  }

  return totalTraining;
};
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minNumberOfHours(int initialEnergy, int initialExperience, int[] energy, int[] experience) {
        // Start with initial stats
        int currentEnergy = initialEnergy;
        int currentExperience = initialExperience;
        int totalTraining = 0;

        // Process each opponent in order
        for (int i = 0; i < energy.length; i++) {
            // Check if we need energy training for this opponent
            if (currentEnergy <= energy[i]) {
                // Train exactly enough to have 1 more than required
                int needed = energy[i] - currentEnergy + 1;
                totalTraining += needed;
                currentEnergy += needed;  // Update after training
            }

            // Check if we need experience training for this opponent
            if (currentExperience <= experience[i]) {
                // Train exactly enough to have 1 more than required
                int needed = experience[i] - currentExperience + 1;
                totalTraining += needed;
                currentExperience += needed;  // Update after training
            }

            // Battle the opponent (stats change after battle)
            currentEnergy -= energy[i];
            currentExperience += experience[i];
        }

        return totalTraining;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of opponents. We process each opponent exactly once, performing constant-time operations for each.

**Space Complexity:** O(1) for all solutions. We only use a few variables to track current stats and total training, regardless of input size. The input arrays are given and not counted toward our space usage.

## Common Mistakes

1. **Using ≤ instead of < for comparisons**: The problem states you need strictly greater energy/experience to win. Using `currentEnergy < energy[i]` instead of `currentEnergy <= energy[i]` would be incorrect because equality means you lose.

2. **Forgetting to update stats after training**: If you calculate training needed but forget to add it to current stats, subsequent calculations will be wrong. Always update both the training total AND the current stat.

3. **Processing training in wrong order**: Some candidates try to calculate all training upfront. This doesn't work because experience increases after each battle, affecting future requirements. Must process sequentially.

4. **Off-by-one errors in training calculation**: When calculating how much to train, remember you need to be strictly greater. The formula is `required - current + 1`, not `required - current`.

## When You'll See This Pattern

This greedy simulation pattern appears in problems where you process events sequentially with cumulative effects:

1. **Candy (LeetCode 135)** - Similar sequential processing where you compare adjacent elements and make adjustments based on comparisons.

2. **Gas Station (LeetCode 134)** - Another sequential simulation problem where you track a resource (gas) that gets consumed and replenished.

3. **Jump Game (LeetCode 55)** - While not identical, it involves tracking a resource (maximum reach) as you move through an array.

The core pattern is: iterate through elements in order, maintain some state that changes based on current element, and make decisions that affect future iterations.

## Key Takeaways

- **Greedy simulation works when decisions are locally optimal**: If training exactly enough for the current opponent doesn't hurt future battles (and in this case helps), greedy is optimal.

- **Watch for strict vs non-strict comparisons**: Many competition problems require strictly greater/less than rather than greater/less than or equal to.

- **Update state immediately after decisions**: When you decide to train, update both the training counter AND the affected stat before proceeding.

[Practice this problem on CodeJeet](/problem/minimum-hours-of-training-to-win-a-competition)
