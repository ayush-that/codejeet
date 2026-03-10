---
title: "How to Solve Verbal Arithmetic Puzzle — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Verbal Arithmetic Puzzle. Hard difficulty, 34.9% acceptance rate. Topics: Array, Math, String, Backtracking."
date: "2030-01-10"
category: "dsa-patterns"
tags: ["verbal-arithmetic-puzzle", "array", "math", "string", "hard"]
---

# How to Solve Verbal Arithmetic Puzzle

Verbal arithmetic puzzles (also called cryptarithms) ask you to replace each letter in a word equation with a digit (0-9) so that the equation becomes valid. The challenge comes from the constraints: each letter must map to a unique digit, no leading zeros are allowed, and we need to verify if any valid mapping exists. This problem is tricky because it combines string manipulation, backtracking, and careful constraint handling.

## Visual Walkthrough

Let's trace through a simple example: `["SEND", "MORE"]` with result `"MONEY"`.

We need to assign digits to letters S,E,N,D,M,O,R,Y such that:

```
  SEND
+ MORE
------
 MONEY
```

We can think of this as a column addition problem:

```
     S E N D
     M O R E +
  ----------
  M O N E Y
```

Working from rightmost column to leftmost:

- Column 1 (units): D + E = Y (or D + E = Y + 10 if there's a carry)
- Column 2 (tens): N + R + carry = E (or E + 10)
- Column 3 (hundreds): E + O + carry = N (or N + 10)
- Column 4 (thousands): S + M + carry = O (or O + 10)
- Column 5 (ten-thousands): carry = M

The key insight is that we can treat this as a constraint satisfaction problem where we assign digits to letters while respecting:

1. All letters get unique digits (0-9)
2. No leading zeros (S, M ≠ 0)
3. The column equations must hold

## Brute Force Approach

The most straightforward approach is to try all possible digit assignments to letters. For our example with 8 unique letters, we'd try all 10!/(10-8)! = 1,814,400 permutations of digits assigned to letters. For each assignment, we'd:

1. Check for leading zeros
2. Convert words to numbers
3. Check if the sum equals the result

The problem with this approach is its exponential time complexity. With up to 10 unique letters (since we only have digits 0-9), we could have 10! = 3,628,800 permutations to check. For each permutation, we need to convert strings to numbers and verify the equation. While this might work for very small inputs, it's too slow for the general case and doesn't scale well.

## Optimized Approach

The key optimization is to use **backtracking with pruning** and **column-wise addition with carry propagation**. Instead of trying all permutations blindly, we can:

1. **Process columns from right to left** (like manual addition)
2. **Assign digits to letters as we go**, backtracking when constraints fail
3. **Use a digit-to-letter mapping** to ensure uniqueness
4. **Track carries** between columns
5. **Prune early** when:
   - A letter gets assigned an invalid digit (e.g., leading zero)
   - The column equation can't be satisfied with available digits
   - The final carry is non-zero when no more columns exist

We also need to handle the fact that different words can have different lengths, so we'll pad shorter words with zeros when processing columns.

The most efficient approach uses **backtracking with column-wise processing** and **precomputation of coefficients** for each letter. Each letter appears in specific columns with specific weights (1, 10, 100, etc.). We can sum these coefficients for each letter across all words (positive for left side, negative for right side), then solve for coefficients that sum to zero with carries.

## Optimal Solution

The optimal solution uses backtracking with column-wise processing. We'll:

1. Collect all unique letters
2. Process columns from rightmost to leftmost
3. Assign digits to letters as we encounter them
4. Use backtracking to try different assignments
5. Prune invalid assignments early

<div class="code-group">

```python
# Time: O(10!/(10-n)!) where n is number of unique letters, but heavily pruned
# Space: O(n) for the mapping and visited digits
class Solution:
    def isSolvable(self, words: List[str], result: str) -> bool:
        # Combine all words including result (result will be subtracted)
        all_words = words + [result]
        # Find maximum length to determine number of columns
        max_len = max(len(w) for w in all_words)

        # Reverse words for easier right-to-left processing
        words_rev = [w[::-1] for w in words]
        result_rev = result[::-1]

        # Track assigned digits for letters
        letter_to_digit = {}
        # Track used digits
        used_digits = set()

        # Leading letters cannot be zero
        leading_letters = set(w[0] for w in all_words)

        def backtrack(col_idx, word_idx, total, carry):
            """
            col_idx: current column index (0 = units column)
            word_idx: current word index in words list
            total: running sum for current column
            carry: carry from previous column
            """
            # Process all words for current column
            if word_idx < len(words):
                word = words_rev[word_idx]
                if col_idx < len(word):
                    ch = word[col_idx]
                    if ch in letter_to_digit:
                        # Letter already assigned, add its value
                        return backtrack(col_idx, word_idx + 1,
                                       total + letter_to_digit[ch], carry)
                    else:
                        # Try assigning a digit to this letter
                        for digit in range(10):
                            if digit == 0 and ch in leading_letters:
                                continue  # No leading zero
                            if digit not in used_digits:
                                letter_to_digit[ch] = digit
                                used_digits.add(digit)
                                if backtrack(col_idx, word_idx + 1,
                                           total + digit, carry):
                                    return True
                                # Backtrack
                                used_digits.remove(digit)
                                del letter_to_digit[ch]
                        return False
                else:
                    # This word has no more characters in this column
                    return backtrack(col_idx, word_idx + 1, total, carry)

            # All words processed for this column, now check result
            if col_idx < len(result_rev):
                ch = result_rev[col_idx]
                expected = (total + carry) % 10
                new_carry = (total + carry) // 10

                if ch in letter_to_digit:
                    # Result letter already assigned
                    if letter_to_digit[ch] == expected:
                        # Move to next column
                        return backtrack(col_idx + 1, 0, 0, new_carry)
                    return False
                else:
                    # Assign result letter
                    if expected == 0 and ch in leading_letters:
                        return False  # No leading zero
                    if expected in used_digits:
                        return False  # Digit already used

                    letter_to_digit[ch] = expected
                    used_digits.add(expected)
                    res = backtrack(col_idx + 1, 0, 0, new_carry)
                    # Backtrack
                    used_digits.remove(expected)
                    del letter_to_digit[ch]
                    return res
            else:
                # No more columns, check if carry is zero
                return carry == 0

        return backtrack(0, 0, 0, 0)
```

```javascript
// Time: O(10!/(10-n)!) where n is number of unique letters, but heavily pruned
// Space: O(n) for the mapping and visited digits
function isSolvable(words, result) {
  // Combine all words including result
  const allWords = [...words, result];
  // Find maximum length
  const maxLen = Math.max(...allWords.map((w) => w.length));

  // Reverse words for easier right-to-left processing
  const wordsRev = words.map((w) => w.split("").reverse().join(""));
  const resultRev = result.split("").reverse().join("");

  // Track assigned digits
  const letterToDigit = new Map();
  const usedDigits = new Set();

  // Leading letters cannot be zero
  const leadingLetters = new Set(allWords.map((w) => w[0]));

  function backtrack(colIdx, wordIdx, total, carry) {
    // Process all words for current column
    if (wordIdx < words.length) {
      const word = wordsRev[wordIdx];
      if (colIdx < word.length) {
        const ch = word[colIdx];
        if (letterToDigit.has(ch)) {
          // Letter already assigned
          return backtrack(colIdx, wordIdx + 1, total + letterToDigit.get(ch), carry);
        } else {
          // Try assigning a digit
          for (let digit = 0; digit < 10; digit++) {
            if (digit === 0 && leadingLetters.has(ch)) {
              continue; // No leading zero
            }
            if (!usedDigits.has(digit)) {
              letterToDigit.set(ch, digit);
              usedDigits.add(digit);
              if (backtrack(colIdx, wordIdx + 1, total + digit, carry)) {
                return true;
              }
              // Backtrack
              usedDigits.delete(digit);
              letterToDigit.delete(ch);
            }
          }
          return false;
        }
      } else {
        // Word has no more characters in this column
        return backtrack(colIdx, wordIdx + 1, total, carry);
      }
    }

    // All words processed, now check result
    if (colIdx < resultRev.length) {
      const ch = resultRev[colIdx];
      const expected = (total + carry) % 10;
      const newCarry = Math.floor((total + carry) / 10);

      if (letterToDigit.has(ch)) {
        // Result letter already assigned
        if (letterToDigit.get(ch) === expected) {
          return backtrack(colIdx + 1, 0, 0, newCarry);
        }
        return false;
      } else {
        // Assign result letter
        if (expected === 0 && leadingLetters.has(ch)) {
          return false; // No leading zero
        }
        if (usedDigits.has(expected)) {
          return false; // Digit already used
        }

        letterToDigit.set(ch, expected);
        usedDigits.add(expected);
        const res = backtrack(colIdx + 1, 0, 0, newCarry);
        // Backtrack
        usedDigits.delete(expected);
        letterToDigit.delete(ch);
        return res;
      }
    } else {
      // No more columns
      return carry === 0;
    }
  }

  return backtrack(0, 0, 0, 0);
}
```

```java
// Time: O(10!/(10-n)!) where n is number of unique letters, but heavily pruned
// Space: O(n) for the mapping and visited digits
class Solution {
    public boolean isSolvable(String[] words, String result) {
        // Combine all words
        List<String> allWords = new ArrayList<>(Arrays.asList(words));
        allWords.add(result);

        // Find maximum length
        int maxLen = 0;
        for (String w : allWords) {
            maxLen = Math.max(maxLen, w.length());
        }

        // Reverse words for right-to-left processing
        String[] wordsRev = new String[words.length];
        for (int i = 0; i < words.length; i++) {
            wordsRev[i] = new StringBuilder(words[i]).reverse().toString();
        }
        String resultRev = new StringBuilder(result).reverse().toString();

        // Track assignments
        Map<Character, Integer> letterToDigit = new HashMap<>();
        Set<Integer> usedDigits = new HashSet<>();

        // Leading letters cannot be zero
        Set<Character> leadingLetters = new HashSet<>();
        for (String w : allWords) {
            leadingLetters.add(w.charAt(0));
        }

        return backtrack(0, 0, 0, 0, wordsRev, resultRev,
                        letterToDigit, usedDigits, leadingLetters);
    }

    private boolean backtrack(int colIdx, int wordIdx, int total, int carry,
                             String[] wordsRev, String resultRev,
                             Map<Character, Integer> letterToDigit,
                             Set<Integer> usedDigits,
                             Set<Character> leadingLetters) {
        // Process all words for current column
        if (wordIdx < wordsRev.length) {
            String word = wordsRev[wordIdx];
            if (colIdx < word.length()) {
                char ch = word.charAt(colIdx);
                if (letterToDigit.containsKey(ch)) {
                    // Letter already assigned
                    return backtrack(colIdx, wordIdx + 1,
                                   total + letterToDigit.get(ch), carry,
                                   wordsRev, resultRev, letterToDigit,
                                   usedDigits, leadingLetters);
                } else {
                    // Try assigning a digit
                    for (int digit = 0; digit < 10; digit++) {
                        if (digit == 0 && leadingLetters.contains(ch)) {
                            continue; // No leading zero
                        }
                        if (!usedDigits.contains(digit)) {
                            letterToDigit.put(ch, digit);
                            usedDigits.add(digit);
                            if (backtrack(colIdx, wordIdx + 1,
                                        total + digit, carry,
                                        wordsRev, resultRev, letterToDigit,
                                        usedDigits, leadingLetters)) {
                                return true;
                            }
                            // Backtrack
                            usedDigits.remove(digit);
                            letterToDigit.remove(ch);
                        }
                    }
                    return false;
                }
            } else {
                // Word has no more characters in this column
                return backtrack(colIdx, wordIdx + 1, total, carry,
                               wordsRev, resultRev, letterToDigit,
                               usedDigits, leadingLetters);
            }
        }

        // All words processed, now check result
        if (colIdx < resultRev.length()) {
            char ch = resultRev.charAt(colIdx);
            int expected = (total + carry) % 10;
            int newCarry = (total + carry) / 10;

            if (letterToDigit.containsKey(ch)) {
                // Result letter already assigned
                if (letterToDigit.get(ch) == expected) {
                    return backtrack(colIdx + 1, 0, 0, newCarry,
                                   wordsRev, resultRev, letterToDigit,
                                   usedDigits, leadingLetters);
                }
                return false;
            } else {
                // Assign result letter
                if (expected == 0 && leadingLetters.contains(ch)) {
                    return false; // No leading zero
                }
                if (usedDigits.contains(expected)) {
                    return false; // Digit already used
                }

                letterToDigit.put(ch, expected);
                usedDigits.add(expected);
                boolean res = backtrack(colIdx + 1, 0, 0, newCarry,
                                      wordsRev, resultRev, letterToDigit,
                                      usedDigits, leadingLetters);
                // Backtrack
                usedDigits.remove(expected);
                letterToDigit.remove(ch);
                return res;
            }
        } else {
            // No more columns
            return carry == 0;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** In the worst case, we try all permutations of digits for the unique letters. With n unique letters, this is O(10!/(10-n)!). However, in practice, the backtracking prunes most branches early, especially with the leading zero constraint and column-wise validation. The actual runtime is much better than the worst-case factorial complexity.

**Space Complexity:** O(n) where n is the number of unique letters. This space is used for:

- The `letter_to_digit` mapping (n entries)
- The `used_digits` set (n entries)
- Recursion stack depth (up to n + number of columns)

## Common Mistakes

1. **Forgetting the leading zero constraint**: The first letter of each word (including the result) cannot be zero. Candidates often check this only for the first word or forget it entirely.

2. **Processing left-to-right instead of right-to-left**: Addition naturally proceeds from least significant digit to most significant. Processing left-to-right makes carry handling much more complex.

3. **Not pruning early enough**: Some candidates generate all permutations first, then check validity. This is extremely inefficient. We should check column constraints as we assign digits and backtrack immediately when constraints fail.

4. **Incorrect carry handling**: Forgetting to propagate the carry to the next column or mishandling the final carry (which must be zero unless there's an extra digit in the result).

## When You'll See This Pattern

This backtracking-with-constraints pattern appears in many combinatorial problems:

1. **Sudoku Solver (LeetCode 37)**: Similar digit assignment with row, column, and box constraints. The backtracking approach with constraint checking is nearly identical.

2. **N-Queens (LeetCode 51)**: Placing queens on a chessboard with constraints (no two queens attack each other). The backtracking pattern with early pruning is very similar.

3. **Permutations II (LeetCode 47)**: Generating permutations with duplicates requires similar constraint handling to ensure uniqueness.

The core pattern is: try choices recursively, check constraints at each step, backtrack when constraints fail, and use heuristics to prune the search space early.

## Key Takeaways

1. **Backtracking with pruning** is essential for combinatorial problems with constraints. Always check constraints as early as possible to avoid exploring dead ends.

2. **Model the problem correctly**: For arithmetic puzzles, processing columns right-to-left with carry propagation mirrors how humans solve these problems and leads to cleaner code.

3. **Constraint propagation** can dramatically reduce search space. Leading zero constraints, unique digit constraints, and column sum constraints should be checked incrementally.

[Practice this problem on CodeJeet](/problem/verbal-arithmetic-puzzle)
