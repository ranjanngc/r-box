# r-box

r-box is an initiative to create a web component to host your HTML and add reactivity to it.

* A 2 KB (minified) custom component that adds reactivity to your HTML just with pure JS, HTML and CSS.
* No dependencies
* No render-blocking 

# Uses
```HTML
<r-box data-bind="dataObject">
    <!-- HTML Template-->
</r-box>

<!--data object to bind with r-box-->
<script>
    var dataObject = { };
</script>

<!--add r-box script-->
<script src="src/r-box.js" defer></script>
```

# Directive
r-box has very few directives to add reactivity to HTML
|directive|description|
|---------|-----------|
|data-bind|associate JS object with r-box|
|data-*| To add reactivity to the element attribute use `data-*` directive. For example to add a dynamic class you can use `data-class=methodToReturnClass`| 
|react-on| string representation of a list of properties on change of which DOM should adopt the change|

# Interpolation
use `${yourVariableName}` to interpolate the `yourVariableName` in template. E.g.
```
<h1>${title}</h1>
```
Limitation - composite variable interpolation does not work. In the case of complex interpolation use function. E.g.
```
<h1>${yourFunction}</h1> // yourFunction: () => {return var1 + var2 + var3}
```

# data-*
```
<input type="text" data-value="yourVariable">
```

# Example

## Timer
```HTML
<r-box data-bind="dataObject">

    <label>${label}</label>
    <input type="text" data-value="time">
</r-box>

<script>
    var dataObject = {

        label: 'Time',
        time: ''
    };

    window.setInterval(() => {
        dataObject.time = (new Date()).toLocaleString();
    }, 1000);
    
</script>
<script src='https://cdn.jsdelivr.net/gh/ranjanngc/r-box/dist/r-box.v0.0.1.min.js'></script>
```
![sample](./docs/assets/sample01.gif)

See example  - https://codepen.io/RanjanKr/pen/oNqGvpj
## ToDo List
```HTML
<r-box data-bind="dataObject">

    <ul react-on='["todo"]'>
      ${addList}
    </ul>
    <input type="text" data-value="task">
    <button onclick="dataObject.clickHandler()">Add Task</button>
</r-box>

<script>
    var dataObject = {

        task: '',
        todo: ['Job1', 'Job2'],
        addList: ()=>{
          return dataObject.todo.map((td)=> {
            return `<li>${td}</li>`;
          }).join('')
        },
        clickHandler : () => {
            dataObject.todo.push(dataObject.task);
            dataObject.task = '';
            dataObject.todo = dataObject.todo;
        }
    };
    
</script>
<script src='https://cdn.jsdelivr.net/gh/ranjanngc/r-box/dist/r-box.v0.0.1.min.js'></script>
```
See example  - https://codepen.io/RanjanKr/pen/ExEwpvP
# CDN
## Minified
```
<script src='https://cdn.jsdelivr.net/gh/ranjanngc/r-box/dist/r-box.v0.0.1.min.js'></script>
```
## Dev
```
<script src='https://cdn.jsdelivr.net/gh/ranjanngc/r-box/src/r-box.js'></script>
```
# Build
```
npx uglify-js src/r-box.js -o dist/r-box.v0.0.1.min.js -c -m
```
# License
MIT