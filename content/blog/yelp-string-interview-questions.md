---
title: "String Questions at Yelp: What to Expect"
description: "Prepare for String interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2030-12-30"
category: "dsa-patterns"
tags: ["yelp", "string", "interview prep"]
---

If you're preparing for a Yelp interview, you've likely seen the statistic: **17 out of their 27 tagged LeetCode problems are String questions.** That's over 60%. This isn't a coincidence or a quirk of their LeetCode company tag—it's a direct reflection of their business. Yelp's core product revolves around parsing, searching, and manipulating textual data: reviews, business names, menus, user queries, and location strings. A candidate's ability to efficiently handle strings is a strong proxy for their ability to work on Yelp's fundamental data pipelines. In real interviews, you are almost guaranteed to encounter at least one string manipulation or parsing problem, often as the first or second technical question.

## Specific Patterns Yelp Favors

Yelp's string problems aren't about obscure text algorithms. They focus on **applied, practical parsing and transformation.** You won't find many complex DP on strings or intricate suffix array problems here. Instead, expect problems that test:

1.  **Iterative Parsing with State:** Breaking down a string (like a file path, encoded string, or log line) into meaningful parts, often requiring you to track state (e.g., using a stack or pointer).
2.  **Simulation with String Building:** Following a set of rules to transform an input string into an output, which involves careful index management and building a new result.
3.  **Hash Map for Frequency/Cleaning:** Common for problems involving anagrams, comparing review texts, or cleaning punctuation from strings for comparison.

A quintessential Yelp problem is **LeetCode 71: Simplify Path**. It's pure iterative parsing using a stack to handle directory navigation. Another classic is **LeetCode 394: Decode String**, which combines stack-based state management with string building—a pattern that comes up frequently in variations.

## How to Prepare

The most critical skill is clean, iterative string traversal. Let's look at the core pattern for iterative parsing and building, using a problem similar to decoding a simple run-length encoded string.

**Problem:** Decode a string in the format `k[encoded_string]`, where `k` is a positive integer. Example: `"3[a]2[bc]"` -> `"aaabcbc"`.

The pattern uses a stack to hold previous multipliers and string segments. The key is to distinguish between four types of characters: digits, letters, `[`, and `]`.

<div class="code-group">

```python
def decodeString(s: str) -> str:
    stack = []
    current_num = 0
    current_str = ''

    for char in s:
        if char.isdigit():
            # Build the multi-digit number
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Push the current context (number and string) to the stack
            stack.append((current_num, current_str))
            # Reset for the new encoded segment inside the brackets
            current_num = 0
            current_str = ''
        elif char == ']':
            # Pop the context: this segment is complete
            prev_num, prev_str = stack.pop()
            # Decode: repeat current_str prev_num times and append to previous string
            current_str = prev_str + (current_str * prev_num)
        else:
            # It's a letter, just append to the current string being built
            current_str += char

    return current_str

# Time Complexity: O(n * maxK), where n is length of s and maxK is the max multiplier.
# In the worst case (nested encodings), we might repeat strings multiple times.
# Space Complexity: O(n) for the stack in the worst case.
```

```javascript
function decodeString(s) {
  const stack = [];
  let currentNum = 0;
  let currentStr = "";

  for (let char of s) {
    if (!isNaN(char) && char !== " ") {
      // Build number
      currentNum = currentNum * 10 + parseInt(char);
    } else if (char === "[") {
      // Save state and reset
      stack.push([currentNum, currentStr]);
      currentNum = 0;
      currentStr = "";
    } else if (char === "]") {
      // Decode the current segment
      const [prevNum, prevStr] = stack.pop();
      currentStr = prevStr + currentStr.repeat(prevNum);
    } else {
      // It's a letter
      currentStr += char;
    }
  }
  return currentStr;
}
// Time: O(n * maxK) | Space: O(n)
```

```java
public String decodeString(String s) {
    Stack<Object> stack = new Stack<>();
    int currentNum = 0;
    StringBuilder currentStr = new StringBuilder();

    for (char ch : s.toCharArray()) {
        if (Character.isDigit(ch)) {
            currentNum = currentNum * 10 + (ch - '0');
        } else if (ch == '[') {
            // Push the current context to the stack
            stack.push(currentNum);
            stack.push(currentStr.toString());
            // Reset for the inner string
            currentNum = 0;
            currentStr = new StringBuilder();
        } else if (ch == ']') {
            // Pop the previous string and multiplier
            String prevStr = (String) stack.pop();
            int multiplier = (Integer) stack.pop();
            // Build the decoded string
            String repeated = currentStr.toString().repeat(multiplier);
            currentStr = new StringBuilder(prevStr + repeated);
        } else {
            // Normal character
            currentStr.append(ch);
        }
    }
    return currentStr.toString();
}
// Time: O(n * maxK) | Space: O(n)
```

</div>

The second key pattern is **simulation with direct string building**, often for problems like validating or reformatting strings. Here's a template for a common Yelp-style problem: normalizing a string by removing all non-alphanumeric characters and ignoring case for comparison (the core of a palindrome check after cleaning).

<div class="code-group">

```python
def is_alphanumeric_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1

    while left < right:
        # Move left pointer to next alphanumeric char
        while left < right and not s[left].isalnum():
            left += 1
        # Move right pointer to previous alphanumeric char
        while left < right and not s[right].isalnum():
            right -= 1

        # Compare characters, ignoring case
        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True

# Time Complexity: O(n), each pointer traverses the string at most once.
# Space Complexity: O(1), we only use pointers.
```

```javascript
function isAlphanumericPalindrome(s) {
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    // Move left pointer to next alphanumeric char
    while (left < right && !/^[a-z0-9]$/i.test(s[left])) {
      left++;
    }
    // Move right pointer to previous alphanumeric char
    while (left < right && !/^[a-z0-9]$/i.test(s[right])) {
      right--;
    }

    // Compare ignoring case
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }

    left++;
    right--;
  }
  return true;
}
// Time: O(n) | Space: O(1)
```

```java
public boolean isAlphanumericPalindrome(String s) {
    int left = 0, right = s.length() - 1;

    while (left < right) {
        // Move left to next alphanumeric
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }
        // Move right to previous alphanumeric
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }

        // Compare ignoring case
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }

        left++;
        right--;
    }
    return true;
}
// Time: O(n) | Space: O(1)
```

</div>

## How Yelp Tests String vs Other Companies

At companies like Google or Meta, string problems often serve as a gateway to more complex concepts—you might start with a string and quickly transition into graph search (word ladder) or advanced DP (regular expression matching). **Yelp's approach is different.** Their problems tend to be self-contained and focus on **correctness, edge-case handling, and clean implementation** of string operations you'd actually write on the job. The difficulty is usually in the "Medium" range, but the challenge comes from meticulous parsing logic rather than algorithmic cleverness. You're more likely to be judged on how you handle empty strings, nested structures, punctuation, and Unicode (basic awareness) than on optimizing from O(n²) to O(n log n).

## Study Order

1.  **Basic Traversal and Two-Pointers:** Master moving through a string with indices, reversing, and comparing. This is the foundation for everything else.
2.  **Hash Maps for Frequency:** Learn to use a map/dictionary to count characters for anagram and substring problems. This is a common first step in many Yelp problems.
3.  **Stack-Based Parsing:** This is Yelp's bread and butter. Practice problems where you need to track nested structures or previous states (like open/close brackets or directory levels).
4.  **Simulation & Rule Application:** Practice problems where you directly translate a set of textual rules into code. This tests your ability to translate a product requirement into an algorithm.
5.  **Basic String Building & Concatenation Optimization:** Understand why building a string with `+=` in a loop can be O(n²) and when to use a `StringBuilder` or list join. Yelp interviewers notice this.

## Recommended Practice Order

Solve these problems in sequence to build the skills Yelp tests:

1.  **LeetCode 125: Valid Palindrome** - The classic two-pointer with cleaning. Do it with constant space.
2.  **LeetCode 242: Valid Anagram** - Straightforward hash map warm-up.
3.  **LeetCode 819: Most Common Word** - Excellent practice for parsing, cleaning punctuation, and using a hash map with bans. Very Yelp-like.
4.  **LeetCode 71: Simplify Path** - Pure stack-based parsing. A must-do.
5.  **LeetCode 394: Decode String** - The definitive stack + string building problem. Master this pattern.
6.  **LeetCode 929: Unique Email Addresses** - Practical parsing and normalization. Another very applicable problem.
7.  **LeetCode 227: Basic Calculator II** (or similar) - If you have time, this tests parsing and immediate evaluation without stack for order of operations, a step up in complexity.

Focus on writing clean, readable code on your first pass. At Yelp, a correct, well-structured, and maintainable solution is often valued over a clever, optimized one that's hard to follow.

[Practice String at Yelp](/company/yelp/string)
