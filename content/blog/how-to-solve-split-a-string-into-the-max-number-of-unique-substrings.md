---
title: "How to Solve Split a String Into the Max Number of Unique Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Split a String Into the Max Number of Unique Substrings. Medium difficulty, 68.6% acceptance rate. Topics: Hash Table, String, Backtracking."
date: "2026-09-16"
category: "dsa-patterns"
tags:
  [
    "split-a-string-into-the-max-number-of-unique-substrings",
    "hash-table",
    "string",
    "backtracking",
    "medium",
  ]
---

# How to Solve "Split a String Into the Max Number of Unique Substrings"

This problem asks us to split a given string into as many non-empty substrings as possible, where every substring must be unique (no duplicates allowed). The concatenation of all substrings must equal the original string. What makes this problem interesting is that we need to find the maximum number of unique substrings possible, not just any valid split. This requires exploring different ways to split the string while tracking which substrings we've already used.

## Visual Walkthrough

Let's trace through a small example: `s = "ababccc"`

We want to split this into the maximum number of unique substrings. Let's think about how we might approach this:

1. Start from the beginning: `"a"` (unique, add to set)
2. Next: `"b"` (unique, add to set)
3. Next: `"a"` (but "a" is already in our set, so we can't use it again)
   - Instead, we could try `"ab"` (but we already have "a" and "b" separately)
   - Actually, we need to backtrack and try different splits

Let me show you a better way to visualize this:

```
s = "ababccc"

One possible split: ["a", "b", "ab", "c", "cc"] → 5 unique substrings
But is this maximum? Let's try: ["a", "b", "a", "b", "c", "c", "c"] → invalid (duplicate "a", "b", "c")
Another try: ["a", "ba", "b", "c", "cc"] → 5 unique substrings
Another: ["ab", "a", "b", "c", "cc"] → 5 unique substrings
What about: ["a", "b", "ab", "cc", "c"] → still 5

Actually, the maximum is 5 for this string. The key insight is that we need to try different split points and track which substrings we've seen.
```

The process is like: at each position, we try all possible substring lengths starting from that position. If the substring is unique (not in our set), we add it to the set, recursively process the rest of the string, then remove it from the set (backtracking).

## Brute Force Approach

A naive brute force approach would be to generate all possible splits of the string and check which one gives the maximum number of unique substrings. For a string of length `n`, there are `2^(n-1)` possible ways to split it (since we can choose to cut or not cut at each of the `n-1` positions between characters).

For each split, we would need to:

1. Generate all substrings
2. Check if all are unique (using a set)
3. Count the number of substrings
4. Track the maximum count

This approach has exponential time complexity `O(2^n * n)` because we generate all subsets of split points and for each, we process up to `n` substrings. For `n=16`, that's already 65,536 possibilities, and each requires processing the string. This is clearly too slow for longer strings.

## Optimized Approach

The key insight is that we can use **backtracking with pruning** to explore only promising splits. Here's the step-by-step reasoning:

1. **Backtracking Framework**: We start from the beginning of the string and try to build our solution incrementally. At each step, we consider all possible substrings starting from the current position.

2. **State Tracking**: We maintain a set of substrings we've used so far. Before adding a new substring, we check if it's already in the set.

3. **Pruning**: If a substring is already in our set, we skip it (no point exploring this path further for that particular substring length).

4. **Recursive Exploration**: For each valid (unique) substring, we:
   - Add it to our set

- Recursively process the remaining part of the string
- Remove it from our set (backtracking)

5. **Base Case**: When we reach the end of the string, we update our maximum count if the current split has more unique substrings than our previous maximum.

6. **Optimization**: We can add an early termination condition: if the current count plus the maximum possible remaining splits (which is the length of the remaining string) is less than or equal to our current maximum, we can prune that branch.

The backtracking approach is much more efficient than brute force because we prune invalid paths early (when we encounter duplicate substrings).

## Optimal Solution

Here's the complete solution using backtracking with pruning:

<div class="code-group">

```python
# Time: O(2^n) in worst case, but heavily pruned in practice
# Space: O(n) for recursion stack and substring set
class Solution:
    def maxUniqueSplit(self, s: str) -> int:
        # Use a set to track unique substrings we've seen so far
        seen = set()
        # Variable to store the maximum number of unique substrings found
        self.max_count = 0

        def backtrack(start_index, count):
            """
            Backtracking function to explore all possible splits.

            Args:
                start_index: Current position in the string
                count: Number of unique substrings found so far
            """
            # If we've reached the end of the string
            if start_index == len(s):
                # Update maximum if current count is better
                self.max_count = max(self.max_count, count)
                return

            # Early pruning: if even splitting all remaining characters
            # individually can't beat current max, stop exploring
            remaining_chars = len(s) - start_index
            if count + remaining_chars <= self.max_count:
                return

            # Try all possible substrings starting from start_index
            # We can end the substring at any position from start_index to end
            for end in range(start_index + 1, len(s) + 1):
                # Extract the current substring
                current_sub = s[start_index:end]

                # Only proceed if this substring is unique (not in seen set)
                if current_sub not in seen:
                    # Add to seen set (choose this substring)
                    seen.add(current_sub)

                    # Recursively process the rest of the string
                    backtrack(end, count + 1)

                    # Remove from seen set (backtrack/unchoose)
                    seen.remove(current_sub)

        # Start backtracking from the beginning with count 0
        backtrack(0, 0)

        return self.max_count
```

```javascript
// Time: O(2^n) in worst case, but heavily pruned in practice
// Space: O(n) for recursion stack and substring set
/**
 * @param {string} s
 * @return {number}
 */
var maxUniqueSplit = function (s) {
  // Set to track unique substrings we've seen so far
  const seen = new Set();
  // Variable to store the maximum number of unique substrings found
  let maxCount = 0;

  /**
   * Backtracking function to explore all possible splits.
   * @param {number} startIndex - Current position in the string
   * @param {number} count - Number of unique substrings found so far
   */
  function backtrack(startIndex, count) {
    // If we've reached the end of the string
    if (startIndex === s.length) {
      // Update maximum if current count is better
      maxCount = Math.max(maxCount, count);
      return;
    }

    // Early pruning: if even splitting all remaining characters
    // individually can't beat current max, stop exploring
    const remainingChars = s.length - startIndex;
    if (count + remainingChars <= maxCount) {
      return;
    }

    // Try all possible substrings starting from startIndex
    // We can end the substring at any position from startIndex to end
    for (let end = startIndex + 1; end <= s.length; end++) {
      // Extract the current substring
      const currentSub = s.substring(startIndex, end);

      // Only proceed if this substring is unique (not in seen set)
      if (!seen.has(currentSub)) {
        // Add to seen set (choose this substring)
        seen.add(currentSub);

        // Recursively process the rest of the string
        backtrack(end, count + 1);

        // Remove from seen set (backtrack/unchoose)
        seen.delete(currentSub);
      }
    }
  }

  // Start backtracking from the beginning with count 0
  backtrack(0, 0);

  return maxCount;
};
```

```java
// Time: O(2^n) in worst case, but heavily pruned in practice
// Space: O(n) for recursion stack and substring set
class Solution {
    private int maxCount = 0;

    public int maxUniqueSplit(String s) {
        // Set to track unique substrings we've seen so far
        Set<String> seen = new HashSet<>();

        // Start backtracking from the beginning with count 0
        backtrack(s, 0, 0, seen);

        return maxCount;
    }

    /**
     * Backtracking function to explore all possible splits.
     * @param s The original string
     * @param startIndex Current position in the string
     * @param count Number of unique substrings found so far
     * @param seen Set of substrings seen so far
     */
    private void backtrack(String s, int startIndex, int count, Set<String> seen) {
        // If we've reached the end of the string
        if (startIndex == s.length()) {
            // Update maximum if current count is better
            maxCount = Math.max(maxCount, count);
            return;
        }

        // Early pruning: if even splitting all remaining characters
        // individually can't beat current max, stop exploring
        int remainingChars = s.length() - startIndex;
        if (count + remainingChars <= maxCount) {
            return;
        }

        // Try all possible substrings starting from startIndex
        // We can end the substring at any position from startIndex to end
        for (int end = startIndex + 1; end <= s.length(); end++) {
            // Extract the current substring
            String currentSub = s.substring(startIndex, end);

            // Only proceed if this substring is unique (not in seen set)
            if (!seen.contains(currentSub)) {
                // Add to seen set (choose this substring)
                seen.add(currentSub);

                // Recursively process the rest of the string
                backtrack(s, end, count + 1, seen);

                // Remove from seen set (backtrack/unchoose)
                seen.remove(currentSub);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: In the worst case, the time complexity is `O(2^n)` where `n` is the length of the string. This worst case occurs when all characters are unique, giving us the maximum branching factor. However, in practice, the pruning (both from duplicate substrings and the early termination condition) makes this much faster. The early pruning condition `count + remainingChars <= maxCount` is particularly effective.

**Space Complexity**: `O(n)` for the recursion stack (which can go `n` levels deep in the worst case) and the set of seen substrings (which can contain up to `n` substrings in the worst case, each of which could be up to `n` characters long, but the total characters stored is bounded by `O(n^2)`). However, since we're storing references to substrings (slices in Python, substrings in Java/JavaScript), the actual space might be less than `O(n^2)` depending on the language implementation.

## Common Mistakes

1. **Forgetting to backtrack**: The most common mistake is adding a substring to the set but forgetting to remove it after the recursive call. This is crucial for exploring all possibilities.

2. **Incorrect substring indices**: When extracting substrings, it's easy to get the indices wrong. Remember that `s[start:end]` in Python includes `start` but excludes `end`. In Java/JavaScript, `substring(start, end)` works similarly.

3. **Missing the early pruning optimization**: Without the early termination condition `count + remainingChars <= maxCount`, the solution can be much slower for longer strings. This optimization prunes branches that can't possibly yield a better result.

4. **Using a list instead of a set for tracking seen substrings**: Checking if an element is in a list takes `O(n)` time, while checking in a set takes `O(1)` average time. This can make a huge difference in performance.

5. **Not handling the base case correctly**: The recursion should stop when `start_index == len(s)`, not when `start_index > len(s)` or when `start_index == len(s) - 1`.

## When You'll See This Pattern

This backtracking with pruning pattern appears in many combinatorial problems where you need to explore all possibilities but can eliminate some paths early:

1. **Palindrome Partitioning (LeetCode 131)**: Split a string into all possible palindrome substrings. Similar backtracking approach with an additional palindrome check.

2. **Restore IP Addresses (LeetCode 93)**: Split a string into valid IP address components. Similar structure with constraints on each segment (0-255, no leading zeros).

3. **Word Break II (LeetCode 140)**: Split a string into words from a dictionary. Similar backtracking but with dictionary lookup instead of uniqueness check.

4. **Generate Parentheses (LeetCode 22)**: Different domain but similar backtracking with constraints pattern.

The common theme is: explore all ways to break a sequence into parts, where each part must satisfy some constraint, and we want to find all valid combinations or optimize for some metric (like maximum number of parts).

## Key Takeaways

1. **Backtracking is natural for partition problems**: When you need to split a sequence in all possible ways, backtracking lets you build the solution incrementally and explore all possibilities systematically.

2. **Prune early, prune often**: Always look for conditions that let you eliminate branches early. In this problem, we prune when we encounter duplicate substrings and when a branch can't possibly beat our current best.

3. **Sets are efficient for uniqueness checks**: When you need to track which elements you've seen and check for duplicates, a hash set gives you `O(1)` lookups vs `O(n)` for a list.

4. **Think about the state you need to track**: In backtracking problems, carefully consider what state needs to be maintained between recursive calls and what needs to be restored when backtracking.

[Practice this problem on CodeJeet](/problem/split-a-string-into-the-max-number-of-unique-substrings)
