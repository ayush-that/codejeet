---
title: "How to Solve Find the Number of Winning Players — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Number of Winning Players. Easy difficulty, 60.4% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-08-27"
category: "dsa-patterns"
tags: ["find-the-number-of-winning-players", "array", "hash-table", "counting", "easy"]
---

# How to Solve Find the Number of Winning Players

This problem asks us to determine how many players win a game based on their ball picks. Each player `i` wins if they pick **strictly more than `i` balls** of the **same color**. The tricky part is that we need to track counts per player per color, but only care about whether _any_ color for that player exceeds the threshold `i`. This is a counting problem disguised as a multi-dimensional tracking challenge.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `n = 3` players and these picks:

```
pick = [[0, 1], [0, 2], [1, 1], [0, 1], [2, 3], [1, 1], [0, 1]]
```

**Step 1: Initialize tracking**
We need to track how many balls of each color each player has picked. Let's create a mental table:

```
Player 0:
  Color 1: 0
  Color 2: 0
  Color 3: 0

Player 1:
  Color 1: 0
  Color 2: 0
  Color 3: 0

Player 2:
  Color 1: 0
  Color 2: 0
  Color 3: 0
```

**Step 2: Process picks one by one**

1. `[0, 1]`: Player 0 picks color 1 → Player 0's color 1 count = 1
2. `[0, 2]`: Player 0 picks color 2 → Player 0's color 2 count = 1
3. `[1, 1]`: Player 1 picks color 1 → Player 1's color 1 count = 1
4. `[0, 1]`: Player 0 picks color 1 → Player 0's color 1 count = 2
5. `[2, 3]`: Player 2 picks color 3 → Player 2's color 3 count = 1
6. `[1, 1]`: Player 1 picks color 1 → Player 1's color 1 count = 2
7. `[0, 1]`: Player 0 picks color 1 → Player 0's color 1 count = 3

**Step 3: Check winning conditions**
Now check each player:

- Player 0: Has color 1 count = 3. Need strictly more than 0? Yes, 3 > 0 → **Wins**
- Player 1: Has color 1 count = 2. Need strictly more than 1? Yes, 2 > 1 → **Wins**
- Player 2: Has color 3 count = 1. Need strictly more than 2? No, 1 ≤ 2 → **Doesn't win**

So the answer is 2 winning players.

The key insight: We don't need to track all colors for all players forever—we just need to know if _any_ color count for a player exceeds that player's index.

## Brute Force Approach

A naive approach would be to create an `n x m` matrix where `m` is the number of colors, but we don't know the number of colors in advance. We could:

1. Find the maximum color value to know how many colors exist
2. Create a 2D array `counts[n][maxColor+1]`
3. For each pick `[xi, yi]`, increment `counts[xi][yi]`
4. For each player `i`, check all colors to see if any count > i

The problem with this approach is space inefficiency. If color values are large (say up to 10^9), we can't create an array that big. Even if colors are reasonable, we're allocating space for colors players never pick.

What candidates might try: Using a list of dictionaries or a dictionary of dictionaries. This is actually the right direction! The "brute force" thinking here is trying to store everything explicitly when we only need to track the maximum per player.

## Optimal Solution

The optimal solution uses a hash map to track counts per player per color, but with an optimization: we can stop tracking a player once they've already won. Here's the step-by-step reasoning:

1. **Data Structure Choice**: Use a dictionary/hash map where keys are player IDs and values are dictionaries mapping colors to counts.
2. **Processing Picks**: For each pick `[xi, yi]`:
   - If player `xi` is already marked as winner, skip (optimization)
   - Increment count for color `yi` for player `xi`
   - If this count > `xi`, mark player as winner
3. **Counting Winners**: Keep a counter that increments each time we mark a player as winner.

The key optimization is that once a player wins (by having any color count > their index), we don't need to track their future picks—they've already won!

<div class="code-group">

```python
# Time: O(p) where p = len(pick) | Space: O(min(p, n*c)) where c = distinct colors per player
def winningPlayers(n, pick):
    """
    Count how many players win based on their ball picks.

    Args:
        n: Number of players (0 to n-1)
        pick: List of [player_id, color] pairs

    Returns:
        Number of winning players
    """
    # Dictionary to track each player's color counts
    # player_counts[player_id] = {color: count}
    player_counts = {}

    # Set to track which players have already won
    # Once a player wins, we don't need to track their future picks
    winners = set()

    # Process each pick
    for player_id, color in pick:
        # Skip if player already won
        if player_id in winners:
            continue

        # Initialize player's color dictionary if not exists
        if player_id not in player_counts:
            player_counts[player_id] = {}

        # Get the color counts for this player
        color_counts = player_counts[player_id]

        # Increment count for this color
        # Using get() with default 0 for colors not yet seen
        color_counts[color] = color_counts.get(color, 0) + 1

        # Check if this player now wins
        # Player wins if any color count > player_id
        if color_counts[color] > player_id:
            winners.add(player_id)
            # Optional: clean up to save memory
            # del player_counts[player_id]

    # Return number of winners
    return len(winners)
```

```javascript
// Time: O(p) where p = pick.length | Space: O(min(p, n*c)) where c = distinct colors per player
function winningPlayers(n, pick) {
  /**
   * Count how many players win based on their ball picks.
   *
   * @param {number} n - Number of players (0 to n-1)
   * @param {number[][]} pick - Array of [player_id, color] pairs
   * @return {number} - Number of winning players
   */

  // Map to track each player's color counts
  // playerCounts.get(player_id) = {color: count}
  const playerCounts = new Map();

  // Set to track which players have already won
  // Once a player wins, we don't need to track their future picks
  const winners = new Set();

  // Process each pick
  for (const [playerId, color] of pick) {
    // Skip if player already won
    if (winners.has(playerId)) {
      continue;
    }

    // Get or create color map for this player
    if (!playerCounts.has(playerId)) {
      playerCounts.set(playerId, new Map());
    }

    const colorCounts = playerCounts.get(playerId);

    // Increment count for this color
    const currentCount = colorCounts.get(color) || 0;
    colorCounts.set(color, currentCount + 1);

    // Check if this player now wins
    // Player wins if any color count > playerId
    if (colorCounts.get(color) > playerId) {
      winners.add(playerId);
      // Optional: clean up to save memory
      // playerCounts.delete(playerId);
    }
  }

  // Return number of winners
  return winners.size;
}
```

```java
// Time: O(p) where p = pick.length | Space: O(min(p, n*c)) where c = distinct colors per player
import java.util.*;

class Solution {
    public int winningPlayers(int n, int[][] pick) {
        /**
         * Count how many players win based on their ball picks.
         *
         * @param n: Number of players (0 to n-1)
         * @param pick: Array of [player_id, color] pairs
         * @return: Number of winning players
         */

        // Map to track each player's color counts
        // playerCounts.get(playerId) = Map<color, count>
        Map<Integer, Map<Integer, Integer>> playerCounts = new HashMap<>();

        // Set to track which players have already won
        // Once a player wins, we don't need to track their future picks
        Set<Integer> winners = new HashSet<>();

        // Process each pick
        for (int[] p : pick) {
            int playerId = p[0];
            int color = p[1];

            // Skip if player already won
            if (winners.contains(playerId)) {
                continue;
            }

            // Get or create color map for this player
            playerCounts.putIfAbsent(playerId, new HashMap<>());
            Map<Integer, Integer> colorCounts = playerCounts.get(playerId);

            // Increment count for this color
            colorCounts.put(color, colorCounts.getOrDefault(color, 0) + 1);

            // Check if this player now wins
            // Player wins if any color count > playerId
            if (colorCounts.get(color) > playerId) {
                winners.add(playerId);
                // Optional: clean up to save memory
                // playerCounts.remove(playerId);
            }
        }

        // Return number of winners
        return winners.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(p)** where `p` is the number of picks (`len(pick)`). We process each pick exactly once, and each operation (dictionary lookup, increment, comparison) is O(1) on average.

**Space Complexity: O(min(p, n × c))** where `c` is the average number of distinct colors per player. In the worst case, we store every pick for every player, but:

- We stop tracking players once they win (removing them from `player_counts`)
- We only store distinct color counts per player, not all picks
- If all players pick many different colors, we could store up to `n × c` entries

The space is bounded by the total number of distinct (player, color) pairs we need to track before players win.

## Common Mistakes

1. **Forgetting the "strictly more than i" condition**: Candidates sometimes use `>=` instead of `>`. Remember: "strictly more than i" means `count > i`, not `count >= i`.

2. **Not optimizing after player wins**: Some solutions continue tracking counts for players who have already won. Once a player wins, we don't care about their future picks—we can skip processing them to save time and space.

3. **Using array instead of hash map for colors**: If colors can have large values (not guaranteed to be 0 to n-1), using an array indexed by color will either fail (index out of bounds) or waste enormous memory. Always use a hash map/dictionary for sparse data.

4. **Misunderstanding player indices**: Player IDs are 0-indexed in the examples. Player 0 needs more than 0 balls of same color (so at least 1), player 1 needs more than 1 (at least 2), etc. This is consistent with the problem statement but can trip up those who expect 1-indexed players.

## When You'll See This Pattern

This problem uses **frequency counting with early termination**, a pattern common in optimization problems where you can stop processing once a condition is met. Similar problems include:

1. **Two Sum** (Easy): Use a hash map to track seen numbers and their indices, allowing early return when complement is found.

2. **First Unique Character in a String** (Easy): Count character frequencies, then scan to find first with count = 1.

3. **Subarray Sum Equals K** (Medium): Use prefix sums and a hash map to track cumulative sums, checking if `current_sum - k` exists in the map.

The core pattern: When you need to track counts or frequencies and make decisions based on thresholds, hash maps are usually the right tool. The early termination optimization (skipping players who already won) is similar to pruning in search problems.

## Key Takeaways

1. **Hash maps are ideal for sparse counting problems**: When you need to track counts for keys that aren't consecutive integers or have large ranges, dictionaries/hash maps avoid the memory waste of arrays.

2. **Early termination improves efficiency**: If you can determine the answer for an element early, stop processing it. This optimization often separates basic from optimal solutions.

3. **Read conditions carefully**: "Strictly more than i" means `> i`, not `>= i`. Pay attention to whether indices are 0-based or 1-based in the problem context.

Related problems: [Can I Win](/problem/can-i-win), [Predict the Winner](/problem/predict-the-winner)
