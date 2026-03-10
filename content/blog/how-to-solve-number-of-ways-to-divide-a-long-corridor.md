---
title: "How to Solve Number of Ways to Divide a Long Corridor — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Divide a Long Corridor. Hard difficulty, 54.6% acceptance rate. Topics: Math, String, Dynamic Programming."
date: "2026-10-31"
category: "dsa-patterns"
tags: ["number-of-ways-to-divide-a-long-corridor", "math", "string", "dynamic-programming", "hard"]
---

# How to Solve Number of Ways to Divide a Long Corridor

You're given a string representing a corridor with seats ('S') and plants ('P'). You need to place dividers so that each section between dividers contains exactly two seats, and count how many ways you can do this. The tricky part is that plants between seats create multiple valid divider placements, and you need to count all possible combinations efficiently.

## Visual Walkthrough

Let's trace through example `"SPPSSPPS"`:

**Step 1: Validate total seats**

- Count all 'S': positions 0, 3, 4, 6 → 4 seats total
- Must be even to form valid sections: 4 is even ✓

**Step 2: Identify seat pairs**
We need sections with exactly 2 seats each:

- First section: seats at positions 0 and 3 (with plants at positions 1, 2 between them)
- Second section: seats at positions 4 and 6 (with plant at position 5 between them)

**Step 3: Find divider positions**
Dividers go between sections (after the second seat of each pair):

- After position 3 (between first and second sections)
- Plants between sections (positions 4-6) can have dividers placed at different spots

**Step 4: Count placement options**
Between sections, we can place dividers anywhere between the last seat of current section (position 3) and first seat of next section (position 4):

- Only position available: between 3 and 4 → 1 option

Between second and third sections (if there were more seats):

- Actually we only have 2 sections total (4 seats = 2 pairs)
- So only 1 divider placement decision

Wait, let's correct: With 4 seats, we have 2 sections, which means we need 1 divider between them. The number of ways = number of valid positions for that divider between the two sections.

**Better example:** `"SSPPSPSP"`:

- Seats at positions: 0, 1, 4, 6
- First section: seats 0 and 1 (adjacent)
- Second section: seats 4 and 6 (with plant at position 5 between them)
- Divider between sections can go anywhere between position 1 and position 4
- Valid positions: between 1-2, 2-3, 3-4 → 3 options
- So answer = 3

The key insight: For each gap between sections (between the 2nd seat of one pair and 1st seat of next pair), count how many plants are in that gap plus 1.

## Brute Force Approach

A naive approach would try all possible divider placements:

1. Find all seat positions
2. If total seats not even or less than 2, return 0
3. Generate all combinations of divider positions between seat pairs
4. Check each combination to ensure sections have exactly 2 seats

This is exponential in time complexity because for n seats, we have O(2^(n/2)) possible divider placements to check. For a corridor of length up to 10^5, this is completely infeasible.

Even a slightly better brute force that only considers dividers between sections would still need to explore all combinations, which grows combinatorially.

## Optimized Approach

The key insight is that this problem decomposes into independent subproblems:

1. **Validation**: Total seats must be even and at least 2
2. **Section identification**: We must group seats into consecutive pairs (2 seats per section)
3. **Divider placement**: Between each pair of sections (i.e., between 2nd seat of current section and 1st seat of next section), we can place dividers anywhere in the gap
4. **Counting**: The number of ways = product of (gap sizes + 1) for all gaps between sections

**Why this works:**

- Each section must have exactly 2 seats, so we have no choice about which seats pair together
- The only choice is where to place dividers BETWEEN sections
- Between sections, we can place a divider anywhere between the last seat of current section and first seat of next section
- If there are k plants in that gap, we have (k + 1) possible divider positions
- Choices for different gaps are independent, so we multiply them

**Algorithm:**

1. Count total seats - if odd or zero, return 0
2. Traverse corridor, tracking seat count
3. When we reach the 2nd seat of a section, start counting plants until next seat
4. Multiply running total by (plant_count + 1) for each gap between sections
5. Return result modulo 10^9+7

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numberOfWays(corridor: str) -> int:
    MOD = 10**9 + 7

    # Step 1: Count total seats and validate
    total_seats = corridor.count('S')

    # If total seats is odd or zero, no valid division possible
    if total_seats % 2 != 0 or total_seats == 0:
        return 0

    seat_count = 0
    result = 1
    plants_since_last_seat = 0

    # Step 2: Traverse the corridor
    for char in corridor:
        if char == 'S':
            seat_count += 1

            # When we complete a pair (2 seats), check if there are more seats
            if seat_count == 2:
                # Reset for next section
                seat_count = 0
                # Start counting plants for the gap to next section
                plants_since_last_seat = 1
            elif seat_count == 1 and plants_since_last_seat > 0:
                # We've reached first seat of next section
                # Multiply by number of divider positions in the gap
                result = (result * plants_since_last_seat) % MOD
                # Reset plant counter for current gap
                plants_since_last_seat = 0
        else:  # char == 'P'
            # Count plants in current gap between sections
            if seat_count == 0 and plants_since_last_seat > 0:
                plants_since_last_seat += 1

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function numberOfWays(corridor) {
  const MOD = 1_000_000_007;

  // Step 1: Count total seats and validate
  let totalSeats = 0;
  for (let char of corridor) {
    if (char === "S") totalSeats++;
  }

  // If total seats is odd or zero, no valid division possible
  if (totalSeats % 2 !== 0 || totalSeats === 0) {
    return 0;
  }

  let seatCount = 0;
  let result = 1;
  let plantsSinceLastSeat = 0;

  // Step 2: Traverse the corridor
  for (let char of corridor) {
    if (char === "S") {
      seatCount++;

      // When we complete a pair (2 seats), check if there are more seats
      if (seatCount === 2) {
        // Reset for next section
        seatCount = 0;
        // Start counting plants for the gap to next section
        plantsSinceLastSeat = 1;
      } else if (seatCount === 1 && plantsSinceLastSeat > 0) {
        // We've reached first seat of next section
        // Multiply by number of divider positions in the gap
        result = (result * plantsSinceLastSeat) % MOD;
        // Reset plant counter for current gap
        plantsSinceLastSeat = 0;
      }
    } else {
      // char === 'P'
      // Count plants in current gap between sections
      if (seatCount === 0 && plantsSinceLastSeat > 0) {
        plantsSinceLastSeat++;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int numberOfWays(String corridor) {
        final int MOD = 1_000_000_007;

        // Step 1: Count total seats and validate
        int totalSeats = 0;
        for (char c : corridor.toCharArray()) {
            if (c == 'S') totalSeats++;
        }

        // If total seats is odd or zero, no valid division possible
        if (totalSeats % 2 != 0 || totalSeats == 0) {
            return 0;
        }

        int seatCount = 0;
        long result = 1; // Use long to avoid overflow during multiplication
        int plantsSinceLastSeat = 0;

        // Step 2: Traverse the corridor
        for (char c : corridor.toCharArray()) {
            if (c == 'S') {
                seatCount++;

                // When we complete a pair (2 seats), check if there are more seats
                if (seatCount == 2) {
                    // Reset for next section
                    seatCount = 0;
                    // Start counting plants for the gap to next section
                    plantsSinceLastSeat = 1;
                } else if (seatCount == 1 && plantsSinceLastSeat > 0) {
                    // We've reached first seat of next section
                    // Multiply by number of divider positions in the gap
                    result = (result * plantsSinceLastSeat) % MOD;
                    // Reset plant counter for current gap
                    plantsSinceLastSeat = 0;
                }
            } else { // c == 'P'
                // Count plants in current gap between sections
                if (seatCount == 0 && plantsSinceLastSeat > 0) {
                    plantsSinceLastSeat++;
                }
            }
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one to count total seats (O(n)), and one to compute the result (O(n))
- Each pass processes each character exactly once
- The combined time is linear in the length of the corridor

**Space Complexity: O(1)**

- We use only a constant number of variables regardless of input size
- No additional data structures that grow with input size
- The space used is for counters and the result variable only

## Common Mistakes

1. **Forgetting to check if total seats is even**: This is the first validation step. If total seats is odd, we can't pair them all into groups of 2. Always check this before proceeding.

2. **Not handling the modulo operation correctly**: The result can be huge (product of many numbers), so we need to apply modulo 10^9+7 after each multiplication, not just at the end. Also watch for integer overflow in languages like Java.

3. **Incorrect gap counting logic**: The tricky part is knowing when to count plants. We only count plants when we're between sections (after completing a pair of seats but before starting the next pair). The condition `seatCount == 0 && plantsSinceLastSeat > 0` ensures we only count plants in gaps between sections.

4. **Missing the edge case of no seats or only 2 seats**: With 0 seats, answer is 0. With exactly 2 seats, we have exactly 1 way (no dividers needed), but our algorithm should handle this correctly by returning 1.

## When You'll See This Pattern

This problem uses **combinatorial counting with constraints**, similar to:

1. **Decode Ways II (Hard)**: Both problems count the number of valid ways to partition/interpret a sequence subject to constraints. In Decode Ways, you count valid partitions of digits into letters; here you count valid partitions of seats into sections.

2. **Ways to Split Array Into Three Subarrays (Medium)**: Both involve counting valid partition points in an array/string. The key insight in both is identifying independent decision points and multiplying possibilities.

3. **Number of Ways to Split a String (Medium)**: Directly similar - counting valid ways to split a string into sections with certain properties.

The pattern is: when you need to count valid partitions/divisions, look for points where decisions are independent, then multiply the number of choices at each decision point.

## Key Takeaways

1. **Look for independence in decision points**: When choices at different positions don't affect each other (except through global constraints), you can often multiply the number of possibilities at each point.

2. **Validate global constraints first**: Before diving into the counting logic, check if a solution is even possible (e.g., total seats must be even).

3. **Track state with minimal variables**: We only needed to track seat count in current section and plants since last section - no need for complex data structures.

Related problems: [Decode Ways II](/problem/decode-ways-ii), [Minimum Cost to Cut a Stick](/problem/minimum-cost-to-cut-a-stick), [Ways to Split Array Into Three Subarrays](/problem/ways-to-split-array-into-three-subarrays)
