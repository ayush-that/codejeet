---
title: "Goldman Sachs vs LinkedIn: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and LinkedIn — difficulty levels, topic focus, and preparation strategy."
date: "2030-10-07"
category: "tips"
tags: ["goldman-sachs", "linkedin", "comparison"]
---

If you're preparing for interviews at both Goldman Sachs and LinkedIn, you're likely targeting two distinct career paths: high-stakes finance tech versus a mature social-tech platform. While both are top-tier companies, their interview processes reflect their core business values. Goldman Sachs interviews test for precision, speed, and handling complex financial logic under pressure, often with a heavier emphasis on dynamic programming and data manipulation. LinkedIn interviews, while still rigorous, tend to focus more on data modeling, graph traversal, and building scalable user-facing features. Preparing for both simultaneously is efficient due to significant overlap, but you must strategically allocate your time to cover their unique emphases.

## Question Volume and Difficulty

The raw numbers tell an immediate story about expected breadth. Goldman Sachs' tagged list on LeetCode contains **270 questions** (51 Easy, 171 Medium, 48 Hard). LinkedIn's list contains **180 questions** (26 Easy, 117 Medium, 37 Hard).

**Goldman Sachs'** larger volume, particularly in the Medium category, suggests a broader potential problem space. You're more likely to encounter a problem you haven't seen before. The higher proportion of Hards also indicates they are not afraid to ask complex, multi-step problems, especially for senior roles or quantitative positions. The intensity is high; you must be prepared to think on your feet and optimize thoroughly.

**LinkedIn's** list, while still substantial, is more curated. The Medium-heavy distribution is classic for senior software engineer roles at large tech companies—challenging but typically within standard patterns. The focus is on assessing clean coding, sound reasoning, and the ability to translate a real-world scenario into an algorithm. The slightly lower volume means deeper, repeated practice on their favorite patterns can yield high returns.

In essence, Goldman's process feels like a comprehensive final exam, while LinkedIn's feels like a deep dive into specific, relevant engineering skills.

## Topic Overlap

Both companies heavily test **Array, String, and Hash Table** problems. This is your foundational core. Mastering these means you can handle a majority of the Easy and Medium questions at both firms.

- **Shared Prep Value:** Excelling at array manipulation, two-pointer techniques, sliding windows, and hash map-based lookups is the highest-return investment. A problem like **Two Sum (#1)** is trivial, but its pattern is foundational for hundreds of others.

The key differentiator is in their secondary focus:

- **Goldman Sachs' Unique Edge: Dynamic Programming.** This is the standout. DP questions (often related to optimization, counting, or maximizing values) are frequent, reflecting financial use cases like maximizing profit, minimizing risk, or calculating pathways. You must be comfortable with 1D and 2D DP.
- **LinkedIn's Unique Edge: Depth-First Search & Graph Theory.** LinkedIn's domain is a social _graph_. It's no surprise they favor tree and graph traversal (DFS, BFS), cycle detection, and connectivity problems. Understanding adjacency lists and recursive traversal is non-negotiable.

## Preparation Priority Matrix

Use this to triage your study time efficiently.

1.  **Highest Priority (Overlap Topics):** Array, String, Hash Table.
    - **Practice Problems:** **Product of Array Except Self (#238)**, **Group Anagrams (#49)**, **Longest Substring Without Repeating Characters (#3)**. These test fundamental techniques that appear everywhere.

2.  **Goldman-Sachs-Specific Priority:** Dynamic Programming.
    - **Start With:** **Climbing Stairs (#70)**, **Coin Change (#322)**. Then move to **Best Time to Buy and Sell Stock (#121)** and its variants, which have direct financial analogs.

3.  **LinkedIn-Specific Priority:** Depth-First Search, Trees, Graphs.
    - **Start With:** **Number of Islands (#200)**, **Binary Tree Level Order Traversal (#102)**, **Clone Graph (#133)**. These are classic graph/tree problems that test traversal and modeling.

## Interview Format Differences

**Goldman Sachs:**

- **Structure:** Typically begins with a HackerRank-style online assessment. On-site/virtual rounds usually consist of **2-3 technical interviews** (45-60 mins each) that are almost purely coding/algorithms, sometimes with a small systems discussion. There may be a separate quantitative reasoning or market knowledge round for certain roles.
- **Pace:** Fast. You may be expected to solve 2 Medium problems or 1 Hard problem in a session. Code must be syntactically perfect and optimized.
- **Behavioral Weight:** Moderate. The "fit" questions often revolve around handling pressure, attention to detail, and understanding the financial context.
- **System Design:** Varies by level. For mid-level roles, it might be light or combined with a coding round. For senior roles, expect a dedicated round.

**LinkedIn:**

- **Structure:** A more standard Big Tech process. After an initial phone screen, the virtual on-site usually has **4-5 rounds**: 2-3 coding, 1 system design (for mid-senior+), 1 behavioral/leadership.
- **Pace:** Deliberate. Often 1-2 problems per coding round, with deep discussion on approach, trade-offs, and testing. Clean, readable code and communication are paramount.
- **Behavioral Weight:** High. LinkedIn places strong emphasis on cultural fit, collaboration, and "Leadership Principles." The behavioral round is a serious, structured interview.
- **System Design:** A core component for any role above entry-level, with a clear, dedicated round.

## Specific Problem Recommendations for Dual Prep

Here are 5 problems that provide exceptional value for preparing for both companies, as they blend core patterns with company-specific flavors.

1.  **Longest Palindromic Substring (#5):** Covers string manipulation, two-pointer expansion, and dynamic programming. A DP solution is great Goldman practice; the optimized expand-around-center approach is excellent for LinkedIn's focus on clean algorithms.
2.  **Merge Intervals (#56):** An array/sorting classic. It tests your ability to manage and merge data ranges—a pattern useful for financial time series (Goldman) and scheduling features (LinkedIn).
3.  **Word Break (#139):** A perfect bridge problem. It's a quintessential Hash Table (for the dictionary) and Dynamic Programming problem. Mastering this gives you a strong DP pattern for Goldman and a complex string/data modeling problem for LinkedIn.
4.  **Course Schedule (#207):** This is a top LinkedIn graph (DFS, cycle detection) problem. Understanding it deeply will cover you for most of LinkedIn's graph questions. For Goldman, the topological sort pattern can appear in dependency-resolution scenarios.
5.  **Best Time to Buy and Sell Stock (#121):** The entire series is Goldman Sachs interview prep in a nutshell. Start with #121 (simple one transaction), then tackle #122 (multiple transactions) and #123 (two transactions). These teach state machine DP, which is extremely powerful.

<div class="code-group">

```python
# Example: Word Break (#139) - DP Solution
# Time: O(n^3) for naive, O(n^2) with substring optimization | Space: O(n)
def wordBreak(s, wordDict):
    """
    Returns True if string `s` can be segmented into words from `wordDict`.
    """
    word_set = set(wordDict)  # O(m) for m words
    dp = [False] * (len(s) + 1)
    dp[0] = True  # Empty string is valid

    for i in range(1, len(s) + 1):
        for j in range(i):
            # Check if prefix s[0:j] is valid and substring s[j:i] is a word
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # No need to check other j's for this i
    return dp[len(s)]
```

```javascript
// Example: Word Break (#139) - DP Solution
// Time: O(n^3) for naive, O(n^2) with substring optimization | Space: O(n)
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true; // Base case: empty string

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}
```

```java
// Example: Word Break (#139) - DP Solution
// Time: O(n^3) for naive, O(n^2) with substring optimization | Space: O(n)
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true; // Base case

    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}
```

</div>

## Which to Prepare for First?

**Prepare for Goldman Sachs first.** Here’s the strategic reasoning: Goldman’s question pool is larger and includes LinkedIn’s core topics (Arrays, Strings, Hash Tables) plus the additional heavyweight of Dynamic Programming. If you build a study plan that conquers Goldman’s list—meaning you are strong on DP _and_ the fundamentals—you will have covered ~90% of LinkedIn’s technical requirements. You can then spend your final week or two solely brushing up on **Depth-First Search and Graph** problems to fill the LinkedIn-specific gap. Preparing in the reverse order (LinkedIn first) would leave you dangerously underprepared for Goldman’s DP focus.

In short, use Goldman Sachs prep as your comprehensive algorithm bootcamp. Then, layer on LinkedIn’s graph focus to become a well-rounded candidate for both.

For more detailed company-specific question lists and guides, visit the CodeJeet pages for [Goldman Sachs](/company/goldman-sachs) and [LinkedIn](/company/linkedin).
