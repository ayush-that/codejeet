---
title: "How to Solve Minimum Deletions to Make String K-Special — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Deletions to Make String K-Special. Medium difficulty, 67.2% acceptance rate. Topics: Hash Table, String, Greedy, Sorting, Counting."
date: "2027-04-09"
category: "dsa-patterns"
tags: ["minimum-deletions-to-make-string-k-special", "hash-table", "string", "greedy", "medium"]
---

# How to Solve Minimum Deletions to Make String K-Special

This problem asks us to make a string "k-special" by deleting characters, where k-special means that for any two characters in the string, the absolute difference between their frequencies is at most `k`. We need to find the **minimum number of deletions** required. What makes this problem interesting is that we're not just trying to make frequencies equal or unique—we're creating a frequency band where all frequencies must lie within a range of size `k`. This requires careful thinking about which frequencies to reduce and by how much.

## Visual Walkthrough

Let's trace through an example: `word = "aaabbbcc"`, `k = 1`

**Step 1: Count frequencies**

- 'a': 3
- 'b': 3
- 'c': 2

**Step 2: Sort frequencies descending**
[3, 3, 2]

**Step 3: Find the optimal frequency band**
We need all frequencies to be within `k = 1` of each other. Let's think about possible target frequencies:

If we target frequency 3 as our maximum:

- All frequencies must be between 3 and 2 (since 3 - 1 = 2)
- Our current frequencies: 3, 3, 2
- All are already in range [2, 3] ✓
- Deletions needed: 0

Wait, but what if we target a lower frequency? Let's check if we can save deletions by going lower:
If we target frequency 2 as maximum:

- All must be between 2 and 1
- 3 → 2 (delete 1 'a')
- 3 → 2 (delete 1 'b')
- 2 stays 2
- Total deletions: 2 (worse than 0)

So the optimal is keeping frequencies as they are: 0 deletions.

**Another example**: `word = "aabbccdd"`, `k = 0`

**Step 1: Count frequencies**

- 'a': 2, 'b': 2, 'c': 2, 'd': 2 → all 2

**Step 2: Sort**: [2, 2, 2, 2]

**Step 3: Find optimal**  
With k=0, all frequencies must be equal. They already are! Deletions: 0.

**Key insight**: We need to find a target frequency range [target, target+k] that minimizes deletions. For each possible maximum frequency in our sorted list, we can calculate how many deletions would be needed if we make that frequency (or lower) our upper bound.

## Brute Force Approach

A naive approach would be to try every possible target frequency from 1 up to the maximum frequency in the word. For each target, we'd check all frequencies and calculate deletions needed to bring them into the range [target, target+k].

**Why this is inefficient**:

- Maximum frequency could be up to n (length of word)
- For each of n possible targets, we check m frequencies (m ≤ 26 for lowercase letters)
- While O(26n) might seem okay, the real issue is conceptual: we're not leveraging the sorted structure properly. Also, if we consider all frequencies from 1 to n, that's O(n²) in worst case.

**What candidates might try and fail**:

1. Trying to make all frequencies equal to the minimum frequency plus k
2. Greedily reducing the highest frequency without considering the cascade effect on other frequencies
3. Not realizing we need to consider each frequency as a potential "anchor" for our range

## Optimized Approach

The key insight is that **after sorting frequencies descending, the optimal solution will use one of these frequencies (or a value slightly below it) as the maximum allowed frequency in our k-special string**.

**Reasoning step-by-step**:

1. **Count frequencies**: First, we count how many times each character appears.
2. **Sort descending**: Sort frequencies from highest to lowest. This helps because we want to consider each frequency as a potential upper bound.
3. **For each frequency as potential max**: For frequency `freq[i]` at position i in the sorted list:
   - Let `max_allowed = freq[i]` (we could also consider values slightly lower, but freq[i] is a candidate)
   - Let `min_allowed = max_allowed - k`
   - For all frequencies before i (higher or equal): They must be reduced to at most `max_allowed`
   - For all frequencies after i (lower): They must be either:
     - Increased (impossible, we can only delete)
     - Or if they're already ≥ `min_allowed`, they're fine
     - Or if they're < `min_allowed`, they must be deleted entirely
4. **Calculate deletions for each candidate**: Sum up:
   - For j < i: deletions += `freq[j] - max_allowed`
   - For j > i: if `freq[j] < min_allowed`: deletions += `freq[j]`
5. **Take the minimum**: Track the smallest deletion count across all i.

**Why this works**: By trying each sorted frequency as a potential maximum, we're essentially testing all reasonable upper bounds for our frequency range. Any optimal solution will have its maximum frequency equal to one of the original frequencies (or possibly 1 less, but we cover that by the next frequency in sorted order).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m log m) where n = len(word), m = number of unique chars (≤26)
# Space: O(m) for frequency count and sorted list
def minimumDeletions(word: str, k: int) -> int:
    # Step 1: Count frequency of each character
    freq = [0] * 26
    for ch in word:
        freq[ord(ch) - ord('a')] += 1

    # Step 2: Filter out zero frequencies and sort descending
    # We only care about characters that actually appear
    freq = [f for f in freq if f > 0]
    freq.sort(reverse=True)

    # Step 3: Initialize answer to worst case (delete all characters)
    min_deletions = len(word)

    # Step 4: Try each frequency as potential maximum allowed frequency
    for i in range(len(freq)):
        max_allowed = freq[i]
        min_allowed = max_allowed - k

        deletions = 0

        # Step 5: Calculate deletions needed
        for j in range(len(freq)):
            if j < i:
                # For frequencies before current (higher or equal):
                # Reduce to at most max_allowed
                deletions += max(0, freq[j] - max_allowed)
            else:
                # For current and frequencies after (lower):
                # If below min_allowed, delete entirely
                # Note: We don't need to delete if freq[j] >= min_allowed
                if freq[j] < min_allowed:
                    deletions += freq[j]

        # Step 6: Update minimum deletions found
        min_deletions = min(min_deletions, deletions)

    return min_deletions
```

```javascript
// Time: O(n + m log m) where n = word.length, m = number of unique chars (≤26)
// Space: O(m) for frequency count and sorted array
function minimumDeletions(word, k) {
  // Step 1: Count frequency of each character
  const freq = new Array(26).fill(0);
  for (let ch of word) {
    freq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 2: Filter out zero frequencies and sort descending
  const nonZeroFreq = freq.filter((f) => f > 0);
  nonZeroFreq.sort((a, b) => b - a);

  // Step 3: Initialize answer to worst case (delete all characters)
  let minDeletions = word.length;

  // Step 4: Try each frequency as potential maximum allowed frequency
  for (let i = 0; i < nonZeroFreq.length; i++) {
    const maxAllowed = nonZeroFreq[i];
    const minAllowed = maxAllowed - k;

    let deletions = 0;

    // Step 5: Calculate deletions needed
    for (let j = 0; j < nonZeroFreq.length; j++) {
      if (j < i) {
        // For frequencies before current (higher or equal):
        // Reduce to at most maxAllowed
        deletions += Math.max(0, nonZeroFreq[j] - maxAllowed);
      } else {
        // For current and frequencies after (lower):
        // If below minAllowed, delete entirely
        if (nonZeroFreq[j] < minAllowed) {
          deletions += nonZeroFreq[j];
        }
      }
    }

    // Step 6: Update minimum deletions found
    minDeletions = Math.min(minDeletions, deletions);
  }

  return minDeletions;
}
```

```java
// Time: O(n + m log m) where n = word.length(), m = number of unique chars (≤26)
// Space: O(m) for frequency count and sorted list
class Solution {
    public int minimumDeletions(String word, int k) {
        // Step 1: Count frequency of each character
        int[] freq = new int[26];
        for (char ch : word.toCharArray()) {
            freq[ch - 'a']++;
        }

        // Step 2: Filter out zero frequencies and sort descending
        List<Integer> nonZeroFreq = new ArrayList<>();
        for (int f : freq) {
            if (f > 0) {
                nonZeroFreq.add(f);
            }
        }
        nonZeroFreq.sort((a, b) -> b - a);

        // Step 3: Initialize answer to worst case (delete all characters)
        int minDeletions = word.length();

        // Step 4: Try each frequency as potential maximum allowed frequency
        for (int i = 0; i < nonZeroFreq.size(); i++) {
            int maxAllowed = nonZeroFreq.get(i);
            int minAllowed = maxAllowed - k;

            int deletions = 0;

            // Step 5: Calculate deletions needed
            for (int j = 0; j < nonZeroFreq.size(); j++) {
                if (j < i) {
                    // For frequencies before current (higher or equal):
                    // Reduce to at most maxAllowed
                    deletions += Math.max(0, nonZeroFreq.get(j) - maxAllowed);
                } else {
                    // For current and frequencies after (lower):
                    // If below minAllowed, delete entirely
                    if (nonZeroFreq.get(j) < minAllowed) {
                        deletions += nonZeroFreq.get(j);
                    }
                }
            }

            // Step 6: Update minimum deletions found
            minDeletions = Math.min(minDeletions, deletions);
        }

        return minDeletions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n + m log m)

- Counting frequencies: O(n) where n is length of word
- Sorting frequencies: O(m log m) where m is number of unique characters (≤ 26 for lowercase letters)
- Nested loops: O(m²) but since m ≤ 26, this is effectively O(1)
- Overall: O(n + 26 log 26) = O(n)

**Space Complexity**: O(m)

- Frequency array: O(26) = O(1) fixed size
- Sorted list of non-zero frequencies: O(m) where m ≤ 26
- Overall: O(1) since bounded by constant 26

The key observation is that while the algorithm appears to have O(m²) complexity due to nested loops, m is bounded by 26 (for lowercase English letters), so it's effectively constant time. The dominant factor is O(n) for counting frequencies.

## Common Mistakes

1. **Forgetting that k can be 0**: When k=0, all frequencies must be equal. Some implementations might incorrectly allow frequencies to differ by 0, thinking it means "don't care about differences."

2. **Not considering that min_allowed can be negative**: If max_allowed < k, then min_allowed = max_allowed - k could be negative. We should handle this correctly—negative min_allowed means we accept any frequency (since frequencies are non-negative). In our code, `freq[j] < min_allowed` when min_allowed is negative will never be true for non-negative freq[j], which is correct.

3. **Trying to increase frequencies instead of only decreasing**: We can only delete characters, not add them. Some candidates mistakenly try to bring low frequencies up to min_allowed, which is impossible.

4. **Not initializing min_deletions properly**: It should be initialized to the worst case (deleting all characters, which is len(word)), not 0 or some arbitrary value.

5. **Overlooking that we need to check frequencies both above AND below the range**: The condition requires ALL frequencies to be within [min_allowed, max_allowed]. We need to handle frequencies that are too high (reduce them) AND frequencies that are too low (delete them entirely).

## When You'll See This Pattern

This problem uses a **frequency counting + sorting + range constraint optimization** pattern that appears in several other problems:

1. **Minimum Deletions to Make Character Frequencies Unique (LeetCode 1647)**: Very similar—instead of a range constraint, you need all frequencies to be unique. Both involve sorting frequencies and calculating minimum deletions.

2. **Minimum Operations to Make Array Equal (LeetCode 1551)**: While about arrays rather than strings, it involves making all elements equal with minimal operations, which is conceptually similar to our k=0 case.

3. **Reduce Array Size to The Half (LeetCode 1338)**: Involves frequency counting and greedy selection based on sorted frequencies to minimize deletions.

The core pattern is: when you need to transform a multiset (frequencies) to satisfy some constraint with minimal operations, sort the frequencies and consider each as a potential "anchor" or "target" for your solution.

## Key Takeaways

1. **Frequency problems often benefit from sorting**: When you need to compare or constrain frequencies, sorting them (usually descending) reveals structure that simplifies the problem.

2. **Consider each element as a potential "anchor"**: In range constraint problems, trying each sorted element as a potential boundary (min or max) of your valid range is a powerful technique.

3. **Lowercase English letters mean constant factor**: With only 26 possible characters, algorithms that appear O(n²) can actually be O(n) since one dimension is bounded by 26.

4. **Read constraints carefully**: The ability to only delete (not add) characters changes the problem significantly from one where you could both increase and decrease frequencies.

Related problems: [Minimum Deletions to Make Character Frequencies Unique](/problem/minimum-deletions-to-make-character-frequencies-unique)
