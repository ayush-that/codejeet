---
title: "How to Solve Frog Jump — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Frog Jump. Hard difficulty, 47.1% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-11-08"
category: "dsa-patterns"
tags: ["frog-jump", "array", "dynamic-programming", "hard"]
---

# How to Solve Frog Jump

This problem asks whether a frog can cross a river by jumping from stone to stone. The frog starts at position 0 and can make its first jump of 1 unit. On each subsequent jump, the frog can jump `k-1`, `k`, or `k+1` units where `k` is the length of its previous jump. The stones are given in sorted order, and the frog can only land on stones, not in water. What makes this problem tricky is that the frog's jump distance depends on its previous jump, creating a state with two variables: current position and previous jump distance.

## Visual Walkthrough

Let's trace through a concrete example: `stones = [0,1,3,5,6,8,12,17]`

1. **Start**: Frog at position 0 with previous jump = 0 (special case for first jump)
   - From position 0, frog can only jump 1 unit (k+1 where k=0)
   - Land on stone at position 1 ✅

2. **Position 1, previous jump = 1**
   - Possible next jumps: 0, 1, or 2 units (k-1, k, k+1 where k=1)
   - Jump 0 units: stays at position 1 (not useful)
   - Jump 1 unit: lands at position 2 (no stone) ❌
   - Jump 2 units: lands at position 3 (stone exists) ✅

3. **Position 3, previous jump = 2**
   - Possible jumps: 1, 2, or 3 units
   - Jump 1 unit: position 4 (no stone) ❌
   - Jump 2 units: position 5 (stone exists) ✅
   - Jump 3 units: position 6 (stone exists) ✅

4. **Decision point**: From position 3, we have two valid moves. This creates branching paths. Let's follow position 5 first:
   - **Position 5, previous jump = 2**
     - Possible jumps: 1, 2, or 3 units
     - Jump 1 unit: position 6 (stone exists) ✅
     - Jump 2 units: position 7 (no stone) ❌
     - Jump 3 units: position 8 (stone exists) ✅

5. **Position 6, previous jump = 1** (from position 5)
   - Possible jumps: 0, 1, or 2 units
   - Jump 0 units: stays at 6
   - Jump 1 unit: position 7 (no stone) ❌
   - Jump 2 units: position 8 (stone exists) ✅

We can see the branching nature. The key insight is we need to track for each stone, what jump distances could have been used to reach it. For example, stone 8 could be reached with jump distance 3 (from position 5) or jump distance 2 (from position 6).

## Brute Force Approach

A naive brute force would explore all possible paths using DFS/backtracking. At each stone, we'd try all possible next jumps (k-1, k, k+1) and recursively explore each path.

**Why this fails**: The problem has exponential time complexity. In the worst case, with `n` stones, we could explore 3^n paths (three choices at each step). With constraints up to 2000 stones, this is computationally impossible.

Even with memoization on `(position, jump_distance)`, we'd still need to handle the state space properly. The brute force approach helps us understand the problem structure but isn't practical for the full constraints.

## Optimized Approach

The key insight is that we need to track **for each stone, what jump distances could have been used to reach it**. This transforms the problem into a reachability problem.

**Step-by-step reasoning**:

1. **State representation**: For each stone position, maintain a set of jump distances that can reach it.
2. **Transition**: From stone `i` with jump distance `k`, we can reach stones at positions `stones[i] + k-1`, `stones[i] + k`, and `stones[i] + k+1`.
3. **Efficient lookup**: Since stones are sorted, we can use binary search or a hash map to quickly check if a target position exists.
4. **Dynamic programming**: Build reachability incrementally. Start with stone 0 (position 0) with jump distance 0.

**Why this works**: Instead of exploring all paths, we're computing reachable states. If the last stone has any reachable jump distances, the frog can cross.

**Optimization details**:

- Use a dictionary mapping stone positions to their indices for O(1) lookups
- For each stone, store the set of jump distances that can reach it
- Only process stones that are actually reachable
- Stop early if we reach the last stone

## Optimal Solution

We'll implement a BFS-like approach using dynamic programming with memoization. The solution uses a hash map to track for each stone index, what jump distances can reach it.

<div class="code-group">

```python
# Time: O(n²) in worst case, but typically much better due to pruning
# Space: O(n²) for storing jump sets for each stone
def canCross(stones):
    """
    Determine if frog can cross river by jumping between stones.

    Args:
        stones: List of stone positions in ascending order

    Returns:
        bool: True if frog can reach last stone, False otherwise
    """
    # Create a dictionary for O(1) stone position lookups
    # Key: stone position, Value: index in stones array
    stone_positions = {pos: i for i, pos in enumerate(stones)}

    # Special case: first jump must be 1 unit
    # If second stone is not at position 1, impossible from the start
    if stones[1] != 1:
        return False

    # dp[i] will store set of jump distances that can reach stone i
    dp = [set() for _ in range(len(stones))]
    dp[0].add(0)  # Start at position 0 with jump distance 0

    # Process each stone
    for i in range(len(stones)):
        # For each jump distance that can reach current stone
        for k in dp[i]:
            # Try next jumps: k-1, k, k+1
            for next_jump in (k-1, k, k+1):
                # Jump must be positive (can't jump backward or stay in place)
                if next_jump <= 0:
                    continue

                # Calculate next stone position
                next_pos = stones[i] + next_jump

                # Check if this position has a stone
                if next_pos in stone_positions:
                    next_index = stone_positions[next_pos]
                    # Add this jump distance to reachable set for next stone
                    dp[next_index].add(next_jump)

    # If last stone has any reachable jump distances, frog can cross
    return len(dp[-1]) > 0
```

```javascript
// Time: O(n²) in worst case, but typically much better due to pruning
// Space: O(n²) for storing jump sets for each stone
function canCross(stones) {
  /**
   * Determine if frog can cross river by jumping between stones.
   *
   * @param {number[]} stones - Array of stone positions in ascending order
   * @return {boolean} - True if frog can reach last stone, False otherwise
   */

  // Create a map for O(1) stone position lookups
  const stonePositions = new Map();
  stones.forEach((pos, idx) => stonePositions.set(pos, idx));

  // Special case: first jump must be 1 unit
  if (stones[1] !== 1) {
    return false;
  }

  // dp[i] will store set of jump distances that can reach stone i
  const dp = new Array(stones.length);
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Set();
  }
  dp[0].add(0); // Start at position 0 with jump distance 0

  // Process each stone
  for (let i = 0; i < stones.length; i++) {
    // For each jump distance that can reach current stone
    for (const k of dp[i]) {
      // Try next jumps: k-1, k, k+1
      for (const nextJump of [k - 1, k, k + 1]) {
        // Jump must be positive
        if (nextJump <= 0) {
          continue;
        }

        // Calculate next stone position
        const nextPos = stones[i] + nextJump;

        // Check if this position has a stone
        if (stonePositions.has(nextPos)) {
          const nextIndex = stonePositions.get(nextPos);
          // Add this jump distance to reachable set for next stone
          dp[nextIndex].add(nextJump);
        }
      }
    }
  }

  // If last stone has any reachable jump distances, frog can cross
  return dp[dp.length - 1].size > 0;
}
```

```java
// Time: O(n²) in worst case, but typically much better due to pruning
// Space: O(n²) for storing jump sets for each stone
import java.util.*;

class Solution {
    public boolean canCross(int[] stones) {
        /**
         * Determine if frog can cross river by jumping between stones.
         *
         * @param stones: Array of stone positions in ascending order
         * @return: True if frog can reach last stone, False otherwise
         */

        // Create a map for O(1) stone position lookups
        Map<Integer, Integer> stonePositions = new HashMap<>();
        for (int i = 0; i < stones.length; i++) {
            stonePositions.put(stones[i], i);
        }

        // Special case: first jump must be 1 unit
        if (stones[1] != 1) {
            return false;
        }

        // dp[i] will store set of jump distances that can reach stone i
        List<Set<Integer>> dp = new ArrayList<>();
        for (int i = 0; i < stones.length; i++) {
            dp.add(new HashSet<>());
        }
        dp.get(0).add(0);  // Start at position 0 with jump distance 0

        // Process each stone
        for (int i = 0; i < stones.length; i++) {
            // For each jump distance that can reach current stone
            for (int k : dp.get(i)) {
                // Try next jumps: k-1, k, k+1
                for (int nextJump = k - 1; nextJump <= k + 1; nextJump++) {
                    // Jump must be positive
                    if (nextJump <= 0) {
                        continue;
                    }

                    // Calculate next stone position
                    int nextPos = stones[i] + nextJump;

                    // Check if this position has a stone
                    if (stonePositions.containsKey(nextPos)) {
                        int nextIndex = stonePositions.get(nextPos);
                        // Add this jump distance to reachable set for next stone
                        dp.get(nextIndex).add(nextJump);
                    }
                }
            }
        }

        // If last stone has any reachable jump distances, frog can cross
        return !dp.get(stones.length - 1).isEmpty();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) in the worst case, but typically much better in practice. Here's why:

- We iterate through each stone (n iterations)
- For each stone, we iterate through its reachable jump distances
- In worst case, each stone could have O(n) jump distances, giving O(n²)
- However, in practice, the number of jump distances per stone is limited because jump distances can't grow too large (bounded by stone positions)

**Space Complexity**: O(n²) for storing jump distance sets:

- We store a set for each of n stones
- Each set could contain up to O(n) jump distances in worst case
- The position lookup map uses O(n) space

**Why this is acceptable**: With n ≤ 2000, n² = 4 million operations is feasible. The actual runtime is usually much lower due to pruning (we only process reachable states).

## Common Mistakes

1. **Forgetting the first jump constraint**: The frog's first jump is always 1 unit. Many candidates miss checking `stones[1] == 1` and get wrong answers for cases like `[0,2]`.

2. **Not handling duplicate jump distances**: Using a list instead of a set for `dp[i]` can cause duplicate processing and exponential blowup. Sets ensure we process each jump distance only once per stone.

3. **Incorrect jump distance bounds**: Candidates sometimes allow jumps of 0 or negative distances. The frog must make positive jumps forward. Always check `next_jump > 0`.

4. **Inefficient position lookup**: Using linear search to find if a position has a stone gives O(n) per lookup, making overall complexity O(n³). Always use a hash map for O(1) lookups.

5. **Off-by-one with stone indices**: When stones start at position 0 (not 1), candidates sometimes mis-index. Remember array indices don't correspond to positions.

## When You'll See This Pattern

This problem uses **state-based dynamic programming with reachability tracking**, a pattern common in:

1. **Minimum Sideway Jumps (LeetCode 1824)**: Similar state tracking where frog's lane and sideways jumps create a state space. Both problems track what states are reachable given movement constraints.

2. **Jump Game variants (LeetCode 55, 45)**: While simpler, these problems also involve reachability in an array. Frog Jump adds the twist of jump distance depending on previous jump.

3. **Unique Paths problems**: The state transition (from position i with jump k to position i+k with next jump) resembles DP in grid problems, but with variable step sizes.

The core pattern is: when you have a problem where decisions create branching paths and you need to know if a goal is reachable, consider tracking reachable states rather than exploring all paths.

## Key Takeaways

1. **State representation matters**: When a problem has dependencies between steps (like current jump depending on previous jump), include that dependency in your state representation. Here, state = (position, previous_jump).

2. **Reachability over exploration**: Instead of exploring all paths (exponential), track what states are reachable (polynomial). This is the essence of dynamic programming.

3. **Use appropriate data structures**: Hash maps for O(1) lookups and sets to avoid duplicates are crucial for efficiency. The choice of data structure often makes the difference between an acceptable and unacceptable solution.

4. **Start with base cases**: Always check initial conditions first. Here, the first jump must be to position 1, which immediately eliminates some impossible cases.

Related problems: [Minimum Sideway Jumps](/problem/minimum-sideway-jumps), [Solving Questions With Brainpower](/problem/solving-questions-with-brainpower), [Maximum Number of Jumps to Reach the Last Index](/problem/maximum-number-of-jumps-to-reach-the-last-index)
