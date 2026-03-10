---
title: "How to Solve Find Maximum Number of Non Intersecting Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Maximum Number of Non Intersecting Substrings. Medium difficulty, 30.4% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Greedy."
date: "2030-02-12"
category: "dsa-patterns"
tags:
  [
    "find-maximum-number-of-non-intersecting-substrings",
    "hash-table",
    "string",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Find Maximum Number of Non Intersecting Substrings

This problem asks us to find the maximum number of non-overlapping substrings in a given string where each substring is at least 4 characters long and starts and ends with the same letter. The challenge lies in efficiently finding valid substrings while ensuring they don't overlap, which requires careful selection to maximize the count.

**What makes this tricky:** We need to balance two constraints: 1) finding substrings that meet the length and same-letter requirements, and 2) selecting them in a way that maximizes count without overlaps. A greedy approach that simply takes every valid substring won't work because longer substrings might block multiple shorter ones.

## Visual Walkthrough

Let's trace through an example: `word = "abccbaabc"`

We need to find substrings where:

1. Length ≥ 4
2. First and last characters are the same
3. No overlaps between selected substrings

**Step 1: Identify potential substrings**

- Starting at index 0 ('a'): Look for ending 'a' with length ≥ 4
  - "abccbaa" (indices 0-6, length 7) ✓
  - "abccbaabc" (0-8, length 9) ✓
- Starting at index 1 ('b'): Look for ending 'b' with length ≥ 4
  - "bccbaab" (1-7, length 7) ✓
- Starting at index 2 ('c'): Look for ending 'c' with length ≥ 4
  - "ccbaabc" (2-8, length 7) ✓
- Starting at index 3 ('c'): Look for ending 'c' with length ≥ 4
  - "cbaabc" (3-8, length 6) ✓
- Starting at index 4 ('b'): Look for ending 'b' with length ≥ 4
  - "baab" (4-7, length 4) ✓
- Starting at index 5 ('a'): Look for ending 'a' with length ≥ 4
  - "aabc" (5-8, length 4) ✓

**Step 2: Find non-overlapping combinations**
We need to select the maximum number without overlaps:

- If we pick "abccbaa" (0-6), we can only add "aabc" (5-8) but they overlap (6 ≥ 5)
- If we pick "abccbaabc" (0-8), we can't add anything else
- Better: Pick "baab" (4-7) and "aabc" (5-8) but they overlap
- Best: Pick "bccbaab" (1-7) alone gives 1 substring
- Actually: Pick "cbaabc" (3-8) alone gives 1 substring
- Wait: "baab" (4-7) and... nothing else fits without overlap
- Actually: "abccbaa" (0-6) blocks everything
- Let's try: "baab" (4-7) gives 1, "aabc" (5-8) gives 1 but they overlap

The key insight: We need a systematic way to find the maximum non-overlapping set!

## Brute Force Approach

A naive approach would be:

1. Generate all possible substrings with length ≥ 4
2. Filter those where first and last characters match
3. Try all combinations of these substrings to find the maximum non-overlapping set

This brute force solution has exponential time complexity because for n valid substrings, there are 2ⁿ possible combinations to check. For a string of length 10,000, this is completely infeasible.

```python
# Brute force - too slow for large inputs
def maxSubstrings_brute(word):
    n = len(word)
    valid = []

    # Find all valid substrings
    for i in range(n):
        for j in range(i + 4, n):
            if word[i] == word[j]:
                valid.append((i, j))

    max_count = 0

    # Try all subsets (exponential!)
    for mask in range(1 << len(valid)):
        intervals = []
        valid_mask = True

        for k in range(len(valid)):
            if mask & (1 << k):
                i, j = valid[k]
                # Check if this interval overlaps with any already selected
                for start, end in intervals:
                    if not (j < start or i > end):
                        valid_mask = False
                        break
                if not valid_mask:
                    break
                intervals.append((i, j))

        if valid_mask:
            max_count = max(max_count, len(intervals))

    return max_count
```

**Why this fails:** With O(n²) substrings to check and exponential combinations to evaluate, this approach is only practical for very small strings (n < 20).

## Optimized Approach

The key insight is that this is essentially an **interval scheduling problem** with a twist: we need to generate the intervals first based on the substring constraints.

**Step-by-step reasoning:**

1. **Generate candidate intervals efficiently:** Instead of checking all O(n²) substrings, we can be smarter. For each starting position, we only need to find the first matching character that gives us length ≥ 4. But actually, we need to consider all ending positions for each starting character to maximize our options.

2. **Interval scheduling perspective:** Once we have valid intervals (start, end positions of valid substrings), we want to select the maximum number of non-overlapping intervals. This is a classic problem solvable with a greedy approach: sort by ending time and always pick the interval that ends earliest and doesn't conflict with previously selected ones.

3. **Optimization challenge:** The number of valid intervals could still be O(n²) in the worst case (if all characters are the same). We need to generate intervals more efficiently.

4. **Key optimization:** For each character, we only need to consider intervals between its first and last occurrence in the string, but we must ensure the substring is at least length 4. Actually, for a starting position i, we need to find all j ≥ i+3 where word[i] == word[j].

5. **Even better insight:** We can precompute for each character, all positions where it appears. Then for each starting position, we can quickly find valid ending positions by binary search.

6. **Greedy selection:** Once we have intervals, we sort them by end position and use the standard interval scheduling algorithm.

## Optimal Solution

The optimal solution uses:

1. A dictionary to map each character to all its positions
2. Generation of valid intervals using the position lists
3. Greedy interval scheduling to select maximum non-overlapping intervals

<div class="code-group">

```python
# Time: O(n²) in worst case, but O(n log n) average | Space: O(n)
def maxSubstrings(word):
    """
    Find maximum number of non-overlapping substrings where:
    1. Length >= 4
    2. First and last characters are the same
    """
    n = len(word)

    # Step 1: Build position map for each character
    # char -> list of indices where it appears
    pos_map = {}
    for i, ch in enumerate(word):
        if ch not in pos_map:
            pos_map[ch] = []
        pos_map[ch].append(i)

    # Step 2: Generate all valid intervals
    intervals = []

    # For each starting position
    for i in range(n):
        ch = word[i]
        positions = pos_map[ch]

        # Find all valid ending positions for this start
        # We need j >= i + 3 (length >= 4 means j-i+1 >= 4, so j >= i+3)
        # Use binary search to find the first valid position
        import bisect
        start_idx = bisect.bisect_left(positions, i + 3)

        # Add intervals for all valid ending positions
        for j_idx in range(start_idx, len(positions)):
            j = positions[j_idx]
            intervals.append((i, j))

    # Step 3: Sort intervals by end position (for greedy scheduling)
    intervals.sort(key=lambda x: x[1])

    # Step 4: Greedy interval scheduling
    count = 0
    last_end = -1  # End of last selected interval

    for start, end in intervals:
        # Check if this interval doesn't overlap with last selected
        if start > last_end:
            count += 1
            last_end = end

    return count
```

```javascript
// Time: O(n²) in worst case, but O(n log n) average | Space: O(n)
function maxSubstrings(word) {
  const n = word.length;

  // Step 1: Build position map for each character
  const posMap = new Map();
  for (let i = 0; i < n; i++) {
    const ch = word[i];
    if (!posMap.has(ch)) {
      posMap.set(ch, []);
    }
    posMap.get(ch).push(i);
  }

  // Step 2: Generate all valid intervals
  const intervals = [];

  // For each starting position
  for (let i = 0; i < n; i++) {
    const ch = word[i];
    const positions = posMap.get(ch);

    // Find all valid ending positions for this start
    // We need j >= i + 3 (length >= 4 means j-i+1 >= 4, so j >= i+3)
    // Use binary search to find the first valid position
    let left = 0,
      right = positions.length - 1;
    let firstValidIdx = positions.length;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (positions[mid] >= i + 3) {
        firstValidIdx = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Add intervals for all valid ending positions
    for (let idx = firstValidIdx; idx < positions.length; idx++) {
      const j = positions[idx];
      intervals.push([i, j]);
    }
  }

  // Step 3: Sort intervals by end position (for greedy scheduling)
  intervals.sort((a, b) => a[1] - b[1]);

  // Step 4: Greedy interval scheduling
  let count = 0;
  let lastEnd = -1; // End of last selected interval

  for (const [start, end] of intervals) {
    // Check if this interval doesn't overlap with last selected
    if (start > lastEnd) {
      count++;
      lastEnd = end;
    }
  }

  return count;
}
```

```java
// Time: O(n²) in worst case, but O(n log n) average | Space: O(n)
import java.util.*;

public class Solution {
    public int maxSubstrings(String word) {
        int n = word.length();

        // Step 1: Build position map for each character
        Map<Character, List<Integer>> posMap = new HashMap<>();
        for (int i = 0; i < n; i++) {
            char ch = word.charAt(i);
            posMap.putIfAbsent(ch, new ArrayList<>());
            posMap.get(ch).add(i);
        }

        // Step 2: Generate all valid intervals
        List<int[]> intervals = new ArrayList<>();

        // For each starting position
        for (int i = 0; i < n; i++) {
            char ch = word.charAt(i);
            List<Integer> positions = posMap.get(ch);

            // Find all valid ending positions for this start
            // We need j >= i + 3 (length >= 4 means j-i+1 >= 4, so j >= i+3)
            // Use binary search to find the first valid position
            int firstValidIdx = Collections.binarySearch(positions, i + 3);
            if (firstValidIdx < 0) {
                firstValidIdx = -firstValidIdx - 1;
            }

            // Add intervals for all valid ending positions
            for (int idx = firstValidIdx; idx < positions.size(); idx++) {
                int j = positions.get(idx);
                intervals.add(new int[]{i, j});
            }
        }

        // Step 3: Sort intervals by end position (for greedy scheduling)
        intervals.sort((a, b) -> Integer.compare(a[1], b[1]));

        // Step 4: Greedy interval scheduling
        int count = 0;
        int lastEnd = -1;  // End of last selected interval

        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];

            // Check if this interval doesn't overlap with last selected
            if (start > lastEnd) {
                count++;
                lastEnd = end;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Building position map: O(n) where n is string length
- Generating intervals: In worst case (all characters same), for each starting position i, we have O(n) ending positions, so O(n²). With binary search, it's O(n log k) where k is average frequency per character.
- Sorting intervals: O(m log m) where m is number of intervals (up to O(n²) in worst case)
- Greedy selection: O(m)
- **Overall:** O(n²) in worst case, but typically much better with diverse characters

**Space Complexity:**

- Position map: O(n) to store all indices
- Intervals list: O(m) where m is number of valid intervals (up to O(n²))
- **Overall:** O(n²) in worst case, O(n) average

## Common Mistakes

1. **Forgetting the length ≥ 4 requirement:** Candidates often check only that first and last characters match but forget the minimum length constraint. Always double-check: `j - i + 1 >= 4` means `j >= i + 3`.

2. **Inefficient interval generation:** Checking all O(n²) substrings explicitly is too slow. Using position maps with binary search is crucial for performance.

3. **Wrong greedy strategy:** Sorting by start position instead of end position for interval scheduling. The classic algorithm for maximum non-overlapping intervals sorts by end time.

4. **Off-by-one errors in overlap checking:** When checking if two intervals [i1, j1] and [i2, j2] overlap, remember they don't overlap if `i2 > j1` OR `i1 > j2`. The condition `start > lastEnd` correctly handles this.

5. **Not handling empty or short strings:** For strings shorter than 4 characters, the answer should always be 0. Make sure to handle this edge case.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Interval Scheduling:** The core of selecting maximum non-overlapping intervals appears in:
   - LeetCode 435: Non-overlapping Intervals (very similar concept)
   - LeetCode 452: Minimum Number of Arrows to Burst Balloons (interval scheduling variant)
   - LeetCode 646: Maximum Length of Pair Chain (interval scheduling with chains)

2. **Position Mapping with Binary Search:** Efficiently finding matching characters using precomputed positions:
   - LeetCode 792: Number of Matching Subsequences (uses similar position mapping)
   - LeetCode 392: Is Subsequence (optimized version uses position maps)

The combination makes this problem unique: you need to generate the intervals based on string constraints first, then apply interval scheduling.

## Key Takeaways

1. **Recognize interval scheduling problems:** When you need to select maximum non-overlapping segments/ranges/intervals, sort by end time and greedily select earliest-ending non-conflicting intervals.

2. **Optimize substring searches with position maps:** Instead of O(n²) substring checks, precompute character positions and use binary search for O(n log k) performance.

3. **Break complex problems into subproblems:** This problem has two clear phases: 1) Generate valid intervals based on string constraints, 2) Select maximum non-overlapping intervals. Solving each part separately makes the problem more manageable.

[Practice this problem on CodeJeet](/problem/find-maximum-number-of-non-intersecting-substrings)
