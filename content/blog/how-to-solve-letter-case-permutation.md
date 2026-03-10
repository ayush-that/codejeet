---
title: "How to Solve Letter Case Permutation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Letter Case Permutation. Medium difficulty, 75.7% acceptance rate. Topics: String, Backtracking, Bit Manipulation."
date: "2027-09-07"
category: "dsa-patterns"
tags: ["letter-case-permutation", "string", "backtracking", "bit-manipulation", "medium"]
---

# How to Solve Letter Case Permutation

This problem asks us to generate all possible strings by transforming each letter in the input string to either lowercase or uppercase, while leaving digits unchanged. What makes this interesting is that we need to explore all possible combinations of case transformations, which grows exponentially with the number of letters in the string. The challenge is to generate these permutations efficiently without missing any possibilities.

## Visual Walkthrough

Let's trace through an example: `s = "a1b"`

We'll build our permutations step by step:

1. Start with an empty string: `""`
2. Process character 'a' (a letter):
   - Add lowercase 'a': `"a"`
   - Add uppercase 'A': `"A"`
3. Process character '1' (a digit):
   - Append '1' to both current strings:
     - `"a"` → `"a1"`
     - `"A"` → `"A1"`
4. Process character 'b' (a letter):
   - For `"a1"`: add lowercase 'b' → `"a1b"`, add uppercase 'B' → `"a1B"`
   - For `"A1"`: add lowercase 'b' → `"A1b"`, add uppercase 'B' → `"A1B"`

Final permutations: `["a1b", "a1B", "A1b", "A1B"]`

Notice how each letter doubles the number of possibilities. With `k` letters, we get `2^k` permutations.

## Brute Force Approach

A naive approach might try to generate all possible strings by iterating through all possible case combinations using nested loops. However, this becomes impractical because:

- The number of loops needed depends on the number of letters in the string
- We'd need to write recursive code or dynamic loops to handle variable string lengths
- Without a systematic approach, we might miss some permutations or generate duplicates

The brute force would essentially be what we'll implement as the optimal solution, but let's think about what an inefficient version might look like: we could generate all binary strings of length equal to the number of letters (where 0 = lowercase, 1 = uppercase), then apply those patterns to the original string. This would work but requires extra steps to map between letter positions and the binary pattern.

## Optimized Approach

The key insight is that this is a classic **backtracking/DFS problem** where we need to explore all possible decisions at each step. For each character:

- If it's a digit: we have only one choice - include it as-is
- If it's a letter: we have two choices - include it as lowercase or uppercase

We can build the permutations recursively:

1. Start with an empty string and index 0
2. At each step, check if we've reached the end of the string
3. If not, process the current character:
   - If it's a digit: add it and recurse to the next position
   - If it's a letter: create two branches - one with lowercase, one with uppercase

This approach naturally explores all `2^k` possibilities without duplication.

Alternatively, we can use an **iterative BFS approach**:

1. Start with a list containing just the empty string
2. For each character in the input:
   - If it's a digit: append it to all strings in the current list
   - If it's a letter: for each string in the current list, create two new strings - one with lowercase letter, one with uppercase

Both approaches have the same time complexity, but the iterative approach might be easier to understand for some.

## Optimal Solution

Here's the complete solution using backtracking (DFS):

<div class="code-group">

```python
# Time: O(n * 2^k) where n is length of string, k is number of letters
# Space: O(n * 2^k) for the output, O(n) for recursion stack
def letterCasePermutation(s: str):
    result = []

    def backtrack(current: str, index: int):
        # Base case: if we've processed all characters
        if index == len(s):
            result.append(current)
            return

        # Get the current character
        char = s[index]

        # If character is a digit, we have only one choice
        if char.isdigit():
            # Append digit and move to next position
            backtrack(current + char, index + 1)
        else:
            # For letters, we have two choices: lowercase and uppercase
            # Branch 1: lowercase version
            backtrack(current + char.lower(), index + 1)
            # Branch 2: uppercase version
            backtrack(current + char.upper(), index + 1)

    # Start backtracking from empty string and index 0
    backtrack("", 0)
    return result
```

```javascript
// Time: O(n * 2^k) where n is length of string, k is number of letters
// Space: O(n * 2^k) for the output, O(n) for recursion stack
function letterCasePermutation(s) {
  const result = [];

  function backtrack(current, index) {
    // Base case: if we've processed all characters
    if (index === s.length) {
      result.push(current);
      return;
    }

    // Get the current character
    const char = s[index];

    // If character is a digit, we have only one choice
    if (char >= "0" && char <= "9") {
      // Append digit and move to next position
      backtrack(current + char, index + 1);
    } else {
      // For letters, we have two choices: lowercase and uppercase
      // Branch 1: lowercase version
      backtrack(current + char.toLowerCase(), index + 1);
      // Branch 2: uppercase version
      backtrack(current + char.toUpperCase(), index + 1);
    }
  }

  // Start backtracking from empty string and index 0
  backtrack("", 0);
  return result;
}
```

```java
// Time: O(n * 2^k) where n is length of string, k is number of letters
// Space: O(n * 2^k) for the output, O(n) for recursion stack
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> letterCasePermutation(String s) {
        List<String> result = new ArrayList<>();
        backtrack(result, new StringBuilder(), s, 0);
        return result;
    }

    private void backtrack(List<String> result, StringBuilder current, String s, int index) {
        // Base case: if we've processed all characters
        if (index == s.length()) {
            result.add(current.toString());
            return;
        }

        // Get the current character
        char ch = s.charAt(index);

        // If character is a digit, we have only one choice
        if (Character.isDigit(ch)) {
            // Append digit and move to next position
            current.append(ch);
            backtrack(result, current, s, index + 1);
            current.deleteCharAt(current.length() - 1); // Backtrack
        } else {
            // For letters, we have two choices: lowercase and uppercase

            // Branch 1: lowercase version
            current.append(Character.toLowerCase(ch));
            backtrack(result, current, s, index + 1);
            current.deleteCharAt(current.length() - 1); // Backtrack

            // Branch 2: uppercase version
            current.append(Character.toUpperCase(ch));
            backtrack(result, current, s, index + 1);
            current.deleteCharAt(current.length() - 1); // Backtrack
        }
    }
}
```

</div>

And here's the iterative BFS approach for comparison:

<div class="code-group">

```python
# Time: O(n * 2^k) where n is length of string, k is number of letters
# Space: O(n * 2^k) for the output
def letterCasePermutationIterative(s: str):
    # Start with list containing empty string
    permutations = [""]

    # Process each character in the string
    for char in s:
        new_permutations = []

        # For each existing permutation
        for perm in permutations:
            if char.isdigit():
                # If digit, just append it
                new_permutations.append(perm + char)
            else:
                # If letter, create two new permutations
                new_permutations.append(perm + char.lower())
                new_permutations.append(perm + char.upper())

        # Update permutations for next iteration
        permutations = new_permutations

    return permutations
```

```javascript
// Time: O(n * 2^k) where n is length of string, k is number of letters
// Space: O(n * 2^k) for the output
function letterCasePermutationIterative(s) {
  // Start with array containing empty string
  let permutations = [""];

  // Process each character in the string
  for (let char of s) {
    const newPermutations = [];

    // For each existing permutation
    for (let perm of permutations) {
      if (char >= "0" && char <= "9") {
        // If digit, just append it
        newPermutations.push(perm + char);
      } else {
        // If letter, create two new permutations
        newPermutations.push(perm + char.toLowerCase());
        newPermutations.push(perm + char.toUpperCase());
      }
    }

    // Update permutations for next iteration
    permutations = newPermutations;
  }

  return permutations;
}
```

```java
// Time: O(n * 2^k) where n is length of string, k is number of letters
// Space: O(n * 2^k) for the output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> letterCasePermutationIterative(String s) {
        // Start with list containing empty string
        List<String> permutations = new ArrayList<>();
        permutations.add("");

        // Process each character in the string
        for (char ch : s.toCharArray()) {
            List<String> newPermutations = new ArrayList<>();

            // For each existing permutation
            for (String perm : permutations) {
                if (Character.isDigit(ch)) {
                    // If digit, just append it
                    newPermutations.add(perm + ch);
                } else {
                    // If letter, create two new permutations
                    newPermutations.add(perm + Character.toLowerCase(ch));
                    newPermutations.add(perm + Character.toUpperCase(ch));
                }
            }

            // Update permutations for next iteration
            permutations = newPermutations;
        }

        return permutations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * 2^k)` where `n` is the length of the string and `k` is the number of letters.

- We generate `2^k` permutations (each letter doubles the possibilities)
- Each permutation has length `n`, so building each one takes `O(n)` time
- The total is `O(n * 2^k)`

**Space Complexity:** `O(n * 2^k)` for storing all permutations in the output.

- We have `2^k` strings, each of length `n`
- Additionally, the recursive approach uses `O(n)` stack space for recursion
- The iterative approach uses `O(n * 2^k)` for the current and next lists

## Common Mistakes

1. **Forgetting to handle digits differently from letters**: Some candidates try to apply case transformation to digits, which would either throw an error or produce incorrect results. Always check `char.isdigit()` or equivalent.

2. **Not backtracking properly in the recursive solution**: In the Java version, forgetting to remove the last character after each recursive call leads to incorrect string buildup. Each recursive call should clean up after itself.

3. **Creating unnecessary string copies**: In Python/JavaScript, strings are immutable so `current + char` creates a new string automatically. In Java with `StringBuilder`, you need to manually backtrack by removing the last character.

4. **Missing the base case in recursion**: Forgetting to check `if index == len(s)` leads to infinite recursion or index out of bounds errors.

5. **Case sensitivity issues with non-alphabetic characters**: Some candidates check `char.isalpha()` instead of testing for case transformation capability. While `isalpha()` works for this problem, being explicit about case transformation is clearer.

## When You'll See This Pattern

This backtracking/DFS pattern appears in many combinatorial problems:

1. **Subsets (LeetCode 78)**: Generate all possible subsets of a set. Similar branching - for each element, either include it or don't.

2. **Brace Expansion (LeetCode 1087)**: Generate all combinations from strings with optional parts in braces. The branching happens when you encounter braces with multiple options.

3. **Generate Parentheses (LeetCode 22)**: Generate all valid combinations of n pairs of parentheses. You branch by adding '(' or ')' with constraints.

4. **Permutations (LeetCode 46)**: Generate all permutations of a list. You branch by choosing which element to place at each position.

The common theme is exploring all possible combinations/permutations by making decisions at each step and backtracking to explore other possibilities.

## Key Takeaways

1. **Recognize combinatorial problems**: When a problem asks for "all possible" combinations/permutations and the number grows exponentially, think backtracking/DFS.

2. **Branching factor matters**: At each decision point, identify how many choices you have. Here it's 1 for digits, 2 for letters. This determines the time complexity.

3. **Choose between recursion and iteration**: Recursive DFS is often cleaner for backtracking problems, but iterative BFS can be more memory efficient in some cases and avoids recursion depth limits.

4. **Mind your base case**: In recursion, always define when to stop (usually when you've processed all input elements) and when to record a complete solution.

Related problems: [Subsets](/problem/subsets), [Brace Expansion](/problem/brace-expansion)
