---
title: "Dynamic Programming Questions at PayPal: What to Expect"
description: "Prepare for Dynamic Programming interview questions at PayPal — patterns, difficulty breakdown, and study tips."
date: "2028-05-10"
category: "dsa-patterns"
tags: ["paypal", "dynamic-programming", "interview prep"]
---

Dynamic Programming at PayPal isn't just another algorithm topic to check off—it's a critical filter. With 19 DP questions in their known problem set of 106, that's roughly 18% of their technical question bank. In my experience conducting and analyzing interviews, DP questions at PayPal serve a specific purpose: they test a candidate's ability to model complex, stateful business logic—like calculating optimal transaction fees, minimizing risk in fraud detection pathways, or allocating resources in a financial system—into a clean, efficient computational solution. You won't get DP in every interview, but when you do, it's often in the second or third round with a senior engineer, and it's used to separate the strong candidates from the exceptional ones. The difficulty tends to be medium to hard; they're less interested in you memorizing "Minimum Path Sum" and more interested in seeing you _derive_ a DP solution for a problem you've likely never seen before.

## Specific Patterns PayPal Favors

PayPal's DP questions heavily favor **iterative, bottom-up tabulation** over recursive memoization. This mirrors real-world financial systems where stack depth is a concern and iterative loops are more performant and debuggable. The patterns cluster around a few core areas:

1.  **Classic 1D/2D Sequence DP:** Problems like "Decode Ways" (#91) or "Longest Increasing Subsequence" (#300) are common because they model parsing financial messages or finding optimal transaction sequences.
2.  **Knapsack & Subset Problems:** Given PayPal's core business of moving money, problems about partitioning sums or making selections with constraints are highly relevant. Think "Partition Equal Subset Sum" (#416) or "Coin Change" (#322).
3.  **String & Interleaving DP:** Questions like "Interleaving String" (#97) or "Edit Distance" (#72) test your ability to handle complex state transitions between two sequences—analogous to reconciling two data streams or payment ledgers.

You'll notice a distinct _lack_ of highly abstract graph DP (like "Cherry Pickup" (#741)) or exotic DP on trees. Their problems are grounded and often have a clear analogy to a financial domain.

## How to Prepare

The key is to master the framework, not just the problems. For any DP problem, your thought process should be: 1) Define the state (`dp[i]` or `dp[i][j]` means what?), 2) Define the base case (the smallest, trivial answer), 3) Define the transition (how does state `i` relate to state `i-1` or `i-k`?), and 4) Determine the iteration order.

Let's look at the most fundamental pattern: **1D Sequence DP**, as seen in "Climbing Stairs" (#70). The state `dp[i]` represents the number of ways to reach step `i`.

<div class="code-group">

```python
def climbStairs(n: int) -> int:
    # dp[i] = number of ways to reach step i
    # Base cases: 1 way to be at step 0 (do nothing), 1 way to reach step 1 (single step)
    if n <= 1:
        return 1

    # Initialize DP array. We only need the last two states, so space can be optimized to O(1).
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1

    # Transition: To get to step i, you came from either step i-1 or step i-2.
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]
# Time: O(n) | Space: O(n) [Optimizable to O(1)]
```

```javascript
function climbStairs(n) {
  if (n <= 1) return 1;

  let dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}
// Time: O(n) | Space: O(n)
```

```java
public int climbStairs(int n) {
    if (n <= 1) return 1;

    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}
// Time: O(n) | Space: O(n)
```

</div>

The next pattern to internalize is the **0/1 Knapsack** pattern, which is the engine behind "Partition Equal Subset Sum" (#416). Here, `dp[i][j]` (or a 1D array `dp[j]`) asks: "Can we make sum `j` using the first `i` items?"

<div class="code-group">

```python
def canPartition(nums: List[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[j] = Can we make sum j using the numbers considered so far?
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum of 0 is always possible (choose no numbers)

    for num in nums:
        # Iterate backwards to avoid re-using the same number in this iteration
        for j in range(target, num - 1, -1):
            if dp[j - num]:  # If we could make sum (j - num) before, we can make sum j now by adding num
                dp[j] = True
        if dp[target]:  # Early exit
            return True
    return dp[target]
# Time: O(n * target) | Space: O(target)
```

```javascript
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let j = target; j >= num; j--) {
      if (dp[j - num]) {
        dp[j] = true;
      }
    }
    if (dp[target]) return true;
  }
  return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

```java
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;
    if (total % 2 != 0) return false;
    int target = total / 2;

    boolean[] dp = new boolean[target + 1];
    dp[0] = true;

    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            if (dp[j - num]) {
                dp[j] = true;
            }
        }
        if (dp[target]) return true;
    }
    return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

</div>

## How PayPal Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, PayPal's DP questions are less about algorithmic cleverness for its own sake and more about **applied modeling**. At Google or Meta, you might get a DP problem on an alien dictionary or a game theory puzzle. At PayPal, the problem statement, while abstracted, will often _feel_ like it could be part of a payment routing or risk assessment system. The difficulty is on par with Amazon but often requires cleaner code because the interviewer is evaluating if your solution would be maintainable in a production financial service.

What's unique is the follow-up. At PayPal, after you code the solution, be prepared for a **scalability discussion**. "What if the `target` sum is in the billions?" (Discuss optimization or approximation.) "How would this function behave in a distributed system?" (Talk about state and idempotency.) They are testing your engineer mindset, not just your competitor mindset.

## Study Order

Tackle DP in this logical sequence to build a compounding understanding:

1.  **Foundation (1D Sequence):** Start with "Climbing Stairs" (#70) and "House Robber" (#198). This teaches you state definition and simple transitions.
2.  **String & 2D DP:** Move to "Longest Common Subsequence" (#1143) and "Edit Distance" (#72). This is crucial for PayPal-style sequence matching problems.
3.  **Knapsack Fundamentals:** Learn the classic 0/1 Knapsack pattern via "Partition Equal Subset Sum" (#416) and "Target Sum" (#494). This is arguably the most important pattern for PayPal.
4.  **Unbounded Knapsack & Coin Change:** Understand the variation where items can be reused, as in "Coin Change" (#322) and "Coin Change 2" (#518).
5.  **Interval & State Machine DP:** Finally, tackle harder problems like "Best Time to Buy and Sell Stock with Cooldown" (#309), which models multi-state financial decisions.

## Recommended Practice Order

Solve these PayPal-relevant problems in sequence. Each builds on the previous pattern.

1.  Climbing Stairs (#70) - 1D Sequence
2.  House Robber (#198) - 1D Sequence with a skip
3.  Longest Increasing Subsequence (#300) - 1D Sequence with nested search
4.  Decode Ways (#91) - 1D Sequence with conditionals
5.  Partition Equal Subset Sum (#416) - 0/1 Knapsack
6.  Target Sum (#494) - 0/1 Knapsack variation (convert to subset sum)
7.  Coin Change (#322) - Unbounded Knapsack (minimization)
8.  Coin Change 2 (#518) - Unbounded Knapsack (counting)
9.  Longest Common Subsequence (#1143) - Classic 2D String DP
10. Edit Distance (#72) - 2D String DP with operations
11. Interleaving String (#97) - 2D String DP with a twist
12. Best Time to Buy and Sell Stock with Cooldown (#309) - State Machine DP

Mastering this progression will give you the toolkit and, more importantly, the flexible problem-solving approach needed to tackle the dynamic programming questions you'll encounter in a PayPal interview.

[Practice Dynamic Programming at PayPal](/company/paypal/dynamic-programming)
