---
title: "String Questions at Agoda: What to Expect"
description: "Prepare for String interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-06"
category: "dsa-patterns"
tags: ["agoda", "string", "interview prep"]
---

## Why String Questions Dominate Agoda Interviews

If you're preparing for an Agoda interview, you need to know this: **14 out of their 46 tagged LeetCode problems are String-based.** That's over 30% of their technical question bank. This isn't a coincidence — it's a direct reflection of their business. Agoda operates in travel technology, where strings are the fundamental data type for processing user queries, hotel names, locations, dates, and multilingual content. Every search, booking, and recommendation engine they build manipulates strings at scale. In real interviews, you're almost guaranteed to encounter at least one string problem, often as the first technical screen or the main coding round.

What makes Agoda's string questions particularly interesting is their practical slant. Unlike companies that might ask purely algorithmic string puzzles, Agoda's problems often mirror real-world scenarios their engineers face: parsing complex search queries, validating input formats, or implementing search-related features. The difficulty tends to be medium, but with a twist — they test not just whether you can solve it, but whether you can write clean, maintainable code that handles edge cases gracefully.

## Specific Patterns Agoda Favors

Agoda's string problems cluster around three core patterns that reflect their engineering needs:

1. **Two-Pointer/Sliding Window for Search Optimization** — This is their most frequent pattern. Think about it: travel searches involve filtering through massive datasets. Problems like checking for palindromes, finding substrings with certain properties, or comparing strings with edits directly model search relevance algorithms. They love variations where you need to efficiently scan and compare.

2. **Parsing and Validation** — Given that they process booking data (dates, locations, special requests), problems involving string parsing, format validation, and rule application appear regularly. These test your attention to detail and ability to translate business rules into clean code.

3. **HashMap/Set for Character Counting** — Many of their problems involve checking anagrams, character uniqueness, or frequency-based comparisons. This pattern is fundamental to features like autocomplete, spell-check, or duplicate detection in user-generated content.

Here's a classic Agoda-style sliding window problem: finding the longest substring without repeating characters (LeetCode #3). This mirrors their need to process unique sequences in user sessions or search tokens.

<div class="code-group">

```python
def length_of_longest_substring(s: str) -> int:
    """
    Sliding window approach to find longest substring without repeating chars.
    Time: O(n) - each character visited at most twice (left and right pointer)
    Space: O(min(m, n)) - where m is character set size (ASCII: 128, Unicode: more)
    """
    char_index = {}  # stores the most recent index of each character
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If character exists in window, move left pointer past its last occurrence
        if s[right] in char_index and char_index[s[right]] >= left:
            left = char_index[s[right]] + 1

        # Update character's latest index
        char_index[s[right]] = right

        # Update max length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
function lengthOfLongestSubstring(s) {
  /**
   * Sliding window approach to find longest substring without repeating chars.
   * Time: O(n) - each character visited at most twice
   * Space: O(min(m, n)) - where m is character set size
   */
  const charIndex = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // If character exists in window, move left pointer past its last occurrence
    if (charIndex.has(s[right]) && charIndex.get(s[right]) >= left) {
      left = charIndex.get(s[right]) + 1;
    }

    // Update character's latest index
    charIndex.set(s[right], right);

    // Update max length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
public int lengthOfLongestSubstring(String s) {
    /**
     * Sliding window approach to find longest substring without repeating chars.
     * Time: O(n) - each character visited at most twice
     * Space: O(min(m, n)) - where m is character set size (ASCII: 128)
     */
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char current = s.charAt(right);

        // If character exists in window, move left pointer past its last occurrence
        if (charIndex.containsKey(current) && charIndex.get(current) >= left) {
            left = charIndex.get(current) + 1;
        }

        // Update character's latest index
        charIndex.put(current, right);

        // Update max length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

## How to Prepare

Master these patterns through deliberate practice. Don't just solve problems — solve them with Agoda's practical mindset:

1. **Always start with edge cases** — empty strings, single characters, Unicode characters, very long inputs. Agoda interviews test production readiness.
2. **Optimize for readability first, then performance** — Their engineers maintain large codebases. Clear variable names and logical flow matter.
3. **Practice explaining as you code** — They want to see your thought process, not just the solution.

For parsing problems, here's a common pattern: validating if a string follows specific rules (like a simplified version of LeetCode #65, Valid Number). This tests your ability to handle state transitions cleanly.

<div class="code-group">

```python
def is_valid_search_query(query: str) -> bool:
    """
    Example: Validate a simple search query format (letters, numbers, spaces, hyphens only)
    Simpler version of real validation logic used in search systems.
    Time: O(n) - single pass through string
    Space: O(1) - only constant extra space
    """
    if not query or len(query) > 100:  # Practical length limit
        return False

    for char in query:
        # Allow alphanumeric, spaces, and hyphens
        if not (char.isalnum() or char == ' ' or char == '-'):
            return False

    # Additional business rule: must contain at least one letter
    return any(char.isalpha() for char in query)
```

```javascript
function isValidSearchQuery(query) {
  /**
   * Validate a simple search query format (letters, numbers, spaces, hyphens only)
   * Time: O(n) - single pass through string
   * Space: O(1) - only constant extra space
   */
  if (!query || query.length > 100) {
    return false;
  }

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const isAlphanumeric = /[a-zA-Z0-9]/.test(char);

    // Allow alphanumeric, spaces, and hyphens
    if (!(isAlphanumeric || char === " " || char === "-")) {
      return false;
    }
  }

  // Additional business rule: must contain at least one letter
  return /[a-zA-Z]/.test(query);
}
```

```java
public boolean isValidSearchQuery(String query) {
    /**
     * Validate a simple search query format (letters, numbers, spaces, hyphens only)
     * Time: O(n) - single pass through string
     * Space: O(1) - only constant extra space
     */
    if (query == null || query.length() == 0 || query.length() > 100) {
        return false;
    }

    boolean hasLetter = false;

    for (int i = 0; i < query.length(); i++) {
        char c = query.charAt(i);
        boolean isAlphanumeric = Character.isLetterOrDigit(c);

        // Allow alphanumeric, spaces, and hyphens
        if (!(isAlphanumeric || c == ' ' || c == '-')) {
            return false;
        }

        if (Character.isLetter(c)) {
            hasLetter = true;
        }
    }

    // Additional business rule: must contain at least one letter
    return hasLetter;
}
```

</div>

## How Agoda Tests String vs Other Companies

Agoda's string questions differ from other companies in subtle but important ways:

- **vs FAANG**: FAANG companies often ask harder, more abstract string problems (like DP on strings or complex pattern matching). Agoda's problems are more applied — you can often guess why this algorithm matters to their business.
- **vs Startups**: Startups might ask string questions that test raw speed or clever tricks. Agoda emphasizes maintainability and edge case handling over clever one-liners.
- **vs Finance**: Finance companies might focus on string parsing for data formats. Agoda focuses on search and user input scenarios.

The unique aspect is **practical constraints**. You'll often see reasonable input limits (not billions of characters) but with requirements that mirror real systems: "Assume the string comes from user input" or "Consider multilingual support." They're testing if you think like an engineer building their specific products.

## Study Order

Follow this progression to build your skills systematically:

1. **Basic String Operations** — Reversal, anagrams, palindromes. These teach you to manipulate strings without libraries. (LeetCode #242, #125)
2. **Two-Poiter Techniques** — Start with simple two-pointer comparisons, then move to sliding windows. This is Agoda's most used pattern. (LeetCode #167, #3, #76)
3. **HashMap/Set Applications** — Character counting, frequency analysis, duplicate detection. Essential for search relevance features. (LeetCode #49, #387)
4. **Parsing and Validation** — State machines, rule application, format checking. Mirrors their data processing needs. (LeetCode #65, #468)
5. **Advanced Patterns (if time)** — Dynamic programming on strings (edit distance) or more complex pattern matching. These appear less frequently but show depth.

This order works because each layer builds on the previous one. You can't solve sliding window problems efficiently without understanding two-pointer basics. You can't implement robust validation without knowing how to traverse and inspect strings thoroughly.

## Recommended Practice Order

Solve these Agoda-tagged problems in sequence:

1. **Valid Palindrome (#125)** — Basic two-pointer, handles alphanumeric filtering
2. **Group Anagrams (#49)** — HashMap pattern for categorization
3. **Longest Substring Without Repeating Characters (#3)** — Core sliding window pattern
4. **Valid Parentheses (#20)** — Stack-based parsing (common in query validation)
5. **String to Integer (atoi) (#8)** — Parsing with edge cases
6. **Longest Palindromic Substring (#5)** — Expands two-pointer technique
7. **Minimum Window Substring (#76)** — Advanced sliding window
8. **Valid Number (#65)** — Complex state-based validation

This sequence starts with fundamentals and progresses to Agoda's more complex favorites, ensuring you build confidence while covering their most tested patterns.

[Practice String at Agoda](/company/agoda/string)
