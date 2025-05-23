export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
if (isLoading) {
  btn.textContent = loadingText;
  console.log(`Setting text to ${loadingText}`);
} else {
  btn.textContent = defaultText;
}
}