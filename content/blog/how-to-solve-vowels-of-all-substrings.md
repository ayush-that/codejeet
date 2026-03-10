---
title: "How to Solve Vowels of All Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Vowels of All Substrings. Medium difficulty, 55.2% acceptance rate. Topics: Math, String, Dynamic Programming, Combinatorics."
date: "2028-10-22"
category: "dsa-patterns"
tags: ["vowels-of-all-substrings", "math", "string", "dynamic-programming", "medium"]
---

# How to Solve Vowels of All Substrings

This problem asks us to calculate the total number of vowels across every possible substring of a given string. At first glance, you might think you need to generate all substrings and count vowels in each one, but with strings up to 100,000 characters, that approach would be far too slow. The key insight is that we don't need to examine every substring individually—instead, we can calculate how many substrings each character contributes to based on its position.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider the string `"abc"`:

All substrings of `"abc"`:

- `"a"` (1 vowel)
- `"ab"` (1 vowel)
- `"abc"` (1 vowel)
- `"b"` (0 vowels)
- `"bc"` (0 vowels)
- `"c"` (0 vowels)

Total vowels = 3

But let's think about this differently. The vowel `'a'` appears in 3 substrings:

1. `"a"` (starting at index 0, length 1)
2. `"ab"` (starting at index 0, length 2)
3. `"abc"` (starting at index 0, length 3)

Notice that `'a'` is at position 0 (first character). For any character at position `i`, the number of substrings containing it is:

- `(i + 1)` choices for where the substring can start (any position from 0 to i)
- `(n - i)` choices for where the substring can end (any position from i to n-1)

So for position 0: `(0 + 1) × (3 - 0) = 1 × 3 = 3` substrings.

Let's try `"aba"` (vowels: a, b, a):

- `'a'` at position 0: contributes to `(0+1) × (3-0) = 1 × 3 = 3` substrings
- `'b'` at position 1: not a vowel, contributes 0
- `'a'` at position 2: contributes to `(2+1) × (3-2) = 3 × 1 = 3` substrings

Total = 3 + 3 = 6

Let's verify by listing all substrings:

- `"a"` (1), `"ab"` (1), `"aba"` (2)
- `"b"` (0), `"ba"` (1)
- `"a"` (1)

Total = 1+1+2+0+1+1 = 6 ✓

This pattern gives us an O(n) solution: for each character, if it's a vowel, add `(i+1) × (n-i)` to the total.

## Brute Force Approach

The most straightforward approach is to generate all substrings and count vowels in each one:

1. Generate all possible substrings using nested loops
2. For each substring, count how many vowels it contains
3. Sum up all the vowel counts

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countVowels_brute(word):
    n = len(word)
    total = 0
    vowels = set('aeiou')

    # Generate all substrings
    for i in range(n):          # O(n) starting positions
        for j in range(i, n):   # O(n) ending positions
            # Count vowels in substring word[i:j+1]
            for k in range(i, j+1):  # O(n) characters in substring
                if word[k] in vowels:
                    total += 1

    return total
```

```javascript
// Time: O(n³) | Space: O(1)
function countVowelsBrute(word) {
  const n = word.length;
  let total = 0;
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    // O(n) starting positions
    for (let j = i; j < n; j++) {
      // O(n) ending positions
      // Count vowels in substring word[i..j]
      for (let k = i; k <= j; k++) {
        // O(n) characters in substring
        if (vowels.has(word[k])) {
          total++;
        }
      }
    }
  }

  return total;
}
```

```java
// Time: O(n³) | Space: O(1)
public long countVowelsBrute(String word) {
    int n = word.length();
    long total = 0;
    Set<Character> vowels = new HashSet<>(Arrays.asList('a', 'e', 'i', 'o', 'u'));

    // Generate all substrings
    for (int i = 0; i < n; i++) {           // O(n) starting positions
        for (int j = i; j < n; j++) {       // O(n) ending positions
            // Count vowels in substring word[i..j]
            for (int k = i; k <= j; k++) {  // O(n) characters in substring
                if (vowels.contains(word.charAt(k))) {
                    total++;
                }
            }
        }
    }

    return total;
}
```

</div>

**Why this fails:** With n up to 100,000, O(n³) is impossibly slow. Even O(n²) would be too slow (10¹⁰ operations). We need an O(n) solution.

## Optimized Approach

The key insight is combinatorial: instead of asking "how many vowels are in each substring?", we ask "how many substrings contain this vowel?"

For a character at index `i` in a string of length `n`:

- It can be the first character of a substring, or second, or third... up to the `(i+1)`-th character
- The substring can end at position `i`, or `i+1`, or `i+2`... up to position `n-1`

Thus, the number of substrings containing character at position `i` is:

```
(i + 1) × (n - i)
```

Why?

- `(i + 1)` represents the number of possible starting positions (0 through i)
- `(n - i)` represents the number of possible ending positions (i through n-1)

If the character is a vowel, it contributes this many to the total. We simply sum this value for all vowel positions.

## Optimal Solution

Here's the O(n) solution using the combinatorial approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countVowels(word):
    """
    Calculate total vowels in all substrings using combinatorial approach.
    For each vowel at position i, it contributes to (i+1)*(n-i) substrings.
    """
    n = len(word)
    total = 0
    vowels = set('aeiou')

    # Iterate through each character in the string
    for i in range(n):
        # Check if current character is a vowel
        if word[i] in vowels:
            # Calculate contribution: number of substrings containing this vowel
            # (i+1) choices for start position, (n-i) choices for end position
            contribution = (i + 1) * (n - i)
            total += contribution

    return total
```

```javascript
// Time: O(n) | Space: O(1)
function countVowels(word) {
  /**
   * Calculate total vowels in all substrings using combinatorial approach.
   * For each vowel at position i, it contributes to (i+1)*(n-i) substrings.
   */
  const n = word.length;
  let total = 0;
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  // Iterate through each character in the string
  for (let i = 0; i < n; i++) {
    // Check if current character is a vowel
    if (vowels.has(word[i])) {
      // Calculate contribution: number of substrings containing this vowel
      // (i+1) choices for start position, (n-i) choices for end position
      const contribution = (i + 1) * (n - i);
      total += contribution;
    }
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(1)
public long countVowels(String word) {
    /**
     * Calculate total vowels in all substrings using combinatorial approach.
     * For each vowel at position i, it contributes to (i+1)*(n-i) substrings.
     */
    int n = word.length();
    long total = 0;  // Use long to prevent overflow for large n
    Set<Character> vowels = new HashSet<>(Arrays.asList('a', 'e', 'i', 'o', 'u'));

    // Iterate through each character in the string
    for (int i = 0; i < n; i++) {
        // Check if current character is a vowel
        if (vowels.contains(word.charAt(i))) {
            // Calculate contribution: number of substrings containing this vowel
            // (i+1) choices for start position, (n-i) choices for end position
            long contribution = (long)(i + 1) * (n - i);
            total += contribution;
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing O(1) operations per character
- Checking if a character is a vowel is O(1) with a hash set
- The arithmetic operations are O(1)

**Space Complexity: O(1)**

- We use a constant amount of extra space: the vowel set (5 elements), a few variables for counting
- The input string is not counted in space complexity

## Common Mistakes

1. **Integer overflow**: With n up to 100,000, `(i+1)*(n-i)` can be as large as ~2.5×10⁹, which fits in 32-bit signed integers. However, the total sum across all vowels could exceed 2³¹-1. Always use 64-bit integers (long in Java/C++, long long in C).

2. **Off-by-one errors in the formula**: Remember it's `(i+1) × (n-i)`, not `i × (n-i)` or `(i+1) × (n-i-1)`. Test with small examples to verify.

3. **Case sensitivity**: The problem states vowels are lowercase ('a', 'e', 'i', 'o', 'u'). If your input might have uppercase, you'd need to handle that, but the problem guarantees lowercase.

4. **Forgetting to handle empty string**: While the problem states non-empty substrings, the input string itself could be empty. Check constraints: 1 ≤ word.length ≤ 100,000, so we don't need to handle empty input.

## When You'll See This Pattern

This "contribution of each element" pattern appears in many substring/counting problems:

1. **Number of Substrings Containing All Three Characters (LeetCode 1358)**: Similar approach where you count how many substrings contain at least one of each character 'a', 'b', 'c'.

2. **Total Appeal of A String (LeetCode 2262)**: Almost identical problem—instead of counting vowels, you count the number of distinct characters contributed by each position.

3. **Sum of Substring Scores (various problems)**: Any problem asking for the sum of some property across all substrings often benefits from considering each element's contribution.

The core insight is: when asked to sum something over all substrings, consider how many substrings each position/element contributes to, rather than examining each substring individually.

## Key Takeaways

1. **Think in terms of contribution**: When summing over all substrings, calculate how many substrings each character contributes to based on its position. The formula `(i+1) × (n-i)` gives the number of substrings containing the character at index `i`.

2. **Avoid O(n²) substring generation**: If n can be 10⁵, O(n²) is 10¹⁰ operations—too slow. Look for O(n) or O(n log n) solutions.

3. **Test with small examples**: Always verify your formula with small strings (length 1-3) where you can manually enumerate all substrings.

4. **Watch for overflow**: When dealing with large n and multiplication, use 64-bit integers to prevent overflow.

Related problems: [Number of Substrings Containing All Three Characters](/problem/number-of-substrings-containing-all-three-characters), [Total Appeal of A String](/problem/total-appeal-of-a-string)
