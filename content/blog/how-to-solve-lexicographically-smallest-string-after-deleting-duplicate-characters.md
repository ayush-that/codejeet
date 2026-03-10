---
title: "How to Solve Lexicographically Smallest String After Deleting Duplicate Characters — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest String After Deleting Duplicate Characters. Hard difficulty, 19.3% acceptance rate. Topics: Hash Table, String, Stack, Greedy, Monotonic Stack."
date: "2026-08-29"
category: "dsa-patterns"
tags:
  [
    "lexicographically-smallest-string-after-deleting-duplicate-characters",
    "hash-table",
    "string",
    "stack",
    "hard",
  ]
---

# How to Solve Lexicographically Smallest String After Deleting Duplicate Characters

You're given a string `s` containing lowercase English letters. You can repeatedly delete any single occurrence of any character that appears at least twice in the current string. Your goal is to obtain the lexicographically smallest possible string after performing any number of such deletions. This problem is tricky because it's not just about removing duplicates—it's about strategically choosing which duplicates to remove to minimize the final string's lexicographic order.

## Visual Walkthrough

Let's trace through an example: `s = "bcabc"`

**Step-by-step reasoning:**

1. We want the lexicographically smallest result. Lexicographic order means dictionary order: 'a' < 'b' < 'c'...
2. We can only delete characters that have duplicates. If a character appears only once, we must keep it.
3. Key insight: We want to place smaller characters as early as possible, but only if we can still include all required characters later.

Let's process `"bcabc"`:

- We'll build our result character by character
- We need to track:
  - Which characters we've already used in our result
  - How many of each character remain to be processed
  - Whether we can safely skip a character now (because it appears later)

Processing:

1. `'b'` - We haven't used it yet. Should we take it? 'b' appears again later (at position 3). We might get a smaller character before the next 'b'. Let's skip for now.
2. `'c'` - Similar logic: 'c' appears later (position 4). Skip.
3. `'a'` - This is the smallest character we've seen! We should definitely take it. Add 'a' to result.
4. `'b'` - Now we're at the second 'b'. Should we take it? 'b' is smaller than 'c', and we haven't used 'b' yet. Add 'b' to result.
5. `'c'` - Last character. We haven't used 'c' yet, and it's our only remaining character. Add 'c'.

Result: `"abc"`

This matches our intuition: we want the smallest possible ordering while ensuring we include all characters that appear in the original string.

## Brute Force Approach

A naive approach would be to generate all possible strings by trying all combinations of deletions:

1. For each character that appears at least twice, try deleting each occurrence
2. Recursively apply deletions until no more deletions are possible
3. Collect all resulting strings and find the lexicographically smallest one

The problem with this approach is the exponential time complexity. If a string has `n` characters, and each character could be deleted or kept, we'd have roughly `2^n` possibilities to consider. For `n = 100`, this is completely infeasible.

Even a smarter brute force that tries to build the result by choosing at each position whether to include a character or not would still be exponential because we need to consider all permutations of which duplicates to keep.

## Optimized Approach

The key insight is that this problem is essentially **"Remove Duplicate Letters"** in disguise. We need to find the smallest lexicographic subsequence that contains all unique characters from the original string.

**Core strategy:**

1. We'll process the string from left to right, building our result
2. We maintain:
   - `last_occurrence`: The last index where each character appears (so we know if we can skip it now)
   - `in_stack`: Whether a character is already in our result
   - A stack to build our result (allowing us to remove larger characters when we find smaller ones later)

**Step-by-step reasoning:**

1. First, count how many times each character appears (or find last occurrence indices)
2. Iterate through the string. For each character `c`:
   - If `c` is already in our result, skip it (we already have it in optimal position)
   - While our result isn't empty AND:
     - The last character in our result is greater than `c` AND
     - That character appears again later in the string
     - Then pop it from our result (we can get it later in a better position)
   - Add `c` to our result
3. The stack now contains our answer

This greedy approach works because:

- We always want smaller characters earlier
- We can remove a larger character from an earlier position if we know it appears later
- Once we place a character, we never move it (monotonic property)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) since we use fixed-size arrays (26 letters)
def smallestString(self, s: str) -> str:
    # Step 1: Find the last occurrence index of each character
    # This tells us if we can skip a character now and get it later
    last_occurrence = {}
    for i, char in enumerate(s):
        last_occurrence[char] = i

    # Step 2: Initialize tracking structures
    stack = []  # Will store our result
    in_stack = set()  # Track which characters are already in the result

    # Step 3: Process each character in the string
    for i, char in enumerate(s):
        # If character is already in our result, skip it
        # We've already placed it in the best possible position
        if char in in_stack:
            continue

        # While the stack isn't empty AND:
        # 1. The last character in stack is greater than current char (lexicographically)
        # 2. That character appears again later in the string
        # Then we should remove it now and add it back later when appropriate
        while stack and stack[-1] > char and last_occurrence[stack[-1]] > i:
            # Remove from stack and mark as not in stack
            removed = stack.pop()
            in_stack.remove(removed)

        # Add current character to stack and mark as in stack
        stack.append(char)
        in_stack.add(char)

    # Step 4: Convert stack to string (this is our result)
    return ''.join(stack)
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) since we use fixed-size arrays/maps (26 letters)
function smallestString(s) {
  // Step 1: Find the last occurrence index of each character
  const lastOccurrence = new Map();
  for (let i = 0; i < s.length; i++) {
    lastOccurrence.set(s[i], i);
  }

  // Step 2: Initialize tracking structures
  const stack = []; // Will store our result
  const inStack = new Set(); // Track which characters are already in the result

  // Step 3: Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // If character is already in our result, skip it
    if (inStack.has(char)) {
      continue;
    }

    // While the stack isn't empty AND:
    // 1. The last character in stack is greater than current char
    // 2. That character appears again later in the string
    while (
      stack.length > 0 &&
      stack[stack.length - 1] > char &&
      lastOccurrence.get(stack[stack.length - 1]) > i
    ) {
      // Remove from stack and mark as not in stack
      const removed = stack.pop();
      inStack.delete(removed);
    }

    // Add current character to stack and mark as in stack
    stack.push(char);
    inStack.add(char);
  }

  // Step 4: Convert stack to string (this is our result)
  return stack.join("");
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) since we use fixed-size arrays (26 letters)
public String smallestString(String s) {
    // Step 1: Find the last occurrence index of each character
    int[] lastOccurrence = new int[26];
    for (int i = 0; i < s.length(); i++) {
        lastOccurrence[s.charAt(i) - 'a'] = i;
    }

    // Step 2: Initialize tracking structures
    Stack<Character> stack = new Stack<>();
    boolean[] inStack = new boolean[26];

    // Step 3: Process each character in the string
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        // If character is already in our result, skip it
        if (inStack[c - 'a']) {
            continue;
        }

        // While the stack isn't empty AND:
        // 1. The last character in stack is greater than current char
        // 2. That character appears again later in the string
        while (!stack.isEmpty() &&
               stack.peek() > c &&
               lastOccurrence[stack.peek() - 'a'] > i) {
            // Remove from stack and mark as not in stack
            char removed = stack.pop();
            inStack[removed - 'a'] = false;
        }

        // Add current character to stack and mark as in stack
        stack.push(c);
        inStack[c - 'a'] = true;
    }

    // Step 4: Convert stack to string (this is our result)
    StringBuilder result = new StringBuilder();
    for (char c : stack) {
        result.append(c);
    }
    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string:
  1. First pass to find last occurrences: O(n)
  2. Second pass to build the result: O(n)
- Each character is pushed to and popped from the stack at most once, so the while loop inside the for loop has amortized O(1) time per character
- Total: O(n) where n is the length of the input string

**Space Complexity: O(1)**

- We use fixed-size data structures:
  - `last_occurrence`: 26 integers (one for each lowercase letter)
  - `in_stack`: 26 booleans
  - `stack`: At most 26 characters (one for each unique letter)
- Even though we say O(1), in practice it's O(k) where k is the size of the alphabet (26 for lowercase English letters)

## Common Mistakes

1. **Not checking if a character can appear later before removing it from stack**
   - Mistake: Popping a character from stack just because it's larger than current character, without verifying it appears again later
   - Consequence: You might lose a character entirely if it doesn't reappear
   - Fix: Always check `last_occurrence[stack[-1]] > i` before popping

2. **Forgetting to skip characters already in the result**
   - Mistake: Processing a character even when it's already in `in_stack`
   - Consequence: Duplicate characters in final result
   - Fix: Check `if char in in_stack: continue` at the start of loop iteration

3. **Using the wrong comparison in the while loop condition**
   - Mistake: Using `>=` instead of `>` when comparing stack top with current character
   - Consequence: Might remove equal characters unnecessarily, leading to incorrect ordering
   - Fix: Use `>` to only remove larger characters (we want to keep the first occurrence of equal characters)

4. **Not handling the stack to string conversion properly**
   - Mistake: Trying to reverse the stack or convert it incorrectly
   - Consequence: Result is in wrong order
   - Fix: The stack already has correct order; just join it from bottom to top

## When You'll See This Pattern

This **monotonic stack with greedy selection** pattern appears in several problems:

1. **Remove Duplicate Letters (LeetCode 316)** - Almost identical to this problem
   - Same core algorithm: maintain monotonic stack, track last occurrences
   - Only difference: This problem allows deleting any duplicate, while 316 specifies removing duplicates to get smallest lexicographic order

2. **Smallest Subsequence of Distinct Characters (LeetCode 1081)**
   - Exactly the same problem as Remove Duplicate Letters
   - Uses identical solution approach

3. **Create Maximum Number (LeetCode 321)** - Harder variant
   - Similar monotonic stack approach but with additional constraints
   - Requires merging two sequences after creating monotonic stacks

The pattern is: when you need to maintain a certain order (like lexicographic) while ensuring all required elements are included, and you can remove elements when better ones come along, think of a monotonic stack with tracking of future availability.

## Key Takeaways

1. **Monotonic stacks are perfect for maintaining order while allowing removals**
   - When you need to build a sequence and might need to remove earlier elements when better options appear later, a stack with monotonic properties is often the solution.

2. **Track future availability to make greedy decisions safely**
   - The key insight is knowing whether you can skip a character now because it appears later. This turns an exponential problem into a linear one.

3. **Lexicographic problems often involve character-by-character greedy construction**
   - Build the result incrementally, always choosing the smallest possible character at each position while ensuring you can include all required characters later.

Related problems: [Remove Duplicate Letters](/problem/remove-duplicate-letters)
