---
title: "How to Solve 3Sum With Multiplicity — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 3Sum With Multiplicity. Medium difficulty, 46.2% acceptance rate. Topics: Array, Hash Table, Two Pointers, Sorting, Counting."
date: "2027-02-12"
category: "dsa-patterns"
tags: ["3sum-with-multiplicity", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve 3Sum With Multiplicity

This problem asks us to count all ordered triples `(i, j, k)` where `i < j < k` and `arr[i] + arr[j] + arr[k] == target`. The twist is that we need to handle duplicate values carefully and return the count modulo 10⁹+7. What makes this interesting is that we can't just use the standard 3Sum two-pointer approach directly—we need to account for multiple occurrences of the same value and count all valid index combinations, not just unique value combinations.

## Visual Walkthrough

Let's trace through a small example: `arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]` with `target = 8`.

We'll use a counting approach. First, we count frequency of each number:

- 1 appears 2 times
- 2 appears 2 times
- 3 appears 2 times
- 4 appears 2 times
- 5 appears 2 times

Now we consider all possible combinations of three numbers (a ≤ b ≤ c) that sum to 8:

1. **Case 1: All three numbers are different**
   - (1, 2, 5): 1+2+5=8  
     Count = freq[1] × freq[2] × freq[5] = 2 × 2 × 2 = 8
   - (1, 3, 4): 1+3+4=8  
     Count = 2 × 2 × 2 = 8
   - (2, 3, 3): 2+3+3=8 (but here b=c, so this is Case 2)

2. **Case 2: Two numbers are equal (a = b or b = c)**
   - (2, 3, 3): b=c  
     Count = freq[2] × C(freq[3], 2) = 2 × (2×1/2) = 2 × 1 = 2
   - (3, 3, 2): This is the same as above since we consider a ≤ b ≤ c

3. **Case 3: All three numbers are equal**
   - No triple of equal numbers sums to 8

Total count = 8 + 8 + 2 = 18. We'll see how to systematically handle these cases in code.

## Brute Force Approach

The most straightforward solution is to try all possible triples `(i, j, k)` with `i < j < k`:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def threeSumMulti(arr, target):
    MOD = 10**9 + 7
    n = len(arr)
    count = 0

    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if arr[i] + arr[j] + arr[k] == target:
                    count = (count + 1) % MOD

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function threeSumMulti(arr, target) {
  const MOD = 10 ** 9 + 7;
  const n = arr.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (arr[i] + arr[j] + arr[k] === target) {
          count = (count + 1) % MOD;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int threeSumMulti(int[] arr, int target) {
    final int MOD = 1_000_000_007;
    int n = arr.length;
    int count = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                if (arr[i] + arr[j] + arr[k] == target) {
                    count = (count + 1) % MOD;
                }
            }
        }
    }

    return count;
}
```

</div>

This brute force approach is too slow for the constraints (n up to 3000 would require ~27 billion operations). We need a more efficient solution.

## Optimized Approach

The key insight is that we don't need to track indices directly—we only care about values and their frequencies. Since `arr[i]` values are between 0 and 100 (as per problem constraints), we can:

1. Count frequency of each number (0 to 100)
2. Iterate through all possible values `i`, `j`, `k` where `i ≤ j ≤ k`
3. For each valid combination where `i + j + k == target`, calculate the number of ways to choose indices with these values

We need to handle three cases carefully:

- **Case 1:** `i < j < k` (all different values): Count = `freq[i] × freq[j] × freq[k]`
- **Case 2:** `i = j < k` or `i < j = k`: Count = `C(freq[i], 2) × freq[k]` or `freq[i] × C(freq[j], 2)`
- **Case 3:** `i = j = k`: Count = `C(freq[i], 3)`

Where `C(n, k)` is the combination formula `n!/(k!(n-k)!)`. For our purposes:

- `C(n, 2) = n × (n-1) / 2`
- `C(n, 3) = n × (n-1) × (n-2) / 6`

## Optimal Solution

Here's the complete solution using frequency counting:

<div class="code-group">

```python
# Time: O(n + m²) where m=101 (max value) | Space: O(m)
def threeSumMulti(arr, target):
    MOD = 10**9 + 7
    # Step 1: Count frequency of each number (0 to 100)
    freq = [0] * 101
    for num in arr:
        freq[num] += 1

    count = 0

    # Step 2: Iterate through all possible i, j, k where i ≤ j ≤ k
    for i in range(101):
        if freq[i] == 0:
            continue

        for j in range(i, 101):
            if freq[j] == 0:
                continue

            k = target - i - j

            # Check if k is valid (within bounds and j ≤ k for ordering)
            if k < 0 or k > 100 or k < j:
                continue

            if freq[k] == 0:
                continue

            # Step 3: Calculate combinations based on equality cases
            if i == j == k:
                # All three numbers are equal: choose 3 from freq[i]
                # C(n, 3) = n * (n-1) * (n-2) / 6
                count += freq[i] * (freq[i] - 1) * (freq[i] - 2) // 6

            elif i == j:
                # First two numbers are equal, third is different
                # C(freq[i], 2) * freq[k]
                count += (freq[i] * (freq[i] - 1) // 2) * freq[k]

            elif j == k:
                # Last two numbers are equal, first is different
                # freq[i] * C(freq[j], 2)
                count += freq[i] * (freq[j] * (freq[j] - 1) // 2)

            else:
                # All three numbers are different
                count += freq[i] * freq[j] * freq[k]

    return count % MOD
```

```javascript
// Time: O(n + m²) where m=101 (max value) | Space: O(m)
function threeSumMulti(arr, target) {
  const MOD = 10 ** 9 + 7;
  // Step 1: Count frequency of each number (0 to 100)
  const freq = new Array(101).fill(0);
  for (const num of arr) {
    freq[num]++;
  }

  let count = 0;

  // Step 2: Iterate through all possible i, j, k where i ≤ j ≤ k
  for (let i = 0; i <= 100; i++) {
    if (freq[i] === 0) continue;

    for (let j = i; j <= 100; j++) {
      if (freq[j] === 0) continue;

      const k = target - i - j;

      // Check if k is valid (within bounds and j ≤ k for ordering)
      if (k < 0 || k > 100 || k < j) continue;

      if (freq[k] === 0) continue;

      // Step 3: Calculate combinations based on equality cases
      if (i === j && j === k) {
        // All three numbers are equal: choose 3 from freq[i]
        // C(n, 3) = n * (n-1) * (n-2) / 6
        count += (freq[i] * (freq[i] - 1) * (freq[i] - 2)) / 6;
      } else if (i === j) {
        // First two numbers are equal, third is different
        // C(freq[i], 2) * freq[k]
        count += ((freq[i] * (freq[i] - 1)) / 2) * freq[k];
      } else if (j === k) {
        // Last two numbers are equal, first is different
        // freq[i] * C(freq[j], 2)
        count += freq[i] * ((freq[j] * (freq[j] - 1)) / 2);
      } else {
        // All three numbers are different
        count += freq[i] * freq[j] * freq[k];
      }
    }
  }

  return count % MOD;
}
```

```java
// Time: O(n + m²) where m=101 (max value) | Space: O(m)
public int threeSumMulti(int[] arr, int target) {
    final int MOD = 1_000_000_007;
    // Step 1: Count frequency of each number (0 to 100)
    long[] freq = new long[101];
    for (int num : arr) {
        freq[num]++;
    }

    long count = 0;

    // Step 2: Iterate through all possible i, j, k where i ≤ j ≤ k
    for (int i = 0; i <= 100; i++) {
        if (freq[i] == 0) continue;

        for (int j = i; j <= 100; j++) {
            if (freq[j] == 0) continue;

            int k = target - i - j;

            // Check if k is valid (within bounds and j ≤ k for ordering)
            if (k < 0 || k > 100 || k < j) continue;

            if (freq[k] == 0) continue;

            // Step 3: Calculate combinations based on equality cases
            if (i == j && j == k) {
                // All three numbers are equal: choose 3 from freq[i]
                // C(n, 3) = n * (n-1) * (n-2) / 6
                count += freq[i] * (freq[i] - 1) * (freq[i] - 2) / 6;
            } else if (i == j) {
                // First two numbers are equal, third is different
                // C(freq[i], 2) * freq[k]
                count += (freq[i] * (freq[i] - 1) / 2) * freq[k];
            } else if (j == k) {
                // Last two numbers are equal, first is different
                // freq[i] * C(freq[j], 2)
                count += freq[i] * (freq[j] * (freq[j] - 1) / 2);
            } else {
                // All three numbers are different
                count += freq[i] * freq[j] * freq[k];
            }
        }
    }

    return (int)(count % MOD);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m²) where n is the length of `arr` and m is the range of values (101 in this case, since values are 0-100).

- O(n) to count frequencies
- O(m²) to iterate through all pairs (i, j) where i ≤ j ≤ 100
- Since m=101 is constant, this is effectively O(n + 101²) = O(n)

**Space Complexity:** O(m) = O(101) = O(1) for the frequency array. The space is constant regardless of input size.

## Common Mistakes

1. **Forgetting to handle the modulo operation**: The count can be very large (up to C(3000, 3) ≈ 4.5 billion), so we need to apply modulo 10⁹+7 at the end. Some candidates forget this entirely.

2. **Double counting combinations**: When i, j, k are all different, it's tempting to multiply by 6 (3! permutations), but we're counting ordered triples where i < j < k, so we should only count each unique ordered triple once. Our approach with i ≤ j ≤ k ensures this.

3. **Integer overflow**: Even with modulo, intermediate calculations can overflow. In Java, use `long` for the count variable. In Python, integers are arbitrary precision, but in JavaScript, use BigInt for very large inputs or apply modulo during calculations.

4. **Missing the j ≤ k condition**: When we calculate k = target - i - j, we must ensure j ≤ k to maintain the i ≤ j ≤ k ordering. Otherwise, we might count the same triple twice (e.g., (1,2,5) and (1,5,2)).

## When You'll See This Pattern

This frequency counting pattern appears in many "sum" problems with constraints on value ranges:

1. **Two Sum (with duplicates)**: Similar to the classic Two Sum, but when you need to count all pairs rather than find one pair.

2. **3Sum**: The classic problem finds unique triplets summing to zero. This problem extends it to count all index combinations.

3. **4Sum II**: Given four arrays, count tuples (i,j,k,l) such that A[i]+B[j]+C[k]+D[l]=0. Uses similar frequency counting across multiple arrays.

4. **Subarray Sum Equals K**: While different in structure, it uses prefix sums and frequency counting to find subarrays summing to k.

## Key Takeaways

1. **When values have limited range, consider frequency counting**: If values are bounded (like 0-100 here), counting frequencies and iterating through possible values is often more efficient than iterating through indices.

2. **Handle equality cases separately in combination problems**: When counting combinations with potential duplicates, the formulas differ based on how many values are equal. Always consider: all different, two equal, all three equal.

3. **Maintain ordering to avoid duplicates**: By enforcing i ≤ j ≤ k, we ensure each valid triple is counted exactly once without needing to deduplicate later.

[Practice this problem on CodeJeet](/problem/3sum-with-multiplicity)
