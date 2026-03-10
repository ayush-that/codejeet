---
title: "Medium ByteDance Interview Questions: Strategy Guide"
description: "How to tackle 49 medium difficulty questions from ByteDance — patterns, time targets, and practice tips."
date: "2032-07-16"
category: "tips"
tags: ["bytedance", "medium", "interview prep"]
---

ByteDance's Medium interview questions are where the real technical screening happens. While their Easy problems (15 total) often test basic syntax and simple logic, and their Hard problems are relatively rare, the 49 Medium questions represent the core of what you'll face in phone screens and virtual onsites. What separates ByteDance's Medium tier is their emphasis on **practical data manipulation**—you're rarely solving abstract mathematical puzzles. Instead, you're building the logic for a feature that might exist in TikTok, Douyin, or Lark: merging user activity intervals, processing a stream of engagement data, or efficiently searching through content.

These problems demand not just a working solution, but a _performant_ one under constraints that mirror real systems. The jump from a brute-force O(n²) answer to an optimal O(n log n) or O(n) solution is often the difference between a pass and a fail.

## Common Patterns and Templates

ByteDance's Medium problems heavily favor a few categories that align with backend and data-intensive engineering:

1.  **Array/String Transformation & Two Pointers:** Problems like "Merge Intervals" variants, where you must process sequences in-place or with minimal extra space.
2.  **Hash Map for State Tracking:** Used not just for lookups, but to maintain complex state (e.g., longest substring without repeating characters, finding all anagrams).
3.  **Tree/Graph Traversal with a Twist:** Standard BFS/DFS plus an additional constraint, like connecting nodes on the same level or verifying a binary search tree.
4.  **Binary Search on Answer:** Not just searching a sorted array, but applying binary search to find an optimal value (like capacity to ship packages).

The most frequent pattern is the **"Sliding Window with Hash Map State"** for substring or subarray problems. Here's a template for solving problems like "Longest Substring Without Repeating Characters" (#3) or "Minimum Window Substring" (#76):

<div class="code-group">

```python
def sliding_window_template(s: str, t: str = None) -> int:
    # Frequency map to track characters in the current window
    window_map = {}
    left = 0
    result = 0  # or float('inf') for min window problems

    for right in range(len(s)):
        # 1. Expand window: add character at 'right' to map
        char_right = s[right]
        window_map[char_right] = window_map.get(char_right, 0) + 1

        # 2. Check if window condition is violated (e.g., duplicate exists)
        #    This condition varies by problem
        while window_map[char_right] > 1:  # Example: duplicate condition
            # 3. Contract window: remove character at 'left' from map
            char_left = s[left]
            window_map[char_left] -= 1
            if window_map[char_left] == 0:
                del window_map[char_left]
            left += 1

        # 4. Update result with valid window
        result = max(result, right - left + 1)

    return result

# Time: O(n) | Space: O(k) where k is the size of the character set
```

```javascript
function slidingWindowTemplate(s, t = null) {
  const windowMap = new Map();
  let left = 0;
  let result = 0; // or Infinity for min window problems

  for (let right = 0; right < s.length; right++) {
    // 1. Expand window
    const charRight = s[right];
    windowMap.set(charRight, (windowMap.get(charRight) || 0) + 1);

    // 2. Condition check (example: duplicate exists)
    while (windowMap.get(charRight) > 1) {
      // 3. Contract window
      const charLeft = s[left];
      windowMap.set(charLeft, windowMap.get(charLeft) - 1);
      if (windowMap.get(charLeft) === 0) {
        windowMap.delete(charLeft);
      }
      left++;
    }

    // 4. Update result
    result = Math.max(result, right - left + 1);
  }
  return result;
}
// Time: O(n) | Space: O(k)
```

```java
public int slidingWindowTemplate(String s, String t) {
    Map<Character, Integer> windowMap = new HashMap<>();
    int left = 0;
    int result = 0; // or Integer.MAX_VALUE for min window

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand window
        char charRight = s.charAt(right);
        windowMap.put(charRight, windowMap.getOrDefault(charRight, 0) + 1);

        // 2. Condition check (example: duplicate exists)
        while (windowMap.get(charRight) > 1) {
            // 3. Contract window
            char charLeft = s.charAt(left);
            windowMap.put(charLeft, windowMap.get(charLeft) - 1);
            if (windowMap.get(charLeft) == 0) {
                windowMap.remove(charLeft);
            }
            left++;
        }

        // 4. Update result
        result = Math.max(result, right - left + 1);
    }
    return result;
}
// Time: O(n) | Space: O(k)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot with one Medium problem, you should aim for:

- **Minutes 0-5:** Understand the problem, ask clarifying questions, and propose a brute-force approach.
- **Minutes 5-15:** Derive the optimal approach, explain time/space complexity, and get interviewer buy-in.
- **Minutes 15-35:** Write clean, compilable code with proper variable names.
- **Minutes 35-45:** Test with edge cases, discuss optimizations, and answer follow-ups.

Beyond correctness, ByteDance interviewers watch for:

- **Code quality over cleverness:** They prefer readable, maintainable code. A well-named variable is better than a one-line trick.
- **Edge case intuition:** Immediately mentioning empty input, single element, duplicates, and overflow shows production-level thinking.
- **Communication of trade-offs:** Saying "I'm using O(n) space for the hash map to get O(n) time—we could save space with a sorted array but that would cost O(n log n) time" demonstrates architectural decision-making.

## Key Differences from Easy Problems

Easy problems test _if you can code_. Medium problems test _how you think about data_. The specific shifts required:

1.  **From single-pass to multi-phase processing:** Easy problems often have linear solutions. Medium problems require sorting first (O(n log n)) then processing, or using auxiliary data structures.
2.  **From explicit to implicit conditions:** In "Two Sum" (Easy), the complement rule is straightforward. In "Longest Substring Without Repeating Characters" (Medium), the condition (no duplicates) must be actively maintained as the window changes.
3.  **From O(n²) acceptable to O(n log n) or O(n) required:** Brute force is rarely sufficient. You must recognize when to apply divide-and-conquer, sliding window, or topological sorting.

## Specific Patterns for Medium

**Pattern 1: Modified Binary Search**
Problems like "Search in Rotated Sorted Array" (#33) require binary search where one half is always sorted. The key is to identify which half is ordered and whether the target lies within it.

**Pattern 2: Tree Level Traversal with Queue**
For "Binary Tree Level Order Traversal" (#102), you need BFS with queue size tracking. The twist comes in variations like zigzag traversal or connecting next pointers, where you process nodes level-by-level with alternating logic.

**Pattern 3: Interval Merging**
"Merge Intervals" (#56) and its variants appear frequently. The template: sort by start time, iterate, and merge if current.start <= previous.end. ByteDance often adds twists like counting non-overlapping intervals or finding insertion points.

## Practice Strategy

Don't just solve problems—simulate interviews:

1.  **Week 1-2: Pattern Recognition**
    - Group problems by pattern (all sliding window, all interval problems).
    - Solve 2-3 per pattern until you internalize the template.
    - Recommended order: Start with Array/String (15 problems), then Trees (10), then Graphs (8).

2.  **Week 3: Timed Sessions**
    - Set a 25-minute timer for each problem.
    - Verbalize your thinking as you code (explain each step).
    - If stuck at 15 minutes, study the solution _thoroughly_—don't just read it, implement it again.

3.  **Week 4: Mixed Bag & Mock Interviews**
    - Solve problems randomly without knowing the category.
    - Do 2-3 mock interviews with a friend using actual ByteDance Medium questions.

Aim for 2-3 Medium problems daily, with at least one being a ByteDance-tagged question. Quality over quantity: fully understanding why a solution works is more valuable than skimming five solutions.

[Practice Medium ByteDance questions](/company/bytedance/medium)
