---
title: "How to Solve Maximum Total Damage With Spell Casting — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Total Damage With Spell Casting. Medium difficulty, 45.0% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search, Dynamic Programming."
date: "2027-03-24"
category: "dsa-patterns"
tags: ["maximum-total-damage-with-spell-casting", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Maximum Total Damage With Spell Casting

This problem presents an interesting twist on classic dynamic programming challenges. You're given an array of spell damages, and the constraint is that if you cast a spell with damage `power[i]`, you cannot cast any spell with damage in the range `[power[i] - 2, power[i] + 2]` (inclusive). The goal is to maximize the total damage from spells you can cast. What makes this tricky is that multiple spells can have the same damage value, and you need to consider both the frequency of each damage value and the exclusion range constraint.

## Visual Walkthrough

Let's trace through a concrete example: `power = [1, 1, 3, 4]`

**Step 1: Count frequencies**

- Damage 1 appears 2 times → total damage = 2
- Damage 3 appears 1 time → total damage = 3
- Damage 4 appears 1 time → total damage = 4

**Step 2: Sort unique damages**
Unique damages sorted: [1, 3, 4]

**Step 3: Dynamic programming decision**
For each damage value, we have two choices:

1. **Take it**: Add its total damage (frequency × damage) to the best solution from damages that are at least 3 less (since we can't take anything within ±2)
2. **Skip it**: Use the best solution from the previous damage

Let's walk through the DP:

- **Damage 1**:
  - Take: 2 (no previous valid damage) → 2
  - Skip: 0
  - Best: max(2, 0) = 2

- **Damage 3**:
  - Take: 3 + dp[damage ≤ 0] = 3 + 0 = 3
  - Skip: dp[damage 1] = 2
  - Best: max(3, 2) = 3

- **Damage 4**:
  - Take: 4 + dp[damage ≤ 1] = 4 + 2 = 6
  - Skip: dp[damage 3] = 3
  - Best: max(6, 3) = 6

Final answer: 6 (take both damage 1 and damage 4)

## Brute Force Approach

A naive approach would be to consider all possible subsets of spells and check if they satisfy the constraint. For each subset:

1. Check that no two spells have damages within 2 of each other
2. Calculate the total damage
3. Track the maximum

The problem with this approach is that with `n` spells, there are `2^n` possible subsets. Even for moderate `n` (like 30), this becomes computationally infeasible (`2^30 ≈ 1 billion` operations).

<div class="code-group">

```python
# Brute force - too slow for large inputs
def maximumTotalDamage(power):
    n = len(power)
    max_damage = 0

    # Generate all subsets using bitmask
    for mask in range(1 << n):
        total = 0
        valid = True
        spells = []

        # Collect spells in this subset
        for i in range(n):
            if mask & (1 << i):
                spells.append(power[i])
                total += power[i]

        # Check constraint
        for i in range(len(spells)):
            for j in range(i + 1, len(spells)):
                if abs(spells[i] - spells[j]) <= 2:
                    valid = False
                    break
            if not valid:
                break

        if valid:
            max_damage = max(max_damage, total)

    return max_damage
```

```javascript
// Brute force - too slow for large inputs
function maximumTotalDamage(power) {
  const n = power.length;
  let maxDamage = 0;

  // Generate all subsets using bitmask
  for (let mask = 0; mask < 1 << n; mask++) {
    let total = 0;
    let valid = true;
    const spells = [];

    // Collect spells in this subset
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        spells.push(power[i]);
        total += power[i];
      }
    }

    // Check constraint
    for (let i = 0; i < spells.length && valid; i++) {
      for (let j = i + 1; j < spells.length; j++) {
        if (Math.abs(spells[i] - spells[j]) <= 2) {
          valid = false;
          break;
        }
      }
    }

    if (valid) {
      maxDamage = Math.max(maxDamage, total);
    }
  }

  return maxDamage;
}
```

```java
// Brute force - too slow for large inputs
public long maximumTotalDamage(int[] power) {
    int n = power.length;
    long maxDamage = 0;

    // Generate all subsets using bitmask
    for (int mask = 0; mask < (1 << n); mask++) {
        long total = 0;
        boolean valid = true;
        List<Integer> spells = new ArrayList<>();

        // Collect spells in this subset
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                spells.add(power[i]);
                total += power[i];
            }
        }

        // Check constraint
        for (int i = 0; i < spells.size() && valid; i++) {
            for (int j = i + 1; j < spells.size(); j++) {
                if (Math.abs(spells.get(i) - spells.get(j)) <= 2) {
                    valid = false;
                    break;
                }
            }
        }

        if (valid) {
            maxDamage = Math.max(maxDamage, total);
        }
    }

    return maxDamage;
}
```

</div>

## Optimized Approach

The key insight is that this is essentially a **weighted interval scheduling problem** where each "interval" is a damage value with its total weight (frequency × damage), and intervals conflict if they're within 2 of each other.

**Step-by-step reasoning:**

1. **Count frequencies**: Since multiple spells can have the same damage, we first count how many times each damage appears
2. **Sort unique damages**: We only need to consider each unique damage value once
3. **Dynamic programming**: For each damage value `d`, we have two choices:
   - Take it: Add `count[d] × d` to the best solution from damages that are at least `d - 3` (since we can't take anything within ±2)
   - Skip it: Use the best solution from the previous damage
4. **Binary search optimization**: Instead of linearly searching for the last compatible damage, we use binary search since damages are sorted

The recurrence relation is:

```
dp[i] = max(
    dp[i-1],  // Skip current damage
    total_damage[i] + dp[j]  // Take current damage, where j is the largest index with damage[j] ≤ damage[i] - 3
)
```

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maximumTotalDamage(power):
    from collections import Counter
    import bisect

    # Step 1: Count frequency of each damage
    count = Counter(power)

    # Step 2: Get sorted list of unique damages
    unique_damages = sorted(count.keys())
    n = len(unique_damages)

    # Step 3: Precompute total damage for each unique damage
    total_damage = [count[d] * d for d in unique_damages]

    # Step 4: Initialize DP array
    dp = [0] * n

    for i in range(n):
        current_damage = unique_damages[i]

        # Option 1: Skip current damage
        skip_option = dp[i-1] if i > 0 else 0

        # Option 2: Take current damage
        # Find the largest damage that's at least 3 less than current damage
        # We need damage <= current_damage - 3
        target = current_damage - 3

        # Use binary search to find the rightmost index with damage <= target
        j = bisect.bisect_right(unique_damages, target) - 1

        if j >= 0:
            take_option = total_damage[i] + dp[j]
        else:
            take_option = total_damage[i]  # No compatible previous damage

        # Take the better option
        dp[i] = max(skip_option, take_option)

    return dp[-1] if n > 0 else 0
```

```javascript
// Time: O(n log n) | Space: O(n)
function maximumTotalDamage(power) {
  // Step 1: Count frequency of each damage
  const count = new Map();
  for (const dmg of power) {
    count.set(dmg, (count.get(dmg) || 0) + 1);
  }

  // Step 2: Get sorted list of unique damages
  const uniqueDamages = Array.from(count.keys()).sort((a, b) => a - b);
  const n = uniqueDamages.length;

  // Step 3: Precompute total damage for each unique damage
  const totalDamage = uniqueDamages.map((dmg) => count.get(dmg) * dmg);

  // Step 4: Initialize DP array
  const dp = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const currentDamage = uniqueDamages[i];

    // Option 1: Skip current damage
    const skipOption = i > 0 ? dp[i - 1] : 0;

    // Option 2: Take current damage
    // Find the largest damage that's at least 3 less than current damage
    const target = currentDamage - 3;

    // Use binary search to find the rightmost index with damage <= target
    let left = 0,
      right = i;
    let j = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (uniqueDamages[mid] <= target) {
        j = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    const takeOption = j >= 0 ? totalDamage[i] + dp[j] : totalDamage[i];

    // Take the better option
    dp[i] = Math.max(skipOption, takeOption);
  }

  return n > 0 ? dp[n - 1] : 0;
}
```

```java
// Time: O(n log n) | Space: O(n)
public long maximumTotalDamage(int[] power) {
    // Step 1: Count frequency of each damage
    Map<Integer, Integer> count = new HashMap<>();
    for (int dmg : power) {
        count.put(dmg, count.getOrDefault(dmg, 0) + 1);
    }

    // Step 2: Get sorted list of unique damages
    List<Integer> uniqueDamages = new ArrayList<>(count.keySet());
    Collections.sort(uniqueDamages);
    int n = uniqueDamages.size();

    // Step 3: Precompute total damage for each unique damage
    long[] totalDamage = new long[n];
    for (int i = 0; i < n; i++) {
        int dmg = uniqueDamages.get(i);
        totalDamage[i] = (long) count.get(dmg) * dmg;
    }

    // Step 4: Initialize DP array
    long[] dp = new long[n];

    for (int i = 0; i < n; i++) {
        int currentDamage = uniqueDamages.get(i);

        // Option 1: Skip current damage
        long skipOption = i > 0 ? dp[i - 1] : 0;

        // Option 2: Take current damage
        // Find the largest damage that's at least 3 less than current damage
        int target = currentDamage - 3;

        // Use binary search to find the rightmost index with damage <= target
        int left = 0, right = i;
        int j = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (uniqueDamages.get(mid) <= target) {
                j = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        long takeOption = j >= 0 ? totalDamage[i] + dp[j] : totalDamage[i];

        // Take the better option
        dp[i] = Math.max(skipOption, takeOption);
    }

    return n > 0 ? dp[n - 1] : 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting frequencies: O(n) where n is the length of the input array
- Sorting unique damages: O(m log m) where m is the number of unique damages (m ≤ n)
- DP with binary search: O(m log m) - for each of m unique damages, we do a binary search
- Overall: O(n + m log m) = O(n log n) in worst case

**Space Complexity: O(n)**

- Frequency map: O(m) where m is number of unique damages
- Arrays for unique damages, total damage, and DP: O(m)
- Overall: O(m) = O(n) in worst case when all damages are unique

## Common Mistakes

1. **Forgetting to account for multiple spells with same damage**: Candidates often treat each spell individually instead of grouping by damage value. This leads to incorrect DP transitions since you might incorrectly think you can take some but not all spells of the same damage.

2. **Incorrect compatibility check**: The constraint is "cannot cast any spell with damage in [power[i] - 2, power[i] + 2]". Some candidates mistakenly think this means you can't cast spells with exactly the same damage, or they use the wrong boundary (like power[i] - 1 instead of power[i] - 3 in the DP transition).

3. **Integer overflow**: With large damage values and frequencies, the total damage can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/JavaScript, no issue in Python).

4. **Off-by-one errors in binary search**: When finding the last compatible damage, you need damage ≤ current_damage - 3. Getting this wrong by ±1 leads to incorrect results. Always test with edge cases like damages that are exactly 3 apart.

## When You'll See This Pattern

This problem uses a combination of frequency counting, sorting, and dynamic programming with binary search - a pattern that appears in several LeetCode problems:

1. **198. House Robber**: Similar "take or skip" DP, but with adjacent constraint instead of range constraint
2. **740. Delete and Earn**: Almost identical structure - you earn points equal to a number but delete all occurrences of number-1 and number+1
3. **1235. Maximum Profit in Job Scheduling**: Weighted interval scheduling with binary search for compatible jobs
4. **2008. Maximum Earnings From Taxi**: Similar DP with binary search for last compatible ride

The core pattern is: when you have items with weights and compatibility constraints, sort them, then use DP where dp[i] = max(skip current, take current + dp[last_compatible]).

## Key Takeaways

1. **Group identical items**: When multiple items share the same "key" (damage value here), always count frequencies first. This reduces the problem size and simplifies DP transitions.

2. **DP + binary search for sorted compatibility**: When items are sorted and compatibility depends on value thresholds, use binary search to find the last compatible item in O(log n) instead of O(n).

3. **Think in terms of "take or skip"**: Many DP problems boil down to this fundamental choice. The recurrence `dp[i] = max(dp[i-1], value[i] + dp[compatible])` appears in numerous variations.

[Practice this problem on CodeJeet](/problem/maximum-total-damage-with-spell-casting)
