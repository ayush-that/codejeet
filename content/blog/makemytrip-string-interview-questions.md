---
title: "String Questions at MakeMyTrip: What to Expect"
description: "Prepare for String interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-03"
category: "dsa-patterns"
tags: ["makemytrip", "string", "interview prep"]
---

If you're preparing for a software engineering interview at MakeMyTrip, you need to pay special attention to String manipulation problems. With nearly half of their coding questions (11 out of 24) focusing on Strings, this isn't just another topic—it's a core competency they actively screen for. This heavy emphasis makes sense for a travel-tech giant. Think about their core business: parsing flight itineraries (strings like "DEL → BOM → GOI"), validating user input (names, passport numbers, email addresses), processing search queries, and formatting booking confirmations. A candidate who struggles with string operations would struggle with the company's fundamental data processing tasks. In real interviews, you can almost certainly expect at least one, and often two, string-focused problems in your coding rounds.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's string problems aren't about obscure text algorithms. They favor practical, iterative problem-solving that tests your ability to manipulate data in-place, traverse with multiple pointers, and handle edge cases in real-world scenarios. The patterns lean heavily toward:

1.  **Two-Pointer / Sliding Window:** This is their bread and butter. Problems often involve finding substrings, checking for palindromes, or compressing/formatting strings without extra space.
2.  **Iterative Simulation & Parsing:** You'll be asked to simulate a process, like decoding a string (`a2[b]` becomes `abb`) or executing a sequence of instructions. Recursion appears, but the optimal solution is often an iterative stack-based approach.
3.  **Hash Map for Frequency & State Tracking:** Used in conjunction with sliding windows for problems like "longest substring with K distinct characters" or checking anagrams.

You won't find many complex suffix trees or advanced dynamic programming on strings here. The focus is on clean, efficient, and bug-free implementation of the patterns above. For example, **Decode String (LeetCode #394)** is a classic MakeMyTrip-style problem: it requires parsing nested structures, managing state with stacks, and building strings efficiently—all highly relevant to parsing travel booking codes or rules.

## How to Prepare

The key is to master the two-pointer/sliding window pattern and its variations. Let's look at a fundamental example: checking if a string is a palindrome, considering only alphanumeric characters and ignoring case. This tests your two-pointer skills and attention to validation details.

<div class="code-group">

```python
def is_palindrome(s: str) -> bool:
    """
    Checks if a string is a valid palindrome.
    Time: O(n) - We traverse the string once.
    Space: O(1) - We use only two pointers.
    """
    left, right = 0, len(s) - 1

    while left < right:
        # Move left pointer to next alphanumeric char
        while left < right and not s[left].isalnum():
            left += 1
        # Move right pointer to previous alphanumeric char
        while left < right and not s[right].isalnum():
            right -= 1

        # Compare characters (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True
```

```javascript
function isPalindrome(s) {
  /**
   * Checks if a string is a valid palindrome.
   * Time: O(n) - We traverse the string once.
   * Space: O(1) - We use only two pointers.
   */
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Move left pointer to next alphanumeric char
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) {
      left++;
    }
    // Move right pointer to previous alphanumeric char
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) {
      right--;
    }

    // Compare characters (case-insensitive)
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}
```

```java
public boolean isPalindrome(String s) {
    /**
     * Checks if a string is a valid palindrome.
     * Time: O(n) - We traverse the string once.
     * Space: O(1) - We use only two pointers.
     */
    int left = 0;
    int right = s.length() - 1;

    while (left < right) {
        // Move left pointer to next alphanumeric char
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }
        // Move right pointer to previous alphanumeric char
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }

        // Compare characters (case-insensitive)
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}
```

</div>

For a more advanced pattern, the sliding window with a hash map is critical. Let's implement finding the length of the longest substring with at most K distinct characters, a pattern directly applicable to search query analysis.

<div class="code-group">

```python
def longest_substring_k_distinct(s: str, k: int) -> int:
    """
    Finds the length of the longest substring with at most K distinct characters.
    Time: O(n) - Each character is processed at most twice (by left and right pointers).
    Space: O(k) - The hash map stores at most k+1 character frequencies.
    """
    char_count = {}
    left = 0
    max_length = 0

    for right in range(len(s)):
        # Add current character to the window
        right_char = s[right]
        char_count[right_char] = char_count.get(right_char, 0) + 1

        # Shrink window if we have more than k distinct chars
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # Update max length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
function longestSubstringKDistinct(s, k) {
  /**
   * Finds the length of the longest substring with at most K distinct characters.
   * Time: O(n) - Each character is processed at most twice.
   * Space: O(k) - The map stores at most k+1 character frequencies.
   */
  const charCount = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // Add current character to the window
    const rightChar = s[right];
    charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

    // Shrink window if we have more than k distinct chars
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // Update max length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
public int longestSubstringKDistinct(String s, int k) {
    /**
     * Finds the length of the longest substring with at most K distinct characters.
     * Time: O(n) - Each character is processed at most twice.
     * Space: O(k) - The map stores at most k+1 character frequencies.
     */
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        // Add current character to the window
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // Shrink window if we have more than k distinct chars
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // Update max length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

## How MakeMyTrip Tests String vs Other Companies

Compared to other companies, MakeMyTrip's string questions have a distinct "applied" flavor. At a company like Google, you might get a string problem that's a clever disguise for a graph theory concept (e.g., Word Ladder). At Amazon, you might need to integrate string parsing with object-oriented design. MakeMyTrip, however, keeps it closer to the data manipulation layer. The difficulty is often in the **edge cases and implementation details**, not in discovering a novel algorithm. For example, a problem might involve formatting a date string according to locale-specific rules or parsing a complex but well-defined itinerary format. The interviewer will watch closely for off-by-one errors, proper handling of empty inputs, and efficient memory usage. What's unique is the expectation of **production-ready code** in an interview setting—clean, commented where necessary, and robust.

## Study Order

Tackle these sub-topics in this order to build a solid foundation:

1.  **Basic Traversal & Two-Pointers:** Start here because every other pattern builds on the ability to navigate a string efficiently. Practice reversing strings, checking palindromes, and comparing strings.
2.  **Sliding Window:** Learn the fixed and dynamic window patterns next. This is MakeMyTrip's most frequent pattern, used for substring problems. Understand how to maintain window invariants.
3.  **Hash Map for Frequency:** Integrate hash maps with sliding windows. This combination solves a huge class of problems (anagrams, longest substring with K distinct characters).
4.  **Stack for Parsing & Simulation:** Learn to use stacks for problems involving nested structures (Decode String, Valid Parentheses). This is crucial for simulating sequential processes.
5.  **Interleaving & Merging:** Finally, practice problems that require merging two strings or checking interleaving. These often combine multiple pointers with conditional logic.

This order works because it moves from simple linear traversal to managing state (with hash maps) to managing sequence and history (with stacks), which is the natural progression of complexity in MakeMyTrip's problem set.

## Recommended Practice Order

Solve these specific problems in sequence to build the right skills:

1.  **Valid Palindrome (LeetCode #125):** Master the basic two-pointer pattern with validation.
2.  **Longest Substring Without Repeating Characters (LeetCode #3):** The canonical sliding window problem.
3.  **Minimum Window Substring (LeetCode #76):** A harder sliding window that introduces the "have/need" count pattern.
4.  **Longest Substring with At Most K Distinct Characters (LeetCode #340):** Direct practice for the pattern shown in the code above.
5.  **Decode String (LeetCode #394):** Excellent practice for stack-based parsing and string building.
6.  **String Compression (LeetCode #443):** Tests in-place modification with two-pointers.
7.  **Find All Anagrams in a String (LeetCode #438):** Combines sliding window with frequency counting perfectly.
8.  **Valid Parentheses (LeetCode #20):** A foundational stack problem.
9.  **Group Anagrams (LeetCode #49):** Focuses on hashing string patterns.
10. **Integer to English Words (LeetCode #273):** A challenging MakeMyTrip-style problem that tests meticulous parsing and edge-case handling—a great final challenge.

This sequence starts with core patterns, adds complexity, and finishes with a problem that demands careful, clean implementation—exactly what your interview will require.

[Practice String at MakeMyTrip](/company/makemytrip/string)
