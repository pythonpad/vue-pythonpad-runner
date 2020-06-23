balance = 0

def deposit(money) :
    # Input : (Integer) The amount of money that a user wants to deposit
    # Output : (None) No Output
    
    # Add the money to the current balance
    
    #################
    ### implement ###
    #################
    # Do something on here !
    global balance
    balance = balance + int(money)
    print("you deposited",money,"won")
    #################

def withdrawal(money) :
    # Input : (Integer) The amount of money that a user wants to withdraw
    # Output : (None) No Output
    
    # Withdraw the money from the current balance

    #################
    ### implement ###
    #################
    # Do something on here !
    global balance
    if balance>=int(money):
        balance=balance-int(money)
        print("you've withdraw",money,"won")
    else:
        print("You've withdrawn",money,"won")
        print("But you only have", money,"won")
    #################

def bank() :
    # Input : (None) No Input
    # Output : (None) No Output
    
    while True:
        process = input("Deposit(d) or withdrawal(w) or balance check(c)? ")
        
        # If a user's input is empty string (''), then quit this function.
        # If a user's input is 'd', then ask the amount of money to deposit and deposit it.
        # If a user's input is 'w', then ask the amount of money to withdraw and withdraw it.
        # If a user's input is 'c', then check the current balance.

        #################
        ### implement ###
        #################
        # Do something on here !
        pass
        if process=='w':
            money=input("How much do you want to withdraw? ")
            withdrawal(money)
        elif process=='d':
            money=input("How much do you want to deposit? ")
            deposit(money)
        elif process=='c':
            print("Your current balance is", balance,"won")
        elif process==' ':
            break
        else:
            print("Please, press d or w or c or return")
        #################

bank()
