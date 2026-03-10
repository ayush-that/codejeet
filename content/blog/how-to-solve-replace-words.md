---
title: "How to Solve Replace Words — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Replace Words. Medium difficulty, 68.6% acceptance rate. Topics: Array, Hash Table, String, Trie."
date: "2027-12-09"
category: "dsa-patterns"
tags: ["replace-words", "array", "hash-table", "string", "medium"]
---

# How to Solve Replace Words

This problem asks us to replace words in a sentence with their shortest matching root from a dictionary. The challenge is efficiently checking, for each word, whether any prefix exists in the dictionary, and if multiple do, choosing the shortest one. The interesting part is that we need to perform many prefix lookups, which is exactly what a trie (prefix tree) excels at.

## Visual Walkthrough

Let's trace through a concrete example:

**Input:**

- Dictionary: `["cat", "bat", "rat"]`
- Sentence: `"the cattle was rattled by the battery"`

**Step-by-step process:**

1. **Build a trie** from the dictionary:
   - Insert "cat": c → a → t (mark end)
   - Insert "bat": b → a → t (mark end)
   - Insert "rat": r → a → t (mark end)

2. **Process each word** in the sentence:
   - Word 1: "the" → No prefix in trie → keep "the"
   - Word 2: "cattle" → Check prefixes:
     - "c" exists
     - "ca" exists
     - "cat" exists AND is marked as a complete word → replace with "cat"
   - Word 3: "was" → No prefix in trie → keep "was"
   - Word 4: "rattled" → Check prefixes:
     - "r" exists
     - "ra" exists
     - "rat" exists AND is marked as a complete word → replace with "rat"
   - Word 5: "by" → No prefix in trie → keep "by"
   - Word 6: "the" → No prefix in trie → keep "the"
   - Word 7: "battery" → Check prefixes:
     - "b" exists
     - "ba" exists
     - "bat" exists AND is marked as a complete word → replace with "bat"

**Result:** `"the cat was rat by the bat"`

The key insight: we stop at the first complete root we find while traversing the trie with each word, because we're checking prefixes in order from shortest to longest.

## Brute Force Approach

A naive approach would be: for each word in the sentence, check every root in the dictionary to see if it's a prefix of the word, and if so, replace with the shortest matching root.

**Why this is inefficient:**

- For each of `n` words in the sentence, we check all `m` roots in the dictionary
- For each root, we do a string prefix comparison (up to length `L`)
- Time complexity: `O(n * m * L)` where `n` is words in sentence, `m` is roots, `L` is average word length
- With typical constraints (up to 1000 words, 1000 roots), this could be up to 1 million operations

**What makes it worse:** We're repeatedly checking the same prefixes. For the word "cattle", we check if "cat" is a prefix, then "bat", then "rat" — but we already know "cat" works! We need a way to organize our dictionary for efficient prefix lookups.

## Optimized Approach

The key insight is that we need to perform **many prefix lookups**. A trie (prefix tree) is the perfect data structure for this because:

1. It organizes words by their prefixes
2. It allows us to check if any prefix of a word exists in `O(L)` time where `L` is the word length
3. We can stop as soon as we find the shortest matching root

**Step-by-step reasoning:**

1. **Build a trie** from all roots in the dictionary
   - Each node represents a character
   - Mark nodes that complete a root word
2. **Process each word** in the sentence:
   - Traverse the trie character by character
   - If we reach a node marked as a root end, that's our replacement
   - If we reach a character not in the trie, keep the original word
   - If we finish the word without finding a root, keep the original word
3. **Join the processed words** back into a sentence

**Why this is optimal:** Each word lookup takes `O(L)` time where `L` is the word length, and building the trie takes `O(R)` where `R` is the total characters in all roots. This is much better than comparing each word against every root.

## Optimal Solution

<div class="code-group">

```python
# Time: O(N + S) where N = total chars in dictionary, S = total chars in sentence
# Space: O(N) for the trie
class TrieNode:
    def __init__(self):
        self.children = {}  # Map character to child node
        self.is_end = False  # Marks the end of a root word

class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        # Step 1: Build the trie from dictionary roots
        root = TrieNode()

        # Insert each root into the trie
        for word in dictionary:
            node = root
            for char in word:
                # Create child node if it doesn't exist
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            # Mark the end of this root word
            node.is_end = True

        # Step 2: Process each word in the sentence
        words = sentence.split()
        result = []

        for word in words:
            node = root
            replacement = []

            # Try to find the shortest root prefix
            for char in word:
                # If character not in trie or we found a complete root
                if char not in node.children or node.is_end:
                    break
                # Add character to potential replacement
                replacement.append(char)
                node = node.children[char]

            # If we found a complete root, use it; otherwise keep original word
            if node.is_end:
                result.append(''.join(replacement))
            else:
                result.append(word)

        # Step 3: Join processed words back into a sentence
        return ' '.join(result)
```

```javascript
// Time: O(N + S) where N = total chars in dictionary, S = total chars in sentence
// Space: O(N) for the trie
class TrieNode {
  constructor() {
    this.children = new Map(); // Map character to child node
    this.isEnd = false; // Marks the end of a root word
  }
}

/**
 * @param {string[]} dictionary
 * @param {string} sentence
 * @return {string}
 */
var replaceWords = function (dictionary, sentence) {
  // Step 1: Build the trie from dictionary roots
  const root = new TrieNode();

  // Insert each root into the trie
  for (const word of dictionary) {
    let node = root;
    for (const char of word) {
      // Create child node if it doesn't exist
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    // Mark the end of this root word
    node.isEnd = true;
  }

  // Step 2: Process each word in the sentence
  const words = sentence.split(" ");
  const result = [];

  for (const word of words) {
    let node = root;
    let replacement = [];

    // Try to find the shortest root prefix
    for (const char of word) {
      // If character not in trie or we found a complete root
      if (!node.children.has(char) || node.isEnd) {
        break;
      }
      // Add character to potential replacement
      replacement.push(char);
      node = node.children.get(char);
    }

    // If we found a complete root, use it; otherwise keep original word
    if (node.isEnd) {
      result.push(replacement.join(""));
    } else {
      result.push(word);
    }
  }

  // Step 3: Join processed words back into a sentence
  return result.join(" ");
};
```

```java
// Time: O(N + S) where N = total chars in dictionary, S = total chars in sentence
// Space: O(N) for the trie
class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEnd;

    public TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}

class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        // Step 1: Build the trie from dictionary roots
        TrieNode root = new TrieNode();

        // Insert each root into the trie
        for (String word : dictionary) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                // Create child node if it doesn't exist
                if (!node.children.containsKey(c)) {
                    node.children.put(c, new TrieNode());
                }
                node = node.children.get(c);
            }
            // Mark the end of this root word
            node.isEnd = true;
        }

        // Step 2: Process each word in the sentence
        String[] words = sentence.split(" ");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            TrieNode node = root;
            StringBuilder replacement = new StringBuilder();

            // Try to find the shortest root prefix
            for (char c : word.toCharArray()) {
                // If character not in trie or we found a complete root
                if (!node.children.containsKey(c) || node.isEnd) {
                    break;
                }
                // Add character to potential replacement
                replacement.append(c);
                node = node.children.get(c);
            }

            // If we found a complete root, use it; otherwise keep original word
            if (node.isEnd) {
                result.append(replacement.toString());
            } else {
                result.append(word);
            }
            result.append(" ");
        }

        // Step 3: Remove trailing space and return
        return result.toString().trim();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Building the trie: `O(N)` where `N` is the total number of characters in all dictionary roots. We process each character once.
- Processing the sentence: `O(S)` where `S` is the total number of characters in the sentence. For each word, we traverse the trie character by character.
- Total: `O(N + S)`

**Space Complexity:**

- Trie storage: `O(N)` in the worst case where no roots share prefixes. In practice, it's less due to shared prefixes.
- Result storage: `O(S)` for the output string.
- Total: `O(N + S)`, but typically we consider the trie as the dominant factor: `O(N)`

## Common Mistakes

1. **Not stopping at the shortest root:** Some candidates find all matching roots then choose the shortest. This is inefficient. The correct approach is to stop at the first complete root found while traversing the trie, since we're checking prefixes from shortest to longest.

2. **Forgetting to mark root ends in the trie:** If you don't mark which nodes complete a root word, you might replace "cattle" with "ca" if "ca" is also in the dictionary, even though it's not a complete root.

3. **Not handling the case where traversal stops mid-word:** When we break out of the character loop (either because char not in trie or we found a root), we need to check `node.isEnd` to determine if we found a valid root. Some candidates forget this check and might use incomplete prefixes.

4. **Using a hash set instead of a trie:** While you could put all roots in a hash set and check every prefix of each word, that's `O(L²)` per word where `L` is word length. The trie approach is `O(L)` per word.

## When You'll See This Pattern

The trie pattern appears in problems involving:

1. **Prefix/suffix matching** - checking if strings start or end with certain patterns
2. **Autocomplete systems** - finding all words with a given prefix
3. **Word search in dictionaries** - especially when dealing with prefixes

**Related LeetCode problems:**

1. **Implement Trie (Prefix Tree)** (#208) - The fundamental trie implementation problem
2. **Design Add and Search Words Data Structure** (#211) - Extends trie with wildcard search
3. **Longest Word in Dictionary** (#720) - Uses trie to find words that can be built character by character
4. **Word Search II** (#212) - Combines trie with backtracking on a board

## Key Takeaways

1. **Use tries for prefix-heavy problems:** When you need to check many strings against many possible prefixes, a trie organizes the data for efficient `O(L)` lookups where `L` is string length.

2. **Stop early for optimization:** In this problem, we stop at the first complete root found. This pattern of "short-circuiting" when you find a valid answer is common in optimization problems.

3. **Mark completion states:** When building tries, always mark nodes that represent complete words (or whatever completion means for your problem). This is crucial for knowing when you've found a valid match.

Related problems: [Implement Trie (Prefix Tree)](/problem/implement-trie-prefix-tree)
