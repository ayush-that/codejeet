---
title: "How to Solve Check if Word Can Be Placed In Crossword — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if Word Can Be Placed In Crossword. Medium difficulty, 50.7% acceptance rate. Topics: Array, Matrix, Enumeration."
date: "2029-06-06"
category: "dsa-patterns"
tags: ["check-if-word-can-be-placed-in-crossword", "array", "matrix", "enumeration", "medium"]
---

# How to Solve "Check if Word Can Be Placed In Crossword"

This problem asks us to determine if a given word can be placed in a crossword puzzle board either horizontally (left-to-right) or vertically (top-to-bottom). The challenge comes from the constraints: words must fit exactly into sequences of empty cells or letters that match the word, and they must be placed either at the beginning of a row/column or immediately after a blocked cell ('#'). What makes this tricky is that we need to check both directions, handle partial matches with existing letters, and ensure the word fits perfectly within the available space.

## Visual Walkthrough

Let's walk through a small example:

```
Board:
[['#', ' ', '#'],
 [' ', 'c', ' '],
 [' ', ' ', '#']]

Word: "cat"
```

**Step 1: Check horizontal placements**

Row 0: Cells are ['#', ' ', '#']

- Cell 0 is '#', skip
- Cell 1 is ' ' (empty), check if "cat" fits starting here
  - Need 3 cells: positions 1, 2, 3
  - Position 2 is '#', so "cat" doesn't fit
- Cell 2 is '#', skip

Row 1: Cells are [' ', 'c', ' ']

- Cell 0 is ' ', check if "cat" fits
  - Need positions 0,1,2: ' ' matches 'c'? No, 'c' ≠ 'c'? Wait, actually 'c' = 'c', so position 1 matches
  - Position 2 is ' ' which should match 'a', but ' ' ≠ 'a'? Actually empty cells match any letter, so this is okay
  - Check boundaries: position -1 is out of bounds (good), position 3 is out of bounds (good)
  - So "cat" fits here! The 'c' in position 1 matches the first letter

**Step 2: Check vertical placements**

Column 0: Cells are ['#', ' ', ' ']

- Cell 0 is '#', skip
- Cell 1 is ' ', check if "cat" fits
  - Need rows 1,2,3 (but only 3 rows total)
  - Row 2 exists (position 2), row 3 doesn't exist
  - So doesn't fit (needs 3 cells, only 2 available)

Column 1: Cells are [' ', 'c', ' ']

- Cell 0 is ' ', check if "cat" fits
  - Need rows 0,1,2: all exist
  - Row 0: ' ' matches 'c' (empty matches any)
  - Row 1: 'c' matches 'a'? No! 'c' ≠ 'a'
  - So doesn't fit

Column 2: Cells are ['#', ' ', '#']

- Cell 0 is '#', skip
- Cell 1 is ' ', check if "cat" fits
  - Need rows 1,2,3: row 3 doesn't exist
  - So doesn't fit

Result: "cat" can be placed horizontally starting at (1,0).

## Brute Force Approach

A naive approach would be to try placing the word at every possible starting position in both directions. For each starting cell (i,j), we would:

1. Check if we can start here (cell is empty or matches first letter, and previous cell is blocked or out of bounds)
2. Check if the word fits in the available space
3. Verify the cell after the word is blocked or out of bounds

The brute force would have complexity O(m × n × k) where k is the word length, since for each of m×n starting positions, we check up to k cells. While this might work for small boards, it's inefficient because we're checking many positions that clearly can't work.

However, there's an even more naive approach some candidates try: checking every sequence of cells without considering the placement rules. This fails because it doesn't properly handle the constraints about where words can start and end.

## Optimized Approach

The key insight is that we don't need to check every starting position independently. Instead, we can:

1. Identify all valid horizontal and vertical "slots" where a word could fit
2. For each slot, check if our word matches the pattern

A "slot" is a sequence of consecutive cells that:

- Starts at a cell that is either at the board edge or preceded by '#'
- Ends at a cell that is either at the board edge or followed by '#'
- Contains only empty cells or letters (no '#')

We can find these slots efficiently by scanning the board:

- For horizontal slots: scan each row, looking for sequences between '#' characters or edges
- For vertical slots: scan each column, looking for sequences between '#' characters or edges

For each slot, we check if the word fits by comparing character by character, allowing empty cells to match any letter. We also need to check the reverse of the word since words can be placed in either direction!

## Optimal Solution

The optimal solution scans the board once for horizontal slots and once for vertical slots. For each slot found, it checks if the word fits either forward or backward. This approach runs in O(m × n) time since we examine each cell a constant number of times.

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1) excluding input storage
def placeWordInCrossword(board, word):
    """
    Check if word can be placed in crossword board horizontally or vertically.

    Args:
        board: List[List[str]] - crossword board with '#', ' ', or letters
        word: str - word to place

    Returns:
        bool - True if word can be placed, False otherwise
    """
    m, n = len(board), len(board[0])
    word_len = len(word)

    # Helper function to check if a sequence matches the word
    def matches(sequence, word):
        """Check if sequence of cells matches word (forward or backward)."""
        # Sequence must be exactly word length
        if len(sequence) != word_len:
            return False

        # Check forward match
        forward_match = True
        for i in range(word_len):
            cell = sequence[i]
            # Empty cell matches any letter, otherwise must match exactly
            if cell != ' ' and cell != word[i]:
                forward_match = False
                break

        # Check backward match
        backward_match = True
        for i in range(word_len):
            cell = sequence[i]
            # For backward match, compare with reversed word
            if cell != ' ' and cell != word[word_len - 1 - i]:
                backward_match = False
                break

        return forward_match or backward_match

    # Check horizontal placements
    for i in range(m):
        j = 0
        while j < n:
            # Skip blocked cells
            if board[i][j] == '#':
                j += 1
                continue

            # Find start of a horizontal slot
            start_j = j
            # Collect sequence until we hit '#' or end of row
            sequence = []
            while j < n and board[i][j] != '#':
                sequence.append(board[i][j])
                j += 1

            # Check if this slot can fit our word
            if matches(sequence, word):
                return True

    # Check vertical placements
    for j in range(n):
        i = 0
        while i < m:
            # Skip blocked cells
            if board[i][j] == '#':
                i += 1
                continue

            # Find start of a vertical slot
            start_i = i
            # Collect sequence until we hit '#' or end of column
            sequence = []
            while i < m and board[i][j] != '#':
                sequence.append(board[i][j])
                i += 1

            # Check if this slot can fit our word
            if matches(sequence, word):
                return True

    return False
```

```javascript
// Time: O(m * n) | Space: O(1) excluding input storage
/**
 * Check if word can be placed in crossword board horizontally or vertically.
 * @param {character[][]} board - crossword board with '#', ' ', or letters
 * @param {string} word - word to place
 * @return {boolean} - true if word can be placed, false otherwise
 */
function placeWordInCrossword(board, word) {
  const m = board.length,
    n = board[0].length;
  const wordLen = word.length;

  // Helper function to check if a sequence matches the word
  const matches = (sequence, word) => {
    // Sequence must be exactly word length
    if (sequence.length !== wordLen) return false;

    // Check forward match
    let forwardMatch = true;
    for (let i = 0; i < wordLen; i++) {
      const cell = sequence[i];
      // Empty cell matches any letter, otherwise must match exactly
      if (cell !== " " && cell !== word[i]) {
        forwardMatch = false;
        break;
      }
    }

    // Check backward match
    let backwardMatch = true;
    for (let i = 0; i < wordLen; i++) {
      const cell = sequence[i];
      // For backward match, compare with reversed word
      if (cell !== " " && cell !== word[wordLen - 1 - i]) {
        backwardMatch = false;
        break;
      }
    }

    return forwardMatch || backwardMatch;
  };

  // Check horizontal placements
  for (let i = 0; i < m; i++) {
    let j = 0;
    while (j < n) {
      // Skip blocked cells
      if (board[i][j] === "#") {
        j++;
        continue;
      }

      // Collect sequence until we hit '#' or end of row
      const sequence = [];
      while (j < n && board[i][j] !== "#") {
        sequence.push(board[i][j]);
        j++;
      }

      // Check if this slot can fit our word
      if (matches(sequence, word)) {
        return true;
      }
    }
  }

  // Check vertical placements
  for (let j = 0; j < n; j++) {
    let i = 0;
    while (i < m) {
      // Skip blocked cells
      if (board[i][j] === "#") {
        i++;
        continue;
      }

      // Collect sequence until we hit '#' or end of column
      const sequence = [];
      while (i < m && board[i][j] !== "#") {
        sequence.push(board[i][j]);
        i++;
      }

      // Check if this slot can fit our word
      if (matches(sequence, word)) {
        return true;
      }
    }
  }

  return false;
}
```

```java
// Time: O(m * n) | Space: O(1) excluding input storage
class Solution {
    /**
     * Check if word can be placed in crossword board horizontally or vertically.
     * @param board crossword board with '#', ' ', or letters
     * @param word word to place
     * @return true if word can be placed, false otherwise
     */
    public boolean placeWordInCrossword(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        int wordLen = word.length();

        // Check horizontal placements
        for (int i = 0; i < m; i++) {
            int j = 0;
            while (j < n) {
                // Skip blocked cells
                if (board[i][j] == '#') {
                    j++;
                    continue;
                }

                // Collect sequence until we hit '#' or end of row
                StringBuilder sequence = new StringBuilder();
                while (j < n && board[i][j] != '#') {
                    sequence.append(board[i][j]);
                    j++;
                }

                // Check if this slot can fit our word
                if (matches(sequence.toString(), word)) {
                    return true;
                }
            }
        }

        // Check vertical placements
        for (int j = 0; j < n; j++) {
            int i = 0;
            while (i < m) {
                // Skip blocked cells
                if (board[i][j] == '#') {
                    i++;
                    continue;
                }

                // Collect sequence until we hit '#' or end of column
                StringBuilder sequence = new StringBuilder();
                while (i < m && board[i][j] != '#') {
                    sequence.append(board[i][j]);
                    i++;
                }

                // Check if this slot can fit our word
                if (matches(sequence.toString(), word)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if sequence of cells matches word (forward or backward).
     * @param sequence sequence of cells as string
     * @param word word to match
     * @return true if sequence matches word forward or backward
     */
    private boolean matches(String sequence, String word) {
        // Sequence must be exactly word length
        if (sequence.length() != word.length()) {
            return false;
        }

        // Check forward match
        boolean forwardMatch = true;
        for (int i = 0; i < word.length(); i++) {
            char cell = sequence.charAt(i);
            // Empty cell matches any letter, otherwise must match exactly
            if (cell != ' ' && cell != word.charAt(i)) {
                forwardMatch = false;
                break;
            }
        }

        // Check backward match
        boolean backwardMatch = true;
        for (int i = 0; i < word.length(); i++) {
            char cell = sequence.charAt(i);
            // For backward match, compare with reversed word
            if (cell != ' ' && cell != word.charAt(word.length() - 1 - i)) {
                backwardMatch = false;
                break;
            }
        }

        return forwardMatch || backwardMatch;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We scan each cell exactly twice: once for horizontal slots and once for vertical slots
- For each slot, we check if the word fits in O(k) time, but the total work across all slots is still O(m × n) because each cell is part of at most one horizontal slot and one vertical slot
- The matches function runs in O(k) time but k ≤ max(m, n)

**Space Complexity:** O(1) excluding input storage

- We only use a few variables and a temporary list/string to store sequences
- The sequence storage is O(k) but k ≤ max(m, n), and this is temporary space that doesn't scale with input size

## Common Mistakes

1. **Forgetting to check both directions**: Words can be placed left-to-right OR right-to-left (and top-to-bottom OR bottom-to-top). Many candidates only check forward placement. Always check both the word and its reverse.

2. **Incorrect boundary checking**: A word can only start if the previous cell is blocked ('#') or out of bounds, and can only end if the next cell is blocked or out of bounds. The slot-based approach naturally handles this by finding sequences between '#' characters.

3. **Mishandling empty cells vs letters**: Empty cells (' ') match any letter, but letters must match exactly. Some candidates treat empty cells as mismatches or vice versa.

4. **Not checking sequence length first**: Before comparing characters, check if the sequence length equals the word length. This saves unnecessary comparisons and handles the case where a slot is too short or too long.

## When You'll See This Pattern

This pattern of scanning a grid for contiguous sequences with specific boundary conditions appears in several problems:

1. **Word Search (LeetCode 79)**: Similar grid traversal but with different placement rules (words can turn). Both involve matching patterns in a grid.

2. **Battleships in a Board (LeetCode 419)**: Identifying contiguous sequences of 'X's with specific orientation rules.

3. **Max Area of Island (LeetCode 695)**: Finding contiguous regions in a grid, though with different connectivity rules (4-directional vs 1-directional here).

The core technique is systematic grid scanning with careful attention to boundary conditions and sequence extraction.

## Key Takeaways

1. **Slot-based thinking**: Instead of checking every possible starting position, identify valid "slots" where words could fit. This reduces redundant checks and simplifies boundary condition handling.

2. **Direction matters**: When dealing with linear placements in grids, always consider both forward and backward directions unless explicitly stated otherwise.

3. **Grid scanning patterns**: Many grid problems involve scanning row-by-row and column-by-column. Recognizing when to use this pattern can simplify complex-seeming problems.

[Practice this problem on CodeJeet](/problem/check-if-word-can-be-placed-in-crossword)
