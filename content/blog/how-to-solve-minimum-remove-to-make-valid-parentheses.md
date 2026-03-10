---
title: "How to Solve Minimum Remove to Make Valid Parentheses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Remove to Make Valid Parentheses. Medium difficulty, 71.3% acceptance rate. Topics: String, Stack."
date: "2026-10-09"
category: "dsa-patterns"
tags: ["minimum-remove-to-make-valid-parentheses", "string", "stack", "medium"]
---

# How to Solve Minimum Remove to Make Valid Parentheses

This problem asks us to remove the minimum number of parentheses from a string containing `'('`, `')'`, and lowercase letters, making the parentheses valid while keeping all letters. The tricky part is that we need to identify which specific parentheses to remove, not just count how many are invalid. We must return any valid string with minimal removals.

## Visual Walkthrough

Let's trace through `s = "a)b(c)d"`:

1. **First pass (left to right, tracking unmatched '('):**
   - `'a'` → letter, keep
   - `')'` → no unmatched '(' before it → mark for removal
   - `'b'` → letter, keep
   - `'('` → add to unmatched stack
   - `'c'` → letter, keep
   - `')'` → matches with '(' in stack → pop from stack
   - `'d'` → letter, keep

   After this pass: We've marked the first `')'` for removal. Stack is empty.

2. **Second pass (right to left, handling extra '('):**
   - No extra '(' remain since stack is empty.

3. **Build result:** Skip the marked `')'`, keep everything else → `"ab(c)d"`

Another example: `s = "))(("`

- First pass: Both `')'` get marked (no '(' to match). Stack ends with `['(', '(']`
- Second pass: Both remaining `'('` get marked (no ')' to match)
- Result: `""` (empty string, valid)

## Brute Force Approach

A naive approach would try all possible subsets of parentheses to remove:

1. Generate all possible strings by removing 0, 1, 2, ... parentheses
2. Check each candidate for validity
3. Return the first valid one with minimal removals

This is exponential time (O(2ⁿ) where n is string length) and completely impractical. Even for small strings, checking validity for every subset is too slow.

What candidates might try: Some think about counting parentheses and removing extras from one side, but this fails with interleaved invalid parentheses like `")("`. Simply counting doesn't tell us which specific ones to remove.

## Optimized Approach

The key insight: **We can identify invalid parentheses in two passes using a stack or counter.**

**Step-by-step reasoning:**

1. **First pass (left to right):** Track unmatched `'('` using a stack of indices. When we see `')'`:
   - If stack has `'('`, it's a valid pair → pop from stack
   - If stack is empty, this `')'` has no matching `'('` before it → mark for removal

   This handles all invalid `')'` (closing without opening).

2. **Second pass:** After the first pass, any `'('` remaining in the stack are unmatched (no `')'` after them) → mark all for removal.

3. **Build result:** Create new string excluding all marked indices.

**Why this works:** Parentheses must be properly nested and balanced. By tracking indices in a stack, we pair matching parentheses and identify which ones can't be paired. The minimal removal comes from only removing the unpaired ones.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minRemoveToMakeValid(s: str) -> str:
    """
    Removes minimum parentheses to make string valid.

    Approach:
    1. First pass: Identify invalid ')' using stack
    2. Second pass: Identify remaining invalid '('
    3. Build result excluding marked indices
    """
    # Convert to list for O(1) index access
    s_list = list(s)

    # Stack to track indices of '('
    stack = []

    # First pass: Mark invalid ')'
    for i, char in enumerate(s_list):
        if char == '(':
            # Store index of '(' for potential matching
            stack.append(i)
        elif char == ')':
            if stack:
                # Valid pair found, pop matching '('
                stack.pop()
            else:
                # No '(' to match this ')', mark for removal
                s_list[i] = ''

    # Second pass: Mark remaining invalid '('
    # Any '(' left in stack had no matching ')'
    for i in stack:
        s_list[i] = ''

    # Join remaining characters (empty strings are skipped)
    return ''.join(s_list)
```

```javascript
// Time: O(n) | Space: O(n)
function minRemoveToMakeValid(s) {
  /**
   * Removes minimum parentheses to make string valid.
   *
   * Approach:
   * 1. First pass: Identify invalid ')' using stack
   * 2. Second pass: Identify remaining invalid '('
   * 3. Build result excluding marked indices
   */

  // Convert to array for O(1) index access
  const sArray = s.split("");

  // Stack to track indices of '('
  const stack = [];

  // First pass: Mark invalid ')'
  for (let i = 0; i < sArray.length; i++) {
    const char = sArray[i];
    if (char === "(") {
      // Store index of '(' for potential matching
      stack.push(i);
    } else if (char === ")") {
      if (stack.length > 0) {
        // Valid pair found, pop matching '('
        stack.pop();
      } else {
        // No '(' to match this ')', mark for removal
        sArray[i] = "";
      }
    }
  }

  // Second pass: Mark remaining invalid '('
  // Any '(' left in stack had no matching ')'
  while (stack.length > 0) {
    const i = stack.pop();
    sArray[i] = "";
  }

  // Join remaining characters (empty strings are skipped)
  return sArray.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String minRemoveToMakeValid(String s) {
        /**
         * Removes minimum parentheses to make string valid.
         *
         * Approach:
         * 1. First pass: Identify invalid ')' using stack
         * 2. Second pass: Identify remaining invalid '('
         * 3. Build result excluding marked indices
         */

        // Convert to array for O(1) index access
        char[] chars = s.toCharArray();

        // Stack to track indices of '('
        Stack<Integer> stack = new Stack<>();

        // First pass: Mark invalid ')'
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];
            if (c == '(') {
                // Store index of '(' for potential matching
                stack.push(i);
            } else if (c == ')') {
                if (!stack.isEmpty()) {
                    // Valid pair found, pop matching '('
                    stack.pop();
                } else {
                    // No '(' to match this ')', mark for removal
                    chars[i] = '#';  // Using '#' as removal marker
                }
            }
        }

        // Second pass: Mark remaining invalid '('
        // Any '(' left in stack had no matching ')'
        while (!stack.isEmpty()) {
            int i = stack.pop();
            chars[i] = '#';
        }

        // Build result string, skipping marked characters
        StringBuilder result = new StringBuilder();
        for (char c : chars) {
            if (c != '#') {
                result.append(c);
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- First pass: O(n) to iterate through string
- Second pass: O(k) where k ≤ n (only processes unmatched '(')
- Building result: O(n) to join/append
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- Stack: O(n) in worst case (all '(')
- String/array storage: O(n) for the converted string
- In Python/JavaScript: Additional O(n) for list/array
- In Java: O(n) for char array and StringBuilder

## Common Mistakes

1. **Only counting, not tracking indices:** Simply counting '(' and ')' tells you how many to remove, but not which specific ones. For `")("`, you need to remove both, not one from each side.

2. **Forgetting to handle letters:** Some candidates filter out letters first, but we must preserve all letters. The solution handles this naturally by only modifying '(' and ')'.

3. **Incorrect stack usage:** Using stack to store characters instead of indices makes it hard to mark positions for removal. Storing indices is crucial.

4. **Not marking for removal during iteration:** If you try to remove characters while iterating, indices shift. Better to mark (with empty string or special char) and filter later.

## When You'll See This Pattern

This two-pass stack-based approach appears in many parenthesis/balance problems:

1. **Valid Parentheses (Easy):** Similar stack logic but simpler - just check if stack is empty at the end.

2. **Minimum Add to Make Parentheses Valid (Medium):** Count unmatched '(' and ')' instead of removing them.

3. **Longest Valid Parentheses (Hard):** Uses similar tracking but finds maximum length substring.

4. **Check If a Parentheses String Can Be Valid (Medium):** Adds wildcards that can be either '(' or ')', requiring more complex validation.

The pattern: **When you need to match pairs with ordering constraints (like parentheses), think about using a stack to track unmatched opening elements.**

## Key Takeaways

- **Stack for pairing problems:** When elements must be matched in LIFO order (last opened, first closed), a stack is the natural data structure.

- **Two-pass identification:** Invalid parentheses come in two types: closing without opening (caught in first pass) and opening without closing (caught in second pass).

- **Mark, don't delete immediately:** When removing from a sequence during iteration, mark elements for removal first, then filter to avoid index shifting issues.

Related problems: [Minimum Number of Swaps to Make the String Balanced](/problem/minimum-number-of-swaps-to-make-the-string-balanced), [Check if a Parentheses String Can Be Valid](/problem/check-if-a-parentheses-string-can-be-valid)
