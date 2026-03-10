---
title: "How to Solve Remove Letter To Equalize Frequency — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove Letter To Equalize Frequency. Easy difficulty, 19.2% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-12-16"
category: "dsa-patterns"
tags: ["remove-letter-to-equalize-frequency", "hash-table", "string", "counting", "easy"]
---

# How to Solve Remove Letter To Equalize Frequency

This problem asks whether we can remove exactly one character from a string so that all remaining characters appear with equal frequency. What makes this problem interesting is that while it seems straightforward, there are many edge cases to consider, and the solution requires careful frequency analysis rather than just counting characters.

## Visual Walkthrough

Let's trace through an example step by step. Consider `word = "aabbcc"`.

**Step 1: Count initial frequencies**

- 'a': appears 2 times
- 'b': appears 2 times
- 'c': appears 2 times

All frequencies are already equal (2), so we could remove any character and check what happens.

**Step 2: Try removing one character**
If we remove 'a', we get `"abbcc"`:

- 'a': 1 time
- 'b': 2 times
- 'c': 2 times

Frequencies are {1, 2, 2} → not all equal.

If we remove 'b', we get `"aabcc"`:

- 'a': 2 times
- 'b': 1 time
- 'c': 2 times

Frequencies are {2, 1, 2} → not all equal.

But wait! The problem says we need _every letter present_ to have equal frequency. After removing one character, if all remaining frequencies are equal, we return true.

Actually, with `"aabbcc"`, all frequencies are already equal to 2. If we remove any character, we'll have one character with frequency 1 and others with frequency 2. That's not equal.

Let me reconsider: The question is whether we can remove ONE character to make ALL frequencies equal. For `"aabbcc"`, after removing one character, we can't make all frequencies equal because we'll always have one character with frequency 1 and others with frequency 2.

**Better example:** `word = "aabb"`

Initial frequencies: {'a': 2, 'b': 2} → already equal.

If we remove 'a': `"abb"` → {'a': 1, 'b': 2} → not equal.

If we remove 'b': `"aab"` → {'a': 2, 'b': 1} → not equal.

So `"aabb"` should return false.

**Another example:** `word = "abcc"`

Initial frequencies: {'a': 1, 'b': 1, 'c': 2}

Try removing 'c': `"abc"` → {'a': 1, 'b': 1, 'c': 1} → all frequencies are 1! This works.

The key insight: We need to check if removing one character can result in one of these scenarios:

1. All frequencies become the same number
2. All frequencies become 0 (empty string case, which is trivially true)

## Brute Force Approach

The brute force approach would be to try removing each character one by one, then count frequencies in the resulting string, and check if all frequencies are equal.

Steps:

1. For each index i from 0 to n-1 (where n = length of word)
2. Create a new string without character at index i
3. Count frequencies of all characters in the new string
4. Check if all frequencies are equal
5. If any removal works, return true

This approach has O(n²) time complexity because for each of n removals, we need to:

- Build a new string (O(n))
- Count frequencies (O(n))
- Check if all frequencies are equal (O(26) since only lowercase letters)

Total: O(n² \* 26) ≈ O(n²)

While this might work for small n, it's inefficient. The optimal solution should be O(n).

## Optimal Solution

The optimal approach uses frequency analysis. Instead of actually removing characters and recounting, we analyze the frequency distribution and check what would happen if we remove one occurrence of a character with a certain frequency.

Key observations:

1. We only have 26 possible characters (lowercase English letters)
2. After removal, all frequencies must be equal
3. There are only a few patterns that can work:
   - All frequencies are already equal (but we must check if removing one character keeps them equal)
   - One character has frequency 1 more than others, and removing it makes all equal
   - One character has frequency 1, and removing it makes all others equal
   - All characters have the same frequency except one character appears once (special case)

We can solve this by:

1. Counting frequencies of all characters
2. Grouping frequencies by count
3. Checking which of the valid patterns we have

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - we only store counts for 26 letters
def equalFrequency(word: str) -> bool:
    # Step 1: Count frequency of each character
    freq = [0] * 26
    for ch in word:
        freq[ord(ch) - ord('a')] += 1

    # Step 2: Try removing each character type and check if frequencies become equal
    for i in range(26):
        if freq[i] == 0:
            continue  # Character not present, skip

        # Step 3: Decrease frequency of current character by 1 (simulate removal)
        freq[i] -= 1

        # Step 4: Check if all non-zero frequencies are equal
        common_freq = None
        valid = True

        for count in freq:
            if count == 0:
                continue  # Skip characters not present

            if common_freq is None:
                common_freq = count  # Set first non-zero frequency as reference
            elif count != common_freq:
                valid = False  # Found a frequency that doesn't match
                break

        # If all non-zero frequencies are equal (or only one character type remains)
        if valid:
            return True

        # Step 5: Restore frequency for next iteration
        freq[i] += 1

    return False
```

```javascript
// Time: O(n) | Space: O(1) - we only store counts for 26 letters
function equalFrequency(word) {
  // Step 1: Count frequency of each character
  const freq = new Array(26).fill(0);
  for (let ch of word) {
    freq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 2: Try removing each character type and check if frequencies become equal
  for (let i = 0; i < 26; i++) {
    if (freq[i] === 0) {
      continue; // Character not present, skip
    }

    // Step 3: Decrease frequency of current character by 1 (simulate removal)
    freq[i]--;

    // Step 4: Check if all non-zero frequencies are equal
    let commonFreq = null;
    let valid = true;

    for (let count of freq) {
      if (count === 0) {
        continue; // Skip characters not present
      }

      if (commonFreq === null) {
        commonFreq = count; // Set first non-zero frequency as reference
      } else if (count !== commonFreq) {
        valid = false; // Found a frequency that doesn't match
        break;
      }
    }

    // If all non-zero frequencies are equal (or only one character type remains)
    if (valid) {
      return true;
    }

    // Step 5: Restore frequency for next iteration
    freq[i]++;
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(1) - we only store counts for 26 letters
class Solution {
    public boolean equalFrequency(String word) {
        // Step 1: Count frequency of each character
        int[] freq = new int[26];
        for (char ch : word.toCharArray()) {
            freq[ch - 'a']++;
        }

        // Step 2: Try removing each character type and check if frequencies become equal
        for (int i = 0; i < 26; i++) {
            if (freq[i] == 0) {
                continue;  // Character not present, skip
            }

            // Step 3: Decrease frequency of current character by 1 (simulate removal)
            freq[i]--;

            // Step 4: Check if all non-zero frequencies are equal
            Integer commonFreq = null;
            boolean valid = true;

            for (int count : freq) {
                if (count == 0) {
                    continue;  // Skip characters not present
                }

                if (commonFreq == null) {
                    commonFreq = count;  // Set first non-zero frequency as reference
                } else if (count != commonFreq) {
                    valid = false;  // Found a frequency that doesn't match
                    break;
                }
            }

            // If all non-zero frequencies are equal (or only one character type remains)
            if (valid) {
                return true;
            }

            // Step 5: Restore frequency for next iteration
            freq[i]++;
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies: O(n) where n is the length of the string
- Outer loop: O(26) constant time (iterating through all possible characters)
- Inner loop: O(26) constant time (checking all frequencies)
- Total: O(n + 26\*26) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers to store frequencies
- No additional data structures that grow with input size

## Common Mistakes

1. **Not considering the case where all frequencies are already equal but removing a character breaks equality**
   - Example: `"aabb"` has equal frequencies (2 each), but removing any character gives frequencies {1, 2}
   - Solution: Our algorithm correctly tests each possible removal

2. **Forgetting to handle the single character case**
   - Example: `"a"` should return true (removing it gives empty string, all frequencies are equal)
   - Our solution handles this because when we remove the only character, all frequencies become 0, which is valid

3. **Incorrectly assuming only one pattern works**
   - Some candidates look for only one specific pattern (like one character having count 1)
   - Actually, multiple patterns can work: one character with count+1, one character with count 1, etc.
   - Our brute-force simulation approach catches all valid patterns

4. **Off-by-one errors when simulating removal**
   - When decreasing a frequency, make sure it doesn't go negative
   - Our check `if (freq[i] == 0) continue` ensures we only try removing characters that exist

## When You'll See This Pattern

This frequency counting and pattern matching technique appears in many string and counting problems:

1. **Maximum Equal Frequency (Hard)** - Similar concept but more complex: find the longest prefix where removing one character makes frequencies equal
2. **Minimum Deletions to Make Character Frequencies Unique (Medium)** - Instead of checking if one removal works, find the minimum removals needed to make all frequencies unique
3. **First Unique Character in a String (Easy)** - Uses frequency counting to find characters with count 1
4. **Sort Characters By Frequency (Medium)** - Groups characters by frequency and sorts them

The core pattern is: when dealing with character frequency problems, first count frequencies, then analyze the distribution for patterns or constraints.

## Key Takeaways

1. **Frequency analysis is powerful** - Many string problems become easier when you transform them into frequency counting problems
2. **Simulate don't calculate** - Instead of trying to derive complex rules for when removal works, simulate the removal and check the result
3. **Look for invariants** - The problem constraints (26 lowercase letters) allow O(1) space solutions even though the string can be long

**Related problems:** [Maximum Equal Frequency](/problem/maximum-equal-frequency), [Minimum Deletions to Make Character Frequencies Unique](/problem/minimum-deletions-to-make-character-frequencies-unique)
