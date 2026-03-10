---
title: "How to Solve Shortest Matching Substring — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Matching Substring. Hard difficulty, 23.8% acceptance rate. Topics: Two Pointers, String, Binary Search, String Matching."
date: "2026-08-11"
category: "dsa-patterns"
tags: ["shortest-matching-substring", "two-pointers", "string", "binary-search", "hard"]
---

# How to Solve Shortest Matching Substring

This problem asks us to find the shortest substring in string `s` that matches a pattern `p` containing exactly two `'*'` wildcards. The `'*'` characters match any sequence of zero or more characters, making this a pattern matching problem with flexible wildcards. What makes this tricky is that the two wildcards can match variable-length sequences, creating many possible substring matches we need to efficiently search through.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `s = "abcdexyzfgh"`
- `p = "ab*de*fgh"`

The pattern has three fixed segments separated by two wildcards:

1. `"ab"` (before first `*`)
2. `"de"` (between the two `*`)
3. `"fgh"` (after second `*`)

We need to find the shortest substring where:

- It starts with `"ab"`
- Contains `"de"` somewhere after `"ab"`
- Ends with `"fgh"`
- The `*` wildcards match whatever comes between these fixed segments

Let's find all possible matches:

1. `"abcdexyzfgh"` - entire string: `"ab"` + `"c"` (matched by first `*`) + `"de"` + `"xyz"` (matched by second `*`) + `"fgh"` → length 11
2. `"abcdexfgh"` - `"ab"` + `"c"` + `"de"` + `"x"` + `"fgh"` → length 9
3. `"abcdefgh"` - `"ab"` + `"c"` + `"de"` + `""` (empty string) + `"fgh"` → length 8

The shortest is `"abcdefgh"` with length 8. Notice that for a valid match:

- The first fixed segment must appear at the start of our substring
- The middle fixed segment must appear somewhere after the first
- The last fixed segment must appear at the end of our substring
- The wildcards match whatever comes between these segments

## Brute Force Approach

A naive approach would try all possible substrings of `s` and check if they match the pattern. For each substring starting at index `i` and ending at index `j`, we would need to:

1. Check if it starts with the first fixed segment
2. Find the middle fixed segment somewhere after the first
3. Check if it ends with the last fixed segment
4. Ensure the segments appear in the correct order

This brute force would be O(n³) time complexity: O(n²) substrings × O(n) to check each one. For n up to 10⁴ or 10⁵, this is completely infeasible.

Even a slightly better brute force would try all possible positions for the three fixed segments:

1. For each possible start position of the first segment
2. For each possible start position of the middle segment (after the first ends)
3. For each possible start position of the last segment (after the middle ends)
4. Check if these positions create a valid match

This is still O(n³) in the worst case when segments are short.

## Optimized Approach

The key insight is that we don't need to check every combination. Since the pattern has exactly three fixed segments, we can:

1. Split the pattern into three fixed segments: `seg1`, `seg2`, `seg3`
2. For each occurrence of `seg2` in `s`, find:
   - The earliest occurrence of `seg1` that ends before this `seg2` starts
   - The latest occurrence of `seg3` that starts after this `seg2` ends
3. For each `seg2` occurrence, calculate the shortest substring that includes all three segments in order

But we can do even better with preprocessing. The optimal approach uses:

1. **Prefix matching**: For each position in `s`, find the nearest occurrence of `seg1` ending at or before that position
2. **Suffix matching**: For each position in `s`, find the nearest occurrence of `seg3` starting at or after that position
3. **Two-pointer/sliding window**: Iterate through occurrences of `seg2` and use the preprocessed arrays to find minimal substrings

Here's the step-by-step reasoning:

1. Split `p` into three segments using the `'*'` as delimiters
2. Precompute `left[i]` = index where `seg1` ends if we match it ending at or before position `i`, or -1 if impossible
3. Precompute `right[i]` = index where `seg3` starts if we match it starting at or after position `i`, or -1 if impossible
4. For each occurrence of `seg2` starting at index `j`:
   - Get `l = left[j-1]` (last position where `seg1` could end before `seg2` starts)
   - Get `r = right[j+len(seg2)]` (first position where `seg3` could start after `seg2` ends)
   - If both are valid, calculate substring length: `(r + len(seg3)) - (l - len(seg1) + 1) + 1`
   - Track the minimum length

This reduces the problem to O(n) time after preprocessing.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n = len(s)
# Space: O(n) for the left and right arrays
def shortestMatchingSubstring(s: str, p: str) -> int:
    # Step 1: Split pattern into three fixed segments
    segments = p.split('*')
    seg1, seg2, seg3 = segments[0], segments[1], segments[2]
    n = len(s)

    # Edge case: if any segment is longer than s, impossible to match
    if len(seg1) > n or len(seg2) > n or len(seg3) > n:
        return -1

    # Step 2: Precompute left array
    # left[i] = index where seg1 ends if matched ending at or before position i
    # We use -1 to indicate no match possible
    left = [-1] * n

    # Build the left array by scanning from left to right
    # We're looking for the rightmost occurrence of seg1 ending at or before each position
    for i in range(len(seg1) - 1, n):
        # Check if seg1 matches ending at position i
        if s[i - len(seg1) + 1:i + 1] == seg1:
            left[i] = i  # seg1 ends at position i
        elif i > 0:
            # Carry forward the previous match if current position doesn't match
            left[i] = left[i - 1]

    # Step 3: Precompute right array
    # right[i] = index where seg3 starts if matched starting at or after position i
    # We use n to indicate no match possible (using n as sentinel)
    right = [n] * n

    # Build the right array by scanning from right to left
    # We're looking for the leftmost occurrence of seg3 starting at or after each position
    for i in range(n - len(seg3), -1, -1):
        # Check if seg3 matches starting at position i
        if s[i:i + len(seg3)] == seg3:
            right[i] = i  # seg3 starts at position i
        elif i < n - 1:
            # Carry forward the next match if current position doesn't match
            right[i] = right[i + 1]

    # Step 4: Find all occurrences of seg2 and calculate minimal substring
    min_length = float('inf')
    seg2_len = len(seg2)

    # Check every possible starting position for seg2
    for j in range(n - seg2_len + 1):
        # Check if seg2 matches starting at position j
        if s[j:j + seg2_len] == seg2:
            # seg1 must end before seg2 starts (at position j-1 or earlier)
            l = left[j - 1] if j > 0 else -1

            # seg3 must start after seg2 ends (at position j+seg2_len or later)
            r = right[j + seg2_len] if j + seg2_len < n else n

            # If both segments are found in valid positions
            if l != -1 and r != n:
                # Calculate substring length:
                # Start position: l - len(seg1) + 1 (where seg1 starts)
                # End position: r + len(seg3) - 1 (where seg3 ends)
                # Length = end - start + 1
                start = l - len(seg1) + 1
                end = r + len(seg3) - 1
                length = end - start + 1
                min_length = min(min_length, length)

    # Step 5: Return result
    return min_length if min_length != float('inf') else -1
```

```javascript
// Time: O(n) where n = s.length
// Space: O(n) for the left and right arrays
function shortestMatchingSubstring(s, p) {
  // Step 1: Split pattern into three fixed segments
  const segments = p.split("*");
  const seg1 = segments[0],
    seg2 = segments[1],
    seg3 = segments[2];
  const n = s.length;

  // Edge case: if any segment is longer than s, impossible to match
  if (seg1.length > n || seg2.length > n || seg3.length > n) {
    return -1;
  }

  // Step 2: Precompute left array
  // left[i] = index where seg1 ends if matched ending at or before position i
  // We use -1 to indicate no match possible
  const left = new Array(n).fill(-1);

  // Build the left array by scanning from left to right
  for (let i = seg1.length - 1; i < n; i++) {
    // Check if seg1 matches ending at position i
    const start = i - seg1.length + 1;
    if (s.substring(start, i + 1) === seg1) {
      left[i] = i; // seg1 ends at position i
    } else if (i > 0) {
      // Carry forward the previous match
      left[i] = left[i - 1];
    }
  }

  // Step 3: Precompute right array
  // right[i] = index where seg3 starts if matched starting at or after position i
  // We use n as sentinel for no match
  const right = new Array(n).fill(n);

  // Build the right array by scanning from right to left
  for (let i = n - seg3.length; i >= 0; i--) {
    // Check if seg3 matches starting at position i
    if (s.substring(i, i + seg3.length) === seg3) {
      right[i] = i; // seg3 starts at position i
    } else if (i < n - 1) {
      // Carry forward the next match
      right[i] = right[i + 1];
    }
  }

  // Step 4: Find all occurrences of seg2 and calculate minimal substring
  let minLength = Infinity;
  const seg2Len = seg2.length;

  // Check every possible starting position for seg2
  for (let j = 0; j <= n - seg2Len; j++) {
    // Check if seg2 matches starting at position j
    if (s.substring(j, j + seg2Len) === seg2) {
      // seg1 must end before seg2 starts
      const l = j > 0 ? left[j - 1] : -1;

      // seg3 must start after seg2 ends
      const r = j + seg2Len < n ? right[j + seg2Len] : n;

      // If both segments are found in valid positions
      if (l !== -1 && r !== n) {
        // Calculate substring length
        const start = l - seg1.length + 1;
        const end = r + seg3.length - 1;
        const length = end - start + 1;
        minLength = Math.min(minLength, length);
      }
    }
  }

  // Step 5: Return result
  return minLength !== Infinity ? minLength : -1;
}
```

```java
// Time: O(n) where n = s.length()
// Space: O(n) for the left and right arrays
public int shortestMatchingSubstring(String s, String p) {
    // Step 1: Split pattern into three fixed segments
    String[] segments = p.split("\\*");
    String seg1 = segments[0], seg2 = segments[1], seg3 = segments[2];
    int n = s.length();

    // Edge case: if any segment is longer than s, impossible to match
    if (seg1.length() > n || seg2.length() > n || seg3.length() > n) {
        return -1;
    }

    // Step 2: Precompute left array
    // left[i] = index where seg1 ends if matched ending at or before position i
    // We use -1 to indicate no match possible
    int[] left = new int[n];
    Arrays.fill(left, -1);

    // Build the left array by scanning from left to right
    for (int i = seg1.length() - 1; i < n; i++) {
        // Check if seg1 matches ending at position i
        int start = i - seg1.length() + 1;
        if (s.substring(start, i + 1).equals(seg1)) {
            left[i] = i;  // seg1 ends at position i
        } else if (i > 0) {
            // Carry forward the previous match
            left[i] = left[i - 1];
        }
    }

    // Step 3: Precompute right array
    // right[i] = index where seg3 starts if matched starting at or after position i
    // We use n as sentinel for no match
    int[] right = new int[n];
    Arrays.fill(right, n);

    // Build the right array by scanning from right to left
    for (int i = n - seg3.length(); i >= 0; i--) {
        // Check if seg3 matches starting at position i
        if (s.substring(i, i + seg3.length()).equals(seg3)) {
            right[i] = i;  // seg3 starts at position i
        } else if (i < n - 1) {
            // Carry forward the next match
            right[i] = right[i + 1];
        }
    }

    // Step 4: Find all occurrences of seg2 and calculate minimal substring
    int minLength = Integer.MAX_VALUE;
    int seg2Len = seg2.length();

    // Check every possible starting position for seg2
    for (int j = 0; j <= n - seg2Len; j++) {
        // Check if seg2 matches starting at position j
        if (s.substring(j, j + seg2Len).equals(seg2)) {
            // seg1 must end before seg2 starts
            int l = j > 0 ? left[j - 1] : -1;

            // seg3 must start after seg2 ends
            int r = j + seg2Len < n ? right[j + seg2Len] : n;

            // If both segments are found in valid positions
            if (l != -1 && r != n) {
                // Calculate substring length
                int start = l - seg1.length() + 1;
                int end = r + seg3.length() - 1;
                int length = end - start + 1;
                minLength = Math.min(minLength, length);
            }
        }
    }

    // Step 5: Return result
    return minLength != Integer.MAX_VALUE ? minLength : -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Splitting the pattern: O(m) where m is pattern length (constant factor)
- Building left array: O(n) by scanning once
- Building right array: O(n) by scanning once
- Finding seg2 occurrences: O(n) in worst case (checking each position)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- Left array: O(n)
- Right array: O(n)
- Other variables: O(1)
- Total: O(2n) = O(n)

The linear time complexity comes from preprocessing the string once and then using the precomputed arrays to answer queries in O(1) time for each seg2 occurrence.

## Common Mistakes

1. **Not handling empty segments correctly**: The wildcards `'*'` can match zero characters, so segments could theoretically be empty. However, the problem guarantees exactly two `'*'` characters, which means we always have three segments, but they could be empty strings. Our solution handles this correctly because `split('*')` on a pattern like `"a**b"` would produce `["a", "", "b"]`, and empty strings match at any position.

2. **Off-by-one errors in index calculations**: When calculating where seg1 ends (left array) or where seg3 starts (right array), it's easy to be off by one. Always test with small examples: if seg1 = "ab" and it matches at positions 2-3, then it ends at index 3, not 2 or 4.

3. **Forgetting edge cases with boundaries**: When j=0 (seg2 at the very beginning), we can't access left[j-1]. Similarly, when seg2 is at the very end, we can't access right[j+seg2_len]. Our code handles these with conditional checks.

4. **Using inefficient string matching**: Checking `s[i:i+len] == segment` for each position is O(len) time. While this is acceptable since segment lengths are bounded by n, in an interview you might discuss using KMP or other string matching algorithms for very long segments, though it's not necessary for the optimal solution.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Precomputation/DP on strings**: Similar to "Longest Valid Parentheses" (LeetCode 32) or "Palindrome Partitioning II" (LeetCode 132), where you precompute information to answer queries quickly.

2. **Three-part matching with constraints**: Problems like "Wildcard Matching" (LeetCode 44) or "Regular Expression Matching" (LeetCode 10) also involve matching patterns with wildcards, though they're more general.

3. **Segment concatenation problems**: "Word Break" (LeetCode 139) and "Concatenated Words" (LeetCode 472) also involve finding ways to combine segments from a dictionary to form a target string.

The core technique of preprocessing left/right information appears in problems like "Trapping Rain Water" (LeetCode 42), where you precompute leftMax and rightMax arrays.

## Key Takeaways

1. **When dealing with fixed segments in a pattern, precompute their possible positions**: Instead of checking all combinations at query time, compute once where each segment can appear relative to each position.

2. **The "left" and "right" array technique is powerful for range queries**: When you need to find the nearest occurrence of something to the left or right of each position, precomputing these arrays turns O(n) queries into O(1) lookups.

3. **Break complex pattern matching into simpler subproblems**: By splitting the pattern at wildcards, we reduce a complex matching problem to finding three fixed substrings in the correct order, which is much easier to reason about and optimize.

[Practice this problem on CodeJeet](/problem/shortest-matching-substring)
