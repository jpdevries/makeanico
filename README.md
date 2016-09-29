Makeanico
========

Makeanico is a progressively enhanced web app that allows anyone to create a 16x16 favicon.ico graphic.

## 10K Apart
*Makeanico was originally created as a submission for the 2016 10K Apart&nbsp;competition.*  

The "base" functionality of Makeanico is the ability to create a 16x16 favicon and export it in .ico, .svg and .png formats. This base functionality is achieved with an initial load of less than 10kB. Approximately 2kB of CSS styles are used to graphically enhance the experience for sighted users. This is done by styling a semantic HTML `<table>` of `<input type="checkbox">` elements to create a "WYSIWYG" graphics&nbsp;editor.

For example, here is the 10K Apart Favicon as represented by the Makeanico WYSIWYG&nbsp;Editor:  
![](http://j4p.us/0e3a472y0c2Y/10k-favicon-source.png)

Here is the same editor without any CSS&nbsp;styles:  
![](http://j4p.us/402b0n0u2I1n/Screen%20Shot%202016-09-29%20at%2011.51.27%20PM.png)

Without the WYSIYG CSS styles we lose that "what you see is what you get" feature but powered by semantic HTML the raw experience is as functional with or without styles.

### History Support
History is supported in both the base and enhanced experiences. The HTML5 History API is used to leverage Undo, Save, Bookmark, and Share features by pushing the graphic state to the URL. As you update your favicon the URL is updated accordingly by pushing the pixel data into the URL as URL parameters. Therefore, each unique favicon naturally has its own unique URL! You can bookmark your favicon to return and work on it later. Use the browser back and forward buttons to navigate the timeline of your&nbsp;edits.

### Live Favicon Preview
With or without JavaScript, a preview of the most recent graphic state is displayed both as the favicon of the page and atop the Fill Selected Cells component. The JavaScript experience progressively enhances this by asynchronously updating the preview. As you work, you'll see colors changes and the preview live&nbsp;update!

### Accessibility
[Accessibility is water](https://modx.today/posts/2016/02/accessibility-is-water). We are all in need of and deserving of it. Working within the constraints of web standards, we construct our favicon editor from a semantic `<table>` of `<input type="checkbox>"` elements. With no expense, these elements inherit the implicit accessibility of native browser inputs. Each pixel or "cell" consists of an `<input type="checkbox>"` element and a corresponding label. These native elements provide keyboard focus, selection, and screen reader support along with compatibility with any assistive technology that integrate with native HTML `<form>`&nbsp;elements.

Our Fill Selected Cells component allows the user to input a color in several different ways. This presents convenience and accessibility to our users. Some users may prefer dictation and opt for the standard text input method. The text input accepts a hex color or standard CSS color name as input. In supported browsers, users will be presented with an option to use a colorpicker input. Finally, users can input or adjust colors using the RGB sliders.

For connivence a swatch component is lazy&ndash;loaded as needed. localStorage enabled users can save their frequently used colors for quick and easy access. Built upon a fieldset of radio inputs, the swatch panel leverages implicit accessibility.

The HTML5 datalist component is also used to enhance accessibility and usability. Once you set focus to the hex text input area a datalist component containing a list of CSS color names is lazy&ndash;loaded. Users in modern browsers that support the datalist component will get typeahead hints as they type in the hex input area. Browsers that do not support datalist will display a standard select component still allowing the user to chose between typing in a value or selecting one.

Users with localStorage enabled also are presented with Accessibility Preferences. At the `/preferences` page they will be presented with Legibility, Typeface, Contrast, Animation and Visibility components that allow them to manage related preferences. These preferences will be stored in `localStorage` and return visits will respond to user's preferences accordingly.

### Keyboard Friendly
Similar to accessibility, most of the keyboard considerations are provided by web standards and the browser. I didn't have to write any code for you to be able to easily jump around from cell to cell, input to input, or widget to widget. The semantics of the document provide that. Nevertheless, there are a few considerations and shortcuts I did make.

There are keyboard shortcuts for each of the selection tool buttons. Alt/Option + A will select all sells. Alt/Option + I will inverse the current selection. Alt/Option + D will deselect all cells. Mouse users can also click a cell and hold Alt/Option when clicking another cell to range select several cells. I do think additional keyboard considerations could be made but I'm waiting for more user testing and feedback before proceeding.

### Progressive Enhancement
The base functionality provided by the raw HTML layer is enhanced by CSS styles and JavaScript features respectively. CSS provides a WYSIWYG editor and a nice layout. JavaScript is used to provide asynchronous enhancements. Without JavaScript, the form must post to the server to update the state and fill the selected cells with the chosen color. Progressive Enhancements remove this "hard reload" but updating the DOM asynchronously and pushing new state into the URL with the HTML5 History API. JavaScript is also used to make the Fill Selected Cells component more responsive. As the values of one input method are updated the others reflect the change. Typing "red" in the Hex input will update the colorpicker and RGB sliders, and vice versa.

### Service Workers
A lightweight service worker is used to provide offline support and increase performance. Users not receiving scripts will still need to post to the server, but users receiving scripts should be able to go offline and keep making their favicon.

### Bandwidth Considerations  
Accessibility isn't just about color contrast and screen reader support. In an attempt to allow access to anyone, an accessible experience weeds out barriers to entry. Page weight is a barrier to entry, so we do what we can to keep the weight down and leverage the browser cache for the assets we do load.

One page experiences like MakeanIco can increase their PageSpeed score by inlining critical CSS and small scripts. However, we don't inline our enhancements. To do so would not leverage the browser cache effectively. Loading enhancements through HTTP requests allows them to be cached across all the URL endpoints of the application (of which there are many – each icon has its own URL).

### ARIA Considerations
ARIA is salt. So we use it sparingly and only as needed. I'd rather add seasoning later after feedback and upon request. So much of the foundation is semantic HTML that little ARIA is used or needed. Accessibly hidden text is used to allow the HTML to be semantic and audible to assistive technology while still visually appealing and contextual to sighted users.
