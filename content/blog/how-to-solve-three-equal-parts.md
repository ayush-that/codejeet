---
title: "How to Solve Three Equal Parts — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Three Equal Parts. Hard difficulty, 41.2% acceptance rate. Topics: Array, Math."
date: "2029-02-15"
category: "dsa-patterns"
tags: ["three-equal-parts", "array", "math", "hard"]
---

# How to Solve Three Equal Parts

This problem asks us to divide a binary array into three non-empty parts that represent the same binary value when interpreted as binary numbers. The challenge lies in efficiently determining if such a division exists and finding the split points, given that binary numbers can have leading zeros but trailing zeros matter for value equality.

**What makes this tricky:** The binary values can be extremely large (arrays up to 30,000 elements), so we cannot actually convert to integers. We need to work with the binary representation directly. Additionally, leading zeros in each part don't affect the binary value, but trailing zeros do, creating asymmetry in how we handle zeros.

## Visual Walkthrough

Let's trace through example `arr = [1,0,1,0,1,0,1,0,1,0]`:

1. **Count total ones**: There are 5 ones total. For three equal parts, each part must have the same number of ones, so 5 must be divisible by 3. It's not (5 % 3 = 2), so immediately we know it's impossible.

Now try `arr = [1,0,1,0,1]`:

1. **Count total ones**: 3 ones total. 3 ÷ 3 = 1, so each part needs exactly 1 one.
2. **Find one positions**: The ones are at indices [0, 2, 4].
3. **Determine part boundaries**:
   - First part ends at index where its last one is: index 0
   - Second part starts after index 0 and ends where its last one is: index 2
   - Third part starts after index 2
4. **Check trailing zeros**: Each part's binary value is determined by the pattern from its first one to its end. The third part has no trailing zeros after its one (ends at array end). First part would need to end at index 0, but then second part would start at 1 and have leading zeros before its one at index 2. This doesn't work because trailing zeros must match.

Let's try a working example: `arr = [1,1,0,0,1,1,0,0,1,1]`:

1. **Count total ones**: 6 ones. 6 ÷ 3 = 2, so each part needs 2 ones.
2. **Find one positions**: Ones at indices [0,1,4,5,8,9].
3. **Group by part**:
   - Part 1: indices 0,1 (first 2 ones)
   - Part 2: indices 4,5 (next 2 ones)
   - Part 3: indices 8,9 (last 2 ones)
4. **Check alignment**: Each part's ones form the same pattern "11". The zeros between ones don't matter as long as each part has the same number of trailing zeros after its last one.
5. **Calculate trailing zeros**:
   - From part 3's last one (index 9) to array end: 0 zeros
   - Part 2 must end with 0 zeros after its last one (index 5), so part 2 ends at index 5
   - Part 1 must end with 0 zeros after its last one (index 1), so part 1 ends at index 1
6. **Verify**:
   - Part 1: [1,1] = binary 3
   - Part 2: [0,0,1,1] = binary 3 (leading zeros don't matter)
   - Part 3: [0,0,1,1] = binary 3
   - Return [1, 6] (i=1, j=6 since j is start of third part)

## Brute Force Approach

A naive approach would try all possible split points `i` and `j`:

- For each `i` from 0 to n-3
- For each `j` from i+2 to n-1
- Extract the three parts
- Convert each to binary number (or compare strings ignoring leading zeros)
- Check if all three are equal

**Why this fails:**

1. **Time complexity**: O(n³) for trying all splits × O(n) for comparing = O(n⁴) worst case
2. **Number size**: With n up to 30,000, binary numbers would have up to 30,000 bits, far beyond what fits in standard integers
3. **Leading zeros**: Simple integer conversion would ignore leading zeros, but "001" and "1" are different as binary strings (though equal as numbers)

Even comparing as strings while ignoring leading zeros is O(n) per comparison, giving O(n³) total, which is still far too slow for n=30,000.

## Optimized Approach

The key insight is that **the binary value is determined entirely by the pattern of ones**. Since leading zeros don't affect the value, we only need to ensure:

1. **Equal number of ones**: Total ones must be divisible by 3, with each part getting ones/3 ones.
2. **Same pattern of ones**: The relative positions of ones within each part must be identical.
3. **Sufficient trailing zeros**: Each part must have at least as many zeros after its last one as the third part (which has the most trailing zeros fixed by the array end).

**Step-by-step reasoning:**

1. **Count total ones** - if not divisible by 3, return [-1,-1]
2. **If no ones** - special case: entire array is zeros, any valid split works (e.g., [0, n-1])
3. **Find one positions** - store indices of all ones
4. **Calculate target ones per part** = total_ones / 3
5. **Check pattern match** - compare the sequences of gaps between ones in each part
6. **Calculate required trailing zeros** = (n - 1) - last_one_position_in_part3
7. **Verify each part has enough zeros** after its last one to accommodate required trailing zeros
8. **Return split points** based on where each part ends

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def threeEqualParts(arr):
    n = len(arr)

    # Step 1: Count total number of ones
    total_ones = sum(arr)

    # If no ones, we can split anywhere since all parts will be 0
    if total_ones == 0:
        return [0, n - 1]

    # If total ones not divisible by 3, impossible to have equal parts
    if total_ones % 3 != 0:
        return [-1, -1]

    # Step 2: Each part should have target_ones ones
    target_ones = total_ones // 3

    # Step 3: Find the indices of all ones
    one_indices = [i for i, bit in enumerate(arr) if bit == 1]

    # Step 4: Check if the pattern of ones matches across all three parts
    # Compare gaps between consecutive ones in each part
    first_start, second_start, third_start = (
        one_indices[0],  # First one of first part
        one_indices[target_ones],  # First one of second part
        one_indices[target_ones * 2]  # First one of third part
    )

    # The length of the third part determines trailing zeros requirement
    third_len = n - third_start

    # Check that all three parts have the same pattern of ones
    # by comparing relative positions within each part
    for k in range(third_len):
        # Check all three parts have same bit at corresponding positions
        # relative to their first one
        if (arr[first_start + k] != arr[second_start + k] or
            arr[first_start + k] != arr[third_start + k]):
            return [-1, -1]

    # Step 5: Calculate trailing zeros needed after each part's last one
    # Third part's trailing zeros = from its last one to end of array
    last_one_in_part3 = one_indices[-1]
    trailing_zeros_needed = n - 1 - last_one_in_part3

    # Check first part has enough zeros after its last one
    last_one_in_part1 = one_indices[target_ones - 1]
    if last_one_in_part1 + trailing_zeros_needed >= second_start:
        return [-1, -1]

    # Check second part has enough zeros after its last one
    last_one_in_part2 = one_indices[target_ones * 2 - 1]
    if last_one_in_part2 + trailing_zeros_needed >= third_start:
        return [-1, -1]

    # Step 6: Return split points
    # i = end of first part (last index of first part)
    # j = start of third part (first index of third part)
    i = last_one_in_part1 + trailing_zeros_needed
    j = last_one_in_part2 + trailing_zeros_needed + 1

    return [i, j]
```

```javascript
// Time: O(n) | Space: O(n)
function threeEqualParts(arr) {
  const n = arr.length;

  // Step 1: Count total number of ones
  let totalOnes = arr.reduce((sum, bit) => sum + bit, 0);

  // If no ones, we can split anywhere since all parts will be 0
  if (totalOnes === 0) {
    return [0, n - 1];
  }

  // If total ones not divisible by 3, impossible to have equal parts
  if (totalOnes % 3 !== 0) {
    return [-1, -1];
  }

  // Step 2: Each part should have targetOnes ones
  const targetOnes = totalOnes / 3;

  // Step 3: Find the indices of all ones
  const oneIndices = [];
  for (let i = 0; i < n; i++) {
    if (arr[i] === 1) {
      oneIndices.push(i);
    }
  }

  // Step 4: Get starting indices for each part
  const firstStart = oneIndices[0]; // First one of first part
  const secondStart = oneIndices[targetOnes]; // First one of second part
  const thirdStart = oneIndices[targetOnes * 2]; // First one of third part

  // The length of the third part determines trailing zeros requirement
  const thirdLen = n - thirdStart;

  // Check that all three parts have the same pattern of ones
  // by comparing relative positions within each part
  for (let k = 0; k < thirdLen; k++) {
    // Check all three parts have same bit at corresponding positions
    if (
      arr[firstStart + k] !== arr[secondStart + k] ||
      arr[firstStart + k] !== arr[thirdStart + k]
    ) {
      return [-1, -1];
    }
  }

  // Step 5: Calculate trailing zeros needed after each part's last one
  // Third part's trailing zeros = from its last one to end of array
  const lastOneInPart3 = oneIndices[oneIndices.length - 1];
  const trailingZerosNeeded = n - 1 - lastOneInPart3;

  // Check first part has enough zeros after its last one
  const lastOneInPart1 = oneIndices[targetOnes - 1];
  if (lastOneInPart1 + trailingZerosNeeded >= secondStart) {
    return [-1, -1];
  }

  // Check second part has enough zeros after its last one
  const lastOneInPart2 = oneIndices[targetOnes * 2 - 1];
  if (lastOneInPart2 + trailingZerosNeeded >= thirdStart) {
    return [-1, -1];
  }

  // Step 6: Return split points
  // i = end of first part (last index of first part)
  // j = start of third part (first index of third part)
  const i = lastOneInPart1 + trailingZerosNeeded;
  const j = lastOneInPart2 + trailingZerosNeeded + 1;

  return [i, j];
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] threeEqualParts(int[] arr) {
        int n = arr.length;

        // Step 1: Count total number of ones
        int totalOnes = 0;
        for (int bit : arr) {
            totalOnes += bit;
        }

        // If no ones, we can split anywhere since all parts will be 0
        if (totalOnes == 0) {
            return new int[]{0, n - 1};
        }

        // If total ones not divisible by 3, impossible to have equal parts
        if (totalOnes % 3 != 0) {
            return new int[]{-1, -1};
        }

        // Step 2: Each part should have targetOnes ones
        int targetOnes = totalOnes / 3;

        // Step 3: Find the indices of all ones
        int[] oneIndices = new int[totalOnes];
        int idx = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] == 1) {
                oneIndices[idx++] = i;
            }
        }

        // Step 4: Get starting indices for each part
        int firstStart = oneIndices[0];  // First one of first part
        int secondStart = oneIndices[targetOnes];  // First one of second part
        int thirdStart = oneIndices[targetOnes * 2];  // First one of third part

        // The length of the third part determines trailing zeros requirement
        int thirdLen = n - thirdStart;

        // Check that all three parts have the same pattern of ones
        // by comparing relative positions within each part
        for (int k = 0; k < thirdLen; k++) {
            // Check all three parts have same bit at corresponding positions
            if (arr[firstStart + k] != arr[secondStart + k] ||
                arr[firstStart + k] != arr[thirdStart + k]) {
                return new int[]{-1, -1};
            }
        }

        // Step 5: Calculate trailing zeros needed after each part's last one
        // Third part's trailing zeros = from its last one to end of array
        int lastOneInPart3 = oneIndices[totalOnes - 1];
        int trailingZerosNeeded = n - 1 - lastOneInPart3;

        // Check first part has enough zeros after its last one
        int lastOneInPart1 = oneIndices[targetOnes - 1];
        if (lastOneInPart1 + trailingZerosNeeded >= secondStart) {
            return new int[]{-1, -1};
        }

        // Check second part has enough zeros after its last one
        int lastOneInPart2 = oneIndices[targetOnes * 2 - 1];
        if (lastOneInPart2 + trailingZerosNeeded >= thirdStart) {
            return new int[]{-1, -1};
        }

        // Step 6: Return split points
        // i = end of first part (last index of first part)
        // j = start of third part (first index of third part)
        int i = lastOneInPart1 + trailingZerosNeeded;
        int j = lastOneInPart2 + trailingZerosNeeded + 1;

        return new int[]{i, j};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting ones: O(n)
- Collecting one indices: O(n)
- Pattern comparison: O(third_len) ≤ O(n)
- All other operations: O(1)
- Total: O(n)

**Space Complexity: O(n)**

- Storing indices of all ones: O(total_ones) ≤ O(n)
- Rest of operations: O(1)
- In worst case (all ones), we store n indices

## Common Mistakes

1. **Not handling all-zeros case**: When array has no ones, all parts equal 0. Many candidates return [-1,-1] instead of a valid split like [0, n-1].

2. **Incorrect trailing zeros calculation**: The third part's trailing zeros are fixed (from its last one to array end). Other parts must have _at least_ that many zeros after their last one, not necessarily exactly that many.

3. **Comparing absolute positions instead of patterns**: Checking if one indices are equally spaced rather than checking if the binary patterns match. Example: [1,0,1] and [1,1,0] have same number of ones but different patterns.

4. **Off-by-one errors in split points**: Forgetting that `j` is the start index of the third part, not the end of the second part. The condition requires `i + 1 < j`, so `j` must be at least `i + 2`.

## When You'll See This Pattern

This problem uses **pattern matching with constraints**, a common pattern in array problems:

1. **Compare Strings from Different Starting Points** (LeetCode 796): Rotate string A to check if it equals B. Similar to comparing patterns from different starting indices.

2. **Partition Labels** (LeetCode 763): Divide string into parts where each letter appears in only one part. Uses counting and boundary detection like our ones counting.

3. **Divide Array in Sets of K Consecutive Numbers** (LeetCode 1296): Group numbers where pattern/grouping matters more than exact values.

The core technique is identifying that certain elements (here, ones) determine the structure, and other elements (zeros) must fit around that structure according to specific rules.

## Key Takeaways

1. **Look for invariant properties**: Here, the number of ones must be divisible by 3, and the pattern of ones must match. Identifying such invariants simplifies complex problems.

2. **Handle edge cases explicitly**: The all-zeros case requires special handling. Always test with arrays containing 0, 1, and mixed numbers of ones.

3. **Trailing vs leading zeros asymmetry**: In binary numbers, leading zeros don't affect value but trailing zeros do. This asymmetry creates the constraint that earlier parts must have enough zeros after their last one.

[Practice this problem on CodeJeet](/problem/three-equal-parts)
