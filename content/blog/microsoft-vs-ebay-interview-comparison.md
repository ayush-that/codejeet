---
title: "Microsoft vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Microsoft and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2029-07-08"
category: "tips"
tags: ["microsoft", "ebay", "comparison"]
---

If you're preparing for interviews at both Microsoft and eBay, or trying to decide where to focus your energy, you're facing a classic contrast between a tech giant with a sprawling, well-documented interview process and a more specialized company with a narrower, but still rigorous, focus. The key insight isn't just that Microsoft has more questions—it's that the _nature_ of the preparation and the interview experience differs significantly. Preparing for one will give you a strong, but incomplete, foundation for the other. Let's break down what that means for your study plan.

## Question Volume and Difficulty: A Tale of Two Scales

The raw numbers tell a clear story. On platforms like LeetCode, Microsoft has over 1,350 tagged questions, while eBay has around 60. This disparity isn't just about company size; it's a direct reflection of interview philosophy and historical data collection.

**Microsoft's** distribution (Easy: 379, Medium: 762, Hard: 211) reveals a process designed to test breadth and depth. The heavy skew toward Medium problems is the hallmark of a standard FAANG-level interview: you must reliably solve non-trivial algorithmic challenges under pressure. The presence of a solid number of Hard problems means senior or specialized roles will push into advanced DP, graph theory, or complex system design.

**eBay's** distribution (Easy: 12, Medium: 38, Hard: 10) suggests a more targeted approach. With a smaller question pool, the interview is less about encountering a vast array of patterns and more about demonstrating core competency and clean code on fundamental topics. The Medium focus is still there, but the overall scope is narrower. This doesn't mean eBay interviews are easier—it means variance is lower, and mastering their core topics is absolutely critical.

**Implication:** Preparing for Microsoft is a marathon that builds immense general interview stamina. Preparing for eBay is a targeted sprint where depth on a few topics may matter more than recognizing 50 different patterns.

## Topic Overlap: The High-Value Common Ground

Both companies heavily test the foundational trio: **Array, String, and Hash Table**. This is your highest-yield study area. If you can efficiently manipulate arrays and strings, and use hash maps for O(1) lookups to optimize solutions, you're 70% of the way to passing the coding screen at either company.

- **Shared Priority:** Array/string traversal, two-pointer techniques, sliding window, prefix sums, and hash map-based lookups (for problems like Two Sum).
- **The Divergence:** Microsoft's list includes **Dynamic Programming**, which is a major differentiator. DP problems (like Coin Change, Longest Increasing Subsequence, or Decode Ways) are a staple at Microsoft for mid-to-senior levels and represent a significant step up in difficulty. eBay's list highlights **Sorting**, which often pairs with the core topics (e.g., "merge intervals" requires sorting first).

**Unique to Microsoft:** Graph, Tree, DFS/BFS, Greedy, and the aforementioned DP. These topics expand the problem space into classic computer science domains.
**Unique to eBay:** The list is more focused, but the emphasis on Sorting as a called-out topic suggests you should be ready to implement or leverage efficient sorts (QuickSort, MergeSort) and use sorting as a key preprocessing step.

## Preparation Priority Matrix

Use this to allocate your study time strategically if interviewing at both.

| Priority                             | Topics                                           | Reason                                                     | Sample LeetCode Problems for Practice                                                                             |
| :----------------------------------- | :----------------------------------------------- | :--------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Tier 1 (Study First)**             | **Array, String, Hash Table**                    | Universal fundamentals. Highest ROI for both companies.    | #1 Two Sum, #238 Product of Array Except Self, #3 Longest Substring Without Repeating Characters                  |
| **Tier 2 (Microsoft-First)**         | **Dynamic Programming, Trees (DFS/BFS), Graphs** | Critical for Microsoft, less likely at eBay.               | #70 Climbing Stairs (DP intro), #102 Binary Tree Level Order Traversal, #200 Number of Islands (Graph/DFS)        |
| **Tier 3 (eBay-First / Refinement)** | **Sorting, In-Depth Array/String Manipulation**  | eBay's explicit sorting focus; mastering nuances for both. | #56 Merge Intervals (sorting key), #15 3Sum (sorting + two-pointer), #937 Reorder Data in Log Files (custom sort) |

## Interview Format Differences

This is where the experience diverges beyond just the questions.

**Microsoft** typically follows a well-known loop: 1-2 phone screens (often a single 45-60 minute coding round), followed by a 4-5 hour virtual or on-site final round. The final round usually consists of 3-4 independent interviews: 2-3 focused on coding/algorithms (often on a whiteboard tool like CoderPad or directly in VS Code), 1 on system design (for mid-level+), and 1 on behavioral/cultural fit (the famous "As Appropriate" questions). They value clarity, edge-case handling, and the ability to discuss trade-offs.

**eBay's** process is generally leaner. It often starts with a recruiter call, followed by 1-2 technical phone screens (coding and/or system design discussion). The virtual on-site might consist of 2-3 rounds: coding, system design (depending on level), and behavioral. The coding problems are more likely to be directly related to data processing, API design, or real-world e-commerce scenarios (e.g., designing a shopping cart, matching bids, filtering listings). The emphasis is on practical, clean, and maintainable code.

**Key Takeaway:** Microsoft's process tests you as a generalist software engineer with strong CS fundamentals. eBay's process often tests you as an engineer who can apply those fundamentals to their business domain.

## Specific Problem Recommendations for Dual Preparation

Here are 5 problems that efficiently cover the shared and unique ground. Master these in all three languages.

<div class="code-group">

```python
# LeetCode #56 - Merge Intervals
# Why: Covers eBay's Sorting priority and array manipulation. A classic.
# Time: O(n log n) for sort | Space: O(n) for output (or O(log n) for sort space)
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        # Sort by start time (eBay's sorting focus)
        intervals.sort(key=lambda x: x[0])
        merged = [intervals[0]]
        for current_start, current_end in intervals[1:]:
            last_start, last_end = merged[-1]
            # Overlap: merge by updating the end of the last interval
            if current_start <= last_end:
                merged[-1][1] = max(last_end, current_end)
            else:
                merged.append([current_start, current_end])
        return merged
```

```javascript
// LeetCode #1 - Two Sum
// Why: The quintessential hash table problem. Foundational for both.
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const map = new Map(); // number -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return []; // Problem guarantees a solution
}
```

```java
// LeetCode #238 - Product of Array Except Self
// Why: Excellent array manipulation. Tests understanding of prefix/postfix.
// Time: O(n) | Space: O(1) (if output array doesn't count)
public class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        // First, calculate prefix products in the answer array
        answer[0] = 1;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];
        }
        // Then, calculate postfix product on the fly and multiply
        int postfix = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] = answer[i] * postfix;
            postfix *= nums[i];
        }
        return answer;
    }
}
```

</div>

**Also practice:**

- **#200 Number of Islands (Graph DFS/BFS):** A Microsoft staple for graph traversal.
- **#70 Climbing Stairs (Dynamic Programming):** The perfect introduction to DP thinking for Microsoft.

## Which to Prepare for First?

**Prepare for Microsoft first.** Here’s the strategic reasoning:

1.  **The Foundation Principle:** Microsoft's broader scope forces you to build a comprehensive CS foundation. Mastering arrays, strings, hash tables, DP, and graphs for Microsoft automatically makes you over-prepared for eBay's core topics.
2.  **The Difficulty Buffer:** If you can solve Medium-level problems with the pressure of a potential Hard, eBay's Mediums will feel more manageable. The reverse is not true; preparing only for eBay's focused list leaves giant gaps for Microsoft.
3.  **Efficiency:** It's more efficient to study broadly and then refine (for eBay) than to study narrowly and then scramble to learn entirely new domains (like DP for Microsoft).

Spend 70% of your time on the Tier 1 and Tier 2 topics from the matrix. In the final 1-2 weeks before your eBay interview, shift focus to the Tier 3 topics, particularly sorting-heavy array problems and practicing articulating how your solutions apply to data-intensive or e-commerce-like scenarios.

By understanding these contrasts, you can craft a preparation strategy that is not just about solving problems, but about adapting your problem-solving mindset to two distinct—but equally rewarding—engineering cultures.

For more detailed company-specific question lists and experiences, check out the [Microsoft interview guide](/company/microsoft) and the [eBay interview guide](/company/ebay).
