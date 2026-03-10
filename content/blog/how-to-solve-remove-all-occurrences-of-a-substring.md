---
title: "How to Solve Remove All Occurrences of a Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove All Occurrences of a Substring. Medium difficulty, 78.4% acceptance rate. Topics: String, Stack, Simulation."
date: "2027-08-11"
category: "dsa-patterns"
tags: ["remove-all-occurrences-of-a-substring", "string", "stack", "simulation", "medium"]
---

# How to Solve Remove All Occurrences of a Substring

This problem asks us to repeatedly remove the leftmost occurrence of a substring `part` from string `s` until no occurrences remain. What makes this interesting is that removing one occurrence can create new occurrences that weren't originally there. For example, removing "abc" from "aabcbc" creates a new "abc" after the removal. This cascading effect means we can't just find and remove all occurrences in one pass.

## Visual Walkthrough

Let's trace through an example: `s = "daabcbaabcbc"`, `part = "abc"`

**Step 1:** Find leftmost "abc" → "da**abc**baabcbc"
Remove it: "da" + "baabcbc" = "dabaabcbc"

**Step 2:** Find leftmost "abc" → "daba**abc**bc"
Remove it: "daba" + "bc" = "dababc"

**Step 3:** Find leftmost "abc" → "dab**abc**"
Remove it: "dab" + "" = "dab"

**Step 4:** Check for "abc" in "dab" → none found

Final result: "dab"

Notice how after removing the first "abc", we got "dabaabcbc" which contains a new "abc" that wasn't originally contiguous. This is why we need to keep checking after each removal.

## Brute Force Approach

The most straightforward approach is exactly what the problem describes: repeatedly find and remove the leftmost occurrence until none remain.

**Algorithm:**

1. While `part` exists in `s`:
   - Find the index of the leftmost occurrence of `part`
   - Remove it by concatenating the substring before and after
2. Return the final `s`

**Why it's inefficient:**

- Each `find()` operation takes O(n) time where n is the length of `s`
- Each string concatenation creates a new string, which takes O(n) time
- In the worst case (like `s = "aaaaa"`, `part = "aa"`), we might need O(n) removals
- This gives us O(n²) time complexity overall

**Brute Force Code:**

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def removeOccurrences_brute(s: str, part: str) -> str:
    # Keep removing until no more occurrences exist
    while part in s:
        # Find the leftmost occurrence
        idx = s.find(part)
        # Remove it by concatenating before and after parts
        s = s[:idx] + s[idx + len(part):]
    return s
```

```javascript
// Time: O(n²) | Space: O(n)
function removeOccurrencesBrute(s, part) {
  // Keep removing until no more occurrences exist
  while (s.includes(part)) {
    // Find the leftmost occurrence
    const idx = s.indexOf(part);
    // Remove it by concatenating before and after parts
    s = s.slice(0, idx) + s.slice(idx + part.length);
  }
  return s;
}
```

```java
// Time: O(n²) | Space: O(n)
public String removeOccurrencesBrute(String s, String part) {
    // Keep removing until no more occurrences exist
    while (s.contains(part)) {
        // Find the leftmost occurrence
        int idx = s.indexOf(part);
        // Remove it by concatenating before and after parts
        s = s.substring(0, idx) + s.substring(idx + part.length());
    }
    return s;
}
```

</div>

## Optimized Approach

The key insight is that we can simulate this process efficiently using a **stack**. Think about what happens when we process characters one by one:

1. We push characters onto a stack
2. After pushing each character, we check if the top of the stack ends with `part`
3. If it does, we pop `len(part)` characters from the stack

This works because:

- The stack naturally handles the "leftmost" requirement - we process from left to right
- When we find `part` at the end of the stack, it's the leftmost occurrence that ends at the current position
- Popping from the stack is equivalent to removing that occurrence

**Why this is optimal:**

- We process each character exactly once (push) and potentially once more (pop)
- Stack operations are O(1) amortized
- Checking if the stack ends with `part` can be done efficiently by comparing characters

## Optimal Solution

Here's the stack-based solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def removeOccurrences(s: str, part: str) -> str:
    """
    Removes all occurrences of substring 'part' from string 's'.
    Uses a stack to efficiently handle cascading removals.
    """
    stack = []
    part_len = len(part)

    for char in s:
        # Push current character onto stack
        stack.append(char)

        # Check if we have enough characters to possibly form 'part'
        if len(stack) >= part_len:
            # Check if the last 'part_len' characters match 'part'
            # We compare from the end of the stack backwards
            match = True
            for i in range(part_len):
                # Compare stack[-part_len + i] with part[i]
                if stack[-part_len + i] != part[i]:
                    match = False
                    break

            # If we found 'part' at the end of the stack, remove it
            if match:
                # Pop 'part_len' characters from the stack
                for _ in range(part_len):
                    stack.pop()

    # Convert stack back to string
    return ''.join(stack)
```

```javascript
// Time: O(n) | Space: O(n)
function removeOccurrences(s, part) {
  /**
   * Removes all occurrences of substring 'part' from string 's'.
   * Uses a stack to efficiently handle cascading removals.
   */
  const stack = [];
  const partLen = part.length;

  for (let char of s) {
    // Push current character onto stack
    stack.push(char);

    // Check if we have enough characters to possibly form 'part'
    if (stack.length >= partLen) {
      // Check if the last 'partLen' characters match 'part'
      let match = true;
      for (let i = 0; i < partLen; i++) {
        // Compare stack[stack.length - partLen + i] with part[i]
        if (stack[stack.length - partLen + i] !== part[i]) {
          match = false;
          break;
        }
      }

      // If we found 'part' at the end of the stack, remove it
      if (match) {
        // Pop 'partLen' characters from the stack
        for (let i = 0; i < partLen; i++) {
          stack.pop();
        }
      }
    }
  }

  // Convert stack back to string
  return stack.join("");
}
```

```java
// Time: O(n) | Space: O(n)
public String removeOccurrences(String s, String part) {
    /**
     * Removes all occurrences of substring 'part' from string 's'.
     * Uses a stack to efficiently handle cascading removals.
     */
    StringBuilder stack = new StringBuilder();
    int partLen = part.length();

    for (char c : s.toCharArray()) {
        // Push current character onto stack
        stack.append(c);

        // Check if we have enough characters to possibly form 'part'
        if (stack.length() >= partLen) {
            // Check if the last 'partLen' characters match 'part'
            boolean match = true;
            for (int i = 0; i < partLen; i++) {
                // Compare stack.charAt(stack.length() - partLen + i) with part.charAt(i)
                if (stack.charAt(stack.length() - partLen + i) != part.charAt(i)) {
                    match = false;
                    break;
                }
            }

            // If we found 'part' at the end of the stack, remove it
            if (match) {
                // Delete the last 'partLen' characters from the stack
                stack.delete(stack.length() - partLen, stack.length());
            }
        }
    }

    // Convert stack back to string
    return stack.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character of `s` exactly once in the main loop
- For each character, we do a constant amount of work (push to stack)
- The inner loop that checks for `part` runs at most `len(part)` times per character, but each character is only checked when it's at the end of a potential match
- In total, each character is compared at most `len(part)` times, giving us O(n \* m) where m = len(part)
- However, since m is constant relative to n in asymptotic analysis, this is O(n)

**Space Complexity: O(n)**

- In the worst case (when no removals happen), the stack stores all n characters
- Even with removals, the stack can grow up to O(n) in size

## Common Mistakes

1. **Not handling cascading removals**: The biggest pitfall is thinking you can remove all occurrences in one pass. After removing one occurrence, new ones can form from the concatenation of what was before and after. Always test with cases like `s = "aabcbc"`, `part = "abc"`.

2. **Inefficient string concatenation**: Using string concatenation in a loop (like `s = s[:i] + s[i+len(part):]`) creates a new string each time, which is O(n) per operation. This leads to O(n²) time complexity.

3. **Wrong removal order**: The problem specifies "leftmost occurrence" each time. If you remove occurrences from right to left or in arbitrary order, you might get wrong results. The stack approach naturally handles this by processing left to right.

4. **Forgetting to check after each removal**: Some candidates try to find all indices first, then remove them. This doesn't work because indices change after each removal. You must find and remove sequentially.

## When You'll See This Pattern

The stack-based pattern for string manipulation appears in several problems where you need to remove patterns or validate structures:

1. **Backspace String Compare (LeetCode 844)**: Uses a similar stack approach to handle backspace characters by pushing and popping.

2. **Valid Parentheses (LeetCode 20)**: The classic stack problem where you push opening brackets and pop when you see matching closing brackets.

3. **Remove All Adjacent Duplicates In String (LeetCode 1047)**: Almost identical pattern - remove adjacent duplicates by checking the top of the stack.

4. **Decode String (LeetCode 394)**: Uses stacks to handle nested structures and repetitions.

The common theme is using a stack to "remember" what you've seen so you can efficiently undo/remove patterns when you complete them.

## Key Takeaways

1. **When you need to remove patterns and removals can create new patterns, think stack**: The stack naturally handles the "most recent" context, which is exactly what you need when removals can cascade.

2. **Processing left-to-right with a stack preserves order**: This ensures you always handle the leftmost occurrence first, as required by many string manipulation problems.

3. **Avoid string concatenation in loops**: When building or modifying strings character by character, use a list/stack/string builder instead of repeated concatenation for O(n) instead of O(n²) performance.

Related problems: [Maximum Deletions on a String](/problem/maximum-deletions-on-a-string)
