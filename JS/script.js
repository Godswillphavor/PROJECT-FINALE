document.addEventListener('DOMContentLoaded', () => {

  

    // Course Page Interactions
    const previewBtn = document.querySelector('.preview-btn');


  

    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            // Show preview modal or redirect to preview page
            alert('Preview feature coming soon!');
        });
    }

    // Hamburger/Sidebar logic for mobile nav (from landing page)
    const hamburger = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('mobile-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    function openSidebar() {
        sidebar.classList.add('open');
        sidebarBackdrop.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        sidebar.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebarFn() {
        sidebar.classList.remove('open');
        sidebarBackdrop.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    if (hamburger && sidebar && closeSidebar && sidebarBackdrop) {
        hamburger.addEventListener('click', openSidebar);
        closeSidebar.addEventListener('click', closeSidebarFn);
        sidebarBackdrop.addEventListener('click', closeSidebarFn);
        // Close sidebar on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebarFn();
            }
        });
        // Close sidebar when a link is clicked
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeSidebarFn);
        });
    }

    // --- Dynamic Profile Menu for Mobile Sidebar ---
    const profileDropdown = document.querySelector('.profile-dropdown');
    const mobileSidebar = document.getElementById('mobile-sidebar');

    if (profileDropdown && mobileSidebar) {
        const profileHeader = profileDropdown.querySelector('.profile-header');
        const profileMenu = profileDropdown.querySelector('.profile-menu');

        if (profileHeader && profileMenu) {
            const sidebarProfileSection = document.createElement('div');
            sidebarProfileSection.className = 'sidebar-profile-section'; // for styling

            const clonedHeader = profileHeader.cloneNode(true);
            const clonedMenu = profileMenu.cloneNode(true);

            // Add the cloned header and menu to the section
            sidebarProfileSection.appendChild(clonedHeader);
            sidebarProfileSection.appendChild(clonedMenu);

            // Append the new section to the sidebar
            mobileSidebar.appendChild(sidebarProfileSection);
             // Insert the profile section before the "Explore Courses" button
             const exploreButton = mobileSidebar.querySelector('.explore-courses-btn');
             if (exploreButton) {
                 mobileSidebar.insertBefore(sidebarProfileSection, exploreButton.nextSibling);
             } else {
                 mobileSidebar.appendChild(sidebarProfileSection);
             }
        }
    }


});



firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Get user info
    const name = user.displayName || "Anonymous";
    // const role = "Student"; // You can fetch this from Firestore later if needed
    const img = user.photoURL || "images/default.jpg";

    // Update UI with Firebase user data
    document.getElementById("username").textContent = name;
    // document.getElementById("user-role").textContent = role;
    document.getElementById("nav-profile-img").src = img;
    document.getElementById("dropdown-profile-img").src = img;
  } else {
    // Optionally reset UI or show default
    document.getElementById("username").textContent = "Guest";
    document.getElementById("user-role").textContent = "Not logged in";
    document.getElementById("nav-profile-img").src = "images/default.jpg";
    document.getElementById("dropdown-profile-img").src = "images/default.jpg";
  }
});



// function togglePassword() {
//     const passwordField = document.getElementById('password');
//     const toggleIcon = document.querySelector('.password-toggle');
    
//     if (passwordField.type === 'password') {
//         passwordField.type = 'text';
//         toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
//     } else {
//         passwordField.type = 'password';
//         toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
//     }
// }
  




      