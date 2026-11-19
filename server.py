from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import webbrowser, threading
PORT=8000
URL=f"http://127.0.0.1:{PORT}/"
def open_browser():
    webbrowser.open(URL)
threading.Timer(0.8, open_browser).start()
print(f"Demo disponible en {URL}  |  Ctrl+C para cerrar")
ThreadingHTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler).serve_forever()
