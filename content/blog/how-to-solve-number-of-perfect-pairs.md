---
title: "How to Solve Number of Perfect Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Perfect Pairs. Medium difficulty, 33.4% acceptance rate. Topics: Array, Math, Two Pointers, Sorting."
date: "2029-10-18"
category: "dsa-patterns"
tags: ["number-of-perfect-pairs", "array", "math", "two-pointers", "medium"]
---

# How to Solve Number of Perfect Pairs

This problem asks us to count pairs of indices `(i, j)` where `i < j` and the numbers satisfy two mathematical conditions involving absolute values of their sum and difference. What makes this problem tricky is that the conditions look complex at first glance, but they actually simplify to a much cleaner relationship when you analyze the math carefully. The challenge is recognizing this simplification and then implementing an efficient counting strategy.

## Visual Walkthrough

Let's walk through a small example: `nums = [1, 3, 5, 7]`

We need to check all pairs where `i < j`:

**Pair (0, 1):** `a = 1`, `b = 3`

- `min(|1-3|, |1+3|) = min(2, 4) = 2`
- `max(|1-3|, |1+3|) = max(2, 4) = 4`
- `min(|1|, |3|) = 1`
- `max(|1|, |3|) = 3`
- Condition 1: `2 <= 1`? **False** (2 is not ≤ 1)
- Since first condition fails, this is NOT a perfect pair

**Pair (0, 2):** `a = 1`, `b = 5`

- `min(|1-5|, |1+5|) = min(4, 6) = 4`
- `max(|1-5|, |1+5|) = max(4, 6) = 6`
- `min(|1|, |5|) = 1`
- `max(|1|, |5|) = 5`
- Condition 1: `4 <= 1`? **False**
- NOT a perfect pair

**Pair (0, 3):** `a = 1`, `b = 7`

- `min(|1-7|, |1+7|) = min(6, 8) = 6`
- `max(|1-7|, |1+7|) = max(6, 8) = 8`
- `min(|1|, |7|) = 1`
- `max(|1|, |7|) = 7`
- Condition 1: `6 <= 1`? **False**
- NOT a perfect pair

**Pair (1, 2):** `a = 3`, `b = 5`

- `min(|3-5|, |3+5|) = min(2, 8) = 2`
- `max(|3-5|, |3+5|) = max(2, 8) = 8`
- `min(|3|, |5|) = 3`
- `max(|3|, |5|) = 5`
- Condition 1: `2 <= 3`? **True** ✓
- Condition 2: `8 >= 5`? **True** ✓
- This IS a perfect pair!

**Pair (1, 3):** `a = 3`, `b = 7`

- `min(|3-7|, |3+7|) = min(4, 10) = 4`
- `max(|3-7|, |3+7|) = max(4, 10) = 10`
- `min(|3|, |7|) = 3`
- `max(|3|, |7|) = 7`
- Condition 1: `4 <= 3`? **False**
- NOT a perfect pair

**Pair (2, 3):** `a = 5`, `b = 7`

- `min(|5-7|, |5+7|) = min(2, 12) = 2`
- `max(|5-7|, |5+7|) = max(2, 12) = 12`
- `min(|5|, |7|) = 5`
- `max(|5|, |7|) = 7`
- Condition 1: `2 <= 5`? **True** ✓
- Condition 2: `12 >= 7`? **True** ✓
- This IS a perfect pair!

So for `[1, 3, 5, 7]`, we have 2 perfect pairs: `(1, 2)` and `(2, 3)`.

## Brute Force Approach

The most straightforward approach is to check every possible pair `(i, j)` where `i < j` and test both conditions:

1. For each `i` from `0` to `n-2`:
2. For each `j` from `i+1` to `n-1`:
3. Let `a = nums[i]`, `b = nums[j]`
4. Compute `minDiffSum = min(|a-b|, |a+b|)`
5. Compute `maxDiffSum = max(|a-b|, |a+b|)`
6. Compute `minAbs = min(|a|, |b|)`
7. Compute `maxAbs = max(|a|, |b|)`
8. If `minDiffSum <= minAbs` AND `maxDiffSum >= maxAbs`, count this pair

This approach is simple to implement but has O(n²) time complexity, which is too slow for large arrays (n up to 10⁵ would require ~10¹⁰ operations).

<div class="code-group">

```python
# Brute Force Solution - Too Slow for Large Inputs
# Time: O(n²) | Space: O(1)
def countPerfectPairsBrute(nums):
    n = len(nums)
    count = 0

    for i in range(n):
        for j in range(i + 1, n):
            a = nums[i]
            b = nums[j]

            # Compute the four values needed for the conditions
            diff = abs(a - b)
            summ = abs(a + b)
            min_diff_sum = min(diff, summ)
            max_diff_sum = max(diff, summ)
            min_abs = min(abs(a), abs(b))
            max_abs = max(abs(a), abs(b))

            # Check both conditions
            if min_diff_sum <= min_abs and max_diff_sum >= max_abs:
                count += 1

    return count
```

```javascript
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n²) | Space: O(1)
function countPerfectPairsBrute(nums) {
  let count = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = nums[i];
      const b = nums[j];

      // Compute the four values needed for the conditions
      const diff = Math.abs(a - b);
      const sum = Math.abs(a + b);
      const minDiffSum = Math.min(diff, sum);
      const maxDiffSum = Math.max(diff, sum);
      const minAbs = Math.min(Math.abs(a), Math.abs(b));
      const maxAbs = Math.max(Math.abs(a), Math.abs(b));

      // Check both conditions
      if (minDiffSum <= minAbs && maxDiffSum >= maxAbs) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n²) | Space: O(1)
public int countPerfectPairsBrute(int[] nums) {
    int count = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int a = nums[i];
            int b = nums[j];

            // Compute the four values needed for the conditions
            int diff = Math.abs(a - b);
            int sum = Math.abs(a + b);
            int minDiffSum = Math.min(diff, sum);
            int maxDiffSum = Math.max(diff, sum);
            int minAbs = Math.min(Math.abs(a), Math.abs(b));
            int maxAbs = Math.max(Math.abs(a), Math.abs(b));

            // Check both conditions
            if (minDiffSum <= minAbs && maxDiffSum >= maxAbs) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that the two conditions can be simplified mathematically. Let's analyze:

Let `x = |a|` and `y = |b|`, and assume without loss of generality that `x ≤ y` (we can always swap `a` and `b` since the conditions are symmetric).

Then:

- `min(|a|, |b|) = x`
- `max(|a|, |b|) = y`

Now consider `|a - b|` and `|a + b|`:

- `|a - b|` could be `|x - y|` or `|x + y|` depending on signs
- `|a + b|` could be `|x + y|` or `|x - y|` depending on signs

The key observation: **The smaller of `|a-b|` and `|a+b|` is always `|x - y|`, and the larger is always `x + y`**, regardless of the signs of `a` and `b`.

Why? Because:

- If `a` and `b` have the same sign: `|a+b| = x+y` and `|a-b| = |x-y|`
- If `a` and `b` have opposite signs: `|a+b| = |x-y|` and `|a-b| = x+y`

So in both cases, the smaller value is `|x-y|` and the larger is `x+y`.

Now our conditions become:

1. `|x-y| ≤ x` (since `min(|a|,|b|) = x`)
2. `x+y ≥ y` (since `max(|a|,|b|) = y`)

The second condition simplifies to `x ≥ 0`, which is always true since `x = |a| ≥ 0`.

So we only need to check: `|x-y| ≤ x`

Since `x ≤ y`, we have `|x-y| = y-x`, so the condition becomes:
`y - x ≤ x` → `y ≤ 2x`

Therefore, **the pair `(a, b)` is perfect if and only if:**
`min(|a|, |b|) * 2 ≥ max(|a|, |b|)`

This is a much simpler condition! Now we need to count pairs where the smaller absolute value is at least half of the larger absolute value.

## Optimal Solution

With the simplified condition, we can use sorting and two pointers:

1. Take absolute values of all numbers
2. Sort the array of absolute values
3. For each element as the potential smaller value, find how many elements to its right satisfy `smaller * 2 ≥ larger`

We can use a two-pointer approach where for each `i` (as the smaller), we find the largest `j` such that `nums[i] * 2 ≥ nums[j]`. All elements from `i+1` to `j` form valid pairs with `i`.

<div class="code-group">

```python
# Optimal Solution using Sorting and Two Pointers
# Time: O(n log n) | Space: O(n) for the sorted array (or O(1) if we sort in-place)
def countPerfectPairs(nums):
    # Step 1: Take absolute values of all numbers
    abs_nums = [abs(num) for num in nums]

    # Step 2: Sort the absolute values
    abs_nums.sort()

    n = len(abs_nums)
    count = 0
    j = 0

    # Step 3: Use two pointers to count valid pairs
    # For each i as the smaller element, find all j > i where nums[i] * 2 >= nums[j]
    for i in range(n):
        # Move j forward while the condition holds
        # We start j from max(i+1, current j) to avoid going backwards
        j = max(j, i + 1)

        # Expand j as far as possible while condition holds
        while j < n and abs_nums[i] * 2 >= abs_nums[j]:
            j += 1

        # All elements from i+1 to j-1 form valid pairs with i
        # (j-1) - (i+1) + 1 = j - i - 1
        count += (j - i - 1)

    return count
```

```javascript
// Optimal Solution using Sorting and Two Pointers
// Time: O(n log n) | Space: O(n) for the sorted array
function countPerfectPairs(nums) {
  // Step 1: Take absolute values of all numbers
  const absNums = nums.map((num) => Math.abs(num));

  // Step 2: Sort the absolute values
  absNums.sort((a, b) => a - b);

  const n = absNums.length;
  let count = 0;
  let j = 0;

  // Step 3: Use two pointers to count valid pairs
  // For each i as the smaller element, find all j > i where nums[i] * 2 >= nums[j]
  for (let i = 0; i < n; i++) {
    // Move j forward while the condition holds
    // We start j from max(i+1, current j) to avoid going backwards
    j = Math.max(j, i + 1);

    // Expand j as far as possible while condition holds
    while (j < n && absNums[i] * 2 >= absNums[j]) {
      j++;
    }

    // All elements from i+1 to j-1 form valid pairs with i
    // (j-1) - (i+1) + 1 = j - i - 1
    count += j - i - 1;
  }

  return count;
}
```

```java
// Optimal Solution using Sorting and Two Pointers
// Time: O(n log n) | Space: O(n) for the sorted array
public int countPerfectPairs(int[] nums) {
    // Step 1: Take absolute values of all numbers
    int[] absNums = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        absNums[i] = Math.abs(nums[i]);
    }

    // Step 2: Sort the absolute values
    Arrays.sort(absNums);

    int n = absNums.length;
    int count = 0;
    int j = 0;

    // Step 3: Use two pointers to count valid pairs
    // For each i as the smaller element, find all j > i where nums[i] * 2 >= nums[j]
    for (int i = 0; i < n; i++) {
        // Move j forward while the condition holds
        // We start j from max(i+1, current j) to avoid going backwards
        j = Math.max(j, i + 1);

        // Expand j as far as possible while condition holds
        while (j < n && absNums[i] * 2 >= absNums[j]) {
            j++;
        }

        // All elements from i+1 to j-1 form valid pairs with i
        // (j-1) - (i+1) + 1 = j - i - 1
        count += (j - i - 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Taking absolute values: O(n)
- Sorting the array: O(n log n) - this is the dominant term
- Two-pointer traversal: O(n) - each pointer moves at most n times
- Total: O(n log n)

**Space Complexity:** O(n)

- We create a new array for absolute values: O(n)
- If we modify the input array in-place to store absolute values and sort it, we could achieve O(1) extra space, but typically we don't modify input unless specified

## Common Mistakes

1. **Not simplifying the conditions mathematically**: Many candidates try to implement the conditions directly without realizing they simplify to `min(|a|,|b|) * 2 ≥ max(|a|,|b|)`. This leads to more complex code and missed optimization opportunities.

2. **Forgetting to take absolute values**: The conditions involve `|a|` and `|b|`, so we need to work with absolute values. Using the original signed values will give incorrect results.

3. **Off-by-one errors in the two-pointer counting**: When counting pairs `(i, j)` where `i < j`, it's easy to miscount. Remember that if `j` is the first index where the condition fails, then valid indices are from `i+1` to `j-1`, which gives `j - i - 1` pairs.

4. **Not handling the case where all elements are the same**: If all elements have the same absolute value, then `x * 2 ≥ x` is always true, so all pairs should be counted. The two-pointer approach correctly handles this.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Mathematical simplification of conditions**: Similar to problems where complex conditions simplify to simpler relationships, like:
   - [LeetCode 1497: Check If Array Pairs Are Divisible by k](https://leetcode.com/problems/check-if-array-pairs-are-divisible-by-k/) - conditions about remainders
   - [LeetCode 1010: Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/) - modular arithmetic simplification

2. **Two-pointer counting of pairs in sorted array**: This is a common technique for counting pairs that satisfy some inequality:
   - [LeetCode 611: Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number/) - count triplets where `a + b > c`
   - [LeetCode 259: 3Sum Smaller](https://leetcode.com/problems/3sum-smaller/) - count triplets with sum less than target

3. **Absolute value transformations**: Problems that become simpler when considering absolute values:
   - [LeetCode 462: Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/) - finding median minimizes sum of absolute differences

## Key Takeaways

1. **Always look for mathematical simplifications**: When faced with complex conditions, spend a few minutes trying to simplify them algebraically. This can transform an O(n²) problem into an O(n log n) one.

2. **Sorting often helps with pair-counting problems**: If you need to count pairs `(i, j)` satisfying some inequality, sorting the array and using two pointers is a powerful technique.

3. **Absolute values can change the problem structure**: Taking absolute values can simplify problems by removing sign considerations, but be careful - it changes which pairs are being compared (we lose the original indices' order).

[Practice this problem on CodeJeet](/problem/number-of-perfect-pairs)
