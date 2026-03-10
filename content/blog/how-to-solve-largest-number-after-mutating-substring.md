---
title: "How to Solve Largest Number After Mutating Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Number After Mutating Substring. Medium difficulty, 37.9% acceptance rate. Topics: Array, String, Greedy."
date: "2029-07-14"
category: "dsa-patterns"
tags: ["largest-number-after-mutating-substring", "array", "string", "greedy", "medium"]
---

# How to Solve Largest Number After Mutating Substring

You're given a large integer as a string and a mapping that transforms each digit to another digit. Your task is to maximize the resulting number by changing at most one contiguous substring of digits according to the mapping. The challenge lies in deciding exactly where to start and end the mutation to get the largest possible number while avoiding unnecessary changes that could make the number smaller.

**What makes this tricky:** You can't just blindly apply the mapping to every digit where `change[d] > d` because:

1. Once you start mutating, you must continue mutating until you stop (it's a contiguous substring)
2. You should stop mutating when the mapping no longer benefits the number
3. You need to handle the case where multiple mutations give the same digit value

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
num = "132"
change = [9,8,5,0,0,0,0,0,0,0]
```

Mapping: 0→9, 1→8, 2→5, 3→0, 4→0, 5→0, 6→0, 7→0, 8→0, 9→0

**Step-by-step reasoning:**

1. Start from the leftmost digit (most significant position)
2. At position 0: digit '1' → change[1] = 8. Since 8 > 1, mutating here would improve the number
3. At position 1: digit '3' → change[3] = 0. Since 0 < 3, mutating here would make the number smaller
4. At position 2: digit '2' → change[2] = 5. Since 5 > 2, mutating here would improve the number

**Key insight:** We want to start mutating at the first position where mutation helps, and continue as long as it helps or keeps the digit the same (since same digit might allow later improvements). But we must stop before we reach a digit where mutation hurts.

**Optimal mutation for "132":**

- Start at position 0: '1' → '8' (improvement)
- Continue to position 1: '3' → '0' (hurts! So we should stop before this)
- Result: "832" (only mutate the first digit)

**But wait:** What if we start later?

- Start at position 2 only: "135" (worse than "832")
- So starting at the leftmost beneficial position gives the best result

## Brute Force Approach

A naive approach would try every possible substring `[i:j]` where `0 ≤ i ≤ j < len(num)`, apply the mutation to that substring, and compare all results to find the maximum.

**Why this fails:**

- For a string of length `n`, there are `O(n²)` possible substrings
- For each substring, we need to build a new string of length `n`, which takes `O(n)` time
- Total time complexity: `O(n³)` — far too slow for constraints where `n` can be up to 10⁵
- Space complexity: `O(n)` for each candidate string

**What candidates might try:**
Some might try to mutate every digit where `change[d] > d`, but this violates the "contiguous substring" requirement. Others might try to find all positions where mutation helps and take the longest contiguous segment of such positions, but this misses cases where keeping a digit the same (even when `change[d] = d`) allows continuing to later beneficial mutations.

## Optimized Approach

The key insight is a **greedy approach** with careful state tracking:

1. **Scan left to right** (most to least significant digits)
2. **Three states** during scanning:
   - `not_started`: Haven't begun mutating yet
   - `mutating`: Currently in the mutation substring
   - `stopped`: Finished mutating (won't mutate any more digits)
3. **Decision rules**:
   - If `not_started` and `change[d] > d`: Start mutating (this digit improves)
   - If `not_started` and `change[d] < d`: Don't start (would make number smaller)
   - If `not_started` and `change[d] = d`: Skip for now (might start later)
   - If `mutating` and `change[d] < d`: Stop mutating (further mutation hurts)
   - If `mutating` and `change[d] ≥ d`: Continue mutating (helps or neutral)
   - Once `stopped`, never mutate again

**Special consideration:** When `change[d] = d` while `not_started`, we might want to start mutating here if it allows us to reach later digits that have `change[d] > d`. This is why we need to track a potential starting point.

**Algorithm outline:**

1. Convert string to list for mutable operations
2. Track mutation state and potential start index
3. Iterate through digits, applying mutation rules
4. Return the mutated string

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the list conversion
def maximumNumber(self, num: str, change: List[int]) -> str:
    # Convert string to list for mutable operations
    num_list = list(num)

    # Track whether we've started mutating
    # 0 = not started, 1 = mutating, 2 = stopped
    state = 0

    for i in range(len(num_list)):
        current_digit = int(num_list[i])
        new_digit = change[current_digit]

        if state == 0:  # Not started mutating yet
            if new_digit > current_digit:
                # Start mutating: this digit improves the number
                num_list[i] = str(new_digit)
                state = 1  # Now we're mutating
            # If new_digit == current_digit, we don't start yet
            # but might start later if we find new_digit > current_digit
            # If new_digit < current_digit, we definitely don't start here

        elif state == 1:  # Currently mutating
            if new_digit < current_digit:
                # Stop mutating: further mutation would make number smaller
                state = 2
            else:
                # Continue mutating: new digit is better or equal
                num_list[i] = str(new_digit)

        # state == 2: Stopped mutating, do nothing

    return ''.join(num_list)
```

```javascript
// Time: O(n) | Space: O(n) for the array conversion
var maximumNumber = function (num, change) {
  // Convert string to array for mutable operations
  const numArray = num.split("");

  // State: 0 = not started, 1 = mutating, 2 = stopped
  let state = 0;

  for (let i = 0; i < numArray.length; i++) {
    const currentDigit = parseInt(numArray[i]);
    const newDigit = change[currentDigit];

    if (state === 0) {
      // Not started mutating yet
      if (newDigit > currentDigit) {
        // Start mutating: this digit improves the number
        numArray[i] = newDigit.toString();
        state = 1; // Now we're mutating
      }
      // If equal, we might start later
      // If less, we definitely don't start here
    } else if (state === 1) {
      // Currently mutating
      if (newDigit < currentDigit) {
        // Stop mutating: further mutation would hurt
        state = 2;
      } else {
        // Continue mutating: new digit is better or equal
        numArray[i] = newDigit.toString();
      }
    }
    // state === 2: Stopped mutating, do nothing
  }

  return numArray.join("");
};
```

```java
// Time: O(n) | Space: O(n) for the char array
class Solution {
    public String maximumNumber(String num, int[] change) {
        // Convert string to char array for mutable operations
        char[] numArray = num.toCharArray();

        // State: 0 = not started, 1 = mutating, 2 = stopped
        int state = 0;

        for (int i = 0; i < numArray.length; i++) {
            int currentDigit = numArray[i] - '0';  // Convert char to int
            int newDigit = change[currentDigit];

            if (state == 0) {  // Not started mutating yet
                if (newDigit > currentDigit) {
                    // Start mutating: this digit improves the number
                    numArray[i] = (char) (newDigit + '0');  // Convert int to char
                    state = 1;  // Now we're mutating
                }
                // If equal, we might start later
                // If less, we definitely don't start here
            }
            else if (state == 1) {  // Currently mutating
                if (newDigit < currentDigit) {
                    // Stop mutating: further mutation would hurt
                    state = 2;
                } else {
                    // Continue mutating: new digit is better or equal
                    numArray[i] = (char) (newDigit + '0');
                }
            }
            // state == 2: Stopped mutating, do nothing
        }

        return new String(numArray);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length `n`
- Each iteration performs constant-time operations: digit conversion, comparison, and assignment
- No nested loops or expensive operations

**Space Complexity: O(n)**

- We convert the string to a mutable list/array, which requires `O(n)` space
- We use a few extra variables for state tracking (`O(1)` space)
- The input itself is `O(n)` space, but we're considering auxiliary space

**Why this is optimal:**

- We must examine each digit at least once to decide whether to mutate it
- Any algorithm needs `Ω(n)` time, so `O(n)` is optimal
- The mutable array is necessary since strings are immutable in most languages

## Common Mistakes

1. **Starting mutation at wrong position**: Some candidates start mutating at the first position where `change[d] ≥ d` instead of `change[d] > d`. If `change[d] = d`, starting mutation here is only beneficial if it allows reaching later positions with `change[d] > d`.

2. **Not stopping when mutation hurts**: Once you encounter `change[d] < d` while mutating, you must stop. Continuing would make the number smaller. Some candidates check `change[d] ≤ d` as the stopping condition, which incorrectly stops when `change[d] = d`.

3. **Over-mutating equal digits**: When `change[d] = d` and you're already mutating, you should continue mutating (replace with the same value). Some candidates stop here, which could prevent reaching later beneficial mutations if the substring needs to be contiguous.

4. **Forgetting string immutability**: Trying to modify characters in a string directly (e.g., `num[i] = newDigit` in Python) causes errors. You need to convert to a list/array first.

## When You'll See This Pattern

This problem combines **greedy decision-making** with **state machine tracking**, a pattern seen in:

1. **Best Time to Buy and Sell Stock (LeetCode 121)**: Similar state tracking (not bought, bought, sold) with greedy decisions about when to buy/sell.

2. **Maximum Subarray (LeetCode 53)**: Kadane's algorithm uses similar contiguous segment tracking, deciding when to start/continue/restart a subarray.

3. **Monotone Increasing Digits (LeetCode 738)**: Another digit manipulation problem where you make greedy decisions left-to-right to satisfy constraints.

**Why they're related:** All involve scanning left-to-right, making local decisions that lead to a global optimum, and tracking some state about what "phase" you're in during the scan.

## Key Takeaways

1. **Left-to-right scanning with state tracking** is powerful for problems where you need to find an optimal contiguous segment. The state machine approach (not started/active/stopped) is reusable.

2. **Greedy works when local optimality implies global optimality**: Here, starting mutation at the first beneficial position and stopping at the first harmful position yields the globally maximum number.

3. **Digit manipulation problems often require careful comparison logic**: Pay attention to `>`, `<`, and `=` cases—they often have different implications for the algorithm's flow.

[Practice this problem on CodeJeet](/problem/largest-number-after-mutating-substring)
