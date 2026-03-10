---
title: "How to Solve Smallest Subsequence of Distinct Characters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Subsequence of Distinct Characters. Medium difficulty, 63.1% acceptance rate. Topics: String, Stack, Greedy, Monotonic Stack."
date: "2027-07-26"
category: "dsa-patterns"
tags: ["smallest-subsequence-of-distinct-characters", "string", "stack", "greedy", "medium"]
---

# How to Solve Smallest Subsequence of Distinct Characters

You're given a string `s`, and you need to return the lexicographically smallest subsequence that contains every distinct character from `s` exactly once. This problem is tricky because it's not just about finding all distinct characters—it's about arranging them in the smallest possible order while ensuring each character appears exactly once and the result is a valid subsequence of the original string.

Think of it this way: you need to pick one occurrence of each distinct character, and arrange them in an order that's as small as possible in dictionary order, while still respecting the original sequence of characters in `s`.

## Visual Walkthrough

Let's trace through an example: `s = "cbacdcbc"`

**Step 1: Understand what we need**

- Distinct characters: `c, b, a, d`
- We need to pick one occurrence of each to form the smallest possible sequence
- The result must be a subsequence (characters appear in the same relative order as in `s`)

**Step 2: Manual approach**
We'll build the result character by character:

1. Look at position 0: `c`
   - Can we skip this `c` and use a later one? Yes, because `c` appears again at positions 2, 6, 7
   - Should we skip it? Maybe, if we can get a smaller character first

2. Look at position 1: `b`
   - Can we skip this `b`? Yes, appears again at position 5
   - Should we skip it? Maybe, if we can get `a` first

3. Look at position 2: `a`
   - Can we skip this `a`? No! This is the only `a` in the string
   - So we must include `a` in our result
   - Result so far: `a`

4. Now we need `b, c, d` remaining
   - Look at position 3: `c` (after `a`)
   - Should we include this `c`? Not yet, because `b` is smaller and we haven't used `b` yet
   - But wait, we can only use characters that come after our current position

5. Look at position 4: `d`
   - Should we include `d`? Not yet, `b` and `c` are smaller

6. Look at position 5: `b`
   - This is the last `b` in the string
   - We must include it now or we won't have a `b`
   - Result: `ab`

7. Continue this process...
   Final result: `acdb`

But wait, is `acdb` the smallest? Let's check `abcd` - that's smaller alphabetically, but is it a valid subsequence? In `s = "cbacdcbc"`, can we get `abcd`? No, because `d` comes before `c` in the original string when looking at their first occurrences after `b`.

The actual smallest is `acdb`.

## Brute Force Approach

A naive approach would be:

1. Find all distinct characters in `s`
2. Generate all permutations of these distinct characters
3. For each permutation, check if it's a valid subsequence of `s`
4. Return the lexicographically smallest valid subsequence

This approach has several problems:

- Generating all permutations of distinct characters is O(k!) where k is the number of distinct characters
- Checking if a permutation is a subsequence takes O(n) time
- Total time complexity: O(k! \* n), which is infeasible for strings with many distinct characters

Even for a string with just 10 distinct characters, that's 3.6 million permutations to check!

<div class="code-group">

```python
# Brute force approach (not recommended for actual use)
def smallestSubsequence_brute(s: str) -> str:
    # Get all distinct characters
    distinct = sorted(set(s))
    n = len(s)

    # Helper to check if a candidate is a subsequence
    def is_subsequence(candidate, s):
        i = 0
        for char in s:
            if i < len(candidate) and char == candidate[i]:
                i += 1
        return i == len(candidate)

    # Generate all permutations and check them
    from itertools import permutations
    smallest = None

    for perm in permutations(distinct):
        candidate = ''.join(perm)
        if is_subsequence(candidate, s):
            if smallest is None or candidate < smallest:
                smallest = candidate

    return smallest
```

```javascript
// Brute force approach (not recommended for actual use)
function smallestSubsequenceBrute(s) {
  // Get all distinct characters
  const distinct = [...new Set(s)].sort();
  const n = s.length;

  // Helper to check if a candidate is a subsequence
  function isSubsequence(candidate, str) {
    let i = 0;
    for (const char of str) {
      if (i < candidate.length && char === candidate[i]) {
        i++;
      }
    }
    return i === candidate.length;
  }

  // Generate all permutations
  function* permutations(arr) {
    if (arr.length === 1) {
      yield arr;
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      for (const perm of permutations(rest)) {
        yield [arr[i], ...perm];
      }
    }
  }

  let smallest = null;

  for (const perm of permutations(distinct)) {
    const candidate = perm.join("");
    if (isSubsequence(candidate, s)) {
      if (smallest === null || candidate < smallest) {
        smallest = candidate;
      }
    }
  }

  return smallest;
}
```

```java
// Brute force approach (not recommended for actual use)
import java.util.*;

public class Solution {
    public String smallestSubsequenceBrute(String s) {
        // Get all distinct characters
        Set<Character> set = new HashSet<>();
        for (char c : s.toCharArray()) {
            set.add(c);
        }
        List<Character> distinct = new ArrayList<>(set);
        Collections.sort(distinct);

        // Generate all permutations and check them
        String smallest = null;
        List<List<Character>> permutations = generatePermutations(distinct);

        for (List<Character> perm : permutations) {
            StringBuilder candidate = new StringBuilder();
            for (char c : perm) {
                candidate.append(c);
            }

            if (isSubsequence(candidate.toString(), s)) {
                if (smallest == null || candidate.toString().compareTo(smallest) < 0) {
                    smallest = candidate.toString();
                }
            }
        }

        return smallest;
    }

    private boolean isSubsequence(String candidate, String s) {
        int i = 0;
        for (char c : s.toCharArray()) {
            if (i < candidate.length() && c == candidate.charAt(i)) {
                i++;
            }
        }
        return i == candidate.length();
    }

    private List<List<Character>> generatePermutations(List<Character> chars) {
        List<List<Character>> result = new ArrayList<>();
        backtrack(result, new ArrayList<>(), chars);
        return result;
    }

    private void backtrack(List<List<Character>> result, List<Character> temp, List<Character> chars) {
        if (temp.size() == chars.size()) {
            result.add(new ArrayList<>(temp));
            return;
        }

        for (int i = 0; i < chars.size(); i++) {
            if (temp.contains(chars.get(i))) continue;
            temp.add(chars.get(i));
            backtrack(result, temp, chars);
            temp.remove(temp.size() - 1);
        }
    }
}
```

</div>

## Optimized Approach

The key insight is that we can build the result greedily using a stack. Here's the thought process:

1. We want the lexicographically smallest result, so we should try to put smaller characters earlier
2. But we can only use characters that appear later in the string (to maintain subsequence property)
3. We need to ensure we don't miss any character entirely

The algorithm:

- Keep track of the last occurrence index of each character
- Use a stack to build the result
- For each character in the string:
  - If it's already in the stack, skip it (we only need each character once)
  - While the stack is not empty, the current character is smaller than the top of the stack, AND the top character appears again later in the string:
    - Pop from the stack (we can use a later occurrence of that character)
  - Push the current character onto the stack
- Convert the stack to string

Why this works:

- The stack maintains characters in increasing order (from bottom to top)
- We only remove a character from the stack if we know we can get it later
- We ensure we include every distinct character exactly once

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size arrays for 26 letters
def smallestSubsequence(s: str) -> str:
    # Track the last occurrence index of each character
    last_occurrence = {}
    for i, char in enumerate(s):
        last_occurrence[char] = i

    # Stack to build our result
    stack = []
    # Set to track characters already in the stack
    in_stack = set()

    # Process each character in the string
    for i, char in enumerate(s):
        # If character is already in stack, skip it
        if char in in_stack:
            continue

        # While stack is not empty, current char is smaller than top of stack,
        # and top character appears again later in the string
        while stack and char < stack[-1] and last_occurrence[stack[-1]] > i:
            # We can remove the top character and use a later occurrence
            removed = stack.pop()
            in_stack.remove(removed)

        # Add current character to stack
        stack.append(char)
        in_stack.add(char)

    # Convert stack to string
    return ''.join(stack)
```

```javascript
// Time: O(n) | Space: O(1) - fixed size for 26 letters
function smallestSubsequence(s) {
  // Track the last occurrence index of each character
  const lastOccurrence = new Map();
  for (let i = 0; i < s.length; i++) {
    lastOccurrence.set(s[i], i);
  }

  // Stack to build our result
  const stack = [];
  // Set to track characters already in the stack
  const inStack = new Set();

  // Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // If character is already in stack, skip it
    if (inStack.has(char)) {
      continue;
    }

    // While stack is not empty, current char is smaller than top of stack,
    // and top character appears again later in the string
    while (
      stack.length > 0 &&
      char < stack[stack.length - 1] &&
      lastOccurrence.get(stack[stack.length - 1]) > i
    ) {
      // We can remove the top character and use a later occurrence
      const removed = stack.pop();
      inStack.delete(removed);
    }

    // Add current character to stack
    stack.push(char);
    inStack.add(char);
  }

  // Convert stack to string
  return stack.join("");
}
```

```java
// Time: O(n) | Space: O(1) - fixed size for 26 letters
class Solution {
    public String smallestSubsequence(String s) {
        // Track the last occurrence index of each character
        int[] lastOccurrence = new int[26];
        for (int i = 0; i < s.length(); i++) {
            lastOccurrence[s.charAt(i) - 'a'] = i;
        }

        // Stack to build our result
        Stack<Character> stack = new Stack<>();
        // Boolean array to track characters already in the stack
        boolean[] inStack = new boolean[26];

        // Process each character in the string
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            // If character is already in stack, skip it
            if (inStack[c - 'a']) {
                continue;
            }

            // While stack is not empty, current char is smaller than top of stack,
            // and top character appears again later in the string
            while (!stack.isEmpty() &&
                   c < stack.peek() &&
                   lastOccurrence[stack.peek() - 'a'] > i) {
                // We can remove the top character and use a later occurrence
                char removed = stack.pop();
                inStack[removed - 'a'] = false;
            }

            // Add current character to stack
            stack.push(c);
            inStack[c - 'a'] = true;
        }

        // Convert stack to string
        StringBuilder result = new StringBuilder();
        for (char c : stack) {
            result.append(c);
        }
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string:
  1. First pass to record last occurrences: O(n)
  2. Second pass to build the stack: O(n)
- Each character is pushed and popped from the stack at most once, so stack operations are O(n) total
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1) for character storage, O(n) for the stack**

- The `last_occurrence` map/array uses O(1) space for 26 letters (or O(k) for k distinct characters if using Unicode)
- The `in_stack` set/array uses O(1) space for 26 letters
- The stack can grow up to O(k) where k is the number of distinct characters
- In the worst case (all characters distinct), stack uses O(n) space

## Common Mistakes

1. **Forgetting to track characters already in the stack**
   - Without this check, you might add the same character multiple times
   - Solution: Use a set or boolean array to track which characters are already in the result

2. **Incorrect condition for popping from the stack**
   - Only pop if: (1) current character is smaller than top of stack, AND (2) the top character appears again later
   - Missing either condition leads to wrong results
   - Solution: Carefully check both conditions before popping

3. **Not handling the case where a character has no later occurrence**
   - If a character appears only once or this is its last occurrence, we cannot remove it from the stack
   - Solution: Check `last_occurrence[stack[-1]] > i` before popping

4. **Confusing subsequence with substring**
   - A subsequence doesn't need to be contiguous, a substring does
   - This algorithm works for subsequences, not substrings
   - Solution: Remember we're building from characters that may not be adjacent in the original string

## When You'll See This Pattern

This "monotonic stack with last occurrence tracking" pattern appears in several problems:

1. **Find the Most Competitive Subsequence (LeetCode 1673)**
   - Very similar: find the most competitive (smallest) subsequence of length k
   - Uses the same stack approach but with a size limit

2. **Remove Duplicate Letters (LeetCode 316)**
   - This is essentially the same problem! The description is slightly different but the solution is identical.

3. **Smallest Subsequence of Distinct Characters (this problem)**
   - As we've seen, it's the exact same as Remove Duplicate Letters

4. **Create Maximum Number (LeetCode 321)**
   - More complex version that combines this pattern with merge operations

The core pattern: when you need to maintain a certain order while optimizing for lexicographical order, and you can remove elements if they appear later, consider a monotonic stack with last occurrence tracking.

## Key Takeaways

1. **Monotonic stacks are powerful for maintaining order while optimizing**
   - When you need to build a sequence with certain properties (like being smallest), and you can remove elements if they appear later, a monotonic stack is often the solution.

2. **Track last occurrences to know if you can skip now and use later**
   - The key insight is knowing whether a character appears again later in the string
   - This allows you to safely remove it from the stack now

3. **Greedy building with lookahead information works well for subsequence problems**
   - Process the string left to right
   - Make locally optimal decisions (include smaller characters earlier)
   - Use future information (last occurrences) to ensure globally optimal result

Related problems: [Find the Most Competitive Subsequence](/problem/find-the-most-competitive-subsequence)
