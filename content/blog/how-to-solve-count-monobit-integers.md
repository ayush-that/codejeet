---
title: "How to Solve Count Monobit Integers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Monobit Integers. Easy difficulty, 66.1% acceptance rate. Topics: Bit Manipulation, Enumeration."
date: "2028-08-05"
category: "dsa-patterns"
tags: ["count-monobit-integers", "bit-manipulation", "enumeration", "easy"]
---

# How to Count Monobit Integers

The problem asks us to count how many integers from 0 to n (inclusive) have binary representations consisting of only one type of bit — either all 0's or all 1's. While this sounds straightforward, the challenge lies in efficiently identifying these special numbers without checking every integer individually, especially when n can be large. The key insight is recognizing that monobit integers follow a predictable pattern.

## Visual Walkthrough

Let's trace through an example with n = 10 to build intuition:

**Step 1: List integers 0-10 in binary:**

- 0: 0 (all bits are 0)
- 1: 1 (all bits are 1)
- 2: 10 (mixed bits)
- 3: 11 (all bits are 1)
- 4: 100 (mixed bits)
- 5: 101 (mixed bits)
- 6: 110 (mixed bits)
- 7: 111 (all bits are 1)
- 8: 1000 (mixed bits)
- 9: 1001 (mixed bits)
- 10: 1010 (mixed bits)

**Step 2: Identify monobit integers:**

- 0 (binary: 0) ✓
- 1 (binary: 1) ✓
- 3 (binary: 11) ✓
- 7 (binary: 111) ✓

**Step 3: Notice the pattern:**
Monobit integers are either:

1. 0 (special case)
2. Numbers of the form (1 << k) - 1, where k ≥ 1
   - k=1: (1 << 1) - 1 = 2 - 1 = 1 (binary: 1)
   - k=2: (1 << 2) - 1 = 4 - 1 = 3 (binary: 11)
   - k=3: (1 << 3) - 1 = 8 - 1 = 7 (binary: 111)
   - k=4: (1 << 4) - 1 = 16 - 1 = 15 (binary: 1111) — but 15 > 10, so we stop

So for n = 10, we have 4 monobit integers: {0, 1, 3, 7}.

## Brute Force Approach

A naive solution would check every integer from 0 to n:

1. Convert each number to binary string
2. Check if all characters are '0' or all characters are '1'
3. Count matches

<div class="code-group">

```python
# Time: O(n * log n) | Space: O(log n)
def countMonobitBrute(n):
    count = 0
    for num in range(n + 1):
        binary = bin(num)[2:]  # Convert to binary string, remove '0b' prefix
        # Check if all bits are the same
        if binary.count('0') == len(binary) or binary.count('1') == len(binary):
            count += 1
    return count
```

```javascript
// Time: O(n * log n) | Space: O(log n)
function countMonobitBrute(n) {
  let count = 0;
  for (let num = 0; num <= n; num++) {
    const binary = num.toString(2); // Convert to binary string
    // Check if all bits are the same
    const allZeros = !binary.includes("1");
    const allOnes = !binary.includes("0");
    if (allZeros || allOnes) {
      count++;
    }
  }
  return count;
}
```

```java
// Time: O(n * log n) | Space: O(log n)
public int countMonobitBrute(int n) {
    int count = 0;
    for (int num = 0; num <= n; num++) {
        String binary = Integer.toBinaryString(num);
        // Check if all bits are the same
        boolean allZeros = binary.chars().allMatch(c -> c == '0');
        boolean allOnes = binary.chars().allMatch(c -> c == '1');
        if (allZeros || allOnes) {
            count++;
        }
    }
    return count;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(n log n) because for each of n numbers, we process its binary representation of length O(log n)
- For n up to 10^9, this would be far too slow (billions of operations)
- We're doing unnecessary work by checking numbers we know can't be monobit

## Optimal Solution

The key insight: Monobit integers are exactly 0 and numbers of the form (1 << k) - 1 where k ≥ 1. These are numbers with all bits set to 1, and their binary length is k bits. The number 0 is the only monobit number with all bits 0.

**Algorithm:**

1. Start count at 1 (for the number 0)
2. For k = 1, 2, 3, ...:
   - Generate candidate = (1 << k) - 1
   - If candidate ≤ n, increment count
   - Otherwise, break (all larger candidates will also be > n)
3. Return count

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def countMonobit(n):
    # Start with count = 1 for the number 0 (binary: 0)
    count = 1

    # Initialize k = 1 for numbers of the form (1 << k) - 1
    k = 1

    while True:
        # Generate candidate: binary number with k bits all set to 1
        # (1 << k) creates a 1 followed by k zeros (e.g., 1 << 3 = 1000 = 8)
        # Subtracting 1 gives k ones (e.g., 8 - 1 = 7 = 111)
        candidate = (1 << k) - 1

        # If candidate exceeds n, we've found all monobit numbers ≤ n
        if candidate > n:
            break

        # Valid monobit number found, increment count
        count += 1

        # Move to next k (next longer sequence of 1's)
        k += 1

    return count
```

```javascript
// Time: O(log n) | Space: O(1)
function countMonobit(n) {
  // Start with count = 1 for the number 0 (binary: 0)
  let count = 1;

  // Initialize k = 1 for numbers of the form (1 << k) - 1
  let k = 1;

  while (true) {
    // Generate candidate: binary number with k bits all set to 1
    // (1 << k) creates a 1 followed by k zeros (e.g., 1 << 3 = 8 = 1000)
    // Subtracting 1 gives k ones (e.g., 8 - 1 = 7 = 111)
    const candidate = (1 << k) - 1;

    // If candidate exceeds n, we've found all monobit numbers ≤ n
    if (candidate > n) {
      break;
    }

    // Valid monobit number found, increment count
    count++;

    // Move to next k (next longer sequence of 1's)
    k++;
  }

  return count;
}
```

```java
// Time: O(log n) | Space: O(1)
public int countMonobit(int n) {
    // Start with count = 1 for the number 0 (binary: 0)
    int count = 1;

    // Initialize k = 1 for numbers of the form (1 << k) - 1
    int k = 1;

    while (true) {
        // Generate candidate: binary number with k bits all set to 1
        // (1 << k) creates a 1 followed by k zeros (e.g., 1 << 3 = 8 = 1000)
        // Subtracting 1 gives k ones (e.g., 8 - 1 = 7 = 111)
        int candidate = (1 << k) - 1;

        // If candidate exceeds n, we've found all monobit numbers ≤ n
        if (candidate > n) {
            break;
        }

        // Valid monobit number found, increment count
        count++;

        // Move to next k (next longer sequence of 1's)
        k++;
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- We iterate k from 1 upward until (1 << k) - 1 > n
- This happens when 2^k - 1 > n, or approximately when k > log₂(n+1)
- So we make O(log n) iterations
- Each iteration does constant work (bit shift, subtraction, comparison)

**Space Complexity: O(1)**

- We only use a few integer variables (count, k, candidate)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to include 0**: The number 0 (binary: 0) is a monobit integer but doesn't fit the (1 << k) - 1 pattern. Many candidates start count at 0 and miss this case.

2. **Incorrect loop condition**: Using `candidate < n` instead of `candidate ≤ n` will exclude n itself if n happens to be a monobit integer. Remember the range is inclusive.

3. **Integer overflow with large k**: When n is very large (close to 2^31 - 1), (1 << k) might overflow if k becomes too large. In languages with fixed-width integers, this could cause infinite loops or incorrect results. Our solution avoids this by breaking when candidate > n.

4. **Checking all numbers up to n**: The brute force approach seems tempting but fails on large inputs. Recognizing the mathematical pattern is key to an efficient solution.

## When You'll See This Pattern

This problem teaches pattern recognition with binary numbers and powers of two. Similar patterns appear in:

1. **Counting numbers with specific bit patterns** (LeetCode 338 - Counting Bits): While not identical, both require understanding how numbers relate to powers of two and their binary representations.

2. **Finding complement of numbers** (LeetCode 476 - Number Complement): Understanding bit manipulation and how numbers relate to (1 << k) - 1 is crucial for finding bitwise complements.

3. **Checking if a number is a power of two** (LeetCode 231 - Power of Two): Both problems involve recognizing special patterns in binary representation and using bit manipulation to detect them efficiently.

The core technique is recognizing that certain properties in binary representation correspond to mathematical formulas involving powers of two, allowing O(log n) solutions instead of O(n).

## Key Takeaways

1. **Look for mathematical patterns in binary representations**: Many bit manipulation problems have efficient solutions when you recognize that binary patterns often correspond to formulas involving powers of two.

2. **Special cases matter**: Always check edge cases like 0, 1, and maximum values. In this problem, 0 is a special case that doesn't fit the main pattern.

3. **Think in terms of bit lengths**: When working with binary numbers, consider the number of bits (k) rather than the numeric value. The formula (1 << k) - 1 gives you the largest number with k bits (all 1's).

[Practice this problem on CodeJeet](/problem/count-monobit-integers)
