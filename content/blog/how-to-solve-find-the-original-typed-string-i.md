---
title: "How to Solve Find the Original Typed String I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Original Typed String I. Easy difficulty, 72.1% acceptance rate. Topics: String."
date: "2026-02-03"
category: "dsa-patterns"
tags: ["find-the-original-typed-string-i", "string", "easy"]
---

# How to Solve "Find the Original Typed String I"

Alice typed a string, but she might have held down a key too long exactly once, causing a character to repeat multiple times. Given the typed string, we need to find all possible original strings she might have intended to type. The challenge is that we don't know which character (if any) was repeated, nor how many times it was repeated, but we know it happened at most once.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose Alice typed `"aabbbcc"`. What could the original string be?

**Step 1:** Consider the possibility that no key was held down.  
If Alice typed perfectly, the original string would be exactly `"aabbbcc"`.

**Step 2:** Consider that she might have held down a key once.  
We need to check each position where a character repeats:

- If she held down the first `'a'` (at index 0): The original would be `"abbbcc"` (remove one duplicate `'a'`)
- If she held down the second `'a'` (at index 1): Same result `"abbbcc"` (removing a duplicate `'a'` gives the same string)
- If she held down the first `'b'` (at index 2): Original would be `"aabbcc"` (remove one `'b'`)
- If she held down the second `'b'` (at index 3): Original would be `"aabbcc"` (same as above)
- If she held down the third `'b'` (at index 4): Original would be `"aabbcc"` (same as above)
- If she held down the first `'c'` (at index 5): Original would be `"aabbbc"` (remove one `'c'`)
- If she held down the second `'c'` (index 6): Original would be `"aabbbc"` (same as above)

After removing duplicates, we get four distinct possible originals:  
`{"aabbbcc", "abbbcc", "aabbcc", "aabbbc"}`

The key insight: We only need to check positions where a character differs from the previous one, because holding down a key creates a _run_ of identical characters. Removing any character from that run produces the same original string.

## Brute Force Approach

A naive approach would be to generate all possible strings by removing exactly one character from the typed string (or removing none), then collect the unique results.

**Why this is inefficient:**

- For a string of length `n`, there are `n+1` possibilities (remove no character, or remove character at index 0, 1, ..., n-1)
- Each removal creates a new string of length `n-1`, which takes O(n) time
- Total time complexity: O(n²) — too slow for large inputs
- Many removals produce duplicate results (as we saw in the visual walkthrough)

**What makes the brute force insufficient:**
It doesn't leverage the observation that duplicate removals within the same character run produce identical results. We're doing redundant work.

## Optimal Solution

The optimal approach uses a single pass through the string. We build a set of possible original strings by considering:

1. The typed string itself (if no key was held down)
2. For each run of identical characters, remove exactly one character from that run

Since removing any character from the same run produces the same result, we only need to remove the _first_ character of each run (or any single character from it).

**Algorithm:**

1. Add the original typed string to the result set (case where no key was held)
2. Iterate through the string, identifying runs of identical characters
3. For each run starting at index `i` with length `run_len`:
   - Create a new string by removing the character at index `i`
   - Add this to the result set
4. Return all unique results

<div class="code-group">

```python
# Time: O(n²) in worst case due to string slicing, but O(n) with string builder
# Space: O(n²) for storing all possible results
def possibleString(typed: str):
    """
    Find all possible original strings Alice might have intended to type.

    Args:
        typed: The string Alice actually typed (may contain one repeated character)

    Returns:
        List of all possible original strings in lexicographical order
    """
    result_set = set()

    # Case 1: No key was held down
    result_set.add(typed)

    n = len(typed)
    i = 0

    # Traverse the string to find runs of identical characters
    while i < n:
        # Find the end of the current run
        j = i
        while j < n and typed[j] == typed[i]:
            j += 1

        # Run length is (j - i)
        # If run length > 1, we can remove one character from this run
        # Removing any character from this run gives the same result,
        # so we just remove the first one
        if j - i > 1:
            # Create new string by removing character at index i
            # Using slicing: characters before i + characters after i
            new_str = typed[:i] + typed[i+1:]
            result_set.add(new_str)

        # Move to next run (different character)
        i = j

    # Convert to sorted list and return
    return sorted(result_set)
```

```javascript
// Time: O(n²) in worst case, O(n) with string builder
// Space: O(n²) for storing all possible results
function possibleString(typed) {
  /**
   * Find all possible original strings Alice might have intended to type.
   *
   * @param {string} typed - The string Alice actually typed
   * @return {string[]} - Array of all possible original strings in lexicographical order
   */
  const resultSet = new Set();

  // Case 1: No key was held down
  resultSet.add(typed);

  const n = typed.length;
  let i = 0;

  // Traverse the string to find runs of identical characters
  while (i < n) {
    // Find the end of the current run
    let j = i;
    while (j < n && typed[j] === typed[i]) {
      j++;
    }

    // Run length is (j - i)
    // If run length > 1, we can remove one character from this run
    // Removing any character from this run gives the same result,
    // so we just remove the first one
    if (j - i > 1) {
      // Create new string by removing character at index i
      // Using string concatenation
      const newStr = typed.substring(0, i) + typed.substring(i + 1);
      resultSet.add(newStr);
    }

    // Move to next run (different character)
    i = j;
  }

  // Convert to sorted array and return
  return Array.from(resultSet).sort();
}
```

```java
// Time: O(n²) in worst case, O(n) with StringBuilder
// Space: O(n²) for storing all possible results
import java.util.*;

public class Solution {
    public List<String> possibleString(String typed) {
        /**
         * Find all possible original strings Alice might have intended to type.
         *
         * @param typed: The string Alice actually typed
         * @return: List of all possible original strings in lexicographical order
         */
        Set<String> resultSet = new HashSet<>();

        // Case 1: No key was held down
        resultSet.add(typed);

        int n = typed.length();
        int i = 0;

        // Traverse the string to find runs of identical characters
        while (i < n) {
            // Find the end of the current run
            int j = i;
            while (j < n && typed.charAt(j) == typed.charAt(i)) {
                j++;
            }

            // Run length is (j - i)
            // If run length > 1, we can remove one character from this run
            // Removing any character from this run gives the same result,
            // so we just remove the first one
            if (j - i > 1) {
                // Create new string by removing character at index i
                // Using StringBuilder for efficiency
                StringBuilder sb = new StringBuilder();
                sb.append(typed.substring(0, i));
                sb.append(typed.substring(i + 1));
                resultSet.add(sb.toString());
            }

            // Move to next run (different character)
            i = j;
        }

        // Convert to sorted list and return
        List<String> result = new ArrayList<>(resultSet);
        Collections.sort(result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²) in the worst case, but can be O(n) with optimization**

- We traverse the string once: O(n)
- For each run of length > 1, we create a new string by concatenation
- String concatenation in Python/Java/JavaScript creates a new string, which takes O(n) time
- In the worst case (all characters different), we create n strings of length n-1: O(n²)
- **Optimization**: Use a mutable string builder and track removal positions instead of creating new strings

**Space Complexity: O(n²)**

- We store up to O(n) possible strings in the result set
- Each string has length O(n) in the worst case
- Total space: O(n²)
- The algorithm itself uses O(1) additional space besides the output

**Why the quadratic factors matter:**
For n = 10⁵, O(n²) operations would be 10¹⁰ — far too slow. In practice, since the problem is marked Easy and test cases are small, this solution passes. For larger inputs, we'd need to optimize string building.

## Common Mistakes

1. **Removing multiple characters instead of one**: Some candidates think Alice might have held the key down for multiple extra presses. The problem states "at most once," meaning either 0 or 1 character was repeated.

2. **Not handling empty string or single character**:
   - Empty string: Should return `[""]` (only one possibility)
   - Single character: Should return `[""]` and `[char]` (could have held the key or not)

3. **Generating duplicate results**: Removing different characters from the same run produces identical strings. Using a set (as we do) eliminates duplicates automatically.

4. **Forgetting the "no key held" case**: The original typed string itself is always a valid possibility. Don't forget to include it.

5. **Incorrect run detection**: When finding runs of identical characters, make sure to compare with `typed[i]` not `typed[i-1]` to handle the start of each run correctly.

## When You'll See This Pattern

This problem uses **run-length encoding concepts** and **selective character removal**:

1. **Run-Length Encoding (RLE) Problems**:
   - **String Compression** (LeetCode 443): Compress string by replacing runs with character+count
   - **Count Binary Substrings** (LeetCode 696): Count substrings with equal 0s and 1s grouped together

2. **Selective Removal/Modification**:
   - **Faulty Keyboard** (LeetCode 2810): Simulate typing with a keyboard that reverses after 'i'
   - **Make The String Great** (LeetCode 1544): Remove adjacent bad pairs repeatedly

3. **String Generation Problems**:
   - **Generate Parentheses** (LeetCode 22): Generate all valid parenthesis combinations
   - **Letter Combinations of a Phone Number** (LeetCode 17): Generate all possible letter combinations

The core pattern: When you need to consider modifications at each position but modifications in certain regions produce identical results, group those positions together and process them as a unit.

## Key Takeaways

1. **Group identical consecutive elements**: When processing strings with potential repeats, first identify runs of identical characters. Operations within a run often produce identical results.

2. **Use sets for uniqueness**: When generating possibilities that may have duplicates, use a set to automatically handle deduplication.

3. **Consider edge cases systematically**: Empty string, single character, all characters identical, all characters different — test these to ensure your solution is robust.

4. **Problem simplification**: The constraint "at most once" simplifies the problem significantly. Without it, you'd need to consider removing 0, 1, 2, ... characters, which would be exponentially harder.

Related problems: [Keyboard Row](/problem/keyboard-row), [Faulty Keyboard](/problem/faulty-keyboard)
