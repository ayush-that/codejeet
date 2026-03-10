---
title: "How to Solve Can Convert String in K Moves — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Can Convert String in K Moves. Medium difficulty, 37.0% acceptance rate. Topics: Hash Table, String."
date: "2029-07-30"
category: "dsa-patterns"
tags: ["can-convert-string-in-k-moves", "hash-table", "string", "medium"]
---

# How to Solve "Can Convert String in K Moves"

You're given two strings `s` and `t` of equal length, and an integer `k`. You need to determine if you can transform `s` into `t` by shifting characters at different positions. The tricky part is that each shift operation requires a certain number of moves, and you can't reuse the same number of moves for different positions. This creates a scheduling problem where you need to track which shift distances you've already used and when they become available again.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose:

- `s = "abc"`
- `t = "bcd"`
- `k = 10`

We need to check each position:

1. Position 0: 'a' → 'b' needs 1 move (since 'b' comes 1 position after 'a' in alphabet)
2. Position 1: 'b' → 'c' needs 1 move
3. Position 2: 'c' → 'd' needs 1 move

Here's the challenge: We need 1 move for three different positions, but we can't use "1 move" more than once without waiting. The rules say: if we use `x` moves for one position, we can't use `x` moves again until we've made at least 26 more moves.

So our schedule would be:

- Move 1: Use shift 1 for position 0
- Move 2: Can't use shift 1 again (need to wait until move 27)
- We need to use shift 1 for position 1, but the earliest we can use it again is move 27
- Since k=10, we can't complete this transformation

Let's try another example:

- `s = "input"`
- `t = "ouput"`
- `k = 9`

Check each position:

1. 'i' → 'o': Need 6 moves (o is 6 letters after i)
2. 'n' → 'u': Need 7 moves
3. 'p' → 'p': Need 0 moves (no shift needed)
4. 'u' → 'u': Need 0 moves
5. 't' → 't': Need 0 moves

We need shift 6 and shift 7. These don't conflict since they're different values. We can do:

- Move 1: Shift 6 for position 0
- Move 2: Shift 7 for position 1
  Total moves needed: 7 (the larger of 6 and 7)
  Since k=9 ≥ 7, we can convert the string.

## Brute Force Approach

A naive approach would be to simulate all possible move sequences. For each position that needs shifting, we could try to schedule it at the earliest available move. However, this becomes a complex scheduling problem with factorial complexity in the worst case.

A slightly better but still inefficient brute force would be:

1. Calculate the required shift for each position
2. Sort positions by required shift
3. Try to assign moves greedily, tracking when each shift value becomes available

Even this approach has issues because we need to consider that shift `x` and shift `x + 26` are effectively the same operation and can't be scheduled simultaneously. The complexity would be O(n²) in the worst case, which is too slow for the constraints (strings up to length 100,000).

The key insight we're missing is that we don't need to simulate the actual scheduling—we just need to check if it's possible.

## Optimized Approach

The optimal solution relies on this observation: If we need shift `d` for multiple positions, we need to schedule them at moves: `d`, `d + 26`, `d + 52`, etc. The `i`-th occurrence of shift `d` requires move `d + 26*(i-1)`.

Therefore, for each shift distance `d` (1 to 25), we need to check:

1. How many positions require exactly shift `d`?
2. For the `i`-th occurrence (1-indexed), we need move number `d + 26*(i-1)`
3. The largest move number needed for shift `d` is `d + 26*(count[d] - 1)`
4. We need ALL these largest move numbers to be ≤ k

The algorithm:

1. If strings have different lengths, return false immediately
2. For each position, calculate the required shift: `(t_char - s_char + 26) % 26`
3. Count how many positions need each shift value (1-25, ignore 0)
4. For each shift value `d` with count `c`, check if `d + 26*(c-1) ≤ k`
5. If all checks pass, return true

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of strings
# Space: O(1) since we use a fixed-size array of 26 elements
def canConvertString(s: str, t: str, k: int) -> bool:
    # Step 1: Check if strings have the same length
    if len(s) != len(t):
        return False

    # Step 2: Initialize count array for shifts 0-25
    # shift_count[d] = how many positions need shift d
    shift_count = [0] * 26

    # Step 3: Calculate required shift for each position
    for i in range(len(s)):
        # Calculate shift needed: (t_char - s_char + 26) % 26
        # +26 ensures positive result, %26 wraps around alphabet
        shift = (ord(t[i]) - ord(s[i]) + 26) % 26
        shift_count[shift] += 1

    # Step 4: Check each shift value (1-25, ignore 0 shift)
    for shift in range(1, 26):
        # Count how many positions need this shift
        count = shift_count[shift]

        if count == 0:
            continue  # No positions need this shift

        # For the i-th occurrence of shift value 'shift',
        # we need move number: shift + 26*(i-1)
        # The last (count-th) occurrence needs: shift + 26*(count-1)
        max_move_needed = shift + 26 * (count - 1)

        # If even the last occurrence needs more moves than k allows,
        # conversion is impossible
        if max_move_needed > k:
            return False

    # Step 5: All shifts can be scheduled within k moves
    return True
```

```javascript
// Time: O(n) where n is the length of strings
// Space: O(1) since we use a fixed-size array of 26 elements
function canConvertString(s, t, k) {
  // Step 1: Check if strings have the same length
  if (s.length !== t.length) {
    return false;
  }

  // Step 2: Initialize count array for shifts 0-25
  // shiftCount[d] = how many positions need shift d
  const shiftCount = new Array(26).fill(0);

  // Step 3: Calculate required shift for each position
  for (let i = 0; i < s.length; i++) {
    // Calculate shift needed: (t_char - s_char + 26) % 26
    // +26 ensures positive result, %26 wraps around alphabet
    const shift = (t.charCodeAt(i) - s.charCodeAt(i) + 26) % 26;
    shiftCount[shift]++;
  }

  // Step 4: Check each shift value (1-25, ignore 0 shift)
  for (let shift = 1; shift < 26; shift++) {
    // Count how many positions need this shift
    const count = shiftCount[shift];

    if (count === 0) {
      continue; // No positions need this shift
    }

    // For the i-th occurrence of shift value 'shift',
    // we need move number: shift + 26*(i-1)
    // The last (count-th) occurrence needs: shift + 26*(count-1)
    const maxMoveNeeded = shift + 26 * (count - 1);

    // If even the last occurrence needs more moves than k allows,
    // conversion is impossible
    if (maxMoveNeeded > k) {
      return false;
    }
  }

  // Step 5: All shifts can be scheduled within k moves
  return true;
}
```

```java
// Time: O(n) where n is the length of strings
// Space: O(1) since we use a fixed-size array of 26 elements
class Solution {
    public boolean canConvertString(String s, String t, int k) {
        // Step 1: Check if strings have the same length
        if (s.length() != t.length()) {
            return false;
        }

        // Step 2: Initialize count array for shifts 0-25
        // shiftCount[d] = how many positions need shift d
        int[] shiftCount = new int[26];

        // Step 3: Calculate required shift for each position
        for (int i = 0; i < s.length(); i++) {
            // Calculate shift needed: (t_char - s_char + 26) % 26
            // +26 ensures positive result, %26 wraps around alphabet
            int shift = (t.charAt(i) - s.charAt(i) + 26) % 26;
            shiftCount[shift]++;
        }

        // Step 4: Check each shift value (1-25, ignore 0 shift)
        for (int shift = 1; shift < 26; shift++) {
            // Count how many positions need this shift
            int count = shiftCount[shift];

            if (count == 0) {
                continue;  // No positions need this shift
            }

            // For the i-th occurrence of shift value 'shift',
            // we need move number: shift + 26*(i-1)
            // The last (count-th) occurrence needs: shift + 26*(count-1)
            int maxMoveNeeded = shift + 26 * (count - 1);

            // If even the last occurrence needs more moves than k allows,
            // conversion is impossible
            if (maxMoveNeeded > k) {
                return false;
            }
        }

        // Step 5: All shifts can be scheduled within k moves
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the strings once to calculate shifts: O(n)
- We iterate through the 26 possible shift values: O(26) = O(1)
- Total: O(n + 26) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers regardless of input size
- No additional data structures scale with input size

## Common Mistakes

1. **Forgetting to handle wrap-around shifts**: When calculating `t_char - s_char`, if `t_char` comes before `s_char` in the alphabet, we get a negative number. Candidates often forget to add 26 before taking modulo 26. The correct formula is `(t_char - s_char + 26) % 26`.

2. **Not checking string lengths first**: If `s` and `t` have different lengths, we should return false immediately. Some candidates start processing without this check and encounter index errors or incorrect results.

3. **Incorrect scheduling logic**: The most subtle mistake is misunderstanding how shifts can be reused. Candidates might think shift `d` can be used every `d` moves instead of every 26 moves. Remember: if you use shift `d` at move `x`, you can't use it again until move `x + 26`.

4. **Off-by-one errors with k**: The problem says "in k moves or less", so we need `max_move_needed ≤ k`, not `< k`. Also, moves are 1-indexed, so shift `d` requires at least `d` moves, not `d-1`.

## When You'll See This Pattern

This problem uses a **frequency counting with modulo arithmetic** pattern combined with **resource scheduling constraints**. You'll see similar patterns in:

1. **Task Scheduler (LeetCode 621)**: Tasks need to be scheduled with a cooldown period. Similar to how shifts need to be spaced 26 moves apart, tasks with the same type need to be spaced `n` intervals apart.

2. **Rearrange String k Distance Apart (LeetCode 358)**: Rearrange string so that same characters are at least distance `k` apart. The scheduling logic is very similar—you need to track when characters can be used again.

3. **Minimum Cost to Convert String I (LeetCode 2976)**: A direct variation of this problem with weighted shifts. The core scheduling logic remains the same, but with cost considerations.

## Key Takeaways

1. **When dealing with cyclic constraints (like alphabet wrap-around), modulo arithmetic is your friend**. The formula `(a - b + mod) % mod` reliably gives non-negative results.

2. **For scheduling problems with reuse constraints, think in terms of "slots"**. If resource `x` needs to be reused, it needs slots at `x`, `x + interval`, `x + 2*interval`, etc. The last occurrence determines the feasibility.

3. **Frequency counting often simplifies complex scheduling**. Instead of simulating the actual schedule, count how many times each operation is needed and calculate the latest possible slot needed for each operation type.

Related problems: [Minimum Cost to Convert String I](/problem/minimum-cost-to-convert-string-i), [Minimum Cost to Convert String II](/problem/minimum-cost-to-convert-string-ii)
