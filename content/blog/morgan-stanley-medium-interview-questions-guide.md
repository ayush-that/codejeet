---
title: "Medium Morgan Stanley Interview Questions: Strategy Guide"
description: "How to tackle 34 medium difficulty questions from Morgan Stanley — patterns, time targets, and practice tips."
date: "2032-09-14"
category: "tips"
tags: ["morgan-stanley", "medium", "interview prep"]
---

If you're preparing for a Morgan Stanley software engineering interview, you'll quickly notice their question bank has a distinct profile. With 34 out of 53 tagged as "Medium," this difficulty tier is the core of their technical assessment. Unlike "Easy" questions, which often test basic syntax and single-concept application, Morgan Stanley's Medium problems are designed to probe your ability to synthesize multiple concepts, manage moderate complexity, and write robust, production-like code under time pressure. They typically involve a clever twist on a standard algorithm, require careful state management, or demand elegant handling of edge cases that separate a working solution from an optimal one.

## Common Patterns and Templates

Morgan Stanley's Medium questions heavily favor problems involving **arrays, strings, and trees**, often with a focus on **simulation, greedy approaches, and modified BFS/DFS**. A recurring theme is the "stateful iteration" pattern—traversing a data structure while maintaining auxiliary information to make decisions on the fly. This is different from brute force (Easy) or complex dynamic programming (Hard).

A quintessential template for many of their array/string problems is the **Two-Pointer or Sliding Window with a Hash Map for state tracking**. This pattern efficiently solves problems requiring you to find a subarray or substring satisfying certain constraints, like maximum length with at most K distinct characters or a substring containing all characters of another string.

<div class="code-group">

```python
# Template: Sliding Window with HashMap for Character/Element Counting
# Commonly used for problems like "Longest Substring with At Most K Distinct Characters"
# Time: O(n) | Space: O(k) where k is the size of the character set/map
def find_substring(s, k):
    char_count = {}
    left = 0
    max_len = 0

    for right in range(len(s)):
        # 1. Expand window: add right char to map
        right_char = s[right]
        char_count[right_char] = char_count.get(right_char, 0) + 1

        # 2. Shrink window while condition is invalid
        while len(char_count) > k:  # Condition specific to problem
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # 3. Update answer after window is valid
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Template: Sliding Window with Map for Character/Element Counting
// Time: O(n) | Space: O(k)
function findSubstring(s, k) {
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Expand window
    const rightChar = s[right];
    charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

    // 2. Shrink window while condition invalid
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // 3. Update answer
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
// Template: Sliding Window with HashMap for Character Counting
// Time: O(n) | Space: O(k)
public int findSubstring(String s, int k) {
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand window
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // 2. Shrink window while condition invalid
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // 3. Update answer
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Morgan Stanley, you should aim to reach a working, optimal solution within **25-30 minutes**. This includes understanding the problem, discussing your approach, writing code, and walking through test cases. The first 5-7 minutes are critical for demonstrating structured thinking—verbally outline brute force, identify inefficiencies, then propose your optimized approach.

Beyond correctness, interviewers are evaluating:

- **Code Quality:** Is it readable, modular, and free of careless bugs? Do you use descriptive variable names?
- **Edge Case Handling:** Do you explicitly mention and test for empty inputs, single-element cases, duplicates, or integer overflow?
- **Communication:** Can you articulate your thought process and trade-offs? Do you ask clarifying questions before coding?
- **Testing:** After writing code, do you systematically run through a small example, including edge cases?

Getting the right answer with messy code or no explanation is a yellow flag. A clean, well-explained solution with a minor bug you catch and fix is often viewed more favorably.

## Key Differences from Easy Problems

The jump from Easy to Medium at Morgan Stanley isn't just about problem size; it's a shift in required skills.

1. **From Single-Pass to Stateful Passes:** Easy problems often need a simple loop or a direct application of a method (e.g., `reverse()`). Medium problems require maintaining state across iterations—like a running sum, a count map, or a monotonic stack.
2. **From Obvious to Non-Trivial Optimization:** An Easy problem's brute force might be O(n²) with an obvious O(n) fix. A Medium problem's brute force might be O(2ⁿ) or O(n!), requiring you to recognize a pattern (like overlapping subproblems for DP) or a data structure (like a heap for top K elements).
3. **From Isolated to Combined Techniques:** You might need to sort first (O(n log n)) then apply a two-pointer technique (O(n)) for an overall O(n log n) solution. Recognizing these composite steps is key.
4. **Mindset Shift:** In Easy problems, you're often implementing. In Medium problems, you're often _designing_ an algorithm. Start by asking, "What information do I need at each step to make a decision, and how can I maintain it efficiently?"

## Specific Patterns for Medium

**1. Modified Tree Traversal (DFS with Return Values)**
Problems like **Path Sum** variations or finding the **Lowest Common Ancestor** require a DFS that returns more than just a boolean or a list. You often return a tuple or a custom object carrying multiple pieces of information (e.g., max path sum, height, a found node). The recursive function becomes a state machine.

_Example Snippet (Python for LCA in BST):_

```python
def lowestCommonAncestor(root, p, q):
    # Leverage BST property: LCA is where paths diverge
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root  # This is the divergence point (LCA)
```

**2. Simulation with Index Arithmetic**
Array problems like **Rotate Array** or **Spiral Matrix** don't involve complex algorithms but require careful simulation and index manipulation. One off-by-one error can break everything. The skill is in cleanly defining boundaries (`top, bottom, left, right`) and updating them systematically.

## Practice Strategy

Don't just solve all 34 Medium questions sequentially. Group them by pattern (e.g., Sliding Window, Tree DFS, Simulation) and tackle one pattern at a time. For each pattern:

1. **Day 1-2:** Solve 2-3 classic problems for that pattern (not necessarily Morgan Stanley) to internalize the template.
2. **Day 3:** Solve 2-3 Morgan Stanley problems of that pattern. Time yourself (30 mins max).
3. **Day 4:** Review your solutions. Could you make the code cleaner? Did you miss an edge case? Write a verbal explanation as if teaching someone.

Aim for **2-3 Medium problems per day** with deep review. Prioritize problems with high frequency in reported interviews. In your final week, do mixed-pattern sessions to simulate the actual interview where you won't know the category in advance.

Remember, the goal isn't to memorize 34 solutions. It's to build the reflex that when you see a problem about "longest substring with constraints," you immediately consider the sliding window + hash map template.

[Practice Medium Morgan Stanley questions](/company/morgan-stanley/medium)
