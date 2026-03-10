---
title: "How to Solve Find Players With Zero or One Losses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Players With Zero or One Losses. Medium difficulty, 72.5% acceptance rate. Topics: Array, Hash Table, Sorting, Counting."
date: "2027-12-16"
category: "dsa-patterns"
tags: ["find-players-with-zero-or-one-losses", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Find Players With Zero or One Losses

This problem asks us to analyze match results between players and categorize them based on their loss counts. Given an array of `[winner, loser]` pairs, we need to return two lists: players with zero losses and players with exactly one loss. What makes this problem interesting is that it requires careful tracking of player states while handling potentially large datasets efficiently. The challenge lies in organizing the data to quickly determine each player's loss count and then extracting the specific groups we need.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this input:

```
matches = [[1,3],[2,3],[3,6],[5,6],[5,7],[4,5],[4,8],[4,9],[10,4],[10,9]]
```

We need to track each player's losses. Let's walk through the matches:

1. `[1,3]`: Player 1 wins, player 3 loses (3 has 1 loss)
2. `[2,3]`: Player 2 wins, player 3 loses (3 now has 2 losses)
3. `[3,6]`: Player 3 wins, player 6 loses (6 has 1 loss)
4. `[5,6]`: Player 5 wins, player 6 loses (6 now has 2 losses)
5. `[5,7]`: Player 5 wins, player 7 loses (7 has 1 loss)
6. `[4,5]`: Player 4 wins, player 5 loses (5 has 1 loss)
7. `[4,8]`: Player 4 wins, player 8 loses (8 has 1 loss)
8. `[4,9]`: Player 4 wins, player 9 loses (9 has 1 loss)
9. `[10,4]`: Player 10 wins, player 4 loses (4 has 1 loss)
10. `[10,9]`: Player 10 wins, player 9 loses (9 now has 2 losses)

Now let's compile the loss counts:

- Player 1: 0 losses (only appeared as winner)
- Player 2: 0 losses (only appeared as winner)
- Player 3: 2 losses (appeared as loser twice)
- Player 4: 1 loss (lost to player 10)
- Player 5: 1 loss (lost to player 4)
- Player 6: 2 losses (lost to players 3 and 5)
- Player 7: 1 loss (lost to player 5)
- Player 8: 1 loss (lost to player 4)
- Player 9: 2 losses (lost to players 4 and 10)
- Player 10: 0 losses (only appeared as winner)

Players with 0 losses: [1, 2, 10] (sorted ascending)
Players with 1 loss: [4, 5, 7, 8] (sorted ascending)

## Brute Force Approach

A naive approach might involve multiple passes through the data. First, we could collect all unique players by scanning all winners and losers. Then, for each player, we could scan through all matches to count how many times they appear as a loser. This would give us the loss count for each player.

The problem with this approach is its inefficiency. With `n` matches and `p` unique players, we'd need `O(p × n)` time complexity. In the worst case where every player plays every other player, `p` could be up to `2n` (though typically less), making this approach `O(n²)`. This is too slow for large inputs.

Another naive approach might be to use nested loops to compare each player against all matches, but this suffers from the same quadratic time complexity.

## Optimized Approach

The key insight is that we need to track loss counts efficiently. A hash map (dictionary) is perfect for this because it provides O(1) average time for insertions and lookups. Here's the step-by-step reasoning:

1. **Track losses**: Create a dictionary where keys are player IDs and values are their loss counts.
2. **Process matches**: For each match `[winner, loser]`:
   - Ensure the winner exists in our dictionary (initialize with 0 losses if not present)
   - Increment the loser's loss count (initialize with 0 if not present, then add 1)
3. **Identify players with 0 or 1 loss**: After processing all matches:
   - Players with 0 losses: those who exist in our dictionary but have loss count 0
   - Players with 1 loss: those with loss count exactly 1
4. **Sort results**: Both lists need to be in ascending order, so we sort them.

We also need to consider players who only appear as winners (they won all their matches) and players who only appear as losers (they lost all their matches). Our dictionary approach handles both cases naturally.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def findWinners(matches):
    """
    Returns two lists: players with 0 losses and players with exactly 1 loss.

    Args:
        matches: List of [winner, loser] pairs

    Returns:
        List of two lists: [[zero_loss_players], [one_loss_players]]
    """
    # Dictionary to track loss counts for each player
    # Key: player ID, Value: number of losses
    loss_count = {}

    # Process each match
    for winner, loser in matches:
        # Ensure winner exists in dictionary (initialize with 0 losses if not)
        if winner not in loss_count:
            loss_count[winner] = 0

        # Update loser's loss count (increment by 1)
        # If loser not in dictionary, initialize with 1 loss (0 + 1)
        loss_count[loser] = loss_count.get(loser, 0) + 1

    # Initialize lists for players with 0 and 1 losses
    zero_loss = []
    one_loss = []

    # Iterate through all players in the dictionary
    for player, losses in loss_count.items():
        if losses == 0:
            zero_loss.append(player)
        elif losses == 1:
            one_loss.append(player)

    # Sort both lists in ascending order
    zero_loss.sort()
    one_loss.sort()

    return [zero_loss, one_loss]
```

```javascript
// Time: O(n log n) | Space: O(n)
function findWinners(matches) {
  /**
   * Returns two lists: players with 0 losses and players with exactly 1 loss.
   *
   * @param {number[][]} matches - Array of [winner, loser] pairs
   * @return {number[][]} - Array of two arrays: [[zero_loss_players], [one_loss_players]]
   */
  // Map to track loss counts for each player
  // Key: player ID, Value: number of losses
  const lossCount = new Map();

  // Process each match
  for (const [winner, loser] of matches) {
    // Ensure winner exists in map (initialize with 0 losses if not)
    if (!lossCount.has(winner)) {
      lossCount.set(winner, 0);
    }

    // Update loser's loss count (increment by 1)
    // If loser not in map, initialize with 1 loss (0 + 1)
    lossCount.set(loser, (lossCount.get(loser) || 0) + 1);
  }

  // Initialize arrays for players with 0 and 1 losses
  const zeroLoss = [];
  const oneLoss = [];

  // Iterate through all players in the map
  for (const [player, losses] of lossCount) {
    if (losses === 0) {
      zeroLoss.push(player);
    } else if (losses === 1) {
      oneLoss.push(player);
    }
  }

  // Sort both arrays in ascending order
  zeroLoss.sort((a, b) => a - b);
  oneLoss.sort((a, b) => a - b);

  return [zeroLoss, oneLoss];
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public List<List<Integer>> findWinners(int[][] matches) {
        /**
         * Returns two lists: players with 0 losses and players with exactly 1 loss.
         *
         * @param matches: Array of [winner, loser] pairs
         * @return: List of two lists: [[zero_loss_players], [one_loss_players]]
         */
        // Map to track loss counts for each player
        // Key: player ID, Value: number of losses
        Map<Integer, Integer> lossCount = new HashMap<>();

        // Process each match
        for (int[] match : matches) {
            int winner = match[0];
            int loser = match[1];

            // Ensure winner exists in map (initialize with 0 losses if not)
            lossCount.putIfAbsent(winner, 0);

            // Update loser's loss count (increment by 1)
            // If loser not in map, initialize with 1 loss (0 + 1)
            lossCount.put(loser, lossCount.getOrDefault(loser, 0) + 1);
        }

        // Initialize lists for players with 0 and 1 losses
        List<Integer> zeroLoss = new ArrayList<>();
        List<Integer> oneLoss = new ArrayList<>();

        // Iterate through all players in the map
        for (Map.Entry<Integer, Integer> entry : lossCount.entrySet()) {
            int player = entry.getKey();
            int losses = entry.getValue();

            if (losses == 0) {
                zeroLoss.add(player);
            } else if (losses == 1) {
                oneLoss.add(player);
            }
        }

        // Sort both lists in ascending order
        Collections.sort(zeroLoss);
        Collections.sort(oneLoss);

        // Return as list of lists
        List<List<Integer>> result = new ArrayList<>();
        result.add(zeroLoss);
        result.add(oneLoss);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Processing all `n` matches takes O(n) time (each match is processed once)
- Extracting players from the dictionary takes O(p) time, where `p` is the number of unique players
- Sorting the two result lists takes O(p log p) time in the worst case
- Since `p ≤ 2n` (each match has 2 players), the dominant term is O(n log n)

**Space Complexity: O(n)**

- The dictionary stores an entry for each unique player, which is at most `2n` entries
- The result lists together store at most `p` elements
- Therefore, total space is O(n)

## Common Mistakes

1. **Forgetting to include players who only won matches**: Some candidates only track losers, missing players with 0 losses. Remember that players who only appear as winners have 0 losses and must be included in the first list.

2. **Not sorting the output**: The problem requires both lists to be in increasing order. Failing to sort the results is a common oversight that can cause test failures.

3. **Incorrect loss counting for winners**: When a player wins a match, we need to ensure they exist in our tracking structure (with 0 losses if not already present). Otherwise, we might miss undefeated players.

4. **Using arrays instead of hash maps for player IDs**: If player IDs can be large (up to 10⁵ according to constraints), using an array of size equal to the maximum ID wastes memory. A hash map uses space proportional to the actual number of players.

## When You'll See This Pattern

This problem uses **frequency counting with hash maps**, a pattern that appears in many coding problems:

1. **Two Sum (Easy)**: Uses a hash map to track numbers seen so far and their indices to find pairs that sum to a target.

2. **Group Anagrams (Medium)**: Uses character frequency counts (or sorted strings) as keys in a hash map to group anagrams together.

3. **Top K Frequent Elements (Medium)**: Counts element frequencies with a hash map, then uses a heap or bucket sort to find the most frequent elements.

The core pattern is: when you need to track counts or frequencies of items, and especially when the items can be sparse or have large IDs, a hash map is usually the right choice.

## Key Takeaways

1. **Hash maps are ideal for frequency counting**: When you need to track how many times something occurs (losses, wins, character appearances, etc.), a hash map provides O(1) average time operations.

2. **Consider all cases in counting problems**: Make sure to account for edge cases like items that appear only in certain contexts (players who only win or only lose).

3. **Always check output requirements**: Don't forget secondary requirements like sorting the results. Many candidates solve the main logic correctly but miss formatting details.

Related problems: [Lowest Common Ancestor of a Binary Tree](/problem/lowest-common-ancestor-of-a-binary-tree)
