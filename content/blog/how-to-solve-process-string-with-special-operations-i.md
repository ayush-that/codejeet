---
title: "How to Solve Process String with Special Operations I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Process String with Special Operations I. Medium difficulty, 65.0% acceptance rate. Topics: String, Simulation."
date: "2028-08-22"
category: "dsa-patterns"
tags: ["process-string-with-special-operations-i", "string", "simulation", "medium"]
---

# How to Solve Process String with Special Operations I

This problem asks us to process a string containing letters and special characters (`*`, `#`, `%`) according to specific rules. The challenge lies in efficiently handling the special operations that modify the result string in different ways: `*` duplicates the last character, `#` removes the last character, and `%` clears the entire result. What makes this interesting is that we need to simulate these operations in sequence while maintaining an efficient data structure for the modifications.

## Visual Walkthrough

Let's trace through an example: `s = "ab*c#d%"`

1. Start with empty `result = ""`
2. `'a'` → append → `result = "a"`
3. `'b'` → append → `result = "ab"`
4. `'*'` → duplicate last character → `result = "abb"`
5. `'c'` → append → `result = "abbc"`
6. `'#'` → remove last character → `result = "abb"`
7. `'d'` → append → `result = "abbd"`
8. `'%'` → clear all characters → `result = ""`

Final result: `""`

Notice how each operation affects the current state of the result string. The `*` operation requires us to know the last character (if one exists), `#` requires removing the last character, and `%` clears everything. This suggests we need a data structure that supports efficient append, peek at last element, remove last element, and clear operations.

## Brute Force Approach

A naive approach would be to use a regular string and perform all operations directly on it:

1. Initialize an empty string `result`
2. Iterate through each character in `s`
3. For each character:
   - If it's a lowercase letter: append to `result`
   - If it's `*`: check if `result` is not empty, then get last character and append it
   - If it's `#`: check if `result` is not empty, then remove last character
   - If it's `%`: set `result` to empty string

The problem with this approach is that string operations in most languages are O(n) for operations like removing the last character or building new strings through concatenation. For a string of length n, this could lead to O(n²) time complexity in the worst case (imagine many `#` operations that keep removing from the end of a long string).

## Optimized Approach

The key insight is that we need a data structure that supports efficient operations at the end. A **stack** (or list used as a stack) is perfect for this:

- **Append letter**: `push(letter)` - O(1)
- **Duplicate last (`*`)**: if stack not empty, `peek()` then `push(last_char)` - O(1)
- **Remove last (`#`)**: if stack not empty, `pop()` - O(1)
- **Clear all (`%`)**: `clear()` or create new stack - O(1) to O(n) depending on implementation

Using a stack gives us O(1) amortized time for each operation, making the overall solution O(n) time complexity.

We process the string left to right, applying the rules:

1. For lowercase letters: push to stack
2. For `*`: if stack has elements, push the top element again
3. For `#`: if stack has elements, pop the top element
4. For `%`: clear the entire stack

After processing all characters, we convert the stack to a string in the correct order.

## Optimal Solution

Here's the complete solution using a stack-based approach:

<div class="code-group">

```python
# Time: O(n) where n is the length of the input string
# Space: O(n) for the stack in the worst case
def process_string(s: str) -> str:
    """
    Process the string according to the special operations:
    - lowercase letters: append to result
    - '*': duplicate last character if exists
    - '#': remove last character if exists
    - '%': clear all characters
    """
    stack = []  # Use list as a stack for efficient end operations

    for char in s:
        if char.isalpha() and char.islower():
            # Rule 1: lowercase letter - append to result
            stack.append(char)
        elif char == '*':
            # Rule 2: duplicate last character if result is not empty
            if stack:
                last_char = stack[-1]  # Peek at last character
                stack.append(last_char)  # Duplicate it
        elif char == '#':
            # Rule 3: remove last character if result is not empty
            if stack:
                stack.pop()  # Remove last character
        elif char == '%':
            # Rule 4: clear all characters
            stack.clear()  # Remove all characters

    # Convert stack to string (elements are in correct order)
    return ''.join(stack)
```

```javascript
// Time: O(n) where n is the length of the input string
// Space: O(n) for the stack in the worst case
function processString(s) {
  /**
   * Process the string according to the special operations:
   * - lowercase letters: append to result
   * - '*': duplicate last character if exists
   * - '#': remove last character if exists
   * - '%': clear all characters
   */
  const stack = []; // Use array as a stack for efficient end operations

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char >= "a" && char <= "z") {
      // Rule 1: lowercase letter - append to result
      stack.push(char);
    } else if (char === "*") {
      // Rule 2: duplicate last character if result is not empty
      if (stack.length > 0) {
        const lastChar = stack[stack.length - 1]; // Peek at last character
        stack.push(lastChar); // Duplicate it
      }
    } else if (char === "#") {
      // Rule 3: remove last character if result is not empty
      if (stack.length > 0) {
        stack.pop(); // Remove last character
      }
    } else if (char === "%") {
      // Rule 4: clear all characters
      stack.length = 0; // Remove all characters by setting length to 0
    }
  }

  // Convert stack to string (elements are in correct order)
  return stack.join("");
}
```

```java
// Time: O(n) where n is the length of the input string
// Space: O(n) for the stack in the worst case
public String processString(String s) {
    /**
     * Process the string according to the special operations:
     * - lowercase letters: append to result
     * - '*': duplicate last character if exists
     * - '#': remove last character if exists
     * - '%': clear all characters
     */
    StringBuilder stack = new StringBuilder();  // Use StringBuilder as stack

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        if (c >= 'a' && c <= 'z') {
            // Rule 1: lowercase letter - append to result
            stack.append(c);
        } else if (c == '*') {
            // Rule 2: duplicate last character if result is not empty
            if (stack.length() > 0) {
                char lastChar = stack.charAt(stack.length() - 1);  // Peek at last character
                stack.append(lastChar);  // Duplicate it
            }
        } else if (c == '#') {
            // Rule 3: remove last character if result is not empty
            if (stack.length() > 0) {
                stack.deleteCharAt(stack.length() - 1);  // Remove last character
            }
        } else if (c == '%') {
            // Rule 4: clear all characters
            stack.setLength(0);  // Remove all characters by setting length to 0
        }
    }

    // StringBuilder already contains the result in correct order
    return stack.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input string. We process each character exactly once, and each operation (append, peek, pop, clear) is O(1) with our stack-based approach.

**Space Complexity:** O(n) in the worst case. This occurs when the input contains mostly lowercase letters (no clear operations), and we need to store all characters in the stack. In the best case (all `%` operations), the space complexity would be O(1).

## Common Mistakes

1. **Not checking if stack is empty before `*` or `#` operations**: Attempting to peek or pop from an empty stack will cause runtime errors. Always check `if stack:` (Python), `if stack.length > 0` (JavaScript), or `if stack.length() > 0` (Java) before these operations.

2. **Using string concatenation instead of a stack**: Strings are immutable in many languages, so operations like removing the last character or building new strings through concatenation create new string objects, leading to O(n²) time complexity.

3. **Incorrect character classification**: Only lowercase English letters should be appended. Don't forget to check that characters are both alphabetic AND lowercase. Uppercase letters or digits should be ignored according to the problem statement.

4. **Forgetting to handle the clear operation (`%`) properly**: Some implementations might try to pop all elements individually, which is O(n) per `%` operation. The optimal approach is to clear the entire stack at once using `clear()`, setting length to 0, or creating a new stack.

## When You'll See This Pattern

This pattern of processing a sequence with operations that modify a result based on the current state appears in several problems:

1. **Backspace String Compare (LeetCode 844)**: Similar to our `#` operation but for backspaces. You need to process strings with backspace characters and compare the results.

2. **Baseball Game (LeetCode 682)**: Operations include adding integers, doubling the last score, removing the last score, and adding the sum of the last two scores - very similar stack-based processing.

3. **Make The String Great (LeetCode 1544)**: Removing adjacent characters with certain conditions, often solved with a stack to efficiently handle removals.

4. **Removing Stars From a String (LeetCode 2390)**: Almost identical to our `#` operation - remove the character before each `*`.

The common theme is using a stack to efficiently handle operations that depend on or modify the most recent elements.

## Key Takeaways

1. **When you need to process elements in order with operations that affect the most recent elements, think "stack"**. Stacks provide O(1) time for append, peek at last, and remove last operations.

2. **Always validate preconditions before stack operations**. Check if the stack is empty before peeking or popping to avoid errors.

3. **Consider the actual requirements of string building**. If you only need to append to the end and sometimes remove from the end, a stack or StringBuilder is more efficient than manipulating immutable strings directly.

[Practice this problem on CodeJeet](/problem/process-string-with-special-operations-i)
