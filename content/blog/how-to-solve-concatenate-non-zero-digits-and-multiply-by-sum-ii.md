---
title: "How to Solve Concatenate Non-Zero Digits and Multiply by Sum II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Concatenate Non-Zero Digits and Multiply by Sum II. Medium difficulty, 24.1% acceptance rate. Topics: Math, String, Prefix Sum."
date: "2026-05-23"
category: "dsa-patterns"
tags:
  ["concatenate-non-zero-digits-and-multiply-by-sum-ii", "math", "string", "prefix-sum", "medium"]
---

# How to Solve Concatenate Non-Zero Digits and Multiply by Sum II

This problem asks us to process multiple queries on a digit string. For each query `[l, r]`, we need to extract the substring `s[l..r]`, concatenate all non-zero digits into a new integer, then multiply that integer by the sum of all digits in the substring. The challenge is doing this efficiently for many queries, as a brute force approach would be too slow.

What makes this problem interesting is that it combines string processing with mathematical operations, requiring us to think about how to precompute information to answer queries quickly. The key insight is recognizing that both operations (concatenating non-zero digits and summing digits) can be broken down into prefix computations.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `s = "10203"`
- `queries = [[0, 2], [1, 3]]`

**Query 1: [0, 2]** (substring "102")

1. Extract non-zero digits: "1", "2" → concatenate to form `x = 12`
2. Sum of all digits: 1 + 0 + 2 = 3
3. Result: 12 × 3 = 36

**Query 2: [1, 3]** (substring "020")

1. Extract non-zero digits: "2" → concatenate to form `x = 2`
2. Sum of all digits: 0 + 2 + 0 = 2
3. Result: 2 × 2 = 4

The brute force approach would process each query independently by scanning the substring. For a string of length `n` and `q` queries, this would take O(n × q) time, which is too slow when both `n` and `q` are large (up to 10⁵).

## Brute Force Approach

The most straightforward solution processes each query independently:

1. For each query `[l, r]`, extract the substring
2. Scan through the substring to:
   - Build the concatenated number from non-zero digits
   - Calculate the sum of all digits
3. Multiply the two values and store the result

Here's what the brute force code might look like:

<div class="code-group">

```python
def brute_force(s, queries):
    results = []

    for l, r in queries:
        # Extract substring
        substring = s[l:r+1]

        # Build concatenated number from non-zero digits
        concat_num = 0
        digit_sum = 0

        for ch in substring:
            digit = int(ch)
            digit_sum += digit

            if digit != 0:
                # Append digit to the end of concat_num
                concat_num = concat_num * 10 + digit

        # Multiply and store result
        results.append(concat_num * digit_sum)

    return results
```

```javascript
function bruteForce(s, queries) {
  const results = [];

  for (const [l, r] of queries) {
    // Extract substring
    const substring = s.substring(l, r + 1);

    // Build concatenated number from non-zero digits
    let concatNum = 0;
    let digitSum = 0;

    for (const ch of substring) {
      const digit = parseInt(ch);
      digitSum += digit;

      if (digit !== 0) {
        // Append digit to the end of concatNum
        concatNum = concatNum * 10 + digit;
      }
    }

    // Multiply and store result
    results.push(concatNum * digitSum);
  }

  return results;
}
```

```java
public int[] bruteForce(String s, int[][] queries) {
    int[] results = new int[queries.length];

    for (int i = 0; i < queries.length; i++) {
        int l = queries[i][0];
        int r = queries[i][1];

        // Extract substring
        String substring = s.substring(l, r + 1);

        // Build concatenated number from non-zero digits
        long concatNum = 0;
        int digitSum = 0;

        for (int j = 0; j < substring.length(); j++) {
            int digit = substring.charAt(j) - '0';
            digitSum += digit;

            if (digit != 0) {
                // Append digit to the end of concatNum
                concatNum = concatNum * 10 + digit;
            }
        }

        // Multiply and store result
        results[i] = (int)(concatNum * digitSum);
    }

    return results;
}
```

</div>

**Why this is too slow:**

- Time complexity: O(q × L) where L is the average substring length
- In the worst case, each query could cover the entire string, giving us O(q × n) time
- With n, q ≤ 10⁵, this could mean 10¹⁰ operations, which is far too slow

## Optimized Approach

The key insight is that both operations we need to perform can be expressed as prefix computations:

1. **Digit Sum**: This is straightforward - we can precompute prefix sums where `prefixSum[i]` is the sum of digits from `s[0]` to `s[i-1]`. Then for any query `[l, r]`, the sum is `prefixSum[r+1] - prefixSum[l]`.

2. **Concatenated Non-Zero Digits**: This is trickier but follows a similar pattern. We need to think about how to compute the concatenated number for any range without actually building it digit by digit.

Let's think about the concatenated number mathematically. If we have digits `d₁, d₂, d₃, ...` and we want to concatenate them into a number, it's equivalent to:

```
result = d₁ × 10^(k-1) + d₂ × 10^(k-2) + ... + dₖ × 10^0
```

where `k` is the number of digits.

For non-zero digits in a range, we need:

- The count of non-zero digits in the range (to know the exponent for each digit)
- The value contributed by each non-zero digit

We can precompute two arrays:

- `nonZeroPrefix[i]`: Number of non-zero digits from `s[0]` to `s[i-1]`
- `concatPrefix[i]`: The concatenated number formed by non-zero digits from `s[0]` to `s[i-1]`

Then for a query `[l, r]`:

- Count of non-zero digits in range = `nonZeroPrefix[r+1] - nonZeroPrefix[l]`
- The concatenated number for the range can be computed by extracting the relevant portion from the prefix concatenated numbers

The tricky part is that when we extract a middle segment, the exponents for digits change. If we know:

- Total non-zero digits from start to `r`: `cnt_r`
- Total non-zero digits from start to `l-1`: `cnt_l`
- Concatenated number from start to `r`: `concat_r`
- Concatenated number from start to `l-1`: `concat_l`

Then the concatenated number for `[l, r]` is:

```
(concat_r - concat_l × 10^(cnt_r - cnt_l)) mod MOD
```

This works because `concat_l` represents the prefix, and when we subtract it, we need to shift it to align with the remaining digits.

## Optimal Solution

Here's the complete optimized solution with detailed comments:

<div class="code-group">

```python
def solve(s, queries):
    """
    Optimized solution using prefix sums and prefix concatenated values.
    Time: O(n + q) | Space: O(n)
    """
    MOD = 10**9 + 7
    n = len(s)

    # Step 1: Precompute prefix arrays
    # prefix_sum[i] = sum of digits from s[0] to s[i-1]
    # non_zero_count[i] = count of non-zero digits from s[0] to s[i-1]
    # prefix_concat[i] = concatenated number of non-zero digits from s[0] to s[i-1]
    prefix_sum = [0] * (n + 1)
    non_zero_count = [0] * (n + 1)
    prefix_concat = [0] * (n + 1)

    # Also precompute powers of 10 modulo MOD for efficient computation
    pow10 = [1] * (n + 1)
    for i in range(1, n + 1):
        pow10[i] = (pow10[i-1] * 10) % MOD

    # Build prefix arrays
    for i in range(1, n + 1):
        digit = int(s[i-1])

        # Update prefix sum
        prefix_sum[i] = prefix_sum[i-1] + digit

        # Update non-zero count
        non_zero_count[i] = non_zero_count[i-1]
        if digit != 0:
            non_zero_count[i] += 1

        # Update prefix concatenated value
        prefix_concat[i] = prefix_concat[i-1]
        if digit != 0:
            # Append current digit to the end
            prefix_concat[i] = (prefix_concat[i] * 10 + digit) % MOD

    # Step 2: Process queries
    results = []
    for l, r in queries:
        # Convert to 1-based indexing for prefix arrays
        l1 = l + 1
        r1 = r + 1

        # Calculate digit sum for range [l, r]
        range_sum = prefix_sum[r1] - prefix_sum[l1 - 1]

        # Calculate concatenated number for range [l, r]
        # Count of non-zero digits in the prefix before l
        cnt_before = non_zero_count[l1 - 1]
        # Count of non-zero digits in the entire range up to r
        cnt_total = non_zero_count[r1]
        # Count of non-zero digits in our range
        cnt_range = cnt_total - cnt_before

        if cnt_range == 0:
            # No non-zero digits in range
            concat_val = 0
        else:
            # Get concatenated value up to r
            concat_total = prefix_concat[r1]
            # Get concatenated value before l
            concat_before = prefix_concat[l1 - 1]

            # Remove the prefix part: concat_total - concat_before * 10^(cnt_range)
            # This extracts just the digits in our range
            concat_val = (concat_total - concat_before * pow10[cnt_range]) % MOD
            # Ensure positive result
            concat_val = (concat_val + MOD) % MOD

        # Calculate final result: concatenated value × sum
        result = (concat_val * range_sum) % MOD
        results.append(result)

    return results
```

```javascript
function solve(s, queries) {
  /**
   * Optimized solution using prefix sums and prefix concatenated values.
   * Time: O(n + q) | Space: O(n)
   */
  const MOD = 1000000007n; // Use BigInt for safety with large numbers
  const n = s.length;

  // Step 1: Precompute prefix arrays
  // prefixSum[i] = sum of digits from s[0] to s[i-1]
  // nonZeroCount[i] = count of non-zero digits from s[0] to s[i-1]
  // prefixConcat[i] = concatenated number of non-zero digits from s[0] to s[i-1]
  const prefixSum = new Array(n + 1).fill(0);
  const nonZeroCount = new Array(n + 1).fill(0);
  const prefixConcat = new Array(n + 1).fill(0n);

  // Precompute powers of 10 modulo MOD
  const pow10 = new Array(n + 1).fill(1n);
  for (let i = 1; i <= n; i++) {
    pow10[i] = (pow10[i - 1] * 10n) % MOD;
  }

  // Build prefix arrays
  for (let i = 1; i <= n; i++) {
    const digit = parseInt(s[i - 1]);

    // Update prefix sum
    prefixSum[i] = prefixSum[i - 1] + digit;

    // Update non-zero count
    nonZeroCount[i] = nonZeroCount[i - 1];
    if (digit !== 0) {
      nonZeroCount[i]++;
    }

    // Update prefix concatenated value
    prefixConcat[i] = prefixConcat[i - 1];
    if (digit !== 0) {
      // Append current digit to the end
      prefixConcat[i] = (prefixConcat[i] * 10n + BigInt(digit)) % MOD;
    }
  }

  // Step 2: Process queries
  const results = [];
  for (const [l, r] of queries) {
    // Convert to 1-based indexing for prefix arrays
    const l1 = l + 1;
    const r1 = r + 1;

    // Calculate digit sum for range [l, r]
    const rangeSum = BigInt(prefixSum[r1] - prefixSum[l1 - 1]);

    // Calculate concatenated number for range [l, r]
    // Count of non-zero digits in the prefix before l
    const cntBefore = nonZeroCount[l1 - 1];
    // Count of non-zero digits in the entire range up to r
    const cntTotal = nonZeroCount[r1];
    // Count of non-zero digits in our range
    const cntRange = cntTotal - cntBefore;

    let concatVal;
    if (cntRange === 0) {
      // No non-zero digits in range
      concatVal = 0n;
    } else {
      // Get concatenated value up to r
      const concatTotal = prefixConcat[r1];
      // Get concatenated value before l
      const concatBefore = prefixConcat[l1 - 1];

      // Remove the prefix part: concatTotal - concatBefore * 10^(cntRange)
      // This extracts just the digits in our range
      concatVal = (concatTotal - concatBefore * pow10[cntRange]) % MOD;
      // Ensure positive result
      if (concatVal < 0) concatVal += MOD;
    }

    // Calculate final result: concatenated value × sum
    const result = Number((concatVal * rangeSum) % MOD);
    results.push(result);
  }

  return results;
}
```

```java
public int[] solve(String s, int[][] queries) {
    /**
     * Optimized solution using prefix sums and prefix concatenated values.
     * Time: O(n + q) | Space: O(n)
     */
    final int MOD = 1000000007;
    int n = s.length();

    // Step 1: Precompute prefix arrays
    // prefixSum[i] = sum of digits from s[0] to s[i-1]
    // nonZeroCount[i] = count of non-zero digits from s[0] to s[i-1]
    // prefixConcat[i] = concatenated number of non-zero digits from s[0] to s[i-1]
    int[] prefixSum = new int[n + 1];
    int[] nonZeroCount = new int[n + 1];
    long[] prefixConcat = new long[n + 1];

    // Precompute powers of 10 modulo MOD
    long[] pow10 = new long[n + 1];
    pow10[0] = 1;
    for (int i = 1; i <= n; i++) {
        pow10[i] = (pow10[i-1] * 10) % MOD;
    }

    // Build prefix arrays
    for (int i = 1; i <= n; i++) {
        int digit = s.charAt(i-1) - '0';

        // Update prefix sum
        prefixSum[i] = prefixSum[i-1] + digit;

        // Update non-zero count
        nonZeroCount[i] = nonZeroCount[i-1];
        if (digit != 0) {
            nonZeroCount[i]++;
        }

        // Update prefix concatenated value
        prefixConcat[i] = prefixConcat[i-1];
        if (digit != 0) {
            // Append current digit to the end
            prefixConcat[i] = (prefixConcat[i] * 10 + digit) % MOD;
        }
    }

    // Step 2: Process queries
    int[] results = new int[queries.length];
    for (int i = 0; i < queries.length; i++) {
        int l = queries[i][0];
        int r = queries[i][1];

        // Convert to 1-based indexing for prefix arrays
        int l1 = l + 1;
        int r1 = r + 1;

        // Calculate digit sum for range [l, r]
        int rangeSum = prefixSum[r1] - prefixSum[l1 - 1];

        // Calculate concatenated number for range [l, r]
        // Count of non-zero digits in the prefix before l
        int cntBefore = nonZeroCount[l1 - 1];
        // Count of non-zero digits in the entire range up to r
        int cntTotal = nonZeroCount[r1];
        // Count of non-zero digits in our range
        int cntRange = cntTotal - cntBefore;

        long concatVal;
        if (cntRange == 0) {
            // No non-zero digits in range
            concatVal = 0;
        } else {
            // Get concatenated value up to r
            long concatTotal = prefixConcat[r1];
            // Get concatenated value before l
            long concatBefore = prefixConcat[l1 - 1];

            // Remove the prefix part: concatTotal - concatBefore * 10^(cntRange)
            // This extracts just the digits in our range
            concatVal = (concatTotal - concatBefore * pow10[cntRange]) % MOD;
            // Ensure positive result
            if (concatVal < 0) concatVal += MOD;
        }

        // Calculate final result: concatenated value × sum
        long result = (concatVal * rangeSum) % MOD;
        results[i] = (int)result;
    }

    return results;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + q)**

- **O(n)**: We make a single pass through the string to build our prefix arrays and precompute powers of 10.
- **O(q)**: We process each query in constant time using our precomputed prefix arrays.
- This is optimal since we need to at least read the input and write the output.

**Space Complexity: O(n)**

- We store three prefix arrays of size `n+1`: `prefixSum`, `nonZeroCount`, and `prefixConcat`.
- We also store `pow10` array of size `n+1` for efficient exponent calculations.
- The output array of size `q` is not counted in auxiliary space.

## Common Mistakes

1. **Not handling modulo operations correctly**: When subtracting modulo values, the result can be negative. Always add `MOD` and take modulo again to ensure a positive result: `(x % MOD + MOD) % MOD`.

2. **Off-by-one errors with prefix arrays**: Remember that prefix arrays typically use 1-based indexing where `prefix[i]` represents the prefix up to position `i-1` in the original string. Double-check your indices when converting between 0-based and 1-based indexing.

3. **Integer overflow**: The concatenated number can become very large (up to 10^(10^5) theoretically). Always use modulo arithmetic and appropriate data types (like `long` in Java or `BigInt` in JavaScript).

4. **Forgetting the case when there are no non-zero digits**: When `cntRange = 0`, the concatenated value should be 0, not some default value. Handle this edge case explicitly.

## When You'll See This Pattern

This problem uses **prefix sums with custom aggregation**, a pattern that appears in many range query problems:

1. **Range Sum Query - Immutable (LeetCode 303)**: The simplest form of prefix sums, asking for sum of elements in a range.

2. **Product of Array Except Self (LeetCode 238)**: While not exactly the same, it uses prefix and suffix products to answer queries in O(1) time.

3. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums with hash maps to find subarrays with a target sum.

4. **Count Number of Nice Subarrays (LeetCode 1248)**: Uses prefix sums to count subarrays with a certain number of odd elements.

The key insight in all these problems is that if you can express what you need for a range as the difference between two prefix values, you can answer queries efficiently.

## Key Takeaways

1. **Prefix computations are powerful for range queries**: When you need to answer many queries on different ranges of an array/string, consider if you can precompute prefix values that let you answer each query in O(1) time.

2. **Think mathematically about operations**: The concatenation operation seemed tricky at first, but by expressing it mathematically (as digits multiplied by powers of 10), we could break it down into prefix computations.

3. **Handle edge cases explicitly**: Always consider what happens when there are zero elements in your range, when indices are at boundaries, and when operations might overflow.

4. **Modulo arithmetic requires care**: When working with large numbers and modulo operations, remember that subtraction can yield negative results that need correction.

[Practice this problem on CodeJeet](/problem/concatenate-non-zero-digits-and-multiply-by-sum-ii)
