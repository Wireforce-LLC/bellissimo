vcl 4.1;

backend default {
    .host = "nginx";
    .port = "80";
}

sub vcl_recv {
    if (req.method == "GET" && !req.url ~ "^/api/") {
        # Set the cache key prefix to the client IP address
        set req.http.cache-key = client.ip;

        # Set the cache timeout to 12 seconds
        set req.http.cache-ttl = "12s";
    } else {
        # Don't cache requests to /api/*
        set req.http.cache-control = "no-cache";
    }
}

sub vcl_backend_response {
    # Adjust the cacheability of the response based on the request type
    if (bereq.method == "GET") {
        # Tell Varnish to cache the response for 12 seconds
        set beresp.ttl = 12s;
    } else {
        # Don't cache responses for non-GET requests
        set beresp.uncacheable = true;
    }
}