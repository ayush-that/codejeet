---
title: "How to Solve Minimum Deletions to Make Character Frequencies Unique — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Deletions to Make Character Frequencies Unique. Medium difficulty, 61.4% acceptance rate. Topics: Hash Table, String, Greedy, Sorting."
date: "2028-01-12"
category: "dsa-patterns"
tags:
  [
    "minimum-deletions-to-make-character-frequencies-unique",
    "hash-table",
    "string",
    "greedy",
    "medium",
  ]
---

# How to Solve Minimum Deletions to Make Character Frequencies Unique

This problem asks us to find the minimum number of character deletions needed so that all characters in a string have unique frequencies. The tricky part is that we can only delete characters (not rearrange them), and we need to minimize deletions while ensuring no two characters appear the same number of times.

## Visual Walkthrough

Let's trace through an example: `s = "aaabbbcc"`

**Step 1: Count frequencies**

- 'a': 3
- 'b': 3
- 'c': 2

We have a problem: both 'a' and 'b' have frequency 3.

**Step 2: Make frequencies unique**
We need to delete characters until all frequencies are unique. Let's process from highest to lowest frequency:

1. 'a' has frequency 3 (keep as is)
2. 'b' also has frequency 3 - conflict! We need to reduce 'b's frequency to 2 (delete 1 'b')
3. Now 'c' has frequency 2, but we already have frequency 2 from 'b' - conflict! Reduce 'c' to 1 (delete 1 'c')

**Step 3: Count deletions**

- Deleted 1 'b' (from 3 to 2)
- Deleted 1 'c' (from 2 to 1)
- Total deletions: 2

Final frequencies: 'a': 3, 'b': 2, 'c': 1 (all unique)

## Brute Force Approach

A naive approach would try all possible deletion combinations. For each character, we could try deleting 0, 1, 2, ... up to its current count characters, checking if the resulting frequencies are unique. This leads to exponential time complexity.

Another brute force idea: sort characters by frequency, then for each conflict, try reducing the frequency to every possible lower value that doesn't conflict. This is still inefficient because we might need to backtrack if reducing one frequency creates new conflicts elsewhere.

The key insight we need is that we should process frequencies in a greedy manner from highest to lowest, always reducing conflicts to the next available unique frequency.

## Optimized Approach

The optimal solution uses a greedy approach with these steps:

1. **Count frequencies**: Use a frequency array or hash map to count how many times each character appears.
2. **Track used frequencies**: Use a set to keep track of which frequencies are already taken.
3. **Process greedily**: For each frequency (starting from highest), if it's already in the used set, we need to reduce it. Keep subtracting 1 (deleting characters) until we reach a frequency that's not in the used set OR until we reach 0.
4. **Count deletions**: Each time we subtract 1 from a frequency, that's one deletion we need to make.

Why greedy works: When we have a conflict (duplicate frequency), we want to minimize deletions. The optimal reduction is to go down just enough to reach the next available unique frequency. Processing from highest to lowest ensures we don't create unnecessary conflicts for lower frequencies.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + k log k) where n = len(s), k = number of unique characters (max 26)
# Space: O(k) for frequency map and used set
def minDeletions(s: str) -> int:
    # Step 1: Count frequency of each character
    freq = [0] * 26
    for char in s:
        freq[ord(char) - ord('a')] += 1

    # Step 2: Sort frequencies in descending order
    # We'll process from highest to lowest frequency
    freq.sort(reverse=True)

    # Step 3: Track which frequencies are already used
    used_frequencies = set()
    deletions = 0

    # Step 4: Process each frequency
    for f in freq:
        # If frequency is 0, we can skip (no characters of this type)
        if f == 0:
            break

        # While this frequency is already used or not unique
        while f > 0 and f in used_frequencies:
            # We need to delete one character to reduce frequency
            f -= 1
            deletions += 1

        # Add the (possibly reduced) frequency to used set
        # If f == 0, we don't add it since no characters remain
        if f > 0:
            used_frequencies.add(f)

    return deletions
```

```javascript
// Time: O(n + k log k) where n = s.length, k = number of unique characters (max 26)
// Space: O(k) for frequency map and used set
function minDeletions(s) {
  // Step 1: Count frequency of each character
  const freq = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    const charCode = s.charCodeAt(i) - "a".charCodeAt(0);
    freq[charCode]++;
  }

  // Step 2: Sort frequencies in descending order
  // We'll process from highest to lowest frequency
  freq.sort((a, b) => b - a);

  // Step 3: Track which frequencies are already used
  const usedFrequencies = new Set();
  let deletions = 0;

  // Step 4: Process each frequency
  for (let f of freq) {
    // If frequency is 0, we can skip (no characters of this type)
    if (f === 0) break;

    // While this frequency is already used or not unique
    while (f > 0 && usedFrequencies.has(f)) {
      // We need to delete one character to reduce frequency
      f--;
      deletions++;
    }

    // Add the (possibly reduced) frequency to used set
    // If f === 0, we don't add it since no characters remain
    if (f > 0) {
      usedFrequencies.add(f);
    }
  }

  return deletions;
}
```

```java
// Time: O(n + k log k) where n = s.length(), k = number of unique characters (max 26)
// Space: O(k) for frequency array and used set
class Solution {
    public int minDeletions(String s) {
        // Step 1: Count frequency of each character
        int[] freq = new int[26];
        for (char c : s.toCharArray()) {
            freq[c - 'a']++;
        }

        // Step 2: Sort frequencies in descending order
        // We'll process from highest to lowest frequency
        Arrays.sort(freq);
        // Reverse the array to get descending order
        for (int i = 0; i < 13; i++) {
            int temp = freq[i];
            freq[i] = freq[25 - i];
            freq[25 - i] = temp;
        }

        // Step 3: Track which frequencies are already used
        Set<Integer> usedFrequencies = new HashSet<>();
        int deletions = 0;

        // Step 4: Process each frequency
        for (int f : freq) {
            // If frequency is 0, we can skip (no characters of this type)
            if (f == 0) break;

            // While this frequency is already used or not unique
            while (f > 0 && usedFrequencies.contains(f)) {
                // We need to delete one character to reduce frequency
                f--;
                deletions++;
            }

            // Add the (possibly reduced) frequency to used set
            // If f == 0, we don't add it since no characters remain
            if (f > 0) {
                usedFrequencies.add(f);
            }
        }

        return deletions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k log k)**

- Counting frequencies: O(n) where n is the length of the string
- Sorting frequencies: O(k log k) where k is the number of unique characters (at most 26 for lowercase English letters)
- Processing frequencies: O(k²) in worst case, but since k ≤ 26, this is effectively O(1)
- Overall: O(n + 26 log 26) = O(n) for practical purposes

**Space Complexity: O(k)**

- Frequency array: O(26) = O(1) for lowercase English letters
- Used frequencies set: O(k) in worst case where all frequencies are unique
- Overall: O(1) for fixed alphabet, O(k) in general

## Common Mistakes

1. **Not processing from highest to lowest frequency**: If you process randomly or from lowest to highest, you might create unnecessary conflicts. Example: frequencies [2, 2, 3]. If you process 2 first, you might reduce it to 1, then process the other 2 (now unique), then process 3 (unique). But if you had processed 3 first, then 2, then 2, you'd only need to reduce one 2 to 1.

2. **Forgetting that frequency can become 0**: When reducing a frequency, it might reach 0. In this case, we shouldn't add 0 to the used set (since no characters remain), and we should stop reducing.

3. **Using array instead of set for used frequencies**: An array of size n would work but wastes space. A set is more efficient since we only store actually used frequencies.

4. **Not breaking early when frequency is 0**: After sorting frequencies in descending order, once we hit 0, all remaining frequencies are also 0. We can break out of the loop early to save time.

## When You'll See This Pattern

This greedy frequency adjustment pattern appears in several problems:

1. **Task Scheduler (LeetCode 621)**: Similar concept of arranging tasks with cooldown periods, often involving frequency counting and greedy scheduling of most frequent tasks first.

2. **Reorganize String (LeetCode 767)**: Requires rearranging string so no two adjacent characters are the same, using frequency counting and greedy placement of most frequent characters.

3. **Maximum Number of Occurrences of a Substring (LeetCode 1297)**: Involves frequency counting with constraints, though the approach differs.

The core pattern is: **count frequencies → process from most to least frequent → adjust to meet constraints**. This pattern works when the optimal solution involves handling the most constrained/most frequent elements first.

## Key Takeaways

1. **Greedy with sorting by frequency**: When a problem involves making elements unique or distributing them evenly, sorting by frequency and processing from highest to lowest is often optimal.

2. **Trade deletions for uniqueness**: The while loop that reduces frequency until unique embodies a common pattern: make minimal adjustments to satisfy constraints.

3. **Fixed alphabet means constant space**: For problems limited to lowercase English letters (26 characters), space complexity is O(1) regardless of input size.

**Related problems**: [Minimum Deletions to Make Array Beautiful](/problem/minimum-deletions-to-make-array-beautiful), [Removing Minimum and Maximum From Array](/problem/removing-minimum-and-maximum-from-array), [Remove Letter To Equalize Frequency](/problem/remove-letter-to-equalize-frequency)
