---
title: "How to Solve Best Team With No Conflicts — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Best Team With No Conflicts. Medium difficulty, 50.6% acceptance rate. Topics: Array, Dynamic Programming, Sorting."
date: "2027-07-02"
category: "dsa-patterns"
tags: ["best-team-with-no-conflicts", "array", "dynamic-programming", "sorting", "medium"]
---

# How to Solve Best Team With No Conflicts

You need to select basketball players to maximize total score, but you can't select players where a younger player has a higher score than an older player. This creates a constraint that's essentially: if you sort players by age, their scores must be non-decreasing. The challenge is finding the maximum sum of scores in a valid sequence.

## Visual Walkthrough

Let's trace through a concrete example:

```
scores = [4, 5, 6, 5]
ages = [2, 1, 2, 1]
```

First, let's pair players: (score=4, age=2), (score=5, age=1), (score=6, age=2), (score=5, age=1)

**Step 1: Sort by age, then score**
When ages are equal, we sort by score to handle same-age players properly:
(score=5, age=1), (score=5, age=1), (score=4, age=2), (score=6, age=2)

**Step 2: Find maximum sum of non-decreasing scores**
We need to find the maximum sum of a subsequence where scores are non-decreasing:

- Start with first player: sum = 5
- Second player (score=5, age=1): score ≥ 5, so we can include: sum = 5+5 = 10
- Third player (score=4, age=2): score < 5, so we can't include it in a sequence that includes previous players
- Fourth player (score=6, age=2): score ≥ 5, so we can include: sum = 5+5+6 = 16

But wait, we need to consider all possibilities! What if we skip the second player?

- First player: 5
- Skip second
- Third player: 4 (can include since 4 ≥ 5? No! So we can't include third after first)
- Fourth player: 6 (can include since 6 ≥ 5): sum = 5+6 = 11

The best is actually 16 from including players 1, 2, and 4.

This shows we need dynamic programming to track all possible valid sequences.

## Brute Force Approach

The brute force approach would try all possible subsets of players (2^n possibilities) and check if each subset is valid. For each subset:

1. Check if for every pair of players where age1 < age2, we have score1 ≤ score2
2. If valid, calculate the sum of scores
3. Track the maximum sum found

This is O(2^n \* n^2) time complexity - far too slow for n up to 1000. Even for n=20, that's over 400 million operations!

The key insight is that once we sort players by age, the problem reduces to finding the maximum sum increasing subsequence (where "increasing" means non-decreasing scores).

## Optimized Approach

The optimal solution uses dynamic programming after sorting:

1. **Sort players by age, then by score**: This ensures that when we process players left to right, we never have to worry about younger players coming after older ones.

2. **DP definition**: Let dp[i] = maximum total score ending with player i (including player i's score).

3. **Transition**: For each player i, look at all previous players j (j < i):
   - If scores[j] ≤ scores[i], we can extend the sequence ending at j to include i
   - dp[i] = max(dp[i], dp[j] + scores[i]) for all valid j
   - Also, dp[i] must be at least scores[i] (starting a new sequence with just player i)

4. **Answer**: The maximum value in the dp array.

Why does this work? After sorting by age, any valid sequence must have non-decreasing scores. Our DP finds the maximum sum sequence that maintains this property.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def bestTeamScore(scores, ages):
    """
    Find maximum total score of a team with no conflicts.

    Args:
        scores: List of player scores
        ages: List of player ages

    Returns:
        Maximum possible team score
    """
    n = len(scores)

    # Step 1: Create list of (age, score) pairs
    players = [(ages[i], scores[i]) for i in range(n)]

    # Step 2: Sort by age first, then by score
    # This ensures when we process left to right, all younger players come first
    # When ages are equal, sort by score to handle same-age players properly
    players.sort()

    # Step 3: Initialize DP array
    # dp[i] = maximum total score ending with player i
    dp = [0] * n

    # Step 4: Fill DP array
    for i in range(n):
        # Current player's score
        current_score = players[i][1]

        # Initialize dp[i] with just this player's score
        # (starting a new sequence with just this player)
        dp[i] = current_score

        # Check all previous players
        for j in range(i):
            # If previous player's score <= current player's score
            # We can extend the sequence ending at j to include i
            if players[j][1] <= current_score:
                # Update dp[i] if extending from j gives better total
                dp[i] = max(dp[i], dp[j] + current_score)

    # Step 5: Return maximum value in dp array
    return max(dp)
```

```javascript
// Time: O(n^2) | Space: O(n)
function bestTeamScore(scores, ages) {
  /**
   * Find maximum total score of a team with no conflicts.
   *
   * @param {number[]} scores - Array of player scores
   * @param {number[]} ages - Array of player ages
   * @return {number} Maximum possible team score
   */
  const n = scores.length;

  // Step 1: Create array of [age, score] pairs
  const players = [];
  for (let i = 0; i < n; i++) {
    players.push([ages[i], scores[i]]);
  }

  // Step 2: Sort by age first, then by score
  // When ages are equal, sort by score to handle same-age players
  players.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1]; // Sort by score if ages equal
    }
    return a[0] - b[0]; // Otherwise sort by age
  });

  // Step 3: Initialize DP array
  // dp[i] = maximum total score ending with player i
  const dp = new Array(n).fill(0);

  // Step 4: Fill DP array
  for (let i = 0; i < n; i++) {
    const currentScore = players[i][1];

    // Initialize with just this player's score
    dp[i] = currentScore;

    // Check all previous players
    for (let j = 0; j < i; j++) {
      // If previous player's score <= current player's score
      if (players[j][1] <= currentScore) {
        // Update if extending from j gives better total
        dp[i] = Math.max(dp[i], dp[j] + currentScore);
      }
    }
  }

  // Step 5: Return maximum value in dp array
  return Math.max(...dp);
}
```

```java
// Time: O(n^2) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int bestTeamScore(int[] scores, int[] ages) {
        /**
         * Find maximum total score of a team with no conflicts.
         *
         * @param scores Array of player scores
         * @param ages Array of player ages
         * @return Maximum possible team score
         */
        int n = scores.length;

        // Step 1: Create array of Player objects
        Player[] players = new Player[n];
        for (int i = 0; i < n; i++) {
            players[i] = new Player(ages[i], scores[i]);
        }

        // Step 2: Sort by age first, then by score
        Arrays.sort(players, (a, b) -> {
            if (a.age == b.age) {
                return a.score - b.score;  // Sort by score if ages equal
            }
            return a.age - b.age;          // Otherwise sort by age
        });

        // Step 3: Initialize DP array
        // dp[i] = maximum total score ending with player i
        int[] dp = new int[n];

        // Step 4: Fill DP array
        for (int i = 0; i < n; i++) {
            int currentScore = players[i].score;

            // Initialize with just this player's score
            dp[i] = currentScore;

            // Check all previous players
            for (int j = 0; j < i; j++) {
                // If previous player's score <= current player's score
                if (players[j].score <= currentScore) {
                    // Update if extending from j gives better total
                    dp[i] = Math.max(dp[i], dp[j] + currentScore);
                }
            }
        }

        // Step 5: Return maximum value in dp array
        int maxScore = 0;
        for (int score : dp) {
            maxScore = Math.max(maxScore, score);
        }
        return maxScore;
    }

    // Helper class to store player information
    class Player {
        int age;
        int score;

        Player(int age, int score) {
            this.age = age;
            this.score = score;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting takes O(n log n)
- The nested loops for DP take O(n²) because for each of n players, we check all previous players
- O(n log n + n²) simplifies to O(n²) since n² dominates for large n

**Space Complexity: O(n)**

- We store the sorted players array: O(n)
- We store the DP array: O(n)
- Total: O(n) additional space

## Common Mistakes

1. **Not sorting properly**: Forgetting to sort by score when ages are equal can lead to incorrect results. Same-age players with higher scores should come after lower scores to maintain the non-decreasing property.

2. **Incorrect DP transition**: Using `dp[i] = max(dp[j]) + scores[i]` instead of `dp[i] = max(dp[i], dp[j] + scores[i])`. The former only considers the best previous dp value, but we need to consider extending each valid previous sequence.

3. **Missing base case**: Forgetting to initialize `dp[i] = scores[i]` means you're not considering sequences that start with player i. Every player must be able to start their own sequence.

4. **Wrong comparison direction**: Checking `scores[j] >= scores[i]` instead of `scores[j] <= scores[i]`. After sorting by age, we need scores to be non-decreasing (each subsequent score should be at least as large as previous ones).

## When You'll See This Pattern

This problem uses the **maximum sum increasing subsequence** pattern, which appears in several variations:

1. **Longest Increasing Subsequence (LeetCode 300)**: Similar DP structure but tracks length instead of sum.
2. **Maximum Height by Stacking Cuboids (LeetCode 1691)**: Requires sorting in multiple dimensions before finding maximum sum sequence.
3. **Russian Doll Envelopes (LeetCode 354)**: Sort by one dimension, then find longest increasing subsequence in the other dimension.

The core pattern is: when you need to find an optimal sequence with ordering constraints, sort first to simplify the constraints, then use DP to find the optimal sequence.

## Key Takeaways

1. **Sort to transform constraints**: When dealing with multi-dimensional constraints (age and score), sorting by one dimension can simplify the problem to a single-dimensional constraint (non-decreasing scores).

2. **DP for optimal subsequence**: For problems asking for maximum sum/length of a valid subsequence, consider DP where `dp[i]` represents the best value ending at position i.

3. **Handle equal values carefully**: When sorting, always define how to handle equal values. Here, when ages are equal, we sort by score to ensure valid sequences.

[Practice this problem on CodeJeet](/problem/best-team-with-no-conflicts)
