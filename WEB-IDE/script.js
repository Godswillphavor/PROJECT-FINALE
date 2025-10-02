// Default code templates
const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Preview</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Edit the code and click Run to see changes.</p>
</body>
</html>`;

const defaultCSS = `body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

h1 {
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
}

p {
    font-size: 18px;
    line-height: 1.6;
    text-align: center;
}`;

const defaultJS = `// Try some JavaScript!
console.log('Hello from the IDE!');

// Add interactivity
document.addEventListener('DOMContentLoaded', function() {
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', function() {
            this.style.transform = this.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
    }
});`;

// Toast functionality
class Toast {
    static show(title, description, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-description">${description}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }
}

// WebIDE Class
class WebIDE {
    constructor() {
        this.html = defaultHTML;
        this.css = defaultCSS;
        this.js = defaultJS;
        this.activeTab = 'html';
        this.iframeRef = null;
        this.editors = {};
        this.currentTheme = 'vs-dark';
        this.themes = ['vs-dark', 'vs-light', 'hc-black'];
        this.themeIndex = 0;
        this.consoleOutput = [];
        
        this.init();
    }
    
    async init() {
        // Wait for Monaco Editor to load
        await this.waitForMonaco();
        this.render();
        this.attachEventListeners();
        this.initializeEditors();
        this.runCode(); // Auto-run on mount
    }
    
    waitForMonaco() {
        return new Promise((resolve) => {
            if (window.monaco) {
                resolve();
            } else {
                const checkMonaco = setInterval(() => {
                    if (window.monaco) {
                        clearInterval(checkMonaco);
                        resolve();
                    }
                }, 100);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkMonaco);
                    console.error('Monaco Editor failed to load');
                    Toast.show("Editor Error", "Monaco Editor failed to load. Please refresh the page.", "error");
                    resolve(); // Continue anyway
                }, 10000);
            }
        });
    }
    
    render() {
        const container = document.getElementById('web-ide');
        container.innerHTML = `
            <div class="w-full max-w-7xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Code Editor Panel -->
                    <div class="card">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-semibold">Code Editor</h2>
                            <div class="flex gap-2">
                                <button id="theme-btn" class="btn btn-outline btn-sm" title="Switch Theme">
                                    <i data-lucide="palette" class="icon mr-1"></i>
                                    Theme
                                </button>
                                <button id="run-btn" class="btn btn-success btn-sm">
                                    <i data-lucide="play" class="icon mr-1"></i>
                                    Run
                                </button>
                                <button id="reset-btn" class="btn btn-outline btn-sm">
                                    <i data-lucide="rotate-ccw" class="icon mr-1"></i>
                                    Reset
                                </button>
                                <button id="copy-btn" class="btn btn-outline btn-sm">
                                    <i data-lucide="copy" class="icon mr-1"></i>
                                    Copy
                                </button>
                                <button id="download-btn" class="btn btn-outline btn-sm">
                                    <i data-lucide="download" class="icon mr-1"></i>
                                    Download
                                </button>
                            </div>
                        </div>

                        <div class="tabs">
                            <div class="tabs-list">
                                <button class="tabs-trigger active" data-tab="html">HTML</button>
                                <button class="tabs-trigger" data-tab="css">CSS</button>
                                <button class="tabs-trigger" data-tab="js">JavaScript</button>
                            </div>

                            <div id="html-content" class="tabs-content">
                                <div id="html-editor" class="monaco-editor-container"></div>
                            </div>

                            <div id="css-content" class="tabs-content hidden">
                                <div id="css-editor" class="monaco-editor-container"></div>
                            </div>

                            <div id="js-content" class="tabs-content hidden">
                                <div id="js-editor" class="monaco-editor-container"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Preview Panel -->
                    <div class="card">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-semibold">Live Preview</h2>
                            <div class="text-sm text-gray-500">Click "Run" to see your changes</div>
                        </div>

                        <div class="border rounded-md overflow-hidden bg-white">
                            <iframe id="preview-iframe" class="w-full h-96" title="Code Preview" sandbox="allow-scripts allow-same-origin"></iframe>
                        </div>
                    </div>

                    <!-- Console Panel -->
                    <div class="card mt-4">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-semibold">Console Output</h2>
                            <button id="clear-console-btn" class="btn btn-outline btn-sm">
                                <i data-lucide="trash-2" class="icon mr-1"></i>
                                Clear
                            </button>
                        </div>
                        <div id="console-output" class="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-32 overflow-y-auto">
                            <div class="text-gray-500">Console output will appear here...</div>
                        </div>
                    </div>
                </div>

                <!-- Usage Instructions -->
                <div class="card mt-6">
                    <h3 class="text-lg font-semibold mb-3">How to Use</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h4 class="font-medium text-blue-600 mb-2">1. Edit Code</h4>
                            <p class="text-gray-600">
                                Switch between HTML, CSS, and JavaScript tabs to edit your code. The editor supports syntax highlighting,
                                autocomplete, and IntelliSense just like VSCode!
                            </p>
                        </div>
                        <div>
                            <h4 class="font-medium text-green-600 mb-2">2. Run & Preview</h4>
                            <p class="text-gray-600">
                                Click the "Run" button to execute your code and see the live preview. Changes appear instantly in the
                                preview panel.
                            </p>
                        </div>
                        <div>
                            <h4 class="font-medium text-purple-600 mb-2">3. Save & Share</h4>
                            <p class="text-gray-600">
                                Use "Copy" to share your code or "Download" to save it as an HTML file. "Reset" restores the default
                                example.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
        
        // Store references
        this.iframeRef = document.getElementById('preview-iframe');
    }
    
    initializeEditors() {
        // Configure Monaco Editor theme and options
        const editorOptions = {
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            cursorStyle: 'line',
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            contextmenu: true,
            quickSuggestions: {
                other: true,
                comments: true,
                strings: true
            },
            // Enhanced syntax highlighting features
            bracketPairColorization: { enabled: true },
            guides: {
                bracketPairs: true,
                indentation: true,
                highlightActiveIndentation: true
            },
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            // Syntax highlighting specific options
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            renderLineHighlight: 'all',
            // Enhanced autocomplete
            suggest: {
                showKeywords: true,
                showSnippets: true,
                showClasses: true,
                showFunctions: true,
                showVariables: true,
                showModules: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showWords: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumsMembers: true,
                showTypeParameters: true
            }
        };

        try {
            // Initialize HTML Editor with enhanced syntax highlighting
            this.editors.html = monaco.editor.create(document.getElementById('html-editor'), {
                ...editorOptions,
                value: this.html,
                language: 'html',
                suggest: {
                    showKeywords: true,
                    showSnippets: true,
                    showClasses: true,
                    showFunctions: true,
                    showVariables: true,
                    showTags: true,
                    showAttributes: true,
                    showValues: true
                }
            });

            // Initialize CSS Editor with enhanced syntax highlighting
            this.editors.css = monaco.editor.create(document.getElementById('css-editor'), {
                ...editorOptions,
                value: this.css,
                language: 'css',
                suggest: {
                    showProperties: true,
                    showValues: true,
                    showPseudoClasses: true,
                    showPseudoElements: true,
                    showUnits: true,
                    showColors: true,
                    showFunctions: true
                }
            });

            // Initialize JavaScript Editor with enhanced syntax highlighting
            this.editors.js = monaco.editor.create(document.getElementById('js-editor'), {
                ...editorOptions,
                value: this.js,
                language: 'javascript',
                suggest: {
                    showKeywords: true,
                    showSnippets: true,
                    showClasses: true,
                    showFunctions: true,
                    showVariables: true,
                    showModules: true,
                    showProperties: true,
                    showValues: true
                }
            });

            // Set up change listeners
            this.editors.html.onDidChangeModelContent(() => {
                this.html = this.editors.html.getValue();
            });

            this.editors.css.onDidChangeModelContent(() => {
                this.css = this.editors.css.getValue();
            });

            this.editors.js.onDidChangeModelContent(() => {
                this.js = this.editors.js.getValue();
            });

            // Add keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Force layout update to ensure proper rendering
            setTimeout(() => {
                this.editors.html.layout();
                this.editors.css.layout();
                this.editors.js.layout();
            }, 100);

        } catch (error) {
            console.error('Error initializing Monaco Editor:', error);
            Toast.show("Editor Error", "Failed to initialize code editor. Please refresh the page.", "error");
        }
    }

    setupKeyboardShortcuts() {
        // Ctrl/Cmd + S to run code
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.runCode();
            }
            // Ctrl/Cmd + Shift + R to reset
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.resetCode();
            }
            // Ctrl/Cmd + Shift + C to clear console
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.clearConsole();
            }
            // Ctrl/Cmd + Shift + T to switch themes
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                document.getElementById('theme-btn').click();
            }
        });
    }
    
    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.tabs-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Button actions
        document.getElementById('run-btn').addEventListener('click', () => this.runCode());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetCode());
        document.getElementById('copy-btn').addEventListener('click', () => this.copyCode());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadCode());

        // Theme switching
        document.getElementById('theme-btn').addEventListener('click', () => {
            this.currentTheme = this.themes[this.themeIndex];
            this.themeIndex = (this.themeIndex + 1) % this.themes.length;
            
            // Update all editors with new theme
            if (this.editors.html) {
                this.editors.html.updateOptions({ theme: this.currentTheme });
            }
            if (this.editors.css) {
                this.editors.css.updateOptions({ theme: this.currentTheme });
            }
            if (this.editors.js) {
                this.editors.js.updateOptions({ theme: this.currentTheme });
            }
            
            // Update button tooltip
            const themeBtn = document.getElementById('theme-btn');
            themeBtn.title = `Switch Theme (${this.currentTheme})`;
            
            // Show toast notification
            Toast.show("Theme Changed", `Switched to ${this.currentTheme} theme`, "info");
        });

        // Console clear button
        document.getElementById('clear-console-btn').addEventListener('click', () => {
            this.clearConsole();
        });
    }

    // Console functionality
    addToConsole(message, level = 'log') {
        const consoleOutput = document.getElementById('console-output');
        const line = document.createElement('div');
        line.className = 'console-line mb-1';
        
        const time = document.createElement('span');
        time.className = 'console-timestamp text-gray-500 mr-2';
        time.textContent = new Date().toLocaleTimeString();
        
        const text = document.createElement('span');
        text.className = `console-${level}`;
        text.textContent = Array.isArray(message) ? message.join(' ') : message;
        
        line.appendChild(time);
        line.appendChild(text);
        consoleOutput.appendChild(line);
        
        // Keep only last 50 lines for performance
        const lines = consoleOutput.children;
        if (lines.length > 50) {
            consoleOutput.removeChild(lines[0]);
        }
        
        // Auto-scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    clearConsole() {
        const consoleOutput = document.getElementById('console-output');
        consoleOutput.innerHTML = '<div class="text-gray-500">Console cleared...</div>';
        this.consoleOutput = [];
    }
    
    switchTab(tabName) {
        // Update active tab
        this.activeTab = tabName;
        
        // Update tab triggers
        document.querySelectorAll('.tabs-trigger').forEach(trigger => {
            trigger.classList.remove('active');
            if (trigger.dataset.tab === tabName) {
                trigger.classList.add('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tabs-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeContent = document.getElementById(`${tabName}-content`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        // Trigger Monaco Editor resize to fix layout issues
        if (this.editors[tabName]) {
            setTimeout(() => {
                this.editors[tabName].layout();
            }, 100);
        }
    }
    
    runCode() {
        if (!this.iframeRef) return;
        
        // Clear console before running new code
        this.clearConsole();
        this.addToConsole('Running code...', 'info');
        
        const combinedCode = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Code Preview</title>
                <style>${this.css}</style>
            </head>
            <body>
                ${this.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<!DOCTYPE[^>]*>/gi, "")}
                <script>
                    // Override console methods to capture output
                    const originalConsole = {
                        log: console.log,
                        error: console.error,
                        warn: console.warn,
                        info: console.info
                    };
                    
                    // Send console output to parent window
                    function sendToParent(level, ...args) {
                        if (window.parent && window.parent.postMessage) {
                            window.parent.postMessage({
                                type: 'console',
                                level: level,
                                message: args.map(arg => String(arg)).join(' ')
                            }, '*');
                        }
                    }
                    
                    // Override console methods
                    console.log = (...args) => {
                        originalConsole.log.apply(console, args);
                        sendToParent('log', ...args);
                    };
                    
                    console.error = (...args) => {
                        originalConsole.error.apply(console, args);
                        sendToParent('error', ...args);
                    };
                    
                    console.warn = (...args) => {
                        originalConsole.warn.apply(console, args);
                        sendToParent('warn', ...args);
                    };
                    
                    console.info = (...args) => {
                        originalConsole.info.apply(console, args);
                        sendToParent('info', ...args);
                    };
                    
                    try {
                        ${this.js}
                    } catch (error) {
                        console.error('JavaScript Error:', error);
                        document.body.innerHTML += '<div style="background: #ff4444; color: white; padding: 10px; margin: 10px; border-radius: 4px;">JavaScript Error: ' + error.message + '</div>';
                    }
                </script>
            </body>
            </html>
        `;
        
        const blob = new Blob([combinedCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        this.iframeRef.src = url;
        
        // Listen for console messages from iframe
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'console') {
                this.addToConsole(event.data.message, event.data.level);
            }
        });
    }
    
    resetCode() {
        this.html = defaultHTML;
        this.css = defaultCSS;
        this.js = defaultJS;
        
        // Update editors
        this.editors.html.setValue(this.html);
        this.editors.css.setValue(this.css);
        this.editors.js.setValue(this.js);
        
        Toast.show("Code Reset", "All code has been reset to default values.", "success");
    }
    
    copyCode() {
        const allCode = `HTML:\n${this.html}\n\nCSS:\n${this.css}\n\nJavaScript:\n${this.js}`;
        navigator.clipboard.writeText(allCode).then(() => {
            Toast.show("Code Copied", "All code has been copied to clipboard.", "success");
        }).catch(() => {
            Toast.show("Copy Failed", "Failed to copy code to clipboard.", "error");
        });
    }
    
    downloadCode() {
        const combinedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Code</title>
    <style>
${this.css}
    </style>
</head>
<body>
${this.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<!DOCTYPE[^>]*>/gi, "")}
    <script>
${this.js}
    </script>
</body>
</html>`;
        
        const blob = new Blob([combinedCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-code.html";
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the WebIDE when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebIDE();
});
