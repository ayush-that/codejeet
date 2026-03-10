---
title: "Intuit vs Wix: Interview Question Comparison"
description: "Compare coding interview questions at Intuit and Wix — difficulty levels, topic focus, and preparation strategy."
date: "2026-05-13"
category: "tips"
tags: ["intuit", "wix", "comparison"]
---

If you're interviewing at both Intuit and Wix, or trying to decide where to focus your limited prep time, you're facing a common but solvable challenge. Both are established tech companies, but their engineering cultures and interview styles reflect their different domains: Intuit (financial/accounting software like QuickBooks and TurboTax) leans toward robust, data-heavy systems, while Wix (website building and SaaS) emphasizes front-end interactivity and user-facing features. The good news? There's significant overlap in their technical screening, meaning you can prepare efficiently for both. The key is understanding the nuance in their question distributions and formats to avoid studying the wrong things.

## Question Volume and Difficulty

Let's break down the numbers from their tagged LeetCode problems.

**Intuit: 71 questions** (Easy: 10, Medium: 47, Hard: 14)
**Wix: 56 questions** (Easy: 16, Medium: 31, Hard: 9)

The first takeaway is **volume**. Intuit has ~27% more tagged problems. This doesn't necessarily mean their interviews are harder, but it suggests a broader _potential_ question bank and possibly a longer history of systematic technical interviewing. More importantly, look at the **difficulty distribution**.

Intuit's breakdown is **14% Easy, 66% Medium, 20% Hard**.
Wix's breakdown is **29% Easy, 55% Medium, 16% Hard**.

This tells a clear story: **Intuit's interviews skew more difficult.** A full one-fifth of their tagged questions are Hard, compared to Wix's one-sixth. Their Medium count is also dominant. If you're prepping for Intuit, you _must_ be comfortable with a solid set of Medium problems and a few classic Hards. For Wix, you can prioritize Mediums but should still be ready for a challenging problem.

## Topic Overlap

Both companies heavily test **Array, String, and Hash Table** problems. This is the core of algorithmic interviewing and your foundation. Where they diverge is telling:

- **Intuit's Unique Emphasis: Dynamic Programming (DP).** This is the most significant difference. DP problems (like knapsack, LCS, or coin change variants) are classic for testing optimization and recursive thinking on structured data—very relevant for financial calculations and transaction processing. Their 71 questions include a meaningful number of DP problems.
- **Wix's Unique Emphasis: Depth-First Search (DFS).** Graph and tree traversal, especially DFS, appears prominently. This makes perfect sense for a company whose product manipulates a DOM tree (a tree structure) and builds complex, nested user interfaces. You're likely to see problems involving tree serialization, path finding, or component rendering logic.

**Shared Foundation:** Array/String/Hash Table problems often involve two-pointers, sliding windows, or prefix sums. Mastering these patterns gives you maximum return on investment (ROI) for both companies.

## Preparation Priority Matrix

Use this to triage your study time efficiently.

1.  **High Priority (Study First - Overlap Topics):**
    - **Array Manipulation:** Two Sum variants, subarray problems (Sliding Window, Kadane's Algorithm).
    - **String Operations:** Palindrome checks, string parsing, anagram problems.
    - **Hash Table Applications:** Frequency counting, caching for O(1) lookups, designing keys for group-by operations.
    - **Recommended Problem (Covers Multiple Patterns): LeetCode #560 "Subarray Sum Equals K".** It uses a hash table (prefix sum) to solve an array problem efficiently. Perfect for both.

2.  **Medium Priority (Intuit-Specific):**
    - **Dynamic Programming:** Start with 1D DP (Climbing Stairs, Coin Change) and move to 2D DP (Longest Common Subsequence, Edit Distance).
    - **Recommended Problem: LeetCode #322 "Coin Change".** A classic DP problem with clear real-world analogies to financial systems.

3.  **Medium Priority (Wix-Specific):**
    - **Depth-First Search (Trees & Graphs):** Tree traversal (inorder, preorder, postorder), path sum problems, clone graph.
    - **Recommended Problem: LeetCode #133 "Clone Graph".** A quintessential DFS/BFS problem that tests understanding of graph traversal and reference handling.

## Interview Format Differences

Beyond the questions, _how_ you're interviewed differs.

**Intuit** tends to have a more traditional software engineering interview loop, especially for backend or full-stack roles.

- **Rounds:** Often includes 1-2 phone screens (coding), a virtual or on-site with 3-4 rounds covering coding, system design, and behavioral ("Leadership Principles").
- **Coding Problems:** You might get a single, more complex problem per 45-60 minute round, sometimes with multiple follow-up parts. The Hard problems in their list are in play.
- **System Design:** Expect a system design round for mid-level (E4/E5) and above, potentially related to scalable data processing or APIs.

**Wix**, reflecting its product-centric and frontend-leaning culture, often integrates practical considerations.

- **Rounds:** Coding rounds may involve problems that mirror web development challenges (e.g., DOM manipulation logic, event handling simulation).
- **Problem Context:** Even algorithmic questions might be framed in a UI/browser context. For example, a DFS problem might be about traversing a nested component tree.
- **System Design:** For senior frontend roles, "frontend system design" (e.g., designing a reusable component, state management for a feature) is as likely as traditional backend system design.

## Specific Problem Recommendations for Dual Prep

Here are 3 problems that provide exceptional value for preparing for both companies, as they teach patterns applicable across their focus areas.

**1. LeetCode #238 "Product of Array Except Self"**

- **Why:** An array problem that doesn't use a hash table, forcing you to think in terms of prefix and suffix passes. It's a Medium that feels like an Easy once you grasp the pattern, and it's a favorite for testing clean, O(1) extra space solutions. Common at both companies.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) [output array not counted]
def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n

    # Prefix pass: answer[i] = product of all elements before i
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]

    # Suffix pass: multiply answer[i] by product of all elements after i
    suffix = 1
    for i in range(n-1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]

    return answer
```

```javascript
// Time: O(n) | Space: O(1)
function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(1)
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];

    // Prefix pass
    answer[0] = 1;
    for (int i = 1; i < n; i++) {
        answer[i] = answer[i-1] * nums[i-1];
    }

    // Suffix pass
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] = answer[i] * suffix;
        suffix *= nums[i];
    }

    return answer;
}
```

</div>

**2. LeetCode #49 "Group Anagrams"**

- **Why:** A perfect hash table problem that tests your ability to design a custom key. It combines string manipulation (sorting or frequency counting) with hash map grouping. This pattern is ubiquitous.

**3. LeetCode #139 "Word Break"**

- **Why:** This is your bridge problem. It's a classic **Dynamic Programming** problem (favored by Intuit) that can also be approached with **DFS + memoization** (relevant to Wix's graph traversal focus). Solving it both ways will make you stronger for either interview.

## Which to Prepare for First?

**Prepare for Intuit first.** Here's the strategic reasoning:

1.  **Difficulty Escalation:** Preparing for Intuit's heavier Medium/Hard load and DP focus will automatically cover the Medium-difficulty and core array/string problems common at Wix. The reverse isn't true; prepping only for Wix might leave you under-prepared for Intuit's tougher questions.
2.  **Pattern Coverage:** Mastering DP gives you a powerful, general tool for optimization problems. DFS is more specific. It's easier to learn DFS after a solid algorithmic foundation than to learn DP quickly.
3.  **Efficiency:** Your study plan becomes: **Core Patterns (Array/String/Hash) -> Dynamic Programming -> Depth-First Search**. This flows naturally from fundamental to advanced.

In practice, if you have an Intuit interview in 4 weeks and a Wix interview in 6, spend the first 3 weeks on core patterns and DP. The final 3 weeks can then be spent on DFS and doing mock interviews with Wix's slightly more contextual problems.

Remember, the goal isn't to memorize 127 problems. It's to internalize the two dozen patterns that allow you to solve them. Focus on the overlap, then branch out to the company-specific specialties.

For more detailed breakdowns of each company's process, visit our pages for [Intuit](/company/intuit) and [Wix](/company/wix).
