---
title: "How to Solve Minimum Number of Pushes to Type Word I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Number of Pushes to Type Word I. Easy difficulty, 66.9% acceptance rate. Topics: Math, String, Greedy."
date: "2028-07-21"
category: "dsa-patterns"
tags: ["minimum-number-of-pushes-to-type-word-i", "math", "string", "greedy", "easy"]
---

## How to Solve Minimum Number of Pushes to Type Word I

You're given a string of distinct lowercase letters and need to determine the minimum number of button presses required to type it on a phone keypad where each key can hold multiple letters. The challenge is figuring out how to distribute the letters across keys to minimize total presses, since letters on the same key require multiple presses to reach later letters.

**What makes this interesting:** While the problem seems like simple math, it actually requires a greedy approach to optimally distribute letters across keys. The key insight is that you want to put the most frequently typed letters (in this case, all letters appear once, but longer words would benefit) on the first positions of keys to minimize presses.

## Visual Walkthrough

Let's trace through an example: `word = "abcdefgh"` (8 distinct letters).

**Step 1: Understanding the constraint**

- Each key can hold multiple letters
- To type the first letter on a key: 1 press
- To type the second letter on a key: 2 presses
- To type the third letter on a key: 3 presses
- And so on...

**Step 2: Distributing letters**
We have 8 letters to distribute across keys. Let's try different distributions:

_Bad distribution:_ Put all 8 letters on one key

- Presses: 1+2+3+4+5+6+7+8 = 36 presses

_Better distribution:_ Put 4 letters on key1, 4 on key2

- Key1: 1+2+3+4 = 10 presses
- Key2: 1+2+3+4 = 10 presses
- Total: 20 presses

_Optimal distribution:_ Spread letters as evenly as possible

- 3 keys with 3, 3, 2 letters:
- Key1: 1+2+3 = 6 presses
- Key2: 1+2+3 = 6 presses
- Key3: 1+2 = 3 presses
- Total: 15 presses

**Step 3: The pattern emerges**
The optimal strategy is to assign letters to keys in "rounds":

- Round 1: Put 1 letter on each of the first 8 keys (if we had 8 keys)
- Round 2: Put a 2nd letter on each of the first 8 keys
- But wait! We only have 8 letters total, so we stop after round 1

Actually, for 8 letters, the optimal is:

- First 8 letters get 1 press each = 8 presses
- That's it! Because we can put each letter on its own key

But the problem says we're using a standard phone keypad layout. Let me re-read... Actually, the problem doesn't specify we must use standard mapping! We can arrange letters however we want. So for 8 distinct letters, we can put each on a different key, requiring exactly 8 presses.

Let's try `word = "abcde"` (5 letters):

- We can put each on separate keys: 1+1+1+1+1 = 5 presses

What about `word = "abcdefghijklmnop"` (16 letters)?

- First 8 letters: 1 press each (on 8 different keys)
- Remaining 8 letters: 2 presses each (as second letters on those 8 keys)
- Total: 8×1 + 8×2 = 24 presses

## Brute Force Approach

A naive approach would be to try all possible distributions of letters across keys. For n letters, we could try putting 1 letter on key1, then distribute the remaining n-1 letters across keys... but this leads to combinatorial explosion.

The brute force would involve:

1. Generating all partitions of n letters into groups (each group is a key)
2. For each partition, calculate total presses: sum for each group of (1+2+...+group_size)
3. Take the minimum

This is O(n!) time complexity - completely impractical for n up to 26.

**Why it fails:** The problem has structure we can exploit. We don't need to try all combinations because there's a clear optimal strategy: assign letters to keys in "rounds" - first give every key its first letter, then give every key its second letter, and so on.

## Optimal Solution

The optimal solution uses a greedy approach:

1. Sort letters by frequency (in this problem, all appear once, so any order works)
2. Assign letters to keys in rounds:
   - First, give 1 letter to as many keys as possible (all keys get their first letter)
   - Then give a second letter to as many keys as possible
   - Continue until all letters are assigned
3. Calculate total presses: letters in round 1 cost 1 press each, round 2 cost 2 presses each, etc.

Mathematically: For n letters, with at most 8 keys available (standard phone), the optimal is:

- First 8 letters: 1 press each
- Next 8 letters: 2 presses each
- Next 8 letters: 3 presses each
- And so on...

<div class="code-group">

```python
# Time: O(n) where n = len(word) | Space: O(1)
def minimumPushes(word: str) -> int:
    """
    Calculate minimum number of key presses to type a word with distinct letters.

    The optimal strategy is to distribute letters across keys in rounds:
    - First 8 letters get 1 press each (each on different keys)
    - Next 8 letters get 2 presses each (second letters on those keys)
    - Next 8 letters get 3 presses each (third letters on those keys)
    - And so on...

    Args:
        word: String containing distinct lowercase letters

    Returns:
        Minimum number of key presses required
    """
    n = len(word)  # Number of distinct letters to type

    total_pushes = 0
    # Process letters in groups of 8
    # Each group i (0-indexed) requires (i+1) presses per letter
    for i in range(n):
        # Determine which "round" this letter is in
        # Letters 0-7: round 0 (1 press each)
        # Letters 8-15: round 1 (2 presses each)
        # Letters 16-23: round 2 (3 presses each)
        round_num = i // 8

        # Cost for this letter = (round_num + 1) presses
        total_pushes += (round_num + 1)

    return total_pushes
```

```javascript
// Time: O(n) where n = word.length | Space: O(1)
/**
 * Calculate minimum number of key presses to type a word with distinct letters.
 *
 * The optimal strategy is to distribute letters across keys in rounds:
 * - First 8 letters get 1 press each (each on different keys)
 * - Next 8 letters get 2 presses each (second letters on those keys)
 * - Next 8 letters get 3 presses each (third letters on those keys)
 * - And so on...
 *
 * @param {string} word - String containing distinct lowercase letters
 * @return {number} Minimum number of key presses required
 */
function minimumPushes(word) {
  const n = word.length; // Number of distinct letters to type

  let totalPushes = 0;

  // Process each letter
  for (let i = 0; i < n; i++) {
    // Determine which "round" this letter is in
    // Math.floor(i / 8) gives the round number (0-indexed)
    const roundNum = Math.floor(i / 8);

    // Cost for this letter = (roundNum + 1) presses
    totalPushes += roundNum + 1;
  }

  return totalPushes;
}
```

```java
// Time: O(n) where n = word.length() | Space: O(1)
class Solution {
    /**
     * Calculate minimum number of key presses to type a word with distinct letters.
     *
     * The optimal strategy is to distribute letters across keys in rounds:
     * - First 8 letters get 1 press each (each on different keys)
     * - Next 8 letters get 2 presses each (second letters on those keys)
     * - Next 8 letters get 3 presses each (third letters on those keys)
     * - And so on...
     *
     * @param word String containing distinct lowercase letters
     * @return Minimum number of key presses required
     */
    public int minimumPushes(String word) {
        int n = word.length();  // Number of distinct letters to type

        int totalPushes = 0;

        // Process each letter
        for (int i = 0; i < n; i++) {
            // Determine which "round" this letter is in
            // i / 8 gives the round number (integer division in Java)
            int roundNum = i / 8;

            // Cost for this letter = (roundNum + 1) presses
            totalPushes += (roundNum + 1);
        }

        return totalPushes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the word once to count its length
- The loop runs n times, where n is the length of the word
- Each iteration does constant-time operations (division and addition)

**Space Complexity: O(1)**

- We only use a few integer variables (n, total_pushes, i, round_num)
- No additional data structures that grow with input size
- The input word itself is given, not counted in our space usage

## Common Mistakes

1. **Assuming standard phone keypad mapping:** The problem doesn't require using standard phone mappings (2=abc, 3=def, etc.). We can arrange letters however we want. Candidates who try to use actual phone mappings will get the wrong answer.

2. **Not handling the "distinct letters" condition:** Some candidates might think about letter frequencies, but the problem guarantees all letters are distinct. This simplifies the solution - we don't need to count frequencies or sort by frequency.

3. **Off-by-one errors in round calculation:** When calculating `round_num = i // 8`, remember that `i` is 0-indexed. Letter 0-7 are in round 0 (cost 1), letters 8-15 are in round 1 (cost 2), etc. The cost is `round_num + 1`, not `round_num`.

4. **Overcomplicating with actual key assignments:** We don't need to actually assign letters to specific keys or track which letters go where. We only need the total count of presses, which depends only on how many letters need 1 press, how many need 2 presses, etc.

## When You'll See This Pattern

This problem uses a **greedy distribution** pattern where you allocate limited resources (key positions) to items (letters) to minimize total cost. Similar patterns appear in:

1. **Task Scheduler (LeetCode 621):** Scheduling tasks with cooldown periods uses similar round-robin allocation of tasks to minimize idle time.

2. **Rearrange String k Distance Apart (LeetCode 358):** Requires spacing out identical characters, using a similar "process in rounds" approach with priority queues.

3. **Maximum Number of Weeks for Which You Can Work (LeetCode 1953):** Another problem about distributing items (projects with different durations) to maximize utilization.

The core insight is recognizing when you can process items in "rounds" or "layers" rather than trying all possible arrangements.

## Key Takeaways

1. **Greedy round-robin distribution** is optimal when you have multiple "slots" (keys) and want to minimize the sum of positions. Always fill the first position of all slots before adding to second positions.

2. **Mathematical simplification beats simulation:** Instead of simulating actual key assignments, we derived a formula `(i // 8) + 1` for the cost of the i-th letter. Look for mathematical patterns before writing complex code.

3. **Read constraints carefully:** The "distinct letters" condition changes the problem significantly. If letters could repeat, we'd need to sort by frequency and put frequent letters in early positions.

Related problems: [Letter Combinations of a Phone Number](/problem/letter-combinations-of-a-phone-number)
