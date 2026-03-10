---
title: "How to Solve Design an ATM Machine — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design an ATM Machine. Medium difficulty, 44.6% acceptance rate. Topics: Array, Greedy, Design."
date: "2029-02-20"
category: "dsa-patterns"
tags: ["design-an-atm-machine", "array", "greedy", "design", "medium"]
---

# How to Solve "Design an ATM Machine"

This problem asks you to design an ATM machine that handles deposits and withdrawals of banknotes in denominations of 20, 50, 100, 200, and 500 dollars. The tricky part is implementing withdrawals where the machine must prioritize larger banknotes while ensuring it can actually dispense the requested amount with available notes. This tests your ability to design a clean class structure while implementing greedy logic with careful edge case handling.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Initial state:** ATM is empty → `[0, 0, 0, 0, 0]` notes for denominations `[20, 50, 100, 200, 500]`

**Step 1:** Deposit 2x500, 3x200, 1x100 → `[0, 0, 1, 3, 2]`  
Total: (2×500) + (3×200) + (1×100) = 1000 + 600 + 100 = $1700

**Step 2:** Withdraw $600

- Start with largest denomination (500): Need 1 note (500 ≤ 600), have 2 available → use 1  
  Remaining: $600 - $500 = $100, notes: `[0, 0, 1, 3, 1]`
- Next (200): Need 0 notes (200 > 100), skip
- Next (100): Need 1 note (100 ≤ 100), have 1 available → use 1  
  Remaining: $100 - $100 = $0, notes: `[0, 0, 0, 3, 1]`
- Success! Return `[0, 0, 1, 0, 1]` (1x100, 0x200, 1x500)

**Step 3:** Withdraw $550

- Start with 500: Need 1 note (500 ≤ 550), have 1 available → use 1  
  Remaining: $550 - $500 = $50, notes: `[0, 0, 0, 3, 0]`
- Next (200): Need 0 notes (200 > 50), skip
- Next (100): Need 0 notes (100 > 50), skip
- Next (50): Need 1 note (50 ≤ 50), have 0 available → FAIL
- Rollback: Return all notes, restore original state

This shows the greedy approach: always take the largest possible notes first, but we must handle insufficient funds gracefully.

## Brute Force Approach

A naive approach might try all combinations of notes to find a withdrawal that works. For each withdrawal request `amount`, we could:

1. Generate all possible combinations of available notes
2. Check which combinations sum to exactly `amount`
3. Among valid combinations, choose one with the largest notes prioritized
4. If none exist, return failure

Why this fails:

- **Exponential time**: With up to 5000 notes total (constraint), checking all combinations is O(2ⁿ)
- **Overly complex**: We don't need to check all combinations when greedy works
- **Inefficient storage**: We'd need to track many partial combinations

The brute force helps us understand the problem but isn't implementable within constraints.

## Optimized Approach

The key insight is that **greedy works for standard currency denominations** when we process from largest to smallest. This works because each larger denomination is a multiple of smaller ones (or the system is designed so greedy works for common ATM denominations).

**Step-by-step reasoning:**

1. **Store notes efficiently**: Use an array of size 5 to track counts for each denomination in fixed order `[20, 50, 100, 200, 500]`.
2. **Deposit is straightforward**: Simply add to the respective counts.
3. **Withdrawal requires greedy allocation**:
   - Start from largest denomination (500) and move downward
   - For each denomination, calculate how many notes we can use: `min(available, amount // denomination)`
   - Subtract the used notes from available and reduce the amount
   - If we reach amount = 0, success; otherwise, fail
4. **Critical: Handle rollback on failure**: Since we modify note counts during calculation, if withdrawal fails, we must restore the original counts.

**Why greedy works here**: The denominations {20, 50, 100, 200, 500} have the property that for any amount, if it can be made with available notes, the greedy approach of taking as many large notes as possible will find a solution. This isn't universally true for all denomination sets (like {1, 3, 4} for amount 6), but holds for real-world ATM systems.

## Optimal Solution

<div class="code-group">

```python
class ATM:
    # Time: O(1) for deposit, O(d) for withdraw where d=5 denominations
    # Space: O(1) fixed-size arrays

    def __init__(self):
        # Denominations in fixed order: 20, 50, 100, 200, 500
        self.denoms = [20, 50, 100, 200, 500]
        # Track count of each denomination
        self.notes = [0, 0, 0, 0, 0]

    def deposit(self, banknotesCount: List[int]) -> None:
        # Simply add deposited notes to our counts
        for i in range(5):
            self.notes[i] += banknotesCount[i]

    def withdraw(self, amount: int) -> List[int]:
        result = [0] * 5  # Track notes to dispense
        temp_notes = self.notes.copy()  # Copy for rollback if needed

        # Greedy: try largest denominations first
        for i in range(4, -1, -1):  # Start from 500 (index 4) down to 20 (index 0)
            denom = self.denoms[i]
            if amount >= denom and temp_notes[i] > 0:
                # Calculate max notes we can use of this denomination
                can_take = min(temp_notes[i], amount // denom)
                result[i] = can_take
                temp_notes[i] -= can_take
                amount -= can_take * denom

        # Check if we successfully made the exact amount
        if amount == 0:
            # Success: update actual notes and return result
            self.notes = temp_otes
            return result
        else:
            # Failure: return [-1] as specified
            return [-1]
```

```javascript
// Time: O(1) for deposit, O(d) for withdraw where d=5 denominations
// Space: O(1) fixed-size arrays
class ATM {
  constructor() {
    // Denominations in fixed order: 20, 50, 100, 200, 500
    this.denoms = [20, 50, 100, 200, 500];
    // Track count of each denomination
    this.notes = [0, 0, 0, 0, 0];
  }

  deposit(banknotesCount) {
    // Add deposited notes to our counts
    for (let i = 0; i < 5; i++) {
      this.notes[i] += banknotesCount[i];
    }
  }

  withdraw(amount) {
    const result = [0, 0, 0, 0, 0]; // Track notes to dispense
    const tempNotes = [...this.notes]; // Copy for rollback if needed

    // Greedy: try largest denominations first
    for (let i = 4; i >= 0; i--) {
      // Start from 500 down to 20
      const denom = this.denoms[i];
      if (amount >= denom && tempNotes[i] > 0) {
        // Calculate max notes we can use of this denomination
        const canTake = Math.min(tempNotes[i], Math.floor(amount / denom));
        result[i] = canTake;
        tempNotes[i] -= canTake;
        amount -= canTake * denom;
      }
    }

    // Check if we successfully made the exact amount
    if (amount === 0) {
      // Success: update actual notes and return result
      this.notes = tempNotes;
      return result;
    } else {
      // Failure: return [-1] as specified
      return [-1];
    }
  }
}
```

```java
// Time: O(1) for deposit, O(d) for withdraw where d=5 denominations
// Space: O(1) fixed-size arrays
class ATM {
    private int[] denoms = {20, 50, 100, 200, 500};
    private long[] notes = new long[5];  // Use long to handle large counts

    public ATM() {
        // Arrays are initialized to 0 by default
    }

    public void deposit(int[] banknotesCount) {
        // Add deposited notes to our counts
        for (int i = 0; i < 5; i++) {
            notes[i] += banknotesCount[i];
        }
    }

    public int[] withdraw(int amount) {
        int[] result = new int[5];  // Track notes to dispense
        long[] tempNotes = notes.clone();  // Copy for rollback if needed

        // Greedy: try largest denominations first
        for (int i = 4; i >= 0; i--) {  // Start from 500 down to 20
            int denom = denoms[i];
            if (amount >= denom && tempNotes[i] > 0) {
                // Calculate max notes we can use of this denomination
                long canTake = Math.min(tempNotes[i], amount / denom);
                result[i] = (int) canTake;
                tempNotes[i] -= canTake;
                amount -= canTake * denom;
            }
        }

        // Check if we successfully made the exact amount
        if (amount == 0) {
            // Success: update actual notes and return result
            notes = tempNotes;
            return result;
        } else {
            // Failure: return [-1] as specified
            return new int[]{-1};
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `deposit()`: O(1) or more precisely O(5) since we just add to 5 fixed counters
- `withdraw()`: O(1) or O(5) since we iterate through 5 denominations in reverse order

**Space Complexity:**

- O(1) extra space beyond the stored note counts. We use:
  - Fixed arrays of size 5 for denominations and note counts
  - Temporary arrays of size 5 during withdrawal for rollback logic
  - All space usage is constant regardless of number of operations

The constant factors are small and fixed because there are only 5 denominations.

## Common Mistakes

1. **Forgetting to handle rollback on failed withdrawal**: If you modify the actual note counts during the withdrawal attempt and then discover it fails, you must restore the original state. Always use a temporary copy.

2. **Incorrect greedy direction**: Processing from smallest to largest denominations won't satisfy the "prioritize larger values" requirement. Always start from largest (500) and work downward.

3. **Integer overflow with large counts**: With constraints allowing up to 10⁴ operations and 5000 notes, the total value can exceed 32-bit integer range. Use 64-bit integers (long in Java, normal ints are fine in Python/JS).

4. **Not checking exact amount match**: After the greedy allocation, you must verify `amount == 0`. If there's any remainder, the withdrawal fails even if you used some notes.

## When You'll See This Pattern

This problem combines **greedy allocation** with **state management** patterns seen in:

1. **Coin Change (LeetCode 322)**: Similar greedy thinking for minimum coins, though that problem requires DP for arbitrary denominations.
2. **Simple Bank System (LeetCode 2043)**: Another design problem tracking balances with validation checks.
3. **Minimum Number of Operations to Convert Time (LeetCode 2224)**: Greedy approach with fixed time "denominations" (60 minutes, 15 minutes, etc.).

The core pattern is **greedy allocation with fixed denominations** where larger units are preferred. This appears in currency systems, time calculations, and resource allocation problems.

## Key Takeaways

1. **Greedy works for real-world currency systems**: When denominations are designed for greedy allocation (each larger denomination is a multiple of smaller ones or the system guarantees greedy works), you can solve allocation problems efficiently.

2. **Always handle transaction rollback**: When modifying state during a tentative operation that might fail, work on a copy first and only commit if successful.

3. **Design problems test multiple skills**: This combines class design, array manipulation, greedy algorithms, and edge case handling—practice seeing how these pieces fit together.

Related problems: [Simple Bank System](/problem/simple-bank-system), [Minimum Number of Operations to Convert Time](/problem/minimum-number-of-operations-to-convert-time)
