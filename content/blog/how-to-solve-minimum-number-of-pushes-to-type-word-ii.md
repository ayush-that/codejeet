---
title: "How to Solve Minimum Number of Pushes to Type Word II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Pushes to Type Word II. Medium difficulty, 80.0% acceptance rate. Topics: Hash Table, String, Greedy, Sorting, Counting."
date: "2026-03-05"
category: "dsa-patterns"
tags: ["minimum-number-of-pushes-to-type-word-ii", "hash-table", "string", "greedy", "medium"]
---

# How to Solve Minimum Number of Pushes to Type Word II

You're given a word containing lowercase letters, and you need to assign letters to phone keypad buttons (each button can have multiple letters) to minimize the total number of button presses required to type the word. The catch: you can choose which letters go on which buttons, but each button press cycles through its assigned letters. This is tricky because you need to balance frequency with position—common letters should be early in their button's sequence, but you also need to decide how many letters to put on each button.

## Visual Walkthrough

Let's trace through `word = "abcde"` step by step:

1. **Count letter frequencies**: All letters appear once: a=1, b=1, c=1, d=1, e=1
2. **Sort by frequency**: Already sorted (all equal)
3. **Assign to buttons**: We have 8 buttons (2-9) available. We need to decide how to distribute:
   - If we put all 5 letters on one button: typing "abcde" would take 1+2+3+4+5 = 15 presses
   - Better: spread across buttons. Let's try 2 letters on first button, 1 each on others:
     - Button 1: a(1 press), b(2 presses) = 3 total
     - Button 2: c(1) = 1
     - Button 3: d(1) = 1
     - Button 4: e(1) = 1
     - Total: 3+1+1+1 = 6 presses
4. **Optimal arrangement**: Put most frequent letters early in sequences. Since all frequencies equal, any arrangement with minimal letters per button works.

Now try `word = "aaabbbcccdd"`:

1. Frequencies: a=3, b=3, c=3, d=2
2. Sort descending: a,b,c,d (all 3's then 2)
3. Assign in rounds:
   - Round 1 (position 1 on each button): a,b,c,d → 4 buttons used, each gets 1 press per occurrence
   - Round 2 (position 2): a,b,c → 3 more buttons (or reuse existing)
   - Round 3 (position 3): a,b,c → 3 more
     Total presses = (3×1 + 3×1 + 3×1 + 2×1) + (3×2 + 3×2 + 3×2) + (3×3 + 3×3 + 3×3) = 11 + 18 + 27 = 56

The pattern: assign letters in frequency order, giving each new letter the next available position (1st, 2nd, 3rd, etc.) across buttons.

## Brute Force Approach

A naive approach would try all possible assignments of letters to buttons and positions. With 26 letters and 8 buttons that can each hold up to 26 letters, the search space is enormous. Even if we limit to reasonable distributions, checking all permutations is factorial complexity.

What a candidate might try:

1. Generate all possible partitions of letters across 8 buttons
2. For each partition, try all permutations of letters within buttons
3. Calculate total presses for each arrangement
4. Return the minimum

This is clearly infeasible (O(26! × 8^26) worst case). We need a smarter approach that leverages the problem structure.

## Optimized Approach

The key insight: **This is a greedy frequency assignment problem**. Think about it:

1. Each button acts like a list where the 1st letter costs 1 press, 2nd costs 2, etc.
2. We want frequent letters to have low costs (early positions)
3. We have 8 "slots" at each position level (one per button)

Optimal strategy:

- Sort letters by frequency descending
- Assign them in rounds: first give each of the 8 most frequent letters position 1, then the next 8 get position 2, etc.
- Each letter's cost = its position number × its frequency
- Total cost = sum of (position × frequency) for all letters

Why this works: If we ever put a less frequent letter before a more frequent one, we could swap them and reduce total presses. The sorted assignment ensures the highest frequencies get the lowest multipliers.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + k log k) where n = len(word), k = 26 letters
# Space: O(1) for frequency array (fixed size 26)
def minimumPushes(word: str) -> int:
    # Step 1: Count frequency of each letter
    # We use a fixed-size array for O(1) space
    freq = [0] * 26

    # Count occurrences of each character
    for ch in word:
        # Convert 'a'-'z' to 0-25 index
        freq[ord(ch) - ord('a')] += 1

    # Step 2: Sort frequencies in descending order
    # We only care about non-zero frequencies
    freq.sort(reverse=True)

    # Step 3: Calculate total pushes using greedy assignment
    total_pushes = 0
    # Position starts at 1 (first press on a button)
    position = 1
    # Index through sorted frequencies
    i = 0

    # Process letters in batches of up to 8 (one per button position)
    while i < 26 and freq[i] > 0:
        # Process up to 8 letters at current position level
        for j in range(8):
            if i + j >= 26 or freq[i + j] == 0:
                break
            # Cost = position number × frequency
            total_pushes += position * freq[i + j]

        # Move to next batch of 8 letters
        i += 8
        # Each new batch requires one more press per letter
        position += 1

    return total_pushes
```

```javascript
// Time: O(n + k log k) where n = word.length, k = 26 letters
// Space: O(1) for frequency array (fixed size 26)
function minimumPushes(word) {
  // Step 1: Count frequency of each letter
  const freq = new Array(26).fill(0);

  // Count occurrences of each character
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    // Convert 'a'-'z' to 0-25 index
    freq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 2: Sort frequencies in descending order
  freq.sort((a, b) => b - a);

  // Step 3: Calculate total pushes using greedy assignment
  let totalPushes = 0;
  // Position starts at 1 (first press on a button)
  let position = 1;
  // Index through sorted frequencies
  let i = 0;

  // Process letters in batches of up to 8 (one per button position)
  while (i < 26 && freq[i] > 0) {
    // Process up to 8 letters at current position level
    for (let j = 0; j < 8; j++) {
      if (i + j >= 26 || freq[i + j] === 0) {
        break;
      }
      // Cost = position number × frequency
      totalPushes += position * freq[i + j];
    }

    // Move to next batch of 8 letters
    i += 8;
    // Each new batch requires one more press per letter
    position++;
  }

  return totalPushes;
}
```

```java
// Time: O(n + k log k) where n = word.length(), k = 26 letters
// Space: O(1) for frequency array (fixed size 26)
public int minimumPushes(String word) {
    // Step 1: Count frequency of each letter
    int[] freq = new int[26];

    // Count occurrences of each character
    for (int i = 0; i < word.length(); i++) {
        char ch = word.charAt(i);
        // Convert 'a'-'z' to 0-25 index
        freq[ch - 'a']++;
    }

    // Step 2: Sort frequencies in descending order
    // Using Arrays.sort with custom comparator requires Integer[]
    // Simpler: sort manually or use List
    // For fixed small size (26), any sort is fine
    java.util.Arrays.sort(freq);

    // Step 3: Calculate total pushes using greedy assignment
    int totalPushes = 0;
    // Position starts at 1 (first press on a button)
    int position = 1;
    // Index through sorted frequencies (sorted ascending, so go backwards)
    int i = 25;

    // Process letters in batches of up to 8 (one per button position)
    while (i >= 0 && freq[i] > 0) {
        // Process up to 8 letters at current position level
        for (int j = 0; j < 8; j++) {
            if (i - j < 0 || freq[i - j] == 0) {
                break;
            }
            // Cost = position number × frequency
            totalPushes += position * freq[i - j];
        }

        // Move to next batch of 8 letters
        i -= 8;
        // Each new batch requires one more press per letter
        position++;
    }

    return totalPushes;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k log k)**

- `O(n)` to count character frequencies (iterate through the word once)
- `O(k log k)` to sort the frequency array, where k = 26 (constant)
- Since k is constant (26 letters), the sort is effectively O(1)
- Overall: **O(n)** linear time in practice

**Space Complexity: O(1)**

- Fixed-size frequency array of 26 integers
- Constant additional variables for counting and iteration
- No dependency on input size beyond the fixed alphabet

## Common Mistakes

1. **Forgetting to sort frequencies**: Some candidates count frequencies but then assign letters arbitrarily. The greedy assignment only works when processing from most to least frequent.

2. **Incorrect position calculation**: Each new "round" of 8 letters should increment the position counter. A common error is using `(index // 8) + 1` without handling the batch logic correctly.

3. **Overcomplicating with actual button assignment**: You don't need to track which letter goes on which button—only the position (1st, 2nd, 3rd) matters for cost calculation. The problem asks for minimum pushes, not the actual mapping.

4. **Off-by-one with 8 buttons**: Remember we have buttons 2-9 (8 buttons total), not 9 or 10. Some candidates mistakenly use 9 or 26 as the batch size.

## When You'll See This Pattern

This greedy frequency assignment pattern appears in several optimization problems:

1. **Huffman Coding (Medium)**: Similar idea of assigning shorter codes to more frequent symbols, though more complex with binary trees.

2. **Task Scheduler (Medium)**: Assigning tasks with cooldown periods—frequent tasks need spacing, similar to how we space letters across buttons.

3. **Rearrange String k Distance Apart (Hard)**: Another frequency-based scheduling problem where you need to separate identical characters.

4. **Maximum Units on a Truck (Easy)**: Greedy loading based on value/weight ratio—different domain but same "sort by value, take best first" approach.

The core pattern: **When you need to optimize allocation of limited resources (button positions) to items (letters) with different values (frequencies), sort by value and assign best resources to highest values first.**

## Key Takeaways

1. **Greedy with sorting often works for frequency optimization**: When costs depend on position/priority and you have items with different frequencies/values, try sorting descending and assigning sequentially.

2. **Look for batch processing patterns**: The "8 letters per position level" is essentially batch processing. Recognize when items can be grouped by their cost tier.

3. **Don't over-engineer**: You only needed the total pushes, not the actual button mapping. Many optimization problems only require the optimal value, not the full configuration.

Related problems: [Letter Combinations of a Phone Number](/problem/letter-combinations-of-a-phone-number)
