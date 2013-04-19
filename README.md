smart-touch
===========


Several months ago I tried to use [touch-punch](https://github.com/furf/jquery-ui-touch-punch/) with [nested-sortable](https://github.com/mjsarfatti/nestedSortable), it worked quite fine? but it was impossible to scroll or pinch with your fingers. So I've written smart-touch that works like touch-punch if you hold your finger down long enough (400ms default) and allows to scroll and pinch otherwise.

To use smart-touch include it in your HTML-files after jquery and jquery-ui, but before js-files that use it

```html
<script type="text/javascript" src="./scripts/jquery.1.9.js"></script> 
<script type="text/javascript" src="./scripts/jquery-ui-1.10.1.min.js"></script> 
<script type="text/javascript" src="./scripts/smarttouch.js"></script>
```

That's all, your html-page should reflect your touches correctly

Currently, it was tested only on Android (Acer Iconia A701)



