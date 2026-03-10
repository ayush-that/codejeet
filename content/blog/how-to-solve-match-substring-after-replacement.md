---
title: "How to Solve Match Substring After Replacement — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Match Substring After Replacement. Hard difficulty, 43.2% acceptance rate. Topics: Array, Hash Table, String, String Matching."
date: "2030-01-03"
category: "dsa-patterns"
tags: ["match-substring-after-replacement", "array", "hash-table", "string", "hard"]
---

# How to Solve Match Substring After Replacement

This problem asks whether we can transform any substring of `s` to match `sub` by replacing characters according to given mappings. The tricky part is that each character in `sub` can be replaced multiple times through chains of replacements (e.g., 'a'→'b' and 'b'→'c' means 'a' can become 'c'), and we need to check every possible starting position in `s`.

## Visual Walkthrough

Let's trace through an example:

- `s = "abcde"`
- `sub = "cde"`
- `mappings = [["a","c"], ["b","d"], ["c","e"]]`

We need to check if any substring of `s` can be transformed to match `sub`:

**Position 0:** Compare "abc" with "cde"

- 'a' → 'c'? Check mappings: 'a' can become 'c' directly ✓
- 'b' → 'd'? 'b' can become 'd' directly ✓
- 'c' → 'e'? 'c' can become 'e' directly ✓
  Success at position 0!

But wait — what if we have indirect mappings? Consider:

- `s = "abc"`
- `sub = "def"`
- `mappings = [["a","b"], ["b","c"], ["c","d"], ["d","e"], ["e","f"]]`

Here 'a' can become 'd' through chain: 'a'→'b'→'c'→'d'. We need to handle these transitive relationships.

## Brute Force Approach

A naive approach would be:

1. For each starting position `i` in `s` where `i + len(sub) <= len(s)`
2. For each character position `j` in `sub`
3. Check if `s[i+j]` can be transformed to `sub[j]` by trying all possible replacement chains

The brute force checking of replacement chains is exponential in worst case. If we simply try all possible paths through the mappings, we could end up with infinite loops or exponential time complexity.

Even a simpler brute force that only checks direct mappings would fail for cases requiring indirect replacements. The problem requires us to handle transitive replacements efficiently.

## Optimized Approach

The key insight is that the replacement relationships form a **graph** where characters are nodes and mappings are directed edges. We need to know for any pair `(x, y)` whether `x` can be transformed to `y` through any path in this graph.

**Step-by-step reasoning:**

1. **Build reachability matrix:** Use Floyd-Warshall algorithm or BFS/DFS from each node to compute transitive closure of the replacement graph. Since there are only 62 possible characters (a-z, A-Z, 0-9), we can use a 62×62 boolean matrix.
2. **Check each position:** For each starting position in `s`, compare character by character with `sub`. For each pair `(s_char, sub_char)`, check if they're equal OR if `s_char` can reach `sub_char` in our reachability graph.
3. **Early termination:** If any character fails the check, move to next starting position.

**Why this works:** The replacement operations are independent per character position and can be applied any number of times. By precomputing all possible transformations, we can check each character pair in O(1) time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(62^3 + n * m) where n = len(s), m = len(sub)
# Space: O(62^2) for the reachability matrix
def matchReplacement(self, s: str, sub: str, mappings: List[List[str]]) -> bool:
    # Step 1: Build character to index mapping for 62 possible chars
    # We'll use ASCII values to map a-z, A-Z, 0-9 to indices 0-61
    def char_to_idx(c: str) -> int:
        if 'a' <= c <= 'z':
            return ord(c) - ord('a')
        elif 'A' <= c <= 'Z':
            return ord(c) - ord('A') + 26
        else:  # '0' <= c <= '9'
            return ord(c) - ord('0') + 52

    # Step 2: Initialize 62x62 reachability matrix
    # reachable[i][j] = True means char i can be transformed to char j
    reachable = [[False] * 62 for _ in range(62)]

    # Each character can reach itself (no replacement needed if chars match)
    for i in range(62):
        reachable[i][i] = True

    # Step 3: Add direct edges from mappings
    for old_char, new_char in mappings:
        old_idx = char_to_idx(old_char)
        new_idx = char_to_idx(new_char)
        reachable[old_idx][new_idx] = True

    # Step 4: Compute transitive closure using Floyd-Warshall
    # For all k, i, j: if i->k and k->j are possible, then i->j is possible
    for k in range(62):
        for i in range(62):
            for j in range(62):
                # If i can reach k and k can reach j, then i can reach j
                if reachable[i][k] and reachable[k][j]:
                    reachable[i][j] = True

    # Step 5: Check all possible starting positions in s
    n, m = len(s), len(sub)
    for i in range(n - m + 1):  # All valid starting positions
        valid = True
        # Check each character in the current window
        for j in range(m):
            s_idx = char_to_idx(s[i + j])
            sub_idx = char_to_idx(sub[j])
            # Characters must either match or be reachable via replacements
            if not reachable[s_idx][sub_idx]:
                valid = False
                break  # No need to check further in this window
        if valid:
            return True  # Found a valid transformation

    return False  # No valid transformation found
```

```javascript
// Time: O(62^3 + n * m) where n = s.length, m = sub.length
// Space: O(62^2) for the reachability matrix
function matchReplacement(s, sub, mappings) {
  // Helper: Convert character to index 0-61
  const charToIdx = (c) => {
    if ("a" <= c && c <= "z") {
      return c.charCodeAt(0) - "a".charCodeAt(0);
    } else if ("A" <= c && c <= "Z") {
      return c.charCodeAt(0) - "A".charCodeAt(0) + 26;
    } else {
      // '0' <= c <= '9'
      return c.charCodeAt(0) - "0".charCodeAt(0) + 52;
    }
  };

  // Step 1: Initialize 62x62 reachability matrix
  const reachable = Array(62)
    .fill()
    .map(() => Array(62).fill(false));

  // Each character can reach itself
  for (let i = 0; i < 62; i++) {
    reachable[i][i] = true;
  }

  // Step 2: Add direct edges from mappings
  for (const [oldChar, newChar] of mappings) {
    const oldIdx = charToIdx(oldChar);
    const newIdx = charToIdx(newChar);
    reachable[oldIdx][newIdx] = true;
  }

  // Step 3: Compute transitive closure using Floyd-Warshall
  for (let k = 0; k < 62; k++) {
    for (let i = 0; i < 62; i++) {
      for (let j = 0; j < 62; j++) {
        // If i can reach k and k can reach j, then i can reach j
        if (reachable[i][k] && reachable[k][j]) {
          reachable[i][j] = true;
        }
      }
    }
  }

  // Step 4: Check all possible starting positions in s
  const n = s.length,
    m = sub.length;
  for (let i = 0; i <= n - m; i++) {
    let valid = true;
    // Check each character in the current window
    for (let j = 0; j < m; j++) {
      const sIdx = charToIdx(s[i + j]);
      const subIdx = charToIdx(sub[j]);
      // Characters must either match or be reachable via replacements
      if (!reachable[sIdx][subIdx]) {
        valid = false;
        break; // No need to check further in this window
      }
    }
    if (valid) {
      return true; // Found a valid transformation
    }
  }

  return false; // No valid transformation found
}
```

```java
// Time: O(62^3 + n * m) where n = s.length(), m = sub.length()
// Space: O(62^2) for the reachability matrix
public boolean matchReplacement(String s, String sub, char[][] mappings) {
    // Helper: Convert character to index 0-61
    private int charToIdx(char c) {
        if ('a' <= c && c <= 'z') {
            return c - 'a';
        } else if ('A' <= c && c <= 'Z') {
            return c - 'A' + 26;
        } else { // '0' <= c <= '9'
            return c - '0' + 52;
        }
    }

    // Step 1: Initialize 62x62 reachability matrix
    boolean[][] reachable = new boolean[62][62];

    // Each character can reach itself
    for (int i = 0; i < 62; i++) {
        reachable[i][i] = true;
    }

    // Step 2: Add direct edges from mappings
    for (char[] mapping : mappings) {
        int oldIdx = charToIdx(mapping[0]);
        int newIdx = charToIdx(mapping[1]);
        reachable[oldIdx][newIdx] = true;
    }

    // Step 3: Compute transitive closure using Floyd-Warshall
    for (int k = 0; k < 62; k++) {
        for (int i = 0; i < 62; i++) {
            for (int j = 0; j < 62; j++) {
                // If i can reach k and k can reach j, then i can reach j
                if (reachable[i][k] && reachable[k][j]) {
                    reachable[i][j] = true;
                }
            }
        }
    }

    // Step 4: Check all possible starting positions in s
    int n = s.length(), m = sub.length();
    for (int i = 0; i <= n - m; i++) {
        boolean valid = true;
        // Check each character in the current window
        for (int j = 0; j < m; j++) {
            int sIdx = charToIdx(s.charAt(i + j));
            int subIdx = charToIdx(sub.charAt(j));
            // Characters must either match or be reachable via replacements
            if (!reachable[sIdx][subIdx]) {
                valid = false;
                break; // No need to check further in this window
            }
        }
        if (valid) {
            return true; // Found a valid transformation
        }
    }

    return false; // No valid transformation found
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Building the reachability matrix: O(62³) = O(1) since 62 is constant
- Checking all positions: O(n × m) where n = len(s), m = len(sub)
- Total: O(n × m) since the constant 62³ is negligible

**Space Complexity:**

- Reachability matrix: O(62²) = O(1) constant space
- No additional space proportional to input size
- Total: O(1) constant space

The 62³ Floyd-Warshall might seem large, but 62³ = 238,328 operations, which is trivial for modern computers. The O(n × m) substring checking is the dominant factor.

## Common Mistakes

1. **Forgetting transitive relationships:** Only checking direct mappings from the input. If 'a'→'b' and 'b'→'c' are given, 'a' should be able to become 'c'.
2. **Incorrect character indexing:** Not handling all 62 possible characters (a-z, A-Z, 0-9). Some solutions only handle lowercase, failing on test cases with uppercase or digits.

3. **Not checking all starting positions:** Only checking if the entire string `s` can transform to `sub`, rather than any substring of `s`. The problem asks if ANY substring can match.

4. **Inefficient transitive closure computation:** Trying to compute reachability by repeatedly applying mappings until no changes (like Bellman-Ford) can be less efficient than Floyd-Warshall for this fixed small graph.

## When You'll See This Pattern

This problem combines **graph transitive closure** with **string matching**:

1. **Design Add and Search Words Data Structure (LeetCode 211):** Uses similar character matching with wildcards, though implemented via trie rather than graph reachability.

2. **Number of Subarrays That Match a Pattern II (LeetCode 3035):** Involves matching patterns with transformations, requiring efficient comparison of sequences.

3. **Similar String Groups (LeetCode 839):** Uses graph connectivity to group strings that can be transformed into each other through character swaps.

The core pattern is: when you need to know if element A can transform to element B through a series of allowed operations, think about modeling the operations as edges in a graph and computing transitive closure.

## Key Takeaways

1. **Transitive closure solves "can reach" problems:** When operations can be chained, use Floyd-Warshall or BFS/DFS to precompute all reachable pairs.

2. **Constant factors matter:** With only 62 characters, O(62³) is acceptable. Always check the problem constraints before optimizing.

3. **Separate preprocessing from matching:** Precompute the transformation rules once, then use the results for efficient matching. This is a common optimization pattern.

Related problems: [Design Add and Search Words Data Structure](/problem/design-add-and-search-words-data-structure), [Number of Subarrays That Match a Pattern II](/problem/number-of-subarrays-that-match-a-pattern-ii)
