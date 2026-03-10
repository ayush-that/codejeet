---
title: "How to Solve Apply Operations to Make String Empty — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Apply Operations to Make String Empty. Medium difficulty, 57.4% acceptance rate. Topics: Array, Hash Table, Sorting, Counting."
date: "2029-03-24"
category: "dsa-patterns"
tags: ["apply-operations-to-make-string-empty", "array", "hash-table", "sorting", "medium"]
---

# How to Solve "Apply Operations to Make String Empty"

This problem asks us to simulate repeatedly removing the first occurrence of each letter from 'a' to 'z' until the string becomes empty. The tricky part is that we need to determine the order in which characters are removed during this process, not just whether the string can be emptied. The challenge lies in efficiently tracking when each character gets removed without actually performing the expensive string operations.

## Visual Walkthrough

Let's trace through the example `s = "aabcbbca"`:

**Initial string:** `a a b c b b c a`

**Round 1 (removing first occurrences of 'a' to 'z'):**

- 'a': remove first 'a' → `a b c b b c a`
- 'b': remove first 'b' → `a c b b c a`
- 'c': remove first 'c' → `a b b c a`
- 'd'-'z': no changes

**Round 2:**

- 'a': remove first 'a' → `b b c a`
- 'b': remove first 'b' → `b c a`
- 'c': remove first 'c' → `b a`
- 'd'-'z': no changes

**Round 3:**

- 'a': remove first 'a' → `b`
- 'b': remove first 'b' → ``
- String is now empty

The removal order was: `a, b, c, a, b, c, a, b`

Notice a pattern: characters that appear more frequently get removed later. The last character removed will be the one with the highest frequency. In fact, each character gets removed once per round until all its occurrences are gone.

## Brute Force Approach

A naive approach would literally simulate the process:

1. Create a list of characters from the string
2. Repeatedly iterate from 'a' to 'z'
3. For each letter, find and remove its first occurrence in the list
4. Record the removed character
5. Continue until the list is empty

This approach has several problems:

- Finding and removing from a list is O(n) each time
- We might need up to 26 × n operations
- The total time complexity would be O(26 × n²) = O(n²), which is too slow for n up to 10⁵
- The space complexity is O(n) for the list

While this brute force helps understand the problem, it's not efficient enough for the constraints.

## Optimized Approach

The key insight is that we don't need to simulate the removal process. Instead, we can determine the removal order by analyzing character frequencies:

1. **Count frequencies**: First, count how many times each character appears in the string.
2. **Determine rounds**: The number of rounds needed equals the maximum frequency of any character. A character with frequency f will be removed in rounds 1 through f.
3. **Track removal order**: In each round, characters are removed in alphabetical order ('a' to 'z'). So for round r, we include all characters whose frequency ≥ r, in alphabetical order.
4. **Build result**: We can build the result by iterating through rounds from 1 to max frequency, and for each round, adding characters (in alphabetical order) that have at least that many remaining occurrences.

Think of it like this: if 'a' appears 3 times and 'b' appears 2 times:

- Round 1: both 'a' and 'b' have ≥ 1 occurrence → remove 'a' then 'b'
- Round 2: both 'a' and 'b' have ≥ 2 occurrences → remove 'a' then 'b'
- Round 3: only 'a' has ≥ 3 occurrences → remove 'a'

The removal order is: `a, b, a, b, a`

## Optimal Solution

The efficient solution counts character frequencies, finds the maximum frequency, then builds the result by iterating through rounds and characters. We use a frequency array of size 26 (one for each lowercase letter).

<div class="code-group">

```python
# Time: O(n + 26 * maxFreq) ≈ O(n) since maxFreq ≤ n and 26 is constant
# Space: O(26) = O(1) for frequency array, O(n) for result
def lastNonEmptyString(s: str) -> str:
    # Step 1: Count frequency of each character
    # We use an array of size 26 for 'a' to 'z'
    freq = [0] * 26

    for char in s:
        # Convert character to index (0 for 'a', 25 for 'z')
        idx = ord(char) - ord('a')
        freq[idx] += 1

    # Step 2: Find the maximum frequency
    max_freq = max(freq)

    # Step 3: Build the result string
    result = []

    # We need to process characters in reverse order of appearance
    # to get the correct last occurrences
    # Traverse the string from end to beginning
    for char in reversed(s):
        idx = ord(char) - ord('a')

        # If this character has the maximum frequency
        # and we haven't added all occurrences yet
        if freq[idx] == max_freq:
            result.append(char)
            # Decrease frequency to avoid adding duplicates
            freq[idx] -= 1

    # Reverse the result since we traversed backwards
    return ''.join(reversed(result))
```

```javascript
// Time: O(n + 26 * maxFreq) ≈ O(n) since maxFreq ≤ n and 26 is constant
// Space: O(26) = O(1) for frequency array, O(n) for result
function lastNonEmptyString(s) {
  // Step 1: Count frequency of each character
  // We use an array of size 26 for 'a' to 'z'
  const freq = new Array(26).fill(0);

  for (let i = 0; i < s.length; i++) {
    // Convert character to index (0 for 'a', 25 for 'z')
    const idx = s.charCodeAt(i) - "a".charCodeAt(0);
    freq[idx]++;
  }

  // Step 2: Find the maximum frequency
  const maxFreq = Math.max(...freq);

  // Step 3: Build the result string
  const result = [];

  // We need to process characters in reverse order of appearance
  // to get the correct last occurrences
  // Traverse the string from end to beginning
  for (let i = s.length - 1; i >= 0; i--) {
    const char = s[i];
    const idx = char.charCodeAt(0) - "a".charCodeAt(0);

    // If this character has the maximum frequency
    // and we haven't added all occurrences yet
    if (freq[idx] === maxFreq) {
      result.push(char);
      // Decrease frequency to avoid adding duplicates
      freq[idx]--;
    }
  }

  // Reverse the result since we traversed backwards
  return result.reverse().join("");
}
```

```java
// Time: O(n + 26 * maxFreq) ≈ O(n) since maxFreq ≤ n and 26 is constant
// Space: O(26) = O(1) for frequency array, O(n) for result
public String lastNonEmptyString(String s) {
    // Step 1: Count frequency of each character
    // We use an array of size 26 for 'a' to 'z'
    int[] freq = new int[26];

    for (int i = 0; i < s.length(); i++) {
        // Convert character to index (0 for 'a', 25 for 'z')
        int idx = s.charAt(i) - 'a';
        freq[idx]++;
    }

    // Step 2: Find the maximum frequency
    int maxFreq = 0;
    for (int count : freq) {
        maxFreq = Math.max(maxFreq, count);
    }

    // Step 3: Build the result string
    StringBuilder result = new StringBuilder();

    // We need to process characters in reverse order of appearance
    // to get the correct last occurrences
    // Traverse the string from end to beginning
    for (int i = s.length() - 1; i >= 0; i--) {
        char c = s.charAt(i);
        int idx = c - 'a';

        // If this character has the maximum frequency
        // and we haven't added all occurrences yet
        if (freq[idx] == maxFreq) {
            result.append(c);
            // Decrease frequency to avoid adding duplicates
            freq[idx]--;
        }
    }

    // Reverse the result since we traversed backwards
    return result.reverse().toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + 26 × maxFreq) ≈ O(n)

- Counting frequencies: O(n) to traverse the string once
- Finding max frequency: O(26) = O(1) since there are only 26 letters
- Building result: O(n) in the worst case (when all characters have max frequency)
- The 26 × maxFreq term is bounded by 26 × n, but since 26 is constant, this simplifies to O(n)

**Space Complexity:** O(n) for the result string

- Frequency array: O(26) = O(1) fixed space
- Result storage: O(n) in the worst case (when all characters have the same max frequency)

## Common Mistakes

1. **Simulating the entire process**: Some candidates try to literally remove characters in each round. This leads to O(n²) time complexity which times out for large inputs. Remember: when a problem says "simulate this process," it often means "find a pattern and compute directly."

2. **Wrong traversal order**: The problem asks for the order of removals, which corresponds to the last time each character appears in the removal sequence. We need to traverse the original string backwards to capture the last occurrences of characters with max frequency.

3. **Forgetting to handle multiple characters with same max frequency**: All characters with the maximum frequency should be included in the result, and they should appear in the order of their last occurrence in the original string.

4. **Incorrect frequency tracking**: When building the result from the end, we need to decrement the frequency after adding a character to avoid adding it multiple times. This ensures we only add each occurrence once.

## When You'll See This Pattern

This problem uses **frequency counting with positional tracking**, a common pattern in string manipulation problems:

1. **First Unique Character in a String (LeetCode 387)**: Also uses frequency counting to find characters with specific counts.

2. **Sort Characters By Frequency (LeetCode 451)**: Requires counting frequencies and then sorting characters based on those frequencies.

3. **Find All Anagrams in a String (LeetCode 438)**: Uses frequency counting with a sliding window to find anagrams.

The core technique is: when you need to process characters based on their counts or positions, first count frequencies, then use that information to make decisions without expensive simulations.

## Key Takeaways

1. **Look for patterns instead of simulating**: When a problem describes a multi-step process, look for mathematical patterns or invariants that let you compute the result directly. Here, the key was realizing that removal order depends only on character frequencies.

2. **Frequency arrays are efficient for fixed alphabets**: When dealing with lowercase/uppercase English letters, a size-26 or size-52 array is more efficient than a hash map and has O(1) access time.

3. **Consider traversal direction**: Sometimes processing data in reverse order (from end to beginning) simplifies the logic, especially when you need "last" occurrences or need to build a result in reverse.

[Practice this problem on CodeJeet](/problem/apply-operations-to-make-string-empty)
