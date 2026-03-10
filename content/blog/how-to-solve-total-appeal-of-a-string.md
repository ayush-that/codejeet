---
title: "How to Solve Total Appeal of A String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Total Appeal of A String. Hard difficulty, 56.4% acceptance rate. Topics: Hash Table, String, Dynamic Programming."
date: "2028-09-08"
category: "dsa-patterns"
tags: ["total-appeal-of-a-string", "hash-table", "string", "dynamic-programming", "hard"]
---

# How to Solve Total Appeal of A String

This problem asks us to compute the sum of appeals (number of distinct characters) across all substrings of a given string. What makes this problem tricky is that a naive approach would examine all O(n²) substrings, but we need to find a way to compute the total appeal in O(n) time. The key insight is to think about how each character contributes to the total appeal, rather than examining each substring individually.

## Visual Walkthrough

Let's trace through the example `s = "abbca"` to build intuition:

**Step 1: List all substrings and their appeals:**

- `"a"`: appeal = 1 (distinct: 'a')
- `"ab"`: appeal = 2 (distinct: 'a', 'b')
- `"abb"`: appeal = 2 (distinct: 'a', 'b')
- `"abbc"`: appeal = 3 (distinct: 'a', 'b', 'c')
- `"abbca"`: appeal = 3 (distinct: 'a', 'b', 'c')
- `"b"`: appeal = 1 (distinct: 'b')
- `"bb"`: appeal = 1 (distinct: 'b')
- `"bbc"`: appeal = 2 (distinct: 'b', 'c')
- `"bbca"`: appeal = 3 (distinct: 'a', 'b', 'c')
- `"b"`: appeal = 1 (distinct: 'b')
- `"bc"`: appeal = 2 (distinct: 'b', 'c')
- `"bca"`: appeal = 3 (distinct: 'a', 'b', 'c')
- `"c"`: appeal = 1 (distinct: 'c')
- `"ca"`: appeal = 2 (distinct: 'a', 'c')
- `"a"`: appeal = 1 (distinct: 'a')

Summing all appeals: 1+2+2+3+3+1+1+2+3+1+2+3+1+2+1 = 31

**Step 2: The key insight**
Instead of enumerating all substrings, we can think: "For each character position, how many substrings contain this character as their first occurrence of that character type?"

For example, consider the first 'a' at index 0:

- It contributes to all substrings starting at or before index 0 and ending at or after index 0
- That's (0 - (-1)) × (5 - 0) = 1 × 5 = 5 substrings
- Wait, but we need to be careful about duplicates...

Actually, the correct thinking is: "A character at position i contributes to the appeal of a substring if it's the first occurrence of that character within that substring." So for character 'a' at index 0, it contributes to all substrings where no earlier 'a' appears.

**Step 3: Contribution calculation**
Let's track the last occurrence of each character:

- For 'a' at index 0: last occurrence was at -1 (none before), so it contributes to (0 - (-1)) × (5 - 0) = 1 × 5 = 5 substrings
- For 'b' at index 1: last occurrence was at -1 (none before), contributes (1 - (-1)) × (5 - 1) = 2 × 4 = 8 substrings
- For 'b' at index 2: last occurrence was at 1, contributes (2 - 1) × (5 - 2) = 1 × 3 = 3 substrings
- For 'c' at index 3: last occurrence was at -1, contributes (3 - (-1)) × (5 - 3) = 4 × 2 = 8 substrings
- For 'a' at index 4: last occurrence was at 0, contributes (4 - 0) × (5 - 4) = 4 × 1 = 4 substrings

Total: 5 + 8 + 3 + 8 + 4 = 28... Hmm, that's not 31.

**Step 4: The correct formula**
Actually, we need: For character at index i, it contributes to all substrings that start after the previous occurrence of the same character, and end at or after i.

So the formula is: `(i - last_occurrence[char]) × (n - i)`

Let's recalculate:

- 'a' at index 0: (0 - (-1)) × (5 - 0) = 1 × 5 = 5
- 'b' at index 1: (1 - (-1)) × (5 - 1) = 2 × 4 = 8
- 'b' at index 2: (2 - 1) × (5 - 2) = 1 × 3 = 3
- 'c' at index 3: (3 - (-1)) × (5 - 3) = 4 × 2 = 8
- 'a' at index 4: (4 - 0) × (5 - 4) = 4 × 1 = 4

Sum: 5 + 8 + 3 + 8 + 4 = 28... Still not 31.

**Step 5: Understanding the discrepancy**
The issue is that we're counting contributions per character, but each substring's appeal equals the number of distinct characters it contains. So if we sum contributions of all characters, we're counting each substring multiple times (once for each distinct character in it).

Wait, let me check the manual count again... Actually, I made an error in the manual count! Let me recount properly:

For `s = "abbca"` (length 5), total substrings = n(n+1)/2 = 15.

Actually listing them:

1. `"a"` (0-0): appeal 1
2. `"ab"` (0-1): appeal 2
3. `"abb"` (0-2): appeal 2
4. `"abbc"` (0-3): appeal 3
5. `"abbca"` (0-4): appeal 3
6. `"b"` (1-1): appeal 1
7. `"bb"` (1-2): appeal 1
8. `"bbc"` (1-3): appeal 2
9. `"bbca"` (1-4): appeal 3
10. `"b"` (2-2): appeal 1
11. `"bc"` (2-3): appeal 2
12. `"bca"` (2-4): appeal 3
13. `"c"` (3-3): appeal 1
14. `"ca"` (3-4): appeal 2
15. `"a"` (4-4): appeal 1

Sum = 1+2+2+3+3+1+1+2+3+1+2+3+1+2+1 = 28

So 28 is correct! My initial manual count of 31 was wrong. The formula works!

## Brute Force Approach

The most straightforward approach is to generate all substrings and compute the appeal for each one:

1. Generate all O(n²) substrings
2. For each substring, count distinct characters (O(n) time per substring)
3. Sum all appeals

This gives us O(n³) time complexity, which is far too slow for n up to 10⁵ (typical LeetCode constraints).

Even if we optimize the distinct character counting using a set, we still have O(n²) substrings and O(n) time per substring for building the set, resulting in O(n³) worst-case time.

<div class="code-group">

```python
# Time: O(n³) | Space: O(n) for the set
def appealSum_brute(s: str) -> int:
    n = len(s)
    total = 0

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            # Create a set of characters in substring s[i:j+1]
            distinct_chars = set(s[i:j+1])
            total += len(distinct_chars)

    return total
```

```javascript
// Time: O(n³) | Space: O(n) for the set
function appealSumBrute(s) {
  const n = s.length;
  let total = 0;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Create a set of characters in substring s[i:j+1]
      const distinctChars = new Set();
      for (let k = i; k <= j; k++) {
        distinctChars.add(s[k]);
      }
      total += distinctChars.size;
    }
  }

  return total;
}
```

```java
// Time: O(n³) | Space: O(n) for the set
public long appealSumBrute(String s) {
    int n = s.length();
    long total = 0;

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Create a set of characters in substring s[i:j+1]
            Set<Character> distinctChars = new HashSet<>();
            for (int k = i; k <= j; k++) {
                distinctChars.add(s.charAt(k));
            }
            total += distinctChars.size();
        }
    }

    return total;
}
```

</div>

## Optimized Approach

The key insight is to think in terms of **contribution per character** rather than per substring. For each character at position `i`, we want to count how many substrings have this character as their **first occurrence** of that character type within the substring.

Why "first occurrence"? Because if a substring contains multiple occurrences of the same character, only the first one contributes to the appeal (since appeal counts distinct characters).

For a character at index `i`:

- Let `lastPos[c]` be the last position where character `c` appeared before index `i` (or -1 if never seen before)
- The character at `i` will be the first occurrence of `c` in any substring that:
  1. Starts after `lastPos[c]` (so no earlier `c` is included)
  2. Starts at or before `i` (so it includes position `i`)
  3. Ends at or after `i` (so it includes position `i`)

The number of such substrings is: `(i - lastPos[c]) × (n - i)`

Let's break this down:

- `(i - lastPos[c])`: Number of possible starting positions (from `lastPos[c] + 1` to `i`, inclusive)
- `(n - i)`: Number of possible ending positions (from `i` to `n-1`, inclusive)

By summing this contribution for all characters, we get the total appeal!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) since alphabet size is constant (26 for lowercase English)
def appealSum(s: str) -> int:
    n = len(s)
    total = 0

    # Track last occurrence position for each character
    # Initialize with -1 meaning "not seen before"
    last_pos = [-1] * 26

    # Iterate through each character in the string
    for i, char in enumerate(s):
        # Convert character to index (0-25 for 'a'-'z')
        char_idx = ord(char) - ord('a')

        # Calculate contribution of this character
        # (i - last_pos[char_idx]) = number of substrings starting positions
        # (n - i) = number of substrings ending positions
        contribution = (i - last_pos[char_idx]) * (n - i)
        total += contribution

        # Update last occurrence position for this character
        last_pos[char_idx] = i

    return total
```

```javascript
// Time: O(n) | Space: O(1) since alphabet size is constant (26 for lowercase English)
function appealSum(s) {
  const n = s.length;
  let total = 0;

  // Track last occurrence position for each character
  // Initialize with -1 meaning "not seen before"
  const lastPos = new Array(26).fill(-1);

  // Iterate through each character in the string
  for (let i = 0; i < n; i++) {
    const char = s[i];
    // Convert character to index (0-25 for 'a'-'z')
    const charIdx = char.charCodeAt(0) - "a".charCodeAt(0);

    // Calculate contribution of this character
    // (i - lastPos[charIdx]) = number of substrings starting positions
    // (n - i) = number of substrings ending positions
    const contribution = (i - lastPos[charIdx]) * (n - i);
    total += contribution;

    // Update last occurrence position for this character
    lastPos[charIdx] = i;
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(1) since alphabet size is constant (26 for lowercase English)
public long appealSum(String s) {
    int n = s.length();
    long total = 0;

    // Track last occurrence position for each character
    // Initialize with -1 meaning "not seen before"
    int[] lastPos = new int[26];
    Arrays.fill(lastPos, -1);

    // Iterate through each character in the string
    for (int i = 0; i < n; i++) {
        char c = s.charAt(i);
        // Convert character to index (0-25 for 'a'-'z')
        int charIdx = c - 'a';

        // Calculate contribution of this character
        // (i - lastPos[charIdx]) = number of substrings starting positions
        // (n - i) = number of substrings ending positions
        long contribution = (long)(i - lastPos[charIdx]) * (n - i);
        total += contribution;

        // Update last occurrence position for this character
        lastPos[charIdx] = i;
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing constant-time operations for each character
- The operations include: character index calculation, arithmetic operations, and array updates

**Space Complexity: O(1)**

- We use a fixed-size array of 26 elements (for lowercase English letters)
- Even if we extend to all ASCII characters (128 or 256), it's still constant space
- The space doesn't grow with input size n

## Common Mistakes

1. **Using the wrong data type for the total**: The result can be large (up to ~n³/6 for strings with all distinct characters), so using `int` might cause overflow. Always use `long` in Java or ensure your language handles large integers.

2. **Forgetting to initialize last occurrence positions to -1**: If we initialize to 0, the calculation `(i - lastPos[charIdx])` will be wrong for the first occurrence of each character.

3. **Miscounting the number of starting positions**: The correct formula is `(i - lastPos[c])`, not `(i - lastPos[c] + 1)`. Why? Because valid starting positions are from `lastPos[c] + 1` to `i`, which gives `i - (lastPos[c] + 1) + 1 = i - lastPos[c]`.

4. **Confusing character contributions with substring appeals**: Remember that we're counting how many substrings have this character as their _first occurrence_ of that character type. Each substring's appeal equals the number of such "first occurrences" it contains.

## When You'll See This Pattern

This "contribution per element" pattern appears in several substring/counting problems:

1. **Count Unique Characters of All Substrings of a Given String (LeetCode 828)**: Very similar! Instead of counting distinct characters per substring, we count characters that appear exactly once. The solution uses a similar "last occurrence" tracking approach.

2. **Sum of Subsequence Widths (LeetCode 891)**: While not about substrings, it uses a similar "contribution per element" approach after sorting the array.

3. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums and hash maps to count subarrays efficiently, demonstrating the shift from O(n²) to O(n) thinking.

The core idea is to avoid enumerating all substrings/subarrays (O(n²)) by finding a way to compute each element's contribution to the final answer in O(1) time.

## Key Takeaways

1. **Think in terms of contributions, not enumeration**: When asked to compute a sum over all substrings/subarrays, consider how each element contributes to the total rather than examining each substring individually.

2. **Track "last occurrence" for distinctness problems**: When dealing with distinct characters or unique elements, maintaining the last position where each element appeared is often the key to efficient computation.

3. **The formula `(i - lastPos) × (n - i)` is powerful**: This counts how many substrings have the current element as the "first occurrence" of its type, which is useful for many distinctness-related problems.

Related problems: [Count Unique Characters of All Substrings of a Given String](/problem/count-unique-characters-of-all-substrings-of-a-given-string), [Count Vowel Substrings of a String](/problem/count-vowel-substrings-of-a-string), [Vowels of All Substrings](/problem/vowels-of-all-substrings)
