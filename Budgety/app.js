
// Budget Controller
var budgetController = (function(UICtrl) {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage= -1;
	};
	Expense.prototype.calcPercentage = function(totalIncome) {

		if (totalIncome > 0) {
		this.percentage = Math.round((this.value/totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description =  description;
		this.value =  value;
	};

	var calculateTotal =  function(type) {
		var total = 0;
		data.allItems[type].forEach(function(current) {
			total += current.value;
		});
		data.totals[type] = total;

	};

	var data = {
		allItems: {
			inc: [],
			exp: []
		},
		totals: {
			inc: 0,
			exp:0
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;
			// ID = (data.allItems[type].length - 1) + 1;

			if (data.allItems[type].length > 0 ) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			if (type === 'inc') {
				newItem = new Income(ID,des, val);
			} else if (type === 'exp') {
				newItem = new Expense(ID,des, val);
			}

			data.allItems[type].push(newItem);
			return newItem;

		},

		deleteItem: function(type, id) {
			var ids, index;

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function() {
			// calculate total income and expenses

			calculateTotal('inc');
			calculateTotal('exp');

			// calculate the budget: income - expenses

			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of the income that we spent

			if (data.totals.inc > 0) {

				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}

		},

		calculatePercentages: function() {

			data.allItems.exp.forEach(function(current) {

				current.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {

			var allPerc = data.allItems.exp.map(function(current) {
				return current.getPercentage();
			});

			return allPerc;
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},
		testing: function() {
			console.log(data);
		}
	};

})(UIController);



// UI Controller
var UIController = ( function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		addBtn: '.add__btn',
		container: '.container',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetValue: '.budget__value',
		budgetIncValue: '.budget__income--value',
		budgetExpValue: '.budget__expenses--value',
		budgetExpPercentage: '.budget__expenses--percentage',
		itemPercntage: '.item__percentage'
	};
		var formatNumber =  function(num, type) {

			var numSplit, int, dec, type;

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');

			int = numSplit[0];

			if (int.length > 3 ) {

				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
			}

			dec = numSplit[1];

			return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
			};

			var nodeListForEach = function(list, callback) {

				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDesc).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		addListItem: function(obj, type) {
			var html, newHtml, element;
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">20%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorId) {
			var el = document.getElementById(selectorId);

			el.parentNode.removeChild(el);

		},

		clearFeilds: function() {
			var fields, feildsArr;
			fields = document.querySelectorAll(DOMstrings.inputDesc + ' ,' + DOMstrings.inputValue);

			feildsArr = Array.prototype.slice.call(fields);

			feildsArr.forEach(function(current, index, array) {
				current.value = '';
			});
		},

		displayBudget: function(obj) {
			if (obj.budget >= 0) {
				obj.budget = formatNumber(obj.budget,'inc');
			} else {
				obj.budget = formatNumber(obj.budget,'exp');
			}

			document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
			document.querySelector(DOMstrings.budgetIncValue).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.budgetExpValue).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.budgetExpPercentage).textContent = obj.percentage + '%';

			} else {
				document.querySelector(DOMstrings.budgetExpPercentage).textContent = '---';
			}
		},
		displayPercentages: function(percentages) {

			var feilds = document.querySelectorAll(DOMstrings.itemPercntage);

			nodeListForEach(feilds, function(current, index) {

				if (percentages[index] > 0) {

					current.textContent = percentages[index] + '%';

				} else {
					current.textContent = '---';
				}
			});

		},
 		displayMonth: function() {
 			var now, year, month, months;
 			now = new Date();

 			year = now.getFullYear();
 			month = now.getMonth();
 			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

 			document.querySelector('.budget__title--month').textContent = months[month] + ' ' +  year + ' ';
 		},
 		changedType: function() {

 			var feilds =  document.querySelectorAll(DOMstrings.inputType + ','
 				 + DOMstrings.inputDesc + ',' + DOMstrings.inputValue);

 			nodeListForEach(feilds, function(current) {
 				current.classList.toggle('red-focus');
 			});

 			document.querySelector(DOMstrings.addBtn).classList.toggle('red');
 		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};

})();




// Global APP Controller
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);


			document.addEventListener('keypress' , function(event) {

				if (event.keyCode === 13) {
					ctrlAddItem();
				}

			});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
		};

	var updateBudget = function() {

		// 1. calculate the budget
		budgetCtrl.calculateBudget();

		// 2. return the budget
		var dataBudget = budgetCtrl.getBudget();


		// 3. display the budget on the UI

		UICtrl.displayBudget(dataBudget);
	};

	var updatePercentages = function() {

		// 1. calculate the percentages
		budgetCtrl.calculatePercentages();

		//2. read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		//3. update the UI with the new percentages

		UICtrl.displayPercentages(percentages);



	};

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. get the feild input data
		input = UICtrl.getInput();

		if ( input.description !== '' && !isNaN(input.value) && input.value > 0) {

			// 2. add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. add the item to the UI

			UICtrl.addListItem(newItem, input.type);

			// 4. clear fields

			UICtrl.clearFeilds();

			// 5. calculate and update budget

			updateBudget();

			//6. calculate and update the percentages

			updatePercentages();
		}
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
		}

		// 1. delete the item from the data structure

		budgetCtrl.deleteItem(type, ID);

		//2. delete the item from the UI

		UICtrl.deleteListItem(itemID);


		//3. update and show the new budget
		updateBudget();

		//4. calculate and update the percentages

		updatePercentages();

	};

	return {
		init: function() {
			console.log('APP Started!');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();

		}
	};

})(budgetController,UIController);

controller.init();