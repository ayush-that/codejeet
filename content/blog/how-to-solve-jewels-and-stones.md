---
title: "How to Solve Jewels and Stones — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Jewels and Stones. Easy difficulty, 89.5% acceptance rate. Topics: Hash Table, String."
date: "2026-08-04"
category: "dsa-patterns"
tags: ["jewels-and-stones", "hash-table", "string", "easy"]
---

# How to Solve Jewels and Stones

This problem asks you to count how many characters in the `stones` string appear in the `jewels` string. While conceptually simple, it's an excellent introduction to using hash sets for efficient membership testing—a pattern that appears in countless interview problems. The "trick" is recognizing that checking if each stone is a jewel by scanning the jewels string for every stone is inefficient, and that we can optimize by first storing jewels in a structure that allows O(1) lookups.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `jewels = "aA"`, `stones = "aAAbbbb"`

**Goal:** Count how many characters in `stones` are also in `jewels`.

**Step-by-step:**

1. First, identify what counts as a jewel: characters 'a' and 'A'
2. Now examine each stone one by one:
   - Stone 1: 'a' → Is 'a' in jewels? Yes → count = 1
   - Stone 2: 'A' → Is 'A' in jewels? Yes → count = 2
   - Stone 3: 'A' → Is 'A' in jewels? Yes → count = 3
   - Stone 4: 'b' → Is 'b' in jewels? No → count stays 3
   - Stone 5: 'b' → Is 'b' in jewels? No → count stays 3
   - Stone 6: 'b' → Is 'b' in jewels? No → count stays 3
   - Stone 7: 'b' → Is 'b' in jewels? No → count stays 3

**Result:** 3 stones are jewels.

The key insight: We need to check membership (is this stone a jewel?) many times. Doing this efficiently requires pre-processing the jewels.

## Brute Force Approach

The most straightforward approach is to check each stone against every jewel:

For each stone in `stones`:

- Check if it exists in `jewels` by scanning the entire `jewels` string
- If found, increment our count

**Why this is inefficient:**

- Time complexity: O(s × j) where s = length of stones, j = length of jewels
- For each of s stones, we potentially scan all j jewels
- With typical constraints (strings up to length 50), this might pass, but it doesn't scale well and shows poor algorithmic thinking

**Brute force code:**

```python
def numJewelsInStones_brute(jewels, stones):
    count = 0
    for stone in stones:
        for jewel in jewels:
            if stone == jewel:
                count += 1
                break  # Found it, no need to check rest of jewels
    return count
```

The problem with this approach becomes apparent with larger inputs. If both strings are length 10,000, we'd need 100 million operations!

## Optimal Solution

The optimal solution uses a hash set to store jewels for O(1) lookup time. Here's the thought process:

1. **Pre-process jewels:** Convert the jewels string into a set for fast membership testing
2. **Count jewels:** Iterate through stones, checking if each stone is in the jewels set
3. **Return count:** Sum up all matches

This approach runs in O(j + s) time: O(j) to build the set, O(s) to check all stones.

<div class="code-group">

```python
# Time: O(j + s) where j = len(jewels), s = len(stones)
# Space: O(j) for the jewels set
def numJewelsInStones(jewels, stones):
    """
    Count how many stones are also jewels.

    Args:
        jewels (str): String containing jewel characters
        stones (str): String containing stone characters

    Returns:
        int: Number of stones that are jewels
    """
    # Step 1: Create a set of jewels for O(1) membership testing
    # Sets in Python provide average O(1) lookup time
    jewel_set = set(jewels)

    # Step 2: Initialize counter for jewels found in stones
    count = 0

    # Step 3: Iterate through each stone character
    for stone in stones:
        # Check if the current stone is a jewel
        if stone in jewel_set:
            # Increment count if stone is a jewel
            count += 1

    # Step 4: Return the total count
    return count
```

```javascript
// Time: O(j + s) where j = jewels.length, s = stones.length
// Space: O(j) for the jewels set
function numJewelsInStones(jewels, stones) {
  /**
   * Count how many stones are also jewels.
   *
   * @param {string} jewels - String containing jewel characters
   * @param {string} stones - String containing stone characters
   * @return {number} Number of stones that are jewels
   */

  // Step 1: Create a Set of jewels for O(1) membership testing
  // JavaScript Sets provide O(1) average case lookup
  const jewelSet = new Set(jewels);

  // Step 2: Initialize counter for jewels found in stones
  let count = 0;

  // Step 3: Iterate through each character in stones
  for (let i = 0; i < stones.length; i++) {
    const stone = stones[i];

    // Check if the current stone is a jewel
    if (jewelSet.has(stone)) {
      // Increment count if stone is a jewel
      count++;
    }
  }

  // Step 4: Return the total count
  return count;
}
```

```java
// Time: O(j + s) where j = jewels.length(), s = stones.length()
// Space: O(j) for the jewels set
class Solution {
    public int numJewelsInStones(String jewels, String stones) {
        /**
         * Count how many stones are also jewels.
         *
         * @param jewels String containing jewel characters
         * @param stones String containing stone characters
         * @return Number of stones that are jewels
         */

        // Step 1: Create a HashSet of jewels for O(1) membership testing
        // HashSets provide O(1) average case lookup time
        Set<Character> jewelSet = new HashSet<>();

        // Add each character from jewels to the set
        for (int i = 0; i < jewels.length(); i++) {
            jewelSet.add(jewels.charAt(i));
        }

        // Step 2: Initialize counter for jewels found in stones
        int count = 0;

        // Step 3: Iterate through each character in stones
        for (int i = 0; i < stones.length(); i++) {
            char stone = stones.charAt(i);

            // Check if the current stone is a jewel
            if (jewelSet.contains(stone)) {
                // Increment count if stone is a jewel
                count++;
            }
        }

        // Step 4: Return the total count
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(j + s)**

- **O(j):** Building the hash set from the jewels string. We iterate through all j characters once.
- **O(s):** Checking each stone against the set. Each lookup is O(1) on average, so s lookups take O(s) time.
- The total is O(j + s), which is linear in the combined input size.

**Space Complexity: O(j)**

- We store each unique jewel character in a hash set. In the worst case (all jewels are unique), this requires O(j) space.
- The stones string is only read, not stored, so it doesn't contribute to space complexity beyond the input itself.

**Why this is optimal:**

- We must at least look at every character in both strings once to solve the problem, so O(j + s) is the best possible time complexity.
- The hash set gives us the fastest possible lookup time for checking if a stone is a jewel.

## Common Mistakes

1. **Using a list instead of a set for jewels:** Some candidates convert jewels to a list and use `in` operator, which is O(j) per lookup instead of O(1). This results in O(j × s) time complexity—the same as the brute force approach.

2. **Forgetting that characters are case-sensitive:** The problem explicitly states letters are case-sensitive, so 'a' and 'A' are different. Always read problem constraints carefully.

3. **Incorrect iteration boundaries:** When using index-based loops, off-by-one errors can occur. Using `for stone in stones:` (Python) or `for (char stone : stones.toCharArray())` (Java) avoids this.

4. **Not handling empty strings:** Both jewels and stones can be empty. The solution should handle these cases correctly (returning 0). Our solution does this naturally since an empty jewels set means no stones will match.

5. **Over-optimizing prematurely:** Some candidates try to use bit manipulation or arrays of size 128 (for ASCII), but the hash set solution is cleaner, more readable, and works for any Unicode character.

## When You'll See This Pattern

The "convert to set for fast lookups" pattern appears in many problems where you need to check membership efficiently:

1. **Two Sum (LeetCode #1):** Store seen numbers in a hash map to quickly check if their complement exists.
2. **Contains Duplicate (LeetCode #217):** Use a set to track seen numbers and detect duplicates in O(n) time.
3. **Intersection of Two Arrays (LeetCode #349):** Convert one array to a set, then check which elements from the other array are in the set.
4. **Longest Substring Without Repeating Characters (LeetCode #3):** Use a set to track characters in the current window for O(1) duplicate checks.

The core idea is always the same: when you need to check "is this element in that collection?" many times, first convert the collection to a hash-based structure for O(1) lookups.

## Key Takeaways

1. **Hash sets transform O(n) lookups into O(1):** Whenever you need to check membership repeatedly, consider storing elements in a hash set first. The upfront cost of building the set pays off with faster lookups.

2. **Pre-processing is often the key to optimization:** Don't just work with raw input data—transform it into a structure that supports your algorithm's needs. Think about what operations you'll perform most frequently.

3. **Read constraints carefully:** This problem explicitly mentions case sensitivity. Many string problems have similar nuances (Unicode vs ASCII, empty strings, etc.) that affect your solution.

4. **Start with brute force, then optimize:** Even for easy problems, walking through the brute force solution helps you identify the bottleneck (repeated membership checks) and choose the right optimization (hash set).

[Practice this problem on CodeJeet](/problem/jewels-and-stones)
