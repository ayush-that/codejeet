---
title: "How to Solve Minimum Sum of Four Digit Number After Splitting Digits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Sum of Four Digit Number After Splitting Digits. Easy difficulty, 86.2% acceptance rate. Topics: Math, Greedy, Sorting."
date: "2026-06-08"
category: "dsa-patterns"
tags:
  ["minimum-sum-of-four-digit-number-after-splitting-digits", "math", "greedy", "sorting", "easy"]
---

# How to Solve Minimum Sum of Four Digit Number After Splitting Digits

You're given a four-digit positive integer and must split its digits into two new numbers (allowing leading zeros) to minimize their sum. The challenge is figuring out how to pair the digits optimally—it's not immediately obvious which digits should go together or in what order.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `num = 2931`.

**Step 1: Extract the digits**

- Digits: [2, 9, 3, 1]

**Step 2: Sort the digits**

- Sorted: [1, 2, 3, 9]

**Step 3: Pair digits optimally**
We need to form two 2-digit numbers. To minimize the sum, we want:

1. The smallest possible tens digits for both numbers
2. The smallest possible ones digits for both numbers

The optimal strategy is to alternate assigning digits to the two numbers:

- Number 1 gets digits at indices 0 and 2: 1 (tens) and 3 (ones) → 13
- Number 2 gets digits at indices 1 and 3: 2 (tens) and 9 (ones) → 29

**Step 4: Calculate the sum**

- 13 + 29 = 42

Why does this work? By alternating, we ensure both numbers get one small digit in the tens place (which has higher weight) and one larger digit in the ones place. If we instead paired the two smallest digits together (12 and 39), we'd get 51, which is larger.

Let's verify with another example: `num = 4009`

- Digits: [4, 0, 0, 9]
- Sorted: [0, 0, 4, 9]
- Alternate assignment: 04 (or 4) and 09 (or 9)
- Sum: 4 + 9 = 13

## Brute Force Approach

A naive approach would try all possible ways to split the four digits into two numbers. Since we have 4 digits and need to assign each to either `new1` or `new2`, there are 2⁴ = 16 possible assignments. For each assignment, we'd need to consider all permutations of the digits within each number, which adds complexity.

However, even this brute force approach is manageable for just 4 digits, but it's messy and doesn't scale well conceptually. The code would involve:

1. Generating all subsets of digits for `new1`
2. For each subset, generating permutations of those digits
3. Doing the same for the remaining digits in `new2`
4. Calculating all possible sums and finding the minimum

While technically feasible for this specific problem (since 4 is small), it's overly complex and doesn't reveal the underlying mathematical insight. Interviewers would expect you to find the optimal greedy approach instead.

## Optimal Solution

The key insight is that to minimize the sum of two numbers, we want the smallest digits in the highest-value positions. Since both numbers will have two digits (or potentially one digit with a leading zero), we should:

1. Sort the four digits
2. Assign the smallest two digits to the tens places
3. Assign the next two digits to the ones places

But wait—there's a subtlety. We actually want to alternate: the smallest digit goes to the first number's tens place, the second smallest to the second number's tens place, the third smallest to the first number's ones place, and the largest to the second number's ones place.

This works because:

- Tens digits have 10× weight compared to ones digits
- By giving each number one small tens digit, we minimize both numbers
- The ones digits get whatever's left

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Since we always process exactly 4 digits, time and space are constant
def minimumSum(num: int) -> int:
    # Step 1: Extract digits from the number
    # We convert the integer to string to easily access each digit
    digits = [int(d) for d in str(num)]

    # Step 2: Sort the digits in ascending order
    # Sorting ensures we can easily pick the smallest digits first
    digits.sort()

    # Step 3: Form the two numbers using optimal pairing
    # The pattern is: new1 = digits[0] * 10 + digits[2]
    #                new2 = digits[1] * 10 + digits[3]
    # Why this pattern? We alternate assigning digits to give each number
    # one small tens digit, minimizing both numbers' values
    new1 = digits[0] * 10 + digits[2]  # First and third smallest digits
    new2 = digits[1] * 10 + digits[3]  # Second and fourth smallest digits

    # Step 4: Return the minimum possible sum
    return new1 + new2
```

```javascript
// Time: O(1) | Space: O(1)
// Processing exactly 4 digits means constant time and space
function minimumSum(num) {
  // Step 1: Extract digits from the number
  // Convert to string, split into characters, then map to numbers
  const digits = String(num).split("").map(Number);

  // Step 2: Sort the digits in ascending order
  // Default sort is lexicographic, so we need compare function for numeric sort
  digits.sort((a, b) => a - b);

  // Step 3: Form the two numbers using optimal pairing
  // Alternate assignment minimizes both numbers by giving each
  // one small digit in the tens position (which has higher weight)
  const new1 = digits[0] * 10 + digits[2]; // First and third smallest
  const new2 = digits[1] * 10 + digits[3]; // Second and fourth smallest

  // Step 4: Return the minimum possible sum
  return new1 + new2;
}
```

```java
// Time: O(1) | Space: O(1)
// Fixed input size (4 digits) means constant complexity
class Solution {
    public int minimumSum(int num) {
        // Step 1: Extract digits from the number
        // Convert to string, then to char array for easy digit access
        char[] chars = Integer.toString(num).toCharArray();
        int[] digits = new int[4];

        // Convert each character to its integer value
        for (int i = 0; i < 4; i++) {
            digits[i] = chars[i] - '0';
        }

        // Step 2: Sort the digits in ascending order
        // Arrays.sort() handles the sorting for us
        Arrays.sort(digits);

        // Step 3: Form the two numbers using optimal pairing
        // The alternating pattern ensures minimal sum by placing
        // smaller digits in higher-value positions across both numbers
        int new1 = digits[0] * 10 + digits[2];  // First and third smallest
        int new2 = digits[1] * 10 + digits[3];  // Second and fourth smallest

        // Step 4: Return the minimum possible sum
        return new1 + new2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We always process exactly 4 digits, regardless of input
- Sorting 4 elements is constant time
- All other operations (digit extraction, arithmetic) are constant time

**Space Complexity: O(1)**

- We store exactly 4 digits in an array
- No additional data structures that scale with input
- Even though we create arrays, their size is fixed at 4

The constant complexity might seem surprising since we're sorting, but with a fixed input size of 4 digits, even O(n log n) becomes O(1). This is an important insight: when problem constraints guarantee small, fixed input sizes, algorithms that would normally be inefficient can become acceptable.

## Common Mistakes

1. **Not considering leading zeros**: Some candidates forget that numbers like "04" are valid (equal to 4). The problem explicitly allows leading zeros, so you don't need special handling for zeros in the tens place.

2. **Wrong pairing strategy**: A common error is to pair the two smallest digits together and the two largest together (e.g., [1,2] and [3,9] instead of alternating). This gives a larger sum because both numbers get one very large digit in the tens place.

3. **Overcomplicating with permutations**: Since there are only 4 digits, some candidates try to generate all possible number combinations. While this would eventually find the answer, it's unnecessarily complex and shows lack of insight into the optimal greedy strategy.

4. **Incorrect digit extraction**: In Java, some candidates try to use integer division/modulo without handling leading zeros properly. Using string conversion is cleaner and avoids this issue.

## When You'll See This Pattern

This problem demonstrates a **greedy sorting pattern** where sorting elements allows optimal pairing or assignment. You'll see similar patterns in:

1. **Array Partition I (LeetCode 561)**: To maximize the sum of min(a,b) pairs, you sort and take every other element. The alternating pattern is very similar to our digit assignment.

2. **Assign Cookies (LeetCode 455)**: Sort both children's greed factors and cookie sizes, then greedily assign the smallest sufficient cookie to each child.

3. **Minimum Product Sum of Two Arrays (LeetCode 1874)**: Sort one array ascending and the other descending, then multiply corresponding elements to minimize the sum of products.

The core insight is that when you need to pair elements to optimize some metric (sum, product, etc.), sorting often reveals the optimal pairing strategy.

## Key Takeaways

1. **Sorting enables greedy solutions**: When you need to pair or assign elements optimally, sorting them first often reveals the correct greedy strategy. The sorted order gives you control over which elements get paired together.

2. **Consider digit/position weights**: In problems involving multi-digit numbers, remember that digits in higher positions (tens, hundreds) have greater weight. Minimizing these high-weight digits has the biggest impact on the overall result.

3. **Fixed small inputs change complexity analysis**: When a problem guarantees small, fixed input size (like exactly 4 digits), even algorithms that would normally be O(n log n) or O(n²) become O(1). Always check constraints before dismissing an approach as too slow.

Related problems: [Add Digits](/problem/add-digits), [Difference Between Element Sum and Digit Sum of an Array](/problem/difference-between-element-sum-and-digit-sum-of-an-array), [Alternating Digit Sum](/problem/alternating-digit-sum)
