---
title: "How to Solve Words Within Two Edits of Dictionary — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Words Within Two Edits of Dictionary. Medium difficulty, 61.8% acceptance rate. Topics: Array, String, Trie."
date: "2029-05-26"
category: "dsa-patterns"
tags: ["words-within-two-edits-of-dictionary", "array", "string", "trie", "medium"]
---

## How to Solve Words Within Two Edits of Dictionary

You're given two lists of equal-length words: `queries` (words to check) and `dictionary` (reference words). For each query word, you need to determine if it can be transformed into at least one dictionary word by changing **at most two letters**. This problem is interesting because it looks like a string matching problem, but brute force checking all pairs becomes inefficient with large inputs. The key insight is recognizing that with only two edits allowed, we can use clever optimizations rather than checking every dictionary word against every query.

## Visual Walkthrough

Let's trace through a small example:

- `queries = ["word", "note", "wood"]`
- `dictionary = ["ward", "node", "good"]`
- All words have length 4

**Step 1: Check "word" vs dictionary**

- Compare "word" with "ward": Only 1 letter different ('o' vs 'a') → within 2 edits ✓
- Since we found at least one match, "word" is valid

**Step 2: Check "note" vs dictionary**

- Compare "note" with "ward": 4 letters different → exceeds 2 edits ✗
- Compare "note" with "node": 1 letter different ('t' vs 'd') → within 2 edits ✓
- "note" is valid

**Step 3: Check "wood" vs dictionary**

- Compare "wood" with "ward": 3 letters different → exceeds 2 edits ✗
- Compare "wood" with "node": 4 letters different → exceeds 2 edits ✗
- Compare "wood" with "good": 1 letter different ('w' vs 'g') → within 2 edits ✓
- "wood" is valid

Result: All three queries are valid → `["word", "note", "wood"]`

The naive approach would compare each query against every dictionary word, which works for small inputs but becomes problematic with thousands of words.

## Brute Force Approach

The most straightforward solution is to compare each query word with every dictionary word, counting how many positions have different letters. If any dictionary word has ≤ 2 differences from the query, the query is valid.

**Why this is insufficient:**

- Time complexity: O(q × d × n) where q = queries count, d = dictionary count, n = word length
- With q = 1000, d = 1000, n = 10 → 10 million character comparisons
- While this might pass for small constraints, it fails efficiency requirements for larger inputs

<div class="code-group">

```python
# Brute Force Solution
# Time: O(q * d * n) | Space: O(1) excluding output
def twoEditWords_brute(queries, dictionary):
    result = []

    for query in queries:
        valid = False
        # Compare against every dictionary word
        for dict_word in dictionary:
            diff_count = 0
            # Count differing characters
            for i in range(len(query)):
                if query[i] != dict_word[i]:
                    diff_count += 1
                    # Early exit if already exceeded 2 differences
                    if diff_count > 2:
                        break
            # Check if within 2 edits
            if diff_count <= 2:
                valid = True
                break  # No need to check other dictionary words
        if valid:
            result.append(query)

    return result
```

```javascript
// Brute Force Solution
// Time: O(q * d * n) | Space: O(1) excluding output
function twoEditWordsBrute(queries, dictionary) {
  const result = [];

  for (const query of queries) {
    let valid = false;
    // Compare against every dictionary word
    for (const dictWord of dictionary) {
      let diffCount = 0;
      // Count differing characters
      for (let i = 0; i < query.length; i++) {
        if (query[i] !== dictWord[i]) {
          diffCount++;
          // Early exit if already exceeded 2 differences
          if (diffCount > 2) break;
        }
      }
      // Check if within 2 edits
      if (diffCount <= 2) {
        valid = true;
        break; // No need to check other dictionary words
      }
    }
    if (valid) result.push(query);
  }

  return result;
}
```

```java
// Brute Force Solution
// Time: O(q * d * n) | Space: O(1) excluding output
public List<String> twoEditWordsBrute(String[] queries, String[] dictionary) {
    List<String> result = new ArrayList<>();

    for (String query : queries) {
        boolean valid = false;
        // Compare against every dictionary word
        for (String dictWord : dictionary) {
            int diffCount = 0;
            // Count differing characters
            for (int i = 0; i < query.length(); i++) {
                if (query.charAt(i) != dictWord.charAt(i)) {
                    diffCount++;
                    // Early exit if already exceeded 2 differences
                    if (diffCount > 2) break;
                }
            }
            // Check if within 2 edits
            if (diffCount <= 2) {
                valid = true;
                break;  // No need to check other dictionary words
            }
        }
        if (valid) result.add(query);
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that with only **2 edits allowed**, we don't need to compare each query against every dictionary word. Instead, we can:

1. **Preprocess the dictionary** into a set for O(1) lookups
2. **Generate all possible variations** of each query that are within 2 edits
3. **Check if any variation exists** in the dictionary set

**Why this works:**

- For a word of length n, the number of variations within 2 edits is manageable
- With 2 edits, we need to consider:
  - 0 edits: the word itself (1 possibility)
  - 1 edit: change any single letter to any other letter (n × 25 possibilities)
  - 2 edits: change any two letters (C(n,2) × 25² possibilities)
- For n=10, this is ~1 + 250 + 28,125 = ~28,376 possibilities
- Checking 28K possibilities against a hash set is much faster than comparing against thousands of dictionary words

**Step-by-step reasoning:**

1. Convert dictionary to a set for O(1) membership checks
2. For each query word:
   - Generate all words that can be formed by changing 0, 1, or 2 letters
   - Check if any generated word exists in the dictionary set
   - If yes, add the original query to results
3. Return the list of valid queries

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution using Hash Set and Variation Generation
# Time: O(q * n^2 * 25^2) but practically O(q * C(n,2) * 625) | Space: O(d + q * n^2)
def twoEditWords(queries, dictionary):
    # Step 1: Convert dictionary to set for O(1) lookups
    dict_set = set(dictionary)
    result = []

    # Step 2: Process each query word
    for query in queries:
        n = len(query)
        found = False

        # Case 1: Check the word itself (0 edits)
        if query in dict_set:
            result.append(query)
            continue  # Move to next query

        # Case 2: Check all 1-edit variations
        query_list = list(query)  # Convert to list for mutable operations
        for i in range(n):
            if found: break  # Early exit if already found
            original_char = query_list[i]

            # Try changing this position to every other letter
            for c in 'abcdefghijklmnopqrstuvwxyz':
                if c == original_char:
                    continue  # Skip same character

                query_list[i] = c
                modified = ''.join(query_list)

                if modified in dict_set:
                    found = True
                    break  # Found a match, no need to check more variations

            query_list[i] = original_char  # Restore original character

        # Case 3: Check all 2-edit variations (only if 1-edit didn't find match)
        if not found:
            for i in range(n):
                if found: break  # Early exit
                for j in range(i + 1, n):  # j > i to avoid duplicate pairs
                    if found: break  # Early exit

                    original_i, original_j = query_list[i], query_list[j]

                    # Try all combinations for two positions
                    for c1 in 'abcdefghijklmnopqrstuvwxyz':
                        if found: break
                        if c1 == original_i:
                            continue

                        query_list[i] = c1

                        for c2 in 'abcdefghijklmnopqrstuvwxyz':
                            if c2 == original_j:
                                continue

                            query_list[j] = c2
                            modified = ''.join(query_list)

                            if modified in dict_set:
                                found = True
                                break

                        query_list[j] = original_j  # Restore j

                    query_list[i] = original_i  # Restore i

        # Add query to result if any variation was found in dictionary
        if found:
            result.append(query)

    return result
```

```javascript
// Optimal Solution using Hash Set and Variation Generation
// Time: O(q * n^2 * 25^2) | Space: O(d + q * n^2)
function twoEditWords(queries, dictionary) {
  // Step 1: Convert dictionary to set for O(1) lookups
  const dictSet = new Set(dictionary);
  const result = [];

  // Step 2: Process each query word
  for (const query of queries) {
    const n = query.length;
    let found = false;

    // Case 1: Check the word itself (0 edits)
    if (dictSet.has(query)) {
      result.push(query);
      continue; // Move to next query
    }

    // Case 2: Check all 1-edit variations
    const queryArr = query.split(""); // Convert to array for mutable operations
    for (let i = 0; i < n && !found; i++) {
      const originalChar = queryArr[i];

      // Try changing this position to every other letter
      for (let c = 97; c <= 122; c++) {
        // ASCII codes for 'a' to 'z'
        const char = String.fromCharCode(c);
        if (char === originalChar) continue; // Skip same character

        queryArr[i] = char;
        const modified = queryArr.join("");

        if (dictSet.has(modified)) {
          found = true;
          break; // Found a match
        }
      }
      queryArr[i] = originalChar; // Restore original character
    }

    // Case 3: Check all 2-edit variations (only if 1-edit didn't find match)
    if (!found) {
      for (let i = 0; i < n && !found; i++) {
        for (let j = i + 1; j < n && !found; j++) {
          // j > i to avoid duplicates
          const originalI = queryArr[i];
          const originalJ = queryArr[j];

          // Try all combinations for two positions
          for (let c1 = 97; c1 <= 122 && !found; c1++) {
            const char1 = String.fromCharCode(c1);
            if (char1 === originalI) continue;

            queryArr[i] = char1;

            for (let c2 = 97; c2 <= 122 && !found; c2++) {
              const char2 = String.fromCharCode(c2);
              if (char2 === originalJ) continue;

              queryArr[j] = char2;
              const modified = queryArr.join("");

              if (dictSet.has(modified)) {
                found = true;
                break;
              }
            }
            queryArr[j] = originalJ; // Restore j
          }
          queryArr[i] = originalI; // Restore i
        }
      }
    }

    // Add query to result if any variation was found in dictionary
    if (found) {
      result.push(query);
    }
  }

  return result;
}
```

```java
// Optimal Solution using Hash Set and Variation Generation
// Time: O(q * n^2 * 25^2) | Space: O(d + q * n^2)
public List<String> twoEditWords(String[] queries, String[] dictionary) {
    // Step 1: Convert dictionary to set for O(1) lookups
    Set<String> dictSet = new HashSet<>(Arrays.asList(dictionary));
    List<String> result = new ArrayList<>();

    // Step 2: Process each query word
    for (String query : queries) {
        int n = query.length();
        boolean found = false;

        // Case 1: Check the word itself (0 edits)
        if (dictSet.contains(query)) {
            result.add(query);
            continue;  // Move to next query
        }

        // Case 2: Check all 1-edit variations
        char[] queryArr = query.toCharArray();  // Convert to array for mutable operations
        for (int i = 0; i < n && !found; i++) {
            char originalChar = queryArr[i];

            // Try changing this position to every other letter
            for (char c = 'a'; c <= 'z'; c++) {
                if (c == originalChar) continue;  // Skip same character

                queryArr[i] = c;
                String modified = new String(queryArr);

                if (dictSet.contains(modified)) {
                    found = true;
                    break;  // Found a match
                }
            }
            queryArr[i] = originalChar;  // Restore original character
        }

        // Case 3: Check all 2-edit variations (only if 1-edit didn't find match)
        if (!found) {
            for (int i = 0; i < n && !found; i++) {
                for (int j = i + 1; j < n && !found; j++) {  // j > i to avoid duplicates
                    char originalI = queryArr[i];
                    char originalJ = queryArr[j];

                    // Try all combinations for two positions
                    for (char c1 = 'a'; c1 <= 'z' && !found; c1++) {
                        if (c1 == originalI) continue;

                        queryArr[i] = c1;

                        for (char c2 = 'a'; c2 <= 'z' && !found; c2++) {
                            if (c2 == originalJ) continue;

                            queryArr[j] = c2;
                            String modified = new String(queryArr);

                            if (dictSet.contains(modified)) {
                                found = true;
                                break;
                            }
                        }
                        queryArr[j] = originalJ;  // Restore j
                    }
                    queryArr[i] = originalI;  // Restore i
                }
            }
        }

        // Add query to result if any variation was found in dictionary
        if (found) {
            result.add(query);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Let q = number of queries, d = dictionary size, n = word length
- Converting dictionary to set: O(d)
- For each query:
  - 0-edit check: O(1)
  - 1-edit variations: O(n × 25) = O(n)
  - 2-edit variations: O(n² × 25²) = O(n²)
- Total: O(d + q × n²)
- In practice, 25² = 625 is constant, and we often exit early when finding a match

**Space Complexity:**

- Dictionary set: O(d)
- Temporary storage for word variations: O(n) for character arrays
- Output list: O(q) in worst case
- Total: O(d + q + n) = O(d + q) since n is typically small

## Common Mistakes

1. **Not using early termination**: Some candidates generate ALL variations before checking any against the dictionary. Always check as you generate and exit early when you find a match.

2. **Forgetting to restore characters**: When modifying character arrays to create variations, it's crucial to restore the original characters before trying the next variation. Otherwise, changes accumulate incorrectly.

3. **Duplicate position pairs in 2-edit case**: When selecting two positions to change, always ensure j > i to avoid checking the same pair twice (e.g., (1,2) and (2,1)).

4. **Inefficient alphabet iteration**: Using a pre-defined string/array of 26 letters is cleaner than generating characters dynamically or using magic numbers.

## When You'll See This Pattern

This "bounded edit distance" pattern appears in several problems:

1. **Word Ladder (Hard)**: Find shortest transformation sequence between words, changing one letter at a time. Uses BFS with similar word generation.

2. **Search Suggestions System (Medium)**: Suggest products based on prefix matches, often implemented with tries.

3. **Implement Magic Dictionary (Medium)**: Similar concept - check if a word can match any dictionary word with exactly one edit.

The core technique is recognizing that when edit distance is small (≤ 2), it's more efficient to generate all possible variations of the query than to compare against all dictionary words.

## Key Takeaways

1. **Small edit distance enables generation over comparison**: When k is small (typically ≤ 2), generating all k-edit variations is more efficient than comparing against many dictionary words.

2. **Hash sets provide O(1) membership testing**: Converting the dictionary to a set allows instant checking if a generated variation exists.

3. **Early termination is critical**: Always check variations as you generate them and stop as soon as you find a match to avoid unnecessary work.

Related problems: [Word Ladder](/problem/word-ladder)
