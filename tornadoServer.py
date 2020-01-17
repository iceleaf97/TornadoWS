
import platform
import os
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.websocket


if platform.system() == "Windows":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


# class HelloHandler(tornado.web.RequestHandler):
#     def get(self):
#         self.write("Hello, world!")

class RenderHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("orientDevice.html")

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    connections = set()
   
    def open(self):
        self.connections.add(self)
        print("ws connected!")
        

    def on_message(self, message):
        [client.write_message(message) for client in self.connections]
        print(message)

    def on_close(self):
        print("ws closed")

application = tornado.web.Application(
    [
    # (r"/", HelloHandler),
    (r"/", RenderHandler),
    (r"/ws", WebSocketHandler)
    ],
    debug = True,
    static_path = os.path.join(os.path.dirname(__file__), 'static')
)

http_server = tornado.httpserver.HTTPServer(application, ssl_options={
    "certfile": os.path.join(os.path.dirname(__file__), "crt_file"),
    "keyfile": os.path.join(os.path.dirname(__file__), "key_file"),
})


if __name__ == "__main__":
    
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()