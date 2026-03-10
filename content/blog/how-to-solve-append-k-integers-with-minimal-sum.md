---
title: "How to Solve Append K Integers With Minimal Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Append K Integers With Minimal Sum. Medium difficulty, 26.9% acceptance rate. Topics: Array, Math, Greedy, Sorting."
date: "2028-11-01"
category: "dsa-patterns"
tags: ["append-k-integers-with-minimal-sum", "array", "math", "greedy", "medium"]
---

# How to Solve Append K Integers With Minimal Sum

You need to append `k` unique positive integers that don't exist in `nums` to minimize their total sum. The challenge is efficiently finding which numbers are missing and selecting the smallest ones first. What makes this interesting is that while the concept is simple (pick the smallest missing numbers), implementing it efficiently requires careful handling of duplicates, sorting, and avoiding O(n²) operations.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 4, 25, 10, 25]`, `k = 2`

**Step 1: Sort and remove duplicates**
First, we need to know which numbers are already present. Sorting helps us identify gaps:

- Sorted unique: `[1, 4, 10, 25]` (removed duplicate 25)

**Step 2: Find missing numbers between existing ones**
We look for gaps between consecutive numbers:

- Between 1 and 4: missing numbers are 2, 3 (2 numbers)
- Between 4 and 10: missing numbers are 5, 6, 7, 8, 9 (5 numbers)
- Between 10 and 25: missing numbers are 11-24 (14 numbers)
- After 25: missing numbers are 26, 27, 28... (infinite)

**Step 3: Fill gaps with smallest missing numbers**
We need k=2 smallest missing numbers:

1. First gap (1-4) has 2 missing numbers: 2 and 3
2. We need exactly 2 numbers, so we take both: 2 + 3 = 5

But what if k=5? We'd take:

1. From first gap: 2, 3 (2 numbers)
2. From second gap: 5, 6, 7 (3 numbers to reach total of 5)
   Sum = 2+3+5+6+7 = 23

**Key insight:** We can calculate sums of consecutive missing numbers using the arithmetic series formula without actually generating each number.

## Brute Force Approach

A naive approach would:

1. Create a set of existing numbers
2. Start from 1 and check each positive integer
3. If not in set, add it to our sum and count it
4. Stop when we've found k numbers

<div class="code-group">

```python
# Time: O(n + k²) worst case | Space: O(n)
def minimalKSum_brute(nums, k):
    existing = set(nums)
    total = 0
    num = 1
    count = 0

    while count < k:
        if num not in existing:
            total += num
            count += 1
        num += 1

    return total
```

```javascript
// Time: O(n + k²) worst case | Space: O(n)
function minimalKSumBrute(nums, k) {
  const existing = new Set(nums);
  let total = 0;
  let num = 1;
  let count = 0;

  while (count < k) {
    if (!existing.has(num)) {
      total += num;
      count++;
    }
    num++;
  }

  return total;
}
```

```java
// Time: O(n + k²) worst case | Space: O(n)
public long minimalKSumBrute(int[] nums, int k) {
    Set<Integer> existing = new HashSet<>();
    for (int num : nums) {
        existing.add(num);
    }

    long total = 0;
    int num = 1;
    int count = 0;

    while (count < k) {
        if (!existing.contains(num)) {
            total += num;
            count++;
        }
        num++;
    }

    return total;
}
```

</div>

**Why this fails:** In the worst case where `nums` contains large numbers and `k` is large (up to 10⁵), we might need to check millions of numbers. If `nums = [1000000]` and `k = 100000`, we'd check 1,000,000 numbers one by one, giving O(k²) time complexity. The constraints (nums.length ≤ 10⁵, k ≤ 10⁵) make this too slow.

## Optimized Approach

The key insight is that we don't need to check every number individually. Instead:

1. **Sort and deduplicate** `nums` to identify what numbers are present
2. **Calculate gaps** between consecutive numbers in the sorted list
3. **Fill gaps efficiently** using the arithmetic series formula: sum from `a` to `b` = `(a + b) * (b - a + 1) / 2`
4. **Handle remaining numbers** after the largest number in `nums`

**Step-by-step reasoning:**

- Sort `nums` and remove duplicates
- Add sentinel values: 0 at the beginning (to handle missing numbers before the smallest element) and a large number at the end (to handle missing numbers after the largest element)
- For each pair of consecutive numbers `(prev, curr)`, calculate how many numbers are missing between them: `missing_count = curr - prev - 1`
- If `missing_count > 0`, we can take up to `min(missing_count, k)` numbers from this gap
- Use arithmetic series formula to sum these numbers efficiently
- If we still need more numbers after processing all gaps, they'll be consecutive numbers starting from `last_num + 1`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for sorting
def minimalKSum(nums, k):
    """
    Append k unique positive integers not in nums to minimize their sum.

    Approach:
    1. Sort and remove duplicates to identify gaps
    2. Process gaps between consecutive numbers
    3. Use arithmetic series formula to sum missing numbers efficiently
    4. Handle remaining numbers after the largest number
    """
    # Step 1: Sort and remove duplicates
    nums.sort()
    unique_nums = []
    for num in nums:
        if not unique_nums or num != unique_nums[-1]:
            unique_nums.append(num)

    total = 0
    prev = 0  # Start from 0 to handle numbers before the first element

    # Step 2: Process gaps between numbers
    for curr in unique_nums:
        # Calculate how many numbers are missing between prev and curr
        gap_size = curr - prev - 1

        if gap_size > 0:
            # We can take at most gap_size numbers from this gap
            take = min(gap_size, k)

            # First missing number in this gap
            first_missing = prev + 1
            # Last missing number we'll take from this gap
            last_missing = prev + take

            # Sum of arithmetic series: (first + last) * count / 2
            total += (first_missing + last_missing) * take // 2

            # Reduce k by how many numbers we took
            k -= take

            # If we've taken all k numbers, we're done
            if k == 0:
                return total

        # Move to next number
        prev = curr

    # Step 3: Handle remaining numbers after the largest number
    if k > 0:
        # First missing number after the largest number
        first_missing = prev + 1
        # Last missing number we need
        last_missing = prev + k

        # Sum of arithmetic series
        total += (first_missing + last_missing) * k // 2

    return total
```

```javascript
// Time: O(n log n) | Space: O(n) for sorting
function minimalKSum(nums, k) {
  /**
   * Append k unique positive integers not in nums to minimize their sum.
   *
   * Approach:
   * 1. Sort and remove duplicates to identify gaps
   * 2. Process gaps between consecutive numbers
   * 3. Use arithmetic series formula to sum missing numbers efficiently
   * 4. Handle remaining numbers after the largest number
   */

  // Step 1: Sort and remove duplicates
  nums.sort((a, b) => a - b);
  const uniqueNums = [];

  for (const num of nums) {
    if (uniqueNums.length === 0 || num !== uniqueNums[uniqueNums.length - 1]) {
      uniqueNums.push(num);
    }
  }

  let total = 0n; // Use BigInt to handle large sums
  let prev = 0; // Start from 0 to handle numbers before the first element

  // Step 2: Process gaps between numbers
  for (const curr of uniqueNums) {
    // Calculate how many numbers are missing between prev and curr
    const gapSize = curr - prev - 1;

    if (gapSize > 0) {
      // We can take at most gapSize numbers from this gap
      const take = Math.min(gapSize, k);

      // First missing number in this gap
      const firstMissing = prev + 1;
      // Last missing number we'll take from this gap
      const lastMissing = prev + take;

      // Sum of arithmetic series: (first + last) * count / 2
      // Use BigInt to avoid overflow
      const sumForGap = (BigInt(firstMissing + lastMissing) * BigInt(take)) / 2n;
      total += sumForGap;

      // Reduce k by how many numbers we took
      k -= take;

      // If we've taken all k numbers, we're done
      if (k === 0) {
        return Number(total);
      }
    }

    // Move to next number
    prev = curr;
  }

  // Step 3: Handle remaining numbers after the largest number
  if (k > 0) {
    // First missing number after the largest number
    const firstMissing = prev + 1;
    // Last missing number we need
    const lastMissing = prev + k;

    // Sum of arithmetic series
    const remainingSum = (BigInt(firstMissing + lastMissing) * BigInt(k)) / 2n;
    total += remainingSum;
  }

  return Number(total);
}
```

```java
// Time: O(n log n) | Space: O(n) for sorting
public long minimalKSum(int[] nums, int k) {
    /**
     * Append k unique positive integers not in nums to minimize their sum.
     *
     * Approach:
     * 1. Sort and remove duplicates to identify gaps
     * 2. Process gaps between consecutive numbers
     * 3. Use arithmetic series formula to sum missing numbers efficiently
     * 4. Handle remaining numbers after the largest number
     */

    // Step 1: Sort the array
    Arrays.sort(nums);

    long total = 0;
    long prev = 0;  // Start from 0 to handle numbers before the first element

    // Step 2: Process gaps between numbers
    for (int i = 0; i < nums.length; i++) {
        // Skip duplicates
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }

        long curr = nums[i];

        // Calculate how many numbers are missing between prev and curr
        long gapSize = curr - prev - 1;

        if (gapSize > 0) {
            // We can take at most gapSize numbers from this gap
            long take = Math.min(gapSize, k);

            // First missing number in this gap
            long firstMissing = prev + 1;
            // Last missing number we'll take from this gap
            long lastMissing = prev + take;

            // Sum of arithmetic series: (first + last) * count / 2
            // Using long to avoid overflow
            total += (firstMissing + lastMissing) * take / 2;

            // Reduce k by how many numbers we took
            k -= take;

            // If we've taken all k numbers, we're done
            if (k == 0) {
                return total;
            }
        }

        // Move to next number
        prev = curr;
    }

    // Step 3: Handle remaining numbers after the largest number
    if (k > 0) {
        // First missing number after the largest number
        long firstMissing = prev + 1;
        // Last missing number we need
        long lastMissing = prev + k;

        // Sum of arithmetic series
        total += (firstMissing + lastMissing) * k / 2;
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- Processing the sorted array takes O(n) time
- The dominant factor is sorting, giving us O(n log n) overall

**Space Complexity: O(n) or O(1)**

- If we create a new deduplicated array: O(n) for storing unique numbers
- If we process in-place while skipping duplicates: O(1) extra space (excluding input storage)
- The sorting algorithm may use O(log n) to O(n) space depending on implementation

## Common Mistakes

1. **Not handling duplicates**: If `nums = [1, 1, 1]`, some candidates might think there are no missing numbers between 1 and 1. Always deduplicate first.

2. **Integer overflow**: The sum can be large (k up to 10⁵, numbers up to 10⁹). Using 32-bit integers can overflow. Always use 64-bit integers (long in Java/C++, BigInt in JavaScript).

3. **Forgetting numbers after the largest element**: After processing all gaps between existing numbers, you might still need more numbers. These will be consecutive numbers starting from `last_element + 1`.

4. **Inefficient gap processing**: Some candidates try to generate each missing number individually instead of using the arithmetic series formula. This turns O(n) gap processing into O(k) which can be too slow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Gap analysis with sorting**: Similar to "Kth Missing Positive Number" (LeetCode 1539), where you find missing numbers in a sequence by analyzing gaps between sorted elements.

2. **Arithmetic series optimization**: When you need the sum of consecutive numbers, use the formula instead of looping. Appears in problems like "Sum of All Odd Length Subarrays" (LeetCode 1588).

3. **Deduplication with sorting**: A common preprocessing step in many array problems to simplify logic, seen in "3Sum" (LeetCode 15) and "Merge Intervals" (LeetCode 56).

Related problems:

- **Kth Missing Positive Number**: Same gap analysis concept but finding a specific missing number rather than summing k of them.
- **Find All Numbers Disappeared in an Array**: Identifying missing numbers in a sequence, though with different constraints.
- **Remove K Digits**: While not about missing numbers, it shares the greedy "choose smallest first" approach.

## Key Takeaways

1. **Sorting reveals structure**: When dealing with missing numbers or gaps in sequences, sorting first often simplifies the problem dramatically.

2. **Use mathematical formulas for sequences**: When you need sums or counts of arithmetic sequences, use formulas rather than loops. The sum from a to b is `(a + b) * (b - a + 1) / 2`.

3. **Handle edge cases systematically**: Always consider duplicates, numbers before the smallest element, and numbers after the largest element when working with sequences.

Related problems: [Remove K Digits](/problem/remove-k-digits), [Find All Numbers Disappeared in an Array](/problem/find-all-numbers-disappeared-in-an-array), [Kth Missing Positive Number](/problem/kth-missing-positive-number)
