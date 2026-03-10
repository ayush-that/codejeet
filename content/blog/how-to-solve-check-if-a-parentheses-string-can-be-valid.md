---
title: "How to Solve Check if a Parentheses String Can Be Valid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if a Parentheses String Can Be Valid. Medium difficulty, 45.1% acceptance rate. Topics: String, Stack, Greedy."
date: "2026-08-19"
category: "dsa-patterns"
tags: ["check-if-a-parentheses-string-can-be-valid", "string", "stack", "greedy", "medium"]
---

# How to Solve "Check if a Parentheses String Can Be Valid"

This problem asks us to determine if a parentheses string can be made valid by swapping adjacent characters any number of times. The twist is that we can only swap characters at positions where both characters are different. This constraint makes the problem more interesting than typical parentheses validation problems, as we need to consider both the balance of parentheses and which positions can actually be modified through swaps.

## Visual Walkthrough

Let's trace through an example: `s = "))(()("` and `locked = "110100"`

We have:

- String: `) ) ( ( ) (`
- Locked: `1 1 0 1 0 0` (1 means locked, 0 means unlocked)

We need to check if we can make this a valid parentheses string through swaps of adjacent characters, but only when they're different AND at least one is unlocked.

**Step-by-step reasoning:**

1. First, check the basic requirement: the string must have equal numbers of '(' and ')'. Here we have 3 '(' and 3 ')', so this passes.

2. Now we need to check if we can arrange them properly. Think of it as: we need every prefix to have at least as many '(' as ')', and the total must balance.

3. Let's simulate:
   - Position 0: `)` locked - we start with a deficit of 1
   - Position 1: `)` locked - deficit becomes 2
   - Position 2: `(` unlocked - we can potentially use this to fix the deficit
   - Position 3: `(` locked - we now have more opening, deficit reduces to 1
   - Position 4: `)` unlocked - we can potentially swap this
   - Position 5: `(` unlocked - we can potentially swap this

4. The key insight: We need to track both the minimum and maximum possible balance as we process the string. The minimum represents the worst-case scenario (most closing parentheses), and the maximum represents the best-case scenario (most opening parentheses).

5. For a valid string:
   - Final balance must be 0
   - At no point can the minimum balance be negative (this would mean we have too many closing parentheses that can't be fixed)

## Brute Force Approach

A brute force approach would try all possible sequences of swaps. However, this is extremely inefficient:

- For a string of length n, there are n-1 possible adjacent pairs to swap
- We could perform swaps in any order, leading to factorial complexity
- Even checking all possible arrangements would be O(2^n) since each position could be '(' or ')'

The brute force is clearly infeasible for the constraints (n ≤ 10^5). We need a smarter approach that doesn't actually simulate swaps but instead checks if a valid arrangement is possible.

## Optimized Approach

The key insight is that we don't need to simulate actual swaps. Instead, we can track the range of possible balances (minimum and maximum) as we process the string:

1. **Balance tracking**:
   - When we see '(', the balance increases by 1
   - When we see ')', the balance decreases by 1

2. **Locked vs unlocked positions**:
   - If a position is locked, we must use its current character
   - If a position is unlocked, we can choose to treat it as either '(' or ')'

3. **Minimum and maximum balance**:
   - Minimum balance: worst-case scenario (treat all unlocked as ')')
   - Maximum balance: best-case scenario (treat all unlocked as '(')
4. **Validation rules**:
   - At any point, minimum balance cannot be negative (can't have too many closing parentheses)
   - At the end, minimum balance must be 0 (must be able to achieve perfect balance)

The algorithm:

1. Initialize minBalance = 0, maxBalance = 0
2. For each character in the string:
   - If locked: adjust min and max based on the fixed character
   - If unlocked: min can decrease (if we choose ')'), max can increase (if we choose '(')
3. Keep minBalance non-negative (if it goes negative, we can increase it by treating some unlocked as '(')
4. At the end, check if 0 is within [minBalance, maxBalance]

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canBeValid(s: str, locked: str) -> bool:
    """
    Check if a parentheses string can be made valid by swapping adjacent characters.

    Args:
        s: The parentheses string
        locked: String where '1' means locked, '0' means unlocked

    Returns:
        bool: True if the string can be made valid, False otherwise
    """
    n = len(s)

    # First basic check: length must be even for valid parentheses
    if n % 2 == 1:
        return False

    # Track the range of possible balances
    # min_balance: worst-case (most closing parentheses)
    # max_balance: best-case (most opening parentheses)
    min_balance = 0
    max_balance = 0

    for i in range(n):
        if locked[i] == '1':  # Position is locked
            if s[i] == '(':
                # Locked opening parenthesis always increases balance
                min_balance += 1
                max_balance += 1
            else:  # s[i] == ')'
                # Locked closing parenthesis always decreases balance
                min_balance -= 1
                max_balance -= 1
        else:  # Position is unlocked
            # Unlocked position can be either '(' or ')'
            # For min_balance: treat as ')' to minimize
            # For max_balance: treat as '(' to maximize
            min_balance -= 1
            max_balance += 1

        # Critical: min_balance cannot be negative
        # If it goes negative, we must have treated some unlocked as ')'
        # that should have been '('. We can fix this by converting
        # some ')' to '(' among the unlocked positions.
        if min_balance < 0:
            min_balance += 2  # Convert one ')' to '('

        # If max_balance goes negative, it's impossible to be valid
        # (too many locked closing parentheses)
        if max_balance < 0:
            return False

    # At the end, we must be able to achieve balance 0
    # This means 0 must be within our possible balance range
    return min_balance == 0
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if a parentheses string can be made valid by swapping adjacent characters.
 * @param {string} s - The parentheses string
 * @param {string} locked - String where '1' means locked, '0' means unlocked
 * @return {boolean} True if the string can be made valid, False otherwise
 */
function canBeValid(s, locked) {
  const n = s.length;

  // First basic check: length must be even for valid parentheses
  if (n % 2 === 1) {
    return false;
  }

  // Track the range of possible balances
  // minBalance: worst-case (most closing parentheses)
  // maxBalance: best-case (most opening parentheses)
  let minBalance = 0;
  let maxBalance = 0;

  for (let i = 0; i < n; i++) {
    if (locked[i] === "1") {
      // Position is locked
      if (s[i] === "(") {
        // Locked opening parenthesis always increases balance
        minBalance++;
        maxBalance++;
      } else {
        // s[i] === ')'
        // Locked closing parenthesis always decreases balance
        minBalance--;
        maxBalance--;
      }
    } else {
      // Position is unlocked
      // Unlocked position can be either '(' or ')'
      // For minBalance: treat as ')' to minimize
      // For maxBalance: treat as '(' to maximize
      minBalance--;
      maxBalance++;
    }

    // Critical: minBalance cannot be negative
    // If it goes negative, we must have treated some unlocked as ')'
    // that should have been '('. We can fix this by converting
    // some ')' to '(' among the unlocked positions.
    if (minBalance < 0) {
      minBalance += 2; // Convert one ')' to '('
    }

    // If maxBalance goes negative, it's impossible to be valid
    // (too many locked closing parentheses)
    if (maxBalance < 0) {
      return false;
    }
  }

  // At the end, we must be able to achieve balance 0
  // This means 0 must be within our possible balance range
  return minBalance === 0;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if a parentheses string can be made valid by swapping adjacent characters.
     * @param s The parentheses string
     * @param locked String where '1' means locked, '0' means unlocked
     * @return True if the string can be made valid, False otherwise
     */
    public boolean canBeValid(String s, String locked) {
        int n = s.length();

        // First basic check: length must be even for valid parentheses
        if (n % 2 == 1) {
            return false;
        }

        // Track the range of possible balances
        // minBalance: worst-case (most closing parentheses)
        // maxBalance: best-case (most opening parentheses)
        int minBalance = 0;
        int maxBalance = 0;

        for (int i = 0; i < n; i++) {
            if (locked.charAt(i) == '1') {  // Position is locked
                if (s.charAt(i) == '(') {
                    // Locked opening parenthesis always increases balance
                    minBalance++;
                    maxBalance++;
                } else {  // s.charAt(i) == ')'
                    // Locked closing parenthesis always decreases balance
                    minBalance--;
                    maxBalance--;
                }
            } else {  // Position is unlocked
                // Unlocked position can be either '(' or ')'
                // For minBalance: treat as ')' to minimize
                // For maxBalance: treat as '(' to maximize
                minBalance--;
                maxBalance++;
            }

            // Critical: minBalance cannot be negative
            // If it goes negative, we must have treated some unlocked as ')'
            // that should have been '('. We can fix this by converting
            // some ')' to '(' among the unlocked positions.
            if (minBalance < 0) {
                minBalance += 2;  // Convert one ')' to '('
            }

            // If maxBalance goes negative, it's impossible to be valid
            // (too many locked closing parentheses)
            if (maxBalance < 0) {
                return false;
            }
        }

        // At the end, we must be able to achieve balance 0
        // This means 0 must be within our possible balance range
        return minBalance == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the string of length n
- Each iteration performs constant-time operations (comparisons, additions)
- No nested loops or recursive calls

**Space Complexity:** O(1)

- We only use a fixed number of integer variables (minBalance, maxBalance)
- No additional data structures that scale with input size
- The input strings are not counted in the space complexity as they're given

## Common Mistakes

1. **Forgetting the length check**: A valid parentheses string must have even length. This is a quick early exit condition that candidates often miss.

2. **Not handling the minBalance adjustment properly**: When minBalance goes negative, we need to add 2 (not 1) because converting a ')' to '(' changes the balance by +2 (from -1 to +1).

3. **Checking only the final balance**: Candidates sometimes check only if the final balance can be 0, but forget to ensure that the balance never goes negative during processing. A string like `"))(("` has final balance 0 but is invalid because the prefix `"))"` has negative balance.

4. **Overcomplicating with actual swap simulation**: Some candidates try to actually simulate swaps or use BFS/DFS to explore all possibilities, which is exponential time and fails on large inputs.

## When You'll See This Pattern

This "balance range tracking" pattern appears in several parentheses validation problems:

1. **Valid Parenthesis String (LeetCode 678)**: Similar concept of tracking min/max possible balances when you have wildcards ('\*') that can be empty, '(', or ')'.

2. **Minimum Add to Make Parentheses Valid (LeetCode 921)**: Uses balance tracking to find how many parentheses need to be added.

3. **Minimum Remove to Make Parentheses Valid (LeetCode 1249)**: Tracks balance to identify which parentheses to remove.

The pattern is useful whenever you have flexibility in how parentheses can be interpreted (wildcards, swaps, additions, removals) and need to check validity.

## Key Takeaways

1. **Think in ranges, not exact values**: When there's flexibility (unlocked positions, wildcards), track the minimum and maximum possible states rather than trying all combinations.

2. **Balance is key for parentheses problems**: The concept of "balance" (number of '(' minus number of ')') is fundamental to most parentheses validation problems.

3. **Prefix constraints matter**: For parentheses to be valid, every prefix must have non-negative balance (or within some allowable range). Don't just check the final total.

Related problems: [Valid Parentheses](/problem/valid-parentheses), [Generate Parentheses](/problem/generate-parentheses), [Valid Parenthesis String](/problem/valid-parenthesis-string)
