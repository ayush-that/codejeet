---
title: "How to Crack Goldman Sachs Coding Interviews in 2026"
description: "Complete guide to Goldman Sachs coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-06-28"
category: "company-guide"
company: "goldman-sachs"
tags: ["goldman sachs", "interview prep", "leetcode"]
---

Goldman Sachs has invested heavily in positioning itself as a technology company that happens to be in finance, and its engineering interview process reflects that shift. The typical loop for a software engineering role includes a recruiter screen, a HackerRank or CoderPad online assessment, one to two technical phone interviews, and a "Super Day" on-site of three to five rounds. The on-site is where the real evaluation happens — each round is 45 to 60 minutes and covers a mix of coding, system design (for senior roles), and behavioral questions. Goldman interviewers are often engineers who work on the firm's internal platforms: the Securities Division's trading systems, the Marcus consumer banking platform, or the GS Financial Cloud.

What distinguishes Goldman from pure tech companies is the expectation that you understand — or at least appreciate — the financial domain. You do not need to be a quant, but demonstrating awareness of how software drives modern finance will resonate with interviewers. Problems sometimes have a financial flavor, involving calculations on datasets, time-series processing, or optimization under constraints that mirror real trading scenarios.

## By the Numbers

Goldman Sachs has a focused question bank of **270 questions**. The difficulty distribution leans toward medium and hard:

- **Easy: 51 questions (19%)**
- **Medium: 171 questions (63%)**
- **Hard: 48 questions (18%)**

The 63% medium rate is the highest of any company in this guide, meaning the vast majority of what you will face are medium-level problems. The 18% hard rate is moderate — similar to Amazon — and the 19% easy rate means you will occasionally get an approachable warm-up question. Overall, the difficulty profile is manageable if you have strong medium-level skills, but do not neglect hard problems entirely.

## Top Topics to Focus On

**Arrays** — Array manipulation is the most-tested topic at Goldman. Problems involve sorting, searching, aggregation, and transformation of numerical sequences. Given the financial context, these often involve processing numerical data in ways that model real calculations — think profit/loss computations, sliding window averages, or threshold-based filtering. For example, you might be asked to calculate the maximum profit from a time series of stock prices, which is a classic array problem.

<div class="code-group">

```python
def max_profit(prices):
    """
    Calculates the maximum profit from a single buy and sell transaction.
    """
    if not prices:
        return 0
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit

# Example usage
prices = [7, 1, 5, 3, 6, 4]
print(max_profit(prices))  # Output: 5 (buy at 1, sell at 6)
```

```javascript
function maxProfit(prices) {
  if (prices.length === 0) return 0;
  let minPrice = Infinity;
  let maxProfit = 0;
  for (let price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  return maxProfit;
}

// Example usage
const prices = [7, 1, 5, 3, 6, 4];
console.log(maxProfit(prices)); // Output: 5
```

```java
public class ArrayProfit {
    public static int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }

    public static void main(String[] args) {
        int[] prices = {7, 1, 5, 3, 6, 4};
        System.out.println(maxProfit(prices)); // Output: 5
    }
}
```

</div>

**Strings** — String problems at Goldman frequently involve parsing and formatting. Processing structured text data, validating formats, and transforming between representations are common. These problems reward careful attention to specification details and edge case handling. A typical problem might involve validating if a given string is a properly formatted financial identifier or converting between different date/time string formats used in transaction logs.

<div class="code-group">

```python
def is_valid_isin(isin_str):
    """
    Basic validation for an International Securities Identification Number (ISIN).
    Format: 2-letter country code, 9-character alphanumeric NSIN, 1 check digit.
    """
    if not isin_str or len(isin_str) != 12:
        return False
    if not isin_str[:2].isalpha():
        return False
    if not isin_str[2:11].isalnum():
        return False
    # In reality, the check digit calculation is more complex (LUHN algorithm)
    if not isin_str[11].isdigit():
        return False
    return True

# Example usage
print(is_valid_isin("US0378331005"))  # Output: True (Apple's ISIN)
print(is_valid_isin("US037833100"))   # Output: False (too short)
```

```javascript
function isValidISIN(isinStr) {
  if (!isinStr || isinStr.length !== 12) return false;
  if (!/^[A-Z]{2}$/.test(isinStr.substring(0, 2))) return false;
  if (!/^[A-Z0-9]{9}$/.test(isinStr.substring(2, 11))) return false;
  if (!/^\d$/.test(isinStr[11])) return false;
  return true;
}

// Example usage
console.log(isValidISIN("US0378331005")); // true
console.log(isValidISIN("US037833100")); // false
```

```java
public class StringValidation {
    public static boolean isValidISIN(String isinStr) {
        if (isinStr == null || isinStr.length() != 12) return false;
        if (!isinStr.substring(0, 2).matches("[A-Z]{2}")) return false;
        if (!isinStr.substring(2, 11).matches("[A-Z0-9]{9}")) return false;
        if (!Character.isDigit(isinStr.charAt(11))) return false;
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isValidISIN("US0378331005")); // true
        System.out.println(isValidISIN("US037833100"));  // false
    }
}
```

</div>

**Hash Tables** — Efficient data retrieval and aggregation using hash maps are fundamental to Goldman's interview problems. Practice grouping, counting, and lookup problems. Goldman also values understanding of performance characteristics — when hash tables degrade and why. A common scenario is finding pairs of transactions that sum to a target value or grouping trades by instrument symbol.

<div class="code-group">

```python
def find_pairs(transactions, target_sum):
    """
    Find all pairs of transaction amounts that sum to a target value.
    Returns list of tuples (amount1, amount2).
    """
    seen = {}
    pairs = []
    for i, amount in enumerate(transactions):
        complement = target_sum - amount
        if complement in seen:
            for idx in seen[complement]:
                pairs.append((complement, amount))
        seen.setdefault(amount, []).append(i)
    return pairs

# Example usage
txns = [100, 200, 300, 100, 400, 50, 150]
target = 250
print(find_pairs(txns, target))
# Output: [(100, 150), (200, 50), (100, 150)]
```

```javascript
function findPairs(transactions, targetSum) {
  const seen = new Map();
  const pairs = [];
  transactions.forEach((amount, i) => {
    const complement = targetSum - amount;
    if (seen.has(complement)) {
      seen.get(complement).forEach((idx) => {
        pairs.push([complement, amount]);
      });
    }
    if (!seen.has(amount)) seen.set(amount, []);
    seen.get(amount).push(i);
  });
  return pairs;
}

// Example usage
const txns = [100, 200, 300, 100, 400, 50, 150];
const target = 250;
console.log(findPairs(txns, target));
// Output: [[100, 150], [200, 50], [100, 150]]
```

```java
import java.util.*;

public class HashTablePairs {
    public static List<int[]> findPairs(int[] transactions, int targetSum) {
        Map<Integer, List<Integer>> seen = new HashMap<>();
        List<int[]> pairs = new ArrayList<>();
        for (int i = 0; i < transactions.length; i++) {
            int amount = transactions[i];
            int complement = targetSum - amount;
            if (seen.containsKey(complement)) {
                for (int idx : seen.get(complement)) {
                    pairs.add(new int[]{complement, amount});
                }
            }
            seen.computeIfAbsent(amount, k -> new ArrayList<>()).add(i);
        }
        return pairs;
    }

    public static void main(String[] args) {
        int[] txns = {100, 200, 300, 100, 400, 50, 150};
        int target = 250;
        List<int[]> result = findPairs(txns, target);
        for (int[] pair : result) {
            System.out.println(Arrays.toString(pair));
        }
    }
}
```

</div>

**Dynamic Programming** — DP appears at Goldman at a moderate frequency, typically in its more recognizable forms. Sequence problems (longest increasing subsequence, maximum profit), string DP (edit distance), and optimization problems are the most common variants. Goldman DP problems are usually well-specified and reward methodical state definition. A classic problem is calculating the maximum profit with multiple transactions (buying and selling stocks with constraints).

<div class="code-group">

```python
def max_profit_multiple(prices):
    """
    Maximum profit with multiple transactions (buy and sell multiple times).
    You may complete as many transactions as you like.
    """
    if not prices:
        return 0
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit

# Example usage
prices = [7, 1, 5, 3, 6, 4]
print(max_profit_multiple(prices))  # Output: 7 (Buy 1, sell 5; buy 3, sell 6)
```

```javascript
function maxProfitMultiple(prices) {
  if (prices.length === 0) return 0;
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}

// Example usage
const prices = [7, 1, 5, 3, 6, 4];
console.log(maxProfitMultiple(prices)); // Output: 7
```

```java
public class DynamicProgrammingProfit {
    public static int maxProfitMultiple(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }
        return profit;
    }

    public static void main(String[] args) {
        int[] prices = {7, 1, 5, 3, 6, 4};
        System.out.println(maxProfitMultiple(prices)); // Output: 7
    }
}
```

</div>

**Math** — Given Goldman's domain, math shows up more meaningfully than at most pure tech companies. Expect problems involving arithmetic precision, statistical calculations, probability, and optimization. Some problems may require understanding of financial concepts at a basic level — compound interest, rate calculations, or portfolio optimization variants. For instance, you might need to calculate the future value of an investment with compound interest.

<div class="code-group">

```python
def future_value(principal, annual_rate, years, compounds_per_year):
    """
    Calculate future value with compound interest.
    FV = P * (1 + r/n)^(n*t)
    """
    rate_per_period = annual_rate / compounds_per_year
    periods = compounds_per_year * years
    return principal * ((1 + rate_per_period) ** periods)

# Example usage: $1000 at 5% APR, compounded monthly for 10 years
fv = future_value(1000, 0.05, 10, 12)
print(f"${fv:.2f}")  # Output: $1647.01
```

```javascript
function futureValue(principal, annualRate, years, compoundsPerYear) {
  const ratePerPeriod = annualRate / compoundsPerYear;
  const periods = compoundsPerYear * years;
  return principal * Math.pow(1 + ratePerPeriod, periods);
}

// Example usage
const fv = futureValue(1000, 0.05, 10, 12);
console.log(`$${fv.toFixed(2)}`); // Output: $1647.01
```

```java
public class FinancialMath {
    public static double futureValue(double principal, double annualRate,
                                     int years, int compoundsPerYear) {
        double ratePerPeriod = annualRate / compoundsPerYear;
        int periods = compoundsPerYear * years;
        return principal * Math.pow(1 + ratePerPeriod, periods);
    }

    public static void main(String[] args) {
        double fv = futureValue(1000, 0.05, 10, 12);
        System.out.printf("$%.2f%n", fv); // Output: $1647.01
    }
}
```

</div>

## Preparation Strategy

**Weeks 1-2: Core Algorithms and Data Structures.** Start with arrays, strings, hash tables, and sorting. Solve 6-8 problems per day at medium difficulty. Goldman interviews value correctness and clean code over raw speed, so focus on getting problems right the first time. After each solution, review it for bugs and consider how you would explain your approach to someone else. Implement fundamental sorting algorithms to understand their trade-offs, as sorting is often a component of array problems.

<div class="code-group">

```python
# Example: QuickSort implementation for practice
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Example usage
arr = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(arr))  # Output: [1, 1, 2, 3, 6, 8, 10]
```

```javascript
// QuickSort implementation
function quicksort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => x < pivot);
  const middle = arr.filter((x) => x === pivot);
  const right = arr.filter((x) => x > pivot);
  return [...quicksort(left), ...middle, ...quicksort(right)];
}

// Example usage
const arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quicksort(arr)); // [1, 1, 2, 3, 6, 8, 10]
```

```java
import java.util.*;

public class SortingPractice {
    public static List<Integer> quicksort(List<Integer> arr) {
        if (arr.size() <= 1) return arr;
        int pivot = arr.get(arr.size() / 2);
        List<Integer> left = new ArrayList<>();
        List<Integer> middle = new ArrayList<>();
        List<Integer> right = new ArrayList<>();
        for (int x : arr) {
            if (x < pivot) left.add(x);
            else if (x == pivot) middle.add(x);
            else right.add(x);
        }
        List<Integer> result = new ArrayList<>();
        result.addAll(quicksort(left));
        result.addAll(middle);
        result.addAll(quicksort(right));
        return result;
    }

    public static void main(String[] args) {
        List<Integer> arr = Arrays.asList(3, 6, 8, 10, 1, 2, 1);
        System.out.println(quicksort(arr)); // [1, 1, 2, 3, 6, 8, 10]
    }
}
```

</div>

**Week 3: Trees, Graphs, and Advanced Data Structures.** Cover binary trees (traversals, BST operations, path problems), basic graph algorithms (BFS, DFS, connected components), and useful data structures like heaps and tries. Goldman does not test these as heavily as pure tech companies, but they appear often enough that you cannot afford to skip them. Solve 20-25 problems this week. Practice implementing a binary search tree with insertion and search operations.

<div class="code-group">

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
            return
        self._insert_recursive(self.root, val)

    def _insert_recursive(self, node, val):
        if val < node.val:
            if node.left:
                self._insert_recursive(node.left, val)
            else:
                node.left = TreeNode(val)
        else:
            if node.right:
                self._insert_recursive(node.right, val)
            else:
                node.right = TreeNode(val)

    def search(self, val):
        return self._search_recursive(self.root, val)

    def _search_recursive(self, node, val):
        if not node:
            return False
        if node.val == val:
            return True
        elif val < node.val:
            return self._search_recursive(node.left, val)
        else:
            return self._search_recursive(node.right, val)

# Example usage
bst = BST()
for num in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(num)
print(bst.search(4))  # True
print(bst.search(9))  # False
```

```javascript
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    if (!this.root) {
      this.root = new TreeNode(val);
      return;
    }
    this._insertRecursive(this.root, val);
  }

  _insertRecursive(node, val) {
    if (val < node.val) {
      if (node.left) {
        this._insertRecursive(node.left, val);
      } else {
        node.left = new TreeNode(val);
      }
    } else {
      if (node.right) {
        this._insertRecursive(node.right, val);
      } else {
        node.right = new TreeNode(val);
      }
    }
  }

  search(val) {
    return this._searchRecursive(this.root, val);
  }

  _searchRecursive(node, val) {
    if (!node) return false;
    if (node.val === val) return true;
    if (val < node.val) return this._searchRecursive(node.left, val);
    return this._searchRecursive(node.right, val);
  }
}

// Example usage
const bst = new BST();
[5, 3, 7, 1, 4, 6, 8].forEach((num) => bst.insert(num));
console.log(bst.search(4)); // true
console.log(bst.search(9)); // false
```

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class BST {
    TreeNode root;

    void insert(int val) {
        root = insertRecursive(root, val);
    }

    private TreeNode insertRecursive(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) {
            node.left = insertRecursive(node.left, val);
        } else {
            node.right = insertRecursive(node.right, val);
        }
        return node;
    }

    boolean search(int val) {
        return searchRecursive(root, val);
    }

    private boolean searchRecursive(TreeNode node, int val) {
        if (node == null) return false;
        if (node.val == val) return true;
        if (val < node.val) return searchRecursive(node.left, val);
        return searchRecursive(node.right, val);
    }

    public static void main(String[] args) {
        BST bst = new BST();
        int[] nums = {5, 3, 7, 1, 4, 6, 8};
        for (int num : nums) bst.insert(num);
        System.out.println(bst.search(4)); // true
        System.out.println(bst.search(9)); // false
    }
}
```

</div>

**Week 4: Dynamic Programming and Math.** Spend equal time on DP and math this week. For DP, cover the standard patterns and practice at least 15 problems. For math, focus on problems involving numerical precision, modular arithmetic, and number properties. Also practice problems that combine math with other techniques — for example, using math insights to optimize a DP solution. A good exercise is implementing the Fibonacci sequence using both memoization (DP) and matrix exponentiation (math optimization).

<div class="code-group">

```python
# Fibonacci with DP memoization
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Fibonacci with matrix exponentiation (O(log n))
def fib_matrix(n):
    if n == 0:
        return 0
    def multiply(a, b):
        return [
            [a[0][0]*b[0][0] + a[0][1]*b[1][0], a[0][0]*b[0][1] + a[0][1]*b[1][1]],
            [a[1][0]*b[0][0] + a[1][1]*b[1][0], a[1][0]*b[0][1] + a[1][1]*b[1][1]]
        ]
    def power(mat, exp):
        result = [[1, 0], [0, 1]]
        base = mat
        while exp > 0:
            if exp % 2 == 1:
                result = multiply(result, base)
            base = multiply(base, base)
            exp //= 2
        return result
    base_matrix = [[1, 1], [1, 0]]
    result_matrix = power(base_matrix, n-1)
    return result_matrix[0][0]

# Compare results
print(fib_memo(10))    # 55
print(fib_matrix(10))  # 55
```

```javascript
// Fibonacci with memoization
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Fibonacci with matrix exponentiation
function fibMatrix(n) {
  if (n === 0) return 0;
  function multiply(a, b) {
    return [
      [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
      [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
    ];
  }
  function power(mat, exp) {
    let result = [
      [1, 0],
      [0, 1],
    ];
    let base = mat;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = multiply(result, base);
      }
      base = multiply(base, base);
      exp = Math.floor(exp / 2);
    }
    return result;
  }
  const baseMatrix = [
    [1, 1],
    [1, 0],
  ];
  const resultMatrix = power(baseMatrix, n - 1);
  return resultMatrix[0][0];
}

console.log(fibMemo(10)); // 55
console.log(fibMatrix(10)); // 55
```

```java
import java.util.*;

public class FibonacciDP {
    // Fibonacci with memoization
    public static long fibMemo(int n, Map<Integer, Long> memo) {
        if (memo.containsKey(n)) return memo.get(n);
        if (n <= 1) return n;
        long result = fibMemo(n-1, memo) + fibMemo(n-2, memo);
        memo.put(n, result);
        return result;
    }

    // Fibonacci with matrix exponentiation
    public static long fibMatrix(int n) {
        if (n == 0) return 0;
        long[][] base = {{1, 1}, {1, 0}};
        long[][] result = power(base, n-1);
        return result[0][0];
    }

    private static long[][] multiply(long[][] a, long[][] b) {
        return new long[][]{
            {a[0][0]*b[0][0] + a[0][1]*b[1][0], a[0][0]*b[0][1] + a[0][1]*b[1][1]},
            {a[1][0]*b[0][0] + a[1][1]*b[1][0], a[1][0]*b[0][1] + a[1][1]*b[1][1]}
        };
    }

    private static long[][] power(long[][] mat, int exp) {
        long[][] result = {{1, 0}, {0, 1}};
        long[][] base = mat;
        while (exp > 0) {
            if (exp % 2 == 1) {
                result = multiply(result, base);
            }
            base = multiply(base, base);
            exp /= 2;
        }
        return result;
    }

    public static void main(String[] args) {
        Map<Integer, Long> memo = new HashMap<>();
        System.out.println(fibMemo(10, memo)); // 55
        System.out.println(fibMatrix(10));     // 55
    }
}
```

</div>

**Week 5: System Design and Domain Knowledge.** Goldman interviews for mid-level and senior roles include system design. Prepare for finance-relevant systems: a real-time market data feed, an order management system, a risk calculation pipeline, or a transaction processing system. Even if you are junior, understanding these concepts demonstrates domain awareness. Also review basic concurrency and threading concepts — Goldman's systems are heavily concurrent. Practice implementing a thread-safe data structure like a concurrent hash map or a blocking queue.

<div class="code-group">

```python
import threading
import time
from collections import defaultdict
from queue import Queue

# Simple thread-safe counter for tracking trades
class TradeCounter:
    def __init__(self):
        self._lock = threading.Lock()
        self._counts = defaultdict(int)

    def increment(self, symbol):
        with self._lock:
            self._counts[symbol] += 1

    def get_count(self, symbol):
        with self._lock:
            return self._counts[symbol]

    def get_all_counts(self):
        with self._lock:
            return dict(self._counts)

# Example usage simulating concurrent trade processing
def process_trades(counter, symbol, num_trades):
    for _ in range(num_trades):
        counter.increment(symbol)
        time.sleep(0.001)  # Simulate work

counter = TradeCounter()
threads = []
symbols = ['AAPL', 'GOOGL', 'MSFT']
for symbol in symbols:
    t = threading.Thread(target=process_trades, args=(counter, symbol, 100))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(counter.get_all_counts())  # Should show 100 for each symbol
```

```javascript
// In JavaScript (Node.js), we can simulate concurrency with worker threads
// Here's a simpler example using a mutex-like pattern with async/await
class TradeCounter {
  constructor() {
    this.counts = new Map();
    this.lock = false;
    this.queue = [];
  }

  async acquireLock() {
    while (this.lock) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    this.lock = true;
  }

  async releaseLock() {
    this.lock = false;
  }

  async increment(symbol) {
    await this.acquireLock();
    try {
      this.counts.set(symbol, (this.counts.get(symbol) || 0) + 1);
    } finally {
      await this.releaseLock();
    }
  }

  async getCount(symbol) {
    await this.acquireLock();
    try {
      return this.counts.get(symbol) || 0;
    } finally {
      await this.releaseLock();
    }
  }
}

// Simulated usage
async function simulateTrades() {
  const counter = new TradeCounter();
  const symbols = ["AAPL", "GOOGL", "MSFT"];
  const promises = symbols.map(async (symbol) => {
    for (let i = 0; i < 10; i++) {
      await counter.increment(symbol);
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
  });
  await Promise.all(promises);
  for (const symbol of symbols) {
    console.log(`${symbol}: ${await counter.getCount(symbol)}`);
  }
}
simulateTrades();
```

```java
import java.util.concurrent.*;
import java.util.*;

// Thread-safe trade counter using ConcurrentHashMap
class TradeCounter {
    private final ConcurrentHashMap<String, AtomicInteger> counts = new ConcurrentHashMap<>();

    public void increment(String symbol) {
        counts.computeIfAbsent(symbol, k -> new AtomicInteger(0)).incrementAndGet();
    }

    public int getCount(String symbol) {
        AtomicInteger count = counts.get(symbol);
        return count != null ? count.get() : 0;
    }

    public Map<String, Integer> getAllCounts() {
        Map<String, Integer> result = new HashMap<>();
        counts.forEach((symbol, atomicCount) -> {
            result.put(symbol, atomicCount.get());
        });
        return result;
    }
}

public class ConcurrencyExample {
    public static void main(String[] args) throws InterruptedException {
        TradeCounter counter = new TradeCounter();
        ExecutorService executor = Executors.newFixedThreadPool(3);
        List<String> symbols = Arrays.asList("AAPL", "GOOGL", "MSFT");

        List<Callable<Void>> tasks = new ArrayList<>();
        for (String symbol : symbols) {
            tasks.add(() -> {
                for (int i = 0; i < 100; i++) {
                    counter.increment(symbol);
                    Thread.sleep(1); // Simulate work
                }
                return null;
            });
        }

        executor.invokeAll(tasks);
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println(counter.getAllCounts()); // Should show 100 for each symbol
    }
}
```

</div>

**Week 6: Online Assessment Practice and Mock Interviews.** Goldman often uses a HackerRank assessment as a gate before the on-site. Practice timed coding assessments: two to three problems in 60-90 minutes. Then run 3-4 full mock interviews covering coding, behavioral, and system design. For behavioral prep, Goldman places heavy emphasis on teamwork, integrity, and how you handle pressure — prepare specific stories that demonstrate these qualities. Practice solving a typical OA problem: finding the maximum subarray sum (Kadane's Algorithm).

<div class="code-group">

```python
def max_subarray_sum(arr):
    """
    Kadane's Algorithm: Find the maximum sum of a contiguous subarray.
    """
    if not arr:
        return 0
    max_ending_here = max_so_far = arr[0]
    for num in arr[1:]:
        max_ending_here = max(num, max_ending_here + num)
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far

# Example usage (could represent daily P&L)
daily_pnl = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(max_subarray_sum(daily_pnl))  # Output: 6 (subarray [4, -1, 2, 1])
```

```javascript
function maxSubarraySum(arr) {
  if (arr.length === 0) return 0;
  let maxEndingHere = arr[0];
  let maxSoFar = arr[0];
  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
}

// Example usage
const dailyPnl = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubarraySum(dailyPnl)); // 6
```

```java
public class OnlineAssessmentPractice {
    public static int maxSubarraySum(int[] arr) {
        if (arr == null || arr.length == 0) return 0;
        int maxEndingHere = arr[0];
        int maxSoFar = arr[0];
        for (int i = 1; i < arr.length; i++) {
            maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        return maxSoFar;
    }

    public static void main(String[] args) {
        int[] dailyPnl = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println(maxSubarraySum(dailyPnl)); // 6
    }
}
```

</div>

## Key Tips

1. **Prepare for the online assessment seriously.** Many candidates underestimate Goldman's HackerRank round. It is a hard gate — if you do not perform well, you will not reach the on-site. Practice timed assessments to build speed and accuracy under pressure. Simulate real conditions by solving problems with a 45-minute timer.

2. **Demonstrate financial awareness.** You do not need to understand derivatives pricing, but knowing what Goldman does — investment banking, trading, asset management, consumer banking through Marcus — and showing genuine interest sets you apart from candidates who treat it as just another coding interview. Research
