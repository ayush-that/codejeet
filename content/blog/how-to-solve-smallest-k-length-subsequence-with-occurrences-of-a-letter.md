---
title: "How to Solve Smallest K-Length Subsequence With Occurrences of a Letter — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Smallest K-Length Subsequence With Occurrences of a Letter. Hard difficulty, 39.7% acceptance rate. Topics: String, Stack, Greedy, Monotonic Stack."
date: "2026-04-24"
category: "dsa-patterns"
tags:
  [
    "smallest-k-length-subsequence-with-occurrences-of-a-letter",
    "string",
    "stack",
    "greedy",
    "hard",
  ]
---

# How to Solve Smallest K-Length Subsequence With Occurrences of a Letter

You need to find the lexicographically smallest subsequence of length `k` from string `s` that contains a specific `letter` at least `repetition` times. The challenge is balancing two competing constraints: we want the smallest lexicographic sequence, but we must also ensure we have enough of the required letter. This makes it tricky because greedy decisions about which characters to keep affect our ability to meet the letter count requirement later.

## Visual Walkthrough

Let's trace through an example: `s = "leetcode"`, `k = 4`, `letter = "e"`, `repetition = 2`.

We need a 4-character subsequence with at least 2 'e's that's lexicographically smallest. Let's think step by step:

1. **Initial state**: We'll build our result character by character. We need to leave enough characters after each choice to still reach length `k` with enough `letter`s.

2. **First character choice**: Look at "l" (index 0). If we skip "l", can we still build a valid sequence? Remaining characters: "eetcode" (7 chars). We need 3 more after this (total 4). Yes, possible. Should we take "l"? Compare with next character "e" - "e" < "l", so we should skip "l" and consider taking "e" instead.

3. **Take first 'e' (index 1)**: Result so far: "e". Remaining needed: 3 characters with at least 1 more 'e'.

4. **Next choice at index 2 ("e")**: Should we take it? If we skip, we have "tcode" left (5 chars). We need 2 more with at least 1 more 'e'. Possible. Compare "e" with next "t": "e" < "t", so we should take it. Result: "ee".

5. **Next choice at index 3 ("t")**: Result so far: "ee". Need 2 more with 0 more 'e's required (already have 2). If we skip "t", we have "code" left (4 chars). We need 2 more. Compare "t" with next "c": "c" < "t", so we should skip "t".

6. **Take "c" (index 4)**: Result: "eec". Need 1 more.

7. **Take "o" (index 5)**: Result: "eeco". Need 0 more. Done.

Final result: `"eeco"` (has 2 'e's, length 4, lexicographically smallest).

The key insight: we need to know how many `letter`s remain at each position to make informed decisions about whether we can skip a `letter` when we see it.

## Brute Force Approach

A naive approach would generate all possible subsequences of length `k`, filter those with at least `repetition` occurrences of `letter`, and return the lexicographically smallest. For a string of length `n`, there are C(n, k) possible subsequences, which grows factorially. Even for moderate `n` and `k`, this is computationally infeasible.

Another brute force idea: try all possible starting positions and build greedily, but this doesn't guarantee the globally optimal solution because early greedy choices might prevent meeting the `letter` requirement later.

## Optimized Approach

The optimal solution uses a **monotonic stack** approach similar to "Remove Duplicate Letters" but with additional constraints. Here's the step-by-step reasoning:

1. **Precompute suffix counts**: For each position `i`, calculate how many occurrences of `letter` remain from `i` to the end. This tells us if we can afford to skip a `letter` at position `i`.

2. **Use a stack to build result**: Process characters left to right, maintaining a stack for our result. At each character:
   - While we can pop from the stack (making result lexicographically smaller) AND we won't violate constraints (can still reach length `k` with enough `letter`s), pop.
   - Push current character if we have room in our result.

3. **Track constraints**:
   - `in_stack`: How many `letter`s are already in our result.
   - `remaining`: How many more characters we need to add.
   - `letter_remaining`: How many `letter`s remain after current position.

4. **Special handling for `letter`**: When we see the target `letter`, we must be more careful about popping it from the stack, as we need to ensure we still have enough `letter`s to meet the `repetition` requirement.

5. **Post-processing**: If our stack exceeds length `k`, truncate from the end. If we have more than enough `letter`s, we might need to remove some from the end while maintaining lexicographic order.

The key insight is that we maintain a lexicographically increasing stack (like in "Remove K Digits") while ensuring we can still meet all constraints.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def smallestSubsequence(self, s: str, k: int, letter: str, repetition: int) -> str:
    """
    Find lexicographically smallest subsequence of length k
    with at least 'repetition' occurrences of 'letter'.
    """
    n = len(s)

    # Step 1: Precompute suffix counts of 'letter'
    # letter_remaining[i] = number of 'letter' from i to end
    letter_remaining = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        letter_remaining[i] = letter_remaining[i + 1] + (1 if s[i] == letter else 0)

    # Step 2: Use stack to build smallest subsequence
    stack = []
    in_stack = 0  # count of 'letter' in stack

    for i, ch in enumerate(s):
        # While we can pop from stack to get smaller lexicographic order
        # and still meet all constraints
        while stack and stack[-1] > ch:
            # Check if popping stack[-1] would violate constraints
            popped_is_letter = stack[-1] == letter

            # We need enough total characters left to reach length k
            # len(stack) - 1 + (n - i) >= k
            # AND we need enough 'letter' left to meet repetition requirement
            # (in_stack - (1 if popped_is_letter else 0)) + letter_remaining[i] >= repetition
            if (len(stack) - 1 + (n - i) >= k and
                (in_stack - (1 if popped_is_letter else 0)) + letter_remaining[i] >= repetition):
                # Safe to pop
                if popped_is_letter:
                    in_stack -= 1
                stack.pop()
            else:
                # Cannot pop without violating constraints
                break

        # Push current character if we have room
        if len(stack) < k:
            if ch == letter:
                in_stack += 1
            stack.append(ch)
        else:
            # If stack is already at length k, we might replace last character
            # if current character is 'letter' and we need more 'letter's
            if ch == letter and in_stack < repetition:
                # Find last non-'letter' to replace
                for j in range(k - 1, -1, -1):
                    if stack[j] != letter:
                        # Replace it with current 'letter'
                        stack[j] = letter
                        in_stack += 1
                        break

    # Step 3: Ensure we have enough 'letter's
    # If we have more than enough 'letter's, we might be able to
    # replace some with smaller characters from the end
    if in_stack > repetition:
        # Try to replace excess 'letter's from the end with smaller chars if possible
        for i in range(k - 1, -1, -1):
            if stack[i] == letter:
                # Check if we can replace this 'letter' with a smaller char
                # while maintaining enough 'letter's
                if in_stack - 1 >= repetition:
                    # Look for a smaller character to the right
                    for j in range(i + 1, k):
                        if stack[j] < letter:
                            # Found smaller char, replace the 'letter'
                            stack[i] = stack[j]
                            # Shift remaining characters
                            for l in range(j, k - 1):
                                stack[l] = stack[l + 1]
                            stack[k - 1] = letter
                            in_stack -= 1
                            break

    return ''.join(stack)
```

```javascript
// Time: O(n) | Space: O(n)
function smallestSubsequence(s, k, letter, repetition) {
  const n = s.length;

  // Step 1: Precompute suffix counts of 'letter'
  // letterRemaining[i] = number of 'letter' from i to end
  const letterRemaining = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    letterRemaining[i] = letterRemaining[i + 1] + (s[i] === letter ? 1 : 0);
  }

  // Step 2: Use stack to build smallest subsequence
  const stack = [];
  let inStack = 0; // count of 'letter' in stack

  for (let i = 0; i < n; i++) {
    const ch = s[i];

    // While we can pop from stack to get smaller lexicographic order
    // and still meet all constraints
    while (stack.length > 0 && stack[stack.length - 1] > ch) {
      // Check if popping stack top would violate constraints
      const poppedIsLetter = stack[stack.length - 1] === letter;

      // We need enough total characters left to reach length k
      // AND enough 'letter' left to meet repetition requirement
      if (
        stack.length - 1 + (n - i) >= k &&
        inStack - (poppedIsLetter ? 1 : 0) + letterRemaining[i] >= repetition
      ) {
        // Safe to pop
        if (poppedIsLetter) inStack--;
        stack.pop();
      } else {
        // Cannot pop without violating constraints
        break;
      }
    }

    // Push current character if we have room
    if (stack.length < k) {
      if (ch === letter) inStack++;
      stack.push(ch);
    } else {
      // If stack is already at length k, we might replace last character
      // if current character is 'letter' and we need more 'letter's
      if (ch === letter && inStack < repetition) {
        // Find last non-'letter' to replace
        for (let j = k - 1; j >= 0; j--) {
          if (stack[j] !== letter) {
            // Replace it with current 'letter'
            stack[j] = letter;
            inStack++;
            break;
          }
        }
      }
    }
  }

  // Step 3: Ensure we have enough 'letter's
  // If we have more than enough 'letter's, we might be able to
  // replace some with smaller characters from the end
  if (inStack > repetition) {
    // Try to replace excess 'letter's from the end with smaller chars if possible
    for (let i = k - 1; i >= 0; i--) {
      if (stack[i] === letter) {
        // Check if we can replace this 'letter' with a smaller char
        // while maintaining enough 'letter's
        if (inStack - 1 >= repetition) {
          // Look for a smaller character to the right
          for (let j = i + 1; j < k; j++) {
            if (stack[j] < letter) {
              // Found smaller char, replace the 'letter'
              stack[i] = stack[j];
              // Shift remaining characters
              for (let l = j; l < k - 1; l++) {
                stack[l] = stack[l + 1];
              }
              stack[k - 1] = letter;
              inStack--;
              break;
            }
          }
        }
      }
    }
  }

  return stack.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String smallestSubsequence(String s, int k, char letter, int repetition) {
        int n = s.length();

        // Step 1: Precompute suffix counts of 'letter'
        // letterRemaining[i] = number of 'letter' from i to end
        int[] letterRemaining = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            letterRemaining[i] = letterRemaining[i + 1] + (s.charAt(i) == letter ? 1 : 0);
        }

        // Step 2: Use stack to build smallest subsequence
        StringBuilder stack = new StringBuilder();
        int inStack = 0;  // count of 'letter' in stack

        for (int i = 0; i < n; i++) {
            char ch = s.charAt(i);

            // While we can pop from stack to get smaller lexicographic order
            // and still meet all constraints
            while (stack.length() > 0 && stack.charAt(stack.length() - 1) > ch) {
                // Check if popping stack top would violate constraints
                boolean poppedIsLetter = stack.charAt(stack.length() - 1) == letter;

                // We need enough total characters left to reach length k
                // AND enough 'letter' left to meet repetition requirement
                if (stack.length() - 1 + (n - i) >= k &&
                    (inStack - (poppedIsLetter ? 1 : 0)) + letterRemaining[i] >= repetition) {
                    // Safe to pop
                    if (poppedIsLetter) inStack--;
                    stack.deleteCharAt(stack.length() - 1);
                } else {
                    // Cannot pop without violating constraints
                    break;
                }
            }

            // Push current character if we have room
            if (stack.length() < k) {
                if (ch == letter) inStack++;
                stack.append(ch);
            } else {
                // If stack is already at length k, we might replace last character
                // if current character is 'letter' and we need more 'letter's
                if (ch == letter && inStack < repetition) {
                    // Find last non-'letter' to replace
                    for (int j = k - 1; j >= 0; j--) {
                        if (stack.charAt(j) != letter) {
                            // Replace it with current 'letter'
                            stack.setCharAt(j, letter);
                            inStack++;
                            break;
                        }
                    }
                }
            }
        }

        // Step 3: Ensure we have enough 'letter's
        // If we have more than enough 'letter's, we might be able to
        // replace some with smaller characters from the end
        if (inStack > repetition) {
            // Try to replace excess 'letter's from the end with smaller chars if possible
            for (int i = k - 1; i >= 0; i--) {
                if (stack.charAt(i) == letter) {
                    // Check if we can replace this 'letter' with a smaller char
                    // while maintaining enough 'letter's
                    if (inStack - 1 >= repetition) {
                        // Look for a smaller character to the right
                        for (int j = i + 1; j < k; j++) {
                            if (stack.charAt(j) < letter) {
                                // Found smaller char, replace the 'letter'
                                stack.setCharAt(i, stack.charAt(j));
                                // Shift remaining characters
                                for (int l = j; l < k - 1; l++) {
                                    stack.setCharAt(l, stack.charAt(l + 1));
                                }
                                stack.setCharAt(k - 1, letter);
                                inStack--;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return stack.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Precomputing suffix counts: O(n) single pass
- Main stack processing: O(n) - each character pushed/popped at most once
- Post-processing for excess letters: O(k²) in worst case, but k ≤ n and typically much smaller
- Overall dominated by O(n)

**Space Complexity: O(n)**

- Suffix count array: O(n)
- Stack for result: O(k) ≤ O(n)
- Additional variables: O(1)
- Total: O(n)

## Common Mistakes

1. **Forgetting to check both constraints when popping**: Candidates often check only if they have enough characters remaining, forgetting to check if they'll still have enough `letter`s. Both constraints must be satisfied before popping.

2. **Incorrect suffix count calculation**: The suffix array should be `n+1` length with `letter_remaining[n] = 0`. A common error is making it length `n` and getting index errors.

3. **Not handling the case when stack is already at length k**: When we see a `letter` and need more `letter`s but our stack is full, we need to replace a non-`letter` from the stack. Missing this case leads to insufficient `letter`s.

4. **Over-optimizing the post-processing**: Some candidates try to skip the post-processing step, but it's necessary when we have more `letter`s than needed and could replace one with a smaller character from later in the sequence.

## When You'll See This Pattern

This problem combines **monotonic stack** with **constraint tracking**, a pattern seen in:

1. **Remove Duplicate Letters (LeetCode 316)**: Similar monotonic stack approach to get lexicographically smallest subsequence with all unique letters.

2. **Remove K Digits (LeetCode 402)**: Use monotonic stack to remove digits while maintaining order to get smallest number.

3. **Create Maximum Number (LeetCode 321)**: More complex version where you merge two subsequences, but uses similar constraint-aware stack operations.

The core pattern is: when you need a lexicographically smallest subsequence with constraints, think monotonic stack with careful constraint checking at each pop operation.

## Key Takeaways

1. **Monotonic stack + constraint tracking**: When building lexicographically smallest sequences with additional requirements, maintain a stack and check constraints before each pop.

2. **Precompute suffix information**: When decisions depend on what comes later, precomputing suffix counts (or other information) allows O(1) constraint checking.

3. **Balance competing objectives**: This problem requires balancing "smallest lexicographic order" with "enough of a specific letter." The solution carefully checks both constraints at each decision point.

Related problems: [Remove Duplicate Letters](/problem/remove-duplicate-letters), [Subarray With Elements Greater Than Varying Threshold](/problem/subarray-with-elements-greater-than-varying-threshold), [Find the Lexicographically Smallest Valid Sequence](/problem/find-the-lexicographically-smallest-valid-sequence)
