---
title: "How to Solve Valid Parentheses — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Parentheses. Easy difficulty, 43.7% acceptance rate. Topics: String, Stack."
date: "2026-02-06"
category: "dsa-patterns"
tags: ["valid-parentheses", "string", "stack", "easy"]
---

# How to Solve Valid Parentheses

The Valid Parentheses problem asks us to determine if a string containing only bracket characters is properly balanced and ordered. While the problem is labeled "Easy," it's a classic interview question because it tests your ability to recognize when to use a stack data structure and handle edge cases carefully. The tricky part isn't writing the code—it's understanding why a stack is the perfect tool for tracking opening brackets and ensuring they close in the correct order.

## Visual Walkthrough

Let's trace through the example `s = "({[]})"`:

1. **Character '('**: This is an opening bracket, so we push it onto our stack.
   - Stack: `['(']`
2. **Character '{'**: Another opening bracket, push it.
   - Stack: `['(', '{']`
3. **Character '['**: Another opening bracket, push it.
   - Stack: `['(', '{', '[']`
4. **Character ']'**: This is a closing bracket. We check the top of the stack:
   - Top is `'['`, which matches `']'` (both square brackets)
   - Pop `'['` from stack
   - Stack: `['(', '{']`
5. **Character '}'**: Another closing bracket. Check top of stack:
   - Top is `'{'`, which matches `'}'` (both curly braces)
   - Pop `'{'` from stack
   - Stack: `['(']`
6. **Character ')'**: Final closing bracket. Check top of stack:
   - Top is `'('`, which matches `')'` (both parentheses)
   - Pop `'('` from stack
   - Stack: `[]`

After processing all characters, our stack is empty, meaning all opening brackets had matching closing brackets in the correct order. The string is valid.

Now consider a failing example `s = "({[)]}"`:

1. Process `'('`, `'{'`, `'['` → Stack: `['(', '{', '[']`
2. Process `')'` → Top of stack is `'['`, which doesn't match `')'` → **INVALID**

The stack immediately reveals the problem: we encountered a closing parenthesis when we expected a closing square bracket.

## Brute Force Approach

A naive approach might try to repeatedly remove valid pairs until the string is empty:

1. While the string contains `"()"`, `"[]"`, or `"{}"`, replace them with empty strings
2. If the final string is empty, it's valid

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def isValidBruteForce(s: str) -> bool:
    # Keep removing valid pairs until we can't anymore
    while "()" in s or "[]" in s or "{}" in s:
        s = s.replace("()", "").replace("[]", "").replace("{}", "")
    return s == ""
```

```javascript
// Time: O(n²) | Space: O(n)
function isValidBruteForce(s) {
  // Keep removing valid pairs until we can't anymore
  while (s.includes("()") || s.includes("[]") || s.includes("{}")) {
    s = s.replace(/\(\)/g, "").replace(/\[\]/g, "").replace(/\{\}/g, "");
  }
  return s === "";
}
```

```java
// Time: O(n²) | Space: O(n)
public boolean isValidBruteForce(String s) {
    // Keep removing valid pairs until we can't anymore
    String temp = s;
    while (temp.contains("()") || temp.contains("[]") || temp.contains("{}")) {
        temp = temp.replace("()", "");
        temp = temp.replace("[]", "");
        temp = temp.replace("{}", "");
    }
    return temp.isEmpty();
}
```

</div>

**Why this is inefficient:** In the worst case (like `"((((...))))"`), each replacement operation takes O(n) time, and we might need O(n) replacements, resulting in O(n²) time complexity. The string operations also create new string objects each time, wasting memory.

## Optimal Solution

The optimal solution uses a stack to track opening brackets as we encounter them. When we see a closing bracket, we check if it matches the most recent opening bracket (the top of the stack). This approach processes each character exactly once.

**Key insight:** The last opening bracket we encounter must be the first one to close (LIFO principle). This is exactly what a stack provides.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isValid(s: str) -> bool:
    # Create a stack to track opening brackets
    stack = []

    # Create a mapping of closing brackets to their corresponding opening brackets
    bracket_map = {')': '(', '}': '{', ']': '['}

    # Iterate through each character in the string
    for char in s:
        if char in bracket_map:
            # Character is a closing bracket
            # Check if stack is empty (no opening bracket to match) OR
            # top of stack doesn't match expected opening bracket
            if not stack or stack[-1] != bracket_map[char]:
                return False
            # If it matches, pop the opening bracket from stack
            stack.pop()
        else:
            # Character is an opening bracket, push it onto stack
            stack.append(char)

    # After processing all characters, check if stack is empty
    # Empty stack means all opening brackets were properly closed
    return not stack
```

```javascript
// Time: O(n) | Space: O(n)
function isValid(s) {
  // Create a stack to track opening brackets
  const stack = [];

  // Create a mapping of closing brackets to their corresponding opening brackets
  const bracketMap = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (bracketMap[char]) {
      // Character is a closing bracket
      // Check if stack is empty (no opening bracket to match) OR
      // top of stack doesn't match expected opening bracket
      if (stack.length === 0 || stack[stack.length - 1] !== bracketMap[char]) {
        return false;
      }
      // If it matches, pop the opening bracket from stack
      stack.pop();
    } else {
      // Character is an opening bracket, push it onto stack
      stack.push(char);
    }
  }

  // After processing all characters, check if stack is empty
  // Empty stack means all opening brackets were properly closed
  return stack.length === 0;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean isValid(String s) {
    // Create a stack to track opening brackets
    Stack<Character> stack = new Stack<>();

    // Create a mapping of closing brackets to their corresponding opening brackets
    Map<Character, Character> bracketMap = new HashMap<>();
    bracketMap.put(')', '(');
    bracketMap.put('}', '{');
    bracketMap.put(']', '[');

    // Iterate through each character in the string
    for (int i = 0; i < s.length(); i++) {
        char currentChar = s.charAt(i);

        if (bracketMap.containsKey(currentChar)) {
            // Character is a closing bracket
            // Check if stack is empty (no opening bracket to match) OR
            // top of stack doesn't match expected opening bracket
            if (stack.isEmpty() || stack.peek() != bracketMap.get(currentChar)) {
                return false;
            }
            // If it matches, pop the opening bracket from stack
            stack.pop();
        } else {
            // Character is an opening bracket, push it onto stack
            stack.push(currentChar);
        }
    }

    // After processing all characters, check if stack is empty
    // Empty stack means all opening brackets were properly closed
    return stack.isEmpty();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through each character in the string exactly once
- Each character either gets pushed onto the stack (O(1)) or causes a stack pop (O(1))
- The dictionary/hashmap lookups are O(1) on average

**Space Complexity:** O(n)

- In the worst case (all opening brackets like `"((((("`), the stack will contain all n characters
- The bracket mapping uses constant space (only 3 key-value pairs)
- Thus, the space complexity is linear in the length of the input string

## Common Mistakes

1. **Forgetting to check if the stack is empty before popping:** This causes an error when the first character is a closing bracket. Always check `if not stack` or `stack.isEmpty()` before accessing the top element.

2. **Not handling odd-length strings:** Any valid parentheses string must have an even length. While not strictly necessary for the stack solution (it will catch this case), checking `if len(s) % 2 == 1: return False` at the beginning can provide an early exit optimization.

3. **Using the wrong data structure:** Some candidates try to use a counter for each bracket type (e.g., count of `'('` minus count of `')'`). This fails for cases like `"([)]"` where the counts are balanced but the order is wrong. The stack is essential for tracking order.

4. **Mixing up the bracket mapping direction:** It's crucial to map closing brackets → opening brackets (not opening → closing). When we see a closing bracket, we need to know what opening bracket should be on top of the stack.

## When You'll See This Pattern

The stack pattern appears whenever you need to track nested structures or ensure proper pairing/ordering:

1. **Expression evaluation** (LeetCode 227: Basic Calculator II) - Stacks help manage operator precedence and parentheses
2. **HTML/XML validation** - Similar to parentheses but with opening/closing tags
3. **Function call tracking** - Call stacks in programming languages work on this principle
4. **Undo/Redo operations** - Stacks naturally support sequential reversal of actions

Specifically on LeetCode:

- **Generate Parentheses (22)**: While not using a stack directly, it builds on the concept of valid bracket sequences
- **Longest Valid Parentheses (32)**: A harder variation that requires dynamic programming alongside stack concepts
- **Remove Invalid Parentheses (301)**: Uses BFS/DFS but fundamentally deals with valid bracket sequences

## Key Takeaways

1. **Recognize LIFO patterns**: When you see problems involving nested structures, matching pairs, or operations that need to be undone in reverse order, think "stack."

2. **Map complements, not duplicates**: For pairing problems, create a mapping from closing elements to their opening counterparts. This makes validation logic cleaner when you encounter a closing element.

3. **Empty stack checks are crucial**: Always verify the stack isn't empty before popping or peeking. This handles edge cases where closing brackets appear without corresponding opening brackets.

Remember: The Valid Parentheses problem is foundational. If you master this pattern, you'll recognize it in many more complex problems.

Related problems: [Generate Parentheses](/problem/generate-parentheses), [Longest Valid Parentheses](/problem/longest-valid-parentheses), [Remove Invalid Parentheses](/problem/remove-invalid-parentheses)
