---
title: "How to Solve Minimum Amount of Damage Dealt to Bob — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Amount of Damage Dealt to Bob. Hard difficulty, 39.6% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2026-02-12"
category: "dsa-patterns"
tags: ["minimum-amount-of-damage-dealt-to-bob", "array", "greedy", "sorting", "hard"]
---

# How to Solve Minimum Amount of Damage Dealt to Bob

This problem presents a strategic optimization challenge: you control the order in which Bob fights enemies, each dealing continuous damage while alive, and you want to minimize the total damage Bob takes. The twist is that you can only kill one enemy per second, and enemies deal damage _before_ you get to attack each second. This creates a tension between killing high-damage enemies quickly (to stop their damage) and dealing with enemies that take longer to kill (who accumulate more damage over time).

**What makes this tricky:** The optimal order isn't simply "kill highest damage first" or "kill weakest first." You need to consider both damage output _and_ time to kill (health/power). The key insight is that you should prioritize enemies with the highest **damage per unit of health** ratio, which mathematically minimizes total damage.

## Visual Walkthrough

Let's walk through a concrete example:

- `power = 3`
- `damage = [5, 1, 4]`
- `health = [4, 9, 3]`
- `n = 3` enemies

**Step 1: Calculate time to kill each enemy**
Time = ceil(health[i] / power)

- Enemy 0: ceil(4/3) = 2 seconds
- Enemy 1: ceil(9/3) = 3 seconds
- Enemy 2: ceil(3/3) = 1 second

**Step 2: Consider different kill orders**

_Option A: Kill in order [0, 1, 2] (by index)_

- Second 1: All 3 alive → damage = 5+1+4 = 10, kill enemy 0
- Second 2: Enemies 1,2 alive → damage = 1+4 = 5, kill enemy 1
- Second 3: Enemy 2 alive → damage = 4, kill enemy 2
- Total damage = 10 + 5 + 4 = 19

_Option B: Kill highest damage first [0, 2, 1]_

- Second 1: All alive → damage = 10, kill enemy 0 (highest damage)
- Second 2: Enemies 1,2 alive → damage = 1+4 = 5, kill enemy 2
- Second 3: Enemy 1 alive → damage = 1, kill enemy 1
- Total damage = 10 + 5 + 1 = 16 (better!)

_Option C: Sort by damage/health ratio_
Calculate ratio = damage[i] / health[i]:

- Enemy 0: 5/4 = 1.25
- Enemy 1: 1/9 ≈ 0.111
- Enemy 2: 4/3 ≈ 1.333

Sorted by ratio descending: [2, 0, 1] (enemy 2 has highest ratio)

- Second 1: All alive → damage = 10, kill enemy 2
- Second 2: Enemies 0,1 alive → damage = 5+1 = 6, kill enemy 0
- Second 3: Enemy 1 alive → damage = 1, kill enemy 1
- Total damage = 10 + 6 + 1 = 17

Wait, that's worse than option B! This shows ratio alone isn't perfect. We need a more rigorous approach.

## Brute Force Approach

The brute force solution would try all `n!` permutations of kill orders, calculate total damage for each, and return the minimum. For each permutation:

1. Initialize total damage = 0
2. For each enemy in the order:
   - Add damage from all alive enemies to total
   - Kill the current enemy (mark as dead)
3. Return the minimum total across all permutations

**Why this fails:** With `n` up to 10^5 in constraints, `n!` is astronomically large. Even for small `n=20`, 20! ≈ 2.4×10^18 permutations is completely infeasible. We need a mathematical insight to find the optimal order without brute force search.

## Optimized Approach

The key insight comes from analyzing how total damage accumulates. Let's formalize:

Let `t_i = ceil(health[i] / power)` be time to kill enemy `i`.
If we kill enemies in some order, enemy `i` contributes:

- Damage while it's alive: `damage[i] × (time until it's killed)`

If enemy `i` is killed at position `k` in the sequence (0-indexed), it's alive for the first `k+1` seconds (including the second when it's killed, since damage happens before killing).

So total damage = Σ(damage[i] × position_in_kill_order[i]) where position is 1-based.

But wait, that's not quite right because different enemies take different times to kill! Actually, if enemy `i` takes `t_i` seconds to kill, and we start killing it at time `start_i`, it contributes:

- `damage[i] × (start_i + t_i)` total damage

And `start_i` depends on the sum of kill times of all enemies killed before `i`.

This leads to the critical realization: **We should kill enemies in descending order of `damage[i] / t_i`** (damage per second of our time spent killing them).

**Proof sketch:** Consider two enemies A and B with damage `d_a`, `d_b` and kill times `t_a`, `t_b`. If we kill A then B:

- Damage from A: `d_a × t_a` (alive while we kill it)
- Damage from B: `d_b × (t_a + t_b)` (alive while we kill A and itself)
- Total: `d_a × t_a + d_b × (t_a + t_b) = d_a×t_a + d_b×t_a + d_b×t_b`

If we kill B then A:

- Total: `d_b×t_b + d_a×(t_b + t_a) = d_b×t_b + d_a×t_b + d_a×t_a`

Difference (A then B minus B then A):
`(d_a×t_a + d_b×t_a + d_b×t_b) - (d_b×t_b + d_a×t_b + d_a×t_a) = d_b×t_a - d_a×t_b`

We prefer order A then B if difference < 0:
`d_b×t_a - d_a×t_b < 0` → `d_b×t_a < d_a×t_b` → `d_a/t_a > d_b/t_b`

So A should come before B if `d_a/t_a > d_b/t_b`. This comparison holds for the entire sequence by the rearrangement inequality.

## Optimal Solution

We sort enemies by `damage[i] / t_i` descending, where `t_i = ceil(health[i] / power)`. Then we simulate the fight, accumulating total damage.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minDamage(power, damage, health):
    """
    Calculate minimum total damage Bob takes when fighting enemies in optimal order.

    Args:
        power: Damage Bob deals per second to an enemy
        damage: List of damage each enemy deals per second
        health: List of health points for each enemy

    Returns:
        Minimum total damage Bob will take
    """
    n = len(damage)

    # Step 1: Create list of enemies with their damage, health, and time to kill
    enemies = []
    for i in range(n):
        # Calculate time needed to kill this enemy (ceil division)
        # (health + power - 1) // power is equivalent to ceil(health / power)
        time_to_kill = (health[i] + power - 1) // power

        # Store enemy info as tuple (damage, time_to_kill)
        # We'll sort by damage/time_to_kill ratio descending
        enemies.append((damage[i], time_to_kill))

    # Step 2: Sort enemies by damage/time ratio in descending order
    # Using -damage/time for descending sort (higher ratio = kill sooner)
    # Actually, we need to sort by damage/time_to_kill descending
    # To avoid floating point issues, we compare cross-multiplied values:
    # a.damage/a.time > b.damage/b.time  <=>  a.damage * b.time > b.damage * a.time
    enemies.sort(key=lambda x: x[0] / x[1], reverse=True)

    # Step 3: Calculate total damage
    total_damage = 0
    current_time = 0  # Time spent killing enemies so far

    for dmg, time in enemies:
        # This enemy is alive while we kill all previous enemies AND while we kill it
        # So it deals damage for (current_time + time) seconds
        total_damage += dmg * (current_time + time)

        # Add the time spent killing this enemy to current_time
        # for the next enemies
        current_time += time

    return total_damage
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Calculate minimum total damage Bob takes when fighting enemies in optimal order.
 * @param {number} power - Damage Bob deals per second to an enemy
 * @param {number[]} damage - Array of damage each enemy deals per second
 * @param {number[]} health - Array of health points for each enemy
 * @return {number} Minimum total damage Bob will take
 */
function minDamage(power, damage, health) {
  const n = damage.length;

  // Step 1: Create array of enemies with their damage and time to kill
  const enemies = [];
  for (let i = 0; i < n; i++) {
    // Calculate time needed to kill this enemy (ceil division)
    // Math.ceil(health / power) without using floating point
    const timeToKill = Math.floor((health[i] + power - 1) / power);

    // Store enemy info as object
    enemies.push({
      damage: damage[i],
      time: timeToKill,
    });
  }

  // Step 2: Sort enemies by damage/time ratio in descending order
  // To avoid floating point precision issues, compare cross-multiplied values
  enemies.sort((a, b) => {
    // Compare b.damage/b.time with a.damage/a.time for descending order
    // Equivalent to: return (b.damage / b.time) - (a.damage / a.time)
    // But using cross multiplication to avoid floating point
    return b.damage * a.time - a.damage * b.time;
  });

  // Step 3: Calculate total damage
  let totalDamage = 0;
  let currentTime = 0; // Time spent killing enemies so far

  for (const enemy of enemies) {
    // This enemy deals damage while we kill all previous enemies AND itself
    totalDamage += enemy.damage * (currentTime + enemy.time);

    // Add time spent killing this enemy
    currentTime += enemy.time;
  }

  return totalDamage;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Calculate minimum total damage Bob takes when fighting enemies in optimal order.
     * @param power Damage Bob deals per second to an enemy
     * @param damage Array of damage each enemy deals per second
     * @param health Array of health points for each enemy
     * @return Minimum total damage Bob will take
     */
    public long minDamage(int power, int[] damage, int[] health) {
        int n = damage.length;

        // Step 1: Create list of enemies with damage and time to kill
        List<Enemy> enemies = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            // Calculate time to kill with ceil division
            // (health + power - 1) / power gives ceil(health / power)
            int timeToKill = (health[i] + power - 1) / power;
            enemies.add(new Enemy(damage[i], timeToKill));
        }

        // Step 2: Sort by damage/time ratio in descending order
        // Using custom comparator to avoid floating point issues
        enemies.sort((a, b) -> {
            // Compare b.damage/b.time with a.damage/a.time
            // Cross multiply to compare without floating point
            long left = (long) b.damage * a.time;
            long right = (long) a.damage * b.time;
            return Long.compare(left, right); // Descending order
        });

        // Step 3: Calculate total damage
        long totalDamage = 0;
        long currentTime = 0;  // Time spent killing enemies so far

        for (Enemy enemy : enemies) {
            // Enemy deals damage while we kill previous enemies AND itself
            totalDamage += (long) enemy.damage * (currentTime + enemy.time);

            // Add time spent killing this enemy
            currentTime += enemy.time;
        }

        return totalDamage;
    }

    // Helper class to store enemy information
    class Enemy {
        int damage;
        int time;

        Enemy(int damage, int time) {
            this.damage = damage;
            this.time = time;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Calculating time to kill for each enemy: O(n)
- Sorting enemies by damage/time ratio: O(n log n) with comparison sort
- Calculating total damage after sorting: O(n)
- Dominated by O(n log n) for sorting

**Space Complexity:** O(n)

- Storing list of enemies with their damage and time values: O(n)
- Sorting typically requires O(log n) to O(n) additional space depending on algorithm
- In Python/JavaScript, O(n) for the list/array
- In Java, O(n) for the ArrayList

## Common Mistakes

1. **Sorting by damage alone or health alone:** This fails because it doesn't consider the trade-off. High-damage enemies might take long to kill, making it better to kill medium-damage quick enemies first. Always consider the ratio.

2. **Floating point precision errors:** When comparing `damage[i]/time[i]`, using floating point division can cause incorrect comparisons due to precision limits. Instead, compare cross-multiplied values: `a.damage * b.time > b.damage * a.time`.

3. **Incorrect ceil division:** Using `health[i] / power` with integer division truncates instead of rounding up. Correct formula: `(health[i] + power - 1) / power` for positive integers.

4. **Forgetting damage accumulates during the kill:** Each enemy deals damage during the entire time it takes to kill it, not just before you start attacking it. That's why we add `currentTime + time` not just `currentTime`.

5. **Integer overflow:** Damage values and times can be large (up to 10^9), and their product can exceed 32-bit integer range. Use 64-bit integers (long in Java, normal int in Python handles big integers).

## When You'll See This Pattern

This "ratio-based greedy scheduling" pattern appears in optimization problems where you need to order tasks to minimize a cumulative cost function. The key insight is that comparing pairs of items reveals an optimal ordering criterion.

**Related problems:**

1. **Minimum Time to Complete Trips (Medium):** Similar ratio reasoning for scheduling buses to complete trips.
2. **Minimum Penalty for a Shop (Medium):** Finding optimal timing to minimize penalty, though simpler.
3. **Task Scheduler II (Medium):** Scheduling with cooldown periods.
4. **Maximum Performance of a Team (Hard):** Combining speed and efficiency with ratio-based selection.

The pattern: When you need to sequence items to minimize Σ(weight × completion_time) or similar, and swapping two adjacent items gives a simple comparison condition, you often get an optimal ordering by sorting by some ratio.

## Key Takeaways

1. **Ratio-based greedy ordering works for minimization problems** where cost accumulates over time. The optimal sequence often sorts by some "efficiency" ratio.

2. **Prove with adjacent swap argument:** To determine optimal ordering, consider swapping two adjacent items and see how it affects total cost. If the comparison yields a simple condition (like `a.damage/a.time > b.damage/b.time`), that's your sorting criterion.

3. **Watch for implementation pitfalls:** Use integer arithmetic to avoid floating point errors, handle ceil division correctly, and use appropriate data types to prevent overflow.

**Related problems:** [Minimum Time to Complete Trips](/problem/minimum-time-to-complete-trips), [Minimum Penalty for a Shop](/problem/minimum-penalty-for-a-shop)
