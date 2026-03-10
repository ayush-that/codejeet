---
title: "How to Solve Friends Of Appropriate Ages — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Friends Of Appropriate Ages. Medium difficulty, 49.8% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2027-01-01"
category: "dsa-patterns"
tags: ["friends-of-appropriate-ages", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Friends Of Appropriate Ages

This problem asks us to count valid friend requests between people based on age constraints. The tricky part is that the conditions create asymmetric relationships — person A might be able to request B, but B might not be able to request A. We need to count all valid request pairs while avoiding double-counting and ensuring we don't count requests to oneself.

## Visual Walkthrough

Let's trace through a small example: `ages = [16, 17, 18]`

We need to check each possible pair (x, y) where x ≠ y:

**Person 0 (age 16) sending requests:**

- To person 1 (age 17): Check conditions:
  1. `age[y] <= 0.5 * age[x] + 7` → `17 <= 0.5*16 + 7 = 8 + 7 = 15` → `17 <= 15`? **False**
  2. `age[y] > age[x]` → `17 > 16`? **True** → Request **NOT** sent
- To person 2 (age 18): Check conditions:
  1. `18 <= 0.5*16 + 7 = 15` → `18 <= 15`? **False**
  2. `18 > 16`? **True** → Request **NOT** sent

**Person 1 (age 17) sending requests:**

- To person 0 (age 16): Check conditions:
  1. `16 <= 0.5*17 + 7 = 8.5 + 7 = 15.5` → `16 <= 15.5`? **False**
  2. `16 > 17`? **False**
     Both conditions false → Request **IS** sent
- To person 2 (age 18): Check conditions:
  1. `18 <= 0.5*17 + 7 = 15.5` → `18 <= 15.5`? **False**
  2. `18 > 17`? **True** → Request **NOT** sent

**Person 2 (age 18) sending requests:**

- To person 0 (age 16): Check conditions:
  1. `16 <= 0.5*18 + 7 = 9 + 7 = 16` → `16 <= 16`? **True** → Request **NOT** sent
- To person 1 (age 17): Check conditions:
  1. `17 <= 0.5*18 + 7 = 16` → `17 <= 16`? **False**
  2. `17 > 18`? **False**
     Both conditions false → Request **IS** sent

Total valid requests: 1 (17→16) + 1 (18→17) = **2**

## Brute Force Approach

The most straightforward solution is to check every possible pair (x, y) where x ≠ y:

1. Initialize a counter to 0
2. For each person x (index i, age a):
   - For each person y (index j, age b) where j ≠ i:
     - Check if `b <= 0.5*a + 7` → if true, skip
     - Check if `b > a` → if true, skip
     - Otherwise, increment counter

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numFriendRequests_brute(ages):
    n = len(ages)
    count = 0

    for i in range(n):
        for j in range(n):
            if i == j:  # Can't send request to self
                continue

            a = ages[i]
            b = ages[j]

            # Check the two conditions
            if b <= 0.5 * a + 7:
                continue
            if b > a:
                continue

            # If neither condition is true, request is valid
            count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numFriendRequestsBrute(ages) {
  let count = 0;
  const n = ages.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue; // Can't send request to self

      const a = ages[i];
      const b = ages[j];

      // Check the two conditions
      if (b <= 0.5 * a + 7) continue;
      if (b > a) continue;

      // If neither condition is true, request is valid
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numFriendRequestsBrute(int[] ages) {
    int count = 0;
    int n = ages.length;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) continue;  // Can't send request to self

            int a = ages[i];
            int b = ages[j];

            // Check the two conditions
            if (b <= 0.5 * a + 7) continue;
            if (b > a) continue;

            // If neither condition is true, request is valid
            count++;
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With n up to 20,000, O(n²) is 400 million operations — far too slow. We need a more efficient approach.

## Optimized Approach

The key insight is that **age values are limited to 1-120** (according to constraints). This small range allows us to use counting/bucket strategies instead of comparing every pair.

**Step-by-step reasoning:**

1. **Count frequencies:** Since there are only 121 possible ages (0-120, though 0 isn't valid), we can count how many people have each age.

2. **For each age A:** We need to find all ages B where:
   - `B > 0.5*A + 7` (first condition fails)
   - `B ≤ A` (second condition fails)
   - `B ≥ 15` (special case: if A < 15, no one can send requests to/from A due to first condition)

3. **Mathematical simplification:** The valid age range for B given A is:
   - Lower bound: `max(0.5*A + 7, 0)` but actually `floor(0.5*A + 7) + 1`
   - Upper bound: `A`
   - But also: if A < 15, no valid B exists (since 0.5\*A + 7 ≥ A when A ≤ 14)

4. **Counting pairs:** For age A with count `countA` and age B with count `countB`:
   - If A = B: People can send requests to others of the same age (but not to themselves). So valid pairs = `countA * (countA - 1)`
   - If A ≠ B: All people of age A can send to all people of age B = `countA * countB`

5. **Implementation strategy:** Use prefix sums to quickly get the total number of people in an age range.

## Optimal Solution

We'll use a frequency array and prefix sums to efficiently count valid requests.

<div class="code-group">

```python
# Time: O(1) since age range is fixed at 121 | Space: O(1) for the same reason
def numFriendRequests(ages):
    # Step 1: Count frequency of each age (ages are 1-120)
    age_count = [0] * 121
    for age in ages:
        age_count[age] += 1

    # Step 2: Create prefix sum array for quick range queries
    # prefix_sum[i] = total people with age <= i
    prefix_sum = [0] * 121
    prefix_sum[0] = age_count[0]
    for i in range(1, 121):
        prefix_sum[i] = prefix_sum[i-1] + age_count[i]

    # Helper function to get count of people in age range [left, right]
    def count_in_range(left, right):
        if left > right or left > 120 or right < 1:
            return 0
        left = max(1, left)
        right = min(120, right)
        if left == 1:
            return prefix_sum[right]
        return prefix_sum[right] - prefix_sum[left - 1]

    total_requests = 0

    # Step 3: For each age A, count valid requests
    for age_a in range(1, 121):
        if age_count[age_a] == 0:
            continue  # No one of this age, skip

        # Calculate the minimum valid age B can be
        # B must be > 0.5*age_a + 7, so min_age = floor(0.5*age_a + 7) + 1
        min_age = int(0.5 * age_a + 7) + 1

        # Maximum valid age is age_a (can't send to older people)
        max_age = age_a

        # Special case: if age_a < 15, no valid requests at all
        # Because 0.5*age_a + 7 >= age_a when age_a <= 14
        if min_age > max_age:
            continue

        # Count people in valid age range
        valid_count = count_in_range(min_age, max_age)

        # Subtract people of age_a themselves (can't send to self)
        # But wait: we need to handle same-age requests carefully
        # People CAN send to others of the same age, just not to themselves
        # So valid_count includes all people in [min_age, max_age]
        # If min_age <= age_a <= max_age, then age_a people are included

        # All people of age_a can send to all valid people EXCEPT:
        # 1. They can't send to themselves
        # 2. If sending to same age, already accounted for in subtraction

        # Actually simpler: For age_a people sending to age_b people:
        # - If age_a == age_b: count_a * (count_a - 1)
        # - If age_a != age_b: count_a * count_b

        # Let's recalculate properly:
        for age_b in range(min_age, max_age + 1):
            if age_count[age_b] == 0:
                continue

            if age_a == age_b:
                # People can send to others of same age (but not themselves)
                total_requests += age_count[age_a] * (age_count[age_b] - 1)
            else:
                # All people of age_a can send to all people of age_b
                total_requests += age_count[age_a] * age_count[age_b]

    return total_requests
```

```javascript
// Time: O(1) since age range is fixed at 121 | Space: O(1) for the same reason
function numFriendRequests(ages) {
  // Step 1: Count frequency of each age (ages are 1-120)
  const ageCount = new Array(121).fill(0);
  for (const age of ages) {
    ageCount[age]++;
  }

  // Step 2: Create prefix sum array for quick range queries
  // prefixSum[i] = total people with age <= i
  const prefixSum = new Array(121).fill(0);
  prefixSum[0] = ageCount[0];
  for (let i = 1; i <= 120; i++) {
    prefixSum[i] = prefixSum[i - 1] + ageCount[i];
  }

  // Helper function to get count of people in age range [left, right]
  function countInRange(left, right) {
    if (left > right || left > 120 || right < 1) return 0;
    left = Math.max(1, left);
    right = Math.min(120, right);
    if (left === 1) return prefixSum[right];
    return prefixSum[right] - prefixSum[left - 1];
  }

  let totalRequests = 0;

  // Step 3: For each age A, count valid requests
  for (let ageA = 1; ageA <= 120; ageA++) {
    if (ageCount[ageA] === 0) continue; // No one of this age, skip

    // Calculate the minimum valid age B can be
    // B must be > 0.5*ageA + 7, so minAge = Math.floor(0.5*ageA + 7) + 1
    const minAge = Math.floor(0.5 * ageA + 7) + 1;

    // Maximum valid age is ageA (can't send to older people)
    const maxAge = ageA;

    // Special case: if ageA < 15, no valid requests at all
    if (minAge > maxAge) continue;

    // Count all valid ageB values
    for (let ageB = minAge; ageB <= maxAge; ageB++) {
      if (ageCount[ageB] === 0) continue;

      if (ageA === ageB) {
        // People can send to others of same age (but not themselves)
        totalRequests += ageCount[ageA] * (ageCount[ageB] - 1);
      } else {
        // All people of ageA can send to all people of ageB
        totalRequests += ageCount[ageA] * ageCount[ageB];
      }
    }
  }

  return totalRequests;
}
```

```java
// Time: O(1) since age range is fixed at 121 | Space: O(1) for the same reason
public int numFriendRequests(int[] ages) {
    // Step 1: Count frequency of each age (ages are 1-120)
    int[] ageCount = new int[121];
    for (int age : ages) {
        ageCount[age]++;
    }

    // Step 2: Create prefix sum array for quick range queries
    // prefixSum[i] = total people with age <= i
    int[] prefixSum = new int[121];
    prefixSum[0] = ageCount[0];
    for (int i = 1; i <= 120; i++) {
        prefixSum[i] = prefixSum[i - 1] + ageCount[i];
    }

    // Helper function to get count of people in age range [left, right]
    java.util.function.BiFunction<Integer, Integer, Integer> countInRange = (left, right) -> {
        if (left > right || left > 120 || right < 1) return 0;
        int l = Math.max(1, left);
        int r = Math.min(120, right);
        if (l == 1) return prefixSum[r];
        return prefixSum[r] - prefixSum[l - 1];
    };

    int totalRequests = 0;

    // Step 3: For each age A, count valid requests
    for (int ageA = 1; ageA <= 120; ageA++) {
        if (ageCount[ageA] == 0) continue; // No one of this age, skip

        // Calculate the minimum valid age B can be
        // B must be > 0.5*ageA + 7, so minAge = (int)(0.5*ageA + 7) + 1
        int minAge = (int)(0.5 * ageA + 7) + 1;

        // Maximum valid age is ageA (can't send to older people)
        int maxAge = ageA;

        // Special case: if ageA < 15, no valid requests at all
        if (minAge > maxAge) continue;

        // Count all valid ageB values
        for (int ageB = minAge; ageB <= maxAge; ageB++) {
            if (ageCount[ageB] == 0) continue;

            if (ageA == ageB) {
                // People can send to others of same age (but not themselves)
                totalRequests += ageCount[ageA] * (ageCount[ageB] - 1);
            } else {
                // All people of ageA can send to all people of ageB
                totalRequests += ageCount[ageA] * ageCount[ageB];
            }
        }
    }

    return totalRequests;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) — technically O(121²) = O(14,641) operations, which is constant regardless of input size n. The age range is fixed at 121 values, so our nested loops over age ranges are constant time.

**Space Complexity:** O(1) — we use fixed-size arrays of length 121, regardless of input size n.

Even though we have nested loops, they iterate over age values (1-120), not over the number of people. This is the key optimization that makes the solution efficient.

## Common Mistakes

1. **Forgetting the "no self-request" rule:** When counting same-age requests, candidates often do `countA * countA` instead of `countA * (countA - 1)`. Remember: a person cannot send a friend request to themselves.

2. **Incorrect age range calculation:** The condition is `age[y] <= 0.5 * age[x] + 7`, which means the request is NOT sent if this is true. So valid requests require `age[y] > 0.5 * age[x] + 7`. Many candidates get the inequality direction wrong.

3. **Missing the age < 15 special case:** When age < 15, `0.5*age + 7 >= age`, so no valid B exists. For example, age 14: `0.5*14 + 7 = 14`, so B must be > 14 but also ≤ 14 — impossible.

4. **Using O(n²) approach for large n:** The most common mistake is not noticing the age range constraint (1-120) and trying to optimize an O(n²) solution. Always check constraints before choosing an approach.

## When You'll See This Pattern

This problem uses **frequency counting with limited value range**, a pattern that appears when:

1. **Values have small, bounded ranges** (like ages 1-120 here)
2. **You need to count pairs satisfying some condition**
3. **Direct pair comparison would be O(n²)**

Related LeetCode problems:

- **Counting Elements** (LeetCode 1426): Count special elements where there exists another element with value+1
- **Array of Doubled Pairs** (LeetCode 954): Check if array can be rearranged into pairs where one is double the other
- **Find All Anagrams in a String** (LeetCode 438): Use frequency arrays to compare character counts

The core technique is: when values have limited range, use frequency arrays instead of comparing individual elements.

## Key Takeaways

1. **Always check value constraints** — if values have a small range (like 1-120), frequency-based approaches often beat comparison-based ones.

2. **Convert pair-wise conditions to range queries** — instead of checking each pair (x,y), determine for each x what range of y values are valid, then count how many y's fall in that range.

3. **Handle edge cases in counting** — same-element cases often need special handling (like `countA * (countA - 1)` for same-age requests).

[Practice this problem on CodeJeet](/problem/friends-of-appropriate-ages)
