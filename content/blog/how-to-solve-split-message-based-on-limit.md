---
title: "How to Solve Split Message Based on Limit — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Split Message Based on Limit. Hard difficulty, 42.0% acceptance rate. Topics: String, Enumeration."
date: "2029-10-03"
category: "dsa-patterns"
tags: ["split-message-based-on-limit", "string", "enumeration", "hard"]
---

# How to Solve Split Message Based on Limit

This problem asks us to split a string message into multiple parts, each with a suffix indicating the part number and total parts (like `<a/b>`). The tricky part is that the suffix length changes depending on the total number of parts, which itself depends on how we split the message. This creates a circular dependency: we need to know the suffix length to determine how many parts we can have, but we need to know how many parts we have to determine the suffix length.

## Visual Walkthrough

Let's trace through an example: `message = "hello world"` with `limit = 7`.

**Step 1: Understanding the constraints**
Each part must end with `<a/b>` where `a` is the current part number and `b` is the total number of parts. The suffix length is `len("<a/b>")` = 5 plus the number of digits in `a` plus the number of digits in `b`.

**Step 2: Trying different total parts (b)**
We need to find a valid `b` where we can fit all message characters.

- If `b = 1`: suffix = `<1/1>` (length 5 + 1 + 1 = 7). Available space for message per part = limit - suffix length = 7 - 7 = 0. We need 11 characters of space, but only have 0. Not enough.
- If `b = 2`: suffix length = 5 + 1 + 1 = 7 (both 1 and 2 are single-digit). Available space = 7 - 7 = 0. Still not enough.
- If `b = 3`: suffix length = 5 + 1 + 1 = 7. Available space = 0. Not enough.
- If `b = 4`: suffix length = 5 + 1 + 1 = 7. Available space = 0. Not enough.
- If `b = 5`: suffix length = 5 + 1 + 1 = 7. Available space = 0. Not enough.
- If `b = 6`: suffix length = 5 + 1 + 1 = 7. Available space = 0. Not enough.
- If `b = 7`: suffix length = 5 + 1 + 1 = 7. Available space = 0. Not enough.
- If `b = 8`: suffix length = 5 + 1 + 1 = 7. Available space = 0. Not enough.
- If `b = 9`: suffix length = 5 + 1 + 1 = 7. Available space = 0. Not enough.
- If `b = 10`: suffix length = 5 + 1 + 2 = 8 (10 has 2 digits). Available space = 7 - 8 = -1. Negative! Can't work.
- If `b = 11`: suffix length = 5 + 1 + 2 = 8. Available space = -1. Still negative.

Wait, something's wrong. With limit=7, we can't even fit the suffix once `b` reaches 10. Let's try a more reasonable example.

**Better example**: `message = "hello world"` with `limit = 15`.

- If `b = 1`: suffix length = 7, available space = 15 - 7 = 8 per part. Need 11 total characters, but with 1 part we only have 8 available. Not enough.
- If `b = 2`: suffix length = 7 (both 1 and 2 are single-digit), available space = 8 per part. Total available = 8 × 2 = 16. Need 11 characters, so this works! We can split into 2 parts.

**Step 3: Constructing the parts**
With `b = 2`, each part has 8 characters for message content (15 - 7 = 8).

- Part 1: Take first 8 chars = "hello wo" + `<1/2>` = "hello wo<1/2>"
- Part 2: Take remaining 3 chars = "rld" + `<2/2>` = "rld<2/2>"

Both parts are exactly length 15.

## Brute Force Approach

A naive approach would be to try every possible number of parts from 1 up to some maximum, checking if we can fit the message. For each candidate `b` (total parts), we would:

1. Calculate the suffix length for each part (which varies because part numbers have different digit counts)
2. Check if the total available space across all parts can hold the entire message
3. If yes, construct the parts

The problem with this approach is efficiency. We need to try many values of `b`, and for each one, we need to calculate suffix lengths for all parts. In the worst case, if the message is long and limit is small, we might need many parts, leading to O(n²) complexity where n is the number of parts.

More importantly, the brute force approach often fails to find a valid solution because candidates don't realize there's a maximum possible `b`. When `b` gets too large, the suffix becomes longer than the limit itself, making it impossible to have any parts at all. We need a smarter way to bound our search.

## Optimized Approach

The key insight is that we can **binary search** for the correct number of parts `b`. Why does binary search work here?

1. **Monotonic property**: As `b` increases, the total available space for message content decreases (because suffixes get longer). There's a point where we have just enough space, and beyond that point, we have too little space.

2. **We can check feasibility**: For a given `b`, we can calculate the total space needed for all suffixes and see if `(limit × b) - total_suffix_length ≥ len(message)`.

3. **We need to find the minimum valid `b`**: We want the smallest number of parts that can hold the message.

The challenge is calculating total suffix length efficiently. For a given `b`:

- All parts from 1 to 9 have 1-digit part numbers
- Parts from 10 to 99 have 2-digit part numbers
- Parts from 100 to 999 have 3-digit part numbers
- And so on...

We can calculate total suffix length by grouping parts by digit count:

- Base suffix length is always 5 for `"</>"`
- For k-digit part numbers, we add k for the part number and k for the total parts number

So total suffix length = `b × 5 + sum_over_all_parts(digits(a) + digits(b))`

But `digits(b)` is the same for all parts, so that's `b × digits(b)`. And `sum(digits(a))` for a=1 to b can be calculated by counting how many parts have 1 digit, 2 digits, etc.

## Optimal Solution

We'll implement a solution that:

1. First checks if any solution is possible (limit must be at least 6 to fit the smallest suffix `"<1/1>"`)
2. Uses binary search to find the minimum valid `b`
3. For each candidate `b` in binary search, calculates total available space
4. Once we find the right `b`, constructs the actual parts

<div class="code-group">

```python
# Time: O(n log n) where n is len(message) | Space: O(n) for the result
def splitMessage(self, message: str, limit: int) -> List[str]:
    n = len(message)

    # Helper to calculate total suffix length for b parts
    def total_suffix_length(b: int) -> int:
        # Base suffix has 5 characters: '<', '/', '>', and two digits placeholders
        total = b * 5  # Each part has these 5 fixed characters

        # Add digits for the total parts number (b appears in every suffix)
        total += b * len(str(b))

        # Add digits for all part numbers (1 to b)
        # We count how many parts have 1 digit, 2 digits, etc.
        digits_b = len(str(b))
        for digit_len in range(1, digits_b + 1):
            if digit_len == digits_b:
                # Last digit group: from 10^(digit_len-1) to b
                start = 10 ** (digit_len - 1)
                count = b - start + 1
            else:
                # Full digit group: all numbers with this many digits
                count = 9 * (10 ** (digit_len - 1))
            total += count * digit_len

        return total

    # Binary search for the minimum valid b
    left, right = 1, n  # We can't have more than n parts (each char in its own part)
    valid_b = -1

    while left <= right:
        mid = (left + right) // 2
        # Calculate total space needed for suffixes
        suffix_len = total_suffix_length(mid)
        total_space = mid * limit
        available_for_message = total_space - suffix_len

        if available_for_message < n:
            # Not enough space for message, need more parts
            left = mid + 1
        else:
            # Enough space, try to find smaller b
            valid_b = mid
            right = mid - 1

    if valid_b == -1:
        return []

    # Now construct the parts with valid_b
    result = []
    idx = 0  # Index in message

    for a in range(1, valid_b + 1):
        # Calculate suffix for this part
        suffix = f"<{a}/{valid_b}>"
        # Available characters for message in this part
        available_chars = limit - len(suffix)
        # Take available_chars from message, or remaining if less
        take_chars = min(available_chars, n - idx)
        part = message[idx:idx + take_chars] + suffix
        result.append(part)
        idx += take_chars

    return result
```

```javascript
// Time: O(n log n) where n is message.length | Space: O(n) for the result
function splitMessage(message, limit) {
  const n = message.length;

  // Helper to calculate total suffix length for b parts
  const totalSuffixLength = (b) => {
    // Base suffix has 5 characters: '<', '/', '>', and two digits placeholders
    let total = b * 5;

    // Add digits for the total parts number (b appears in every suffix)
    total += b * String(b).length;

    // Add digits for all part numbers (1 to b)
    const digitsB = String(b).length;
    for (let digitLen = 1; digitLen <= digitsB; digitLen++) {
      let count;
      if (digitLen === digitsB) {
        // Last digit group: from 10^(digitLen-1) to b
        const start = Math.pow(10, digitLen - 1);
        count = b - start + 1;
      } else {
        // Full digit group: all numbers with this many digits
        count = 9 * Math.pow(10, digitLen - 1);
      }
      total += count * digitLen;
    }

    return total;
  };

  // Binary search for the minimum valid b
  let left = 1,
    right = n;
  let validB = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const suffixLen = totalSuffixLength(mid);
    const totalSpace = mid * limit;
    const availableForMessage = totalSpace - suffixLen;

    if (availableForMessage < n) {
      // Not enough space for message, need more parts
      left = mid + 1;
    } else {
      // Enough space, try to find smaller b
      validB = mid;
      right = mid - 1;
    }
  }

  if (validB === -1) {
    return [];
  }

  // Construct the parts with validB
  const result = [];
  let idx = 0;

  for (let a = 1; a <= validB; a++) {
    // Calculate suffix for this part
    const suffix = `<${a}/${validB}>`;
    // Available characters for message in this part
    const availableChars = limit - suffix.length;
    // Take availableChars from message, or remaining if less
    const takeChars = Math.min(availableChars, n - idx);
    const part = message.substring(idx, idx + takeChars) + suffix;
    result.push(part);
    idx += takeChars;
  }

  return result;
}
```

```java
// Time: O(n log n) where n is message.length() | Space: O(n) for the result
class Solution {
    public String[] splitMessage(String message, int limit) {
        int n = message.length();

        // Helper to calculate total suffix length for b parts
        java.util.function.IntFunction<Integer> totalSuffixLength = (b) -> {
            // Base suffix has 5 characters: '<', '/', '>', and two digits placeholders
            int total = b * 5;

            // Add digits for the total parts number (b appears in every suffix)
            total += b * String.valueOf(b).length();

            // Add digits for all part numbers (1 to b)
            int digitsB = String.valueOf(b).length();
            for (int digitLen = 1; digitLen <= digitsB; digitLen++) {
                int count;
                if (digitLen == digitsB) {
                    // Last digit group: from 10^(digitLen-1) to b
                    int start = (int)Math.pow(10, digitLen - 1);
                    count = b - start + 1;
                } else {
                    // Full digit group: all numbers with this many digits
                    count = 9 * (int)Math.pow(10, digitLen - 1);
                }
                total += count * digitLen;
            }

            return total;
        };

        // Binary search for the minimum valid b
        int left = 1, right = n;
        int validB = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int suffixLen = totalSuffixLength.apply(mid);
            int totalSpace = mid * limit;
            int availableForMessage = totalSpace - suffixLen;

            if (availableForMessage < n) {
                // Not enough space for message, need more parts
                left = mid + 1;
            } else {
                // Enough space, try to find smaller b
                validB = mid;
                right = mid - 1;
            }
        }

        if (validB == -1) {
            return new String[0];
        }

        // Construct the parts with validB
        String[] result = new String[validB];
        int idx = 0;

        for (int a = 1; a <= validB; a++) {
            // Calculate suffix for this part
            String suffix = "<" + a + "/" + validB + ">";
            // Available characters for message in this part
            int availableChars = limit - suffix.length();
            // Take availableChars from message, or remaining if less
            int takeChars = Math.min(availableChars, n - idx);
            String part = message.substring(idx, idx + takeChars) + suffix;
            result[a - 1] = part;
            idx += takeChars;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log n) where n is the length of the message.

- Binary search runs O(log n) iterations (since we search from 1 to n)
- Each iteration calls `total_suffix_length` which runs in O(d) where d is the number of digits in b, which is O(log b) = O(log n)
- Constructing the result takes O(n) time
- Total: O(log n × log n + n) = O(n log n) in practice

**Space Complexity**: O(n) for storing the result parts. The algorithm itself uses O(1) additional space besides the output.

## Common Mistakes

1. **Not checking if solution exists**: Candidates forget that if limit is too small (less than 6), no solution is possible because even the smallest suffix `<1/1>` requires 6 characters. Always check edge cases first.

2. **Incorrect suffix length calculation**: The most common error is miscalculating how the suffix length changes with part numbers. Remember that both `a` and `b` contribute digits, and `b`'s digits appear in every suffix.

3. **Off-by-one errors in binary search**: When implementing binary search, it's easy to get the termination condition wrong or update `left` and `right` incorrectly. Always test with small examples.

4. **Assuming all suffixes have same length**: They don't! Part numbers like 9 and 10 have different digit counts, so their suffixes have different lengths. This affects how much message content can fit in each part.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search on answer**: When you need to find the minimum/maximum value that satisfies a condition, and you can test feasibility for any candidate value, binary search is often the right approach. Similar problems:
   - **Capacity To Ship Packages Within D Days**: Find minimum capacity to ship all packages in D days
   - **Koko Eating Bananas**: Find minimum eating speed to finish all bananas in H hours

2. **String partitioning with constraints**: Problems where you need to split text subject to formatting rules:
   - **Text Justification**: Split words into lines with specific width and justification rules
   - **Sentence Screen Fitting**: Fit sentences into screen rows with cycling

3. **Digit counting and grouping**: The technique of counting numbers by digit count appears in problems like:
   - **Number of Digit One**: Count total number of digit 1 appearing in all numbers from 1 to n

## Key Takeaways

1. **When you see "find minimum/maximum X" and can test "is X feasible?", think binary search on the answer space.** This pattern transforms optimization problems into decision problems.

2. **For problems with circular dependencies** (like needing to know the answer to calculate the constraints), try to formulate the dependency mathematically and see if you can search for the answer.

3. **Digit counting problems often benefit from grouping numbers by their digit count** rather than processing them individually. This reduces O(n) operations to O(log n).

Related problems: [Text Justification](/problem/text-justification), [Search a 2D Matrix](/problem/search-a-2d-matrix), [Sentence Screen Fitting](/problem/sentence-screen-fitting)
