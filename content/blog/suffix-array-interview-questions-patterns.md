---
title: "Suffix Array Interview Questions: Patterns and Strategies"
description: "Master Suffix Array problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-06-27"
category: "dsa-patterns"
tags: ["suffix-array", "dsa", "interview prep"]
---

# Suffix Array Interview Questions: Patterns and Strategies

You're in a Google interview, feeling good about your performance so far. The interviewer smiles and says, "Let's try something different. Given a string, find the longest substring that appears at least twice." You think, "Easy — sliding window with a hash map." But as you start coding, you realize the brute force approach is O(n²) and your interviewer is waiting for something better. This is where suffix arrays come in — a data structure that turns this seemingly complex problem into an O(n log n) solution. Suffix array questions are rare (only about 5 on LeetCode), but they're almost exclusively hard problems that top companies use to separate senior candidates from the rest.

## Common Patterns

### Pattern 1: Longest Repeated Substring

This is the classic suffix array application. The key insight: if you sort all suffixes of a string, repeated substrings will appear as common prefixes of adjacent suffixes in the sorted array.

<div class="code-group">

```python
def longest_repeated_substring(s: str) -> str:
    """Find longest substring that appears at least twice in s."""
    n = len(s)

    # Build suffix array - O(n log n) using Python's sort
    suffixes = [(s[i:], i) for i in range(n)]
    suffixes.sort(key=lambda x: x[0])

    # Compare adjacent suffixes to find longest common prefix
    result = ""
    for i in range(n - 1):
        suffix1, idx1 = suffixes[i]
        suffix2, idx2 = suffixes[i + 1]

        # Find common prefix length
        j = 0
        while j < min(len(suffix1), len(suffix2)) and suffix1[j] == suffix2[j]:
            j += 1

        if j > len(result):
            result = suffix1[:j]

    return result

# Time: O(n² log n) with naive sort, O(n log n) with proper implementation
# Space: O(n) for storing suffixes
```

```javascript
function longestRepeatedSubstring(s) {
  const n = s.length;

  // Build suffix array
  const suffixes = [];
  for (let i = 0; i < n; i++) {
    suffixes.push({ suffix: s.substring(i), index: i });
  }

  suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));

  // Find longest common prefix between adjacent suffixes
  let result = "";

  for (let i = 0; i < n - 1; i++) {
    const suffix1 = suffixes[i].suffix;
    const suffix2 = suffixes[i + 1].suffix;

    let j = 0;
    while (j < Math.min(suffix1.length, suffix2.length) && suffix1[j] === suffix2[j]) {
      j++;
    }

    if (j > result.length) {
      result = suffix1.substring(0, j);
    }
  }

  return result;
}

// Time: O(n² log n) | Space: O(n)
```

```java
import java.util.Arrays;

public class SuffixArray {
    public String longestRepeatedSubstring(String s) {
        int n = s.length();

        // Create suffix array
        String[] suffixes = new String[n];
        for (int i = 0; i < n; i++) {
            suffixes[i] = s.substring(i);
        }

        Arrays.sort(suffixes);

        // Find longest common prefix between adjacent suffixes
        String result = "";

        for (int i = 0; i < n - 1; i++) {
            String s1 = suffixes[i];
            String s2 = suffixes[i + 1];

            int j = 0;
            while (j < Math.min(s1.length(), s2.length()) &&
                   s1.charAt(j) == s2.charAt(j)) {
                j++;
            }

            if (j > result.length()) {
                result = s1.substring(0, j);
            }
        }

        return result;
    }
}

// Time: O(n² log n) | Space: O(n)
```

</div>

**Problems using this pattern:** Longest Duplicate Substring (#1044), Repeated DNA Sequences (#187)

### Pattern 2: Longest Common Substring of Multiple Strings

When you need the longest substring common to multiple strings, concatenate them with unique separators, build a suffix array, and look for suffixes that come from different original strings.

**Intuition:** By adding unique separators (like '#', '$', etc.) between strings, we ensure suffixes don't cross boundaries. Then we use a sliding window on the suffix array to find the longest common prefix that includes suffixes from all strings.

<div class="code-group">

```python
def longest_common_substring(strings):
    """Find longest substring common to all strings in the list."""
    if not strings:
        return ""

    # Build concatenated string with unique separators
    separators = [chr(i) for i in range(ord('#'), ord('#') + len(strings))]
    concatenated = ""
    string_id = []  # Track which original string each character belongs to

    for i, s in enumerate(strings):
        concatenated += s + separators[i]
        string_id.extend([i] * len(s))
        string_id.append(-1)  # Separator

    # Build suffix array (simplified - in practice use O(n log n) construction)
    n = len(concatenated)
    suffixes = [(concatenated[i:], i) for i in range(n)]
    suffixes.sort(key=lambda x: x[0])

    # Sliding window to find common substring
    # Implementation details depend on number of strings
    # For 2 strings, simpler approach exists

    # This is a simplified version for 2 strings
    if len(strings) == 2:
        result = ""
        for i in range(n - 1):
            idx1 = suffixes[i][1]
            idx2 = suffixes[i + 1][1]

            # Check if suffixes come from different strings
            if string_id[idx1] != string_id[idx2] and string_id[idx1] != -1 and string_id[idx2] != -1:
                # Find common prefix
                s1 = suffixes[i][0]
                s2 = suffixes[i + 1][0]
                j = 0
                while j < min(len(s1), len(s2)) and s1[j] == s2[j]:
                    j += 1

                if j > len(result):
                    result = s1[:j]

        return result

    # For k strings, use sliding window with counting
    return ""

# Time: O(N log N) where N is total length | Space: O(N)
```

</div>

**Problems using this pattern:** Longest Common Substring (not on LeetCode but common interview question)

### Pattern 3: Counting Distinct Substrings

The number of distinct substrings in a string of length n is n(n+1)/2 minus the sum of longest common prefixes between adjacent suffixes in the suffix array.

**Intuition:** Every substring is a prefix of some suffix. When we sort suffixes, duplicates appear as common prefixes between adjacent suffixes. Subtract these duplicates from the total possible substrings.

<div class="code-group">

```python
def count_distinct_substrings(s: str) -> int:
    """Count number of distinct substrings in s."""
    n = len(s)

    # Build suffix array
    suffixes = [s[i:] for i in range(n)]
    suffixes.sort()

    total_substrings = n * (n + 1) // 2

    # Subtract common prefixes between adjacent suffixes
    duplicate_count = 0
    for i in range(n - 1):
        s1 = suffixes[i]
        s2 = suffixes[i + 1]

        # Find LCP length
        j = 0
        while j < min(len(s1), len(s2)) and s1[j] == s2[j]:
            j += 1

        duplicate_count += j

    return total_substrings - duplicate_count

# Time: O(n² log n) | Space: O(n)
```

```javascript
function countDistinctSubstrings(s) {
  const n = s.length;

  // Build suffix array
  const suffixes = [];
  for (let i = 0; i < n; i++) {
    suffixes.push(s.substring(i));
  }

  suffixes.sort();

  // Total possible substrings
  const totalSubstrings = (n * (n + 1)) / 2;

  // Subtract duplicates (common prefixes)
  let duplicateCount = 0;

  for (let i = 0; i < n - 1; i++) {
    const s1 = suffixes[i];
    const s2 = suffixes[i + 1];

    let j = 0;
    while (j < Math.min(s1.length, s2.length) && s1[j] === s2[j]) {
      j++;
    }

    duplicateCount += j;
  }

  return totalSubstrings - duplicateCount;
}

// Time: O(n² log n) | Space: O(n)
```

</div>

**Problems using this pattern:** Number of Distinct Substrings in a String (common interview variant)

## When to Use Suffix Array vs Alternatives

Recognizing when to reach for suffix arrays is crucial. Here's your decision tree:

1. **Suffix Array is appropriate when:**
   - Problem asks for "longest repeated substring" or "longest common substring"
   - You need to compare many substrings efficiently
   - String length is large (10^5+) and O(n²) won't work
   - You need to answer multiple substring queries on the same string

2. **Consider alternatives when:**
   - String length is small (<1000) — brute force might be acceptable
   - You only need to find exact matches, not longest common prefixes — use hash maps
   - Problem involves pattern matching with wildcards — consider Trie or Aho-Corasick
   - You need to modify the string — suffix arrays are static data structures

3. **Suffix Array vs Suffix Tree:**
   - Suffix arrays use less memory (O(n) vs O(26n) for trees)
   - Suffix trees are faster for some operations but harder to implement
   - In interviews, suffix arrays are preferred because they're easier to code correctly

**Key decision criteria:** If the problem involves finding relationships between substrings (especially longest common prefixes) and the string is static, suffix array is your best bet.

## Edge Cases and Gotchas

1. **Empty or single-character strings:** Always check `if len(s) <= 1`. A single character can't have a repeated substring (unless you count the whole string, which depends on problem definition).

2. **All characters identical:** Strings like "aaaa" have special behavior. The longest repeated substring is "aaa" (length n-1), not the whole string.

3. **Unicode and special characters:** When using separators in concatenated strings, ensure they don't appear in the input. Use characters outside the expected range (e.g., `chr(1)`, `chr(2)`).

4. **Memory limits with naive implementation:** The O(n²) suffix array construction (sorting all suffixes) fails on large inputs. Know how to implement or at least describe the O(n log n) version (prefix doubling or SA-IS algorithm).

5. **Off-by-one in LCP array:** When building the LCP (Longest Common Prefix) array, remember it has length n-1 (between adjacent suffixes), not n.

<div class="code-group">

```python
# Common mistake - incorrect LCP array size
def build_lcp_incorrect(s, suffixes):
    n = len(s)
    lcp = [0] * n  # WRONG - should be n-1

    for i in range(n - 1):
        # ... calculate LCP ...
        lcp[i] = lcp_value  # Index error when i = n-1

    return lcp

# Correct version
def build_lcp_correct(s, suffixes):
    n = len(s)
    lcp = [0] * (n - 1)  # CORRECT - between adjacent suffixes

    for i in range(n - 1):
        s1 = suffixes[i]
        s2 = suffixes[i + 1]
        j = 0
        while j < min(len(s1), len(s2)) and s1[j] == s2[j]:
            j += 1
        lcp[i] = j

    return lcp
```

</div>

## Difficulty Breakdown

All 5 suffix array problems on LeetCode are hard. This tells you something important: companies only ask suffix arrays when they want to test advanced algorithmic knowledge. You won't see these in phone screens or for junior positions. They're reserved for on-site interviews at top companies, usually for senior roles or specific teams working with text processing (search, genomics, etc.).

**Study prioritization:** If you're interviewing at Google, Amazon, or Bloomberg for a senior role, study suffix arrays. For most other interviews, they're low priority. Focus on the patterns rather than memorizing implementations — understand when suffix arrays are the right tool and be able to describe how they work.

## Which Companies Ask Suffix Array

1. **[Google](/company/google)** - Asks suffix arrays for search-related roles. They love problems about finding repeated patterns in text or DNA sequences. Expect variations of Longest Duplicate Substring (#1044).

2. **[Amazon](/company/amazon)** - Uses suffix arrays in AWS and Alexa teams for text processing. They tend to ask practical applications like autocomplete or plagiarism detection.

3. **[Bloomberg](/company/bloomberg)** - Asks for financial text analysis, like finding repeated patterns in news articles or financial reports. Their questions often involve multiple strings.

4. **[Goldman Sachs](/company/goldman-sachs)** - Surprisingly asks suffix arrays for quantitative roles dealing with DNA sequence analysis in biotech investments.

5. **[Coupang](/company/coupang)** - The Korean e-commerce giant asks suffix arrays for search and recommendation systems.

Each company has a style: Google tests deep understanding, Amazon wants practical applications, Bloomberg looks for financial context, Goldman Sachs focuses on algorithmic purity, and Coupang emphasizes scalability.

## Study Tips

1. **Learn the O(n log n) construction:** Don't just memorize the naive O(n² log n) version. Understand prefix doubling — it's testable. Practice explaining it: "We sort suffixes by their first 1 character, then 2, then 4, using the previous sort as a ranking."

2. **Master the LCP array:** The suffix array itself isn't useful without the LCP array. Practice building it and using it to solve problems. Most suffix array solutions follow this pattern: build SA → build LCP → use LCP to answer the question.

3. **Start with these 3 problems in order:**
   1. Longest Duplicate Substring (#1044) - Teaches the basic pattern
   2. Repeated DNA Sequences (#187) - Shows a practical application
   3. Last Substring in Lexicographical Order (#1163) - Tests deeper understanding

4. **Practice drawing examples:** On a whiteboard, draw the suffix array and LCP array for simple strings like "banana". This helps internalize how they work and makes explanations clearer.

Remember: The goal isn't to memorize suffix array code (it's too long). The goal is to recognize when it's needed and explain how you'd use it. In an interview, you might say: "This is a classic suffix array problem. I'd build the suffix array in O(n log n) using prefix doubling, then build the LCP array, and then..."

[Practice all Suffix Array questions on CodeJeet](/topic/suffix-array)
