---
title: "How to Solve Resulting String After Adjacent Removals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Resulting String After Adjacent Removals. Medium difficulty, 56.6% acceptance rate. Topics: String, Stack, Simulation."
date: "2029-03-25"
category: "dsa-patterns"
tags: ["resulting-string-after-adjacent-removals", "string", "stack", "simulation", "medium"]
---

# How to Solve Resulting String After Adjacent Removals

You're given a string where you repeatedly remove the leftmost pair of adjacent characters that are consecutive in the alphabet (like "ab", "bc", etc.). The challenge is to determine what string remains after no more removals are possible. What makes this interesting is that removals can create new adjacent pairs that weren't originally consecutive, requiring careful processing order.

## Visual Walkthrough

Let's trace through `s = "abcdeedcba"` step by step:

1. **Initial string**: `"abcdeedcba"`
2. **Find leftmost consecutive pair**: Starting from left, `"ab"` are consecutive (a→b). Remove them: `"cdeedcba"`
3. **New string**: `"cdeedcba"`. Next leftmost consecutive pair: `"cd"` (c→d). Remove: `"eedcba"`
4. **New string**: `"eedcba"`. Next: `"ee"` are NOT consecutive (e→f needed). Skip. Next: `"ed"` are NOT consecutive (e→d is backward). Skip. Next: `"dc"` are NOT consecutive (d→c is backward). Skip. Next: `"cb"` are NOT consecutive (c→b is backward). Skip. Next: `"ba"` are NOT consecutive (b→a is backward). No removals possible.

**Result**: `"eedcba"`

But wait — is this correct? Let's think about the actual process more carefully. The problem says we must remove the **leftmost** pair of **adjacent** characters that are consecutive. In our first step, we correctly removed `"ab"`. But after removing `"cd"`, we got `"eedcba"`. However, what if we look at the original string differently?

Actually, let's try a simpler example: `s = "abc"`

1. `"abc"` → `"ab"` are consecutive, remove them → `"c"`
2. Result: `"c"`

Another example: `s = "abcddcba"`

1. `"abcddcba"` → remove `"ab"` → `"cddcba"`
2. `"cddcba"` → remove `"cd"` → `"dcba"`
3. `"dcba"` → no consecutive pairs (all are decreasing)
4. Result: `"dcba"`

The key insight: removals happen from left to right, but each removal can expose new pairs to the left of where we just removed! This is why we need to be careful.

## Brute Force Approach

The most straightforward approach is to simulate the process exactly as described:

1. Scan the string from left to right
2. Find the first pair where `abs(ord(s[i]) - ord(s[i+1])) == 1`
3. Remove those two characters
4. Start over from the beginning
5. Repeat until no such pair exists

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def brute_force(s: str) -> str:
    # Convert to list for easier removal
    chars = list(s)

    while True:
        found = False
        i = 0

        # Scan for first consecutive pair
        while i < len(chars) - 1:
            if abs(ord(chars[i]) - ord(chars[i+1])) == 1:
                # Remove the pair
                del chars[i:i+2]
                found = True
                break
            i += 1

        # If no pair found, we're done
        if not found:
            break

    return ''.join(chars)
```

```javascript
// Time: O(n²) | Space: O(n)
function bruteForce(s) {
  // Convert to array for easier removal
  let chars = s.split("");

  while (true) {
    let found = false;

    // Scan for first consecutive pair
    for (let i = 0; i < chars.length - 1; i++) {
      if (Math.abs(chars[i].charCodeAt(0) - chars[i + 1].charCodeAt(0)) === 1) {
        // Remove the pair
        chars.splice(i, 2);
        found = true;
        break;
      }
    }

    // If no pair found, we're done
    if (!found) break;
  }

  return chars.join("");
}
```

```java
// Time: O(n²) | Space: O(n)
public String bruteForce(String s) {
    // Use StringBuilder for mutable string operations
    StringBuilder sb = new StringBuilder(s);

    while (true) {
        boolean found = false;

        // Scan for first consecutive pair
        for (int i = 0; i < sb.length() - 1; i++) {
            if (Math.abs(sb.charAt(i) - sb.charAt(i+1)) == 1) {
                // Remove the pair
                sb.delete(i, i + 2);
                found = true;
                break;
            }
        }

        // If no pair found, we're done
        if (!found) break;
    }

    return sb.toString();
}
```

</div>

**Why this is inefficient**: In the worst case (like `"abcdefgh..."`), we remove pairs from the beginning repeatedly. Each removal takes O(n) time due to shifting elements, and we might do O(n) removals. This gives us O(n²) time complexity, which is too slow for large inputs (n up to 10⁵ in typical constraints).

## Optimized Approach

The key insight is recognizing this as a **stack-based problem**. Why? Because when we remove a pair, we need to check if new consecutive pairs form with the character before the removed pair. A stack naturally handles this "look back" behavior.

Think about it: as we process characters left to right:

1. Push each character onto a stack
2. Before pushing, check if the current character and the top of the stack are consecutive
3. If they are, pop from the stack (remove both) instead of pushing
4. Otherwise, push the current character

But wait — there's a subtlety! We're supposed to remove the **leftmost** consecutive pair. With a stack, we're effectively checking pairs from right to left as we build the string. Is this equivalent?

Let's test with `s = "abc"`:

- Push 'a'
- 'b' vs top 'a': consecutive? Yes (a→b). Pop 'a', don't push 'b'
- Push 'c'
- Result stack: ['c'] → "c" ✓

With `s = "abcddcba"`:

- Push 'a'
- 'b' vs 'a': consecutive, pop 'a'
- Push 'c' (stack: ['c'])
- 'd' vs 'c': consecutive, pop 'c'
- Push 'd' (stack: ['d'])
- 'c' vs 'd': NOT consecutive (d→c), push 'c' (stack: ['d', 'c'])
- 'b' vs 'c': NOT consecutive (c→b), push 'b' (stack: ['d', 'c', 'b'])
- 'a' vs 'b': NOT consecutive (b→a), push 'a' (stack: ['d', 'c', 'b', 'a'])
- Result: "dcba" ✓

This works because removing the leftmost pair is equivalent to greedily removing any consecutive pair we encounter while processing left to right! When we see a consecutive pair, removing it immediately is correct because:

1. It's the leftmost such pair at this point in processing
2. Any pair to its left has already been processed and wasn't consecutive
3. Removing it won't affect already-processed pairs to the left

## Optimal Solution

Here's the stack-based solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def resulting_string(s: str) -> str:
    """
    Returns the resulting string after repeatedly removing the leftmost
    pair of adjacent consecutive characters.

    Approach: Use a stack to process characters left to right.
    For each character, check if it forms a consecutive pair with
    the top of the stack. If yes, pop from stack (remove both).
    Otherwise, push the character onto stack.
    """
    stack = []

    for char in s:
        # Check if stack is not empty and current char forms
        # a consecutive pair with top of stack
        if stack and abs(ord(char) - ord(stack[-1])) == 1:
            # Remove the pair by popping from stack
            stack.pop()
        else:
            # No consecutive pair, add to stack
            stack.append(char)

    # Convert stack back to string
    return ''.join(stack)
```

```javascript
// Time: O(n) | Space: O(n)
function resultingString(s) {
  /**
   * Returns the resulting string after repeatedly removing the leftmost
   * pair of adjacent consecutive characters.
   *
   * Approach: Use a stack to process characters left to right.
   * For each character, check if it forms a consecutive pair with
   * the top of the stack. If yes, pop from stack (remove both).
   * Otherwise, push the character onto stack.
   */
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Check if stack is not empty and current char forms
    // a consecutive pair with top of stack
    if (
      stack.length > 0 &&
      Math.abs(char.charCodeAt(0) - stack[stack.length - 1].charCodeAt(0)) === 1
    ) {
      // Remove the pair by popping from stack
      stack.pop();
    } else {
      // No consecutive pair, add to stack
      stack.push(char);
    }
  }

  // Convert stack back to string
  return stack.join("");
}
```

```java
// Time: O(n) | Space: O(n)
public String resultingString(String s) {
    /**
     * Returns the resulting string after repeatedly removing the leftmost
     * pair of adjacent consecutive characters.
     *
     * Approach: Use a stack to process characters left to right.
     * For each character, check if it forms a consecutive pair with
     * the top of the stack. If yes, pop from stack (remove both).
     * Otherwise, push the character onto stack.
     */
    Stack<Character> stack = new Stack<>();

    for (int i = 0; i < s.length(); i++) {
        char currentChar = s.charAt(i);

        // Check if stack is not empty and current char forms
        // a consecutive pair with top of stack
        if (!stack.isEmpty() &&
            Math.abs(currentChar - stack.peek()) == 1) {
            // Remove the pair by popping from stack
            stack.pop();
        } else {
            // No consecutive pair, add to stack
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
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We process each character exactly once
- Each character is either pushed to or popped from the stack (O(1) operations)
- No nested loops or repeated scanning

**Space Complexity**: O(n)

- In the worst case (no consecutive pairs), the stack stores all n characters
- Examples of worst case: `"acegik"` (all characters with gaps) or `"dcba"` (all decreasing)

The stack could use up to n space, but note that the output itself could be up to n characters long, so O(n) space is optimal for storing the result.

## Common Mistakes

1. **Not handling the "leftmost" requirement correctly**: Some candidates try to remove all consecutive pairs simultaneously or in arbitrary order. Remember: after removing one pair, you need to reconsider pairs that include the character before the removed section. The stack approach naturally handles this.

2. **Off-by-one errors in consecutive check**: The problem says characters are consecutive in the alphabet, meaning 'a' and 'b', 'b' and 'c', etc. The difference in ASCII values is exactly 1. Some candidates check for `ord(char1) + 1 == ord(char2)`, which only checks forward consecutive pairs, but we need to check both directions ('ab' and 'ba' are both consecutive). Use `abs(ord(a) - ord(b)) == 1`.

3. **Inefficient string manipulation**: Using string concatenation or slicing inside a loop (like `s = s[:i] + s[i+2:]`) creates new strings each time, making it O(n²). Always use a stack or similar data structure for efficient removals.

4. **Forgetting to check if stack is empty**: Before accessing `stack[-1]` or `stack.peek()`, always check if the stack is empty. Attempting to access the top of an empty stack causes runtime errors.

## When You'll See This Pattern

This "adjacent removal with stack" pattern appears in several classic problems:

1. **Remove All Adjacent Duplicates In String (LeetCode 1047)**: Similar concept but removes equal characters instead of consecutive ones. The stack approach is identical — just change the condition from `abs(ord(a)-ord(b)) == 1` to `a == b`.

2. **Make The String Great (LeetCode 1544)**: Removes adjacent characters that are the same letter but different case (like 'a' and 'A'). Again, same stack pattern with a different condition.

3. **Valid Parentheses (LeetCode 20)**: The classic stack problem where you remove matching pairs. Instead of consecutive characters, you're matching opening and closing brackets.

The pattern to recognize: **when you need to process elements sequentially and removals can create new adjacent relationships to reconsider, a stack is often the right tool.**

## Key Takeaways

1. **Stack for adjacent operations**: When a problem involves removing adjacent elements based on some relationship, and removals can create new adjacent pairs, think "stack." The stack lets you easily check and remove with the previous element.

2. **Greedy removal works**: For "remove leftmost pair" problems, removing pairs as soon as you see them (while processing left to right) is optimal. You don't need to look ahead or backtrack.

3. **Watch for directionality**: Check if the relationship is directional (like 'ab' but not 'ba') or bidirectional (both 'ab' and 'ba'). This affects your condition check. Here it's bidirectional since 'a' and 'b' are consecutive regardless of order.

[Practice this problem on CodeJeet](/problem/resulting-string-after-adjacent-removals)
