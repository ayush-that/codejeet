---
title: "How to Solve Stamping The Sequence — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stamping The Sequence. Hard difficulty, 62.2% acceptance rate. Topics: String, Stack, Greedy, Queue."
date: "2028-03-20"
category: "dsa-patterns"
tags: ["stamping-the-sequence", "string", "stack", "greedy", "hard"]
---

# How to Solve Stamping The Sequence

You're given a target string and a stamp pattern. Starting with all question marks, you need to find a sequence of stamp placements that transforms the blank canvas into the target string. The challenge is that stamp placements can overwrite previous letters, making this a reverse engineering problem: we need to work backwards from the final result to figure out what stamps were applied.

What makes this problem tricky is that stamps can overlap, and earlier stamps get partially or completely covered by later ones. This means we can't simply match the stamp forward from left to right — we need to think in reverse.

## Visual Walkthrough

Let's trace through a concrete example: `stamp = "abc"`, `target = "ababc"`.

**Initial state:** `"?????"` (5 question marks)

**Step-by-step reasoning:**

1. We need to end with `"ababc"`. Look for places where the stamp could have been applied last. A stamp can only be applied last if it matches the target exactly at that position (since nothing comes after to change it).
2. Check position 0: `"ab?"` doesn't match `"abc"` ❌
3. Check position 1: `"bab"` doesn't match `"abc"` ❌
4. Check position 2: `"abc"` matches `"abc"`! ✅ This could be the last stamp.
5. Apply stamp at index 2: `"??abc"` → we get `"??abc"`, but we need `"ababc"`. So stamps must have been applied earlier at positions 0 and/or 1.
6. Now we have partial result: positions 2-4 are correct. Work backwards: what stamp could have been applied second-to-last?
7. At position 0: We need `"ab?"` but stamp is `"abc"`. The 'c' doesn't match target's 'a' at index 2, but that position already has 'c' from the last stamp! Since stamps can overwrite, as long as the stamp doesn't conflict with _already correct_ letters, it's valid.
8. Position 0: Stamp `"abc"` would give us `"ab?"` at indices 0-2. Index 2 already has 'c' (correct), so this works! The stamp's 'c' overwrites what was there, but since we end with 'c' anyway, it's fine.
9. After stamp at position 0: `"ab???"` → `"abc??"` (from stamp) → but wait, we need to track what's actually visible. Since position 2 gets 'c' from this stamp, and later position 2 gets 'c' again from the last stamp, the final visible letter is 'c'.
10. Actually, let's think more systematically: We need to work **backwards**. Start from the final target and "un-stamp" sections that match the stamp pattern, allowing wildcards for positions that will be overwritten later.

The key insight: **Work backwards from the target, finding positions where the stamp could have been applied based on what letters are already correct or will be overwritten later.**

## Brute Force Approach

A naive approach would try all possible sequences of stamp placements. At each step, we could try placing the stamp at every valid position, then recursively try to reach the target. This is essentially a depth-first search through all possible stamping sequences.

Why this fails:

1. The search space is enormous: there are `n - m + 1` possible positions for each stamp (where n = target length, m = stamp length), and we might need many stamps.
2. We'd need to track the current string state, which changes with each stamp.
3. The problem asks for _any_ valid sequence, not necessarily the shortest, but even finding one sequence through brute force is exponential time.

The brute force would look something like this (pseudocode):

```
function bruteForce(current, target, stamp):
    if current == target: return []
    for i from 0 to len(target)-len(stamp):
        new_state = apply_stamp(current, stamp, i)
        result = bruteForce(new_state, target, stamp)
        if result is not None:
            return [i] + result
    return None
```

This is clearly infeasible for longer strings. We need a smarter approach.

## Optimized Approach

The optimal solution uses a **reverse simulation with greedy matching**:

1. **Reverse thinking**: Instead of starting from all '?' and building toward the target, start from the target and work backward to all '?'. Each reverse stamp operation turns a segment into wildcards (representing '?').

2. **Wildcard matching**: When checking if a stamp can be placed at position i in the current state, we allow matches against:
   - Exact letters from the target that are still visible
   - Wildcards (representing positions that have been or will be overwritten)

3. **Queue-based processing**: Use a queue to process positions that might become matchable after neighboring stamps are applied. When we apply a reverse stamp, it creates new wildcards that might make adjacent positions matchable.

4. **Validation**: We need to ensure every position gets covered by at least one stamp. The reverse process continues until we either cover all positions or can't make progress.

The algorithm:

- Convert target to list of characters (mutable)
- Keep track of how many positions have been turned to wildcards
- Use a sliding window to check each position for potential stamping
- When a position matches (allowing wildcards), add it to result and convert that segment to wildcards
- Add neighboring positions to a queue to re-check
- Continue until all positions are wildcards or no progress can be made

## Optimal Solution

<div class="code-group">

```python
# Time: O(n*(n-m+1)) where n = len(target), m = len(stamp)
# Space: O(n) for the result list and processing arrays
def movesToStamp(stamp, target):
    """
    Find sequence of stamp indices to transform '?'*len(target) into target.
    Returns list of indices in reverse order (we work backwards).
    """
    m, n = len(stamp), len(target)

    # Convert to lists for mutability
    target_list = list(target)
    result = []

    # Track total number of wildcard characters
    # When this reaches n, we're done
    wildcard_count = 0

    # Keep processing until all characters become wildcards
    while wildcard_count < n:
        # Track if we made progress in this iteration
        progress = False

        # Try every possible starting position for the stamp
        for i in range(n - m + 1):
            # Skip if this position is already all wildcards
            # (but we still need to check partial matches)

            # Check if stamp can be placed here
            # It's valid if every character matches either:
            # 1. The corresponding stamp character
            # 2. A wildcard (already stamped over)
            match = True
            wildcards_in_window = 0

            # Check each character in the window
            for j in range(m):
                if target_list[i + j] == '?':
                    # Wildcard - always matches
                    wildcards_in_window += 1
                elif target_list[i + j] != stamp[j]:
                    # Mismatch with non-wildcard
                    match = False
                    break

            # If all characters match and not all are wildcards
            # (we don't want to stamp over already-complete sections)
            if match and wildcards_in_window < m:
                # This is a valid stamp position
                result.append(i)
                progress = True

                # Convert all characters in this window to wildcards
                for j in range(m):
                    if target_list[i + j] != '?':
                        target_list[i + j] = '?'
                        wildcard_count += 1

                # Break to restart checking from beginning
                # (stamping creates new opportunities)
                break

        # If we didn't make progress in this full pass, it's impossible
        if not progress:
            return []

    # We built the result in reverse order (working backwards)
    # Return it in reverse to get forward sequence
    return result[::-1]
```

```javascript
// Time: O(n*(n-m+1)) where n = target.length, m = stamp.length
// Space: O(n) for the result array and processing
function movesToStamp(stamp, target) {
  const m = stamp.length;
  const n = target.length;

  // Convert target to array for mutability
  let targetArr = target.split("");
  const result = [];

  // Count of wildcard characters
  let wildcardCount = 0;

  // Continue until all characters are wildcards
  while (wildcardCount < n) {
    let progress = false;

    // Try every possible starting position
    for (let i = 0; i <= n - m; i++) {
      // Check if stamp can be placed here
      let match = true;
      let wildcardsInWindow = 0;

      // Check each character in this window
      for (let j = 0; j < m; j++) {
        if (targetArr[i + j] === "?") {
          // Wildcard always matches
          wildcardsInWindow++;
        } else if (targetArr[i + j] !== stamp[j]) {
          // Mismatch with non-wildcard
          match = false;
          break;
        }
      }

      // Valid if all match and not all are wildcards
      if (match && wildcardsInWindow < m) {
        // Record this stamp position
        result.push(i);
        progress = true;

        // Convert to wildcards
        for (let j = 0; j < m; j++) {
          if (targetArr[i + j] !== "?") {
            targetArr[i + j] = "?";
            wildcardCount++;
          }
        }

        // Break to restart checking
        // (new wildcards may create new opportunities)
        break;
      }
    }

    // If no progress was made, solution is impossible
    if (!progress) {
      return [];
    }
  }

  // Reverse to get forward sequence
  return result.reverse();
}
```

```java
// Time: O(n*(n-m+1)) where n = target.length(), m = stamp.length()
// Space: O(n) for the result list and char array
import java.util.*;

class Solution {
    public int[] movesToStamp(String stamp, String target) {
        int m = stamp.length();
        int n = target.length();

        // Convert target to char array for mutability
        char[] targetArr = target.toCharArray();
        List<Integer> result = new ArrayList<>();

        // Count wildcards
        int wildcardCount = 0;

        // Continue until all characters are wildcards
        while (wildcardCount < n) {
            boolean progress = false;

            // Try every possible starting position
            for (int i = 0; i <= n - m; i++) {
                // Check if stamp can be placed here
                boolean match = true;
                int wildcardsInWindow = 0;

                // Check each character in this window
                for (int j = 0; j < m; j++) {
                    if (targetArr[i + j] == '?') {
                        // Wildcard always matches
                        wildcardsInWindow++;
                    } else if (targetArr[i + j] != stamp.charAt(j)) {
                        // Mismatch with non-wildcard
                        match = false;
                        break;
                    }
                }

                // Valid if all match and not all are wildcards
                if (match && wildcardsInWindow < m) {
                    // Record this stamp position
                    result.add(i);
                    progress = true;

                    // Convert to wildcards
                    for (int j = 0; j < m; j++) {
                        if (targetArr[i + j] != '?') {
                            targetArr[i + j] = '?';
                            wildcardCount++;
                        }
                    }

                    // Break to restart checking
                    // (new wildcards may create new opportunities)
                    break;
                }
            }

            // If no progress was made, solution is impossible
            if (!progress) {
                return new int[0];
            }
        }

        // Convert List<Integer> to int[] and reverse
        Collections.reverse(result);
        int[] answer = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            answer[i] = result.get(i);
        }
        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × (n - m + 1)) in the worst case, where n is the length of target and m is the length of stamp.

- In each iteration of the while loop, we might check all (n - m + 1) positions.
- Each position check takes O(m) time to compare characters.
- We might need up to O(n/m) iterations (each stamp covers m positions).
- This gives us O(n/m × (n - m + 1) × m) = O(n × (n - m + 1)).
- In practice, it's often faster because we break early when we find a match.

**Space Complexity:** O(n)

- We store the target as a mutable array of size n.
- The result list can contain up to O(n) indices (in the worst case where we stamp each position individually).
- Other variables use constant space.

## Common Mistakes

1. **Trying to work forward instead of backward**: Many candidates try to match the stamp from left to right, but this fails because later stamps overwrite earlier ones. The key insight is to work backward from the final result.

2. **Forgetting to check for progress**: Without the `progress` flag, the algorithm could get stuck in an infinite loop when no valid stamp positions remain but not all characters are wildcards yet.

3. **Not handling the "all wildcards" case correctly**: When a window contains only wildcards, we shouldn't stamp there because it doesn't actually change anything. The condition `wildcardsInWindow < m` ensures we only stamp when at least one actual character is matched.

4. **Returning the result in wrong order**: Since we build the sequence working backward, we need to reverse it at the end to get the forward sequence. Forgetting this reversal is a common oversight.

## When You'll See This Pattern

This "reverse simulation" or "undo operations" pattern appears in problems where operations have overlapping effects or where working forward is ambiguous:

1. **LeetCode 1702. Maximum Binary String After Change** - Similar reverse thinking to maximize binary strings.
2. **LeetCode 2193. Minimum Number of Moves to Make Palindrome** - Working from the ends toward the center.
3. **LeetCode 1897. Redistribute Characters to Make All Strings Equal** - Reverse thinking about character distribution.

The pattern is: when operations can overwrite or obscure previous work, consider working backward from the desired end state. This is common in "reconstruction" problems where you need to find a sequence of operations that leads to a given result.

## Key Takeaways

1. **Reverse engineering is powerful**: When operations are destructive or overlapping, working backward from the final state often simplifies the problem. Each step becomes "what was the last operation that could have produced this?"

2. **Wildcards as placeholders**: Using wildcards to represent "don't care" positions is a useful technique when checking partial matches. It allows us to match patterns even when some positions have been overwritten.

3. **Greedy with validation**: The algorithm is greedy (always stamp when possible) but includes validation to ensure progress. When a greedy approach needs verification, track whether you're making actual progress toward the goal.

[Practice this problem on CodeJeet](/problem/stamping-the-sequence)
