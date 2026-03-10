---
title: "Medium Adobe Interview Questions: Strategy Guide"
description: "How to tackle 129 medium difficulty questions from Adobe — patterns, time targets, and practice tips."
date: "2032-02-05"
category: "tips"
tags: ["adobe", "medium", "interview prep"]
---

Adobe's interview process is known for its practical, well-rounded approach. While they ask the standard algorithmic questions, there's a distinct flavor to their "Medium" difficulty problems. Out of their 227 tagged questions on major platforms, 129 are Medium, making this the core battleground for your interview. The key differentiator at Adobe isn't about obscure, hyper-optimized algorithms; it's about **cleanly implementing well-known patterns on problems with one or two conceptual twists**. An Adobe Medium problem often feels like an Easy problem's more sophisticated cousin—it requires the same fundamental tools but demands better system design, more thorough edge-case consideration, and the ability to manage multiple logical steps without the code becoming a mess.

## Common Patterns and Templates

Adobe heavily favors problems involving **arrays, strings, and trees**. Within these domains, the most common pattern by far is the **Two-Pointer/Sliding Window** technique for array/string manipulation, often combined with a hash map for tracking state. You're not inventing new algorithms here; you're applying these classic techniques to scenarios that require careful state management. For example, you might use a sliding window to find a substring, but the condition for shrinking the window depends on counting multiple character types.

The template below is your workhorse for a huge swath of Adobe Medium problems, particularly those about finding subarrays or substrings satisfying specific conditions.

<div class="code-group">

```python
def sliding_window_template(s, t):
    """
    Generic template for finding a minimum window in `s` containing all chars of `t`.
    Adaptable for many substring/subarray problems.
    """
    from collections import Counter

    # Map to store the count of needed characters
    need = Counter(t)
    # Count of unique characters we need to satisfy
    need_cnt = len(need)

    left = 0
    result = [0, float('inf')]  # Store start and end index of best window

    # Expand the window with the right pointer
    for right, char in enumerate(s):
        if char in need:
            need[char] -= 1
            if need[char] == 0:
                need_cnt -= 1

        # Contract the window from the left while condition is satisfied
        while need_cnt == 0:
            # Update result if this window is smaller
            if (right - left) < (result[1] - result[0]):
                result = [left, right]

            left_char = s[left]
            if left_char in need:
                if need[left_char] == 0:
                    need_cnt += 1
                need[left_char] += 1
            left += 1

    # Return the appropriate result (e.g., substring or length)
    return "" if result[1] == float('inf') else s[result[0]:result[1]+1]

# Time: O(n) | Space: O(k) where k is the size of the charset/`t`
```

```javascript
function slidingWindowTemplate(s, t) {
  // Generic template for finding a minimum window in `s` containing all chars of `t`.
  const need = new Map();
  for (const char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }
  let needCnt = need.size;

  let left = 0;
  let result = [0, Infinity];

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (need.has(char)) {
      need.set(char, need.get(char) - 1);
      if (need.get(char) === 0) needCnt--;
    }

    while (needCnt === 0) {
      if (right - left < result[1] - result[0]) {
        result = [left, right];
      }

      const leftChar = s[left];
      if (need.has(leftChar)) {
        if (need.get(leftChar) === 0) needCnt++;
        need.set(leftChar, need.get(leftChar) + 1);
      }
      left++;
    }
  }

  return result[1] === Infinity ? "" : s.substring(result[0], result[1] + 1);
}
// Time: O(n) | Space: O(k)
```

```java
public String slidingWindowTemplate(String s, String t) {
    // Generic template for finding a minimum window in `s` containing all chars of `t`.
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) {
        need.put(c, need.getOrDefault(c, 0) + 1);
    }
    int needCnt = need.size();

    int left = 0;
    int[] result = new int[]{0, Integer.MAX_VALUE};

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (need.containsKey(c)) {
            need.put(c, need.get(c) - 1);
            if (need.get(c) == 0) needCnt--;
        }

        while (needCnt == 0) {
            if ((right - left) < (result[1] - result[0])) {
                result[0] = left;
                result[1] = right;
            }

            char leftChar = s.charAt(left);
            if (need.containsKey(leftChar)) {
                if (need.get(leftChar) == 0) needCnt++;
                need.put(leftChar, need.get(leftChar) + 1);
            }
            left++;
        }
    }

    return result[1] == Integer.MAX_VALUE ? "" : s.substring(result[0], result[1] + 1);
}
// Time: O(n) | Space: O(k)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a single Medium problem in a 45-minute interview slot, you should aim to have a **fully working, optimal solution coded and tested within 25-30 minutes**. This leaves crucial time for discussion, edge cases, and a potential follow-up. The interviewer is watching for specific signals beyond correctness:

1.  **Code Quality as a Primary Signal:** Adobe engineers build products. They care if your code is readable, modular, and maintainable. Use descriptive variable names (`left`, `right`, not `i`, `j`). Extract logical blocks into well-named helper functions if it clarifies intent.
2.  **Edge Case Hunting:** Don't wait for the interviewer to ask "What about an empty string?" Proactively state them as you code: "I'm assuming the input could be null, so I'll add a guard clause," or "This works for positive integers; we should discuss if negative numbers are possible."
3.  **Communication of Trade-offs:** Before you start coding, briefly outline your approach and its complexity. Say, "I'll use a sliding window with a hash map. This gives us O(n) time and O(k) space, where k is the character set size. The alternative brute force would be O(n²)."

## Key Differences from Easy Problems

The jump from Easy to Medium at Adobe is less about new data structures and more about **orchestration and constraint management**. An Easy problem might ask you to reverse a string (one simple operation). A Medium problem will ask you to **reverse words in a string (#151)**, which requires you to orchestrate: 1) trim leading/trailing spaces, 2) split the string by spaces (handling multiple spaces), 3) reverse the list, and 4) join it back. It's the same core skill (string manipulation) but now you're managing multiple constraints and steps without explicit guidance.

The mindset shift is from **"What's the operation?"** to **"What are all the states my data can be in, and how does my algorithm transition between them correctly?"** You must hold more context in your head.

## Specific Patterns for Medium

1.  **In-Place Array/String Modification:** Problems like **Move Zeroes (#283)** or **Sort Colors (#75)** are classic. They test your ability to manipulate indices within a single pass without extra space. The pattern is often a two-pointer (read/write pointer) or a three-pointer partition.
    - **Pattern:** Use one pointer to iterate and another to mark the position for the next valid element. Swap or assign as you go.

2.  **Tree Path or Depth Analysis:** Not just simple traversal, but problems requiring you to carry information up or down the tree, like **Binary Tree Maximum Path Sum (#124)** or **Lowest Common Ancestor of a Binary Tree (#236)**.
    - **Pattern:** Post-order DFS (bottom-up) is key. Your helper function returns one piece of information (e.g., max path sum from this node downwards), but you calculate the global answer (e.g., the path that might arc through this node) within the function by combining the left and right results.

## Practice Strategy

Don't just solve all 129 problems. Practice strategically:

1.  **Pattern-Based Batches:** Group problems by the patterns above. Do all "Sliding Window" problems in a row, then all "In-Place Array" problems. This builds muscle memory for the template.
2.  **Daily Target:** Aim for 2-3 **high-quality** solutions per day. "High-quality" means: writing the code in your chosen language, analyzing time/space complexity aloud, testing with your own edge cases, and then comparing your approach to the top-voted solution to refine your style.
3.  **Recommended Order:** Start with high-frequency patterns: 1) Sliding Window (e.g., Minimum Window Substring #76, Longest Substring Without Repeating Characters #3), 2) In-Place Array (Sort Colors #75, Move Zeroes #283), 3) Tree DFS (Max Path Sum #124, LCA #236). This covers a massive portion of the question pool.
4.  **Mock Interviews:** Every 10 problems, do a mock interview. Set a 30-minute timer for one Medium problem. Talk through your process. This is non-negotiable for calibrating your pace.

The goal is to make the common patterns so familiar that you can dedicate your mental energy during the interview to the unique twist of the problem and to communicating clearly.

[Practice Medium Adobe questions](/company/adobe/medium)
