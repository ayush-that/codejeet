---
title: "String Questions at Swiggy: What to Expect"
description: "Prepare for String interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-01-22"
category: "dsa-patterns"
tags: ["swiggy", "string", "interview prep"]
---

String manipulation is a surprisingly critical skill for Swiggy interviews, and understanding why reveals a lot about their engineering priorities. With 9 out of 41 total tagged questions being String problems, they represent over 20% of their technical question bank. This isn't a coincidence. Swiggy's core business — food delivery, quick commerce, and logistics — revolves around processing and validating textual data: restaurant names, dish descriptions, user addresses, search queries, and order tracking IDs. An engineer working on their search relevance, address parsing, or menu display systems needs to be exceptionally proficient with string operations, pattern matching, and efficient text processing. In real interviews, you're very likely to encounter at least one string problem, often in the first or second technical round, as it tests fundamental algorithmic thinking applied to a highly relevant domain.

## Specific Patterns Swiggy Favors

Swiggy's string questions have a distinct flavor. They heavily favor **practical, iterative problem-solving** over abstract, theoretical stringology. You won't often find complex suffix array or automaton problems here. Instead, the focus is on:

1.  **Two-Pointer and Sliding Window Techniques:** This is the single most common pattern. It's used for problems involving palindromes, substrings, and comparisons without extra space. Think validating user input (palindromic addresses? unlikely, but the pattern is key) or finding optimal substrings.
2.  **String Parsing and Simulation:** Given their domain, questions often involve breaking down a formatted string (like a log entry, a path, or a serialized object) and extracting or manipulating information according to specific rules. This tests meticulousness and the ability to handle edge cases.
3.  **Hash Map for Frequency and Anagrams:** Checking for anagrams or character rearrangements is a classic problem that maps directly to tasks like fuzzy matching of search terms or dish names.
4.  **Basic Dynamic Programming for Edit Distance:** While less common, a fundamental understanding of the Edit Distance (Levenshtein distance) problem is valuable, as it's the algorithmic basis for spell-check and search query correction features.

You'll notice a distinct _lack_ of heavy recursion, complex graph-based string problems, or advanced topics like Rabin-Karp (unless it's a very specialized role). The problems are leetcode-medium level, designed to see if you can write clean, efficient, and correct code under pressure.

## How to Prepare

Your preparation should mirror their focus: master the core patterns with an emphasis on clean implementation and edge-case handling. Let's look at the quintessential Swiggy pattern: the **Expanding Around Center** technique for palindromic substrings, which is a specific application of the two-pointer approach.

A common mistake is to use a brute-force O(n³) approach. The efficient O(n²) solution expands from every possible center (considering both odd and even length palindromes). This pattern appears in problems like **Longest Palindromic Substring (#5)**.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(1)
def longestPalindrome(s: str) -> str:
    def expand_around_center(left: int, right: int) -> str:
        # Expand outwards while the characters match and we're within bounds.
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        # Return the palindrome found. Left and right are one step beyond.
        return s[left + 1:right]

    if not s:
        return ""

    longest = ""
    for i in range(len(s)):
        # Check for odd-length palindrome (single character center)
        odd_pal = expand_around_center(i, i)
        # Check for even-length palindrome (center between two characters)
        even_pal = expand_around_center(i, i + 1)

        # Update the longest palindrome found
        if len(odd_pal) > len(longest):
            longest = odd_pal
        if len(even_pal) > len(longest):
            longest = even_pal
    return longest
```

```javascript
// Time: O(n^2) | Space: O(1)
function longestPalindrome(s) {
  const expandAroundCenter = (left, right) => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    // Return the substring. Left and right are one step beyond.
    return s.substring(left + 1, right);
  };

  if (!s || s.length === 0) return "";

  let longest = "";
  for (let i = 0; i < s.length; i++) {
    // Odd length palindrome
    const oddPal = expandAroundCenter(i, i);
    // Even length palindrome
    const evenPal = expandAroundCenter(i, i + 1);

    if (oddPal.length > longest.length) longest = oddPal;
    if (evenPal.length > longest.length) longest = evenPal;
  }
  return longest;
}
```

```java
// Time: O(n^2) | Space: O(1)
public String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";

    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expandAroundCenter(s, i, i);     // Odd length
        int len2 = expandAroundCenter(s, i, i + 1); // Even length
        int len = Math.max(len1, len2);
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.substring(start, end + 1);
}

private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    // Return length of palindrome. (right - left - 1)
    return right - left - 1;
}
```

</div>

Another key pattern is using a **Sliding Window with a Hash Map** for problems like **Longest Substring Without Repeating Characters (#3)** or anagram finding. This is crucial for any substring analysis.

<div class="code-group">

```python
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s: str) -> int:
    char_index_map = {}
    left = 0
    max_length = 0

    for right, char in enumerate(s):
        # If char is seen and its index is within the current window, shrink window
        if char in char_index_map and char_index_map[char] >= left:
            left = char_index_map[char] + 1
        # Update the character's latest index
        char_index_map[char] = right
        # Update the maximum length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(min(m, n))
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
// Time: O(n) | Space: O(min(m, n))
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c) && map.get(c) >= left) {
            left = map.get(c) + 1;
        }
        map.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

## How Swiggy Tests String vs Other Companies

Compared to other companies, Swiggy's string questions are more **applied and less esoteric**. At a company like Google, you might get a string problem that is a clever disguise for a graph traversal (e.g., Word Ladder #127). At Amazon, you might see heavy use of tries for search autocomplete. At Swiggy, the problems are more direct: "Here is a string representing a path/log/query, process it efficiently."

The difficulty is consistently in the **LeetCode Medium** range. They prioritize a correct, well-explained, and clean solution over a highly optimized but obscure one. Interviewers often follow up with questions about scalability: "What if the input string was the size of all menu items in a city?" This tests if you understand the real-world implications of your algorithm's complexity.

## Study Order

Tackle string topics in this logical progression:

1.  **Basic Operations & Two-Pointers:** Start with reversing strings, checking palindromes, and two-pointer comparisons (Valid Palindrome #125). This builds intuition for in-place manipulation.
2.  **Sliding Window:** Learn the fixed and dynamic window patterns. This is arguably the most important pattern for Swiggy. Practice on Longest Substring Without Repeating Characters (#3) and Permutation in String (#567).
3.  **Hash Maps for Frequency:** Solve anagram (Valid Anagram #242, Group Anagrams #49) and character count problems. This teaches you to use a hash map as a frequency counter.
4.  **String Parsing & Simulation:** Practice problems that require iterating through a string and applying rules, like String to Integer (atoi) (#8) or Decode String (#394). This is pure, careful coding.
5.  **Basic Dynamic Programming:** Finally, tackle the classic Edit Distance (#72) and Longest Common Subsequence (#1143). Understand the DP table relationship. If you have time, explore more.

This order works because it builds from simple, single-pass algorithms to more complex state management (sliding window, DP), while always focusing on the iterative, practical style Swiggy uses.

## Recommended Practice Order

Solve these problems in sequence to build the specific competency Swiggy looks for:

1.  **Valid Palindrome (#125)** - Warm-up with two-pointers.
2.  **Longest Substring Without Repeating Characters (#3)** - Master the sliding window + hash map pattern.
3.  **Longest Palindromic Substring (#5)** - Master expanding around center (a two-pointer variant).
4.  **Group Anagrams (#49)** - Solidify hash map for frequency.
5.  **String to Integer (atoi) (#8)** - Excellent for testing parsing and edge-case handling.
6.  **Decode String (#394)** - Good simulation/parsing problem using stacks.
7.  **Edit Distance (#72)** - Understand the fundamental DP approach for string comparison.

Once you're comfortable with these, you'll have covered over 90% of the patterns Swiggy employs in their string-focused interviews. Remember to articulate your thought process clearly and discuss the time/space complexity—they value that communication as much as the correct code.

[Practice String at Swiggy](/company/swiggy/string)
