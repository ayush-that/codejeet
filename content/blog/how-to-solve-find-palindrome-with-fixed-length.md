---
title: "How to Solve Find Palindrome With Fixed Length — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Palindrome With Fixed Length. Medium difficulty, 37.9% acceptance rate. Topics: Array, Math."
date: "2029-06-21"
category: "dsa-patterns"
tags: ["find-palindrome-with-fixed-length", "array", "math", "medium"]
---

# How to Solve Find Palindrome With Fixed Length

This problem asks us to find the k-th smallest palindrome of a specific length. Given an array of queries `queries` and a fixed length `intLength`, we need to return the corresponding palindrome for each query, or `-1` if it doesn't exist. The challenge lies in efficiently generating palindromes without brute-force checking every number of that length, which would be far too slow for large queries.

What makes this problem interesting is that it combines mathematical pattern recognition with careful indexing. We can't actually generate all palindromes and sort them - we need to find a direct mapping from query index to palindrome value.

## Visual Walkthrough

Let's walk through an example with `intLength = 3` and `queries = [1, 2, 3, 4, 90]`.

For length 3 palindromes, they look like: `101, 111, 121, 131, ..., 191, 202, 212, ..., 999`. Notice the pattern: the first half determines the entire palindrome. For odd-length palindromes, the middle digit is included in the first half.

**Step 1: Understanding the count**

- For length 3, the first half has 2 digits (first digit and middle digit)
- First digit can be 1-9 (9 possibilities)
- Middle digit can be 0-9 (10 possibilities)
- Total palindromes: 9 × 10 = 90

**Step 2: Mapping queries to palindromes**

- Query 1: Smallest palindrome → first half = 10 (digit 1, middle 0) → palindrome = 101
- Query 2: First half = 11 → palindrome = 111
- Query 3: First half = 12 → palindrome = 121
- Query 4: First half = 13 → palindrome = 131
- Query 90: First half = 99 → palindrome = 999

**Step 3: What about query 91?**

- There are only 90 palindromes of length 3, so query 91 → -1

The key insight: we can compute the palindrome directly from the query index by:

1. Finding the total number of palindromes of that length
2. Converting the query to a "first half" number
3. Mirroring that half to create the full palindrome

## Brute Force Approach

A naive approach would be to generate all palindromes of the given length, sort them, and then answer queries by direct lookup. Here's what that might look like:

<div class="code-group">

```python
def kthPalindrome_brute(queries, intLength):
    # Generate all palindromes of length intLength
    palindromes = []

    # Determine the range of numbers to check
    start = 10 ** (intLength - 1)  # smallest intLength-digit number
    end = 10 ** intLength - 1      # largest intLength-digit number

    for num in range(start, end + 1):
        if str(num) == str(num)[::-1]:  # check if palindrome
            palindromes.append(num)

    # Answer queries
    result = []
    for q in queries:
        if 1 <= q <= len(palindromes):
            result.append(palindromes[q - 1])  # 1-indexed queries
        else:
            result.append(-1)

    return result
```

```javascript
function kthPalindromeBrute(queries, intLength) {
  // Generate all palindromes of length intLength
  const palindromes = [];

  // Determine the range of numbers to check
  const start = 10 ** (intLength - 1); // smallest intLength-digit number
  const end = 10 ** intLength - 1; // largest intLength-digit number

  for (let num = start; num <= end; num++) {
    if (num.toString() === num.toString().split("").reverse().join("")) {
      palindromes.push(num);
    }
  }

  // Answer queries
  const result = [];
  for (const q of queries) {
    if (q >= 1 && q <= palindromes.length) {
      result.push(palindromes[q - 1]); // 1-indexed queries
    } else {
      result.push(-1);
    }
  }

  return result;
}
```

```java
public long[] kthPalindromeBrute(int[] queries, int intLength) {
    // Generate all palindromes of length intLength
    List<Long> palindromes = new ArrayList<>();

    // Determine the range of numbers to check
    long start = (long) Math.pow(10, intLength - 1);  // smallest intLength-digit number
    long end = (long) Math.pow(10, intLength) - 1;    // largest intLength-digit number

    for (long num = start; num <= end; num++) {
        String str = Long.toString(num);
        if (str.equals(new StringBuilder(str).reverse().toString())) {
            palindromes.add(num);
        }
    }

    // Answer queries
    long[] result = new long[queries.length];
    for (int i = 0; i < queries.length; i++) {
        int q = queries[i];
        if (q >= 1 && q <= palindromes.size()) {
            result[i] = palindromes.get(q - 1);  // 1-indexed queries
        } else {
            result[i] = -1;
        }
    }

    return result;
}
```

</div>

**Why this fails:**

- For `intLength = 15`, we'd need to check 9×10^14 numbers (900 trillion!)
- Even for moderate lengths like 10, we're checking billions of numbers
- The time complexity is O(10^intLength), which is exponential and completely impractical

## Optimized Approach

The key insight is that we don't need to generate all palindromes. We can construct any palindrome directly from its "first half":

1. **For odd-length palindromes** (intLength is odd):
   - First half length = (intLength + 1) // 2
   - Example: length 5 → first half length 3
   - Palindrome = first half + reverse(first half without last digit)
   - Example: first half "123" → palindrome "12321"

2. **For even-length palindromes** (intLength is even):
   - First half length = intLength // 2
   - Example: length 4 → first half length 2
   - Palindrome = first half + reverse(first half)
   - Example: first half "12" → palindrome "1221"

3. **Counting palindromes**:
   - First digit of first half: 1-9 (9 choices)
   - Remaining digits: 0-9 (10 choices each)
   - Total = 9 × 10^(first_half_length - 1)

4. **From query to first half**:
   - Query is 1-indexed
   - First half = 10^(first_half_length - 1) + (query - 1)
   - Example: query 1 → first half = 10^(n-1) + 0 = smallest possible first half

5. **Check bounds**:
   - If query > total possible palindromes, return -1

This approach gives us O(1) time per query after the initial calculations!

## Optimal Solution

<div class="code-group">

```python
def kthPalindrome(queries, intLength):
    """
    Find the k-th smallest palindrome of fixed length.

    Key insight: A palindrome is determined by its first half.
    For length L:
    - If L is odd: first half has (L+1)//2 digits, palindrome = first half + reverse(first half without last digit)
    - If L is even: first half has L//2 digits, palindrome = first half + reverse(first half)

    Time: O(n) where n = len(queries)
    Space: O(n) for the result array
    """
    result = []

    # Calculate the length of the first half
    half_len = (intLength + 1) // 2

    # Total number of possible palindromes of this length
    # First digit: 1-9 (9 choices), remaining digits: 0-9 (10 choices each)
    total_palindromes = 9 * (10 ** (half_len - 1))

    # Smallest possible first half (e.g., for half_len=2, smallest is 10)
    smallest_half = 10 ** (half_len - 1)

    for q in queries:
        # Check if query is within valid range
        if q > total_palindromes:
            result.append(-1)
            continue

        # Convert 1-indexed query to 0-indexed offset
        # query 1 -> offset 0, query 2 -> offset 1, etc.
        offset = q - 1

        # Calculate the first half number
        # Start from smallest_half and add the offset
        first_half = smallest_half + offset

        # Convert first half to string for manipulation
        first_half_str = str(first_half)

        # Construct the full palindrome
        if intLength % 2 == 0:
            # Even length: mirror the entire first half
            # Example: first half "12" -> palindrome "1221"
            palindrome_str = first_half_str + first_half_str[::-1]
        else:
            # Odd length: mirror first half without the last digit
            # Example: first half "123" -> palindrome "12321"
            palindrome_str = first_half_str + first_half_str[-2::-1]

        # Convert back to integer and add to result
        result.append(int(palindrome_str))

    return result
```

```javascript
function kthPalindrome(queries, intLength) {
  /**
   * Find the k-th smallest palindrome of fixed length.
   *
   * Key insight: A palindrome is determined by its first half.
   * For length L:
   * - If L is odd: first half has (L+1)//2 digits, palindrome = first half + reverse(first half without last digit)
   * - If L is even: first half has L//2 digits, palindrome = first half + reverse(first half)
   *
   * Time: O(n) where n = queries.length
   * Space: O(n) for the result array
   */
  const result = [];

  // Calculate the length of the first half
  const halfLen = Math.floor((intLength + 1) / 2);

  // Total number of possible palindromes of this length
  // First digit: 1-9 (9 choices), remaining digits: 0-9 (10 choices each)
  const totalPalindromes = 9 * 10 ** (halfLen - 1);

  // Smallest possible first half (e.g., for halfLen=2, smallest is 10)
  const smallestHalf = 10 ** (halfLen - 1);

  for (const q of queries) {
    // Check if query is within valid range
    if (q > totalPalindromes) {
      result.push(-1);
      continue;
    }

    // Convert 1-indexed query to 0-indexed offset
    // query 1 -> offset 0, query 2 -> offset 1, etc.
    const offset = q - 1;

    // Calculate the first half number
    // Start from smallestHalf and add the offset
    const firstHalf = smallestHalf + offset;

    // Convert first half to string for manipulation
    const firstHalfStr = firstHalf.toString();

    // Construct the full palindrome
    let palindromeStr;
    if (intLength % 2 === 0) {
      // Even length: mirror the entire first half
      // Example: first half "12" -> palindrome "1221"
      palindromeStr = firstHalfStr + firstHalfStr.split("").reverse().join("");
    } else {
      // Odd length: mirror first half without the last digit
      // Example: first half "123" -> palindrome "12321"
      palindromeStr = firstHalfStr + firstHalfStr.slice(0, -1).split("").reverse().join("");
    }

    // Convert back to integer and add to result
    result.push(parseInt(palindromeStr, 10));
  }

  return result;
}
```

```java
public long[] kthPalindrome(int[] queries, int intLength) {
    /**
     * Find the k-th smallest palindrome of fixed length.
     *
     * Key insight: A palindrome is determined by its first half.
     * For length L:
     * - If L is odd: first half has (L+1)//2 digits, palindrome = first half + reverse(first half without last digit)
     * - If L is even: first half has L//2 digits, palindrome = first half + reverse(first half)
     *
     * Time: O(n) where n = queries.length
     * Space: O(n) for the result array
     */
    long[] result = new long[queries.length];

    // Calculate the length of the first half
    int halfLen = (intLength + 1) / 2;

    // Total number of possible palindromes of this length
    // First digit: 1-9 (9 choices), remaining digits: 0-9 (10 choices each)
    long totalPalindromes = 9L * (long) Math.pow(10, halfLen - 1);

    // Smallest possible first half (e.g., for halfLen=2, smallest is 10)
    long smallestHalf = (long) Math.pow(10, halfLen - 1);

    for (int i = 0; i < queries.length; i++) {
        int q = queries[i];

        // Check if query is within valid range
        if (q > totalPalindromes) {
            result[i] = -1;
            continue;
        }

        // Convert 1-indexed query to 0-indexed offset
        // query 1 -> offset 0, query 2 -> offset 1, etc.
        long offset = q - 1;

        // Calculate the first half number
        // Start from smallestHalf and add the offset
        long firstHalf = smallestHalf + offset;

        // Convert first half to string for manipulation
        String firstHalfStr = Long.toString(firstHalf);

        // Construct the full palindrome
        StringBuilder palindromeBuilder = new StringBuilder(firstHalfStr);

        if (intLength % 2 == 0) {
            // Even length: mirror the entire first half
            // Example: first half "12" -> palindrome "1221"
            palindromeBuilder.append(new StringBuilder(firstHalfStr).reverse());
        } else {
            // Odd length: mirror first half without the last digit
            // Example: first half "123" -> palindrome "12321"
            palindromeBuilder.append(new StringBuilder(firstHalfStr.substring(0, firstHalfStr.length() - 1)).reverse());
        }

        // Convert back to long and add to result
        result[i] = Long.parseLong(palindromeBuilder.toString());
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Where n is the length of the queries array
- For each query, we perform O(1) operations: arithmetic calculations and string manipulations
- The string operations are O(L) where L is intLength, but since intLength is fixed (≤ 15), this is constant time

**Space Complexity: O(n)**

- We store the result array of size n
- Additional O(L) space for string manipulations, but this is constant since L ≤ 15

The key advantage over brute force: instead of exponential time O(10^L), we get linear time O(n)!

## Common Mistakes

1. **Off-by-one errors with query indexing**: Remember queries are 1-indexed, not 0-indexed. When calculating the offset, use `q - 1`, not `q`. Also, check `q > total_palindromes` not `q >= total_palindromes`.

2. **Incorrect first half calculation for odd lengths**: For odd-length palindromes, the first half includes the middle digit. So half_len = (L + 1) // 2, not L // 2. When mirroring, you need to drop the last digit of the first half before reversing.

3. **Forgetting that first digit cannot be zero**: The smallest first half is `10^(half_len - 1)`, not `0`. This ensures the first digit is 1-9, which gives us valid palindromes of exactly intLength digits.

4. **Integer overflow with large lengths**: When intLength = 15, the palindromes can be up to 15 digits long, which exceeds 32-bit integer limits. Use 64-bit integers (long in Java, normal int in Python handles big integers automatically).

## When You'll See This Pattern

This problem uses **mathematical construction based on symmetry**, which appears in several palindrome-related problems:

1. **Palindrome Number (Easy)**: While simpler, it introduces the concept of reversing half of a number to check for palindromes without converting to string.

2. **Find the Closest Palindrome (Hard)**: This builds on the same idea - to find the closest palindrome to a given number, you generate candidates by manipulating the first half and mirroring it.

3. **Lexicographically Smallest Beautiful String (Hard)**: Involves constructing palindromic strings with constraints, requiring similar thinking about how the first half determines the whole.

The core pattern: when dealing with palindromes of fixed structure, work with just one half and use symmetry to construct the whole. This reduces the search space exponentially.

## Key Takeaways

1. **Palindromes are determined by their first half**: For any palindrome, knowing the first half (plus whether the length is odd/even) is enough to reconstruct the entire palindrome. This reduces the problem space dramatically.

2. **Count before constructing**: Always calculate how many valid palindromes exist before trying to answer queries. This lets you immediately return -1 for out-of-bounds queries.

3. **Handle odd and even lengths separately**: The construction logic differs slightly between odd and even lengths. For odd lengths, the middle digit appears only once; for even lengths, everything is mirrored perfectly.

This problem teaches how to leverage mathematical properties (symmetry in palindromes) to avoid brute force enumeration. Recognizing when you can work with a reduced representation of a symmetric object is a valuable skill for optimization problems.

Related problems: [Palindrome Number](/problem/palindrome-number), [Find the Closest Palindrome](/problem/find-the-closest-palindrome), [Lexicographically Smallest Beautiful String](/problem/lexicographically-smallest-beautiful-string)
