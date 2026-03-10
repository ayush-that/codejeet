---
title: "How to Solve Special Binary String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Special Binary String. Hard difficulty, 79.3% acceptance rate. Topics: String, Divide and Conquer, Sorting."
date: "2027-07-29"
category: "dsa-patterns"
tags: ["special-binary-string", "string", "divide-and-conquer", "sorting", "hard"]
---

# How to Solve Special Binary String

This problem asks us to rearrange a special binary string to get the lexicographically largest possible special binary string. The challenge lies in understanding that special binary strings behave exactly like valid parentheses expressions, where '1' represents '(' and '0' represents ')'. This connection unlocks a recursive divide-and-conquer solution that sorts substrings to achieve the maximum lexicographic order.

## Visual Walkthrough

Let's trace through the example `s = "11011000"`:

1. **Understanding the structure**: This string represents the parentheses expression `(()(()))`. Each '1' is '(' and each '0' is ')'.

2. **Finding special substrings**: We look for the smallest special substrings (balanced at the lowest level):
   - Start at index 0: "11011000" has count=0
     - i=0: '1' → count=1
     - i=1: '1' → count=2
     - i=2: '0' → count=1
     - i=3: '1' → count=2
     - i=4: '1' → count=3
     - i=5: '0' → count=2
     - i=6: '0' → count=1
     - i=7: '0' → count=0 ← Found a special substring!

   So the first special substring is "11011000" itself.

3. **Breaking it down**: Within "11011000", we find smaller special substrings:
   - "10" (indices 0-1: "11" doesn't work because count never reaches 0)
     Actually, let's trace properly:
     - i=0: '1' → count=1
     - i=1: '1' → count=2
     - i=2: '0' → count=1
     - i=3: '1' → count=2
     - i=4: '1' → count=3
     - i=5: '0' → count=2
     - i=6: '0' → count=1
     - i=7: '0' → count=0

   We need to find where count becomes 0 for the first time. Actually, let's find all balanced substrings:
   - "10" (indices 0-1? Wait, that's "11" not "10")

   Let me correct: We look for minimal special substrings where count goes from 0 to 0:
   - Starting at i=0: "11011000" → count sequence: 1,2,1,2,3,2,1,0
     The first time count reaches 0 is at i=7, so "11011000" is a special substring

   But we need to recursively break it. Within "11011000":
   - "10" (indices 0-1? Actually "11" → count: 1,2 never reaches 0)
   - Let's find where count reaches 0 within the substring:
     Start at i=0: "1" count=1
     i=1: "1" count=2
     i=2: "0" count=1
     i=3: "1" count=2
     i=4: "1" count=3
     i=5: "0" count=2
     i=6: "0" count=1
     i=7: "0" count=0

   The first time count reaches 0 is at the end, so it's not decomposable? Wait, that's not right.

   Actually, the algorithm finds special substrings whenever count == 0. Let me trace the standard algorithm:

   For s = "11011000":
   - i=0, count=0: '1' → count=1
   - i=1: '1' → count=2
   - i=2: '0' → count=1
   - i=3: '1' → count=2
   - i=4: '1' → count=3
   - i=5: '0' → count=2
   - i=6: '0' → count=1
   - i=7: '0' → count=0 ← Found special substring "11011000"

   Now recursively process "11011000":
   Remove first and last char: "101100"
   Find special substrings in "101100":
   - i=0, count=0: '1' → count=1
   - i=1: '0' → count=0 ← Found "10"
   - i=2, count=0: '1' → count=1
   - i=3: '1' → count=2
   - i=4: '0' → count=1
   - i=5: '0' → count=0 ← Found "1100"

   So we have ["10", "1100"]

4. **Sorting for maximum**: Sort in descending order: ["1100", "10"]
5. **Reconstruct**: "1" + "1100" + "10" + "0" = "11100100"

This is the lexicographically largest special string we can obtain.

## Brute Force Approach

A naive approach would be to generate all permutations of the string, check which ones are special binary strings, and pick the lexicographically largest. For a string of length n, there are n! permutations, making this O(n!) time complexity, which is completely infeasible even for small n.

Another brute force might try all possible swaps of consecutive special substrings, but this would still be exponential in the worst case since we'd need to consider all possible groupings and orderings.

The key insight we need is that special binary strings correspond exactly to valid parentheses expressions, and within such expressions, we can rearrange the "blocks" (minimal special substrings) in descending order to get the maximum lexicographic order.

## Optimized Approach

The optimal solution uses a recursive divide-and-conquer approach:

1. **The parentheses analogy**: Every special binary string can be mapped to a valid parentheses expression where '1' = '(' and '0' = ')'. This means:
   - The string must start with '1' and end with '0'
   - Every prefix has at least as many '1's as '0's (like parentheses balance)

2. **Key observation**: If we have a special string S, it can be decomposed as S = "1" + A + "0" + B, where A and B are special strings (possibly empty). But more usefully: any special string can be broken into minimal special substrings.

3. **Minimal special substrings**: These are special strings that cannot be broken into smaller special strings. They have the form "1" + X + "0" where X is a special string.

4. **The algorithm**:
   - Find all minimal special substrings in the input string
   - For each minimal special substring, remove its first and last character, recursively process the inside
   - Sort the processed substrings in descending order
   - Concatenate them with "1" at the beginning and "0" at the end

5. **Why sorting works**: In lexicographic order, '1' comes before '0'. So to maximize the string, we want as many '1's as early as possible. By sorting the special substrings in descending order, we put the substrings with more leading '1's first.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) in worst case, O(n log n) average | Space: O(n)
def makeLargestSpecial(s: str) -> str:
    """
    Transform a special binary string into the lexicographically largest
    possible special binary string through recursive rearrangement.

    The key insight: special binary strings behave like valid parentheses
    where '1' = '(' and '0' = ')'. We recursively break the string into
    minimal special substrings, sort them in descending order, and
    reconstruct.
    """

    # Base case: empty string
    if len(s) == 0:
        return ""

    count = 0  # Tracks balance of '1's vs '0's
    i = 0      # Start index of current segment
    result = []  # Stores the processed special substrings

    for j in range(len(s)):
        # Increment count for '1', decrement for '0'
        count += 1 if s[j] == '1' else -1

        # When count reaches 0, we've found a minimal special substring
        if count == 0:
            # s[i:j+1] is a minimal special substring
            # Remove outer '1' and '0', process the inside recursively
            inner = makeLargestSpecial(s[i+1:j])

            # Reconstruct with '1' at start and '0' at end
            result.append("1" + inner + "0")

            # Move start index to next character
            i = j + 1

    # Sort all special substrings in descending order
    # This puts substrings with more leading '1's first
    result.sort(reverse=True)

    # Concatenate all sorted substrings
    return "".join(result)
```

```javascript
// Time: O(n^2) in worst case, O(n log n) average | Space: O(n)
/**
 * Transform a special binary string into the lexicographically largest
 * possible special binary string through recursive rearrangement.
 *
 * The key insight: special binary strings behave like valid parentheses
 * where '1' = '(' and '0' = ')'. We recursively break the string into
 * minimal special substrings, sort them in descending order, and
 * reconstruct.
 */
function makeLargestSpecial(s) {
  // Base case: empty string
  if (s.length === 0) {
    return "";
  }

  let count = 0; // Tracks balance of '1's vs '0's
  let i = 0; // Start index of current segment
  const result = []; // Stores the processed special substrings

  for (let j = 0; j < s.length; j++) {
    // Increment count for '1', decrement for '0'
    count += s[j] === "1" ? 1 : -1;

    // When count reaches 0, we've found a minimal special substring
    if (count === 0) {
      // s.substring(i, j+1) is a minimal special substring
      // Remove outer '1' and '0', process the inside recursively
      const inner = makeLargestSpecial(s.substring(i + 1, j));

      // Reconstruct with '1' at start and '0' at end
      result.push("1" + inner + "0");

      // Move start index to next character
      i = j + 1;
    }
  }

  // Sort all special substrings in descending order
  // This puts substrings with more leading '1's first
  result.sort((a, b) => b.localeCompare(a));

  // Concatenate all sorted substrings
  return result.join("");
}
```

```java
// Time: O(n^2) in worst case, O(n log n) average | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Transform a special binary string into the lexicographically largest
     * possible special binary string through recursive rearrangement.
     *
     * The key insight: special binary strings behave like valid parentheses
     * where '1' = '(' and '0' = ')'. We recursively break the string into
     * minimal special substrings, sort them in descending order, and
     * reconstruct.
     */
    public String makeLargestSpecial(String s) {
        // Base case: empty string
        if (s.length() == 0) {
            return "";
        }

        int count = 0;  // Tracks balance of '1's vs '0's
        int i = 0;      // Start index of current segment
        List<String> result = new ArrayList<>();  // Stores processed special substrings

        for (int j = 0; j < s.length(); j++) {
            // Increment count for '1', decrement for '0'
            count += s.charAt(j) == '1' ? 1 : -1;

            // When count reaches 0, we've found a minimal special substring
            if (count == 0) {
                // s.substring(i, j+1) is a minimal special substring
                // Remove outer '1' and '0', process the inside recursively
                String inner = makeLargestSpecial(s.substring(i + 1, j));

                // Reconstruct with '1' at start and '0' at end
                result.add("1" + inner + "0");

                // Move start index to next character
                i = j + 1;
            }
        }

        // Sort all special substrings in descending order
        // This puts substrings with more leading '1's first
        Collections.sort(result, Collections.reverseOrder());

        // Concatenate all sorted substrings
        return String.join("", result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- Worst case: O(n²) - This happens when the string is deeply nested like "(((...)))". Each recursive call processes almost the entire string, leading to quadratic time.
- Average case: O(n log n) - The string breaks into balanced pieces, and we sort the pieces. The sorting dominates when the pieces are reasonably sized.

**Space Complexity**: O(n) - This comes from the recursion stack (which could be O(n) in the worst case of deeply nested strings) and the storage for the result list.

The complexity arises from:

1. Recursive decomposition: We process each character multiple times in different recursive calls
2. Sorting: We sort the list of special substrings at each level
3. String manipulation: Creating new strings at each recursive step

## Common Mistakes

1. **Not recognizing the parentheses analogy**: Many candidates try to solve this as a pure string manipulation problem without realizing that '1' and '0' correspond to '(' and ')'. This makes the problem much harder than it needs to be.

2. **Incorrect balance tracking**: Forgetting to reset the start index `i` after finding a balanced substring, or mishandling the case when count becomes negative (which shouldn't happen in valid special strings but could in buggy code).

3. **Wrong sorting order**: Sorting in ascending order instead of descending order. Remember: we want the lexicographically largest string, which means we want substrings with more leading '1's to come first. Since '1' < '0' in ASCII, descending order puts '1'-heavy strings first.

4. **Not handling the recursive case properly**: Forgetting to strip the outer '1' and '0' before recursing, or forgetting to add them back after processing. The pattern is always: "1" + process(inner) + "0".

## When You'll See This Pattern

This divide-and-conquer pattern with sorting of balanced substrings appears in several problems:

1. **Valid Parentheses (Easy)**: The core concept of balanced parentheses is fundamental here. Special binary strings are essentially valid parentheses in disguise.

2. **Generate Parentheses (Medium)**: While not identical, it deals with constructing all valid parentheses strings of a given length, which requires understanding the balance property.

3. **Remove Invalid Parentheses (Hard)**: This also deals with parentheses validity and requires understanding how to make strings valid through minimal changes.

4. **Longest Valid Parentheses (Hard)**: Uses stack-based approaches to find valid parentheses substrings, similar to how we identify special substrings here.

The pattern to recognize: when a problem involves balanced pairs (parentheses, brackets, or binary strings with equal counts), think about stack-based validation or recursive decomposition into minimal balanced units.

## Key Takeaways

1. **Special binary strings = valid parentheses**: Always map '1' to '(' and '0' to ')' when you see a problem about binary strings with equal counts and prefix conditions. This transformation unlocks all the parentheses algorithms you already know.

2. **Recursive decomposition of balanced structures**: When dealing with balanced expressions, recursively break them into minimal balanced units, process each unit, and recombine. This is a powerful pattern for rearrangement problems.

3. **Lexicographic ordering through sorting**: To maximize lexicographic order for binary strings, sort components in descending order. This pushes '1's (which have lower ASCII value than '0's) to the front.

Related problems: [Valid Parenthesis String](/problem/valid-parenthesis-string), [Number of Good Binary Strings](/problem/number-of-good-binary-strings)
