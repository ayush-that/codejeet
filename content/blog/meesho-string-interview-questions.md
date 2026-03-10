---
title: "String Questions at Meesho: What to Expect"
description: "Prepare for String interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-13"
category: "dsa-patterns"
tags: ["meesho", "string", "interview prep"]
---

String questions at Meesho aren't just a random topic — they're a deliberate filter. With 6 out of 44 total problems tagged as String, that's roughly 14% of their curated problem list. In real interviews, especially for early-career and mid-level roles, you're very likely to encounter at least one string manipulation or pattern matching question. Why? Because Meesho's core business — a social commerce platform connecting suppliers to resellers — deals heavily with text data: product titles, descriptions, search queries, user messages, and category hierarchies. Engineers here need to write efficient, clean code to parse, validate, transform, and match strings at scale. A sloppy string algorithm can lead to slow search, incorrect product matching, or poor user experience. So while it's not their _only_ focus, it's a fundamental skill they consistently test.

## Specific Patterns Meesho Favors

Meesho's string problems tend to avoid esoteric, purely academic challenges. They favor **applied, iterative problems** that test your ability to manipulate strings with efficiency and clarity. Three patterns stand out:

1.  **Two-Pointer / Sliding Window on Strings:** This is their bread and butter. Problems involving palindromes, substrings, or comparisons without extra space often use this. It tests in-place manipulation skills.
2.  **String Parsing & Simulation:** Given their domain, questions that involve parsing a rule (e.g., a simplified version of a product SKU or a command) and simulating an outcome are common. This tests your attention to detail and ability to translate specs into code.
3.  **Hash Map for Character Counting:** An extension of the classic anagram problem. They like variations that require counting characters across strings to determine if one can be transformed into another, or to find the smallest window containing certain characters.

You won't typically see heavy recursive string DP (like complex regular expression matching) as a first question. Their problems lean towards **iterative solutions with O(n) or O(n log n) time and minimal extra space.**

For example, problems like **Valid Palindrome II (#680)** (two-pointer with one deletion allowance) or **Find All Anagrams in a String (#438)** (sliding window with hash map) are very representative of their style. They might also adapt a problem like **String Compression (#443)** (in-place modification with two pointers) to fit a scenario about compressing product attribute lists.

## How to Prepare

The key is mastery of the two-pointer technique and the sliding window pattern. Let's look at a template for the sliding window with a hash map, which solves a huge class of "substring" problems.

<div class="code-group">

```python
def find_anagrams(s: str, p: str) -> list[int]:
    """
    Find all start indices of p's anagrams in s.
    LeetCode #438 style.
    Time: O(n) where n = len(s) | Space: O(1) (fixed 26-letter alphabet, or O(k) for general charset)
    """
    if len(p) > len(s):
        return []

    result = []
    p_count = [0] * 26
    window_count = [0] * 26

    # Build the initial frequency map for p and the first window in s
    for i in range(len(p)):
        p_count[ord(p[i]) - ord('a')] += 1
        window_count[ord(s[i]) - ord('a')] += 1

    # Check the first window
    if p_count == window_count:
        result.append(0)

    # Slide the window
    for i in range(len(p), len(s)):
        # Add the new character to the window
        window_count[ord(s[i]) - ord('a')] += 1
        # Remove the character that's sliding out of the window
        window_count[ord(s[i - len(p)]) - ord('a')] -= 1

        # Compare the maps. Constant time operation for fixed alphabet.
        if p_count == window_count:
            result.append(i - len(p) + 1)

    return result
```

```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
function findAnagrams(s, p) {
  // Time: O(n) | Space: O(1) (fixed 26-letter alphabet)
  if (p.length > s.length) return [];

  const result = [];
  const pCount = new Array(26).fill(0);
  const windowCount = new Array(26).fill(0);

  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - 97]++;
    windowCount[s.charCodeAt(i) - 97]++;
  }

  if (arraysEqual(pCount, windowCount)) {
    result.push(0);
  }

  for (let i = p.length; i < s.length; i++) {
    windowCount[s.charCodeAt(i) - 97]++;
    windowCount[s.charCodeAt(i - p.length) - 97]--;

    if (arraysEqual(pCount, windowCount)) {
      result.push(i - p.length + 1);
    }
  }

  return result;
}

// Helper function to compare two arrays
function arraysEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
```

```java
import java.util.*;

public class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        // Time: O(n) | Space: O(1) (fixed 26-letter alphabet)
        List<Integer> result = new ArrayList<>();
        if (p.length() > s.length()) return result;

        int[] pCount = new int[26];
        int[] windowCount = new int[26];

        for (int i = 0; i < p.length(); i++) {
            pCount[p.charAt(i) - 'a']++;
            windowCount[s.charAt(i) - 'a']++;
        }

        if (Arrays.equals(pCount, windowCount)) {
            result.add(0);
        }

        for (int i = p.length(); i < s.length(); i++) {
            windowCount[s.charAt(i) - 'a']++;
            windowCount[s.charAt(i - p.length()) - 'a']--;

            if (Arrays.equals(pCount, windowCount)) {
                result.add(i - p.length() + 1);
            }
        }
        return result;
    }
}
```

</div>

The second critical pattern is in-place string modification using two pointers from opposite ends. This is essential for palindrome problems.

<div class="code-group">

```python
def valid_palindrome_ii(s: str) -> bool:
    """
    Can s become a palindrome by deleting at most one character?
    LeetCode #680.
    Time: O(n) | Space: O(1)
    """
    def is_pal_range(left: int, right: int) -> bool:
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            # Try deleting either the left or the right character
            return (is_pal_range(left + 1, right) or
                    is_pal_range(left, right - 1))
        left += 1
        right -= 1
    return True  # It's already a palindrome
```

```javascript
function validPalindromeII(s) {
  // Time: O(n) | Space: O(1)
  const isPalRange = (l, r) => {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++;
      r--;
    }
    return true;
  };

  let left = 0,
    right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return isPalRange(left + 1, right) || isPalRange(left, right - 1);
    }
    left++;
    right--;
  }
  return true;
}
```

```java
public class Solution {
    public boolean validPalindrome(String s) {
        // Time: O(n) | Space: O(1)
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return isPalindrome(s, left + 1, right) || isPalindrome(s, left, right - 1);
            }
            left++;
            right--;
        }
        return true;
    }

    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }
}
```

</div>

## How Meesho Tests String vs Other Companies

Compared to FAANG companies, Meesho's string questions are often more **pragmatic and less mathematically tricky**. At Google, you might get a string problem that's a thin disguise for a graph traversal (e.g., word ladder). At Amazon, you might get heavy string parsing related to AWS log formats. Meesho's questions tend to sit in the middle: they require solid algorithmic thinking but are more directly about manipulating the string itself.

The difficulty is usually in the **"Medium"** range on LeetCode. They rarely ask "Hard" string problems unless it's for a senior role, and even then, it would likely be a Hard problem that breaks down into clear, manageable steps (like a simulation). The unique aspect is the potential for a **follow-up that changes constraints**, e.g., "What if the string is a stream and you can't store it all?" or "How would you make this case-insensitive and ignore special characters?" This tests your ability to adapt a core solution.

## Study Order

Don't jump into complex patterns. Build a foundation.

1.  **Basic Operations & Two-Pointers:** Start with reversing strings, checking palindromes, and comparing strings with basic two-pointer logic. This builds intuition for in-place manipulation. (Problems: Reverse String (#344), Valid Palindrome (#125))
2.  **Hash Maps for Counting:** Learn to use arrays (for fixed alphabets) or hash maps to count character frequencies. This is the gateway to anagram and permutation problems. (Problems: Valid Anagram (#242), First Unique Character in a String (#387))
3.  **Sliding Window:** Master the fixed-length window (like the anagram finder above) before moving to variable-length windows. This pattern is non-negotiable. (Problems: Permutation in String (#567), Find All Anagrams in a String (#438))
4.  **String Parsing & Simulation:** Practice iterating through strings, building tokens, and applying rules. Handle edge cases like empty strings, leading/trailing spaces, and multiple delimiters. (Problems: String to Integer (atoi) (#8), Decode String (#394) - a great simulation challenge)
5.  **Advanced Two-Pointer:** Tackle problems where you need to modify the string in-place with more complex rules, or where the two-pointer logic isn't just at the ends. (Problems: Reverse Words in a String (#151) - do it in O(1) space, Valid Palindrome II (#680))

This order works because each topic relies on concepts from the previous one. Sliding window uses hash maps for its state. Advanced two-pointer problems often build on the confidence from basic ones.

## Recommended Practice Order

Solve these in sequence to build the skills Meesho looks for:

1.  **Valid Anagram (#242)** - Warm-up with hash maps.
2.  **Valid Palindrome (#125)** - Basic two-pointer, practice cleaning input.
3.  **Reverse Words in a String (#151)** - In-place manipulation and parsing. Aim for O(1) extra space.
4.  **Find All Anagrams in a String (#438)** - Solidify the sliding window + hash map pattern.
5.  **Valid Palindrome II (#680)** - Advanced two-pointer with a simple decision branch.
6.  **String Compression (#443)** - Excellent test of in-place modification with careful pointer management.
7.  **Decode String (#394)** - A step up in parsing/simulation, tests stack usage and iterative logic.

This sequence moves from foundational to more integrated problem-solving, mirroring how an interview might progress from an initial concept to a more involved follow-up.

[Practice String at Meesho](/company/meesho/string)
