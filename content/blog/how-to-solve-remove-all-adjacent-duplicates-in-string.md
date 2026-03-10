---
title: "How to Solve Remove All Adjacent Duplicates In String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove All Adjacent Duplicates In String. Easy difficulty, 72.8% acceptance rate. Topics: String, Stack."
date: "2026-11-27"
category: "dsa-patterns"
tags: ["remove-all-adjacent-duplicates-in-string", "string", "stack", "easy"]
---

# How to Solve Remove All Adjacent Duplicates In String

This problem asks us to repeatedly remove adjacent duplicate characters from a string until no more removals are possible. What makes this interesting is that removals can create _new_ adjacent duplicates — for example, removing "bb" from "abbc" leaves "ac", which weren't originally adjacent. This cascading effect means we can't just scan once and remove duplicates; we need to handle the chain reactions.

## Visual Walkthrough

Let's trace through an example: `s = "abbaca"`

**Step-by-step process:**

1. Start: `"abbaca"`
2. Look for adjacent duplicates: `"abbaca"` has "bb" at positions 1-2
3. Remove "bb": `"aaca"`
4. Now check the new string: `"aaca"` has "aa" at positions 0-1
5. Remove "aa": `"ca"`
6. Check again: `"ca"` has no adjacent duplicates
7. Final result: `"ca"`

Notice how removing "bb" brought the two "a"s together, creating a new pair to remove. This is why we need to process the string repeatedly until no changes occur.

## Brute Force Approach

A naive approach would be to repeatedly scan the string, removing adjacent duplicates until no changes occur:

1. Start with the original string
2. Scan from left to right, looking for two consecutive identical characters
3. If found, remove them and start over from the beginning
4. Repeat until a full scan finds no duplicates

**Why this is inefficient:**

- Each removal could require restarting the scan from the beginning
- In the worst case (like `"aaaaaaaa"`), we'd make O(n) scans
- Each scan is O(n), giving us O(n²) time complexity
- We also create new strings each time, which is expensive

While this would work for small inputs, it's too slow for larger strings. The key insight is that we need to efficiently handle the cascading removals without restarting our scan.

## Optimal Solution

The optimal solution uses a **stack** data structure. Here's the intuition:

1. Process characters from left to right
2. For each character:
   - If it matches the top of the stack (last character we kept), pop from stack (remove both)
   - Otherwise, push it onto the stack (keep it)
3. After processing all characters, the stack contains the final result

The stack naturally handles the cascading effect because when we pop a character, the new top becomes adjacent to the next character we process.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def removeDuplicates(s: str) -> str:
    """
    Removes all adjacent duplicate characters from the string.

    Args:
        s: Input string containing lowercase English letters

    Returns:
        String with all adjacent duplicates removed
    """
    # Use a list as a stack (Python lists have efficient append/pop from end)
    stack = []

    # Process each character in the input string
    for char in s:
        # If stack is not empty and current character matches top of stack
        if stack and stack[-1] == char:
            # Remove the matching pair by popping from stack
            stack.pop()
        else:
            # Otherwise, add current character to stack
            stack.append(char)

    # Convert stack back to string
    return ''.join(stack)
```

```javascript
// Time: O(n) | Space: O(n)
function removeDuplicates(s) {
  /**
   * Removes all adjacent duplicate characters from the string.
   *
   * @param {string} s - Input string containing lowercase English letters
   * @return {string} String with all adjacent duplicates removed
   */
  // Use an array as a stack
  const stack = [];

  // Process each character in the input string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // If stack is not empty and current character matches top of stack
    if (stack.length > 0 && stack[stack.length - 1] === char) {
      // Remove the matching pair by popping from stack
      stack.pop();
    } else {
      // Otherwise, add current character to stack
      stack.push(char);
    }
  }

  // Convert stack array back to string
  return stack.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String removeDuplicates(String s) {
        /**
         * Removes all adjacent duplicate characters from the string.
         *
         * @param s Input string containing lowercase English letters
         * @return String with all adjacent duplicates removed
         */
        // Use StringBuilder as a stack (more efficient than Stack<Character>)
        StringBuilder stack = new StringBuilder();

        // Process each character in the input string
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);
            int stackLength = stack.length();

            // If stack is not empty and current character matches top of stack
            if (stackLength > 0 && stack.charAt(stackLength - 1) == currentChar) {
                // Remove the matching pair by deleting last character
                stack.deleteCharAt(stackLength - 1);
            } else {
                // Otherwise, add current character to stack
                stack.append(currentChar);
            }
        }

        // Convert StringBuilder to String
        return stack.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once
- Each character is either pushed or popped from the stack
- Push and pop operations are O(1) for stack implementations

**Space Complexity: O(n)**

- In the worst case (no duplicates), we store all n characters in the stack
- In the best case (all duplicates), we use O(1) space
- The average case depends on the input pattern

The stack approach is optimal because we must at least examine each character once (Ω(n) time), and we might need to store most of them in the worst case (Ω(n) space).

## Common Mistakes

1. **Forgetting to check if stack is empty before accessing top**
   - Always check `if stack` (Python), `if stack.length > 0` (JS), or `if stackLength > 0` (Java) before comparing with `stack[-1]`
   - Accessing an empty stack causes runtime errors

2. **Using string concatenation instead of stack**
   - Some candidates try to build the result string directly with concatenation
   - This fails because removing from the middle of a string is O(n) in most languages
   - The stack gives us O(1) access to the "last kept character"

3. **Not handling cascading removals correctly**
   - After removing "bb" from "abbc", the naive approach might not check if "a" and "c" are now adjacent
   - The stack automatically handles this because popping removes the adjacency

4. **Incorrect loop boundaries in two-pointer approaches**
   - Some candidates try to use two pointers without a stack
   - This gets complicated with boundary conditions when removals happen
   - The stack approach is simpler and less error-prone

## When You'll See This Pattern

The stack pattern for adjacent element removal appears in several variations:

1. **Remove All Adjacent Duplicates in String II (LeetCode 1209)**
   - Same problem but remove duplicates only when you have k adjacent identical characters
   - Solution: Store both character and count in stack

2. **Removing Stars From a String (LeetCode 2390)**
   - Remove the character to the left of each star
   - Solution: Use stack, pop when you see a star

3. **Valid Parentheses (LeetCode 20)**
   - Check if parentheses are properly matched and nested
   - Solution: Use stack to track opening brackets, pop when matching closing bracket appears

4. **Simplify Path (LeetCode 71)**
   - Process Unix-style path with ".." (parent directory) and "." (current directory)
   - Solution: Use stack to build canonical path

The common theme: when you need to process elements sequentially and operations depend on recently seen elements, a stack is often the right choice.

## Key Takeaways

1. **Stack is ideal for "last in, first out" adjacency problems**
   - When removals or operations depend on the most recent element
   - When operations can trigger chain reactions

2. **Recognize the pattern: "repeatedly remove adjacent duplicates"**
   - This almost always means use a stack
   - The stack naturally handles the cascading effect

3. **Practice stack variations**
   - Try solving the "k duplicates" version
   - Try solving the "stars" version
   - Notice how the core stack pattern remains the same

Remember: If a problem involves processing elements in order and making decisions based on what you just saw (especially with removal operations), reach for a stack first.

Related problems: [Remove All Adjacent Duplicates in String II](/problem/remove-all-adjacent-duplicates-in-string-ii), [Removing Stars From a String](/problem/removing-stars-from-a-string), [Minimize String Length](/problem/minimize-string-length)
