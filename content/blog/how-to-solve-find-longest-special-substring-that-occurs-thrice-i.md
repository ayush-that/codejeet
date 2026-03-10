---
title: "How to Solve Find Longest Special Substring That Occurs Thrice I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Longest Special Substring That Occurs Thrice I. Medium difficulty, 61.9% acceptance rate. Topics: Hash Table, String, Binary Search, Sliding Window, Counting."
date: "2026-12-22"
category: "dsa-patterns"
tags:
  [
    "find-longest-special-substring-that-occurs-thrice-i",
    "hash-table",
    "string",
    "binary-search",
    "medium",
  ]
---

# How to Solve Find Longest Special Substring That Occurs Thrice I

This problem asks us to find the length of the longest special substring (a substring containing only one character) that appears at least three times in the given string. What makes this problem interesting is that we're not looking for any substring, but specifically for "special" substrings (all same character), and we need them to appear at least three times. The challenge lies in efficiently counting occurrences of these single-character substrings without checking every possible substring.

## Visual Walkthrough

Let's trace through an example: `s = "aaaa"`

1. All possible special substrings:
   - Length 1: "a" appears 4 times
   - Length 2: "aa" appears 3 times (positions 0-1, 1-2, 2-3)
   - Length 3: "aaa" appears 2 times (positions 0-2, 1-3)
   - Length 4: "aaaa" appears 1 time

2. We need substrings that appear at least 3 times:
   - "a" appears 4 times ✓
   - "aa" appears 3 times ✓
   - "aaa" appears 2 times ✗
   - "aaaa" appears 1 time ✗

3. The longest special substring appearing at least 3 times is "aa" with length 2.

Now let's try a more complex example: `s = "abcaba"`

1. Special substrings by character:
   - 'a': "a" appears 3 times (positions 0, 3, 5)
   - 'b': "b" appears 2 times (positions 1, 4)
   - 'c': "c" appears 1 time

2. For character 'a', we can also check longer substrings:
   - "aa" doesn't exist (no consecutive 'a's)
   - So the longest special substring for 'a' is "a" with length 1

3. The answer is 1, since only "a" appears at least 3 times.

The key insight: For each character, the longest possible special substring that appears at least k times is determined by the gaps between consecutive occurrences of that character.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible substrings (O(n²) substrings)
2. Filter for special substrings (all same character)
3. Count occurrences of each special substring
4. Find the longest one with count ≥ 3

This approach has several problems:

- Generating all substrings is O(n²)
- Counting occurrences naively is O(n) per substring
- Total complexity would be O(n³) which is too slow for n up to 50 (but actually n ≤ 50 in this problem, so brute force could work, but it's not optimal)
- We're doing redundant work by checking substrings that can't possibly be valid

Here's what the brute force might look like:

<div class="code-group">

```python
# Brute force - too slow for larger inputs
def maximumLength_brute(s: str) -> int:
    n = len(s)
    max_len = -1

    # Check all possible substrings
    for i in range(n):
        for j in range(i, n):
            # Check if substring is special (all same char)
            substr = s[i:j+1]
            if len(set(substr)) == 1:  # All characters are the same
                # Count occurrences of this substring
                count = 0
                for k in range(n - len(substr) + 1):
                    if s[k:k+len(substr)] == substr:
                        count += 1

                if count >= 3:
                    max_len = max(max_len, len(substr))

    return max_len
```

```javascript
// Brute force - too slow for larger inputs
function maximumLengthBrute(s) {
  const n = s.length;
  let maxLen = -1;

  // Check all possible substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if substring is special (all same char)
      const substr = s.substring(i, j + 1);
      if (new Set(substr).size === 1) {
        // All characters are the same
        // Count occurrences of this substring
        let count = 0;
        for (let k = 0; k <= n - substr.length; k++) {
          if (s.substring(k, k + substr.length) === substr) {
            count++;
          }
        }

        if (count >= 3) {
          maxLen = Math.max(maxLen, substr.length);
        }
      }
    }
  }

  return maxLen;
}
```

```java
// Brute force - too slow for larger inputs
public int maximumLengthBrute(String s) {
    int n = s.length();
    int maxLen = -1;

    // Check all possible substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if substring is special (all same char)
            String substr = s.substring(i, j + 1);
            if (isSpecial(substr)) {
                // Count occurrences of this substring
                int count = 0;
                for (int k = 0; k <= n - substr.length(); k++) {
                    if (s.substring(k, k + substr.length()).equals(substr)) {
                        count++;
                    }
                }

                if (count >= 3) {
                    maxLen = Math.max(maxLen, substr.length());
                }
            }
        }
    }

    return maxLen;
}

private boolean isSpecial(String s) {
    if (s.isEmpty()) return false;
    char first = s.charAt(0);
    for (int i = 1; i < s.length(); i++) {
        if (s.charAt(i) != first) return false;
    }
    return true;
}
```

</div>

While this brute force approach would technically work for the constraints (n ≤ 50), it's inefficient and doesn't scale. The time complexity is O(n⁴) in the worst case.

## Optimized Approach

The key insight is that we don't need to check every possible substring. For special substrings (all same character), we can think about them differently:

1. **Group consecutive occurrences**: For each character, find all runs of consecutive occurrences.
2. **Count occurrences efficiently**: A special substring of length L appears in a run of length R exactly (R - L + 1) times within that run.
3. **Combine across runs**: If we have multiple runs of the same character, we need to consider substrings that span across gaps.

The optimal approach uses a clever observation: For a special substring of length L to appear at least 3 times, we need either:

- A single run of length ≥ L that contains the substring at least 3 times within it
- OR multiple runs that together provide at least 3 occurrences

Actually, there's an even simpler observation: For a given character, the longest special substring that appears at least 3 times is determined by:

- If the character appears at least 3 times in total, then length 1 is always valid
- For longer lengths, we need to check if we can find 3 non-overlapping occurrences

The most efficient approach: For each character 'a' to 'z':

1. Get all indices where this character appears
2. The maximum length we can achieve is determined by the gaps between these indices
3. Specifically, if we look at the 3rd occurrence from any starting point, the maximum length is limited by the distance constraints

The actual algorithm that works is simpler: For each character, we can check lengths in decreasing order and see if we can find 3 occurrences. But there's an even better O(n) approach using frequency counting of runs.

## Optimal Solution

The optimal solution counts runs of consecutive characters and uses mathematical reasoning. For each character:

1. Count all runs of that character
2. The answer for that character is the maximum of:
   - (longest run length - 2) [we can take 3 substrings from the middle]
   - min(longest run length - 1, second longest run length) [we can take from two different runs]
   - 1 if the character appears at least 3 times total

Then we take the maximum across all characters.

Here's the complete solution with detailed comments:

<div class="code-group">

```python
def maximumLength(s: str) -> int:
    """
    Find the length of the longest special substring that occurs at least 3 times.

    Approach:
    1. For each character 'a'-'z', analyze its occurrences
    2. A special substring is a run of the same character
    3. We need to find the longest such run that appears at least 3 times

    Key insight: For a character c, the answer is the maximum of:
    - (longest run of c - 2): We can take 3 non-overlapping substrings from a long run
    - min(longest run of c - 1, second longest run of c): Between two runs
    - 1 if c appears at least 3 times

    Time: O(26 * n) = O(n) since we process each character once
    Space: O(1) for the frequency arrays
    """
    n = len(s)
    result = -1

    # Check each possible character
    for char in range(26):
        current_char = chr(ord('a') + char)

        # Find all runs of this character
        runs = []
        count = 0

        for i in range(n):
            if s[i] == current_char:
                count += 1
            else:
                if count > 0:
                    runs.append(count)
                    count = 0

        # Don't forget the last run
        if count > 0:
            runs.append(count)

        # Sort runs in descending order
        runs.sort(reverse=True)

        # Calculate possible answers for this character
        if len(runs) > 0:
            # Case 1: Take from the longest run
            # From a run of length L, we can get substrings of length (L-2)
            # Example: "aaaaa" (L=5) -> we can take "aaa" from positions 0-2, 1-3, 2-4
            if runs[0] >= 3:
                result = max(result, runs[0] - 2)

            # Case 2: Take from two different runs
            # We can take min(runs[0]-1, runs[1]) if we have at least 2 runs
            # Example: runs = [4, 3] -> we can take length 3 ("aaa") from first run
            # and length 3 from second run
            if len(runs) >= 2:
                result = max(result, min(runs[0] - 1, runs[1]))

            # Case 3: Single character appears at least 3 times
            # Count total occurrences of this character
            total_count = sum(runs)
            if total_count >= 3:
                result = max(result, 1)

    return result
```

```javascript
function maximumLength(s) {
  /**
   * Find the length of the longest special substring that occurs at least 3 times.
   *
   * Approach:
   * 1. For each character 'a'-'z', analyze its occurrences
   * 2. A special substring is a run of the same character
   * 3. We need to find the longest such run that appears at least 3 times
   *
   * Key insight: For a character c, the answer is the maximum of:
   * - (longest run of c - 2): We can take 3 non-overlapping substrings from a long run
   * - min(longest run of c - 1, second longest run of c): Between two runs
   * - 1 if c appears at least 3 times
   *
   * Time: O(26 * n) = O(n) since we process each character once
   * Space: O(n) for storing runs (but could be O(1) with careful implementation)
   */
  const n = s.length;
  let result = -1;

  // Check each possible character
  for (let charCode = 0; charCode < 26; charCode++) {
    const currentChar = String.fromCharCode("a".charCodeAt(0) + charCode);

    // Find all runs of this character
    const runs = [];
    let count = 0;

    for (let i = 0; i < n; i++) {
      if (s[i] === currentChar) {
        count++;
      } else {
        if (count > 0) {
          runs.push(count);
          count = 0;
        }
      }
    }

    // Don't forget the last run
    if (count > 0) {
      runs.push(count);
    }

    // Sort runs in descending order
    runs.sort((a, b) => b - a);

    // Calculate possible answers for this character
    if (runs.length > 0) {
      // Case 1: Take from the longest run
      // From a run of length L, we can get substrings of length (L-2)
      if (runs[0] >= 3) {
        result = Math.max(result, runs[0] - 2);
      }

      // Case 2: Take from two different runs
      // We can take min(runs[0]-1, runs[1]) if we have at least 2 runs
      if (runs.length >= 2) {
        result = Math.max(result, Math.min(runs[0] - 1, runs[1]));
      }

      // Case 3: Single character appears at least 3 times
      // Count total occurrences of this character
      const totalCount = runs.reduce((sum, val) => sum + val, 0);
      if (totalCount >= 3) {
        result = Math.max(result, 1);
      }
    }
  }

  return result;
}
```

```java
public int maximumLength(String s) {
    /**
     * Find the length of the longest special substring that occurs at least 3 times.
     *
     * Approach:
     * 1. For each character 'a'-'z', analyze its occurrences
     * 2. A special substring is a run of the same character
     * 3. We need to find the longest such run that appears at least 3 times
     *
     * Key insight: For a character c, the answer is the maximum of:
     * - (longest run of c - 2): We can take 3 non-overlapping substrings from a long run
     * - min(longest run of c - 1, second longest run of c): Between two runs
     * - 1 if c appears at least 3 times
     *
     * Time: O(26 * n) = O(n) since we process each character once
     * Space: O(n) for storing runs
     */
    int n = s.length();
    int result = -1;

    // Check each possible character
    for (char c = 'a'; c <= 'z'; c++) {
        // Find all runs of this character
        List<Integer> runs = new ArrayList<>();
        int count = 0;

        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == c) {
                count++;
            } else {
                if (count > 0) {
                    runs.add(count);
                    count = 0;
                }
            }
        }

        // Don't forget the last run
        if (count > 0) {
            runs.add(count);
        }

        // Sort runs in descending order
        runs.sort((a, b) -> b - a);

        // Calculate possible answers for this character
        if (!runs.isEmpty()) {
            // Case 1: Take from the longest run
            // From a run of length L, we can get substrings of length (L-2)
            if (runs.get(0) >= 3) {
                result = Math.max(result, runs.get(0) - 2);
            }

            // Case 2: Take from two different runs
            // We can take min(runs[0]-1, runs[1]) if we have at least 2 runs
            if (runs.size() >= 2) {
                result = Math.max(result, Math.min(runs.get(0) - 1, runs.get(1)));
            }

            // Case 3: Single character appears at least 3 times
            // Count total occurrences of this character
            int totalCount = 0;
            for (int run : runs) {
                totalCount += run;
            }
            if (totalCount >= 3) {
                result = Math.max(result, 1);
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(26 × n) = O(n)

- We iterate through all 26 possible characters
- For each character, we make a single pass through the string to find runs
- Sorting the runs for each character takes O(m log m) where m is the number of runs, but since m ≤ n and we're doing this for constant 26 characters, it's still O(n) overall

**Space Complexity:** O(n) in the worst case

- We store runs for each character, but we process them one at a time
- The runs list for a single character could have up to n elements in the worst case (alternating characters)
- With optimization, we could reduce this to O(1) by tracking only the top 2 runs

## Common Mistakes

1. **Not considering all three cases**: Candidates often miss one of the three cases (single long run, two runs, or single characters). All three are needed for correctness.

2. **Off-by-one errors in run calculations**: When calculating (longest run - 2), it's easy to miscalculate. Remember: from a run of length L, we can get substrings of length (L-2) that appear 3 times. Example: "aaaaa" (L=5) gives us "aaa" which appears 3 times.

3. **Forgetting to handle characters that don't appear**: The problem states to return -1 if no special substring appears at least 3 times. Initialize result to -1 and only update when valid substrings are found.

4. **Inefficient substring matching**: Avoid actually generating and comparing substrings. The run-based approach avoids this entirely by using mathematical reasoning about run lengths.

## When You'll See This Pattern

This problem uses several patterns common in string processing:

1. **Run-length encoding**: Compressing consecutive identical elements is a common technique in problems like [String Compression](https://leetcode.com/problems/string-compression/).

2. **Frequency analysis with constraints**: Similar to [Longest Substring with At Least K Repeating Characters](https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/), where we need substrings satisfying frequency constraints.

3. **Sliding window for substring properties**: While not used directly here, the concept of analyzing runs is related to sliding window techniques for finding substrings with specific properties.

4. **Character-based bucketing**: Grouping by character and analyzing separately is common in problems like [Group Anagrams](https://leetcode.com/problems/group-anagrams/) and [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/).

## Key Takeaways

1. **Special substrings simplify analysis**: When dealing with single-character substrings, think in terms of runs and gaps rather than checking all substrings.

2. **Mathematical reasoning beats brute force**: Instead of counting occurrences directly, use properties of runs to determine what lengths are possible.

3. **Consider all cases systematically**: Break the problem into cases (single long run, multiple runs, single characters) to ensure you don't miss any possibilities.

4. **26-character optimization**: For lowercase English letters, iterating through all 26 characters is efficient and simplifies the solution.

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters), [Longest Substring with At Least K Repeating Characters](/problem/longest-substring-with-at-least-k-repeating-characters)
