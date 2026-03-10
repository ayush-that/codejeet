---
title: "How to Solve Make Three Strings Equal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Make Three Strings Equal. Easy difficulty, 44.6% acceptance rate. Topics: String."
date: "2028-11-26"
category: "dsa-patterns"
tags: ["make-three-strings-equal", "string", "easy"]
---

# How to Solve "Make Three Strings Equal"

You're given three strings and can only delete characters from the right end of any string. Your goal is to make all three strings equal with the minimum number of deletions. The catch is that you can't empty any string completely, which means the resulting equal strings must be non-empty. This problem is interesting because it tests your understanding of string prefixes and how to find the longest common prefix that satisfies constraints.

## Visual Walkthrough

Let's trace through an example: `s1 = "abc"`, `s2 = "ab"`, `s3 = "a"`

**Step 1: Understanding the operation**
We can only delete from the right end. This means we're essentially looking for a common prefix that all three strings share, since we can only shorten strings from the end.

**Step 2: Finding the longest possible equal string**
We need to find the longest string that is a prefix of all three strings:

- `s1` prefixes: `"a"`, `"ab"`, `"abc"`
- `s2` prefixes: `"a"`, `"ab"`
- `s3` prefixes: `"a"`

The longest common prefix is `"a"`.

**Step 3: Calculating operations**
To make all strings equal to `"a"`:

- `s1` (`"abc"`) needs 2 deletions (remove `"c"`, then `"b"`)
- `s2` (`"ab"`) needs 1 deletion (remove `"b"`)
- `s3` (`"a"`) needs 0 deletions (already `"a"`)
  Total: 2 + 1 + 0 = 3 operations

**Step 4: Verification**
After 3 operations:

- `s1` becomes `"a"`
- `s2` becomes `"a"`
- `s3` remains `"a"`
  All strings are equal and non-empty.

## Brute Force Approach

A naive approach would be to try all possible lengths for the resulting equal string, from 1 up to the minimum length among the three strings. For each length `k`, we would:

1. Check if the first `k` characters of all three strings are equal
2. If yes, calculate the total deletions needed: `(len(s1)-k) + (len(s2)-k) + (len(s3)-k)`
3. Track the minimum total deletions

While this approach would work, it's inefficient because:

- We're repeatedly comparing the same prefixes
- The time complexity would be O(n × m) where n is the minimum string length and m is the total length of all strings
- We can solve this more efficiently by finding the longest common prefix in a single pass

## Optimal Solution

The key insight is that we need to find the **longest common prefix** of all three strings. Once we find this prefix, the answer is simply the total number of characters we need to delete from all strings to reduce them to this common prefix.

The algorithm:

1. Find the minimum length among the three strings (this is our upper bound)
2. Iterate from index 0 up to min_length-1
3. At each position, check if all three strings have the same character
4. Stop at the first position where characters differ
5. The length of the common prefix is the index where we stopped
6. Calculate total deletions: `(len(s1)-prefix_len) + (len(s2)-prefix_len) + (len(s3)-prefix_len)`

<div class="code-group">

```python
# Time: O(min(L1, L2, L3)) where L1, L2, L3 are string lengths
# Space: O(1) - we only use a few variables
def minimumOperations(s1: str, s2: str, s3: str) -> int:
    # Step 1: Find the minimum length among the three strings
    # This determines how far we can possibly compare
    min_len = min(len(s1), len(s2), len(s3))

    # Step 2: Find the longest common prefix
    # We'll compare characters at each position until we find a mismatch
    prefix_len = 0
    for i in range(min_len):
        # Check if all three strings have the same character at position i
        if s1[i] == s2[i] == s3[i]:
            # All characters match, extend the common prefix
            prefix_len += 1
        else:
            # Found a mismatch, stop comparing further
            break

    # Step 3: Check if we found any common prefix
    # If prefix_len is 0, there's no common first character
    # Since we can't empty strings, this means it's impossible
    if prefix_len == 0:
        return -1

    # Step 4: Calculate total deletions needed
    # For each string, delete all characters after the common prefix
    deletions = (len(s1) - prefix_len) + (len(s2) - prefix_len) + (len(s3) - prefix_len)

    return deletions
```

```javascript
// Time: O(min(L1, L2, L3)) where L1, L2, L3 are string lengths
// Space: O(1) - we only use a few variables
function minimumOperations(s1, s2, s3) {
  // Step 1: Find the minimum length among the three strings
  // This determines how far we can possibly compare
  const minLen = Math.min(s1.length, s2.length, s3.length);

  // Step 2: Find the longest common prefix
  // We'll compare characters at each position until we find a mismatch
  let prefixLen = 0;
  for (let i = 0; i < minLen; i++) {
    // Check if all three strings have the same character at position i
    if (s1[i] === s2[i] && s2[i] === s3[i]) {
      // All characters match, extend the common prefix
      prefixLen++;
    } else {
      // Found a mismatch, stop comparing further
      break;
    }
  }

  // Step 3: Check if we found any common prefix
  // If prefixLen is 0, there's no common first character
  // Since we can't empty strings, this means it's impossible
  if (prefixLen === 0) {
    return -1;
  }

  // Step 4: Calculate total deletions needed
  // For each string, delete all characters after the common prefix
  const deletions = s1.length - prefixLen + (s2.length - prefixLen) + (s3.length - prefixLen);

  return deletions;
}
```

```java
// Time: O(min(L1, L2, L3)) where L1, L2, L3 are string lengths
// Space: O(1) - we only use a few variables
class Solution {
    public int minimumOperations(String s1, String s2, String s3) {
        // Step 1: Find the minimum length among the three strings
        // This determines how far we can possibly compare
        int minLen = Math.min(s1.length(), Math.min(s2.length(), s3.length()));

        // Step 2: Find the longest common prefix
        // We'll compare characters at each position until we find a mismatch
        int prefixLen = 0;
        for (int i = 0; i < minLen; i++) {
            // Check if all three strings have the same character at position i
            if (s1.charAt(i) == s2.charAt(i) && s2.charAt(i) == s3.charAt(i)) {
                // All characters match, extend the common prefix
                prefixLen++;
            } else {
                // Found a mismatch, stop comparing further
                break;
            }
        }

        // Step 3: Check if we found any common prefix
        // If prefixLen is 0, there's no common first character
        // Since we can't empty strings, this means it's impossible
        if (prefixLen == 0) {
            return -1;
        }

        // Step 4: Calculate total deletions needed
        // For each string, delete all characters after the common prefix
        int deletions = (s1.length() - prefixLen) +
                       (s2.length() - prefixLen) +
                       (s3.length() - prefixLen);

        return deletions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(min(L₁, L₂, L₃))

- We iterate through characters only up to the length of the shortest string
- At each position, we perform constant-time comparisons
- The rest of the operations (length calculations, subtraction) are also constant time

**Space Complexity:** O(1)

- We only use a fixed number of variables regardless of input size
- No additional data structures are created
- The input strings are not modified

## Common Mistakes

1. **Forgetting to check for the empty prefix case**: If the strings don't share even the first character, prefix_len will be 0. Since we can't empty strings, we must return -1. Many candidates forget this edge case.

2. **Comparing beyond the shortest string**: Some candidates try to compare characters up to the maximum length, which causes index out of bounds errors. Always limit comparisons to the minimum length.

3. **Incorrect deletion calculation**: The formula is `(len(s1)-prefix_len) + (len(s2)-prefix_len) + (len(s3)-prefix_len)`. Some candidates mistakenly calculate `(len(s1)+len(s2)+len(s3)) - prefix_len` which is incorrect.

4. **Overcomplicating with dynamic programming**: While this problem is related to edit distance problems, it doesn't require DP. The constraint of only deleting from the right end simplifies the problem significantly.

## When You'll See This Pattern

This problem uses the **longest common prefix** pattern, which appears in various string problems:

1. **Longest Common Prefix (LeetCode 14)**: Directly asks for the longest common prefix among an array of strings. The technique of comparing character by character until a mismatch is identical.

2. **Compare Version Numbers (LeetCode 165)**: While comparing version numbers, you often need to compare segments sequentially until you find a difference, similar to finding where prefixes diverge.

3. **Word Search / Trie problems**: When building or searching a trie, you're essentially finding common prefixes among words.

The core pattern is: when you need to find how much strings have in common from the beginning, iterate character by character until you find a mismatch.

## Key Takeaways

1. **Constraints simplify problems**: The restriction of only deleting from the right transforms what could be a complex edit distance problem into a simple prefix comparison. Always look for how constraints limit the solution space.

2. **Longest common prefix is a fundamental operation**: Many string manipulation problems reduce to finding how much strings have in common from the start. The character-by-character comparison until mismatch is the standard approach.

3. **Edge cases matter**: The requirement that strings can't be empty adds an important edge case (return -1 if no common first character). Always test with: all strings different first character, one string much shorter than others, and all strings identical.

Related problems: [Delete Operation for Two Strings](/problem/delete-operation-for-two-strings)
