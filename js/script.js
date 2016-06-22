/*Free Code Camp Calculator
Author: Chris Jones
Date: 6/13/2016
Requirements: 
	1. Create a basic JavaScript calculator that fulfills the below user stories
		a. I can add, substract, multiply, and divide two numbers.
		b. I can clear the input field with a clear button.
		c. I can keep chaining mathematical operations together until I hit the equal button, and the calculator will tell me the correct output.
	Bonus:
		1. Include a cumulative display of numbers and operations pressed
		2. Allow user to cycle through cumulative list if it exceeds width of display
*/


var total = 0;
var lastOperator = [];
var lastButton = "";

//Function to initialize event listeners
function init(){
	var buttonParents = document.querySelectorAll("#buttons-container .row .col");
	var arrows = document.getElementsByClassName("arrow");

	//Add event listeners to each column with buttons
	for (var i = 0; i < buttonParents.length; i++){
		//Check for IE9 and above
		if (buttonParents[i].addEventListener){
			buttonParents[i].addEventListener('click', action, false);
		} else if (buttonParents[i].attachEvent){
			buttonParents[i].attachEvent('onclick', action);
		}
	}

	//Add event listeners to arrows
	for (var j = 0; j < arrows.length; j++)	{
		//Check for IE9 and above and addEventListener
		//If IE8 or below attachEvent
		if (arrows[j].addEventListener){
			arrows[j].addEventListener('click', slideText, false);
		} else {
			arrows[j].attachEvent('onclick', slideText);
		}
	}
}

//Perform action on arrow button click
function slideText(e){
	
	var arrowID = this.id;
	var output = document.getElementById("output");
	var secondaryOutput = document.getElementById("secondary-output");
	var val = (parseInt(secondaryOutput.style.right, 10) || 0);
	var parentWidth = output.offsetWidth;
	var width = secondaryOutput.offsetWidth;
	var maxLeft = ((0 - width) + parentWidth) - 125;

	//If right arrow is clicked slide text to right
	//and the position is not at original starting position
	if (arrowID === "right-arrow" && val < 0){
		val += 125;
		secondaryOutput.style.right = val + "px";

	//If left arrow is clicked slide text to left
	//and the current position has not scrolled text off of the screen
	//and the width of the output span has not exceeded the parent (adjusted for border and padding)
	} else if (arrowID === "left-arrow" && val > maxLeft && width > (parentWidth - 14)){
		val -= 125;
		secondaryOutput.style.right = val + "px";
	}	
}

//Perform action on interface button click
function action(e){

	//If current event is not firing on parent element
	//perform event action
	if (e.target !== e.currentTarget){
		var primaryOutput = document.getElementById("primary-output");
		var secondaryOutput = document.getElementById("secondary-output");
		var buttonVal = e.target.innerHTML;
		var operators = ["\u002B","\u2212", "\u00D7", "\u00F7", "\u003D", "AC", "C"];
		
		//If numeral button is pressed add text to output field
		//If AC or C buttons are pressed clear output field
		//If AC is pressed, also reset total to 0
		//If math operator or equal are pressed calculate total
		if (operators.indexOf(buttonVal) === -1 ){
			displayText(buttonVal);
			limitText();
		} else if (buttonVal === "AC" || buttonVal === "C"){
			clearDisplay(buttonVal);
		} else if (primaryOutput.innerHTML !== "" && primaryOutput.innerHTML !== "NAN" && lastButton === "") {
			calculate(buttonVal);
			limitText();
		} else if (buttonVal !== operators[4]){
			changeOperator(buttonVal);
		}
	}

	//Stop event from bubbling to parent element
	e.stopPropagation();

	//Check if text exceeds the 17 character limit
	function limitText(){
		var str = primaryOutput.innerHTML;
		var textLimit = 17;
		str.split("");
		
		//If text exceeds limit and is less than 4 extra, reduce font size
		//If text exceeds limit between 5 and 9 characters reduce font size more
		//If text exceeds limit by more than 9 characters print message to screen
		if (str.length > textLimit && str.length <= (textLimit + 3)){
			primaryOutput.style.fontSize = ".9em";
		} else if (str.length > (textLimit + 3) && str.length <= (textLimit + 8)){
			primaryOutput.style.fontSize = ".7em";
		} else if (str.length > (textLimit + 8)){
			primaryOutput.innerHTML = "Exceeded limit";
		}
	}

	function displayText(val){
		primaryOutput.style.fontSize = "1em";
		//If button pressed is a numeral, add button value to display
		if (operators.indexOf(lastButton) === -1) {
			primaryOutput.innerHTML += val;
		} else {
			//If the last button pressed was a math operation
			//clear the output field before adding new number
			//Reset the lastButton variable
			primaryOutput.innerHTML = "";
			primaryOutput.innerHTML = val;
			lastButton = "";
		}
	}

	//If "AC" or "C" is pressed clear primary output display
	//If "AC" is pressed also reset total to 0
	//Reset secondary output to initial position in case user has moved
	function clearDisplay(val){
		primaryOutput.innerHTML = "";	
		if (val === "AC") {
			total = 0;
			secondaryOutput.innerHTML = "";
			secondaryOutput.style.right = "0px";
			lastOperator.length = 0;
		}
	}

	//If user presses different operators
	//change the display and operator to reflect this and calculate based on last operator pressed
	function changeOperator(operator) {
		var secondaryOutputArr = secondaryOutput.innerHTML.split('');		
		lastOperator[lastOperator.length - 1] = operator;		
		secondaryOutputArr[secondaryOutputArr.length - 1] = lastOperator[lastOperator.length - 1];
		secondaryOutput.innerHTML = secondaryOutputArr.join('');		
	}

	//Remove decimals from value if user enters multiple decimal values
	function removeDecimals(value){
		var valuesArray = value.split("");
		var firstDecimalOnly = [];

		//Search array for more than one decimal occurence
		//If the firstDecimalOnly array already has a decimal, do not push a new decimal to array 
		for (var i = 0; i < valuesArray.length; i++){
			if (valuesArray[i] === "." && firstDecimalOnly.indexOf(".") > -1){
				continue;
			} else {
				firstDecimalOnly.push(valuesArray[i]);
			}
		}

		firstDecimalOnly = firstDecimalOnly.join('');
		return firstDecimalOnly;
	}

	function calculate(val){
		var currentVal = parseFloat(removeDecimals(primaryOutput.innerHTML), 10);
		lastButton = val;
		
		//Check if input is a number
		if (!isNaN(currentVal)){
			//Perform operation based on button pressed
			switch (val){
				//Plus button was pressed
				case operators[0]:
					performOperation(operators[0]);
					break;
				//Minus button was pressed
				case operators[1]:
					performOperation(operators[1]);
					break;
				//Times button was pressed
				case operators[2]:
					performOperation(operators[2]);
					break;
				//Divide button was pressed
				case operators[3]:
					performOperation(operators[3]);
					break;
				//Equals button was pressed
				//Set final value for numbers pressed in secondary output
				//Reset last operator pressed to prepare for new operations
				case operators[4]:
					getTotal();
					secondaryOutput.innerHTML = "";
					secondaryOutput.style.right = "0px";
					lastOperator.length = 0;
					break;
				default:
					alert("There was an error processing your request. Please try again.");
					break;
			}
		}

		//If this is first press of a math operation button
			//set total to value display in output
		//Else
			//call getTotal() function to calculate current total
			//to ensure it is performing the operation after a second number has been entered
		//Set last operator button pushed in variable to use in getTotal() for operation determination
		function performOperation(operator){
			if (lastOperator.length === 0){
				total = currentVal;
			} else {
				getTotal();
			}

			//Set last operator value to use at getTotal() step
			//Set current value and last operator used in secondary output field
			lastOperator.push(operator);
			secondaryOutput.innerHTML += " " + currentVal + " " + lastOperator[lastOperator.length - 1];
			secondaryOutput.style.right = "0px";
		}
		
		//The last operator selected will determine which operation performed
		//Perform operation on total and display to output
		function getTotal(){		
			switch (lastOperator[lastOperator.length - 1]){
				//Addition
				case operators[0]:
					total += currentVal;
					primaryOutput.innerHTML = Number(total.toFixed(6));
					break;
				//Subtraction
				case operators[1]:
					total -= currentVal;
					primaryOutput.innerHTML = Number(total.toFixed(6));
					break;
				//Multiplication
				case operators[2]:
					total *= currentVal;
					primaryOutput.innerHTML = Number(total.toFixed(6));
					break;
				//Division
				case operators[3]:
					//If user divides by zero
					//reset calculator
					if (currentVal === 0){
						alert("Do not divide by zero!! Please try again.");
						total = 0;
						primaryOutput.innerHTML = "";
						secondaryOutput.innerHTML = "";
						secondaryOutput.style.right = "0px";
						lastOperator.length = 0;
					} else {
						total /= currentVal;
						primaryOutput.innerHTML = Number(total.toFixed(6));
					}	
					break;
				default:
					alert("There was a problem getting the final total. Please contact the administrator.");
					break;
			}
		}
	}
}

init();



























