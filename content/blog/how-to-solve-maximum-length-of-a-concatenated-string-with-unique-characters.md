---
title: "How to Solve Maximum Length of a Concatenated String with Unique Characters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Length of a Concatenated String with Unique Characters. Medium difficulty, 54.6% acceptance rate. Topics: Array, String, Backtracking, Bit Manipulation."
date: "2027-11-27"
category: "dsa-patterns"
tags:
  [
    "maximum-length-of-a-concatenated-string-with-unique-characters",
    "array",
    "string",
    "backtracking",
    "medium",
  ]
---

# How to Solve Maximum Length of a Concatenated String with Unique Characters

This problem asks us to find the longest possible string we can build by concatenating a subsequence of given strings, where the final concatenated string contains only unique characters. The challenge lies in efficiently exploring all possible combinations of strings while ensuring character uniqueness across the entire concatenation. What makes this interesting is that we need to consider both which strings to include and whether their characters conflict with each other.

## Visual Walkthrough

Let's trace through a concrete example: `arr = ["un", "iq", "ue"]`

We want to find the longest concatenation where all characters are unique. Let's explore step by step:

1. Start with an empty string (length 0)
2. Consider including "un" (characters: u, n)
   - Current concatenation: "un" (length 2, characters: {u, n})
3. Consider adding "iq" to "un"
   - Check if "iq" has any characters already in {u, n}: i and q are not u or n ✓
   - New concatenation: "uniq" (length 4, characters: {u, n, i, q})
4. Consider adding "ue" to "uniq"
   - Check if "ue" has any characters in {u, n, i, q}: u is already present ✗
   - Cannot add "ue"
5. Backtrack and try other combinations:
   - Just "iq" alone: length 2
   - "iq" + "ue": check if "ue" has characters in {i, q}: u and e are not i or q ✓
   - New concatenation: "ique" (length 4)
6. Try "ue" alone: length 2
7. Maximum length found: 4 (from either "uniq" or "ique")

The key insight: we need to track which characters we've used so we can quickly check if a new string can be added without duplicates.

## Brute Force Approach

A naive approach would generate all possible subsequences of the array (2^n possibilities where n is the length of `arr`), then for each subsequence:

1. Concatenate all strings in the subsequence
2. Check if the concatenated string has all unique characters
3. Track the maximum length found

This brute force solution has exponential time complexity O(2^n × L) where L is the total length of all strings, which becomes infeasible for n > 20. The main inefficiency comes from repeatedly checking character uniqueness and generating all subsequences explicitly.

## Optimized Approach

The key insight is that we can use **bitmasking** to efficiently represent character sets and check for overlaps. Since we only have 26 lowercase letters, we can represent which letters are present using a 26-bit integer (where bit 0 = 'a', bit 1 = 'b', etc.).

Here's the step-by-step reasoning:

1. **Preprocessing**: Convert each string to a bitmask representation. If a string contains duplicate characters, we discard it immediately since it can never be part of a valid concatenation.

2. **Backtracking with pruning**: We explore combinations using DFS/backtracking:
   - Start with an empty mask (no characters used)
   - For each string, check if its characters overlap with current mask using bitwise AND
   - If no overlap, add it to the current combination and update the mask
   - Continue exploring from the next index
   - Backtrack to try other combinations

3. **Optimization**: We can use memoization with (index, mask) as key, but since the state space is manageable (n × 2^26), and 2^26 is about 67 million which is too large, we stick with backtracking with pruning.

The bitmask approach gives us O(1) overlap checking and O(1) mask updates, making the solution much faster than checking character sets directly.

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack
def maxLength(arr):
    # Step 1: Preprocess - convert strings to bitmasks
    # We'll store tuples of (bitmask, length) for valid strings
    masks = []

    for s in arr:
        mask = 0
        valid = True

        # Convert string to bitmask
        for ch in s:
            bit = 1 << (ord(ch) - ord('a'))
            # Check if character already seen in this string
            if mask & bit:
                valid = False
                break
            mask |= bit

        # Only keep strings with unique characters
        if valid:
            masks.append((mask, len(s)))

    # Step 2: Backtracking DFS to find maximum length
    def backtrack(index, current_mask, current_length):
        # Base case: processed all strings
        if index == len(masks):
            return current_length

        # Option 1: Skip current string
        max_len = backtrack(index + 1, current_mask, current_length)

        # Option 2: Take current string if no overlap
        mask, length = masks[index]
        if (current_mask & mask) == 0:  # No overlapping characters
            # Update mask and length, then recurse
            new_mask = current_mask | mask
            new_length = current_length + length
            max_len = max(max_len, backtrack(index + 1, new_mask, new_length))

        return max_len

    # Start backtracking from index 0 with empty mask and 0 length
    return backtrack(0, 0, 0)
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack
function maxLength(arr) {
  // Step 1: Preprocess - convert strings to bitmasks
  const masks = [];

  for (const s of arr) {
    let mask = 0;
    let valid = true;

    // Convert string to bitmask
    for (const ch of s) {
      const bit = 1 << (ch.charCodeAt(0) - "a".charCodeAt(0));
      // Check if character already seen in this string
      if (mask & bit) {
        valid = false;
        break;
      }
      mask |= bit;
    }

    // Only keep strings with unique characters
    if (valid) {
      masks.push([mask, s.length]);
    }
  }

  // Step 2: Backtracking DFS to find maximum length
  function backtrack(index, currentMask, currentLength) {
    // Base case: processed all strings
    if (index === masks.length) {
      return currentLength;
    }

    // Option 1: Skip current string
    let maxLen = backtrack(index + 1, currentMask, currentLength);

    // Option 2: Take current string if no overlap
    const [mask, length] = masks[index];
    if ((currentMask & mask) === 0) {
      // No overlapping characters
      // Update mask and length, then recurse
      const newMask = currentMask | mask;
      const newLength = currentLength + length;
      maxLen = Math.max(maxLen, backtrack(index + 1, newMask, newLength));
    }

    return maxLen;
  }

  // Start backtracking from index 0 with empty mask and 0 length
  return backtrack(0, 0, 0);
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack
class Solution {
    public int maxLength(List<String> arr) {
        // Step 1: Preprocess - convert strings to bitmasks
        List<int[]> masks = new ArrayList<>();

        for (String s : arr) {
            int mask = 0;
            boolean valid = true;

            // Convert string to bitmask
            for (char ch : s.toCharArray()) {
                int bit = 1 << (ch - 'a');
                // Check if character already seen in this string
                if ((mask & bit) != 0) {
                    valid = false;
                    break;
                }
                mask |= bit;
            }

            // Only keep strings with unique characters
            if (valid) {
                masks.add(new int[]{mask, s.length()});
            }
        }

        // Step 2: Backtracking DFS to find maximum length
        return backtrack(0, 0, 0, masks);
    }

    private int backtrack(int index, int currentMask, int currentLength, List<int[]> masks) {
        // Base case: processed all strings
        if (index == masks.size()) {
            return currentLength;
        }

        // Option 1: Skip current string
        int maxLen = backtrack(index + 1, currentMask, currentLength, masks);

        // Option 2: Take current string if no overlap
        int[] maskInfo = masks.get(index);
        int mask = maskInfo[0];
        int length = maskInfo[1];

        if ((currentMask & mask) == 0) {  // No overlapping characters
            // Update mask and length, then recurse
            int newMask = currentMask | mask;
            int newLength = currentLength + length;
            maxLen = Math.max(maxLen, backtrack(index + 1, newMask, newLength, masks));
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(2^n) in the worst case, where n is the number of valid strings (strings with unique characters). However, in practice, pruning significantly reduces the search space because we skip strings that overlap with the current character set.

**Space Complexity**: O(n) for the recursion stack in the worst case, where we might recurse n levels deep. The preprocessing step uses O(n) space to store the bitmasks and lengths.

The exponential time might seem concerning, but with pruning and the constraint that strings can't have duplicate characters, the actual runtime is often much better than 2^n. For n ≤ 16 (typical constraint), this solution runs efficiently.

## Common Mistakes

1. **Not checking for duplicates within individual strings first**: Candidates might only check for duplicates across strings, forgetting that each string itself must have unique characters to be usable. Always validate each string individually first.

2. **Using string concatenation instead of tracking length**: Building the actual concatenated string at each step wastes time and space. We only need the length and character set, which we can track with an integer (length) and bitmask (character set).

3. **Forgetting to consider the empty subsequence**: The maximum length could be 0 if all strings have duplicate characters or all combinations have conflicts. Always initialize your maximum length appropriately.

4. **Inefficient overlap checking**: Using sets or arrays to check character overlap on every recursive call is O(26) instead of O(1) with bitmasking. The bitmask approach with bitwise AND is crucial for efficiency.

## When You'll See This Pattern

This problem combines **backtracking** with **bitmasking for state representation**, a pattern that appears in several combinatorial optimization problems:

1. **Maximum Product of Word Lengths** (LeetCode 318): Similar concept of checking character overlap between words using bitmasking to find pairs with no common letters.

2. **Subsets** (LeetCode 78): The backtracking approach to explore all subsets is identical to how we explore all subsequences here.

3. **Partition to K Equal Sum Subsets** (LeetCode 698): Uses bitmasking to represent which elements have been used, similar to how we track used characters.

The key pattern is when you need to explore combinations/exponential search space with constraints that can be efficiently checked using bitwise operations on a limited set of states (≤ 64 possibilities).

## Key Takeaways

1. **Bitmasking is powerful for subset problems**: When dealing with a small fixed set of possibilities (like 26 letters), representing sets as bitmasks enables O(1) set operations (union, intersection, membership check).

2. **Backtracking with pruning beats brute force enumeration**: Instead of generating all 2^n combinations explicitly, use DFS/backtracking to build combinations incrementally, pruning invalid paths early.

3. **Track state, not actual values**: For optimization problems where you only need certain properties (like length and character uniqueness), track the minimal state needed rather than building full intermediate results.

[Practice this problem on CodeJeet](/problem/maximum-length-of-a-concatenated-string-with-unique-characters)
