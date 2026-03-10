---
title: "How to Solve Score of Parentheses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Score of Parentheses. Medium difficulty, 63.6% acceptance rate. Topics: String, Stack."
date: "2028-07-28"
category: "dsa-patterns"
tags: ["score-of-parentheses", "string", "stack", "medium"]
---

# How to Solve Score of Parentheses

This problem asks us to compute a "score" for a balanced parentheses string based on specific rules: `"()"` scores 1, concatenated strings add their scores, and nested parentheses double the inner score. The challenge lies in correctly handling both nesting depth and concatenation while parsing the string efficiently.

## Visual Walkthrough

Let's trace through `"(()(()))"` step by step to build intuition:

1. **String**: `( ( ) ( ( ) ) )`
2. **Process mentally**:
   - The outermost parentheses contain two concatenated parts: `( )` and `( ( ) )`
   - `( )` scores 1
   - `( ( ) )` contains `( )` inside, so it scores 2 × 1 = 2
   - Total score = 1 + 2 = 3

But how do we compute this systematically? Let's use a stack approach:

**Stack-based visualization**:

- Start with stack = [0] (base score)
- Process `(`: push 0 → stack = [0, 0]
- Process `(`: push 0 → stack = [0, 0, 0]
- Process `)`: pop 0, top becomes 0 + max(2×0, 1) = 1 → stack = [0, 1]
- Process `(`: push 0 → stack = [0, 1, 0]
- Process `(`: push 0 → stack = [0, 1, 0, 0]
- Process `)`: pop 0, top becomes 0 + max(2×0, 1) = 1 → stack = [0, 1, 1]
- Process `)`: pop 1, top becomes 1 + 2×1 = 3 → stack = [0, 3]
- Process `)`: pop 3, top becomes 0 + 2×3 = 6 → stack = [6]

Final score = 6? Wait, that's different from our mental calculation! Let's check the rules again.

Actually, `"(()(()))"` = `(A)` where A = `()(())`

- A = `()` + `(())` = 1 + (2×1) = 1 + 2 = 3
- Outer parentheses double this: 2 × 3 = 6

So our stack approach was correct! The key insight is that when we see `()`, we add 1 to the current depth's score, but when we close a group, we multiply the inner score by 2 and add it to the parent's score.

## Brute Force Approach

A naive approach might try to recursively parse the string:

1. Find matching parentheses pairs
2. Recursively compute scores for inner strings
3. Apply the doubling rule for nested parentheses

The brute force would involve:

- Scanning to find balanced substrings
- Making recursive calls for each substring
- Handling concatenation by summing results

**Why this is inefficient**:

- Finding matching parentheses requires O(n) scanning for each recursive call
- Worst-case scenario (deeply nested parentheses) leads to O(n²) time
- The implementation becomes complex with many edge cases
- We're essentially re-parsing the same structure multiple times

While this brute force could work for small inputs, it's not optimal and demonstrates poor understanding of stack-based parsing.

## Optimized Approach

The key insight is that we can compute the score in a **single pass** using a stack to track scores at different nesting depths.

**Step-by-step reasoning**:

1. **Stack tracks scores per depth level**: Each entry represents the cumulative score at that nesting level.
2. **Initialize with 0**: We start with a score of 0 for the outermost level.
3. **Opening parenthesis `(`**: Push a new 0 onto the stack, representing a new nesting level.
4. **Closing parenthesis `)`**: This is where the magic happens:
   - Pop the current level's score
   - If the popped score is 0, we just closed a `()` pair → add 1 to the new top
   - If the popped score is > 0, we closed a nested group → add 2 × score to the new top
5. **Final answer**: After processing all characters, the stack contains one value: the total score.

**Why this works**:

- The stack naturally handles nesting depth
- When we see `()`, we recognize it as a base case worth 1
- When we close a group, we correctly apply the doubling rule
- Concatenation is handled automatically because we add scores to the same depth level

## Optimal Solution

Here's the complete implementation using a stack:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def scoreOfParentheses(s: str) -> int:
    """
    Calculate score of balanced parentheses string using stack.

    The stack tracks scores at different nesting levels.
    Each '(' pushes a new level (score 0).
    Each ')' pops the current level and updates the parent level.
    """
    stack = [0]  # Start with score 0 for outermost level

    for char in s:
        if char == '(':
            # New nesting level starts with score 0
            stack.append(0)
        else:  # char == ')'
            # Close current level
            current_score = stack.pop()

            # Update parent level:
            # - If current_score == 0: we just closed "()" → add 1
            # - Otherwise: we closed "(A)" → add 2 * current_score
            parent_score = stack[-1]
            stack[-1] = parent_score + max(2 * current_score, 1)

    # Final score is the only value left in stack
    return stack[0]
```

```javascript
// Time: O(n) | Space: O(n)
function scoreOfParentheses(s) {
  /**
   * Calculate score of balanced parentheses string using stack.
   *
   * The stack tracks scores at different nesting levels.
   * Each '(' pushes a new level (score 0).
   * Each ')' pops the current level and updates the parent level.
   */
  const stack = [0]; // Start with score 0 for outermost level

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "(") {
      // New nesting level starts with score 0
      stack.push(0);
    } else {
      // char === ')'
      // Close current level
      const currentScore = stack.pop();

      // Update parent level:
      // - If currentScore === 0: we just closed "()" → add 1
      // - Otherwise: we closed "(A)" → add 2 * currentScore
      const parentScore = stack[stack.length - 1];
      stack[stack.length - 1] = parentScore + Math.max(2 * currentScore, 1);
    }
  }

  // Final score is the only value left in stack
  return stack[0];
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int scoreOfParentheses(String s) {
        /**
         * Calculate score of balanced parentheses string using stack.
         *
         * The stack tracks scores at different nesting levels.
         * Each '(' pushes a new level (score 0).
         * Each ')' pops the current level and updates the parent level.
         */
        Stack<Integer> stack = new Stack<>();
        stack.push(0);  // Start with score 0 for outermost level

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (c == '(') {
                // New nesting level starts with score 0
                stack.push(0);
            } else {  // c == ')'
                // Close current level
                int currentScore = stack.pop();

                // Update parent level:
                // - If currentScore == 0: we just closed "()" → add 1
                // - Otherwise: we closed "(A)" → add 2 * currentScore
                int parentScore = stack.pop();
                stack.push(parentScore + Math.max(2 * currentScore, 1));
            }
        }

        // Final score is the only value left in stack
        return stack.peek();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We process each character exactly once
- Each character performs O(1) stack operations (push or pop)
- No nested loops or recursion

**Space Complexity**: O(n)

- In the worst case (all opening parentheses followed by all closing), the stack grows to size n/2 + 1
- This simplifies to O(n) linear space
- Example: `"((((...))))"` with n parentheses

## Common Mistakes

1. **Forgetting to handle concatenation correctly**: Some candidates try to multiply scores when they shouldn't. Remember: `(A)(B)` scores A + B, not A × B. The stack approach handles this automatically by adding to the current depth level.

2. **Incorrect base case handling**: When popping a score of 0, we need to add 1 (for `"()"`), not 0. The expression `max(2 * current_score, 1)` elegantly handles both cases: if current_score is 0, we get 1; if it's positive, we get 2×current_score.

3. **Off-by-one errors with stack indices**: Always initialize the stack with `[0]` before processing. If you start with an empty stack, you'll get index errors when trying to update the parent score after the first closing parenthesis.

4. **Misunderstanding the doubling rule**: The rule says `(A)` scores 2 × A, where A is the score of the inner string. This doesn't mean we multiply the entire accumulated score by 2—only the score of the immediately inner group.

## When You'll See This Pattern

This parentheses scoring problem teaches a **stack-based parsing** pattern that appears in many other problems:

1. **Valid Parentheses (LeetCode #20)**: Similar stack-based validation, but simpler—just checking for matching pairs without scoring.

2. **Decode String (LeetCode #394)**: Uses a stack to handle nested structures with repetition counts, similar to how we handle nested scores here.

3. **Basic Calculator (LeetCode #224)**: More complex expression evaluation but uses similar depth-tracking concepts.

4. **Remove Outermost Parentheses (LeetCode #1021)**: Tracks nesting depth to identify outermost parentheses.

The common thread is using a stack to track state at different nesting levels when processing structured strings.

## Key Takeaways

1. **Stacks naturally handle nested structures**: When you see parentheses, brackets, or other paired delimiters with nesting, think "stack." The stack depth corresponds to nesting depth.

2. **Track intermediate results per depth level**: Instead of trying to compute everything at once, maintain partial results at each nesting level and combine them as you close groups.

3. **Look for opportunities to combine base cases**: The expression `max(2 * score, 1)` elegantly combines two rules: `"()" = 1` and `(A) = 2 × A`. Look for similar simplifications in other problems.

[Practice this problem on CodeJeet](/problem/score-of-parentheses)
