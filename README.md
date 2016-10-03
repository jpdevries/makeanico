Makeanico
========

Makeanico is a progressively enhanced web app that allows anyone to create a 16x16 favicon.ico graphic. You can access it by [waking the sleeping&nbsp;dino](https://makeanico.herokuapp.com) or [firing up the Azure instance](https://makeanico.azurewebsites.net).

## 10K Apart
*Makeanico was originally created as a submission for the 2016 10K Apart&nbsp;competition.*  

The "base" functionality of Makeanico is the ability to create a 16x16 favicon and export it in .ico, .svg and .png formats. This base functionality is achieved with an initial load of less than 10kB. Approximately 2kB of CSS styles are used to graphically enhance the experience for sighted users. This is done by styling a semantic HTML `<table>` of `<input type="checkbox">` elements to create a "WYSIWYG" graphics&nbsp;editor.

For example, [here is the 10K Apart Favicon as represented by the Makeanico WYSIWYG&nbsp;Editor](https://makeanico.azurewebsites.net/icos/10kapart):  

<figure>
  <a href="https://makeanico.azurewebsites.net/icos/10kapart"><img src="http://j4p.us/0e3a472y0c2Y/10k-favicon-source.png"></a>
  <caption>10kapart favicon loaded into Makeanico art&ndash;board</caption>
</figure>


<br>Without the WYSIYG CSS styles we lose that "what you see is what you get" feature but powered by semantic HTML the raw experience is as functional with or without&nbsp;styles.

### Weigh In
*Run `npm start` to run the server in production mode with GZIP and minification&nbsp;enabled.*  

In accordance with the [Rules & Regulations](https://a-k-apart.com/faq) of the competition Makeanico keeps initial page weight under 10kB. I use the Chrome Developer Tools to get an idea of the page weight. Safari and Firefox seem to display uncompressed file sizes even though GZIP compressions is in fact being&nbsp;used.

| Name         | Size (GZIP)      |
| ------------ |:----------------:|
| index.html   | 5.7kB            |
| main.min.css | 2.3kB            |
| **TOTAL**    | **8.0kB**        |

That's the initial load. If you include `init.min.js` which is lazy-loaded right off the bat for users whose scripts can cut the mustard then we're&nbsp;at:

| Name         | Size (GZIP)      |
| ------------ |:----------------:|
| index.html   | 5.7kB            |
| main.min.css | 2.3kB            |
| init.min.js  | 1.7kB            |
| **TOTAL**    | **9.7kB**        |

*Note: Sizes include header weight*

Again, it is my understanding that given that the init script is only loaded as needed (if it passes the `doEnhancments` test) than in doesn't count. But I want to demonstrate that even if it does I calculate the weigh in at under&nbsp;10kB.

```html
<script>
  var doEnhancments = document.addEventListener ? true : false;
  if(doEnhancments) document.write('<script id="scripts__init" src="/assets/js/init.min.js"><\/script>');
</script>
```

The favicon.png, which is not included in the weight, weighs 266 bytes in Finder. So even if you count that it is still under 10kB! The service worker, which is loaded `if 'serviceWorker' in navigator` weighs 324 bytes GZIPed. I don't think the weight of lazily loaded service workers counts though&hellip;

Once a user begins interacting with the art&ndash;board or choosing a fill color enhancements are loaded as needed. These include&nbsp;the:
 - live preview
 - export
 - keyboard shortcut
 - swatches
 - accessibility preferences

Some Enhancements are fetched for "dirty" art&ndash;boards. If there is art on the canvas, editing enhancements are loaded. Since the app has previously been visited, these assets are likely loaded from cache by the browser cache or the service worker. Any dirty artboard is not the initial page load so it is ok for these pages to creep above&nbsp;10kB.

The more pixels you draw, the longer your URL gets, and the larger the size of the `index.html` gets too! That's ok though because only the "blank canvas" homepage counts as the initial load. Pretty much everything except the HTML source is going to be served by the browser cache if possible. Even the HTML source itself of return visits is cached offline by the service worker. This means that not only can page visits weight 0.0kB but also that JavaScipt users performing asynchronous actions that don't need to communicate with the server (import, export, post) can enjoy an offline editing&nbsp;experience.

The larger initial page weights of lazy&ndash;URLs I have counted to dirty art&ndash;boards are over 10kB. That's with the service worker and browser cache off and includes the initial weight plus all the lazy&ndash;loaded enhancements. To reproduce this [visit a dirty art&ndash;board with every color filled](https://makeanico.azurewebsites.net/?c0=0x663399ff&c1=0x663399ff&c2=0x663399ff&c3=0x663399ff&c4=0x663399ff&c5=0x663399ff&c6=0x663399ff&c7=0x663399ff&c8=0x663399ff&c9=0x663399ff&c10=0x663399ff&c11=0x663399ff&c12=0x663399ff&c13=0x663399ff&c14=0x663399ff&c15=0x663399ff&c16=0x663399ff&c17=0x663399ff&c18=0x663399ff&c19=0x663399ff&c20=0x663399ff&c21=0x663399ff&c22=0x663399ff&c23=0x663399ff&c24=0x663399ff&c25=0x663399ff&c26=0x663399ff&c27=0x663399ff&c28=0x663399ff&c29=0x663399ff&c30=0x663399ff&c31=0x663399ff&c32=0x663399ff&c33=0x663399ff&c34=0x663399ff&c35=0x663399ff&c36=0x663399ff&c37=0x663399ff&c38=0x663399ff&c39=0x663399ff&c40=0x663399ff&c41=0x663399ff&c42=0x663399ff&c43=0x663399ff&c44=0x663399ff&c45=0x663399ff&c46=0x663399ff&c47=0x663399ff&c48=0x663399ff&c49=0x663399ff&c50=0x663399ff&c51=0x663399ff&c52=0x663399ff&c53=0x663399ff&c54=0x663399ff&c55=0x663399ff&c56=0x663399ff&c57=0x663399ff&c58=0x663399ff&c59=0x663399ff&c60=0x663399ff&c61=0x663399ff&c62=0x663399ff&c63=0x663399ff&c64=0x663399ff&c65=0x663399ff&c66=0x663399ff&c67=0x663399ff&c68=0x663399ff&c69=0x663399ff&c70=0x663399ff&c71=0x663399ff&c72=0x663399ff&c73=0x663399ff&c74=0x663399ff&c75=0x663399ff&c76=0x663399ff&c77=0x663399ff&c78=0x663399ff&c79=0x663399ff&c80=0x663399ff&c81=0x663399ff&c82=0x663399ff&c83=0x663399ff&c84=0x663399ff&c85=0x663399ff&c86=0x663399ff&c87=0x663399ff&c88=0x663399ff&c89=0x663399ff&c90=0x663399ff&c91=0x663399ff&c92=0x663399ff&c93=0x663399ff&c94=0x663399ff&c95=0x663399ff&c96=0x663399ff&c97=0x663399ff&c98=0x663399ff&c99=0x663399ff&c100=0x663399ff&c101=0x663399ff&c102=0x663399ff&c103=0x663399ff&c104=0x663399ff&c105=0x663399ff&c106=0x663399ff&c107=0x663399ff&c108=0x663399ff&c109=0x663399ff&c110=0x663399ff&c111=0x663399ff&c112=0x663399ff&c113=0x663399ff&c114=0x663399ff&c115=0x663399ff&c116=0x663399ff&c117=0x663399ff&c118=0x663399ff&c119=0x663399ff&c120=0x663399ff&c121=0x663399ff&c122=0x663399ff&c123=0x663399ff&c124=0x663399ff&c125=0x663399ff&c126=0x663399ff&c127=0x663399ff&c128=0x663399ff&c129=0x663399ff&c130=0x663399ff&c131=0x663399ff&c132=0x663399ff&c133=0x663399ff&c134=0x663399ff&c135=0x663399ff&c136=0x663399ff&c137=0x663399ff&c138=0x663399ff&c139=0x663399ff&c140=0x663399ff&c141=0x663399ff&c142=0x663399ff&c143=0x663399ff&c144=0x663399ff&c145=0x663399ff&c146=0x663399ff&c147=0x663399ff&c148=0x663399ff&c149=0x663399ff&c150=0x663399ff&c151=0x663399ff&c152=0x663399ff&c153=0x663399ff&c154=0x663399ff&c155=0x663399ff&c156=0x663399ff&c157=0x663399ff&c158=0x663399ff&c159=0x663399ff&c160=0x663399ff&c161=0x663399ff&c162=0x663399ff&c163=0x663399ff&c164=0x663399ff&c165=0x663399ff&c166=0x663399ff&c167=0x663399ff&c168=0x663399ff&c169=0x663399ff&c170=0x663399ff&c171=0x663399ff&c172=0x663399ff&c173=0x663399ff&c174=0x663399ff&c175=0x663399ff&c176=0x663399ff&c177=0x663399ff&c178=0x663399ff&c179=0x663399ff&c180=0x663399ff&c181=0x663399ff&c182=0x663399ff&c183=0x663399ff&c184=0x663399ff&c185=0x663399ff&c186=0x663399ff&c187=0x663399ff&c188=0x663399ff&c189=0x663399ff&c190=0x663399ff&c191=0x663399ff&c192=0x663399ff&c193=0x663399ff&c194=0x663399ff&c195=0x663399ff&c196=0x663399ff&c197=0x663399ff&c198=0x663399ff&c199=0x663399ff&c200=0x663399ff&c201=0x663399ff&c202=0x663399ff&c203=0x663399ff&c204=0x663399ff&c205=0x663399ff&c206=0x663399ff&c207=0x663399ff&c208=0x663399ff&c209=0x663399ff&c210=0x663399ff&c211=0x663399ff&c212=0x663399ff&c213=0x663399ff&c214=0x663399ff&c215=0x663399ff&c216=0x663399ff&c217=0x663399ff&c218=0x663399ff&c219=0x663399ff&c220=0x663399ff&c221=0x663399ff&c222=0x663399ff&c223=0x663399ff&c224=0x663399ff&c225=0x663399ff&c226=0x663399ff&c227=0x663399ff&c228=0x663399ff&c229=0x663399ff&c230=0x663399ff&c231=0x663399ff&c232=0x663399ff&c233=0x663399ff&c234=0x663399ff&c235=0x663399ff&c236=0x663399ff&c237=0x663399ff&c238=0x663399ff&c239=0x663399ff&c240=0x663399ff&c241=0x663399ff&c242=0x663399ff&c243=0x663399ff&c244=0x663399ff&c245=0x663399ff&c246=0x663399ff&c247=0x663399ff&c248=0x663399ff&c249=0x663399ff&c250=0x663399ff&c251=0x663399ff&c252=0x663399ff&c253=0x663399ff&c254=0x663399ff&c255=0x663399ff).

You can also reproduce this by importing a photo with edge&ndash;to&ndash;edge to color. From a mobile device snap a photo to import your art to the art&ndash;board. 

The Accessibility Preferences are lazy loaded in `localStorage` capable environments. They lazily add about 730 bytes of CSS and 1.6kB of scripts if `localStorage` dictates they should be loaded. For example, if the Font Size preference is changed from the default value, a little CSS and some scripts will lazily be loaded to update the user interface is response to user preferences. You can also choose a typeface like OpenDyslexic and Fira. Of course the web fonts are heavy and lazily loaded only if requested by the&nbsp;user.

### History Support
History is supported in both the base and enhanced experiences. The HTML5 History API is used to leverage Undo, Save, Bookmark, and Share features by pushing the graphic state to the URL. As you update your favicon the URL is updated accordingly by pushing the pixel data into the URL as URL parameters. Therefore, each unique favicon naturally has its own unique URL! You can bookmark your favicon to return and work on it later. Use the browser back and forward buttons to navigate the timeline of your&nbsp;edits.

### Live Favicon Preview
With or without JavaScript, a preview of the most recent graphic state is displayed both as the favicon of the page and atop the Fill Selected Cells component. The JavaScript experience progressively enhances this by asynchronously updating the preview. As you work, you'll see colors changes and the preview live&nbsp;update! This is done by using inline SVG to create the at scale previews. These SVGs are wrapped in an `<a download>` so clicking them will download the current artwork as an&nbsp;SVG.

The favicon of the page itself is also asynchronously updated! So in browsers that support dynamic favicons, you'll see your edits reflected there as&nbsp;well.

### Accessibility
[Accessibility is water](https://modx.today/posts/2016/02/accessibility-is-water). We are all in need of and deserving of it. Working within the constraints of web standards, we construct our favicon editor from a semantic `<table>` of `<input type="checkbox">` elements. With no additional expense, these elements inherit the implicit accessibility of native browser inputs. Each pixel or "cell" consists of an `<input type="checkbox>"` element and a corresponding label. These native elements provide keyboard focus, selection, and screen reader support along with compatibility with any assistive technology that integrate with native HTML `<form>`&nbsp;elements.

Our Fill Selected Cells component allows the user to input a color in several different ways. This presents convenience and accessibility to our users. Some users may prefer dictation and opt for the standard text input method. The text input accepts a hex color or standard CSS color name as input. In supported browsers, users will be presented with an option to use a colorpicker input. Finally, users can input or adjust colors using the RGB&nbsp;sliders.

For connivence a swatch component is lazy&ndash;loaded as needed. localStorage enabled users can save their frequently used colors for quick and easy access. Built upon a fieldset of radio inputs, the swatch panel leverages implicit&nbsp;accessibility.

The HTML5 datalist component is also used to enhance accessibility and usability. Once you set focus to the hex text input area a datalist component containing a list of CSS color names is lazy&ndash;loaded. Users in modern browsers that support the datalist component will get typeahead hints as they type in the hex input area. **Browsers that do not support datalist will display a standard select component still allowing the user to chose between typing in a value or selecting&nbsp;one**.

### Accessibility Preferences
Users with localStorage enabled also are presented with Accessibility Preferences. At the `/preferences` page they will be presented with Legibility, Typeface, Contrast, Animation and Visibility components that allow them to manage related preferences. These preferences will be stored in `localStorage` and return visits will respond to user's preferences&nbsp;accordingly.

![](http://j4p.us/2w051H3o2D08/prefs.gif)

### Import
One of the thing I discovered through this process is that accessibility is a universal topic. It isn't just about screen readers and HTML. Accessibility applies to everything. I consider the import features not just power user features but accessibility features as well. They allow people to access their art quicker if they already have something prepared that they would like to import. This makes for a less fatiguing user&nbsp;experience.

Aside from the API, there are two ways to import art to the art&ndash;board.

 1. Upload a SVG or PNG image
 2. Use the PhotoShop ExtendScript

Both of these methods perform similar tasks. They take a graphic, size it down, crop it to 16x16, loop over each pixel, and direct you to the appropriate URL for your&nbsp;art.

With the Photoshop ExtendScript you can import the active Photoshop document. Open your art in Photoshop. Open [makeanico.jsx](https://github.com/jpdevries/makeanico/blob/master/assets/js/extendscript/makeanico.jsx) in the [Adobe ExtendScript toolkit](https://www.adobe.com/products/extendscript-toolkit.html) and run the&nbsp;script.

*Pro Tip: By slightly altering the script, entire directories can be imported which is how the World&ndash;Wide Favicons were&nbsp;imported.*

### Keyboard Friendly
Similar to accessibility, most of the keyboard considerations are provided by web standards and the browser. I didn't have to write any code for you to be able to easily jump around from cell to cell, input to input, or widget to widget. The semantics of the document provide that. Nevertheless, there are a few considerations and shortcuts I did&nbsp;make.

There are keyboard shortcuts for each of the selection tool buttons. Alt/Option + A will select all sells. Alt/Option + I will inverse the current selection. Alt/Option + D will deselect all cells. Mouse users can also click a cell and hold Alt/Option when clicking another cell to range select several cells. I do think additional keyboard considerations could be made but I'm waiting for more user testing and feedback before&nbsp;proceeding.

### Progressive Enhancement
The base functionality provided by the raw HTML layer is enhanced by CSS styles and JavaScript features respectively. CSS provides a WYSIWYG editor and a nice layout. JavaScript is used to provide asynchronous enhancements. Without JavaScript, the form must post to the server to update the state and fill the selected cells with the chosen color. Progressive Enhancements remove this "hard reload" but updating the DOM asynchronously and pushing new state into the URL with the HTML5 History API. JavaScript is also used to make the Fill Selected Cells component more responsive. As the values of one input method are updated the others reflect the change. Typing "red" in the Hex input will update the colorpicker and RGB sliders, and vice&nbsp;versa.

![](http://j4p.us/3j1H3f2w2p09/fill_progress.gif)

### Service Workers
A lightweight service worker is used to provide offline support and increase performance. Users not receiving scripts will still need to post to the server, but users receiving scripts should be able to go offline and keep making their&nbsp;favicon.

### Bandwidth Considerations  
Accessibility isn't just about color contrast and screen reader support. In an attempt to allow access to anyone, an accessible experience weeds out barriers to entry. Page weight is a barrier to entry, so we do what we can to keep the weight down and leverage the browser cache for the assets we do&nbsp;load.

One page experiences like MakeanIco can increase their PageSpeed score by inlining critical CSS and small scripts. However, we don't inline our enhancements. To do so would not leverage the browser cache effectively. Loading enhancements through HTTP requests allows them to be cached across all the URL endpoints of the application (of which there are many – each icon has its own&nbsp;URL).

### ARIA Considerations
ARIA is salt. So we use it sparingly and only as needed. I'd rather add seasoning later after feedback and upon request. So much of the foundation is semantic HTML that little ARIA is used or needed. Accessibly hidden text is used to allow the HTML to be semantic and audible to assistive technology while still visually appealing and contextual to sighted&nbsp;users.

## API
Any icon's art is contained in the URL. Each cell, or pixel, is represented as a URL parameter. The web app uses the trendy new 8 Digit Hexadecimals to store color so to draw an icon where the first pixel is 50% red you'd use `/?c1=0xff000080`. Each cell has a numeric index starting from `c1` and ending in `c255`. The value should be a 6 or 8 digit hexadecimal starting in `0x` not&nbsp;`#`.

URL parameters can be used to set the initial color input type as well as the initial fill color. For example, `?fill=0x00ffff0c&colorby=rgba`. These defaults will not override an values found in the users&nbsp;`localStorage`.

There are `/make/favicon.svg`, `/make/favicon.png`, and `/make/favicon.ico` endpoints that can be used to load a dynamic favicon graphics in the requested format. For example `/make/favicon.svg?c23=0x0cFF00FFFF` or `/make/favicon.png?c23=0x0cFF00FFFF&dl=1` for an immediate&nbsp;download.


### World&ndash;Wide Favicon Flags
In the spirit of the World&ndash;Wide Web, MakeanIco provides a public API for favicons of each country&nbsp;flag.

**Endpoints:**  

| Flag | Country Code        | Edit Page           | SVG Icon  | PNG Icon  | ICO Icon  |
| ------------- | ------------- |:--------------|-------|-------|-------|
| <a href="https://makeanico.azurewebsites.net/icos/flags/nl"><img src="https://makeanico.azurewebsites.net/get/svg/icos/flags/nl?dl=1"></a> | `nl`      | `/icos/flags/nl` | `/get/svg/icos/flags/nl` | `/get/png/icos/flags/nl` | `/get/ico/icos/flags/nl` |
| <a href="https://makeanico.azurewebsites.net/icos/flags/us"><img src="https://makeanico.azurewebsites.net/get/svg/icos/flags/us?dl=1"></a> | `us`      | `/icos/flags/us` | `/get/svg/icos/flags/us` | `/get/png/icos/flags/us` | `/get/ico/icos/flags/us` |

[Find national flags for every country in the&nbsp;Wiki](https://github.com/jpdevries/makeanico/wiki/World-Wide-Flag-Favicons).

*Note: To trigger an icon to be downloaded add a `&dl=1` URL parameter to the `get/svg`, `get/png`, or `get/ico`&nbsp;request.*

### Brands and Icons

I've added endpoints for some of my favorite favicons. Follow the links in the icon column to navigate to the edit screen of your favorite&nbsp;icons.

| Icon | Edit Page           | SVG Icon  | PNG Icon  | ICO Icon  |
| ------------- |:---------------|:------|:------|:------|
| <a href="https://makeanico.azurewebsites.net/icos/modmore"><img src="https://makeanico.azurewebsites.net/get/svg/icos/modmore"></a> |  `/icos/modmore` | `/get/svg/icos/modmore` | `/get/png/modmore` | `/get/ico/modmore` |
| <a href="https://makeanico.azurewebsites.net/icos/thinkful"><img src="https://makeanico.azurewebsites.net/get/svg/icos/thinkful"></a> |  `/icos/thinkful` | `/get/svg/icos/thinkful` | `/get/png/thinkful` | `/get/ico/thinkful` |
| <a href="https://makeanico.azurewebsites.net/icos/sterc"><img src="https://makeanico.azurewebsites.net/get/svg/icos/sterc"></a> |  `/icos/sterc` | `/get/svg/icos/sterc` | `/get/png/sterc` | `/get/ico/sterc` |
| <a href="https://makeanico.azurewebsites.net/icos/modx"><img src="https://makeanico.azurewebsites.net/get/svg/icos/modx"></a> |  `/icos/modx` | `/get/svg/icos/modx` | `/get/png/modx` | `/get/ico/modx` |
| <a href="https://makeanico.azurewebsites.net/icos/apple"><img src="https://makeanico.azurewebsites.net/get/svg/icos/apple"></a> |  `/icos/apple` | `/get/svg/icos/apple` | `/get/png/apple` | `/get/ico/apple` |
| <a href="https://makeanico.azurewebsites.net/icos/safari"><img src="https://makeanico.azurewebsites.net/get/svg/icos/safari"></a> |  `/icos/safari` | `/get/svg/icos/safari` | `/get/png/safari` | `/get/ico/safari` |
| <a href="https://makeanico.azurewebsites.net/icos/10kapart"><img src="https://makeanico.azurewebsites.net/get/svg/icos/10kapart"></a> |  `/icos/10kapart` | `/get/svg/icos/10kapart` | `/get/png/10kapart` | `/get/ico/10kapart` |
| <a href="https://makeanico.azurewebsites.net/icos/microsoft"><img src="https://makeanico.azurewebsites.net/get/svg/icos/windows"></a> |  `/icos/microsoft` | `/get/svg/icos/microsoft` | `/get/png/microsoft` | `/get/ico/microsoft` |
| <a href="https://makeanico.azurewebsites.net/icos/windows"><img src="https://makeanico.azurewebsites.net/get/svg/icos/windows"></a> |  `/icos/windows` | `/get/svg/icos/windows` | `/get/png/windows` | `/get/ico/windows` |
| <a href="https://makeanico.azurewebsites.net/icos/edge"><img src="https://makeanico.azurewebsites.net/get/svg/icos/windows"></a> |  `/icos/edge` | `/get/svg/icos/edge` | `/get/png/edge` | `/get/ico/edge` |
| <a href="https://makeanico.azurewebsites.net/icos/google"><img src="https://makeanico.azurewebsites.net/get/svg/icos/google"></a> |  `/icos/google` | `/get/svg/icos/google` | `/get/png/google` | `/get/ico/google` |
| <a href="https://makeanico.azurewebsites.net/icos/chrome"><img src="https://makeanico.azurewebsites.net/get/svg/icos/chrome"></a> |  `/icos/chrome` | `/get/svg/icos/chrome` | `/get/png/chrome` | `/get/ico/chrome` |
| <a href="https://makeanico.azurewebsites.net/icos/opera"><img src="https://makeanico.azurewebsites.net/get/svg/icos/opera"></a> |  `/icos/opera` | `/get/svg/icos/opera` | `/get/png/opera` | `/get/ico/opera` |
| <a href="https://makeanico.azurewebsites.net/icos/vivaldi"><img src="https://makeanico.azurewebsites.net/get/svg/icos/vivaldi"></a> |  `/icos/vivaldi` | `/get/svg/icos/vivaldi` | `/get/png/vivaldi` | `/get/ico/vivaldi` |
| <a href="https://makeanico.azurewebsites.net/icos/facebook"><img src="https://makeanico.azurewebsites.net/get/svg/icos/facebook"></a> |  
`/icos/facebook` | `/get/svg/icos/facebook` | `/get/png/facebook` | `/get/ico/facebook` |
| <a href="https://makeanico.azurewebsites.net/icos/twitter"><img src="https://makeanico.azurewebsites.net/get/svg/icos/twitter"></a> |  `/icos/twitter` | `/get/svg/icos/twitter` | `/get/png/twitter` | `/get/ico/twitter` |
| <a href="https://makeanico.azurewebsites.net/icos/smashingmag"><img src="https://makeanico.azurewebsites.net/get/svg/icos/smashingmag"></a> |  `/icos/smashingmag` | `/get/svg/icos/smashingmag` | `/get/png/smashingmag` | `/get/ico/smashingmag` |
| <a href="https://makeanico.azurewebsites.net/icos/gmail"><img src="https://makeanico.azurewebsites.net/get/svg/icos/gmail"></a> |  `/icos/gmail` | `/get/svg/icos/gmail` | `/get/png/gmail` | `/get/ico/gmail` |
| <a href="https://makeanico.azurewebsites.net/icos/firefox"><img src="https://makeanico.azurewebsites.net/get/svg/icos/firefox"></a> |  `/icos/firefox` | `/get/svg/icos/firefox` | `/get/png/firefox` | `/get/ico/firefox` |
| <a href="https://makeanico.azurewebsites.net/icos/mozilla"><img src="https://makeanico.azurewebsites.net/get/svg/icos/mozilla"></a> |  `/icos/mozilla` | `/get/svg/icos/mozilla` | `/get/png/mozilla` | `/get/ico/mozilla` |
| <a href="https://makeanico.azurewebsites.net/icos/zeldman"><img src="https://makeanico.azurewebsites.net/get/svg/icos/zeldman"></a> |  `/icos/zeldman` | `/get/svg/icos/zeldman` | `/get/png/zeldman` | `/get/ico/zeldman` |
| <a href="https://makeanico.azurewebsites.net/icos/w3c"><img src="https://makeanico.azurewebsites.net/get/svg/icos/w3c"></a> |  `/icos/w3c` | `/get/svg/icos/w3c` | `/get/png/w3c` | `/get/ico/w3c` |

## Accessibility Proclaimer
This web app strives for WCAG 2.0 Guidelines Level AA. Please [open an issue](https://github.com/jpdevries/makeanico/issues/new) for any accessibility issue, feedback, or&nbsp;concern.



