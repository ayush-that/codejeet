---
title: "How to Solve Sort Integers by The Number of 1 Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sort Integers by The Number of 1 Bits. Easy difficulty, 82.2% acceptance rate. Topics: Array, Bit Manipulation, Sorting, Counting."
date: "2027-08-16"
category: "dsa-patterns"
tags: ["sort-integers-by-the-number-of-1-bits", "array", "bit-manipulation", "sorting", "easy"]
---

# How to Solve Sort Integers by The Number of 1 Bits

You need to sort an array of integers based on two criteria: first by the number of 1-bits in their binary representation, and then by their actual numeric value if they have the same number of 1-bits. While the problem is labeled "Easy," it combines bit manipulation with custom sorting logic, making it an excellent test of fundamental programming skills. The tricky part is efficiently computing the 1-bit count while maintaining clean, readable code.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]`

**Step 1: Compute 1-bit counts**

- 0 (binary "0") → 0 ones
- 1 (binary "1") → 1 one
- 2 (binary "10") → 1 one
- 3 (binary "11") → 2 ones
- 4 (binary "100") → 1 one
- 5 (binary "101") → 2 ones
- 6 (binary "110") → 2 ones
- 7 (binary "111") → 3 ones
- 8 (binary "1000") → 1 one

**Step 2: Group by 1-bit count**

- 0 ones: [0]
- 1 one: [1, 2, 4, 8]
- 2 ones: [3, 5, 6]
- 3 ones: [7]

**Step 3: Sort within each group**

- 0 ones: [0] (already sorted)
- 1 one: [1, 2, 4, 8] (already in ascending order)
- 2 ones: [3, 5, 6] (already in ascending order)
- 3 ones: [7] (already sorted)

**Step 4: Combine groups in order of 1-bit count**
Final result: [0, 1, 2, 4, 8, 3, 5, 6, 7]

Notice how numbers with the same 1-bit count maintain their relative order when they're already sorted? This observation is key to understanding why a stable sort works perfectly here.

## Brute Force Approach

A naive approach would be to compute the 1-bit count for each number by converting it to a binary string and counting the '1' characters. Then we could implement a custom comparison function that first compares the 1-bit counts, then the actual numbers if counts are equal.

While this approach is conceptually simple, it's inefficient because:

1. Converting integers to binary strings takes O(log n) time per number (where n is the value, not the array length)
2. String operations are slower than bitwise operations
3. The comparison function would recompute the 1-bit count multiple times during sorting

However, in practice for this problem, even the "brute force" approach using string conversion would likely pass given the constraints (numbers up to 10^4, array length up to 500). The real issue is that it's not the most elegant or efficient solution, and interviewers expect you to recognize that bit manipulation is cleaner and faster.

## Optimal Solution

The optimal approach uses bit manipulation to efficiently compute the number of 1-bits (also called the "popcount" or "Hamming weight") and then leverages the sorting function's ability to sort by multiple criteria. Most languages allow you to specify a custom sort key that returns a tuple - the sort will compare the first elements, then the second if the first are equal, and so on.

Here's the key insight: we need to sort by (popcount, value). We can compute popcount using bitwise operations:

- `n & (n-1)` clears the lowest set bit (1-bit)
- Repeatedly clearing bits until n becomes 0 gives us the count
- Alternatively, we can use built-in functions like `Integer.bitCount()` in Java

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for popcount computation
# Space: O(n) for storing the transformed array (or O(1) if sorting in-place)
def sortByBits(arr):
    # Step 1: Define a helper function to count 1-bits
    def count_ones(num):
        count = 0
        # While there are still 1-bits in the number
        while num:
            # num & (num-1) clears the lowest set bit
            # Example: num = 6 (110), num-1 = 5 (101)
            # 110 & 101 = 100 (cleared the lowest 1-bit)
            num &= num - 1
            count += 1
        return count

    # Step 2: Sort using a custom key
    # The key is a tuple: (number_of_1_bits, actual_value)
    # Python's sort is stable and will sort by first element, then second
    arr.sort(key=lambda x: (count_ones(x), x))

    return arr
```

```javascript
// Time: O(n log n) for sorting, O(n) for popcount computation
// Space: O(n) for storing the transformed array
function sortByBits(arr) {
  // Step 1: Define a helper function to count 1-bits
  const countOnes = (num) => {
    let count = 0;
    // While there are still 1-bits in the number
    while (num) {
      // num & (num-1) clears the lowest set bit
      // Example: num = 6 (110), num-1 = 5 (101)
      // 110 & 101 = 100 (cleared the lowest 1-bit)
      num &= num - 1;
      count++;
    }
    return count;
  };

  // Step 2: Sort using a custom comparator
  // Compare by number of 1-bits first, then by actual value
  arr.sort((a, b) => {
    const countA = countOnes(a);
    const countB = countOnes(b);

    // If 1-bit counts are different, sort by count
    if (countA !== countB) {
      return countA - countB;
    }
    // Otherwise, sort by actual value
    return a - b;
  });

  return arr;
}
```

```java
// Time: O(n log n) for sorting, O(n) for popcount computation
// Space: O(n) for storing the transformed array (or O(1) if sorting in-place)
public int[] sortByBits(int[] arr) {
    // Step 1: Convert to Integer array for easier sorting with comparator
    Integer[] integerArr = new Integer[arr.length];
    for (int i = 0; i < arr.length; i++) {
        integerArr[i] = arr[i];
    }

    // Step 2: Sort using a custom comparator
    Arrays.sort(integerArr, new Comparator<Integer>() {
        @Override
        public int compare(Integer a, Integer b) {
            // Compare by number of 1-bits first
            int bitCountA = Integer.bitCount(a);
            int bitCountB = Integer.bitCount(b);

            if (bitCountA != bitCountB) {
                return bitCountA - bitCountB;
            }
            // If 1-bit counts are equal, compare by actual value
            return a - b;
        }
    });

    // Step 3: Convert back to int array
    for (int i = 0; i < arr.length; i++) {
        arr[i] = integerArr[i];
    }

    return arr;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Computing the 1-bit count for each element takes O(k) where k is the number of bits (at most 32 for 32-bit integers, which is constant)
- We do this for all n elements: O(n × k) = O(n) since k is constant
- Sorting takes O(n log n) comparisons
- Each comparison may compute 1-bit counts (or use precomputed values)
- Overall: O(n log n) dominated by the sorting step

**Space Complexity: O(n) or O(1)**

- If we sort in-place (like Python's `list.sort()`), we only need O(1) extra space
- If we create a new sorted array or need to convert types (like in Java), we use O(n) space
- The 1-bit count computation uses O(1) extra space per element during sorting

## Common Mistakes

1. **Forgetting to handle the tie-breaker case**: Some candidates correctly sort by 1-bit count but forget that when counts are equal, they need to sort by the actual numeric value. Always read the problem statement carefully - "in case of two or more integers have the same number of `1`'s you have to sort them in ascending order."

2. **Inefficient 1-bit counting**: Using string conversion (`bin(num).count('1')` in Python) works but is slower and less elegant than bitwise operations. Interviewers prefer the bit manipulation approach because it demonstrates deeper understanding.

3. **Integer overflow in bit manipulation**: When using `n & (n-1)` in a loop, ensure your loop condition handles all cases correctly. For negative numbers (if they were allowed), this approach might not work as expected. Fortunately, this problem only has non-negative integers.

4. **Assuming built-in functions are always available**: While `Integer.bitCount()` exists in Java, in an interview you should be prepared to implement the bit count manually. The `n & (n-1)` trick is a classic interview pattern worth knowing.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Custom sorting with multiple criteria**: Many problems require sorting by multiple keys (e.g., sort by frequency, then by value). Examples:
   - [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) - Sort by frequency, then alphabetically
   - [Sort Array by Increasing Frequency](https://leetcode.com/problems/sort-array-by-increasing-frequency/) - Similar to this problem but with frequencies instead of bit counts

2. **Bit manipulation for counting set bits**: The `n & (n-1)` trick appears in many bit manipulation problems:
   - [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) - Direct application
   - [Power of Two](https://leetcode.com/problems/power-of-two/) - A number is power of two if `n & (n-1) == 0` (and `n > 0`)

3. **Transforming then sorting**: The pattern of computing some property for each element, then sorting based on that property appears in problems like:
   - [Sort Integers by The Power Value](https://leetcode.com/problems/sort-integers-by-the-power-value/) - Similar structure but with a different transformation

## Key Takeaways

1. **Multiple-criteria sorting is often implemented by comparing tuples**: Most languages support sorting by tuples where the first element is the primary key, second is the secondary key, etc. This is cleaner than writing complex comparator functions.

2. **`n & (n-1)` clears the lowest set bit**: This is a fundamental bit manipulation trick that every programmer should know. It's useful for counting set bits and checking power-of-two conditions.

3. **Consider time-space tradeoffs for computed properties**: If you're computing a property for each element that will be used multiple times (like in a comparator), consider precomputing and caching the results to avoid redundant calculations.

Related problems: [Find Subsequence of Length K With the Largest Sum](/problem/find-subsequence-of-length-k-with-the-largest-sum), [Find if Array Can Be Sorted](/problem/find-if-array-can-be-sorted)
