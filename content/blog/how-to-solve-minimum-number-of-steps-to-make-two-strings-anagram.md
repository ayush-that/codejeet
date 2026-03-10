---
title: "How to Solve Minimum Number of Steps to Make Two Strings Anagram — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Steps to Make Two Strings Anagram. Medium difficulty, 82.5% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-11-04"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-steps-to-make-two-strings-anagram",
    "hash-table",
    "string",
    "counting",
    "medium",
  ]
---

# How to Solve Minimum Number of Steps to Make Two Strings Anagram

This problem asks us to find the minimum number of character replacements needed to transform string `t` into an anagram of string `s`. Both strings have the same length, and we can replace any character in `t` with any other character. What makes this problem interesting is that it's not about finding matching positions, but about balancing character frequencies between the two strings. The key insight is that we only need to count how many characters in `t` are "deficient" compared to what's needed to match `s`.

## Visual Walkthrough

Let's trace through an example: `s = "bab"`, `t = "aba"`

**Step 1: Count character frequencies in both strings**

For `s = "bab"`:

- 'b': 2 occurrences
- 'a': 1 occurrence

For `t = "aba"`:

- 'a': 2 occurrences
- 'b': 1 occurrence

**Step 2: Compare frequencies**

We need to see what's missing in `t` compared to `s`:

- For 'a': `s` has 1, `t` has 2 → `t` has 1 extra 'a'
- For 'b': `s` has 2, `t` has 1 → `t` needs 1 more 'b'

**Step 3: Calculate replacements needed**

We can think of this as: we need to replace some characters in `t` to get the right frequencies. The extra 'a' in `t` can be replaced with the missing 'b'. In fact, each replacement fixes one character deficiency.

The minimum steps = total deficiencies / 2? Wait, let's think carefully...

Actually, each replacement fixes one character that's in excess in `t` and makes it into a character that's deficient. So we only need to count the total deficiencies (or the total excesses - they're the same number).

For our example:

- Total deficiencies = 1 (missing one 'b')
- Total excesses = 1 (extra one 'a')

We need exactly 1 replacement: change one 'a' in `t` to 'b'.

Let's try another example: `s = "leetcode"`, `t = "practice"`

Count frequencies:

- `s`: l:1, e:3, t:1, c:1, o:1, d:1
- `t`: p:1, r:1, a:1, c:2, t:1, i:1, e:1

Compare:

- Characters only in `s` or with higher count in `s`: l, e (needs 2 more), t, o, d
- Characters only in `t` or with higher count in `t`: p, r, a, c (has 1 extra), i

The total deficiency = sum of positive differences when `s_count[char] > t_count[char]`

For each character:

- 'l': 1 - 0 = 1 deficiency
- 'e': 3 - 1 = 2 deficiencies
- 't': 1 - 1 = 0
- 'c': 1 - 2 = -1 (excess, not deficiency)
- 'o': 1 - 0 = 1 deficiency
- 'd': 1 - 0 = 1 deficiency

Total deficiencies = 1 + 2 + 1 + 1 = 5

We need 5 replacements. Each replacement fixes one deficiency by changing an excess character into a deficient one.

## Brute Force Approach

A naive approach might try to actually transform `t` into an anagram of `s` through simulation, but that would be extremely inefficient. Another brute force approach would be:

1. Generate all permutations of `t` (or all possible strings of same length)
2. For each permutation, check if it's an anagram of `s`
3. Count how many positions differ from original `t`
4. Track the minimum difference count

This approach has factorial time complexity O(n!) for generating permutations, which is completely impractical for any reasonable string length.

Even a slightly better brute force would be O(n²): for each character position in `t` that doesn't match the needed frequency, try swapping with other positions. But this still doesn't directly solve the minimum replacements problem.

The key realization is that we don't need to actually transform the string or consider positions at all. We only need to think about character counts.

## Optimized Approach

The optimal solution uses character frequency counting:

1. **Count characters in both strings**: Create frequency maps for `s` and `t`.
2. **Find the deficiency**: For each character, if `s` has more occurrences than `t`, we need that many more of that character in `t`.
3. **Sum the deficiencies**: The total number of characters missing in `t` (compared to `s`) equals the number of replacements needed.

Why does this work? Because:

- Each replacement changes one character in `t`
- We can change any excess character (one that appears more in `t` than in `s`) into a deficient character (one that appears less in `t` than in `s`)
- The total number of excess characters equals the total number of deficient characters (since both strings have the same length)
- Therefore, we need exactly as many replacements as there are deficient characters

Mathematically: Let `diff[char] = count_s[char] - count_t[char]`

- If `diff[char] > 0`: we need `diff[char]` more of this character
- If `diff[char] < 0`: we have `-diff[char]` excess of this character
- Sum of positive diffs = Sum of negative diffs (in absolute value)
- Minimum steps = Sum of positive diffs = (1/2) \* Sum of absolute diffs

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of strings
# Space: O(1) because we use fixed-size arrays of 26 elements
def minSteps(s: str, t: str) -> int:
    # Since strings contain only lowercase English letters,
    # we can use arrays of size 26 to count frequencies
    s_count = [0] * 26
    t_count = [0] * 26

    # Count frequencies of characters in both strings
    # Convert each character to 0-25 index by subtracting 'a'
    for char in s:
        s_count[ord(char) - ord('a')] += 1

    for char in t:
        t_count[ord(char) - ord('a')] += 1

    # Calculate total steps needed
    steps = 0
    for i in range(26):
        # If s has more of character i than t, we need to replace
        # some characters in t to get enough of character i
        if s_count[i] > t_count[i]:
            steps += s_count[i] - t_count[i]

    return steps
```

```javascript
// Time: O(n) where n is length of strings
// Space: O(1) because we use fixed-size arrays of 26 elements
function minSteps(s, t) {
  // Arrays to store frequency of each character (a-z)
  const sCount = new Array(26).fill(0);
  const tCount = new Array(26).fill(0);

  // Count frequencies in string s
  for (let i = 0; i < s.length; i++) {
    const index = s.charCodeAt(i) - "a".charCodeAt(0);
    sCount[index]++;
  }

  // Count frequencies in string t
  for (let i = 0; i < t.length; i++) {
    const index = t.charCodeAt(i) - "a".charCodeAt(0);
    tCount[index]++;
  }

  // Calculate minimum steps
  let steps = 0;
  for (let i = 0; i < 26; i++) {
    // Add the deficit for each character
    if (sCount[i] > tCount[i]) {
      steps += sCount[i] - tCount[i];
    }
  }

  return steps;
}
```

```java
// Time: O(n) where n is length of strings
// Space: O(1) because we use fixed-size arrays of 26 elements
public int minSteps(String s, String t) {
    // Arrays to store frequency of each lowercase letter
    int[] sCount = new int[26];
    int[] tCount = new int[26];

    // Count character frequencies in string s
    for (char c : s.toCharArray()) {
        sCount[c - 'a']++;
    }

    // Count character frequencies in string t
    for (char c : t.toCharArray()) {
        tCount[c - 'a']++;
    }

    // Calculate the minimum number of steps
    int steps = 0;
    for (int i = 0; i < 26; i++) {
        // If s has more occurrences of this character than t,
        // we need to make up the difference through replacements
        if (sCount[i] > tCount[i]) {
            steps += sCount[i] - tCount[i];
        }
    }

    return steps;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through string `s` once: O(n)
- We iterate through string `t` once: O(n)
- We iterate through 26 characters (constant): O(1)
- Total: O(n + n + 26) = O(n)

**Space Complexity: O(1)**

- We use two arrays of size 26 each, regardless of input size
- This is constant space: O(1)
- Even if we used hash maps instead of arrays, the space would still be O(1) since there are at most 26 distinct lowercase English letters

## Common Mistakes

1. **Counting total differences instead of one-sided deficits**: Some candidates sum absolute differences `|count_s[char] - count_t[char]|` and divide by 2. While mathematically correct, this requires understanding why dividing by 2 works. It's clearer to just sum the positive differences (where `s` has more than `t`).

2. **Forgetting strings are same length**: The problem states strings have equal length, which guarantees total excess = total deficit. If a candidate doesn't use this fact, they might overcomplicate the solution.

3. **Using unnecessary data structures**: While hash maps work, arrays of size 26 are more efficient for this constrained character set (lowercase English letters). Hash maps have higher constant overhead.

4. **Off-by-one errors with character indexing**: When converting 'a'-'z' to 0-25, remember `ord('a')` is 97 in ASCII. The correct calculation is `ord(char) - ord('a')`, not `ord(char) - 97` (though both work, the former is more readable and language-agnostic).

## When You'll See This Pattern

This frequency counting pattern appears in many string manipulation problems:

1. **Valid Anagram (Easy)**: Check if two strings are anagrams by comparing character counts.
2. **Determine if Two Strings Are Close (Medium)**: Similar frequency analysis but with additional operations (swap any two existing characters).
3. **Find All Anagrams in a String (Medium)**: Use sliding window with frequency counts to find all substrings that are anagrams of a pattern.
4. **Minimum Window Substring (Hard)**: More complex frequency counting with sliding window to find minimum substring containing all characters of another string.

The core pattern is: when order doesn't matter but character composition does, think about frequency counting rather than position-by-position comparison.

## Key Takeaways

1. **Anagram problems are often frequency problems**: When you need to make strings anagrams or check for anagrams, think in terms of character counts rather than character positions.

2. **Fixed character sets enable array optimization**: When dealing with lowercase/uppercase English letters (26 each) or digits (10), use arrays instead of hash maps for better performance and simpler code.

3. **Minimum operations often equal the deficit**: When transforming one string to match another's character counts, the minimum operations typically equal the total character deficit (or excess, which is the same).

## Related Problems

- [Determine if Two Strings Are Close](/problem/determine-if-two-strings-are-close)
- [Minimum Number of Steps to Make Two Strings Anagram II](/problem/minimum-number-of-steps-to-make-two-strings-anagram-ii)
- [Minimum Operations to Make Character Frequencies Equal](/problem/minimum-operations-to-make-character-frequencies-equal)
