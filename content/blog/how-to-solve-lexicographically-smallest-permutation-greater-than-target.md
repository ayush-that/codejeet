---
title: "How to Solve Lexicographically Smallest Permutation Greater Than Target — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest Permutation Greater Than Target. Medium difficulty, 26.5% acceptance rate. Topics: Hash Table, String, Greedy, Counting, Enumeration."
date: "2026-03-30"
category: "dsa-patterns"
tags:
  [
    "lexicographically-smallest-permutation-greater-than-target",
    "hash-table",
    "string",
    "greedy",
    "medium",
  ]
---

# How to Solve Lexicographically Smallest Permutation Greater Than Target

You're given two strings `s` and `target` of equal length `n`. You need to find the lexicographically smallest permutation of `s` that is strictly greater than `target`. If no such permutation exists, return an empty string. This problem is tricky because it requires careful character manipulation and understanding of lexicographic ordering—it's essentially finding the "next permutation" of `s` relative to `target`, not just generating all permutations.

## Visual Walkthrough

Let's trace through an example: `s = "abc"`, `target = "acb"`. We want the smallest rearrangement of "abc" that comes after "acb" alphabetically.

1. **Understanding lexicographic order**: Strings are compared character by character. "abc" < "acb" because at position 1, both have 'a', but at position 2, 'b' < 'c'.

2. **Our goal**: Find a permutation of "abc" that's greater than "acb" but as small as possible.

3. **Step-by-step construction**:
   - Start building our result character by character, matching `target` as much as possible
   - For position 0: `target[0] = 'a'`. Can we use 'a' from `s`? Yes, we have 'a' available. If we use 'a', our result will start with 'a' just like target.
   - For position 1: `target[1] = 'c'`. Can we use 'c' from `s`? Yes, we have 'c' available. But here's the catch: if we use 'c', our result would be "ac?" which equals target so far. We need to be strictly greater, so we need to check what happens next.
   - If we commit to using 'c' at position 1, we'd have "ac" prefix. The remaining character from `s` is 'b', giving us "acb" which equals target, not greater.
   - Therefore, at position 1, we need to use a character **greater than** 'c'. But we only have 'a', 'b', 'c' available, and 'c' is the largest. So we can't make position 1 greater than 'c'.
   - This means we need to backtrack: at position 0, instead of using 'a', we need to use something greater than 'a'. The next available character greater than 'a' is 'b'.
   - Now with 'b' at position 0, we need the smallest possible suffix. We have 'a' and 'c' left, so we sort them ascending: "ac".
   - Final result: "b" + "ac" = "bac".

Let's verify: "bac" > "acb"? Compare: 'b' > 'a', so yes. And it's the smallest such permutation: any other permutation starting with 'b' would be "bca" which is larger than "bac".

## Brute Force Approach

A naive approach would generate all permutations of `s`, filter those greater than `target`, and pick the smallest one. Here's what that looks like:

1. Generate all permutations of `s` (n! possibilities)
2. Filter to keep only permutations > `target`
3. If any remain, return the smallest one; otherwise return ""

**Why this fails**: For n = 10, there are 3,628,800 permutations. For n = 12, there are 479 million. The factorial growth makes this completely impractical for any reasonable n.

Even if we try to be clever by sorting `s` and using next_permutation repeatedly until we find one > target, we'd still potentially check O(n!) permutations in the worst case (when target is nearly the largest permutation).

## Optimized Approach

The key insight is that we don't need to generate all permutations. We can build the answer character by character using a greedy approach with backtracking:

1. **Count characters**: First, count how many of each character we have available from `s`.

2. **Build prefix matching target**: Try to match `target` as much as possible. For each position i from 0 to n-1:
   - Look for the smallest available character ≥ target[i]
   - If we find a character = target[i], we can use it and continue matching
   - If we find a character > target[i], we can use it, then fill the remaining positions with the smallest available characters (sorted ascending)
   - If the only available character < target[i], we need to backtrack

3. **Backtracking**: When we can't find a suitable character at position i, we go back to the previous position (i-1), release the character we used there, and try to use a larger character instead.

4. **Early exit**: If we successfully backtrack and find a solution, we return it. If we backtrack all the way to before position 0, no solution exists.

This approach is similar to finding the next lexicographic permutation, but with the constraint that we can only use characters available in `s`.

## Optimal Solution

The efficient solution uses character counting and careful construction. We maintain a count of available characters and build the result step by step, backtracking when needed.

<div class="code-group">

```python
# Time: O(n^2) in worst case due to backtracking, but typically O(n)
# Space: O(n) for the result and character counts
def smallestPermutationGreaterThanTarget(s: str, target: str) -> str:
    n = len(s)

    # Step 1: Count characters in s
    from collections import Counter
    char_count = Counter(s)

    # Step 2: Try to build the result
    result = []

    # Helper function to find the smallest available character >= given char
    def find_smallest_gte(c):
        # Search from c to 'z' to find the smallest available character >= c
        for ch in range(ord(c), ord('z') + 1):
            ch_char = chr(ch)
            if char_count.get(ch_char, 0) > 0:
                return ch_char
        return None

    # Helper function to get all remaining characters in sorted order
    def get_sorted_remaining():
        remaining = []
        # Collect all remaining characters
        for ch in range(ord('a'), ord('z') + 1):
            ch_char = chr(ch)
            remaining.extend([ch_char] * char_count.get(ch_char, 0))
        return remaining

    # Try to build the result character by character
    for i in range(n):
        # Find the smallest available character >= target[i]
        ch = find_smallest_gte(target[i])

        if ch is None:
            # No character >= target[i] is available
            # We need to backtrack
            backtrack = True
            while backtrack and result:
                # Remove last character from result
                last_char = result.pop()
                # Return it to available pool
                char_count[last_char] += 1
                i -= 1  # Move back one position

                # Try to find a larger character than what we used before
                # We need something > last_char and >= target[i] (since we're at position i again)
                found = False
                for try_ch in range(ord(last_char) + 1, ord('z') + 1):
                    try_char = chr(try_ch)
                    if char_count.get(try_char, 0) > 0:
                        # Found a larger character
                        result.append(try_char)
                        char_count[try_char] -= 1
                        found = True
                        backtrack = False
                        break

                if not found:
                    # Continue backtracking
                    continue

            if backtrack:
                # Backtracked all the way, no solution
                return ""

            # After successful backtrack, fill remaining positions with smallest chars
            remaining = get_sorted_remaining()
            result.extend(remaining)
            return ''.join(result)

        elif ch == target[i]:
            # We can match target[i] exactly
            result.append(ch)
            char_count[ch] -= 1
            # Continue to next position
        else:  # ch > target[i]
            # We found a character > target[i]
            result.append(ch)
            char_count[ch] -= 1
            # Fill remaining positions with smallest available characters
            remaining = get_sorted_remaining()
            result.extend(remaining)
            return ''.join(result)

    # If we've matched all characters exactly, we need to make it greater
    # Since we matched target completely, result equals target, not greater
    # So we need to backtrack to make it greater
    backtrack = True
    while backtrack and result:
        last_char = result.pop()
        char_count[last_char] += 1
        n -= 1  # Equivalent to i -= 1 since we're at the end

        # Try to find a larger character
        found = False
        for try_ch in range(ord(last_char) + 1, ord('z') + 1):
            try_char = chr(try_ch)
            if char_count.get(try_char, 0) > 0:
                result.append(try_char)
                char_count[try_char] -= 1
                found = True
                backtrack = False
                break

        if not found:
            continue

    if backtrack:
        return ""

    # Fill remaining positions
    remaining = get_sorted_remaining()
    result.extend(remaining)
    return ''.join(result)
```

```javascript
// Time: O(n^2) in worst case due to backtracking, but typically O(n)
// Space: O(n) for the result and character counts
function smallestPermutationGreaterThanTarget(s, target) {
  const n = s.length;

  // Step 1: Count characters in s
  const charCount = new Array(26).fill(0);
  for (let i = 0; i < n; i++) {
    charCount[s.charCodeAt(i) - 97]++;
  }

  // Step 2: Try to build the result
  const result = [];

  // Helper function to find the smallest available character >= given char
  function findSmallestGTE(c) {
    const start = c.charCodeAt(0) - 97;
    for (let i = start; i < 26; i++) {
      if (charCount[i] > 0) {
        return String.fromCharCode(i + 97);
      }
    }
    return null;
  }

  // Helper function to get all remaining characters in sorted order
  function getSortedRemaining() {
    const remaining = [];
    for (let i = 0; i < 26; i++) {
      if (charCount[i] > 0) {
        const ch = String.fromCharCode(i + 97);
        for (let j = 0; j < charCount[i]; j++) {
          remaining.push(ch);
        }
      }
    }
    return remaining;
  }

  // Try to build the result character by character
  for (let i = 0; i < n; i++) {
    // Find the smallest available character >= target[i]
    const ch = findSmallestGTE(target[i]);

    if (ch === null) {
      // No character >= target[i] is available
      // We need to backtrack
      let backtrack = true;
      while (backtrack && result.length > 0) {
        // Remove last character from result
        const lastChar = result.pop();
        // Return it to available pool
        charCount[lastChar.charCodeAt(0) - 97]++;
        i--; // Move back one position

        // Try to find a larger character than what we used before
        let found = false;
        const lastCharCode = lastChar.charCodeAt(0) - 97;
        for (let tryCode = lastCharCode + 1; tryCode < 26; tryCode++) {
          if (charCount[tryCode] > 0) {
            // Found a larger character
            const tryChar = String.fromCharCode(tryCode + 97);
            result.push(tryChar);
            charCount[tryCode]--;
            found = true;
            backtrack = false;
            break;
          }
        }

        if (!found) {
          // Continue backtracking
          continue;
        }
      }

      if (backtrack) {
        // Backtracked all the way, no solution
        return "";
      }

      // After successful backtrack, fill remaining positions with smallest chars
      const remaining = getSortedRemaining();
      result.push(...remaining);
      return result.join("");
    } else if (ch === target[i]) {
      // We can match target[i] exactly
      result.push(ch);
      charCount[ch.charCodeAt(0) - 97]--;
      // Continue to next position
    } else {
      // ch > target[i]
      // We found a character > target[i]
      result.push(ch);
      charCount[ch.charCodeAt(0) - 97]--;
      // Fill remaining positions with smallest available characters
      const remaining = getSortedRemaining();
      result.push(...remaining);
      return result.join("");
    }
  }

  // If we've matched all characters exactly, we need to make it greater
  // Since we matched target completely, result equals target, not greater
  // So we need to backtrack to make it greater
  let backtrack = true;
  while (backtrack && result.length > 0) {
    const lastChar = result.pop();
    charCount[lastChar.charCodeAt(0) - 97]++;
    n--; // Equivalent to i-- since we're at the end

    // Try to find a larger character
    let found = false;
    const lastCharCode = lastChar.charCodeAt(0) - 97;
    for (let tryCode = lastCharCode + 1; tryCode < 26; tryCode++) {
      if (charCount[tryCode] > 0) {
        const tryChar = String.fromCharCode(tryCode + 97);
        result.push(tryChar);
        charCount[tryCode]--;
        found = true;
        backtrack = false;
        break;
      }
    }

    if (!found) {
      continue;
    }
  }

  if (backtrack) {
    return "";
  }

  // Fill remaining positions
  const remaining = getSortedRemaining();
  result.push(...remaining);
  return result.join("");
}
```

```java
// Time: O(n^2) in worst case due to backtracking, but typically O(n)
// Space: O(n) for the result and character counts
import java.util.*;

public class Solution {
    public String smallestPermutationGreaterThanTarget(String s, String target) {
        int n = s.length();

        // Step 1: Count characters in s
        int[] charCount = new int[26];
        for (int i = 0; i < n; i++) {
            charCount[s.charAt(i) - 'a']++;
        }

        // Step 2: Try to build the result
        StringBuilder result = new StringBuilder();

        // Helper function to find the smallest available character >= given char
        for (int i = 0; i < n; i++) {
            char targetChar = target.charAt(i);
            Character ch = findSmallestGTE(charCount, targetChar);

            if (ch == null) {
                // No character >= target[i] is available
                // We need to backtrack
                boolean backtrack = true;
                while (backtrack && result.length() > 0) {
                    // Remove last character from result
                    char lastChar = result.charAt(result.length() - 1);
                    result.deleteCharAt(result.length() - 1);
                    // Return it to available pool
                    charCount[lastChar - 'a']++;
                    i--;  // Move back one position

                    // Try to find a larger character than what we used before
                    boolean found = false;
                    for (int tryCode = (lastChar - 'a') + 1; tryCode < 26; tryCode++) {
                        if (charCount[tryCode] > 0) {
                            // Found a larger character
                            char tryChar = (char) (tryCode + 'a');
                            result.append(tryChar);
                            charCount[tryCode]--;
                            found = true;
                            backtrack = false;
                            break;
                        }
                    }

                    if (!found) {
                        // Continue backtracking
                        continue;
                    }
                }

                if (backtrack) {
                    // Backtracked all the way, no solution
                    return "";
                }

                // After successful backtrack, fill remaining positions with smallest chars
                appendRemaining(charCount, result);
                return result.toString();
            } else if (ch == targetChar) {
                // We can match target[i] exactly
                result.append(ch);
                charCount[ch - 'a']--;
                // Continue to next position
            } else {  // ch > targetChar
                // We found a character > target[i]
                result.append(ch);
                charCount[ch - 'a']--;
                // Fill remaining positions with smallest available characters
                appendRemaining(charCount, result);
                return result.toString();
            }
        }

        // If we've matched all characters exactly, we need to make it greater
        // Since we matched target completely, result equals target, not greater
        // So we need to backtrack to make it greater
        boolean backtrack = true;
        while (backtrack && result.length() > 0) {
            char lastChar = result.charAt(result.length() - 1);
            result.deleteCharAt(result.length() - 1);
            charCount[lastChar - 'a']++;
            n--;  // Equivalent to i-- since we're at the end

            // Try to find a larger character
            boolean found = false;
            for (int tryCode = (lastChar - 'a') + 1; tryCode < 26; tryCode++) {
                if (charCount[tryCode] > 0) {
                    char tryChar = (char) (tryCode + 'a');
                    result.append(tryChar);
                    charCount[tryCode]--;
                    found = true;
                    backtrack = false;
                    break;
                }
            }

            if (!found) {
                continue;
            }
        }

        if (backtrack) {
            return "";
        }

        // Fill remaining positions
        appendRemaining(charCount, result);
        return result.toString();
    }

    private Character findSmallestGTE(int[] charCount, char c) {
        int start = c - 'a';
        for (int i = start; i < 26; i++) {
            if (charCount[i] > 0) {
                return (char) (i + 'a');
            }
        }
        return null;
    }

    private void appendRemaining(int[] charCount, StringBuilder result) {
        for (int i = 0; i < 26; i++) {
            if (charCount[i] > 0) {
                char ch = (char) (i + 'a');
                for (int j = 0; j < charCount[i]; j++) {
                    result.append(ch);
                }
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) in the worst case, but typically O(n). Here's why:

- We iterate through each character position: O(n)
- At each position, we might search for a character: O(26) = O(1)
- The backtracking could potentially go back through all previous positions in the worst case, leading to O(n²)
- However, in practice, we typically find a solution or determine no solution exists much faster

**Space Complexity**: O(n) for:

- The character count array (size 26, which is O(1) but we also store counts)
- The result string (size n)
- The recursion/backtracking stack is simulated iteratively, so no additional stack space

## Common Mistakes

1. **Not handling backtracking correctly**: Many candidates try to build the string forward-only and fail when they need to replace a previously chosen character. Remember that if you can't find a suitable character at position i, you need to go back and try a larger character at position i-1.

2. **Forgetting the "strictly greater" requirement**: Some solutions return a permutation that equals target. Remember that you need a result > target, not ≥ target. This affects the logic when choosing between equal and greater characters.

3. **Inefficient character searching**: Scanning from 'a' to 'z' at each step is fine (O(26) = O(1)), but some candidates try more complex data structures that add unnecessary complexity.

4. **Not sorting remaining characters**: After finding a character > target[i], you need to fill the remaining positions with the smallest available characters in sorted order to ensure the result is the smallest possible.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Next Permutation Pattern**: Similar to LeetCode 31 "Next Permutation", but with character constraints instead of numbers.

2. **Greedy Construction with Backtracking**: Used in problems like LeetCode 316 "Remove Duplicate Letters" and LeetCode 402 "Remove K Digits" where you build a result while maintaining certain properties.

3. **Character Counting and Manipulation**: Common in string permutation problems like LeetCode 567 "Permutation in String" and LeetCode 438 "Find All Anagrams in a String".

The core technique of building a result while maintaining a pool of available elements and backtracking when needed appears in many medium-to-hard string manipulation problems.

## Key Takeaways

1. **Think in terms of prefix construction**: When building lexicographically ordered results, construct from left to right, making the smallest valid choice at each position.

2. **Backtracking is often necessary for "next" problems**: When you need the "next" something that satisfies constraints, you may need to undo previous choices to make room for better ones.

3. **Character counting simplifies permutation problems**: Instead of generating all permutations, maintain counts of available characters to efficiently check what's possible.

4. **The "strictly greater" requirement changes matching logic**: When you match a character exactly, you're committing to potentially needing backtracking later if you can't make the suffix greater than target's suffix.

[Practice this problem on CodeJeet](/problem/lexicographically-smallest-permutation-greater-than-target)
