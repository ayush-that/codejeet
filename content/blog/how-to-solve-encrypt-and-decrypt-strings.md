---
title: "How to Solve Encrypt and Decrypt Strings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Encrypt and Decrypt Strings. Hard difficulty, 38.1% acceptance rate. Topics: Array, Hash Table, String, Design, Trie."
date: "2030-01-16"
category: "dsa-patterns"
tags: ["encrypt-and-decrypt-strings", "array", "hash-table", "string", "hard"]
---

# How to Solve Encrypt and Decrypt Strings

This problem asks you to design a data structure that can encrypt strings using a substitution cipher and decrypt strings while checking if the decrypted result exists in a dictionary. The tricky part is that encryption is straightforward (one-to-one mapping), but decryption is ambiguous (one-to-many mapping) because multiple characters could map to the same encrypted string. You need to efficiently handle queries where you check if an encrypted string could have come from any valid dictionary word.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `keys = ["a", "b", "c"]`
- `values = ["aa", "bb", "cc"]`
- `dictionary = ["aaa", "aab", "abc"]`

**Encryption mapping:** Each character maps to a 2-character string:

- 'a' → "aa"
- 'b' → "bb"
- 'c' → "cc"

**Step 1: Build the encryption map**
This is straightforward: `{'a': 'aa', 'b': 'bb', 'c': 'cc'}`

**Step 2: Preprocess dictionary for decryption**
We need to encrypt all dictionary words and store them for quick lookup:

- "aaa" → encrypt('a') + encrypt('a') + encrypt('a') = "aa" + "aa" + "aa" = "aaaaaa"
- "aab" → "aa" + "aa" + "bb" = "aaaabb"
- "abc" → "aa" + "bb" + "cc" = "aabbcc"

Store these encrypted forms in a set: `{"aaaaaa", "aaaabb", "aabbcc"}`

**Step 3: Handle queries**

- `encrypt("abc")` → "aabbcc" (direct mapping)
- `decrypt("aabbcc")` → Check if "aabbcc" is in our set → Yes (from "abc")
- `decrypt("aaaaaa")` → Check if "aaaaaa" is in our set → Yes (from "aaa")
- `decrypt("xxxxxx")` → Check if "xxxxxx" is in our set → No

The key insight: For decryption, we don't need to actually decrypt (which would be ambiguous). We just need to check if the encrypted string matches any encrypted dictionary word.

## Brute Force Approach

A naive approach would be:

1. **Encryption:** Map each character using the keys/values mapping (O(n) per word)
2. **Decryption:** Try to decrypt by reversing the mapping, but since multiple characters could map to the same value, you'd need to generate all possible original strings and check if any exist in the dictionary

The decryption brute force would be exponential in the worst case. If every character has `k` possible original characters that map to it, and the encrypted string has length `n`, you'd have `k^(n/2)` possibilities to check (since each original character produces 2 encrypted characters).

**Why this fails:** With `n=100` and `k=26`, you'd have `26^50` possibilities - completely infeasible. We need a smarter approach that avoids actually decrypting.

## Optimized Approach

The key insight is that **decryption doesn't require actual decryption**. Instead:

1. **Preprocess the dictionary:** Encrypt every word in the dictionary once and store the results in a hash set.
2. **For decryption queries:** Simply check if the query string exists in this precomputed set of encrypted dictionary words.

This works because:

- Encryption is deterministic: the same original word always produces the same encrypted string
- If an encrypted string could come from a dictionary word, then that dictionary word's encrypted form must exactly match the query
- We don't care _which_ dictionary word it came from, just whether _any_ dictionary word could produce it

**Why this is efficient:**

- Preprocessing: O(D \* L) where D = dictionary size, L = average word length
- Encryption query: O(n) where n = word length
- Decryption query: O(1) hash set lookup

## Optimal Solution

<div class="code-group">

```python
class Encrypter:
    """
    Time Complexity:
        - __init__: O(k + v + d * l) where k=len(keys), v=len(values),
                    d=len(dictionary), l=average word length in dictionary
        - encrypt: O(n) where n=len(word1)
        - decrypt: O(1) average case

    Space Complexity: O(k + v + d * l) for storing maps and encrypted dictionary
    """

    def __init__(self, keys: List[str], values: List[str], dictionary: List[str]):
        # Step 1: Build encryption map (character -> encrypted string)
        # This allows O(1) lookup for encrypting each character
        self.encrypt_map = {}
        for i in range(len(keys)):
            self.encrypt_map[keys[i]] = values[i]

        # Step 2: Build reverse map for potential decryption analysis
        # While we don't use this for the optimal solution, it's good to understand
        # which original characters could produce each 2-character encrypted pair
        self.reverse_map = {}
        for i in range(len(keys)):
            encrypted = values[i]
            if encrypted not in self.reverse_map:
                self.reverse_map[encrypted] = []
            self.reverse_map[encrypted].append(keys[i])

        # Step 3: Preprocess the dictionary by encrypting all words
        # This is the key optimization: we store encrypted forms for O(1) decryption checks
        self.encrypted_dict = {}
        for word in dictionary:
            encrypted_word = self._encrypt_word(word)
            # Count frequencies for cases where multiple dictionary words
            # encrypt to the same string
            self.encrypted_dict[encrypted_word] = self.encrypted_dict.get(encrypted_word, 0) + 1

    def _encrypt_word(self, word: str) -> str:
        """Helper to encrypt a word using our encryption map"""
        result = []
        for ch in word:
            # If character is not in keys, encrypt returns empty string per problem
            if ch in self.encrypt_map:
                result.append(self.encrypt_map[ch])
            else:
                return ""  # Character not in keys
        return "".join(result)

    def encrypt(self, word1: str) -> str:
        """
        Encrypt word1 by replacing each character with its mapped value.
        Returns empty string if any character is not in keys.
        """
        return self._encrypt_word(word1)

    def decrypt(self, word2: str) -> int:
        """
        Check how many dictionary words could have encrypted to word2.
        This is just a lookup in our precomputed encrypted dictionary.
        """
        return self.encrypted_dict.get(word2, 0)
```

```javascript
class Encrypter {
  /**
   * Time Complexity:
   *   - constructor: O(k + v + d * l)
   *   - encrypt: O(n)
   *   - decrypt: O(1)
   * Space Complexity: O(k + v + d * l)
   */

  constructor(keys, values, dictionary) {
    // Step 1: Build encryption map for O(1) character lookup
    this.encryptMap = new Map();
    for (let i = 0; i < keys.length; i++) {
      this.encryptMap.set(keys[i], values[i]);
    }

    // Step 2: Build reverse map (not strictly needed but good for understanding)
    this.reverseMap = new Map();
    for (let i = 0; i < keys.length; i++) {
      const encrypted = values[i];
      if (!this.reverseMap.has(encrypted)) {
        this.reverseMap.set(encrypted, []);
      }
      this.reverseMap.get(encrypted).push(keys[i]);
    }

    // Step 3: Preprocess dictionary - encrypt all words and count frequencies
    this.encryptedDict = new Map();
    for (const word of dictionary) {
      const encryptedWord = this._encryptWord(word);
      // Store count of how many dictionary words encrypt to this string
      this.encryptedDict.set(encryptedWord, (this.encryptedDict.get(encryptedWord) || 0) + 1);
    }
  }

  _encryptWord(word) {
    // Helper function to encrypt a complete word
    let result = "";
    for (const ch of word) {
      if (this.encryptMap.has(ch)) {
        result += this.encryptMap.get(ch);
      } else {
        return ""; // Character not in keys
      }
    }
    return result;
  }

  encrypt(word1) {
    /**
     * Encrypt by mapping each character through encryptMap.
     * Returns empty string if any character is not in keys.
     */
    return this._encryptWord(word1);
  }

  decrypt(word2) {
    /**
     * Check how many dictionary words could encrypt to word2.
     * Just a lookup in our precomputed map.
     */
    return this.encryptedDict.get(word2) || 0;
  }
}
```

```java
class Encrypter {
    /**
     * Time Complexity:
     *   - Constructor: O(k + v + d * l)
     *   - encrypt: O(n)
     *   - decrypt: O(1)
     * Space Complexity: O(k + v + d * l)
     */

    private Map<Character, String> encryptMap;
    private Map<String, List<Character>> reverseMap; // For understanding
    private Map<String, Integer> encryptedDict;

    public Encrypter(char[] keys, String[] values, String[] dictionary) {
        // Step 1: Initialize encryption map
        encryptMap = new HashMap<>();
        for (int i = 0; i < keys.length; i++) {
            encryptMap.put(keys[i], values[i]);
        }

        // Step 2: Initialize reverse map (optional, for conceptual clarity)
        reverseMap = new HashMap<>();
        for (int i = 0; i < keys.length; i++) {
            String encrypted = values[i];
            reverseMap.putIfAbsent(encrypted, new ArrayList<>());
            reverseMap.get(encrypted).add(keys[i]);
        }

        // Step 3: Preprocess dictionary - encrypt all words
        encryptedDict = new HashMap<>();
        for (String word : dictionary) {
            String encryptedWord = encryptWord(word);
            // Count frequencies of encrypted forms
            encryptedDict.put(encryptedWord,
                encryptedDict.getOrDefault(encryptedWord, 0) + 1);
        }
    }

    private String encryptWord(String word) {
        // Helper to encrypt a complete word
        StringBuilder result = new StringBuilder();
        for (char ch : word.toCharArray()) {
            if (encryptMap.containsKey(ch)) {
                result.append(encryptMap.get(ch));
            } else {
                return ""; // Character not in keys
            }
        }
        return result.toString();
    }

    public String encrypt(String word1) {
        /**
         * Encrypt by mapping each character through encryptMap.
         * Returns empty string if any character is not in keys.
         */
        return encryptWord(word1);
    }

    public int decrypt(String word2) {
        /**
         * Check how many dictionary words could encrypt to word2.
         * Just a lookup in precomputed map.
         */
        return encryptedDict.getOrDefault(word2, 0);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor (`__init__`):** O(k + v + d × l)
  - `k`: Building encryption map from keys
  - `v`: Building reverse map from values
  - `d × l`: Encrypting each word in dictionary (d words × average length l)
- **`encrypt(word1)`: O(n)** where n is length of word1
  - Each character lookup is O(1), concatenation is O(n)
- **`decrypt(word2)`: O(1)** average case
  - Hash map lookup of the encrypted string

**Space Complexity:**

- **O(k + v + d × l)**
  - Encryption map: O(k)
  - Reverse map: O(v) (though values may have duplicates)
  - Encrypted dictionary: O(d × l) since we store encrypted forms of all dictionary words

## Common Mistakes

1. **Actually trying to decrypt:** The most common mistake is attempting to reverse the encryption during decryption queries. This leads to exponential time complexity. Remember: we only need to know _if_ a decryption exists, not _what_ it is.

2. **Not handling character-not-in-keys correctly:** The problem states that if a character in `word1` is not in `keys`, `encrypt` should return an empty string. Candidates often miss this edge case.

3. **Forgetting multiple dictionary words can encrypt to the same string:** When preprocessing the dictionary, you need to count frequencies, not just store a set. Two different dictionary words might encrypt to the same string, and both should count toward the decryption result.

4. **Inefficient string concatenation:** In languages like Java, using `+=` in a loop creates new string objects. Use `StringBuilder` instead. In Python, building a list and joining is more efficient than repeated concatenation.

## When You'll See This Pattern

This problem uses the **precomputation/transformation** pattern, where you transform the data once to answer queries efficiently. Similar patterns appear in:

1. **Implement Trie (Prefix Tree) (Medium):** Both problems involve preprocessing data (dictionary) to answer queries efficiently. The trie is another way to organize dictionary words for prefix-based queries.

2. **Word Search II (Hard):** Requires preprocessing the dictionary (into a trie) to efficiently search for multiple words in a board. The core idea is the same: transform the dictionary once to optimize many queries.

3. **Two Sum (Easy):** While simpler, it uses a similar "preprocess into hash map" approach to answer queries in O(1) time instead of O(n).

## Key Takeaways

1. **Sometimes the direct approach isn't the right approach:** For decryption, the natural instinct is to reverse the encryption, but the efficient solution is to encrypt the dictionary instead and compare.

2. **Precomputation is powerful when you have many queries:** If you need to answer many queries on the same data, transforming the data once can turn O(n) queries into O(1) queries.

3. **Understand what you actually need to compute:** We don't need the actual decrypted string, just whether a valid decryption exists. This simplification enables the efficient solution.

Related problems: [Implement Trie (Prefix Tree)](/problem/implement-trie-prefix-tree), [Word Search II](/problem/word-search-ii), [Implement Trie II (Prefix Tree)](/problem/implement-trie-ii-prefix-tree)
