---
title: "Math Questions at ByteDance: What to Expect"
description: "Prepare for Math interview questions at ByteDance — patterns, difficulty breakdown, and study tips."
date: "2029-01-17"
category: "dsa-patterns"
tags: ["bytedance", "math", "interview prep"]
---

Math questions appear in roughly 12% of ByteDance’s technical interviews (8 out of 64 total problems). They aren't just academic exercises. ByteDance’s core products—TikTok, Douyin, Toutiao—rely heavily on algorithms for content recommendation, real-time analytics, ad pricing, and massive-scale data processing. A strong math foundation directly translates to optimizing these systems, whether you're calculating probabilities for A/B tests, designing efficient data structures, or modeling user engagement. Interviewers use these problems to assess your analytical rigor and your ability to translate a real-world problem into a precise, computable model.

## What to Expect — Types of Problems

ByteDance’s math questions typically fall into three categories. **Probability and Statistics** are most common, involving scenarios like card draws, game strategies, or estimating metrics from sampled data. **Combinatorics** problems ask you to count arrangements or selections under constraints, often requiring careful case analysis. Finally, **Number Theory and Modular Arithmetic** appear in problems related to hashing, cryptography, or optimizing operations with large integers. The problems are often presented as word problems or embedded within a coding task, testing both your mathematical modeling and your ability to implement the solution efficiently.

## How to Prepare — Study Tips with One Code Example

Focus on core concepts: probability rules (conditional, Bayes’), combinatorics formulas (permutations, combinations), and modular arithmetic properties. Practice translating word problems into equations before coding. A key pattern is using **dynamic programming (DP) for probability and combinatorics** where outcomes depend on previous states.

For example, consider finding the probability of reaching a point on a number line starting from zero, moving `+1` with probability `p` and `-1` with probability `1-p` in `n` steps. This is solved with DP where `dp[i][j]` represents the probability of being at position `j` after `i` steps.

<div class="code-group">

```python
def probability_after_steps(n, p, target):
    # dp[step][position] -> probability
    # Position range: -n to n, offset by n for index
    dp = [[0.0] * (2 * n + 1) for _ in range(n + 1)]
    dp[0][n] = 1.0  # Start at position 0 (index n)

    for step in range(1, n + 1):
        for pos in range(-n, n + 1):
            idx = pos + n
            # Came from left
            if pos - 1 >= -n:
                dp[step][idx] += dp[step - 1][idx - 1] * p
            # Came from right
            if pos + 1 <= n:
                dp[step][idx] += dp[step - 1][idx + 1] * (1 - p)

    return dp[n][target + n]
```

```javascript
function probabilityAfterSteps(n, p, target) {
  // dp[step][position] -> probability
  // Position index: position + n
  const dp = Array.from({ length: n + 1 }, () => new Array(2 * n + 1).fill(0.0));
  dp[0][n] = 1.0; // Start at position 0 (index n)

  for (let step = 1; step <= n; step++) {
    for (let pos = -n; pos <= n; pos++) {
      const idx = pos + n;
      // Came from left
      if (pos - 1 >= -n) {
        dp[step][idx] += dp[step - 1][idx - 1] * p;
      }
      // Came from right
      if (pos + 1 <= n) {
        dp[step][idx] += dp[step - 1][idx + 1] * (1 - p);
      }
    }
  }
  return dp[n][target + n];
}
```

```java
public double probabilityAfterSteps(int n, double p, int target) {
    // dp[step][position] -> probability
    // Position index: position + n
    double[][] dp = new double[n + 1][2 * n + 1];
    dp[0][n] = 1.0; // Start at position 0 (index n)

    for (int step = 1; step <= n; step++) {
        for (int pos = -n; pos <= n; pos++) {
            int idx = pos + n;
            // Came from left
            if (pos - 1 >= -n) {
                dp[step][idx] += dp[step - 1][idx - 1] * p;
            }
            // Came from right
            if (pos + 1 <= n) {
                dp[step][idx] += dp[step - 1][idx + 1] * (1 - p);
            }
        }
    }
    return dp[n][target + n];
}
```

</div>

## Recommended Practice Order

1.  **Master Fundamentals:** Review probability, combinatorics, and modular arithmetic. Solve textbook-style problems manually.
2.  **Apply to Code:** Practice implementing the above concepts in your primary language using platforms like LeetCode. Filter for ByteDance math-tagged problems.
3.  **Simulate Interviews:** Time yourself solving ByteDance’s past math questions. Explain your reasoning aloud as you derive formulas and write code.
4.  **Identify Weaknesses:** If you miss a problem, categorize the error—was it the mathematical model or the implementation? Drill that category.

[Practice Math at ByteDance](/company/bytedance/math)
