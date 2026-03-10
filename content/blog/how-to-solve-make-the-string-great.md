---
title: "How to Solve Make The String Great — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Make The String Great. Easy difficulty, 68.4% acceptance rate. Topics: String, Stack."
date: "2027-07-30"
category: "dsa-patterns"
tags: ["make-the-string-great", "string", "stack", "easy"]
---

# How to Solve "Make The String Great"

This problem asks us to repeatedly remove adjacent pairs of characters that are the same letter but opposite cases (like 'aA' or 'Bb') until no such pairs remain. What makes this interesting is that removing one pair might create new adjacent pairs that need to be removed - this "chain reaction" is the core challenge.

## Visual Walkthrough

Let's trace through an example: `s = "abBAcC"`

1. Start: `"abBAcC"`
2. Check `'a'` and `'b'`: Not same letter → keep moving
3. Check `'b'` and `'B'`: Same letter, opposite cases! Remove `"bB"` → `"aAcC"`
4. Now check `'a'` and `'A'`: Same letter, opposite cases! Remove `"aA"` → `"cC"`
5. Check `'c'` and `'C'`: Same letter, opposite cases! Remove `"cC"` → `""`
6. Result: `""`

Notice how removing `"bB"` brought `'a'` and `'A'` together, creating a new pair to remove. This shows we need to handle these chain reactions.

## Brute Force Approach

A naive approach would repeatedly scan the string, removing bad pairs until no changes occur:

1. Scan the string from left to right
2. Whenever we find `s[i]` and `s[i+1]` that are same letter but opposite cases, remove them
3. Repeat step 1-2 until no more removals happen

This is inefficient because:

- After each removal, we restart scanning from the beginning
- Each scan is O(n), and we might need O(n) scans in worst case
- Total time becomes O(n²) for strings like `"aAaAaA..."`

While this would work for small inputs, it's too slow for the constraints.

## Optimal Solution

The key insight is that this is essentially a **stack problem**. We process characters one by one:

- If the current character forms a bad pair with the top of the stack, pop from stack (remove both)
- Otherwise, push the current character onto the stack

This works because the stack naturally handles the chain reactions - when we remove a pair, we "go back" to check if the new top of the stack forms a bad pair with the next character.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def makeGood(s: str) -> str:
    """
    Remove all adjacent characters that are same letter but opposite cases.
    Uses a stack to efficiently handle chain reactions.
    """
    stack = []

    for char in s:
        # Check if stack is not empty AND current char forms a bad pair with top
        if stack and abs(ord(char) - ord(stack[-1])) == 32:
            # Same letter, opposite cases (ASCII difference is 32)
            # Remove the pair by popping from stack
            stack.pop()
        else:
            # No bad pair, add current char to stack
            stack.append(char)

    # Convert stack back to string
    return ''.join(stack)
```

```javascript
// Time: O(n) | Space: O(n)
function makeGood(s) {
  /**
   * Remove all adjacent characters that are same letter but opposite cases.
   * Uses a stack to efficiently handle chain reactions.
   */
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Check if stack is not empty AND current char forms a bad pair with top
    if (
      stack.length > 0 &&
      Math.abs(char.charCodeAt(0) - stack[stack.length - 1].charCodeAt(0)) === 32
    ) {
      // Same letter, opposite cases (ASCII difference is 32)
      // Remove the pair by popping from stack
      stack.pop();
    } else {
      // No bad pair, add current char to stack
      stack.push(char);
    }
  }

  // Convert stack back to string
  return stack.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String makeGood(String s) {
        /**
         * Remove all adjacent characters that are same letter but opposite cases.
         * Uses a stack to efficiently handle chain reactions.
         */
        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);

            // Check if stack is not empty AND current char forms a bad pair with top
            if (!stack.isEmpty() &&
                Math.abs(currentChar - stack.peek()) == 32) {
                // Same letter, opposite cases (ASCII difference is 32)
                // Remove the pair by popping from stack
                stack.pop();
            } else {
                // No bad pair, add current char to stack
                stack.push(currentChar);
            }
        }

        // Convert stack back to string
        StringBuilder result = new StringBuilder();
        for (char c : stack) {
            result.append(c);
        }
        return result.toString();
    }
}
```

</div>

**Why the ASCII difference check works:**

- Uppercase letters: 'A' = 65, 'B' = 66, ..., 'Z' = 90
- Lowercase letters: 'a' = 97, 'b' = 98, ..., 'z' = 122
- Difference between 'a' and 'A' is 32, same for all letter pairs
- So `abs(ord('a') - ord('A')) == 32` tells us they're same letter, opposite cases

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once
- Each character is either pushed to or popped from the stack (O(1) operations)
- Final string construction is O(n) for joining the stack

**Space Complexity: O(n)**

- In worst case (no bad pairs), the stack stores all n characters
- The output string also requires O(n) space
- Total space is O(n) for stack + output

## Common Mistakes

1. **Forgetting about chain reactions**: Candidates might try to remove pairs in a single pass without using a stack, missing cases like `"abBA"` where removing `"bB"` creates new pair `"aA"`.

2. **Incorrect case comparison**: Using `char.lower() == stack[-1].lower()` without checking they're opposite cases, or forgetting the ASCII difference trick and writing verbose case checks.

3. **Off-by-one errors in brute force**: When removing pairs and rebuilding string, indices shift. If you remove `s[i]` and `s[i+1]`, the next check should be at the new `i-1` and `i`, not `i+1` and `i+2`.

4. **Not handling empty stack**: Forgetting to check `if stack` before accessing `stack[-1]` causes index errors on first character or after popping last element.

## When You'll See This Pattern

This "adjacent removal with stack" pattern appears in several problems:

1. **Remove All Adjacent Duplicates In String (LeetCode 1047)**: Similar concept but removes any adjacent duplicates, not just case opposites.

2. **Valid Parentheses (LeetCode 20)**: Uses stack to match opening and closing brackets - when you see a closing bracket, check if it matches the top of stack.

3. **Decode String (LeetCode 394)**: Uses stack to handle nested structures and backtrack when encountering closing brackets.

The core pattern is: **When processing sequentially and decisions depend on recently seen elements (with potential "undo" operations), consider a stack.**

## Key Takeaways

1. **Stack for "undo" operations**: When removing elements might expose new problems to solve (chain reactions), a stack lets you naturally backtrack to previous state.

2. **ASCII tricks for character manipulation**: Knowing that same-letter case opposites differ by exactly 32 in ASCII can simplify code compared to explicit case conversion and comparison.

3. **Single pass with auxiliary storage**: Many string processing problems that seem to require multiple passes can be solved in O(n) time using a stack or similar structure.

[Practice this problem on CodeJeet](/problem/make-the-string-great)
