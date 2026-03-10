---
title: "How to Solve Minimum Sideway Jumps — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Sideway Jumps. Medium difficulty, 51.5% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2028-05-12"
category: "dsa-patterns"
tags: ["minimum-sideway-jumps", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Minimum Sideway Jumps

This problem asks us to find the minimum number of sideways jumps a frog needs to reach the end of a 3-lane road while avoiding obstacles. The frog starts in lane 2 (middle lane) at position 0 and wants to reach position n. At each position, the frog can either move forward in its current lane (if no obstacle blocks it) or make a sideways jump to an adjacent lane (if that lane is clear at the current position). What makes this problem interesting is that it looks like a simple pathfinding problem, but it requires careful state tracking to avoid exponential exploration while ensuring we find the minimum jumps.

## Visual Walkthrough

Let's trace through a concrete example: `obstacles = [0,1,2,3,0]`

**Position 0:** Frog starts in lane 2 (middle). No obstacle here.

- Lane 1: Clear (obstacle[0] ≠ 1)
- Lane 2: Clear (obstacle[0] ≠ 2) ← Frog here
- Lane 3: Clear (obstacle[0] ≠ 3)

**Position 1:** Obstacle in lane 1 (obstacle[1] = 1)

- Lane 1: Blocked
- Lane 2: Clear
- Lane 3: Clear

The frog can move forward to position 1 in lane 2 (0 jumps so far).

**Position 2:** Obstacle in lane 2 (obstacle[2] = 2)

- Lane 1: Blocked (from position 1)
- Lane 2: Blocked
- Lane 3: Clear

The frog in lane 2 at position 1 encounters an obstacle at position 2. It must make a sideways jump before moving forward. It can only jump to lane 3 (since lane 1 is blocked at position 1). So: jump to lane 3 (1 jump total), then move forward to position 2 in lane 3.

**Position 3:** Obstacle in lane 3 (obstacle[3] = 3)

- Lane 1: Blocked
- Lane 2: Blocked
- Lane 3: Blocked

The frog in lane 3 at position 2 encounters an obstacle at position 3. It must jump sideways, but both adjacent lanes (1 and 2) are blocked at position 2. However, the frog can jump at position 2 itself! So: jump from lane 3 to lane 1 at position 2 (2 jumps total), then move forward to position 3 in lane 1.

**Position 4:** No obstacle (obstacle[4] = 0)

- All lanes clear

The frog moves forward from position 3 to position 4 in lane 1. Total jumps: 2.

This walkthrough reveals key insights: we need to track the frog's lane at each position, and sideways jumps can happen at the current position (not just when blocked ahead). We also see that sometimes we need to plan ahead to avoid getting trapped.

## Brute Force Approach

A naive approach would be to explore all possible sequences of moves using DFS/BFS:

- At each position, try moving forward if possible
- Try jumping to adjacent lanes if they're clear at the current position
- Continue until reaching position n
- Track the minimum jumps

The problem with this approach is the state space explosion. At each position, the frog has up to 3 choices (stay in current lane or jump to 2 adjacent lanes), leading to O(3^n) possibilities. For n up to 5×10^5, this is completely infeasible.

Even with memoization (position × lane), we'd have O(n×3) states, but the transitions need careful handling to avoid infinite loops (jumping back and forth between lanes). A candidate might try greedy jumping only when blocked, but as we saw in the example, sometimes you need to jump preemptively to avoid future traps.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem where we track the minimum jumps needed to reach each lane at each position. Let's define:

`dp[pos][lane]` = minimum jumps to reach position `pos` in `lane` (1, 2, or 3)

**Base case:** At position 0, the frog starts in lane 2 with 0 jumps: `dp[0][2] = 0`, `dp[0][1] = dp[0][3] = 1` (if we started with a jump to those lanes).

**Transitions:**

1. **Move forward:** If lane is clear at position `pos`, we can come from the same lane at position `pos-1`:  
   `dp[pos][lane] = min(dp[pos][lane], dp[pos-1][lane])`
2. **Sideways jump:** If lane is clear at position `pos`, we can come from an adjacent lane at the same position (jumping sideways):
   `dp[pos][lane] = min(dp[pos][lane], dp[pos][other_lane] + 1)`

However, there's a complication: these transitions are interdependent at the same position. If we process lanes in a fixed order, we might miss that jumping from lane 1 to lane 3 could go through lane 2 (two jumps). The clean solution is to:

1. First propagate forward moves from previous position
2. Then handle sideways jumps at current position, repeating until no improvements (like Bellman-Ford)

An even cleaner approach: since there are only 3 lanes, we can explicitly compute all possibilities. The optimal solution uses a **greedy-like DP** that updates lanes in a specific order to handle all jump possibilities in two passes.

## Optimal Solution

The most elegant solution uses just 3 variables (one per lane) instead of a full DP table, since we only need the previous position's values. We iterate through positions, and at each position:

1. If a lane has an obstacle at current position, set its jumps to infinity (unreachable)
2. First, try reaching each lane from the same lane at previous position (forward move)
3. Then, try reaching each lane from adjacent lanes at current position (sideways jump)

We need to handle the interdependence: lane 1 can jump to lane 2, which can then jump to lane 3 in the same position (two jumps). By updating lanes in the right order and doing multiple passes, we ensure all possibilities are considered.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minSideJumps(obstacles):
    """
    Calculate minimum sideways jumps to reach the end.

    Args:
        obstacles: List of length n+1 where obstacles[i] = lane with obstacle at position i
                   (0 means no obstacle)

    Returns:
        Minimum number of sideways jumps needed
    """
    n = len(obstacles) - 1  # Road length

    # dp[lane] = min jumps to reach current position in this lane
    # Lanes are 1-indexed, but we use 0,1,2 for array indexing
    dp = [float('inf')] * 3
    dp[1] = 0  # Start in middle lane (index 1 = lane 2)

    for pos in range(1, n + 1):
        # Step 1: Mark lanes with obstacles at current position as unreachable
        for lane in range(3):
            if obstacles[pos] == lane + 1:  # +1 because obstacles uses 1-indexed lanes
                dp[lane] = float('inf')

        # Step 2: Try reaching each lane from the same lane at previous position
        # (moving forward without jumping)
        for lane in range(3):
            if obstacles[pos] != lane + 1:  # If lane is clear at current position
                # We could have come from same lane at previous position
                # No additional jumps needed for forward movement
                pass  # This is already handled by carrying dp forward

        # Step 3: Handle sideways jumps at current position
        # We need to consider that jumping from lane 1 to lane 3 might go through lane 2
        # So we update multiple times to propagate jumps
        for _ in range(2):  # Two passes ensure all jump combinations are considered
            for lane in range(3):
                if obstacles[pos] != lane + 1:  # If lane is clear
                    # Try reaching from left adjacent lane
                    if lane > 0 and obstacles[pos] != lane:  # lane is 0-indexed, obstacles is 1-indexed
                        dp[lane] = min(dp[lane], dp[lane-1] + 1)
                    # Try reaching from right adjacent lane
                    if lane < 2 and obstacles[pos] != lane + 2:  # +2 because lane+1 would be next lane
                        dp[lane] = min(dp[lane], dp[lane+1] + 1)

    # The answer is the minimum jumps to reach position n in any lane
    return min(dp)
```

```javascript
// Time: O(n) | Space: O(1)
function minSideJumps(obstacles) {
  /**
   * Calculate minimum sideways jumps to reach the end.
   *
   * @param {number[]} obstacles - Array of length n+1 where obstacles[i] = lane with obstacle at position i
   *                               (0 means no obstacle)
   * @return {number} Minimum number of sideways jumps needed
   */
  const n = obstacles.length - 1; // Road length

  // dp[lane] = min jumps to reach current position in this lane
  // Lanes are 1-indexed in obstacles, but we use 0,1,2 for array indexing
  let dp = [Infinity, 0, Infinity]; // Start in middle lane (index 1 = lane 2)

  for (let pos = 1; pos <= n; pos++) {
    // Step 1: Mark lanes with obstacles at current position as unreachable
    for (let lane = 0; lane < 3; lane++) {
      if (obstacles[pos] === lane + 1) {
        // +1 because obstacles uses 1-indexed lanes
        dp[lane] = Infinity;
      }
    }

    // Step 2 & 3: Handle forward movement and sideways jumps
    // We need multiple passes to handle jump chains (lane 1 -> lane 2 -> lane 3)
    for (let pass = 0; pass < 2; pass++) {
      // Two passes ensure all jump combinations
      for (let lane = 0; lane < 3; lane++) {
        if (obstacles[pos] !== lane + 1) {
          // If lane is clear at current position
          // Try reaching from left adjacent lane (sideways jump)
          if (lane > 0 && obstacles[pos] !== lane) {
            // lane is 0-indexed
            dp[lane] = Math.min(dp[lane], dp[lane - 1] + 1);
          }
          // Try reaching from right adjacent lane (sideways jump)
          if (lane < 2 && obstacles[pos] !== lane + 2) {
            // +2 because lane+1 would be next lane
            dp[lane] = Math.min(dp[lane], dp[lane + 1] + 1);
          }
        }
      }
    }
  }

  // The answer is the minimum jumps to reach position n in any lane
  return Math.min(...dp);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minSideJumps(int[] obstacles) {
        /**
         * Calculate minimum sideways jumps to reach the end.
         *
         * @param obstacles Array of length n+1 where obstacles[i] = lane with obstacle at position i
         *                  (0 means no obstacle)
         * @return Minimum number of sideways jumps needed
         */
        int n = obstacles.length - 1;  // Road length

        // dp[lane] = min jumps to reach current position in this lane
        // Lanes are 1-indexed in obstacles, but we use 0,1,2 for array indexing
        int[] dp = new int[3];
        dp[0] = Integer.MAX_VALUE / 2;  // Avoid overflow when adding
        dp[1] = 0;  // Start in middle lane (index 1 = lane 2)
        dp[2] = Integer.MAX_VALUE / 2;

        for (int pos = 1; pos <= n; pos++) {
            // Step 1: Mark lanes with obstacles at current position as unreachable
            for (int lane = 0; lane < 3; lane++) {
                if (obstacles[pos] == lane + 1) {  // +1 because obstacles uses 1-indexed lanes
                    dp[lane] = Integer.MAX_VALUE / 2;
                }
            }

            // Step 2 & 3: Handle forward movement and sideways jumps
            // We need multiple passes to handle jump chains (lane 1 -> lane 2 -> lane 3)
            for (int pass = 0; pass < 2; pass++) {  // Two passes ensure all jump combinations
                for (int lane = 0; lane < 3; lane++) {
                    if (obstacles[pos] != lane + 1) {  // If lane is clear at current position
                        // Try reaching from left adjacent lane (sideways jump)
                        if (lane > 0 && obstacles[pos] != lane) {  // lane is 0-indexed
                            dp[lane] = Math.min(dp[lane], dp[lane - 1] + 1);
                        }
                        // Try reaching from right adjacent lane (sideways jump)
                        if (lane < 2 && obstacles[pos] != lane + 2) {  // +2 because lane+1 would be next lane
                            dp[lane] = Math.min(dp[lane], dp[lane + 1] + 1);
                        }
                    }
                }
            }
        }

        // The answer is the minimum jumps to reach position n in any lane
        return Math.min(dp[0], Math.min(dp[1], dp[2]));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through all n positions once
- At each position, we do constant work: updating 3 lanes, with 2 passes of 3 lanes each
- Total operations: n × 3 × 2 = O(6n) = O(n)

**Space Complexity:** O(1)

- We only store 3 integers for the DP state (previous position's minimum jumps per lane)
- No additional data structures scale with input size
- Even if we used a full DP table, we could optimize to O(1) by only keeping previous row

## Common Mistakes

1. **Not handling jump chains:** Candidates often update lanes in a single pass, missing that jumping from lane 1 to lane 3 might require going through lane 2 (two jumps). The two-pass approach ensures all such combinations are considered.

2. **Incorrect obstacle checking:** The obstacle array uses 1-indexed lanes (1,2,3), but array indices are 0-indexed. A common error is `if obstacles[pos] == lane` instead of `if obstacles[pos] == lane + 1`.

3. **Forgetting to mark obstructed lanes as unreachable:** At each position, if a lane has an obstacle, we must set its DP value to infinity (or a large number). Otherwise, the frog might "teleport" through obstacles via sideways jumps.

4. **Greedy jumping only when blocked:** Some candidates try to jump only when the next position in current lane is blocked. This fails in cases where you need to jump preemptively to avoid future traps (like in our example at position 2).

## When You'll See This Pattern

This problem combines **dynamic programming** with **state machine** concepts. Similar patterns appear in:

1. **Frog Jump (LeetCode 403):** Also involves a frog jumping with constraints, though more complex with variable jump distances. Both require tracking state (position and capability) and finding minimum/maximum paths.

2. **Minimum Path Sum (LeetCode 64):** Grid-based DP where you move right/down with costs. Like our problem, it's about finding minimum cost to reach a destination with movement constraints.

3. **Paint House (LeetCode 256):** Choosing colors for houses with adjacency constraints. Both problems have a small fixed number of choices (3 lanes/colors) at each step and use DP to find minimum cost.

The core pattern is: when you have a sequence of decisions with a small number of states at each step, and decisions depend on previous states, DP with O(n × states) complexity often works.

## Key Takeaways

1. **Small state space enables simple DP:** With only 3 lanes, we can use a minimal DP array instead of complex data structures. Always look for problems where the number of states is small and constant.

2. **Order of updates matters in DP:** When transitions depend on each other (like sideways jumps between lanes), you may need multiple passes or careful ordering to ensure all possibilities are considered.

3. **Space optimization is often possible:** If you only need the previous state to compute the current one, you can reduce O(n×states) space to O(states). This is a common DP optimization pattern.

Related problems: [Frog Jump](/problem/frog-jump)
