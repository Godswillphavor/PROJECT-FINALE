# Web IDE - Vanilla JavaScript Version

This is a vanilla JavaScript, HTML, and CSS version of the original Next.js React Web IDE project. It maintains the exact same functionality, design, and user experience while using only standard web technologies.

## ✨ VSCode-like Features

Your Web IDE now includes **Monaco Editor** - the same editor that powers VSCode! This gives you:

### 🎨 **Syntax Highlighting**
- **HTML**: Tags, attributes, and values in different colors
- **CSS**: Properties, values, selectors, and pseudo-classes highlighted
- **JavaScript**: Keywords, functions, strings, and operators in distinct colors
- **Dark Theme**: Beautiful dark theme with high contrast

### 🚀 **IntelliSense & Autocomplete**
- **Smart Suggestions**: Context-aware code completion
- **HTML Tags**: Auto-complete for HTML elements and attributes
- **CSS Properties**: Complete CSS property and value suggestions
- **JavaScript**: Function, variable, and method autocomplete
- **Snippets**: Built-in code snippets for common patterns

### ⌨️ **Advanced Editor Features**
- **Bracket Pair Colorization**: Matching brackets in different colors
- **Indentation Guides**: Visual guides for code structure
- **Code Folding**: Collapse/expand code blocks
- **Multi-cursor Editing**: Edit multiple lines simultaneously
- **Find & Replace**: Search and replace text in code
- **Line Numbers**: Professional line numbering
- **Word Wrap**: Automatic line wrapping

### 🎯 **Developer Experience**
- **Console Output**: Real-time JavaScript console output
- **Error Detection**: Syntax error highlighting
- **Theme Switching**: Toggle between dark, light, and high contrast themes
- **Keyboard Shortcuts**: Professional IDE shortcuts

## Features

- **Code Editor**: Edit HTML, CSS, and JavaScript code in separate tabs with Monaco Editor
- **Live Preview**: See your code changes in real-time
- **Code Execution**: Run your code and see the results instantly
- **Code Management**: Copy, download, and reset your code
- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User-friendly feedback for actions
- **Console Panel**: View JavaScript console output and errors
- **Theme Support**: Multiple editor themes (Dark, Light, High Contrast)

## How to Use

1. **Edit Code**: Switch between HTML, CSS, and JavaScript tabs to edit your code
2. **Run & Preview**: Click the "Run" button to execute your code and see the live preview
3. **Save & Share**: Use "Copy" to share your code or "Download" to save it as an HTML file
4. **Reset**: Use "Reset" to restore the default example code
5. **Theme**: Click "Theme" to switch between different editor themes
6. **Console**: View JavaScript output and errors in the console panel

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Run code
- **Ctrl/Cmd + Shift + R**: Reset code
- **Ctrl/Cmd + Shift + C**: Clear console
- **Ctrl/Cmd + Shift + T**: Switch theme

## File Structure

```
web-ide-vanilla/
├── index.html          # Main HTML file with Monaco Editor integration
├── styles.css          # All CSS styles (replaces Tailwind CSS)
├── script.js           # JavaScript functionality with Monaco Editor
└── README.md           # This file
```

## Getting Started

1. **Download the files** to your local machine
2. **Open `index.html`** in your web browser
3. **Start coding!** The IDE will automatically load with example code

## Browser Compatibility

This project works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- HTML5 elements
- Clipboard API (for copy functionality)
- Monaco Editor (Chrome, Firefox, Safari, Edge)

## What Was Converted

### From React/Next.js to Vanilla JavaScript:
- **React Components** → JavaScript Classes
- **React Hooks** → JavaScript methods and properties
- **JSX** → HTML template strings
- **React State** → JavaScript object properties
- **Event Handlers** → DOM event listeners

### From Tailwind CSS to Custom CSS:
- **Utility Classes** → Custom CSS rules
- **Responsive Design** → Media queries
- **Component Styles** → CSS classes
- **Animations** → CSS keyframes

### Enhanced with Monaco Editor:
- **Basic Textareas** → Full-featured code editors
- **No Syntax Highlighting** → Professional syntax highlighting
- **No Autocomplete** → IntelliSense and autocomplete
- **No Error Detection** → Real-time error highlighting
- **Basic Editing** → Advanced code editing features

### Dependencies Removed:
- React and React DOM
- Next.js framework
- Tailwind CSS
- Radix UI components
- All npm packages

## Features Maintained

✅ **Exact same visual design**
✅ **All functionality preserved**
✅ **Responsive layout**
✅ **Code editing capabilities**
✅ **Live preview**
✅ **Toast notifications**
✅ **File download**
✅ **Code copying**
✅ **Tab switching**

## New VSCode-like Features

✅ **Professional code editor (Monaco Editor)**
✅ **Syntax highlighting for HTML, CSS, and JavaScript**
✅ **IntelliSense and autocomplete**
✅ **Error detection and highlighting**
✅ **Multiple editor themes**
✅ **Console output panel**
✅ **Advanced keyboard shortcuts**
✅ **Code folding and indentation guides**
✅ **Bracket pair colorization**
✅ **Multi-cursor editing**

## Performance Benefits

- **Smaller file size** (no framework overhead)
- **Faster loading** (no JavaScript bundle to parse)
- **Better caching** (static files)
- **No build process** required
- **Direct browser execution**
- **Professional editing experience**

## Customization

You can easily customize the project by:
- Modifying `styles.css` for design changes
- Updating `script.js` for functionality changes
- Adding new features in the WebIDE class
- Changing the default code examples
- Customizing Monaco Editor options
- Adding new editor themes

## License

This project is open source and available under the same license as the original project.
