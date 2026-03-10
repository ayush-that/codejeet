---
title: "How to Solve Construct String With Repeat Limit — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct String With Repeat Limit. Medium difficulty, 70.9% acceptance rate. Topics: Hash Table, String, Greedy, Heap (Priority Queue), Counting."
date: "2026-12-30"
category: "dsa-patterns"
tags: ["construct-string-with-repeat-limit", "hash-table", "string", "greedy", "medium"]
---

# How to Solve Construct String With Repeat Limit

You're given a string `s` and an integer `repeatLimit`. Your task is to construct the lexicographically largest possible string where no character appears more than `repeatLimit` times consecutively. The challenge lies in balancing two competing goals: using the largest characters first (for lexicographic order) while respecting the consecutive repetition limit.

**What makes this tricky:** You can't simply sort and use characters greedily from largest to smallest, because you might hit the repeat limit and need to insert a smaller character as a "spacer" before continuing with the larger one. This creates a pattern of alternating between the current largest character and the next available character when needed.

## Visual Walkthrough

Let's trace through an example: `s = "cczzaz"`, `repeatLimit = 2`

**Step 1: Count character frequencies**

- c: 2, z: 2, a: 1, z: 1 (wait, we have duplicate 'z's)
  Actually, let's count properly: c: 2, z: 3 (from "zzaz"), a: 1

**Step 2: Start with largest character 'z' (frequency: 3)**

- Add 'z' → result: "z" (1 consecutive)
- Add 'z' → result: "zz" (2 consecutive, hit limit!)
- Can't add another 'z' directly

**Step 3: Need a spacer - use next largest available character 'c'**

- Add 'c' → result: "zzc"
- Reset consecutive count for 'z'

**Step 4: Continue with 'z' (remaining: 1)**

- Add 'z' → result: "zzcz" (1 consecutive, 'z' exhausted)

**Step 5: Move to next largest 'c' (remaining: 2)**

- Add 'c' → result: "zzczc" (1 consecutive)
- Add 'c' → result: "zzczcc" (2 consecutive, hit limit!)

**Step 6: Need spacer - use next largest 'a'**

- Add 'a' → result: "zzczcca"
- Reset consecutive count for 'c'

**Step 7: Continue with 'c' (remaining: 0)**

- 'c' exhausted, move to 'a' (remaining: 0)
- All characters used or no more valid moves

**Final result:** "zzczcca" (lexicographically largest possible)

The pattern emerges: we repeatedly take the largest available character until we hit the repeat limit, then take the next largest character as a spacer, then return to the largest character.

## Brute Force Approach

A naive approach might try all permutations of the string, checking each for the repeat limit constraint, and keeping track of the lexicographically largest valid one. This would involve:

1. Generating all permutations of the string (O(n!))
2. For each permutation, checking if any character repeats more than `repeatLimit` times consecutively (O(n))
3. Tracking the lexicographically largest valid permutation

**Why this fails:** For a string of length n, there are n! permutations. Even for n=10, that's 3.6 million permutations. The problem constraints (s.length up to 10^5) make this completely infeasible.

Another naive approach might try to build the string character by character, always choosing the largest available character that doesn't violate the repeat limit. However, this simple greedy approach fails because sometimes you need to use a smaller character as a spacer even when the larger character still has remaining count.

## Optimized Approach

The key insight is that we need to **always use the largest possible character** while respecting the repeat limit, and when we hit the limit, we need to **insert exactly one instance of the next largest character** as a spacer before continuing with the original character.

This suggests a two-pointer or two-heap approach:

1. Count frequencies of all characters
2. Process characters from largest ('z') to smallest ('a')
3. Keep track of the current character and the next available character
4. When we hit the repeat limit with the current character, insert one instance of the next character (if available) as a spacer

**Data structure choice:** We can use:

- A max-heap (priority queue) to always get the largest character
- A simple array of size 26 to store counts and iterate from largest to smallest

The array approach is simpler since we only have 26 lowercase letters. We iterate from 'z' down to 'a', and when we need a spacer, we look for the next largest character with remaining count.

## Optimal Solution

The algorithm works as follows:

1. Count frequencies of each character in `s`
2. Start from the largest character ('z') and move toward smallest ('a')
3. For each character, add up to `repeatLimit` instances to the result
4. If we still have more of that character remaining after adding `repeatLimit`, we need a spacer:
   - Find the next largest character with remaining count
   - Add exactly one instance of it as a spacer
   - Reset the consecutive count for our original character
   - Continue with the original character
5. Stop when no more characters can be added (either exhausted or no valid spacer available)

<div class="code-group">

```python
# Time: O(n) where n is length of s - we process each character at most once
# Space: O(1) for the count array (fixed size 26)
def repeatLimitedString(s: str, repeatLimit: int) -> str:
    # Step 1: Count frequencies of each character
    # We'll use an array of size 26 for lowercase letters
    count = [0] * 26
    for ch in s:
        count[ord(ch) - ord('a')] += 1

    result = []
    i = 25  # Start from 'z' (index 25)

    while i >= 0:
        if count[i] == 0:
            # Current character exhausted, move to next smaller one
            i -= 1
            continue

        # Step 2: Add up to repeatLimit instances of current character
        add_count = min(count[i], repeatLimit)
        result.append(chr(ord('a') + i) * add_count)
        count[i] -= add_count

        # Step 3: Check if we still have more of this character
        if count[i] > 0:
            # Need a spacer - find next largest character
            found_spacer = False
            for j in range(i - 1, -1, -1):
                if count[j] > 0:
                    # Add exactly one instance as spacer
                    result.append(chr(ord('a') + j))
                    count[j] -= 1
                    found_spacer = True
                    break

            # If no spacer found, we must stop
            if not found_spacer:
                break
            # If spacer found, continue with same character i
        else:
            # Current character exhausted, move to next
            i -= 1

    return ''.join(result)
```

```javascript
// Time: O(n) where n is length of s
// Space: O(1) for the count array (fixed size 26)
function repeatLimitedString(s, repeatLimit) {
  // Step 1: Count frequencies of each character
  const count = new Array(26).fill(0);
  for (const ch of s) {
    count[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  const result = [];
  let i = 25; // Start from 'z'

  while (i >= 0) {
    if (count[i] === 0) {
      // Current character exhausted, move to next smaller one
      i--;
      continue;
    }

    // Step 2: Add up to repeatLimit instances of current character
    const addCount = Math.min(count[i], repeatLimit);
    result.push(String.fromCharCode("a".charCodeAt(0) + i).repeat(addCount));
    count[i] -= addCount;

    // Step 3: Check if we still have more of this character
    if (count[i] > 0) {
      // Need a spacer - find next largest character
      let foundSpacer = false;
      for (let j = i - 1; j >= 0; j--) {
        if (count[j] > 0) {
          // Add exactly one instance as spacer
          result.push(String.fromCharCode("a".charCodeAt(0) + j));
          count[j]--;
          foundSpacer = true;
          break;
        }
      }

      // If no spacer found, we must stop
      if (!foundSpacer) {
        break;
      }
      // If spacer found, continue with same character i
    } else {
      // Current character exhausted, move to next
      i--;
    }
  }

  return result.join("");
}
```

```java
// Time: O(n) where n is length of s
// Space: O(1) for the count array (fixed size 26)
public String repeatLimitedString(String s, int repeatLimit) {
    // Step 1: Count frequencies of each character
    int[] count = new int[26];
    for (char ch : s.toCharArray()) {
        count[ch - 'a']++;
    }

    StringBuilder result = new StringBuilder();
    int i = 25;  // Start from 'z'

    while (i >= 0) {
        if (count[i] == 0) {
            // Current character exhausted, move to next smaller one
            i--;
            continue;
        }

        // Step 2: Add up to repeatLimit instances of current character
        int addCount = Math.min(count[i], repeatLimit);
        result.append(String.valueOf((char)('a' + i)).repeat(addCount));
        count[i] -= addCount;

        // Step 3: Check if we still have more of this character
        if (count[i] > 0) {
            // Need a spacer - find next largest character
            boolean foundSpacer = false;
            for (int j = i - 1; j >= 0; j--) {
                if (count[j] > 0) {
                    // Add exactly one instance as spacer
                    result.append((char)('a' + j));
                    count[j]--;
                    foundSpacer = true;
                    break;
                }
            }

            // If no spacer found, we must stop
            if (!foundSpacer) {
                break;
            }
            // If spacer found, continue with same character i
        } else {
            // Current character exhausted, move to next
            i--;
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting characters: O(n) where n is length of s
- Building the result: Each character from s is added to the result at most once, so O(n)
- The inner loop for finding spacers: In total across all iterations, this runs O(26 × n) in worst case, but since 26 is constant, it's O(n)

**Space Complexity: O(1)**

- The count array is fixed size 26
- The result string stores at most n characters, but this is output space, not auxiliary space
- No other data structures scale with input size

## Common Mistakes

1. **Forgetting to reset the consecutive count after a spacer**: After inserting a smaller character as a spacer, you must reset the consecutive count for the original character. Our solution handles this implicitly by always taking `min(count[i], repeatLimit)`.

2. **Infinite loop when no spacer is available**: If you hit the repeat limit with a character and there's no smaller character available, you must stop. Failing to check this leads to infinite loops or incorrect results.

3. **Using the wrong order for lexicographic comparison**: Remember that 'z' > 'a' in lexicographic order for lowercase letters. Some candidates mistakenly start from 'a' instead of 'z'.

4. **Not handling the edge case where repeatLimit = 0**: If `repeatLimit = 0`, you can't use any characters. The result should be an empty string. Our solution handles this because `min(count[i], 0)` will always be 0.

## When You'll See This Pattern

This problem combines **greedy selection** with **constraint satisfaction**, a common pattern in scheduling and rearrangement problems:

1. **Rearrange String k Distance Apart (Hard)**: Similar concept but with distance constraint instead of consecutive limit. Requires more sophisticated data structures.

2. **Task Scheduler (Medium)**: Schedule tasks with cooldown period - similar to needing spacers between identical tasks.

3. **Maximum Number of Consecutive Values You Can Make (Medium)**: Different domain but similar greedy approach with constraints.

The core pattern is: when you need to arrange items with constraints on adjacency, often a greedy approach that always picks the "best" available item, with fallback to "next best" when constraints require it, works well.

## Key Takeaways

1. **Greedy with fallback works for lexicographic problems**: When building lexicographically largest/smallest strings under constraints, often taking the best available option at each step, with a defined fallback strategy when constraints block you, yields the optimal solution.

2. **Fixed alphabet size enables O(1) space solutions**: When dealing with lowercase/uppercase letters (26/52 possibilities), array-based counting is often simpler and more efficient than hash maps or heaps.

3. **Constraint satisfaction often requires state tracking**: You need to track not just what characters are available, but also how many consecutive times the current character has been used.

Related problems: [Rearrange String k Distance Apart](/problem/rearrange-string-k-distance-apart)
