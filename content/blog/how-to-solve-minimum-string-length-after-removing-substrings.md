---
title: "How to Solve Minimum String Length After Removing Substrings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum String Length After Removing Substrings. Easy difficulty, 77.1% acceptance rate. Topics: String, Stack, Simulation."
date: "2028-05-22"
category: "dsa-patterns"
tags: ["minimum-string-length-after-removing-substrings", "string", "stack", "simulation", "easy"]
---

# How to Solve Minimum String Length After Removing Substrings

This problem asks us to repeatedly remove occurrences of "AB" or "CD" from a string until no more can be removed, then return the minimum possible length. What makes this interesting is that removals can create new adjacent pairs that weren't there before — for example, removing "AB" from "CABD" leaves "CD", which can then be removed. This cascading effect means we can't just scan once and remove all matches; we need to handle the chain reactions properly.

## Visual Walkthrough

Let's trace through an example: `s = "CABABD"`

**Step 1:** Start with "CABABD"

- Look for "AB" or "CD" from left to right
- Find "AB" at positions 1-2 (0-indexed: "CA**AB**ABD")
- Remove it: "C" + "" + "ABD" = "CABD"

**Step 2:** Now we have "CABD"

- Look for "AB" or "CD" again
- Find "AB" at positions 1-2 ("C**AB**D")
- Remove it: "C" + "" + "D" = "CD"

**Step 3:** Now we have "CD"

- Look for "AB" or "CD" again
- Find "CD" at positions 0-1 ("**CD**")
- Remove it: "" = ""

**Result:** Empty string, length 0

Notice how each removal created new adjacent characters that could form removable pairs. This is why we need to process the string carefully — a simple one-pass removal won't work because removing "AB" from "CABABD" at position 1-2 leaves "CABD", which has "AB" at a different position than we initially saw.

## Brute Force Approach

The most straightforward approach would be to repeatedly scan the entire string, find the first occurrence of "AB" or "CD", remove it, and repeat until no more removals are possible.

```python
def minLength_brute(s: str) -> int:
    while True:
        found = False
        # Check for "AB"
        idx = s.find("AB")
        if idx != -1:
            s = s[:idx] + s[idx+2:]
            found = True

        # Check for "CD"
        idx = s.find("CD")
        if idx != -1:
            s = s[:idx] + s[idx+2:]
            found = True

        if not found:
            break
    return len(s)
```

**Why this is inefficient:**

- Each removal creates a new string (O(n) time for string slicing)
- We might scan the entire string O(n) times
- Worst case: O(n²) time complexity for strings like "ABABABAB..."
- Space: O(n) for new strings

The brute force works but is too slow for large inputs. We need a more efficient way to handle the cascading removals.

## Optimal Solution

The key insight is that this is essentially a **stack problem**. When we process characters left to right, we need to check if the current character forms "AB" or "CD" with the top of the stack. If it does, we pop from the stack (effectively removing the pair). Otherwise, we push the character onto the stack.

Think of it like matching parentheses: 'A' and 'B' are like opening and closing brackets, as are 'C' and 'D'. The stack naturally handles the cascading effect because when we remove a pair, the character before it becomes the new "top" and might form a removable pair with the next character.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minLength(s: str) -> int:
    """
    Returns the minimum length after removing all "AB" and "CD" substrings.
    Uses a stack to efficiently handle cascading removals.
    """
    stack = []

    # Process each character in the string
    for char in s:
        # If stack is empty, just push the character
        if not stack:
            stack.append(char)
            continue

        # Get the top character from the stack
        top = stack[-1]

        # Check if current char and top form "AB" or "CD"
        if (top == 'A' and char == 'B') or (top == 'C' and char == 'D'):
            # They form a removable pair, so pop the top
            stack.pop()
        else:
            # Not a removable pair, push current char
            stack.append(char)

    # The stack contains all characters that couldn't be removed
    return len(stack)
```

```javascript
// Time: O(n) | Space: O(n)
function minLength(s) {
  /**
   * Returns the minimum length after removing all "AB" and "CD" substrings.
   * Uses a stack to efficiently handle cascading removals.
   */
  const stack = [];

  // Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // If stack is empty, just push the character
    if (stack.length === 0) {
      stack.push(char);
      continue;
    }

    // Get the top character from the stack
    const top = stack[stack.length - 1];

    // Check if current char and top form "AB" or "CD"
    if ((top === "A" && char === "B") || (top === "C" && char === "D")) {
      // They form a removable pair, so pop the top
      stack.pop();
    } else {
      // Not a removable pair, push current char
      stack.push(char);
    }
  }

  // The stack contains all characters that couldn't be removed
  return stack.length;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minLength(String s) {
        /**
         * Returns the minimum length after removing all "AB" and "CD" substrings.
         * Uses a stack to efficiently handle cascading removals.
         */
        Stack<Character> stack = new Stack<>();

        // Process each character in the string
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);

            // If stack is empty, just push the character
            if (stack.isEmpty()) {
                stack.push(currentChar);
                continue;
            }

            // Get the top character from the stack
            char top = stack.peek();

            // Check if current char and top form "AB" or "CD"
            if ((top == 'A' && currentChar == 'B') || (top == 'C' && currentChar == 'D')) {
                // They form a removable pair, so pop the top
                stack.pop();
            } else {
                // Not a removable pair, push current char
                stack.push(currentChar);
            }
        }

        // The stack contains all characters that couldn't be removed
        return stack.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once
- Stack operations (push/pop) are O(1) each
- Total: n iterations × O(1) operations = O(n)

**Space Complexity: O(n)**

- In the worst case, when there are no removable pairs (e.g., "ACACAC"), all characters end up in the stack
- The stack can grow to size n in the worst case
- Thus O(n) space

This is optimal because we must at least examine each character once (Ω(n) time), and we might need to store most of them (Ω(n) space in worst case).

## Common Mistakes

1. **Using string manipulation in a loop without a stack**
   - Some candidates try to use `s.replace("AB", "").replace("CD", "")` in a loop
   - This fails because `replace()` removes ALL occurrences at once, which can skip cascading effects
   - Example: "CABD" → replace "AB" gives "CD" → replace "CD" gives "" ✓
   - But: "ABAB" → replace "AB" gives "" (removes both at once) ✓
   - Actually this works but is inefficient O(n²) worst case

2. **Forgetting to check if stack is empty before peeking**
   - Trying to access `stack[-1]` when stack is empty causes errors
   - Always check `if stack:` or `if not stack.empty()` first
   - Our code handles this by checking emptiness before accessing top

3. **Incorrect pair matching logic**
   - Writing `(char == 'A' and top == 'B')` instead of `(top == 'A' and char == 'B')`
   - The order matters: the top of stack is the left character, current is right
   - "AB" means 'A' then 'B', not 'B' then 'A'

4. **Not considering all test cases**
   - Empty string: should return 0
   - No removable pairs: should return original length
   - All characters removable: should return 0
   - Mixed case: "ACBD" (no removable pairs despite having A,B,C,D)
   - Always test with at least these cases

## When You'll See This Pattern

This stack-based pattern for removing adjacent pairs appears in many string processing problems:

1. **Valid Parentheses (LeetCode 20)** - Similar concept but with multiple bracket types
   - Instead of "AB"/"CD", we match '(', ')', '{', '}', '[', ']'
   - Same stack approach: push opening brackets, pop when matching closing bracket found

2. **Remove All Adjacent Duplicates In String (LeetCode 1047)**
   - Remove adjacent identical characters (e.g., "abbaca" → "ca")
   - Same stack approach: push characters, pop if top equals current character

3. **Make The String Great (LeetCode 1544)**
   - Remove adjacent characters that are same letter but different case
   - Stack approach with case comparison instead of specific pairs

The pattern to recognize: **when you need to remove adjacent elements based on some matching condition, and removals can create new adjacent pairs, think stack.**

## Key Takeaways

1. **Stack is perfect for cascading removals** - When removing something might make previously non-adjacent elements adjacent, a stack lets you "rewind" to check new pairs efficiently.

2. **Process left-to-right, check against most recent** - For adjacent pair problems, you typically want to compare the current element with the most recent unmatched element (stack top).

3. **O(n) time is achievable** - Even though removals can cascade, you don't need to rescan the entire string. Each character is processed once, with O(1) stack operations.

[Practice this problem on CodeJeet](/problem/minimum-string-length-after-removing-substrings)
