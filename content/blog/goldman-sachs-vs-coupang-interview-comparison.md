---
title: "Goldman Sachs vs Coupang: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Coupang — difficulty levels, topic focus, and preparation strategy."
date: "2028-03-13"
category: "tips"
tags: ["goldman-sachs", "coupang", "comparison"]
---

When preparing for technical interviews at top companies, understanding the specific focus and volume of questions can dramatically improve your efficiency. Goldman Sachs and Coupang, while both prestigious, present distinct interview landscapes. Goldman Sachs, a global investment bank, tests foundational computer science knowledge with a massive, well-documented question bank. Coupang, South Korea's e-commerce giant, has a smaller but highly focused set of questions that often relate to scalable system design and practical problem-solving. A strategic preparation plan must account for their differences in volume, difficulty distribution, and core topic emphasis.

## Question Volume and Difficulty

The sheer volume of questions is the most striking difference. Goldman Sachs's list of **270 questions** dwarfs Coupang's **53**. This volume indicates Goldman's interviews pull from a vast, established pool, making pattern recognition across many problems crucial.

The difficulty distribution also varies:

- **Goldman Sachs (E51/M171/H48):** The majority (171) are Medium difficulty. This suggests a strong emphasis on applying standard algorithms to moderately complex problems. The high number of Easy questions (51) indicates they test fundamental coding fluency, while the 48 Hard questions are likely reserved for more challenging roles or final rounds.
- **Coupang (E3/M36/H14):** The distribution is heavily skewed toward Medium (36) and Hard (14) problems, with very few Easy (3). This points to an interview process that quickly moves past basics to assess problem-solving under constraints and the ability to handle complex scenarios, possibly related to large-scale data or performance optimization.

## Topic Overlap

Both companies heavily test four core data structures and algorithms: **Array, String, Hash Table, and Dynamic Programming**. This significant overlap means mastering these topics is the highest-yield preparation for either company.

- **Array & String:** Expect manipulations, searches, and two-pointer or sliding window techniques.
- **Hash Table:** Used for frequency counting, lookups, and complement searches (like Two Sum).
- **Dynamic Programming:** A critical topic for both, especially for Medium and Hard problems. Focus on classic patterns like knapsack, longest common subsequence, and pathfinding.

<div class="code-group">

```python
# Example: A classic DP problem relevant to both.
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Example: A classic DP problem relevant to both.
function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Example: A classic DP problem relevant to both.
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

The key difference lies in context. Goldman's questions may be more abstract and mathematical, while Coupang's might be framed around logistics, inventory, or user data systems. For Coupang, also be prepared to extend these core topics into discussions on scalability and real-world application.

## Which to Prepare for First

Prepare for **Goldman Sachs first**. Its enormous question bank covers a wider surface area of computer science fundamentals. Successfully working through a significant portion of its 270 questions will build a deep, versatile problem-solving muscle that applies to virtually any technical interview, including Coupang's.

The strategy is efficient: mastering the core topics (Array, String, Hash Table, DP) through Goldman's extensive practice will automatically cover the technical foundation for Coupang. You can then transition to Coupang's specific list to refine your skills on its harder-weighted problems and adapt your thinking to its more applied, systems-oriented context. Starting with Coupang's smaller list might leave gaps for Goldman's broader scope, but starting with Goldman creates a strong base that makes Coupang's focused set feel more manageable.

For targeted practice, visit the company pages: [Goldman Sachs](/company/goldman-sachs) and [Coupang](/company/coupang).
