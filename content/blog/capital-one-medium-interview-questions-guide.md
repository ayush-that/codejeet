---
title: "Medium Capital One Interview Questions: Strategy Guide"
description: "How to tackle 36 medium difficulty questions from Capital One — patterns, time targets, and practice tips."
date: "2032-08-17"
category: "tips"
tags: ["capital-one", "medium", "interview prep"]
---

Medium questions at Capital One typically assess a candidate's ability to translate a business or logical problem into a working algorithm. Unlike easier questions that might focus on syntax or a single concept, these problems often require combining 2-3 core patterns, handling edge cases carefully, and writing clean, maintainable code. They form the bulk of their technical assessment, so mastering them is crucial.

## Common Patterns

Capital One's Medium problems frequently test data manipulation, state tracking, and pathfinding. You'll encounter these core patterns:

1.  **Hash Maps for Frequency/State:** Used for counting, deduplication, or memoization. Many problems involve tracking characters, transactions, or user states.
    <div class="code-group">

    ```python
    # Example: Find the first unique character
    def first_uniq_char(s: str) -> int:
        count = {}
        for ch in s:
            count[ch] = count.get(ch, 0) + 1
        for i, ch in enumerate(s):
            if count[ch] == 1:
                return i
        return -1
    ```

    ```javascript
    // Example: Find the first unique character
    function firstUniqChar(s) {
      const count = new Map();
      for (const ch of s) {
        count.set(ch, (count.get(ch) || 0) + 1);
      }
      for (let i = 0; i < s.length; i++) {
        if (count.get(s[i]) === 1) return i;
      }
      return -1;
    }
    ```

    ```java
    // Example: Find the first unique character
    public int firstUniqChar(String s) {
        Map<Character, Integer> count = new HashMap<>();
        for (char ch : s.toCharArray()) {
            count.put(ch, count.getOrDefault(ch, 0) + 1);
        }
        for (int i = 0; i < s.length(); i++) {
            if (count.get(s.charAt(i)) == 1) return i;
        }
        return -1;
    }
    ```

    </div>

2.  **Tree/Graph Traversal (BFS/DFS):** Common for hierarchical data (like account structures) or relationship mapping.
3.  **Sliding Window:** Applied to problems involving contiguous subarrays or strings, such as analyzing transaction sequences.
4.  **Sorting & Greedy Approaches:** Used for scheduling, allocation, or optimization problems relevant to financial logic.

## Time Targets

In a 45-60 minute interview, you should aim to solve a Medium problem within **25-30 minutes**. This timeline includes:

- **5-7 minutes:** Understanding the problem, asking clarifying questions, and discussing your approach.
- **15-18 minutes:** Writing clean, correct code in your chosen language.
- **5-7 minutes:** Testing with examples, walking through edge cases, and discussing time/space complexity.

If you finish early, use the remaining time to optimize or discuss variations. Practice under this constraint to build the necessary speed and clarity.

## Practice Strategy

Don't just solve problems; simulate the interview. For each Capital One Medium question:

1.  **Timebox your attempt.** Set a 30-minute timer.
2.  **Verbally explain your thought process** before coding, as you would in an interview.
3.  **Write production-ready code.** Use meaningful variable names, consistent formatting, and include comments for complex logic.
4.  **Test thoroughly.** Don't just use the given example. Check edge cases: empty inputs, large values, and negative scenarios.
5.  **Analyze the pattern.** After solving, categorize the problem (e.g., "Hash Map + Sorting"). This helps you recognize similar patterns faster in the future.

Focus on quality over quantity. Mastering 15-20 problems that cover the key patterns is more effective than rushing through all 36.

[Practice Medium Capital One questions](/company/capital-one/medium)
