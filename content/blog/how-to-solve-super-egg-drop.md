---
title: "How to Solve Super Egg Drop — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Super Egg Drop. Hard difficulty, 29.9% acceptance rate. Topics: Math, Binary Search, Dynamic Programming."
date: "2027-07-06"
category: "dsa-patterns"
tags: ["super-egg-drop", "math", "binary-search", "dynamic-programming", "hard"]
---

# How to Solve Super Egg Drop

You have `k` eggs and `n` floors, and you need to find the minimum number of moves required to determine the highest floor from which an egg won't break. The challenge is that eggs are limited—if they break, you lose one—so you can't just use binary search when you only have one egg left. This problem is tricky because it combines dynamic programming with an optimization that turns the problem on its head: instead of calculating moves for given eggs and floors, we calculate how many floors we can cover with given moves and eggs.

## Visual Walkthrough

Let's trace through a small example: `k = 2` eggs, `n = 6` floors.

**First move:** We need to choose a floor to drop from. If we start at floor 3:

- **Egg breaks:** Then `f` must be below 3 (floors 0, 1, or 2). We have 1 egg left and need to check 2 floors (1 and 2). This takes 2 more moves (worst case).
- **Egg doesn't break:** Then `f` is 3 or above (floors 3-6). We have 2 eggs left and 4 floors to check (3-6). We'd continue with a similar strategy.

The worst-case scenario is the maximum of these two branches plus our current move. We want to minimize this worst case across all possible starting floors.

For `k = 2, n = 6`, the optimal strategy:

1. Drop from floor 3 (as above). Worst case: 3 moves total.
2. Actually, we can do better by adjusting our starting floor. The optimal solution finds that with 2 eggs and 6 floors, we need only **3 moves** minimum.

This illustrates the trade-off: higher starting floors give more information if the egg doesn't break, but cost more moves if it breaks.

## Brute Force Approach

The brute force solution uses dynamic programming with recursion. Let `dp(k, n)` be the minimum moves needed with `k` eggs and `n` floors.

For each floor `x` from 1 to `n`, we consider dropping an egg:

- If it breaks: We have `k-1` eggs and `x-1` floors below to check → `dp(k-1, x-1)` moves
- If it doesn't break: We have `k` eggs and `n-x` floors above to check → `dp(k, n-x)` moves

We take the worst case (maximum) of these two, then add 1 for the current drop. We try all floors `x` and choose the one that minimizes this worst case:

```
dp(k, n) = 1 + min(max(dp(k-1, x-1), dp(k, n-x))) for x in 1..n
```

Base cases:

- If `n == 0`: 0 moves needed (no floors to check)
- If `k == 1`: `n` moves needed (must check each floor from bottom up)

This leads to O(k·n²) time complexity, which is far too slow for the constraints (k up to 100, n up to 10⁴).

## Optimized Approach

The key insight is to flip the problem: Instead of asking "what's the minimum moves for k eggs and n floors?", we ask "what's the maximum floors we can cover with m moves and k eggs?"

Let `dp[m][k]` = maximum floors we can determine with `m` moves and `k` eggs.

When we make a move from some floor:

- If egg breaks: We can check `dp[m-1][k-1]` floors below
- If egg doesn't break: We can check `dp[m-1][k]` floors above

So the total floors we can cover from that floor is:
`dp[m][k] = dp[m-1][k-1] + dp[m-1][k] + 1`

The `+1` accounts for the current floor we're testing.

We increase `m` until `dp[m][k] >= n`, then return `m`. This approach runs in O(k·m) time, and since `m` won't exceed `n` (even in worst case), it's much faster than the brute force.

## Optimal Solution

<div class="code-group">

```python
# Time: O(k * m) where m is the result (≤ n) | Space: O(k)
def superEggDrop(k, n):
    """
    k: number of eggs
    n: number of floors
    Returns: minimum number of moves to find critical floor
    """
    # dp[m] represents the maximum floors we can check with m moves
    # We only need O(k) space since we update in-place
    dp = [0] * (k + 1)
    moves = 0

    # Keep increasing moves until we can cover n floors
    while dp[k] < n:
        moves += 1
        # Update dp backwards to avoid overwriting previous values
        # We need dp[m-1][k-1] and dp[m-1][k] from previous iteration
        for eggs in range(k, 0, -1):
            # dp[eggs] = dp[m-1][eggs] (floors covered with m-1 moves and eggs eggs)
            # dp[eggs-1] = dp[m-1][eggs-1] (floors covered with m-1 moves and eggs-1 eggs)
            # Adding 1 for the current floor we're testing
            dp[eggs] = dp[eggs] + dp[eggs - 1] + 1

    return moves
```

```javascript
// Time: O(k * m) where m is the result (≤ n) | Space: O(k)
function superEggDrop(k, n) {
  // dp array where dp[eggs] = max floors coverable with current moves
  const dp = new Array(k + 1).fill(0);
  let moves = 0;

  // Keep trying more moves until we can cover all n floors
  while (dp[k] < n) {
    moves++;
    // Update from k down to 1 to use previous move's values
    for (let eggs = k; eggs > 0; eggs--) {
      // dp[eggs] currently holds value for m-1 moves
      // dp[eggs-1] holds value for m-1 moves with one less egg
      dp[eggs] = dp[eggs] + dp[eggs - 1] + 1;
    }
  }

  return moves;
}
```

```java
// Time: O(k * m) where m is the result (≤ n) | Space: O(k)
class Solution {
    public int superEggDrop(int k, int n) {
        // dp[eggs] = maximum floors we can check with current number of moves
        int[] dp = new int[k + 1];
        int moves = 0;

        // Continue until we can cover n floors with k eggs
        while (dp[k] < n) {
            moves++;
            // Process from k down to 1 to avoid overwriting needed values
            for (int eggs = k; eggs > 0; eggs--) {
                // dp[eggs] here is dp[m-1][eggs] from previous iteration
                // dp[eggs-1] is dp[m-1][eggs-1]
                // Add 1 for the floor we're currently testing
                dp[eggs] = dp[eggs] + dp[eggs - 1] + 1;
            }
        }

        return moves;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k × m), where m is the minimum moves needed. In the worst case, m ≤ n (when k=1), but typically m is much smaller than n. For example, with k=2 and n=100, m=14. So this is significantly faster than O(k·n²).

**Space Complexity:** O(k) since we only maintain a 1D array of size k+1, updating it in reverse order to preserve values from the previous iteration (m-1).

## Common Mistakes

1. **Using the original DP formula without optimization:** Many candidates implement the O(k·n²) DP solution, which times out for large n. Always check constraints first—here n can be 10⁴, so n² is 10⁸, which is too slow.

2. **Incorrect base cases:** Forgetting that with 0 floors we need 0 moves, or with 1 egg we need n moves (linear search). These base cases are crucial for both DP approaches.

3. **Wrong update order in the optimized solution:** When updating the dp array, we must go backwards (from k to 1). If we go forwards, we'd be using dp[eggs] from the current iteration (m moves) instead of the previous iteration (m-1 moves), which breaks the recurrence relation.

4. **Misunderstanding the problem transformation:** Some candidates struggle with the concept of switching from "moves for given floors" to "floors for given moves." Remember: we're looking for the smallest m such that we can cover n floors with k eggs.

## When You'll See This Pattern

This "reversal" pattern—changing the question from "minimum X for given Y" to "maximum Y for given X"—appears in several optimization problems:

1. **Coin Change (LeetCode 322):** Instead of "minimum coins for amount", think "maximum amount for given coins" in some variations.

2. **Capacity-based DP problems:** Like knapsack, where you might ask "maximum value for weight W" rather than "minimum weight for value V".

3. **Binary search on answer problems:** Many problems where you can check if a certain answer is feasible, then binary search for the optimal answer. Here, we're essentially doing a linear search for m, but the concept is similar.

## Key Takeaways

1. **When direct DP is too slow, consider reversing the problem.** Instead of computing what you want directly, compute what you can achieve with given resources.

2. **The egg dropping problem teaches the importance of worst-case planning.** Every decision must account for both possible outcomes (egg breaks or doesn't break).

3. **Space optimization is often possible** by recognizing that you only need values from the previous iteration. Here we reduced from O(k·m) to O(k) space by updating in reverse.

Related problems: [Egg Drop With 2 Eggs and N Floors](/problem/egg-drop-with-2-eggs-and-n-floors)
