---
title: "How to Solve Minimum Time to Break Locks I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time to Break Locks I. Medium difficulty, 32.1% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Depth-First Search."
date: "2026-02-24"
category: "dsa-patterns"
tags: ["minimum-time-to-break-locks-i", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Minimum Time to Break Locks I

Bob is trapped in a dungeon with `n` locks, each requiring a specific amount of energy to break. The twist? Bob's sword gains energy from breaking locks, but the energy gain depends on the order he breaks them. This creates an optimization problem where the sequence matters—making it a classic **permutation with state** problem that's trickier than it first appears.

## Visual Walkthrough

Let's trace through a small example: `strength = [2, 3, 4]` with initial energy = 1.

**Key rules to remember:**

1. To break lock `i`, Bob needs `strength[i]` energy
2. After breaking a lock, Bob gains energy equal to the lock's strength
3. Bob can break locks in any order

**Step-by-step analysis:**

If Bob breaks locks in order [0, 1, 2]:

- Start: energy = 1
- Lock 0 (needs 2): Can't break! Needs 2 but only has 1 ❌

If Bob breaks locks in order [2, 1, 0]:

- Start: energy = 1
- Lock 2 (needs 4): Can't break! Needs 4 but only has 1 ❌

If Bob breaks locks in order [1, 0, 2]:

- Start: energy = 1
- Lock 1 (needs 3): Can't break! Needs 3 but only has 1 ❌

Wait—none of these work with initial energy 1. Let's try a different example where it's possible: `strength = [1, 2, 3]` with initial energy = 1.

Order [0, 1, 2]:

- Start: energy = 1
- Lock 0 (needs 1): Breaks it ✓ Energy becomes 1 + 1 = 2
- Lock 1 (needs 2): Breaks it ✓ Energy becomes 2 + 2 = 4
- Lock 2 (needs 3): Breaks it ✓ Energy becomes 4 + 3 = 7
  Total time = 3 breaks

But is this optimal? What if we try [0, 2, 1]:

- Start: energy = 1
- Lock 0 (needs 1): Breaks it ✓ Energy = 2
- Lock 2 (needs 3): Can't break! Needs 3 but has 2 ❌

The challenge is clear: we need to find an ordering where at each step, Bob's current energy ≥ the lock's strength requirement. This is essentially finding a valid topological sort where "energy" is the constraint.

## Brute Force Approach

The brute force solution tries all possible permutations of the locks. For each permutation, we simulate breaking locks in that order, checking if Bob has enough energy at each step. If a permutation works, we count how many locks were broken (which equals the number of steps, since each break takes 1 unit of time).

**Why this is insufficient:**

- With `n` locks, there are `n!` permutations
- For `n = 20`, that's 2.4 × 10¹⁸ permutations—completely infeasible
- Even for moderate `n` like 15, it's over 1.3 trillion permutations

The brute force approach has exponential time complexity O(n! × n), which only works for tiny inputs (n ≤ 10). We need a smarter approach that doesn't explore every permutation.

## Optimized Approach

The key insight is that **we don't need to track the exact sequence**—we only need to know which locks have been broken and Bob's current energy. This transforms the problem into a **state-based search**:

**State representation:**

- `mask`: A bitmask where bit `i` is 1 if lock `i` is already broken
- `energy`: Bob's current energy level

**Transition:**
From state `(mask, energy)`, we can break any unbroken lock `i` if `energy ≥ strength[i]`. The new state becomes:

- `mask | (1 << i)` (mark lock `i` as broken)
- `energy + strength[i]` (gain energy from breaking the lock)

**Goal:**
Find the minimum number of steps to reach state where all bits in mask are 1 (all locks broken).

**Why this works:**

1. The state space is manageable: 2ⁿ × (max energy) states
2. We can use BFS to find the shortest path (minimum time)
3. Each state transition corresponds to breaking one lock

**Optimization:**
Since energy increases monotonically (we only add strength, never subtract), we can use dynamic programming with memoization. For each mask, we store the maximum energy achievable when reaching that set of broken locks. If we reach the same mask with higher energy, we have a better path.

## Optimal Solution

We'll use a BFS approach with pruning. The queue stores `(mask, energy, steps)` tuples. We keep track of the maximum energy achieved for each mask to avoid revisiting states with less energy.

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(2^n)
def minTimeToBreakLocks(strength, initialEnergy):
    """
    Calculate minimum time to break all locks.

    Args:
        strength: List of integers representing energy needed for each lock
        initialEnergy: Bob's starting energy

    Returns:
        Minimum number of steps to break all locks, or -1 if impossible
    """
    n = len(strength)
    # If there are no locks, we're done in 0 time
    if n == 0:
        return 0

    # max_energy[mask] stores the maximum energy achievable when
    # the set of broken locks is represented by 'mask'
    max_energy = [-1] * (1 << n)

    # BFS queue: each element is (mask, energy, steps)
    from collections import deque
    queue = deque()

    # Start with no locks broken and initial energy
    start_mask = 0
    queue.append((start_mask, initialEnergy, 0))
    max_energy[start_mask] = initialEnergy

    while queue:
        mask, energy, steps = queue.popleft()

        # If all locks are broken, return the number of steps
        if mask == (1 << n) - 1:
            return steps

        # Try breaking each unbroken lock
        for i in range(n):
            # Check if lock i is already broken
            if mask & (1 << i):
                continue

            # Check if we have enough energy to break this lock
            if energy >= strength[i]:
                new_mask = mask | (1 << i)
                new_energy = energy + strength[i]
                new_steps = steps + 1

                # Only proceed if this path gives us more energy
                # for the same set of broken locks
                if new_energy > max_energy[new_mask]:
                    max_energy[new_mask] = new_energy
                    queue.append((new_mask, new_energy, new_steps))

    # If we exhaust the queue without breaking all locks, it's impossible
    return -1
```

```javascript
// Time: O(n * 2^n) | Space: O(2^n)
function minTimeToBreakLocks(strength, initialEnergy) {
  /**
   * Calculate minimum time to break all locks.
   *
   * @param {number[]} strength - Energy needed for each lock
   * @param {number} initialEnergy - Bob's starting energy
   * @return {number} Minimum steps or -1 if impossible
   */
  const n = strength.length;

  // If there are no locks, we're done in 0 time
  if (n === 0) {
    return 0;
  }

  // maxEnergy[mask] stores maximum energy for each set of broken locks
  const maxEnergy = new Array(1 << n).fill(-1);

  // BFS queue: each element is [mask, energy, steps]
  const queue = [];

  // Start with no locks broken and initial energy
  const startMask = 0;
  queue.push([startMask, initialEnergy, 0]);
  maxEnergy[startMask] = initialEnergy;

  while (queue.length > 0) {
    const [mask, energy, steps] = queue.shift();

    // If all locks are broken, return the number of steps
    if (mask === (1 << n) - 1) {
      return steps;
    }

    // Try breaking each unbroken lock
    for (let i = 0; i < n; i++) {
      // Check if lock i is already broken
      if (mask & (1 << i)) {
        continue;
      }

      // Check if we have enough energy to break this lock
      if (energy >= strength[i]) {
        const newMask = mask | (1 << i);
        const newEnergy = energy + strength[i];
        const newSteps = steps + 1;

        // Only proceed if this path gives us more energy
        // for the same set of broken locks
        if (newEnergy > maxEnergy[newMask]) {
          maxEnergy[newMask] = newEnergy;
          queue.push([newMask, newEnergy, newSteps]);
        }
      }
    }
  }

  // If we exhaust the queue without breaking all locks, it's impossible
  return -1;
}
```

```java
// Time: O(n * 2^n) | Space: O(2^n)
import java.util.*;

public class Solution {
    public int minTimeToBreakLocks(int[] strength, int initialEnergy) {
        /**
         * Calculate minimum time to break all locks.
         *
         * @param strength Energy needed for each lock
         * @param initialEnergy Bob's starting energy
         * @return Minimum steps or -1 if impossible
         */
        int n = strength.length;

        // If there are no locks, we're done in 0 time
        if (n == 0) {
            return 0;
        }

        // maxEnergy[mask] stores maximum energy for each set of broken locks
        int[] maxEnergy = new int[1 << n];
        Arrays.fill(maxEnergy, -1);

        // BFS queue: each element is {mask, energy, steps}
        Queue<int[]> queue = new LinkedList<>();

        // Start with no locks broken and initial energy
        int startMask = 0;
        queue.offer(new int[]{startMask, initialEnergy, 0});
        maxEnergy[startMask] = initialEnergy;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int mask = current[0];
            int energy = current[1];
            int steps = current[2];

            // If all locks are broken, return the number of steps
            if (mask == (1 << n) - 1) {
                return steps;
            }

            // Try breaking each unbroken lock
            for (int i = 0; i < n; i++) {
                // Check if lock i is already broken
                if ((mask & (1 << i)) != 0) {
                    continue;
                }

                // Check if we have enough energy to break this lock
                if (energy >= strength[i]) {
                    int newMask = mask | (1 << i);
                    int newEnergy = energy + strength[i];
                    int newSteps = steps + 1;

                    // Only proceed if this path gives us more energy
                    // for the same set of broken locks
                    if (newEnergy > maxEnergy[newMask]) {
                        maxEnergy[newMask] = newEnergy;
                        queue.offer(new int[]{newMask, newEnergy, newSteps});
                    }
                }
            }
        }

        // If we exhaust the queue without breaking all locks, it's impossible
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × 2ⁿ)**

- There are 2ⁿ possible states (each lock can be broken or not)
- For each state, we try up to `n` possible next moves (which lock to break next)
- The pruning ensures we don't revisit states with less energy, keeping the complexity tight

**Space Complexity: O(2ⁿ)**

- We store the maximum energy for each of the 2ⁿ states
- The BFS queue can also hold up to O(2ⁿ) elements in the worst case
- This is exponential but manageable for n ≤ 20 (about 1 million states)

**Why this is acceptable:**

- For n = 20, 2²⁰ ≈ 1 million states, which is feasible
- The problem constraints typically limit n to around 15-20
- This is much better than the O(n!) brute force approach

## Common Mistakes

1. **Not pruning by maximum energy**: Without tracking the maximum energy for each mask, you might revisit the same set of broken locks with less energy, causing exponential blowup. Always store and compare energy levels.

2. **Using DFS instead of BFS**: DFS doesn't guarantee the shortest path. Since we want minimum time (steps), BFS is essential because it explores all states reachable in k steps before moving to k+1 steps.

3. **Forgetting the -1 case**: Not all inputs have a solution. If Bob starts with too little energy and can't break any lock, or if there's no valid ordering, return -1.

4. **Incorrect bitmask operations**: Common errors include:
   - Using `1 << i` without checking bounds (i < 32 for integers)
   - Confusing bitwise OR (`|`) with logical OR (`||`)
   - Not using parentheses around bit operations due to operator precedence

## When You'll See This Pattern

This **bitmask DP with BFS** pattern appears in several optimization problems:

1. **Shortest Path Visiting All Nodes (LeetCode 847)**: Similar state representation (which nodes visited), but with graph edges instead of energy constraints.

2. **Minimum Cost to Visit Every Node (LeetCode 943)**: Finding the shortest path that visits all nodes in a graph, often solved with DP over subsets.

3. **Maximum Product of Word Lengths (LeetCode 318)**: Uses bitmasks to represent character sets, though without the BFS component.

The core pattern is: when you need to track a subset of items and find an optimal sequence, bitmask DP is often the solution. Add BFS when you need the shortest sequence.

## Key Takeaways

1. **Bitmask for subset tracking**: When you need to represent "which items have been processed" efficiently, use bitmasks. Each bit represents one item (1 = processed, 0 = not processed).

2. **BFS for shortest sequence**: When each step has equal cost (like breaking one lock), BFS finds the minimum number of steps. Combine with DP memoization to prune redundant states.

3. **State = (subset, additional_info)**: Many optimization problems can be framed as searching through states. The state often includes both the subset of processed items and some additional information (like current energy).

Remember: the hardest part is recognizing when a problem fits this pattern. Look for keywords like "minimum steps to complete all tasks", "any order", and "state depends on what you've done so far".

[Practice this problem on CodeJeet](/problem/minimum-time-to-break-locks-i)
