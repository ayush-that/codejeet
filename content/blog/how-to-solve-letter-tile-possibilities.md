---
title: "How to Solve Letter Tile Possibilities — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Letter Tile Possibilities. Medium difficulty, 83.5% acceptance rate. Topics: Hash Table, String, Backtracking, Counting."
date: "2028-04-29"
category: "dsa-patterns"
tags: ["letter-tile-possibilities", "hash-table", "string", "backtracking", "medium"]
---

# How to Solve Letter Tile Possibilities

This problem asks: given a string of letters (tiles), how many distinct non-empty sequences can you form by rearranging those letters? The twist is that you don't have to use all tiles in every sequence—you can form sequences of any length from 1 up to the total number of tiles. What makes this interesting is that we need to count _distinct_ sequences, not just all permutations, and we need to handle duplicate letters carefully.

## Visual Walkthrough

Let's trace through a small example: `tiles = "AAB"`

We want to count all possible non-empty sequences:

- Length 1: "A", "B" → 2 sequences
- Length 2: "AA", "AB", "BA" → 3 sequences
- Length 3: "AAB", "ABA", "BAA" → 3 sequences

Total: 2 + 3 + 3 = 8 distinct sequences

Notice that "A" appears twice in the input, so when we form sequences, we need to avoid counting "A" (from the first tile) and "A" (from the second tile) as different sequences—they're the same letter! This is why we can't just calculate permutations naively.

Let's think about how we'd generate these systematically:

1. Start with an empty sequence
2. For each unique letter available, add it to our sequence
3. Recursively build longer sequences
4. Count each valid sequence we create

For "AAB", we have:

- Count of A: 2
- Count of B: 1

We'd explore:

- Start: ""
  - Add A (count becomes 1), sequence = "A" → count 1
    - Add A (count becomes 0), sequence = "AA" → count 1
      - Add B, sequence = "AAB" → count 1
    - Add B (A count still 1), sequence = "AB" → count 1
      - Add A, sequence = "ABA" → count 1
  - Add B (count becomes 0), sequence = "B" → count 1
    - Add A (count becomes 1), sequence = "BA" → count 1
      - Add A, sequence = "BAA" → count 1

Total count: 8

## Brute Force Approach

A naive approach would be:

1. Generate all possible subsets of tiles (2^n possibilities)
2. For each subset, generate all permutations of those tiles
3. Add each permutation to a set to remove duplicates
4. Return the size of the set

The problem with this approach is the combinatorial explosion:

- For n tiles, there are 2^n subsets
- For each subset of size k, there are k! permutations
- We're generating many duplicate sequences due to identical letters
- The set operations become extremely expensive for larger inputs

Even for moderate n (like 7), we could be generating millions of sequences. The time complexity would be roughly O(2^n \* n!), which is completely impractical.

## Optimized Approach

The key insight is that we don't need to generate all sequences explicitly—we can count them using backtracking with frequency tracking. Here's the step-by-step reasoning:

1. **Count letter frequencies**: First, count how many of each letter we have. This helps us handle duplicates efficiently.

2. **Backtrack with pruning**: Use depth-first search to build sequences:
   - At each step, we can add any letter that still has remaining count
   - Each time we add a letter, we decrement its count
   - When we return from recursion, we restore the count (backtrack)
   - Every time we add a letter (not at the starting point), we increment our count

3. **Why this avoids duplicates**: By tracking frequencies instead of positions, we ensure that identical letters are treated as interchangeable. If we have two A's, choosing the first then the second produces the same sequence as choosing the second then the first. Our frequency approach counts this only once.

4. **Mathematical alternative**: There's also a mathematical approach using the formula for permutations of multisets, but the backtracking approach is more intuitive for interviews and generalizes better to similar problems.

## Optimal Solution

Here's the backtracking solution with frequency counting:

<div class="code-group">

```python
# Time: O(2^n) in worst case, but much better with pruning | Space: O(n) for recursion stack
def numTilePossibilities(tiles: str) -> int:
    # Step 1: Count frequency of each letter
    # We'll use a list of 26 integers for efficiency
    freq = [0] * 26
    for tile in tiles:
        freq[ord(tile) - ord('A')] += 1

    # Step 2: Define backtracking function
    def backtrack():
        count = 0

        # Try each possible letter
        for i in range(26):
            if freq[i] == 0:
                continue  # Skip letters we've used up

            # Choose this letter for our sequence
            freq[i] -= 1
            count += 1  # Count the sequence with this new letter

            # Recursively explore longer sequences
            count += backtrack()

            # Backtrack: restore the frequency
            freq[i] += 1

        return count

    # Step 3: Start backtracking from empty sequence
    return backtrack()
```

```javascript
// Time: O(2^n) in worst case, but much better with pruning | Space: O(n) for recursion stack
function numTilePossibilities(tiles) {
  // Step 1: Count frequency of each letter
  const freq = new Array(26).fill(0);
  for (const tile of tiles) {
    freq[tile.charCodeAt(0) - "A".charCodeAt(0)]++;
  }

  // Step 2: Define backtracking function
  function backtrack() {
    let count = 0;

    // Try each possible letter
    for (let i = 0; i < 26; i++) {
      if (freq[i] === 0) {
        continue; // Skip letters we've used up
      }

      // Choose this letter for our sequence
      freq[i]--;
      count++; // Count the sequence with this new letter

      // Recursively explore longer sequences
      count += backtrack();

      // Backtrack: restore the frequency
      freq[i]++;
    }

    return count;
  }

  // Step 3: Start backtracking from empty sequence
  return backtrack();
}
```

```java
// Time: O(2^n) in worst case, but much better with pruning | Space: O(n) for recursion stack
class Solution {
    public int numTilePossibilities(String tiles) {
        // Step 1: Count frequency of each letter
        int[] freq = new int[26];
        for (char tile : tiles.toCharArray()) {
            freq[tile - 'A']++;
        }

        // Step 2: Start backtracking from empty sequence
        return backtrack(freq);
    }

    private int backtrack(int[] freq) {
        int count = 0;

        // Try each possible letter
        for (int i = 0; i < 26; i++) {
            if (freq[i] == 0) {
                continue;  // Skip letters we've used up
            }

            // Choose this letter for our sequence
            freq[i]--;
            count++;  // Count the sequence with this new letter

            // Recursively explore longer sequences
            count += backtrack(freq);

            // Backtrack: restore the frequency
            freq[i]++;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(2^n) in the worst case, but in practice it's much faster due to pruning. The exact complexity is the total number of distinct sequences, which for n unique tiles would be Σ(k=1 to n) P(n, k) where P is permutations. With duplicates, it's less. For 7 unique tiles, this is around 13699 sequences.

**Space Complexity**: O(n) for the recursion stack depth, where n is the length of the input string. We also use O(1) extra space for the frequency array (fixed size 26).

Why isn't it factorial complexity? Because we're not generating all permutations of all subsets—we're pruning duplicates early by tracking frequencies. Each recursive call only explores letters that still have remaining count.

## Common Mistakes

1. **Forgetting to handle duplicates**: The most common mistake is treating identical letters as distinct. Candidates might generate all permutations and use a set to remove duplicates, which works for small inputs but times out for larger ones. Always think about frequency counting when dealing with identical items.

2. **Counting the empty sequence**: The problem asks for non-empty sequences. In our solution, we increment count _after_ choosing a letter, so we never count the empty sequence. If you increment at the start of the function, you'd incorrectly include the empty sequence.

3. **Not restoring state during backtracking**: Forgetting to increment the frequency back after recursion returns is a classic bug. This breaks the algorithm because future branches won't have access to all available letters.

4. **Inefficient data structures**: Using a hashmap instead of a fixed array for frequencies (when we know inputs are uppercase letters) adds unnecessary overhead. For problems with limited character sets, arrays are faster and simpler.

## When You'll See This Pattern

This pattern of "backtracking with frequency counting" appears in many combinatorial problems:

1. **Permutations II (LeetCode 47)**: Generate all unique permutations of a collection of numbers that may contain duplicates. The same frequency-counting approach prevents duplicate permutations.

2. **Combination Sum II (LeetCode 40)**: Find all unique combinations where candidate numbers may be used only once. Frequency tracking helps avoid using the same value multiple times when it appears multiple times in input.

3. **Subsets II (LeetCode 90)**: Find all possible subsets of a collection that may contain duplicates. The core challenge is avoiding duplicate subsets, which frequency counting helps with.

The common theme: when you need to generate combinations/permutations and the input contains duplicate elements, track frequencies instead of positions to avoid counting identical results multiple times.

## Key Takeaways

1. **Frequency over position**: When dealing with identical items in combinatorial problems, track how many of each item remain rather than which specific items you've used. This automatically handles duplicates.

2. **Incremental counting in backtracking**: You can count results during the backtracking process itself, without needing to store all results. This saves memory and can be more efficient.

3. **Prune early, prune often**: The backtracking approach naturally prunes impossible branches (when freq[i] == 0). This is more efficient than generating everything and filtering later.

[Practice this problem on CodeJeet](/problem/letter-tile-possibilities)
