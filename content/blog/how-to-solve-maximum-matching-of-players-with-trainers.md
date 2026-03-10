---
title: "How to Solve Maximum Matching of Players With Trainers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Matching of Players With Trainers. Medium difficulty, 75.2% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2026-04-16"
category: "dsa-patterns"
tags: ["maximum-matching-of-players-with-trainers", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Maximum Matching of Players With Trainers

You're given two arrays: `players` representing player abilities and `trainers` representing trainer capacities. A player can match with a trainer if the trainer's capacity is at least the player's ability. Each trainer can work with at most one player, and each player can match with at most one trainer. The goal is to maximize the number of matches. What makes this interesting is that it's not just about finding any matches—it's about finding the maximum possible matches, which requires careful pairing strategy.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `players = [4, 7, 9]`, `trainers = [8, 2, 5, 8]`

**Step 1: Sort both arrays**

- Sorted players: `[4, 7, 9]`
- Sorted trainers: `[2, 5, 8, 8]`

**Step 2: Initialize pointers**

- Player pointer `i = 0` (points to player with ability 4)
- Trainer pointer `j = 0` (points to trainer with capacity 2)
- Matches count = 0

**Step 3: Try to match player 4 with trainer 2**

- Player ability (4) > trainer capacity (2) ❌
- Trainer 2 is too weak for any player (since players are sorted ascending)
- Move trainer pointer: `j = 1` (trainer with capacity 5)

**Step 4: Try to match player 4 with trainer 5**

- Player ability (4) ≤ trainer capacity (5) ✅
- Create a match! Matches = 1
- Move both pointers: `i = 1`, `j = 2`

**Step 5: Try to match player 7 with trainer 8**

- Player ability (7) ≤ trainer capacity (8) ✅
- Create a match! Matches = 2
- Move both pointers: `i = 2`, `j = 3`

**Step 6: Try to match player 9 with trainer 8**

- Player ability (9) > trainer capacity (8) ❌
- Trainer 8 is too weak for player 9
- Move trainer pointer: `j = 4` (out of bounds)

**Result:** 2 matches (player 4 with trainer 5, player 7 with trainer 8)

The key insight: By sorting both arrays and using two pointers, we can greedily match the weakest available player with the weakest trainer that can handle them. This ensures we don't "waste" strong trainers on weak players when they could be used for stronger players.

## Brute Force Approach

A naive approach would try all possible matchings. For each player, we could:

1. Find all trainers that can handle this player
2. Try each possible assignment
3. Track the maximum number of matches

This is essentially a bipartite matching problem that could be solved with backtracking. However, with n players and m trainers, the worst-case time complexity would be O(n! \* m!) or O(2^(n+m)) with backtracking—completely impractical for typical constraints (up to 10^5 elements).

Even a simpler brute force—trying to match each player with the first available trainer—would fail because it doesn't consider optimal pairing. For example:

```
players = [1, 100], trainers = [100, 1]
Naive approach: player 1 matches with trainer 100, player 100 has no match → 1 match
Optimal: player 1 matches with trainer 1, player 100 matches with trainer 100 → 2 matches
```

The brute force fails because it doesn't strategically allocate trainers to maximize matches.

## Optimized Approach

The key insight is that this is a **greedy matching problem** that can be solved optimally with sorting and two pointers:

1. **Sort both arrays in ascending order** - This allows us to process players from weakest to strongest and trainers from weakest to strongest.

2. **Use two pointers** - One for players, one for trainers. At each step:
   - If the current trainer can handle the current player (trainer[j] ≥ player[i]), create a match and move both pointers forward.
   - If the trainer is too weak, skip this trainer (move trainer pointer forward) since they can't help any future players either (players are getting stronger).

3. **Why greedy works** - When we match the weakest available player with the weakest trainer that can handle them:
   - We don't waste strong trainers on weak players
   - We ensure weaker trainers get used if possible (otherwise they'd be wasted)
   - This maximizes matches because any alternative matching couldn't create more matches without leaving some player or trainer unused

This is similar to the "assign cookies" problem where we match children with cookies, but here both arrays need sorting.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + m log m) for sorting, O(n + m) for matching → O(n log n + m log m)
# Space: O(1) if we sort in-place, O(n + m) if we need to copy (Python's sort is O(n) space)
def matchPlayersAndTrainers(players, trainers):
    """
    Returns the maximum number of matches between players and trainers.

    Strategy:
    1. Sort both arrays to enable greedy matching
    2. Use two pointers to match weakest available player with weakest adequate trainer
    3. Count successful matches
    """
    # Step 1: Sort both arrays in ascending order
    players.sort()  # Sort players from weakest to strongest
    trainers.sort()  # Sort trainers from weakest to strongest

    # Step 2: Initialize pointers and match counter
    i = 0  # Pointer for players array
    j = 0  # Pointer for trainers array
    matches = 0

    # Step 3: Greedy matching using two pointers
    # We continue until we run out of players or trainers
    while i < len(players) and j < len(trainers):
        # Check if current trainer can handle current player
        if trainers[j] >= players[i]:
            # Trainer can handle player → create a match
            matches += 1
            i += 1  # Move to next player (this player is now matched)
            j += 1  # Move to next trainer (this trainer is now used)
        else:
            # Trainer is too weak for current player
            # Since players are sorted, this trainer can't handle ANY future players either
            # So we skip this trainer entirely
            j += 1

    # Step 4: Return total matches found
    return matches
```

```javascript
// Time: O(n log n + m log m) for sorting, O(n + m) for matching → O(n log n + m log m)
// Space: O(log n + log m) for sorting (JavaScript's sort typically uses O(log n) space)
function matchPlayersAndTrainers(players, trainers) {
  /**
   * Returns the maximum number of matches between players and trainers.
   *
   * Strategy:
   * 1. Sort both arrays to enable greedy matching
   * 2. Use two pointers to match weakest available player with weakest adequate trainer
   * 3. Count successful matches
   */

  // Step 1: Sort both arrays in ascending order
  // Note: JavaScript's sort() sorts lexicographically by default for numbers!
  // We need to provide a compare function for numerical sorting
  players.sort((a, b) => a - b); // Sort players from weakest to strongest
  trainers.sort((a, b) => a - b); // Sort trainers from weakest to strongest

  // Step 2: Initialize pointers and match counter
  let i = 0; // Pointer for players array
  let j = 0; // Pointer for trainers array
  let matches = 0;

  // Step 3: Greedy matching using two pointers
  // We continue until we run out of players or trainers
  while (i < players.length && j < trainers.length) {
    // Check if current trainer can handle current player
    if (trainers[j] >= players[i]) {
      // Trainer can handle player → create a match
      matches++;
      i++; // Move to next player (this player is now matched)
      j++; // Move to next trainer (this trainer is now used)
    } else {
      // Trainer is too weak for current player
      // Since players are sorted, this trainer can't handle ANY future players either
      // So we skip this trainer entirely
      j++;
    }
  }

  // Step 4: Return total matches found
  return matches;
}
```

```java
// Time: O(n log n + m log m) for sorting, O(n + m) for matching → O(n log n + m log m)
// Space: O(log n + log m) for sorting (Java's Arrays.sort() uses O(log n) space for primitive arrays)
class Solution {
    public int matchPlayersAndTrainers(int[] players, int[] trainers) {
        /**
         * Returns the maximum number of matches between players and trainers.
         *
         * Strategy:
         * 1. Sort both arrays to enable greedy matching
         * 2. Use two pointers to match weakest available player with weakest adequate trainer
         * 3. Count successful matches
         */

        // Step 1: Sort both arrays in ascending order
        Arrays.sort(players);  // Sort players from weakest to strongest
        Arrays.sort(trainers); // Sort trainers from weakest to strongest

        // Step 2: Initialize pointers and match counter
        int i = 0;      // Pointer for players array
        int j = 0;      // Pointer for trainers array
        int matches = 0;

        // Step 3: Greedy matching using two pointers
        // We continue until we run out of players or trainers
        while (i < players.length && j < trainers.length) {
            // Check if current trainer can handle current player
            if (trainers[j] >= players[i]) {
                // Trainer can handle player → create a match
                matches++;
                i++;  // Move to next player (this player is now matched)
                j++;  // Move to next trainer (this trainer is now used)
            } else {
                // Trainer is too weak for current player
                // Since players are sorted, this trainer can't handle ANY future players either
                // So we skip this trainer entirely
                j++;
            }
        }

        // Step 4: Return total matches found
        return matches;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n + m log m)

- Sorting `players` takes O(n log n) where n is the number of players
- Sorting `trainers` takes O(m log m) where m is the number of trainers
- The two-pointer matching takes O(n + m) since each pointer moves at most through its entire array
- Dominated by sorting: O(n log n + m log m)

**Space Complexity:** Depends on the sorting algorithm implementation:

- **Python:** O(n) for Timsort (Python's sorting algorithm needs O(n) space in worst case)
- **JavaScript:** O(log n) for V8's Timsort implementation
- **Java:** O(log n) for primitive arrays using dual-pivot quicksort
- If we consider only auxiliary space (excluding input): O(1) for pointers and counters

## Common Mistakes

1. **Forgetting to sort both arrays** - Some candidates sort only one array or neither. This breaks the greedy strategy because we can't guarantee optimal matching without sorted order.

2. **Incorrect comparison direction** - Using `>` instead of `>=` or comparing player to trainer instead of trainer to player. Remember: trainer capacity must be **at least** player ability.

3. **Moving pointers incorrectly** - When a match is found, BOTH pointers should advance (player gets matched, trainer gets used). When no match is found, only the trainer pointer should advance (this trainer is useless for all future players).

4. **JavaScript-specific: Default lexical sort** - In JavaScript, `array.sort()` without a compare function sorts lexicographically, so `[10, 2, 1]` becomes `[1, 10, 2]`. Always use `(a, b) => a - b` for numerical sorting.

5. **Not handling empty arrays** - While the problem guarantees non-empty arrays in constraints, it's good practice to mention that the code handles edge cases: if either array is empty, the while loop won't execute and we return 0 matches.

## When You'll See This Pattern

This "sort + two pointers" greedy matching pattern appears in several LeetCode problems:

1. **Assign Cookies (Easy)** - Almost identical! Match children with cookies where each child has a greed factor and each cookie has a size. The solution is exactly the same: sort both arrays and use two pointers.

2. **Most Profit Assigning Work (Medium)** - More complex version where you match workers with jobs to maximize profit. Requires sorting workers and jobs, then using two pointers with an additional variable to track best available job.

3. **Boats to Save People (Medium)** - Similar matching concept but with weight limits and the possibility of pairing two people in one boat. Uses sorting and two pointers from both ends.

4. **Long Pressed Name (Easy)** - While not about matching, it uses the same two-pointer technique to compare sequences with repetition.

The pattern to recognize: when you need to match or pair elements from two collections with some constraint, and you want to maximize/minimize the number of pairs, consider if sorting and two pointers can give an optimal greedy solution.

## Key Takeaways

1. **Greedy matching with sorting works** when you want to maximize the number of feasible pairs between two sets. Sort both collections to process elements in a systematic order.

2. **Two-pointer technique is powerful** for comparing or matching elements from two sorted sequences. It often reduces O(n²) brute force solutions to O(n log n) due to sorting.

3. **Prove greedy correctness by exchange argument** - In interviews, be prepared to explain why the greedy approach is optimal: any optimal solution can be transformed into our greedy solution without decreasing the number of matches by swapping assignments.

**Related problems:** [Most Profit Assigning Work](/problem/most-profit-assigning-work), [Long Pressed Name](/problem/long-pressed-name), [Interval List Intersections](/problem/interval-list-intersections)
