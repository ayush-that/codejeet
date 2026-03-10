---
title: "Goldman Sachs vs Citadel: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Citadel — difficulty levels, topic focus, and preparation strategy."
date: "2030-11-06"
category: "tips"
tags: ["goldman-sachs", "citadel", "comparison"]
---

If you're preparing for interviews at both Goldman Sachs and Citadel, you're facing two distinct beasts in the financial technology space. While both are prestigious and demanding, their technical interviews reflect their different core businesses: Goldman Sachs, a global investment bank with massive engineering teams supporting complex financial systems, and Citadel, a quantitative hedge fund where performance is everything. Preparing for both simultaneously is possible, but requires a strategic approach that maximizes overlap while respecting their unique focuses.

## Question Volume and Difficulty

The raw numbers tell a clear story about breadth versus depth.

Goldman Sachs, with a tagged LeetCode question count of **270** (51 Easy, 171 Medium, 48 Hard), casts a wide net. This large volume suggests a few things: their interview process is highly standardized across many teams and global offices, they have a vast historical question bank, and they value a candidate's ability to handle a variety of common data structure problems. The heavy skew toward Medium-difficulty questions (63%) is the key takeaway. Goldman wants reliable, competent engineers who can cleanly solve standard problems under interview conditions. The presence of Hards indicates some roles (likely quant or core strat) demand exceptional problem-solving.

Citadel's profile is more concentrated and intense. With **96** tagged questions (6 Easy, 59 Medium, 31 Hard), the pool is smaller but significantly more challenging. The Hard percentage (~32%) is substantially higher than Goldman's (~18%). This reflects Citadel's performance-centric culture. They are filtering for candidates who can not only solve problems but solve _difficult_ problems optimally. The low Easy count signals they have little interest in testing basic competency; that's assumed. You're being assessed on your upper bound.

**Implication:** For Goldman, breadth of pattern recognition across many Medium problems is crucial. For Citadel, depth—mastering advanced techniques and optimizing complex algorithms—is paramount.

## Topic Overlap

The core technical overlap is significant, which is good news for your preparation.

**High-Overlap Topics (Study These First):**

- **Array & String:** The absolute fundamentals. Both companies test these incessantly. Expect manipulations, searching, sorting, and sliding window problems.
- **Hash Table:** The go-to tool for achieving O(1) lookups. Essential for problems involving pairs, counts, or quick membership checks.
- **Dynamic Programming:** A major focus for both. Goldman uses it to test systematic thinking; Citadel uses it to test optimization and state management for complex scenarios.

**Divergence:**

- **Goldman Sachs** has a broader distribution, with notable appearances from **Linked List**, **Tree**, **Graph**, and **SQL**. This aligns with their work on large-scale banking systems, transaction processing, and relational data.
- **Citadel's** concentration is sharper. While the top topics mirror Goldman's, the context is often **mathematical, probabilistic, or centered on low-latency optimization**. You're more likely to see problems involving randomness, statistics, or custom data structures for high-frequency scenarios.

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

1.  **Maximum ROI (Overlap Zone):** Dedicate **60-70%** of your coding prep here.
    - **Dynamic Programming:** Master 1D/2D patterns (Knapsack, LCS, LIS). Start with "Climbing Stairs (#70)", then "Coin Change (#322)", and "Longest Increasing Subsequence (#300)".
    - **Array/String + Hash Table:** This combo solves a huge swath of problems. Practice "Two Sum (#1)", "Group Anagrams (#49)", "Longest Substring Without Repeating Characters (#3)", and "Merge Intervals (#56)".

2.  **Goldman-Specific Priority (20%):** After mastering the overlap, ensure comfort with:
    - **Linked Lists & Trees:** "Reverse Linked List (#206)", "Merge Two Sorted Lists (#21)", "Validate Binary Search Tree (#98)".
    - **Graphs (BFS/DFS):** "Number of Islands (#200)", "Clone Graph (#133)".
    - **Basic SQL:** Joins, aggregation, filtering.

3.  **Citadel-Specific Priority (20%):** This is high-difficulty practice:
    - **Advanced DP & Memoization:** Problems with tricky state transitions.
    - **System Design & Optimization:** Be prepared to discuss the time/space trade-offs of your solution in extreme detail and suggest optimizations.
    - **Mathematical/Probability Puzzles:** Less about LeetCode patterns, more about quantitative reasoning.

## Interview Format Differences

The _how_ is as different as the _what_.

**Goldman Sachs:**

- **Structure:** Typically 2-3 technical rounds, often including a "superday" (back-to-back interviews). May include a HackerRank-style OA as a first filter.
- **Problems per Round:** Often 1-2 medium problems in 45-60 minutes.
- **Focus:** Clean code, communication, edge-case handling, and collaboration. They want to see you think aloud and be coachable.
- **Behavioral/System Design:** Behavioral questions ("Tell me about a time...") are standard. For senior roles, system design might focus on scalable financial data pipelines or APIs, not necessarily distributed cache design.

**Citadel:**

- **Structure:** Process can be very fast. May start with a tough HackerRank/CodeSignal OA. On-site/virtual rounds are intense and problem-dense.
- **Problems per Round:** Possibly 1 very hard problem or 2 medium-hard problems in 45-60 minutes. The expectation for speed and optimality is higher.
- **Focus:** Raw problem-solving speed, optimal algorithm derivation, and flawless implementation. Discussion may dive deep into constant-time optimizations.
- **Behavioral/System Design:** Less emphasis on classic behavioral narratives. System design discussions are likely to be practical and performance-oriented: "How would you design a matching engine?" or "Optimize this data feed processing pipeline."

## Specific Problem Recommendations for Both

Here are 5 problems that provide exceptional cross-company value:

1.  **Best Time to Buy and Sell Stock (#121 & #122):** The foundational finance-themed problem. #121 (one transaction) teaches Kadane's algorithm logic. #122 (unlimited transactions) is a simple greedy or DP problem. These are _must-know_.
2.  **Longest Palindromic Substring (#5):** Excellent for testing multiple approaches (brute force, expand around center, DP) and discussing time/space trade-offs. Hits String and DP.
3.  **Word Break (#139):** A classic Medium DP problem that moves beyond array sequences to dictionary matching. Tests if you can identify the DP state (segmentable up to index `i`).
4.  **Merge Intervals (#56):** A supremely practical pattern for dealing with ranges (think scheduling, time blocks). The sorting + linear merge approach is a pattern reused in many problems.
5.  **LRU Cache (#146):** Combines Hash Table and Linked List (or Ordered Dict) to design a real-world data structure. Tests your understanding of O(1) operations and data structure composition. Highly relevant to both caching (systems) and order book management (finance).

<div class="code-group">

```python
# Example: LeetCode #121 - Best Time to Buy and Sell Stock (One Transaction)
# Time: O(n) | Space: O(1)
def maxProfit(prices):
    """
    Kadane's Algorithm variant. Track the minimum price seen so far
    and calculate the potential profit every day.
    """
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        # Update the minimum price encountered so far
        min_price = min(min_price, price)
        # Calculate profit if sold at current price and update max
        current_profit = price - min_price
        max_profit = max(max_profit, current_profit)

    return max_profit
```

```javascript
// Example: LeetCode #121 - Best Time to Buy and Sell Stock (One Transaction)
// Time: O(n) | Space: O(1)
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (let price of prices) {
    minPrice = Math.min(minPrice, price);
    const currentProfit = price - minPrice;
    maxProfit = Math.max(maxProfit, currentProfit);
  }

  return maxProfit;
}
```

```java
// Example: LeetCode #121 - Best Time to Buy and Sell Stock (One Transaction)
// Time: O(n) | Space: O(1)
public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;

    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        int currentProfit = price - minPrice;
        maxProfit = Math.max(maxProfit, currentProfit);
    }

    return maxProfit;
}
```

</div>

## Which to Prepare for First?

**Prepare for Citadel first.**

This is counterintuitive but strategic. Citadel's interview is the higher ceiling. If you prepare to Citadel's standard—drilling hard problems, focusing on optimal solutions, and speeding up your implementation—you will be over-prepared for the breadth of Goldman's Medium-focused questions. The reverse is not true. Preparing for Goldman's breadth might leave you unable to tackle Citadel's depth.

Your study flow should be:

1.  **Phase 1 (Foundation):** Master the overlapping core topics (Array, String, Hash Table, DP) using Medium problems.
2.  **Phase 2 (Citadel Depth):** Ramp up difficulty within those topics. Push into Hard problems, especially in DP. Time yourself.
3.  **Phase 3 (Goldman Breadth):** Do a rapid review sweep of Goldman's secondary topics (Linked Lists, Trees, Graphs, SQL). This will feel easier after Phase 2.
4.  **Phase 4 (Company-Specific Tuning):** In the final days before each interview, focus on problems frequently reported for that specific company.

By preparing for the harder target first, you build skills that make the subsequent interview feel more manageable. Good luck.

For more detailed company-specific question lists and experiences, check out our pages for [Goldman Sachs](/company/goldman-sachs) and [Citadel](/company/citadel).
