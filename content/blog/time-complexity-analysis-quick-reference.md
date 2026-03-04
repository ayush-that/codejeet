---
title: "Time Complexity Analysis: A Quick Reference for Interviews"
description: "Stop guessing Big-O. Learn to analyze time and space complexity for common patterns, recursive algorithms, and data structure operations."
date: "2026-07-15"
category: "tips"
tags: ["time complexity", "Big-O", "algorithms", "interview prep"]
---

Every coding interview ends with "What is the time and space complexity?" Guessing signals weak fundamentals. This reference teaches you to analyze complexity systematically.

## Common Complexities

**O(1)** -- Constant. Hash map lookups, array access by index, stack push/pop.

**O(log n)** -- Logarithmic. Problem size halved each step. Binary search, balanced BST operations.

**O(n)** -- Linear. Process each element once. Single-pass scans, hash map construction.

**O(n log n)** -- Linearithmic. Comparison-based sorting (merge sort, heap sort). If your solution sorts first, the floor is O(n log n).

**O(n^2)** -- Quadratic. Nested loops over input. Bubble sort, brute-force pair finding. Usually the naive solution you should optimize.

**O(2^n)** -- Exponential. Branching recursion without memoization. Fibonacci without caching, generating all subsets.

**O(n!)** -- Factorial. Generating all permutations. Backtracking with full exploration.

## Analyzing Loops

Single loop over n elements: O(n). Nested loops both over n: O(n^2). Inner loop depends on outer (runs i times): still O(n^2) since 1+2+...+n = n(n+1)/2. Loop halving input: O(log n). Outer loop O(n) with inner O(log n): O(n log n).

Let's illustrate these patterns with concrete code examples.

**Single Loop - O(n):** A simple traversal to find a maximum value.

<div class="code-group">

```python
def find_max(arr):
    max_val = float('-inf')
    for num in arr:          # Single loop over n elements
        if num > max_val:
            max_val = num
    return max_val
```

```javascript
function findMax(arr) {
  let maxVal = -Infinity;
  for (let num of arr) {
    // Single loop over n elements
    if (num > maxVal) {
      maxVal = num;
    }
  }
  return maxVal;
}
```

```java
public int findMax(int[] arr) {
    int maxVal = Integer.MIN_VALUE;
    for (int num : arr) {    // Single loop over n elements
        if (num > maxVal) {
            maxVal = num;
        }
    }
    return maxVal;
}
```

</div>

**Nested Loops - O(n²):** A naive algorithm to find all pairs.

<div class="code-group">

```python
def find_all_pairs(arr):
    pairs = []
    n = len(arr)
    for i in range(n):          # Outer loop runs n times
        for j in range(i + 1, n): # Inner loop runs n-i-1 times
            pairs.append((arr[i], arr[j]))
    return pairs
```

```javascript
function findAllPairs(arr) {
  const pairs = [];
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    // Outer loop runs n times
    for (let j = i + 1; j < n; j++) {
      // Inner loop runs n-i-1 times
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}
```

```java
public List<int[]> findAllPairs(int[] arr) {
    List<int[]> pairs = new ArrayList<>();
    int n = arr.length;
    for (int i = 0; i < n; i++) {          // Outer loop runs n times
        for (int j = i + 1; j < n; j++) {  // Inner loop runs n-i-1 times
            pairs.add(new int[]{arr[i], arr[j]});
        }
    }
    return pairs;
}
```

</div>

**Loop Halving Input - O(log n):** Binary search is the classic example.

<div class="code-group">

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1   # Discard left half
        else:
            right = mid - 1  # Discard right half
    return -1
```

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1; // Discard left half
    } else {
      right = mid - 1; // Discard right half
    }
  }
  return -1;
}
```

```java
public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;   // Discard left half
        } else {
            right = mid - 1;  // Discard right half
        }
    }
    return -1;
}
```

</div>

## Analyzing Recursion

**Recursion tree method.** Draw the tree, sum work at all nodes. Fibonacci: ~2^n nodes, O(1) each = O(2^n). With memoization: n unique calls = O(n). Merge sort: log n levels, O(n) work per level = O(n log n).

Let's examine the naive Fibonacci recursion (O(2ⁿ)) versus the memoized version (O(n)).

<div class="code-group">

```python
# Naive Fibonacci - O(2ⁿ) time, O(n) space (call stack depth)
def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

# Memoized Fibonacci - O(n) time, O(n) space
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]
```

```javascript
// Naive Fibonacci - O(2ⁿ) time, O(n) space (call stack depth)
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Memoized Fibonacci - O(n) time, O(n) space
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

```java
import java.util.HashMap;

public class Fibonacci {
    // Naive Fibonacci - O(2ⁿ) time, O(n) space (call stack depth)
    public int fibNaive(int n) {
        if (n <= 1) return n;
        return fibNaive(n - 1) + fibNaive(n - 2);
    }

    // Memoized Fibonacci - O(n) time, O(n) space
    public int fibMemo(int n) {
        return fibMemoHelper(n, new HashMap<>());
    }

    private int fibMemoHelper(int n, HashMap<Integer, Integer> memo) {
        if (memo.containsKey(n)) return memo.get(n);
        if (n <= 1) return n;
        int result = fibMemoHelper(n - 1, memo) + fibMemoHelper(n - 2, memo);
        memo.put(n, result);
        return result;
    }
}
```

</div>

**Master theorem (simplified).** For `T(n) = a * T(n/b) + O(n^d)`:

- `d > log_b(a)`: O(n^d) -- top level dominates
- `d == log_b(a)`: O(n^d \* log n) -- work evenly distributed
- `d < log_b(a)`: O(n^(log_b(a))) -- leaves dominate

Merge sort: a=2, b=2, d=1. d == log_2(2), so O(n log n). Binary search: a=1, b=2, d=0, so O(log n).

Let's see how the Master Theorem applies to Merge Sort.

<div class="code-group">

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])   # T(n/2)
    right = merge_sort(arr[mid:])  # T(n/2)
    return merge(left, right)      # O(n) work to merge

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid)); // T(n/2)
  const right = mergeSort(arr.slice(mid)); // T(n/2)
  return merge(left, right); // O(n) work to merge
}

function merge(left, right) {
  const result = [];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

```java
import java.util.Arrays;

public class MergeSort {
    public int[] mergeSort(int[] arr) {
        if (arr.length <= 1) return arr;
        int mid = arr.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));   // T(n/2)
        int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length)); // T(n/2)
        return merge(left, right);                                 // O(n) work to merge
    }

    private int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }
}
```

</div>

Here, the recurrence is `T(n) = 2T(n/2) + O(n)`. So `a = 2`, `b = 2`, `d = 1`. Since `log_b(a) = log_2(2) = 1`, and `d == log_b(a)`, we are in case 2, resulting in `O(n^d * log n) = O(n log n)`.

## Space Complexity

**Call stack.** Recursive solutions use O(depth) space. Balanced tree: O(log n). Linear recursion: O(n).

**Auxiliary structures.** Hash map for frequency: O(n) worst case. Fixed array of 26 chars: O(1).

**Sorting space.** Merge sort: O(n). Quick sort: O(log n) average. Heap sort: O(1).

Consider a function that counts character frequencies. Its space complexity depends on the auxiliary data structure used.

<div class="code-group">

```python
# O(n) space - using a hash map that can grow with input size
def count_freq_hash(s):
    freq = {}
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1
    return freq

# O(1) space - using a fixed-size array for lowercase letters
def count_freq_array(s):
    freq = [0] * 26  # Fixed size, independent of input length
    for ch in s:
        if 'a' <= ch <= 'z':
            idx = ord(ch) - ord('a')
            freq[idx] += 1
    return freq
```

```javascript
// O(n) space - using a hash map that can grow with input size
function countFreqHash(s) {
  const freq = new Map();
  for (let ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  return freq;
}

// O(1) space - using a fixed-size array for lowercase letters
function countFreqArray(s) {
  const freq = new Array(26).fill(0); // Fixed size
  for (let ch of s) {
    if (ch >= "a" && ch <= "z") {
      const idx = ch.charCodeAt(0) - "a".charCodeAt(0);
      freq[idx]++;
    }
  }
  return freq;
}
```

```java
import java.util.HashMap;

public class FrequencyCounter {
    // O(n) space - using a hash map that can grow with input size
    public HashMap<Character, Integer> countFreqHash(String s) {
        HashMap<Character, Integer> freq = new HashMap<>();
        for (char ch : s.toCharArray()) {
            freq.put(ch, freq.getOrDefault(ch, 0) + 1);
        }
        return freq;
    }

    // O(1) space - using a fixed-size array for lowercase letters
    public int[] countFreqArray(String s) {
        int[] freq = new int[26]; // Fixed size
        for (char ch : s.toCharArray()) {
            if (ch >= 'a' && ch <= 'z') {
                int idx = ch - 'a';
                freq[idx]++;
            }
        }
        return freq;
    }
}
```

</div>

## Data Structure Costs

| Operation | Array | Hash Map | BST (balanced) | Heap     |
| --------- | ----- | -------- | -------------- | -------- |
| Access    | O(1)  | --       | --             | --       |
| Search    | O(n)  | O(1) avg | O(log n)       | O(n)     |
| Insert    | O(n)  | O(1) avg | O(log n)       | O(log n) |
| Delete    | O(n)  | O(1) avg | O(log n)       | O(log n) |
| Min/Max   | O(n)  | O(n)     | O(log n)       | O(1)     |

Understanding these costs in practice is crucial. Let's look at examples of operations with different complexities across data structures.

**Array Insert vs. Heap Insert:** Inserting into an unsorted array at the end is O(1), but inserting into a sorted position is O(n). Inserting into a heap is always O(log n).

<div class="code-group">

```python
# Array: Insert at end is O(1), but insert in sorted order is O(n)
def insert_sorted_array(arr, val):
    i = len(arr) - 1
    arr.append(val)  # Amortized O(1)
    # Shift elements to maintain sorted order: O(n) worst case
    while i >= 0 and arr[i] > val:
        arr[i + 1] = arr[i]
        i -= 1
    arr[i + 1] = val

# Heap: Insert is O(log n)
import heapq
def insert_into_heap(heap, val):
    heapq.heappush(heap, val)  # O(log n)
```

```javascript
// Array: Insert at end is O(1), but insert in sorted order is O(n)
function insertSortedArray(arr, val) {
  let i = arr.length - 1;
  arr.push(val); // O(1)
  // Shift elements to maintain sorted order: O(n) worst case
  while (i >= 0 && arr[i] > val) {
    arr[i + 1] = arr[i];
    i--;
  }
  arr[i + 1] = val;
}

// Heap: Insert is O(log n) - using a MinHeap class
class MinHeap {
  constructor() {
    this.heap = [];
  }
  insert(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1); // O(log n)
  }
  _bubbleUp(index) {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }
}
```

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.PriorityQueue;

public class DataStructureOperations {
    // Array: Insert at end is O(1), but insert in sorted order is O(n)
    public void insertSortedArray(ArrayList<Integer> arr, int val) {
        int i = arr.size() - 1;
        arr.add(val); // Amortized O(1)
        // Shift elements to maintain sorted order: O(n) worst case
        while (i >= 0 && arr.get(i) > val) {
            arr.set(i + 1, arr.get(i));
            i--;
        }
        arr.set(i + 1, val);
    }

    // Heap: Insert is O(log n)
    public void insertIntoHeap(PriorityQueue<Integer> heap, int val) {
        heap.offer(val); // O(log n)
    }
}
```

</div>

**Hash Map Search vs. Array Search:** Searching for an element in an unsorted array is O(n), while a hash map provides average O(1) lookup.

<div class="code-group">

```python
# Array search: O(n)
def search_array(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Hash map search: O(1) average
def search_hash_map(hash_map, key):
    return hash_map.get(key, -1)  # O(1) average
```

```javascript
// Array search: O(n)
function searchArray(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Hash map search: O(1) average
function searchHashMap(map, key) {
  return map.has(key) ? map.get(key) : -1; // O(1) average
}
```

```java
import java.util.HashMap;

public class SearchComparison {
    // Array search: O(n)
    public int searchArray(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }

    // Hash map search: O(1) average
    public int searchHashMap(HashMap<Integer, Integer> map, int key) {
        return map.getOrDefault(key, -1); // O(1) average
    }
}
```

</div>

## Amortized Analysis

Dynamic array append is O(1) amortized -- the expensive O(n) resize happens infrequently. Over n appends, total work is O(n). Same principle applies to hash map inserts and union-find operations.

Let's simulate the amortized cost of appending to a dynamic array. While an individual append might trigger an expensive resize, the average cost over many operations is constant.

<div class="code-group">

```python
class DynamicArray:
    def __init__(self, capacity=2):
        self.capacity = capacity
        self.size = 0
        self.arr = [None] * capacity

    def append(self, val):
        if self.size == self.capacity:
            self._resize()  # O(n) operation
        self.arr[self.size] = val
        self.size += 1

    def _resize(self):
        print(f"Resizing from {self.capacity} to {self.capacity * 2}")
        new_arr = [None] * (self.capacity * 2)
        for i in range(self.size):
            new_arr[i] = self.arr[i]  # Copy old elements: O(n)
        self.arr = new_arr
        self.capacity *= 2

# Amortized analysis: Over n appends, total work is O(n), so average O(1) per append
def demonstrate_amortized():
    da = DynamicArray()
    for i in range(10):
        da.append(i)
```

```javascript
class DynamicArray {
  constructor(capacity = 2) {
    this.capacity = capacity;
    this.size = 0;
    this.arr = new Array(capacity);
  }

  append(val) {
    if (this.size === this.capacity) {
      this._resize(); // O(n) operation
    }
    this.arr[this.size] = val;
    this.size++;
  }

  _resize() {
    console.log(`Resizing from ${this.capacity} to ${this.capacity * 2}`);
    const newArr = new Array(this.capacity * 2);
    for (let i = 0; i < this.size; i++) {
      newArr[i] = this.arr[i]; // Copy old elements: O(n)
    }
    this.arr = newArr;
    this.capacity *= 2;
  }
}

// Amortized analysis: Over n appends, total work is O(n), so average O(1) per append
function demonstrateAmortized() {
  const da = new DynamicArray();
  for (let i = 0; i < 10; i++) {
    da.append(i);
  }
}
```

```java
class DynamicArray {
    private int capacity;
    private int size;
    private Integer[] arr;

    public DynamicArray(int capacity) {
        this.capacity = capacity;
        this.size = 0;
        this.arr = new Integer[capacity];
    }

    public DynamicArray() {
        this(2);
    }

    public void append(int val) {
        if (size == capacity) {
            resize(); // O(n) operation
        }
        arr[size] = val;
        size++;
    }

    private void resize() {
        System.out.println("Resizing from " + capacity + " to " + capacity * 2);
        Integer[] newArr = new Integer[capacity * 2];
        for (int i = 0; i < size; i++) {
            newArr[i] = arr[i]; // Copy old elements: O(n)
        }
        arr = newArr;
        capacity *= 2;
    }
}

// Amortized analysis: Over n appends, total work is O(n), so average O(1) per append
public class AmortizedDemo {
    public static void demonstrateAmortized() {
        DynamicArray da = new DynamicArray();
        for (int i = 0; i < 10; i++) {
            da.append(i);
        }
    }
}
```

</div>

The key insight is that resizes happen at powers of 2 (after 2, 4, 8, 16... elements). The total copy work for n inserts is proportional to n (specifically, less than 2n), making the average cost per insert constant.

## Communicating in Interviews

State both time and space. Be specific: "O(n log n) due to sorting, O(n) space for the hash map." Walk through the reasoning rather than guessing. Count loops, identify the dominant term, state it. Interviewers prefer correct reasoning at a slower pace over a fast wrong answer.

Let's analyze a complete example: Finding two numbers in an array that sum to a target.

**Naive Solution (O(n²) time, O(1) space):** Check all pairs.

**Optimized Solution (O(n) time, O(n) space):** Use a hash map for constant-time lookups.

<div class="code-group">

```python
def two_sum_naive(nums, target):
    # O(n²) time, O(1) space
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

def two_sum_optimized(nums, target):
    # O(n) time, O(n) space
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:          # O(1) average lookup
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
function twoSumNaive(nums, target) {
  // O(n²) time, O(1) space
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

function twoSumOptimized(nums, target) {
  // O(n) time, O(n) space
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      // O(1) average lookup
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```

```java
import java.util.HashMap;

public class TwoSum {
    // O(n²) time, O(1) space
    public int[] twoSumNaive(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }

    // O(n) time, O(n) space
    public int[] twoSumOptimized(int[] nums, int target) {
        HashMap<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) { // O(1) average lookup
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

</div>

When communicating complexity for the optimized solution, you should say: "This solution runs in O(n) time because we make a single pass through the array, and each hash map lookup and insert is O(1) on average. The space complexity is O(n) in the worst case to store up to n elements in the hash map."

Remember to:

1. **Identify the input size `n`** (usually the length of the primary data structure).
2. **Count the dominant operations** (loops, recursive calls).
3. **Consider auxiliary data structures** for space complexity.
4. **State any assumptions** (e.g., "assuming a good hash function").
5. **Mention trade-offs** when comparing approaches.

By systematically applying these principles and practicing with concrete examples, you'll develop the intuition to quickly and accurately analyze complexity in any interview scenario.
