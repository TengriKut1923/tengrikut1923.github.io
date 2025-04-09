        function toggleImage() {
            const img = document.getElementById('middleImage');
            const icon = document.getElementById('toggleIcon');
            const button = document.querySelector('.toggle-button');

            if (img.style.display === 'none' || img.style.display === '') {
                img.style.display = 'block';
                icon.className = 'fa-solid fa-toggle-off';
                button.classList.add('toggle-button-expanded');
            } else {
                img.style.display = 'none';
                icon.className = 'fa-solid fa-toggle-on';
                button.classList.remove('toggle-button-expanded');
            }
        }