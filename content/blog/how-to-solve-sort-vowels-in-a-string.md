---
title: "How to Solve Sort Vowels in a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort Vowels in a String. Medium difficulty, 83.4% acceptance rate. Topics: String, Sorting."
date: "2027-12-23"
category: "dsa-patterns"
tags: ["sort-vowels-in-a-string", "string", "sorting", "medium"]
---

# How to Solve Sort Vowels in a String

This problem asks us to rearrange a string so that all vowels are sorted in non-decreasing order while consonants stay in their original positions. What makes this interesting is that we need to separate vowel processing from consonant preservation—a classic "two-track" string manipulation problem where we process different character types differently.

## Visual Walkthrough

Let's trace through the example `s = "lEetcOde"`:

**Step 1: Identify vowels and their positions**

- String: `l E e t c O d e`
- Indices: `0 1 2 3 4 5 6 7`
- Vowels: `E` (index 1), `e` (index 2), `O` (index 5), `e` (index 7)
- Consonants: `l`, `t`, `c`, `d` stay in positions 0, 3, 4, 6

**Step 2: Extract and sort vowels**

- Vowels found: `['E', 'e', 'O', 'e']`
- Sort them: `['E', 'O', 'e', 'e']` (ASCII order: 'E'=69, 'O'=79, 'e'=101)

**Step 3: Reconstruct the string**

- Start with an empty result array
- For each position in original string:
  - Position 0: `l` is consonant → keep `l`
  - Position 1: `E` was vowel → use first sorted vowel `E`
  - Position 2: `e` was vowel → use next sorted vowel `O`
  - Position 3: `t` is consonant → keep `t`
  - Position 4: `c` is consonant → keep `c`
  - Position 5: `O` was vowel → use next sorted vowel `e`
  - Position 6: `d` is consonant → keep `d`
  - Position 7: `e` was vowel → use last sorted vowel `e`

**Result:** `"lEOtcede"`

## Brute Force Approach

A naive approach might try to sort the entire string and then somehow rearrange consonants back to their original positions. However, this quickly becomes complex because:

1. Sorting the whole string destroys consonant positions
2. Trying to swap consonants back would require tracking original positions and performing multiple passes
3. The vowel sorting requirement is case-sensitive ('A' vs 'a' matter)

Here's what a brute force attempt might look like:

```python
def sortVowelsBrute(s):
    vowels = []
    vowel_positions = []

    # First pass: collect vowels and their positions
    for i, ch in enumerate(s):
        if ch.lower() in 'aeiou':
            vowels.append(ch)
            vowel_positions.append(i)

    # Sort vowels
    vowels.sort()

    # Build result by replacing vowels at their positions
    result = list(s)
    for pos, vowel in zip(vowel_positions, vowels):
        result[pos] = vowel

    return ''.join(result)
```

While this brute force actually works for this problem, it's not truly "brute force" in the sense of being inefficient—it's actually the optimal approach! The confusion here is that the problem naturally lends itself to a straightforward O(n log n) solution. A truly naive candidate might try to implement bubble-sort-like swapping only on vowels, which would be O(n²).

## Optimized Approach

The key insight is that we can process the string in two independent phases:

1. **Identification phase**: Scan the string once to identify which positions contain vowels and collect all vowel characters
2. **Replacement phase**: Sort the collected vowels, then scan the string again, replacing vowels in order with sorted vowels

Why this works efficiently:

- We separate the problem into independent subproblems
- Sorting is only applied to the vowel subset, not the entire string
- String reconstruction is a simple linear pass

The algorithm breakdown:

1. Define what constitutes a vowel (case-sensitive: 'a', 'e', 'i', 'o', 'u' and their uppercase versions)
2. First pass: collect all vowels from the string into a list
3. Sort the vowel list
4. Second pass: build the result string, using sorted vowels for vowel positions
5. Use a pointer to track which sorted vowel to use next

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) - due to sorting vowels | Space: O(n) - for storing vowels and result
def sortVowels(s):
    """
    Sort vowels in a string while keeping consonants in their original positions.

    Args:
        s: Input string to process

    Returns:
        String with vowels sorted in non-decreasing order
    """
    # Step 1: Define vowel set for O(1) lookup
    vowels_set = set('aeiouAEIOU')

    # Step 2: Extract all vowels from the string
    vowels = []
    for ch in s:
        if ch in vowels_set:
            vowels.append(ch)

    # Step 3: Sort vowels in non-decreasing order
    # Python sorts strings lexicographically by ASCII values
    vowels.sort()

    # Step 4: Reconstruct the string with sorted vowels
    result = []
    vowel_index = 0  # Pointer to track which sorted vowel to use next

    for ch in s:
        if ch in vowels_set:
            # Replace vowel with next sorted vowel
            result.append(vowels[vowel_index])
            vowel_index += 1
        else:
            # Keep consonant in its original position
            result.append(ch)

    # Step 5: Convert list back to string
    return ''.join(result)
```

```javascript
// Time: O(n log n) - due to sorting vowels | Space: O(n) - for storing vowels and result
function sortVowels(s) {
  /**
   * Sort vowels in a string while keeping consonants in their original positions.
   *
   * @param {string} s - Input string to process
   * @return {string} String with vowels sorted in non-decreasing order
   */

  // Step 1: Define vowel set for O(1) lookup
  const vowelsSet = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  // Step 2: Extract all vowels from the string
  const vowels = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (vowelsSet.has(ch)) {
      vowels.push(ch);
    }
  }

  // Step 3: Sort vowels in non-decreasing order
  // JavaScript sorts strings based on UTF-16 code unit values
  vowels.sort();

  // Step 4: Reconstruct the string with sorted vowels
  const result = [];
  let vowelIndex = 0; // Pointer to track which sorted vowel to use next

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (vowelsSet.has(ch)) {
      // Replace vowel with next sorted vowel
      result.push(vowels[vowelIndex]);
      vowelIndex++;
    } else {
      // Keep consonant in its original position
      result.push(ch);
    }
  }

  // Step 5: Convert array back to string
  return result.join("");
}
```

```java
// Time: O(n log n) - due to sorting vowels | Space: O(n) - for storing vowels and result
import java.util.*;

class Solution {
    public String sortVowels(String s) {
        /**
         * Sort vowels in a string while keeping consonants in their original positions.
         *
         * @param s Input string to process
         * @return String with vowels sorted in non-decreasing order
         */

        // Step 1: Define vowel set for O(1) lookup
        Set<Character> vowelsSet = new HashSet<>();
        String vowelString = "aeiouAEIOU";
        for (char c : vowelString.toCharArray()) {
            vowelsSet.add(c);
        }

        // Step 2: Extract all vowels from the string
        List<Character> vowels = new ArrayList<>();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (vowelsSet.contains(ch)) {
                vowels.add(ch);
            }
        }

        // Step 3: Sort vowels in non-decreasing order
        Collections.sort(vowels);

        // Step 4: Reconstruct the string with sorted vowels
        StringBuilder result = new StringBuilder();
        int vowelIndex = 0;  // Pointer to track which sorted vowel to use next

        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (vowelsSet.contains(ch)) {
                // Replace vowel with next sorted vowel
                result.append(vowels.get(vowelIndex));
                vowelIndex++;
            } else {
                // Keep consonant in its original position
                result.append(ch);
            }
        }

        // Step 5: Return the final string
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Extracting vowels: O(n) for scanning the string once
- Sorting vowels: O(k log k) where k is the number of vowels
- In worst case (all characters are vowels), k = n, so O(n log n)
- Reconstructing string: O(n) for the second pass
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- Storing the vowel list: O(k) where k ≤ n
- Building the result: O(n) for the new string
- Vowel set: O(1) since it's fixed size (10 characters)
- Total: O(n) for the result string plus vowel storage

## Common Mistakes

1. **Case-insensitive vowel checking**: Forgetting that 'A' and 'a' are different characters with different ASCII values. The problem requires case-sensitive sorting, so 'A' (65) comes before 'a' (97).

2. **Modifying string in-place inefficiently**: Strings are immutable in most languages, so trying to modify characters directly leads to O(n²) complexity. Always build a new result string or use a mutable data structure like list/array.

3. **Incorrect vowel definition**: Some candidates include 'y' as a vowel or forget uppercase vowels. Always use the exact set: {'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'}.

4. **Off-by-one with vowel pointer**: When reconstructing, forgetting to increment the vowel index after using a sorted vowel, causing the same vowel to be used repeatedly.

5. **Sorting the entire string**: Attempting to sort the whole string and then rearrange consonants back is much more complex and error-prone than the two-pass approach.

## When You'll See This Pattern

This "separate and process" pattern appears in many string manipulation problems:

1. **Reverse Vowels of a String (LeetCode 345)** - Similar structure but with reversal instead of sorting. You still separate vowels from consonants, process them (reverse), then reinsert.

2. **Sort Characters By Frequency (LeetCode 451)** - Separate characters, count frequencies, sort by frequency, then reconstruct.

3. **Custom Sort String (LeetCode 791)** - Process characters according to a custom order, similar to processing vowels and consonants differently.

The core pattern is: identify elements that need special processing, extract them, process separately, then merge back with the unchanged elements.

## Key Takeaways

1. **Separation of concerns**: When different elements need different processing, extract them first, process independently, then recombine. This simplifies logic and reduces edge cases.

2. **Two-pointer reconstruction**: When merging processed elements back into their original positions, use a pointer to track which processed element to use next. This avoids complex index calculations.

3. **Case sensitivity matters**: Always check whether the problem treats uppercase and lowercase as distinct. ASCII values differ, so 'A' ≠ 'a' in sorting.

4. **String building efficiency**: Since strings are immutable, build results using StringBuilder (Java), list (Python), or array (JavaScript) for O(n) construction, then convert to string once.

Related problems: [Reverse Vowels of a String](/problem/reverse-vowels-of-a-string)
