<nav>
   <a if="{!this.parent.modal&&!this.parent.isError}" class="nav-menu settings" href="#" onclick="{showMenu}" oncontextmenu="{showMenu}">
      <img src="./assets/ico_settings.svg" alt="Settings" />
   </a>

   <a if="{this.parent.modal}" class="nav-menu close" href="#" onclick="{closeModal}">
      <img src="./assets/ico_close.svg" alt="Close" />
   </a>

   <a if="{this.parent.isError}" class="nav-menu close" href="#" onclick="{closeError}">
      <img src="./assets/ico_close.svg" alt="Close" />
   </a>

   <script>
      closeModal(e) {
         e.preventDefault();

         let hasExtension = modal.path.split('.').length > 1;
         if (hasExtension && !modal.i) {
            try {
               fs.unlinkSync(modal.image);
            } catch (err) {
               console.error(err)
            }
         }

         modal = false;
         this.parent.update();
      }

      showMenu() {
         menu.popup(remote.getCurrentWindow());
      }

      closeError() {
         isError = false;
         this.parent.update();
      }
   </script>
</nav>
