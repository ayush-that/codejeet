---
title: "How to Solve Partition String  — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition String . Medium difficulty, 58.7% acceptance rate. Topics: Hash Table, String, Trie, Simulation."
date: "2028-12-16"
category: "dsa-patterns"
tags: ["partition-string", "hash-table", "string", "trie", "medium"]
---

# How to Solve Partition String

You're given a string `s` and need to partition it into unique segments. Starting from index 0, you keep extending the current segment character by character until you encounter a segment that hasn't appeared before. Once you find a unique segment, you add it to your result and start building the next segment from the next character. The tricky part is that you need to recognize when a segment becomes unique while building it incrementally.

## Visual Walkthrough

Let's trace through an example: `s = "abacaba"`

**Step 1:** Start at index 0 with segment `"a"`

- `"a"` has been seen before? No (empty set)
- Add `"a"` to result, add `"a"` to seen set
- Result: `["a"]`, Seen: `{"a"}`

**Step 2:** Start at index 1 with segment `"b"`

- `"b"` has been seen before? No
- Add `"b"` to result, add `"b"` to seen set
- Result: `["a", "b"]`, Seen: `{"a", "b"}`

**Step 3:** Start at index 2 with segment `"a"`

- `"a"` has been seen before? Yes (in set)
- Extend to `"ac"`
- `"ac"` has been seen before? No
- Add `"ac"` to result, add `"ac"` to seen set
- Result: `["a", "b", "ac"]`, Seen: `{"a", "b", "ac"}`

**Step 4:** Start at index 4 with segment `"a"`

- `"a"` has been seen before? Yes
- Extend to `"ab"`
- `"ab"` has been seen before? No
- Add `"ab"` to result, add `"ab"` to seen set
- Result: `["a", "b", "ac", "ab"]`, Seen: `{"a", "b", "ac", "ab"}`

**Step 5:** Start at index 6 with segment `"a"`

- `"a"` has been seen before? Yes
- Extend to `"a"` (end of string)
- `"a"` has been seen before? Yes, but we're at the end
- Add `"a"` to result anyway (last segment)
- Result: `["a", "b", "ac", "ab", "a"]`

Final answer: `["a", "b", "ac", "ab", "a"]`

## Brute Force Approach

A naive approach would be to try all possible partitions and check if each segment is unique. For each position, we could try extending the segment by 1, 2, 3, ... characters, checking if the substring has been seen before. This would involve:

1. Starting from index 0
2. Trying all possible segment lengths from 1 to remaining length
3. For each candidate segment, checking if it exists in all previously seen segments
4. Recursively trying the next position

The problem with this approach is exponential time complexity. For a string of length `n`, there are `2^(n-1)` possible partitions. Checking each partition would require scanning through all previous segments for uniqueness, making this approach `O(n * 2^n)` in the worst case.

Even with memoization, this approach is inefficient because we're doing redundant work. We keep re-checking the same substrings against the same set of seen segments.

## Optimized Approach

The key insight is that we can build segments greedily while maintaining a set of seen segments. Since we must take the shortest unique segment at each step (we stop as soon as we find a unique segment), we don't need to consider multiple possibilities.

Here's the step-by-step reasoning:

1. **Greedy is optimal**: At each position, the shortest unique segment is always the right choice. Why? If we take a longer segment, we might miss opportunities to create unique segments earlier, potentially leading to invalid partitions later.

2. **Use a hash set for O(1) lookups**: We need to quickly check if a segment has been seen before. A hash set gives us average O(1) time for both insertion and lookup.

3. **Incremental building**: Instead of checking all possible segment lengths, we build the segment character by character. This is more efficient because we stop as soon as we find a unique segment.

4. **Handle the last segment specially**: When we reach the end of the string, we must add whatever segment we've built, even if it's been seen before.

The algorithm works like this:

- Initialize an empty set to track seen segments
- Initialize an empty list for results
- Start with an empty current segment
- For each character in the string:
  - Add the character to the current segment
  - Check if the current segment is in the seen set
  - If not, add it to results, add it to the seen set, and reset current segment
- After the loop, if there's any remaining segment, add it to results

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(n) for storing the result and seen segments
def partitionString(s: str):
    """
    Partitions a string into unique segments using greedy approach.

    Args:
        s: Input string to partition

    Returns:
        List of unique segments
    """
    seen = set()        # Track segments we've already seen
    result = []         # Store the final partition
    current = ""        # Current segment being built

    for char in s:
        # Add current character to the segment we're building
        current += char

        # Check if this segment is unique (not seen before)
        if current not in seen:
            # Found a unique segment - add it to results
            result.append(current)
            # Mark this segment as seen for future reference
            seen.add(current)
            # Reset to start building next segment
            current = ""

    # Handle the last segment if there's anything left
    # This happens when the last character completes a segment
    # that has already been seen, but we still need to include it
    if current:
        result.append(current)

    return result
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(n) for storing the result and seen segments
function partitionString(s) {
  /**
   * Partitions a string into unique segments using greedy approach.
   *
   * @param {string} s - Input string to partition
   * @return {string[]} List of unique segments
   */
  const seen = new Set(); // Track segments we've already seen
  const result = []; // Store the final partition
  let current = ""; // Current segment being built

  for (let i = 0; i < s.length; i++) {
    // Add current character to the segment we're building
    current += s[i];

    // Check if this segment is unique (not seen before)
    if (!seen.has(current)) {
      // Found a unique segment - add it to results
      result.push(current);
      // Mark this segment as seen for future reference
      seen.add(current);
      // Reset to start building next segment
      current = "";
    }
  }

  // Handle the last segment if there's anything left
  // This happens when the last character completes a segment
  // that has already been seen, but we still need to include it
  if (current) {
    result.push(current);
  }

  return result;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(n) for storing the result and seen segments
import java.util.*;

public class Solution {
    public List<String> partitionString(String s) {
        /**
         * Partitions a string into unique segments using greedy approach.
         *
         * @param s Input string to partition
         * @return List of unique segments
         */
        Set<String> seen = new HashSet<>();  // Track segments we've already seen
        List<String> result = new ArrayList<>();  // Store the final partition
        StringBuilder current = new StringBuilder();  // Current segment being built

        for (int i = 0; i < s.length(); i++) {
            // Add current character to the segment we're building
            current.append(s.charAt(i));

            // Check if this segment is unique (not seen before)
            if (!seen.contains(current.toString())) {
                // Found a unique segment - add it to results
                result.add(current.toString());
                // Mark this segment as seen for future reference
                seen.add(current.toString());
                // Reset to start building next segment
                current = new StringBuilder();
            }
        }

        // Handle the last segment if there's anything left
        // This happens when the last character completes a segment
        // that has already been seen, but we still need to include it
        if (current.length() > 0) {
            result.add(current.toString());
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through each character of the string exactly once: O(n)
- For each character, we perform a hash set lookup and potentially an insertion: O(1) average case
- String concatenation in Python/JavaScript is O(k) where k is the length of the segment, but amortized over all operations, this still gives us O(n) total
- In Java, StringBuilder append is O(1) per character

**Space Complexity: O(n)**

- The result list stores all segments, which together contain all characters of the string: O(n)
- The hash set stores all unique segments, which also contain all characters: O(n)
- In the worst case, each character is its own segment, so we store n segments of length 1

## Common Mistakes

1. **Forgetting to handle the last segment**: Many candidates forget that when they reach the end of the string, they need to add whatever segment they've built, even if it's been seen before. The problem requires partitioning the entire string, so the last segment must be included regardless of uniqueness.

2. **Using a list instead of a set for seen segments**: Checking if a segment exists in a list takes O(k) time where k is the number of segments. With a set, this is O(1) average case. Using a list could make your solution O(n²) in the worst case.

3. **Not resetting the current segment properly**: After finding a unique segment, you must reset the current segment to an empty string. Forgetting this means you keep extending the same segment indefinitely.

4. **Off-by-one errors with indices**: When building the segment character by character, it's easy to get confused about when to check for uniqueness. You should check after adding each character, not before.

## When You'll See This Pattern

This problem combines greedy algorithms with hash set lookups, a pattern that appears in many string processing problems:

1. **Word Break (LeetCode 139)**: Similar concept of partitioning a string, though with different constraints. You check if a string can be segmented into dictionary words.

2. **Partition Labels (LeetCode 763)**: Another partitioning problem where you need to maximize segment sizes based on character positions.

3. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses a similar sliding window approach with a hash set to track seen characters.

The core pattern is using a hash set for O(1) uniqueness checks while processing a sequence incrementally. This is especially useful when you need to make decisions based on whether you've seen something before.

## Key Takeaways

1. **Greedy with validation works**: When you need to partition a sequence with constraints, often the greedy approach (take the smallest valid piece at each step) is optimal if you can validate each piece efficiently.

2. **Hash sets enable efficient uniqueness checks**: Whenever you need to track what you've seen before and make decisions based on that, a hash set is usually the right tool for O(1) lookups.

3. **Incremental building beats exhaustive search**: Instead of trying all possible partitions, build segments incrementally and make decisions at each step. This often reduces exponential problems to linear or polynomial time.

[Practice this problem on CodeJeet](/problem/partition-string)
