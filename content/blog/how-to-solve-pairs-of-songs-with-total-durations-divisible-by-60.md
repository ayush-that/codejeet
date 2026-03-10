---
title: "How to Solve Pairs of Songs With Total Durations Divisible by 60 — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Pairs of Songs With Total Durations Divisible by 60. Medium difficulty, 53.4% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2027-11-21"
category: "dsa-patterns"
tags:
  [
    "pairs-of-songs-with-total-durations-divisible-by-60",
    "array",
    "hash-table",
    "counting",
    "medium",
  ]
---

# How to Solve Pairs of Songs With Total Durations Divisible by 60

You're given a list of song durations in seconds and need to count how many pairs of songs have total durations divisible by 60. The challenge is that a brute force check of all pairs would be too slow for large inputs, requiring us to find a clever mathematical optimization.

What makes this problem interesting is that it looks like a two-sum problem at first glance, but with a twist: instead of looking for a specific target sum, we're looking for sums that satisfy a modular condition. The key insight is that we only care about remainders modulo 60, not the actual durations.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `time = [30, 20, 150, 100, 40]`.

We need to find pairs `(i, j)` where `i < j` and `(time[i] + time[j]) % 60 == 0`.

**Step-by-step reasoning:**

1. For each song duration, compute `duration % 60` to get its remainder when divided by 60
   - 30 → 30
   - 20 → 20
   - 150 → 30 (because 150 ÷ 60 = 2 remainder 30)
   - 100 → 40
   - 40 → 40

2. Now we need pairs where `(remainder1 + remainder2) % 60 == 0`
   - This means either:
     - Both remainders are 0 (0 + 0 = 0)
     - The remainders sum to 60 (e.g., 20 + 40 = 60, 30 + 30 = 60)

3. Let's count systematically:
   - Song 1 (30): Looking for remainder 30 to pair with (since 30 + 30 = 60)
   - Song 2 (20): Looking for remainder 40 (20 + 40 = 60)
   - Song 3 (30): Looking for remainder 30
   - Song 4 (40): Looking for remainder 20
   - Song 5 (40): Looking for remainder 20

4. Counting pairs as we go:
   - Process song 1 (30): No previous songs with remainder 30 → count = 0
   - Process song 2 (20): No previous songs with remainder 40 → count = 0
   - Process song 3 (30): 1 previous song with remainder 30 → count = 1
   - Process song 4 (40): 1 previous song with remainder 20 → count = 2
   - Process song 5 (40): 1 previous song with remainder 20 → count = 3

The answer is 3 valid pairs: (30, 150), (20, 100), and (20, 40).

## Brute Force Approach

The most straightforward solution is to check every possible pair:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numPairsDivisibleBy60(time):
    n = len(time)
    count = 0

    # Check every possible pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            # If sum is divisible by 60, increment count
            if (time[i] + time[j]) % 60 == 0:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numPairsDivisibleBy60(time) {
  let count = 0;
  const n = time.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // If sum is divisible by 60, increment count
      if ((time[i] + time[j]) % 60 === 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numPairsDivisibleBy60(int[] time) {
    int count = 0;
    int n = time.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // If sum is divisible by 60, increment count
            if ((time[i] + time[j]) % 60 == 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** For an array of size `n`, there are `n(n-1)/2` possible pairs. With `n` up to 60,000 (as in LeetCode constraints), that's approximately 1.8 billion operations, which is far too slow. We need an approach that scales linearly.

## Optimized Approach

The key insight is that we only care about remainders modulo 60. For any song duration `t`, we compute `t % 60` to get a remainder between 0 and 59.

For two songs to have a sum divisible by 60, their remainders must satisfy:

- `(r1 + r2) % 60 == 0`

This means either:

1. Both remainders are 0: `0 + 0 = 0`
2. The remainders sum to 60: `r1 + r2 = 60`

**Mathematical transformation:**
If `(r1 + r2) % 60 == 0`, then `r2 = (60 - r1) % 60`

The `% 60` at the end handles the special case when `r1 = 0`, where we want `r2 = 0` not `r2 = 60`.

**Algorithm:**

1. Create an array `remainders` of size 60 to count how many songs have each remainder
2. For each song:
   - Compute its remainder `r = time[i] % 60`
   - Find the complementary remainder `complement = (60 - r) % 60`
   - Add to our total count the number of songs we've already seen with that complementary remainder
   - Increment the count for the current remainder `r`

This works because we process songs in order, so when we encounter a song, we only pair it with songs that came before it (ensuring `i < j`).

## Optimal Solution

Here's the complete implementation using the remainder counting approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - array of size 60 is constant
def numPairsDivisibleBy60(time):
    # Array to store counts of remainders (0 to 59)
    remainders = [0] * 60
    count = 0

    for duration in time:
        # Calculate remainder when divided by 60
        remainder = duration % 60

        # Calculate the complementary remainder needed
        # (60 - remainder) % 60 handles the case when remainder is 0
        complement = (60 - remainder) % 60

        # Add number of songs with complementary remainder seen so far
        count += remainders[complement]

        # Update count for current remainder
        remainders[remainder] += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1) - array of size 60 is constant
function numPairsDivisibleBy60(time) {
  // Array to store counts of remainders (0 to 59)
  const remainders = new Array(60).fill(0);
  let count = 0;

  for (const duration of time) {
    // Calculate remainder when divided by 60
    const remainder = duration % 60;

    // Calculate the complementary remainder needed
    // (60 - remainder) % 60 handles the case when remainder is 0
    const complement = (60 - remainder) % 60;

    // Add number of songs with complementary remainder seen so far
    count += remainders[complement];

    // Update count for current remainder
    remainders[remainder]++;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1) - array of size 60 is constant
public int numPairsDivisibleBy60(int[] time) {
    // Array to store counts of remainders (0 to 59)
    int[] remainders = new int[60];
    int count = 0;

    for (int duration : time) {
        // Calculate remainder when divided by 60
        int remainder = duration % 60;

        // Calculate the complementary remainder needed
        // (60 - remainder) % 60 handles the case when remainder is 0
        int complement = (60 - remainder) % 60;

        // Add number of songs with complementary remainder seen so far
        count += remainders[complement];

        // Update count for current remainder
        remainders[remainder]++;
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations for each element
- The operations inside the loop (modulo, array access, addition) are all O(1)

**Space Complexity:** O(1)

- We use a fixed-size array of 60 integers regardless of input size
- This is constant space, not O(n), because 60 doesn't scale with input

## Common Mistakes

1. **Forgetting the modulo in complement calculation:** Writing `complement = 60 - remainder` instead of `complement = (60 - remainder) % 60`. This fails when `remainder = 0` because you'd get `complement = 60`, which is out of bounds for a 0-59 array.

2. **Counting pairs in wrong order:** If you count all possible combinations without considering order (`i < j`), you might double-count or count invalid pairs. Our solution avoids this by only pairing each song with songs that came before it.

3. **Using a hash map when array is sufficient:** While a hash map works, an array of size 60 is more efficient for this specific problem since we know the exact range of remainders (0-59).

4. **Not handling large numbers correctly:** Some candidates worry about integer overflow when adding durations, but since we're working with remainders modulo 60, we avoid large sums entirely.

## When You'll See This Pattern

This problem uses the **remainder counting pattern**, which appears in many problems involving modular arithmetic or divisibility:

1. **Two Sum** - The classic problem where you need to find pairs that sum to a target. This is essentially "Two Sum modulo 60."

2. **Destroy Sequential Targets** - You need to find how many numbers have the same remainder when divided by a given value, similar to our remainder counting approach.

3. **Count Pairs That Form a Complete Day II** - Almost identical to this problem but with modulo 24 instead of 60.

4. **Subarray Sums Divisible by K** - Instead of pairs, you're looking for subarrays whose sums are divisible by K, using prefix sums and remainder counting.

The pattern to recognize: when a problem involves divisibility by a number `K`, think about working with remainders modulo `K` instead of the actual values.

## Key Takeaways

1. **Modular arithmetic simplifies divisibility problems:** Instead of checking if `(a + b) % K == 0`, work with remainders `r1 = a % K` and `r2 = b % K`, then check if `(r1 + r2) % K == 0`.

2. **Complementary remainders:** For a remainder `r`, the complementary remainder needed is `(K - r) % K`. The final `% K` handles the edge case when `r = 0`.

3. **Count as you go for ordered pairs:** When you need pairs `(i, j)` with `i < j`, process elements in order and pair each element with previously seen elements that satisfy the condition.

Related problems: [Destroy Sequential Targets](/problem/destroy-sequential-targets), [Count Pairs That Form a Complete Day II](/problem/count-pairs-that-form-a-complete-day-ii)
