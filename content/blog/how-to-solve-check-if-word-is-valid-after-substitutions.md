---
title: "How to Solve Check If Word Is Valid After Substitutions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check If Word Is Valid After Substitutions. Medium difficulty, 61.1% acceptance rate. Topics: String, Stack."
date: "2027-10-08"
category: "dsa-patterns"
tags: ["check-if-word-is-valid-after-substitutions", "string", "stack", "medium"]
---

# How to Solve "Check If Word Is Valid After Substitutions"

This problem asks us to determine if a given string `s` can be formed by repeatedly inserting the substring `"abc"` into an initially empty string. The challenge lies in verifying that the string follows this specific construction rule, which is more complex than simple bracket matching because we're dealing with a three-character sequence rather than paired symbols.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "abcabcababcc"`.

**Step-by-step validation:**

1. Start scanning from left to right
2. When we see `"abc"`, we can think of it as a complete insertion that can be removed
3. Removing `"abc"` gives us: `"abcababcc"` → remove first `"abc"` → `"ababcc"`
4. Continue: `"ababcc"` → no `"abc"` at the beginning, but notice `"aba"` isn't valid
5. Actually, let's think differently: Whenever we find `"abc"` as a substring, we can remove it because it represents a valid insertion
6. `"abcabcababcc"` → remove first `"abc"`: `"abcababcc"`
7. Remove next `"abc"`: `"ababcc"`
8. Now we have `"ababcc"` → we can remove `"abc"` starting at index 2: `"abcc"`
9. Remove `"abc"` starting at index 1: `"c"` → not empty, so invalid

Wait, that approach seems messy. Let's try a better way: Use a stack to track characters!

**Stack approach:**

1. Push characters onto stack
2. Whenever the top 3 elements are `'c'`, `'b'`, `'a'` (in that order from top to bottom), pop them
3. If the stack is empty at the end, the string is valid

For `s = "aabcbc"`:

- Push 'a': stack = ['a']
- Push 'a': stack = ['a', 'a']
- Push 'b': stack = ['a', 'a', 'b']
- Push 'c': stack = ['a', 'a', 'b', 'c']
- Top 3 are 'c', 'b', 'a' → pop 3: stack = ['a']
- Push 'b': stack = ['a', 'b']
- Push 'c': stack = ['a', 'b', 'c']
- Top 3 are 'c', 'b', 'a' → pop 3: stack = []
- Stack empty → valid!

## Brute Force Approach

A naive approach would be to repeatedly search for `"abc"` substrings and remove them until we either get an empty string or can't find any more `"abc"` substrings.

**Why this is inefficient:**

- Each removal requires shifting characters, which is O(n) per operation
- In the worst case (like `"abcabcabc..."`), we'd do O(n) removals
- Total time complexity: O(n²)
- Space complexity: O(n) for creating new strings

**What makes this insufficient:**
The brute force doesn't scale well for large inputs (n up to 2×10⁴). We need an approach that processes each character at most once.

## Optimized Approach

The key insight is recognizing this as a **stack validation problem** similar to Valid Parentheses, but with three-character sequences instead of pairs.

**Step-by-step reasoning:**

1. We need to verify that `s` can be built by inserting `"abc"` sequences
2. Think backwards: If we built the string by inserting `"abc"`, then removing `"abc"` sequences should leave us with an empty string
3. However, we can't just remove any `"abc"` substring—we need to remove them in the reverse order of insertion
4. This is exactly what a stack helps us track! When we see `'c'`, we check if the previous two characters were `'b'` then `'a'`
5. If yes, we've found a complete `"abc"` that can be "removed" (by popping from stack)
6. If no, we continue building the stack
7. At the end, if the stack is empty, all `"abc"` sequences were properly matched

**Why a stack works:**

- The stack naturally handles nested `"abc"` sequences (like `"aabcbc"` which is `"a[abc]bc"`)
- It processes the string in one pass (O(n) time)
- It uses O(n) space in the worst case

## Optimal Solution

Here's the stack-based solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# We process each character once, and the stack can grow up to n elements
def isValid(s: str) -> bool:
    # Use a list as a stack to track characters
    stack = []

    # Iterate through each character in the string
    for char in s:
        # Push current character onto stack
        stack.append(char)

        # Check if the last 3 characters form "abc"
        # We need to check from the end: 'c' is most recent, then 'b', then 'a'
        if len(stack) >= 3 and stack[-1] == 'c' and stack[-2] == 'b' and stack[-3] == 'a':
            # Found a complete "abc" sequence, remove it from stack
            # This simulates "undoing" the insertion of this "abc"
            stack.pop()  # Remove 'c'
            stack.pop()  # Remove 'b'
            stack.pop()  # Remove 'a'

    # If stack is empty, all "abc" sequences were properly matched
    # If not empty, there are unmatched characters
    return len(stack) == 0
```

```javascript
// Time: O(n) | Space: O(n)
// We process each character once, and the stack can grow up to n elements
function isValid(s) {
  // Use an array as a stack to track characters
  const stack = [];

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // Push current character onto stack
    stack.push(char);

    // Check if the last 3 characters form "abc"
    // We need to check from the end: 'c' is most recent, then 'b', then 'a'
    if (
      stack.length >= 3 &&
      stack[stack.length - 1] === "c" &&
      stack[stack.length - 2] === "b" &&
      stack[stack.length - 3] === "a"
    ) {
      // Found a complete "abc" sequence, remove it from stack
      // This simulates "undoing" the insertion of this "abc"
      stack.pop(); // Remove 'c'
      stack.pop(); // Remove 'b'
      stack.pop(); // Remove 'a'
    }
  }

  // If stack is empty, all "abc" sequences were properly matched
  // If not empty, there are unmatched characters
  return stack.length === 0;
}
```

```java
// Time: O(n) | Space: O(n)
// We process each character once, and the stack can grow up to n elements
public boolean isValid(String s) {
    // Use a StringBuilder or ArrayList as a stack
    // StringBuilder is more efficient for this use case
    StringBuilder stack = new StringBuilder();

    // Iterate through each character in the string
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        // Append current character to stack
        stack.append(c);

        // Check if the last 3 characters form "abc"
        int len = stack.length();
        if (len >= 3 &&
            stack.charAt(len - 1) == 'c' &&
            stack.charAt(len - 2) == 'b' &&
            stack.charAt(len - 3) == 'a') {
            // Found a complete "abc" sequence, remove it from stack
            // Delete the last 3 characters (simulates popping 3 times)
            stack.delete(len - 3, len);
        }
    }

    // If stack is empty, all "abc" sequences were properly matched
    // If not empty, there are unmatched characters
    return stack.length() == 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, processing each character exactly once
- Each character is pushed onto the stack once
- Each character is popped from the stack at most once (when we find "abc")
- The check for "abc" at the top of the stack is O(1) since we're checking fixed indices

**Space Complexity: O(n)**

- In the worst case, if the string has no valid "abc" sequences (like "aaaabbbbcccc"), all characters remain in the stack
- The stack can grow to size n in the worst case
- Even with optimal strings, we need O(n) space during processing

## Common Mistakes

1. **Not checking stack size before accessing indices**: Attempting to check `stack[-3]` when the stack has fewer than 3 elements will cause an index error. Always check `len(stack) >= 3` first.

2. **Wrong order when checking for "abc"**: Remember that the stack grows from left to right, so the most recent character is at the end. The sequence should be checked as `'c'` (most recent), then `'b'`, then `'a'` (least recent of the three).

3. **Using string replacement in a loop**: Some candidates try `while "abc" in s: s = s.replace("abc", "")`. This is O(n²) in the worst case because:
   - `"abc" in s` is O(n)
   - `replace()` creates a new string, which is O(n)
   - This runs in a loop, making it O(n²)

4. **Forgetting that "abc" must be contiguous in the stack**: The solution relies on "abc" appearing as consecutive elements at the top of the stack. If you try to match non-contiguous characters, you'll get incorrect results.

## When You'll See This Pattern

This problem uses a **stack-based validation pattern** that appears in many string processing problems:

1. **Valid Parentheses (LeetCode 20)**: The classic stack problem where you match opening and closing brackets. This is simpler because it uses pairs instead of triplets.

2. **Remove All Adjacent Duplicates In String (LeetCode 1047)**: Similar stack-based removal of adjacent matching characters, though here it's duplicates rather than specific sequences.

3. **Decode String (LeetCode 394)**: Uses stacks to handle nested structures and repetitions, which is a more complex version of pattern matching.

The core pattern is: **When you need to validate or process nested or sequential patterns in a string, and the validation depends on the most recent elements, consider using a stack.**

## Key Takeaways

1. **Stack for pattern validation**: When you need to check if a string follows specific construction rules (especially with nested or sequential patterns), a stack helps track the most recent elements and validate them against rules.

2. **Think backwards from construction to validation**: If a string is built by adding specific patterns, then removing those patterns in reverse order should leave an empty string. A stack naturally implements this "removal in reverse order" process.

3. **Fixed-size pattern checking is efficient**: Checking the last k elements of a stack is O(1) when k is fixed (like 3 for "abc"). This makes the solution linear time.

Related problems: [Valid Parentheses](/problem/valid-parentheses)
