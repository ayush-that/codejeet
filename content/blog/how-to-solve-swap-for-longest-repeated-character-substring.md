---
title: "How to Solve Swap For Longest Repeated Character Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Swap For Longest Repeated Character Substring. Medium difficulty, 44.2% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2028-11-17"
category: "dsa-patterns"
tags:
  [
    "swap-for-longest-repeated-character-substring",
    "hash-table",
    "string",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Swap For Longest Repeated Character Substring

This problem asks: given a string, you can swap any two characters exactly once, and you want to maximize the length of a substring where all characters are identical. The twist is that you're not actually performing the swap—you're calculating the maximum possible length you could achieve with an optimal single swap. This makes it interesting because you need to think about character frequencies, gaps between same-character blocks, and whether a swap can connect separated segments.

## Visual Walkthrough

Let's trace through `text = "aaabaaa"`:

1. First, identify all blocks of consecutive identical characters:
   - `"aaa"` (positions 0-2)
   - `"b"` (position 3)
   - `"aaa"` (positions 4-6)

2. For each character type, we need to consider:
   - **Character 'a'**: Has two blocks with total count 6 (3 + 3)
   - **Character 'b'**: Has one block with total count 1

3. The key insight: We can extend an 'a' block in two ways:
   - **Case 1**: Use a swap to fill the single 'b' gap between the two 'a' blocks
     - Current blocks: `"aaa"` + `"b"` + `"aaa"`
     - If we swap the 'b' with an 'a' from somewhere else, we could potentially connect them
     - But we need another 'a' available to swap with the 'b'
     - Total 'a' count is 6, and we have 6 'a's in the string
     - If we use one 'a' to swap with the 'b', we'd connect the blocks: `"aaaaaa"` (length 6)
     - Wait—we actually have exactly enough 'a's! The two blocks total 6, and there are no other 'a's elsewhere

4. Let's check the actual calculation:
   - For the first 'a' block (length 3), look one position past it: position 3 is 'b'
   - Check if we can extend by swapping that 'b' with an 'a' from somewhere
   - Total 'a's in string = 6
   - Current block uses 3 'a's
   - Are there other 'a's available? Yes, 3 more in the second block
   - So we can swap the 'b' with one of those 'a's
   - Result: `"aaa"` + `"a"` + `"aaa"` = `"aaaaaa"` (length 6)

5. But there's a catch: What if all 'a's are already in these two blocks? Then swapping within them doesn't give us an extra 'a' from elsewhere. Actually, in this case, we're taking an 'a' from the second block to swap with the 'b', so the second block loses one 'a' but gains it back by connecting. The total length becomes 6.

The answer for `"aaabaaa"` is 6.

## Brute Force Approach

A naive approach would be to try all possible swaps and for each swap, find the longest repeated character substring. Here's how that would work:

1. Generate all pairs of indices `(i, j)` where `i < j`
2. For each pair, swap `text[i]` and `text[j]`
3. Scan the modified string to find the longest substring of identical characters
4. Track the maximum length found

This approach has O(n³) time complexity: O(n²) swap pairs × O(n) to scan each modified string. For n up to 10⁵ (typical constraint), this is completely infeasible.

Even a slightly better brute force—trying to extend each position without actually swapping—would still be inefficient if not carefully designed. The problem requires us to think in terms of character blocks and available reserves.

## Optimized Approach

The key insight is that we don't need to actually try every swap. Instead, we can analyze the string in terms of:

1. **Blocks**: Consecutive runs of the same character
2. **Total counts**: How many of each character exist in the entire string
3. **Gaps**: Single characters separating blocks of the same character

For each character, we consider two main cases:

**Case 1: Extending a block by filling a single-character gap**

- If we have a block of character `c`, followed by exactly one different character, then another block of `c`
- We can potentially swap that single different character with another `c` from somewhere
- The new length would be `len(block1) + 1 + len(block2)`
- But only if there's at least one more `c` somewhere else to swap with

**Case 2: Extending a block by borrowing from reserves**

- If we have a block of character `c` that could be extended if we had more `c`s
- The maximum extension is limited by the total count of `c` in the string
- We can get `min(total_count_c, len(block) + 1)` if we can find a `c` to swap with a neighboring character

**Special consideration**: What if the gap is more than one character? Then a single swap can't connect the blocks, so we can only extend by at most 1 (by swapping a neighboring character with another `c` from elsewhere).

The algorithm:

1. Count total frequency of each character
2. Identify all blocks of consecutive identical characters
3. For each block, calculate how much it can be extended
4. Track the maximum possible length

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxRepOpt1(text: str) -> int:
    """
    Returns the length of the longest substring with repeated characters
    after at most one swap operation.

    Approach:
    1. First pass: Count total frequency of each character
    2. Second pass: Identify blocks of consecutive identical characters
    3. For each block, calculate maximum possible extension considering:
       - Single-character gaps between same-character blocks
       - Available reserves of the same character elsewhere
    """
    n = len(text)
    if n == 0:
        return 0

    # Step 1: Count total frequency of each character
    total_count = {}
    for ch in text:
        total_count[ch] = total_count.get(ch, 0) + 1

    # Step 2: Identify blocks of consecutive identical characters
    blocks = []
    i = 0
    while i < n:
        j = i
        while j < n and text[j] == text[i]:
            j += 1
        blocks.append((text[i], i, j - 1))  # (character, start, end)
        i = j

    max_len = 0

    # Step 3: Process each block to find maximum possible extension
    for idx, (ch, start, end) in enumerate(blocks):
        block_len = end - start + 1

        # Case A: Can we extend this block using reserves?
        # If we have more 'ch' characters elsewhere, we can extend by 1
        # by swapping a neighboring character with one of those reserves
        if total_count[ch] > block_len:
            # We can potentially extend by 1 if there's a reserve character
            max_len = max(max_len, block_len + 1)
        else:
            # No reserves, this block is already at maximum
            max_len = max(max_len, block_len)

        # Case B: Can we connect this block with the next same-character block?
        # This requires exactly one different character between them
        if idx + 1 < len(blocks):
            next_ch, next_start, next_end = blocks[idx + 1]

            # Check if there's exactly one character between the blocks
            # and if that character is different (which it always is since
            # we grouped consecutive same characters)
            if next_start == end + 2 and next_ch == ch:
                middle_len = next_end - next_start + 1
                total_len = block_len + 1 + middle_len

                # Do we have enough reserves to make the swap?
                # We need at least one extra 'ch' to swap with the middle character
                if total_count[ch] > total_len - 1:
                    # We can use a reserve to replace the middle character
                    max_len = max(max_len, total_len)
                else:
                    # No reserves, we can still connect but lose one from somewhere
                    max_len = max(max_len, total_len - 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Returns the length of the longest substring with repeated characters
 * after at most one swap operation.
 *
 * @param {string} text - Input string
 * @return {number} Maximum length achievable with one swap
 */
function maxRepOpt1(text) {
  const n = text.length;
  if (n === 0) return 0;

  // Step 1: Count total frequency of each character
  const totalCount = new Map();
  for (const ch of text) {
    totalCount.set(ch, (totalCount.get(ch) || 0) + 1);
  }

  // Step 2: Identify blocks of consecutive identical characters
  const blocks = [];
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n && text[j] === text[i]) {
      j++;
    }
    blocks.push({ ch: text[i], start: i, end: j - 1 });
    i = j;
  }

  let maxLen = 0;

  // Step 3: Process each block to find maximum possible extension
  for (let idx = 0; idx < blocks.length; idx++) {
    const { ch, start, end } = blocks[idx];
    const blockLen = end - start + 1;

    // Case A: Can we extend this block using reserves?
    if (totalCount.get(ch) > blockLen) {
      // We can extend by 1 using a reserve character
      maxLen = Math.max(maxLen, blockLen + 1);
    } else {
      // No reserves available
      maxLen = Math.max(maxLen, blockLen);
    }

    // Case B: Can we connect this block with the next same-character block?
    if (idx + 1 < blocks.length) {
      const next = blocks[idx + 1];

      // Check if there's exactly one character between the blocks
      // and if the next block has the same character
      if (next.start === end + 2 && next.ch === ch) {
        const middleLen = next.end - next.start + 1;
        const totalLen = blockLen + 1 + middleLen;

        // Check if we have enough reserves to make the swap
        if (totalCount.get(ch) > totalLen - 1) {
          // We can use a reserve to replace the middle character
          maxLen = Math.max(maxLen, totalLen);
        } else {
          // No reserves, we lose one character in the connection
          maxLen = Math.max(maxLen, totalLen - 1);
        }
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maxRepOpt1(String text) {
        int n = text.length();
        if (n == 0) return 0;

        // Step 1: Count total frequency of each character
        int[] totalCount = new int[26];
        for (char c : text.toCharArray()) {
            totalCount[c - 'a']++;
        }

        // Step 2: Identify blocks of consecutive identical characters
        // Each block is represented as {character, start, end}
        List<int[]> blocks = new ArrayList<>();
        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && text.charAt(j) == text.charAt(i)) {
                j++;
            }
            blocks.add(new int[]{text.charAt(i) - 'a', i, j - 1});
            i = j;
        }

        int maxLen = 0;

        // Step 3: Process each block to find maximum possible extension
        for (int idx = 0; idx < blocks.size(); idx++) {
            int[] block = blocks.get(idx);
            int ch = block[0];
            int start = block[1];
            int end = block[2];
            int blockLen = end - start + 1;

            // Case A: Can we extend this block using reserves?
            if (totalCount[ch] > blockLen) {
                // We can extend by 1 using a reserve character
                maxLen = Math.max(maxLen, blockLen + 1);
            } else {
                // No reserves available
                maxLen = Math.max(maxLen, blockLen);
            }

            // Case B: Can we connect this block with the next same-character block?
            if (idx + 1 < blocks.size()) {
                int[] nextBlock = blocks.get(idx + 1);
                int nextCh = nextBlock[0];
                int nextStart = nextBlock[1];
                int nextEnd = nextBlock[2];

                // Check if there's exactly one character between the blocks
                // and if the next block has the same character
                if (nextStart == end + 2 && nextCh == ch) {
                    int middleLen = nextEnd - nextStart + 1;
                    int totalLen = blockLen + 1 + middleLen;

                    // Check if we have enough reserves to make the swap
                    if (totalCount[ch] > totalLen - 1) {
                        // We can use a reserve to replace the middle character
                        maxLen = Math.max(maxLen, totalLen);
                    } else {
                        // No reserves, we lose one character in the connection
                        maxLen = Math.max(maxLen, totalLen - 1);
                    }
                }
            }
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting character frequencies: O(n)
- Identifying blocks: O(n) (each character visited once)
- Processing blocks: O(number of blocks) ≤ O(n)
- Total: O(n)

**Space Complexity: O(n)**

- Character frequency count: O(26) = O(1) for fixed alphabet, but we use O(n) in worst case if we consider Unicode
- Storing blocks: O(number of blocks) ≤ O(n)
- Total: O(n) in worst case

The linear time complexity comes from our single-pass block identification and the fact that we only consider adjacent blocks for connection opportunities.

## Common Mistakes

1. **Forgetting to check available reserves**: The most common error is trying to extend a block without verifying if there are additional characters of that type elsewhere in the string. Always compare `block_len` with `total_count[ch]`.

2. **Incorrect gap handling**: Candidates often miss the case where there's exactly one character between two same-character blocks. This is the only case where a single swap can connect two blocks. Gaps of length > 1 cannot be fully bridged with one swap.

3. **Off-by-one errors in block connection**: When calculating the total length after connecting blocks, remember that the single character in the middle gets replaced, so the formula is `block1_len + 1 + block2_len`, not `block1_len + block2_len`.

4. **Not considering the "borrow from within" case**: When connecting two blocks with no reserves, you can still connect them by taking a character from one of the blocks to swap with the middle character. This gives `total_len - 1` instead of `total_len`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window/Two Pointers**: The block identification uses a two-pointer approach to find consecutive runs.

2. **Frequency Counting with Constraints**: Similar to problems like:
   - **Longest Repeating Character Replacement** (LeetCode 424): Replace characters to form longest repeating substring
   - **Max Consecutive Ones III** (LeetCode 1004): Flip zeros to get longest consecutive ones
   - Both involve modifying a limited number of elements to maximize a consecutive sequence

3. **Segment Analysis**: Breaking a string into segments/blocks appears in:
   - **Swap Adjacent in LR String** (LeetCode 777): Analyzing movable segments
   - **Group Anagrams**: Grouping similar elements together

The core pattern is: when you need to maximize a consecutive sequence with limited modifications, consider breaking the input into blocks and analyzing what modifications can connect or extend them.

## Key Takeaways

1. **Think in blocks, not individual characters**: When dealing with consecutive sequences, it's more efficient to work with blocks of identical elements rather than processing each character individually.

2. **Consider both local and global information**: You need both the local block lengths and the global character frequencies to determine what's possible with a swap.

3. **Single swaps have limited power**: A single swap can either extend a block by 1 (using a reserve) or connect two blocks separated by exactly one different character. Recognizing these two cases simplifies the problem.

[Practice this problem on CodeJeet](/problem/swap-for-longest-repeated-character-substring)
