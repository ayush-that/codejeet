---
title: "How to Solve Minimum Total Distance Traveled — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Total Distance Traveled. Hard difficulty, 58.8% acceptance rate. Topics: Array, Dynamic Programming, Sorting."
date: "2027-12-13"
category: "dsa-patterns"
tags: ["minimum-total-distance-traveled", "array", "dynamic-programming", "sorting", "hard"]
---

# How to Solve Minimum Total Distance Traveled

This problem asks us to assign robots to factories to minimize the total travel distance, where each factory has a limit on how many robots it can repair. The challenge comes from balancing two competing constraints: robots want to go to the nearest factory, but factories have capacity limits that force some robots to travel further. This is essentially a **minimum-cost assignment problem with capacity constraints** on a line, which makes it perfect for dynamic programming.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- Robots: `[1, 2, 3]`
- Factories: `[[2, 2], [4, 1]]` (position, limit)

**Step 1: Sort everything**
First, we sort both robots and factories by their positions:

- Robots: `[1, 2, 3]` (already sorted)
- Factories: `[[2, 2], [4, 1]]` (already sorted by position)

**Step 2: Consider assignments**
Factory at position 2 can take 2 robots, factory at position 4 can take 1 robot.

**Option A:** Assign robots 1 and 2 to factory 2, robot 3 to factory 4

- Distance = |1-2| + |2-2| + |3-4| = 1 + 0 + 1 = 2

**Option B:** Assign robot 1 to factory 2, robots 2 and 3 to factory 4

- But factory 4 only has limit 1, so this is invalid!

**Option C:** Assign robots 1, 2, and 3 all to factory 2

- But factory 2 has limit 2, so this is invalid!

**Option D:** Assign robot 1 to factory 2, robot 2 to factory 2, robot 3 to factory 4

- This is actually the same as Option A (the only valid assignment)

**Best total distance: 2**

The key insight: Once sorted, we should assign robots to factories in order. If robot i goes to factory j, then all robots before i should go to factories before or at j. This monotonic property enables dynamic programming.

## Brute Force Approach

A naive approach would try all possible assignments of robots to factories while respecting capacity limits. For each robot, we could try assigning it to any factory that still has capacity. This leads to exponential time complexity because for n robots and m factories, we have roughly O(m^n) possibilities.

Even with pruning (skipping factories that are full), this is far too slow for the constraints (up to 100 robots and factories). The brute force fails because it doesn't leverage the optimal substructure: the optimal assignment for the first i robots using the first j factories can be built from smaller optimal solutions.

## Optimized Approach

The key insight is that **once we sort robots and factories by position, the optimal assignment will pair them in order without crossing**. This is similar to the "no crossing" property in many matching problems on a line.

**Why sorting works:** If robot A is left of robot B, and factory X is left of factory Y, then in an optimal solution, robot A won't be assigned to factory Y while robot B is assigned to factory X. The crossing would create unnecessary extra distance that could be reduced by swapping assignments.

**DP State Definition:**
Let `dp[i][j]` = minimum total distance to assign the first i robots (0-indexed) using the first j factories.

**Transition:**
For each factory j, we can assign k robots to it (0 ≤ k ≤ min(limit[j], i)):

- If we assign k robots from the end of our i robots to factory j
- Then we need to assign the remaining i-k robots using the first j-1 factories
- The cost for these k robots is the sum of distances from robots i-k+1 to i to factory j

But calculating this sum for each k would be O(n) per state, making the overall complexity O(n³). We can optimize this using prefix sums!

**Optimization with Prefix Sums:**
Let `prefix[i]` = sum of robot positions from 0 to i-1.
Then sum of distances from robots l to r to factory at position f =

- If f ≥ robot[r]: `f*(r-l+1) - (prefix[r+1] - prefix[l])`
- If f ≤ robot[l]: `(prefix[r+1] - prefix[l]) - f*(r-l+1)`

This gives us O(1) distance calculation for any contiguous segment of robots to a factory.

**Final DP Transition:**
`dp[i][j] = min(dp[i-k][j-1] + cost(i-k, i-1, factory[j]))` for all valid k
Where `cost(l, r, factory)` calculates the total distance for robots l to r to go to that factory.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * m * L) where n = robots, m = factories, L = max factory limit
# Space: O(n * m)
def minimumTotalDistance(robot, factory):
    # Sort both arrays by position
    robot.sort()
    factory.sort()

    n, m = len(robot), len(factory)

    # Create prefix sums for robots to calculate distances in O(1)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + robot[i]

    # DP table: dp[i][j] = min distance for first i robots using first j factories
    # Initialize with infinity
    dp = [[float('inf')] * (m + 1) for _ in range(n + 1)]

    # Base case: 0 robots require 0 distance regardless of factories
    for j in range(m + 1):
        dp[0][j] = 0

    # Fill DP table
    for j in range(1, m + 1):
        fac_pos, fac_limit = factory[j - 1]

        for i in range(1, n + 1):
            # Option 1: Don't use factory j for any robots
            dp[i][j] = dp[i][j - 1]

            # Option 2: Use factory j for k robots (1 ≤ k ≤ min(fac_limit, i))
            total_dist = 0
            for k in range(1, min(fac_limit, i) + 1):
                # Robot index: i-k is the (i-k)th robot (0-indexed in robot array)
                robot_idx = i - k
                # Add distance for this robot to factory j
                total_dist += abs(robot[robot_idx] - fac_pos)

                # Update dp[i][j] if using k robots for factory j is better
                dp[i][j] = min(dp[i][j], dp[i - k][j - 1] + total_dist)

    return dp[n][m]
```

```javascript
// Time: O(n * m * L) where n = robots, m = factories, L = max factory limit
// Space: O(n * m)
function minimumTotalDistance(robot, factory) {
  // Sort both arrays by position
  robot.sort((a, b) => a - b);
  factory.sort((a, b) => a[0] - b[0]);

  const n = robot.length,
    m = factory.length;

  // Create prefix sums for robots to calculate distances in O(1)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + robot[i];
  }

  // DP table: dp[i][j] = min distance for first i robots using first j factories
  // Initialize with infinity
  const dp = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(m + 1).fill(Infinity);
  }

  // Base case: 0 robots require 0 distance regardless of factories
  for (let j = 0; j <= m; j++) {
    dp[0][j] = 0;
  }

  // Fill DP table
  for (let j = 1; j <= m; j++) {
    const [facPos, facLimit] = factory[j - 1];

    for (let i = 1; i <= n; i++) {
      // Option 1: Don't use factory j for any robots
      dp[i][j] = dp[i][j - 1];

      // Option 2: Use factory j for k robots (1 ≤ k ≤ min(facLimit, i))
      let totalDist = 0;
      for (let k = 1; k <= Math.min(facLimit, i); k++) {
        // Robot index: i-k is the (i-k)th robot (0-indexed in robot array)
        const robotIdx = i - k;
        // Add distance for this robot to factory j
        totalDist += Math.abs(robot[robotIdx] - facPos);

        // Update dp[i][j] if using k robots for factory j is better
        dp[i][j] = Math.min(dp[i][j], dp[i - k][j - 1] + totalDist);
      }
    }
  }

  return dp[n][m];
}
```

```java
// Time: O(n * m * L) where n = robots, m = factories, L = max factory limit
// Space: O(n * m)
public long minimumTotalDistance(List<Integer> robot, int[][] factory) {
    // Sort both arrays by position
    Collections.sort(robot);
    Arrays.sort(factory, (a, b) -> Integer.compare(a[0], b[0]));

    int n = robot.size(), m = factory.length;

    // Create prefix sums for robots to calculate distances efficiently
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + robot.get(i);
    }

    // DP table: dp[i][j] = min distance for first i robots using first j factories
    // Initialize with infinity
    long[][] dp = new long[n + 1][m + 1];
    for (int i = 0; i <= n; i++) {
        Arrays.fill(dp[i], Long.MAX_VALUE / 2); // Avoid overflow
    }

    // Base case: 0 robots require 0 distance regardless of factories
    for (int j = 0; j <= m; j++) {
        dp[0][j] = 0;
    }

    // Fill DP table
    for (int j = 1; j <= m; j++) {
        int facPos = factory[j - 1][0];
        int facLimit = factory[j - 1][1];

        for (int i = 1; i <= n; i++) {
            // Option 1: Don't use factory j for any robots
            dp[i][j] = dp[i][j - 1];

            // Option 2: Use factory j for k robots (1 ≤ k ≤ min(facLimit, i))
            long totalDist = 0;
            for (int k = 1; k <= Math.min(facLimit, i); k++) {
                // Robot index: i-k is the (i-k)th robot (0-indexed in robot list)
                int robotIdx = i - k;
                // Add distance for this robot to factory j
                totalDist += Math.abs(robot.get(robotIdx) - facPos);

                // Update dp[i][j] if using k robots for factory j is better
                dp[i][j] = Math.min(dp[i][j], dp[i - k][j - 1] + totalDist);
            }
        }
    }

    return dp[n][m];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m × L) where:

- n = number of robots
- m = number of factories
- L = maximum factory limit

We have n × m states in our DP table. For each state `dp[i][j]`, we consider up to `min(limit[j], i)` possibilities (how many robots to assign to factory j). In the worst case, this is O(L) operations per state.

**Space Complexity:** O(n × m) for the DP table. We could optimize to O(n) by only keeping the previous row, but the code is clearer with the full table.

**Why this is efficient enough:** With constraints up to n = 100, m = 100, and L = 100, we have at most 100 × 100 × 100 = 1,000,000 operations, which is acceptable.

## Common Mistakes

1. **Not sorting robots and factories first:** This breaks the "no crossing" property that makes DP work. Without sorting, you'd need to consider all permutations, making the problem exponentially harder.

2. **Incorrect DP state definition:** A common mistake is defining `dp[i]` as minimum distance for first i robots without tracking which factories were used. This doesn't work because factories have capacity limits that span multiple robots.

3. **Off-by-one errors in indices:** The transition `dp[i][j] = min(dp[i-k][j-1] + ...)` requires careful handling of 0-based vs 1-based indexing. Always test with small examples to catch these.

4. **Forgetting that factories can be unused:** The solution must include the case where a factory takes 0 robots (handled by `dp[i][j] = dp[i][j-1]`).

5. **Integer overflow:** The total distance can be large (up to 10^9 × 100 = 10^11), so use 64-bit integers (long in Java/JavaScript, regular int in Python handles big integers automatically).

## When You'll See This Pattern

This type of **ordered assignment DP** appears in many problems where you need to match items in sequence with capacity constraints:

1. **Capacity To Ship Packages Within D Days (Medium):** Similar structure of partitioning an array into contiguous segments with capacity constraints, though usually solved with binary search.

2. **Number of Ways to Earn Points (Hard):** Another DP problem with capacity-like constraints, though with different transition structure.

3. **Minimum Cost to Hire K Workers (Hard):** Involves sorting and then selecting items with constraints.

4. **Paint House II (Hard):** Assignment problem with constraints on adjacent elements.

The core pattern: **Sort → Define DP state based on prefixes → Transition by considering how many items to assign to the current group/resource.**

## Key Takeaways

1. **Sorting enables DP:** When items are on a line and you need to assign/matching them, sorting first often creates the optimal substructure needed for dynamic programming.

2. **Prefix sums for distance calculation:** When dealing with sums of absolute differences on a sorted array, prefix sums let you compute these in O(1) instead of O(n).

3. **DP with capacity constraints:** When resources have limits, your DP state often needs to track both "how many items processed" and "how many resources used," with transitions that consider all valid allocations to the current resource.

4. **Think in terms of prefixes:** The optimal solution for the first i items using the first j resources can be built from optimal solutions of smaller prefixes.

**Related problems:** [Capacity To Ship Packages Within D Days](/problem/capacity-to-ship-packages-within-d-days), [Number of Ways to Earn Points](/problem/number-of-ways-to-earn-points)
