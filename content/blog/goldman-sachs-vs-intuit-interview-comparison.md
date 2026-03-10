---
title: "Goldman Sachs vs Intuit: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Intuit — difficulty levels, topic focus, and preparation strategy."
date: "2030-11-16"
category: "tips"
tags: ["goldman-sachs", "intuit", "comparison"]
---

# Goldman Sachs vs Intuit: A Strategic Interview Question Comparison

If you're preparing for interviews at both Goldman Sachs and Intuit, you're looking at two distinct engineering cultures with overlapping but differently weighted technical assessments. Goldman Sachs represents high-frequency trading and financial systems engineering, while Intuit focuses on product-driven financial software like TurboTax and QuickBooks. The key insight? Their question banks reveal how each company prioritizes different aspects of problem-solving under pressure. Preparing strategically for both isn't just about solving more problems—it's about understanding which patterns each company values most.

## Question Volume and Difficulty

The raw numbers tell an immediate story about interview intensity.

**Goldman Sachs** maintains a massive 270-question bank (51 Easy, 171 Medium, 48 Hard). This volume suggests two things: first, their interviewers draw from a deep, well-established pool of problems, making pattern recognition more valuable than memorization. Second, the heavy Medium skew (63% of questions) indicates they're testing for consistent, reliable problem-solving under time constraints—the kind needed in financial systems where edge cases matter. The 48 Hard problems typically appear in later rounds for specialized roles.

**Intuit** operates with a leaner 71-question bank (10 Easy, 47 Medium, 14 Hard). Don't mistake this for easier interviews. The 66% Medium concentration is actually higher than Goldman's percentage-wise, suggesting Intuit focuses intensely on core algorithmic competency without excessive breadth. Their smaller bank means you're more likely to encounter known problems or close variants, making targeted preparation highly effective.

The implication: Goldman interviews feel like a marathon where you need broad pattern recognition, while Intuit interviews are a sprint where depth on core topics matters most.

## Topic Overlap

Both companies share a remarkably similar top-four topic distribution:

1. **Array** (foundational for both)
2. **Dynamic Programming** (high priority for financial/optimization problems)
3. **String** (data processing competency)
4. **Hash Table** (efficiency fundamentals)

This overlap isn't coincidental. Arrays and hash tables form the backbone of efficient data manipulation, while dynamic programming appears frequently in optimization scenarios—portfolio optimization at Goldman, tax calculation optimization at Intuit. String manipulation reflects the reality that both companies process massive amounts of textual financial data.

Where they diverge: Goldman places additional emphasis on **Graph** problems (financial networks, dependency resolution) and **Tree** problems (hierarchical data structures common in financial instruments). Intuit shows stronger representation in **Sorting** and **Greedy** algorithms, reflecting product-focused optimization decisions.

## Preparation Priority Matrix

Maximize your return on study time with this layered approach:

**Tier 1: Overlap Topics (Study First)**

- Dynamic Programming: Master both 1D and 2D patterns
- Array manipulation: Sliding window, two-pointer, prefix sum
- String algorithms: Palindrome, anagram, substring problems
- Hash Table applications: Frequency counting, complement finding

**Tier 2: Goldman-Specific Emphasis**

- Graph traversal (DFS/BFS) and shortest path
- Tree traversals and modifications
- Bit manipulation (for low-level optimization)

**Tier 3: Intuit-Specific Emphasis**

- Sorting with custom comparators
- Greedy algorithms with proof of optimality
- Matrix/2D array traversal

For overlap topics, these LeetCode problems provide exceptional cross-company value:

- **#53 Maximum Subarray** (Kadane's algorithm, foundational DP)
- **#3 Longest Substring Without Repeating Characters** (sliding window + hash map)
- **#139 Word Break** (classic DP with string/array intersection)
- **#56 Merge Intervals** (array sorting with edge cases)

## Interview Format Differences

**Goldman Sachs** typically follows:

1. Phone screen (1-2 coding problems, 45 minutes)
2. Superday or virtual onsite (3-5 rounds back-to-back)
3. Each round: 45 minutes, often 1 Medium-Hard problem or 2 Mediums
4. Heavy emphasis on optimization follow-ups: "Can you improve time/space?"
5. System design appears for senior roles (trading systems, data pipelines)
6. Behavioral questions are integrated into technical rounds

**Intuit** generally structures:

1. Initial technical screen (1 problem, 60 minutes)
2. Virtual onsite (3-4 rounds separated or consecutive)
3. 45-60 minute coding rounds, usually 1-2 problems
4. Strong focus on clean, maintainable code and test cases
5. Separate behavioral round focusing on product thinking
6. System design for mid-level and above (scaling financial data systems)

Key distinction: Goldman's rapid-fire rounds test performance under pressure, while Intuit's slightly longer formats allow more discussion of approach and maintainability.

## Specific Problem Recommendations

These five problems provide maximum coverage for both companies:

1. **#121 Best Time to Buy and Sell Stock** - Financial theme perfect for both. Tests array traversal and simple DP thinking.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxProfit(prices):
    if not prices:
        return 0

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
// Time: O(n) | Space: O(1)
function maxProfit(prices) {
  if (prices.length === 0) return 0;

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
// Time: O(n) | Space: O(1)
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;

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

2. **#322 Coin Change** - Classic DP with financial application. Tests both memoization and tabulation approaches.

3. **#49 Group Anagrams** - Hash table and string manipulation combined. Frequently appears in both companies' interviews.

4. **#200 Number of Islands** - Graph/DFS problem favored by Goldman that also tests matrix traversal relevant to Intuit.

5. **#253 Meeting Rooms II** - Interval problem with sorting and heap usage. Tests optimization thinking for both scheduling (Intuit) and resource allocation (Goldman).

## Which to Prepare for First

Start with **Intuit**, then expand to **Goldman Sachs**. Here's why:

Intuit's focused question bank (71 problems) lets you build core competency efficiently. Mastering their Medium-heavy emphasis on arrays, strings, and DP creates a solid foundation. You'll cover 80% of overlapping topics with concentrated effort.

Then, expand to Goldman's broader 270-problem bank. Use your Intuit preparation as the core, then add graph, tree, and more advanced DP patterns. This progression naturally builds from fundamentals to breadth.

If interviews are scheduled close together, allocate 60% of time to overlap topics, 25% to Goldman-specific patterns, and 15% to Intuit-specific patterns. Always practice explaining your reasoning aloud—Goldman values optimization justification, while Intuit values maintainability discussions.

Remember: Both companies ultimately test how you think about financial data systems. Every array manipulation question could be stock prices. Every string problem could be transaction descriptions. Every DP optimization could be tax calculation. Frame your solutions with this context in mind.

For company-specific question lists and recent interview experiences, check our dedicated pages: [Goldman Sachs Interview Questions](/company/goldman-sachs) and [Intuit Interview Questions](/company/intuit).
