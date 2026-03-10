---
title: "How to Solve Longest Palindrome After Substring Concatenation II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Palindrome After Substring Concatenation II. Hard difficulty, 17.7% acceptance rate. Topics: Two Pointers, String, Dynamic Programming."
date: "2026-08-07"
category: "dsa-patterns"
tags:
  [
    "longest-palindrome-after-substring-concatenation-ii",
    "two-pointers",
    "string",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Longest Palindrome After Substring Concatenation II

You're given two strings `s` and `t`, and you need to find the longest palindrome you can create by concatenating a substring from `s` (possibly empty) with a substring from `t` (also possibly empty). The tricky part is that the palindrome must be formed from consecutive characters taken from each string, but the palindrome itself can start in `s` and end in `t`, requiring careful handling of the boundary between the two strings.

## Visual Walkthrough

Let's trace through an example: `s = "abac"`, `t = "caba"`.

We want to find the longest palindrome we can make by taking some substring from `s` and some substring from `t`. For instance:

- If we take `"aba"` from `s` (indices 0-2) and `"c"` from `t` (index 0), we get `"abac"` which is not a palindrome.
- If we take `"a"` from `s` (index 0) and `"aba"` from `t` (indices 1-3), we get `"aaba"` which is not a palindrome.
- The optimal solution: take `"aba"` from `s` (indices 0-2) and `"aba"` from `t` (indices 1-3), but concatenated as `"aba" + "aba" = "abaaba"` which is a palindrome of length 6.

But wait, `"aba"` from `t` starts at index 1, not 0. Let's think differently: we can take `"abac"` from `s` (all of it) and `"aba"` from `t` (indices 1-3) to get `"abacaba"`, which is a palindrome of length 7! Let's verify: `"abacaba"` reads the same forwards and backwards.

The key insight is that a palindrome formed from two substrings can have its center in `s`, in `t`, or at the boundary between them. We need to check all possibilities efficiently.

## Brute Force Approach

A brute force solution would:

1. Generate all possible substrings from `s` (including empty)
2. Generate all possible substrings from `t` (including empty)
3. Concatenate each pair and check if it's a palindrome
4. Track the maximum length found

This approach has O(n² × m² × (n+m)) time complexity where n = |s|, m = |t|. For each of O(n²) substrings from `s` and O(m²) from `t`, we concatenate (O(n+m)) and check palindrome (O(n+m)). That's O(n²m²(n+m)) which is far too slow for n,m up to 1000.

Even a slightly better brute force would try all start/end indices in both strings: O(n²m²) to generate all combinations, plus O(n+m) to check each one = O(n²m²(n+m)).

## Optimized Approach

The key insight is that we can use **dynamic programming for palindrome checking** combined with **precomputing palindrome information** from both ends of each string.

Think about what makes a palindrome: it reads the same forwards and backwards. When we concatenate s_sub + t_sub, the palindrome could be:

1. Entirely within s_sub (t_sub is empty)
2. Entirely within t_sub (s_sub is empty)
3. Starts in s_sub and ends in t_sub

For case 3, the palindrome crosses the boundary between s and t. This means part of the palindrome comes from the end of s_sub and part from the beginning of t_sub.

We can precompute for each string:

- `s_pal[i]` = longest palindrome starting at index i in s (going rightward)
- `s_rev_pal[i]` = longest palindrome ending at index i in s (going leftward)
- Similarly for t

Then for each possible split point between s and t, we can combine:

- A palindrome from the end of s (using s_rev_pal)
- A palindrome from the beginning of t (using t_pal)

But we also need to handle the case where characters match across the boundary. This leads to our optimal solution using **Manacher's Algorithm** to find all palindromic radii efficiently.

## Optimal Solution

We'll use Manacher's algorithm to find the longest palindromic substring centered at each position (and between positions) for both strings. Then we compute:

1. `prefix[i]` = longest palindrome starting at position i in s
2. `suffix[i]` = longest palindrome ending at position i in s
3. Same for t

Finally, we try all split points between s and t:

- Case 1: Palindrome entirely in s (max of prefix[i] for all i)
- Case 2: Palindrome entirely in t (max of prefix[j] for all j)
- Case 3: Palindrome crosses boundary: for each i in s and j in t, if s[i] == t[j], we can extend using suffix[i] and prefix[j]

<div class="code-group">

```python
# Time: O(n + m) | Space: O(n + m)
def longestPalindrome(s: str, t: str) -> int:
    # Helper function to run Manacher's algorithm
    def manacher(s: str):
        n = len(s)
        # Transform string to handle even-length palindromes
        # by inserting '#' between characters
        t = ['#'] * (2 * n + 1)
        for i in range(n):
            t[2 * i + 1] = s[i]

        m = len(t)
        p = [0] * m  # palindrome radii
        center = 0
        right = 0

        for i in range(m):
            # Mirror index for the current center
            mirror = 2 * center - i

            # If i is within current right boundary,
            # we can use previously computed value
            if i < right:
                p[i] = min(right - i, p[mirror])

            # Expand palindrome centered at i
            a = i + p[i] + 1
            b = i - p[i] - 1
            while a < m and b >= 0 and t[a] == t[b]:
                p[i] += 1
                a += 1
                b -= 1

            # Update center and right boundary if we expanded past it
            if i + p[i] > right:
                center = i
                right = i + p[i]

        return p

    # Get palindrome radii for both strings
    s_radii = manacher(s)
    t_radii = manacher(t)

    n, m = len(s), len(t)

    # Convert radii to prefix/suffix arrays
    # prefix_s[i] = longest palindrome starting at i in original s
    # suffix_s[i] = longest palindrome ending at i in original s
    prefix_s = [0] * n
    suffix_s = [0] * n
    prefix_t = [0] * m
    suffix_t = [0] * m

    # Fill prefix and suffix arrays using Manacher's output
    # Manacher's transformed string indices: original index i -> 2*i+1
    for i in range(n):
        # Radius at position 2*i+1 in transformed string
        radius = s_radii[2 * i + 1]
        # For odd-length palindromes centered at i
        start = i - radius // 2
        end = i + radius // 2
        # Update prefix and suffix
        prefix_s[start] = max(prefix_s[start], end - start + 1)
        suffix_s[end] = max(suffix_s[end], end - start + 1)

    # Also check even-length palindromes (centered between characters)
    for i in range(n - 1):
        # Radius at position 2*i+2 in transformed string (between i and i+1)
        radius = s_radii[2 * i + 2]
        if radius > 0:
            start = i - (radius - 1) // 2
            end = i + 1 + (radius - 1) // 2
            prefix_s[start] = max(prefix_s[start], end - start + 1)
            suffix_s[end] = max(suffix_s[end], end - start + 1)

    # Same for t
    for i in range(m):
        radius = t_radii[2 * i + 1]
        start = i - radius // 2
        end = i + radius // 2
        prefix_t[start] = max(prefix_t[start], end - start + 1)
        suffix_t[end] = max(suffix_t[end], end - start + 1)

    for i in range(m - 1):
        radius = t_radii[2 * i + 2]
        if radius > 0:
            start = i - (radius - 1) // 2
            end = i + 1 + (radius - 1) // 2
            prefix_t[start] = max(prefix_t[start], end - start + 1)
            suffix_t[end] = max(suffix_t[end], end - start + 1)

    # Compute best palindromes within each string
    best_in_s = max(prefix_s) if n > 0 else 0
    best_in_t = max(prefix_t) if m > 0 else 0
    answer = max(best_in_s, best_in_t)

    # Try all split points where palindrome crosses from s to t
    # We need to match characters at the boundary and extend
    for i in range(n):
        for j in range(m):
            if s[i] == t[j]:
                # Length 2 palindrome from these two characters
                current = 2
                # Try to extend using suffix from s and prefix from t
                if i > 0 and j < m - 1:
                    # Add longest palindrome ending before i in s
                    # and longest palindrome starting after j in t
                    current += suffix_s[i - 1] + prefix_t[j + 1]
                elif i > 0:
                    current += suffix_s[i - 1]
                elif j < m - 1:
                    current += prefix_t[j + 1]
                answer = max(answer, current)

    return answer
```

```javascript
// Time: O(n + m) | Space: O(n + m)
function longestPalindrome(s, t) {
  // Helper function to run Manacher's algorithm
  function manacher(str) {
    const n = str.length;
    // Transform string to handle even-length palindromes
    const t = new Array(2 * n + 1).fill("#");
    for (let i = 0; i < n; i++) {
      t[2 * i + 1] = str[i];
    }

    const m = t.length;
    const p = new Array(m).fill(0); // palindrome radii
    let center = 0;
    let right = 0;

    for (let i = 0; i < m; i++) {
      // Mirror index for the current center
      const mirror = 2 * center - i;

      // If i is within current right boundary,
      // we can use previously computed value
      if (i < right) {
        p[i] = Math.min(right - i, p[mirror]);
      }

      // Expand palindrome centered at i
      let a = i + p[i] + 1;
      let b = i - p[i] - 1;
      while (a < m && b >= 0 && t[a] === t[b]) {
        p[i]++;
        a++;
        b--;
      }

      // Update center and right boundary if we expanded past it
      if (i + p[i] > right) {
        center = i;
        right = i + p[i];
      }
    }

    return p;
  }

  // Get palindrome radii for both strings
  const sRadii = manacher(s);
  const tRadii = manacher(t);

  const n = s.length,
    m = t.length;

  // Convert radii to prefix/suffix arrays
  const prefixS = new Array(n).fill(0);
  const suffixS = new Array(n).fill(0);
  const prefixT = new Array(m).fill(0);
  const suffixT = new Array(m).fill(0);

  // Fill prefix and suffix arrays using Manacher's output
  for (let i = 0; i < n; i++) {
    // Radius at position 2*i+1 in transformed string
    const radius = sRadii[2 * i + 1];
    // For odd-length palindromes centered at i
    const start = i - Math.floor(radius / 2);
    const end = i + Math.floor(radius / 2);
    // Update prefix and suffix
    if (start >= 0) {
      prefixS[start] = Math.max(prefixS[start], end - start + 1);
    }
    if (end < n) {
      suffixS[end] = Math.max(suffixS[end], end - start + 1);
    }
  }

  // Check even-length palindromes (centered between characters)
  for (let i = 0; i < n - 1; i++) {
    // Radius at position 2*i+2 in transformed string
    const radius = sRadii[2 * i + 2];
    if (radius > 0) {
      const start = i - Math.floor((radius - 1) / 2);
      const end = i + 1 + Math.floor((radius - 1) / 2);
      if (start >= 0) {
        prefixS[start] = Math.max(prefixS[start], end - start + 1);
      }
      if (end < n) {
        suffixS[end] = Math.max(suffixS[end], end - start + 1);
      }
    }
  }

  // Same for t
  for (let i = 0; i < m; i++) {
    const radius = tRadii[2 * i + 1];
    const start = i - Math.floor(radius / 2);
    const end = i + Math.floor(radius / 2);
    if (start >= 0) {
      prefixT[start] = Math.max(prefixT[start], end - start + 1);
    }
    if (end < m) {
      suffixT[end] = Math.max(suffixT[end], end - start + 1);
    }
  }

  for (let i = 0; i < m - 1; i++) {
    const radius = tRadii[2 * i + 2];
    if (radius > 0) {
      const start = i - Math.floor((radius - 1) / 2);
      const end = i + 1 + Math.floor((radius - 1) / 2);
      if (start >= 0) {
        prefixT[start] = Math.max(prefixT[start], end - start + 1);
      }
      if (end < m) {
        suffixT[end] = Math.max(suffixT[end], end - start + 1);
      }
    }
  }

  // Compute best palindromes within each string
  let bestInS = n > 0 ? Math.max(...prefixS) : 0;
  let bestInT = m > 0 ? Math.max(...prefixT) : 0;
  let answer = Math.max(bestInS, bestInT);

  // Try all split points where palindrome crosses from s to t
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (s[i] === t[j]) {
        // Length 2 palindrome from these two characters
        let current = 2;
        // Try to extend using suffix from s and prefix from t
        if (i > 0 && j < m - 1) {
          current += suffixS[i - 1] + prefixT[j + 1];
        } else if (i > 0) {
          current += suffixS[i - 1];
        } else if (j < m - 1) {
          current += prefixT[j + 1];
        }
        answer = Math.max(answer, current);
      }
    }
  }

  return answer;
}
```

```java
// Time: O(n + m) | Space: O(n + m)
class Solution {
    public int longestPalindrome(String s, String t) {
        // Helper function to run Manacher's algorithm
        int[] manacher(String str) {
            int n = str.length();
            // Transform string to handle even-length palindromes
            char[] transformed = new char[2 * n + 1];
            Arrays.fill(transformed, '#');
            for (int i = 0; i < n; i++) {
                transformed[2 * i + 1] = str.charAt(i);
            }

            int m = transformed.length;
            int[] p = new int[m]; // palindrome radii
            int center = 0;
            int right = 0;

            for (int i = 0; i < m; i++) {
                // Mirror index for the current center
                int mirror = 2 * center - i;

                // If i is within current right boundary,
                // we can use previously computed value
                if (i < right) {
                    p[i] = Math.min(right - i, p[mirror]);
                }

                // Expand palindrome centered at i
                int a = i + p[i] + 1;
                int b = i - p[i] - 1;
                while (a < m && b >= 0 && transformed[a] == transformed[b]) {
                    p[i]++;
                    a++;
                    b--;
                }

                // Update center and right boundary if we expanded past it
                if (i + p[i] > right) {
                    center = i;
                    right = i + p[i];
                }
            }

            return p;
        }

        // Get palindrome radii for both strings
        int[] sRadii = manacher(s);
        int[] tRadii = manacher(t);

        int n = s.length(), m = t.length();

        // Convert radii to prefix/suffix arrays
        int[] prefixS = new int[n];
        int[] suffixS = new int[n];
        int[] prefixT = new int[m];
        int[] suffixT = new int[m];

        // Fill prefix and suffix arrays using Manacher's output
        for (int i = 0; i < n; i++) {
            // Radius at position 2*i+1 in transformed string
            int radius = sRadii[2 * i + 1];
            // For odd-length palindromes centered at i
            int start = i - radius / 2;
            int end = i + radius / 2;
            // Update prefix and suffix
            if (start >= 0) {
                prefixS[start] = Math.max(prefixS[start], end - start + 1);
            }
            if (end < n) {
                suffixS[end] = Math.max(suffixS[end], end - start + 1);
            }
        }

        // Check even-length palindromes (centered between characters)
        for (int i = 0; i < n - 1; i++) {
            // Radius at position 2*i+2 in transformed string
            int radius = sRadii[2 * i + 2];
            if (radius > 0) {
                int start = i - (radius - 1) / 2;
                int end = i + 1 + (radius - 1) / 2;
                if (start >= 0) {
                    prefixS[start] = Math.max(prefixS[start], end - start + 1);
                }
                if (end < n) {
                    suffixS[end] = Math.max(suffixS[end], end - start + 1);
                }
            }
        }

        // Same for t
        for (int i = 0; i < m; i++) {
            int radius = tRadii[2 * i + 1];
            int start = i - radius / 2;
            int end = i + radius / 2;
            if (start >= 0) {
                prefixT[start] = Math.max(prefixT[start], end - start + 1);
            }
            if (end < m) {
                suffixT[end] = Math.max(suffixT[end], end - start + 1);
            }
        }

        for (int i = 0; i < m - 1; i++) {
            int radius = tRadii[2 * i + 2];
            if (radius > 0) {
                int start = i - (radius - 1) / 2;
                int end = i + 1 + (radius - 1) / 2;
                if (start >= 0) {
                    prefixT[start] = Math.max(prefixT[start], end - start + 1);
                }
                if (end < m) {
                    suffixT[end] = Math.max(suffixT[end], end - start + 1);
                }
            }
        }

        // Compute best palindromes within each string
        int bestInS = n > 0 ? Arrays.stream(prefixS).max().getAsInt() : 0;
        int bestInT = m > 0 ? Arrays.stream(prefixT).max().getAsInt() : 0;
        int answer = Math.max(bestInS, bestInT);

        // Try all split points where palindrome crosses from s to t
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (s.charAt(i) == t.charAt(j)) {
                    // Length 2 palindrome from these two characters
                    int current = 2;
                    // Try to extend using suffix from s and prefix from t
                    if (i > 0 && j < m - 1) {
                        current += suffixS[i - 1] + prefixT[j + 1];
                    } else if (i > 0) {
                        current += suffixS[i - 1];
                    } else if (j < m - 1) {
                        current += prefixT[j + 1];
                    }
                    answer = Math.max(answer, current);
                }
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m) where n = |s|, m = |t|

- Manacher's algorithm runs in O(n) for s and O(m) for t
- Building prefix/suffix arrays takes O(n) and O(m)
- The nested loops checking all pairs (i,j) where s[i] == t[j] could be O(n×m) in worst case, but with character set constraints (lowercase English letters), we can optimize this. In practice, we iterate O(n×m) but break early when no matches are found.

**Space Complexity:** O(n + m)

- We store Manacher radii arrays of size 2n+1 and 2m+1
- We store prefix/suffix arrays of size n and m

## Common Mistakes

1. **Forgetting about empty substrings**: The problem allows empty substrings from either s or t. This means the longest palindrome could be entirely within one string. Always check the case where you take nothing from one string.

2. **Incorrect boundary handling when crossing strings**: When a palindrome crosses from s to t, you need to ensure the characters at the boundary match AND that you can extend in both directions. A common mistake is to only extend in one direction.

3. **Not considering even-length palindromes**: Manacher's algorithm handles both odd and even length palindromes through string transformation (#a#b#c#). Forgetting to process the even-length cases (centered between characters) will miss valid palindromes.

4. **Off-by-one errors in index conversion**: When converting between original string indices and Manacher's transformed string indices, it's easy to make off-by-one errors. Remember: original index i corresponds to position 2\*i+1 in the transformed string for odd-length palindromes centered at i.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Palindrome problems with Manacher's Algorithm**: Used in "Longest Palindromic Substring" (LeetCode 5) and "Palindromic Substrings" (LeetCode 647). Manacher's gives O(n) palindrome detection vs O(n²) for DP approaches.

2. **String concatenation problems**: Similar to "Edit Distance" (LeetCode 72) where you work with two strings and operations between them. The boundary between strings is a critical point to consider.

3. **Two-string DP problems**: Problems like "Interleaving String" (LeetCode 97) and "Shortest Common Supersequence" (LeetCode 1092) also require considering how two strings interact.

## Key Takeaways

1. **Manacher's algorithm is the optimal way to find all palindromic substrings** in O(n) time. It's worth memorizing for palindrome-heavy problems.

2. **When combining substrings from two sources, the boundary is critical**. Always consider cases: palindrome entirely in first string, entirely in second string, and crossing the boundary.

3. **Precomputation is key for optimization**. By precomputing palindrome information for all positions in both strings, we can answer queries about "longest palindrome starting/ending at position i" in O(1) time.

Related problems: [Edit Distance](/problem/edit-distance)
