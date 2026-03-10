---
title: "How to Solve Sum of Largest Prime Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Largest Prime Substrings. Medium difficulty, 37.8% acceptance rate. Topics: Hash Table, Math, String, Sorting, Number Theory."
date: "2029-08-18"
category: "dsa-patterns"
tags: ["sum-of-largest-prime-substrings", "hash-table", "math", "string", "medium"]
---

# How to Solve Sum of Largest Prime Substrings

This problem asks us to find the sum of the three largest unique prime numbers that can be formed from any substring of a given string `s`. The challenge lies in efficiently generating all possible substrings, converting them to numbers, checking primality, and tracking the top three unique primes. What makes this interesting is the combination of string manipulation, number theory, and optimization for performance.

## Visual Walkthrough

Let's trace through an example: `s = "1234"`

**Step 1: Generate all substrings**

- Length 1: "1", "2", "3", "4"
- Length 2: "12", "23", "34"
- Length 3: "123", "234"
- Length 4: "1234"

**Step 2: Convert to numbers and check primality**

- "1" → 1 (not prime)
- "2" → 2 (prime)
- "3" → 3 (prime)
- "4" → 4 (not prime)
- "12" → 12 (not prime)
- "23" → 23 (prime)
- "34" → 34 (not prime)
- "123" → 123 (not prime, divisible by 3)
- "234" → 234 (not prime)
- "1234" → 1234 (not prime)

**Step 3: Collect unique primes**
We get: {2, 3, 23}

**Step 4: Take top 3 largest**
We only have 3 primes: 23, 3, 2

**Step 5: Sum them**
23 + 3 + 2 = 28

So for input "1234", the answer is 28.

## Brute Force Approach

A naive solution would:

1. Generate all possible substrings (O(n²) substrings)
2. Convert each substring to a number (O(n) per conversion)
3. Check if each number is prime (O(√m) where m is the number value)
4. Store unique primes in a set
5. Sort the primes and sum the top 3

The main issue is performance. For a string of length n:

- Number of substrings: n(n+1)/2 = O(n²)
- Each substring conversion: O(n) in worst case
- Prime checking: O(√m) where m can be up to 10^n (exponential in n)

This gives us O(n³ × √(10^n)) which is clearly infeasible for even moderately sized strings.

## Optimized Approach

The key insights for optimization:

1. **Substring generation optimization**: We can generate numbers directly without creating string substrings. For each starting position, we can build numbers incrementally by adding digits.

2. **Early termination for large numbers**: Since we only care about the top 3 primes, we can skip checking numbers that are too small to matter.

3. **Efficient prime checking**: Use a deterministic Miller-Rabin test or simple trial division up to √n, but with optimizations:
   - Skip even numbers after checking 2
   - Check divisibility only up to √n
   - Use 6k±1 optimization

4. **Deduplication and tracking**: Use a set to store primes, then convert to a sorted list to get top 3.

The most important optimization is building numbers incrementally. Instead of generating all substrings as strings and then converting to numbers, we can:

- For each starting index i, initialize num = 0
- For each ending index j from i to n-1: num = num × 10 + int(s[j])
- This builds the number digit by digit in O(1) per step

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n^2 * sqrt(m)) where n = len(s), m = max number value
# Space: O(k) where k = number of unique primes found
def sumOfLargestPrimeSubstrings(s: str) -> int:
    def is_prime(num: int) -> bool:
        """Check if a number is prime using optimized trial division."""
        if num < 2:
            return False
        if num == 2 or num == 3:
            return True
        if num % 2 == 0 or num % 3 == 0:
            return False

        # Check divisibility by numbers of form 6k±1 up to sqrt(num)
        i = 5
        while i * i <= num:
            if num % i == 0 or num % (i + 2) == 0:
                return False
            i += 6
        return True

    primes = set()  # Store unique primes
    n = len(s)

    # Generate all substrings by building numbers incrementally
    for i in range(n):
        num = 0
        for j in range(i, n):
            # Build number digit by digit: previous_num * 10 + current_digit
            num = num * 10 + int(s[j])

            # Check if this number is prime
            if is_prime(num):
                primes.add(num)

    # Convert set to sorted list in descending order
    sorted_primes = sorted(primes, reverse=True)

    # Sum top 3 or all available primes
    return sum(sorted_primes[:3])
```

```javascript
// Time: O(n^2 * sqrt(m)) where n = s.length, m = max number value
// Space: O(k) where k = number of unique primes found
function sumOfLargestPrimeSubstrings(s) {
  // Helper function to check if a number is prime
  function isPrime(num) {
    if (num < 2) return false;
    if (num === 2 || num === 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    // Check divisibility by numbers of form 6k±1 up to sqrt(num)
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) {
        return false;
      }
    }
    return true;
  }

  const primes = new Set(); // Store unique primes
  const n = s.length;

  // Generate all substrings by building numbers incrementally
  for (let i = 0; i < n; i++) {
    let num = 0;
    for (let j = i; j < n; j++) {
      // Build number digit by digit: previous_num * 10 + current_digit
      num = num * 10 + parseInt(s[j]);

      // Check if this number is prime
      if (isPrime(num)) {
        primes.add(num);
      }
    }
  }

  // Convert set to array and sort in descending order
  const sortedPrimes = Array.from(primes).sort((a, b) => b - a);

  // Sum top 3 or all available primes
  let sum = 0;
  const count = Math.min(3, sortedPrimes.length);
  for (let i = 0; i < count; i++) {
    sum += sortedPrimes[i];
  }
  return sum;
}
```

```java
// Time: O(n^2 * sqrt(m)) where n = s.length(), m = max number value
// Space: O(k) where k = number of unique primes found
import java.util.*;

public class Solution {
    public int sumOfLargestPrimeSubstrings(String s) {
        // Helper function to check if a number is prime
        private boolean isPrime(int num) {
            if (num < 2) return false;
            if (num == 2 || num == 3) return true;
            if (num % 2 == 0 || num % 3 == 0) return false;

            // Check divisibility by numbers of form 6k±1 up to sqrt(num)
            for (int i = 5; i * i <= num; i += 6) {
                if (num % i == 0 || num % (i + 2) == 0) {
                    return false;
                }
            }
            return true;
        }

        Set<Integer> primes = new HashSet<>();  // Store unique primes
        int n = s.length();

        // Generate all substrings by building numbers incrementally
        for (int i = 0; i < n; i++) {
            long num = 0;  // Use long to prevent overflow for very long substrings
            for (int j = i; j < n; j++) {
                // Build number digit by digit: previous_num * 10 + current_digit
                num = num * 10 + (s.charAt(j) - '0');

                // Check for overflow and convert to int for prime checking
                if (num > Integer.MAX_VALUE) {
                    break;  // Number too large to be prime (would be composite anyway)
                }

                int currentNum = (int) num;
                // Check if this number is prime
                if (isPrime(currentNum)) {
                    primes.add(currentNum);
                }
            }
        }

        // Convert set to list and sort in descending order
        List<Integer> primeList = new ArrayList<>(primes);
        Collections.sort(primeList, Collections.reverseOrder());

        // Sum top 3 or all available primes
        int sum = 0;
        int count = Math.min(3, primeList.size());
        for (int i = 0; i < count; i++) {
            sum += primeList.get(i);
        }
        return sum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n² × √m)

- n² comes from generating all substrings (n starting positions × average n/2 ending positions)
- √m comes from prime checking, where m is the maximum number value (up to 10^n)
- In practice, the √m factor is manageable because very long numbers quickly become too large to be prime

**Space Complexity**: O(k)

- k is the number of unique primes found
- We store primes in a set, and then in a sorted list
- In worst case, if all substrings produce unique primes, this could be O(n²), but in practice it's much smaller

## Common Mistakes

1. **Not handling large numbers correctly**: When building numbers incrementally, they can quickly exceed integer limits. Always check for overflow, especially in Java where ints have fixed size.

2. **Forgetting to deduplicate primes**: The same prime number can be formed from different substrings (e.g., "2" appears in multiple places). Use a Set to ensure uniqueness.

3. **Inefficient prime checking**: Checking divisibility up to n instead of √n is O(n) vs O(√n). The 6k±1 optimization provides another 3x speedup.

4. **Not handling the "fewer than 3 primes" case**: When there are 0, 1, or 2 primes, you need to sum all available ones, not just try to access 3 elements.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Substring generation with incremental computation**: Similar to problems like "Maximum Subarray" (Kadane's algorithm) where you build results incrementally. Also seen in "Subarray Sum Equals K" where prefix sums are built incrementally.

2. **Top K elements tracking**: The "top 3 unique primes" aspect is similar to "Kth Largest Element in an Array" or "Top K Frequent Elements". You could optimize further by maintaining a min-heap of size 3 instead of sorting all primes.

3. **Number generation from strings**: Problems like "String to Integer (atoi)" or "Decode Ways" also involve converting string segments to numbers with careful boundary checking.

## Key Takeaways

1. **Incremental computation beats recreation**: When generating sequences (like numbers from substrings), building them incrementally is almost always more efficient than creating fresh substrings.

2. **Mathematical optimizations matter**: In number theory problems, small optimizations like checking only up to √n or using the 6k±1 pattern can make the difference between passing and timing out.

3. **Understand the problem constraints**: The "top 3 unique" requirement suggests we don't need to store all results—we could use a heap to track only the largest 3 as we find them, reducing memory usage.

[Practice this problem on CodeJeet](/problem/sum-of-largest-prime-substrings)
