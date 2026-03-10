---
title: "How to Solve Longest Unequal Adjacent Groups Subsequence I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Unequal Adjacent Groups Subsequence I. Easy difficulty, 67.0% acceptance rate. Topics: Array, String, Dynamic Programming, Greedy."
date: "2026-09-25"
category: "dsa-patterns"
tags:
  [
    "longest-unequal-adjacent-groups-subsequence-i",
    "array",
    "string",
    "dynamic-programming",
    "easy",
  ]
---

# How to Solve Longest Unequal Adjacent Groups Subsequence I

This problem asks us to find the longest alternating subsequence from an array of words, where "alternating" means consecutive words must have different corresponding values in a binary `groups` array. The challenge is that we need to select words in their original order while ensuring adjacent selections have different group values. What makes this interesting is that it looks like a dynamic programming problem but actually has a greedy solution—once you recognize the pattern, the implementation becomes straightforward.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
words = ["a", "b", "c", "d", "e"]
groups = [0, 1, 0, 1, 0]
```

We need to pick words in order where consecutive picks have different `groups` values.

**Step-by-step reasoning:**

1. Start with `words[0] = "a"` (group 0). Add to result: `["a"]`
2. Look at `words[1] = "b"` (group 1). Since group 1 ≠ previous group 0, we can add it. Result: `["a", "b"]`
3. Look at `words[2] = "c"` (group 0). Since group 0 ≠ previous group 1, we can add it. Result: `["a", "b", "c"]`
4. Look at `words[3] = "d"` (group 1). Since group 1 ≠ previous group 0, we can add it. Result: `["a", "b", "c", "d"]`
5. Look at `words[4] = "e"` (group 0). Since group 0 ≠ previous group 1, we can add it. Result: `["a", "b", "c", "d", "e"]`

The entire sequence works because the groups alternate perfectly: `[0, 1, 0, 1, 0]`.

**Another example:**

```
words = ["red", "blue", "red", "green"]
groups = [1, 0, 1, 0]
```

1. Start with `words[0] = "red"` (group 1). Result: `["red"]`
2. `words[1] = "blue"` (group 0) ≠ 1, so add it. Result: `["red", "blue"]`
3. `words[2] = "red"` (group 1) ≠ 0, so add it. Result: `["red", "blue", "red"]`
4. `words[3] = "green"` (group 0) ≠ 1, so add it. Result: `["red", "blue", "red", "green"]`

Again, we get the entire sequence because groups alternate.

**Key insight:** We can always take the first word, then only take subsequent words when their group differs from the last taken word's group. This greedy approach works because we want the longest possible subsequence, and skipping a word when groups are equal gives us more opportunities later.

## Brute Force Approach

A naive approach would be to generate all possible subsequences of `words`, check if each is alternating, and keep track of the longest valid one. For each of the `n` words, we have two choices: include or exclude it. This gives us `2^n` possible subsequences to check.

**Why this fails:**

- Time complexity: `O(2^n * n)` — exponential time is completely impractical for typical constraints (n up to 100).
- Space complexity: `O(2^n)` to store all subsequences.
- Even for moderate `n` like 50, `2^50` is over 1 quadrillion operations.

The brute force approach is only mentioned to understand why we need a better solution. In an interview, you'd quickly recognize this is infeasible and look for optimization.

## Optimal Solution

The optimal solution uses a greedy approach. Here's the intuition:

1. We always include the first word (it starts our subsequence).
2. For each subsequent word, we include it if its group differs from the group of the last word we included.
3. This works because if we skip a word when groups are equal, we might miss a longer subsequence later. But actually, if groups are equal, including the current word would break the alternating property, so we must skip it to maintain validity.

The greedy choice is optimal because:

- Including a word when its group equals the previous group's would immediately invalidate our subsequence
- By only taking words when groups differ, we ensure every addition extends a valid alternating subsequence
- This naturally produces the longest possible alternating subsequence

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result list
def getLongestSubsequence(words, groups):
    """
    Returns the longest alternating subsequence based on groups array.

    Args:
        words: List of strings
        groups: List of integers (0 or 1) of same length as words

    Returns:
        List of strings forming longest alternating subsequence
    """
    result = []

    # Always include the first word - it starts our subsequence
    result.append(words[0])
    last_group = groups[0]  # Track group of last included word

    # Iterate through remaining words
    for i in range(1, len(words)):
        current_group = groups[i]

        # Only include word if its group differs from last included word's group
        if current_group != last_group:
            result.append(words[i])
            last_group = current_group  # Update last group for next comparison

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function getLongestSubsequence(words, groups) {
  /**
   * Returns the longest alternating subsequence based on groups array.
   *
   * @param {string[]} words - Array of strings
   * @param {number[]} groups - Array of integers (0 or 1) of same length as words
   * @return {string[]} - Array of strings forming longest alternating subsequence
   */
  const result = [];

  // Always include the first word - it starts our subsequence
  result.push(words[0]);
  let lastGroup = groups[0]; // Track group of last included word

  // Iterate through remaining words
  for (let i = 1; i < words.length; i++) {
    const currentGroup = groups[i];

    // Only include word if its group differs from last included word's group
    if (currentGroup !== lastGroup) {
      result.push(words[i]);
      lastGroup = currentGroup; // Update last group for next comparison
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result list
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> getLongestSubsequence(String[] words, int[] groups) {
        /**
         * Returns the longest alternating subsequence based on groups array.
         *
         * @param words: Array of strings
         * @param groups: Array of integers (0 or 1) of same length as words
         * @return List of strings forming longest alternating subsequence
         */
        List<String> result = new ArrayList<>();

        // Always include the first word - it starts our subsequence
        result.add(words[0]);
        int lastGroup = groups[0];  // Track group of last included word

        // Iterate through remaining words
        for (int i = 1; i < words.length; i++) {
            int currentGroup = groups[i];

            // Only include word if its group differs from last included word's group
            if (currentGroup != lastGroup) {
                result.add(words[i]);
                lastGroup = currentGroup;  // Update last group for next comparison
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once (`n-1` iterations after the first element).
- Each iteration does constant work: one comparison and potentially one append operation.
- The linear scan is optimal since we must examine each element at least once to determine if it should be included.

**Space Complexity: O(n)**

- In the worst case, we might include all words in the result (when groups alternate perfectly).
- The result list stores up to `n` strings.
- Note: We're not counting the input storage, only the auxiliary space used by our algorithm.
- We could optimize to O(1) extra space if we modified the input array in-place, but typically we return a new list.

## Common Mistakes

1. **Starting with an empty result and trying to decide whether to include the first word:** The problem guarantees at least one word, and we must start our subsequence somewhere. Always include the first word—it gives us a starting point for comparisons.

2. **Comparing with the immediately previous word in the original array instead of the last included word:** This is subtle but important. We need to compare with the last word we actually included in our subsequence, not just the word at index `i-1` in the original array.

3. **Overcomplicating with dynamic programming:** Some candidates might try to use DP with states like `dp[i][0]` and `dp[i][1]`, but this is unnecessary. The greedy approach is simpler and more efficient. Recognizing when a greedy solution works is a key interview skill.

4. **Forgetting to update `last_group` after including a word:** If you don't update the tracking variable, all subsequent comparisons will be against the first word's group, which is incorrect.

5. **Handling edge cases incorrectly:** What if all groups are the same? Our algorithm correctly returns only the first word (since no other word has a different group). What if there's only one word? We return that single word. Always test these edge cases.

## When You'll See This Pattern

This "alternating subsequence" pattern appears in several variations:

1. **Longest Alternating Subsequence (LAS)** - LeetCode 376: "Wiggle Subsequence" is almost identical but uses numerical comparisons instead of binary groups. The greedy approach works there too.

2. **Remove Adjacent Duplicates** - LeetCode 1047: "Remove All Adjacent Duplicates In String" uses a similar "compare with last included" logic but removes matching elements instead of keeping alternating ones.

3. **Partition Array into Alternating Sequences** - Problems where you need to split data into alternating categories often use this comparison pattern.

The core technique is maintaining a "last included" reference and making local decisions that guarantee global optimality—a hallmark of greedy algorithms.

## Key Takeaways

1. **Greedy can be optimal for subsequence problems with local constraints:** When the decision to include an element depends only on the last included element (not the entire sequence), a greedy approach often works.

2. **Always start with the first element when building a subsequence:** This gives you a reference point for comparisons and ensures you don't miss valid sequences starting at the beginning.

3. **Track state between iterations:** Use a variable to remember the "last included" property (in this case, the group value) to make correct decisions about whether to include the current element.

4. **Test edge cases:** Single element, all same groups, perfect alternation—these test whether your algorithm handles boundaries correctly.

[Practice this problem on CodeJeet](/problem/longest-unequal-adjacent-groups-subsequence-i)
