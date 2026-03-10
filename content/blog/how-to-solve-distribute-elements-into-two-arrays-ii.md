---
title: "How to Solve Distribute Elements Into Two Arrays II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Distribute Elements Into Two Arrays II. Hard difficulty, 30.4% acceptance rate. Topics: Array, Binary Indexed Tree, Segment Tree, Simulation."
date: "2026-03-01"
category: "dsa-patterns"
tags:
  ["distribute-elements-into-two-arrays-ii", "array", "binary-indexed-tree", "segment-tree", "hard"]
---

# How to Solve Distribute Elements Into Two Arrays II

This problem asks you to distribute elements from a given array into two separate arrays while tracking how many elements in each array are strictly greater than the current value being placed. The challenge lies in efficiently calculating these "greater counts" at each step—a naive approach would be too slow, requiring clever data structures to handle the dynamic counting.

What makes this problem interesting is that it combines array manipulation with the need for efficient range queries. At each step, you need to know how many elements in an array are greater than a given value, and you need to update the array with new values. This is a classic scenario where Binary Indexed Trees (Fenwick Trees) or Segment Trees shine.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 1, 3]`

We'll maintain two arrays: `arr1` and `arr2`, both initially empty.

**Step 1:** Process `nums[0] = 2`

- Both arrays are empty, so `greaterCount(arr1, 2) = 0` and `greaterCount(arr2, 2) = 0`
- Since counts are equal, follow rule: append to the array with smaller length (both are length 0, so choose `arr1`)
- `arr1 = [2]`, `arr2 = []`

**Step 2:** Process `nums[1] = 1`

- `greaterCount(arr1, 1)`: Count elements in `arr1` > 1. `arr1 = [2]`, so count = 1
- `greaterCount(arr2, 1)`: `arr2` is empty, so count = 0
- Since 1 > 0, append to `arr2`
- `arr1 = [2]`, `arr2 = [1]`

**Step 3:** Process `nums[2] = 3`

- `greaterCount(arr1, 3)`: Count elements in `arr1` > 3. `arr1 = [2]`, so count = 0
- `greaterCount(arr2, 3)`: Count elements in `arr2` > 3. `arr2 = [1]`, so count = 0
- Counts are equal (0 = 0), so check lengths: `arr1` length = 1, `arr2` length = 1
- Lengths are equal, so append to `arr1`
- `arr1 = [2, 3]`, `arr2 = [1]`

The key insight: We need to efficiently count how many elements in each array are greater than the current value. A naive approach would scan each array every time, giving us O(n²) time complexity. We need something faster.

## Brute Force Approach

The most straightforward solution would be to simulate the process exactly as described:

1. Initialize two empty arrays `arr1` and `arr2`
2. For each element in `nums`:
   - Count how many elements in `arr1` are greater than current value (by scanning)
   - Count how many elements in `arr2` are greater than current value (by scanning)
   - Compare counts and decide where to append
   - Append to the chosen array

Here's what the brute force code would look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def resultArray(nums):
    arr1, arr2 = [], []

    for num in nums:
        # Count greater elements in arr1
        count1 = 0
        for val in arr1:
            if val > num:
                count1 += 1

        # Count greater elements in arr2
        count2 = 0
        for val in arr2:
            if val > num:
                count2 += 1

        # Decision logic
        if count1 > count2:
            arr1.append(num)
        elif count1 < count2:
            arr2.append(num)
        else:
            # Counts equal, check lengths
            if len(arr1) <= len(arr2):
                arr1.append(num)
            else:
                arr2.append(num)

    return arr1 + arr2
```

```javascript
// Time: O(n²) | Space: O(n)
function resultArray(nums) {
  const arr1 = [],
    arr2 = [];

  for (const num of nums) {
    // Count greater elements in arr1
    let count1 = 0;
    for (const val of arr1) {
      if (val > num) count1++;
    }

    // Count greater elements in arr2
    let count2 = 0;
    for (const val of arr2) {
      if (val > num) count2++;
    }

    // Decision logic
    if (count1 > count2) {
      arr1.push(num);
    } else if (count1 < count2) {
      arr2.push(num);
    } else {
      // Counts equal, check lengths
      if (arr1.length <= arr2.length) {
        arr1.push(num);
      } else {
        arr2.push(num);
      }
    }
  }

  return [...arr1, ...arr2];
}
```

```java
// Time: O(n²) | Space: O(n)
public int[] resultArray(int[] nums) {
    List<Integer> arr1 = new ArrayList<>();
    List<Integer> arr2 = new ArrayList<>();

    for (int num : nums) {
        // Count greater elements in arr1
        int count1 = 0;
        for (int val : arr1) {
            if (val > num) count1++;
        }

        // Count greater elements in arr2
        int count2 = 0;
        for (int val : arr2) {
            if (val > num) count2++;
        }

        // Decision logic
        if (count1 > count2) {
            arr1.add(num);
        } else if (count1 < count2) {
            arr2.add(num);
        } else {
            // Counts equal, check lengths
            if (arr1.size() <= arr2.size()) {
                arr1.add(num);
            } else {
                arr2.add(num);
            }
        }
    }

    // Combine results
    List<Integer> result = new ArrayList<>(arr1);
    result.addAll(arr2);
    return result.stream().mapToInt(i -> i).toArray();
}
```

</div>

**Why this is too slow:** For each of the n elements, we scan through up to n elements in the arrays, giving us O(n²) time complexity. With n up to 10⁵ (as typical in LeetCode problems), this would be far too slow—we need something closer to O(n log n).

## Optimized Approach

The key insight is that we need to efficiently answer two types of queries:

1. **Range query**: How many elements are greater than a given value?
2. **Update query**: Add a new element to our data structure.

This is exactly what **Binary Indexed Trees (Fenwick Trees)** or **Segment Trees** are designed for. They allow both queries to run in O(log n) time.

**Step-by-step reasoning:**

1. **Coordinate Compression**: Since the values can be large, we need to map them to indices in our Fenwick Tree. We'll collect all unique values, sort them, and create a mapping from value to index.

2. **Fenwick Tree Operations**:
   - `query(idx)`: Returns the count of elements with index ≤ idx (prefix sum)
   - `update(idx, delta)`: Adds delta to the count at index idx

3. **Counting greater elements**: To count elements greater than `val`, we need:
   - Total elements in the tree
   - Elements ≤ val (which we can get with `query(idx_of_val)`)
   - Greater count = total - elements ≤ val

4. **Maintain two Fenwick Trees**: One for `arr1` and one for `arr2` to track their elements.

5. **Process each element**:
   - Get compressed index for current value
   - Calculate greater counts using both Fenwick Trees
   - Decide where to place the element
   - Update the corresponding Fenwick Tree

## Optimal Solution

Here's the complete solution using Fenwick Trees:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)  # 1-indexed BIT

    def update(self, idx, delta):
        """Add delta to position idx (1-indexed)"""
        while idx <= self.n:
            self.bit[idx] += delta
            idx += idx & -idx  # Move to next responsible index

    def query(self, idx):
        """Get prefix sum from 1 to idx (1-indexed)"""
        res = 0
        while idx > 0:
            res += self.bit[idx]
            idx -= idx & -idx  # Move to parent
        return res

def resultArray(nums):
    # Step 1: Coordinate compression
    sorted_unique = sorted(set(nums))
    value_to_idx = {val: i+1 for i, val in enumerate(sorted_unique)}  # 1-indexed

    # Step 2: Initialize Fenwick Trees for arr1 and arr2
    m = len(sorted_unique)
    bit1 = FenwickTree(m)
    bit2 = FenwickTree(m)

    # Step 3: Initialize arrays and track their sizes
    arr1, arr2 = [], []
    size1, size2 = 0, 0

    # Step 4: Process each element
    for num in nums:
        idx = value_to_idx[num]

        # Calculate greater counts:
        # total elements - elements ≤ current value = elements > current value
        greater1 = size1 - bit1.query(idx)  # Elements in arr1 > num
        greater2 = size2 - bit2.query(idx)  # Elements in arr2 > num

        # Decision logic
        if greater1 > greater2:
            arr1.append(num)
            bit1.update(idx, 1)  # Add num to arr1's BIT
            size1 += 1
        elif greater1 < greater2:
            arr2.append(num)
            bit2.update(idx, 1)  # Add num to arr2's BIT
            size2 += 1
        else:
            # Counts equal, check lengths
            if size1 <= size2:
                arr1.append(num)
                bit1.update(idx, 1)
                size1 += 1
            else:
                arr2.append(num)
                bit2.update(idx, 1)
                size2 += 1

    # Step 5: Combine results
    return arr1 + arr2
```

```javascript
// Time: O(n log n) | Space: O(n)
class FenwickTree {
  constructor(n) {
    this.n = n;
    this.bit = new Array(n + 1).fill(0); // 1-indexed BIT
  }

  update(idx, delta) {
    // Add delta to position idx (1-indexed)
    while (idx <= this.n) {
      this.bit[idx] += delta;
      idx += idx & -idx; // Move to next responsible index
    }
  }

  query(idx) {
    // Get prefix sum from 1 to idx (1-indexed)
    let res = 0;
    while (idx > 0) {
      res += this.bit[idx];
      idx -= idx & -idx; // Move to parent
    }
    return res;
  }
}

function resultArray(nums) {
  // Step 1: Coordinate compression
  const sortedUnique = [...new Set(nums)].sort((a, b) => a - b);
  const valueToIdx = new Map();
  sortedUnique.forEach((val, i) => valueToIdx.set(val, i + 1)); // 1-indexed

  // Step 2: Initialize Fenwick Trees for arr1 and arr2
  const m = sortedUnique.length;
  const bit1 = new FenwickTree(m);
  const bit2 = new FenwickTree(m);

  // Step 3: Initialize arrays and track their sizes
  const arr1 = [],
    arr2 = [];
  let size1 = 0,
    size2 = 0;

  // Step 4: Process each element
  for (const num of nums) {
    const idx = valueToIdx.get(num);

    // Calculate greater counts:
    // total elements - elements ≤ current value = elements > current value
    const greater1 = size1 - bit1.query(idx); // Elements in arr1 > num
    const greater2 = size2 - bit2.query(idx); // Elements in arr2 > num

    // Decision logic
    if (greater1 > greater2) {
      arr1.push(num);
      bit1.update(idx, 1); // Add num to arr1's BIT
      size1++;
    } else if (greater1 < greater2) {
      arr2.push(num);
      bit2.update(idx, 1); // Add num to arr2's BIT
      size2++;
    } else {
      // Counts equal, check lengths
      if (size1 <= size2) {
        arr1.push(num);
        bit1.update(idx, 1);
        size1++;
      } else {
        arr2.push(num);
        bit2.update(idx, 1);
        size2++;
      }
    }
  }

  // Step 5: Combine results
  return [...arr1, ...arr2];
}
```

```java
// Time: O(n log n) | Space: O(n)
class FenwickTree {
    private int n;
    private int[] bit;

    public FenwickTree(int n) {
        this.n = n;
        this.bit = new int[n + 1];  // 1-indexed BIT
    }

    public void update(int idx, int delta) {
        // Add delta to position idx (1-indexed)
        while (idx <= n) {
            bit[idx] += delta;
            idx += idx & -idx;  // Move to next responsible index
        }
    }

    public int query(int idx) {
        // Get prefix sum from 1 to idx (1-indexed)
        int res = 0;
        while (idx > 0) {
            res += bit[idx];
            idx -= idx & -idx;  // Move to parent
        }
        return res;
    }
}

public int[] resultArray(int[] nums) {
    // Step 1: Coordinate compression
    Set<Integer> set = new TreeSet<>();
    for (int num : nums) set.add(num);

    List<Integer> sortedUnique = new ArrayList<>(set);
    Map<Integer, Integer> valueToIdx = new HashMap<>();
    for (int i = 0; i < sortedUnique.size(); i++) {
        valueToIdx.put(sortedUnique.get(i), i + 1);  // 1-indexed
    }

    // Step 2: Initialize Fenwick Trees for arr1 and arr2
    int m = sortedUnique.size();
    FenwickTree bit1 = new FenwickTree(m);
    FenwickTree bit2 = new FenwickTree(m);

    // Step 3: Initialize arrays and track their sizes
    List<Integer> arr1 = new ArrayList<>();
    List<Integer> arr2 = new ArrayList<>();
    int size1 = 0, size2 = 0;

    // Step 4: Process each element
    for (int num : nums) {
        int idx = valueToIdx.get(num);

        // Calculate greater counts:
        // total elements - elements ≤ current value = elements > current value
        int greater1 = size1 - bit1.query(idx);  // Elements in arr1 > num
        int greater2 = size2 - bit2.query(idx);  // Elements in arr2 > num

        // Decision logic
        if (greater1 > greater2) {
            arr1.add(num);
            bit1.update(idx, 1);  // Add num to arr1's BIT
            size1++;
        } else if (greater1 < greater2) {
            arr2.add(num);
            bit2.update(idx, 1);  // Add num to arr2's BIT
            size2++;
        } else {
            // Counts equal, check lengths
            if (size1 <= size2) {
                arr1.add(num);
                bit1.update(idx, 1);
                size1++;
            } else {
                arr2.add(num);
                bit2.update(idx, 1);
                size2++;
            }
        }
    }

    // Step 5: Combine results
    List<Integer> result = new ArrayList<>(arr1);
    result.addAll(arr2);
    return result.stream().mapToInt(i -> i).toArray();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Coordinate compression: O(n log n) for sorting unique values
- Processing n elements: For each element, we perform:
  - O(log n) for BIT query (to get count of elements ≤ current value)
  - O(log n) for BIT update (to add new element)
  - Total: O(n log n)

**Space Complexity: O(n)**

- O(n) for storing the compressed mapping
- O(n) for the two Fenwick Trees (each of size m ≤ n)
- O(n) for the output arrays
- Total: O(n)

## Common Mistakes

1. **Forgetting coordinate compression**: Without compression, the Fenwick Tree would need to be sized for the maximum possible value (which could be huge, up to 10⁹). This would make memory usage impractical.

2. **Off-by-one errors with BIT indices**: Fenwick Trees are typically 1-indexed. A common mistake is using 0-indexing, which breaks the bit manipulation operations (`idx & -idx`).

3. **Incorrect greater count calculation**: The formula is `greater = total - query(idx)`, not `query(idx)` alone. `query(idx)` gives count of elements ≤ current value, so we subtract from total to get count > current value.

4. **Not tracking array sizes separately**: You need to know the total number of elements in each BIT to calculate the greater count. Don't rely on the BIT's total sum, as it might not equal the array size if there are duplicate values.

## When You'll See This Pattern

This pattern of using Fenwick Trees or Segment Trees for dynamic range queries appears in several problems:

1. **Count of Smaller Numbers After Self (LeetCode 315)**: Similar need to count how many elements to the right are smaller than current element. Uses BIT with coordinate compression.

2. **Reverse Pairs (LeetCode 493)**: Count pairs where nums[i] > 2\*nums[j] and i < j. Requires tracking elements and querying counts.

3. **Range Sum Query - Mutable (LeetCode 307)**: Classic BIT/Segment Tree problem for dynamic range sum queries.

The key signal is when you need to maintain a collection of numbers and frequently answer queries about counts/sums in certain ranges while adding new elements.

## Key Takeaways

1. **Fenwick Trees excel at dynamic prefix sum queries**: When you need to frequently query prefix sums and update values, BIT offers O(log n) for both operations with simple implementation.

2. **Coordinate compression is essential for large value ranges**: When values can be large but count of unique values is manageable, map them to dense indices to use array-based data structures efficiently.

3. **Recognize "greater count" as prefix sum problem**: Counting elements greater than a value is equivalent to: total elements - elements ≤ value. This transforms the problem into prefix sum queries.

Related problems: [Split Array Largest Sum](/problem/split-array-largest-sum), [Divide Array Into Equal Pairs](/problem/divide-array-into-equal-pairs)
