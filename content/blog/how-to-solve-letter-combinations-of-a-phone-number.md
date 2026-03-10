---
title: "How to Solve Letter Combinations of a Phone Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Letter Combinations of a Phone Number. Medium difficulty, 65.5% acceptance rate. Topics: Hash Table, String, Backtracking."
date: "2026-04-04"
category: "dsa-patterns"
tags: ["letter-combinations-of-a-phone-number", "hash-table", "string", "backtracking", "medium"]
---

# How to Solve Letter Combinations of a Phone Number

This problem asks us to generate all possible letter combinations that a given string of digits (2-9) could represent based on a telephone keypad mapping. What makes this problem interesting is that it's a classic **combinatorial generation** problem—each digit maps to 3-4 letters, and we need to explore all possible combinations systematically. The challenge lies in efficiently generating these combinations without missing any or creating duplicates.

## Visual Walkthrough

Let's trace through the example `digits = "23"` step by step:

**Digit mapping:**

- 2 → "abc"
- 3 → "def"

**Step-by-step generation:**

1. Start with an empty combination: `""`
2. Process digit '2':
   - For each letter in "abc", append to current combination:
     - "a", "b", "c"
3. Process digit '3':
   - For each current combination, append each letter from "def":
     - "a" + "d" = "ad"
     - "a" + "e" = "ae"
     - "a" + "f" = "af"
     - "b" + "d" = "bd"
     - "b" + "e" = "be"
     - "b" + "f" = "bf"
     - "c" + "d" = "cd"
     - "c" + "e" = "ce"
     - "c" + "f" = "cf"

**Final result:** `["ad","ae","af","bd","be","bf","cd","ce","cf"]`

This process naturally suggests a **backtracking** approach where we build combinations recursively, exploring all possibilities at each digit position.

## Brute Force Approach

A naive approach might try to use nested loops, but this quickly becomes impractical. For example, with 3 digits, you'd need 3 nested loops; with 4 digits, 4 nested loops, etc. The number of loops would need to equal the length of the input string, which we don't know at compile time.

What a candidate might initially try:

- Write a fixed number of nested loops (e.g., for 3-digit inputs)
- Hardcode the digit-to-letter mappings
- Manually combine letters

This approach fails because:

1. It only works for inputs of a specific length
2. The code would need to be rewritten for different input lengths
3. It's not scalable or maintainable

The key insight is that we need a **dynamic approach** that can handle any input length without rewriting code.

## Optimized Approach

The optimal solution uses **backtracking** (depth-first search) to systematically explore all possible combinations. Here's the reasoning:

1. **Problem decomposition**: Each digit contributes a set of possible letters. We need to choose one letter from each digit's set and combine them.
2. **Decision tree**: Think of this as walking down a tree where:
   - Each level corresponds to a digit position
   - Each node branches to all letters mapped to that digit
   - Leaves represent complete combinations
3. **Backtracking pattern**:
   - Start with an empty string
   - At each step (digit position), try all possible letters for that digit
   - Append a letter, recurse to the next digit
   - When we reach the end of digits, save the combination
   - Remove the last letter (backtrack) to try the next possibility
4. **Base case**: When our current combination length equals the input digits length, we've formed a complete combination.

This approach efficiently explores the entire solution space without duplication and handles any input length naturally.

## Optimal Solution

Here's the complete solution using backtracking:

<div class="code-group">

```python
# Time: O(4^n * n) where n = len(digits) - in worst case each digit has 4 letters
# Space: O(n) for recursion stack and O(4^n) for output
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        # Handle edge case: empty input
        if not digits:
            return []

        # Define the digit to letters mapping
        digit_to_letters = {
            '2': "abc",
            '3': "def",
            '4': "ghi",
            '5': "jkl",
            '6': "mno",
            '7': "pqrs",
            '8': "tuv",
            '9': "wxyz"
        }

        result = []

        def backtrack(index, current_combination):
            """
            Recursive backtracking function to build combinations.

            Args:
                index: Current position in digits string (which digit we're processing)
                current_combination: The combination built so far
            """
            # Base case: if we've processed all digits, add the complete combination
            if index == len(digits):
                result.append(current_combination)
                return

            # Get the current digit and its corresponding letters
            current_digit = digits[index]
            letters = digit_to_letters[current_digit]

            # Try each possible letter for the current digit
            for letter in letters:
                # Append the letter and recurse to next digit
                backtrack(index + 1, current_combination + letter)
                # No explicit backtracking needed because we're passing a new string
                # In Python, current_combination + letter creates a new string

        # Start backtracking from the first digit with empty combination
        backtrack(0, "")

        return result
```

```javascript
// Time: O(4^n * n) where n = digits.length - in worst case each digit has 4 letters
// Space: O(n) for recursion stack and O(4^n) for output
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  // Handle edge case: empty input
  if (!digits || digits.length === 0) {
    return [];
  }

  // Define the digit to letters mapping
  const digitToLetters = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };

  const result = [];

  /**
   * Recursive backtracking function to build combinations.
   *
   * @param {number} index - Current position in digits string
   * @param {string} currentCombination - The combination built so far
   */
  function backtrack(index, currentCombination) {
    // Base case: if we've processed all digits, add the complete combination
    if (index === digits.length) {
      result.push(currentCombination);
      return;
    }

    // Get the current digit and its corresponding letters
    const currentDigit = digits[index];
    const letters = digitToLetters[currentDigit];

    // Try each possible letter for the current digit
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      // Append the letter and recurse to next digit
      backtrack(index + 1, currentCombination + letter);
      // No explicit backtracking needed because we're passing a new string
    }
  }

  // Start backtracking from the first digit with empty combination
  backtrack(0, "");

  return result;
};
```

```java
// Time: O(4^n * n) where n = digits.length() - in worst case each digit has 4 letters
// Space: O(n) for recursion stack and O(4^n) for output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();

        // Handle edge case: empty input
        if (digits == null || digits.length() == 0) {
            return result;
        }

        // Define the digit to letters mapping
        String[] digitToLetters = {
            "",     // 0
            "",     // 1
            "abc",  // 2
            "def",  // 3
            "ghi",  // 4
            "jkl",  // 5
            "mno",  // 6
            "pqrs", // 7
            "tuv",  // 8
            "wxyz"  // 9
        };

        // Start backtracking
        backtrack(digits, digitToLetters, 0, new StringBuilder(), result);

        return result;
    }

    /**
     * Recursive backtracking function to build combinations.
     *
     * @param digits The input digits string
     * @param digitToLetters Mapping from digit to corresponding letters
     * @param index Current position in digits string
     * @param currentCombination The combination built so far
     * @param result List to store all valid combinations
     */
    private void backtrack(String digits, String[] digitToLetters, int index,
                          StringBuilder currentCombination, List<String> result) {
        // Base case: if we've processed all digits, add the complete combination
        if (index == digits.length()) {
            result.add(currentCombination.toString());
            return;
        }

        // Get the current digit and its corresponding letters
        char currentDigit = digits.charAt(index);
        String letters = digitToLetters[currentDigit - '0']; // Convert char to int

        // Try each possible letter for the current digit
        for (int i = 0; i < letters.length(); i++) {
            char letter = letters.charAt(i);

            // Append the letter
            currentCombination.append(letter);

            // Recurse to next digit
            backtrack(digits, digitToLetters, index + 1, currentCombination, result);

            // Backtrack: remove the last letter to try the next one
            currentCombination.deleteCharAt(currentCombination.length() - 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(4^n × n)**

- In the worst case, each digit maps to 4 letters (digits 7 and 9)
- For `n` digits, we generate up to 4^n combinations
- Each combination has length `n`, and constructing it takes O(n) time
- Total: O(4^n × n)

**Space Complexity: O(n) for recursion stack + O(4^n) for output**

- The recursion depth is `n` (one level per digit)
- We need space to store all 4^n combinations in the output
- In practice, the output space dominates: O(4^n × n) if we count the space for the result strings

**Why not O(3^n)?**
While most digits map to 3 letters, digits 7 and 9 map to 4 letters. We use O(4^n) as the upper bound for worst-case analysis.

## Common Mistakes

1. **Forgetting to handle empty input**: The problem states digits can be empty, and we should return an empty list. Many candidates return `[""]` instead of `[]`.

2. **Incorrect index handling in recursion**:
   - Using the same index for multiple recursive calls without incrementing
   - Forgetting the base case check `if index == len(digits)`
   - Solution: Always pass `index + 1` when recursing to the next digit

3. **Not backtracking properly in Java**:
   - In Java's StringBuilder, you must explicitly remove the last character after recursion
   - In Python/JavaScript, strings are immutable, so `current + letter` creates a new string automatically
   - Mistake: Forgetting `deleteCharAt()` in Java leads to incorrect combinations

4. **Incorrect digit-to-letter mapping**:
   - Off-by-one errors in array indexing (especially in Java)
   - Forgetting that digits 0 and 1 don't map to letters
   - Solution: Use a dictionary/map or carefully index an array

## When You'll See This Pattern

The backtracking pattern used here appears in many combinatorial generation problems:

1. **Generate Parentheses** (Medium): Similar decision tree where at each step you choose to add '(' or ')', with constraints on validity.

2. **Combination Sum** (Medium): Another backtracking problem where you explore different combinations of numbers that sum to a target.

3. **Subsets/Permutations** (Medium): Generating all subsets or permutations of a set uses the same recursive exploration pattern.

4. **Binary Watch** (Easy): Although simpler, it also involves generating combinations (which LEDs are lit) that satisfy constraints.

The key signature is: "Generate all possible combinations/permutations of X" where X involves making a series of choices.

## Key Takeaways

1. **Backtracking is ideal for combinatorial generation**: When you need to explore all possible combinations/permutations, backtracking provides a clean, recursive way to systematically explore the decision tree.

2. **Recognize the pattern**: Problems asking for "all possible" outcomes from a series of choices often need backtracking. The recursion depth typically equals the number of choices to make.

3. **Mind your base case**: In backtracking, the base case is when you've made all decisions (reached the end of input). That's when you save the current combination.

4. **String building varies by language**: In Python/JavaScript, immutable strings simplify backtracking. In Java, use StringBuilder and remember to undo your choice explicitly.

Related problems: [Generate Parentheses](/problem/generate-parentheses), [Combination Sum](/problem/combination-sum), [Binary Watch](/problem/binary-watch)
