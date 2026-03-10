---
title: "How to Solve Number of Subarrays That Match a Pattern II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Subarrays That Match a Pattern II. Hard difficulty, 33.4% acceptance rate. Topics: Array, Rolling Hash, String Matching, Hash Function."
date: "2026-02-23"
category: "dsa-patterns"
tags:
  [
    "number-of-subarrays-that-match-a-pattern-ii",
    "array",
    "rolling-hash",
    "string-matching",
    "hard",
  ]
---

# How to Solve Number of Subarrays That Match a Pattern II

This problem asks us to count how many subarrays of length `m+1` in `nums` match a given pattern array. The pattern contains values -1, 0, and 1 that represent relationships between consecutive elements in the subarray: -1 means the next element should be smaller, 0 means equal, and 1 means larger. What makes this problem tricky is that we need to efficiently check these relationships across many overlapping subarrays without repeatedly comparing elements.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
nums = [1, 4, 4, 1, 2, 3]
pattern = [1, 0, -1]
m = 3 (pattern length)
```

We need to find subarrays of length `m+1 = 4` that match the pattern `[1, 0, -1]`.

**Step 1: Understanding what the pattern means**

- `pattern[0] = 1`: For the first comparison, we need `nums[i+1] > nums[i]`
- `pattern[1] = 0`: For the second comparison, we need `nums[i+2] = nums[i+1]`
- `pattern[2] = -1`: For the third comparison, we need `nums[i+3] < nums[i+2]`

**Step 2: Check each possible subarray of length 4**

1. Subarray `[1, 4, 4, 1]` (indices 0-3):
   - Compare 4 > 1? ✓ (pattern[0] = 1 satisfied)
   - Compare 4 = 4? ✓ (pattern[1] = 0 satisfied)
   - Compare 1 < 4? ✓ (pattern[2] = -1 satisfied)
   - ✅ This subarray matches!

2. Subarray `[4, 4, 1, 2]` (indices 1-4):
   - Compare 4 > 4? ✗ (pattern[0] = 1 requires >, but 4 = 4)
   - ❌ Doesn't match

3. Subarray `[4, 1, 2, 3]` (indices 2-5):
   - Compare 1 > 4? ✗ (pattern[0] = 1 requires >, but 1 < 4)
   - ❌ Doesn't match

**Result:** Only 1 matching subarray.

The brute force approach would check all `n - m` subarrays (3 in this case), each requiring `m` comparisons, for O(n·m) time. For large inputs (n up to 10⁵, m up to 10⁵), this is far too slow.

## Brute Force Approach

The most straightforward solution is to check every possible subarray of length `m+1`:

1. For each starting index `i` from 0 to `n - m - 1`
2. For each pattern element `k` from 0 to `m-1`
3. Check if the relationship between `nums[i+k]` and `nums[i+k+1]` matches `pattern[k]`

<div class="code-group">

```python
# Time: O(n * m) | Space: O(1)
def countMatchingSubarrays_brute(nums, pattern):
    n = len(nums)
    m = len(pattern)
    count = 0

    # Check each possible starting position
    for i in range(n - m):
        match = True

        # Check each element of the pattern
        for k in range(m):
            # Get the relationship between consecutive elements
            if pattern[k] == 1 and not (nums[i + k + 1] > nums[i + k]):
                match = False
                break
            elif pattern[k] == 0 and not (nums[i + k + 1] == nums[i + k]):
                match = False
                break
            elif pattern[k] == -1 and not (nums[i + k + 1] < nums[i + k]):
                match = False
                break

        if match:
            count += 1

    return count
```

```javascript
// Time: O(n * m) | Space: O(1)
function countMatchingSubarraysBrute(nums, pattern) {
  const n = nums.length;
  const m = pattern.length;
  let count = 0;

  // Check each possible starting position
  for (let i = 0; i <= n - m - 1; i++) {
    let match = true;

    // Check each element of the pattern
    for (let k = 0; k < m; k++) {
      // Get the relationship between consecutive elements
      if (pattern[k] === 1 && !(nums[i + k + 1] > nums[i + k])) {
        match = false;
        break;
      } else if (pattern[k] === 0 && !(nums[i + k + 1] === nums[i + k])) {
        match = false;
        break;
      } else if (pattern[k] === -1 && !(nums[i + k + 1] < nums[i + k])) {
        match = false;
        break;
      }
    }

    if (match) count++;
  }

  return count;
}
```

```java
// Time: O(n * m) | Space: O(1)
public int countMatchingSubarraysBrute(int[] nums, int[] pattern) {
    int n = nums.length;
    int m = pattern.length;
    int count = 0;

    // Check each possible starting position
    for (int i = 0; i <= n - m - 1; i++) {
        boolean match = true;

        // Check each element of the pattern
        for (int k = 0; k < m; k++) {
            // Get the relationship between consecutive elements
            if (pattern[k] == 1 && !(nums[i + k + 1] > nums[i + k])) {
                match = false;
                break;
            } else if (pattern[k] == 0 && !(nums[i + k + 1] == nums[i + k])) {
                match = false;
                break;
            } else if (pattern[k] == -1 && !(nums[i + k + 1] < nums[i + k])) {
                match = false;
                break;
            }
        }

        if (match) count++;
    }

    return count;
}
```

</div>

**Why this is insufficient:** With constraints up to 10⁵ for both n and m, O(n·m) could mean 10¹⁰ operations, which is far too slow. We need a solution that's at least O(n) or O(n log n).

## Optimized Approach

The key insight is that this problem is essentially **string matching** in disguise. We can transform both the pattern and the array into sequences that can be compared efficiently.

**Step 1: Transform the problem**
Instead of working with the original numbers, we can create a new array `arr` where:

- `arr[i] = 1` if `nums[i+1] > nums[i]`
- `arr[i] = 0` if `nums[i+1] = nums[i]`
- `arr[i] = -1` if `nums[i+1] < nums[i]`

Now our problem becomes: count how many subarrays of length `m` in `arr` exactly match the `pattern`.

**Step 2: Apply string matching algorithms**
We now have a classic pattern matching problem: find all occurrences of `pattern` in `arr`. We can use:

1. **KMP Algorithm** (Knuth-Morris-Pratt): O(n + m) time, O(m) space
2. **Rabin-Karp (Rolling Hash)**: O(n + m) average time, O(1) space

**Why KMP is a good choice:**

- Guaranteed O(n + m) worst-case time
- No hash collisions to worry about
- Well-established pattern matching algorithm

**KMP intuition:**

1. Build a **prefix function** (LPS array) for the pattern that tells us, for each position, the length of the longest proper prefix that's also a suffix.
2. Use this LPS array to avoid re-checking characters when we find a mismatch.

## Optimal Solution

We'll implement the KMP algorithm to solve this transformed problem:

<div class="code-group">

```python
# Time: O(n + m) | Space: O(m)
def countMatchingSubarrays(nums, pattern):
    n = len(nums)
    m = len(pattern)

    # Step 1: Transform nums into comparison array
    # Compare each pair of consecutive elements
    arr = [0] * (n - 1)
    for i in range(n - 1):
        if nums[i + 1] > nums[i]:
            arr[i] = 1
        elif nums[i + 1] < nums[i]:
            arr[i] = -1
        else:
            arr[i] = 0

    # Step 2: Build LPS (Longest Prefix Suffix) array for pattern
    # LPS[i] = length of longest proper prefix that's also a suffix for pattern[0..i]
    lps = [0] * m
    length = 0  # Length of previous longest prefix suffix
    i = 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                # Fall back to previous longest prefix
                length = lps[length - 1]
            else:
                # No matching prefix
                lps[i] = 0
                i += 1

    # Step 3: KMP search for pattern in arr
    count = 0
    i = 0  # Index for arr
    j = 0  # Index for pattern

    while i < len(arr):
        if arr[i] == pattern[j]:
            i += 1
            j += 1

            # Found a complete match
            if j == m:
                count += 1
                # Use LPS to continue searching without backtracking i
                j = lps[j - 1]
        else:
            if j != 0:
                # Use LPS to skip unnecessary comparisons
                j = lps[j - 1]
            else:
                # No match at all, move to next character in arr
                i += 1

    return count
```

```javascript
// Time: O(n + m) | Space: O(m)
function countMatchingSubarrays(nums, pattern) {
  const n = nums.length;
  const m = pattern.length;

  // Step 1: Transform nums into comparison array
  // Compare each pair of consecutive elements
  const arr = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    if (nums[i + 1] > nums[i]) {
      arr[i] = 1;
    } else if (nums[i + 1] < nums[i]) {
      arr[i] = -1;
    } else {
      arr[i] = 0;
    }
  }

  // Step 2: Build LPS (Longest Prefix Suffix) array for pattern
  // LPS[i] = length of longest proper prefix that's also a suffix for pattern[0..i]
  const lps = new Array(m).fill(0);
  let length = 0; // Length of previous longest prefix suffix
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        // Fall back to previous longest prefix
        length = lps[length - 1];
      } else {
        // No matching prefix
        lps[i] = 0;
        i++;
      }
    }
  }

  // Step 3: KMP search for pattern in arr
  let count = 0;
  i = 0; // Index for arr
  let j = 0; // Index for pattern

  while (i < arr.length) {
    if (arr[i] === pattern[j]) {
      i++;
      j++;

      // Found a complete match
      if (j === m) {
        count++;
        // Use LPS to continue searching without backtracking i
        j = lps[j - 1];
      }
    } else {
      if (j !== 0) {
        // Use LPS to skip unnecessary comparisons
        j = lps[j - 1];
      } else {
        // No match at all, move to next character in arr
        i++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n + m) | Space: O(m)
public int countMatchingSubarrays(int[] nums, int[] pattern) {
    int n = nums.length;
    int m = pattern.length;

    // Step 1: Transform nums into comparison array
    // Compare each pair of consecutive elements
    int[] arr = new int[n - 1];
    for (int i = 0; i < n - 1; i++) {
        if (nums[i + 1] > nums[i]) {
            arr[i] = 1;
        } else if (nums[i + 1] < nums[i]) {
            arr[i] = -1;
        } else {
            arr[i] = 0;
        }
    }

    // Step 2: Build LPS (Longest Prefix Suffix) array for pattern
    // LPS[i] = length of longest proper prefix that's also a suffix for pattern[0..i]
    int[] lps = new int[m];
    int length = 0;  // Length of previous longest prefix suffix
    int i = 1;

    while (i < m) {
        if (pattern[i] == pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                // Fall back to previous longest prefix
                length = lps[length - 1];
            } else {
                // No matching prefix
                lps[i] = 0;
                i++;
            }
        }
    }

    // Step 3: KMP search for pattern in arr
    int count = 0;
    i = 0;  // Index for arr
    int j = 0;  // Index for pattern

    while (i < arr.length) {
        if (arr[i] == pattern[j]) {
            i++;
            j++;

            // Found a complete match
            if (j == m) {
                count++;
                // Use LPS to continue searching without backtracking i
                j = lps[j - 1];
            }
        } else {
            if (j != 0) {
                // Use LPS to skip unnecessary comparisons
                j = lps[j - 1];
            } else {
                // No match at all, move to next character in arr
                i++;
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the comparison array `arr`: O(n) to compare each consecutive pair
- Building the LPS array: O(m) using the KMP preprocessing
- KMP search: O(n) since each character in `arr` is examined at most twice (once when matching, potentially once more after a mismatch)

**Space Complexity: O(m)**

- The LPS array requires O(m) space
- The comparison array `arr` requires O(n) but could be avoided by streaming the comparisons (though this makes the code more complex)

## Common Mistakes

1. **Off-by-one errors in subarray indices**: Remember that a subarray matching a pattern of length `m` requires `m+1` elements from `nums`. A common mistake is to look for subarrays of length `m` instead of `m+1`.

2. **Forgetting to handle empty or single-element arrays**: When `n < m+1`, there are no possible subarrays. Always check this edge case early.

3. **Incorrect LPS array construction**: The LPS array is tricky to build correctly. A common error is to reset `length` to 0 instead of `lps[length-1]` when a mismatch occurs after some matches.

4. **Not understanding the transformation**: Some candidates try to apply KMP directly to the original `nums` array without first transforming it into comparison relationships. This won't work because KMP looks for exact matches, not relational patterns.

## When You'll See This Pattern

This problem teaches the important technique of **problem transformation** followed by **standard algorithm application**. You'll see similar patterns in:

1. **Find the Index of the First Occurrence in a String (LeetCode 28)**: Direct application of KMP for string matching.
2. **Repeated String Match (LeetCode 686)**: Uses KMP to find how many times one string must be repeated to contain another.
3. **Shortest Palindrome (LeetCode 214)**: Uses KMP's LPS array to find the longest palindrome prefix.

The core insight is recognizing when a problem can be transformed into a string/pattern matching problem. Look for problems where you're comparing sequences or looking for specific patterns in data.

## Key Takeaways

1. **Transform before solving**: Many hard problems become medium problems once you find the right transformation. Here, converting number comparisons to a sequence of -1/0/1 relationships was the key insight.

2. **Know your string algorithms**: KMP, Rabin-Karp, and Z-algorithm are powerful tools for pattern matching. KMP is particularly useful when you need guaranteed O(n+m) performance.

3. **Recognize overlapping subproblems**: The brute force solution rechecks the same comparisons many times. KMP avoids this by using the LPS array to remember what parts of the pattern we've already matched.

Related problems: [Match Substring After Replacement](/problem/match-substring-after-replacement)
