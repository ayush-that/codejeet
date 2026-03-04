---
title: "Goldman Sachs vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2028-03-17"
category: "tips"
tags: ["goldman-sachs", "twitter", "comparison"]
---

When preparing for technical interviews at top companies, understanding their specific question patterns and focus areas is crucial. Goldman Sachs and Twitter, while both demanding strong algorithmic skills, present distinct challenges in their coding interviews. Goldman Sachs emphasizes breadth and foundational problem-solving across a massive question bank, while Twitter focuses on a narrower set of problems with greater emphasis on practical design and implementation. A strategic preparation plan should account for these differences.

## Question Volume and Difficulty

The most striking difference is scale. Goldman Sachs's tagged list contains **270 questions** on platforms like LeetCode, dwarfing Twitter's **53**. This volume indicates that Goldman Sachs interviews draw from a vast, well-established pool, testing a candidate's exposure to a wide variety of problem types. The difficulty distribution also differs:

- **Goldman Sachs (E51/M171/H48):** The majority (63%) of questions are Medium difficulty, with a significant number of Hard (18%) and Easy (19%) problems. This suggests a strong focus on complex, multi-step problem-solving, not just basic competency.
- **Twitter (E8/M33/H12):** Here, the emphasis is even more pronounced on Medium difficulty, which constitutes over 62% of their list. The relative number of Hard problems (23%) is slightly higher than Goldman's proportion, but the absolute count is small. This points to interviews that deeply probe a candidate's mastery of core concepts within a more constrained problem set.

In practice, a Goldman Sachs candidate must be prepared for a marathon—encountering a diverse array of challenges. A Twitter candidate can expect a sprint that tests depth on key patterns.

## Topic Overlap

Both companies heavily test the fundamental building blocks of algorithms. The top topics are nearly identical:

1.  **Array**
2.  **String**
3.  **Hash Table**

This core trio is non-negotiable for both interviews. Mastery here is essential. The key divergence comes in the fourth-ranked topic.

- For **Goldman Sachs**, it's **Dynamic Programming (DP)**. The presence of 48 Hard problems often correlates with complex DP scenarios (knapsack, longest increasing subsequence, state machine DP). You must be comfortable breaking down intricate optimization problems.
- For **Twitter**, it's **Design**. This doesn't typically refer to large-scale system design (like designing Twitter itself), but to **object-oriented design** and **data structure design** problems (e.g., design a hit counter, an ordered stream, or a parking lot). It tests your ability to write clean, maintainable, and practical code.

<div class="code-group">

```python
# Example of a common DP pattern (Goldman focus)
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Example of a design-focused problem (Twitter focus)
class HitCounter {
  constructor() {
    this.hits = [];
  }

  hit(timestamp) {
    this.hits.push(timestamp);
  }

  getHits(timestamp) {
    // Remove hits older than 5 minutes (300 seconds)
    while (this.hits.length > 0 && timestamp - this.hits[0] >= 300) {
      this.hits.shift();
    }
    return this.hits.length;
  }
}
```

```java
// Example of a design-focused problem (Twitter focus)
public class HitCounter {
    private Queue<Integer> hits;

    public HitCounter() {
        hits = new LinkedList<>();
    }

    public void hit(int timestamp) {
        hits.add(timestamp);
    }

    public int getHits(int timestamp) {
        while (!hits.isEmpty() && timestamp - hits.peek() >= 300) {
            hits.poll();
        }
        return hits.size();
    }
}
```

</div>

## Which to Prepare for First

Start with **Goldman Sachs**. Here's why:

1.  **Foundation First:** Preparing for Goldman's vast question bank forces you to build rigorous, broad-based competency in core data structures (Array, String, Hash Table) and advanced algorithms (Dynamic Programming). This foundation will inherently cover almost all of Twitter's technical requirements.
2.  **Efficiency:** The path from Goldman-level preparation to Twitter is straightforward. Once you have the strong algorithmic base, you only need to layer on Twitter's specific emphasis on **practical design problems** and practice their more concentrated question set.
3.  **Difficulty Buffer:** Being comfortable with a wide range of Medium and Hard problems from the Goldman list will make Twitter's Medium-heavy focus feel more manageable.

In short, use the Goldman Sachs list as your primary training ground for algorithmic depth and endurance. Then, pivot to the Twitter list to refine your skills on design-oriented problems and to familiarize yourself with their most frequent, signature questions. This approach ensures you are over-prepared for Twitter and thoroughly prepared for Goldman Sachs.

For targeted practice, visit the company pages: [Goldman Sachs](/company/goldman-sachs) and [Twitter](/company/twitter).
