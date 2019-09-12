let BUDGETcontroller = (function(){
    let Expenses = function(id,description,value){
        this.id = id,
        this.description = description,
        this.value = value;
    }

    let Income = function(id,description,value){
        this.id = id,
        this.description = description,
        this.value = value;
    }

    let data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget : 0,
        percentage : -1
    }

    let calculateBudget = function(type){
        let sum = 0;
        data.allItems[type].forEach(x => {
            sum += x.value;
        })
        data.totals[type] = sum;
    }

    return{
        insertBudget: function(type,description,value){
            let dataArr, ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if(type === 'inc'){
                dataArr = new Income(ID, description, value) 
            } else {
                dataArr = new Expenses(ID, description, value)
            }

            data.allItems[type].push(dataArr);

            return dataArr;
        },
        getBudget : function(){
            // 1. calculate the budget for income and expenses
            calculateBudget('exp');
            calculateBudget('inc');

            // 2. calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate the percentage
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        returnBudget : function(){
            return {
                budget: data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }

        },
        testing: function(){
            return data;
        }
    }
})();


let UIcontroller = (function(){

    let DOMstrings = {
        domType : '.add__type',
        domDescription : '.add__description',
        domValue : '.add__value',
        domBtn : '.add__btn',
        expenseContainer : '.expenses__list',
        incomeContainer : '.income__list'
    }
    
    return{
        getValues : function(){
            return{
                type : document.querySelector(DOMstrings.domType).value,
                description : document.querySelector(DOMstrings.domDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.domValue).value)
            }
        },
        getDom : function(){
            return DOMstrings;
        },
        addListItem : function(obj, type){
            let html, newHtml, element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">+ %value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                    </div>`;
            } else {
                element = DOMstrings.expenseContainer;
                html = `<div class="item clearfix" id="expense-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">- %value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        clearFields : function(){
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.domDescription +','+ DOMstrings.domValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(element => {
                element.value = "";
            });

            fieldsArr[0].focus();
        }
    }
})();

let controller = (function(bdgtctrl,uictrl){

    let setupEventListener = function(){
        let dom = uictrl.getDom();

        // when user click the add button
        document.querySelector(dom.domBtn).addEventListener('click',ctrlAdditem);

        // when user use "enter" button
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAdditem();
            }
        });
    }
    
    let ctrlAdditem = function(){
        // console.log(uictrl.getValues())
        let data , newItem;
        data = uictrl.getValues();
        if(data.description !== "" && !isNaN(data.value) && data.value > 0){
            newItem = bdgtctrl.insertBudget(data.type,data.description,data.value);
            uictrl.addListItem(newItem,data.type);
            uictrl.clearFields();
        }

    }

    return{
        init: function(){
            console.log('Application has started');
            setupEventListener();
        }
    }


})(BUDGETcontroller,UIcontroller);

controller.init();