---
title: "How to Solve Removing Stars From a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Removing Stars From a String. Medium difficulty, 79.0% acceptance rate. Topics: String, Stack, Simulation."
date: "2027-03-05"
category: "dsa-patterns"
tags: ["removing-stars-from-a-string", "string", "stack", "simulation", "medium"]
---

# How to Solve Removing Stars From a String

This problem asks us to process a string containing stars (`*`), where each star removes the closest non-star character to its left along with itself. The challenge is efficiently handling these removal operations without repeatedly shifting characters in the string, which would be computationally expensive. What makes this interesting is recognizing it's essentially a "backspace" operation similar to what happens when you press backspace in a text editor.

## Visual Walkthrough

Let's trace through an example: `s = "ab*c*d"`

**Step-by-step simulation:**

1. Start with empty result: `""`
2. Read `'a'` → not a star, add to result: `"a"`
3. Read `'b'` → not a star, add to result: `"ab"`
4. Read `'*'` → star found! Remove closest non-star to left (`'b'`) and the star itself: `"a"`
5. Read `'c'` → not a star, add to result: `"ac"`
6. Read `'*'` → star found! Remove closest non-star to left (`'c'`) and the star itself: `"a"`
7. Read `'d'` → not a star, add to result: `"ad"`

Final result: `"ad"`

Notice how we're essentially building the result character by character, but when we encounter a star, we need to remove the most recently added character. This pattern should immediately suggest using a stack data structure.

## Brute Force Approach

A naive approach would be to literally simulate the process as described: scan through the string, and whenever we find a star, search left to find the closest non-star character, then remove both characters from the string. We'd need to repeat this process until all stars are processed.

The problem with this approach is that removing characters from a string (especially in the middle) is an O(n) operation in most languages, since all characters after the removal point need to be shifted. With potentially O(n) stars in the string, this could lead to O(n²) time complexity.

Even if we try to mark characters as "deleted" and rebuild the string at the end, we'd still need to search left for each star, which could require scanning many already-processed characters.

## Optimized Approach

The key insight is recognizing that this problem follows a **Last-In-First-Out (LIFO)** pattern:

- When we encounter a regular character, we add it to our result
- When we encounter a star, we remove the most recently added character

This is exactly how a **stack** works! We can process the string left to right:

1. Initialize an empty stack (list/array)
2. For each character in the string:
   - If it's not a star, push it onto the stack
   - If it's a star, pop from the stack (remove the most recent character)
3. After processing all characters, join what's left in the stack to form the result

This approach is efficient because stack operations (push and pop) are O(1), and we only make one pass through the string.

## Optimal Solution

Here's the stack-based solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) - We process each character exactly once
# Space: O(n) - In worst case, stack stores all characters (no stars)
def removeStars(s: str) -> str:
    # Initialize an empty stack to store characters
    stack = []

    # Process each character in the input string
    for char in s:
        if char == '*':
            # If we encounter a star, remove the most recent character
            # This simulates removing the closest non-star to the left
            if stack:  # Safety check to ensure stack isn't empty
                stack.pop()
        else:
            # If it's a regular character, add it to the stack
            stack.append(char)

    # Join all characters left in the stack to form the final string
    return ''.join(stack)
```

```javascript
// Time: O(n) - We process each character exactly once
// Space: O(n) - In worst case, stack stores all characters (no stars)
function removeStars(s) {
  // Initialize an empty stack to store characters
  const stack = [];

  // Process each character in the input string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === "*") {
      // If we encounter a star, remove the most recent character
      // This simulates removing the closest non-star to the left
      if (stack.length > 0) {
        // Safety check to ensure stack isn't empty
        stack.pop();
      }
    } else {
      // If it's a regular character, add it to the stack
      stack.push(char);
    }
  }

  // Join all characters left in the stack to form the final string
  return stack.join("");
}
```

```java
// Time: O(n) - We process each character exactly once
// Space: O(n) - In worst case, stack stores all characters (no stars)
public String removeStars(String s) {
    // Initialize an empty stack to store characters
    Stack<Character> stack = new Stack<>();

    // Process each character in the input string
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '*') {
            // If we encounter a star, remove the most recent character
            // This simulates removing the closest non-star to the left
            if (!stack.isEmpty()) {  // Safety check to ensure stack isn't empty
                stack.pop();
            }
        } else {
            // If it's a regular character, add it to the stack
            stack.push(c);
        }
    }

    // Build the result string from what's left in the stack
    StringBuilder result = new StringBuilder();
    for (char c : stack) {
        result.append(c);
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, processing each character exactly once
- Each stack operation (push or pop) is O(1)
- Building the final string from the stack is O(k) where k ≤ n
- Total: O(n) + O(k) = O(n)

**Space Complexity: O(n)**

- In the worst case (string with no stars), the stack stores all n characters
- In the best case (all stars), the stack remains empty
- The output string could require O(n) space in worst case

## Common Mistakes

1. **Forgetting to check if stack is empty before popping**: If the string starts with a star or has consecutive stars, trying to pop from an empty stack will cause an error. Always check `if stack:` (Python), `if stack.length > 0` (JavaScript), or `if !stack.isEmpty()` (Java).

2. **Using string concatenation instead of a stack**: Some candidates try to build the result string directly by concatenation and slicing. This is inefficient because string operations like slicing or concatenation often create new strings, leading to O(n²) time complexity.

3. **Misunderstanding the "closest non-star to the left" requirement**: The star removes the MOST RECENT non-star character, not just any non-star to the left. For example, in `"a*b*c"`, the first star removes `'a'`, not `'b'` (which hasn't been added yet when we process the first star).

4. **Not considering edge cases**:
   - Empty string: should return empty string
   - String with only stars: should return empty string
   - String with no stars: should return the original string
   - Consecutive stars: `"ab**c"` → first star removes `'b'`, second star removes `'a'`, result is `"c"`

## When You'll See This Pattern

This stack-based pattern appears in many problems involving sequential processing with cancellation or reversal operations:

1. **Backspace String Compare (LeetCode 844)**: Almost identical problem where `'#'` acts as backspace. The same stack approach works perfectly.

2. **Remove All Adjacent Duplicates In String (LeetCode 1047)**: Instead of stars removing the previous character, duplicate adjacent characters cancel each other out. The stack approach helps efficiently handle these cancellations.

3. **Valid Parentheses (LeetCode 20)**: Uses a stack to match opening and closing brackets, with a similar "cancel out" pattern when matching pairs are found.

4. **Simplify Path (LeetCode 71)**: Processing directory operations where `".."` means "go up one directory" - similar to removing the most recent directory from the path.

The common theme is: when you need to process elements in order and frequently need to remove or modify the most recently processed elements, think about using a stack.

## Key Takeaways

1. **Recognize the LIFO pattern**: When a problem involves removing/canceling the "most recent" or "last seen" element, a stack is usually the right tool. The star removing the closest non-star to the left is essentially "undoing" the last character addition.

2. **Avoid string manipulation in loops**: Direct string concatenation, slicing, or replacement inside loops often leads to poor time complexity. Using a stack or other data structure to accumulate results is more efficient.

3. **One-pass solutions are often possible**: Many string processing problems that seem to require multiple passes can be solved in O(n) time with the right data structure. Always ask: "Can I process this in one pass with auxiliary storage?"

Related problems: [Backspace String Compare](/problem/backspace-string-compare), [Remove All Adjacent Duplicates In String](/problem/remove-all-adjacent-duplicates-in-string)
