---
title: "How to Solve Number of Ways to Split a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Ways to Split a String. Medium difficulty, 34.5% acceptance rate. Topics: Math, String."
date: "2029-01-24"
category: "dsa-patterns"
tags: ["number-of-ways-to-split-a-string", "math", "string", "medium"]
---

# How to Solve Number of Ways to Split a String

You're given a binary string `s` and need to split it into three **non-empty** parts so that each part contains the same number of `1`s. The challenge is counting all valid split positions efficiently—a brute force check of all possible splits would be too slow for strings up to 10⁵ characters. What makes this interesting is that the mathematical structure of the problem allows for an O(n) solution once you understand the constraints on where splits can occur.

## Visual Walkthrough

Let's trace through `s = "10101"` step by step.

**Step 1: Count total ones**
The string has three `1`s at indices 0, 2, and 4. Since we need equal ones in each part, each part must contain exactly `3 ÷ 3 = 1` one.

**Step 2: Find valid first split positions**
The first part must contain exactly one `1`. Looking from left to right:

- After index 0: First part `"1"` has one `1` ✓
- After index 1: First part `"10"` has one `1` ✓
- After index 2: First part `"101"` has two `1`s ✗ (too many)

So valid first cuts can be made after indices 0 or 1.

**Step 3: Find valid second split positions for each first cut**
For each valid first cut, the middle part must also contain exactly one `1`:

_First cut after index 0_ (s1 = "1"):

- Remaining string: `"0101"`
- Need middle part with one `1`:
  - After index 1: Middle `"0"` has zero `1`s ✗
  - After index 2: Middle `"01"` has one `1` ✓
  - After index 3: Middle `"010"` has one `1` ✓
  - After index 4: Middle `"0101"` has two `1`s ✗
    Valid second cuts: after indices 2 and 3

_First cut after index 1_ (s1 = "10"):

- Remaining string: `"101"`
- Need middle part with one `1`:
  - After index 2: Middle `"1"` has one `1` ✓
  - After index 3: Middle `"10"` has one `1` ✓
    Valid second cuts: after indices 2 and 3

**Step 4: Count valid combinations**

- First cut after 0: 2 valid second cuts
- First cut after 1: 2 valid second cuts  
  Total: 4 valid ways to split.

Notice the pattern: Once we know where the ones must be distributed, the valid cuts are determined by the zeros between specific ones.

## Brute Force Approach

A naive solution would try all possible split positions:

1. Try every index `i` from 1 to `n-2` for the first cut
2. For each `i`, try every index `j` from `i+1` to `n-1` for the second cut
3. Count ones in `s[0:i]`, `s[i:j]`, and `s[j:]`
4. If all three counts equal, increment answer

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def numWaysBruteForce(s: str) -> int:
    MOD = 10**9 + 7
    n = len(s)
    count = 0

    # Try all possible first cuts
    for i in range(1, n-1):
        # Try all possible second cuts
        for j in range(i+1, n):
            # Count ones in each part
            ones1 = s[:i].count('1')
            ones2 = s[i:j].count('1')
            ones3 = s[j:].count('1')

            if ones1 == ones2 == ones3:
                count = (count + 1) % MOD

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function numWaysBruteForce(s) {
  const MOD = 10 ** 9 + 7;
  const n = s.length;
  let count = 0;

  // Try all possible first cuts
  for (let i = 1; i < n - 1; i++) {
    // Try all possible second cuts
    for (let j = i + 1; j < n; j++) {
      // Count ones in each part
      const ones1 = s.substring(0, i).split("1").length - 1;
      const ones2 = s.substring(i, j).split("1").length - 1;
      const ones3 = s.substring(j).split("1").length - 1;

      if (ones1 === ones2 && ones2 === ones3) {
        count = (count + 1) % MOD;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int numWaysBruteForce(String s) {
    final int MOD = 1_000_000_007;
    int n = s.length();
    int count = 0;

    // Try all possible first cuts
    for (int i = 1; i < n - 1; i++) {
        // Try all possible second cuts
        for (int j = i + 1; j < n; j++) {
            // Count ones in each part
            int ones1 = countOnes(s, 0, i);
            int ones2 = countOnes(s, i, j);
            int ones3 = countOnes(s, j, n);

            if (ones1 == ones2 && ones2 == ones3) {
                count = (count + 1) % MOD;
            }
        }
    }

    return count;
}

// Helper to count ones in substring [start, end)
private int countOnes(String s, int start, int end) {
    int count = 0;
    for (int i = start; i < end; i++) {
        if (s.charAt(i) == '1') count++;
    }
    return count;
}
```

</div>

**Why this fails:** With n up to 10⁵, O(n³) is impossibly slow (~10¹⁵ operations). Even O(n²) would be too slow. We need O(n) or O(n log n).

## Optimized Approach

The key insight is that the problem has strong mathematical constraints:

1. **Total ones must be divisible by 3** - If total ones isn't divisible by 3, answer is 0
2. **Each part needs exactly k = total_ones / 3 ones**
3. **First cut must be placed somewhere between the k-th and (k+1)-th ones**
4. **Second cut must be placed somewhere between the (2k)-th and (2k+1)-th ones**

Why? Because:

- The first part needs exactly k ones, so the first cut must come after we've seen k ones
- But we can't cut in the middle of a sequence of zeros after the k-th one
- Similarly, the middle part needs k ones, so the second cut must come after we've seen 2k total ones

**Step-by-step reasoning:**

1. Count total ones. If not divisible by 3, return 0.
2. If total ones = 0, we have a special case: any split works as long as all parts are non-empty. With n-1 possible first cuts and n-2 possible second cuts, but we need to choose 2 distinct cut points from n-1 positions: C(n-1, 2) = (n-1)(n-2)/2.
3. Otherwise, find:
   - `first_start`: index of the k-th one (1-indexed)
   - `first_end`: index of the (k+1)-th one
   - `second_start`: index of the (2k)-th one
   - `second_end`: index of the (2k+1)-th one
4. Valid first cuts: any position between `first_start` and `first_end` (exclusive)
5. Valid second cuts: any position between `second_start` and `second_end` (exclusive)
6. Answer = `(first_end - first_start) × (second_end - second_start) % MOD`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numWays(s: str) -> int:
    MOD = 10**9 + 7
    n = len(s)

    # Step 1: Count total ones
    total_ones = s.count('1')

    # Case 1: Total ones not divisible by 3
    if total_ones % 3 != 0:
        return 0

    # Case 2: No ones in the string
    if total_ones == 0:
        # Choose 2 cut points from n-1 possible positions
        # Formula: (n-1 choose 2) = (n-1)*(n-2)//2
        return ((n-1) * (n-2) // 2) % MOD

    # Case 3: General case with ones
    k = total_ones // 3  # Ones needed in each part

    # Find the indices of relevant ones
    first_start = first_end = second_start = second_end = -1
    count = 0

    for i, char in enumerate(s):
        if char == '1':
            count += 1
            # Record index of k-th one (1-indexed)
            if count == k:
                first_start = i
            # Record index of (k+1)-th one
            if count == k + 1:
                first_end = i
            # Record index of (2k)-th one
            if count == 2 * k:
                second_start = i
            # Record index of (2k+1)-th one
            if count == 2 * k + 1:
                second_end = i

    # Number of valid first cuts = zeros between k-th and (k+1)-th ones + 1
    # Example: "10001" with k=1: between indices 0 and 4, can cut at 1,2,3 = 3 ways
    first_ways = first_end - first_start
    # Number of valid second cuts = zeros between (2k)-th and (2k+1)-th ones + 1
    second_ways = second_end - second_start

    # Total ways = product of possibilities for first and second cuts
    return (first_ways * second_ways) % MOD
```

```javascript
// Time: O(n) | Space: O(1)
function numWays(s) {
  const MOD = 10 ** 9 + 7;
  const n = s.length;

  // Step 1: Count total ones
  let totalOnes = 0;
  for (let i = 0; i < n; i++) {
    if (s[i] === "1") totalOnes++;
  }

  // Case 1: Total ones not divisible by 3
  if (totalOnes % 3 !== 0) {
    return 0;
  }

  // Case 2: No ones in the string
  if (totalOnes === 0) {
    // Choose 2 cut points from n-1 possible positions
    // Formula: (n-1 choose 2) = (n-1)*(n-2)//2
    return (((n - 1) * (n - 2)) / 2) % MOD;
  }

  // Case 3: General case with ones
  const k = totalOnes / 3; // Ones needed in each part

  // Find the indices of relevant ones
  let firstStart = -1,
    firstEnd = -1;
  let secondStart = -1,
    secondEnd = -1;
  let count = 0;

  for (let i = 0; i < n; i++) {
    if (s[i] === "1") {
      count++;
      // Record index of k-th one (1-indexed)
      if (count === k) firstStart = i;
      // Record index of (k+1)-th one
      if (count === k + 1) firstEnd = i;
      // Record index of (2k)-th one
      if (count === 2 * k) secondStart = i;
      // Record index of (2k+1)-th one
      if (count === 2 * k + 1) secondEnd = i;
    }
  }

  // Number of valid first cuts = zeros between k-th and (k+1)-th ones + 1
  const firstWays = firstEnd - firstStart;
  // Number of valid second cuts = zeros between (2k)-th and (2k+1)-th ones + 1
  const secondWays = secondEnd - secondStart;

  // Total ways = product of possibilities for first and second cuts
  return (firstWays * secondWays) % MOD;
}
```

```java
// Time: O(n) | Space: O(1)
public int numWays(String s) {
    final int MOD = 1_000_000_007;
    int n = s.length();

    // Step 1: Count total ones
    int totalOnes = 0;
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == '1') totalOnes++;
    }

    // Case 1: Total ones not divisible by 3
    if (totalOnes % 3 != 0) {
        return 0;
    }

    // Case 2: No ones in the string
    if (totalOnes == 0) {
        // Choose 2 cut points from n-1 possible positions
        // Formula: (n-1 choose 2) = (n-1)*(n-2)/2
        // Use long to avoid overflow before modulo
        long ways = (long)(n - 1) * (n - 2) / 2;
        return (int)(ways % MOD);
    }

    // Case 3: General case with ones
    int k = totalOnes / 3;  // Ones needed in each part

    // Find the indices of relevant ones
    int firstStart = -1, firstEnd = -1;
    int secondStart = -1, secondEnd = -1;
    int count = 0;

    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == '1') {
            count++;
            // Record index of k-th one (1-indexed)
            if (count == k) firstStart = i;
            // Record index of (k+1)-th one
            if (count == k + 1) firstEnd = i;
            // Record index of (2k)-th one
            if (count == 2 * k) secondStart = i;
            // Record index of (2k+1)-th one
            if (count == 2 * k + 1) secondEnd = i;
        }
    }

    // Number of valid first cuts = zeros between k-th and (k+1)-th ones + 1
    long firstWays = firstEnd - firstStart;
    // Number of valid second cuts = zeros between (2k)-th and (2k+1)-th ones + 1
    long secondWays = secondEnd - secondStart;

    // Total ways = product of possibilities for first and second cuts
    return (int)((firstWays * secondWays) % MOD);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one to count total ones (O(n)), and another to find the indices of specific ones (O(n)). In practice, we can combine these into a single pass, but either way it's linear.

**Space Complexity: O(1)**

- We only store a constant number of variables: counts, indices, and the answer. No additional data structures scale with input size.

## Common Mistakes

1. **Forgetting the special case when total ones = 0**: When there are no ones, ANY split works as long as all parts are non-empty. The answer is combinations of cut points: C(n-1, 2). Many candidates miss this and return 0 or try to apply the general formula which would give index errors.

2. **Off-by-one errors with indices**: The valid cuts are between specific ones, not at the ones themselves. If the k-th one is at index i and (k+1)-th at index j, you can cut at any index from i+1 to j (inclusive). That's (j - i) possibilities, not (j - i - 1) or (j - i + 1).

3. **Not using modulo properly for large results**: The answer can be huge (up to ~10¹⁰ for n=10⁵ with no ones). Always apply modulo after multiplication, and use 64-bit integers (long in Java) to avoid overflow during intermediate calculations.

4. **Checking divisibility incorrectly**: Remember `total_ones % 3 != 0` means impossible. Some candidates check `total_ones < 3` instead, but 6 ones is valid (2 per part).

## When You'll See This Pattern

This problem teaches **constraint-based counting**—when a problem has strict requirements that limit possibilities to specific ranges or positions:

1. **Split Array with Equal Sum** (Hard): Find split points where sums of four parts are equal. Similar idea of finding positions that satisfy cumulative sum conditions.

2. **Partition Array into Three Parts With Equal Sum** (Easy): Find two split points where three parts have equal sum. The same "find ranges between target sum multiples" pattern applies.

3. **Find Pivot Index** (Easy): Find index where left and right sums are equal. This is a simpler version with one split point instead of two.

The core technique: When you need to split an array/string into parts with equal something (sum, count, etc.), first check if total is divisible by number of parts, then find the boundary positions where each part's target is reached.

## Key Takeaways

1. **Look for mathematical constraints first**: Before coding, analyze what must be true for a solution to exist (divisibility conditions, boundary positions). This often reveals an O(n) solution instead of O(n²) or worse.

2. **Special cases matter**: Always check edge cases like "all zeros" or "not divisible" separately. These often have different formulas or cause index errors in the general solution.

3. **Visualize with examples**: Draw the string and mark where specific elements (like the k-th one) must be. This helps understand why valid cuts fall between certain positions, not at arbitrary points.

Related problems: [Split Array with Equal Sum](/problem/split-array-with-equal-sum)
