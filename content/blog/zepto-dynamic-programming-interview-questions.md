---
title: "Dynamic Programming Questions at Zepto: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-11-26"
category: "dsa-patterns"
tags: ["zepto", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Zepto isn't just another topic on a checklist; it's a critical filter. With 5 out of their 28 tagged problems being DP, that's nearly 18% of their curated question bank. In practice, this means you have a very high probability of encountering at least one medium-to-hard DP problem in your interview loop. Why such a focus? Zepto operates in the hyper-competitive quick-commerce space where operational efficiency—optimizing delivery routes, warehouse inventory allocation, and real-time pricing—is the core business. These are, at their heart, optimization problems. Dynamic Programming is the quintessential framework for solving optimization problems with overlapping subproblems and optimal substructure. An interviewer at Zepto isn't just testing if you can memorize solutions; they're assessing if you can model a complex, constrained real-world scenario into a solvable DP state. Failing to demonstrate mastery here is often a direct rejection.

## Specific Patterns Zepto Favors

Zepto's DP questions skew heavily towards **one-dimensional and two-dimensional iterative (bottom-up) DP** with clear real-world analogs. You won't find many esoteric combinatorial or game theory DP problems here. Instead, expect problems centered on **sequence manipulation** and **resource allocation**.

The dominant pattern is the **"Classic Knapsack"** and its variants. This directly mirrors logistics problems: a delivery vehicle (capacity) must carry the most valuable set of orders (items). Problems like **Partition Equal Subset Sum (#416)** and **Target Sum (#494)** are classic tests of translating a problem into a subset-sum knapsack framework.

The second most common pattern is **"String DP"** involving edit distance or subsequence matching. Think of validating or correcting order codes, or matching user queries to product names. **Edit Distance (#72)** is a prime example. Zepto's versions often add a twist, like a specific cost function for insert/delete/replace operations relevant to their domain.

You will rarely see pure recursive (top-down with memoization) solutions presented as the final answer. Interviewers expect you to reason towards the more space-efficient iterative, bottom-up tabulation. They want to see you build the DP table from the ground up, demonstrating a clear understanding of state transition.

## How to Prepare

Your study must move from pattern recognition to state definition. Start every DP problem by asking: "What is the _state_ I need to keep?" and "What is the _transition_ between states?"

For the Knapsack pattern, the state is almost always `dp[i][c]` representing the maximum value or boolean feasibility considering the first `i` items and a capacity `c`. The transition is the core decision: include the item or not.

Let's look at the bottom-up solution for **Partition Equal Subset Sum (#416)**. The problem reduces to: is there a subset of numbers that sums to `total_sum / 2`?

<div class="code-group">

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    # dp[c] = True if sum 'c' is achievable
    dp = [False] * (target + 1)
    dp[0] = True  # base case: sum of 0 is always achievable

    for num in nums:
        # Iterate backwards to avoid re-using the same num multiple times in one iteration
        for c in range(target, num - 1, -1):
            dp[c] = dp[c] or dp[c - num]
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
    for (let c = target; c >= num; c--) {
      dp[c] = dp[c] || dp[c - num];
    }
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
        for (int c = target; c >= num; c--) {
            dp[c] = dp[c] || dp[c - num];
        }
    }
    return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

</div>

Notice the backward iteration for the capacity `c`. This is a crucial detail for the classic 0/1 Knapsack to ensure each item is used at most once. Getting this direction wrong is a common interview pitfall.

For String DP, like **Edit Distance (#72)**, the state is `dp[i][j]`: the min cost to convert word1[0..i) to word2[0..j). The transition involves choices: delete, insert, replace (or match).

## How Zepto Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Zepto's DP problems are less about algorithmic cleverness and more about **applied modeling**. At Google, you might get a DP problem on a novel graph topology. At Meta, it might be intertwined with a data structure. At Zepto, the problem statement itself will often hint at a logistics or sequencing scenario. The "twist" is usually in the constraints or the cost function, not in discovering the need for DP.

The difficulty is consistently at the **LeetCode Medium-Hard boundary**, but the evaluation is stricter on optimal space complexity. A solution that uses O(n²) space when O(n) is possible will be questioned. They also place a higher premium on clean, bug-free, and well-communicated code. You must be able to walk through your DP table with an example. The interviewer is扮演 the role of a colleague reviewing your design for a performance-critical service.

## Study Order

Tackle DP in this logical progression to build a compounding understanding:

1.  **Foundation: Fibonacci & Climbing Stairs.** Understand overlapping subproblems and the top-down vs. bottom-up mental model. (Problems: #70, #509)
2.  **1D Linear DP.** Problems where the state depends on a few previous states. This cements the idea of a DP array and simple transitions. (Problems: #198 House Robber, #139 Word Break).
3.  **Classic 0/1 Knapsack.** This is the most important module for Zepto. Master the standard form before variants. (Problems: #416 Partition Equal Subset Sum, #494 Target Sum).
4.  **Unbounded Knapsack & Coin Change.** Learn how the transition changes when items can be reused (iterate capacity forwards). (Problems: #322 Coin Change, #518 Coin Change II).
5.  **2D String DP.** Learn the standard edit distance and longest common subsequence templates. (Problems: #72 Edit Distance, #1143 Longest Common Subsequence).
6.  **2D Grid DP.** Problems like unique paths with obstacles. This combines 2D state with simple decisions. (Problems: #62 Unique Paths, #63 Unique Paths II).

This order works because each step uses concepts from the previous one. Jumping straight to 2D String DP without understanding state/transition from 1D or Knapsack problems is a recipe for confusion.

## Recommended Practice Order

Solve these specific problems in sequence. Each builds on the last.

1.  **#70 Climbing Stairs** (Bottom-up 1D)
2.  **#198 House Robber** (1D DP with decision)
3.  **#416 Partition Equal Subset Sum** (0/1 Knapsack boolean)
4.  **#322 Coin Change** (Unbounded Knapsack minimization)
5.  **#72 Edit Distance** (2D String DP, classic)
6.  **#1143 Longest Common Subsequence** (2D String DP, variation)
7.  **#494 Target Sum** (0/1 Knapsack with a clever transformation - this is a great Zepto-style problem)
8.  **#139 Word Break** (1D DP with a nested search - tests if you can identify the subproblem)

After this core set, if you have time, tackle **#115 Distinct Subsequences** and **#221 Maximal Square** for additional depth on 2D DP.

Remember: at Zepto, your goal is to not just solve the problem, but to convince your interviewer that you can translate a messy real-world constraint into a clean DP state. Practice verbalizing your thought process from problem statement to state definition to transition equation.

[Practice Dynamic Programming at Zepto](/company/zepto/dynamic-programming)
