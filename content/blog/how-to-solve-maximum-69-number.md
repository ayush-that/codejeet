---
title: "How to Solve Maximum 69 Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum 69 Number. Easy difficulty, 84.5% acceptance rate. Topics: Math, Greedy."
date: "2027-05-21"
category: "dsa-patterns"
tags: ["maximum-69-number", "math", "greedy", "easy"]
---

# How to Solve Maximum 69 Number

You're given a positive integer containing only digits 6 and 9, and you can change at most one digit to get the maximum possible number. While this seems straightforward, the interesting part is figuring out _which_ digit to change for maximum impact. Changing a 9 to 6 never helps, so we only consider changing 6s to 9s. But which 6 should we change? The leftmost one, because in our decimal system, digits to the left have higher place value.

## Visual Walkthrough

Let's trace through an example: `num = 9669`

**Step 1:** Convert to string for digit-by-digit access: `"9669"`

**Step 2:** Scan from left to right looking for the first '6':

- Index 0: '9' → skip
- Index 1: '6' → found!

**Step 3:** Change this '6' to '9': `"9969"`

**Step 4:** Convert back to integer: `9969`

Why change the leftmost '6'? Consider what happens if we change different positions:

- Change index 1 (leftmost '6'): `9669` → `9969` (increase of 300)
- Change index 2: `9669` → `9699` (increase of 30)
- Change index 3: `9669` → `9666` (decrease of 3, not helpful)

The leftmost '6' gives us the biggest increase because changing it affects the highest place value. This is the greedy insight: always change the first '6' you encounter when scanning from left to right.

## Brute Force Approach

A naive approach would be to try changing every possible digit position:

1. Convert the number to a string
2. For each position in the string:
   - Create a new string with that digit flipped (6→9 or 9→6)
   - Convert back to integer
   - Track the maximum value seen
3. Return the maximum

While this would work, it's inefficient because:

- We're creating new strings for each position (O(n) space each time)
- We're doing unnecessary work by trying to change 9s to 6s
- The time complexity is O(n²) if we consider string creation costs

More importantly, this approach misses the key insight that we only need to change the leftmost '6'. The brute force works but is overcomplicated for what the problem requires.

## Optimal Solution

The optimal solution uses a greedy approach: find the first '6' from the left and change it to '9'. If there are no '6's, the number is already maximum.

<div class="code-group">

```python
# Time: O(n) where n is number of digits | Space: O(n) for the string
def maximum69Number(num: int) -> int:
    # Convert the number to a string so we can access individual digits
    num_str = str(num)

    # Convert to list because strings are immutable in Python
    # We need to modify one character
    num_list = list(num_str)

    # Iterate through each digit from left to right
    for i in range(len(num_list)):
        # If we find a '6', change it to '9'
        if num_list[i] == '6':
            num_list[i] = '9'
            # We only need to change one digit, so break after first change
            break

    # Convert the list back to a string, then to an integer
    return int(''.join(num_list))
```

```javascript
// Time: O(n) where n is number of digits | Space: O(n) for the string
function maximum69Number(num) {
  // Convert the number to a string so we can access individual characters
  let numStr = num.toString();

  // Convert to array because strings are immutable in JavaScript
  // We need to modify one character
  let numArr = numStr.split("");

  // Iterate through each digit from left to right
  for (let i = 0; i < numArr.length; i++) {
    // If we find a '6', change it to '9'
    if (numArr[i] === "6") {
      numArr[i] = "9";
      // We only need to change one digit, so break after first change
      break;
    }
  }

  // Convert the array back to a string, then to an integer
  return parseInt(numArr.join(""));
}
```

```java
// Time: O(n) where n is number of digits | Space: O(n) for the string
class Solution {
    public int maximum69Number(int num) {
        // Convert the number to a string so we can access individual characters
        String numStr = Integer.toString(num);

        // Convert to char array for modification
        char[] numArr = numStr.toCharArray();

        // Iterate through each digit from left to right
        for (int i = 0; i < numArr.length; i++) {
            // If we find a '6', change it to '9'
            if (numArr[i] == '6') {
                numArr[i] = '9';
                // We only need to change one digit, so break after first change
                break;
            }
        }

        // Convert the char array back to a string, then to an integer
        return Integer.parseInt(new String(numArr));
    }
}
```

</div>

**Alternative one-liner approach** (Python-specific):

```python
def maximum69Number(num: int) -> int:
    # Replace the first '6' with '9' in the string representation
    return int(str(num).replace('6', '9', 1))
```

This uses Python's `replace()` method with the `count` parameter set to 1, which only replaces the first occurrence. While elegant, it's good to understand the manual approach for interviews where language-specific methods might not be available or expected.

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of digits in the input number. In the worst case, we might scan all digits (if the number is all 9s or if the only '6' is at the very end). Converting between string and integer representations also takes O(n) time.

**Space Complexity:** O(n) for the string/array representation of the number. We need to store the digits to modify them. The input integer itself takes O(log₁₀ num) space, which is equivalent to O(n) where n is the number of digits.

## Common Mistakes

1. **Changing the wrong digit:** Some candidates change the rightmost '6' instead of the leftmost. Remember: in our decimal system, digits to the left have higher place value, so changing a leftmost digit gives a bigger increase.

2. **Changing 9s to 6s:** The problem allows changing any digit, but changing a 9 to a 6 always decreases the number. We should only change 6s to 9s.

3. **Not handling the "no change" case:** If the number contains only 9s, we should return it unchanged. The loop approach handles this automatically since we never find a '6' to change.

4. **Modifying strings directly:** In Python and JavaScript, strings are immutable. Attempting to do `num_str[i] = '9'` will cause an error. You need to convert to a list/array first.

5. **Forgetting to convert back to integer:** After modifying the string representation, remember to convert back to an integer before returning.

## When You'll See This Pattern

This problem teaches the **greedy leftmost replacement** pattern, which appears in various forms:

1. **Maximum Swap (LeetCode 670)** - Similar concept but with two swaps allowed instead of one change. You still want to swap the leftmost smaller digit with the rightmost largest digit.

2. **Next Greater Element III (LeetCode 556)** - Finding the next permutation involves similar thinking about digit manipulation from the right side.

3. **Monotone Increasing Digits (LeetCode 738)** - Another digit manipulation problem where you work from left to right, making greedy decisions.

The core pattern is: when manipulating digits for maximum/minimum values, work from the most significant digit (left side) to the least significant digit (right side), as changes to left digits have greater impact.

## Key Takeaways

1. **Greedy from the left:** When trying to maximize a number by changing digits, always prioritize the leftmost positions because they have higher place value in our decimal system.

2. **Digit manipulation technique:** Converting numbers to strings for easy digit access is a common pattern in digit manipulation problems. Remember that strings are immutable in many languages, so you may need to convert to a list/array first.

3. **Problem simplification:** Even though the problem says you can change "at most one digit" (which includes changing 9→6), logical reasoning shows you should only consider 6→9 changes for maximization. Always look for opportunities to simplify the problem space.

[Practice this problem on CodeJeet](/problem/maximum-69-number)
