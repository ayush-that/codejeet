---
title: "How to Solve Number of Different Subsequences GCDs — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Different Subsequences GCDs. Hard difficulty, 45.0% acceptance rate. Topics: Array, Math, Counting, Number Theory."
date: "2026-03-22"
category: "dsa-patterns"
tags: ["number-of-different-subsequences-gcds", "array", "math", "counting", "hard"]
---

# How to Solve Number of Different Subsequences GCDs

This problem asks us to count how many **distinct GCD values** can be obtained from all possible subsequences of a given array of positive integers. What makes this problem challenging is that a brute force approach would need to consider all 2ⁿ subsequences (where n ≤ 10⁵), which is impossible. The key insight involves number theory and clever counting techniques.

## Visual Walkthrough

Let's trace through a small example: `nums = [4, 6, 16]`

**Step 1: List all subsequences and their GCDs:**

- `[]` → No GCD (we ignore empty subsequences)
- `[4]` → GCD = 4
- `[6]` → GCD = 6
- `[16]` → GCD = 16
- `[4, 6]` → GCD = 2
- `[4, 16]` → GCD = 4
- `[6, 16]` → GCD = 2
- `[4, 6, 16]` → GCD = 2

**Step 2: Collect distinct GCDs:**
We get {2, 4, 6, 16} → **4 distinct GCDs**

**Key observation:** The maximum possible GCD value is at most the maximum number in the array (16 in this case). This suggests we could iterate through all possible GCD values from 1 to max(nums) and check if each could be the GCD of some subsequence.

**Step 3: How to check if `g` can be a GCD:**
For `g = 2`, we look for numbers divisible by 2: {4, 6, 16}
The GCD of all these numbers is 2, so yes, `g = 2` works.

For `g = 3`, numbers divisible by 3: {6}
The GCD of {6} is 6, not 3, so `g = 3` doesn't work.

For `g = 4`, numbers divisible by 4: {4, 16}
The GCD of {4, 16} is 4, so `g = 4` works.

This checking process is the core of our solution.

## Brute Force Approach

A naive approach would generate all 2ⁿ subsequences, compute their GCDs, and count distinct values. Here's what that might look like:

<div class="code-group">

```python
# Time: O(2^n * n) | Space: O(2^n) - TERRIBLE, won't work for n > 20
def countDifferentSubsequenceGCDs(nums):
    from math import gcd
    from itertools import combinations

    distinct_gcds = set()
    n = len(nums)

    # Generate all non-empty subsequences
    for length in range(1, n + 1):
        for combo in combinations(nums, length):
            # Compute GCD of this subsequence
            current_gcd = combo[0]
            for num in combo[1:]:
                current_gcd = gcd(current_gcd, num)
            distinct_gcds.add(current_gcd)

    return len(distinct_gcds)
```

```javascript
// Time: O(2^n * n) | Space: O(2^n) - TERRIBLE, won't work for n > 20
function countDifferentSubsequenceGCDs(nums) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const distinctGCDs = new Set();
  const n = nums.length;

  // Helper to generate all subsequences
  function generateSubsequences(index, current) {
    if (index === n) {
      if (current.length > 0) {
        // Compute GCD of this subsequence
        let currentGCD = current[0];
        for (let i = 1; i < current.length; i++) {
          currentGCD = gcd(currentGCD, current[i]);
        }
        distinctGCDs.add(currentGCD);
      }
      return;
    }

    // Include current element
    current.push(nums[index]);
    generateSubsequences(index + 1, current);
    current.pop();

    // Exclude current element
    generateSubsequences(index + 1, current);
  }

  generateSubsequences(0, []);
  return distinctGCDs.size;
}
```

```java
// Time: O(2^n * n) | Space: O(2^n) - TERRIBLE, won't work for n > 20
public int countDifferentSubsequenceGCDs(int[] nums) {
    Set<Integer> distinctGCDs = new HashSet<>();
    int n = nums.length;

    // Generate all non-empty subsequences using bitmask
    for (int mask = 1; mask < (1 << n); mask++) {
        int currentGCD = 0;
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                if (currentGCD == 0) {
                    currentGCD = nums[i];
                } else {
                    currentGCD = gcd(currentGCD, nums[i]);
                }
            }
        }
        distinctGCDs.add(currentGCD);
    }

    return distinctGCDs.size();
}

private int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}
```

</div>

**Why this fails:** With n up to 10⁵, 2ⁿ is astronomically large (~10³⁰⁰⁰⁰). Even for n = 20, 2²⁰ = 1,048,576 operations might be borderline. We need a polynomial-time solution.

## Optimized Approach

The key insight is that we don't need to enumerate subsequences. Instead, we can check each possible GCD value `g` from 1 to max(nums) to see if it can be achieved.

**How to check if `g` can be a GCD:**

1. Find all numbers in `nums` that are multiples of `g`
2. Compute the GCD of all those multiples
3. If the result equals `g`, then `g` can be achieved as a GCD

**Why this works:**

- If `g` is the GCD of some subsequence, then all numbers in that subsequence must be multiples of `g`
- The GCD of all multiples of `g` in the array gives us the "smallest" possible GCD we can get from numbers divisible by `g`
- If that GCD equals `g`, then we can form a subsequence (using all those multiples) whose GCD is exactly `g`

**Optimization:** Instead of checking every number from 1 to max(nums), we can:

1. Create a frequency array to mark which numbers exist
2. For each candidate `g`, collect multiples by jumping `g` steps at a time
3. Compute GCD of all found multiples efficiently

## Optimal Solution

Here's the efficient implementation:

<div class="code-group">

```python
# Time: O(n + m * log m) where m = max(nums) | Space: O(m)
def countDifferentSubsequenceGCDs(nums):
    # Find the maximum number in the array
    max_num = max(nums)

    # Create a boolean array to mark which numbers exist
    # present[x] = True if x is in nums
    present = [False] * (max_num + 1)
    for num in nums:
        present[num] = True

    count = 0

    # Check each possible GCD value from 1 to max_num
    for g in range(1, max_num + 1):
        # We'll compute GCD of all multiples of g that exist in nums
        current_gcd = 0

        # Iterate through multiples of g: g, 2g, 3g, ...
        for multiple in range(g, max_num + 1, g):
            if present[multiple]:
                # Update GCD with this multiple
                if current_gcd == 0:
                    current_gcd = multiple
                else:
                    # Compute GCD using Euclidean algorithm
                    a, b = current_gcd, multiple
                    while b:
                        a, b = b, a % b
                    current_gcd = a

                # Early exit: if GCD becomes g, we know g is achievable
                if current_gcd == g:
                    count += 1
                    break

    return count
```

```javascript
// Time: O(n + m * log m) where m = max(nums) | Space: O(m)
function countDifferentSubsequenceGCDs(nums) {
  // Find the maximum number in the array
  const maxNum = Math.max(...nums);

  // Create a boolean array to mark which numbers exist
  // present[x] = true if x is in nums
  const present = new Array(maxNum + 1).fill(false);
  for (const num of nums) {
    present[num] = true;
  }

  let count = 0;

  // Check each possible GCD value from 1 to maxNum
  for (let g = 1; g <= maxNum; g++) {
    // We'll compute GCD of all multiples of g that exist in nums
    let currentGCD = 0;

    // Iterate through multiples of g: g, 2g, 3g, ...
    for (let multiple = g; multiple <= maxNum; multiple += g) {
      if (present[multiple]) {
        // Update GCD with this multiple
        if (currentGCD === 0) {
          currentGCD = multiple;
        } else {
          // Compute GCD using Euclidean algorithm
          let a = currentGCD;
          let b = multiple;
          while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
          }
          currentGCD = a;
        }

        // Early exit: if GCD becomes g, we know g is achievable
        if (currentGCD === g) {
          count++;
          break;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n + m * log m) where m = max(nums) | Space: O(m)
public int countDifferentSubsequenceGCDs(int[] nums) {
    // Find the maximum number in the array
    int maxNum = 0;
    for (int num : nums) {
        maxNum = Math.max(maxNum, num);
    }

    // Create a boolean array to mark which numbers exist
    // present[x] = true if x is in nums
    boolean[] present = new boolean[maxNum + 1];
    for (int num : nums) {
        present[num] = true;
    }

    int count = 0;

    // Check each possible GCD value from 1 to maxNum
    for (int g = 1; g <= maxNum; g++) {
        // We'll compute GCD of all multiples of g that exist in nums
        int currentGCD = 0;

        // Iterate through multiples of g: g, 2g, 3g, ...
        for (int multiple = g; multiple <= maxNum; multiple += g) {
            if (present[multiple]) {
                // Update GCD with this multiple
                if (currentGCD == 0) {
                    currentGCD = multiple;
                } else {
                    // Compute GCD using Euclidean algorithm
                    currentGCD = gcd(currentGCD, multiple);
                }

                // Early exit: if GCD becomes g, we know g is achievable
                if (currentGCD == g) {
                    count++;
                    break;
                }
            }
        }
    }

    return count;
}

// Helper function to compute GCD using Euclidean algorithm
private int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m \* log m)** where:

- `n` is the length of `nums`
- `m` is the maximum value in `nums`

**Breakdown:**

- O(n) to find max(nums) and build the `present` array
- Outer loop runs `m` times (for g = 1 to m)
- Inner loop runs `m/g` times for each `g` (checking multiples)
- Total iterations: m/1 + m/2 + m/3 + ... + m/m ≈ m \* log m (harmonic series)
- Each iteration does O(1) work except GCD computations, which are O(log m) in worst case

**Space Complexity: O(m)** for the `present` boolean array.

## Common Mistakes

1. **Not handling large constraints:** Attempting to generate all subsequences (2ⁿ) for n up to 10⁵. Remember: any exponential solution is almost certainly wrong for large n.

2. **Forgetting that GCD can be 1:** Always check from g = 1, not g = 2. The GCD of any single prime number is 1.

3. **Incorrect GCD computation in the inner loop:** When updating current_gcd, you must compute GCD(current_gcd, multiple), not take the minimum or use other operations.

4. **Missing the early break optimization:** Without breaking when current_gcd == g, the solution becomes O(m²) which is too slow for m up to 2×10⁵.

5. **Array index out of bounds:** When creating the `present` array, make sure its size is max_num + 1, not max_num, since we need to index by max_num itself.

## When You'll See This Pattern

This problem uses a **divisor/multiple iteration pattern** combined with **GCD properties**. You'll see similar techniques in:

1. **Count Primes (LeetCode 204):** Uses the Sieve of Eratosthenes which iterates through multiples to mark non-primes, similar to how we iterate through multiples of g.

2. **Ugly Number II (LeetCode 264):** Involves generating numbers with specific prime factors, using similar multiple-based approaches.

3. **Largest Component Size by Common Factor (LeetCode 952):** Uses GCD/divisor relationships to build connected components.

The core pattern: when you need to process all divisors/multiples of numbers up to N, use nested loops where the inner loop jumps by the current value (like `for (j = i; j <= N; j += i)`).

## Key Takeaways

1. **Think in terms of possible outcomes, not enumerating inputs:** Instead of generating all subsequences, think about what GCD values are possible and how to test each one.

2. **Use harmonic series for divisor/multiple iterations:** When you need to process all multiples of numbers 1 through N, the total operations are O(N log N), not O(N²).

3. **GCD has useful algebraic properties:** If g divides both a and b, then GCD(a, b) is at least g. This lets us test candidate GCDs efficiently.

4. **Early termination is crucial:** Once we find that current_gcd == g, we can stop processing further multiples of g. This optimization changes the complexity from O(m²) to O(m log m).

Related problems: [Find Greatest Common Divisor of Array](/problem/find-greatest-common-divisor-of-array)
