---
title: "How to Solve Remove Outermost Parentheses — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove Outermost Parentheses. Easy difficulty, 86.9% acceptance rate. Topics: String, Stack."
date: "2027-02-18"
category: "dsa-patterns"
tags: ["remove-outermost-parentheses", "string", "stack", "easy"]
---

# How to Solve Remove Outermost Parentheses

This problem asks us to remove the outermost parentheses from every primitive decomposition of a valid parentheses string. While the problem is labeled "Easy," it's tricky because you need to recognize when you're at the outermost level of parentheses without actually using a stack. The key insight is that valid parentheses strings have a balanced structure, and we can track our "depth" in the parentheses nesting to identify which parentheses to keep.

## Visual Walkthrough

Let's trace through an example: `s = "(()())(())"`

We'll track two things:

1. **Current depth**: How many open parentheses we've seen that haven't been closed yet
2. **Result string**: The parentheses we keep after removing outermost ones

**Step-by-step process:**

```
s = " (  (  )  (  )  )  (  (  )  )  "
     0  1  2  3  4  5  6  7  8  9  10
```

Initialize: depth = 0, result = ""

1. `s[0] = '('` → depth = 1 (first '(' of primitive)
   - Depth is 1, so this is outermost → skip

2. `s[1] = '('` → depth = 2
   - Depth > 1, so this is inner → add to result: "("

3. `s[2] = ')'` → depth = 1
   - Depth > 0, so this closes an inner '(' → add to result: "()"

4. `s[3] = '('` → depth = 2
   - Depth > 1 → add to result: "()("

5. `s[4] = ')'` → depth = 1
   - Depth > 0 → add to result: "()()"

6. `s[5] = ')'` → depth = 0
   - Depth is 0, so this is outermost closing ')' → skip
   - We've completed first primitive: "(()())" → kept "()()"

7. `s[6] = '('` → depth = 1
   - Depth is 1 → skip (outermost '(' of second primitive)

8. `s[7] = '('` → depth = 2
   - Depth > 1 → add to result: "()()("

9. `s[8] = ')'` → depth = 1
   - Depth > 0 → add to result: "()()()"

10. `s[9] = ')'` → depth = 0
    - Depth is 0 → skip (outermost ')' of second primitive)

Final result: `"()()()"`

Notice the pattern: We only add parentheses when depth > 1 for '(' or depth > 0 for ')'. This ensures we skip the outermost parentheses of each primitive.

## Brute Force Approach

A naive approach might be to:

1. Find all primitive decompositions by scanning for when depth returns to 0
2. For each primitive, remove the first and last character
3. Concatenate all results

While this works, it requires multiple passes and extra storage. More importantly, it misses the key insight that we can process the string in a single pass by tracking depth. Some candidates might try to use a stack to track parentheses, but that's overkill since we only need the count of open parentheses, not their positions.

The brute force would look like this:

```python
def removeOuterParentheses_brute(s):
    result = []
    current = []
    depth = 0

    for char in s:
        current.append(char)
        if char == '(':
            depth += 1
        else:
            depth -= 1

        if depth == 0:
            # Remove first and last char (outer parentheses)
            if len(current) > 2:
                result.extend(current[1:-1])
            current = []

    return ''.join(result)
```

This approach works but uses extra space for `current` and requires checking when to flush it. The optimal solution simplifies this by building the result directly.

## Optimal Solution

The optimal solution processes the string in one pass using a depth counter. We add a parenthesis to our result only when it's not part of the outermost layer of the current primitive.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string
def removeOuterParentheses(s):
    """
    Removes the outermost parentheses from each primitive in the string.

    Approach:
    1. Track current depth (number of unmatched '(')
    2. When we see '(':
        - If depth > 0, this '(' is not outermost → add to result
        - Increment depth
    3. When we see ')':
        - Decrement depth first (since we're closing a '(')
        - If depth > 0, this ')' is not outermost → add to result

    Example: "(()())(())" → "()()()"
    """
    result = []
    depth = 0

    for char in s:
        if char == '(':
            # Only add '(' if it's not the outermost one
            if depth > 0:
                result.append(char)
            depth += 1
        else:  # char == ')'
            depth -= 1
            # Only add ')' if it's not closing the outermost '('
            if depth > 0:
                result.append(char)

    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n) for the result string
function removeOuterParentheses(s) {
  /**
   * Removes the outermost parentheses from each primitive in the string.
   *
   * Approach:
   * 1. Track current depth (number of unmatched '(')
   * 2. When we see '(':
   *    - If depth > 0, this '(' is not outermost → add to result
   *    - Increment depth
   * 3. When we see ')':
   *    - Decrement depth first (since we're closing a '(')
   *    - If depth > 0, this ')' is not outermost → add to result
   *
   * Example: "(()())(())" → "()()()"
   */
  let result = [];
  let depth = 0;

  for (let char of s) {
    if (char === "(") {
      // Only add '(' if it's not the outermost one
      if (depth > 0) {
        result.push(char);
      }
      depth++;
    } else {
      // char === ')'
      depth--;
      // Only add ')' if it's not closing the outermost '('
      if (depth > 0) {
        result.push(char);
      }
    }
  }

  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the result string
class Solution {
    public String removeOuterParentheses(String s) {
        /**
         * Removes the outermost parentheses from each primitive in the string.
         *
         * Approach:
         * 1. Track current depth (number of unmatched '(')
         * 2. When we see '(':
         *    - If depth > 0, this '(' is not outermost → add to result
         *    - Increment depth
         * 3. When we see ')':
         *    - Decrement depth first (since we're closing a '(')
         *    - If depth > 0, this ')' is not outermost → add to result
         *
         * Example: "(()())(())" → "()()()"
         */
        StringBuilder result = new StringBuilder();
        int depth = 0;

        for (char c : s.toCharArray()) {
            if (c == '(') {
                // Only add '(' if it's not the outermost one
                if (depth > 0) {
                    result.append(c);
                }
                depth++;
            } else {  // c == ')'
                depth--;
                // Only add ')' if it's not closing the outermost '('
                if (depth > 0) {
                    result.append(c);
                }
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing O(1) operations for each character
- The number of operations is proportional to the length of the input string

**Space Complexity: O(n)**

- We need to store the result string, which in the worst case could be nearly as long as the input (when all parentheses are inner)
- The depth counter uses O(1) additional space
- Using a StringBuilder/array to build the result is more efficient than string concatenation in a loop

## Common Mistakes

1. **Incorrect depth tracking order for ')'**:
   - Mistake: Adding ')' to result before decrementing depth
   - Why it's wrong: When depth is 1 and we see ')', this is closing the outermost '('. If we check `depth > 0` before decrementing, we'd add it to the result
   - Fix: Always decrement depth first when processing ')', then check if `depth > 0`

2. **Using a stack unnecessarily**:
   - Mistake: Pushing '(' to a stack and popping for ')'
   - Why it's wrong: We only need to know how many open parentheses we have, not their positions. A stack uses more memory and is more complex
   - Fix: Use a simple integer counter for depth

3. **Not handling empty string or single primitive**:
   - Mistake: Assuming the string has multiple primitives or is non-empty
   - Why it's wrong: Input could be "()" which should return ""
   - Fix: The algorithm naturally handles this because when s="()", depth goes 0→1→0 and no parentheses are added to result

4. **String concatenation in a loop**:
   - Mistake: Using `result += char` in a loop (especially in Java/Python)
   - Why it's wrong: Strings are immutable, so each concatenation creates a new string → O(n²) time
   - Fix: Use StringBuilder (Java), list (Python), or array (JavaScript) to build the result

## When You'll See This Pattern

This "depth tracking" or "balance counter" pattern appears in many parentheses and bracket problems:

1. **Valid Parentheses (LeetCode #20)**: Similar depth tracking but needs to handle different bracket types
2. **Minimum Add to Make Parentheses Valid (LeetCode #921)**: Tracks unmatched parentheses count
3. **Score of Parentheses (LeetCode #856)**: Uses depth to calculate scores based on nesting level
4. **Maximum Nesting Depth of Parentheses (LeetCode #1614)**: Literally asks for the maximum depth, which is what we're tracking here

The core idea is that for valid parentheses strings, you can replace a stack with a simple counter when you only need to know the nesting depth, not the specific matching pairs.

## Key Takeaways

1. **Depth over stack**: When working with valid parentheses and you only need nesting level (not specific pair matching), a simple integer counter is more efficient than a stack
2. **Process as you go**: You can often build the result incrementally while scanning, without needing to store intermediate substrings
3. **Order matters**: Pay attention to whether you increment/decrement before or after checking conditions—this is often the difference between correct and incorrect solutions

[Practice this problem on CodeJeet](/problem/remove-outermost-parentheses)
