---
title: "How to Solve Count Pairs That Form a Complete Day II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Pairs That Form a Complete Day II. Medium difficulty, 43.6% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-08-20"
category: "dsa-patterns"
tags: ["count-pairs-that-form-a-complete-day-ii", "array", "hash-table", "counting", "medium"]
---

# How to Solve Count Pairs That Form a Complete Day II

You're given an array of integers `hours` where each value represents a time duration in hours. Your task is to count all pairs `(i, j)` where `i < j` and the sum `hours[i] + hours[j]` is a multiple of 24. This problem is interesting because it looks like a classic two-sum problem, but with modular arithmetic—instead of looking for a specific target sum, we need sums divisible by 24. The challenge is doing this efficiently for potentially large arrays.

## Visual Walkthrough

Let's trace through a concrete example: `hours = [12, 12, 12, 12, 12]`

We need to count pairs where the sum is divisible by 24. Let's think about what this means mathematically:

- `(hours[i] + hours[j]) % 24 == 0`
- This is equivalent to `hours[i] % 24 + hours[j] % 24 == 0` or `hours[i] % 24 + hours[j] % 24 == 24`

For our example, all values are 12. Each 12 % 24 = 12. So we need pairs where 12 + x = 24 (or 0), meaning x must be 12. So each 12 can only pair with another 12.

Let's count manually:

- First 12 (index 0) can pair with 12 at indices 1, 2, 3, 4 → 4 pairs
- Second 12 (index 1) can pair with 12 at indices 2, 3, 4 → 3 pairs
- Third 12 (index 2) can pair with 12 at indices 3, 4 → 2 pairs
- Fourth 12 (index 3) can pair with 12 at index 4 → 1 pair
- Total pairs = 4 + 3 + 2 + 1 = 10

Now let's try a more varied example: `hours = [24, 1, 23, 25, 47]`

First, compute remainders when divided by 24:

- 24 % 24 = 0
- 1 % 24 = 1
- 23 % 24 = 23
- 25 % 24 = 1
- 47 % 24 = 23

We need pairs where remainders sum to 0 or 24:

- Remainder 0 pairs with remainder 0 (0 + 0 = 0)
- Remainder 1 pairs with remainder 23 (1 + 23 = 24)

Let's find all pairs:

- Value at index 0 (remainder 0): No other 0s to pair with
- Value at index 1 (remainder 1): Pairs with index 2 (remainder 23) and index 4 (remainder 23)
- Value at index 2 (remainder 23): Already counted with index 1, also pairs with index 3 (remainder 1)
- Value at index 3 (remainder 1): Already counted with index 2
- Value at index 4 (remainder 23): Already counted with index 1

Total valid pairs: (1,2), (1,4), (2,3) = 3 pairs

## Brute Force Approach

The most straightforward approach is to check every possible pair:

1. Initialize a counter to 0
2. For each index `i` from 0 to n-2:
3. For each index `j` from i+1 to n-1:
4. Check if `(hours[i] + hours[j]) % 24 == 0`
5. If yes, increment the counter

This approach is simple but inefficient. For an array of size n, we check n×(n-1)/2 pairs, which gives us O(n²) time complexity. This is too slow for large arrays (n up to 10⁵ would require ~5×10⁹ operations).

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countCompleteDayPairs_brute(hours):
    n = len(hours)
    count = 0

    # Check every possible pair (i, j) where i < j
    for i in range(n - 1):
        for j in range(i + 1, n):
            # Check if sum is divisible by 24
            if (hours[i] + hours[j]) % 24 == 0:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countCompleteDayPairsBrute(hours) {
  let count = 0;
  const n = hours.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if sum is divisible by 24
      if ((hours[i] + hours[j]) % 24 === 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public long countCompleteDayPairsBrute(int[] hours) {
    long count = 0;
    int n = hours.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            // Check if sum is divisible by 24
            if ((hours[i] + hours[j]) % 24 == 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every pair. Instead, we can use modular arithmetic and a frequency map:

**Mathematical Insight:**

- We need `(hours[i] + hours[j]) % 24 == 0`
- This means `hours[i] % 24 + hours[j] % 24` must equal either 0 or 24
- Let `r1 = hours[i] % 24` and `r2 = hours[j] % 24`
- We need `r1 + r2 == 0` or `r1 + r2 == 24`
- Since remainders are between 0 and 23, `r1 + r2 == 0` only happens when both are 0
- And `r1 + r2 == 24` means if we know `r1`, we need `r2 = 24 - r1`

**Algorithm:**

1. Create a frequency array/map to count occurrences of each remainder (0-23)
2. For each hour value:
   - Calculate its remainder modulo 24
   - Update the frequency count
3. Count valid pairs:
   - For remainder 0: pairs = freq[0] × (freq[0] - 1) / 2 (each 0 pairs with every other 0)
   - For remainder r where 1 ≤ r ≤ 11: pairs = freq[r] × freq[24 - r] (each r pairs with each 24-r)
   - For remainder 12: pairs = freq[12] × (freq[12] - 1) / 2 (special case: 12 + 12 = 24)
4. Sum all these pair counts

**Why this works:**

- We're counting complementary remainders that sum to 0 or 24
- We handle each complementary pair only once by iterating r from 1 to 11
- Remainder 0 and 12 are special cases handled separately

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size array of 24 elements
def countCompleteDayPairs(hours):
    # Frequency array for remainders 0-23
    freq = [0] * 24

    # Step 1: Count frequency of each remainder
    for hour in hours:
        remainder = hour % 24
        freq[remainder] += 1

    # Step 2: Count pairs
    count = 0

    # Case 1: remainder 0 pairs with itself
    # Each 0 can pair with every other 0
    # Number of pairs = n choose 2 = freq[0] * (freq[0] - 1) // 2
    count += freq[0] * (freq[0] - 1) // 2

    # Case 2: remainder 12 pairs with itself (12 + 12 = 24)
    # Same logic as remainder 0
    count += freq[12] * (freq[12] - 1) // 2

    # Case 3: complementary remainders (1-11 with 23-13)
    # For each remainder r from 1 to 11, it pairs with remainder 24-r
    # Each element with remainder r can pair with each element with remainder 24-r
    for r in range(1, 12):
        count += freq[r] * freq[24 - r]

    return count
```

```javascript
// Time: O(n) | Space: O(1) - fixed size array of 24 elements
function countCompleteDayPairs(hours) {
  // Frequency array for remainders 0-23
  const freq = new Array(24).fill(0);

  // Step 1: Count frequency of each remainder
  for (const hour of hours) {
    const remainder = hour % 24;
    freq[remainder]++;
  }

  // Step 2: Count pairs
  let count = 0;

  // Case 1: remainder 0 pairs with itself
  // Each 0 can pair with every other 0
  // Number of pairs = n choose 2 = freq[0] * (freq[0] - 1) / 2
  count += (freq[0] * (freq[0] - 1)) / 2;

  // Case 2: remainder 12 pairs with itself (12 + 12 = 24)
  // Same logic as remainder 0
  count += (freq[12] * (freq[12] - 1)) / 2;

  // Case 3: complementary remainders (1-11 with 23-13)
  // For each remainder r from 1 to 11, it pairs with remainder 24-r
  // Each element with remainder r can pair with each element with remainder 24-r
  for (let r = 1; r < 12; r++) {
    count += freq[r] * freq[24 - r];
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1) - fixed size array of 24 elements
public long countCompleteDayPairs(int[] hours) {
    // Frequency array for remainders 0-23
    int[] freq = new int[24];

    // Step 1: Count frequency of each remainder
    for (int hour : hours) {
        int remainder = hour % 24;
        freq[remainder]++;
    }

    // Step 2: Count pairs
    long count = 0;

    // Case 1: remainder 0 pairs with itself
    // Each 0 can pair with every other 0
    // Number of pairs = n choose 2 = freq[0] * (freq[0] - 1) / 2
    count += (long) freq[0] * (freq[0] - 1) / 2;

    // Case 2: remainder 12 pairs with itself (12 + 12 = 24)
    // Same logic as remainder 0
    count += (long) freq[12] * (freq[12] - 1) / 2;

    // Case 3: complementary remainders (1-11 with 23-13)
    // For each remainder r from 1 to 11, it pairs with remainder 24-r
    // Each element with remainder r can pair with each element with remainder 24-r
    for (int r = 1; r < 12; r++) {
        count += (long) freq[r] * freq[24 - r];
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to count remainders: O(n)
- We then process 24 fixed remainders (12 iterations): O(1)
- Total: O(n) + O(1) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size array of 24 integers regardless of input size
- No additional space that grows with n

## Common Mistakes

1. **Forgetting the special case of remainder 12**: When r = 12, we need 12 + 12 = 24, which is divisible by 24. Some candidates only handle r from 1 to 11 and miss that 12 needs special handling similar to remainder 0.

2. **Integer overflow with large counts**: When n is large (up to 10⁵), the number of pairs can exceed 2³¹. Use 64-bit integers (long in Java/C++, long long in C) for the count variable.

3. **Double counting pairs**: When iterating through all remainders 0-23, if you do `for r in range(24): count += freq[r] * freq[(24-r) % 24]`, you'll count each pair twice (r with 24-r and 24-r with r). The correct approach is to only iterate r from 1 to 11.

4. **Incorrect pair counting for remainder 0 and 12**: Using `freq[0] * freq[0]` counts ordered pairs (i,j) and (j,i) and includes pairs where i=j. The correct formula is combinations: `freq[0] * (freq[0] - 1) / 2`.

## When You'll See This Pattern

This "complementary remainders" pattern appears in many problems involving modular arithmetic and pair counting:

1. **Pairs of Songs With Total Durations Divisible by 60 (LeetCode 1010)**: Almost identical problem but with modulus 60 instead of 24. The solution uses the same frequency map approach.

2. **Check If Array Pairs Are Divisible by k (LeetCode 1497)**: Generalization to any k, where you need to partition the array into pairs where each pair sums to a multiple of k.

3. **Two Sum (LeetCode 1)**: The classic problem uses a hash map to find complements, which is similar to finding remainder complements in this problem.

4. **Count Nice Pairs in an Array (LeetCode 1814)**: Uses a similar frequency map approach but with a different transformation (num - rev(num)).

## Key Takeaways

1. **Modular arithmetic transforms sum problems into remainder problems**: When you need sums divisible by k, work with remainders modulo k instead of the original values.

2. **Frequency maps reduce O(n²) to O(n)**: By counting how many elements have each remainder, you can compute pair counts mathematically without checking every pair.

3. **Handle special cases carefully**: Remainder 0 and remainder k/2 (when k is even) need special handling because they pair with themselves.

4. **Watch for integer overflow**: Pair counts can grow quadratically with n, so use appropriate data types (64-bit integers).

Related problems: [Pairs of Songs With Total Durations Divisible by 60](/problem/pairs-of-songs-with-total-durations-divisible-by-60), [Check If Array Pairs Are Divisible by k](/problem/check-if-array-pairs-are-divisible-by-k)
