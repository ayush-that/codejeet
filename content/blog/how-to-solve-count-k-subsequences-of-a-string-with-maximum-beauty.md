---
title: "How to Solve Count K-Subsequences of a String With Maximum Beauty — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count K-Subsequences of a String With Maximum Beauty. Hard difficulty, 30.2% acceptance rate. Topics: Hash Table, Math, String, Greedy, Sorting."
date: "2026-02-05"
category: "dsa-patterns"
tags:
  ["count-k-subsequences-of-a-string-with-maximum-beauty", "hash-table", "math", "string", "hard"]
---

# How to Solve Count K-Subsequences of a String With Maximum Beauty

This problem asks us to count the number of k-length subsequences of a string where all characters are unique, and we want only those subsequences with maximum possible "beauty." The beauty of a subsequence is the sum of frequencies of each character in the original string. What makes this problem tricky is that we need to combine combinatorial counting with frequency analysis while ensuring we only count subsequences that achieve the maximum possible beauty value.

## Visual Walkthrough

Let's walk through an example: `s = "bcca"`, `k = 2`.

**Step 1: Calculate frequencies**

- f('b') = 1
- f('c') = 2
- f('a') = 1

**Step 2: Sort frequencies in descending order**
Frequencies: [2, 1, 1] corresponding to characters: ['c', 'b', 'a']

**Step 3: Find which frequencies contribute to maximum beauty**
For k=2, we want the 2 highest frequencies: 2 and 1.
Maximum beauty = 2 + 1 = 3

**Step 4: Check if we have exactly k frequencies or need to choose**
We need exactly 2 characters. The highest frequency is 2 (for 'c'), and we have multiple characters with frequency 1. We must choose 1 character from the group with frequency 1.

**Step 5: Calculate number of ways**

- We must include 'c' (frequency 2) - only 1 way
- We need 1 more character from the group with frequency 1 (which has 2 characters: 'b' and 'a')
- Number of ways to choose 1 from 2 = C(2,1) = 2
- For each chosen character, we multiply by its frequency (all are 1 in this group)

Total subsequences = 1 × 2 × 1 = 2

**Step 6: Verify**
Valid subsequences with beauty 3: "bc" and "ca" (not "ba" since beauty would be 1+1=2)

## Brute Force Approach

A naive approach would be:

1. Generate all possible k-length subsequences with unique characters
2. Calculate beauty for each subsequence
3. Track the maximum beauty and count subsequences achieving it

However, this is extremely inefficient. For a string of length n, there are C(n,k) possible subsequences, which grows factorially. Even for moderate n and k, this becomes computationally impossible.

The brute force fails because:

- It doesn't leverage the fact that beauty depends only on character frequencies
- It generates many subsequences that can't possibly have maximum beauty
- It doesn't use the mathematical relationship between frequencies and maximum beauty

## Optimized Approach

The key insights are:

1. **Beauty depends only on frequencies**: The beauty of a subsequence is the sum of frequencies of its characters in the original string. Characters with higher frequencies contribute more to beauty.

2. **Greedy selection for maximum beauty**: To maximize beauty, we should choose the k characters with the highest frequencies. If there are ties at the boundary, we need to handle them carefully.

3. **Combinatorial counting**: Once we know which frequencies to use, we count:
   - Characters we must include (all with frequency > the cutoff)
   - Characters we can choose from (those with frequency = the cutoff)
   - Multiply choices by frequencies (since each occurrence in the original string gives a different position)

4. **Mathematical formulation**:
   - Sort frequencies in descending order
   - Let `freq[k-1]` be the k-th highest frequency (1-indexed)
   - All frequencies > `freq[k-1]` must be included
   - From frequencies = `freq[k-1]`, we choose enough to reach k total
   - Count = (product of frequencies of must-include chars) × C(m, r) × (cutoff_freq)^r
     where m = count of chars with frequency = cutoff, r = how many we need from this group

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m log m) where n = len(s), m = unique characters (≤26)
# Space: O(1) since we store at most 26 frequencies
class Solution:
    def countKSubsequencesWithMaxBeauty(self, s: str, k: int) -> int:
        MOD = 10**9 + 7

        # Step 1: Count frequencies of each character
        freq = [0] * 26
        for ch in s:
            freq[ord(ch) - ord('a')] += 1

        # Step 2: Filter out zero frequencies and sort in descending order
        freq = sorted([f for f in freq if f > 0], reverse=True)

        # If we don't have at least k unique characters, return 0
        # (can't form a k-subsequence with all unique characters)
        if len(freq) < k:
            return 0

        # Step 3: Find the cutoff frequency (k-th highest frequency)
        cutoff = freq[k-1]

        # Step 4: Count characters with frequency > cutoff (must include all)
        total_must_include = 0
        must_include_product = 1

        for f in freq:
            if f > cutoff:
                total_must_include += 1
                must_include_product = (must_include_product * f) % MOD

        # Step 5: Count characters with frequency == cutoff
        # We need to choose (k - total_must_include) from this group
        same_as_cutoff_count = freq.count(cutoff)
        need_from_cutoff = k - total_must_include

        # Step 6: Calculate combinations C(same_as_cutoff_count, need_from_cutoff)
        # Using multiplicative formula to avoid overflow
        def comb(n, r):
            if r > n:
                return 0
            if r > n - r:
                r = n - r
            res = 1
            for i in range(1, r + 1):
                res = res * (n - i + 1) // i
            return res % MOD

        combinations = comb(same_as_cutoff_count, need_from_cutoff)

        # Step 7: Calculate final result
        # For each must-include character: multiply by its frequency
        # For each chosen from cutoff group: multiply by cutoff frequency
        result = must_include_product
        result = (result * combinations) % MOD

        # Multiply by (cutoff)^need_from_cutoff for the chosen cutoff characters
        for _ in range(need_from_cutoff):
            result = (result * cutoff) % MOD

        return result
```

```javascript
// Time: O(n + m log m) where n = s.length, m = unique characters (≤26)
// Space: O(1) since we store at most 26 frequencies
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var countKSubsequencesWithMaxBeauty = function (s, k) {
  const MOD = 1e9 + 7;

  // Step 1: Count frequencies of each character
  const freq = new Array(26).fill(0);
  for (let ch of s) {
    freq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 2: Filter out zero frequencies and sort in descending order
  const nonZeroFreq = freq.filter((f) => f > 0).sort((a, b) => b - a);

  // If we don't have at least k unique characters, return 0
  if (nonZeroFreq.length < k) {
    return 0;
  }

  // Step 3: Find the cutoff frequency (k-th highest frequency)
  const cutoff = nonZeroFreq[k - 1];

  // Step 4: Count characters with frequency > cutoff (must include all)
  let totalMustInclude = 0;
  let mustIncludeProduct = 1;

  for (let f of nonZeroFreq) {
    if (f > cutoff) {
      totalMustInclude++;
      mustIncludeProduct = (mustIncludeProduct * f) % MOD;
    }
  }

  // Step 5: Count characters with frequency == cutoff
  const sameAsCutoffCount = nonZeroFreq.filter((f) => f === cutoff).length;
  const needFromCutoff = k - totalMustInclude;

  // Step 6: Calculate combinations C(sameAsCutoffCount, needFromCutoff)
  function comb(n, r) {
    if (r > n) return 0;
    if (r > n - r) r = n - r;

    let res = 1;
    for (let i = 1; i <= r; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return res % MOD;
  }

  const combinations = comb(sameAsCutoffCount, needFromCutoff);

  // Step 7: Calculate final result
  let result = mustIncludeProduct;
  result = (result * combinations) % MOD;

  // Multiply by (cutoff)^needFromCutoff for the chosen cutoff characters
  for (let i = 0; i < needFromCutoff; i++) {
    result = (result * cutoff) % MOD;
  }

  return result;
};
```

```java
// Time: O(n + m log m) where n = s.length(), m = unique characters (≤26)
// Space: O(1) since we store at most 26 frequencies
class Solution {
    private static final int MOD = 1_000_000_007;

    public int countKSubsequencesWithMaxBeauty(String s, int k) {
        // Step 1: Count frequencies of each character
        int[] freq = new int[26];
        for (char ch : s.toCharArray()) {
            freq[ch - 'a']++;
        }

        // Step 2: Filter out zero frequencies and sort in descending order
        List<Integer> nonZeroFreq = new ArrayList<>();
        for (int f : freq) {
            if (f > 0) {
                nonZeroFreq.add(f);
            }
        }
        nonZeroFreq.sort((a, b) -> b - a);

        // If we don't have at least k unique characters, return 0
        if (nonZeroFreq.size() < k) {
            return 0;
        }

        // Step 3: Find the cutoff frequency (k-th highest frequency)
        int cutoff = nonZeroFreq.get(k - 1);

        // Step 4: Count characters with frequency > cutoff (must include all)
        int totalMustInclude = 0;
        long mustIncludeProduct = 1;

        for (int f : nonZeroFreq) {
            if (f > cutoff) {
                totalMustInclude++;
                mustIncludeProduct = (mustIncludeProduct * f) % MOD;
            }
        }

        // Step 5: Count characters with frequency == cutoff
        int sameAsCutoffCount = 0;
        for (int f : nonZeroFreq) {
            if (f == cutoff) {
                sameAsCutoffCount++;
            }
        }
        int needFromCutoff = k - totalMustInclude;

        // Step 6: Calculate combinations C(sameAsCutoffCount, needFromCutoff)
        long combinations = comb(sameAsCutoffCount, needFromCutoff);

        // Step 7: Calculate final result
        long result = mustIncludeProduct;
        result = (result * combinations) % MOD;

        // Multiply by (cutoff)^needFromCutoff for the chosen cutoff characters
        for (int i = 0; i < needFromCutoff; i++) {
            result = (result * cutoff) % MOD;
        }

        return (int) result;
    }

    // Helper function to calculate combinations C(n, r)
    private long comb(int n, int r) {
        if (r > n) return 0;
        if (r > n - r) r = n - r;

        long res = 1;
        for (int i = 1; i <= r; i++) {
            res = res * (n - i + 1) / i;
        }
        return res % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m log m)**

- O(n) to count character frequencies by iterating through the string once
- O(m) to filter zero frequencies, where m ≤ 26 (number of unique characters)
- O(m log m) to sort the frequencies (m ≤ 26, so effectively constant)
- Overall: O(n) since m is bounded by 26

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers for frequencies
- The filtered list has at most 26 elements
- All other variables use constant space

## Common Mistakes

1. **Forgetting to check if k > number of unique characters**: If k exceeds the number of unique characters, we can't form any valid k-subsequence (all characters must be unique). Always check this early.

2. **Not handling modulo operations correctly**: The result can be huge, so we need to apply modulo after each multiplication. A common mistake is to compute everything first then apply modulo at the end, which can cause overflow.

3. **Incorrect combination counting**: When we have multiple characters with the cutoff frequency, we need to choose some of them. The number of ways is C(count, needed) × (cutoff_freq)^needed, not just C(count, needed).

4. **Confusing subsequences with substrings**: Remember that subsequences don't need to be contiguous. Each occurrence of a character in the original string contributes to different subsequences.

## When You'll See This Pattern

This problem combines several patterns:

1. **Frequency counting with greedy selection**: Similar to "Top K Frequent Elements" (LeetCode 347), where we select elements with highest frequencies.

2. **Combinatorial counting with constraints**: Like "Number of Music Playlists" (LeetCode 920) or "Distinct Subsequences II" (LeetCode 940), where we count valid sequences under constraints.

3. **Mathematical combination problems**: Problems like "Unique Paths" (LeetCode 62) or "Pascal's Triangle" (LeetCode 118) that involve combinatorial mathematics.

The core technique of sorting frequencies and handling boundary cases with combinatorial counting appears in optimization problems where we need to maximize some sum under selection constraints.

## Key Takeaways

1. **When maximizing a sum of frequencies, always choose the highest frequencies first**: This greedy approach works because frequencies are independent and additive.

2. **Handle ties at the boundary with combinatorial counting**: When the k-th highest frequency has multiple characters, count the ways to choose among them.

3. **Remember that each character occurrence matters**: For a character with frequency f, there are f different positions it could come from in the original string, multiplying the count by f.

Related problems: [Distinct Subsequences II](/problem/distinct-subsequences-ii)
