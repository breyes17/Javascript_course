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
        }
    }

    return{
        insertBudget: function(type,description,value){
            if(type === 'inc'){
                
            }
        }
    }
})();

let Income = function(id,description,value){
    this.id = id,
    this.description = description,
    this.value = value;
}

let UIcontroller = (function(){

    let DOMstrings = {
        domType : '.add__type',
        domDescription : '.add__description',
        domValue : '.add__value',
        domBtn : '.add__btn'
    }
    
    return{
        getValues : function(){
            return{
                type : document.querySelector(DOMstrings.domType).value,
                description : document.querySelector(DOMstrings.domDescription).value,
                value : document.querySelector(DOMstrings.domValue).value
            }
        },
        getDom : function(){
            return DOMstrings;
        }
    }
})();

let controller = (function(bdgtctrl,uictrl){

    let setupEventListener = function(){
        let dom = uictrl.getDom();
        document.querySelector(dom.domBtn).addEventListener('click',ctrlAdditem);
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAdditem();
            }
        });
    }
    
    let ctrlAdditem = function(){
        console.log(uictrl.getValues())
    }

    return{
        init: function(){
            console.log('Application has started');
            setupEventListener();
        }
    }


})(BUDGETcontroller,UIcontroller);

controller.init();