---
title: "How to Solve Smallest Divisible Digit Product II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Smallest Divisible Digit Product II. Hard difficulty, 14.4% acceptance rate. Topics: Math, String, Backtracking, Greedy, Number Theory."
date: "2026-08-31"
category: "dsa-patterns"
tags: ["smallest-divisible-digit-product-ii", "math", "string", "backtracking", "hard"]
---

# How to Solve Smallest Divisible Digit Product II

This problem asks us to find the smallest zero-free number (no digit '0') greater than or equal to a given number `num`, such that the product of its digits is divisible by `t`. The challenge lies in efficiently searching through possible numbers while ensuring digit product divisibility constraints are met. What makes this problem particularly tricky is that we can't simply increment the number and check - the search space is enormous for large numbers, and we need to consider digit product properties.

## Visual Walkthrough

Let's trace through an example: `num = "123"`, `t = 6`.

We need to find the smallest zero-free number ≥ 123 where the product of digits is divisible by 6.

**Step 1: Understanding digit product divisibility**

- The product of digits must be divisible by 6 = 2 × 3
- This means the digits must collectively contain factors 2 and 3
- Since digits are 1-9, prime factors available are 2, 3, 5, 7

**Step 2: Starting from the given number**

- Check 123: digits = [1, 2, 3], product = 1×2×3 = 6, divisible by 6 ✓
- But wait, we need to ensure it's the smallest ≥ 123
- Actually, 123 itself works! So answer is "123"

Let's try a harder example: `num = "239"`, `t = 12`.

**Step 3: Factorizing t**

- t = 12 = 2² × 3
- We need at least two factors of 2 and one factor of 3 in the digit product

**Step 4: Checking from 239 upward**

- 239: digits [2,3,9], product = 2×3×9 = 54 = 2×3³ → has one 2, needs two
- 240: contains 0 → invalid (not zero-free)
- 241: [2,4,1], product = 8 = 2³ → has three 2's but no 3
- 242: [2,4,2], product = 16 = 2⁴ → no 3
- 243: [2,4,3], product = 24 = 2³×3 → has three 2's and one 3 ✓
- So answer is "243"

The key insight: we can't just increment and check because for large numbers like "999999999999999999", we'd need to check millions of numbers. We need a smarter approach.

## Brute Force Approach

The naive solution would be:

1. Convert `num` to an integer
2. Start from that number and increment
3. For each number, check:
   - No digit is '0'
   - Product of digits is divisible by `t`
4. Return the first number that satisfies both

<div class="code-group">

```python
# Time: O(10^n) where n = len(num) - extremely slow!
# Space: O(1)
def smallestDivisibleProductBrute(num: str, t: int) -> str:
    n = int(num)

    while True:
        # Check if number is zero-free
        str_n = str(n)
        if '0' in str_n:
            n += 1
            continue

        # Calculate product of digits
        product = 1
        for ch in str_n:
            product *= int(ch)

        # Check divisibility
        if product % t == 0:
            return str_n

        n += 1
```

```javascript
// Time: O(10^n) where n = num.length - extremely slow!
// Space: O(1)
function smallestDivisibleProductBrute(num, t) {
  let n = BigInt(num);

  while (true) {
    // Check if number is zero-free
    const strN = n.toString();
    if (strN.includes("0")) {
      n++;
      continue;
    }

    // Calculate product of digits
    let product = 1n;
    for (const ch of strN) {
      product *= BigInt(ch);
    }

    // Check divisibility
    if (product % BigInt(t) === 0n) {
      return strN;
    }

    n++;
  }
}
```

```java
// Time: O(10^n) where n = num.length() - extremely slow!
// Space: O(1)
public String smallestDivisibleProductBrute(String num, int t) {
    BigInteger n = new BigInteger(num);

    while (true) {
        // Check if number is zero-free
        String strN = n.toString();
        if (strN.contains("0")) {
            n = n.add(BigInteger.ONE);
            continue;
        }

        // Calculate product of digits
        BigInteger product = BigInteger.ONE;
        for (char ch : strN.toCharArray()) {
            product = product.multiply(BigInteger.valueOf(ch - '0'));
        }

        // Check divisibility
        if (product.mod(BigInteger.valueOf(t)).equals(BigInteger.ZERO)) {
            return strN;
        }

        n = n.add(BigInteger.ONE);
    }
}
```

</div>

**Why this fails:**

- For an n-digit number, in the worst case we might need to check ~10ⁿ numbers
- Even for moderately sized numbers (e.g., 20 digits), this is 10²⁰ operations - completely infeasible
- We need to leverage mathematical properties of digit products

## Optimized Approach

The key insight is that we should work with the prime factorization of `t` and construct numbers digit by digit. Here's the step-by-step reasoning:

1. **Factorize t**: Break `t` down into its prime factors (2, 3, 5, 7 are the only primes that can come from digits 1-9)

2. **Convert to digit representation**: Each digit 1-9 has a specific prime factorization:
   - 1: ∅
   - 2: {2}
   - 3: {3}
   - 4: {2, 2}
   - 5: {5}
   - 6: {2, 3}
   - 7: {7}
   - 8: {2, 2, 2}
   - 9: {3, 3}

3. **Backtracking search**: Starting from the most significant digit, try to build the smallest number ≥ `num`:
   - If we can match or exceed `num` while satisfying the factorization requirements, we found a candidate
   - If not, we need to backtrack and try a larger digit

4. **Handling carry-over**: When we need to make the number larger than `num`, we fill remaining digits with the smallest digits that satisfy the remaining factorization requirements

5. **Optimization with DP/memoization**: We can use dynamic programming to track what factorization requirements remain at each position

The algorithm outline:

1. Factorize `t` into counts of primes 2, 3, 5, 7
2. Try to build the number from left to right, matching `num` as closely as possible
3. If we can't satisfy requirements while matching `num`, backtrack to an earlier position and increment
4. Once we pass `num` (make a digit larger than the corresponding digit in `num`), fill the rest with the smallest possible digits that satisfy remaining requirements

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 2^p) where n = len(num), p = number of prime factors (at most 4: 2,3,5,7)
# Space: O(n * 2^p) for memoization
def smallestDivisibleProduct(num: str, t: int) -> str:
    # Step 1: Factorize t into counts of primes 2, 3, 5, 7
    # These are the only primes that can appear in digits 1-9
    primes = [2, 3, 5, 7]
    target_counts = [0, 0, 0, 0]

    temp = t
    for i, p in enumerate(primes):
        while temp % p == 0:
            target_counts[i] += 1
            temp //= p

    # If t has prime factors other than 2,3,5,7, impossible with digits 1-9
    if temp > 1:
        return "-1"

    # Step 2: Precompute prime factorization for each digit 1-9
    digit_factors = []
    for d in range(1, 10):
        counts = [0, 0, 0, 0]
        temp_d = d
        for i, p in enumerate(primes):
            while temp_d % p == 0:
                counts[i] += 1
                temp_d //= p
        digit_factors.append(counts)

    n = len(num)
    digits = [int(ch) for ch in num]

    # Step 3: Memoization dictionary
    # Key: (position, remaining_counts_tuple, tight)
    # Value: whether it's possible to complete from this state
    memo = {}

    def dfs(pos, rem_counts, tight):
        """DFS to find if we can complete the number from position pos."""
        # Base case: reached end of number
        if pos == n:
            # Check if all prime factor requirements are satisfied
            return all(c <= 0 for c in rem_counts)

        # Check memoization
        key = (pos, tuple(rem_counts), tight)
        if key in memo:
            return memo[key]

        # Determine the range of digits we can try at this position
        start_digit = digits[pos] if tight else 1
        end_digit = 9

        # Try each possible digit
        for d in range(start_digit, end_digit + 1):
            # Calculate new remaining counts after using this digit
            new_counts = [
                rem_counts[i] - digit_factors[d-1][i]
                for i in range(4)
            ]

            # Check if new_counts has any negative values (would mean we exceeded requirements)
            # Actually negative is fine - it means we have more than enough of that prime factor
            # We'll track them as 0 instead
            adjusted_counts = [max(0, c) for c in new_counts]

            # Determine if we're still tight to the original number
            new_tight = tight and (d == digits[pos])

            # Recursively check if we can complete with this digit
            if dfs(pos + 1, adjusted_counts, new_tight):
                memo[key] = True
                return True

        memo[key] = False
        return False

    # Step 4: First, check if the original number already works
    # We need to check this separately since our DFS tries to match or exceed the number
    rem_counts = target_counts[:]
    for d in digits:
        for i in range(4):
            rem_counts[i] -= digit_factors[d-1][i]
    if all(c <= 0 for c in rem_counts):
        return num

    # Step 5: If not, try to find the next larger number
    # We'll build it digit by digit
    result_digits = []
    rem_counts = target_counts[:]
    tight = True

    for pos in range(n):
        start_digit = digits[pos] if tight else 1

        # Try digits from start_digit to 9
        for d in range(start_digit, 10):
            # Calculate what would remain if we choose this digit
            new_counts = [
                rem_counts[i] - digit_factors[d-1][i]
                for i in range(4)
            ]
            adjusted_counts = [max(0, c) for c in new_counts]

            # Check if we can complete the number with this choice
            new_tight = tight and (d == digits[pos])

            if dfs(pos + 1, adjusted_counts, new_tight):
                # This digit works, add it to result
                result_digits.append(str(d))
                rem_counts = adjusted_counts[:]
                tight = new_tight
                break
        else:
            # If no digit worked at this position, we need to backtrack
            # This shouldn't happen if we implement full backtracking
            return "-1"

    # Convert result digits to string
    result = ''.join(result_digits)

    # Step 6: If we found a valid number, return it
    if result:
        # Verify the result is valid
        product = 1
        for ch in result:
            product *= int(ch)
        if product % t == 0 and '0' not in result:
            return result

    # Step 7: If no n-digit number works, try n+1 digits starting with 1
    # We need to find the smallest (n+1)-digit number that works
    # This is essentially the smallest number with given digit product problem
    from collections import deque

    # We'll use BFS to find the smallest number
    # But actually, we can construct it greedily
    # Start with all required factors and try to pack them into digits

    # First, handle factors of 5 and 7 - they force specific digits
    result_factors = []

    # Each 5 requires a digit 5
    for _ in range(target_counts[2]):  # index 2 is for prime 5
        result_factors.append(5)
        target_counts[0] -= 0  # 5 doesn't provide any 2's
        target_counts[1] -= 0  # 5 doesn't provide any 3's

    # Each 7 requires a digit 7
    for _ in range(target_counts[3]):  # index 3 is for prime 7
        result_factors.append(7)

    # Now handle factors of 2 and 3
    # We want to combine them into the smallest possible digits
    # Strategy: use as many 8's, 9's, 6's, and 4's as needed

    # Use 8's for three 2's
    while target_counts[0] >= 3:
        result_factors.append(8)
        target_counts[0] -= 3

    # Use 9's for two 3's
    while target_counts[1] >= 2:
        result_factors.append(9)
        target_counts[1] -= 2

    # Use 4's for two 2's
    while target_counts[0] >= 2:
        result_factors.append(4)
        target_counts[0] -= 2

    # Use 6's for one 2 and one 3
    while target_counts[0] >= 1 and target_counts[1] >= 1:
        result_factors.append(6)
        target_counts[0] -= 1
        target_counts[1] -= 1

    # Use remaining 3's
    while target_counts[1] >= 1:
        result_factors.append(3)
        target_counts[1] -= 1

    # Use remaining 2's
    while target_counts[0] >= 1:
        result_factors.append(2)
        target_counts[0] -= 1

    # Sort digits to get smallest number
    result_factors.sort()

    # Convert to string
    if result_factors:
        return ''.join(str(d) for d in result_factors)

    return "-1"
```

```javascript
// Time: O(n * 2^p) where n = num.length, p = number of prime factors (at most 4: 2,3,5,7)
// Space: O(n * 2^p) for memoization
function smallestDivisibleProduct(num, t) {
  // Step 1: Factorize t into counts of primes 2, 3, 5, 7
  const primes = [2, 3, 5, 7];
  const targetCounts = [0, 0, 0, 0];

  let temp = t;
  for (let i = 0; i < primes.length; i++) {
    while (temp % primes[i] === 0) {
      targetCounts[i]++;
      temp /= primes[i];
    }
  }

  // If t has prime factors other than 2,3,5,7, impossible with digits 1-9
  if (temp > 1) {
    return "-1";
  }

  // Step 2: Precompute prime factorization for each digit 1-9
  const digitFactors = [];
  for (let d = 1; d <= 9; d++) {
    const counts = [0, 0, 0, 0];
    let tempD = d;
    for (let i = 0; i < primes.length; i++) {
      while (tempD % primes[i] === 0) {
        counts[i]++;
        tempD /= primes[i];
      }
    }
    digitFactors.push(counts);
  }

  const n = num.length;
  const digits = num.split("").map((ch) => parseInt(ch));

  // Step 3: Memoization map
  const memo = new Map();

  function dfs(pos, remCounts, tight) {
    // Base case: reached end of number
    if (pos === n) {
      // Check if all prime factor requirements are satisfied
      return remCounts.every((c) => c <= 0);
    }

    // Check memoization
    const key = `${pos},${remCounts.join(",")},${tight}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Determine the range of digits we can try at this position
    const startDigit = tight ? digits[pos] : 1;
    const endDigit = 9;

    // Try each possible digit
    for (let d = startDigit; d <= endDigit; d++) {
      // Calculate new remaining counts after using this digit
      const newCounts = remCounts.map((c, i) => c - digitFactors[d - 1][i]);

      // Adjust negative counts to 0 (exceeding requirements is fine)
      const adjustedCounts = newCounts.map((c) => Math.max(0, c));

      // Determine if we're still tight to the original number
      const newTight = tight && d === digits[pos];

      // Recursively check if we can complete with this digit
      if (dfs(pos + 1, adjustedCounts, newTight)) {
        memo.set(key, true);
        return true;
      }
    }

    memo.set(key, false);
    return false;
  }

  // Step 4: First, check if the original number already works
  let remCounts = [...targetCounts];
  for (const d of digits) {
    for (let i = 0; i < 4; i++) {
      remCounts[i] -= digitFactors[d - 1][i];
    }
  }
  if (remCounts.every((c) => c <= 0)) {
    return num;
  }

  // Step 5: If not, try to find the next larger number
  const resultDigits = [];
  remCounts = [...targetCounts];
  let tight = true;

  for (let pos = 0; pos < n; pos++) {
    const startDigit = tight ? digits[pos] : 1;
    let found = false;

    // Try digits from startDigit to 9
    for (let d = startDigit; d <= 9; d++) {
      // Calculate what would remain if we choose this digit
      const newCounts = remCounts.map((c, i) => c - digitFactors[d - 1][i]);
      const adjustedCounts = newCounts.map((c) => Math.max(0, c));

      // Check if we can complete the number with this choice
      const newTight = tight && d === digits[pos];

      if (dfs(pos + 1, adjustedCounts, newTight)) {
        // This digit works, add it to result
        resultDigits.push(d.toString());
        remCounts = adjustedCounts;
        tight = newTight;
        found = true;
        break;
      }
    }

    if (!found) {
      // If no digit worked at this position, we need more digits
      break;
    }
  }

  // Step 6: If we found a valid n-digit number, return it
  if (resultDigits.length === n) {
    const result = resultDigits.join("");
    // Verify the result is valid
    let product = 1;
    for (const ch of result) {
      product *= parseInt(ch);
    }
    if (product % t === 0 && !result.includes("0")) {
      return result;
    }
  }

  // Step 7: If no n-digit number works, try n+1 digits
  // We need to construct the smallest number with the required factors

  // Reset counts
  let counts = [...targetCounts];
  const resultFactors = [];

  // Handle factors of 5 and 7 first (they force specific digits)
  // Each 5 requires a digit 5
  while (counts[2] > 0) {
    resultFactors.push(5);
    counts[2]--;
  }

  // Each 7 requires a digit 7
  while (counts[3] > 0) {
    resultFactors.push(7);
    counts[3]--;
  }

  // Handle factors of 2 and 3
  // Use 8's for three 2's
  while (counts[0] >= 3) {
    resultFactors.push(8);
    counts[0] -= 3;
  }

  // Use 9's for two 3's
  while (counts[1] >= 2) {
    resultFactors.push(9);
    counts[1] -= 2;
  }

  // Use 4's for two 2's
  while (counts[0] >= 2) {
    resultFactors.push(4);
    counts[0] -= 2;
  }

  // Use 6's for one 2 and one 3
  while (counts[0] >= 1 && counts[1] >= 1) {
    resultFactors.push(6);
    counts[0]--;
    counts[1]--;
  }

  // Use remaining 3's
  while (counts[1] >= 1) {
    resultFactors.push(3);
    counts[1]--;
  }

  // Use remaining 2's
  while (counts[0] >= 1) {
    resultFactors.push(2);
    counts[0]--;
  }

  // Sort to get smallest number
  resultFactors.sort((a, b) => a - b);

  // Convert to string
  if (resultFactors.length > 0) {
    return resultFactors.join("");
  }

  return "-1";
}
```

```java
// Time: O(n * 2^p) where n = num.length(), p = number of prime factors (at most 4: 2,3,5,7)
// Space: O(n * 2^p) for memoization
public String smallestDivisibleProduct(String num, int t) {
    // Step 1: Factorize t into counts of primes 2, 3, 5, 7
    int[] primes = {2, 3, 5, 7};
    int[] targetCounts = new int[4];

    int temp = t;
    for (int i = 0; i < primes.length; i++) {
        while (temp % primes[i] == 0) {
            targetCounts[i]++;
            temp /= primes[i];
        }
    }

    // If t has prime factors other than 2,3,5,7, impossible with digits 1-9
    if (temp > 1) {
        return "-1";
    }

    // Step 2: Precompute prime factorization for each digit 1-9
    int[][] digitFactors = new int[9][4];
    for (int d = 1; d <= 9; d++) {
        int tempD = d;
        for (int i = 0; i < primes.length; i++) {
            while (tempD % primes[i] == 0) {
                digitFactors[d-1][i]++;
                tempD /= primes[i];
            }
        }
    }

    int n = num.length();
    int[] digits = new int[n];
    for (int i = 0; i < n; i++) {
        digits[i] = num.charAt(i) - '0';
    }

    // Step 3: Memoization map
    Map<String, Boolean> memo = new HashMap<>();

    // Helper DFS function
    java.util.function.Function<Object[], Boolean> dfs = new java.util.function.Function<Object[], Boolean>() {
        @Override
        public Boolean apply(Object[] args) {
            int pos = (int) args[0];
            int[] remCounts = (int[]) args[1];
            boolean tight = (boolean) args[2];

            // Base case: reached end of number
            if (pos == n) {
                // Check if all prime factor requirements are satisfied
                for (int c : remCounts) {
                    if (c > 0) return false;
                }
                return true;
            }

            // Check memoization
            String key = pos + "," +
                        remCounts[0] + "," + remCounts[1] + "," +
                        remCounts[2] + "," + remCounts[3] + "," + tight;
            if (memo.containsKey(key)) {
                return memo.get(key);
            }

            // Determine the range of digits we can try at this position
            int startDigit = tight ? digits[pos] : 1;
            int endDigit = 9;

            // Try each possible digit
            for (int d = startDigit; d <= endDigit; d++) {
                // Calculate new remaining counts after using this digit
                int[] newCounts = new int[4];
                for (int i = 0; i < 4; i++) {
                    newCounts[i] = remCounts[i] - digitFactors[d-1][i];
                }

                // Adjust negative counts to 0 (exceeding requirements is fine)
                int[] adjustedCounts = new int[4];
                for (int i = 0; i < 4; i++) {
                    adjustedCounts[i] = Math.max(0, newCounts[i]);
                }

                // Determine if we're still tight to the original number
                boolean newTight = tight && (d == digits[pos]);

                // Recursively check if we can complete with this digit
                Object[] newArgs = {pos + 1, adjustedCounts, newTight};
                if (apply(newArgs)) {
                    memo.put(key, true);
                    return true;
                }
            }

            memo.put(key, false);
            return false;
        }
    };

    // Step 4: First, check if the original number already works
    int[] remCounts = targetCounts.clone();
    for (int d : digits) {
        for (int i = 0; i < 4; i++) {
            remCounts[i] -= digitFactors[d-1][i];
        }
    }
    boolean originalWorks = true;
    for (int c : remCounts) {
        if (c > 0) {
            originalWorks = false;
            break;
        }
    }
    if (originalWorks) {
        return num;
    }

    // Step 5: If not, try to find the next larger number
    StringBuilder result = new StringBuilder();
    remCounts = targetCounts.clone();
    boolean tight = true;

    for (int pos = 0; pos < n; pos++) {
        int startDigit = tight ? digits[pos] : 1;
        boolean found = false;

        // Try digits from startDigit to 9
        for (int d = startDigit; d <= 9; d++) {
            // Calculate what would remain if we choose this digit
            int[] newCounts = new int[4];
            for (int i = 0; i < 4; i++) {
                newCounts[i] = remCounts[i] - digitFactors[d-1][i];
            }
            int[] adjustedCounts = new int[4];
            for (int i = 0; i < 4; i++) {
                adjustedCounts[i] = Math.max(0, newCounts[i]);
            }

            // Check if we can complete the number with this choice
            boolean newTight = tight && (d == digits[pos]);
            Object[] args = {pos + 1, adjustedCounts, newTight};

            if (dfs.apply(args)) {
                // This digit works, add it to result
                result.append(d);
                remCounts = adjustedCounts;
                tight = newTight;
                found = true;
                break;
            }
        }

        if (!found) {
            // If no digit worked, we need more digits
            break;
        }
    }

    // Step 6: If we found a valid n-digit number, return it
    if (result.length() == n) {
        String candidate = result.toString();
        // Verify the result is valid
        long product = 1;
        for (char ch : candidate.toCharArray()) {
            product *= (ch - '0');
        }
        if (product % t == 0 && !candidate.contains("0")) {
            return candidate;
        }
    }

    // Step 7: If no n-digit number works, construct smallest (n+1)-digit number
    int[] counts = targetCounts.clone();
    List<Integer> resultFactors = new ArrayList<>();

    // Handle factors of 5 and 7 first
    while (counts[2] > 0) {
        resultFactors.add(5);
        counts[2]--;
    }

    while (counts[3] > 0) {
        resultFactors.add(7);
        counts[3]--;
    }

    // Handle factors of 2 and 3
    while (counts[0] >= 3) {
        resultFactors.add(8);
        counts[0] -= 3;
    }

    while (counts[1] >= 2) {
        resultFactors.add(9);
        counts[1] -= 2;
    }

    while (counts[0] >= 2) {
        resultFactors.add(4);
        counts[0] -= 2;
    }

    while (counts[0] >= 1 && counts[1] >= 1) {
        resultFactors.add(6);
        counts[0]--;
        counts[1]--;
    }

    while (counts[1] >= 1) {
        resultFactors.add(3);
        counts[1]--;
    }

    while (counts[0] >= 1) {
        resultFactors.add(2);
        counts[0]--;
    }

    // Sort to get smallest number
    Collections.sort(resultFactors);

    // Convert to string
    if (!resultFactors.isEmpty()) {
        StringBuilder sb = new StringBuilder();
        for (int digit : resultFactors) {
            sb.append(digit);
        }
        return sb.toString();
    }

    return "-1";
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Factorization of `t`: O(log t) - we divide by primes until we can't
- Precomputing digit factors: O(9 × 4) = O(1)
- DFS with memoization: In the worst case, we explore O(n × 2^p) states where:
  - `n` is the length of the input number
  - `p` is the number of distinct prime factors (at most 4: 2, 3, 5, 7)
  - Each state is defined by (position, remaining counts for each prime, tight flag)
  - The 2^p factor comes from the fact that for each prime, the remaining count can be represented in binary
- Constructing the result: O(n)
- **Overall: O(n × 2^p)** where p ≤ 4, so effectively O(16n) = O(n)

**Space Complexity:**

- Storing digit factors: O(9 × 4) = O(1)
- Memoization cache: O(n × 2^p) states
- Recursion stack: O(n) for DFS depth
- **Overall: O(n × 2^p)** which is O(16n) = O(n)

## Common Mistakes

1. **Not handling large numbers correctly**: Using integers instead of strings/BigInteger for the input `num` can cause overflow. The problem states `num` is a string for a reason - it can be very large.

2. **Forgetting to check if t has prime factors other than 2,3,5,7**: If `t` has prime factors like 11, 13, etc., it's impossible to achieve with digits 1-9 since no digit contains those primes.

3. **Incorrect backtracking logic**: When a digit choice doesn't work, candidates often forget to properly backtrack and try the next larger digit. The tight flag is crucial here - it tracks whether we're still matching the original number.

4. **Not considering the case where we need more digits**: Sometimes no n-digit number ≥ `num` works, so we need to find the smallest (n+1)-digit number. Candidates often miss this edge case.

5. **Inefficient digit packing in the fallback case**: When constructing the smallest (n+1)-digit number, the order matters. We should use larger digits (8, 9) first to consume more factors, then smaller ones, and finally sort to get the smallest number.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Digit DP with constraints**: Similar to problems like "Numbers At Most N Given Digit Set" (LeetCode 902) where we count numbers based on digit constraints.

2. **Prime factorization for constraint satisfaction**: Problems like "Ugly Number II" (LeetCode 264) use prime factorization to generate numbers with specific prime factors.

3. **Constructive number building**: "Smallest Number With Given Digit Product" (the related problem) uses the same digit packing strategy to build the smallest number with a given digit product.

4. **Backtracking with memoization**: Many combinatorial problems use this pattern, especially when we have multiple constraints to satisfy simultaneously.

## Key Takeaways

1. **When dealing with digit products, think in terms of prime factorization**: Each digit 1-9 contributes specific prime factors (2, 3, 5, 7). This transforms the problem from checking products to tracking factor counts.

2. **Digit-by-digit construction with backtracking is powerful**: For problems asking for the "smallest number ≥ X satisfying constraints", building from most significant to least significant digit with backtracking is often the right approach.

3. **The "tight" flag technique**: When constructing numbers that must be ≥ a given number, maintaining a boolean flag that tracks whether we're still exactly matching the prefix of the original number is a common and useful technique in digit DP problems.

Related problems: [Smallest Number With Given Digit Product](/problem/smallest-number-with-given-digit-product)
