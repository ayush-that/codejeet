---
title: "Uber vs Accenture: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Accenture — difficulty levels, topic focus, and preparation strategy."
date: "2030-02-13"
category: "tips"
tags: ["uber", "accenture", "comparison"]
---

If you're preparing for interviews at both Uber and Accenture, you're looking at two fundamentally different experiences. Uber is a product-driven tech giant where the coding interview is a high-stakes, algorithm-heavy gauntlet designed to filter for top-tier problem-solving speed and depth. Accenture, a global consulting and services firm, uses technical interviews primarily to assess baseline competency, logical reasoning, and the ability to handle client-focused project work. Preparing for both simultaneously is possible, but your strategy must be surgical: maximize overlap first, then branch out.

## Question Volume and Difficulty

The data tells a clear story of divergent intensity.

**Uber (381 questions: 54 Easy, 224 Medium, 103 Hard)**
This is a massive, challenging problem bank. The sheer volume (over 2.5x Accenture's) indicates that Uber's question pool is deep and constantly refreshed, making pure "grind-and-memorize" strategies less effective. The distribution is telling: nearly 60% of questions are Medium, and a significant 27% are Hard. This signals that passing a Uber coding round typically requires solving at least one Medium-Hard problem optimally under time pressure, often with a follow-up. You are being evaluated as a potential builder of complex, scalable systems.

**Accenture (144 questions: 65 Easy, 68 Medium, 11 Hard)**
The profile is that of a competency screen. The bank is smaller and heavily skewed towards foundational problems—45% Easy, 47% Medium, and only 8% Hard. The interview is designed to verify you can code competently, reason about basic algorithms, and perhaps handle straightforward data manipulation tasks common in business application development. The low Hard count suggests they are less interested in exotic algorithms and more in clean, correct, and maintainable solutions.

**Implication:** If you prep thoroughly for Uber, you will comfortably cover 90%+ of Accenture's technical ceiling. The reverse is not true.

## Topic Overlap

Both companies emphasize core data structures, but the depth of exploration differs.

**Shared Core (High-Value Prep):**

- **Array & String:** The absolute bedrock for both. Expect manipulations, searches, and basic transformations.
- **Hash Table:** The go-to tool for O(1) lookups. Critical for both.
- **Math:** Appears in both lists. For Accenture, it might be number properties or basic arithmetic logic. For Uber, it can extend into combinatorics or probability.

**Uber's Depth & Unique Focus:**

- **Dynamic Programming:** This is the standout. Uber's 103 Hard problems almost guarantee you'll face a DP or memoization challenge. It's a key differentiator. Mastering DP patterns (Knapsack, LCS, Fibonacci-style, Matrix traversal) is non-negotiable for Uber.
- **Graphs, Trees, & Intervals:** While not in the top 4 listed, they are pervasive in Uber's Medium/Hard problems. Questions like "Merge Intervals (#56)" or "Course Schedule (#207)" are classic.

**Accenture's Nuance:**

- The "Math" focus may lean more towards **logical puzzles, bit manipulation, or numerical efficiency** problems rather than advanced algorithm design. Think "Reverse Integer (#7)" or "Power of Two (#231)".

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

1.  **Max ROI / Overlap Zone (Study First):** Array, String, Hash Table. Solve all Easy and Medium problems in these categories on LeetCode. This builds the foundation for both.
2.  **Uber-Specific Depth (Study Second):** Dynamic Programming, followed by Graph (BFS/DFS) and Tree (Recursion) patterns. This is where you pass or fail the Uber interview.
3.  **Accenture-Specific Polish (Study Last):** Dedicate time to Easy/Medium "Math" category problems and ensure your code is exceptionally readable and well-commented. Practice explaining your logic in simple terms, as you might to a client.

## Interview Format Differences

This is where the careers diverge.

**Uber's Format:**

- **Process:** Typically 2-3 technical phone screens, followed by a 4-5 hour on-site/virtual loop.
- **Coding Rounds:** 45-60 minutes each. Expect 1-2 problems per round, often with multiple parts (e.g., solve it, then optimize it, then handle edge cases). The interviewer acts as an evaluator and will push you.
- **Other Rounds:** Heavy emphasis on **System Design** (even for mid-level roles) and **Behavioral** ("Uber Principles") questions. You need to demonstrate scalable architecture thinking.

**Accenture's Format:**

- **Process:** Often a shorter process: one technical phone screen, possibly a take-home assignment, and a final round with mixed technical/behavioral panels.
- **Coding Rounds:** 30-45 minutes. Often 1-2 simpler problems. The evaluation is as much on **communication, clarity, and process** as on raw algorithmic optimality. You may be asked to code in a shared editor and walk through your thought process.
- **Other Rounds:** Strong focus on **behavioral and situational questions** ("Tell me about a time you dealt with a difficult stakeholder"). System design is rare unless for a very specific architecture role.

## Specific Problem Recommendations

Here are 5 problems that provide exceptional cross-company prep value.

1.  **Two Sum (#1) - Easy:** The quintessential Hash Table problem. Mastering this teaches you the "complement lookup" pattern applicable to countless other problems. It's likely for Accenture and is foundational knowledge for Uber.
2.  **Valid Anagram (#242) - Easy:** Covers string manipulation, sorting, and hash table counting. It's a perfect warm-up problem that tests basic competency (Accenture) and can be a quick first part in a Uber interview.
3.  **Group Anagrams (#49) - Medium:** A direct step-up from #242. It reinforces hash table usage with a more complex key (sorted string or frequency tuple). Excellent for both companies.
4.  **Merge Intervals (#56) - Medium:** A classic pattern problem. It doesn't require advanced DS but tests sorting logic and edge-case handling. Common at Uber, and a strong Medium challenge for Accenture.
5.  **House Robber (#198) - Medium:** The ideal introduction to Dynamic Programming. It's a clear, 1D DP problem that teaches the core "decide at each step" memoization pattern critical for Uber, while still being approachable as a harder problem for Accenture prep.

<div class="code-group">

```python
# LeetCode #198 - House Robber | Time: O(n) | Space: O(1) - Optimized DP
def rob(nums):
    """
    DP State: rob1 = max profit up to prev house, rob2 = max profit up to current house.
    At each house, you choose: rob current (nums[i] + rob1) OR skip (rob2).
    """
    rob1, rob2 = 0, 0
    # [rob1, rob2, n, n+1, ...]
    for n in nums:
        # The new max for the current position is max(rob current, skip current)
        temp = max(n + rob1, rob2)
        rob1 = rob2  # Move rob1 forward
        rob2 = temp  # Move rob2 forward
    return rob2  # rob2 holds the max up to the last house
```

```javascript
// LeetCode #198 - House Robber | Time: O(n) | Space: O(1) - Optimized DP
function rob(nums) {
  // rob1 = max profit up to house i-2, rob2 = max profit up to house i-1
  let rob1 = 0,
    rob2 = 0;
  // [rob1, rob2, n, n+1, ...]
  for (const n of nums) {
    // Max profit if we rob current house (n + rob1) or skip it (rob2)
    const temp = Math.max(n + rob1, rob2);
    rob1 = rob2; // Shift window forward
    rob2 = temp;
  }
  return rob2; // rob2 now holds the answer for the last house
}
```

```java
// LeetCode #198 - House Robber | Time: O(n) | Space: O(1) - Optimized DP
public int rob(int[] nums) {
    // rob1 represents max profit up to (i-2), rob2 up to (i-1)
    int rob1 = 0, rob2 = 0;
    // [rob1, rob2, n, n+1, ...]
    for (int n : nums) {
        // Decision: rob current house or skip it
        int temp = Math.max(n + rob1, rob2);
        rob1 = rob2; // Advance the window
        rob2 = temp;
    }
    return rob2; // rob2 holds the final maximum
}
```

</div>

## Which to Prepare for First

**Prepare for Uber first.** Its scope completely envelops Accenture's technical requirements. A study plan that gets you Uber-ready (covering DP, Graphs, and complex Mediums) will make Accenture's technical rounds feel like a subset review. You can then spend the final days before an Accenture interview shifting mindset: practice verbalizing your reasoning clearly, rehearse behavioral stories about teamwork and clients, and ensure your solutions are straightforward and robust rather than clever and optimized.

Tackle the shared core (Array, String, Hash Table), then dive into Uber's depth areas (DP, Graphs). Use the recommended problems as benchmarks. If you can solve Group Anagrams and House Robber optimally and explain them clearly, you're in a strong position for both companies.

For more detailed company-specific question lists and patterns, visit the CodeJeet pages for [Uber](/company/uber) and [Accenture](/company/accenture).
