---
title: "Goldman Sachs vs JPMorgan: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and JPMorgan — difficulty levels, topic focus, and preparation strategy."
date: "2030-11-12"
category: "tips"
tags: ["goldman-sachs", "jpmorgan", "comparison"]
---

If you're interviewing at both Goldman Sachs and JPMorgan Chase, you're likely targeting a software engineering role in a tech-adjacent space—think trading systems, risk platforms, payment infrastructure, or data analytics. While both are bulge-bracket banks, their engineering interviews have distinct flavors, volumes, and focal points. Preparing for them identically is a mistake. The key insight is this: **Goldman Sachs interviews like a top tech firm with a finance tilt, while JPMorgan interviews like a traditional enterprise with a modern coding screen.** Your preparation should reflect that hierarchy of intensity.

## Question Volume and Difficulty

The raw numbers tell a clear story. On platforms like LeetCode, Goldman Sachs is associated with **~270 tagged questions** (51 Easy, 171 Medium, 48 Hard). JPMorgan has **~78 tagged questions** (25 Easy, 45 Medium, 8 Hard).

**What this implies:**

- **Goldman Sachs (GS):** The high volume, especially the significant number of Medium and Hard problems, indicates a deeply entrenched tech interview culture. Engineers here are expected to solve non-trivial algorithmic challenges under pressure, similar to FAANG. The breadth suggests you could see almost any classic data structure problem.
- **JPMorgan Chase (JPMC):** The smaller, easier question bank suggests a more focused screening process. The interviews aim to verify competent coding skills and problem-solving ability, not to push the boundaries of algorithmic optimization. The low number of Hard problems is particularly telling—you're unlikely to face a brutally complex DP problem.

In short, a Goldman Sachs interview will likely feel more intense and unpredictable. A JPMorgan interview will feel more structured and manageable, but don't mistake that for being easy—their Medium problems still require clean, correct code.

## Topic Overlap

Both firms heavily test **Array, String, and Hash Table** manipulations. This is your absolute core. These topics form the basis of most real-world data processing tasks in finance (e.g., parsing trade data, aggregating transactions, matching orders).

- **Shared Prep Value:** Mastering these three topics gives you the highest return on investment (ROI) for both companies. A problem that combines a hash map with array traversal is a safe bet for either.
- **The Divergence:** The major difference is **Dynamic Programming (DP)**. It's a listed key topic for Goldman Sachs but not for JPMorgan. This aligns with the difficulty data—DP problems often classify as Hard or tricky Mediums. Goldman's need for DP skills might relate to optimization problems in resource allocation or pathfinding within trading systems. JPMorgan's listed inclusion of **Sorting** is also telling; it often pairs with array problems for solutions involving two pointers or greedy approaches, which are more common in their difficulty range.

## Preparation Priority Matrix

Use this to triage your study time effectively.

1.  **Tier 1: Overlap Topics (Study First)**
    - **Topics:** Array, String, Hash Table.
    - **Goal:** Solve 20-30 problems here until patterns like two-pointers, sliding window, and prefix sums are automatic.
    - **Recommended Problems (Useful for Both):**
      - **Two Sum (#1):** The quintessential hash map problem.
      - **Merge Intervals (#56):** Very relevant for time-based financial data.
      - **Valid Anagram (#242):** Classic string/hash table check.
      - **Group Anagrams (#49):** Excellent hash map + string manipulation combo.

2.  **Tier 2: Goldman Sachs Unique/Emphasized**
    - **Topic:** Dynamic Programming.
    - **Goal:** Don't ignore this if GS is on your list. Focus on 1D and 2D DP classics.
    - **Recommended Problems:** Climbing Stairs (#70), Coin Change (#322), Longest Increasing Subsequence (#300).

3.  **Tier 3: JPMorgan Unique/Emphasized**
    - **Topic:** Sorting.
    - **Goal:** Understand the _applications_ of sorting (enabling two-pointer solutions, greedy picks). You don't need to implement quicksort; know how to use the language's sort function.
    - **Recommended Problems:** Merge Sorted Array (#88), Meeting Rooms II (LeetCode Premium #253).

## Interview Format Differences

This is where the "tech firm vs. enterprise" distinction becomes practical.

- **Goldman Sachs:** Typically involves **2-3 technical rounds** after an initial HackerRank/CodeSignal assessment. The on-site (or virtual equivalent) problems are often given one at a time with 30-45 minutes each. Interviewers dive deep on optimization and edge cases. **System design** is common for experienced roles, often focusing on high-throughput, low-latency, or highly reliable systems (e.g., design a limit order book, a risk calculation service). Behavioral questions ("Tell me about a time...") are present but secondary to technical prowess.
- **JPMorgan Chase:** The process is often more streamlined. A single **60-90 minute technical interview** (following an OA) might contain 2-3 smaller problems or one larger, multi-part problem. The focus is on correctness, clarity, and communication. **System design is less consistently emphasized** for non-senior roles and, when asked, may lean toward traditional enterprise or data-intensive systems. Behavioral and motivational fit ("Why JPMorgan? Why finance?") can carry more weight than at GS.

## Specific Problem Recommendations for Dual Preparation

These problems efficiently cover patterns relevant to both companies.

1.  **Best Time to Buy and Sell Stock (#121):** This is finance-adjacent and a perfect **array + one-pass** problem. It teaches the "track minimum so far" pattern, which is a DP/greedy hybrid. Essential.
2.  **Longest Substring Without Repeating Characters (#3):** The definitive **sliding window + hash table** problem. It's a Medium that tests your ability to manage a dynamic window and a character map—critical for both firms.
3.  **Product of Array Except Self (#238):** A brilliant **array + prefix/postfix** problem. It's a Medium that feels like a Hard if you haven't seen the pattern. It demonstrates clever space optimization (going from O(n) to O(1) extra space) which Goldman loves, and clean array manipulation which JPMorgan expects.

<div class="code-group">

```python
# Problem #121: Best Time to Buy and Sell Stock
# Time: O(n) | Space: O(1)
def maxProfit(prices):
    """
    One-pass approach: track the minimum price seen so far.
    At each day, calculate potential profit and update max.
    """
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit
```

```javascript
// Problem #121: Best Time to Buy and Sell Stock
// Time: O(n) | Space: O(1)
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (let price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  return maxProfit;
}
```

```java
// Problem #121: Best Time to Buy and Sell Stock
// Time: O(n) | Space: O(1)
public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;

    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
}
```

</div>

## Which to Prepare for First?

**Prepare for Goldman Sachs first.** Here’s the strategic reasoning: the scope of preparation required for Goldman Sachs is a **superset** of what's needed for JPMorgan. If you drill into Medium/Hard problems on arrays, strings, hash tables, and DP, you will automatically over-prepare for the JPMorgan interview. The reverse is not true. Preparing only for JPMorgan's scope would leave you vulnerable to Goldman's harder questions.

Your study path should look like this:

1.  **Weeks 1-3:** Master Tier 1 (Overlap) topics to fluency.
2.  **Weeks 4-5:** Tackle Tier 2 (GS DP). Practice explaining your DP table state transitions clearly.
3.  **Week 6 (if JPMC interview is first):** Do a focused review of Tier 1 problems and practice articulating your thought process out loud, as JPMC values communication. Toss in a few sorting application problems.
4.  **Always:** In the final 48 hours before any interview, solve 2-3 problems from that specific company's tagged list to get a feel for their question style.

By using this tiered, GS-first approach, you turn the higher difficulty into an advantage, ensuring you walk into either interview with confidence.

For more detailed breakdowns of each company's process, visit our guides for [Goldman Sachs](/company/goldman-sachs) and [JPMorgan Chase](/company/jpmorgan).
