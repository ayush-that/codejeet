---
title: "Goldman Sachs vs Expedia: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Expedia — difficulty levels, topic focus, and preparation strategy."
date: "2028-03-11"
category: "tips"
tags: ["goldman-sachs", "expedia", "comparison"]
---

When preparing for technical interviews at major companies, understanding their specific focus areas can dramatically improve your efficiency. Goldman Sachs and Expedia represent two distinct ends of the spectrum in finance and travel tech, which is clearly reflected in their technical interview styles. A strategic preparation plan must account for their differences in question volume, difficulty distribution, and core topic emphasis.

## Question Volume and Difficulty

The sheer volume of questions associated with each company is the most striking difference. Goldman Sachs has a tagged pool of approximately **270 questions**, while Expedia's pool is significantly smaller at around **54 questions**.

The difficulty distribution reveals their hiring priorities:

- **Goldman Sachs (E51/M171/H48):** The distribution is heavily weighted towards **Medium** difficulty (171 questions, ~63%), with a substantial number of **Hard** questions (48 questions, ~18%). This indicates a strong emphasis on complex problem-solving and algorithmic optimization, expecting candidates to handle challenging scenarios under pressure.
- **Expedia (E13/M35/H6):** The focus is also on **Medium** difficulty (35 questions, ~65%), but the number of **Hard** questions is minimal (6 questions, ~11%). The profile suggests a practical interview process that tests solid foundational knowledge and the ability to implement reliable solutions, with less frequent ultra-complex problems.

This contrast means preparation for Goldman Sachs requires grinding through a larger set of more challenging problems, while Expedia preparation can be more focused on mastering fundamentals and common patterns.

## Topic Overlap

Both companies heavily test core data structures, as seen in their shared top topics: **Array, String, and Hash Table**. Questions on these form the backbone of their interviews.

The key differentiator is in the fourth topic:

- **Goldman Sachs** prioritizes **Dynamic Programming (DP)**. This aligns with the quantitative and optimization-heavy nature of financial engineering. Expect problems involving maximization, minimization, and combinatorial counting.
- **Expedia** emphasizes **Greedy** algorithms. This often relates to efficient resource allocation, scheduling, or cost minimization—problems highly relevant to the travel and logistics industry.

Here is a typical problem for each company's distinctive focus:

<div class="code-group">

```python
# Goldman Sachs-style: Dynamic Programming
# Problem: Coin Change (Minimum coins to make amount)
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
// Goldman Sachs-style: Dynamic Programming
// Problem: Coin Change
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Goldman Sachs-style: Dynamic Programming
// Problem: Coin Change
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

<div class="code-group">

```python
# Expedia-style: Greedy
# Problem: Maximum Number of Events That Can Be Attended
def maxEvents(events):
    events.sort(key=lambda x: x[1])  # Sort by end day
    attended = set()
    for start, end in events:
        # Greedily attend the earliest available day
        for day in range(start, end + 1):
            if day not in attended:
                attended.add(day)
                break
    return len(attended)
```

```javascript
// Expedia-style: Greedy
// Problem: Maximum Number of Events That Can Be Attended
function maxEvents(events) {
  events.sort((a, b) => a[1] - b[1]); // Sort by end day
  const attended = new Set();
  for (const [start, end] of events) {
    for (let day = start; day <= end; day++) {
      if (!attended.has(day)) {
        attended.add(day);
        break;
      }
    }
  }
  return attended.size;
}
```

```java
// Expedia-style: Greedy
// Problem: Maximum Number of Events That Can Be Attended
public int maxEvents(int[][] events) {
    Arrays.sort(events, (a, b) -> Integer.compare(a[1], b[1]));
    Set<Integer> attended = new HashSet<>();
    for (int[] event : events) {
        for (int day = event[0]; day <= event[1]; day++) {
            if (attended.add(day)) {
                break;
            }
        }
    }
    return attended.size();
}
```

</div>

## Which to Prepare for First

Prepare for **Goldman Sachs first**. The reasoning is straightforward: its question pool is larger and contains more difficult problems. If you build the depth and stamina required for Goldman Sachs interviews—especially in Dynamic Programming—you will automatically cover the core (Array, String, Hash Table) and the majority of the Medium-difficulty problems relevant to Expedia. You would then only need to top up your knowledge with specific Greedy algorithm patterns and practice the smaller Expedia question set.

Conversely, preparing exclusively for Expedia first would leave you significantly underprepared for the volume and complexity of a Goldman Sachs interview. The foundational skills are transferable, but the advanced DP and high-volume practice are not.

Start with the heavy lifting for Goldman Sachs, then refine and specialize for Expedia.

- Practice questions for [Goldman Sachs](/company/goldman-sachs)
- Practice questions for [Expedia](/company/expedia)
