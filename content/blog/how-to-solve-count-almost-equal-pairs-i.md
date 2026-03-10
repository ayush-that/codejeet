---
title: "How to Solve Count Almost Equal Pairs I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Almost Equal Pairs I. Medium difficulty, 38.2% acceptance rate. Topics: Array, Hash Table, Sorting, Counting, Enumeration."
date: "2029-05-23"
category: "dsa-patterns"
tags: ["count-almost-equal-pairs-i", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Count Almost Equal Pairs I

This problem asks us to count pairs of integers in an array that can be made equal by swapping at most two digits within one of the numbers. The challenge lies in efficiently checking all possible digit swaps without resorting to O(n²) pairwise comparisons.

## Visual Walkthrough

Let's trace through an example: `nums = [123, 321, 132, 213]`

**Step 1: Understanding "almost equal"**
Two numbers are almost equal if:

1. They're already equal (trivial case)
2. We can swap two digits in one number to make it equal to the other

**Step 2: Check pair (123, 321)**

- Compare digits: 1↔3, 2↔2, 3↔1
- The digits that differ: positions 0 and 2
- Can we swap digits in 123 to get 321? Yes! Swap the 1 and 3 in 123 → 321
- This is a valid almost equal pair

**Step 3: Check pair (123, 132)**

- Compare digits: 1↔1, 2↔3, 3↔2
- The digits that differ: positions 1 and 2
- Swap the 2 and 3 in 123 → 132
- This is also a valid almost equal pair

**Step 4: Check pair (321, 213)**

- Compare digits: 3↔2, 2↔1, 1↔3
- The digits that differ: all three positions
- No single swap can fix all differences
- This is NOT an almost equal pair

**Key insight**: Two numbers are almost equal if:

- They have the same digit frequency (multiset of digits)
- They differ in at most 2 positions
- The digits at those positions are swapped versions of each other

## Brute Force Approach

The most straightforward approach is to check every pair (i, j) where i < j:

1. Convert both numbers to strings
2. Check if they're already equal → count as almost equal
3. If not, try all possible digit swaps in one number and see if it equals the other
4. Repeat for the other number

<div class="code-group">

```python
# Time: O(n² * m²) where n = len(nums), m = avg digits per number
# Space: O(m) for string conversion
def countAlmostEqualPairsBrute(nums):
    count = 0
    n = len(nums)

    for i in range(n):
        for j in range(i + 1, n):
            s1 = str(nums[i])
            s2 = str(nums[j])

            # Already equal
            if s1 == s2:
                count += 1
                continue

            # Try swapping digits in s1
            found = False
            for k in range(len(s1)):
                for l in range(k + 1, len(s1)):
                    # Create list to modify
                    s1_list = list(s1)
                    # Swap digits
                    s1_list[k], s1_list[l] = s1_list[l], s1_list[k]
                    # Check if equal to s2
                    if ''.join(s1_list) == s2:
                        found = True
                        break
                if found:
                    break

            if not found:
                # Try swapping digits in s2
                for k in range(len(s2)):
                    for l in range(k + 1, len(s2)):
                        s2_list = list(s2)
                        s2_list[k], s2_list[l] = s2_list[l], s2_list[k]
                        if ''.join(s2_list) == s1:
                            found = True
                            break
                    if found:
                        break

            if found:
                count += 1

    return count
```

```javascript
// Time: O(n² * m²) where n = nums.length, m = avg digits per number
// Space: O(m) for string conversion
function countAlmostEqualPairsBrute(nums) {
  let count = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const s1 = nums[i].toString();
      const s2 = nums[j].toString();

      // Already equal
      if (s1 === s2) {
        count++;
        continue;
      }

      // Try swapping digits in s1
      let found = false;
      for (let k = 0; k < s1.length; k++) {
        for (let l = k + 1; l < s1.length; l++) {
          const s1Arr = s1.split("");
          // Swap digits
          [s1Arr[k], s1Arr[l]] = [s1Arr[l], s1Arr[k]];
          if (s1Arr.join("") === s2) {
            found = true;
            break;
          }
        }
        if (found) break;
      }

      if (!found) {
        // Try swapping digits in s2
        for (let k = 0; k < s2.length; k++) {
          for (let l = k + 1; l < s2.length; l++) {
            const s2Arr = s2.split("");
            [s2Arr[k], s2Arr[l]] = [s2Arr[l], s2Arr[k]];
            if (s2Arr.join("") === s1) {
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }

      if (found) count++;
    }
  }

  return count;
}
```

```java
// Time: O(n² * m²) where n = nums.length, m = avg digits per number
// Space: O(m) for string conversion
public int countAlmostEqualPairsBrute(int[] nums) {
    int count = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            String s1 = Integer.toString(nums[i]);
            String s2 = Integer.toString(nums[j]);

            // Already equal
            if (s1.equals(s2)) {
                count++;
                continue;
            }

            // Try swapping digits in s1
            boolean found = false;
            for (int k = 0; k < s1.length(); k++) {
                for (int l = k + 1; l < s1.length(); l++) {
                    char[] s1Arr = s1.toCharArray();
                    // Swap digits
                    char temp = s1Arr[k];
                    s1Arr[k] = s1Arr[l];
                    s1Arr[l] = temp;
                    if (new String(s1Arr).equals(s2)) {
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            if (!found) {
                // Try swapping digits in s2
                for (int k = 0; k < s2.length(); k++) {
                    for (int l = k + 1; l < s2.length(); l++) {
                        char[] s2Arr = s2.toCharArray();
                        char temp = s2Arr[k];
                        s2Arr[k] = s2Arr[l];
                        s2Arr[l] = temp;
                        if (new String(s2Arr).equals(s1)) {
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
            }

            if (found) count++;
        }
    }

    return count;
}
```

</div>

**Why this is too slow**: For n numbers with m digits each, we have O(n²) pairs, and for each pair we try O(m²) swaps. This gives O(n²m²) which is too slow for typical constraints (n up to 1000, m up to 9).

## Optimized Approach

The key insight is that we can **normalize** each number to a canonical form that represents all numbers that are almost equal to it. Then we can use a hash map to count frequencies of these normalized forms.

**Observation**: Two numbers are almost equal if:

1. They have the same sorted digit multiset (same digits in any order)
2. They differ in at most 2 positions, and those positions contain swapped digits

**Normalization strategy**:

1. Sort the digits of the number → this handles same digit multiset
2. Also include the original number itself (for exact matches)
3. Generate all possible single-swap variations

**Algorithm**:

1. For each number, generate its "signature" set:
   - The sorted digit string
   - All strings formed by swapping any two digits
2. Use a hash map to count how many numbers share each signature
3. For each signature with count k, add k\*(k-1)/2 to the total (number of pairs)

**Why this works**: If two numbers are almost equal, they will share at least one common signature in our generated set. By counting frequencies of signatures, we efficiently count all pairs without O(n²) comparisons.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * m²) where n = len(nums), m = avg digits per number
# Space: O(n * m²) for storing all signatures
def countAlmostEqualPairs(nums):
    from collections import defaultdict

    # Dictionary to count occurrences of each signature
    signature_count = defaultdict(int)

    for num in nums:
        # Convert number to string for digit manipulation
        s = str(num)
        length = len(s)

        # Create a set to store unique signatures for this number
        signatures = set()

        # 1. Add the sorted version (handles same digit multiset)
        sorted_s = ''.join(sorted(s))
        signatures.add(sorted_s)

        # 2. Add the original number (handles exact matches)
        signatures.add(s)

        # 3. Generate all possible single-swap variations
        # Convert to list for mutable operations
        s_list = list(s)
        for i in range(length):
            for j in range(i + 1, length):
                # Create a copy to avoid modifying original
                swapped = s_list.copy()
                # Swap digits at positions i and j
                swapped[i], swapped[j] = swapped[j], swapped[i]
                # Convert back to string and add to signatures
                signatures.add(''.join(swapped))

        # Count each signature for this number
        for sig in signatures:
            signature_count[sig] += 1

    # Calculate total pairs
    total_pairs = 0
    for count in signature_count.values():
        # If k numbers share a signature, they form k*(k-1)/2 pairs
        total_pairs += count * (count - 1) // 2

    return total_pairs
```

```javascript
// Time: O(n * m²) where n = nums.length, m = avg digits per number
// Space: O(n * m²) for storing all signatures
function countAlmostEqualPairs(nums) {
  // Map to count occurrences of each signature
  const signatureCount = new Map();

  for (const num of nums) {
    // Convert number to string for digit manipulation
    const s = num.toString();
    const length = s.length;

    // Set to store unique signatures for this number
    const signatures = new Set();

    // 1. Add the sorted version (handles same digit multiset)
    const sortedS = s.split("").sort().join("");
    signatures.add(sortedS);

    // 2. Add the original number (handles exact matches)
    signatures.add(s);

    // 3. Generate all possible single-swap variations
    const sArr = s.split("");
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        // Create a copy to avoid modifying original
        const swapped = [...sArr];
        // Swap digits at positions i and j
        [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
        // Convert back to string and add to signatures
        signatures.add(swapped.join(""));
      }
    }

    // Count each signature for this number
    for (const sig of signatures) {
      signatureCount.set(sig, (signatureCount.get(sig) || 0) + 1);
    }
  }

  // Calculate total pairs
  let totalPairs = 0;
  for (const count of signatureCount.values()) {
    // If k numbers share a signature, they form k*(k-1)/2 pairs
    totalPairs += (count * (count - 1)) / 2;
  }

  return totalPairs;
}
```

```java
// Time: O(n * m²) where n = nums.length, m = avg digits per number
// Space: O(n * m²) for storing all signatures
public int countAlmostEqualPairs(int[] nums) {
    // Map to count occurrences of each signature
    Map<String, Integer> signatureCount = new HashMap<>();

    for (int num : nums) {
        // Convert number to string for digit manipulation
        String s = Integer.toString(num);
        int length = s.length();

        // Set to store unique signatures for this number
        Set<String> signatures = new HashSet<>();

        // 1. Add the sorted version (handles same digit multiset)
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String sortedS = new String(chars);
        signatures.add(sortedS);

        // 2. Add the original number (handles exact matches)
        signatures.add(s);

        // 3. Generate all possible single-swap variations
        char[] sArr = s.toCharArray();
        for (int i = 0; i < length; i++) {
            for (int j = i + 1; j < length; j++) {
                // Create a copy to avoid modifying original
                char[] swapped = sArr.clone();
                // Swap digits at positions i and j
                char temp = swapped[i];
                swapped[i] = swapped[j];
                swapped[j] = temp;
                // Convert back to string and add to signatures
                signatures.add(new String(swapped));
            }
        }

        // Count each signature for this number
        for (String sig : signatures) {
            signatureCount.put(sig, signatureCount.getOrDefault(sig, 0) + 1);
        }
    }

    // Calculate total pairs
    int totalPairs = 0;
    for (int count : signatureCount.values()) {
        // If k numbers share a signature, they form k*(k-1)/2 pairs
        totalPairs += count * (count - 1) / 2;
    }

    return totalPairs;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × m²)

- For each of n numbers, we generate O(m²) signatures (all possible swaps)
- Sorting digits takes O(m log m), but m ≤ 9, so this is effectively constant
- Hash map operations are O(1) on average
- Total: O(n × m²)

**Space Complexity**: O(n × m²)

- We store up to O(m²) signatures per number
- Each signature is a string of length m
- In practice, many signatures will be duplicates across numbers, but worst case is O(n × m²)

Since m ≤ 9 (numbers are positive integers), m² ≤ 81, which is effectively constant. So we can think of this as O(n) time and O(n) space for practical purposes.

## Common Mistakes

1. **Forgetting to include the original number in signatures**: Without this, exact matches won't be counted as almost equal pairs. Remember: "at most one swap" includes zero swaps.

2. **Not using a set for per-number signatures**: If a number generates duplicate signatures (e.g., swapping identical digits), counting them multiple times would overcount pairs. Always use a set to deduplicate before adding to the global count.

3. **Incorrect pair counting formula**: After counting frequencies, some candidates try to sum frequencies directly instead of using k×(k-1)/2. Remember: if k numbers share a signature, they form k choose 2 = k×(k-1)/2 pairs.

4. **Missing the sorted digit signature**: Two numbers like 123 and 321 have different single-swap signatures but the same sorted signature. Without including sorted versions, we'd miss such pairs.

## When You'll See This Pattern

This "signature normalization" pattern appears in many grouping/counting problems:

1. **Group Anagrams (LeetCode 49)**: Use sorted string as signature to group words with same letters.
2. **Find Duplicate Subtrees (LeetCode 652)**: Use serialized tree structure as signature to identify duplicate subtrees.
3. **Palindrome Pairs (LeetCode 336)**: Use string reversal and prefix/suffix as signatures to find palindrome pairs.

The core idea is to transform each element into one or more canonical forms that capture the equivalence relation we care about, then use hashing to group and count.

## Key Takeaways

1. **Normalization is powerful**: When checking complex equivalence relations, transform elements to canonical forms that make equality checking trivial.

2. **Trade computation for hashing**: Generating multiple signatures per element (O(m²)) and using O(1) hash lookups is often better than O(n²) pairwise comparisons.

3. **Consider all cases in definition**: "At most one swap" includes zero swaps (exact equality) and one swap. Make sure your solution handles both.

Related problems: [Check if One String Swap Can Make Strings Equal](/problem/check-if-one-string-swap-can-make-strings-equal)
