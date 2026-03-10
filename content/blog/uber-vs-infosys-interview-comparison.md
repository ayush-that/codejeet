---
title: "Uber vs Infosys: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Infosys — difficulty levels, topic focus, and preparation strategy."
date: "2030-02-09"
category: "tips"
tags: ["uber", "infosys", "comparison"]
---

If you're preparing for interviews at both Uber and Infosys, you're looking at two fundamentally different experiences in the tech landscape. Uber represents a modern, fast-paced product tech company with a heavy emphasis on algorithmic problem-solving and system design at senior levels. Infosys, as a global consulting and IT services firm, often focuses on foundational programming skills, problem decomposition, and sometimes domain-specific logic. The good news? There's significant overlap in the core topics they test, which means you can prepare strategically for both simultaneously. The key is understanding where their priorities diverge so you can allocate your limited prep time effectively.

## Question Volume and Difficulty

The raw numbers tell an immediate story about interview intensity and the expected breadth of preparation.

**Uber (381 questions):** With 224 Medium and 103 Hard questions in their tagged list, Uber's interview process is notoriously rigorous. The high volume indicates they have a deep, well-documented question bank, and interviewers often pull from recent, challenging problems. The 58% Medium / 27% Hard split suggests you must be extremely comfortable with Medium problems and prepared to tackle at least one Hard problem, especially for more senior roles. You're not just being tested on whether you can solve a problem, but on how optimally and cleanly you can do it under time pressure.

**Infosys (158 questions):** With 82 Medium and 34 Hard questions, the overall volume is lower and the difficulty skews slightly easier. The 52% Medium / 22% Hard split still requires solid competency, but the emphasis often shifts. At Infosys, correctly implementing a clean, logical solution that handles edge cases can be as important as, or sometimes even more important than, achieving the absolute optimal time complexity for obscure corner cases. The smaller question bank might mean more repetition of certain classic problems.

**Implication:** Preparing for Uber will inherently cover the difficulty bar for Infosys. If you can solve a random Medium/Hard from Uber's list, you're likely over-prepared for the algorithmic rigor of a typical Infosys coding round. The reverse is not true.

## Topic Overlap and Divergence

Both companies heavily test **Array, String, and Dynamic Programming**. This is your high-value overlap zone.

- **Array & String:** These are the bread and butter. Expect manipulations, two-pointer techniques, sliding windows, and prefix sums.
- **Dynamic Programming:** A major focus for both. Uber might lean towards more complex DP states (e.g., multi-dimensional DP for problems like "Best Time to Buy and Sell Stock IV (#188)"), while Infosys might favor classical DP problems ("0/1 Knapsack", "Longest Common Subsequence (#1143)").

**Where they diverge:**

- **Uber's Unique Emphasis: Hash Table.** This is Uber's #2 topic. It reflects their need for engineers who can efficiently manage and lookup data, crucial for real-time systems like mapping and dispatch. Think **Two Sum (#1)** variants, frequency counting, and using hash maps to optimize solutions from O(n²) to O(n).
- **Infosys's Unique Emphasis: Math.** This is a strong #4 for Infosys. This often involves number theory, digit manipulation, or combinatorial problems. It tests logical reasoning and your ability to translate a wordy problem into a precise mathematical or iterative solution.

## Preparation Priority Matrix

Maximize your return on investment (ROI) with this study order:

1.  **High-ROI Overlap Topics (Study First):**
    - **Dynamic Programming:** Start with 1D (Fibonacci, Climbing Stairs (#70)), then 2D (Longest Common Subsequence (#1143)), then bounded/unbounded knapsack.
    - **Array & String:** Master two-pointer (for sorted arrays and linked lists), sliding window (for subarrays/substrings), and in-place modifications.

2.  **Uber-Priority Topics:**
    - **Hash Table:** Practice until using a hash map for O(1) lookups is second nature. This is often the key to optimizing Uber's array/string problems.
    - **Graphs & Trees:** While not in the top 4 listed, they are pervasive in Uber problems due to their mapping and routing core business. Be ready for BFS/DFS, Dijkstra's, and tree traversals.

3.  **Infosys-Priority Topics:**
    - **Math:** Practice problems involving prime numbers, GCD/LCM, modular arithmetic, and basic combinatorics. Ensure your logic for digit-based problems is flawless.
    - **Basic Data Structures:** You might see more straightforward problems involving stacks, queues, and linked lists, testing implementation correctness.

## Interview Format Differences

This is where the experiences truly split.

**Uber:**

- **Format:** Typically a phone screen (1 coding problem) followed by a virtual or on-site loop of 4-5 interviews.
- **Breakdown:** You'll face 2-3 pure coding rounds (45-60 mins each, often 2 problems per round), 1-2 system design rounds (critical for mid-senior roles), and 1 behavioral/cultural fit round ("Uber Values").
- **Pace & Expectation:** Fast. Interviewers expect you to clarify requirements, discuss approaches (including time/space complexity), code a working solution, and run through test cases—all within the allotted time. Communication is key.

**Infosys:**

- **Format:** Can vary more widely by role and location. Often begins with an online assessment (OA) featuring multiple choice and 1-2 coding questions. Successful candidates then proceed to technical and HR interviews.
- **Breakdown:** The technical interview may involve solving a problem on a whiteboard or shared editor, but it often blends into a discussion about your projects, problem-solving approach, and foundational computer science concepts. Pure system design is less common for junior roles but may appear for specific positions.
- **Pace & Expectation:** Often more methodical. They may be more interested in your step-by-step thought process and how you handle ambiguous requirements. Writing clean, compilable, and well-commented code can be highly valued.

## Specific Problem Recommendations for Dual Preparation

These problems test overlapping core concepts in ways relevant to both companies.

1.  **Longest Substring Without Repeating Characters (#3):** Covers **String, Hash Table (Set/Map), and Sliding Window**. This is a perfect Uber problem (hash table + string) that also tests logical boundary handling valued at Infosys.
2.  **Coin Change (#322):** A classic **Dynamic Programming** problem. It's fundamental DP (unbounded knapsack variant) and appears in various forms at both companies. Understanding the difference between the minimum coins and number of ways (Coin Change II (#518)) is crucial.
3.  **Merge Intervals (#56):** Tests **Array** sorting and merging logic. It's a highly practical pattern for time-based problems (relevant to Uber's dispatch systems) and a great test of clean iteration and edge-case management (valued at Infosys).
4.  **Two Sum (#1):** The quintessential **Hash Table** problem. It's so fundamental to Uber's focus and is the gateway to understanding map-based optimization for "find a pair" problems, a concept that can come up anywhere.
5.  **Maximum Subarray (#53):** (Kadane's Algorithm). A brilliant test of **Array** manipulation and simple **Dynamic Programming** logic. It's a must-know algorithm that's elegant and efficient, impressing interviewers at both companies.

<div class="code-group">

```python
# LeetCode #53 - Maximum Subarray (Kadane's Algorithm)
# Time: O(n) | Space: O(1)
def maxSubArray(nums):
    """
    Kadane's Algorithm: At each point, the max subarray ending here
    is either the current element alone, or it plus the max subarray
    ending at the previous position.
    """
    current_max = global_max = nums[0]
    for num in nums[1:]:
        # The core DP decision: start new or extend previous
        current_max = max(num, current_max + num)
        global_max = max(global_max, current_max)
    return global_max
```

```javascript
// LeetCode #53 - Maximum Subarray (Kadane's Algorithm)
// Time: O(n) | Space: O(1)
function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // The core DP decision: start new or extend previous
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}
```

```java
// LeetCode #53 - Maximum Subarray (Kadane's Algorithm)
// Time: O(n) | Space: O(1)
public int maxSubArray(int[] nums) {
    int currentMax = nums[0];
    int globalMax = nums[0];

    for (int i = 1; i < nums.length; i++) {
        // The core DP decision: start new or extend previous
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        globalMax = Math.max(globalMax, currentMax);
    }
    return globalMax;
}
```

</div>

## Which to Prepare for First?

**Prepare for Uber first.**

Here’s the strategic reasoning: The depth and breadth required for Uber's technical interviews will automatically raise your competency to a level that exceeds the general coding bar for Infosys. By focusing on Uber's list—especially the Medium and Hard problems—you will solidify your skills in DP, hash tables, and complex array/string manipulations. Once that foundation is strong, you can efficiently "top up" your preparation by practicing a selection of Infosys's Math-focused problems and reviewing classical algorithm implementations. This approach gives you the highest chance of success at both, whereas preparing for Infosys first might leave critical gaps for Uber's more demanding process.

In short, use Uber's question bank as your primary training ground. Its difficulty will forge the skills you need. Then, tailor your final review with Infosys's specific flavor of logical and mathematical problems.

For more detailed company-specific question lists and insights, visit the CodeJeet pages for [Uber](/company/uber) and [Infosys](/company/infosys).
