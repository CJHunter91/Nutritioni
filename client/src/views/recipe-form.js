var RecipeRequest = require('../edamam_api/recipe-request.js');

var RecipeForm = function() {

  this.selectedRecipe = null;
  this.newRecipeData = null;

  var main = document.createElement('main');
  this.form = this.createForm();
  var pieChartContainer = document.createElement('div');
  var columnChartContainer = document.createElement('div')
  pieChartContainer.id = 'pie-chart';
  columnChartContainer.id = 'column-chart';
  main.appendChild(this.form);
  main.appendChild(pieChartContainer);
  main.appendChild(columnChartContainer);
  document.body.appendChild(main);
  this.form.addEventListener('submit', this.handleSubmit.bind(this));

  var url = 'http://localhost:3001/api/recipes'
  var request = new XMLHttpRequest();
  request.open("GET", url)
  request.addEventListener('load', function() {
    this.recipesData = JSON.parse(request.responseText)
    this.handleDropdown(request.responseText);
  }.bind(this))
  request.send();
}

RecipeForm.prototype = {

  handleSaveRecipeClick: function() {
    console.log("save clicked")
    var url = "http://localhost:3001/api/recipes";
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', this.handleSave);
    console.log(this.newRecipeData);
    var jsonString = JSON.stringify(this.newRecipeData);
    console.log(jsonString);
    request.send(jsonString);
  },

  handleSave: function() {
    console.log("handleSave")
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var ingredientInputs = document.querySelectorAll('.ingredients input');
    var ingredients = [];
    for (var i = 0; i < ingredientInputs.length; i++) {
      var ingredient = ingredientInputs[i].value;
      if (ingredient !== "") ingredients.push(ingredient);
    }
    console.log("ingredients mapped", ingredients);
    var data = {
      title: this.form['title'].value,
      ingr: ingredients
    }
    this.newRecipeData = data;
    console.log(this.newRecipeData)
    this.newRecipeData.nutritionalInformation = [];
    var request = new RecipeRequest();
    request.makePostRequest(data);
  },

  createForm: function() {
    var form = document.createElement('form');
    form.id = 'recipe-form';
    form.method = 'post';
    form.action = '/';
    var title = this.createInput('title');
    var ingredients = this.createInput('ingredients');
    var submit = this.createSubmitButton();
    var save = this.addSaveRecipeButton();
    var clear = this.addClearDataButton();
    this.addIngredientButton(ingredients);

    form.appendChild(title);
    form.appendChild(ingredients);
    form.appendChild(submit);
    form.appendChild(clear);
    form.appendChild(save);
    return form;
  },

  createInput: function(name) {
    var container = document.createElement('div');
    container.classList.add(name);
    var label = document.createElement('label');
    label.setAttribute('for', name);
    label.innerText = name.replace(/\b\w/g, function(l) {
      return l.toUpperCase()
    });
    var input = document.createElement('input');
    input.id = name;
    input.type = "text";
    container.appendChild(label);
    container.appendChild(input);
    return container;
  },

  createSubmitButton: function() {
    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Analyse Recipe';
    return submit;
  },

  addSaveRecipeButton: function() {
    var saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.innerText = 'Save Recipe';
    saveButton.addEventListener('click', this.handleSaveRecipeClick.bind(this));
    return saveButton;
  },

  addIngredientButton: function(container) {
    var plusButton = document.createElement('button');
    plusButton.innerText = '+';
    plusButton.type = "button";
    container.appendChild(plusButton);
    plusButton.addEventListener('click', this.handleAddIngredientClick);
  },

  addClearDataButton: function() {
    var clearButton = document.createElement('button');
    clearButton.innerText = 'Clear Data';
    clearButton.type = 'button';
    clearButton.addEventListener('click', this.handleClearDataClick);
    return clearButton;
  },

  addDeleteRecipeButton: function() {
    var deleteRecipeButton = document.createElement('button');
    deleteRecipeButton.innerText = 'Delete Recipe';
    deleteRecipeButton.type = 'button';
    deleteRecipeButton.id = 'delete-button'
    deleteRecipeButton.addEventListener('click', this.handleDeleteRecipeClick.bind(this));
    return deleteRecipeButton;
  },



  handleAddIngredientClick: function() {
    var input = document.createElement('input');
    input.type = "text"
    input.id = "additional"
    var container = document.querySelector('.ingredients');
    container.insertBefore(input, container.children[container.children.length -1]);
  },

  handleClearDataClick: function() {
    var inputs = document.querySelectorAll('input[type=text]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
    var additional = document.querySelectorAll('input[id=additional]');
    for (var i = 0; i < additional.length; i++){
      additional[i].remove();
    }
    var pieChart = document.getElementById('pie-chart');
    pieChart.innerText = "";

    var columnChart = document.getElementById('column-chart');
    columnChart.innerText = "";

    var select = document.querySelector('select');
    select.value = 'Recipes'
    var ul = document.querySelector('ul');
    ul.innerText = "";
    
  },

  createRecipeDropdown: function() {
    var selectTag = document.createElement('select');
    var select = document.querySelector("select");
    var option = document.createElement('option');
    option.text = "Recipes"
    selectTag.options.add(option);

    option.disable = true;
    option.selected = true;

    selectTag.addEventListener("change", function(event){
      var value = event.target.selectedOptions[0].value;
      var recipe = this.findRecipeByTitle(value);
      this.displayRecipe(value);
      this.selectedRecipe = recipe;
    }.bind(this))
    var main = document.querySelector("main");
    main.insertBefore(selectTag, main.childNodes[2]);
  },

  populateRecipeDropdown: function(recipesData) {
    var select = document.querySelector('select')
    console.log(this.recipesData);
    for (var recipe of this.recipesData) {
      var option = document.createElement("option")
      option.value = recipe.title;
      option.text = recipe.title;
      select.options.add(option);
    }
  },

  handleDropdown: function(recipesData) {
    this.createRecipeDropdown(this.recipesData);
    this.populateRecipeDropdown(this.recipesData);
  },

  handleDeleteRecipeClick: function() {
    var url = "http://localhost:3001/api/recipes/title/" + this.selectedRecipe.title + "/delete";
    var request = new XMLHttpRequest();
    request.open("DELETE", url);
    request.addEventListener('load', function(){
      this.recipesData = JSON.parse(request.responseText);
      console.log(this.recipesData);
      var removeSelect = document.querySelector('select');
      console.log(removeSelect);
      removeSelect.remove();
      this.handleDropdown(this.recipesData);
    }.bind(this))
      request.send();
  },


  // handleUpdateRecipeClick: function() {
  //   var url = "http://localhost:3001/api/recipes/" + this.selectedRecipe.id;
  //   var request = new XMLHttpRequest();
  //   request.open("POST", url);
  //   request.addEventListener('load', function(){
  //     this.recipesData = JSON.parse(request.responseText);
  //     console.log(this.recipesData);
  //   })
  // },

  findRecipeByTitle: function(value) {
    for (var recipe of this.recipesData) {
      if (recipe.title == value) {
        return recipe;
      }
    }
  },

  displayRecipe: function(value) {
    var ul = document.querySelector('ul')
    if (ul) ul.remove();
    var ul = document.createElement('ul')
    var main = document.querySelector('main');
    main.appendChild(ul)
    for (var recipe of this.recipesData) {
      if (recipe.title == value) {
        for (var ingredient of recipe.ingredients) {
          console.log(ingredient)
          var li = document.createElement('li')
          li.innerText = ingredient;
          ul.appendChild(li)
        }
      }
    }
    var deleteButton = document.querySelector('#delete-button');
    if (deleteButton) deleteButton.remove();
    var deleteRecipe = this.addDeleteRecipeButton();
    main.appendChild(deleteRecipe);

    // var updateButton = document.querySelector('#update-button')
    // if (updateButton) updateButton.remove();
    // var update = this.addUpdateRecipeButton();
    // main.appendChild(update);
  }

}


module.exports = RecipeForm;