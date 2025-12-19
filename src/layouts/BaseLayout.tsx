import { html } from 'hono/html'

export const BaseLayout = (props: { title: string; children: any; lang: string }) => {
  return html`
    <!DOCTYPE html>
    <html lang="${props.lang}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title} | athomev2</title>
        <link rel="stylesheet" href="/static/css/style.css" />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script>
          // Dark mode support
          if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark')
          }
        </script>
      </head>
      <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        <header class="p-4 border-b dark:border-gray-800">
          <nav class="container mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold"><a href="/">athomev2</a></h1>
            <div class="flex items-center space-x-6">
              <div class="space-x-4">
                <a href="/" class="hover:text-blue-500">Home</a>
                <a href="/admin" class="hover:text-blue-500">Admin</a>
              </div>
              <div class="flex border rounded overflow-hidden dark:border-gray-700">
                <button 
                  hx-post="/set-lang/en" 
                  hx-target="body" 
                  hx-push-url="true"
                  class="px-2 py-1 text-xs ${props.lang === 'en' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
                >EN</button>
                <button 
                  hx-post="/set-lang/de" 
                  hx-target="body" 
                  hx-push-url="true"
                  class="px-2 py-1 text-xs ${props.lang === 'de' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
                >DE</button>
              </div>
            </div>
          </nav>
        </header>
        <main class="container mx-auto p-4">
          ${props.children}
        </main>
      </body>
    </html>
  `
}