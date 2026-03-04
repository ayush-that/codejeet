---
title: "Goldman Sachs vs ServiceNow: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and ServiceNow — difficulty levels, topic focus, and preparation strategy."
date: "2028-02-14"
category: "tips"
tags: ["goldman-sachs", "servicenow", "comparison"]
---

When preparing for technical interviews at top companies, understanding their specific focus areas can dramatically improve your efficiency. Goldman Sachs and ServiceNow both test core algorithmic skills, but with different intensity and emphasis. While both prioritize fundamental data structures like arrays, strings, hash tables, and dynamic programming, the scale and depth of their question banks reveal distinct interview philosophies.

## Question Volume and Difficulty

The most striking difference is the sheer volume of questions. Goldman Sachs has a massive repository of **270 questions**, while ServiceNow's list is more focused at **78 questions**.

**Goldman Sachs (E51/M171/H48):** The distribution is heavily weighted toward **Medium** difficulty (171 questions, ~63% of the total). This indicates that passing a Goldman Sachs interview requires not just solving problems, but solving a high volume of moderately complex problems efficiently under pressure. The significant number of Hard questions (48) suggests you may encounter at least one highly challenging problem designed to test your limits.

**ServiceNow (E8/M58/H12):** The focus is also on Medium difficulty (58 questions, ~74% of the total), but the overall pool is smaller. The lower count of Hard questions (12) implies the technical bar, while still high, may be slightly less intense than at top investment banks. The emphasis is likely on clean, correct solutions to common patterns rather than tackling extreme edge cases.

## Topic Overlap

Both companies test an almost identical core set of data structures. This overlap is your strategic advantage.

- **Array & String Manipulation:** Expect questions on two-pointer techniques, sliding windows, and in-place operations.
- **Hash Table:** Essential for optimizing lookups and solving frequency-counting problems.
- **Dynamic Programming:** A critical topic for both. You must be comfortable with classic problems and state transitions.

The key difference is _context_ and _depth_. Goldman Sachs's larger pool means you could see more nuanced variations on these themes, potentially integrated with financial concepts (e.g., simulating transactions). ServiceNow's questions might lean more toward data processing, workflow simulation, or tree/graph problems related to its platform.

Here is a typical DP problem pattern both companies might use:

<div class="code-group">

```python
# Python: Coin Change (Minimum coins)
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
// JavaScript: Coin Change (Minimum coins)
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
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
// Java: Coin Change (Minimum coins)
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

## Which to Prepare for First

Prepare for **ServiceNow first**. Its more focused question list allows you to efficiently build core competency across the essential topics. Mastering ServiceNow's ~78 questions, especially the Medium ones, will give you a strong foundation that covers a significant portion of the high-frequency problems you'd see anywhere, including Goldman Sachs.

Once that foundation is solid, transition to **Goldman Sachs** preparation. Treat it as an expansion and intensification phase. Use the larger question bank to:

1.  Increase your stamina by practicing a higher volume of problems.
2.  Deepen your understanding by tackling more Hard problems.
3.  Expose yourself to a wider variety of problem framings and edge cases.

This sequential approach—foundation first, then scale and depth—is the most efficient path to being prepared for both interview loops.

For targeted practice, visit the Goldman Sachs question list and the ServiceNow question list.
