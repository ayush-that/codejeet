---
title: "How to Solve Reconstruct Original Digits from English — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reconstruct Original Digits from English. Medium difficulty, 52.7% acceptance rate. Topics: Hash Table, Math, String."
date: "2027-07-01"
category: "dsa-patterns"
tags: ["reconstruct-original-digits-from-english", "hash-table", "math", "string", "medium"]
---

# How to Solve Reconstruct Original Digits from English

You're given a scrambled string containing English letters from the spelled-out digits 0-9 (like "zero", "one", "two", etc.), and you need to reconstruct the original digits in ascending order. The challenge is that the letters are all mixed together, and you need to figure out which digits were used and how many times each appears.

What makes this problem interesting is that you can't just look for complete words in the string—the letters are completely shuffled. You need a clever counting strategy that leverages unique letters in each digit's spelling to determine counts systematically.

## Visual Walkthrough

Let's trace through an example: `s = "owoztneoer"`

We need to figure out which digits are present. Instead of trying to find complete words, we'll count all letters first:

- Count all letters: w:1, o:3, z:1, t:1, n:1, e:2, r:1

Now, here's the key insight: certain digits have unique letters that appear only in that digit:

1. **Zero** has 'z' which only appears in zero → count of 'z' tells us how many zeros
   - We have 1 'z' → 1 zero

2. **Two** has 'w' which only appears in two → count of 'w' tells us how many twos
   - We have 1 'w' → 1 two

3. **Four** has 'u' which only appears in four → but we don't have 'u' in our string

4. **Six** has 'x' which only appears in six → but we don't have 'x'

5. **Eight** has 'g' which only appears in eight → but we don't have 'g'

After removing letters for zero and two, we look for the next unique identifiers:

6. **One** has 'o' which appears in zero, one, two, four → but we've already accounted for zero and two
   - Remaining 'o' count = 3 (total) - 1 (from zero) - 1 (from two) = 1 → 1 one

7. **Three** has 'h' which appears in three, eight → but we don't have 'h'

8. **Five** has 'f' which appears in four, five → but we don't have 'f'

9. **Seven** has 's' which appears in six, seven → but we don't have 's'

10. **Nine** has 'i' which appears in five, six, eight, nine → but we've accounted for none of these

Actually, we need to follow a specific order: z→0, w→2, u→4, x→6, g→8, then o→1, h→3, f→5, s→7, i→9

Our final digits: 0, 1, 2 → sorted: "012"

## Brute Force Approach

A naive approach would be to try all combinations of digits that could produce the letter counts. For each possible count of each digit (0-9), we could:

1. Generate the expected letter counts for that combination
2. Check if it matches our input letter counts
3. Find all valid combinations and return the smallest number

However, this is extremely inefficient. If the string has length n, we could have up to n/3 digits (since "one" has 3 letters), and trying all combinations would be O(10^(n/3)), which is exponential time.

Even a backtracking approach would be too slow for longer strings. We need a more systematic approach that doesn't involve guessing.

## Optimized Approach

The key insight is that we can determine digit counts in a specific order by looking for "unique identifier" letters:

1. **First pass (unique letters):** Certain digits have letters that appear only in that digit:
   - 'z' appears only in "zero" → count('z') = count(0)
   - 'w' appears only in "two" → count('w') = count(2)
   - 'u' appears only in "four" → count('u') = count(4)
   - 'x' appears only in "six" → count('x') = count(6)
   - 'g' appears only in "eight" → count('g') = count(8)

2. **Second pass (derived from first pass):** After removing counts from the first pass, other digits become identifiable:
   - 'o' appears in zero, one, two, four → count(1) = count('o') - count(0) - count(2) - count(4)
   - 'h' appears in three, eight → count(3) = count('h') - count(8)
   - 'f' appears in four, five → count(5) = count('f') - count(4)
   - 's' appears in six, seven → count(7) = count('s') - count(6)
   - 'i' appears in five, six, eight, nine → count(9) = count('i') - count(5) - count(6) - count(8)

This gives us a deterministic O(n) solution where we just count letters and do simple arithmetic.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is length of s | Space: O(1) for fixed-size arrays
def originalDigits(s: str) -> str:
    # Step 1: Count all letters in the input string
    # We use a list of size 26 for all lowercase English letters
    letter_counts = [0] * 26
    for char in s:
        letter_counts[ord(char) - ord('a')] += 1

    # Step 2: Count each digit using the unique identifier approach
    # We'll store counts for digits 0-9
    digit_counts = [0] * 10

    # First pass: digits with completely unique letters
    # 'z' only in zero
    digit_counts[0] = letter_counts[ord('z') - ord('a')]
    # 'w' only in two
    digit_counts[2] = letter_counts[ord('w') - ord('a')]
    # 'u' only in four
    digit_counts[4] = letter_counts[ord('u') - ord('a')]
    # 'x' only in six
    digit_counts[6] = letter_counts[ord('x') - ord('a')]
    # 'g' only in eight
    digit_counts[8] = letter_counts[ord('g') - ord('a')]

    # Second pass: digits that can be derived after first pass
    # 'o' appears in zero, one, two, four
    # So ones = total 'o' minus 'o' from zero, two, four
    digit_counts[1] = (letter_counts[ord('o') - ord('a')] -
                      digit_counts[0] - digit_counts[2] - digit_counts[4])

    # 'h' appears in three and eight
    # So threes = total 'h' minus 'h' from eight
    digit_counts[3] = (letter_counts[ord('h') - ord('a')] -
                      digit_counts[8])

    # 'f' appears in four and five
    # So fives = total 'f' minus 'f' from four
    digit_counts[5] = (letter_counts[ord('f') - ord('a')] -
                      digit_counts[4])

    # 's' appears in six and seven
    # So sevens = total 's' minus 's' from six
    digit_counts[7] = (letter_counts[ord('s') - ord('a')] -
                      digit_counts[6])

    # 'i' appears in five, six, eight, nine
    # So nines = total 'i' minus 'i' from five, six, eight
    digit_counts[9] = (letter_counts[ord('i') - ord('a')] -
                      digit_counts[5] - digit_counts[6] - digit_counts[8])

    # Step 3: Build the result string in ascending order
    result = []
    for digit in range(10):
        # Append the digit repeated count times
        result.append(str(digit) * digit_counts[digit])

    return ''.join(result)
```

```javascript
// Time: O(n) where n is length of s | Space: O(1) for fixed-size arrays
function originalDigits(s) {
  // Step 1: Count all letters in the input string
  // We use an array of size 26 for all lowercase English letters
  const letterCounts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    const charCode = s.charCodeAt(i) - 97; // 'a' = 97
    letterCounts[charCode]++;
  }

  // Step 2: Count each digit using the unique identifier approach
  // We'll store counts for digits 0-9
  const digitCounts = new Array(10).fill(0);

  // First pass: digits with completely unique letters
  // 'z' only in zero
  digitCounts[0] = letterCounts["z".charCodeAt(0) - 97];
  // 'w' only in two
  digitCounts[2] = letterCounts["w".charCodeAt(0) - 97];
  // 'u' only in four
  digitCounts[4] = letterCounts["u".charCodeAt(0) - 97];
  // 'x' only in six
  digitCounts[6] = letterCounts["x".charCodeAt(0) - 97];
  // 'g' only in eight
  digitCounts[8] = letterCounts["g".charCodeAt(0) - 97];

  // Second pass: digits that can be derived after first pass
  // 'o' appears in zero, one, two, four
  // So ones = total 'o' minus 'o' from zero, two, four
  digitCounts[1] =
    letterCounts["o".charCodeAt(0) - 97] - digitCounts[0] - digitCounts[2] - digitCounts[4];

  // 'h' appears in three and eight
  // So threes = total 'h' minus 'h' from eight
  digitCounts[3] = letterCounts["h".charCodeAt(0) - 97] - digitCounts[8];

  // 'f' appears in four and five
  // So fives = total 'f' minus 'f' from four
  digitCounts[5] = letterCounts["f".charCodeAt(0) - 97] - digitCounts[4];

  // 's' appears in six and seven
  // So sevens = total 's' minus 's' from six
  digitCounts[7] = letterCounts["s".charCodeAt(0) - 97] - digitCounts[6];

  // 'i' appears in five, six, eight, nine
  // So nines = total 'i' minus 'i' from five, six, eight
  digitCounts[9] =
    letterCounts["i".charCodeAt(0) - 97] - digitCounts[5] - digitCounts[6] - digitCounts[8];

  // Step 3: Build the result string in ascending order
  let result = "";
  for (let digit = 0; digit < 10; digit++) {
    // Append the digit repeated count times
    result += digit.toString().repeat(digitCounts[digit]);
  }

  return result;
}
```

```java
// Time: O(n) where n is length of s | Space: O(1) for fixed-size arrays
public String originalDigits(String s) {
    // Step 1: Count all letters in the input string
    // We use an array of size 26 for all lowercase English letters
    int[] letterCounts = new int[26];
    for (char c : s.toCharArray()) {
        letterCounts[c - 'a']++;
    }

    // Step 2: Count each digit using the unique identifier approach
    // We'll store counts for digits 0-9
    int[] digitCounts = new int[10];

    // First pass: digits with completely unique letters
    // 'z' only in zero
    digitCounts[0] = letterCounts['z' - 'a'];
    // 'w' only in two
    digitCounts[2] = letterCounts['w' - 'a'];
    // 'u' only in four
    digitCounts[4] = letterCounts['u' - 'a'];
    // 'x' only in six
    digitCounts[6] = letterCounts['x' - 'a'];
    // 'g' only in eight
    digitCounts[8] = letterCounts['g' - 'a'];

    // Second pass: digits that can be derived after first pass
    // 'o' appears in zero, one, two, four
    // So ones = total 'o' minus 'o' from zero, two, four
    digitCounts[1] = letterCounts['o' - 'a'] -
                     digitCounts[0] - digitCounts[2] - digitCounts[4];

    // 'h' appears in three and eight
    // So threes = total 'h' minus 'h' from eight
    digitCounts[3] = letterCounts['h' - 'a'] -
                     digitCounts[8];

    // 'f' appears in four and five
    // So fives = total 'f' minus 'f' from four
    digitCounts[5] = letterCounts['f' - 'a'] -
                     digitCounts[4];

    // 's' appears in six and seven
    // So sevens = total 's' minus 's' from six
    digitCounts[7] = letterCounts['s' - 'a'] -
                     digitCounts[6];

    // 'i' appears in five, six, eight, nine
    // So nines = total 'i' minus 'i' from five, six, eight
    digitCounts[9] = letterCounts['i' - 'a'] -
                     digitCounts[5] - digitCounts[6] - digitCounts[8];

    // Step 3: Build the result string in ascending order
    StringBuilder result = new StringBuilder();
    for (int digit = 0; digit < 10; digit++) {
        // Append the digit repeated count times
        for (int i = 0; i < digitCounts[digit]; i++) {
            result.append(digit);
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting all letters in the string takes O(n) where n is the length of the input string
- Calculating digit counts takes O(1) time since we're just doing constant-time array accesses and arithmetic
- Building the result string takes O(n) in the worst case (if all digits are present)

**Space Complexity: O(1)**

- The letter_counts array is size 26 (constant)
- The digit_counts array is size 10 (constant)
- The result string could be O(n) in the worst case, but this is output space, not auxiliary space
- Auxiliary space used is O(1) since we use fixed-size arrays regardless of input size

## Common Mistakes

1. **Wrong order of processing digits**: If you don't process digits in the correct order (0, 2, 4, 6, 8 first, then 1, 3, 5, 7, 9), you'll get incorrect results. For example, if you try to count ones before zeros and twos, you'll incorrectly allocate 'o' letters.

2. **Forgetting that counts can be zero**: When subtracting counts in the second pass, you might get negative numbers if you don't account for the fact that some digits might have zero occurrences. Always ensure your arithmetic handles zero counts correctly.

3. **Not returning digits in ascending order**: The problem specifically asks for digits in ascending order. Some candidates return them in the order they were discovered (0, 2, 4, 6, 8, 1, 3, 5, 7, 9) instead of 0-9.

4. **Overcomplicating with backtracking or DFS**: Some candidates try to use backtracking to find valid combinations, which is exponential time. The unique identifier approach is much simpler and more efficient.

## When You'll See This Pattern

This "unique identifier" or "characteristic feature" pattern appears in problems where you need to count or identify components in a mixed representation:

1. **Find Anagram Mappings (LeetCode 760)**: Similar idea of using unique mappings to reconstruct relationships.

2. **Custom Sort String (LeetCode 791)**: Ordering characters based on a custom order, often using counting arrays.

3. **Group Anagrams (LeetCode 49)**: Using character counts as fingerprints to group similar items.

The core pattern is: when dealing with scrambled representations, look for invariant features or unique markers that survive the scrambling process.

## Key Takeaways

1. **Look for unique identifiers**: When elements are mixed together, identify features that are unique to each element. In this case, certain letters appear only in specific digits.

2. **Process in dependency order**: Solve for the most constrained elements first (those with unique features), then use that information to solve for less constrained elements.

3. **Counting arrays are powerful**: For problems involving limited character sets (like lowercase English letters), fixed-size counting arrays provide O(1) access and are more efficient than hash maps for simple counting tasks.

[Practice this problem on CodeJeet](/problem/reconstruct-original-digits-from-english)
