---
title: "How to Solve Determine if a Cell Is Reachable at a Given Time — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Determine if a Cell Is Reachable at a Given Time. Medium difficulty, 37.2% acceptance rate. Topics: Math."
date: "2027-04-11"
category: "dsa-patterns"
tags: ["determine-if-a-cell-is-reachable-at-a-given-time", "math", "medium"]
---

# How to Solve "Determine if a Cell Is Reachable at a Given Time"

This problem asks whether you can move from a starting cell `(sx, sy)` to a target cell `(fx, fy)` in **exactly** `t` seconds on an infinite 2D grid, moving to an adjacent cell each second. The tricky part is that you must arrive at the exact second `t`—not earlier—and you can waste time by moving around if needed.

## Visual Walkthrough

Let's trace through an example: `sx = 1, sy = 1, fx = 3, fy = 3, t = 4`.

The **minimum** time to reach the target is the **Chebyshev distance** (also called the chess king distance):  
`min_time = max(|fx - sx|, |fy - sy|) = max(|3-1|, |3-1|) = max(2, 2) = 2`.

This means you can reach the target in 2 seconds by moving diagonally twice. But we need exactly 4 seconds.

**Key insight**: After reaching the target, you can waste extra time by moving away and back. On a grid, the smallest waste is 2 seconds: move to a neighbor and return. So if you have extra time, it must be even to waste it properly.

Let's check:

- Minimum time = 2
- Extra time = 4 - 2 = 2 (even)
- You can: (1,1)→(2,2)→(3,3) in 2 seconds, then move to (3,2) and back to (3,3) in 2 more seconds. Total = 4 seconds.

Thus, the answer is `true`.

What if `t = 3`?

- Minimum time = 2
- Extra time = 3 - 2 = 1 (odd)
- You cannot waste 1 second because you must leave the target and can't return in 1 second (need at least 2). So answer is `false`.

**Edge case**: What if you start at the target? Then minimum time = 0. But if `t = 1`, you must leave and can't return in 1 second, so it's impossible unless `t = 0` or `t ≥ 2`.

## Brute Force Approach

A naive approach might try BFS/DFS exploring all paths of length `t`. However, the grid is infinite and `t` can be large (up to 10⁹ in constraints). BFS would explore up to 4ᵗ nodes—exponential and impossible.

Even dynamic programming on coordinates is infeasible because coordinates can be large. The brute force is computationally impossible, so we must find a mathematical solution.

## Optimized Approach

The optimal solution uses **distance analysis**:

1. **Calculate the minimum time** needed:  
   `min_time = max(|fx - sx|, |fy - sy|)`  
   This is because in each second you can move one step in x and/or y direction (like a chess king).

2. **Compare with `t`**:
   - If `t < min_time`: impossible → return `false`.
   - If `t == min_time`: possible → return `true`.
   - If `t > min_time`: we have extra time to waste.

3. **Handle extra time**:
   - If we're already at the target (`min_time == 0`):  
     We must leave and return. The smallest waste is 2 seconds (go to neighbor and back). So extra time must be even and ≥ 2, unless `t == 0`.
     - If `t == 0`: possible (already there).
     - If `t == 1`: impossible (can't return in 1 second).
     - If `t ≥ 2`: possible only if `t` is even? Wait—let's think carefully.

   Actually, if `min_time == 0` (start == target):
   - You need to leave and come back, which takes at least 2 seconds.
   - So `t` must be 0 or ≥ 2.
   - No parity requirement? Let's test: `t = 2` → leave to (sx+1, sy) and back: works. `t = 3` → leave to neighbor (1 sec), then you have 2 seconds left. From neighbor, you can return in 1 second (now at target with 1 second left), then leave again—but you'd end off-target. Actually, you can't waste odd extra time when starting at target because you must be at target at exactly `t`. Let's verify with example: start=(1,1), target=(1,1), t=3. At t=1: move to (2,1). t=2: move to (2,2). t=3: move to (1,2) → not at target. So t=3 fails. Similarly, any odd t fails when start==target. So extra time must be even when min_time=0.

   - If `min_time > 0`:  
     You can reach target in `min_time` seconds. Extra time = `t - min_time`.  
     You can waste extra time by moving away and back in 2-second cycles. So extra time must be even.  
     But wait—what if min_time is odd/even? Actually, parity doesn't matter because you can always waste 2 seconds from the target. So only requirement: extra time must be even.

4. **Simplify the rule**:
   - If `min_time > t`: return `false`.
   - If `min_time == 0`: return `t != 1` (since t=0 works, t=1 fails, t≥2 works if even? Actually t=2 works, t=3 fails, t=4 works... so t must be even or zero). Wait, t=0 is even. So condition: `t != 1`.
   - If `min_time > 0`: return `true` (because if extra time is odd, you can adjust your path to waste odd time? Let's check: example sx=1,sy=1, fx=2,fy=2, t=3. min_time=1 (diagonal move). Extra time=2 (even). Works. What if extra time odd? Example: same start/target, t=2. min_time=1, extra=1 (odd). Can we do it? Path: (1,1)→(2,1)→(2,2) takes 2 seconds. Yes! So odd extra time works when min_time>0. Why? Because you can approach the target in a way that wastes 1 extra second by not moving diagonally. So only constraint is t ≥ min_time.

   Actually, the **only special case** is when start == target and t=1. Otherwise, as long as t ≥ min_time, it's possible.

Let's verify with examples:

- Start != target, t = min_time + 1 (odd extra): always possible by taking a non-optimal first move.
- Start == target, t=1: impossible (need at least 2 to leave and return).
- Start == target, t=0: possible (already there).

So final condition:

1. Compute `min_time = max(|dx|, |dy|)` where `dx = fx - sx`, `dy = fy - sy`.
2. If `min_time == 0`: return `t != 1`.
3. Else: return `t >= min_time`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isReachableAtTime(sx: int, sy: int, fx: int, fy: int, t: int) -> bool:
    # Calculate the Chebyshev distance (minimum time required)
    dx = abs(fx - sx)
    dy = abs(fy - sy)
    min_time = max(dx, dy)

    # Special case: starting at the target
    if min_time == 0:
        # If t == 1, we cannot leave and return in time
        # t == 0 is fine (already there), t >= 2 is fine (leave and return)
        return t != 1

    # General case: we need at least min_time seconds
    return t >= min_time
```

```javascript
// Time: O(1) | Space: O(1)
function isReachableAtTime(sx, sy, fx, fy, t) {
  // Calculate the Chebyshev distance (minimum time required)
  const dx = Math.abs(fx - sx);
  const dy = Math.abs(fy - sy);
  const minTime = Math.max(dx, dy);

  // Special case: starting at the target
  if (minTime === 0) {
    // If t === 1, we cannot leave and return in time
    // t === 0 is fine (already there), t >= 2 is fine (leave and return)
    return t !== 1;
  }

  // General case: we need at least minTime seconds
  return t >= minTime;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public boolean isReachableAtTime(int sx, int sy, int fx, int fy, int t) {
        // Calculate the Chebyshev distance (minimum time required)
        int dx = Math.abs(fx - sx);
        int dy = Math.abs(fy - sy);
        int minTime = Math.max(dx, dy);

        // Special case: starting at the target
        if (minTime == 0) {
            // If t == 1, we cannot leave and return in time
            // t == 0 is fine (already there), t >= 2 is fine (leave and return)
            return t != 1;
        }

        // General case: we need at least minTime seconds
        return t >= minTime;
    }
}
```

</div>

## Complexity Analysis

- **Time complexity**: O(1) — only a few arithmetic operations and comparisons.
- **Space complexity**: O(1) — only a few integer variables.

The solution is optimal because we must at least compute the distance, which takes O(1) time.

## Common Mistakes

1. **Using Manhattan distance instead of Chebyshev distance**:  
   Candidates often calculate `|dx| + |dy|` as the minimum time. But you can move diagonally, so the correct minimum is `max(|dx|, |dy|)`.

2. **Missing the special case when start == target**:  
   Forgetting that when already at the target, `t=1` is impossible because you must move away and can't return in 1 second.

3. **Overcomplicating parity checks**:  
   Some candidates think extra time must always be even. This is only true when starting at the target with `t>0`. When start != target, odd extra time is fine because you can adjust your path.

4. **Not handling large values**:  
   Attempting BFS/DFS for large `t` will timeout. Recognize that mathematical reasoning is needed.

## When You'll See This Pattern

This problem uses **distance analysis on grids** and **parity reasoning**—common in problems involving movement on infinite grids:

1. **Reaching Points (Hard)**: Similar concept of moving toward a target with specific moves, requiring mathematical reduction.
2. **Minimum Time Visiting All Points (Easy)**: Uses the same Chebyshev distance to calculate minimum time between points.
3. **Robot Bounded In Circle (Medium)**: Uses modular arithmetic and state analysis to determine cycles.

These problems share the pattern of reducing movement to mathematical constraints rather than simulating steps.

## Key Takeaways

1. **Chebyshev distance is key for king/queen moves**: When you can move in 8 directions (including diagonals), the minimum distance is `max(|dx|, |dy|)`.
2. **Special cases matter**: Always check boundary conditions like start == target, t=0, t=1.
3. **Don't simulate when math suffices**: If constraints are large (like t up to 10⁹), look for a formula-based solution.

Related problems: [Reaching Points](/problem/reaching-points)
