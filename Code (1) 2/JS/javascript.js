
//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------
$('#warranty').on('change', function(){
	if (this.checked) {
		$('#serviceFee').val('0.00');
  } else {
		$('#serviceFee').val('85.00');		
  }
});


//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.
//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   ];
				   
//We will use "appState" object to track the form change when users interact with the app			   
let appState = {customerType: 'customer',
				courtesyPhone: {item: 'none', bond: 0.00 },//Allow to borrow ONLY 1 phone
				courtesyCharger: {item: 'none', bond: 0.00}//Allow to borrow ONLY 1 charger
			  };		  

//-------------------------
//Handle click "add" button event:
$('#addBtn').click(function(clickEvent){
	//The preventDefault() method cancels the default action that belongs to the event
	//https://www.w3schools.com/jsref/event_preventdefault.asp
	clickEvent.preventDefault();
	
	//Get selected item from id="itemList"
	let selectedItemText = $('#itemList').find(":selected").text();//Get selected "option" text
	let selectedItemValue = $('#itemList').find(":selected").val();//Get selected "option" value
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	
	//Build HMLT (render) new row:
	let newRow = `
				<tr class="selected-item">
					<td class="itemID" style="display: none;">${selectedItemValue}</td>
					<td>${selectedItemText}</td>
					<td>${selectedItemBond}</td>
				</tr>			
			`;
	
	//Add this new row of selected item to the table id="borrowItems" if it's not exist yet.
	if (selectedItemValue.toLowerCase().includes("phone") && (appState.courtesyPhone.item == "none")) {
		//Append new row to the table
		$('#borrowItems').append(newRow);
		//Update appState object
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		//Update the "bond" element on UI
		if ($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0.00);
		}			
	} else if (selectedItemValue.toLowerCase().includes("charger") && (appState.courtesyCharger.item == "none")) {
		//Append new row to the table
		$('#borrowItems').append(newRow);
		//Update appState object
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		//Update the "bond" element on UI
		if ($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0.00);
		}		
	} else {
		//The item was already added
		alert("The item was already added");		
	}

});

//-------------------------
//Handle click "remove" button event:
$('#removeBtn').click(function(clickEvent){
	clickEvent.preventDefault();		
	$('.selected-item').remove();	
	//Update bond
	$('#bond').val(0.00);
	//Update appState object
	appState.courtesyPhone = {item: 'none', bond: 0.00 };
	appState.courtesyCharger = {item: 'none', bond: 0.00 };
});

//-------------------------
//Update customerType when user clicks "Customer Type" radio buttons:
$("#customerType").click(function(){    
	//Update appState: customerType and bond displaying on UI
	appState.customerType = 'customer';
	$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});	
$("#businessType").click(function(){        
	appState.customerType = 'business';
	$('#bond').val(0.00);
});	




//------------------------------------------------------------------------------------------------------
//Submit: Validate form using HTML technique & pop up repair-booking.hmtl page
//------------------------------------------------------------------------------------------------------
$('#repair-booking').submit(function(e) {
	//Use this command to prevent the default method that is usually triggered
	e.preventDefault();

	//define variable dateTime
	let dateTime = new Date();
	
	//Store the important data that is relevant for the repair-booking.html in the local storage to get it over
	let repairBookingData = {//Customer details
							 customerType: $('#customerType').val(),
							 title: $('#title').val(),
							 firstname: $('#fname').val(),
							 lastname: $('#lname').val(),
							 street:  $('#street').val(),
							 suburb: $('#suburb').val(),
							 city: $('#city').val(),
							 postCode: $('#postCode').val(),
							 phoneNumber: $('#phoneNumber').val(),
							 email: $('#email').val(),

							 //Purchase details
							 purchaseDate: $('#purchaseDate').val(),
							 repairDate: $('#repairDate').val(),
							 warranty: $('#warranty').val(),
							 imei: $('#imei').val(),
							 make:$('#make').val(),
							 modelNumber:$('#modelNumber').val(),
							 faultCategory: $('#faultCategory').val(),
							 description: $('#description').val(),

							 //Payment details
							 bond: $('#bond').val(),
							 serviceFee: $('#serviceFee').val(),
							 totalFee: $('#totalFee').val(),
							 GST: $('#GST').val(),
							 totalGST: $('#totalGST').val(),
							 borrowItems: $('#borrowItems').html(),
							 invDate: (dateTime.getFullYear()) + "/" + (dateTime.getMonth()) + "/" + (dateTime.getDate()) + " " + (dateTime.getHours()) + ":" + (dateTime.getMinutes()) + ":" + (dateTime.getSeconds()),
							 payDueDate: ((dateTime.getFullYear()) + "/" + (dateTime.getMonth()) + "/" + (dateTime.getDate() + 5))

							};	

	//Convert the data object to a JSON string 
	localStorage.setItem("repair-booking-data", JSON.stringify(repairBookingData));
	console.log(JSON.stringify(repairBookingData));
	
	//Open the repair-booking.html site in a new window
	window.open("repair-booking.html");
	
	
});

//-----------------
//initialize function to load the repair booking data 
function loadRepairBooking() {
	
	//Store data in local storgae
	let passedData = localStorage.getItem("repair-booking-data");
	//
	let extractedData = JSON.parse(passedData);
	console.log(extractedData);
	//Console log command to track what has been saved
	
	//Customer data
	document.getElementById("customerType").innerHTML = extractedData.customerType;
	document.getElementById("title").innerHTML = extractedData.title;
	document.getElementById("fname").innerHTML = extractedData.firstname;
	document.getElementById("lname").innerHTML = extractedData.lastname;
	document.getElementById("street").innerHTML = extractedData.street;
	document.getElementById("suburb").innerHTML = extractedData.suburb;
	document.getElementById("city").innerHTML = extractedData.city;
	document.getElementById("postCode").innerHTML = extractedData.postCode;
	document.getElementById("phoneNumber").innerHTML = extractedData.phoneNumber;
	document.getElementById("email").innerHTML = extractedData.email;
	

	//Purchase details
	document.getElementById("purchaseDate").innerHTML = extractedData.purchaseDate;
	document.getElementById("repairDate").innerHTML = extractedData.repairDate;
	document.getElementById("warranty").innerHTML = extractedData.warranty;
	document.getElementById("imei").innerHTML = extractedData.imei;
	document.getElementById("make").innerHTML = extractedData.make;
	document.getElementById("modelNumber").innerHTML = extractedData.modelNumber;
	document.getElementById("faultCategory").innerHTML = extractedData.faultCategory;
	document.getElementById("description").innerHTML = extractedData.description;

	//Payment details
	document.getElementById("bond").innerHTML = extractedData.bond;
	document.getElementById("serviceFee").innerHTML = extractedData.serviceFee;
	document.getElementById("totalFee").innerHTML = extractedData.totalFee;
	document.getElementById("GST").innerHTML = extractedData.GST;
	document.getElementById("totalGST").innerHTML = extractedData.totalGST;
	document.getElementById("totalGST2").innerHTML = extractedData.totalGST;
	document.getElementById("borrowItems").innerHTML = extractedData.borrowItems;
	document.getElementById("invDate").innerHTML = extractedData.invDate;
	document.getElementById("payDueDate").innerHTML = extractedData.payDueDate;

}


//JQUERY: AJAX
//Link: https://www.tutorialsteacher.com/jquery/jquery-ajax-introduction
let proxy = 'https://cors-anywhere.herokuapp.com/' ;
let json_url = "http://danieldangs.com/itwd6408/json/faqs.json";
//load JSON file with JQerry
$.getJSON(
//Assign the JSON file to data
proxy + json_url, function(data) {
//Loop through all the questions in the file to get the questions and answers
console.log(data);
$.each(data, function(i, question) {//i: index, question: object
//Extract the question and answer and display them on the webpage 
//HTML struct
let node = '<div class="col-12 col-md-6 p-2">' +
'<div class="bg-warning h-100 p-2">' +
'<h4>' + question.question + '</h4>' +
'<p>' + question.answer + '</p>' +
'<div>' +
'</div>';
$('#questions').append(node)
});
}
);




//FAQ Filter function
$("#search-box").on("keyup", function() {
	//Fetch the entered keywords
	let keywords = $(this).val().toLowerCase();
	//Loop through all questions to find all objects containing the keywords
	$("#questions div").filter(function() {
	// Display all retrieved elements
	$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1); 
	 //do not show if there is not element containing the keyword
	});
});



//Purchase date Validation (purchase date < today)
$("#purchaseDate").change(function() {
    let today = new Date();
    let purchaseDate = new Date($(this).val());
    //check that the purchaseDate is set before the present day
    if (purchaseDate.getTime() > today.getTime()) {
        //alert with error message("ERROR: The purchase date can not be in the future, please re-enter a valid date");
        $("p.error-message").remove();
        $("#purchaseDate").after('<p class="error-message"> Error: The purchase date can not be in the future, please re-enter a valid date</p>');
        $(this).val("");
    } else {
        //remove error message
        $("p.error-message").remove();
    }
	
});


$("#repairDate").change(function() {
    let repairDate = new Date($(this).val());
	let purchaseDate = $("#purchaseDate");
    //make sure that repairDate is set after the purchaseDate
    if (repairDate.getTime() < purchaseDate.getTime()) {
        //alert("ERROR: The repair date can not be before the purchase date, please re-enter a valid date");
        $("p.error-message").remove();
        $("#repairDate").after('<p class="error-message"> Error: The repair date can not be before the purchase date, please re-enter a valid date</p>');
        $(this).val("");
    } else {
        //remove error message
        $("p.error-message").remove();
    }
});


//Calculation totalFee
$("#addBtn,#removeBtn,#customerType,#businessType").on("click", function(){
	var value1 = parseFloat($("#bond").val()) || 0;
	var value2 = parseFloat($("#serviceFee").val()) || 0;
	$("#totalFee").val(value1 + value2);

})

//Calculation GST
$("#addBtn, #removeBtn, #customerType,#businessType").on("click", function(){
	var value1 = parseFloat($("#totalFee").val());
	$("#GST").val(value1*0.15);

})

//Calculation totalGST
$("#addBtn,#removeBtn,#customerType,#businessType").on("click", function(){
	var value1 = parseFloat($("#GST").val()) || 0;
	var value2 = parseFloat($("#totalFee").val()) || 0;
	$("#totalGST").val(value1 + value2);

})






//SVG Map


$('path').mouseover( function(e) {

	// fetch the title attrivute of the active path
	var title = $(this).attr('title')
  
	// JQuery command to set an inner HTML value to title
	$('#info-box').html(title)
  
	// display 
	$('#info-box').css('display', 'block')
	$('#info-box').css('top',e.pageY-$('#info-box').height()-30);
	$('#info-box').css('left',e.pageX-($('#info-box').width())/2);
  })
  
  
  // command to make the info box dissapear when the mouse hovers over it
  $("path").mouseleave(function () {
	$('#info-box').css('display', 'none');
  });
  
  