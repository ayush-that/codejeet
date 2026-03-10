---
title: "String Questions at Uber: What to Expect"
description: "Prepare for String interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-05-22"
category: "dsa-patterns"
tags: ["uber", "string", "interview prep"]
---

If you're preparing for an Uber interview, you've likely seen the statistic: **74 of their 381 tagged LeetCode problems are String questions.** That's nearly 20% of their problem bank. This isn't a coincidence. Uber's core business—matching riders to drivers, calculating routes, parsing addresses, and processing trip data—is fundamentally built on manipulating and understanding textual and sequential data. A String question at Uber is rarely an academic exercise; it's often a simplified version of a real-world problem their engineers solve daily, like parsing a GPS log, validating an address format, or comparing similar trip descriptions. Expect at least one String-focused problem in your technical screen and likely another variation in the onsite loops.

## Specific Patterns Uber Favors

Uber's String problems have a distinct flavor. They heavily favor **two intertwined categories: Iteration with State Management and Sliding Window variations.** You won't see many simple reversal or anagram checks. Instead, they probe your ability to traverse a string while maintaining complex state, often to parse, validate, or compress data according to specific, business-logic-like rules.

1.  **Iteration with State Machines / Pointers:** These problems require you to move through a string character-by-character, making decisions based on what you've seen and what you expect to see next. It's like implementing a simple parser.
    - **LeetCode #8 (String to Integer (atoi)):** A classic that tests edge-case handling and state (have we seen a sign? are we in the number part?).
    - **LeetCode #65 (Valid Number):** The ultimate state-machine challenge. Determining if a string represents a valid number requires tracking states for signs, decimals, exponents, and digits.
    - **LeetCode #68 (Text Justification):** A brutal real-world simulation of packing words into lines with precise spacing rules, demanding careful iteration and state tracking for space counts.

2.  **Sliding Window / Two Pointers (Often with Hashing):** Uber uses this for substring problems related to "matching" or "containment," analogous to finding a sequence of locations or a pattern in a trip log.
    - **LeetCode #76 (Minimum Window Substring):** Perhaps the most famous Sliding Window problem. It's directly analogous to finding the shortest sequence in a log that contains all required elements (e.g., all required driver attributes).
    - **LeetCode #3 (Longest Substring Without Repeating Characters):** A more fundamental sliding window with a hash set.
    - **LeetCode #159 (Longest Substring with At Most Two Distinct Characters):** A direct variant that tests your ability to generalize the sliding window logic.

## How to Prepare

Master the stateful iteration pattern. The mental model is: **initialize pointers or state variables, iterate, at each step decide what "mode" you're in, update state, and append to or build a result.** Let's look at a simplified version of a parser, like decoding a basic run-length encoded string (e.g., `"a3b2c1"` to `"aaabbc"`).

<div class="code-group">

```python
def run_length_decode(s: str) -> str:
    """Decodes a simple run-length encoded string. Pattern: char+digits."""
    i = 0
    n = len(s)
    result_chars = []

    # Iterate through the string
    while i < n:
        # State 1: The character to repeat. We assume it's always alphabetic.
        char = s[i]
        i += 1

        # State 2: Build the digit string. Handle multi-digit counts.
        count_str = ""
        while i < n and s[i].isdigit():
            count_str += s[i]
            i += 1

        # Convert digit string to integer and expand
        count = int(count_str)
        result_chars.append(char * count)

    return "".join(result_chars)

# Time: O(n) where n is length of output string. We traverse input once.
# Space: O(m) for the result list, where m is length of output.
```

```javascript
function runLengthDecode(s) {
  let i = 0;
  const n = s.length;
  const resultParts = [];

  while (i < n) {
    // State 1: The character to repeat
    const char = s[i];
    i++;

    // State 2: Build the digit string
    let countStr = "";
    while (i < n && /\d/.test(s[i])) {
      countStr += s[i];
      i++;
    }

    const count = parseInt(countStr, 10);
    resultParts.push(char.repeat(count));
  }

  return resultParts.join("");
}
// Time: O(n) | Space: O(m) for the output.
```

```java
public String runLengthDecode(String s) {
    int i = 0;
    int n = s.length();
    StringBuilder result = new StringBuilder();

    while (i < n) {
        // State 1: The character to repeat
        char currentChar = s.charAt(i);
        i++;

        // State 2: Build the digit string
        StringBuilder countStr = new StringBuilder();
        while (i < n && Character.isDigit(s.charAt(i))) {
            countStr.append(s.charAt(i));
            i++;
        }

        int count = Integer.parseInt(countStr.toString());
        for (int j = 0; j < count; j++) {
            result.append(currentChar);
        }
    }

    return result.toString();
}
// Time: O(n) | Space: O(m) for the StringBuilder output.
```

</div>

For Sliding Window, internalize the template: **expand the right pointer until a condition is met, then contract the left pointer until it's broken, all while tracking the window state in a hash map.** Here's the framework for problems like "Longest Substring with At Most K Distinct Characters":

<div class="code-group">

```python
def length_of_longest_substring_k_distinct(s: str, k: int) -> int:
    from collections import defaultdict
    char_count = defaultdict(int)
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        # Expand window: add char at 'right'
        char_count[char] += 1

        # Shrink window until condition is valid (<= k distinct)
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # Condition is now valid. Update answer.
        max_len = max(max_len, right - left + 1)

    return max_len
# Time: O(n) | Space: O(k) for the hash map.
```

```javascript
function lengthOfLongestSubstringKDistinct(s, k) {
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    charCount.set(char, (charCount.get(char) || 0) + 1);

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
// Time: O(n) | Space: O(k)
```

```java
public int lengthOfLongestSubstringKDistinct(String s, int k) {
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

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
// Time: O(n) | Space: O(k)
```

</div>

## How Uber Tests String vs Other Companies

Compared to other companies, Uber's String questions are less about clever algorithmic tricks (like Manacher's algorithm for palindromes) and more about **robust, clean implementation of detailed specifications.** They share some DNA with Google's interview questions in their appreciation for parsing and state, but Uber's problems often feel more like a concrete business task.

- **vs. Meta:** Meta might ask more about recursive backtracking on strings (e.g., generating parentheses, palindrome partitioning). Uber leans iterative.
- **vs. Amazon:** Amazon's strings often involve direct data structure manipulation (e.g., most common word, reorder log files). Uber's involve more sequential logic and rule application.
- **The Uber Differentiator:** The unique aspect is the **"simulated real-world" complexity.** The problem statement will be longer, with more edge cases defined (or implied). They test your ability to read a complex requirement, translate it into code state, and handle all the corner cases without getting lost.

## Study Order

Tackle these sub-topics in this order to build a logical progression of skills:

1.  **Basic Two-Pointer & Iteration:** Start with in-place reversals and palindrome checks. This builds comfort with index manipulation.
2.  **Hash Map for Counting & Lookup:** Practice anagrams and character frequency. This is the foundation for the sliding window's state tracking.
3.  **Sliding Window Framework:** Learn the expand/contract template with simple problems (max substring with no repeats) before adding complexity (with `k` distinct chars).
4.  **Iteration with State Variables:** Practice parsing problems. Start with `atoi` (#8), then move to more complex ones. Draw state diagrams on paper.
5.  **Advanced Sliding Window & Greedy:** Combine patterns, like Minimum Window Substring (#76), which uses a sliding window but also needs to track "required" characters.
6.  **Simulation & Text Formatting:** Finally, build the stamina for problems like Text Justification (#68), which is essentially a mini-project requiring careful loop design and condition checking.

## Recommended Practice Order

Solve these specific Uber-tagged problems in sequence:

1.  **LeetCode #3 (Longest Substring Without Repeating Characters):** Solidify the basic sliding window.
2.  **LeetCode #159 / #340 (Longest Substring with At Most K Distinct Characters):** Generalize the sliding window pattern.
3.  **LeetCode #8 (String to Integer (atoi)):** Master iteration with state and edge cases.
4.  **LeetCode #76 (Minimum Window Substring):** The classic Uber sliding window challenge.
5.  **LeetCode #68 (Text Justification):** The ultimate test of iterative state management and detailed implementation.
6.  **LeetCode #186 (Reverse Words in a String II):** An Uber-specific variant that tests in-place manipulation, a useful skill.

This progression moves from core patterns to their combination and finally to the complex, specification-heavy problems Uber uses to separate strong candidates.

[Practice String at Uber](/company/uber/string)
