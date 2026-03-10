---
title: "How to Solve Minimum Deletions for At Most K Distinct Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Deletions for At Most K Distinct Characters. Easy difficulty, 73.0% acceptance rate. Topics: Hash Table, String, Greedy, Sorting, Counting."
date: "2028-11-02"
category: "dsa-patterns"
tags:
  ["minimum-deletions-for-at-most-k-distinct-characters", "hash-table", "string", "greedy", "easy"]
---

# How to Solve Minimum Deletions for At Most K Distinct Characters

You need to delete characters from a string so that the resulting string has at most `k` distinct characters, while minimizing the number of deletions. The challenge lies in deciding which characters to delete—you want to remove the fewest total characters, which means targeting characters that appear infrequently.

## Visual Walkthrough

Let's trace through an example: `s = "aaabbbccc"`, `k = 2`.

**Step 1: Count character frequencies**

- 'a': 3 occurrences
- 'b': 3 occurrences
- 'c': 3 occurrences

**Step 2: We need at most 2 distinct characters**
Currently we have 3 distinct characters. We need to remove one character type completely.

**Step 3: Which character type should we remove?**
We want to minimize deletions, so we should remove the character type with the fewest occurrences. But wait—all have 3 occurrences! In this case, removing any one type costs 3 deletions.

**Step 4: Calculate deletions**
If we remove 'c' (3 deletions), we're left with 'a' and 'b', giving us 2 distinct characters. Total deletions = 3.

Let's try another example: `s = "aabbcc"`, `k = 1`.

**Step 1: Count frequencies**

- 'a': 2
- 'b': 2
- 'c': 2

**Step 2: We need at most 1 distinct character**
We have 3 distinct characters, need to remove 2 types.

**Step 3: Remove least frequent characters**
All have equal frequency (2), so we remove any 2 types: 2 + 2 = 4 deletions.

**Step 4: Result**
We keep only one character type (say 'a'), with 2 occurrences remaining.

The pattern emerges: we should keep the `k` most frequent characters and delete all others.

## Brute Force Approach

A brute force approach would try all possible subsets of characters to keep, but that's exponential in complexity. A more reasonable but still inefficient approach would be:

1. Generate all possible strings by deleting characters (2^n possibilities where n is string length)
2. For each resulting string, check if it has ≤ k distinct characters
3. Track the minimum deletions needed

This is clearly impractical for any reasonable string length. Even for n=20, we'd have over 1 million possibilities.

The key insight is that we don't need to consider which specific characters to delete—we only care about which character _types_ to delete. And to minimize deletions, we should delete the character types with the smallest frequencies first.

## Optimal Solution

The optimal solution follows these steps:

1. Count the frequency of each character in the string
2. Sort the frequencies in descending order (so most frequent come first)
3. Keep the first `k` frequencies (if available)
4. Sum up all the remaining frequencies (these are the characters we need to delete)

<div class="code-group">

```python
# Time: O(n + m log m) where n = len(s), m = number of distinct characters (≤ 26)
# Space: O(m) for the frequency dictionary and list
def minimumDeletions(s: str, k: int) -> int:
    # Step 1: Count frequency of each character
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Step 2: Get all frequencies and sort in descending order
    # We want most frequent characters first so we can keep them
    frequencies = list(freq.values())
    frequencies.sort(reverse=True)

    # Step 3: Calculate deletions needed
    # We can keep at most k character types
    deletions = 0

    # Start from position k (0-indexed) - these are characters we need to delete
    for i in range(k, len(frequencies)):
        deletions += frequencies[i]

    return deletions
```

```javascript
// Time: O(n + m log m) where n = s.length, m = number of distinct characters (≤ 26)
// Space: O(m) for the frequency map and array
function minimumDeletions(s, k) {
  // Step 1: Count frequency of each character
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Step 2: Get all frequencies and sort in descending order
  // We want most frequent characters first so we can keep them
  const frequencies = Array.from(freq.values());
  frequencies.sort((a, b) => b - a); // Descending order

  // Step 3: Calculate deletions needed
  // We can keep at most k character types
  let deletions = 0;

  // Start from position k (0-indexed) - these are characters we need to delete
  for (let i = k; i < frequencies.length; i++) {
    deletions += frequencies[i];
  }

  return deletions;
}
```

```java
// Time: O(n + m log m) where n = s.length(), m = number of distinct characters (≤ 26)
// Space: O(m) for the frequency map and list
import java.util.*;

public class Solution {
    public int minimumDeletions(String s, int k) {
        // Step 1: Count frequency of each character
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : s.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }

        // Step 2: Get all frequencies and sort in descending order
        // We want most frequent characters first so we can keep them
        List<Integer> frequencies = new ArrayList<>(freq.values());
        frequencies.sort((a, b) -> b - a); // Descending order

        // Step 3: Calculate deletions needed
        // We can keep at most k character types
        int deletions = 0;

        // Start from position k (0-indexed) - these are characters we need to delete
        for (int i = k; i < frequencies.size(); i++) {
            deletions += frequencies.get(i);
        }

        return deletions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m log m)**

- `O(n)` to count character frequencies by iterating through the string once
- `O(m log m)` to sort the frequencies, where `m` is the number of distinct characters
- Since we're dealing with lowercase English letters only, `m ≤ 26`, so `O(m log m)` is effectively `O(26 log 26) = O(1)`
- Overall: `O(n)` for practical purposes

**Space Complexity: O(m)**

- We need a dictionary/map to store frequencies for up to 26 distinct characters
- We need a list/array to store and sort these frequencies
- Since `m ≤ 26`, this is effectively `O(1)` constant space

## Common Mistakes

1. **Not handling k ≥ number of distinct characters**: If k is greater than or equal to the number of distinct characters, we don't need to delete anything. Our solution handles this correctly because the loop `for i in range(k, len(frequencies))` won't execute if `k >= len(frequencies)`.

2. **Sorting in ascending instead of descending order**: If you sort frequencies in ascending order and try to keep the first k, you'd be keeping the least frequent characters, which would require deleting the most frequent ones—maximizing deletions instead of minimizing them.

3. **Confusing character count with distinct characters**: Some candidates try to delete individual characters until they have ≤ k characters total (not distinct characters). Remember: we're limiting the number of _different_ character types, not the total character count.

4. **Overcomplicating with two-pointer or sliding window**: This problem doesn't require maintaining the original order or finding a substring. We just need to count frequencies and decide which character types to remove. A sliding window approach would be unnecessarily complex here.

## When You'll See This Pattern

This "frequency counting + greedy selection" pattern appears in many problems:

1. **Top K Frequent Elements (LeetCode 347)**: Find the k most frequent elements in an array. Similar approach: count frequencies, sort or use a heap to get top k.

2. **Reorganize String (LeetCode 767)**: Rearrange characters so no two adjacent are the same. Uses frequency counting and greedy placement of most frequent characters.

3. **Least Number of Unique Integers after K Removals (LeetCode 1481)**: Remove k elements to minimize the number of unique integers. Very similar to this problem—remove the least frequent elements first.

The core pattern: when you need to optimize based on frequency counts, sort frequencies and apply greedy selection (keep most frequent or remove least frequent).

## Key Takeaways

1. **Frequency analysis is powerful**: Many string and array problems become simpler when you count element frequencies first. This transforms the problem from "which specific elements" to "which types of elements."

2. **Greedy works for frequency optimization**: When minimizing deletions/removals, always target the least frequent elements first. When maximizing kept elements, always prioritize the most frequent elements.

3. **Constraints matter**: The fact that we only have lowercase English letters (26 possible characters) makes the frequency sorting step O(1) in practice, even though it's O(m log m) theoretically.

[Practice this problem on CodeJeet](/problem/minimum-deletions-for-at-most-k-distinct-characters)
