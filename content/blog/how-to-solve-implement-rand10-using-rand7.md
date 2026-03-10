---
title: "How to Solve Implement Rand10() Using Rand7() — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Implement Rand10() Using Rand7(). Medium difficulty, 46.2% acceptance rate. Topics: Math, Rejection Sampling, Randomized, Probability and Statistics."
date: "2027-04-26"
category: "dsa-patterns"
tags: ["implement-rand10-using-rand7", "math", "rejection-sampling", "randomized", "medium"]
---

# How to Solve Implement Rand10() Using Rand7()

This problem asks us to generate a uniform random integer from 1 to 10 using only a provided `rand7()` function that returns uniform random integers from 1 to 7. The challenge is that we can't simply scale or shift `rand7()` directly — doing so would break the uniform distribution requirement. This problem tests your understanding of probability, rejection sampling, and how to build larger uniform distributions from smaller ones.

## Visual Walkthrough

Let's trace through the thought process with a concrete example. Suppose we want to generate numbers 1-10 uniformly. Our only tool is `rand7()` which gives us numbers 1-7 uniformly.

**First attempt (wrong):** What if we just call `rand7()` and take the result modulo 10?

- If we get 1 from `rand7()`, we output 1
- If we get 2 from `rand7()`, we output 2
- ...
- If we get 7 from `rand7()`, we output 7
- But what about 8, 9, 10? We'd need to wrap around: 8 → 1, 9 → 2, 10 → 3
- This gives us: 1 appears twice (from original 1 and from 8), 2 appears twice, 3 appears twice, but 4-7 appear only once each
- This distribution is NOT uniform!

**Better approach:** We need to generate numbers in a range that's a multiple of 10, then use rejection sampling. Let's think step by step:

1. We can think of `rand7()` as generating a random number in base-7. What if we call it twice?
2. First call gives us a number 1-7, second call gives us another number 1-7
3. We can combine them: `(first - 1) * 7 + (second - 1)` gives us a number from 0 to 48 (49 total possibilities)
4. Why 49? Because we have 7 possibilities for the first call × 7 possibilities for the second call = 49 total equally likely outcomes
5. Now we have numbers 0-48 uniformly distributed. We can map these to 1-10 by:
   - Taking numbers 0-39 (40 possibilities) and mapping them to 1-10 (40 ÷ 10 = 4 of each number)
   - Rejecting numbers 40-48 (9 possibilities) and trying again

Let's trace an example:

- First `rand7()` call returns 3 → first = 3
- Second `rand7()` call returns 5 → second = 5
- Compute: `(3-1)*7 + (5-1) = 2*7 + 4 = 14 + 4 = 18`
- 18 is between 0 and 39, so we accept it
- To get 1-10: `18 % 10 + 1 = 8 + 1 = 9`
- So we output 9

Another example:

- First `rand7()` returns 6 → first = 6
- Second `rand7()` returns 7 → second = 7
- Compute: `(6-1)*7 + (7-1) = 5*7 + 6 = 35 + 6 = 41`
- 41 is between 40 and 48, so we reject it and start over

This ensures every number 1-10 has exactly 4 ways to be generated from the 40 accepted outcomes, giving us perfect uniformity.

## Brute Force Approach

There isn't really a "brute force" in the traditional sense for this problem, but candidates often try these incorrect approaches:

1. **Simple scaling:** `rand7() * 10 / 7` or similar — this doesn't produce integers and the distribution isn't uniform
2. **Modulo approach:** `rand7() % 10 + 1` — as explained above, this gives uneven probabilities
3. **Summing calls:** Call `rand7()` multiple times and sum/mod — this creates a bell curve (normal distribution), not uniform

The key insight is that any approach that doesn't create a sample space that's a multiple of 10 will inevitably have some numbers appear more frequently than others. We need rejection sampling to handle the "extra" outcomes.

## Optimized Approach

The optimal approach uses **rejection sampling** with a **larger uniform distribution**. Here's the step-by-step reasoning:

1. **Create a larger uniform distribution**: We need numbers that are uniformly distributed across a range that includes our target range (1-10) as an evenly divisible subset. The smallest such range we can create from `rand7()` is 1-49 (by calling `rand7()` twice).

2. **Why 49?** When we call `rand7()` twice, we get two independent uniform random variables. The pair `(a, b)` where `a, b ∈ [1, 7]` has 7 × 7 = 49 equally likely outcomes. We can map these to numbers 0-48 using the formula: `(a-1) * 7 + (b-1)`.

3. **Rejection sampling principle**: We accept outcomes that fall within a range that's a multiple of our target size (10). The largest multiple of 10 that's ≤ 49 is 40. So we accept numbers 0-39 and reject 40-48.

4. **Mapping to 1-10**: For accepted numbers (0-39), we can map to 1-10 using modulo: `result % 10 + 1`. Since 40 ÷ 10 = 4, each number 1-10 will appear exactly 4 times in the 40 accepted outcomes.

5. **Expected calls**: Each iteration uses 2 calls to `rand7()`. The probability of acceptance is 40/49 ≈ 0.816, so the expected number of iterations is 49/40 = 1.225. Thus, the expected number of `rand7()` calls is 2 × 1.225 = 2.45.

This approach guarantees a perfect uniform distribution for `rand10()` while minimizing the expected number of `rand7()` calls.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) expected, O(∞) worst-case | Space: O(1)
def rand10():
    """
    Generate a uniform random integer in [1, 10] using only rand7().
    Uses rejection sampling with base-7 expansion.
    """
    while True:
        # Generate two independent calls to rand7()
        a = rand7()  # First random number 1-7
        b = rand7()  # Second random number 1-7

        # Map the pair (a,b) to a number in [0, 48]
        # (a-1) gives 0-6, multiply by 7 gives 0,7,14,...,42
        # (b-1) gives 0-6, adding gives coverage of all 49 numbers
        num = (a - 1) * 7 + (b - 1)  # Now num is in [0, 48]

        # Rejection sampling: only accept numbers in [0, 39]
        # 40 is the largest multiple of 10 ≤ 49
        if num < 40:
            # Map [0, 39] to [1, 10] using modulo
            # Each number 1-10 appears exactly 4 times in 0-39
            return num % 10 + 1

        # If num >= 40, reject and try again
        # This happens with probability 9/49 ≈ 0.184
```

```javascript
// Time: O(1) expected, O(∞) worst-case | Space: O(1)
function rand10() {
  /**
   * Generate a uniform random integer in [1, 10] using only rand7().
   * Uses rejection sampling with base-7 expansion.
   */
  while (true) {
    // Generate two independent calls to rand7()
    const a = rand7(); // First random number 1-7
    const b = rand7(); // Second random number 1-7

    // Map the pair (a,b) to a number in [0, 48]
    // (a-1) gives 0-6, multiply by 7 gives 0,7,14,...,42
    // (b-1) gives 0-6, adding gives coverage of all 49 numbers
    const num = (a - 1) * 7 + (b - 1); // Now num is in [0, 48]

    // Rejection sampling: only accept numbers in [0, 39]
    // 40 is the largest multiple of 10 ≤ 49
    if (num < 40) {
      // Map [0, 39] to [1, 10] using modulo
      // Each number 1-10 appears exactly 4 times in 0-39
      return (num % 10) + 1;
    }

    // If num >= 40, reject and try again
    // This happens with probability 9/49 ≈ 0.184
  }
}
```

```java
// Time: O(1) expected, O(∞) worst-case | Space: O(1)
public int rand10() {
    /**
     * Generate a uniform random integer in [1, 10] using only rand7().
     * Uses rejection sampling with base-7 expansion.
     */
    while (true) {
        // Generate two independent calls to rand7()
        int a = rand7(); // First random number 1-7
        int b = rand7(); // Second random number 1-7

        // Map the pair (a,b) to a number in [0, 48]
        // (a-1) gives 0-6, multiply by 7 gives 0,7,14,...,42
        // (b-1) gives 0-6, adding gives coverage of all 49 numbers
        int num = (a - 1) * 7 + (b - 1); // Now num is in [0, 48]

        // Rejection sampling: only accept numbers in [0, 39]
        // 40 is the largest multiple of 10 ≤ 49
        if (num < 40) {
            // Map [0, 39] to [1, 10] using modulo
            // Each number 1-10 appears exactly 4 times in 0-39
            return num % 10 + 1;
        }

        // If num >= 40, reject and try again
        // This happens with probability 9/49 ≈ 0.184
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Expected:** O(1) — Each iteration uses 2 calls to `rand7()`, and the probability of accepting is 40/49 ≈ 0.816. The expected number of iterations is 49/40 = 1.225, so the expected number of `rand7()` calls is 2 × 1.225 = 2.45, which is constant.
- **Worst-case:** O(∞) — In theory, we could keep rejecting forever, though the probability of needing more than k iterations decreases exponentially.

**Space Complexity:** O(1) — We only use a constant amount of extra space to store a few integer variables.

The key to the constant expected time is that rejection happens with fixed probability (9/49), so the number of iterations follows a geometric distribution with constant expected value.

## Common Mistakes

1. **Off-by-one errors in mapping**: Forgetting to subtract 1 from `a` and `b` before combining them. The correct formula is `(a-1)*7 + (b-1)` to get numbers 0-48, not `a*7 + b` which would give 8-56.

2. **Wrong rejection threshold**: Using `num <= 39` instead of `num < 40` (these are equivalent), or worse, using `num < 10` or `num < 20`. The threshold must be the largest multiple of 10 that fits in 0-48, which is 40.

3. **Incorrect modulo operation**: Returning `num % 10` instead of `num % 10 + 1`. Remember we want numbers 1-10, not 0-9.

4. **Not handling the rejection case properly**: Some candidates try to "reuse" the rejected numbers by subtracting 40 and trying to map what's left. This breaks uniformity because the remaining 9 numbers (40-48) don't evenly distribute across 1-10.

5. **Using floating point arithmetic**: Trying to scale `rand7()` using division and multiplication with floats. This introduces floating-point precision issues and doesn't guarantee integer results or perfect uniformity.

## When You'll See This Pattern

This rejection sampling technique appears in several other randomization problems:

1. **470. Implement Rand10() Using Rand7()** (this problem) — The classic example of building a larger uniform distribution from a smaller one.

2. **478. Generate Random Point in a Circle** — Uses rejection sampling to generate points uniformly within a circle by generating points in a bounding square and rejecting those outside the circle.

3. **497. Random Point in Non-overlapping Rectangles** — Uses a similar idea of creating a cumulative distribution and selecting rectangles proportionally to their area.

4. **528. Random Pick with Weight** — While not using rejection sampling directly, it uses the similar principle of mapping a uniform random variable to a weighted distribution using prefix sums.

The core pattern is: when you need to sample from distribution A but only have a generator for distribution B, you can sometimes use B to create a larger uniform distribution that encompasses A, then use rejection sampling to get perfect samples from A.

## Key Takeaways

1. **Rejection sampling is powerful for converting distributions**: When you need to generate numbers from one uniform distribution using a different uniform distribution, rejection sampling with a carefully chosen sample space ensures perfect uniformity.

2. **Create the right sample space**: The key is to generate numbers in a range that's a multiple of your target range size. For `rand10()` from `rand7()`, we need numbers in a range that's a multiple of 10. The smallest we can get from two `rand7()` calls is 0-48, and we use 0-39 (multiple of 10).

3. **Think in terms of independent trials**: Each call to `rand7()` is an independent trial. Combining multiple independent uniform variables (by treating them as digits in a base-7 number) gives us a larger uniform distribution.

4. **Expected runtime matters more than worst-case**: While the algorithm could theoretically run forever, the probability of needing many iterations drops exponentially. In interview settings, discussing expected time complexity shows deeper understanding.

[Practice this problem on CodeJeet](/problem/implement-rand10-using-rand7)
