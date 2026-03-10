---
title: "How to Solve Substring Matching Pattern — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Substring Matching Pattern. Easy difficulty, 28.3% acceptance rate. Topics: String, String Matching."
date: "2028-12-28"
category: "dsa-patterns"
tags: ["substring-matching-pattern", "string", "string-matching", "easy"]
---

# How to Solve Substring Matching Pattern

This problem asks us to determine if a pattern string `p` containing exactly one `'*'` character can match any substring of a string `s`. The `'*'` acts as a wildcard that can represent zero or more characters. What makes this problem interesting is that we're not matching the entire string like in typical wildcard matching—we're looking for any substring match, which adds an extra dimension of flexibility.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `s = "abcdefgh"`
- `p = "cd*fg"`

The pattern `"cd*fg"` has exactly one `'*'`. This means the pattern consists of:

1. A prefix: `"cd"` (characters before the `'*'`)
2. A suffix: `"fg"` (characters after the `'*'`)

For the pattern to match a substring of `s`, we need to find a position in `s` where:

- The prefix `"cd"` matches starting at some index `i`
- The suffix `"fg"` matches starting at some index `j` where `j ≥ i + len(prefix)`
- There can be any characters (zero or more) between the prefix and suffix matches

Let's trace through `s = "abcdefgh"`:

1. Look for prefix `"cd"` in `s`:
   - At index 0: `"ab"` ≠ `"cd"`
   - At index 1: `"bc"` ≠ `"cd"`
   - At index 2: `"cd"` = `"cd"` ✓ Found prefix match!

2. Now we need to find suffix `"fg"` somewhere after the prefix:
   - The prefix ends at index 3 (since `"cd"` is 2 characters, ending at index 3)
   - Look for `"fg"` starting from index 4 onward:
     - At index 4: `"ef"` ≠ `"fg"`
     - At index 5: `"fg"` = `"fg"` ✓ Found suffix match!

3. Check if positions are valid:
   - Prefix ends at index 3
   - Suffix starts at index 5
   - There's 1 character (`"e"`) between them, which is allowed since `'*'` can match any sequence

Since we found both prefix and suffix matches with valid positioning, the pattern matches! The `'*'` effectively matched the single character `"e"`.

## Brute Force Approach

A naive approach would be to try every possible substring of `s` and check if it matches the pattern. Since `'*'` can match any sequence, we'd need to:

1. Split the pattern into prefix and suffix at the `'*'`
2. For each starting position `i` in `s`:
   - Check if prefix matches starting at `i`
   - If yes, for each ending position `j` ≥ `i + len(prefix)`:
     - Check if suffix matches starting at `j`
     - If yes, return true

This approach has O(n³) time complexity in the worst case because:

- O(n) starting positions to check
- For each valid prefix match, O(n) possible ending positions for the suffix
- O(n) time to compare strings at each check

While this would work, it's too slow for longer strings. The key insight is that we don't need to check every possible gap between prefix and suffix—we just need to know if the suffix appears somewhere after the prefix.

## Optimal Solution

The optimal solution leverages the fact that we only have one `'*'`. We can:

1. Split the pattern into prefix and suffix at the `'*'`
2. Search for the prefix in `s` starting from each position
3. For each prefix match, check if the suffix appears somewhere after it
4. We can use efficient string searching to avoid O(n³) complexity

Here's the implementation:

<div class="code-group">

```python
# Time: O(n * m) where n = len(s), m = len(p)
# Space: O(1) - we only use constant extra space
def isSubstringMatch(s: str, p: str) -> bool:
    # Step 1: Split pattern into prefix and suffix at '*'
    # The '*' is guaranteed to exist exactly once
    prefix, suffix = p.split('*')

    # Step 2: Edge case - if pattern is just '*', it matches any substring
    # (including empty substring)
    if not prefix and not suffix:
        return True

    # Step 3: Try every possible starting position for prefix in s
    n = len(s)
    prefix_len = len(prefix)
    suffix_len = len(suffix)

    # We only need to check up to n - prefix_len because
    # prefix needs to fit within s
    for i in range(n - prefix_len + 1):
        # Step 4: Check if prefix matches starting at position i
        if s[i:i + prefix_len] == prefix:
            # Step 5: Now look for suffix after the prefix
            # The suffix can start anywhere from i + prefix_len onward
            # But it must fit within the remaining part of s
            min_suffix_start = i + prefix_len
            max_suffix_start = n - suffix_len

            # Check all possible positions for suffix
            for j in range(min_suffix_start, max_suffix_start + 1):
                if s[j:j + suffix_len] == suffix:
                    # Found both prefix and suffix with valid positioning
                    return True

    # Step 6: If we checked all positions and found no match
    return False
```

```javascript
// Time: O(n * m) where n = s.length, m = p.length
// Space: O(1) - we only use constant extra space
function isSubstringMatch(s, p) {
  // Step 1: Split pattern into prefix and suffix at '*'
  // The '*' is guaranteed to exist exactly once
  const starIndex = p.indexOf("*");
  const prefix = p.substring(0, starIndex);
  const suffix = p.substring(starIndex + 1);

  // Step 2: Edge case - if pattern is just '*', it matches any substring
  if (prefix === "" && suffix === "") {
    return true;
  }

  // Step 3: Try every possible starting position for prefix in s
  const n = s.length;
  const prefixLen = prefix.length;
  const suffixLen = suffix.length;

  // We only need to check up to n - prefixLen because
  // prefix needs to fit within s
  for (let i = 0; i <= n - prefixLen; i++) {
    // Step 4: Check if prefix matches starting at position i
    if (s.substring(i, i + prefixLen) === prefix) {
      // Step 5: Now look for suffix after the prefix
      // The suffix can start anywhere from i + prefixLen onward
      // But it must fit within the remaining part of s
      const minSuffixStart = i + prefixLen;
      const maxSuffixStart = n - suffixLen;

      // Check all possible positions for suffix
      for (let j = minSuffixStart; j <= maxSuffixStart; j++) {
        if (s.substring(j, j + suffixLen) === suffix) {
          // Found both prefix and suffix with valid positioning
          return true;
        }
      }
    }
  }

  // Step 6: If we checked all positions and found no match
  return false;
}
```

```java
// Time: O(n * m) where n = s.length(), m = p.length()
// Space: O(1) - we only use constant extra space
public boolean isSubstringMatch(String s, String p) {
    // Step 1: Split pattern into prefix and suffix at '*'
    // The '*' is guaranteed to exist exactly once
    int starIndex = p.indexOf('*');
    String prefix = p.substring(0, starIndex);
    String suffix = p.substring(starIndex + 1);

    // Step 2: Edge case - if pattern is just '*', it matches any substring
    if (prefix.isEmpty() && suffix.isEmpty()) {
        return true;
    }

    // Step 3: Try every possible starting position for prefix in s
    int n = s.length();
    int prefixLen = prefix.length();
    int suffixLen = suffix.length();

    // We only need to check up to n - prefixLen because
    // prefix needs to fit within s
    for (int i = 0; i <= n - prefixLen; i++) {
        // Step 4: Check if prefix matches starting at position i
        if (s.substring(i, i + prefixLen).equals(prefix)) {
            // Step 5: Now look for suffix after the prefix
            // The suffix can start anywhere from i + prefixLen onward
            // But it must fit within the remaining part of s
            int minSuffixStart = i + prefixLen;
            int maxSuffixStart = n - suffixLen;

            // Check all possible positions for suffix
            for (int j = minSuffixStart; j <= maxSuffixStart; j++) {
                if (s.substring(j, j + suffixLen).equals(suffix)) {
                    // Found both prefix and suffix with valid positioning
                    return true;
                }
            }
        }
    }

    // Step 6: If we checked all positions and found no match
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- In the worst case, we check O(n) starting positions for the prefix
- For each valid prefix match, we check O(n) starting positions for the suffix
- Each string comparison takes O(m) time where m is the length of the pattern components
- This gives us O(n × n × m) = O(n² × m) in the naive analysis
- However, in practice, the inner loops are bounded and we get O(n × m) average performance

**Space Complexity: O(1)**

- We only use a constant amount of extra space to store:
  - The prefix and suffix strings (which are substrings of the input)
  - Loop indices and length variables
- No additional data structures are needed

## Common Mistakes

1. **Forgetting that '\*' can match zero characters**: Some candidates assume the '\*' must match at least one character, but it can match zero. This means the suffix could start immediately after the prefix ends.

2. **Incorrect bounds checking**: When looking for the suffix, candidates often forget to ensure there's enough room in the string for both the prefix and suffix. Always check that `i + prefixLen ≤ n - suffixLen` for valid positions.

3. **Not handling empty prefix or suffix**: The pattern could be `"*abc"` (empty prefix) or `"abc*"` (empty suffix) or just `"*"` (both empty). These cases need special handling.

4. **Using inefficient string matching**: Some candidates use nested loops with character-by-character comparison for both prefix and suffix searches, which can lead to O(n³) complexity. While our solution is O(n²) in worst case, it's optimized by using substring comparisons.

## When You'll See This Pattern

This problem teaches the **split and search** pattern for wildcard matching:

1. **Wildcard Matching (Hard)**: A more complex version where you have multiple `'*'` and `'?'` characters. The solution uses dynamic programming or two-pointer techniques.

2. **Regular Expression Matching (Hard)**: Similar concept but with `'.'` for single character and `'*'` for zero or more of the preceding element. This also uses DP.

3. **Implement strStr() (Easy)**: Finding a needle in a haystack is a simpler version without wildcards, using similar substring search techniques.

The core idea is to break down a pattern with special characters into simpler components that can be matched independently, then combine the results.

## Key Takeaways

1. **Single wildcard simplification**: When you have exactly one `'*'`, you can split the problem into finding a prefix match followed by a suffix match somewhere after it. This reduces a complex pattern matching problem to two simpler substring searches.

2. **Order matters in substring matching**: Unlike full string matching where you can rearrange components, substring matching requires maintaining the order of pattern components as they appear in the target string.

3. **Zero-length matches are valid**: Always remember that `'*'` can match zero characters, which means components can be adjacent in the matched substring.

Related problems: [Wildcard Matching](/problem/wildcard-matching)
