---
title: "String Questions at Paytm: What to Expect"
description: "Prepare for String interview questions at Paytm — patterns, difficulty breakdown, and study tips."
date: "2030-10-17"
category: "dsa-patterns"
tags: ["paytm", "string", "interview prep"]
---

If you're preparing for a Paytm interview, you'll quickly notice a significant trend: **String manipulation is a core competency they test heavily.** With 8 out of 29 total questions being String-based, this topic isn't just a random category—it's a deliberate focus area. This makes sense when you consider Paytm's business: a payments and financial services platform. Their core systems constantly process transaction data, validate formats (like UPI IDs, account numbers, PAN cards), parse logs, and handle text-based protocols. Interviewers aren't just picking String problems because they're common; they're selecting them because they mirror the day-to-day algorithmic thinking required for their backend and data systems. In real interviews, you can almost guarantee at least one, if not two, rounds will feature a medium-to-hard String problem.

## Specific Patterns Paytm Favors

Paytm's String questions aren't about trivial concatenation. They heavily favor problems that combine **string traversal with state management**, often requiring you to track multiple pointers or maintain a data structure like a stack or hash map. The patterns aren't overly academic; they're practical.

1.  **Two-Pointer / Sliding Window with Validation:** This is their bread and butter. Problems where you must find a substring or validate a pattern within constraints. Think "Longest Substring Without Repeating Characters" but with an extra twist, like ignoring certain characters or having a complex validity condition.
2.  **Parsing & State Machines:** Given their domain, questions that involve parsing a string according to specific rules (e.g., validating a complex input format, decoding an encoded string) are common. This tests your ability to write clean, bug-free, iterative logic.
3.  **String Transformation & Simulation:** Problems where you are asked to perform a series of operations on a string (like edits, swaps, or rotations) and determine the outcome or the minimum steps required.

You will rarely see pure, recursive String DP (like wildcard matching) at Paytm. Their style is more iterative and pointer-driven.

## How to Prepare

The key is to master the sliding window pattern and its variations. Let's look at the core template and a common Paytm-style twist: finding the longest valid substring where characters can be replaced `k` times (a pattern seen in problems like "Longest Repeating Character Replacement" #424).

The core idea: maintain a window `[left, right]`. Track the frequency of characters in the window. The window is valid if `(window_length - max_frequency) <= k`, meaning we can replace the non-dominant characters to make the whole window uniform. If invalid, shrink from the left.

<div class="code-group">

```python
def character_replacement(s: str, k: int) -> int:
    """
    Time: O(n) | Space: O(26) => O(1)
    We process each character at most twice (add and remove from window).
    """
    freq = {}
    left = 0
    max_len = 0
    max_freq_in_window = 0

    for right in range(len(s)):
        # 1. Expand window to the right
        freq[s[right]] = freq.get(s[right], 0) + 1
        max_freq_in_window = max(max_freq_in_window, freq[s[right]])

        # 2. Check if window is invalid
        # Invalid means: chars to replace > k
        # chars to replace = window_size - max_freq
        window_size = right - left + 1
        if (window_size - max_freq_in_window) > k:
            # 3. Shrink from left to restore validity
            freq[s[left]] -= 1
            left += 1
            # Note: We don't need to update max_freq_in_window here.
            # Shrinking can only decrease or keep the same max frequency.
            # A lower max_freq only makes our validity check stricter, which is safe.

        # 4. Update answer
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
function characterReplacement(s, k) {
  // Time: O(n) | Space: O(26) => O(1)
  const freq = new Map();
  let left = 0;
  let maxLen = 0;
  let maxFreqInWindow = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Expand window
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);
    maxFreqInWindow = Math.max(maxFreqInWindow, freq.get(s[right]));

    // 2. Check validity
    let windowSize = right - left + 1;
    if (windowSize - maxFreqInWindow > k) {
      // 3. Shrink
      freq.set(s[left], freq.get(s[left]) - 1);
      left++;
    }

    // 4. Update answer
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
public int characterReplacement(String s, int k) {
    // Time: O(n) | Space: O(26) => O(1)
    int[] freq = new int[26]; // Assuming uppercase English letters
    int left = 0;
    int maxLen = 0;
    int maxFreqInWindow = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand window
        char c = s.charAt(right);
        freq[c - 'A']++;
        maxFreqInWindow = Math.max(maxFreqInWindow, freq[c - 'A']);

        // 2. Check validity
        int windowSize = right - left + 1;
        if (windowSize - maxFreqInWindow > k) {
            // 3. Shrink
            freq[s.charAt(left) - 'A']--;
            left++;
        }

        // 4. Update answer
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

For parsing problems, practice iterative, index-based traversal with clear condition checks. Here's a template for a simple but common pattern: validating if a string is a valid number (simplified version of LeetCode #65).

<div class="code-group">

```python
def is_valid_number(s: str) -> bool:
    """
    Simplified validator: Allows optional sign, digits, optional decimal point.
    Time: O(n) | Space: O(1)
    """
    i = 0
    n = len(s)

    # 1. Skip leading whitespace (if rule allows)
    # while i < n and s[i] == ' ': i += 1

    # 2. Check optional sign
    if i < n and (s[i] == '+' or s[i] == '-'):
        i += 1

    has_digits = False
    # 3. Check digits before decimal
    while i < n and s[i].isdigit():
        i += 1
        has_digits = True

    # 4. Check decimal point and digits after
    if i < n and s[i] == '.':
        i += 1
        while i < n and s[i].isdigit():
            i += 1
            has_digits = True

    # Must have seen at least some digits
    if not has_digits:
        return False

    # 5. Skip trailing whitespace
    # while i < n and s[i] == ' ': i += 1

    # 6. Must have consumed entire string
    return i == n
```

```javascript
function isValidNumber(s) {
  // Time: O(n) | Space: O(1)
  let i = 0;
  const n = s.length;

  // Optional: skip leading whitespace
  // while (i < n && s[i] === ' ') i++;

  // Optional sign
  if (i < n && (s[i] === "+" || s[i] === "-")) i++;

  let hasDigits = false;
  // Digits before decimal
  while (i < n && /\d/.test(s[i])) {
    i++;
    hasDigits = true;
  }

  // Decimal and digits after
  if (i < n && s[i] === ".") {
    i++;
    while (i < n && /\d/.test(s[i])) {
      i++;
      hasDigits = true;
    }
  }

  if (!hasDigits) return false;

  // Optional: skip trailing whitespace
  // while (i < n && s[i] === ' ') i++;

  return i === n;
}
```

```java
public boolean isValidNumber(String s) {
    // Time: O(n) | Space: O(1)
    int i = 0;
    int n = s.length();

    // Skip leading whitespace if needed
    // while (i < n && s.charAt(i) == ' ') i++;

    // Sign
    if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) i++;

    boolean hasDigits = false;
    // Digits before decimal
    while (i < n && Character.isDigit(s.charAt(i))) {
        i++;
        hasDigits = true;
    }

    // Decimal point
    if (i < n && s.charAt(i) == '.') {
        i++;
        while (i < n && Character.isDigit(s.charAt(i))) {
            i++;
            hasDigits = true;
        }
    }

    if (!hasDigits) return false;

    // Skip trailing whitespace
    // while (i < n && s.charAt(i) == ' ') i++;

    return i == n;
}
```

</div>

## How Paytm Tests String vs Other Companies

Compared to other companies, Paytm's String questions have a distinct flavor:

- **vs. FAANG (Meta, Google):** FAANG often uses String problems as a vehicle for more abstract data structure design (e.g., implement a Trie, solve with a complex graph). Paytm's problems are more grounded. They feel like a simplified version of a real task a payments engineer might code: "validate this input," "find the longest valid transaction description," "parse this log line."
- **vs. Service-Based/Consulting (TCS, Infosys):** The difficulty is higher. While service companies might ask about basic anagrams or palindromes, Paytm expects you to combine 2-3 concepts (sliding window + hash map + some validation logic) in a single solution.
- **Unique Approach:** Paytm interviewers often provide a problem statement that is _slightly_ more verbose or business-contextual than a pure LeetCode title. They want to see if you can cut through the fluff, identify the core algorithmic pattern (e.g., "this is just a sliding window"), and implement it robustly. They pay close attention to edge cases and clean code.

## Study Order

Tackle String topics in this order to build a logical progression:

1.  **Basic Traversal & Two-Pointers:** Before you slide a window, you must be able to walk through a string with two indices. Practice reversal, palindrome checks, and comparing strings from the ends inward.
2.  **Hash Map for Frequency Counting:** This is the most common auxiliary data structure for String problems. Master building character frequency maps and using them to check anagrams or compare subsets.
3.  **Sliding Window (Fixed & Variable):** This is the peak of Paytm's String focus. Start with fixed-size window problems (e.g., max average subarray) to understand the mechanics, then move to variable-size windows (like the replacement problem above).
4.  **Parsing & Iterative State Simulation:** Learn to process strings token-by-token using an index `i`, making decisions based on the current character and perhaps a simple state variable (e.g., "have we seen a decimal yet?").
5.  **String Building & In-Place Operations:** Practice problems that require efficient string building (using `StringBuilder` in Java, list joins in Python) or in-place edits (often simulated with character arrays).

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **Valid Palindrome (#125):** Basic two-pointer traversal.
2.  **Valid Anagram (#242):** Basic hash map frequency count.
3.  **Longest Substring Without Repeating Characters (#3):** The classic variable sliding window introduction.
4.  **Permutation in String (#567):** Fixed-size sliding window with frequency map.
5.  **Longest Repeating Character Replacement (#424):** Variable sliding window with the "replacement" validity rule—**a Paytm favorite pattern**.
6.  **Minimum Window Substring (#76):** A harder sliding window that requires matching a target frequency map. Tests optimization.
7.  **Valid Number (#65):** A classic parsing/state machine problem. Implement the iterative logic cleanly.
8.  **Decode String (#394):** Combines parsing with stack usage for nested rules—tests multiple concepts.

Master this progression, and you'll be able to deconstruct and solve the majority of Paytm's String interview questions. Remember, they care about correct, clean, and efficient code that solves a concrete-sounding problem.

[Practice String at Paytm](/company/paytm/string)
