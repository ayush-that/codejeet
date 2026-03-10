---
title: "Bloomberg vs Goldman Sachs: Interview Question Comparison"
description: "Compare coding interview questions at Bloomberg and Goldman Sachs — difficulty levels, topic focus, and preparation strategy."
date: "2029-08-05"
category: "tips"
tags: ["bloomberg", "goldman-sachs", "comparison"]
---

If you're preparing for interviews at both Bloomberg and Goldman Sachs, you're in a unique position. On the surface, they seem like different worlds—a financial data and media giant versus an investment banking titan. However, for software engineering roles, their technical interviews converge more than you'd think. The key insight is that Bloomberg's process is a marathon of breadth, while Goldman Sachs often focuses on a narrower, more predictable set of problems with a heavier emphasis on financial context. Preparing for one can significantly help with the other, but you need a smart, prioritized strategy to maximize your return on study time.

## Question Volume and Difficulty

The raw numbers tell the first part of the story. On LeetCode, Bloomberg has tagged **1,173 questions**, while Goldman Sachs has **270**. This disparity isn't just about company size; it's a direct reflection of interview style and history.

- **Bloomberg (E391/M625/H157):** The distribution is classic. A large middle of Medium problems forms the core of their technical screens and on-site rounds. You will face a mix, but expect most questions to be Medium. The high number of total questions means they have a deep, varied question bank. You cannot rely on memorizing a short list of "favorites." The interview tests your fundamental problem-solving agility across many domains.
- **Goldman Sachs (E51/M171/H48):** The volume is lower, and the Easy-to-Medium ratio is higher. This suggests a more focused interview process. The questions are less about surprising you with obscure algorithms and more about testing clean, efficient code, logical reasoning, and often, how you handle data modeling or problems with a financial twist (e.g., calculating profit, matching orders, simulating trades). The Hard problems are less frequent but do appear, especially for senior roles.

**Implication:** Preparing for Bloomberg will over-prepare you for the pure coding difficulty at Goldman Sachs. The reverse is not true. If you only study the Goldman Sachs list, you'll likely encounter a Bloomberg problem outside your prepared scope.

## Topic Overlap

Both companies heavily test **Array, String, and Hash Table** problems. This is the foundational trifecta for any coding interview, but for these two, it's especially pronounced. These topics are the bread and butter of data manipulation, which is central to both financial data systems (Bloomberg Terminal) and trading/risk platforms (Goldman).

- **Shared High-Value Topics:** Array, String, Hash Table.
- **Diverging Topics:**
  - **Bloomberg Unique/Heavy:** **Math** is a standout. This includes number theory, simulation, and combinatorics problems. You might get questions about implementing a calculator, generating prime numbers, or simulating a game.
  - **Goldman Sachs Unique/Heavy:** **Dynamic Programming (DP)** is more prominent in their tagged list relative to Bloomberg. This aligns with optimization problems common in finance (e.g., maximizing profit, minimizing cost, optimal resource allocation). **Greedy** algorithms also frequently accompany these.

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

1.  **Highest Priority (Overlap Zone - Study First):**
    - **Topics:** Array, String, Hash Table.
    - **Goal:** Achieve fluency. These are guaranteed to appear in some form at both companies.
    - **Sample Problems:** `Two Sum (#1)`, `Valid Anagram (#242)`, `Group Anagrams (#49)`, `Merge Intervals (#56)`, `Top K Frequent Elements (#347)`.

2.  **Medium Priority (Company-Specific):**
    - **For Bloomberg:** Dive into **Math** and **Simulation** problems. Practice implementing functions without relying on heavy data structures.
    - **For Goldman Sachs:** Drill **Dynamic Programming** (1D and 2D) and **Greedy** patterns. Understand the "why" behind the state transition.
    - **Sample Problems:**
      - _Bloomberg (Math):_ `Rotate Image (#48)`, `Multiply Strings (#43)`, `Integer to Roman (#12)`.
      - _Goldman (DP):_ `Best Time to Buy and Sell Stock (#121)`, `Coin Change (#322)`, `Longest Increasing Subsequence (#300)`.

3.  **Lower Priority (Once Core is Solid):**
    - **Bloomberg:** Their list includes Trees and Graphs. Be comfortable with traversals (BFS/DFS).
    - **Goldman Sachs:** Some Linked List and Tree problems appear; know the basics.

## Interview Format Differences

- **Bloomberg:**
  - **Structure:** Typically a phone screen (1-2 coding problems) followed by a full on-site (4-6 rounds). The on-site is a mix of coding, system design (for experienced candidates), and domain-specific interviews about the Bloomberg Terminal and financial markets.
  - **Coding Rounds:** Often two 45-minute coding sessions back-to-back with different engineers. Problems are given on a laptop, and you're expected to write runnable code. Interviewers are engineers and will debug with you.
  - **Behavioral:** Significant. "Why Bloomberg?" is a major question. They assess cultural fit and interest in their products.

- **Goldman Sachs:**
  - **Structure:** Often begins with a HackerRank assessment. Then, a series of video conference interviews (2-3) leading to a "Superday" (virtual or in-person), which is several interviews in one day.
  - **Coding Rounds:** Problems can be more abstract or worded as financial scenarios. You might be asked to design a class or a set of functions rather than just a single algorithm. Whiteboarding or a shared editor is common.
  - **Behavioral & Domain:** Heavy on teamwork, handling pressure, and understanding of basic financial concepts. For tech roles in divisions like Securities or Engineering, expect questions about markets.

## Specific Problem Recommendations for Dual Preparation

These problems cover overlapping topics and patterns highly relevant to both companies.

1.  **Merge Intervals (#56) - Medium:** A quintessential array/sorting problem with immense practical application in scheduling, which is analogous to matching buy/sell orders or consolidating data feeds. It tests your ability to manage state while iterating.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (or O(1) if sorted in-place)
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_end = merged[-1][1]
        if current_start <= last_end:  # Overlap
            merged[-1][1] = max(last_end, current_end)
        else:
            merged.append([current_start, current_end])
    return merged
```

```javascript
// Time: O(n log n) | Space: O(n)
function merge(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const lastMerged = merged[merged.length - 1];
    if (currStart <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], currEnd);
    } else {
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    int[] current = intervals[0];
    merged.add(current);
    for (int[] interval : intervals) {
        if (interval[0] <= current[1]) {
            current[1] = Math.max(current[1], interval[1]);
        } else {
            current = interval;
            merged.add(current);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

2.  **Two Sum (#1) - Easy:** The foundational hash table problem. Its variants (e.g., pairs summing to a target, subarray sums) are everywhere. Goldman might frame it as finding pairs of trades, Bloomberg as matching data points.

3.  **Best Time to Buy and Sell Stock (#121) - Easy:** This is the perfect bridge problem. It's a Goldman Sachs staple (DP/Greedy), but its core logic—tracking a minimum and maximizing a difference—is pure array manipulation that Bloomberg loves. Know its variants (`#122`, `#123`).

4.  **Valid Parentheses (#20) - Easy:** A classic stack problem that tests your understanding of state management and matching, relevant for parsing financial messages or data formats (like JSON, which is huge at Bloomberg).

5.  **Word Break (#139) - Medium:** A high-value DP problem that appears on both lists. It teaches the core "subproblem decomposition" mindset of DP, which is critical for Goldman's optimization problems and useful for Bloomberg's string/text processing challenges.

## Which to Prepare for First?

**Prepare for Bloomberg first.** Here’s the strategic reasoning:

1.  **Breadth Covers Depth:** Mastering the broader, more challenging Bloomberg question set will build a stronger algorithmic foundation. The skills you develop will directly apply to Goldman's more focused list.
2.  **The Difficulty Bridge is One-Way:** Going from Goldman-level prep to a Bloomberg interview leaves gaps. Going from Bloomberg-level prep to a Goldman interview means you'll likely find the coding portion more manageable, allowing you to focus on the financial context and system design aspects.
3.  **Efficiency:** You can study the overlapping core topics (Array, String, Hash Table) intensely, then layer on Bloomberg's Math and Goldman's DP. This creates a cohesive study plan rather than two separate ones.

Start with the overlapping core topics, then integrate Bloomberg's Math-heavy problems. In the final 1-2 weeks before your Goldman interview, shift focus to reviewing DP patterns and practicing framing solutions in a financial context (e.g., "This is similar to finding an arbitrage opportunity" or "We can model this as a knapsack problem for risk allocation").

For more detailed company-specific question lists and experiences, check out the CodeJeet pages for [Bloomberg](/company/bloomberg) and [Goldman Sachs](/company/goldman-sachs).
