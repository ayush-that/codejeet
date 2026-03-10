---
title: "How to Solve Remove K-Balanced Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove K-Balanced Substrings. Medium difficulty, 32.4% acceptance rate. Topics: String, Stack, Simulation."
date: "2029-11-26"
category: "dsa-patterns"
tags: ["remove-k-balanced-substrings", "string", "stack", "simulation", "medium"]
---

# How to Solve Remove K-Balanced Substrings

This problem asks us to repeatedly remove k-balanced substrings from a string containing only '(' and ')' characters. A k-balanced substring is exactly k consecutive '(' followed by k consecutive ')'. The tricky part is that after removing one k-balanced substring, new ones might form by concatenating the remaining parts on either side. This is similar to how parentheses matching works, but with the added constraint of requiring exactly k consecutive characters of each type.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider `s = "(()(()))"` with `k = 2`.

**Step 1:** We scan the string looking for exactly 2 '(' followed by 2 ')'.

- Starting at index 0: "(()(()))" - first 2 chars are "((" which is good, but next 2 chars are ")(" not "))"
- Starting at index 1: "()(()))" - first 2 chars are "()" not "(("
- Starting at index 2: "(()))" - first 2 chars are "((" good, next 2 chars are "))" good! Found "(()))" at indices 2-5

**Step 2:** Remove "(())" (indices 2-5), leaving us with "(()))"
Wait, that's not right - let's be more careful:
Original: "(()(()))"
Remove indices 2-5: "(())"
Remaining: "(()" + "))" = "(())"

**Step 3:** Now we have "(())" - this is exactly 2 '(' followed by 2 ')', so we remove it
Remaining: "" (empty string)

The process is complete. The key insight is that after removing one k-balanced substring, we need to check if the characters that were adjacent to it now form a new k-balanced substring. This is exactly what happens with a stack data structure when matching parentheses!

## Brute Force Approach

A naive approach would be to repeatedly scan the string for k-balanced substrings, remove them, and repeat until no more can be found. Here's how that would work:

1. Scan the string from left to right
2. For each starting position `i`, check if `s[i:i+2k]` equals `'(' * k + ')' * k`
3. If found, remove that substring and start scanning from the beginning again
4. Repeat until no more k-balanced substrings are found

The problem with this approach is its inefficiency. In the worst case (like `s = "(((...)))"` with many nested parentheses), we might need to scan the entire string O(n) times, leading to O(n²) time complexity. For strings up to 10⁵ characters (common in coding problems), this would be too slow.

Additionally, this approach doesn't efficiently handle the fact that removing a substring can create new k-balanced substrings by joining what was on either side. We'd need to restart scanning from the beginning each time, which is wasteful.

## Optimized Approach

The key insight is that this problem is essentially a variation of valid parentheses checking, but with the constraint that we need exactly k consecutive '(' followed by k consecutive ')'.

Think about it: when we see a '(', we need to track how many consecutive '(' we've seen. When we see a ')', we need to check if we had exactly k '(' before it. If so, we can "remove" this k-balanced substring.

We can use a stack to track counts of consecutive characters. Here's the step-by-step reasoning:

1. We'll use a stack where each element is a pair: `(character, count)`
2. As we iterate through the string:
   - If the current character matches the top of the stack, increment its count
   - If it doesn't match, push a new entry with count 1
3. After updating counts, check if we can form a k-balanced substring:
   - If we have ')' on top with count == k, check if the previous element is '(' with count == k
   - If both conditions are true, pop both elements (this represents removing the k-balanced substring)
4. Continue until we've processed the entire string
5. Finally, reconstruct the remaining string from what's left in the stack

This approach works because the stack naturally handles the "concatenation after removal" issue. When we pop both '(' and ')' with counts equal to k, we're effectively removing that k-balanced substring, and the next characters will be adjacent to whatever was before the '('.

## Optimal Solution

Here's the complete solution using a stack-based approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def remove_k_balanced(s, k):
    """
    Removes all k-balanced substrings from s.
    A k-balanced substring is k '(' followed by k ')'.

    Args:
        s: Input string containing only '(' and ')'
        k: Integer specifying the balance length

    Returns:
        String with all k-balanced substrings removed
    """
    # Edge case: if k is 0, nothing to remove
    if k == 0:
        return s

    # Stack will store tuples of (character, consecutive_count)
    stack = []

    for char in s:
        # If stack is empty or current char differs from top char
        if not stack or stack[-1][0] != char:
            # Start new sequence with this character
            stack.append([char, 1])
        else:
            # Continue existing sequence
            stack[-1][1] += 1

        # Check if we can remove a k-balanced substring
        # We need ')' on top with count == k
        if stack and stack[-1][0] == ')' and stack[-1][1] == k:
            # Check if previous element is '(' with count == k
            if len(stack) > 1 and stack[-2][0] == '(' and stack[-2][1] == k:
                # Remove both '(' and ')' sequences (k-balanced substring)
                stack.pop()  # Remove ')'
                stack.pop()  # Remove '('
            else:
                # We have k ')' but not preceded by k '('
                # This is not a k-balanced substring, so we keep it
                pass

    # Reconstruct the remaining string from stack
    result = []
    for char, count in stack:
        result.append(char * count)

    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n)
function removeKBalanced(s, k) {
  /**
   * Removes all k-balanced substrings from s.
   * A k-balanced substring is k '(' followed by k ')'.
   *
   * @param {string} s - Input string containing only '(' and ')'
   * @param {number} k - Integer specifying the balance length
   * @return {string} String with all k-balanced substrings removed
   */

  // Edge case: if k is 0, nothing to remove
  if (k === 0) return s;

  // Stack will store objects with char and count properties
  const stack = [];

  for (const char of s) {
    // If stack is empty or current char differs from top char
    if (stack.length === 0 || stack[stack.length - 1].char !== char) {
      // Start new sequence with this character
      stack.push({ char, count: 1 });
    } else {
      // Continue existing sequence
      stack[stack.length - 1].count++;
    }

    // Check if we can remove a k-balanced substring
    // We need ')' on top with count === k
    if (
      stack.length > 0 &&
      stack[stack.length - 1].char === ")" &&
      stack[stack.length - 1].count === k
    ) {
      // Check if previous element is '(' with count === k
      if (
        stack.length > 1 &&
        stack[stack.length - 2].char === "(" &&
        stack[stack.length - 2].count === k
      ) {
        // Remove both '(' and ')' sequences (k-balanced substring)
        stack.pop(); // Remove ')'
        stack.pop(); // Remove '('
      }
      // If not preceded by k '(', we keep the sequence
    }
  }

  // Reconstruct the remaining string from stack
  let result = "";
  for (const item of stack) {
    result += item.char.repeat(item.count);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public String removeKBalanced(String s, int k) {
        /**
         * Removes all k-balanced substrings from s.
         * A k-balanced substring is k '(' followed by k ')'.
         *
         * @param s Input string containing only '(' and ')'
         * @param k Integer specifying the balance length
         * @return String with all k-balanced substrings removed
         */

        // Edge case: if k is 0, nothing to remove
        if (k == 0) return s;

        // Stack will store pairs of character and consecutive count
        // Using a custom class to store char and count
        Stack<CharCount> stack = new Stack<>();

        for (char c : s.toCharArray()) {
            // If stack is empty or current char differs from top char
            if (stack.isEmpty() || stack.peek().ch != c) {
                // Start new sequence with this character
                stack.push(new CharCount(c, 1));
            } else {
                // Continue existing sequence
                stack.peek().count++;
            }

            // Check if we can remove a k-balanced substring
            // We need ')' on top with count == k
            if (!stack.isEmpty() && stack.peek().ch == ')' &&
                stack.peek().count == k) {

                // Check if previous element is '(' with count == k
                if (stack.size() > 1 && stack.get(stack.size() - 2).ch == '(' &&
                    stack.get(stack.size() - 2).count == k) {

                    // Remove both '(' and ')' sequences (k-balanced substring)
                    stack.pop(); // Remove ')'
                    stack.pop(); // Remove '('
                }
                // If not preceded by k '(', we keep the sequence
            }
        }

        // Reconstruct the remaining string from stack
        StringBuilder result = new StringBuilder();
        for (CharCount cc : stack) {
            for (int i = 0; i < cc.count; i++) {
                result.append(cc.ch);
            }
        }

        return result.toString();
    }

    // Helper class to store character and its consecutive count
    class CharCount {
        char ch;
        int count;

        CharCount(char ch, int count) {
            this.ch = ch;
            this.count = count;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the string: O(n)
- Each character results in at most 2 stack operations (push/pop): O(1) per character
- Reconstructing the result string takes O(n) in the worst case
- Total: O(n) + O(n) = O(n)

**Space Complexity:** O(n)

- In the worst case (no k-balanced substrings), the stack stores all characters: O(n)
- The result string can also be O(n) in the worst case
- Total: O(n) + O(n) = O(n)

The worst-case space usage occurs when the input has no k-balanced substrings at all (e.g., all '(' or all ')'), or when k is larger than any consecutive sequence in the string.

## Common Mistakes

1. **Not handling k = 0 edge case**: When k = 0, the definition of k-balanced substring becomes ambiguous (empty string). The correct behavior is to return the original string unchanged since you can't remove an empty substring repeatedly.

2. **Forgetting that removal can create new k-balanced substrings**: This is the most common mistake. Candidates might implement a one-pass solution that removes k-balanced substrings but doesn't check if new ones form after removal. The stack approach naturally handles this because when we pop both '(' and ')', the next operations work with whatever was before them.

3. **Incorrect reconstruction from stack**: After processing, the stack contains counts of consecutive characters. Some candidates try to reconstruct by simply concatenating characters without considering the counts, which would lose information about consecutive sequences.

4. **Off-by-one errors with indices**: When checking for k-balanced substrings, it's easy to make off-by-one errors. The stack approach avoids this by working with counts rather than indices.

## When You'll See This Pattern

This problem uses a **stack-based sequence compression** pattern that appears in several other LeetCode problems:

1. **Valid Parentheses (LeetCode 20)**: The classic stack problem for matching parentheses. This problem extends that concept by requiring specific counts of consecutive characters.

2. **Remove All Adjacent Duplicates In String (LeetCode 1047)**: This problem asks to remove adjacent duplicates repeatedly. The stack approach here is similar - we track consecutive characters and remove them when certain conditions are met.

3. **Decode String (LeetCode 394)**: While more complex, it also uses a stack to handle nested structures and repetition counts, similar to how we track consecutive character counts here.

The core pattern is: when you need to process elements in order and handle "cancellation" or "removal" based on relationships between adjacent elements, consider using a stack to track state.

## Key Takeaways

1. **Stacks are ideal for nested/canceling structures**: Whenever you see problems involving matching pairs, removing adjacent elements, or nested patterns, think about using a stack. It naturally handles the "what's next to what" relationship.

2. **Compress consecutive elements when possible**: Instead of storing every character individually, storing (character, count) pairs can simplify logic when you care about consecutive sequences. This is especially useful when k can be large.

3. **Simulate the process, don't actually modify strings**: Rather than actually removing substrings from the string (which is O(n) each time), simulate the removal using a stack. This changes the time complexity from O(n²) to O(n).

[Practice this problem on CodeJeet](/problem/remove-k-balanced-substrings)
