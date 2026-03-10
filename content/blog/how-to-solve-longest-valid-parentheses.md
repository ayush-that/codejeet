---
title: "How to Solve Longest Valid Parentheses — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Valid Parentheses. Hard difficulty, 38.1% acceptance rate. Topics: String, Dynamic Programming, Stack."
date: "2026-10-03"
category: "dsa-patterns"
tags: ["longest-valid-parentheses", "string", "dynamic-programming", "stack", "hard"]
---

# How to Solve Longest Valid Parentheses

Finding the longest valid parentheses substring is a classic hard problem that tests your ability to combine string processing with dynamic programming or stack techniques. What makes this tricky is that valid parentheses must be contiguous and well-formed, and you need to find the _longest_ such substring, not just check if the entire string is valid. The brute force approach is too slow, requiring clever optimization.

## Visual Walkthrough

Let's trace through an example: `"(()())"`

A valid parentheses substring must have:

1. Equal numbers of opening and closing parentheses
2. Never have more closing than opening at any point (when scanning left to right)

For `"(()())"`:

- The entire string is valid: `"(()())"`
- Let's check substrings:
  - `"(()())"` (length 6) - valid ✓
  - `"(()()"` (length 5) - invalid ✗ (unmatched `(` at start)
  - `"()())"` (length 5) - invalid ✗ (extra `)` at position 4)

The longest valid substring is the entire string with length 6.

Now consider a trickier example: `")()())"`:

- Position 0: `")"` - invalid start
- Position 1-4: `"()()"` - valid (length 4)
- Position 2-5: `"())"` - invalid
- The longest valid substring is `"()()"` with length 4.

The challenge is finding this efficiently without checking all O(n²) substrings.

## Brute Force Approach

The brute force solution checks every possible substring to see if it's valid:

1. Generate all substrings (O(n²) of them)
2. For each substring, check if it's valid using a counter:
   - Increment for `'('`, decrement for `')'`
   - If counter ever goes negative, substring is invalid
   - At the end, counter must be 0
3. Track the maximum length of valid substrings

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def longestValidParentheses_brute(s: str) -> int:
    max_len = 0
    n = len(s)

    # Check all possible substrings
    for i in range(n):
        for j in range(i + 2, n + 1, 2):  # Only even lengths can be valid
            # Check if substring s[i:j] is valid
            balance = 0
            valid = True

            for k in range(i, j):
                if s[k] == '(':
                    balance += 1
                else:
                    balance -= 1

                # More closing than opening means invalid
                if balance < 0:
                    valid = False
                    break

            # Valid if balance is 0 and we never had negative balance
            if valid and balance == 0:
                max_len = max(max_len, j - i)

    return max_len
```

```javascript
// Time: O(n³) | Space: O(1)
function longestValidParenthesesBrute(s) {
  let maxLen = 0;
  const n = s.length;

  // Check all possible substrings
  for (let i = 0; i < n; i++) {
    // Only even lengths can be valid parentheses
    for (let j = i + 2; j <= n; j += 2) {
      // Check if substring s[i:j] is valid
      let balance = 0;
      let valid = true;

      for (let k = i; k < j; k++) {
        if (s[k] === "(") {
          balance++;
        } else {
          balance--;
        }

        // More closing than opening means invalid
        if (balance < 0) {
          valid = false;
          break;
        }
      }

      // Valid if balance is 0 and we never had negative balance
      if (valid && balance === 0) {
        maxLen = Math.max(maxLen, j - i);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n³) | Space: O(1)
public int longestValidParenthesesBrute(String s) {
    int maxLen = 0;
    int n = s.length();

    // Check all possible substrings
    for (int i = 0; i < n; i++) {
        // Only even lengths can be valid parentheses
        for (int j = i + 2; j <= n; j += 2) {
            // Check if substring s[i:j] is valid
            int balance = 0;
            boolean valid = true;

            for (int k = i; k < j; k++) {
                if (s.charAt(k) == '(') {
                    balance++;
                } else {
                    balance--;
                }

                // More closing than opening means invalid
                if (balance < 0) {
                    valid = false;
                    break;
                }
            }

            // Valid if balance is 0 and we never had negative balance
            if (valid && balance == 0) {
                maxLen = Math.max(maxLen, j - i);
            }
        }
    }

    return maxLen;
}
```

</div>

**Why this fails:** O(n³) time complexity is far too slow for typical constraints (n up to 3×10⁴). We need at least O(n) or O(n log n).

## Optimized Approach

The key insight is that we can use a **stack** or **dynamic programming** to track valid parentheses in linear time. Both approaches work, but the stack solution is more intuitive for this problem.

### Stack Approach Insight

We can use a stack to track indices of parentheses. The trick is to push `-1` onto the stack initially as a base reference point. Then:

1. When we see `'('`, push its index onto the stack
2. When we see `')'`:
   - Pop from the stack
   - If stack becomes empty, push current index (new base)
   - Otherwise, calculate length: `current_index - stack.peek()`

This works because the stack always contains the index of the last unmatched `')'` (or `-1` initially), which serves as the boundary for valid substrings.

### Dynamic Programming Insight

We can define `dp[i]` as the length of the longest valid parentheses ending at index `i`:

- If `s[i] == '('`, then `dp[i] = 0` (valid parentheses can't end with `'('`)
- If `s[i] == ')'`:
  - If `s[i-1] == '('`, then `dp[i] = dp[i-2] + 2`
  - If `s[i-1] == ')'` and `s[i - dp[i-1] - 1] == '('`, then `dp[i] = dp[i-1] + 2 + dp[i - dp[i-1] - 2]`

The stack approach is generally easier to implement correctly in interviews.

## Optimal Solution

Here's the stack-based solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestValidParentheses(s: str) -> int:
    """
    Find the length of the longest valid parentheses substring.

    Approach: Use a stack to track indices of unmatched parentheses.
    We push -1 initially as a base reference point.

    Args:
        s: String containing only '(' and ')'

    Returns:
        Length of longest valid parentheses substring
    """
    max_len = 0
    stack = [-1]  # Initialize with -1 as base reference

    for i, char in enumerate(s):
        if char == '(':
            # Push index of '(' onto stack
            stack.append(i)
        else:  # char == ')'
            # Pop the top element (either matching '(' or base reference)
            stack.pop()

            if not stack:
                # Stack is empty, push current index as new base reference
                # This represents the position of an unmatched ')'
                stack.append(i)
            else:
                # Calculate length of valid parentheses ending at current position
                # stack[-1] is the index of last unmatched ')'
                current_len = i - stack[-1]
                max_len = max(max_len, current_len)

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
function longestValidParentheses(s) {
  /**
   * Find the length of the longest valid parentheses substring.
   *
   * Approach: Use a stack to track indices of unmatched parentheses.
   * We push -1 initially as a base reference point.
   *
   * @param {string} s - String containing only '(' and ')'
   * @return {number} Length of longest valid parentheses substring
   */
  let maxLen = 0;
  const stack = [-1]; // Initialize with -1 as base reference

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "(") {
      // Push index of '(' onto stack
      stack.push(i);
    } else {
      // char === ')'
      // Pop the top element (either matching '(' or base reference)
      stack.pop();

      if (stack.length === 0) {
        // Stack is empty, push current index as new base reference
        // This represents the position of an unmatched ')'
        stack.push(i);
      } else {
        // Calculate length of valid parentheses ending at current position
        // stack[stack.length - 1] is the index of last unmatched ')'
        const currentLen = i - stack[stack.length - 1];
        maxLen = Math.max(maxLen, currentLen);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
public int longestValidParentheses(String s) {
    /**
     * Find the length of the longest valid parentheses substring.
     *
     * Approach: Use a stack to track indices of unmatched parentheses.
     * We push -1 initially as a base reference point.
     *
     * @param s String containing only '(' and ')'
     * @return Length of longest valid parentheses substring
     */
    int maxLen = 0;
    Stack<Integer> stack = new Stack<>();
    stack.push(-1);  // Initialize with -1 as base reference

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        if (c == '(') {
            // Push index of '(' onto stack
            stack.push(i);
        } else {  // c == ')'
            // Pop the top element (either matching '(' or base reference)
            stack.pop();

            if (stack.isEmpty()) {
                // Stack is empty, push current index as new base reference
                // This represents the position of an unmatched ')'
                stack.push(i);
            } else {
                // Calculate length of valid parentheses ending at current position
                // stack.peek() is the index of last unmatched ')'
                int currentLen = i - stack.peek();
                maxLen = Math.max(maxLen, currentLen);
            }
        }
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing O(1) operations for each character
- Stack operations (push/pop) are O(1) amortized

**Space Complexity: O(n)**

- In the worst case (all `'('`), the stack will contain all n indices plus the initial `-1`
- Even with the DP approach, we'd need O(n) space for the dp array

## Common Mistakes

1. **Forgetting the initial `-1` in the stack**: Without this base reference, you can't correctly calculate lengths when valid substrings start at index 0. The `-1` represents an imaginary unmatched `')'` before the string starts.

2. **Not handling empty stack after pop**: After popping, if the stack becomes empty, you must push the current index as a new base reference. This current index represents an unmatched `')'` that breaks any future valid sequences.

3. **Confusing substring length with index arithmetic**: The length is `current_index - stack.peek()`, not `current_index - stack.peek() + 1`. This is because `stack.peek()` points to the index _before_ the valid substring starts.

4. **Trying to use a simple counter without stack**: A simple counter (increment for `'('`, decrement for `')'`) can tell you if a string is valid, but it can't find the _longest valid substring_ because unmatched parentheses in the middle break the sequence.

## When You'll See This Pattern

The stack-with-indices pattern appears in several parentheses and bracket validation problems:

1. **Valid Parentheses (Easy)**: Simpler version where you just check if the entire string is valid using a stack.

2. **Minimum Remove to Make Valid Parentheses (Medium)**: Similar stack approach to track unmatched parentheses, then remove them.

3. **Maximum Nesting Depth of Parentheses (Easy)**: Use a stack or counter to track current depth.

4. **Score of Parentheses (Medium)**: More complex stack-based calculation of scores based on nesting.

The core pattern is: **When you need to track matching pairs with potential nesting, and especially when you need positional information (indices), use a stack to store indices rather than just the characters.**

## Key Takeaways

1. **Stack with indices is powerful for substring problems**: When you need to find valid substrings (not just validate the whole string), storing indices in the stack lets you calculate substring lengths.

2. **Base references matter**: The initial `-1` in the stack is crucial. Think of it as an imaginary unmatched closing parenthesis before the string starts, which serves as the left boundary for the first valid substring.

3. **Break points reset the sequence**: Unmatched closing parentheses act as break points that reset the valid sequence. That's why we push their indices as new base references when the stack becomes empty.

Related problems: [Valid Parentheses](/problem/valid-parentheses)
