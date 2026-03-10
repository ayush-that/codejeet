---
title: "How to Solve Maximum Number of Non-Overlapping Substrings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Non-Overlapping Substrings. Hard difficulty, 41.5% acceptance rate. Topics: Hash Table, String, Greedy, Sorting."
date: "2029-08-27"
category: "dsa-patterns"
tags: ["maximum-number-of-non-overlapping-substrings", "hash-table", "string", "greedy", "hard"]
---

# How to Solve Maximum Number of Non-Overlapping Substrings

This problem asks us to find the maximum number of non-overlapping substrings from a given string, where each substring must contain all occurrences of every character within it. The tricky part is that substrings must be "valid" - if a character appears in a substring, then all occurrences of that character in the entire string must also be within that substring. This creates dependencies between characters that make finding non-overlapping substrings challenging.

## Visual Walkthrough

Let's trace through an example: `s = "abab"`

**Step 1: Find character ranges**
First, we need to know where each character appears in the string:

- 'a': first at index 0, last at index 2 → range [0, 2]
- 'b': first at index 1, last at index 3 → range [1, 3]

**Step 2: Expand ranges**
Now we need to ensure each range contains all characters within it. Starting with 'a' range [0, 2]:

- Check characters between 0 and 2: 'a' at 0, 'b' at 1, 'a' at 2
- 'b' has range [1, 3], which extends beyond our current end (2)
- We must expand to include all of 'b's range, so new range becomes [0, 3]

**Step 3: Check expanded range**
Now check [0, 3]:

- Characters: 'a', 'b', 'a', 'b'
- 'a' range [0, 2] is within [0, 3] ✓
- 'b' range [1, 3] is within [0, 3] ✓
  So [0, 3] is a valid substring.

**Step 4: Find non-overlapping substrings**
Since [0, 3] covers the entire string, we can only have 1 valid substring. The answer is 1.

Let's try another example: `s = "adefaddaccc"`

**Step 1: Character ranges:**

- 'a': [0, 7]
- 'd': [1, 4]
- 'e': [2, 2]
- 'f': [3, 3]
- 'c': [8, 10]

**Step 2: Expand from leftmost character 'a' [0, 7]:**

- Check characters in [0, 7]: includes 'd' (range [1, 4]), 'e' ([2, 2]), 'f' ([3, 3])
- All these ranges are within [0, 7], so [0, 7] is valid

**Step 3: Check remaining characters after [0, 7]:**

- Remaining: 'c' at [8, 10]
- 'c' range [8, 10] is valid on its own

**Step 4: Result:**
We have two non-overlapping valid substrings: [0, 7] and [8, 10]

## Brute Force Approach

A naive approach would be to generate all possible substrings and check which ones are valid, then try to find the maximum number of non-overlapping valid substrings. Here's what that might look like:

1. Generate all O(n²) possible substrings
2. For each substring, check if it's valid (contains all occurrences of every character within it)
3. From all valid substrings, try to find the maximum number that don't overlap

The problem with this approach is the combinatorial explosion. Even if we could efficiently check validity, finding the maximum non-overlapping set from O(n²) substrings is NP-hard (similar to interval scheduling but with dependencies between intervals). For a string of length 10⁵, this is completely infeasible.

## Optimized Approach

The key insight is that we can think of this as an **interval expansion problem**:

1. **First, find the first and last occurrence of each character** - this gives us initial ranges.

2. **Expand each range to be valid** - if a range contains character X, it must include X's entire range. This may cause the range to expand further, potentially including more characters that need their ranges included.

3. **Greedily select valid intervals** - Once we have valid intervals, we can use a greedy approach: always pick the interval that ends the earliest and doesn't overlap with previously selected intervals. This works because if we have a set of non-overlapping intervals, picking the one that ends earliest leaves the most room for others.

The tricky part is that intervals aren't independent - expanding one interval might make it overlap with or even contain another. We need to be careful about how we generate and select intervals.

## Optimal Solution

The solution has three main steps:

1. **Find character ranges**: Record the first and last occurrence of each character.
2. **Expand intervals**: For each character, try to create a valid interval starting at its first occurrence. Expand rightwards to include all characters within the current range.
3. **Select non-overlapping intervals**: Sort valid intervals by their end point and greedily select non-overlapping ones.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) since we only store 26 characters' ranges
def maxNumOfSubstrings(s: str):
    # Step 1: Find first and last occurrence of each character
    first = {c: len(s) for c in 'abcdefghijklmnopqrstuvwxyz'}
    last = {c: -1 for c in 'abcdefghijklmnopqrstuvwxyz'}

    for i, char in enumerate(s):
        first[char] = min(first[char], i)
        last[char] = max(last[char], i)

    # Step 2: Expand intervals to make them valid
    intervals = []

    for c in 'abcdefghijklmnopqrstuvwxyz':
        if first[c] <= last[c]:  # Character exists in string
            start = first[c]
            end = last[c]

            # Expand the interval to include all characters within it
            i = start
            while i <= end:
                # If we find a character whose range extends beyond current end,
                # we need to expand our interval
                if first[s[i]] < start:
                    # This would make interval invalid, break
                    end = len(s)  # Mark as invalid
                    break
                end = max(end, last[s[i]])
                i += 1

            # If we successfully created a valid interval, add it
            if end < len(s):
                intervals.append((start, end))

    # Step 3: Sort intervals by end point and select non-overlapping ones
    intervals.sort(key=lambda x: x[1])  # Sort by end point

    result = []
    prev_end = -1

    for start, end in intervals:
        # Check if this interval doesn't overlap with previous one
        if start > prev_end:
            result.append(s[start:end+1])
            prev_end = end

    return result
```

```javascript
// Time: O(n) | Space: O(1) since we only store 26 characters' ranges
function maxNumOfSubstrings(s) {
  // Step 1: Find first and last occurrence of each character
  const first = new Array(26).fill(s.length);
  const last = new Array(26).fill(-1);

  for (let i = 0; i < s.length; i++) {
    const idx = s.charCodeAt(i) - 97; // 'a' = 97
    first[idx] = Math.min(first[idx], i);
    last[idx] = Math.max(last[idx], i);
  }

  // Step 2: Expand intervals to make them valid
  const intervals = [];

  for (let c = 0; c < 26; c++) {
    if (first[c] <= last[c]) {
      // Character exists in string
      let start = first[c];
      let end = last[c];
      let valid = true;

      // Expand the interval to include all characters within it
      for (let i = start; i <= end; i++) {
        const charIdx = s.charCodeAt(i) - 97;

        // If a character starts before our current start,
        // this interval cannot be valid
        if (first[charIdx] < start) {
          valid = false;
          break;
        }
        // Expand end if needed
        end = Math.max(end, last[charIdx]);
      }

      // If we successfully created a valid interval, add it
      if (valid) {
        intervals.push([start, end]);
      }
    }
  }

  // Step 3: Sort intervals by end point and select non-overlapping ones
  intervals.sort((a, b) => a[1] - b[1]);

  const result = [];
  let prevEnd = -1;

  for (const [start, end] of intervals) {
    // Check if this interval doesn't overlap with previous one
    if (start > prevEnd) {
      result.push(s.substring(start, end + 1));
      prevEnd = end;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) since we only store 26 characters' ranges
import java.util.*;

class Solution {
    public List<String> maxNumOfSubstrings(String s) {
        // Step 1: Find first and last occurrence of each character
        int[] first = new int[26];
        int[] last = new int[26];
        Arrays.fill(first, s.length());
        Arrays.fill(last, -1);

        for (int i = 0; i < s.length(); i++) {
            int idx = s.charAt(i) - 'a';
            first[idx] = Math.min(first[idx], i);
            last[idx] = Math.max(last[idx], i);
        }

        // Step 2: Expand intervals to make them valid
        List<int[]> intervals = new ArrayList<>();

        for (int c = 0; c < 26; c++) {
            if (first[c] <= last[c]) {  // Character exists in string
                int start = first[c];
                int end = last[c];
                boolean valid = true;

                // Expand the interval to include all characters within it
                for (int i = start; i <= end; i++) {
                    int charIdx = s.charAt(i) - 'a';

                    // If a character starts before our current start,
                    // this interval cannot be valid
                    if (first[charIdx] < start) {
                        valid = false;
                        break;
                    }
                    // Expand end if needed
                    end = Math.max(end, last[charIdx]);
                }

                // If we successfully created a valid interval, add it
                if (valid) {
                    intervals.add(new int[]{start, end});
                }
            }
        }

        // Step 3: Sort intervals by end point and select non-overlapping ones
        intervals.sort((a, b) -> Integer.compare(a[1], b[1]));

        List<String> result = new ArrayList<>();
        int prevEnd = -1;

        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];

            // Check if this interval doesn't overlap with previous one
            if (start > prevEnd) {
                result.add(s.substring(start, end + 1));
                prevEnd = end;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding first and last occurrences: O(n) where n is string length
- Expanding intervals: Each character is processed at most twice (once when it's the starting character, and potentially once when expanding other intervals). Since there are only 26 possible characters, this is O(26 \* n) = O(n)
- Sorting intervals: We have at most 26 intervals, so sorting is O(26 log 26) = O(1)
- Total: O(n)

**Space Complexity: O(1)**

- We store first and last occurrences for 26 characters: O(26) = O(1)
- We store at most 26 intervals: O(1)
- The result list stores substrings, but this is output space not counted in space complexity

## Common Mistakes

1. **Not expanding intervals fully**: The most common mistake is to think that the initial [first, last] range for a character is already valid. You must check ALL characters within the current range and expand to include their entire ranges.

2. **Infinite expansion loops**: When expanding intervals, if character A needs character B, and character B needs character A, you could get stuck in a loop. The solution avoids this by checking if any character in the interval starts before our current start - if so, the interval is invalid.

3. **Wrong greedy selection**: After getting valid intervals, you might try to sort by start point or length. But for maximum non-overlapping intervals, you should always sort by end point and pick the earliest-ending valid interval.

4. **Forgetting to check interval validity during expansion**: When expanding an interval starting at position i, if you encounter a character whose first occurrence is before i, the interval cannot be valid starting at i. Some characters can only appear in intervals starting at their own first occurrence.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Interval scheduling with dependencies**: Similar to "Merge Intervals" (LeetCode 56) but with the twist that intervals aren't independent. Also related to "Non-overlapping Intervals" (LeetCode 435).

2. **Character range tracking**: Problems like "Partition Labels" (LeetCode 763) use similar first/last occurrence tracking. In fact, this problem is a more complex version of Partition Labels.

3. **Greedy selection with constraints**: The pattern of finding valid candidates then greedily selecting non-overlapping ones appears in problems like "Maximum Length of Pair Chain" (LeetCode 646).

The core technique of tracking character ranges and expanding intervals appears whenever you need to ensure all occurrences of elements are grouped together.

## Key Takeaways

1. **When dealing with "all occurrences must be together" constraints**, track first and last occurrences of each element. This gives you the minimum possible range for that element.

2. **Interval expansion with validation** is a powerful technique. Start with a candidate interval, then expand it to include all necessary elements, checking at each step if the expansion maintains validity.

3. **For maximum non-overlapping intervals**, the greedy approach of sorting by end point and selecting earliest-ending valid intervals is optimal. This works because selecting the interval that ends earliest leaves the most room for subsequent intervals.

Related problems: [Maximum Number of Non-overlapping Palindrome Substrings](/problem/maximum-number-of-non-overlapping-palindrome-substrings)
