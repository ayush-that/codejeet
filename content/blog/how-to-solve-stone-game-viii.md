---
title: "How to Solve Stone Game VIII — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stone Game VIII. Hard difficulty, 53.9% acceptance rate. Topics: Array, Math, Dynamic Programming, Prefix Sum, Game Theory."
date: "2026-03-28"
category: "dsa-patterns"
tags: ["stone-game-viii", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Stone Game VIII

Stone Game VIII is a challenging game theory problem that combines prefix sums with dynamic programming. What makes it tricky is that players don't just take stones—they take prefixes of the array, and the score they gain is the sum of all remaining stones after their move. This creates a complex scoring system where each move affects future scoring opportunities.

## Visual Walkthrough

Let's trace through a small example: `stones = [2, 7, 11, 15]`

First, we calculate prefix sums:

- `prefix[0] = 2`
- `prefix[1] = 2 + 7 = 9`
- `prefix[2] = 9 + 11 = 20`
- `prefix[3] = 20 + 15 = 35`

**Gameplay:**

1. **Alice's turn** (stones = [2, 7, 11, 15])
   - She can choose x = 2, 3, or 4 (must leave at least 1 stone)
   - If she chooses x = 2: Removes [2, 7], remaining stones = [11, 15]
   - Her score = sum of remaining stones = 11 + 15 = 26
   - New array: [11, 15]

2. **Bob's turn** (stones = [11, 15])
   - He can only choose x = 2 (must leave at least 1 stone)
   - Removes [11, 15], remaining stones = []
   - His score = sum of remaining stones = 0
   - Game ends

Final score: Alice = 26, Bob = 0 → Alice wins by 26

But Alice could have made different choices. The optimal strategy requires thinking ahead about how each move affects future scoring opportunities.

## Brute Force Approach

A naive approach would try to simulate all possible game sequences. At each turn with `k` stones remaining, a player can choose any `x` from 2 to `k`. We could use recursion to explore all possibilities:

```
function maxScoreDifference(stones, currentPlayer):
    if only 1 stone left: return 0 (game ends)

    bestScore = -infinity if currentPlayer is Alice else +infinity

    for x from 2 to number of stones:
        remove first x stones
        currentScore = sum of remaining stones
        nextScore = maxScoreDifference(remainingStones, nextPlayer)

        if currentPlayer is Alice:
            totalScore = currentScore + nextScore
            bestScore = max(bestScore, totalScore)
        else:
            totalScore = currentScore + nextScore
            bestScore = min(bestScore, totalScore)

    return bestScore
```

**Why this fails:**

- Time complexity: O(n!) since at each step we branch into multiple possibilities
- For n = 1000 (problem constraints), this is computationally impossible
- We're recalculating the same subproblems repeatedly

## Optimized Approach

The key insight is that we don't need to track the actual stone values—we only need the prefix sums. When a player removes the first `x` stones, their score is `prefix[n-1] - prefix[x-1]` (total sum minus sum of removed stones).

**Step-by-step reasoning:**

1. **Prefix sums are crucial**: Let `prefix[i]` = sum of first `i+1` stones. The total sum is `prefix[n-1]`.

2. **State representation**: Let `dp[i]` = maximum score difference (Alice - Bob) when the game starts with stones from index `i` to the end, and it's Alice's turn.

3. **Base case**: When only 1 stone remains (`i = n-1`), the game ends, so `dp[n-1] = 0`.

4. **Transition**: If we're at position `i` and Alice chooses to take stones up to index `j` (where `j ≥ i+1` since x > 1):
   - Alice's immediate score = `prefix[n-1] - prefix[j]` (sum of remaining stones)
   - Then it's Bob's turn starting from index `j+1`, so the score difference from that point onward = `-dp[j+1]` (negative because it's Bob's advantage)
   - Total score difference = `(prefix[n-1] - prefix[j]) - dp[j+1]`
   - Alice will choose the `j` that maximizes this

5. **Optimization**: Instead of checking all `j` for each `i`, we notice that:
   - `dp[i] = max(prefix[n-1] - prefix[j] - dp[j+1])` for all `j ≥ i`
   - We can compute this efficiently by tracking the maximum value as we iterate backward

6. **Final answer**: The game starts with all stones, so answer = `dp[0]`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def stoneGameVIII(stones):
    """
    Calculate the maximum score difference (Alice - Bob) when both play optimally.

    Args:
        stones: List of stone values

    Returns:
        Maximum score difference (Alice - Bob)
    """
    n = len(stones)

    # Step 1: Calculate prefix sums
    # prefix[i] = sum of stones[0] to stones[i]
    prefix = [0] * n
    prefix[0] = stones[0]
    for i in range(1, n):
        prefix[i] = prefix[i-1] + stones[i]

    # Step 2: Initialize DP array
    # dp[i] = max score difference when game starts at index i (Alice's turn)
    dp = [0] * n

    # Base case: when only 1 stone remains (index n-1), game ends
    dp[n-1] = 0

    # Step 3: Track the maximum value for efficient computation
    # We want max(prefix[n-1] - prefix[j] - dp[j+1]) for j >= i
    # As we iterate backward, we can track the maximum value
    max_val = prefix[n-1] - prefix[n-2] - dp[n-1]  # Initialize with j = n-2

    # Step 4: Fill DP array from right to left
    for i in range(n-2, -1, -1):
        # Option 1: Take all stones from i to the end (if i < n-1)
        # This corresponds to x = n-i, score = 0 (no stones left)
        # But we must leave at least 1 stone, so this is only valid if i < n-1

        # Option 2: The best of all choices from previous computation
        dp[i] = max_val

        # Update max_val for next iteration (i-1)
        if i > 0:  # We need at least 2 stones to make a move
            # For the next i (which will be i-1), we need to consider
            # taking stones up to index i (current i becomes j in next iteration)
            current_option = prefix[n-1] - prefix[i-1] - dp[i]
            max_val = max(max_val, current_option)

    return dp[0]
```

```javascript
// Time: O(n) | Space: O(n)
function stoneGameVIII(stones) {
  /**
   * Calculate the maximum score difference (Alice - Bob) when both play optimally.
   *
   * @param {number[]} stones - Array of stone values
   * @return {number} Maximum score difference (Alice - Bob)
   */
  const n = stones.length;

  // Step 1: Calculate prefix sums
  // prefix[i] = sum of stones[0] to stones[i]
  const prefix = new Array(n);
  prefix[0] = stones[0];
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] + stones[i];
  }

  // Step 2: Initialize DP array
  // dp[i] = max score difference when game starts at index i (Alice's turn)
  const dp = new Array(n);

  // Base case: when only 1 stone remains (index n-1), game ends
  dp[n - 1] = 0;

  // Step 3: Track the maximum value for efficient computation
  // We want max(prefix[n-1] - prefix[j] - dp[j+1]) for j >= i
  // As we iterate backward, we can track the maximum value
  let maxVal = prefix[n - 1] - prefix[n - 2] - dp[n - 1]; // Initialize with j = n-2

  // Step 4: Fill DP array from right to left
  for (let i = n - 2; i >= 0; i--) {
    // dp[i] is the maximum of all options where we take stones up to some j >= i
    dp[i] = maxVal;

    // Update maxVal for next iteration (i-1)
    if (i > 0) {
      // We need at least 2 stones to make a move
      // For the next i (which will be i-1), we need to consider
      // taking stones up to index i (current i becomes j in next iteration)
      const currentOption = prefix[n - 1] - prefix[i - 1] - dp[i];
      maxVal = Math.max(maxVal, currentOption);
    }
  }

  return dp[0];
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int stoneGameVIII(int[] stones) {
        /**
         * Calculate the maximum score difference (Alice - Bob) when both play optimally.
         *
         * @param stones Array of stone values
         * @return Maximum score difference (Alice - Bob)
         */
        int n = stones.length;

        // Step 1: Calculate prefix sums
        // prefix[i] = sum of stones[0] to stones[i]
        int[] prefix = new int[n];
        prefix[0] = stones[0];
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i-1] + stones[i];
        }

        // Step 2: Initialize DP array
        // dp[i] = max score difference when game starts at index i (Alice's turn)
        int[] dp = new int[n];

        // Base case: when only 1 stone remains (index n-1), game ends
        dp[n-1] = 0;

        // Step 3: Track the maximum value for efficient computation
        // We want max(prefix[n-1] - prefix[j] - dp[j+1]) for j >= i
        // As we iterate backward, we can track the maximum value
        int maxVal = prefix[n-1] - prefix[n-2] - dp[n-1]; // Initialize with j = n-2

        // Step 4: Fill DP array from right to left
        for (int i = n-2; i >= 0; i--) {
            // dp[i] is the maximum of all options where we take stones up to some j >= i
            dp[i] = maxVal;

            // Update maxVal for next iteration (i-1)
            if (i > 0) { // We need at least 2 stones to make a move
                // For the next i (which will be i-1), we need to consider
                // taking stones up to index i (current i becomes j in next iteration)
                int currentOption = prefix[n-1] - prefix[i-1] - dp[i];
                maxVal = Math.max(maxVal, currentOption);
            }
        }

        return dp[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass to calculate prefix sums: O(n)
- We make one backward pass to fill the DP array: O(n)
- Each iteration does constant work (comparisons and arithmetic)

**Space Complexity: O(n)**

- We store the prefix array of size n: O(n)
- We store the DP array of size n: O(n)
- We could optimize to O(1) extra space by reusing arrays, but O(n) is acceptable for clarity

## Common Mistakes

1. **Forgetting the "x > 1" constraint**: Some candidates allow taking just 1 stone, which violates the rules. Always remember the player must take at least 2 stones.

2. **Incorrect base case**: The game ends when only 1 stone remains, not when no stones remain. The last move takes all remaining stones except one.

3. **Wrong score calculation**: When a player takes the first x stones, their score is the sum of the REMAINING stones, not the stones they took. This is a common misunderstanding.

4. **Not using prefix sums efficiently**: Some candidates recalculate sums repeatedly, leading to O(n²) or worse time complexity. Prefix sums are essential for O(n) solution.

5. **Confusing whose turn it is**: In the DP transition, remember that when Alice makes a move, the subsequent game has Bob as the first player, so we subtract `dp[j+1]` (not add).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix Sums + DP**: Problems where you need efficient range sum queries often use prefix sums. When combined with game theory DP, you get problems like:
   - [Stone Game II](https://leetcode.com/problems/stone-game-ii/) - Similar prefix sum usage with different move constraints
   - [Stone Game III](https://leetcode.com/problems/stone-game-iii/) - Also uses prefix sums and backward DP

2. **Game Theory with Optimal Play**: Problems where two players alternate moves and both play optimally:
   - [Predict the Winner](https://leetcode.com/problems/predict-the-winner/) - Similar DP structure for optimal play
   - [Can I Win](https://leetcode.com/problems/can-i-win/) - Different constraints but similar optimal play reasoning

3. **Backward DP Computation**: When the optimal decision depends on future states, we often compute DP backward:
   - [Jump Game II](https://leetcode.com/problems/jump-game-ii/) - Also uses backward or forward DP with optimization
   - [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) - Classic DP solved both forward and backward

## Key Takeaways

1. **Prefix sums transform range queries into O(1) operations**: When you need to calculate sums of subarrays repeatedly, prefix sums are your best friend.

2. **Game theory DP often works backward**: Start from the end state and work backward to determine optimal play at each position.

3. **In two-player zero-sum games, the score difference is what matters**: We track Alice's score minus Bob's score, and each player tries to maximize this from their perspective (Alice maximizes, Bob minimizes, which is equivalent to maximizing the negative).

4. **Look for optimization opportunities in transitions**: The O(n²) to O(n) optimization came from recognizing that we could track the maximum value as we iterate, rather than recomputing it each time.

Related problems: [Stone Game](/problem/stone-game), [Stone Game II](/problem/stone-game-ii), [Stone Game III](/problem/stone-game-iii)
