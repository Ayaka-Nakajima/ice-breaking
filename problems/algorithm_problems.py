import json

algo_problems = {
    1: "Write a program that takes an integer and prints whether it is positive, negative, or zero.",
    2: "Given three numbers, print the largest one.",
    3: "Write a program that checks if a number is even or odd without using %.",
    4: "Write a program that asks for a year and prints whether it is a leap year.",
    5: "Given a character input, determine if it is a vowel or a consonant."
}

def problem1():
    n = int(input("Enter an integer: "))
    if n > 0:
        print("Positive")
    elif n < 0:
        print("Negative")
    else:
        print("Zero")

def problem2():
    a, b, c = map(int, input("Enter three numbers separated by spaces: ").split())
    print("Largest:", max(a, b, c))

def problem3():
    n = int(input("Enter a number: "))
    if n & 1 == 0:
        print("Even")
    else:
        print("Odd")

def problem4():
    year = int(input("Enter a year: "))
    if (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):
        print("Leap Year")
    else:
        print("Not a Leap Year")

def problem5():
    ch = input("Enter a character: ").lower()
    if ch in "aeiou":
        print("Vowel")
    else:
        print("Consonant")

problems_map = {
    1: problem1,
    2: problem2,
    3: problem3,
    4: problem4,
    5: problem5
}
