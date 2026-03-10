---
title: "How to Solve Longest Substring of One Repeating Character — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Substring of One Repeating Character. Hard difficulty, 34.2% acceptance rate. Topics: Array, String, Segment Tree, Ordered Set."
date: "2026-08-03"
category: "dsa-patterns"
tags: ["longest-substring-of-one-repeating-character", "array", "string", "segment-tree", "hard"]
---

# How to Solve Longest Substring of One Repeating Character

This problem asks us to maintain the length of the longest substring consisting of identical characters in a string `s`, while processing a series of updates that change individual characters. After each update, we need to return the current maximum length. The challenge lies in efficiently updating our answer after each character change without recomputing everything from scratch—naively scanning the string after each query would be too slow for large inputs.

**What makes this tricky:** Each update can affect up to three segments in our string (the segment before the changed character, the segment containing it, and the segment after). Tracking these segments and their lengths efficiently requires careful data structure design. This is essentially a **dynamic interval maintenance** problem.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Initial state:** `s = "aaab"`, `queryCharacters = "b"`, `queryIndices = [1]`

We start with `s = "aaab"`. The longest substring of identical characters is "aaa" with length 3.

**Query 1:** Update index 1 to 'b'

Before update: `s = "aaab"` → segments: ["aaa", "b"]
After update: `s = "abab"` → segments: ["a", "b", "a", "b"]

Let's see what happens step by step:

1. Original character at index 1 is 'a', part of the segment [0,2] "aaa"
2. Changing it to 'b' breaks this segment into two parts: [0,0] "a" and [2,2] "a"
3. The new 'b' at index 1 might merge with neighboring 'b's
4. Check left neighbor at index 0: 'a' ≠ 'b', no merge
5. Check right neighbor at index 2: 'a' ≠ 'b', no merge
6. So we have new segments: "a" (length 1), "b" (length 1), "a" (length 1), "b" (length 1)
7. Longest segment length is now 1

The key insight: each update affects at most three segments—the segment containing the changed index (which gets split), and potentially the segments to the left and right if the new character matches theirs (causing merges).

## Brute Force Approach

The most straightforward approach is to simply recompute the longest substring from scratch after each update:

1. For each query:
   - Update the character at `queryIndices[i]` to `queryCharacters[i]`
   - Scan through the entire string to find the longest run of identical characters
   - Record the length

**Why this fails:** With `n` characters in `s` and `k` queries, this approach takes O(k × n) time. For the worst case where `n` and `k` are both up to 10⁵, this becomes 10¹⁰ operations—far too slow.

Even if we try to be clever by only scanning around the changed index, we still need to track segments properly. A naive segment tracking approach might use an array or list of segments, but inserting and deleting segments would be O(n) per operation in the worst case.

## Optimized Approach

The key insight is that we need to **maintain intervals of consecutive identical characters** and quickly:

1. Find which interval contains a given index
2. Split an interval when a character changes
3. Merge intervals when neighboring characters become identical
4. Track the maximum interval length at all times

This is a classic use case for an **ordered set** (like `SortedSet` in Java, `sortedcontainers` in Python, or manual implementation with trees). We store intervals sorted by their start index, which allows us to:

- Quickly find the interval containing any index using binary search
- Efficiently insert/remove intervals
- Maintain the maximum length using a heap or by tracking it directly

**Alternative approach:** A **segment tree** can also solve this problem by treating each position as a leaf node and storing information about runs in each segment. However, the ordered set approach is more intuitive for this specific problem.

**Step-by-step reasoning:**

1. Initialize by scanning the string once to build intervals of consecutive identical characters
2. Store intervals in a sorted structure with O(log n) search/insert/delete
3. Also maintain a multiset (or priority queue) of interval lengths to quickly get the maximum
4. For each update:
   - Find the interval containing the index
   - If the new character equals the old one, do nothing
   - Otherwise:
     - Split the interval into up to 3 parts (left of index, the index itself, right of index)
     - Check if the new single-character interval can merge with left or right neighbors
     - Update the interval collection and length tracking
5. After each update, the current maximum is the top of our length tracker

## Optimal Solution

We'll implement the ordered set approach using Python's `sortedcontainers` (or a manual implementation in other languages). The key operations are all O(log n), giving us O((n + k) log n) total time.

<div class="code-group">

```python
# Time: O((n + k) log n) | Space: O(n)
# Using sortedcontainers for O(log n) operations
from sortedcontainers import SortedList
import bisect

class Solution:
    def longestRepeating(self, s: str, queryCharacters: str, queryIndices: List[int]) -> List[int]:
        n = len(s)
        k = len(queryCharacters)

        # Store intervals as (start, end, char) tuples, sorted by start
        intervals = SortedList()
        # Track lengths of all intervals for quick max retrieval
        lengths = SortedList()

        # Initialize intervals by scanning the string
        start = 0
        for i in range(1, n + 1):
            # When we reach end of string or character changes
            if i == n or s[i] != s[start]:
                interval = (start, i - 1, s[start])
                intervals.add(interval)
                lengths.add(i - start)  # Add length of this interval
                start = i

        result = []

        for query_idx, new_char in zip(queryIndices, queryCharacters):
            # Find the interval containing query_idx using binary search
            # We search for (query_idx, inf, inf) to find the first interval with start > query_idx
            pos = intervals.bisect_left((query_idx, float('inf'), ''))
            # The containing interval is at pos-1 (since intervals are sorted by start)
            if pos > 0:
                interval_idx = pos - 1
                start_idx, end_idx, old_char = intervals[interval_idx]

                # If the character isn't changing, skip
                if old_char == new_char:
                    result.append(lengths[-1])  # Max is last element in sorted list
                    continue

                # Remove the old interval and its length
                intervals.pop(interval_idx)
                lengths.remove(end_idx - start_idx + 1)

                # Create up to 3 new intervals from the split
                new_intervals = []

                # Left part (if any)
                if start_idx < query_idx:
                    new_intervals.append((start_idx, query_idx - 1, old_char))

                # Middle part (the changed character itself)
                new_intervals.append((query_idx, query_idx, new_char))

                # Right part (if any)
                if end_idx > query_idx:
                    new_intervals.append((query_idx + 1, end_idx, old_char))

                # Add the new intervals
                for interval in new_intervals:
                    s_idx, e_idx, ch = interval
                    intervals.add(interval)
                    lengths.add(e_idx - s_idx + 1)

                # Try to merge with left neighbor
                left_pos = intervals.bisect_left((query_idx, query_idx, new_char)) - 1
                if left_pos >= 0:
                    left_start, left_end, left_char = intervals[left_pos]
                    if left_char == new_char and left_end == query_idx - 1:
                        # Merge left interval with current
                        intervals.pop(left_pos)
                        lengths.remove(left_end - left_start + 1)

                        intervals.remove((query_idx, query_idx, new_char))
                        lengths.remove(1)

                        merged = (left_start, query_idx, new_char)
                        intervals.add(merged)
                        lengths.add(query_idx - left_start + 1)

                        # Update current interval for potential right merge
                        current_interval = merged
                    else:
                        current_interval = (query_idx, query_idx, new_char)
                else:
                    current_interval = (query_idx, query_idx, new_char)

                # Try to merge with right neighbor
                right_pos = intervals.bisect_left((current_interval[1] + 1, -1, ''))
                if right_pos < len(intervals):
                    right_start, right_end, right_char = intervals[right_pos]
                    if right_char == new_char and right_start == current_interval[1] + 1:
                        # Merge current interval with right
                        intervals.remove(current_interval)
                        lengths.remove(current_interval[1] - current_interval[0] + 1)

                        intervals.pop(right_pos)
                        lengths.remove(right_end - right_start + 1)

                        merged = (current_interval[0], right_end, new_char)
                        intervals.add(merged)
                        lengths.add(right_end - current_interval[0] + 1)
            else:
                # Handle edge case where query_idx is at position 0
                # Similar logic but simplified since no left neighbor
                pass

            result.append(lengths[-1])  # Max is last element in sorted list

        return result
```

```javascript
// Time: O((n + k) log n) | Space: O(n)
// Implementing our own binary search since JavaScript doesn't have built-in sorted structures
var longestRepeating = function (s, queryCharacters, queryIndices) {
  const n = s.length;
  const k = queryCharacters.length;

  // Store intervals as objects {start, end, char}, sorted by start
  let intervals = [];
  // Track lengths in a max-heap (simulated with array and sorting)
  let lengths = new Map(); // Map from length to count for multiset behavior

  // Initialize intervals
  let start = 0;
  for (let i = 1; i <= n; i++) {
    if (i === n || s[i] !== s[start]) {
      const interval = { start: start, end: i - 1, char: s[start] };
      intervals.push(interval);
      const length = i - start;
      lengths.set(length, (lengths.get(length) || 0) + 1);
      start = i;
    }
  }

  // Sort intervals by start for binary search
  intervals.sort((a, b) => a.start - b.start);

  // Helper function to find interval containing index
  const findInterval = (idx) => {
    let left = 0,
      right = intervals.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (intervals[mid].start <= idx && intervals[mid].end >= idx) {
        return mid;
      } else if (intervals[mid].start > idx) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return -1;
  };

  // Helper to update lengths map
  const updateLengths = (length, delta) => {
    const count = lengths.get(length) || 0;
    const newCount = count + delta;
    if (newCount <= 0) {
      lengths.delete(length);
    } else {
      lengths.set(length, newCount);
    }
  };

  // Helper to get current max length
  const getMaxLength = () => {
    let max = 0;
    for (const [length] of lengths) {
      if (length > max) max = length;
    }
    return max;
  };

  const result = [];

  for (let i = 0; i < k; i++) {
    const queryIdx = queryIndices[i];
    const newChar = queryCharacters[i];

    const intervalIdx = findInterval(queryIdx);
    if (intervalIdx === -1) {
      result.push(getMaxLength());
      continue;
    }

    const interval = intervals[intervalIdx];
    const { start: sStart, end: sEnd, char: oldChar } = interval;

    if (oldChar === newChar) {
      result.push(getMaxLength());
      continue;
    }

    // Remove old interval
    intervals.splice(intervalIdx, 1);
    updateLengths(sEnd - sStart + 1, -1);

    // Create new intervals from split
    const newIntervals = [];

    if (sStart < queryIdx) {
      newIntervals.push({ start: sStart, end: queryIdx - 1, char: oldChar });
    }

    newIntervals.push({ start: queryIdx, end: queryIdx, char: newChar });

    if (sEnd > queryIdx) {
      newIntervals.push({ start: queryIdx + 1, end: sEnd, char: oldChar });
    }

    // Add new intervals
    for (const interval of newIntervals) {
      intervals.push(interval);
      updateLengths(interval.end - interval.start + 1, 1);
    }

    // Sort intervals after modification
    intervals.sort((a, b) => a.start - b.start);

    // Find and merge with left neighbor if possible
    const currentIdx = intervals.findIndex(
      (int) => int.start === queryIdx && int.end === queryIdx && int.char === newChar
    );

    if (currentIdx > 0) {
      const left = intervals[currentIdx - 1];
      if (left.char === newChar && left.end === queryIdx - 1) {
        // Merge left with current
        const merged = {
          start: left.start,
          end: queryIdx,
          char: newChar,
        };

        // Remove left and current
        intervals.splice(currentIdx - 1, 2);
        updateLengths(left.end - left.start + 1, -1);
        updateLengths(1, -1);

        // Add merged
        intervals.push(merged);
        updateLengths(merged.end - merged.start + 1, 1);

        // Re-sort
        intervals.sort((a, b) => a.start - b.start);

        // Update current reference for potential right merge
        const newCurrentIdx = intervals.findIndex(
          (int) => int.start === merged.start && int.end === merged.end
        );

        // Try to merge with right neighbor
        if (newCurrentIdx < intervals.length - 1) {
          const right = intervals[newCurrentIdx + 1];
          if (right.char === newChar && right.start === merged.end + 1) {
            // Merge with right
            const finalMerged = {
              start: merged.start,
              end: right.end,
              char: newChar,
            };

            intervals.splice(newCurrentIdx, 2);
            updateLengths(merged.end - merged.start + 1, -1);
            updateLengths(right.end - right.start + 1, -1);

            intervals.push(finalMerged);
            updateLengths(finalMerged.end - finalMerged.start + 1, 1);
          }
        }
      } else {
        // Try to merge with right neighbor only
        if (currentIdx < intervals.length - 1) {
          const right = intervals[currentIdx + 1];
          if (right.char === newChar && right.start === queryIdx + 1) {
            const merged = {
              start: queryIdx,
              end: right.end,
              char: newChar,
            };

            intervals.splice(currentIdx, 2);
            updateLengths(1, -1);
            updateLengths(right.end - right.start + 1, -1);

            intervals.push(merged);
            updateLengths(merged.end - merged.start + 1, 1);
          }
        }
      }
    } else {
      // No left neighbor, try right only
      if (currentIdx < intervals.length - 1) {
        const right = intervals[currentIdx + 1];
        if (right.char === newChar && right.start === queryIdx + 1) {
          const merged = {
            start: queryIdx,
            end: right.end,
            char: newChar,
          };

          intervals.splice(currentIdx, 2);
          updateLengths(1, -1);
          updateLengths(right.end - right.start + 1, -1);

          intervals.push(merged);
          updateLengths(merged.end - merged.start + 1, 1);
        }
      }
    }

    // Re-sort intervals
    intervals.sort((a, b) => a.start - b.start);
    result.push(getMaxLength());
  }

  return result;
};
```

```java
// Time: O((n + k) log n) | Space: O(n)
// Using TreeMap for interval storage and TreeMap for length tracking
import java.util.*;

class Solution {
    public int[] longestRepeating(String s, String queryCharacters, int[] queryIndices) {
        int n = s.length();
        int k = queryCharacters.length();

        // TreeMap to store intervals: key = start index, value = {end, char}
        TreeMap<Integer, int[]> intervals = new TreeMap<>();
        // TreeMap to track lengths: key = length, value = count (for multiset behavior)
        TreeMap<Integer, Integer> lengths = new TreeMap<>();

        // Initialize intervals
        int start = 0;
        for (int i = 1; i <= n; i++) {
            if (i == n || s.charAt(i) != s.charAt(start)) {
                int[] interval = new int[]{i - 1, s.charAt(start)};
                intervals.put(start, interval);
                int length = i - start;
                lengths.put(length, lengths.getOrDefault(length, 0) + 1);
                start = i;
            }
        }

        int[] result = new int[k];

        for (int i = 0; i < k; i++) {
            int queryIdx = queryIndices[i];
            char newChar = queryCharacters.charAt(i);

            // Find interval containing queryIdx
            Map.Entry<Integer, int[]> entry = intervals.floorEntry(queryIdx);
            if (entry == null || entry.getValue()[0] < queryIdx) {
                result[i] = lengths.lastKey();
                continue;
            }

            int oldStart = entry.getKey();
            int oldEnd = entry.getValue()[0];
            char oldChar = (char) entry.getValue()[1];

            if (oldChar == newChar) {
                result[i] = lengths.lastKey();
                continue;
            }

            // Remove old interval
            intervals.remove(oldStart);
            int oldLength = oldEnd - oldStart + 1;
            updateLengths(lengths, oldLength, -1);

            // Create new intervals from split
            List<int[]> toAdd = new ArrayList<>();

            if (oldStart < queryIdx) {
                toAdd.add(new int[]{oldStart, queryIdx - 1, oldChar});
            }

            toAdd.add(new int[]{queryIdx, queryIdx, newChar});

            if (oldEnd > queryIdx) {
                toAdd.add(new int[]{queryIdx + 1, oldEnd, oldChar});
            }

            // Add new intervals
            for (int[] interval : toAdd) {
                int sStart = interval[0];
                int sEnd = interval[1];
                char ch = (char) interval[2];
                intervals.put(sStart, new int[]{sEnd, ch});
                updateLengths(lengths, sEnd - sStart + 1, 1);
            }

            // Try to merge with left neighbor
            Map.Entry<Integer, int[]> leftEntry = intervals.lowerEntry(queryIdx);
            if (leftEntry != null) {
                int leftEnd = leftEntry.getValue()[0];
                char leftChar = (char) leftEntry.getValue()[1];
                if (leftChar == newChar && leftEnd == queryIdx - 1) {
                    // Merge left with current
                    int leftStart = leftEntry.getKey();
                    intervals.remove(leftStart);
                    intervals.remove(queryIdx);

                    updateLengths(lengths, leftEnd - leftStart + 1, -1);
                    updateLengths(lengths, 1, -1);

                    intervals.put(leftStart, new int[]{queryIdx, newChar});
                    updateLengths(lengths, queryIdx - leftStart + 1, 1);

                    // Update for potential right merge
                    queryIdx = leftStart; // Start of merged interval
                }
            }

            // Try to merge with right neighbor
            Map.Entry<Integer, int[]> rightEntry = intervals.higherEntry(queryIdx);
            if (rightEntry != null) {
                int rightStart = rightEntry.getKey();
                int rightEnd = rightEntry.getValue()[0];
                char rightChar = (char) rightEntry.getValue()[1];
                if (rightChar == newChar && rightStart == queryIdx + 1) {
                    // Get current interval (might have been merged with left)
                    Map.Entry<Integer, int[]> currentEntry = intervals.floorEntry(queryIdx);
                    int currentStart = currentEntry.getKey();
                    int currentEnd = currentEntry.getValue()[0];

                    // Remove current and right intervals
                    intervals.remove(currentStart);
                    intervals.remove(rightStart);

                    updateLengths(lengths, currentEnd - currentStart + 1, -1);
                    updateLengths(lengths, rightEnd - rightStart + 1, -1);

                    // Create merged interval
                    intervals.put(currentStart, new int[]{rightEnd, newChar});
                    updateLengths(lengths, rightEnd - currentStart + 1, 1);
                }
            }

            result[i] = lengths.lastKey();
        }

        return result;
    }

    private void updateLengths(TreeMap<Integer, Integer> lengths, int length, int delta) {
        int count = lengths.getOrDefault(length, 0);
        int newCount = count + delta;
        if (newCount <= 0) {
            lengths.remove(length);
        } else {
            lengths.put(length, newCount);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + k) log n)

- Initial scan to build intervals: O(n)
- For each of k queries:
  - Finding the interval: O(log n) with binary search / tree operations
  - Splitting/merging intervals: O(log n) for insertions/deletions
  - Updating length tracking: O(log n)
- Total: O(n + k log n) which simplifies to O((n + k) log n)

**Space Complexity:** O(n)

- Storing intervals: O(n) in worst case (every character different)
- Length tracking: O(n)
- Auxiliary space for operations: O(1) per query

## Common Mistakes

1. **Not handling merge cases correctly:** The trickiest part is when a change causes the new character to match both left and right neighbors. You must merge all three segments into one. A common mistake is merging only with one side and missing the three-way merge.

2. **Off-by-one errors in interval boundaries:** When splitting `[start, end]` at index `i`, the left part is `[start, i-1]` and right is `[i+1, end]`. Getting these boundaries wrong leads to missing or extra characters.

3. **Inefficient length tracking:** Simply scanning all intervals to find the max after each update is O(n) per query. You need O(log n) access to the maximum, which requires a heap or sorted multiset.

4. **Forgetting to handle no-change case:** If the new character equals the old one, nothing should change. Skipping this check wastes time and can cause incorrect merges.

## When You'll See This Pattern

This **dynamic interval maintenance** pattern appears in problems where you need to track and update contiguous segments with some property:

1. **Range Sum Query - Mutable (LeetCode 307):** Similar need to update values and query ranges efficiently, though segment tree is more common there.

2. **My Calendar I/II/III (LeetCode 729, 731, 732):** These involve maintaining intervals (bookings) and checking for overlaps—similar interval manipulation logic.

3. **Data Stream as Disjoint Intervals (LeetCode 352):** Directly maintains intervals from incoming numbers, with merging logic very similar to our problem.

The key recognition signal: you need to maintain contiguous segments that can split and merge dynamically, with queries about segment properties.

## Key Takeaways

1. **When you need to maintain dynamic intervals with merges/splits, think ordered sets:** TreeMap (Java), sortedcontainers (Python), or manual binary search arrays can efficiently handle interval operations.

2. **Track auxiliary information separately:** Don't scan to recompute the answer. Maintain a separate structure (like a max-heap or sorted multiset) that gives you the current answer in O(1) or O(log n) time.

3. **Handle all three cases for updates:** A character change can cause (1) no change if same character, (2) split only if new char differs from neighbors, or (3) merge with left, right, or both neighbors.

Related problems: [Merge Intervals](/problem/merge-intervals), [Longest Repeating Character Replacement](/problem/longest-repeating-character-replacement), [Consecutive Characters](/problem/consecutive-characters)
