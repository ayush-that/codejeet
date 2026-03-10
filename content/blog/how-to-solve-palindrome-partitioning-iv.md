---
title: "How to Solve Palindrome Partitioning IV — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Palindrome Partitioning IV. Hard difficulty, 45.2% acceptance rate. Topics: String, Dynamic Programming."
date: "2029-03-22"
category: "dsa-patterns"
tags: ["palindrome-partitioning-iv", "string", "dynamic-programming", "hard"]
---

# How to Solve Palindrome Partitioning IV

Given a string `s`, we need to determine if it can be split into exactly three non-empty palindromic substrings. This is tricky because we need to find two split points that create three valid palindromes, and checking all possible splits naively would be too slow for longer strings. The challenge lies in efficiently checking palindrome validity for many substrings.

## Visual Walkthrough

Let's walk through an example: `s = "abcbdd"`. We need to find positions `i` and `j` (where `0 < i < j < n`) such that:

1. `s[0:i]` is a palindrome
2. `s[i:j]` is a palindrome
3. `s[j:n]` is a palindrome

For `n = 6`, possible `i` values: 1,2,3,4 and `j` values: i+1 through 5.

Let's check `i=2, j=4`:

- `s[0:2] = "ab"` → Not a palindrome (reversed is "ba")
- This fails immediately

Now check `i=2, j=5`:

- `s[0:2] = "ab"` → Not a palindrome
- Fails

Check `i=3, j=5`:

- `s[0:3] = "abc"` → Not a palindrome
- Fails

Check `i=1, j=3`:

- `s[0:1] = "a"` → Palindrome (single character always palindrome)
- `s[1:3] = "bc"` → Not a palindrome
- Fails

Check `i=1, j=4`:

- `s[0:1] = "a"` → Palindrome ✓
- `s[1:4] = "bcb"` → Palindrome (reads same forward/backward) ✓
- `s[4:6] = "dd"` → Palindrome ✓
- All three are palindromes! So `"abcbdd"` can be split as `"a" | "bcb" | "dd"`

The key insight: we need to check many substring palindrome queries efficiently.

## Brute Force Approach

A naive approach would check all possible split pairs `(i, j)`:

1. For each `i` from 1 to n-2
2. For each `j` from i+1 to n-1
3. Check if `s[0:i]`, `s[i:j]`, and `s[j:n]` are all palindromes

Each palindrome check takes O(k) time for a substring of length k. In the worst case, we're checking O(n²) split pairs, and each check could take O(n) time, giving us O(n³) time complexity.

For n=2000 (typical LeetCode constraint), n³ = 8×10⁹ operations, which is far too slow.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def checkPartitioning_brute(s: str) -> bool:
    n = len(s)

    # Helper to check if a substring is palindrome
    def is_palindrome(left, right):
        # Check characters from both ends moving toward center
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    # Try all possible split points
    for i in range(1, n-1):  # First split after at least 1 char
        for j in range(i+1, n):  # Second split after at least 1 more char
            # Check all three parts
            if (is_palindrome(0, i-1) and
                is_palindrome(i, j-1) and
                is_palindrome(j, n-1)):
                return True
    return False
```

```javascript
// Time: O(n³) | Space: O(1)
function checkPartitioningBrute(s) {
  const n = s.length;

  // Helper to check if substring is palindrome
  const isPalindrome = (left, right) => {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  };

  // Try all possible split points
  for (let i = 1; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isPalindrome(0, i - 1) && isPalindrome(i, j - 1) && isPalindrome(j, n - 1)) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(n³) | Space: O(1)
public boolean checkPartitioningBrute(String s) {
    int n = s.length();

    // Helper to check if substring is palindrome
    for (int i = 1; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (isPalindrome(s, 0, i - 1) &&
                isPalindrome(s, i, j - 1) &&
                isPalindrome(s, j, n - 1)) {
                return true;
            }
        }
    }
    return false;
}

private boolean isPalindrome(String s, int left, int right) {
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}
```

</div>

## Optimized Approach

The bottleneck in the brute force is repeatedly checking the same substrings for palindrome property. We can optimize by precomputing all palindrome information using dynamic programming.

**Key Insight**: Create a 2D DP table `isPal[i][j]` that stores whether substring `s[i:j+1]` is a palindrome. We can build this table in O(n²) time using the following recurrence:

1. Single character: `isPal[i][i] = true` (all single chars are palindromes)
2. Two characters: `isPal[i][i+1] = (s[i] == s[i+1])`
3. Longer strings: `isPal[i][j] = (s[i] == s[j]) && isPal[i+1][j-1]`

We need to fill the table in increasing order of substring length to ensure `isPal[i+1][j-1]` is already computed.

Once we have this table, checking if a substring is palindrome becomes O(1) lookup. Then we can:

1. For each possible first split `i` (1 to n-2)
2. For each possible second split `j` (i+1 to n-1)
3. Check all three parts in O(1) time using the precomputed table

This reduces the overall time to O(n²) for building the table + O(n²) for checking splits = O(n²) total.

## Optimal Solution

We implement the DP approach with careful attention to indexing. The solution has two phases:

1. Build palindrome DP table
2. Check all valid splits using the table

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def checkPartitioning(s: str) -> bool:
    n = len(s)

    # Step 1: Precompute palindrome information using DP
    # is_pal[i][j] = True if s[i:j+1] is palindrome
    is_pal = [[False] * n for _ in range(n)]

    # Fill the DP table
    # We fill by increasing substring length
    for length in range(1, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1  # End index

            if length == 1:
                # Single character is always palindrome
                is_pal[i][j] = True
            elif length == 2:
                # Two characters: check if they're equal
                is_pal[i][j] = (s[i] == s[j])
            else:
                # Longer substring: check ends and inner substring
                is_pal[i][j] = (s[i] == s[j] and is_pal[i + 1][j - 1])

    # Step 2: Check all possible splits
    # i = end of first substring (exclusive), so first substring is s[0:i]
    # j = end of second substring (exclusive), so second substring is s[i:j]
    # Third substring is s[j:n]
    for i in range(1, n - 1):  # First split: at least 1 char, leave room for 2 more
        for j in range(i + 1, n):  # Second split: at least 1 char, leave room for 1 more
            # Check all three parts using precomputed table
            if is_pal[0][i - 1] and is_pal[i][j - 1] and is_pal[j][n - 1]:
                return True

    return False
```

```javascript
// Time: O(n²) | Space: O(n²)
function checkPartitioning(s) {
  const n = s.length;

  // Step 1: Precompute palindrome information using DP
  // isPal[i][j] = true if s[i..j] is palindrome
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));

  // Fill the DP table by increasing substring length
  for (let length = 1; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1; // End index

      if (length === 1) {
        // Single character is always palindrome
        isPal[i][j] = true;
      } else if (length === 2) {
        // Two characters: check if equal
        isPal[i][j] = s[i] === s[j];
      } else {
        // Longer substring: check ends and inner substring
        isPal[i][j] = s[i] === s[j] && isPal[i + 1][j - 1];
      }
    }
  }

  // Step 2: Check all possible splits
  // i = end of first substring (exclusive)
  // j = end of second substring (exclusive)
  for (let i = 1; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isPal[0][i - 1] && isPal[i][j - 1] && isPal[j][n - 1]) {
        return true;
      }
    }
  }

  return false;
}
```

```java
// Time: O(n²) | Space: O(n²)
public boolean checkPartitioning(String s) {
    int n = s.length();

    // Step 1: Precompute palindrome information using DP
    // isPal[i][j] = true if s[i..j] is palindrome
    boolean[][] isPal = new boolean[n][n];

    // Fill the DP table by increasing substring length
    for (int length = 1; length <= n; length++) {
        for (int i = 0; i <= n - length; i++) {
            int j = i + length - 1;  // End index

            if (length == 1) {
                // Single character is always palindrome
                isPal[i][j] = true;
            } else if (length == 2) {
                // Two characters: check if equal
                isPal[i][j] = (s.charAt(i) == s.charAt(j));
            } else {
                // Longer substring: check ends and inner substring
                isPal[i][j] = (s.charAt(i) == s.charAt(j) && isPal[i + 1][j - 1]);
            }
        }
    }

    // Step 2: Check all possible splits
    // i = end of first substring (exclusive)
    // j = end of second substring (exclusive)
    for (int i = 1; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (isPal[0][i - 1] && isPal[i][j - 1] && isPal[j][n - 1]) {
                return true;
            }
        }
    }

    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²)

- Building the DP table takes O(n²) time. We iterate over all substring lengths (1 to n), and for each length, we iterate over all starting positions.
- Checking all possible splits takes O(n²) time in the worst case (nested loops over i and j).
- Total: O(n²) + O(n²) = O(n²)

**Space Complexity**: O(n²)

- We store an n×n boolean DP table to cache palindrome information.
- This could be optimized to O(n) using a different palindrome checking approach (like expanding from centers), but the O(n²) DP approach is more straightforward and easier to implement correctly in an interview.

## Common Mistakes

1. **Off-by-one errors in split indices**: The most common mistake is getting the indices wrong when checking substrings. Remember: `s[i:j]` in Python includes characters from index `i` to `j-1`. In the DP table, `isPal[i][j]` represents `s[i]` to `s[j]` inclusive. Be consistent with inclusive/exclusive indexing.

2. **Not handling base cases in DP**: Forgetting to initialize single-character and two-character palindromes correctly. Single characters are always palindromes. Two characters form a palindrome only if they're equal.

3. **Accessing out-of-bounds in DP recurrence**: When checking `isPal[i+1][j-1]` for `length > 2`, ensure `i+1 <= j-1`. This is automatically handled when we fill by increasing length, since for `length=3`, `i+1` and `j-1` refer to a substring of length 1 which we've already computed.

4. **Early termination optimization missed**: Some candidates check all O(n²) splits even when unnecessary. We could optimize by first finding all valid first splits, then for each, finding valid second splits. This doesn't change worst-case complexity but can be faster in practice.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Palindrome DP Table**: The technique of precomputing all substring palindromes using DP appears in:
   - [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/): Minimum cuts to partition string into palindromes
   - [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/): Find the longest palindrome substring
   - [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/): Count all palindrome substrings

2. **Partitioning Problems**: Problems that ask to split a string/array into k parts with certain properties:
   - [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/): Return all possible palindrome partitions
   - [Partition Labels](https://leetcode.com/problems/partition-labels/): Partition string into as many parts as possible where each letter appears in at most one part

## Key Takeaways

1. **When you need to answer many substring queries, precompute**: If a problem requires checking properties of many substrings (like "is this substring a palindrome?"), consider building a DP table or other data structure to answer queries in O(1) time.

2. **Palindrome DP has a standard pattern**: The recurrence `isPal[i][j] = (s[i] == s[j]) && isPal[i+1][j-1]` with proper base cases is worth memorizing. Fill the table in increasing order of substring length.

3. **Partitioning into k parts often involves checking O(n^(k-1)) splits**: For partitioning into 3 parts, we check O(n²) splits. For k parts, it would be O(n^(k-1)). Look for ways to optimize with precomputation or early pruning.

Related problems: [Palindrome Partitioning](/problem/palindrome-partitioning), [Palindrome Partitioning II](/problem/palindrome-partitioning-ii), [Palindrome Partitioning III](/problem/palindrome-partitioning-iii)
