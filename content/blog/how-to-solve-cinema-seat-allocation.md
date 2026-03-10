---
title: "How to Solve Cinema Seat Allocation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Cinema Seat Allocation. Medium difficulty, 43.6% acceptance rate. Topics: Array, Hash Table, Greedy, Bit Manipulation."
date: "2028-04-12"
category: "dsa-patterns"
tags: ["cinema-seat-allocation", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Cinema Seat Allocation

This problem asks us to maximize the number of 4-person groups that can sit together in a cinema with `n` rows of 10 seats each, given a list of already reserved seats. The tricky part is that groups can only sit in specific configurations: either seats 2-5, seats 4-7, or seats 6-9. The challenge is efficiently determining which rows can accommodate which configurations when seats are already reserved.

## Visual Walkthrough

Let's walk through a concrete example:

- `n = 3` (3 rows)
- `reservedSeats = [[1,2], [1,3], [1,8], [2,6], [3,1], [3,10]]`

**Row 1:** Reserved seats: 2, 3, 8

- Check seats 2-5: seats 2 and 3 are reserved ❌
- Check seats 4-7: seats 4-7 are all free ✅ (seat 8 doesn't affect this group)
- Check seats 6-9: seat 8 is reserved ❌
- Row 1 can accommodate 1 group

**Row 2:** Reserved seats: 6

- Check seats 2-5: all free ✅
- Check seats 4-7: seat 6 is reserved ❌
- Check seats 6-9: seat 6 is reserved ❌
- Row 2 can accommodate 1 group

**Row 3:** Reserved seats: 1, 10

- Check seats 2-5: all free ✅
- Check seats 4-7: all free ✅
- Check seats 6-9: all free ✅
- Row 3 can accommodate 2 groups (since groups 2-5 and 6-9 don't overlap)

**Total:** 1 + 1 + 2 = 4 groups

The key insight is that we only need to track reserved seats in the middle section (seats 2-9), since seats 1 and 10 don't affect any of the group configurations.

## Brute Force Approach

A naive approach would be to create a 2D array representing all seats, mark reserved seats, then for each row check all three configurations:

1. Create a `n × 10` boolean matrix initialized to `false` (available)
2. Mark reserved seats as `true`
3. For each row, check each configuration:
   - Seats 2-5: if all are `false`, increment count
   - Seats 4-7: if all are `false`, increment count
   - Seats 6-9: if all are `false`, increment count

**Why this fails:**

- Time complexity: O(n × 10 + m) where m is number of reserved seats
- Space complexity: O(n × 10) which is O(10n)
- For n up to 10^9 (as in the problem constraints), this would require ~10^10 operations and memory, which is completely infeasible

The brute force fails because it doesn't scale to large n values. We need a way to process only rows that actually have reserved seats, and handle empty rows efficiently.

## Optimized Approach

The key insight is **bitmasking**:

1. **Represent each row as a bitmask** of 10 bits (seats 1-10)
   - 0 = available, 1 = reserved
   - Only seats 2-9 matter for group placement

2. **Three masks represent the group configurations:**
   - `mask1 = 0b11110000` (seats 2-5, but shifted for easier comparison)
   - `mask2 = 0b1111000000` (seats 4-7)
   - `mask3 = 0b111100000000` (seats 6-9)

3. **Process only rows with reservations:**
   - Use a hash map: `row → bitmask of reserved seats`
   - For rows with no reservations, we can calculate directly: each can hold 2 groups

4. **For each row with reservations:**
   - Start with all seats available (bitmask = 0)
   - Set bits for reserved seats
   - Check if `(bitmask & mask1) == 0` → group 1 possible
   - Check if `(bitmask & mask2) == 0` → group 2 possible
   - Check if `(bitmask & mask3) == 0` → group 3 possible
   - If all three checks pass, row can hold 2 groups
   - If at least one check passes, row can hold 1 group
   - Otherwise, 0 groups

5. **Add empty rows:** `(n - number of rows with reservations) × 2`

This approach is efficient because we only process rows that actually have reservations, and empty rows are handled in constant time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m) where m = len(reservedSeats) | Space: O(m)
def maxNumberOfFamilies(n, reservedSeats):
    """
    Calculate maximum number of 4-person families that can sit together.

    Args:
        n: Number of rows in cinema
        reservedSeats: List of [row, seat] pairs that are already reserved

    Returns:
        Maximum number of families that can be seated
    """
    # Bit masks for the three possible family seating configurations
    # We use bits 2-9 (0-indexed from the right) since seats 1 and 10 don't matter
    # Actually, we'll use bits 1-8 (0-indexed) for seats 2-9
    LEFT = 0b0111100000   # seats 2,3,4,5 (bits 1-4 from right, but we shift)
    MIDDLE = 0b0001111000 # seats 4,5,6,7 (bits 3-6)
    RIGHT = 0b0000011110  # seats 6,7,8,9 (bits 5-8)

    # Dictionary to store bitmask of reserved seats for each row
    # Key: row number, Value: bitmask where 1 = reserved seat
    reserved_map = {}

    # Build the reservation map
    for row, seat in reservedSeats:
        # Only care about seats 2-9 (seat numbers 2 through 9)
        # Convert seat number to bit position (0-indexed from right)
        if 2 <= seat <= 9:
            # Create mask for this seat: 1 << (seat - 2)
            # seat-2 because seat 2 maps to bit 0, seat 3 to bit 1, etc.
            bit_position = seat - 2
            if row not in reserved_map:
                reserved_map[row] = 0
            reserved_map[row] |= (1 << bit_position)

    # Start with families from completely empty rows
    # Each empty row can accommodate 2 families (left and right groups)
    result = (n - len(reserved_map)) * 2

    # Process rows with reservations
    for bitmask in reserved_map.values():
        can_sit_left = (bitmask & LEFT) == 0
        can_sit_middle = (bitmask & MIDDLE) == 0
        can_sit_right = (bitmask & RIGHT) == 0

        # If both left and right are available, we can seat 2 families
        # (they don't overlap: left uses seats 2-5, right uses seats 6-9)
        if can_sit_left and can_sit_right:
            result += 2
        # Otherwise, if at least one configuration is available, seat 1 family
        elif can_sit_left or can_sit_middle or can_sit_right:
            result += 1
        # If none are available, add 0 (no families can sit in this row)

    return result
```

```javascript
// Time: O(m) where m = reservedSeats.length | Space: O(m)
/**
 * Calculate maximum number of 4-person families that can sit together.
 *
 * @param {number} n - Number of rows in cinema
 * @param {number[][]} reservedSeats - Array of [row, seat] pairs that are reserved
 * @return {number} Maximum number of families that can be seated
 */
function maxNumberOfFamilies(n, reservedSeats) {
  // Bit masks for the three possible family seating configurations
  // Bits represent seats 2-9 (8 bits total, 0-indexed from right)
  const LEFT = 0b0111100000; // seats 2,3,4,5 (bits 1-4)
  const MIDDLE = 0b0001111000; // seats 4,5,6,7 (bits 3-6)
  const RIGHT = 0b0000011110; // seats 6,7,8,9 (bits 5-8)

  // Map to store bitmask of reserved seats for each row
  // Key: row number, Value: bitmask where 1 = reserved seat
  const reservedMap = new Map();

  // Build the reservation map
  for (const [row, seat] of reservedSeats) {
    // Only care about seats 2-9
    if (seat >= 2 && seat <= 9) {
      // Convert seat number to bit position (0-indexed from right)
      // seat-2 because seat 2 maps to bit 0, seat 3 to bit 1, etc.
      const bitPosition = seat - 2;
      const seatMask = 1 << bitPosition;

      // Update or create the bitmask for this row
      if (!reservedMap.has(row)) {
        reservedMap.set(row, 0);
      }
      reservedMap.set(row, reservedMap.get(row) | seatMask);
    }
  }

  // Start with families from completely empty rows
  // Each empty row can accommodate 2 families (left and right groups)
  let result = (n - reservedMap.size) * 2;

  // Process rows with reservations
  for (const bitmask of reservedMap.values()) {
    const canSitLeft = (bitmask & LEFT) === 0;
    const canSitMiddle = (bitmask & MIDDLE) === 0;
    const canSitRight = (bitmask & RIGHT) === 0;

    // If both left and right are available, we can seat 2 families
    if (canSitLeft && canSitRight) {
      result += 2;
    }
    // Otherwise, if at least one configuration is available, seat 1 family
    else if (canSitLeft || canSitMiddle || canSitRight) {
      result += 1;
    }
    // If none are available, add 0 (no families can sit in this row)
  }

  return result;
}
```

```java
// Time: O(m) where m = reservedSeats.length | Space: O(m)
import java.util.*;

class Solution {
    /**
     * Calculate maximum number of 4-person families that can sit together.
     *
     * @param n Number of rows in cinema
     * @param reservedSeats Array of [row, seat] pairs that are reserved
     * @return Maximum number of families that can be seated
     */
    public int maxNumberOfFamilies(int n, int[][] reservedSeats) {
        // Bit masks for the three possible family seating configurations
        // Bits represent seats 2-9 (8 bits total, 0-indexed from right)
        final int LEFT = 0b0111100000;   // seats 2,3,4,5 (bits 1-4)
        final int MIDDLE = 0b0001111000; // seats 4,5,6,7 (bits 3-6)
        final int RIGHT = 0b0000011110;  // seats 6,7,8,9 (bits 5-8)

        // Map to store bitmask of reserved seats for each row
        // Key: row number, Value: bitmask where 1 = reserved seat
        Map<Integer, Integer> reservedMap = new HashMap<>();

        // Build the reservation map
        for (int[] reservation : reservedSeats) {
            int row = reservation[0];
            int seat = reservation[1];

            // Only care about seats 2-9
            if (seat >= 2 && seat <= 9) {
                // Convert seat number to bit position (0-indexed from right)
                // seat-2 because seat 2 maps to bit 0, seat 3 to bit 1, etc.
                int bitPosition = seat - 2;
                int seatMask = 1 << bitPosition;

                // Update or create the bitmask for this row
                reservedMap.put(row, reservedMap.getOrDefault(row, 0) | seatMask);
            }
        }

        // Start with families from completely empty rows
        // Each empty row can accommodate 2 families (left and right groups)
        int result = (n - reservedMap.size()) * 2;

        // Process rows with reservations
        for (int bitmask : reservedMap.values()) {
            boolean canSitLeft = (bitmask & LEFT) == 0;
            boolean canSitMiddle = (bitmask & MIDDLE) == 0;
            boolean canSitRight = (bitmask & RIGHT) == 0;

            // If both left and right are available, we can seat 2 families
            if (canSitLeft && canSitRight) {
                result += 2;
            }
            // Otherwise, if at least one configuration is available, seat 1 family
            else if (canSitLeft || canSitMiddle || canSitRight) {
                result += 1;
            }
            // If none are available, add 0 (no families can sit in this row)
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m)**

- We iterate through all `m` reserved seats once to build the hash map: O(m)
- We iterate through the hash map values (at most `m` entries): O(m)
- Total: O(m + m) = O(m)

**Space Complexity: O(m)**

- The hash map stores at most `m` entries (one per unique row with reservations)
- Each entry stores an integer (bitmask)
- Total: O(m)

This is optimal because we must at least examine each reserved seat, giving us a lower bound of Ω(m).

## Common Mistakes

1. **Not filtering seats 1 and 10:** Candidates often include seats 1 and 10 in their bitmask calculations, which is unnecessary since these seats don't affect any family configuration. This doesn't affect correctness but adds complexity.

2. **Off-by-one errors in bit positions:** The most common error is miscalculating which bit corresponds to which seat. Remember: seat 2 → bit 0, seat 3 → bit 1, ..., seat 9 → bit 7. Using `1 << (seat - 2)` correctly handles this.

3. **Forgetting about empty rows:** Each completely empty row can accommodate 2 families (left and right configurations). Candidates who only process rows with reservations will miss these. The formula is: `(n - rowsWithReservations) * 2`.

4. **Incorrect group counting logic:** When a row can accommodate both left and right groups, that's 2 families (not 1). Some candidates mistakenly count this as 1 family. The correct logic: if both left and right are available → 2 families; else if at least one configuration available → 1 family; else → 0 families.

## When You'll See This Pattern

This problem combines **bitmasking** with **hash map optimization**, a pattern useful for:

1. **Booking Concert Tickets in Groups (LeetCode 2286):** Similar reservation system with group seating constraints, though more complex with variable group sizes.

2. **Maximum Product of Word Lengths (LeetCode 318):** Uses bitmasking to represent character sets in words, then uses bitwise AND to check for common characters.

3. **Subsets (LeetCode 78):** Bitmasking represents which elements are included in each subset.

The core pattern is: when you have a fixed set of positions/states and need to check combinations efficiently, bitmasking with bitwise operations provides O(1) checks for configuration validity.

## Key Takeaways

1. **Bitmasking is perfect for fixed-position problems:** When you have a small, fixed number of positions (like 10 seats) and need to check configurations, represent occupied positions as bits for O(1) validity checks.

2. **Process only what matters:** Instead of creating data structures for all `n` rows (which could be huge), use a hash map to store only rows with reservations. Empty rows can be handled with a simple formula.

3. **Look for symmetry and independence:** The left (2-5) and right (6-9) configurations don't overlap, so when both are available, we get 2 families. The middle (4-7) overlaps with both, so it's an alternative when left or right isn't available.

Related problems: [Booking Concert Tickets in Groups](/problem/booking-concert-tickets-in-groups)
