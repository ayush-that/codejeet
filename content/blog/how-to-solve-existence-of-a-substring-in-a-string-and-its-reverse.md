---
title: "How to Solve Existence of a Substring in a String and Its Reverse — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Existence of a Substring in a String and Its Reverse. Easy difficulty, 66.4% acceptance rate. Topics: Hash Table, String."
date: "2028-05-26"
category: "dsa-patterns"
tags: ["existence-of-a-substring-in-a-string-and-its-reverse", "hash-table", "string", "easy"]
---

# How to Solve "Existence of a Substring in a String and Its Reverse"

This problem asks: given a string `s`, determine if there exists any substring of length 2 that appears in both `s` and the reverse of `s`. Return `true` if such a substring exists, otherwise `false`. While seemingly straightforward, this problem tests your ability to think about substrings, reversals, and efficient lookup patterns. The key insight is recognizing that checking every possible substring against the reversed string would be inefficient, but storing length-2 substrings in a set makes the solution trivial.

## Visual Walkthrough

Let's trace through an example step by step to build intuition.

**Example:** `s = "leetcode"`

1. First, let's understand what we're looking for:
   - We need to find any substring of length 2 from `s`
   - Check if that same 2-character substring appears in the reverse of `s`
2. The reverse of `s` is `"edocteel"`

3. Let's list all length-2 substrings from `s`:
   - Positions 0-1: `"le"`
   - Positions 1-2: `"ee"`
   - Positions 2-3: `"et"`
   - Positions 3-4: `"tc"`
   - Positions 4-5: `"co"`
   - Positions 5-6: `"od"`
   - Positions 6-7: `"de"`

4. Now check if any of these appear in the reverse string `"edocteel"`:
   - `"le"` appears at the end of `"edocteel"` (positions 6-7)
   - Therefore, we can immediately return `true`

The key observation: once we find ONE matching length-2 substring, we can return `true`. We don't need to find all matches or track positions.

## Brute Force Approach

A naive approach would be to:

1. Generate the reverse of the string
2. For every possible starting index `i` in `s` (from `0` to `len(s)-2`):
   - Extract the 2-character substring `s[i:i+2]`
   - Check if this substring exists anywhere in the reversed string

The check "if this substring exists anywhere in the reversed string" could be done by:

- Scanning through the reversed string for each substring (O(n) per check)
- Or using string search methods like `in` operator or `contains()`

**Why this is inefficient:**

- For each of the (n-1) length-2 substrings in `s`, we'd scan through the reversed string (also length n)
- This gives us O(n²) time complexity
- While acceptable for small n, this doesn't scale well and misses the opportunity for optimization

**What makes the brute force suboptimal:**

- We're repeatedly scanning the reversed string
- We're not leveraging the fact that we only need to know IF a substring exists, not WHERE it exists
- We're not using the fact that both strings contain the same set of length-2 substrings (just in different orders)

## Optimal Solution

The optimal solution uses a hash set to store all length-2 substrings from the original string, then checks if any of them appear in the reversed string. Here's the step-by-step reasoning:

1. **Edge case:** If the string has length less than 2, we can immediately return `false` since no length-2 substring can exist.

2. **Store substrings:** Iterate through `s` from index `0` to `len(s)-2`, adding each 2-character substring to a hash set.

3. **Check reversed string:** Generate the reversed string, then iterate through it from index `0` to `len(s)-2`, checking if each 2-character substring exists in our set.

4. **Early exit:** As soon as we find a match, we can return `true`.

5. **Final result:** If we finish checking all substrings in the reversed string without finding a match, return `false`.

The beauty of this approach is that set lookups are O(1) on average, making the overall solution O(n).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isSubstringPresent(s: str) -> bool:
    """
    Check if any length-2 substring of s exists in reverse(s).

    Args:
        s: Input string to check

    Returns:
        True if such a substring exists, False otherwise
    """
    # Edge case: if string length is less than 2, no length-2 substring can exist
    if len(s) < 2:
        return False

    # Step 1: Store all length-2 substrings from original string in a set
    substrings = set()

    # Iterate through s, stopping at len(s)-1 to avoid index out of bounds
    for i in range(len(s) - 1):
        # Extract 2-character substring starting at position i
        substring = s[i:i+2]
        # Add to set for O(1) lookup later
        substrings.add(substring)

    # Step 2: Generate the reversed string
    reversed_s = s[::-1]

    # Step 3: Check each length-2 substring in reversed string
    for i in range(len(reversed_s) - 1):
        # Extract 2-character substring from reversed string
        reversed_substring = reversed_s[i:i+2]

        # Check if this substring exists in our set
        if reversed_substring in substrings:
            # Found a match! Return immediately
            return True

    # Step 4: No matches found
    return False
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Check if any length-2 substring of s exists in reverse(s).
 * @param {string} s - Input string to check
 * @return {boolean} True if such a substring exists, False otherwise
 */
function isSubstringPresent(s) {
  // Edge case: if string length is less than 2, no length-2 substring can exist
  if (s.length < 2) {
    return false;
  }

  // Step 1: Store all length-2 substrings from original string in a Set
  const substrings = new Set();

  // Iterate through s, stopping at s.length - 1 to avoid index out of bounds
  for (let i = 0; i < s.length - 1; i++) {
    // Extract 2-character substring starting at position i
    const substring = s.substring(i, i + 2);
    // Add to Set for O(1) lookup later
    substrings.add(substring);
  }

  // Step 2: Generate the reversed string
  const reversedS = s.split("").reverse().join("");

  // Step 3: Check each length-2 substring in reversed string
  for (let i = 0; i < reversedS.length - 1; i++) {
    // Extract 2-character substring from reversed string
    const reversedSubstring = reversedS.substring(i, i + 2);

    // Check if this substring exists in our Set
    if (substrings.has(reversedSubstring)) {
      // Found a match! Return immediately
      return true;
    }
  }

  // Step 4: No matches found
  return false;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Check if any length-2 substring of s exists in reverse(s).
     * @param s Input string to check
     * @return True if such a substring exists, False otherwise
     */
    public boolean isSubstringPresent(String s) {
        // Edge case: if string length is less than 2, no length-2 substring can exist
        if (s.length() < 2) {
            return false;
        }

        // Step 1: Store all length-2 substrings from original string in a HashSet
        Set<String> substrings = new HashSet<>();

        // Iterate through s, stopping at s.length() - 1 to avoid index out of bounds
        for (int i = 0; i < s.length() - 1; i++) {
            // Extract 2-character substring starting at position i
            String substring = s.substring(i, i + 2);
            // Add to HashSet for O(1) lookup later
            substrings.add(substring);
        }

        // Step 2: Generate the reversed string
        String reversedS = new StringBuilder(s).reverse().toString();

        // Step 3: Check each length-2 substring in reversed string
        for (int i = 0; i < reversedS.length() - 1; i++) {
            // Extract 2-character substring from reversed string
            String reversedSubstring = reversedS.substring(i, i + 2);

            // Check if this substring exists in our HashSet
            if (substrings.contains(reversedSubstring)) {
                // Found a match! Return immediately
                return true;
            }
        }

        // Step 4: No matches found
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Extracting all length-2 substrings from `s`: O(n) iterations, each taking O(1) to extract and add to set
- Reversing the string: O(n) in most languages
- Checking substrings from reversed string: O(n) iterations, each with O(1) set lookup
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The set stores up to n-1 length-2 substrings, each of length 2: O(n) space
- The reversed string requires O(n) space
- Total: O(n) + O(n) = O(n)

**Why this is optimal:**

- We must at least examine each character to solve the problem, so Ω(n) is a lower bound
- Our solution achieves O(n), matching the lower bound
- We can't do better than O(n) because we need to process the entire input

## Common Mistakes

1. **Off-by-one errors in loop boundaries:**
   - Mistake: Using `i < len(s)` instead of `i < len(s) - 1` when extracting substrings
   - Result: Index out of bounds error when accessing `s[i+1]`
   - Prevention: Remember you need BOTH current and next character, so stop one position earlier

2. **Forgetting the edge case for short strings:**
   - Mistake: Not handling strings of length 0 or 1
   - Result: May crash or return incorrect result
   - Prevention: Always check input constraints first. A string of length < 2 cannot have any length-2 substring

3. **Inefficient string reversal:**
   - Mistake: Using manual reversal with a loop (O(n²) if concatenating strings inefficiently)
   - Result: Slower performance than necessary
   - Prevention: Use built-in reversal methods: `[::-1]` in Python, `reverse()` in Java, `split().reverse().join()` in JavaScript

4. **Not using early exit:**
   - Mistake: Continuing to check all substrings after finding a match
   - Result: Wasted computation (though still O(n))
   - Prevention: Return `true` immediately when a match is found

## When You'll See This Pattern

This problem combines two common patterns:

1. **Substring/Subarray enumeration with fixed length:** When you need to check all contiguous subsequences of a specific length.
   - Related problem: **"Maximum Average Subarray I" (LeetCode 643)** - Find a contiguous subarray of fixed length k with maximum average value
   - Why it's similar: Both involve sliding a fixed-size window through an array/string

2. **Set-based existence checking:** Using a hash set to track seen elements for O(1) lookups.
   - Related problem: **"Two Sum" (LeetCode 1)** - Find two numbers that add to a target
   - Why it's similar: Both use a set to remember what we've seen so we can quickly check if we've seen a complement (in Two Sum) or a substring (in this problem)

3. **Palindrome-related problems:** Checking properties of strings and their reverses.
   - Related problem: **"Valid Palindrome" (LeetCode 125)** - Check if a string reads the same forwards and backwards
   - Why it's similar: Both involve comparing a string with its reverse

## Key Takeaways

1. **Fixed-length substrings are easy to enumerate:** When dealing with substrings of fixed length k, you can simply iterate from index 0 to n-k and extract s[i:i+k]. This is more efficient than checking all possible substrings.

2. **Sets provide O(1) existence checking:** When you need to repeatedly check if something exists (but don't care about position or count), a hash set is usually the right choice. This transforms O(n) lookups into O(1) lookups.

3. **Early optimization insight:** Recognize that we're looking for ANY match, not ALL matches. This allows early exit as soon as we find one match, which can significantly improve performance in practice (though not asymptotically).

4. **String reversal is a common operation:** Most languages have efficient built-in ways to reverse strings. Learn your language's idiomatic approach rather than implementing manual reversal.

[Practice this problem on CodeJeet](/problem/existence-of-a-substring-in-a-string-and-its-reverse)
