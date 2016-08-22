Makeanico
========

Makeanico is a progressively enhanced web app that allows anyone to create a 16x16 favicon.ico graphic.

## 10K Apart
Makeanico was originally created as a submission for the 2016 10K Apart&nbsp;competition.  

The "base" functionality of Makeanico is the ability to create a 16x16 favicon and export it in .ico, .svg and .png formats. This base functionality is achieved with less than 5kb of HTML. Approximately 2kb of CSS styles are used to graphically enhance the experience for sited users. This is done by styling a semantic HTML `<table>` of `<input type="checkbox">` elements to create a "WYSIWYG" graphics&nbsp;editor.

For example, here is the 10K Apart Favicon as represented by the Makeanico WYSIWYG&nbsp;Editor:  
![](http://j4p.us/0e3a472y0c2Y/10k-favicon-source.png)

Here is the same editor without any CSS&nbsp;styles:  
![](http://j4p.us/0U3g0v1y0O3J/Screen%20Shot%202016-08-21%20at%203.16.42%20PM.png)

Without the WYSIYG CSS styles we lose that "what you see is what you get" feature but powered by semantic HTML the raw experience is as functional with or without styles to a non&ndash;sighted&nbsp;user.

### History Support
In both the base and enhanced experiences, the HTML5 History API is used to leverage Undo, Save, Bookmark, and Share features by pushing the graphic state to the URL. As you update your favicon the URL is updated accordingly by pushing the pixel data into the URL as URL parameters. Therefore, each unique favicon naturally has its own unique URL! You can bookmark your favicon to return and work on it later. Use the browser back and forward buttons to navigate the timeline of your&nbsp;edits.

### Live Favicon Preview
With or without JavaScript, a preview of the most recent graphic state is displayed both as the favicon of the page and atop the Fill Selected Cells component. The JavaScript experience progressively enhances this by asynchronously updating the preview. As you work, you'll see the preview live&nbsp;update!

### Accessibility
[Accessibility is water](https://modx.today/posts/2016/02/accessibility-is-water). We are all in need of and deserving of it. Working within the constraints of web standards, we construct our favicon editor from a semantic `<table>` of `<input type="checkbox>"` elements. With no expense, these elements inherit the implicit accessibility of native browser inputs. Each pixel or "cell" consists of an `<input type="checkbox>"` element and a corresponding label. These native elements provide keyboard focus, selection, and screen reader support along with compatibility with any assistive technology that integrate with native HTML `<form>`&nbsp;elements.

Our Fill Selected Cells component allows the user to input a color in several different ways. This presents convenience and accessibility to our users. Some users may prefer dictation and opt for the standard text input method. The text input accepts a hex color or standard CSS color name as input. In supported browsers, users will be presented with an option to use a colorpicker input. Finally, users can input or adjust colors using the RGB sliders.

### Progressive Enhancement
The base functionality provided by the raw HTML layer is enhanced by CSS styles and JavaScript features respectively. CSS provides a WYSIWYG editor and a nice layout. JavaScript is used to provide asynchronous enhancements. Without JavaScript, the form must post to the server to update the state and fill the selected cells with the chosen color. Progressive Enhancements remove this "hard reload" but updating the DOM asynchronously and pushing new state into the URL with the HTML5 History API. JavaScript is also used to make the Fill Selected Cells component more responsive. As the values of one input method are updated the others reflect the change. Typing "red" in the Hex input will update the colorpicker and RGB sliders, and vice versa.

### Bandwidth Considerations  
Accessibility isn't just about color contrast and screen reader support. In an attempt to allow access to anyone, an accessible experience weeds out barriers to entry. Page weight is a barrier to entry, so we do what we can to keep the weight down and leverage the browser cache for the assets we do load.

One page experiences like Makeanico can increase their PageSpeed score by inlining critical CSS and small scripts. However, we don't inline our 2KB of CSS or our 2KB of JS. To do so would not leverage the browser cache effectively. We set far future reaching expiry dates on our CSS and JavaScript files and change their file name by appending a version number to them when releasing updates. This ensures that we keep the data transferred to the user to a minimum even if it means a slight ding on our PageSpeed score.

### ARIA Considerations
ARIA is salt. So we use it sparingly and only as needed. The following ARIA considerations season a more screen reader friendly&nbsp;experience:
 - `aria-labeledby`
