---
title: "String Questions at Atlassian: What to Expect"
description: "Prepare for String interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-12"
category: "dsa-patterns"
tags: ["atlassian", "string", "interview prep"]
---

Atlassian’s engineering culture is deeply rooted in building collaborative tools—think Jira, Confluence, Bitbucket—where text processing, document parsing, URL handling, and command-line interfaces are daily realities. It’s no surprise that **17 of their 62 tagged LeetCode problems are String-based**, making it one of their most concentrated topics. In real interviews, String problems appear frequently, not as trivial warm-ups but as medium-to-hard problems that test your ability to manipulate state, parse efficiently, and handle edge cases in a clean, maintainable way. For Atlassian, String questions are a proxy for real-world work: you’re often dealing with user-generated content, markdown, APIs, or system commands. Mastery here signals you can handle the core data type of their domain.

## Specific Patterns Atlassian Favors

Atlassian’s String problems lean heavily toward **parsing, state machines, and two-pointer techniques**, with a noticeable emphasis on **simulation and iterative processing** over complex recursive dynamic programming. They prefer problems where you model a process—like decoding a string, executing commands, or validating formats—mirroring how their software processes user input.

You’ll see variations of:

- **Parsing with stacks or pointers**: Problems like **Decode String (#394)** and **Basic Calculator (#224)** require tracking context (e.g., brackets, parentheses) and applying operations in the correct order.
- **Simulation/iteration with careful indexing**: Problems like **Text Justification (#68)** and **String Compression (#443)** ask you to transform strings according to precise rules, often in-place or with minimal extra space.
- **Two-pointer for in-place manipulation**: Reversing words in a string, compressing, or partitioning often appear in their question bank.

What’s telling is the absence of ultra-complex DP String problems (like edit distance) in their common set. They focus on **applied algorithms**—solutions you might actually write in a code review at Atlassian.

## How to Prepare

The key is to practice parsing loops and state management until they feel intuitive. Let’s look at the **stack-based decoding pattern** from Decode String (#394), a classic Atlassian problem. The pattern involves traversing the string, pushing context onto a stack when you hit an opening bracket, and popping to apply operations when you hit a closing bracket.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def decodeString(s: str) -> str:
    stack = []
    current_num = 0
    current_str = ''

    for char in s:
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Push current context to stack
            stack.append((current_str, current_num))
            current_str = ''
            current_num = 0
        elif char == ']':
            # Pop and apply repetition
            prev_str, num = stack.pop()
            current_str = prev_str + current_str * num
        else:
            current_str += char

    return current_str
```

```javascript
// Time: O(n) | Space: O(n)
function decodeString(s) {
  const stack = [];
  let currentNum = 0;
  let currentStr = "";

  for (let char of s) {
    if (!isNaN(char) && char !== " ") {
      currentNum = currentNum * 10 + parseInt(char);
    } else if (char === "[") {
      stack.push([currentStr, currentNum]);
      currentStr = "";
      currentNum = 0;
    } else if (char === "]") {
      const [prevStr, num] = stack.pop();
      currentStr = prevStr + currentStr.repeat(num);
    } else {
      currentStr += char;
    }
  }

  return currentStr;
}
```

```java
// Time: O(n) | Space: O(n)
public String decodeString(String s) {
    Stack<Object[]> stack = new Stack<>();
    int currentNum = 0;
    StringBuilder currentStr = new StringBuilder();

    for (char ch : s.toCharArray()) {
        if (Character.isDigit(ch)) {
            currentNum = currentNum * 10 + (ch - '0');
        } else if (ch == '[') {
            stack.push(new Object[]{currentStr.toString(), currentNum});
            currentStr = new StringBuilder();
            currentNum = 0;
        } else if (ch == ']') {
            Object[] popped = stack.pop();
            String prevStr = (String) popped[0];
            int num = (int) popped[1];
            String repeated = currentStr.toString().repeat(num);
            currentStr = new StringBuilder(prevStr + repeated);
        } else {
            currentStr.append(ch);
        }
    }

    return currentStr.toString();
}
```

</div>

Another essential pattern is **in-place two-pointer manipulation**, common in problems like Reverse Words in a String (#151). Atlassian often tests this because it reflects memory-conscious coding—important in large-scale text processing.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) in languages with mutable strings, O(n) in Python due to immutability
def reverseWords(s: str) -> str:
    # Trim and split, then reverse the list of words
    words = s.split()
    return ' '.join(reversed(words))
```

```javascript
// Time: O(n) | Space: O(n) for the array
function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(" ");
}
```

```java
// Time: O(n) | Space: O(n) for the StringBuilder
public String reverseWords(String s) {
    String[] words = s.trim().split("\\s+");
    StringBuilder result = new StringBuilder();
    for (int i = words.length - 1; i >= 0; i--) {
        result.append(words[i]);
        if (i > 0) result.append(" ");
    }
    return result.toString();
}
```

</div>

Note: While Python and JavaScript versions use higher-level methods, in interviews you might be asked to implement the split and reverse logic manually with two pointers, especially in Java.

## How Atlassian Tests String vs Other Companies

Compared to companies like Google (which loves tricky DP on strings) or Facebook (heavy on string manipulation with hash maps for pattern matching), Atlassian’s String questions feel more like **mini-simulations**. They’re less about mathematical insight and more about cleanly implementing a specification. For example, Text Justification (#68) is purely about following formatting rules—a task akin to building a document renderer. The difficulty is in the details: handling edge cases, off-by-one errors, and making the code readable. This reflects Atlassian’s product focus: their engineers need to write robust, maintainable code that does exactly what the user expects.

## Study Order

1. **Basic traversal and indexing** – Get comfortable with loops, slicing, and character access. Problems: Reverse String (#344), Valid Palindrome (#125).
2. **Two-pointer techniques** – Essential for in-place operations and efficient searches. Problems: Two Sum II (#167), Valid Palindrome II (#680).
3. **Stack-based parsing** – Critical for nested structures (brackets, parentheses). Problems: Valid Parentheses (#20), Decode String (#394).
4. **Simulation with careful rules** – Practice implementing step-by-step instructions. Problems: String Compression (#443), Text Justification (#68).
5. **Sliding window for substrings** – Useful for more advanced pattern matching. Problems: Longest Substring Without Repeating Characters (#3), Minimum Window Substring (#76).

This order builds from fundamental manipulation to context management, then to complex simulations. It ensures you have the tools before tackling Atlassian’s favorite simulation-style problems.

## Recommended Practice Order

1. **Valid Parentheses (#20)** – Warm-up with stacks.
2. **Reverse Words in a String (#151)** – Practice two-pointer thinking.
3. **String Compression (#443)** – In-place modification with careful indexing.
4. **Decode String (#394)** – Core stack-based parsing, very Atlassian.
5. **Text Justification (#68)** – Full simulation with detailed rules.
6. **Basic Calculator (#224)** – Advanced parsing (if you have time).

This sequence increases in complexity, directly targeting the patterns Atlassian uses most. Solve each thoroughly, focusing on edge cases and clean code.

[Practice String at Atlassian](/company/atlassian/string)
