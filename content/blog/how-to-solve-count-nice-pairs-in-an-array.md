---
title: "How to Solve Count Nice Pairs in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Nice Pairs in an Array. Medium difficulty, 48.4% acceptance rate. Topics: Array, Hash Table, Math, Counting."
date: "2026-12-01"
category: "dsa-patterns"
tags: ["count-nice-pairs-in-an-array", "array", "hash-table", "math", "medium"]
---

# How to Solve Count Nice Pairs in an Array

You're given an array of non-negative integers and need to count "nice pairs" where `nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])`. The challenge is that checking all pairs directly would be too slow. The key insight is rearranging this equation to `nums[i] - rev(nums[i]) == nums[j] - rev(nums[j])`, which transforms the problem into counting identical differences — a classic frequency counting problem.

## Visual Walkthrough

Let's walk through a concrete example: `nums = [42, 11, 1, 97]`

First, let's compute `rev(x)` for each number:

- `rev(42) = 24`
- `rev(11) = 11`
- `rev(1) = 1`
- `rev(97) = 79`

Now compute `nums[i] - rev(nums[i])` for each index:

- Index 0: `42 - 24 = 18`
- Index 1: `11 - 11 = 0`
- Index 2: `1 - 1 = 0`
- Index 3: `97 - 79 = 18`

Notice the pattern: indices with equal differences can form nice pairs:

- Difference 18 appears at indices 0 and 3 → (0, 3) is a nice pair
- Difference 0 appears at indices 1 and 2 → (1, 2) is a nice pair

Let's verify one pair: (0, 3)

- Check: `nums[0] + rev(nums[3]) = 42 + 79 = 121`
- Check: `nums[3] + rev(nums[0]) = 97 + 24 = 121`
- They're equal, so it's a nice pair!

The key insight: **if two indices have the same `nums[i] - rev(nums[i])` value, they form a nice pair**. This transforms our problem from checking O(n²) pairs to counting frequencies of differences.

## Brute Force Approach

The most straightforward solution checks every possible pair `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n² * d) where d is number of digits | Space: O(1)
def countNicePairs(nums):
    MOD = 10**9 + 7
    n = len(nums)
    count = 0

    # Helper function to reverse a number
    def rev(x):
        result = 0
        while x > 0:
            result = result * 10 + x % 10
            x //= 10
        return result

    # Check all pairs
    for i in range(n):
        for j in range(i + 1, n):
            if (nums[i] + rev(nums[j])) == (nums[j] + rev(nums[i])):
                count = (count + 1) % MOD

    return count
```

```javascript
// Time: O(n² * d) where d is number of digits | Space: O(1)
function countNicePairs(nums) {
  const MOD = 1_000_000_007;
  let count = 0;

  // Helper function to reverse a number
  function rev(x) {
    let result = 0;
    while (x > 0) {
      result = result * 10 + (x % 10);
      x = Math.floor(x / 10);
    }
    return result;
  }

  // Check all pairs
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + rev(nums[j]) === nums[j] + rev(nums[i])) {
        count = (count + 1) % MOD;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n² * d) where d is number of digits | Space: O(1)
public int countNicePairs(int[] nums) {
    final int MOD = 1_000_000_007;
    int count = 0;

    // Check all pairs
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])) {
                count = (count + 1) % MOD;
            }
        }
    }

    return count;
}

// Helper function to reverse a number
private int rev(int x) {
    int result = 0;
    while (x > 0) {
        result = result * 10 + x % 10;
        x /= 10;
    }
    return result;
}
```

</div>

**Why this is insufficient:** With n up to 10⁵, checking all O(n²) pairs (approximately 5 billion for the maximum input) is far too slow. We need at least O(n log n) or O(n) to pass within time limits.

## Optimized Approach

The breakthrough comes from rearranging the nice pair condition:

Original condition: `nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])`

Rearrange by moving terms:
`nums[i] - rev(nums[i]) == nums[j] - rev(nums[j])`

This shows that **two indices form a nice pair if and only if their `nums[i] - rev(nums[i])` values are equal**.

Now the problem becomes: count how many pairs of indices have the same difference value. For a frequency `f` of a particular difference, the number of pairs is `f * (f - 1) / 2` (the number of ways to choose 2 items from f items).

**Algorithm steps:**

1. For each number in `nums`, compute `diff = num - rev(num)`
2. Count frequencies of each `diff` value using a hash map
3. For each frequency `f` in the map, add `f * (f - 1) / 2` to the total count
4. Take modulo 10⁹ + 7 at each step to prevent overflow

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * d) where d is average number of digits | Space: O(n)
def countNicePairs(nums):
    MOD = 10**9 + 7

    # Helper function to reverse a number
    def rev(x):
        result = 0
        while x > 0:
            result = result * 10 + x % 10
            x //= 10
        return result

    freq = {}  # Dictionary to store frequencies of differences
    count = 0

    for num in nums:
        # Compute the difference for current number
        diff = num - rev(num)

        # If we've seen this difference before, it can form pairs
        # with all previous occurrences
        if diff in freq:
            count = (count + freq[diff]) % MOD
            freq[diff] += 1
        else:
            freq[diff] = 1

    return count

# Alternative approach that first builds frequency map then calculates pairs:
def countNicePairsAlt(nums):
    MOD = 10**9 + 7

    def rev(x):
        result = 0
        while x > 0:
            result = result * 10 + x % 10
            x //= 10
        return result

    freq = {}

    # Build frequency map of differences
    for num in nums:
        diff = num - rev(num)
        freq[diff] = freq.get(diff, 0) + 1

    # Calculate total pairs using combination formula
    total = 0
    for f in freq.values():
        total = (total + f * (f - 1) // 2) % MOD

    return total
```

```javascript
// Time: O(n * d) where d is average number of digits | Space: O(n)
function countNicePairs(nums) {
  const MOD = 1_000_000_007;

  // Helper function to reverse a number
  function rev(x) {
    let result = 0;
    while (x > 0) {
      result = result * 10 + (x % 10);
      x = Math.floor(x / 10);
    }
    return result;
  }

  const freq = new Map();
  let count = 0;

  for (const num of nums) {
    // Compute the difference for current number
    const diff = num - rev(num);

    // Get current frequency of this difference
    const currentFreq = freq.get(diff) || 0;

    // Each previous occurrence can form a pair with current index
    count = (count + currentFreq) % MOD;

    // Update frequency for this difference
    freq.set(diff, currentFreq + 1);
  }

  return count;
}

// Alternative approach
function countNicePairsAlt(nums) {
  const MOD = 1_000_000_007;

  function rev(x) {
    let result = 0;
    while (x > 0) {
      result = result * 10 + (x % 10);
      x = Math.floor(x / 10);
    }
    return result;
  }

  const freq = new Map();

  // Build frequency map
  for (const num of nums) {
    const diff = num - rev(num);
    freq.set(diff, (freq.get(diff) || 0) + 1);
  }

  // Calculate total pairs
  let total = 0;
  for (const f of freq.values()) {
    total = (total + Math.floor((f * (f - 1)) / 2)) % MOD;
  }

  return total;
}
```

```java
// Time: O(n * d) where d is average number of digits | Space: O(n)
class Solution {
    public int countNicePairs(int[] nums) {
        final int MOD = 1_000_000_007;
        Map<Integer, Integer> freq = new HashMap<>();
        int count = 0;

        for (int num : nums) {
            // Compute difference for current number
            int diff = num - rev(num);

            // Get current frequency of this difference
            int currentFreq = freq.getOrDefault(diff, 0);

            // Each previous occurrence can form a pair with current index
            count = (count + currentFreq) % MOD;

            // Update frequency for this difference
            freq.put(diff, currentFreq + 1);
        }

        return count;
    }

    // Helper function to reverse a number
    private int rev(int x) {
        int result = 0;
        while (x > 0) {
            result = result * 10 + x % 10;
            x /= 10;
        }
        return result;
    }
}

// Alternative approach
class SolutionAlt {
    public int countNicePairs(int[] nums) {
        final int MOD = 1_000_000_007;
        Map<Integer, Integer> freq = new HashMap<>();

        // Build frequency map
        for (int num : nums) {
            int diff = num - rev(num);
            freq.put(diff, freq.getOrDefault(diff, 0) + 1);
        }

        // Calculate total pairs using combination formula
        long total = 0;  // Use long to avoid overflow during multiplication
        for (int f : freq.values()) {
            total = (total + (long) f * (f - 1) / 2) % MOD;
        }

        return (int) total;
    }

    private int rev(int x) {
        int result = 0;
        while (x > 0) {
            result = result * 10 + x % 10;
            x /= 10;
        }
        return result;
    }
}
```

</div>

**Note on the two approaches:** The first approach (incrementally counting pairs) and second approach (building frequency map then calculating) are mathematically equivalent. The incremental approach is slightly more efficient as it avoids the second pass, but both have the same asymptotic complexity.

## Complexity Analysis

**Time Complexity:** O(n × d), where n is the length of `nums` and d is the average number of digits in the numbers. We process each number once to compute its reverse (O(d) time) and update the frequency map (O(1) average time).

**Space Complexity:** O(n) in the worst case, where all differences are unique and we store n entries in the hash map.

**Why this is optimal:** We must at least look at each number once to compute its reverse, giving us a lower bound of Ω(n). Our solution achieves O(n) operations beyond the digit reversal, which is optimal.

## Common Mistakes

1. **Forgetting to handle large numbers with modulo:** The result can be very large (up to ~5×10⁹ pairs for n=10⁵), so we must take modulo 10⁹+7 at each addition. Forgetting this causes integer overflow in languages with fixed-size integers.

2. **Incorrect reverse function for numbers ending with 0:** When reversing 120, the correct result is 21 (not 021). A common mistake is to convert to string, reverse, then convert back — which would give 021 → 21 correctly, but the mathematical approach shown handles this properly by dropping trailing zeros.

3. **Using the combination formula without considering overflow:** When calculating `f * (f - 1) / 2`, if `f` is large (up to 10⁵), the multiplication `f * (f - 1)` can overflow 32-bit integers before division. Use 64-bit integers or apply modulo carefully.

4. **Not recognizing the mathematical rearrangement:** The most common conceptual mistake is trying to optimize the brute force without realizing that `nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])` can be rearranged to `nums[i] - rev(nums[i]) == nums[j] - rev(nums[j])`. Always look for algebraic simplifications in equality conditions.

## When You'll See This Pattern

This problem uses the **"frequency counting of transformed values"** pattern, which appears in many counting problems:

1. **Number of Pairs of Interchangeable Rectangles (LeetCode 2001):** Count pairs of rectangles with equal width/height ratios. Instead of comparing all pairs, compute ratio for each rectangle and count frequencies.

2. **Count Number of Bad Pairs (LeetCode 2364):** Similar transformation where `j - i != nums[j] - nums[i]` becomes `nums[i] - i != nums[j] - j`, allowing frequency counting.

3. **Two Sum (LeetCode 1):** While not identical, it uses a similar hash map approach to avoid O(n²) comparisons by storing what we've seen so far.

The core insight is recognizing when a pairwise condition can be transformed into a property of individual elements, allowing O(n) solutions instead of O(n²).

## Key Takeaways

1. **Always look for algebraic rearrangements** when dealing with pairwise conditions. Many problems that seem to require checking all pairs can be transformed by moving terms around.

2. **The combination formula `nC2 = n×(n-1)/2` is essential** for counting pairs from frequencies. This appears frequently in counting problems.

3. **Hash maps are your best friend for frequency counting** when you need to group elements by some computed property. The O(1) average lookup/insert time makes them ideal for these problems.

Remember: when a problem asks you to count pairs satisfying some condition, ask yourself: "Can I transform this into a property of individual elements?" If yes, you've likely found the optimal solution.

Related problems: [Number of Pairs of Interchangeable Rectangles](/problem/number-of-pairs-of-interchangeable-rectangles), [Count Number of Bad Pairs](/problem/count-number-of-bad-pairs), [Number of Pairs Satisfying Inequality](/problem/number-of-pairs-satisfying-inequality)
