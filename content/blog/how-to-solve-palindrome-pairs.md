---
title: "How to Solve Palindrome Pairs — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Palindrome Pairs. Hard difficulty, 37.0% acceptance rate. Topics: Array, Hash Table, String, Trie."
date: "2028-06-03"
category: "dsa-patterns"
tags: ["palindrome-pairs", "array", "hash-table", "string", "hard"]
---

# How to Solve Palindrome Pairs

This problem asks us to find all pairs of distinct indices `(i, j)` where concatenating `words[i]` and `words[j]` forms a palindrome. What makes this problem challenging is that we need to efficiently check all possible pairings without resorting to the O(n² × L) brute force approach (where n is the number of words and L is the average word length). The key insight is recognizing that for a concatenation to be a palindrome, one word must be the reverse of some prefix or suffix of the other word, with the remaining part being a palindrome itself.

## Visual Walkthrough

Let's trace through an example: `words = ["abcd", "dcba", "lls", "s", "sssll"]`

We want to find all pairs where concatenation is a palindrome:

1. **"abcd" + "dcba"** = "abcddcba" → This is a palindrome (reverse of itself)
2. **"dcba" + "abcd"** = "dcbaabcd" → This is also a palindrome
3. **"lls" + "s"** = "llss" → Check: "lls" + "s" = "llss" → "llss" reversed is "ssll" (not equal)
   Wait, let's check more carefully: "lls" + "s" = "llss" → "s" + "lls" = "slls" (palindrome!)
   Actually, "s" + "lls" = "slls" which reads the same forwards and backwards.
4. **"lls" + "sssll"** → "llssssll" is a palindrome

The challenge is finding these efficiently. Let's think about "lls" and "s":

- When we consider "lls", we can split it into prefix "ll" and suffix "s"
- The suffix "s" is a palindrome (single character always is)
- The reverse of the prefix "ll" is "ll", which exists as a word ("ll" doesn't exist, but wait...)
- Actually, for "lls" + "s" to work, we need the reverse of "s" to exist as a word
- Reverse of "s" is "s", which exists in our list
- And the remaining part "ll" must be a palindrome (which it is)

This gives us the general approach: For each word, check all possible splits into prefix and suffix. If one part is a palindrome, check if the reverse of the other part exists as a word.

## Brute Force Approach

The most straightforward solution is to check every possible pair:

<div class="code-group">

```python
# Time: O(n² × L) | Space: O(1) excluding output
def palindromePairs_brute(words):
    result = []
    n = len(words)

    for i in range(n):
        for j in range(n):
            if i != j:
                concat = words[i] + words[j]
                if concat == concat[::-1]:  # Check if palindrome
                    result.append([i, j])

    return result
```

```javascript
// Time: O(n² × L) | Space: O(1) excluding output
function palindromePairsBrute(words) {
  const result = [];
  const n = words.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const concat = words[i] + words[j];
        if (concat === concat.split("").reverse().join("")) {
          result.push([i, j]);
        }
      }
    }
  }

  return result;
}
```

```java
// Time: O(n² × L) | Space: O(1) excluding output
public List<List<Integer>> palindromePairsBrute(String[] words) {
    List<List<Integer>> result = new ArrayList<>();
    int n = words.length;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j) {
                String concat = words[i] + words[j];
                if (isPalindrome(concat)) {
                    result.add(Arrays.asList(i, j));
                }
            }
        }
    }

    return result;
}

private boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
```

</div>

**Why this is too slow:** With n up to 5000 and word length up to 300, the O(n² × L) complexity becomes prohibitive (up to 5000² × 300 ≈ 7.5 billion operations). We need something closer to O(n × L²).

## Optimized Approach

The key insight is that for two words A and B to form a palindrome when concatenated as A+B, one of these must be true:

1. **Case 1:** Reverse of B is a prefix of A, and the remaining suffix of A is a palindrome
   - Example: A = "abcd", B = "dcba" → Reverse of B = "abcd" matches A exactly, empty suffix is palindrome
2. **Case 2:** Reverse of A is a suffix of B, and the remaining prefix of B is a palindrome
   - Example: A = "lls", B = "s" → Reverse of A = "sll" ends with "s", prefix "ll" of B is palindrome

More formally, for word A at index i and word B at index j:

- If reverse(B) is a prefix of A, and the remaining part of A is a palindrome → A+B is palindrome
- If reverse(A) is a suffix of B, and the remaining part of B is a palindrome → B+A is palindrome

We can implement this efficiently using a hash map to store word-to-index mappings, allowing O(1) lookups for reversed strings.

## Optimal Solution

Here's the step-by-step algorithm:

1. Create a dictionary mapping each word to its index
2. For each word, consider all possible splits into prefix and suffix
3. If prefix is a palindrome, check if reverse of suffix exists as a word (and it's not the same word)
4. If suffix is a palindrome, check if reverse of prefix exists as a word (and it's not the same word)
5. Special case: Empty string can pair with any palindrome

<div class="code-group">

```python
# Time: O(n × L²) | Space: O(n) for the hash map
def palindromePairs(words):
    # Step 1: Create a dictionary mapping each word to its index
    word_to_index = {word: i for i, word in enumerate(words)}
    result = []

    # Helper function to check if a string is a palindrome
    def is_palindrome(s, left, right):
        # Check substring s[left:right+1] for palindrome property
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    # Step 2: Process each word
    for i, word in enumerate(words):
        n = len(word)

        # Step 3: Check all possible splits
        for j in range(n + 1):  # j represents split point
            # Case 1: prefix is palindrome, check reverse of suffix
            if is_palindrome(word, 0, j - 1):
                suffix_rev = word[j:][::-1]
                # Check if reversed suffix exists and it's not the same word
                if suffix_rev in word_to_index and word_to_index[suffix_rev] != i:
                    result.append([word_to_index[suffix_rev], i])

            # Case 2: suffix is palindrome, check reverse of prefix
            if is_palindrome(word, j, n - 1):
                prefix_rev = word[:j][::-1]
                # Check if reversed prefix exists and it's not the same word
                if prefix_rev in word_to_index and word_to_index[prefix_rev] != i:
                    # Avoid duplicate when j == 0 (already covered by first case)
                    if j != 0 or prefix_rev != "":  # Special handling for empty string
                        result.append([i, word_to_index[prefix_rev]])

    return result
```

```javascript
// Time: O(n × L²) | Space: O(n) for the hash map
function palindromePairs(words) {
  // Step 1: Create a map from each word to its index
  const wordToIndex = new Map();
  for (let i = 0; i < words.length; i++) {
    wordToIndex.set(words[i], i);
  }

  const result = [];

  // Helper function to check if a substring is a palindrome
  const isPalindrome = (s, left, right) => {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  };

  // Step 2: Process each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const n = word.length;

    // Step 3: Check all possible splits
    for (let j = 0; j <= n; j++) {
      // Case 1: prefix is palindrome, check reverse of suffix
      if (isPalindrome(word, 0, j - 1)) {
        const suffixRev = word.substring(j).split("").reverse().join("");
        if (wordToIndex.has(suffixRev) && wordToIndex.get(suffixRev) !== i) {
          result.push([wordToIndex.get(suffixRev), i]);
        }
      }

      // Case 2: suffix is palindrome, check reverse of prefix
      if (isPalindrome(word, j, n - 1)) {
        const prefixRev = word.substring(0, j).split("").reverse().join("");
        if (wordToIndex.has(prefixRev) && wordToIndex.get(prefixRev) !== i) {
          // Avoid duplicate when j == 0 (already covered by first case)
          if (j !== 0 || prefixRev !== "") {
            result.push([i, wordToIndex.get(prefixRev)]);
          }
        }
      }
    }
  }

  return result;
}
```

```java
// Time: O(n × L²) | Space: O(n) for the hash map
public List<List<Integer>> palindromePairs(String[] words) {
    // Step 1: Create a map from each word to its index
    Map<String, Integer> wordToIndex = new HashMap<>();
    for (int i = 0; i < words.length; i++) {
        wordToIndex.put(words[i], i);
    }

    List<List<Integer>> result = new ArrayList<>();

    // Step 2: Process each word
    for (int i = 0; i < words.length; i++) {
        String word = words[i];
        int n = word.length();

        // Step 3: Check all possible splits
        for (int j = 0; j <= n; j++) {
            // Case 1: prefix is palindrome, check reverse of suffix
            if (isPalindrome(word, 0, j - 1)) {
                String suffixRev = new StringBuilder(word.substring(j)).reverse().toString();
                if (wordToIndex.containsKey(suffixRev) && wordToIndex.get(suffixRev) != i) {
                    result.add(Arrays.asList(wordToIndex.get(suffixRev), i));
                }
            }

            // Case 2: suffix is palindrome, check reverse of prefix
            if (isPalindrome(word, j, n - 1)) {
                String prefixRev = new StringBuilder(word.substring(0, j)).reverse().toString();
                if (wordToIndex.containsKey(prefixRev) && wordToIndex.get(prefixRev) != i) {
                    // Avoid duplicate when j == 0 (already covered by first case)
                    if (j != 0 || !prefixRev.isEmpty()) {
                        result.add(Arrays.asList(i, wordToIndex.get(prefixRev)));
                    }
                }
            }
        }
    }

    return result;
}

// Helper function to check if a substring is a palindrome
private boolean isPalindrome(String s, int left, int right) {
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × L²)

- We iterate through n words
- For each word of length L, we consider L+1 split points
- For each split, we check if a substring is a palindrome (O(L) time)
- Total: O(n × L × L) = O(n × L²)

**Space Complexity:** O(n)

- We store a hash map with n entries
- The output list could contain O(n²) pairs in worst case, but this is considered output space

## Common Mistakes

1. **Forgetting to handle the empty string case:** An empty string can pair with any palindrome. Our solution handles this because when j=0, the prefix is empty (which is a palindrome), and we check if the reverse of the entire word exists.

2. **Adding duplicate pairs:** When j=0, both cases can trigger. We need the `if (j != 0 || prefixRev != "")` check to avoid adding the same pair twice. For example, with ["a", ""], we might add [0,1] twice without this check.

3. **Not checking that i ≠ j:** We must ensure we don't pair a word with itself. Our check `word_to_index[suffix_rev] != i` handles this.

4. **Inefficient palindrome checking:** Checking the entire concatenated string for each pair would be O(L). Instead, we check substrings of individual words, which is more efficient.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Reverse string matching** (like in "Shortest Palindrome"): The core insight involves checking if the reverse of one string matches part of another.

2. **Prefix/suffix decomposition** (like in "Longest Palindromic Substring"): Breaking strings into parts where one part must be a palindrome.

3. **Hash map for O(1) lookups**: Storing words in a hash map to quickly check if a reversed substring exists as a complete word.

Related problems that use similar techniques:

- **Shortest Palindrome**: Find the shortest palindrome by adding characters to the beginning. Uses similar prefix palindrome checking.
- **Longest Palindromic Substring**: Find the longest palindrome within a string using expansion from centers.
- **Longest Palindrome by Concatenating Two Letter Words**: Find palindrome length from word pairs, using similar pairing logic.

## Key Takeaways

1. **When dealing with string concatenation problems**, consider breaking strings into prefix/suffix parts and checking palindrome conditions on the individual parts rather than the full concatenation.

2. **Hash maps are powerful for string lookup problems** when you need to check if some transformation (like reversal) of a string exists in a collection.

3. **The empty string is a special case** in many palindrome problems—it's always a palindrome and can pair with any other palindrome.

Related problems: [Longest Palindromic Substring](/problem/longest-palindromic-substring), [Shortest Palindrome](/problem/shortest-palindrome), [Longest Palindrome by Concatenating Two Letter Words](/problem/longest-palindrome-by-concatenating-two-letter-words)
