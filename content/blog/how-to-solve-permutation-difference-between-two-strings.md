---
title: "How to Solve Permutation Difference between Two Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Permutation Difference between Two Strings. Easy difficulty, 87.8% acceptance rate. Topics: Hash Table, String."
date: "2027-04-23"
category: "dsa-patterns"
tags: ["permutation-difference-between-two-strings", "hash-table", "string", "easy"]
---

# How to Solve Permutation Difference between Two Strings

This problem asks us to calculate the "permutation difference" between two strings `s` and `t`, where `t` is a permutation of `s` and all characters appear at most once. The difference is defined as the sum of absolute differences between each character's index in `s` and its index in `t`. While conceptually simple, this problem tests your ability to efficiently map characters to their positions—a fundamental skill for string manipulation problems.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `s = "abcde"`
- `t = "edcba"`

We need to find, for each character, the absolute difference between its position in `s` and its position in `t`:

1. Character 'a': Index in `s` is 0, index in `t` is 4 → |0 - 4| = 4
2. Character 'b': Index in `s` is 1, index in `t` is 3 → |1 - 3| = 2
3. Character 'c': Index in `s` is 2, index in `t` is 2 → |2 - 2| = 0
4. Character 'd': Index in `s` is 3, index in `t` is 1 → |3 - 1| = 2
5. Character 'e': Index in `s` is 4, index in `t` is 0 → |4 - 0| = 4

Sum = 4 + 2 + 0 + 2 + 4 = 12

The key insight is that we need quick access to each character's position in both strings. Looking up a character's position by scanning the string each time would be inefficient. Instead, we can precompute a mapping from characters to their indices.

## Brute Force Approach

A naive approach would be to iterate through each character in `s`, then for each character, scan through `t` to find its position:

1. Initialize `total_diff = 0`
2. For each character `ch` at index `i` in `s`:
   - Search through `t` to find index `j` where `t[j] == ch`
   - Add `|i - j|` to `total_diff`

This approach has O(n²) time complexity because for each of n characters in `s`, we might scan through all n characters in `t` in the worst case. While this would work for small inputs (and the constraints are small enough that it might pass), it's inefficient and shows poor understanding of data structures.

## Optimal Solution

The optimal solution uses a hash map (dictionary in Python, object in JavaScript, HashMap in Java) to store character-to-index mappings. Since `t` is a permutation of `s` and all characters are unique, we can:

1. Build a mapping from characters to their indices in `t`
2. Iterate through `s`, looking up each character's position in `t` from the map
3. Calculate the absolute difference and accumulate the sum

This reduces the lookup time from O(n) to O(1) per character.

<div class="code-group">

```python
# Time: O(n) where n is the length of s (and t)
# Space: O(n) for storing character indices in hash map
def findPermutationDifference(s: str, t: str) -> int:
    # Step 1: Create a dictionary to map each character to its index in t
    # This gives us O(1) lookup for any character's position in t
    char_to_index = {}

    # Populate the dictionary with character-index pairs from t
    for i, ch in enumerate(t):
        char_to_index[ch] = i

    # Step 2: Initialize total difference to 0
    total_diff = 0

    # Step 3: Iterate through each character in s with its index
    for i, ch in enumerate(s):
        # Get the index of this character in t from our dictionary
        j = char_to_index[ch]

        # Calculate absolute difference between positions
        diff = abs(i - j)

        # Add to running total
        total_diff += diff

    # Step 4: Return the computed total difference
    return total_diff
```

```javascript
// Time: O(n) where n is the length of s (and t)
// Space: O(n) for storing character indices in object
function findPermutationDifference(s, t) {
  // Step 1: Create an object to map each character to its index in t
  // This gives us O(1) lookup for any character's position in t
  const charToIndex = {};

  // Populate the object with character-index pairs from t
  for (let i = 0; i < t.length; i++) {
    charToIndex[t[i]] = i;
  }

  // Step 2: Initialize total difference to 0
  let totalDiff = 0;

  // Step 3: Iterate through each character in s with its index
  for (let i = 0; i < s.length; i++) {
    // Get the index of this character in t from our object
    const j = charToIndex[s[i]];

    // Calculate absolute difference between positions
    const diff = Math.abs(i - j);

    // Add to running total
    totalDiff += diff;
  }

  // Step 4: Return the computed total difference
  return totalDiff;
}
```

```java
// Time: O(n) where n is the length of s (and t)
// Space: O(n) for storing character indices in HashMap
public int findPermutationDifference(String s, String t) {
    // Step 1: Create a HashMap to map each character to its index in t
    // This gives us O(1) lookup for any character's position in t
    Map<Character, Integer> charToIndex = new HashMap<>();

    // Populate the HashMap with character-index pairs from t
    for (int i = 0; i < t.length(); i++) {
        charToIndex.put(t.charAt(i), i);
    }

    // Step 2: Initialize total difference to 0
    int totalDiff = 0;

    // Step 3: Iterate through each character in s with its index
    for (int i = 0; i < s.length(); i++) {
        // Get the index of this character in t from our HashMap
        int j = charToIndex.get(s.charAt(i));

        // Calculate absolute difference between positions
        int diff = Math.abs(i - j);

        // Add to running total
        totalDiff += diff;
    }

    // Step 4: Return the computed total difference
    return totalDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the character-to-index map for `t` takes O(n) time, where n is the length of the strings
- Iterating through `s` to calculate differences also takes O(n) time
- Each lookup in the hash map is O(1) on average
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store a mapping for each character in `t`, which requires O(n) space
- The input strings themselves are not counted toward space complexity in standard analysis
- No other significant data structures are used

## Common Mistakes

1. **Using nested loops for lookups**: Some candidates iterate through `t` for every character in `s`, resulting in O(n²) time. This misses the opportunity to use a hash map for constant-time lookups.

2. **Forgetting that characters are unique**: The problem states each character occurs at most once, but some candidates might write code that handles duplicates. While not wrong, it adds unnecessary complexity.

3. **Incorrect absolute value calculation**: Using `i - j` without `abs()` would give wrong results when `j > i`. The absolute difference is crucial.

4. **Assuming strings have the same length**: While the problem guarantees `t` is a permutation of `s`, explicitly checking or assuming equal length without verification could be problematic in interview settings if the problem constraints weren't clear.

## When You'll See This Pattern

This problem uses the **character frequency/index mapping** pattern, which appears in many string problems:

1. **Two Sum (Easy)**: Uses a hash map to store values and their indices for O(1) lookups, similar to how we map characters to indices here.

2. **Find the Difference (Easy)**: Often solved by counting character frequencies using arrays or hash maps, building on the same mapping concept.

3. **First Unique Character in a String (Easy)**: Requires counting character frequencies first, then scanning to find the first character with count 1.

4. **Valid Anagram (Easy)**: Compares character frequency counts between two strings, using similar mapping techniques.

The core pattern is: when you need to compare or relate elements between two collections, precomputing a mapping (frequency, index, or other property) often leads to optimal solutions.

## Key Takeaways

1. **Hash maps provide O(1) lookups**: When you need to find elements quickly, a hash map is often the right tool. Mapping characters to their indices (or frequencies) is a common string problem technique.

2. **Precompute when possible**: Instead of searching repeatedly, build a data structure once that answers future queries efficiently. This is the difference between O(n²) and O(n) solutions.

3. **Read constraints carefully**: The fact that characters appear at most once simplifies the problem. In interviews, noting such constraints aloud shows attention to detail.

Related problems: [Find the Difference](/problem/find-the-difference)
