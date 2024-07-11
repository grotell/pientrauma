document.addEventListener("DOMContentLoaded", function() {
    function getTopmostParentG(element) {
        while (element.parentNode) {
            element = element.parentNode;
            if (element.tagName.toLowerCase() === 'g') {
                return element;
            }
        }
        return null; // If no parent <g> element is found
    }

    const paths = document.querySelectorAll('svg path');

    paths.forEach(path => {
        const topmostParentG = getTopmostParentG(path);
        if (topmostParentG) {
            topmostParentG.dataset.originalFill = topmostParentG.style.fill || '';
            topmostParentG.querySelectorAll('*').forEach(child => {
                child.dataset.originalFill = child.style.fill || '';
            });
        }

        // Hover effects
        path.addEventListener('mouseover', function() {
            const topmostParentG = getTopmostParentG(this);
            if (topmostParentG) {
                topmostParentG.style.fill = '#ff0000';
                topmostParentG.querySelectorAll('*').forEach(child => {
                    child.style.fill = '#ff0000';
                });
            }
        });

        path.addEventListener('mouseout', function() {
            const topmostParentG = getTopmostParentG(this);
            if (topmostParentG) {
                topmostParentG.style.fill = topmostParentG.dataset.originalFill;
                topmostParentG.querySelectorAll('*').forEach(child => {
                    child.style.fill = child.dataset.originalFill;
                });
            }
        });

        // Modified SVG click event to load content into 'toc-container'
        path.addEventListener('click', function() {
            const topmostParentG = getTopmostParentG(this);
            if (topmostParentG) {
                const label = topmostParentG.getAttribute('inkscape:label');
                if (label) {
                    loadMarkdownToTocContainer(label);
                    emptyMarkdownToInfoContainer();
                }
            }
        });
    });

    // Function to load content into 'toc-container'
    function loadMarkdownToTocContainer(filename) {
        let filenameLowerCase = filename.toLowerCase().replace(/\s/g, '');
        fetch('./ohjeet/' + filenameLowerCase + '.md')
            .then(response => response.text())
            .then(text => {
                const tocContainer = document.querySelector('.toc-container');
                tocContainer.innerHTML = '<div class="markdown-body">' + marked.parse(text) + '</div>';
                attachButtonListeners();
            })
            .catch(error => console.error('Error loading the Markdown file:', error));
    }

    // Function to attach event listeners to buttons within the 'toc-container'
    function attachButtonListeners() {
        const buttons = document.querySelectorAll('.toc-container button'); // Assuming buttons are within .toc-container
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Load content into '.info-container' based on button ID
                loadMarkdownToInfoContainer(this.id);

                // Change clicked button class to 'red-button'
                this.className = 'red-button';

                // Change all other buttons to 'green-button', excluding the clicked one
                buttons.forEach(otherButton => {
                    if (otherButton !== this) { // Check if it's not the clicked button
                        otherButton.className = 'green-button';
                    }
                });
            });
        });
    }

    // Function to attach event listeners to buttons within the 'info-container'
    function attachInfoContainerButtonListeners() {
        const buttons = document.querySelectorAll('.info-container button'); // Assuming buttons are within .info-container
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Load content into '.info-container' based on button ID
                loadMarkdownToInfoContainer(this.id);

                // Change clicked button class to 'red-button'
                this.className = 'red-button';

                // Change all other buttons to 'green-button', excluding the clicked one
                buttons.forEach(otherButton => {
                    if (otherButton !== this) { // Check if it's not the clicked button
                        otherButton.className = 'green-button';
                    }
                });
            });
        });
    }

    // Function to load content into '.info-container' based on button clicks
    function loadMarkdownToInfoContainer(filename) {
        let filenameLowerCase = filename.toLowerCase().replace(/\s/g, '');
        fetch('./ohjeet/' + filenameLowerCase + '.md')
            .then(response => response.text())
            .then(text => {
                const infoContainer = document.querySelector('.info-container');
                infoContainer.innerHTML = '<div class="markdown-body">' + marked.parse(text) + '</div>';
                attachInfoContainerButtonListeners(); // Ensure new buttons also get listeners
            })
            .catch(error => console.error('Error loading the Markdown file:', error));
    }

    // Function to empty the '.info-container'
    function emptyMarkdownToInfoContainer() {
        const infoContainer = document.querySelector('.info-container');
        infoContainer.innerHTML = '<div class="markdown-body"> </div>';
    }
});
