---
title: "Medium JPMorgan Interview Questions: Strategy Guide"
description: "How to tackle 45 medium difficulty questions from JPMorgan — patterns, time targets, and practice tips."
date: "2032-06-10"
category: "tips"
tags: ["jpmorgan", "medium", "interview prep"]
---

Medium questions at JPMorgan are the critical battleground for most technical interviews. While Easy problems test basic competency, and Hard problems are often reserved for specialized roles or advanced rounds, Medium problems are the core assessment of your problem-solving ability under pressure. What separates JPMorgan's Medium tier is its focus on **practical, business-adjacent logic** rather than purely abstract computer science. You'll find fewer esoteric graph theory puzzles and more problems involving strings, arrays, and data structures applied to scenarios like transaction validation, data stream processing, or schedule optimization. Success here requires not just algorithmic knowledge, but the ability to translate a vaguely worded business requirement into clean, efficient code.

## Common Patterns and Templates

JPMorgan's Medium questions heavily favor a few key areas. **String manipulation** and **array transformation** are ubiquitous, often requiring you to parse, validate, or reformat data. **Hash Map/Dictionary-based counting and grouping** is perhaps the single most common pattern, used for frequency analysis, anagram detection, or deduplication. **Two-pointer techniques** on sorted arrays or strings are also frequent for finding pairs or compressing data. Finally, **basic tree traversals** (DFS/BFS) and **dynamic programming for simple optimization** (like climbing stairs or house robber variants) appear regularly.

The most common template you'll internalize is the **Frequency Map Pattern**. It's the workhorse for countless problems.

<div class="code-group">

```python
# Frequency Map Pattern Template
# Time: O(n) | Space: O(n) for the map
def frequency_map_template(data):
    """
    Solves problems involving counting, grouping, or finding duplicates.
    """
    freq = {}
    for item in data:
        freq[item] = freq.get(item, 0) + 1

    # Example usage: Find the first unique character
    for item in data:
        if freq[item] == 1:
            return item
    return None  # or appropriate default

# Example: LeetCode #387 - First Unique Character in a String
def firstUniqChar(s: str) -> int:
    count = {}
    for ch in s:
        count[ch] = count.get(ch, 0) + 1
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1
```

```javascript
// Frequency Map Pattern Template
// Time: O(n) | Space: O(n) for the map
function frequencyMapTemplate(data) {
  const freq = new Map();
  for (const item of data) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }

  // Example usage: Find the first unique character
  for (const item of data) {
    if (freq.get(item) === 1) {
      return item;
    }
  }
  return null;
}

// Example: LeetCode #387 - First Unique Character in a String
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
// Frequency Map Pattern Template
// Time: O(n) | Space: O(n) for the map
import java.util.*;

public class FrequencyMapTemplate {
    public static Object frequencyMapTemplate(List<Object> data) {
        Map<Object, Integer> freq = new HashMap<>();
        for (Object item : data) {
            freq.put(item, freq.getOrDefault(item, 0) + 1);
        }

        // Example usage: Find the first unique character
        for (Object item : data) {
            if (freq.get(item) == 1) {
                return item;
            }
        }
        return null;
    }

    // Example: LeetCode #387 - First Unique Character in a String
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
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem, you should aim to reach a working, reasonably optimized solution within **20-25 minutes**. This includes understanding the problem, discussing your approach, writing the code, and walking through test cases. The interviewer isn't just watching for a green checkmark. They're evaluating:

1.  **Code Quality and Readability:** Are your variables named clearly (`freq` vs `m`)? Is your logic straightforward? Can they follow your code without you explaining every line?
2.  **Edge Case Handling:** Do you consider empty inputs, single-element inputs, large values, or negative numbers? Mentioning these _before_ you start coding is a strong signal.
3.  **Communication of Trade-offs:** Can you articulate _why_ you chose a hash map (O(n) space for O(n) time) over a nested loop (O(1) space but O(n²) time)? This shows you understand the engineering decision, not just the algorithm.
4.  **Testing Discipline:** Don't just run the given example. Walk through a small custom case, including an edge case, to demonstrate your code works.

## Key Differences from Easy Problems

The jump from Easy to Medium at JPMorgan is defined by **constraint management**. Easy problems often have a single, obvious best data structure. Medium problems introduce a twist that forces you to manage multiple constraints simultaneously.

- **Easy:** "Find if two numbers in an array sum to a target." (One hash map pass).
- **Medium:** "Find if two numbers in a _sorted_ array sum to a target, _using constant space_." (Now you need the two-pointer technique).

The new skills required are:

- **Pattern Recognition:** You must quickly map the problem statement to a known template (e.g., "find top K frequent" -> Min-Heap or Bucket Sort).
- **Space-Time Trade-off Analysis:** You're now expected to justify your memory usage. "I'm using O(n) extra space to avoid the O(n²) time penalty."
- **Multi-step Logic:** Solutions often require 2-3 logical passes over the data (e.g., build a frequency map, then process it to find an answer), not just one.

## Specific Patterns for Medium

Beyond the frequency map, two other patterns are hallmarks of JPMorgan Medium questions.

**1. Sliding Window (Fixed or Variable):** Used for subarray/substring problems with constraints (e.g., longest substring with at most K distinct characters, LeetCode #340).

**2. Iterative Tree Traversal (DFS Stack / BFS Queue):** Tree problems move beyond simple recursion to require iterative solutions for better control or to meet specific output formats.

<div class="code-group">

```python
# Sliding Window (Variable Length) Pattern
# Time: O(n) | Space: O(k) for the character set
def lengthOfLongestSubstringKDistinct(s: str, k: int) -> int:
    char_count = {}
    left = 0
    max_len = 0

    for right, ch in enumerate(s):
        # Expand window: add current character
        char_count[ch] = char_count.get(ch, 0) + 1

        # Shrink window if we exceed k distinct chars
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # Update answer
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Sliding Window (Variable Length) Pattern
// Time: O(n) | Space: O(k) for the character set
function lengthOfLongestSubstringKDistinct(s, k) {
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    charCount.set(ch, (charCount.get(ch) || 0) + 1);

    // Shrink window
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
// Sliding Window (Variable Length) Pattern
// Time: O(n) | Space: O(k) for the character set
import java.util.*;

public class Solution {
    public int lengthOfLongestSubstringKDistinct(String s, int k) {
        Map<Character, Integer> charCount = new HashMap<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            charCount.put(ch, charCount.getOrDefault(ch, 0) + 1);

            while (charCount.size() > k) {
                char leftChar = s.charAt(left);
                charCount.put(leftChar, charCount.get(leftChar) - 1);
                if (charCount.get(leftChar) == 0) {
                    charCount.remove(leftChar);
                }
                left++;
            }

            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
```

</div>

## Practice Strategy

Don't just grind randomly. Use a targeted approach:

1.  **Pattern-First, Not Problem-First:** Dedicate days to specific patterns. Monday: Hash Maps & Counting. Tuesday: Two Pointers & Sliding Window. Wednesday: Trees (BFS/DFS). Thursday: Basic DP & Greedy.
2.  **Order by Frequency:** Start with the most common patterns listed above. Within each pattern, solve 3-5 JPMorgan-tagged Medium problems.
3.  **Daily Targets:** Aim for **2-3 quality solutions per day**. For each problem:
    - Spend 15 minutes trying to solve it independently.
    - If stuck, study the solution _concept_, not the code. Close the tab and re-implement it yourself.
    - **Always** write out the time and space complexity.
    - Run your code against multiple test cases, including edge cases.
4.  **Simulate the Interview:** Once a week, pick a new JPMorgan Medium problem and solve it out loud with a timer, as if an interviewer were present. Explain your thought process, write clean code, and walk through a test.

Mastering these 45 Medium questions means you've mastered the core of JPMorgan's technical screen. The patterns you solidify here will serve you across countless other interview problems.

[Practice Medium JPMorgan questions](/company/jpmorgan/medium)
