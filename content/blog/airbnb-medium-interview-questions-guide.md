---
title: "Medium Airbnb Interview Questions: Strategy Guide"
description: "How to tackle 34 medium difficulty questions from Airbnb — patterns, time targets, and practice tips."
date: "2032-07-10"
category: "tips"
tags: ["airbnb", "medium", "interview prep"]
---

Medium questions at Airbnb are where the real interview happens. While Easy problems test basic competency, and Hard problems might be reserved for specialized roles or exceptional candidates, Medium is the sweet spot that determines whether you get the offer. Out of Airbnb's 64 tagged problems on LeetCode, 34 are Medium. This isn't an accident. These questions are designed to assess your ability to translate a real-world, often business-logic-adjacent problem into clean, efficient code under pressure. They are less about obscure algorithms and more about systematic thinking, data structure selection, and handling complexity without over-engineering.

## Common Patterns and Templates

Airbnb's Medium problems heavily favor **array/string manipulation** and **graph/tree traversal** with a twist. You'll rarely see a vanilla binary search tree problem. Instead, you'll get a scenario like designing an iterator, flattening a nested structure, or implementing a feature that mimics part of their platform (e.g., "Meeting Scheduler" or "Flatten 2D Vector"). The most common overarching pattern is **simulation with state management**—iterating through a data structure while maintaining auxiliary data (like a hash map, stack, or queue) to track what you've seen or what needs to be processed next.

A classic template for this is the **"Two-Pointer / Sliding Window with Hash Map"** pattern, used in problems like finding substrings with constraints or array subsets. Here’s a generalized template for the "at most K distinct characters" type of problem, which appears in variations.

<div class="code-group">

```python
def find_substring_at_most_k_distinct(s: str, k: int) -> int:
    """
    Template: Sliding Window with char frequency map.
    Finds max length of substring with at most k distinct characters.
    """
    char_count = {}
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        # Expand window: add current char to map
        char_count[char] = char_count.get(char, 0) + 1

        # Shrink window while condition is violated (> k distinct chars)
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # Update answer after ensuring window is valid
        max_len = max(max_len, right - left + 1)

    return max_len

# Time: O(n) - Each character processed at most twice (by right and left).
# Space: O(k) - Hash map holds at most k+1 distinct characters.
```

```javascript
function findSubstringAtMostKDistinct(s, k) {
  // Template: Sliding Window with char frequency map.
  // Finds max length of substring with at most k distinct characters.
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    // Expand window
    charCount.set(char, (charCount.get(char) || 0) + 1);

    // Shrink while invalid
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // Update answer
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// Time: O(n) | Space: O(k)
```

```java
public int findSubstringAtMostKDistinct(String s, int k) {
    // Template: Sliding Window with char frequency map.
    // Finds max length of substring with at most k distinct characters.
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        // Expand window
        charCount.put(c, charCount.getOrDefault(c, 0) + 1);

        // Shrink while invalid
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // Update answer
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}

// Time: O(n) | Space: O(k)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you should aim to solve a single Medium problem in **25-30 minutes**. This includes understanding the problem, discussing your approach, writing the code, and walking through test cases. The remaining time is for follow-ups or a second, simpler question.

Beyond a correct solution, Airbnb interviewers are keenly watching for:

1. **Code Quality and Readability:** They want code they can imagine in their codebase. Use descriptive variable names, avoid one-letter shortcuts (except for simple loop indices), and include brief, clear comments for non-obvious logic.
2. **Edge Case Proactivity:** Don't wait for the interviewer to ask "What about an empty input?" Mention these upfront. For example, in a string problem, discuss empty string, single character, all identical characters, and case sensitivity if relevant.
3. **Communication of Trade-offs:** If you use a hash map for O(1) lookups but incur O(n) space, say so. Articulating the "why" behind your data structure choices shows deeper understanding.
4. **Testing with Meaningful Cases:** When asked to test, don't just use the given example. Walk through a small custom case that stresses your algorithm's logic, then a larger edge case.

## Key Differences from Easy Problems

The jump from Easy to Medium at Airbnb is defined by two things: **multiple moving parts** and **constraint management**.

Easy problems often have a single, straightforward transformation or a well-known algorithm (reverse a string, find a sum). Medium problems require you to **orchestrate** several concepts. For instance, "Flatten Nested List Iterator" (#341) combines depth-first search, iterator design, and lazy evaluation. You're not just implementing an algorithm; you're designing a component.

The mindset shift is from "What's the answer?" to "What's the most efficient way to track state while I find the answer?" You need to think about **intermediate data structures**—should you use a stack, a queue, a heap, or a hash map to hold partial results? This is the core of Medium-level problem solving.

## Specific Patterns for Medium

1.  **DFS/BFS on Implicit Graphs:** Many problems involve traversing a 2D grid (like "Walls and Gates" #286) or a state space (like "Alien Dictionary" #269 - a Hard problem, but the BFS/Kahn's algorithm pattern is key). The pattern involves exploring neighbors while avoiding revisits, often using a queue for BFS or recursion for DFS.

2.  **Interval Merging and Scheduling:** A staple for a company built on bookings. The pattern involves sorting intervals by start time and then iterating to merge or find gaps. For example, "Meeting Schedules" (a common variant) asks to find available time slots for two people.

    ```python
    # Pattern snippet for finding free time between intervals
    intervals.sort(key=lambda x: x[0])
    free_time = []
    prev_end = intervals[0][1]
    for start, end in intervals[1:]:
        if start > prev_end:  # Gap found
            free_time.append([prev_end, start])
        prev_end = max(prev_end, end)
    ```

3.  **Design-Lite Data Structures:** Problems that ask you to implement a class with specific methods, like "Insert Delete GetRandom O(1)" (#380). These test your ability to combine data structures (like a list and a hash map) to achieve different O(1) operations, mirroring real-world API design.

## Practice Strategy

Don't just solve all 34 problems sequentially. Group them by pattern (LeetCode's tags are helpful here). Aim for **2-3 Medium problems per day**, with at least one being a new pattern and one being a review of a previously learned pattern.

**Recommended Order:**

1.  Start with **array/string and hash map** problems (e.g., "Find All Anagrams in a String" #438).
2.  Move to **interval-based** problems to get comfortable with sorting and comparison logic.
3.  Tackle **tree/graph traversal** problems, focusing on both recursive and iterative implementations.
4.  Finally, practice the **"design-lite"** class implementation problems.

For each problem, time yourself. If you can't formulate a viable approach in 10 minutes, study the solution, understand the pattern, and then re-implement it from scratch the next day without looking. The goal is pattern recognition, not memorization.

[Practice Medium Airbnb questions](/company/airbnb/medium)
