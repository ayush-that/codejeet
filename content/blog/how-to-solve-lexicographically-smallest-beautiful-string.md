---
title: "How to Solve Lexicographically Smallest Beautiful String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest Beautiful String. Hard difficulty, 38.1% acceptance rate. Topics: String, Greedy."
date: "2026-05-12"
category: "dsa-patterns"
tags: ["lexicographically-smallest-beautiful-string", "string", "greedy", "hard"]
---

# How to Solve Lexicographically Smallest Beautiful String

This problem asks us to find the lexicographically smallest beautiful string that comes after a given beautiful string `s`, where "beautiful" means the string only uses the first `k` letters of the alphabet and contains no palindromic substrings of length 2 or more. The challenge lies in efficiently finding the next valid string while maintaining both constraints - character range and palindrome avoidance.

What makes this tricky: We need to modify the string to be lexicographically larger while ensuring no palindromes exist. A naive approach would generate all possible strings, but that's exponential. The key insight is that we can work backwards through the string, trying to increment characters while checking palindrome constraints locally.

## Visual Walkthrough

Let's trace through an example: `s = "abaz"`, `k = 3` (letters: a, b, c)

**Step 1:** Start from the last character and try to make it larger

- Current: `"abaz"` (but 'z' is invalid since k=3, so let's use a valid example)
- Actually, let's use: `s = "abac"`, `k = 3`

**Step 2:** Check if "abac" is beautiful:

- No length-2 palindromes: "ab", "ba", "ac" ✓
- No length-3 palindromes: "aba" is a palindrome! So "abac" isn't beautiful.
- Let's use a valid beautiful string: `s = "abcb"`, `k = 3`

**Step 3:** We want the next beautiful string after "abcb":

1. Start from last index (index 3, character 'b')
2. Try next character: 'c' → "abcc"
3. Check palindrome: "cc" is length-2 palindrome! Invalid.
4. Try next character: no more (k=3, only a,b,c)

**Step 4:** Move to previous index (index 2, character 'c')

1. Try next character: no more (c is already max for k=3)
2. Move to index 1 (character 'b')
3. Try next character: 'c' → "accb"
4. Check palindrome at new position:
   - Check index 1-2: "cc" is palindrome! Invalid.
   - Try next char for 'c': none

**Step 5:** Move to index 0 (character 'a')

1. Try next character: 'b' → "bbcb"
2. Check palindromes:
   - index 0-1: "bb" is palindrome! Invalid.
   - Try 'c' → "cbcb"
   - Check: "cb", "bc", "cb" ✓ no length-2 palindromes
   - Check length-3: "cbc" is palindrome! Invalid.

**Step 6:** Actually, we need to increment and then fill remaining positions:
After incrementing a position, we need to fill all following positions with the smallest valid characters.

Let's trace correctly:

- Start: "abcb"
- Last index (3): 'b' → try 'c': "abcc" → "cc" palindrome
- Index 2: 'c' → no next char
- Index 1: 'b' → 'c': "accb"
- Now fill remaining positions after index 1 with smallest valid chars:
  - Position 2: try 'a': "aca" with position 3? Wait, we need to check properly...

The correct approach: when we increment position `i`, we need to ensure the new character doesn't create palindromes with the two previous characters, then fill all positions `i+1` to `n-1` with the smallest valid characters.

## Brute Force Approach

A naive approach would be:

1. Convert the string to its numeric representation
2. Increment it like a number in base-k
3. Check if the new string is beautiful
4. Repeat until we find a beautiful string

This approach fails because:

- There could be many invalid strings between valid ones
- Checking all palindromes for each candidate is O(n²)
- The search space is exponential (kⁿ possibilities)

Even with optimization, this would be too slow for n up to 1000.

## Optimized Approach

The key insight: **Palindrome constraints are local**. A substring of length 2 is a palindrome if two consecutive characters are equal. A substring of length 3 is a palindrome if the first and third characters are equal.

Therefore, when choosing a character at position `i`, we only need to check:

1. It's not equal to the character at position `i-1` (avoids length-2 palindrome)
2. It's not equal to the character at position `i-2` (avoids length-3 palindrome)

Why don't we need to check longer palindromes? Because if we avoid length-2 and length-3 palindromes, we automatically avoid all longer palindromes. A palindrome of length 4 would require the outer characters to match, making it a length-2 palindrome centered differently. Similarly, any longer palindrome contains smaller palindromes within it.

The algorithm:

1. Convert string to mutable array of characters
2. Start from the last position and try to increment it
3. For each position, try all possible characters greater than current
4. Check if the new character creates palindromes with previous two characters
5. If valid, fill all subsequent positions with the smallest valid character
6. If no valid character found at current position, move left and repeat

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k) - in worst case we try k chars at each of n positions
# Space: O(n) - for the character array
class Solution:
    def smallestBeautifulString(self, s: str, k: int) -> str:
        n = len(s)
        # Convert string to list of integers (0-indexed: 'a'=0, 'b'=1, etc.)
        arr = [ord(c) - ord('a') for c in s]

        # Start from the last character and try to make it larger
        for i in range(n - 1, -1, -1):
            # Try all possible characters greater than current at position i
            for candidate in range(arr[i] + 1, k):
                # Check if candidate creates palindrome with previous characters
                # We need to check both length-2 and length-3 palindromes
                valid = True

                # Check length-2 palindrome (compare with immediate left neighbor)
                if i > 0 and candidate == arr[i - 1]:
                    valid = False

                # Check length-3 palindrome (compare with left neighbor's left neighbor)
                if i > 1 and candidate == arr[i - 2]:
                    valid = False

                # If candidate is valid, use it and fill the rest
                if valid:
                    arr[i] = candidate

                    # Fill all positions to the right with smallest valid characters
                    for j in range(i + 1, n):
                        # Try all characters from 'a' to max
                        for ch in range(k):
                            # Check palindrome constraints
                            valid_char = True

                            # Check with left neighbor (length-2 palindrome)
                            if j > 0 and ch == arr[j - 1]:
                                valid_char = False

                            # Check with left neighbor's left neighbor (length-3 palindrome)
                            if j > 1 and ch == arr[j - 2]:
                                valid_char = False

                            if valid_char:
                                arr[j] = ch
                                break

                    # Convert back to string and return
                    return ''.join(chr(x + ord('a')) for x in arr)

        # If we get here, no beautiful string exists
        return ""
```

```javascript
// Time: O(n * k) - in worst case we try k chars at each of n positions
// Space: O(n) - for the character array
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var smallestBeautifulString = function (s, k) {
  const n = s.length;
  // Convert string to array of character codes (0-indexed: 'a'=0, 'b'=1, etc.)
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = s.charCodeAt(i) - 97; // 97 is 'a'
  }

  // Start from the last character and try to make it larger
  for (let i = n - 1; i >= 0; i--) {
    // Try all possible characters greater than current at position i
    for (let candidate = arr[i] + 1; candidate < k; candidate++) {
      // Check if candidate creates palindrome with previous characters
      let valid = true;

      // Check length-2 palindrome (compare with immediate left neighbor)
      if (i > 0 && candidate === arr[i - 1]) {
        valid = false;
      }

      // Check length-3 palindrome (compare with left neighbor's left neighbor)
      if (i > 1 && candidate === arr[i - 2]) {
        valid = false;
      }

      // If candidate is valid, use it and fill the rest
      if (valid) {
        arr[i] = candidate;

        // Fill all positions to the right with smallest valid characters
        for (let j = i + 1; j < n; j++) {
          // Try all characters from 'a' to max
          for (let ch = 0; ch < k; ch++) {
            // Check palindrome constraints
            let validChar = true;

            // Check with left neighbor (length-2 palindrome)
            if (j > 0 && ch === arr[j - 1]) {
              validChar = false;
            }

            // Check with left neighbor's left neighbor (length-3 palindrome)
            if (j > 1 && ch === arr[j - 2]) {
              validChar = false;
            }

            if (validChar) {
              arr[j] = ch;
              break;
            }
          }
        }

        // Convert back to string and return
        let result = "";
        for (let num of arr) {
          result += String.fromCharCode(num + 97);
        }
        return result;
      }
    }
  }

  // If we get here, no beautiful string exists
  return "";
};
```

```java
// Time: O(n * k) - in worst case we try k chars at each of n positions
// Space: O(n) - for the character array
class Solution {
    public String smallestBeautifulString(String s, int k) {
        int n = s.length();
        // Convert string to array of integers (0-indexed: 'a'=0, 'b'=1, etc.)
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = s.charAt(i) - 'a';
        }

        // Start from the last character and try to make it larger
        for (int i = n - 1; i >= 0; i--) {
            // Try all possible characters greater than current at position i
            for (int candidate = arr[i] + 1; candidate < k; candidate++) {
                // Check if candidate creates palindrome with previous characters
                boolean valid = true;

                // Check length-2 palindrome (compare with immediate left neighbor)
                if (i > 0 && candidate == arr[i - 1]) {
                    valid = false;
                }

                // Check length-3 palindrome (compare with left neighbor's left neighbor)
                if (i > 1 && candidate == arr[i - 2]) {
                    valid = false;
                }

                // If candidate is valid, use it and fill the rest
                if (valid) {
                    arr[i] = candidate;

                    // Fill all positions to the right with smallest valid characters
                    for (int j = i + 1; j < n; j++) {
                        // Try all characters from 'a' to max
                        for (int ch = 0; ch < k; ch++) {
                            // Check palindrome constraints
                            boolean validChar = true;

                            // Check with left neighbor (length-2 palindrome)
                            if (j > 0 && ch == arr[j - 1]) {
                                validChar = false;
                            }

                            // Check with left neighbor's left neighbor (length-3 palindrome)
                            if (j > 1 && ch == arr[j - 2]) {
                                validChar = false;
                            }

                            if (validChar) {
                                arr[j] = ch;
                                break;
                            }
                        }
                    }

                    // Convert back to string and return
                    StringBuilder result = new StringBuilder();
                    for (int num : arr) {
                        result.append((char) (num + 'a'));
                    }
                    return result.toString();
                }
            }
        }

        // If we get here, no beautiful string exists
        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- In the worst case, we might need to try all `k` possible characters at each of the `n` positions
- The outer loop runs backwards through the string (O(n))
- For each position, we try up to `k` candidates
- For each valid candidate, we fill the remaining positions, which also takes O(n × k) in worst case
- However, in practice it's much faster since we usually find a valid candidate quickly

**Space Complexity:** O(n)

- We store the string as an array of integers (size n)
- No additional data structures are needed
- The recursion stack is implicit in our iterative approach

## Common Mistakes

1. **Not checking both palindrome conditions:** Some candidates only check for length-2 palindromes (adjacent equal characters) but forget about length-3 palindromes (characters at i and i-2 being equal). Both are necessary.

2. **Incorrect character range handling:** Forgetting that characters are 0-indexed ('a' = 0) or mishandling the conversion between characters and integers can lead to off-by-one errors.

3. **Not filling remaining positions optimally:** After finding a valid increment, you must fill all subsequent positions with the smallest valid characters. Some candidates try to continue the increment process, which doesn't guarantee the lexicographically smallest result.

4. **Infinite loop or incorrect termination:** The loop should go from last index to first (backwards). Going forwards would be incorrect because we need to carry over increments like adding 1 to a number.

## When You'll See This Pattern

This problem uses a **backtracking with greedy filling** pattern, similar to:

1. **Next Permutation (Medium):** Both problems involve finding the next lexicographic sequence by modifying from the right and then optimizing the suffix.

2. **Find Palindrome With Fixed Length (Medium):** Both deal with palindrome constraints and constructing strings that avoid certain patterns.

3. **Smallest String With Swaps (Medium):** While different in implementation, both involve constructing lexicographically optimal strings under constraints.

The core pattern: when you need the "next" valid configuration in lexicographic order, work backwards to find the first position you can increment, then fill the suffix optimally.

## Key Takeaways

1. **Local constraints can imply global properties:** By avoiding length-2 and length-3 palindromes, we automatically avoid all longer palindromes. This simplification is crucial for an efficient solution.

2. **Work backwards for lexicographic increments:** To find the next lexicographic string, start from the end and find the first position you can increment (like adding 1 to a number).

3. **Greedy filling after increment:** Once you increment a position, fill all following positions with the smallest valid values to ensure lexicographic minimality.

Related problems: [Smallest String With Swaps](/problem/smallest-string-with-swaps), [Find Palindrome With Fixed Length](/problem/find-palindrome-with-fixed-length)
