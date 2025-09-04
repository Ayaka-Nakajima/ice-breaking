import problems
from problems import algo_problems, for_loop_problems, if_else_problems, recursion_problems  
probtypes = {1: "algorithm problems", 2: "for-loop problems", 3:"if-else problems", 4:"recursion problems"}
keys = probtypes.keys()
values = probtypes.values()
for key in probtypes:
    print(f"{key}: {probtypes[key]}")

chosen_type = input("Please enter the number of the problem type you want: ")
if(chosen_type == "1"):
    print("you picked algorithm problems")
    picknum = int(input("pick a number 1 through 5: "))
    print(algo_problems[picknum])
elif(chosen_type == "2"):
    print("you picked for-loop problems")
    picknum = int(input("pick a number 1 through 5: "))
    print(for_loop_problems[picknum])
elif(chosen_type == "3"):
    print("you picked if-else problems")
    picknum = int(input("pick a number 1 through 5: "))
    pripicknum = int(input("pick a number 1 through 5: "))
    print(recursion_problems[picknum])
else:
    print("try again")



    

