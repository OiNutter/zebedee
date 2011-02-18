zebedee
=========

Zebedee is an accordion widget for use with various frameorks.  Currently there are versions for [Scriptaculous](http://script.aculo.us), [Scripty2](http://scripty2.com), 
[zepto](http://zeptojs.com) and [emile](https://github.com/madrobby/emile).   

Usage
-----

To use zebedee simply add the required combination of libraries to your page

* Scriptaculous - Prototype 1.7,Scriptaculous 1.8,scriptaculous/zebedee
* Scripty2 - Prototype 1.7, Scripty2, scripty2/zebedee
* zepto - zepto,zepto/zebedee
* emile - emile,emile/zebedee,(emile/zeb-transitions, if you want the extra transition functions)

Set up your accordion as follows:

	<div id="container">
		<h1 class="zebedee-handle">Block 1</h1>
		<div class="zebedee-content">
			<div>
				Content 1
			</div>
		</div>
		<h1 class="zebedee-handle">Block 2</h1>
		<div class="zebedee-content">
			<div>
				Content 2
			</div>
		</div>
		<h1 class="zebedee-handle">Block 3</h1>
		<div class="zebedee-content">
			<div>
				Content 3
			</div>
		</div>
	</div>

then call

	var zbd = new zebedee('container');

You will need to add the following styles to your css `zebedee-handle`, `zebedee-active` and `zebedee-content`.  These can be overridden in 
the options.  The extra nested helps smooth the animations in scriptaculous.

Options
-------

Zebedee has the following configurable options:

* classNames
	+ handle \- `'zebedee-handle'`
	+ handleActive \- `'zebedee-active'`
	+ content \- `'zebedee-content'` 
* duration \- `1`
* transition \- `'ease-out'` | `'sinoidal'` (The defaults and valid options depend on which library version you are using.  See the version notes below for more details)
* trigger \- `'touchend'`

Versions
--------

### Scriptaculous ###
The scriptaculuos version is using Prototype 1.7 and Scriptaculous 1.9.  I've kept the code much the same as the zepto version, but replaced the anim() calls with Effect.Scale.
I've also used some of Prototype's built in utility functions to keep my code base down and avoid repeating things.  However I have kept my _merge function rather than using 
Object.extend as my version only overwrites the final variables, rather than whole branches.

The transition option takes any valid [Effect.Transitions](http://madrobby.github.com/scriptaculous/effect-transitions/) type from Scriptaculous.  Just use the last part eg. sinoidal, linear.

### Scripty 2 ###
The scripty2 version is using the latest version from the repository as of 18/02/2011, although should work fine with the latest beta release.  For the most part it is the same as the
scriptaculous version, with the exception of the animation functions.  I've added an internal function to get the transition type, so that it will use Css transitions where available. 

If using the javascript transitions it will support any of the [S2.FX.Transitions](http://scripty2.com/doc/scripty2%20fx/s2/fx/transitions.html) types.  If you are wanting to take advantage of the Css transitions only linear and sinusoidal are currently
supported.  Scripty2 will fall back to using the Javascript if your chosen transition isn't supported. Again just use the last part eg. sinusoidal.

### Zepto ###
The zepto version of zebedee uses Thomas Fuchs' lightweight, mobile targeting, [zepto](http://zeptojs.org) library.  I'm primarily taking 
advantage of the dom functions and the chaining to keep my code down.  The event functions also came in handy for dealing with the toggling 
of the accordion blocks.

Because this is using zepto and I'm intending it for the Mobile, Webkit based browsers, I was able to take advantage of the `anim()` function
in zepto and use css3 animations for the opening and closing of the content blocks.

The transition option takes valid [CSS3 transition](http://www.w3.org/TR/css3-transitions/#transition-timing-function) types.

### Emile ###
The emile version uses Thomas Fuchs' basic animation framework emile.  Because emile is purely an animation framework there are no helper functions, so I had to go back to basics
for a lot of the code, and add a few css helper functions, which were borrowed from zepto.

Included with the main file are 2 basic transition types, sinusoidal and linear.  If you want the full range to match scripty2 include the zeb-transitions.js file.  These functions 
are taken from Scripty2's UI Class, which in turn is based on Robert Penner's original AS2 [easing equations](http://www.robertpenner.com/easing/).

Transition options are the same as for the Scripty2 version.

Notes
-----

In case anybody's wondering why these are all using Thomas Fuchs' frameworks, the answer is very simple.  I started off using scriptaculous, with prototype, and through keeping an eye
on it's development, heard about the other frameworks, which is why they were first on my list to develop for.  Now that they are completed I'll be starting to look into doing versions
for other frameworks, including jQuery and MooTools.  If anybody has any frameworks they'd like to see a version for, either drop me a line, or feel free to fork the repo and add it yourself.

I'm using a custom attribute to store the original height of the content blocks before they're shrunk to use the animation. I've called this data-zebheight so it should be allowed by the HTML5 spec when that gets implemented.  Until then, unless 
a better solution presents itself, it's something I'm going to have to live with. 

Zebedee is still very much in the beta stage so any tips/suggestions/constructive criticism would be greatly received. 