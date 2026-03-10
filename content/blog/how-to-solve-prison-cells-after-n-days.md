---
title: "How to Solve Prison Cells After N Days — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Prison Cells After N Days. Medium difficulty, 39.1% acceptance rate. Topics: Array, Hash Table, Math, Bit Manipulation."
date: "2026-04-30"
category: "dsa-patterns"
tags: ["prison-cells-after-n-days", "array", "hash-table", "math", "medium"]
---

# How to Solve Prison Cells After N Days

This problem presents a cellular automaton with 8 prison cells that evolve daily based on their neighbors' states. The tricky part is that N can be up to 1,000,000,000, making direct simulation impossible. The key insight is recognizing that with only 8 cells, there are only 256 possible states, so the sequence must eventually repeat, allowing us to skip most iterations.

## Visual Walkthrough

Let's trace through an example with cells = [0,1,0,1,1,0,0,1] and N = 7:

**Day 0:** [0,1,0,1,1,0,0,1]

- Cell 0 and cell 7 always become 0 (no two neighbors)
- Cell 1: neighbors 0 and 2 are 0 and 0 → both same → becomes 1
- Cell 2: neighbors 1 and 3 are 1 and 1 → both same → becomes 1
- Cell 3: neighbors 2 and 4 are 0 and 1 → different → becomes 0
- Cell 4: neighbors 3 and 5 are 1 and 0 → different → becomes 0
- Cell 5: neighbors 4 and 6 are 1 and 0 → different → becomes 0
- Cell 6: neighbors 5 and 7 are 0 and 1 → different → becomes 0

**Day 1:** [0,1,1,0,0,0,0,0]

Continuing this process:

- Day 2: [0,0,0,0,1,1,1,0]
- Day 3: [0,1,1,0,0,1,0,0]
- Day 4: [0,0,0,0,0,1,0,0]
- Day 5: [0,1,1,1,0,1,0,0]
- Day 6: [0,0,1,0,0,1,0,0]
- Day 7: [0,0,1,1,0,1,0,0]

Notice that after day 1, the first and last cells are always 0. More importantly, with only 8 cells, there are only 2^8 = 256 possible states, so the sequence must eventually repeat.

## Brute Force Approach

The brute force approach simulates each day one by one:

1. For each day from 1 to N:
   - Create a new array for the next day
   - For each cell (except first and last), check if its neighbors are both 0 or both 1
   - Update the cell accordingly
   - Set first and last cells to 0

**Why this fails:** With N up to 1,000,000,000, this O(N × 8) approach would take far too long. Even though 8 is constant, 1 billion iterations is computationally infeasible.

## Optimized Approach

The key insight is **cycle detection**. Since there are only 256 possible states (actually fewer since first and last are always 0), the sequence must repeat within at most 256 days. We can:

1. Store each state we encounter in a hash map with its day number
2. When we see a repeated state, we've found a cycle
3. Calculate the cycle length and skip ahead most of the iterations
4. Only simulate the remaining days

**Why this works:** The state space is tiny (2^8 = 256), so cycles are inevitable. Once we detect a cycle, we can use modular arithmetic to jump directly to the final state without simulating every day.

**Step-by-step reasoning:**

1. First and last cells always become 0 after day 1, so we can treat them as fixed
2. Convert the array to a more efficient representation (integer bitmask)
3. Track states in a dictionary: state → day number
4. When we see a state we've seen before, calculate:
   - Cycle start day = day when state first appeared
   - Cycle length = current day - cycle start day
   - Remaining days = (N - cycle start day) % cycle length
5. Simulate only the remaining days

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^8) = O(1) | Space: O(2^8) = O(1)
def prisonAfterNDays(cells, N):
    """
    Simulates prison cell states after N days using cycle detection.

    Args:
        cells: List[int] - Initial state of 8 prison cells
        N: int - Number of days to simulate

    Returns:
        List[int] - State after N days
    """
    # Convert list to integer bitmask for efficient manipulation
    # Each bit represents a cell (bit 0 = cell 0, bit 1 = cell 1, etc.)
    state = 0
    for i in range(8):
        if cells[i] == 1:
            state |= 1 << (7 - i)  # Set the corresponding bit

    # Dictionary to track seen states and their day numbers
    seen = {}
    day = 0

    while day < N:
        # If we've seen this state before, we found a cycle
        if state in seen:
            # Calculate cycle length and skip ahead
            cycle_length = day - seen[state]
            # Skip as many full cycles as possible
            remaining_days = (N - day) % cycle_length
            # Reset day to simulate only the remaining days
            day = N - remaining_days
            if remaining_days == 0:
                break
        else:
            # Record this state with its day number
            seen[state] = day

        # Only continue if we still have days to simulate
        if day < N:
            # Calculate next state using bit manipulation
            # For each cell, check if its neighbors are the same
            next_state = 0
            # Cells 1 through 6 (bits 1 through 6 in our representation)
            for i in range(1, 7):
                left = (state >> (7 - (i - 1))) & 1  # Get left neighbor
                right = (state >> (7 - (i + 1))) & 1  # Get right neighbor
                # If neighbors are equal (both 0 or both 1), cell becomes 1
                if left == right:
                    next_state |= 1 << (7 - i)  # Set the bit

            # Update state for next iteration
            state = next_state
            day += 1

    # Convert bitmask back to list
    result = [0] * 8
    for i in range(8):
        if state & (1 << (7 - i)):
            result[i] = 1

    return result
```

```javascript
// Time: O(2^8) = O(1) | Space: O(2^8) = O(1)
function prisonAfterNDays(cells, N) {
  /**
   * Simulates prison cell states after N days using cycle detection.
   *
   * @param {number[]} cells - Initial state of 8 prison cells
   * @param {number} N - Number of days to simulate
   * @return {number[]} - State after N days
   */

  // Convert array to integer bitmask for efficient manipulation
  let state = 0;
  for (let i = 0; i < 8; i++) {
    if (cells[i] === 1) {
      state |= 1 << (7 - i); // Set the corresponding bit
    }
  }

  // Map to track seen states and their day numbers
  const seen = new Map();
  let day = 0;

  while (day < N) {
    // If we've seen this state before, we found a cycle
    if (seen.has(state)) {
      // Calculate cycle length and skip ahead
      const cycleLength = day - seen.get(state);
      // Skip as many full cycles as possible
      const remainingDays = (N - day) % cycleLength;
      // Reset day to simulate only the remaining days
      day = N - remainingDays;
      if (remainingDays === 0) break;
    } else {
      // Record this state with its day number
      seen.set(state, day);
    }

    // Only continue if we still have days to simulate
    if (day < N) {
      // Calculate next state using bit manipulation
      let nextState = 0;
      // Cells 1 through 6 (bits 1 through 6 in our representation)
      for (let i = 1; i <= 6; i++) {
        const left = (state >> (7 - (i - 1))) & 1; // Get left neighbor
        const right = (state >> (7 - (i + 1))) & 1; // Get right neighbor
        // If neighbors are equal (both 0 or both 1), cell becomes 1
        if (left === right) {
          nextState |= 1 << (7 - i); // Set the bit
        }
      }

      // Update state for next iteration
      state = nextState;
      day++;
    }
  }

  // Convert bitmask back to array
  const result = new Array(8).fill(0);
  for (let i = 0; i < 8; i++) {
    if (state & (1 << (7 - i))) {
      result[i] = 1;
    }
  }

  return result;
}
```

```java
// Time: O(2^8) = O(1) | Space: O(2^8) = O(1)
class Solution {
    public int[] prisonAfterNDays(int[] cells, int N) {
        /**
         * Simulates prison cell states after N days using cycle detection.
         *
         * @param cells - Initial state of 8 prison cells
         * @param N - Number of days to simulate
         * @return - State after N days
         */

        // Convert array to integer bitmask for efficient manipulation
        int state = 0;
        for (int i = 0; i < 8; i++) {
            if (cells[i] == 1) {
                state |= 1 << (7 - i);  // Set the corresponding bit
            }
        }

        // Map to track seen states and their day numbers
        Map<Integer, Integer> seen = new HashMap<>();
        int day = 0;

        while (day < N) {
            // If we've seen this state before, we found a cycle
            if (seen.containsKey(state)) {
                // Calculate cycle length and skip ahead
                int cycleLength = day - seen.get(state);
                // Skip as many full cycles as possible
                int remainingDays = (N - day) % cycleLength;
                // Reset day to simulate only the remaining days
                day = N - remainingDays;
                if (remainingDays == 0) break;
            } else {
                // Record this state with its day number
                seen.put(state, day);
            }

            // Only continue if we still have days to simulate
            if (day < N) {
                // Calculate next state using bit manipulation
                int nextState = 0;
                // Cells 1 through 6 (bits 1 through 6 in our representation)
                for (int i = 1; i <= 6; i++) {
                    int left = (state >> (7 - (i - 1))) & 1;  // Get left neighbor
                    int right = (state >> (7 - (i + 1))) & 1; // Get right neighbor
                    // If neighbors are equal (both 0 or both 1), cell becomes 1
                    if (left == right) {
                        nextState |= 1 << (7 - i);  // Set the bit
                    }
                }

                // Update state for next iteration
                state = nextState;
                day++;
            }
        }

        // Convert bitmask back to array
        int[] result = new int[8];
        for (int i = 0; i < 8; i++) {
            if ((state & (1 << (7 - i))) != 0) {
                result[i] = 1;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- The number of possible states is 2^8 = 256, which is constant
- We simulate at most 256 days before detecting a cycle
- After cycle detection, we simulate at most another 256 days
- Total operations are bounded by a constant (512 iterations)

**Space Complexity:** O(1)

- We store at most 256 states in the hash map
- The bitmask representation uses constant space
- All other variables use constant space

## Common Mistakes

1. **Not handling the cycle detection correctly:** Some candidates find the cycle but fail to calculate the remaining days properly. Remember: `remaining_days = (N - cycle_start) % cycle_length`, not `N % cycle_length`.

2. **Forgetting that first and last cells become 0 after day 1:** The problem states that cells with fewer than 2 neighbors become vacant. Since cells 0 and 7 only have one neighbor each, they always become 0 after the first day.

3. **Using array operations instead of bit manipulation:** While arrays work, bit manipulation is more efficient and elegant. The key insight is treating the 8 cells as an 8-bit integer.

4. **Off-by-one errors in neighbor checking:** When checking neighbors at position i, remember to check i-1 and i+1. Also, be careful with array bounds - we only update cells 1 through 6.

## When You'll See This Pattern

This cycle detection pattern appears in problems with:

- A finite state space
- Deterministic transitions
- Large numbers of iterations

Related LeetCode problems:

1. **Happy Number (202):** Detects cycles in digit square sums
2. **Linked List Cycle II (142):** Uses Floyd's algorithm for cycle detection
3. **Find the Duplicate Number (287):** Treats array indices as pointers in a linked list

The core technique is recognizing that when state space is limited and transitions are deterministic, cycles are inevitable. Once you detect a cycle, you can use modular arithmetic to skip most iterations.

## Key Takeaways

1. **Look for cycles when state space is limited:** If there are only K possible states, you'll see a repeat within K+1 steps. This lets you handle arbitrarily large N efficiently.

2. **Bit manipulation can simplify array problems:** When dealing with binary arrays of fixed length, consider using integers as bitmasks for more efficient operations.

3. **Modular arithmetic is your friend for skipping cycles:** Once you find a cycle of length L starting at day S, the state at day N is the same as at day S + ((N - S) % L).

[Practice this problem on CodeJeet](/problem/prison-cells-after-n-days)
