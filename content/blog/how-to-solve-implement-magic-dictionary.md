---
title: "How to Solve Implement Magic Dictionary — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Implement Magic Dictionary. Medium difficulty, 57.7% acceptance rate. Topics: Hash Table, String, Depth-First Search, Design, Trie."
date: "2027-05-13"
category: "dsa-patterns"
tags: ["implement-magic-dictionary", "hash-table", "string", "depth-first-search", "medium"]
---

# How to Solve Implement Magic Dictionary

You need to design a data structure that stores a dictionary of words and can answer queries asking: "Can I change exactly one character in this query word to match any word in my dictionary?" The challenge is that you must match **exactly one** character change — zero changes (exact match) doesn't count, and two or more changes don't count either. This makes the problem interesting because you need to efficiently check for "near matches" with exactly one difference.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose our dictionary is: `["hello", "hallo", "leetcode"]`

**Query 1:** `"hello"` → Should return `false`

- Even though "hello" is in the dictionary, we need exactly ONE character change
- Changing 0 characters gives us an exact match, which doesn't count
- So this should return `false`

**Query 2:** `"hhllo"` → Should return `true`

- Change the second character 'h' to 'e' → "hello" (in dictionary)
- Exactly one character changed, so `true`

**Query 3:** `"hell"` → Should return `false`

- We'd need to add a character (not allowed) or change multiple characters
- No single character change can make it match "hello" or "hallo"
- So `false`

**Query 4:** `"leetcodd"` → Should return `true`

- Change the last 'd' to 'e' → "leetcode" (in dictionary)
- Exactly one character changed, so `true`

The key insight: For a query word of length L, we need to check if there's any dictionary word of the same length where exactly one character differs.

## Brute Force Approach

The most straightforward approach is:

1. Store all dictionary words in a list
2. For each query, compare it against every word in the dictionary
3. For each comparison, check if the words have the same length and exactly one character difference

<div class="code-group">

```python
# Time: O(N * L) per search where N = number of words, L = word length
# Space: O(N * L) to store all words
class MagicDictionary:
    def __init__(self):
        self.words = []

    def buildDict(self, dictionary):
        # Simply store all words
        self.words = dictionary

    def search(self, searchWord):
        # Compare against every word in dictionary
        for word in self.words:
            # Only consider words of same length
            if len(word) != len(searchWord):
                continue

            # Count character differences
            diff_count = 0
            for i in range(len(word)):
                if word[i] != searchWord[i]:
                    diff_count += 1
                    # Early exit if more than one difference
                    if diff_count > 1:
                        break

            # Exactly one difference means success
            if diff_count == 1:
                return True

        return False
```

```javascript
// Time: O(N * L) per search where N = number of words, L = word length
// Space: O(N * L) to store all words
class MagicDictionary {
  constructor() {
    this.words = [];
  }

  buildDict(dictionary) {
    // Simply store all words
    this.words = dictionary;
  }

  search(searchWord) {
    // Compare against every word in dictionary
    for (const word of this.words) {
      // Only consider words of same length
      if (word.length !== searchWord.length) {
        continue;
      }

      // Count character differences
      let diffCount = 0;
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== searchWord[i]) {
          diffCount++;
          // Early exit if more than one difference
          if (diffCount > 1) {
            break;
          }
        }
      }

      // Exactly one difference means success
      if (diffCount === 1) {
        return true;
      }
    }

    return false;
  }
}
```

```java
// Time: O(N * L) per search where N = number of words, L = word length
// Space: O(N * L) to store all words
class MagicDictionary {
    private List<String> words;

    public MagicDictionary() {
        words = new ArrayList<>();
    }

    public void buildDict(String[] dictionary) {
        // Simply store all words
        words = Arrays.asList(dictionary);
    }

    public boolean search(String searchWord) {
        // Compare against every word in dictionary
        for (String word : words) {
            // Only consider words of same length
            if (word.length() != searchWord.length()) {
                continue;
            }

            // Count character differences
            int diffCount = 0;
            for (int i = 0; i < word.length(); i++) {
                if (word.charAt(i) != searchWord.charAt(i)) {
                    diffCount++;
                    // Early exit if more than one difference
                    if (diffCount > 1) {
                        break;
                    }
                }
            }

            // Exactly one difference means success
            if (diffCount == 1) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

**Why this is insufficient:** While this works, it's inefficient for multiple queries. Each search takes O(N × L) time where N is the number of dictionary words and L is the average word length. If we have many queries, this becomes too slow. We need a way to quickly find candidate words without checking every word in the dictionary.

## Optimized Approach

The key insight is that we can group words by their length, since only words of the same length can match with exactly one character change. But we can do even better with a **neighbor-based approach**:

For each word in the dictionary, generate all possible "generalized neighbors" by replacing each character with a wildcard (`*`). For example:

- `"hello"` generates: `"*ello"`, `"h*llo"`, `"he*lo"`, `"hel*o"`, `"hell*"`

Store these patterns in a hash map. When searching for a word, generate all its wildcard patterns and check if any pattern exists in our map. However, we must be careful: if the pattern matches the original word exactly (no character change), we need to ensure there's at least one **other** word that also matches that pattern.

**Example:** Dictionary = `["hello", "hallo"]`

- Both generate `"h*llo"` pattern
- Query `"hello"` also generates `"h*llo"` pattern
- But `"hello"` itself is in the dictionary, so we need to check if there's another word that also matches `"h*llo"` (yes, `"hallo"`)

**Alternative approach:** Use a trie for more efficient prefix-based searching, but the wildcard approach is simpler and works well for this problem.

## Optimal Solution

We'll implement the wildcard pattern approach. For each word, we generate all patterns with one character replaced by `*`, and store them in a map. The map value tracks both the count of words matching each pattern and a set of the actual words (to handle the case where the query word itself is in the dictionary).

<div class="code-group">

```python
# Time: O(L^2) for buildDict (for each word, generate L patterns)
# Time: O(L^2) for search (generate L patterns and check each)
# Space: O(N * L^2) to store all patterns
class MagicDictionary:
    def __init__(self):
        # Map from pattern to (count, set_of_words_that_match)
        self.pattern_map = {}

    def buildDict(self, dictionary):
        """Build the dictionary by generating all wildcard patterns."""
        self.pattern_map.clear()

        for word in dictionary:
            # Convert to list for easy character replacement
            chars = list(word)

            # Generate all patterns by replacing each position with '*'
            for i in range(len(chars)):
                # Save original character
                original = chars[i]

                # Replace with wildcard
                chars[i] = '*'

                # Create pattern string
                pattern = ''.join(chars)

                # Update pattern map
                if pattern not in self.pattern_map:
                    self.pattern_map[pattern] = [0, set()]

                # Increment count and add word to set
                self.pattern_map[pattern][0] += 1
                self.pattern_map[pattern][1].add(word)

                # Restore original character for next iteration
                chars[i] = original

    def search(self, searchWord):
        """Search if we can change exactly one character to match a dictionary word."""
        chars = list(searchWord)

        # Generate all patterns for the search word
        for i in range(len(chars)):
            # Save original character
            original = chars[i]

            # Replace with wildcard
            chars[i] = '*'

            # Create pattern string
            pattern = ''.join(chars)

            # Check if this pattern exists in our map
            if pattern in self.pattern_map:
                count, words = self.pattern_map[pattern]

                # We need at least one word matching this pattern
                # AND either:
                # 1. The search word is NOT in the set (different word matches)
                # 2. OR there are multiple words matching (including search word)
                if count > 1 or (count == 1 and searchWord not in words):
                    return True

            # Restore original character for next iteration
            chars[i] = original

        # No matching pattern found
        return False
```

```javascript
// Time: O(L^2) for buildDict (for each word, generate L patterns)
// Time: O(L^2) for search (generate L patterns and check each)
// Space: O(N * L^2) to store all patterns
class MagicDictionary {
  constructor() {
    // Map from pattern to {count, wordsSet}
    this.patternMap = new Map();
  }

  buildDict(dictionary) {
    // Clear existing patterns
    this.patternMap.clear();

    for (const word of dictionary) {
      // Convert to array for easy character replacement
      const chars = word.split("");

      // Generate all patterns by replacing each position with '*'
      for (let i = 0; i < chars.length; i++) {
        // Save original character
        const original = chars[i];

        // Replace with wildcard
        chars[i] = "*";

        // Create pattern string
        const pattern = chars.join("");

        // Update pattern map
        if (!this.patternMap.has(pattern)) {
          this.patternMap.set(pattern, { count: 0, wordsSet: new Set() });
        }

        const entry = this.patternMap.get(pattern);
        entry.count++;
        entry.wordsSet.add(word);

        // Restore original character for next iteration
        chars[i] = original;
      }
    }
  }

  search(searchWord) {
    const chars = searchWord.split("");

    // Generate all patterns for the search word
    for (let i = 0; i < chars.length; i++) {
      // Save original character
      const original = chars[i];

      // Replace with wildcard
      chars[i] = "*";

      // Create pattern string
      const pattern = chars.join("");

      // Check if this pattern exists in our map
      if (this.patternMap.has(pattern)) {
        const { count, wordsSet } = this.patternMap.get(pattern);

        // We need at least one word matching this pattern
        // AND either:
        // 1. The search word is NOT in the set (different word matches)
        // 2. OR there are multiple words matching (including search word)
        if (count > 1 || (count === 1 && !wordsSet.has(searchWord))) {
          return true;
        }
      }

      // Restore original character for next iteration
      chars[i] = original;
    }

    // No matching pattern found
    return false;
  }
}
```

```java
// Time: O(L^2) for buildDict (for each word, generate L patterns)
// Time: O(L^2) for search (generate L patterns and check each)
// Space: O(N * L^2) to store all patterns
class MagicDictionary {
    // Helper class to store count and set of words for a pattern
    class PatternInfo {
        int count;
        Set<String> wordsSet;

        PatternInfo() {
            count = 0;
            wordsSet = new HashSet<>();
        }
    }

    private Map<String, PatternInfo> patternMap;

    public MagicDictionary() {
        patternMap = new HashMap<>();
    }

    public void buildDict(String[] dictionary) {
        // Clear existing patterns
        patternMap.clear();

        for (String word : dictionary) {
            // Convert to char array for easy character replacement
            char[] chars = word.toCharArray();

            // Generate all patterns by replacing each position with '*'
            for (int i = 0; i < chars.length; i++) {
                // Save original character
                char original = chars[i];

                // Replace with wildcard
                chars[i] = '*';

                // Create pattern string
                String pattern = new String(chars);

                // Update pattern map
                PatternInfo info = patternMap.get(pattern);
                if (info == null) {
                    info = new PatternInfo();
                    patternMap.put(pattern, info);
                }

                info.count++;
                info.wordsSet.add(word);

                // Restore original character for next iteration
                chars[i] = original;
            }
        }
    }

    public boolean search(String searchWord) {
        char[] chars = searchWord.toCharArray();

        // Generate all patterns for the search word
        for (int i = 0; i < chars.length; i++) {
            // Save original character
            char original = chars[i];

            // Replace with wildcard
            chars[i] = '*';

            // Create pattern string
            String pattern = new String(chars);

            // Check if this pattern exists in our map
            PatternInfo info = patternMap.get(pattern);
            if (info != null) {
                // We need at least one word matching this pattern
                // AND either:
                // 1. The search word is NOT in the set (different word matches)
                // 2. OR there are multiple words matching (including search word)
                if (info.count > 1 || (info.count == 1 && !info.wordsSet.contains(searchWord))) {
                    return true;
                }
            }

            // Restore original character for next iteration
            chars[i] = original;
        }

        // No matching pattern found
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `buildDict()`: O(N × L²) where N is the number of words and L is the average word length. For each word, we generate L patterns (one for each position), and creating each pattern takes O(L) time for string construction.
- `search()`: O(L²) where L is the length of the search word. We generate L patterns, each taking O(L) time to construct, and each hash map lookup is O(1) on average.

**Space Complexity:** O(N × L²) to store all the patterns. For each of N words, we store L patterns, and each pattern string has length L.

**Why this is optimal for this problem:** The wildcard approach gives us O(L²) search time, which is independent of the dictionary size N. This is much better than the brute force O(N × L) when we have many queries. The trade-off is higher memory usage and slower build time, but in interview scenarios, we typically optimize for query performance.

## Common Mistakes

1. **Forgetting to handle exact matches:** The most common mistake is returning `true` when the search word exactly matches a dictionary word. Remember: you must change **exactly one** character. Zero changes doesn't count. Our solution handles this by checking if the search word itself is in the set of words matching a pattern.

2. **Not checking for multiple words matching the same pattern:** If two dictionary words differ in the same position (like "hello" and "hallo"), they generate the same wildcard pattern. When searching for "hello", the pattern "h\*llo" will match, but we need to ensure there's at least one **other** word that also matches this pattern. That's why we store counts and word sets.

3. **Inefficient pattern generation:** Some candidates generate patterns by creating new strings with string concatenation in a loop, which can be O(L²) per pattern. It's more efficient to work with character arrays and convert to strings only when needed, as shown in our solution.

4. **Not considering words of different lengths:** Only words of the same length can match with exactly one character change. Our solution implicitly handles this because patterns for words of different lengths will be different (different string lengths).

## When You'll See This Pattern

The wildcard/pattern matching technique appears in several other problems:

1. **Word Ladder (Medium):** Finding the shortest transformation sequence between words by changing one letter at a time. The same wildcard pattern approach is used to build an adjacency graph efficiently.

2. **Implement Trie (Prefix Tree) (Medium):** While our solution uses hash maps, a trie-based approach could also work for this problem. Tries are excellent for prefix-based searches and wildcard matching.

3. **Longest Word in Dictionary (Medium):** Finding words that can be built one letter at a time. The incremental building process relates to our character-by-character transformation.

The core pattern is: when you need to find "neighbors" or "similar" strings (differing by exactly one character), generating wildcard patterns is an efficient way to group similar strings together for quick lookup.

## Key Takeaways

1. **Wildcard patterns are powerful for "one-character-difference" problems:** By replacing each position with a wildcard, you can efficiently group and find strings that differ in exactly one position.

2. **Trade build time for query time:** In design problems where queries are frequent, it's often worth spending more time and memory during initialization to make queries fast. Our solution does O(N × L²) work upfront to enable O(L²) queries.

3. **Handle edge cases with data structure design:** By storing both counts and actual word sets for each pattern, we elegantly handle the "exact match shouldn't count" requirement. This shows how careful data structure design can simplify complex logic.

Related problems: [Implement Trie (Prefix Tree)](/problem/implement-trie-prefix-tree), [Longest Word in Dictionary](/problem/longest-word-in-dictionary)
