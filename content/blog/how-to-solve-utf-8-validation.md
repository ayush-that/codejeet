---
title: "How to Solve UTF-8 Validation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode UTF-8 Validation. Medium difficulty, 46.1% acceptance rate. Topics: Array, Bit Manipulation."
date: "2026-11-09"
category: "dsa-patterns"
tags: ["utf-8-validation", "array", "bit-manipulation", "medium"]
---

## How to Solve UTF-8 Validation

This problem asks us to validate whether an array of integers represents valid UTF-8 encoded characters. The tricky part is that UTF-8 uses a variable-length encoding scheme where the first byte tells us how many continuation bytes follow, and we need to validate this structure while processing the array sequentially.

## Visual Walkthrough

Let's trace through `data = [197, 130, 1]` which should return `true`:

1. **First byte (197)**: Binary is `11000101`
   - Check first bits: `110xxxxx` indicates a 2-byte character
   - So we expect 1 continuation byte after this
   - Remaining bytes needed: 1

2. **Second byte (130)**: Binary is `10000010`
   - Check first bits: `10xxxxxx` ✓ valid continuation byte
   - Remaining bytes needed: 0

3. **Third byte (1)**: Binary is `00000001`
   - Check first bits: `0xxxxxxx` indicates a 1-byte character
   - No continuation bytes needed
   - Remaining bytes needed: 0

4. End of array with no pending continuation bytes → valid UTF-8!

Now let's try an invalid example: `data = [235, 140, 4]`:

1. **First byte (235)**: Binary is `11101011`
   - Check first bits: `1110xxxx` indicates a 3-byte character
   - Expect 2 continuation bytes
   - Remaining bytes needed: 2

2. **Second byte (140)**: Binary is `10001100`
   - Check first bits: `10xxxxxx` ✓ valid continuation byte
   - Remaining bytes needed: 1

3. **Third byte (4)**: Binary is `00000100`
   - Check first bits: `0xxxxxxx` → NOT `10xxxxxx` ✗
   - Expected continuation byte but got start of new character
   - Invalid UTF-8!

## Brute Force Approach

A naive approach might try to pre-process the entire array, grouping bytes into characters based on their first byte patterns, then validating each group. However, this becomes messy because:

1. We might incorrectly group bytes if we misinterpret a continuation byte as a starting byte
2. We need to handle the case where a character spans beyond the array end
3. The validation needs to happen sequentially as we can't look ahead without knowing how many bytes each character uses

The brute force would essentially be the same as the optimal solution in terms of algorithm, but a candidate might try to convert all integers to binary strings first (inefficient) or use complex nested conditionals that are hard to debug.

## Optimized Approach

The key insight is that UTF-8 validation is a **stateful sequential process**:

- We process bytes one by one
- We maintain a counter of how many continuation bytes we expect
- Each byte tells us either:
  - Start of a new character (and how many continuation bytes to expect)
  - A continuation byte (if we're expecting one)
  - An invalid byte pattern

The clever bit manipulation technique:

- Use bit masks to check patterns without converting to strings:
  - `num >> 7 == 0`: 1-byte character (`0xxxxxxx`)
  - `num >> 5 == 0b110`: 2-byte character (`110xxxxx`)
  - `num >> 4 == 0b1110`: 3-byte character (`1110xxxx`)
  - `num >> 3 == 0b11110`: 4-byte character (`11110xxx`)
  - `num >> 6 == 0b10`: Continuation byte (`10xxxxxx`)

We process the array sequentially:

1. If we're not expecting continuation bytes, check what type of character starts here
2. If we are expecting continuation bytes, verify the current byte is a valid continuation
3. Track how many continuation bytes remain

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n = len(data) | Space: O(1)
def validUtf8(data):
    """
    Validate UTF-8 encoding using bit manipulation.
    Process bytes sequentially, tracking expected continuation bytes.
    """
    # Number of continuation bytes expected for current character
    remaining_bytes = 0

    for num in data:
        if remaining_bytes == 0:
            # We're at the start of a new character
            # Check what type of character this is
            if num >> 7 == 0:
                # 1-byte character: 0xxxxxxx
                remaining_bytes = 0
            elif num >> 5 == 0b110:
                # 2-byte character: 110xxxxx
                remaining_bytes = 1
            elif num >> 4 == 0b1110:
                # 3-byte character: 1110xxxx
                remaining_bytes = 2
            elif num >> 3 == 0b11110:
                # 4-byte character: 11110xxx
                remaining_bytes = 3
            else:
                # Invalid starting byte pattern
                return False
        else:
            # We're expecting continuation bytes
            # Continuation bytes must match pattern 10xxxxxx
            if num >> 6 != 0b10:
                return False
            # Decrement count of expected continuation bytes
            remaining_bytes -= 1

    # Valid if no continuation bytes are pending at the end
    return remaining_bytes == 0
```

```javascript
// Time: O(n) where n = data.length | Space: O(1)
function validUtf8(data) {
  // Track how many continuation bytes we expect
  let remainingBytes = 0;

  for (let i = 0; i < data.length; i++) {
    const num = data[i];

    if (remainingBytes === 0) {
      // Start of a new UTF-8 character
      if (num >> 7 === 0) {
        // 1-byte character: 0xxxxxxx
        remainingBytes = 0;
      } else if (num >> 5 === 0b110) {
        // 2-byte character: 110xxxxx
        remainingBytes = 1;
      } else if (num >> 4 === 0b1110) {
        // 3-byte character: 1110xxxx
        remainingBytes = 2;
      } else if (num >> 3 === 0b11110) {
        // 4-byte character: 11110xxx
        remainingBytes = 3;
      } else {
        // Invalid starting byte
        return false;
      }
    } else {
      // We're inside a multi-byte character
      // Continuation byte must be 10xxxxxx
      if (num >> 6 !== 0b10) {
        return false;
      }
      // One less continuation byte to expect
      remainingBytes--;
    }
  }

  // Valid only if we're not in the middle of a character
  return remainingBytes === 0;
}
```

```java
// Time: O(n) where n = data.length | Space: O(1)
class Solution {
    public boolean validUtf8(int[] data) {
        // Counter for expected continuation bytes
        int remainingBytes = 0;

        for (int num : data) {
            if (remainingBytes == 0) {
                // Determine character type from first byte
                if ((num >> 7) == 0) {
                    // 1-byte character: 0xxxxxxx
                    remainingBytes = 0;
                } else if ((num >> 5) == 0b110) {
                    // 2-byte character: 110xxxxx
                    remainingBytes = 1;
                } else if ((num >> 4) == 0b1110) {
                    // 3-byte character: 1110xxxx
                    remainingBytes = 2;
                } else if ((num >> 3) == 0b11110) {
                    // 4-byte character: 11110xxx
                    remainingBytes = 3;
                } else {
                    // Invalid starting byte pattern
                    return false;
                }
            } else {
                // Inside a multi-byte character
                // Check if this is a valid continuation byte (10xxxxxx)
                if ((num >> 6) != 0b10) {
                    return false;
                }
                // Decrement expected continuation count
                remainingBytes--;
            }
        }

        // Must not end in the middle of a character
        return remainingBytes == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each byte in the array exactly once
- Each byte requires constant-time bit operations (shifts and comparisons)
- No nested loops or recursive calls

**Space Complexity: O(1)**

- We only use a single integer variable (`remainingBytes`) to track state
- No additional data structures that grow with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Forgetting to check the final state**: After processing all bytes, you must verify `remainingBytes == 0`. Ending with pending continuation bytes means an incomplete character.

2. **Incorrect bit masks**: Using wrong shift amounts or comparison values. Remember:
   - `>> 7` checks if first bit is 0 (1-byte)
   - `>> 5` checks first 3 bits are `110` (2-byte)
   - `>> 4` checks first 4 bits are `1110` (3-byte)
   - `>> 3` checks first 5 bits are `11110` (4-byte)
   - `>> 6` checks first 2 bits are `10` (continuation)

3. **Not handling 5+ byte characters**: UTF-8 only allows 1-4 byte characters. Some candidates forget to reject bytes starting with `11111xxx`.

4. **Integer overflow with negative numbers**: In some languages, right shift on negative numbers preserves the sign bit. Always mask with `0xFF` if needed: `(num & 0xFF) >> 7`.

## When You'll See This Pattern

This problem combines **bit manipulation** with **state machine** or **sequential validation** patterns:

1. **String Decoding Problems**: Similar to [394. Decode String](https://leetcode.com/problems/decode-string/) where you maintain state (count, string builder) while processing sequentially.

2. **Parser/Validator Problems**: Like [65. Valid Number](https://leetcode.com/problems/valid-number/) where you validate format through state transitions.

3. **Bit Stream Processing**: Problems like [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) teach the bit manipulation techniques needed here.

The core pattern is: "Process input sequentially while maintaining minimal state to validate a structured format."

## Key Takeaways

1. **Bit masks are efficient for pattern matching**: Instead of converting to strings, use shift operators to check bit patterns directly.

2. **State machines simplify sequential validation**: When validation depends on previous elements, track just enough state (like `remainingBytes`) to make decisions.

3. **UTF-8 has clear hierarchical structure**: The first byte determines the "width" of the character, and continuation bytes have a fixed pattern. This makes it perfect for sequential processing.

[Practice this problem on CodeJeet](/problem/utf-8-validation)
