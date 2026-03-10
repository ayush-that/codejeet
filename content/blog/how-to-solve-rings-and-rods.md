---
title: "How to Solve Rings and Rods — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rings and Rods. Easy difficulty, 81.5% acceptance rate. Topics: Hash Table, String."
date: "2027-07-28"
category: "dsa-patterns"
tags: ["rings-and-rods", "hash-table", "string", "easy"]
---

# How to Solve Rings and Rods

This problem asks us to determine how many rods have all three colored rings (red, green, and blue) placed on them. The input is a string where every two characters represents a color and rod position. What makes this problem interesting is that it's essentially a counting problem disguised as a string manipulation task - we need to track multiple attributes (color and position) simultaneously.

## Visual Walkthrough

Let's trace through an example: `rings = "B0B6G0R6R0R6G9"`

1. First pair: `"B0"` → Blue ring on rod 0
   - Rod 0 now has: {B}
2. Second pair: `"B6"` → Blue ring on rod 6
   - Rod 6 now has: {B}
3. Third pair: `"G0"` → Green ring on rod 0
   - Rod 0 now has: {B, G}
4. Fourth pair: `"R6"` → Red ring on rod 6
   - Rod 6 now has: {B, R}
5. Fifth pair: `"R0"` → Red ring on rod 0
   - Rod 0 now has: {B, G, R} ← Complete set!
6. Sixth pair: `"R6"` → Red ring on rod 6 (already has red)
   - Rod 6 now has: {B, R}
7. Seventh pair: `"G9"` → Green ring on rod 9
   - Rod 9 now has: {G}

After processing all pairs:

- Rod 0: {B, G, R} ✓ Complete
- Rod 6: {B, R} ✗ Missing green
- Rod 9: {G} ✗ Missing blue and red
- All other rods: {} ✗ Empty

Result: Only rod 0 has all three colors, so answer = 1.

## Brute Force Approach

A naive approach might involve:

1. Creating 10 separate lists/arrays for each rod
2. For each ring, checking if its color is already in that rod's list
3. At the end, checking each rod's list to see if it contains all three colors

While this would work, it's inefficient because:

- We'd be doing linear searches through each rod's list to check for duplicates
- The code would be verbose with many conditional checks
- We'd need to handle duplicate colors on the same rod

A better approach is to use a more efficient data structure to track which colors are on each rod.

## Optimal Solution

The optimal solution uses a hash table (dictionary/map) to track which colors are present on each rod. Since there are only 3 colors, we can use a bitmask or boolean flags. Here's the step-by-step approach:

1. Create a data structure to track colors for each rod (0-9)
2. Iterate through the string in steps of 2 characters
3. For each color-position pair:
   - Extract the color and rod number
   - Mark that color as present on that rod
4. After processing all rings, count how many rods have all three colors

<div class="code-group">

```python
# Time: O(n) where n is the length of rings | Space: O(1) - fixed 10 rods
def countPoints(rings: str) -> int:
    # Step 1: Initialize tracking for 10 rods
    # We'll use a list of sets to track which colors are on each rod
    # Alternative: use bitmask (R=1, G=2, B=4) for more efficient storage
    rods = [set() for _ in range(10)]

    # Step 2: Process each ring (every 2 characters in the string)
    for i in range(0, len(rings), 2):
        color = rings[i]      # First character: 'R', 'G', or 'B'
        rod = int(rings[i + 1])  # Second character: digit 0-9

        # Step 3: Add this color to the set for this rod
        rods[rod].add(color)

    # Step 4: Count rods that have all three colors
    count = 0
    for rod_set in rods:
        # Check if this rod has red, green, AND blue
        if 'R' in rod_set and 'G' in rod_set and 'B' in rod_set:
            count += 1

    return count
```

```javascript
// Time: O(n) where n is the length of rings | Space: O(1) - fixed 10 rods
function countPoints(rings) {
  // Step 1: Initialize tracking for 10 rods
  // Using an array of Sets to track colors on each rod
  const rods = Array.from({ length: 10 }, () => new Set());

  // Step 2: Process each ring (every 2 characters in the string)
  for (let i = 0; i < rings.length; i += 2) {
    const color = rings[i]; // First character: 'R', 'G', or 'B'
    const rod = parseInt(rings[i + 1]); // Second character: digit 0-9

    // Step 3: Add this color to the set for this rod
    rods[rod].add(color);
  }

  // Step 4: Count rods that have all three colors
  let count = 0;
  for (const rodSet of rods) {
    // Check if this rod has red, green, AND blue
    if (rodSet.has("R") && rodSet.has("G") && rodSet.has("B")) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) where n is the length of rings | Space: O(1) - fixed 10 rods
class Solution {
    public int countPoints(String rings) {
        // Step 1: Initialize tracking for 10 rods
        // Using an array of HashSets to track colors on each rod
        Set<Character>[] rods = new HashSet[10];
        for (int i = 0; i < 10; i++) {
            rods[i] = new HashSet<>();
        }

        // Step 2: Process each ring (every 2 characters in the string)
        for (int i = 0; i < rings.length(); i += 2) {
            char color = rings.charAt(i);      // First character: 'R', 'G', or 'B'
            int rod = rings.charAt(i + 1) - '0';  // Convert char digit to int

            // Step 3: Add this color to the set for this rod
            rods[rod].add(color);
        }

        // Step 4: Count rods that have all three colors
        int count = 0;
        for (Set<Character> rodSet : rods) {
            // Check if this rod has red, green, AND blue
            if (rodSet.contains('R') && rodSet.contains('G') && rodSet.contains('B')) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

**Alternative Bitmask Solution (More Efficient):**
We can use integers as bitmasks where:

- R = 1 (binary 001)
- G = 2 (binary 010)
- B = 4 (binary 100)
  All three colors = 7 (binary 111)

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - even more efficient with integers
def countPoints(rings: str) -> int:
    # Initialize array to store bitmask for each rod
    rods = [0] * 10

    # Map colors to their bit values
    color_map = {'R': 1, 'G': 2, 'B': 4}

    # Process each ring
    for i in range(0, len(rings), 2):
        color = rings[i]
        rod = int(rings[i + 1])

        # Set the bit for this color on this rod
        rods[rod] |= color_map[color]

    # Count rods with all three colors (bitmask = 7)
    return sum(1 for mask in rods if mask == 7)
```

```javascript
// Time: O(n) | Space: O(1) - even more efficient with integers
function countPoints(rings) {
  // Initialize array to store bitmask for each rod
  const rods = new Array(10).fill(0);

  // Map colors to their bit values
  const colorMap = { R: 1, G: 2, B: 4 };

  // Process each ring
  for (let i = 0; i < rings.length; i += 2) {
    const color = rings[i];
    const rod = parseInt(rings[i + 1]);

    // Set the bit for this color on this rod
    rods[rod] |= colorMap[color];
  }

  // Count rods with all three colors (bitmask = 7)
  return rods.filter((mask) => mask === 7).length;
}
```

```java
// Time: O(n) | Space: O(1) - even more efficient with integers
class Solution {
    public int countPoints(String rings) {
        // Initialize array to store bitmask for each rod
        int[] rods = new int[10];

        // Process each ring
        for (int i = 0; i < rings.length(); i += 2) {
            char color = rings.charAt(i);
            int rod = rings.charAt(i + 1) - '0';

            // Set the bit for this color on this rod
            if (color == 'R') {
                rods[rod] |= 1;  // 001
            } else if (color == 'G') {
                rods[rod] |= 2;  // 010
            } else { // 'B'
                rods[rod] |= 4;  // 100
            }
        }

        // Count rods with all three colors (bitmask = 7 = 111)
        int count = 0;
        for (int mask : rods) {
            if (mask == 7) {
                count++;
            }
        }
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, processing each character
- The loop runs n/2 iterations (where n is string length), but O(n/2) = O(n)
- Checking each rod at the end is O(10) = O(1) constant time

**Space Complexity: O(1)**

- We use a fixed-size array of 10 elements regardless of input size
- Each element stores at most 3 colors (or a single integer for bitmask)
- This is constant space, not dependent on input size

## Common Mistakes

1. **Off-by-one errors in string iteration**: Forgetting to step by 2 in the loop, or incorrectly calculating the rod index. Always test with `i += 2` and verify you're accessing `rings[i]` and `rings[i+1]` correctly.

2. **Not handling duplicate colors**: If you use a list instead of a set, you might add the same color multiple times to a rod. This doesn't affect the final count but wastes memory. Using a set or bitmask automatically handles duplicates.

3. **Incorrect rod indexing**: The rod numbers are 0-9, but some candidates might try to use 1-10. Remember to convert the character to an integer properly (e.g., `int(rings[i+1])` not `ord(rings[i+1])`).

4. **Inefficient final check**: Some candidates check `len(rod_set) == 3` which works with sets, but with bitmask you need to check for the exact value 7. Checking for "at least 3 colors" is wrong if using other data structures.

## When You'll See This Pattern

This problem uses the **"grouping/counting with multiple attributes"** pattern, which appears in many problems:

1. **Group Anagrams (LeetCode 49)**: Group strings by their character counts, similar to grouping rings by rod number and tracking colors.

2. **Find Common Characters (LeetCode 1002)**: Track which characters appear in all strings, similar to tracking which colors appear on all rods.

3. **Intersection of Multiple Arrays (LeetCode 2248)**: Find elements that appear in all arrays, analogous to finding rods that have all colors.

The core pattern is: when you need to track multiple properties or group items by some key while maintaining additional information about each group, consider using a dictionary/map where the key is the grouping attribute and the value tracks the additional information.

## Key Takeaways

1. **Use the right data structure for counting/grouping**: Sets are perfect for tracking unique items, bitmasks are efficient for small fixed sets of options.

2. **Look for fixed constraints**: The problem specifies exactly 10 rods and 3 colors. This allows for O(1) space solutions using fixed-size arrays.

3. **Process structured input efficiently**: When input has a regular pattern (like color-position pairs), use step iteration (`i += 2`) rather than complex parsing logic.

Related problems: [Check if All Characters Have Equal Number of Occurrences](/problem/check-if-all-characters-have-equal-number-of-occurrences)
