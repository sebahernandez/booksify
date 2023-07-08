const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition);
};

const fetchPage = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const [, data] = text.match(/<body[^>]*>([\s\S]+)<\/body>/i);
  return data;
};

export const startViewTransition = () => {
  if (!checkIsNavigationSupported()) return;

  window.navigation.addEventListener("navigate", (event) => {
    // Añade el parámetro 'event' a la función
    console.log(event.destination.url);
    const toUrl = new URL(event.destination.url);

    if (location.origin !== toUrl.origin) return;

    event.intercept({
      async handler() {
        const data = await fetchPage(toUrl.pathname);
        console.log(data);
        // api view transition
        document.startViewTransition(() => {
          // cómo se debe actualizar la vista
          document.body.innerHTML = data;
          document.documentElement.scrollTop = 0;
        });
      },
    });
  });
};
