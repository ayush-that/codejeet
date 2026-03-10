---
title: "How to Solve Check Balanced String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check Balanced String. Easy difficulty, 82.5% acceptance rate. Topics: String."
date: "2027-12-18"
category: "dsa-patterns"
tags: ["check-balanced-string", "string", "easy"]
---

# How to Solve Check Balanced String

You're given a string of digits and need to determine if the sum of digits at even indices equals the sum of digits at odd indices. While this problem seems straightforward, it's interesting because it tests your understanding of index manipulation, string-to-integer conversion, and careful handling of edge cases like empty strings or single-character inputs.

## Visual Walkthrough

Let's trace through the example `num = "123456"`:

**Step 1:** Understand the indices (0-based indexing)

- String: "1 2 3 4 5 6"
- Indices: 0 1 2 3 4 5
- Even indices: 0, 2, 4 → digits: 1, 3, 5
- Odd indices: 1, 3, 5 → digits: 2, 4, 6

**Step 2:** Calculate even sum

- Even digits: 1 + 3 + 5 = 9

**Step 3:** Calculate odd sum

- Odd digits: 2 + 4 + 6 = 12

**Step 4:** Compare sums

- 9 ≠ 12 → return `false`

Now let's try `num = "1230"`:

- Even indices (0, 2): 1 + 3 = 4
- Odd indices (1, 3): 2 + 0 = 2
- 4 ≠ 2 → return `false`

And `num = "1234"`:

- Even indices (0, 2): 1 + 3 = 4
- Odd indices (1, 3): 2 + 4 = 6
- 4 ≠ 6 → return `false`

Actually, let's find a balanced example: `num = "1232"`:

- Even indices (0, 2): 1 + 3 = 4
- Odd indices (1, 3): 2 + 2 = 4
- 4 = 4 → return `true`

## Brute Force Approach

The most straightforward approach is to iterate through the string twice:

1. First pass: Sum all digits at even indices
2. Second pass: Sum all digits at odd indices
3. Compare the two sums

While this approach works, it's inefficient because we're traversing the string twice when we could do it in one pass. However, for this problem, even the brute force approach has O(n) time complexity, so the optimization isn't about asymptotic complexity but about writing cleaner, more efficient code.

A truly naive approach might involve creating separate arrays for even and odd digits, then summing them separately. This would use O(n) extra space unnecessarily.

## Optimal Solution

The optimal solution processes the string in a single pass, maintaining two running sums. We iterate through each character, convert it to its integer value, and add it to either the even sum or odd sum based on its index position.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) - we only use two integer variables
def isBalanced(num: str) -> bool:
    # Initialize sums for even and odd indices
    even_sum = 0
    odd_sum = 0

    # Iterate through each character in the string
    for i in range(len(num)):
        # Convert character to integer
        digit = int(num[i])

        # Check if current index is even or odd
        if i % 2 == 0:
            # Add to even sum for even indices
            even_sum += digit
        else:
            # Add to odd sum for odd indices
            odd_sum += digit

    # Return true if sums are equal, false otherwise
    return even_sum == odd_sum
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use two integer variables
function isBalanced(num) {
  // Initialize sums for even and odd indices
  let evenSum = 0;
  let oddSum = 0;

  // Iterate through each character in the string
  for (let i = 0; i < num.length; i++) {
    // Convert character to integer
    const digit = parseInt(num[i], 10);

    // Check if current index is even or odd
    if (i % 2 === 0) {
      // Add to even sum for even indices
      evenSum += digit;
    } else {
      // Add to odd sum for odd indices
      oddSum += digit;
    }
  }

  // Return true if sums are equal, false otherwise
  return evenSum === oddSum;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use two integer variables
public boolean isBalanced(String num) {
    // Initialize sums for even and odd indices
    int evenSum = 0;
    int oddSum = 0;

    // Iterate through each character in the string
    for (int i = 0; i < num.length(); i++) {
        // Convert character to integer
        int digit = Character.getNumericValue(num.charAt(i));

        // Check if current index is even or odd
        if (i % 2 == 0) {
            // Add to even sum for even indices
            evenSum += digit;
        } else {
            // Add to odd sum for odd indices
            oddSum += digit;
        }
    }

    // Return true if sums are equal, false otherwise
    return evenSum == oddSum;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the string exactly once, performing constant-time operations (character access, integer conversion, addition, and modulo check) for each character.
- The number of operations scales linearly with the length of the input string.

**Space Complexity:** O(1)

- We only use a fixed number of integer variables (`even_sum`, `odd_sum`, loop counter `i`, and temporary `digit`).
- The space used does not grow with the input size.

## Common Mistakes

1. **Off-by-one errors with index parity:** Some candidates confuse 0-based vs 1-based indexing. Remember that in programming, index 0 is even, index 1 is odd, index 2 is even, etc. The modulo operator (`i % 2`) correctly handles this.

2. **Forgetting to convert characters to integers:** The string contains digit characters like '1', '2', etc., not the actual integer values. Adding characters directly would concatenate strings in JavaScript or use ASCII values in other languages, giving incorrect results.

3. **Not handling empty strings:** While the problem doesn't specify edge cases explicitly, an empty string has no digits at even or odd indices, so both sums are 0, making it balanced. Our solution handles this correctly since the loop won't execute and both sums remain 0.

4. **Inefficient modulo operation:** Some candidates worry that `i % 2` is expensive. While it's true that modulo can be slower than bitwise operations, for this problem the difference is negligible. However, you could use `(i & 1) == 0` to check for even indices if you want to optimize further.

## When You'll See This Pattern

This problem uses the **two-pointer accumulation** pattern, where you maintain separate accumulators while traversing a data structure. You'll see similar patterns in:

1. **Maximum Subarray (LeetCode 53):** While not exactly the same, it involves maintaining a running sum and making decisions at each step.

2. **Partition Labels (LeetCode 763):** Requires tracking multiple pieces of information while scanning through a string.

3. **Product of Array Except Self (LeetCode 238):** Involves maintaining separate running products from left and right.

4. **Running Sum of 1D Array (LeetCode 1480):** A simpler version where you maintain a single accumulator.

The core technique of processing elements based on their position and maintaining separate accumulators appears in many array/string manipulation problems.

## Key Takeaways

1. **Single-pass accumulation is often optimal:** When you need to compute separate values based on element properties (like index parity), you can usually do it in one pass by maintaining multiple accumulators.

2. **Pay attention to data types:** String digits need conversion to integers before arithmetic operations. This is a common pitfall in interview problems.

3. **The modulo operator is your friend for cyclic patterns:** When dealing with indices that follow a pattern (even/odd, every kth element, etc.), `%` is the right tool for the job.

4. **Edge cases matter:** Always consider empty inputs, single-element inputs, and boundary conditions. For this problem, think about what happens with strings of length 1.

Related problems: [Balanced Binary Tree](/problem/balanced-binary-tree)
