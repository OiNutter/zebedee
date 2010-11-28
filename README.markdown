zebedee
=========

Zebedee is an accordion widget for use on multiple platforms.  The intention is to build three versions.  
one using [Scriptaculous 1.8](http://script.aculo.us), one using [Scripty2](http://scripty2.com) and one using [zepto](http://zeptojs.org)

Usage
-----

To use zebedee simply add the required combination of libraries to your page

* Scriptaculous - Prototype 1.7,Scriptaculous 1.8,zebedee-scriptaculous
* Scripty2 - Prototype 1.7, Scripty2, zebedee-s2
* Zepto - Zepto,zebedee-zepto

Set up your accordion as follows:

	<div id="container">
		<h1 class="zebedee-handle">Block 1</h1>
		<div class="zebedee-content">
			Content 1
		</div>
		<h1 class="zebedee-handle">Block 2</h1>
		<div class="zebedee-content">
			Content 2
		</div>
		<h1 class="zebedee-handle">Block 3</h1>
		<div class="zebedee-content">
			Content 3
		</div>
	</div>

then call

	var zebedee = new zebedee('container');

You will need to add the following styles to your css `zebedee-handle`, `zebedee-active` and `zebedee-content`.  These can be overridden in 
the options.

Options
-------

Zebedee has the following configurable options:

* classNames
	+ handle \- `'zebedee-handle'`
	+ handleActive \- `'zebedee-active'`
	+ content \- `'zebedee-content'` 
* duration \- `1`
* transition \- `'ease-out'`
* trigger \- `'touchend'`

Notes
-----

Currently only the zepto version had been written and it's still very much in the beta stage.  Any tips/suggestions/constructive criticism 
would be greatly received 