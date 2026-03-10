---
title: "How to Solve Minimum Number of Swaps to Make the String Balanced — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Swaps to Make the String Balanced. Medium difficulty, 78.1% acceptance rate. Topics: Two Pointers, String, Stack, Greedy."
date: "2028-05-25"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-swaps-to-make-the-string-balanced",
    "two-pointers",
    "string",
    "stack",
    "medium",
  ]
---

# How to Solve Minimum Number of Swaps to Make the String Balanced

You’re given a string `s` of even length containing only `'['` and `']'` characters, with equal numbers of each. Your task is to find the **minimum number of swaps** needed to make the string balanced—meaning every opening bracket has a corresponding closing bracket in the correct order. The tricky part is that you can swap **any two characters** (not necessarily adjacent), and you need to find the minimal swaps, not just validate balance.

## Visual Walkthrough

Let’s trace through an example to build intuition. Suppose we have `s = "]]][[["`.  
We’ll use a common technique: track the balance as we scan left to right.

**Step 1 – Scan and track imbalance:**  
We maintain a `balance` counter:

- Increment for `'['`, decrement for `']'`.
- If balance goes negative, we have more closing brackets than opening ones up to that point—this indicates an unmatched `']'` that must eventually be swapped.

Scanning `"]]][[["`:

- Start: balance = 0
- `']'`: balance = -1 → first unmatched `']'`
- `']'`: balance = -2 → second unmatched `']'`
- `']'`: balance = -3 → third unmatched `']'`
- `'['`: balance = -2
- `'['`: balance = -1
- `'['`: balance = 0

**Step 2 – Understanding the swap strategy:**  
We found the **minimum balance** was -3. Each time balance goes negative, it means we have an extra `']'` before enough `'['` characters. To fix this, we need to swap one of these problematic `']'` with a later `'['`.

Key insight: The worst imbalance (most negative balance) tells us how many swaps are needed. Why? Each swap can fix two imbalances: it removes one unmatched `']'` from the front and brings forward one `'['`. In fact, the minimum swaps needed is `ceil(max_unmatched / 2)`, where `max_unmatched` is the absolute value of the most negative balance.

For our example, max imbalance = 3 → swaps = ceil(3/2) = 2.

**Step 3 – Verify with actual swaps:**  
Initial: `]]][[[`  
Swap 1: swap index 0 (`]`) with index 4 (`[`) → `[[]][]` (balanced? Not yet, but closer)  
Actually, let’s think optimally:  
We can swap the first unmatched `]` (index 0) with the last `[` (index 5): `[[][]][]` — still not balanced.  
Better: The formula works because each swap pairs up two unmatched brackets. With 3 unmatched `]`, we need 2 swaps:  
Swap 1: first `]` (index 0) with any later `[` → reduces unmatched count by 2.  
Swap 2: remaining unmatched `]` with another later `[`.  
Result: balanced string.

## Brute Force Approach

A brute force method would try all possible swap sequences, but that’s factorial complexity. A more reasonable (but still inefficient) brute force would be:

1. Generate all permutations of the string (or try all swap pairs).
2. For each permutation, check if it’s balanced using a stack.
3. Track the minimum swaps to reach any balanced permutation.

Why this fails:

- Number of permutations is huge: `n!` where `n` can be up to 10^6 in constraints (though here `n ≤ 10^6`).
- Checking balance is O(n) per permutation.
- Even trying all swap pairs is O(n²), which is too slow for large n.

We need an approach that doesn’t require exploring permutations.

## Optimized Approach

The key insight comes from observing how brackets match. As we scan left to right:

1. Maintain a `balance` counter: `+1` for `[`, `-1` for `]`.
2. Track the **most negative** balance reached during the scan. This represents the maximum “depth” of unmatched closing brackets.
3. Each swap can fix **two** unmatched brackets: we swap an unmatched `]` from the front with an unmatched `[` from the back.
4. Therefore, if `max_unmatched` is the absolute value of the most negative balance, we need `ceil(max_unmatched / 2)` swaps.

Why does this work?

- Every time balance goes negative, we have more `]` than `[` so far.
- These extra `]` must be swapped with later `[` to become balanced.
- The most negative balance tells us the maximum number of `]` that are “out of place” at any point.
- Since each swap fixes two brackets (one `]` from front, one `[` from back), we divide by 2 and round up.

This is essentially a **greedy** approach: we always swap the leftmost unmatched `]` with the rightmost unmatched `[`, which is optimal.

## Optimal Solution

Here’s the implementation based on the balance tracking insight:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minSwaps(s: str) -> int:
    """
    Calculate minimum swaps to balance a string of brackets.

    Approach:
    - Scan left to right, track balance (increment for '[', decrement for ']')
    - Track the most negative balance (max unmatched closing brackets)
    - Each swap can fix 2 unmatched brackets, so answer = ceil(max_unmatched / 2)
    """
    balance = 0
    max_unmatched = 0  # absolute value of most negative balance

    for char in s:
        if char == '[':
            balance += 1
        else:  # char == ']'
            balance -= 1

        # Update the most negative balance we've seen
        # This represents the maximum deficit of opening brackets
        if balance < 0:
            max_unmatched = max(max_unmatched, -balance)

    # Each swap fixes two unmatched brackets (one ']' from front, one '[' from back)
    # So we need ceil(max_unmatched / 2) swaps
    return (max_unmatched + 1) // 2  # Ceiling division without math.ceil
```

```javascript
// Time: O(n) | Space: O(1)
function minSwaps(s) {
  /**
   * Calculate minimum swaps to balance a string of brackets.
   *
   * Approach:
   * - Scan left to right, track balance (increment for '[', decrement for ']')
   * - Track the most negative balance (max unmatched closing brackets)
   * - Each swap can fix 2 unmatched brackets, so answer = ceil(max_unmatched / 2)
   */
  let balance = 0;
  let maxUnmatched = 0; // absolute value of most negative balance

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "[") {
      balance++;
    } else {
      // s[i] === ']'
      balance--;
    }

    // Update the most negative balance we've seen
    // This represents the maximum deficit of opening brackets
    if (balance < 0) {
      maxUnmatched = Math.max(maxUnmatched, -balance);
    }
  }

  // Each swap fixes two unmatched brackets (one ']' from front, one '[' from back)
  // So we need ceil(maxUnmatched / 2) swaps
  return Math.ceil(maxUnmatched / 2);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minSwaps(String s) {
        /**
         * Calculate minimum swaps to balance a string of brackets.
         *
         * Approach:
         * - Scan left to right, track balance (increment for '[', decrement for ']')
         * - Track the most negative balance (max unmatched closing brackets)
         * - Each swap can fix 2 unmatched brackets, so answer = ceil(max_unmatched / 2)
         */
        int balance = 0;
        int maxUnmatched = 0;  // absolute value of most negative balance

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '[') {
                balance++;
            } else {  // c == ']'
                balance--;
            }

            // Update the most negative balance we've seen
            // This represents the maximum deficit of opening brackets
            if (balance < 0) {
                maxUnmatched = Math.max(maxUnmatched, -balance);
            }
        }

        // Each swap fixes two unmatched brackets (one ']' from front, one '[' from back)
        // So we need ceil(maxUnmatched / 2) swaps
        return (maxUnmatched + 1) / 2;  // Ceiling division
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the string, performing constant-time operations for each character.

**Space Complexity:** O(1)  
We only use a few integer variables regardless of input size. No additional data structures scale with input.

## Common Mistakes

1. **Trying to actually perform swaps:** Some candidates start writing swap logic, trying to find which indices to swap. This overcomplicates the problem. The key is recognizing you only need to count swaps, not execute them.

2. **Forgetting to round up:** The formula is `ceil(max_unmatched / 2)`, not `max_unmatched / 2`. If you have 3 unmatched brackets, you need 2 swaps (ceil(3/2)=2), not 1.5 or 1.

3. **Misunderstanding the balance tracking:** The balance can go positive (more `[` than `]` so far), but we only care about negative balances. Each negative balance indicates unmatched `]` that must be swapped.

4. **Overusing a stack:** While a stack can validate balance, it doesn’t directly give the minimum swaps. Candidates might try to use stack positions to calculate swaps, which becomes complex. The balance counter approach is simpler.

## When You'll See This Pattern

This problem uses **balance tracking with greedy optimization**, a pattern common in bracket/parsing problems:

1. **Minimum Add to Make Parentheses Valid (LeetCode 921)** – Similar balance tracking, but you add brackets instead of swapping. The minimum additions equals the absolute balance at the end.

2. **Minimum Remove to Make Valid Parentheses (LeetCode 1249)** – Track balance and identify which brackets to remove. More complex due to multiple bracket types and removal instead of swapping.

3. **Valid Parenthesis String (LeetCode 678)** – Uses balance range tracking to handle wildcards. Maintains possible minimum and maximum balances.

The core pattern: when dealing with bracket matching, a simple counter often suffices instead of a full stack, especially when you only need to quantify imbalance rather than fix specific positions.

## Key Takeaways

1. **Balance counter over stack for counting problems:** When you only need to quantify imbalance (not fix specific positions), a simple integer counter is often more efficient than maintaining a stack.

2. **Greedy swaps are optimal:** For bracket balancing with swaps, the optimal strategy is to always pair the leftmost unmatched closing bracket with the rightmost unmatched opening bracket. This leads to the `ceil(max_unmatched/2)` formula.

3. **Look for mathematical formulas:** Many "minimum operations" problems have closed-form solutions based on counting certain properties (like maximum imbalance). Always check if a formula exists before implementing complex simulation.

Related problems: [Remove Invalid Parentheses](/problem/remove-invalid-parentheses), [Minimum Add to Make Parentheses Valid](/problem/minimum-add-to-make-parentheses-valid), [Minimum Remove to Make Valid Parentheses](/problem/minimum-remove-to-make-valid-parentheses)
