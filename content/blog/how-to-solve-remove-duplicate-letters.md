---
title: "How to Solve Remove Duplicate Letters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Duplicate Letters. Medium difficulty, 52.8% acceptance rate. Topics: String, Stack, Greedy, Monotonic Stack."
date: "2027-06-25"
category: "dsa-patterns"
tags: ["remove-duplicate-letters", "string", "stack", "greedy", "medium"]
---

# How to Solve Remove Duplicate Letters

This problem asks us to remove duplicate letters from a string so that every letter appears exactly once, while ensuring the result is the lexicographically smallest possible among all valid results. What makes this tricky is that we can't simply deduplicate by keeping the first occurrence of each letter—we need to strategically choose which occurrences to keep to minimize the overall string order.

## Visual Walkthrough

Let's trace through the example `s = "cbacdcbc"` step by step:

**Goal**: Remove duplicates to get smallest lexicographic result.

**Step 1 - Understanding lexicographic order**: Think of dictionary ordering. "abc" < "acb" because at the first differing position (position 1), 'b' < 'c'.

**Step 2 - Key insight**: We want to place the smallest possible character at each position, but only if we can still include all remaining characters later.

**Step 3 - Manual process**:

1. Start with empty result: `""`
2. First character 'c': add it → `"c"`
3. Second character 'b': 'b' < 'c' and 'c' appears again later (at position 4), so we can remove 'c' and add 'b' → `"b"`
4. Third character 'a': 'a' < 'b' and 'b' appears again later (at position 6), so remove 'b' and add 'a' → `"a"`
5. Fourth character 'c': 'c' > 'a', just add it → `"ac"`
6. Fifth character 'd': 'd' > 'c', just add it → `"acd"`
7. Sixth character 'b': 'b' < 'd' and 'd' doesn't appear again (only one 'd'), so we keep 'd'. 'b' < 'c' and 'c' appears again (position 7), so remove 'c' and add 'b' → `"ab"`
8. Seventh character 'c': 'c' > 'b', add it → `"abc"`
9. Eighth character: 'c' is already in result, skip it

Final result: `"acdb"`? Wait, that's not right—let me check...

Actually, I made an error. Let's think more systematically using the stack approach we'll implement:

We'll track:

- Last occurrence index of each character: `{'c':7, 'b':6, 'a':2, 'd':5}`
- Visited characters in result: set()
- Result stack: []

Processing:

1. 'c' (i=0): stack=['c'], visited={'c'}
2. 'b' (i=1): 'b' < 'c' and 'c' appears again (at 7), so pop 'c', add 'b' → stack=['b'], visited={'b'}
3. 'a' (i=2): 'a' < 'b' and 'b' appears again (at 6), so pop 'b', add 'a' → stack=['a'], visited={'a'}
4. 'c' (i=3): 'c' not visited, 'c' > 'a', add 'c' → stack=['a','c'], visited={'a','c'}
5. 'd' (i=4): 'd' not visited, 'd' > 'c', add 'd' → stack=['a','c','d'], visited={'a','c','d'}
6. 'c' (i=5): 'c' already visited, skip
7. 'b' (i=6): 'b' not visited, 'b' < 'd' and 'd' appears again? No, 'd' only at position 4. Check 'c': 'b' < 'c' and 'c' appears again? No, last 'c' was at position 7. So we can't pop anything. Add 'b' → stack=['a','c','d','b'], visited={'a','c','d','b'}
8. 'c' (i=7): 'c' already visited, skip

Result: `"acdb"` (from stack). But wait, is this the smallest? Let's check `"abcd"` would be smaller. Can we get `"abcd"`? Yes! If at step 6, we should have popped 'd' because... actually 'd' doesn't appear again. So `"acdb"` is correct.

Actually, the correct answer IS `"acdb"`. Let me verify: All letters appear once, and it's the smallest possible. `"abcd"` isn't possible because we can't reorder letters arbitrarily—we need to maintain relative order of kept characters.

## Brute Force Approach

A naive approach would be to generate all possible subsequences that contain each character exactly once, then pick the lexicographically smallest. Here's how that might work:

1. Find all positions where each character appears
2. Generate all combinations picking one position for each character
3. Sort the selected positions to maintain order
4. Build the string from sorted positions
5. Track the lexicographically smallest result

The problem? This is exponential time. If we have `n` characters and each appears `k` times on average, we have roughly `k^n` combinations. For `s = "cbacdcbc"`, we'd need to consider 2×2×1×2 = 8 combinations, but for longer strings this grows impossibly large.

Even if we try a greedy "keep the smallest character possible at each position" approach without proper lookahead, we might make wrong decisions. For example, with `s = "bcabc"`, a simple greedy might give `"bca"` instead of the correct `"abc"`.

## Optimized Approach

The key insight is to use a **monotonic stack** with lookahead capability:

1. **Count occurrences**: First, count how many times each character appears in the string. This tells us if a character can be safely removed (if it appears again later).

2. **Use a stack**: Build the result character by character using a stack. The stack will maintain characters in increasing order (from bottom to top) as much as possible.

3. **Decision logic at each character**:
   - If the character is already in the stack (result), skip it
   - While the current character is smaller than the top of stack AND the top character appears again later, pop from stack
   - Add current character to stack

4. **Track visited characters**: Use a set to quickly check if a character is already in our result.

5. **Last occurrence map**: We need to know if a character appears again later. We can use a dictionary mapping each character to its last occurrence index.

This approach works because:

- The stack ensures we build in lexicographic order
- We only remove a character if we know we can add it back later
- We process each character exactly once

## Optimal Solution

Here's the complete implementation using a monotonic stack approach:

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(1) since we store at most 26 characters in stack/set
def removeDuplicateLetters(s: str) -> str:
    # Step 1: Create a dictionary to store the last occurrence index of each character
    # This helps us know if a character appears again later in the string
    last_occurrence = {}
    for i, char in enumerate(s):
        last_occurrence[char] = i

    # Step 2: Initialize an empty stack to build our result
    # The stack will maintain characters in increasing order (bottom to top)
    stack = []

    # Step 3: Track which characters are already in the stack
    # This prevents duplicates in our result
    in_stack = set()

    # Step 4: Process each character in the string
    for i, char in enumerate(s):
        # If character is already in stack, skip it
        # We've already included this character in the optimal position
        if char in in_stack:
            continue

        # Step 5: While stack is not empty AND current character is smaller than top of stack
        # AND the top character appears again later in the string (we can add it back)
        while stack and char < stack[-1] and last_occurrence[stack[-1]] > i:
            # Remove the top character from stack and mark it as not in stack
            # We'll add it back later if needed
            removed_char = stack.pop()
            in_stack.remove(removed_char)

        # Step 6: Add current character to stack and mark it as in stack
        stack.append(char)
        in_stack.add(char)

    # Step 7: Convert stack to string (stack is already in correct order)
    return ''.join(stack)
```

```javascript
// Time: O(n) where n is length of string
// Space: O(1) since we store at most 26 characters in stack/set
function removeDuplicateLetters(s) {
  // Step 1: Create a map to store the last occurrence index of each character
  const lastOccurrence = new Map();
  for (let i = 0; i < s.length; i++) {
    lastOccurrence.set(s[i], i);
  }

  // Step 2: Initialize an empty stack to build our result
  const stack = [];

  // Step 3: Track which characters are already in the stack
  const inStack = new Set();

  // Step 4: Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // If character is already in stack, skip it
    if (inStack.has(char)) {
      continue;
    }

    // Step 5: While stack is not empty AND current character is smaller than top of stack
    // AND the top character appears again later in the string
    while (
      stack.length > 0 &&
      char < stack[stack.length - 1] &&
      lastOccurrence.get(stack[stack.length - 1]) > i
    ) {
      // Remove the top character from stack
      const removedChar = stack.pop();
      inStack.delete(removedChar);
    }

    // Step 6: Add current character to stack
    stack.push(char);
    inStack.add(char);
  }

  // Step 7: Convert stack to string
  return stack.join("");
}
```

```java
// Time: O(n) where n is length of string
// Space: O(1) since we store at most 26 characters in stack/set
public String removeDuplicateLetters(String s) {
    // Step 1: Create an array to store the last occurrence index of each character
    // Using array instead of HashMap for better performance
    int[] lastOccurrence = new int[26];
    for (int i = 0; i < s.length(); i++) {
        lastOccurrence[s.charAt(i) - 'a'] = i;
    }

    // Step 2: Initialize a stack to build our result
    Stack<Character> stack = new Stack<>();

    // Step 3: Track which characters are already in the stack
    boolean[] inStack = new boolean[26];

    // Step 4: Process each character in the string
    for (int i = 0; i < s.length(); i++) {
        char currentChar = s.charAt(i);

        // If character is already in stack, skip it
        if (inStack[currentChar - 'a']) {
            continue;
        }

        // Step 5: While stack is not empty AND current character is smaller than top of stack
        // AND the top character appears again later in the string
        while (!stack.isEmpty() &&
               currentChar < stack.peek() &&
               lastOccurrence[stack.peek() - 'a'] > i) {
            // Remove the top character from stack
            char removedChar = stack.pop();
            inStack[removedChar - 'a'] = false;
        }

        // Step 6: Add current character to stack
        stack.push(currentChar);
        inStack[currentChar - 'a'] = true;
    }

    // Step 7: Convert stack to string
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

- We make two passes through the string: O(n) to build the last occurrence map, and O(n) to process each character
- Each character is pushed to and popped from the stack at most once: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity**: O(1) for the algorithm itself, or O(n) if considering the output

- The stack, set, and last occurrence map store at most 26 entries (one per lowercase English letter)
- However, the output string can be up to length n in the worst case (if all characters are unique)
- In interview contexts, we typically say O(1) space since the alphabet size is constant

## Common Mistakes

1. **Forgetting to track "in stack" status**: Without tracking which characters are already in the result, you might add duplicates. The set `in_stack` is crucial.

2. **Incorrect last occurrence check**: The condition `last_occurrence[stack[-1]] > i` must use `>` not `>=`. If the last occurrence is at current index `i`, we can't remove it because this is our last chance to include this character.

3. **Wrong comparison direction**: Using `char > stack[-1]` instead of `char < stack[-1]`. We want to maintain increasing order in the stack, so we only pop when the current character is smaller.

4. **Not handling empty string or single character**: While the code handles these naturally, some candidates add unnecessary special cases. The stack approach works for all cases including empty string (returns `""`).

## When You'll See This Pattern

The monotonic stack pattern with lookahead appears in several problems:

1. **Smallest K-Length Subsequence With Occurrences of a Letter (LeetCode 2030)**: Similar concept but with additional constraints on minimum occurrences of a specific letter.

2. **Lexicographically Smallest String After Deleting Duplicate Characters (LeetCode 3165)**: Essentially the same problem with different framing.

3. **Remove K Digits (LeetCode 402)**: Remove k digits to get smallest number—uses similar stack logic but removes exactly k characters.

4. **Create Maximum Number (LeetCode 321)**: Combines monotonic stack concepts with more complex merging logic.

The pattern is: when you need to maintain a subsequence with certain ordering properties while being able to look ahead to make optimal local decisions, consider a monotonic stack.

## Key Takeaways

1. **Monotonic stacks with lookahead** are perfect for problems where you need to build a lexicographically smallest subsequence while maintaining certain constraints. The stack lets you "undo" previous decisions when you find a better option.

2. **The last occurrence map** is the key to knowing whether you can safely remove a character. Without this lookahead information, you'd have to guess.

3. **Always validate removals**: Before popping from the stack, check: (1) current character is smaller than stack top, AND (2) stack top appears again later. Both conditions must be true.

Related problems: [Smallest K-Length Subsequence With Occurrences of a Letter](/problem/smallest-k-length-subsequence-with-occurrences-of-a-letter), [Lexicographically Smallest String After Deleting Duplicate Characters](/problem/lexicographically-smallest-string-after-deleting-duplicate-characters)
