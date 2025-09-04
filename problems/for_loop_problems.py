import json

for_loop_problems = {
    1: "Print the first 10 natural numbers using a for loop.",
    2: "Find the factorial of a given number using a for loop.",
    3: "Print the multiplication table of a number",
    4: "Calculate the sum of digits of a number using a loop.",
    5: "Print all prime numbers from 1 to 100."
}

def problem1():
    for i in range(1, 11):
        print(i,end=" ")
    print()

def problem2():
    n = int(input("Enter a number: "))
    fact = 1
    for i in range(1, n + 1):
        fact *= i
    print(f"Factorial of {n} is {fact}")

def problem3():
    n = int(input("Enter a number: "))
    for i in range(1, 11):
        print(f"{n} x {i} = {n*i}")

def problem4():
    n = int(input("Enter a number: "))
    s = 0
    for digit in str(n):
        s += int(digit)
    print(f"Sum of digits of {n} is {s}")

def problem5():
    print("Prime numbers from 1 to 100:")
    for num in range(2, 101):
        is_prime = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            print(num, end=" ")
    print()

problems_map = {
    1: problem1,
    2: problem2,
    3: problem3,
    4: problem4,
    5: problem5
}