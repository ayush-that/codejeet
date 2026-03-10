---
title: "How to Solve Count The Number of Winning Sequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count The Number of Winning Sequences. Hard difficulty, 32.0% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-05-20"
category: "dsa-patterns"
tags: ["count-the-number-of-winning-sequences", "string", "dynamic-programming", "hard"]
---

# How to Solve Count The Number of Winning Sequences

This problem asks us to count the number of possible sequences of creature summons Alice could choose that would result in her winning against Bob's fixed sequence over `n` rounds. The tricky part is that Alice's sequence must be _valid_ (no two consecutive identical creatures) while also beating Bob's predetermined sequence according to the rock-paper-scissors style scoring system. The combination of sequence constraints and dynamic scoring makes this a challenging counting problem.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose `n = 3` and Bob's sequence is `"FWE"` (Fire, Water, Earth).

**Round 1:** Bob plays Fire (F)

- Alice could play Water (W) to win (+2 points)
- Alice could play Earth (E) to lose (-1 point)
- Alice cannot play Fire (F) - same creature, no points

**Round 2:** Bob plays Water (W)

- Alice could play Earth (E) to win (+2 points)
- Alice could play Fire (F) to lose (-1 point)
- Alice cannot play Water (W) - same creature, no points

**Round 3:** Bob plays Earth (E)

- Alice could play Fire (F) to win (+2 points)
- Alice could play Water (W) to lose (-1 point)
- Alice cannot play Earth (E) - same creature, no points

Additionally, Alice cannot play the same creature twice in a row. So if Alice played Water in round 1, she cannot play Water in round 2.

Let's count valid winning sequences manually:

- Alice needs to end with a positive score
- Sequence must have no consecutive identical creatures

Possible winning sequences:

1. W-E-F: Round 1: W vs F → +2, Round 2: E vs W → +2, Round 3: F vs E → +2. Total: +6 ✓
2. W-E-W: Invalid (E-W consecutive different, but W-E-W has no consecutive Ws? Actually W-E-W is valid since W and W are not consecutive)
   Round 1: +2, Round 2: +2, Round 3: W vs E → -1. Total: +3 ✓
3. W-F-F: Invalid (F-F consecutive same)
4. W-F-E: Round 1: +2, Round 2: F vs W → -1, Round 3: E vs E → 0. Total: +1 ✓
5. E-F-F: Invalid (F-F consecutive same)
6. E-F-W: Round 1: E vs F → -1, Round 2: F vs W → -1, Round 3: W vs E → -1. Total: -3 ✗
7. E-W-F: Round 1: -1, Round 2: W vs W → 0, Round 3: +2. Total: +1 ✓
8. E-W-W: Invalid (W-W consecutive same)

So we have 4 winning sequences: W-E-F, W-E-W, W-F-E, and E-W-F.

This manual counting becomes impossible for larger `n`, which is why we need a systematic approach.

## Brute Force Approach

The brute force approach would generate all possible sequences of length `n` using the three creatures {F, W, E} with the constraint that no two consecutive creatures are the same. For each valid sequence, we would:

1. Calculate the score by comparing with Bob's sequence round by round
2. Check if the final score is positive
3. Count it if it is

The number of valid sequences is 3 × 2^(n-1) (3 choices for first round, 2 choices for each subsequent round since we can't repeat the previous choice). For n=20, this is about 3 × 2^19 ≈ 1.5 million sequences, which might be borderline acceptable. But the problem constraints likely expect n up to 100 or more, where 3 × 2^99 is astronomically large.

Even for moderate n, the brute force is exponential O(3 × 2^(n-1)) which is O(2^n) time complexity. We need a better approach.

## Optimized Approach

The key insight is that we can use **dynamic programming** to count winning sequences without enumerating them all. We need to track:

1. **Which round we're in** (from 0 to n-1)
2. **What creature Alice played last round** (F, W, or E, or nothing for first round)
3. **Alice's current score**

However, tracking the exact score could lead to a huge state space since scores can range from -n to 2n. But we only care whether the final score is positive, not the exact value.

Here's the breakthrough: Instead of tracking the exact score, we can track the **score difference from zero**. But we still need to know if we end up positive. We can modify our DP to track states where we know we'll end positive.

Actually, let's think differently. We want to count sequences where the final score > 0. We can use DP that tracks:

- `dp[round][last_creature][score_state]` where score_state could be negative, zero, or positive.

But wait, we need to know if we end positive, not just if we're currently positive. A sequence could be negative early but end positive. So we need to track the exact score or at least enough information to determine the final outcome.

The standard approach for this type of problem is to use DP that tracks the exact score, but with offset indexing since scores can be negative. For n rounds, scores range from -n to 2n. That's O(3n) possible scores, which for n=100 gives 300 possible scores. Combined with n rounds and 3 possible last creatures, we get O(n × 3 × 3n) = O(n²) states, which is manageable.

The recurrence relation:

```
dp[i][c][s] = sum over all valid previous creatures p != c:
               dp[i-1][p][s - score(c, bob[i])]
```

Where `score(c, bob[i])` is the points Alice gets playing creature c against Bob's creature in round i.

For the first round (i=0), we initialize:

```
dp[0][c][score(c, bob[0]) + offset] = 1
```

for all creatures c, where offset = n (to handle negative indices).

Finally, the answer is the sum of `dp[n-1][c][s]` for all creatures c and all scores s > 0 (after adjusting for offset).

## Optimal Solution

We'll implement the DP approach with careful handling of:

1. Score offset to handle negative indices
2. The "no consecutive identical creatures" constraint
3. Modular arithmetic (since the result should be modulo 10^9+7)

<div class="code-group">

```python
MOD = 10**9 + 7

def countWinningSequences(n: int, bob: str) -> int:
    """
    Count the number of valid sequences Alice can play to beat Bob.

    Args:
        n: Number of rounds
        bob: String of length n with characters 'F', 'W', 'E'

    Returns:
        Number of winning sequences modulo 10^9+7
    """
    # Scoring rules: (Alice, Bob) -> points for Alice
    # F vs W: -1, F vs E: +2, F vs F: 0
    # W vs F: +2, W vs E: -1, W vs W: 0
    # E vs F: -1, E vs W: +2, E vs E: 0

    # Create a score lookup table
    score_map = {
        ('F', 'F'): 0, ('F', 'W'): -1, ('F', 'E'): 2,
        ('W', 'F'): 2, ('W', 'W'): 0, ('W', 'E'): -1,
        ('E', 'F'): -1, ('E', 'W'): 2, ('E', 'E'): 0
    }

    # Possible creatures
    creatures = ['F', 'W', 'E']
    creature_index = {'F': 0, 'W': 1, 'E': 2}

    # DP array: dp[round][last_creature][score]
    # Score ranges from -n to 2n, so we use offset = n to make indices non-negative
    offset = n
    score_range = 3 * n + 1  # from -n to 2n inclusive

    # Initialize DP for first round
    dp = [[[0] * score_range for _ in range(3)] for _ in range(n)]

    for c_idx, c in enumerate(creatures):
        score = score_map[(c, bob[0])]
        dp[0][c_idx][score + offset] = 1

    # Fill DP for remaining rounds
    for i in range(1, n):
        for c_idx, c in enumerate(creatures):
            # Current creature Alice plays
            current_score = score_map[(c, bob[i])]

            # Sum over all possible previous creatures that are different from current
            for p_idx, p in enumerate(creatures):
                if p == c:  # Can't play same creature twice in a row
                    continue

                # For each possible previous score
                for s in range(score_range):
                    prev_count = dp[i-1][p_idx][s]
                    if prev_count == 0:
                        continue

                    # Calculate new score
                    new_score = s + current_score
                    # Add to current DP state
                    dp[i][c_idx][new_score] = (dp[i][c_idx][new_score] + prev_count) % MOD

    # Sum all sequences ending with positive score
    result = 0
    for c_idx in range(3):
        # Only scores > 0 (in original scale, not offset)
        for s in range(offset + 1, score_range):
            result = (result + dp[n-1][c_idx][s]) % MOD

    return result
```

```javascript
const MOD = 1_000_000_007n;

function countWinningSequences(n, bob) {
  /**
   * Count the number of valid sequences Alice can play to beat Bob.
   *
   * @param {number} n - Number of rounds
   * @param {string} bob - String of length n with characters 'F', 'W', 'E'
   * @returns {number} - Number of winning sequences modulo 10^9+7
   */

  // Scoring rules: (Alice, Bob) -> points for Alice
  const scoreMap = {
    FF: 0,
    FW: -1,
    FE: 2,
    WF: 2,
    WW: 0,
    WE: -1,
    EF: -1,
    EW: 2,
    EE: 0,
  };

  // Possible creatures
  const creatures = ["F", "W", "E"];
  const creatureIndex = { F: 0, W: 1, E: 2 };

  // DP array: dp[round][last_creature][score]
  // Score ranges from -n to 2n, so we use offset = n to make indices non-negative
  const offset = n;
  const scoreRange = 3 * n + 1; // from -n to 2n inclusive

  // Initialize DP for first round
  let dp = Array(n);
  for (let i = 0; i < n; i++) {
    dp[i] = Array(3);
    for (let j = 0; j < 3; j++) {
      dp[i][j] = Array(scoreRange).fill(0n);
    }
  }

  // First round initialization
  for (let c_idx = 0; c_idx < 3; c_idx++) {
    const c = creatures[c_idx];
    const score = scoreMap[c + bob[0]];
    dp[0][c_idx][score + offset] = 1n;
  }

  // Fill DP for remaining rounds
  for (let i = 1; i < n; i++) {
    for (let c_idx = 0; c_idx < 3; c_idx++) {
      const c = creatures[c_idx];
      const currentScore = scoreMap[c + bob[i]];

      // Sum over all possible previous creatures that are different from current
      for (let p_idx = 0; p_idx < 3; p_idx++) {
        if (creatures[p_idx] === c) continue; // Can't play same creature twice

        // For each possible previous score
        for (let s = 0; s < scoreRange; s++) {
          const prevCount = dp[i - 1][p_idx][s];
          if (prevCount === 0n) continue;

          // Calculate new score
          const newScore = s + currentScore;
          // Add to current DP state
          dp[i][c_idx][newScore] = (dp[i][c_idx][newScore] + prevCount) % MOD;
        }
      }
    }
  }

  // Sum all sequences ending with positive score
  let result = 0n;
  for (let c_idx = 0; c_idx < 3; c_idx++) {
    // Only scores > 0 (in original scale, not offset)
    for (let s = offset + 1; s < scoreRange; s++) {
      result = (result + dp[n - 1][c_idx][s]) % MOD;
    }
  }

  return Number(result);
}
```

```java
class Solution {
    private static final int MOD = 1_000_000_007;

    public int countWinningSequences(int n, String bob) {
        /**
         * Count the number of valid sequences Alice can play to beat Bob.
         *
         * @param n - Number of rounds
         * @param bob - String of length n with characters 'F', 'W', 'E'
         * @return - Number of winning sequences modulo 10^9+7
         */

        // Scoring rules: (Alice, Bob) -> points for Alice
        int[][] scoreMap = new int[256][256];
        scoreMap['F']['F'] = 0; scoreMap['F']['W'] = -1; scoreMap['F']['E'] = 2;
        scoreMap['W']['F'] = 2; scoreMap['W']['W'] = 0; scoreMap['W']['E'] = -1;
        scoreMap['E']['F'] = -1; scoreMap['E']['W'] = 2; scoreMap['E']['E'] = 0;

        // Possible creatures
        char[] creatures = {'F', 'W', 'E'};

        // DP array: dp[round][last_creature][score]
        // Score ranges from -n to 2n, so we use offset = n to make indices non-negative
        int offset = n;
        int scoreRange = 3 * n + 1;  // from -n to 2n inclusive

        // Initialize DP
        int[][][] dp = new int[n][3][scoreRange];

        // First round initialization
        for (int cIdx = 0; cIdx < 3; cIdx++) {
            char c = creatures[cIdx];
            int score = scoreMap[c][bob.charAt(0)];
            dp[0][cIdx][score + offset] = 1;
        }

        // Fill DP for remaining rounds
        for (int i = 1; i < n; i++) {
            for (int cIdx = 0; cIdx < 3; cIdx++) {
                char c = creatures[cIdx];
                int currentScore = scoreMap[c][bob.charAt(i)];

                // Sum over all possible previous creatures that are different from current
                for (int pIdx = 0; pIdx < 3; pIdx++) {
                    if (creatures[pIdx] == c) continue;  // Can't play same creature twice

                    // For each possible previous score
                    for (int s = 0; s < scoreRange; s++) {
                        int prevCount = dp[i-1][pIdx][s];
                        if (prevCount == 0) continue;

                        // Calculate new score
                        int newScore = s + currentScore;
                        // Add to current DP state
                        dp[i][cIdx][newScore] = (dp[i][cIdx][newScore] + prevCount) % MOD;
                    }
                }
            }
        }

        // Sum all sequences ending with positive score
        int result = 0;
        for (int cIdx = 0; cIdx < 3; cIdx++) {
            // Only scores > 0 (in original scale, not offset)
            for (int s = offset + 1; s < scoreRange; s++) {
                result = (result + dp[n-1][cIdx][s]) % MOD;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have n rounds × 3 creatures × 3 previous creatures × (3n) possible scores
- This simplifies to O(n × 3 × 3 × 3n) = O(27n²) = O(n²)
- The inner loops over score range (3n) dominate the complexity

**Space Complexity:** O(n²)

- The DP table has dimensions n × 3 × (3n+1)
- This is O(9n²) = O(n²) space
- We could optimize to O(n) space by only storing the previous round, but the n² approach is clearer and acceptable for reasonable n

## Common Mistakes

1. **Forgetting the "no consecutive identical creatures" constraint**: This is easy to miss but crucial. Always re-read constraints before implementing.

2. **Incorrect score offset handling**: When scores can be negative, we need to map them to array indices. A common error is using the wrong offset or not accounting for all possible score values.

3. **Not using modulo arithmetic correctly**: The counts can grow very large, so we need to apply modulo 10^9+7 at each addition, not just at the end. Otherwise, we might overflow.

4. **Confusing when to check for winning condition**: We only care if the FINAL score is positive, not if it's positive at any intermediate round. A sequence could be negative early but still end positive.

## When You'll See This Pattern

This type of "count valid sequences with constraints" problem appears frequently in dynamic programming:

1. **Decode Ways (LeetCode 91)**: Count ways to decode a string with constraints on valid decodings (similar state tracking).

2. **Knight Probability in Chessboard (LeetCode 688)**: Count probability of knight remaining on board after moves (similar DP with state = position).

3. **Out of Boundary Paths (LeetCode 576)**: Count paths that move out of grid within N steps (similar DP with state = position + steps remaining).

The common pattern is: when you need to count sequences/paths with constraints and the brute force would be exponential, think about what minimal state you need to track to build solutions incrementally.

## Key Takeaways

1. **DP with multiple state dimensions** is the go-to approach for counting constrained sequences. Identify what needs to be tracked: current position, last choice, and any accumulated value that affects the final outcome.

2. **Offset indexing** is crucial when dealing with negative array indices. Always calculate the full range of possible values and map them to 0-based indices.

3. **Constraint propagation** must be checked at each transition. Here, the "no consecutive identical" constraint affects which previous states can transition to the current state.

Related problems: [Predict the Winner](/problem/predict-the-winner)
