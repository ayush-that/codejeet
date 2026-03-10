---
title: "How to Solve Vowels Game in a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Vowels Game in a String. Medium difficulty, 77.1% acceptance rate. Topics: Math, String, Brainteaser, Game Theory."
date: "2026-02-20"
category: "dsa-patterns"
tags: ["vowels-game-in-a-string", "math", "string", "brainteaser", "medium"]
---

# How to Solve Vowels Game in a String

This problem presents a two-player game where Alice and Bob take turns removing substrings containing an odd number of vowels. The winner is determined by who can make the last valid move. What makes this problem interesting is that it appears to require complex game theory analysis, but actually reduces to a simple parity check once you understand the underlying pattern.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the string `s = "aeiou"` where all characters are vowels.

**Initial state:** `"aeiou"` (5 vowels total)

**Turn 1 (Alice):** Alice needs to remove a substring with an odd number of vowels. She could remove:

- The entire string `"aeiou"` (5 vowels, odd) → game ends, Alice wins
- `"aei"` (3 vowels, odd) → remaining string `"ou"` (2 vowels)
- `"a"` (1 vowel, odd) → remaining string `"eiou"` (4 vowels)

Let's see what happens if Alice removes `"a"`:

- Remaining: `"eiou"` (4 vowels total)

**Turn 2 (Bob):** Bob needs to remove a substring with an odd number of vowels from `"eiou"`. Options:

- `"eio"` (3 vowels, odd) → remaining `"u"` (1 vowel)
- `"ei"` (2 vowels, even) ❌ not valid
- `"iou"` (3 vowels, odd) → remaining `"e"` (1 vowel)

If Bob removes `"eio"`:

- Remaining: `"u"` (1 vowel)

**Turn 3 (Alice):** Alice removes `"u"` (1 vowel, odd) → empty string, Alice wins

Notice something interesting: Alice always seems to win in this example. Let's try a string with an even number of vowels: `s = "aeio"` (4 vowels).

**Initial:** `"aeio"` (4 vowels)

**Turn 1 (Alice):** Must remove substring with odd vowels:

- `"a"` (1 vowel) → remaining `"eio"` (3 vowels)
- `"aei"` (3 vowels) → remaining `"o"` (1 vowel)

If Alice removes `"a"`:

- Remaining: `"eio"` (3 vowels)

**Turn 2 (Bob):** Bob removes `"eio"` (3 vowels, odd) → empty string, Bob wins!

This suggests the total number of vowels might determine the winner.

## Brute Force Approach

A naive approach would be to simulate the game using recursion or backtracking. At each turn, we'd:

1. Find all possible substrings containing an odd number of vowels
2. Try each possible move
3. Recursively check if the current player can force a win

The problem with this approach is the exponential time complexity. For a string of length `n`, there are `O(n²)` possible substrings. At each turn, we'd need to check all of them, leading to a branching factor that grows quickly. Even for moderately sized strings, this becomes computationally infeasible.

Additionally, the game state isn't just the remaining string - it's also whose turn it is. A brute force solution would need to consider all possible sequences of moves, which is impractical for interview settings.

## Optimized Approach

The key insight is that this game follows a simple pattern based on parity (odd/even counting). Let's reason through it:

1. **First observation:** The game ends when no valid moves remain. A valid move requires a substring with an odd number of vowels.

2. **Second observation:** If the entire string has an odd number of vowels, Alice can win immediately by removing the entire string on her first turn.

3. **Third observation:** What if the string has an even number of vowels?
   - Alice must remove a substring with an odd number of vowels
   - Removing an odd number from an even total leaves an odd number remaining
   - Now Bob faces a string with an odd number of vowels
   - Bob can then remove the entire remaining string and win

4. **Fourth observation:** But wait - what if Alice removes a substring that doesn't leave a valid move for Bob? Let's think about this more carefully.

Actually, there's a simpler way to think about it: The game is determined solely by whether the total number of vowels is odd or even. Here's why:

- If the total vowels is odd: Alice wins immediately by taking the whole string
- If the total vowels is even: Alice must take an odd number of vowels, leaving an odd number for Bob. Bob can then take all remaining vowels and win.

But is it really that simple? Let's test with `s = "abc"` (1 vowel 'a'):

Total vowels = 1 (odd) → Alice takes whole string, wins ✓

Test with `s = "abcd"` (1 vowel 'a'):

Total vowels = 1 (odd) → Alice takes whole string, wins ✓

Test with `s = "ab"` (1 vowel 'a'):

Total vowels = 1 (odd) → Alice takes whole string, wins ✓

Actually, I need to reconsider. The problem states the substring must contain an odd number of vowels, not that it must consist entirely of vowels. So `"ab"` has 1 vowel, which is odd, so Alice can take `"ab"`.

The critical realization: **If there's at least one vowel in the string, Alice always wins.** Why?

1. If total vowels is odd: Alice takes the whole string and wins immediately
2. If total vowels is even: Alice can take a substring containing exactly 1 vowel (which is odd). This leaves a string with an odd number of vowels for Bob. Bob then faces the same situation as case 1 and can win.

Wait, that suggests Bob would win in case 2. But let's trace through an example with even total vowels: `s = "ae"` (2 vowels)

Alice takes `"a"` (1 vowel, odd) → remaining `"e"` (1 vowel)
Bob takes `"e"` (1 vowel, odd) → empty string, Bob wins ✓

So actually, Alice wins if and only if the string contains at least one vowel. If there are no vowels, there are no valid moves, so Alice loses immediately.

## Optimal Solution

The optimal solution is surprisingly simple: Count the vowels in the string. If there's at least one vowel, Alice wins. Otherwise, Bob wins.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def vowelsGame(s):
    """
    Determines if Alice wins the vowels game.

    The key insight: If the string contains ANY vowels, Alice can always win.
    If there are no vowels, there are no valid moves, so Alice loses.

    Args:
        s (str): The input string

    Returns:
        str: "Alice" if Alice wins, "Bob" otherwise
    """
    # Define the set of vowels for easy checking
    vowels = set('aeiouAEIOU')

    # Check if any character in the string is a vowel
    for char in s:
        if char in vowels:
            # Found at least one vowel - Alice wins
            return "Alice"

    # No vowels found - Bob wins
    return "Bob"
```

```javascript
// Time: O(n) | Space: O(1)
function vowelsGame(s) {
  /**
   * Determines if Alice wins the vowels game.
   *
   * The key insight: If the string contains ANY vowels, Alice can always win.
   * If there are no vowels, there are no valid moves, so Alice loses.
   *
   * @param {string} s - The input string
   * @returns {string} "Alice" if Alice wins, "Bob" otherwise
   */

  // Define the set of vowels for easy checking
  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  // Check if any character in the string is a vowel
  for (let i = 0; i < s.length; i++) {
    if (vowels.has(s[i])) {
      // Found at least one vowel - Alice wins
      return "Alice";
    }
  }

  // No vowels found - Bob wins
  return "Bob";
}
```

```java
// Time: O(n) | Space: O(1)
public class Solution {
    public String vowelsGame(String s) {
        /**
         * Determines if Alice wins the vowels game.
         *
         * The key insight: If the string contains ANY vowels, Alice can always win.
         * If there are no vowels, there are no valid moves, so Alice loses.
         *
         * @param s The input string
         * @return "Alice" if Alice wins, "Bob" otherwise
         */

        // Define the set of vowels for easy checking
        String vowelStr = "aeiouAEIOU";

        // Check if any character in the string is a vowel
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (vowelStr.indexOf(c) != -1) {
                // Found at least one vowel - Alice wins
                return "Alice";
            }
        }

        // No vowels found - Bob wins
        return "Bob";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We need to scan through the string once to check for vowels
- In the worst case, we check every character (when there are no vowels or the vowel is at the end)
- Each check is O(1) using a hash set or index lookup

**Space Complexity:** O(1)

- We only use a constant amount of extra space for the vowel set and loop variables
- The vowel set has fixed size (10 characters) regardless of input size

## Common Mistakes

1. **Overcomplicating with game theory:** Many candidates try to implement minimax or recursive game simulation. While this correctly models the game, it's unnecessarily complex and inefficient. The interviewers expect you to find the pattern.

2. **Counting total vowels instead of checking existence:** Some candidates count all vowels and check if the count is odd. This works but is more complex than needed. The simpler check is just whether any vowel exists.

3. **Forgetting case sensitivity:** The problem doesn't specify case, so you need to check both uppercase and lowercase vowels. Missing this gives wrong answers for strings like `"AEIOU"`.

4. **Not considering the empty string case:** If the string is empty, there are no vowels, so Bob wins. Our solution handles this correctly since the loop won't execute and we return "Bob".

## When You'll See This Pattern

This problem teaches the pattern of **parity-based game outcomes**. Similar problems include:

1. **Nim Game (LeetCode 292):** Another game theory problem where the outcome is determined by a simple modulo operation (n % 4 != 0). Like our vowel game, it appears complex but has a simple mathematical solution.

2. **Divisor Game (LeetCode 1025):** Alice and Bob take turns with numbers. The outcome depends on whether the starting number is even or odd - another parity-based game.

3. **Stone Game (LeetCode 877):** While more complex than our problem, it also has a mathematical insight that the first player can always win with optimal play when the number of piles is even.

The common thread is looking for invariant properties (like parity) that determine the game outcome regardless of the specific moves.

## Key Takeaways

1. **Look for invariants in game theory problems:** Many two-player turn-based games have outcomes determined by simple properties like parity, rather than requiring complex simulation.

2. **Start with small examples:** Tracing through concrete examples (like we did with `"aeiou"` and `"aeio"`) helps reveal patterns that aren't obvious from the problem statement alone.

3. **Consider edge cases early:** The empty string and strings without vowels are important edge cases that test whether you truly understand the game mechanics.

[Practice this problem on CodeJeet](/problem/vowels-game-in-a-string)
