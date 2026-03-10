---
title: "How to Solve Bulb Switcher II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Bulb Switcher II. Medium difficulty, 49.9% acceptance rate. Topics: Math, Bit Manipulation, Depth-First Search, Breadth-First Search."
date: "2029-05-08"
category: "dsa-patterns"
tags: ["bulb-switcher-ii", "math", "bit-manipulation", "depth-first-search", "medium"]
---

# How to Solve Bulb Switcher II

This problem asks us to determine how many different possible light bulb patterns can be created after performing exactly `m` button presses on `n` bulbs, starting from all bulbs ON. The challenge lies in recognizing that button presses have overlapping effects and the order doesn't matter—only which buttons are pressed an odd number of times matters. This makes the problem fundamentally about understanding the mathematical properties of the operations rather than simulating all possibilities.

## Visual Walkthrough

Let's trace through a small example with `n = 3` bulbs and `m = 1` press to build intuition. Initially, all bulbs are ON: `[1, 1, 1]` (where 1 = ON, 0 = OFF).

With exactly 1 press, we have 4 options:

1. **Button 1 (Flip all):** `[1,1,1] → [0,0,0]`
2. **Button 2 (Flip even):** `[1,1,1] → [1,0,1]` (bulb 2 is even-indexed in 1-based)
3. **Button 3 (Flip odd):** `[1,1,1] → [0,1,0]` (bulbs 1 and 3 are odd-indexed)
4. **Button 4 (Flip 3k+1):** `[1,1,1] → [0,1,1]` (bulb 1 is 3×0+1 = 1)

So for `n=3, m=1`, we get 4 distinct states: `[0,0,0]`, `[1,0,1]`, `[0,1,0]`, and `[0,1,1]`.

Now consider `n=3, m=2`. Instead of simulating all 4² = 16 sequences, notice that pressing the same button twice cancels out. Also, some button combinations are equivalent:

- Buttons 1+2 = Button 3 (flipping all and even leaves odd bulbs flipped)
- Buttons 1+3 = Button 2
- Buttons 2+3 = Button 1
- Buttons 1+4 and 2+4 and 3+4 produce unique patterns

This cancellation and equivalence is the key insight: we only need to consider which buttons are pressed an odd number of times.

## Brute Force Approach

A naive approach would be to simulate all possible sequences of `m` button presses. With 4 buttons and `m` presses, there are 4^m possible sequences. For each sequence, we could:

1. Start with all bulbs ON
2. Apply each button press in sequence
3. Record the final state
4. Count unique states

The simulation for each sequence would take O(n) time for buttons 1, 2, and 3, and O(n/3) for button 4. With 4^m sequences, this becomes O(4^m × n), which is exponential in `m`. Even for moderate `m` (like 20), 4²⁰ ≈ 1 trillion operations is infeasible.

The brute force fails because it doesn't recognize that:

1. Order doesn't matter (buttons commute)
2. Pressing a button twice cancels (each button is its own inverse)
3. Many button combinations produce identical results

## Optimized Approach

The key insight is that each button press is a **toggle operation** (XOR with a mask), and since toggling twice returns to the original state, we only care about whether each button is pressed an odd or even number of times. With 4 buttons, there are only 2⁴ = 16 possible "odd/even" patterns for button presses.

However, not all 16 patterns are achievable with exactly `m` presses (the total number of odd-count buttons must have the same parity as `m`). Also, some patterns produce identical bulb states due to button equivalences.

Let's analyze the operations mathematically:

- **Button 1:** Toggles all bulbs → mask = 111...111
- **Button 2:** Toggles even bulbs → mask = 010...010 (pattern repeats every 2)
- **Button 3:** Toggles odd bulbs → mask = 101...101 (pattern repeats every 2)
- **Button 4:** Toggles bulbs 1,4,7,... → mask = 100...100 (pattern repeats every 3)

Notice that Button 3 = Button 1 ⊕ Button 2 (XOR of their masks). This means any combination of buttons can be reduced to at most 4 independent operations, but actually only 3 are independent since button 3 is redundant.

The critical observation: **For n ≥ 3 and m ≥ 3, there are at most 8 possible states.** Why?

1. The first 3 bulbs determine the entire pattern (due to repetition periods of 2 and 3)
2. With enough presses (m ≥ 3), we can achieve all possible combinations of the first 3 bulbs
3. The LCM of repetition periods (2 and 3) is 6, but the first 3 bulbs already capture all information

We can approach this by:

1. Handling small `n` and `m` cases separately
2. Recognizing that for larger `n` and `m`, the answer depends only on `m`
3. Using the fact that buttons 1, 2, and 4 are independent generators

## Optimal Solution

The optimal solution uses case analysis based on `n` and `m`:

1. If `m == 0`: Only 1 state (all ON)
2. If `n == 1`: At most 2 states (ON/OFF)
3. If `n == 2`: Limited possibilities based on `m`
4. If `n >= 3`:
   - If `m == 1`: 4 states
   - If `m == 2`: 7 states (all except the state where all are OFF with exactly 2 presses)
   - If `m >= 3`: 8 states

This comes from analyzing which of the 8 possible patterns of the first 3 bulbs are achievable with exactly `m` presses.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def flipLights(n: int, m: int) -> int:
    """
    Returns the number of possible bulb states after exactly m button presses.

    The key insight is that only the first 3 bulbs matter (for n >= 3),
    and the answer depends on m in a predictable way due to button equivalences.
    """
    # Handle edge cases
    if m == 0:
        # No presses, only the initial state (all ON)
        return 1

    if n == 1:
        # With 1 bulb, we can only toggle it (button 1 or 3 or 4)
        # Minimum 1 press gives 2 states: ON or OFF
        return 2

    if n == 2:
        # With 2 bulbs and m == 1: 3 states (all OFF, even OFF, odd OFF)
        # With 2 bulbs and m >= 2: 4 states (all combinations achievable)
        return 3 if m == 1 else 4

    # For n >= 3
    if m == 1:
        # With 1 press: 4 possible states (each button gives unique pattern)
        return 4
    elif m == 2:
        # With 2 presses: 7 states (all 8 patterns except one)
        # The missing pattern is all OFF with exactly 2 presses
        return 7
    else:
        # With 3 or more presses: all 8 patterns are achievable
        return 8
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Returns the number of possible bulb states after exactly m button presses.
 * The solution uses case analysis based on n and m values.
 */
function flipLights(n, m) {
  // No presses means only the initial state
  if (m === 0) return 1;

  // With 1 bulb, we can toggle it to get 2 states
  if (n === 1) return 2;

  // With 2 bulbs
  if (n === 2) {
    // m == 1: 3 achievable states
    // m >= 2: all 4 states achievable
    return m === 1 ? 3 : 4;
  }

  // For n >= 3 bulbs
  if (m === 1) {
    // Each of the 4 buttons gives a unique pattern
    return 4;
  } else if (m === 2) {
    // 7 out of 8 possible patterns are achievable
    // The all-OFF state requires 3 presses when n >= 3
    return 7;
  } else {
    // With 3 or more presses, all 8 patterns are achievable
    return 8;
  }
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Returns the number of possible bulb states after exactly m button presses.
     * Uses mathematical analysis of button operations and their equivalences.
     */
    public int flipLights(int n, int m) {
        // Edge case: no presses
        if (m == 0) return 1;

        // Special cases for small n
        if (n == 1) {
            // Single bulb can be ON or OFF
            return 2;
        }

        if (n == 2) {
            // Two bulbs: with 1 press, 3 states; with more presses, 4 states
            return m == 1 ? 3 : 4;
        }

        // General case for n >= 3
        if (m == 1) {
            // One press: each button gives unique pattern
            return 4;
        } else if (m == 2) {
            // Two presses: all patterns except all-OFF with exactly 2 presses
            return 7;
        } else {
            // Three or more presses: all 8 patterns achievable
            return 8;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- The solution uses only conditional checks and arithmetic operations
- No loops or recursion regardless of input size
- All operations execute in constant time

**Space Complexity:** O(1)

- Only a few integer variables are used
- No data structures that grow with input size
- Memory usage is constant regardless of n or m

The constant-time complexity comes from the mathematical insight that reduces the problem to simple case analysis, avoiding any simulation or enumeration of states.

## Common Mistakes

1. **Simulating all sequences:** Attempting to generate all 4^m button sequences and simulate them. This is exponential in m and times out for m > 10. Remember: when operations commute and are self-inverse, only the parity matters.

2. **Missing the n < 3 cases:** The pattern changes for n = 1 and n = 2. For n = 1, button 2 and 3 have no effect. For n = 2, button 4 only affects the first bulb. Always test small cases separately.

3. **Incorrect parity reasoning:** Thinking all 16 button parity patterns are possible. Actually, with exactly m presses, the number of odd-count buttons must have the same parity as m. Also, some parity patterns produce identical bulb states.

4. **Overcomplicating with BFS/DFS:** Some candidates try BFS over states, but with n up to 1000 and m up to 1000, the state space is 2^1000 which is impossible. Recognize when a problem is mathematical rather than algorithmic.

## When You'll See This Pattern

This problem teaches **operation analysis with symmetries and invariants**, which appears in:

1. **Bulb Switcher (LeetCode 319):** Also about bulb toggling, but focuses on perfect squares. Both problems reduce to mathematical patterns rather than simulation.

2. **Number of Times Binary String Is Prefix-Aligned (LeetCode 1375):** Involves tracking state changes and recognizing when certain conditions are met. Requires thinking about cumulative effects of operations.

3. **Minimum Operations to Make Array Equal (LeetCode 1551):** Another problem where mathematical analysis beats simulation. Operations have symmetries that simplify the problem.

The pattern to recognize: when operations are **commutative** and **self-inverse** (applying twice cancels), and especially when they affect elements in **periodic patterns**, look for mathematical reductions rather than simulation.

## Key Takeaways

1. **Look for operation equivalences:** When operations commute and are self-inverse, only parity matters. This reduces exponential possibilities to a manageable set.

2. **Small cases reveal patterns:** Analyzing n=1,2,3 and m=0,1,2,3 often reveals the general pattern. Don't jump straight to coding—work through examples.

3. **Periodicity simplifies analysis:** When operations repeat with periods (like every 2nd or 3rd element), the entire system state may be determined by a small prefix. Look for LCM of periods.

Related problems: [Bulb Switcher](/problem/bulb-switcher), [Number of Times Binary String Is Prefix-Aligned](/problem/number-of-times-binary-string-is-prefix-aligned)
