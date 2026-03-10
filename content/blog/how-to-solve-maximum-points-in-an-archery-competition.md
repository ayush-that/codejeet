---
title: "How to Solve Maximum Points in an Archery Competition — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Points in an Archery Competition. Medium difficulty, 51.4% acceptance rate. Topics: Array, Backtracking, Bit Manipulation, Enumeration."
date: "2029-11-23"
category: "dsa-patterns"
tags:
  [
    "maximum-points-in-an-archery-competition",
    "array",
    "backtracking",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Maximum Points in an Archery Competition

This problem presents a strategic game where Alice shoots first with a fixed number of arrows, then Bob shoots with the same number. The twist is that Bob wins any section where he has more arrows than Alice, otherwise Alice wins it. The challenge is finding how Alice should allocate her arrows to maximize her total points, knowing Bob will respond optimally to minimize her score. What makes this tricky is that Alice's decision affects which sections Bob can win, creating an interdependent optimization problem.

## Visual Walkthrough

Let's trace through a small example: `aliceArrows = [1,1,0,1,0,0,0,0,0,0,0,0]` and `numArrows = 3`.

Alice has 3 arrows to distribute across 12 sections (0-11). Her current allocation is shown in `aliceArrows`. Bob will get 3 arrows after Alice.

**Step 1: Understanding the scoring**

- For each section k (0-11), if Bob shoots more arrows than Alice in that section, Bob gets k points
- Otherwise, Alice gets k points
- If both have 0 arrows in a section, nobody gets points

**Step 2: Current situation without extra arrows**
Alice's current points:

- Section 0: Alice has 1, Bob has 0 → Alice gets 0 points (section 0 worth 0 points)
- Section 1: Alice has 1, Bob has 0 → Alice gets 1 point
- Section 3: Alice has 1, Bob has 0 → Alice gets 3 points
  Total: 4 points

**Step 3: Alice's strategic thinking**
Alice can add her 3 extra arrows to any sections. She wants to:

1. Win high-value sections (sections with large k values)
2. Prevent Bob from winning sections by having at least 1 more arrow than Bob could shoot

Bob will try to win sections where Alice has few arrows. Since Bob has 3 arrows total, he can put at most 3 arrows in any single section.

**Step 4: Trying a strategy**
If Alice puts all 3 arrows in section 11:

- Section 11: Alice has 3, Bob has at most 3 → Alice wins (gets 11 points)
- But Bob can now win sections 1 and 3 (worth 1+3=4 points)
  Alice total: 0+0+0+0+0+0+0+0+0+0+0+11 = 11 points

If Alice puts 2 arrows in section 11 and 1 in section 10:

- Section 11: Alice has 2, Bob could put 3 → Bob wins (gets 11 points)
- Section 10: Alice has 1, Bob could put 3 → Bob wins (gets 10 points)
  This is worse!

**Step 5: The key insight**
Alice needs to win a section by having **at least Bob's maximum possible arrows + 1** in that section. Since Bob has 3 total arrows, to guarantee winning section k, Alice needs at least 4 arrows in that section (but she only has 3 total!).

So Alice cannot guarantee winning any section against Bob's optimal play. Her best strategy is to focus on sections where she already has arrows, or where adding arrows doesn't help Bob much.

This example shows why we need a systematic approach: we must consider all possible allocations and calculate Bob's optimal response for each.

## Brute Force Approach

The brute force approach would consider every possible way Alice could distribute her `numArrows` across 12 sections. Each section could receive 0 to `numArrows` arrows, but the total must equal `numArrows`.

For each allocation:

1. Calculate how many arrows Bob would need to win each section (Alice's arrows + 1, but limited by his total arrows)
2. Bob optimally allocates his arrows to maximize his points (minimize Alice's points)
3. Calculate Alice's total points
4. Track the maximum

The number of possible allocations is huge: distributing `n` identical arrows into 12 sections is combinations with repetition: C(n+11, 11). For n=10, that's ~352,716 possibilities. For each, we need to solve Bob's optimization problem. This is clearly infeasible.

A naive candidate might try greedy approaches:

- Always put arrows in the highest-value section
- Put arrows where Alice already has some
  But these fail because they don't consider Bob's optimal response.

## Optimized Approach

The key insight is that **Bob's optimal strategy is simple**: for each section, if he can win it (has enough arrows to exceed Alice's count), he will allocate exactly `aliceArrows[k] + 1` arrows to that section, gaining k points. He'll prioritize higher-value sections first since each gives him more points.

This means we can think backwards: for any section k, if Alice wants to win it, she must make it too expensive for Bob to win. Specifically, she needs to put enough arrows in section k so that Bob would need more than his total arrows to win it.

**Step-by-step reasoning:**

1. For each section k from 11 down to 0 (highest to lowest value):
   - Bob needs `aliceArrows[k] + 1` arrows to win section k
   - If Bob has enough remaining arrows, he'll take section k
   - Otherwise, Alice wins section k by default
2. Alice's decision: she can invest extra arrows in a section to make it too expensive for Bob
   - To prevent Bob from winning section k, Alice needs to make the cost > Bob's remaining arrows
   - She can do this by adding arrows to section k
3. This becomes a knapsack-like problem: Alice has `numArrows` arrows to invest across sections. Investing in section k costs some arrows but gains k points if it prevents Bob from winning it.

4. We can solve this with dynamic programming or backtracking:
   - Try allocating 0 to `numArrows` arrows to each section
   - Track maximum points achievable with remaining arrows
   - Since there are only 12 sections, backtracking is feasible

5. Optimization: Bob's arrow allocation is deterministic once we know Alice's allocation, so we can compute the score efficiently.

## Optimal Solution

We'll use backtracking with memoization. At each section (starting from highest value), we decide how many extra arrows (0 to available) to allocate to this section, then recursively solve for remaining sections.

<div class="code-group">

```python
# Time: O(12 * numArrows) = O(numArrows) since 12 is constant
# Space: O(12 * numArrows) for memoization
class Solution:
    def maximumBobPoints(self, numArrows: int, aliceArrows: List[int]) -> List[int]:
        n = 12  # sections 0-11

        # Memoization dictionary: (index, remaining_arrows) -> (max_score, allocation_list)
        memo = {}

        def dfs(idx, remaining_arrows):
            """Return (max_score, bob_allocation) for sections idx..11 with remaining_arrows"""
            # Base case: no more sections
            if idx == n:
                return 0, [0] * n

            # Check memo
            if (idx, remaining_arrows) in memo:
                return memo[(idx, remaining_arrows)]

            # Option 1: Don't win this section (allocate 0 arrows)
            # Bob will win if he has enough arrows to beat Alice
            bob_needs = aliceArrows[idx] + 1
            score1, alloc1 = dfs(idx + 1, remaining_arrows)
            # If Bob can win this section (has enough total arrows), he gets the points
            # We don't know Bob's exact allocation yet, but we know if he CAN win it
            # Actually, we need to check if Bob WOULD win it given optimal play
            # This is tricky: we need to simulate Bob's decision

            # Better approach: Try to win the section by allocating enough arrows
            max_score = score1
            best_alloc = alloc1.copy()

            # Option 2: Try to win this section by allocating enough arrows
            # To win, we need at least aliceArrows[idx] + 1 arrows in this section
            # But we can allocate more if we want
            min_to_win = aliceArrows[idx] + 1
            for arrows in range(min_to_win, remaining_arrows + 1):
                score2, alloc2 = dfs(idx + 1, remaining_arrows - arrows)
                total_score = idx + score2  # Add points for winning this section
                if total_score > max_score:
                    max_score = total_score
                    best_alloc = [0] * n
                    best_alloc[idx] = arrows
                    for i in range(n):
                        if i != idx:
                            best_alloc[i] = alloc2[i]

            # Also consider allocating arrows but not necessarily winning
            # (though this is usually suboptimal for scoring)
            for arrows in range(1, min(min_to_win, remaining_arrows + 1)):
                score2, alloc2 = dfs(idx + 1, remaining_arrows - arrows)
                if score2 > max_score:  # Not adding idx points since we don't win
                    max_score = score2
                    best_alloc = [0] * n
                    best_alloc[idx] = arrows
                    for i in range(n):
                        if i != idx:
                            best_alloc[i] = alloc2[i]

            memo[(idx, remaining_arrows)] = (max_score, best_alloc)
            return max_score, best_alloc

        # Start from highest value section (11) down to 0
        # We'll process in reverse to prioritize high-value sections
        max_score, result = dfs(0, numArrows)

        # Convert to required format: Bob's total arrows in each section
        # result already has the allocation
        return result
```

```javascript
// Time: O(12 * numArrows) = O(numArrows) since 12 is constant
// Space: O(12 * numArrows) for memoization
/**
 * @param {number} numArrows
 * @param {number[]} aliceArrows
 * @return {number[]}
 */
var maximumBobPoints = function (numArrows, aliceArrows) {
  const n = 12; // sections 0-11

  // Memoization map: key = `${idx},${remainingArrows}`, value = {score, allocation}
  const memo = new Map();

  function dfs(idx, remainingArrows) {
    // Base case: no more sections
    if (idx === n) {
      return { score: 0, allocation: new Array(n).fill(0) };
    }

    // Check memo
    const key = `${idx},${remainingArrows}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Option 1: Don't win this section (allocate 0 arrows)
    let best = dfs(idx + 1, remainingArrows);
    let maxScore = best.score;
    let bestAlloc = [...best.allocation];

    // Option 2: Try to win this section
    const minToWin = aliceArrows[idx] + 1;

    // Try allocating enough arrows to win
    for (let arrows = minToWin; arrows <= remainingArrows; arrows++) {
      const next = dfs(idx + 1, remainingArrows - arrows);
      const totalScore = idx + next.score;
      if (totalScore > maxScore) {
        maxScore = totalScore;
        bestAlloc = new Array(n).fill(0);
        bestAlloc[idx] = arrows;
        for (let i = 0; i < n; i++) {
          if (i !== idx) bestAlloc[i] = next.allocation[i];
        }
      }
    }

    // Try allocating some arrows but not enough to win
    // (usually not optimal but we need to consider all possibilities)
    for (let arrows = 1; arrows < Math.min(minToWin, remainingArrows + 1); arrows++) {
      const next = dfs(idx + 1, remainingArrows - arrows);
      if (next.score > maxScore) {
        maxScore = next.score;
        bestAlloc = new Array(n).fill(0);
        bestAlloc[idx] = arrows;
        for (let i = 0; i < n; i++) {
          if (i !== idx) bestAlloc[i] = next.allocation[i];
        }
      }
    }

    const result = { score: maxScore, allocation: bestAlloc };
    memo.set(key, result);
    return result;
  }

  const { allocation } = dfs(0, numArrows);
  return allocation;
};
```

```java
// Time: O(12 * numArrows) = O(numArrows) since 12 is constant
// Space: O(12 * numArrows) for memoization
class Solution {
    public int[] maximumBobPoints(int numArrows, int[] aliceArrows) {
        int n = 12; // sections 0-11

        // Memoization array: dp[idx][remainingArrows] = Result
        // Use -1 for score to indicate not computed
        Result[][] memo = new Result[n + 1][numArrows + 1];

        Result result = dfs(0, numArrows, aliceArrows, n, memo);
        return result.allocation;
    }

    class Result {
        int score;
        int[] allocation;

        Result(int score, int[] allocation) {
            this.score = score;
            this.allocation = allocation;
        }
    }

    private Result dfs(int idx, int remainingArrows, int[] aliceArrows, int n, Result[][] memo) {
        // Base case: no more sections
        if (idx == n) {
            return new Result(0, new int[n]);
        }

        // Check memo
        if (memo[idx][remainingArrows] != null) {
            return memo[idx][remainingArrows];
        }

        // Option 1: Don't win this section (allocate 0 arrows)
        Result best = dfs(idx + 1, remainingArrows, aliceArrows, n, memo);
        int maxScore = best.score;
        int[] bestAlloc = best.allocation.clone();

        // Option 2: Try to win this section
        int minToWin = aliceArrows[idx] + 1;

        // Try allocating enough arrows to win
        for (int arrows = minToWin; arrows <= remainingArrows; arrows++) {
            Result next = dfs(idx + 1, remainingArrows - arrows, aliceArrows, n, memo);
            int totalScore = idx + next.score;
            if (totalScore > maxScore) {
                maxScore = totalScore;
                bestAlloc = new int[n];
                bestAlloc[idx] = arrows;
                for (int i = 0; i < n; i++) {
                    if (i != idx) bestAlloc[i] = next.allocation[i];
                }
            }
        }

        // Try allocating some arrows but not enough to win
        for (int arrows = 1; arrows < Math.min(minToWin, remainingArrows + 1); arrows++) {
            Result next = dfs(idx + 1, remainingArrows - arrows, aliceArrows, n, memo);
            if (next.score > maxScore) {
                maxScore = next.score;
                bestAlloc = new int[n];
                bestAlloc[idx] = arrows;
                for (int i = 0; i < n; i++) {
                    if (i != idx) bestAlloc[i] = next.allocation[i];
                }
            }
        }

        Result result = new Result(maxScore, bestAlloc);
        memo[idx][remainingArrows] = result;
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(12 × numArrows) = O(numArrows)

- We have 12 sections (constant)
- For each state (idx, remainingArrows), we compute the result once
- There are 12 × (numArrows + 1) possible states
- Each state computation involves iterating through possible arrow allocations for that section

**Space Complexity:** O(12 × numArrows) = O(numArrows)

- Memoization table stores results for each state
- Each result stores an allocation array of size 12
- Recursion depth is at most 12

The 12 is constant, so we effectively have linear time and space in terms of numArrows.

## Common Mistakes

1. **Assuming Bob will allocate arrows evenly or randomly**: Bob plays optimally to maximize his points (minimize Alice's). He'll always prioritize higher-value sections first. Candidates who don't model Bob's optimal response will get wrong results.

2. **Forgetting that unused arrows can be placed anywhere**: The problem allows placing any unused arrows in section 0 (which is worth 0 points) without affecting the score. Some candidates try to use all arrows meaningfully, which isn't required.

3. **Greedy approach fails**: Trying to always put arrows in the highest-value section or always in sections where Alice already has arrows doesn't work. You need to consider the trade-off: investing many arrows to win a high-value section might leave you unable to win multiple medium-value sections.

4. **Not considering that Bob has the same total arrows**: Bob has `numArrows` just like Alice. Some candidates mistakenly think Bob has unlimited arrows or a different number.

## When You'll See This Pattern

This problem combines **game theory** with **constrained optimization**, similar to:

1. **"Predict the Winner" (LeetCode 486)**: Both involve two players taking turns or making moves to maximize their scores, with one player's decision affecting the other's options.

2. **"Stone Game" (LeetCode 877)**: Another game theory problem where players take from either end of an array, trying to maximize their score.

3. **"Maximum Product of the Length of Two Palindromic Subsequences" (LeetCode 2002)**: Similar in that you're partitioning resources (characters) between two competing entities to maximize a score product.

The core pattern is **adversarial optimization**: you make decisions knowing an opponent will respond optimally to counter you. This often requires thinking backwards from the end state or using minimax algorithms.

## Key Takeaways

1. **In adversarial games, think backwards**: Consider what your opponent will do in response to your move. Model their optimal strategy as part of your decision-making.

2. **Small search spaces allow brute force**: With only 12 sections, we can use backtracking or DP even though the problem seems complex. Always check constraint sizes before ruling out exhaustive search.

3. **Memoization transforms exponential to polynomial**: Without memoization, our backtracking would be O(numArrows^12). With memoization, it becomes O(12 × numArrows).

Related problems: [Maximum Product of the Length of Two Palindromic Subsequences](/problem/maximum-product-of-the-length-of-two-palindromic-subsequences)
