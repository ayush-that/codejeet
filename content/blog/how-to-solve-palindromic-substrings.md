---
title: "How to Solve Palindromic Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Palindromic Substrings. Medium difficulty, 72.6% acceptance rate. Topics: Two Pointers, String, Dynamic Programming."
date: "2026-09-13"
category: "dsa-patterns"
tags: ["palindromic-substrings", "two-pointers", "string", "dynamic-programming", "medium"]
---

# How to Solve Palindromic Substrings

Counting palindromic substrings is a classic medium-difficulty string problem that tests your ability to identify patterns and optimize checking for palindromes. The challenge comes from needing to count **all** possible substrings that are palindromes, not just find the longest one. A naive approach would check every substring individually, but that's too slow for larger inputs. The key insight is that palindromes expand outward from centers, and we can count all palindromes efficiently by considering each possible center.

## Visual Walkthrough

Let's trace through the example `s = "abcba"` to build intuition:

**Step 1: Understanding what we're counting**

- Single characters are always palindromes: "a", "b", "c", "b", "a" → 5 so far
- Two-character substrings: "ab" (no), "bc" (no), "cb" (no), "ba" (no) → 0 more
- Three-character substrings: "abc" (no), "bcb" (yes!), "cba" (no) → 1 more
- Four-character substrings: "abcb" (no), "bcba" (no) → 0 more
- Five-character substring: "abcba" (yes!) → 1 more
  Total: 5 + 1 + 1 = 7 palindromic substrings

**Step 2: The center expansion insight**
Instead of checking every substring (O(n²) substrings), notice that every palindrome has a center:

- Odd-length palindromes expand from a single character: "bcb" expands from "c"
- Even-length palindromes expand from between two characters: "aa" expands from between positions

For `"abcba"`:

- Center at index 0 ("a"): expands to just "a" (odd)
- Center at index 1 ("b"): expands to just "b" (odd)
- Center at index 2 ("c"): expands to "c", then "bcb", then "abcba" (odd)
- Center between 0-1: expands to nothing (even)
- Center between 1-2: expands to nothing (even)
- Center between 2-3: expands to nothing (even)
- Center between 3-4: expands to nothing (even)

Wait, we're missing "bb"! That's because we need to check both odd and even centers separately.

**Step 3: Systematic center expansion**
Let's count properly by checking all centers:

Odd-length centers (n = 5 centers at indices 0-4):

- i=0: "a" → count=1
- i=1: "b" → count=1
- i=2: "c", "bcb", "abcba" → count=3
- i=3: "b" → count=1
- i=4: "a" → count=1

Even-length centers (n-1 = 4 centers between indices):

- Between 0-1: "ab" (no) → count=0
- Between 1-2: "bc" (no) → count=0
- Between 2-3: "cb" (no) → count=0
- Between 3-4: "ba" (no) → count=0

Total: 1+1+3+1+1 = 7 palindromic substrings

## Brute Force Approach

The most straightforward solution is to check every possible substring:

1. Generate all possible substrings (start index i from 0 to n-1, end index j from i to n-1)
2. For each substring, check if it's a palindrome by comparing characters from both ends
3. Count the palindromes

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countSubstrings_brute(s: str) -> int:
    n = len(s)
    count = 0

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            # Check if substring s[i:j+1] is palindrome
            left, right = i, j
            is_palindrome = True

            while left < right:
                if s[left] != s[right]:
                    is_palindrome = False
                    break
                left += 1
                right -= 1

            if is_palindrome:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function countSubstringsBrute(s) {
  const n = s.length;
  let count = 0;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if substring s[i..j] is palindrome
      let left = i,
        right = j;
      let isPalindrome = true;

      while (left < right) {
        if (s[left] !== s[right]) {
          isPalindrome = false;
          break;
        }
        left++;
        right--;
      }

      if (isPalindrome) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countSubstringsBrute(String s) {
    int n = s.length();
    int count = 0;

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if substring s[i..j] is palindrome
            int left = i, right = j;
            boolean isPalindrome = true;

            while (left < right) {
                if (s.charAt(left) != s.charAt(right)) {
                    isPalindrome = false;
                    break;
                }
                left++;
                right--;
            }

            if (isPalindrome) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is inefficient:**

- There are O(n²) substrings to check
- Checking each substring takes O(k) time where k is substring length
- Worst case: O(n³) time complexity
- For n=1000, that's ~10⁹ operations → too slow

## Optimized Approach

The key insight is that instead of checking each substring independently, we can **expand around centers**. Every palindrome has a center:

- Odd-length palindromes: center is a single character (n possible centers)
- Even-length palindromes: center is between two characters (n-1 possible centers)

For each center, we expand outward as long as the characters match:

- Start with the center (odd) or empty string between centers (even)
- Expand left and right one step at a time
- Count each valid expansion as a new palindrome
- Stop when characters don't match or we hit string boundaries

This reduces the time complexity because:

- We only have 2n-1 centers to check (n + (n-1))
- For each center, expansion takes O(k) time but k is limited
- Total time becomes O(n²) instead of O(n³)

## Optimal Solution

Here's the complete solution using center expansion:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countSubstrings(s: str) -> int:
    n = len(s)
    count = 0

    # Helper function to expand around a center
    def expand_around_center(left: int, right: int) -> int:
        """Expand from center and count palindromes.
        Returns number of palindromes found from this center."""
        local_count = 0
        # Expand while within bounds and characters match
        while left >= 0 and right < n and s[left] == s[right]:
            local_count += 1  # Found a palindrome
            left -= 1         # Move left outward
            right += 1        # Move right outward
        return local_count

    # Check all possible centers
    for i in range(n):
        # Odd-length palindromes: single character center
        count += expand_around_center(i, i)

        # Even-length palindromes: center between characters
        count += expand_around_center(i, i + 1)

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countSubstrings(s) {
  const n = s.length;
  let count = 0;

  // Helper function to expand around a center
  function expandAroundCenter(left, right) {
    let localCount = 0;
    // Expand while within bounds and characters match
    while (left >= 0 && right < n && s[left] === s[right]) {
      localCount++; // Found a palindrome
      left--; // Move left outward
      right++; // Move right outward
    }
    return localCount;
  }

  // Check all possible centers
  for (let i = 0; i < n; i++) {
    // Odd-length palindromes: single character center
    count += expandAroundCenter(i, i);

    // Even-length palindromes: center between characters
    count += expandAroundCenter(i, i + 1);
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countSubstrings(String s) {
    int n = s.length();
    int count = 0;

    // Check all possible centers
    for (int i = 0; i < n; i++) {
        // Odd-length palindromes: single character center
        count += expandAroundCenter(s, i, i);

        // Even-length palindromes: center between characters
        count += expandAroundCenter(s, i, i + 1);
    }

    return count;
}

private int expandAroundCenter(String s, int left, int right) {
    int localCount = 0;
    int n = s.length();

    // Expand while within bounds and characters match
    while (left >= 0 && right < n && s.charAt(left) == s.charAt(right)) {
        localCount++;  // Found a palindrome
        left--;        // Move left outward
        right++;       // Move right outward
    }

    return localCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We check 2n-1 centers (n for odd-length, n-1 for even-length)
- For each center, expansion could take up to O(n) time in worst case
- Worst-case example: `"aaaaaaaa"` - each center expands to the full string
- Total: O(n) centers × O(n) expansion = O(n²)

**Space Complexity: O(1)**

- We only use a few integer variables (count, indices)
- No additional data structures needed
- The expansion happens in-place with pointers

## Common Mistakes

1. **Forgetting even-length palindromes**: Candidates often only check odd-length centers (single characters) and miss palindromes like "aa" or "abba". Remember to check both types of centers.

2. **Off-by-one errors in indices**: When expanding, it's easy to get the initial left/right indices wrong. For even centers, use `(i, i+1)` not `(i-1, i)`.

3. **Double-counting or incorrect counting**: Each valid expansion should count as one palindrome. Don't count the empty string or count the same palindrome multiple times.

4. **Inefficient palindrome checking**: Some candidates try to optimize by storing results in a DP table (which is valid but uses O(n²) space). The center expansion approach is usually preferred in interviews for its simplicity and O(1) space.

## When You'll See This Pattern

The "expand around center" pattern appears in several palindrome-related problems:

1. **Longest Palindromic Substring (LeetCode #5)**: Almost identical approach - expand from centers and track the longest palindrome found instead of counting all.

2. **Longest Palindromic Subsequence (LeetCode #516)**: While this uses dynamic programming instead of center expansion, it's another palindrome counting problem that tests similar recognition skills.

3. **Palindrome Partitioning (LeetCode #131)**: Uses palindrome checking as a subroutine, though the main algorithm is backtracking.

4. **Valid Palindrome II (LeetCode #680)**: Tests understanding of palindrome properties with the option to delete one character.

## Key Takeaways

1. **Center expansion is the go-to technique** for palindrome substring problems. When you see "palindromic substrings" in a problem statement, immediately think about expanding from centers.

2. **Remember both odd and even centers**. Palindromes can have single-character centers (odd length) or centers between characters (even length).

3. **The pattern scales well**. O(n²) time with O(1) space is usually acceptable for string problems where n ≤ 1000, making this approach both efficient and interview-friendly.

Related problems: [Longest Palindromic Substring](/problem/longest-palindromic-substring), [Longest Palindromic Subsequence](/problem/longest-palindromic-subsequence)
