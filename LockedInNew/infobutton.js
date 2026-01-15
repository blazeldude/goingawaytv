window.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('dialog[closedby="any"]');
  const openButton = document.querySelector('#any-btn');
  const closeButton = dialog.querySelector('.close');

  // Open the dialog
  openButton.addEventListener('click', () => {
    dialog.showModal();
  });

  // Close with the close button
  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  // Close by clicking outside the dialog content
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) { // click on backdrop
      dialog.close();
    }
  });
});