---
title: "How to Solve Count the Number of Vowel Strings in Range — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count the Number of Vowel Strings in Range. Easy difficulty, 74.1% acceptance rate. Topics: Array, String, Counting."
date: "2027-09-06"
category: "dsa-patterns"
tags: ["count-the-number-of-vowel-strings-in-range", "array", "string", "counting", "easy"]
---

# How to Solve Count the Number of Vowel Strings in Range

This problem asks us to count how many strings in a given subarray start and end with a vowel. While straightforward, it tests your ability to work with string boundaries, array ranges, and simple character checking efficiently. The tricky part isn't complexity—it's careful implementation: handling the `left` and `right` bounds correctly, checking only the first and last characters, and remembering that vowels are case-sensitive.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `words = ["apple", "banana", "orange", "egg", "umbrella"]`, `left = 1`, `right = 3`

We need to check strings from index 1 to 3 inclusive:

- Index 1: `"banana"` → starts with 'b' (not vowel), ends with 'a' (vowel) ❌
- Index 2: `"orange"` → starts with 'o' (vowel), ends with 'e' (vowel) ✅
- Index 3: `"egg"` → starts with 'e' (vowel), ends with 'g' (not vowel) ❌

**Result:** 1 vowel string found.

Notice we only check the first and last character of each string—no need to examine the entire string. Also, `left` and `right` define an inclusive range, so we include both endpoints.

## Brute Force Approach

The brute force approach is actually optimal for this problem because we must examine each string in the range at least once. However, a "naive" implementation might make unnecessary checks:

1. Iterate through all indices from `left` to `right` inclusive
2. For each string, check if its first character is a vowel
3. Check if its last character is a vowel
4. If both are true, increment our counter

The only optimization needed is efficient vowel checking. A truly naive approach might convert the entire string to lowercase or check every character, but since the problem specifies lowercase vowels only, we can check directly.

## Optimal Solution

The optimal solution follows the brute force logic but implements it cleanly. We'll:

1. Initialize a counter to 0
2. Loop through indices from `left` to `right` inclusive
3. For each word, check if both first and last characters are vowels
4. Use a set for O(1) vowel lookups
5. Return the count

<div class="code-group">

```python
# Time: O(n) where n = right - left + 1 | Space: O(1) excluding input storage
def vowelStrings(words, left, right):
    """
    Counts how many strings in words[left:right+1] start and end with vowels.

    Args:
        words: List of lowercase strings
        left: Starting index (inclusive)
        right: Ending index (inclusive)

    Returns:
        Number of vowel strings in the specified range
    """
    # Set of vowels for O(1) membership testing
    vowels = {'a', 'e', 'i', 'o', 'u'}

    count = 0

    # Iterate through the specified range (inclusive)
    for i in range(left, right + 1):
        word = words[i]

        # Check if word has at least one character (problem guarantees non-empty)
        # Verify first character is vowel AND last character is vowel
        if word[0] in vowels and word[-1] in vowels:
            count += 1

    return count
```

```javascript
// Time: O(n) where n = right - left + 1 | Space: O(1) excluding input storage
/**
 * Counts how many strings in words[left:right+1] start and end with vowels.
 *
 * @param {string[]} words - Array of lowercase strings
 * @param {number} left - Starting index (inclusive)
 * @param {number} right - Ending index (inclusive)
 * @return {number} Number of vowel strings in the specified range
 */
function vowelStrings(words, left, right) {
  // Set of vowels for O(1) membership testing
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  let count = 0;

  // Iterate through the specified range (inclusive)
  for (let i = left; i <= right; i++) {
    const word = words[i];

    // Check if first character is vowel AND last character is vowel
    if (vowels.has(word[0]) && vowels.has(word[word.length - 1])) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) where n = right - left + 1 | Space: O(1) excluding input storage
import java.util.Set;
import java.util.HashSet;

class Solution {
    /**
     * Counts how many strings in words[left:right+1] start and end with vowels.
     *
     * @param words Array of lowercase strings
     * @param left Starting index (inclusive)
     * @param right Ending index (inclusive)
     * @return Number of vowel strings in the specified range
     */
    public int vowelStrings(String[] words, int left, int right) {
        // Set of vowels for O(1) membership testing
        Set<Character> vowels = new HashSet<>();
        vowels.add('a');
        vowels.add('e');
        vowels.add('i');
        vowels.add('o');
        vowels.add('u');

        int count = 0;

        // Iterate through the specified range (inclusive)
        for (int i = left; i <= right; i++) {
            String word = words[i];

            // Check if first character is vowel AND last character is vowel
            if (vowels.contains(word.charAt(0)) &&
                vowels.contains(word.charAt(word.length() - 1))) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n = `right - left + 1` (the number of strings we check). For each string, we perform two O(1) set lookups and two O(1) character accesses.

**Space Complexity:** O(1) extra space (excluding the input storage). The vowel set uses constant space (5 elements). Some might argue it's O(1) since the set size is fixed regardless of input size.

## Common Mistakes

1. **Off-by-one errors with the range:** The most common mistake is using `i < right` instead of `i <= right`. Remember: `right` is inclusive. Always test with `left = right` to catch this.

2. **Case sensitivity issues:** The problem states vowel characters are lowercase, but some candidates might check for uppercase vowels too. The input guarantees lowercase strings, so checking only lowercase is correct.

3. **Inefficient vowel checking:** Using a long `if` statement with multiple `or` conditions (`if ch == 'a' or ch == 'e' ...`) is fine, but a set is cleaner. Avoid checking the entire string—only check `word[0]` and `word[-1]`.

4. **Empty string handling:** While the problem guarantees non-empty strings, in interviews you might mention this assumption. A robust solution would check `if word.length() > 0` before accessing `word[0]` and `word[-1]`.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Array range iteration** - Similar to problems like "Range Sum Query - Immutable" (LeetCode 303) where you process a subarray. The key is understanding inclusive/exclusive bounds.

2. **Character classification** - Like "Jewels and Stones" (LeetCode 771) where you check if characters belong to a set. Using a hash set for O(1) lookups is the optimal approach.

3. **String boundary checking** - Appears in problems like "Palindrome Number" (LeetCode 9) where you compare first and last digits/characters. The pattern of checking `s[0]` and `s[-1]` is common.

## Key Takeaways

1. **Use sets for membership testing** when checking against a fixed collection of values (like vowels). It's cleaner and more efficient than long conditional chains.

2. **Pay attention to inclusive/exclusive bounds** in array problems. When a problem says "from left to right inclusive," your loop should use `i <= right`, not `i < right`.

3. **Only check what's necessary**—here we only examine the first and last character of each string. Don't waste time processing the entire string when the problem only cares about boundaries.

[Practice this problem on CodeJeet](/problem/count-the-number-of-vowel-strings-in-range)
