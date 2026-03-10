---
title: "How to Solve Find the Student that Will Replace the Chalk — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Student that Will Replace the Chalk. Medium difficulty, 53.2% acceptance rate. Topics: Array, Binary Search, Simulation, Prefix Sum."
date: "2028-09-28"
category: "dsa-patterns"
tags:
  ["find-the-student-that-will-replace-the-chalk", "array", "binary-search", "simulation", "medium"]
---

## How to Solve "Find the Student that Will Replace the Chalk"

You're given an array `chalk` where `chalk[i]` represents how much chalk the i-th student uses, and an integer `k` representing the total chalk available. The teacher goes through students in order (0, 1, 2, ..., n-1, then back to 0) until the chalk runs out. You need to find which student will be the one to use the last piece of chalk.

What makes this problem interesting is that `k` can be extremely large (up to 10⁹), so simulating each student one by one would be far too slow. The challenge is to find a way to skip over full cycles efficiently.

## Visual Walkthrough

Let's trace through a concrete example: `chalk = [5, 1, 5]`, `k = 22`

**Step 1:** Calculate total chalk used in one full cycle:

- Student 0 uses 5 → remaining chalk: 17
- Student 1 uses 1 → remaining chalk: 16
- Student 2 uses 5 → remaining chalk: 11
  Total per cycle = 5 + 1 + 5 = 11

**Step 2:** Skip full cycles:

- `k // total_chalk = 22 // 11 = 2` full cycles
- After 2 cycles, chalk used = 2 × 11 = 22
- Wait, that uses all the chalk! Actually, we need to be careful: `k % total_chalk = 22 % 11 = 0`
- When remainder is 0, it means the last student in the previous cycle used the final chalk
- So student 2 (index 2) from the last complete cycle is the answer

Let's try another example: `chalk = [3, 4, 1, 2]`, `k = 25`

**Step 1:** Total per cycle = 3 + 4 + 1 + 2 = 10

**Step 2:** Skip cycles: `k // total_chalk = 25 // 10 = 2` full cycles

- Chalk used in 2 cycles = 20
- Remaining chalk = 25 - 20 = 5

**Step 3:** Find which student uses up the remaining 5:

- Student 0 needs 3 → remaining = 2
- Student 1 needs 4 → but only 2 left, so student 1 is the answer

This shows we need to handle the case where `k % total_chalk == 0` specially.

## Brute Force Approach

The most straightforward solution is to simulate the process exactly as described:

1. Start with student index = 0
2. While `k >= chalk[current_student]`, subtract that student's chalk usage
3. Move to the next student (wrapping around with modulo)
4. When `k < chalk[current_student]`, return the current student

<div class="code-group">

```python
# Time: O(k / min(chalk)) - Could be extremely slow when k is large
# Space: O(1)
def chalkReplacerBruteForce(chalk, k):
    n = len(chalk)
    i = 0

    while True:
        # If current student needs more chalk than available
        if chalk[i] > k:
            return i

        # Give chalk to current student
        k -= chalk[i]

        # Move to next student
        i = (i + 1) % n
```

```javascript
// Time: O(k / min(chalk)) - Could be extremely slow when k is large
// Space: O(1)
function chalkReplacerBruteForce(chalk, k) {
  const n = chalk.length;
  let i = 0;

  while (true) {
    // If current student needs more chalk than available
    if (chalk[i] > k) {
      return i;
    }

    // Give chalk to current student
    k -= chalk[i];

    // Move to next student
    i = (i + 1) % n;
  }
}
```

```java
// Time: O(k / min(chalk)) - Could be extremely slow when k is large
// Space: O(1)
public int chalkReplacerBruteForce(int[] chalk, int k) {
    int n = chalk.length;
    int i = 0;

    while (true) {
        // If current student needs more chalk than available
        if (chalk[i] > k) {
            return i;
        }

        // Give chalk to current student
        k -= chalk[i];

        // Move to next student
        i = (i + 1) % n;
    }
}
```

</div>

**Why this fails:** When `k` is up to 10⁹ and chalk values are small (like 1), this could take billions of iterations. We need a smarter approach.

## Optimized Approach

The key insight is that the process is **cyclic**. Students are visited in the same order repeatedly. This means:

1. **Calculate the total chalk used in one complete cycle** by summing all elements in `chalk`.
2. **Skip full cycles** by computing `k % total_chalk`. This gives us the remaining chalk after removing all complete cycles.
3. **Find the first student** whose chalk requirement exceeds the remaining chalk.

There's a special case: when `k % total_chalk == 0`, it means the last student in the previous cycle used exactly the last piece of chalk. So we need to return the last student (index n-1).

We can use **prefix sums** to efficiently find where the remaining chalk runs out. For the remaining chalk `r`, we want the first index where the prefix sum exceeds `r`.

## Optimal Solution

Here's the efficient solution using prefix sums and cycle skipping:

<div class="code-group">

```python
# Time: O(n) - We make one pass to compute prefix sums
# Space: O(1) - We only store the running total
def chalkReplacer(chalk, k):
    n = len(chalk)

    # Step 1: Calculate total chalk used in one complete cycle
    total_chalk = sum(chalk)

    # Step 2: Skip all complete cycles
    remaining_chalk = k % total_chalk

    # Special case: if remaining_chalk is 0, the last student
    # in the previous cycle used the final chalk
    if remaining_chalk == 0:
        # Find the last student who would get chalk
        # This is the student before we would wrap around
        # Since we complete full cycles, it's the last student (n-1)
        return n - 1

    # Step 3: Find which student uses up the remaining chalk
    # We'll simulate just the partial cycle
    for i in range(n):
        if chalk[i] > remaining_chalk:
            return i
        remaining_chalk -= chalk[i]

    # This line should never be reached due to the modulo operation
    return -1
```

```javascript
// Time: O(n) - We make one pass to compute prefix sums
// Space: O(1) - We only store the running total
function chalkReplacer(chalk, k) {
  const n = chalk.length;

  // Step 1: Calculate total chalk used in one complete cycle
  let totalChalk = 0;
  for (let i = 0; i < n; i++) {
    totalChalk += chalk[i];
  }

  // Step 2: Skip all complete cycles
  let remainingChalk = k % totalChalk;

  // Special case: if remainingChalk is 0, the last student
  // in the previous cycle used the final chalk
  if (remainingChalk === 0) {
    // Find the last student who would get chalk
    return n - 1;
  }

  // Step 3: Find which student uses up the remaining chalk
  for (let i = 0; i < n; i++) {
    if (chalk[i] > remainingChalk) {
      return i;
    }
    remainingChalk -= chalk[i];
  }

  // This line should never be reached due to the modulo operation
  return -1;
}
```

```java
// Time: O(n) - We make one pass to compute prefix sums
// Space: O(1) - We only store the running total
public int chalkReplacer(int[] chalk, int k) {
    int n = chalk.length;

    // Step 1: Calculate total chalk used in one complete cycle
    long totalChalk = 0;  // Use long to prevent overflow
    for (int i = 0; i < n; i++) {
        totalChalk += chalk[i];
    }

    // Step 2: Skip all complete cycles
    long remainingChalk = k % totalChalk;

    // Special case: if remainingChalk is 0, the last student
    // in the previous cycle used the final chalk
    if (remainingChalk == 0) {
        // Find the last student who would get chalk
        return n - 1;
    }

    // Step 3: Find which student uses up the remaining chalk
    for (int i = 0; i < n; i++) {
        if (chalk[i] > remainingChalk) {
            return i;
        }
        remainingChalk -= chalk[i];
    }

    // This line should never be reached due to the modulo operation
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to calculate the total chalk usage: O(n)
- We make another pass (in the worst case) to find the student who uses the remaining chalk: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a few variables to store the total chalk and remaining chalk
- No additional data structures are needed

## Common Mistakes

1. **Not handling the `k % total == 0` case correctly**: When the remainder is 0, it means the last student in the previous complete cycle used the final chalk. Many candidates return student 0 in this case, but the correct answer is the last student (n-1).

2. **Using integer overflow in Java/C++**: When summing chalk values, the total could exceed 2³¹ - 1. Always use `long` for the total in Java to prevent overflow.

3. **Trying to use binary search unnecessarily**: While you could use binary search on prefix sums, it's overkill here since O(n) is already optimal and simpler. The extra O(n) space for prefix sums array isn't needed.

4. **Forgetting that k can be smaller than the first student's chalk**: The solution should handle cases where `k < chalk[0]` by returning student 0 immediately after the modulo operation.

## When You'll See This Pattern

This problem combines **cycle detection** and **prefix sums** - two patterns that appear frequently:

1. **Pass the Pillow (LeetCode 2582)**: Similar cyclic pattern where you need to find who has the pillow after t seconds. The solution involves modulo arithmetic to skip full cycles.

2. **Find the Winner of the Circular Game (LeetCode 1823)**: Josephus problem with cyclic elimination. Uses similar modulo thinking to determine the winner.

3. **Subarray Sum Equals K (LeetCode 560)**: While not cyclic, it uses prefix sums in a similar way to find subarrays that sum to a target value.

The core pattern is: when you have a **repeating sequence** and a **large number of iterations**, use **modulo arithmetic** to skip complete cycles and only process the remainder.

## Key Takeaways

1. **Look for cycles in repetitive processes**: When a sequence repeats, you can use modulo arithmetic to skip over complete cycles efficiently. This turns O(k) time into O(n) time.

2. **Prefix sums help find cumulative thresholds**: When you need to find where a running total exceeds a certain value, prefix sums (either precomputed or computed on the fly) give you an efficient way to do it.

3. **Watch for edge cases with exact multiples**: When `k % total == 0`, think carefully about what it means. In cyclic problems, it usually means you end at the last element of the cycle, not the first.

Related problems: [Pass the Pillow](/problem/pass-the-pillow)
