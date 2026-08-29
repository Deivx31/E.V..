const CACHE_NAME = "ev-cache-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];


self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(ARCHIVOS)
                )

        );

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    nombres => {

                        return Promise.all(

                            nombres.map(
                                nombre => {

                                    if (
                                        nombre !== CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            nombre
                                        );

                                    }

                                }
                            )

                        );

                    }
                )

        );

        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                respuesta => {

                    return (
                        respuesta
                        ||
                        fetch(event.request)
                    );

                }
            )

        );

    }
);


self.addEventListener(
    "push",
    event => {

        let datos = {

            title: "E.V.",
            body: "Tienes un recordatorio."

        };


        if (event.data) {

            try {

                datos =
                    event.data.json();

            } catch {

                datos.body =
                    event.data.text();

            }

        }


        event.waitUntil(

            self.registration.showNotification(

                datos.title,

                {
                    body: datos.body,
                    icon: "icons/icon-192.png",
                    badge: "icons/icon-192.png"
                }

            )

        );

    }
);


self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();


        event.waitUntil(

            clients.openWindow(
                "./"
            )

        );

    }
);
