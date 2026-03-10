---
title: "How to Solve Check If String Is Transformable With Substring Sort Operations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Check If String Is Transformable With Substring Sort Operations. Hard difficulty, 51.1% acceptance rate. Topics: String, Greedy, Sorting."
date: "2026-04-09"
category: "dsa-patterns"
tags:
  [
    "check-if-string-is-transformable-with-substring-sort-operations",
    "string",
    "greedy",
    "sorting",
    "hard",
  ]
---

# How to Solve "Check If String Is Transformable With Substring Sort Operations"

This problem asks whether we can transform string `s` into string `t` by repeatedly selecting any non-empty substring of `s` and sorting its characters in ascending order. The challenge lies in understanding what transformations are actually possible with this operation. At first glance, it might seem like we can rearrange characters arbitrarily, but sorting substrings imposes subtle constraints on how characters can move relative to each other.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `s = "84532"` and `t = "34852"`. Can we transform `s` to `t`?

**Operation mechanics**: When we sort a substring, all characters in that substring get rearranged into ascending order. This means:

- Characters can only move left or right within the substring being sorted
- After sorting, the substring becomes sorted in ascending order
- This operation doesn't create or destroy characters, just rearranges them

Let's try to transform `s = "84532"` to `t = "34852"`:

1. In `t`, the first character is '3'. In `s`, '3' is at position 4 (0-indexed). For '3' to reach position 0, it must move left past '5', '2', and the other characters. But can it?

2. Key insight: A character can only move left if all characters to its left (in the substring being sorted) are smaller than or equal to it. When we sort, smaller characters bubble to the left.

3. For '3' to move left past '5': This is impossible because '5' > '3'. When sorting any substring containing both '3' and '5', '3' will always end up to the left of '5' (since 3 < 5). So '3' can never be to the right of '5' after any sequence of operations.

4. Check systematically: In `s`, '3' has '5' to its left. Since '5' > '3', '3' can never move left past '5'. Therefore, '3' can never reach the first position in `t`.

Thus `s = "84532"` cannot be transformed to `t = "34852"`.

Now consider `s = "4321"` and `t = "1234"`:

- '1' is at position 3 in `s`. To reach position 0, it must move left past '2', '3', and '4'.
- '1' < '2', '1' < '3', '1' < '4' — all characters to its left are larger, so '1' can move left past all of them.
- Similarly for '2', '3', and '4' — each can move left past larger characters.
- This transformation is possible.

## Brute Force Approach

A naive approach might try to simulate all possible sequences of substring sort operations. We could:

1. Generate all possible substrings of `s`
2. For each substring, sort it and check if we get closer to `t`
3. Use BFS/DFS to explore the state space

However, this approach is completely infeasible:

- The number of possible substrings is O(n²)
- Each operation creates a new string state
- The state space grows exponentially
- For n=10, there are already billions of possible states

Even with pruning, this approach would be far too slow for the constraints (strings up to length 10^5). We need a more analytical approach that doesn't simulate operations.

## Optimized Approach

The key insight is that **characters can only move left past larger characters, and right past smaller characters**. More formally:

1. For each digit d (0-9), we can track its positions in `s`
2. To transform `s` to `t`, we process `t` from left to right
3. For the current character in `t` (say digit d), we need to find the leftmost occurrence of d in `s` that hasn't been used yet
4. Before moving this d to the current position, we must check: are there any smaller digits (0 to d-1) to its left in `s`?
   - If yes, then d cannot move left past them (since smaller digits would end up to the left when sorting)
   - Therefore, transformation is impossible

Why does this work? When we sort a substring containing d and a smaller digit x, x will always end up to the left of d (since x < d). So d can never move left past x. Conversely, d can move left past larger digits because when sorting, d (being smaller) would end up to the left.

Algorithm outline:

1. For each digit 0-9, maintain a queue of indices where that digit appears in `s`
2. Iterate through `t` from left to right:
   - Let current digit be `d = t[i]`
   - If queue for digit `d` is empty, return false (not enough `d`s in `s`)
   - Get the first occurrence of `d` in `s`: `pos = queues[d][0]`
   - Check if any digit smaller than `d` has an occurrence before `pos`
   - If yes, return false (d cannot move left past smaller digits)
   - Otherwise, remove this position from queue (we've "used" this `d`)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of strings
# Space: O(n) for storing positions
def isTransformable(s: str, t: str) -> bool:
    # Store positions of each digit (0-9) in s
    # We'll use lists as queues (append to end, pop from front)
    positions = [[] for _ in range(10)]

    # Populate positions from right to left so we can use pop() efficiently
    # This way, the last position for each digit will be the leftmost unused one
    for i in range(len(s) - 1, -1, -1):
        digit = int(s[i])
        positions[digit].append(i)

    # Check each character in t from left to right
    for ch in t:
        digit = int(ch)

        # If no more occurrences of this digit in s, transformation impossible
        if not positions[digit]:
            return False

        # Get the leftmost unused position of this digit
        pos = positions[digit][-1]

        # Check if any smaller digit (0 to digit-1) appears before this position
        # If yes, then current digit cannot move left past the smaller digit
        for smaller in range(digit):
            # positions[smaller] will have positions in decreasing order
            # So positions[smaller][-1] is the leftmost unused position of 'smaller'
            if positions[smaller] and positions[smaller][-1] < pos:
                return False

        # This position is valid, remove it (we've used this occurrence)
        positions[digit].pop()

    return True
```

```javascript
// Time: O(n) where n is length of strings
// Space: O(n) for storing positions
function isTransformable(s, t) {
  // Store positions of each digit (0-9) in s
  // We'll use arrays as stacks (push to end, pop from end)
  const positions = Array.from({ length: 10 }, () => []);

  // Populate positions from right to left
  // This way, the last position for each digit will be the leftmost unused one
  for (let i = s.length - 1; i >= 0; i--) {
    const digit = parseInt(s[i]);
    positions[digit].push(i);
  }

  // Check each character in t from left to right
  for (let i = 0; i < t.length; i++) {
    const digit = parseInt(t[i]);

    // If no more occurrences of this digit in s, transformation impossible
    if (positions[digit].length === 0) {
      return false;
    }

    // Get the leftmost unused position of this digit
    const pos = positions[digit][positions[digit].length - 1];

    // Check if any smaller digit (0 to digit-1) appears before this position
    // If yes, then current digit cannot move left past the smaller digit
    for (let smaller = 0; smaller < digit; smaller++) {
      // positions[smaller] will have positions in decreasing order
      // So last element is the leftmost unused position of 'smaller'
      if (
        positions[smaller].length > 0 &&
        positions[smaller][positions[smaller].length - 1] < pos
      ) {
        return false;
      }
    }

    // This position is valid, remove it (we've used this occurrence)
    positions[digit].pop();
  }

  return true;
}
```

```java
// Time: O(n) where n is length of strings
// Space: O(n) for storing positions
class Solution {
    public boolean isTransformable(String s, String t) {
        // Store positions of each digit (0-9) in s
        // Use ArrayDeque for efficient removal from front, but we'll add from back
        List<Deque<Integer>> positions = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            positions.add(new ArrayDeque<>());
        }

        // Populate positions from right to left
        // This way, the first position in deque will be the leftmost unused one
        for (int i = s.length() - 1; i >= 0; i--) {
            int digit = s.charAt(i) - '0';
            positions.get(digit).addFirst(i); // Add to front to maintain left-to-right order
        }

        // Check each character in t from left to right
        for (int i = 0; i < t.length(); i++) {
            int digit = t.charAt(i) - '0';

            // If no more occurrences of this digit in s, transformation impossible
            if (positions.get(digit).isEmpty()) {
                return false;
            }

            // Get the leftmost unused position of this digit
            int pos = positions.get(digit).peekFirst();

            // Check if any smaller digit (0 to digit-1) appears before this position
            // If yes, then current digit cannot move left past the smaller digit
            for (int smaller = 0; smaller < digit; smaller++) {
                if (!positions.get(smaller).isEmpty() &&
                    positions.get(smaller).peekFirst() < pos) {
                    return false;
                }
            }

            // This position is valid, remove it (we've used this occurrence)
            positions.get(digit).removeFirst();
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the position arrays: O(n) to iterate through `s`
- Processing `t`: O(n) iterations
- For each character in `t`, we check up to 9 smaller digits (constant time)
- Total: O(n) + O(n \* 9) = O(n)

**Space Complexity: O(n)**

- We store positions for each digit: at most n positions total across all 10 arrays
- Additional O(1) space for variables
- Total: O(n)

The constant factor of 10 comes from checking digits 0-9, but since this is constant, it doesn't affect the asymptotic complexity.

## Common Mistakes

1. **Assuming any permutation is possible**: The biggest mistake is thinking substring sort operations allow arbitrary rearrangements. Candidates often miss the constraint that smaller digits can never end up to the right of larger digits after sorting.

2. **Wrong direction of comparison**: Checking if larger digits are to the left instead of smaller digits. Remember: a digit `d` cannot move left past any digit smaller than `d`. It's the smaller digits that block movement, not larger ones.

3. **Not handling multiple occurrences correctly**: When a digit appears multiple times in `s`, we must use the leftmost available occurrence that hasn't been "consumed" yet. Using any occurrence can lead to incorrect results.

4. **Forgetting to check character counts first**: While our solution implicitly checks this (empty queue means no more occurrences), some implementations might miss this edge case. If `s` and `t` don't have the same multiset of characters, transformation is impossible.

## When You'll See This Pattern

This problem uses a **greedy matching with constraints** pattern combined with **position tracking**. Similar patterns appear in:

1. **"Create Maximum Number" (LeetCode 321)**: Also involves selecting digits from arrays with ordering constraints, though with different rules.

2. **"Remove K Digits" (LeetCode 402)**: Uses monotonic stack to ensure digits appear in correct relative order while minimizing result.

3. **"Smallest Subsequence of Distinct Characters" (LeetCode 1081)**: Similar greedy approach with last occurrence tracking to ensure all characters can be included.

The core technique is tracking positions/indices of elements and processing target order while checking constraints on element movement or selection.

## Key Takeaways

1. **Understand operation constraints deeply**: Before coding, analyze what transformations are actually possible. For sorting operations, focus on relative ordering constraints rather than trying to simulate all possibilities.

2. **Greedy left-to-right matching often works**: When transforming one sequence to another with constraints, processing target order from left to right and matching with the earliest valid source element is a common pattern.

3. **Position tracking beats simulation**: For problems where elements move according to rules, tracking where elements start and checking if they can reach their destinations is more efficient than simulating all moves.

[Practice this problem on CodeJeet](/problem/check-if-string-is-transformable-with-substring-sort-operations)
