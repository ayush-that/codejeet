---
title: "How to Solve Make Number of Distinct Characters Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Make Number of Distinct Characters Equal. Medium difficulty, 27.5% acceptance rate. Topics: Hash Table, String, Counting."
date: "2029-08-30"
category: "dsa-patterns"
tags: ["make-number-of-distinct-characters-equal", "hash-table", "string", "counting", "medium"]
---

# How to Solve "Make Number of Distinct Characters Equal"

This problem asks whether we can swap exactly one character between two strings to make their number of distinct characters equal. What makes this tricky is that we need to consider how swapping affects both strings simultaneously—not just the count of distinct characters, but which characters become added or removed from each string's character set.

## Visual Walkthrough

Let's trace through an example: `word1 = "ab"`, `word2 = "cc"`.

**Initial state:**

- `word1`: characters `{'a', 'b'}` → 2 distinct characters
- `word2`: characters `{'c'}` → 1 distinct character
- Goal: Make both have equal distinct counts (2 and 2, or 1 and 1, etc.)

**Consider swapping `word1[0] = 'a'` with `word2[0] = 'c'`:**

- New `word1`: `"cb"` → characters `{'c', 'b'}` → 2 distinct
- New `word2`: `"ac"` → characters `{'a', 'c'}` → 2 distinct
- Success! Both now have 2 distinct characters.

The key insight: swapping characters between strings can:

1. **Add** a new character to a string (if that character wasn't already present)
2. **Remove** a character from a string (if that character's last occurrence is swapped out)
3. **Keep** counts unchanged (if characters are identical or already present)

## Brute Force Approach

A naive solution would try every possible swap `(i, j)` where `i` is an index in `word1` and `j` is an index in `word2`:

1. For each pair `(i, j)`, swap the characters
2. Count distinct characters in both strings
3. Check if counts are equal
4. If any swap works, return `true`

**Why this fails:**

- Time complexity: O(m × n × (m + n)) where m and n are string lengths
- For strings of length 1000, that's ~1 billion operations
- We need to think in terms of character frequencies, not individual positions

## Optimized Approach

The key insight: **We only care about character frequencies, not positions.**

Let's think about what happens when we swap character `x` from `word1` with character `y` from `word2`:

**For `word1`:**

- If `x ≠ y` and `x` appears only once in `word1`, swapping removes `x` from `word1`
- If `y` is not already in `word1`, swapping adds `y` to `word1`

**For `word2`:**

- If `y ≠ x` and `y` appears only once in `word2`, swapping removes `y` from `word2`
- If `x` is not already in `word2`, swapping adds `x` to `word2`

We can precompute:

1. Frequency maps for both strings
2. Sets of distinct characters for both strings

Then, for each possible character pair `(c1, c2)` where `c1` is from `word1` and `c2` from `word2` (or they could be the same), we simulate the swap's effect on distinct counts.

**Special cases:**

- Swapping identical characters (`c1 == c2`) doesn't change anything
- We need to consider all 26 possible letters, not just those present in the strings

## Optimal Solution

The algorithm:

1. Build frequency maps and distinct character sets for both strings
2. For each possible character `a` (from 'a' to 'z') that could come from `word1`
3. For each possible character `b` (from 'a' to 'z') that could go to `word1`
4. Check if this swap is possible (both characters exist in their respective strings)
5. Calculate new distinct counts after the swap
6. If counts become equal for any swap, return `true`

<div class="code-group">

```python
# Time: O(26*26) = O(1) | Space: O(1) for fixed alphabet size
def isItPossible(word1: str, word2: str) -> bool:
    # Step 1: Build frequency maps for both strings
    freq1 = [0] * 26
    freq2 = [0] * 26

    for ch in word1:
        freq1[ord(ch) - ord('a')] += 1
    for ch in word2:
        freq2[ord(ch) - ord('a')] += 1

    # Step 2: Count distinct characters in each string
    distinct1 = sum(1 for count in freq1 if count > 0)
    distinct2 = sum(1 for count in freq2 if count > 0)

    # Step 3: Try all possible character swaps
    for i in range(26):
        for j in range(26):
            # Skip if either character doesn't exist in its string
            if freq1[i] == 0 or freq2[j] == 0:
                continue

            # If swapping the same character
            if i == j:
                # Distinct counts remain the same
                if distinct1 == distinct2:
                    return True
                continue

            # Calculate new distinct counts after swap
            new_distinct1 = distinct1
            new_distinct2 = distinct2

            # For word1: removing character i, adding character j
            if freq1[i] == 1:  # i will be completely removed from word1
                new_distinct1 -= 1
            if freq1[j] == 0:  # j is new to word1
                new_distinct1 += 1

            # For word2: removing character j, adding character i
            if freq2[j] == 1:  # j will be completely removed from word2
                new_distinct2 -= 1
            if freq2[i] == 0:  # i is new to word2
                new_distinct2 += 1

            # Check if swap makes counts equal
            if new_distinct1 == new_distinct2:
                return True

    return False
```

```javascript
// Time: O(26*26) = O(1) | Space: O(1) for fixed alphabet size
function isItPossible(word1, word2) {
  // Step 1: Build frequency arrays for both strings
  const freq1 = new Array(26).fill(0);
  const freq2 = new Array(26).fill(0);

  for (const ch of word1) {
    freq1[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }
  for (const ch of word2) {
    freq2[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 2: Count distinct characters in each string
  let distinct1 = 0,
    distinct2 = 0;
  for (let i = 0; i < 26; i++) {
    if (freq1[i] > 0) distinct1++;
    if (freq2[i] > 0) distinct2++;
  }

  // Step 3: Try all possible character swaps
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      // Skip if either character doesn't exist in its string
      if (freq1[i] === 0 || freq2[j] === 0) continue;

      // If swapping the same character
      if (i === j) {
        // Distinct counts remain the same
        if (distinct1 === distinct2) return true;
        continue;
      }

      // Calculate new distinct counts after swap
      let newDistinct1 = distinct1;
      let newDistinct2 = distinct2;

      // For word1: removing character i, adding character j
      if (freq1[i] === 1) newDistinct1--; // i completely removed
      if (freq1[j] === 0) newDistinct1++; // j is new to word1

      // For word2: removing character j, adding character i
      if (freq2[j] === 1) newDistinct2--; // j completely removed
      if (freq2[i] === 0) newDistinct2++; // i is new to word2

      // Check if swap makes counts equal
      if (newDistinct1 === newDistinct2) return true;
    }
  }

  return false;
}
```

```java
// Time: O(26*26) = O(1) | Space: O(1) for fixed alphabet size
class Solution {
    public boolean isItPossible(String word1, String word2) {
        // Step 1: Build frequency arrays for both strings
        int[] freq1 = new int[26];
        int[] freq2 = new int[26];

        for (char ch : word1.toCharArray()) {
            freq1[ch - 'a']++;
        }
        for (char ch : word2.toCharArray()) {
            freq2[ch - 'a']++;
        }

        // Step 2: Count distinct characters in each string
        int distinct1 = 0, distinct2 = 0;
        for (int i = 0; i < 26; i++) {
            if (freq1[i] > 0) distinct1++;
            if (freq2[i] > 0) distinct2++;
        }

        // Step 3: Try all possible character swaps
        for (int i = 0; i < 26; i++) {
            for (int j = 0; j < 26; j++) {
                // Skip if either character doesn't exist in its string
                if (freq1[i] == 0 || freq2[j] == 0) continue;

                // If swapping the same character
                if (i == j) {
                    // Distinct counts remain the same
                    if (distinct1 == distinct2) return true;
                    continue;
                }

                // Calculate new distinct counts after swap
                int newDistinct1 = distinct1;
                int newDistinct2 = distinct2;

                // For word1: removing character i, adding character j
                if (freq1[i] == 1) newDistinct1--;  // i completely removed
                if (freq1[j] == 0) newDistinct1++;  // j is new to word1

                // For word2: removing character j, adding character i
                if (freq2[j] == 1) newDistinct2--;  // j completely removed
                if (freq2[i] == 0) newDistinct2++;  // i is new to word2

                // Check if swap makes counts equal
                if (newDistinct1 == newDistinct2) return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We iterate over 26 possible characters from `word1` and 26 from `word2`
- That's 26 × 26 = 676 iterations, which is constant
- Building frequency maps takes O(m + n) where m, n are string lengths, but this is dominated by the constant factor

**Space Complexity: O(1)**

- We use two fixed-size arrays of length 26 for frequency counts
- A few integer variables for counting distinct characters
- No additional space grows with input size

## Common Mistakes

1. **Forgetting to check if characters exist before swapping**: Attempting to swap a character that doesn't exist in a string is invalid. Always check `freq1[i] > 0 && freq2[j] > 0`.

2. **Incorrect distinct count updates**: The trickiest part is determining when a character is completely removed (frequency becomes 0) versus when a character is newly added (frequency goes from 0 to 1). Test with examples like `"aa"` swapping with `"bb"`.

3. **Missing the identical character swap case**: When `i == j`, the swap doesn't change character sets. Some candidates forget this case and incorrectly return `false` for strings that already have equal distinct counts.

4. **Overcomplicating with actual string manipulation**: Some candidates try to actually swap characters and recount distinct characters each time. This leads to O(m × n × (m + n)) complexity. Remember: we only need frequency information.

## When You'll See This Pattern

This problem combines **frequency counting** with **what-if analysis**, which appears in several other LeetCode problems:

1. **Bulls and Cows (LeetCode 299)**: Also uses frequency counting to track character occurrences, though for a different purpose (matching positions vs counting mismatches).

2. **Buddy Strings (LeetCode 859)**: Checks if swapping two characters can make strings equal—similar swap analysis but with position constraints.

3. **Minimum Swaps to Make Strings Equal (LeetCode 1247)**: Analyzes character swaps between strings to achieve equality, though with different constraints.

The core pattern: when a problem involves swaps or exchanges between collections, think in terms of frequency distributions rather than individual elements.

## Key Takeaways

1. **Think in frequencies, not positions**: When swaps can happen anywhere, the exact positions don't matter—only which characters are present and how many times.

2. **Consider all possibilities systematically**: With a small alphabet (26 letters), we can brute force all possible swaps in constant time. This is often optimal when the search space is limited.

3. **Track state changes carefully**: When simulating an operation (like a swap), carefully consider what conditions cause counts to increase or decrease. Draw small examples to verify your logic.

Related problems: [Bulls and Cows](/problem/bulls-and-cows), [Buddy Strings](/problem/buddy-strings), [Minimum Swaps to Make Strings Equal](/problem/minimum-swaps-to-make-strings-equal)
