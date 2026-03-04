---
title: "String Questions at MakeMyTrip: What to Expect"
description: "Prepare for String interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-11"
category: "dsa-patterns"
tags: ["makemytrip", "string", "interview prep"]
---

String manipulation is a core skill tested in MakeMyTrip technical interviews. With nearly half of their coding problems (11 out of 24) focusing on strings, proficiency here is non-negotiable. This emphasis exists because travel technology fundamentally operates on textual data: processing user queries, parsing itinerary formats (like "DEL-BOM-12:30"), validating coupon codes, handling hotel/airport names, and managing search filters. Efficient string algorithms directly translate to faster search results, accurate booking systems, and a smoother user experience. If you can't manipulate strings cleanly under constraints, you'll struggle in their real-world backend and data processing roles.

## What to Expect — Types of Problems

MakeMyTrip's string problems are practical and often involve pattern matching, parsing, and transformation. You can expect these categories:

1.  **Pattern Searching & Matching:** Implementing or using algorithms like KMP, Rabin-Karp, or Z-algorithm to find substrings (e.g., searching for airport codes within a flight description).
2.  **String Parsing & Validation:** Breaking down complex formats (e.g., "2 adults, 1 child" or date strings) and checking validity (e.g., coupon code rules, email formatting).
3.  **String Transformation & Encoding:** Problems involving run-length encoding, shortening URLs, or reformatting text according to specific rules.
4.  **Anagrams & Palindromes:** Checking for anagram groupings of hotel names or finding the longest palindromic substring in a user review.
5.  **Two-Pointer & Sliding Window on Strings:** Efficiently solving problems like finding substrings with unique characters or minimum window substring, which is common in search autocomplete optimization.

## How to Prepare — Study Tips with One Code Example

Focus on mastering fundamental operations and classic algorithms. Practice writing bug-free code for reversing strings, checking palindromes, and finding substrings. Then, move to advanced patterns like sliding window and KMP. Always discuss time and space complexity. For parsing problems, practice using regular expressions judiciously and also manual iteration.

A critical pattern is the **Sliding Window for substrings with unique characters**. This is common in problems like "longest substring without repeating characters," which models scenarios like validating a session ID or tracking a unique search query.

<div class="code-group">

```python
def length_of_longest_substring(s: str) -> int:
    char_set = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len
```

```javascript
function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
public int lengthOfLongestSubstring(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        charSet.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

## Recommended Practice Order

Tackle problems in this sequence to build competence systematically:

1.  **Basics:** Reversal, palindrome checks, anagram detection.
2.  **Two-Pointer:** Problems like valid palindrome, comparing strings with backspaces.
3.  **Sliding Window:** Longest substring with K distinct characters, minimum window substring.
4.  **Advanced Algorithms:** Implement KMP for pattern searching, Rabin-Karp for multiple pattern search.
5.  **Parsing & Simulation:** Decode strings, convert between formats (e.g., zigzag conversion).

This progression ensures you handle the most frequent patterns first before tackling complex, less common problems.

[Practice String at MakeMyTrip](/company/makemytrip/string)
