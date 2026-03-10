---
title: "How to Solve Decode String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Decode String. Medium difficulty, 62.3% acceptance rate. Topics: String, Stack, Recursion."
date: "2026-09-10"
category: "dsa-patterns"
tags: ["decode-string", "string", "stack", "recursion", "medium"]
---

# How to Solve Decode String

The problem asks us to decode a string where patterns like `k[encoded_string]` mean the `encoded_string` should be repeated `k` times. The tricky part is that these patterns can be nested—like `3[a2[c]]`—which requires careful handling of the repetition counts and string segments at different levels.

## Visual Walkthrough

Let's trace through `"3[a2[c]]"` step by step to build intuition:

1. We start reading: `"3["` means we'll repeat what's inside 3 times.
2. Inside the brackets, we see `"a"` followed by `"2["`—another nested pattern.
3. For the inner pattern `"2[c]"`, we decode it to `"cc"`.
4. Now we have `"a" + "cc" = "acc"` for the inner content.
5. The outer pattern says repeat `"acc"` 3 times: `"accaccacc"`.

The challenge is keeping track of:

- What number we're currently multiplying by
- Which string segment belongs to which repetition
- How to handle multiple levels of nesting

This naturally leads us to think about using a stack to manage different levels of decoding.

## Brute Force Approach

A naive approach might try to parse the string from left to right, expanding patterns as we encounter them. However, this quickly becomes problematic with nested patterns:

1. If we try to expand inner patterns first, we need to find the innermost `]` and work backward
2. If we try to expand outer patterns first, we'll lose track of what needs to be multiplied
3. A recursive approach that finds and expands patterns could work, but it's essentially what we'll optimize

The brute force would involve repeatedly scanning the string for patterns and expanding them until no brackets remain. For a string like `"2[3[a]2[b]]"`, this would require multiple passes and careful string manipulation.

The main issue is that without proper tracking of where we are in the decoding process, we'd need to repeatedly parse the entire string, leading to O(n²) time complexity in worst-case scenarios with deep nesting.

## Optimized Approach

The key insight is that we need to process the string in a single pass while maintaining context for different nesting levels. This is a perfect use case for a stack data structure.

Here's the step-by-step reasoning:

1. **Two stacks approach**: We'll use one stack for counts (how many times to repeat) and one for string segments (what to repeat).
2. **Process characters left to right**:
   - When we see a digit: build the complete number (numbers can have multiple digits like `"12"`)
   - When we see `[`: push the current count onto the count stack and current string onto the string stack, then reset both
   - When we see a letter: append it to the current string
   - When we see `]`: pop from both stacks, repeat the current string that many times, and append to the string from the stack
3. **Why this works**: The stack lets us "pause" decoding at one level while we handle inner levels. When we finish an inner segment, we combine it with the outer context.

This approach handles arbitrary nesting because each `[` creates a new context level, and each `]` returns to the previous level with the decoded content.

## Optimal Solution

Here's the complete implementation using two stacks:

<div class="code-group">

```python
# Time: O(n * m) where n is length of encoded string, m is max multiplication factor
# Space: O(n) for the stacks
def decodeString(s: str) -> str:
    # Initialize stacks for counts and string segments
    count_stack = []
    string_stack = []

    current_string = ""  # String being built at current level
    current_num = 0      # Number being built (could be multi-digit)

    for char in s:
        if char.isdigit():
            # Build multi-digit numbers: '1' + '2' = 12
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Push current context onto stacks and reset for new level
            count_stack.append(current_num)
            string_stack.append(current_string)
            current_num = 0
            current_string = ""
        elif char == ']':
            # Decode current level: repeat current_string count times
            count = count_stack.pop()
            prev_string = string_stack.pop()
            # Repeat current_string count times and append to previous level's string
            current_string = prev_string + current_string * count
        else:
            # Regular character, add to current string
            current_string += char

    return current_string
```

```javascript
// Time: O(n * m) where n is length of encoded string, m is max multiplication factor
// Space: O(n) for the stacks
function decodeString(s) {
  // Initialize stacks for counts and string segments
  const countStack = [];
  const stringStack = [];

  let currentString = ""; // String being built at current level
  let currentNum = 0; // Number being built (could be multi-digit)

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char >= "0" && char <= "9") {
      // Build multi-digit numbers: '1' + '2' = 12
      currentNum = currentNum * 10 + parseInt(char);
    } else if (char === "[") {
      // Push current context onto stacks and reset for new level
      countStack.push(currentNum);
      stringStack.push(currentString);
      currentNum = 0;
      currentString = "";
    } else if (char === "]") {
      // Decode current level: repeat currentString count times
      const count = countStack.pop();
      const prevString = stringStack.pop();
      // Repeat currentString count times and append to previous level's string
      currentString = prevString + currentString.repeat(count);
    } else {
      // Regular character, add to current string
      currentString += char;
    }
  }

  return currentString;
}
```

```java
// Time: O(n * m) where n is length of encoded string, m is max multiplication factor
// Space: O(n) for the stacks
public String decodeString(String s) {
    // Initialize stacks for counts and string segments
    Stack<Integer> countStack = new Stack<>();
    Stack<StringBuilder> stringStack = new Stack<>();

    StringBuilder currentString = new StringBuilder();  // String being built at current level
    int currentNum = 0;      // Number being built (could be multi-digit)

    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            // Build multi-digit numbers: '1' + '2' = 12
            currentNum = currentNum * 10 + (c - '0');
        } else if (c == '[') {
            // Push current context onto stacks and reset for new level
            countStack.push(currentNum);
            stringStack.push(currentString);
            currentNum = 0;
            currentString = new StringBuilder();
        } else if (c == ']') {
            // Decode current level: repeat currentString count times
            int count = countStack.pop();
            StringBuilder prevString = stringStack.pop();
            // Repeat currentString count times and append to previous level's string
            StringBuilder temp = new StringBuilder();
            for (int i = 0; i < count; i++) {
                temp.append(currentString);
            }
            currentString = prevString.append(temp);
        } else {
            // Regular character, add to current string
            currentString.append(c);
        }
    }

    return currentString.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × m), where n is the length of the input string and m is the maximum multiplication factor. We process each character once (O(n)), and when we encounter `]`, we might repeat a string up to m times. In worst case like `"10[a10[b10[c]]]"`, we repeat strings multiple times at each level.

**Space Complexity**: O(n) for the stacks. In the worst case with deep nesting like `"1[2[3[4[5[a]]]]]"`, we'll push onto the stack for each opening bracket. The current strings also contribute to space usage, but they're proportional to the output size.

## Common Mistakes

1. **Not handling multi-digit numbers**: Forgetting that numbers like `"12"` are two digits, not separate `"1"` and `"2"`. Always accumulate digits until you hit a non-digit character.

2. **Wrong stack popping order**: When encountering `]`, you must pop the count first, then the string. The count tells you how many times to repeat the current string, which then gets appended to the previous level's string.

3. **Not resetting current_num after `[`**: After pushing the current number onto the stack, you must reset it to 0. Otherwise, you'll incorrectly use old numbers for new levels.

4. **Using string concatenation in loops inefficiently**: In Java, using `String` instead of `StringBuilder` for repeated concatenation leads to O(n²) time. Always use `StringBuilder` when building strings incrementally.

## When You'll See This Pattern

This "nested structure decoding" pattern appears in several other problems:

1. **Number of Atoms (Hard)**: Parsing chemical formulas like `"Mg(OH)2"` where parentheses create nesting and numbers apply to everything inside. The stack approach helps track which atoms get multiplied by which coefficients.

2. **Basic Calculator (Hard)**: Evaluating expressions with parentheses, where you need to handle nested operations and maintain context for each parenthesis level.

3. **Mini Parser (Medium)**: Parsing nested list structures from strings, where `[` and `]` create new list levels.

The common thread is using stacks to manage context when processing nested structures in a single pass.

## Key Takeaways

1. **Stacks are ideal for nested structures**: When you see problems with matching brackets/parentheses and nested contexts, think about using stacks to track state at each level.

2. **Process sequentially, use stacks for context**: You can often solve these problems in one left-to-right pass by pushing context onto a stack when entering a new level and popping when exiting.

3. **Watch for multi-character tokens**: Numbers and strings might span multiple characters. Always accumulate until you reach a delimiter.

Related problems: [Encode String with Shortest Length](/problem/encode-string-with-shortest-length), [Number of Atoms](/problem/number-of-atoms), [Brace Expansion](/problem/brace-expansion)
