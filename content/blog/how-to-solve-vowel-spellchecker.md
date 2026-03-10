---
title: "How to Solve Vowel Spellchecker — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Vowel Spellchecker. Medium difficulty, 61.4% acceptance rate. Topics: Array, Hash Table, String."
date: "2026-11-04"
category: "dsa-patterns"
tags: ["vowel-spellchecker", "array", "hash-table", "string", "medium"]
---

# How to Solve Vowel Spellchecker

This problem asks us to build a spellchecker that handles two types of errors: capitalization mistakes and vowel substitutions. Given a wordlist and a query word, we need to return the first matching word according to specific rules. What makes this problem interesting is that we need to handle multiple matching strategies with different priorities, and the vowel substitution rule requires careful string transformation.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Wordlist:** `["KiTe", "kite", "hare", "Hare"]`  
**Queries:** `["kite", "Kite", "KiTe", "Hare", "HARE", "hAre", "hare", "kite"]`

We need to handle three matching rules in order of priority:

1. **Exact match** (case-sensitive)
2. **Case-insensitive match**
3. **Vowel-agnostic match** (vowels a/e/i/o/u can be substituted for each other)

Let's process the queries:

1. `"kite"` → Exact match with `"kite"` → Return `"kite"`
2. `"Kite"` → No exact match, but case-insensitive match with `"KiTe"` → Return `"KiTe"` (first in wordlist)
3. `"KiTe"` → Exact match with `"KiTe"` → Return `"KiTe"`
4. `"Hare"` → Exact match with `"Hare"` → Return `"Hare"`
5. `"HARE"` → No exact match, case-insensitive match with `"hare"` → Return `"hare"` (first in wordlist)
6. `"hAre"` → No exact match, case-insensitive match with `"hare"` → Return `"hare"`
7. `"hare"` → Exact match with `"hare"` → Return `"hare"`
8. `"kite"` → Exact match with `"kite"` → Return `"kite"`

The tricky part is the vowel substitution rule. For example, if our wordlist had `"hello"` and we queried `"hallo"`, they should match because both 'e' and 'a' are vowels and can be substituted.

## Brute Force Approach

A naive approach would be to check each query against every word in the wordlist using all three matching rules:

1. For each query word:
2. First pass: Check for exact match (case-sensitive)
3. Second pass: Check for case-insensitive match
4. Third pass: Check for vowel-agnostic match

The vowel-agnostic check would need to compare characters one by one, treating vowels as equivalent.

**Why this is inefficient:**

- Time complexity: O(n × m × q) where n is wordlist size, m is average word length, and q is number of queries
- For each query, we're scanning the entire wordlist up to three times
- The vowel comparison requires character-by-character checking for each potential match
- This becomes O(10^4 × 10^4 × 30) in worst case, which is too slow

## Optimized Approach

The key insight is that we can preprocess the wordlist into lookup tables (hash maps) for each matching rule:

1. **Exact match map**: Store each word as-is for O(1) lookup
2. **Case-insensitive map**: Store lowercase versions of words, keeping the first occurrence
3. **Vowel-agnostic map**: Store a "devoweled" version (lowercase with vowels replaced by '\*'), keeping the first occurrence

**Why this works:**

- We process the wordlist once upfront (O(n))
- Each query becomes three O(1) hash map lookups
- The vowel transformation normalizes all vowels to the same character, making "kite" and "kate" both map to "k*t*"

**Processing order matters:** We need to process the wordlist in order to ensure we keep the first match for each normalization, which satisfies the problem requirement of returning the first match in the wordlist.

## Optimal Solution

We'll create three hash maps:

1. `exact_match`: For exact case-sensitive matching
2. `case_insensitive`: Key = lowercase word, Value = original word (first occurrence)
3. `vowel_insensitive`: Key = devoweled word (vowels → '\*'), Value = original word (first occurrence)

For each query, we check in order: exact → case-insensitive → vowel-insensitive.

<div class="code-group">

```python
# Time: O(n + q) where n = wordlist length, q = queries length
# Space: O(n) for storing the three maps
class Solution:
    def spellchecker(self, wordlist: List[str], queries: List[str]) -> List[str]:
        # Three lookup tables for different matching rules
        exact_match = set(wordlist)  # For exact case-sensitive match
        case_insensitive = {}  # lowercase -> first original word
        vowel_insensitive = {}  # devoweled -> first original word

        # Helper function to convert vowels to '*'
        def devowel(word: str) -> str:
            return ''.join('*' if c in 'aeiou' else c for c in word)

        # Build lookup tables from wordlist (process in reverse to get first match)
        # We process in reverse because we want to keep the FIRST occurrence,
        # but when we overwrite in a dict, the last value wins.
        # So we process backwards and only add if key doesn't exist yet.
        for word in reversed(wordlist):
            lower_word = word.lower()
            devoweled_word = devowel(lower_word)

            # For case-insensitive: store lowercase -> original
            case_insensitive[lower_word] = word

            # For vowel-insensitive: store devoweled -> original
            vowel_insensitive[devoweled_word] = word

        result = []

        for query in queries:
            # Rule 1: Exact match (case-sensitive)
            if query in exact_match:
                result.append(query)
                continue

            # Rule 2: Case-insensitive match
            lower_query = query.lower()
            if lower_query in case_insensitive:
                result.append(case_insensitive[lower_query])
                continue

            # Rule 3: Vowel-insensitive match
            devoweled_query = devowel(lower_query)
            if devoweled_query in vowel_insensitive:
                result.append(vowel_insensitive[devoweled_query])
                continue

            # No match found
            result.append("")

        return result
```

```javascript
// Time: O(n + q) where n = wordlist length, q = queries length
// Space: O(n) for storing the three maps
/**
 * @param {string[]} wordlist
 * @param {string[]} queries
 * @return {string[]}
 */
var spellchecker = function (wordlist, queries) {
  // Three lookup tables for different matching rules
  const exactMatch = new Set(wordlist); // For exact case-sensitive match
  const caseInsensitive = new Map(); // lowercase -> first original word
  const vowelInsensitive = new Map(); // devoweled -> first original word

  // Helper function to convert vowels to '*'
  const devowel = (word) => {
    return word.replace(/[aeiou]/gi, "*");
  };

  // Build lookup tables from wordlist
  // Process in reverse to ensure we keep the FIRST occurrence
  for (let i = wordlist.length - 1; i >= 0; i--) {
    const word = wordlist[i];
    const lowerWord = word.toLowerCase();
    const devoweledWord = devowel(lowerWord);

    // For case-insensitive: store lowercase -> original
    caseInsensitive.set(lowerWord, word);

    // For vowel-insensitive: store devoweled -> original
    vowelInsensitive.set(devoweledWord, word);
  }

  const result = [];

  for (const query of queries) {
    // Rule 1: Exact match (case-sensitive)
    if (exactMatch.has(query)) {
      result.push(query);
      continue;
    }

    // Rule 2: Case-insensitive match
    const lowerQuery = query.toLowerCase();
    if (caseInsensitive.has(lowerQuery)) {
      result.push(caseInsensitive.get(lowerQuery));
      continue;
    }

    // Rule 3: Vowel-insensitive match
    const devoweledQuery = devowel(lowerQuery);
    if (vowelInsensitive.has(devoweledQuery)) {
      result.push(vowelInsensitive.get(devoweledQuery));
      continue;
    }

    // No match found
    result.push("");
  }

  return result;
};
```

```java
// Time: O(n + q) where n = wordlist length, q = queries length
// Space: O(n) for storing the three maps
class Solution {
    public String[] spellchecker(String[] wordlist, String[] queries) {
        // Three lookup tables for different matching rules
        Set<String> exactMatch = new HashSet<>();  // For exact case-sensitive match
        Map<String, String> caseInsensitive = new HashMap<>();  // lowercase -> first original
        Map<String, String> vowelInsensitive = new HashMap<>(); // devoweled -> first original

        // Helper function to convert vowels to '*'
        // Using StringBuilder for efficiency
        private String devowel(String word) {
            StringBuilder sb = new StringBuilder();
            for (char c : word.toCharArray()) {
                if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                    sb.append('*');
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        }

        // Build lookup tables from wordlist
        // Process in reverse to ensure we keep the FIRST occurrence
        for (int i = wordlist.length - 1; i >= 0; i--) {
            String word = wordlist[i];
            String lowerWord = word.toLowerCase();
            String devoweledWord = devowel(lowerWord);

            // For case-insensitive: store lowercase -> original
            caseInsensitive.put(lowerWord, word);

            // For vowel-insensitive: store devoweled -> original
            vowelInsensitive.put(devoweledWord, word);

            // For exact match
            exactMatch.add(word);
        }

        String[] result = new String[queries.length];

        for (int i = 0; i < queries.length; i++) {
            String query = queries[i];

            // Rule 1: Exact match (case-sensitive)
            if (exactMatch.contains(query)) {
                result[i] = query;
                continue;
            }

            // Rule 2: Case-insensitive match
            String lowerQuery = query.toLowerCase();
            if (caseInsensitive.containsKey(lowerQuery)) {
                result[i] = caseInsensitive.get(lowerQuery);
                continue;
            }

            // Rule 3: Vowel-insensitive match
            String devoweledQuery = devowel(lowerQuery);
            if (vowelInsensitive.containsKey(devoweledQuery)) {
                result[i] = vowelInsensitive.get(devoweledQuery);
                continue;
            }

            // No match found
            result[i] = "";
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + q)**

- Building the three hash maps: O(n) where n is the length of wordlist
  - Each word is processed once
  - Lowercasing and devoweling are O(m) per word, but m ≤ 30 (constant)
- Processing queries: O(q) where q is the number of queries
  - Each query requires up to 3 hash map lookups (O(1) each)
  - Plus lowercasing and devoweling (O(m), constant)

**Space Complexity: O(n)**

- `exact_match` set: O(n)
- `case_insensitive` map: O(n) in worst case (all words have unique lowercase forms)
- `vowel_insensitive` map: O(n) in worst case (all words have unique devoweled forms)
- Total: O(3n) = O(n)

## Common Mistakes

1. **Not preserving first match order**: The problem requires returning the first match in the wordlist. If you process the wordlist forward and overwrite values in your maps, you'll keep the last match instead of the first. Solution: Process the wordlist in reverse or check if key exists before inserting.

2. **Incorrect vowel transformation**: Only vowels (a, e, i, o, u) should be treated as equivalent, not all characters. Some candidates mistakenly treat 'y' as a vowel or forget that capitalization matters (vowels are case-insensitive).

3. **Missing the exact match check**: The three rules must be checked in order: exact → case-insensitive → vowel-insensitive. Some candidates check case-insensitive first, which would incorrectly match "Kite" with "kite" when "KiTe" exists in the wordlist.

4. **Inefficient vowel comparison**: Comparing each query against each wordlist entry with character-by-character vowel checking leads to O(n × m × q) time. The proper solution uses a normalization function and hash map lookups.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Multiple lookup strategies with priority**: Similar to "LRU Cache" (LeetCode 146) where you need to maintain multiple data structures for different operations.

2. **String normalization for fuzzy matching**: Used in problems like "Group Anagrams" (LeetCode 49) where you transform strings to a canonical form for grouping. The vowel transformation here is similar to sorting strings for anagram grouping.

3. **Precomputation for repeated queries**: Like "Two Sum" (LeetCode 1) where you build a hash map to answer each query in O(1) time instead of rescanning the array.

4. **Rule-based matching systems**: Similar to "Regex Matching" (LeetCode 10) or "Wildcard Matching" (LeetCode 44) where you have hierarchical matching rules.

## Key Takeaways

1. **When you have multiple matching rules with priorities, check them in order and short-circuit**. Don't check later rules if an earlier one matches.

2. **Preprocess data into lookup tables when you have many queries**. O(n) preprocessing + O(1) per query is better than O(n) per query.

3. **For fuzzy string matching, create a normalization function** that transforms strings to a canonical form that captures the equivalence you care about (lowercase for case-insensitivity, vowel replacement for vowel-agnostic).

4. **Pay attention to "first match" requirements** in problems. You may need to process data in reverse or check existence before inserting to preserve order.

[Practice this problem on CodeJeet](/problem/vowel-spellchecker)
