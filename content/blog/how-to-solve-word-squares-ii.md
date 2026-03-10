---
title: "How to Solve Word Squares II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Word Squares II. Medium difficulty, 54.9% acceptance rate. Topics: Array, String, Backtracking, Sorting, Enumeration."
date: "2029-12-22"
category: "dsa-patterns"
tags: ["word-squares-ii", "array", "string", "backtracking", "medium"]
---

## How to Solve Word Squares II

Word Squares II asks you to find all valid 4×4 word squares from a list of distinct 4-letter words. A word square is valid when:

1. All four words are distinct
2. The top row reads the same as the left column
3. The right column reads the same as the bottom row

This is tricky because you need to ensure all four positions satisfy multiple constraints simultaneously, and brute force checking all permutations is computationally expensive.

## Visual Walkthrough

Let's trace through a small example: `words = ["ball", "area", "lead", "lady", "wall"]`

We need to find 4 distinct words that form a valid square. Let's try building one step by step:

**Step 1:** Choose "ball" as the top row:

```
b a l l
? ? ? ?
? ? ? ?
? ? ? ?
```

Now the left column must start with "b", and the first letter of the second row must be "a" (from "ball"[1]).

**Step 2:** Choose "area" as the left column:

```
b a l l
a ? ? ?
r ? ? ?
e ? ? ?
```

But wait - the second row's first letter is "a", which matches "area"[0]. Good. Now the second row's second letter must be "r" (from "area"[1]).

**Step 3:** We need a word starting with "ar" for the second row. Looking at our list, "area" fits, but we can't reuse words. Let's backtrack and try a different approach.

**Step 4:** Instead, let's try "ball" as top and "area" as left:

```
b a l l
a r e a
l ? ? ?
l ? ? ?
```

Now the third row must start with "l" (from "ball"[2]) and have second letter "e" (from "area"[2]). We need a word starting with "le". "lead" fits perfectly!

**Step 5:** Place "lead":

```
b a l l
a r e a
l e a d
l ? ? ?
```

The fourth row must start with "l" (from "ball"[3]) and have second letter "a" (from "area"[3]). We need "la\_\_". "lady" fits!

**Step 6:** Check if it's valid:

- Top row: "ball" ✓
- Left column: "b" + "a" + "l" + "l" = "ball" ✓
- Right column: "l" + "a" + "d" + "y" = "lady" ✓
- Bottom row: "lady" ✓

We found a valid square: ["ball","area","lead","lady"]

## Brute Force Approach

The naive approach would be to try all permutations of 4 words from the list and check if they form a valid square:

1. Generate all combinations of 4 distinct words from the list
2. For each combination, generate all permutations (4! = 24 arrangements)
3. For each arrangement, check all constraints:
   - Top row equals left column
   - Right column equals bottom row
   - All words are distinct (already guaranteed by permutation)

This approach has complexity O(n⁴ × 4! × 4) where n is the number of words. For n=1000, that's about 10¹² operations - far too slow.

What makes this particularly inefficient is that we're checking complete arrangements without pruning invalid partial solutions early.

## Optimized Approach

The key insight is to use **backtracking with pruning**:

1. Build the square row by row
2. At each step, the constraints from previously placed words determine what letters the next word must have at specific positions
3. Use a **trie** or **hash map** to quickly find candidate words that match the required prefix
4. Prune the search when no words match the required pattern

Specifically:

- When we place the first word (top row), it determines the first letter of every other row
- When we place the second word (left column), it determines the second letter of every row
- We can represent the current state as a 4×4 grid with some cells filled
- For the next row, we know what letters must be in certain positions based on previously placed rows and columns

The most efficient approach uses **backtracking with constraint propagation**:

1. Try each word as the top row
2. For each choice, determine what the left column's first letter must be
3. Try each compatible word as the left column
4. Now we have constraints for two diagonally opposite corners
5. Continue filling, always checking that required letters match

## Optimal Solution

We'll implement backtracking with a hash map for quick prefix lookups. The key is to maintain the current grid state and check constraints as we build.

<div class="code-group">

```python
# Time: O(n * 4^4) ≈ O(256n) in practice | Space: O(n) for the word map
def wordSquares(words):
    """
    Find all valid 4x4 word squares from the given list of words.
    Each word square uses 4 distinct words arranged so that:
    - top row = left column
    - right column = bottom row
    """
    if len(words) < 4:
        return []

    # Build a map from prefix to list of words with that prefix
    # This allows O(1) lookup of candidate words
    prefix_map = {}
    for word in words:
        # For a 4-letter word, we need to check prefixes of length 1, 2, 3
        for i in range(1, 5):
            prefix = word[:i]
            if prefix not in prefix_map:
                prefix_map[prefix] = []
            prefix_map[prefix].append(word)

    result = []

    def backtrack(square, used):
        """
        square: list of words placed so far (0-4 words)
        used: set of indices of words already used
        """
        # If we have 4 words, check if it's a valid square
        if len(square) == 4:
            # Verify all constraints
            top = square[0]
            left = ''.join([square[i][0] for i in range(4)])
            right = ''.join([square[i][3] for i in range(4)])
            bottom = square[3]

            if top == left and right == bottom:
                result.append(square[:])
            return

        # Determine what prefix the next word must have
        # Based on current square state
        row_idx = len(square)  # Which row we're filling (0-3)
        required_prefix = ""

        if row_idx == 0:
            # First row: no constraints on prefix
            required_prefix = ""
        elif row_idx == 1:
            # Second row: must start with square[0][1]
            required_prefix = square[0][1]
        elif row_idx == 2:
            # Third row: must start with square[0][2]
            # and second letter must be square[1][2]
            required_prefix = square[0][2] + square[1][2]
        else:  # row_idx == 3
            # Fourth row: must start with square[0][3]
            # second letter must be square[1][3]
            # third letter must be square[2][3]
            required_prefix = square[0][3] + square[1][3] + square[2][3]

        # Get candidate words that match the required prefix
        candidates = []
        if required_prefix == "":
            # For first row, all words are candidates
            candidates = words
        else:
            candidates = prefix_map.get(required_prefix, [])

        # Try each candidate
        for word in candidates:
            # Skip if already used (words must be distinct)
            if word in square:
                continue

            # Check additional constraints based on position
            if row_idx == 1:
                # For second row, also need to check it can be the left column
                # The left column would be: square[0][0] + word[0] + ? + ?
                # We'll check this later when we have all 4 words
                pass
            elif row_idx == 2:
                # For third row, check it matches the developing right column
                # The right column so far: square[0][3] + square[1][3] + word[3]
                # We'll verify complete constraints at the end
                pass

            # Add the word and continue
            square.append(word)
            backtrack(square, used | {word})
            square.pop()  # Backtrack

    # Start backtracking with empty square
    backtrack([], set())
    return result
```

```javascript
// Time: O(n * 4^4) ≈ O(256n) in practice | Space: O(n) for the word map
function wordSquares(words) {
  if (words.length < 4) return [];

  // Build prefix map for quick candidate lookup
  const prefixMap = new Map();
  for (const word of words) {
    // For each possible prefix length (1-3 for 4-letter words)
    for (let i = 1; i <= 4; i++) {
      const prefix = word.substring(0, i);
      if (!prefixMap.has(prefix)) {
        prefixMap.set(prefix, []);
      }
      prefixMap.get(prefix).push(word);
    }
  }

  const result = [];

  function backtrack(square, used) {
    // If we have 4 words, check if it's a valid square
    if (square.length === 4) {
      const top = square[0];
      const left = square.map((word, i) => word[0]).join("");
      const right = square.map((word, i) => word[3]).join("");
      const bottom = square[3];

      if (top === left && right === bottom) {
        result.push([...square]);
      }
      return;
    }

    const rowIdx = square.length; // Current row we're filling (0-3)
    let requiredPrefix = "";

    // Determine required prefix based on current square state
    if (rowIdx === 0) {
      requiredPrefix = "";
    } else if (rowIdx === 1) {
      requiredPrefix = square[0][1];
    } else if (rowIdx === 2) {
      requiredPrefix = square[0][2] + square[1][2];
    } else {
      // rowIdx === 3
      requiredPrefix = square[0][3] + square[1][3] + square[2][3];
    }

    // Get candidate words
    let candidates = [];
    if (requiredPrefix === "") {
      candidates = words;
    } else {
      candidates = prefixMap.get(requiredPrefix) || [];
    }

    // Try each candidate
    for (const word of candidates) {
      // Skip if already used
      if (square.includes(word)) continue;

      // Add word and continue
      square.push(word);
      backtrack(square, new Set([...used, word]));
      square.pop(); // Backtrack
    }
  }

  backtrack([], new Set());
  return result;
}
```

```java
// Time: O(n * 4^4) ≈ O(256n) in practice | Space: O(n) for the word map
import java.util.*;

public class Solution {
    public List<List<String>> wordSquares(String[] words) {
        List<List<String>> result = new ArrayList<>();
        if (words.length < 4) return result;

        // Build prefix map
        Map<String, List<String>> prefixMap = new HashMap<>();
        for (String word : words) {
            // For each possible prefix length
            for (int i = 1; i <= 4; i++) {
                String prefix = word.substring(0, i);
                prefixMap.putIfAbsent(prefix, new ArrayList<>());
                prefixMap.get(prefix).add(word);
            }
        }

        backtrack(result, new ArrayList<>(), new HashSet<>(), words, prefixMap);
        return result;
    }

    private void backtrack(List<List<String>> result, List<String> square,
                          Set<String> used, String[] words,
                          Map<String, List<String>> prefixMap) {
        // If we have 4 words, check if it's a valid square
        if (square.size() == 4) {
            String top = square.get(0);

            // Build left column
            StringBuilder leftBuilder = new StringBuilder();
            for (int i = 0; i < 4; i++) {
                leftBuilder.append(square.get(i).charAt(0));
            }
            String left = leftBuilder.toString();

            // Build right column
            StringBuilder rightBuilder = new StringBuilder();
            for (int i = 0; i < 4; i++) {
                rightBuilder.append(square.get(i).charAt(3));
            }
            String right = rightBuilder.toString();

            String bottom = square.get(3);

            if (top.equals(left) && right.equals(bottom)) {
                result.add(new ArrayList<>(square));
            }
            return;
        }

        int rowIdx = square.size(); // Current row we're filling
        String requiredPrefix = "";

        // Determine required prefix based on current square state
        if (rowIdx == 0) {
            requiredPrefix = "";
        } else if (rowIdx == 1) {
            requiredPrefix = String.valueOf(square.get(0).charAt(1));
        } else if (rowIdx == 2) {
            requiredPrefix = String.valueOf(square.get(0).charAt(2)) +
                            square.get(1).charAt(2);
        } else { // rowIdx == 3
            requiredPrefix = String.valueOf(square.get(0).charAt(3)) +
                            square.get(1).charAt(3) +
                            square.get(2).charAt(3);
        }

        // Get candidate words
        List<String> candidates;
        if (requiredPrefix.isEmpty()) {
            candidates = Arrays.asList(words);
        } else {
            candidates = prefixMap.getOrDefault(requiredPrefix, new ArrayList<>());
        }

        // Try each candidate
        for (String word : candidates) {
            // Skip if already used
            if (square.contains(word)) continue;

            // Add word and continue
            square.add(word);
            backtrack(result, square, used, words, prefixMap);
            square.remove(square.size() - 1); // Backtrack
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 4⁴) in practice, where n is the number of words. Here's why:

- We try each word as the first row: O(n)
- For each first word, we need words starting with a specific letter for the second row
- The branching factor reduces at each level due to prefix constraints
- In the worst case (all words share prefixes), it could be O(n⁴), but with the prefix map pruning, it's much faster in practice

**Space Complexity:** O(n) for:

- The prefix map storing all words and their prefixes
- The recursion stack depth is at most 4
- The result storage depends on number of valid squares found

## Common Mistakes

1. **Forgetting to check all constraints simultaneously**: Some candidates check top=left but forget right=bottom, or vice versa. Always verify both pairs of constraints.

2. **Not ensuring word distinctness**: The problem states words must be distinct. Using a Set to track used words or checking `if word in square` is crucial.

3. **Inefficient candidate finding**: Without a prefix map, checking each word against constraints becomes O(n) per candidate, making the solution O(n⁴). The prefix map reduces this to O(1) for prefix matching.

4. **Off-by-one errors with indices**: Remember that for 4-letter words, indices go 0-3. Common mistakes include using index 4 or confusing row/column indices.

## When You'll See This Pattern

This backtracking-with-constraints pattern appears in several LeetCode problems:

1. **Word Squares (LeetCode 425)**: The original problem with variable-sized squares, using tries for prefix matching.

2. **N-Queens (LeetCode 51)**: Similar constraint propagation - placing a queen restricts where others can go, just like placing a word restricts what other words can follow.

3. **Sudoku Solver (LeetCode 37)**: Each number placement creates constraints for related cells, requiring similar backtracking with pruning.

The core pattern is: when choices affect future choices, use backtracking with early pruning to avoid exploring doomed paths.

## Key Takeaways

1. **Backtracking with pruning** is essential when you need to explore combinations but can eliminate invalid partial solutions early. Always look for constraints that let you prune the search space.

2. **Prefix matching** with hash maps or tries is a powerful technique for word-related problems. When you need to find words matching certain patterns, preprocess into a structure that allows quick lookups.

3. **Constraint propagation** helps reduce search space. As you make choices, explicitly track how they constrain future choices, and use those constraints to guide the search.

[Practice this problem on CodeJeet](/problem/word-squares-ii)
