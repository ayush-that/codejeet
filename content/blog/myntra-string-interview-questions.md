---
title: "String Questions at Myntra: What to Expect"
description: "Prepare for String interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-04-21"
category: "dsa-patterns"
tags: ["myntra", "string", "interview prep"]
---

String questions at Myntra aren't just a random topic check—they're a deliberate filter. With 5 out of 24 total questions in their tagged problem set, strings represent roughly 20% of their technical focus. This is significant. Myntra, as a fashion e-commerce platform, deals heavily with product titles, descriptions, search queries, user reviews, and catalog management. Efficient text processing, search relevance, and data parsing are not abstract concepts here; they're daily engineering tasks. In real interviews, you can expect at least one, often two, string manipulation or pattern matching problems in a coding round. They use strings to test a candidate's ability to write clean, efficient, and bug-free code with careful edge-case handling—skills directly applicable to their backend and data systems.

## Specific Patterns Myntra Favors

Myntra's string problems tend to avoid esoteric, purely academic challenges. They favor **practical patterns** that mirror real-world data processing. The dominant themes are:

1.  **Two-Pointer / Sliding Window:** This is the undisputed king for Myntra. Think problems involving substrings, palindromes, or finding a window with certain properties. It tests optimization and the ability to reduce brute-force O(n²) or O(n³) solutions to O(n).
2.  **String Parsing & Simulation:** Problems that require you to process a string according to specific rules, often involving iteration, state tracking, and validation. This directly relates to parsing product SKUs, user input, or log data.
3.  **Hash Map for Frequency & Anagrams:** A classic and essential pattern. Myntra uses this to test basic data structure competency in a string context.

You will notice a distinct _lack_ of heavily recursive string problems (like wildcard matching with complex backtracking) or advanced automata (Aho-Corasick). Their problems are more iterative and simulation-based.

For example, **Sliding Window** appears in problems like "Longest Substring Without Repeating Characters" (LeetCode #3) or "Minimum Window Substring" (LeetCode #76). **String Parsing** is tested in problems like "String to Integer (atoi)" (LeetCode #8) or "Decode String" (LeetCode #394). **Frequency Maps** are core to "Valid Anagram" (LeetCode #242) and "Group Anagrams" (LeetCode #49).

## How to Prepare

Master the sliding window pattern in its two main variants: the **fixed-size window** and the **dynamic/variable-size window**. The mental model is key: maintain a window `[left, right]` that satisfies the problem constraint, and slide it across the string, updating your state efficiently.

Let's look at the dynamic window pattern to find the longest substring with at most K distinct characters.

<div class="code-group">

```python
def longest_substring_k_distinct(s: str, k: int) -> int:
    """
    Finds the length of the longest substring with at most k distinct characters.
    Time: O(n) - Each character is processed at most twice (by `right` and `left`).
    Space: O(k) - For the frequency hash map, which holds at most k+1 characters.
    """
    char_count = {}
    left = 0
    max_length = 0

    for right in range(len(s)):
        # Expand the window by adding the character at `right`
        char = s[right]
        char_count[char] = char_count.get(char, 0) + 1

        # Shrink the window from the left if we exceed k distinct chars
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # Update the answer. Window [left, right] is now valid.
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
function longestSubstringKDistinct(s, k) {
  /**
   * Finds the length of the longest substring with at most k distinct characters.
   * Time: O(n) - Each character is processed at most twice.
   * Space: O(k) - For the frequency map.
   */
  const charCount = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // Expand window
    const char = s[right];
    charCount.set(char, (charCount.get(char) || 0) + 1);

    // Shrink window if condition violated
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // Update answer
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
public int longestSubstringKDistinct(String s, int k) {
    /**
     * Finds the length of the longest substring with at most k distinct characters.
     * Time: O(n) - Each character is processed at most twice.
     * Space: O(k) - For the frequency map.
     */
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        // Expand window
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // Shrink window if condition violated
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // Update answer
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

For parsing problems, practice clean, stateful iteration. Here's a template for a simple parser that sums numbers in a string separated by non-digit characters.

<div class="code-group">

```python
def sum_numbers_in_string(s: str) -> int:
    """
    Parses and sums all consecutive sequences of digits in a string.
    Example: "a123bc34d8" -> 123 + 34 + 8 = 165
    Time: O(n) - Single pass.
    Space: O(1) - Only a few variables.
    """
    total = 0
    current_num = 0

    for ch in s:
        if ch.isdigit():
            # Build the current number digit by digit
            current_num = current_num * 10 + int(ch)
        else:
            # A non-digit signals the end of the current number
            total += current_num
            current_num = 0
    # Add the last number if the string ends with digits
    total += current_num
    return total
```

```javascript
function sumNumbersInString(s) {
  /**
   * Parses and sums all consecutive sequences of digits in a string.
   * Time: O(n) - Single pass.
   * Space: O(1) - Only a few variables.
   */
  let total = 0;
  let currentNum = 0;

  for (let ch of s) {
    if (ch >= "0" && ch <= "9") {
      currentNum = currentNum * 10 + (ch.charCodeAt(0) - "0".charCodeAt(0));
    } else {
      total += currentNum;
      currentNum = 0;
    }
  }
  total += currentNum; // Add the last number
  return total;
}
```

```java
public int sumNumbersInString(String s) {
    /**
     * Parses and sums all consecutive sequences of digits in a string.
     * Time: O(n) - Single pass.
     * Space: O(1) - Only a few variables.
     */
    int total = 0;
    int currentNum = 0;

    for (char ch : s.toCharArray()) {
        if (Character.isDigit(ch)) {
            currentNum = currentNum * 10 + (ch - '0');
        } else {
            total += currentNum;
            currentNum = 0;
        }
    }
    total += currentNum; // Add the last number
    return total;
}
```

</div>

## How Myntra Tests String vs Other Companies

Compared to other companies, Myntra's string questions are **pragmatic and of medium difficulty**. They are less about clever algorithmic tricks (like some of Google's hardest suffix array problems) and more about robust implementation.

- **vs. Google/FAANG:** Google might ask a string problem that requires knowing the KMP algorithm or building a suffix tree. Myntra is more likely to ask a problem where you can arrive at an optimal solution using fundamental patterns like sliding window or hashing.
- **vs. Startups (early-stage):** Startups might ask more open-ended, design-heavy string problems ("design a regex parser"). Myntra's problems are well-defined, with clear input/output specifications.
- **vs. FinTech:** FinTech string problems often involve complex number/currency parsing with many edge cases. Myntra's problems are more about general text manipulation and search optimization.

The unique aspect is the **context**. While the problem might be a standard LeetCode medium, interviewers at Myntra appreciate if you can briefly relate your solution to a real-use case like "this sliding window approach could help optimize search suggestions by finding relevant product title fragments." It shows system thinking.

## Study Order

Tackle string topics in this order to build a solid foundation:

1.  **Basic Operations & Two-Pointers:** Start with reversing strings, checking palindromes, and basic two-pointer techniques (e.g., reversing vowels). This builds comfort with string immutability/indexing.
2.  **Hash Maps for Frequency:** Learn to use maps/dictionaries to count characters. This is the gateway to anagram and permutation problems.
3.  **Sliding Window (Fixed then Dynamic):** Master the fixed-size window first (e.g., max average subarray). Then graduate to dynamic windows for problems like longest substring with unique characters. This is the most critical pattern for Myntra.
4.  **String Parsing & Simulation:** Practice iterating through strings, building tokens, and handling state. This improves your ability to translate problem statements into clean code.
5.  **Basic Dynamic Programming on Strings:** Only after the above, tackle foundational string DP like longest common subsequence (#1143) or edit distance (#72). Myntra occasionally asks one of these as a harder problem.

This order works because it progresses from simple manipulation to controlled iteration (two-pointer), then to optimized iteration (sliding window), then to complex iteration with state (parsing), and finally to more abstract optimization (DP). Each step uses skills from the previous one.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a slight twist on the core patterns.

1.  **Valid Anagram (LeetCode #242)** - Warm-up with frequency maps.
2.  **Longest Substring Without Repeating Characters (LeetCode #3)** - The classic dynamic sliding window.
3.  **Minimum Window Substring (LeetCode #76)** - A harder dynamic window, excellent for Myntra-style search relevance problems.
4.  **String to Integer (atoi) (LeetCode #8)** - A pure parsing/simulation problem with many edge cases.
5.  **Decode String (LeetCode #394)** - Combines parsing with stack usage, a common pattern.
6.  **Group Anagrams (LeetCode #49)** - Applies frequency maps to a grouping problem.
7.  **Longest Palindromic Substring (LeetCode #5)** - Can be solved with an expansion technique that feels like a sliding window.
8.  **Edit Distance (LeetCode #72)** - The quintessential string DP problem to round out your prep.

Focus on writing clean, first-principles solutions. At Myntra, a correct, well-structured, and communicative solution beats a clever but opaque one every time.

[Practice String at Myntra](/company/myntra/string)
