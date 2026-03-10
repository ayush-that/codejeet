---
title: "How to Solve Add to Array-Form of Integer — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Add to Array-Form of Integer. Easy difficulty, 45.4% acceptance rate. Topics: Array, Math."
date: "2027-11-01"
category: "dsa-patterns"
tags: ["add-to-array-form-of-integer", "array", "math", "easy"]
---

# How to Solve "Add to Array-Form of Integer"

This problem asks us to add an integer `k` to an array-form integer `num` (where each element represents a digit from most to least significant) and return the result in the same array-form format. While conceptually simple, it's interesting because it tests your ability to handle:

1. **Digit-by-digit addition with carry** (like elementary school addition)
2. **Different length numbers** (array length vs. number of digits in k)
3. **Potential result length increase** (e.g., 999 + 1 = 1000 adds a digit)

The main challenge is performing the addition efficiently without converting the entire array to a single integer (which could overflow with large inputs).

## Visual Walkthrough

Let's trace through `num = [1, 2, 3]` and `k = 912`:

**Step 1:** Start from the least significant digit (rightmost)

- Current digit from array: 3 (from `num[2]`)
- Current digit from k: 2 (912 % 10 = 2)
- Sum: 3 + 2 = 5, carry = 0
- Result so far: [5]

**Step 2:** Move left in array, reduce k

- Array digit: 2 (from `num[1]`)
- k digit: 1 (91 % 10 = 1, since we processed the 2)
- Sum: 2 + 1 = 3, carry = 0
- Result: [3, 5] (we prepend digits as we go)

**Step 3:** Continue

- Array digit: 1 (from `num[0]`)
- k digit: 9 (9 % 10 = 9, k is now 9)
- Sum: 1 + 9 = 10, carry = 1
- Result digit: 0, carry = 1
- Result: [0, 3, 5]

**Step 4:** Handle remaining k and carry

- k is now 0 (9 // 10 = 0)
- But we have carry = 1
- Add carry: result becomes [1, 0, 3, 5]

Final result: `[1, 0, 3, 5]` which equals 123 + 912 = 1035 ✓

## Brute Force Approach

A naive approach would be to:

1. Convert the array to a full integer
2. Add k to it
3. Convert the result back to an array

<div class="code-group">

```python
# Time: O(n) | Space: O(n) - but risks integer overflow!
def addToArrayForm(num, k):
    # Convert array to integer
    num_int = 0
    for digit in num:
        num_int = num_int * 10 + digit

    # Add k
    total = num_int + k

    # Convert back to array
    if total == 0:
        return [0]

    result = []
    while total > 0:
        result.append(total % 10)
        total //= 10

    return result[::-1]
```

```javascript
// Time: O(n) | Space: O(n) - but risks integer overflow!
function addToArrayForm(num, k) {
  // Convert array to integer
  let numInt = 0;
  for (let digit of num) {
    numInt = numInt * 10 + digit;
  }

  // Add k
  let total = numInt + k;

  // Convert back to array
  if (total === 0) return [0];

  const result = [];
  while (total > 0) {
    result.push(total % 10);
    total = Math.floor(total / 10);
  }

  return result.reverse();
}
```

```java
// Time: O(n) | Space: O(n) - but risks integer overflow!
public List<Integer> addToArrayForm(int[] num, int k) {
    // Convert array to integer
    long numInt = 0;  // Using long to handle larger numbers
    for (int digit : num) {
        numInt = numInt * 10 + digit;
    }

    // Add k
    long total = numInt + k;

    // Convert back to array
    if (total == 0) return Arrays.asList(0);

    List<Integer> result = new ArrayList<>();
    while (total > 0) {
        result.add((int)(total % 10));
        total /= 10;
    }

    Collections.reverse(result);
    return result;
}
```

</div>

**Why this fails:** The problem constraints allow `num` to have up to 10⁴ digits, which far exceeds what standard integers (even 64-bit) can hold. This approach would overflow, giving incorrect results for large inputs.

## Optimal Solution

The correct approach processes digits one by one from least to most significant, just like manual addition. We work from the end of the array and the least significant digit of k, handling carries as we go.

<div class="code-group">

```python
# Time: O(max(n, log k)) | Space: O(max(n, log k))
def addToArrayForm(num, k):
    """
    Add integer k to array-form integer num.

    Approach: Process digits from least to most significant,
    similar to elementary school addition.
    """
    result = []
    i = len(num) - 1  # Start from least significant digit of array
    carry = 0

    # Process all digits from both numbers
    while i >= 0 or k > 0 or carry > 0:
        # Get current digit from array (if any)
        digit_from_num = num[i] if i >= 0 else 0

        # Get current digit from k
        digit_from_k = k % 10

        # Calculate sum and new carry
        current_sum = digit_from_num + digit_from_k + carry
        digit = current_sum % 10  # Current result digit
        carry = current_sum // 10  # Carry for next position

        # Add digit to result (we'll reverse at the end)
        result.append(digit)

        # Move to next digits
        i -= 1
        k //= 10

    # Reverse result since we processed from least to most significant
    return result[::-1]
```

```javascript
// Time: O(max(n, log k)) | Space: O(max(n, log k))
function addToArrayForm(num, k) {
  /**
   * Add integer k to array-form integer num.
   *
   * Approach: Process digits from least to most significant,
   * similar to elementary school addition.
   */
  const result = [];
  let i = num.length - 1; // Start from least significant digit of array
  let carry = 0;

  // Process all digits from both numbers
  while (i >= 0 || k > 0 || carry > 0) {
    // Get current digit from array (if any)
    const digitFromNum = i >= 0 ? num[i] : 0;

    // Get current digit from k
    const digitFromK = k % 10;

    // Calculate sum and new carry
    const currentSum = digitFromNum + digitFromK + carry;
    const digit = currentSum % 10; // Current result digit
    carry = Math.floor(currentSum / 10); // Carry for next position

    // Add digit to result (we'll reverse at the end)
    result.push(digit);

    // Move to next digits
    i--;
    k = Math.floor(k / 10);
  }

  // Reverse result since we processed from least to most significant
  return result.reverse();
}
```

```java
// Time: O(max(n, log k)) | Space: O(max(n, log k))
public List<Integer> addToArrayForm(int[] num, int k) {
    /**
     * Add integer k to array-form integer num.
     *
     * Approach: Process digits from least to most significant,
     * similar to elementary school addition.
     */
    List<Integer> result = new ArrayList<>();
    int i = num.length - 1;  // Start from least significant digit of array
    int carry = 0;

    // Process all digits from both numbers
    while (i >= 0 || k > 0 || carry > 0) {
        // Get current digit from array (if any)
        int digitFromNum = i >= 0 ? num[i] : 0;

        // Get current digit from k
        int digitFromK = k % 10;

        // Calculate sum and new carry
        int currentSum = digitFromNum + digitFromK + carry;
        int digit = currentSum % 10;  // Current result digit
        carry = currentSum / 10;  // Carry for next position

        // Add digit to result (we'll reverse at the end)
        result.add(digit);

        // Move to next digits
        i--;
        k /= 10;
    }

    // Reverse result since we processed from least to most significant
    Collections.reverse(result);
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(max(n, log k))

- We process each digit of `num` (n digits) and each digit of `k` (log₁₀ k digits)
- The loop continues until we've processed all digits from both numbers and any remaining carry
- Each iteration does constant work (addition, modulo, division)

**Space Complexity:** O(max(n, log k))

- We store the result, which can be at most max(n, log k) + 1 digits
- Example: [9,9,9] + 1 = [1,0,0,0] (3 digits → 4 digits)
- The extra space is for the output, which is required by the problem

## Common Mistakes

1. **Forgetting to handle the final carry**
   - When adding 999 + 1, you get 1000 with an extra digit
   - The loop condition must include `carry > 0` to handle this case
   - **Fix:** Always check if carry remains after processing all digits

2. **Processing digits in the wrong order**
   - Arrays store most significant digit first, but addition works from least significant
   - Starting from the beginning of the array leads to incorrect results
   - **Fix:** Start from `num.length - 1` and work backwards

3. **Not handling different length numbers properly**
   - When one number has more digits than the other
   - Example: [1] + 999 needs to process all 3 digits of 999
   - **Fix:** Continue loop while `i >= 0` OR `k > 0` OR `carry > 0`

4. **Integer overflow in intermediate calculations**
   - Trying to convert entire array to integer first
   - Even using 64-bit integers can overflow with 10⁴ digits
   - **Fix:** Process digits one by one without full conversion

## When You'll See This Pattern

This digit-by-digit addition with carry is a fundamental pattern in many problems:

1. **Add Two Numbers (Medium)** - Similar concept but with linked lists instead of arrays
2. **Plus One (Easy)** - Special case where k = 1, same digit-by-digit approach
3. **Add Binary (Easy)** - Same pattern but with binary digits (base 2 instead of base 10)
4. **Multiply Strings (Medium)** - More complex but builds on the same digit manipulation concepts

The core idea is treating numbers as sequences of digits and performing operations digit-by-digit while managing carries between positions.

## Key Takeaways

1. **When adding large numbers, process digits from least to most significant** - This matches how humans do addition and naturally handles carries.

2. **The loop condition should account for all input sources** - Continue while there are digits in either input OR there's a pending carry.

3. **This pattern generalizes to other bases** - The same approach works for binary (base 2), octal (base 8), or any other base by changing the divisor/modulo from 10 to the base.

Related problems: [Add Two Numbers](/problem/add-two-numbers), [Plus One](/problem/plus-one), [Add Binary](/problem/add-binary)
