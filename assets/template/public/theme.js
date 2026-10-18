// Runs before first paint so there is no light flash. Dark is the designed
// default; light only when chosen. External file, so a CSP of script-src 'self' works.
try {
  document.documentElement.classList.toggle("dark", localStorage.getItem("__APP_KEY__-theme") !== "light")
} catch (e) {
  document.documentElement.classList.add("dark")
}
