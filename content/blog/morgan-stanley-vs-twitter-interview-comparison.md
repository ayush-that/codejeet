---
title: "Morgan Stanley vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at Morgan Stanley and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2027-01-22"
category: "tips"
tags: ["morgan-stanley", "twitter", "comparison"]
---

When preparing for technical interviews, company-specific patterns matter more than general algorithm knowledge. Morgan Stanley and Twitter both appear in the "53 questions" bracket on CodeJeet, but the distribution of difficulty and the focus of those questions differ significantly, pointing to distinct interview philosophies.

## Question Volume and Difficulty

Both companies have 53 tagged questions, but the difficulty breakdown reveals their priorities.

**Morgan Stanley (E13/M34/H6)** employs a **middle-heavy** strategy. With 34 Medium questions (64% of its total), the interview is designed to consistently assess competent, reliable problem-solving. The 13 Easy questions often serve as warm-ups or test fundamental coding clarity, while the 6 Hard questions likely probe deeper algorithmic thinking for specific roles. This distribution suggests a process that filters for strong, consistent performers rather than solely targeting algorithmic Olympiad-level skill.

**Twitter (E8/M33/H12)** uses a **more stringent** filter. It has fewer Easy questions (8 vs. 13) and significantly more Hard questions (12 vs. 6). The Medium count is similar (33 vs. 34), but the increased Hard count indicates a greater expectation for candidates to tackle complex, scalable problems. This aligns with Twitter's engineering scale, where system design and optimizing performance under load are critical.

## Topic Overlap

Both companies heavily emphasize **Array, String, and Hash Table** problems. These are foundational for assessing data manipulation, efficient lookup, and basic logic.

- **Morgan Stanley's** fourth most-tagged topic is **Dynamic Programming (DP)**. This is a key differentiator. DP problems (e.g., knapsack, longest common subsequence, coin change) test mathematical modeling, optimization, and recursive thinking—skills highly relevant to quantitative finance and risk analysis.

<div class="code-group">

```python
# Example DP: Coin Change (Minimum coins)
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Example DP: Coin Change (Minimum coins)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Example DP: Coin Change (Minimum coins)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

- **Twitter's** fourth topic is **Design**. This encompasses both Object-Oriented Design (OOD) and System Design (SD). Expect questions on designing scalable services (e.g., a timeline, a tweet search), data structures like Twitter's own "Snowflake" ID generator, or class hierarchies for a social media feature. This reflects the core software product engineering focus.

## Which to Prepare for First

Your preparation priority should be dictated by your target role and the foundational skills required.

**Prepare for Morgan Stanley first if:** You are targeting quantitative, analytical, or backend roles where algorithmic optimization is paramount. The strong DP focus requires dedicated, deep practice. Mastering the Medium-heavy question set will build the consistency needed for their process. Use the [Morgan Stanley question list](/company/morgan-stanley) to drill into DP and array/string manipulation.

**Prepare for Twitter first if:** You are aiming for a product-oriented or full-stack software engineering role where scalability is a daily concern. The higher proportion of Hard problems means you need to be comfortable with complex algorithms _and_ be ready to discuss design trade-offs. Use the [Twitter question list](/company/twitter) to practice Hard problems and integrate design thinking into your solutions.

**General strategy:** Start with the company whose core topics (DP vs. Design) better match your current strengths. This builds confidence. Then, tackle the other to broaden your skill set. The shared focus on Array, String, and Hash Table problems means 60-70% of your core algorithmic practice is transferable between the two.
