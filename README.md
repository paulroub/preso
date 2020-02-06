# preso

preso is an [Express][express] web app for presenting HTML-based slide shows.

## Why does this exist?

It probably shouldn't, but I needed it. Well, _wanted_ it.

During a [conference presentation][cm2020] on Test-Driven Development, I wanted to show the progress of a demo project's tests while going through slides detailing the project's incremental development. I'd:

- Show a slide about a new failing test
- Jump to the terminal window, run the tests to see that failure
- Show the slide that fixed the test
- Jump to the terminal window and see the tests pass

This also gave me the option to jump to my editor and show the code *at that particular stage of its development* if there were any questions (or content I wished I'd included in the slide).

It worked like a charm. I mentioned that I'd added this complication to my presentation setup, instead of running Keynote like a sane person, and a few people asked to have a look. So here it is, mere inches past the "it works on my machine" mark.

## Installation

Make sure you have a reasonably-modern version of [Node.js][node], then run:

```sh
npm install
```

In this project's root directory.

## Configuration

If you're going to control the checkouts of a demo project, you'll need to tell the app where to find it. Copy the included `settings-example.js` to `settings.js` and update the value of `gitRoot` to match your demo working folder, for example:

```js
module.exports = {
    gitRoot: '/Users/proub/Dropbox/codemash/demo'
}
```

## Writing the Presentation

The presentation is loaded from `views/pres.liquid`. That file contains example slides showing where to place presenter notes vs. the actual slide content. An example from my actual presentation would be:

```html
<div class=slide data-sha="9164cb0370b16a2df0a4f27eac9a8ffa579fee9e">
    <div class=notes>
        <p>We'll separate the "time-to-words" portion from the "display the words" portion.</p>
        <p>For the moment, we can stop caring — <em>at all</em> — about the rest.</p>
        <p>No highlighting, none of the words <b>not</b> related to thetime.</p>
    </div>

    <div class=slidecontent>
        <h2>One thing at a time</h2>

        <p>Only test the time-to-words conversion for now, don't worry about the display.</p>

        <pre><code class=lang-js>
const time = '12:00:00';
const expected = [
    "it", "is", "twelve", "o'clock"
];

expect(clockwork.timeWords(time))
    .toStrictEqual(expected);
        </code></pre>
    </div>
</div>
```

The "notes" section is for the laptop in front of you. "slidecontent" is what will be displayed on your "main" window.

"data-sha" does the heavy lifting -- that tells the app to check out a specific commit (in your demo folder) whenever you view this slide.

Slide styles can be updated by editing `public/stylesheets/slide.scss`.

## Usage

```sh
npm start
```

Will launch the web server, running on http://localhost:3000/

Loading that page will give you a sanity check (confirming that we found your demo directory, that it's clean and free of uncommitted modifications, etc.). Click the "Begin presentation" link to load the first slide's notes and preview in the current window. A new tab (or window, depending on your browser config) will launch with the slide content. Drag that to your presentation screen, maximize, and off you go. You may need to configure your browser to hide toolbars, etc.

<figure>
    <img src=./i/presenter-view.png alt="Presenter view showing notes to the left, and a preview of the slide to the right">
    <figcaption>The Presenter View</figcaption>
</figure>

<figure>
    <img src=./i/slide-view.png alt="The presentation view, showing just the slide content, full-screen">
    <figcaption>The Presentation View</figcaption>
</figure>

## Contributing
Pull requests are welcome. Bug reports are welcome. Feature requests will be entertained if they seem like fun and I'm on a plane (or if it
seems like they'd lead to a blog post).

## Acknowledgements

While all of code is my fault, the idea of driving a presentation from simple HTML came from Eric Meyer's [S5][s5] project. A less-lazy man might have forked that, using one of the many far-superior-to-mine themes, etc. In my defense, I _was_, in fact, on a plane when I wrote most of this code.

## License
[MIT](https://choosealicense.com/licenses/mit/)

[express]: https://expressjs.com/
[node]: https://nodejs.org/
[cm2020]: https://roub.net/pres/codemash2020/
[s5]: https://meyerweb.com/eric/tools/s5/
