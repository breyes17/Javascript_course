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

    let calculateTotal = function(type){
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
        calculateBudget : function(){
            // 1. calculate the budget for income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate the percentage
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },
        returnBudget : function(){
            return {
                budget: data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }

        },
        deleteItem : function(type, id){
            let ids,indexID;

            ids = data.allItems[type].map((x) => x.id);
            indexID = ids.indexOf(id);
            if(ids !== -1){
                data.allItems[type].splice(indexID,1);
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
        incomeContainer : '.income__list',
        Income : '.budget__income--value',
        Expenses : '.budget__expenses--value',
        Percentage : '.budget__expenses--percentage',
        Budget : '.budget__value',
        month : '.budget__title--month',
        container : '.container'
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
                html = `<div class="item clearfix" id="inc-%id%">
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
                html = `<div class="item clearfix" id="exp-%id%">
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
        displayBudget : function(obj){
            // budget
            if(obj.budget > 0){
                document.querySelector(DOMstrings.Budget).textContent = '+ '+obj.budget;
            } else {
                document.querySelector(DOMstrings.Budget).textContent = 0;
            }

            // expenses
            document.querySelector(DOMstrings.Expenses).textContent = '- '+obj.totalExp;
            // income
            document.querySelector(DOMstrings.Income).textContent = '+ '+obj.totalInc;

            // percentage
            if(obj.percentage <= 0 ){
                obj.percentage = 0;
            }
            document.querySelector(DOMstrings.Percentage).textContent = obj.percentage + '%';
        },

        clearFields : function(){
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.domDescription +','+ DOMstrings.domValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(element => {
                element.value = "";
            });

            fieldsArr[0].focus();
        },
        displayMonths : function(){
            let n = new Date().getMonth();
            let months = ['January', 'February', 'March', 'April' , 'May', 'June', 'July', 'August',
                            'September', 'October', 'November' ,'December'];
            return months[n]      
        },
        deleteListItem : function(selectorID){
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        document.querySelector(dom.container).addEventListener('click',ctrDeleteItem);
    }


    let updateBudget = function(){
        BUDGETcontroller.calculateBudget();
        let bg = BUDGETcontroller.returnBudget()
        uictrl.displayBudget(bg);
    }
    
    let ctrlAdditem = function(){
        // console.log(uictrl.getValues())
        let data , newItem;
        data = uictrl.getValues();
        if(data.description !== "" && !isNaN(data.value) && data.value > 0){
            newItem = bdgtctrl.insertBudget(data.type,data.description,data.value);
            uictrl.addListItem(newItem,data.type);
            updateBudget();
            uictrl.clearFields();
        }

    }

    let ctrDeleteItem = function(event){
        let item,idSplit,type,id;
        item = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(item){
            idSplit = item.split('-');
            type = idSplit[0];
            id = parseInt(idSplit[1],10);
            BUDGETcontroller.deleteItem(type,id);
            uictrl.deleteListItem(item);
            updateBudget();
        }
    }

    return{
        init: function(){
            console.log('Application has started');
            document.querySelector(uictrl.getDom().month).textContent = uictrl.displayMonths();
            uictrl.displayBudget({
                budget: 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            })
            setupEventListener();
        }
    }


})(BUDGETcontroller,UIcontroller);

controller.init();