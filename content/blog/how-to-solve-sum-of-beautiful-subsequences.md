---
title: "How to Solve Sum of Beautiful Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Beautiful Subsequences. Hard difficulty, 31.3% acceptance rate. Topics: Array, Math, Binary Indexed Tree, Number Theory."
date: "2026-06-19"
category: "dsa-patterns"
tags: ["sum-of-beautiful-subsequences", "array", "math", "binary-indexed-tree", "hard"]
---

# How to Solve Sum of Beautiful Subsequences

This problem asks us to compute the sum of "beauty" values for all positive integers `g`, where beauty is defined as `g × (number of strictly increasing subsequences whose GCD equals g)`. The challenge lies in efficiently counting subsequences with specific GCD values while ensuring they're strictly increasing. The combination of subsequence counting, GCD constraints, and ordering requirements makes this a complex combinatorial problem.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 3, 4]`. We need to find all strictly increasing subsequences and compute their GCDs.

First, list all strictly increasing subsequences:

- Single elements: [2], [3], [4]
- Pairs: [2,3], [2,4], [3,4]
- Triple: [2,3,4]

Now compute GCD for each:

- [2]: GCD = 2
- [3]: GCD = 3
- [4]: GCD = 4
- [2,3]: GCD = 1
- [2,4]: GCD = 2
- [3,4]: GCD = 1
- [2,3,4]: GCD = 1

Count subsequences by GCD:

- GCD = 1: [2,3], [3,4], [2,3,4] → 3 subsequences
- GCD = 2: [2], [2,4] → 2 subsequences
- GCD = 3: [3] → 1 subsequence
- GCD = 4: [4] → 1 subsequence

Compute beauty for each `g`:

- g=1: 1 × 3 = 3
- g=2: 2 × 2 = 4
- g=3: 3 × 1 = 3
- g=4: 4 × 1 = 4

Sum = 3 + 4 + 3 + 4 = 14

The naive approach would generate all 2^n subsequences, which is infeasible for n up to 1000. We need a smarter way to count without explicit enumeration.

## Brute Force Approach

A brute force solution would:

1. Generate all 2^n subsequences using bitmasks or recursion
2. For each subsequence, check if it's strictly increasing
3. If valid, compute its GCD
4. Count occurrences of each GCD value
5. Sum up g × count for all g

The problem with this approach is exponential time complexity O(2^n × n). For n=1000, this is completely infeasible (2^1000 operations). Even with pruning (skipping non-increasing subsequences early), we'd still need to consider far too many possibilities.

<div class="code-group">

```python
# Brute Force Solution (Exponential Time - Not Feasible for Large n)
def sumOfBeautifulSubsequences_brute(nums):
    n = len(nums)
    from math import gcd
    from collections import defaultdict

    # Count subsequences by their GCD
    count_by_gcd = defaultdict(int)

    # Generate all subsequences using bitmask
    for mask in range(1, 1 << n):  # Skip empty subsequence
        subsequence = []
        valid = True

        # Extract elements based on mask bits
        for i in range(n):
            if mask & (1 << i):
                if subsequence and nums[i] <= subsequence[-1]:
                    valid = False  # Not strictly increasing
                    break
                subsequence.append(nums[i])

        if not valid:
            continue

        # Compute GCD of subsequence
        current_gcd = subsequence[0]
        for num in subsequence[1:]:
            current_gcd = gcd(current_gcd, num)

        count_by_gcd[current_gcd] += 1

    # Compute sum of beauty values
    result = 0
    for g, count in count_by_gcd.items():
        result += g * count

    return result
```

```javascript
// Brute Force Solution (Exponential Time - Not Feasible for Large n)
function sumOfBeautifulSubsequencesBrute(nums) {
  const n = nums.length;
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const countByGcd = new Map();

  // Generate all subsequences using bitmask
  for (let mask = 1; mask < 1 << n; mask++) {
    const subsequence = [];
    let valid = true;

    // Extract elements based on mask bits
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        if (subsequence.length > 0 && nums[i] <= subsequence[subsequence.length - 1]) {
          valid = false; // Not strictly increasing
          break;
        }
        subsequence.push(nums[i]);
      }
    }

    if (!valid) continue;

    // Compute GCD of subsequence
    let currentGcd = subsequence[0];
    for (let i = 1; i < subsequence.length; i++) {
      currentGcd = gcd(currentGcd, subsequence[i]);
    }

    // Update count
    countByGcd.set(currentGcd, (countByGcd.get(currentGcd) || 0) + 1);
  }

  // Compute sum of beauty values
  let result = 0;
  for (const [g, count] of countByGcd) {
    result += g * count;
  }

  return result;
}
```

```java
// Brute Force Solution (Exponential Time - Not Feasible for Large n)
import java.util.*;

public class Solution {
    public int sumOfBeautifulSubsequencesBrute(int[] nums) {
        int n = nums.length;
        Map<Integer, Integer> countByGcd = new HashMap<>();

        // Generate all subsequences using bitmask
        for (int mask = 1; mask < (1 << n); mask++) {
            List<Integer> subsequence = new ArrayList<>();
            boolean valid = true;

            // Extract elements based on mask bits
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    if (!subsequence.isEmpty() && nums[i] <= subsequence.get(subsequence.size() - 1)) {
                        valid = false;  // Not strictly increasing
                        break;
                    }
                    subsequence.add(nums[i]);
                }
            }

            if (!valid) continue;

            // Compute GCD of subsequence
            int currentGcd = subsequence.get(0);
            for (int i = 1; i < subsequence.size(); i++) {
                currentGcd = gcd(currentGcd, subsequence.get(i));
            }

            // Update count
            countByGcd.put(currentGcd, countByGcd.getOrDefault(currentGcd, 0) + 1);
        }

        // Compute sum of beauty values
        int result = 0;
        for (Map.Entry<Integer, Integer> entry : countByGcd.entrySet()) {
            result += entry.getKey() * entry.getValue();
        }

        return result;
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}
```

</div>

## Optimized Approach

The key insight is to use **dynamic programming with GCD tracking** and apply the **inclusion-exclusion principle** for GCD counting.

### Step-by-Step Reasoning:

1. **DP State Definition**: Let `dp[i][g]` = number of strictly increasing subsequences ending at index `i` with GCD exactly `g`.

2. **Transition**: For each element `nums[i]`, we can:
   - Start a new subsequence: `dp[i][nums[i]] += 1`
   - Extend existing subsequences: For all `j < i` where `nums[j] < nums[i]`, and for all GCD values `g` from previous subsequences ending at `j`, compute new GCD = `gcd(g, nums[i])` and add to `dp[i][new_gcd]`

3. **GCD Compression**: Since `nums[i] ≤ 10^4`, the maximum possible GCD is also `10^4`. We can store GCD values in an array instead of a map for efficiency.

4. **Inclusion-Exclusion for GCD Counting**: To get the total count of subsequences with GCD exactly `g`, we need to subtract those with GCD being multiples of `g` but not exactly `g`. This is similar to counting numbers divisible by `g` but not by any multiple.

5. **Algorithm Outline**:
   - Sort the array to ensure increasing subsequences (but we need to maintain original order for DP transitions)
   - Use DP to count subsequences ending at each position with each GCD
   - Apply inclusion-exclusion to get exact GCD counts
   - Sum up `g × count` for all `g`

### Why This Works:

- The DP ensures we only consider strictly increasing subsequences by requiring `nums[j] < nums[i]`
- GCD computation is efficient because we only compute GCDs for valid transitions
- Inclusion-exclusion handles the "exactly g" requirement without double-counting

## Optimal Solution

Here's the complete optimized solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m * log(m)) where n = len(nums), m = max(nums)
# Space: O(n * m)
def sumOfBeautifulSubsequences(nums):
    MOD = 10**9 + 7
    n = len(nums)

    # Find maximum value in nums to determine GCD range
    max_val = max(nums)

    # dp[i][g] = number of subsequences ending at index i with GCD exactly g
    # We'll use a list of dictionaries for memory efficiency
    dp = [{} for _ in range(n)]

    # First, process each element as starting point of a subsequence
    for i in range(n):
        # Single element subsequence [nums[i]] has GCD = nums[i]
        dp[i][nums[i]] = 1

    # Process transitions: extend existing subsequences
    for i in range(n):
        # Look at all previous elements that could extend to nums[i]
        for j in range(i):
            if nums[j] >= nums[i]:
                continue  # Skip if not strictly increasing

            # For each GCD value in subsequences ending at j
            for g, count in dp[j].items():
                # Compute new GCD when adding nums[i]
                import math
                new_gcd = math.gcd(g, nums[i])

                # Add to count of subsequences ending at i with new_gcd
                dp[i][new_gcd] = (dp[i].get(new_gcd, 0) + count) % MOD

    # Count total subsequences for each GCD value
    total_count = {}
    for i in range(n):
        for g, count in dp[i].items():
            total_count[g] = (total_count.get(g, 0) + count) % MOD

    # Apply inclusion-exclusion to get counts for "exactly g"
    # We need to subtract counts where GCD is a multiple of g but not exactly g
    exact_count = {}

    # Process GCD values in descending order
    gcd_values = sorted(total_count.keys(), reverse=True)

    for g in gcd_values:
        count = total_count[g]

        # Subtract counts of multiples that have already been processed
        # Since we process in descending order, all multiples > g are already processed
        for multiple in range(2 * g, max_val + 1, g):
            if multiple in exact_count:
                count = (count - exact_count[multiple]) % MOD

        exact_count[g] = count

    # Compute final result: sum of g * exact_count[g]
    result = 0
    for g, count in exact_count.items():
        result = (result + g * count) % MOD

    return result
```

```javascript
// Time: O(n * m * log(m)) where n = nums.length, m = Math.max(...nums)
// Space: O(n * m)
function sumOfBeautifulSubsequences(nums) {
  const MOD = 1e9 + 7;
  const n = nums.length;

  // Find maximum value in nums to determine GCD range
  const maxVal = Math.max(...nums);

  // dp[i] = Map of GCD -> count for subsequences ending at index i
  const dp = Array(n)
    .fill()
    .map(() => new Map());

  // GCD helper function
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  // First, process each element as starting point of a subsequence
  for (let i = 0; i < n; i++) {
    // Single element subsequence [nums[i]] has GCD = nums[i]
    dp[i].set(nums[i], 1);
  }

  // Process transitions: extend existing subsequences
  for (let i = 0; i < n; i++) {
    // Look at all previous elements that could extend to nums[i]
    for (let j = 0; j < i; j++) {
      if (nums[j] >= nums[i]) {
        continue; // Skip if not strictly increasing
      }

      // For each GCD value in subsequences ending at j
      for (const [g, count] of dp[j]) {
        // Compute new GCD when adding nums[i]
        const newGcd = gcd(g, nums[i]);

        // Add to count of subsequences ending at i with newGcd
        const current = dp[i].get(newGcd) || 0;
        dp[i].set(newGcd, (current + count) % MOD);
      }
    }
  }

  // Count total subsequences for each GCD value
  const totalCount = new Map();
  for (let i = 0; i < n; i++) {
    for (const [g, count] of dp[i]) {
      const current = totalCount.get(g) || 0;
      totalCount.set(g, (current + count) % MOD);
    }
  }

  // Apply inclusion-exclusion to get counts for "exactly g"
  const exactCount = new Map();

  // Get GCD values in descending order
  const gcdValues = Array.from(totalCount.keys()).sort((a, b) => b - a);

  for (const g of gcdValues) {
    let count = totalCount.get(g);

    // Subtract counts of multiples that have already been processed
    // Since we process in descending order, all multiples > g are already processed
    for (let multiple = 2 * g; multiple <= maxVal; multiple += g) {
      if (exactCount.has(multiple)) {
        count = (count - exactCount.get(multiple) + MOD) % MOD;
      }
    }

    exactCount.set(g, count);
  }

  // Compute final result: sum of g * exactCount[g]
  let result = 0;
  for (const [g, count] of exactCount) {
    result = (result + g * count) % MOD;
  }

  return result;
}
```

```java
// Time: O(n * m * log(m)) where n = nums.length, m = max(nums)
// Space: O(n * m)
import java.util.*;

public class Solution {
    public int sumOfBeautifulSubsequences(int[] nums) {
        final int MOD = 1_000_000_007;
        int n = nums.length;

        // Find maximum value in nums to determine GCD range
        int maxVal = 0;
        for (int num : nums) {
            maxVal = Math.max(maxVal, num);
        }

        // dp[i] = Map of GCD -> count for subsequences ending at index i
        List<Map<Integer, Integer>> dp = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            dp.add(new HashMap<>());
        }

        // First, process each element as starting point of a subsequence
        for (int i = 0; i < n; i++) {
            // Single element subsequence [nums[i]] has GCD = nums[i]
            dp.get(i).put(nums[i], 1);
        }

        // Process transitions: extend existing subsequences
        for (int i = 0; i < n; i++) {
            // Look at all previous elements that could extend to nums[i]
            for (int j = 0; j < i; j++) {
                if (nums[j] >= nums[i]) {
                    continue;  // Skip if not strictly increasing
                }

                // For each GCD value in subsequences ending at j
                for (Map.Entry<Integer, Integer> entry : dp.get(j).entrySet()) {
                    int g = entry.getKey();
                    int count = entry.getValue();

                    // Compute new GCD when adding nums[i]
                    int newGcd = gcd(g, nums[i]);

                    // Add to count of subsequences ending at i with newGcd
                    int current = dp.get(i).getOrDefault(newGcd, 0);
                    dp.get(i).put(newGcd, (current + count) % MOD);
                }
            }
        }

        // Count total subsequences for each GCD value
        Map<Integer, Integer> totalCount = new HashMap<>();
        for (int i = 0; i < n; i++) {
            for (Map.Entry<Integer, Integer> entry : dp.get(i).entrySet()) {
                int g = entry.getKey();
                int count = entry.getValue();
                int current = totalCount.getOrDefault(g, 0);
                totalCount.put(g, (current + count) % MOD);
            }
        }

        // Apply inclusion-exclusion to get counts for "exactly g"
        Map<Integer, Integer> exactCount = new HashMap<>();

        // Get GCD values in descending order
        List<Integer> gcdValues = new ArrayList<>(totalCount.keySet());
        Collections.sort(gcdValues, Collections.reverseOrder());

        for (int g : gcdValues) {
            int count = totalCount.get(g);

            // Subtract counts of multiples that have already been processed
            // Since we process in descending order, all multiples > g are already processed
            for (int multiple = 2 * g; multiple <= maxVal; multiple += g) {
                if (exactCount.containsKey(multiple)) {
                    count = (count - exactCount.get(multiple) + MOD) % MOD;
                }
            }

            exactCount.put(g, count);
        }

        // Compute final result: sum of g * exactCount[g]
        long result = 0;
        for (Map.Entry<Integer, Integer> entry : exactCount.entrySet()) {
            result = (result + (long) entry.getKey() * entry.getValue()) % MOD;
        }

        return (int) result;
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n² \* log(max_val))

- Outer loop over `i`: O(n)
- Inner loop over `j < i`: O(n) in worst case
- For each `(i, j)` pair, we iterate over GCD values in `dp[j]`: O(log(max_val)) on average
- Inclusion-exclusion step: O(max_val \* log(max_val)) using harmonic series analysis
- Overall: O(n² \* log(max_val)) which is feasible for n ≤ 1000

**Space Complexity**: O(n \* max_val)

- `dp` array stores up to O(n \* max_val) entries in worst case
- `totalCount` and `exactCount` store up to O(max_val) entries
- Overall: O(n \* max_val) which is manageable for constraints

## Common Mistakes

1. **Forgetting to handle the "exactly g" requirement**: Many candidates count subsequences where GCD is divisible by `g` instead of exactly equal to `g`. Remember to use inclusion-exclusion by subtracting counts of multiples.

2. **Not ensuring strictly increasing subsequences**: When extending subsequences, you must check `nums[j] < nums[i]`, not `nums[j] ≤ nums[i]`. The problem says "strictly increasing."

3. **Memory overflow with full 2D array**: Using `dp[n][max_val]` as a full 2D array would use O(n \* 10^4) = 10^7 entries, which is borderline. Using dictionaries/maps for sparse storage is more efficient.

4. **Integer overflow in multiplication**: When computing `g * count`, both can be up to 10^4, giving 10^8, which fits in 32-bit integers. However, with modulo operations, always use 64-bit intermediate values to avoid overflow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Dynamic Programming for Subsequence Counting**: Similar to "Number of Increasing Subsequences" (LeetCode 491) but with additional constraints.

2. **GCD Inclusion-Exclusion**: The technique of counting "exactly g" by subtracting multiples appears in problems like "Count the Number of Good Subarrays" (LeetCode 2537) and "Number of Subarrays With GCD Equal to K" (LeetCode 2447).

3. **DP with Additional State**: When you need to track more than just length in subsequence DP (like GCD, sum modulo k, etc.), this pattern applies. See "Number of Subsequences That Satisfy the Given Sum Condition" (LeetCode 1498).

## Key Takeaways

1. **Combine DP with mathematical properties**: When a problem involves subsequences with mathematical constraints (GCD, LCM, divisibility), consider augmenting DP states with those properties.

2. **Inclusion-exclusion for "exactly" constraints**: When you need to count objects with property "exactly X" but can more easily count "divisible by X", use inclusion-exclusion by processing values in descending order.

3. **Sparse storage for efficiency**: When DP states have many possible values but only a subset is reachable, use dictionaries/maps instead of arrays to save memory.

[Practice this problem on CodeJeet](/problem/sum-of-beautiful-subsequences)
