---
title: "How to Solve First Day Where You Have Been in All the Rooms — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode First Day Where You Have Been in All the Rooms. Medium difficulty, 40.4% acceptance rate. Topics: Array, Dynamic Programming."
date: "2030-02-19"
category: "dsa-patterns"
tags: ["first-day-where-you-have-been-in-all-the-rooms", "array", "dynamic-programming", "medium"]
---

# How to Solve "First Day Where You Have Been in All the Rooms"

This problem asks you to find the first day when you have visited all `n` rooms at least once, given a deterministic sequence of room visits based on a nextVisit array. The tricky part is that the sequence isn't simple—it has "teleportation" rules where you sometimes jump back to previously visited rooms, making the day count grow exponentially if simulated naively. The key insight is recognizing the recurrence relation between visits to consecutive rooms.

## Visual Walkthrough

Let's trace through a small example: `nextVisit = [0, 0]` with `n = 2` rooms.

**Day 0:** Start at room 0 (first visit to room 0).  
Counts: room0=1, room1=0

**Rule check:** Since this is an **odd** visit to room 0 (1st visit is odd), we use `nextVisit[0] = 0`.

**Day 1:** Go to room 0 (second visit to room 0).  
Counts: room0=2, room1=0

**Rule check:** Even visit to room 0 (2nd visit is even), so go to `(0 + 1) % 2 = 1`.

**Day 2:** Go to room 1 (first visit to room 1).  
Counts: room0=2, room1=1 → ALL ROOMS VISITED!

So the answer is day 2. Notice the pattern: reaching room `i` for the first time requires first reaching room `i-1`, then making enough visits to room `i-1` to get an even count so you can advance. Each "attempt" to advance might send you back, creating cycles.

## Brute Force Approach

A naive solution would simulate the process day by day:

1. Keep track of visit counts for each room
2. Each day, determine current room based on previous day's room and visit count parity
3. Increment visit count for the new room
4. Check if all rooms have been visited at least once
5. Return the day number when all rooms are first visited

The problem? With `n` up to 10^5 and the sequence potentially having exponential length, this simulation could take billions of operations. Even for moderate `n`, the day count grows as `O(2^n)` in worst case, making simulation completely infeasible.

## Optimized Approach

The key insight is that we can compute the days needed to reach each room **for the first time** using dynamic programming.

Let `dp[i]` = number of days needed to reach room `i` for the first time.

**Base case:** `dp[0] = 0` (we start at room 0 on day 0)

**Transition for `dp[i]` where `i > 0`:**

1. To reach room `i` for the first time, we must first reach room `i-1` for the first time: `dp[i-1]` days
2. Then we're at room `i-1` with an odd visit count (1st visit is odd)
3. The rules say we go to `nextVisit[i-1]` (some room ≤ i-1)
4. From there, we need to get back to room `i-1` again
5. The time to get from room `j` back to room `i-1` is exactly `dp[i-1] - dp[j]` days
6. Finally, we're at room `i-1` with an even visit count, so we advance to room `i`

Putting it together:

```
dp[i] = dp[i-1] + 1 + (dp[i-1] - dp[nextVisit[i-1]]) + 1
```

Where:

- First `dp[i-1]`: days to reach room `i-1` for first time
- `+ 1`: the day we move from room `i-1` to `nextVisit[i-1]`
- `(dp[i-1] - dp[nextVisit[i-1]])`: days to get back from `nextVisit[i-1]` to `i-1`
- Final `+ 1`: the day we move from room `i-1` to room `i`

Simplify to:

```
dp[i] = 2 * dp[i-1] - dp[nextVisit[i-1]] + 2
```

We compute this modulo `10^9 + 7` to prevent overflow.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def firstDayBeenInAllRooms(nextVisit):
    """
    Returns the first day when all rooms have been visited at least once.

    Args:
        nextVisit: List[int] where nextVisit[i] is the room to visit
                   when at room i with odd visit count

    Returns:
        int: First day (0-indexed) when all rooms visited
    """
    MOD = 10**9 + 7
    n = len(nextVisit)

    # dp[i] = days needed to first reach room i
    dp = [0] * n

    # Base case: we start at room 0 on day 0
    dp[0] = 0

    for i in range(1, n):
        # Recurrence relation derived from the process:
        # 1. First reach room i-1: dp[i-1] days
        # 2. Move to nextVisit[i-1]: +1 day
        # 3. Get back to room i-1: (dp[i-1] - dp[nextVisit[i-1]]) days
        # 4. Move to room i: +1 day
        # Simplified: 2*dp[i-1] - dp[nextVisit[i-1]] + 2
        dp[i] = (2 * dp[i-1] - dp[nextVisit[i-1]] + 2) % MOD

    # dp[n-1] gives days to first reach last room
    # But we need days to have visited ALL rooms
    # Once we reach room n-1, we have visited all rooms
    return dp[n-1] % MOD
```

```javascript
// Time: O(n) | Space: O(n)
function firstDayBeenInAllRooms(nextVisit) {
  /**
   * Returns the first day when all rooms have been visited at least once.
   *
   * @param {number[]} nextVisit - nextVisit[i] is the room to visit
   *                               when at room i with odd visit count
   * @return {number} First day (0-indexed) when all rooms visited
   */
  const MOD = 10 ** 9 + 7;
  const n = nextVisit.length;

  // dp[i] = days needed to first reach room i
  const dp = new Array(n).fill(0);

  // Base case: we start at room 0 on day 0
  dp[0] = 0;

  for (let i = 1; i < n; i++) {
    // Recurrence: dp[i] = 2*dp[i-1] - dp[nextVisit[i-1]] + 2
    // We add MOD before modulo to handle negative values
    dp[i] = (2 * dp[i - 1] - dp[nextVisit[i - 1]] + 2) % MOD;

    // Ensure non-negative result
    if (dp[i] < 0) {
      dp[i] += MOD;
    }
  }

  // Once we reach the last room, all rooms have been visited
  return dp[n - 1] % MOD;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int firstDayBeenInAllRooms(int[] nextVisit) {
        /**
         * Returns the first day when all rooms have been visited at least once.
         *
         * @param nextVisit nextVisit[i] is the room to visit
         *                  when at room i with odd visit count
         * @return First day (0-indexed) when all rooms visited
         */
        final int MOD = 1_000_000_007;
        int n = nextVisit.length;

        // dp[i] = days needed to first reach room i
        long[] dp = new long[n]; // Use long to avoid overflow before modulo

        // Base case: we start at room 0 on day 0
        dp[0] = 0;

        for (int i = 1; i < n; i++) {
            // Recurrence: dp[i] = 2*dp[i-1] - dp[nextVisit[i-1]] + 2
            // The formula counts all days needed to first reach room i
            dp[i] = (2 * dp[i-1] - dp[nextVisit[i-1]] + 2) % MOD;

            // Ensure non-negative result
            if (dp[i] < 0) {
                dp[i] += MOD;
            }
        }

        // Once we reach room n-1, all rooms have been visited
        return (int)(dp[n-1] % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations at each step
- The recurrence relation calculation uses only array lookups and arithmetic

**Space Complexity:** O(n)

- We store the dp array of size n
- Could be optimized to O(1) by only keeping the last dp value and the dp value for the nextVisit room, but this complicates the implementation since we need random access to dp[nextVisit[i-1]]

## Common Mistakes

1. **Simulating the process directly:** This is the most tempting mistake. Candidates try to simulate day by day, which works for tiny examples but fails for larger n due to exponential growth. Always check constraints before choosing an approach.

2. **Incorrect recurrence relation:** Some candidates derive `dp[i] = dp[i-1] + 1 + dp[i-1] + 1 = 2*dp[i-1] + 2`, forgetting the `- dp[nextVisit[i-1]]` term. This misses the fact that when sent back, you don't start from scratch—you benefit from already having visited intermediate rooms.

3. **Modulo arithmetic errors:** When subtracting modulo values, results can be negative. In Java/JavaScript, you need to add MOD before taking modulo to ensure non-negative results. Python's `%` operator handles negatives correctly.

4. **Off-by-one in interpretation:** The problem asks for the first day when ALL rooms have been visited. Some candidates return `dp[n-1] + 1` thinking they need to count the day of arrival. But `dp[i]` already counts all days up to and including arriving at room i, so `dp[n-1]` is correct.

## When You'll See This Pattern

This problem uses **state-based dynamic programming with recurrence relations**, similar to:

1. **Climbing Stairs (LeetCode 70):** Simple recurrence `dp[i] = dp[i-1] + dp[i-2]` for reaching step i. Both problems build solutions for state i from previous states.

2. **Jump Game II (LeetCode 45):** Finding minimum jumps to reach the end, where you compute the farthest reachable point from each position. Both involve advancing through an array with rules about movement.

3. **House Robber (LeetCode 198):** Making optimal decisions at each house based on previous states. The recurrence `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` has similar structure to our `dp[i] = 2*dp[i-1] - dp[nextVisit[i-1]] + 2`.

The pattern appears in problems where reaching state i requires first reaching some previous state, then performing some action that might reset progress partially.

## Key Takeaways

1. **When simulation is exponential, look for a recurrence relation.** If a process seems to involve repeated cycles or resets, there's often a mathematical pattern that lets you compute results directly.

2. **Define dp[i] as the answer to a subproblem.** Here, `dp[i] = days to first reach room i` creates a natural progression where each step builds on previous ones.

3. **Parity and state transitions often suggest DP.** When the next move depends on visit counts (even/odd) or other state information, dynamic programming can capture that state in the recurrence.

[Practice this problem on CodeJeet](/problem/first-day-where-you-have-been-in-all-the-rooms)
