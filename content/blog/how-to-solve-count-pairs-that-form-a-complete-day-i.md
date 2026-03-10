---
title: "How to Solve Count Pairs That Form a Complete Day I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Pairs That Form a Complete Day I. Easy difficulty, 78.0% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2027-12-19"
category: "dsa-patterns"
tags: ["count-pairs-that-form-a-complete-day-i", "array", "hash-table", "counting", "easy"]
---

# How to Solve Count Pairs That Form a Complete Day I

This problem asks us to count pairs of indices `(i, j)` where `i < j` and the sum of their corresponding values in the `hours` array is a multiple of 24. While the problem is classified as "Easy," it teaches a fundamental pattern for counting complementary pairs that's essential for many array problems. The key insight is recognizing that we don't need to check every possible pair—we can use modular arithmetic and a frequency map to count efficiently.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `hours = [12, 12, 30, 18, 6]`.

We need pairs whose sum is divisible by 24. Let's think about what this means mathematically:

- `(hours[i] + hours[j]) % 24 == 0`
- This is equivalent to `hours[i] % 24 + hours[j] % 24 == 0` or `hours[i] % 24 + hours[j] % 24 == 24`

Let's calculate remainders when divided by 24:

- 12 % 24 = 12
- 12 % 24 = 12
- 30 % 24 = 6
- 18 % 24 = 18
- 6 % 24 = 6

Now we need pairs where remainder sums are 0 or 24:

- Remainder 12 pairs with remainder 12 (12 + 12 = 24)
- Remainder 6 pairs with remainder 18 (6 + 18 = 24)
- Remainder 0 pairs with remainder 0 (0 + 0 = 0)

Let's count systematically:

1. First element 12 (remainder 12): needs remainder 12 to make 24
2. Second element 12 (remainder 12): can pair with the first 12 → 1 pair
3. Third element 30 (remainder 6): needs remainder 18 to make 24
4. Fourth element 18 (remainder 18): can pair with the 6 → 1 pair
5. Fifth element 6 (remainder 6): needs remainder 18 to make 24, but we already have one 18

Total pairs: 2

The efficient approach keeps a count of remainders we've seen so far. For each new number, we check how many previous numbers have the complementary remainder needed to sum to a multiple of 24.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countCompleteDayPairs_brute(hours):
    count = 0
    n = len(hours)

    # Check every possible pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            # Check if sum is divisible by 24
            if (hours[i] + hours[j]) % 24 == 0:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countCompleteDayPairs_brute(hours) {
  let count = 0;
  const n = hours.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
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
public int countCompleteDayPairs_brute(int[] hours) {
    int count = 0;
    int n = hours.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
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

**Why this is insufficient:** For an array of size `n`, there are `n(n-1)/2` possible pairs. This gives us O(n²) time complexity, which becomes too slow when `n` is large (e.g., `n = 10^5` would require about 5 billion operations). We need a more efficient approach.

## Optimal Solution

The key insight is that we only care about remainders modulo 24. For each number `x`, we need to find how many previous numbers `y` satisfy `(x + y) % 24 == 0`. This is equivalent to `y % 24 == (24 - x % 24) % 24`.

We can maintain a frequency map of remainders we've seen so far. For each new number:

1. Calculate its remainder modulo 24
2. Calculate the complementary remainder needed to sum to a multiple of 24
3. Add the count of numbers with that complementary remainder to our answer
4. Update the frequency map with the current remainder

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - since we only store 24 possible remainders
def countCompleteDayPairs(hours):
    # Initialize count of pairs
    count = 0

    # Frequency map for remainders modulo 24
    # We only need 24 slots (0 to 23)
    remainder_count = [0] * 24

    # Process each hour value
    for hour in hours:
        # Calculate remainder when divided by 24
        remainder = hour % 24

        # Calculate the complementary remainder needed
        # If remainder is 0, we need another 0 to make sum divisible by 24
        # Otherwise, we need (24 - remainder) to make sum equal to 24
        complement = (24 - remainder) % 24

        # Add the count of numbers with complementary remainder
        # These are all valid pairs with current number
        count += remainder_count[complement]

        # Update frequency map for current remainder
        remainder_count[remainder] += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1) - since we only store 24 possible remainders
function countCompleteDayPairs(hours) {
  // Initialize count of pairs
  let count = 0;

  // Frequency map for remainders modulo 24
  // We only need 24 slots (0 to 23)
  const remainderCount = new Array(24).fill(0);

  // Process each hour value
  for (const hour of hours) {
    // Calculate remainder when divided by 24
    const remainder = hour % 24;

    // Calculate the complementary remainder needed
    // If remainder is 0, we need another 0 to make sum divisible by 24
    // Otherwise, we need (24 - remainder) to make sum equal to 24
    const complement = (24 - remainder) % 24;

    // Add the count of numbers with complementary remainder
    // These are all valid pairs with current number
    count += remainderCount[complement];

    // Update frequency map for current remainder
    remainderCount[remainder]++;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1) - since we only store 24 possible remainders
public int countCompleteDayPairs(int[] hours) {
    // Initialize count of pairs
    int count = 0;

    // Frequency map for remainders modulo 24
    // We only need 24 slots (0 to 23)
    int[] remainderCount = new int[24];

    // Process each hour value
    for (int hour : hours) {
        // Calculate remainder when divided by 24
        int remainder = hour % 24;

        // Calculate the complementary remainder needed
        // If remainder is 0, we need another 0 to make sum divisible by 24
        // Otherwise, we need (24 - remainder) to make sum equal to 24
        int complement = (24 - remainder) % 24;

        // Add the count of numbers with complementary remainder
        // These are all valid pairs with current number
        count += remainderCount[complement];

        // Update frequency map for current remainder
        remainderCount[remainder]++;
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations for each element
- Each iteration involves: calculating remainder (O(1)), calculating complement (O(1)), array lookup (O(1)), and array update (O(1))

**Space Complexity:** O(1)

- We use a fixed-size array of length 24 to store remainder frequencies
- The space used does not grow with input size `n`
- Even if we used a hash map, the maximum number of keys would be 24, so space would still be O(1)

## Common Mistakes

1. **Forgetting to handle remainder 0 case separately:** When `remainder = 0`, the complement is `(24 - 0) % 24 = 0`, not 24. Using `24 - remainder` without the modulo operation would give complement = 24, which is out of bounds for our array.

2. **Updating frequency map before counting pairs:** If we update the frequency map with the current remainder before checking for complements, we might count the current element pairing with itself. Always count first, then update.

3. **Using O(n²) approach for large inputs:** Some candidates recognize the brute force is too slow but don't see the remainder pattern. Remember: when dealing with divisibility by `k`, think about remainders modulo `k`.

4. **Not considering negative numbers:** While the problem states `hours` contains integers, in real interviews you might need to handle negatives. The modulo operation behaves differently in some languages with negatives. In Python, `-1 % 24 = 23`, which works correctly with our approach. In Java/JavaScript, `-1 % 24 = -1`, so you'd need `((hour % 24) + 24) % 24` to get a positive remainder.

## When You'll See This Pattern

This "remainder frequency" pattern appears in many problems involving pairs or subsets with divisibility constraints:

1. **Two Sum** (LeetCode 1): Instead of checking divisibility by 24, we check if sum equals a target. The pattern of storing what we've seen and looking for complements is identical.

2. **Check If Array Pairs Are Divisible by k** (LeetCode 1497): This is essentially the same problem but asks if we can partition the array into pairs where each pair sums to a multiple of k. The remainder counting technique is exactly what's needed.

3. **Count Nice Pairs in an Array** (LeetCode 1814): Here we need pairs where `nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])`. Rearranging gives `nums[i] - rev(nums[i]) == nums[j] - rev(nums[j])`, so we count frequencies of these differences.

4. **Subarray Sums Divisible by K** (LeetCode 974): Instead of pairs, we count subarrays with sum divisible by k. The technique uses prefix sums and remainder counting.

## Key Takeaways

1. **When you see "sum divisible by k" or pairs with modular constraints, think about remainders modulo k.** This transforms the problem from checking sums to matching complementary remainders.

2. **Frequency maps turn O(n²) pair counting into O(n).** By storing what we've seen and looking for complements, we avoid nested loops.

3. **The order of operations matters:** Always count valid pairs with previously seen elements before adding the current element to the frequency map to avoid self-pairing.

Related problems: [Check If Array Pairs Are Divisible by k](/problem/check-if-array-pairs-are-divisible-by-k)
