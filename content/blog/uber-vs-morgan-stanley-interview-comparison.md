---
title: "Uber vs Morgan Stanley: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Morgan Stanley — difficulty levels, topic focus, and preparation strategy."
date: "2030-04-12"
category: "tips"
tags: ["uber", "morgan-stanley", "comparison"]
---

If you're preparing for interviews at both Uber and Morgan Stanley, you're essentially studying for two different types of exams with the same textbook. Both companies test core data structures and algorithms, but the volume, difficulty, and interview format differ dramatically. Understanding these differences is crucial for efficient preparation. The key insight is this: Uber's process is a marathon of medium-to-hard problems testing algorithmic creativity, while Morgan Stanley's is a sprint of fundamentals with a heavier emphasis on domain knowledge and system design for financial systems. Preparing for Uber will make you over-prepared for Morgan Stanley's coding rounds, but not the other way around.

## Question Volume and Difficulty

The numbers tell a clear story. Uber has a tagged pool of **381 questions** on LeetCode, with a distribution of 54 Easy, 224 Medium, and 103 Hard problems. This is a massive, well-documented corpus that indicates intense, problem-solving-focused interviews. The high proportion of Medium and Hard problems (86%) means you must be comfortable with complex problem decomposition, advanced data structure manipulation, and optimizing for edge cases under time pressure.

In stark contrast, Morgan Stanley has only **53 tagged questions**: 13 Easy, 34 Medium, and 6 Hard. The volume is an order of magnitude smaller. This doesn't mean their interviews are easy; it means the scope is narrower and more predictable. The focus is overwhelmingly on fundamentals (Easy/Medium make up ~89%). The handful of Hard problems often relate to specific financial computing scenarios or complex dynamic programming.

**Implication:** For Uber, breadth and depth of practice is non-negotiable. For Morgan Stanley, deep mastery of core patterns is sufficient, but you must pair it with strong system design and behavioral skills.

## Topic Overlap

Both companies heavily test the Big Four: **Array, String, Hash Table, and Dynamic Programming**. This is your highest-ROI study zone.

- **Array/String/Hash Table:** These form the backbone of most problems. At Uber, expect these to be combined in complex ways (e.g., hash maps tracking state for sliding windows on strings). At Morgan Stanley, they appear in more straightforward data manipulation tasks.
- **Dynamic Programming:** A critical shared topic. Uber uses DP for optimization problems related to routing, pricing, or resource allocation (e.g., unique paths, coin change variants). Morgan Stanley uses DP for classic combinatorial problems and financial calculations (e.g., knapsack variants for portfolio optimization).

**Unique Flavors:**

- **Uber** leans into **Graphs** (simulating ride networks), **Trees** (hierarchical data like trip planning), and **Design** questions (scaling real-time systems).
- **Morgan Stanley** has a noticeable emphasis on **Math** and **Brainteaser** questions, reflecting a quantitative finance culture, and **Object-Oriented Design** for modeling financial instruments.

## Preparation Priority Matrix

Use this to triage your study time:

1.  **MAXIMUM ROI (Study First):** Array, String, Hash Table, Dynamic Programming, Two Pointers, Sorting, Binary Search.
2.  **Uber-Specific Priority:** Graph (DFS/BFS, Topological Sort), Tree (Traversals, BST), Trie, Heap, Advanced Sliding Window, Union Find.
3.  **Morgan Stanley-Specific Priority:** Math & Probability (brainteasers), Object-Oriented Design, Basic System Design (throughput, latency, consistency for trade systems).

A strategic approach: Master the shared core (1), then layer on Uber's advanced topics (2). This will automatically cover Morgan Stanley's coding needs. Finally, dedicate separate time to Morgan Stanley's domain-specific prep (3).

## Interview Format Differences

This is where the experiences truly diverge.

**Uber:**

- **Format:** Typically 4-5 rounds onsite/virtual, including 2-3 coding rounds, 1 system design, and 1 behavioral/experience.
- **Coding Rounds:** 45-60 minutes, often with **2 problems per round**. The interviewer expects a fully working, optimal solution for the first, and significant progress on the second. Follow-up questions on scalability are common.
- **System Design:** Heavyweight. Expect to design a real-world Uber service (e.g., "Design Uber Eats," "Design a Ride Matching Service"). Focus on real-time data, geospatial queries, and global scale.

**Morgan Stanley:**

- **Format:** Often starts with a HackerRank, followed by 2-3 technical rounds and heavy behavioral/fit interviews.
- **Coding Rounds:** 30-45 minutes, usually **1 problem** with multiple parts. They value clean, correct, and maintainable code over clever one-liners. You'll be asked to explain your reasoning step-by-step.
- **System Design:** Can be "System Design" (scaling a data pipeline for market data) or "Object-Oriented Design" (design a deck of cards, a parking lot, or a trading system). The focus is on clarity, correctness, and modeling domain constraints.

## Specific Problem Recommendations

These 5 problems provide excellent crossover value, touching on the core shared topics in ways both companies test.

1.  **Two Sum (#1):** The quintessential Hash Table problem. Master all variants (sorted input, two-sum II, data stream version). It's fundamental for both.
2.  **Merge Intervals (#56):** Excellent for testing array sorting and traversal logic. Uber might use it for merging time windows; Morgan Stanley for consolidating financial periods.
3.  **Longest Substring Without Repeating Characters (#3):** Perfectly combines String, Hash Table, and the Sliding Window pattern. A classic medium-difficulty problem for both.
4.  **Coin Change (#322):** A canonical Dynamic Programming problem. Understanding this unlocks a whole class of minimization/maximization problems relevant to both ride pricing (Uber) and financial optimization (MS).
5.  **Word Break (#139):** A step-up in DP difficulty that also touches on String and Hash Table (for the word dictionary). It teaches how to break down a complex string problem into subproblems.

<div class="code-group">

```python
# Example: LeetCode #3 - Longest Substring Without Repeating Characters
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s: str) -> int:
    char_index_map = {}  # Hash Table to store the most recent index of each character
    left = 0
    max_length = 0

    for right, char in enumerate(s):
        # If char is seen and its last index is within our current window, shrink window
        if char in char_index_map and char_index_map[char] >= left:
            left = char_index_map[char] + 1
        # Update the char's latest index
        char_index_map[char] = right
        # Calculate current window length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(min(m, n))
function lengthOfLongestSubstring(s) {
  const charIndexMap = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charIndexMap.has(char) && charIndexMap.get(char) >= left) {
      left = charIndexMap.get(char) + 1;
    }
    charIndexMap.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
// Time: O(n) | Space: O(min(m, n))
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndexMap = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (charIndexMap.containsKey(c) && charIndexMap.get(c) >= left) {
            left = charIndexMap.get(c) + 1;
        }
        charIndexMap.put(c, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

## Which to Prepare for First

**Prepare for Uber first.** Here’s the strategic rationale:

1.  **The coverage is superset:** The intense algorithmic grind for Uber will make Morgan Stanley's coding rounds feel like a subset. You'll have seen harder variants of most problems they might ask.
2.  **Builds stamina:** Practicing to solve two medium-hard Uber problems in an hour makes solving one medium Morgan Stanley problem in 45 minutes feel manageable.
3.  **Sequential focus:** After your Uber prep, you can shift mental gears. Dedicate the final week(s) before your Morgan Stanley interview to: a) reviewing the core Easy/Medium problems from their tagged list, b) practicing financial brainteasers and math, and c) drilling object-oriented and system design with a finance lens (think concurrency, data integrity, APIs for trading).

In essence, use Uber prep to build your algorithmic engine, and then customize the bodywork for Morgan Stanley's specific terrain. Good luck.

For more company-specific insights, visit our guides: [Uber Interview Guide](/company/uber) | [Morgan Stanley Interview Guide](/company/morgan-stanley)
