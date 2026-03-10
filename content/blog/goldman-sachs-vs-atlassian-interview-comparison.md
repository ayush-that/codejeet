---
title: "Goldman Sachs vs Atlassian: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Atlassian — difficulty levels, topic focus, and preparation strategy."
date: "2030-11-28"
category: "tips"
tags: ["goldman-sachs", "atlassian", "comparison"]
---

# Goldman Sachs vs Atlassian: A Strategic Interview Question Comparison

If you're preparing for interviews at both Goldman Sachs and Atlassian, you're looking at two very different beasts in the tech landscape. Goldman Sachs represents the intense, high-stakes world of financial technology where algorithmic precision meets business logic. Atlassian embodies the product-driven engineering culture of a successful SaaS company. The good news? There's significant overlap in their technical screening, which means strategic preparation can cover both. The bad news? Their interview formats and emphasis differ meaningfully, requiring tailored approaches. Let's break down what matters.

## Question Volume and Difficulty: What the Numbers Tell Us

Goldman Sachs' LeetCode profile shows 270 questions (51 Easy, 171 Medium, 48 Hard), while Atlassian lists 62 (7 Easy, 43 Medium, 12 Hard). These aren't just random counts—they reveal interview philosophy.

Goldman's massive question bank suggests two things: First, they have a long history of technical interviews with many reported questions. Second, and more importantly, they tend to ask **variations on core patterns** rather than sticking to a small set of classics. The 171 Medium questions indicate this is their sweet spot—problems that require solid algorithmic knowledge but aren't purely academic. The 48 Hard questions often appear in final rounds or for senior roles.

Atlassian's smaller, more concentrated question bank (62 total) suggests they focus on **well-established, high-signal problems**. With 43 Medium questions (69% of their total), they clearly prioritize problems that test practical problem-solving over either trivial exercises or obscure algorithms. This smaller set means you're more likely to encounter problems that have been asked before, making targeted preparation more effective.

**Implication:** For Goldman, you need breadth across patterns. For Atlassian, you need depth on their favorites.

## Topic Overlap: Shared Prep Value

Both companies heavily test:

- **Array manipulation** (sliding window, two-pointer, prefix sums)
- **String operations** (palindromes, anagrams, parsing)
- **Hash Table applications** (frequency counting, memoization)

This overlap is your preparation sweet spot. Master these, and you're covering 60-70% of what both companies test. The patterns here are highly transferable.

Where they diverge:

- **Goldman Sachs uniquely emphasizes Dynamic Programming** (48 questions tagged). This makes sense for finance—optimization problems, maximizing value, minimizing risk. You'll see DP in stock trading problems, resource allocation, and combinatorial optimization.
- **Atlassian emphasizes Sorting algorithms** beyond basic array sorts—think custom comparators, interval sorting, and problems where sorting enables an optimal solution.
- Goldman also tests more **Graph algorithms** and **Tree traversals** than Atlassian's profile suggests.

## Preparation Priority Matrix

Here's how to allocate your study time if interviewing at both:

**Tier 1 (Study First - Maximum ROI):**

- Array: Two-pointer technique, sliding window, subarray sums
- Hash Table: Frequency maps, complement finding, caching
- String: Palindrome validation, anagram detection, basic parsing

**Tier 2 (Goldman-Specific):**

- Dynamic Programming: Knapsack variations, stock trading patterns, minimum path problems
- Graphs: BFS/DFS on grids, shortest path in weighted graphs

**Tier 3 (Atlassian-Specific):**

- Advanced Sorting: Custom comparator problems, interval merging after sorting
- Design-oriented problems: Simple system design elements in coding questions

## Interview Format Differences

**Goldman Sachs** typically follows:

1. **HackerRank assessment** (90 minutes, 2-3 problems)
2. **Technical phone screen** (45-60 minutes, 1-2 problems)
3. **Superday** (4-6 back-to-back interviews including coding, system design for seniors, and behavioral)
   - Coding rounds: 45 minutes each, often 1 Medium-Hard problem
   - Heavy on financial context: "Given stock prices..." or "Optimize trade execution..."
   - Expect follow-up optimization questions

**Atlassian's process is more streamlined:**

1. **Initial technical screen** (CoderPad/CodeSignal, 60-75 minutes)
2. **Virtual on-site** (3-4 rounds, 45 minutes each)
   - Coding: 1-2 problems per round, often product-adjacent
   - System design: For mid-level and above, focused on scalability
   - Behavioral: Strong emphasis on collaboration and Jira/Confluence thinking
   - They value clean, maintainable code over clever tricks

**Key difference:** Goldman tests more problems in less time per problem. Atlassian gives more time for discussion and code quality.

## Specific Problem Recommendations for Both Companies

These 5 problems cover patterns both companies love:

1. **Two Sum (#1)** - The ultimate hash table warm-up. Goldman might ask for indices, Atlassian might ask for values. Both test your complement-finding intuition.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}
```

</div>

2. **Best Time to Buy and Sell Stock (#121)** - Financial context for Goldman, optimization thinking for Atlassian. Tests array traversal and maintaining minimum.

3. **Merge Intervals (#56)** - Appears in both question banks. Tests sorting comprehension and interval logic. Goldman might frame as scheduling trades; Atlassian as merging time periods.

4. **Longest Substring Without Repeating Characters (#3)** - Classic sliding window problem. Tests hash table usage for tracking seen characters and window adjustment logic.

5. **Coin Change (#322)** - Dynamic Programming fundamental. Essential for Goldman's DP emphasis, but also tests optimization thinking valuable for Atlassian's product scaling questions.

## Which to Prepare for First?

**Prepare for Goldman Sachs first.** Here's why:

1. **Breadth-first preparation:** Goldman's wider question coverage forces you to learn more patterns. Once you've covered their DP, graphs, arrays, and strings, you're already prepared for 90% of Atlassian's technical questions.

2. **Intensity prepares you for ease:** Goldman's faster-paced, problem-dense interviews will make Atlassian's more conversational format feel manageable. The reverse isn't true—preparing only for Atlassian might leave gaps for Goldman.

3. **Pattern transferability:** The financial context in Goldman problems is usually superficial. Underneath "maximize portfolio value" is often just a knapsack problem. These core algorithms serve you everywhere.

**Strategic timeline:** If interviews are close together, spend 70% of time on shared fundamentals and Goldman's unique topics (especially DP), then 30% on Atlassian's behavioral prep and sorting deep-dives.

Remember: Both companies ultimately test problem-solving, not memorization. Understand why each pattern works, when to apply it, and how to communicate your thinking. The patterns above will serve you at both companies—and beyond.

For more company-specific details, check out our [Goldman Sachs interview guide](/company/goldman-sachs) and [Atlassian interview guide](/company/atlassian).
