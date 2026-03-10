---
title: "How to Solve The Number of Weak Characters in the Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The Number of Weak Characters in the Game. Medium difficulty, 44.5% acceptance rate. Topics: Array, Stack, Greedy, Sorting, Monotonic Stack."
date: "2027-02-27"
category: "dsa-patterns"
tags: ["the-number-of-weak-characters-in-the-game", "array", "stack", "greedy", "medium"]
---

# How to Solve "The Number of Weak Characters in the Game"

You're given an array of characters where each has an attack and defense value. A character is **weak** if there exists another character with strictly greater attack **and** strictly greater defense. Your task is to count how many characters are weak. The challenge lies in efficiently checking these two-dimensional comparisons without comparing every pair—which would be too slow for large inputs.

What makes this problem interesting is that it looks like a simple comparison problem, but the optimal solution requires clever sorting and a single-pass approach. Many candidates try to sort by one attribute and brute force check the other, but they miss the critical insight about handling equal attack values correctly.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `properties = [[5,5],[6,3],[3,6],[7,2]]`

We need to find characters where another character has both higher attack AND higher defense.

**Step-by-step manual check:**

- Character [5,5]: Compare with [6,3] → attack higher but defense lower ❌. Compare with [3,6] → attack lower ❌. Compare with [7,2] → attack higher but defense lower ❌. Not weak.
- Character [6,3]: Compare with [5,5] → attack higher but defense lower ❌. Compare with [3,6] → attack higher but defense lower ❌. Compare with [7,2] → attack higher but defense lower ❌. Not weak.
- Character [3,6]: Compare with [5,5] → attack lower ❌. Compare with [6,3] → attack higher but defense lower ❌. Compare with [7,2] → attack higher but defense lower ❌. Not weak.
- Character [7,2]: Compare with [5,5] → attack higher but defense lower ❌. Compare with [6,3] → attack higher but defense lower ❌. Compare with [3,6] → attack higher but defense lower ❌. Not weak.

**Result:** 0 weak characters.

Now let's try another example: `[[2,2],[3,3],[1,4],[4,1]]`

- [2,2]: Compare with [3,3] → both higher ✅ → WEAK!
- [3,3]: Compare with [2,2] → both higher ❌. Compare with [1,4] → attack higher but defense lower ❌. Compare with [4,1] → attack higher but defense lower ❌. Not weak.
- [1,4]: Compare with [2,2] → attack higher but defense lower ❌. Compare with [3,3] → attack higher but defense lower ❌. Compare with [4,1] → attack higher but defense lower ❌. Not weak.
- [4,1]: Compare with [2,2] → attack higher but defense lower ❌. Compare with [3,3] → attack higher but defense lower ❌. Compare with [1,4] → attack higher but defense lower ❌. Not weak.

**Result:** 1 weak character.

The key insight: If we sort characters by attack in **descending** order, then for any character we encounter, all characters before it have **equal or greater** attack. We just need to track the **maximum defense seen so far** to know if there's someone with both higher attack AND defense.

## Brute Force Approach

The most straightforward solution is to compare every pair of characters:

For each character i, check if there exists any character j where:

- `attack[j] > attack[i]` AND `defense[j] > defense[i]`

If such a j exists, character i is weak.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numberOfWeakCharacters(properties):
    """
    Brute force solution - checks every pair
    """
    n = len(properties)
    weak_count = 0

    # For each character
    for i in range(n):
        is_weak = False

        # Compare with every other character
        for j in range(n):
            if i == j:
                continue

            # Check if character j dominates character i
            if (properties[j][0] > properties[i][0] and
                properties[j][1] > properties[i][1]):
                is_weak = True
                break  # Found a dominator, no need to check further

        if is_weak:
            weak_count += 1

    return weak_count
```

```javascript
// Time: O(n²) | Space: O(1)
function numberOfWeakCharacters(properties) {
  /**
   * Brute force solution - checks every pair
   */
  let weakCount = 0;
  const n = properties.length;

  // For each character
  for (let i = 0; i < n; i++) {
    let isWeak = false;

    // Compare with every other character
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      // Check if character j dominates character i
      if (properties[j][0] > properties[i][0] && properties[j][1] > properties[i][1]) {
        isWeak = true;
        break; // Found a dominator, no need to check further
      }
    }

    if (isWeak) weakCount++;
  }

  return weakCount;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numberOfWeakCharacters(int[][] properties) {
    /**
     * Brute force solution - checks every pair
     */
    int weakCount = 0;
    int n = properties.length;

    // For each character
    for (int i = 0; i < n; i++) {
        boolean isWeak = false;

        // Compare with every other character
        for (int j = 0; j < n; j++) {
            if (i == j) continue;

            // Check if character j dominates character i
            if (properties[j][0] > properties[i][0] &&
                properties[j][1] > properties[i][1]) {
                isWeak = true;
                break;  // Found a dominator, no need to check further
            }
        }

        if (isWeak) weakCount++;
    }

    return weakCount;
}
```

</div>

**Why this is insufficient:** With n up to 10⁵, O(n²) operations would be 10¹⁰, which is far too slow. We need an O(n log n) or O(n) solution.

## Optimized Approach

The key insight is to **sort strategically** and then make a **single pass**:

1. **Sort by attack in descending order, and for equal attacks, sort defense in ascending order**
   - Why descending attack? So when we iterate, all characters we've seen have ≥ current attack
   - Why ascending defense for equal attacks? To prevent characters with same attack from counting each other as weak (since attack must be strictly greater)

2. **Track the maximum defense seen so far**
   - As we iterate through sorted characters, keep a running maximum of defense values
   - For each character, if its defense is less than the current maximum defense, it means:
     - There exists a character before it with higher or equal attack (due to sorting)
     - AND that character has strictly higher defense (since we track max defense)
     - But wait—what about equal attack? That's why we sorted equal attacks by ascending defense!

3. **The clever part:** When attacks are equal and we sorted defense ascending, the "max defense" from previous characters with same attack won't trigger false positives, because:
   - If two characters have same attack, the one with lower defense comes first (ascending order)
   - When we process the higher defense one later, max defense has already been updated
   - So higher defense character won't be marked weak by someone with same attack

Let's trace the optimized approach with an example:

`properties = [[7,9],[10,7],[6,9],[10,4],[4,5],[4,10]]`

**Step 1: Sort**
Sort by attack descending, defense ascending:
`[[10,7],[10,4],[7,9],[6,9],[4,5],[4,10]]`

**Step 2: Single pass**

- Initialize `max_defense = 0`, `weak_count = 0`
- [10,7]: defense 7 > max_defense 0 → update max_defense = 7
- [10,4]: defense 4 < max_defense 7 → WEAK! (attack equal but defense lower doesn't count as weak? Actually no—[10,7] has same attack, so [10,4] shouldn't be weak. But wait, our algorithm says it is! This reveals a subtlety...)

Actually, I need to correct this. The standard solution has a subtle bug if we don't handle equal attacks properly. Let me think...

The correct logic: When we encounter [10,4], max_defense is 7 from [10,7]. But [10,7] has the SAME attack as [10,4], so [10,4] should NOT be weak (attack must be strictly greater). Our sorting trick handles this!

We sort equal attacks by ascending defense. So for attack=10, we get [10,4] then [10,7]. When we process [10,4], max_defense is 0 (from previous attack groups). When we process [10,7], max_defense is 4 (from [10,4]), so defense 7 > 4, update max_defense to 7.

Actually, let me trace this correctly:

Sorted: `[[10,4],[10,7],[7,9],[6,9],[4,5],[4,10]]`

- max_defense = 0
- [10,4]: defense 4 > max_defense 0 → update max_defense = 4
- [10,7]: defense 7 > max_defense 4 → update max_defense = 7
- [7,9]: defense 9 > max_defense 7 → update max_defense = 9
- [6,9]: defense 9 = max_defense 9 → NOT weak, update max_defense = 9
- [4,5]: defense 5 < max_defense 9 → WEAK!
- [4,10]: defense 10 > max_defense 9 → update max_defense = 10

Result: 1 weak character ([4,5]), which is correct!

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def numberOfWeakCharacters(properties):
    """
    Optimal solution using sorting and single pass

    Key insight: Sort by attack descending, and for equal attacks,
    sort defense ascending. Then track max defense seen so far.
    """
    # Step 1: Sort the characters
    # Sort by attack in descending order, and for equal attacks,
    # sort defense in ascending order
    # This ensures characters with same attack don't count each other as weak
    properties.sort(key=lambda x: (-x[0], x[1]))

    weak_count = 0
    max_defense = 0

    # Step 2: Single pass through sorted characters
    for _, defense in properties:
        # If current defense is less than max defense seen so far,
        # then there exists a character with:
        # 1. Higher or equal attack (due to sorting)
        # 2. Strictly higher defense (since defense < max_defense)
        # But wait - what about equal attack? That's handled by our sorting!
        # Characters with same attack are sorted by ascending defense,
        # so max_defense from same-attack group won't cause false positives
        if defense < max_defense:
            weak_count += 1
        else:
            # Update max defense if current defense is higher
            max_defense = defense

    return weak_count
```

```javascript
// Time: O(n log n) | Space: O(1) or O(log n) for sorting
function numberOfWeakCharacters(properties) {
  /**
   * Optimal solution using sorting and single pass
   *
   * Key insight: Sort by attack descending, and for equal attacks,
   * sort defense ascending. Then track max defense seen so far.
   */

  // Step 1: Sort the characters
  // Sort by attack in descending order, and for equal attacks,
  // sort defense in ascending order
  properties.sort((a, b) => {
    if (a[0] === b[0]) {
      // Same attack: sort defense ascending
      return a[1] - b[1];
    }
    // Different attack: sort attack descending
    return b[0] - a[0];
  });

  let weakCount = 0;
  let maxDefense = 0;

  // Step 2: Single pass through sorted characters
  for (const [_, defense] of properties) {
    // If current defense is less than max defense seen so far,
    // then there exists a character with:
    // 1. Higher or equal attack (due to sorting)
    // 2. Strictly higher defense (since defense < maxDefense)
    // Equal attack case is handled by our sorting order
    if (defense < maxDefense) {
      weakCount++;
    } else {
      // Update max defense if current defense is higher
      maxDefense = defense;
    }
  }

  return weakCount;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(log n) for sorting
public int numberOfWeakCharacters(int[][] properties) {
    /**
     * Optimal solution using sorting and single pass
     *
     * Key insight: Sort by attack descending, and for equal attacks,
     * sort defense ascending. Then track max defense seen so far.
     */

    // Step 1: Sort the characters
    // Sort by attack in descending order, and for equal attacks,
    // sort defense in ascending order
    Arrays.sort(properties, (a, b) -> {
        if (a[0] == b[0]) {
            // Same attack: sort defense ascending
            return Integer.compare(a[1], b[1]);
        }
        // Different attack: sort attack descending
        return Integer.compare(b[0], a[0]);
    });

    int weakCount = 0;
    int maxDefense = 0;

    // Step 2: Single pass through sorted characters
    for (int[] property : properties) {
        int defense = property[1];

        // If current defense is less than max defense seen so far,
        // then there exists a character with:
        // 1. Higher or equal attack (due to sorting)
        // 2. Strictly higher defense (since defense < maxDefense)
        // Equal attack case is handled by our sorting order
        if (defense < maxDefense) {
            weakCount++;
        } else {
            // Update max defense if current defense is higher
            maxDefense = defense;
        }
    }

    return weakCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The single pass through the sorted array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(log n) or O(n) depending on language**

- Sorting typically requires O(log n) space for the recursion stack (quicksort) or O(n) for merge sort
- Some languages like Python use Timsort which has O(n) worst-case space
- We only use O(1) additional space for variables (max_defense, weak_count)

## Common Mistakes

1. **Not handling equal attacks correctly**: The most common mistake is sorting by attack descending and defense descending. This causes characters with same attack to potentially count each other as weak. Example: `[[10,7],[10,4]]` - with wrong sorting, [10,4] might be marked weak by [10,7], but attack must be STRICTLY greater.

2. **Forgetting to update max_defense when defense is equal**: In the condition `if defense < max_defense`, some candidates forget to update max_defense when defense is equal or greater. This causes missed weak characters later in the iteration.

3. **Trying to use two separate sorts**: Some candidates try to sort by attack, then separately handle defense, creating complex logic that often has edge case bugs. The single sort with custom comparator is cleaner.

4. **Off-by-one errors in manual comparisons**: When implementing manual comparisons instead of using the max_defense approach, candidates often make errors in tracking which characters have been processed.

## When You'll See This Pattern

This "sort by one dimension, track max of another" pattern appears in several 2D comparison problems:

1. **Russian Doll Envelopes (Hard)**: Similar concept but requires finding the longest sequence of envelopes that fit inside each other. Uses sorting plus patience sorting/LIS algorithm.

2. **Maximum Height by Stacking Cuboids (Hard)**: Requires sorting dimensions and then finding maximum height stack, similar 2D/3D dominance concept.

3. **Non-overlapping Intervals (Medium)**: While not exactly the same, it uses sorting by one endpoint and tracking another to make greedy decisions.

4. **Meeting Rooms II (Medium)**: Uses sorting by start time and tracking end times with a min-heap.

The core pattern is: **When you need to compare elements based on multiple attributes, sort by one attribute in a way that simplifies comparison of the other attribute(s).**

## Key Takeaways

1. **Sorting is a powerful tool for reducing 2D comparisons**: By strategically sorting (attack descending, defense ascending for equal attacks), we transform an O(n²) pairwise comparison problem into an O(n log n) single-pass problem.

2. **Handle equal values carefully in dominance problems**: When checking for "strictly greater" in multiple dimensions, equal values in one dimension should not count as dominance. Our sorting trick (ascending defense for equal attacks) elegantly handles this.

3. **Track extremal values during iteration**: After sorting, we often only need to track the maximum or minimum value seen so far of the other dimension, rather than comparing with all previous elements.

Related problems: [Russian Doll Envelopes](/problem/russian-doll-envelopes), [Maximum Height by Stacking Cuboids](/problem/maximum-height-by-stacking-cuboids)
