---
title: "How to Solve Number of Laser Beams in a Bank — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Laser Beams in a Bank. Medium difficulty, 87.0% acceptance rate. Topics: Array, Math, String, Matrix."
date: "2027-10-11"
category: "dsa-patterns"
tags: ["number-of-laser-beams-in-a-bank", "array", "math", "string", "medium"]
---

# How to Solve Number of Laser Beams in a Bank

This problem asks us to count the total number of laser beams that can exist between security devices in a bank's floor plan. The tricky part is that beams can only travel vertically between rows, but only if there are no devices in the intermediate rows that would block them. This creates an interesting counting problem where we need to multiply the number of devices in each row with the number in the next non-empty row.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this bank layout:

```
bank = ["011001", "000000", "010100", "001000"]
```

Visually, this represents:

- Row 0: "011001" → 3 devices (positions 1, 2, and 5)
- Row 1: "000000" → 0 devices (empty row)
- Row 2: "010100" → 2 devices (positions 1 and 3)
- Row 3: "001000" → 1 device (position 2)

Now let's count the laser beams:

1. **Row 0 to Row 2**: Row 1 is empty, so beams can pass through. Row 0 has 3 devices, Row 2 has 2 devices. Each device in Row 0 can connect to each device in Row 2, so that's 3 × 2 = 6 beams.

2. **Row 2 to Row 3**: No empty rows between them. Row 2 has 2 devices, Row 3 has 1 device. That's 2 × 1 = 2 beams.

3. **Total beams**: 6 + 2 = 8 beams.

Notice the pattern: We only count beams between consecutive non-empty rows. Empty rows don't contribute devices but don't block beams either. The key insight is that for each pair of consecutive non-empty rows, the number of beams equals the product of their device counts.

## Brute Force Approach

A naive approach might try to simulate every possible beam: For each device in the bank, try to find all devices it can connect to in rows below it. This would involve:

1. For each row `i`, for each device in that row (position `j` where `bank[i][j] == '1'`)
2. For each row `k` below row `i`, check if there are any devices in rows between `i` and `k`
3. If all intermediate rows are empty, count all devices in row `k`

This approach has several problems:

- It's O(m² × n) where m is the number of rows and n is the number of columns
- We're repeatedly checking the same intermediate rows
- We're doing unnecessary work by examining individual positions when we only care about counts

The brute force would be too slow for large inputs (up to 500×500 in constraints).

## Optimized Approach

The key insight is that **we only need the count of devices in each row, not their positions**. Since beams can travel vertically through empty rows, the positions of devices within a row don't matter—only how many there are.

Here's the step-by-step reasoning:

1. **Count devices per row**: Convert each string to a count of '1's. This gives us an array of device counts.

2. **Skip empty rows**: Empty rows (count = 0) don't contribute devices but don't block beams. We can simply ignore them when counting.

3. **Multiply consecutive non-empty rows**: For each pair of consecutive non-empty rows, the number of beams between them is the product of their device counts.

4. **Sum all products**: The total number of beams is the sum of all these products.

Why does this work? Because:

- Each device in an upper row connects to every device in the next non-empty row below it
- Empty rows between them don't block the connection
- We don't need to track individual beam paths, just the total count

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m × n) where m = rows, n = columns
# Space: O(1) - we only store a few variables
def numberOfBeams(bank):
    """
    Counts the total number of laser beams between security devices.

    Args:
        bank: List of strings representing rows of the bank floor plan

    Returns:
        Total number of laser beams
    """
    total_beams = 0
    prev_devices = 0  # Number of devices in the previous non-empty row

    for row in bank:
        # Count devices in current row
        current_devices = row.count('1')

        # Skip empty rows - they don't contribute devices
        if current_devices == 0:
            continue

        # If we have a previous non-empty row, add beams between them
        # Each device in prev row connects to each device in current row
        total_beams += prev_devices * current_devices

        # Update previous devices for next non-empty row
        prev_devices = current_devices

    return total_beams
```

```javascript
// Time: O(m × n) where m = rows, n = columns
// Space: O(1) - we only store a few variables
function numberOfBeams(bank) {
  /**
   * Counts the total number of laser beams between security devices.
   *
   * @param {string[]} bank - Array of strings representing rows of the bank floor plan
   * @return {number} Total number of laser beams
   */
  let totalBeams = 0;
  let prevDevices = 0; // Number of devices in the previous non-empty row

  for (const row of bank) {
    // Count devices in current row by counting '1's
    let currentDevices = 0;
    for (const cell of row) {
      if (cell === "1") {
        currentDevices++;
      }
    }

    // Skip empty rows - they don't contribute devices
    if (currentDevices === 0) {
      continue;
    }

    // If we have a previous non-empty row, add beams between them
    // Each device in prev row connects to each device in current row
    totalBeams += prevDevices * currentDevices;

    // Update previous devices for next non-empty row
    prevDevices = currentDevices;
  }

  return totalBeams;
}
```

```java
// Time: O(m × n) where m = rows, n = columns
// Space: O(1) - we only store a few variables
class Solution {
    public int numberOfBeams(String[] bank) {
        /**
         * Counts the total number of laser beams between security devices.
         *
         * @param bank Array of strings representing rows of the bank floor plan
         * @return Total number of laser beams
         */
        int totalBeams = 0;
        int prevDevices = 0;  // Number of devices in the previous non-empty row

        for (String row : bank) {
            // Count devices in current row by counting '1's
            int currentDevices = 0;
            for (char cell : row.toCharArray()) {
                if (cell == '1') {
                    currentDevices++;
                }
            }

            // Skip empty rows - they don't contribute devices
            if (currentDevices == 0) {
                continue;
            }

            // If we have a previous non-empty row, add beams between them
            // Each device in prev row connects to each device in current row
            totalBeams += prevDevices * currentDevices;

            // Update previous devices for next non-empty row
            prevDevices = currentDevices;
        }

        return totalBeams;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each row (m iterations)
- For each row, we count the '1's by iterating through each character (n operations per row)
- Total operations: m × n

**Space Complexity: O(1)**

- We only use a few integer variables (total_beams, prev_devices, current_devices)
- No additional data structures that scale with input size
- The input itself is not counted toward space complexity

## Common Mistakes

1. **Counting beams between all rows, not just consecutive non-empty rows**: Some candidates multiply device counts for every pair of rows, forgetting that beams can only travel through empty rows. Remember: beams exist only between consecutive non-empty rows when counting from top to bottom.

2. **Forgetting to skip empty rows when updating prev_devices**: If you update `prev_devices` even for empty rows (setting it to 0), you'll lose track of the last non-empty row's device count. Always use `continue` for empty rows to preserve the previous count.

3. **Overcomplicating with position tracking**: The positions of devices within a row don't matter—only the count. Some candidates try to track column positions or create 2D arrays, which adds unnecessary complexity.

4. **Not handling the edge case of no devices or only one row with devices**: If there are 0 or 1 non-empty rows, the answer should be 0. Our solution handles this correctly because we only add beams when we have both a previous non-empty row and a current non-empty row.

## When You'll See This Pattern

This problem uses a **sequential scanning with state tracking** pattern, where you process elements in order while maintaining some state from previous elements. Specifically:

1. **Product of Consecutive Elements Pattern**: Similar to problems where you need to compute something based on consecutive elements, like:
   - [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) - Also involves products between elements
   - [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) - Involves tracking products through an array

2. **Sparse Matrix Processing**: When you have sparse data (mostly zeros/empty), you often skip the empty parts and only process the non-empty elements. This appears in:
   - [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) - Also involves processing matrix rows/columns
   - [Sparse Matrix Multiplication](https://leetcode.com/problems/sparse-matrix-multiplication/) - Optimizes by skipping zeros

3. **Cumulative Counting Problems**: Where you accumulate results based on previous counts, similar to running totals or prefix sums.

## Key Takeaways

1. **Look for what truly matters**: In this problem, device positions don't matter—only counts per row. Always ask: "What's the minimal information I need to solve this?"

2. **Empty elements can be skipped, not ignored**: Empty rows don't contribute to the count but affect which elements are "consecutive." We skip them in counting but not in determining adjacency.

3. **State tracking simplifies sequential problems**: By keeping just `prev_devices`, we avoid complex data structures. When processing sequences, ask: "What do I need to remember from previous elements?"

4. **Multiplication often indicates pairwise connections**: When you see "each A connects to each B," think multiplication of counts rather than enumerating all pairs.

Related problems: [Set Matrix Zeroes](/problem/set-matrix-zeroes)
