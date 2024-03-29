
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
       });
   
       document.querySelector('svg').addEventListener('click', function(event) {
           const topmostParentG = getTopmostParentG(event.target);
           const infoContainer = document.querySelector('.info-container');
           
           if (topmostParentG) {
               const label = topmostParentG.getAttribute('inkscape:label');
               if (label) {
                   infoContainer.textContent = "Clicked topmost parent group name: " + topmostParentG.id + ", Inkscape label: " + label;
                   loadMarkdownToInfoContainer(label);
               } else {
                   infoContainer.textContent = "Clicked topmost parent group name: " + topmostParentG.id + " (no Inkscape label)";
               }
           } else {
               infoContainer.textContent = "No parent group found.";
           }
       });
   
       // Revised function to handle dynamically loaded content
       function loadMarkdownToInfoContainer(filename) {
            let filenameLowerCase = filename.toLowerCase();
            fetch('./ohjeet/' + filenameLowerCase + '.md')
               .then(response => response.text())
               .then(text => {
                   const infoContainer = document.querySelector('.info-container');
                   infoContainer.innerHTML = '<div class="markdown-body">' + marked.parse(text) + '</div>';
                   
                   // Now attach event listeners to the dynamically loaded content
                   attachButtonListeners();
               })
               .catch(error => e.errconsolor('Error loading the Markdown file:', error));
       }
   
       // Function to attach event listeners to buttons within the dynamically loaded Markdown content
         function attachButtonListeners() {
            const buttons = document.querySelectorAll('.info-container button'); // Assuming buttons are within .info-container
            buttons.forEach(button => {
               button.addEventListener('click', function() {
                     // Alert the ID of the button that was clicked
                     loadMarkdownToInfoContainer(this.id);
               });
            });
         }
   
   });
