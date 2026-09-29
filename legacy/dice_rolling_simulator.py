# DICE ROLLING SIMULATOR PROJECT

import random

# Roll one die
def roll_dice():
    return random.randint(1, 6)

# Display dice results
def display_result(die1, die2):
    total = die1 + die2

    print("\n--- Dice Result ---")
    print("Die 1:", die1)
    print("Die 2:", die2)
    print("Total:", total)

    return total

# Display roll statistics
def show_statistics(rolls, highest_roll):
    
    if len(rolls) > 0:
        average = sum(rolls) / len(rolls)

        print("\n--- Statistics ---")
        print("Total rolls:", len(rolls))
        print("Highest total:", highest_roll)
        print("Average total:", round(average, 2))

# Store roll results
rolls = []

# Track highest roll
highest_roll = 0

print("===== DICE ROLLING SIMULATOR =====")

# Keep the program running
while True:

    print("\n1. Roll the dice")
    print("2. View statistics")
    print("3. Exit")

    choice = input("Enter your choice: ")

    # Roll the dice
    if choice == "1":
        die1 = roll_dice()
        die2 = roll_dice()

        total = display_result(die1, die2)

        rolls.append(total)

        # Update highest roll
        if total > highest_roll:
            highest_roll = total

    # Show statistics
    elif choice == "2":
        show_statistics(rolls, highest_roll)

    # Exit the program
    elif choice == "3":
        print("\nThanks for playing!")

        show_statistics(rolls, highest_roll)

        break

    # Handle invalid input
    else:
        print("Invalid choice. Please enter 1, 2, or 3.")





