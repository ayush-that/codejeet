---
title: "How to Solve Longest Nice Substring — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Nice Substring. Easy difficulty, 63.8% acceptance rate. Topics: Hash Table, String, Divide and Conquer, Bit Manipulation, Sliding Window."
date: "2027-08-03"
category: "dsa-patterns"
tags: ["longest-nice-substring", "hash-table", "string", "divide-and-conquer", "easy"]
---

# How to Solve Longest Nice Substring

This problem asks us to find the longest substring where every letter present appears in both uppercase and lowercase forms. While the definition is straightforward, the challenge lies in efficiently checking this "nice" property across all possible substrings. The interesting twist is that a brute force check of all substrings would be too slow, requiring us to find a smarter approach—often involving divide and conquer or sliding window techniques.

## Visual Walkthrough

Let's trace through an example step by step: `s = "YazaAay"`

We need to find the longest substring where for every letter present, both its uppercase and lowercase versions appear.

**Step-by-step reasoning:**

1. Look at the entire string `"YazaAay"`:
   - Contains `Y`, `a`, `z`, `A`, `y`
   - Check if every letter has both cases:
     - `Y` has lowercase `y` ✓
     - `a` has uppercase `A` ✓
     - `z` has no uppercase `Z` ✗
   - Not nice because `z` appears but `Z` doesn't.

2. Since the whole string isn't nice, we need to check substrings. A key insight: any nice substring cannot contain a "bad" character (one missing its counterpart). So we can split at the first bad character we find.

3. Find characters missing their counterpart:
   - `z` at index 2 has no `Z` in the string
   - This is a "division point" - any nice substring cannot include this `z`

4. Split the string at index 2:
   - Left part: `"Ya"` (indices 0-1)
   - Right part: `"aAay"` (indices 3-6)

5. Check left part `"Ya"`:
   - Contains `Y`, `a`
   - `Y` has `y`? No `y` in this substring ✗
   - Not nice

6. Check right part `"aAay"`:
   - Contains `a`, `A`, `y`
   - `a` has `A` ✓
   - `A` has `a` ✓
   - `y` has `Y`? No `Y` in this substring ✗
   - Not nice

7. Since neither part is nice, we need to recursively split further:
   - Split `"Ya"` at bad character `Y` (no `y`):
     - Left: `""` (empty)
     - Right: `"a"` (not nice - single character)
   - Split `"aAay"` at bad character `y` (no `Y`):
     - Left: `"aAa"` (indices 3-5)
     - Right: `""` (empty)

8. Check `"aAa"`:
   - Contains `a`, `A`
   - `a` has `A` ✓
   - `A` has `a` ✓
   - This is nice! Length = 3

9. We've found `"aAa"` as a nice substring. Are there longer ones?
   - Check other possibilities: `"azaA"` contains `z` (bad), `"zaAa"` contains `z` (bad), `"aAay"` contains `y` without `Y` (bad)
   - `"aAa"` is the longest nice substring

The key insight: we can use divide and conquer—split at characters that break the "nice" property, then recursively check the substrings.

## Brute Force Approach

The most straightforward approach is to check every possible substring:

1. Generate all possible substrings (O(n²) substrings)
2. For each substring, check if it's nice:
   - Collect all unique letters in the substring
   - For each letter, verify both uppercase and lowercase exist
3. Track the longest nice substring found

**Why this is inefficient:**

- There are O(n²) substrings for a string of length n
- Checking if a substring is nice takes O(n) time in the worst case
- Total time complexity: O(n³) - far too slow for n up to 100
- Space complexity: O(n) for storing substrings

While this approach would work for very small inputs, it's not feasible for the problem constraints. We need a more efficient strategy that avoids checking all substrings.

## Optimal Solution

The optimal solution uses a divide-and-conquer approach. The key observation is that if a character appears in the string but its counterpart (uppercase/lowercase) doesn't appear anywhere in the string, then no nice substring can contain this character. We can use this to split the problem into smaller subproblems.

**Algorithm:**

1. Convert the string to a set of characters for quick lookup
2. Find the first character where its counterpart doesn't exist in the entire string
3. If no such character exists, the entire string is nice - return it
4. Otherwise, split the string at every occurrence of this "bad" character
5. Recursively apply the same logic to each substring
6. Return the longest result from the recursive calls

<div class="code-group">

```python
# Time: O(n log n) average, O(n^2) worst case | Space: O(n) for recursion stack
def longestNiceSubstring(s: str) -> str:
    """
    Find the longest substring where every letter appears in both cases.

    Args:
        s: Input string to search

    Returns:
        The longest nice substring, or empty string if none exists
    """
    # Base case: empty string or single character cannot be nice
    if len(s) < 2:
        return ""

    # Convert string to set for O(1) lookups
    char_set = set(s)

    # Find the first character that breaks the nice property
    for i, char in enumerate(s):
        # Check if both uppercase and lowercase versions exist
        # If char is lowercase, check for uppercase version
        # If char is uppercase, check for lowercase version
        if char.islower() and char.upper() not in char_set:
            # Found a character missing its uppercase counterpart
            # Split the string at this character and check both sides
            left = longestNiceSubstring(s[:i])
            right = longestNiceSubstring(s[i+1:])

            # Return the longer nice substring from left or right
            return left if len(left) >= len(right) else right

        elif char.isupper() and char.lower() not in char_set:
            # Found a character missing its lowercase counterpart
            left = longestNiceSubstring(s[:i])
            right = longestNiceSubstring(s[i+1:])

            return left if len(left) >= len(right) else right

    # If we get here, all characters have both cases in the string
    # This means the entire string is nice
    return s
```

```javascript
// Time: O(n log n) average, O(n^2) worst case | Space: O(n) for recursion stack
/**
 * Find the longest substring where every letter appears in both cases.
 * @param {string} s - Input string to search
 * @return {string} The longest nice substring, or empty string if none exists
 */
function longestNiceSubstring(s) {
  // Base case: empty string or single character cannot be nice
  if (s.length < 2) {
    return "";
  }

  // Convert string to set for O(1) lookups
  const charSet = new Set(s);

  // Find the first character that breaks the nice property
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Check if both uppercase and lowercase versions exist
    if (char >= "a" && char <= "z") {
      // Character is lowercase, check for uppercase version
      const upperChar = char.toUpperCase();
      if (!charSet.has(upperChar)) {
        // Found a character missing its uppercase counterpart
        // Split the string at this character and check both sides
        const left = longestNiceSubstring(s.substring(0, i));
        const right = longestNiceSubstring(s.substring(i + 1));

        // Return the longer nice substring from left or right
        return left.length >= right.length ? left : right;
      }
    } else if (char >= "A" && char <= "Z") {
      // Character is uppercase, check for lowercase version
      const lowerChar = char.toLowerCase();
      if (!charSet.has(lowerChar)) {
        // Found a character missing its lowercase counterpart
        const left = longestNiceSubstring(s.substring(0, i));
        const right = longestNiceSubstring(s.substring(i + 1));

        return left.length >= right.length ? left : right;
      }
    }
  }

  // If we get here, all characters have both cases in the string
  // This means the entire string is nice
  return s;
}
```

```java
// Time: O(n log n) average, O(n^2) worst case | Space: O(n) for recursion stack
class Solution {
    /**
     * Find the longest substring where every letter appears in both cases.
     * @param s Input string to search
     * @return The longest nice substring, or empty string if none exists
     */
    public String longestNiceSubstring(String s) {
        // Base case: empty string or single character cannot be nice
        if (s.length() < 2) {
            return "";
        }

        // Convert string to set for O(1) lookups
        Set<Character> charSet = new HashSet<>();
        for (char c : s.toCharArray()) {
            charSet.add(c);
        }

        // Find the first character that breaks the nice property
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);

            // Check if both uppercase and lowercase versions exist
            if (Character.isLowerCase(currentChar)) {
                // Character is lowercase, check for uppercase version
                char upperChar = Character.toUpperCase(currentChar);
                if (!charSet.contains(upperChar)) {
                    // Found a character missing its uppercase counterpart
                    // Split the string at this character and check both sides
                    String left = longestNiceSubstring(s.substring(0, i));
                    String right = longestNiceSubstring(s.substring(i + 1));

                    // Return the longer nice substring from left or right
                    return left.length() >= right.length() ? left : right;
                }
            } else {
                // Character is uppercase, check for lowercase version
                char lowerChar = Character.toLowerCase(currentChar);
                if (!charSet.contains(lowerChar)) {
                    // Found a character missing its lowercase counterpart
                    String left = longestNiceSubstring(s.substring(0, i));
                    String right = longestNiceSubstring(s.substring(i + 1));

                    return left.length() >= right.length() ? left : right;
                }
            }
        }

        // If we get here, all characters have both cases in the string
        // This means the entire string is nice
        return s;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Best/Average case: O(n log n) - similar to quicksort, where we split the string roughly in half each time
- Worst case: O(n²) - occurs when the string needs to be split at every position (e.g., "abcdefghij")
- Each recursive call processes a substring, and we make O(n) recursive calls in the worst case
- The set creation takes O(n) time per recursive call

**Space Complexity:**

- O(n) for the recursion stack in the worst case (when the string splits unevenly)
- O(n) for the character set in each recursive call (though garbage collection helps)
- Total space: O(n) for the recursion depth

The divide-and-conquer approach is efficient because it avoids checking all possible substrings explicitly. Instead, it identifies "bad" characters that cannot be part of any nice substring and splits the problem around them.

## Common Mistakes

1. **Not handling empty strings or single characters correctly**: A single character can never be nice because it can't have both uppercase and lowercase versions. Always return empty string for length < 2.

2. **Forgetting that characters might not be letters**: While the problem states it's a string of English letters, in a real interview, you might want to check `char.isalpha()` or handle non-letter characters gracefully.

3. **Incorrect case conversion**: Using `char.upper()` instead of `char.upper()` in Python, or forgetting that `toUpperCase()`/`toLowerCase()` in JavaScript return new strings rather than modifying in place.

4. **Not considering all "bad" characters**: Some solutions only check the first bad character, but you need to split at EVERY occurrence of bad characters. The recursive approach handles this naturally.

5. **Inefficient set creation**: Creating a new set for the entire string in each recursive call is O(n). While this is acceptable for this problem, be aware that for very large strings, you could optimize by passing the set as a parameter or using bit manipulation.

## When You'll See This Pattern

The divide-and-conquer pattern used here appears in many string and array problems:

1. **Longest Substring with At Most K Distinct Characters** (LeetCode 340) - Uses sliding window, but the idea of splitting at constraint violations is similar.

2. **Longest Palindromic Substring** (LeetCode 5) - Can be solved with expand-around-center approach, which is conceptually similar to checking properties from the center outward.

3. **Maximum Subarray** (LeetCode 53) - The original divide-and-conquer problem that inspired many similar solutions.

4. **Different Ways to Add Parentheses** (LeetCode 241) - Another classic divide-and-conquer problem where you split at operators.

The core pattern is: when a global constraint is violated, the solution cannot span the violation point, so we split the problem into independent subproblems.

## Key Takeaways

1. **Divide and conquer is powerful for constraint-based substring problems**: When a substring must satisfy a global property (like "all letters have both cases"), look for violation points that let you split the problem.

2. **Character set lookups are efficient**: Converting a string to a set for O(1) membership checks is a common optimization in string problems.

3. **Recursive thinking simplifies complex searches**: Instead of manually checking all substrings, let recursion handle the search space reduction by splitting at constraint violations.

4. **Base cases matter**: Always handle the smallest cases (empty string, single character) explicitly to avoid infinite recursion or incorrect results.

Related problems: [Number of Good Paths](/problem/number-of-good-paths)
