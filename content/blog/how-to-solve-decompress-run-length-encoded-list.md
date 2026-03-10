---
title: "How to Solve Decompress Run-Length Encoded List — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Decompress Run-Length Encoded List. Easy difficulty, 86.2% acceptance rate. Topics: Array."
date: "2027-12-30"
category: "dsa-patterns"
tags: ["decompress-run-length-encoded-list", "array", "easy"]
---

# How to Solve Decompress Run-Length Encoded List

This problem asks us to decompress a run-length encoded list. We're given a compressed array where elements appear in pairs: `[freq, val, freq, val, ...]`. For each pair, we need to output `val` repeated `freq` times, then concatenate all these sublists together. While conceptually simple, this problem tests your ability to work with array indices, handle edge cases, and implement straightforward transformations efficiently.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the input: `nums = [1, 2, 3, 4]`

**Step-by-step decomposition:**

1. The array has length 4, so we have 4/2 = 2 pairs
2. First pair: `i = 0` → `[nums[0], nums[1]] = [1, 2]`
   - This means: frequency = 1, value = 2
   - Output: `[2]` (2 repeated 1 time)
3. Second pair: `i = 1` → `[nums[2], nums[3]] = [3, 4]`
   - This means: frequency = 3, value = 4
   - Output: `[4, 4, 4]` (4 repeated 3 times)
4. Concatenate: `[2] + [4, 4, 4] = [2, 4, 4, 4]`

Another example: `nums = [5, 6]`

1. Only one pair: `[nums[0], nums[1]] = [5, 6]`
2. Output: `[6, 6, 6, 6, 6]` (6 repeated 5 times)

The pattern is clear: we process the array in steps of 2, reading frequency-value pairs, and building our result by repeating each value the specified number of times.

## Brute Force Approach

For this problem, there's essentially only one reasonable approach since the problem definition gives us the exact algorithm to implement. However, let's consider what a "naive" implementation might look like and potential pitfalls:

A truly naive approach might try to process the array incorrectly by:

- Not using the correct index increments (processing by 1 instead of 2)
- Trying to modify the input array in place (which doesn't work well)
- Using nested loops inefficiently

The straightforward solution is already optimal for this problem, but let's think about what makes it work: we need to iterate through pairs, extract frequency and value, then append the value to our result list the correct number of times.

## Optimal Solution

The optimal solution follows directly from the problem statement. We'll:

1. Initialize an empty result list
2. Iterate through the input array in steps of 2 (processing frequency-value pairs)
3. For each pair, extract frequency and value
4. Append the value to the result list `frequency` times
5. Return the result list

<div class="code-group">

```python
# Time: O(n) where n is the total length of decompressed array
# Space: O(n) for the output array
def decompressRLElist(nums):
    """
    Decompress a run-length encoded list.

    Args:
        nums: List of integers in [freq, val, freq, val, ...] format

    Returns:
        List of decompressed values
    """
    result = []  # Step 1: Initialize empty list to store decompressed values

    # Step 2: Iterate through the array in steps of 2
    # We use range(0, len(nums), 2) to get indices: 0, 2, 4, ...
    for i in range(0, len(nums), 2):
        freq = nums[i]      # Step 3a: Get frequency from even index
        val = nums[i + 1]   # Step 3b: Get value from odd index

        # Step 4: Append the value 'freq' times to result
        # Using list multiplication: [val] * freq creates a list with 'freq' copies of val
        # Then we extend result with this list
        result.extend([val] * freq)

    return result  # Step 5: Return the decompressed list
```

```javascript
// Time: O(n) where n is the total length of decompressed array
// Space: O(n) for the output array
function decompressRLElist(nums) {
  /**
   * Decompress a run-length encoded list.
   *
   * @param {number[]} nums - Array in [freq, val, freq, val, ...] format
   * @return {number[]} Decompressed array
   */
  const result = []; // Step 1: Initialize empty array to store decompressed values

  // Step 2: Iterate through the array in steps of 2
  // We start at i = 0, increment by 2 each time
  for (let i = 0; i < nums.length; i += 2) {
    const freq = nums[i]; // Step 3a: Get frequency from even index
    const val = nums[i + 1]; // Step 3b: Get value from odd index

    // Step 4: Append the value 'freq' times to result
    // Using a for loop to push the value 'freq' times
    for (let j = 0; j < freq; j++) {
      result.push(val);
    }
  }

  return result; // Step 5: Return the decompressed array
}
```

```java
// Time: O(n) where n is the total length of decompressed array
// Space: O(n) for the output array
public int[] decompressRLElist(int[] nums) {
    /**
     * Decompress a run-length encoded list.
     *
     * @param nums Array in [freq, val, freq, val, ...] format
     * @return Decompressed array
     */

    // Step 1: First, calculate the total length of the decompressed array
    // We need this to initialize our result array with the correct size
    int totalLength = 0;
    for (int i = 0; i < nums.length; i += 2) {
        totalLength += nums[i];  // Sum all frequencies
    }

    // Step 2: Initialize result array with the calculated size
    int[] result = new int[totalLength];
    int index = 0;  // Track current position in result array

    // Step 3: Iterate through the input array in steps of 2
    for (int i = 0; i < nums.length; i += 2) {
        int freq = nums[i];      // Step 3a: Get frequency from even index
        int val = nums[i + 1];   // Step 3b: Get value from odd index

        // Step 4: Fill result array with 'val' repeated 'freq' times
        for (int j = 0; j < freq; j++) {
            result[index] = val;  // Place value at current index
            index++;              // Move to next position
        }
    }

    return result;  // Step 5: Return the decompressed array
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the input array once (in steps of 2), which takes O(m) time where m is the length of the input array
- For each frequency-value pair, we append the value `freq` times to our result
- The total number of append operations equals the sum of all frequencies, which is exactly the length of the output array (n)
- Therefore, total time is O(m + n), but since m ≤ n (each pair contributes at least 1 to n), this simplifies to O(n)

**Space Complexity: O(n)**

- We need to store the decompressed result, which has length n (the sum of all frequencies)
- The auxiliary space (excluding output) is O(1) for pointers and loop variables
- Therefore, total space is O(n) for the output array

## Common Mistakes

1. **Index out of bounds errors**: Forgetting that the loop should increment by 2, not 1. If you use `i++` instead of `i += 2`, you'll try to access `nums[i+1]` when `i` is odd, causing an index error on the last iteration.

2. **Incorrect loop termination condition**: Using `i < len(nums) - 1` instead of `i < len(nums)` when incrementing by 2. Since we're stepping by 2, we need to check the starting index, not the ending index. The correct condition ensures we don't skip the last pair.

3. **Mixing up frequency and value**: Accidentally using `nums[i]` as the value and `nums[i+1]` as the frequency. Remember the pattern is always `[freq, val, freq, val, ...]`.

4. **Inefficient array construction in Python**: Using `result += [val] * freq` instead of `result.extend([val] * freq)`. While both work, `extend()` is more efficient for larger lists as it modifies the list in place rather than creating a new list.

5. **Not handling empty input**: While the problem guarantees at least 2 elements, in real interviews you might want to mention that you'd check for edge cases like empty arrays or arrays with odd length (though the problem states the input is valid).

## When You'll See This Pattern

This problem introduces **run-length encoding (RLE)**, a simple form of data compression that's used in various domains:

1. **String Compression (LeetCode #443)**: The inverse problem - compressing a string using run-length encoding. Instead of decompressing, you compress by counting consecutive characters.

2. **Image Processing**: RLE is used in simple image formats (like BMP) to compress images with large areas of the same color.

3. **Text and Data Compression**: While basic, RLE forms the foundation for more complex compression algorithms and appears in file formats like PDF and TIFF.

4. **Consecutive Element Problems**: Many array problems require processing consecutive elements or counting runs of identical values, which uses similar logic to RLE.

The core pattern here is **processing data in structured chunks** and **transforming between compressed and expanded representations**. Recognizing when data has a regular structure (like pairs in this case) is key to many array manipulation problems.

## Key Takeaways

1. **Pattern recognition**: When you see data in a regular alternating pattern (like `[freq, val, freq, val, ...]`), process it in steps rather than element-by-element. This often simplifies the logic and reduces errors.

2. **Output size calculation**: In some languages (like Java), you need to know the output size in advance. Calculating the sum of frequencies first is a common technique when working with fixed-size arrays.

3. **Trade-offs in implementation**: Different languages have different optimal approaches. In Python, `extend()` with list multiplication is clean and efficient. In JavaScript/Java, explicit loops are clearer. Choose the approach that's idiomatic for your language.

4. **Edge case awareness**: Always consider what happens with empty inputs, single elements, or malformed data, even if the problem statement guarantees valid input. Mentioning these shows thoroughness in an interview.

Related problems: [String Compression](/problem/string-compression)
