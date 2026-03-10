---
title: "Amazon vs Intuit: Interview Question Comparison"
description: "Compare coding interview questions at Amazon and Intuit — difficulty levels, topic focus, and preparation strategy."
date: "2028-12-20"
category: "tips"
tags: ["amazon", "intuit", "comparison"]
---

# Amazon vs Intuit: A Strategic Interview Question Comparison

If you're preparing for interviews at both Amazon and Intuit, or deciding where to focus your energy, you're looking at two distinct beasts. One is a global tech and logistics giant with a famously rigorous, high-volume process. The other is a financial software powerhouse with a more focused, domain-influenced interview style. The key insight isn't just that Amazon has more questions—it's _how_ and _why_ their approaches differ, and how you can build a single preparation strategy that efficiently covers both. Let's break it down.

## Question Volume and Difficulty: A Tale of Two Scales

The raw numbers tell a stark story. On platforms like LeetCode, Amazon has **1,938** tagged questions, dwarfing Intuit's **71**. This isn't just about company size; it's about interview philosophy and historical data collection.

**Amazon's** distribution (E:530, M:1057, H:351) reveals its core: a massive middle. The majority of questions are Medium difficulty. This signals that Amazon's technical screen is designed to consistently assess strong fundamentals and problem-solving under pressure. You're not expected to solve a "Red-Black Tree Inversion" daily, but you absolutely must handle array manipulations, string parsing, and dynamic programming with clean, optimal code. The high volume means they have a deep bench of problems to pull from, reducing the value of pure memorization and increasing the value of pattern recognition.

**Intuit's** distribution (E:10, M:47, H:14) is more concentrated. With only 71 tagged questions, the probability of encountering a problem you've seen or a close variant is higher. However, don't mistake a smaller pool for an easier interview. The Medium-heavy weighting (66% of their questions) aligns with Amazon, but the context often shifts. Intuit's problems frequently have a subtle "business logic" or data processing flavor, even when the underlying algorithm is standard.

**The Implication:** Preparing for Amazon's broad, high-volume style inherently builds the muscle memory for Intuit's more focused set. The reverse is less true. If you only study Intuit's tagged list, you'll be underprepared for the sheer variety Amazon can present.

## Topic Overlap: Your Foundation for Both

The good news for dual preparation is significant overlap in core topics. Both companies heavily test:

1.  **Array & String Manipulation:** The bread and butter. Think sorting, searching, two-pointer techniques, and sliding windows.
2.  **Hash Table:** The go-to tool for O(1) lookups, frequency counting, and mapping relationships. Essential for both.
3.  **Dynamic Programming:** A key differentiator for medium-to-hard questions. Both companies use DP to assess problem decomposition and optimization thinking.

This overlap is your strategic advantage. Mastering these three areas gives you a strong base for **over 70%** of the problems you're likely to see at either company. The depth of mastery differs, however. Amazon might embed a hash table within a complex graph traversal, while Intuit might use it to reconcile financial transaction records.

## Preparation Priority Matrix: Maximizing ROI

Use this matrix to prioritize your study time efficiently.

| Priority                    | Topics/Area                            | Rationale                                                                                              | Company Focus    |
| :-------------------------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------- | :--------------- |
| **Tier 1 (Do First)**       | **Array, String, Hash Table, DP**      | Foundational for both. Highest return on investment.                                                   | Amazon & Intuit  |
| **Tier 2 (Amazon Depth)**   | **Graphs (BFS/DFS), Trees, Recursion** | Amazon's larger question pool delves deeper into these. Crucial for their LP-style "go deep" problems. | Primarily Amazon |
| **Tier 3 (Intuit Nuance)**  | **Matrix/2D Array, Simulation**        | Intuit's problems often involve processing tabular data or step-by-step logic simulations.             | Primarily Intuit |
| **Tier 4 (Amazon Breadth)** | **System Design Fundamentals, OOD**    | For SDE II+ roles at Amazon. Intuit's coding rounds are less likely to include pure system design.     | Primarily Amazon |

## Interview Format Differences: Process and Pressure

Understanding the _structure_ is as important as the content.

**Amazon** follows the well-documented "Loop." For SDE I/II:

- **Online Assessment (OA):** 1-2 coding problems (70 mins) + a work style assessment.
- **Phone Screen/Virtual Onsite:** Typically 3-4 rounds of 60 minutes each.
- **Each Round:** 5-10 mins intro, 45-50 mins on 1-2 coding problems, 5-10 mins for your questions. You'll code in a shared editor (CoderPad/Chime).
- **The X-Factor:** The **Leadership Principles (LPs)**. Every answer—behavioral _and_ technical—is filtered through these. When explaining your solution, frame it with LP narratives: "I considered multiple solutions (Bias for Action, Invent and Simplify) before choosing this optimal one (Insist on the Highest Standards)."

**Intuit's** process is generally more streamlined:

- **OA/Phone Screen:** Similar structure: 1-2 coding problems.
- **Virtual Onsite:** Often 3-4 rounds as well, but may blend coding with more direct behavioral and domain-knowledge discussions.
- **Coding Rounds:** Often 1 problem per 45-60 minute round, sometimes with a follow-up. The expectation for perfect, runnable code might be slightly less intense than Amazon's, but clarity and communication remain key.
- **The X-Factor:** **Business Acumen.** You might get a problem about reconciling data streams or calculating taxes. The underlying algorithm is standard, but they're assessing if you can translate a business need into code.

## Specific Problem Recommendations for Dual Preparation

These problems test the overlapping Tier 1 topics in ways relevant to both companies.

1.  **Two Sum (#1) & Variations:** It's not about memorizing the hash map solution. It's about internalizing the pattern: "Do I need a map/dictionary to store what I've seen?" This pattern appears in dozens of problems at both companies.
2.  **Merge Intervals (#56):** A classic array/sorting problem with a clear, methodical solution path. It tests your ability to manage state and handle edge cases—a skill both companies value highly. Amazon might frame it as merging meeting times, Intuit as consolidating financial periods.
3.  **Longest Substring Without Repeating Characters (#3):** The definitive sliding window problem. Mastering this teaches you the template for any "find a subarray/substring satisfying a condition" problem, which is pervasive at Amazon and appears in Intuit's data processing questions.
4.  **Coin Change (#322):** A foundational Dynamic Programming problem. If you can clearly explain the transition from brute-force recursion to memoization to the bottom-up DP table, you demonstrate the systematic thinking both interview panels look for.
5.  **LRU Cache (#146):** This combines Hash Table (for O(1) access) and a Linked List (for order). It's a common Amazon question and excellent practice for designing a data structure under specific constraints—a skill that translates to Intuit's domain-specific logic problems.

<div class="code-group">

```python
# Example: Two Sum (Problem #1) - The foundational hash map pattern.
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    """
    Returns indices of the two numbers that add up to target.
    Uses a hash map to store `num: index` for O(1) lookups.
    """
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # Problem guarantees a solution, but safe return.

# This pattern is reused in problems like:
# - Contains Duplicate II (#219): Is there a duplicate within k indices?
# - Subarray Sum Equals K (#560): Can you adapt the map to store prefix sums?
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const seen = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>(); // value -> index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] {seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[] {}; // Guaranteed solution exists.
}
```

</div>

## Which to Prepare for First? The Strategic Order

**Prepare for Amazon first.**

Here’s why: Amazon's process is broader and deeper in pure algorithms and data structures. By grinding through a mix of Amazon's Top 50/100 questions and focusing on the Tier 1 & 2 topics, you will build a robust, generalizable problem-solving skillset. This foundation will make Intuit's problem set feel like a focused subset. You can then refine your approach by practicing Intuit's tagged questions to get a feel for their domain context and potentially see familiar problems.

**Your 4-Week Plan:**

- **Weeks 1-2:** Amazon Focus. Do 60-80 problems covering Array, String, Hash Table, and DP. Practice narrating your process using STAR method and Leadership Principles.
- **Week 3:** Intuit Integration. Run through all 71 Intuit-tagged problems. Note the business context. Revisit any Amazon problems that were challenging.
- **Week 4:** Mock Interviews. Do mocks in both styles: Amazon's (fast-paced, LP-focused) and Intuit's (methodical, clarity-focused).

By preparing for the harder, broader benchmark first, you position yourself to excel in both interviews. Remember, the core skill is not knowing 1,938 solutions, but recognizing 20 patterns that solve 1,938 problems. Start with Amazon's list to learn those patterns, then apply them to Intuit's world.

For deeper dives into each company's process, visit our dedicated guides: [Amazon Interview Guide](/company/amazon) and [Intuit Interview Guide](/company/intuit).
