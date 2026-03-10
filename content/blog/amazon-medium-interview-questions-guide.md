---
title: "Medium Amazon Interview Questions: Strategy Guide"
description: "How to tackle 1057 medium difficulty questions from Amazon — patterns, time targets, and practice tips."
date: "2031-12-13"
category: "tips"
tags: ["amazon", "medium", "interview prep"]
---

When you hear "Medium difficulty" in the context of an Amazon interview, you should think: **this is the core of the technical screen.** While Easy questions test basic competency and Hard questions are often used as tiebreakers or for specialized roles, Medium questions are the primary tool for assessing your problem-solving, coding, and design skills for the SDE I/II level. They are not just about finding _a_ solution; they are engineered to see if you can find the _optimal_ solution within a reasonable timeframe while navigating trade-offs, edge cases, and clarifying ambiguous requirements. The jump from Easy to Medium at Amazon is significant—it's where you move from applying a single concept to orchestrating multiple data structures and algorithmic techniques to solve a more complex, often real-world-adjacent problem.

## Common Patterns and Templates

Amazon's Medium questions heavily favor problems that model real-world system behaviors: managing orders, optimizing resources, processing streams, and traversing hierarchical data. The most frequent patterns you'll encounter are:

- **Sliding Window / Two Pointers:** For subarray/substring problems with constraints (e.g., longest substring with K distinct characters).
- **Tree/Graph Traversal (BFS/DFS):** For hierarchical data (file systems, organization charts) and pathfinding.
- **Hash Map + Heap (Priority Queue):** For frequency/top-K problems (e.g., top K frequent items in a stream).
- **Intervals:** For scheduling and merging time-based operations.
- **Monotonic Stack/Queue:** For problems involving finding the next greater/smaller element or calculating areas in histograms.

A quintessential Amazon Medium pattern is the **"K-sized Sliding Window with Hash Map for Constraint Tracking."** This template solves problems like "Longest Substring with At Most K Distinct Characters" (LeetCode #340) or "Fruit Into Baskets" (LeetCode #904).

<div class="code-group">

```python
def sliding_window_template(s: str, k: int) -> int:
    """
    Template for K-constraint sliding window problems.
    Finds the maximum length of a substring with at most K distinct characters.
    Time: O(n) | Space: O(k) [or O(1) if charset is fixed]
    """
    char_count = {}
    left = 0
    max_len = 0

    for right in range(len(s)):
        # 1. Expand window: add right char to counter
        right_char = s[right]
        char_count[right_char] = char_count.get(right_char, 0) + 1

        # 2. Shrink window while constraint is violated (> K distinct chars)
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # 3. Update answer after ensuring window is valid
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
function slidingWindowTemplate(s, k) {
  /**
   * Template for K-constraint sliding window problems.
   * Finds the maximum length of a substring with at most K distinct characters.
   * Time: O(n) | Space: O(k) [or O(1) if charset is fixed]
   */
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Expand window: add right char to counter
    const rightChar = s[right];
    charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

    // 2. Shrink window while constraint is violated (> K distinct chars)
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // 3. Update answer after ensuring window is valid
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
public int slidingWindowTemplate(String s, int k) {
    /**
     * Template for K-constraint sliding window problems.
     * Finds the maximum length of a substring with at most K distinct characters.
     * Time: O(n) | Space: O(k) [or O(1) if charset is fixed]
     */
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand window: add right char to counter
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // 2. Shrink window while constraint is violated (> K distinct chars)
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // 3. Update answer after ensuring window is valid
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you should aim to solve a Medium problem in **25-30 minutes**. This leaves crucial time for problem clarification, discussion of trade-offs, testing with examples, and follow-up questions. The interviewer is evaluating a checklist:

1.  **Clarification:** Do you ask about input constraints, edge cases (empty string, large K, negative numbers), and output format before coding?
2.  **Communication:** Do you explain your thought process, including initial brute-force ideas and why you're optimizing?
3.  **Optimal Solution:** Can you arrive at the efficient (often O(n) or O(n log n)) solution?
4.  **Clean Implementation:** Is your code modular, with meaningful variable names and minimal redundancy?
5.  **Testing:** Do you walk through your code with a small example and mention edge cases?
    Getting the correct output is only one data point. The stronger signal is how you _navigate_ to that output.

## Key Differences from Easy Problems

Easy problems typically require a single, straightforward technique: a single loop, a basic BFS, or a direct hash map lookup. Medium problems introduce **constraint management** and **multiple moving parts**. The mindset shift is from "what tool solves this?" to "how do I coordinate these tools to maintain an invariant?"

For example, an Easy problem might ask you to find if a string contains duplicates (use a Set). A Medium problem, like the sliding window template above, asks you to find the _longest_ substring with _at most K_ duplicates, requiring you to manage a counter map _and_ a sliding window _simultaneously_ to maintain the "at most K distinct chars" invariant. New techniques required include: designing custom data structures (e.g., a Node for LRU Cache), using auxiliary data structures (a heap alongside a hash map), and performing multi-step graph traversals with state.

## Specific Patterns for Medium

Beyond the sliding window, two other high-frequency Amazon Medium patterns are:

**1. Tree Level-Order Traversal (BFS) for Serialization/Deserialization**
Problems like "Serialize and Deserialize a Binary Tree" (LeetCode #297) are classic. The pattern uses BFS with a queue to process nodes level by level, which is intuitive for serialization formats.

**2. Hash Map + Heap for Top K Frequent Elements**
This pattern solves problems like "Top K Frequent Words" (LeetCode #692). You first count frequencies with a hash map (O(n)), then use a min-heap of size K to keep the top elements (O(n log K)). The key is to implement a custom comparator for the heap to handle tie-breakers (e.g., alphabetical order).

## Practice Strategy

Don't just solve randomly. Use a targeted approach:

1.  **Pattern-First Learning:** Dedicate weeks to specific patterns. E.g., Week 1: Sliding Window. Solve 8-10 Amazon-tagged Medium problems for that pattern.
2.  **Daily Target:** Aim for 2-3 _high-quality_ solutions per day. For each problem:
    - Spend 15-20 minutes trying to solve it independently.
    - If stuck, study the solution, understand the pattern, then _close the tab and re-implement it from scratch_.
    - Write out the time/space complexity and test with edge cases.
3.  **Recommended Order:** Start with high-frequency patterns: Sliding Window, Tree BFS/DFS, Hash Map + Heap. Then move to Intervals, Monotonic Stack, and Graph problems.
4.  **Mock Interviews:** Once you've covered core patterns, do timed 45-minute sessions solving _unseen_ Amazon Medium problems. This simulates interview pressure.

The goal is to build muscle memory for patterns so that in the interview, you can focus on problem-specific nuances and clear communication, not on recalling algorithms from scratch.

[Practice Medium Amazon questions](/company/amazon/medium)
