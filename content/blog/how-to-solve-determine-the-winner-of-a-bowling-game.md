---
title: "How to Solve Determine the Winner of a Bowling Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Determine the Winner of a Bowling Game. Easy difficulty, 37.2% acceptance rate. Topics: Array, Simulation."
date: "2028-09-29"
category: "dsa-patterns"
tags: ["determine-the-winner-of-a-bowling-game", "array", "simulation", "easy"]
---

# How to Solve "Determine the Winner of a Bowling Game"

This problem simulates a simplified bowling scoring system where players earn bonus points for strikes and spares. The tricky part is that the bonus calculation depends on future rolls, which means you can't simply sum the array values directly—you need to look ahead to apply the correct multipliers.

## Visual Walkthrough

Let's walk through an example to understand how the scoring works. Suppose:

**Player 1:** `[10, 2, 3]`  
**Player 2:** `[5, 5, 10]`

**Turn 1 (index 0):**

- Player 1 rolls 10 (strike). Score = 10 + next two rolls (2 + 3) = 15
- Player 2 rolls 5. Not a strike or spare yet, so score = 5

**Turn 2 (index 1):**

- Player 1 rolled a strike last turn, so this turn is part of that bonus. Actual roll: 2
- Player 2 rolls 5. Combined with previous roll (5 + 5 = 10), this is a spare! Score = 5 (from turn 1) + 10 + next roll (10) = 25

**Turn 3 (index 2):**

- Player 1 rolls 3. This completes the strike bonus from turn 1. Total score = 15
- Player 2 rolled a spare last turn, so this roll (10) gets added to that spare. Total score = 25 + 10 = 35

**Final scores:** Player 1 = 15, Player 2 = 35 → Player 2 wins.

The key insight: When we encounter a strike or spare, we need to look ahead 1-2 rolls to calculate the bonus, but we only process each roll once in our main loop.

## Brute Force Approach

A truly brute force approach would be to calculate the score by examining every possible combination of rolls, but that's unnecessary. The naive approach most candidates might try is simply summing the arrays:

```python
def isWinner(player1, player2):
    return 1 if sum(player1) > sum(player2) else 2 if sum(player2) > sum(player1) else 0
```

**Why this fails:** It completely ignores the bonus scoring rules for strikes and spares. A strike (10) followed by [0, 0] should score 10, but a strike followed by [10, 10] should score 30. Simple summation treats both cases the same.

Even if we try to handle bonuses by looking ahead in nested loops, we need to be careful about array bounds and the fact that bonuses can chain (a strike gives a bonus that includes another strike's value).

## Optimal Solution

The optimal approach processes the game turn by turn (n turns total, where n = len(player1) = len(player2)). For each turn i:

1. Calculate the current player's score for this turn
2. If it's a strike (10 pins), add the next two rolls as bonus
3. If it's a spare (sum of this turn and next turn = 10), add the next roll as bonus
4. Otherwise, just add the current roll(s)

We need to handle the last two turns specially since we might not have enough future rolls to look ahead.

<div class="code-group">

```python
# Time: O(n) where n is the number of turns | Space: O(1)
def isWinner(player1, player2):
    """
    Determine the winner of a bowling game.

    Args:
        player1: List[int] - rolls for player 1
        player2: List[int] - rolls for player 2

    Returns:
        1 if player1 wins, 2 if player2 wins, 0 if tie
    """
    def calculate_score(rolls):
        """Calculate the total score for a player's rolls."""
        score = 0
        n = len(rolls)

        # Process each turn (2 rolls per turn except strikes)
        i = 0  # Index to track current roll
        turn = 0  # Track which turn we're on

        while turn < 10:  # Bowling has exactly 10 turns
            if rolls[i] == 10:  # Strike
                # Add strike bonus: next two rolls
                score += 10
                # Check if we have enough rolls for bonus
                if i + 1 < n:
                    score += rolls[i + 1]
                if i + 2 < n:
                    score += rolls[i + 2]
                i += 1  # Strike uses only one roll in this turn
            elif i + 1 < n and rolls[i] + rolls[i + 1] == 10:  # Spare
                # Add spare bonus: next roll
                score += 10
                if i + 2 < n:
                    score += rolls[i + 2]
                i += 2  # Spare uses two rolls
            else:  # Open frame (no strike or spare)
                if i < n:
                    score += rolls[i]
                if i + 1 < n:
                    score += rolls[i + 1]
                i += 2  # Open frame uses two rolls

            turn += 1

        return score

    # Calculate scores for both players
    score1 = calculate_score(player1)
    score2 = calculate_score(player2)

    # Determine winner
    if score1 > score2:
        return 1
    elif score2 > score1:
        return 2
    else:
        return 0
```

```javascript
// Time: O(n) where n is the number of turns | Space: O(1)
function isWinner(player1, player2) {
  /**
   * Calculate the total score for a player's rolls.
   * @param {number[]} rolls - Array of rolls for a player
   * @return {number} Total score
   */
  function calculateScore(rolls) {
    let score = 0;
    const n = rolls.length;
    let i = 0; // Current roll index
    let turn = 0; // Current turn (0-9 for 10 turns)

    while (turn < 10) {
      if (rolls[i] === 10) {
        // Strike
        score += 10;
        // Add bonus from next two rolls if they exist
        if (i + 1 < n) score += rolls[i + 1];
        if (i + 2 < n) score += rolls[i + 2];
        i += 1; // Strike uses one roll
      } else if (i + 1 < n && rolls[i] + rolls[i + 1] === 10) {
        // Spare
        score += 10;
        // Add bonus from next roll if it exists
        if (i + 2 < n) score += rolls[i + 2];
        i += 2; // Spare uses two rolls
      } else {
        // Open frame
        if (i < n) score += rolls[i];
        if (i + 1 < n) score += rolls[i + 1];
        i += 2; // Open frame uses two rolls
      }
      turn++;
    }

    return score;
  }

  const score1 = calculateScore(player1);
  const score2 = calculateScore(player2);

  if (score1 > score2) return 1;
  if (score2 > score1) return 2;
  return 0;
}
```

```java
// Time: O(n) where n is the number of turns | Space: O(1)
class Solution {
    public int isWinner(int[] player1, int[] player2) {
        // Calculate scores for both players
        int score1 = calculateScore(player1);
        int score2 = calculateScore(player2);

        // Determine winner
        if (score1 > score2) return 1;
        if (score2 > score1) return 2;
        return 0;
    }

    private int calculateScore(int[] rolls) {
        int score = 0;
        int n = rolls.length;
        int i = 0;      // Current roll index
        int turn = 0;   // Current turn (0-9 for 10 turns)

        while (turn < 10) {
            if (rolls[i] == 10) {  // Strike
                score += 10;
                // Add bonus from next two rolls if they exist
                if (i + 1 < n) score += rolls[i + 1];
                if (i + 2 < n) score += rolls[i + 2];
                i += 1;  // Strike uses one roll
            } else if (i + 1 < n && rolls[i] + rolls[i + 1] == 10) {  // Spare
                score += 10;
                // Add bonus from next roll if it exists
                if (i + 2 < n) score += rolls[i + 2];
                i += 2;  // Spare uses two rolls
            } else {  // Open frame
                if (i < n) score += rolls[i];
                if (i + 1 < n) score += rolls[i + 1];
                i += 2;  // Open frame uses two rolls
            }
            turn++;
        }

        return score;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of turns (always 10 in bowling, but we process based on the length of the input arrays). Each roll is processed exactly once, and we perform constant-time operations for each roll.

**Space Complexity:** O(1) for all solutions. We only use a few variables to track scores, indices, and turn counts. No additional data structures that grow with input size are needed.

The constant factors: We process exactly 10 turns regardless of array length (since bowling has 10 frames). However, the input arrays might have more than 20 rolls if there are many strikes (which use fewer rolls per turn but give bonus rolls at the end).

## Common Mistakes

1. **Forgetting to handle array bounds when looking ahead:** When checking for strike/spare bonuses on the last turn, you might try to access rolls[i+1] or rolls[i+2] when i is near the end of the array. Always check `i + k < n` before accessing.

2. **Incorrect turn counting:** Some solutions might process all rolls instead of exactly 10 turns. Remember: bowling has exactly 10 turns, but strikes use only 1 roll per turn while spares and open frames use 2.

3. **Mixing up strike and spare logic:** A strike adds the next TWO rolls as bonus. A spare adds the next ONE roll as bonus. Getting these reversed will give wrong scores.

4. **Not resetting indices between players:** If you use a single loop for both players, you need separate index variables for each player's array, or better yet, use a helper function as shown above.

## When You'll See This Pattern

This "look-ahead" pattern appears in problems where current calculations depend on future values:

1. **High Five (LeetCode 1086)** - Similar rolling calculation where you need to process scores in groups and apply special rules.

2. **Candy (LeetCode 135)** - When distributing candy, you need to look at neighbors' ratings to determine how much candy to give.

3. **Trapping Rain Water (LeetCode 42)** - To calculate how much water can be trapped, you need to look ahead to find the maximum height to the right.

The pattern involves processing data sequentially while occasionally peeking ahead to make decisions about the current element.

## Key Takeaways

1. **When future values affect current calculations, process sequentially but check ahead carefully.** Use index variables to track your position and always verify bounds before accessing.

2. **Break complex scoring/rules into helper functions.** This makes the code cleaner and easier to debug. The calculateScore function isolates the bowling logic from the comparison logic.

3. **Simulation problems often have fixed constraints.** Bowling has exactly 10 turns—knowing this helps structure your loop correctly. Always read the problem constraints carefully.

Related problems: [High Five](/problem/high-five)
