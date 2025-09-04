import json

recursion_problems = {
    1: "Implement Fibonacci sequence using recursion.",
    2: "Write a recursive function to compute the factorial of a number.",
    3: "Implement a recursive function that counts the number of nodes in a binary tree.",
    4: "Write a recursive function that finds the height of a binary tree.",
    5: "Implement a recursive function to reverse a string."
}


def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def problem1():
    n = int(input("Enter how many terms of Fibonacci to print: "))
    for i in range(n):
        print(fibonacci(i), end=" ")
    print()

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

def problem2():
    n = int(input("Enter a number: "))
    print(f"Factorial of {n} is {factorial(n)}")

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def count_nodes(root):
    if root is None:
        return 0
    return 1 + count_nodes(root.left) + count_nodes(root.right)

def problem3():
    root = Node(1)
    root.left = Node(2)
    root.right = Node(3)
    root.left.left = Node(4)
    root.left.right = Node(5)

    print("Number of nodes in the tree:", count_nodes(root))


def tree_height(root):
    if root is None:
        return 0
    return 1 + max(tree_height(root.left), tree_height(root.right))

def problem4():
    root = Node(1)
    root.left = Node(2)
    root.right = Node(3)
    root.left.left = Node(4)

    print("Height of the tree:", tree_height(root))


def reverse_string(s):
    if len(s) == 0:
        return s
    return reverse_string(s[1:]) + s[0]

def problem5():
    s = input("Enter a string: ")
    print("Reversed string:", reverse_string(s))

problems_map = {
    1: problem1,
    2: problem2,
    3: problem3,
    4: problem4,
    5: problem5
}