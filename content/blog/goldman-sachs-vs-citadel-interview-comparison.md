---
title: "Goldman Sachs vs Citadel: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Citadel — difficulty levels, topic focus, and preparation strategy."
date: "2028-02-06"
category: "tips"
tags: ["goldman-sachs", "citadel", "comparison"]
---

When preparing for technical interviews at top financial firms, understanding the distinct approaches of Goldman Sachs and Citadel is crucial for efficient study. Both firms test core computer science fundamentals, but their question volume, difficulty distribution, and focus areas differ significantly. This comparison analyzes their technical interview question profiles to help you tailor your preparation strategy.

## Question Volume and Difficulty

The most striking difference is the sheer volume of questions in each company's known problem set.

**Goldman Sachs** has a massive, well-documented repository of **270 questions**. The difficulty distribution is heavily weighted towards medium-level problems (M171), with a substantial number of easy (E51) and hard (H48) questions. This large pool suggests that while the fundamental concepts tested are consistent, the specific problems you might encounter are highly variable. Preparing for Goldman Sachs requires broad coverage; you cannot rely on studying only a small set of high-frequency questions. The high volume indicates they value a candidate's ability to reliably solve a wide range of standard algorithmic challenges under interview conditions.

**Citadel**, in contrast, has a more focused set of **96 questions**. The distribution skews even more heavily towards medium difficulty (M59), with a significant portion of hard problems (H31) and very few easy ones (E6). This smaller, more difficult set implies a different emphasis. Citadel's interviews likely dive deeper into each problem, expecting optimal solutions, robust implementations, and perhaps discussions on edge cases and scalability. The lower number of questions suggests higher question frequency within their set, making targeted, deep-dive preparation more effective.

## Topic Overlap

Both firms prioritize the same core data structures and algorithms, but with subtle shifts in emphasis.

The top four topics are identical: **Array, String, Dynamic Programming (DP), and Hash Table**. This overlap means a strong foundation in these areas is non-negotiable for either company. You must be proficient in two-pointer techniques, sliding window, prefix sums, string manipulation, and hash map-based lookups.

**Dynamic Programming** is a critical common thread. You should be prepared for classic DP problems and variations. For example, a problem like finding the longest palindromic substring tests both string manipulation and DP concepts.

<div class="code-group">

```python
def longestPalindrome(s: str) -> str:
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    ans = ""
    for i in range(n-1, -1, -1):
        for j in range(i, n):
            # Base cases: single char or two equal chars
            dp[i][j] = (s[i] == s[j]) and (j - i < 3 or dp[i+1][j-1])
            if dp[i][j] and (j - i + 1) > len(ans):
                ans = s[i:j+1]
    return ans
```

```javascript
function longestPalindrome(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));
  let ans = "";
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      dp[i][j] = s[i] === s[j] && (j - i < 3 || dp[i + 1][j - 1]);
      if (dp[i][j] && j - i + 1 > ans.length) {
        ans = s.substring(i, j + 1);
      }
    }
  }
  return ans;
}
```

```java
public String longestPalindrome(String s) {
    int n = s.length();
    boolean[][] dp = new boolean[n][n];
    String ans = "";
    for (int i = n - 1; i >= 0; i--) {
        for (int j = i; j < n; j++) {
            dp[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 3 || dp[i + 1][j - 1]);
            if (dp[i][j] && (j - i + 1) > ans.length()) {
                ans = s.substring(i, j + 1);
            }
        }
    }
    return ans;
}
```

</div>

The main difference lies in the _application_ of these topics. Given Citadel's quantitative trading focus, problems may more frequently involve numerical computations, probabilities, or optimization within array/DP frameworks. Goldman Sachs's broader set may include more problems directly related to data processing and system design fundamentals.

## Which to Prepare for First

Your preparation order should be guided by the principle of **foundation first, then specialization**.

Start with the **common core topics**: Array, String, Hash Table, and Dynamic Programming. Mastering these will give you the highest return on investment for both companies. Solve a mix of easy and medium problems from general LeetCode lists on these topics to build fluency.

If you have interviews at both firms, **prepare for Goldman Sachs first**. Its enormous question bank forces you to develop broad competency and quick pattern recognition across a wide spectrum of problems. This breadth-first approach will solidify your fundamentals. The skills you build—speed, accuracy, and familiarity with many problem variants—are directly transferable.

Once your foundation is solid, **deepen your preparation for Citadel**. Focus on solving their specific set of ~96 questions, paying particular attention to the medium and hard problems. Practice deriving optimal solutions, writing flawless code under time pressure, and articulating your thought process clearly. The depth required here builds on the breadth you gained from Goldman Sachs-style prep.

Ultimately, success at either firm hinges on genuine mastery of algorithms. Begin with the shared, high-frequency fundamentals, use Goldman's vast problem set to achieve breadth, and then use Citadel's focused list to achieve depth.

For targeted practice, explore the question lists directly: [Goldman Sachs](/company/goldman-sachs) and [Citadel](/company/citadel).
