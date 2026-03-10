---
title: "How to Solve Remove Adjacent Almost-Equal Characters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Adjacent Almost-Equal Characters. Medium difficulty, 53.1% acceptance rate. Topics: String, Dynamic Programming, Greedy."
date: "2029-05-29"
category: "dsa-patterns"
tags:
  ["remove-adjacent-almost-equal-characters", "string", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Remove Adjacent Almost-Equal Characters

This problem asks us to modify a string so that no two adjacent characters are "almost-equal" - meaning they differ by at most 1 in their alphabetical positions. For example, 'a' and 'b' are almost-equal, but 'a' and 'c' are not. The challenge is finding the minimum number of character changes needed to eliminate all such adjacent pairs throughout the entire string.

What makes this problem interesting is that changing one character can affect both its left and right neighbors, creating a chain reaction. A greedy approach might seem tempting, but we need to carefully consider how each change impacts future decisions.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the string `word = "abca"`:

1. **Initial string**: `a b c a`
   - Positions: 0:a, 1:b, 2:c, 3:a
   - Check adjacent pairs:
     - `a`(0) and `b`(1): difference = 1 → almost-equal ❌
     - `b`(1) and `c`(2): difference = 1 → almost-equal ❌
     - `c`(2) and `a`(3): difference = 2 → NOT almost-equal ✓

2. **First operation**: We need to fix the first violation at positions 0-1.
   - Option 1: Change `b` at position 1 to something not almost-equal to `a`
   - Best choice: Change `b` to `c` (or any letter except 'a', 'b', 'z')
   - New string: `a c c a`
   - Check pairs:
     - `a`(0) and `c`(1): difference = 2 → ✓
     - `c`(1) and `c`(2): difference = 0 → almost-equal ❌ (new problem!)

3. **Second operation**: Fix positions 1-2.
   - Change `c` at position 2 to something not almost-equal to `c` at position 1
   - Best choice: Change to `a` (or any letter except 'b', 'c', 'd')
   - New string: `a c a a`
   - Check pairs:
     - `a`(0) and `c`(1): difference = 2 → ✓
     - `c`(1) and `a`(2): difference = 2 → ✓
     - `a`(2) and `a`(3): difference = 0 → almost-equal ❌ (another problem!)

4. **Third operation**: Fix positions 2-3.
   - Change `a` at position 3 to something not almost-equal to `a` at position 2
   - Best choice: Change to `c`
   - Final string: `a c a c`
   - All adjacent pairs are safe: (a,c)=2, (c,a)=2, (a,c)=2

We needed 3 operations. But could we have done better with different choices?

Let's try a smarter approach: When we find a violation, we can look ahead and make a change that prevents future violations. The key insight is that we only need to check each character against its immediate neighbor to the right, and when we make a change, we should choose a letter that won't create new problems with either neighbor.

## Brute Force Approach

A brute force approach would try all possible modifications until we find a valid string with minimal changes. For each position, we could try:

1. Keep the current character
2. Change it to any of the 25 other letters

This leads to 26^n possibilities to check (where n is the string length), which is completely infeasible for even moderately sized strings (26^10 ≈ 1.4×10^14).

A slightly better brute force would use backtracking: try changing characters one by one, checking validity after each change, and backtrack when we exceed a potential minimum. However, this is still exponential in the worst case and doesn't give us the optimal solution efficiently.

## Optimized Approach

The optimal solution uses a **greedy approach** with a simple insight: we only need to look at each character in relation to its right neighbor. When we find two adjacent characters that are almost-equal, we should change the second character to break the violation.

Why change the second character instead of the first? Because changing the second character only affects its relationship with the character to its right (which we haven't checked yet), while changing the first character would require re-checking the pair to its left.

The algorithm works as follows:

1. Initialize a counter for operations
2. Iterate through the string from left to right
3. For each position `i` (starting from 0), check if `word[i]` and `word[i+1]` are almost-equal
4. If they are, increment the counter and change `word[i+1]` to a safe character
5. A "safe" character is one that's not almost-equal to either:
   - The character at position `i` (the left neighbor)
   - The character at position `i+2` (the right neighbor, if it exists)

The beauty of this approach is that by always changing the second character in a violating pair, we ensure that:

- The current violation is fixed
- We don't create a new violation with the character to the left
- We can choose a character that won't create a violation with the character to the right

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) if we modify in-place, O(n) if we create a new string
def removeAlmostEqualCharacters(word: str) -> int:
    """
    Returns the minimum number of operations needed to remove all adjacent
    almost-equal characters from the string.

    Two characters are almost-equal if their absolute difference in
    alphabetical position is at most 1.
    """
    # Convert string to list for mutable operations
    chars = list(word)
    operations = 0

    # Iterate through the string, checking each character with its right neighbor
    for i in range(len(chars) - 1):
        # Check if current character and next character are almost-equal
        if abs(ord(chars[i]) - ord(chars[i + 1])) <= 1:
            operations += 1

            # We need to change chars[i+1] to a character that's not almost-equal
            # to either chars[i] (left neighbor) or chars[i+2] (right neighbor)

            # Try all lowercase letters to find a safe one
            for new_char in range(ord('a'), ord('z') + 1):
                # Check if this character is safe with left neighbor
                if abs(ord(chars[i]) - new_char) > 1:
                    # If there's a right neighbor, check it too
                    if i + 2 < len(chars):
                        if abs(ord(chars[i + 2]) - new_char) > 1:
                            chars[i + 1] = chr(new_char)
                            break
                    else:
                        # No right neighbor, just need to satisfy left neighbor
                        chars[i + 1] = chr(new_char)
                        break

    return operations
```

```javascript
// Time: O(n) | Space: O(n) for the character array
function removeAlmostEqualCharacters(word) {
  /**
   * Returns the minimum number of operations needed to remove all adjacent
   * almost-equal characters from the string.
   *
   * Two characters are almost-equal if their absolute difference in
   * alphabetical position is at most 1.
   */
  // Convert string to array for mutable operations
  const chars = word.split("");
  let operations = 0;

  // Iterate through the string, checking each character with its right neighbor
  for (let i = 0; i < chars.length - 1; i++) {
    // Check if current character and next character are almost-equal
    if (Math.abs(chars[i].charCodeAt(0) - chars[i + 1].charCodeAt(0)) <= 1) {
      operations++;

      // We need to change chars[i+1] to a character that's not almost-equal
      // to either chars[i] (left neighbor) or chars[i+2] (right neighbor)

      // Try all lowercase letters to find a safe one
      for (let newCharCode = "a".charCodeAt(0); newCharCode <= "z".charCodeAt(0); newCharCode++) {
        // Check if this character is safe with left neighbor
        if (Math.abs(chars[i].charCodeAt(0) - newCharCode) > 1) {
          // If there's a right neighbor, check it too
          if (i + 2 < chars.length) {
            if (Math.abs(chars[i + 2].charCodeAt(0) - newCharCode) > 1) {
              chars[i + 1] = String.fromCharCode(newCharCode);
              break;
            }
          } else {
            // No right neighbor, just need to satisfy left neighbor
            chars[i + 1] = String.fromCharCode(newCharCode);
            break;
          }
        }
      }
    }
  }

  return operations;
}
```

```java
// Time: O(n) | Space: O(n) for the character array
class Solution {
    public int removeAlmostEqualCharacters(String word) {
        /**
         * Returns the minimum number of operations needed to remove all adjacent
         * almost-equal characters from the string.
         *
         * Two characters are almost-equal if their absolute difference in
         * alphabetical position is at most 1.
         */
        // Convert string to char array for mutable operations
        char[] chars = word.toCharArray();
        int operations = 0;

        // Iterate through the string, checking each character with its right neighbor
        for (int i = 0; i < chars.length - 1; i++) {
            // Check if current character and next character are almost-equal
            if (Math.abs(chars[i] - chars[i + 1]) <= 1) {
                operations++;

                // We need to change chars[i+1] to a character that's not almost-equal
                // to either chars[i] (left neighbor) or chars[i+2] (right neighbor)

                // Try all lowercase letters to find a safe one
                for (char newChar = 'a'; newChar <= 'z'; newChar++) {
                    // Check if this character is safe with left neighbor
                    if (Math.abs(chars[i] - newChar) > 1) {
                        // If there's a right neighbor, check it too
                        if (i + 2 < chars.length) {
                            if (Math.abs(chars[i + 2] - newChar) > 1) {
                                chars[i + 1] = newChar;
                                break;
                            }
                        } else {
                            // No right neighbor, just need to satisfy left neighbor
                            chars[i + 1] = newChar;
                            break;
                        }
                    }
                }
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once: O(n)
- For each violation, we try up to 26 letters to find a safe replacement: O(26) = O(1)
- In the worst case, if every adjacent pair violates the condition, we have n-1 violations
- Total: O(n × 26) = O(n)

**Space Complexity: O(n)**

- We create a mutable copy of the string (list/array of characters): O(n)
- We could optimize to O(1) by modifying the string in-place if the language allows it, but in practice, strings are often immutable, so we need a character array

## Common Mistakes

1. **Changing the wrong character in a violating pair**: Some candidates change the first character instead of the second. This requires re-checking the previous pair and can lead to infinite loops or incorrect counts. Always change the second character to avoid affecting already-validated pairs.

2. **Not considering the right neighbor when choosing a replacement**: If you only check that the new character isn't almost-equal to the left neighbor, you might create a new violation with the right neighbor. Always check both neighbors when possible.

3. **Off-by-one errors in the loop**: The loop should go up to `len(chars) - 2` (or `i < len(chars) - 1`) to avoid index out of bounds when checking `chars[i+1]`. Forgetting the `-1` will cause an error on the last iteration.

4. **Assuming only specific replacements work**: Some candidates try to optimize by always choosing 'z' or 'a', but these might create violations with the right neighbor. The safe approach is to try all letters until you find one that works with both neighbors.

## When You'll See This Pattern

This greedy "fix as you go" pattern appears in many string manipulation problems:

1. **Minimum Changes To Make Alternating Binary String** (LeetCode 1758): Similar concept of minimizing changes to avoid adjacent equal characters, though simpler since it's binary.

2. **Minimum Number of Swaps to Make the String Balanced** (LeetCode 1963): Uses a similar incremental approach to fix imbalances as you traverse the string.

3. **Minimum Add to Make Parentheses Valid** (LeetCode 921): Another problem where you track violations as you go and fix them incrementally.

The key insight in all these problems is that you can make locally optimal choices (fixing each violation as you encounter it) that lead to a globally optimal solution.

## Key Takeaways

1. **Greedy can work for adjacent constraint problems**: When the problem involves constraints between adjacent elements, a left-to-right greedy approach often works because each decision only affects future elements, not past ones.

2. **Change the later element in a violating pair**: When fixing adjacent violations, always modify the second element to avoid affecting already-processed pairs. This ensures you don't need to backtrack.

3. **Consider both neighbors when making changes**: When modifying an element to fix a violation with its left neighbor, make sure you don't create a new violation with its right neighbor.

Related problems: [Minimum Changes To Make Alternating Binary String](/problem/minimum-changes-to-make-alternating-binary-string)
