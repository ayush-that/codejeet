---
title: "How to Solve Palindrome Partitioning II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Palindrome Partitioning II. Hard difficulty, 36.6% acceptance rate. Topics: String, Dynamic Programming."
date: "2027-08-05"
category: "dsa-patterns"
tags: ["palindrome-partitioning-ii", "string", "dynamic-programming", "hard"]
---

# How to Solve Palindrome Partitioning II

Given a string `s`, we need to find the minimum number of cuts required to partition the string such that every resulting substring is a palindrome. For example, with `s = "aab"`, we could cut after the first 'a' to get `["aa", "b"]` (1 cut), which is better than cutting after each character `["a", "a", "b"]` (2 cuts).

What makes this problem tricky is that we need to consider **all possible partitions** while efficiently checking palindromes. A naive approach would explore every possible cut position, leading to exponential time complexity. The challenge is to optimize both palindrome checking and cut calculation using dynamic programming.

## Visual Walkthrough

Let's trace through `s = "aab"` step by step:

**Step 1: Understanding the goal**
We want to partition "aab" into palindromic substrings with minimum cuts:

- Option 1: ["a", "a", "b"] → 2 cuts (after first 'a', after second 'a')
- Option 2: ["aa", "b"] → 1 cut (after "aa")
- Option 3: ["a", "ab"] → invalid ("ab" is not a palindrome)
- Option 4: ["aab"] → invalid ("aab" is not a palindrome)

The minimum is 1 cut.

**Step 2: How dynamic programming helps**
We can think of this as: for each position `i` in the string, what's the minimum cuts needed for the substring `s[0:i+1]`?

Let `dp[i]` = minimum cuts for substring `s[0:i+1]` (first i+1 characters).

**Step 3: Building the solution**
For `s = "aab"`:

- `dp[0]` for "a": 0 cuts (single character is always palindrome)
- `dp[1]` for "aa":
  - Check if entire "aa" is palindrome → yes, so 0 cuts
  - Or check "a" + "a": `dp[0] + 1` = 1 cut
  - Minimum is 0
- `dp[2]` for "aab":
  - Check entire "aab" → not palindrome
  - Check "aa" + "b": `dp[1] + 1` = 0 + 1 = 1 cut
  - Check "a" + "ab": `dp[0] + 1` = 0 + 1 = 1 cut, but "ab" not palindrome
  - Minimum is 1

**Step 4: The optimization**
Instead of checking every possible partition at each step (which would be O(n²) checks with O(n) palindrome verification each), we can precompute all palindrome substrings using another DP table.

## Brute Force Approach

The brute force solution would recursively try every possible cut position:

1. For each possible cut position `i` (from 1 to n-1)
2. Check if the left part `s[0:i]` is a palindrome
3. If yes, recursively find minimum cuts for the right part `s[i:]`
4. Take the minimum of all valid partitions

This approach has exponential time complexity O(n·2ⁿ) because:

- There are 2ⁿ⁻¹ possible partitions of a string of length n
- Each palindrome check takes O(n) time
- Total: O(n·2ⁿ)

The code would look like:

<div class="code-group">

```python
# Brute force - too slow for large inputs
def minCut_brute(s: str) -> int:
    def is_palindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    def dfs(start):
        if start == len(s) or is_palindrome(start, len(s)-1):
            return 0

        min_cuts = float('inf')
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                min_cuts = min(min_cuts, 1 + dfs(end + 1))
        return min_cuts

    return dfs(0)
```

```javascript
// Brute force - too slow for large inputs
function minCutBrute(s) {
  function isPalindrome(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }

  function dfs(start) {
    if (start === s.length || isPalindrome(start, s.length - 1)) {
      return 0;
    }

    let minCuts = Infinity;
    for (let end = start; end < s.length; end++) {
      if (isPalindrome(start, end)) {
        minCuts = Math.min(minCuts, 1 + dfs(end + 1));
      }
    }
    return minCuts;
  }

  return dfs(0);
}
```

```java
// Brute force - too slow for large inputs
public int minCutBrute(String s) {
    return dfs(s, 0);
}

private int dfs(String s, int start) {
    if (start == s.length() || isPalindrome(s, start, s.length() - 1)) {
        return 0;
    }

    int minCuts = Integer.MAX_VALUE;
    for (int end = start; end < s.length(); end++) {
        if (isPalindrome(s, start, end)) {
            minCuts = Math.min(minCuts, 1 + dfs(s, end + 1));
        }
    }
    return minCuts;
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

This brute force solution fails for strings longer than about 15-20 characters due to exponential time complexity.

## Optimized Approach

The key insight is to use **two dynamic programming tables**:

1. **Palindrome DP table**: `isPal[i][j]` = whether substring `s[i:j+1]` is a palindrome
   - Base case: Single characters are palindromes: `isPal[i][i] = true`
   - Two characters: `isPal[i][i+1] = (s[i] == s[i+1])`
   - Longer: `isPal[i][j] = (s[i] == s[j] && isPal[i+1][j-1])`
   - We fill this table in a way that ensures `isPal[i+1][j-1]` is already computed

2. **Cuts DP table**: `dp[i]` = minimum cuts for substring `s[0:i+1]`
   - Base case: `dp[0] = 0` (single character needs no cuts)
   - For each position `i`, if `s[0:i+1]` is a palindrome, `dp[i] = 0`
   - Otherwise, try all possible cut positions `j` where `s[j+1:i+1]` is a palindrome:
     `dp[i] = min(dp[j] + 1)` for all `j < i` where `isPal[j+1][i]` is true

The optimization comes from:

- Precomputing all palindrome checks in O(n²) time
- Using the palindrome table for O(1) palindrome checks during cut calculation
- Overall O(n²) time complexity instead of exponential

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def minCut(s: str) -> int:
    n = len(s)

    # Step 1: Create palindrome DP table
    # is_pal[i][j] = True if s[i:j+1] is a palindrome
    is_pal = [[False] * n for _ in range(n)]

    # Fill the palindrome table
    # We fill by length, starting from length 1 up to n
    for i in range(n):
        is_pal[i][i] = True  # Single characters are palindromes

    # Check for palindromes of length 2
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            is_pal[i][i + 1] = True

    # Check for palindromes of length 3 and more
    # length represents the length of substring we're checking
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            # A string is palindrome if first and last chars match
            # and the inner substring is also palindrome
            if s[i] == s[j] and is_pal[i + 1][j - 1]:
                is_pal[i][j] = True

    # Step 2: Create cuts DP table
    # dp[i] = minimum cuts for substring s[0:i+1]
    dp = [0] * n

    for i in range(n):
        # If the entire substring s[0:i+1] is palindrome, no cuts needed
        if is_pal[0][i]:
            dp[i] = 0
        else:
            # Initialize with maximum possible cuts (cut after each character)
            min_cuts = i

            # Try all possible cut positions
            # Cut at position j means we partition into s[0:j+1] and s[j+1:i+1]
            for j in range(i):
                # If right part s[j+1:i+1] is palindrome
                if is_pal[j + 1][i]:
                    # Total cuts = cuts for left part + 1 cut for this partition
                    min_cuts = min(min_cuts, dp[j] + 1)

            dp[i] = min_cuts

    return dp[n - 1]
```

```javascript
// Time: O(n²) | Space: O(n²)
function minCut(s) {
  const n = s.length;

  // Step 1: Create palindrome DP table
  // isPal[i][j] = true if s[i:j+1] is a palindrome
  const isPal = Array(n)
    .fill()
    .map(() => Array(n).fill(false));

  // Fill the palindrome table
  // Single characters are palindromes
  for (let i = 0; i < n; i++) {
    isPal[i][i] = true;
  }

  // Check for palindromes of length 2
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      isPal[i][i + 1] = true;
    }
  }

  // Check for palindromes of length 3 and more
  // length represents the length of substring we're checking
  for (let length = 3; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      // A string is palindrome if first and last chars match
      // and the inner substring is also palindrome
      if (s[i] === s[j] && isPal[i + 1][j - 1]) {
        isPal[i][j] = true;
      }
    }
  }

  // Step 2: Create cuts DP table
  // dp[i] = minimum cuts for substring s[0:i+1]
  const dp = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    // If the entire substring s[0:i+1] is palindrome, no cuts needed
    if (isPal[0][i]) {
      dp[i] = 0;
    } else {
      // Initialize with maximum possible cuts (cut after each character)
      let minCuts = i;

      // Try all possible cut positions
      // Cut at position j means we partition into s[0:j+1] and s[j+1:i+1]
      for (let j = 0; j < i; j++) {
        // If right part s[j+1:i+1] is palindrome
        if (isPal[j + 1][i]) {
          // Total cuts = cuts for left part + 1 cut for this partition
          minCuts = Math.min(minCuts, dp[j] + 1);
        }
      }

      dp[i] = minCuts;
    }
  }

  return dp[n - 1];
}
```

```java
// Time: O(n²) | Space: O(n²)
public int minCut(String s) {
    int n = s.length();

    // Step 1: Create palindrome DP table
    // isPal[i][j] = true if s.substring(i, j+1) is a palindrome
    boolean[][] isPal = new boolean[n][n];

    // Fill the palindrome table
    // Single characters are palindromes
    for (int i = 0; i < n; i++) {
        isPal[i][i] = true;
    }

    // Check for palindromes of length 2
    for (int i = 0; i < n - 1; i++) {
        if (s.charAt(i) == s.charAt(i + 1)) {
            isPal[i][i + 1] = true;
        }
    }

    // Check for palindromes of length 3 and more
    // length represents the length of substring we're checking
    for (int length = 3; length <= n; length++) {
        for (int i = 0; i <= n - length; i++) {
            int j = i + length - 1;
            // A string is palindrome if first and last chars match
            // and the inner substring is also palindrome
            if (s.charAt(i) == s.charAt(j) && isPal[i + 1][j - 1]) {
                isPal[i][j] = true;
            }
        }
    }

    // Step 2: Create cuts DP table
    // dp[i] = minimum cuts for substring s.substring(0, i+1)
    int[] dp = new int[n];

    for (int i = 0; i < n; i++) {
        // If the entire substring s.substring(0, i+1) is palindrome, no cuts needed
        if (isPal[0][i]) {
            dp[i] = 0;
        } else {
            // Initialize with maximum possible cuts (cut after each character)
            int minCuts = i;

            // Try all possible cut positions
            // Cut at position j means we partition into s.substring(0, j+1) and s.substring(j+1, i+1)
            for (int j = 0; j < i; j++) {
                // If right part s.substring(j+1, i+1) is palindrome
                if (isPal[j + 1][i]) {
                    // Total cuts = cuts for left part + 1 cut for this partition
                    minCuts = Math.min(minCuts, dp[j] + 1);
                }
            }

            dp[i] = minCuts;
        }
    }

    return dp[n - 1];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Building the palindrome table: O(n²) - we check all n² possible substrings
- Filling the cuts DP table: O(n²) - for each position i, we check all j < i
- Total: O(n²) + O(n²) = O(n²)

**Space Complexity: O(n²)**

- The palindrome table stores n² boolean values
- The cuts DP table stores n integers
- Dominated by O(n²) for the palindrome table

**Why this is optimal:**

- We must check all possible substrings for palindromes, which is Ω(n²)
- We must consider all possible cut positions, which is also Ω(n²)
- Therefore, O(n²) is the best possible time complexity for this problem

## Common Mistakes

1. **Incorrect palindrome table filling order**: The palindrome check `isPal[i][j] = (s[i] == s[j] && isPal[i+1][j-1])` requires that `isPal[i+1][j-1]` is already computed. Filling the table by rows (i from 0 to n-1, j from 0 to n-1) won't work. We must fill by increasing substring length.

2. **Off-by-one errors in indices**: When checking `isPal[j+1][i]` in the cuts calculation, remember that j represents the last character of the left partition. The right partition starts at j+1. Getting this wrong leads to incorrect results.

3. **Not handling single and double character palindromes separately**: The recurrence `isPal[i][j] = (s[i] == s[j] && isPal[i+1][j-1])` doesn't work for length 2 substrings because `i+1 > j-1`. We need base cases for length 1 and 2.

4. **Initializing dp[i] incorrectly**: When s[0:i+1] is not a palindrome, we should initialize dp[i] to the maximum possible cuts (i cuts, one after each character), not to 0 or a large constant that might overflow.

## When You'll See This Pattern

This "double DP" pattern appears in problems where you need to:

1. Check many substrings for some property (palindrome, matching, etc.)
2. Make optimization decisions based on those properties

**Related problems:**

1. **Palindrome Partitioning (LeetCode 131)**: The easier version where you return all possible palindrome partitions instead of just the minimum cuts. Uses similar palindrome checking but with backtracking instead of DP optimization.

2. **Palindrome Partitioning IV (LeetCode 1745)**: Checks if a string can be partitioned into exactly three palindromic substrings. Uses the same palindrome table technique.

3. **Longest Palindromic Substring (LeetCode 5)**: Also uses a 2D DP table to track palindromes, though for a different purpose (finding the longest one).

4. **Word Break (LeetCode 139)**: Similar structure but checks dictionary membership instead of palindromes. Uses a 1D DP array where dp[i] = whether s[0:i] can be segmented.

## Key Takeaways

1. **When you need to check many substrings for a property, precompute a DP table**. The O(1) lookup saves repeated O(n) checks.

2. **For partition problems, think about the last cut**. The optimal solution for the whole string comes from optimal solutions for prefixes plus the cost of the last partition.

3. **Pay attention to base cases and filling order in 2D DP tables**. The order matters when cell values depend on other cells that haven't been computed yet.

4. **This is a classic "DP on strings" pattern**: Combine substring property checking (2D DP) with optimization (1D DP) for O(n²) solutions to problems that seem exponential.

Related problems: [Palindrome Partitioning](/problem/palindrome-partitioning), [Palindrome Partitioning IV](/problem/palindrome-partitioning-iv), [Maximum Number of Non-overlapping Palindrome Substrings](/problem/maximum-number-of-non-overlapping-palindrome-substrings)
