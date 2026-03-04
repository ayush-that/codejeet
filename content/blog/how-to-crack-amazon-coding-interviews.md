---
title: "How to Crack Amazon Coding Interviews in 2026"
description: "Complete guide to Amazon coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-06-04"
category: "company-guide"
company: "amazon"
tags: ["amazon", "interview prep", "leetcode"]
---

Amazon's interview process is unique among big tech companies because of its heavy emphasis on Leadership Principles. Every interview round — including the coding ones — involves behavioral questions tied to Amazon's 16 Leadership Principles. A typical loop consists of a phone screen with one coding problem, followed by an on-site (or virtual) loop of four to five rounds. Each round is roughly 60 minutes: about 20 minutes of behavioral questions and 40 minutes of coding. This dual structure means that being a strong coder alone is not enough. You need to come prepared with concrete stories that demonstrate ownership, bias for action, and customer obsession, among others.

On the coding side, Amazon tends to favor practical, real-world-flavored problems. You will see questions about designing data structures, optimizing processes, and solving problems that map to the kind of work Amazon engineers do at scale.

## By the Numbers

Amazon's question bank is the second largest in the industry at **1,938 questions**. The difficulty split skews slightly easier than Google:

- **Easy: 530 questions (27%)**
- **Medium: 1,057 questions (55%)**
- **Hard: 351 questions (18%)**

With 55% of questions at the medium level, Amazon leans heavily into that middle tier. The 18% hard rate is manageable — lower than Google's 21% — but still requires preparation. You are unlikely to get through an Amazon loop without facing at least one problem that pushes into hard territory, especially for SDE II and above.

## Top Topics to Focus On

**Arrays** — Array problems are the single most common category at Amazon. Expect two-pointer techniques, sliding windows, and problems involving sorting or partitioning. Amazon's array problems often have a practical flavor — think inventory management, scheduling, or optimization.

Let's look at a classic two-pointer problem: removing duplicates from a sorted array in-place. This is a fundamental pattern.

<div class="code-group">

```python
def removeDuplicates(nums):
    """
    Removes duplicates in-place, returns new length.
    Uses two pointers: `i` for the last unique element,
    `j` to scan through the array.
    """
    if not nums:
        return 0
    i = 0  # Pointer for the last unique element
    for j in range(1, len(nums)):
        if nums[j] != nums[i]:
            i += 1
            nums[i] = nums[j]
    return i + 1

# Example usage:
arr = [1, 1, 2, 2, 3, 4, 4, 5]
new_length = removeDuplicates(arr)
print(f"New length: {new_length}, Array up to new length: {arr[:new_length]}")
```

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let i = 0; // Pointer for the last unique element
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1;
}

// Example usage:
let arr = [1, 1, 2, 2, 3, 4, 4, 5];
let newLength = removeDuplicates(arr);
console.log(`New length: ${newLength}, Array up to new length: ${arr.slice(0, newLength)}`);
```

```java
public class ArrayDuplicates {
    public static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int i = 0; // Pointer for the last unique element
        for (int j = 1; j < nums.length; j++) {
            if (nums[j] != nums[i]) {
                i++;
                nums[i] = nums[j];
            }
        }
        return i + 1;
    }

    public static void main(String[] args) {
        int[] arr = {1, 1, 2, 2, 3, 4, 4, 5};
        int newLength = removeDuplicates(arr);
        System.out.print("New length: " + newLength + ", Array up to new length: ");
        for (int k = 0; k < newLength; k++) {
            System.out.print(arr[k] + " ");
        }
    }
}
```

</div>

**Strings** — String problems at Amazon frequently involve parsing, comparison, and transformation. Problems like grouping anagrams, valid parentheses variations, and string matching show up regularly. Be comfortable with both brute force and optimized approaches.

A common Amazon problem is checking if a string is a valid palindrome, considering only alphanumeric characters and ignoring case.

<div class="code-group">

```python
def isPalindrome(s: str) -> bool:
    """
    Checks if a string is a valid palindrome.
    Uses two pointers, skipping non-alphanumeric characters.
    """
    left, right = 0, len(s) - 1
    while left < right:
        # Move left pointer to next alphanumeric char
        while left < right and not s[left].isalnum():
            left += 1
        # Move right pointer to previous alphanumeric char
        while left < right and not s[right].isalnum():
            right -= 1
        # Compare characters (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

# Example usage:
test_str = "A man, a plan, a canal: Panama"
print(f"Is '{test_str}' a valid palindrome? {isPalindrome(test_str)}")
```

```javascript
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    // Move left pointer to next alphanumeric char
    while (left < right && !/^[a-z0-9]$/i.test(s[left])) {
      left++;
    }
    // Move right pointer to previous alphanumeric char
    while (left < right && !/^[a-z0-9]$/i.test(s[right])) {
      right--;
    }
    // Compare characters (case-insensitive)
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

// Example usage:
let testStr = "A man, a plan, a canal: Panama";
console.log(`Is '${testStr}' a valid palindrome? ${isPalindrome(testStr)}`);
```

```java
public class ValidPalindrome {
    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            // Move left pointer to next alphanumeric char
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            // Move right pointer to previous alphanumeric char
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            // Compare characters (case-insensitive)
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String testStr = "A man, a plan, a canal: Panama";
        System.out.println("Is '" + testStr + "' a valid palindrome? " + isPalindrome(testStr));
    }
}
```

</div>

**Hash Tables** — Hash maps are the workhorse data structure for Amazon interviews. Many problems that seem complex reduce to clever hashing. Practice problems where you need to count frequencies, detect duplicates, or build lookup structures efficiently.

A quintessential hash table problem is finding two numbers in an array that sum to a target value.

<div class="code-group">

```python
def twoSum(nums, target):
    """
    Returns indices of the two numbers that add up to target.
    Uses a hash map (dictionary) for O(n) time complexity.
    """
    num_map = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []  # No solution found

# Example usage:
nums = [2, 7, 11, 15]
target = 9
result = twoSum(nums, target)
print(f"Indices of numbers summing to {target}: {result}")
```

```javascript
function twoSum(nums, target) {
  const numMap = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    numMap.set(nums[i], i);
  }
  return []; // No solution found
}

// Example usage:
let nums = [2, 7, 11, 15];
let target = 9;
let result = twoSum(nums, target);
console.log(`Indices of numbers summing to ${target}: ${result}`);
```

```java
import java.util.HashMap;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> numMap = new HashMap<>(); // value -> index
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            numMap.put(nums[i], i);
        }
        return new int[]{}; // No solution found
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.print("Indices of numbers summing to " + target + ": ");
        for (int idx : result) {
            System.out.print(idx + " ");
        }
    }
}
```

</div>

**Dynamic Programming** — Amazon tests DP less aggressively than Google, but it still appears consistently. Focus on classic patterns: knapsack variants, longest subsequence problems, and grid-based DP. Amazon DP problems tend to be more straightforward than what you would see at Google — master the patterns and you will be well-prepared.

A foundational DP problem is calculating the nth Fibonacci number using memoization to avoid exponential time complexity.

<div class="code-group">

```python
def fib(n, memo={}):
    """
    Returns the nth Fibonacci number using memoization (top-down DP).
    """
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

# Example usage:
n = 10
print(f"The {n}th Fibonacci number is: {fib(n)}")

# Alternative bottom-up (iterative) approach, often preferred for interviews:
def fib_bottom_up(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print(f"The {n}th Fibonacci number (bottom-up) is: {fib_bottom_up(n)}")
```

```javascript
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

// Example usage:
let n = 10;
console.log(`The ${n}th Fibonacci number is: ${fib(n)}`);

// Bottom-up (iterative) approach:
function fibBottomUp(n) {
  if (n <= 1) return n;
  let dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

console.log(`The ${n}th Fibonacci number (bottom-up) is: ${fibBottomUp(n)}`);
```

```java
import java.util.HashMap;

public class FibonacciDP {
    // Top-down with memoization
    public static int fib(int n, HashMap<Integer, Integer> memo) {
        if (memo.containsKey(n)) return memo.get(n);
        if (n <= 1) return n;
        int result = fib(n - 1, memo) + fib(n - 2, memo);
        memo.put(n, result);
        return result;
    }

    // Bottom-up (iterative)
    public static int fibBottomUp(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        int n = 10;
        HashMap<Integer, Integer> memo = new HashMap<>();
        System.out.println("The " + n + "th Fibonacci number (top-down) is: " + fib(n, memo));
        System.out.println("The " + n + "th Fibonacci number (bottom-up) is: " + fibBottomUp(n));
    }
}
```

</div>

**Math** — Basic math concepts like modular arithmetic, GCD/LCM, and simple number theory appear occasionally. These are rarely the main event but often show up as components of larger problems.

Calculating the Greatest Common Divisor (GCD) using Euclid's algorithm is a useful tool to have in your arsenal.

<div class="code-group">

```python
def gcd(a, b):
    """
    Returns the Greatest Common Divisor of a and b using Euclid's algorithm.
    """
    while b:
        a, b = b, a % b
    return abs(a)

# Example usage:
num1, num2 = 48, 18
print(f"GCD of {num1} and {num2} is: {gcd(num1, num2)}")

# LCM can be derived from GCD: LCM(a, b) = abs(a*b) / GCD(a, b)
def lcm(a, b):
    return abs(a * b) // gcd(a, b)

print(f"LCM of {num1} and {num2} is: {lcm(num1, num2)}")
```

```javascript
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

// Example usage:
let num1 = 48,
  num2 = 18;
console.log(`GCD of ${num1} and ${num2} is: ${gcd(num1, num2)}`);

// LCM derived from GCD
function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

console.log(`LCM of ${num1} and ${num2} is: ${lcm(num1, num2)}`);
```

```java
public class MathUtils {
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return Math.abs(a);
    }

    public static int lcm(int a, int b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    public static void main(String[] args) {
        int num1 = 48, num2 = 18;
        System.out.println("GCD of " + num1 + " and " + num2 + " is: " + gcd(num1, num2));
        System.out.println("LCM of " + num1 + " and " + num2 + " is: " + lcm(num1, num2));
    }
}
```

</div>

## Preparation Strategy

**Weeks 1-2: Core Data Structures.** Focus on arrays, strings, linked lists, and hash tables. Solve 6-8 problems per day, mostly mediums. Amazon recycles patterns, so once you recognize a pattern, drill variations of it. Pay special attention to problems involving merging intervals, two-sum variants, and sliding window.

**Week 3: Trees, Graphs, and BFS/DFS.** Amazon loves tree problems — binary tree traversals, BST operations, and lowest common ancestor variants come up frequently. For graphs, focus on BFS and DFS, connected components, and topological sort. Solve at least 25 problems across these topics.

Let's implement a fundamental tree traversal: Inorder traversal (Left, Root, Right) both recursively and iteratively.

<div class="code-group">

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversalRecursive(root):
    """
    Returns a list of node values from an inorder traversal (recursive).
    """
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        result.append(node.val)
        traverse(node.right)
    traverse(root)
    return result

def inorderTraversalIterative(root):
    """
    Returns a list of node values from an inorder traversal (iterative using a stack).
    """
    result = []
    stack = []
    current = root
    while current or stack:
        # Reach the leftmost node
        while current:
            stack.append(current)
            current = current.left
        # Process the node
        current = stack.pop()
        result.append(current.val)
        # Move to the right subtree
        current = current.right
    return result

# Example usage:
# Construct a simple tree:    1
#                           /   \
#                          2     3
#                         / \   /
#                        4   5 6
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.left = TreeNode(6)

print("Inorder Recursive:", inorderTraversalRecursive(root))
print("Inorder Iterative:", inorderTraversalIterative(root))
```

```javascript
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function inorderTraversalRecursive(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

function inorderTraversalIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  while (current || stack.length > 0) {
    // Reach the leftmost node
    while (current) {
      stack.push(current);
      current = current.left;
    }
    // Process the node
    current = stack.pop();
    result.push(current.val);
    // Move to the right subtree
    current = current.right;
  }
  return result;
}

// Example usage:
// Construct a simple tree:    1
//                           /   \
//                          2     3
//                         / \   /
//                        4   5 6
let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);

console.log("Inorder Recursive:", inorderTraversalRecursive(root));
console.log("Inorder Iterative:", inorderTraversalIterative(root));
```

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class TreeTraversal {
    // Recursive inorder traversal
    public static List<Integer> inorderTraversalRecursive(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    private static void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        traverse(node.left, result);
        result.add(node.val);
        traverse(node.right, result);
    }

    // Iterative inorder traversal using a stack
    public static List<Integer> inorderTraversalIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        while (current != null || !stack.isEmpty()) {
            // Reach the leftmost node
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            // Process the node
            current = stack.pop();
            result.add(current.val);
            // Move to the right subtree
            current = current.right;
        }
        return result;
    }

    public static void main(String[] args) {
        // Construct a simple tree:    1
        //                           /   \
        //                          2     3
        //                         / \   /
        //                        4   5 6
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        root.right.left = new TreeNode(6);

        System.out.println("Inorder Recursive: " + inorderTraversalRecursive(root));
        System.out.println("Inorder Iterative: " + inorderTraversalIterative(root));
    }
}
```

</div>

**Week 4: Dynamic Programming and Greedy.** Spend this week on DP fundamentals and greedy algorithms. Amazon's DP problems are usually recognizable if you know the patterns. Cover 1D and 2D DP, and practice greedy problems involving scheduling, intervals, and optimization.

**Week 5: System Design and OOP.** For SDE II and above, system design is a significant part of the loop. Even for SDE I, having a basic understanding of system design concepts helps. Practice designing systems like URL shorteners, notification services, or e-commerce carts. Also brush up on object-oriented design — Amazon sometimes asks OOP design questions.

**Week 6: Behavioral Prep and Mock Interviews.** Dedicate serious time to preparing Leadership Principle stories. Write out 10-12 STAR-format stories that cover multiple principles each. Then run at least 3 full mock interviews combining behavioral and coding rounds. Practice transitioning between the two seamlessly.

## Key Tips

1.  **Leadership Principles are not optional.** Candidates who nail the coding but fumble the behavioral questions get rejected at Amazon. Prepare your LP stories with the same rigor you apply to algorithms. For each principle, have at least one detailed story using the STAR method (Situation, Task, Action, Result).

2.  **Think out loud and be structured.** Amazon interviewers use a standardized scoring rubric. Being organized in your approach — stating the problem, discussing trade-offs, then coding — maps directly to how they score you. Before writing code, always clarify requirements and walk through a small example.

3.  **Optimize for readability over cleverness.** Amazon values practical engineering. Write code that is clean and maintainable, not code that shows off obscure tricks. Use clear variable names and handle edge cases explicitly. Comment briefly on complex logic.

4.  **Prepare for the "Bar Raiser" round.** One of your interviewers will be a Bar Raiser — someone from outside the hiring team whose job is to maintain Amazon's hiring standard. This round is often the toughest. Expect deeper technical questions and more probing behavioral follow-ups. They will assess your problem-solving process and alignment with leadership principles rigorously.

5.  **Practice under time pressure.** With only about 40 minutes for the coding portion, you need to be efficient. Aim to solve a medium problem in under 20 minutes during practice so you have buffer for the real interview. Use a timer and simulate the interview environment.

[Browse all Amazon questions on CodeJeet](/company/amazon)
