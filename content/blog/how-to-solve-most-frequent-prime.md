---
title: "How to Solve Most Frequent Prime — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Frequent Prime. Medium difficulty, 45.8% acceptance rate. Topics: Array, Hash Table, Math, Matrix, Counting."
date: "2029-12-16"
category: "dsa-patterns"
tags: ["most-frequent-prime", "array", "hash-table", "math", "medium"]
---

# How to Solve Most Frequent Prime

This problem asks us to find the most frequent prime number that can be formed by starting at any cell in an `m x n` matrix and moving in one of eight possible directions (like a chess queen), appending digits along the path. The challenge lies in efficiently exploring all possible number formations while checking primality and tracking frequencies.

**What makes this tricky:** We need to handle numbers formed by moving in straight lines in any of 8 directions, potentially stopping at any point along each path. This creates many possible numbers to check, and we must efficiently identify primes among them while tracking frequencies to find the most common one.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
mat = [[1, 1],
       [3, 9]]
```

From cell (0,0) with value 1:

- East: 1 → 11 (from (0,0) to (0,1))
- Southeast: 1 → 13 (from (0,0) to (1,1))
- South: 1 → 13 (from (0,0) to (1,0))
- Southwest: Can't move (out of bounds)
- West: Can't move (out of bounds)
- Northwest: Can't move (out of bounds)
- North: Can't move (out of bounds)
- Northeast: Can't move (out of bounds)

From cell (0,1) with value 1:

- West: 1 → 11 (from (0,1) to (0,0))
- Southwest: 1 → 13 (from (0,1) to (1,0))
- South: 1 → 19 (from (0,1) to (1,1))

From cell (1,0) with value 3:

- East: 3 → 39 (from (1,0) to (1,1))
- Northeast: 3 → 31 (from (1,0) to (0,1))
- North: 3 → 31 (from (1,0) to (0,0))

From cell (1,1) with value 9:

- West: 9 → 93 (from (1,1) to (1,0))
- Northwest: 9 → 91 (from (1,1) to (0,0))
- North: 9 → 91 (from (1,1) to (0,1))

Now we check which are prime: 11 (prime), 13 (prime), 19 (prime), 31 (prime), 91 (not prime, 7×13), 93 (not prime, 3×31), 39 (not prime, 3×13).

Frequencies: 11 appears 2 times, 13 appears 2 times, 19 appears 1 time, 31 appears 2 times. The most frequent prime is 11 (or 13 or 31 - all with frequency 2). If there's a tie, we return the largest one, so 31.

## Brute Force Approach

A naive approach would be:

1. From each cell, explore all 8 directions
2. For each direction, form numbers by moving 1 step, 2 steps, etc., until hitting matrix boundaries
3. For each number formed, check if it's prime
4. Track frequencies of all primes found
5. Return the most frequent (and largest in case of ties)

The problem with this approach is efficiency in prime checking. Checking primality naively for each number (by testing divisibility up to √n) would be O(√n) per number. With potentially O(m × n × max(m,n)) numbers to check, this becomes too slow for larger matrices.

## Optimized Approach

The key insight is that we need to optimize prime checking. We can use a common optimization: precompute primes up to a maximum value using the Sieve of Eratosthenes. Since the maximum number we can form has at most `max(m, n)` digits, and each digit is 0-9, the maximum value is approximately `10^max(m,n) - 1`. However, the constraints (m, n ≤ 6) mean the maximum number has at most 6 digits, so we only need primes up to 999,999.

The optimized approach:

1. Determine the maximum possible number we can form (based on matrix dimensions)
2. Precompute all primes up to that maximum using Sieve of Eratosthenes
3. From each starting cell, explore all 8 directions
4. Build numbers digit by digit as we move in each direction
5. Check primality in O(1) time using the precomputed sieve
6. Track frequencies in a hash map
7. Find the prime with maximum frequency (and maximum value in case of ties)

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n * max(m, n) + S log log S) where S is max possible number
# Space: O(S) for sieve + O(P) for frequency map where P is number of primes found
def mostFrequentPrime(mat):
    m, n = len(mat), len(mat[0])

    # Directions: east, southeast, south, southwest, west, northwest, north, northeast
    directions = [(0, 1), (1, 1), (1, 0), (1, -1),
                  (0, -1), (-1, -1), (-1, 0), (-1, 1)]

    # Find maximum possible number we can form
    # Maximum length is min(m, n) since we can only go until hitting a boundary
    max_len = max(m, n)
    max_num = 10 ** max_len - 1  # Maximum number with max_len digits

    # Step 1: Precompute primes using Sieve of Eratosthenes
    sieve = [True] * (max_num + 1)
    sieve[0] = sieve[1] = False  # 0 and 1 are not prime

    # Mark non-primes
    for i in range(2, int(max_num ** 0.5) + 1):
        if sieve[i]:
            # Mark all multiples of i as non-prime
            for j in range(i * i, max_num + 1, i):
                sieve[j] = False

    # Step 2: Explore all starting positions and directions
    freq = {}

    for i in range(m):
        for j in range(n):
            # Start from each cell
            for dx, dy in directions:
                x, y = i, j
                current_num = 0

                # Continue moving in this direction until out of bounds
                while 0 <= x < m and 0 <= y < n:
                    # Build number by appending new digit
                    current_num = current_num * 10 + mat[x][y]

                    # Only consider numbers with at least 2 digits
                    if current_num >= 10 and sieve[current_num]:
                        freq[current_num] = freq.get(current_num, 0) + 1

                    # Move to next cell in this direction
                    x += dx
                    y += dy

    # Step 3: Find the most frequent prime
    if not freq:
        return -1  # No prime numbers found

    max_freq = max(freq.values())

    # Find all primes with maximum frequency
    candidates = [num for num, count in freq.items() if count == max_freq]

    # Return the largest one
    return max(candidates)
```

```javascript
// Time: O(m * n * max(m, n) + S log log S) where S is max possible number
// Space: O(S) for sieve + O(P) for frequency map where P is number of primes found
function mostFrequentPrime(mat) {
  const m = mat.length;
  const n = mat[0].length;

  // Directions: east, southeast, south, southwest, west, northwest, north, northeast
  const directions = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];

  // Find maximum possible number we can form
  const maxLen = Math.max(m, n);
  const maxNum = Math.pow(10, maxLen) - 1; // Maximum number with maxLen digits

  // Step 1: Precompute primes using Sieve of Eratosthenes
  const sieve = new Array(maxNum + 1).fill(true);
  sieve[0] = sieve[1] = false; // 0 and 1 are not prime

  // Mark non-primes
  for (let i = 2; i * i <= maxNum; i++) {
    if (sieve[i]) {
      // Mark all multiples of i as non-prime
      for (let j = i * i; j <= maxNum; j += i) {
        sieve[j] = false;
      }
    }
  }

  // Step 2: Explore all starting positions and directions
  const freq = new Map();

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Start from each cell
      for (const [dx, dy] of directions) {
        let x = i,
          y = j;
        let currentNum = 0;

        // Continue moving in this direction until out of bounds
        while (x >= 0 && x < m && y >= 0 && y < n) {
          // Build number by appending new digit
          currentNum = currentNum * 10 + mat[x][y];

          // Only consider numbers with at least 2 digits
          if (currentNum >= 10 && sieve[currentNum]) {
            freq.set(currentNum, (freq.get(currentNum) || 0) + 1);
          }

          // Move to next cell in this direction
          x += dx;
          y += dy;
        }
      }
    }
  }

  // Step 3: Find the most frequent prime
  if (freq.size === 0) {
    return -1; // No prime numbers found
  }

  let maxFreq = 0;
  let result = -1;

  // Find the prime with maximum frequency (and maximum value in case of tie)
  for (const [num, count] of freq) {
    if (count > maxFreq || (count === maxFreq && num > result)) {
      maxFreq = count;
      result = num;
    }
  }

  return result;
}
```

```java
// Time: O(m * n * max(m, n) + S log log S) where S is max possible number
// Space: O(S) for sieve + O(P) for frequency map where P is number of primes found
import java.util.*;

class Solution {
    public int mostFrequentPrime(int[][] mat) {
        int m = mat.length;
        int n = mat[0].length;

        // Directions: east, southeast, south, southwest, west, northwest, north, northeast
        int[][] directions = {
            {0, 1}, {1, 1}, {1, 0}, {1, -1},
            {0, -1}, {-1, -1}, {-1, 0}, {-1, 1}
        };

        // Find maximum possible number we can form
        int maxLen = Math.max(m, n);
        int maxNum = (int)Math.pow(10, maxLen) - 1;  // Maximum number with maxLen digits

        // Step 1: Precompute primes using Sieve of Eratosthenes
        boolean[] sieve = new boolean[maxNum + 1];
        Arrays.fill(sieve, true);
        sieve[0] = sieve[1] = false;  // 0 and 1 are not prime

        // Mark non-primes
        for (int i = 2; i * i <= maxNum; i++) {
            if (sieve[i]) {
                // Mark all multiples of i as non-prime
                for (int j = i * i; j <= maxNum; j += i) {
                    sieve[j] = false;
                }
            }
        }

        // Step 2: Explore all starting positions and directions
        Map<Integer, Integer> freq = new HashMap<>();

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Start from each cell
                for (int[] dir : directions) {
                    int dx = dir[0], dy = dir[1];
                    int x = i, y = j;
                    int currentNum = 0;

                    // Continue moving in this direction until out of bounds
                    while (x >= 0 && x < m && y >= 0 && y < n) {
                        // Build number by appending new digit
                        currentNum = currentNum * 10 + mat[x][y];

                        // Only consider numbers with at least 2 digits
                        if (currentNum >= 10 && sieve[currentNum]) {
                            freq.put(currentNum, freq.getOrDefault(currentNum, 0) + 1);
                        }

                        // Move to next cell in this direction
                        x += dx;
                        y += dy;
                    }
                }
            }
        }

        // Step 3: Find the most frequent prime
        if (freq.isEmpty()) {
            return -1;  // No prime numbers found
        }

        int maxFreq = 0;
        int result = -1;

        // Find the prime with maximum frequency (and maximum value in case of tie)
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();

            if (count > maxFreq || (count == maxFreq && num > result)) {
                maxFreq = count;
                result = num;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × max(m, n) + S log log S)

- The first term (m × n × max(m, n)) comes from exploring all starting cells (m × n), all 8 directions (constant), and moving up to max(m, n) steps in each direction
- The second term (S log log S) comes from the Sieve of Eratosthenes, where S is the maximum possible number (up to 10^max(m,n) - 1)
- With constraints m, n ≤ 6, this is efficient

**Space Complexity:** O(S + P)

- O(S) for the sieve array storing primality up to the maximum number
- O(P) for the frequency map storing primes we encounter (P ≤ total numbers formed)

## Common Mistakes

1. **Forgetting single-digit numbers:** The problem states we should only consider numbers with at least 2 digits. A common mistake is including single-digit numbers (even though 2, 3, 5, 7 are prime).

2. **Inefficient prime checking:** Checking primality for each number individually using trial division up to √n would be too slow. The sieve optimization is crucial for performance.

3. **Direction handling errors:** With 8 directions to handle, it's easy to make off-by-one errors in the direction vectors or boundary checking.

4. **Tie-breaking incorrectly:** When multiple primes have the same maximum frequency, we must return the largest one, not the smallest or first encountered.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Grid traversal with multiple directions:** Similar to problems like "Word Search" (LeetCode 79) where you explore paths in a grid, or "Number of Islands" (LeetCode 200) for multi-directional exploration.

2. **Sieve of Eratosthenes for prime optimization:** Used in problems like "Count Primes" (LeetCode 204) where efficient prime counting is needed.

3. **Building numbers digit by digit:** Similar to problems involving number formation from sequences, like finding all possible interpretations of a digit sequence.

## Key Takeaways

1. **Precomputation is powerful:** When you need to repeatedly check a property (like primality) for many values, precomputing results for all possible values can turn O(√n) checks into O(1) lookups.

2. **Systematic exploration is key for grid problems:** When exploring all possible paths from each cell, use direction vectors to avoid repetitive code and ensure you cover all cases.

3. **Read constraints carefully:** The constraint m, n ≤ 6 tells us the maximum number has at most 6 digits, making sieve precomputation feasible. Always check constraints to guide your approach.

[Practice this problem on CodeJeet](/problem/most-frequent-prime)
