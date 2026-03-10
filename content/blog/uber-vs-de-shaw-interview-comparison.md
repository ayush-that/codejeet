---
title: "Uber vs DE Shaw: Interview Question Comparison"
description: "Compare coding interview questions at Uber and DE Shaw — difficulty levels, topic focus, and preparation strategy."
date: "2030-02-19"
category: "tips"
tags: ["uber", "de-shaw", "comparison"]
---

# Uber vs DE Shaw: Interview Question Comparison

If you're interviewing at both Uber and DE Shaw, you're facing two distinct challenges from the tech and quantitative finance worlds. While both companies test strong algorithmic fundamentals, their interview philosophies differ significantly in volume, focus, and format. Uber's process feels like a marathon through a broad software engineering curriculum, while DE Shaw's is a targeted sprint through mathematically-intensive problems. Preparing for both simultaneously is possible, but requires strategic prioritization. The key insight: Uber tests _breadth_ of pattern recognition, while DE Shaw tests _depth_ of optimization and edge-case handling.

## Question Volume and Difficulty

The numbers tell a clear story about interview intensity. Uber has **381 tagged questions** on LeetCode (54 Easy, 224 Medium, 103 Hard), making it one of the most question-heavy company tags. This volume reflects Uber's large engineering organization and diverse product domains (mapping, payments, ride-matching, logistics). You need to be ready for almost anything.

DE Shaw has **124 tagged questions** (12 Easy, 74 Medium, 38 Hard). The smaller volume is misleading—it doesn't mean easier interviews. Quantitative finance firms like DE Shaw focus intensely on a curated set of problem types. Their Mediums often feel like Hards elsewhere due to added optimization constraints or mathematical reasoning requirements.

The difficulty distribution reveals priorities:

- Uber: **59% Medium, 27% Hard** — Expect mostly Medium problems with occasional Hard, especially for senior roles.
- DE Shaw: **60% Medium, 31% Hard** — Noticeably higher Hard percentage, indicating they push candidates harder on fewer problems.

Implication: For Uber, you need pattern recognition speed across many domains. For DE Shaw, you need deep problem-solving stamina on mathematically-inclined challenges.

## Topic Overlap

Both companies heavily test **Arrays, Dynamic Programming, and Strings**—these should form your core preparation.

**Shared high-priority topics:**

- **Dynamic Programming**: Both companies love DP. Uber uses it for optimization problems (route planning, pricing), DE Shaw for quantitative and game theory problems.
- **Arrays/Two Pointers**: Fundamental to both, but applied differently.
- **Strings**: Manipulation and parsing problems appear frequently.

**Unique emphasis:**

- **Uber-specific**: Hash Tables (for frequency/counting problems), Trees/Graphs (mapping and routing), System Design (scalable architecture).
- **DE Shaw-specific**: Greedy Algorithms (optimization under constraints), Math/Number Theory, Probability.

The overlap means about 60% of your preparation transfers between companies. The remaining 40% requires targeted study.

## Preparation Priority Matrix

Maximize your ROI with this strategic approach:

**Phase 1: Overlap Topics (Study First)**

- Dynamic Programming (1D/2D, knapsack variants)
- Array manipulation (two pointers, sliding window)
- String algorithms (parsing, palindrome, subsequence)

**Phase 2: Uber-Specific Topics**

- Hash Table applications (frequency counting, caches)
- Graph traversal (BFS/DFS for mapping problems)
- Interval problems (scheduling, merging)

**Phase 3: DE Shaw-Specific Topics**

- Greedy algorithms with proof of correctness
- Mathematical reasoning (combinatorics, probability)
- Optimization under constraints

**Transferable LeetCode problems:**

- **House Robber (#198)**: Classic DP that appears in both contexts
- **Merge Intervals (#56)**: Uber uses for scheduling, DE Shaw for optimization
- **Longest Palindromic Substring (#5)**: Tests DP and two-pointer skills

## Interview Format Differences

**Uber's Process:**

- Typically 4-5 rounds including coding, system design, and behavioral
- Coding rounds: 45-60 minutes, often 2 Medium problems or 1 Hard
- Heavy emphasis on real-world scenarios (mapping, pricing, matching)
- System design is crucial for mid-level and above roles
- Virtual or on-site, with collaborative coding environment

**DE Shaw's Process:**

- Usually 3-4 intense technical rounds
- Coding rounds: 60-90 minutes, often 1-2 complex problems
- Problems frequently involve mathematical optimization
- Less emphasis on system design, more on algorithmic optimization
- On-site interviews often include whiteboard coding
- May include quantitative/puzzle rounds for certain roles

Critical difference: Uber interviewers often want to see your thought process and communication as you solve product-adjacent problems. DE Shaw interviewers are more interested in your optimal solution and ability to handle edge cases mathematically.

## Specific Problem Recommendations

These 5 problems provide maximum coverage for both companies:

1. **Coin Change (#322)** - The quintessential DP problem that appears in both contexts. Uber might frame it as minimum rides to reach a destination; DE Shaw as portfolio optimization.

<div class="code-group">

```python
# Time: O(amount * coins) | Space: O(amount)
def coinChange(coins, amount):
    # DP array: min coins for each amount
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Time: O(amount * coins) | Space: O(amount)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Time: O(amount * coins) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;

    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

2. **Trapping Rain Water (#42)** - Tests array manipulation and two-pointer skills. Uber might relate it to mapping elevation data; DE Shaw to statistical distributions.

3. **Word Break (#139)** - Excellent DP + string problem. Tests your ability to handle dictionary lookups and overlapping subproblems.

4. **Meeting Rooms II (#253)** - Uber uses this for scheduling drivers/riders; DE Shaw for resource allocation problems. Tests interval handling and min-heap usage.

5. **Best Time to Buy and Sell Stock with Cooldown (#309)** - Perfect overlap problem. Uber frames it as dynamic pricing; DE Shaw as trading strategy optimization.

## Which to Prepare for First

**Prepare for DE Shaw first, then Uber.** Here's why:

DE Shaw's focused problem set (124 questions) allows you to build deep expertise in mathematical optimization and DP. Once you've mastered these conceptually challenging problems, Uber's broader question set (381 questions) becomes more manageable—you're adding breadth to an already solid foundation.

The reverse approach is less efficient. If you prepare for Uber's broad curriculum first, you might spread yourself too thin, missing the depth needed for DE Shaw's mathematically-intensive problems. DE Shaw's interviews also tend to be more unforgiving of suboptimal solutions, so you want those patterns deeply ingrained.

**Timeline suggestion:**

- Weeks 1-3: Master overlap topics + DE Shaw specifics
- Weeks 4-5: Add Uber-specific topics (graphs, system design)
- Week 6: Practice Uber's high-frequency problems

Remember: Both companies value clean, optimized code with proper edge cases. The difference is in problem selection and interview style. DE Shaw feels like a math olympiad with coding; Uber feels like a product-focused coding marathon.

For more company-specific insights, check out our [Uber interview guide](/company/uber) and [DE Shaw interview guide](/company/de-shaw).
