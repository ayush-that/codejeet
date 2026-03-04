---
title: "Uber vs Accenture: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Accenture — difficulty levels, topic focus, and preparation strategy."
date: "2027-05-16"
category: "tips"
tags: ["uber", "accenture", "comparison"]
---

When preparing for technical interviews, understanding the specific focus and expectations of each company is crucial. Uber and Accenture, while both requiring strong problem-solving skills, present distinct interview landscapes due to their differing core businesses—a product-based tech giant versus a global consulting and services firm. This comparison analyzes their question profiles to help you tailor your preparation effectively.

## Question Volume and Difficulty

The sheer volume of reported questions is the first major differentiator. Uber's list is significantly larger at **381 questions**, compared to Accenture's **144 questions**. This suggests that Uber's question bank is more extensive and potentially less predictable, requiring broader preparation.

The difficulty distribution reveals their technical depth expectations:

- **Uber (E54/M224/H103):** The distribution is heavily weighted toward Medium (224) and Hard (103) problems. Hard problems constitute about 27% of their list, indicating a strong emphasis on complex algorithmic thinking, optimization, and handling edge cases. This aligns with interviews for software engineering roles at a high-performance, scalable tech platform.
- **Accenture (E65/M68/H11):** The distribution skews heavily toward Easy (65) and Medium (68) problems. Hard problems make up only about 8% of their list. This profile is typical for consulting and services firms, where the interview often assesses foundational coding competency, logical reasoning, and the ability to clearly solve business problems with code, rather than pushing the limits of algorithmic optimization.

## Topic Overlap

Both companies prominently feature **Array, String, and Hash Table** problems. These are fundamental data structures that form the basis for most coding interviews. However, the complexity and application within these topics will differ.

**Uber's** fourth most frequent topic is **Dynamic Programming (DP)**. This is a telling detail. DP questions (e.g., longest increasing subsequence, edit distance, knapsack variations) are classic markers of interviews that probe deep algorithmic knowledge and the ability to break down complex problems into optimal substructures. You must be proficient here.

<div class="code-group">

```python
# Example DP Problem (Uber-style): Minimum Path Sum
def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0]*n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
    return dp[m-1][n-1]
```

```javascript
// Example DP Problem (Uber-style): Minimum Path Sum
function minPathSum(grid) {
  const m = grid.length,
    n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = grid[0][0];
  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];
  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m - 1][n - 1];
}
```

```java
// Example DP Problem (Uber-style): Minimum Path Sum
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    dp[0][0] = grid[0][0];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m-1][n-1];
}
```

</div>

**Accenture's** fourth topic is **Math**. This often involves problems related to number properties, basic arithmetic manipulations, or simple combinatorial logic. The focus is on clean, correct implementation rather than advanced algorithms.

<div class="code-group">

```python
# Example Math Problem (Accenture-style): Reverse Integer
def reverse(x):
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    rev = 0
    sign = -1 if x < 0 else 1
    x = abs(x)
    while x != 0:
        pop = x % 10
        x //= 10
        # Check for overflow before multiplying
        if rev > (INT_MAX // 10) or (rev == INT_MAX // 10 and pop > 7):
            return 0
        rev = rev * 10 + pop
    return rev * sign
```

```javascript
// Example Math Problem (Accenture-style): Reverse Integer
function reverse(x) {
  const INT_MAX = 2 ** 31 - 1,
    INT_MIN = -(2 ** 31);
  let rev = 0;
  while (x !== 0) {
    const pop = x % 10;
    x = Math.trunc(x / 10);
    if (rev > Math.trunc(INT_MAX / 10) || (rev === Math.trunc(INT_MAX / 10) && pop > 7)) return 0;
    if (rev < Math.trunc(INT_MIN / 10) || (rev === Math.trunc(INT_MIN / 10) && pop < -8)) return 0;
    rev = rev * 10 + pop;
  }
  return rev;
}
```

```java
// Example Math Problem (Accenture-style): Reverse Integer
public int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        if (rev > Integer.MAX_VALUE/10 || (rev == Integer.MAX_VALUE/10 && pop > 7)) return 0;
        if (rev < Integer.MIN_VALUE/10 || (rev == Integer.MIN_VALUE/10 && pop < -8)) return 0;
        rev = rev * 10 + pop;
    }
    return rev;
}
```

</div>

## Which to Prepare for First

Your preparation priority should be dictated by your target role and timeline.

**Prepare for Accenture first if:** You are new to technical interviews or are strengthening your fundamentals. The focus on Easy/Medium problems on core data structures provides a solid, less intimidating foundation. Mastering these will build the confidence and muscle memory needed for more difficult problems. Success here relies on clear communication, bug-free code, and demonstrating logical process.

**Prepare for Uber first if:** You are aiming for a core software engineering role at a top tech company. The high volume and difficulty of questions require a longer, more intensive study period. You must build deep competency in Dynamic Programming, graph algorithms (implied by their complex problems), and system design. Starting with Uber's profile forces you to raise your standard to the highest level. If you can handle Uber's question set, Accenture's will feel like a subset of your prepared skills.

In summary, use Accenture's profile to solidify your basics and Uber's to stretch your algorithmic limits. Tailor your depth accordingly.

For more detailed question lists and patterns, visit the company pages: [Uber](/company/uber) and [Accenture](/company/accenture).
