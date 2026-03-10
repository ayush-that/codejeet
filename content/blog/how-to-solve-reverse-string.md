---
title: "How to Solve Reverse String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse String. Easy difficulty, 80.6% acceptance rate. Topics: Two Pointers, String."
date: "2026-03-12"
category: "dsa-patterns"
tags: ["reverse-string", "two-pointers", "string", "easy"]
---

# How to Solve Reverse String

At first glance, reversing a string seems trivial—just use a built-in function. But when you're given the string as an array of characters and must modify it in-place with O(1) extra memory, the problem becomes an exercise in efficient array manipulation. The constraint forces you to think about swapping elements without creating a new array, which is exactly what interviewers want to test.

## Visual Walkthrough

Let's trace through reversing the string `["h","e","l","l","o"]`:

**Step 1:** We'll use two pointers: `left` starting at index 0 and `right` starting at index 4 (last character)

- Array: `["h","e","l","l","o"]`
- Swap `s[0]` ("h") with `s[4]` ("o")
- Result: `["o","e","l","l","h"]`

**Step 2:** Move pointers inward: `left = 1`, `right = 3`

- Swap `s[1]` ("e") with `s[3]` ("l")
- Result: `["o","l","l","e","h"]`

**Step 3:** Move pointers inward: `left = 2`, `right = 2`

- When `left` equals `right`, we're at the middle element
- No swap needed (single element is already in place)
- Final result: `["o","l","l","e","h"]`

The key insight: we only need to iterate until the pointers meet in the middle. For even-length strings, they'll cross; for odd-length strings, they'll meet at the center.

## Brute Force Approach

A naive approach would create a new array and copy elements in reverse order:

```python
def reverseString(s):
    result = []
    for i in range(len(s)-1, -1, -1):
        result.append(s[i])
    # But we can't return result - we must modify s in-place!
    # To modify s, we'd need to copy result back to s
    for i in range(len(s)):
        s[i] = result[i]
```

**Why this fails:**

1. **Space complexity is O(n)** - We create a new array of size n, violating the O(1) memory constraint
2. **Two passes required** - First to build the reversed array, then to copy it back
3. **Not in-place** - The problem specifically requires modifying the input array directly

While this approach correctly reverses the string, it's inefficient for the constraints given. Interviewers expect you to recognize that creating a new array is wasteful when we can swap elements directly.

## Optimal Solution

The two-pointer technique is perfect for this problem. We swap the first and last characters, then move inward until we reach the middle. This works in O(n) time with O(1) extra space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def reverseString(s):
    """
    Reverses a string in-place using two pointers.

    Args:
        s: List of characters to reverse

    Returns:
        None (modifies input list in-place)
    """
    # Initialize two pointers: left at start, right at end
    left = 0
    right = len(s) - 1

    # Continue swapping until pointers meet or cross
    while left < right:
        # Swap characters at left and right positions
        s[left], s[right] = s[right], s[left]

        # Move pointers toward the center
        left += 1
        right -= 1
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Reverses a string in-place using two pointers.
 * @param {character[]} s - Array of characters to reverse
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
  // Initialize two pointers: left at start, right at end
  let left = 0;
  let right = s.length - 1;

  // Continue swapping until pointers meet or cross
  while (left < right) {
    // Swap characters at left and right positions
    [s[left], s[right]] = [s[right], s[left]];

    // Move pointers toward the center
    left++;
    right--;
  }
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Reverses a string in-place using two pointers.
     * @param s - Array of characters to reverse
     */
    public void reverseString(char[] s) {
        // Initialize two pointers: left at start, right at end
        int left = 0;
        int right = s.length - 1;

        // Continue swapping until pointers meet or cross
        while (left < right) {
            // Swap characters at left and right positions
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;

            // Move pointers toward the center
            left++;
            right--;
        }
    }
}
```

</div>

**Why this works:**

- **Two pointers** efficiently track positions to swap without extra memory
- **In-place modification** satisfies the problem constraints
- **Single pass** through half the array (n/2 swaps) gives O(n) time complexity
- **Works for all cases**: empty array, single character, even/odd lengths

## Complexity Analysis

**Time Complexity: O(n)**

- We perform n/2 swaps (where n is the length of the string)
- Each swap is a constant-time operation
- Even though we only iterate through half the array, we still scale linearly with input size

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the two pointers and temporary swap variable
- No additional arrays or data structures are created
- The modification happens directly in the input array

## Common Mistakes

1. **Forgetting the in-place requirement**
   - **Mistake**: Creating a new array and returning it
   - **Why it's wrong**: The problem states "modify the input array in-place"
   - **Fix**: Always swap elements directly within the input array

2. **Off-by-one errors with indices**
   - **Mistake**: Using `right = len(s)` instead of `len(s) - 1`
   - **Why it's wrong**: Array indices are 0-based, so the last element is at index `length - 1`
   - **Fix**: Initialize `right` to `len(s) - 1` and use `while left < right` (not `<=`)

3. **Incorrect loop condition**
   - **Mistake**: Using `while left <= right` for all cases
   - **Why it's wrong**: For odd-length strings, when pointers meet at the middle element, swapping it with itself is unnecessary
   - **Fix**: Use `while left < right` to stop when pointers meet or cross

4. **Not handling edge cases**
   - **Mistake**: Assuming the input always has at least 2 characters
   - **Why it's wrong**: Empty arrays or single-character strings should work without errors
   - **Fix**: The two-pointer solution naturally handles these cases—when `len(s) <= 1`, the while loop doesn't execute

## When You'll See This Pattern

The two-pointer technique is fundamental for array/string manipulation problems. You'll encounter it in:

1. **Palindrome Checking** (LeetCode 125, 680)
   - Similar logic: compare characters from both ends moving inward
   - Variation: might need to skip non-alphanumeric characters

2. **Container With Most Water** (LeetCode 11)
   - Uses two pointers at opposite ends, moving inward based on height comparison
   - Demonstrates how two pointers can optimize brute force O(n²) to O(n)

3. **Two Sum II - Input Array Is Sorted** (LeetCode 167)
   - Two pointers starting at opposite ends, moving based on sum comparison
   - Shows how sorted arrays enable two-pointer solutions

4. **Move Zeroes** (LeetCode 283)
   - Uses two pointers moving in the same direction (fast and slow pointers)
   - Another variation of the two-pointer pattern

## Key Takeaways

1. **Two pointers are ideal for symmetric operations** - When you need to compare or swap elements from opposite ends of an array/string, the two-pointer technique is often the most efficient approach.

2. **In-place modification saves space** - Always check if you can modify the input directly rather than creating new data structures. This is especially important in interviews where space complexity matters.

3. **The middle element is special** - For odd-length sequences, the center element doesn't need to move. Your loop condition should account for this (`left < right` not `left <= right`).

4. **Edge cases matter** - Always test with empty input, single element, and both even/odd lengths. The two-pointer approach elegantly handles all these cases.

Related problems: [Reverse Vowels of a String](/problem/reverse-vowels-of-a-string), [Reverse String II](/problem/reverse-string-ii)
