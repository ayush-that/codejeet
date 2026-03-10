---
title: "How to Solve Maximum Points After Enemy Battles — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Points After Enemy Battles. Medium difficulty, 33.2% acceptance rate. Topics: Array, Greedy."
date: "2029-04-23"
category: "dsa-patterns"
tags: ["maximum-points-after-enemy-battles", "array", "greedy", "medium"]
---

# How to Solve Maximum Points After Enemy Battles

You're given an array of enemy energies and your starting energy. You can either battle an unmarked enemy (gaining their energy) or battle a marked enemy (gaining points equal to your current energy). The challenge is to maximize your total points by strategically choosing which enemies to mark and when to battle them. What makes this problem interesting is that it's not about the order of enemies, but about which ones you convert to points versus which ones you absorb for energy.

## Visual Walkthrough

Let's trace through an example: `enemyEnergies = [3, 1, 4]` with `currentEnergy = 2`.

**Initial state:** Energy = 2, Points = 0, All enemies unmarked: [3, 1, 4]

**Step 1:** We need to decide: mark an enemy or battle an unmarked one?  
If we battle an unmarked enemy, we gain their energy. Let's sort enemies to see which ones we can beat: [1, 3, 4].  
With energy 2, we can only beat enemy 1. So we battle enemy 1:  
Energy = 2 + 1 = 3, Points = 0, Marked enemies: [1]

**Step 2:** Now with energy 3, we can beat enemy 3. Battle enemy 3:  
Energy = 3 + 3 = 6, Points = 0, Marked enemies: [1, 3]

**Step 3:** With energy 6, we can beat enemy 4. Battle enemy 4:  
Energy = 6 + 4 = 10, Points = 0, All enemies marked: [1, 3, 4]

**Step 4:** Now we can only battle marked enemies for points. Battle enemy 1:  
Energy = 10, Points = 0 + 10 = 10, Marked enemies: [3, 4]

**Step 5:** Battle enemy 3:  
Energy = 10, Points = 10 + 10 = 20, Marked enemies: [4]

**Step 6:** Battle enemy 4:  
Energy = 10, Points = 20 + 10 = 30

**Total points:** 30

But wait — could we do better? What if we marked some enemies earlier? Let's try a different approach:

**Alternative approach:** Start by marking the smallest enemy we can beat.

**Initial:** Energy = 2, Points = 0, All unmarked: [3, 1, 4]

**Step 1:** Mark enemy 1 (smallest we can beat with energy 2):  
Energy = 2, Points = 0 + 2 = 2, Marked: [1], Unmarked: [3, 4]

**Step 2:** Now battle unmarked enemy 3 (we have energy 2, enemy 3 > 2, can't battle).  
We need more energy, so battle unmarked enemy 4? Also > 2. We're stuck!

This shows the key insight: We should first battle all unmarked enemies we can beat to gain their energy, THEN mark and battle enemies for points. But which enemies should we mark? The largest ones, because when we battle marked enemies, we get points equal to our current energy, which is largest after absorbing all possible unmarked enemies.

## Brute Force Approach

A brute force approach would try all possible sequences of actions. At each step, we could either:

1. Battle an unmarked enemy (if our energy ≥ their energy)
2. Battle a marked enemy (gaining points)

With n enemies, there are 2^n possible marking decisions (each enemy can be marked or unmarked initially), and for each marking pattern, we need to decide the order of battles. This leads to factorial complexity O(n!), which is completely infeasible for any reasonable n.

Even a simpler brute force that tries all permutations of battle order would be O(n!), since we need to consider all possible sequences of battling n enemies. For n=20, that's 20! ≈ 2.4×10¹⁸ operations — impossible.

The key observation that saves us: The optimal strategy has a specific structure we can exploit.

## Optimized Approach

The optimal strategy follows this pattern:

1. **Sort the enemies** in ascending order
2. **Battle unmarked enemies** from smallest to largest while we can beat them
   - This maximizes our energy gain early on
   - We can only battle an enemy if currentEnergy ≥ enemyEnergy
3. **Mark the largest remaining enemies** for points
   - Once we can't beat any more unmarked enemies, we start marking the largest ones
   - When we battle a marked enemy, we gain points = currentEnergy
4. **Repeat** until all enemies are battled

Why does this work? Let's think about the trade-off:

- If we battle an unmarked enemy, we gain their energy
- If we battle a marked enemy, we gain points = currentEnergy

The value of battling a marked enemy increases with our current energy. So we want to maximize our energy FIRST, then convert that energy to points by battling marked enemies. And since we get the same points for battling any marked enemy (currentEnergy), we should mark the largest enemies (which are hardest to beat for energy) and save the smaller ones to absorb for energy.

The algorithm becomes:

1. Sort enemies
2. Use two pointers: `left` for smallest unmarked enemies (to absorb for energy), `right` for largest enemies (to mark for points)
3. While we can beat the smallest unmarked enemy, battle it and increase energy
4. When we can't beat the smallest unmarked enemy, mark the largest enemy and gain points
5. Repeat until all enemies are processed

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def maximumPoints(enemyEnergies, currentEnergy):
    """
    Calculate maximum points by strategically battling enemies.

    Strategy:
    1. Sort enemies to easily find which ones we can beat (smallest first)
    2. Use two pointers: left (smallest available) and right (largest available)
    3. While we have enemies to battle:
       - If we can beat the smallest enemy, absorb it for energy
       - Otherwise, mark and battle the largest enemy for points
    4. Continue until all enemies are processed

    Args:
        enemyEnergies: List of enemy energy values
        currentEnergy: Starting energy

    Returns:
        Maximum points achievable
    """
    # Sort enemies in ascending order
    enemies = sorted(enemyEnergies)

    left = 0  # Pointer to smallest available enemy
    right = len(enemies) - 1  # Pointer to largest available enemy
    points = 0

    # Continue while there are enemies between left and right (inclusive)
    while left <= right:
        # If we can beat the smallest enemy, absorb it for energy
        if currentEnergy > enemies[left]:
            # Battle the smallest unmarked enemy
            currentEnergy += enemies[left]
            left += 1  # Move to next smallest enemy
        else:
            # We can't beat the smallest enemy, so mark the largest enemy for points
            # But only if we have at least one enemy left to mark
            if left < right:
                # Mark and battle the largest enemy for points
                points += currentEnergy
                right -= 1  # This enemy is now battled
            else:
                # Only one enemy left and we can't beat it, so we're done
                break

    return points
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function maximumPoints(enemyEnergies, currentEnergy) {
  /**
   * Calculate maximum points by strategically battling enemies.
   *
   * Strategy:
   * 1. Sort enemies to easily find which ones we can beat (smallest first)
   * 2. Use two pointers: left (smallest available) and right (largest available)
   * 3. While we have enemies to battle:
   *    - If we can beat the smallest enemy, absorb it for energy
   *    - Otherwise, mark and battle the largest enemy for points
   * 4. Continue until all enemies are processed
   *
   * @param {number[]} enemyEnergies - Array of enemy energy values
   * @param {number} currentEnergy - Starting energy
   * @return {number} Maximum points achievable
   */

  // Sort enemies in ascending order
  const enemies = [...enemyEnergies].sort((a, b) => a - b);

  let left = 0; // Pointer to smallest available enemy
  let right = enemies.length - 1; // Pointer to largest available enemy
  let points = 0;

  // Continue while there are enemies between left and right (inclusive)
  while (left <= right) {
    // If we can beat the smallest enemy, absorb it for energy
    if (currentEnergy > enemies[left]) {
      // Battle the smallest unmarked enemy
      currentEnergy += enemies[left];
      left++; // Move to next smallest enemy
    } else {
      // We can't beat the smallest enemy, so mark the largest enemy for points
      // But only if we have at least one enemy left to mark
      if (left < right) {
        // Mark and battle the largest enemy for points
        points += currentEnergy;
        right--; // This enemy is now battled
      } else {
        // Only one enemy left and we can't beat it, so we're done
        break;
      }
    }
  }

  return points;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    public long maximumPoints(int[] enemyEnergies, int currentEnergy) {
        /**
         * Calculate maximum points by strategically battling enemies.
         *
         * Strategy:
         * 1. Sort enemies to easily find which ones we can beat (smallest first)
         * 2. Use two pointers: left (smallest available) and right (largest available)
         * 3. While we have enemies to battle:
         *    - If we can beat the smallest enemy, absorb it for energy
         *    - Otherwise, mark and battle the largest enemy for points
         * 4. Continue until all enemies are processed
         *
         * @param enemyEnergies Array of enemy energy values
         * @param currentEnergy Starting energy
         * @return Maximum points achievable
         */

        // Sort enemies in ascending order
        int[] enemies = enemyEnergies.clone();
        Arrays.sort(enemies);

        int left = 0;  // Pointer to smallest available enemy
        int right = enemies.length - 1;  // Pointer to largest available enemy
        long points = 0;  // Use long to prevent overflow with large values

        // Continue while there are enemies between left and right (inclusive)
        while (left <= right) {
            // If we can beat the smallest enemy, absorb it for energy
            if (currentEnergy > enemies[left]) {
                // Battle the smallest unmarked enemy
                currentEnergy += enemies[left];
                left++;  // Move to next smallest enemy
            } else {
                // We can't beat the smallest enemy, so mark the largest enemy for points
                // But only if we have at least one enemy left to mark
                if (left < right) {
                    // Mark and battle the largest enemy for points
                    points += currentEnergy;
                    right--;  // This enemy is now battled
                } else {
                    // Only one enemy left and we can't beat it, so we're done
                    break;
                }
            }
        }

        return points;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the enemies takes O(n log n) time
- The two-pointer traversal takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity:** O(1) or O(n)

- If we sort in-place (modifying input), space is O(1) aside from sort algorithm overhead
- If we create a copy to sort (as in JavaScript/Java solutions), space is O(n)
- The two-pointer approach uses only constant extra space

## Common Mistakes

1. **Not sorting the array:** Attempting to process enemies in random order misses the optimal strategy. The greedy approach relies on always battling the smallest beatable enemy for energy and marking the largest for points.

2. **Incorrect comparison condition:** Using `currentEnergy >= enemies[left]` instead of `currentEnergy > enemies[left]`. According to the problem, you can only battle an enemy if your energy is strictly greater than theirs (not equal).

3. **Forgetting the edge case with one enemy:** When `left == right` and we can't beat the last enemy, we need to break out of the loop. Otherwise, we might try to mark an enemy that doesn't exist or enter an infinite loop.

4. **Integer overflow:** Not using `long` in Java for points accumulation. With large energy values and many enemies, points can exceed 32-bit integer limits.

## When You'll See This Pattern

This problem uses a **greedy two-pointer approach on sorted data**, which appears in many optimization problems:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167):** Uses two pointers from both ends of a sorted array to find pairs summing to a target.

2. **Container With Most Water (LeetCode 11):** Uses two pointers to find the maximum area, moving the pointer with the smaller height.

3. **Assign Cookies (LeetCode 455):** Greedily assign the smallest cookie that satisfies each child, requiring sorting first.

The pattern is: when you need to make optimal pairwise decisions and the optimal strategy involves processing elements in a specific order, sort the data and use two pointers to make greedy choices.

## Key Takeaways

1. **Sorting enables greedy choices:** When faced with optimization problems where order matters, sorting often reveals the optimal strategy. Here, sorting lets us always pick the smallest beatable enemy for energy gain.

2. **Two-pointer technique for opposing objectives:** When you have two competing goals (gain energy vs. gain points), using pointers from both ends of the sorted array helps balance them optimally.

3. **Energy vs. points trade-off analysis:** The core insight is that points are proportional to current energy, so maximize energy first, then convert to points. This "accumulate then leverage" pattern appears in many resource optimization problems.

[Practice this problem on CodeJeet](/problem/maximum-points-after-enemy-battles)
