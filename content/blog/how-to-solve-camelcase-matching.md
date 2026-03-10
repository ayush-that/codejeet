---
title: "How to Solve Camelcase Matching — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Camelcase Matching. Medium difficulty, 65.1% acceptance rate. Topics: Array, Two Pointers, String, Trie, String Matching."
date: "2028-03-21"
category: "dsa-patterns"
tags: ["camelcase-matching", "array", "two-pointers", "string", "medium"]
---

# How to Solve Camelcase Matching

This problem asks us to determine which query strings match a given pattern, where matching means we can insert lowercase letters into the pattern to make it equal to the query. The tricky part is that uppercase letters in the pattern must match exactly with uppercase letters in the query in the same order, and we can only insert lowercase letters—never uppercase ones. This creates constraints that go beyond simple subsequence matching.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"]`
- `pattern = "FB"`

We need to check each query against the pattern "FB":

**Query 1: "FooBar"**

- Pattern pointer `p = 0` (F), query pointer `q = 0` (F): Both are uppercase 'F', match! Move both pointers: `p = 1`, `q = 1`
- Pattern pointer `p = 1` (B), query pointer `q = 1` (o): 'o' is lowercase, 'B' is uppercase. Since we can insert lowercase letters, we skip 'o' by moving only `q = 2`
- Query pointer `q = 2` (o): lowercase, skip it: `q = 3`
- Query pointer `q = 3` (B): uppercase 'B' matches pattern's 'B'! Move both: `p = 2`, `q = 4`
- Pattern is exhausted (`p = 2` equals pattern length). Now check remaining query characters: `q = 4` (a) lowercase, `q = 5` (r) lowercase. All remaining are lowercase, which is allowed.
- Result: **MATCH**

**Query 2: "FooBarTest"**

- Match 'F' at `q = 0`, move both pointers
- Skip lowercase 'o','o' until we find 'B' at `q = 3`, match it
- Pattern exhausted at `p = 2`. Remaining query: "Test" contains uppercase 'T'! This is not allowed since we can't insert uppercase letters.
- Result: **NO MATCH**

**Query 3: "FootBall"**

- Match 'F' at `q = 0`
- Skip lowercase 'o','o','t' until 'B' at `q = 4`, match it
- Pattern exhausted. Remaining: "all" are all lowercase ✓
- Result: **MATCH**

This walkthrough reveals the core algorithm: we need to match uppercase pattern characters exactly in order, while allowing lowercase query characters to be skipped (treated as insertions). After matching all pattern characters, any remaining query characters must be lowercase.

## Brute Force Approach

A naive approach might try to generate all possible strings by inserting lowercase letters into the pattern and check if any equals the query. However, with 26 possible lowercase letters and potentially many insertion points, this leads to exponential time complexity.

Another brute force would be to check if the query contains the pattern as a subsequence while also checking the uppercase constraints. We could:

1. Extract all uppercase letters from the query
2. Check if they exactly equal the pattern
3. Verify that the query contains the pattern as a subsequence

But this misses cases where the pattern has lowercase letters (which it doesn't in this problem, but we should design a general solution). The real issue with a naive implementation is not checking the constraints properly: we need to ensure that when we skip characters in the query, they must be lowercase.

## Optimized Approach

The key insight is that this is a **two-pointer matching problem with constraints**. We use two pointers:

- `p` for the pattern string
- `q` for the query string

We iterate through the query string, and at each step:

1. If `p` hasn't reached the end of the pattern AND the current characters match (`pattern[p] == query[q]`), we advance both pointers.
2. Otherwise, if the current query character is lowercase, we skip it (treat it as an inserted character).
3. If the query character is uppercase and doesn't match the pattern character, we have a mismatch.

After processing all query characters:

- If we haven't matched all pattern characters (`p < len(pattern)`), it's a mismatch.
- If we have matched all pattern characters, it's a match (any remaining query characters would have been lowercase, otherwise we would have failed earlier).

This approach runs in O(n) time where n is the total length of all queries, since we process each character at most once.

## Optimal Solution

Here's the complete solution using the two-pointer approach:

<div class="code-group">

```python
# Time: O(N * L) where N = number of queries, L = average query length
# Space: O(N) for the result array (excluding input storage)
def camelMatch(queries, pattern):
    """
    Check which queries match the pattern.

    Args:
        queries: List of query strings to check
        pattern: Pattern string to match against

    Returns:
        List of booleans indicating which queries match
    """
    result = []

    for query in queries:
        # Initialize pointers for pattern and query
        p = 0  # pattern pointer
        q = 0  # query pointer

        # Process each character in the query
        while q < len(query):
            # Case 1: Pattern character matches query character
            if p < len(pattern) and query[q] == pattern[p]:
                p += 1  # Move pattern pointer
                q += 1  # Move query pointer
            # Case 2: Query character is lowercase (can be inserted)
            elif query[q].islower():
                q += 1  # Skip this lowercase character
            # Case 3: Mismatch - query has uppercase that doesn't match pattern
            else:
                break  # This query cannot match

        # After processing query, check if we matched all pattern characters
        # AND reached the end of the query (or all remaining are lowercase)
        # Actually, if we broke early due to mismatch, q won't be at end
        # So we need to check both conditions:
        matched = (p == len(pattern)) and (q == len(query))
        result.append(matched)

    return result
```

```javascript
// Time: O(N * L) where N = number of queries, L = average query length
// Space: O(N) for the result array (excluding input storage)
/**
 * Check which queries match the pattern.
 *
 * @param {string[]} queries - Array of query strings to check
 * @param {string} pattern - Pattern string to match against
 * @return {boolean[]} - Array of booleans indicating which queries match
 */
function camelMatch(queries, pattern) {
  const result = [];

  for (const query of queries) {
    // Initialize pointers for pattern and query
    let p = 0; // pattern pointer
    let q = 0; // query pointer

    // Process each character in the query
    while (q < query.length) {
      // Case 1: Pattern character matches query character
      if (p < pattern.length && query[q] === pattern[p]) {
        p++; // Move pattern pointer
        q++; // Move query pointer
      }
      // Case 2: Query character is lowercase (can be inserted)
      else if (query[q] >= "a" && query[q] <= "z") {
        q++; // Skip this lowercase character
      }
      // Case 3: Mismatch - query has uppercase that doesn't match pattern
      else {
        break; // This query cannot match
      }
    }

    // Check if we matched all pattern characters AND processed entire query
    const matched = p === pattern.length && q === query.length;
    result.push(matched);
  }

  return result;
}
```

```java
// Time: O(N * L) where N = number of queries, L = average query length
// Space: O(N) for the result array (excluding input storage)
import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Check which queries match the pattern.
     *
     * @param queries Array of query strings to check
     * @param pattern Pattern string to match against
     * @return List of booleans indicating which queries match
     */
    public List<Boolean> camelMatch(String[] queries, String pattern) {
        List<Boolean> result = new ArrayList<>();

        for (String query : queries) {
            // Initialize pointers for pattern and query
            int p = 0;  // pattern pointer
            int q = 0;  // query pointer

            // Process each character in the query
            while (q < query.length()) {
                // Case 1: Pattern character matches query character
                if (p < pattern.length() && query.charAt(q) == pattern.charAt(p)) {
                    p++;  // Move pattern pointer
                    q++;  // Move query pointer
                }
                // Case 2: Query character is lowercase (can be inserted)
                else if (Character.isLowerCase(query.charAt(q))) {
                    q++;  // Skip this lowercase character
                }
                // Case 3: Mismatch - query has uppercase that doesn't match pattern
                else {
                    break;  // This query cannot match
                }
            }

            // Check if we matched all pattern characters AND processed entire query
            boolean matched = (p == pattern.length()) && (q == query.length());
            result.add(matched);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N × L), where N is the number of queries and L is the average length of a query. For each query, we process each character exactly once in the worst case. The pattern length is bounded by the query length, so it doesn't add an additional factor.

**Space Complexity:** O(N) for storing the result array. We use only O(1) extra space per query for the pointers, excluding the space needed for input and output.

## Common Mistakes

1. **Not checking remaining characters after pattern matching:** Some candidates check only if the pattern is a subsequence of the query, forgetting that after matching all pattern characters, any remaining query characters must be lowercase. If there's an uppercase letter left, it should fail.

2. **Incorrect handling of lowercase pattern characters:** While this problem's patterns typically contain only uppercase letters, a robust solution should handle lowercase pattern characters too. The provided solution correctly handles this because lowercase pattern characters would only match lowercase query characters (case 1), not be skipped over.

3. **Using string manipulation instead of pointers:** Some candidates try to modify strings or use complex regex, which is less efficient and more error-prone. The two-pointer approach is cleaner and more efficient.

4. **Forgetting to reset pointers for each query:** This is a subtle bug where candidates reuse pointers across queries. Each query needs its own fresh set of pointers starting at 0.

## When You'll See This Pattern

The two-pointer pattern with constraints appears in many string matching problems:

1. **Is Subsequence (LeetCode 392):** Check if one string is a subsequence of another. Camelcase Matching is essentially "Is Subsequence" with additional constraints about uppercase letters.

2. **Longest Word in Dictionary through Deleting (LeetCode 524):** Find the longest word in a dictionary that can be formed by deleting characters from a string. Similar two-pointer matching with additional selection criteria.

3. **Custom Sort String (LeetCode 791):** Sort a string according to a custom order. While not identical, it uses similar character-by-character processing with constraints.

The core technique of iterating through two sequences with pointers, applying specific matching rules, is fundamental to many string processing problems.

## Key Takeaways

1. **Two-pointer technique is powerful for sequence matching:** When you need to check if one sequence can be transformed into another with specific operations (insertion, deletion, matching), consider using two pointers to traverse both sequences simultaneously.

2. **Constraints dictate the matching logic:** The specific rules (e.g., "can only insert lowercase letters") directly translate to conditions in your while loop. Carefully translate each requirement into code.

3. **Always check boundary conditions:** After your main loop, verify that you've consumed all required pattern characters and that any remaining characters satisfy all constraints.

[Practice this problem on CodeJeet](/problem/camelcase-matching)
